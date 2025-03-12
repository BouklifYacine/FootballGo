"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { StatsResponse } from "../(interface-types)/StatsJoueur";
import {
  CreationEquipeInputs,
  creerEquipe,
  modifierEquipe,
  ModifierEquipeInputs,
  modifierRoleEtPoste,
  quitterEquipe,
  rejoindreEquipeCodeInvitation,
  RejoindreEquipeInput,
  supprimerCodeInvitation,
  supprimerEquipe,
  supprimerMembreEquipe,
} from "../(server-actions)/DashboardClient-actions";
import toast from "react-hot-toast";
import { ClassementResponse } from "../(interface-types)/StatsEquipe";
import { useRouter } from "next/navigation";

export interface MembreEquipe {
  id: string;
  role: "SANSCLUB" | "ENTRAINEUR" | "JOUEUR";
  posteJoueur?: "GARDIEN" | "DEFENSEUR" | "MILIEU" | "ATTAQUANT" | null;
  dateAdhesion: Date;
  userId: string;
  equipeId: string;
  user?: {
    name: string | null;
    image: string | null;
    email: string | null;
  };
}

export interface Equipe {
  id: string;
  nom: string;
  description?: string | null;
  logoUrl?: string | null;
  dateCreation: Date;
  codeInvitation?: string | null;
  membres: MembreEquipe[];
}

export interface EquipeResponse {
  ListeEquipe: Equipe;
  userId: string;
}

interface CodeInvitationResponse {
  message: string;
  codeInvitation?: string;
}

interface CodeInvitationResponse {
  message: string;
  codeInvitation?: string;
}

export function useClassementJoueurs() {
  return useQuery({
    queryKey: ["classement-joueurs"],
    queryFn: async () => {
      const { data } = await axios.get<StatsResponse>(
        "/api/statistiques/joueurs"
      );
      return data;
    },
  });
}

export function useClassementEquipe() {
  return useQuery({
    queryKey: ["classement-équipes"],
    queryFn: async () => {
      const { data } = await axios.get<ClassementResponse>(
        "/api/statistiques/equipes"
      );
      return data;
    },
  });
}

export function useMembreEquipe(id: string) {
  return useQuery({
    queryKey: ["membre-equipe", id],
    queryFn: async () => {
      try {
        const { data } = await axios.get<EquipeResponse>(`/api/equipes/${id}`);
        return data;
      } catch (error) {
        console.error("Erreur lors de la récupération des membres:", error);
        throw error;
      }
    },
    retry: 1,
    refetchOnWindowFocus: false,
  });
}

export function useCreerEquipe() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async (data: CreationEquipeInputs) => {
      return await creerEquipe(data);
    },

    onMutate: () => {
      toast.loading("Création de l'équipe en cours...");
    },

    onSuccess: (result) => {
      toast.dismiss();

      if (result.success) {
        toast.success(result.message);
        queryClient.invalidateQueries({ queryKey: ["equipes"] });
        if (result.equipe && result.equipe.id) {
          router.push(`/dashboardclient/equipe/${result.equipe.id}`);
        } else {
          router.push("/dashboardclient");
        }
      } else {
        toast.error(result.message || "Échec de la création de l'équipe");
      }
    },

    onError: (error: Error) => {
      toast.dismiss();
      toast.error(
        error.message ||
          "Une erreur est survenue lors de la création de l'équipe"
      );
    },
  });
}

export function useRejoindreEquipeCodeInvitation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: RejoindreEquipeInput) => {
      return await rejoindreEquipeCodeInvitation(data);
    },

    onMutate: () => {
      toast.loading("Traitement en cours...");
    },

    onSuccess: (data) => {
      toast.dismiss();

      if (data.success) {
        toast.success(data.message);
        queryClient.invalidateQueries({ queryKey: ["equipes"] });
        queryClient.invalidateQueries({ queryKey: ["profile"] });
      } else {
        toast.error(data.message);
      }
    },

    onError: () => {
      toast.dismiss();
      toast.error("Une erreur est survenue");
    },
  });
}

export function useModifierEquipe(equipeId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: ModifierEquipeInputs) => {
      return await modifierEquipe(equipeId, data);
    },

    onMutate: () => {
      toast.loading("Mise à jour des informations...");
    },

    onSuccess: (result) => {
      toast.dismiss();

      if (result.success) {
        toast.success(result.message);
        queryClient.invalidateQueries({
          queryKey: ["membre-equipe", equipeId],
        });
      } else {
        toast.error(result.message);
      }
    },

    onError: () => {
      toast.dismiss();
      toast.error("Erreur lors de la modification de l'équipe");
    },
  });
}

