"use client";
import { avatarImagePlaceholder } from "../../../mocks/index";
import clsx from "clsx";
import Image from "next/image";

interface AvatarImageProps {
  className?: string;
  imageUrl?: string;
}

export default function AvatarImage({ className, imageUrl }: AvatarImageProps) {
  return (
    <div
      className={clsx(
        "relative w-full h-full aspect-square rounded-full overflow-hidden",
        className
      )}
    >
      <Image
        src={imageUrl || avatarImagePlaceholder}
        alt="Avatar"
        fill
        sizes="96px"
        className="object-cover"
      />
    </div>
  );
}
