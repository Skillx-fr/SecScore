import { Shield, Server, Cloud } from 'lucide-react';
import { motion } from 'framer-motion';

const icons = {
    web_security: Shield,
    internal_si: Server,
    cloud_saas: Cloud
};

export function ThemeSelector({ themes, onSelect }) {
    return (
        <div className="max-w-6xl mx-auto px-4">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-16"
            >
                <h1 className="text-4xl md:text-6xl font-black mb-6 text-white">
                    Évaluez votre cybersécurité<br />en 5 minutes
                </h1>
                <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-8">
                    Un outil simple pour auditer vos risques, prioriser vos actions et obtenir les arguments pour convaincre votre direction.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                    <div className="flex flex-col items-center text-center space-y-2">
                        <div className="flex items-center gap-2 text-sm font-bold text-slate-300 uppercase tracking-widest">
                            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                            Audit Temps Réel
                        </div>
                        <p className="text-xs text-slate-500 leading-relaxed">
                            Visualisez l'impact de chaque réponse sur votre score global instantanément.
                        </p>
                    </div>
                    <div className="flex flex-col items-center text-center space-y-2">
                        <div className="flex items-center gap-2 text-sm font-bold text-slate-300 uppercase tracking-widest">
                            <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                            Matrice des Priorités
                        </div>
                        <p className="text-xs text-slate-500 leading-relaxed">
                            Identifiez les "Quick Wins" et les chantiers stratégiques en un coup d'œil.
                        </p>
                    </div>
                    <div className="flex flex-col items-center text-center space-y-2">
                        <div className="flex items-center gap-2 text-sm font-bold text-slate-300 uppercase tracking-widest">
                            <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                            Support CODIR
                        </div>
                        <p className="text-xs text-slate-500 leading-relaxed">
                            Générez des rapports et des alertes prêts à être présentés à votre direction.
                        </p>
                    </div>
                </div>
            </motion.div>

            <h2 className="text-2xl font-bold mb-8 gradient-text text-center md:text-left">
                Sélectionnez un périmètre d'audit
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {themes.map((theme, index) => {
                    const Icon = icons[theme.id] || Shield;
                    return (
                        <motion.div
                            key={theme.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => onSelect(theme)}
                            className="glass-panel p-6 rounded-2xl cursor-pointer hover:bg-skillx/30 transition-colors group"
                        >
                            <div className="flex justify-center mb-6">
                                <div className="p-4 rounded-full bg-slate-700/50 group-hover:bg-skillx/40 transition-colors">
                                    <Icon className="w-12 h-12 text-blue-400 group-hover:text-blue-300" />
                                </div>
                            </div>
                            <h3 className="text-xl font-semibold text-center mb-2 text-white">
                                {theme.title}
                            </h3>
                            <p className="text-sm text-slate-400 text-center">
                                {theme.description}
                            </p>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}
