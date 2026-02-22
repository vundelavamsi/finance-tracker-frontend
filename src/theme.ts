import { createTheme } from '@mui/material/styles'

const BG_LIGHT = '#F8FAFC'
const CARD_BG = '#FFFFFF'
const HEADER_BG = '#FFFFFF'
const SIDEBAR_BG = '#FFFFFF'
const ACCENT_BLUE = '#137fec'
const ACCENT_BLUE_HOVER = '#2563EB'
const TEXT_PRIMARY = '#0F172A'
const TEXT_SECONDARY = '#64748B'
const SUCCESS = '#059669'
const ERROR = '#DC2626'
const BORDER = '#E2E8F0'

export const appTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: ACCENT_BLUE,
      dark: ACCENT_BLUE_HOVER,
      light: '#60A5FA',
      contrastText: '#FFFFFF',
    },
    background: {
      default: BG_LIGHT,
      paper: CARD_BG,
    },
    text: {
      primary: TEXT_PRIMARY,
      secondary: TEXT_SECONDARY,
    },
    success: { main: SUCCESS },
    error: { main: ERROR },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: { fontWeight: 600, color: TEXT_PRIMARY },
    h5: { fontWeight: 600, color: TEXT_PRIMARY },
    h6: { fontWeight: 600, color: TEXT_PRIMARY },
    body1: { color: TEXT_PRIMARY },
    body2: { color: TEXT_SECONDARY },
  },
  shape: { borderRadius: 12 },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: CARD_BG,
          border: `1px solid ${BORDER}`,
          borderRadius: 12,
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        },
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          color: TEXT_PRIMARY,
          '&:last-child': { paddingBottom: 24 },
          padding: 24,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: CARD_BG,
          border: `1px solid ${BORDER}`,
          borderRadius: 12,
          color: TEXT_PRIMARY,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 10,
          fontWeight: 600,
        },
        contained: {
          backgroundColor: ACCENT_BLUE,
          '&:hover': { backgroundColor: ACCENT_BLUE_HOVER },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 10,
            backgroundColor: '#FFFFFF',
            '& fieldset': { borderColor: BORDER },
            '&:hover fieldset': { borderColor: '#CBD5E1' },
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 600,
        },
      },
    },
    MuiTable: {
      styleOverrides: {
        root: {
          '& .MuiTableCell-head': {
            color: TEXT_SECONDARY,
            fontWeight: 600,
            borderBottom: `1px solid ${BORDER}`,
          },
          '& .MuiTableCell-body': {
            color: TEXT_PRIMARY,
            borderBottom: `1px solid ${BORDER}`,
          },
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          backgroundColor: CARD_BG,
          border: `1px solid ${BORDER}`,
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          backgroundColor: CARD_BG,
          border: `1px solid ${BORDER}`,
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          backgroundColor: CARD_BG,
          border: `1px solid ${BORDER}`,
        },
      },
    },
  },
})

export const themeColors = {
  BG_LIGHT,
  CARD_BG,
  HEADER_BG,
  SIDEBAR_BG,
  ACCENT_BLUE,
  ACCENT_BLUE_HOVER,
  TEXT_PRIMARY,
  TEXT_SECONDARY,
  SUCCESS,
  ERROR,
  BORDER,
}
