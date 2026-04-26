/**
 * Military Design Constants
 * Contains color schemes, status colors, and styling for military theme
 */

export const MILITARY_COLORS = {
  primary: '#1a1a1a',
  secondary: '#2a2a2a',
  accent: '#d97706',
  accentHover: '#b45309',
  success: '#059669',
  warning: '#dc2626',
  info: '#0891b2',
  text: '#e5e7eb',
  textMuted: '#9ca3af',
  border: '#404040',
  overlay: 'rgba(26, 26, 26, 0.8)',
};

export const STATUS_COLORS = {
  scheduled: 'bg-gray-900/40 border-gray-700 text-gray-300',
  outbound: 'bg-red-900/40 border-red-700 text-red-300',
  returning: 'bg-amber-900/40 border-amber-700 text-amber-300',
  landed: 'bg-green-900/40 border-green-700 text-green-300',
};

export const MAP_ROUTE_COLORS = {
  outbound: '#ef4444',
  returning: '#dc2626',
  destination: '#b91c1c',
  searchRadius: '#ea580c',
  polygon: '#92400e',
};

export function getStatusColor(status) {
  switch (status) {
    case 'Landed':
      return STATUS_COLORS.landed;
    case 'Returning':
      return STATUS_COLORS.returning;
    case 'Outbound':
      return STATUS_COLORS.outbound;
    default:
      return STATUS_COLORS.scheduled;
  }
}

export function getStatusBgColor(status) {
  switch (status) {
    case 'Landed':
      return 'bg-green-900/20';
    case 'Returning':
      return 'bg-amber-900/20';
    case 'Outbound':
      return 'bg-red-900/20';
    default:
      return 'bg-gray-900/20';
  }
}
