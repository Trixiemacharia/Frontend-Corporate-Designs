import { draftNote, enrich, flagOverruns, getBudgets, money } from '../data/operations'
type SiteRecord = ReturnType<typeof enrich>

export type Intent = 'overruns' | 'highest' | 'compare' | 'overspend' | 'performing' | 'drafts' | 'explain' | 'followup' | 'unsupported'
export type Plan = { intent: Intent; confidence: number; plan: string[]; requiredTools: string[]; requiresDraft: boolean; siteNames?: string[] }
export type AgentResult = { plan: Plan; tools: { name: string; result: string }[]; answer: string; sources: SiteRecord[]; drafts: { site: SiteRecord; text: string }[]; mode: 'AI assisted' | 'Offline fallback' }

const plans: Record<Intent, string[]> = {
  overruns: ['Retrieve current quarter site budgets', 'Identify sites above their allocation', 'Summarise the verified exceptions'],
  highest: ['Retrieve all site budget records', 'Calculate and rank budget utilisation', 'Identify the highest utilisation site'],
  compare: ['Retrieve the requested site records', 'Compare budget, spend and utilisation', 'Summarise the differences'],
  overspend: ['Retrieve current quarter budget records', 'Calculate the combined overrun from flagged sites', 'Report the verified total'],
  performing: ['Retrieve all site performance records', 'Rank sites by budget utilisation', 'Summarise sites operating within allocation'],
  drafts: ['Retrieve over-budget site records and their leads', 'Prepare a tailored draft for each affected lead', 'Present drafts for human review'],
  explain: ['Retrieve the requested site record', 'Verify its budget, spend and utilisation', 'Explain the recorded status'],
  followup: ['Use the previous analysis and its verified records', 'Respond to the requested follow-up'],
  unsupported: ['Check whether the request is covered by connected operations data', 'Explain the available data scope'],
}

export function classifyRequest(query: string, previousQuery = ''): Plan {
  const q = query.toLowerCase()
  const names = getBudgets().filter(s => q.includes(s.name.toLowerCase())).map(s => s.name)
  let intent: Intent = 'unsupported'
  if (/weather|forecast|news|outside|internet/.test(q)) intent = 'unsupported'
  else if (/make .*more (formal|professional)|rewrite|rephrase|tone/.test(q) && previousQuery) intent = 'followup'
  else if (/what data|which records|sources? did|how did you reach/.test(q) && previousQuery) intent = 'followup'
  else if (/draft|email|message|note|write to|managers/.test(q)) intent = 'drafts'
  else if (/compare|versus|\bvs\b/.test(q) || (names.length > 1 && /and/.test(q))) intent = 'compare'
  else if (/highest|most .*utili|utili.*highest|rank/.test(q)) intent = 'highest'
  else if (/total|combined|how much|amount .*over|overspend|over budget in total/.test(q)) intent = 'overspend'
  else if (/performing well|best financially|doing best|under budget|within allocation/.test(q)) intent = 'performing'
  else if (/why|explain|flagged|attention/.test(q) && names.length) intent = 'explain'
  else if (/over budget|exceed|above .*alloc|overspend|financial attention|too much/.test(q)) intent = 'overruns'
  else if (/more professional|more formal|what data|sources/.test(q) && previousQuery) intent = 'followup'
  return { intent, confidence: intent === 'unsupported' ? 0.55 : 0.84, plan: plans[intent], requiredTools: toolNames(intent), requiresDraft: intent === 'drafts', siteNames: names }
}

function toolNames(intent: Intent) {
  const map: Record<Intent, string[]> = { overruns: ['getBudgets', 'flagOverruns'], highest: ['getBudgets', 'getBudgetUtilisation'], compare: ['getSiteDetails', 'compareSites'], overspend: ['getBudgets', 'flagOverruns', 'getQuarterlySummary'], performing: ['getSitePerformance'], drafts: ['getBudgets', 'flagOverruns', 'draftNote'], explain: ['getSiteDetails'], followup: ['conversationContext'], unsupported: ['scopeCheck'] }
  return map[intent]
}

