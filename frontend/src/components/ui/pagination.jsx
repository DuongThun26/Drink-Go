import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from './button'
import { cn } from '@/utils/cn'

export function Pagination({ page, totalPages, onPageChange, className }) {
  if (totalPages <= 1) return null

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)
  const visiblePages = pages.filter(
    (p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1
  )

  return (
    <nav className={cn('flex items-center justify-center gap-1', className)} aria-label="Pagination">
      <Button
        variant="outline"
        size="icon"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
        aria-label="Previous page"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      {visiblePages.map((p, i) => {
        const prev = visiblePages[i - 1]
        const showEllipsis = prev && p - prev > 1
        return (
          <span key={p} className="flex items-center gap-1">
            {showEllipsis && <span className="px-2 text-muted-foreground">…</span>}
            <Button
              variant={p === page ? 'default' : 'outline'}
              size="icon"
              onClick={() => onPageChange(p)}
            >
              {p}
            </Button>
          </span>
        )
      })}
      <Button
        variant="outline"
        size="icon"
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
        aria-label="Next page"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </nav>
  )
}
