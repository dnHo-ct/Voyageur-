import { motion } from 'framer-motion';
import {
  Sword,
  Brain,
  Trophy,
  User,
  History,
  LogOut,
  LayoutDashboard,
} from 'lucide-react';
import { useStore } from '@/store/useStore';
import type { AppView } from '@/types';

const navItems: { view: AppView; label: string; icon: React.ElementType }[] = [
  { view: 'hub', label: 'Quest Hub', icon: LayoutDashboard },
  { view: 'skills', label: 'Skill Tree', icon: Brain },
  { view: 'achievements', label: 'Achievements', icon: Trophy },
  { view: 'history', label: 'History', icon: History },
  { view: 'profile', label: 'Profile', icon: User },
];

export function Sidebar() {
  const { currentView, setView, profile } = useStore();

  const xpProgress = (profile.currentXP / profile.xpToNextLevel) * 100;

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col h-screen sticky top-0">
      {/* Logo */}
      <div className="p-6 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center">
            <Sword className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-800 leading-tight">Voyager</h1>
            <p className="text-xs text-slate-400">Level up your life</p>
          </div>
        </div>
      </div>

      {/* Profile mini card */}
      <div className="p-4 mx-4 mt-4 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white font-bold text-lg">
            {profile.username.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-slate-800 text-sm truncate">{profile.username}</p>
            <p className="text-xs text-slate-500">Level {profile.level}</p>
          </div>
        </div>
        <div className="mt-3">
          <div className="flex justify-between text-xs mb-1">
            <span className="text-slate-500">{profile.currentXP} / {profile.xpToNextLevel} XP</span>
            <span className="text-amber-600 font-medium">{Math.round(xpProgress)}%</span>
          </div>
          <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${xpProgress}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-4 space-y-1">
        {navItems.map((item) => {
          const isActive = currentView === item.view;
          const Icon = item.icon;
          return (
            <motion.button
              key={item.view}
              onClick={() => setView(item.view)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-indigo-50 text-indigo-600'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
              }`}
              whileTap={{ scale: 0.98 }}
            >
              <Icon className="w-5 h-5" />
              {item.label}
              {isActive && (
                <motion.div
                  layoutId="sidebar-indicator"
                  className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-500"
                />
              )}
            </motion.button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-slate-100">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span>{profile.questsCompleted} quests done</span>
          <div className="flex items-center gap-1">
            <LogOut className="w-3 h-3" />
            <span>v1.0</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
