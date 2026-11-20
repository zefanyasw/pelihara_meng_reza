/**
 * MIMI & MOCHI — A LITTLE COZY CAT LIFE
 * Quests, Achievements, and Cat Gift Drops System
 */

export const INITIAL_DAILY_QUESTS = [
  {
    id: 'daily_pet',
    title: 'Warm Scritches',
    desc: 'Pet your sweet cats 5 times.',
    icon: '💕',
    target: 5,
    rewardCoins: 120,
    rewardExp: 50
  },
  {
    id: 'daily_feed',
    title: 'Gourmet Feast',
    desc: 'Feed a hungry cat a tasty meal.',
    icon: '🥣',
    target: 1,
    rewardCoins: 100,
    rewardExp: 40
  },
  {
    id: 'daily_play',
    title: 'Playtime Sparkle',
    desc: 'Play with a cat using the feather wand or laser pointer.',
    icon: '🪶',
    target: 2,
    rewardCoins: 90,
    rewardExp: 35
  },
  {
    id: 'daily_brush',
    title: 'Fluff & Glow Spa',
    desc: 'Brush a cat until their coat sparkles.',
    icon: '✨',
    target: 1,
    rewardCoins: 110,
    rewardExp: 45
  },
  {
    id: 'daily_photo',
    title: 'Polaroid Keepsake',
    desc: 'Capture a cozy moment in the Polaroid Photo Studio.',
    icon: '📸',
    target: 1,
    rewardCoins: 150,
    rewardExp: 60
  }
];

export const LIFETIME_ACHIEVEMENTS = [
  {
    id: 'ach_first_cat',
    title: 'First Furry Friend',
    desc: 'Welcome your very first cat into the sanctuary.',
    icon: '🐱',
    target: 1,
    rewardCoins: 200,
    rewardExp: 100
  },
  {
    id: 'ach_collect_5',
    title: 'Cozy Cuddle Puddle',
    desc: 'Adopt 5 different cat breeds into your home.',
    icon: '🏡',
    target: 5,
    rewardCoins: 500,
    rewardExp: 250
  },
  {
    id: 'ach_collect_10',
    title: 'Master of Meows',
    desc: 'Adopt 10 different cat breeds into your home.',
    icon: '🏆',
    target: 10,
    rewardCoins: 1200,
    rewardExp: 600
  },
  {
    id: 'ach_pet_50',
    title: 'Feline Whisperer',
    desc: 'Pet cats a total of 50 times.',
    icon: '💖',
    target: 50,
    rewardCoins: 400,
    rewardExp: 200
  },
  {
    id: 'ach_decor_5',
    title: 'Interior Decorator',
    desc: 'Place 5 cozy furniture items across your rooms.',
    icon: '🛋️',
    target: 5,
    rewardCoins: 350,
    rewardExp: 180
  }
];

export const CAT_GIFTS_CATALOG = [
  { id: 'golden_bell', name: 'Golden Bell Charm', icon: '🔔', value: 65, desc: 'A shiny little bell found under the sofa cushion.' },
  { id: 'four_leaf_clover', name: 'Lucky Four-Leaf Clover', icon: '🍀', value: 80, desc: 'A tender green clover carried in from the patio.' },
  { id: 'sea_glass', name: 'Frosted Sea Glass', icon: '💎', value: 100, desc: 'A smooth, sea-tumbled turquoise treasure.' },
  { id: 'silver_button', name: 'Shiny Pearl Button', icon: '🔘', value: 50, desc: 'A curious shiny disc your cat bat under the rug.' },
  { id: 'pretty_feather', name: 'Blue Jay Feather', icon: '🪶', value: 70, desc: 'A soft blue feather brought with affectionate pride.' }
];

export function getRandomCatGift() {
  const gift = CAT_GIFTS_CATALOG[Math.floor(Math.random() * CAT_GIFTS_CATALOG.length)];
  return {
    ...gift,
    instanceId: `gift_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`
  };
}
