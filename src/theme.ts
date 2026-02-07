import { createTheme } from '@mui/material/styles'

const PRIMARY_GREEN = '#16a34a'
const PRIMARY_GREEN_DARK = '#15803d'
const LIGHT_GREEN_BG = '#E8F5E9'
const NEGATIVE_RED = '#dc2626'
const LIGHT_RED = '#fef2f2'

export const appTheme = createTheme({
  palette: {
    primary: {
      main: PRIMARY_GREEN,
      dark: PRIMARY_GREEN_DARK,
      light: '#4ade80',
      contrastText: '#fff',
    },
    success: {
      main: PRIMARY_GREEN,
      light: LIGHT_GREEN_BG,
    },
    error: {
      main: NEGATIVE_RED,
      light: LIGHT_RED,
    },
    background: {
      default: '#FAFAFA',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#1a1a1a',
      secondary: '#64748b',
    },
  },
  typography: {
    fontFamily: '"Poppins", "Inter", -apple-system, BlinkMacSystemFont, sans-serif',
    h4: { fontWeight: 600 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
    subtitle1: { fontWeight: 500 },
    body1: { fontWeight: 400 },
    body2: { fontWeight: 400 },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 10,
          fontWeight: 600,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
          border: '1px solid rgba(0,0,0,0.04)',
        },
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          '&:last-child': { paddingBottom: 24 },
          padding: 24,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
          border: '1px solid rgba(0,0,0,0.04)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 10,
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderRight: '1px solid rgba(0,0,0,0.06)',
          boxShadow: 'none',
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          marginLeft: 8,
          marginRight: 8,
          marginBottom: 4,
          '&.Mui-selected': {
            backgroundColor: LIGHT_GREEN_BG,
            '& .MuiListItemIcon-root': { color: PRIMARY_GREEN },
            '& .MuiListItemText-primary': { color: PRIMARY_GREEN, fontWeight: 600 },
            '&:hover': { backgroundColor: 'rgba(232, 245, 233, 0.8)' },
          },
          '&:hover': { backgroundColor: 'rgba(0,0,0,0.04)' },
        },
      },
    },
    MuiListItemIcon: {
      styleOverrides: {
        root: {
          color: '#64748b',
          minWidth: 40,
        },
      },
    },
  },
})
