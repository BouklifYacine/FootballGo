"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";
import {
  Trophy,
  Users,
  Award,
  Star,
  ArrowUp,
  Info,
  Volleyball,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useClassementEquipe, useClassementJoueurs } from "../(hooks)/UseDashboardClient";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import ClassementJoueur from "./ClassementJoueur";

const PodiumRank = ({ rank }: { rank: number }) => {
  if (rank === 1) {
    return (
      <Badge className="bg-yellow-500 hover:bg-yellow-600 px-2 py-1 text-black font-bold">
        1
      </Badge>
    );
  } else if (rank === 2) {
    return (
      <Badge className="bg-gray-300 hover:bg-gray-400 px-2 py-1 text-black font-bold">
        2
      </Badge>
    );
  } else if (rank === 3) {
    return (
      <Badge className="bg-amber-600 hover:bg-amber-700 px-2 py-1 text-black font-bold">
        3
      </Badge>
    );
  }
  return <span className="text-sm font-medium">{rank}</span>;
};

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
 const {data : statsequipes, isLoading : chargementEquipe, error : erreurequipes} = useClassementEquipe()
  const [sectionjoueur , useSectionJoueur] = useState(false)

  const AfficherSectionJoueur = () => {
    useSectionJoueur(!sectionjoueur)
  }

 

  if(erreurequipes){
    return (
      <div className="p-4 bg-red-50 text-red-600 rounded-md border border-red-200 flex items-center gap-2">
        <Info className="h-5 w-5" />
        <span>Erreur: {(erreurequipes as Error).message}</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Button onClick={AfficherSectionJoueur}>{!sectionjoueur ? "Stats Equipes" : "Stats Joueur"}</Button>
      {!sectionjoueur ? 
      
      <ClassementJoueur data={data} isLoading={isLoading} error={error}></ClassementJoueur> :(
  <Card className="border-t-4 border-t-green-500 shadow-lg">
    <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 pb-2">
      <div className="flex items-center gap-2">
        <Trophy className="h-6 w-6 text-green-600" />
        <CardTitle>Classement des Équipes</CardTitle>
      </div>
      <p className="text-sm text-muted-foreground mt-1">
        Classement officiel de la ligue
      </p>
    </CardHeader>
    <CardContent className="p-0">
      {chargementEquipe ? (
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
                <th className="p-3 text-left font-medium">Pos</th>
                <th className="p-3 text-left font-medium">Équipe</th>
                <th className="p-3 text-right font-medium">MJ</th>
                <th className="p-3 text-right font-medium">V</th>
                <th className="p-3 text-right font-medium">N</th>
                <th className="p-3 text-right font-medium">D</th>
                <th className="p-3 text-right font-medium">BP</th>
                <th className="p-3 text-right font-medium">BC</th>
                <th className="p-3 text-right font-medium">Diff</th>
                <th className="p-3 text-right font-medium bg-green-50 text-green-700">Pts</th>
                <th className="p-3 text-center font-medium hidden md:table-cell">Forme</th>
              </tr>
            </thead>
            <tbody>
              {statsequipes?.classement.map((equipe, index) => (
                <tr
                  key={equipe.equipe.id}
                  className={`
                    border-b hover:bg-green-50/40 transition-colors
                    ${index < 3 ? "bg-green-50/20" : ""}
                  `}
                >
                  <td className="p-3">
                    <PodiumRank rank={index + 1} />
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      {equipe.equipe.logo ? (
                        <div className="rounded-full border border-slate-200 p-1">
                          <Image
                            src={equipe.equipe.logo}
                            alt={equipe.equipe.nom}
                            width={28}
                            height={28}
                            className="h-7 w-7"
                          />
                        </div>
                      ) : (
                        <div className="h-7 w-7 rounded-full bg-slate-100 flex items-center justify-center text-xs font-medium">
                          {equipe.equipe.nom.substring(0, 1)}
                        </div>
                      )}
                      <span className="font-medium">{equipe.equipe.nom}</span>
                    </div>
                  </td>
                  <td className="p-3 text-right font-medium">
                    {equipe.stats.matchsJoues}
                  </td>
                  <td className="p-3 text-right font-medium text-green-600">
                    {equipe.stats.victoires}
                  </td>
                  <td className="p-3 text-right font-medium text-amber-600">
                    {equipe.stats.nuls}
                  </td>
                  <td className="p-3 text-right font-medium text-red-600">
                    {equipe.stats.defaites}
                  </td>
                  <td className="p-3 text-right font-medium">
                    {equipe.stats.butsMarques}
                  </td>
                  <td className="p-3 text-right font-medium">
                    {equipe.stats.butsEncaisses}
                  </td>
                  <td className="p-3 text-right font-medium">
                    {equipe.stats.differenceDeButsGlobale > 0 ? "+" : ""}
                    {equipe.stats.differenceDeButsGlobale}
                  </td>
                  <td className="p-3 text-right font-bold text-green-700 bg-green-50/50">
                    {equipe.stats.points}
                  </td>
                  <td className="p-3 hidden md:table-cell">
                    <div className="flex justify-center gap-1">
                      {equipe.stats.formeRecente.map((resultat, i) => (
                        <div 
                          key={i} 
                          className={`
                            w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white
                            ${resultat === "VICTOIRE" ? "bg-green-500" : 
                              resultat === "MATCH_NUL" ? "bg-amber-500" : "bg-red-500"}
                          `}
                        >
                          {resultat === "VICTOIRE" ? "V" : 
                           resultat === "MATCH_NUL" ? "N" : "D"}
                        </div>
                      ))}
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
)}


    </div>
  );
}
