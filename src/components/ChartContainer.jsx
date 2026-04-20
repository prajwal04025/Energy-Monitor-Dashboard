export default function ChartContainer({ title, subtitle, children, actions }) {
    return (
        <div className="bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-200/80 dark:border-slate-700/50 p-5 animate-fade-in-up">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-white">{title}</h3>
                    {subtitle && (
                        <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>
                    )}
                </div>
                {actions && <div className="flex items-center gap-2">{actions}</div>}
            </div>
            <div className="w-full">{children}</div>
        </div>
    );
}
