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

const WIDTHS = [240, 480, 768, 1024, 1440, 1920] as const;

function hasWidthVariants(src: string): boolean {
  return /\/assets\/[^/]+-[A-Za-z0-9]{6,10}-\d+\.(webp|avif)$/.test(src);
}

function variantSrc(src: string, ext: "webp" | "avif", width: number) {
  const base = src.replace(/-\d+\.(webp|avif)$/, "");
  return `${base}-${width}.${ext}`;
}

function buildSrcSet(src: string, ext: "webp" | "avif", maxWidth?: number) {
  return WIDTHS
    .filter(w => !maxWidth || w <= maxWidth * 2)
    .map((w) => `${variantSrc(src, ext, w)} ${w}w`)
    .join(", ");
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
  const fetchPriority = priority ? "high" : "auto";

  if (!hasWidthVariants(src)) {
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
        fetchPriority={fetchPriority}
      />
    );
  }

  return (
    <picture>
      <source type="image/avif" srcSet={buildSrcSet(src, "avif", width)} sizes={sizes} />
      <source type="image/webp" srcSet={buildSrcSet(src, "webp", width)} sizes={sizes} />
      <img
        {...imgProps}
        src={src}
        alt={alt}
        className={className}
        width={width}
        height={height}
        loading={loading}
        decoding="async"
        fetchPriority={fetchPriority}
      />
    </picture>
  );
}