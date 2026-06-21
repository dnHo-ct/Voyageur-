import { motion } from 'framer-motion';
import { Clock, Flame, Play, CheckCircle2, Zap } from 'lucide-react';
import { useStore } from '@/store/useStore';
import type { Quest } from '@/types';

const categoryColors: Record<string, { border: string; bg: string; icon: string }> = {
  physical: { border: 'border-blue-400', bg: 'bg-blue-50', icon: 'text-blue-500' },
  mental: { border: 'border-purple-400', bg: 'bg-purple-50', icon: 'text-purple-500' },
  social: { border: 'border-green-400', bg: 'bg-green-50', icon: 'text-green-500' },
  emotional: { border: 'border-pink-400', bg: 'bg-pink-50', icon: 'text-pink-500' },
  creative: { border: 'border-orange-400', bg: 'bg-orange-50', icon: 'text-orange-500' },
};

const difficultyLabels = {
  easy: { text: 'Easy', color: 'text-green-600 bg-green-100' },
  medium: { text: 'Medium', color: 'text-amber-600 bg-amber-100' },
  hard: { text: 'Hard', color: 'text-red-600 bg-red-100' },
  epic: { text: 'Epic', color: 'text-purple-600 bg-purple-100' },
};

interface QuestCardProps {
  quest: Quest;
  index: number;
}

export function QuestCard({ quest, index }: QuestCardProps) {
  const { setView, setSelectedQuest, completeQuest } = useStore();
  const colors = categoryColors[quest.category] || categoryColors.physical;
  const diff = difficultyLabels[quest.difficulty];

  const completedSubTasks = quest.subTasks.filter((st) => st.completed).length;
  const totalSubTasks = quest.subTasks.length;
  const progress = totalSubTasks > 0 ? (completedSubTasks / totalSubTasks) * 100 : 0;

  const handleStart = () => {
    setSelectedQuest(quest.id);
    setView('quest-detail');
  };

  const handleComplete = () => {
    completeQuest(quest.id);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      whileHover={{ y: -2, boxShadow: '0 8px 24px rgba(0,0,0,0.08)' }}
      className={`bg-white rounded-xl border-l-4 ${colors.border} shadow-sm hover:shadow-md transition-shadow p-5`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-xs font-medium px-2 py-0.5 rounded-md ${diff.color}`}>
              {diff.text}
            </span>
            {quest.streakCount > 0 && (
              <span className="flex items-center gap-1 text-xs text-orange-500 font-medium">
                <Flame className="w-3 h-3" />
                {quest.streakCount}
              </span>
            )}
          </div>
          <h3 className="font-semibold text-slate-800 text-base truncate">{quest.title}</h3>
          <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{quest.description}</p>
        </div>
        <div className={`w-10 h-10 rounded-lg ${colors.bg} flex items-center justify-center flex-shrink-0 ml-3`}>
          <Zap className={`w-5 h-5 ${colors.icon}`} />
        </div>
      </div>

      {/* Progress bar */}
      {totalSubTasks > 0 && (
        <div className="mb-3">
          <div className="flex justify-between text-xs mb-1">
            <span className="text-slate-400">Progress</span>
            <span className="text-slate-500">{completedSubTasks}/{totalSubTasks}</span>
          </div>
          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <motion.div
              className={`h-full ${colors.bg.replace('bg-', 'bg-').replace('50', '400')} rounded-full`}
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 text-xs text-slate-400">
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {quest.duration}m
          </span>
          <span className="flex items-center gap-1 text-amber-500 font-medium">
            <Zap className="w-3.5 h-3.5" />
            +{quest.xpReward} XP
          </span>
        </div>

        <div className="flex items-center gap-2">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleStart}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors"
          >
            <Play className="w-3.5 h-3.5" />
            Start
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleComplete}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-indigo-500 hover:bg-indigo-600 rounded-lg transition-colors"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            Done
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
