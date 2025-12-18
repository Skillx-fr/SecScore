import { motion } from 'framer-motion';
import { AlertTriangle, CheckCircle, TrendingUp, ShieldAlert } from 'lucide-react';

export function PriorityMatrix({ questions, answers }) {
    // Filter for items where the user didn't get the max score
    const improvements = questions.filter(q => {
        const userAnswer = answers[q.id];
        if (!userAnswer) return true; // Not answered counts as improvement needed? Or skip? Let's assume answered.
        // Logic: find max score for this question
        const maxQScore = Math.max(...q.options.map(o => o.score));
        return userAnswer.score < maxQScore;
    });

    // Categorize
    const quadrants = {
        quickWins: [], // High Risk, Low Effort
        strategic: [], // High Risk, High Effort
        maintenance: [], // Low Risk, Low Effort
        laborious: []  // Low Risk, High Effort
    };

    improvements.forEach(q => {
        // Determine Risk Level (Impact)
        // We look at the "worst case" for this question, usually defined by the riskLevel of the 0-score option
        // BUT the JSON structure puts riskLevel on OPTIONS, not Questions. 
        // Heuristic: If the question allows a "High" risk answers, the TOPIC is high risk.
        // Better Heuristic: Use the `riskLevel` of the *User's Chosen Answer*? 
        // No, the Matrix guides *Correction*. correction impact is determined by the vulnerability.
        // Let's assume the question itself has an implicit risk. 
        // Actually, let's look at the "0 score" option's riskLevel as the "Question Risk".
        // AND use the 'effort' tag we added.

        const zeroOption = q.options.find(o => o.score === 0);
        const risk = zeroOption ? zeroOption.riskLevel : 'medium';
        // 'effort' is on the question object now
        const effort = q.effort || 'high'; // Default to high if missing

        if ((risk === 'high' || risk === 'critical') && effort === 'low') {
            quadrants.quickWins.push(q);
        } else if ((risk === 'high' || risk === 'critical') && effort === 'high') {
            quadrants.strategic.push(q);
        } else if (effort === 'low') {
            quadrants.maintenance.push(q);
        } else {
            quadrants.laborious.push(q);
        }
    });

    const renderCard = (title, items, icon, colorClass, bgColorClass) => (
        <div className={`p-4 rounded-xl border ${colorClass} ${bgColorClass} flex flex-col h-full`}>
            <div className="flex items-center gap-2 mb-3 border-b border-white/10 pb-2">
                {icon}
                <h4 className="font-bold uppercase text-sm tracking-wider">{title}</h4>
                <span className="ml-auto text-xs font-mono bg-white/20 px-2 py-1 rounded-full">{items.length}</span>
            </div>
            <ul className="flex-1 space-y-2 overflow-y-auto max-h-48 custom-scrollbar">
                {items.length === 0 ? (
                    <li className="text-xs text-white/50 italic">Aucune action requise.</li>
                ) : (
                    items.map(q => (
                        <li key={q.id} className="text-xs bg-black/20 p-2 rounded hover:bg-black/30 transition-colors">
                            {q.text}
                        </li>
                    ))
                )}
            </ul>
        </div>
    );

    return (
        <div className="w-full max-w-4xl mx-auto mt-12 mb-12">
            <h3 className="text-2xl font-bold mb-6 text-left flex items-center gap-3">
                <TrendingUp className="text-blue-400" />
                Matrice des Priorités
            </h3>

            {/* 2x2 Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-[500px]">
                {/* Top Left: Gains Rapides (High Risk / Low Effort) */}
                {renderCard(
                    "Gains Rapides (Priorité #1)",
                    quadrants.quickWins,
                    <TrendingUp className="w-5 h-5" />,
                    "border-emerald-500/50 text-emerald-100",
                    "bg-emerald-900/20"
                )}

                {/* Top Right: Projets Stratégiques (High Risk / High Effort) */}
                {renderCard(
                    "Projets Stratégiques (Priorité #2)",
                    quadrants.strategic,
                    <ShieldAlert className="w-5 h-5" />,
                    "border-blue-500/50 text-blue-100",
                    "bg-blue-900/20"
                )}

                {/* Bottom Left: Maintenance (Low Risk / Low Effort) */}
                {renderCard(
                    "Améliorations Rapides",
                    quadrants.maintenance,
                    <CheckCircle className="w-5 h-5" />,
                    "border-amber-500/50 text-amber-100",
                    "bg-amber-900/20"
                )}

                {/* Bottom Right: Laborieux (Low Risk / High Effort) */}
                {renderCard(
                    "Seconde Priorité",
                    quadrants.laborious,
                    <AlertTriangle className="w-5 h-5" />,
                    "border-slate-600 text-slate-300",
                    "bg-slate-800/20"
                )}
            </div>
            <p className="text-xs text-slate-500 mt-4 italic text-center">
                * Basé sur la complexité estimée de mise en œuvre et l'impact sécurité.
            </p>
        </div>
    );
}
