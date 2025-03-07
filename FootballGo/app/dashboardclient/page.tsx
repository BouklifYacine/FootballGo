import { SidebarServeur } from "@/components/sidebar-server";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { ProtectionRouteAvecSession } from "../utils/SessionUtilisateur";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ClientStats from "./components/client-stats";

export default async function DashboardPage() {
  await ProtectionRouteAvecSession();

  return (
    <SidebarProvider>
      <SidebarServeur />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          {/* Barre de code de validation */}
          <div className="flex flex-wrap gap-4 items-center p-4 rounded-lg bg-background border shadow-sm">
            <span className="text-sm font-medium">
              Rentrez un code pour rejoindre une équipe :
            </span>
            <div className="flex flex-1 gap-2">
              <Input type="text" placeholder="Code" className="max-w-xs" />
              <Button variant="default" size="sm">
                Rejoindre
              </Button>
            </div>
            <Button variant="default">Créer une équipe</Button>
          </div>

          <ClientStats />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
