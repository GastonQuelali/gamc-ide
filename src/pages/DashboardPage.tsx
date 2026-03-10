import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { Building2, Map, FileText, Users } from "lucide-react"
import Sidebar from "@/components/Sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const prediosData = [
  { name: "Ene", cantidad: 120 },
  { name: "Feb", cantidad: 150 },
  { name: "Mar", cantidad: 180 },
  { name: "Abr", cantidad: 220 },
  { name: "May", cantidad: 280 },
  { name: "Jun", cantidad: 350 },
]

const usoSueloData = [
  { name: "Residencial", value: 45, color: "#3b82f6" },
  { name: "Comercial", value: 25, color: "#10b981" },
  { name: "Industrial", value: 15, color: "#f59e0b" },
  { name: "Mixto", value: 15, color: "#8b5cf6" },
]

const recentPredios = [
  { id: "001", codigo: "010101001", propietario: "Juan Perez", area: "250.50 m²", estado: "Activo" },
  { id: "002", codigo: "010101002", propietario: "Maria Garcia", area: "180.25 m²", estado: "Activo" },
  { id: "003", codigo: "010101003", propietario: "Carlos Lopez", area: "320.00 m²", estado: "Pendiente" },
  { id: "004", codigo: "010101004", propietario: "Ana Rodriguez", area: "145.75 m²", estado: "Activo" },
  { id: "005", codigo: "010101005", propietario: "Pedro Martinez", area: "410.30 m²", estado: "Inactivo" },
]

const stats = [
  { title: "Total Predios", value: "12,458", icon: Building2, color: "text-blue-500" },
  { title: "Manzanas", value: "342", icon: Map, color: "text-green-500" },
  { title: "Reportes", value: "1,234", icon: FileText, color: "text-orange-500" },
  { title: "Usuarios", value: "89", icon: Users, color: "text-purple-500" },
]

export default function DashboardPage() {
  return (
    <Sidebar>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="flex items-center gap-4 p-4">
                <div className={`p-3 rounded-lg bg-muted ${stat.color}`}>
                  <stat.icon className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle>Predios por Mes</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={prediosData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="cantidad" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Uso de Suelo</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={usoSueloData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {usoSueloData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap gap-4 justify-center mt-4">
                {usoSueloData.map((item) => (
                  <div key={item.name} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-sm">{item.name}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Predios Recientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3 font-medium">Código</th>
                    <th className="text-left p-3 font-medium">Propietario</th>
                    <th className="text-left p-3 font-medium">Área</th>
                    <th className="text-left p-3 font-medium">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {recentPredios.map((predio) => (
                    <tr key={predio.id} className="border-b hover:bg-muted/50">
                      <td className="p-3">{predio.codigo}</td>
                      <td className="p-3">{predio.propietario}</td>
                      <td className="p-3">{predio.area}</td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            predio.estado === "Activo"
                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                              : predio.estado === "Pendiente"
                              ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                              : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                          }`}
                        >
                          {predio.estado}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </Sidebar>
  )
}
