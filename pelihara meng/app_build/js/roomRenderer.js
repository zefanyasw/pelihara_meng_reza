/**
 * MIMI & MOCHI — A LITTLE COZY CAT LIFE
 * 2.5D Layered Isometric Room Renderer & Depth Sorter
 */

import { WALLPAPERS, FLOORS, getFurnitureById } from './furnitureCatalog.js';

export class RoomRenderer {
  constructor(canvas, particleCanvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.pCanvas = particleCanvas;
    this.pCtx = particleCanvas ? particleCanvas.getContext('2d') : null;

    this.particles = [];
    this.initParticles(35);
  }

  resize() {
    const parent = this.canvas.parentElement;
    if (!parent) return;
    const w = parent.clientWidth;
    const h = parent.clientHeight;

    this.canvas.width = w;
    this.canvas.height = h;

    if (this.pCanvas) {
      this.pCanvas.width = w;
      this.pCanvas.height = h;
    }
  }

  /* ==========================================================================
     MAIN ROOM RENDER PASS
     ========================================================================== */
  render(roomTheme, timeOfDay, placedFurniture, cats, activeToy, foodBowls, gifts, time) {
    const ctx = this.ctx;
    const w = this.canvas.width;
    const h = this.canvas.height;

    ctx.clearRect(0, 0, w, h);

    // 1. Draw Architectural Walls & Wallpapers
    this.drawWalls(ctx, w, h, roomTheme, timeOfDay, time);

    // 2. Draw Floor with 2.5D Perspective
    this.drawFloor(ctx, w, h, roomTheme, timeOfDay);

    // 3. Draw Sunlight Windows & Atmospheric Beams
    this.drawWindowsAndSunbeams(ctx, w, h, timeOfDay, time);

    // 4. Gather all entities for 2.5D Y-Depth Sorting
    const depthList = [];

    // Furniture
    (placedFurniture || []).forEach(f => {
      depthList.push({
        type: 'furniture',
        y: f.y + (f.h || 40) * 0.5,
        entity: f
      });
    });

    // Food Bowls
    (foodBowls || []).forEach(b => {
      depthList.push({
        type: 'food_bowl',
        y: b.y,
        entity: b
      });
    });

    // Cat Gifts
    (gifts || []).forEach(g => {
      depthList.push({
        type: 'gift',
        y: g.y,
        entity: g
      });
    });

    // Cats
    (cats || []).forEach(c => {
      depthList.push({
        type: 'cat',
        y: c.y,
        entity: c
      });
    });

    // Active Toy (Yarn Ball, etc)
    if (activeToy && activeToy.type === 'yarn') {
      depthList.push({
        type: 'toy_yarn',
        y: activeToy.y,
        entity: activeToy
      });
    }

    // Sort entities from top (farthest) to bottom (nearest)
    depthList.sort((a, b) => a.y - b.y);

    // 5. Render depth-sorted entities
    depthList.forEach(item => {
      switch (item.type) {
        case 'furniture':
          this.drawFurnitureItem(ctx, item.entity, time);
          break;
        case 'food_bowl':
          this.drawFoodBowl(ctx, item.entity);
          break;
        case 'gift':
          this.drawGift(ctx, item.entity, time);
          break;
        case 'cat':
          // Rendered via CatRenderer
          if (item.entity.render) {
            item.entity.render(ctx, time);
          }
          break;
        case 'toy_yarn':
          this.drawYarnBall(ctx, item.entity);
          break;
      }
    });

    // 6. Ambient Room Post-Processing & Cozy Lighting Filter
    this.drawAmbientLightingFilter(ctx, w, h, timeOfDay);

    // 7. Ambient Particle Simulation
    this.renderParticles(w, h, timeOfDay, time);
  }

