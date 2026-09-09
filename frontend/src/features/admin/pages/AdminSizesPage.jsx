import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Pencil, Trash2, Plus } from 'lucide-react'
import { productApi } from '@/api/productApi'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { SimpleSelect } from '@/components/ui/select'
import { Card, CardContent } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'

const SIZE_STATUS = [
  { value: 'ACTIVE', label: 'Active' },
  { value: 'INACTIVE', label: 'Inactive' },
]

const emptyForm = { code: '', name: '', status: 'ACTIVE' }

export default function AdminSizesPage() {
  const [sizes, setSizes] = useState([])
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadSizes()
  }, [])

  const loadSizes = async () => {
    try {
      setLoading(true)
      const response = await productApi.getSizes()
      setSizes(response || [])
    } catch (err) {
      toast.error('Failed to load sizes')
    } finally {
      setLoading(false)
    }
  }

  const openCreate = () => {
    setEditing(null)
    setForm(emptyForm)
    setOpen(true)
  }

  const openEdit = (size) => {
    setEditing(size)
    setForm({
      code: size.code || '',
      name: size.name || '',
      status: size.status || 'ACTIVE',
    })
    setOpen(true)
  }

  const handleSave = async () => {
    if (!form.code.trim()) {
      toast.error('Size code is required')
      return
    }
    if (!form.name.trim()) {
      toast.error('Size name is required')
      return
    }

    const payload = {
      code: form.code,
      name: form.name,
      status: form.status,
    }

    try {
      if (editing) {
        await productApi.updateSize(editing.id, payload)
        toast.success('Size updated')
      } else {
        await productApi.createSize(payload)
        toast.success('Size created')
      }
      setOpen(false)
      loadSizes()
    } catch (err) {
      toast.error(err.message || 'Failed to save size')
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this size?')) return
    try {
      await productApi.deleteSize(id)
      toast.success('Size deleted')
      loadSizes()
    } catch (err) {
      toast.error(err.message || 'Failed to delete')
    }
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Product Sizes</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreate}>
              <Plus className="mr-2 h-4 w-4" />
              Add Size
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editing ? 'Edit Size' : 'New Size'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Code</Label>
                <Input
                  placeholder="e.g., S, M, L"
                  value={form.code}
                  onChange={(e) => setForm({ ...form, code: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Name</Label>
                <Input
                  placeholder="e.g., Small, Medium, Large"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <SimpleSelect
                  value={form.status}
                  onChange={(v) => setForm({ ...form, status: v })}
                  options={SIZE_STATUS}
                  placeholder="Select status"
                />
              </div>
              <Button onClick={handleSave} className="w-full">
                Save
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Sizes List */}
      {loading ? (
        <p className="text-gray-500">Loading sizes...</p>
      ) : sizes.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No sizes created yet</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {sizes.map((size) => (
            <Card key={size.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold text-lg">{size.name}</p>
                    <p className="text-sm text-muted-foreground">Code: {size.code}</p>
                    <p className="text-xs text-muted-foreground">Status: {size.status}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => openEdit(size)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => handleDelete(size.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
