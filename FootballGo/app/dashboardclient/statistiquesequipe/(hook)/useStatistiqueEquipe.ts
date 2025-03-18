"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-hot-toast";
import { StatistiqueEquipeReponse, ServerActionResponse, StatistiqueEquipeAgrege } from "../(types)/types";
import { StatistiqueEquipeSchema } from "@/app/(schema)/SchemaStatistique";
import { z } from "zod";
import { ajouterStatistiqueEquipe, modifierStatistiqueEquipe, supprimerStatistiqueEquipe } from "../(server-action)/StatistiqueEquipeAction";

export type StatistiqueEquipeInputs = z.infer<typeof StatistiqueEquipeSchema>;

export function useStatistiqueEquipeFDP(id: string) {
  return useQuery<StatistiqueEquipeAgrege>({
    queryKey: ["statistique-equipe", id],
    queryFn: async () => {
      const { data } = await axios.get<StatistiqueEquipeReponse>(
        `/api/user/${id}/statistiquesteam`
      );
      return data.StatistiqueEquipe;
    },
    enabled: !!id,
  });
}

export function useAjouterStatistiqueEquipe() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ evenementId, equipeId, data }: { 
      evenementId: string; 
      equipeId: string; 
      data: StatistiqueEquipeInputs 
    }) => ajouterStatistiqueEquipe(evenementId, equipeId, data),
    
    onSuccess: (response, variables) => {
      if (response.success) {
        toast.success(response.message);
        
        // Invalider les requêtes pour forcer le rafraîchissement des données
        queryClient.invalidateQueries({ queryKey: ["evenements"] });
        queryClient.invalidateQueries({ queryKey: ["evenements-equipe"] });
        queryClient.invalidateQueries({ 
          queryKey: ["statistique-equipe-evenement", variables.evenementId, variables.equipeId] 
        });
      } else {
        toast.error(response.message);
      }
    },
    
    onError: () => {
      toast.error("Une erreur est survenue lors de l'ajout des statistiques d'équipe");
    }
  });
}

// Hook pour modifier les statistiques d'une équipe
export function useModifierStatistiqueEquipe() {
  const queryClient = useQueryClient();

  return useMutation<ServerActionResponse, Error, { 
    evenementId: string; 
    equipeId: string; 
    data: StatistiqueEquipeInputs; 
  }>({
    mutationFn: ({ evenementId, equipeId, data }) => 
      modifierStatistiqueEquipe(evenementId, equipeId, data),
    
    onMutate: () => {
      toast.loading("Mise à jour des statistiques d'équipe...");
    },
    
    onSuccess: (response, variables) => {
      toast.dismiss();
      if (response.success) {
        toast.success(response.message);
        // Invalider les requêtes pour forcer le rafraîchissement des données
        queryClient.invalidateQueries({ queryKey: ["evenements"] });
        queryClient.invalidateQueries({ queryKey: ["evenements-equipe"] });
        queryClient.invalidateQueries({ 
          queryKey: ["statistique-equipe-evenement", variables.evenementId, variables.equipeId] 
        });
      } else {
        toast.error(response.message);
      }
    },
    
    onError: () => {
      toast.dismiss();
      toast.error("Une erreur est survenue lors de la modification des statistiques d'équipe");
    }
  });
}

// Hook pour supprimer les statistiques d'une équipe
export function useSupprimerStatistiqueEquipe() {
  const queryClient = useQueryClient();

  return useMutation<ServerActionResponse, Error, {
    evenementId: string;
    equipeId: string;
  }>({
    mutationFn: ({ evenementId, equipeId }) => 
      supprimerStatistiqueEquipe(evenementId, equipeId),
    
    onMutate: () => {
      toast.loading("Suppression des statistiques d'équipe...");
    },
    
    onSuccess: (response, variables) => {
      toast.dismiss();
      if (response.success) {
        toast.success(response.message);
        // Invalider les requêtes pour forcer le rafraîchissement des données
        queryClient.invalidateQueries({ queryKey: ["evenements"] });
        queryClient.invalidateQueries({ queryKey: ["evenements-equipe"] });
        queryClient.invalidateQueries({ 
          queryKey: ["statistique-equipe-evenement", variables.evenementId, variables.equipeId] 
        });
      } else {
        toast.error(response.message);
      }
    },
    
    onError: () => {
      toast.dismiss();
      toast.error("Une erreur est survenue lors de la suppression des statistiques d'équipe");
    }
  });
}
