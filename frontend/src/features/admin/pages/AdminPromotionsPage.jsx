import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'sonner'
import { Plus, Trash2, Pencil } from 'lucide-react'
import { fetchAdminPromotions } from '@/store/slices/adminSlice'
import { promotionApi } from '@/api/promotionApi'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { SimpleSelect } from '@/components/ui/select'
import { Card, CardContent } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { formatCurrency } from '@/utils/formatters'

const PROMOTION_STATUS = [
  { value: 'ACTIVE', label: 'Active' },
  { value: 'INACTIVE', label: 'Inactive' },
  { value: 'EXPIRED', label: 'Expired' },
]

const PROMOTION_TYPE = [
  { value: 'PRODUCT', label: 'Product' },
  { value: 'ORDER', label: 'Order' },
  { value: 'VOUCHER', label: 'Voucher' },
]

const emptyForm = { 
  code: '', 
  name: '', 
  discountPercent: '', 
  quantity: '',
  promotionStart: '',
  promotionEnd: '',
  status: 'ACTIVE',
  promotionType: 'VOUCHER'
}

export default function AdminPromotionsPage() {
  const dispatch = useDispatch()
  const promotions = useSelector((state) => state.admin.promotions)
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(emptyForm)

  useEffect(() => {
    dispatch(fetchAdminPromotions())
  }, [dispatch])

  const openCreate = () => {
    setEditing(null)
    setForm(emptyForm)
    setOpen(true)
  }

  const openEdit = (promo) => {
    setEditing(promo)
    setForm({
      code: promo.code || '',
      name: promo.name || '',
      discountPercent: String(promo.discountPercent || ''),
      quantity: String(promo.quantity || ''),
      promotionStart: promo.promotionStart ? promo.promotionStart.split('T')[0] : '',
      promotionEnd: promo.promotionEnd ? promo.promotionEnd.split('T')[0] : '',
      status: promo.status || 'ACTIVE',
      promotionType: promo.promotionType || 'VOUCHER',
    })
    setOpen(true)
  }

  const handleSave = async () => {
    if (!form.code.trim()) {
      toast.error('Code is required')
      return
    }
    if (!form.name.trim()) {
      toast.error('Name is required')
      return
    }
    if (!form.discountPercent) {
      toast.error('Discount % is required')
      return
    }
    if (isNaN(form.discountPercent) || Number(form.discountPercent) < 0 || Number(form.discountPercent) > 100) {
      toast.error('Discount % must be between 0 and 100')
      return
    }
    if (!form.promotionStart) {
      toast.error('Start date is required')
      return
    }
    if (!form.promotionEnd) {
      toast.error('End date is required')
      return
    }
    if (new Date(form.promotionStart) >= new Date(form.promotionEnd)) {
      toast.error('End date must be after start date')
      return
    }

    const payload = {
      code: form.code.toUpperCase(),
      name: form.name,
      discountPercent: Number(form.discountPercent),
      quantity: form.quantity ? Number(form.quantity) : null,
      promotionStart: new Date(form.promotionStart).toISOString(),
      promotionEnd: new Date(form.promotionEnd).toISOString(),
      status: form.status,
      promotionType: form.promotionType,
    }

    try {
      if (editing) {
        await promotionApi.update(editing.id, payload)
        toast.success('Promotion updated')
      } else {
        await promotionApi.create(payload)
        toast.success('Promotion created')
      }
      setOpen(false)
      dispatch(fetchAdminPromotions())
    } catch (err) {
      toast.error(err.message || 'Failed to save promotion')
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this promotion?')) return
    try {
      await promotionApi.delete(id)
      toast.success('Promotion deleted')
      dispatch(fetchAdminPromotions())
    } catch (err) {
      toast.error(err.message || 'Failed to delete')
    }
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Promotions</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreate}>
              <Plus className="mr-2 h-4 w-4" /> Add Promotion
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editing ? 'Edit Promotion' : 'New Promotion'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Code</Label>
                <Input 
                  value={form.code} 
                  onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} 
                  placeholder="e.g., PROMO2024"
                />
              </div>
              <div className="space-y-2">
                <Label>Name</Label>
                <Input 
                  value={form.name} 
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g., Summer Sale"
                />
              </div>
              <div className="space-y-2">
                <Label>Discount %</Label>
                <Input 
                  type="number" 
                  value={form.discountPercent} 
                  onChange={(e) => setForm({ ...form, discountPercent: e.target.value })}
                  min="0"
                  max="100"
                  placeholder="0-100"
                />
              </div>
              <div className="space-y-2">
                <Label>Quantity (Optional)</Label>
                <Input 
                  type="number" 
                  value={form.quantity} 
                  onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                  min="0"
                  placeholder="Leave empty for unlimited"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Start Date</Label>
                  <Input 
                    type="date" 
                    value={form.promotionStart} 
                    onChange={(e) => setForm({ ...form, promotionStart: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>End Date</Label>
                  <Input 
                    type="date" 
                    value={form.promotionEnd} 
                    onChange={(e) => setForm({ ...form, promotionEnd: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <SimpleSelect
                  value={form.status}
                  onChange={(v) => setForm({ ...form, status: v })}
                  options={PROMOTION_STATUS}
                  placeholder="Select status"
                />
              </div>
              <div className="space-y-2">
                <Label>Type</Label>
                <SimpleSelect
                  value={form.promotionType}
                  onChange={(v) => setForm({ ...form, promotionType: v })}
                  options={PROMOTION_TYPE}
                  placeholder="Select type"
                />
              </div>
              <Button onClick={handleSave} className="w-full">
                {editing ? 'Update' : 'Create'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-3">
        {promotions.map((p) => (
          <Card key={p.id}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <p className="font-bold text-lg">{p.code}</p>
                    <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-700">
                      {p.status}
                    </span>
                    <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-700">
                      {p.promotionType}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{p.name}</p>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-xs text-muted-foreground">Discount</p>
                      <p className="font-semibold">{p.discountPercent}%</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Quantity</p>
                      <p className="font-semibold">{p.quantity || 'Unlimited'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Start</p>
                      <p className="font-semibold text-sm">{new Date(p.promotionStart).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">End</p>
                      <p className="font-semibold text-sm">{new Date(p.promotionEnd).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => openEdit(p)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="icon" 
                    onClick={() => handleDelete(p.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
