import { motion } from 'framer-motion';
import {
  Sword,
  Brain,
  Heart,
  Users,
  Palette,
  Lock,
  ChevronUp,
  Star,
} from 'lucide-react';
import { useStore } from '@/store/useStore';
import type { QuestCategory } from '@/types';

const categoryConfig: Record<QuestCategory, { icon: typeof Sword; color: string; bg: string; label: string }> = {
  physical: { icon: Sword, color: 'text-blue-500', bg: 'bg-blue-50', label: 'Physical' },
  mental: { icon: Brain, color: 'text-purple-500', bg: 'bg-purple-50', label: 'Mental' },
  emotional: { icon: Heart, color: 'text-pink-500', bg: 'bg-pink-50', label: 'Emotional' },
  social: { icon: Users, color: 'text-green-500', bg: 'bg-green-50', label: 'Social' },
  creative: { icon: Palette, color: 'text-orange-500', bg: 'bg-orange-50', label: 'Creative' },
};

export function Skills() {
  const { skills, profile, upgradeSkill } = useStore();

  const categories = ['physical', 'mental', 'social', 'emotional', 'creative'] as QuestCategory[];

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-slate-800">Skill Tree</h1>
        <p className="text-slate-500 mt-1">Upgrade your abilities and unlock new potential</p>
      </motion.div>

      {/* Overall Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl p-5 text-white"
        >
          <p className="text-indigo-100 text-sm font-medium">Total Skill Levels</p>
          <p className="text-3xl font-bold mt-1">{skills.reduce((acc, s) => acc + s.level, 0)}</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="bg-white rounded-xl p-5 border border-slate-200"
        >
          <p className="text-slate-400 text-sm font-medium">Skills Unlocked</p>
          <p className="text-3xl font-bold text-slate-800 mt-1">
            {skills.filter((s) => s.unlocked).length}/{skills.length}
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl p-5 border border-slate-200"
        >
          <p className="text-slate-400 text-sm font-medium">Available XP</p>
          <p className="text-3xl font-bold text-amber-500 mt-1">{profile.totalXP}</p>
        </motion.div>
      </div>

      {/* Skills by Category */}
      <div className="space-y-8">
        {categories.map((category, catIndex) => {
          const config = categoryConfig[category];
          const categorySkills = skills.filter((s) => s.category === category);
          const Icon = config.icon;

          return (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: catIndex * 0.1 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-10 h-10 rounded-lg ${config.bg} flex items-center justify-center`}>
                  <Icon className={`w-5 h-5 ${config.color}`} />
                </div>
                <div>
                  <h2 className="font-semibold text-slate-800">{config.label}</h2>
                  <p className="text-xs text-slate-400">
                    {categorySkills.filter((s) => s.unlocked).length} unlocked
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {categorySkills.map((skill, index) => (
                  <motion.div
                    key={skill.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={skill.unlocked ? { y: -2 } : {}}
                    className={`bg-white rounded-xl border p-5 transition-shadow ${
                      skill.unlocked
                        ? 'border-slate-200 hover:shadow-md'
                        : 'border-slate-100 opacity-60'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-slate-800">{skill.name}</h3>
                          {!skill.unlocked && <Lock className="w-3.5 h-3.5 text-slate-400" />}
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">{skill.description}</p>
                      </div>
                      <div className={`w-8 h-8 rounded-lg ${config.bg} flex items-center justify-center`}>
                        <Star className={`w-4 h-4 ${skill.unlocked ? config.color : 'text-slate-300'}`} />
                      </div>
                    </div>

                    {skill.unlocked && (
                      <>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs text-slate-500">Level {skill.level}/{skill.maxLevel}</span>
                          <span className="text-xs text-slate-400">{Math.round((skill.level / skill.maxLevel) * 100)}%</span>
                        </div>
                        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden mb-3">
                          <motion.div
                            className={`h-full rounded-full ${
                              skill.level === skill.maxLevel
                                ? 'bg-gradient-to-r from-amber-400 to-amber-500'
                                : 'bg-gradient-to-r from-indigo-400 to-purple-500'
                            }`}
                            initial={{ width: 0 }}
                            animate={{ width: `${(skill.level / skill.maxLevel) * 100}%` }}
                            transition={{ duration: 0.8, ease: 'easeOut' }}
                          />
                        </div>

                        {skill.level < skill.maxLevel && (
                          <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={() => upgradeSkill(skill.id)}
                            disabled={profile.totalXP < skill.requiredXP}
                            className="w-full flex items-center justify-center gap-1.5 py-2 text-xs font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <ChevronUp className="w-3.5 h-3.5" />
                            Upgrade ({skill.requiredXP} XP)
                          </motion.button>
                        )}

                        {skill.level === skill.maxLevel && (
                          <div className="flex items-center justify-center gap-1.5 py-2 text-xs font-medium text-amber-600 bg-amber-50 rounded-lg">
                            <Star className="w-3.5 h-3.5" />
                            Max Level
                          </div>
                        )}
                      </>
                    )}

                    {!skill.unlocked && (
                      <div className="flex items-center justify-center gap-1.5 py-2 text-xs font-medium text-slate-400 bg-slate-50 rounded-lg">
                        <Lock className="w-3.5 h-3.5" />
                        Requires {skill.requiredXP} XP
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
