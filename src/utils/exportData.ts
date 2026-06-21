import type { Quest, SkillNode, Achievement, UserProfile, ActivityLog } from '@/types';

export interface ExportData {
  version: string;
  exportDate: string;
  profile: UserProfile;
  quests: Quest[];
  skills: SkillNode[];
  achievements: Achievement[];
  activityLog: ActivityLog[];
}

export function exportToJSON(data: ExportData): void {
  const exportPayload: ExportData = {
    ...data,
    exportDate: new Date().toISOString(),
  };

  const blob = new Blob([JSON.stringify(exportPayload, null, 2)], {
    type: 'application/json',
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `voyager-backup-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function importFromJSON(file: File): Promise<ExportData> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string) as ExportData;
        // Validate basic structure
        if (!data.profile || !data.quests || !data.skills) {
          reject(new Error('Invalid backup file format'));
          return;
        }
        resolve(data);
      } catch {
        reject(new Error('Failed to parse backup file'));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
}

export function generateCSV(data: ExportData): void {
  // Quests CSV
  const questHeaders = ['Title', 'Category', 'Difficulty', 'Status', 'XP Reward', 'Duration (min)', 'Streak', 'Created At'];
  const questRows = data.quests.map((q) => [
    `"${q.title}"`,
    q.category,
    q.difficulty,
    q.status,
    q.xpReward,
    q.duration,
    q.streakCount,
    q.createdAt,
  ]);

  const csvContent = [
    questHeaders.join(','),
    ...questRows.map((row) => row.join(',')),
    '',
    `Total Quests,${data.quests.length}`,
    `Total XP,${data.profile.totalXP}`,
    `Current Level,${data.profile.level}`,
    `Daily Streak,${data.profile.dailyStreak}`,
    `Quests Completed,${data.profile.questsCompleted}`,
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `voyager-stats-${new Date().toISOString().split('T')[0]}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
