import { useEffect, useState, useMemo } from 'react'
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
} from '@mui/material'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import TrendingDownIcon from '@mui/icons-material/TrendingDown'
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet'
import ReceiptIcon from '@mui/icons-material/Receipt'
import AccountBalanceIcon from '@mui/icons-material/AccountBalance'
import CreditCardIcon from '@mui/icons-material/CreditCard'
import StarIcon from '@mui/icons-material/Star'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts'
import { getDashboardStats, DashboardStats } from '../services/dashboard'
import { formatCurrency } from '../utils/formatters'

const INCOME_COLOR = '#16a34a'
const EXPENSE_COLOR = '#dc2626'
const CHART_COLORS = ['#16a34a', '#0ea5e9', '#f59e0b', '#8b5cf6', '#ec4899', '#64748b']

function SummaryCard({
  title,
  value,
  changePercent,
  icon: Icon,
  valueColor,
  invertChange,
}: {
  title: string
  value: string
  changePercent?: number
  icon: React.ElementType
  valueColor?: string
  invertChange?: boolean // e.g. for Expense: down is good
}) {
  const rawPositive = changePercent == null || changePercent >= 0
  const isPositive = invertChange ? !rawPositive : rawPositive
  const displayPercent = changePercent == null ? undefined : (invertChange ? -changePercent : changePercent)
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 1 }}>
          <Box
            sx={{
              width: 44,
              height: 44,
              borderRadius: 2,
              bgcolor: valueColor ? `${valueColor}14` : 'primary.light',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Icon sx={{ fontSize: 24, color: valueColor || 'primary.main' }} />
          </Box>
          {displayPercent != null && (
            <Chip
              icon={isPositive ? <TrendingUpIcon sx={{ fontSize: 16 }} /> : <TrendingDownIcon sx={{ fontSize: 16 }} />}
              label={`${displayPercent >= 0 ? '+' : ''}${displayPercent.toFixed(1)}%`}
              size="small"
              sx={{
                fontWeight: 600,
                fontSize: '0.75rem',
                bgcolor: isPositive ? 'success.light' : 'error.light',
                color: isPositive ? 'success.main' : 'error.main',
                '& .MuiChip-icon': { color: 'inherit' },
              }}
            />
          )}
        </Box>
        <Typography variant="body2" color="text.secondary" fontWeight={500}>
          {title}
        </Typography>
        <Typography variant="h5" fontWeight={700} sx={{ mt: 0.5, color: valueColor || 'text.primary' }}>
          {value}
        </Typography>
      </CardContent>
    </Card>
  )
}

function computePercentChange(months: { income: number; expenses: number }[], key: 'income' | 'expenses') {
  if (!months || months.length < 2) return undefined
  const curr = months[months.length - 1][key]
  const prev = months[months.length - 2][key]
  if (prev === 0) return curr > 0 ? 100 : 0
  return ((curr - prev) / prev) * 100
}

export default function Dashboard() {
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

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight={400}>
        <CircularProgress sx={{ color: 'primary.main' }} />
      </Box>
    )
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>
  }

  if (!stats) {
    return <Alert severity="info">No data available</Alert>
  }

  const cashflowData = stats.monthly_breakdown.map((m) => ({
    month: m.month.slice(0, 7).replace('-', ' '),
    Income: m.income,
    Expense: m.expenses,
  }))

  const totalExpense = stats.category_breakdown.reduce((s, c) => s + c.amount, 0)
  const netBalance = stats.summary.net_balance
  const financeScore = netBalance >= 0 ? Math.min(100, 70 + Math.min(30, netBalance / 1000)) : Math.max(0, 50 + netBalance / 100)

  return (
    <Box>
      {/* Summary cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <SummaryCard
            title="Income"
            value={formatCurrency(stats.summary.total_income, 'INR')}
            changePercent={incomeChange}
            icon={TrendingUpIcon}
            valueColor={INCOME_COLOR}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <SummaryCard
            title="Expense"
            value={formatCurrency(stats.summary.total_expenses, 'INR')}
            changePercent={expenseChange}
            icon={ReceiptIcon}
            valueColor={EXPENSE_COLOR}
            invertChange
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <SummaryCard
            title="Net Balance"
            value={formatCurrency(stats.summary.net_balance, 'INR')}
            valueColor={stats.summary.net_balance >= 0 ? INCOME_COLOR : EXPENSE_COLOR}
            icon={AccountBalanceIcon}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <SummaryCard
            title="Accounts"
            value={String(stats.summary.accounts_count)}
            icon={AccountBalanceWalletIcon}
          />
        </Grid>
      </Grid>

      {/* Charts row */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} lg={7}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Cashflow
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Income vs expense — last 6 months
              </Typography>
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={cashflowData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `${v}`} />
                  <Tooltip
                    formatter={(value: number) => [formatCurrency(value, 'INR'), '']}
                    contentStyle={{ borderRadius: 10 }}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="Income" stroke={INCOME_COLOR} strokeWidth={2} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="Expense" stroke={EXPENSE_COLOR} strokeWidth={2} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} lg={5}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    Expense breakdown
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    Total: {formatCurrency(totalExpense, 'INR')}
                  </Typography>
                  <ResponsiveContainer width="100%" height={180}>
                    <PieChart>
                      <Pie
                        data={stats.category_breakdown}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={75}
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
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <StarIcon sx={{ color: 'warning.main', fontSize: 28 }} />
                    <Typography variant="h6" fontWeight={600}>
                      Finance score
                    </Typography>
                  </Box>
                  <Typography variant="h4" fontWeight={700} color="primary.main">
                    {financeScore.toFixed(0)}%
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {financeScore >= 80 ? 'Excellent' : financeScore >= 60 ? 'Good' : 'Needs attention'}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      {/* Balance & Recent transactions */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Balance
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Your accounts
              </Typography>
              {stats.account_balances.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  No accounts yet
                </Typography>
              ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {stats.account_balances.map((acc) => (
                    <Box
                      key={acc.id}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        p: 1.5,
                        borderRadius: 2,
                        bgcolor: 'grey.50',
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <CreditCardIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                        <Box>
                          <Typography variant="body2" fontWeight={600}>
                            {acc.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {acc.type}
                          </Typography>
                        </Box>
                      </Box>
                      <Typography variant="body2" fontWeight={600}>
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
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Recent transactions
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Last 10 transactions
              </Typography>
              {stats.recent_transactions.length === 0 ? (
                <Typography color="text.secondary">No recent transactions</Typography>
              ) : (
                <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow sx={{ bgcolor: 'grey.50' }}>
                        <TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Merchant</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Category</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Account</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 600 }}>
                          Amount
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {stats.recent_transactions.map((txn) => {
                        const amount = parseFloat(txn.amount)
                        const isIncome = amount > 0
                        return (
                          <TableRow key={txn.id} hover>
                            <TableCell>{new Date(txn.date).toLocaleDateString()}</TableCell>
                            <TableCell>{txn.merchant || '—'}</TableCell>
                            <TableCell>{txn.category || 'Uncategorized'}</TableCell>
                            <TableCell>{txn.account || '—'}</TableCell>
                            <TableCell
                              align="right"
                              sx={{
                                fontWeight: 600,
                                color: isIncome ? 'success.main' : 'error.main',
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
