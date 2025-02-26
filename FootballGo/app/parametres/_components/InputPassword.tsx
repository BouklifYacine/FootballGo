'use client'

import { forwardRef, useState } from 'react'
import { Input } from "@/components/ui/input"
import { Eye, EyeOff } from "lucide-react"

const InputPassword = forwardRef<HTMLInputElement>((props, ref) => {
  const [montrerMotDePasse, setMontrerMotDePasse] = useState(false)

  return (
    <div className="relative">
      <Input
        type={montrerMotDePasse ? "text" : "password"}
        className='pl-10 pr-10'
          
            placeholder="motdepasse"
        ref={ref}
        {...props}
      />
      <button
        type="button"
        onClick={() => setMontrerMotDePasse(!montrerMotDePasse)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
      >
        {montrerMotDePasse ? (
          <EyeOff className="h-4 w-4" />
        ) : (
          <Eye className="h-4 w-4" />
        )}
      </button>
    </div>
  )
})

InputPassword.displayName = 'InputPassword'

export { InputPassword }