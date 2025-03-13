import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MembreEquipe } from "../(hooks)/UseDashboardClient";


interface MembreActionsProps {
  membre: MembreEquipe;
}

interface TableauMembresEquipeProps {
  membres: MembreEquipe[];
  estEntraineur: boolean;
  MembreActions: React.FC<MembreActionsProps>;
}

const TableauMembresEquipe = ({
  membres,
  estEntraineur,
  MembreActions,
}: TableauMembresEquipeProps) => {
  return (
    <div className="rounded-md border overflow-auto">
      <Table>
        <TableHeader className="bg-muted/30">
          <TableRow>
            <TableHead className="font-bold">Avatar</TableHead>
            <TableHead className="font-bold">Nom</TableHead>
            <TableHead className="font-bold">Rôle</TableHead>
            <TableHead className="font-bold">Poste</TableHead>
            {estEntraineur && (
              <TableHead className="font-bold">Actions</TableHead>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {membres.map((membre) => (
            <TableRow
              key={membre.id}
              className="hover:bg-muted/10 transition-colors"
            >
              <TableCell>
                <Avatar className="h-10 w-10 border border-muted">
                  <AvatarImage
                    src={
                      membre.user?.image ||
                      `https://api.dicebear.com/7.x/initials/svg?seed=${membre.user?.name || membre.userId}`
                    }
                  />
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {membre.user?.name?.[0]?.toUpperCase() ||
                      membre.userId.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </TableCell>
              <TableCell className="font-medium">
                {membre.user?.name ||
                  `Utilisateur ${membre.userId.substring(0, 8)}`}
              </TableCell>
              <TableCell>
                <Badge
                  variant={
                    membre.role === "ENTRAINEUR" ? "destructive" : "secondary"
                  }
                  className={
                    membre.role === "ENTRAINEUR"
                      ? "bg-red-100 text-red-800 hover:bg-red-200"
                      : ""
                  }
                >
                  {membre.role}
                </Badge>
              </TableCell>
              <TableCell>
                {membre.posteJoueur ? (
                  <Badge
                    variant="outline"
                    className="bg-muted/30 font-normal"
                  >
                    {membre.posteJoueur}
                  </Badge>
                ) : (
                  <span className="text-sm text-muted-foreground">
                    Aucun poste
                  </span>
                )}
              </TableCell>
              {estEntraineur && (
                <TableCell>
                  <MembreActions membre={membre} />
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default TableauMembresEquipe;