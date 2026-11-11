import { Link } from 'react-router-dom'
import type { ReactNode } from 'react'

type Props = {
  variant?: 'solid' | 'outline' | 'light'
  to?: string
  href?: string
  onClick?: () => void
  type?: 'button' | 'submit'
  disabled?: boolean
  className?: string
  children: ReactNode
}

const looks = {
  solid: 'bg-forest text-white hover:bg-[#0d2e26]',
  outline: 'border border-forest/30 text-forest hover:border-forest hover:bg-forest/5',
  light: 'bg-white text-forest hover:bg-sage',
}

export default function Button({ variant = 'solid', to, href, onClick, type = 'button', disabled, className = '', children }: Props) {
  const cls = `inline-flex min-h-12 items-center justify-center gap-2 rounded-lg px-6 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${looks[variant]} ${className}`
  if (to) return <Link to={to} onClick={onClick} className={cls}>{children}</Link>
  if (href) return <a href={href} onClick={onClick} className={cls}>{children}</a>
  return <button type={type} onClick={onClick} disabled={disabled} className={cls}>{children}</button>
}