"use client"

import {  Award,  ChartNoAxesCombined, ThumbsUp, ThumbsDown } from "lucide-react";
import React from "react";
import { useSession } from "next-auth/react";
import Loading from "../../(components)/Loading";
import { useStatistiqueEquipeFDP } from "../(hook)/useStatistiqueEquipe";

import { TbPlayFootball } from "react-icons/tb";
import { IoIosFootball } from "react-icons/io";

const BlocStatsEquipe = () => {
  const { data: session } = useSession();

  const sessionID = session?.user?.id || "";
  const { data, isPending, error } = useStatistiqueEquipeFDP(sessionID);

  if(isPending) return <><Loading></Loading></>

  if (error) return <div> Les données sont indisponible </div>
  return (
    
    <>
    <div className="flex flex-col md:flex-row justify-center gap-6 lg:gap-12 items-center p-4">
        <div className="bloc1 rounded-2xl w-full md:w-72 bg-white border border-gray-300 shadow-sm space-y-4 p-4">
          <div className="flex items-center justify-between">
            <p className="text-lg font-medium text-gray-800">Victoires</p>
            <span className="block md:hidden text-gray-600">
            <ThumbsUp size={32} absoluteStrokeWidth className="text-green-500" />
            </span>
            <span className="hidden md:block text-gray-600">
            <ThumbsUp size={40} absoluteStrokeWidth className="text-green-500" />
            </span>
          </div>
          <div className="pt-6">
            <p className="font-bold text-2xl tracking-tighter md:text-4xl text-green-500">
              {data.victoires}
            </p>
          </div>

          <p className="text-gray-600">Cette saison</p>
        </div>

        <div className="bloc1 rounded-2xl w-full md:w-72 bg-white border border-gray-300 shadow-sm space-y-4 p-4">
          <div className="flex items-center justify-between">
            <p className="text-lg font-medium text-gray-800">Nuls</p>
            <span className="block md:hidden text-gray-600">
              <TbPlayFootball size={30} />
            </span>
            <span className="hidden md:block text-gray-600">
              <TbPlayFootball size={40} />
            </span>
          </div>
          <div className="pt-6">
            <p className="font-bold text-2xl tracking-tighter md:text-4xl text-gray-900">
              {data.nuls}
            </p>
          </div>

          <p className="text-gray-600">Cette saison</p>
        </div>

        <div className="bloc1 rounded-2xl w-full md:w-72 bg-white border border-gray-300 shadow-sm space-y-4 p-4">
          <div className="flex items-center justify-between">
            <p className="text-lg font-medium text-gray-800">Défaites</p>
            <span className="block md:hidden text-gray-600">
            <ThumbsDown size={32} absoluteStrokeWidth className="text-red-500" />
            </span>
            <span className="hidden md:block text-gray-600">
            <ThumbsDown size={40} absoluteStrokeWidth className="text-red-500" />
            </span>
          </div>
          <div className="pt-6">
            <p className="font-bold text-2xl tracking-tighter md:text-4xl text-red-500">
              {data.defaites}
            </p>
          </div>

          <p className="text-gray-600">Cette saison</p>
        </div>

        <div className="bloc1 rounded-2xl w-full md:w-72 bg-white border border-gray-300 shadow-sm space-y-4 p-4">
          <div className="flex items-center justify-between">
            <p className="text-lg font-medium text-gray-800">Buts Inscrit</p>
            <span className="block md:hidden text-gray-600">
            <IoIosFootball size={30} className="text-green-500"/>
            </span>
            <span className="hidden md:block text-gray-600">
            <IoIosFootball size={40} className="text-green-500"/>
            </span>
          </div>
          <div className="pt-6">
            <p className="font-bold text-2xl tracking-tighter md:text-4xl text-green-500">
              {data.butsMarques}
            </p>
          </div>

          <p className="text-gray-600">Cette saison</p>
        </div>

        <div className="bloc1 rounded-2xl w-full md:w-72 bg-white border border-gray-300 shadow-sm space-y-4 p-4">
          <div className="flex items-center justify-between">
            <p className="text-lg font-medium text-gray-800">Buts encaissés</p>
            <span className="block md:hidden text-gray-600">
            <IoIosFootball size={30} className="text-red-500"/>
            </span>
            <span className="hidden md:block text-gray-600">
            <IoIosFootball size={40} className="text-red-500" />
            </span>
          </div>
          <div className="pt-6">
            <p className="font-bold text-2xl tracking-tighter md:text-4xl text-red-500">
              {data.butsEncaisses}
            </p>
          </div>

          <p className="text-gray-600">Cette saison</p>
        </div>
      </div>
    </>
  );
};

export default BlocStatsEquipe;
