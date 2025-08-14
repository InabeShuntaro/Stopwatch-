
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext';
import Modal from './Modal';

const Header: React.FC = () => {
    const [isNewGameModalOpen, setNewGameModalOpen] = useState(false);
    const { startNewGame } = useGame();
    const location = useLocation();
    const navigate = useNavigate();

    const handleNewGameClick = () => {
        if (location.pathname === '/') {
            setNewGameModalOpen(true);
        } else {
            startNewGame();
            navigate('/');
        }
    };
    
    const confirmNewGame = () => {
        startNewGame();
        setNewGameModalOpen(false);
    };

    const HeaderIcon: React.FC<{ onClick?: () => void, children: React.ReactNode, to?: string }> = ({ onClick, children, to }) => {
        const content = (
            <button
                onClick={onClick}
                className="flex items-center justify-center h-12 w-12 text-black hover:bg-black/10 transition-colors duration-200"
            >
                {children}
            </button>
        );

        return to ? <Link to={to}>{content}</Link> : content;
    };

    return (
        <>
            <header className="w-full bg-[#FF6F91] text-black border-b-4 border-black flex items-center justify-between shrink-0 h-16 z-10">
                <HeaderIcon onClick={handleNewGameClick}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h5M4 12a8 8 0 018-8v0a8 8 0 018 8v0a8 8 0 01-8 8v0a8 8 0 01-8-8v0z" />
                    </svg>
                </HeaderIcon>

                <Link to="/" className="text-3xl font-orbitron font-bold tracking-tighter text-black">
                    8·15
                </Link>

                <div className="flex">
                    <HeaderIcon to="/records">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                           <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    </HeaderIcon>
                     <HeaderIcon onClick={() => alert('Share feature coming soon!')}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12s-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.368a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                        </svg>
                    </HeaderIcon>
                </div>
            </header>
            
            <Modal
                isOpen={isNewGameModalOpen}
                onClose={() => setNewGameModalOpen(false)}
                title="새 게임 시작"
            >
                <p className="text-gray-700 mb-6">현재 게임을 종료하고 새 게임을 시작하시겠습니까?</p>
                <div className="flex justify-end gap-4">
                    <button
                        onClick={() => setNewGameModalOpen(false)}
                        className="px-6 py-2 bg-gray-200 text-black font-bold border-2 border-black rounded-lg hover:bg-gray-300 transition-all duration-200 shadow-[2px_2px_0px_#000]"
                    >
                        취소
                    </button>
                    <button
                        onClick={confirmNewGame}
                        className="px-6 py-2 bg-[#FFCA3A] text-black font-bold border-2 border-black rounded-lg hover:bg-[#FFD460] transition-all duration-200 shadow-[2px_2px_0px_#000]"
                    >
                        확인
                    </button>
                </div>
            </Modal>
        </>
    );
};

export default Header;
