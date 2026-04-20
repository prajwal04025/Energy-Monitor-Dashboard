// Buildings data
export const buildings = [
    { id: 1, name: 'Main Administration', consumption: 342, status: 'normal', peak: 420, avgDaily: 310 },
    { id: 2, name: 'Science Block A', consumption: 478, status: 'warning', peak: 520, avgDaily: 430 },
    { id: 3, name: 'Engineering Wing', consumption: 512, status: 'critical', peak: 580, avgDaily: 470 },
    { id: 4, name: 'Library Complex', consumption: 198, status: 'normal', peak: 260, avgDaily: 180 },
    { id: 5, name: 'Student Center', consumption: 287, status: 'normal', peak: 350, avgDaily: 260 },
    { id: 6, name: 'Research Lab', consumption: 445, status: 'warning', peak: 500, avgDaily: 410 },
    { id: 7, name: 'Sports Complex', consumption: 156, status: 'normal', peak: 220, avgDaily: 140 },
    { id: 8, name: 'Residential Block', consumption: 389, status: 'normal', peak: 450, avgDaily: 360 },
    { id: 9, name: 'IT Center', consumption: 467, status: 'warning', peak: 510, avgDaily: 440 },
    { id: 10, name: 'Cafeteria Hub', consumption: 234, status: 'normal', peak: 300, avgDaily: 210 },
];

// Generate time-series data for the last 24 hours
function generateHourlyData() {
    const data = [];
    const now = new Date();
    for (let i = 23; i >= 0; i--) {
        const time = new Date(now - i * 3600000);
        const hour = time.getHours();
        // Simulate realistic load curve (higher during day)
        const base = hour >= 8 && hour <= 18 ? 350 : 150;
        const variation = Math.random() * 100 - 50;
        data.push({
            time: time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            timestamp: time.toISOString(),
            consumption: Math.round(base + variation),
            solar: Math.round((hour >= 6 && hour <= 18 ? Math.sin((hour - 6) / 12 * Math.PI) * 120 : 0) + Math.random() * 20),
            grid: Math.round(base + variation - (hour >= 6 && hour <= 18 ? Math.sin((hour - 6) / 12 * Math.PI) * 120 : 0)),
        });
    }
    return data;
}

// Generate historical data for 30 days
export function generateHistoricalData(buildingId = null, days = 30) {
    const data = [];
    const now = new Date();
    for (let i = days - 1; i >= 0; i--) {
        const date = new Date(now - i * 86400000);
        const baseConsumption = buildingId
            ? buildings.find(b => b.id === buildingId)?.avgDaily || 300
            : 2800;
        const dayOfWeek = date.getDay();
        const weekendFactor = dayOfWeek === 0 || dayOfWeek === 6 ? 0.6 : 1;
        data.push({
            date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            fullDate: date.toISOString().split('T')[0],
            consumption: Math.round(baseConsumption * weekendFactor + (Math.random() * 200 - 100)),
            peak: Math.round(baseConsumption * weekendFactor * 1.3 + Math.random() * 50),
            average: Math.round(baseConsumption * weekendFactor * 0.85),
        });
    }
    return data;
}

// Real-time simulation data point
export function generateRealtimePoint(prev) {
    const now = new Date();
    const hour = now.getHours();
    const base = hour >= 8 && hour <= 18 ? 350 : 150;
    const variation = Math.random() * 60 - 30;
    const consumption = Math.round(base + variation);
    return {
        time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        timestamp: now.toISOString(),
        consumption,
        solar: Math.round((hour >= 6 && hour <= 18 ? Math.sin((hour - 6) / 12 * Math.PI) * 120 : 0) + Math.random() * 15),
        grid: Math.round(consumption - (hour >= 6 && hour <= 18 ? Math.sin((hour - 6) / 12 * Math.PI) * 100 : 0)),
    };
}

export const hourlyData = generateHourlyData();

// Mock alerts
export const mockAlerts = [
    { id: 1, time: '2026-04-19T01:15:00', building: 'Engineering Wing', severity: 'critical', message: 'Consumption exceeded 500 kWh threshold', acknowledged: false },
    { id: 2, time: '2026-04-19T00:45:00', building: 'Science Block A', severity: 'warning', message: 'Consumption approaching threshold at 478 kWh', acknowledged: false },
    { id: 3, time: '2026-04-18T23:30:00', building: 'IT Center', severity: 'warning', message: 'Unusual consumption spike detected', acknowledged: true },
    { id: 4, time: '2026-04-18T22:10:00', building: 'Research Lab', severity: 'warning', message: 'HVAC system consuming above normal', acknowledged: true },
    { id: 5, time: '2026-04-18T20:00:00', building: 'Main Administration', severity: 'info', message: 'Scheduled maintenance completed', acknowledged: true },
    { id: 6, time: '2026-04-18T18:30:00', building: 'Student Center', severity: 'info', message: 'Energy saving mode activated', acknowledged: true },
    { id: 7, time: '2026-04-18T15:00:00', building: 'Engineering Wing', severity: 'critical', message: 'Peak load exceeded safety margin', acknowledged: true },
    { id: 8, time: '2026-04-18T12:00:00', building: 'Library Complex', severity: 'info', message: 'Solar generation at maximum capacity', acknowledged: true },
];

// Dashboard summary
export const dashboardSummary = {
    totalConsumption: 3508,
    currentLoad: 342,
    peakUsage: 580,
    solarGeneration: 89,
    efficiency: 87.5,
    co2Saved: 1.2,
};
