"use client"
import { signOut } from "next-auth/react"
import { Button } from "./ui/button"
import { LogOut } from "lucide-react"
 
export function Deconnexion() {
  return  <Button 
  onClick={() => signOut()}
  variant="ghost" 
  className="hover:bg-gray-300 bg-white text-black flex items-center gap-2"
>
  Déconnexion <LogOut size={16} />
</Button>
}