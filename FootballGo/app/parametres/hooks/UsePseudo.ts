'use client'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { schemaVerificationMotDePasse, schemaPseudo } from '../schema'
import { verifierMotDePasse } from '../actions'
import toast from 'react-hot-toast'
import { TypePseudo } from '../schema'

export function usePseudo() {
  const [etape, setEtape] = useState<'verification' | 'changement'>('verification')

  const formVerification = useForm({
    resolver: zodResolver(schemaVerificationMotDePasse),
    defaultValues: {
      motdepasse: ''
    }
  })

  const formChangement = useForm<TypePseudo>({
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
      toast.success("Code de vérification envoyé")
      setEtape('changement')
      formVerification.reset()
    },
    onError: (error: Error) => {
      toast.error(error.message)
      formVerification.setError('motdepasse', { message: error.message })
    }
  })

  const reinitialiser = () => {
    setEtape('verification')
    formVerification.reset()
    formChangement.reset()
  }

  return {
    etape,
    formVerification,
    formChangement,
    verifierMotDePasseMutation,
    reinitialiser
  }
}