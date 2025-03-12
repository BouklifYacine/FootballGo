"use server";

import { prisma } from "@/prisma";
import {
  ChangementDonneeJoueur,
  CreationEquipeSchema,
  RejoindreEquipeSchema,
} from "../../(schema)/SchemaEquipe";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { auth } from "@/auth";

export type CreationEquipeInputs = z.infer<typeof CreationEquipeSchema>;
export type RejoindreEquipeInput = z.infer<typeof RejoindreEquipeSchema>;
export type ModifierEquipeInputs = z.infer<typeof CreationEquipeSchema>;
export type ChangementDonneeJoueurInputs = z.infer<typeof ChangementDonneeJoueur>;

export type ResultatCreationEquipe = {
  success: boolean;
  message: string;
  equipe?: string[];
};

export type CodeInvitationType = {
  success: boolean;
  message: string;
  equipe?: string[];
  equipeId?: string; 
};


export async function creerEquipe(data: CreationEquipeInputs) {
  try {
    const validation = CreationEquipeSchema.safeParse(data);
    
    if (!validation.success) {
      return {
        success: false,
        message: "Données invalides",
        erreurs: validation.error.format()
      };
    }
  
    const session = await auth();
    const idUtilisateur = session?.user?.id;
    
    if (!idUtilisateur) {
      return { 
        success: false, 
        message: "Vous devez être connecté" 
      };
    }

    const utilisateur = await prisma.user.findUnique({
      where: { id: idUtilisateur },
    });
    
    if (!utilisateur) {
      return {
        success: false,
        message: "Utilisateur introuvable"
      };
    }
    
    const equipeExistante = await prisma.equipe.findFirst({
      where: {
        nom: {
          mode: "insensitive",
          equals: data.nom.trim(),
        },
      },
    });
    
    if (equipeExistante) {
      return {
        success: false,
        message: "Une équipe avec ce nom existe déjà"
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
        message: "Vous êtes déjà entraîneur d'une équipe"
      };
    }
    
    const nouvelleEquipe = await prisma.$transaction(async (tx) => {
      const equipe = await tx.equipe.create({
        data: {
          nom: data.nom.trim(),
          description: data.description || null,
          logoUrl: data.logoUrl || null,
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
    
    revalidatePath('/dashboardclient');
    
    return {
      success: true,
      message: "Équipe créée avec succès",
      equipe: nouvelleEquipe
    };
    
  } catch (error) {
    console.error("Erreur lors de la création de l'équipe:", error);
    return {
      success: false,
      message: "Erreur lors de la création de l'équipe"
    };
  }
}

export async function rejoindreEquipeCodeInvitation(
  data: RejoindreEquipeInput
): Promise<CodeInvitationType> {
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
        equipeId: equipe.id, 
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
    revalidatePath("/dashboardclient");

    return {
      success: true,
      message: `Vous avez rejoint l'équipe ${equipe.nom} avec succès.`,
      equipeId: equipe.id, 
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

export async function modifierRoleEtPoste(
  equipeId: string, 
  membreId: string, 
  data: z.infer<typeof ChangementDonneeJoueur>
) {
  try {
 
    const validation = ChangementDonneeJoueur.safeParse(data);
    if (!validation.success) {
      return {
        success: false,
        message: "Données invalides",
        erreurs: validation.error.format()
      };
    }

    const session = await auth();
    const idUtilisateur = session?.user?.id;

    if (!idUtilisateur) {
      return {
        success: false,
        message: "Vous devez être connecté"
      };
    }

    const coachEquipe = await prisma.membreEquipe.findFirst({
      where: {
        userId: idUtilisateur,
        equipeId: equipeId,
        role: "ENTRAINEUR",
      },
    });

    if (!coachEquipe) {
      return {
        success: false,
        message: "Seuls les coachs de cette équipe peuvent modifier les rôles"
      };
    }

    const dataToUpdate: { 
      role: 'ENTRAINEUR' | 'JOUEUR', 
      posteJoueur?: 'GARDIEN' | 'DEFENSEUR' | 'MILIEU' | 'ATTAQUANT' | null 
    } = {
      role: data.role,
      posteJoueur: data.role === 'ENTRAINEUR' ? null : data.posteJoueur
    };

    const result = await prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: membreId },
        data: {
          roleEquipe: data.role,
        },
      });

      return await tx.membreEquipe.update({
        where: { userId: membreId },
        data: dataToUpdate,
      });
    });

    revalidatePath(`/dashboardclient/equipe/${equipeId}`);

    return {
      success: true,
      message: `Le rôle a été mis à jour avec succès`,
      role: result.role,
      poste: result.posteJoueur
    };

  } catch (error) {
    console.error("Erreur lors de la modification du rôle:", error);
    return {
      success: false,
      message: "Erreur lors de la modification du rôle"
    };
  }
}

export async function supprimerMembreEquipe(
  equipeId: string, 
  membreId: string
) {
  try {
    const session = await auth();
    const idUtilisateur = session?.user?.id;

    if (!idUtilisateur) {
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

    const joueurauclub = await prisma.membreEquipe.findUnique({
      where: { userId: membreId },
      include: { user: { select: { name: true } } },
    });

    if (!joueurauclub) {
      return {
        success: false,
        message: "Ce joueur ne fait pas partie de ce club"
      };
    }

    const coachEquipe = await prisma.membreEquipe.findFirst({
      where: {
        userId: idUtilisateur,
        equipeId: equipeId,
        role: "ENTRAINEUR",
      },
    });

    if (!coachEquipe) {
      return {
        success: false,
        message: "Seuls les coachs de cette équipe peuvent supprimer les membres du club"
      };
    }
  
    const nomJoueur = joueurauclub.user.name;

    await prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: membreId },
        data: {
          roleEquipe: "SANSCLUB",
          AunClub: "NON",
        },
      });

      await tx.membreEquipe.delete({
        where: { id: joueurauclub.id },
      });
    });

    revalidatePath(`/dashboardclient/equipe/${equipeId}`);

    return {
      success: true,
      message: `Le joueur ${nomJoueur} a bien été retiré du club`
    };

  } catch (error) {
    console.error(
      "Erreur serveur lors de la suppression du membre",
      error
    );
    return {
      success: false,
      message: "Erreur serveur lors de la suppression du membre"
    };
  }
}

