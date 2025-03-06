import { AppSidebar } from "@/components/app-sidebar"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { UsersIcon, BarChartIcon, FileTextIcon } from "lucide-react"

export default function Page() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        {/* En-tête de page avec fil d'Ariane */}
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
          </div>
        </header>
        
        {/* Contenu principal - utilisation de flexbox */}
        <main className="flex flex-col p-6">
          {/* Trois cartes en flexbox */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            {/* Carte 1 */}
            <Card className="flex-1">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Utilisateurs</CardTitle>
                <UsersIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,823</div>
                <p className="text-xs text-muted-foreground">+15% depuis le mois dernier</p>
              </CardContent>
            </Card>
            
            {/* Carte 2 */}
            <Card className="flex-1">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Projets</CardTitle>
                <FileTextIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">24</div>
                <p className="text-xs text-muted-foreground">3 nouveaux cette semaine</p>
              </CardContent>
            </Card>
            
            {/* Carte 3 */}
            <Card className="flex-1">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Revenus</CardTitle>
                <BarChartIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">8,250 €</div>
                <p className="text-xs text-muted-foreground">+2.5% depuis la semaine dernière</p>
              </CardContent>
            </Card>
          </div>
          
         
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}