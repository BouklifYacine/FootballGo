'use client';

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useModifierEquipe } from "../(hooks)/UseDashboardClient";
import { ModifierEquipeInputs } from "../(server-actions)/DashboardClient-actions";
import { CreationEquipeSchema } from "@/app/(schema)/SchemaEquipe";


interface BoutonModifierEquipeProps {
  equipeId: string;
  equipe: {
    nom: string;
    description?: string | null;
    logoUrl?: string | null;
  };
}

export function BoutonModifierEquipe({ equipeId, equipe }: BoutonModifierEquipeProps) {
  const [ouvert, setOuvert] = useState(false);
  const modifierEquipeMutation = useModifierEquipe(equipeId);
  
  const form = useForm<ModifierEquipeInputs>({
    resolver: zodResolver(CreationEquipeSchema),
    defaultValues: {
      nom: equipe.nom,
      description: equipe.description || "",
      logoUrl: equipe.logoUrl || "",
    },
  });
  
  const onSubmit = (data: ModifierEquipeInputs) => {
    modifierEquipeMutation.mutate(data, {
      onSuccess: (resultat) => {
        if (resultat.success) {
          setOuvert(false);
        }
      },
    });
  };
  
  return (
    <Dialog open={ouvert} onOpenChange={setOuvert}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          Modifier les infos du club
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Modifier les informations de l'équipe</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="nom"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom de l'équipe</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="logoUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL du logo</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex justify-end">
              <Button 
                type="submit" 
                disabled={modifierEquipeMutation.isPending}
              >
                {modifierEquipeMutation.isPending ? "Enregistrement..." : "Enregistrer"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}