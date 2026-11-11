export type Data = {
  name: string; email: string; password: string; confirm: string
  org: string; industry: string; size: string; country: string; website: string
  role: string; prefs: string[]
}
export type Errors = Partial<Record<keyof Data, string>>

export const initialData: Data = {
  name: '', email: '', password: '', confirm: '', org: '', industry: '', size: '', country: '', website: '', role: '', prefs: [],
}

const validUrl = (v: string) => {
  try { const u = new URL(/^https?:\/\//i.test(v) ? v : `https://${v}`); return u.hostname.includes('.') } catch { return false }
}

export function validate(step: number, d: Data): Errors {
  const e: Errors = {}
  if (step === 0) {
    if (d.name.trim().length < 2) e.name = 'Enter your full name.'
    if (!/^\S+@\S+\.\S+$/.test(d.email)) e.email = 'Enter a valid work email, like name@company.com.'
    if (d.password.length < 10 || !/[A-Za-z]/.test(d.password) || !/\d/.test(d.password)) e.password = 'Use at least 10 characters, including a letter and a number.'
    if (d.confirm !== d.password || !d.confirm) e.confirm = 'Passwords do not match.'
  }
  if (step === 1) {
    if (!d.org.trim()) e.org = 'Enter your organisation name.'
    if (!d.industry) e.industry = 'Select an industry.'
    if (!d.size) e.size = 'Select an organisation size.'
    if (!d.country) e.country = 'Select a country.'
    if (d.website.trim() && !validUrl(d.website.trim())) e.website = 'Enter a valid website, like company.com.'
  }
  if (step === 2 && !d.role) e.role = 'Choose the role that fits you best.'
  if (step === 3 && !d.prefs.length) e.prefs = 'Select at least one area to start with.'
  return e
}