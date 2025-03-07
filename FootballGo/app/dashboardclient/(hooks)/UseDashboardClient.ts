import { useQuery, UseQueryResult } from "@tanstack/react-query";
import axios from "axios";
import { StatsResponse } from "../(interface-types)/StatsJoueur";

export function useStatsJoueurs(): UseQueryResult<StatsResponse, Error> {
  return useQuery<StatsResponse, Error>({
    queryKey: ["stats"],
    queryFn: async () => {
      const { data } = await axios.get<StatsResponse>(
        "/api/statistiques/joueurs"
      );
      return data;
    },
    retry: 2,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
