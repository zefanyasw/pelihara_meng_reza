/**
 * MIMI & MOCHI — A LITTLE COZY CAT LIFE
 * Furniture, Decor, Wallpapers, and Floor Catalog
 */

export const ROOM_THEMES = [
  {
    id: 'living_room',
    name: 'Cozy Living Room',
    desc: 'Warm oak floorboards, sunlit bay window, and soft hearthside vibes.',
    defaultWallpaper: 'cream_panel',
    defaultFloor: 'warm_oak',
    baseUnlockLevel: 1,
    cost: 0
  },
  {
    id: 'sunlit_bedroom',
    name: 'Sunlit Bedroom',
    desc: 'Soft plush carpeting, sunny window sill, and morning snooze cushions.',
    defaultWallpaper: 'peach_stripes',
    defaultFloor: 'tatami_mat',
    baseUnlockLevel: 2,
    cost: 400
  },
  {
    id: 'garden_patio',
    name: 'Garden Patio',
    desc: 'Stone paving, blooming butterfly hydrangeas, and fresh outdoor breezes.',
    defaultWallpaper: 'ivy_brick',
    defaultFloor: 'stone_paving',
    baseUnlockLevel: 3,
    cost: 750
  },
  {
    id: 'cat_playground',
    name: 'Cat Playground',
    desc: 'Multi-tiered climbing bridges, rope scratching poles, and toy boxes.',
    defaultWallpaper: 'mint_play',
    defaultFloor: 'herringbone_wood',
    baseUnlockLevel: 4,
    cost: 1100
  },
  {
    id: 'glass_sunroom',
    name: 'Glass Sunroom',
    desc: 'Surrounded by sunlit glass, potted monsteras, and warm basking spots.',
    defaultWallpaper: 'botanical_glass',
    defaultFloor: 'terracotta_tile',
    baseUnlockLevel: 5,
    cost: 1500
  },
  {
    id: 'rooftop_observatory',
    name: 'Rooftop Observatory',
    desc: 'Twinkling fairy lights, twilight sky, starry beanbags, and midnight views.',
    defaultWallpaper: 'twilight_stars',
    defaultFloor: 'deck_planks',
    baseUnlockLevel: 6,
    cost: 2200
  }
];

export const WALLPAPERS = [
  { id: 'cream_panel', name: 'Warm Cream Wainscot', color: '#FDF8F0', pattern: 'wainscot', cost: 0 },
  { id: 'peach_stripes', name: 'Muted Peach Stripes', color: '#FBE8DC', pattern: 'stripes', cost: 120 },
  { id: 'ivy_brick', name: 'Cozy Cottage Brick', color: '#EFE5DC', pattern: 'brick', cost: 200 },
  { id: 'mint_play', name: 'Soft Sage Botanical', color: '#E3ECE2', pattern: 'botanical', cost: 250 },
  { id: 'botanical_glass', name: 'Solarium Lattice', color: '#EBF4EC', pattern: 'lattice', cost: 300 },
  { id: 'twilight_stars', name: 'Starry Twilight', color: '#322847', pattern: 'stars', cost: 450 }
];

export const FLOORS = [
  { id: 'warm_oak', name: 'Warm Oak Boards', color: '#D4B499', pattern: 'planks', cost: 0 },
  { id: 'tatami_mat', name: 'Woven Tatami', color: '#D5D8B5', pattern: 'tatami', cost: 150 },
  { id: 'stone_paving', name: 'Garden Flagstones', color: '#BDB9B4', pattern: 'stone', cost: 220 },
  { id: 'herringbone_wood', name: 'Classic Herringbone', color: '#C6A587', pattern: 'herringbone', cost: 300 },
  { id: 'terracotta_tile', name: 'Terracotta Tiles', color: '#C88267', pattern: 'tiles', cost: 320 },
  { id: 'deck_planks', name: 'Night Cedar Deck', color: '#564234', pattern: 'planks', cost: 400 }
];

