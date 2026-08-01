#!/usr/bin/env bash
set -euo pipefail

readonly OUTPUT_DIR="/tmp/aurel-liquid-hero-horizonx"
readonly SOURCE_VIDEO="/home/clawd/.openclaw/media/inbound/HERO---1f5cb2b8-8060-44a6-bf32-1676921fe621.mov"
readonly SOURCE_FRAME="/home/clawd/aurel-walkthrough-frame.png"

mkdir -p "$OUTPUT_DIR"

ffmpeg -y -i "$SOURCE_VIDEO" -an \
  -vf "scale=960:720" \
  -c:v libx264 -crf 26 -preset slow -pix_fmt yuv420p -movflags +faststart \
  "$OUTPUT_DIR/aurel-preview.mp4"

ffmpeg -y -i "$SOURCE_VIDEO" -an \
  -vf "pad=1920:1080:(ow-iw)/2:(oh-ih)/2:black" \
  -c:v libx264 -crf 24 -preset slow -pix_fmt yuv420p -movflags +faststart \
  "$OUTPUT_DIR/aurel-walkthrough.mp4"

magick "$SOURCE_FRAME" -resize '1440x1080^' -gravity center -extent 1440x1080 \
  -quality 86 "$OUTPUT_DIR/aurel-cover.webp"

magick /home/clawd/aurel-gallery-hero.png -resize '1920x1080!' \
  -quality 86 "$OUTPUT_DIR/aurel-gallery-hero.webp"

magick /home/clawd/aurel-gallery-responsive.png -resize '1920x1080!' \
  -quality 86 "$OUTPUT_DIR/aurel-gallery-responsive.webp"

rm -f "$OUTPUT_DIR/aurel-liquid-hero.zip"
zip -qr "$OUTPUT_DIR/aurel-liquid-hero.zip" . \
  -x '.git/*' 'node_modules/*' '*.log' '*.tsbuildinfo'

file "$OUTPUT_DIR"/*
du -h "$OUTPUT_DIR"/*
