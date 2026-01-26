import { useState, useEffect } from 'react'
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Alert,
} from '@mui/material'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { getCurrentUser, updateCurrentUser } from '../services/users'
import { User, UserUpdate } from '../types/user'
import { formatDate } from '../utils/formatters'

const userSchema = z.object({
  email: z.string().email('Invalid email').optional().or(z.literal('')),
})

type UserFormData = z.infer<typeof userSchema>

export default function UserProfile() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const { register, handleSubmit, reset, formState: { errors } } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
  })

  useEffect(() => {
    loadUser()
  }, [])

  const loadUser = async () => {
    try {
      setLoading(true)
      const data = await getCurrentUser()
      setUser(data)
      reset({
        email: data.email || '',
      })
      setError(null)
    } catch (err) {
      setError('Failed to load user profile')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const onSubmit = async (data: UserFormData) => {
    try {
      setSaving(true)
      const updated = await updateCurrentUser({
        email: data.email || null,
      })
      setUser(updated)
      setError(null)
    } catch (err) {
      console.error(err)
      setError('Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    )
  }

  if (!user) {
    return <Alert severity="error">User not found</Alert>
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        User Profile
      </Typography>

      <Card sx={{ mt: 3, maxWidth: 600 }}>
        <CardContent>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          <form onSubmit={handleSubmit(onSubmit)}>
            <TextField
              fullWidth
              label="Telegram ID"
              value={user.telegram_id}
              margin="normal"
              disabled
              helperText="Telegram ID cannot be changed"
            />
            <TextField
              fullWidth
              label="Email"
              type="email"
              {...register('email')}
              error={!!errors.email}
              helperText={errors.email?.message}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Account Created"
              value={formatDate(user.created_at)}
              margin="normal"
              disabled
            />
            <Box mt={3}>
              <Button type="submit" variant="contained" disabled={saving}>
                {saving ? <CircularProgress size={24} /> : 'Update Profile'}
              </Button>
            </Box>
          </form>
        </CardContent>
      </Card>
    </Box>
  )
}
