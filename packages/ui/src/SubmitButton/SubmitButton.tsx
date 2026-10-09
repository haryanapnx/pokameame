'use client'

import type { ReactNode } from 'react'
import { useFormStatus } from 'react-dom'

import { Button } from '../Button/Button'
import { Spinner } from '../Spinner/Spinner'

export type SubmitButtonProps = {
  children: ReactNode
}

export function SubmitButton({ children }: SubmitButtonProps) {
  const { pending } = useFormStatus()

  return (
    <Button type="submit" disabled={pending}>
      {pending ? <Spinner label="Saving" /> : null}
      {children}
    </Button>
  )
}
