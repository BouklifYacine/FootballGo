import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { StatsResponse } from "../(interface-types)/StatsJoueur";
import { rejoindreEquipeCodeInvitation, RejoindreEquipeInput } from "../(server-actions)/DashboardClient-actions";
import toast from "react-hot-toast";
import { ClassementResponse } from "../(interface-types)/StatsEquipe";

export function useClassementJoueurs() {
  return useQuery({
    queryKey: ["classement-joueurs"],
    queryFn: async () => {
      const { data } = await axios.get<StatsResponse>("/api/statistiques/joueurs");
      return data;
    },
  });
}

export function useClassementEquipe() {
  return useQuery({
    queryKey: ["classement-équipes"],
    queryFn: async () => {
      const { data } = await axios.get<ClassementResponse>("/api/statistiques/equipes");
      return data;
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
    }
  });
}