  /* ==========================================================================
     WALLS & WALLPAPERS
     ========================================================================== */
  drawWalls(ctx, w, h, roomTheme, timeOfDay, time) {
    const wallH = h * 0.46;
    const wallpaper = WALLPAPERS.find(wp => wp.id === (roomTheme.wallpaper || roomTheme.defaultWallpaper)) || WALLPAPERS[0];

    // Wall base color
    ctx.fillStyle = wallpaper.color;
    ctx.fillRect(0, 0, w, wallH);

    // Soft top shadow / ambient occlusion
    const topGrad = ctx.createLinearGradient(0, 0, 0, wallH);
    topGrad.addColorStop(0, 'rgba(74, 55, 40, 0.12)');
    topGrad.addColorStop(0.85, 'rgba(74, 55, 40, 0.02)');
    topGrad.addColorStop(1, 'rgba(74, 55, 40, 0.08)');
    ctx.fillStyle = topGrad;
    ctx.fillRect(0, 0, w, wallH);

    // Decorative wainscoting / wallpaper lines
    if (wallpaper.pattern === 'wainscot') {
      // Bottom panel rail
      ctx.fillStyle = '#F5EFEB';
      ctx.fillRect(0, wallH - 36, w, 36);
      ctx.fillStyle = '#E8DFD8';
      ctx.fillRect(0, wallH - 38, w, 2);

      // Panel slats
      ctx.fillStyle = '#EFE6DE';
      for (let x = 20; x < w; x += 60) {
        ctx.fillRect(x, wallH - 34, 40, 30);
      }
    } else if (wallpaper.pattern === 'stripes') {
      ctx.fillStyle = 'rgba(232, 165, 152, 0.18)';
      for (let x = 0; x < w; x += 40) {
        ctx.fillRect(x, 0, 20, wallH);
      }
    } else if (wallpaper.pattern === 'brick') {
      ctx.strokeStyle = 'rgba(74, 55, 40, 0.08)';
      ctx.lineWidth = 1.5;
      for (let y = 15; y < wallH; y += 22) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }
    }

