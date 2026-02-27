import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/router"

const TEMPLATES = [
  { id: "graduation", name: "Graduation", accent: "bg-orange-600", thumb: "/templates/graduation-back.png" },
  { id: "birthday", name: "Birthday", accent: "bg-orange-600", thumb: "/templates/birthday-back.png" },
  { id: "sports", name: "Sports", accent: "bg-orange-600", thumb: "/templates/sports-back.png" },
  { id: "trips", name: "Trips / Vacations", accent: "bg-orange-600", thumb: "/templates/trips-back.png" },
  { id: "weddings", name: "Weddings", accent: "bg-orange-600", thumb: "/templates/weddings-back.png" },
  { id: "newborns", name: "Newborns", accent: "bg-orange-600", thumb: "/templates/birth-back.png" },
  { id: "sportsleagues", name: "Sports Leagues", accent: "bg-orange-600", thumb: "/templates/sportsleagues-back.png" },
]

// Field definitions per template
const FIELD_DEFS = {
  graduation: [
    { key: "name", label: "Name on card", placeholder: "e.g., Wilbert Chang", required: true },
    { key: "classOf", label: "Class of", placeholder: "e.g., 2026", required: true },
    { key: "schoolName", label: "School name", placeholder: "e.g., Toronto Metropolitan University", required: true },
    { key: "programName", label: "Program name", placeholder: "e.g., Graphic Communications Management", required: true },
  ],
  birthday: [
    { key: "name", label: "Name on card", placeholder: "e.g., Alex", required: true },
    { key: "description", label: "Description", placeholder: "e.g., 21st Birthday • Best night ever", required: false },
    { key: "date", label: "Date", placeholder: "YYYY-MM-DD", required: false },
  ],
  sports: [
    { key: "name", label: "Name on card", placeholder: "e.g., Jordan Lee", required: true },
    { key: "team", label: "Team", placeholder: "e.g., Rams", required: true },
    { key: "number", label: "Number", placeholder: "e.g., 11", required: false },
    { key: "stats", label: "Stats", placeholder: "e.g., 2 goals • 1 assist", required: false },
  ],
  trips: [
    { key: "location", label: "Trip location", placeholder: "e.g., Tokyo, Japan", required: true },
    { key: "description", label: "Description", placeholder: "e.g., Spring break trip", required: false },
    { key: "date", label: "Date", placeholder: "YYYY-MM-DD", required: false },
  ],
  weddings: [
    { key: "brideGroom", label: "Names of bride & groom", placeholder: "e.g., Sarah + Michael", required: true },
    { key: "description", label: "Description", placeholder: "e.g., Our wedding day", required: false },
    { key: "date", label: "Date", placeholder: "YYYY-MM-DD", required: false },
  ],
  newborns: [
    { key: "name", label: "Name on card", placeholder: "e.g., Baby Noah", required: true },
    { key: "description", label: "Description", placeholder: "e.g., Welcome to the world", required: false },
    { key: "date", label: "Date", placeholder: "YYYY-MM-DD", required: false },
  ],
  sportsleagues: [
    { key: "name", label: "Name on card", placeholder: "e.g., Wilbert Chang", required: true },
    { key: "team", label: "Team", placeholder: "e.g., Blue Jays", required: true },
    { key: "number", label: "Number", placeholder: "e.g., 23", required: false },
    { key: "season", label: "Season", placeholder: "e.g., 2025–2026", required: true },
  ],
}

function PreviewLine({ label, value }) {
  if (!value) return null
  return (
    <p className="text-sm text-orange-700 mt-1">
      <span className="font-semibold text-orange-800">{label}:</span> {value}
    </p>
  )
}

