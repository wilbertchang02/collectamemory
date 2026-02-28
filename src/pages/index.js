import { useEffect, useState } from "react"
import Link from "next/link"

const MOCKUPS = [
  {
    id: "graduation",
    label: "Graduation",
    front: "/templates/graduation-front.png",
    back: "/templates/graduation-back.png",
  },
  {
    id: "birthday",
    label: "Birthday",
    front: "/templates/birthday-front.png",
    back: "/templates/birthday-back.png",
  },
  {
    id: "sports",
    label: "Sports",
    front: "/templates/sports-front.png",
    back: "/templates/sports-back.png",
  },
  {
    id: "trips",
    label: "Trips / Vacations",
    front: "/templates/trips-front.png",
    back: "/templates/trips-back.png",
  },
  {
    id: "weddings",
    label: "Weddings",
    front: "/templates/weddings-front.png",
    back: "/templates/weddings-back.png",
  },
  {
    id: "newborns",
    label: "Newborns",
    front: "/templates/birth-front.png",
    back: "/templates/birth-back.png",
  },
  {
    id: "sportsleagues",
    label: "Sports Leagues",
    front: "/templates/sportsleagues-front.png",
    back: "/templates/sportsleagues-back.png",
  },
]

function useCanHover() {
  const [canHover, setCanHover] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia?.("(hover: hover)")
    if (!mq) return
    const update = () => setCanHover(!!mq.matches)
    update()
    if (mq.addEventListener) mq.addEventListener("change", update)
    else mq.addListener(update)
    return () => {
      if (mq.removeEventListener) mq.removeEventListener("change", update)
      else mq.removeListener(update)
    }
  }, [])

  return canHover
}

function FlipCard({
  label,
  front,
  back,
  hintClassName = "",
  containerClassName = "",
  cardClassName = "",
}) {
  // Mobile: tap toggles flip (one tap flip, one tap flip back)
  // Desktop: hover flips (tap does nothing)
  const [flipped, setFlipped] = useState(false)
  const canHover = useCanHover()

  const handleTap = () => {
    if (canHover) return
    setFlipped((v) => !v)
  }

  const hint = canHover ? "Hover to flip" : "Tap to flip"

  return (
    <div className={`group w-full ${containerClassName}`}>
      <div
        onClick={handleTap}
        role={!canHover ? "button" : undefined}
        tabIndex={!canHover ? 0 : undefined}
        aria-label={!canHover ? `Flip ${label} card` : undefined}
        className={[
          "relative w-full aspect-[1.586/1] [perspective:1200px]",
          canHover ? "" : "cursor-pointer",
          cardClassName,
        ].join(" ")}
      >
        <div
          className="
            absolute inset-0
            transition-transform duration-1000 ease-in-out
            [transform-style:preserve-3d]
            group-hover:[transform:rotateY(180deg)]
          "
          style={{
            transform: !canHover && flipped ? "rotateY(180deg)" : undefined,
          }}
        >
          {/* Front */}
          <div
            className="
              absolute inset-0
              rounded-2xl overflow-hidden
              border border-orange-200 bg-white
              [backface-visibility:hidden]
              shadow-sm
            "
          >
            <img
              src={front}
              alt={`${label} front`}
              className="w-full h-full object-contain bg-white"
              draggable="false"
            />
          </div>

          {/* Back */}
          <div
            className="
              absolute inset-0
              rounded-2xl overflow-hidden
              border border-orange-200 bg-white
              [backface-visibility:hidden]
              shadow-sm
            "
            style={{ transform: "rotateY(180deg)" }}
          >
            <img
              src={back}
              alt={`${label} back`}
              className="w-full h-full object-contain bg-white"
              draggable="false"
            />
          </div>
        </div>
      </div>

      <p className={`text-xs text-orange-700 text-center mt-2 ${hintClassName}`}>
        {hint}
      </p>
    </div>
  )
}

