import type { ImgHTMLAttributes } from "react";

type ResponsivePictureProps = Omit<
  ImgHTMLAttributes<HTMLImageElement>,
  "src" | "alt" | "className" | "width" | "height" | "srcSet" | "sizes" | "loading" | "decoding"
> & {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
  loading?: "lazy" | "eager";
  width?: number;
  height?: number;
  priority?: boolean;
};

const WIDTHS = [480, 768, 1024, 1440, 1920] as const;

function variantSrc(src: string, extension: "webp" | "avif", width: number) {
  const withoutExt = src.replace(/\.[^.]+$/, "");
  return `${withoutExt}-${width}.${extension}`;
}

function buildSrcSet(src: string, extension: "webp" | "avif") {
  const candidates: string[] = [];
  for (const w of WIDTHS) {
    candidates.push(`${variantSrc(src, extension, w)} ${w}w`);
  }
  candidates.push(`${src} 1w`);
  return candidates.join(", ");
}

export function ResponsivePicture({
  src,
  alt,
  className,
  sizes = "100vw",
  loading = "lazy",
  width,
  height,
  priority = false,
  ...imgProps
}: ResponsivePictureProps) {
  if (!src.startsWith("/assets/") && !src.startsWith("/logo_preview.png")) {
    return (
      <img
        {...imgProps}
        src={src}
        alt={alt}
        className={className}
        width={width}
        height={height}
        loading={loading}
        decoding="async"
        fetchPriority={priority ? "high" : "auto"}
      />
    );
  }

  return (
    <picture>
      <source type="image/avif" srcSet={buildSrcSet(src, "avif")} sizes={sizes} />
      <source type="image/webp" srcSet={buildSrcSet(src, "webp")} sizes={sizes} />
      <img
        {...imgProps}
        src={src}
        alt={alt}
        className={className}
        width={width}
        height={height}
        loading={loading}
        decoding="async"
        fetchPriority={priority ? "high" : "auto"}
      />
    </picture>
  );
}