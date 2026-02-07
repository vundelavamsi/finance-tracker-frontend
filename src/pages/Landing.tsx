import { Link } from 'react-router-dom'
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  useTheme,
  useMediaQuery,
} from '@mui/material'
import CreditCardIcon from '@mui/icons-material/CreditCard'
import AccountBalanceIcon from '@mui/icons-material/AccountBalance'
import ShowChartIcon from '@mui/icons-material/ShowChart'
import ReceiptIcon from '@mui/icons-material/Receipt'
import ScheduleIcon from '@mui/icons-material/Schedule'
import SecurityIcon from '@mui/icons-material/Security'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'

const ACCENT = '#5B4B8A'
const ACCENT_LIGHT = '#7B6BA8'
const BG_LIGHT = '#F5F5F7'
const CARD_BG = '#FFFFFF'

const sectionCards = [
  {
    icon: <AccountBalanceIcon sx={{ fontSize: 40, color: 'white' }} />,
    title: 'Overview of funds',
    description: 'See all your money at a glance. Debit & credit cards, transfers, investments, and dedicated buckets like kids’ education in one dashboard.',
  },
  {
    icon: <ReceiptIcon sx={{ fontSize: 40, color: 'white' }} />,
    title: 'Transaction history',
    description: 'Track every payment with payer, description, date, amount and status. Filter by period and keep a clear record of your spending.',
  },
  {
    icon: <ShowChartIcon sx={{ fontSize: 40, color: 'white' }} />,
    title: 'Balance & trends',
    description: 'View your balance over time with clear charts. Understand how your finances change month by month and plan ahead.',
  },
  {
    icon: <ScheduleIcon sx={{ fontSize: 40, color: 'white' }} />,
    title: 'Scheduled & recent payments',
    description: 'Manage upcoming bills and see recent payments. Never miss a due date and keep utilities, insurance and subscriptions under control.',
  },
  {
    icon: <CreditCardIcon sx={{ fontSize: 40, color: 'white' }} />,
    title: 'Account & card details',
    description: 'Check available funds, card details and credit info in one place. Your finances, clearly and securely presented.',
  },
]

const processSteps = [
  { step: 1, title: 'Connect & categorise', body: 'Add accounts and categorise income and expenses so everything is in one place.' },
  { step: 2, title: 'Track & schedule', body: 'Record transactions and set up scheduled payments so you stay on top of bills.' },
  { step: 3, title: 'Review & improve', body: 'Use dashboards and trends to see where your money goes and make better decisions.' },
]

