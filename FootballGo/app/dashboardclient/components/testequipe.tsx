"use client";

import { useClassementEquipe } from "../(hooks)/UseDashboardClient";

import ClassementEquipe from "./ClassementEquipes";

export default function TestEquipe() {
  const { data, isLoading, error } = useClassementEquipe();

  return (
    <ClassementEquipe data={data} isLoading={isLoading} erreurequipes={error} />
  );
}
