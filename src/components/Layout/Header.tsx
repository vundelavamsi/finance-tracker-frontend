import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  InputBase,
  alpha,
  Menu,
  MenuItem,
  Avatar,
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone'
import SettingsIcon from '@mui/icons-material/Settings'
import LogoutIcon from '@mui/icons-material/Logout'
import { useAuth } from '../../contexts/AuthContext'
import { useLocation } from 'react-router-dom'

const pageTitles: Record<string, string> = {
  '/app': 'Dashboard',
  '/app/transactions': 'Transactions',
  '/app/accounts': 'Bank Accounts',
  '/app/settings': 'Settings',
  '/app/profile': 'User Profile',
}

export default function Header() {
  const { user, logout } = useAuth()
  const location = useLocation()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const pageTitle = pageTitles[location.pathname] ?? 'Dashboard'

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleMenuClose = () => setAnchorEl(null)
  const handleLogout = () => {
    handleMenuClose()
    logout()
  }

  return (
    <AppBar
      position="fixed"
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        backgroundColor: '#FFFFFF',
        color: 'text.primary',
        borderBottom: '1px solid rgba(0,0,0,0.06)',
      }}
    >
      <Toolbar sx={{ gap: 2, minHeight: { xs: 56, sm: 64 } }}>
        <Typography variant="h6" sx={{ fontWeight: 600, minWidth: 140 }}>
          {pageTitle}
        </Typography>

        <Box
          sx={{
            flex: 1,
            maxWidth: 400,
            display: { xs: 'none', md: 'block' },
            position: 'relative',
            borderRadius: 2,
            backgroundColor: alpha('#000', 0.04),
            '&:hover': { backgroundColor: alpha('#000', 0.06) },
          }}
        >
          <Box
            sx={{
              padding: (t) => t.spacing(1, 1.5),
              height: 40,
              display: 'flex',
              alignItems: 'center',
              pointerEvents: 'none',
            }}
          >
            <SearchIcon sx={{ color: 'text.secondary', mr: 1, fontSize: 20 }} />
            <InputBase
              placeholder="Search…"
              readOnly
              sx={{
                width: '100%',
                fontSize: '0.875rem',
                '& .MuiInputBase-input': { py: 0 },
              }}
            />
          </Box>
        </Box>

        <Box sx={{ flexGrow: 1 }} />

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <IconButton size="medium" sx={{ color: 'text.secondary' }} aria-label="notifications">
            <NotificationsNoneIcon />
          </IconButton>
          <IconButton size="medium" sx={{ color: 'text.secondary' }} aria-label="settings">
            <SettingsIcon />
          </IconButton>
          {user && (
            <IconButton
              onClick={handleMenuOpen}
              size="small"
              sx={{ ml: 0.5 }}
              aria-controls={anchorEl ? 'user-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={anchorEl ? 'true' : undefined}
            >
              <Avatar
                sx={{
                  width: 36,
                  height: 36,
                  bgcolor: 'primary.main',
                  fontSize: '0.875rem',
                }}
              >
                {(user.telegram_username || user.email || user.phone || 'U').charAt(0).toUpperCase()}
              </Avatar>
            </IconButton>
          )}
        </Box>
      </Toolbar>

      <Menu
        id="user-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{
          paper: { sx: { mt: 1.5, minWidth: 200, borderRadius: 2 } },
        }}
      >
        <Box sx={{ px: 2, py: 1.5 }}>
          <Typography variant="subtitle2" color="text.secondary">
            Signed in as
          </Typography>
          <Typography variant="body2" fontWeight={600}>
            {user?.telegram_username ? `@${user.telegram_username}` : user?.email || user?.phone || 'User'}
          </Typography>
        </Box>
        <MenuItem component={Link} to="/app/profile" onClick={handleMenuClose}>
          User Profile
        </MenuItem>
        <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
          <LogoutIcon sx={{ mr: 1, fontSize: 20 }} /> Log out
        </MenuItem>
      </Menu>
    </AppBar>
  )
}
