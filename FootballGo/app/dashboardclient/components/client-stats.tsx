"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";
import { Trophy, Users, Award, Star, ArrowUp, Info, Volleyball } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useClassementJoueurs } from "../(hooks)/UseDashboardClient";

const PodiumRank = ({ rank }: { rank: number }) => {
  if (rank === 1) {
    return (
      <Badge className="bg-yellow-500 hover:bg-yellow-600 px-2 py-1 text-black font-bold">
        1 🏆
      </Badge>
    );
  } else if (rank === 2) {
    return (
      <Badge className="bg-gray-300 hover:bg-gray-400 px-2 py-1 text-black font-bold">
        2 🥈
      </Badge>
    );
  } else if (rank === 3) {
    return (
      <Badge className="bg-amber-600 hover:bg-amber-700 px-2 py-1 text-black font-bold">
        3 🥉
      </Badge>
    );
  }
  return <span className="text-sm font-medium">{rank}</span>;
};

// Composant d'indicateur de note
const NoteIndicator = ({ note }: { note: number }) => {
  let color = "bg-gray-200";

  if (note >= 8) {
    color = "bg-green-500";
  } else if (note >= 7) {
    color = "bg-green-400";
  } else if (note >= 6) {
    color = "bg-yellow-400";
  } else if (note >= 5) {
    color = "bg-orange-400";
  } else {
    color = "bg-red-400";
  }

  return (
    <div className="flex items-center">
      <div
        className={`w-6 h-6 rounded-full ${color} flex items-center justify-center text-xs font-bold text-white mr-1`}
      >
        {note.toFixed(1)}
      </div>
    </div>
  );
};

