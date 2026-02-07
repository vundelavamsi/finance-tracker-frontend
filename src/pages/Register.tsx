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
  CircularProgress,
} from '@mui/material'
import { useAuth } from '../contexts/AuthContext'

export default function Register() {
  const navigate = useNavigate()
  const { user, loading, register } = useAuth()
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    )
  }

  if (user) {
    navigate('/app', { replace: true })
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage(null)
    const eTrim = email.trim()
    const pTrim = phone.trim()
    if (!eTrim && !pTrim) {
      setMessage({ type: 'error', text: 'Enter at least one of email or phone' })
      return
    }
    if (password.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters' })
      return
    }
    if (password !== confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match' })
      return
    }
    setSubmitting(true)
    try {
      await register({
        email: eTrim || undefined,
        phone: pTrim || undefined,
        password,
      })
      navigate('/app', { replace: true })
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail ?? 'Registration failed'
      setMessage({ type: 'error', text: typeof msg === 'string' ? msg : JSON.stringify(msg) })
    } finally {
      setSubmitting(false)
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
            Sign up
          </Typography>
          {message && (
            <Alert severity={message.type} sx={{ mb: 2 }} onClose={() => setMessage(null)}>
              {message.text}
            </Alert>
          )}
          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              size="small"
              label="Email (optional)"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              margin="dense"
            />
            <TextField
              fullWidth
              size="small"
              label="Phone (optional)"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              margin="dense"
              helperText="At least one of email or phone is required"
            />
            <TextField
              fullWidth
              size="small"
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              margin="dense"
              required
            />
            <TextField
              fullWidth
              size="small"
              label="Confirm password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              margin="dense"
              required
            />
            <Button type="submit" fullWidth variant="contained" sx={{ mt: 2 }} disabled={submitting}>
              {submitting ? <CircularProgress size={24} /> : 'Sign up'}
            </Button>
          </Box>
          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Already have an account? <Link to="/login">Log in</Link>
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  )
}
