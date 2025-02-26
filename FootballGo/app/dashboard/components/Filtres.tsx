import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface FiltersSectionProps {
  filtreabonnement: boolean;
  setFiltreAbonnement: (value: boolean) => void;
  filtreabommentannuel: boolean;
  setFiltreAbonnementAnnuel: (value: boolean) => void;
  filtreabonnementmensuel: boolean;
  setFiltreAbonnementMensuel: (value: boolean) => void;
  filtreAdmin: boolean;
  setFiltreAdmin: (value: boolean) => void;
  recherche: string;
  setRecherche: (value: string) => void;
}

export const Filtres: React.FC<FiltersSectionProps> = ({
  filtreabonnement,
  setFiltreAbonnement,
  filtreAdmin,
  setFiltreAdmin,
  filtreabommentannuel,
  setFiltreAbonnementAnnuel,
  filtreabonnementmensuel,
  setFiltreAbonnementMensuel,
  recherche,
  setRecherche,
}) => {
  return (
    <div className="flex justify-end gap-2">
      <Button
        onClick={() => setFiltreAbonnement(!filtreabonnement)}
        variant={filtreabonnement ? "default" : "outline"}
      >
        Abonnement
      </Button>
      <Button
        onClick={() => setFiltreAdmin(!filtreAdmin)}
        variant={filtreAdmin ? "default" : "outline"}
      >
        Admin
      </Button>
      <Button
        onClick={() => setFiltreAbonnementAnnuel(!filtreabommentannuel)}
        variant={filtreabommentannuel ? "default" : "outline"}
      >
        Abo annuel
      </Button>
      <Button
        onClick={() => setFiltreAbonnementMensuel(!filtreabonnementmensuel)}
        variant={filtreabonnementmensuel ? "default" : "outline"}
      >
        Abo mensuel
      </Button>
      <Input
        value={recherche}
        onChange={(e) => setRecherche(e.target.value)}
        className="w-52 mb-5"
        type="text"
        placeholder="Pseudo"
      />
    </div>
  );
};
