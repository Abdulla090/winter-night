import { useState, useCallback, useRef } from 'react';
import { Platform } from 'react-native';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';

const GEMINI_API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY;

export function useVoiceInput(isKurdish) {
    const [isRecording, setIsRecording] = useState(false);
    const [isTranscribing, setIsTranscribing] = useState(false);
    const recordingRef = useRef(null);

    const startRecording = useCallback(async () => {
        try {
            const perm = await Audio.requestPermissionsAsync();
            if (perm.status !== 'granted') {
                console.warn('Audio permission denied');
                return;
            }

            if (Platform.OS !== 'web') {
                await Audio.setAudioModeAsync({
                    allowsRecordingIOS: true,
                    playsInSilentModeIOS: true,
                });
            }

            const { recording } = await Audio.Recording.createAsync(
                Audio.RecordingOptionsPresets.HIGH_QUALITY
            );
            recordingRef.current = recording;
            setIsRecording(true);
        } catch (err) {
            console.error('Failed to start recording', err);
        }
    }, []);

    const stopRecording = useCallback(async (onTranscribed) => {
        if (!recordingRef.current) return;
        setIsRecording(false);
        setIsTranscribing(true);

        try {
            await recordingRef.current.stopAndUnloadAsync();
            const uri = recordingRef.current.getURI();
            
            let base64str = '';
            if (Platform.OS === 'web') {
                const res = await window.fetch(uri);
                const blob = await res.blob();
                base64str = await new Promise((resolve) => {
                    const reader = new window.FileReader();
                    reader.onloadend = () => {
                        resolve(reader.result.split(',')[1]);
                    };
                    reader.readAsDataURL(blob);
                });
            } else {
                base64str = await FileSystem.readAsStringAsync(uri, {
                    encoding: 'base64',
                });
            }

            const mime = Platform.OS === 'ios' ? 'audio/mpeg' : 'audio/webm';

            const prompt = isKurdish 
                ? "This is spoken audio. Treat this as Kurdish. Transcribe exactly what is spoken. Return ONLY the transcription text, nothing else." 
                : "This is spoken audio. Treat this as English. Transcribe exactly what is spoken. Return ONLY the transcription text, nothing else.";

            const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;
            
            const response = await window.fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{
                        parts: [
                            { text: prompt },
                            { inline_data: { mime_type: mime, data: base64str } }
                        ]
                    }]
                })
            });

            if (response.ok) {
                const data = await response.json();
                const text = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "";
                if (text) {
                    onTranscribed(text);
                }
            } else {
                console.error("Gemini API Error", await response.text());
            }
        } catch (err) {
            console.error("Transcribe err", err);
        } finally {
            setIsTranscribing(false);
            recordingRef.current = null;
        }
    }, [isKurdish]);

    return { isRecording, isTranscribing, startRecording, stopRecording };
}
