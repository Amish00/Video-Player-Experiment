import { useState, useEffect, useRef, useCallback } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import {
  Play, Pause, Volume2, VolumeX, Volume1,
  SkipForward, SkipBack, Maximize, Minimize,
  Settings, Download, PictureInPicture2,
  ChevronRight, Check, Loader2, RotateCcw,
  Captions, X,
} from "lucide-react";
import { formatTime } from "../utils/videoUtils";

const SPEEDS = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];

export default function VideoPlayer({ src, type = "video", poster, title }) {
  const containerRef = useRef(null);
  const videoRef = useRef(null);
  const playerRef = useRef(null);
  const controlsTimerRef = useRef(null);
  const progressRef = useRef(null);

  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [buffered, setBuffered] = useState(0);
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [settingsTab, setSettingsTab] = useState("main"); // main | speed | quality
  const [speed, setSpeed] = useState(1);
  const [seekPreview, setSeekPreview] = useState(null); // { x, time }
  const [pip, setPip] = useState(false);
  const [qualities, setQualities] = useState([]);
  const [currentQuality, setCurrentQuality] = useState("Auto");
  const [skipAnim, setSkipAnim] = useState(null); // "forward" | "back"
  const [ended, setEnded] = useState(false);

  // Initialize videojs
  useEffect(() => {
    if (!videoRef.current || playerRef.current) return;

    const videoElement = document.createElement("video");
    videoElement.classList.add("video-js");
    videoElement.style.width = "100%";
    videoElement.style.height = "100%";
    if (poster) videoElement.poster = poster;
    videoRef.current.appendChild(videoElement);

    const player = videojs(videoElement, {
      controls: false,
      autoplay: false,
      preload: "auto",
      html5: {
        vhs: { overrideNative: true },
        nativeVideoTracks: false,
        nativeAudioTracks: false,
        nativeTextTracks: false,
      },
    });

    playerRef.current = player;

    // Set source
    if (type === "hls") {
      player.src({ src, type: "application/x-mpegURL" });
    } else if (type === "dash") {
      player.src({ src, type: "application/dash+xml" });
    } else {
      player.src({ src, type: "video/mp4" });
    }

    player.on("loadedmetadata", () => {
      setDuration(player.duration());
      setLoading(false);
      // Detect qualities if HLS
      const vhs = player.tech(true)?.vhs;
      if (vhs) {
        const reps = vhs.representations?.() || [];
        if (reps.length > 1) {
          setQualities(["Auto", ...reps.map((r) => `${r.height}p`).filter(Boolean)]);
        }
      }
    });

    player.on("timeupdate", () => {
      setCurrentTime(player.currentTime());
      // Buffered
      const b = player.bufferedPercent();
      setBuffered(b * 100);
    });

    player.on("play", () => { setPlaying(true); setEnded(false); });
    player.on("pause", () => setPlaying(false));
    player.on("ended", () => { setPlaying(false); setEnded(true); });
    player.on("waiting", () => setLoading(true));
    player.on("canplay", () => setLoading(false));
    player.on("error", () => setError("Failed to load video. Please check the URL."));
    player.on("volumechange", () => {
      setVolume(player.volume());
      setMuted(player.muted());
    });

    return () => {
      if (playerRef.current && !playerRef.current.isDisposed()) {
        playerRef.current.dispose();
        playerRef.current = null;
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src]);

  // Auto-hide controls
  const showControlsTemporarily = useCallback(() => {
    setShowControls(true);
    clearTimeout(controlsTimerRef.current);
    if (playing) {
      controlsTimerRef.current = setTimeout(() => {
        if (!settingsOpen) setShowControls(false);
      }, 3000);
    }
  }, [playing, settingsOpen]);

  useEffect(() => {
    if (!playing) {
      setShowControls(true);
      clearTimeout(controlsTimerRef.current);
    }
  }, [playing]);

  useEffect(() => {
    if (settingsOpen) {
      setShowControls(true);
      clearTimeout(controlsTimerRef.current);
    }
  }, [settingsOpen]);

  // Fullscreen listener
  useEffect(() => {
    const handler = () => setFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handler);
    return () => document.removeEventListener("fullscreenchange", handler);
  }, []);

  // PiP listener
  useEffect(() => {
    const handler = () => setPip(!!document.pictureInPictureElement);
    document.addEventListener("enterpictureinpicture", handler);
    document.addEventListener("leavepictureinpicture", () => setPip(false));
    return () => {
      document.removeEventListener("enterpictureinpicture", handler);
      document.removeEventListener("leavepictureinpicture", () => setPip(false));
    };
  }, []);

  const togglePlay = useCallback(() => {
    const player = playerRef.current;
    if (!player) return;
    if (ended) {
      player.currentTime(0);
      player.play();
      return;
    }
    if (player.paused()) player.play();
    else player.pause();
  }, [ended]);

  const skip = useCallback((seconds) => {
    const player = playerRef.current;
    if (!player) return;
    player.currentTime(Math.max(0, Math.min(player.currentTime() + seconds, duration)));
    setSkipAnim(seconds > 0 ? "forward" : "back");
    setTimeout(() => setSkipAnim(null), 700);
  }, [duration]);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e) => {
      const tag = document.activeElement?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      const player = playerRef.current;
      if (!player) return;
      switch (e.key) {
        case " ":
        case "k":
          e.preventDefault();
          togglePlay();
          break;
        case "ArrowRight":
          e.preventDefault();
          skip(10);
          break;
        case "ArrowLeft":
          e.preventDefault();
          skip(-10);
          break;
        case "ArrowUp":
          e.preventDefault();
          player.volume(Math.min(1, player.volume() + 0.1));
          break;
        case "ArrowDown":
          e.preventDefault();
          player.volume(Math.max(0, player.volume() - 0.1));
          break;
        case "f":
        case "F":
          toggleFullscreen();
          break;
        case "m":
        case "M":
          toggleMute();
          break;
        default:
          break;
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [togglePlay, skip]);

  const handleVolumeChange = (e) => {
    const player = playerRef.current;
    if (!player) return;
    const v = parseFloat(e.target.value);
    player.volume(v);
    player.muted(v === 0);
  };

  const toggleMute = () => {
    const player = playerRef.current;
    if (!player) return;
    player.muted(!player.muted());
  };

  const handleSeek = (e) => {
    const player = playerRef.current;
    if (!player || !duration) return;
    const rect = progressRef.current.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    player.currentTime(ratio * duration);
  };

  const handleProgressHover = (e) => {
    if (!progressRef.current || !duration) return;
    const rect = progressRef.current.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    setSeekPreview({ x: e.clientX - rect.left, time: ratio * duration });
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  const togglePiP = async () => {
    try {
      const player = playerRef.current;
      if (!player) return;
      const videoEl = player.el()?.querySelector("video");
      if (!videoEl) return;
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
      } else {
        await videoEl.requestPictureInPicture();
      }
    } catch (e) {
      console.warn("PiP not supported:", e);
    }
  };

  const handleSpeedChange = (s) => {
    const player = playerRef.current;
    if (!player) return;
    player.playbackRate(s);
    setSpeed(s);
    setSettingsTab("main");
  };

  const handleDownload = () => {
    if (!src) return;
    const a = document.createElement("a");
    a.href = src;
    a.download = title || "video";
    a.target = "_blank";
    a.click();
  };

  const handleQualityChange = (q) => {
    const player = playerRef.current;
    if (!player) return;
    setCurrentQuality(q);
    const vhs = player.tech(true)?.vhs;
    if (vhs) {
      vhs.representations?.().forEach((r) => {
        r.enabled(q === "Auto" || `${r.height}p` === q);
      });
    }
    setSettingsTab("main");
  };

  const VolumeIcon = muted || volume === 0 ? VolumeX : volume < 0.5 ? Volume1 : Volume2;

  return (
    <div
      ref={containerRef}
      className="relative w-full bg-black select-none overflow-hidden rounded-xl"
      style={{ aspectRatio: "16/9" }}
      onMouseMove={showControlsTemporarily}
      onMouseLeave={() => playing && !settingsOpen && setShowControls(false)}
      onClick={(e) => {
        if (e.target === containerRef.current || e.target.classList.contains("video-js") || e.target.tagName === "VIDEO") {
          togglePlay();
        }
      }}
    >
      {/* VideoJS Mount */}
      <div
        ref={videoRef}
        className="absolute inset-0 w-full h-full cursor-pointer"
      />

      {/* Loading Spinner */}
      {loading && !error && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="relative">
            <div className="w-14 h-14 rounded-full border-2 border-accent/20 border-t-accent animate-spin" />
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-void/90">
          <X className="w-12 h-12 text-red-400 mb-3" />
          <p className="text-sm text-red-300 font-body text-center px-6">{error}</p>
        </div>
      )}

      {/* Skip Animations */}
      {skipAnim && (
        <div className={`absolute inset-0 pointer-events-none flex items-center ${skipAnim === "forward" ? "justify-end pr-16" : "justify-start pl-16"}`}>
          <div className="bg-white/10 backdrop-blur-sm rounded-full px-5 py-3 flex items-center gap-1 animate-fadeIn">
            {skipAnim === "forward"
              ? <><SkipForward className="w-5 h-5 text-accent" /><span className="text-accent text-sm font-display font-semibold">+10s</span></>
              : <><SkipBack className="w-5 h-5 text-accent" /><span className="text-accent text-sm font-display font-semibold">-10s</span></>
            }
          </div>
        </div>
      )}

      {/* Ended Overlay */}
      {ended && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <button
            onClick={togglePlay}
            className="flex flex-col items-center gap-3 group"
          >
            <div className="w-20 h-20 rounded-full bg-accent/20 border border-accent/40 flex items-center justify-center group-hover:bg-accent/30 transition-all">
              <RotateCcw className="w-8 h-8 text-accent" />
            </div>
            <span className="text-sm text-white/70 font-display">Replay</span>
          </button>
        </div>
      )}

      {/* Settings Panel */}
      {settingsOpen && (
        <div className="absolute bottom-20 right-4 w-56 bg-panel/95 backdrop-blur-xl border border-border rounded-xl overflow-hidden shadow-2xl animate-slideUp z-30">
          {settingsTab === "main" && (
            <div className="p-1">
              <div className="px-3 py-2 text-xs font-display font-semibold text-muted uppercase tracking-widest">Settings</div>

              {/* Speed */}
              <button
                onClick={() => setSettingsTab("speed")}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-ghost/60 transition-colors"
              >
                <span className="text-sm font-body text-white/80">Playback Speed</span>
                <div className="flex items-center gap-1 text-accent">
                  <span className="text-xs font-mono">{speed === 1 ? "Normal" : `${speed}x`}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </button>

              {/* Quality */}
              {qualities.length > 0 && (
                <button
                  onClick={() => setSettingsTab("quality")}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-ghost/60 transition-colors"
                >
                  <span className="text-sm font-body text-white/80">Quality</span>
                  <div className="flex items-center gap-1 text-accent">
                    <span className="text-xs font-mono">{currentQuality}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                </button>
              )}

              {/* PiP */}
              <button
                onClick={() => { togglePiP(); setSettingsOpen(false); }}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-ghost/60 transition-colors"
              >
                <span className="text-sm font-body text-white/80">Picture in Picture</span>
                <PictureInPicture2 className="w-4 h-4 text-accent" />
              </button>

              {/* Captions placeholder */}
              <button
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-ghost/60 transition-colors opacity-40 cursor-not-allowed"
                disabled
              >
                <span className="text-sm font-body text-white/80">Captions</span>
                <Captions className="w-4 h-4 text-muted" />
              </button>

              <div className="border-t border-border my-1" />

              {/* Download */}
              <button
                onClick={() => { handleDownload(); setSettingsOpen(false); }}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-ghost/60 transition-colors"
              >
                <span className="text-sm font-body text-white/80">Download</span>
                <Download className="w-4 h-4 text-accent" />
              </button>
            </div>
          )}

          {settingsTab === "speed" && (
            <div className="p-1">
              <button
                onClick={() => setSettingsTab("main")}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs font-display font-semibold text-muted uppercase tracking-widest hover:text-white transition-colors"
              >
                <ChevronRight className="w-3 h-3 rotate-180" /> Speed
              </button>
              {SPEEDS.map((s) => (
                <button
                  key={s}
                  onClick={() => handleSpeedChange(s)}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-ghost/60 transition-colors"
                >
                  <span className="text-sm font-body text-white/80">{s === 1 ? "Normal" : `${s}x`}</span>
                  {speed === s && <Check className="w-4 h-4 text-accent" />}
                </button>
              ))}
            </div>
          )}

          {settingsTab === "quality" && (
            <div className="p-1">
              <button
                onClick={() => setSettingsTab("main")}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs font-display font-semibold text-muted uppercase tracking-widest hover:text-white transition-colors"
              >
                <ChevronRight className="w-3 h-3 rotate-180" /> Quality
              </button>
              {qualities.map((q) => (
                <button
                  key={q}
                  onClick={() => handleQualityChange(q)}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-ghost/60 transition-colors"
                >
                  <span className="text-sm font-body text-white/80">{q}</span>
                  {currentQuality === q && <Check className="w-4 h-4 text-accent" />}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Click-away to close settings */}
      {settingsOpen && (
        <div className="absolute inset-0 z-20" onClick={() => setSettingsOpen(false)} />
      )}

      {/* Controls Overlay */}
      <div
        className={`absolute inset-0 flex flex-col justify-end transition-opacity duration-300 z-10 ${showControls ? "opacity-100" : "opacity-0 pointer-events-none"}`}
      >
        {/* Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/10 pointer-events-none" />

        {/* Title */}
        {title && (
          <div className="absolute top-4 left-4 right-4">
            <h3 className="font-display text-sm font-semibold text-white/90 truncate drop-shadow-lg">{title}</h3>
          </div>
        )}

        {/* Bottom controls */}
        <div className="relative z-10 px-4 pb-4 pt-2">
          {/* Progress bar */}
          <div
            ref={progressRef}
            className="relative h-8 flex items-center cursor-pointer group mb-1"
            onClick={handleSeek}
            onMouseMove={handleProgressHover}
            onMouseLeave={() => setSeekPreview(null)}
          >
            {/* Seek preview tooltip */}
            {seekPreview && (
              <div
                className="absolute -top-8 bg-panel border border-border text-xs font-mono text-white px-2 py-0.5 rounded pointer-events-none"
                style={{ left: Math.max(20, Math.min(seekPreview.x - 18, (progressRef.current?.offsetWidth || 0) - 50)) }}
              >
                {formatTime(seekPreview.time)}
              </div>
            )}

            {/* Track */}
            <div className="w-full h-1 group-hover:h-1.5 transition-all rounded-full bg-white/20 relative overflow-hidden">
              {/* Buffered */}
              <div
                className="absolute inset-y-0 left-0 bg-white/25 rounded-full"
                style={{ width: `${buffered}%` }}
              />
              {/* Played */}
              <div
                className="absolute inset-y-0 left-0 bg-accent rounded-full"
                style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
              />
            </div>
          </div>

          {/* Controls row */}
          <div className="flex items-center gap-2">
            {/* Play/Pause */}
            <button
              onClick={togglePlay}
              className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors text-white"
            >
              {loading && !error ? (
                <Loader2 className="w-5 h-5 animate-spin text-accent" />
              ) : playing ? (
                <Pause className="w-5 h-5" />
              ) : (
                <Play className="w-5 h-5 ml-0.5" />
              )}
            </button>

            {/* Skip Back */}
            <button
              onClick={() => skip(-10)}
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors text-white/80 hover:text-white"
            >
              <SkipBack className="w-4 h-4" />
            </button>

            {/* Skip Forward */}
            <button
              onClick={() => skip(10)}
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors text-white/80 hover:text-white"
            >
              <SkipForward className="w-4 h-4" />
            </button>

            {/* Volume */}
            <div className="flex items-center gap-1 group/vol">
              <button
                onClick={toggleMute}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors text-white/80 hover:text-white"
              >
                <VolumeIcon className="w-4 h-4" />
              </button>
              <div className="w-0 overflow-hidden group-hover/vol:w-20 transition-all duration-300">
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.01}
                  value={muted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="w-20 h-1 cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, #E8FF47 ${(muted ? 0 : volume) * 100}%, #2D3748 ${(muted ? 0 : volume) * 100}%)`,
                  }}
                />
              </div>
            </div>

            {/* Time */}
            <div className="flex items-center gap-1 ml-1">
              <span className="text-xs font-mono text-white/90">{formatTime(currentTime)}</span>
              <span className="text-xs font-mono text-white/40">/</span>
              <span className="text-xs font-mono text-white/50">{formatTime(duration)}</span>
            </div>

            {/* Spacer */}
            <div className="flex-1" />

            {/* Speed badge */}
            {speed !== 1 && (
              <span className="text-xs font-mono text-accent border border-accent/40 px-1.5 py-0.5 rounded">
                {speed}x
              </span>
            )}

            {/* PiP */}
            <button
              onClick={togglePiP}
              className="w-8 h-8 hidden sm:flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors text-white/70 hover:text-white"
              title="Picture in Picture"
            >
              <PictureInPicture2 className="w-4 h-4" />
            </button>

            {/* Download */}
            <button
              onClick={handleDownload}
              className="w-8 h-8 hidden sm:flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors text-white/70 hover:text-white"
              title="Download"
            >
              <Download className="w-4 h-4" />
            </button>

            {/* Settings */}
            <button
              onClick={(e) => { e.stopPropagation(); setSettingsOpen((p) => !p); setSettingsTab("main"); }}
              className={`w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors ${settingsOpen ? "text-accent bg-white/10" : "text-white/70 hover:text-white"}`}
            >
              <Settings className="w-4 h-4" />
            </button>

            {/* Fullscreen */}
            <button
              onClick={toggleFullscreen}
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors text-white/70 hover:text-white"
            >
              {fullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
