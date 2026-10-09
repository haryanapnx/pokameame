import type { ButtonHTMLAttributes } from 'react'

import { buttonVariantClasses, type ButtonVariant } from '../Button/Button'
import { cn } from '../cn'

export type IconButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'aria-label'> & {
  'aria-label': string
  variant?: ButtonVariant
}

/** Square, icon-only button. `aria-label` is required for accessibility. */
export function IconButton({
  variant = 'ghost',
  type = 'button',
  className,
  ...props
}: IconButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        'inline-flex size-9 items-center justify-center rounded-control transition focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
        buttonVariantClasses[variant],
        className,
      )}
      {...props}
    />
  )
}
