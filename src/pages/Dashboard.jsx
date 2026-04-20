import { useState, useEffect, useCallback } from 'react';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { Zap, TrendingUp, Activity, Sun, Leaf, Gauge } from 'lucide-react';
import Card from '../components/Card';
import ChartContainer from '../components/ChartContainer';
import AlertBanner from '../components/AlertBanner';
import { CardSkeleton, ChartSkeleton } from '../components/Loader';
import { useInterval } from '../hooks/useInterval';
import { energyService } from '../services/api';
import { generateRealtimePoint } from '../data/mockData';
import { useTheme } from '../context/ThemeContext';

export default function Dashboard() {
    const { darkMode } = useTheme();
    const [summary, setSummary] = useState(null);
    const [chartData, setChartData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [criticalAlert, setCriticalAlert] = useState('Engineering Wing consumption exceeded 500 kWh — immediate action required');

    const fetchData = useCallback(async () => {
        try {
            const [summaryData, realtimeData] = await Promise.all([
                energyService.getDashboardSummary(),
                energyService.getRealtimeData(),
            ]);
            setSummary(summaryData);
            setChartData(realtimeData);
        } catch (err) {
            console.error('Failed to fetch dashboard data:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchData(); }, [fetchData]);

    // Live update every 3 seconds
    useInterval(() => {
        const newPoint = generateRealtimePoint();
        setChartData(prev => {
            const updated = [...prev.slice(1), newPoint];
            return updated;
        });
        // Animate summary values
        setSummary(prev => prev ? {
            ...prev,
            currentLoad: prev.currentLoad + Math.round(Math.random() * 10 - 5),
            totalConsumption: prev.totalConsumption + Math.round(Math.random() * 3),
        } : prev);
    }, 3000);

    const gridColor = darkMode ? '#1e293b' : '#f1f5f9';
    const textColor = darkMode ? '#94a3b8' : '#64748b';

    const CustomTooltip = ({ active, payload, label }) => {
        if (!active || !payload?.length) return null;
        return (
            <div className="bg-white dark:bg-slate-800 p-3 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700">
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">{label}</p>
                {payload.map((entry, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                        <span className="text-slate-600 dark:text-slate-300">{entry.name}:</span>
                        <span className="font-semibold text-slate-900 dark:text-white">{entry.value} kWh</span>
                    </div>
                ))}
            </div>
        );
    };

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)}
                </div>
                <ChartSkeleton />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Critical alert banner */}
            {criticalAlert && (
                <AlertBanner
                    severity="critical"
                    message={criticalAlert}
                    onDismiss={() => setCriticalAlert(null)}
                />
            )}

            {/* Stats cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <Card
                    title="Total Consumption"
                    value={`${summary.totalConsumption.toLocaleString()} kWh`}
                    subtitle="Today"
                    icon={Zap}
                    color="primary"
                    trend="3.2% vs yesterday"
                    trendUp={true}
                />
                <Card
                    title="Current Load"
                    value={`${summary.currentLoad} kW`}
                    subtitle="Real-time"
                    icon={Activity}
                    color="cyan"
                    trend="Live"
                    trendUp={true}
                />
                <Card
                    title="Peak Usage"
                    value={`${summary.peakUsage} kW`}
                    subtitle="24h max"
                    icon={TrendingUp}
                    color="rose"
                    trend="12:30 PM"
                />
                <Card
                    title="Solar Generation"
                    value={`${summary.solarGeneration} kWh`}
                    subtitle="Today"
                    icon={Sun}
                    color="amber"
                    trend="12.5% of total"
                    trendUp={true}
                />
                <Card
                    title="Efficiency"
                    value={`${summary.efficiency}%`}
                    subtitle="Score"
                    icon={Gauge}
                    color="emerald"
                    trend="↑ 2.1%"
                    trendUp={true}
                />
                <Card
                    title="CO₂ Saved"
                    value={`${summary.co2Saved} T`}
                    subtitle="This month"
                    icon={Leaf}
                    color="violet"
                    trend="On target"
                    trendUp={true}
                />
            </div>

            {/* Main chart */}
            <ChartContainer
                title="Energy Consumption Overview"
                subtitle="Real-time campus energy data (updates every 3s)"
                actions={
                    <div className="flex items-center gap-1.5">
                        <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-xs text-emerald-500 font-medium">Live</span>
                    </div>
                }
            >
                <ResponsiveContainer width="100%" height={350}>
                    <AreaChart data={chartData} margin={{ top: 5, right: 5, bottom: 5, left: 0 }}>
                        <defs>
                            <linearGradient id="gradConsumption" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.3} />
                                <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="gradSolar" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.3} />
                                <stop offset="100%" stopColor="#f59e0b" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="gradGrid" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.2} />
                                <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid stroke={gridColor} strokeDasharray="3 3" />
                        <XAxis dataKey="time" tick={{ fill: textColor, fontSize: 11 }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fill: textColor, fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `${v}`} />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                        <Area type="monotone" dataKey="consumption" name="Total" stroke="#3b82f6" fill="url(#gradConsumption)" strokeWidth={2} dot={false} />
                        <Area type="monotone" dataKey="solar" name="Solar" stroke="#f59e0b" fill="url(#gradSolar)" strokeWidth={2} dot={false} />
                        <Area type="monotone" dataKey="grid" name="Grid" stroke="#8b5cf6" fill="url(#gradGrid)" strokeWidth={2} dot={false} />
                    </AreaChart>
                </ResponsiveContainer>
            </ChartContainer>
        </div>
    );
}
