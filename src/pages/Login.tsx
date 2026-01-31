import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Alert,
  Divider,
  CircularProgress,
} from '@mui/material'
import { useAuth } from '../contexts/AuthContext'

export default function Login() {
  const navigate = useNavigate()
  const { user, loading, login, loginByTelegramUsername, verifyTelegramLogin } = useAuth()
  const [telegramUsername, setTelegramUsername] = useState('')
  const [telegramCode, setTelegramCode] = useState('')
  const [loginEmailOrPhone, setLoginEmailOrPhone] = useState('')
  const [password, setPassword] = useState('')
  const [sendLinkLoading, setSendLinkLoading] = useState(false)
  const [verifyCodeLoading, setVerifyCodeLoading] = useState(false)
  const [emailLoginLoading, setEmailLoginLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    )
  }

  if (user) {
    navigate('/', { replace: true })
    return null
  }

  const handleSendTelegramLink = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage(null)
    const username = telegramUsername.trim().replace(/^@/, '')
    if (!username) {
      setMessage({ type: 'error', text: 'Enter your Telegram username' })
      return
    }
    setSendLinkLoading(true)
    try {
      const res = await loginByTelegramUsername(username)
      setMessage({ type: 'success', text: res.message })
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail ?? 'Failed to send login link'
      setMessage({ type: 'error', text: typeof msg === 'string' ? msg : JSON.stringify(msg) })
    } finally {
      setSendLinkLoading(false)
    }
  }

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage(null)
    if (!telegramCode.trim()) {
      setMessage({ type: 'error', text: 'Enter the code from Telegram' })
      return
    }
    setVerifyCodeLoading(true)
    try {
      await verifyTelegramLogin(telegramCode.trim())
      navigate('/', { replace: true })
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail ?? 'Invalid or expired code'
      setMessage({ type: 'error', text: typeof msg === 'string' ? msg : JSON.stringify(msg) })
    } finally {
      setVerifyCodeLoading(false)
    }
  }

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage(null)
    if (!loginEmailOrPhone.trim() || !password) {
      setMessage({ type: 'error', text: 'Enter email/phone and password' })
      return
    }
    setEmailLoginLoading(true)
    try {
      await login({ login: loginEmailOrPhone.trim(), password })
      navigate('/', { replace: true })
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail ?? 'Invalid login or password'
      setMessage({ type: 'error', text: typeof msg === 'string' ? msg : JSON.stringify(msg) })
    } finally {
      setEmailLoginLoading(false)
    }
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
        bgcolor: 'background.default',
      }}
    >
      <Card sx={{ maxWidth: 440, width: '100%' }}>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h5" gutterBottom align="center">
            Log in
          </Typography>
          {message && (
            <Alert severity={message.type} sx={{ mb: 2 }} onClose={() => setMessage(null)}>
              {message.text}
            </Alert>
          )}

          {/* Telegram username + magic link / code */}
          <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 1 }}>
            Log in with Telegram username
          </Typography>
          <Box component="form" onSubmit={handleSendTelegramLink} sx={{ mt: 1 }}>
            <TextField
              fullWidth
              size="small"
              label="Telegram username"
              placeholder="@username or username"
              value={telegramUsername}
              onChange={(e) => setTelegramUsername(e.target.value)}
              margin="dense"
            />
            <Button type="submit" fullWidth variant="outlined" sx={{ mt: 1 }} disabled={sendLinkLoading}>
              {sendLinkLoading ? <CircularProgress size={24} /> : 'Send login link to Telegram'}
            </Button>
          </Box>
          <Box component="form" onSubmit={handleVerifyCode} sx={{ mt: 1 }}>
            <TextField
              fullWidth
              size="small"
              label="Code from Telegram"
              placeholder="123456"
              value={telegramCode}
              onChange={(e) => setTelegramCode(e.target.value)}
              margin="dense"
            />
            <Button type="submit" fullWidth variant="outlined" sx={{ mt: 1 }} disabled={verifyCodeLoading}>
              {verifyCodeLoading ? <CircularProgress size={24} /> : 'Verify code'}
            </Button>
          </Box>

          <Divider sx={{ my: 2 }} />

          {/* Email or phone + password */}
          <Typography variant="subtitle2" color="text.secondary">
            Log in with email or phone
          </Typography>
          <Box component="form" onSubmit={handleEmailLogin} sx={{ mt: 1 }}>
            <TextField
              fullWidth
              size="small"
              label="Email or phone"
              value={loginEmailOrPhone}
              onChange={(e) => setLoginEmailOrPhone(e.target.value)}
              margin="dense"
            />
            <TextField
              fullWidth
              size="small"
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              margin="dense"
            />
            <Button type="submit" fullWidth variant="contained" sx={{ mt: 2 }} disabled={emailLoginLoading}>
              {emailLoginLoading ? <CircularProgress size={24} /> : 'Log in'}
            </Button>
          </Box>

          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Don&apos;t have an account? <Link to="/register">Sign up</Link>
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  )
}
