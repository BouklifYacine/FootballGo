export type StatutPresence = "EN_ATTENTE" | "PRESENT" | "ABSENT" | "INCERTAIN";

export interface Presence {
  titre: string;
  typeEvenement: string;
  description: string;
  lieu: string;
  name: string;
  image: string | null;
  statut: StatutPresence;
}

export interface PresenceDetaillée extends Presence {
  userId?: string;
  evenementId: string;
  dateCreation: string;
  dateModification: string;
}

export interface PresenceEvenement {
  evenementId: string;
  userId: string;
  statut: StatutPresence;
} 