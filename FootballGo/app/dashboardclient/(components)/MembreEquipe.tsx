'use client';


import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useMembreEquipe, MembreEquipeType } from "../(hooks)/UseDashboardClient";

interface MembreEquipeProps {
  equipeId: string;
}

export function MembreEquipe({ equipeId }: MembreEquipeProps) {
  const { data, isLoading, isError } = useMembreEquipe(equipeId);
  
  if (isLoading || !data) {
    return (
      <div className="space-y-3">
        <h2 className="text-xl font-semibold">Membres de l'équipe</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(3)].map((_, index) => (
            <Card key={index} className="p-4">
              <div className="flex items-center space-x-3">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-16" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }
  
  if (isError) {
    return (
      <Card className="p-4 bg-red-50">
        <p className="text-red-600">
          Une erreur est survenue lors de la récupération des membres de l'équipe.
        </p>
      </Card>
    );
  }
  

  const { ListeEquipe } = data;
  
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Membres de l'équipe ({ListeEquipe.membres.length})</h2>
      {ListeEquipe.membres.length === 0 ? (
        <Card className="p-4 text-center">
          <p className="text-muted-foreground">Cette équipe n'a pas encore de membres.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {ListeEquipe.membres.map((membre: MembreEquipeType) => (
            <Card key={membre.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${membre.userId}`} />
                    <AvatarFallback>{membre.userId.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">Utilisateur {membre.userId.substring(0, 8)}</p>
                    <Badge variant={membre.role === 'ENTRAINEUR' ? 'destructive' : 'secondary'}>
                      {membre.role}
                    </Badge>
                    {membre.posteJoueur && (
                      <span className="ml-2 text-sm text-muted-foreground">
                        {membre.posteJoueur}
                      </span>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}