/**
 * MIMI & MOCHI — A LITTLE COZY CAT LIFE
 * Autonomous Cat Entity & Behavior State Machine
 */

import { CatRenderer } from './catRenderer.js';
import { getBreedById, PERSONALITIES } from './breeds.js';
import { audio } from './audioEngine.js';

export class CatEntity {
  constructor(data, roomBounds) {
    this.id = data.id || `cat_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`;
    this.name = data.name || 'Mochi';
    this.breedId = data.breedId || 'british_shorthair';
    this.breedData = getBreedById(this.breedId);

    // Dynamic Needs & Friendship metrics (0-100)
    this.happiness = data.happiness !== undefined ? data.happiness : 85;
    this.hunger = data.hunger !== undefined ? data.hunger : 70;
    this.energy = data.energy !== undefined ? data.energy : 80;
    this.cleanliness = data.cleanliness !== undefined ? data.cleanliness : 85;
    this.friendship = data.friendship !== undefined ? data.friendship : 10;
    this.friendshipLevel = data.friendshipLevel || 1;

    // Custom collar styling
    this.collarColor = data.collarColor || '#E8A598';
    this.hasBell = data.hasBell !== undefined ? data.hasBell : true;

    // Transform & Movement
    this.x = data.x || 300 + Math.random() * 400;
    this.y = data.y || 350 + Math.random() * 200;
    this.targetX = this.x;
    this.targetY = this.y;
    this.speed = 1.2;
    this.facingLeft = Math.random() > 0.5;
    this.animOffset = Math.random() * 10;

    // AI Behavioral State: 'idle', 'walking', 'sleeping', 'eating', 'playing', 'stretching', 'being_petted', 'grooming'
    this.state = data.state || 'idle';
    this.stateTimer = 2 + Math.random() * 4;
    this.activeInteractionTarget = null;

    // Petting stroke counter
    this.petProgress = 0;

    // Room boundaries
    this.roomBounds = roomBounds || { minX: 100, maxX: 1100, minY: 320, maxY: 680 };
  }

  update(dt, placedFurniture, foodBowls, activeToy, onSpawnEmote, onDropGift) {
    this.stateTimer -= dt;

    // Needs decay over time
    this.hunger = Math.max(0, this.hunger - dt * 0.18);
    this.energy = Math.max(0, this.energy - (this.state === 'sleeping' ? -dt * 1.8 : dt * 0.15));
    this.cleanliness = Math.max(0, this.cleanliness - dt * 0.1);

    // Happiness is calculated from balance of basic needs + friendship
    this.happiness = Math.min(100, Math.max(10, (this.hunger * 0.35 + this.energy * 0.3 + this.cleanliness * 0.25 + this.friendship * 0.1)));

    // Occasional gift drop from happy, affectionate cats
    if (this.happiness > 80 && Math.random() < 0.0003 && onDropGift) {
      onDropGift(this);
    }

    // State machine updates
    switch (this.state) {
      case 'idle':
        this.updateIdle(dt, placedFurniture, foodBowls, activeToy, onSpawnEmote);
        break;
      case 'walking':
        this.updateWalking(dt);
        break;
      case 'sleeping':
        this.updateSleeping(dt, onSpawnEmote);
        break;
      case 'eating':
        this.updateEating(dt, onSpawnEmote);
        break;
      case 'playing':
        this.updatePlaying(dt, activeToy, onSpawnEmote);
        break;
      case 'stretching':
        if (this.stateTimer <= 0) this.setState('idle', 3 + Math.random() * 4);
        break;
      case 'grooming':
        if (this.stateTimer <= 0) {
          this.cleanliness = Math.min(100, this.cleanliness + 8);
          this.setState('idle', 2 + Math.random() * 3);
        }
        break;
      case 'being_petted':
        // Managed via mouse events
        if (this.stateTimer <= 0) this.setState('idle', 3);
        break;
    }

    // Keep cat clamped inside cozy room floor limits
    this.x = Math.max(this.roomBounds.minX, Math.min(this.roomBounds.maxX, this.x));
    this.y = Math.max(this.roomBounds.minY, Math.min(this.roomBounds.maxY, this.y));
  }

  /* ==========================================================================
     BEHAVIOR STATE LOGIC
     ========================================================================== */
  updateIdle(dt, placedFurniture, foodBowls, activeToy, onSpawnEmote) {
    // If active toy is active and close, investigate or play!
    if (activeToy && activeToy.active) {
      const distToToy = Math.hypot(activeToy.x - this.x, activeToy.y - this.y);
      if (distToToy < 350 && Math.random() < 0.08) {
        this.targetX = activeToy.x + (Math.random() - 0.5) * 40;
        this.targetY = activeToy.y + (Math.random() - 0.5) * 30;
        this.setState('playing', 4 + Math.random() * 5);
        if (onSpawnEmote) onSpawnEmote(this, '🐾');
        return;
      }
    }

    // If hungry and food bowl available, seek food!
    if (this.hunger < 45 && foodBowls && foodBowls.length > 0) {
      const bowl = foodBowls[Math.floor(Math.random() * foodBowls.length)];
      this.targetX = bowl.x + (Math.random() - 0.5) * 20;
      this.targetY = bowl.y + 10;
      this.activeInteractionTarget = bowl;
      this.setState('walking', 8);
      return;
    }

    // If tired, seek a comfortable bed or sofa
    if (this.energy < 30 && placedFurniture && placedFurniture.length > 0) {
      const beds = placedFurniture.filter(f => f.category === 'beds' || f.category === 'rugs');
      if (beds.length > 0) {
        const bed = beds[Math.floor(Math.random() * beds.length)];
        this.targetX = bed.x;
        this.targetY = bed.y + 5;
        this.activeInteractionTarget = bed;
        this.setState('walking', 10);
        return;
      }
    }

    // Switch to new state when timer expires
    if (this.stateTimer <= 0) {
      const roll = Math.random();
      if (roll < 0.45) {
        // Pick new wander destination
        this.targetX = this.roomBounds.minX + Math.random() * (this.roomBounds.maxX - this.roomBounds.minX);
        this.targetY = this.roomBounds.minY + Math.random() * (this.roomBounds.maxY - this.roomBounds.minY);
        this.setState('walking', 3 + Math.random() * 6);
      } else if (roll < 0.65) {
        // Sleep / Nap
        this.setState('sleeping', 8 + Math.random() * 12);
        if (onSpawnEmote) onSpawnEmote(this, '💤');
      } else if (roll < 0.8) {
        // Stretch
        this.setState('stretching', 2.5);
      } else {
        // Self-groom
        this.setState('grooming', 3.5);
      }
    }
  }

