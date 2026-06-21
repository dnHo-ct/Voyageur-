import { motion } from 'framer-motion';
import {
  CheckCircle2,
  Zap,
  Trophy,
  Flame,
  TrendingUp,
} from 'lucide-react';
import { useStore } from '@/store/useStore';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const typeConfig = {
  quest_complete: { icon: CheckCircle2, color: 'text-green-500', bg: 'bg-green-50', label: 'Quest' },
  level_up: { icon: Trophy, color: 'text-purple-500', bg: 'bg-purple-50', label: 'Level Up' },
  achievement_unlock: { icon: Zap, color: 'text-amber-500', bg: 'bg-amber-50', label: 'Achievement' },
  streak_update: { icon: Flame, color: 'text-orange-500', bg: 'bg-orange-50', label: 'Streak' },
};

export function History() {
  const { activityLog, profile } = useStore();

  // Generate mock weekly data for the chart
  const weeklyData = [
    { day: 'Mon', xp: 45 },
    { day: 'Tue', xp: 60 },
    { day: 'Wed', xp: 30 },
    { day: 'Thu', xp: 85 },
    { day: 'Fri', xp: 55 },
    { day: 'Sat', xp: 40 },
    { day: 'Sun', xp: profile.currentXP > 0 ? profile.currentXP : 25 },
  ];

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-slate-800">Activity History</h1>
        <p className="text-slate-500 mt-1">Track your progress and see how far you've come</p>
      </motion.div>

      {/* Weekly XP Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl border border-slate-200 p-6 mb-6"
      >
        <div className="flex items-center gap-2 mb-6">
          <TrendingUp className="w-5 h-5 text-indigo-500" />
          <h2 className="font-semibold text-slate-800">Weekly XP Earned</h2>
        </div>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={weeklyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#94a3b8', fontSize: 12 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#94a3b8', fontSize: 12 }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
              }}
              formatter={(value: number) => [`${value} XP`, 'Earned']}
            />
            <Bar
              dataKey="xp"
              fill="url(#bar-gradient)"
              radius={[6, 6, 0, 0]}
            />
            <defs>
              <linearGradient id="bar-gradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#818cf8" />
                <stop offset="100%" stopColor="#c084fc" />
              </linearGradient>
            </defs>
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Activity Feed */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-xl border border-slate-200 p-6"
      >
        <h2 className="font-semibold text-slate-800 mb-4">Recent Activity</h2>

        <div className="space-y-3">
          {activityLog.map((activity, index) => {
            const config = typeConfig[activity.type];
            const Icon = config.icon;

            return (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.03 }}
                className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 transition-colors"
              >
                <div className={`w-10 h-10 rounded-lg ${config.bg} flex items-center justify-center flex-shrink-0`}>
                  <Icon className={`w-5 h-5 ${config.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-700">{activity.title}</p>
                  <p className="text-xs text-slate-400">
                    {new Date(activity.timestamp).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
                {activity.xpGained > 0 && (
                  <span className="text-xs font-medium text-amber-600 bg-amber-50 px-2 py-1 rounded-lg">
                    +{activity.xpGained} XP
                  </span>
                )}
              </motion.div>
            );
          })}
        </div>

        {activityLog.length === 0 && (
          <div className="text-center py-8">
            <p className="text-slate-400">No activity yet. Start completing quests!</p>
          </div>
        )}
      </motion.div>
    </div>
  );
}