export async function interpretWithModel(query: string, previousQuery: string): Promise<Plan | null> {
  try {
    const controller = new AbortController()
    const timer = window.setTimeout(() => controller.abort(), 10000)
    const response = await fetch('/api/agent/interpret', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ query, previousQuery }), signal: controller.signal })
    window.clearTimeout(timer)
    if (!response.ok) return null
    const body = await response.json() as { plan?: unknown }
    const candidate = body.plan as Partial<Plan> | undefined
    const validIntents: Intent[] = ['overruns', 'highest', 'compare', 'overspend', 'performing', 'drafts', 'explain', 'followup', 'unsupported']
    if (!candidate || !validIntents.includes(candidate.intent as Intent) || !Array.isArray(candidate.plan) || !Array.isArray(candidate.requiredTools)) return null
    if (typeof candidate.confidence !== 'number' || !Number.isFinite(candidate.confidence) || typeof candidate.requiresDraft !== 'boolean' || (candidate.siteNames !== undefined && (!Array.isArray(candidate.siteNames) || candidate.siteNames.some(name => typeof name !== 'string')))) return null
    const allowed = toolNames(candidate.intent as Intent)
    if (candidate.requiredTools.some(tool => !allowed.includes(tool)) || candidate.plan.length < 1 || candidate.plan.length > 5 || candidate.plan.some(step => typeof step !== 'string')) return null
    return { ...classifyRequest(query, previousQuery), ...candidate, intent: candidate.intent as Intent, requiredTools: allowed }
  } catch { return null }
}

export async function composeWithModel(query: string, result: AgentResult): Promise<Pick<AgentResult, 'answer' | 'drafts'> | null> {
  try {
    const controller = new AbortController()
    const timer = window.setTimeout(() => controller.abort(), 9000)
    const response = await fetch('/api/agent/compose', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ query, answer: result.answer, sources: result.sources.map(({ id, name, lead, budget, spent, utilisation, overrunAmount }) => ({ id, name, lead, budget, spent, utilisation, overrunAmount })), drafts: result.drafts.map(({ site, text }) => ({ siteId: site.id, site: site.name, lead: site.lead, budget: site.budget, spent: site.spent, utilisation: site.utilisation, text })) }), signal: controller.signal })
    window.clearTimeout(timer)
    if (!response.ok) return null
    const body = await response.json() as { answer?: unknown; drafts?: unknown }
    if (typeof body.answer !== 'string' || body.answer.length > 1800) return null
    if (!Array.isArray(body.drafts)) return null
    const draftById = new Map(result.drafts.map(d => [d.site.id, d]))
    const seen = new Set<string>()
    const updated = body.drafts.map((item: { siteId?: unknown; message?: unknown }) => {
      if (typeof item.siteId !== 'string' || typeof item.message !== 'string' || item.message.length > 2400 || !draftById.has(item.siteId) || seen.has(item.siteId)) throw new Error('Invalid generated draft')
      seen.add(item.siteId)
      return { ...draftById.get(item.siteId)!, text: item.message }
    })
    if (updated.length !== result.drafts.length) return null
    return { answer: body.answer, drafts: updated }
  } catch { return null }
}

