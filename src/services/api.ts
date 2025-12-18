const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export interface Item {
  id: number
  itemNumber: string
  specNumber: string
  itemName: string
  vendor: string
  shipTo: string
  shipToAddress?: string
  shipFrom?: string
  qty: number
  phase: string
  price: number
  shipNotes?: string
  notes?: string
  location?: string
  category?: string
  uploadFile?: string
  poApprovalDate?: string
  hotelNeedByDate?: string
  expectedDelivery?: string
  cfaShopsSend?: string
  cfaShopsApproved?: string
  cfaShopsDelivered?: string
  orderedDate?: string
  shippedDate?: string
  deliveredDate?: string
  createdAt?: string
  updatedAt?: string
}

export interface ItemsResponse {
  items: Item[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface BulkEditData {
  location?: string
  category?: string
  shipFrom?: string
  notes?: string
}

export interface UpdateTrackingData {
  poApprovalDate?: string
  hotelNeedByDate?: string
  expectedDelivery?: string
  cfaShopsSend?: string
  cfaShopsApproved?: string
  cfaShopsDelivered?: string
  orderedDate?: string
  shippedDate?: string
  deliveredDate?: string
  shippingNotes?: string
}

class ApiService {
  private baseUrl = API_BASE_URL

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`
    
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      })

      if (!response.ok) {
        const errorText = await response.text()
        let errorMessage = `API Error: ${response.statusText}`
        try {
          const errorJson = JSON.parse(errorText)
          errorMessage = errorJson.message || errorMessage
        } catch {
          // If not JSON, use the text or default message
          if (errorText) errorMessage = errorText
        }
        throw new Error(errorMessage)
      }

      // Handle empty responses
      const contentType = response.headers.get('content-type')
      if (contentType && contentType.includes('application/json')) {
        const text = await response.text()
        return text ? JSON.parse(text) : ({} as T)
      }
      
      return {} as T
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Cannot connect to backend. Please ensure the backend server is running on http://localhost:3000')
      }
      throw error
    }
  }

  // Items endpoints
  async getItems(
    page: number = 1,
    limit: number = 10,
    search?: string,
    phase?: string,
    vendor?: string
  ): Promise<ItemsResponse> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    })

    if (search) params.append('search', search)
    if (phase && phase !== 'all') params.append('phase', phase)
    if (vendor && vendor !== 'all') params.append('vendor', vendor)

    return this.request<ItemsResponse>(`/items?${params.toString()}`)
  }

  async getItem(id: number): Promise<Item> {
    return this.request<Item>(`/items/${id}`)
  }

  async createItem(data: Partial<Item>): Promise<Item> {
    return this.request<Item>('/items', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async updateItem(id: number, data: Partial<Item>): Promise<Item> {
    return this.request<Item>(`/items/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    })
  }

  async deleteItem(id: number): Promise<void> {
    return this.request<void>(`/items/${id}`, {
      method: 'DELETE',
    })
  }

  async bulkEdit(itemIds: number[], data: BulkEditData): Promise<{ updated: number }> {
    return this.request<{ updated: number }>('/items/bulk-edit', {
      method: 'POST',
      body: JSON.stringify({ itemIds, ...data }),
    })
  }

  async updateTracking(
    itemIds: number[],
    data: UpdateTrackingData
  ): Promise<{ updated: number }> {
    // Convert MM/DD/YYYY dates to ISO format (YYYY-MM-DD) for backend
    const convertDate = (dateStr: string): string | undefined => {
      if (!dateStr || dateStr.trim() === '') return undefined
      // If already in ISO format, return as is
      if (dateStr.match(/^\d{4}-\d{2}-\d{2}/)) return dateStr
      // Convert MM/DD/YYYY to YYYY-MM-DD
      const parts = dateStr.split('/')
      if (parts.length === 3) {
        const [month, day, year] = parts
        return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
      }
      return dateStr
    }

    const payload: any = {
      itemIds,
    }

    // Only add date fields if they have values
    if (data.poApprovalDate && data.poApprovalDate.trim()) {
      payload.poApprovalDate = convertDate(data.poApprovalDate)
    }
    if (data.hotelNeedByDate && data.hotelNeedByDate.trim()) {
      payload.hotelNeedByDate = convertDate(data.hotelNeedByDate)
    }
    if (data.expectedDelivery && data.expectedDelivery.trim()) {
      payload.expectedDelivery = convertDate(data.expectedDelivery)
    }
    if (data.cfaShopsSend && data.cfaShopsSend.trim()) {
      payload.cfaShopsSend = convertDate(data.cfaShopsSend)
    }
    if (data.cfaShopsApproved && data.cfaShopsApproved.trim()) {
      payload.cfaShopsApproved = convertDate(data.cfaShopsApproved)
    }
    if (data.cfaShopsDelivered && data.cfaShopsDelivered.trim()) {
      payload.cfaShopsDelivered = convertDate(data.cfaShopsDelivered)
    }
    if (data.orderedDate && data.orderedDate.trim()) {
      payload.orderedDate = convertDate(data.orderedDate)
    }
    if (data.shippedDate && data.shippedDate.trim()) {
      payload.shippedDate = convertDate(data.shippedDate)
    }
    if (data.deliveredDate && data.deliveredDate.trim()) {
      payload.deliveredDate = convertDate(data.deliveredDate)
    }
    if (data.shippingNotes && data.shippingNotes.trim()) {
      payload.shippingNotes = data.shippingNotes.trim()
    }

    // Remove undefined values
    Object.keys(payload).forEach(key => {
      if (payload[key] === undefined) {
        delete payload[key]
      }
    })

    return this.request<{ updated: number }>('/items/update-tracking', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  }

  async bulkDelete(itemIds: number[]): Promise<{ deleted: number }> {
    return this.request<{ deleted: number }>('/items/bulk-delete', {
      method: 'POST',
      body: JSON.stringify({ itemIds }),
    })
  }
}

export const apiService = new ApiService()