  updateWalking(dt) {
    const dx = this.targetX - this.x;
    const dy = this.targetY - this.y;
    const dist = Math.hypot(dx, dy);

    if (dist < 8 || this.stateTimer <= 0) {
      // Arrived at destination
      if (this.activeInteractionTarget) {
        if (this.activeInteractionTarget.foodColor) {
          // Food bowl!
          this.setState('eating', 4);
          audio.playCrunch();
          return;
        } else if (this.activeInteractionTarget.category === 'beds') {
          // Bed!
          this.setState('sleeping', 12);
          return;
        }
      }
      this.setState('idle', 2 + Math.random() * 3);
      return;
    }

    // Walk towards target
    const speed = 65 * dt;
    this.x += (dx / dist) * speed;
    this.y += (dy / dist) * speed;
    this.facingLeft = dx < 0;
  }

  updateSleeping(dt, onSpawnEmote) {
    // Energy restores while sleeping
    this.energy = Math.min(100, this.energy + dt * 3.5);

    if (Math.random() < 0.015 && onSpawnEmote) {
      onSpawnEmote(this, 'Zzz');
    }

    if (this.stateTimer <= 0 || this.energy >= 98) {
      this.setState('stretching', 2.5);
      audio.playMeow(1.1, 'sleepy');
    }
  }

  updateEating(dt, onSpawnEmote) {
    this.hunger = Math.min(100, this.hunger + dt * 15);
    this.happiness = Math.min(100, this.happiness + dt * 5);

    if (Math.random() < 0.03 && onSpawnEmote) {
      onSpawnEmote(this, '🐟');
    }

    if (this.stateTimer <= 0 || this.hunger >= 98) {
      this.setState('grooming', 3.0);
    }
  }

  updatePlaying(dt, activeToy, onSpawnEmote) {
    if (activeToy && activeToy.active) {
      const dx = activeToy.x - this.x;
      const dy = activeToy.y - this.y;
      const dist = Math.hypot(dx, dy);

      this.facingLeft = dx < 0;

      if (dist > 15) {
        // Chase toy
        const speed = 110 * dt;
        this.x += (dx / dist) * speed;
        this.y += (dy / dist) * speed;
      } else {
        // Pounce!
        if (Math.random() < 0.05 && onSpawnEmote) {
          onSpawnEmote(this, '✨');
          audio.playMeow(1.25, 'chirp');
        }
      }
    }

    this.energy = Math.max(0, this.energy - dt * 1.5);
    this.happiness = Math.min(100, this.happiness + dt * 4);

    if (this.stateTimer <= 0) {
      this.setState('idle', 3);
    }
  }

  setState(newState, duration = 3) {
    this.state = newState;
    this.stateTimer = duration;
    if (newState !== 'walking') {
      this.activeInteractionTarget = null;
    }
  }

  /* ==========================================================================
     INTERACTIVE FEEDBACK (PETTING, FEEDING, BRUSHING)
     ========================================================================== */
  applyPet(strokeAmount = 1) {
    this.petProgress += strokeAmount;
    this.setState('being_petted', 1.8);
    audio.startPurr();

    if (this.petProgress > 8) {
      this.petProgress = 0;
      this.friendship = Math.min(100, this.friendship + 1.5);
      this.happiness = Math.min(100, this.happiness + 4);
      audio.playMeow(1.0, 'friendly');
      return true; // Triggered bliss heart
    }
    return false;
  }

  endPet() {
    audio.stopPurr();
    if (this.state === 'being_petted') {
      this.setState('idle', 2);
    }
  }

  applyBrush() {
    this.cleanliness = Math.min(100, this.cleanliness + 22);
    this.happiness = Math.min(100, this.happiness + 12);
    this.friendship = Math.min(100, this.friendship + 3);
    audio.playChime();
    this.setState('being_petted', 2.0);
  }

  applyBath() {
    this.cleanliness = 100;
    this.happiness = Math.min(100, this.happiness + 18);
    this.friendship = Math.min(100, this.friendship + 5);
    audio.playBubblePop();
    this.setState('grooming', 3.0);
  }

  render(ctx, time) {
    CatRenderer.render(ctx, this, this.x, this.y, time, 1.0);
  }
}
