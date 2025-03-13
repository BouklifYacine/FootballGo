import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/prisma";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import Link from "next/link";
import ListeEvenements from "../(components)/ListeEvenements";

export default async function EvenementsPage({ params }: { params: { id: string } }) {
  const equipeId = await params.id;
  
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }
  
  const membreEquipe = await prisma.membreEquipe.findFirst({
    where: {
      userId: session.user.id,
      equipeId,
    },
    include: {
      equipe: {
        select: {
          nom: true,
        },
      },
    },
  });
  
  if (!membreEquipe) {
    redirect("/dashboardclient");
  }
  
  // Vérifier si l'utilisateur est entraîneur pour afficher le bouton de création
  const estEntraineur = membreEquipe.role === "ENTRAINEUR";
  
  return (
    <div className="container py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Événements de {membreEquipe.equipe.nom}</h1>
          <p className="text-muted-foreground">
            Consultez les événements à venir et passés
          </p>
        </div>
        
        {estEntraineur && (
          <Link href={`/dashboardclient/equipe/${equipeId}/evenements/nouveau`}>
            <Button>
              <PlusIcon className="h-4 w-4 mr-2" />
              Nouvel événement
            </Button>
          </Link>
        )}
      </div>
      
      <ListeEvenements equipeId={equipeId} />
    </div>
  );
}