import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { StatistiqueJoueurSchema } from "@/app/(schema)/SchemaStatistique";
import { toast } from "react-hot-toast";
import { ajouterStatistiqueJoueur } from "../(server-action)/StatistiqueAction";

export type StatistiqueJoueurInputs = z.infer<typeof StatistiqueJoueurSchema>;

export function useAjouterStatistiqueJoueur() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ evenementId, data }: { evenementId: string; data: StatistiqueJoueurInputs }) => 
      ajouterStatistiqueJoueur(evenementId, data),
    
    onSuccess: (response, variables) => {
      if (response.success) {
        toast.success(response.message);

        queryClient.invalidateQueries({ queryKey: ["evenements"] });
        queryClient.invalidateQueries({ queryKey: ["evenement", variables.evenementId] });
      } else {
        toast.error(response.message);
      }
    },
    
    onError: () => {
      toast.error("Une erreur est survenue lors de l'envoi des statistiques");
    }
  });
}
