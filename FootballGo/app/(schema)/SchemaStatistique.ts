import { z } from "zod";

export const StatistiqueJoueurSchema = z.object({
    userId: z.string().optional(), 
    buts: z.number().int().min(0).default(0),
    passes: z.number().int().min(0).default(0),
    minutesJouees: z.number().int().min(0).default(0),
    note: z.number().min(0).max(10),
    titulaire: z.boolean().default(false),
    poste: z.enum(["GARDIEN", "DEFENSEUR", "MILIEU", "ATTAQUANT"]).optional(),
  });
  
 export  const StatistiqueEquipeSchema = z.object({
    resultatMatch: z.enum(["VICTOIRE", "DEFAITE", "MATCH_NUL"]).optional(),
    butsMarques: z.number().int().min(0).default(0),
    butsEncaisses: z.number().int().min(0).default(0),
    cleanSheet: z.boolean().default(false),
    possession: z.number().int().min(0).max(100).optional(),
    tirsTotal: z.number().int().min(0).optional(),
    tirsCadres: z.number().int().min(0).optional(),
    corners: z.number().int().min(0).optional(),
    domicile: z.boolean().default(true),
    competition: z.string().optional(),
    adversaire: z.string().optional(),
  });