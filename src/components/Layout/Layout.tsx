import { Box } from '@mui/material'
import Header from './Header'
import Sidebar from './Sidebar'
import { ReactNode } from 'react'

interface LayoutProps {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
  return (
    <Box sx={{ display: 'flex' }}>
      <Header />
      <Sidebar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          marginTop: '64px',
          width: 'calc(100% - 240px)',
        }}
      >
        {children}
      </Box>
    </Box>
  )
}
