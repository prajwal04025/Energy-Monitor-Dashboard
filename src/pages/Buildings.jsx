import { useState, useEffect } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from 'recharts';
import DataTable from '../components/DataTable';
import ChartContainer from '../components/ChartContainer';
import { CardSkeleton, ChartSkeleton } from '../components/Loader';
import { energyService } from '../services/api';
import { getStatusColor } from '../utils/helpers';
import { useTheme } from '../context/ThemeContext';

export default function Buildings() {
    const { darkMode } = useTheme();
    const [buildings, setBuildings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            try {
                const data = await energyService.getBuildings();
                setBuildings(data);
            } catch (err) {
                console.error('Failed to fetch buildings:', err);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    const columns = [
        {
            key: 'name',
            label: 'Building',
            render: (val) => (
                <span className="font-medium text-slate-900 dark:text-white">{val}</span>
            ),
        },
        {
            key: 'consumption',
            label: 'Consumption (kWh)',
            render: (val) => (
                <span className="font-semibold">{val.toLocaleString()}</span>
            ),
        },
        {
            key: 'peak',
            label: 'Peak (kW)',
            render: (val) => val,
        },
        {
            key: 'avgDaily',
            label: 'Avg Daily',
            render: (val) => `${val} kWh`,
        },
        {
            key: 'status',
            label: 'Status',
            render: (val) => {
                const colors = getStatusColor(val);
                return (
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold ${colors.bg} ${colors.text} border ${colors.border}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${colors.dot}`} />
                        {val.charAt(0).toUpperCase() + val.slice(1)}
                    </span>
                );
            },
        },
    ];

    const barColors = buildings.map(b => {
        if (b.status === 'critical') return '#f43f5e';
        if (b.status === 'warning') return '#f59e0b';
        return '#3b82f6';
    });

    const gridColor = darkMode ? '#1e293b' : '#f1f5f9';
    const textColor = darkMode ? '#94a3b8' : '#64748b';

    const CustomTooltip = ({ active, payload }) => {
        if (!active || !payload?.length) return null;
        const d = payload[0].payload;
        return (
            <div className="bg-white dark:bg-slate-800 p-3 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700">
                <p className="text-sm font-semibold text-slate-900 dark:text-white mb-1">{d.name}</p>
                <p className="text-sm text-slate-600 dark:text-slate-300">{d.consumption} kWh</p>
            </div>
        );
    };

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} />)}
                </div>
                <ChartSkeleton />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Building Consumption</h1>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Compare energy usage across campus buildings</p>
            </div>

            {/* Bar chart comparison */}
            <ChartContainer title="Consumption Comparison" subtitle="Current consumption by building (kWh)">
                <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={buildings} margin={{ top: 5, right: 5, bottom: 50, left: 0 }}>
                        <CartesianGrid stroke={gridColor} strokeDasharray="3 3" vertical={false} />
                        <XAxis
                            dataKey="name"
                            tick={{ fill: textColor, fontSize: 10 }}
                            axisLine={false}
                            tickLine={false}
                            angle={-35}
                            textAnchor="end"
                            height={60}
                        />
                        <YAxis tick={{ fill: textColor, fontSize: 11 }} axisLine={false} tickLine={false} />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar dataKey="consumption" radius={[6, 6, 0, 0]} maxBarSize={50}>
                            {buildings.map((_, i) => (
                                <Cell key={i} fill={barColors[i]} fillOpacity={0.85} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </ChartContainer>

            {/* Table */}
            <DataTable columns={columns} data={buildings} searchKey="name" />
        </div>
    );
}
