import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'sonner'
import { Pencil, Trash2, Plus, Image as ImageIcon, ChevronRight, ChevronLeft, X, ChevronDown } from 'lucide-react'
import { fetchAdminProducts, fetchAdminCategories } from '@/store/slices/adminSlice'
import { productApi } from '@/api/productApi'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { SimpleSelect } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import ImageUpload from '@/components/ImageUpload'
import { formatCurrency } from '@/utils/formatters'

const PRODUCT_TYPES = [
  { value: 'MADE_TO_ORDER', label: 'Made to Order' },
  { value: 'READY_MADE', label: 'Ready Made' },
]

const SIZE_STATUS = [
  { value: 'AVAILABLE', label: 'Available' },
  { value: 'INAVAILABLE', label: 'Inavailable' },
]

const emptyForm = { name: '', description: '', productType: 'MADE_TO_ORDER', categoryId: '', images: [] }
const emptySizeForm = { code: '', name: '', status: 'AVAILABLE' }
const emptyVariantForm = { sizeId: '', price: '', quantity: '' }

export default function AdminProductsPage() {
  const dispatch = useDispatch()
  const { products, categories } = useSelector((state) => state.admin)
  
  const [sizes, setSizes] = useState([])
  const [open, setOpen] = useState(false)
  const [sizeDialog, setSizeDialog] = useState(false)
  const [variantDialog, setVariantDialog] = useState(false)
  const [expandedProduct, setExpandedProduct] = useState(null)
  
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [sizeForm, setSizeForm] = useState(emptySizeForm)
  const [editingSize, setEditingSize] = useState(null)
  const [variantForm, setVariantForm] = useState(emptyVariantForm)
  const [editingVariant, setEditingVariant] = useState(null)
  const [selectedProductId, setSelectedProductId] = useState(null)
  const [productVariants, setProductVariants] = useState({})
  
  const [viewImages, setViewImages] = useState(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    dispatch(fetchAdminProducts())
    dispatch(fetchAdminCategories())
    loadSizes()
  }, [dispatch])

  const loadSizes = async () => {
    try {
      const data = await productApi.getSizes()
      setSizes(data)
    } catch (err) {
      toast.error('Failed to load sizes')
    }
  }

  const loadProductVariants = async (productId) => {
    try {
      const data = await productApi.getVariants(productId)
      setProductVariants((prev) => ({ ...prev, [productId]: data }))
    } catch (err) {
      toast.error('Failed to load variants')
    }
  }

  // Product Management
  const openCreate = () => {
    setEditing(null)
    setForm(emptyForm)
    setOpen(true)
  }

  const openEdit = (product) => {
    setEditing(product)
    setForm({
      name: product.name || '',
      description: product.description || '',
      productType: product.productType || 'MADE_TO_ORDER',
      categoryId: String(categories.find((c) => c.name === product.category)?.id || ''),
      images: product.images || [],
    })
    setOpen(true)
  }

  const handleSave = async () => {
    if (!form.name.trim()) {
      toast.error('Product name is required')
      return
    }
    if (!form.productType) {
      toast.error('Product type is required')
      return
    }
    if (!form.categoryId) {
      toast.error('Category is required')
      return
    }

    const payload = {
      name: form.name,
      description: form.description,
      productType: form.productType,
      categoryId: Number(form.categoryId),
      images: form.images,
    }
    try {
      if (editing) {
        await productApi.updateProduct(editing.id, payload)
        toast.success('Product updated')
      } else {
        await productApi.createProduct(payload)
        toast.success('Product created')
      }
      setOpen(false)
      dispatch(fetchAdminProducts())
    } catch (err) {
      toast.error(err.message || 'Failed to save product')
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this product?')) return
    try {
      await productApi.deleteProduct(id)
      toast.success('Product deleted')
      dispatch(fetchAdminProducts())
    } catch (err) {
      toast.error(err.message || 'Failed to delete')
    }
  }

  // Size Management
  const openCreateSize = () => {
    setEditingSize(null)
    setSizeForm(emptySizeForm)
    setSizeDialog(true)
  }

  const openEditSize = (size) => {
    setEditingSize(size)
    setSizeForm({
      code: size.code || '',
      name: size.name || '',
      status: size.status || 'AVAILABLE',
    })
    setSizeDialog(true)
  }

  const handleSaveSize = async () => {
    if (!sizeForm.code.trim()) {
      toast.error('Size code is required')
      return
    }
    if (!sizeForm.name.trim()) {
      toast.error('Size name is required')
      return
    }

    const payload = {
      code: sizeForm.code,
      name: sizeForm.name,
      status: sizeForm.status,
    }

    try {
      if (editingSize) {
        await productApi.updateSize(editingSize.id, payload)
        toast.success('Size updated')
      } else {
        await productApi.createSize(payload)
        toast.success('Size created')
      }
      setSizeDialog(false)
      loadSizes()
    } catch (err) {
      toast.error(err.message || 'Failed to save size')
    }
  }

  const handleDeleteSize = async (id) => {
    if (!confirm('Delete this size?')) return
    try {
      await productApi.deleteSize(id)
      toast.success('Size deleted')
      loadSizes()
    } catch (err) {
      toast.error(err.message || 'Failed to delete size')
    }
  }

  // Variant Management
  const openCreateVariant = (productId) => {
    setSelectedProductId(productId)
    setEditingVariant(null)
    setVariantForm(emptyVariantForm)
    setVariantDialog(true)
  }

  const openEditVariant = (productId, variant) => {
    setSelectedProductId(productId)
    setEditingVariant(variant)
    setVariantForm({
      sizeId: String(variant.size?.id || ''),
      price: String(variant.price || ''),
      quantity: String(variant.quantity || ''),
    })
    setVariantDialog(true)
  }

  const handleSaveVariant = async () => {
    if (!variantForm.sizeId) {
      toast.error('Size is required')
      return
    }
    if (!variantForm.price) {
      toast.error('Price is required')
      return
    }
    if (isNaN(variantForm.price) || Number(variantForm.price) < 0) {
      toast.error('Price must be a positive number')
      return
    }
    if (!variantForm.quantity) {
      toast.error('Quantity is required')
      return
    }
    if (isNaN(variantForm.quantity) || Number(variantForm.quantity) < 0) {
      toast.error('Quantity must be a positive number')
      return
    }

    const payload = {
      sizeId: Number(variantForm.sizeId),
      price: Number(variantForm.price),
      quantity: Number(variantForm.quantity),
      productId: selectedProductId,
    }

    try {
      setLoading(true)
      if (editingVariant) {
        await productApi.updateVariant(selectedProductId, editingVariant.id, payload)
        toast.success('Variant updated')
      } else {
        await productApi.createVariant(selectedProductId, payload)
        toast.success('Variant created')
      }
      setVariantDialog(false)
      loadProductVariants(selectedProductId)
    } catch (err) {
      toast.error(err.message || 'Failed to save variant')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteVariant = async (productId, variantId) => {
    if (!confirm('Delete this variant?')) return
    try {
      await productApi.deleteVariant(productId, variantId)
      toast.success('Variant deleted')
      loadProductVariants(productId)
    } catch (err) {
      toast.error(err.message || 'Failed to delete variant')
    }
  }

  // Image Gallery
  const openImageGallery = (images) => {
    if (images && images.length > 0) {
      setViewImages(images)
      setCurrentImageIndex(0)
    } else {
      toast.error('No images for this product')
    }
  }

  const nextImage = () => {
    if (viewImages) {
      setCurrentImageIndex((prev) => (prev + 1) % viewImages.length)
    }
  }

  const prevImage = () => {
    if (viewImages) {
      setCurrentImageIndex((prev) => (prev - 1 + viewImages.length) % viewImages.length)
    }
  }

  const closeGallery = () => {
    setViewImages(null)
    setCurrentImageIndex(0)
  }

  const toggleExpand = (productId) => {
    if (expandedProduct === productId) {
      setExpandedProduct(null)
    } else {
      setExpandedProduct(productId)
      loadProductVariants(productId)
    }
  }

  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Products</h1>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button onClick={openCreate}>
                <Plus className="mr-2 h-4 w-4" />
                Add Product
              </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editing ? 'Edit Product' : 'New Product'}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Name</Label>
                  <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Type</Label>
                  <SimpleSelect 
                    value={form.productType} 
                    onChange={(v) => setForm({ ...form, productType: v })} 
                    options={PRODUCT_TYPES}
                    placeholder="Select Type"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Category</Label>
                  <SimpleSelect
                    value={form.categoryId}
                    onChange={(v) => setForm({ ...form, categoryId: v })}
                    options={categories.map((c) => ({ value: String(c.id), label: c.name }))}
                    placeholder="Select category"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Images</Label>
                  <ImageUpload 
                    onUpload={(urls) => setForm({ ...form, images: urls })}
                    maxFiles={5}
                  />
                </div>
                <Button onClick={handleSave} className="w-full">Save</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Sizes Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Available Sizes</h2>
            <Dialog open={sizeDialog} onOpenChange={setSizeDialog}>
              <DialogTrigger asChild>
                <Button onClick={openCreateSize} variant="outline" size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Size
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{editingSize ? 'Edit Size' : 'New Size'}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Code</Label>
                    <Input value={sizeForm.code} onChange={(e) => setSizeForm({ ...sizeForm, code: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Name</Label>
                    <Input value={sizeForm.name} onChange={(e) => setSizeForm({ ...sizeForm, name: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Status</Label>
                    <SimpleSelect
                      value={sizeForm.status}
                      onChange={(v) => setSizeForm({ ...sizeForm, status: v })}
                      options={SIZE_STATUS}
                      placeholder="Select status"
                    />
                  </div>
                  <Button onClick={handleSaveSize} className="w-full">Save</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {sizes.map((size) => (
              <Card key={size.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold">{size.name}</p>
                      <p className="text-sm text-muted-foreground">Code: {size.code}</p>
                      <p className="text-xs text-muted-foreground">Status: {size.status}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="icon" onClick={() => openEditSize(size)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="destructive" size="icon" onClick={() => handleDeleteSize(size.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Products Section */}
      <div className="space-y-3">
        {products.map((product) => (
          <Card key={product.id}>
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                {/* Thumbnail */}
                <div className="relative h-20 w-20 flex-shrink-0 rounded-md border border-gray-200 bg-gray-100 overflow-hidden cursor-pointer" onClick={() => openImageGallery(product.images)}>
                  {product.images && product.images.length > 0 ? (
                    <>
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="h-full w-full object-cover"
                      />
                      {product.images.length > 1 && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 hover:opacity-100 transition-opacity">
                          <span className="text-white text-sm font-bold">+{product.images.length - 1}</span>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <ImageIcon className="h-8 w-8 text-gray-300" />
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="flex-1">
                  <p className="font-medium">{product.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {product.category} · {product.productType}
                  </p>
                  {product.description && (
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                      {product.description}
                    </p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={() => openEdit(product)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => toggleExpand(product.id)}
                  >
                    <ChevronDown className={`h-4 w-4 transition-transform ${expandedProduct === product.id ? 'rotate-180' : ''}`} />
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="icon" 
                    onClick={() => handleDelete(product.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Variants Section */}
              {expandedProduct === product.id && (
                <div className="mt-6 pt-6 border-t">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold">Variants & Pricing</h4>
                    <Dialog open={variantDialog && selectedProductId === product.id} onOpenChange={setVariantDialog}>
                      <DialogTrigger asChild>
                        <Button 
                          onClick={() => openCreateVariant(product.id)} 
                          variant="outline" 
                          size="sm"
                        >
                          <Plus className="mr-2 h-4 w-4" />
                          Add Variant
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>{editingVariant ? 'Edit Variant' : 'Add Variant'}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label>Size</Label>
                            <SimpleSelect
                              value={variantForm.sizeId}
                              onChange={(v) => setVariantForm({ ...variantForm, sizeId: v })}
                              options={sizes.map((s) => ({ value: String(s.id), label: s.name }))}
                              placeholder="Select size"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Price</Label>
                            <Input 
                              type="number" 
                              value={variantForm.price} 
                              onChange={(e) => setVariantForm({ ...variantForm, price: e.target.value })}
                              min="0"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Quantity</Label>
                            <Input 
                              type="number" 
                              value={variantForm.quantity} 
                              onChange={(e) => setVariantForm({ ...variantForm, quantity: e.target.value })}
                              min="0"
                            />
                          </div>
                          <Button onClick={handleSaveVariant} className="w-full" disabled={loading}>
                            {loading ? 'Saving...' : 'Save'}
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>

                  {productVariants[product.id]?.length > 0 ? (
                    <div className="space-y-2">
                      {productVariants[product.id].map((variant) => (
                        <div key={variant.id} className="flex items-center justify-between p-3 border rounded-md bg-muted/30">
                          <div>
                            <p className="font-medium">{variant.size?.name}</p>
                            <p className="text-sm text-muted-foreground">
                              Price: {formatCurrency(variant.price)} · Qty: {variant.quantity}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              size="icon"
                              onClick={() => openEditVariant(product.id, variant)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="destructive" 
                              size="icon"
                              onClick={() => handleDeleteVariant(product.id, variant.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground italic">No variants yet</p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Image Gallery Modal */}
      {viewImages && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
          <div className="relative max-w-2xl w-full mx-4">
            <button
              onClick={closeGallery}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 z-10"
            >
              <X className="h-6 w-6" />
            </button>

            <div className="relative rounded-lg overflow-hidden bg-black">
              <img
                src={viewImages[currentImageIndex]}
                alt={`Image ${currentImageIndex + 1}`}
                className="w-full h-auto"
              />

              <div className="absolute top-4 right-4 bg-black/60 text-white px-3 py-1 rounded text-sm">
                {currentImageIndex + 1} / {viewImages.length}
              </div>

              {viewImages.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white p-2 rounded-full transition"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white p-2 rounded-full transition"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </button>
                </>
              )}
            </div>

            {viewImages.length > 1 && (
              <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
                {viewImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`flex-shrink-0 h-16 w-16 rounded border-2 overflow-hidden ${
                      idx === currentImageIndex
                        ? 'border-blue-500'
                        : 'border-gray-400 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`Thumb ${idx}`} className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
