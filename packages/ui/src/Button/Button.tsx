import type { ButtonHTMLAttributes } from 'react'

import { cn } from '../cn'

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'
export type ButtonSize = 'sm' | 'md' | 'lg'

const BASE_CLASSES =
  'inline-flex items-center justify-center rounded-control font-medium transition focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-50'

export const buttonVariantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-brand-600 text-white hover:bg-brand-500 focus-visible:outline-brand-600',
  secondary: 'bg-surface-muted text-content hover:bg-slate-200 focus-visible:outline-brand-600',
  ghost: 'bg-transparent text-content hover:bg-surface-muted focus-visible:outline-brand-600',
  danger: 'bg-danger text-white hover:opacity-90 focus-visible:outline-danger',
}

export const buttonSizeClasses: Record<ButtonSize, string> = {
  sm: 'h-8 gap-1.5 px-3 text-xs',
  md: 'h-10 gap-2 px-4 text-sm',
  lg: 'h-12 gap-2 px-6 text-base',
}

export type ButtonClassesOptions = {
  variant?: ButtonVariant
  size?: ButtonSize
  className?: string
}

/**
 * Full class string for a button. Lets link-styled CTAs reuse the same look:
 * `<Link className={buttonClasses({ variant: 'primary' })}>`.
 */
export function buttonClasses({
  variant = 'primary',
  size = 'md',
  className,
}: ButtonClassesOptions = {}): string {
  return cn(BASE_CLASSES, buttonVariantClasses[variant], buttonSizeClasses[size], className)
}

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant
  size?: ButtonSize
}

export function Button({
  variant = 'primary',
  size = 'md',
  type = 'button',
  className,
  ...props
}: ButtonProps) {
  return <button type={type} className={buttonClasses({ variant, size, className })} {...props} />
}
