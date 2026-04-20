import axios from 'axios';
import { buildings, hourlyData, generateHistoricalData, mockAlerts, dashboardSummary } from '../data/mockData';

// Create Axios instance - ready to point to Spring Boot backend
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor
api.interceptors.request.use(
    (config) => {
        // Add auth token if available
        const token = localStorage.getItem('authToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            console.warn('Unauthorized - redirecting to login');
        }
        return Promise.reject(error);
    }
);

// ---- Mock API functions (replace with real API calls later) ----

// Simulate network delay
const delay = (ms = 600) => new Promise(resolve => setTimeout(resolve, ms));

export const energyService = {
    // Dashboard
    async getDashboardSummary() {
        await delay(400);
        return { ...dashboardSummary, currentLoad: dashboardSummary.currentLoad + Math.round(Math.random() * 40 - 20) };
    },

    async getRealtimeData() {
        await delay(200);
        return hourlyData;
    },

    // Buildings
    async getBuildings() {
        await delay(500);
        return buildings.map(b => ({
            ...b,
            consumption: b.consumption + Math.round(Math.random() * 20 - 10),
        }));
    },

    async getBuildingById(id) {
        await delay(300);
        return buildings.find(b => b.id === id);
    },

    // Historical data
    async getHistoricalData(buildingId = null, startDate = null, endDate = null) {
        await delay(600);
        let days = 30;
        if (startDate && endDate) {
            days = Math.ceil((new Date(endDate) - new Date(startDate)) / 86400000);
        }
        return generateHistoricalData(buildingId, days);
    },

    // Alerts
    async getAlerts() {
        await delay(400);
        return mockAlerts;
    },

    async acknowledgeAlert(id) {
        await delay(300);
        return { success: true, id };
    },

    // Settings
    async getSettings() {
        await delay(300);
        const saved = localStorage.getItem('energyDashboardSettings');
        return saved ? JSON.parse(saved) : {
            maxConsumptionThreshold: 500,
            alertTriggerPercent: 85,
            criticalThreshold: 95,
            emailNotifications: true,
            smsNotifications: false,
        };
    },

    async saveSettings(settings) {
        await delay(500);
        localStorage.setItem('energyDashboardSettings', JSON.stringify(settings));
        return { success: true, settings };
    },
};

export default api;
