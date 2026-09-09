import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'sonner'
import { Plus, Pencil, Trash2, Image as ImageIcon, ChevronRight, ChevronLeft, X } from 'lucide-react'
import { fetchAdminToppings } from '@/store/slices/adminSlice'
import { toppingApi } from '@/api/toppingApi'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { SimpleSelect } from '@/components/ui/select'
import ImageUpload from '@/components/ImageUpload'
import { formatCurrency } from '@/utils/formatters'

const statusOptions = [
  { label: 'AVAILABLE', value: 'AVAILABLE' },
  { label: 'UNAVAILABLE', value: 'UNAVAILABLE' }
]

const emptyForm = { name: '', price: '', status: 'ACTIVE', images: [] }

export default function AdminToppingsPage() {
  const dispatch = useDispatch()
  const toppings = useSelector((state) => state.admin.toppings)
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [viewImages, setViewImages] = useState(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  useEffect(() => {
    dispatch(fetchAdminToppings())
  }, [dispatch])

  const handleSave = async () => {
    if (!form.name.trim()) {
      toast.error('Topping name is required')
      return
    }
    if (!form.price) {
      toast.error('Topping price is required')
      return
    }
    if (!form.status) {
      toast.error('Topping status is required')
      return
    }

    const payload = { 
      name: form.name, 
      price: Number(form.price),
      status: form.status,
      images: form.images
    }
    try {
      if (editing) {
        await toppingApi.update(editing.id, payload)
        toast.success('Topping updated')
      } else {
        await toppingApi.create(payload)
        toast.success('Topping created')
      }
      setOpen(false)
      dispatch(fetchAdminToppings())
    } catch (err) {
      toast.error(err.message || 'Failed to save')
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this topping?')) return
    try {
      await toppingApi.delete(id)
      toast.success('Topping deleted')
      dispatch(fetchAdminToppings())
    } catch (err) {
      toast.error(err.message || 'Failed to delete')
    }
  }

  const openImageGallery = (images) => {
    if (images && images.length > 0) {
      setViewImages(images)
      setCurrentImageIndex(0)
    } else {
      toast.error('No images for this topping')
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

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Toppings</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { setEditing(null); setForm(emptyForm) }}>
              <Plus className="mr-2 h-4 w-4" /> Add Topping
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[80vh] overflow-y-auto">
            <DialogHeader><DialogTitle>{editing ? 'Edit' : 'New'} Topping</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2"><Label>Name</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
              <div className="space-y-2"><Label>Price (VND)</Label><Input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} /></div>
              <div className="space-y-2">
                <Label>Status</Label>
                <SimpleSelect 
                  value={form.status} 
                  onChange={(value) => setForm({ ...form, status: value })}
                  options={statusOptions}
                  placeholder="Select Status"
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

      <div className="space-y-3">
        {toppings.map((t) => (
          <Card key={t.id}>
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                {/* Thumbnail */}
                <div className="relative h-20 w-20 flex-shrink-0 rounded-md border border-gray-200 bg-gray-100 overflow-hidden">
                  {t.images && t.images.length > 0 ? (
                    <>
                      <img
                        src={t.images[0]}
                        alt={t.name}
                        className="h-full w-full object-cover"
                      />
                      {t.images.length > 1 && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 hover:opacity-100 transition-opacity">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => openImageGallery(t.images)}
                            className="text-white hover:bg-white/20"
                          >
                            +{t.images.length - 1}
                          </Button>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <ImageIcon className="h-8 w-8 text-gray-300" />
                    </div>
                  )}
                </div>

                {/* Topping Info */}
                <div className="flex-1">
                  <p className="font-medium">{t.name}</p>
                  <p className="text-sm text-primary font-semibold">{formatCurrency(t.price)}</p>
                  {t.status && (
                    <p className="text-xs mt-1">
                      <span className={`inline-block px-2 py-1 rounded text-white text-xs font-semibold ${t.status === 'ACTIVE' ? 'bg-green-500' : 'bg-red-500'}`}>
                        {t.status}
                      </span>
                    </p>
                  )}
                  {t.images && t.images.length > 0 && (
                    <button
                      onClick={() => openImageGallery(t.images)}
                      className="text-xs text-blue-500 hover:text-blue-700 mt-1"
                    >
                      View {t.images.length} image{t.images.length !== 1 ? 's' : ''}
                    </button>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button variant="outline" size="icon" onClick={() => { setEditing(t); setForm({ name: t.name, price: String(t.price), status: t.status || 'ACTIVE', images: t.images || [] }); setOpen(true) }}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="destructive" size="icon" onClick={() => handleDelete(t.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Image Gallery Modal */}
      {viewImages && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
          <div className="relative max-w-2xl w-full mx-4">
            {/* Close Button */}
            <button
              onClick={closeGallery}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 z-10"
            >
              <X className="h-6 w-6" />
            </button>

            {/* Main Image */}
            <div className="relative rounded-lg overflow-hidden bg-black">
              <img
                src={viewImages[currentImageIndex]}
                alt={`Image ${currentImageIndex + 1}`}
                className="w-full h-auto"
              />

              {/* Counter */}
              <div className="absolute top-4 right-4 bg-black/60 text-white px-3 py-1 rounded text-sm">
                {currentImageIndex + 1} / {viewImages.length}
              </div>

              {/* Navigation Buttons */}
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

            {/* Thumbnails */}
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