export function executeAgent(query: string, plan: Plan, previousDrafts: { site: SiteRecord; text: string }[] = [], previousSources: SiteRecord[] = []): AgentResult {
  const rows = getBudgets()
  let sources: SiteRecord[] = [], drafts: { site: SiteRecord; text: string }[] = [], answer = ''
  const tools: AgentResult['tools'] = []
  const all = () => { sources = rows; tools.push({ name: 'getBudgets', result: `${rows.length} site records retrieved.` }) }
  switch (plan.intent) {
    case 'overruns': sources = flagOverruns(); tools.push({ name: 'getBudgets', result: `${rows.length} site records retrieved.` }, { name: 'flagOverruns', result: `${sources.length} sites exceed their allocation.` }); answer = sources.length ? `${sources.map(s => s.name).join(', ')} ${sources.length === 1 ? 'is' : 'are'} currently over budget this quarter.` : 'No sites are currently above their quarterly allocation.'; break
    case 'highest': all(); sources = [...rows].sort((a,b) => b.utilisation-a.utilisation).slice(0,1); tools.push({ name: 'getBudgetUtilisation', result: 'Utilisation calculated and ranked from seeded budgets.' }); answer = `${sources[0]?.name} has the highest budget utilisation at ${sources[0]?.utilisation.toFixed(1)}%.`; break
    case 'compare': {
      const ranked = /worst|poor|highest spend|least well/i.test(query) ? [...rows].sort((a,b) => b.utilisation-a.utilisation) : [...rows].sort((a,b) => a.utilisation-b.utilisation)
      const requested = plan.siteNames?.length ? rows.filter(s => plan.siteNames?.some(n => n.toLowerCase() === s.name.toLowerCase())) : /two|both/i.test(query) ? ranked.slice(0,2) : rows.slice(0,2)
      sources = requested; tools.push({ name: 'getSiteDetails', result: `${sources.length} requested site records retrieved.` }, { name: 'compareSites', result: 'Budget, spend and utilisation compared.' })
      answer = sources.length > 1 ? sources.map(s => `${s.name}: ${money(s.spent)} of ${money(s.budget)} (${s.utilisation.toFixed(1)}%).`).join(' ') : 'Name two sites in the portfolio to compare their records.'; break
    }
    case 'overspend': sources = flagOverruns(); tools.push({ name: 'getBudgets', result: `${rows.length} site records retrieved.` }, { name: 'flagOverruns', result: `${sources.length} over-budget records verified.` }); { const total = sources.reduce((n,s) => n+s.overrunAmount,0); tools.push({ name: 'getQuarterlySummary', result: `Combined overrun: ${money(total)}.` }); answer = `The combined overrun across ${sources.length} over-budget ${sources.length === 1 ? 'site is' : 'sites is'} ${money(total)}.` } break
    case 'performing': sources = rows.filter(s => !s.overrun).sort((a,b) => a.utilisation-b.utilisation); tools.push({ name: 'getSitePerformance', result: `${rows.length} site records ranked by utilisation.` }); answer = sources.length ? `${sources.map(s => `${s.name} (${s.utilisation.toFixed(1)}%)`).join(', ')} are within allocation; ${sources[0].name} has the lowest utilisation.` : 'Every site is currently above its allocation.'; break
    case 'drafts': sources = flagOverruns(); drafts = sources.map(site => ({ site, text: draftNote(site) })); tools.push({ name: 'getBudgets', result: `${rows.length} site records retrieved.` }, { name: 'flagOverruns', result: `${sources.length} affected leads identified.` }, { name: 'draftNote', result: `${drafts.length} editable drafts prepared. Nothing has been sent.` }); answer = `Prepared ${drafts.length} individual draft${drafts.length === 1 ? '' : 's'} for review. No messages have been sent.`; break
    case 'explain': sources = plan.siteNames?.length ? rows.filter(s => plan.siteNames?.includes(s.name)) : []; tools.push({ name: 'getSiteDetails', result: `${sources.length} matching site record${sources.length === 1 ? '' : 's'} retrieved.` }); answer = sources.map(s => `${s.name} is flagged ${s.overrun ? 'over budget' : s.status.toLowerCase()}: it spent ${money(s.spent)} against ${money(s.budget)}, reaching ${s.utilisation.toFixed(1)}% utilisation${s.overrun ? ` (${money(s.overrunAmount)} above allocation)` : ''}.`).join(' ') || 'I could not match that site to a seeded record.'; break
    case 'followup': sources = previousSources.length ? previousSources : previousDrafts.map(d => d.site); drafts = previousDrafts; tools.push({ name: 'conversationContext', result: `${sources.length} prior source records and ${previousDrafts.length} prior drafts available.` }); answer = /what data|which records|sources?/i.test(query) ? 'I used the site budget records shown below, including each allocation, actual spend, lead and calculated utilisation.' : `I’ve revised the existing drafts in a more professional tone. ${drafts.length ? 'Review the updated drafts below.' : 'Ask me to draft messages first.'}`; drafts = drafts.map(d => ({ ...d, text: d.text.replace(/^Hi /, 'Dear ').replace(/\. Please review/, '. Kindly review').replace(/ and provide an update on the variance\./, ' and share an update on the variance at your convenience.') })); break
    default: answer = 'That request is outside Meridian’s connected enterprise data. I can answer questions about site budgets, spend and performance.'
  }
  return { plan, tools, answer, sources, drafts, mode: 'Offline fallback' }
}
