import { useState, useEffect } from 'react'
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Grid,
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
import { getAccounts, createAccount, updateAccount, deleteAccount } from '../services/accounts'
import { Account, AccountCreate, AccountType } from '../types/account'
import { formatCurrency } from '../utils/formatters'

const accountSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  account_type: z.enum(['BANK_ACCOUNT', 'CREDIT_CARD', 'DEBIT_CARD', 'WALLET', 'CASH', 'OTHER']),
  balance: z.coerce.number().default(0),
  currency: z.string().default('INR'),
  is_active: z.boolean().default(true),
})

type AccountFormData = z.infer<typeof accountSchema>

export default function Accounts() {
  const [accounts, setAccounts] = useState<Account[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [openDialog, setOpenDialog] = useState(false)
  const [editingAccount, setEditingAccount] = useState<Account | null>(null)

  const { register, handleSubmit, reset, formState: { errors } } = useForm<AccountFormData>({
    resolver: zodResolver(accountSchema),
  })

  useEffect(() => {
    loadAccounts()
  }, [])

  const loadAccounts = async () => {
    try {
      setLoading(true)
      const data = await getAccounts()
      setAccounts(data)
      setError(null)
    } catch (err) {
      setError('Failed to load accounts')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleOpenDialog = (account?: Account) => {
    if (account) {
      setEditingAccount(account)
      reset({
        name: account.name,
        account_type: account.account_type,
        balance: account.balance,
        currency: account.currency,
        is_active: account.is_active,
      })
    } else {
      setEditingAccount(null)
      reset({
        name: '',
        account_type: 'BANK_ACCOUNT',
        balance: 0,
        currency: 'INR',
        is_active: true,
      })
    }
    setOpenDialog(true)
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
    setEditingAccount(null)
    reset()
  }

  const onSubmit = async (data: AccountFormData) => {
    try {
      if (editingAccount) {
        await updateAccount(editingAccount.id, data)
      } else {
        await createAccount(data)
      }
      handleCloseDialog()
      loadAccounts()
    } catch (err) {
      console.error(err)
      setError('Failed to save account')
    }
  }

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this account?')) {
      try {
        await deleteAccount(id)
        loadAccounts()
      } catch (err) {
        console.error(err)
        setError('Failed to delete account')
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
        <Typography variant="h4">Bank Accounts</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenDialog()}>
          Add Account
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Grid container spacing={3}>
        {accounts.map((account) => (
          <Grid item xs={12} sm={6} md={4} key={account.id}>
            <Card>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="start" mb={2}>
                  <Box>
                    <Typography variant="h6">{account.name}</Typography>
                    <Typography color="textSecondary" variant="body2">
                      {account.account_type.replace('_', ' ')}
                    </Typography>
                  </Box>
                  <Box>
                    <IconButton size="small" onClick={() => handleOpenDialog(account)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton size="small" onClick={() => handleDelete(account.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Box>
                <Typography variant="h5" color="primary">
                  {formatCurrency(account.balance, account.currency)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogTitle>{editingAccount ? 'Edit Account' : 'Add Account'}</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              label="Account Name"
              {...register('name')}
              error={!!errors.name}
              helperText={errors.name?.message}
              margin="normal"
            />
            <TextField
              fullWidth
              select
              label="Account Type"
              {...register('account_type')}
              margin="normal"
            >
              <MenuItem value="BANK_ACCOUNT">Bank Account</MenuItem>
              <MenuItem value="CREDIT_CARD">Credit Card</MenuItem>
              <MenuItem value="DEBIT_CARD">Debit Card</MenuItem>
              <MenuItem value="WALLET">Wallet</MenuItem>
              <MenuItem value="CASH">Cash</MenuItem>
              <MenuItem value="OTHER">Other</MenuItem>
            </TextField>
            <TextField
              fullWidth
              type="number"
              label="Initial Balance"
              {...register('balance', { valueAsNumber: true })}
              inputProps={{ step: '0.01' }}
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
