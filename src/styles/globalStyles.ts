import React from 'react';

// ============================================
// GLOBAL STYLES - Konsistensi UI di seluruh aplikasi
// ============================================

// ============================================
// COLORS - Palet warna utama aplikasi
// ============================================
export const Colors = {
  // Primary colors
  primary: '#40ACE2', // Blue - warna utama
  primaryDark: '#2B9CD9',
  primaryLight: '#E6F5FC',
  primaryHover: '#2B9CD9',

  // Secondary colors
  secondary: '#99DDFF',
  secondaryDark: '#7DD3FF',
  secondaryLight: '#E6F5FC',

  // Text colors
  textPrimary: '#1e293b', // Dark gray - teks utama
  textSecondary: '#475569', // Medium gray - teks sekunder
  textMuted: '#64748b', // Light gray - teks tersier
  textDisabled: '#94a3b8', // Disabled text
  textWhite: '#ffffff',

  // Background colors
  background: '#ffffff',
  backgroundLight: '#f8fafc',
  backgroundGray: '#f1f5f9',
  backgroundHover: 'rgba(0, 0, 0, 0.02)',

  // Border colors
  border: '#e5e7eb',
  borderLight: '#f0f0f0',
  borderDark: '#d1d5db',

  // Status colors
  success: '#10b981',
  successLight: '#d1fae5',
  warning: '#f59e0b',
  warningLight: '#fef3c7',
  error: '#ef4444',
  errorLight: '#fee2e2',
  info: '#3b82f6',
  infoLight: '#dbeafe',

  // Channel colors
  channelLiveChat: '#2563EB',
  channelVoice: '#10b981',
  channelVideo: '#8b5cf6',
  channelEmail: '#f59e0b',

  // Request Type colors
  requestSTT: '#2563EB',
  requestLLM: '#8b5cf6',
  requestTTS: '#10b981',
};

// Dark mode colors
export const DarkColors = {
  textPrimary: '#f1f5f9',
  textSecondary: '#cbd5e1',
  textMuted: '#94a3b8',
  textDisabled: '#64748b',
  
  background: 'rgba(17, 25, 40, 0.9)',
  backgroundLight: 'rgba(30, 41, 59, 0.6)',
  backgroundGray: 'rgba(15, 23, 42, 0.8)',
  backgroundHover: 'rgba(30, 41, 59, 0.6)',
  
  border: 'rgba(148, 163, 184, 0.18)',
  borderLight: 'rgba(148, 163, 184, 0.12)',
  borderDark: 'rgba(148, 163, 184, 0.24)',
};

// ============================================
// SPACING - Padding dan margin standar
// ============================================
export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
} as const;

// ============================================
// TYPOGRAPHY - Ukuran font dan weight
// ============================================
export const Typography = {
  // Font sizes
  xs: 10,
  sm: 12,
  base: 14,
  md: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  xxxl: 28,
  huge: 32,
  massive: 48,

  // Font weights
  regular: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
  extrabold: 800,

  // Line heights
  lineHeightTight: 1.2,
  lineHeightNormal: 1.5,
  lineHeightRelaxed: 1.75,

  // Font family
  fontFamily: "'Inter', sans-serif",
} as const;

// ============================================
// BORDER RADIUS - Radius standar
// ============================================
export const BorderRadius = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  xxl: 20,
  round: 30,
  full: 9999,
} as const;

// ============================================
// SHADOWS - Shadow styles untuk elevation
// ============================================
export const Shadows = {
  // Shadow kecil untuk card ringan
  sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
  // Shadow medium untuk card standar
  md: '0 1px 3px rgba(0, 0, 0, 0.1)',
  // Shadow besar untuk modal/dialog
  lg: '0 4px 6px rgba(0, 0, 0, 0.1)',
  // Shadow extra large
  xl: '0 10px 15px rgba(0, 0, 0, 0.1)',
  // Shadow untuk primary button
  primary: '0 4px 12px rgba(37, 99, 235, 0.3)',
} as const;

// ============================================
// TRANSITIONS - Transisi standar
// ============================================
export const Transitions = {
  fast: '0.15s ease',
  base: '0.2s ease',
  slow: '0.3s ease',
} as const;

