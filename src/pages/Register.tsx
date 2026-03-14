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
  InputAdornment,
  IconButton,
  Stack,
} from '@mui/material'
import {
  PersonAddAlt,
  AccountBalanceWallet,
  Email,
  Phone,
  Lock,
  Visibility,
  VisibilityOff,
} from '@mui/icons-material'
import { useAuth } from '../contexts/AuthContext'
import { themeColors } from '../theme'

const { ACCENT_BLUE } = themeColors

export default function Register() {
  const navigate = useNavigate()
  const { user, loading, register } = useAuth()
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
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
        bgcolor: '#F6F7F8',
      }}
    >
      <Card
        sx={{
          maxWidth: 440,
          width: '100%',
          borderRadius: 4,
          bgcolor: '#FFFFFF',
          boxShadow: '0 10px 24px rgba(15, 23, 42, 0.12)',
          border: '1px solid #E2E8F0',
          overflow: 'hidden',
        }}
      >
        <Box sx={{ pt: 5, pb: 2, px: { xs: 3, sm: 4 }, textAlign: 'center' }}>
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: 3,
              bgcolor: '#EFF6FF',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: ACCENT_BLUE,
              mb: 2.5,
            }}
          >
            {/* <PersonAddAlt sx={{ fontSize: 26 }} /> */}
            <AccountBalanceWallet sx={{ fontSize: 28 }} />
          </Box>
          <Typography
            sx={{
              fontSize: 26,
              fontWeight: 700,
              color: '#0F172A',
              mb: 0.5,
              letterSpacing: '-0.02em',
            }}
          >
            Create Account
          </Typography>
          <Typography sx={{ fontSize: 13, fontWeight: 500, color: '#64748B' }}>
            Join us to track your finances with precision.
          </Typography>
        </Box>

        <CardContent sx={{ px: { xs: 3, sm: 4 }, pb: 4 }}>
          {message && (
            <Alert severity={message.type} sx={{ mb: 2 }} onClose={() => setMessage(null)}>
              {message.text}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <Stack spacing={2.5}>
              <Box>
                <Typography sx={{ fontSize: 12, fontWeight: 700, color: '#334155', mb: 1 }}>
                  Email (optional)
                </Typography>
                <TextField
                  fullWidth
                  placeholder="name@example.com"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email sx={{ fontSize: 18, color: '#94A3B8' }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      height: 44,
                      bgcolor: '#F8FAFC',
                      fontSize: 14,
                      fontWeight: 500,
                      '& fieldset': {
                        borderColor: '#E2E8F0',
                      },
                      '&:hover fieldset': {
                        borderColor: ACCENT_BLUE,
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: ACCENT_BLUE,
                        borderWidth: 1,
                      },
                    },
                    '& .MuiOutlinedInput-root input:-webkit-autofill, & .MuiOutlinedInput-root input:-webkit-autofill:hover, & .MuiOutlinedInput-root input:-webkit-autofill:focus': {
                      WebkitBoxShadow: '0 0 0 1000px #F8FAFC inset',
                      WebkitTextFillColor: '#0F172A',
                      caretColor: '#0F172A',
                    },
                    '& input': {
                      color: '#0F172A',
                    },
                    '& input::placeholder': {
                      color: '#94A3B8',
                      opacity: 1,
                    },
                  }}
                />
              </Box>

              <Box>
                <Typography sx={{ fontSize: 12, fontWeight: 700, color: '#334155', mb: 1 }}>
                  Phone (optional)
                </Typography>
                <TextField
                  fullWidth
                  placeholder="+1 234 567 890"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Phone sx={{ fontSize: 18, color: '#94A3B8' }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      height: 44,
                      bgcolor: '#F8FAFC',
                      fontSize: 14,
                      fontWeight: 500,
                      '& fieldset': {
                        borderColor: '#E2E8F0',
                      },
                      '&:hover fieldset': {
                        borderColor: ACCENT_BLUE,
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: ACCENT_BLUE,
                        borderWidth: 1,
                      },
                    },
                    '& .MuiOutlinedInput-root input:-webkit-autofill, & .MuiOutlinedInput-root input:-webkit-autofill:hover, & .MuiOutlinedInput-root input:-webkit-autofill:focus': {
                      WebkitBoxShadow: '0 0 0 1000px #F8FAFC inset',
                      WebkitTextFillColor: '#0F172A',
                      caretColor: '#0F172A',
                    },
                    '& input': {
                      color: '#0F172A',
                    },
                    '& input::placeholder': {
                      color: '#94A3B8',
                      opacity: 1,
                    },
                  }}
                />
                <Typography sx={{ mt: 0.8, fontSize: 11, color: '#94A3B8' }}>
                  At least one of email or phone is required
                </Typography>
              </Box>

              <Box>
                <Typography sx={{ fontSize: 12, fontWeight: 700, color: '#334155', mb: 1 }}>
                  Password*
                </Typography>
                <TextField
                  fullWidth
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock sx={{ fontSize: 18, color: '#94A3B8' }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                          sx={{ color: '#94A3B8' }}
                        >
                          {showPassword ? (
                            <VisibilityOff sx={{ fontSize: 18 }} />
                          ) : (
                            <Visibility sx={{ fontSize: 18 }} />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      height: 44,
                      bgcolor: '#F8FAFC',
                      fontSize: 14,
                      fontWeight: 500,
                      '& fieldset': {
                        borderColor: '#E2E8F0',
                      },
                      '&:hover fieldset': {
                        borderColor: ACCENT_BLUE,
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: ACCENT_BLUE,
                        borderWidth: 1,
                      },
                    },
                    '& .MuiOutlinedInput-root input:-webkit-autofill, & .MuiOutlinedInput-root input:-webkit-autofill:hover, & .MuiOutlinedInput-root input:-webkit-autofill:focus': {
                      WebkitBoxShadow: '0 0 0 1000px #F8FAFC inset',
                      WebkitTextFillColor: '#0F172A',
                      caretColor: '#0F172A',
                    },
                    '& input': {
                      color: '#0F172A',
                    },
                    '& input::placeholder': {
                      color: '#94A3B8',
                      opacity: 1,
                    },
                  }}
                  required
                />
              </Box>

              <Box>
                <Typography sx={{ fontSize: 12, fontWeight: 700, color: '#334155', mb: 1 }}>
                  Confirm password*
                </Typography>
                <TextField
                  fullWidth
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock sx={{ fontSize: 18, color: '#94A3B8' }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          edge="end"
                          sx={{ color: '#94A3B8' }}
                        >
                          {showConfirmPassword ? (
                            <VisibilityOff sx={{ fontSize: 18 }} />
                          ) : (
                            <Visibility sx={{ fontSize: 18 }} />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      height: 44,
                      bgcolor: '#F8FAFC',
                      fontSize: 14,
                      fontWeight: 500,
                      '& fieldset': {
                        borderColor: '#E2E8F0',
                      },
                      '&:hover fieldset': {
                        borderColor: ACCENT_BLUE,
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: ACCENT_BLUE,
                        borderWidth: 1,
                      },
                    },
                    '& .MuiOutlinedInput-root input:-webkit-autofill, & .MuiOutlinedInput-root input:-webkit-autofill:hover, & .MuiOutlinedInput-root input:-webkit-autofill:focus': {
                      WebkitBoxShadow: '0 0 0 1000px #F8FAFC inset',
                      WebkitTextFillColor: '#0F172A',
                      caretColor: '#0F172A',
                    },
                    '& input': {
                      color: '#0F172A',
                    },
                    '& input::placeholder': {
                      color: '#94A3B8',
                      opacity: 1,
                    },
                  }}
                  required
                />
              </Box>

              <Button
                type="submit"
                fullWidth
                disabled={submitting}
                sx={{
                  mt: 1,
                  height: 44,
                  bgcolor: ACCENT_BLUE,
                  color: 'white',
                  fontSize: 14,
                  fontWeight: 600,
                  textTransform: 'none',
                  borderRadius: 2,
                  boxShadow: '0 6px 16px rgba(59, 130, 246, 0.35)',
                  '&:hover': {
                    bgcolor: '#2563EB',
                  },
                  '&:disabled': {
                    bgcolor: '#CBD5E1',
                    color: 'white',
                  },
                }}
              >
                {submitting ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Sign up'}
              </Button>
            </Stack>
          </Box>
        </CardContent>

        <Box
          sx={{
            bgcolor: '#F8FAFC',
            borderTop: '1px solid #E2E8F0',
            py: 2,
            textAlign: 'center',
          }}
        >
          <Typography sx={{ fontSize: 13, color: '#64748B' }}>
            Already have an account?{' '}
            <Link
              to="/login"
              style={{
                color: ACCENT_BLUE,
                fontWeight: 600,
                textDecoration: 'none',
              }}
            >
              Log in
            </Link>
          </Typography>
        </Box>
      </Card>
    </Box>
  )
}
