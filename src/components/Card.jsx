import { classNames } from '../utils/helpers';

export default function Card({ title, value, subtitle, icon: Icon, trend, trendUp, color = 'primary', className = '' }) {
    const colorMap = {
        primary: 'from-primary-500 to-primary-600',
        emerald: 'from-emerald-500 to-emerald-600',
        amber: 'from-amber-500 to-amber-600',
        rose: 'from-rose-500 to-rose-600',
        cyan: 'from-cyan-500 to-cyan-400',
        violet: 'from-violet-500 to-violet-400',
    };

    const glowMap = {
        primary: 'shadow-primary-500/20',
        emerald: 'shadow-emerald-500/20',
        amber: 'shadow-amber-500/20',
        rose: 'shadow-rose-500/20',
        cyan: 'shadow-cyan-500/20',
        violet: 'shadow-violet-500/20',
    };

    return (
        <div
            className={classNames(
                'relative group p-5 rounded-2xl overflow-hidden animate-fade-in-up',
                'bg-white dark:bg-slate-800/50',
                'border border-slate-200/80 dark:border-slate-700/50',
                'hover:shadow-lg transition-all duration-300',
                className
            )}
        >
            {/* Gradient accent at top */}
            <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${colorMap[color]}`} />

            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">
                        {title}
                    </p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">
                        {value}
                    </p>
                    {subtitle && (
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                            {subtitle}
                        </p>
                    )}
                    {trend && (
                        <div className={`flex items-center gap-1 mt-2 text-xs font-semibold ${trendUp ? 'text-emerald-500' : 'text-rose-500'}`}>
                            <span>{trendUp ? '↑' : '↓'}</span>
                            <span>{trend}</span>
                        </div>
                    )}
                </div>
                {Icon && (
                    <div className={`flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br ${colorMap[color]} shadow-lg ${glowMap[color]}`}>
                        <Icon className="w-6 h-6 text-white" />
                    </div>
                )}
            </div>
        </div>
    );
}
