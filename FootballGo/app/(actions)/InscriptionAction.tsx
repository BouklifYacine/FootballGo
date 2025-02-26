"use server"

import bcrypt from "bcryptjs";
import { z } from "zod";
import SchemaInscription from "@/app/(schema)/SchemaInscription";
import { prisma } from "@/prisma";
import EmailBienvenue from "@/app/(emails)/EmailBievenue";
import { createElement } from "react";
import { sendEmail } from "@/app/utils/email";

type Schema = z.infer<typeof SchemaInscription>;

export async function inscriptionAction(data: Schema) {
  try {

    const validation = SchemaInscription.safeParse(data)
    if (!validation.success){
      return {
        success : false, 
        
      }
    }
    const emailutilisateur = await prisma.user.findUnique({
      where: { email: data.email }
    });
    
    if (emailutilisateur) {
      return {
        success: false,
        error: "Cet email est déja utilisé"
      };
    }

    const nomutilisateur = await prisma.user.findUnique({
      where: { name: data.name }
    });
    
    if (nomutilisateur) {
      return {
        success: false,
        error: "Ce pseudo est déja utilisé"
      };
    }

    const motdepasse = await bcrypt.hash(data.password, 10);

    const emailElement = createElement(EmailBienvenue, { name: data.name });
    await sendEmail({
      to: data.email,
      subject: "Bienvenue!",
      emailComponent: emailElement,
    });

    const nouvelutilisateur = await prisma.user.create({
      data: {
        email: data.email,
        password: motdepasse,
        name: data.name,
      }
    });

    return {
      success: true,
      data: {
        name: nouvelutilisateur.name,
        message: "Inscription réussie"
      }
    };

  } catch (error) {
    return {
      success: false,
      error: error || "Une erreur est survenue lors de l'inscription" 
    };
  }
}