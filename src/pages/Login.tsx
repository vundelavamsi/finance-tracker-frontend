import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
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
  ToggleButtonGroup,
  ToggleButton,
} from '@mui/material'
import {
  AccountBalanceWallet,
  Send,
  Email,
  Lock,
  Visibility,
  VisibilityOff,
} from '@mui/icons-material'
import { useAuth } from '../contexts/AuthContext'
import { themeColors } from '../theme'

const { ACCENT_BLUE } = themeColors


export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: { pathname?: string } })?.from?.pathname ?? '/app'
  const { user, loading, login, loginByTelegramUsername, verifyTelegramLogin } = useAuth()
  
  const [activeTab, setActiveTab] = useState<'telegram' | 'email'>('telegram')
  const [telegramUsername, setTelegramUsername] = useState('')
  const [telegramCode, setTelegramCode] = useState('')
  const [loginEmailOrPhone, setLoginEmailOrPhone] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
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
    navigate(from, { replace: true })
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
      navigate(from, { replace: true })
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
      navigate(from, { replace: true })
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
        bgcolor: '#F6F7F8',
      }}
    >
      <Card
        sx={{
          maxWidth: 440,
          width: '100%',
          borderRadius: 4,
          bgcolor: '#FFFFFF',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 10px 15px -3px rgba(0, 0, 0, 0.05)',
          border: '1px solid #F1F5F9',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <Box sx={{ pt: 5, pb: 1, px: { xs: 3, sm: 4 }, textAlign: 'center' }}>
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: 1,
              bgcolor: '#EFF6FF',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: ACCENT_BLUE,
              mb: 3,
            }}
          >
            <AccountBalanceWallet sx={{ fontSize: 28 }} />
          </Box>
          <Typography
            sx={{
              fontSize: 28,
              fontWeight: 700,
              color: '#0F172A',
              mb: 1,
              letterSpacing: '-0.02em',
            }}
          >
            Welcome Back
          </Typography>
          <Typography sx={{ fontSize: 14, fontWeight: 500, color: '#64748B' }}>
            Manage your finances with ease and precision.
          </Typography>
        </Box>

        {/* Tab Switcher */}
        <Box sx={{ px: { xs: 3, sm: 4 }, mt: 3 }}>
          <Box
            sx={{
              display: 'flex',
              p: 0.5,
              bgcolor: '#F8FAFC',
              borderRadius: 1,
            }}
          >
            <Button
              onClick={() => setActiveTab('telegram')}
              sx={{
                flex: 1,
                py: 1,
                fontSize: 14,
                fontWeight: activeTab === 'telegram' ? 600 : 500,
                textTransform: 'none',
                borderRadius: 1,
                color: activeTab === 'telegram' ? '#0F172A' : '#64748B',
                bgcolor: activeTab === 'telegram' ? '#FFFFFF' : 'transparent',
                boxShadow: activeTab === 'telegram' ? '0 1px 2px rgba(0,0,0,0.05)' : 'none',
                '&:hover': {
                  bgcolor: activeTab === 'telegram' ? '#FFFFFF' : 'transparent',
                  color: activeTab === 'telegram' ? '#0F172A' : '#475569',
                },
              }}
            >
              Telegram
            </Button>
            <Button
              onClick={() => setActiveTab('email')}
              sx={{
                flex: 1,
                py: 1,
                fontSize: 14,
                fontWeight: activeTab === 'email' ? 600 : 500,
                textTransform: 'none',
                borderRadius: 1,
                color: activeTab === 'email' ? '#0F172A' : '#64748B',
                bgcolor: activeTab === 'email' ? '#FFFFFF' : 'transparent',
                boxShadow: activeTab === 'email' ? '0 1px 2px rgba(0,0,0,0.05)' : 'none',
                '&:hover': {
                  bgcolor: activeTab === 'email' ? '#FFFFFF' : 'transparent',
                  color: activeTab === 'email' ? '#0F172A' : '#475569',
                },
              }}
            >
              Email/Phone
            </Button>
          </Box>
        </Box>

        {/* Content */}
        <CardContent sx={{ px: { xs: 3, sm: 4 }, py: 3 }}>
          {message && (
            <Alert severity={message.type} sx={{ mb: 2 }} onClose={() => setMessage(null)}>
              {message.text}
            </Alert>
          )}

          {/* Telegram Tab Content */}
          {activeTab === 'telegram' && (
            <Stack spacing={3}>
              {/* Send login link section */}
              <Box component="form" onSubmit={handleSendTelegramLink}>
                <Stack spacing={1.5}>
                  <TextField
                    fullWidth
                    placeholder="Telegram username"
                    value={telegramUsername}
                    onChange={(e) => setTelegramUsername(e.target.value)}
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
                          borderColor: '#0088CC',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#0088CC',
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
                  <Button
                    type="submit"
                    fullWidth
                    disabled={sendLinkLoading}
                    startIcon={sendLinkLoading ? null : <Send sx={{ fontSize: 20 }} />}
                    sx={{
                      height: 44,
                      bgcolor: '#0088CC',
                      color: 'white',
                      fontSize: 14,
                      fontWeight: 600,
                      textTransform: 'none',
                      borderRadius: 1,
                      boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                      '&:hover': {
                        bgcolor: '#0077B5',
                      },
                      '&:disabled': {
                        bgcolor: '#CBD5E1',
                        color: 'white',
                      },
                    }}
                  >
                    {sendLinkLoading ? (
                      <CircularProgress size={24} sx={{ color: 'white' }} />
                    ) : (
                      'Send login link to Telegram'
                    )}
                  </Button>
                </Stack>
              </Box>

              {/* Verify code section */}
              <Box component="form" onSubmit={handleVerifyCode}>
                <Stack spacing={1.5}>
                  <TextField
                    fullWidth
                    placeholder="Code from Telegram"
                    value={telegramCode}
                    onChange={(e) => setTelegramCode(e.target.value)}
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
                          borderColor: '#0088CC',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#0088CC',
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
                  <Button
                    type="submit"
                    fullWidth
                    disabled={verifyCodeLoading}
                    variant="outlined"
                    sx={{
                      height: 44,
                      borderColor: '#0088CC',
                      color: '#0088CC',
                      bgcolor: 'white',
                      fontSize: 14,
                      fontWeight: 600,
                      textTransform: 'none',
                      borderRadius: 1,
                      '&:hover': {
                        bgcolor: '#F8FAFC',
                        borderColor: '#0088CC',
                      },
                      '&:disabled': {
                        borderColor: '#CBD5E1',
                        color: '#CBD5E1',
                      },
                    }}
                  >
                    {verifyCodeLoading ? (
                      <CircularProgress size={24} sx={{ color: '#0088CC' }} />
                    ) : (
                      'Verify code'
                    )}
                  </Button>
                </Stack>
              </Box>
            </Stack>
          )}

          {/* Email/Phone Tab Content */}
          {activeTab === 'email' && (
            <Box component="form" onSubmit={handleEmailLogin}>
              <Stack spacing={2.5}>
                {/* Email field */}
                <Box>
                  <Typography
                    sx={{
                      fontSize: 12,
                      fontWeight: 700,
                      color: '#334155',
                      mb: 1,
                      letterSpacing: '0.02em',
                    }}
                  >
                    EMAIL ADDRESS
                  </Typography>
                  <TextField
                    fullWidth
                    placeholder="name@example.com"
                    value={loginEmailOrPhone}
                    onChange={(e) => setLoginEmailOrPhone(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Email sx={{ fontSize: 20, color: '#94A3B8' }} />
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

                {/* Password field */}
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography
                      sx={{
                        fontSize: 12,
                        fontWeight: 700,
                        color: '#334155',
                        letterSpacing: '0.02em',
                      }}
                    >
                      PASSWORD
                    </Typography>
                    <Link
                      to="/forgot-password"
                      style={{
                        fontSize: 12,
                        fontWeight: 600,
                        color: ACCENT_BLUE,
                        textDecoration: 'none',
                      }}
                    >
                      Forgot Password?
                    </Link>
                  </Box>
                  <TextField
                    fullWidth
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
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
                              <VisibilityOff sx={{ fontSize: 20 }} />
                            ) : (
                              <Visibility sx={{ fontSize: 20 }} />
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
                  />
                </Box>

                {/* Login button */}
                <Button
                  type="submit"
                  fullWidth
                  disabled={emailLoginLoading}
                  sx={{
                    mt: 1,
                    height: 44,
                    bgcolor: ACCENT_BLUE,
                    color: 'white',
                    fontSize: 14,
                    fontWeight: 600,
                    textTransform: 'none',
                    borderRadius: 2,
                    boxShadow: '0 4px 6px -1px rgba(59, 130, 246, 0.3)',
                    '&:hover': {
                      bgcolor: '#2563EB',
                      boxShadow: '0 10px 15px -3px rgba(59, 130, 246, 0.3)',
                    },
                    '&:disabled': {
                      bgcolor: '#CBD5E1',
                      color: 'white',
                    },
                  }}
                >
                  {emailLoginLoading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Log In'}
                </Button>
              </Stack>
            </Box>
          )}
        </CardContent>

        {/* Footer */}
        <Box
          sx={{
            bgcolor: '#F8FAFC',
            borderTop: '1px solid #E2E8F0',
            py: 2,
            textAlign: 'center',
          }}
        >
          <Typography sx={{ fontSize: 14, color: '#64748B' }}>
            Don't have an account?{' '}
            <Link
              to="/register"
              style={{
                color: ACCENT_BLUE,
                fontWeight: 600,
                textDecoration: 'none',
              }}
            >
              Sign up
            </Link>
          </Typography>
        </Box>
      </Card>
    </Box>
  )
}
