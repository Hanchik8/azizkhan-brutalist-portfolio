import { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { API_ENDPOINTS, API_RESPONSES } from '../data/apiPlayground'

/* ─── JSON Syntax Highlighter ─── */
function highlightJSON(json: string): string {
  return json
    // strings (values)
    .replace(
      /("(?:[^"\\]|\\.)*")(\s*:)?/g,
      (match, str, colon) => {
        if (colon) {
          // key
          return `<span class="json-key">${str}</span>${colon}`
        }
        // string value
        return `<span class="json-string">${str}</span>`
      }
    )
    // numbers
    .replace(/\b(\d+\.?\d*)\b/g, '<span class="json-number">$1</span>')
    // booleans & null
    .replace(/\b(true|false|null)\b/g, '<span class="json-bool">$1</span>')
}

/* ─── Main Component ─── */
export default function ApiPlayground() {
  const [selectedEndpoint, setSelectedEndpoint] = useState('/skills')
  const [response, setResponse] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [statusCode, setStatusCode] = useState<number | null>(null)
  const [responseTime, setResponseTime] = useState<number | null>(null)

  const sendRequest = useCallback(() => {
    setIsLoading(true)
    setResponse(null)
    setStatusCode(null)

    const delay = 200 + Math.random() * 300
    setTimeout(() => {
      const data = API_RESPONSES[selectedEndpoint]
      setResponse(JSON.stringify(data, null, 2))
      setStatusCode(200)
      setResponseTime(Math.round(delay))
      setIsLoading(false)
    }, delay)
  }, [selectedEndpoint])

  const sectionAnim = useCallback((delay: number) => ({
    initial: { opacity: 0, y: 20 } as const,
    whileInView: { opacity: 1, y: 0 } as const,
    viewport: { once: true, margin: '-80px' as const },
    transition: { duration: 0.5, delay },
  }), [])

  return (
    <section id="api-playground" aria-label="API Playground" className="py-24 px-6 md:px-12 lg:px-20">
      {/* Heading */}
      <div className="mb-12">
        <motion.span {...sectionAnim(0)} className="font-mono text-sm tracking-widest text-primary uppercase block mb-3">
          {'// 06'}
        </motion.span>
        <motion.h2 {...sectionAnim(0.1)} className="text-4xl md:text-5xl lg:text-6xl font-bold uppercase tracking-tight text-foreground">
          API PLAYGROUND
        </motion.h2>
        <motion.p {...sectionAnim(0.2)} className="mt-3 font-mono text-sm text-muted-foreground">
          Interactive REST API — Explore the Portfolio Data
        </motion.p>
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-4 h-px w-full max-w-xs bg-primary origin-left"
        />
      </div>

      <motion.div {...sectionAnim(0.3)} className="border-2 border-border bg-card overflow-hidden">
        {/* Request Bar */}
        <div className="border-b-2 border-border p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Method Badge + URL */}
            <div className="flex items-center flex-1 border-2 border-border bg-secondary/30 overflow-hidden">
              <span className="px-3 py-2.5 bg-primary/10 text-primary font-mono text-xs font-bold uppercase border-r-2 border-border flex-shrink-0">
                GET
              </span>
              <span className="px-3 py-2.5 font-mono text-xs text-muted-foreground flex-shrink-0">
                https://azizkhan.dev/api
              </span>
              <select
                value={selectedEndpoint}
                onChange={(e) => setSelectedEndpoint(e.target.value)}
                className="flex-1 bg-transparent font-mono text-xs text-foreground px-2 py-2.5 outline-none cursor-pointer appearance-none"
              >
                {API_ENDPOINTS.map((ep) => (
                  <option key={ep.path} value={ep.path} className="bg-card text-foreground">
                    {ep.path}
                  </option>
                ))}
              </select>
            </div>

            {/* Send Button */}
            <button
              onClick={sendRequest}
              disabled={isLoading}
              className="border-2 border-primary bg-primary/10 hover:bg-primary/20 text-primary font-mono text-xs uppercase tracking-widest px-6 py-2.5 transition-all duration-150 active:scale-95 disabled:opacity-50 flex-shrink-0"
            >
              {isLoading ? '>> SENDING...' : '>> SEND REQUEST'}
            </button>
          </div>

          {/* Endpoint descriptions */}
          <div className="flex flex-wrap gap-3 mt-3">
            {API_ENDPOINTS.map((ep) => (
              <button
                key={ep.path}
                onClick={() => setSelectedEndpoint(ep.path)}
                className={`font-mono text-[10px] uppercase tracking-wider px-2.5 py-1 border transition-all duration-150 ${
                  selectedEndpoint === ep.path
                    ? 'border-primary text-primary bg-primary/5'
                    : 'border-border text-muted-foreground hover:border-muted-foreground hover:text-foreground'
                }`}
              >
                {ep.path} — {ep.description}
              </button>
            ))}
          </div>
        </div>

        {/* Response Panel */}
        <div>
          {/* Response Header */}
          <div className="flex items-center justify-between px-4 py-2.5 border-b-2 border-border bg-secondary/30">
            <div className="flex items-center gap-2.5">
              <div className="flex gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-accent" />
                <span className="w-2.5 h-2.5 rounded-full bg-primary/40" />
                <span className="w-2.5 h-2.5 rounded-full bg-muted-foreground/30" />
              </div>
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                Response
              </span>
            </div>
            {statusCode && (
              <div className="flex items-center gap-3 font-mono text-[10px]">
                <span className="text-primary">STATUS: {statusCode} OK</span>
                <span className="text-muted-foreground">TIME: {responseTime}ms</span>
                <span className="text-muted-foreground">SIZE: {response ? (response.length / 1024).toFixed(1) : 0}KB</span>
              </div>
            )}
          </div>

          {/* Response Body */}
          <div className="p-4 h-[400px] overflow-y-auto font-mono text-[12px] leading-relaxed hide-scrollbar">
            {isLoading && (
              <div className="flex items-center gap-2 text-primary">
                <span className="animate-pulse">⟩</span>
                <span>Resolving endpoint...</span>
              </div>
            )}
            {!isLoading && !response && (
              <div className="text-muted-foreground/50 flex flex-col items-center justify-center h-full gap-3">
                <span className="text-4xl">{'{ }'}</span>
                <span className="text-[11px] uppercase tracking-widest">Send a request to see the response</span>
              </div>
            )}
            {!isLoading && response && (
              <pre
                className="text-foreground/80 whitespace-pre-wrap"
                dangerouslySetInnerHTML={{ __html: highlightJSON(response) }}
              />
            )}
          </div>
        </div>
      </motion.div>
    </section>
  )
}
