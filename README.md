# UxKraft Frontend

A modern, responsive web application for managing items with comprehensive tracking, bulk operations, and real-time updates. Built with React, TypeScript, and Tailwind CSS.

## 🚀 Features

### Core Functionality
- **Item Management**: View, search, filter, and manage items in a comprehensive table view
- **Individual Item Editing**: Click on item names to open detailed edit sheets with real-time updates
- **Bulk Operations**: 
  - Bulk edit multiple items simultaneously
  - Bulk update tracking information
  - Bulk delete items
- **Advanced Search & Filtering**: 
  - Search by Item Name, Item #, or Spec #
  - Filter by Phase and Vendor
  - Real-time filtering with debounced search
- **Pagination**: Configurable rows per page with navigation controls
- **CSV Export**: Export all item data with comprehensive details including dates and tracking information

### Tracking & Monitoring
- **Planning & Requirements Tracking**: Track PO Approval, Hotel Need by Date, and Expected Delivery
- **Production & Shop Tracking**: Monitor CFA/Shops Send, Approved, and Delivered dates
- **Shipping Tracking**: Track Ordered, Shipped, and Delivered dates
- **Late Calculation**: Automatic calculation and display of late days for:
  - Expected Delivery vs Hotel Need by Date
  - CFA/Shops Delivered vs CFA/Shops Approved
  - Delivered Date vs Expected Delivery

### User Experience
- **Real-time Updates**: Hot updates for date fields and shipping notes
- **Toast Notifications**: User-friendly success and error notifications
- **Responsive Design**: Modern UI built with Shadcn UI components
- **Accessibility**: Screen reader support and keyboard navigation

## 🛠️ Tech Stack

### Core
- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing

### UI & Styling
- **Tailwind CSS** - Utility-first CSS framework
- **Shadcn UI** - High-quality component library
- **Radix UI** - Accessible component primitives
- **Lucide React** - Icon library

### State Management
- React Hooks (useState, useEffect)
- Custom API service layer

## 📋 Prerequisites

- Node.js 18+ and npm
- Backend API running (see [uxkraft-backend](https://github.com/yourusername/uxkraft-backend) for backend setup)

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/uxkraft-frontend.git
   cd uxkraft-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   VITE_API_URL=http://localhost:3000
   ```
   
   Or the API URL will default to `http://localhost:3000` if not specified.

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to `http://localhost:5173` (or the port shown in your terminal)

## 📜 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally

## 🏗️ Project Structure

```
uxkraft-frontend/
├── public/                 # Static assets
├── src/
│   ├── components/        # React components
│   │   ├── ui/           # Shadcn UI components
│   │   ├── ItemDetailSheet.tsx
│   │   ├── BulkEditSheet.tsx
│   │   └── UpdateTrackingSheet.tsx
│   ├── lib/              # Utility functions
│   │   ├── utils.ts      # cn utility (clsx + tailwind-merge)
│   │   └── classNames.ts # Reusable Tailwind class constants
│   ├── pages/            # Page components
│   │   └── ItemsPage.tsx # Main items management page
│   ├── services/         # API service layer
│   │   └── api.ts        # API client and types
│   ├── App.tsx           # Root component
│   ├── main.tsx          # Application entry point
│   └── style.css         # Global styles
├── index.html
├── package.json
├── tailwind.config.js     # Tailwind configuration
├── tsconfig.json          # TypeScript configuration
└── vite.config.ts        # Vite configuration
```

## 🔌 API Integration

The application communicates with a NestJS backend API. Ensure the backend is running and accessible at the configured `VITE_API_URL`.

### API Endpoints Used
- `GET /items` - Fetch items with filters
- `GET /items/:id` - Get single item details
- `PATCH /items/:id` - Update item
- `POST /items/bulk-edit` - Bulk edit items
- `POST /items/update-tracking` - Update tracking information
- `DELETE /items/bulk-delete` - Bulk delete items

## 🎨 Key Components

### ItemsPage
Main page component featuring:
- Item table with sorting and filtering
- Search functionality
- Bulk selection and actions
- Pagination controls
- CSV export

### ItemDetailSheet
Side sheet for viewing/editing individual items:
- Item details display
- Planning & Requirements dates
- Production & Shop dates
- Shipping dates
- Real-time updates with late calculation

### BulkEditSheet
Side sheet for bulk editing selected items:
- Update location, category, ship from, and notes
- Apply changes to multiple items at once

### UpdateTrackingSheet
Side sheet for updating tracking information:
- Update planning dates
- Update production dates
- Update shipping dates
- Add shipping notes

## 🎯 Usage

### Viewing Items
- Use the search bar to find items by name, item number, or spec number
- Filter by Phase or Vendor using the dropdown filters
- Navigate pages using the pagination controls

### Editing an Item
1. Click on an item name in the table
2. The edit sheet will open with full item details
3. Modify dates or shipping notes
4. Changes are saved automatically (hot update)

### Bulk Operations
1. Select items using checkboxes
2. Choose an action from the bulk actions bar:
   - **Bulk Edit**: Update common fields for selected items
   - **Update Tracking**: Update tracking dates for selected items
   - **Delete**: Remove selected items

### Exporting Data
1. Click the "Export CSV" button
2. A CSV file will be downloaded with all item details including:
   - Basic information
   - Shipping details
   - Planning dates
   - Production dates
   - Shipping dates
   - Additional information

## 🧩 Code Quality

- **TypeScript**: Full type safety throughout the application
- **Component Organization**: Modular, reusable components
- **Utility Functions**: Centralized class name management and utilities
- **Error Handling**: Comprehensive error handling with user-friendly messages
- **Accessibility**: ARIA labels and keyboard navigation support

## 🔒 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API base URL | `http://localhost:3000` |

---

**Note**: This frontend requires the [uxkraft-backend](https://github.com/erkambozan/uxkraft-backend) to be running for full functionality.
