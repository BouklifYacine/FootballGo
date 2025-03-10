import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function JoueursPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Gestion des joueurs</h1>
      <Card>
        <CardHeader>
          <CardTitle>Joueurs de l&apos;équipe</CardTitle>
          <CardDescription>
            Consultez et gérez les joueurs de votre équipe
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>Cette page vous permet de gérer tous les joueurs de votre équipe, y compris leurs informations personnelles et leurs statistiques.</p>
        </CardContent>
      </Card>
    </div>
  );
} 