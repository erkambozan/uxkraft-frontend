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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface UpdateTrackingSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedCount: number
  onSave: (data: UpdateTrackingData) => void
}

export interface UpdateTrackingData {
  poApprovalDate: string
  hotelNeedByDate: string
  expectedDelivery: string
  cfaShopsSend: string
  cfaShopsApproved: string
  cfaShopsDelivered: string
  orderedDate: string
  shippedDate: string
  deliveredDate: string
  shippingNotes: string
}

export default function UpdateTrackingSheet({
  open,
  onOpenChange,
  selectedCount,
  onSave,
}: UpdateTrackingSheetProps) {
  const [formData, setFormData] = useState<UpdateTrackingData>({
    poApprovalDate: '',
    hotelNeedByDate: '',
    expectedDelivery: '',
    cfaShopsSend: '',
    cfaShopsApproved: '',
    cfaShopsDelivered: '',
    orderedDate: '',
    shippedDate: '',
    deliveredDate: '',
    shippingNotes: 'Delicate product',
  })

  const handleSave = () => {
    onSave(formData)
    onOpenChange(false)
    // Reset form
    setFormData({
      poApprovalDate: '',
      hotelNeedByDate: '',
      expectedDelivery: '',
      cfaShopsSend: '',
      cfaShopsApproved: '',
      cfaShopsDelivered: '',
      orderedDate: '',
      shippedDate: '',
      deliveredDate: '',
      shippingNotes: 'Delicate product',
    })
  }

  const handleCancel = () => {
    onOpenChange(false)
    // Reset form
    setFormData({
      poApprovalDate: '',
      hotelNeedByDate: '',
      expectedDelivery: '',
      cfaShopsSend: '',
      cfaShopsApproved: '',
      cfaShopsDelivered: '',
      orderedDate: '',
      shippedDate: '',
      deliveredDate: '',
      shippingNotes: 'Delicate product',
    })
  }

  // Mock date options - in real app, these would be date pickers
  const dateOptions = [
    '11/12/2025',
    '11/15/2025',
    '11/20/2025',
    '11/25/2025',
    '11/28/2025',
    '11/30/2025',
  ]

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-2xl font-bold">Update Tracking</SheetTitle>
          <SheetDescription className="text-base">
            {selectedCount} item{selectedCount !== 1 ? 's' : ''} will be updated
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6 py-4">
          {/* Planning & Requirements Section */}
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4 text-gray-900">Planning & Requirements</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  PO Approval Date
                </label>
                <Select
                  value={formData.poApprovalDate}
                  onValueChange={(value) =>
                    setFormData({ ...formData, poApprovalDate: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select date" />
                  </SelectTrigger>
                  <SelectContent>
                    {dateOptions.map((date) => (
                      <SelectItem key={date} value={date}>
                        {date}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Hotel Need by Date
                </label>
                <Select
                  value={formData.hotelNeedByDate}
                  onValueChange={(value) =>
                    setFormData({ ...formData, hotelNeedByDate: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select date" />
                  </SelectTrigger>
                  <SelectContent>
                    {dateOptions.map((date) => (
                      <SelectItem key={date} value={date}>
                        {date}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Expected Delivery
                </label>
                <Select
                  value={formData.expectedDelivery}
                  onValueChange={(value) =>
                    setFormData({ ...formData, expectedDelivery: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select date" />
                  </SelectTrigger>
                  <SelectContent>
                    {dateOptions.map((date) => (
                      <SelectItem key={date} value={date}>
                        {date}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Production & Shop Section */}
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4 text-gray-900">Production & Shop</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  CFA/Shops Send
                </label>
                <Select
                  value={formData.cfaShopsSend}
                  onValueChange={(value) =>
                    setFormData({ ...formData, cfaShopsSend: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select date" />
                  </SelectTrigger>
                  <SelectContent>
                    {dateOptions.map((date) => (
                      <SelectItem key={date} value={date}>
                        {date}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  CFA/Shops Approved
                </label>
                <Select
                  value={formData.cfaShopsApproved}
                  onValueChange={(value) =>
                    setFormData({ ...formData, cfaShopsApproved: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select date" />
                  </SelectTrigger>
                  <SelectContent>
                    {dateOptions.map((date) => (
                      <SelectItem key={date} value={date}>
                        {date}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  CFA/Shops Delivered
                </label>
                <Select
                  value={formData.cfaShopsDelivered}
                  onValueChange={(value) =>
                    setFormData({ ...formData, cfaShopsDelivered: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select date" />
                  </SelectTrigger>
                  <SelectContent>
                    {dateOptions.map((date) => (
                      <SelectItem key={date} value={date}>
                        {date}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Shipping Section */}
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4 text-gray-900">Shipping</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Ordered Date
                </label>
                <Select
                  value={formData.orderedDate}
                  onValueChange={(value) =>
                    setFormData({ ...formData, orderedDate: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select date" />
                  </SelectTrigger>
                  <SelectContent>
                    {dateOptions.map((date) => (
                      <SelectItem key={date} value={date}>
                        {date}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Shipped Date
                </label>
                <Select
                  value={formData.shippedDate}
                  onValueChange={(value) =>
                    setFormData({ ...formData, shippedDate: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select date" />
                  </SelectTrigger>
                  <SelectContent>
                    {dateOptions.map((date) => (
                      <SelectItem key={date} value={date}>
                        {date}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Delivered Date
                </label>
                <Select
                  value={formData.deliveredDate}
                  onValueChange={(value) =>
                    setFormData({ ...formData, deliveredDate: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select date" />
                  </SelectTrigger>
                  <SelectContent>
                    {dateOptions.map((date) => (
                      <SelectItem key={date} value={date}>
                        {date}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="col-span-3 space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Shipping Notes
                </label>
                <textarea
                  value={formData.shippingNotes}
                  onChange={(e) =>
                    setFormData({ ...formData, shippingNotes: e.target.value })
                  }
                  placeholder="Delicate product"
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

