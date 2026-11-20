/**
 * MIMI & MOCHI — A LITTLE COZY CAT LIFE
 * Central Game State & LocalStorage Persistence
 */

import { INITIAL_DAILY_QUESTS, LIFETIME_ACHIEVEMENTS } from './quests.js';

const STORAGE_KEY = 'MIMI_MOCHI_SAVE_DATA_V1';

export class GameStore {
  constructor() {
    this.listeners = [];

    // Default Fresh State
    this.state = {
      player: {
        name: 'Cozy Caretaker',
        level: 1,
        exp: 20,
        nextLevelExp: 100,
        coins: 350,
        affection: 30
      },
      activeRoomId: 'living_room',
      unlockedRoomIds: ['living_room'],
      timeOfDay: 'afternoon', // 'morning', 'afternoon', 'sunset', 'night'
      activeTool: 'hand', // 'hand', 'feather', 'laser', 'yarn', 'feed', 'brush', 'bath'

      // Adopted Cats
      cats: [
        {
          id: 'starter_mochi',
          name: 'Mochi',
          breedId: 'british_shorthair',
          happiness: 90,
          hunger: 75,
          energy: 85,
          cleanliness: 90,
          friendship: 15,
          friendshipLevel: 1,
          collarColor: '#E8A598',
          x: 420,
          y: 420,
          state: 'idle'
        },
        {
          id: 'starter_mimi',
          name: 'Mimi',
          breedId: 'orange_tabby',
          happiness: 85,
          hunger: 80,
          energy: 90,
          cleanliness: 85,
          friendship: 12,
          friendshipLevel: 1,
          collarColor: '#9FB89E',
          x: 680,
          y: 460,
          state: 'idle'
        }
      ],

      discoveredBreedIds: ['british_shorthair', 'orange_tabby'],

      // Furniture placed per room
      roomFurniture: {
        living_room: [
          { instanceId: 'f_bed_1', catalogId: 'donut_bed_cream', x: 280, y: 390 },
          { instanceId: 'f_food_1', catalogId: 'ceramic_bowls', x: 860, y: 410 },
          { instanceId: 'f_plant_1', catalogId: 'potted_monstera', x: 190, y: 340 },
          { instanceId: 'f_tree_1', catalogId: 'cat_tree_standard', x: 960, y: 360 },
          { instanceId: 'f_rug_1', catalogId: 'boho_wool_rug', x: 540, y: 480 }
        ],
        sunlit_bedroom: [],
        garden_patio: [],
        cat_playground: [],
        glass_sunroom: [],
        rooftop_observatory: []
      },

      // Room styling overrides
      roomStyles: {
        living_room: { wallpaper: 'cream_panel', floor: 'warm_oak' },
        sunlit_bedroom: { wallpaper: 'peach_stripes', floor: 'tatami_mat' },
        garden_patio: { wallpaper: 'ivy_brick', floor: 'stone_paving' },
        cat_playground: { wallpaper: 'mint_play', floor: 'herringbone_wood' },
        glass_sunroom: { wallpaper: 'botanical_glass', floor: 'terracotta_tile' },
        rooftop_observatory: { wallpaper: 'twilight_stars', floor: 'deck_planks' }
      },

      // Stored / Owned furniture inventory
      inventory: [
        { catalogId: 'cloud_pillow', count: 1 },
        { catalogId: 'cactus_scratcher', count: 1 }
      ],

      // Quests & Achievements
      dailyQuests: JSON.parse(JSON.stringify(INITIAL_DAILY_QUESTS)).map(q => ({ ...q, current: 0, claimed: false })),
      achievements: JSON.parse(JSON.stringify(LIFETIME_ACHIEVEMENTS)).map(a => ({ ...a, current: 0, claimed: false })),

      // Saved Scrapbook Polaroids
      scrapbook: [],

      // Active food bowls and cat gifts in current room
      foodBowls: [
        { id: 'bowl_default', x: 860, y: 410, foodType: 'kibble', foodColor: '#C68A57' }
      ],
      droppedGifts: []
    };

    this.load();
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  notify() {
    this.listeners.forEach(fn => fn(this.state));
    this.save();
  }

  getState() {
    return this.state;
  }

  /* ==========================================================================
     ECONOMY & PLAYER PROGRESSION
     ========================================================================== */
  addCoins(amount) {
    this.state.player.coins = Math.max(0, this.state.player.coins + amount);
    this.notify();
  }

  addAffection(amount) {
    this.state.player.affection += amount;
    this.notify();
  }

  addExp(amount) {
    const p = this.state.player;
    p.exp += amount;
    while (p.exp >= p.nextLevelExp) {
      p.exp -= p.nextLevelExp;
      p.level += 1;
      p.nextLevelExp = Math.floor(p.nextLevelExp * 1.35);
      p.coins += 150 * p.level;
    }
    this.notify();
  }

  /* ==========================================================================
     CAT MANAGEMENT
     ========================================================================== */
  addCat(catData) {
    this.state.cats.push(catData);
    if (!this.state.discoveredBreedIds.includes(catData.breedId)) {
      this.state.discoveredBreedIds.push(catData.breedId);
    }
    this.updateAchievementProgress('ach_first_cat', 1);
    this.updateAchievementProgress('ach_collect_5', this.state.cats.length);
    this.updateAchievementProgress('ach_collect_10', this.state.cats.length);
    this.notify();
  }

  renameCat(catId, newName) {
    const cat = this.state.cats.find(c => c.id === catId);
    if (cat) {
      cat.name = newName.trim();
      this.notify();
    }
  }

  getDiscoveredBreedIds() {
    return this.state.discoveredBreedIds;
  }

  /* ==========================================================================
     ROOMS & DECORATION
     ========================================================================== */
  setActiveRoom(roomId) {
    if (this.state.unlockedRoomIds.includes(roomId)) {
      this.state.activeRoomId = roomId;
      this.notify();
    }
  }

  unlockRoom(roomId, cost) {
    if (this.state.player.coins >= cost && !this.state.unlockedRoomIds.includes(roomId)) {
      this.state.player.coins -= cost;
      this.state.unlockedRoomIds.push(roomId);
      this.state.activeRoomId = roomId;
      this.addExp(80);
      this.notify();
      return true;
    }
    return false;
  }

  placeFurniture(catalogId, x, y) {
    const roomId = this.state.activeRoomId;
    if (!this.state.roomFurniture[roomId]) {
      this.state.roomFurniture[roomId] = [];
    }
    const instanceId = `furn_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`;
    this.state.roomFurniture[roomId].push({ instanceId, catalogId, x, y });

    this.updateQuestProgress('daily_decor', 1);
    this.updateAchievementProgress('ach_decor_5', 1);
    this.notify();
    return instanceId;
  }

  removeFurniture(instanceId) {
    const roomId = this.state.activeRoomId;
    if (this.state.roomFurniture[roomId]) {
      this.state.roomFurniture[roomId] = this.state.roomFurniture[roomId].filter(f => f.instanceId !== instanceId);
      this.notify();
    }
  }

  setRoomStyle(wallpaperId, floorId) {
    const roomId = this.state.activeRoomId;
    if (!this.state.roomStyles[roomId]) {
      this.state.roomStyles[roomId] = {};
    }
    if (wallpaperId) this.state.roomStyles[roomId].wallpaper = wallpaperId;
    if (floorId) this.state.roomStyles[roomId].floor = floorId;
    this.notify();
  }

  /* ==========================================================================
     QUESTS & GIFTS
     ========================================================================== */
  updateQuestProgress(questId, amount = 1) {
    const quest = this.state.dailyQuests.find(q => q.id === questId);
    if (quest && !quest.claimed) {
      quest.current = Math.min(quest.target, quest.current + amount);
      this.notify();
    }
  }

  claimQuestReward(questId) {
    const quest = this.state.dailyQuests.find(q => q.id === questId);
    if (quest && quest.current >= quest.target && !quest.claimed) {
      quest.claimed = true;
      this.addCoins(quest.rewardCoins);
      this.addExp(quest.rewardExp);
      this.notify();
      return true;
    }
    return false;
  }

  updateAchievementProgress(achId, value) {
    const ach = this.state.achievements.find(a => a.id === achId);
    if (ach && !ach.claimed) {
      ach.current = Math.max(ach.current, value);
      this.notify();
    }
  }

  claimAchievement(achId) {
    const ach = this.state.achievements.find(a => a.id === achId);
    if (ach && ach.current >= ach.target && !ach.claimed) {
      ach.claimed = true;
      this.addCoins(ach.rewardCoins);
      this.addExp(ach.rewardExp);
      this.notify();
      return true;
    }
    return false;
  }

  addGift(gift) {
    this.state.droppedGifts.push(gift);
    this.notify();
  }

  collectGift(instanceId) {
    const gift = this.state.droppedGifts.find(g => g.instanceId === instanceId);
    if (gift) {
      this.state.droppedGifts = this.state.droppedGifts.filter(g => g.instanceId !== instanceId);
      this.addCoins(gift.value);
      this.addAffection(15);
      this.notify();
      return gift;
    }
    return null;
  }

  setTimeOfDay(tod) {
    this.state.timeOfDay = tod;
    this.notify();
  }

  setActiveTool(tool) {
    this.state.activeTool = tool;
    this.notify();
  }

  /* ==========================================================================
     STORAGE PERSISTENCE
     ========================================================================== */
  save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
    } catch (e) {
      console.warn('LocalStorage save failed:', e);
    }
  }

  load() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        this.state = { ...this.state, ...parsed };
      }
    } catch (e) {
      console.warn('LocalStorage load failed, continuing with fresh state:', e);
    }
  }

  exportSave() {
    return JSON.stringify(this.state, null, 2);
  }

  importSave(jsonStr) {
    try {
      const parsed = JSON.parse(jsonStr);
      this.state = parsed;
      this.save();
      window.location.reload();
      return true;
    } catch (e) {
      return false;
    }
  }

  resetGame() {
    localStorage.removeItem(STORAGE_KEY);
    window.location.reload();
  }
}

export const gameStore = new GameStore();
