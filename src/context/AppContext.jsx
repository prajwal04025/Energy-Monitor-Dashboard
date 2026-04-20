import { createContext, useContext, useState, useCallback } from 'react';

const AppContext = createContext();

const defaultSettings = {
    maxConsumptionThreshold: 500,
    alertTriggerPercent: 85,
    criticalThreshold: 95,
    emailNotifications: true,
    smsNotifications: false,
};

export function AppProvider({ children }) {
    const [settings, setSettings] = useState(() => {
        const saved = localStorage.getItem('energyDashboardSettings');
        return saved ? JSON.parse(saved) : defaultSettings;
    });

    const [alerts, setAlerts] = useState([]);
    const [sidebarOpen, setSidebarOpen] = useState(true);

    const updateSettings = useCallback((newSettings) => {
        setSettings(prev => {
            const updated = { ...prev, ...newSettings };
            localStorage.setItem('energyDashboardSettings', JSON.stringify(updated));
            return updated;
        });
    }, []);

    const addAlert = useCallback((alert) => {
        setAlerts(prev => [{ ...alert, id: Date.now(), time: new Date().toISOString() }, ...prev]);
    }, []);

    const dismissAlert = useCallback((id) => {
        setAlerts(prev => prev.filter(a => a.id !== id));
    }, []);

    const toggleSidebar = useCallback(() => {
        setSidebarOpen(prev => !prev);
    }, []);

    return (
        <AppContext.Provider value={{
            settings,
            updateSettings,
            alerts,
            addAlert,
            dismissAlert,
            sidebarOpen,
            toggleSidebar,
        }}>
            {children}
        </AppContext.Provider>
    );
}

export const useApp = () => useContext(AppContext);
