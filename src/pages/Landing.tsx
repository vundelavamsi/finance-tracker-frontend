import { Link } from 'react-router-dom'
import {
  Box,
  Container,
  Typography,
  Button,
  Stack,
  Grid,
  Avatar,
} from '@mui/material'
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet'
import SendIcon from '@mui/icons-material/Send'
import PlayCircleIcon from '@mui/icons-material/PlayCircle'
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline'
import DonutLargeIcon from '@mui/icons-material/DonutLarge'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined'
import SubscriptionsOutlinedIcon from '@mui/icons-material/SubscriptionsOutlined'
import FormatQuoteIcon from '@mui/icons-material/FormatQuote'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import { themeColors } from '../theme'

const { ACCENT_BLUE } = themeColors

const featureCards = [
  {
    icon: <ChatBubbleOutlineIcon sx={{ color: ACCENT_BLUE, fontSize: 26 }} />,
    title: 'Instant Logging via Chat',
    description: 'Simply send a message like "Lunch $15" to our bot. It automatically categorizes and logs it instantly.',
  },
  {
    icon: <DonutLargeIcon sx={{ color: ACCENT_BLUE, fontSize: 26 }} />,
    title: 'Smart Insights',
    description: 'Visualize spending habits with auto-generated charts and monthly budget dials that keep you on track.',
  },
  {
    icon: <LockOutlinedIcon sx={{ color: ACCENT_BLUE, fontSize: 26 }} />,
    title: 'Bank-Grade Security',
    description: 'Your financial data is encrypted end-to-end. We prioritize your privacy above all else.',
  },
]

