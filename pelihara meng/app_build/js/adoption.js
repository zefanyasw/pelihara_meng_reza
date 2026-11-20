/**
 * MIMI & MOCHI — A LITTLE COZY CAT LIFE
 * Adoption Center & Mystery Rescue Basket System
 */

import { BREEDS, RARITY } from './breeds.js';
import { audio } from './audioEngine.js';

const CUTE_NAMES = [
  'Mimi', 'Mochi', 'Biscuit', 'Pumpkin', 'Luna', 'Cleo', 'Oliver', 'Nala',
  'Jasper', 'Willow', 'Leo', 'Daisy', 'Simba', 'Milo', 'Bella', 'Pepper',
  'Matcha', 'Boba', 'Pudding', 'Cinnamon', 'Clover', 'Sunny', 'Oatmeal', 'Waffles'
];

const BACKSTORIES = [
  'Found napping soundly inside an empty fruit crate at the morning farmers market.',
  'A polite wanderer who politely tapped on the window glass on a rainy afternoon.',
  'Loved basking in the sun near the neighborhood bakery, hoping for a forever lap.',
  'A playful kitten found chasing fallen autumn maple leaves in the park.',
  'Lived at a cozy countryside library where they enjoyed snoozing on warm poetry books.',
  'A gentle soul who was rescued from a hollow oak tree on a frosty winter morning.'
];

export class AdoptionSystem {
  constructor() {
    this.shelterCats = [];
    this.refreshDailyShelterCats();
  }

  refreshDailyShelterCats() {
    this.shelterCats = [];
    // Pick 3 random distinct breeds
    const shuffled = [...BREEDS].sort(() => 0.5 - Math.random());
    const selectedBreeds = shuffled.slice(0, 3);

    selectedBreeds.forEach((breed, idx) => {
      const name = CUTE_NAMES[Math.floor(Math.random() * CUTE_NAMES.length)];
      const story = BACKSTORIES[Math.floor(Math.random() * BACKSTORIES.length)];

      this.shelterCats.push({
        id: `shelter_${breed.id}_${idx}`,
        name: name,
        breedId: breed.id,
        breedData: breed,
        cost: breed.cost,
        story: story,
        happiness: breed.baseHappiness,
        hunger: 70 + Math.floor(Math.random() * 20),
        energy: 80 + Math.floor(Math.random() * 15),
        cleanliness: 75 + Math.floor(Math.random() * 20)
      });
    });
  }

  /**
   * Generates a mystery rescue box surprise cat
   */
  openMysteryBox(cost = 350) {
    // Weighted roll: 50% Common/Uncommon, 30% Rare, 15% Epic, 5% Legendary
    const roll = Math.random();
    let targetRarity;

    if (roll < 0.35) {
      targetRarity = RARITY.COMMON.key;
    } else if (roll < 0.60) {
      targetRarity = RARITY.UNCOMMON.key;
    } else if (roll < 0.85) {
      targetRarity = RARITY.RARE.key;
    } else if (roll < 0.96) {
      targetRarity = RARITY.EPIC.key;
    } else {
      targetRarity = RARITY.LEGENDARY.key;
    }

    const matchingBreeds = BREEDS.filter(b => b.rarity.key === targetRarity);
    const breed = matchingBreeds[Math.floor(Math.random() * matchingBreeds.length)] || BREEDS[0];

    const name = CUTE_NAMES[Math.floor(Math.random() * CUTE_NAMES.length)];
    const story = 'Delivered gently to your door in a cozy cardboard box with warm blankets!';

    return {
      id: `adopted_${breed.id}_${Date.now()}`,
      name: name,
      breedId: breed.id,
      breedData: breed,
      happiness: 95,
      hunger: 80,
      energy: 90,
      cleanliness: 90,
      story: story
    };
  }
}
