"use client";

import { useClassementEquipe, useClassementJoueurs } from "../(hooks)/UseDashboardClient";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import ClassementJoueur from "./ClassementJoueur";
import ClassementEquipe from "./ClassementEquipes";

export default function ClassementJoueurs() {
  const { data, isLoading, error } = useClassementJoueurs();
 const {data : statsequipes, isLoading : chargementEquipe, error : erreurequipes} = useClassementEquipe()
  const [sectionjoueur , useSectionJoueur] = useState(false)

  const AfficherSectionJoueur = () => {
    useSectionJoueur(!sectionjoueur)
  }

  return (
    <div className="space-y-6">
      <Button onClick={AfficherSectionJoueur}>{!sectionjoueur ? "Stats Equipes" : "Stats Joueur"}</Button>
      {!sectionjoueur ? 
      
      <ClassementJoueur data={data} isLoading={isLoading} error={error}></ClassementJoueur> :(
        <ClassementEquipe data={statsequipes} isLoading={chargementEquipe} erreurequipes={erreurequipes} />
)}
    </div>
  );
}
