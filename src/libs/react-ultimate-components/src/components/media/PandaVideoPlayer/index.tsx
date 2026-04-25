"use client";

import { getThemeColor } from "../../../utils/colors";

export interface PandaVideoPlayerProps {
  /** É o ID do vídeo a ser reproduzido. Vêm na resposta da API */
  videoId?: string;
  /** É a zona do cliente Panda. Vêm na resposta da API */
  zone?: string;
  /** Cor principal do tema do player em hexadecimal (incluindo o #) */
  themeColor?: string; // e.g. "#0267FF"
  /** Cor dos controles do player em hexadecimal (incluindo o #) */
  controlsColor?: string; // e.g. "#ffffff"
}

export default function PandaVideoPlayer({
  // Public demo defaults so it plays out of the box:
  videoId = "5b858a22-915a-4493-9fc2-dfb74da90470",
  // Public demo zone:
  zone = "d031816a-48f",
  controlsColor,
  themeColor,
}: PandaVideoPlayerProps) {
  const base = `https://player-vz-${zone}.tv.pandavideo.com.br/embed/`;

  const primaryColor = getThemeColor("--color-primary-500");

  const primaryColorString = primaryColor.slice(1); // remove the '#' character

  const params = new URLSearchParams({
    v: videoId,
    controlsColor: controlsColor ?? "#ffffff",
    color: themeColor ?? primaryColorString,
  });

  return (
    <div className="w-full">
      <div style={{ position: "relative", paddingTop: "56.25%" }}>
        <iframe
          id="panda-player"
          key={`${zone}:${videoId}`}
          src={`${base}?${params.toString()}`}
          style={{
            border: "none",
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
          }}
          allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture"
          allowFullScreen
        />
      </div>
    </div>
  );
}

