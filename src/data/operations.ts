export type Site = { id: string; name: string; lead: string; budget: number; spent: number; quarter: string }
export const sites: Site[] = [
  { id: 'westlake', name: 'Westlake', lead: 'James Mwangi', budget: 48000, spent: 56640, quarter: 'Q4 2026' },
  { id: 'harbour', name: 'Harbour', lead: 'Amina Otieno', budget: 62500, spent: 58425, quarter: 'Q4 2026' },
  { id: 'depot-7', name: 'Depot-7', lead: 'Peter Kamau', budget: 39000, spent: 42825, quarter: 'Q4 2026' },
  { id: 'riverside', name: 'Riverside', lead: 'Grace Wanjiku', budget: 54000, spent: 45900, quarter: 'Q4 2026' },
  { id: 'northpoint', name: 'Northpoint', lead: 'David Kiptoo', budget: 71000, spent: 78100, quarter: 'Q4 2026' },
]
export const enrich = (site: Site) => ({ ...site, utilisation: site.spent / site.budget * 100, overrun: site.spent > site.budget, overrunAmount: Math.max(0, site.spent - site.budget), status: site.spent > site.budget ? 'Over budget' : site.spent / site.budget > .9 ? 'Attention required' : 'On track' })
export const getBudgets = () => sites.map(enrich)
export const flagOverruns = () => getBudgets().filter(site => site.overrun)
export const money = (amount: number) => new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES', maximumFractionDigits: 0 }).format(amount)
export const draftNote = (site: ReturnType<typeof enrich>) => `Hi ${site.lead.split(' ')[0]}, ${site.name} has exceeded its quarterly budget allocation. Current expenditure is ${money(site.spent)} against an approved budget of ${money(site.budget)} (${(site.utilisation - 100).toFixed(1)}% over). Please review the outstanding operational expenses and provide an update on the variance.`
