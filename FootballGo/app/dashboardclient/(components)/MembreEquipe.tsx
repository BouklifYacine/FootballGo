"use client";

import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Search, Users, Filter, Trophy, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  useMembreEquipe,
  MembreEquipe as MembreequipeType,
  useModifierRoleEtPoste,
  useSupprimerMembreDEquipe,
} from "../(hooks)/UseDashboardClient";
import { BoutonModifierEquipe } from "./ModifierEquipe";
import { BoutonSupprimerEquipe } from "./BoutonSuppressionClub";
import { GestionCodeInvitation } from "./GestionCodeInvitation";
import { BoutonQuitterEquipe } from "./BoutonQuitterEquipe";

interface MembreEquipeProps {
  equipeId: string;
}

export function MembreEquipe({ equipeId }: MembreEquipeProps) {
  const { data, isLoading, isError } = useMembreEquipe(equipeId);
  const [rechercheNom, setRechercheNom] = useState("");
  const [filtreRole, setFiltreRole] = useState("TOUS");
  const [filtrePoste, setFiltrePoste] = useState("TOUS");

  if (isLoading || !data) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-1/3" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-5 w-1/4 mb-6" />
            <Skeleton className="h-64 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isError) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardHeader>
          <CardTitle className="text-red-700">Erreur</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-600">
            Une erreur est survenue lors de la récupération des données de
            l'équipe.
          </p>
        </CardContent>
      </Card>
    );
  }

  const { ListeEquipe } = data;

  const userId = data.userId;
  const membreConnecte = ListeEquipe.membres.find(
    (membre) => membre.userId === userId
  );
  const estEntraineur = membreConnecte?.role === "ENTRAINEUR";

  const membresFiltres = ListeEquipe.membres.filter(
    (membre: MembreequipeType) => {
      const correspondanceNom = membre.user?.name
        ? membre.user.name.toLowerCase().includes(rechercheNom.toLowerCase())
        : false;

      const correspondanceRole =
        filtreRole === "TOUS" || membre.role === filtreRole;

      const correspondancePoste =
        filtrePoste === "TOUS" ||
        (filtrePoste === "AUCUN" && !membre.posteJoueur) ||
        membre.posteJoueur === filtrePoste;

      return (
        (rechercheNom === "" || correspondanceNom) &&
        correspondanceRole &&
        correspondancePoste
      );
    }
  );

  const nombreEntraineurs = ListeEquipe.membres.filter(
    (m) => m.role === "ENTRAINEUR"
  ).length;
  const nombreJoueurs = ListeEquipe.membres.filter(
    (m) => m.role === "JOUEUR"
  ).length;

  const MembreActions = ({ membre }: { membre: MembreequipeType }) => {
    const modifierRoleMutation = useModifierRoleEtPoste(equipeId);
    const supprimerMembreMutation = useSupprimerMembreDEquipe(equipeId);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const estMembreConnecte = membre.userId === userId;

    if (!estEntraineur) return null;

    return (
      <div className="flex items-center space-x-2">
        <Select
          value={membre.role}
          onValueChange={(role: "ENTRAINEUR" | "JOUEUR") => {
            modifierRoleMutation.mutate({
              membreId: membre.userId,
              role,
              posteJoueur:
                role === "JOUEUR" ? membre.posteJoueur || undefined : undefined,
            });
          }}
        >
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Rôle" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ENTRAINEUR">Entraineur</SelectItem>
            <SelectItem value="JOUEUR">Joueur</SelectItem>
          </SelectContent>
        </Select>

        {membre.role === "JOUEUR" && (
          <Select
            value={membre.posteJoueur || ""}
            onValueChange={(
              poste: "GARDIEN" | "DEFENSEUR" | "MILIEU" | "ATTAQUANT"
            ) => {
              modifierRoleMutation.mutate({
                membreId: membre.userId,
                role: "JOUEUR",
                posteJoueur: poste,
              });
            }}
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Poste" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="GARDIEN">Gardien</SelectItem>
              <SelectItem value="DEFENSEUR">Défenseur</SelectItem>
              <SelectItem value="MILIEU">Milieu</SelectItem>
              <SelectItem value="ATTAQUANT">Attaquant</SelectItem>
            </SelectContent>
          </Select>
        )}

        {!estMembreConnecte && (
          <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <AlertDialogTrigger asChild>
              <Button size="icon" variant="destructive">
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
                <AlertDialogDescription>
                  Cette action supprimera {membre.user?.name || "ce membre"} de
                  l'équipe.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Annuler</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => {
                    supprimerMembreMutation.mutate(membre.userId);
                    setIsDialogOpen(false);
                  }}
                >
                  Supprimer
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden border-t-4 border-t-primary">
        <CardHeader className="bg-muted/30 pb-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              {ListeEquipe.logoUrl ? (
                <Avatar className="h-12 w-12 border-2 border-primary/20">
                  <AvatarImage
                    src={ListeEquipe.logoUrl}
                    alt={ListeEquipe.nom}
                  />
                  <AvatarFallback className="bg-primary/10 text-primary font-bold">
                    {ListeEquipe.nom.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              ) : (
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Trophy className="h-6 w-6 text-primary" />
                </div>
              )}
              <div>
                <CardTitle className="text-2xl">{ListeEquipe.nom}</CardTitle>
                {ListeEquipe.description && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {ListeEquipe.description}
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              {estEntraineur && (
                <>
                  <BoutonModifierEquipe
                    equipeId={equipeId}
                    equipe={ListeEquipe}
                  />
                  <BoutonSupprimerEquipe
                    equipeId={equipeId}
                    nomEquipe={ListeEquipe.nom}
                  />
                  <GestionCodeInvitation
                    equipeId={equipeId}
                    codeInvitation={ListeEquipe.codeInvitation}
                    estEntraineur={estEntraineur}
                  />
                </>
              )}
              <>
                <BoutonQuitterEquipe
                  equipeId={equipeId}
                  nomEquipe={ListeEquipe.nom}
                />
              </>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-blue-50 border-blue-100">
              <CardContent className="p-4 flex items-center gap-3">
                <Users className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="text-sm font-medium text-blue-700">
                    Total Membres
                  </p>
                  <p className="text-2xl font-bold text-blue-800">
                    {ListeEquipe.membres.length}
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-red-50 border-red-100">
              <CardContent className="p-4 flex items-center gap-3">
                <Trophy className="h-5 w-5 text-red-500" />
                <div>
                  <p className="text-sm font-medium text-red-700">
                    Entraineurs
                  </p>
                  <p className="text-2xl font-bold text-red-800">
                    {nombreEntraineurs}
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-green-50 border-green-100">
              <CardContent className="p-4 flex items-center gap-3">
                <Users className="h-5 w-5 text-green-500" />
                <div>
                  <p className="text-sm font-medium text-green-700">Joueurs</p>
                  <p className="text-2xl font-bold text-green-800">
                    {nombreJoueurs}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              <span>Membres de l'équipe</span>
              <Badge variant="outline" className="ml-2">
                {ListeEquipe.membres.length}
              </Badge>
            </CardTitle>

            <div className="flex items-center space-x-2">
              <div className="relative w-44">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher un membre..."
                  value={rechercheNom}
                  onChange={(e) => setRechercheNom(e.target.value)}
                  className="pl-8 h-9 text-sm"
                />
              </div>

              <Select value={filtreRole} onValueChange={setFiltreRole}>
                <SelectTrigger className="w-32 h-9 text-sm">
                  <SelectValue placeholder="Rôle" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="TOUS">Tous les rôles</SelectItem>
                  <SelectItem value="ENTRAINEUR">Entraineur</SelectItem>
                  <SelectItem value="JOUEUR">Joueur</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filtrePoste} onValueChange={setFiltrePoste}>
                <SelectTrigger className="w-36 h-9 text-sm">
                  <div className="flex items-center">
                    <Filter className="mr-2 h-3.5 w-3.5 text-muted-foreground" />
                    <SelectValue placeholder="Poste" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="TOUS">Tous les postes</SelectItem>
                  <SelectItem value="GARDIEN">Gardien</SelectItem>
                  <SelectItem value="DEFENSEUR">Défenseur</SelectItem>
                  <SelectItem value="MILIEU">Milieu</SelectItem>
                  <SelectItem value="ATTAQUANT">Attaquant</SelectItem>
                  <SelectItem value="AUCUN">Sans poste</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {ListeEquipe.membres.length === 0 ? (
            <div className="text-center py-8 bg-muted/20 rounded-lg">
              <Users className="mx-auto h-12 w-12 text-muted-foreground" />
              <p className="mt-2 text-muted-foreground font-medium">
                Cette équipe n'a pas encore de membres.
              </p>
            </div>
          ) : membresFiltres.length === 0 ? (
            <div className="text-center py-8 bg-muted/20 rounded-lg">
              <Filter className="mx-auto h-12 w-12 text-muted-foreground" />
              <p className="mt-2 text-muted-foreground font-medium">
                Aucun membre ne correspond aux critères de filtrage.
              </p>
            </div>
          ) : (
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader className="bg-muted/30">
                  <TableRow>
                    <TableHead className="font-bold">Avatar</TableHead>
                    <TableHead className="font-bold">Nom</TableHead>
                    <TableHead className="font-bold">Rôle</TableHead>
                    <TableHead className="font-bold">Poste</TableHead>
                    {estEntraineur && (
                      <TableHead className="font-bold">Actions</TableHead>
                    )}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {membresFiltres.map((membre: MembreequipeType) => (
                    <TableRow
                      key={membre.id}
                      className="hover:bg-muted/10 transition-colors"
                    >
                      <TableCell>
                        <Avatar className="h-10 w-10 border border-muted">
                          <AvatarImage
                            src={
                              membre.user?.image ||
                              `https://api.dicebear.com/7.x/initials/svg?seed=${membre.user?.name || membre.userId}`
                            }
                          />
                          <AvatarFallback className="bg-primary/10 text-primary">
                            {membre.user?.name?.[0]?.toUpperCase() ||
                              membre.userId.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                      </TableCell>
                      <TableCell className="font-medium">
                        {membre.user?.name ||
                          `Utilisateur ${membre.userId.substring(0, 8)}`}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            membre.role === "ENTRAINEUR"
                              ? "destructive"
                              : "secondary"
                          }
                          className={
                            membre.role === "ENTRAINEUR"
                              ? "bg-red-100 text-red-800 hover:bg-red-200"
                              : ""
                          }
                        >
                          {membre.role}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {membre.posteJoueur ? (
                          <Badge
                            variant="outline"
                            className="bg-muted/30 font-normal"
                          >
                            {membre.posteJoueur}
                          </Badge>
                        ) : (
                          <span className="text-sm text-muted-foreground">
                            Aucun poste
                          </span>
                        )}
                      </TableCell>
                      {estEntraineur && (
                        <TableCell>
                          <MembreActions membre={membre} />
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
