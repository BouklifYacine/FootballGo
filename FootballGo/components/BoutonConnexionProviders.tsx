"use client";
import { signIn } from "next-auth/react";
import Image from "next/image";
import Github from "@/app/public/Github.png";
import Google from "@/app/public/Google.png";
import React from "react";

const BoutonConnexionProviders = () => {
  const ConnexionGithub = async () => {
    await signIn("github", {
      redirect: true,
      callbackUrl: "/",
    });
  };

  const ConnexionGoogle = async () => {
    await signIn("google", {
      redirect: true,
      callbackUrl: "/",
    });
  };

  return (
    <>
      <div className="flex justify-center items-center gap-8">
        <button type="button" onClick={ConnexionGithub}>
          <Image src={Github} alt="GitHub Logo" width={40} height={40} />
        </button>

        <button type="button" onClick={ConnexionGoogle}>
          <Image src={Google} alt="Google Logo" width={40} height={40} />
        </button>
      </div>
    </>
  );
};

export default BoutonConnexionProviders;
