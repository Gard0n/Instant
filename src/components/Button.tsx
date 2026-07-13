import type { ButtonHTMLAttributes } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary'
}

export function Button({ variant = 'primary', className = '', ...props }: ButtonProps) {
  const base =
    'rounded-full px-6 py-3 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
  const variants = {
    primary: 'bg-instant-accent text-instant-bg hover:bg-instant-accent-hover',
    secondary: 'bg-instant-surface text-instant-text border border-instant-border hover:bg-instant-surface-hover',
  }

  return <button className={`${base} ${variants[variant]} ${className}`} {...props} />
}
