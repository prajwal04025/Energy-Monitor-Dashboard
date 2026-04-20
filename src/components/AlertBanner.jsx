import { AlertTriangle, X } from 'lucide-react';

export default function AlertBanner({ message, severity = 'warning', onDismiss }) {
    const bgMap = {
        critical: 'bg-gradient-to-r from-rose-500/15 to-rose-500/5 border-rose-500/30',
        warning: 'bg-gradient-to-r from-amber-500/15 to-amber-500/5 border-amber-500/30',
        info: 'bg-gradient-to-r from-primary-500/15 to-primary-500/5 border-primary-500/30',
    };

    const textMap = {
        critical: 'text-rose-500',
        warning: 'text-amber-500',
        info: 'text-primary-500',
    };

    return (
        <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border ${bgMap[severity]} animate-fade-in-up`}>
            <AlertTriangle className={`w-4 h-4 flex-shrink-0 ${textMap[severity]}`} />
            <p className={`flex-1 text-sm font-medium ${textMap[severity]}`}>{message}</p>
            {onDismiss && (
                <button
                    onClick={onDismiss}
                    className={`p-1 rounded-lg hover:bg-white/10 transition-colors ${textMap[severity]}`}
                >
                    <X className="w-4 h-4" />
                </button>
            )}
        </div>
    );
}
