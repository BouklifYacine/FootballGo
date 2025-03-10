import { SidebarServeur } from "@/components/sidebar-server";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { ProtectionRouteAvecSession } from "../utils/SessionUtilisateur";
import ClientStats from "./components/client-stats";
import InputCodeInvitation from "./components/InputCodeInvitation";

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
          <InputCodeInvitation></InputCodeInvitation>
          <ClientStats />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
