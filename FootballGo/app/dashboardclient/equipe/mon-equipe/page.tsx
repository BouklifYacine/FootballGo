// Fichier: /app/dashboardclient/equipe/mon-equipe/page.tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
;

export default async function MonEquipePage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Détails de mon équipe</h1>
      <Card>
        <CardHeader>
          <CardTitle>Informations de l'équipe</CardTitle>
          <CardDescription>
            Détails et membres de votre équipe
          </CardDescription>
        </CardHeader>
        <CardContent>
         
        </CardContent>
      </Card>
    </div>
  );
}