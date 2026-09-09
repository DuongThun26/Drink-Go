import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'sonner'
import { registerUser, clearAuthError } from '@/store/slices/authSlice'
import { RegisterSchema } from '@/utils/validationSchemas'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function RegisterPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { loading, error } = useSelector((state) => state.auth)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(RegisterSchema) })

  const onSubmit = async (data) => {
    dispatch(clearAuthError())
    const result = await dispatch(
      registerUser({
        username: data.username,
        password: data.password,
        addressRequest: {
          receivename: data.receivename,
          receivephone: data.receivephone,
          province: data.province,
          district: data.district,
          ward: data.ward,
          detailaddress: data.detailaddress,
        },
      })
    )
    if (registerUser.fulfilled.match(result)) {
      toast.success('Account created! Please sign in.')
      navigate('/login')
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center px-4 py-12">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>Create account</CardTitle>
          <CardDescription>Join DrinkGo and start ordering</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {error && (
              <p className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{error}</p>
            )}

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input id="username" {...register('username')} error={!!errors.username} />
                {errors.username && (
                  <p className="text-xs text-destructive">{errors.username.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="receivename">Full name</Label>
                <Input id="receivename" {...register('receivename')} error={!!errors.receivename} />
                {errors.receivename && (
                  <p className="text-xs text-destructive">{errors.receivename.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="receivephone">Phone</Label>
              <Input id="receivephone" {...register('receivephone')} error={!!errors.receivephone} />
              {errors.receivephone && (
                <p className="text-xs text-destructive">{errors.receivephone.message}</p>
              )}
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="province">Province</Label>
                <Input id="province" {...register('province')} error={!!errors.province} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="district">District</Label>
                <Input id="district" {...register('district')} error={!!errors.district} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ward">Ward</Label>
                <Input id="ward" {...register('ward')} error={!!errors.ward} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="detailaddress">Address detail</Label>
              <Input id="detailaddress" {...register('detailaddress')} error={!!errors.detailaddress} />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" {...register('password')} error={!!errors.password} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  {...register('confirmPassword')}
                  error={!!errors.confirmPassword}
                />
              </div>
            </div>
            {errors.confirmPassword && (
              <p className="text-xs text-destructive">{errors.confirmPassword.message}</p>
            )}

            <Button type="submit" className="w-full" loading={loading}>
              Create account
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link to="/login" className="text-primary hover:underline">
                Sign in
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
