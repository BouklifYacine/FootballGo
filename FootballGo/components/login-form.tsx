import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Creer une équipe</CardTitle>
          <CardDescription>
            Rentrez vos informations en dessous
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Nom de votre équipe </Label>
                <Input
                  id="text"
                  type="text"
                  placeholder="FC SAINT PRIEST"
                  required
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="Description">Description</Label>
                 
                </div>
                <Input id="Description" type="Description" />
              </div>
              <Button type="submit" className="w-full">
                Créer équipe
              </Button>
           
            </div>
        
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
