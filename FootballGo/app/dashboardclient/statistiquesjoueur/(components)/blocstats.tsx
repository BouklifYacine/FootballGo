"use client"

import { Activity, Award, Clock, Zap, Users } from "lucide-react";
import React from "react";
import { useStatistiqueJoueur } from "../(hook)/UseStatistiquejoueur";
import { useSession } from "next-auth/react";
import Loading from "../../(components)/Loading";

const BlockStats = () => {
  const { data: session } = useSession();

  const sessionID = session?.user?.id || "";

  console.log(sessionID)

  const { data, isPending, error } = useStatistiqueJoueur(sessionID);

  console.log(data)

  if(isPending) return <><Loading></Loading></>

  if (error) return <div> Les données sont indisponible </div>
  return (
    
    <>
      <div className="flex flex-col md:flex-row justify-center gap-6 lg:gap-12 items-center p-4">
        <div className="bloc1 rounded-2xl w-full md:w-72 bg-blue-500 space-y-4 p-4">

            {}
          <div className="flex items-center justify-between">
            <p className="text-lg font-medium">Buts</p>
            <span className="block md:hidden">
              <Activity size={30} />
            </span>
            <span className="hidden md:block">
              <Activity size={40} />
            </span>
          </div>
          <div className="pt-4">
            <p className="font-bold text-lg tracking-tighter md:text-4xl">
              {data.totalButs}
            </p>
          </div>
          <div className="flex gap-6">
            <p>Yacine</p>
            <p>+35</p>
          </div>
        </div>

        <div className="bloc1 rounded-2xl w-full md:w-72 bg-blue-500 space-y-4 p-4">
          <div className="flex items-center justify-between">
            <p className="text-lg font-medium">Passes</p>
            <span className="block md:hidden">
              <Zap size={30} />
            </span>
            <span className="hidden md:block">
              <Zap size={40} />
            </span>
          </div>
          <div className="pt-4">
            <p className="font-bold text-lg tracking-tighter md:text-4xl">
              {data.totalPasses}
            </p>
          </div>
          <div className="flex gap-6">
            <p>Kylian</p>
            <p>+12</p>
          </div>
        </div>

        <div className="bloc1 rounded-2xl w-full md:w-72 bg-blue-500 space-y-4 p-4">
          <div className="flex items-center justify-between">
            <p className="text-lg font-medium">TOTAL/GA</p>
            <span className="block md:hidden">
              <Clock size={30} />
            </span>
            <span className="hidden md:block">
              <Clock size={40} />
            </span>
          </div>
          <div className="pt-4">
            <p className="font-bold text-lg tracking-tighter md:text-4xl">
             {data.GA_TOTAL}
            </p>
          </div>
          <div className="flex gap-6">
            <p>Ali</p>
            <p>+90</p>
          </div>
        </div>

        <div className="bloc1 rounded-2xl w-full md:w-72 bg-blue-500 space-y-4 p-4">
          <div className="flex items-center justify-between">
            <p className="text-lg font-medium">Victoires</p>
            <span className="block md:hidden">
              <Award size={30} />
            </span>
            <span className="hidden md:block">
              <Award size={40} />
            </span>
          </div>
          <div className="pt-4">
            <p className="font-bold text-lg tracking-tighter md:text-4xl">{data.GAPar90}</p>
          </div>
          <div className="flex gap-6">
            <p>Équipe</p>
            <p>+3</p>
          </div>
        </div>

        <div className="bloc1 rounded-2xl w-full md:w-72 bg-blue-500 space-y-4 p-4">
          <div className="flex items-center justify-between">
            <p className="text-lg font-medium">Joueurs</p>
            <span className="block md:hidden">
              <Users size={30} />
            </span>
            <span className="hidden md:block">
              <Users size={40} />
            </span>
          </div>
          <div className="pt-4">
            <p className="font-bold text-2xl tracking-tighter md:text-4xl">
              {data.noteMoyenne }
            </p>
          </div>
          <div className="flex gap-6">
            <p>Effectif</p>
            <p>+2</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default BlockStats;
