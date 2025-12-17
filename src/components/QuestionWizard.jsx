import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, AlertTriangle, CheckCircle, AlertCircle } from 'lucide-react';

export function QuestionWizard({ theme, onAnswer, onFinish }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState(null);
    const [showFeedback, setShowFeedback] = useState(false);

    const question = theme.questions[currentIndex];
    const isLastQuestion = currentIndex === theme.questions.length - 1;

    const handleOptionClick = (option) => {
        if (showFeedback) return; // Prevent changing answer after reveal
        setSelectedOption(option);
        setShowFeedback(true);
        onAnswer(question.id, option.score);
    };

    const handleNext = () => {
        if (isLastQuestion) {
            onFinish();
        } else {
            setCurrentIndex(prev => prev + 1);
            setSelectedOption(null);
            setShowFeedback(false);
        }
    };

    const getRiskColor = (level) => {
        switch (level) {
            case 'high': return 'border-red-500 bg-red-500/10 text-red-200';
            case 'medium': return 'border-orange-500 bg-orange-500/10 text-orange-200';
            case 'low': return 'border-emerald-500 bg-emerald-500/10 text-emerald-200';
            default: return 'border-slate-700 bg-slate-800';
        }
    };

    const getRiskIcon = (level) => {
        switch (level) {
            case 'high': return <AlertCircle className="w-5 h-5 text-red-500" />;
            case 'medium': return <AlertTriangle className="w-5 h-5 text-orange-500" />;
            case 'low': return <CheckCircle className="w-5 h-5 text-emerald-500" />;
            default: return null;
        }
    };

    return (
        <div className="max-w-3xl mx-auto w-full">
            <div className="mb-8 flex justify-between items-end">
                <div>
                    <h3 className="text-sm uppercase tracking-wider text-slate-400 mb-1">
                        Question {currentIndex + 1} / {theme.questions.length}
                    </h3>
                    <h2 className="text-2xl font-bold text-white">
                        {question.text}
                    </h2>
                </div>
            </div>

            <div className="space-y-4">
                <AnimatePresence mode="wait">
                    {question.options.map((option, idx) => {
                        const isSelected = selectedOption === option;
                        const feedbackStyle = showFeedback && isSelected ? getRiskColor(option.riskLevel) : 'border-slate-700 hover:bg-slate-800';
                        const opacity = showFeedback && !isSelected ? 'opacity-50' : 'opacity-100';

                        return (
                            <motion.button
                                key={idx}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                disabled={showFeedback}
                                onClick={() => handleOptionClick(option)}
                                className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-300 ${feedbackStyle} ${opacity} relative overflow-hidden group`}
                            >
                                <div className="flex items-center justify-between">
                                    <span className="font-medium">{option.text}</span>
                                    {showFeedback && isSelected && getRiskIcon(option.riskLevel)}
                                </div>

                                {showFeedback && isSelected && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        className="mt-2 text-sm pt-2 border-t border-white/10"
                                    >
                                        {option.feedback}
                                    </motion.div>
                                )}
                            </motion.button>
                        );
                    })}
                </AnimatePresence>
            </div>

            <div className="h-20 mt-8 flex justify-end items-center">
                {showFeedback && (
                    <motion.button
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        onClick={handleNext}
                        className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-full font-semibold shadow-lg shadow-blue-500/25 transition-all"
                    >
                        {isLastQuestion ? 'Terminer l\'audit' : 'Question suivante'}
                        <ArrowRight className="w-4 h-4" />
                    </motion.button>
                )}
            </div>
        </div>
    );
}
