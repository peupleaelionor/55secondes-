"use client";

import { useState, type ReactNode, type CSSProperties } from "react";

interface Props {
  src: string;
  alt: string;
  className?: string;
  style?: CSSProperties;
  /** Rendered if the image is missing/fails to load (keeps the UI intact). */
  fallback?: ReactNode;
  draggable?: boolean;
}

/**
 * Renders an image from /public, falling back gracefully when the file is not
 * present yet (assets are dropped in later — see README "Assets à générer").
 * Never crashes the UI on a missing asset.
 */
export function AssetImage({ src, alt, className, style, fallback, draggable = false }: Props) {
  const [failed, setFailed] = useState(false);
  if (failed) return <>{fallback ?? null}</>;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      className={className}
      style={style}
      draggable={draggable}
      loading="lazy"
      onError={() => setFailed(true)}
    />
  );
}
