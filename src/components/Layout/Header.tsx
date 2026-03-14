import { Link, useLocation } from 'react-router-dom'
import {
  Box,
  Button,
  IconButton,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import MenuIcon from '@mui/icons-material/Menu'

import { themeColors } from '../../theme'
const { ACCENT_BLUE } = themeColors

const PAGE_TITLES: Record<string, string> = {
  '/app': 'Main Dashboard Overview',
  '/app/transactions': 'Transactions',
  '/app/accounts': 'Accounts',
  '/app/configuration': 'Configuration',
  '/app/profile': 'User Profile',
}

interface HeaderProps {
  onMenuClick: () => void
}

export default function Header({ onMenuClick }: HeaderProps) {
  const location = useLocation()
  const pageTitle = PAGE_TITLES[location.pathname] || 'Dashboard'
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  return (
    <Box
      component="header"
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        px: { xs: 2, sm: 4 },
        height: 64,
        borderBottom: '1px solid #E2E8F0',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(8px)',
        flexShrink: 0,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        {isMobile && (
          <IconButton
            edge="start"
            onClick={onMenuClick}
            aria-label="open navigation menu"
            sx={{ color: '#0F172A' }}
          >
            <MenuIcon />
          </IconButton>
        )}
        <Typography variant="h6" sx={{ fontWeight: 700, color: '#0F172A', fontSize: { xs: 15, sm: 18 } }}>
          {pageTitle}
        </Typography>
      </Box>

      <Button
        component={Link}
        to="/app/transactions"
        variant="contained"
        startIcon={<AddIcon sx={{ fontSize: 18 }} />}
        sx={{
          bgcolor: ACCENT_BLUE,
          color: 'white',
          px: { xs: 1.5, sm: 2 },
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
        {isMobile ? 'Add' : 'Quick Add'}
      </Button>
    </Box>
  )
}
