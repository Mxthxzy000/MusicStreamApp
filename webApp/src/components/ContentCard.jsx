import { Play, Pause, X, Music2 } from "lucide-react"
import { FavoriteButton } from "./FavoriteButton"
import { useState, useRef, useEffect } from "react"

export function ContentCard({ content }) {
  const [showPlayer, setShowPlayer] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)

  const audioRef = useRef(null)

  const handlePlay = (e) => {
    e?.stopPropagation()

    if (!content.preview_url) {
      alert("Prévia indisponível para esta faixa.")
      return
    }

    setShowPlayer(true)

    setTimeout(() => {
      if (audioRef.current) {
        audioRef.current.play()
        setIsPlaying(true)
      }
    }, 100)
  }

  const handleClose = () => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }

    setCurrentTime(0)
    setIsPlaying(false)
    setShowPlayer(false)
  }

  const togglePlayback = () => {
    if (!audioRef.current) return

    if (isPlaying) {
      audioRef.current.pause()
      setIsPlaying(false)
    } else {
      audioRef.current.play()
      setIsPlaying(true)
    }
  }

  useEffect(() => {
    const audio = audioRef.current

    if (!audio) return

    const updateTime = () => {
      setCurrentTime(audio.currentTime)
    }

    const updateDuration = () => {
      setDuration(audio.duration || 0)
    }

    const handleEnded = () => {
      setIsPlaying(false)
    }

    audio.addEventListener("timeupdate", updateTime)
    audio.addEventListener("loadedmetadata", updateDuration)
    audio.addEventListener("ended", handleEnded)

    return () => {
      audio.removeEventListener("timeupdate", updateTime)
      audio.removeEventListener("loadedmetadata", updateDuration)
      audio.removeEventListener("ended", handleEnded)
    }
  }, [showPlayer])

  const formatTime = (seconds) => {
    if (!seconds || Number.isNaN(seconds)) return "0:00"

    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)

    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const progress =
    duration > 0 ? (currentTime / duration) * 100 : 0

  return (
    <>
      <article className="group relative overflow-hidden rounded-2xl bg-card border border-border transition-all hover:border-primary/60 hover:neon-border">
        <div className="relative aspect-square overflow-hidden">
          <img
            src={content.cover_url || "/placeholder.svg"}
            alt={`Capa de ${content.title}`}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-card via-card/20 to-transparent opacity-80" />

          <div className="absolute right-3 top-3">
            <FavoriteButton contentId={content.id} size="sm" />
          </div>

          <button
            aria-label="Reproduzir prévia"
            onClick={handlePlay}
            className="absolute bottom-3 left-3 flex h-11 w-11 items-center justify-center rounded-full bg-primary text-primary-foreground opacity-0 shadow-lg transition-all duration-300 group-hover:opacity-100 hover:scale-110 active:scale-95"
          >
            <Play className="h-5 w-5 fill-current" />
          </button>
        </div>

        <div className="p-4">
          {content.genre?.name && (
            <span className="text-xs font-semibold uppercase tracking-wider text-secondary">
              {content.genre.name}
            </span>
          )}

          <h3 className="mt-1 truncate font-display text-base font-semibold text-card-foreground">
            {content.title}
          </h3>

          <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
            {content.synopsis}
          </p>

          <button
            onClick={handlePlay}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-primary/10 border border-primary/30 px-3 py-2 text-sm font-medium text-primary transition-all hover:bg-primary/20 hover:neon-border"
          >
            <Play className="h-4 w-4 fill-current" />
            Ouvir prévia
          </button>
        </div>
      </article>

      {showPlayer && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center sm:items-center p-4"
          onClick={handleClose}
        >
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

          <div
            className="relative w-full max-w-sm rounded-2xl bg-card border border-border p-6 shadow-2xl neon-border"
            onClick={(e) => e.stopPropagation()}
          >
            <audio
              ref={audioRef}
              src={content.preview_url}
              preload="metadata"
            />

            <button
              onClick={handleClose}
              aria-label="Fechar player"
              className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-muted text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex items-center gap-4 mb-5">
              <img
                src={content.cover_url || "/placeholder.svg"}
                alt={content.title}
                className="h-20 w-20 rounded-xl object-cover border border-border"
              />

              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wider text-secondary mb-1">
                  {content.genre?.name}
                </p>

                <h3 className="font-display font-bold text-foreground leading-tight">
                  {content.title}
                </h3>

                {content.artist && (
                  <p className="text-sm text-muted-foreground">
                    {content.artist}
                  </p>
                )}
              </div>
            </div>

            <div className="relative h-1.5 rounded-full bg-muted mb-3 overflow-hidden">
              <div
                className="h-full rounded-full bg-primary"
                style={{
                  width: `${progress}%`,
                }}
              />
            </div>

            <div className="flex justify-between text-xs text-muted-foreground mb-5">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>

            <div className="flex items-center justify-center gap-4">
              <button
                onClick={togglePlayback}
                className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg neon-border hover:brightness-110 transition-all active:scale-95"
              >
                {isPlaying ? (
                  <Pause className="h-6 w-6 fill-current" />
                ) : (
                  <Play className="h-6 w-6 fill-current" />
                )}
              </button>
            </div>

            <div className="mt-4 flex items-center gap-2 rounded-xl bg-muted/50 px-3 py-2.5">
              <Music2 className="h-4 w-4 shrink-0 text-secondary" />
              <p className="text-xs text-muted-foreground line-clamp-2">
                {content.synopsis}
              </p>
            </div>

            {(content.spotify_url ||
              content.deezer_url ||
              content.album) && (
              <div className="mt-4 space-y-3">
                {content.album && (
                  <p className="text-sm text-muted-foreground">
                    <strong>Álbum:</strong> {content.album}
                  </p>
                )}

                <div className="flex gap-2">
                  {content.spotify_url && (
                    <a
                      href={content.spotify_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 rounded-xl border px-3 py-2 text-center text-sm font-medium hover:bg-muted"
                    >
                      Spotify
                    </a>
                  )}

                  {content.deezer_url && (
                    <a
                      href={content.deezer_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 rounded-xl border px-3 py-2 text-center text-sm font-medium hover:bg-muted"
                    >
                      Deezer
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}

export default ContentCard