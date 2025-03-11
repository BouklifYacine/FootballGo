"use server";

import { prisma } from "@/prisma";
import {
  CreationEquipeSchema,
  RejoindreEquipeSchema,
} from "../../(schema)/SchemaEquipe";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { auth } from "@/auth";

export type CreationEquipeInput = z.infer<typeof CreationEquipeSchema>;

export type RejoindreEquipeInput = z.infer<typeof RejoindreEquipeSchema>;

export type ModifierEquipeInputs = z.infer<typeof CreationEquipeSchema>;

export type ResultatCreationEquipe = {
  success: boolean;
  message: string;
  equipe?: string[];
};

export async function creerEquipe(
  data: CreationEquipeInput
): Promise<ResultatCreationEquipe> {
  const validationResult = CreationEquipeSchema.safeParse(data);

  if (!validationResult.success) {
    return {
      success: false,
      message: "Données invalides",
      errors: validationResult.error.format(),
    };
  }

  const { nom, logoUrl, description } = validationResult.data;

  const session = await auth();
  const idUtilisateur = session?.user?.id;

  if (!idUtilisateur) {
    return {
      success: false,
      message: "Utilisateur non authentifié",
    };
  }

  try {
    const utilisateur = await prisma.user.findUnique({
      where: { id: idUtilisateur },
    });

    if (!utilisateur) {
      return {
        success: false,
        message: "Utilisateur introuvable",
      };
    }

    const equipeExistante = await prisma.equipe.findFirst({
      where: {
        nom: {
          mode: "insensitive",
          equals: nom.trim(),
        },
      },
    });

    if (equipeExistante) {
      return {
        success: false,
        message: "Une équipe avec ce nom existe déjà",
      };
    }

    const dejaEntraineur = await prisma.membreEquipe.findFirst({
      where: {
        userId: idUtilisateur,
        role: "ENTRAINEUR",
      },
    });

    if (dejaEntraineur) {
      return {
        success: false,
        message: "Vous êtes déjà entraîneur d'une équipe",
      };
    }

    const nouvelleEquipe = await prisma.$transaction(async (tx) => {
      const equipe = await tx.equipe.create({
        data: {
          nom: nom.trim(),
          logoUrl,
          description,
        },
      });

      await tx.membreEquipe.create({
        data: {
          userId: idUtilisateur,
          equipeId: equipe.id,
          role: "ENTRAINEUR",
        },
      });

      await tx.user.update({
        where: { id: idUtilisateur },
        data: {
          roleEquipe: "ENTRAINEUR",
          AunClub: "OUI",
        },
      });

      return equipe;
    });

    revalidatePath("/equipes");

    return {
      success: true,
      message: "Équipe créée avec succès",
      equipe: nouvelleEquipe,
    };
  } catch (error) {
    console.error("Erreur lors de la création de l'équipe:", error);
    return {
      success: false,
      message: "Erreur lors de la création de l'équipe",
    };
  }
}

export async function rejoindreEquipeCodeInvitation(
  data: RejoindreEquipeInput
): Promise<ResultatCreationEquipe> {
  const validationResult = RejoindreEquipeSchema.safeParse(data);

  if (!validationResult.success) {
    return {
      success: false,
      message: "Données invalides",
    };
  }

  const { codeInvitation } = validationResult.data;

  const session = await auth();
  const idUtilisateur = session?.user?.id;

  if (!idUtilisateur) {
    return {
      success: false,
      message: "Utilisateur non authentifié",
    };
  }

  try {
    const utilisateur = await prisma.user.findUnique({
      where: { id: idUtilisateur },
    });

    if (!utilisateur) {
      return {
        success: false,
        message: "Utilisateur introuvable",
      };
    }

    const equipe = await prisma.equipe.findFirst({
      where: { codeInvitation },
    });

    if (!equipe) {
      return {
        success: false,
        message: "Code d'invitation invalide ou équipe non trouvée",
      };
    }

    const membreExistant = await prisma.membreEquipe.findFirst({
      where: {
        userId: idUtilisateur,
        equipeId: equipe.id,
      },
    });

    if (membreExistant) {
      return {
        success: false,
        message: "Vous êtes déjà membre de cette équipe",
      };
    }

    await prisma.$transaction(async (tx) => {
      await tx.membreEquipe.create({
        data: {
          equipeId: equipe.id,
          userId: idUtilisateur,
          role: "JOUEUR",
        },
      });

      await tx.user.update({
        where: { id: idUtilisateur },
        data: {
          roleEquipe: "JOUEUR",
          AunClub: "OUI",
        },
      });
    });

    revalidatePath("/equipes");

    return {
      success: true,
      message: `Vous avez rejoint l'équipe ${equipe.nom} avec succès.`,
    };
  } catch (error) {
    console.error("Erreur lors de la rejoindre l'équipe:", error);
    return {
      success: false,
      message: "Erreur lors de l'opération de rejoindre l'équipe",
    };
  }
}

