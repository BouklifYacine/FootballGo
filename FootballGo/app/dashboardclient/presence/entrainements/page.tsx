import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function PresenceEntrainementsPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Présences aux entraînements</h1>
      <Card>
        <CardHeader>
          <CardTitle>Suivi des présences aux entraînements</CardTitle>
          <CardDescription>
            Consultez et gérez les présences aux séances d&apos;entraînement
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>Cette page vous permet de suivre les présences des membres de votre équipe aux différentes séances d&apos;entraînement.</p>
        </CardContent>
      </Card>
    </div>
  );
} 