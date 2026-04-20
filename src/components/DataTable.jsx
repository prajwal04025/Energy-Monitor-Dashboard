import { useState, useMemo } from 'react';
import { ChevronUp, ChevronDown, Search } from 'lucide-react';

export default function DataTable({ columns, data, searchable = true, searchKey = 'name' }) {
    const [sortKey, setSortKey] = useState(null);
    const [sortDir, setSortDir] = useState('asc');
    const [search, setSearch] = useState('');

    const handleSort = (key) => {
        if (sortKey === key) {
            setSortDir(d => d === 'asc' ? 'desc' : 'asc');
        } else {
            setSortKey(key);
            setSortDir('asc');
        }
    };

    const filtered = useMemo(() => {
        let result = data;
        if (search) {
            result = result.filter(row =>
                String(row[searchKey]).toLowerCase().includes(search.toLowerCase())
            );
        }
        if (sortKey) {
            result = [...result].sort((a, b) => {
                const aVal = a[sortKey];
                const bVal = b[sortKey];
                if (typeof aVal === 'number') {
                    return sortDir === 'asc' ? aVal - bVal : bVal - aVal;
                }
                return sortDir === 'asc'
                    ? String(aVal).localeCompare(String(bVal))
                    : String(bVal).localeCompare(String(aVal));
            });
        }
        return result;
    }, [data, search, searchKey, sortKey, sortDir]);

    return (
        <div className="bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-200/80 dark:border-slate-700/50 overflow-hidden animate-fade-in-up">
            {searchable && (
                <div className="p-4 border-b border-slate-200 dark:border-slate-700/50">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            id="table-search"
                            type="text"
                            placeholder="Search..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm
                bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700
                text-slate-900 dark:text-white placeholder-slate-400
                focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500
                transition-all"
                        />
                    </div>
                </div>
            )}
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-slate-200 dark:border-slate-700/50">
                            {columns.map((col) => (
                                <th
                                    key={col.key}
                                    onClick={() => col.sortable !== false && handleSort(col.key)}
                                    className={`px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider
                    text-slate-400 dark:text-slate-500
                    ${col.sortable !== false ? 'cursor-pointer hover:text-slate-600 dark:hover:text-slate-300' : ''}`}
                                >
                                    <div className="flex items-center gap-1">
                                        {col.label}
                                        {sortKey === col.key && (
                                            sortDir === 'asc'
                                                ? <ChevronUp className="w-3 h-3" />
                                                : <ChevronDown className="w-3 h-3" />
                                        )}
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-700/30">
                        {filtered.map((row, idx) => (
                            <tr
                                key={row.id || idx}
                                className="hover:bg-slate-50 dark:hover:bg-slate-700/20 transition-colors"
                            >
                                {columns.map((col) => (
                                    <td key={col.key} className="px-5 py-3.5 text-sm text-slate-700 dark:text-slate-300">
                                        {col.render ? col.render(row[col.key], row) : row[col.key]}
                                    </td>
                                ))}
                            </tr>
                        ))}
                        {filtered.length === 0 && (
                            <tr>
                                <td colSpan={columns.length} className="px-5 py-10 text-center text-sm text-slate-400">
                                    No data found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
