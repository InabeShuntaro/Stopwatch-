
import React from 'react';
import { motion } from 'framer-motion';
import { PlayerRecord } from '../types';
import { GOAL_TIME } from '../constants';

interface ResultCardProps {
    player: PlayerRecord;
    rank: number;
}

const ResultCard: React.FC<ResultCardProps> = ({ player, rank }) => {
    const lastAttempt = player.attempts[player.attempts.length - 1];
    if (!lastAttempt) return null;

    const diff = lastAttempt.diff;
    const sign = lastAttempt.elapsed > GOAL_TIME ? '+' : '-';

    const rankColors: { [key: number]: string } = {
        1: 'bg-yellow-400 border-yellow-600',
        2: 'bg-gray-300 border-gray-500',
        3: 'bg-yellow-600 border-yellow-800',
    };
    const rankColor = rankColors[rank] || 'bg-white border-black';

    return (
        <motion.div
            initial={{ scale: 0.5, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ type: 'spring', damping: 15, stiffness: 300 }}
            className="relative w-full max-w-sm bg-white p-6 border-4 border-black shadow-[8px_8px_0px_rgba(0,0,0,0.8)] text-center"
        >
            <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: -15 }}
                transition={{ delay: 0.3, type: 'spring', damping: 10, stiffness: 200 }}
                className={`absolute -top-6 -right-6 w-24 h-24 flex flex-col items-center justify-center rounded-full border-4 text-black ${rankColor}`}
            >
                <span className="font-bold text-4xl">{rank}</span>
                <span className="text-sm font-semibold">위</span>
            </motion.div>
            
            <h3 className="text-2xl font-bold" style={{ color: player.color }}>{player.name}</h3>
            <p className="text-6xl font-orbitron font-black my-4">{lastAttempt.elapsed.toFixed(2)}s</p>
            <p className="text-2xl font-semibold text-gray-700">
                목표 {GOAL_TIME}s
            </p>
            <p className="text-3xl font-bold" style={{ color: diff < 0.1 ? '#4ade80' : '#f87171' }}>
                {sign}{diff.toFixed(2)}s
            </p>
        </motion.div>
    );
};

export default ResultCard;
