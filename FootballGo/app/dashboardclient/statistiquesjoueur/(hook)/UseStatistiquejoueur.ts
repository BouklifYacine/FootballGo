"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { StatistiqueJoueurSchema } from "@/app/(schema)/SchemaStatistique";
import { z } from "zod";
import { toast } from "react-hot-toast";
import { modifierStatistiqueJoueur, supprimerStatistiqueJoueur } from "../(server-action)/StatistiqueJoueurAction";
import { StatistiquesJoueurResponse } from "../(types)/types";

export interface StatistiqueEvenement {
  id: string;
  evenementId: string;
  userId: string;
  buts: number;
  passes: number;
  minutesJouees: number;
  note: number;
  titulaire: boolean;
  poste: string;
}

export function useStatistiqueJoueur(id: string) {
  return useQuery({
    queryKey: ["statistique-joueur-detail", id],
    queryFn: async () => {
      if (!id) return null;
      
      try {
        const { data } = await axios.get<StatistiquesJoueurResponse>(
          `/api/user/${id}/statistiques`
        );
        return data.statistiquesGlobales;
      } catch (error) {
        console.error("Erreur lors de la récupération des statistiques:", error);
        return null;
      }
    },
    enabled: !!id, 
  });
}

export type StatistiqueJoueurInputs = z.infer<typeof StatistiqueJoueurSchema>;

export function useModifierStatistiqueJoueur() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ evenementId, data }: { evenementId: string; data: StatistiqueJoueurInputs }) => 
      modifierStatistiqueJoueur(evenementId, data),
    
    onMutate: () => {
      toast.loading("Mise à jour des statistiques...");
    },
    
    onSuccess: (response) => {
      toast.dismiss();
      if (response.success) {
        toast.success(response.message);
        // Invalider les requêtes pour forcer le rafraîchissement des données
        queryClient.invalidateQueries({ queryKey: ["evenements"] });
        queryClient.invalidateQueries({ queryKey: ["evenements-equipe"] });
        queryClient.invalidateQueries({ queryKey: ["statistique-evenement"] });
      } else {
        toast.error(response.message);
      }
    },
    
    onError: () => {
      toast.dismiss();
      toast.error("Une erreur est survenue lors de la modification des statistiques");
    }
  });
}

export function useSupprimerStatistiqueJoueur() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (evenementId: string) => supprimerStatistiqueJoueur(evenementId),
    
    onMutate: () => {
      toast.loading("Suppression des statistiques...");
    },
    
    onSuccess: (response) => {
      toast.dismiss();
      if (response.success) {
        toast.success(response.message);
        // Invalider les requêtes pour forcer le rafraîchissement des données
        queryClient.invalidateQueries({ queryKey: ["evenements"] });
        queryClient.invalidateQueries({ queryKey: ["evenements-equipe"] });
        queryClient.invalidateQueries({ queryKey: ["statistique-evenement"] });
      } else {
        toast.error(response.message);
      }
    },
    
    onError: () => {
      toast.dismiss();
      toast.error("Une erreur est survenue lors de la suppression des statistiques");
    }
  });
}