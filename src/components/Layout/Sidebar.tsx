import { Link, useLocation } from 'react-router-dom'
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Drawer,
  Typography,
  Avatar,
  IconButton,
} from '@mui/material'
import DashboardIcon from '@mui/icons-material/Dashboard'
import ReceiptIcon from '@mui/icons-material/Receipt'
import AccountBalanceIcon from '@mui/icons-material/AccountBalance'
import SettingsIcon from '@mui/icons-material/Settings'
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet'
import LogoutIcon from '@mui/icons-material/Logout'
import VerifiedIcon from '@mui/icons-material/Verified'
import { themeColors } from '../../theme'
import { useAuth } from '../../contexts/AuthContext'

const drawerWidth = 260
const { ACCENT_BLUE } = themeColors

const mainMenuItems = [
  { text: 'Dashboard', icon: DashboardIcon, path: '/app' },
  { text: 'Transactions', icon: ReceiptIcon, path: '/app/transactions' },
  { text: 'Accounts', icon: AccountBalanceIcon, path: '/app/accounts' },
  { text: 'Configuration', icon: SettingsIcon, path: '/app/configuration' },
]

export default function Sidebar() {
  const location = useLocation()
  const { user, logout } = useAuth()

  const renderItem = (item: { text: string; icon: React.ElementType; path: string }) => {
    const isActive = location.pathname === item.path
    const Icon = item.icon
    return (
      <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
        <ListItemButton
          component={Link}
          to={item.path}
          selected={isActive}
          sx={{
            color: isActive ? ACCENT_BLUE : '#475569',
            borderRadius: 2,
            '&.Mui-selected': {
              backgroundColor: 'rgba(19, 127, 236, 0.1)',
              '&:hover': { backgroundColor: 'rgba(19, 127, 236, 0.15)' },
            },
            '&:hover': { backgroundColor: '#F1F5F9' },
          }}
        >
          <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
            <Icon sx={{ fontSize: 20 }} />
          </ListItemIcon>
          <ListItemText
            primary={item.text}
            primaryTypographyProps={{
              fontWeight: isActive ? 600 : 500,
              fontSize: '0.875rem',
              color: 'inherit',
            }}
          />
        </ListItemButton>
      </ListItem>
    )
  }

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          marginTop: 0,
          top: 0,
          height: '100vh',
          backgroundColor: '#FFFFFF',
          borderRight: '1px solid #E2E8F0',
        },
      }}
    >
      <Box sx={{ py: 2, px: 2, display: 'flex', flexDirection: 'column', height: '100%' }}>
        {/* Logo & Title */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, px: 1.5, mb: 2 }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: 2,
              bgcolor: ACCENT_BLUE,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
            }}
          >
            <AccountBalanceWalletIcon sx={{ fontSize: 22 }} />
          </Box>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#0F172A', fontSize: '1.125rem', lineHeight: 1.2 }}>
              Finance Tracker
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.3 }}>
              <VerifiedIcon sx={{ fontSize: 12, color: ACCENT_BLUE }} />
              <Typography sx={{ fontSize: 10, fontWeight: 700, color: '#94A3B8', letterSpacing: 0.5, textTransform: 'uppercase' }}>
                Telegram Verified
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Navigation */}
        <List disablePadding sx={{ flex: 1, px: 1 }}>
          {mainMenuItems.map(renderItem)}
        </List>

        {/* User Profile Section */}
        <Box sx={{ pt: 2, px: 1, borderTop: '1px solid #F1F5F9' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, p: 1 }}>
            <Avatar
              sx={{
                width: 40,
                height: 40,
                bgcolor: '#CBD5E1',
                color: '#475569',
                fontWeight: 600,
              }}
            >
              {(user?.telegram_username || user?.email || user?.phone || 'U').charAt(0).toUpperCase()}
            </Avatar>
            <Box sx={{ flex: 1, overflow: 'hidden' }}>
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 700,
                  color: '#0F172A',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  fontSize: '0.875rem',
                }}
              >
                {user?.telegram_username ? user.telegram_username.replace('@', '') : user?.email || user?.phone || 'User'}
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: '#64748B',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  fontSize: '0.75rem',
                }}
              >
                {user?.telegram_username ? `@${user.telegram_username.replace('@', '')}` : 'User'}
              </Typography>
            </Box>
            <IconButton
              onClick={logout}
              size="small"
              sx={{
                color: '#94A3B8',
                '&:hover': {
                  color: '#475569',
                  bgcolor: '#F1F5F9',
                },
              }}
            >
              <LogoutIcon sx={{ fontSize: 20 }} />
            </IconButton>
          </Box>
        </Box>
      </Box>
    </Drawer>
  )
}
