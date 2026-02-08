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
  CircularProgress,
  Alert,
  Chip,
  Switch,
  FormControlLabel,
} from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import AddIcon from '@mui/icons-material/Add'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { getCategories, createCategory, updateCategory, deleteCategory } from '../services/categories'
import { getCurrentUser, updateCurrentUser } from '../services/users'
import type { Category, CategoryCreate, CategoryType } from '../types/category'
import type { User } from '../types/user'

const categorySchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  color: z.string().regex(/^#[0-9A-F]{6}$/i, 'Invalid color format'),
  icon: z.string().optional(),
  is_active: z.boolean().default(true),
})

type CategoryFormData = z.infer<typeof categorySchema>

export default function Settings() {
  const [user, setUser] = useState<User | null>(null)
  const [incomeCategories, setIncomeCategories] = useState<Category[]>([])
  const [expenseCategories, setExpenseCategories] = useState<Category[]>([]) // top-level only, with sub_categories when enabled
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [openDialog, setOpenDialog] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [dialogMode, setDialogMode] = useState<'income' | 'expense' | 'sub'>('expense')
  const [subCategoryParentId, setSubCategoryParentId] = useState<number | null>(null)

  const { register, handleSubmit, reset, formState: { errors } } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      color: '#6366f1',
    },
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const [userRes, incomeRes, expenseRes] = await Promise.all([
        getCurrentUser(),
        getCategories({ type: 'INCOME' }),
        getCategories({ type: 'EXPENSE', include_children: true }),
      ])
      setUser(userRes)
      setIncomeCategories(incomeRes)
      setExpenseCategories(expenseRes)
      setError(null)
    } catch (err) {
      setError('Failed to load configuration')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleToggleSubCategory = async (checked: boolean) => {
    if (!user) return
    try {
      const updated = await updateCurrentUser({ expense_sub_category_enabled: checked })
      setUser(updated)
    } catch (err) {
      console.error(err)
      setError('Failed to update sub-category setting')
    }
  }

  const handleOpenDialog = (
    mode: 'income' | 'expense' | 'sub',
    category?: Category,
    parentId?: number
  ) => {
    setDialogMode(mode)
    setSubCategoryParentId(parentId ?? null)
    if (category) {
      setEditingCategory(category)
      reset({
        name: category.name,
        description: category.description || '',
        color: category.color,
        icon: category.icon || '',
        is_active: category.is_active,
      })
    } else {
      setEditingCategory(null)
      reset({
        name: '',
        description: '',
        color: '#6366f1',
        icon: '',
        is_active: true,
      })
    }
    setOpenDialog(true)
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
    setEditingCategory(null)
    setSubCategoryParentId(null)
    reset()
  }

  const buildPayload = (data: CategoryFormData): CategoryCreate => {
    const base = {
      name: data.name,
      description: data.description || undefined,
      color: data.color,
      icon: data.icon || undefined,
      is_active: data.is_active,
    }
    if (dialogMode === 'income') {
      return { ...base, category_type: 'INCOME', parent_id: null }
    }
    if (dialogMode === 'sub' && subCategoryParentId != null) {
      return { ...base, category_type: 'EXPENSE', parent_id: subCategoryParentId }
    }
    return { ...base, category_type: 'EXPENSE', parent_id: null }
  }

  const onSubmit = async (data: CategoryFormData) => {
    try {
      if (editingCategory) {
        await updateCategory(editingCategory.id, {
          name: data.name,
          description: data.description || undefined,
          color: data.color,
          icon: data.icon || undefined,
          is_active: data.is_active,
        })
      } else {
        await createCategory(buildPayload(data))
      }
      handleCloseDialog()
      loadData()
    } catch (err) {
      console.error(err)
      setError('Failed to save category')
    }
  }

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return
    try {
      await deleteCategory(id)
      loadData()
    } catch (err) {
      console.error(err)
      setError('Failed to delete category')
    }
  }

  const dialogModeForType = (t: CategoryType): 'income' | 'expense' => (t === 'INCOME' ? 'income' : 'expense')

  const renderCategoryCard = (category: Category, type: CategoryType, canEdit = true) => (
    <Grid item xs={12} sm={6} md={4} key={category.id}>
      <Card variant="outlined">
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="start" mb={2}>
            <Chip
              label={category.name}
              sx={{
                bgcolor: category.color,
                color: 'white',
                fontWeight: 'bold',
              }}
            />
            {canEdit && (
              <Box>
                <IconButton size="small" onClick={() => handleOpenDialog(dialogModeForType(type), category)}>
                  <EditIcon />
                </IconButton>
                <IconButton size="small" onClick={() => handleDelete(category.id)}>
                  <DeleteIcon />
                </IconButton>
              </Box>
            )}
          </Box>
          {category.description && (
            <Typography variant="body2" color="textSecondary">
              {category.description}
            </Typography>
          )}
        </CardContent>
      </Card>
    </Grid>
  )

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Configuration
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>{error}</Alert>}

      {/* Section 1: Income Category */}
      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h6">Income Category</Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleOpenDialog('income')}
            >
              Add Category
            </Button>
          </Box>
          <Grid container spacing={2}>
            {incomeCategories.map((cat) => renderCategoryCard(cat, 'INCOME'))}
            {incomeCategories.length === 0 && (
              <Grid item xs={12}>
                <Typography color="textSecondary">No income categories yet.</Typography>
              </Grid>
            )}
          </Grid>
        </CardContent>
      </Card>

      {/* Section 2: Expense Category */}
      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h6">Expense Category</Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleOpenDialog('expense')}
            >
              Add Category
            </Button>
          </Box>
          <Grid container spacing={2}>
            {expenseCategories.map((cat) => renderCategoryCard(cat, 'EXPENSE'))}
            {expenseCategories.length === 0 && (
              <Grid item xs={12}>
                <Typography color="textSecondary">No expense categories yet.</Typography>
              </Grid>
            )}
          </Grid>
        </CardContent>
      </Card>

      {/* Section 3: Expense Sub Category (global switch) */}
      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6">Expense Sub Category</Typography>
            <FormControlLabel
              control={
                <Switch
                  checked={user?.expense_sub_category_enabled ?? false}
                  onChange={(_, checked) => handleToggleSubCategory(checked)}
                  color="primary"
                />
              }
              label="Enable sub-categories for expenses"
            />
          </Box>
          {!user?.expense_sub_category_enabled ? (
            <Typography color="textSecondary">
              Sub-categories are disabled. Turn the switch on to manage sub-categories under each expense category.
            </Typography>
          ) : (
            <>
              <Typography color="textSecondary" sx={{ mb: 2 }}>
                Add sub-categories under each expense category below.
              </Typography>
              {expenseCategories.map((parent) => (
                <Box key={parent.id} sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                    {parent.name}
                  </Typography>
                  <Box display="flex" flexWrap="wrap" gap={1} alignItems="center" mb={1}>
                    <Button
                      size="small"
                      startIcon={<AddIcon />}
                      onClick={() => handleOpenDialog('sub', undefined, parent.id)}
                    >
                      Add Sub-category
                    </Button>
                    {(parent.sub_categories ?? []).map((sub) => (
                      <Chip
                        key={sub.id}
                        label={sub.name}
                        size="small"
                        onDelete={() => handleDelete(sub.id)}
                        onClick={() => handleOpenDialog('sub', sub, parent.id)}
                        sx={{ bgcolor: sub.color, color: 'white' }}
                      />
                    ))}
                    {(parent.sub_categories?.length ?? 0) === 0 && (
                      <Typography variant="caption" color="textSecondary">
                        No sub-categories
                      </Typography>
                    )}
                  </Box>
                </Box>
              ))}
            </>
          )}
        </CardContent>
      </Card>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogTitle>
            {editingCategory
              ? dialogMode === 'sub'
                ? 'Edit Sub-category'
                : `Edit ${dialogMode === 'income' ? 'Income' : 'Expense'} Category`
              : dialogMode === 'sub'
                ? 'Add Sub-category'
                : `Add ${dialogMode === 'income' ? 'Income' : 'Expense'} Category`}
          </DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              label="Category Name"
              {...register('name')}
              error={!!errors.name}
              helperText={errors.name?.message}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Description"
              {...register('description')}
              margin="normal"
              multiline
              rows={2}
            />
            <TextField
              fullWidth
              type="color"
              label="Color"
              {...register('color')}
              error={!!errors.color}
              helperText={errors.color?.message || 'Select a color for this category'}
              margin="normal"
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              fullWidth
              label="Icon (optional)"
              {...register('icon')}
              margin="normal"
              placeholder="e.g., 🍔, 🚗"
            />
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
