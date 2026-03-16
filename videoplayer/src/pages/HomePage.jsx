import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Play, Link, Youtube, Cloud, Film, Tv2, ArrowRight, Zap } from "lucide-react";

const DEMO_VIDEOS = [
  {
    label: "Cloudinary MP4",
    url: "https://res.cloudinary.com/demo/video/upload/dog.mp4",
    title: "Cloudinary Demo — Dog",
    badge: "MP4",
    icon: Cloud,
    color: "from-blue-500/20 to-cyan-500/20 border-blue-500/30",
  },
  {
    label: "HLS Stream",
    url: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8",
    title: "Mux HLS Test Stream",
    badge: "HLS",
    icon: Tv2,
    color: "from-purple-500/20 to-pink-500/20 border-purple-500/30",
  },
  {
    label: "YouTube",
    url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    title: "YouTube — Rick Astley",
    badge: "YT",
    icon: Youtube,
    color: "from-red-500/20 to-orange-500/20 border-red-500/30",
  },
  {
    label: "Big Buck Bunny",
    url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    title: "Big Buck Bunny",
    badge: "MP4",
    icon: Film,
    color: "from-emerald-500/20 to-teal-500/20 border-emerald-500/30",
  },
  {
    label: "Vimeo",
    url: "https://vimeo.com/76979871",
    title: "Vimeo — The Mountain",
    badge: "VIMEO",
    icon: Play,
    color: "from-cyan-500/20 to-sky-500/20 border-cyan-500/30",
  },
  {
    label: "WebM Video",
    url: "https://www.w3schools.com/html/mov_bbb.mp4",
    title: "W3Schools Sample",
    badge: "MP4",
    icon: Film,
    color: "from-amber-500/20 to-yellow-500/20 border-amber-500/30",
  },
];

export default function HomePage() {
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const navigate = useNavigate();

  const handlePlay = (videoUrl, videoTitle) => {
    const encoded = encodeURIComponent(videoUrl);
    const t = encodeURIComponent(videoTitle || "");
    navigate(`/play?url=${encoded}&title=${t}`);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (url.trim()) handlePlay(url.trim(), title.trim());
  };

  return (
    <div className="min-h-screen bg-void font-body">
      {/* Header */}
      <header className="border-b border-border/50 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-accent/20 border border-accent/40 flex items-center justify-center">
              <Zap className="w-4 h-4 text-accent" />
            </div>
            <span className="font-display font-bold text-lg tracking-tight">FLUX<span className="text-accent">PLAYER</span></span>
          </div>
          <span className="text-xs font-mono text-muted border border-border px-2 py-1 rounded">v2.0</span>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-12">
        {/* Hero */}
        <div className="mb-14 text-center">
          <div className="inline-flex items-center gap-2 bg-accent/10 border border-accent/30 text-accent text-xs font-mono px-3 py-1.5 rounded-full mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            Universal Video Player
          </div>
          <h1 className="font-display text-4xl sm:text-5xl font-extrabold tracking-tight mb-4">
            Play Any Video,<br />
            <span className="text-accent">Anywhere</span>
          </h1>
          <p className="text-white/50 font-body text-base max-w-md mx-auto">
            Supports YouTube, Vimeo, Cloudinary, HLS streams, direct MP4 files, and more.
          </p>
        </div>

        {/* URL Input */}
        <form onSubmit={handleSubmit} className="mb-14">
          <div className="bg-panel border border-border rounded-2xl p-5 shadow-2xl shadow-black/50">
            <label className="text-xs font-display font-semibold text-muted uppercase tracking-widest mb-3 block">
              Paste Video URL
            </label>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 relative">
                <Link className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://example.com/video.mp4 or YouTube/Vimeo link..."
                  className="w-full bg-surface border border-border rounded-xl pl-10 pr-4 py-3 text-sm font-body text-white placeholder-muted focus:outline-none focus:border-accent/60 focus:ring-1 focus:ring-accent/30 transition-all"
                />
              </div>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Title (optional)"
                className="sm:w-48 bg-surface border border-border rounded-xl px-4 py-3 text-sm font-body text-white placeholder-muted focus:outline-none focus:border-accent/60 transition-all"
              />
              <button
                type="submit"
                disabled={!url.trim()}
                className="flex items-center justify-center gap-2 bg-accent text-void font-display font-bold text-sm px-6 py-3 rounded-xl hover:bg-accent-dim transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Play className="w-4 h-4" />
                Play
              </button>
            </div>

            {/* Supported formats */}
            <div className="flex flex-wrap gap-2 mt-4">
              {["MP4", "WebM", "HLS (.m3u8)", "DASH (.mpd)", "YouTube", "Vimeo", "Cloudinary"].map((f) => (
                <span key={f} className="text-xs font-mono text-muted border border-border/60 px-2 py-0.5 rounded-md">{f}</span>
              ))}
            </div>
          </div>
        </form>

        {/* Demo Videos */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display font-bold text-lg">Demo Videos</h2>
            <span className="text-xs font-mono text-muted">{DEMO_VIDEOS.length} sources</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {DEMO_VIDEOS.map((v) => {
              const Icon = v.icon;
              return (
                <button
                  key={v.url}
                  onClick={() => handlePlay(v.url, v.title)}
                  className={`group relative bg-gradient-to-br ${v.color} border rounded-xl p-4 text-left hover:scale-[1.02] transition-all duration-200 active:scale-100`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center">
                      <Icon className="w-4 h-4 text-white/70" />
                    </div>
                    <span className="text-xs font-mono text-white/50 border border-white/20 px-1.5 py-0.5 rounded">{v.badge}</span>
                  </div>
                  <p className="font-display font-semibold text-sm text-white/90 mb-1">{v.label}</p>
                  <p className="text-xs text-white/40 font-body truncate mb-3">{v.title}</p>
                  <div className="flex items-center gap-1 text-xs font-mono text-white/50 group-hover:text-accent transition-colors">
                    Watch now <ArrowRight className="w-3 h-3" />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
