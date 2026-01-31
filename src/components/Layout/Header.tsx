import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material'
import { useAuth } from '../../contexts/AuthContext'

export default function Header() {
  const { user, logout } = useAuth()

  return (
    <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <Toolbar>
        <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
          Finance Tracker
        </Typography>
        {user && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              {user.telegram_username ? `@${user.telegram_username}` : user.email || user.phone || 'User'}
            </Typography>
            <Button color="inherit" size="small" onClick={logout}>
              Log out
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  )
}
