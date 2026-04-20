import { useState, useEffect } from 'react';
import { Save, RotateCcw, CheckCircle, AlertTriangle } from 'lucide-react';
import { energyService } from '../services/api';
import Loader from '../components/Loader';

export default function Settings() {
    const [settings, setSettings] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        (async () => {
            try {
                const data = await energyService.getSettings();
                setSettings(data);
            } catch (err) {
                console.error('Failed to fetch settings:', err);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    const validate = () => {
        const errs = {};
        if (!settings.maxConsumptionThreshold || settings.maxConsumptionThreshold < 100) {
            errs.maxConsumptionThreshold = 'Must be at least 100 kWh';
        }
        if (settings.maxConsumptionThreshold > 10000) {
            errs.maxConsumptionThreshold = 'Must be less than 10,000 kWh';
        }
        if (!settings.alertTriggerPercent || settings.alertTriggerPercent < 50 || settings.alertTriggerPercent > 100) {
            errs.alertTriggerPercent = 'Must be between 50% and 100%';
        }
        if (!settings.criticalThreshold || settings.criticalThreshold < 50 || settings.criticalThreshold > 100) {
            errs.criticalThreshold = 'Must be between 50% and 100%';
        }
        if (settings.alertTriggerPercent >= settings.criticalThreshold) {
            errs.alertTriggerPercent = 'Warning threshold must be lower than critical';
        }
        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleSave = async () => {
        if (!validate()) return;
        setSaving(true);
        try {
            await energyService.saveSettings(settings);
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        } catch (err) {
            console.error('Failed to save settings:', err);
        } finally {
            setSaving(false);
        }
    };

    const handleReset = () => {
        setSettings({
            maxConsumptionThreshold: 500,
            alertTriggerPercent: 85,
            criticalThreshold: 95,
            emailNotifications: true,
            smsNotifications: false,
        });
        setErrors({});
    };

    const handleChange = (key, value) => {
        setSettings(prev => ({ ...prev, [key]: value }));
        if (errors[key]) {
            setErrors(prev => {
                const next = { ...prev };
                delete next[key];
                return next;
            });
        }
    };

    const inputClass = (field) =>
        `w-full px-4 py-3 rounded-xl text-sm bg-slate-50 dark:bg-slate-900/50
    border ${errors[field] ? 'border-rose-500 focus:ring-rose-500/30' : 'border-slate-200 dark:border-slate-700 focus:ring-primary-500/30 focus:border-primary-500'}
    text-slate-900 dark:text-white placeholder-slate-400
    focus:outline-none focus:ring-2 transition-all`;

    if (loading) return <Loader text="Loading settings..." />;

    return (
        <div className="space-y-6 max-w-2xl">
            <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Settings</h1>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Configure thresholds and alert triggers</p>
            </div>

            {/* Save confirmation */}
            {saved && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 text-sm font-medium animate-fade-in-up">
                    <CheckCircle className="w-4 h-4" />
                    Settings saved successfully
                </div>
            )}

            <div className="bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-200/80 dark:border-slate-700/50 p-6 space-y-6 animate-fade-in-up">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-amber-500" />
                    Threshold Configuration
                </h2>

                {/* Max Consumption Threshold */}
                <div>
                    <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider">
                        Max Consumption Threshold (kWh)
                    </label>
                    <input
                        id="max-threshold"
                        type="number"
                        value={settings.maxConsumptionThreshold}
                        onChange={(e) => handleChange('maxConsumptionThreshold', Number(e.target.value))}
                        className={inputClass('maxConsumptionThreshold')}
                        placeholder="e.g. 500"
                    />
                    {errors.maxConsumptionThreshold && (
                        <p className="mt-1 text-xs text-rose-500">{errors.maxConsumptionThreshold}</p>
                    )}
                    <p className="mt-1 text-xs text-slate-400">Buildings exceeding this value will trigger alerts</p>
                </div>

                {/* Warning Threshold */}
                <div>
                    <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider">
                        Warning Alert Trigger (%)
                    </label>
                    <input
                        id="warning-threshold"
                        type="number"
                        value={settings.alertTriggerPercent}
                        onChange={(e) => handleChange('alertTriggerPercent', Number(e.target.value))}
                        className={inputClass('alertTriggerPercent')}
                        placeholder="e.g. 85"
                    />
                    {errors.alertTriggerPercent && (
                        <p className="mt-1 text-xs text-rose-500">{errors.alertTriggerPercent}</p>
                    )}
                    <p className="mt-1 text-xs text-slate-400">Warning alert triggers when usage reaches this % of threshold</p>
                </div>

                {/* Critical Threshold */}
                <div>
                    <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider">
                        Critical Alert Trigger (%)
                    </label>
                    <input
                        id="critical-threshold"
                        type="number"
                        value={settings.criticalThreshold}
                        onChange={(e) => handleChange('criticalThreshold', Number(e.target.value))}
                        className={inputClass('criticalThreshold')}
                        placeholder="e.g. 95"
                    />
                    {errors.criticalThreshold && (
                        <p className="mt-1 text-xs text-rose-500">{errors.criticalThreshold}</p>
                    )}
                </div>

                {/* Notification preferences */}
                <div className="pt-4 border-t border-slate-200 dark:border-slate-700/50">
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-4">Notification Preferences</h3>
                    <div className="space-y-3">
                        <label className="flex items-center gap-3 cursor-pointer group">
                            <input
                                id="email-notifications"
                                type="checkbox"
                                checked={settings.emailNotifications}
                                onChange={(e) => handleChange('emailNotifications', e.target.checked)}
                                className="w-4 h-4 rounded border-slate-300 dark:border-slate-600 text-primary-500 focus:ring-primary-500/30"
                            />
                            <span className="text-sm text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                                Email notifications for all alerts
                            </span>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer group">
                            <input
                                id="sms-notifications"
                                type="checkbox"
                                checked={settings.smsNotifications}
                                onChange={(e) => handleChange('smsNotifications', e.target.checked)}
                                className="w-4 h-4 rounded border-slate-300 dark:border-slate-600 text-primary-500 focus:ring-primary-500/30"
                            />
                            <span className="text-sm text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                                SMS notifications for critical alerts only
                            </span>
                        </label>
                    </div>
                </div>

                {/* Action buttons */}
                <div className="flex items-center gap-3 pt-4">
                    <button
                        id="save-settings"
                        onClick={handleSave}
                        disabled={saving}
                        className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-medium text-white
              bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700
              shadow-lg shadow-primary-500/25 disabled:opacity-50 transition-all"
                    >
                        <Save className="w-4 h-4" />
                        {saving ? 'Saving...' : 'Save Settings'}
                    </button>
                    <button
                        id="reset-settings"
                        onClick={handleReset}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium
              text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800
              hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
                    >
                        <RotateCcw className="w-4 h-4" />
                        Reset Defaults
                    </button>
                </div>
            </div>
        </div>
    );
}
