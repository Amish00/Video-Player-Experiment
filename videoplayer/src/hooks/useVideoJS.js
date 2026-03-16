import { useEffect, useRef } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";

export function useVideoJS(options = {}) {
  const videoRef = useRef(null);
  const playerRef = useRef(null);

  useEffect(() => {
    if (!videoRef.current) return;

    if (!playerRef.current) {
      const videoElement = document.createElement("video");
      videoElement.classList.add("video-js", "vjs-big-play-centered");
      videoRef.current.appendChild(videoElement);

      playerRef.current = videojs(videoElement, {
        controls: false,
        autoplay: false,
        preload: "auto",
        fluid: false,
        responsive: false,
        html5: {
          vhs: { overrideNative: true },
          nativeVideoTracks: false,
          nativeAudioTracks: false,
          nativeTextTracks: false,
        },
        ...options,
      });
    }

    return () => {
      if (playerRef.current && !playerRef.current.isDisposed()) {
        playerRef.current.dispose();
        playerRef.current = null;
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { videoRef, player: playerRef.current, playerRef };
}
