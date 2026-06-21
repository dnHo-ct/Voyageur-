import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Flame,
  Clock,
  Zap,
  Trophy,
  Plus,
  X,
  Sword,
} from 'lucide-react';
import { useStore } from '@/store/useStore';
import { QuestCard } from '@/components/QuestCard';
import { StatsCard } from '@/components/StatsCard';
import type { QuestCategory, QuestDifficulty } from '@/types';

const categoryLabels: Record<QuestCategory, string> = {
  physical: 'Physical',
  mental: 'Mental',
  emotional: 'Emotional',
  social: 'Social',
  creative: 'Creative',
};

export function Hub() {
  const { profile, quests, addQuest } = useStore();
  const [showAddModal, setShowAddModal] = useState(false);
  const [activeCategory, setActiveCategory] = useState<QuestCategory | 'all'>('all');

  // Form state
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newCategory, setNewCategory] = useState<QuestCategory>('physical');
  const [newDifficulty, setNewDifficulty] = useState<QuestDifficulty>('easy');
  const [newDuration, setNewDuration] = useState(30);

  const filteredQuests = activeCategory === 'all'
    ? quests.filter((q) => q.status === 'active')
    : quests.filter((q) => q.status === 'active' && q.category === activeCategory);

  const handleAddQuest = () => {
    if (!newTitle.trim()) return;

    const xpMap: Record<QuestDifficulty, number> = {
      easy: 10,
      medium: 20,
      hard: 35,
      epic: 50,
    };

    addQuest({
      title: newTitle,
      description: newDesc || 'No description provided.',
      category: newCategory,
      difficulty: newDifficulty,
      xpReward: xpMap[newDifficulty],
      duration: newDuration,
      subTasks: [],
    });

    setNewTitle('');
    setNewDesc('');
    setNewCategory('physical');
    setNewDifficulty('easy');
    setNewDuration(30);
    setShowAddModal(false);
  };

  const categories: (QuestCategory | 'all')[] = ['all', 'physical', 'mental', 'social', 'emotional', 'creative'];

  return (
    <div className="p-8 max-w-5xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-slate-800">Quest Hub</h1>
        <p className="text-slate-500 mt-1">Welcome back, {profile.username}! Ready for today's adventures?</p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatsCard
          title="Daily Streak"
          value={profile.dailyStreak}
          subtitle={`Best: ${profile.longestStreak}`}
          icon={Flame}
          color="text-orange-500"
          bgColor="bg-orange-50"
          delay={0}
        />
        <StatsCard
          title="Focus Time"
          value={`${Math.floor(profile.focusTime / 60)}h ${profile.focusTime % 60}m`}
          subtitle="Total this week"
          icon={Clock}
          color="text-blue-500"
          bgColor="bg-blue-50"
          delay={0.05}
        />
        <StatsCard
          title="Total XP"
          value={profile.totalXP}
          subtitle={`Level ${profile.level}`}
          icon={Zap}
          color="text-amber-500"
          bgColor="bg-amber-50"
          delay={0.1}
        />
        <StatsCard
          title="Quests Done"
          value={profile.questsCompleted}
          subtitle="Keep it up!"
          icon={Trophy}
          color="text-purple-500"
          bgColor="bg-purple-50"
          delay={0.15}
        />
      </div>

      {/* Category Filter */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2 flex-wrap">
          {categories.map((cat) => (
            <motion.button
              key={cat}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeCategory === cat
                  ? 'bg-indigo-500 text-white'
                  : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
              }`}
            >
              {cat === 'all' ? 'All Quests' : categoryLabels[cat as QuestCategory]}
            </motion.button>
          ))}
        </div>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-500 text-white rounded-lg text-sm font-medium hover:bg-indigo-600 transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Quest
        </motion.button>
      </div>

      {/* Quests Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AnimatePresence mode="popLayout">
          {filteredQuests.map((quest, index) => (
            <QuestCard key={quest.id} quest={quest} index={index} />
          ))}
        </AnimatePresence>
      </div>

      {filteredQuests.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Sword className="w-8 h-8 text-slate-300" />
          </div>
          <p className="text-slate-400 font-medium">No quests in this category</p>
          <p className="text-slate-300 text-sm mt-1">Create a new quest to get started!</p>
        </motion.div>
      )}

      {/* Add Quest Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowAddModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-slate-800">Create New Quest</h2>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center transition-colors"
                >
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Quest Title</label>
                  <input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g., Morning Yoga Session"
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                  <textarea
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                    placeholder="Brief description of your quest..."
                    rows={2}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value as QuestCategory)}
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm bg-white"
                    >
                      {Object.entries(categoryLabels).map(([key, label]) => (
                        <option key={key} value={key}>{label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Difficulty</label>
                    <select
                      value={newDifficulty}
                      onChange={(e) => setNewDifficulty(e.target.value as QuestDifficulty)}
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm bg-white"
                    >
                      <option value="easy">Easy (+10 XP)</option>
                      <option value="medium">Medium (+20 XP)</option>
                      <option value="hard">Hard (+35 XP)</option>
                      <option value="epic">Epic (+50 XP)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Duration (minutes)</label>
                  <input
                    type="number"
                    value={newDuration}
                    onChange={(e) => setNewDuration(Number(e.target.value))}
                    min={5}
                    max={180}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                  />
                </div>

                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={handleAddQuest}
                  disabled={!newTitle.trim()}
                  className="w-full py-3 bg-indigo-500 text-white rounded-xl font-medium hover:bg-indigo-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                >
                  Create Quest
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
