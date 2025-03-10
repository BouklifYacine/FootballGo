import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function EvenementsPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Événements</h1>
      <Card>
        <CardHeader>
          <CardTitle>Calendrier des événements</CardTitle>
          <CardDescription>
            Consultez vos matchs et entraînements à venir
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>Bienvenue sur la page des événements. Ici vous pourrez voir tous vos événements à venir et passés.</p>
        </CardContent>
      </Card>
    </div>
  );
} 