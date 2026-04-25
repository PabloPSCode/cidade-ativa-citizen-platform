"use client";

import { useGLTF } from "@react-three/drei";
import type { ThreeElements } from "@react-three/fiber";
import { forwardRef } from "react";

import type { OrbitControlsProps } from "@react-three/drei";
import { Center, Environment, OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect, useRef } from "react";
import type { Group } from "three";

type ModelProps = ThreeElements["group"] & {
  glbModelPath: string;
};

const GLBModel = forwardRef<Group, ModelProps>(function GLBModel(
  { glbModelPath, ...props },
  ref,
) {
  const { scene } = useGLTF(glbModelPath);
  return (
    <group ref={ref} {...props}>
      <primitive object={scene} />
    </group>
  );
});

GLBModel.displayName = "GLBModel";

interface GLBViewerProps extends Omit<OrbitControlsProps, "enablePan"> {
  glbModelPath: string;
  height?: number | string;
  stopAtFront?: boolean;
  frontRotationY?: number;
  lockAtScrollVH?: number;
  minScale?: number;
  maxScale?: number;
  animateOnScroll?: boolean;
  enablePan?: boolean;
}

export function GLBViewer({
  glbModelPath,
  height,
  stopAtFront = false,
  frontRotationY = 0,
  lockAtScrollVH = 0.6,
  minScale = 0.8,
  maxScale = 1.5,
  animateOnScroll = true,
  enablePan = true,
  ...orbitProps
}: GLBViewerProps) {
  const modelRef = useRef<Group>(null);

  useEffect(() => {
    if (!animateOnScroll) return;
    const rotationFactor = 0.005;
    const scaleFactor = 0.0012;

    let lastScrollY = window.scrollY;
    let currentScale = 1;
    let hasInitializedScale = false;
    let initialRotationY: number | null = null;

    const clamp = (value: number, min: number, max: number) =>
      Math.min(max, Math.max(min, value));

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const delta = currentScrollY - lastScrollY;
      lastScrollY = currentScrollY;

      if (!modelRef.current) {
        return;
      }

      if (initialRotationY === null) {
        initialRotationY = modelRef.current.rotation.y;
      }

      if (!hasInitializedScale) {
        currentScale = clamp(modelRef.current.scale.x, minScale, maxScale);
        hasInitializedScale = true;
      }

      if (stopAtFront) {
        const lockScrollY = Math.max(1, lockAtScrollVH * window.innerHeight);
        const progress = clamp(currentScrollY / lockScrollY, 0, 1);
        const startRotation = initialRotationY ?? 0;
        modelRef.current.rotation.y =
          startRotation + (frontRotationY - startRotation) * progress;
      } else if (delta !== 0) {
        modelRef.current.rotation.y += delta * rotationFactor;
      }

      if (delta !== 0) {
        currentScale = clamp(
          currentScale + delta * scaleFactor,
          minScale,
          maxScale,
        );
        modelRef.current.scale.setScalar(currentScale);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [
    stopAtFront,
    frontRotationY,
    lockAtScrollVH,
    animateOnScroll,
    minScale,
    maxScale,
  ]);

  const containerHeight = height ?? "100vh";

  return (
    <div
      style={{
        width: "100%",
        height: containerHeight,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Canvas>
        <ambientLight intensity={0.6} />
        <directionalLight position={[-10, -10, 2]} intensity={1} />
        <Suspense fallback={null}>
          <Environment preset="park" />
          <Center>
            <GLBModel ref={modelRef} glbModelPath={glbModelPath} />
          </Center>
        </Suspense>
        <OrbitControls
          enableDamping={false}
          enableZoom={false}
          {...orbitProps}
          enablePan={enablePan}
        />
      </Canvas>
    </div>
  );
}
