export default function IframePlayer({ embedUrl, title }) {
  return (
    <div
      className="relative w-full bg-black overflow-hidden rounded-xl"
      style={{ aspectRatio: "16/9" }}
    >
      <iframe
        src={embedUrl}
        title={title || "Video"}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        className="absolute inset-0 w-full h-full border-0"
      />
    </div>
  );
}
