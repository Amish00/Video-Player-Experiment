# ⚡ FluxPlayer

A universal, responsive video player built with **React**, **Vite**, **Video.js**, and **Tailwind CSS**. Supports YouTube, Vimeo, Cloudinary, HLS streams, DASH streams, and direct video files — all with a fully custom UI and controls.

---

## ✨ Features

- **Universal URL Support** — paste any video link and it just works
- **Custom Controls** — fully hand-built control bar (no default Video.js UI)
- **Play / Pause** with animated state transitions
- **Skip Forward / Back** 10 seconds with visual feedback
- **Volume Control** with hover-reveal slider and mute toggle
- **Progress Bar** with buffering indicator and seek-preview tooltip
- **Settings Panel** with submenu navigation:
  - Playback speed (0.25× – 2×)
  - Quality selector (auto-detected for HLS streams)
  - Picture-in-Picture
  - Download
  - Captions (placeholder, extensible)
- **Fullscreen** support
- **Picture-in-Picture** (native browser API)
- **Keyboard Shortcuts**
- **Auto-hiding controls** — disappear after 3s during playback
- **Replay overlay** when video ends
- **Loading spinner** and error state
- **Responsive** — works on mobile, tablet, and desktop
- **React Router** — `/` home page and `/play` player page

---

## 📦 Tech Stack

| Package | Version | Purpose |
|---|---|---|
| `react` | 19 | UI framework |
| `react-dom` | 19 | DOM rendering |
| `react-router-dom` | 7 | Client-side routing |
| `video.js` | 8 | Core video engine (HLS, DASH, MP4) |
| `@videojs/http-streaming` | 3 | HLS & DASH adaptive streaming |
| `tailwindcss` | 3 | Utility-first styling |
| `lucide-react` | 0.577 | Icon library |
| `vite` | 8 | Build tool & dev server |

---

## 🚀 Getting Started

### Prerequisites

- Node.js **18+**
- npm **9+** (or yarn / pnpm)

### Installation

```bash
# Unzip the project
cd videoplayer

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`.

### Build for Production

```bash
npm run build
```

Output is written to the `dist/` folder. Serve it with any static host.

```bash
# Preview the production build locally
npm run preview
```

---

## 🗂️ Project Structure

```
videoplayer/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── VideoPlayer.jsx     # Core player with custom controls (Video.js)
│   │   ├── IframePlayer.jsx    # Embed player for YouTube & Vimeo
│   │   └── VideoWrapper.jsx    # Smart router — detects URL type, picks player
│   ├── hooks/
│   │   └── useVideoJS.js       # Reusable Video.js instance hook
│   ├── pages/
│   │   ├── HomePage.jsx        # URL input form + demo video grid
│   │   └── PlayerPage.jsx      # Player page with metadata & shortcuts
│   ├── utils/
│   │   └── videoUtils.js       # URL detection, embed URL builders, formatTime
│   ├── App.jsx                 # Router setup (/ and /play routes)
│   ├── main.jsx                # React entry point
│   └── index.css               # Global styles + Tailwind directives
├── tailwind.config.js
├── vite.config.js
├── postcss.config.js
└── package.json
```

---

## 🎥 Supported Video Sources

| Source | Example URL Pattern | Player Used |
|---|---|---|
| **YouTube** | `youtube.com/watch?v=...` / `youtu.be/...` / `youtube.com/shorts/...` | IframePlayer |
| **Vimeo** | `vimeo.com/...` | IframePlayer |
| **HLS Stream** | `*.m3u8` | VideoPlayer (VHS) |
| **DASH Stream** | `*.mpd` | VideoPlayer (VHS) |
| **Cloudinary** | `res.cloudinary.com/...` | VideoPlayer |
| **Direct MP4** | `*.mp4`, `*.webm`, `*.ogg` | VideoPlayer |
| **Other video files** | `*.mov`, `*.mkv`, `*.avi` | VideoPlayer (fallback) |

URL detection is handled in `src/utils/videoUtils.js` by the `detectVideoType()` function.

