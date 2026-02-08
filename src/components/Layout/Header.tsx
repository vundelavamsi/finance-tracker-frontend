import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Box,
  IconButton,
  InputBase,
  Menu,
  MenuItem,
  Avatar,
  Button,
  Typography,
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone'
import LogoutIcon from '@mui/icons-material/Logout'
import AddIcon from '@mui/icons-material/Add'
import { useAuth } from '../../contexts/AuthContext'

import { themeColors } from '../../theme'
const { ACCENT_BLUE } = themeColors
const SEARCH_BG = 'rgba(255,255,255,0.06)'

export default function Header() {
  const { user, logout } = useAuth()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleMenuClose = () => setAnchorEl(null)
  const handleLogout = () => {
    handleMenuClose()
    logout()
  }

  return (
    <>
      <Box
        component="header"
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          px: 3,
          py: 2,
          minHeight: 72,
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          backgroundColor: '#2A2E3B',
          flexShrink: 0,
        }}
      >
        <Box
          sx={{
            flex: 1,
            maxWidth: 480,
            display: { xs: 'none', md: 'flex' },
            alignItems: 'center',
            borderRadius: 2,
            backgroundColor: SEARCH_BG,
            border: '1px solid rgba(255,255,255,0.08)',
            px: 1.5,
            height: 44,
          }}
        >
          <SearchIcon sx={{ color: '#B0B5BF', mr: 1, fontSize: 20 }} />
          <InputBase
            placeholder="Search transactions, accounts or help..."
            readOnly
            sx={{
              flex: 1,
              fontSize: '0.875rem',
              color: '#FFFFFF',
              '& .MuiInputBase-input::placeholder': { color: '#B0B5BF', opacity: 1 },
            }}
          />
        </Box>

        <Box sx={{ flexGrow: 1 }} />

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton size="medium" sx={{ color: '#B0B5BF' }} aria-label="notifications">
            <NotificationsNoneIcon />
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
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Box sx={{ textAlign: 'right', display: { xs: 'none', sm: 'block' } }}>
                  <Typography
                    variant="body2"
                    sx={{ display: 'block', color: '#FFFFFF', fontWeight: 600, lineHeight: 1.2 }}
                  >
                    {user.telegram_username ? `@${user.telegram_username}` : user.email || user.phone || 'User'}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#B0B5BF' }}>
                    Pro Plan
                  </Typography>
                </Box>
                <Avatar
                  sx={{
                    width: 40,
                    height: 40,
                    bgcolor: ACCENT_BLUE,
                    fontSize: '0.875rem',
                  }}
                >
                  {(user.telegram_username || user.email || user.phone || 'U').charAt(0).toUpperCase()}
                </Avatar>
              </Box>
            </IconButton>
          )}
          <Button
            component={Link}
            to="/app/transactions"
            variant="contained"
            startIcon={<AddIcon />}
            sx={{
              backgroundColor: ACCENT_BLUE,
              color: '#fff',
              borderRadius: 2,
              px: 2,
              '&:hover': { backgroundColor: '#2563EB' },
            }}
          >
            Add Transaction
          </Button>
        </Box>
      </Box>

      <Menu
        id="user-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{
          paper: {
            sx: {
              mt: 1.5,
              minWidth: 220,
              borderRadius: 2,
              backgroundColor: '#2A2E3B',
              border: '1px solid rgba(255,255,255,0.08)',
            },
          },
        }}
      >
        <Box sx={{ px: 2, py: 1.5 }}>
          <Typography variant="subtitle2" sx={{ color: '#B0B5BF' }}>
            Signed in as
          </Typography>
          <Typography variant="body2" fontWeight={600} sx={{ color: '#FFFFFF' }}>
            {user?.telegram_username ? `@${user.telegram_username}` : user?.email || user?.phone || 'User'}
          </Typography>
        </Box>
        <MenuItem component={Link} to="/app/profile" onClick={handleMenuClose} sx={{ color: '#FFFFFF' }}>
          User Profile
        </MenuItem>
        <MenuItem onClick={handleLogout} sx={{ color: '#EF4444' }}>
          <LogoutIcon sx={{ mr: 1, fontSize: 20 }} /> Log out
        </MenuItem>
      </Menu>
    </>
  )
}
