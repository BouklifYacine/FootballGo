import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function EntrainementsPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Entraînements à venir</h1>
      <Card>
        <CardHeader>
          <CardTitle>Calendrier des entraînements</CardTitle>
          <CardDescription>
            Consultez tous vos entraînements programmés
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>Cette page affichera la liste de tous vos entraînements à venir avec leurs détails.</p>
        </CardContent>
      </Card>
    </div>
  );
} 