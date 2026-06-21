import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Quest, SkillNode, Achievement, UserProfile, ActivityLog, AppView } from '@/types';

interface AppState {
  // Navigation
  currentView: AppView;
  selectedQuestId: string | null;
  setView: (view: AppView) => void;
  setSelectedQuest: (id: string | null) => void;

  // User
  profile: UserProfile;
  updateUsername: (name: string) => void;
  addXP: (amount: number) => void;
  updateStreak: () => void;

  // Quests
  quests: Quest[];
  addQuest: (quest: Omit<Quest, 'id' | 'createdAt' | 'status' | 'streakCount'>) => void;
  completeQuest: (id: string) => void;
  toggleSubTask: (questId: string, subTaskId: string) => void;
  deleteQuest: (id: string) => void;

  // Skills
  skills: SkillNode[];
  upgradeSkill: (id: string) => void;

  // Achievements
  achievements: Achievement[];

  // Activity
  activityLog: ActivityLog[];

  // Reset
  resetProgress: () => void;
}

const defaultProfile: UserProfile = {
  username: 'Aventurier',
  level: 1,
  currentXP: 0,
  xpToNextLevel: 100,
  totalXP: 0,
  dailyStreak: 1,
  longestStreak: 1,
  lastActiveDate: new Date().toISOString().split('T')[0],
  focusTime: 0,
  questsCompleted: 0,
  joinDate: new Date().toISOString().split('T')[0],
};

const defaultQuests: Quest[] = [
  {
    id: 'q1',
    title: 'Morning Jog',
    description: 'A refreshing 30-minute jog to start your day with energy.',
    category: 'physical',
    difficulty: 'easy',
    status: 'active',
    xpReward: 15,
    duration: 30,
    streakCount: 3,
    lastCompletedDate: new Date(Date.now() - 86400000).toISOString().split('T')[0],
    createdAt: new Date().toISOString(),
    subTasks: [
      { id: 's1', title: 'Warm up (5 min)', completed: false },
      { id: 's2', title: 'Run 2km', completed: false },
      { id: 's3', title: 'Cool down stretch', completed: false },
    ],
  },
  {
    id: 'q2',
    title: 'Meditation Session',
    description: 'Practice mindfulness and improve your mental clarity.',
    category: 'mental',
    difficulty: 'easy',
    status: 'active',
    xpReward: 10,
    duration: 15,
    streakCount: 5,
    lastCompletedDate: new Date(Date.now() - 86400000).toISOString().split('T')[0],
    createdAt: new Date().toISOString(),
    subTasks: [
      { id: 's4', title: 'Find a quiet space', completed: true },
      { id: 's5', title: 'Breathe deeply for 10 min', completed: false },
    ],
  },
  {
    id: 'q3',
    title: 'Read 20 Pages',
    description: 'Expand your knowledge by reading a book.',
    category: 'mental',
    difficulty: 'medium',
    status: 'active',
    xpReward: 20,
    duration: 45,
    streakCount: 2,
    lastCompletedDate: new Date(Date.now() - 172800000).toISOString().split('T')[0],
    createdAt: new Date().toISOString(),
    subTasks: [
      { id: 's6', title: 'Choose a book', completed: true },
      { id: 's7', title: 'Read 20 pages', completed: false },
      { id: 's8', title: 'Take notes', completed: false },
    ],
  },
  {
    id: 'q4',
    title: 'Call a Friend',
    description: 'Strengthen your social bonds.',
    category: 'social',
    difficulty: 'easy',
    status: 'active',
    xpReward: 15,
    duration: 20,
    streakCount: 0,
    createdAt: new Date().toISOString(),
    subTasks: [
      { id: 's9', title: 'Choose someone to call', completed: false },
      { id: 's10', title: 'Have a meaningful conversation', completed: false },
    ],
  },
  {
    id: 'q5',
    title: 'Creative Writing',
    description: 'Write 500 words about anything that inspires you.',
    category: 'creative',
    difficulty: 'medium',
    status: 'active',
    xpReward: 25,
    duration: 60,
    streakCount: 1,
    lastCompletedDate: new Date(Date.now() - 86400000).toISOString().split('T')[0],
    createdAt: new Date().toISOString(),
    subTasks: [
      { id: 's11', title: 'Choose a topic', completed: false },
      { id: 's12', title: 'Write 500 words', completed: false },
      { id: 's13', title: 'Review and edit', completed: false },
    ],
  },
];

