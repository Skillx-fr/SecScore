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

    const handleGenerateEmail = () => {
        // Identify top 3 critical risks
        // Logic: Questions where score < max AND (riskLevel is high OR explicitly tagged in 'Impact' matrix quadrants?)
        // Let's stick to High Risk questions that were missed.
        const criticalRisks = allQuestions.filter(q => {
            const userAnswer = answers[q.id];
            const maxQScore = Math.max(...q.options.map(o => o.score));

            // If answered correctly (max score), it's not a risk.
            if (userAnswer && userAnswer.score === maxQScore) return false;

            // It is a risk. Is it critical? 
            // We look at the question's potential risk. 
            // Simplification: If the question HAS a 'high' risk option, it's a high risk topic.
            return q.options.some(o => o.riskLevel === 'high');
        })
            // Prioritize: 
            // 1. "Strategic" (High Effort, High Risk) - These need budget!
            // 2. "Quick Wins" (Low Effort, High Risk) - These need immediate action.
            // Let's sort by Effort? Or just take the first 3?
            // Let's randomly shuffle or just take the first 3 relevant ones? 
            // Let's take the first 3 to keep it simple, but maybe prioritizing High Effort ones helps get budget?
            // Actually, asking budget for "Quick Wins" is easier. Let's just take the top 3 found.
            .slice(0, 3);

        if (criticalRisks.length === 0) {
            alert("Aucun risque critique détecté. Pas d'email nécessaire !");
            return;
        }

        const riskList = criticalRisks.map(r => `• ${r.businessImpact || r.text}`).join('\n');

        const emailBody = `Objet : Alerte Cybersécurité : Risques critiques et besoins d'investissements

Bonjour,

Un audit de notre posture de sécurité (effectué via SecScore) a révélé une note de ${grade} (${score}/${maxScore}).

Nous sommes actuellement exposés à des risques majeurs qui pourraient impacter la continuité de notre activité :

${riskList}

Pour mitiger ces menaces (Ransomware, Fuite de données, Arrêt de production), des actions correctives sont urgentes.

Je sollicite une réunion pour vous présenter le plan de reméditation et valider le budget nécessaire à la sécurisation de nos actifs.

Cordialment,`;

        navigator.clipboard.writeText(emailBody);
        alert("E-mail 'Spécial CODIR' copié dans le presse-papier !");
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

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-2xl mt-8">
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
                    <button
                        onClick={handleGenerateEmail}
                        className="flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-purple-600 hover:bg-purple-500 transition-colors font-semibold shadow-lg shadow-purple-500/20"
                    >
                        <span className="text-xl">📧</span>
                        Email CODIR
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
