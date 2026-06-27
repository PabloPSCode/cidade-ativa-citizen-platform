"use client";

import dynamic from "next/dynamic";

export const RichText = dynamic(() => import("./index"), { ssr: false });
