import React from 'react';
import { UserAccount } from '../types';
import { 
  Shield, 
  Cloud, 
  Moon, 
  Sun, 
  History, 
  User, 
  LogIn
} from 'lucide-react';

interface NavbarProps {
  user: UserAccount;
  onOpenAuth: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  onOpenAdmin: () => void;
  onOpenDeployGuide: () => void;
  onOpenTripsHistory: () => void;
  tripHistoryCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  onOpenAuth,
  isDarkMode,
  onToggleDarkMode,
  onOpenAdmin,
  onOpenDeployGuide,
  onOpenTripsHistory,
  tripHistoryCount
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 transition-colors shadow-sm">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2 sm:gap-4">
        {/* Brand Logo */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-tr from-amber-400 via-yellow-400 to-amber-500 shadow-md shadow-amber-400/20 flex items-center justify-center text-lg sm:text-xl">
            🚕
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-base sm:text-lg font-black tracking-tight text-slate-900 dark:text-white">
                Ride<span className="text-blue-600 dark:text-blue-400">Compare</span>
              </span>
              <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded-md bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                PRO
              </span>
            </div>
            <p className="hidden md:block text-[10px] text-slate-500 dark:text-slate-400 -mt-0.5">
              Uber • Ola • Rapido • inDrive • BluSmart • E-Rickshaw
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          {/* USER LOGIN / PROFILE BUTTON (PROMINENT) */}
          <button
            onClick={onOpenAuth}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm active:scale-95 ${
              user.isLoggedIn
                ? 'bg-blue-600 text-white shadow-blue-500/20'
                : 'bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/70 dark:hover:bg-blue-900/70 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
            }`}
          >
            {user.isLoggedIn ? (
              <>
                <User className="w-3.5 h-3.5" />
                <span className="max-w-[80px] sm:max-w-none truncate">{user.name.split(' ')[0]}</span>
              </>
            ) : (
              <>
                <LogIn className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                <span>Login</span>
              </>
            )}
          </button>

          {/* Cloudflare Free Deploy Modal Button */}
          <button
            onClick={onOpenDeployGuide}
            className="px-2.5 sm:px-3 py-1.5 rounded-xl bg-orange-50 hover:bg-orange-100 dark:bg-orange-950/50 dark:hover:bg-orange-900/50 text-orange-700 dark:text-orange-300 border border-orange-200/80 dark:border-orange-800/60 text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm active:scale-95"
            title="Deploy on Cloudflare Pages (Free)"
          >
            <Cloud className="w-3.5 h-3.5 text-orange-500" />
            <span className="hidden sm:inline">Deploy</span>
            <span className="text-[10px] bg-orange-500 text-white px-1 rounded font-black">
              FREE
            </span>
          </button>

          {/* Trips History Button */}
          <button
            onClick={onOpenTripsHistory}
            className="p-2 sm:px-2.5 sm:py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center gap-1 transition-all"
            title="Recent searches and bookings"
          >
            <History className="w-4 h-4 text-slate-500" />
            <span className="hidden md:inline">Trips</span>
            {tripHistoryCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center">
                {tripHistoryCount}
              </span>
            )}
          </button>

          {/* Admin Control Center Button */}
          <button
            onClick={onOpenAdmin}
            className="p-2 sm:px-2.5 sm:py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center gap-1 transition-all"
            title="Admin panel & surge simulator"
          >
            <Shield className="w-4 h-4 text-blue-500" />
            <span className="hidden md:inline">Admin</span>
          </button>

          {/* Theme Toggle (Dark / Light Mode) */}
          <button
            onClick={onToggleDarkMode}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-all active:scale-95"
            title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
          </button>
        </div>
      </div>
    </header>
  );
};
