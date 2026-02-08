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
} from '@mui/material'
import DashboardIcon from '@mui/icons-material/Dashboard'
import ReceiptIcon from '@mui/icons-material/Receipt'
import AccountBalanceIcon from '@mui/icons-material/AccountBalance'
import SettingsIcon from '@mui/icons-material/Settings'
import PersonIcon from '@mui/icons-material/Person'
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet'
import { themeColors } from '../../theme'

const drawerWidth = 260
const { SIDEBAR_BG, ACCENT_BLUE } = themeColors

const mainMenuItems = [
  { text: 'Dashboard', icon: DashboardIcon, path: '/app' },
  { text: 'Transactions', icon: ReceiptIcon, path: '/app/transactions' },
  { text: 'Accounts', icon: AccountBalanceIcon, path: '/app/accounts' },
  { text: 'User Profile', icon: PersonIcon, path: '/app/profile' },
]
const settingsItem = { text: 'Configuration', icon: SettingsIcon, path: '/app/configuration' }

export default function Sidebar() {
  const location = useLocation()

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
            color: isActive ? '#fff' : '#B0B5BF',
            borderRadius: 1,
            '&.Mui-selected': {
              backgroundColor: ACCENT_BLUE,
              '&:hover': { backgroundColor: '#2563EB' },
            },
            '&:hover': { backgroundColor: 'rgba(255,255,255,0.06)' },
          }}
        >
          <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
            <Icon sx={{ fontSize: 22 }} />
          </ListItemIcon>
          <ListItemText
            primary={item.text}
            primaryTypographyProps={{
              fontWeight: isActive ? 600 : 500,
              fontSize: '0.9375rem',
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
          backgroundColor: SIDEBAR_BG,
          borderRight: '1px solid rgba(255,255,255,0.06)',
        },
      }}
    >
      <Box sx={{ py: 2, px: 2, display: 'flex', flexDirection: 'column', height: '100%' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, px: 2, mb: 3 }}>
          <Box
            sx={{
              width: 44,
              height: 44,
              borderRadius: 2,
              bgcolor: ACCENT_BLUE,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
            }}
          >
            <AccountBalanceWalletIcon sx={{ fontSize: 26 }} />
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 600, color: '#FFFFFF' }}>
            FinanceTracker
          </Typography>
        </Box>
        <List disablePadding sx={{ flex: 1 }}>
          {mainMenuItems.map(renderItem)}
        </List>
        <List disablePadding sx={{ pt: 2, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          {renderItem(settingsItem)}
        </List>
      </Box>
    </Drawer>
  )
}
