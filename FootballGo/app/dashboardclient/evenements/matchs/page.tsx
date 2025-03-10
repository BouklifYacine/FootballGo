import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function MatchsPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Matchs à venir</h1>
      <Card>
        <CardHeader>
          <CardTitle>Calendrier des matchs</CardTitle>
          <CardDescription>
            Consultez tous vos matchs programmés
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>Cette page affichera la liste de tous vos matchs à venir avec leurs détails.</p>
        </CardContent>
      </Card>
    </div>
  );
} 