export function useSupprimerEquipe(equipeId: string) {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async () => {
      return await supprimerEquipe(equipeId);
    },

    onMutate: () => {
      toast.loading("Suppression de l'équipe en cours...");
    },

    onSuccess: (result) => {
      toast.dismiss();

      if (result.success) {
        toast.success(result.message);
        queryClient.invalidateQueries({ queryKey: ["equipes"] });
        router.push("/dashboardclient");
      } else {
        toast.error(result.message);
      }
    },

    onError: () => {
      toast.dismiss();
      toast.error("Erreur lors de la suppression de l'équipe");
    },
  });
}

export function useModifierRoleEtPoste(equipeId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      membreId: string;
      role: "ENTRAINEUR" | "JOUEUR";
      posteJoueur?: "GARDIEN" | "DEFENSEUR" | "MILIEU" | "ATTAQUANT";
    }) => {
      const mutationData = {
        membreId: data.membreId,
        role: data.role,
        posteJoueur: data.role === "ENTRAINEUR" ? undefined : data.posteJoueur,
      };

      return await modifierRoleEtPoste(equipeId, data.membreId, mutationData);
    },

    onMutate: () => {
      toast.loading("Modification du rôle en cours...");
    },

    onSuccess: (result) => {
      toast.dismiss();

      if (result.success) {
        toast.success(result.message);
        queryClient.invalidateQueries({
          queryKey: ["membre-equipe", equipeId],
        });
        queryClient.invalidateQueries({ queryKey: ["equipes"] });
      } else {
        toast.error(result.message);
      }
    },

    onError: (error: Error) => {
      toast.dismiss();
      toast.error(error.message || "Erreur lors de la modification du rôle");
    },
  });
}

export function useSupprimerMembreDEquipe(equipeId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (membreId: string) => {
      return await supprimerMembreEquipe(equipeId, membreId);
    },

    onMutate: () => {
      toast.loading("Suppression du membre en cours...");
    },

    onSuccess: (result) => {
      toast.dismiss();

      if (result.success) {
        toast.success(result.message);
        // Invalider les requêtes liées à l'équipe et aux membres
        queryClient.invalidateQueries({
          queryKey: ["membre-equipe", equipeId],
        });
        queryClient.invalidateQueries({ queryKey: ["equipes"] });
      } else {
        toast.error(result.message);
      }
    },

    onError: (error: Error) => {
      toast.dismiss();
      toast.error(error.message || "Erreur lors de la suppression du membre");
    },
  });
}

export function useCodeInvitation(equipeId: string) {
  const queryClient = useQueryClient();

  const genererCode = useMutation({
    mutationFn: async () => {
      const { data } = await axios.get<CodeInvitationResponse>(
        `/api/equipes/${equipeId}/codeinvitation`
      );
      return data;
    },

    onMutate: () => {
      toast.loading("Génération du code d'invitation...");
    },

    onSuccess: (result) => {
      toast.dismiss();

      if (result.codeInvitation) {
        toast.success(result.message);
        queryClient.invalidateQueries({
          queryKey: ["membre-equipe", equipeId],
        });
      } else {
        toast.error(result.message);
      }
    },

    onError: (error: Error) => {
      toast.dismiss();
      toast.error(
        error.message || "Erreur lors de la génération du code d'invitation"
      );
    },
  });

  const supprimerCode = useMutation({
    mutationFn: async () => {
      return await supprimerCodeInvitation(equipeId);
    },

    onMutate: () => {
      toast.loading("Suppression du code d'invitation...");
    },

    onSuccess: (result) => {
      toast.dismiss();

      if (result.success) {
        toast.success(result.message);
        queryClient.invalidateQueries({
          queryKey: ["membre-equipe", equipeId],
        });
      } else {
        toast.error(result.message);
      }
    },

    onError: (error: Error) => {
      toast.dismiss();
      toast.error(
        error.message || "Erreur lors de la suppression du code d'invitation"
      );
    },
  });

  return {
    genererCode: genererCode.mutate,
    supprimerCode: supprimerCode.mutate,
    isGenerating: genererCode.isPending,
    isDeleting: supprimerCode.isPending,
  };
}

export function useQuitterEquipe() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async ({equipeId,membreId}: {equipeId:string; membreId?:string;
    }) => {return await quitterEquipe(equipeId, membreId);},

    onMutate: (variables) => {
      toast.loading(
        variables.membreId
          ? "Suppression du membre en cours..."
          : "Suppression en cours"
      );
    },

    onSuccess: (result, variables) => {
      toast.dismiss();

      if (result.success) {
        toast.success(result.message);

        queryClient.invalidateQueries({
          queryKey: ["membre-equipe", variables.equipeId],
        });
        queryClient.invalidateQueries({
          queryKey: ["equipes"],
        });
        queryClient.invalidateQueries({
          queryKey: ["profile"],
        });

        if (!variables.membreId) {
          router.push("/dashboardclient");
        }
      } else {
        toast.error(result.message);
      }
    },

    onError: (error: Error) => {
      toast.dismiss();
      toast.error(error.message || "Erreur lors de la suppression du membre");
    },
  });
}
