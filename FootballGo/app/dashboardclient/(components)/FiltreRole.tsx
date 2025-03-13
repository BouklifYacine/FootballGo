import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select";
  import { Filter } from "lucide-react";

  
  interface FiltreRoleProps {
    filtreRole: string;  
    setFiltreRole: (value: string) => void;
  }
  
  const FiltreRole = ({ filtreRole, setFiltreRole }: FiltreRoleProps) => {
    return (
      <Select value={filtreRole} onValueChange={setFiltreRole}>
        <SelectTrigger className="w-full sm:w-32 h-9 text-sm">
          <div className="flex items-center">
            <Filter className="mr-2 h-3.5 w-3.5 text-muted-foreground" />
            <SelectValue placeholder="Rôle" />
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="TOUS">Tous les rôles</SelectItem>
          <SelectItem value="ENTRAINEUR">Entraineur</SelectItem>
          <SelectItem value="JOUEUR">Joueur</SelectItem>
        </SelectContent>
      </Select>
    );
  };
  
  export default FiltreRole;