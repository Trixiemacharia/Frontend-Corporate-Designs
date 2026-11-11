import { Link } from 'react-router-dom'
import { brand } from '../data/brand'

export default function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link to="/" aria-label={`${brand.name} home`} className={`flex items-center gap-2.5 text-lg font-extrabold tracking-tight ${light ? 'text-white' : 'text-forest'}`}>
      <span className={`grid h-8 w-8 place-items-center rounded-md text-sm ${light ? 'bg-white text-forest' : 'bg-forest text-white'}`}>M</span>
      {brand.name}
    </Link>
  )
}