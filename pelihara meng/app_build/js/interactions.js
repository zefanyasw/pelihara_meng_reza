/**
 * MIMI & MOCHI — A LITTLE COZY CAT LIFE
 * Interactive Care & Toy Mechanics Engine
 */

import { audio } from './audioEngine.js';

export class InteractionsManager {
  constructor(viewportContainer, gameStore) {
    this.container = viewportContainer;
    this.store = gameStore;

    // Active toy physics
    this.activeToy = {
      type: null, // 'feather', 'laser', 'yarn'
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
      active: false
    };

    // Petting stroke detection
    this.isMouseDown = false;
    this.lastMousePos = { x: 0, y: 0 };
    this.petStrokeDistance = 0;
    this.currentPetCat = null;

    this.cursorOverlay = document.getElementById('interaction-overlay');
    this.pointerEl = document.getElementById('custom-cursor');

    this.initEventListeners();
  }

  initEventListeners() {
    this.container.addEventListener('mousemove', e => this.handleMouseMove(e));
    this.container.addEventListener('mousedown', e => this.handleMouseDown(e));
    window.addEventListener('mouseup', e => this.handleMouseUp(e));
    this.container.addEventListener('click', e => this.handleClick(e));
  }

  handleMouseMove(e) {
    const rect = this.container.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const dx = x - this.lastMousePos.x;
    const dy = y - this.lastMousePos.y;
    const dist = Math.hypot(dx, dy);

    this.lastMousePos = { x, y };

    const state = this.store.getState();
    const tool = state.activeTool;

    // Position Custom Pointer overlay
    if (this.pointerEl) {
      this.pointerEl.style.left = `${x}px`;
      this.pointerEl.style.top = `${y}px`;
    }

    // Interactive Toy Updates
    if (tool === 'feather' || tool === 'laser') {
      this.activeToy.type = tool;
      this.activeToy.x = x;
      this.activeToy.y = y;
      this.activeToy.active = true;
    }

    // Direct Petting / Grooming while dragging mouse
    if (this.isMouseDown && this.currentPetCat) {
      this.petStrokeDistance += dist;
      if (this.petStrokeDistance > 35) {
        this.petStrokeDistance = 0;
        if (tool === 'hand') {
          const blissTriggered = this.currentPetCat.applyPet(1);
          if (blissTriggered) {
            this.spawnFloatingEmote(this.currentPetCat.x, this.currentPetCat.y - 45, '💖');
            this.store.updateQuestProgress('daily_pet', 1);
            this.store.updateAchievementProgress('ach_pet_50', 1);
          }
        } else if (tool === 'brush') {
          this.currentPetCat.applyBrush();
          this.spawnFloatingEmote(this.currentPetCat.x, this.currentPetCat.y - 45, '✨');
          this.store.updateQuestProgress('daily_brush', 1);
        } else if (tool === 'bath') {
          this.currentPetCat.applyBath();
          this.spawnFloatingEmote(this.currentPetCat.x, this.currentPetCat.y - 45, '🫧');
        }
      }
    }
  }

  handleMouseDown(e) {
    this.isMouseDown = true;
    const rect = this.container.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Check if clicked directly on a cat
    const cats = window.__activeCats || [];
    for (let i = cats.length - 1; i >= 0; i--) {
      const cat = cats[i];
      const dist = Math.hypot(cat.x - x, (cat.y - 10) - y);
      if (dist < 42) {
        this.currentPetCat = cat;
        audio.playWoodTap();
        break;
      }
    }
  }

  handleMouseUp(e) {
    this.isMouseDown = false;
    if (this.currentPetCat) {
      this.currentPetCat.endPet();
      this.currentPetCat = null;
    }
  }

  handleClick(e) {
    const rect = this.container.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const state = this.store.getState();
    const tool = state.activeTool;

    // 1. Check if clicked a dropped gift
    const gifts = state.droppedGifts || [];
    for (let i = 0; i < gifts.length; i++) {
      const g = gifts[i];
      if (Math.hypot(g.x - x, g.y - y) < 30) {
        const collected = this.store.collectGift(g.instanceId);
        if (collected) {
          audio.playChime();
          this.spawnFloatingEmote(x, y - 20, `+${collected.value} 🪙`);
          return;
        }
      }
    }

    // 2. Feeding Tool: Plop a tasty meal bowl down where clicked!
    if (tool === 'feed') {
      audio.playWoodTap();
      const newBowl = {
        id: `bowl_${Date.now()}`,
        x: Math.max(120, Math.min(1080, x)),
        y: Math.max(340, Math.min(660, y)),
        foodType: 'tuna',
        foodColor: '#E67E22'
      };
      state.foodBowls.push(newBowl);
      this.store.notify();
      this.store.updateQuestProgress('daily_feed', 1);

      // Alert nearby cats to the food!
      const cats = window.__activeCats || [];
      cats.forEach(c => {
        if (c.hunger < 85) {
          c.targetX = newBowl.x + (Math.random() - 0.5) * 20;
          c.targetY = newBowl.y + 10;
          c.activeInteractionTarget = newBowl;
          c.setState('walking', 7);
        }
      });
      return;
    }

    // 3. Yarn Ball Toy Tool: Toss yarn into the room
    if (tool === 'yarn') {
      audio.playWoodTap();
      this.activeToy = {
        type: 'yarn',
        x: x,
        y: y,
        color: '#E8A598',
        active: true
      };

      // Attract playful cats
      const cats = window.__activeCats || [];
      cats.forEach(c => {
        if (c.breedData && (c.breedData.personality === 'PLAYFUL' || c.breedData.personality === 'ENERGETIC')) {
          c.targetX = x + (Math.random() - 0.5) * 30;
          c.targetY = y + (Math.random() - 0.5) * 20;
          c.setState('playing', 6);
        }
      });
      this.store.updateQuestProgress('daily_play', 1);
      return;
    }

    // 4. Click Cat to Open Full Care Suite Modal (if hand tool)
    if (tool === 'hand') {
      const cats = window.__activeCats || [];
      for (let i = cats.length - 1; i >= 0; i--) {
        const cat = cats[i];
        if (Math.hypot(cat.x - x, (cat.y - 10) - y) < 42) {
          if (window.__uiManager) {
            window.__uiManager.openCatCareModal(cat);
          }
          return;
        }
      }
    }
  }

  spawnFloatingEmote(x, y, text) {
    const emote = document.createElement('div');
    emote.className = 'floating-emote';
    emote.textContent = text;
    emote.style.left = `${x}px`;
    emote.style.top = `${y}px`;
    this.container.appendChild(emote);

    setTimeout(() => {
      if (emote.parentNode) emote.parentNode.removeChild(emote);
    }, 2200);
  }
}
