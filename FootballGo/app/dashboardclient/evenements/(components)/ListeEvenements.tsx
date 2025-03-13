"use client";

import { useState } from "react";
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


interface ListeEvenementsProps {
  equipeId: string;
}

export default function ListeEvenements({ equipeId }: ListeEvenementsProps) {
  const [filtres, setFiltres] = useState<FiltreEvenements>({
    type: "TOUS",
  });

  const { data, isLoading, isError, error } = useEvenementsEquipe(equipeId, filtres);


  const handleTypeChange = (value: string) => {
    if (value === "TOUS" || value === "MATCH" || value === "ENTRAINEMENT") {
      setFiltres(prev => ({ ...prev, type: value }));
    }
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
          defaultValue={filtres.type || "TOUS"}
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

      <Tabs defaultValue="a-venir">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="a-venir">À venir ({data?.evenementsAVenir.length || 0})</TabsTrigger>
          <TabsTrigger value="passes">Passés ({data?.evenementsPassés.length || 0})</TabsTrigger>
        </TabsList>

        <TabsContent value="a-venir">
          {data?.evenementsAVenir.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Aucun événement à venir
            </div>
          ) : (
            <div className="space-y-4 mt-4">
              {data?.evenementsAVenir.map((evenement) => (
                <Card key={evenement.id}>
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
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="passes">
          {data?.evenementsPassés.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Aucun événement passé
            </div>
          ) : (
            <div className="space-y-4 mt-4">
              {data?.evenementsPassés.map((evenement) => (
                <Card key={evenement.id} className="opacity-80">
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
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}