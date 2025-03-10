import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function EquipePage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Gestion des équipes</h1>
      <Card>
        <CardHeader>
          <CardTitle>Mes équipes</CardTitle>
          <CardDescription>
            Consultez et gérez vos équipes de football
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>Bienvenue sur la page de gestion des équipes. Ici vous pourrez voir la liste de vos équipes et accéder à leurs détails.</p>
        </CardContent>
      </Card>
    </div>
  );
} 