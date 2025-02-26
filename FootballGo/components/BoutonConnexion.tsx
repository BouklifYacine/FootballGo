import Link from "next/link";
import { Button } from "./ui/button";

export function BoutonConnexion() {
  return (
    <>
      <Link href="/connexion">
        <Button
          variant="ghost"
          className="hover:bg-gray-300 bg-white text-black flex items-center gap-2"
        >
          Connexion
        </Button>
      </Link>
    </>
  );
}
