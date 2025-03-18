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
import { Button } from "@/components/ui/button";
import { CalendarIcon, MapPinIcon, Trash2, PencilIcon, Loader2, ListPlus } from "lucide-react";
import { useEvenementsEquipe } from "../(hooks)/UseEvenement-Equipe";
import { useDeleteEvenement } from "../(hooks)/UseDeleteEvenement";
import { FiltreEvenements } from "@/app/(schema)/SchemaEvenementv2";
import { Pagination } from "./Pagination";
import { Evenement } from "../(types)/EvenementsResponse";
import Link from "next/link";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import PresenceEvenementForm from "./PresenceEvenementForm";
import { StatutPresence } from "../../(interface-types)/Presence";
import FormulaireStatistiquesJoueur from "../../statistiquesjoueur/(components)/FormulaireStatistiquesJoueur";
import { useSupprimerStatistiqueJoueur } from "../../statistiquesjoueur/(hook)/UseStatistiquejoueur";
import { useSupprimerStatistiqueEquipe } from "../../statistiquesequipe/(hook)/useStatistiqueEquipe";
import FormulaireStatistiquesEquipe from "../../statistiquesequipe/(components)/FormulaireStatistiquesEquipe";

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
  const [evenementASupprimer, setEvenementASupprimer] = useState<string | null>(null);
  const [dialogSuppressionOuvert, setDialogSuppressionOuvert] = useState(false);
  const [dialogSuppressionStatsOuvert, setDialogSuppressionStatsOuvert] = useState(false);
  const [evenementStatsASupprimer, setEvenementStatsASupprimer] = useState<string | null>(null);
  const [evenementAModifier, setEvenementAModifier] = useState<string | null>(null);
  const [dialogModifierStatsOuvert, setDialogModifierStatsOuvert] = useState(false);
  
  // Nouveaux états pour les statistiques d'équipe
  const [dialogAjouterStatsEquipeOuvert, setDialogAjouterStatsEquipeOuvert] = useState(false);
  const [dialogModifierStatsEquipeOuvert, setDialogModifierStatsEquipeOuvert] = useState(false);
  const [dialogSuppressionStatsEquipeOuvert, setDialogSuppressionStatsEquipeOuvert] = useState(false);
  const [evenementStatsEquipe, setEvenementStatsEquipe] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<string>("a-venir");

  const { data, isLoading, isError, error } = useEvenementsEquipe(equipeId, filtres);
  const { deleteEvenement, isPending: isDeletePending } = useDeleteEvenement(equipeId);
  const { mutate: supprimerStats, isPending: isSuppressionStatsPending } = useSupprimerStatistiqueJoueur();
  const { mutate: supprimerStatsEquipe, isPending: isSuppressionStatsEquipePending } = useSupprimerStatistiqueEquipe();

  // Vérifier si la page actuelle est valide par rapport au nombre total de pages
  const totalPages = data?.pagination?.pages || 1;
  
  // Calculer la page courante en tenant compte des limites
  // Si la page demandée dépasse le nombre total de pages, on utilise la page 1
  const currentPage = (data?.pagination && filtres.page > data.pagination.pages && data.pagination.pages > 0) 
    ? 1 
    : (data?.pagination?.page || filtres.page);

  const handleTypeChange = (value: string) => {
    if (value === "TOUS" || value === "MATCH" || value === "ENTRAINEMENT") {
      setFiltres(prev => ({ ...prev, type: value, page: 1 })); // Réinitialiser à la page 1 lors du changement de filtre
    }
  };

  const handlePageChange = (page: number) => {
    // Vérifier que la page est dans les limites valides
    const pageToSet = Math.min(Math.max(1, page), totalPages);
    setFiltres(prev => ({ ...prev, page: pageToSet }));
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    // Réinitialiser à la page 1 lors du changement d'onglet
    setFiltres(prev => ({ ...prev, page: 1 }));
  };

  const handleDeleteEvenement = (evenementId: string) => {
    setEvenementASupprimer(evenementId);
    setDialogSuppressionOuvert(true);
  };

  const confirmDeleteEvenement = () => {
    if (evenementASupprimer) {
      deleteEvenement(evenementASupprimer);
      setDialogSuppressionOuvert(false);
    }
  };

  const handleDeleteStats = (evenementId: string) => {
    setEvenementStatsASupprimer(evenementId);
    setDialogSuppressionStatsOuvert(true);
  };

  const confirmDeleteStats = () => {
    if (evenementStatsASupprimer) {
      supprimerStats(evenementStatsASupprimer);
      setDialogSuppressionStatsOuvert(false);
    }
  };

  const handleModifierStats = (evenementId: string) => {
    setEvenementAModifier(evenementId);
    setDialogModifierStatsOuvert(true);
  };

  // Fonctions pour gérer les statistiques d'équipe
  const handleAjouterStatsEquipe = (evenementId: string) => {
    setEvenementStatsEquipe(evenementId);
    setDialogAjouterStatsEquipeOuvert(true);
  };

  const handleModifierStatsEquipe = (evenementId: string) => {
    setEvenementStatsEquipe(evenementId);
    setDialogModifierStatsEquipeOuvert(true);
  };

  const handleDeleteStatsEquipe = (evenementId: string) => {
    setEvenementStatsEquipe(evenementId);
    setDialogSuppressionStatsEquipeOuvert(true);
  };

  const confirmDeleteStatsEquipe = () => {
    if (evenementStatsEquipe) {
      supprimerStatsEquipe({ evenementId: evenementStatsEquipe, equipeId });
      setDialogSuppressionStatsEquipeOuvert(false);
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
        {evenements.map((evenement) => {
          // Debug pour voir si les statistiques sont correctement récupérées
          console.log("Événement:", evenement.id, "Stats joueur:", evenement.mesStatistiques, "Stats équipe:", evenement.statistiquesEquipe);
          
          return (
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
                  
                  <div className="space-y-2">
                    
                    {evenement.dateDebut >= new Date() ? (
                      <PresenceEvenementForm 
                        evenementId={evenement.id} 
                        statutActuel={evenement.maPresence?.statut as StatutPresence | undefined} 
                      />
                    ) : (
                      <div className="flex items-center">
                        {getPresenceStatut(evenement.maPresence?.statut)}
                      </div>
                    )}

                    <div className="mt-2 flex justify-end space-x-2">
                      {/* Boutons pour les statistiques d'équipe (seulement pour les entraîneurs) */}
                      {evenement.typeEvenement === "MATCH" && 
                       estEntraineur && 
                       evenement.maPresence?.statut === "PRESENT" && (
                        <>
                          {!evenement.statistiquesEquipe ? (
                            // Bouton pour ajouter des statistiques d'équipe
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-green-600 border-green-600 hover:bg-green-50 hover:text-green-700"
                              onClick={() => handleAjouterStatsEquipe(evenement.id)}
                            >
                              <ListPlus className="h-4 w-4 mr-1" />
                              Ajouter stats équipe
                            </Button>
                          ) : (
                            // Boutons pour modifier et supprimer les statistiques d'équipe
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-blue-600 border-blue-600 hover:bg-blue-50 hover:text-blue-700"
                                onClick={() => handleModifierStatsEquipe(evenement.id)}
                              >
                                <PencilIcon className="h-4 w-4 mr-1" />
                                Modifier stats équipe
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-red-600 border-red-600 hover:bg-red-50 hover:text-red-700"
                                onClick={() => handleDeleteStatsEquipe(evenement.id)}
                                disabled={isSuppressionStatsEquipePending}
                              >
                                {isSuppressionStatsEquipePending && evenementStatsEquipe === evenement.id ? (
                                  <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                                ) : (
                                  <Trash2 className="h-4 w-4 mr-1" />
                                )}
                                Supprimer stats équipe
                              </Button>
                            </>
                          )}
                        </>
                      )}

                      {/* Bouton pour ajouter des statistiques (seulement pour les joueurs, pas les entraîneurs) */}
                      {evenement.typeEvenement === "MATCH" && 
                       evenement.maPresence?.statut === "PRESENT" &&
                       !estEntraineur && 
                       !evenement.mesStatistiques && (
                        <FormulaireStatistiquesJoueur evenementId={evenement.id} />
                      )}

                      {/* Boutons pour modifier et supprimer les statistiques (seulement pour les joueurs avec des stats) */}
                      {evenement.typeEvenement === "MATCH" && 
                       evenement.maPresence?.statut === "PRESENT" &&
                       !estEntraineur && 
                       evenement.mesStatistiques && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-blue-600 border-blue-600 hover:bg-blue-50 hover:text-blue-700"
                            onClick={() => handleModifierStats(evenement.id)}
                          >
                            <PencilIcon className="h-4 w-4 mr-1" />
                            Modifier stats
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-600 border-red-600 hover:bg-red-50 hover:text-red-700"
                            onClick={() => handleDeleteStats(evenement.id)}
                            disabled={isSuppressionStatsPending}
                          >
                            {isSuppressionStatsPending && evenementStatsASupprimer === evenement.id ? (
                              <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4 mr-1" />
                            )}
                            Supprimer stats
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                  
                  {estEntraineur && (
                    <>
                      <Separator className="my-2" />
                      <div className="flex justify-end space-x-2">
                        <Link 
                          href={`/dashboardclient/equipe/${equipeId}/evenements/${evenement.id}/modifier`}
                        >
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="text-blue-600 border-blue-600 hover:bg-blue-50 hover:text-blue-700"
                          >
                            <PencilIcon className="h-4 w-4 mr-1" />
                            Modifier
                          </Button>
                        </Link>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-600 border-red-600 hover:bg-red-50 hover:text-red-700"
                          onClick={() => handleDeleteEvenement(evenement.id)}
                          disabled={isDeletePending}
                        >
                          {isDeletePending && evenementASupprimer === evenement.id ? (
                            <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4 mr-1" />
                          )}
                          Supprimer
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
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
    <>
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

      {/* Dialog de suppression d'événement */}
      <AlertDialog open={dialogSuppressionOuvert} onOpenChange={setDialogSuppressionOuvert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr de vouloir supprimer cet événement ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. Toutes les données associées à cet événement (présences, statistiques) seront également supprimées.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteEvenement}
              className="bg-red-600 hover:bg-red-700 text-white flex items-center"
              disabled={isDeletePending}
            >
              {isDeletePending ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4 mr-2" />
              )}
              Supprimer définitivement
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Dialog de suppression des statistiques joueur */}
      <AlertDialog open={dialogSuppressionStatsOuvert} onOpenChange={setDialogSuppressionStatsOuvert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr de vouloir supprimer vos statistiques ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. Vous pourrez ajouter de nouvelles statistiques après la suppression.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteStats}
              className="bg-red-600 hover:bg-red-700 text-white flex items-center"
              disabled={isSuppressionStatsPending}
            >
              {isSuppressionStatsPending ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4 mr-2" />
              )}
              Supprimer définitivement
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Dialog de modification des statistiques joueur */}
      <AlertDialog open={dialogModifierStatsOuvert} onOpenChange={setDialogModifierStatsOuvert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Modifier vos statistiques</AlertDialogTitle>
          </AlertDialogHeader>
          <div className="py-4">
            {evenementAModifier && <FormulaireStatistiquesJoueur 
              evenementId={evenementAModifier} 
              isModification={true}
              onSubmitSuccess={() => setDialogModifierStatsOuvert(false)}
            />}
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Dialog d'ajout des statistiques équipe */}
      <AlertDialog open={dialogAjouterStatsEquipeOuvert} onOpenChange={setDialogAjouterStatsEquipeOuvert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Ajouter les statistiques de l&apos;équipe</AlertDialogTitle>
          </AlertDialogHeader>
          <div className="py-4">
            {evenementStatsEquipe && <FormulaireStatistiquesEquipe 
              evenementId={evenementStatsEquipe}
              equipeId={equipeId} 
              onSubmitSuccess={() => setDialogAjouterStatsEquipeOuvert(false)}
            />}
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Dialog de modification des statistiques équipe */}
      <AlertDialog open={dialogModifierStatsEquipeOuvert} onOpenChange={setDialogModifierStatsEquipeOuvert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Modifier les statistiques de l&apos;équipe</AlertDialogTitle>
          </AlertDialogHeader>
          <div className="py-4">
            {evenementStatsEquipe && <FormulaireStatistiquesEquipe 
              evenementId={evenementStatsEquipe}
              equipeId={equipeId} 
              isModification={true}
              onSubmitSuccess={() => setDialogModifierStatsEquipeOuvert(false)}
            />}
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Dialog de suppression des statistiques équipe */}
      <AlertDialog open={dialogSuppressionStatsEquipeOuvert} onOpenChange={setDialogSuppressionStatsEquipeOuvert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr de vouloir supprimer les statistiques de l&apos;équipe ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. Vous pourrez ajouter de nouvelles statistiques après la suppression.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteStatsEquipe}
              className="bg-red-600 hover:bg-red-700 text-white flex items-center"
              disabled={isSuppressionStatsEquipePending}
            >
              {isSuppressionStatsEquipePending ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4 mr-2" />
              )}
              Supprimer définitivement
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}