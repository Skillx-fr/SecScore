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
    const percentage = maxScore > 0 ? (score / maxScore) * 100 : 0;

    // Use answered questions IDs to filter relevant questions from the full dataset
    // This is safer than flatMap if only one theme was played.
    const answeredQuestionIds = Object.keys(answers);
    const allQuestions = data.themes
        .flatMap(t => t.questions)
        .filter(q => answeredQuestionIds.includes(q.id));

    const getExplanation = (p) => {
        if (p >= 90) return "Excellent ! Votre posture de sécurité est robuste. Continuez à maintenir ces bonnes pratiques.";
        if (p >= 80) return "Très bien. Quelques ajustements mineurs permettraient d'atteindre l'excellence.";
        if (p >= 60) return "Correct, mais des vulnérabilités importantes subsistent. Priorisez les correctifs sur les points rouges.";
        return "Attention. Votre système présente des risques critiques. Un audit approfondi et des actions correctives immédiates sont nécessaires.";
    };

    const handleExportPDF = () => {
        const doc = new jsPDF();
        let yPos = 20;

        // Header
        doc.setFontSize(22);
        doc.setTextColor(41, 128, 185); // Blue color
        doc.text("Rapport d'Audit SecScore", 105, yPos, { align: "center" });
        yPos += 10;

        // Date
        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.text(`Généré le: ${new Date().toLocaleDateString()} à ${new Date().toLocaleTimeString()}`, 105, yPos, { align: "center" });
        yPos += 5;

        // Divider
        doc.setLineWidth(0.5);
        doc.line(20, yPos, 190, yPos);
        yPos += 15;

        // Score Section
        doc.setFontSize(16);
        doc.setTextColor(0);
        doc.text(`Score Global: ${score} / ${maxScore}`, 20, yPos);
        yPos += 8;
        doc.text(`Note: ${grade}`, 20, yPos);
        yPos += 15;

        // Explanation
        doc.setFontSize(12);
        doc.setTextColor(80);
        const splitExplanation = doc.splitTextToSize(getExplanation(percentage), 170);
        doc.text(splitExplanation, 20, yPos);
        yPos += (splitExplanation.length * 7) + 10;

        // Detailed Recommendations Header
        doc.setFontSize(14);
        doc.setTextColor(41, 128, 185);
        doc.text("Recommandations détaillées", 20, yPos);
        yPos += 10;

        // Recommendations List
        doc.setFontSize(10);
        doc.setTextColor(0);
        
        // Use all themes to get the right questions context if needed, 
        // but allQuestions (flattened) is enough if IDs match.
        allQuestions.forEach((q) => {
            const userOption = answers[q.id];
            if (userOption) {
                // Check if we need a new page
                if (yPos > 270) {
                    doc.addPage();
                    yPos = 20;
                }

                doc.setFont("helvetica", "bold");
                const splitQ = doc.splitTextToSize(`${q.text}`, 160);
                doc.text(splitQ, 20, yPos);
                yPos += (splitQ.length * 5);

                doc.setFont("helvetica", "normal");
                doc.setTextColor(100);
                const feedbackText = userOption.feedback || "Aucune recommandation spécifique.";
                const splitFeedback = doc.splitTextToSize(`Recommandation : ${feedbackText}`, 155);
                doc.text(splitFeedback, 25, yPos);
                yPos += (splitFeedback.length * 5) + 7;
                doc.setTextColor(0);
            }
        });

        // Footer
        doc.setFontSize(8);
        doc.setTextColor(150);
        doc.text("SecScore v0.1.4 - Développé par Frédéric Tiercin pour Skillx.fr", 105, 285, { align: "center" });

        doc.save("SecScore_Rapport.pdf");
    };

    const handleGenerateEmail = () => {
        const percentage = maxScore > 0 ? (score / maxScore) * 100 : 0;
        const explanation = getExplanation(percentage);

        // Identify all areas for improvement (where score is not max)
        const recommendations = allQuestions.map(q => {
            const userAnswer = answers[q.id];
            const maxQScore = Math.max(...q.options.map(o => o.score));
            
            if (!userAnswer || userAnswer.score < maxQScore) {
                return `• ${q.text} : ${userAnswer?.feedback || "Action requise pour atteindre le niveau de sécurité recommandé."}`;
            }
            return null;
        }).filter(Boolean);

        const emailBody = `Objet : Rapport d'Audit Cybersécurité - Note : ${grade} (${score}/${maxScore})

Bonjour,

Un audit de notre posture de sécurité a été réalisé via l'outil SecScore. Voici les résultats synthétiques :

NOTE GLOBALE : ${grade}
SCORE : ${score} / ${maxScore} (${Math.round(percentage)}%)

ANALYSE :
${explanation}

DÉTAIL DES ACTIONS À MENER (POINT PAR POINT) :
${recommendations.length > 0 ? recommendations.join('\n') : "Aucune action corrective n'est requise, le niveau de sécurité est optimal sur les points audités."}

Ces points nécessitent une attention particulière pour garantir la continuité de notre activité et la protection de nos données. Je reste à votre disposition pour prioriser ces chantiers et valider les ressources nécessaires.

Cordialement,`;

        navigator.clipboard.writeText(emailBody);
        alert("Le rapport complet spécial CODIR a été copié dans le presse-papier !");
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

                <p className="text-xs text-slate-500 mt-2 mb-8 italic text-center">
                    * Basé sur la complexité estimée de mise en œuvre et l'impact sécurité.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-2xl mt-8">
                    <button
                        onClick={onReset}
                        className="flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-slate-700 hover:bg-skillx/40 transition-colors font-semibold"
                    >
                        <RefreshCw className="w-5 h-5" />
                        Nouvel Audit
                    </button>
                    <button
                        onClick={handleExportPDF}
                        className="flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-blue-600 hover:bg-skillx transition-colors font-semibold shadow-lg shadow-blue-500/20"
                    >
                        <Download className="w-5 h-5" />
                        Exporter PDF
                    </button>
                    <button
                        onClick={handleGenerateEmail}
                        className="flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-purple-600 hover:bg-skillx transition-colors font-semibold shadow-lg shadow-purple-500/20"
                    >
                        <span className="text-xl">📧</span>
                        Email CODIR
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
