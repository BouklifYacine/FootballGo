"use server";

import { signIn } from "@/auth";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { SchemaConnexion } from "@/app/(schema)/SchemaConnexion";
import { prisma } from "@/prisma";

type Schema = z.infer<typeof SchemaConnexion>;

export async function connexionAction(data: Schema) {
  try {
    const validation = SchemaConnexion.safeParse(data);
    if (!validation.success) {
      return {
        success: false,
        error: validation.error.errors[0].message,
      };
    }
    const user = await prisma.user.findUnique({
      where: {
        email: data.email,
      },
    });

    if (!user?.password) {
      return {
        success: false,
        error: "Email ou mot de passe incorrect",
      };
    }

    const Motdepassevalide = await bcrypt.compare(data.password, user.password);

    if (!Motdepassevalide) {
      return {
        success: false,
        error: "Email ou mot de passe incorrect",
      };
    }

    try {
      // Essayez la redirection
      await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirectTo: "/dashboardclient"
      });
      
      // Si nous arrivons ici (ce qui est peu probable), retournez le succès
      return { success: true };
    } catch (error: any) {
      // Vérifiez si l'erreur est une redirection
      if (error?.message?.includes('NEXT_REDIRECT')) {
        // C'est une redirection, c'est bon signe!
        return { success: true };
      }
      // Si c'est une autre erreur, relancez-la
      throw error;
    }
  } catch (error) {
    console.error("Erreur de connexion:", error);
    return {
      success: false,
      error: "Une erreur est survenue lors de la connexion",
    };
  }
}
