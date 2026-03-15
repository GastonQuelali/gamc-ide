import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import AuthPage from "./pages/AuthPage"
import MapPage from "./pages/MapPage"
import DashboardPage from "./pages/DashboardPage"
import ConfigPage from "./pages/ConfigPage"
import CapasPage from "./pages/CapasPage"
import AdminCapasPage from "./pages/AdminCapasPage"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AuthPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/map" element={<MapPage />} />
        <Route path="/capas" element={<CapasPage />} />
        <Route path="/admin/capas" element={<AdminCapasPage />} />
        <Route path="/config" element={<ConfigPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
