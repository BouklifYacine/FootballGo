"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
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
  useMembreEquipe,
  MembreEquipe as MembreequipeType,
} from "../(hooks)/UseDashboardClient";

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
  
  // Filtrer les membres selon les critères
  const membresFiltres = ListeEquipe.membres.filter((membre: MembreequipeType) => {
    // Filtre par nom/pseudo uniquement
    const correspondanceNom = membre.user?.name
      ? membre.user.name.toLowerCase().includes(rechercheNom.toLowerCase())
      : false;
    
    // Filtre par rôle
    const correspondanceRole = filtreRole === "TOUS" || membre.role === filtreRole;
    
    // Filtre par poste
    const correspondancePoste = 
      filtrePoste === "TOUS" || 
      (filtrePoste === "AUCUN" && !membre.posteJoueur) ||
      membre.posteJoueur === filtrePoste;
    
    return (rechercheNom === "" || correspondanceNom) && correspondanceRole && correspondancePoste;
  });

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">
          Membres de l'équipe ({ListeEquipe.membres.length})
        </h2>
        
        {/* Filtres alignés à droite */}
        <div className="flex items-center space-x-2">
          <div className="relative w-44">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher..."
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
              <SelectValue placeholder="Poste" />
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
      
      {ListeEquipe.membres.length === 0 ? (
        <Card className="p-4 text-center">
          <p className="text-muted-foreground">
            Cette équipe n'a pas encore de membres.
          </p>
        </Card>
      ) : membresFiltres.length === 0 ? (
        <Card className="p-4 text-center">
          <p className="text-muted-foreground">
            Aucun membre ne correspond aux critères de filtrage.
          </p>
        </Card>
      ) : (
        <Card className="rounded-md border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-bold text-black">Avatar</TableHead>
                <TableHead className="font-bold text-black">Nom</TableHead>
                <TableHead className="font-bold text-black">Rôle</TableHead>
                <TableHead className="font-bold text-black">Poste</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {membresFiltres.map((membre: MembreequipeType) => (
                <TableRow key={membre.id}>
                  <TableCell>
                    <Avatar>
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