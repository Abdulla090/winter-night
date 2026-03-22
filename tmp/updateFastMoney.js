const fs = require('fs');
const path = require('path');

const targetPath = path.resolve(__dirname, '../src/screens/FamilyFeud/FastMoneyScreen.js');
let fileContent = fs.readFileSync(targetPath, 'utf8');

// 1. imports
fileContent = fileContent.replace(
    'import { familyFeudQuestions } from \'../../data/familyFeudQuestions\';', 
    'import { familyFeudQuestions } from \'../../data/familyFeudQuestions\';\nimport { checkAnswerWithGemini } from \'./gameEngine\';'
);

// 2. Add isChecking state
fileContent = fileContent.replace(
    'const timerRef = useRef(null);',
    'const timerRef = useRef(null);\n    const [isChecking, setIsChecking] = useState(false);\n    const isCheckingRef = useRef(false);\n\n    useEffect(() => { isCheckingRef.current = isChecking; }, [isChecking]);'
);

// 3. Pause timer during check
fileContent = fileContent.replace(
    'timerRef.current = setInterval(() => {',
    'timerRef.current = setInterval(() => {\n                if (isCheckingRef.current) return;'
);

// 4. Update scoreAnswer to be async and call Gemini
const oldScore = `    const scoreAnswer = (questionIndex, answerText) => {
        if (!answerText || !fmQuestions[questionIndex]) return 0;
        const q = fmQuestions[questionIndex];
        const norm = answerText.trim().toLowerCase();
        const match = q.answers.find(a =>
            a.text.toLowerCase().includes(norm) || norm.includes(a.text.toLowerCase())
        );
        return match ? match.points : 0;
    };`;

const newScore = `    const scoreAnswer = async (questionIndex, answerText) => {
        if (!answerText || !fmQuestions[questionIndex]) return 0;
        const q = fmQuestions[questionIndex];
        const idx = await checkAnswerWithGemini(q, answerText);
        if (idx >= 0) return q.answers[idx].points;
        return 0;
    };`;

fileContent = fileContent.replace(oldScore, newScore);

// 5. Update submitP2Answer
const oldP2Submit = `    const submitP2Answer = () => {
        haptic();
        const points = scoreAnswer(p2CurrentQ, p2Input);
        const newAnswers = [...p2Answers, { text: p2Input.trim() || '---', points }];
        setP2Answers(newAnswers);
        setP2Input('');

        if (p2CurrentQ + 1 >= 5 || p2CurrentQ + 1 >= fmQuestions.length) {
            clearInterval(timerRef.current);
            setPhase(FM_PHASE.PLAYER2_REVIEW);
        } else {
            setP2CurrentQ(p2CurrentQ + 1);
        }
    };`;

const newP2Submit = `    const submitP2Answer = async () => {
        if (!p2Input.trim() || isChecking) return;
        setIsChecking(true);
        haptic();
        const points = await scoreAnswer(p2CurrentQ, p2Input);
        const newAnswers = [...p2Answers, { text: p2Input.trim() || '---', points }];
        setP2Answers(newAnswers);
        setP2Input('');
        setIsChecking(false);

        if (p2CurrentQ + 1 >= 5 || p2CurrentQ + 1 >= fmQuestions.length) {
            clearInterval(timerRef.current);
            setPhase(FM_PHASE.PLAYER2_REVIEW);
        } else {
            setP2CurrentQ(p2CurrentQ + 1);
        }
    };`;
fileContent = fileContent.replace(oldP2Submit, newP2Submit);

// 6. Update submitP1Answer
const oldP1Submit = `    const submitP1Answer = () => {
        // Check for duplicate with player 2
        const p2Ans = p2Answers[p1CurrentQ]?.text?.toLowerCase();
        if (p2Ans && p1Input.trim().toLowerCase() === p2Ans) {
            haptic('error');
            setP1Duplicate(true);
            setP1Input('');
            setTimeout(() => setP1Duplicate(false), 1500);
            return;
        }

        haptic();
        const points = scoreAnswer(p1CurrentQ, p1Input);
        const newAnswers = [...p1Answers, { text: p1Input.trim() || '---', points }];
        setP1Answers(newAnswers);
        setP1Input('');

        if (p1CurrentQ + 1 >= 5 || p1CurrentQ + 1 >= fmQuestions.length) {
            clearInterval(timerRef.current);
            setPhase(FM_PHASE.FINAL_REVEAL);
        } else {
            setP1CurrentQ(p1CurrentQ + 1);
        }
    };`;

const newP1Submit = `    const submitP1Answer = async () => {
        if (!p1Input.trim() || isChecking) return;
        // Check for duplicate with player 2
        const p2Ans = p2Answers[p1CurrentQ]?.text?.toLowerCase();
        if (p2Ans && p1Input.trim().toLowerCase() === p2Ans) {
            haptic('error');
            setP1Duplicate(true);
            setP1Input('');
            setTimeout(() => setP1Duplicate(false), 1500);
            return;
        }

        setIsChecking(true);
        haptic();
        const points = await scoreAnswer(p1CurrentQ, p1Input);
        const newAnswers = [...p1Answers, { text: p1Input.trim() || '---', points }];
        setP1Answers(newAnswers);
        setP1Input('');
        setIsChecking(false);

        if (p1CurrentQ + 1 >= 5 || p1CurrentQ + 1 >= fmQuestions.length) {
            clearInterval(timerRef.current);
            setPhase(FM_PHASE.FINAL_REVEAL);
        } else {
            setP1CurrentQ(p1CurrentQ + 1);
        }
    };`;
fileContent = fileContent.replace(oldP1Submit, newP1Submit);

// Disable input while checking
fileContent = fileContent.split('onSubmitEditing={submitP2Answer} />').join('onSubmitEditing={submitP2Answer} editable={!isChecking} style={[styles.fmInput, kf, isKurdish && { textAlign: \\'right\\' }, isChecking && { opacity: 0.5 }]} />');
fileContent = fileContent.split('onSubmitEditing={submitP1Answer} />').join('onSubmitEditing={submitP1Answer} editable={!isChecking} style={[styles.fmInput, kf, isKurdish && { textAlign: \\'right\\' }, isChecking && { opacity: 0.5 }]} />');

fs.writeFileSync(targetPath, fileContent, 'utf8');
console.log('Updated FastMoneyScreen.js');
