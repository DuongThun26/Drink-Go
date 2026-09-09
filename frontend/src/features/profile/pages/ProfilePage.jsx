import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { useAuth } from '@/hooks/useAuth'
import { addressApi } from '@/api/adminApi'
import { authApi } from '@/api/authApi'
import { ChangePasswordSchema } from '@/utils/validationSchemas'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Breadcrumb } from '@/components/ui/breadcrumb'
import { Skeleton } from '@/components/ui/skeleton'

export default function ProfilePage() {
  const { user, isAuthenticated } = useAuth()
  const [addresses, setAddresses] = useState([])
  const [loadingAddresses, setLoadingAddresses] = useState(true)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ resolver: zodResolver(ChangePasswordSchema) })

  useEffect(() => {
    if (isAuthenticated) {
      addressApi
        .getAll()
        .then(setAddresses)
        .catch(() => setAddresses([]))
        .finally(() => setLoadingAddresses(false))
    }
  }, [isAuthenticated])

  const onChangePassword = async (data) => {
    try {
      await authApi.changePassword({
        oldPassword: data.oldPassword,
        newPassword: data.newPassword,
      })
      toast.success('Password changed successfully')
      reset()
    } catch (err) {
      toast.error(err.message || 'Failed to change password')
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb items={[{ label: 'Profile' }]} className="mb-6" />
      <h1 className="mb-8 text-3xl font-bold">My Profile</h1>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Account</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p><strong>Username:</strong> {user?.username}</p>
            <p><strong>Role:</strong> {user?.roles?.join(', ') || 'USER'}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Saved Addresses</CardTitle>
          </CardHeader>
          <CardContent>
            {loadingAddresses ? (
              <Skeleton className="h-20 w-full" />
            ) : addresses.length === 0 ? (
              <p className="text-sm text-muted-foreground">No saved addresses</p>
            ) : (
              <ul className="space-y-3">
                {addresses.map((addr) => (
                  <li key={addr.id} className="rounded-md border p-3 text-sm">
                    <p className="font-medium">{addr.receivename}</p>
                    <p className="text-muted-foreground">{addr.receivephone}</p>
                    <p>
                      {[addr.detailaddress, addr.ward, addr.district, addr.province]
                        .filter(Boolean)
                        .join(', ')}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Change Password</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onChangePassword)} className="grid max-w-md gap-4">
              <div className="space-y-2">
                <Label htmlFor="oldPassword">Current password</Label>
                <Input id="oldPassword" type="password" {...register('oldPassword')} />
                {errors.oldPassword && (
                  <p className="text-xs text-destructive">{errors.oldPassword.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword">New password</Label>
                <Input id="newPassword" type="password" {...register('newPassword')} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm new password</Label>
                <Input id="confirmPassword" type="password" {...register('confirmPassword')} />
                {errors.confirmPassword && (
                  <p className="text-xs text-destructive">{errors.confirmPassword.message}</p>
                )}
              </div>
              <Button type="submit">Update password</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
