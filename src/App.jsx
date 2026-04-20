import { Routes, Route } from 'react-router-dom';
import { useApp } from './context/AppContext';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import HistoricalData from './pages/HistoricalData';
import Buildings from './pages/Buildings';
import Alerts from './pages/Alerts';
import Settings from './pages/Settings';

export default function App() {
    const { sidebarOpen } = useApp();

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
            <Sidebar />
            <div
                className="transition-all duration-300 min-w-0 overflow-x-hidden"
                style={{ marginLeft: sidebarOpen ? '16rem' : '5rem' }}
            >
                <Navbar />
                <main className="p-6">
                    <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/historical" element={<HistoricalData />} />
                        <Route path="/buildings" element={<Buildings />} />
                        <Route path="/alerts" element={<Alerts />} />
                        <Route path="/settings" element={<Settings />} />
                    </Routes>
                </main>
            </div>
        </div>
    );
}
