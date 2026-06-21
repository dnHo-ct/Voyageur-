import { motion } from 'framer-motion';
import {
  Trophy,
  Footprints,
  Flame,
  Brain,
  Users,
  Zap,
  Palette,
  Star,
  Heart,
  Lock,
} from 'lucide-react';
import { useStore } from '@/store/useStore';
import type { QuestCategory } from '@/types';

const iconMap: Record<string, typeof Trophy> = {
  footprints: Footprints,
  flame: Flame,
  brain: Brain,
  users: Users,
  zap: Zap,
  palette: Palette,
  star: Star,
  heart: Heart,
  trophy: Trophy,
};

const categoryColors: Record<QuestCategory, string> = {
  physical: 'from-blue-400 to-blue-600',
  mental: 'from-purple-400 to-purple-600',
  social: 'from-green-400 to-green-600',
  emotional: 'from-pink-400 to-pink-600',
  creative: 'from-orange-400 to-orange-600',
};

export function Achievements() {
  const { achievements } = useStore();

  const unlockedCount = achievements.filter((a) => a.unlocked).length;
  const totalCount = achievements.length;

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-slate-800">Achievements</h1>
        <p className="text-slate-500 mt-1">
          {unlockedCount} of {totalCount} unlocked — keep going!
        </p>
      </motion.div>

      {/* Progress */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl border border-slate-200 p-6 mb-8"
      >
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-slate-600">Collection Progress</span>
          <span className="text-sm font-bold text-slate-800">{Math.round((unlockedCount / totalCount) * 100)}%</span>
        </div>
        <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-indigo-400 to-purple-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${(unlockedCount / totalCount) * 100}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
          />
        </div>
      </motion.div>

      {/* Achievements Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {achievements.map((achievement, index) => {
          const Icon = iconMap[achievement.icon] || Trophy;
          const gradient = categoryColors[achievement.category];

          return (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={achievement.unlocked ? { y: -2 } : {}}
              className={`bg-white rounded-xl border p-5 transition-shadow ${
                achievement.unlocked
                  ? 'border-slate-200 hover:shadow-md'
                  : 'border-slate-100 opacity-50'
              }`}
            >
              <div className="flex items-start gap-4">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    achievement.unlocked
                      ? `bg-gradient-to-br ${gradient}`
                      : 'bg-slate-100'
                  }`}
                >
                  {achievement.unlocked ? (
                    <Icon className="w-6 h-6 text-white" />
                  ) : (
                    <Lock className="w-5 h-5 text-slate-300" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-slate-800 text-sm">{achievement.title}</h3>
                  <p className="text-xs text-slate-400 mt-0.5">{achievement.description}</p>
                  {achievement.unlocked && achievement.unlockedAt && (
                    <p className="text-xs text-green-500 mt-2 font-medium">
                      Unlocked {new Date(achievement.unlockedAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