// ============================================
// GLOBAL STYLES - Style umum yang sering digunakan
// ============================================
export const GlobalStyles = {
  // Container styles
  container: {
    padding: 0,
  },
  containerFluid: {
    padding: Spacing.xl,
  },

  // Card styles
  card: {
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    boxShadow: Shadows.md,
    border: `1px solid ${Colors.borderLight}`,
    transition: Transitions.base,
  },
  cardHover: {
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    boxShadow: Shadows.md,
    border: `1px solid ${Colors.borderLight}`,
    transition: Transitions.base,
    cursor: 'pointer',
    '&:hover': {
      boxShadow: Shadows.lg,
      transform: 'translateY(-2px)',
    },
  },
  cardFlat: {
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
  },

  // Text styles
  textPrimary: {
    color: Colors.textPrimary,
    fontSize: Typography.base,
    fontWeight: Typography.regular,
    fontFamily: Typography.fontFamily,
  },
  textSecondary: {
    color: Colors.textSecondary,
    fontSize: Typography.sm,
    fontWeight: Typography.regular,
    fontFamily: Typography.fontFamily,
  },
  textMuted: {
    color: Colors.textMuted,
    fontSize: Typography.sm,
    fontWeight: Typography.regular,
    fontFamily: Typography.fontFamily,
  },
  textBold: {
    fontWeight: Typography.bold,
  },
  textSemibold: {
    fontWeight: Typography.semibold,
  },
  textCenter: {
    textAlign: 'center' as const,
  },
  textRight: {
    textAlign: 'right' as const,
  },
  textUppercase: {
    textTransform: 'uppercase' as const,
    letterSpacing: 1,
  },

  // Heading styles
  heading1: {
    fontSize: Typography.xxxl,
    fontWeight: Typography.extrabold,
    color: Colors.textPrimary,
    fontFamily: Typography.fontFamily,
    lineHeight: Typography.lineHeightTight,
  },
  heading2: {
    fontSize: Typography.xxl,
    fontWeight: Typography.bold,
    color: Colors.textPrimary,
    fontFamily: Typography.fontFamily,
    lineHeight: Typography.lineHeightTight,
  },
  heading3: {
    fontSize: Typography.xl,
    fontWeight: Typography.bold,
    color: Colors.textPrimary,
    fontFamily: Typography.fontFamily,
    lineHeight: Typography.lineHeightNormal,
  },
  heading4: {
    fontSize: Typography.lg,
    fontWeight: Typography.semibold,
    color: Colors.textPrimary,
    fontFamily: Typography.fontFamily,
    lineHeight: Typography.lineHeightNormal,
  },

  // Button styles
  buttonPrimary: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
    color: Colors.textWhite,
    fontSize: Typography.base,
    fontWeight: Typography.semibold,
    borderRadius: BorderRadius.md,
    padding: `${Spacing.sm}px ${Spacing.lg}px`,
    border: 'none',
    cursor: 'pointer',
    transition: Transitions.base,
    '&:hover': {
      backgroundColor: Colors.primaryHover,
      borderColor: Colors.primaryHover,
      transform: 'translateY(-1px)',
      boxShadow: Shadows.md,
    },
    '&:active': {
      transform: 'translateY(0)',
    },
  },
  buttonSecondary: {
    backgroundColor: Colors.backgroundLight,
    borderColor: Colors.border,
    color: Colors.textPrimary,
    fontSize: Typography.base,
    fontWeight: Typography.semibold,
    borderRadius: BorderRadius.md,
    padding: `${Spacing.sm}px ${Spacing.lg}px`,
    border: `1px solid ${Colors.border}`,
    cursor: 'pointer',
    transition: Transitions.base,
    '&:hover': {
      backgroundColor: Colors.backgroundHover,
      borderColor: Colors.borderDark,
    },
  },
  buttonText: {
    backgroundColor: 'transparent',
    border: 'none',
    color: Colors.primary,
    fontSize: Typography.base,
    fontWeight: Typography.semibold,
    padding: `${Spacing.xs}px ${Spacing.md}px`,
    cursor: 'pointer',
    transition: Transitions.base,
    '&:hover': {
      color: Colors.primaryHover,
      backgroundColor: Colors.backgroundHover,
    },
  },

  // Input styles
  input: {
    backgroundColor: Colors.background,
    border: `1px solid ${Colors.border}`,
    borderRadius: BorderRadius.md,
    padding: `${Spacing.sm}px ${Spacing.md}px`,
    fontSize: Typography.base,
    color: Colors.textPrimary,
    fontFamily: Typography.fontFamily,
    transition: Transitions.base,
    '&:hover': {
      borderColor: Colors.borderDark,
    },
    '&:focus': {
      borderColor: Colors.primary,
      outline: 'none',
      boxShadow: `0 0 0 2px ${Colors.primaryLight}`,
    },
  },
  inputFocused: {
    borderColor: Colors.primary,
    boxShadow: `0 0 0 2px ${Colors.primaryLight}`,
  },

  // Table styles
  tableHeader: {
    padding: '15px',
    fontSize: Typography.xs,
    fontWeight: Typography.bold,
    textTransform: 'uppercase' as const,
    letterSpacing: 1,
    color: Colors.textMuted,
  },
  tableRowEven: {
    backgroundColor: Colors.background,
    transition: `background-color ${Transitions.base}`,
    '&:hover': {
      backgroundColor: Colors.backgroundHover,
    },
  },
  tableRowOdd: {
    backgroundColor: Colors.backgroundLight,
    transition: `background-color ${Transitions.base}`,
    '&:hover': {
      backgroundColor: Colors.backgroundHover,
    },
  },

  // Tag/Badge styles
  tagBase: {
    padding: `${Spacing.xs}px ${Spacing.md}px`,
    borderRadius: BorderRadius.md,
    fontWeight: Typography.semibold,
    fontSize: Typography.sm,
    border: 'none',
    display: 'inline-flex',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  tagChannelLiveChat: {
    backgroundColor: 'rgba(37, 99, 235, 0.1)',
    color: Colors.channelLiveChat,
  },
  tagChannelVoice: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    color: Colors.channelVoice,
  },
  tagChannelVideo: {
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    color: Colors.channelVideo,
  },
  tagChannelEmail: {
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    color: Colors.channelEmail,
  },
  tagRequestSTT: {
    backgroundColor: 'rgba(37, 99, 235, 0.1)',
    color: Colors.requestSTT,
  },
  tagRequestLLM: {
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    color: Colors.requestLLM,
  },
  tagRequestTTS: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    color: Colors.requestTTS,
  },

  // Divider
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    margin: `${Spacing.md}px 0`,
  },
  dividerVertical: {
    width: 1,
    backgroundColor: Colors.border,
    margin: `0 ${Spacing.md}px`,
  },

  // Spacing utilities
  marginTopXs: { marginTop: Spacing.xs },
  marginTopSm: { marginTop: Spacing.sm },
  marginTopMd: { marginTop: Spacing.md },
  marginTopLg: { marginTop: Spacing.lg },
  marginTopXl: { marginTop: Spacing.xl },
  marginBottomXs: { marginBottom: Spacing.xs },
  marginBottomSm: { marginBottom: Spacing.sm },
  marginBottomMd: { marginBottom: Spacing.md },
  marginBottomLg: { marginBottom: Spacing.lg },
  marginBottomXl: { marginBottom: Spacing.xl },
  paddingXs: { padding: Spacing.xs },
  paddingSm: { padding: Spacing.sm },
  paddingMd: { padding: Spacing.md },
  paddingLg: { padding: Spacing.lg },
  paddingXl: { padding: Spacing.xl },
  paddingHorizontalXs: { paddingLeft: Spacing.xs, paddingRight: Spacing.xs },
  paddingHorizontalSm: { paddingLeft: Spacing.sm, paddingRight: Spacing.sm },
  paddingHorizontalMd: { paddingLeft: Spacing.md, paddingRight: Spacing.md },
  paddingHorizontalLg: { paddingLeft: Spacing.lg, paddingRight: Spacing.lg },
  paddingHorizontalXl: { paddingLeft: Spacing.xl, paddingRight: Spacing.xl },
  paddingVerticalXs: { paddingTop: Spacing.xs, paddingBottom: Spacing.xs },
  paddingVerticalSm: { paddingTop: Spacing.sm, paddingBottom: Spacing.sm },
  paddingVerticalMd: { paddingTop: Spacing.md, paddingBottom: Spacing.md },
  paddingVerticalLg: { paddingTop: Spacing.lg, paddingBottom: Spacing.lg },
  paddingVerticalXl: { paddingTop: Spacing.xl, paddingBottom: Spacing.xl },
} as const;

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Menggabungkan style objects
 */
