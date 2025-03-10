import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { MembreEquipe } from "../../(components)/MembreEquipe";

interface EquipeDetailsPageProps {
  params: {
    id: string;
  };
}

export default function EquipeDetailsPage({ params }: EquipeDetailsPageProps) {
  const { id } = params;
  
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
          {/* Ici vous pourriez ajouter des informations supplémentaires sur l'équipe */}
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
          <Suspense fallback={
            <div className="space-y-3">
              {[...Array(3)].map((_, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                </div>
              ))}
            </div>
          }>
            <MembreEquipe equipeId={id} />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}