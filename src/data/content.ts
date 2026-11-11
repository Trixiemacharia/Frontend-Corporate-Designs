import {
  Activity, Briefcase, Building2, Gauge, Layers, LifeBuoy, MessagesSquare, Plus,
  Settings, ShieldCheck, TrendingUp, Users, Wallet, Workflow, type LucideIcon,
} from 'lucide-react'

export const navLinks = [
  { label: 'Platform', href: '#platform' },
  { label: 'Solutions', href: '#solutions' },
  { label: 'About', href: '#about' },
  { label: 'Resources', href: '#resources' },
]

export const partners = ['Northgate', 'Halden & Co', 'Ardent', 'Cobalt Group', 'Veritas', 'Lumen']

// Illustrative placeholders, labelled as such on the page.
export const metrics = [
  { value: '1,200+', label: 'Organisations served' },
  { value: '35%', label: 'Average efficiency gain' },
  { value: '99.99%', label: 'Platform availability' },
]

export const capabilities: { icon: LucideIcon; title: string; text: string }[] = [
  { icon: Building2, title: 'Enterprise Operations', text: 'Coordinate processes, assets and approvals across every site from one place.' },
  { icon: Users, title: 'Workforce Management', text: 'Plan teams, track capacity and keep people aligned with clear ownership.' },
  { icon: Activity, title: 'Business Intelligence', text: 'Turn operational data into dashboards leaders can act on with confidence.' },
  { icon: ShieldCheck, title: 'Security and Compliance', text: 'Role-based access, audit trails and policy controls built in from day one.' },
]

export const advantages: { icon: LucideIcon; title: string; text: string }[] = [
  { icon: Layers, title: 'One connected platform', text: 'Replace scattered tools with a single system your teams share.' },
  { icon: Gauge, title: 'Decisions at speed', text: 'Live reporting shortens the gap between a question and an answer.' },
  { icon: LifeBuoy, title: 'Support that stays', text: 'Dedicated onboarding and responsive specialists after launch.' },
]

export const industries = ['Financial services', 'Healthcare', 'Manufacturing', 'Retail', 'Technology', 'Logistics', 'Education', 'Public sector', 'Other']
export const sizes = ['1–50', '51–200', '201–1,000', '1,001–5,000', '5,000+']
export const countries = ['Kenya', 'Uganda', 'Tanzania', 'Rwanda', 'Nigeria', 'Ghana', 'South Africa', 'United Kingdom', 'United States', 'Other']

export const roles: { id: string; label: string; icon: LucideIcon }[] = [
  { id: 'Executive', label: 'Executive', icon: Briefcase },
  { id: 'Administrator', label: 'Administrator', icon: Settings },
  { id: 'Operations', label: 'Operations', icon: Workflow },
  { id: 'Finance', label: 'Finance', icon: Wallet },
  { id: 'Human Resources', label: 'Human Resources', icon: Users },
  { id: 'Other', label: 'Other', icon: Plus },
]

export const prefOptions: { id: string; label: string; text: string; icon: LucideIcon }[] = [
  { id: 'Team collaboration', label: 'Team collaboration', text: 'Shared spaces, tasks and conversations', icon: MessagesSquare },
  { id: 'Business operations', label: 'Business operations', text: 'Run day-to-day processes', icon: Building2 },
  { id: 'Reporting and analytics', label: 'Reporting and analytics', text: 'Dashboards and insights', icon: TrendingUp },
  { id: 'Workflow automation', label: 'Workflow automation', text: 'Remove repetitive manual work', icon: Workflow },
]