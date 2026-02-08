import { Link } from 'react-router-dom'
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet'
import AccountBalanceIcon from '@mui/icons-material/AccountBalance'
import ShowChartIcon from '@mui/icons-material/ShowChart'
import ReceiptIcon from '@mui/icons-material/Receipt'
import ScheduleIcon from '@mui/icons-material/Schedule'
import CreditCardIcon from '@mui/icons-material/CreditCard'
import SecurityIcon from '@mui/icons-material/Security'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { themeColors } from '../theme'

const { ACCENT_BLUE, TEXT_PRIMARY, TEXT_SECONDARY, BORDER } = themeColors

const sectionCards = [
  {
    icon: <AccountBalanceIcon sx={{ fontSize: 40, color: 'white' }} />,
    title: 'Overview of funds',
    description: 'See all your money at a glance. Debit & credit cards, transfers, investments, and dedicated buckets in one dashboard.',
  },
  {
    icon: <ReceiptIcon sx={{ fontSize: 40, color: 'white' }} />,
    title: 'Transaction history',
    description: 'Track every payment with payer, description, date, amount and status. Filter by period and keep a clear record.',
  },
  {
    icon: <ShowChartIcon sx={{ fontSize: 40, color: 'white' }} />,
    title: 'Balance & trends',
    description: 'View your balance over time with clear charts. Understand how your finances change month by month.',
  },
  {
    icon: <ScheduleIcon sx={{ fontSize: 40, color: 'white' }} />,
    title: 'Scheduled & recent payments',
    description: 'Manage upcoming bills and see recent payments. Never miss a due date.',
  },
  {
    icon: <CreditCardIcon sx={{ fontSize: 40, color: 'white' }} />,
    title: 'Account & card details',
    description: 'Check available funds, card details and credit info in one place.',
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
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
      {/* Top bar – dark, FinanceTracker branding */}
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: 64,
          bgcolor: 'background.paper',
          borderBottom: `1px solid ${BORDER}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 3,
          zIndex: 1100,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            sx={{
              width: 44,
              height: 44,
              borderRadius: 2,
              bgcolor: ACCENT_BLUE,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
            }}
          >
            <AccountBalanceWalletIcon sx={{ fontSize: 26 }} />
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 600, color: TEXT_PRIMARY }}>
            FinanceTracker
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button
            component={Link}
            to="/login"
            variant="outlined"
            sx={{
              color: TEXT_PRIMARY,
              borderColor: BORDER,
              borderRadius: 2,
              '&:hover': { borderColor: ACCENT_BLUE, bgcolor: 'rgba(46, 117, 251, 0.08)' },
            }}
          >
            Log in
          </Button>
          <Button
            component={Link}
            to="/register"
            variant="contained"
            sx={{
              bgcolor: ACCENT_BLUE,
              color: 'white',
              borderRadius: 2,
              '&:hover': { bgcolor: '#2563EB' },
            }}
          >
            Sign up
          </Button>
        </Box>
      </Box>

      <Box sx={{ pt: 10, pb: 8 }}>
        <Container maxWidth="lg" sx={{ py: 8, px: 2 }}>
          <Box sx={{ textAlign: 'center', maxWidth: 720, mx: 'auto', mb: 6 }}>
            <Typography
              variant={isSmall ? 'h4' : 'h3'}
              sx={{ fontWeight: 700, color: TEXT_PRIMARY, mb: 2 }}
            >
              Take control of your money
            </Typography>
            <Typography variant="h6" sx={{ color: TEXT_SECONDARY, fontWeight: 400, mb: 3 }}>
              One place to track spending, schedule payments and see your balance over time.
            </Typography>
            <Button
              component={Link}
              to="/login"
              variant="contained"
              size="large"
              endIcon={<ArrowForwardIcon />}
              sx={{
                bgcolor: ACCENT_BLUE,
                color: 'white',
                borderRadius: 2,
                px: 4,
                py: 1.5,
                fontSize: '1rem',
                '&:hover': { bgcolor: '#2563EB' },
              }}
            >
              Get started — Log in
            </Button>
          </Box>

          <Typography variant="h5" sx={{ fontWeight: 600, color: TEXT_PRIMARY, mb: 3, textAlign: 'center' }}>
            What you get
          </Typography>
          <Grid container spacing={3} sx={{ mb: 8 }}>
            {sectionCards.map((item, i) => (
              <Grid item xs={12} sm={6} md={4} key={i}>
                <Card sx={{ height: '100%', border: `1px solid ${BORDER}` }}>
                  <CardContent sx={{ p: 3 }}>
                    <Box
                      sx={{
                        width: 64,
                        height: 64,
                        borderRadius: 2,
                        bgcolor: ACCENT_BLUE,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mb: 2,
                      }}
                    >
                      {item.icon}
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: TEXT_PRIMARY, mb: 1 }}>
                      {item.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: TEXT_SECONDARY, lineHeight: 1.6 }}>
                      {item.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Typography variant="h5" sx={{ fontWeight: 600, color: TEXT_PRIMARY, mb: 3, textAlign: 'center' }}>
            How it works
          </Typography>
          <Grid container spacing={4} sx={{ mb: 8 }} justifyContent="center">
            {processSteps.map(({ step, title, body }) => (
              <Grid item xs={12} md={4} key={step}>
                <Card sx={{ height: '100%', border: `1px solid ${BORDER}`, position: 'relative', overflow: 'visible' }}>
                  <Box
                    sx={{
                      position: 'absolute',
                      top: -16,
                      left: 24,
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      bgcolor: ACCENT_BLUE,
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
                    <Typography variant="h6" sx={{ fontWeight: 600, color: TEXT_PRIMARY, mb: 1 }}>
                      {title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: TEXT_SECONDARY, lineHeight: 1.6 }}>
                      {body}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Card sx={{ border: `1px solid ${BORDER}`, bgcolor: ACCENT_BLUE }}>
            <CardContent sx={{ py: 6, px: 4, textAlign: 'center' }}>
              <SecurityIcon sx={{ fontSize: 56, mb: 2, opacity: 0.9, color: 'white' }} />
              <Typography variant="h5" sx={{ fontWeight: 600, mb: 1, color: 'white' }}>
                Your finances, in one place
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.9, mb: 3, maxWidth: 480, mx: 'auto', color: 'white' }}>
                Log in to access your dashboard, transactions, scheduled payments and balance trends.
              </Typography>
              <Button
                component={Link}
                to="/login"
                variant="contained"
                size="large"
                sx={{
                  bgcolor: 'white',
                  color: ACCENT_BLUE,
                  borderRadius: 2,
                  px: 4,
                  py: 1.5,
                  fontWeight: 600,
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.9)' },
                }}
              >
                Log in
              </Button>
              <Typography variant="body2" sx={{ mt: 2, opacity: 0.8, color: 'white' }}>
                New here? <Link to="/register" style={{ color: 'white', fontWeight: 600 }}>Sign up</Link>
              </Typography>
            </CardContent>
          </Card>
        </Container>
      </Box>
    </Box>
  )
}
