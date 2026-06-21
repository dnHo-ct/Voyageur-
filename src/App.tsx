import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '@/store/useStore';
import { Sidebar } from '@/components/Sidebar';
import { Hub } from '@/views/Hub';
import { QuestDetail } from '@/views/QuestDetail';
import { Skills } from '@/views/Skills';
import { Achievements } from '@/views/Achievements';
import { History } from '@/views/History';
import { Profile } from '@/views/Profile';

function AppContent() {
  const { currentView, updateStreak } = useStore();

  useEffect(() => {
    updateStreak();
  }, []);

  const renderView = () => {
    switch (currentView) {
      case 'hub':
        return <Hub />;
      case 'quest-detail':
        return <QuestDetail />;
      case 'skills':
        return <Skills />;
      case 'achievements':
        return <Achievements />;
      case 'history':
        return <History />;
      case 'profile':
        return <Profile />;
      default:
        return <Hub />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentView}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {renderView()}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}

export default function App() {
  return <AppContent />;
}
