import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function AdminUsersPage() {
  return (
    <div>
      <h1 className="mb-8 text-3xl font-bold">User Management</h1>
      <Card>
        <CardHeader>
          <CardTitle>Users API</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            The backend currently exposes user registration only. User listing and management
            will be available when the admin users endpoint is added to the Spring Boot API.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
