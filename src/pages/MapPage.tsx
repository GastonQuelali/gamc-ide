import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import MapCatastro from "@/components/MapCatastro"
import { useAuth } from "@/hooks/useAuth"
import Sidebar from "@/components/Sidebar"

export default function MapPage() {
  const navigate = useNavigate()
  const { user, isLoading } = useAuth()

  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/")
    }
  }, [user, isLoading, navigate])

  if (isLoading || !user) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <div className="text-lg">Cargando...</div>
      </div>
    )
  }

  return (
    <Sidebar>
      <div className="h-[calc(100vh-57px)]">
        <MapCatastro height="100%" />
      </div>
    </Sidebar>
  )
}
