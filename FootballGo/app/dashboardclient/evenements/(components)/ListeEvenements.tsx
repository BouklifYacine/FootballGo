"use client";

import { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, MapPinIcon } from "lucide-react";
import { useEvenementsEquipe } from "../(hooks)/UseEvenement-Equipe";
import { FiltreEvenements } from "@/app/(schema)/SchemaEvenementv2";
import { Pagination } from "./Pagination";
import { Evenement } from "../(types)/EvenementsResponse";
import Link from "next/link";

interface ListeEvenementsProps {
  equipeId: string;
  estEntraineur?: boolean;
}

export default function ListeEvenements({ equipeId, estEntraineur = false }: ListeEvenementsProps) {
  const [filtres, setFiltres] = useState<FiltreEvenements>({
    type: "TOUS",
    page: 1,
    limit: 5
  });

  const [activeTab, setActiveTab] = useState<string>("a-venir");

  const { data, isLoading, isError, error } = useEvenementsEquipe(equipeId, filtres);

  // Vérifier si la page actuelle est valide par rapport au nombre total de pages
  const totalPages = data?.pagination?.pages || 1;
  
  // Calculer la page courante sans modifier l'état directement
  const safePageNumber = (data?.pagination && filtres.page > data.pagination.pages && data.pagination.pages > 0) 
    ? 1 
    : filtres.page;
  
  // Utiliser la page calculée pour l'affichage
  const currentPage = data?.pagination?.page || safePageNumber;

  // Ajuster la page si nécessaire via un callback
  const adjustPageIfNeeded = useCallback(() => {
    if (data?.pagination && filtres.page > data.pagination.pages && data.pagination.pages > 0 && !isLoading) {
      setFiltres(prev => ({ ...prev, page: 1 }));
    }
  }, [data?.pagination, filtres.page, isLoading]);

  // Appeler le callback après le rendu si nécessaire
  if (safePageNumber !== filtres.page) {
    // Utiliser setTimeout pour éviter la mise à jour pendant le rendu
    setTimeout(adjustPageIfNeeded, 0);
  }

  const handleTypeChange = (value: string) => {
    if (value === "TOUS" || value === "MATCH" || value === "ENTRAINEMENT") {
      setFiltres(prev => ({ ...prev, type: value, page: 1 })); // Réinitialiser à la page 1 lors du changement de filtre
    }
  };

  const handlePageChange = (page: number) => {
    setFiltres(prev => ({ ...prev, page }));
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    // Réinitialiser à la page 1 lors du changement d'onglet
    setFiltres(prev => ({ ...prev, page: 1 }));
  };

  const getPresenceStatut = (statut: string | undefined) => {
    switch (statut) {
      case "PRESENT":
        return <Badge className="bg-green-500">Présent</Badge>;
      case "ABSENT":
        return <Badge className="bg-red-500">Absent</Badge>;
      case "INCERTAIN":
        return <Badge className="bg-yellow-500">Incertain</Badge>;
      default:
        return <Badge className="bg-gray-400">Non renseigné</Badge>;
    }
  };

  // Fonction pour afficher le type d'événement
  const getTypeEvenement = (type: string) => {
    switch (type) {
      case "MATCH":
        return <Badge className="bg-blue-500">Match</Badge>;
      case "ENTRAINEMENT":
        return <Badge className="bg-purple-500">Entraînement</Badge>;
      default:
        return <Badge>Autre</Badge>;
    }
  };

  // Fonction pour rendre la liste des événements
  const renderEvenements = (evenements: Evenement[]) => {
    if (evenements.length === 0) {
      return (
        <div className="text-center py-8 text-gray-500">
          Aucun événement à afficher
        </div>
      );
    }

    return (
      <div className="space-y-4 mt-4">
        {evenements.map((evenement) => (
          <Card key={evenement.id} className={evenement.dateDebut < new Date() ? "opacity-80" : ""}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle>{evenement.titre}</CardTitle>
                {getTypeEvenement(evenement.typeEvenement)}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center text-gray-500">
                  <CalendarIcon size={16} className="mr-2" />
                  <span>{evenement.dateDebutFormatee}</span>
                </div>
                
                {evenement.lieu && (
                  <div className="flex items-center text-gray-500">
                    <MapPinIcon size={16} className="mr-2" />
                    <span>{evenement.lieu}</span>
                  </div>
                )}
                
                {evenement.description && (
                  <>
                    <Separator />
                    <p className="text-sm">{evenement.description}</p>
                  </>
                )}
                
                <Separator />
                
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Ma présence:</span>
                  {getPresenceStatut(evenement.maPresence?.statut)}
                </div>
                
                {estEntraineur && (
                  <>
                    <Separator />
                    <div className="flex justify-end space-x-2">
                      <Link 
                        href={`/dashboardclient/equipe/${equipeId}/evenements/${evenement.id}/modifier`}
                        className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                      >
                        Modifier
                      </Link>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  if (isLoading) {
    return <div className="text-center py-8">Chargement des événements...</div>;
  }

  if (isError) {
    return (
      <div className="text-center py-8 text-red-500">
        Erreur: {error instanceof Error ? error.message : "Une erreur est survenue"}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Événements</h2>
        <Select 
          value={filtres.type}
          onValueChange={handleTypeChange}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Type d'événement" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="TOUS">Tous</SelectItem>
            <SelectItem value="MATCH">Matchs</SelectItem>
            <SelectItem value="ENTRAINEMENT">Entraînements</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="a-venir" value={activeTab} onValueChange={handleTabChange}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="a-venir">À venir ({data?.evenementsAVenir.length || 0})</TabsTrigger>
          <TabsTrigger value="passes">Passés ({data?.evenementsPassés.length || 0})</TabsTrigger>
        </TabsList>

        <TabsContent value="a-venir">
          {renderEvenements(data?.evenementsAVenir || [])}
        </TabsContent>

        <TabsContent value="passes">
          {renderEvenements(data?.evenementsPassés || [])}
        </TabsContent>
      </Tabs>

      {data?.pagination && (
        <Pagination 
          currentPage={currentPage} 
          totalPages={totalPages} 
          onPageChange={handlePageChange} 
        />
      )}
    </div>
  );
}