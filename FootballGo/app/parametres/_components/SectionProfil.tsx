'use client'

import { useSession } from "next-auth/react"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Mail, Lock, User, CreditCard, Calendar, Clock } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import { Badge } from "@/components/ui/badge"
import { InfoCard } from "../_components/InfoCard"

interface UserData {
  id: string
  name: string | null
  email: string | null
  image: string | null
  plan: 'free' | 'pro'
  abonnement: {
    periode: 'mois' | 'année'
    datedebut: string
    datefin: string
  } | null
}

interface SectionProfilProps {
  userId: string
}

export function SectionProfil({ userId }: SectionProfilProps) {
  const { data: session } = useSession()

  const { data: userAccounts } = useQuery({
    queryKey: ['userAccounts', userId],
    queryFn: async () => {
      const response = await fetch(`/api/user/accounts?userId=${userId}`)
      if (!response.ok) throw new Error('Échec de la récupération des comptes')
      return response.json()
    }
  })

  const { data: userData, isLoading } = useQuery<UserData>({
    queryKey: ['userData', userId],
    queryFn: async () => {
      const response = await fetch(`/api/user/profil?userId=${userId}`)
      if (!response.ok) throw new Error('Échec de la récupération des données utilisateur')
      return response.json()
    }
  })

  const hasProvider = userAccounts?.length > 0

  if (isLoading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="animate-pulse text-gray-500">Chargement...</div>
      </div>
    )
  }

  if (!userData) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-gray-500">Aucune donnée disponible</div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Card className="backdrop-blur-sm bg-white/90 dark:bg-gray-900/90 shadow-xl rounded-xl overflow-hidden">
        <div className="relative">
          <div className="absolute inset-0 h-32 bg-gradient-to-r from-purple-600 to-blue-600 opacity-90" />
          
          <div className="relative pt-16 px-6 pb-6">
            <div className="flex flex-col items-center text-center gap-6">
              <Avatar className="w-24 h-24 border-4 border-white dark:border-gray-800 shadow-lg ring-4 ring-purple-600/20">
                <AvatarImage 
                  src={session?.user?.image ?? ""} 
                  alt={session?.user?.name ?? "Avatar"}
                  className="object-cover"
                />
                <AvatarFallback className="text-2xl bg-gradient-to-br from-purple-500 to-blue-500 text-white">
                  {session?.user?.name?.[0]?.toUpperCase() ?? "U"}
                </AvatarFallback>
              </Avatar>

              <div className="space-y-3">
                <h2 className="text-2xl font-bold">{userData.name}</h2>
                {hasProvider && (
                  <Badge variant="outline" className="bg-white/90 dark:bg-gray-800/90">
                    <span className="flex items-center gap-1.5">
                    Connecté via {userAccounts[0]?.provider.charAt(0).toUpperCase() + userAccounts[0]?.provider.slice(1).toLowerCase()}
                    </span>
                  </Badge>
                )}
              </div>
            </div>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <InfoCard
                icon={<Mail className="w-5 h-5" />}
                title="Email"
                content={userData.email ?? '-'}
              />

              <InfoCard
                icon={<User className="w-5 h-5" />}
                title="Pseudo"
                content={userData.name ?? '-'}
              />

              {!hasProvider && (
                <InfoCard
                  icon={<Lock className="w-5 h-5" />}
                  title="Mot de passe"
                  content="••••••••"
                />
              )}

              <div className="md:col-span-2">
                <InfoCard
                  icon={<CreditCard className="w-5 h-5" />}
                  title="Abonnement"
                  content={
                    <div className="space-y-4">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge 
                          className={userData.plan === 'pro' 
                            ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white' 
                            : 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                          }
                        >
                          {userData.plan === 'pro' ? 'Premium' : 'Gratuit'}
                        </Badge>
                        {userData.abonnement && (
                          <Badge variant="outline">
                            {userData.abonnement.periode === 'mois' ? 'Mensuel' : 'Annuel'}
                          </Badge>
                        )}
                      </div>

                      {userData.abonnement && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="flex items-center gap-2 text-sm">
                            <Calendar className="w-4 h-4 text-gray-500" />
                            <span>
                              Début: {new Date(userData.abonnement.datedebut).toLocaleDateString('fr-FR')}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Clock className="w-4 h-4 text-gray-500" />
                            <span>
                              Fin: {new Date(userData.abonnement.datefin).toLocaleDateString('fr-FR')}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  }
                  cardClassName="bg-white/50 dark:bg-gray-800/50"
                />
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}