import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface EquipeDetailsPageProps {
  params: {
    id: string;
  };
}

export default function EquipeDetailsPage({ params }: EquipeDetailsPageProps) {
  const { id } = params;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Détails de l&apos;équipe</h1>
      <Card>
        <CardHeader>
          <CardTitle>Informations de l&apos;équipe</CardTitle>
          <CardDescription>
            ID de l&apos;équipe: {id}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>Cette page affichera les détails complets de l&apos;équipe sélectionnée.</p>
        </CardContent>
      </Card>
    </div>
  );
} 