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
import AddIcon from '@mui/icons-material/Add'
import {
  BarChart,
  Bar,
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

const { ACCENT_BLUE, TEXT_SECONDARY, SUCCESS, ERROR } = themeColors
const INCOME_COLOR = SUCCESS
const EXPENSE_COLOR = ERROR
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
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 1 }}>
          <Box
            sx={{
              width: 44,
              height: 44,
              borderRadius: 2,
              bgcolor: iconBg,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: iconColor,
            }}
          >
            <Icon sx={{ fontSize: 24 }} />
          </Box>
          {changeLabel != null && (
            <Chip
              label={changeLabel}
              size="small"
              sx={{
                fontWeight: 600,
                fontSize: '0.75rem',
                bgcolor: changePositive ? 'rgba(40, 167, 69, 0.2)' : 'rgba(220, 53, 69, 0.2)',
                color: changePositive ? SUCCESS : ERROR,
                border: 'none',
              }}
            />
          )}
        </Box>
        <Typography variant="body2" sx={{ color: TEXT_SECONDARY, fontWeight: 500 }}>
          {title}
        </Typography>
        <Typography variant="h5" fontWeight={700} sx={{ mt: 0.5, color: 'text.primary' }}>
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
    <Box>
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
          <Typography variant="h4" fontWeight={700} gutterBottom>
            Dashboard Overview
          </Typography>
          <Typography variant="body1" sx={{ color: TEXT_SECONDARY }}>
            Welcome back, {displayName}. Here&apos;s what&apos;s happening with your money today.
          </Typography>
        </Box>
        <Button
          component={Link}
          to="/app/transactions"
          variant="contained"
          startIcon={<AddIcon />}
          sx={{
            bgcolor: ACCENT_BLUE,
            color: '#fff',
            borderRadius: 2,
            px: 2,
            '&:hover': { bgcolor: '#2563EB' },
          }}
        >
          Add Transaction
        </Button>
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
            iconBg="rgba(40, 167, 69, 0.25)"
            iconColor={INCOME_COLOR}
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
            iconBg="rgba(220, 53, 69, 0.25)"
            iconColor={EXPENSE_COLOR}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <SummaryCard
            title="Net Balance"
            value={formatCurrency(stats.summary.net_balance, 'INR')}
            changeLabel={netChange != null ? `${netChange >= 0 ? '+' : ''}${netChange.toFixed(1)}%` : undefined}
            changePositive={netChange == null || netChange >= 0}
            icon={CreditCardIcon}
            iconBg="rgba(46, 117, 251, 0.3)"
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
            iconBg="rgba(245, 158, 11, 0.3)"
            iconColor="#F59E0B"
          />
        </Grid>
      </Grid>

      {/* Charts */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} lg={7}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Cashflow Performance
              </Typography>
              <Typography variant="body2" sx={{ color: TEXT_SECONDARY, mb: 2 }}>
                Income vs. Expenses (Last 6 Months)
              </Typography>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={cashflowData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                  <XAxis dataKey="month" tick={{ fill: TEXT_SECONDARY, fontSize: 12 }} />
                  <YAxis tick={{ fill: TEXT_SECONDARY, fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: themeColors.CARD_BG,
                      border: `1px solid ${themeColors.BORDER}`,
                      borderRadius: 10,
                    }}
                    formatter={(value: number) => [formatCurrency(value, 'INR'), '']}
                  />
                  <Legend />
                  <Bar dataKey="Income" fill={INCOME_COLOR} name="Income" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Expenses" fill={EXPENSE_COLOR} name="Expenses" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} lg={5}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Expense Breakdown
              </Typography>
              <Typography variant="body2" sx={{ color: TEXT_SECONDARY, mb: 1 }}>
                Categorized spending this month
              </Typography>
              <Typography variant="h6" sx={{ mb: 2 }}>
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
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" fontWeight={600}>
                  Balances by Account
                </Typography>
                <Button component={Link} to="/app/accounts" size="small" sx={{ color: ACCENT_BLUE }}>
                  View All
                </Button>
              </Box>
              {stats.account_balances.length === 0 ? (
                <Typography variant="body2" sx={{ color: TEXT_SECONDARY }}>
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
                        p: 1.5,
                        borderRadius: 2,
                        bgcolor: 'rgba(255,255,255,0.04)',
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <CreditCardIcon sx={{ color: TEXT_SECONDARY, fontSize: 20 }} />
                        <Box>
                          <Typography variant="body2" fontWeight={600}>
                            {acc.name}
                          </Typography>
                          <Typography variant="caption" sx={{ color: TEXT_SECONDARY }}>
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
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" fontWeight={600}>
                  Recent Transactions
                </Typography>
                <Button component={Link} to="/app/transactions" size="small" sx={{ color: ACCENT_BLUE }}>
                  See Statement
                </Button>
              </Box>
              {stats.recent_transactions.length === 0 ? (
                <Typography sx={{ color: TEXT_SECONDARY }}>No recent transactions</Typography>
              ) : (
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>TRANSACTION</TableCell>
                        <TableCell>DATE</TableCell>
                        <TableCell>CATEGORY</TableCell>
                        <TableCell align="right">AMOUNT</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {stats.recent_transactions.map((txn) => {
                        const amount = parseFloat(txn.amount)
                        const isIncome = amount > 0
                        return (
                          <TableRow key={txn.id} hover>
                            <TableCell>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <ShoppingCartIcon sx={{ fontSize: 18, color: TEXT_SECONDARY }} />
                                {txn.merchant || '—'}
                              </Box>
                            </TableCell>
                            <TableCell sx={{ color: TEXT_SECONDARY }}>
                              {new Date(txn.date).toLocaleDateString()}
                            </TableCell>
                            <TableCell sx={{ color: TEXT_SECONDARY }}>
                              {txn.category || 'Uncategorized'}
                            </TableCell>
                            <TableCell
                              align="right"
                              sx={{
                                fontWeight: 600,
                                color: isIncome ? SUCCESS : ERROR,
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
