#!/usr/bin/env python3
"""
Batch WebP conversion script for image optimization.
Creates WebP versions of all JPG/PNG files in public/assets.
Usage: python scripts/convert-to-webp.py [--quality 85] [--low-quality]
"""

import os
import sys
import argparse
from pathlib import Path

try:
    from PIL import Image
except ImportError:
    print("Installing Pillow...")
    import subprocess
    subprocess.run([sys.executable, "-m", "pip", "install", "Pillow"], check=True)
    from PIL import Image

def convert_image(input_path: Path, output_path: Path, quality: int = 85) -> None:
    """Convert a single image to WebP format."""
    with Image.open(input_path) as img:
        img.save(output_path, "WEBP", quality=quality, method=6, lossless=False)

def main():
    parser = argparse.ArgumentParser(description="Convert images to WebP")
    parser.add_argument("--quality", type=int, default=85, help="WebP quality (0-100)")
    parser.add_argument("--low-quality", action="store_true", help="Use quality 75 for smaller files")
    args = parser.parse_args()
    
    quality = 75 if args.low_quality else args.quality
    
    assets_dir = Path("public/assets") if Path("public/assets").exists() else Path("arvonya_website/public/assets")
    
    if not assets_dir.exists():
        print(f"Error: Assets directory not found")
        sys.exit(1)
    
    extensions = ['.jpg', '.jpeg', '.png']
    total_saved = 0
    
    print(f"Converting images with quality={quality}...")
    
    for ext in extensions:
        for img_path in sorted(assets_dir.glob(f"*{ext}")):
            if "-" in img_path.stem and any(str(w) in img_path.stem for w in [480, 768, 1024]):
                continue
            
            webp_path = img_path.with_suffix('.webp')
            
            if webp_path.exists():
                continue
            
            original_size = img_path.stat().st_size
            convert_image(img_path, webp_path, quality)
            new_size = webp_path.stat().st_size
            saved = original_size - new_size
            total_saved += saved
            pct = (saved / original_size * 100) if original_size > 0 else 0
            print(f"  ✓ {img_path.name}: {original_size/1024:.0f}KB → {new_size/1024:.0f}KB ({pct:.1f}% saved)")
    
    print(f"\nTotal savings: {total_saved/1024/1024:.2f} MB")

if __name__ == "__main__":
    main()