export async function supprimerCodeInvitation(equipeId: string) {
  try {
    const session = await auth();
    const idUtilisateur = session?.user?.id;

    if (!idUtilisateur) {
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
        userId: idUtilisateur,
        equipeId: equipeId,
        role: "ENTRAINEUR",
      },
    });

    if (!membreEquipe) {
      return {
        success: false,
        message: "Seuls les coachs peuvent supprimer le code d'invitation"
      };
    }

    if (!equipe.codeInvitation) {
      return {
        success: false,
        message: `Aucun code d'invitation existant pour l'équipe ${equipe.nom}`
      };
    }

    await prisma.equipe.update({
      where: { id: equipeId },
      data: { codeInvitation: null },
    });

    revalidatePath(`/dashboardclient/equipe/${equipeId}`);

    return {
      success: true,
      message: `Code d'invitation de l'équipe ${equipe.nom} supprimé`
    };

  } catch (error) {
    console.error("Erreur lors de la suppression du code d'invitation:", error);
    return {
      success: false,
      message: "Erreur lors de la suppression du code d'invitation"
    };
  }
}

export async function quitterEquipe(equipeId: string, membreId?: string) {
  try {
    const session = await auth();
    const idUtilisateurConnecte = session?.user?.id;

    if (!idUtilisateurConnecte) {
      return {
        success: false,
        message: "Vous devez être connecté"
      };
    }

    const idMembreASupprimer = membreId || idUtilisateurConnecte;
    
    const equipe = await prisma.equipe.findUnique({
      where: { id: equipeId },
    });

    if (!equipe) {
      return {
        success: false,
        message: "Équipe non trouvée"
      };
    }

    if (idUtilisateurConnecte !== idMembreASupprimer) {
      const membreConnecte = await prisma.membreEquipe.findFirst({
        where: {
          userId: idUtilisateurConnecte,
          equipeId: equipeId,
          role: "ENTRAINEUR",
        },
      });

      if (!membreConnecte) {
        return {
          success: false,
          message: "Vous n'avez pas les droits pour effectuer cette action"
        };
      }
    }

    const membreASupprimer = await prisma.membreEquipe.findFirst({
      where: {
        userId: idMembreASupprimer,
        equipeId: equipeId,
      },
      include: {
        user: {
          select: { name: true }
        }
      }
    });

    if (!membreASupprimer) {
      return {
        success: false,
        message: "L'utilisateur n'est pas membre de cette équipe"
      };
    }

    if (membreASupprimer.role === "ENTRAINEUR") {
      const nombreCoachs = await prisma.membreEquipe.count({
        where: {
          equipeId: equipeId,
          role: "ENTRAINEUR",
        },
      });

      if (nombreCoachs === 1) {
        return {
          success: false,
          message: "Vous êtes le dernier coach de l'équipe. Veuillez supprimer l'équipe plutôt que de la quitter."
        };
      }
    }

    const nomUtilisateur = membreASupprimer.user?.name || "L'utilisateur";

    await prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: idMembreASupprimer },
        data: {
          roleEquipe: "SANSCLUB",
          AunClub: "NON",
        },
      });

      await tx.statistiqueJoueur.deleteMany({
        where: {
          userId: idMembreASupprimer,
          evenement: {
            equipeId: equipeId,
          },
        },
      });

      await tx.presence.deleteMany({
        where: {
          userId: idMembreASupprimer,
          evenement: {
            equipeId: equipeId,
          },
        },
      });

      await tx.membreEquipe.delete({
        where: {
          id: membreASupprimer.id,
        },
      });
    });

    revalidatePath(`/dashboardclient/equipe/${equipeId}`);
    revalidatePath(`/dashboardclient`);

    return {
      success: true,
      message: `${nomUtilisateur} a quitté l'équipe ${equipe.nom} avec succès`
    };
  } catch (error) {
    console.error("Erreur serveur lors de la suppression du membre", error);
    return {
      success: false,
      message: "Erreur serveur lors de la suppression du membre"
    };
  }
}