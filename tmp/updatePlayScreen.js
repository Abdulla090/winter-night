const fs = require('fs');
const path = require('path');

const targetPath = path.resolve(__dirname, '../src/screens/FamilyFeud/PlayScreen.js');
let fileContent = fs.readFileSync(targetPath, 'utf8');

// 1. imports
fileContent = fileContent.replace(
    'findAnswerOnBoard', 
    'findAnswerOnBoard, checkAnswerWithGemini'
);

// 2. Add isChecking state
fileContent = fileContent.replace(
    'const [cdActive, setCdActive] = useState(true);',
    'const [cdActive, setCdActive] = useState(true);\n    const [isChecking, setIsChecking] = useState(false);'
);

// 3. update submitAnswer to use checkAnswerWithGemini
const oldSubmit = `    const submitAnswer = () => {
        if (!input.trim()) return;
        const idx = findAnswerOnBoard(q, input);`;

const newSubmit = `    const submitAnswer = async () => {
        if (!input.trim() || isChecking) return;
        setIsChecking(true);
        const idx = await checkAnswerWithGemini(q, input);
        setIsChecking(false);`;

fileContent = fileContent.replace(oldSubmit, newSubmit);

// 4. Update the input field to show loading state or disable while checking
fileContent = fileContent.replace(
    'pointerEvents="none"',
    'pointerEvents="none"' // just checking if it exists
);

const oldInputRow = `<TextInput style={[st.inputBox, isKurdish && { textAlign: 'right', fontFamily: 'Rabar' }]}`;
const newInputRow = `<TextInput style={[st.inputBox, isKurdish && { textAlign: 'right', fontFamily: 'Rabar' }, isChecking && { opacity: 0.5 }]} editable={!isChecking}`;
// Warning: oldInputRow appears in 2 places: FaceOff and MainRound!
// We can use a global string replace
fileContent = fileContent.split(oldInputRow).join(newInputRow);

fs.writeFileSync(targetPath, fileContent, 'utf8');
console.log('Updated PlayScreen.js');
