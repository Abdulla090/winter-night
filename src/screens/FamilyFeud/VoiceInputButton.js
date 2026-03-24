import React from 'react';
import { TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { Mic, Square } from 'lucide-react-native';
import { useVoiceInput } from './useVoiceInput';

export default function VoiceInputButton({ isKurdish, onTranscribed }) {
    const { isRecording, isTranscribing, startRecording, stopRecording } = useVoiceInput(isKurdish);

    if (isTranscribing) {
        return (
            <TouchableOpacity style={[st.btn, { backgroundColor: '#475569' }]} disabled>
                <ActivityIndicator color="#FFF" size="small" />
            </TouchableOpacity>
        );
    }

    if (isRecording) {
        return (
            <TouchableOpacity style={[st.btn, { backgroundColor: '#EF4444' }]} onPress={() => stopRecording(onTranscribed)}>
                <Square size={20} color="#FFF" />
            </TouchableOpacity>
        );
    }

    return (
        <TouchableOpacity style={[st.btn, { backgroundColor: '#3B82F6' }]} onPress={startRecording}>
            <Mic size={20} color="#FFF" />
        </TouchableOpacity>
    );
}

const st = StyleSheet.create({
    btn: {
        width: 44,
        height: 44,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1.5,
        borderColor: 'rgba(255,255,255,0.15)',
        marginRight: 6
    }
});
