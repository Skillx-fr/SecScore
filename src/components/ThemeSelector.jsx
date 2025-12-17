import { Shield, Server, Cloud } from 'lucide-react';
import { motion } from 'framer-motion';

const icons = {
    web_security: Shield,
    internal_si: Server,
    cloud_saas: Cloud
};

export function ThemeSelector({ themes, onSelect }) {
    return (
        <div className="max-w-4xl mx-auto p-6">
            <h2 className="text-3xl font-bold text-center mb-12 gradient-text">
                Choisissez votre audit
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
