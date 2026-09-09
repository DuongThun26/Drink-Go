import { Link } from 'react-router-dom'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export function ProductCard({ product }) {
  const image = product.images?.[0]

  return (
    <Card className="overflow-hidden transition-shadow hover:shadow-md">
      <Link to={`/products/${product.id}`}>
        <div className="aspect-square overflow-hidden bg-muted">
          {image ? (
            <img src={image} alt={product.name} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground">
              No image
            </div>
          )}
        </div>
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold line-clamp-2">{product.name}</h3>
            {product.category && (
              <Badge variant="secondary" className="shrink-0">
                {product.category}
              </Badge>
            )}
          </div>
          {product.productType && (
            <p className="mt-1 text-xs text-muted-foreground">{product.productType}</p>
          )}
        </CardContent>
        <CardFooter className="p-4 pt-0">
          <span className="text-sm text-primary">View details →</span>
        </CardFooter>
      </Link>
    </Card>
  )
}
