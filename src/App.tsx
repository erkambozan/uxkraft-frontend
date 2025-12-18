import { Routes, Route } from 'react-router-dom'
import ItemsPage from './pages/ItemsPage'
import { Toaster } from '@/components/ui/toaster'

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<ItemsPage />} />
        <Route path="/items" element={<ItemsPage />} />
      </Routes>
      <Toaster />
    </>
  )
}

export default App


