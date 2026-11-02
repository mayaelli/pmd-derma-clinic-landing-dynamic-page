"use client";

import { useState } from "react";
import Image, { ImageProps } from "next/image";

interface SafeImageProps extends Omit<ImageProps, 'onError'> {
  fallbackSrc?: string;
  fallbackElement?: React.ReactNode;
}

/**
 * SafeImage - A wrapper around Next.js Image that handles Supabase loading errors gracefully
 * 
 * Features:
 * - Automatically falls back to a placeholder when the image fails to load
 * - Shows a custom fallback element or a default gradient background
 * - Prevents console spam from upstream image errors
 */
export function SafeImage({ 
  src, 
  alt, 
  fallbackSrc,
  fallbackElement,
  className,
  ...props 
}: SafeImageProps) {
  const [error, setError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // If there was an error and we have a fallback src, use it
  if (error && fallbackSrc) {
    return (
      <Image
        {...props}
        src={fallbackSrc}
        alt={alt}
        className={className}
        onError={() => {
          // If fallback also fails, show the element
          setError(true);
        }}
      />
    );
  }

  // If there was an error and we have a custom fallback element
  if (error && fallbackElement) {
    return <>{fallbackElement}</>;
  }

  // If there was an error and no fallback provided, show beautiful pastel gradient
  if (error) {
    return (
      <div className={`flex items-center justify-center bg-gradient-to-br from-[#FBF4F5] via-[#F7EFE9] to-[#FCE8E6] ${className || ''}`}>
        <div className="w-16 h-16 rounded-full bg-white/40 backdrop-blur-sm" />
      </div>
    );
  }

  // Normal image with error handling
  return (
    <>
      {!imageLoaded && (
        // Show loading skeleton
        <div className={`absolute inset-0 bg-gradient-to-br from-[#F7EFE9] to-[#EDE1D8] animate-pulse ${className || ''}`} />
      )}
      <Image
        {...props}
        src={src}
        alt={alt}
        className={className}
        onError={() => {
          console.warn(`Failed to load image: ${src}`);
          setError(true);
        }}
        onLoad={() => {
          setImageLoaded(true);
        }}
      />
    </>
  );
}
