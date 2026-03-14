import { useState, useEffect } from 'react'
import {
  Box,
  Button,
  Card,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  CircularProgress,
  Alert,
  Autocomplete,
  Divider,
} from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import AddIcon from '@mui/icons-material/Add'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { getTransactions, createTransaction, updateTransaction, deleteTransaction, getMerchants } from '../services/transactions'
import { getCategories } from '../services/categories'
import { getAccounts } from '../services/accounts'
import { Transaction, TransactionCreate } from '../types/transaction'
import { Category } from '../types/category'
import { Account } from '../types/account'
import { formatCurrency, formatDate } from '../utils/formatters'

const transactionSchema = z.object({
  amount: z.string().min(1, 'Amount is required'),
  currency: z.string().default('INR'),
  merchant: z.string().optional(),
  category_id: z.number().nullable().optional(),
  account_id: z.union([z.number(), z.string(), z.null()]).optional().transform((val) => val === '' ? null : (typeof val === 'string' ? Number(val) : val)),
  status: z.string().default('PENDING'),
  transaction_type: z.enum(['INCOME', 'EXPENSE']).default('EXPENSE'),
})

type TransactionFormData = z.infer<typeof transactionSchema>

export default function Transactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [accounts, setAccounts] = useState<Account[]>([])
  const [merchants, setMerchants] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [openDialog, setOpenDialog] = useState(false)
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null)
  // Tracks which parent category is selected in the dialog (UI state only)
  const [selectedParentId, setSelectedParentId] = useState<number | null>(null)

  const { register, handleSubmit, reset, control, setValue, watch, formState: { errors } } = useForm<TransactionFormData>({
    resolver: zodResolver(transactionSchema),
  })

  // Derived category lists
  const currentType = watch('transaction_type')
  const parentCategories = categories.filter(c => {
    if (c.parent_id !== null) return false
    if (!c.category_type) return true
    return c.category_type === currentType
  })
  const subCategories = categories.filter(c => c.parent_id === selectedParentId)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const [txns, cats, accs, merch] = await Promise.all([
        getTransactions(),
        getCategories(),
        getAccounts(),
        getMerchants(),
      ])
      setTransactions(txns)
      setCategories(cats)
      setAccounts(accs)
      setMerchants(merch)
      setError(null)
    } catch (err) {
      setError('Failed to load data')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleOpenDialog = (transaction?: Transaction) => {
    if (transaction) {
      setEditingTransaction(transaction)
      // Resolve parent/sub for the existing category_id
      const cat = categories.find(c => c.id === transaction.category_id)
      if (cat?.parent_id) {
        // It's a sub-category — set parent and keep category_id as the sub
        setSelectedParentId(cat.parent_id)
      } else if (cat) {
        // It's a parent category itself
        setSelectedParentId(cat.id)
      } else {
        setSelectedParentId(null)
      }
      const txnType = transaction.transaction_type || (parseFloat(transaction.amount) >= 0 ? 'INCOME' : 'EXPENSE')
      reset({
        amount: String(Math.abs(parseFloat(transaction.amount))),
        currency: transaction.currency,
        merchant: transaction.merchant || '',
        category_id: transaction.category_id ?? null,
        account_id: transaction.account_id ?? null,
        status: transaction.status,
        transaction_type: txnType as 'INCOME' | 'EXPENSE',
      })
    } else {
      setEditingTransaction(null)
      setSelectedParentId(null)
      reset({
        amount: '',
        currency: 'INR',
        merchant: '',
        category_id: null,
        account_id: null,
        status: 'PENDING',
        transaction_type: 'EXPENSE',
      })
    }
    setOpenDialog(true)
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
    setEditingTransaction(null)
    setSelectedParentId(null)
    reset()
  }

  const onSubmit = async (data: TransactionFormData) => {
    try {
      // Store as negative for EXPENSE, positive for INCOME
      const signedAmount = data.transaction_type === 'EXPENSE'
        ? String(-Math.abs(parseFloat(data.amount)))
        : String(Math.abs(parseFloat(data.amount)))

      const submitData: TransactionCreate = {
        ...data,
        amount: signedAmount,
        category_id: data.category_id ?? null,
        account_id: data.account_id ?? null,
      }
      if (editingTransaction) {
        await updateTransaction(editingTransaction.id, submitData)
      } else {
        await createTransaction(submitData)
      }
      handleCloseDialog()
      loadData()
    } catch (err) {
      console.error(err)
      setError('Failed to save transaction')
    }
  }

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      try {
        await deleteTransaction(id)
        loadData()
      } catch (err) {
        console.error(err)
        setError('Failed to delete transaction')
      }
    }
  }

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3} flexWrap="wrap" gap={1}>
        <Box>
          <Typography variant="h4" fontWeight={700} sx={{ fontSize: { xs: '1.5rem', sm: '2.125rem' } }}>Transactions</Typography>
          <Typography variant="body2" color="text.secondary">View and manage all your transactions</Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenDialog()}>
          Add Transaction
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Card sx={{ overflow: 'hidden' }}>
        <TableContainer component={Box} sx={{ overflowX: 'auto' }}>
        <Table sx={{ minWidth: 600 }}>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Merchant</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Account</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {transactions.map((txn) => (
              <TableRow key={txn.id}>
                <TableCell>{formatDate(txn.created_at)}</TableCell>
                <TableCell>{formatCurrency(parseFloat(txn.amount), txn.currency)}</TableCell>
                <TableCell>{txn.merchant || 'N/A'}</TableCell>
                <TableCell>
                  <Box
                    component="span"
                    sx={{
                      px: 1,
                      py: 0.5,
                      borderRadius: 1,
                      bgcolor: txn.category?.color || '#f0f0f0',
                      color: 'white',
                      fontSize: '0.875rem',
                    }}
                  >
                    {txn.category?.name || 'Uncategorized'}
                  </Box>
                </TableCell>
                <TableCell>{txn.account?.name || 'N/A'}</TableCell>
                <TableCell>{txn.status}</TableCell>
                <TableCell>
                  <IconButton size="small" onClick={() => handleOpenDialog(txn)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton size="small" onClick={() => handleDelete(txn.id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      </Card>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogTitle>{editingTransaction ? 'Edit Transaction' : 'Add Transaction'}</DialogTitle>
          <DialogContent>

            {/* Transaction Type Toggle */}
            <Box sx={{ display: 'flex', gap: 1, mb: 2, mt: 1 }}>
              <Button
                fullWidth
                variant={watch('transaction_type') === 'INCOME' ? 'contained' : 'outlined'}
                onClick={() => {
                  setValue('transaction_type', 'INCOME')
                  setSelectedParentId(null)
                  setValue('category_id', null)
                }}
                sx={{
                  bgcolor: watch('transaction_type') === 'INCOME' ? '#22c55e' : 'transparent',
                  color: watch('transaction_type') === 'INCOME' ? 'white' : '#22c55e',
                  borderColor: '#22c55e',
                  '&:hover': { bgcolor: watch('transaction_type') === 'INCOME' ? '#16a34a' : '#f0fdf4' },
                }}
              >
                ↑ Income
              </Button>
              <Button
                fullWidth
                variant={watch('transaction_type') === 'EXPENSE' ? 'contained' : 'outlined'}
                onClick={() => {
                  setValue('transaction_type', 'EXPENSE')
                  setSelectedParentId(null)
                  setValue('category_id', null)
                }}
                sx={{
                  bgcolor: watch('transaction_type') === 'EXPENSE' ? '#ef4444' : 'transparent',
                  color: watch('transaction_type') === 'EXPENSE' ? 'white' : '#ef4444',
                  borderColor: '#ef4444',
                  '&:hover': { bgcolor: watch('transaction_type') === 'EXPENSE' ? '#dc2626' : '#fef2f2' },
                }}
              >
                ↓ Expense
              </Button>
            </Box>

            {/* Amount */}
            <TextField
              fullWidth
              label="Amount"
              type="number"
              inputProps={{ min: 0, step: 0.01 }}
              {...register('amount')}
              error={!!errors.amount}
              helperText={errors.amount?.message}
              margin="normal"
            />

            {/* Currency */}
            <TextField
              fullWidth
              select
              label="Currency"
              {...register('currency')}
              margin="normal"
              defaultValue="INR"
            >
              <MenuItem value="INR">INR</MenuItem>
              <MenuItem value="USD">USD</MenuItem>
            </TextField>

            {/* Merchant — Autocomplete with saved suggestions + free text */}
            <Controller
              name="merchant"
              control={control}
              render={({ field }) => (
                <Autocomplete
                  freeSolo
                  options={merchants}
                  value={field.value || ''}
                  onInputChange={(_, value) => field.onChange(value)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Merchant"
                      margin="normal"
                      fullWidth
                      helperText="Type or pick a saved merchant"
                    />
                  )}
                />
              )}
            />

            <Divider sx={{ my: 1.5 }} />

            {/* Parent Category */}
            <TextField
              fullWidth
              select
              label="Category"
              value={selectedParentId ?? ''}
              onChange={(e) => {
                const val = e.target.value === '' ? null : Number(e.target.value)
                setSelectedParentId(val)
                // Set category_id to the parent by default; sub-selection overrides below
                setValue('category_id', val)
              }}
              margin="normal"
            >
              <MenuItem value="">None</MenuItem>
              {parentCategories.map((cat) => (
                <MenuItem key={cat.id} value={cat.id}>
                  {cat.name}
                </MenuItem>
              ))}
            </TextField>

            {/* Sub-category — only shown when selected parent has children */}
            {selectedParentId !== null && subCategories.length > 0 && (
              <Controller
                name="category_id"
                control={control}
                render={({ field }) => (
                  <TextField
                    fullWidth
                    select
                    label="Sub-category"
                    value={
                      // Show the sub-category value only if it's actually a child of the selected parent
                      field.value !== null && field.value !== selectedParentId ? field.value : ''
                    }
                    onChange={(e) => {
                      const val = e.target.value === '' ? selectedParentId : Number(e.target.value)
                      field.onChange(val)
                    }}
                    margin="normal"
                    helperText="Optional — leave blank to use parent category"
                  >
                    <MenuItem value="">— Use parent category —</MenuItem>
                    {subCategories.map((cat) => (
                      <MenuItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
            )}

            <Divider sx={{ my: 1.5 }} />

            {/* Account */}
            <TextField
              fullWidth
              select
              label="Account"
              {...register('account_id', {
                setValueAs: (v) => v === '' ? null : Number(v)
              })}
              margin="normal"
              defaultValue=""
            >
              <MenuItem value="">None</MenuItem>
              {accounts.map((acc) => (
                <MenuItem key={acc.id} value={acc.id}>
                  {acc.name}
                </MenuItem>
              ))}
            </TextField>

            {/* Status */}
            <TextField
              fullWidth
              select
              label="Status"
              {...register('status')}
              margin="normal"
              defaultValue="PENDING"
            >
              <MenuItem value="PENDING">Pending</MenuItem>
              <MenuItem value="VERIFIED">Verified</MenuItem>
            </TextField>

          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button type="submit" variant="contained">Save</Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  )
}
