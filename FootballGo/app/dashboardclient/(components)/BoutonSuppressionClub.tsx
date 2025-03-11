'use client';

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useSupprimerEquipe } from "../(hooks)/UseDashboardClient";


interface BoutonSupprimerEquipeProps {
  equipeId: string;
  nomEquipe: string;
}

export function BoutonSupprimerEquipe({ equipeId, nomEquipe }: BoutonSupprimerEquipeProps) {
  const [ouvert, setOuvert] = useState(false);
  const [confirmation, setConfirmation] = useState(false);
  const supprimerEquipeMutation = useSupprimerEquipe(equipeId);
  
  const handleSupprimer = () => {
    if (confirmation) {
      supprimerEquipeMutation.mutate();
      setOuvert(false);
    }
  };
  
  return (
    <AlertDialog open={ouvert} onOpenChange={setOuvert}>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="sm" className="flex items-center gap-1">
          <Trash2 className="h-4 w-4" />
          <span>Supprimer l'équipe</span>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Êtes-vous sûr de vouloir supprimer cette équipe ?</AlertDialogTitle>
          <AlertDialogDescription>
            Cette action est irréversible. La suppression de l'équipe <strong>{nomEquipe}</strong> entraînera :
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>La perte de tous les membres associés</li>
              <li>La suppression de tous les événements liés</li>
              <li>Les membres perdront leur affiliation à l'équipe</li>
            </ul>
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <div className="flex items-center space-x-2 py-4 border-t">
          <Checkbox 
            id="confirm" 
            checked={confirmation} 
            onCheckedChange={(checked) => setConfirmation(!!checked)} 
          />
          <label
            htmlFor="confirm"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Je comprends les conséquences et je confirme la suppression
          </label>
        </div>
        
        <AlertDialogFooter>
          <AlertDialogCancel>Annuler</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleSupprimer}
            disabled={!confirmation || supprimerEquipeMutation.isPending}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {supprimerEquipeMutation.isPending ? "Suppression..." : "Supprimer définitivement"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}