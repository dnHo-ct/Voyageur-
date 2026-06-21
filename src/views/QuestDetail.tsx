import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Clock,
  Zap,
  CheckCircle2,
  Circle,
  Flame,
  Play,
  Pause,
  Check,
  Trash2,
} from 'lucide-react';
import { useStore } from '@/store/useStore';

const categoryColors: Record<string, { bg: string; text: string; border: string }> = {
  physical: { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-200' },
  mental: { bg: 'bg-purple-50', text: 'text-purple-600', border: 'border-purple-200' },
  social: { bg: 'bg-green-50', text: 'text-green-600', border: 'border-green-200' },
  emotional: { bg: 'bg-pink-50', text: 'text-pink-600', border: 'border-pink-200' },
  creative: { bg: 'bg-orange-50', text: 'text-orange-600', border: 'border-orange-200' },
};

const difficultyConfig = {
  easy: { label: 'Easy', color: 'text-green-600 bg-green-100' },
  medium: { label: 'Medium', color: 'text-amber-600 bg-amber-100' },
  hard: { label: 'Hard', color: 'text-red-600 bg-red-100' },
  epic: { label: 'Epic', color: 'text-purple-600 bg-purple-100' },
};

export function QuestDetail() {
  const { selectedQuestId, quests, setView, toggleSubTask, completeQuest, deleteQuest } = useStore();
  const [timerRunning, setTimerRunning] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [showCompleteAnimation, setShowCompleteAnimation] = useState(false);

  const quest = quests.find((q) => q.id === selectedQuestId);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (timerRunning) {
      interval = setInterval(() => {
        setElapsedTime((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerRunning]);

  if (!quest) {
    return (
      <div className="p-8 flex flex-col items-center justify-center h-full">
        <p className="text-slate-400 mb-4">Quest not found</p>
        <button
          onClick={() => setView('hub')}
          className="px-4 py-2 bg-indigo-500 text-white rounded-lg text-sm"
        >
          Back to Hub
        </button>
      </div>
    );
  }

  const colors = categoryColors[quest.category] || categoryColors.physical;
  const diff = difficultyConfig[quest.difficulty];
  const completedSubTasks = quest.subTasks.filter((st) => st.completed).length;
  const totalSubTasks = quest.subTasks.length;
  const progress = totalSubTasks > 0 ? (completedSubTasks / totalSubTasks) * 100 : 0;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleComplete = () => {
    setShowCompleteAnimation(true);
    setTimeout(() => {
      completeQuest(quest.id);
      setView('hub');
    }, 1500);
  };

  const handleDelete = () => {
    deleteQuest(quest.id);
    setView('hub');
  };

  return (
    <div className="p-8 max-w-3xl mx-auto relative">
      {/* Completion Animation Overlay */}
      {showCompleteAnimation && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/90 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', damping: 10, stiffness: 100 }}
          >
            <CheckCircle2 className="w-24 h-24 text-green-500 mb-4" />
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-3xl font-bold text-slate-800"
          >
            Quest Complete!
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex items-center gap-2 mt-3 text-amber-500"
          >
            <Zap className="w-6 h-6" />
            <span className="text-2xl font-bold">+{quest.xpReward} XP</span>
          </motion.div>
        </motion.div>
      )}

      {/* Back button */}
      <motion.button
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={() => setView('hub')}
        className="flex items-center gap-2 text-slate-500 hover:text-slate-700 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="text-sm font-medium">Back to Hub</span>
      </motion.button>

      {/* Quest Hero */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`bg-white rounded-2xl border ${colors.border} p-8 mb-6`}
      >
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className={`text-xs font-medium px-2.5 py-1 rounded-lg ${diff.color}`}>
                {diff.label}
              </span>
              <span className={`text-xs font-medium px-2.5 py-1 rounded-lg ${colors.bg} ${colors.text}`}>
                {quest.category.charAt(0).toUpperCase() + quest.category.slice(1)}
              </span>
              {quest.streakCount > 0 && (
                <span className="flex items-center gap-1 text-xs text-orange-500 font-medium px-2.5 py-1 rounded-lg bg-orange-50">
                  <Flame className="w-3 h-3" />
                  {quest.streakCount} streak
                </span>
              )}
            </div>
            <h1 className="text-2xl font-bold text-slate-800">{quest.title}</h1>
            <p className="text-slate-500 mt-1">{quest.description}</p>
          </div>
        </div>

        {/* Progress Circle */}
        <div className="flex items-center justify-center my-8">
          <div className="relative w-40 h-40">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 160 160">
              <circle
                cx="80"
                cy="80"
                r="70"
                fill="none"
                stroke="#f1f5f9"
                strokeWidth="10"
              />
              <motion.circle
                cx="80"
                cy="80"
                r="70"
                fill="none"
                stroke="url(#progress-gradient)"
                strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 70}`}
                initial={{ strokeDashoffset: 2 * Math.PI * 70 }}
                animate={{ strokeDashoffset: 2 * Math.PI * 70 * (1 - progress / 100) }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
              />
              <defs>
                <linearGradient id="progress-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#818cf8" />
                  <stop offset="100%" stopColor="#c084fc" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold text-slate-800">{Math.round(progress)}%</span>
              <span className="text-xs text-slate-400">{completedSubTasks}/{totalSubTasks} done</span>
            </div>
          </div>
        </div>

        {/* Timer */}
        <div className="flex items-center justify-center gap-4 mb-6">
          <div className={`flex items-center gap-2 px-4 py-2 rounded-xl ${colors.bg}`}>
            <Clock className={`w-4 h-4 ${colors.text}`} />
            <span className={`text-sm font-medium ${colors.text}`}>
              {formatTime(elapsedTime)} / {quest.duration}m
            </span>
          </div>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setTimerRunning(!timerRunning)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
              timerRunning
                ? 'bg-amber-50 text-amber-600 hover:bg-amber-100'
                : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'
            }`}
          >
            {timerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            {timerRunning ? 'Pause' : 'Start Timer'}
          </motion.button>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-center gap-3">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleComplete}
            className="flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-xl font-medium hover:bg-green-600 transition-colors"
          >
            <Check className="w-5 h-5" />
            Complete Quest
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleDelete}
            className="flex items-center gap-2 px-4 py-3 bg-red-50 text-red-500 rounded-xl font-medium hover:bg-red-100 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </motion.button>
        </div>
      </motion.div>

      {/* Sub-tasks */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-2xl border border-slate-200 p-6"
      >
        <h3 className="font-semibold text-slate-800 mb-4">Sub-tasks</h3>
        {quest.subTasks.length === 0 ? (
          <p className="text-sm text-slate-400 text-center py-4">No sub-tasks for this quest</p>
        ) : (
          <div className="space-y-2">
            {quest.subTasks.map((subTask, index) => (
              <motion.div
                key={subTask.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => toggleSubTask(quest.id, subTask.id)}
                className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-colors ${
                  subTask.completed ? 'bg-green-50' : 'hover:bg-slate-50'
                }`}
              >
                {subTask.completed ? (
                  <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                ) : (
                  <Circle className="w-5 h-5 text-slate-300 flex-shrink-0" />
                )}
                <span className={`text-sm ${subTask.completed ? 'text-green-700 line-through' : 'text-slate-700'}`}>
                  {subTask.title}
                </span>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
