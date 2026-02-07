import { useEffect, useState, useRef } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Box, Typography, Button, Alert, CircularProgress } from '@mui/material'
import { useAuth } from '../contexts/AuthContext'

export default function VerifyAuth() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')
  const { verifyTelegramLogin, loading } = useAuth()
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying')
  const [errorMsg, setErrorMsg] = useState<string>('')
  const verified = useRef(false)

  useEffect(() => {
    if (!token) {
      setStatus('error')
      setErrorMsg('Missing token. Use the login link from Telegram or request a new one.')
      return
    }
    if (verified.current) return
    verified.current = true
    verifyTelegramLogin(token)
      .then(() => setStatus('success'))
      .catch((err: { response?: { data?: { detail?: string } } }) => {
        setStatus('error')
        const msg = err?.response?.data?.detail ?? 'Link or code expired. Request a new one from the login page.'
        setErrorMsg(typeof msg === 'string' ? msg : JSON.stringify(msg))
      })
  }, [token, verifyTelegramLogin])

  if (loading || status === 'verifying') {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          p: 2,
          bgcolor: 'background.default',
        }}
      >
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>Verifying your login...</Typography>
      </Box>
    )
  }

  if (status === 'success') {
    window.location.href = '/app'
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          p: 2,
          bgcolor: 'background.default',
        }}
      >
        <Alert severity="success">Login successful. Redirecting...</Alert>
        <Button component={Link} to="/app" sx={{ mt: 2 }}>
          Go to dashboard
        </Button>
      </Box>
    )
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
        bgcolor: 'background.default',
      }}
    >
      <Alert severity="error" sx={{ maxWidth: 400 }}>
        {errorMsg}
      </Alert>
      <Button component={Link} to="/login" variant="contained" sx={{ mt: 2 }}>
        Back to login
      </Button>
    </Box>
  )
}
