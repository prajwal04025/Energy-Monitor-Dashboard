import { NavLink } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import {
    LayoutDashboard,
    History,
    Building2,
    Bell,
    Settings,
    ChevronLeft,
    ChevronRight,
    Zap,
} from 'lucide-react';

const navItems = [
    { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/historical', icon: History, label: 'Historical Data' },
    { to: '/buildings', icon: Building2, label: 'Buildings' },
    { to: '/alerts', icon: Bell, label: 'Alerts' },
    { to: '/settings', icon: Settings, label: 'Settings' },
];

export default function Sidebar() {
    const { sidebarOpen, toggleSidebar } = useApp();

    return (
        <aside
            className={`fixed top-0 left-0 h-screen z-40 flex flex-col transition-all duration-300 ease-in-out
        ${sidebarOpen ? 'w-64' : 'w-20'}
        bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-700/50`}
        >
            {/* Logo */}
            <div className="flex items-center gap-3 px-5 h-16 border-b border-slate-200 dark:border-slate-700/50">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-cyan-500 shadow-lg shadow-primary-500/25">
                    <Zap className="w-5 h-5 text-white" />
                </div>
                {sidebarOpen && (
                    <div className="overflow-hidden">
                        <h1 className="text-lg font-bold text-slate-900 dark:text-white whitespace-nowrap">
                            EnergyOS
                        </h1>
                        <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">
                            Monitoring
                        </p>
                    </div>
                )}
            </div>

            {/* Navigation */}
            <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
                {navItems.map(({ to, icon: Icon, label }) => (
                    <NavLink
                        key={to}
                        to={to}
                        end={to === '/'}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200
              ${isActive
                                ? 'bg-primary-500/10 text-primary-600 dark:text-primary-400 shadow-sm'
                                : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200'
                            }`
                        }
                    >
                        <Icon className="w-5 h-5 flex-shrink-0" />
                        {sidebarOpen && <span className="whitespace-nowrap">{label}</span>}
                    </NavLink>
                ))}
            </nav>

            {/* Collapse toggle */}
            <button
                onClick={toggleSidebar}
                className="flex items-center justify-center mx-3 mb-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700
          text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
                {sidebarOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>
        </aside>
    );
}