    // Baseboard trim at bottom of wall
    ctx.fillStyle = '#4A3728';
    ctx.fillRect(0, wallH - 5, w, 5);
    ctx.fillStyle = '#735742';
    ctx.fillRect(0, wallH - 12, w, 7);
  }

  /* ==========================================================================
     FLOOR & TEXTURES
     ========================================================================== */
  drawFloor(ctx, w, h, roomTheme, timeOfDay) {
    const wallH = h * 0.46;
    const floorH = h - wallH;
    const floor = FLOORS.find(fl => fl.id === (roomTheme.floor || roomTheme.defaultFloor)) || FLOORS[0];

    // Base Floor color
    ctx.fillStyle = floor.color;
    ctx.fillRect(0, wallH, w, floorH);

    // Perspective depth gradient (darker near camera, soft light in middle)
    const floorGrad = ctx.createLinearGradient(0, wallH, 0, h);
    floorGrad.addColorStop(0, 'rgba(74, 55, 40, 0.05)');
    floorGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0.05)');
    floorGrad.addColorStop(1, 'rgba(74, 55, 40, 0.15)');
    ctx.fillStyle = floorGrad;
    ctx.fillRect(0, wallH, w, floorH);

    // Floor Plank Lines
    ctx.strokeStyle = 'rgba(74, 55, 40, 0.12)';
    ctx.lineWidth = 1.5;

    if (floor.pattern === 'planks') {
      const plankH = 34;
      for (let y = wallH + plankH; y < h; y += plankH) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();

        // Staggered vertical plank cuts
        const offset = ((y - wallH) / plankH) % 2 === 0 ? 0 : 80;
        for (let x = offset; x < w; x += 160) {
          ctx.beginPath();
          ctx.moveTo(x, y - plankH);
          ctx.lineTo(x, y);
          ctx.stroke();
        }
      }
    } else if (floor.pattern === 'tatami') {
      const matW = 140;
      for (let x = 0; x < w; x += matW) {
        ctx.fillStyle = 'rgba(74, 55, 40, 0.15)';
        ctx.fillRect(x, wallH, 6, floorH);
      }
    } else if (floor.pattern === 'stone') {
      ctx.strokeStyle = 'rgba(74, 55, 40, 0.15)';
      for (let y = wallH + 40; y < h; y += 45) {
        for (let x = 30; x < w; x += 90) {
          ctx.strokeRect(x, y - 35, 80, 35);
        }
      }
    }
  }

  static safeRoundRect(ctx, x, y, w, h, r = 10) {
    if (ctx.roundRect) {
      try {
        ctx.roundRect(x, y, w, h, r);
        return;
      } catch (e) {}
    }
    const rad = typeof r === 'number' ? r : (Array.isArray(r) ? r[0] : 10);
    ctx.moveTo(x + rad, y);
    ctx.arcTo(x + w, y, x + w, y + h, rad);
    ctx.arcTo(x + w, y + h, x, y + h, rad);
    ctx.arcTo(x, y + h, x, y, rad);
    ctx.arcTo(x, y, x + w, y, rad);
    ctx.closePath();
  }

  /* ==========================================================================
     WINDOWS & DAY/NIGHT SKY
     ========================================================================== */
  drawWindowsAndSunbeams(ctx, w, h, timeOfDay, time) {
    const winX = w * 0.5 - 120;
    const winY = 30;
    const winW = 240;
    const winH = h * 0.36;

    // Window Cutout Frame
    ctx.save();
    ctx.beginPath();
    RoomRenderer.safeRoundRect(ctx, winX, winY, winW, winH, [18, 18, 4, 4]);
    ctx.clip();

    // Outdoor Sky based on Time of Day
    const skyGrad = ctx.createLinearGradient(0, winY, 0, winY + winH);
    if (timeOfDay === 'morning') {
      skyGrad.addColorStop(0, '#A9CCE3');
      skyGrad.addColorStop(0.7, '#F9E79F');
      skyGrad.addColorStop(1, '#FAD2B8');
    } else if (timeOfDay === 'afternoon') {
      skyGrad.addColorStop(0, '#7FB3D5');
      skyGrad.addColorStop(0.6, '#A9CCE3');
      skyGrad.addColorStop(1, '#E8F1F8');
    } else if (timeOfDay === 'sunset') {
      skyGrad.addColorStop(0, '#785A7E');
      skyGrad.addColorStop(0.4, '#E8A598');
      skyGrad.addColorStop(0.8, '#FAD2B8');
      skyGrad.addColorStop(1, '#F9E79F');
    } else {
      // Cozy Night
      skyGrad.addColorStop(0, '#1A1828');
      skyGrad.addColorStop(0.7, '#2F2644');
      skyGrad.addColorStop(1, '#4A3758');
    }
    ctx.fillStyle = skyGrad;
    ctx.fillRect(winX, winY, winW, winH);

    // Glowing Moon at Night
    if (timeOfDay === 'night') {
      ctx.beginPath();
      ctx.arc(winX + winW * 0.75, winY + winH * 0.3, 20, 0, Math.PI * 2);
      ctx.fillStyle = '#FEF9E7';
      ctx.shadowColor = '#F9E79F';
      ctx.shadowBlur = 16;
      ctx.fill();
      ctx.shadowBlur = 0;
    } else {
      // Gentle warm sun
      ctx.beginPath();
      ctx.arc(winX + winW * 0.25, winY + winH * 0.35, 26, 0, Math.PI * 2);
      ctx.fillStyle = '#FFF5CC';
      ctx.shadowColor = '#F9E79F';
      ctx.shadowBlur = 20;
      ctx.fill();
      ctx.shadowBlur = 0;
    }

    // Gentle swaying outdoor tree silhouettes
    ctx.fillStyle = timeOfDay === 'night' ? '#171424' : '#7A9B79';
    const sway = Math.sin(time * 1.5) * 6;
    ctx.beginPath();
    ctx.arc(winX + 40 + sway, winY + winH, 45, Math.PI, 0);
    ctx.arc(winX + 110 - sway, winY + winH, 55, Math.PI, 0);
    ctx.arc(winX + 190 + sway, winY + winH, 50, Math.PI, 0);
    ctx.fill();

    ctx.restore();

    // Window Pane Paneling (Crossbars & Wood Frame)
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 6;
    ctx.strokeRect(winX, winY, winW, winH);

    // Window sill
    ctx.fillStyle = '#F5EFEB';
    ctx.fillRect(winX - 12, winY + winH - 2, winW + 24, 14);
    ctx.fillStyle = 'rgba(74, 55, 40, 0.15)';
    ctx.fillRect(winX - 12, winY + winH + 12, winW + 24, 4);

    // Cross bars
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(winX + winW / 2, winY);
    ctx.lineTo(winX + winW / 2, winY + winH);
    ctx.moveTo(winX, winY + winH * 0.5);
    ctx.lineTo(winX + winW, winY + winH * 0.5);
    ctx.stroke();

    // 2.5D Sunbeams Casting onto the floor
    if (timeOfDay !== 'night') {
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(winX + 20, winY + winH);
      ctx.lineTo(winX - 60, h * 0.9);
      ctx.lineTo(winX + winW + 90, h * 0.9);
      ctx.lineTo(winX + winW - 20, winY + winH);
      ctx.closePath();

      const beamGrad = ctx.createLinearGradient(0, winY + winH, 0, h * 0.9);
      const beamColor = timeOfDay === 'sunset' ? '249, 210, 184' : '254, 249, 231';
      beamGrad.addColorStop(0, `rgba(${beamColor}, 0.28)`);
      beamGrad.addColorStop(1, `rgba(${beamColor}, 0.0)`);
      ctx.fillStyle = beamGrad;
      ctx.fill();
      ctx.restore();
    }
  }

  /* ==========================================================================
     FURNITURE DRAWING
     ========================================================================== */
  drawFurnitureItem(ctx, item, time) {
    const fData = getFurnitureById(item.catalogId);
    if (!fData) return;

    const x = item.x;
    const y = item.y;
    const w = fData.w || 60;
    const h = fData.h || 50;

    ctx.save();
    ctx.translate(x, y);

    // 1. Soft Furniture Drop Shadow
    ctx.beginPath();
    ctx.ellipse(0, h * 0.45, w * 0.5, h * 0.2, 0, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(74, 55, 40, 0.16)';
    ctx.fill();

    // 2. Render Hand-Crafted 2.5D Furniture Graphic
    if (fData.category === 'beds') {
      // Plush Donut Bed / Pod
      ctx.beginPath();
      ctx.ellipse(0, 0, w * 0.5, h * 0.35, 0, 0, Math.PI * 2);
      ctx.fillStyle = fData.color;
      ctx.fill();

      // Soft Inner cushion dip
      ctx.beginPath();
      ctx.ellipse(0, 2, w * 0.35, h * 0.22, 0, 0, Math.PI * 2);
      ctx.fillStyle = '#FFFFFF';
      ctx.fill();
    } else if (fData.category === 'scratchers') {
      // Tree / Scratcher post
      ctx.fillStyle = '#C6A587';
      ctx.fillRect(-w * 0.15, -h * 0.8, w * 0.3, h * 0.85);

      // Perch platform
      ctx.beginPath();
      ctx.ellipse(0, -h * 0.8, w * 0.45, 12, 0, 0, Math.PI * 2);
      ctx.fillStyle = fData.color;
      ctx.fill();
    } else if (fData.category === 'plants') {
      // Ceramic pot
      ctx.fillStyle = '#E8A598';
      ctx.beginPath();
      ctx.moveTo(-w * 0.25, 0);
      ctx.lineTo(w * 0.25, 0);
      ctx.lineTo(w * 0.2, -h * 0.35);
      ctx.lineTo(-w * 0.2, -h * 0.35);
      ctx.closePath();
      ctx.fill();

      // Green broad monstera leaves swaying
      ctx.fillStyle = fData.color;
      const plantSway = Math.sin(time * 2 + item.x) * 3;
      ctx.beginPath();
      ctx.ellipse(-12 + plantSway, -h * 0.6, 16, 24, -0.4, 0, Math.PI * 2);
      ctx.ellipse(12 - plantSway, -h * 0.65, 18, 26, 0.3, 0, Math.PI * 2);
      ctx.ellipse(0, -h * 0.75, 16, 22, 0, 0, Math.PI * 2);
      ctx.fill();
    } else if (fData.category === 'rugs') {
      // Rugs are flat on the floor
      ctx.beginPath();
      ctx.ellipse(0, 0, w * 0.55, h * 0.35, 0, 0, Math.PI * 2);
      ctx.fillStyle = fData.color;
      ctx.fill();
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 2;
      ctx.stroke();
    } else if (fData.category === 'food') {
      // Food bowl set / fountain
      ctx.fillStyle = '#FDF8F0';
      ctx.beginPath();
      ctx.ellipse(-14, 0, 16, 10, 0, 0, Math.PI * 2);
      ctx.ellipse(14, 0, 16, 10, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Water & Food insides
      ctx.fillStyle = '#A9CCE3';
      ctx.beginPath();
      ctx.ellipse(-14, 1, 12, 7, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#C68A57';
      ctx.beginPath();
      ctx.ellipse(14, 1, 12, 7, 0, 0, Math.PI * 2);
      ctx.fill();
    } else {
      // Default cute furniture card representation
      ctx.fillStyle = fData.color || '#FAD2B8';
      ctx.beginPath();
      RoomRenderer.safeRoundRect(ctx, -w * 0.4, -h * 0.5, w * 0.8, h * 0.8, 12);
      ctx.fill();
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    // Icon overlay badge
    ctx.font = '22px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(fData.icon, 0, -h * 0.2);

    ctx.restore();
  }

  /* ==========================================================================
     FOOD BOWL, YARN & GIFTS
     ========================================================================== */
  drawFoodBowl(ctx, bowl) {
    ctx.save();
    ctx.translate(bowl.x, bowl.y);

    // Drop shadow
    ctx.beginPath();
    ctx.ellipse(0, 6, 20, 8, 0, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(74, 55, 40, 0.18)';
    ctx.fill();

    // Ceramic bowl
    ctx.beginPath();
    ctx.ellipse(0, 0, 20, 12, 0, 0, Math.PI * 2);
    ctx.fillStyle = '#FFFFFF';
    ctx.fill();
    ctx.strokeStyle = '#E8A598';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Food inside
    ctx.beginPath();
    ctx.ellipse(0, 1, 14, 8, 0, 0, Math.PI * 2);
    ctx.fillStyle = bowl.foodColor || '#C68A57';
    ctx.fill();

    ctx.restore();
  }

  drawGift(ctx, gift, time) {
    ctx.save();
    ctx.translate(gift.x, gift.y);

    const bob = Math.sin(time * 4) * 3;

    // Drop shadow
    ctx.beginPath();
    ctx.ellipse(0, 8, 12, 5, 0, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(74, 55, 40, 0.16)';
    ctx.fill();

    // Sparkle halo
    ctx.beginPath();
    ctx.arc(0, bob, 14, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(249, 231, 159, 0.4)';
    ctx.fill();

    // Gift icon
    ctx.font = '18px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(gift.icon || '🎁', 0, bob);

    ctx.restore();
  }

  drawYarnBall(ctx, yarn) {
    ctx.save();
    ctx.translate(yarn.x, yarn.y);

    // Drop shadow
    ctx.beginPath();
    ctx.ellipse(0, 10, 14, 6, 0, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(74, 55, 40, 0.2)';
    ctx.fill();

    // Yarn Sphere
    ctx.beginPath();
    ctx.arc(0, 0, 14, 0, Math.PI * 2);
    ctx.fillStyle = yarn.color || '#E8A598';
    ctx.fill();

    // Yarn string whorls
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(0, 0, 10, 0.5, Math.PI * 1.5);
    ctx.stroke();

    ctx.restore();
  }

  /* ==========================================================================
     AMBIENT LIGHTING & POST FILTER
     ========================================================================== */
  drawAmbientLightingFilter(ctx, w, h, timeOfDay) {
    ctx.save();
    if (timeOfDay === 'night') {
      ctx.fillStyle = 'rgba(26, 24, 40, 0.32)';
      ctx.fillRect(0, 0, w, h);
    } else if (timeOfDay === 'sunset') {
      ctx.fillStyle = 'rgba(232, 165, 152, 0.14)';
      ctx.fillRect(0, 0, w, h);
    } else if (timeOfDay === 'morning') {
      ctx.fillStyle = 'rgba(249, 231, 159, 0.08)';
      ctx.fillRect(0, 0, w, h);
    }
    ctx.restore();
  }

  /* ==========================================================================
     AMBIENT PARTICLES (SUN MOTES / FIREFLIES)
     ========================================================================== */
  initParticles(count) {
    this.particles = [];
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: Math.random() * 1200,
        y: Math.random() * 800,
        r: 1.5 + Math.random() * 2.5,
        vx: (Math.random() - 0.5) * 0.4,
        vy: -0.2 - Math.random() * 0.3,
        alpha: 0.2 + Math.random() * 0.6,
        phase: Math.random() * Math.PI * 2
      });
    }
  }

  renderParticles(w, h, timeOfDay, time) {
    if (!this.pCtx) return;
    const ctx = this.pCtx;
    ctx.clearRect(0, 0, w, h);

    const isNight = timeOfDay === 'night';
    ctx.fillStyle = isNight ? '#F9E79F' : '#FFF9E6';

    this.particles.forEach(p => {
      p.x += p.vx + Math.sin(time + p.phase) * 0.3;
      p.y += p.vy;

      if (p.y < 0) p.y = h;
      if (p.x < 0) p.x = w;
      if (p.x > w) p.x = 0;

      const pulsatingAlpha = p.alpha * (0.6 + Math.sin(time * 2 + p.phase) * 0.4);

      ctx.save();
      ctx.globalAlpha = pulsatingAlpha;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });
  }
}
