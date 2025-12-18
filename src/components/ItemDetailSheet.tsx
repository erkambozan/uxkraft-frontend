import { useState, useEffect } from 'react'
import { Download } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { useToast } from '@/components/ui/use-toast'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import { apiService, type Item } from '@/services/api'

interface ItemDetailSheetProps {
  item: Item | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onItemUpdated?: () => void
}

export default function ItemDetailSheet({
  item,
  open,
  onOpenChange,
  onItemUpdated,
}: ItemDetailSheetProps) {
  const { toast } = useToast()
  const [fullItem, setFullItem] = useState<Item | null>(null)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)

  // Fetch full item data from backend when sheet opens
  useEffect(() => {
    if (open && item?.id) {
      fetchFullItem()
    } else if (!open) {
      setFullItem(null)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, item?.id])

  const fetchFullItem = async () => {
    if (!item?.id) return
    try {
      setLoading(true)
      const data = await apiService.getItem(item.id)
      setFullItem(data)
    } catch (error) {
      console.error('Error fetching item:', error)
      setFullItem(item) // Fallback to passed item
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to load item details. Showing cached data.',
      })
    } finally {
      setLoading(false)
    }
  }

  // Format date for display (MM/DD/YYYY)
  const formatDate = (dateString?: string) => {
    if (!dateString) return ''
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' })
    } catch {
      return dateString
    }
  }

  // Convert MM/DD/YYYY to ISO format for backend
  const convertDateToISO = (dateStr: string): string | undefined => {
    if (!dateStr || dateStr === 'none' || dateStr.trim() === '') return undefined
    // If already in ISO format, return as is
    if (dateStr.match(/^\d{4}-\d{2}-\d{2}/)) return dateStr
    // Convert MM/DD/YYYY to YYYY-MM-DD
    const parts = dateStr.split('/')
    if (parts.length === 3) {
      const [month, day, year] = parts
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
    }
    return undefined
  }

  // Generate date options (next 90 days)
  const generateDateOptions = () => {
    const options: string[] = []
    const today = new Date()
    for (let i = 0; i < 90; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() + i)
      options.push(formatDate(date.toISOString()))
    }
    return options
  }

  const dateOptions = generateDateOptions()

  // Auto-save function with debounce
  // List of date fields that should use updateTracking endpoint
  const dateFields = [
    'poApprovalDate',
    'hotelNeedByDate',
    'expectedDelivery',
    'cfaShopsSend',
    'cfaShopsApproved',
    'cfaShopsDelivered',
    'orderedDate',
    'shippedDate',
    'deliveredDate',
  ]

  const saveField = async (field: string, value: string | undefined) => {
    if (!fullItem?.id) return
    
    try {
      setSaving(true)
      
      // Date fields should use updateTracking endpoint
      if (dateFields.includes(field)) {
        const trackingData: any = { [field]: value }
        await apiService.updateTracking([fullItem.id], trackingData)
      } else {
        // Non-date fields use updateItem endpoint
        const updateData: any = { [field]: value }
        await apiService.updateItem(fullItem.id, updateData)
      }
      
      // Update local state
      setFullItem((prev) => prev ? { ...prev, [field]: value } : null)
      
      // Notify parent to refresh
      if (onItemUpdated) {
        onItemUpdated()
      }
      
      toast({
        variant: 'success',
        title: 'Updated',
        description: `${field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())} saved successfully`,
      })
    } catch (error) {
      console.error(`Error updating ${field}:`, error)
      toast({
        variant: 'destructive',
        title: 'Error',
        description: `Failed to update ${field}. Please try again.`,
      })
    } finally {
      setSaving(false)
    }
  }

  // Handle date change
  const handleDateChange = async (field: string, value: string) => {
    const isoDate = convertDateToISO(value)
    
    // Update local state immediately for instant UI update (including late calculation)
    if (fullItem) {
      setFullItem((prev) => prev ? { ...prev, [field]: isoDate } : null)
    }
    
    // Save to backend using updateTracking for date fields
    await saveField(field, isoDate)
  }

  // Handle shipping notes change
  const handleShippingNotesChange = async (value: string) => {
    // shipNotes should use updateTracking endpoint with shippingNotes field
    if (!fullItem?.id) return
    
    try {
      setSaving(true)
      await apiService.updateTracking([fullItem.id], { shippingNotes: value || undefined })
      
      // Update local state
      setFullItem((prev) => prev ? { ...prev, shipNotes: value || undefined } : null)
      
      // Notify parent to refresh
      if (onItemUpdated) {
        onItemUpdated()
      }
      
      toast({
        variant: 'success',
        title: 'Updated',
        description: 'Shipping notes saved successfully',
      })
    } catch (error) {
      console.error('Error updating shipping notes:', error)
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to update shipping notes. Please try again.',
      })
    } finally {
      setSaving(false)
    }
  }

  // Use fullItem if available, otherwise fallback to item
  const displayItem = fullItem || item

  // Generic function to calculate late days between two dates
  const calculateLateDays = (targetDate?: string, actualDate?: string): { isLate: boolean; lateByDays: number } => {
    if (!targetDate || !actualDate) {
      return { isLate: false, lateByDays: 0 }
    }

    try {
      // Parse dates (they come in ISO format from backend: YYYY-MM-DD)
      const parseDate = (dateStr: string): Date => {
        // If it's in MM/DD/YYYY format, convert it
        if (dateStr.includes('/') && !dateStr.includes('T')) {
          const [month, day, year] = dateStr.split('/')
          return new Date(parseInt(year), parseInt(month) - 1, parseInt(day))
        }
        // Otherwise assume ISO format (YYYY-MM-DD or YYYY-MM-DDTHH:mm:ss)
        return new Date(dateStr)
      }

      const target = parseDate(targetDate)
      const actual = parseDate(actualDate)

      // Reset time to midnight for accurate day calculation
      target.setHours(0, 0, 0, 0)
      actual.setHours(0, 0, 0, 0)

      // Calculate difference in days (actual - target)
      const diffTime = actual.getTime() - target.getTime()
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

      if (diffDays > 0) {
        return { isLate: true, lateByDays: diffDays }
      }
      return { isLate: false, lateByDays: 0 }
    } catch (error) {
      console.error('Error calculating late days:', error)
      return { isLate: false, lateByDays: 0 }
    }
  }

  // Only create itemDetails if displayItem exists
  const itemDetails = displayItem ? (() => {
    const hotelNeedByDateFormatted = formatDate(displayItem.hotelNeedByDate)
    const expectedDeliveryFormatted = formatDate(displayItem.expectedDelivery)
    
    // Calculate late days for Planning section: Expected Delivery vs Hotel Need by Date
    const planningLateInfo = calculateLateDays(
      displayItem.hotelNeedByDate, // Use ISO format from backend
      displayItem.expectedDelivery  // Use ISO format from backend
    )

    // Calculate late days for Production & Shop: CFA/Shops Delivered vs CFA/Shops Approved
    const productionLateInfo = calculateLateDays(
      displayItem.cfaShopsApproved, // Target date
      displayItem.cfaShopsDelivered  // Actual date
    )

    // Calculate late days for Shipping: Delivered Date vs Expected Delivery
    const shippingLateInfo = calculateLateDays(
      displayItem.expectedDelivery, // Target date (from Planning section)
      displayItem.deliveredDate      // Actual date
    )

    return {
      shipToAddress: displayItem.shipToAddress || `${displayItem.shipTo}, ${displayItem.shipToAddress || ''}`,
      shipFrom: displayItem.shipFrom || displayItem.vendor,
      notes: displayItem.notes || 'Check fabric when modifying',
      location: displayItem.location || 'Guest Room',
      category: displayItem.category || 'Drapery',
      uploadFile: displayItem.uploadFile || 'BD-200 2ND FLO...',
      description: 'Brand: Harmony Home, TextilesMo...',
      price: displayItem.price || 2000.00,
      markup: 20,
      // Calculate unit price: base price * (1 + markup%)
      unitPrice: displayItem.price ? displayItem.price * (1 + (20 / 100)) : 2400.00,
      unit: 'each',
      // Calculate total price: qty * unit price
      totalPrice: displayItem.qty && displayItem.price ? displayItem.qty * (displayItem.price * (1 + (20 / 100))) : 0,
      poApprovalDate: formatDate(displayItem.poApprovalDate),
      hotelNeedByDate: hotelNeedByDateFormatted,
      expectedDelivery: expectedDeliveryFormatted,
      isLate: planningLateInfo.isLate,
      lateByDays: planningLateInfo.lateByDays,
      cfaShopsSend: formatDate(displayItem.cfaShopsSend),
      cfaShopsApproved: formatDate(displayItem.cfaShopsApproved),
      cfaShopsDelivered: formatDate(displayItem.cfaShopsDelivered),
      productionIsLate: productionLateInfo.isLate,
      productionLateByDays: productionLateInfo.lateByDays,
      orderedDate: formatDate(displayItem.orderedDate),
      shippedDate: formatDate(displayItem.shippedDate),
      deliveredDate: formatDate(displayItem.deliveredDate),
      shippingIsLate: shippingLateInfo.isLate,
      shippingLateByDays: shippingLateInfo.lateByDays,
    }
  })() : null

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-4xl overflow-y-auto p-0">
        <SheetHeader className="sr-only">
          <SheetTitle>
            {displayItem ? `Item ${displayItem.itemNumber} - ${displayItem.itemName}` : 'Item Details'}
          </SheetTitle>
          <SheetDescription>
            {displayItem ? 'View and edit item details' : 'No item selected'}
          </SheetDescription>
        </SheetHeader>
        {loading ? (
          <div className="p-6">
            <p className="text-gray-500">Loading item details...</p>
          </div>
        ) : !displayItem || !itemDetails ? (
          <div className="p-6">
            <p className="text-gray-500">No item selected</p>
          </div>
        ) : (
          <div className="p-6">
            <div className="mb-6 pb-4 border-b">
              <div className="flex items-center justify-between pr-8">
                <h2 className="text-2xl font-bold text-gray-900">
                  Item #{displayItem.itemNumber} - {displayItem.itemName}
                </h2>
                {saving && (
                  <span className="text-sm text-gray-500">Saving...</span>
                )}
              </div>
            </div>

            <div className="space-y-6">
            {/* Item Details Section */}
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Item Details</h3>
              <div className="grid grid-cols-3 gap-6">
                <div className="space-y-1">
                  <label className="text-sm text-gray-600 block">Spec #</label>
                  <p className="text-sm font-medium text-gray-900">{displayItem.specNumber}</p>
                </div>
                <div className="space-y-1">
                  <label className="text-sm text-gray-600 block">Vendor</label>
                  <p className="text-sm font-medium text-gray-900">{displayItem.vendor}</p>
                </div>
                <div className="space-y-1">
                  <label className="text-sm text-gray-600 block">Phase</label>
                  <p className="text-sm font-medium text-gray-900">{displayItem.phase}</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-6 pt-4 border-t">
                <div className="space-y-1">
                  <label className="text-sm text-gray-600 block">Ship to</label>
                  <div className="text-sm font-medium text-gray-900">
                    <div>{displayItem.shipTo}</div>
                    {displayItem.shipToAddress && (
                      <div className="text-gray-600">{displayItem.shipToAddress}</div>
                    )}
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-sm text-gray-600 block">Ship From</label>
                  <p className="text-sm font-medium text-gray-900">{itemDetails.shipFrom}</p>
                </div>
                <div className="space-y-1">
                  <label className="text-sm text-gray-600 block">Notes for this item</label>
                  <p className="text-sm font-medium text-gray-900">{itemDetails.notes}</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-6 pt-4 border-t">
                <div className="space-y-1">
                  <label className="text-sm text-gray-600 block">Location</label>
                  <p className="text-sm font-medium text-gray-900">{itemDetails.location}</p>
                </div>
                <div className="space-y-1">
                  <label className="text-sm text-gray-600 block">Category</label>
                  <p className="text-sm font-medium text-gray-900">{itemDetails.category}</p>
                </div>
                <div className="space-y-1">
                  <label className="text-sm text-gray-600 block">Upload</label>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-gray-900">{itemDetails.uploadFile}</p>
                    <Download className="h-4 w-4 text-gray-500 cursor-pointer hover:text-gray-700" />
                  </div>
                </div>
              </div>

              {/* Pricing Content */}
              <div className="pt-4 border-t space-y-4">
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50">
                        <TableHead className="font-semibold text-gray-900">Description</TableHead>
                        <TableHead className="font-semibold text-gray-900">Price</TableHead>
                        <TableHead className="font-semibold text-gray-900">Markup</TableHead>
                        <TableHead className="font-semibold text-gray-900">Unit Price</TableHead>
                        <TableHead className="font-semibold text-gray-900">Qty</TableHead>
                        <TableHead className="font-semibold text-gray-900">Unit</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="text-sm text-gray-900">{itemDetails.description}</TableCell>
                        <TableCell className="text-sm text-gray-900">${itemDetails.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}</TableCell>
                        <TableCell className="text-sm text-gray-900">{itemDetails.markup}%</TableCell>
                        <TableCell className="text-sm text-gray-900">${itemDetails.unitPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}</TableCell>
                        <TableCell className="text-sm text-gray-900">{displayItem.qty}</TableCell>
                        <TableCell className="text-sm text-gray-900">{itemDetails.unit}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
                <div className="flex justify-end items-center pt-2">
                  <div className="flex items-center gap-4">
                    <span className="font-semibold text-gray-900">TOTAL PRICE</span>
                    <span className="text-lg font-bold text-gray-900">${itemDetails.totalPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Planning & Requirements Section */}
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Planning & Requirements</h3>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-sm text-gray-600 mb-2 block">PO Approval Date</label>
                  <Select 
                    value={itemDetails.poApprovalDate || 'none'}
                    onValueChange={(value) => handleDateChange('poApprovalDate', value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="No date set" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No date set</SelectItem>
                      {dateOptions.map((date) => (
                        <SelectItem key={date} value={date}>
                          {date}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm text-gray-600 mb-2 block">Hotel Need by Date</label>
                  <Select 
                    value={itemDetails.hotelNeedByDate || 'none'}
                    onValueChange={(value) => handleDateChange('hotelNeedByDate', value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="No date set" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No date set</SelectItem>
                      {dateOptions.map((date) => (
                        <SelectItem key={date} value={date}>
                          {date}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm text-gray-600 mb-2 block">Expected Delivery</label>
                  <Select 
                    value={itemDetails.expectedDelivery || 'none'}
                    onValueChange={(value) => handleDateChange('expectedDelivery', value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="No date set" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No date set</SelectItem>
                      {dateOptions.map((date) => (
                        <SelectItem key={date} value={date}>
                          {date}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {itemDetails.isLate && (
                    <p className="text-sm text-red-600 mt-2">Late by {itemDetails.lateByDays} days</p>
                  )}
                </div>
              </div>
            </div>

            {/* Production & Shop Section */}
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Production & Shop</h3>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-sm text-gray-600 mb-2 block">CFA/Shops Send</label>
                  <Select 
                    value={itemDetails.cfaShopsSend || 'none'}
                    onValueChange={(value) => handleDateChange('cfaShopsSend', value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="No date set" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No date set</SelectItem>
                      {dateOptions.map((date) => (
                        <SelectItem key={date} value={date}>
                          {date}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm text-gray-600 mb-2 block">CFA/Shops Approved</label>
                  <Select 
                    value={itemDetails.cfaShopsApproved || 'none'}
                    onValueChange={(value) => handleDateChange('cfaShopsApproved', value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="No date set" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No date set</SelectItem>
                      {dateOptions.map((date) => (
                        <SelectItem key={date} value={date}>
                          {date}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm text-gray-600 mb-2 block">CFA/Shops Delivered</label>
                  <Select 
                    value={itemDetails.cfaShopsDelivered || 'none'}
                    onValueChange={(value) => handleDateChange('cfaShopsDelivered', value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="No date set" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No date set</SelectItem>
                      {dateOptions.map((date) => (
                        <SelectItem key={date} value={date}>
                          {date}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {itemDetails.productionIsLate && (
                    <p className="text-sm text-red-600 mt-2">Late by {itemDetails.productionLateByDays} days</p>
                  )}
                </div>
              </div>
            </div>

            {/* Shipping Section */}
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm space-y-4 pb-6">
              <h3 className="text-lg font-semibold text-gray-900">Shipping</h3>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-sm text-gray-600 mb-2 block">Ordered Date</label>
                  <Select 
                    value={itemDetails.orderedDate || 'none'}
                    onValueChange={(value) => handleDateChange('orderedDate', value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="No date set" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No date set</SelectItem>
                      {dateOptions.map((date) => (
                        <SelectItem key={date} value={date}>
                          {date}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm text-gray-600 mb-2 block">Shipped Date</label>
                  <Select 
                    value={itemDetails.shippedDate || 'none'}
                    onValueChange={(value) => handleDateChange('shippedDate', value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="No date set" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No date set</SelectItem>
                      {dateOptions.map((date) => (
                        <SelectItem key={date} value={date}>
                          {date}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm text-gray-600 mb-2 block">Delivered Date</label>
                  <Select 
                    value={itemDetails.deliveredDate || 'none'}
                    onValueChange={(value) => handleDateChange('deliveredDate', value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="No date set" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No date set</SelectItem>
                      {dateOptions.map((date) => (
                        <SelectItem key={date} value={date}>
                          {date}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {itemDetails.shippingIsLate && (
                    <p className="text-sm text-red-600 mt-2">Late by {itemDetails.shippingLateByDays} days</p>
                  )}
                </div>
                <div className="col-span-3">
                  <label className="text-sm text-gray-600 mb-2 block">Shipping Notes</label>
                  <Input
                    type="text"
                    defaultValue={displayItem.shipNotes || ''}
                    onBlur={(e) => handleShippingNotesChange(e.target.value)}
                    className="w-full"
                  />
                </div>
              </div>
            </div>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}

