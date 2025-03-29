
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/prisma";
import { auth } from "@/auth";
import { changementMotDePasseSchema } from "@/app/(schema)/SchemaParametre";

interface ChangementMotDePasse {
  email: string;
  motdepasseactuel: string;
  nouveaumotdepasse: string;
}

export async function POST(request: NextRequest) {

  const session = await auth()

  if (!session?.user?.id) return NextResponse.json({message : "Vous n'etes pas autorisé"}, {status : 401})
  try {
   
    const { email, motdepasseactuel, nouveaumotdepasse } : ChangementMotDePasse = await request.json();

    if (email !== session.user.email) {
      return NextResponse.json(
        { message: "Vous ne pouvez modifier que votre propre mot de passe" },
        { status: 403 }
      );
    }

    const Validation = changementMotDePasseSchema.safeParse({email , motdepasseactuel , nouveaumotdepasse});

    if(!Validation.success) return NextResponse.json(  { 
      message: "Données invalides", 
      errors: Validation.error.format() 
    },
    { status: 400 }
  );

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user?.password) {
      return NextResponse.json(
        { message: "Compte non trouvé" },
        { status: 404 }
      );
    }

    const MotdePasseValide = await bcrypt.compare(motdepasseactuel, user.password);
    if (!MotdePasseValide) {
      return NextResponse.json(
        { message: "Mot de passe actuel incorrect" },
        { status: 400 }
      );
    }

    const MotDePasseHache = await bcrypt.hash(nouveaumotdepasse, 10);
    await prisma.user.update({
      where: { email },
      data: { password: MotDePasseHache },
    });

    return NextResponse.json({ message: "Mot de passe mis à jour" });
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { message: "Une erreur est survenue" },
      { status: 500 }
    );
  }
}