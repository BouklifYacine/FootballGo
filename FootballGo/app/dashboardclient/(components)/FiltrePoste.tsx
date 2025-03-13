import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Filter } from 'lucide-react'
import React from 'react'

interface FiltrePosteProps {
    filtrePoste : string
    setFiltrePoste : (value : string) => void
}

const FiltrePoste = ({filtrePoste, setFiltrePoste} : FiltrePosteProps) => {
  return (
    <>
      <Select value={filtrePoste} onValueChange={setFiltrePoste}>
                    <SelectTrigger className="w-full sm:w-36 h-9 text-sm">
                      <div className="flex items-center">
                        <Filter className="mr-2 h-3.5 w-3.5 text-muted-foreground" />
                        <SelectValue placeholder="Poste" />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="TOUS">Tous les postes</SelectItem>
                      <SelectItem value="GARDIEN">Gardien</SelectItem>
                      <SelectItem value="DEFENSEUR">Défenseur</SelectItem>
                      <SelectItem value="MILIEU">Milieu</SelectItem>
                      <SelectItem value="ATTAQUANT">Attaquant</SelectItem>
                      <SelectItem value="AUCUN">Sans poste</SelectItem>
                    </SelectContent>
                  </Select>
    </>
  )
}

export default FiltrePoste