export default function Landing() {
  return (
    <Box sx={{ bgcolor: '#F6F7F8', minHeight: '100vh', color: '#0F172A', overflowX: 'hidden' }}>
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: 64,
          bgcolor: 'rgba(255,255,255,0.9)',
          borderBottom: '1px solid #E2E8F0',
          backdropFilter: 'blur(6px)',
          zIndex: 1100,
        }}
      >
        <Container
          maxWidth="lg"
          sx={{
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box
              sx={{
                width: 44,
                height: 44,
                borderRadius: 2,
                bgcolor: '#EFF6FF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: ACCENT_BLUE,
              }}
            >
              <AccountBalanceWalletIcon sx={{ fontSize: 26 }} />
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#111827', display: { xs: 'none', sm: 'block' } }}>
              Finance Tracker
            </Typography>
          </Box>
          <Stack direction="row" spacing={4} sx={{ display: { xs: 'none', md: 'flex' } }}>
            <Typography component="a" href="#features" sx={{ color: '#475569', textDecoration: 'none', fontWeight: 600 }}>Features</Typography>
            <Typography component="a" href="#pricing" sx={{ color: '#475569', textDecoration: 'none', fontWeight: 600 }}>Pricing</Typography>
            <Typography component="a" href="#faq" sx={{ color: '#475569', textDecoration: 'none', fontWeight: 600 }}>FAQ</Typography>
          </Stack>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.5, sm: 1.5 } }}>
            <Button
              component={Link}
              to="/login"
              variant="text"
              sx={{
                color: '#1F2937',
                fontWeight: 700,
                borderRadius: 2,
                px: { xs: 1, sm: 2 },
                '&:hover': { bgcolor: 'transparent', color: ACCENT_BLUE },
              }}
            >
              Login
            </Button>
            <Button
              component={Link}
              to="/register"
              variant="contained"
              sx={{
                bgcolor: ACCENT_BLUE,
                color: 'white',
                borderRadius: 2,
                px: { xs: 1.5, sm: 2 },
                '&:hover': { bgcolor: '#2563EB' },
              }}
            >
              Get Started
            </Button>
          </Box>
        </Container>
      </Box>

      <Box sx={{ pt: 10 }}>
        <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
          <Grid container spacing={{ xs: 3, md: 6 }} alignItems="center">
            <Grid item xs={12} lg={7}>
              <Box
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 1,
                  border: '1px solid #BFDBFE',
                  bgcolor: '#EFF6FF',
                  color: ACCENT_BLUE,
                  px: 1.5,
                  py: 0.7,
                  borderRadius: 999,
                  fontWeight: 700,
                  fontSize: 13,
                  mb: 3,
                }}
              >
                <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: ACCENT_BLUE }} />
                New: Telegram Bot Integration 2.0
              </Box>
              <Typography sx={{ fontSize: { xs: 36, md: 66 }, fontWeight: 800, lineHeight: 1.05, color: '#0F172A' }}>
                Master Your Money
              </Typography>
              <Typography sx={{ fontSize: { xs: 36, md: 66 }, fontWeight: 800, lineHeight: 1.05, color: ACCENT_BLUE, textDecoration: 'underline', textDecorationColor: '#BFDBFE' }}>
                with Telegram
              </Typography>
              <Typography sx={{ mt: 3, maxWidth: 630, color: '#64748B', fontSize: { xs: 16, md: 30/2 }, lineHeight: 1.65 }}>
                The smartest personal finance tracker that lives where you chat. Track expenses, visualize growth, and stay secure without leaving your favorite app.
              </Typography>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mt: 4 }}>
                <Button
                  component={Link}
                  to="/register"
                  variant="contained"
                  startIcon={<SendIcon />}
                  sx={{
                    bgcolor: ACCENT_BLUE,
                    px: 4,
                    py: 1.6,
                    borderRadius: 3,
                    fontWeight: 700,
                    '&:hover': { bgcolor: '#2563EB' },
                  }}
                >
                  Start with Telegram
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<PlayCircleIcon />}
                  sx={{
                    borderColor: '#CBD5E1',
                    color: '#334155',
                    bgcolor: '#FFFFFF',
                    px: 4,
                    py: 1.6,
                    borderRadius: 3,
                    fontWeight: 700,
                    '&:hover': { borderColor: '#94A3B8', bgcolor: '#F8FAFC' },
                  }}
                >
                  Watch Demo
                </Button>
              </Stack>
              <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mt: 4 }}>
                <Stack direction="row" sx={{ '& > *:not(:first-of-type)': { ml: -1 } }}>
                  <Avatar sx={{ width: 30, height: 30, border: '2px solid white' }}>👨</Avatar>
                  <Avatar sx={{ width: 30, height: 30, border: '2px solid white' }}>👩</Avatar>
                  <Avatar sx={{ width: 30, height: 30, border: '2px solid white' }}>👨‍💼</Avatar>
                </Stack>
                <Typography sx={{ color: '#64748B', fontWeight: 600 }}>Trusted by 10,000+ users</Typography>
              </Stack>
            </Grid>

            <Grid item xs={12} lg={5}>
              <Box sx={{ position: 'relative' }}>
                <Box sx={{ position: 'absolute', inset: -24, borderRadius: 8, background: 'radial-gradient(circle at 70% 70%, rgba(16,185,129,0.25), transparent 40%), radial-gradient(circle at 30% 20%, rgba(59,130,246,0.25), transparent 45%)', filter: 'blur(20px)' }} />
                <Box sx={{ position: 'relative', bgcolor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 4, boxShadow: '0 30px 80px rgba(15, 23, 42, 0.18)', p: 3 }}>
                  <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                    <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: '#FB7185' }} />
                    <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: '#FBBF24' }} />
                    <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: '#4ADE80' }} />
                  </Stack>
                  <Typography sx={{ color: '#64748B', fontWeight: 600, fontSize: 14 }}>Total Balance</Typography>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: 1, mb: 3 }}>
                    <Typography sx={{ fontSize: 42/1.4, fontWeight: 800, color: '#0F172A' }}>$12,450.00</Typography>
                    <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5, color: '#16A34A', bgcolor: '#ECFDF3', px: 1.2, py: 0.6, borderRadius: 1.5, fontWeight: 700, fontSize: 14 }}>
                      <TrendingUpIcon sx={{ fontSize: 16 }} /> +2.4%
                    </Box>
                  </Stack>

                  <Stack direction="row" spacing={1} alignItems="flex-end" sx={{ height: 150, p: 2, borderRadius: 2, bgcolor: '#F8FAFC', mb: 2.5 }}>
                    {[40, 65, 32, 82, 52, 90, 63].map((value, idx) => (
                      <Box key={idx} sx={{ flex: 1, bgcolor: idx === 5 ? ACCENT_BLUE : '#93C5FD', borderRadius: 1, height: `${value}%` }} />
                    ))}
                  </Stack>

                  <Stack spacing={1.5}>
                    <Stack direction="row" alignItems="center" justifyContent="space-between">
                      <Stack direction="row" spacing={1.5} alignItems="center">
                        <Avatar sx={{ bgcolor: '#FFEDD5', color: '#EA580C', width: 36, height: 36 }}><ShoppingCartOutlinedIcon sx={{ fontSize: 19 }} /></Avatar>
                        <Box>
                          <Typography sx={{ fontWeight: 700, color: '#1E293B', fontSize: 14 }}>Grocery Store</Typography>
                          <Typography sx={{ color: '#94A3B8', fontSize: 12 }}>Today, 10:42 AM</Typography>
                        </Box>
                      </Stack>
                      <Typography sx={{ color: '#0F172A', fontWeight: 700 }}>-$84.00</Typography>
                    </Stack>
                    <Stack direction="row" alignItems="center" justifyContent="space-between">
                      <Stack direction="row" spacing={1.5} alignItems="center">
                        <Avatar sx={{ bgcolor: '#DBEAFE', color: '#2563EB', width: 36, height: 36 }}><SubscriptionsOutlinedIcon sx={{ fontSize: 19 }} /></Avatar>
                        <Box>
                          <Typography sx={{ fontWeight: 700, color: '#1E293B', fontSize: 14 }}>Netflix Subscription</Typography>
                          <Typography sx={{ color: '#94A3B8', fontSize: 12 }}>Yesterday</Typography>
                        </Box>
                      </Stack>
                      <Typography sx={{ color: '#0F172A', fontWeight: 700 }}>-$15.99</Typography>
                    </Stack>
                  </Stack>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Container>

        <Box id="features" sx={{ bgcolor: '#FFFFFF', borderTop: '1px solid #E2E8F0', borderBottom: '1px solid #E2E8F0', py: { xs: 8, md: 12 } }}>
          <Container maxWidth="lg">
            <Box sx={{ textAlign: 'center', maxWidth: 760, mx: 'auto', mb: 7 }}>
              <Typography sx={{ color: ACCENT_BLUE, fontWeight: 700, letterSpacing: 0.5, mb: 1.5 }}>WHY FINANCE TRACKER?</Typography>
              <Typography sx={{ fontSize: { xs: 34, md: 54/1.2 }, lineHeight: 1.2, fontWeight: 800, color: '#0F172A' }}>
                Everything you need to grow your wealth
              </Typography>
              <Typography sx={{ mt: 2, color: '#64748B', fontSize: { xs: 16, md: 20 }, lineHeight: 1.6 }}>
                Experience the power of automated finance management directly from your favorite messaging app. No more spreadsheets.
              </Typography>
            </Box>

            <Grid container spacing={3}>
              {featureCards.map((item) => (
                <Grid item xs={12} md={4} key={item.title}>
                  <Box sx={{ border: '1px solid #E2E8F0', borderRadius: 4, p: 4, bgcolor: '#F8FAFC', minHeight: 270 }}>
                    <Box sx={{ width: 48, height: 48, borderRadius: 3, bgcolor: '#DBEAFE', display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2.5 }}>
                      {item.icon}
                    </Box>
                    <Typography sx={{ fontSize: 34/1.5, fontWeight: 800, color: '#0F172A', mb: 1.5 }}>{item.title}</Typography>
                    <Typography sx={{ color: '#64748B', lineHeight: 1.7 }}>{item.description}</Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>

        <Box id="pricing" sx={{ position: 'relative', py: { xs: 9, md: 12 }, bgcolor: '#0B1220', overflow: 'hidden' }}>
          <Box sx={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(rgba(148,163,184,0.15) 1px, transparent 1px)', backgroundSize: '18px 18px' }} />
          <Container maxWidth="md" sx={{ position: 'relative', textAlign: 'center' }}>
            <FormatQuoteIcon sx={{ color: ACCENT_BLUE, fontSize: 48, mb: 2 }} />
            <Typography sx={{ color: '#F8FAFC', fontSize: { xs: 36/1.2, md: 58/1.7 }, fontWeight: 800, lineHeight: 1.18, mb: 4 }}>
              "Finally, a finance app that fits into my daily life. The Telegram integration is a game changer."
            </Typography>
            <Stack direction="row" justifyContent="center" alignItems="center" spacing={1.5} sx={{ mb: 6 }}>
              <Avatar sx={{ border: '2px solid #60A5FA', width: 46, height: 46 }}>👩‍💼</Avatar>
              <Box sx={{ textAlign: 'left' }}>
                <Typography sx={{ color: '#FFFFFF', fontWeight: 700 }}>Sarah Jenkins</Typography>
                <Typography sx={{ color: '#94A3B8', fontSize: 14 }}>Freelance Designer</Typography>
              </Box>
            </Stack>

            <Box sx={{ border: '1px solid rgba(148,163,184,0.22)', borderRadius: 4, bgcolor: 'rgba(30,41,59,0.6)', backdropFilter: 'blur(2px)', p: { xs: 4, md: 5 } }}>
              <Typography sx={{ color: '#FFFFFF', fontSize: 36/1.5, fontWeight: 800, mb: 1.5 }}>Ready to take control?</Typography>
              <Typography sx={{ color: '#CBD5E1', maxWidth: 560, mx: 'auto', mb: 3 }}>
                Join thousands of users tracking their wealth effortlessly. Get started for free today.
              </Typography>
              <Button component={Link} to="/register" variant="contained" sx={{ px: 4, py: 1.4, borderRadius: 999, fontWeight: 700, boxShadow: '0 0 24px rgba(59,130,246,0.55)' }}>
                Get Started Free
              </Button>
            </Box>
          </Container>
        </Box>

        <Box id="faq" component="footer" sx={{ bgcolor: '#FFFFFF', borderTop: '1px solid #E2E8F0', py: 8 }}>
          <Container maxWidth="lg">
            <Grid container spacing={4}>
              <Grid item xs={12} md={5}>
                <Stack direction="row" spacing={1.2} alignItems="center" sx={{ mb: 2 }}>
                  <Box sx={{ width: 30, height: 30, borderRadius: 2, bgcolor: '#DBEAFE', color: ACCENT_BLUE, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <AccountBalanceWalletIcon sx={{ fontSize: 18 }} />
                  </Box>
                  <Typography sx={{ fontWeight: 800, color: '#1E293B', fontSize: 30/1.6 }}>Finance Tracker</Typography>
                </Stack>
                <Typography sx={{ color: '#64748B', maxWidth: 350, lineHeight: 1.8 }}>
                  Making personal finance management accessible, secure, and effortless through the tools you already use.
                </Typography>
              </Grid>

              <Grid item xs={6} md={2.3}>
                <Typography sx={{ color: '#1E293B', fontWeight: 800, mb: 2 }}>PRODUCT</Typography>
                <Stack spacing={1.2}>
                  {['Features', 'Pricing', 'Integrations', 'Changelog'].map((item) => (
                    <Typography key={item} sx={{ color: '#64748B' }}>{item}</Typography>
                  ))}
                </Stack>
              </Grid>

              <Grid item xs={6} md={2.3}>
                <Typography sx={{ color: '#1E293B', fontWeight: 800, mb: 2 }}>RESOURCES</Typography>
                <Stack spacing={1.2}>
                  {['Documentation', 'API Reference', 'Community', 'Help Center'].map((item) => (
                    <Typography key={item} sx={{ color: '#64748B' }}>{item}</Typography>
                  ))}
                </Stack>
              </Grid>

              <Grid item xs={12} md={2.4}>
                <Typography sx={{ color: '#1E293B', fontWeight: 800, mb: 2 }}>LEGAL</Typography>
                <Stack spacing={1.2}>
                  {['Privacy', 'Terms', 'Security'].map((item) => (
                    <Typography key={item} sx={{ color: '#64748B' }}>{item}</Typography>
                  ))}
                </Stack>
              </Grid>
            </Grid>

            <Box sx={{ mt: 6, pt: 3, borderTop: '1px solid #E2E8F0', textAlign: 'center' }}>
              <Typography sx={{ color: '#94A3B8' }}>© 2026 Finance Tracker Inc. All rights reserved.</Typography>
            </Box>
          </Container>
        </Box>
      </Box>
    </Box>
  )
}
