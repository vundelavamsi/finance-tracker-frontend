import { useEffect, useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Alert,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
} from '@mui/material'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import CreditCardIcon from '@mui/icons-material/CreditCard'
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts'
import { getDashboardStats, DashboardStats } from '../services/dashboard'
import { formatCurrency } from '../utils/formatters'
import { useAuth } from '../contexts/AuthContext'
import { themeColors } from '../theme'

const { ACCENT_BLUE } = themeColors
const CHART_COLORS = [ACCENT_BLUE, '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#64748B']

function computePercentChange(
  months: { income: number; expenses: number }[],
  key: 'income' | 'expenses'
) {
  if (!months || months.length < 2) return undefined
  const curr = months[months.length - 1][key]
  const prev = months[months.length - 2][key]
  if (prev === 0) return curr > 0 ? 100 : 0
  return ((curr - prev) / prev) * 100
}

function SummaryCard({
  title,
  value,
  changeLabel,
  changePositive,
  icon: Icon,
  iconBg,
  iconColor = '#fff',
}: {
  title: string
  value: string
  changeLabel?: string
  changePositive?: boolean
  icon: React.ElementType
  iconBg: string
  iconColor?: string
}) {
  return (
    <Card sx={{ bgcolor: '#FFFFFF', borderRadius: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: 2,
              bgcolor: iconBg,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: iconColor,
            }}
          >
            <Icon sx={{ fontSize: 26 }} />
          </Box>
          {changeLabel != null && (
            <Chip
              label={changeLabel}
              size="small"
              sx={{
                fontWeight: 600,
                fontSize: '0.75rem',
                bgcolor: changePositive ? '#D1FAE5' : '#FEE2E2',
                color: changePositive ? '#059669' : '#DC2626',
                border: 'none',
                height: 24,
              }}
            />
          )}
        </Box>
        <Typography variant="body2" sx={{ color: '#64748B', fontWeight: 500, fontSize: '0.875rem' }}>
          {title}
        </Typography>
        <Typography variant="h5" fontWeight={700} sx={{ mt: 1, color: '#0F172A', fontSize: '1.75rem' }}>
          {value}
        </Typography>
      </CardContent>
    </Card>
  )
}

