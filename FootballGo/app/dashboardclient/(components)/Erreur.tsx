import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import React from 'react'

const Erreur = () => {
  return (
    <>
    <Card className="border-red-200 bg-red-50">
        <CardHeader>
          <CardTitle className="text-red-700">Erreur</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-600">
            Une erreur est survenue lors de la récupération des données de
            l'équipe.
          </p>
        </CardContent>
      </Card>
    </>
  )
}

export default Erreur