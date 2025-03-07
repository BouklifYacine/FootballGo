"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Award, Goal } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useStatsJoueurs } from "../(hooks)/UseDashboardClient";
import Image from "next/image";
import {
  JoueurAvecStats,
  StatsJoueur,
  StatsResponse,
} from "../(interface-types)/StatsJoueur";

export default function ClientStats() {
  const { data, isLoading, error } = useStatsJoueurs();
  const statsData = data as StatsResponse | undefined;

  const ClassementTable = ({joueurs,titre,statKey}: { joueurs: JoueurAvecStats[] | undefined; titre: string;  statKey: keyof StatsJoueur;}) => {
    if (!joueurs || joueurs.length === 0) {
      return (
        <div className="text-center p-4">
          <p>Aucune donnée disponible</p>
        </div>
      );
    }

    return (
      <div className="rounded-md border">
        <div className="bg-muted/50 p-2 font-medium">{titre}</div>
        <table className="w-full">
          <thead className="bg-muted/20">
            <tr className="text-xs">
              <th className="p-2 text-left">Rang</th>
              <th className="p-2 text-left">Joueur</th>
              <th className="p-2 text-center">Équipe</th>
              <th className="p-2 text-right">
                {titre.includes("Note")
                  ? "Note"
                  : titre.includes("But")
                    ? "Buts"
                    : titre.includes("Passe")
                      ? "Passes"
                      : "G+A"}
              </th>
            </tr>
          </thead>
          <tbody>
            {joueurs.map((joueur, index) => (
              <tr key={joueur.joueur.id} className="border-t hover:bg-muted/20">
                <td className="p-2 text-sm text-left">{index + 1}</td>
                <td className="p-2 text-sm text-left">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage
                        src={joueur.joueur.image || undefined}
                        alt={joueur.joueur.nom}
                      />
                      <AvatarFallback>
                        {joueur.joueur.nom.substring(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <span>{joueur.joueur.nom}</span>
                  </div>
                </td>
                <td className="p-2 text-sm text-center">
                  {joueur.equipe ? (
                    <div className="flex items-center justify-center">
                      {joueur.equipe.logoUrl ? (
                        <Image
                          src={joueur.equipe.logoUrl}
                          alt={joueur.equipe.nom}
                          className="h-5 w-5"
                        ></Image>
                      ) : (
                        <div className="h-5 w-5 rounded-full bg-muted flex items-center justify-center text-xs">
                          {joueur.equipe.nom.substring(0, 1)}
                        </div>
                      )}
                    </div>
                  ) : (
                    <span className="text-xs text-muted-foreground">-</span>
                  )}
                </td>
                <td className="p-2 text-sm font-medium text-right">
                  {statKey === "noteMoyenne"
                    ? joueur.stats[statKey].toFixed(1)
                    : joueur.stats[statKey]}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <>
      {/* 3 cartes en flexbox */}
      <div className="flex flex-wrap gap-4 md:flex-nowrap">
        <Card className="w-full">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Joueurs</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold">
                {statsData?.totalJoueurs || 0}
              </div>
            )}
            <p className="text-xs text-muted-foreground">
              Joueurs avec statistiques
            </p>
          </CardContent>
        </Card>

        <Card className="w-full">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Meilleur Buteur
            </CardTitle>
            <Goal className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-full" />
            ) : statsData?.meilleurs.buteurs &&
              statsData.meilleurs.buteurs.length > 0 ? (
              <>
                <div className="text-xl font-bold">
                  {statsData.meilleurs.buteurs[0].joueur.nom}
                </div>
                <p className="text-xs text-muted-foreground">
                  Nombre de buts : {statsData.meilleurs.buteurs[0].stats.totalButs} 
                </p>
              </>
            ) : (
              <div className="text-sm">Aucun buteur</div>
            )}
          </CardContent>
        </Card>

        <Card className="w-full">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Meilleur Passeur 
            </CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-full" />
            ) : statsData?.meilleurs.passeurs &&
              statsData.meilleurs.passeurs.length > 0 ? (
              <>
                <div className="text-xl font-bold">
                  {statsData.meilleurs.passeurs[0].joueur.nom}
                </div>
                <p className="text-xs text-muted-foreground">
                  Passes décisives :{" "}
                  {statsData.meilleurs.passeurs[0].stats.totalPasses}
                </p>
              </>
            ) : (
              <div className="text-sm">Aucun passeur</div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="flex-1 rounded-xl bg-background p-4 md:min-h-min border shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Statistiques des Joueurs</h2>

        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-48 w-full" />
          </div>
        ) : error ? (
          <div className="p-4 bg-red-50 text-red-500 rounded-md">
            Erreur lors du chargement des données: {(error as Error).message}
          </div>
        ) : (
          <Tabs defaultValue="buteurs">
            <TabsList className="mb-4">
              <TabsTrigger value="buteurs">Buteurs</TabsTrigger>
              <TabsTrigger value="passeurs">Passeurs</TabsTrigger>
              <TabsTrigger value="notes">Notes</TabsTrigger>
              <TabsTrigger value="postes">Par Poste</TabsTrigger>
            </TabsList>

            <TabsContent value="buteurs">
              <ClassementTable
                joueurs={statsData?.meilleurs.buteurs}
                titre="Classement des Buteurs"
                statKey="totalButs"
              />
            </TabsContent>

            <TabsContent value="passeurs">
              <ClassementTable
                joueurs={statsData?.meilleurs.passeurs}
                titre="Classement des Passeurs"
                statKey="totalPasses"
              />
            </TabsContent>

            <TabsContent value="notes">
              <ClassementTable
                joueurs={statsData?.meilleurs.notes}
                titre="Classement par Notes"
                statKey="noteMoyenne"
              />
            </TabsContent>

            <TabsContent value="postes">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-md font-medium mb-2">
                    Meilleurs Gardiens
                  </h3>
                  <ClassementTable
                    joueurs={statsData?.parPoste.gardiens}
                    titre="Gardiens"
                    statKey="noteMoyenne"
                  />
                </div>
                <div>
                  <h3 className="text-md font-medium mb-2">
                    Meilleurs Défenseurs
                  </h3>
                  <ClassementTable
                    joueurs={statsData?.parPoste.defenseurs}
                    titre="Défenseurs"
                    statKey="noteMoyenne"
                  />
                </div>
                <div>
                  <h3 className="text-md font-medium mb-2">
                    Meilleurs Milieux
                  </h3>
                  <ClassementTable
                    joueurs={statsData?.parPoste.milieux}
                    titre="Milieux"
                    statKey="noteMoyenne"
                  />
                </div>
                <div>
                  <h3 className="text-md font-medium mb-2">
                    Meilleurs Attaquants
                  </h3>
                  <ClassementTable
                    joueurs={statsData?.parPoste.attaquants}
                    titre="Attaquants"
                    statKey="noteMoyenne"
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </>
  );
}
