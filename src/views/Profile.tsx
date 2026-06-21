import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Edit3,
  Save,
  X,
  AlertTriangle,
  Calendar,
  Zap,
  Trophy,
  Flame,
  Clock,
  Upload,
  FileJson,
  FileSpreadsheet,
  Check,
} from 'lucide-react';
import { useStore } from '@/store/useStore';
import { exportToJSON, importFromJSON, generateCSV } from '@/utils/exportData';

export function Profile() {
  const { profile, quests, skills, achievements, activityLog, updateUsername, resetProgress } = useStore();
  const [isEditing, setIsEditing] = useState(false);
  const [newUsername, setNewUsername] = useState(profile.username);
  const [showResetModal, setShowResetModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [importError, setImportError] = useState('');
  const [importSuccess, setImportSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSave = () => {
    if (newUsername.trim()) {
      updateUsername(newUsername.trim());
      setIsEditing(false);
    }
  };

  const handleReset = () => {
    resetProgress();
    setShowResetModal(false);
  };

  const handleExportJSON = () => {
    exportToJSON({
      version: '1.0.0',
      exportDate: new Date().toISOString(),
      profile,
      quests,
      skills,
      achievements,
      activityLog,
    });
  };

  const handleExportCSV = () => {
    generateCSV({
      version: '1.0.0',
      exportDate: new Date().toISOString(),
      profile,
      quests,
      skills,
      achievements,
      activityLog,
    });
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImportError('');
    setImportSuccess(false);

    try {
      const data = await importFromJSON(file);
      // Import data into store by resetting and rehydrating
      useStore.setState({
        profile: data.profile,
        quests: data.quests,
        skills: data.skills,
        achievements: data.achievements,
        activityLog: data.activityLog,
        currentView: 'hub',
        selectedQuestId: null,
      });
      setImportSuccess(true);
      setTimeout(() => {
        setShowImportModal(false);
        setImportSuccess(false);
      }, 1500);
    } catch (err) {
      setImportError(err instanceof Error ? err.message : 'Import failed');
    }
  };

  const joinDate = new Date(profile.joinDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const xpProgress = (profile.currentXP / profile.xpToNextLevel) * 100;

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-slate-800">Profile</h1>
        <p className="text-slate-500 mt-1">Manage your adventurer profile</p>
      </motion.div>

      {/* Profile Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl border border-slate-200 p-8 mb-6"
      >
        <div className="flex items-center gap-6 mb-6">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white font-bold text-3xl">
            {profile.username.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3">
              {isEditing ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    className="px-3 py-1.5 border border-slate-200 rounded-lg text-lg font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    autoFocus
                  />
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSave}
                    className="w-8 h-8 rounded-lg bg-green-50 text-green-600 flex items-center justify-center hover:bg-green-100 transition-colors"
                  >
                    <Save className="w-4 h-4" />
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setIsEditing(false);
                      setNewUsername(profile.username);
                    }}
                    className="w-8 h-8 rounded-lg bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-100 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </motion.button>
                </div>
              ) : (
                <>
                  <h2 className="text-2xl font-bold text-slate-800">{profile.username}</h2>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsEditing(true)}
                    className="w-8 h-8 rounded-lg bg-slate-50 text-slate-400 flex items-center justify-center hover:bg-slate-100 hover:text-slate-600 transition-colors"
                  >
                    <Edit3 className="w-4 h-4" />
                  </motion.button>
                </>
              )}
            </div>
            <p className="text-slate-500 mt-1">Level {profile.level} Adventurer</p>
            <div className="flex items-center gap-1 text-xs text-slate-400 mt-1">
              <Calendar className="w-3 h-3" />
              <span>Joined {joinDate}</span>
            </div>
          </div>
        </div>

        {/* XP Bar */}
        <div className="mb-6">
          <div className="flex justify-between text-sm mb-2">
            <span className="font-medium text-slate-600">Level {profile.level}</span>
            <span className="text-slate-500">{profile.currentXP} / {profile.xpToNextLevel} XP</span>
          </div>
          <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${xpProgress}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="bg-white rounded-xl border border-slate-200 p-5"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center">
              <Zap className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">{profile.totalXP}</p>
              <p className="text-xs text-slate-400">Total XP Earned</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl border border-slate-200 p-5"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center">
              <Trophy className="w-5 h-5 text-purple-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">{profile.questsCompleted}</p>
              <p className="text-xs text-slate-400">Quests Completed</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-white rounded-xl border border-slate-200 p-5"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center">
              <Flame className="w-5 h-5 text-orange-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">{profile.longestStreak}</p>
              <p className="text-xs text-slate-400">Best Streak</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl border border-slate-200 p-5"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
              <Clock className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">{Math.floor(profile.focusTime / 60)}h</p>
              <p className="text-xs text-slate-400">Focus Time</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Data Export / Import */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.22 }}
        className="bg-white rounded-xl border border-slate-200 p-6 mb-6"
      >
        <h3 className="font-semibold text-slate-800 mb-1">Data Management</h3>
        <p className="text-sm text-slate-400 mb-4">Export or import your progress</p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={handleExportJSON}
            className="flex items-center gap-2.5 px-4 py-3 bg-indigo-50 text-indigo-600 rounded-xl text-sm font-medium hover:bg-indigo-100 transition-colors"
          >
            <FileJson className="w-4 h-4" />
            Export JSON
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={handleExportCSV}
            className="flex items-center gap-2.5 px-4 py-3 bg-green-50 text-green-600 rounded-xl text-sm font-medium hover:bg-green-100 transition-colors"
          >
            <FileSpreadsheet className="w-4 h-4" />
            Export CSV
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              setImportError('');
              setImportSuccess(false);
              setShowImportModal(true);
            }}
            className="flex items-center gap-2.5 px-4 py-3 bg-amber-50 text-amber-600 rounded-xl text-sm font-medium hover:bg-amber-100 transition-colors"
          >
            <Upload className="w-4 h-4" />
            Import Data
          </motion.button>
        </div>
      </motion.div>

      {/* Danger Zone */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="bg-red-50 rounded-xl border border-red-100 p-6"
      >
        <h3 className="font-semibold text-red-700 mb-2">Danger Zone</h3>
        <p className="text-sm text-red-500 mb-4">
          Resetting your progress will erase all your quests, skills, achievements, and XP. This action cannot be undone.
        </p>
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowResetModal(true)}
          className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 transition-colors"
        >
          Reset All Progress
        </motion.button>
      </motion.div>

      {/* Import Modal */}
      <AnimatePresence>
        {showImportModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowImportModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-slate-800">Import Data</h3>
                <button
                  onClick={() => setShowImportModal(false)}
                  className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center transition-colors"
                >
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>

              {importSuccess ? (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="flex flex-col items-center py-8"
                >
                  <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
                    <Check className="w-8 h-8 text-green-500" />
                  </div>
                  <p className="text-lg font-semibold text-green-700">Import Successful!</p>
                  <p className="text-sm text-slate-400 mt-1">Your data has been restored.</p>
                </motion.div>
              ) : (
                <>
                  <p className="text-sm text-slate-500 mb-4">
                    Upload a previously exported Voyager JSON backup file to restore your progress.
                  </p>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".json"
                    onChange={handleFileSelect}
                    className="hidden"
                  />

                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full flex flex-col items-center gap-3 py-8 border-2 border-dashed border-slate-200 rounded-xl hover:border-indigo-300 hover:bg-indigo-50/50 transition-colors"
                  >
                    <Upload className="w-8 h-8 text-slate-400" />
                    <span className="text-sm font-medium text-slate-600">Click to select a JSON file</span>
                    <span className="text-xs text-slate-400">voyager-backup-YYYY-MM-DD.json</span>
                  </motion.button>

                  {importError && (
                    <motion.p
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-sm text-red-500 mt-3 text-center"
                    >
                      {importError}
                    </motion.p>
                  )}
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reset Confirmation Modal */}
      <AnimatePresence>
        {showResetModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowResetModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                </div>
                <h3 className="text-lg font-bold text-slate-800">Reset Progress?</h3>
              </div>
              <p className="text-sm text-slate-500 mb-6">
                This will permanently delete all your quests, XP, skills, achievements, and activity history. Are you sure?
              </p>
              <div className="flex items-center gap-3 justify-end">
                <button
                  onClick={() => setShowResetModal(false)}
                  className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={handleReset}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 transition-colors"
                >
                  Yes, Reset Everything
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
