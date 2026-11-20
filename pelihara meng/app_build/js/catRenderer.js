/**
 * MIMI & MOCHI — A LITTLE COZY CAT LIFE
 * Procedural 2.5D Illustrated Vector Cat Renderer
 * Hand-crafted artistic rendering with soft 3D volume, organic curves, and expressive animation.
 */

export class CatRenderer {
  /**
   * Renders a cat onto a 2D canvas context with 2.5D depth and animation
   * @param {CanvasRenderingContext2D} ctx 
   * @param {Object} cat Cat entity state
   * @param {number} x World X
   * @param {number} y World Y
   * @param {number} time Current timestamp in seconds
   * @param {number} scale Rendering scale (default 1.0)
   */
  static render(ctx, cat, x, y, time, scale = 1.0) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale * (cat.facingLeft ? -1 : 1), scale);

    const breed = cat.breedData || {};
    const state = cat.state || 'idle';
    const isSleeping = state === 'sleeping';
    const isPet = state === 'being_petted';
    const isWalking = state === 'walking';
    const isEating = state === 'eating';
    const isPlaying = state === 'playing';
    const isStretching = state === 'stretching';

    // Animation cycle timers
    const breath = Math.sin(time * 3 + (cat.animOffset || 0)) * 1.5;
    const walkCycle = isWalking ? Math.sin(time * 9) : 0;
    const tailCycle = isSleeping 
      ? Math.sin(time * 1.5) * 0.1 
      : isPlaying 
        ? Math.sin(time * 14) * 0.45 
        : Math.sin(time * 2.5) * 0.25;

    // 1. Soft 2.5D Drop Shadow under cat
    this.drawShadow(ctx, breed, isSleeping, walkCycle);

    if (isSleeping) {
      this.drawCurledSleepingCat(ctx, cat, breed, time, breath);
    } else {
      this.drawStandingCat(ctx, cat, breed, time, breath, walkCycle, tailCycle, isPet, isEating, isPlaying, isStretching);
    }

    ctx.restore();
  }

  /* ==========================================================================
     SHADOW RENDERING
     ========================================================================== */
  static drawShadow(ctx, breed, isSleeping, walkCycle) {
    ctx.save();
    ctx.beginPath();
    const shadowW = isSleeping ? 42 : breed.bodyType === 'fluffy_giant' ? 46 : 38;
    const shadowH = isSleeping ? 18 : 12;
    const shadowY = isSleeping ? 10 : 16 - Math.abs(walkCycle) * 2;

    ctx.ellipse(0, shadowY, shadowW, shadowH, 0, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(74, 55, 40, 0.18)';
    ctx.fill();
    ctx.restore();
  }

  /* ==========================================================================
     STANDING / WALKING / PLAYING / BEING PETTED POSE
     ========================================================================== */
  static drawStandingCat(ctx, cat, breed, time, breath, walkCycle, tailCycle, isPet, isEating, isPlaying, isStretching) {
    const coat = breed.coatColor || '#E67E22';
    const secondary = breed.secondaryColor || '#FDF6EE';
    const accent = breed.accentColor || '#BA4A00';
    const bodyType = breed.bodyType || 'standard';

    // Proportions
    let bodyW = bodyType === 'chubby' ? 36 : bodyType === 'fluffy_giant' ? 40 : 32;
    let bodyH = bodyType === 'chubby' ? 28 : bodyType === 'fluffy_giant' ? 32 : 25;
    let legH = bodyType === 'stubby_legs' ? 8 : 14;

    const stretchOffset = isStretching ? 6 : 0;
    const eatOffset = isEating ? 8 : isPlaying ? 5 : 0;
    const headBob = isEating ? Math.sin(time * 8) * 2 : breath * 0.6;

    // 1. Back Legs & Paws
    this.drawPaws(ctx, breed, -bodyW * 0.35, legH, walkCycle, false);
    this.drawPaws(ctx, breed, bodyW * 0.35, legH, -walkCycle, false);

    // 2. Tail
    this.drawTail(ctx, breed, -bodyW * 0.45, -bodyH * 0.3 + stretchOffset, tailCycle, isPlaying);

    // 3. Body Torso with Soft 3D Lighting
    ctx.save();
    ctx.beginPath();
    ctx.ellipse(0, -bodyH * 0.35 + breath * 0.5 + stretchOffset * 0.5, bodyW, bodyH, 0, 0, Math.PI * 2);

    // Soft Radial Gradient for gentle 3D volume
    const bodyGrad = ctx.createRadialGradient(-6, -bodyH * 0.5, 4, 0, -bodyH * 0.3, bodyW + 4);
    bodyGrad.addColorStop(0, this.lightenColor(coat, 25));
    bodyGrad.addColorStop(0.7, coat);
    bodyGrad.addColorStop(1, this.darkenColor(coat, 20));
    ctx.fillStyle = bodyGrad;
    ctx.fill();

    // Body Fur Texture / Fluff ruffs for fluffy breeds
    if (bodyType === 'fluffy_giant') {
      this.drawFluffyRuffs(ctx, bodyW, bodyH, coat);
    }

    // Pattern Overlays (Tuxedo bib, Tabby stripes, Calico patches, Rosettes, Colorpoint)
    this.drawCoatPatterns(ctx, breed, bodyW, bodyH, coat, secondary, accent);
    ctx.restore();

    // 4. Front Legs & Paws
    this.drawPaws(ctx, breed, -bodyW * 0.25, legH, -walkCycle * 0.8, true);
    this.drawPaws(ctx, breed, bodyW * 0.25, legH, walkCycle * 0.8, true);

    // 5. Head
    const headX = isStretching ? 18 : 12;
    const headY = -bodyH * 0.75 + headBob + eatOffset;
    this.drawHead(ctx, cat, breed, headX, headY, breath, isPet, isEating, isPlaying, time);
  }

  /* ==========================================================================
     CURLED SLEEPING POSE
     ========================================================================== */
  static drawCurledSleepingCat(ctx, cat, breed, time, breath) {
    const coat = breed.coatColor || '#E67E22';
    const secondary = breed.secondaryColor || '#FDF6EE';
    const accent = breed.accentColor || '#BA4A00';
    const bodyType = breed.bodyType || 'standard';

    const r = bodyType === 'fluffy_giant' ? 34 : 28;

    // Curled body croissant
    ctx.save();
    ctx.beginPath();
    ctx.ellipse(0, -r * 0.4 + breath * 0.8, r * 1.25, r * 0.9, 0, 0, Math.PI * 2);

    const grad = ctx.createRadialGradient(-4, -r * 0.6, 4, 0, -r * 0.3, r * 1.3);
    grad.addColorStop(0, this.lightenColor(coat, 25));
    grad.addColorStop(0.7, coat);
    grad.addColorStop(1, this.darkenColor(coat, 20));
    ctx.fillStyle = grad;
    ctx.fill();

    // Fluffy edges
    if (bodyType === 'fluffy_giant') {
      this.drawFluffyRuffs(ctx, r * 1.2, r * 0.85, coat);
    }

    this.drawCoatPatterns(ctx, breed, r * 1.1, r * 0.8, coat, secondary, accent);

    // Sleeping Head tucked into paws
    const headR = 17;
    ctx.beginPath();
    ctx.arc(r * 0.55, -r * 0.25 + breath * 0.4, headR, 0, Math.PI * 2);
    ctx.fillStyle = grad;
    ctx.fill();

    // Sleeping Ears
    this.drawEars(ctx, breed, r * 0.55, -r * 0.25 + breath * 0.4, headR, false);

    // Sleeping Eyes: Curved blissful crescents ( ᴗ ᴗ )
    ctx.strokeStyle = '#4A3728';
    ctx.lineWidth = 1.8;
    ctx.lineCap = 'round';

    ctx.beginPath();
    ctx.arc(r * 0.55 + 4, -r * 0.25 + breath * 0.4, 3.5, 0.15, Math.PI - 0.15);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(r * 0.55 + 11, -r * 0.25 + breath * 0.4, 3.5, 0.15, Math.PI - 0.15);
    ctx.stroke();

    // Pink nose
    ctx.fillStyle = '#E8A598';
    ctx.beginPath();
    ctx.ellipse(r * 0.55 + 8, -r * 0.25 + breath * 0.4 + 4, 2.2, 1.6, 0, 0, Math.PI * 2);
    ctx.fill();

    // Sleeping tail wrapped snugly around paws
    ctx.beginPath();
    ctx.ellipse(-r * 0.2, r * 0.15, r * 0.9, 7, -0.15, 0, Math.PI * 2);
    ctx.fillStyle = this.darkenColor(coat, 10);
    ctx.fill();

    ctx.restore();
  }

  /* ==========================================================================
     HEAD & FACIAL EXPRESSIONS
     ========================================================================== */
  static drawHead(ctx, cat, breed, x, y, breath, isPet, isEating, isPlaying, time) {
    const coat = breed.coatColor || '#E67E22';
    const headW = breed.bodyType === 'chubby' ? 23 : breed.bodyType === 'fluffy_giant' ? 24 : 20;
    const headH = breed.bodyType === 'chubby' ? 20 : 18;

    ctx.save();
    ctx.translate(x, y);

    // Head tilt during petting or play
    if (isPet) ctx.rotate(-0.12);
    if (isPlaying) ctx.rotate(0.08);

    // 1. Ears
    this.drawEars(ctx, breed, 0, 0, headW, isPet);

    // 2. Head Shape
    ctx.beginPath();
    ctx.ellipse(0, 0, headW, headH, 0, 0, Math.PI * 2);

    const headGrad = ctx.createRadialGradient(-3, -headH * 0.5, 3, 0, 0, headW + 2);
    headGrad.addColorStop(0, this.lightenColor(coat, 30));
    headGrad.addColorStop(0.75, coat);
    headGrad.addColorStop(1, this.darkenColor(coat, 18));
    ctx.fillStyle = headGrad;
    ctx.fill();

    // Chubby Cheek Tufts for British Shorthair, Scottish Fold, Persian
    if (breed.bodyType === 'chubby' || breed.bodyType === 'fluffy_giant') {
      ctx.beginPath();
      ctx.arc(-headW * 0.8, headH * 0.2, 6, 0, Math.PI * 2);
      ctx.arc(headW * 0.8, headH * 0.2, 6, 0, Math.PI * 2);
      ctx.fillStyle = this.lightenColor(coat, 15);
      ctx.fill();
    }

    // Colorpoint Face Mask (Siamese / Ragdoll)
    if (breed.pattern === 'colorpoint') {
      ctx.save();
      ctx.beginPath();
      ctx.ellipse(headW * 0.15, headH * 0.1, headW * 0.65, headH * 0.55, 0, 0, Math.PI * 2);
      ctx.fillStyle = breed.secondaryColor || '#48372C';
      ctx.fill();
      ctx.restore();
    }

    // 3. Eyes
    this.drawEyes(ctx, cat, breed, headW, headH, isPet, isEating, isPlaying, time);

    // 4. Snout, Nose & Mouth
    this.drawMuzzle(ctx, headW, headH, isPet, isEating);

    // 5. Whiskers
    this.drawWhiskers(ctx, headW, headH);

    // 6. Blush Cheeks (when petted)
    if (isPet) {
      ctx.fillStyle = 'rgba(232, 165, 152, 0.65)';
      ctx.beginPath();
      ctx.ellipse(-headW * 0.45, 4, 4.5, 3, 0, 0, Math.PI * 2);
      ctx.ellipse(headW * 0.45, 4, 4.5, 3, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }

  /* ==========================================================================
     EYES & BLINK LOGIC
     ========================================================================== */
  static drawEyes(ctx, cat, breed, headW, headH, isPet, isEating, isPlaying, time) {
    const eyeSpacing = headW * 0.45;
    const eyeY = -headH * 0.15;
    const eyeR = isPlaying ? 5.5 : 4.5;

    // Blink calculation (blink every ~4 seconds for 0.15 seconds)
    const blinkCycle = (time + (cat.animOffset || 0) * 2) % 4.2;
    const isBlinking = blinkCycle < 0.18;

    if (isPet || isBlinking) {
      // Happy squint crescents ( ^  ^ )
      ctx.strokeStyle = '#342D26';
      ctx.lineWidth = 2.0;
      ctx.lineCap = 'round';

      ctx.beginPath();
      ctx.arc(-eyeSpacing * 0.5, eyeY, 4, Math.PI * 1.15, Math.PI * 1.85);
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(eyeSpacing * 0.5, eyeY, 4, Math.PI * 1.15, Math.PI * 1.85);
      ctx.stroke();
    } else {
      // Open rounded expressive eyes
      const eyeColors = this.getEyeColors(breed);

      // Left Eye
      this.drawSingleEye(ctx, -eyeSpacing * 0.5, eyeY, eyeR, eyeColors.left, isPlaying);
      // Right Eye
      this.drawSingleEye(ctx, eyeSpacing * 0.5, eyeY, eyeR, eyeColors.right, isPlaying);
    }
  }

  static drawSingleEye(ctx, x, y, r, color, isPlaying) {
    ctx.save();
    // Eye White / Base
    ctx.beginPath();
    ctx.ellipse(x, y, r * 1.1, r * 1.25, 0, 0, Math.PI * 2);
    ctx.fillStyle = '#FFFFFF';
    ctx.fill();

    // Iris Color with Radial Gradient
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    const irisGrad = ctx.createRadialGradient(x - 1, y - 1, 1, x, y, r);
    irisGrad.addColorStop(0, this.lightenColor(color, 40));
    irisGrad.addColorStop(0.7, color);
    irisGrad.addColorStop(1, this.darkenColor(color, 35));
    ctx.fillStyle = irisGrad;
    ctx.fill();

    // Pupil (wide round when playing, slight slit otherwise)
    ctx.beginPath();
    const pupilW = isPlaying ? r * 0.75 : r * 0.45;
    const pupilH = isPlaying ? r * 0.75 : r * 0.85;
    ctx.ellipse(x + 0.3, y, pupilW, pupilH, 0, 0, Math.PI * 2);
    ctx.fillStyle = '#1C1613';
    ctx.fill();

    // Cute White Catchlight Highlights
    ctx.beginPath();
    ctx.arc(x - r * 0.35, y - r * 0.35, r * 0.35, 0, Math.PI * 2);
    ctx.fillStyle = '#FFFFFF';
    ctx.fill();

    ctx.beginPath();
    ctx.arc(x + r * 0.25, y + r * 0.25, r * 0.18, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.fill();

    ctx.restore();
  }

  static getEyeColors(breed) {
    if (breed.eyeColor === 'odd_eyed') {
      return { left: '#2E86C1', right: '#F39C12' }; // Turkish Angora sapphire & amber
    }
    const c = breed.eyeColor || '#E67E22';
    return { left: c, right: c };
  }

  /* ==========================================================================
     EARS
     ========================================================================== */
  static drawEars(ctx, breed, cx, cy, headW, isPet) {
    const earType = breed.earType || 'standard';
    const coat = breed.coatColor || '#E67E22';
    const earY = cy - headW * 0.8;

    ctx.save();
    if (earType === 'folded') {
      // Scottish Fold ears (folded flat to head)
      ctx.fillStyle = coat;
      ctx.beginPath();
      ctx.ellipse(cx - headW * 0.6, earY + 6, 6, 8, -0.6, 0, Math.PI * 2);
      ctx.ellipse(cx + headW * 0.6, earY + 6, 6, 8, 0.6, 0, Math.PI * 2);
      ctx.fill();
    } else {
      // Standard / Bat / Tufted ears
      const earH = earType === 'large_bat' || earType === 'oversized_bat' ? 22 : earType === 'tufted' ? 18 : 14;
      const earBaseW = earType === 'oversized_bat' ? 12 : 9;

      // Left Ear
      ctx.beginPath();
      ctx.moveTo(cx - headW * 0.75, earY + 8);
      ctx.lineTo(cx - headW * 0.55, earY - earH);
      ctx.lineTo(cx - headW * 0.2, earY + 4);
      ctx.closePath();
      ctx.fillStyle = coat;
      ctx.fill();

      // Left Ear Inner Pink
      ctx.beginPath();
      ctx.moveTo(cx - headW * 0.65, earY + 6);
      ctx.lineTo(cx - headW * 0.52, earY - earH + 4);
      ctx.lineTo(cx - headW * 0.3, earY + 4);
      ctx.closePath();
      ctx.fillStyle = '#F5B7B1';
      ctx.fill();

      // Right Ear
      ctx.beginPath();
      ctx.moveTo(cx + headW * 0.2, earY + 4);
      ctx.lineTo(cx + headW * 0.55, earY - earH);
      ctx.lineTo(cx + headW * 0.75, earY + 8);
      ctx.closePath();
      ctx.fillStyle = coat;
      ctx.fill();

      // Right Ear Inner Pink
      ctx.beginPath();
      ctx.moveTo(cx + headW * 0.3, earY + 4);
      ctx.lineTo(cx + headW * 0.52, earY - earH + 4);
      ctx.lineTo(cx + headW * 0.65, earY + 6);
      ctx.closePath();
      ctx.fillStyle = '#F5B7B1';
      ctx.fill();

      // Lynx Tuft Tips (Maine Coon / Norwegian Forest)
      if (earType === 'tufted') {
        ctx.strokeStyle = '#342D26';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(cx - headW * 0.55, earY - earH);
        ctx.lineTo(cx - headW * 0.58, earY - earH - 5);
        ctx.moveTo(cx + headW * 0.55, earY - earH);
        ctx.lineTo(cx + headW * 0.58, earY - earH - 5);
        ctx.stroke();
      }
    }
    ctx.restore();
  }

  /* ==========================================================================
     MUZZLE, NOSE, WHISKERS
     ========================================================================== */
  static drawMuzzle(ctx, headW, headH, isPet, isEating) {
    ctx.save();
    // Tiny sweet pink nose
    ctx.fillStyle = '#E8A598';
    ctx.beginPath();
    ctx.moveTo(0, 3);
    ctx.lineTo(-3, 0);
    ctx.lineTo(3, 0);
    ctx.closePath();
    ctx.fill();

    // Cat smile :3
    ctx.strokeStyle = '#4A3728';
    ctx.lineWidth = 1.4;
    ctx.lineCap = 'round';

    ctx.beginPath();
    ctx.arc(-2.8, 4.5, 2.8, 0, Math.PI * 0.85);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(2.8, 4.5, 2.8, Math.PI * 0.15, Math.PI);
    ctx.stroke();
    ctx.restore();
  }

  static drawWhiskers(ctx, headW, headH) {
    ctx.save();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
    ctx.lineWidth = 1.2;
    ctx.lineCap = 'round';

    // Left Whiskers
    ctx.beginPath();
    ctx.moveTo(-headW * 0.25, 3);
    ctx.lineTo(-headW * 0.95, 1);
    ctx.moveTo(-headW * 0.25, 5);
    ctx.lineTo(-headW * 0.92, 7);
    ctx.stroke();

    // Right Whiskers
    ctx.beginPath();
    ctx.moveTo(headW * 0.25, 3);
    ctx.lineTo(headW * 0.95, 1);
    ctx.moveTo(headW * 0.25, 5);
    ctx.lineTo(headW * 0.92, 7);
    ctx.stroke();
    ctx.restore();
  }

  /* ==========================================================================
     PAWS & TAIL
     ========================================================================== */
  static drawPaws(ctx, breed, x, legH, walkAngle, isFront) {
    const coat = breed.coatColor || '#E67E22';
    const isBirman = breed.id === 'birman'; // Pure white mittens
    const pawColor = isBirman ? '#FFFFFF' : coat;

    ctx.save();
    ctx.translate(x, 0);
    ctx.rotate(walkAngle * 0.3);

    // Leg stalk
    ctx.beginPath();
    ctx.rect(-4.5, 0, 9, legH);
    ctx.fillStyle = this.darkenColor(coat, isFront ? 0 : 15);
    ctx.fill();

    // Rounded Paw Pad
    ctx.beginPath();
    ctx.ellipse(1, legH, 6.5, 4.5, 0, 0, Math.PI * 2);
    ctx.fillStyle = pawColor;
    ctx.fill();

    // Toe indents
    ctx.strokeStyle = 'rgba(74, 55, 40, 0.25)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, legH - 2);
    ctx.lineTo(0, legH + 4);
    ctx.moveTo(3, legH - 2);
    ctx.lineTo(3, legH + 4);
    ctx.stroke();

    ctx.restore();
  }

  static drawTail(ctx, breed, rootX, rootY, tailCycle, isPlaying) {
    const coat = breed.coatColor || '#E67E22';
    const isFluffy = breed.bodyType === 'fluffy_giant';

    ctx.save();
    ctx.translate(rootX, rootY);
    ctx.rotate(-0.8 + tailCycle);

    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(-15, -15, -25, -25, -20 + tailCycle * 15, -45);

    ctx.strokeStyle = coat;
    ctx.lineWidth = isFluffy ? 16 : 8;
    ctx.lineCap = 'round';
    ctx.stroke();

    // Fluffy feather tip for Maine Coon / Ragdoll
    if (isFluffy) {
      ctx.beginPath();
      ctx.arc(-20 + tailCycle * 15, -45, 9, 0, Math.PI * 2);
      ctx.fillStyle = coat;
      ctx.fill();
    }
    ctx.restore();
  }

  /* ==========================================================================
     BREED COAT PATTERNS
     ========================================================================== */
  static drawCoatPatterns(ctx, breed, w, h, coat, secondary, accent) {
    const pattern = breed.pattern || 'solid';

    if (pattern === 'tuxedo_jacket') {
      // White bib on chest
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.ellipse(w * 0.2, 0, w * 0.45, h * 0.65, 0, 0, Math.PI * 2);
      ctx.fill();
    } else if (pattern === 'ginger_mackerel' || pattern === 'mackerel_tabby' || pattern === 'classic_swirl_tabby') {
      // Tabby stripes
      ctx.strokeStyle = accent;
      ctx.lineWidth = 2.2;
      ctx.lineCap = 'round';
      [-w * 0.5, -w * 0.25, 0, w * 0.25].forEach(sx => {
        ctx.beginPath();
        ctx.moveTo(sx, -h * 0.6);
        ctx.quadraticCurveTo(sx + 3, -h * 0.2, sx, 0);
        ctx.stroke();
      });
    } else if (pattern === 'calico_patchwork') {
      // Patchwork blobs
      ctx.fillStyle = '#E67E22'; // Ginger patch
      ctx.beginPath();
      ctx.ellipse(-w * 0.35, -h * 0.3, 10, 8, 0.4, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#2B2B2B'; // Black patch
      ctx.beginPath();
      ctx.ellipse(w * 0.2, -h * 0.4, 9, 7, -0.3, 0, Math.PI * 2);
      ctx.fill();
    } else if (pattern === 'rosette_spotted') {
      // Bengal Rosettes
      ctx.strokeStyle = accent;
      ctx.lineWidth = 2.5;
      [[-w * 0.4, -h * 0.3], [0, -h * 0.45], [w * 0.35, -h * 0.25]].forEach(([rx, ry]) => {
        ctx.beginPath();
        ctx.arc(rx, ry, 5.5, 0.2, Math.PI * 1.8);
        ctx.stroke();
      });
    } else if (pattern === 'starlight_dust') {
      // Celestial sparkles
      ctx.fillStyle = '#F9E79F';
      [[ -12, -15 ], [ 8, -20 ], [ 0, -8 ], [ 16, -10 ]].forEach(([sx, sy]) => {
        ctx.beginPath();
        ctx.arc(sx, sy, 2.2, 0, Math.PI * 2);
        ctx.fill();
      });
    }
  }

  static drawFluffyRuffs(ctx, w, h, coat) {
    ctx.fillStyle = coat;
    for (let i = -3; i <= 3; i++) {
      ctx.beginPath();
      ctx.arc(i * 9, -h * 0.35 + 8, 7, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  /* ==========================================================================
     PORTRAIT RENDERER (FOR CARDS, CAT-DEX & UI)
     ========================================================================== */
  static drawPortrait(canvas, breed, state = 'idle') {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;

    ctx.clearRect(0, 0, w, h);

    // Warm radial background for avatar
    const bgGrad = ctx.createRadialGradient(w / 2, h / 2, 10, w / 2, h / 2, w / 2);
    bgGrad.addColorStop(0, '#FFFFFF');
    bgGrad.addColorStop(0.7, '#FDF8F0');
    bgGrad.addColorStop(1, '#F5EFEB');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, w, h);

    // Render Cat in Center
    const mockCat = {
      breedData: breed,
      state: state,
      facingLeft: false,
      animOffset: 0
    };

    const scale = w / 110;
    this.render(ctx, mockCat, w * 0.5, h * 0.72, 0, scale);
  }

  /* ==========================================================================
     COLOR UTILITIES
     ========================================================================== */
  static lightenColor(hex, percent) {
    const num = parseInt(hex.replace('#', ''), 16);
    const amt = Math.round(2.55 * percent);
    const R = Math.min(255, (num >> 16) + amt);
    const G = Math.min(255, ((num >> 8) & 0x00FF) + amt);
    const B = Math.min(255, (num & 0x0000FF) + amt);
    return `#${(0x1000000 + (R << 16) + (G << 8) + B).toString(16).slice(1)}`;
  }

  static darkenColor(hex, percent) {
    const num = parseInt(hex.replace('#', ''), 16);
    const amt = Math.round(2.55 * percent);
    const R = Math.max(0, (num >> 16) - amt);
    const G = Math.max(0, ((num >> 8) & 0x00FF) - amt);
    const B = Math.max(0, (num & 0x0000FF) - amt);
    return `#${(0x1000000 + (R << 16) + (G << 8) + B).toString(16).slice(1)}`;
  }
}
