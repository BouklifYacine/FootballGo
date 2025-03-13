import { z } from "zod";

// Schéma pour la mise à jour d'un événement
export const updateEvenementSchema = z.object({
  titre: z.string().min(1, "Le titre est requis").optional(),
  description: z.string().optional().nullable(),
  lieu: z.string().min(1, "Le lieu est requis").max(100, "Le lieu ne peut pas dépasser 100 caractères").optional().nullable(),
  typeEvenement: z.enum(["MATCH", "ENTRAINEMENT"], {
    errorMap: () => ({ message: "Le type d'événement doit être 'MATCH' ou 'ENTRAINEMENT'" })
  }).optional(),
  date: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Format de date invalide. Utilisez YYYY-MM-DD",
  }).optional(),
  heure: z.string().regex(/^\d{1,2}:\d{2}$/, "Format d'heure invalide (HH:MM)").optional(),
});

export type UpdateEvenement = z.infer<typeof updateEvenementSchema>; 