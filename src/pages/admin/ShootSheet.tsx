import { useEffect, useState } from "react"

type Participant = {
  firstName: string
  lastName: string
  camp: string
  consentDate: string
  submittedAt: string
}

// Not linked from site nav. Gated by a short access key (checked
// server-side by the shoot-sheet function) rather than full auth — this is
// a solo-operator tool, not a multi-user admin area, but it still shouldn't
// be fetchable by anyone who guesses the URL.
export default function ShootSheet() {
  useEffect(() => {
    document.title = "Shoot Sheet — Good Noise Project"
  }, [])

  const [accessKey, setAccessKey] = useState("")
  const [submittedKey, setSubmittedKey] = useState("")
  const [participants, setParticipants] = useState<Participant[] | null>(null)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [campFilter, setCampFilter] = useState("")

  async function loadSheet(key: string) {
    setLoading(true)
    setError("")
    try {
      const response = await fetch("/.netlify/functions/shoot-sheet", {
        headers: { "x-shoot-sheet-key": key },
      })
      const body = await response.json()
      if (!response.ok) {
        throw new Error(body.error || `Request failed: ${response.status}`)
      }
      setParticipants(body.participants)
      setSubmittedKey(key)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
      setParticipants(null)
    } finally {
      setLoading(false)
    }
  }

  const camps = participants
    ? Array.from(new Set(participants.map((p) => p.camp))).filter(Boolean)
    : []
  const visible = participants?.filter((p) => !campFilter || p.camp === campFilter) ?? []

  if (!submittedKey) {
    return (
      <div className="mx-auto flex min-h-screen max-w-sm flex-col justify-center gap-4 px-5">
        <h1 className="font-display text-2xl text-ink">Shoot Sheet</h1>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            loadSheet(accessKey)
          }}
          className="flex flex-col gap-3"
        >
          <label className="flex flex-col gap-2">
            <span className="font-body text-xs font-semibold uppercase tracking-wide text-ink/70">
              Access key
            </span>
            <input
              type="password"
              value={accessKey}
              onChange={(e) => setAccessKey(e.target.value)}
              className="border-2 border-ink bg-cream px-4 py-3 text-ink focus:outline-none focus:ring-2 focus:ring-ink"
            />
          </label>
          <button
            type="submit"
            disabled={loading}
            className="border-2 border-ink bg-ink px-4 py-3 font-body font-semibold text-white disabled:opacity-60"
          >
            {loading ? "Loading…" : "View shoot sheet"}
          </button>
          {error && <p className="text-sm text-red-700">{error}</p>}
        </form>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white px-5 py-8 print:p-0">
      <style>{`
        @page { size: A4; margin: 12mm; }
        @media print {
          .no-print { display: none !important; }
          table { font-size: 12pt; }
        }
      `}</style>

      <div className="no-print mb-6 flex flex-wrap items-center gap-4">
        <h1 className="font-display text-2xl text-ink">Shoot Sheet</h1>
        {camps.length > 1 && (
          <select
            value={campFilter}
            onChange={(e) => setCampFilter(e.target.value)}
            className="border-2 border-ink bg-cream px-3 py-2 text-sm text-ink"
          >
            <option value="">All camps</option>
            {camps.map((camp) => (
              <option key={camp} value={camp}>
                {camp}
              </option>
            ))}
          </select>
        )}
        <button
          type="button"
          onClick={() => window.print()}
          className="border-2 border-ink bg-ink px-4 py-2 font-body text-sm font-semibold text-white"
        >
          Print
        </button>
        <button
          type="button"
          onClick={() => loadSheet(submittedKey)}
          className="border-2 border-ink bg-cream px-4 py-2 font-body text-sm font-semibold text-ink"
        >
          Refresh
        </button>
      </div>

      {error && <p className="no-print mb-4 text-sm text-red-700">{error}</p>}

      <table className="w-full border-collapse text-left">
        <thead>
          <tr className="border-b-2 border-ink">
            <th className="py-2 pr-3 font-body text-xs uppercase tracking-wide text-ink/70">
              Name
            </th>
            <th className="py-2 font-body text-xs uppercase tracking-wide text-ink/70">
              Consent signed
            </th>
          </tr>
        </thead>
        <tbody>
          {visible.map((p, i) => (
            <tr key={i} className="border-b border-ink/20">
              <td className="py-2 pr-3 font-body font-semibold text-ink">
                {p.firstName} {p.lastName}
              </td>
              <td className="py-2 text-ink">{p.consentDate || "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {visible.length === 0 && !loading && (
        <p className="no-print mt-6 text-sm text-ink/60">No bookings found.</p>
      )}
    </div>
  )
}
