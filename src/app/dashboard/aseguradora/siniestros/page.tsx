import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function MisCasosPage() {
  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <h2 className="text-3xl font-bold tracking-tight">Mis Casos</h2>
      <Card>
        <CardHeader>
          <CardTitle>Listado de Siniestros</CardTitle>
          <CardDescription>
            Aquí se mostrará la lista completa de siniestros gestionados.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>Tabla de siniestros...</p>
        </CardContent>
      </Card>
    </div>
  )
}