export default function Home() {
  const sportsLeagueMock = MOCKUPS.find((m) => m.id === "sportsleagues")

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
      {/* Header */}
      <header className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="CollectaMemory" className="h-10 w-auto" />
          <div>
            <p className="text-lg font-extrabold text-orange-800">CollectAMemory</p>
            <p className="text-xs text-orange-700">Collect the Memories that Matter Most.</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/login" className="text-sm text-orange-700 hover:underline">
            Login
          </Link>
          <Link
            href="/customize"
            className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg text-sm font-semibold"
          >
            Create a Card
          </Link>
        </div>
      </header>

      {/* Hero */}
      <main className="max-w-6xl mx-auto px-6 pb-16">
        <section className="grid md:grid-cols-2 gap-10 items-center py-12">
          <div>
            <p className="inline-flex items-center gap-2 bg-white border border-orange-200 rounded-full px-3 py-1 text-xs text-orange-700">
              ✨ Tap-to-play PVC NFC memory cards
            </p>

            <h1 className="text-4xl md:text-5xl font-extrabold mt-4 leading-tight text-orange-800">
              Your best moments shouldn’t stay stuck in your camera roll.
            </h1>

            <p className="text-orange-700 mt-4 text-lg">
              CollectaMemory turns your milestone videos and photos into a{" "}
              <span className="font-semibold">wallet-sized</span> keepsake you can{" "}
              <span className="font-semibold">tap</span> to relive anytime.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/customize"
                className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-xl font-semibold"
              >
                Start Designing →
              </Link>

              <Link
                href="/customize"
                className="border border-orange-600 text-orange-700 hover:bg-orange-50 px-6 py-3 rounded-xl font-semibold"
              >
                See Templates
              </Link>
            </div>

            <div className="mt-6 text-sm text-orange-700">
              Perfect for: <span className="font-medium">Graduation</span> •{" "}
              <span className="font-medium">Sports highlights</span> •{" "}
              <span className="font-medium">Birthdays</span> •{" "}
              <span className="font-medium">Trips</span>
            </div>
          </div>

          {/* Right preview block */}
          <div className="bg-white border border-orange-200 rounded-2xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-orange-800">What you get</p>
              <span className="text-xs text-orange-700">PVC • NFC • Tap-to-play</span>
            </div>

            <div className="mt-4 border border-orange-200 rounded-2xl overflow-hidden">
              <div className="h-2 bg-orange-600" />
              <div className="p-5">
                <p className="text-xs text-orange-700">CollectAMemory Card</p>
                <p className="text-2xl font-extrabold mt-2 text-orange-800">
                  One tap. Instant replay.
                </p>
                <p className="text-sm text-orange-700 mt-2">
                  Includes a cover photo, up to 5 gallery photos, and one highlight video.
                </p>

                {/* Replaced sketch with Sports Leagues flip card */}
                <div className="mt-4">
                  <FlipCard
                    label={sportsLeagueMock?.label || "Sports Leagues"}
                    front={sportsLeagueMock?.front || "/templates/sportsleagues-front.png"}
                    back={sportsLeagueMock?.back || "/templates/sportsleagues-back.png"}
                    hintClassName="mt-3"
                    cardClassName="max-w-sm mx-auto"
                  />
                </div>

                <div className="mt-4 h-10 bg-orange-50 rounded-lg flex items-center justify-center text-xs text-orange-700">
                  Video plays on tap
                </div>
              </div>
            </div>

            <p className="text-xs text-orange-700 mt-3">
              Tip: hover (desktop) or tap (mobile) to flip the example card.
            </p>
          </div>
        </section>

        {/* Template mockups section */}
        <section className="py-10 border-t border-orange-200">
          <div className="flex items-end justify-between gap-4 flex-wrap">
            <div>
              <h2 className="text-2xl font-extrabold text-orange-800">Choose a template</h2>
              <p className="text-orange-700 mt-1">
                7 styles for your biggest milestones. Hover (desktop) or tap (mobile) to flip.
              </p>
            </div>

            <Link
              href="/customize"
              className="bg-orange-600 hover:bg-orange-700 text-white px-5 py-2 rounded-xl font-semibold"
            >
              Start with a template →
            </Link>
          </div>

          <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {MOCKUPS.map((m) => (
              <div key={m.id}>
                <FlipCard label={m.label} front={m.front} back={m.back} hintClassName="hidden" />
                <p className="mt-3 text-sm font-semibold text-orange-800 text-center">{m.label}</p>
                <p className="text-xs text-orange-700 text-center">Hover (desktop) / Tap (mobile)</p>
              </div>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section className="py-10 border-t border-orange-200">
          <h2 className="text-2xl font-extrabold mb-4 text-orange-800">How it works</h2>

          <div className="grid md:grid-cols-4 gap-4">
            <div className="bg-white border border-orange-200 rounded-2xl p-5">
              <p className="text-2xl">🎨</p>
              <p className="font-semibold mt-2 text-orange-800">Pick a template</p>
              <p className="text-sm text-orange-700 mt-1">Choose a style that fits your moment.</p>
            </div>

            <div className="bg-white border border-orange-200 rounded-2xl p-5">
              <p className="text-2xl">✍️</p>
              <p className="font-semibold mt-2 text-orange-800">Add your details</p>
              <p className="text-sm text-orange-700 mt-1">Name, date, and a short description.</p>
            </div>

            <div className="bg-white border border-orange-200 rounded-2xl p-5">
              <p className="text-2xl">📸</p>
              <p className="font-semibold mt-2 text-orange-800">Upload media</p>
              <p className="text-sm text-orange-700 mt-1">1 cover photo + up to 5 photos + 1 video.</p>
            </div>

            <div className="bg-white border border-orange-200 rounded-2xl p-5">
              <p className="text-2xl">📲</p>
              <p className="font-semibold mt-2 text-orange-800">Tap to relive</p>
              <p className="text-sm text-orange-700 mt-1">Wallet-sized PVC card with NFC playback.</p>
            </div>
          </div>
        </section>

        <footer className="py-10 text-sm text-orange-700">
          © {new Date().getFullYear()} CollectAMemory • Built for students & unforgettable moments.
        </footer>
      </main>
    </div>
  )
}

