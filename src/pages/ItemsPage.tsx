import { useState, useEffect } from 'react'
import { Search, ChevronDown, ChevronLeft, ChevronRight, FileDown, Files, FileSearch, FilePenLine, Trash2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Checkbox } from '@/components/ui/checkbox'
import ItemDetailSheet from '@/components/ItemDetailSheet'
import BulkEditSheet, { type BulkEditData } from '@/components/BulkEditSheet'
import UpdateTrackingSheet, { type UpdateTrackingData } from '@/components/UpdateTrackingSheet'
import { apiService, type Item } from '@/services/api'

export default function ItemsPage() {
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState('')
  const [phaseFilter, setPhaseFilter] = useState<string>('all')
  const [vendorFilter, setVendorFilter] = useState<string>('all')
  const [selectedItems, setSelectedItems] = useState<number[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [selectedItem, setSelectedItem] = useState<Item | null>(null)
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [isBulkEditOpen, setIsBulkEditOpen] = useState(false)
  const [isUpdateTrackingOpen, setIsUpdateTrackingOpen] = useState(false)
  const [items, setItems] = useState<Item[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch items from API
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchItems()
    }, 300) // Debounce search by 300ms

    return () => clearTimeout(timeoutId)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, phaseFilter, vendorFilter])

  // Initial fetch on mount
  useEffect(() => {
    fetchItems()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const fetchItems = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiService.getItems(
        1,
        1000,
        searchQuery || undefined,
        phaseFilter !== 'all' ? phaseFilter : undefined,
        vendorFilter !== 'all' ? vendorFilter : undefined
      )
      setItems(response.items)
    } catch (error) {
      console.error('Error fetching items:', error)
      setError('Failed to load items. Please check if the backend is running.')
      setItems([])
    } finally {
      setLoading(false)
    }
  }

  // Filter + pagination (frontend, to keep design consistent)
  const filteredItems = items
  const totalItems = filteredItems.length

  const totalPages = Math.ceil(totalItems / rowsPerPage) || 1
  const startIndex = (currentPage - 1) * rowsPerPage
  const endIndex = startIndex + rowsPerPage
  const paginatedItems = filteredItems.slice(startIndex, endIndex)

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      // Add current page items to selection
      const currentPageIds = paginatedItems.map((item) => item.id)
      setSelectedItems([...new Set([...selectedItems, ...currentPageIds])])
    } else {
      // Remove current page items from selection
      const currentPageIds = paginatedItems.map((item) => item.id)
      setSelectedItems(selectedItems.filter((id) => !currentPageIds.includes(id)))
    }
  }

  const handleSelectItem = (itemId: number, checked: boolean) => {
    if (checked) {
      setSelectedItems([...selectedItems, itemId])
    } else {
      setSelectedItems(selectedItems.filter((id) => id !== itemId))
    }
  }

  // Get selected items count across all pages
  const selectedCount = selectedItems.length

  // Bulk action handlers
  const handleBulkEdit = () => {
    setIsBulkEditOpen(true)
  }

  const handleBulkEditSave = async (data: BulkEditData) => {
    try {
      const countToUpdate = selectedItems.length
      const result = await apiService.bulkEdit(selectedItems, data)
      setSelectedItems([])
      await fetchItems()
      toast({
        variant: 'success',
        title: 'Success',
        description: `Successfully updated ${countToUpdate} item(s)`,
      })
    } catch (error) {
      console.error('Error updating items:', error)
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to update items. Please check if the backend is running and try again.',
      })
    }
  }

  const handleUpdateTracking = () => {
    setIsUpdateTrackingOpen(true)
  }

  const handleUpdateTrackingSave = async (data: UpdateTrackingData) => {
    try {
      const countToUpdate = selectedItems.length
      console.log('Updating tracking with data:', data)
      const result = await apiService.updateTracking(selectedItems, data)
      setSelectedItems([])
      await fetchItems()
      toast({
        variant: 'success',
        title: 'Success',
        description: `Successfully updated tracking for ${countToUpdate} item(s)`,
      })
    } catch (error) {
      console.error('Error updating tracking:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      toast({
        variant: 'destructive',
        title: 'Error',
        description: `Failed to update tracking: ${errorMessage}. Please check if the backend is running and try again.`,
      })
    }
  }

  const handleCreatePO = () => {
    console.log('Create PO:', selectedItems)
    toast({
      variant: 'default',
      title: 'Coming Soon',
      description: 'Create PO functionality will be available soon.',
    })
  }

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete ${selectedCount} item(s)?`)) {
      try {
        const result = await apiService.bulkDelete(selectedItems)
        setSelectedItems([])
        await fetchItems()
        toast({
          variant: 'success',
          title: 'Success',
          description: `Successfully deleted ${result.deleted} item(s)`,
        })
      } catch (error) {
        console.error('Error deleting items:', error)
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to delete items. Please check if the backend is running and try again.',
        })
      }
    }
  }

  const handleEditItem = (item: Item) => {
    console.log('Opening edit sheet for item:', item)
    setSelectedItem(item)
    setIsSheetOpen(true)
  }

  const handleExportCSV = () => {
    try {
      // Helper function to format dates for CSV
      const formatDateForCSV = (date?: string) => {
        if (!date) return ''
        try {
          const d = new Date(date)
          if (isNaN(d.getTime())) return date // Return as-is if invalid
          return d.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' })
        } catch {
          return date
        }
      }

      // CSV export functionality with comprehensive fields
      const csvContent = [
        [
          // Basic Information
          'Item#', 'Spec #', 'Item Name', 'Vendor', 'Qty', 'Phase', 'Price',
          // Shipping Information
          'Ship To', 'Ship To Address', 'Ship From', 'Ship Notes',
          // Planning & Requirements Dates
          'PO Approval Date', 'Hotel Need by Date', 'Expected Delivery',
          // Production & Shop Dates
          'CFA/Shops Send', 'CFA/Shops Approved', 'CFA/Shops Delivered',
          // Shipping Dates
          'Ordered Date', 'Shipped Date', 'Delivered Date',
          // Additional Information
          'Location', 'Category', 'Notes', 'Upload File'
        ],
        ...filteredItems.map((item: Item) => [
          // Basic Information
          item.itemNumber || '',
          item.specNumber || '',
          item.itemName || '',
          item.vendor || '',
          item.qty?.toString() || '',
          item.phase || '',
          `$${Number(item.price || 0).toFixed(2)}`,
          // Shipping Information
          item.shipTo || '',
          item.shipToAddress || '',
          item.shipFrom || '',
          item.shipNotes || '',
          // Planning & Requirements Dates
          formatDateForCSV(item.poApprovalDate),
          formatDateForCSV(item.hotelNeedByDate),
          formatDateForCSV(item.expectedDelivery),
          // Production & Shop Dates
          formatDateForCSV(item.cfaShopsSend),
          formatDateForCSV(item.cfaShopsApproved),
          formatDateForCSV(item.cfaShopsDelivered),
          // Shipping Dates
          formatDateForCSV(item.orderedDate),
          formatDateForCSV(item.shippedDate),
          formatDateForCSV(item.deliveredDate),
          // Additional Information
          item.location || '',
          item.category || '',
          item.notes || '',
          item.uploadFile || '',
        ]),
      ]
        .map((row: string[]) => row.map((cell: string) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
        .join('\n')

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'items.csv'
      a.click()
      window.URL.revokeObjectURL(url)
      
      toast({
        variant: 'success',
        title: 'Export Successful',
        description: `Exported ${filteredItems.length} item(s) to CSV with all details`,
      })
    } catch (error) {
      console.error('Error exporting CSV:', error)
      toast({
        variant: 'destructive',
        title: 'Export Failed',
        description: 'Failed to export CSV. Please try again.',
      })
    }
  }

  // Get unique phases and vendors for filters from loaded items
  const phases = Array.from(new Set(items.map((item) => item.phase))).sort()
  const vendors = Array.from(new Set(items.map((item) => item.vendor))).sort()

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <h1 className="mb-6 text-4xl font-bold text-gray-900">Items</h1>

        {/* Search and Filters */}
        <div className="mb-6 flex flex-wrap items-center gap-4">
          <div className="relative flex-1 min-w-[300px]">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Find by Item Name, Item # or Spec #"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setCurrentPage(1)
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  fetchItems()
                }
              }}
              className="pl-10"
            />
          </div>

          <Select value={phaseFilter} onValueChange={(value) => {
            setPhaseFilter(value)
            setCurrentPage(1)
          }}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Phase" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Phases</SelectItem>
              {phases.map((phase) => (
                <SelectItem key={phase} value={phase}>
                  Phase {phase}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={vendorFilter} onValueChange={(value) => {
            setVendorFilter(value)
            setCurrentPage(1)
          }}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Vendor" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Vendors</SelectItem>
              {vendors.map((vendor) => (
                <SelectItem key={vendor} value={vendor}>
                  {vendor}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            onClick={handleExportCSV}
            className="flex items-center gap-2"
          >
            <FileDown className="h-4 w-4" />
            CSV
            <ChevronDown className="h-4 w-4" />
          </Button>
        </div>

        {/* Bulk Actions Bar */}
        {selectedCount > 0 && (
          <div className="mb-4 flex items-center gap-4 rounded-lg border border-gray-200 bg-white px-4 py-3">
            <div className="text-sm text-gray-500">
              {selectedCount} item{selectedCount !== 1 ? 's' : ''} selected
            </div>
            <button
              onClick={handleBulkEdit}
              className="flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900 transition-colors"
            >
              <Files className="h-4 w-4" />
              Bulk Edit
            </button>
            <button
              onClick={handleUpdateTracking}
              className="flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900 transition-colors"
            >
              <FileSearch className="h-4 w-4" />
              Update Tracking
            </button>
            <button
              onClick={handleCreatePO}
              className="flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900 transition-colors"
            >
              <FilePenLine className="h-4 w-4" />
              Create PO
            </button>
            <button
              onClick={handleDelete}
              className="flex items-center gap-2 text-sm text-red-600 hover:text-red-700 transition-colors"
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </button>
          </div>
        )}

        {/* Table */}
        <div className="rounded-lg border bg-white shadow-sm">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={
                      paginatedItems.length > 0 &&
                      paginatedItems.every((item) => selectedItems.includes(item.id))
                    }
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead>Item#</TableHead>
                <TableHead>Spec #</TableHead>
                <TableHead>Item Name</TableHead>
                <TableHead>Vendor</TableHead>
                <TableHead>Ship To</TableHead>
                <TableHead>Qty</TableHead>
                <TableHead>Phase</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Ship Notes</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={11} className="text-center text-gray-500 py-8">
                    Loading items...
                  </TableCell>
                </TableRow>
              ) : error ? (
                <TableRow>
                  <TableCell colSpan={11} className="text-center text-red-600 py-8">
                    {error}
                    <br />
                    <button
                      onClick={fetchItems}
                      className="mt-2 text-sm text-blue-600 hover:underline"
                    >
                      Retry
                    </button>
                  </TableCell>
                </TableRow>
              ) : paginatedItems.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={11} className="text-center text-gray-500 py-8">
                    No items found
                  </TableCell>
                </TableRow>
              ) : (
                paginatedItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedItems.includes(item.id)}
                        onCheckedChange={(checked) =>
                          handleSelectItem(item.id, checked as boolean)
                        }
                      />
                    </TableCell>
                    <TableCell className="font-medium">{item.itemNumber}</TableCell>
                    <TableCell>{item.specNumber}</TableCell>
                    <TableCell>
                      <button
                        onClick={() => handleEditItem(item)}
                        className="text-red-600 hover:text-red-700 hover:underline cursor-pointer text-left"
                      >
                        {item.itemName}
                      </button>
                    </TableCell>
                    <TableCell>{item.vendor}</TableCell>
                    <TableCell>{item.shipTo}</TableCell>
                    <TableCell>{item.qty}</TableCell>
                    <TableCell>
                      <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-sm font-medium text-gray-800">
                        {item.phase}
                      </span>
                    </TableCell>
                    <TableCell className="font-medium">
                      ${Number((item.qty || 0) * (item.price || 0)).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </TableCell>
                    <TableCell>{item.shipNotes || 'Delicate prod...'}</TableCell>
                    <TableCell>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="flex items-center gap-1"
                        onClick={() => {}}
                      >
                        Edit
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="mt-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-700">Rows per page</span>
            <Select
              value={rowsPerPage.toString()}
              onValueChange={(value) => {
                setRowsPerPage(Number(value))
                setCurrentPage(1)
              }}
            >
              <SelectTrigger className="w-[80px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-700">
              {totalItems === 0
                ? '0-0 of 0'
                : `${startIndex + 1}-${Math.min(endIndex, totalItems)} of ${totalItems}`}
            </span>
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum: number
                if (totalPages <= 5) {
                  pageNum = i + 1
                } else if (currentPage <= 3) {
                  pageNum = i + 1
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i
                } else {
                  pageNum = currentPage - 2 + i
                }
                return (
                  <Button
                    key={pageNum}
                    variant={currentPage === pageNum ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setCurrentPage(pageNum)}
                    className={
                      currentPage === pageNum
                        ? 'bg-red-600 text-white hover:bg-red-700'
                        : ''
                    }
                  >
                    {pageNum}
                  </Button>
                )
              })}
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Item Detail Sheet */}
      <ItemDetailSheet
        item={selectedItem}
        open={isSheetOpen}
        onOpenChange={setIsSheetOpen}
        onItemUpdated={fetchItems}
      />

      {/* Bulk Edit Sheet */}
      <BulkEditSheet
        open={isBulkEditOpen}
        onOpenChange={setIsBulkEditOpen}
        selectedCount={selectedCount}
        onSave={handleBulkEditSave}
      />

      {/* Update Tracking Sheet */}
      <UpdateTrackingSheet
        open={isUpdateTrackingOpen}
        onOpenChange={setIsUpdateTrackingOpen}
        selectedCount={selectedCount}
        onSave={handleUpdateTrackingSave}
      />
    </div>
  )
}

