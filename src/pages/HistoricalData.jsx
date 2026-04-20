import { useState, useEffect, useCallback } from 'react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import ChartContainer from '../components/ChartContainer';
import { ChartSkeleton } from '../components/Loader';
import { energyService } from '../services/api';
import { buildings } from '../data/mockData';
import { useTheme } from '../context/ThemeContext';

export default function HistoricalData() {
    const { darkMode } = useTheme();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedBuilding, setSelectedBuilding] = useState('');
    const [dateRange, setDateRange] = useState({ start: '', end: '' });

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const result = await energyService.getHistoricalData(
                selectedBuilding ? parseInt(selectedBuilding) : null,
                dateRange.start || null,
                dateRange.end || null
            );
            setData(result);
        } catch (err) {
            console.error('Failed to fetch historical data:', err);
        } finally {
            setLoading(false);
        }
    }, [selectedBuilding, dateRange]);

    useEffect(() => { fetchData(); }, [fetchData]);

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

    const selectClass = `px-3 py-2.5 rounded-xl text-sm bg-slate-50 dark:bg-slate-900/50
    border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white
    focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 transition-all`;

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Historical Data</h1>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Analyze energy consumption trends over time</p>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-end gap-4 p-5 bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-200/80 dark:border-slate-700/50">
                <div className="flex-1 min-w-[180px]">
                    <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider">Building</label>
                    <select
                        id="building-filter"
                        value={selectedBuilding}
                        onChange={(e) => setSelectedBuilding(e.target.value)}
                        className={selectClass + ' w-full'}
                    >
                        <option value="">All Buildings</option>
                        {buildings.map(b => (
                            <option key={b.id} value={b.id}>{b.name}</option>
                        ))}
                    </select>
                </div>
                <div className="min-w-[160px]">
                    <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider">Start Date</label>
                    <input
                        id="start-date"
                        type="date"
                        value={dateRange.start}
                        onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                        className={selectClass}
                    />
                </div>
                <div className="min-w-[160px]">
                    <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider">End Date</label>
                    <input
                        id="end-date"
                        type="date"
                        value={dateRange.end}
                        onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                        className={selectClass}
                    />
                </div>
                <button
                    id="apply-filters"
                    onClick={fetchData}
                    className="px-5 py-2.5 rounded-xl text-sm font-medium text-white
            bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700
            shadow-lg shadow-primary-500/25 transition-all"
                >
                    Apply Filters
                </button>
            </div>

            {/* Chart */}
            {loading ? (
                <ChartSkeleton />
            ) : (
                <ChartContainer
                    title="Consumption Trend"
                    subtitle={selectedBuilding ? `Building: ${buildings.find(b => b.id === parseInt(selectedBuilding))?.name}` : 'All buildings combined'}
                >
                    <ResponsiveContainer width="100%" height={400}>
                        <LineChart data={data} margin={{ top: 5, right: 5, bottom: 5, left: 0 }}>
                            <CartesianGrid stroke={gridColor} strokeDasharray="3 3" />
                            <XAxis dataKey="date" tick={{ fill: textColor, fontSize: 11 }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fill: textColor, fontSize: 11 }} axisLine={false} tickLine={false} />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                            <Line type="monotone" dataKey="consumption" name="Consumption" stroke="#3b82f6" strokeWidth={2.5} dot={false} activeDot={{ r: 5, fill: '#3b82f6' }} />
                            <Line type="monotone" dataKey="peak" name="Peak" stroke="#f43f5e" strokeWidth={2} strokeDasharray="5 5" dot={false} />
                            <Line type="monotone" dataKey="average" name="Average" stroke="#10b981" strokeWidth={2} strokeDasharray="3 3" dot={false} />
                        </LineChart>
                    </ResponsiveContainer>
                </ChartContainer>
            )}
        </div>
    );
}
