/**
 * MIMI & MOCHI — A LITTLE COZY CAT LIFE
 * Indie HUD, Modal Dialogs & Navigation Controller
 */

import { audio } from './audioEngine.js';
import { CatRenderer } from './catRenderer.js';
import { CollectionBook } from './collectionBook.js';
import { AdoptionSystem } from './adoption.js';
import { PhotoStudio } from './photoStudio.js';
import { ROOM_THEMES, FURNITURE_ITEMS, WALLPAPERS, FLOORS } from './furnitureCatalog.js';

export class UIManager {
  constructor(gameStore, roomCanvas) {
    this.store = gameStore;
    this.roomCanvas = roomCanvas;
    this.collectionBook = new CollectionBook(gameStore);
    this.adoptionSystem = new AdoptionSystem();
    this.photoStudio = new PhotoStudio(roomCanvas);

    this.activeModal = null;
    this.activeModalCat = null;

    this.bindDomElements();
    this.initEventListeners();
    this.updateHud();

    this.store.subscribe(() => this.updateHud());
  }

  bindDomElements() {
    // HUD Elements
    this.hudCoins = document.getElementById('hud-coins');
    this.hudAffection = document.getElementById('hud-affection');
    this.hudLevel = document.getElementById('hud-level');
    this.hudXpFill = document.getElementById('hud-xp-fill');
    this.hudRoomName = document.getElementById('hud-room-name');
    this.hudTimeOfDay = document.getElementById('hud-time-of-day');

    this.musicToggleBtn = document.getElementById('btn-toggle-music');
    this.sfxToggleBtn = document.getElementById('btn-toggle-sfx');

    // Toolbelt buttons
    this.toolButtons = document.querySelectorAll('.tool-btn');
    this.pointerEl = document.getElementById('custom-cursor');

    // Modals
    this.careModal = document.getElementById('modal-cat-care');
    this.adoptionModal = document.getElementById('modal-adoption');
    this.catdexModal = document.getElementById('modal-catdex');
    this.decorateModal = document.getElementById('modal-decorate');
    this.questsModal = document.getElementById('modal-quests');
    this.photoModal = document.getElementById('modal-photo');
    this.settingsModal = document.getElementById('modal-settings');

    // Toast Container
    this.toastContainer = document.getElementById('toast-container');
  }

