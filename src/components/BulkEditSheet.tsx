import { useState } from 'react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface BulkEditSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedCount: number
  onSave: (data: BulkEditData) => void
}

export interface BulkEditData {
  location: string
  category: string
  shipFrom: string
  notes: string
}

export default function BulkEditSheet({
  open,
  onOpenChange,
  selectedCount,
  onSave,
}: BulkEditSheetProps) {
  const [formData, setFormData] = useState<BulkEditData>({
    location: 'Bedroom',
    category: 'Drapery',
    shipFrom: '',
    notes: '',
  })

  const handleSave = () => {
    onSave(formData)
    onOpenChange(false)
    // Reset form
    setFormData({
      location: 'Bedroom',
      category: 'Drapery',
      shipFrom: '',
      notes: '',
    })
  }

  const handleCancel = () => {
    onOpenChange(false)
    // Reset form
    setFormData({
      location: 'Bedroom',
      category: 'Drapery',
      shipFrom: '',
      notes: '',
    })
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-[500px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-2xl font-bold">Bulk Edit</SheetTitle>
          <SheetDescription className="text-base">
            {selectedCount} item{selectedCount !== 1 ? 's' : ''} will be updated
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6 py-4">
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4 text-gray-900">Items Details</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Location
                  </label>
                  <Select
                    value={formData.location}
                    onValueChange={(value) =>
                      setFormData({ ...formData, location: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Bedroom">Bedroom</SelectItem>
                      <SelectItem value="Guest Room">Guest Room</SelectItem>
                      <SelectItem value="Living Room">Living Room</SelectItem>
                      <SelectItem value="Kitchen">Kitchen</SelectItem>
                      <SelectItem value="Bathroom">Bathroom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Category
                  </label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) =>
                      setFormData({ ...formData, category: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Drapery">Drapery</SelectItem>
                      <SelectItem value="Furniture">Furniture</SelectItem>
                      <SelectItem value="Lighting">Lighting</SelectItem>
                      <SelectItem value="Accessories">Accessories</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Ship From
                </label>
                <Input
                  value={formData.shipFrom}
                  onChange={(e) =>
                    setFormData({ ...formData, shipFrom: e.target.value })
                  }
                  placeholder="Enter ship from"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Notes for this item
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                  placeholder="Enter notes"
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>
            </div>
          </div>
        </div>

        <SheetFooter className="flex-row justify-end gap-3 sm:gap-2 mt-6 pt-6 border-t">
          <Button
            variant="outline"
            onClick={handleCancel}
            className="border-red-600 text-red-600 hover:bg-red-50 hover:text-red-700"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            className="bg-red-600 text-white hover:bg-red-700"
          >
            Save Changes
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

