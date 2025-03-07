import { SidebarServeur } from "@/components/sidebar-server";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { ProtectionRouteAvecSession } from "../utils/SessionUtilisateur";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Activity, Users, Target } from "lucide-react";

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
      
          <div className="flex flex-wrap gap-4 items-center p-4 rounded-lg bg-background border shadow-sm">
            <span className="text-sm font-medium"> 
              Rentrez un code pour rejoindre une équipe : 
            </span>
            <div className="flex flex-1 gap-2">
              <Input 
                type="text" 
                placeholder="Code" 
                className="max-w-xs"
              />
              <Button variant="default" size="sm">
                Rejoindre
              </Button>
            </div>
            <Button variant="default">
              Créer une équipe
            </Button>
          </div>
          
     
          <div className="flex flex-wrap gap-4 md:flex-nowrap">
            <Card className="w-full">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Utilisateurs Actifs
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">+573</div>
                <p className="text-xs text-muted-foreground">
                  +12% par rapport au mois dernier
                </p>
              </CardContent>
            </Card>
            
            <Card className="w-full">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Sessions Totales
                </CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12,234</div>
                <p className="text-xs text-muted-foreground">
                  +2.1% par rapport à la semaine dernière
                </p>
              </CardContent>
            </Card>
            
            <Card className="w-full">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Objectifs Complétés
                </CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">73%</div>
                <p className="text-xs text-muted-foreground">
                  +10.1% par rapport au mois dernier
                </p>
              </CardContent>
            </Card>
          </div>
          
          {/* Zone de contenu principal */}
          <div className="min-h-[50vh] flex-1 rounded-xl bg-muted/20 p-6 md:min-h-min border shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Activités récentes</h2>
            <p className="text-muted-foreground">Aucune activité récente à afficher.</p>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}