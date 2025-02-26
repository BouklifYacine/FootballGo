"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import toast from "react-hot-toast";
import { schemaVerificationMotDePasse } from "../schema";
import { supprimerCompte, verifierMotDePasse } from "../actions";

export type DeleteAccountSteps = "verification" | "confirmation";

export function useSuppressionCompte(userId: string) {
  const router = useRouter();
  const [confirmation, setConfirmation] = useState(false);
  const [etape, setEtape] = useState<DeleteAccountSteps>("verification");

  // Formulaires
  const formVerification = useForm({
    resolver: zodResolver(schemaVerificationMotDePasse),
  });

  const formConfirmation = useForm({});

  const { data: userAccounts, isLoading } = useQuery({
    queryKey: ["userAccounts", userId],
    queryFn: async () => {
      const response = await fetch(`/api/user/accounts?userId=${userId}`);
      if (!response.ok) throw new Error("Échec de la récupération des comptes");
      return response.json();
    },
  });

  const hasProvider = userAccounts?.length > 0;

  const verifierMotDePasseMutation = useMutation({
    mutationFn: async (motdepasse: string) => {
      const resultat = await verifierMotDePasse(motdepasse);
      if (resultat.error) throw new Error(resultat.error);
      return resultat;
    },
    onSuccess: () => {
      if (!hasProvider) {
        toast.success("Code de vérification envoyé par email");
      }
      setEtape("confirmation");
      formVerification.reset();
    },
    onError: (error: Error) => {
      toast.error(error.message);
      formVerification.setError("motdepasse", { message: error.message });
    },
  });

  const supprimerCompteMutation = useMutation({
    mutationFn: async (codeVerification?: string) => {
      try {
        const resultat = await supprimerCompte(codeVerification);
        if (resultat?.error) throw new Error(resultat.error);
        return resultat;
      } catch (error) {
        throw error;
      }
    },
    onSuccess: () => {
      toast.success("Compte supprimé avec succès");
      signOut({ redirectTo: "/connexion" });
      router.push("/connexion");
      router.refresh();
    },
    onError: (error: Error) => {
      toast.error(error.message || "Une erreur est survenue");
    },
  });

  const startDeleteProcess = () => {
    setConfirmation(true);
    if (hasProvider) {
      setEtape("confirmation");
    }
  };

  const handleSuppression = async () => {
    if (hasProvider) {
      await supprimerCompteMutation.mutateAsync(undefined);
    } else {
      const data = formConfirmation.getValues();
      await supprimerCompteMutation.mutateAsync(data.codeVerification);
    }
  };

  const annuler = () => {
    setConfirmation(false);
    setEtape("verification");
    formVerification.reset();
    formConfirmation.reset();
  };

  return {
    confirmation,
    etape,
    hasProvider,
    isLoading,
    formVerification,
    formConfirmation,
    verifierMotDePasseMutation,
    supprimerCompteMutation,
    startDeleteProcess,
    handleSuppression,
    annuler,
  };
}
