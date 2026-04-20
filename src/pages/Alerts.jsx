import { useState, useEffect } from 'react';
import { AlertTriangle, CheckCircle, Info, Clock, Building2, Filter } from 'lucide-react';
import Loader from '../components/Loader';
import { energyService } from '../services/api';
import { getSeverityColor, formatDateTime } from '../utils/helpers';

export default function Alerts() {
    const [alerts, setAlerts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        (async () => {
            try {
                const data = await energyService.getAlerts();
                setAlerts(data);
            } catch (err) {
                console.error('Failed to fetch alerts:', err);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    const handleAcknowledge = async (id) => {
        try {
            await energyService.acknowledgeAlert(id);
            setAlerts(prev => prev.map(a => a.id === id ? { ...a, acknowledged: true } : a));
        } catch (err) {
            console.error('Failed to acknowledge alert:', err);
        }
    };

    const filtered = filter === 'all' ? alerts : alerts.filter(a => a.severity === filter);

    const severityIcon = (severity) => {
        switch (severity) {
            case 'critical': return <AlertTriangle className="w-4 h-4" />;
            case 'warning': return <AlertTriangle className="w-4 h-4" />;
            case 'info': return <Info className="w-4 h-4" />;
            default: return <Info className="w-4 h-4" />;
        }
    };

    const filterBtnClass = (val) =>
        `px-4 py-2 rounded-xl text-xs font-semibold transition-all ${filter === val
            ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/25'
            : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
        }`;

    // Summary counts
    const criticalCount = alerts.filter(a => a.severity === 'critical').length;
    const warningCount = alerts.filter(a => a.severity === 'warning').length;
    const infoCount = alerts.filter(a => a.severity === 'info').length;

    if (loading) return <Loader text="Loading alerts..." />;

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Alerts</h1>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">System alerts and notifications</p>
            </div>

            {/* Summary cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20">
                    <div className="w-10 h-10 rounded-xl bg-rose-500/20 flex items-center justify-center">
                        <AlertTriangle className="w-5 h-5 text-rose-500" />
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-rose-500">{criticalCount}</p>
                        <p className="text-xs text-rose-400 font-medium">Critical</p>
                    </div>
                </div>
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
                        <AlertTriangle className="w-5 h-5 text-amber-500" />
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-amber-500">{warningCount}</p>
                        <p className="text-xs text-amber-400 font-medium">Warnings</p>
                    </div>
                </div>
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-primary-500/10 border border-primary-500/20">
                    <div className="w-10 h-10 rounded-xl bg-primary-500/20 flex items-center justify-center">
                        <Info className="w-5 h-5 text-primary-500" />
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-primary-500">{infoCount}</p>
                        <p className="text-xs text-primary-400 font-medium">Informational</p>
                    </div>
                </div>
            </div>

            {/* Filter tabs */}
            <div className="flex items-center gap-2 flex-wrap">
                <Filter className="w-4 h-4 text-slate-400" />
                <button id="filter-all" onClick={() => setFilter('all')} className={filterBtnClass('all')}>All ({alerts.length})</button>
                <button id="filter-critical" onClick={() => setFilter('critical')} className={filterBtnClass('critical')}>Critical</button>
                <button id="filter-warning" onClick={() => setFilter('warning')} className={filterBtnClass('warning')}>Warning</button>
                <button id="filter-info" onClick={() => setFilter('info')} className={filterBtnClass('info')}>Info</button>
            </div>

            {/* Alert list */}
            <div className="space-y-3">
                {filtered.map((alert) => {
                    const colors = getSeverityColor(alert.severity);
                    return (
                        <div
                            key={alert.id}
                            className={`flex items-start gap-4 p-4 rounded-2xl border transition-all animate-fade-in-up
                ${alert.acknowledged ? 'opacity-60' : ''}
                ${colors.bg} ${colors.border}`}
                        >
                            <div className={`mt-0.5 ${colors.text}`}>
                                {severityIcon(alert.severity)}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className={`text-sm font-semibold ${colors.text}`}>{alert.message}</p>
                                <div className="flex items-center gap-3 mt-2 text-xs text-slate-400">
                                    <span className="flex items-center gap-1">
                                        <Clock className="w-3 h-3" />
                                        {formatDateTime(alert.time)}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Building2 className="w-3 h-3" />
                                        {alert.building}
                                    </span>
                                </div>
                            </div>
                            {!alert.acknowledged && (
                                <button
                                    onClick={() => handleAcknowledge(alert.id)}
                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium
                    bg-white/20 hover:bg-white/30 text-slate-700 dark:text-slate-200 transition-colors"
                                >
                                    <CheckCircle className="w-3.5 h-3.5" />
                                    Acknowledge
                                </button>
                            )}
                            {alert.acknowledged && (
                                <span className="flex items-center gap-1 text-xs text-emerald-500 font-medium">
                                    <CheckCircle className="w-3.5 h-3.5" />
                                    Resolved
                                </span>
                            )}
                        </div>
                    );
                })}
                {filtered.length === 0 && (
                    <div className="text-center py-12 text-slate-400">
                        <Info className="w-8 h-8 mx-auto mb-3 opacity-50" />
                        <p className="text-sm">No alerts found for this filter</p>
                    </div>
                )}
            </div>
        </div>
    );
}
