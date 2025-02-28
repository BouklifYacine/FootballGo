import { z } from "zod";

export const CreationEquipeSchema = z.object({
  nom: z
    .string({ message: "Vous devez mettre un nom d'équipe" })
    .min(1, { message: "Vous devez mettre un nom d'équipe" })
    .min(3, { message: "Le nom doit contenir au moins 3 caractères" })
    .max(35, { message: "Le nom ne peut pas dépasser 35 caractères" })
    .trim(),

  description: z
    .string()
    .min(10, { message: "La description doit contenir au moins 10 caractères" })
    .max(100, { message: "La description ne peut pas dépasser 100 caractères" })
    .trim()
    .optional(),

  logoUrl: z
    .string()
    .url({ message: "L'URL du logo doit être une URL valide" })
    .trim()
    .optional(),
});