export default function Landing() {
  const theme = useTheme()
  const isSmall = useMediaQuery(theme.breakpoints.down('sm'))

  return (
    <Box sx={{ bgcolor: BG_LIGHT, minHeight: '100vh' }}>
      {/* Top bar – same style as app sidebar */}
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: 64,
          bgcolor: ACCENT,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 3,
          zIndex: 1100,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: '10px',
              bgcolor: 'rgba(255,255,255,0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 700,
              fontSize: '1.25rem',
            }}
          >
            F
          </Box>
          <Typography variant="h6" sx={{ color: 'white', fontWeight: 600 }}>
            Finance
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button
            component={Link}
            to="/login"
            variant="outlined"
            sx={{
              color: 'white',
              borderColor: 'rgba(255,255,255,0.6)',
              borderRadius: 2,
              '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.1)' },
            }}
          >
            Log in
          </Button>
          <Button
            component={Link}
            to="/register"
            variant="contained"
            sx={{
              bgcolor: 'white',
              color: ACCENT,
              borderRadius: 2,
              '&:hover': { bgcolor: 'rgba(255,255,255,0.9)' },
            }}
          >
            Sign up
          </Button>
        </Box>
      </Box>

      <Box sx={{ pt: 10, pb: 8 }}>
        {/* Hero */}
        <Container maxWidth="lg" sx={{ py: 8, px: 2 }}>
          <Box sx={{ textAlign: 'center', maxWidth: 720, mx: 'auto', mb: 6 }}>
            <Typography
              variant={isSmall ? 'h4' : 'h3'}
              sx={{ fontWeight: 700, color: '#1a1a1a', mb: 2 }}
            >
              Take control of your money
            </Typography>
            <Typography variant="h6" sx={{ color: '#666', fontWeight: 400, mb: 3 }}>
              One place to track spending, schedule payments and see your balance over time.
            </Typography>
            <Button
              component={Link}
              to="/login"
              variant="contained"
              size="large"
              endIcon={<ArrowForwardIcon />}
              sx={{
                bgcolor: ACCENT,
                color: 'white',
                borderRadius: 2,
                px: 4,
                py: 1.5,
                fontSize: '1rem',
                '&:hover': { bgcolor: ACCENT_LIGHT },
              }}
            >
              Get started — Log in
            </Button>
          </Box>

          {/* Sections */}
          <Typography variant="h5" sx={{ fontWeight: 600, color: '#1a1a1a', mb: 3, textAlign: 'center' }}>
            What you get
          </Typography>
          <Grid container spacing={3} sx={{ mb: 8 }}>
            {sectionCards.map((item, i) => (
              <Grid item xs={12} sm={6} md={4} key={i}>
                <Card
                  sx={{
                    height: '100%',
                    borderRadius: 3,
                    boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
                    border: '1px solid rgba(0,0,0,0.06)',
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box
                      sx={{
                        width: 64,
                        height: 64,
                        borderRadius: 2,
                        bgcolor: ACCENT,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mb: 2,
                      }}
                    >
                      {item.icon}
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: '#1a1a1a', mb: 1 }}>
                      {item.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#666', lineHeight: 1.6 }}>
                      {item.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Process */}
          <Typography variant="h5" sx={{ fontWeight: 600, color: '#1a1a1a', mb: 3, textAlign: 'center' }}>
            How it works
          </Typography>
          <Grid container spacing={4} sx={{ mb: 8 }} justifyContent="center">
            {processSteps.map(({ step, title, body }) => (
              <Grid item xs={12} md={4} key={step}>
                <Card
                  sx={{
                    height: '100%',
                    borderRadius: 3,
                    boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
                    border: '1px solid rgba(0,0,0,0.06)',
                    position: 'relative',
                    overflow: 'visible',
                  }}
                >
                  <Box
                    sx={{
                      position: 'absolute',
                      top: -16,
                      left: 24,
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      bgcolor: ACCENT,
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 700,
                      fontSize: '1.125rem',
                    }}
                  >
                    {step}
                  </Box>
                  <CardContent sx={{ pt: 4, pb: 3, px: 3 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: '#1a1a1a', mb: 1 }}>
                      {title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#666', lineHeight: 1.6 }}>
                      {body}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* CTA */}
          <Card
            sx={{
              borderRadius: 3,
              boxShadow: '0 8px 32px rgba(91,75,138,0.2)',
              bgcolor: ACCENT,
              color: 'white',
              overflow: 'hidden',
            }}
          >
            <CardContent sx={{ py: 6, px: 4, textAlign: 'center' }}>
              <SecurityIcon sx={{ fontSize: 56, mb: 2, opacity: 0.9 }} />
              <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
                Your finances, in one place
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.9, mb: 3, maxWidth: 480, mx: 'auto' }}>
                Log in to access your dashboard, transactions, scheduled payments and balance trends.
              </Typography>
              <Button
                component={Link}
                to="/login"
                variant="contained"
                size="large"
                sx={{
                  bgcolor: 'white',
                  color: ACCENT,
                  borderRadius: 2,
                  px: 4,
                  py: 1.5,
                  fontWeight: 600,
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.9)' },
                }}
              >
                Log in
              </Button>
              <Typography variant="body2" sx={{ mt: 2, opacity: 0.8 }}>
                New here? <Link to="/register" style={{ color: 'white', fontWeight: 600 }}>Sign up</Link>
              </Typography>
            </CardContent>
          </Card>
        </Container>
      </Box>
    </Box>
  )
}
