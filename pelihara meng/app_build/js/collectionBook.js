/**
 * MIMI & MOCHI — A LITTLE COZY CAT LIFE
 * Cat-Dex Encyclopedia & Illustrated Collection Book
 */

import { BREEDS } from './breeds.js';
import { CatRenderer } from './catRenderer.js';

export class CollectionBook {
  constructor(gameStore) {
    this.store = gameStore;
    this.selectedBreedId = 'british_shorthair';
  }

  /**
   * Renders the Cat-Dex encyclopedia grid
   */
  renderGrid(containerEl, onSelectBreed) {
    if (!containerEl) return;
    containerEl.innerHTML = '';

    const discoveredIds = this.store.getDiscoveredBreedIds();

    BREEDS.forEach(breed => {
      const isDiscovered = discoveredIds.includes(breed.id);

      const card = document.createElement('div');
      card.className = `catdex-card ${isDiscovered ? '' : 'locked'}`;

      const canvas = document.createElement('canvas');
      canvas.width = 180;
      canvas.height = 180;
      canvas.className = 'catdex-thumb-canvas';

      card.appendChild(canvas);

      const nameEl = document.createElement('div');
      nameEl.className = 'catdex-name';
      nameEl.textContent = isDiscovered ? breed.name : '??? Unknown';
      card.appendChild(nameEl);

      const rarityBadge = document.createElement('span');
      rarityBadge.className = `rarity-tag rarity-${breed.rarity.key}`;
      rarityBadge.textContent = breed.rarity.label;
      card.appendChild(rarityBadge);

      // Render thumbnail portrait
      if (isDiscovered) {
        CatRenderer.drawPortrait(canvas, breed, 'idle');
      } else {
        // Draw mysterious dark silhouette
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#EBE5DF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Silhouette cat
        const mockSilhouette = {
          ...breed,
          coatColor: '#4A3728',
          secondaryColor: '#4A3728',
          accentColor: '#4A3728',
          eyeColor: '#735742'
        };
        CatRenderer.drawPortrait(canvas, mockSilhouette, 'idle');

        // Draw lock / question mark overlay
        ctx.fillStyle = 'rgba(74, 55, 40, 0.45)';
        ctx.font = 'bold 36px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('?', canvas.width / 2, canvas.height / 2);
      }

      card.addEventListener('click', () => {
        onSelectBreed(breed, isDiscovered);
      });

      containerEl.appendChild(card);
    });
  }

  /**
   * Renders the detailed single breed inspection view
   */
  renderDetailView(detailContainerEl, breed, isDiscovered) {
    if (!detailContainerEl) return;
    detailContainerEl.innerHTML = '';

    const layout = document.createElement('div');
    layout.className = 'catdex-detail-view';

    // Left Portrait Stage
    const leftBox = document.createElement('div');
    leftBox.className = 'cat-stage-box';

    const canvas = document.createElement('canvas');
    canvas.width = 240;
    canvas.height = 240;
    canvas.className = 'cat-avatar-canvas';
    leftBox.appendChild(canvas);

    const rarityBadge = document.createElement('span');
    rarityBadge.className = `rarity-tag rarity-${breed.rarity.key}`;
    rarityBadge.style.marginTop = '12px';
    rarityBadge.textContent = breed.rarity.label;
    leftBox.appendChild(rarityBadge);

    // Right Lore and Stats
    const rightBox = document.createElement('div');
    rightBox.style.display = 'flex';
    rightBox.style.flexDirection = 'column';
    rightBox.style.gap = '12px';

    if (isDiscovered) {
      CatRenderer.drawPortrait(canvas, breed, 'idle');

      rightBox.innerHTML = `
        <h3 style="font-size: 22px; font-weight: 800; color: #4A3728;">${breed.name}</h3>
        <p style="font-size: 13px; line-height: 1.6; color: #735742; background: #FFFFFF; padding: 12px; border-radius: 12px; border: 1.5px solid #F5EFEB;">
          ${breed.lore}
        </p>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 13px;">
          <div style="background: #FFFFFF; padding: 10px; border-radius: 10px; border: 1px solid #F5EFEB;">
            <div style="font-weight: 800; color: #4A3728;">Favorite Food</div>
            <div style="color: #B35422;">🐟 ${breed.favoriteFood}</div>
          </div>
          <div style="background: #FFFFFF; padding: 10px; border-radius: 10px; border: 1px solid #F5EFEB;">
            <div style="font-weight: 800; color: #4A3728;">Favorite Toy</div>
            <div style="color: #4A7A96;">🪶 ${breed.favoriteToy}</div>
          </div>
          <div style="background: #FFFFFF; padding: 10px; border-radius: 10px; border: 1px solid #F5EFEB;">
            <div style="font-weight: 800; color: #4A3728;">Personality</div>
            <div style="color: #7B5F8F;">✨ ${breed.personality}</div>
          </div>
          <div style="background: #FFFFFF; padding: 10px; border-radius: 10px; border: 1px solid #F5EFEB;">
            <div style="font-weight: 800; color: #4A3728;">Body Type</div>
            <div style="color: #5B825A;">🐾 ${breed.bodyType}</div>
          </div>
        </div>
      `;
    } else {
      // Undiscovered riddle / hint
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#E5DFD7';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.font = '60px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('🐾', canvas.width / 2, canvas.height / 2);

      rightBox.innerHTML = `
        <h3 style="font-size: 22px; font-weight: 800; color: #4A3728;">Undiscovered Breed</h3>
        <p style="font-size: 14px; line-height: 1.6; color: #735742; background: #FFFFFF; padding: 14px; border-radius: 12px; border: 1.5px solid #F5EFEB;">
          This charming feline has not yet visited your cozy sanctuary. Adopt new companions at the Adoption Center or unlock surprise rescue parcels to welcome them home!
        </p>
        <div style="font-size: 13px; font-weight: 700; color: #B35422;">
          Hint: A ${breed.rarity.label} companion with a ${breed.personality.toLowerCase()} spirit.
        </div>
      `;
    }

    layout.appendChild(leftBox);
    layout.appendChild(rightBox);
    detailContainerEl.appendChild(layout);
  }
}
