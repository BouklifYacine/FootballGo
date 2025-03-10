import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function StaffPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Gestion du staff</h1>
      <Card>
        <CardHeader>
          <CardTitle>Staff technique</CardTitle>
          <CardDescription>
            Consultez et gérez le staff technique de votre équipe
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>Cette page vous permet de gérer tous les membres du staff technique de votre équipe, y compris les entraîneurs, préparateurs physiques et autres personnels.</p>
        </CardContent>
      </Card>
    </div>
  );
} 