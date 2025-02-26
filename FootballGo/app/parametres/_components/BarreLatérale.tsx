'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { SectionEmail } from './SectionEmail'
import { SectionMotDePasse } from './SectionMotDePasse'
import { SectionPseudo } from './SectionPseudo'
import { SectionSuppression } from './SectionSuppressionCompte'
import { SectionProfil } from './SectionProfil'
import { Mail, Key, User, Trash2, UserCircle } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'

type Section = 'profil' | 'email' | 'motdepasse' | 'pseudo' | 'suppression'

interface BarreLateraleProps {
  userId: string;
}

export function BarreLaterale({ userId }: BarreLateraleProps) {
  const [sectionActive, setSectionActive] = useState<Section>('profil')

  const { data: userAccounts } = useQuery({
    queryKey: ['userAccounts', userId],
    queryFn: async () => {
      const response = await fetch(`/api/user/accounts?userId=${userId}`)
      if (!response.ok) throw new Error('Failed to fetch user accounts')
      return response.json()
    }
  })

  const hasProvider = userAccounts?.length > 0

  const sections = [
    {
      id: 'profil' as Section,
      label: 'Profil',
      icon: UserCircle,
      show: true
    },
    {
      id: 'email' as Section,
      label: 'Email',
      icon: Mail,
      show: !hasProvider
    },
    {
      id: 'motdepasse' as Section,
      label: 'Mot de passe',
      icon: Key,
      show: !hasProvider
    },
    {
      id: 'pseudo' as Section,
      label: 'Pseudo',
      icon: User,
      show: !hasProvider
    },
    {
      id: 'suppression' as Section,
      label: 'Supprimer le compte',
      icon: Trash2,
      danger: true,
      show: true
    }
  ]

  const filteredSections = sections.filter(section => section.show)

  return (
    <>
      <Card className="p-4 space-y-4 h-fit">
        <nav className="flex flex-col space-y-1">
          {filteredSections.map((section) => (
            <Button
              key={section.id}
              variant={sectionActive === section.id ? 'default' : 'ghost'}
              className={`justify-start ${section.danger ? 'text-destructive hover:text-destructive' : ''}`}
              onClick={() => setSectionActive(section.id)}
            >
              <section.icon className="mr-2 h-4 w-4" />
              {section.label}
            </Button>
          ))}
        </nav>
      </Card>

      <div className="space-y-8">
        {sectionActive === 'profil' && <SectionProfil userId={userId} />}
        {!hasProvider && sectionActive === 'email' && <SectionEmail  />}
        {!hasProvider && sectionActive === 'motdepasse' && <SectionMotDePasse  />}
        {!hasProvider && sectionActive === 'pseudo' && <SectionPseudo userId={userId} />}
        {sectionActive === 'suppression' && <SectionSuppression userId={userId} />}
      </div>
    </>
  )
}