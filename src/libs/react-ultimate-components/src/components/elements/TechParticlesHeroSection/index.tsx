"use client";

/* eslint-disable react-hooks/set-state-in-effect */
import type React from "react";
import { loadLinksPreset } from "@tsparticles/preset-links";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import clsx from "clsx";
import { useEffect, useState } from "react";

interface TechParticlesHeroSectionProps {
  children?: React.ReactNode;
  className?: string;
  particlesColors?: string[];
  animationSpeed?: "slow" | "medium" | "fast";
}

export default function TechParticlesHeroSection({
  children,
  className,
  particlesColors,
  animationSpeed = "medium",
}: TechParticlesHeroSectionProps) {
  const [init, setInit] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadLinksPreset(engine);
    }).then(() => setInit(true));
  }, []);

  return (
    <div
      className={clsx(
        "relative w-[100vw] h-[72vh] overflow-hidden flex items-center justify-center bg-gradient-to-b from-gray-900  to-black",
        className
      )}
    >
      {init && (
        <Particles
          id="tsparticles"
          className="absolute inset-0 z-0 pointer-events-none"
          options={{
            fullScreen: { enable: false },
            background: {
              color: { value: "transparent" },
            },
            backgroundMask: { enable: false },

            preset: "links",
            detectRetina: true,
            smooth: true,
            pauseOnOutsideViewport: true,
            fpsLimit:
              animationSpeed === "slow"
                ? 200
                : animationSpeed === "fast"
                ? 32
                : 120,

            particles: {
              color: {
                value: particlesColors ?? [
                  "#3456c5",
                  "#885ce9",
                  "#182fda",
                  "#2d6dd5",
                  "#4379ed",
                  "#140a80",
                ],
              },
              links: {
                enable: true,
                distance: 150,
                opacity: 0.5,
              },
              move: {
                enable: true,
              },
            },
          }}
        />
      )}
      {children}
      <style>{`
        #tsparticles canvas {
          background: transparent !important;
        }
      `}</style>
    </div>
  );
}

