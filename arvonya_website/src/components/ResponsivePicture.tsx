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

const FALLBACK_WIDTHS = [480, 768, 1024, 1440, 1920];

function variantSrc(src: string, extension: "webp" | "avif", width: number) {
  return src.replace(/\.[^.]+$/, `-${width}.${extension}`);
}

function buildFallbackSrcSet(src: string, extension: "webp" | "avif") {
  return FALLBACK_WIDTHS.map((width) => `${variantSrc(src, extension, width)} ${width}w`).join(
    ", ",
  );
}

function variantsFor() {
  return [];
}

function srcSetFor(src: string, extension: "webp" | "avif") {
  const variants = variantsFor(src);
  if (variants.length === 0) return buildFallbackSrcSet(src, extension);
  return variants.map((v) => `${v[extension]} ${v.width}w`).join(", ");
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
      <source type="image/avif" srcSet={srcSetFor(src, "avif")} sizes={sizes} />
      <source type="image/webp" srcSet={srcSetFor(src, "webp")} sizes={sizes} />
      <img
        {...imgProps}
        src={src}
        srcSet={srcSetFor(src, "webp")}
        sizes={sizes}
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
