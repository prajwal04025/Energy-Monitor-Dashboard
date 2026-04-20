import { useTheme } from '../context/ThemeContext';
import { useApp } from '../context/AppContext';
import { Sun, Moon, Bell, Menu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Navbar() {
    const { darkMode, toggleTheme } = useTheme();
    const { alerts, toggleSidebar } = useApp();
    const navigate = useNavigate();

    const unacknowledgedAlerts = alerts.length;
    const criticalAlerts = alerts.filter(a => a.severity === 'critical').length;

    return (
        <header className="sticky top-0 z-30 h-16 flex items-center justify-between px-6
      bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl
      border-b border-slate-200 dark:border-slate-700/50">
            {/* Left side */}
            <div className="flex items-center gap-4">
                <button
                    id="sidebar-toggle"
                    onClick={toggleSidebar}
                    className="lg:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                    <Menu className="w-5 h-5" />
                </button>
                <div>
                    <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                        Energy Dashboard
                    </h2>
                    <p className="text-xs text-slate-400">
                        Campus monitoring system • Live
                        <span className="inline-block w-1.5 h-1.5 ml-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    </p>
                </div>
            </div>

            {/* Right side */}
            <div className="flex items-center gap-2">
                {/* Theme toggle */}
                <button
                    id="theme-toggle"
                    onClick={toggleTheme}
                    className="p-2.5 rounded-xl text-slate-500 dark:text-slate-400
            hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200"
                    title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
                >
                    {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>

                {/* Alerts button */}
                <button
                    id="alerts-nav-button"
                    onClick={() => navigate('/alerts')}
                    className="relative p-2.5 rounded-xl text-slate-500 dark:text-slate-400
            hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200"
                >
                    <Bell className="w-5 h-5" />
                    {unacknowledgedAlerts > 0 && (
                        <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center min-w-[18px] h-[18px] px-1
              text-[10px] font-bold text-white bg-rose-500 rounded-full">
                            {unacknowledgedAlerts}
                        </span>
                    )}
                </button>

                {/* User avatar */}
                <div className="ml-2 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-violet-500 flex items-center justify-center
            text-white text-sm font-bold shadow-lg shadow-primary-500/20">
                        A
                    </div>
                </div>
            </div>
        </header>
    );
}
