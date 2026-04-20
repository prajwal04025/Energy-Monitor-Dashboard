export default function Loader({ text = 'Loading...' }) {
    return (
        <div className="flex flex-col items-center justify-center py-20 animate-fade-in-up">
            <div className="relative w-12 h-12">
                <div className="absolute inset-0 rounded-full border-2 border-slate-200 dark:border-slate-700" />
                <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-primary-500 animate-spin" />
            </div>
            <p className="mt-4 text-sm text-slate-400">{text}</p>
        </div>
    );
}

export function Skeleton({ className = '' }) {
    return (
        <div className={`animate-pulse rounded-xl bg-slate-200 dark:bg-slate-700 ${className}`} />
    );
}

export function CardSkeleton() {
    return (
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/50">
            <Skeleton className="h-3 w-24 mb-3" />
            <Skeleton className="h-8 w-32 mb-2" />
            <Skeleton className="h-3 w-20" />
        </div>
    );
}

export function ChartSkeleton() {
    return (
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/50">
            <Skeleton className="h-4 w-36 mb-2" />
            <Skeleton className="h-3 w-24 mb-6" />
            <Skeleton className="h-64 w-full" />
        </div>
    );
}
