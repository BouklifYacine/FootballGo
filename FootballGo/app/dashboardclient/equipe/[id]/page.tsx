

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ClassementEquipe from "../../components/ClassementEquipes";
import { useClassementEquipe } from "../../(hooks)/UseDashboardClient";
import TestEquipe from "../../components/testequipe";

interface EquipeDetailsPageProps {
  params: {
    id: string;
  };
}

export default async function EquipeDetailsPage({ params }: EquipeDetailsPageProps) {
  const { id } = await params;
  

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Détails de l&apos;équipe</h1>
      <Card>
        <CardHeader>
          <CardTitle>Informations de l&apos;équipe</CardTitle>
          <CardDescription>
            ID de l&apos;équipe de ZEMEL: {id}
          </CardDescription>
        </CardHeader>
        <CardContent>
        <TestEquipe></TestEquipe>
        </CardContent>
      </Card>
    </div>
  );
} 