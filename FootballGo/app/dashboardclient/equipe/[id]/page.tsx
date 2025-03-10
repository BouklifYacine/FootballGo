import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { MembreEquipe } from "../../(components)/MembreEquipe";

interface EquipeDetailsPageProps {
  params: {
    id: string;
  };
}

export default async function EquipeDetailsPage({ params }: EquipeDetailsPageProps) {
  const { id } = await params;
  
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Détails de l&apos;équipe</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Informations de l&apos;équipe</CardTitle>
          <CardDescription>
            ID de l&apos;équipe: {id}
          </CardDescription>
        </CardHeader>
        <CardContent>
       
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Membres</CardTitle>
          <CardDescription>
            Liste des membres de l&apos;équipe
          </CardDescription>
        </CardHeader>
        <CardContent>
        <MembreEquipe equipeId={id} />
        </CardContent>
      </Card>
    </div>
  );
}