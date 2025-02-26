"use client";

import React, { useState } from "react";
import { Mail, Lock, User } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { inscriptionAction } from "@/app/(actions)/InscriptionAction";
import { useRouter } from "next/navigation";
import BoutonConnexionProviders from "@/components/BoutonConnexionProviders";
import { z } from "zod";
import SchemaInscription from "@/app/(schema)/SchemaInscription";
import { InputPassword } from "../parametres/_components/InputPassword";

type Schema = z.infer<typeof SchemaInscription>;

const ClientInscriptionFormulaire = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<Schema>({
    resolver: zodResolver(SchemaInscription),
  });

  const router = useRouter();
  const [erreurmessage, setErreurMessage] = useState("");

  const onSubmit = async (data: Schema) => {
    try {
      const result = await inscriptionAction(data);

      if (result.success) {
        router.push("/connexion");
        reset();
        setErreurMessage("");
      } else {
        setErreurMessage("Inscription échouée");
      }
    } catch (error) {
      console.error('Erreur API:', error);
      setErreurMessage("Une erreur est survenue");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Nom</label>
        <div className="relative">
          <User
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            {...register("name")}
            type="text"
            className="w-full pl-10 pr-3 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Votre nom"
          />
        </div>
        {errors.name && (
          <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Email</label>
        <div className="relative">
          <Mail
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            {...register("email")}
            type="email"
            className="w-full pl-10 pr-3 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="votre@email.com"
          />
        </div>
        {errors.email && (
          <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Mot de passe
        </label>
        <div className="relative">
          <Lock
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={20}
          />
        
             <InputPassword
                         {...register("password")}
                        />
        </div>
        {errors.password && (
          <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
        )}
      </div>

      {erreurmessage && (
        <p className="text-red-500 text-sm text-center">{erreurmessage}</p>
      )}

      <button
        type="submit"
        className={`w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors ${
          isSubmitting ? "opacity-50" : ""
        }`}
        disabled={isSubmitting}
      >
        {isSubmitting ? "Chargement" : "S'inscrire"}
      </button>

      <div className="relative my-4">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">Ou continuer avec</span>
        </div>
      </div>

      <BoutonConnexionProviders />

      <p className="text-center text-sm text-gray-600 mt-4">
        Déjà inscrit?{" "}
        <Link href="/connexion" className="text-blue-600 hover:text-blue-700">
          Se connecter
        </Link>
      </p>
    </form>
  );
};

export default ClientInscriptionFormulaire;
