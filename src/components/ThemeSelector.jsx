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
                <h1 className="text-4xl md:text-6xl font-black mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400">
                    Évaluez votre cybersécurité<br />en 5 minutes
                </h1>
                <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-8">
                    Un outil simple pour auditer vos risques, prioriser vos actions et obtenir les arguments pour convaincre votre direction.
                </p>
                <div className="flex flex-wrapjustify-center gap-4 text-sm font-semibold text-slate-500 uppercase tracking-widest">
                    <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-blue-500"></div> Audit Temps Réel</span>
                    <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-emerald-500"></div> Matrice des Priorités</span>
                    <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-purple-500"></div> Support CODIR</span>
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
                            className="glass-panel p-6 rounded-2xl cursor-pointer hover:bg-slate-800/80 transition-colors group"
                        >
                            <div className="flex justify-center mb-6">
                                <div className="p-4 rounded-full bg-slate-700/50 group-hover:bg-blue-500/20 transition-colors">
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