  initEventListeners() {
    // 1. Toolbelt clicks
    this.toolButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const tool = btn.dataset.tool;
        this.store.setActiveTool(tool);
        audio.playWoodTap();

        this.toolButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        // Update cursor icon style
        if (this.pointerEl) {
          this.pointerEl.className = 'custom-cursor-pointer';
          if (tool === 'laser') {
            this.pointerEl.innerHTML = '<div class="laser-dot"></div>';
          } else if (tool === 'feather') {
            this.pointerEl.innerHTML = '<div class="feather-wand">🪶</div>';
          } else if (tool === 'brush') {
            this.pointerEl.innerHTML = '<div class="brush-cursor">🧹</div>';
          } else if (tool === 'bath') {
            this.pointerEl.innerHTML = '<div class="sponge-cursor">🧽</div>';
          } else {
            this.pointerEl.innerHTML = '';
          }
        }
      });
    });

    // 2. Bottom Navigation Buttons
    const navButtons = document.querySelectorAll('.nav-item');
    navButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const action = btn.dataset.nav;
        audio.playWoodTap();
        switch (action) {
          case 'home':
            this.closeAllModals();
            break;
          case 'my_cats':
            const cats = this.store.getState().cats;
            if (cats.length > 0) this.openCatCareModal(cats[0]);
            break;
          case 'adopt':
            this.openAdoptionModal();
            break;
          case 'catdex':
            this.openCatDexModal();
            break;
          case 'decorate':
            this.openDecorateModal();
            break;
          case 'quests':
            this.openQuestsModal();
            break;
          case 'photo':
            this.openPhotoStudioModal();
            break;
          case 'settings':
            this.openSettingsModal();
            break;
        }
      });
    });

    // 3. Modal Close Buttons
    document.querySelectorAll('.modal-close-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.closeAllModals();
        audio.playWoodTap();
      });
    });

    // 4. Modal Backdrop Clicks (outside dialog)
    document.querySelectorAll('.modal-backdrop').forEach(backdrop => {
      backdrop.addEventListener('click', e => {
        if (e.target === backdrop) {
          this.closeAllModals();
        }
      });
    });

    // 5. Audio Toggles
    if (this.musicToggleBtn) {
      this.musicToggleBtn.addEventListener('click', () => {
        const enabled = audio.toggleMusic();
        this.musicToggleBtn.textContent = enabled ? '🎵' : '🔇';
        this.showToast(enabled ? 'Lo-fi Music Enabled' : 'Lo-fi Music Muted', '🎵');
      });
    }

    if (this.sfxToggleBtn) {
      this.sfxToggleBtn.addEventListener('click', () => {
        const enabled = audio.toggleSfx();
        this.sfxToggleBtn.textContent = enabled ? '🔔' : '🔕';
        this.showToast(enabled ? 'Cat SFX Enabled' : 'Cat SFX Muted', '🔔');
      });
    }

    // 6. Time of Day Cycle click
    const timeOfDayBtn = document.getElementById('hud-time-pill');
    if (timeOfDayBtn) {
      timeOfDayBtn.addEventListener('click', () => {
        const tods = ['morning', 'afternoon', 'sunset', 'night'];
        const current = this.store.getState().timeOfDay;
        const next = tods[(tods.indexOf(current) + 1) % tods.length];
        this.store.setTimeOfDay(next);
        audio.playWoodTap();
        this.showToast(`Time shifted to ${next.toUpperCase()}`, '☀️');
      });
    }

    // 7. Room selector click
    const roomSelectorPill = document.getElementById('hud-room-pill');
    if (roomSelectorPill) {
      roomSelectorPill.addEventListener('click', () => {
        this.cycleRooms();
      });
    }
  }

  cycleRooms() {
    const state = this.store.getState();
    const unlocked = state.unlockedRoomIds;
    const currentIdx = unlocked.indexOf(state.activeRoomId);
    const nextRoomId = unlocked[(currentIdx + 1) % unlocked.length];
    this.store.setActiveRoom(nextRoomId);
    audio.playWoodTap();
    const rInfo = ROOM_THEMES.find(r => r.id === nextRoomId);
    this.showToast(`Entered ${rInfo ? rInfo.name : nextRoomId}`, '🏡');
  }

  /* ==========================================================================
     HUD UPDATES
     ========================================================================== */
  updateHud() {
    const s = this.store.getState();
    if (this.hudCoins) this.hudCoins.textContent = s.player.coins;
    if (this.hudAffection) this.hudAffection.textContent = s.player.affection;
    if (this.hudLevel) this.hudLevel.textContent = `Lv. ${s.player.level}`;

    if (this.hudXpFill) {
      const pct = Math.min(100, Math.floor((s.player.exp / s.player.nextLevelExp) * 100));
      this.hudXpFill.style.width = `${pct}%`;
    }

    if (this.hudRoomName) {
      const curRoom = ROOM_THEMES.find(r => r.id === s.activeRoomId);
      this.hudRoomName.textContent = curRoom ? curRoom.name : 'Sanctuary';
    }

    if (this.hudTimeOfDay) {
      const icons = { morning: '🌅 Morning', afternoon: '☀️ Afternoon', sunset: '🌆 Sunset', night: '🌙 Night' };
      this.hudTimeOfDay.textContent = icons[s.timeOfDay] || '☀️ Day';
    }
  }

  /* ==========================================================================
     CAT CARE SUITE MODAL
     ========================================================================== */
  openCatCareModal(cat) {
    this.closeAllModals();
    this.activeModal = this.careModal;
    this.activeModalCat = cat;
    this.careModal.classList.add('open');

    const container = document.getElementById('care-modal-content');
    if (!container) return;

    // Render Care Suite UI
    container.innerHTML = `
      <div class="cat-care-layout">
        <div class="cat-stage-box">
          <canvas id="care-avatar-canvas" width="220" height="220" class="cat-avatar-canvas"></canvas>
          <div class="cat-name-badge">
            <input type="text" id="care-cat-name-input" class="cat-name-input" value="${cat.name}" />
            <span style="font-size: 18px; cursor: pointer;" title="Rename Cat">✏️</span>
          </div>
          <div style="font-size: 12px; font-weight: 700; color: #735742; margin-top: 4px;">
            ${cat.breedData ? cat.breedData.name : 'Cozy Cat'}
          </div>
          <div style="font-size: 11px; color: #B35422; font-weight: 800; margin-top: 2px;">
            Friendship Lv. ${cat.friendshipLevel || 1} 💕
          </div>
        </div>

        <div class="cat-stats-panel">
          <div class="stat-row">
            <div class="stat-header"><span>Happiness</span><span id="stat-val-happiness">${Math.round(cat.happiness)}%</span></div>
            <div class="stat-bar-track"><div id="stat-bar-happiness" class="stat-bar-fill fill-happiness" style="width: ${cat.happiness}%"></div></div>
          </div>
          <div class="stat-row">
            <div class="stat-header"><span>Hunger</span><span id="stat-val-hunger">${Math.round(cat.hunger)}%</span></div>
            <div class="stat-bar-track"><div id="stat-bar-hunger" class="stat-bar-fill fill-hunger" style="width: ${cat.hunger}%"></div></div>
          </div>
          <div class="stat-row">
            <div class="stat-header"><span>Energy</span><span id="stat-val-energy">${Math.round(cat.energy)}%</span></div>
            <div class="stat-bar-track"><div id="stat-bar-energy" class="stat-bar-fill fill-energy" style="width: ${cat.energy}%"></div></div>
          </div>
          <div class="stat-row">
            <div class="stat-header"><span>Cleanliness</span><span id="stat-val-cleanliness">${Math.round(cat.cleanliness)}%</span></div>
            <div class="stat-bar-track"><div id="stat-bar-cleanliness" class="stat-bar-fill fill-cleanliness" style="width: ${cat.cleanliness}%"></div></div>
          </div>

          <div style="font-weight: 800; font-size: 14px; margin-top: 6px; color: #4A3728;">Care Actions:</div>
          <div class="care-actions-grid">
            <button class="care-btn" id="care-action-pet"><span class="care-btn-icon">💕</span><span>Pet</span></button>
            <button class="care-btn" id="care-action-feed"><span class="care-btn-icon">🥣</span><span>Feed</span></button>
            <button class="care-btn" id="care-action-play"><span class="care-btn-icon">🪶</span><span>Play</span></button>
            <button class="care-btn" id="care-action-brush"><span class="care-btn-icon">✨</span><span>Brush</span></button>
            <button class="care-btn" id="care-action-bath"><span class="care-btn-icon">🫧</span><span>Bathe</span></button>
            <button class="care-btn" id="care-action-sleep"><span class="care-btn-icon">💤</span><span>Sleep</span></button>
          </div>
        </div>
      </div>
    `;

    // Render Cat Avatar Canvas
    const canvas = document.getElementById('care-avatar-canvas');
    if (canvas) {
      CatRenderer.drawPortrait(canvas, cat.breedData || cat, 'idle');
    }

    // Name rename input
    const nameInput = document.getElementById('care-cat-name-input');
    if (nameInput) {
      nameInput.addEventListener('change', () => {
        this.store.renameCat(cat.id, nameInput.value);
        this.showToast(`Renamed to ${nameInput.value}!`, '🏷️');
      });
    }

    // Bind Care Actions
    document.getElementById('care-action-pet')?.addEventListener('click', () => {
      cat.applyPet(4);
      audio.playMeow(1.1, 'friendly');
      this.refreshCareStats(cat);
      this.showToast(`${cat.name} purrs happily!`, '💖');
    });

    document.getElementById('care-action-feed')?.addEventListener('click', () => {
      cat.hunger = 100;
      cat.happiness = Math.min(100, cat.happiness + 15);
      audio.playCrunch();
      this.refreshCareStats(cat);
      this.store.updateQuestProgress('daily_feed', 1);
      this.showToast(`Served ${cat.name}'s favorite meal!`, '🥣');
    });

    document.getElementById('care-action-play')?.addEventListener('click', () => {
      cat.setState('playing', 5);
      cat.happiness = Math.min(100, cat.happiness + 20);
      audio.playMeow(1.3, 'chirp');
      this.refreshCareStats(cat);
      this.store.updateQuestProgress('daily_play', 1);
      this.showToast(`${cat.name} pounces excitedly!`, '🪶');
    });

    document.getElementById('care-action-brush')?.addEventListener('click', () => {
      cat.applyBrush();
      this.refreshCareStats(cat);
      this.store.updateQuestProgress('daily_brush', 1);
      this.showToast(`${cat.name}'s coat is sparkling clean!`, '✨');
    });

    document.getElementById('care-action-bath')?.addEventListener('click', () => {
      cat.applyBath();
      this.refreshCareStats(cat);
      this.showToast(`Bubbles popped! ${cat.name} is fresh and clean.`, '🫧');
    });

    document.getElementById('care-action-sleep')?.addEventListener('click', () => {
      cat.setState('sleeping', 15);
      audio.playMeow(0.9, 'sleepy');
      this.refreshCareStats(cat);
      this.showToast(`${cat.name} curled into a cozy nap.`, '💤');
    });
  }

  refreshCareStats(cat) {
    document.getElementById('stat-val-happiness') && (document.getElementById('stat-val-happiness').textContent = `${Math.round(cat.happiness)}%`);
    document.getElementById('stat-val-hunger') && (document.getElementById('stat-val-hunger').textContent = `${Math.round(cat.hunger)}%`);
    document.getElementById('stat-val-energy') && (document.getElementById('stat-val-energy').textContent = `${Math.round(cat.energy)}%`);
    document.getElementById('stat-val-cleanliness') && (document.getElementById('stat-val-cleanliness').textContent = `${Math.round(cat.cleanliness)}%`);

    document.getElementById('stat-bar-happiness') && (document.getElementById('stat-bar-happiness').style.width = `${cat.happiness}%`);
    document.getElementById('stat-bar-hunger') && (document.getElementById('stat-bar-hunger').style.width = `${cat.hunger}%`);
    document.getElementById('stat-bar-energy') && (document.getElementById('stat-bar-energy').style.width = `${cat.energy}%`);
    document.getElementById('stat-bar-cleanliness') && (document.getElementById('stat-bar-cleanliness').style.width = `${cat.cleanliness}%`);

    this.store.notify();
  }

  /* ==========================================================================
     ADOPTION CENTER MODAL
     ========================================================================== */
  openAdoptionModal() {
    this.closeAllModals();
    this.activeModal = this.adoptionModal;
    this.adoptionModal.classList.add('open');

    const container = document.getElementById('adoption-modal-content');
    if (!container) return;

    container.innerHTML = `
      <div class="adoption-tabs">
        <button class="tab-btn active" id="tab-shelter">Shelter Listings</button>
        <button class="tab-btn" id="tab-mystery">Mystery Rescue Box</button>
      </div>

      <div id="adoption-tab-content"></div>
    `;

    const tabShelter = document.getElementById('tab-shelter');
    const tabMystery = document.getElementById('tab-mystery');
    const tabContent = document.getElementById('adoption-tab-content');

    const showShelter = () => {
      tabShelter.classList.add('active');
      tabMystery.classList.remove('active');
      this.renderShelterListings(tabContent);
    };

    const showMystery = () => {
      tabMystery.classList.add('active');
      tabShelter.classList.remove('active');
      this.renderMysteryBoxSection(tabContent);
    };

    tabShelter.addEventListener('click', showShelter);
    tabMystery.addEventListener('click', showMystery);

    showShelter();
  }

  renderShelterListings(container) {
    container.innerHTML = `<div class="shelter-cats-grid" id="shelter-grid"></div>`;
    const grid = document.getElementById('shelter-grid');
    const playerCoins = this.store.getState().player.coins;

    this.adoptionSystem.shelterCats.forEach(cat => {
      const card = document.createElement('div');
      card.className = 'shelter-cat-card';

      const canvas = document.createElement('canvas');
      canvas.width = 140;
      canvas.height = 140;
      canvas.className = 'shelter-cat-canvas';
      card.appendChild(canvas);

      const info = document.createElement('div');
      info.className = 'shelter-cat-info';
      info.innerHTML = `
        <div class="shelter-cat-name">${cat.name}</div>
        <div class="shelter-cat-breed">${cat.breedData.name}</div>
        <span class="rarity-tag rarity-${cat.breedData.rarity.key}">${cat.breedData.rarity.label}</span>
        <div style="font-size: 11px; line-height: 1.4; color: #735742; margin-top: 6px;">${cat.story}</div>
      `;
      card.appendChild(info);

      const adoptBtn = document.createElement('button');
      adoptBtn.className = 'adopt-action-btn';
      adoptBtn.innerHTML = `<span>Adopt for ${cat.cost} 🪙</span>`;
      adoptBtn.disabled = playerCoins < cat.cost;

      adoptBtn.addEventListener('click', () => {
        if (this.store.getState().player.coins >= cat.cost) {
          this.store.addCoins(-cat.cost);
          this.store.addCat({
            id: `adopted_${cat.breedId}_${Date.now()}`,
            name: cat.name,
            breedId: cat.breedId,
            happiness: cat.happiness,
            hunger: cat.hunger,
            energy: cat.energy,
            cleanliness: cat.cleanliness,
            x: 500,
            y: 450
          });
          audio.playChime();
          audio.playMeow(1.2, 'friendly');
          this.showToast(`Welcomed ${cat.name} the ${cat.breedData.name} home!`, '🎉');
          this.closeAllModals();
        }
      });

      card.appendChild(adoptBtn);
      grid.appendChild(card);

      // Render Portrait
      CatRenderer.drawPortrait(canvas, cat.breedData, 'idle');
    });
  }

  renderMysteryBoxSection(container) {
    const boxCost = 350;
    const playerCoins = this.store.getState().player.coins;

    container.innerHTML = `
      <div class="mystery-box-wrap">
        <div class="mystery-box-graphic" id="mystery-box-art">📦</div>
        <h3 style="font-size: 20px; font-weight: 800; color: #4A3728;">Cozy Rescue Parcel</h3>
        <p style="font-size: 13px; text-align: center; color: #735742; max-width: 440px;">
          Unbox a surprise cat rescued from the countryside! High chance of Rare, Epic, or Legendary Celestial breeds.
        </p>
        <button class="adopt-action-btn" id="btn-open-box" style="max-width: 240px;" ${playerCoins < boxCost ? 'disabled' : ''}>
          <span>Open Box (${boxCost} 🪙)</span>
        </button>
      </div>
    `;

    const boxArt = document.getElementById('mystery-box-art');
    const openBtn = document.getElementById('btn-open-box');

    openBtn?.addEventListener('click', () => {
      if (this.store.getState().player.coins >= boxCost) {
        this.store.addCoins(-boxCost);
        boxArt.classList.add('shake');
        openBtn.disabled = true;
        audio.playWoodTap();

        setTimeout(() => {
          boxArt.classList.remove('shake');
          boxArt.textContent = '🎉';
          const surpriseCat = this.adoptionSystem.openMysteryBox(boxCost);
          this.store.addCat(surpriseCat);

          audio.playChime();
          audio.playMeow(1.25, 'chirp');
          this.showToast(`Surprise! Adopted ${surpriseCat.name} (${surpriseCat.breedData.name})!`, '🌟');
          this.closeAllModals();
        }, 1200);
      }
    });
  }

  /* ==========================================================================
     CAT-DEX MODAL
     ========================================================================== */
  openCatDexModal() {
    this.closeAllModals();
    this.activeModal = this.catdexModal;
    this.catdexModal.classList.add('open');

    const container = document.getElementById('catdex-modal-content');
    if (!container) return;

    const totalDiscovered = this.store.getDiscoveredBreedIds().length;

    container.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
        <div style="font-weight: 800; font-size: 16px; color: #4A3728;">Breed Encyclopedia</div>
        <div style="font-weight: 800; font-size: 14px; color: #B35422; background: #FAD2B8; padding: 4px 14px; border-radius: 20px;">
          Discovered: ${totalDiscovered} / 21
        </div>
      </div>
      <div id="catdex-view-area"></div>
    `;

    const viewArea = document.getElementById('catdex-view-area');
    this.collectionBook.renderGrid(viewArea, (breed, isDiscovered) => {
      this.collectionBook.renderDetailView(viewArea, breed, isDiscovered);
    });
  }

  /* ==========================================================================
     DECORATE MODAL
     ========================================================================== */
  openDecorateModal() {
    this.closeAllModals();
    this.activeModal = this.decorateModal;
    this.decorateModal.classList.add('open');

    const container = document.getElementById('decorate-modal-content');
    if (!container) return;

    container.innerHTML = `
      <div class="decor-tabs" id="decor-cat-tabs">
        <button class="tab-btn active" data-cat="beds">Beds</button>
        <button class="tab-btn" data-cat="scratchers">Scratchers</button>
        <button class="tab-btn" data-cat="food">Food & Water</button>
        <button class="tab-btn" data-cat="rugs">Rugs</button>
        <button class="tab-btn" data-cat="plants">Plants</button>
        <button class="tab-btn" data-cat="decor">Decor</button>
      </div>
      <div class="decor-grid" id="decor-items-grid"></div>
    `;

    const tabButtons = container.querySelectorAll('.tab-btn');
    const grid = document.getElementById('decor-items-grid');

    const renderCategory = (category) => {
      grid.innerHTML = '';
      const items = FURNITURE_ITEMS.filter(f => f.category === category);
      const playerCoins = this.store.getState().player.coins;

      items.forEach(item => {
        const card = document.createElement('div');
        card.className = 'decor-card';
        card.innerHTML = `
          <div class="decor-thumb">${item.icon}</div>
          <div class="decor-title">${item.name}</div>
          <div class="decor-cost">${item.cost} 🪙</div>
        `;

        card.addEventListener('click', () => {
          if (this.store.getState().player.coins >= item.cost) {
            this.store.addCoins(-item.cost);
            // Place into active room center
            this.store.placeFurniture(item.id, 500 + (Math.random() - 0.5) * 200, 420 + (Math.random() - 0.5) * 80);
            audio.playWoodTap();
            this.showToast(`Placed ${item.name} in room!`, '🛋️');
            this.closeAllModals();
          } else {
            this.showToast('Not enough Cat Coins!', '🪙');
          }
        });

        grid.appendChild(card);
      });
    };

    tabButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        tabButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        renderCategory(btn.dataset.cat);
      });
    });

    renderCategory('beds');
  }

  /* ==========================================================================
     QUESTS MODAL
     ========================================================================== */
  openQuestsModal() {
    this.closeAllModals();
    this.activeModal = this.questsModal;
    this.questsModal.classList.add('open');

    const container = document.getElementById('quests-modal-content');
    if (!container) return;

    const quests = this.store.getState().dailyQuests;

    container.innerHTML = `
      <h3 style="font-size: 16px; font-weight: 800; color: #4A3728; margin-bottom: 12px;">Daily Coziness Quests</h3>
      <div style="display: flex; flex-direction: column; gap: 10px;" id="quests-list"></div>
    `;

    const list = document.getElementById('quests-list');
    quests.forEach(q => {
      const card = document.createElement('div');
      card.style.background = '#FFFFFF';
      card.style.border = '2px solid #F5EFEB';
      card.style.borderRadius = '14px';
      card.style.padding = '12px 16px';
      card.style.display = 'flex';
      card.style.alignItems = 'center';
      card.style.justifyContent = 'space-between';

      const isComplete = q.current >= q.target;

      card.innerHTML = `
        <div style="display: flex; align-items: center; gap: 12px;">
          <div style="font-size: 28px;">${q.icon}</div>
          <div>
            <div style="font-weight: 800; font-size: 14px; color: #4A3728;">${q.title}</div>
            <div style="font-size: 12px; color: #735742;">${q.desc}</div>
            <div style="font-size: 11px; font-weight: 700; color: #B35422; margin-top: 4px;">
              Progress: ${q.current} / ${q.target} • Reward: ${q.rewardCoins} 🪙 + ${q.rewardExp} EXP
            </div>
          </div>
        </div>
      `;

      const claimBtn = document.createElement('button');
      claimBtn.className = 'adopt-action-btn';
      claimBtn.style.maxWidth = '110px';
      claimBtn.textContent = q.claimed ? 'Claimed' : isComplete ? 'Claim!' : 'Incomplete';
      claimBtn.disabled = q.claimed || !isComplete;

      claimBtn.addEventListener('click', () => {
        if (this.store.claimQuestReward(q.id)) {
          audio.playChime();
          this.showToast(`Claimed +${q.rewardCoins} coins!`, '🪙');
          this.openQuestsModal();
        }
      });

      card.appendChild(claimBtn);
      list.appendChild(card);
    });
  }

  /* ==========================================================================
     PHOTO STUDIO MODAL
     ========================================================================== */
  openPhotoStudioModal() {
    this.closeAllModals();
    this.activeModal = this.photoModal;
    this.photoModal.classList.add('open');

    const container = document.getElementById('photo-modal-content');
    if (!container) return;

    container.innerHTML = `
      <div style="display: flex; flex-direction: column; align-items: center; gap: 16px;">
        <div class="polaroid-frame">
          <canvas id="polaroid-canvas" width="340" height="420" class="polaroid-canvas"></canvas>
        </div>

        <div style="display: flex; gap: 10px;">
          <button class="tab-btn active" id="btn-filter-cozy">Cozy Cream</button>
          <button class="tab-btn" id="btn-filter-retro">Warm Retro</button>
          <button class="tab-btn" id="btn-filter-twilight">Twilight Dream</button>
        </div>

        <div style="display: flex; gap: 8px;">
          <button class="tab-btn" id="btn-stamp-heart">💖 Heart</button>
          <button class="tab-btn" id="btn-stamp-paw">🐾 Paw</button>
          <button class="tab-btn" id="btn-stamp-sparkle">✨ Sparkle</button>
        </div>

        <button class="adopt-action-btn" id="btn-download-polaroid" style="max-width: 220px;">
          <span>📸 Download Snapshot</span>
        </button>
      </div>
    `;

    const canvas = document.getElementById('polaroid-canvas');
    this.photoStudio.captureSnapshot(canvas);

    document.getElementById('btn-filter-cozy')?.addEventListener('click', () => {
      this.photoStudio.currentFilter = 'cozy';
      this.photoStudio.captureSnapshot(canvas);
    });

    document.getElementById('btn-filter-retro')?.addEventListener('click', () => {
      this.photoStudio.currentFilter = 'warm_retro';
      this.photoStudio.captureSnapshot(canvas);
    });

    document.getElementById('btn-filter-twilight')?.addEventListener('click', () => {
      this.photoStudio.currentFilter = 'twilight';
      this.photoStudio.captureSnapshot(canvas);
    });

    document.getElementById('btn-stamp-heart')?.addEventListener('click', () => {
      this.photoStudio.addSticker('💖', 0.2 + Math.random() * 0.6, 0.2 + Math.random() * 0.6);
      this.photoStudio.captureSnapshot(canvas);
    });

    document.getElementById('btn-stamp-paw')?.addEventListener('click', () => {
      this.photoStudio.addSticker('🐾', 0.2 + Math.random() * 0.6, 0.2 + Math.random() * 0.6);
      this.photoStudio.captureSnapshot(canvas);
    });

    document.getElementById('btn-stamp-sparkle')?.addEventListener('click', () => {
      this.photoStudio.addSticker('✨', 0.2 + Math.random() * 0.6, 0.2 + Math.random() * 0.6);
      this.photoStudio.captureSnapshot(canvas);
    });

    document.getElementById('btn-download-polaroid')?.addEventListener('click', () => {
      this.photoStudio.downloadPhoto(canvas);
      this.store.updateQuestProgress('daily_photo', 1);
      this.showToast('Polaroid snapshot downloaded!', '📸');
    });
  }

  /* ==========================================================================
     SETTINGS MODAL
     ========================================================================== */
  openSettingsModal() {
    this.closeAllModals();
    this.activeModal = this.settingsModal;
    this.settingsModal.classList.add('open');

    const container = document.getElementById('settings-modal-content');
    if (!container) return;

    container.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 16px;">
        <div style="background: #FFFFFF; padding: 14px; border-radius: 12px; border: 1.5px solid #F5EFEB;">
          <h4 style="font-weight: 800; color: #4A3728; margin-bottom: 8px;">Audio Controls</h4>
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
            <span style="font-size: 13px; font-weight: 700;">Lo-Fi Music</span>
            <input type="range" id="vol-music" min="0" max="1" step="0.05" value="${audio.musicVolume}" />
          </div>
          <div style="display: flex; align-items: center; justify-content: space-between;">
            <span style="font-size: 13px; font-weight: 700;">Feline SFX</span>
            <input type="range" id="vol-sfx" min="0" max="1" step="0.05" value="${audio.sfxVolume}" />
          </div>
        </div>

        <div style="background: #FFFFFF; padding: 14px; border-radius: 12px; border: 1.5px solid #F5EFEB;">
          <h4 style="font-weight: 800; color: #4A3728; margin-bottom: 8px;">Data & Saves</h4>
          <div style="display: flex; gap: 10px;">
            <button class="tab-btn" id="btn-export-save">Export Save</button>
            <button class="tab-btn" id="btn-reset-save" style="color: #C0392B;">Reset Game</button>
          </div>
        </div>
      </div>
    `;

    document.getElementById('vol-music')?.addEventListener('input', e => {
      audio.setMusicVolume(parseFloat(e.target.value));
    });

    document.getElementById('vol-sfx')?.addEventListener('input', e => {
      audio.setSfxVolume(parseFloat(e.target.value));
    });

    document.getElementById('btn-export-save')?.addEventListener('click', () => {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(this.store.exportSave());
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", "mimi_mochi_save.json");
      downloadAnchor.click();
      this.showToast('Save data exported to JSON file!', '💾');
    });

    document.getElementById('btn-reset-save')?.addEventListener('click', () => {
      if (confirm('Are you sure you want to start a brand new cat sanctuary?')) {
        this.store.resetGame();
      }
    });
  }

  closeAllModals() {
    document.querySelectorAll('.modal-backdrop').forEach(m => m.classList.remove('open'));
    this.activeModal = null;
    this.activeModalCat = null;
  }

  showToast(message, icon = '🐾') {
    if (!this.toastContainer) return;
    const toast = document.createElement('div');
    toast.className = 'cozy-toast';
    toast.innerHTML = `<span style="font-size: 18px;">${icon}</span><span>${message}</span>`;
    this.toastContainer.appendChild(toast);

    setTimeout(() => {
      if (toast.parentNode) toast.parentNode.removeChild(toast);
    }, 3500);
  }
}
