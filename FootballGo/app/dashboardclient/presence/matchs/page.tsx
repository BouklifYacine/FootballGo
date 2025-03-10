import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function PresenceMatchsPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Présences aux matchs</h1>
      <Card>
        <CardHeader>
          <CardTitle>Suivi des présences aux matchs</CardTitle>
          <CardDescription>
            Consultez et gérez les présences aux matchs de l&apos;équipe
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>Cette page vous permet de suivre les présences des membres de votre équipe aux différents matchs programmés.</p>
        </CardContent>
      </Card>
    </div>
  );
} 