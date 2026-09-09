import { ChevronRight, Home } from 'lucide-react'
import { Link } from 'react-router-dom'
import { cn } from '@/utils/cn'

export function Breadcrumb({ items, className }) {
  return (
    <nav className={cn('flex items-center text-sm text-muted-foreground', className)} aria-label="Breadcrumb">
      <Link to="/" className="flex items-center hover:text-foreground">
        <Home className="h-4 w-4" />
      </Link>
      {items.map((item, index) => (
        <span key={item.label} className="flex items-center">
          <ChevronRight className="mx-2 h-4 w-4" />
          {item.href ? (
            <Link to={item.href} className="hover:text-foreground">
              {item.label}
            </Link>
          ) : (
            <span className="font-medium text-foreground">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  )
}
