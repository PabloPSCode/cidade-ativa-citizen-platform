"use client";

import {
  CaretCircleLeftIcon,
  CaretCircleRightIcon,
} from "@phosphor-icons/react";
import clsx from "clsx";
import React, { useMemo, useRef } from "react";
import type { Swiper as SwiperInstance } from "swiper";
import { A11y, Autoplay, Grid, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/grid";
import "swiper/css/navigation";
import "swiper/css/pagination";

export type BannerBreakpoint = {
  slidesPerView: number;
  rows?: number;
  spaceBetween?: number;
};

type AutoplayConfig =
  | boolean
  | {
      delay?: number;
      disableOnInteraction?: boolean;
      pauseOnMouseEnter?: boolean;
    };

export interface BannerCarouselProps {
  items: React.ReactNode[];
  showNavigation?: boolean;
  hidePrevButton?: boolean;
  hideNextButton?: boolean;
  showDots?: boolean;
  loop?: boolean;
  autoplay?: AutoplayConfig;
  slidesPerView?: number; // kept for API compatibility (ignored → always 1)
  spaceBetween?: number; // kept for API compatibility (ignored → always 0)
  breakpoints?: Record<number, BannerBreakpoint>; // kept for API compatibility
  className?: string;
}

export default function BannerCarousel({
  items,
  showNavigation = true,
  hidePrevButton = false,
  hideNextButton = false,
  showDots = true,
  loop = false,
  autoplay = {
    delay: 3000,
    disableOnInteraction: false,
    pauseOnMouseEnter: true,
  },
  className,
}: BannerCarouselProps) {
  const swiperRef = useRef<SwiperInstance | null>(null);

  // Single, full-width slide at all widths; no gaps
  const computedBreakpoints = useMemo(() => {
    return {
      0: {
        slidesPerView: 1,
        grid: { rows: 1, fill: "row" as const },
        spaceBetween: 0,
      },
      640: {
        slidesPerView: 1,
        grid: { rows: 1, fill: "row" as const },
        spaceBetween: 0,
      },
      1024: {
        slidesPerView: 1,
        grid: { rows: 1, fill: "row" as const },
        spaceBetween: 0,
      },
      1280: {
        slidesPerView: 1,
        grid: { rows: 1, fill: "row" as const },
        spaceBetween: 0,
      },
    } as const;
  }, []);

  const autoplayOptions =
    autoplay === true
      ? { delay: 3000, disableOnInteraction: false, pauseOnMouseEnter: true }
      : autoplay || undefined;

  return (
    <section className={clsx("w-full", className)}>
      <div className="relative w-full">
        {/* Navigation buttons are OUTSIDE the slides so they work on all slides */}
        {showNavigation && !hidePrevButton && (
          <button
            type="button"
            aria-label="Anterior"
            onClick={() => swiperRef.current?.slidePrev()}
            className={clsx(
              "absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 z-20",
              "inline-flex items-center justify-center rounded-full",
              "w-6 h-6 sm:w-10 sm:h-10",
              "bg-transparent text-white"
            )}
          >
            <CaretCircleLeftIcon weight="fill" size={24} />
          </button>
        )}

        {showNavigation && !hideNextButton && (
          <button
            type="button"
            aria-label="Próximo"
            onClick={() => swiperRef.current?.slideNext()}
            className={clsx(
              "absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 z-20",
              "inline-flex items-center justify-center rounded-full",
              "bg-transparent text-white"
            )}
          >
            <CaretCircleRightIcon weight="fill" size={24} />
          </button>
        )}

        <Swiper
          modules={[Pagination, Grid, A11y, Autoplay]}
          // Base: one full slide, no spacing; prevents next slide peeking
          slidesPerView={1}
          spaceBetween={0}
          grid={{ rows: 1, fill: "row" }}
          loop={loop}
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
          }}
          // Dots under the banner
          pagination={
            showDots
              ? {
                  clickable: false,
                  bulletClass: clsx(
                    "swiper-pagination-bullet bg-foreground/20 w-2 h-2 rounded-full cursor-auto"
                  ),
                  bulletActiveClass: clsx(
                    "swiper-pagination-bullet-active bg-primary-600 w-2 h-2 rounded-full cursor-auto"
                  ),
                }
              : undefined
          }
          // Force 1 slide at all widths
          breakpoints={computedBreakpoints}
          // Autoplay
          autoplay={autoplayOptions as never}
          // Prevent side padding/margins from showing next slide
          centeredSlides={false}
          className="w-full"
        >
          {items.map((it, i) => (
            <SwiperSlide key={i} className="min-h-[60vh]">
              {/* Slide wrapper follows your theme tokens */}
              <div className="w-full h-full bg-card text-card-foreground overflow-hidden">
                {it}
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
