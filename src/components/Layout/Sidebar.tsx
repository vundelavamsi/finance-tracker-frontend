import { Link, useLocation, useNavigate } from 'react-router-dom'
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
  Tooltip,
  useMediaQuery,
  useTheme,
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

interface SidebarProps {
  mobileOpen: boolean
  onClose: () => void
}

export default function Sidebar({ mobileOpen, onClose }: SidebarProps) {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  const renderItem = (item: { text: string; icon: React.ElementType; path: string }) => {
    const isActive = location.pathname === item.path
    const Icon = item.icon
    return (
      <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
        <ListItemButton
          component={Link}
          to={item.path}
          selected={isActive}
          onClick={isMobile ? onClose : undefined}
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

  const drawerContent = (
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
      <Box
        sx={{
          pt: 2,
          px: 1,
          borderTop: '1px solid #E2E8F0',
          display: 'flex',
          alignItems: 'center',
          gap: 1,
        }}
      >
        {/* User info — clickable, navigates to profile */}
        <Tooltip title="View profile" placement="top" arrow>
          <Box
            onClick={() => { navigate('/app/profile'); if (isMobile) onClose() }}
            sx={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              p: 1,
              borderRadius: 2,
              cursor: 'pointer',
              overflow: 'hidden',
              transition: 'background-color 150ms',
              '&:hover': { backgroundColor: '#F1F5F9' },
            }}
          >
            <Avatar
              sx={{
                width: 34,
                height: 34,
                flexShrink: 0,
                bgcolor: ACCENT_BLUE,
                color: '#fff',
                fontWeight: 700,
                fontSize: '0.875rem',
              }}
            >
              {(user?.telegram_username || user?.email || user?.phone || 'U').charAt(0).toUpperCase()}
            </Avatar>
            <Box sx={{ overflow: 'hidden' }}>
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 700,
                  color: '#0F172A',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  fontSize: '0.8rem',
                  lineHeight: 1.3,
                }}
              >
                {user?.telegram_username ? user.telegram_username.replace('@', '') : user?.email || user?.phone || 'User'}
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: '#94A3B8',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  fontSize: '0.7rem',
                  display: 'block',
                  lineHeight: 1.3,
                }}
              >
                {user?.telegram_username ? `@${user.telegram_username.replace('@', '')}` : 'View profile'}
              </Typography>
            </Box>
          </Box>
        </Tooltip>

        {/* Logout icon — visually separated */}
        <Tooltip title="Sign out" placement="top" arrow>
          <Box
            onClick={logout}
            sx={{
              flexShrink: 0,
              width: 34,
              height: 34,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 2,
              cursor: 'pointer',
              color: '#94A3B8',
              transition: 'color 150ms, background-color 150ms',
              '&:hover': {
                color: '#EF4444',
                backgroundColor: '#FEF2F2',
              },
            }}
          >
            <LogoutIcon sx={{ fontSize: 18 }} />
          </Box>
        </Tooltip>
      </Box>
    </Box>
  )

  return (
    <Box
      component="nav"
      sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
    >
      {/* Mobile temporary drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            backgroundColor: '#FFFFFF',
            borderRight: '1px solid #E2E8F0',
          },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Desktop permanent drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
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
        open
      >
        {drawerContent}
      </Drawer>
    </Box>
  )
}
