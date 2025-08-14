
import React from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';
import Header from './components/Header';
import Game from './pages/Game';
import Records from './pages/Records';

const App: React.FC = () => {
  return (
    <div className="flex flex-col h-screen w-screen bg-[#F1F1F1] text-black overflow-hidden select-none">
      <Header />
      <main className="flex-grow flex flex-col items-center justify-center p-4">
        <Routes>
          <Route path="/" element={<Game />} />
          <Route path="/records" element={<Records />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;
