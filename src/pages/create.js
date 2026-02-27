import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { supabase } from "../lib/supabase"
import { v4 as uuidv4 } from "uuid"

const TEMPLATE_LABELS = {
  graduation: "Graduation",
  birthday: "Birthday",
  sports: "Sports",
  trips: "Trips / Vacations",
  weddings: "Weddings",
  newborns: "Newborns",
  sportsleagues: "Sports Leagues",
}

const SUMMARY_FIELDS = {
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

function SummaryCard({ label, value }) {
  return (
    <div className="border border-orange-200 rounded-xl p-3 bg-orange-50">
      <p className="text-xs text-orange-700">{label}</p>
      <p className="font-semibold text-black break-words">{value || "—"}</p>
    </div>
  )
}

export default function Create() {
  const [draft, setDraft] = useState(null)

  // Internal title
  const [title, setTitle] = useState("")

  // Uploads
  const [coverPhoto, setCoverPhoto] = useState(null)
  const [galleryPhotos, setGalleryPhotos] = useState([])
  const [video, setVideo] = useState(null)

  // UI state
  const [isUploading, setIsUploading] = useState(false)

  useEffect(() => {
    const raw = localStorage.getItem("cardDraft")
    if (!raw) return
    try {
      const parsed = JSON.parse(raw)
      setDraft(parsed)
      if (parsed.title) setTitle(parsed.title)
    } catch {}
  }, [])

  const templateId = draft?.templateId || "graduation"
  const templateName = TEMPLATE_LABELS[templateId] || "Template"
  const customFields = (draft?.cardFields && typeof draft.cardFields === "object") ? draft.cardFields : {}

  const summaryDefs = useMemo(() => SUMMARY_FIELDS[templateId] || [], [templateId])

  const addGalleryFiles = (fileList) => {
    const newFiles = Array.from(fileList || [])
    setGalleryPhotos((prev) => {
      const combined = [...prev, ...newFiles]
      return combined.slice(0, 5)
    })
  }

  const removeGalleryIndex = (idx) => {
    setGalleryPhotos((prev) => prev.filter((_, i) => i !== idx))
  }

  const handleSubmit = async () => {
    if (isUploading) return

    if (!coverPhoto || !video) {
      return alert("Please upload a cover photo and a video.")
    }
    if (galleryPhotos.length > 5) {
      return alert("Please upload up to 5 gallery photos.")
    }

    const userRes = await supabase.auth.getUser()
    const user = userRes.data.user
    if (!user) {
      return alert("You must be logged in to create a card. Go to /login first.")
    }

    if (!draft) {
      return alert("No draft found. Please go to /customize first.")
    }

    setIsUploading(true)

    try {
      const slug = uuidv4().slice(0, 8)

      // ---- Upload cover photo ----
      const coverExt = coverPhoto.name.split(".").pop()
      const coverPath = `covers/${uuidv4()}.${coverExt}`

      const coverUpload = await supabase.storage
        .from("card-media")
        .upload(coverPath, coverPhoto, { contentType: coverPhoto.type })

      if (coverUpload.error) throw new Error("Cover upload error: " + coverUpload.error.message)

      const coverUrl = supabase.storage
        .from("card-media")
        .getPublicUrl(coverPath).data.publicUrl

      // ---- Upload gallery photos ----
      const galleryUrls = []
      for (const file of galleryPhotos) {
        const ext = file.name.split(".").pop()
        const path = `gallery/${uuidv4()}.${ext}`

        const up = await supabase.storage
          .from("card-media")
          .upload(path, file, { contentType: file.type })

        if (up.error) throw new Error("Gallery upload error: " + up.error.message)

        const url = supabase.storage.from("card-media").getPublicUrl(path).data.publicUrl
        galleryUrls.push(url)
      }

      // ---- Upload video ----
      const videoExt = video.name.split(".").pop()
      const videoPath = `videos/${uuidv4()}.${videoExt}`

      const videoUpload = await supabase.storage
        .from("card-media")
        .upload(videoPath, video, { contentType: video.type })

      if (videoUpload.error) throw new Error("Video upload error: " + videoUpload.error.message)

      const videoUrl = supabase.storage
        .from("card-media")
        .getPublicUrl(videoPath).data.publicUrl

      // Pick a sensible fallback title if user leaves it blank
      const autoTitle =
        customFields.name ||
        customFields.location ||
        customFields.brideGroom ||
        `${templateName} Card`

      // ---- Save to DB ----
      const insertRes = await supabase.from("cards").insert({
        id: uuidv4(),
        user_id: user.id,

        // internal title in cards.title
        title: title || autoTitle,

        // template + dynamic data
        template_id: templateId,
        custom_fields: customFields,

        // media
        cover_photo_url: coverUrl,
        gallery_photo_urls: galleryUrls,
        video_url: videoUrl,

        slug,
      })

      if (insertRes.error) throw new Error("DB insert error: " + insertRes.error.message)

      alert(`Card created!\nWatch link: /watch/${slug}`)

      // Optional: clear uploads after success
      setTitle("")
      setCoverPhoto(null)
      setGalleryPhotos([])
      setVideo(null)
    } catch (err) {
      alert(err.message || "Something went wrong.")
      console.error(err)
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-orange-800">Upload your media</h1>
            <p className="text-orange-700 mt-1">
              Add your cover photo, up to 5 gallery photos, and your highlight video.
            </p>
          </div>

          <div className="flex gap-3">
            <Link
              href="/customize"
              className="border border-orange-300 text-orange-700 hover:bg-orange-50 px-4 py-2 rounded-xl font-semibold"
            >
              ← Back to Customize
            </Link>

            <button
              onClick={handleSubmit}
              disabled={isUploading}
              className="bg-orange-600 hover:bg-orange-700 disabled:opacity-60 text-white px-4 py-2 rounded-xl font-semibold"
              type="button"
            >
              {isUploading ? "Creating..." : "Create Card →"}
            </button>
          </div>
        </div>

        {/* Draft summary */}
        <div className="mt-6 bg-white border border-orange-200 rounded-2xl p-5 shadow-sm">
          <p className="text-sm font-semibold text-orange-800">Card details</p>

          {draft ? (
            <div className="mt-3">
              <div className="mb-4 border border-orange-200 rounded-xl p-3 bg-orange-50">
                <p className="text-xs text-orange-700">Template</p>
                <p className="font-semibold text-black">{templateName}</p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {summaryDefs.map((f) => (
                  <SummaryCard
                    key={f.key}
                    label={f.label}
                    value={customFields[f.key]}
                  />
                ))}
              </div>
            </div>
          ) : (
            <div className="mt-3 text-orange-700">
              No draft found. Go to{" "}
              <Link className="underline" href="/customize">
                /customize
              </Link>{" "}
              first.
            </div>
          )}
        </div>

        {/* Internal Title */}
        <div className="mt-6 bg-white border border-orange-200 rounded-2xl p-5 shadow-sm">
          <p className="text-sm font-semibold text-orange-800">Internal Title</p>

          <input
            className="mt-3 border border-orange-200 bg-white p-3 w-full rounded-xl text-black placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-300"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={`e.g., ${templateName} card for sharing`}
          />

          <p className="text-xs text-orange-700 mt-2">
            This title helps you identify the card in your dashboard.
          </p>
        </div>

        {/* Upload cards */}
        <div className="mt-6 grid md:grid-cols-2 gap-6">
          {/* Cover */}
          <div className="bg-white border border-orange-200 rounded-2xl p-6 shadow-sm">
            <p className="text-lg font-extrabold text-orange-800">Cover photo (required)</p>
            <p className="text-sm text-orange-700 mt-1">This is the “front” image of the card.</p>

            <div className="mt-4">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setCoverPhoto(e.target.files?.[0] || null)}
                className="block w-full text-black"
              />
            </div>

            <div className="mt-3 text-sm">
              <span className="font-semibold text-black">Selected:</span>{" "}
              <span className="text-orange-700">{coverPhoto ? coverPhoto.name : "None"}</span>
            </div>

            <button
              type="button"
              onClick={() => setCoverPhoto(null)}
              className="mt-3 text-sm underline text-orange-700"
            >
              Clear cover photo
            </button>
          </div>

          {/* Video */}
          <div className="bg-white border border-orange-200 rounded-2xl p-6 shadow-sm">
            <p className="text-lg font-extrabold text-orange-800">Video (required)</p>
            <p className="text-sm text-orange-700 mt-1">Recommended: MP4 for best playback.</p>

            <div className="mt-4">
              <input
                type="file"
                accept="video/*"
                onChange={(e) => setVideo(e.target.files?.[0] || null)}
                className="block w-full text-black"
              />
            </div>

            <div className="mt-3 text-sm">
              <span className="font-semibold text-black">Selected:</span>{" "}
              <span className="text-orange-700">{video ? video.name : "None"}</span>
            </div>

            <button
              type="button"
              onClick={() => setVideo(null)}
              className="mt-3 text-sm underline text-orange-700"
            >
              Clear video
            </button>
          </div>

          {/* Gallery */}
          <div className="bg-white border border-orange-200 rounded-2xl p-6 shadow-sm md:col-span-2">
            <div className="flex items-end justify-between flex-wrap gap-3">
              <div>
                <p className="text-lg font-extrabold text-orange-800">Gallery photos (optional)</p>
                <p className="text-sm text-orange-700 mt-1">
                  Add up to 5 photos. You can select multiple at once, or add more later.
                </p>
              </div>

              <div className="text-sm text-orange-700">
                Selected: <span className="font-bold text-black">{galleryPhotos.length}</span> / 5
              </div>
            </div>

            <div className="mt-4">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => addGalleryFiles(e.target.files)}
                className="block w-full text-black"
              />
            </div>

            {galleryPhotos.length > 0 && (
              <div className="mt-4 grid md:grid-cols-2 gap-3">
                {galleryPhotos.map((f, idx) => (
                  <div
                    key={`${f.name}-${idx}`}
                    className="border border-orange-200 rounded-xl p-3 flex items-center justify-between bg-orange-50"
                  >
                    <div className="min-w-0">
                      <p className="text-black font-semibold truncate">{f.name}</p>
                      <p className="text-xs text-orange-700">
                        {(f.size / (1024 * 1024)).toFixed(1)} MB
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeGalleryIndex(idx)}
                      className="text-sm underline text-orange-700"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}

            <button
              type="button"
              onClick={() => setGalleryPhotos([])}
              className="mt-4 text-sm underline text-orange-700"
            >
              Clear gallery photos
            </button>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-8 flex justify-end">
          <button
            onClick={handleSubmit}
            disabled={isUploading}
            className="bg-orange-600 hover:bg-orange-700 disabled:opacity-60 text-white px-6 py-3 rounded-xl font-semibold"
            type="button"
          >
            {isUploading ? "Creating..." : "Create Card →"}
          </button>
        </div>
      </div>
    </div>
  )
}