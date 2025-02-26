import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table";
  import { Checkbox } from "@/components/ui/checkbox";
  import { Button } from "@/components/ui/button";
  import Image from "next/image";
  import BadgeRole from "./BadgeRole";
  import BadgeAbonnement from "./BadgeAbonnement";
  import { RoleSelect } from "./select";
  import { Role, Utilisateur} from "../(interface-types)/Interface-Types";
import BadgeTypeAbonnement from "./BadgeTypeAbonnement";
  
  interface UsersTableProps {
    utilisateurFiltre: Utilisateur[];
    utilisateursSelectionnes: string[];
    loadingUsers: Record<string, boolean>;
    gererSelectionTotale: (checked: boolean) => void;
    gererSelectionUtilisateur: (checked: boolean, id: string) => void;
    handleRoleChange: (userId: string, newRole: Role) => void;
    gererSuppression: () => void;
    isPending: boolean;
    utilisateurs: Utilisateur[];
  }
  
  export const UsersTable: React.FC<UsersTableProps> = ({
    utilisateurFiltre,
    utilisateursSelectionnes,
    loadingUsers,
    gererSelectionTotale,
    gererSelectionUtilisateur,
    handleRoleChange,
    gererSuppression,
    isPending,
    utilisateurs,
  }) => {
    return (
      <>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <Checkbox
                    checked={utilisateursSelectionnes.length === utilisateurs.length}
                    onCheckedChange={gererSelectionTotale}
                  />
                </TableHead>
                <TableHead className="font-bold text-black">Avatar</TableHead>
                <TableHead className="font-bold text-black">Role</TableHead>
                <TableHead className="font-bold text-black">Pseudo</TableHead>
                <TableHead className="font-bold text-black">Email</TableHead>
                <TableHead className="font-bold text-black">Créé le</TableHead>
                <TableHead className="font-bold text-black">Abonnement</TableHead>
                <TableHead className="font-bold text-black">Periode</TableHead>

              </TableRow>
            </TableHeader>
  
            <TableBody>
              {utilisateurFiltre.map((utilisateur) => (
                <TableRow key={utilisateur.id}>
                  <TableCell>
                    <Checkbox
                      checked={utilisateursSelectionnes.includes(utilisateur.id)}
                      onCheckedChange={(checked: boolean) =>
                        gererSelectionUtilisateur(checked, utilisateur.id)
                      }
                    />
                  </TableCell>
                  <TableCell className="font-medium">
                    <div className="relative h-10 w-10">
                      {utilisateur.image ? (
                        <Image
                          src={utilisateur.image}
                          alt={utilisateur.name || "Avatar"}
                          width={40}
                          height={40}
                          className="rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gray-400 flex items-center justify-center text-black">
                          {utilisateur?.name?.[0]?.toUpperCase() || "?"}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <BadgeRole utilisateur={utilisateur} />
                  </TableCell>
                  <TableCell>{utilisateur.name}</TableCell>
                  <TableCell>{utilisateur.email}</TableCell>
                  <TableCell>
                    {new Date(utilisateur.createdAt).toLocaleDateString("fr-FR")}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <BadgeAbonnement utilisateur={utilisateur} />
                      <RoleSelect
                        RoleActuel={utilisateur.role}
                        isLoading={loadingUsers[utilisateur.id]}
                        onRoleChange={(newRole) =>
                          handleRoleChange(utilisateur.id, newRole)
                        }
                      />
                    </div>
                  </TableCell>
                  <TableCell>
                    {!utilisateur.abonnement?.periode ? "Freemium" : <BadgeTypeAbonnement abonnement={utilisateur.abonnement.periode}/> }
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
  
        {utilisateursSelectionnes.length > 0 && (
          <div className="flex justify-end mt-4 gap-4">
            <Button
              variant="destructive"
              onClick={gererSuppression}
              disabled={isPending}
            >
              {isPending
                ? "Suppression..."
                : `Supprimer (${utilisateursSelectionnes.length})`}
            </Button>
          </div>
        )}
      </>
    );
  };