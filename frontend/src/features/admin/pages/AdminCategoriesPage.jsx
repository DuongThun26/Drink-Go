import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'sonner'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { fetchAdminCategories } from '@/store/slices/adminSlice'
import { categoryApi } from '@/api/adminApi'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { SimpleSelect } from '@/components/ui/select'

const emptyForm = { name: '', code: '', description: '', status: 'ACTIVE' }

const statusOptions = [
  { label: 'Active', value: 'ACTIVE' },
  { label: 'Inactive', value: 'INACTIVE' }
]

export default function AdminCategoriesPage() {
  const dispatch = useDispatch()
  const categories = useSelector((state) => state.admin.categories)
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(emptyForm)

  useEffect(() => {
    dispatch(fetchAdminCategories())
  }, [dispatch])

  const handleSave = async () => {
    try {
      if (editing) {
        await categoryApi.update(editing.id, form)
        toast.success('Category updated')
      } else {
        await categoryApi.create(form)
        toast.success('Category created')
      }
      setOpen(false)
      dispatch(fetchAdminCategories())
    } catch (err) {
      toast.error(err.message || 'Failed to save')
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this category?')) return
    try {
      await categoryApi.delete(id)
      toast.success('Category deleted')
      dispatch(fetchAdminCategories())
    } catch (err) {
      toast.error(err.message || 'Failed to delete')
    }
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Categories</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { setEditing(null); setForm(emptyForm) }}>
              <Plus className="mr-2 h-4 w-4" /> Add Category
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>{editing ? 'Edit' : 'New'} Category</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2"><Label>Name</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
              <div className="space-y-2"><Label>Code</Label><Input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} /></div>
              <div className="space-y-2"><Label>Description</Label><Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
              <div className="space-y-2">
                <Label>Status</Label>
                <SimpleSelect 
                  value={form.status} 
                  onChange={(value) => setForm({ ...form, status: value })}
                  options={statusOptions}
                  placeholder="Select Status"
                />
              </div>
              <Button onClick={handleSave} className="w-full">Save</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-3">
        {categories.map((cat) => (
          <Card key={cat.id}>
            <CardContent className="flex items-center justify-between p-4">
              <div>
                <p className="font-medium">{cat.name}</p>
                <p className="text-sm text-muted-foreground">{cat.code}</p>
                <p className="text-xs mt-1">
                  <span className={`inline-block px-2 py-1 rounded text-white text-xs font-semibold ${cat.status === 'ACTIVE' ? 'bg-green-500' : 'bg-red-500'}`}>
                    {cat.status}
                  </span>
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="icon" onClick={() => { setEditing(cat); setForm({ name: cat.name, code: cat.code, description: cat.description || '', status: cat.status || 'ACTIVE' }); setOpen(true) }}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button variant="destructive" size="icon" onClick={() => handleDelete(cat.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
