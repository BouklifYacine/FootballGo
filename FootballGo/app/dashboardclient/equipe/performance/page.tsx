import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function EquipePerformancePage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Performance de l&apos;équipe</h1>
      <Card>
        <CardHeader>
          <CardTitle>Analyse des performances</CardTitle>
          <CardDescription>
            Consultez les statistiques de performance de votre équipe
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>Cette page affichera les données de performance de votre équipe, y compris les tendances, les points forts et les points à améliorer.</p>
        </CardContent>
      </Card>
    </div>
  );
} 