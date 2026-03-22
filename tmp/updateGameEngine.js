const fs = require('fs');
const path = require('path');

const targetPath = path.resolve(__dirname, '../src/screens/FamilyFeud/gameEngine.js');
let fileContent = fs.readFileSync(targetPath, 'utf8');

const geminiCode = `

/**
 * Validate answer using exact/fuzzy match first, then Gemini 3.1 Flash Lite Preview 
 * because Kurdish words have extensive synonyms.
 */
const GEMINI_API_KEY = "AIzaSyAzmQae6ES7TIDGYbWQNVwFnpI63-BLxZ0";
const GEMINI_MODEL = "gemini-3.1-flash-lite-preview"; // EXACT match requested by user

export async function checkAnswerWithGemini(question, answerText) {
    if (!answerText || !question) return -1;
    const input = answerText.trim();
    if (input.length < 2) return -1;

    // 1. Fast local check (fuzzy + alts array)
    const localIdx = findAnswerOnBoard(question, input);
    if (localIdx !== -1) return localIdx;
    if (input.length < 3) return -1; // Don't send 2-letter non-matches to API

    // 2. Fallback to Gemini for meaning/synonym matching
    try {
        const answersList = question.answers.map((a, i) => \`\${i}: \${a.text} (alts: \${a.alts ? a.alts.join(', ') : ''})\`).join('\\n');
        
        const prompt = \`
You are an expert in the Kurdish language (Sorani). 
You are validating answers for a game show exactly like Family Feud (100 Pirs).
The question is: "\${question.question}"

Here are the valid answers on the board with their IDs:
\${answersList}

The user provided the answer: "\${input}"

In Kurdish, many words have the same meaning or can be said differently.
Is the user's answer logically equivalent to or a strong synonym for ANY of the valid answers above?
Consider Kurdish context, synonyms, and variations.
If it matches an answer, respond ONLY with the ID number of that matched answer.
If it absolutely does NOT match any of them, respond ONLY with "-1".
No explanation, no other text.
\`.trim();

        const url = \`https://generativelanguage.googleapis.com/v1beta/models/\${GEMINI_MODEL}:generateContent?key=\${GEMINI_API_KEY}\`;
        
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: {
                    temperature: 0.1,
                    maxOutputTokens: 5,
                }
            })
        });

        if (response.ok) {
            const data = await response.json();
            const rawOutput = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "";
            const matchedIdx = parseInt(rawOutput, 10);
            
            if (!isNaN(matchedIdx) && matchedIdx >= 0 && matchedIdx < question.answers.length) {
                return matchedIdx; // High-quality match found by Gemini!
            }
        }
    } catch (e) {
        console.warn("Gemini check error:", e);
    }
    
    return -1; // Default
}
`;

if (!fileContent.includes('checkAnswerWithGemini')) {
    fileContent += geminiCode;
    fs.writeFileSync(targetPath, fileContent, 'utf8');
    console.log('Appended checkAnswerWithGemini to gameEngine.js');
} else {
    console.log('checkAnswerWithGemini already exists.');
}
