import { Link } from 'react-router-dom'
import { ArrowRight, Truck, Shield, Coffee } from 'lucide-react'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchProducts } from '@/store/slices/productSlice'
import { Button } from '@/components/ui/button'
import { ProductCard } from '@/features/product/components/ProductCard'

const features = [
  { icon: Coffee, title: 'Fresh Drinks', desc: 'Premium beverages made with quality ingredients' },
  { icon: Truck, title: 'Fast Delivery', desc: 'Hot or cold drinks delivered to your doorstep' },
  { icon: Shield, title: 'Secure Payment', desc: 'Cash on delivery or online payment via VNPay' },
]

export default function HomePage() {
  const dispatch = useDispatch()
  const products = useSelector((state) => state.product.items)

  useEffect(() => {
    dispatch(fetchProducts())
  }, [dispatch])

  const featured = products.slice(0, 4)

  return (
    <div>
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-primary/5 py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Your favorite drinks,{' '}
              <span className="text-primary">delivered fresh</span>
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Order bubble tea, coffee, smoothies and more from DrinkGo. Customize with toppings and sizes.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link to="/products">
                <Button size="lg">
                  Browse Menu
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/cart">
                <Button size="lg" variant="outline">
                  View Cart
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto grid gap-8 px-4 sm:grid-cols-3">
          {features.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold">{title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {featured.length > 0 && (
        <section className="border-t py-16">
          <div className="container mx-auto px-4">
            <div className="mb-8 flex items-center justify-between">
              <h2 className="text-2xl font-bold">Popular Drinks</h2>
              <Link to="/products" className="text-sm text-primary hover:underline">
                View all
              </Link>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {featured.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
