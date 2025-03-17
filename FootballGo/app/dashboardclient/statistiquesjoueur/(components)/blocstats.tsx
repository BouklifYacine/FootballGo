"use client";

import {
  Award,
  ChartNoAxesCombined,
  ChartNoAxesColumnIncreasing,
} from "lucide-react";
import React from "react";
import { useStatistiqueJoueur } from "../(hook)/UseStatistiquejoueur";
import { useSession } from "next-auth/react";
import Loading from "../../(components)/Loading";
import { IoFootball } from "react-icons/io5";
import { TbPlayFootball } from "react-icons/tb";

const BlockStats = () => {
  const { data: session } = useSession();

  const sessionID = session?.user?.id || "";

  console.log(sessionID);

  const { data, isPending, error } = useStatistiqueJoueur(sessionID);

  console.log(data);

  if (isPending)
    return (
      <>
        <Loading></Loading>
      </>
    );

  if (error) return <div> Les données sont indisponible </div>;
  return (
    <>
      <div className="flex flex-col md:flex-row justify-center gap-6 lg:gap-12 items-center p-4">
        <div className="bloc1 rounded-2xl w-full md:w-72 bg-white border border-gray-300 shadow-sm space-y-4 p-4">
          <div className="flex items-center justify-between">
            <p className="text-lg font-medium text-gray-800">Buts</p>
            <span className="block md:hidden text-gray-600">
              <IoFootball size={30} />
            </span>
            <span className="hidden md:block text-gray-600">
              <IoFootball size={40} />
            </span>
          </div>
          <div className="pt-6">
            <p className="font-bold text-2xl tracking-tighter md:text-4xl text-gray-900">
              {data.totalButs}
            </p>
          </div>

          <p className="text-gray-600">Cette saison</p>
        </div>

        <div className="bloc1 rounded-2xl w-full md:w-72 bg-white border border-gray-300 shadow-sm space-y-4 p-4">
          <div className="flex items-center justify-between">
            <p className="text-lg font-medium text-gray-800">Passes</p>
            <span className="block md:hidden text-gray-600">
              <TbPlayFootball size={30} />
            </span>
            <span className="hidden md:block text-gray-600">
              <TbPlayFootball size={40} />
            </span>
          </div>
          <div className="pt-6">
            <p className="font-bold text-2xl tracking-tighter md:text-4xl text-gray-900">
              {data.totalPasses}
            </p>
          </div>

          <p className="text-gray-600">Cette saison</p>
        </div>

        <div className="bloc1 rounded-2xl w-full md:w-72 bg-white border border-gray-300 shadow-sm space-y-4 p-4">
          <div className="flex items-center justify-between">
            <p className="text-lg font-medium text-gray-800">TOTAL/GA</p>
            <span className="block md:hidden text-gray-600">
              <ChartNoAxesColumnIncreasing size={30} />
            </span>
            <span className="hidden md:block text-gray-600">
              <ChartNoAxesColumnIncreasing size={40} />
            </span>
          </div>
          <div className="pt-6">
            <p className="font-bold text-2xl tracking-tighter md:text-4xl text-gray-900">
              {data.GA_TOTAL}
            </p>
          </div>

          <p className="text-gray-600">Cette saison</p>
        </div>

        <div className="bloc1 rounded-2xl w-full md:w-72 bg-white border border-gray-300 shadow-sm space-y-4 p-4">
          <div className="flex items-center justify-between">
            <p className="text-lg font-medium text-gray-800">Victoires</p>
            <span className="block md:hidden text-gray-600">
              <Award size={30} />
            </span>
            <span className="hidden md:block text-gray-600">
              <Award size={40} />
            </span>
          </div>
          <div className="pt-6">
            <p className="font-bold text-2xl tracking-tighter md:text-4xl text-gray-900">
              {data.GAPar90}
            </p>
          </div>

          <p className="text-gray-600">Cette saison</p>
        </div>

        <div className="bloc1 rounded-2xl w-full md:w-72 bg-white border border-gray-300 shadow-sm space-y-4 p-4">
          <div className="flex items-center justify-between">
            <p className="text-lg font-medium text-gray-800">NoteMoyenne</p>
            <span className="block md:hidden text-gray-600">
              <ChartNoAxesCombined size={30} />
            </span>
            <span className="hidden md:block text-gray-600">
              <ChartNoAxesCombined size={40} />
            </span>
          </div>
          <div className="pt-6">
            <p className="font-bold text-2xl tracking-tighter md:text-4xl text-gray-900">
              {data.noteMoyenne}
            </p>
          </div>

          <p className="text-gray-600">Cette saison</p>
        </div>
      </div>
    </>
  );
};

export default BlockStats;