---

## ⌨️ Keyboard Shortcuts

| Key | Action |
|---|---|
| `Space` or `K` | Play / Pause |
| `→` | Skip forward 10s |
| `←` | Skip back 10s |
| `↑` | Volume up 10% |
| `↓` | Volume down 10% |
| `F` | Toggle fullscreen |
| `M` | Toggle mute |

> Shortcuts are disabled when an `<input>` or `<textarea>` is focused.

---

## 🧩 Using the VideoWrapper Component

`VideoWrapper` is the main public-facing component. It accepts a URL, auto-detects the type, and renders the appropriate player.

```jsx
import VideoWrapper from "./components/VideoWrapper";

<VideoWrapper
  url="https://res.cloudinary.com/demo/video/upload/dog.mp4"
  title="My Video"
  poster="https://example.com/thumbnail.jpg"
/>
```

### Props

| Prop | Type | Required | Description |
|---|---|---|---|
| `url` | `string` | ✅ | Any video URL (YouTube, Vimeo, MP4, HLS, etc.) |
| `title` | `string` | ❌ | Displayed in the top-left of the player |
| `poster` | `string` | ❌ | Thumbnail image shown before playback starts |

---

## 🛣️ Routes

| Path | Component | Description |
|---|---|---|
| `/` | `HomePage` | URL input form and demo video cards |
| `/play?url=...&title=...` | `PlayerPage` | Full-page video player |

Both `url` and `title` are passed as URL-encoded query parameters.

```js
// Navigate programmatically
navigate(`/play?url=${encodeURIComponent(videoUrl)}&title=${encodeURIComponent(title)}`);
```

---

## 🎨 Design System

Custom dark theme defined in `tailwind.config.js`:

| Token | Hex | Usage |
|---|---|---|
| `void` | `#080A0F` | Page background |
| `surface` | `#0E1117` | Input / card backgrounds |
| `panel` | `#141820` | Settings panel, overlays |
| `border` | `#1E2530` | Borders and dividers |
| `accent` | `#E8FF47` | Primary accent (lime-yellow) |
| `accent-dim` | `#C8DF2A` | Accent hover state |
| `muted` | `#4A5568` | Muted text |
| `ghost` | `#2D3748` | Hover backgrounds |

**Fonts (via Google Fonts):**

- **Syne** — headings, labels, buttons
- **DM Sans** — body text, descriptions
- **JetBrains Mono** — timestamps, badges, keyboard keys

---

## 🔧 Extending the Player

### Adding Subtitle / Caption Support

In `VideoPlayer.jsx`, wire up a VTT track after the player is initialized:

```js
player.addRemoteTextTrack({
  kind: "subtitles",
  src: "/path/to/subtitles.vtt",
  srclang: "en",
  label: "English",
  default: true,
}, false);
```

Then toggle track visibility through `player.textTracks()`.

### Adding Multiple Quality Sources

For MP4 sources without HLS, extend `VideoWrapper.jsx` to accept a `sources` array and pass it directly to `VideoPlayer`:

```jsx
<VideoPlayer
  sources={[
    { src: "video-1080p.mp4", label: "1080p" },
    { src: "video-720p.mp4",  label: "720p"  },
    { src: "video-480p.mp4",  label: "480p"  },
  ]}
/>
```

### Changing the Skip Duration

In `VideoPlayer.jsx`, the skip buttons call `skip(10)` and `skip(-10)`. Change these numbers to any value in seconds.

### Changing the Controls Auto-hide Delay

Find `controlsTimerRef` in `VideoPlayer.jsx` and adjust the timeout value (default: `3000` ms):

```js
controlsTimerRef.current = setTimeout(() => {
  if (!settingsOpen) setShowControls(false);
}, 3000); // change this value
```

---

## 📋 Scripts

```bash
npm run dev        # Start dev server at http://localhost:5173
npm run build      # Production build → dist/
npm run preview    # Preview the production build locally
npm run lint       # Run ESLint
```