const defaultSkills: SkillNode[] = [
  { id: 'sk1', name: 'Endurance', category: 'physical', level: 2, maxLevel: 10, unlocked: true, description: 'Physical stamina and cardiovascular health', requiredXP: 0 },
  { id: 'sk2', name: 'Strength', category: 'physical', level: 1, maxLevel: 10, unlocked: true, description: 'Muscle power and body strength', requiredXP: 50 },
  { id: 'sk3', name: 'Focus', category: 'mental', level: 3, maxLevel: 10, unlocked: true, description: 'Ability to concentrate deeply', requiredXP: 0 },
  { id: 'sk4', name: 'Wisdom', category: 'mental', level: 1, maxLevel: 10, unlocked: true, description: 'Knowledge and insight', requiredXP: 30 },
  { id: 'sk5', name: 'Charisma', category: 'social', level: 1, maxLevel: 10, unlocked: true, description: 'Social skills and influence', requiredXP: 0 },
  { id: 'sk6', name: 'Empathy', category: 'emotional', level: 1, maxLevel: 10, unlocked: true, description: 'Understanding others\' feelings', requiredXP: 0 },
  { id: 'sk7', name: 'Imagination', category: 'creative', level: 2, maxLevel: 10, unlocked: true, description: 'Creative thinking and ideation', requiredXP: 0 },
  { id: 'sk8', name: 'Resilience', category: 'emotional', level: 0, maxLevel: 10, unlocked: false, description: 'Mental toughness and recovery', requiredXP: 100 },
  { id: 'sk9', name: 'Leadership', category: 'social', level: 0, maxLevel: 10, unlocked: false, description: 'Guiding and inspiring others', requiredXP: 150 },
  { id: 'sk10', name: 'Agility', category: 'physical', level: 0, maxLevel: 10, unlocked: false, description: 'Speed and flexibility', requiredXP: 80 },
];

const defaultAchievements: Achievement[] = [
  { id: 'a1', title: 'First Steps', description: 'Complete your first quest', icon: 'footprints', unlocked: true, unlockedAt: new Date().toISOString(), category: 'physical' },
  { id: 'a2', title: 'Streak Starter', description: 'Maintain a 3-day streak', icon: 'flame', unlocked: true, unlockedAt: new Date().toISOString(), category: 'physical' },
  { id: 'a3', title: 'Mindful Beginner', description: 'Complete 5 mental quests', icon: 'brain', unlocked: false, category: 'mental' },
  { id: 'a4', title: 'Social Butterfly', description: 'Complete 10 social quests', icon: 'users', unlocked: false, category: 'social' },
  { id: 'a5', title: 'Level 5 Reached', description: 'Reach level 5', icon: 'zap', unlocked: false, category: 'mental' },
  { id: 'a6', title: 'Creative Mind', description: 'Complete 5 creative quests', icon: 'palette', unlocked: false, category: 'creative' },
  { id: 'a7', title: 'Streak Master', description: 'Maintain a 14-day streak', icon: 'flame', unlocked: false, category: 'physical' },
  { id: 'a8', title: 'Centurion', description: 'Earn 100 XP in a single day', icon: 'trophy', unlocked: false, category: 'mental' },
  { id: 'a9', title: 'Jack of All Trades', description: 'Complete quests in all categories', icon: 'star', unlocked: false, category: 'mental' },
  { id: 'a10', title: 'Emotional Intelligence', description: 'Complete 10 emotional quests', icon: 'heart', unlocked: false, category: 'emotional' },
];

