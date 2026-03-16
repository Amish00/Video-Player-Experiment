import VideoPlayer from "./VideoPlayer";
import IframePlayer from "./IframePlayer";
import { detectVideoType } from "../utils/videoUtils";

export default function VideoWrapper({ url, title, poster }) {
  if (!url) return null;

  const detected = detectVideoType(url);

  if (!detected) {
    return (
      <div className="w-full aspect-video bg-surface rounded-xl flex items-center justify-center">
        <p className="text-muted text-sm font-body">Invalid URL</p>
      </div>
    );
  }

  if (detected.type === "youtube" || detected.type === "vimeo") {
    return <IframePlayer embedUrl={detected.embedUrl} title={title} />;
  }

  return (
    <VideoPlayer
      src={detected.src}
      type={detected.type}
      title={title}
      poster={poster}
    />
  );
}