function CardPreview({ template, fields }) {
  // Render a few key lines depending on template
  const t = template.id

  return (
    <div className="w-full max-w-md">
      <div className="border border-orange-200 bg-white rounded-2xl overflow-hidden shadow-sm">
        <div className={`h-2 ${template.accent}`} />
        <div className="p-5">
          <p className="text-xs text-orange-700">CollectaMemory • {template.name} Template</p>

          {/* Main title */}
          <p className="text-2xl font-extrabold text-orange-800 mt-2">
            {fields.name || fields.location || fields.brideGroom || "Your Card Title"}
          </p>

          {/* Template-specific preview */}
          {t === "graduation" && (
            <>
              <PreviewLine label="Class of" value={fields.classOf} />
              <PreviewLine label="School" value={fields.schoolName} />
              <PreviewLine label="Program" value={fields.programName} />
            </>
          )}

          {t === "birthday" && (
            <>
              <PreviewLine label="Description" value={fields.description} />
              <PreviewLine label="Date" value={fields.date} />
            </>
          )}

          {t === "sports" && (
            <>
              <PreviewLine label="Team" value={fields.team} />
              <PreviewLine label="Number" value={fields.number} />
              <PreviewLine label="Stats" value={fields.stats} />
            </>
          )}

          {t === "trips" && (
            <>
              <PreviewLine label="Description" value={fields.description} />
              <PreviewLine label="Date" value={fields.date} />
            </>
          )}

          {t === "weddings" && (
            <>
              <PreviewLine label="Description" value={fields.description} />
              <PreviewLine label="Date" value={fields.date} />
            </>
          )}

          {t === "newborns" && (
            <>
              <PreviewLine label="Description" value={fields.description} />
              <PreviewLine label="Date" value={fields.date} />
            </>
          )}

          {t === "sportsleagues" && (
            <>
              <PreviewLine label="Team" value={fields.team} />
              <PreviewLine label="Number" value={fields.number} />
              <PreviewLine label="Season" value={fields.season} />
            </>
          )}

          {/* Template image */}
          <div className="mt-5 border border-orange-200 rounded-xl overflow-hidden bg-white">
            <div className="h-40 bg-orange-50 flex items-center justify-center">
              <img
                src={template.thumb}
                alt={`${template.name} template`}
                className="h-full w-full object-contain"
                draggable="false"
              />
            </div>
          </div>

          <div className="mt-3 grid grid-cols-5 gap-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="h-10 rounded-lg bg-orange-50 border border-orange-200"
                title="Gallery photo slot"
              />
            ))}
          </div>

          <div className="mt-4 h-10 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-center text-xs text-orange-700">
            Video plays on tap (NFC)
          </div>
        </div>
      </div>

      <p className="text-xs text-orange-700 mt-3">
        Next you’ll upload: <span className="font-semibold">1 cover photo</span>, up to{" "}
        <span className="font-semibold">5 gallery photos</span>, and{" "}
        <span className="font-semibold">1 video</span>.
      </p>
    </div>
  )
}

