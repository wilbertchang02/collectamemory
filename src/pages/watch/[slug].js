import { useRouter } from "next/router"
import { useEffect, useMemo, useState } from "react"
import { supabase } from "../../lib/supabase"

const TEMPLATE_LABELS = {
  graduation: "Graduation",
  birthday: "Birthday",
  sports: "Sports",
  trips: "Trips / Vacations",
  weddings: "Weddings",
  newborns: "Newborns",
  sportsleagues: "Sports Leagues",
}

const TEMPLATE_FIELDS = {
  graduation: [
    { key: "name", label: "Name" },
    { key: "classOf", label: "Class of" },
    { key: "schoolName", label: "School" },
    { key: "programName", label: "Program" },
  ],
  birthday: [
    { key: "name", label: "Name" },
    { key: "description", label: "Description" },
    { key: "date", label: "Date" },
  ],
  sports: [
    { key: "name", label: "Name" },
    { key: "team", label: "Team" },
    { key: "number", label: "Number" },
    { key: "stats", label: "Stats" },
  ],
  trips: [
    { key: "location", label: "Location" },
    { key: "description", label: "Description" },
    { key: "date", label: "Date" },
  ],
  weddings: [
    { key: "brideGroom", label: "Bride & Groom" },
    { key: "description", label: "Description" },
    { key: "date", label: "Date" },
  ],
  newborns: [
    { key: "name", label: "Name" },
    { key: "description", label: "Description" },
    { key: "date", label: "Date" },
  ],
  sportsleagues: [
    { key: "name", label: "Name" },
    { key: "team", label: "Team" },
    { key: "number", label: "Number" },
    { key: "season", label: "Season" },
  ],
}

function FieldRow({ label, value }) {
  if (!value) return null
  return (
    <div className="border border-orange-200 rounded-xl p-3 bg-orange-50">
      <p className="text-xs text-orange-700">{label}</p>
      <p className="font-semibold text-black break-words">{value}</p>
    </div>
  )
}

export default function Watch() {
  const router = useRouter()
  const { slug } = router.query
  const [card, setCard] = useState(null)
  const [errorMsg, setErrorMsg] = useState("")
  const [lightboxUrl, setLightboxUrl] = useState(null)

  useEffect(() => {
    if (!slug) return

    const fetchCard = async () => {
      setErrorMsg("")
      const { data, error } = await supabase
        .from("cards")
        .select("*")
        .eq("slug", slug)
        .single()

      if (error) {
        console.error(error)
        setErrorMsg("Card not found (or not accessible).")
        return
      }
      setCard(data)
    }

    fetchCard()
  }, [slug])

  const templateId = card?.template_id || "graduation"
  const templateName = TEMPLATE_LABELS[templateId] || "Template"
  const fieldDefs = TEMPLATE_FIELDS[templateId] || []

  const fields = useMemo(() => {
    if (!card) return {}
    if (card.custom_fields && typeof card.custom_fields === "object") return card.custom_fields
    return {
      name: card.card_name || "",
      description: card.card_description || "",
      date: card.card_date || "",
    }
  }, [card])

  if (errorMsg) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
        <div className="max-w-3xl mx-auto px-6 py-12">
          <p className="text-orange-800 font-extrabold text-2xl">Oops</p>
          <p className="text-orange-700 mt-2">{errorMsg}</p>
        </div>
      </div>
    )
  }

  if (!card) return <p className="p-10">Loading...</p>

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
      <div className="max-w-5xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <p className="text-xs text-orange-700">CollectAMemory • {templateName}</p>
            <h1 className="text-3xl font-extrabold text-orange-800 mt-2">
              {card.title || fields.name || fields.location || fields.brideGroom || "Memory Card"}
            </h1>
          </div>

          <div className="text-sm text-orange-700">
            <span className="font-semibold">Slug:</span> {card.slug}
          </div>
        </div>

        {/* Card details */}
        <div className="mt-6">
          <p className="font-semibold text-orange-800 mb-3">Card details</p>
          <div className="grid md:grid-cols-2 gap-3">
            {fieldDefs.map((f) => (
              <FieldRow key={f.key} label={f.label} value={fields[f.key]} />
            ))}
          </div>
        </div>

        {/* Cover */}
        {card.cover_photo_url && (
          <div className="mt-8">
            <p className="font-semibold text-orange-800 mb-3">Cover</p>
            <img
              src={card.cover_photo_url}
              alt="Cover"
              className="w-full max-w-lg rounded-2xl border border-orange-200 bg-white"
            />
          </div>
        )}

        {/* Gallery (BIGGER) */}
        {Array.isArray(card.gallery_photo_urls) && card.gallery_photo_urls.length > 0 && (
          <div className="mt-8">
            <div className="flex items-end justify-between flex-wrap gap-3">
              <p className="font-semibold text-orange-800">Gallery</p>
              <p className="text-sm text-orange-700">Click an image to enlarge</p>
            </div>

            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {card.gallery_photo_urls.map((url, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setLightboxUrl(url)}
                  className="border border-orange-200 rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-md transition"
                  title="Click to enlarge"
                >
                  <img
                    src={url}
                    alt={`Gallery ${i + 1}`}
                    className="w-full h-64 object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Video */}
        {card.video_url && (
          <div className="mt-8">
            <p className="font-semibold text-orange-800 mb-3">Video</p>
            <video controls className="w-full max-w-3xl rounded-2xl border border-orange-200 bg-white">
              <source src={card.video_url} />
            </video>
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightboxUrl && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50"
          onClick={() => setLightboxUrl(null)}
        >
          <div className="max-w-4xl w-full">
            <img
              src={lightboxUrl}
              alt="Enlarged"
              className="w-full max-h-[85vh] object-contain rounded-2xl bg-white"
            />
            <button
              type="button"
              onClick={() => setLightboxUrl(null)}
              className="mt-3 w-full bg-orange-600 hover:bg-orange-700 text-white py-2 rounded-xl font-semibold"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}