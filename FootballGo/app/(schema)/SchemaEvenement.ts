import { z } from "zod";

const evenementBaseSchema = z.object({
  titre: z.string().min(1, "Le titre est requis"),
  date: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Format de date invalide. Utilisez YYYY-MM-DD",
  }),
  heure: z.string().regex(/^\d{1,2}:\d{2}$/, "Format d'heure invalide (HH:MM)"),

  description: z.string().optional(),
  lieu: z.string().optional(),
  typeEvenement: z.enum(["MATCH", "ENTRAINEMENT"]).default("ENTRAINEMENT"),
});

export const evenementUniqueSchema = evenementBaseSchema.extend({
  recurrent: z.literal(false).optional(),
});

export const evenementRecurrentSchema = evenementBaseSchema.extend({
  recurrent: z.literal(true),
  jours: z
    .array(z.number().min(0).max(6))
    .min(1, "Sélectionnez au moins un jour"),
  dateFin: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Format de date de fin invalide",
  }),
});

export const evenementSchema = z.discriminatedUnion("recurrent", [
  evenementUniqueSchema,
  evenementRecurrentSchema,
]);

export type EvenementUnique = z.infer<typeof evenementUniqueSchema>;
export type EvenementRecurrent = z.infer<typeof evenementRecurrentSchema>;
export type Evenement = z.infer<typeof evenementSchema>;