export const FURNITURE_ITEMS = [
  // Beds & Lounges
  {
    id: 'donut_bed_cream',
    name: 'Plush Donut Bed',
    category: 'beds',
    icon: '🛏️',
    w: 70,
    h: 55,
    comfort: 90,
    color: '#FAD2B8',
    cost: 150,
    desc: 'A super-soft ring bed that holds curled-up cats in deep cozy slumber.'
  },
  {
    id: 'wicker_pod_bed',
    name: 'Wicker Pod Basket',
    category: 'beds',
    icon: '🧺',
    w: 80,
    h: 65,
    comfort: 95,
    color: '#D4B499',
    cost: 280,
    desc: 'Hand-woven natural wicker with a fluffy sheepskin cushion inside.'
  },
  {
    id: 'cloud_pillow',
    name: 'Fluffy Cloud Pillow',
    category: 'beds',
    icon: '☁️',
    w: 65,
    h: 45,
    comfort: 85,
    color: '#FFFFFF',
    cost: 120,
    desc: 'Like sleeping on a gentle marshmallow dream.'
  },
  {
    id: 'cozy_sofa',
    name: 'Linen Loveseat Sofa',
    category: 'beds',
    icon: '🛋️',
    w: 120,
    h: 70,
    comfort: 100,
    color: '#E8A598',
    cost: 450,
    desc: 'Spacious enough for two snoozing cats to share together.'
  },

  // Scratchers & Trees
  {
    id: 'cat_tree_standard',
    name: 'Multi-Level Cat Tree',
    category: 'scratchers',
    icon: '🌳',
    w: 80,
    h: 130,
    fun: 90,
    color: '#9FB89E',
    cost: 350,
    desc: 'Features three carpeted lookout perches and sisal scratching poles.'
  },
  {
    id: 'cactus_scratcher',
    name: 'Desert Cactus Scratcher',
    category: 'scratchers',
    icon: '🌵',
    w: 50,
    h: 85,
    fun: 80,
    color: '#7A9B79',
    cost: 180,
    desc: 'An adorable prickly silhouette wrapped in sturdy green rope.'
  },
  {
    id: 'mushroom_scratcher',
    name: 'Toadstool Scratcher',
    category: 'scratchers',
    icon: '🍄',
    w: 60,
    h: 70,
    fun: 85,
    color: '#E8A598',
    cost: 210,
    desc: 'A cute red-and-white cap atop a solid sisal stalk.'
  },

  // Food & Water Stations
  {
    id: 'ceramic_bowls',
    name: 'Ceramic Meal Set',
    category: 'food',
    icon: '🥣',
    w: 60,
    h: 40,
    utility: 100,
    color: '#FDF8F0',
    cost: 80,
    desc: 'Dual pastel porcelain bowls for fresh spring water and tasty treats.'
  },
  {
    id: 'water_fountain',
    name: 'Swan Pet Fountain',
    category: 'food',
    icon: '⛲',
    w: 55,
    h: 60,
    utility: 110,
    color: '#A9CCE3',
    cost: 260,
    desc: 'Gently babbling clean filtered water that entices curious kitties to drink.'
  },

  // Rugs & Mats
  {
    id: 'boho_wool_rug',
    name: 'Boho Sunburst Rug',
    category: 'rugs',
    icon: '🧶',
    w: 110,
    h: 80,
    warmth: 85,
    color: '#F9E79F',
    cost: 160,
    desc: 'Warm under paw pads with delightful fringe tassels.'
  },
  {
    id: 'daisy_flower_rug',
    name: 'Daisy Bloom Mat',
    category: 'rugs',
    icon: '🌼',
    w: 90,
    h: 70,
    warmth: 80,
    color: '#FFFFFF',
    cost: 140,
    desc: 'A cheerful sunny petal mat where cats love to stretch out.'
  },

  // Plants & Decorations
  {
    id: 'potted_monstera',
    name: 'Potted Monstera Deliciosa',
    category: 'plants',
    icon: '🪴',
    w: 55,
    h: 90,
    cozy: 90,
    color: '#9FB89E',
    cost: 130,
    desc: 'Cat-friendly ceramic pot with lush wide leaves that sway gently.'
  },
  {
    id: 'hanging_ivy',
    name: 'Hanging Macrame Ivy',
    category: 'plants',
    icon: '🌿',
    w: 45,
    h: 80,
    cozy: 85,
    color: '#7A9B79',
    cost: 110,
    desc: 'Drapes gently from the ceiling, adding living tranquility.'
  },
  {
    id: 'fairy_lights',
    name: 'Warm Fairy Lights',
    category: 'decor',
    icon: '✨',
    w: 90,
    h: 30,
    cozy: 100,
    color: '#F9E79F',
    cost: 220,
    desc: 'Emits a soft amber fairy glow when evening arrives.'
  },
  {
    id: 'vintage_record_player',
    name: 'Retro Vinyl Turntable',
    category: 'decor',
    icon: '📻',
    w: 60,
    h: 55,
    cozy: 95,
    color: '#735742',
    cost: 320,
    desc: 'Plays gentle lo-fi melodies cats find deeply tranquil.'
  },
  {
    id: 'cardboard_castle',
    name: 'Royal Cardboard Castle',
    category: 'toys',
    icon: '🏰',
    w: 85,
    h: 75,
    fun: 100,
    color: '#D4B499',
    cost: 240,
    desc: 'Every cat secretly knows this cardboard box is better than any palace.'
  }
];

export function getFurnitureById(id) {
  return FURNITURE_ITEMS.find(f => f.id === id);
}
