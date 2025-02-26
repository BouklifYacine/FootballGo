'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from '@/components/ui/alert'
import { changerPseudo, verifierMotDePasse } from '../actions'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { schemaPseudo, schemaVerificationMotDePasse } from '../schema'
import { InputPassword } from './InputPassword'
import toast from 'react-hot-toast'

export function SectionPseudo({ userId }: { userId: string }) {
  const [enEdition, setEnEdition] = useState(false)
  const [etape, setEtape] = useState<'verification' | 'changement'>('verification')

  const { data: userAccounts } = useQuery({
    queryKey: ['userAccounts', userId],
    queryFn: async () => {
      const response = await fetch(`/api/user/accounts?userId=${userId}`)
      if (!response.ok) throw new Error('Échec de la récupération des comptes')
      return response.json()
    }
  })

  const hasProvider = userAccounts?.length > 0

  const formVerification = useForm({
    resolver: zodResolver(schemaVerificationMotDePasse),
    defaultValues: {
      motdepasse: ''
    }
  })

  const formChangement = useForm({
    resolver: zodResolver(schemaPseudo),
    defaultValues: {
      pseudo: '',
      codeverification: ''
    }
  })

  const verifierMotDePasseMutation = useMutation({
    mutationFn: async (motdepasse: string) => {
      const resultat = await verifierMotDePasse(motdepasse)
      if (resultat.error) throw new Error(resultat.error)
      return resultat
    },
    onSuccess: () => {
      toast.success("Code de vérification envoyé par email")
      setEtape('changement')
      formVerification.reset()
    },
    onError: (error: Error) => {
      toast.error(error.message)
      formVerification.setError('motdepasse', { message: error.message })
    }
  })

  const changerPseudoMutation = useMutation({
    mutationFn: async (data: { pseudo: string, codeverification: string }) => {
      const resultat = await changerPseudo(data)
      if (resultat.error) throw new Error(resultat.error)
      return resultat
    },
    onSuccess: () => {
      toast.success('Pseudo modifié avec succès')
      annuler()
    },
    onError: (error: Error) => {
      if (error.message.includes("Code")) {
        formChangement.setError('codeverification', { message: error.message })
      } else {
        formChangement.setError('pseudo', { message: error.message })
      }
      toast.error(error.message)
    }
  })

  const annuler = () => {
    setEnEdition(false)
    setEtape('verification')
    formVerification.reset()
    formChangement.reset()
  }

  if (!enEdition) {
    return (
      <Card className="p-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold">Pseudo</h2>
            <p className="text-sm text-gray-500">Changez votre pseudo</p>
          </div>
          <Button onClick={() => setEnEdition(true)}>Modifier</Button>
        </div>
      </Card>
    )
  }

  if (!hasProvider && etape === 'verification') {
    return (
      <Card className="p-6">
        <form onSubmit={formVerification.handleSubmit((data) => verifierMotDePasseMutation.mutate(data.motdepasse))} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="motdepasse">Mot de passe actuel</Label>
            <InputPassword
              {...formVerification.register('motdepasse')}
            />
            {formVerification.formState.errors.motdepasse && (
              <Alert variant="destructive">
                <AlertDescription>
                  {formVerification.formState.errors.motdepasse.message}
                </AlertDescription>
              </Alert>
            )}
          </div>
          <div className="flex gap-2">
            <Button 
              type="submit"
              disabled={verifierMotDePasseMutation.isPending}
            >
              {verifierMotDePasseMutation.isPending ? "Vérification..." : "Continuer"}
            </Button>
            <Button type="button" variant="outline" onClick={annuler}>
              Annuler
            </Button>
          </div>
        </form>
      </Card>
    )
  }

  return (
    <Card className="p-6">
      <form onSubmit={formChangement.handleSubmit((data) => changerPseudoMutation.mutate(data))} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="pseudo">Nouveau pseudo</Label>
          <Input
            id="pseudo"
            {...formChangement.register('pseudo')}
            placeholder="Entrez votre nouveau pseudo"
          />
          {formChangement.formState.errors.pseudo && (
            <Alert variant="destructive">
              <AlertDescription>
                {formChangement.formState.errors.pseudo.message}
              </AlertDescription>
            </Alert>
          )}
        </div>

        {!hasProvider && (
          <div className="space-y-2">
            <Label htmlFor="codeverification">Code de vérification</Label>
            <Input
              id="codeverification"
              {...formChangement.register('codeverification')}
              placeholder="Entrez le code reçu par email"
            />
            {formChangement.formState.errors.codeverification && (
              <Alert variant="destructive">
                <AlertDescription>
                  {formChangement.formState.errors.codeverification.message}
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}

        <div className="flex gap-2">
          <Button 
            type="submit"
            disabled={changerPseudoMutation.isPending}
          >
            {changerPseudoMutation.isPending ? "Modification..." : "Changer le pseudo"}
          </Button>
          <Button type="button" variant="outline" onClick={annuler}>
            Annuler
          </Button>
        </div>
      </form>
    </Card>
  )
}