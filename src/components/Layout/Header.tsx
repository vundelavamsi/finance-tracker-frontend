import { Link, useLocation } from 'react-router-dom'
import {
  Box,
  Button,
  IconButton,
  Typography,
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
  onMobileMenuOpen: () => void
}

export default function Header({ onMobileMenuOpen }: HeaderProps) {
  const location = useLocation()
  const pageTitle = PAGE_TITLES[location.pathname] || 'Dashboard'
  const isTransactions = location.pathname === '/app/transactions'

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
        <IconButton
          aria-label="open navigation menu"
          edge="start"
          onClick={onMobileMenuOpen}
          sx={{ display: { sm: 'none' }, color: '#0F172A' }}
        >
          <MenuIcon />
        </IconButton>
        <Typography
          variant="h6"
          sx={{ fontWeight: 700, color: '#0F172A', fontSize: { xs: 15, sm: 18 } }}
        >
          {pageTitle}
        </Typography>
      </Box>

      {!isTransactions && (
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
      )}
    </Box>
  )
}
