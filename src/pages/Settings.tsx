import { useEffect, useState } from 'react'
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControlLabel,
  IconButton,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  Stack,
  Switch,
  TextField,
  Typography,
} from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import AddIcon from '@mui/icons-material/Add'
import SaveIcon from '@mui/icons-material/Save'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { createCategory, deleteCategory, getCategories, reorderCategories, updateCategory } from '../services/categories'
import { getMerchants, renameMerchant, deleteMerchant } from '../services/transactions'
import { getCurrentUser, updateCurrentUser } from '../services/users'
import type { Category, CategoryCreate, CategoryType } from '../types/category'
import type { User } from '../types/user'

const PRESET_COLORS = [
  '#6366f1',
  '#0ea5e9',
  '#14b8a6',
  '#22c55e',
  '#84cc16',
  '#f59e0b',
  '#f97316',
  '#ef4444',
  '#ec4899',
  '#8b5cf6',
  '#64748b',
  '#111827',
]

const categorySchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  color: z.string().regex(/^#[0-9A-F]{6}$/i, 'Invalid color format'),
  icon: z.string().optional(),
  is_active: z.boolean().default(true),
})

type CategoryFormData = z.infer<typeof categorySchema>

const moveItem = <T,>(items: T[], from: number, to: number): T[] => {
  const next = [...items]
  const [item] = next.splice(from, 1)
  next.splice(to, 0, item)
  return next
}

const withOrderIndex = (items: Category[]): Category[] =>
  items.map((item, idx) => ({ ...item, order_index: idx }))

