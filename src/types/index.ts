export type QuestCategory = 'physical' | 'mental' | 'social' | 'emotional' | 'creative';
export type QuestDifficulty = 'easy' | 'medium' | 'hard' | 'epic';
export type QuestStatus = 'active' | 'completed' | 'locked';

export interface SubTask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  category: QuestCategory;
  difficulty: QuestDifficulty;
  status: QuestStatus;
  xpReward: number;
  duration: number; // in minutes
  subTasks: SubTask[];
  createdAt: string;
  completedAt?: string;
  streakCount: number;
  lastCompletedDate?: string;
}

export interface SkillNode {
  id: string;
  name: string;
  category: QuestCategory;
  level: number;
  maxLevel: number;
  unlocked: boolean;
  description: string;
  requiredXP: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
  category: QuestCategory;
}

export interface UserProfile {
  username: string;
  level: number;
  currentXP: number;
  xpToNextLevel: number;
  totalXP: number;
  dailyStreak: number;
  longestStreak: number;
  lastActiveDate: string;
  focusTime: number; // total minutes
  questsCompleted: number;
  joinDate: string;
}

export interface ActivityLog {
  id: string;
  type: 'quest_complete' | 'level_up' | 'achievement_unlock' | 'streak_update';
  title: string;
  xpGained: number;
  timestamp: string;
}

export type AppView = 'hub' | 'skills' | 'achievements' | 'profile' | 'quest-detail' | 'history';
