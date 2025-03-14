"use client";

import { useCreerPresence } from "../(hooks)/usePresence";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import toast from "react-hot-toast";
import { useState } from "react";
import { StatutPresence } from "../(interface-types)/Presence";
import { CheckCircle, XCircle, HelpCircle, Clock } from "lucide-react";

interface PresenceFormProps {
  evenementId: string;
  titre?: string;
  typeEvenement?: string;
  description?: string;
  statutActuel?: StatutPresence;
  onSuccess?: () => void;
}

export default function PresenceForm({
  evenementId,
  titre = "Indiquer votre présence",
  typeEvenement,
  description,
  statutActuel,
  onSuccess,
}: PresenceFormProps) {
  const [statut, setStatut] = useState<StatutPresence>(statutActuel || "EN_ATTENTE");
  const { mutate: creerOuMettreAJourPresence, isPending } = useCreerPresence();

  const handleSubmit = () => {
    creerOuMettreAJourPresence(
      { evenementId, statut },
      {
        onSuccess: (resultat) => {
          if (resultat.success) {
            toast.success(resultat.message);
            if (onSuccess) onSuccess();
          } else {
            toast.error(resultat.message);
          }
        },
        onError: () => {
          toast.error("Une erreur est survenue lors de l'enregistrement de votre présence");
        },
      }
    );
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>{titre}</CardTitle>
        {typeEvenement && <CardDescription>{typeEvenement}</CardDescription>}
        {description && <p className="mt-2 text-sm text-gray-500">{description}</p>}
      </CardHeader>
      <CardContent>
        <RadioGroup
          value={statut}
          onValueChange={(value) => setStatut(value as StatutPresence)}
          className="flex flex-col space-y-3"
        >
          <div className="flex items-center space-x-2 rounded-md border p-3 cursor-pointer hover:bg-gray-50">
            <RadioGroupItem value="PRESENT" id="present" />
            <Label
              htmlFor="present"
              className="flex items-center cursor-pointer justify-between flex-1"
            >
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Présent</span>
              </div>
            </Label>
          </div>

          <div className="flex items-center space-x-2 rounded-md border p-3 cursor-pointer hover:bg-gray-50">
            <RadioGroupItem value="ABSENT" id="absent" />
            <Label
              htmlFor="absent"
              className="flex items-center cursor-pointer justify-between flex-1"
            >
              <div className="flex items-center gap-2">
                <XCircle className="h-4 w-4 text-red-500" />
                <span>Absent</span>
              </div>
            </Label>
          </div>

          <div className="flex items-center space-x-2 rounded-md border p-3 cursor-pointer hover:bg-gray-50">
            <RadioGroupItem value="INCERTAIN" id="incertain" />
            <Label
              htmlFor="incertain"
              className="flex items-center cursor-pointer justify-between flex-1"
            >
              <div className="flex items-center gap-2">
                <HelpCircle className="h-4 w-4 text-yellow-500" />
                <span>Incertain</span>
              </div>
            </Label>
          </div>

          <div className="flex items-center space-x-2 rounded-md border p-3 cursor-pointer hover:bg-gray-50">
            <RadioGroupItem value="EN_ATTENTE" id="en_attente" />
            <Label
              htmlFor="en_attente"
              className="flex items-center cursor-pointer justify-between flex-1"
            >
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-gray-500" />
                <span>En attente</span>
              </div>
            </Label>
          </div>
        </RadioGroup>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleSubmit} 
          disabled={isPending}
          className="w-full"
        >
          {isPending ? "Enregistrement en cours..." : "Enregistrer ma présence"}
        </Button>
      </CardFooter>
    </Card>
  );
} 