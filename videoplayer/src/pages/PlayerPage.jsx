import { useSearchParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Share2, Zap, ExternalLink } from "lucide-react";
import VideoWrapper from "../components/VideoWrapper";
import { detectVideoType } from "../utils/videoUtils";

export default function PlayerPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const url = params.get("url") ? decodeURIComponent(params.get("url")) : "";
  const title = params.get("title") ? decodeURIComponent(params.get("title")) : "";

  const detected = url ? detectVideoType(url) : null;
  const typeLabel = detected
    ? detected.type === "youtube" ? "YouTube"
      : detected.type === "vimeo" ? "Vimeo"
      : detected.type === "hls" ? "HLS Stream"
      : detected.type === "dash" ? "DASH Stream"
      : "Direct Video"
    : "";

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    } catch {
      // ignore
    }
  };

  return (
    <div className="min-h-screen bg-void font-body">
      {/* Header */}
      <header className="border-b border-border/50 px-4 sm:px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/")}
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-ghost transition-colors text-white/60 hover:text-white"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-accent/20 border border-accent/40 flex items-center justify-center">
                <Zap className="w-3 h-3 text-accent" />
              </div>
              <span className="font-display font-bold text-sm tracking-tight hidden sm:block">FLUX<span className="text-accent">PLAYER</span></span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {typeLabel && (
              <span className="text-xs font-mono text-muted border border-border px-2 py-1 rounded-lg">{typeLabel}</span>
            )}
            <button
              onClick={handleShare}
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-ghost transition-colors text-white/60 hover:text-white"
              title="Share"
            >
              <Share2 className="w-4 h-4" />
            </button>
            {url && (
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-ghost transition-colors text-white/60 hover:text-white"
                title="Open original"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {/* Video */}
        {url ? (
          <>
            <VideoWrapper url={url} title={title} />

            {/* Meta */}
            {title && (
              <div className="mt-4">
                <h1 className="font-display font-bold text-xl text-white">{title}</h1>
              </div>
            )}

            {/* Source URL */}
            <div className="mt-3 flex items-center gap-2">
              <span className="text-xs font-mono text-muted truncate max-w-xs sm:max-w-md">{url}</span>
            </div>

            {/* Keyboard shortcuts */}
            <div className="mt-8 bg-panel border border-border rounded-xl p-4">
              <h3 className="font-display text-xs font-semibold text-muted uppercase tracking-widest mb-3">Keyboard Shortcuts</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { key: "Space", action: "Play / Pause" },
                  { key: "← →", action: "Skip 10s" },
                  { key: "↑ ↓", action: "Volume" },
                  { key: "F", action: "Fullscreen" },
                ].map(({ key, action }) => (
                  <div key={key} className="flex items-center gap-2">
                    <kbd className="text-xs font-mono bg-surface border border-border px-1.5 py-0.5 rounded text-accent">{key}</kbd>
                    <span className="text-xs text-white/50 font-body">{action}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-24">
            <p className="text-muted font-body mb-4">No video URL provided.</p>
            <button
              onClick={() => navigate("/")}
              className="text-accent font-display text-sm underline underline-offset-4"
            >
              Go back home
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
