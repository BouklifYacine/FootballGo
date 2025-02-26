"use client";

import React, { useState } from "react";
import Header from "@/components/header";
import { TableauDeBordClient } from "../TableauDeBordClient";
import { useStats, useUtilisateurs } from "../(hooks)/UseDashboard";

const ComponentPage = () => {
  const [page, setPage] = useState(0);

  const {
    data: dataStats,
    isLoading: isLoadingStats,
    error: statsError,
  } = useStats();

  const {
    data: dataUtilisateur,
    isLoading: isLoadingUtilisateur,
    error: utilisateurError,
  } = useUtilisateurs(page);

  if (isLoadingStats || isLoadingUtilisateur) {
    return (
      <>
        <Header />
        <div className="flex justify-center items-center min-h-screen">
          <p>CA CHARGE !!!</p>
        </div>
      </>
    );
  }

  if (statsError || utilisateurError || !dataStats || !dataUtilisateur) {
    return (
      <>
        <Header />
        <div className="flex justify-center items-center min-h-screen text-red-500">
          Une erreur est survenue lors du chargement des données
        </div>
      </>
    );
  }

  const utilisateurs = dataUtilisateur.data;
  const totalPages = dataUtilisateur.totalPages;
  const totalUtilisateurs = dataStats.data.users.total;
  const totalAbonnements = dataStats.data.users.pro;
  const statsAbonnements = {
    annuels: dataStats.data.abonnements.annuels,
    mensuels: dataStats.data.abonnements.mensuels,
  };
  const totalRevenus = Number(dataStats.data.abonnements.total.revenus);
  const MRR = Number(dataStats.data.abonnements.total.mrr);

  const RevenusParUtilisateurs = totalUtilisateurs > 0
    ? Number((totalRevenus / totalUtilisateurs).toFixed(2))
    : 0;

  const statistiques = {
    totalUtilisateurs,
    totalAbonnements,
    totalRevenus,
    statsAbonnements,
  };

  return (
    <>
      <Header />
      <TableauDeBordClient
        utilisateurs={utilisateurs}
        statistiques={statistiques}
        MRR={MRR}
        RevenusParUtilisateurs={RevenusParUtilisateurs}
        page={page}
        setPage={setPage}
        totalPages={totalPages}
      />
    </>
  );
};

export default ComponentPage;