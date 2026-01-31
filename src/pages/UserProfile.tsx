import { useState, useEffect, useRef } from 'react'
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Alert,
  Divider,
} from '@mui/material'
import { useAuth } from '../contexts/AuthContext'
import { setPassword, connectTelegram } from '../services/auth'
import { formatDate } from '../utils/formatters'

declare global {
  interface Window {
    onTelegramAuth?: (user: { id: number; first_name?: string; username?: string; photo_url?: string; auth_date: number; hash: string }) => void
  }
}

const TELEGRAM_BOT_USERNAME = import.meta.env.VITE_TELEGRAM_BOT_USERNAME || ''

export default function UserProfile() {
  const { user, refreshUser } = useAuth()
  const [setPasswordEmail, setSetPasswordEmail] = useState('')
  const [setPasswordPhone, setSetPasswordPhone] = useState('')
  const [setPasswordPassword, setSetPasswordPassword] = useState('')
  const [setPasswordConfirm, setSetPasswordConfirm] = useState('')
  const [setPasswordLoading, setSetPasswordLoading] = useState(false)
  const [setPasswordMessage, setSetPasswordMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [connectMessage, setConnectMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const widgetRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!user) return
    setSetPasswordEmail(user.email || '')
    setSetPasswordPhone(user.phone || '')
  }, [user])

  // Load Telegram Login Widget script and render widget
  useEffect(() => {
    if (!TELEGRAM_BOT_USERNAME || !widgetRef.current || user?.telegram_id) return

    const scriptId = 'telegram-login-widget'
    if (document.getElementById(scriptId)) return

    window.onTelegramAuth = (tgUser) => {
      connectTelegram({
        id: tgUser.id,
        hash: tgUser.hash,
        first_name: tgUser.first_name,
        username: tgUser.username,
        photo_url: tgUser.photo_url,
        auth_date: tgUser.auth_date,
      })
        .then(() => {
          setConnectMessage({ type: 'success', text: 'Telegram connected successfully.' })
          refreshUser()
        })
        .catch((err: { response?: { data?: { detail?: string } } }) => {
          const msg = err?.response?.data?.detail ?? 'Failed to connect Telegram'
          setConnectMessage({ type: 'error', text: typeof msg === 'string' ? msg : JSON.stringify(msg) })
        })
    }

    const script = document.createElement('script')
    script.id = scriptId
    script.src = 'https://telegram.org/js/telegram-widget.js?22'
    script.setAttribute('data-telegram-login', TELEGRAM_BOT_USERNAME)
    script.setAttribute('data-size', 'large')
    script.setAttribute('data-onauth', 'onTelegramAuth(user)')
    script.async = true
    widgetRef.current.appendChild(script)

    return () => {
      const s = document.getElementById(scriptId)
      if (s) s.remove()
    }
  }, [user?.telegram_id, refreshUser])

  const handleSetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setSetPasswordMessage(null)
    const email = setPasswordEmail.trim()
    const phone = setPasswordPhone.trim()
    if (!email && !phone) {
      setSetPasswordMessage({ type: 'error', text: 'Enter at least one of email or phone' })
      return
    }
    if (setPasswordPassword.length < 6) {
      setSetPasswordMessage({ type: 'error', text: 'Password must be at least 6 characters' })
      return
    }
    if (setPasswordPassword !== setPasswordConfirm) {
      setSetPasswordMessage({ type: 'error', text: 'Passwords do not match' })
      return
    }
    setSetPasswordLoading(true)
    try {
      await setPassword({
        email: email || undefined,
        phone: phone || undefined,
        password: setPasswordPassword,
      })
      setSetPasswordMessage({ type: 'success', text: 'Email/phone and password set. You can now log in with them.' })
      setSetPasswordPassword('')
      setSetPasswordConfirm('')
      refreshUser()
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail ?? 'Failed to set password'
      setSetPasswordMessage({ type: 'error', text: typeof msg === 'string' ? msg : JSON.stringify(msg) })
    } finally {
      setSetPasswordLoading(false)
    }
  }

  if (!user) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    )
  }

  const telegramLinked = !!user.telegram_id

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        User Profile
      </Typography>

      <Card sx={{ mt: 3, maxWidth: 600 }}>
        <CardContent>
          <Typography variant="subtitle2" color="text.secondary">
            Account info
          </Typography>
          <Box sx={{ mt: 1 }}>
            <Typography variant="body2">Email: {user.email || '—'}</Typography>
            <Typography variant="body2">Phone: {user.phone || '—'}</Typography>
            <Typography variant="body2">
              Telegram: {telegramLinked ? `Linked${user.telegram_username ? ` (@${user.telegram_username})` : ''}` : 'Not linked'}
            </Typography>
            <Typography variant="body2">Account created: {formatDate(user.created_at)}</Typography>
          </Box>
        </CardContent>
      </Card>

      {/* Set email & password (for Telegram-first users) */}
      {!user.has_password && (
        <Card sx={{ mt: 3, maxWidth: 600 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Set email & password
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              So you can also log in from the web with email/phone and password.
            </Typography>
            {setPasswordMessage && (
              <Alert severity={setPasswordMessage.type} sx={{ mb: 2 }} onClose={() => setSetPasswordMessage(null)}>
                {setPasswordMessage.text}
              </Alert>
            )}
            <Box component="form" onSubmit={handleSetPassword}>
              <TextField
                fullWidth
                size="small"
                label="Email (optional)"
                type="email"
                value={setPasswordEmail}
                onChange={(e) => setSetPasswordEmail(e.target.value)}
                margin="dense"
              />
              <TextField
                fullWidth
                size="small"
                label="Phone (optional)"
                value={setPasswordPhone}
                onChange={(e) => setSetPasswordPhone(e.target.value)}
                margin="dense"
                helperText="At least one of email or phone is required"
              />
              <TextField
                fullWidth
                size="small"
                label="Password"
                type="password"
                value={setPasswordPassword}
                onChange={(e) => setSetPasswordPassword(e.target.value)}
                margin="dense"
                required
              />
              <TextField
                fullWidth
                size="small"
                label="Confirm password"
                type="password"
                value={setPasswordConfirm}
                onChange={(e) => setSetPasswordConfirm(e.target.value)}
                margin="dense"
                required
              />
              <Button type="submit" variant="contained" sx={{ mt: 2 }} disabled={setPasswordLoading}>
                {setPasswordLoading ? <CircularProgress size={24} /> : 'Set email & password'}
              </Button>
            </Box>
          </CardContent>
        </Card>
      )}

      {/* Connect Telegram (for web-first users) */}
      {!telegramLinked && (
        <Card sx={{ mt: 3, maxWidth: 600 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Connect Telegram
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Link your Telegram account to use &quot;Log in with Telegram username&quot; or the bot with this account.
            </Typography>
            {connectMessage && (
              <Alert severity={connectMessage.type} sx={{ mb: 2 }} onClose={() => setConnectMessage(null)}>
                {connectMessage.text}
              </Alert>
            )}
            {TELEGRAM_BOT_USERNAME ? (
              <div ref={widgetRef} />
            ) : (
              <Typography variant="body2" color="text.secondary">
                Set VITE_TELEGRAM_BOT_USERNAME in your env to enable the Connect Telegram button.
              </Typography>
            )}
          </CardContent>
        </Card>
      )}
    </Box>
  )
}