export default function Customize() {
  const router = useRouter()

  const [templateId, setTemplateId] = useState("graduation")
  const [cardFields, setCardFields] = useState({})

  const selectedTemplate = useMemo(
    () => TEMPLATES.find((t) => t.id === templateId) || TEMPLATES[0],
    [templateId]
  )

  const fieldDefs = useMemo(() => {
    return FIELD_DEFS[templateId] || []
  }, [templateId])

  // Load draft
  useEffect(() => {
    const raw = localStorage.getItem("cardDraft")
    if (!raw) return
    try {
      const d = JSON.parse(raw)
      if (d.templateId) setTemplateId(d.templateId)
      if (d.cardFields && typeof d.cardFields === "object") setCardFields(d.cardFields)
    } catch {}
  }, [])

  const saveDraft = (nextFields = cardFields, nextTemplateId = templateId) => {
    const draft = { templateId: nextTemplateId, cardFields: nextFields }
    localStorage.setItem("cardDraft", JSON.stringify(draft))
  }

  const setField = (key, value) => {
    setCardFields((prev) => {
      const next = { ...prev, [key]: value }
      return next
    })
  }

  const handleTemplateChange = (newId) => {
    setTemplateId(newId)

    // Optionally keep old values across templates.
    // If you'd rather clear fields when switching template, uncomment the next two lines:
    // setCardFields({})
    // saveDraft({}, newId)

    // We'll keep existing fields and just save the new templateId.
    saveDraft(cardFields, newId)
  }

  const validateRequired = () => {
    const defs = FIELD_DEFS[templateId] || []
    for (const f of defs) {
      if (f.required && !String(cardFields[f.key] || "").trim()) {
        return `Please fill in: ${f.label}`
      }
    }
    return null
  }

  const handleContinue = () => {
    const msg = validateRequired()
    if (msg) return alert(msg)

    saveDraft(cardFields, templateId)
    router.push("/create")
  }

  const handleReset = () => {
    setTemplateId("graduation")
    setCardFields({})
    localStorage.removeItem("cardDraft")
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* Header row */}
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-orange-800">Customize your card</h1>
            <p className="text-orange-700 mt-1">
              Your inputs change depending on the template you choose.
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => router.push("/")}
              className="border border-orange-300 text-orange-700 hover:bg-orange-50 px-4 py-2 rounded-xl font-semibold"
              type="button"
            >
              ← Back
            </button>

            <button
              onClick={handleReset}
              className="border border-orange-300 text-orange-700 hover:bg-orange-50 px-4 py-2 rounded-xl font-semibold"
              type="button"
            >
              Reset
            </button>

            <button
              onClick={handleContinue}
              className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-xl font-semibold"
              type="button"
            >
              Continue to Upload →
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mt-8">
          {/* Left side */}
          <div className="bg-white border border-orange-200 rounded-2xl p-6 shadow-sm">
            <p className="font-semibold text-orange-800 mb-3">Choose a template</p>

            <div className="grid grid-cols-2 gap-3">
              {TEMPLATES.map((t) => {
                const selected = templateId === t.id
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => handleTemplateChange(t.id)}
                    className={[
                      "border rounded-xl p-3 text-left transition overflow-hidden",
                      selected ? "border-orange-600 bg-orange-50" : "border-orange-200 hover:bg-orange-50",
                    ].join(" ")}
                  >
                    <div className={`h-2 rounded-full ${t.accent}`} />

                    <div className="mt-3 border border-orange-200 rounded-lg overflow-hidden bg-white">
                      <div className="h-24 bg-orange-50">
                        <img
                          src={t.thumb}
                          alt={`${t.name} thumbnail`}
                          className="w-full h-full object-contain"
                          draggable="false"
                        />
                      </div>
                    </div>

                    <p className="mt-2 font-semibold text-sm text-orange-800">{t.name}</p>
                    <p className="text-xs text-orange-700">Tap-to-play keepsake</p>
                  </button>
                )
              })}
            </div>

            {/* Dynamic fields */}
            <div className="mt-6 space-y-4">
              {fieldDefs.map((f) => (
                <div key={f.key}>
                  <label className="block text-sm font-semibold text-orange-800 mb-1">
                    {f.label} {f.required ? <span className="text-orange-600">*</span> : null}
                  </label>
                  <input
                    className="border border-orange-200 bg-white p-3 w-full rounded-xl text-black placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-300"
                    value={cardFields[f.key] || ""}
                    onChange={(e) => setField(f.key, e.target.value)}
                    onBlur={() => saveDraft()}
                    placeholder={f.placeholder}
                  />
                </div>
              ))}
            </div>

            <p className="text-xs text-orange-700 mt-4">
              Tip: Keep text short so it looks clean on a credit-card-sized PVC card.
            </p>
          </div>

          {/* Right side */}
          <div className="flex flex-col gap-4">
            <p className="font-semibold text-orange-800">Live preview</p>

            <CardPreview template={selectedTemplate} fields={cardFields} />

            <div className="bg-white border border-orange-200 rounded-2xl p-5 text-orange-700 shadow-sm">
              <p className="font-semibold text-orange-800">Next step</p>
              <p className="text-sm mt-1">
                Next you’ll upload your media (cover + photos + video).
              </p>

              <button
                onClick={handleContinue}
                className="mt-4 bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-xl font-semibold"
                type="button"
              >
                Continue to Upload →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}