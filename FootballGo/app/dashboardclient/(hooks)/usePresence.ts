import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { 
  creerPresence, 
  supprimerPresence,
  modifierPresence,
  ResultatAction,
  PresenceRetour
} from "../(server-actions)/presenceActions";
import { StatutPresence } from "../(interface-types)/Presence";
import { toast } from "react-hot-toast";

// Types pour les présences
export interface Presence {
  titre: string;
  typeEvenement: string;
  description: string;
  lieu: string;
  name: string;
  image: string | null;
  statut: StatutPresence;
  dateDebut: string;
  evenementId: string;
  dateCreation: string;
}

export const usePresences = (evenementId: string) => {
  return useQuery({
    queryKey: ["presences", evenementId],
    queryFn: async () => {
      const { data } = await axios.get<Presence[]>(`/api/evenement/${evenementId}/presence`);
      return data;
    },
    enabled: !!evenementId,
    staleTime: 1000 * 60 * 5, 
  });
};

export const usePresencesUtilisateur = () => {
  return useQuery({
    queryKey: ["mes-presences"],
    queryFn: async () => {
      const { data } = await axios.get<Presence[]>("/api/mes-presences");
      console.log("Données récupérées:", data); // Log pour debug
      return data;
    },
    staleTime: 1000 * 60 * 5, 
  });
};

// Types pour les mutations
export interface CreerPresenceParams {
  evenementId: string;
  statut: StatutPresence;
  userId?: string;
}

// Type pour le contexte d'optimistic update
type PresenceUpdateContext = {
  previousPresences?: Presence[];
  previousEvenementPresences?: Presence[];
  newPresence?: Partial<Presence>;
  updatedPresence?: Presence;
};

// Hook pour créer/mettre à jour une présence
export const useCreerPresence = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ evenementId, statut, userId }: CreerPresenceParams) => {
      return await creerPresence(evenementId, statut, userId);
    },
    // Optimistic update
    onMutate: async ({ evenementId, statut }: CreerPresenceParams) => {
      // Annuler les requêtes en cours pour éviter les écrasements
      await queryClient.cancelQueries({ queryKey: ["mes-presences"] });
      await queryClient.cancelQueries({ queryKey: ["presences", evenementId] });

      // Sauvegarder l'état précédent pour le rollback
      const previousPresences = queryClient.getQueryData<Presence[]>(["mes-presences"]);
      const previousEvenementPresences = queryClient.getQueryData<Presence[]>(["presences", evenementId]);

      // Mettre à jour de manière optimiste le state mes-presences
      if (previousPresences) {
        const presenceIndex = previousPresences.findIndex(p => p.evenementId === evenementId);
        
        if (presenceIndex >= 0) {
          // Mettre à jour une présence existante
          const updatedPresences = [...previousPresences];
          updatedPresences[presenceIndex] = {
            ...updatedPresences[presenceIndex],
            statut: statut
          };
          
          queryClient.setQueryData(["mes-presences"], updatedPresences);
        } else {
     
        }
      }

      // Mettre à jour de manière optimiste le state presences/evenementId
      if (previousEvenementPresences) {
        const presenceIndex = previousEvenementPresences.findIndex(p => p.evenementId === evenementId);
        
        if (presenceIndex >= 0) {
          const updatedPresences = [...previousEvenementPresences];
          updatedPresences[presenceIndex] = {
            ...updatedPresences[presenceIndex],
            statut: statut
          };
          
          queryClient.setQueryData(["presences", evenementId], updatedPresences);
        }
      }

      // Retourner le contexte pour être utilisé en cas d'erreur
      return { 
        previousPresences, 
        previousEvenementPresences 
      } as PresenceUpdateContext;
    },
    // En cas d'erreur, on revient à l'état précédent
    onError: (err, variables, context) => {
      if (context?.previousPresences) {
        queryClient.setQueryData(["mes-presences"], context.previousPresences);
      }
      if (context?.previousEvenementPresences) {
        queryClient.setQueryData(
          ["presences", variables.evenementId], 
          context.previousEvenementPresences
        );
      }
      toast.error("Erreur lors de la mise à jour de la présence. Veuillez réessayer.");
    },
    // En cas de succès, on invalide quand même les queries pour s'assurer d'avoir les données à jour
    onSuccess: (resultat: ResultatAction<PresenceRetour>, variables) => {
      if (resultat.success) {
        queryClient.invalidateQueries({ queryKey: ["mes-presences"] });
        queryClient.invalidateQueries({ queryKey: ["presences", variables.evenementId] });
        // Si la page d'événements est ouverte, on la rafraîchit aussi
        queryClient.invalidateQueries({ queryKey: ["evenements"] });
      }
      return resultat;
    },
    // On refetch une fois la mutation terminée
    onSettled: (_, __, variables) => {
      queryClient.invalidateQueries({ queryKey: ["mes-presences"] });
      queryClient.invalidateQueries({ queryKey: ["presences", variables.evenementId] });
    }
  });
};

