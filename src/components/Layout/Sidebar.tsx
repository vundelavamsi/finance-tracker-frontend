import { Link, useLocation } from 'react-router-dom'
import { Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Drawer, AppBar, Toolbar, Typography } from '@mui/material'
import DashboardIcon from '@mui/icons-material/Dashboard'
import ReceiptIcon from '@mui/icons-material/Receipt'
import AccountBalanceIcon from '@mui/icons-material/AccountBalance'
import SettingsIcon from '@mui/icons-material/Settings'
import PersonIcon from '@mui/icons-material/Person'

const drawerWidth = 240

const menuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/app' },
  { text: 'Transactions', icon: <ReceiptIcon />, path: '/app/transactions' },
  { text: 'Bank Accounts', icon: <AccountBalanceIcon />, path: '/app/accounts' },
  { text: 'Settings', icon: <SettingsIcon />, path: '/app/settings' },
  { text: 'User Profile', icon: <PersonIcon />, path: '/app/profile' },
]

export default function Sidebar() {
  const location = useLocation()

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          marginTop: '64px',
        },
      }}
    >
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              component={Link}
              to={item.path}
              selected={location.pathname === item.path}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  )
}
