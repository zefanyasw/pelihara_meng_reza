/**
 * MIMI & MOCHI — A LITTLE COZY CAT LIFE
 * Master Game Application Bootstrapper & Main Loop
 */

import { gameStore } from './state.js';
import { audio } from './audioEngine.js';
import { RoomRenderer } from './roomRenderer.js';
import { CatEntity } from './catAI.js';
import { InteractionsManager } from './interactions.js';
import { UIManager } from './ui.js';
import { ROOM_THEMES } from './furnitureCatalog.js';
import { getRandomCatGift } from './quests.js';

class GameApp {
  constructor() {
    this.roomCanvas = document.getElementById('room-canvas');
    this.particleCanvas = document.getElementById('particles-canvas');
    this.viewportContainer = document.getElementById('viewport-container');

    this.renderer = new RoomRenderer(this.roomCanvas, this.particleCanvas);
    this.interactions = new InteractionsManager(this.viewportContainer, gameStore);
    this.ui = new UIManager(gameStore, this.roomCanvas);
    window.__uiManager = this.ui;

    this.activeCats = [];
    window.__activeCats = this.activeCats;

    this.lastTime = performance.now();
    this.isRunning = false;

    this.init();
  }

  init() {
    // 1. Initial Canvas Sizing
    this.handleResize();
    window.addEventListener('resize', () => this.handleResize());

    // 2. Instantiate Adopted Cats into the Active Room
    this.syncActiveCats();

    // 3. Subscribe to store changes (e.g. room switch, new cat adopted)
    gameStore.subscribe(() => {
      this.syncActiveCats();
    });

    // 4. First user gesture unlocks Web Audio API
    const unlockAudio = () => {
      audio.init();
      window.removeEventListener('click', unlockAudio);
      window.removeEventListener('keydown', unlockAudio);
    };
    window.addEventListener('click', unlockAudio);
    window.addEventListener('keydown', unlockAudio);

    // 5. Start Game Loop (60 FPS)
    this.isRunning = true;
    requestAnimationFrame(t => this.gameLoop(t));

    // Welcome greeting toast
    setTimeout(() => {
      this.ui.showToast('Welcome to Mimi & Mochi Cat Sanctuary! 💕', '🏡');
    }, 800);
  }

  handleResize() {
    this.renderer.resize();
    const w = this.roomCanvas.width;
    const h = this.roomCanvas.height;

    // Update room bounds for cats
    const wallH = h * 0.46;
    const bounds = {
      minX: 80,
      maxX: w - 80,
      minY: wallH + 30,
      maxY: h - 90
    };

    this.activeCats.forEach(cat => {
      cat.roomBounds = bounds;
    });
  }

  syncActiveCats() {
    const state = gameStore.getState();
    const adoptedCatsData = state.cats;

    const w = this.roomCanvas.width || 1200;
    const h = this.roomCanvas.height || 800;
    const wallH = h * 0.46;
    const bounds = {
      minX: 80,
      maxX: w - 80,
      minY: wallH + 30,
      maxY: h - 90
    };

    // Keep existing entities or create new
    this.activeCats = adoptedCatsData.map(catData => {
      const existing = this.activeCats.find(c => c.id === catData.id);
      if (existing) {
        existing.name = catData.name;
        existing.happiness = catData.happiness;
        existing.hunger = catData.hunger;
        existing.energy = catData.energy;
        existing.cleanliness = catData.cleanliness;
        existing.roomBounds = bounds;
        return existing;
      }
      return new CatEntity(catData, bounds);
    });

    window.__activeCats = this.activeCats;
  }

  gameLoop(currentTime) {
    if (!this.isRunning) return;

    const dt = Math.min(0.1, (currentTime - this.lastTime) / 1000);
    this.lastTime = currentTime;
    const timeInSec = currentTime / 1000;

    const state = gameStore.getState();
    const currentRoomTheme = ROOM_THEMES.find(r => r.id === state.activeRoomId) || ROOM_THEMES[0];
    const placedFurniture = state.roomFurniture[state.activeRoomId] || [];
    const foodBowls = state.foodBowls || [];
    const gifts = state.droppedGifts || [];

    // 1. Update Autonomous Cat AI Entities
    this.activeCats.forEach(cat => {
      cat.update(
        dt,
        placedFurniture,
        foodBowls,
        this.interactions.activeToy,
        (catRef, emoji) => {
          this.interactions.spawnFloatingEmote(catRef.x, catRef.y - 45, emoji);
        },
        (catRef) => {
          // Drop sweet gift
          const newGift = getRandomCatGift();
          newGift.x = catRef.x + (Math.random() - 0.5) * 40;
          newGift.y = catRef.y + 10;
          gameStore.addGift(newGift);
          this.ui.showToast(`${catRef.name} left you a surprise gift!`, '🎁');
        }
      );
    });

    // 2. Render 2.5D Room, Depth-Sorted Cats, Furniture, Lighting & Particles
    this.renderer.render(
      currentRoomTheme,
      state.timeOfDay,
      placedFurniture,
      this.activeCats,
      this.interactions.activeToy,
      foodBowls,
      gifts,
      timeInSec
    );

    requestAnimationFrame(t => this.gameLoop(t));
  }
}

// Launch application when DOM is ready
window.addEventListener('DOMContentLoaded', () => {
  window.__gameApp = new GameApp();
});
