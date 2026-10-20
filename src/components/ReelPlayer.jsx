import { useEffect, useId, useRef, useState } from 'react'
import { Captions, ChevronDown, Download, Maximize, Minimize, Pause, Play, RotateCcw, Volume2, VolumeX } from 'lucide-react'
import './ReelPlayer.css'

const VIDEO_URL = '/media/bhoomika-introduction.mp4'
const EXPECTED_DURATION = 60

function formatTime(seconds) {
  const safeSeconds = Math.max(0, Math.floor(Number.isFinite(seconds) ? seconds : 0))
  return `${Math.floor(safeSeconds / 60)}:${String(safeSeconds % 60).padStart(2, '0')}`
}

export default function ReelPlayer() {
  const player = useRef(null)
  const video = useRef(null)
  const coverButton = useRef(null)
  const playButton = useRef(null)
  const isVisible = useRef(true)
  const nativeFullscreen = useRef(false)
  const id = useId()
  const [playing, setPlaying] = useState(false)
  const [started, setStarted] = useState(false)
  const [ended, setEnded] = useState(false)
  const [muted, setMuted] = useState(false)
  const [captions, setCaptions] = useState(false)
  const [ready, setReady] = useState(false)
  const [waiting, setWaiting] = useState(false)
  const [duration, setDuration] = useState(EXPECTED_DURATION)
  const [currentTime, setCurrentTime] = useState(0)
  const [fullscreen, setFullscreen] = useState(false)
  const [canFullscreen, setCanFullscreen] = useState(true)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  useEffect(() => {
    const media = video.current
    const frame = player.current
    setCanFullscreen(Boolean(frame.requestFullscreen || frame.webkitRequestFullscreen || media.webkitEnterFullscreen))

    const pauseWhenHidden = () => {
      if (document.hidden) media.pause()
    }
    const syncFullscreen = () => {
      setFullscreen(document.fullscreenElement === frame || document.webkitFullscreenElement === frame)
    }
    const enterNativeFullscreen = () => {
      nativeFullscreen.current = true
      media.controls = true
      setFullscreen(true)
    }
    const leaveNativeFullscreen = () => {
      nativeFullscreen.current = false
      media.controls = false
      setFullscreen(false)
    }
    const syncCaptions = () => {
      setCaptions(Array.from(media.textTracks).some(track => track.mode === 'showing'))
    }
    const observer = 'IntersectionObserver' in window ? new IntersectionObserver(([entry]) => {
      isVisible.current = entry.isIntersecting
      if (!entry.isIntersecting && !nativeFullscreen.current && document.fullscreenElement !== frame && document.webkitFullscreenElement !== frame) {
        media.pause()
      }
    }, { threshold: 0 }) : null

    observer?.observe(frame)
    document.addEventListener('visibilitychange', pauseWhenHidden)
    document.addEventListener('fullscreenchange', syncFullscreen)
    document.addEventListener('webkitfullscreenchange', syncFullscreen)
    media.addEventListener('webkitbeginfullscreen', enterNativeFullscreen)
    media.addEventListener('webkitendfullscreen', leaveNativeFullscreen)
    media.textTracks.addEventListener('change', syncCaptions)

    return () => {
      observer?.disconnect()
      document.removeEventListener('visibilitychange', pauseWhenHidden)
      document.removeEventListener('fullscreenchange', syncFullscreen)
      document.removeEventListener('webkitfullscreenchange', syncFullscreen)
      media.removeEventListener('webkitbeginfullscreen', enterNativeFullscreen)
      media.removeEventListener('webkitendfullscreen', leaveNativeFullscreen)
      media.textTracks.removeEventListener('change', syncCaptions)
      media.pause()
    }
  }, [])

  async function togglePlayback() {
    const media = video.current
    if (!media.paused && !media.ended) {
      media.pause()
      return
    }
    setError('')
    setNotice('')
    if (media.error || media.networkState === media.NETWORK_NO_SOURCE) media.load()
    if (media.ended) media.currentTime = 0
    setEnded(false)
    setWaiting(true)
    try {
      await media.play()
    } catch (playError) {
      setWaiting(false)
      if (playError.name !== 'AbortError') {
        setError('The video couldn’t start. Try again, or download it below.')
      }
    }
  }

  function handlePlay() {
    if (document.hidden || (!isVisible.current && !nativeFullscreen.current && !document.fullscreenElement && !document.webkitFullscreenElement)) {
      video.current.pause()
      return
    }
    setStarted(true)
    setPlaying(true)
    setEnded(false)
    setError('')
    if (document.activeElement === coverButton.current) {
      playButton.current?.focus({ preventScroll: true })
    }
  }

  function updateDuration() {
    if (Number.isFinite(video.current.duration) && video.current.duration > 0) {
      setDuration(video.current.duration)
      setReady(true)
    }
  }

  function handleMediaError() {
    setError('The video couldn’t load. Try again, or download it below.')
    setPlaying(false)
    setWaiting(false)
    setReady(false)
  }

  function seek(event) {
    const time = Number(event.target.value)
    video.current.currentTime = time
    setCurrentTime(time)
    setEnded(false)
  }

  function toggleCaptions() {
    const track = video.current.textTracks[0]
    if (track) {
      track.mode = captions ? 'hidden' : 'showing'
      setCaptions(!captions)
    }
  }

  async function toggleFullscreen() {
    const frame = player.current
    const media = video.current
    setNotice('')
    try {
      if (document.fullscreenElement || document.webkitFullscreenElement) {
        if (document.exitFullscreen) await document.exitFullscreen()
        else document.webkitExitFullscreen()
      } else if (nativeFullscreen.current && media.webkitExitFullscreen) {
        media.webkitExitFullscreen()
      } else if (frame.requestFullscreen) {
        await frame.requestFullscreen()
      } else if (frame.webkitRequestFullscreen) {
        frame.webkitRequestFullscreen()
      } else if (media.webkitEnterFullscreen) {
        media.webkitEnterFullscreen()
      }
    } catch {
      if (media.webkitEnterFullscreen && !nativeFullscreen.current) {
        try {
          media.webkitEnterFullscreen()
          return
        } catch { /* Keep the inline player available if Safari declines fullscreen. */ }
      }
      setNotice('Fullscreen is unavailable here. You can keep watching in this player.')
    }
  }

  const PlaybackIcon = ended || error ? RotateCcw : playing ? Pause : Play
  const playbackLabel = error ? 'Try again' : ended ? 'Replay' : playing ? 'Pause' : started ? 'Resume' : 'Play'
  const centerLabel = error ? 'Try again' : ended ? 'Play it again' : started ? 'Continue my story' : 'Play my story'
  const progress = duration ? Math.min(100, (currentTime / duration) * 100) : 0

  return (
    <section ref={player} className="reel-player wide" aria-label="Bhoomika’s one-minute introduction">
      <div className="reel-stage">
        <video
          ref={video}
          id={`${id}-video`}
          className="reel-video"
          width="1920"
          height="1080"
          poster="/media/bhoomika-introduction-poster.jpg"
          preload="metadata"
          playsInline
          aria-label="Bhoomika S. — design, code and curiosity"
          aria-describedby={`${id}-description`}
          onLoadedMetadata={updateDuration}
          onDurationChange={updateDuration}
          onPlay={handlePlay}
          onPlaying={() => setWaiting(false)}
          onPause={() => { setPlaying(false); setWaiting(false) }}
          onWaiting={() => setWaiting(true)}
          onCanPlay={() => setWaiting(false)}
          onSeeked={() => setWaiting(false)}
          onTimeUpdate={() => setCurrentTime(video.current.currentTime)}
          onVolumeChange={() => setMuted(video.current.muted || video.current.volume === 0)}
          onEnded={() => { setEnded(true); setPlaying(false); setWaiting(false) }}
          onError={handleMediaError}
        >
          <source src={VIDEO_URL} type="video/mp4" onError={handleMediaError} />
          <track kind="captions" src="/media/bhoomika-introduction.vtt" srcLang="en" label="English" onError={() => setNotice('Captions couldn’t load. You can read the story below.')} />
          Your browser cannot play this video. Use the download link below.
        </video>
        {!playing && (
          <button
            ref={coverButton}
            type="button"
            className="reel-cover"
            onClick={togglePlayback}
            aria-label={`${centerLabel}${!started ? ' with sound' : ''}`}
            aria-controls={`${id}-video`}
          >
            <span className="reel-cover-content">
              <span className="reel-cover-icon"><PlaybackIcon size={29} strokeWidth={1.8} aria-hidden="true" /></span>
              <span className="reel-cover-title">{centerLabel}</span>
              <span className="reel-cover-note">60 sec · Design, code &amp; curiosity</span>
            </span>
          </button>
        )}
        {waiting && <span className="reel-loading" role="status">Loading video…</span>}
      </div>
      <div className="reel-controls" role="group" aria-label="Video controls">
        <button ref={playButton} type="button" className="reel-button reel-play" onClick={togglePlayback} aria-controls={`${id}-video`}>
          <PlaybackIcon size={17} aria-hidden="true" />
          <span>{playbackLabel}</span>
        </button>
        <div className="reel-scrub">
          <input
            className="reel-timeline"
            type="range"
            min="0"
            max={duration}
            step="0.1"
            value={Math.min(currentTime, duration)}
            disabled={!ready}
            onChange={seek}
            aria-label="Video timeline"
            aria-valuetext={`${formatTime(currentTime)} of ${formatTime(duration)}`}
            aria-controls={`${id}-video`}
            style={{ '--reel-progress': `${progress}%` }}
          />
          <span className="reel-time" aria-hidden="true">{formatTime(currentTime)} <span>/ {formatTime(duration)}</span></span>
        </div>
        <div className="reel-utilities">
          <button
            type="button"
            className="reel-button reel-icon-button"
            onClick={() => {
              const media = video.current
              if (media.volume === 0) media.volume = 1
              media.muted = !muted
            }}
            aria-label={muted ? 'Unmute video' : 'Mute video'}
            title={muted ? 'Unmute video' : 'Mute video'}
            aria-controls={`${id}-video`}
          >
            {muted ? <VolumeX size={18} aria-hidden="true" /> : <Volume2 size={18} aria-hidden="true" />}
          </button>
          <button type="button" className="reel-button reel-icon-button" onClick={toggleCaptions} aria-label={captions ? 'Hide English captions' : 'Show English captions'} aria-pressed={captions} title={captions ? 'Hide captions' : 'Show captions'} aria-controls={`${id}-video`}>
            <Captions size={19} aria-hidden="true" />
          </button>
          {canFullscreen && (
            <button type="button" className="reel-button reel-icon-button" onClick={toggleFullscreen} aria-label={fullscreen ? 'Exit fullscreen' : 'Enter fullscreen'} title={fullscreen ? 'Exit fullscreen' : 'Enter fullscreen'} aria-controls={`${id}-video`}>
              {fullscreen ? <Minimize size={17} aria-hidden="true" /> : <Maximize size={17} aria-hidden="true" />}
            </button>
          )}
        </div>
      </div>
      {(error || notice) && <p className="reel-notice" role="status">{error || notice}</p>}
      <div className="reel-footer">
        <details className="reel-story">
          <summary>Read the story <ChevronDown size={13} aria-hidden="true" /></summary>
          <div id={`${id}-description`}>
            <p>It starts with a “what if?” Then I make it real. I’m Bhoomika S., a final-year AI &amp; Data Science engineering student from Bengaluru. I connect product design, full-stack development, and AI to build thoughtful, useful experiences.</p>
            <p>CampusMesh connects students through a campus marketplace. ClearHead combines full-stack development with AI integration. AdaptUI explores a more accessible, adaptable web. SplitGrid simplifies shared expenses through real-time collaboration.</p>
            <p>My other explorations include SafeScan, a product-scanning concept; MediMatch, a healthcare prototype; and AI Smart Store Assistant, an AI product-discovery experience. The animated interfaces are illustrative studies of these projects.</p>
            <p>I study at Don Bosco Institute of Technology, Bengaluru, with a CGPA of 9.0/10. At Jarurat Care Foundation, I worked as a UI/UX Design Intern on healthcare experiences. At Mini Web Solutions / WE3.BUILD, I collaborate on design, frontend development, and digital content.</p>
            <p>Curiosity in design. Purpose in code. I’m open to internships and full-time opportunities. Connect at <a href="mailto:bbhoomikasb11@gmail.com">bbhoomikasb11@gmail.com</a>. The video uses original instrumental music with animated text and no narration.</p>
          </div>
        </details>
        <a className="reel-download" href={VIDEO_URL} download="Bhoomika-S-Introduction.mp4"><Download size={14} aria-hidden="true" /> Download video</a>
      </div>
    </section>
  )
}
