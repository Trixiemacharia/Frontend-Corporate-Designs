import { createServer } from 'node:http'
import { readFile, stat } from 'node:fs/promises'
import { extname, join, normalize } from 'node:path'

try {
  const envFile = await readFile('.env', 'utf8')
  for (const line of envFile.split(/\r?\n/)) {
    const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/)
    if (match && process.env[match[1]] === undefined) process.env[match[1]] = match[2].replace(/^(["'])(.*)\1$/, '$2')
  }
} catch { /* environment variables may be supplied by the host */ }

const port = Number(process.env.PORT || 4173)
const provider = process.env.LLM_PROVIDER || 'openai-compatible'
const apiUrl = process.env.LLM_BASE_URL || 'https://api.openai.com/v1/chat/completions'
const model = process.env.LLM_MODEL || 'gpt-4o-mini'
const key = process.env.LLM_API_KEY || ''

const mime = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg' }
const server = createServer(async (req, res) => {
  if (req.url === '/api/agent/compose' && req.method === 'POST') {
    if (!key) { res.writeHead(503, { 'Content-Type': 'application/json' }); res.end(JSON.stringify({ error: 'Provider is not configured' })); return }
    let raw = ''
    for await (const chunk of req) raw += chunk
    try {
      const input = JSON.parse(raw)
      const records = Array.isArray(input.sources) ? input.sources.slice(0, 10) : []
      const drafts = Array.isArray(input.drafts) ? input.drafts.slice(0, 10) : []
      const controller = new AbortController(), timeout = setTimeout(() => controller.abort(), 9000)
      try {
        const upstream = await fetch(apiUrl, { method: 'POST', signal: controller.signal, headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ model, temperature: 0.2, response_format: { type: 'json_object' }, messages: [
          { role: 'system', content: 'Return JSON with answer (concise natural language) and drafts (array of {siteId,message}). Use only the supplied verified records. Do not introduce claims, amounts, recipients, events or facts absent from those records. For drafts, write one context-specific professional message per supplied draft and retain its siteId. If drafts are empty, return an empty array.' },
          { role: 'user', content: JSON.stringify({ query: String(input.query || '').slice(0, 1200), verifiedAnswer: String(input.answer || '').slice(0, 1800), records, drafts }) },
        ] }) })
        clearTimeout(timeout)
        if (!upstream.ok) { res.writeHead(upstream.status === 429 ? 429 : 502, { 'Content-Type': 'application/json' }); res.end(JSON.stringify({ error: 'Model provider request failed' })); return }
        const data = await upstream.json(), content = data.choices?.[0]?.message?.content
        const composition = JSON.parse(content)
        res.writeHead(200, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }); res.end(JSON.stringify(composition))
      } catch (error) { clearTimeout(timeout); res.writeHead(502, { 'Content-Type': 'application/json' }); res.end(JSON.stringify({ error: error.name === 'AbortError' ? 'Provider timeout' : 'Invalid provider response' })) }
    } catch { res.writeHead(400); res.end('{}') }
    return
  }
  if (req.url === '/api/agent/interpret' && req.method === 'POST') {
    if (!key) { res.writeHead(503, { 'Content-Type': 'application/json' }); res.end(JSON.stringify({ error: 'Provider is not configured' })); return }
    let raw = ''
    for await (const chunk of req) raw += chunk
    try {
      const { query, previousQuery = '' } = JSON.parse(raw)
      const controller = new AbortController(), timeout = setTimeout(() => controller.abort(), 9000)
      try {
        const upstream = await fetch(apiUrl, { method: 'POST', signal: controller.signal, headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ model, temperature: 0.1, response_format: { type: 'json_object' }, messages: [
          { role: 'system', content: `Classify request into intent: overruns, highest, compare, overspend, performing, drafts, explain, followup, unsupported. Return JSON only with intent, confidence, plan (1-5 concise steps), requiredTools from [getBudgets,flagOverruns,getBudgetUtilisation,getSiteDetails,compareSites,getQuarterlySummary,getSitePerformance,draftNote,conversationContext,scopeCheck], requiresDraft boolean, siteNames array. Never return data or execute tools. Follow-up context: ${previousQuery}` },
          { role: 'user', content: String(query).slice(0, 1200) },
        ] }) })
        clearTimeout(timeout)
        if (!upstream.ok) { res.writeHead(upstream.status === 429 ? 429 : 502, { 'Content-Type': 'application/json' }); res.end(JSON.stringify({ error: 'Model provider request failed' })); return }
        const data = await upstream.json(), content = data.choices?.[0]?.message?.content
        const plan = JSON.parse(content)
        res.writeHead(200, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store', 'X-Agent-Provider': provider }); res.end(JSON.stringify({ plan }))
      } catch (error) { clearTimeout(timeout); res.writeHead(502, { 'Content-Type': 'application/json' }); res.end(JSON.stringify({ error: error.name === 'AbortError' ? 'Provider timeout' : 'Invalid provider response' })) }
    } catch { res.writeHead(400); res.end('{}') }
    return
  }
  const pathname = decodeURIComponent((req.url || '/').split('?')[0])
  const filePath = normalize(join(process.cwd(), 'dist', pathname === '/' ? 'index.html' : pathname))
  if (!filePath.startsWith(join(process.cwd(), 'dist'))) { res.writeHead(403); res.end(); return }
  try { const info = await stat(filePath); const file = info.isDirectory() ? await readFile(join(filePath, 'index.html')) : await readFile(filePath); res.writeHead(200, { 'Content-Type': mime[extname(filePath)] || 'application/octet-stream' }); res.end(file) }
  catch { try { res.writeHead(200, { 'Content-Type': 'text/html' }); res.end(await readFile(join(process.cwd(), 'dist/index.html'))) } catch { res.writeHead(503); res.end('Run npm run build first.') } }
})
server.listen(port, '127.0.0.1', () => console.log(`Meridian listening on http://127.0.0.1:${port}`))