export async function modifierEquipe(
  equipeId: string,
  data: ModifierEquipeInputs
) {
  try {
    const session = await auth();
    const userId = session?.user?.id;
    
    if (!userId) {
      return { 
        success: false, 
        message: "Vous devez être connecté" 
      };
    }
    
    const membre = await prisma.membreEquipe.findFirst({
      where: {
        userId: userId,
        equipeId: equipeId,
        role: "ENTRAINEUR"
      }
    });
    
    if (!membre) {
      return { 
        success: false, 
        message: "Seuls les entraineurs peuvent modifier les informations de l'équipe" 
      };
    }
    
    const equipeModifiee = await prisma.equipe.update({
      where: { id: equipeId },
      data: {
        nom: data.nom,
        description: data.description,
        logoUrl: data.logoUrl
      }
    });
    
    revalidatePath(`/dashboardclient/equipe/${equipeId}`);
    
    return { 
      success: true, 
      message: "Équipe mise à jour avec succès", 
      equipe: equipeModifiee 
    };
    
  } catch (error) {
    console.error("Erreur lors de la modification de l'équipe:", error);
    return { 
      success: false, 
      message: "Une erreur est survenue lors de la modification de l'équipe" 
    };
  }
}

export async function supprimerEquipe(equipeId: string) {
  try {
    const session = await auth();
    const userId = session?.user?.id;
    
    if (!userId) {
      return { 
        success: false, 
        message: "Vous devez être connecté" 
      };
    }
    
    const equipe = await prisma.equipe.findUnique({
      where: { id: equipeId },
    });
    
    if (!equipe) {
      return {
        success: false,
        message: "Équipe non trouvée"
      };
    }
    
    const membreEquipe = await prisma.membreEquipe.findFirst({
      where: {
        userId: userId,
        equipeId: equipeId,
        role: "ENTRAINEUR"
      }
    });
    
    if (!membreEquipe) {
      return { 
        success: false, 
        message: "Seuls les entraineurs peuvent supprimer l'équipe" 
      };
    }
    
    const nomEquipe = equipe.nom;
    
    const membres = await prisma.membreEquipe.findMany({
      where: { equipeId: equipeId },
      select: { userId: true }
    });
    
    await prisma.$transaction(async (tx) => {
      for (const membre of membres) {
        await tx.user.update({
          where: { id: membre.userId },
          data: {
            roleEquipe: "SANSCLUB",
            AunClub: "NON",
          },
        });
      }
      
      await tx.equipe.delete({
        where: { id: equipeId },
      });
    });
    
    revalidatePath('/dashboardclient');
    
    return { 
      success: true, 
      message: `L'équipe ${nomEquipe} a été supprimée avec succès`,
      nomEquipe
    };
    
  } catch (error) {
    console.error("Erreur lors de la suppression de l'équipe:", error);
    return { 
      success: false, 
      message: "Une erreur est survenue lors de la suppression de l'équipe" 
    };
  }
}