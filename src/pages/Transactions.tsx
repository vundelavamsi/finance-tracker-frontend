import { useState, useEffect } from 'react'
import {
  Box,
  Button,
  Card,
  CardContent,
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
} from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import AddIcon from '@mui/icons-material/Add'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { getTransactions, createTransaction, updateTransaction, deleteTransaction } from '../services/transactions'
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
  category_id: z.union([z.number(), z.string(), z.null()]).optional().transform((val) => val === '' ? null : (typeof val === 'string' ? Number(val) : val)),
  account_id: z.union([z.number(), z.string(), z.null()]).optional().transform((val) => val === '' ? null : (typeof val === 'string' ? Number(val) : val)),
  status: z.string().default('PENDING'),
})

type TransactionFormData = z.infer<typeof transactionSchema>

export default function Transactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [accounts, setAccounts] = useState<Account[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [openDialog, setOpenDialog] = useState(false)
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null)

  const { register, handleSubmit, reset, formState: { errors } } = useForm<TransactionFormData>({
    resolver: zodResolver(transactionSchema),
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const [txns, cats, accs] = await Promise.all([
        getTransactions(),
        getCategories(),
        getAccounts(),
      ])
      setTransactions(txns)
      setCategories(cats)
      setAccounts(accs)
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
      reset({
        amount: transaction.amount,
        currency: transaction.currency,
        merchant: transaction.merchant || '',
        category_id: transaction.category_id || '',
        account_id: transaction.account_id || '',
        status: transaction.status,
      })
    } else {
      setEditingTransaction(null)
      reset({
        amount: '',
        currency: 'INR',
        merchant: '',
        category_id: '',
        account_id: '',
        status: 'PENDING',
      })
    }
    setOpenDialog(true)
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
    setEditingTransaction(null)
    reset()
  }

  const onSubmit = async (data: TransactionFormData) => {
    try {
      const submitData = {
        ...data,
        category_id: data.category_id === '' ? null : data.category_id,
        account_id: data.account_id === '' ? null : data.account_id,
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
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h4" fontWeight={700}>Transactions</Typography>
          <Typography variant="body2" color="text.secondary">View and manage all your transactions</Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenDialog()}>
          Add Transaction
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Card sx={{ overflow: 'hidden' }}>
        <TableContainer component={Box}>
        <Table>
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
            <TextField
              fullWidth
              label="Amount"
              {...register('amount')}
              error={!!errors.amount}
              helperText={errors.amount?.message}
              margin="normal"
            />
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
            <TextField
              fullWidth
              label="Merchant"
              {...register('merchant')}
              margin="normal"
            />
            <TextField
              fullWidth
              select
              label="Category"
              {...register('category_id', { 
                setValueAs: (v) => v === '' ? null : Number(v)
              })}
              margin="normal"
              defaultValue=""
            >
              <MenuItem value="">None</MenuItem>
              {categories.map((cat) => (
                <MenuItem key={cat.id} value={cat.id}>
                  {cat.name}
                </MenuItem>
              ))}
            </TextField>
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
