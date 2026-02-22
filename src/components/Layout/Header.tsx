import { Link, useLocation } from 'react-router-dom'
import {
  Box,
  Button,
  Typography,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'

import { themeColors } from '../../theme'
const { ACCENT_BLUE } = themeColors

const PAGE_TITLES: Record<string, string> = {
  '/app': 'Main Dashboard Overview',
  '/app/transactions': 'Transactions',
  '/app/accounts': 'Accounts',
  '/app/configuration': 'Configuration',
  '/app/profile': 'User Profile',
}

export default function Header() {
  const location = useLocation()
  const pageTitle = PAGE_TITLES[location.pathname] || 'Dashboard'

  return (
    <Box
      component="header"
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        px: 4,
        height: 64,
        borderBottom: '1px solid #E2E8F0',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(8px)',
        flexShrink: 0,
      }}
    >
      <Typography variant="h6" sx={{ fontWeight: 700, color: '#0F172A', fontSize: 18 }}>
        {pageTitle}
      </Typography>

      <Button
        component={Link}
        to="/app/transactions"
        variant="contained"
        startIcon={<AddIcon sx={{ fontSize: 18 }} />}
        sx={{
          bgcolor: ACCENT_BLUE,
          color: 'white',
          px: 2,
          py: 1,
          borderRadius: 2,
          fontSize: '0.875rem',
          fontWeight: 700,
          textTransform: 'none',
          boxShadow: '0 8px 16px rgba(19, 127, 236, 0.2)',
          '&:hover': {
            bgcolor: '#2563EB',
          },
        }}
      >
        Quick Add
      </Button>
    </Box>
  )
}
