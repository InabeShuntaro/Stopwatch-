
import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { GameSession, PlayerRecord } from '../types';
import Modal from '../components/Modal';

const PlayerStat: React.FC<{ player: PlayerRecord }> = ({ player }) => {
  if (player.attempts.length === 0) {
    return (
      <div className="flex justify-between items-center py-2">
        <span className="font-bold" style={{ color: player.color }}>{player.name}</span>
        <span className="text-sm text-gray-500">기록 없음</span>
      </div>
    );
  }

  const bestAttempt = player.attempts.reduce((best, current) => current.diff < best.diff ? current : best);
  const avgDiff = player.attempts.reduce((sum, current) => sum + current.diff, 0) / player.attempts.length;

  return (
    <div className="flex justify-between items-center py-2 text-lg">
      <span className="font-bold" style={{ color: player.color }}>{player.name}</span>
      <div className="text-right">
        <p>최고: <span className="font-bold">{bestAttempt.diff.toFixed(3)}s</span></p>
        <p className="text-sm text-gray-600">평균: {avgDiff.toFixed(3)}s</p>
      </div>
    </div>
  );
};

const SessionCard: React.FC<{ session: GameSession }> = ({ session }) => {
  const sortedPlayers = [...session.players]
    .filter(p => p.attempts.length > 0)
    .sort((a, b) => {
        const diffA = Math.min(...a.attempts.map(att => att.diff));
        const diffB = Math.min(...b.attempts.map(att => att.diff));
        return diffA - diffB;
    });

  return (
    <div className="bg-white border-4 border-black shadow-[6px_6px_0px_#000] p-4 mb-6">
      <h3 className="text-xl font-bold border-b-2 border-black pb-2 mb-2">
        {new Date(session.createdAt).toLocaleString('ko-KR')}
      </h3>
      <div>
        {sortedPlayers.map((player, index) => (
          <PlayerStat key={player.id} player={player} />
        ))}
      </div>
    </div>
  );
};

const Records: React.FC = () => {
    const { sessions, resetAllData } = useGame();
    const [isResetModalOpen, setResetModalOpen] = useState(false);

    const confirmReset = () => {
        resetAllData();
        setResetModalOpen(false);
    }

  return (
    <div className="w-full h-full p-4 overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-3xl font-bold">기록 보기</h2>
            <button
                onClick={() => setResetModalOpen(true)}
                className="px-4 py-2 bg-red-500 text-white font-bold border-2 border-black rounded-lg hover:bg-red-600 transition-all duration-200 shadow-[2px_2px_0px_#000]"
            >
                전체 초기화
            </button>
        </div>

      {sessions.length === 0 ? (
        <p className="text-center text-gray-500 mt-10">저장된 게임 기록이 없습니다.</p>
      ) : (
        <div className="max-w-2xl mx-auto">
            {sessions.map(session => (
                <SessionCard key={session.id} session={session} />
            ))}
        </div>
      )}
      
       <Modal
            isOpen={isResetModalOpen}
            onClose={() => setResetModalOpen(false)}
            title="기록 전체 초기화"
        >
            <p className="text-gray-700 mb-6">정말로 모든 게임 기록을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.</p>
            <div className="flex justify-end gap-4">
                <button
                    onClick={() => setResetModalOpen(false)}
                    className="px-6 py-2 bg-gray-200 text-black font-bold border-2 border-black rounded-lg hover:bg-gray-300 transition-all duration-200 shadow-[2px_2px_0px_#000]"
                >
                    취소
                </button>
                <button
                    onClick={confirmReset}
                    className="px-6 py-2 bg-red-500 text-white font-bold border-2 border-black rounded-lg hover:bg-red-600 transition-all duration-200 shadow-[2px_2px_0px_#000]"
                >
                    삭제
                </button>
            </div>
        </Modal>
    </div>
  );
};

export default Records;
