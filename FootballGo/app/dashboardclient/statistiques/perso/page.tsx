import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function StatistiquesPersoPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Statistiques personnelles</h1>
      <Card>
        <CardHeader>
          <CardTitle>Mes performances</CardTitle>
          <CardDescription>
            Consultez vos statistiques individuelles
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>Cette page affichera toutes vos statistiques personnelles, y compris les buts, passes décisives, et autres métriques de performance.</p>
        </CardContent>
      </Card>
    </div>
  );
} 