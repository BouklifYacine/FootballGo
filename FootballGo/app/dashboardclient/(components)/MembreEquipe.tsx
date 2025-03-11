"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  useMembreEquipe,
  MembreEquipe as MembreequipeType,
} from "../(hooks)/UseDashboardClient";

interface MembreEquipeProps {
  equipeId: string;
}

export function MembreEquipe({ equipeId }: MembreEquipeProps) {
  const { data, isLoading, isError } = useMembreEquipe(equipeId);

  if (isLoading || !data) {
    return (
      <div className="space-y-3">
        <h2 className="text-xl font-semibold">Membres de l'équipe</h2>
        <Card className="p-4">
          <Skeleton className="h-64 w-full" />
        </Card>
      </div>
    );
  }

  if (isError) {
    return (
      <Card className="p-4 bg-red-50">
        <p className="text-red-600">
          Une erreur est survenue lors de la récupération des membres de
          l'équipe.
        </p>
      </Card>
    );
  }

  const { ListeEquipe } = data;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">
        Membres de l'équipe ({ListeEquipe.membres.length})
      </h2>
      {ListeEquipe.membres.length === 0 ? (
        <Card className="p-4 text-center">
          <p className="text-muted-foreground">
            Cette équipe n'a pas encore de membres.
          </p>
        </Card>
      ) : (
        <Card className="rounded-md border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-bold text-black">Avatar</TableHead>
                <TableHead className="font-bold text-black">Pseudo</TableHead>
                <TableHead className="font-bold text-black">Rôle</TableHead>
                <TableHead className="font-bold text-black">Poste</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ListeEquipe.membres.map((membre: MembreequipeType) => (
                <TableRow key={membre.id}>
                  <TableCell>
                    <Avatar>
                      {/* Utiliser l'image réelle du profil si disponible */}
                      <AvatarImage
                        src={membre.user?.image || `https://api.dicebear.com/7.x/initials/svg?seed=${membre.user?.name || membre.userId}`}
                      />
                      <AvatarFallback>
                        {membre.user?.name?.[0]?.toUpperCase() || membre.userId.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </TableCell>
                  <TableCell className="font-medium">
                    {membre.user?.name || `Utilisateur ${membre.userId.substring(0, 8)}`}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        membre.role === "ENTRAINEUR"
                          ? "destructive"
                          : "secondary"
                      }
                    >
                      {membre.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground">
                      {membre.posteJoueur ? membre.posteJoueur : "Aucun poste"}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}
    </div>
  );
}