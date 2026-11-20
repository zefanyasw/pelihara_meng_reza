/**
 * MIMI & MOCHI — A LITTLE COZY CAT LIFE
 * Polaroid Photo Studio & Scrapbook Album
 */

import { audio } from './audioEngine.js';

export class PhotoStudio {
  constructor(roomCanvas) {
    this.sourceCanvas = roomCanvas;
    this.currentFilter = 'cozy';
    this.currentStickers = [];
    this.caption = 'A cozy afternoon with my sweet companions 💕';
  }

  /**
   * Captures a snapshot from the main room canvas and draws the styled Polaroid
   */
  captureSnapshot(targetCanvas) {
    if (!targetCanvas || !this.sourceCanvas) return;
    const ctx = targetCanvas.getContext('2d');
    const w = targetCanvas.width;
    const h = targetCanvas.height;

    ctx.clearRect(0, 0, w, h);

    // 1. Polaroid White Paper Border
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, w, h);

    // Soft paper texture tint
    ctx.fillStyle = '#FAF7F2';
    ctx.fillRect(0, 0, w, h);

    // 2. Photo Area (square-ish snapshot inside the frame)
    const photoMarginX = 18;
    const photoMarginY = 18;
    const photoW = w - photoMarginX * 2;
    const photoH = h - 90;

    // Source coordinates (center crop from room canvas)
    const sw = this.sourceCanvas.width;
    const sh = this.sourceCanvas.height;
    const cropSize = Math.min(sw, sh) * 0.8;
    const sx = (sw - cropSize) * 0.5;
    const sy = (sh - cropSize) * 0.45;

    ctx.drawImage(this.sourceCanvas, sx, sy, cropSize, cropSize, photoMarginX, photoMarginY, photoW, photoH);

    // 3. Apply Filter Preset
    this.applyFilterPreset(ctx, photoMarginX, photoMarginY, photoW, photoH, this.currentFilter);

    // 4. Subtle Vignette around Photo
    const vigGrad = ctx.createRadialGradient(
      photoMarginX + photoW / 2, photoMarginY + photoH / 2, photoW * 0.35,
      photoMarginX + photoW / 2, photoMarginY + photoH / 2, photoW * 0.65
    );
    vigGrad.addColorStop(0, 'rgba(0,0,0,0)');
    vigGrad.addColorStop(1, 'rgba(74, 55, 40, 0.22)');
    ctx.fillStyle = vigGrad;
    ctx.fillRect(photoMarginX, photoMarginY, photoW, photoH);

    // 5. Draw Cute Stamps / Stickers
    this.currentStickers.forEach(sticker => {
      ctx.font = '28px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(sticker.emoji, photoMarginX + sticker.x * photoW, photoMarginY + sticker.y * photoH);
    });

    // 6. Polaroid Bottom Caption & Timestamp
    ctx.fillStyle = '#4A3728';
    ctx.font = 'bold 15px "Quicksand", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(this.caption, w / 2, h - 50);

    const dateStr = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    ctx.fillStyle = '#A88056';
    ctx.font = '12px "Quicksand", sans-serif';
    ctx.fillText(`Mimi & Mochi Sanctuary • ${dateStr}`, w / 2, h - 25);

    audio.playCameraShutter();
  }

  applyFilterPreset(ctx, x, y, w, h, filterName) {
    ctx.save();
    if (filterName === 'warm_retro') {
      ctx.fillStyle = 'rgba(230, 126, 34, 0.18)';
      ctx.fillRect(x, y, w, h);
    } else if (filterName === 'cozy') {
      ctx.fillStyle = 'rgba(250, 210, 184, 0.14)';
      ctx.fillRect(x, y, w, h);
    } else if (filterName === 'twilight') {
      ctx.fillStyle = 'rgba(197, 185, 205, 0.22)';
      ctx.fillRect(x, y, w, h);
    }
    ctx.restore();
  }

  addSticker(emoji, x = 0.8, y = 0.8) {
    this.currentStickers.push({ emoji, x, y });
  }

  clearStickers() {
    this.currentStickers = [];
  }

  downloadPhoto(canvas, filename = 'cozy_cat_snapshot.png') {
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = filename;
    link.href = canvas.toDataURL('image/png');
    link.click();
  }
}