export default function ClassementJoueurs() {
  const { data, isLoading, error } = useClassementJoueurs();

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-600 rounded-md border border-red-200 flex items-center gap-2">
        <Info className="h-5 w-5" />
        <span>Erreur: {(error as Error).message}</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="border-t-4 border-t-blue-500 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 pb-2">
          <div className="flex items-center gap-2">
            <Trophy className="h-6 w-6 text-blue-500" />
            <CardTitle>Classement des Joueurs</CardTitle>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Classement par contribution offensive (G+A)
          </p>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="space-y-4 p-4">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-slate-100 text-slate-700">
                    <th className="p-3 text-left font-medium">Rang</th>
                    <th className="p-3 text-left font-medium">Joueur</th>
                    <th className="p-3 text-center font-medium hidden md:table-cell">
                      Équipe
                    </th>
                    <th className="p-3 text-right font-medium hidden sm:table-cell">
                      <div className="flex items-center justify-end gap-1">
                        <Users className="h-4 w-4" />
                        <span>Matchs</span>
                      </div>
                    </th>
                    <th className="p-3 text-right font-medium">
                      <div className="flex items-center justify-end gap-1">
                        <Volleyball className="h-4 w-4" />
                        <span>Buts</span>
                      </div>
                    </th>
                    <th className="p-3 text-right font-medium">
                      <div className="flex items-center justify-end gap-1">
                        <Award className="h-4 w-4" />
                        <span>Passes</span>
                      </div>
                    </th>
                    <th className="p-3 text-right font-medium bg-blue-50">
                      <div className="flex items-center justify-end gap-1 text-blue-700">
                        <ArrowUp className="h-4 w-4" />
                        <span>G+A</span>
                      </div>
                    </th>
                    <th className="p-3 text-right font-medium hidden lg:table-cell">
                      G+A/M
                    </th>
                    <th className="p-3 text-right font-medium hidden md:table-cell">
                      <div className="flex items-center justify-end gap-1">
                        <Star className="h-4 w-4" />
                        <span>Buts/90</span>
                      </div>
                    </th>
                    <th className="p-3 text-right font-medium hidden md:table-cell">
                      <div className="flex items-center justify-end gap-1">
                        <Star className="h-4 w-4" />
                        <span>Note</span>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data?.classement.map((joueur, index) => (
                    <tr
                      key={joueur.joueur.id}
                      className={`
                        border-b hover:bg-blue-50/40 transition-colors
                        ${index < 3 ? "bg-blue-50/20" : ""}
                      `}
                    >
                      <td className="p-3">
                        <PodiumRank rank={index + 1} />
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8 border-2 border-slate-200">
                            <AvatarImage
                              src={joueur.joueur.image || undefined}
                              alt={joueur.joueur.nom}
                            />
                            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
                              {joueur.joueur.nom.substring(0, 2)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-medium">
                            {joueur.joueur.nom}
                          </span>
                        </div>
                      </td>
                      <td className="p-3 text-center hidden md:table-cell">
                        {joueur.equipe ? (
                          <div className="flex justify-center">
                            {joueur.equipe.logoUrl ? (
                              <div className="rounded-full border border-slate-200 p-1">
                                <Image
                                  src={joueur.equipe.logoUrl}
                                  alt={joueur.equipe.nom}
                                  width={24}
                                  height={24}
                                  className="h-6 w-6"
                                />
                              </div>
                            ) : (
                              <div className="h-6 w-6 rounded-full bg-slate-100 flex items-center justify-center text-xs font-medium">
                                {joueur.equipe.nom.substring(0, 1)}
                              </div>
                            )}
                          </div>
                        ) : (
                          <span className="text-xs text-muted-foreground">
                            -
                          </span>
                        )}
                      </td>
                      <td className="p-3 text-right font-medium hidden sm:table-cell">
                        {joueur.stats.totalMatchs}
                      </td>
                      <td className="p-3 text-right font-medium">
                        {joueur.stats.totalButs}
                      </td>
                      <td className="p-3 text-right font-medium">
                        {joueur.stats.totalPasses}
                      </td>
                      <td className="p-3 text-right font-bold text-blue-700 bg-blue-50/50">
                        {joueur.stats.GA}
                      </td>
                      <td className="p-3 text-right font-medium hidden lg:table-cell">
                        {joueur.stats.GA_Match.toFixed(1)}
                      </td>
                      <td className="p-3 text-right font-medium hidden sm:table-cell">
                        {joueur.stats.butsPar90.toFixed(2)}
                      </td>
                      <td className="p-3 text-right hidden md:table-cell">
                        <div className="flex justify-end">
                          <NoteIndicator note={joueur.stats.noteMoyenne} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Version mobile - affichage sous forme de cartes */}
      <div className="sm:hidden">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Trophy className="h-5 w-5 text-blue-500" />
          Classement des Joueurs
        </h2>

        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        ) : (
          <div className="space-y-4">
            {data?.classement.slice(0, 20).map((joueur, index) => (
              <Card
                key={joueur.joueur.id}
                className={`
                overflow-hidden
                ${index < 3 ? "border-l-4 border-blue-500 shadow-md" : ""}
              `}
              >
                <CardContent className="p-0">
                  <div className="bg-gradient-to-r from-slate-50 to-blue-50 p-3 flex items-center gap-3 border-b">
                    <PodiumRank rank={index + 1} />
                    <Avatar className="h-10 w-10 border-2 border-white shadow">
                      <AvatarImage
                        src={joueur.joueur.image || undefined}
                        alt={joueur.joueur.nom}
                      />
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
                        {joueur.joueur.nom.substring(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="font-semibold">{joueur.joueur.nom}</div>
                      <div className="text-sm text-muted-foreground flex items-center gap-1">
                        {joueur.equipe?.nom || "Sans équipe"}
                        {joueur.equipe?.logoUrl && (
                          <Image
                            src={joueur.equipe.logoUrl}
                            alt={joueur.equipe.nom}
                            width={16}
                            height={16}
                            className="h-4 w-4 ml-1"
                          />
                        )}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-blue-700 font-bold">G+A</div>
                      <div className="text-xl font-bold text-blue-700">
                        {joueur.stats.GA}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center p-3">
                    <div className="p-2 rounded-md bg-slate-50">
                      <div className="text-xs text-slate-500 flex items-center justify-center gap-1 mb-1">
                        <Volleyball className="h-3 w-3" />
                        <span>Buts</span>
                      </div>
                      <div className="font-semibold">
                        {joueur.stats.totalButs}
                      </div>
                    </div>
                    <div className="p-2 rounded-md bg-slate-50">
                      <div className="text-xs text-slate-500 flex items-center justify-center gap-1 mb-1">
                        <Award className="h-3 w-3" />
                        <span>Passes</span>
                      </div>
                      <div className="font-semibold">
                        {joueur.stats.totalPasses}
                      </div>
                    </div>
                    <div className="p-2 rounded-md bg-slate-50">
                      <div className="text-xs text-slate-500 flex items-center justify-center gap-1 mb-1">
                        <Users className="h-3 w-3" />
                        <span>Matchs</span>
                      </div>
                      <div className="font-semibold">
                        {joueur.stats.totalMatchs}
                      </div>
                    </div>
                    <div className="p-2 rounded-md bg-slate-50 col-span-2">
                      <div className="text-xs text-slate-500 mb-1">
                        G+A par match
                      </div>
                      <div className="font-semibold">
                        {joueur.stats.GA_Match.toFixed(1)}
                      </div>
                    </div>
                    <div className="p-2 rounded-md bg-slate-50">
                      <div className="text-xs text-slate-500 flex items-center justify-center gap-1 mb-1">
                        <Star className="h-3 w-3" />
                        <span>Note</span>
                      </div>
                      <div className="flex justify-center">
                        <NoteIndicator note={joueur.stats.noteMoyenne} />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
