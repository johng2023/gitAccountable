/**
 * GitAccountable Design System
 * Modern minimal tech aesthetic with orange accent
 */

export const colors = {
  // Primary
  orange: '#F97316',
  orangeDark: '#ea580c',

  // Backgrounds
  bgPrimary: '#0f172a',      // Dark blue-black
  bgCard: '#1e293b',         // Slightly lighter for depth
  bgHover: '#334155',        // Interactive feedback

  // Text
  textPrimary: '#f1f5f9',    // High contrast white
  textSecondary: '#94a3b8',  // Readable but subtle
  textMuted: '#64748b',      // For placeholders

  // Borders
  border: '#334155',

  // Status colors
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
};

export const spacing = {
  xs: '8px',
  sm: '12px',
  md: '16px',
  lg: '24px',
  xl: '32px',
  xxl: '48px',
};

export const typography = {
  h1: 'text-4xl font-bold leading-tight tracking-tighter',
  h2: 'text-3xl font-semibold leading-tight',
  h3: 'text-2xl font-semibold',
  body: 'text-base font-normal leading-relaxed',
  small: 'text-sm font-normal',
  mono: 'font-mono text-sm',
};

export const componentClasses = {
  // Buttons
  buttonPrimary:
    'bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed',
  buttonSecondary:
    'border border-orange-500 text-orange-500 hover:bg-orange-500/10 px-6 py-3 rounded-lg font-medium transition-colors duration-200',
  buttonGhost:
    'text-white hover:bg-slate-700/50 px-4 py-2 rounded-lg transition-colors duration-200',

  // Cards
  card: 'bg-slate-800 border border-slate-700 rounded-lg p-6',
  cardInteractive: 'bg-slate-800 border border-slate-700 hover:border-orange-500 rounded-lg p-6 transition-colors duration-200 cursor-pointer',

  // Input
  input:
    'w-full bg-slate-900 border border-slate-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-orange-500 transition-colors duration-200 placeholder-slate-600',

  // Stats
  stat: 'bg-slate-800 border border-slate-700 rounded-lg p-4',
};

export const animations = {
  // Smooth transitions
  transition: 'transition-all duration-300 ease-out',
  colorTransition: 'transition-colors duration-200',
};
