import { useState, useMemo } from 'react';

export function useRealTimeScore() {
    const [answers, setAnswers] = useState({}); // { questionId: score }

    const totalScore = useMemo(() => {
        return Object.values(answers).reduce((acc, curr) => acc + curr, 0);
    }, [answers]);

    const calculateGrade = (score, maxScore) => {
        if (maxScore === 0) return 'N/A';
        const percentage = (score / maxScore) * 100;
        if (percentage >= 90) return 'A';
        if (percentage >= 80) return 'B';
        if (percentage >= 60) return 'C';
        if (percentage >= 40) return 'D';
        return 'F';
    };

    const addAnswer = (questionId, score) => {
        setAnswers(prev => ({
            ...prev,
            [questionId]: score
        }));
    };

    const resetScore = () => {
        setAnswers({});
    };

    return {
        answers,
        totalScore,
        addAnswer,
        calculateGrade,
        resetScore
    };
}
