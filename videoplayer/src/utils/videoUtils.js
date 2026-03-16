/**
 * Detects the type of video URL and returns the appropriate player type
 */
export function detectVideoType(url) {
  if (!url) return null;

  const u = url.trim();

  // YouTube
  if (/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)/.test(u)) {
    return { type: "youtube", embedUrl: getYouTubeEmbedUrl(u) };
  }

  // Vimeo
  if (/vimeo\.com\//.test(u)) {
    return { type: "vimeo", embedUrl: getVimeoEmbedUrl(u) };
  }

  // Cloudinary
  if (/cloudinary\.com\//.test(u) || /res\.cloudinary\.com\//.test(u)) {
    return { type: "video", src: u };
  }

  // HLS
  if (u.endsWith(".m3u8")) {
    return { type: "hls", src: u };
  }

  // DASH
  if (u.endsWith(".mpd")) {
    return { type: "dash", src: u };
  }

  // Direct video files
  if (/\.(mp4|webm|ogg|mov|avi|mkv|flv|wmv)(\?.*)?$/i.test(u)) {
    return { type: "video", src: u };
  }

  // Fallback - try as direct video
  return { type: "video", src: u };
}

export function getYouTubeEmbedUrl(url) {
  let id = "";
  const patterns = [
    /youtu\.be\/([^?&]+)/,
    /youtube\.com\/watch\?v=([^&]+)/,
    /youtube\.com\/embed\/([^?&]+)/,
    /youtube\.com\/shorts\/([^?&]+)/,
  ];
  for (const p of patterns) {
    const m = url.match(p);
    if (m) { id = m[1]; break; }
  }
  return `https://www.youtube.com/embed/${id}?autoplay=1&rel=0&modestbranding=1&enablejsapi=1`;
}

export function getVimeoEmbedUrl(url) {
  const m = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  const id = m ? m[1] : "";
  return `https://player.vimeo.com/video/${id}?autoplay=1&title=0&byline=0&portrait=0`;
}

export function formatTime(seconds) {
  if (isNaN(seconds) || !isFinite(seconds)) return "0:00";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  return `${m}:${String(s).padStart(2, "0")}`;
}
