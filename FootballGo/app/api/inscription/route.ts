import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import SchemaInscription from "@/app/(schema)/SchemaInscription";
import { prisma } from "@/prisma";
import EmailBienvenue from "@/app/(emails)/EmailBievenue";
import { createElement } from "react";
import { sendEmail } from "@/app/utils/email";

export async function POST(request: NextRequest) {
  const { email, password, name } = await request.json();

  const emailElement = createElement(EmailBienvenue, { name });
  const validation = SchemaInscription.safeParse({ email, password, name });
  if (!validation.success) {
    return NextResponse.json(
      { message: validation.error.errors[0].message },
      { status: 400 }
    );
  }

  const emailutilisateur = await prisma.user.findUnique({
    where: { email },
  });

  if (emailutilisateur)
    return NextResponse.json("Cet email est déja utilisé", { status: 400 });

  const nomutilisateur = await prisma.user.findUnique({
    where: { name },
  });

  if (nomutilisateur)
    return NextResponse.json("Ce pseudo est déja utilisé ", { status: 400 });

  const motdepasse = await bcrypt.hash(password, 10);

  await sendEmail({
    to: email,
    subject: "Bienvenue!",
    emailComponent: emailElement,
  });

  const nouvelutilisateur = await prisma.user.create({
    data: {
      email,
      password: motdepasse,
      name,
    },
  });

  return NextResponse.json({
    name: nouvelutilisateur.name,
    message: "Inscription réussie ",
  });
}