export default function Dashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      setLoading(true)
      const data = await getDashboardStats()
      setStats(data)
      setError(null)
    } catch (err) {
      setError('Failed to load dashboard data')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const incomeChange = useMemo(
    () => (stats ? computePercentChange(stats.monthly_breakdown, 'income') : undefined),
    [stats]
  )
  const expenseChange = useMemo(
    () => (stats ? computePercentChange(stats.monthly_breakdown, 'expenses') : undefined),
    [stats]
  )
  const netChange = useMemo(() => {
    if (!stats || stats.monthly_breakdown.length < 2) return undefined
    const curr =
      stats.monthly_breakdown[stats.monthly_breakdown.length - 1].income -
      stats.monthly_breakdown[stats.monthly_breakdown.length - 1].expenses
    const prev =
      stats.monthly_breakdown[stats.monthly_breakdown.length - 2].income -
      stats.monthly_breakdown[stats.monthly_breakdown.length - 2].expenses
    if (prev === 0) return curr > 0 ? 100 : 0
    return ((curr - prev) / prev) * 100
  }, [stats])

  const displayName =
    user?.telegram_username ? `@${user.telegram_username}` : user?.email || user?.phone || 'there'

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight={400}>
        <CircularProgress sx={{ color: ACCENT_BLUE }} />
      </Box>
    )
  }

  if (error) return <Alert severity="error">{error}</Alert>
  if (!stats) return <Alert severity="info">No data available</Alert>

  const cashflowData = stats.monthly_breakdown.map((m) => ({
    month: m.month.slice(0, 7).replace('-', ' '),
    Income: m.income,
    Expenses: m.expenses,
  }))
  const totalExpense = stats.category_breakdown.reduce((s, c) => s + c.amount, 0)

  return (
    <Box sx={{ bgcolor: '#F8FAFC', minHeight: '100vh', p: { xs: 2, sm: 3, md: 4 } }}>
      {/* Title row */}
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: 2,
          mb: 4,
        }}
      >
        <Box>
          <Typography variant="h4" fontWeight={700} sx={{ color: '#0F172A', fontSize: '1.875rem' }} gutterBottom>
            Dashboard Overview
          </Typography>
          <Typography variant="body1" sx={{ color: '#64748B', fontSize: '0.95rem' }}>
            Welcome back, {displayName}. Here&apos;s what&apos;s happening with your money today.
          </Typography>
        </Box>
      </Box>

      {/* Summary cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <SummaryCard
            title="Monthly Income"
            value={formatCurrency(stats.summary.total_income, 'INR')}
            changeLabel={incomeChange != null ? `${incomeChange >= 0 ? '+' : ''}${incomeChange.toFixed(1)}%` : undefined}
            changePositive={incomeChange == null || incomeChange >= 0}
            icon={TrendingUpIcon}
            iconBg="#D1FAE5"
            iconColor="#059669"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <SummaryCard
            title="Monthly Expenses"
            value={formatCurrency(stats.summary.total_expenses, 'INR')}
            changeLabel={
              expenseChange != null
                ? `${expenseChange <= 0 ? '' : '+'}${expenseChange.toFixed(1)}%`
                : undefined
            }
            changePositive={expenseChange != null && expenseChange <= 0}
            icon={ShoppingCartIcon}
            iconBg="#FEE2E2"
            iconColor="#DC2626"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <SummaryCard
            title="Net Balance"
            value={formatCurrency(stats.summary.net_balance, 'INR')}
            changeLabel={netChange != null ? `${netChange >= 0 ? '+' : ''}${netChange.toFixed(1)}%` : undefined}
            changePositive={netChange == null || netChange >= 0}
            icon={CreditCardIcon}
            iconBg="#DBEAFE"
            iconColor={ACCENT_BLUE}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <SummaryCard
            title="Total Assets"
            value={formatCurrency(
              stats.account_balances.reduce((s, a) => s + a.balance, 0),
              stats.account_balances[0]?.currency || 'INR'
            )}
            changeLabel="Overall"
            changePositive
            icon={AccountBalanceWalletIcon}
            iconBg="#FEF3C7"
            iconColor="#F59E0B"
          />
        </Grid>
      </Grid>

      {/* Charts */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} lg={7}>
          <Card sx={{ bgcolor: '#FFFFFF', borderRadius: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={700} sx={{ color: '#0F172A', fontSize: '1.125rem' }} gutterBottom>
                Cashflow Performance
              </Typography>
              <Typography variant="body2" sx={{ color: '#64748B', mb: 3, fontSize: '0.875rem' }}>
                Income vs. Expenses (Last 6 Months)
              </Typography>
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={cashflowData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                  <XAxis dataKey="month" tick={{ fill: '#64748B', fontSize: 12 }} />
                  <YAxis tick={{ fill: '#64748B', fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #E2E8F0',
                      borderRadius: 8,
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    }}
                    formatter={(value: number) => [formatCurrency(value, 'INR'), '']}
                  />
                  <Legend wrapperStyle={{ color: '#64748B' }} />
                  <Line
                    type="monotone"
                    dataKey="Income"
                    stroke="#059669"
                    strokeWidth={3}
                    dot={{ r: 5, strokeWidth: 2, fill: '#FFFFFF', stroke: '#059669' }}
                    activeDot={{ r: 6 }}
                    name="Income"
                  />
                  <Line
                    type="monotone"
                    dataKey="Expenses"
                    stroke="#DC2626"
                    strokeWidth={3}
                    dot={{ r: 5, strokeWidth: 2, fill: '#FFFFFF', stroke: '#DC2626' }}
                    activeDot={{ r: 6 }}
                    name="Expenses"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} lg={5}>
          <Card sx={{ bgcolor: '#FFFFFF', borderRadius: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={700} sx={{ color: '#0F172A', fontSize: '1.125rem' }} gutterBottom>
                Expense Breakdown
              </Typography>
              <Typography variant="body2" sx={{ color: '#64748B', mb: 1, fontSize: '0.875rem' }}>
                Categorized spending this month
              </Typography>
              <Typography variant="h6" fontWeight={700} sx={{ mb: 2, color: '#0F172A', fontSize: '1.25rem' }}>
                {formatCurrency(totalExpense, 'INR')} TOTAL
              </Typography>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={stats.category_breakdown}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={85}
                    paddingAngle={2}
                    dataKey="amount"
                    nameKey="name"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {stats.category_breakdown.map((entry, index) => (
                      <Cell key={entry.name} fill={entry.color || CHART_COLORS[index % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => formatCurrency(value, 'INR')} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Balances by Account & Recent Transactions */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card sx={{ bgcolor: '#FFFFFF', borderRadius: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" fontWeight={700} sx={{ color: '#0F172A', fontSize: '1.125rem' }}>
                  Balances by Account
                </Typography>
                <Button component={Link} to="/app/accounts" size="small" sx={{ color: ACCENT_BLUE, fontWeight: 600, fontSize: '0.875rem' }}>
                  View All
                </Button>
              </Box>
              {stats.account_balances.length === 0 ? (
                <Typography variant="body2" sx={{ color: '#64748B' }}>
                  No accounts yet
                </Typography>
              ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {stats.account_balances.slice(0, 4).map((acc) => (
                    <Box
                      key={acc.id}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        p: 2,
                        borderRadius: 2,
                        bgcolor: '#F8FAFC',
                        border: '1px solid #E2E8F0',
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <CreditCardIcon sx={{ color: ACCENT_BLUE, fontSize: 22 }} />
                        <Box>
                          <Typography variant="body2" fontWeight={600} sx={{ color: '#0F172A' }}>
                            {acc.name}
                          </Typography>
                          <Typography variant="caption" sx={{ color: '#64748B', textTransform: 'capitalize' }}>
                            {acc.type}
                          </Typography>
                        </Box>
                      </Box>
                      <Typography variant="body2" fontWeight={700} sx={{ color: '#0F172A' }}>
                        {formatCurrency(acc.balance, acc.currency)}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={8}>
          <Card sx={{ bgcolor: '#FFFFFF', borderRadius: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" fontWeight={700} sx={{ color: '#0F172A', fontSize: '1.125rem' }}>
                  Recent Transactions
                </Typography>
                <Button component={Link} to="/app/transactions" size="small" sx={{ color: ACCENT_BLUE, fontWeight: 600, fontSize: '0.875rem' }}>
                  See Statement
                </Button>
              </Box>
              {stats.recent_transactions.length === 0 ? (
                <Typography sx={{ color: '#64748B' }}>No recent transactions</Typography>
              ) : (
                <TableContainer sx={{ overflowX: 'auto' }}>
                  <Table size="small" sx={{ minWidth: 400 }}>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ color: '#64748B', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: '2px solid #E2E8F0' }}>TRANSACTION</TableCell>
                        <TableCell sx={{ color: '#64748B', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: '2px solid #E2E8F0' }}>DATE</TableCell>
                        <TableCell sx={{ color: '#64748B', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: '2px solid #E2E8F0' }}>CATEGORY</TableCell>
                        <TableCell align="right" sx={{ color: '#64748B', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: '2px solid #E2E8F0' }}>AMOUNT</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {stats.recent_transactions.map((txn) => {
                        const amount = parseFloat(txn.amount)
                        const isIncome = amount > 0
                        return (
                          <TableRow key={txn.id} hover sx={{ '&:hover': { bgcolor: '#F8FAFC' } }}>
                            <TableCell sx={{ borderBottom: '1px solid #E2E8F0' }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                <ShoppingCartIcon sx={{ fontSize: 20, color: '#64748B' }} />
                                <Typography variant="body2" fontWeight={600} sx={{ color: '#0F172A' }}>
                                  {txn.merchant || '—'}
                                </Typography>
                              </Box>
                            </TableCell>
                            <TableCell sx={{ color: '#64748B', fontSize: '0.875rem', borderBottom: '1px solid #E2E8F0' }}>
                              {new Date(txn.date).toLocaleDateString()}
                            </TableCell>
                            <TableCell sx={{ borderBottom: '1px solid #E2E8F0' }}>
                              <Chip
                                label={txn.category || 'Uncategorized'}
                                size="small"
                                sx={{
                                  bgcolor: '#F1F5F9',
                                  color: '#475569',
                                  fontSize: '0.75rem',
                                  fontWeight: 600,
                                  height: 24,
                                }}
                              />
                            </TableCell>
                            <TableCell
                              align="right"
                              sx={{
                                fontWeight: 700,
                                fontSize: '0.875rem',
                                color: isIncome ? '#059669' : '#DC2626',
                                borderBottom: '1px solid #E2E8F0',
                              }}
                            >
                              {formatCurrency(amount, txn.currency)}
                            </TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}