const defaultActivities: ActivityLog[] = [
  { id: 'act1', type: 'quest_complete', title: 'Morning Jog completed', xpGained: 15, timestamp: new Date(Date.now() - 86400000).toISOString() },
  { id: 'act2', type: 'quest_complete', title: 'Meditation Session completed', xpGained: 10, timestamp: new Date(Date.now() - 86400000).toISOString() },
  { id: 'act3', type: 'streak_update', title: '3-day streak maintained!', xpGained: 0, timestamp: new Date(Date.now() - 86400000).toISOString() },
];

function calculateXPToNextLevel(level: number): number {
  return Math.floor(100 * Math.pow(1.15, level - 1));
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      currentView: 'hub',
      selectedQuestId: null,
      profile: { ...defaultProfile },
      quests: [...defaultQuests],
      skills: [...defaultSkills],
      achievements: [...defaultAchievements],
      activityLog: [...defaultActivities],

      setView: (view) => set({ currentView: view }),
      setSelectedQuest: (id) => set({ selectedQuestId: id }),

      updateUsername: (name) =>
        set((state) => ({
          profile: { ...state.profile, username: name },
        })),

      addXP: (amount) =>
        set((state) => {
          let newXP = state.profile.currentXP + amount;
          let newLevel = state.profile.level;
          let xpToNext = state.profile.xpToNextLevel;
          const logs = [...state.activityLog];

          while (newXP >= xpToNext) {
            newXP -= xpToNext;
            newLevel++;
            xpToNext = calculateXPToNextLevel(newLevel);
            logs.unshift({
              id: `act_${Date.now()}_lvl`,
              type: 'level_up',
              title: `Level ${newLevel} reached!`,
              xpGained: 0,
              timestamp: new Date().toISOString(),
            });
          }

          return {
            profile: {
              ...state.profile,
              currentXP: newXP,
              level: newLevel,
              xpToNextLevel: xpToNext,
              totalXP: state.profile.totalXP + amount,
            },
            activityLog: logs,
          };
        }),

      updateStreak: () => {
        const state = get();
        const today = new Date().toISOString().split('T')[0];
        const lastActive = state.profile.lastActiveDate;

        if (lastActive === today) return;

        const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
        let newStreak = state.profile.dailyStreak;

        if (lastActive === yesterday) {
          newStreak++;
        } else if (lastActive !== today) {
          newStreak = 1;
        }

        set((s) => ({
          profile: {
            ...s.profile,
            dailyStreak: newStreak,
            longestStreak: Math.max(newStreak, s.profile.longestStreak),
            lastActiveDate: today,
          },
          activityLog: [
            {
              id: `act_${Date.now()}_stk`,
              type: 'streak_update',
              title: `${newStreak}-day streak!`,
              xpGained: 0,
              timestamp: new Date().toISOString(),
            },
            ...s.activityLog,
          ],
        }));
      },

      addQuest: (quest) =>
        set((state) => ({
          quests: [
            ...state.quests,
            {
              ...quest,
              id: `q_${Date.now()}`,
              createdAt: new Date().toISOString(),
              status: 'active',
              streakCount: 0,
            },
          ],
        })),

      completeQuest: (id) =>
        set((state) => {
          const quest = state.quests.find((q) => q.id === id);
          if (!quest || quest.status === 'completed') return state;

          const today = new Date().toISOString().split('T')[0];
          const wasYesterday = quest.lastCompletedDate === new Date(Date.now() - 86400000).toISOString().split('T')[0];

          const updatedQuests = state.quests.map((q) =>
            q.id === id
              ? {
                  ...q,
                  status: 'completed' as const,
                  completedAt: new Date().toISOString(),
                  streakCount: wasYesterday ? q.streakCount + 1 : 1,
                  lastCompletedDate: today,
                }
              : q
          );

          const logs = [
            {
              id: `act_${Date.now()}_qc`,
              type: 'quest_complete' as const,
              title: `${quest.title} completed`,
              xpGained: quest.xpReward,
              timestamp: new Date().toISOString(),
            },
            ...state.activityLog,
          ];

          const newTotalXP = state.profile.totalXP + quest.xpReward;
          let newCurrentXP = state.profile.currentXP + quest.xpReward;
          let newLevel = state.profile.level;
          let xpToNext = state.profile.xpToNextLevel;

          while (newCurrentXP >= xpToNext) {
            newCurrentXP -= xpToNext;
            newLevel++;
            xpToNext = calculateXPToNextLevel(newLevel);
            logs.unshift({
              id: `act_${Date.now()}_lvl`,
              type: 'level_up' as const,
              title: `Level ${newLevel} reached!`,
              xpGained: 0,
              timestamp: new Date().toISOString(),
            });
          }

          const newQuestsCompleted = state.profile.questsCompleted + 1;

          // Check achievements
          const updatedAchievements = state.achievements.map((a) => {
            if (a.unlocked) return a;
            let shouldUnlock = false;
            if (a.id === 'a1' && newQuestsCompleted >= 1) shouldUnlock = true;
            if (a.id === 'a2' && state.profile.dailyStreak >= 3) shouldUnlock = true;
            if (a.id === 'a3' && updatedQuests.filter((q) => q.category === 'mental' && q.status === 'completed').length >= 5) shouldUnlock = true;
            if (a.id === 'a5' && newLevel >= 5) shouldUnlock = true;
            if (shouldUnlock) {
              logs.unshift({
                id: `act_${Date.now()}_ach`,
                type: 'achievement_unlock' as const,
                title: `Achievement: ${a.title}`,
                xpGained: 0,
                timestamp: new Date().toISOString(),
              });
              return { ...a, unlocked: true, unlockedAt: new Date().toISOString() };
            }
            return a;
          });

          return {
            quests: updatedQuests,
            activityLog: logs,
            achievements: updatedAchievements,
            profile: {
              ...state.profile,
              currentXP: newCurrentXP,
              level: newLevel,
              xpToNextLevel: xpToNext,
              totalXP: newTotalXP,
              questsCompleted: newQuestsCompleted,
              focusTime: state.profile.focusTime + quest.duration,
            },
          };
        }),

      toggleSubTask: (questId, subTaskId) =>
        set((state) => ({
          quests: state.quests.map((q) =>
            q.id === questId
              ? {
                  ...q,
                  subTasks: q.subTasks.map((st) =>
                    st.id === subTaskId ? { ...st, completed: !st.completed } : st
                  ),
                }
              : q
          ),
        })),

      deleteQuest: (id) =>
        set((state) => ({
          quests: state.quests.filter((q) => q.id !== id),
        })),

      upgradeSkill: (id) =>
        set((state) => {
          const skill = state.skills.find((s) => s.id === id);
          if (!skill || !skill.unlocked || skill.level >= skill.maxLevel) return state;
          if (state.profile.totalXP < skill.requiredXP) return state;

          return {
            skills: state.skills.map((s) =>
              s.id === id ? { ...s, level: s.level + 1 } : s
            ),
          };
        }),

      resetProgress: () =>
        set({
          profile: { ...defaultProfile },
          quests: [...defaultQuests],
          skills: [...defaultSkills],
          achievements: [...defaultAchievements],
          activityLog: [...defaultActivities],
          currentView: 'hub',
          selectedQuestId: null,
        }),
    }),
    {
      name: 'voyager-storage',
      partialize: (state) => ({
        profile: state.profile,
        quests: state.quests,
        skills: state.skills,
        achievements: state.achievements,
        activityLog: state.activityLog,
      }),
    }
  )
);
