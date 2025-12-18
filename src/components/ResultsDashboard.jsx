import { motion } from 'framer-motion';
import { RefreshCw, Download } from 'lucide-react';
import { LiveScoreGauge } from './LiveScoreGauge';
import { jsPDF } from 'jspdf';
import { PriorityMatrix } from './PriorityMatrix';
// We need to access all questions to pass to the matrix. 
// Ideally ResultsDashboard should receive them. 
// For now, let's import the data directly or allow it to be passed.
import data from '../data/questions.json';

export function ResultsDashboard({ score, maxScore, grade, onReset, answers }) {
    // 'answers' prop is needed to know which questions were missed.
    // Note: App.jsx needs to pass 'answers' state to ResultsDashboard.

    const percentage = maxScore > 0 ? (score / maxScore) * 100 : 0;

    // Flatten all questions for the matrix
    const allQuestions = data.themes.flatMap(t => t.questions);

    const getExplanation = (p) => {
        if (p >= 90) return "Excellent ! Votre posture de sécurité est robuste. Continuez à maintenir ces bonnes pratiques.";
        if (p >= 80) return "Très bien. Quelques ajustements mineurs permettraient d'atteindre l'excellence.";
        if (p >= 60) return "Correct, mais des vulnérabilités importantes subsistent. Priorisez les correctifs sur les points rouges.";
        return "Attention. Votre système présente des risques critiques. Un audit approfondi et des actions correctives immédiates sont nécessaires.";
    };

    const handleExportPDF = () => {
        const doc = new jsPDF();

        // Header
        doc.setFontSize(22);
        doc.setTextColor(41, 128, 185); // Blue color
        doc.text("Rapport d'Audit SecScore", 105, 20, { align: "center" });

        // Date
        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.text(`Généré le: ${new Date().toLocaleDateString()} à ${new Date().toLocaleTimeString()}`, 105, 30, { align: "center" });

        // Divider
        doc.setLineWidth(0.5);
        doc.line(20, 35, 190, 35);

        // Score Section
        doc.setFontSize(16);
        doc.setTextColor(0);
        doc.text(`Score Global: ${score} / ${maxScore}`, 20, 50);
        doc.text(`Note: ${grade}`, 20, 60);

        // Explanation
        doc.setFontSize(12);
        doc.setTextColor(80);
        const splitText = doc.splitTextToSize(getExplanation(percentage), 170);
        doc.text(splitText, 20, 75);

        // Footer
        doc.setFontSize(10);
        doc.setTextColor(150);
        doc.text("SecScore v0.1.1 - Développé par Frédéric Tiercin", 105, 280, { align: "center" });

        doc.save("SecScore_Rapport.pdf");
    };

    return (
        <div className="max-w-6xl mx-auto p-4 md:p-8 text-center">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-panel p-8 md:p-12 rounded-3xl flex flex-col items-center"
            >
                <h2 className="text-3xl font-bold mb-8 gradient-text">
                    Audit Terminé
                </h2>

                <div className="flex flex-col md:flex-row items-center justify-center gap-12 w-full mb-12">
                    <div className="flex flex-col items-center">
                        <LiveScoreGauge score={score} maxScore={maxScore} size={200} />
                        <div className="mt-8">
                            <p className="text-slate-400 uppercase tracking-widest text-sm mb-2">Note Globale</p>
                            <div className="text-6xl font-black text-white mb-4">{grade}</div>
                        </div>
                    </div>

                    <div className="max-w-md text-left">
                        <h3 className="text-xl font-bold text-white mb-2">Analyse</h3>
                        <p className="text-slate-300 leading-relaxed">
                            {getExplanation(percentage)}
                        </p>
                    </div>
                </div>

                {/* Priority Matrix */}
                <PriorityMatrix questions={allQuestions} answers={answers} />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-lg mt-8">
                    <button
                        onClick={onReset}
                        className="flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-slate-700 hover:bg-slate-600 transition-colors font-semibold"
                    >
                        <RefreshCw className="w-5 h-5" />
                        Nouvel Audit
                    </button>
                    <button
                        onClick={handleExportPDF}
                        className="flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-blue-600 hover:bg-blue-500 transition-colors font-semibold shadow-lg shadow-blue-500/20"
                    >
                        <Download className="w-5 h-5" />
                        Exporter PDF
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