export const combineStyles = (...styles: Array<React.CSSProperties | undefined>): React.CSSProperties => {
  return Object.assign({}, ...styles.filter(Boolean));
};

/**
 * Mendapatkan style untuk tag berdasarkan channel
 */
export const getChannelTagStyle = (channel: string): React.CSSProperties => {
  const baseStyle = GlobalStyles.tagBase;
  switch (channel) {
    case 'Live Chat':
      return combineStyles(baseStyle, GlobalStyles.tagChannelLiveChat);
    case 'Voice':
      return combineStyles(baseStyle, GlobalStyles.tagChannelVoice);
    case 'Video':
      return combineStyles(baseStyle, GlobalStyles.tagChannelVideo);
    case 'Email':
      return combineStyles(baseStyle, GlobalStyles.tagChannelEmail);
    default:
      return baseStyle;
  }
};

/**
 * Mendapatkan style untuk tag berdasarkan request type
 */
export const getRequestTagStyle = (type: 'STT' | 'LLM' | 'TTS'): React.CSSProperties => {
  const baseStyle = GlobalStyles.tagBase;
  switch (type) {
    case 'STT':
      return combineStyles(baseStyle, GlobalStyles.tagRequestSTT);
    case 'LLM':
      return combineStyles(baseStyle, GlobalStyles.tagRequestLLM);
    case 'TTS':
      return combineStyles(baseStyle, GlobalStyles.tagRequestTTS);
    default:
      return baseStyle;
  }
};

/**
 * Mendapatkan warna berdasarkan channel
 */
export const getChannelColor = (channel: string): string => {
  switch (channel) {
    case 'Live Chat':
      return Colors.channelLiveChat;
    case 'Voice':
      return Colors.channelVoice;
    case 'Video':
      return Colors.channelVideo;
    case 'Email':
      return Colors.channelEmail;
    default:
      return Colors.textMuted;
  }
};

/**
 * Mendapatkan warna berdasarkan request type
 */
export const getRequestColor = (type: 'STT' | 'LLM' | 'TTS'): string => {
  switch (type) {
    case 'STT':
      return Colors.requestSTT;
    case 'LLM':
      return Colors.requestLLM;
    case 'TTS':
      return Colors.requestTTS;
    default:
      return Colors.textMuted;
  }
};

// Export default
export default GlobalStyles;
