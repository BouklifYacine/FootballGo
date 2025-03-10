import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function StatistiquesEquipesPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Statistiques d&apos;équipe</h1>
      <Card>
        <CardHeader>
          <CardTitle>Performance de l&apos;équipe</CardTitle>
          <CardDescription>
            Consultez les statistiques collectives de votre équipe
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>Cette page affichera toutes les statistiques de votre équipe, y compris les résultats des matchs, les buts marqués/encaissés, et d&apos;autres métriques de performance collective.</p>
        </CardContent>
      </Card>
    </div>
  );
} 