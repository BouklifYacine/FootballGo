import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma";
import { createElement } from "react";
import { sendEmail } from "@/app/utils/email";
import CodeConfirmation from "@/app/(emails)/CodeConfirmation";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { message: "Aucun compte n'est associé à cette adresse email" },
        { status: 404 }
      );
    }

    if (!user.password) {
      return NextResponse.json(
        { message: "Ce compte utilise une connexion via Google/Github. La réinitialisation de mot de passe n'est pas disponible." },
        { status: 404 }
      );
    }

    // Génère un code à 6 chiffres
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expirationcode = new Date(Date.now() + 3600000); // 1 heure normalement

    await prisma.user.update({
      where: { email },
      data: {
        resetToken: resetCode,
        resetTokenExpiry: expirationcode,
      },
    });

    const emailElement = createElement(CodeConfirmation, { resetCode , pseudo : user.email || "" });
    await sendEmail({
      to: email,
      subject: "Code de réinitialisation",
      emailComponent: emailElement,
    });

    return NextResponse.json({ message: "Code envoyé par email dans les spams " });
  } catch (error) {
    console.error('Erreur API:', error);
    return NextResponse.json(
      { message: "Erreur serveur" },
      { status: 400 }
    );
  }
}