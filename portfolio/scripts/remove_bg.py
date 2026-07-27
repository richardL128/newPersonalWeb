#!/usr/bin/env python3
"""
Background removal pipeline for profile photos.

Usage:
    python scripts/remove_bg.py <input> [output]  [--force] [--skip] [--keep-source]

    input         — source image (JPG, PNG, WEBP, etc.)
    output        — destination PNG (default: public/profile.png)
    --force       — always remove background regardless of subject coverage
    --skip        — always copy as-is, skipping removal
    --keep-source — do not delete the input file after writing output

After successfully writing the output, the input file is deleted by default.
Pass --keep-source to retain it.

The script removes the background only when the subject does not already fill
most of the frame (coverage < SUBJECT_THRESHOLD). This avoids stripping
contextual backgrounds that are intentionally part of the photo.

Dependencies:
    pip install "rembg[cpu]" pillow
"""

import sys
import argparse
from pathlib import Path

# If the subject occupies more than this fraction of the frame after removal,
# the background is assumed to be intentional and the original is kept instead.
SUBJECT_THRESHOLD = 0.85


def subject_coverage(img_rgba):
    """Return the fraction of pixels that are non-transparent after removal.

    A low value means most of the image was background (removal was useful).
    A high value means the subject already filled the frame (removal is risky).
    """
    total = img_rgba.width * img_rgba.height
    if total == 0:
        return 1.0
    alpha = img_rgba.split()[3]
    # Count pixels whose alpha is above noise threshold (> 10 out of 255)
    opaque = sum(1 for px in alpha.getdata() if px > 10)
    return opaque / total


def process(input_path: Path, output_path: Path, force: bool, skip: bool, keep_source: bool):
    """Run the full pipeline: optionally remove background, write output PNG, delete source.

    When --skip is set, the image is converted to RGBA and saved without any
    background removal. Otherwise, rembg segments the subject and the coverage
    heuristic decides whether the transparent result or the original is saved.
    """
    from PIL import Image

    if skip:
        # Bypass removal — just convert to RGBA PNG and write
        print(f"--skip: copying {input_path} → {output_path}")
        output_path.parent.mkdir(parents=True, exist_ok=True)
        Image.open(input_path).convert("RGBA").save(output_path, "PNG")
        _remove_source(input_path, output_path, keep_source)
        return

    try:
        from rembg import remove
    except ImportError:
        print('rembg not found. Install with: pip install "rembg[cpu]"')
        sys.exit(1)

    print(f"Loading {input_path}…")
    raw = input_path.read_bytes()

    print("Running background removal…")
    result_bytes = remove(raw)

    from io import BytesIO
    result_img = Image.open(BytesIO(result_bytes)).convert("RGBA")

    coverage = subject_coverage(result_img)
    print(f"Subject coverage after removal: {coverage:.1%}")

    output_path.parent.mkdir(parents=True, exist_ok=True)

    if not force and coverage > SUBJECT_THRESHOLD:
        # Subject already filled the frame — background was likely intentional
        print(
            f"Coverage {coverage:.1%} > {SUBJECT_THRESHOLD:.0%} threshold — "
            "background appears intentional, saving original.\n"
            "Use --force to remove anyway."
        )
        Image.open(input_path).convert("RGBA").save(output_path, "PNG")
    else:
        print(f"Saving transparent PNG → {output_path}")
        result_img.save(output_path, "PNG")

    _remove_source(input_path, output_path, keep_source)
    print("Done.")


def _remove_source(input_path: Path, output_path: Path, keep_source: bool):
    """Delete the source file after a successful write, unless opted out.

    Skips deletion when --keep-source is set or when input and output resolve
    to the same path (in-place processing), to prevent accidental data loss.
    """
    if keep_source:
        return
    if input_path.resolve() == output_path.resolve():
        return
    try:
        input_path.unlink()
        print(f"Removed source photo: {input_path}")
    except OSError as e:
        print(f"Warning: could not remove {input_path}: {e}")


def main():
    """Parse arguments and dispatch to process()."""
    parser = argparse.ArgumentParser(
        description=__doc__,
        formatter_class=argparse.RawDescriptionHelpFormatter,
    )
    parser.add_argument("input", help="Source image file")
    parser.add_argument(
        "output",
        nargs="?",
        default="public/profile.png",
        help="Output PNG path (default: public/profile.png)",
    )
    parser.add_argument("--force", action="store_true", help="Always remove background")
    parser.add_argument("--skip", action="store_true", help="Skip removal, just convert and copy")
    parser.add_argument("--keep-source", action="store_true", help="Do not delete the input file after writing output")
    args = parser.parse_args()

    input_path = Path(args.input)
    output_path = Path(args.output)

    if not input_path.exists():
        print(f"Error: input file not found: {input_path}")
        sys.exit(1)

    process(input_path, output_path, force=args.force, skip=args.skip, keep_source=args.keep_source)


if __name__ == "__main__":
    main()