// Hook pour supprimer une présence
export const useSupprimerPresence = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ evenementId, userId }: { evenementId: string; userId?: string }) => {
      return await supprimerPresence(evenementId, userId);
    },
    // Optimistic update
    onMutate: async ({ evenementId }) => {
      // Annuler les requêtes en cours pour éviter les écrasements
      await queryClient.cancelQueries({ queryKey: ["mes-presences"] });
      await queryClient.cancelQueries({ queryKey: ["presences", evenementId] });

      // Sauvegarder l'état précédent pour le rollback
      const previousPresences = queryClient.getQueryData<Presence[]>(["mes-presences"]);
      const previousEvenementPresences = queryClient.getQueryData<Presence[]>(["presences", evenementId]);

      if (previousPresences) {
        const updatedPresences = previousPresences.filter(p => p.evenementId !== evenementId);
        queryClient.setQueryData(["mes-presences"], updatedPresences);
      }

      if (previousEvenementPresences) {
        const updatedPresences = previousEvenementPresences.map(p => 
          p.evenementId === evenementId 
            ? { ...p, statut: "EN_ATTENTE" as StatutPresence } 
            : p
        );
        queryClient.setQueryData(["presences", evenementId], updatedPresences);
      }

      return { 
        previousPresences, 
        previousEvenementPresences 
      } as PresenceUpdateContext;
    },
    onError: (err, variables, context) => {
      if (context?.previousPresences) {
        queryClient.setQueryData(["mes-presences"], context.previousPresences);
      }
      if (context?.previousEvenementPresences) {
        queryClient.setQueryData(
          ["presences", variables.evenementId], 
          context.previousEvenementPresences
        );
      }
      toast.error("Erreur lors de la suppression de la présence. Veuillez réessayer.");
    },

    onSuccess: (resultat: ResultatAction<void>, variables) => {
      if (resultat.success) {
        queryClient.invalidateQueries({ queryKey: ["mes-presences"] });
        queryClient.invalidateQueries({ queryKey: ["presences", variables.evenementId] });
        queryClient.invalidateQueries({ queryKey: ["evenements"] });
      }
      return resultat;
    },

    onSettled: (_, __, variables) => {
      queryClient.invalidateQueries({ queryKey: ["mes-presences"] });
      queryClient.invalidateQueries({ queryKey: ["presences", variables.evenementId] });
    }
  });
};

// Hook pour modifier une présence
export const useModifierPresence = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ evenementId, statut, userId }: CreerPresenceParams) => {
      return await modifierPresence(evenementId, statut, userId);
    },
    onMutate: async ({ evenementId, statut }: CreerPresenceParams) => {
      await queryClient.cancelQueries({ queryKey: ["mes-presences"] });
      await queryClient.cancelQueries({ queryKey: ["presences", evenementId] });

      const previousPresences = queryClient.getQueryData<Presence[]>(["mes-presences"]);
      const previousEvenementPresences = queryClient.getQueryData<Presence[]>(["presences", evenementId]);

      if (previousPresences) {
        const presenceIndex = previousPresences.findIndex(p => p.evenementId === evenementId);
        
        if (presenceIndex >= 0) {
          const updatedPresences = [...previousPresences];
          updatedPresences[presenceIndex] = {
            ...updatedPresences[presenceIndex],
            statut: statut
          };
          
          queryClient.setQueryData(["mes-presences"], updatedPresences);
        }
      }

      if (previousEvenementPresences) {
        const presenceIndex = previousEvenementPresences.findIndex(p => p.evenementId === evenementId);
        
        if (presenceIndex >= 0) {
          const updatedPresences = [...previousEvenementPresences];
          updatedPresences[presenceIndex] = {
            ...updatedPresences[presenceIndex],
            statut: statut
          };
          
          queryClient.setQueryData(["presences", evenementId], updatedPresences);
        }
      }

      return { 
        previousPresences, 
        previousEvenementPresences 
      } as PresenceUpdateContext;
    },
    onError: (err, variables, context) => {
      if (context?.previousPresences) {
        queryClient.setQueryData(["mes-presences"], context.previousPresences);
      }
      if (context?.previousEvenementPresences) {
        queryClient.setQueryData(
          ["presences", variables.evenementId], 
          context.previousEvenementPresences
        );
      }
      toast.error("Erreur lors de la modification de la présence");
    },
    onSuccess: (resultat: ResultatAction<PresenceRetour>, variables) => {
      if (resultat.success) {
        queryClient.invalidateQueries({ queryKey: ["mes-presences"] });
        queryClient.invalidateQueries({ queryKey: ["presences", variables.evenementId] });
        queryClient.invalidateQueries({ queryKey: ["evenements"] });
      }
      return resultat;
    }
  });
}; 