export default function Settings() {
  const [user, setUser] = useState<User | null>(null)
  const [incomeCategories, setIncomeCategories] = useState<Category[]>([])
  const [expenseCategories, setExpenseCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [openDialog, setOpenDialog] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [dialogMode, setDialogMode] = useState<'income' | 'expense' | 'sub'>('expense')
  const [subCategoryParentId, setSubCategoryParentId] = useState<number | null>(null)
  const [merchants, setMerchants] = useState<string[]>([])
  const [merchantsLoading, setMerchantsLoading] = useState(false)
  const [editingMerchant, setEditingMerchant] = useState<string | null>(null)
  const [editMerchantValue, setEditMerchantValue] = useState('')
  const [isReordering, setIsReordering] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: { color: PRESET_COLORS[0], is_active: true },
  })
  const selectedColor = watch('color')

  useEffect(() => {
    loadData()
    loadMerchants()
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
      console.error(err)
      setError('Failed to load configuration')
    } finally {
      setLoading(false)
    }
  }

  const loadMerchants = async () => {
    try {
      setMerchantsLoading(true)
      const result = await getMerchants()
      setMerchants(result)
    } catch (err) {
      console.error(err)
    } finally {
      setMerchantsLoading(false)
    }
  }

  const handleOpenDialog = (mode: 'income' | 'expense' | 'sub', category?: Category, parentId?: number) => {
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
      reset({ name: '', description: '', color: PRESET_COLORS[0], icon: '', is_active: true })
    }
    setOpenDialog(true)
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
    setEditingCategory(null)
    setSubCategoryParentId(null)
    reset({ name: '', description: '', color: PRESET_COLORS[0], icon: '', is_active: true })
  }

  const buildPayload = (data: CategoryFormData): CategoryCreate => {
    const base = {
      name: data.name,
      description: data.description || undefined,
      color: data.color,
      icon: data.icon || undefined,
      is_active: data.is_active,
    }
    if (dialogMode === 'income') return { ...base, category_type: 'INCOME', parent_id: null }
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
      await loadData()
    } catch (err) {
      console.error(err)
      setError('Failed to save category')
    }
  }

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return
    try {
      await deleteCategory(id)
      await loadData()
    } catch (err) {
      console.error(err)
      setError('Failed to delete category')
    }
  }

  const persistOrder = async (items: Category[], parentId: number | null) => {
    await reorderCategories({
      parent_id: parentId,
      items: items.map((item, idx) => ({ id: item.id, order_index: idx })),
    })
  }

  const moveTopLevelCategory = async (
    type: CategoryType,
    categories: Category[],
    index: number,
    direction: 'up' | 'down'
  ) => {
    const target = direction === 'up' ? index - 1 : index + 1
    if (target < 0 || target >= categories.length || isReordering) return
    const reordered = withOrderIndex(moveItem(categories, index, target))

    setIsReordering(true)
    if (type === 'INCOME') setIncomeCategories(reordered)
    else setExpenseCategories(reordered)

    try {
      await persistOrder(reordered, null)
    } catch (err) {
      console.error(err)
      setError('Failed to reorder categories')
      await loadData()
    } finally {
      setIsReordering(false)
    }
  }

  const moveSubCategory = async (parentId: number, index: number, direction: 'up' | 'down') => {
    const parent = expenseCategories.find((item) => item.id === parentId)
    if (!parent) return
    const current = parent.sub_categories ?? []
    const target = direction === 'up' ? index - 1 : index + 1
    if (target < 0 || target >= current.length || isReordering) return

    const reorderedChildren = withOrderIndex(moveItem(current, index, target))
    const nextExpense = expenseCategories.map((cat) =>
      cat.id === parentId ? { ...cat, sub_categories: reorderedChildren } : cat
    )

    setIsReordering(true)
    setExpenseCategories(nextExpense)
    try {
      await persistOrder(reorderedChildren, parentId)
    } catch (err) {
      console.error(err)
      setError('Failed to reorder sub-categories')
      await loadData()
    } finally {
      setIsReordering(false)
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

  const handleRenameMerchant = async (oldName: string) => {
    if (!editMerchantValue.trim()) return
    try {
      const updated = await renameMerchant(oldName, editMerchantValue.trim())
      setMerchants(updated)
      setEditingMerchant(null)
      setEditMerchantValue('')
    } catch (err) {
      console.error(err)
      setError('Failed to rename merchant')
    }
  }

  const handleDeleteMerchant = async (name: string) => {
    if (!window.confirm(`Remove merchant "${name}" from all transactions?`)) return
    try {
      await deleteMerchant(name)
      setMerchants((prev) => prev.filter((m) => m !== name))
    } catch (err) {
      console.error(err)
      setError('Failed to delete merchant')
    }
  }

  const renderCategoryRow = (
    category: Category,
    options: {
      canMoveUp: boolean
      canMoveDown: boolean
      onMoveUp: () => void
      onMoveDown: () => void
      onEdit: () => void
      onDelete: () => void
    }
  ) => (
    <Box
      key={category.id}
      sx={{
        p: 1.5,
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 2,
        bgcolor: 'background.paper',
      }}
    >
      <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between">
        <Stack direction="row" spacing={1.5} alignItems="center" sx={{ minWidth: 0, flex: 1 }}>
          <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: category.color, flexShrink: 0 }} />
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="body2" fontWeight={700} noWrap>
              {category.name}
            </Typography>
            {category.description && (
              <Typography variant="caption" color="text.secondary" noWrap>
                {category.description}
              </Typography>
            )}
          </Box>
          <Chip
            size="small"
            label={category.is_active ? 'Active' : 'Inactive'}
            color={category.is_active ? 'success' : 'default'}
            variant="outlined"
          />
        </Stack>

        <Stack direction="row" spacing={0.5}>
          <IconButton size="small" onClick={options.onMoveUp} disabled={!options.canMoveUp || isReordering}>
            <KeyboardArrowUpIcon fontSize="small" />
          </IconButton>
          <IconButton size="small" onClick={options.onMoveDown} disabled={!options.canMoveDown || isReordering}>
            <KeyboardArrowDownIcon fontSize="small" />
          </IconButton>
          <IconButton size="small" onClick={options.onEdit}>
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton size="small" onClick={options.onDelete}>
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Stack>
      </Stack>
    </Box>
  )

  const renderCategorySection = (title: string, type: CategoryType, categories: Category[]) => (
    <Card sx={{ mt: 3 }}>
      <CardContent>
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6">{title}</Typography>
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenDialog(type === 'INCOME' ? 'income' : 'expense')}>
            Add Category
          </Button>
        </Stack>

        <Stack spacing={1.2}>
          {categories.map((cat, idx) =>
            renderCategoryRow(cat, {
              canMoveUp: idx > 0,
              canMoveDown: idx < categories.length - 1,
              onMoveUp: () => moveTopLevelCategory(type, categories, idx, 'up'),
              onMoveDown: () => moveTopLevelCategory(type, categories, idx, 'down'),
              onEdit: () => handleOpenDialog(type === 'INCOME' ? 'income' : 'expense', cat),
              onDelete: () => handleDelete(cat.id),
            })
          )}
          {categories.length === 0 && <Typography color="text.secondary">No categories yet.</Typography>}
        </Stack>
      </CardContent>
    </Card>
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

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {renderCategorySection('Income Categories', 'INCOME', incomeCategories)}
      {renderCategorySection('Expense Categories', 'EXPENSE', expenseCategories)}

      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6">Expense Sub Categories</Typography>
            <FormControlLabel
              control={
                <Switch
                  checked={user?.expense_sub_category_enabled ?? false}
                  onChange={(_, checked) => handleToggleSubCategory(checked)}
                />
              }
              label="Enable"
            />
          </Stack>

          {!user?.expense_sub_category_enabled ? (
            <Typography color="text.secondary">Turn on sub-categories to manage child categories under each expense category.</Typography>
          ) : (
            <Stack spacing={2}>
              {expenseCategories.map((parent) => (
                <Box key={parent.id} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, p: 1.5 }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
                    <Typography variant="subtitle2">{parent.name}</Typography>
                    <Button size="small" startIcon={<AddIcon />} onClick={() => handleOpenDialog('sub', undefined, parent.id)}>
                      Add Sub-category
                    </Button>
                  </Stack>
                  <Stack spacing={1}>
                    {(parent.sub_categories ?? []).map((sub, idx, list) =>
                      renderCategoryRow(sub, {
                        canMoveUp: idx > 0,
                        canMoveDown: idx < list.length - 1,
                        onMoveUp: () => moveSubCategory(parent.id, idx, 'up'),
                        onMoveDown: () => moveSubCategory(parent.id, idx, 'down'),
                        onEdit: () => handleOpenDialog('sub', sub, parent.id),
                        onDelete: () => handleDelete(sub.id),
                      })
                    )}
                    {(parent.sub_categories?.length ?? 0) === 0 && (
                      <Typography variant="body2" color="text.secondary">
                        No sub-categories yet.
                      </Typography>
                    )}
                  </Stack>
                </Box>
              ))}
            </Stack>
          )}
        </CardContent>
      </Card>

      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="h6" mb={2}>
            Saved Merchants
          </Typography>
          {merchantsLoading ? (
            <CircularProgress size={24} />
          ) : merchants.length === 0 ? (
            <Typography color="text.secondary">No merchants saved yet.</Typography>
          ) : (
            <List disablePadding>
              {merchants.map((merchant) => (
                <ListItem key={merchant} divider sx={{ px: 0 }}>
                  {editingMerchant === merchant ? (
                    <Box display="flex" alignItems="center" gap={1} width="100%">
                      <TextField
                        size="small"
                        value={editMerchantValue}
                        onChange={(e) => setEditMerchantValue(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleRenameMerchant(merchant)
                        }}
                        autoFocus
                        sx={{ flex: 1 }}
                      />
                      <Button size="small" variant="contained" startIcon={<SaveIcon />} onClick={() => handleRenameMerchant(merchant)}>
                        Save
                      </Button>
                      <Button size="small" onClick={() => { setEditingMerchant(null); setEditMerchantValue('') }}>
                        Cancel
                      </Button>
                    </Box>
                  ) : (
                    <>
                      <ListItemText primary={merchant} />
                      <ListItemSecondaryAction>
                        <IconButton
                          size="small"
                          onClick={() => {
                            setEditingMerchant(merchant)
                            setEditMerchantValue(merchant)
                          }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton size="small" onClick={() => handleDeleteMerchant(merchant)}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </>
                  )}
                </ListItem>
              ))}
            </List>
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

            <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>
              Color Presets
            </Typography>
            <Stack direction="row" flexWrap="wrap" gap={1}>
              {PRESET_COLORS.map((color) => (
                <Box
                  key={color}
                  role="button"
                  aria-label={`Select ${color}`}
                  onClick={() => setValue('color', color, { shouldValidate: true })}
                  sx={{
                    width: 28,
                    height: 28,
                    borderRadius: '50%',
                    bgcolor: color,
                    cursor: 'pointer',
                    border: '2px solid',
                    borderColor: selectedColor === color ? 'text.primary' : 'transparent',
                    boxShadow: 1,
                  }}
                />
              ))}
            </Stack>

            <TextField
              fullWidth
              type="color"
              label="Custom Color (optional)"
              {...register('color')}
              error={!!errors.color}
              helperText={errors.color?.message || 'Pick from presets or use a custom color'}
              margin="normal"
              InputLabelProps={{ shrink: true }}
            />

            <Box sx={{ mt: 2 }}>
              <Typography variant="caption" color="text.secondary">
                Preview
              </Typography>
              <Box
                sx={{
                  mt: 0.75,
                  p: 1.25,
                  borderRadius: 2,
                  border: '1px solid',
                  borderColor: 'divider',
                  bgcolor: 'background.default',
                }}
              >
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: selectedColor || PRESET_COLORS[0] }} />
                  <Typography variant="body2" fontWeight={700}>
                    {watch('name') || 'Category name'}
                  </Typography>
                </Stack>
              </Box>
            </Box>

            <Divider sx={{ my: 2 }} />
            <TextField fullWidth label="Icon (optional)" {...register('icon')} margin="normal" placeholder="e.g., 🍔, 🚗" />
            <FormControlLabel control={<Switch {...register('is_active')} defaultChecked />} label="Active category" />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button type="submit" variant="contained">
              Save
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  )
}
