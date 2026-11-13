import assert from 'node:assert/strict'
import { createServer } from 'vite'

const vite = await createServer({ server: { middlewareMode: true }, appType: 'custom' })
try {
  const { classifyRequest, executeAgent } = await vite.ssrLoadModule('/src/lib/agent.ts')
  const cases = [
    ['Which sites are over budget?', 'overruns'],
    ['Show me branches exceeding their allocations.', 'overruns'],
    ['Which location has the highest budget utilisation?', 'highest'],
    ['Compare Westlake and Harbour.', 'compare'],
    ['Calculate our total overspend.', 'overspend'],
    ['Which sites are performing well?', 'performing'],
    ['Draft an email to the managers of the affected sites.', 'drafts'],
    ["Make James's message more professional.", 'followup', 'Draft an email to the managers.'],
    ['What data did you use to reach that conclusion?', 'followup', 'Which sites are over budget?'],
    ['What is the weather in Nairobi?', 'unsupported'],
  ]
  for (const [query, expected, previous = ''] of cases) {
    const plan = classifyRequest(query, previous)
    assert.equal(plan.intent, expected, query)
    const result = executeAgent(query, plan)
    assert.ok(result.plan.plan.length > 0, `${query} has a visible plan`)
    if (expected === 'unsupported') assert.match(result.answer, /outside Meridian/i)
    else assert.ok(result.tools.length > 0, `${query} executes a tool`)
    if (expected === 'drafts') assert.ok(result.drafts.length > 0 && result.drafts.every(d => d.site.lead && d.text.includes(d.site.name)))
    if (expected === 'compare') assert.equal(result.sources.length, 2)
  }
  console.log(`Passed ${cases.length} offline intent and execution scenarios.`)
} finally { await vite.close() }
