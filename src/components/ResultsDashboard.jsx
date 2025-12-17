import { motion } from 'framer-motion';
import { RefreshCw, Download } from 'lucide-react';
import { LiveScoreGauge } from './LiveScoreGauge';

export function ResultsDashboard({ score, maxScore, grade, onReset }) {
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

                <div className="mb-12">
                    <p className="text-slate-400 uppercase tracking-widest text-sm mb-2">Note Globale</p>
                    <div className="text-6xl font-black text-white">{grade}</div>
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
