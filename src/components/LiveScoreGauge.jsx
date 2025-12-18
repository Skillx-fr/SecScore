import { motion, useAnimation } from 'framer-motion';
import { useEffect } from 'react';

export function LiveScoreGauge({ score, maxScore, size = 120 }) {
    const percentage = maxScore > 0 ? (score / maxScore) * 100 : 0;
    const radius = size / 2 - 10;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;
    const controls = useAnimation();

    useEffect(() => {
        if (score > 0) {
            controls.start({
                scale: [1, 1.2, 1],
                transition: { duration: 0.3 }
            });
        }
    }, [score, controls]);

    const getColor = (p) => {
        if (p >= 80) return '#10b981'; // Emerald 500
        if (p >= 60) return '#f59e0b'; // Amber 500
        if (p >= 40) return '#f97316'; // Orange 500
        return '#ef4444'; // Red 500
    };

    return (
        <motion.div
            animate={controls}
            className="relative flex items-center justify-center"
            style={{ width: size, height: size }}
        >
            {/* Background Circle */}
            <svg className="transform -rotate-90 w-full h-full">
                <circle
                    className="text-slate-700"
                    strokeWidth="8"
                    stroke="currentColor"
                    fill="transparent"
                    r={radius}
                    cx={size / 2}
                    cy={size / 2}
                />
                {/* Progress Circle */}
                <motion.circle
                    stroke={getColor(percentage)}
                    strokeWidth="8"
                    strokeDasharray={circumference}
                    strokeLinecap="round"
                    fill="transparent"
                    r={radius}
                    cx={size / 2}
                    cy={size / 2}
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                />
            </svg>
            <div className="absolute flex flex-col items-center">
                <motion.span
                    key={score}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-2xl font-bold font-mono text-white"
                >
                    {score}
                </motion.span>
                <span className="text-xs text-slate-400">
                    / {maxScore}
                </span>
            </div>
        </motion.div>
    );
}
