import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function PresencePage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Gestion des présences</h1>
      <Card>
        <CardHeader>
          <CardTitle>Suivi des présences</CardTitle>
          <CardDescription>
            Consultez et gérez les présences aux événements
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>Cette page vous permet de suivre les présences des membres de votre équipe aux différents événements (entraînements et matchs).</p>
        </CardContent>
      </Card>
    </div>
  );
} 