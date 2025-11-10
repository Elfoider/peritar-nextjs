import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function ReparacionesEnCursoPage() {
  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <h2 className="text-3xl font-bold tracking-tight">Reparaciones en Curso</h2>
       <Card>
        <CardHeader>
          <CardTitle>Listado de Reparaciones Activas</CardTitle>
          <CardDescription>
            Gestiona y actualiza el estado de los vehículos en tu taller.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>Tabla de reparaciones...</p>
        </CardContent>
      </Card>
    </div>
  )
}
