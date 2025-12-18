import { motion } from 'framer-motion';
import { RefreshCw, Download } from 'lucide-react';
import { LiveScoreGauge } from './LiveScoreGauge';
import { jsPDF } from 'jspdf';

export function ResultsDashboard({ score, maxScore, grade, onReset }) {
    const percentage = maxScore > 0 ? (score / maxScore) * 100 : 0;

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
        <div className="max-w-4xl mx-auto p-8 text-center">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-panel p-12 rounded-3xl flex flex-col items-center"
            >
                <h2 className="text-3xl font-bold mb-8 gradient-text">
                    Audit Terminé
                </h2>

                <div className="mb-8">
                    <LiveScoreGauge score={score} maxScore={maxScore} size={200} />
                </div>

                <div className="mb-8">
                    <p className="text-slate-400 uppercase tracking-widest text-sm mb-2">Note Globale</p>
                    <div className="text-6xl font-black text-white mb-4">{grade}</div>
                    <p className="text-lg text-slate-300 max-w-xl mx-auto">
                        {getExplanation(percentage)}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-lg">
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
