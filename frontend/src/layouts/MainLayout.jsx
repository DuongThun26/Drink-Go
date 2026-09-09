import { Link, NavLink, Outlet } from 'react-router-dom'
import { ShoppingCart, User, LogOut, LayoutDashboard, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { logoutUser } from '@/store/slices/authSlice'
import { useAuth } from '@/hooks/useAuth'
import { useCart } from '@/hooks/useCart'
import { ThemeToggle } from '@/components/common/ThemeToggle'
import { Button } from '@/components/ui/button'
import { cn } from '@/utils/cn'

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/products', label: 'Products' },
  { to: '/cart', label: 'Cart' },
]

export function MainLayout() {
  const { isAuthenticated, isAdmin, user } = useAuth()
  const { itemCount } = useCart()
  const dispatch = useDispatch()
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleLogout = () => dispatch(logoutUser())

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link to="/" className="text-xl font-bold text-primary">
            DrinkGo
          </Link>

          <nav className="hidden items-center gap-6 md:flex">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  cn('text-sm font-medium transition-colors hover:text-primary', isActive && 'text-primary')
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link to="/cart" className="relative p-2">
              <ShoppingCart className="h-5 w-5" />
              {itemCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                  {itemCount}
                </span>
              )}
            </Link>

            {isAuthenticated ? (
              <>
                {isAdmin && (
                  <Link to="/admin">
                    <Button variant="ghost" size="icon" aria-label="Admin">
                      <LayoutDashboard className="h-5 w-5" />
                    </Button>
                  </Link>
                )}
                <Link to="/profile">
                  <Button variant="ghost" size="icon" aria-label="Profile">
                    <User className="h-5 w-5" />
                  </Button>
                </Link>
                <Button variant="ghost" size="icon" onClick={handleLogout} aria-label="Logout">
                  <LogOut className="h-5 w-5" />
                </Button>
              </>
            ) : (
              <div className="hidden gap-2 sm:flex">
                <Link to="/login">
                  <Button variant="ghost" size="sm">
                    Login
                  </Button>
                </Link>
                <Link to="/register">
                  <Button size="sm">Register</Button>
                </Link>
              </div>
            )}

            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Menu"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {mobileOpen && (
          <nav className="border-t px-4 py-4 md:hidden">
            <div className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className="text-sm font-medium"
                >
                  {link.label}
                </NavLink>
              ))}
              {!isAuthenticated && (
                <>
                  <Link to="/login" onClick={() => setMobileOpen(false)}>Login</Link>
                  <Link to="/register" onClick={() => setMobileOpen(false)}>Register</Link>
                </>
              )}
              {isAuthenticated && (
                <>
                  <Link to="/orders" onClick={() => setMobileOpen(false)}>Orders</Link>
                  <Link to="/profile" onClick={() => setMobileOpen(false)}>Profile</Link>
                  {isAdmin && <Link to="/admin" onClick={() => setMobileOpen(false)}>Admin</Link>}
                </>
              )}
            </div>
          </nav>
        )}
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t bg-muted/40 py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} DrinkGo. Fresh drinks delivered to your door.</p>
          {user?.username && (
            <p className="mt-1">Logged in as {user.username}</p>
          )}
        </div>
      </footer>
    </div>
  )
}
