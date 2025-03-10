import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function MembresPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Gestion des membres</h1>
      <Card>
        <CardHeader>
          <CardTitle>Membres de l&apos;équipe</CardTitle>
          <CardDescription>
            Consultez et gérez les membres de votre équipe
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>Cette page vous permet de gérer tous les membres de votre équipe, y compris les joueurs et le staff technique.</p>
        </CardContent>
      </Card>
    </div>
  );
} 