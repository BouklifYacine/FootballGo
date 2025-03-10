import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function StatistiquesPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Statistiques</h1>
      <Card>
        <CardHeader>
          <CardTitle>Vue d&apos;ensemble des statistiques</CardTitle>
          <CardDescription>
            Consultez les statistiques personnelles et d&apos;équipe
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>Cette page vous donne accès à toutes les statistiques disponibles pour vous et votre équipe.</p>
        </CardContent>
      </Card>
    </div>
  );
} 