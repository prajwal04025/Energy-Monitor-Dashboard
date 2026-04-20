export function formatNumber(num) {
    if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
}

export function formatKwh(value) {
    return `${value.toLocaleString()} kWh`;
}

export function formatDateTime(isoString) {
    const date = new Date(isoString);
    return date.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}

export function formatTime(isoString) {
    const date = new Date(isoString);
    return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
    });
}

export function getStatusColor(status) {
    switch (status) {
        case 'critical': return { bg: 'bg-rose-500/10', text: 'text-rose-500', border: 'border-rose-500/30', dot: 'bg-rose-500' };
        case 'warning': return { bg: 'bg-amber-500/10', text: 'text-amber-500', border: 'border-amber-500/30', dot: 'bg-amber-500' };
        case 'normal':
        case 'info':
        default: return { bg: 'bg-emerald-500/10', text: 'text-emerald-500', border: 'border-emerald-500/30', dot: 'bg-emerald-500' };
    }
}

export function getSeverityColor(severity) {
    switch (severity) {
        case 'critical': return { bg: 'bg-rose-500/15', text: 'text-rose-400', border: 'border-rose-500/30', badge: 'bg-rose-500' };
        case 'warning': return { bg: 'bg-amber-500/15', text: 'text-amber-400', border: 'border-amber-500/30', badge: 'bg-amber-500' };
        case 'info':
        default: return { bg: 'bg-primary-500/15', text: 'text-primary-400', border: 'border-primary-500/30', badge: 'bg-primary-500' };
    }
}

export function classNames(...classes) {
    return classes.filter(Boolean).join(' ');
}
