"use client";

/* eslint-disable react-hooks/set-state-in-effect */
import type React from "react";
import { loadFirePreset } from "@tsparticles/preset-fire";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import clsx from "clsx";
import { useEffect, useState } from "react";

interface FireParticlesHeroSectionProps {
  children?: React.ReactNode;
  className?: string;
  particlesColors?: string[];
  animationSpeed?: "slow" | "medium" | "fast";
}

export default function FireParticlesHeroSection({
  children,
  className,
  particlesColors,
  animationSpeed = "medium",
}: FireParticlesHeroSectionProps) {
  const [init, setInit] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadFirePreset(engine);
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

            preset: "fire",
            detectRetina: true,
            smooth: true,
            pauseOnOutsideViewport: true,
            fpsLimit:
              animationSpeed === "slow"
                ? 1400
                : animationSpeed === "fast"
                ? 100
                : 320,

            particles: {
              color: {
                value: particlesColors ?? [
                  "#f6ebef",
                  "#f9d6e3",
                  "#f4e0e7",
                  "#ffffff",
                  "#ffffff",
                  "#fbcadd",
                ],
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

