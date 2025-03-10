import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { StatsResponse } from "../(interface-types)/StatsJoueur";
import { rejoindreEquipeCodeInvitation, RejoindreEquipeInput } from "../(server-actions)/DashboardClient-actions";
import toast from "react-hot-toast";
import { ClassementResponse } from "../(interface-types)/StatsEquipe";

export interface MembreEquipe {
  id: string;
  role: 'SANSCLUB' | 'ENTRAINEUR' | 'JOUEUR';
  posteJoueur?: 'GARDIEN' | 'DEFENSEUR' | 'MILIEU' | 'ATTAQUANT' | null;
  dateAdhesion: Date;
  userId: string;
  equipeId: string;
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
}


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