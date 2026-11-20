/**
 * MIMI & MOCHI — A LITTLE COZY CAT LIFE
 * Cat Breeds Catalog (20 Core Breeds + Bonus Legendary)
 */

export const RARITY = {
  COMMON: { key: 'common', label: 'Common', color: '#5B825A', bg: '#E2ECE1' },
  UNCOMMON: { key: 'uncommon', label: 'Uncommon', color: '#4A7A96', bg: '#E8F1F8' },
  RARE: { key: 'rare', label: 'Rare', color: '#7B5F8F', bg: '#ECE7F0' },
  EPIC: { key: 'epic', label: 'Epic', color: '#B35422', bg: '#FAD2B8' },
  LEGENDARY: { key: 'legendary', label: 'Legendary', color: '#875100', bg: '#F9E79F' }
};

export const PERSONALITIES = {
  PLAYFUL: { name: 'Playful', desc: 'Always ready to pounce and chase toys!', speed: 1.25, energyDecay: 1.2 },
  SLEEPY: { name: 'Sleepy', desc: 'Loves curling into warm cushions for power naps.', speed: 0.8, energyDecay: 0.7 },
  AFFECTIONATE: { name: 'Affectionate', desc: 'Purrs loudly and craves head scritches.', speed: 1.0, affectionRate: 1.4 },
  SHY: { name: 'Shy', desc: 'Takes gentle patience to step out of cozy corners.', speed: 0.85, caution: 1.3 },
  CURIOUS: { name: 'Curious', desc: 'Inspects every new plant, box, and windowsill.', speed: 1.1, wanderRadius: 1.3 },
  MISCHIEVOUS: { name: 'Mischievous', desc: 'Knocks over small toys with innocent eyes.', speed: 1.2, playful: 1.3 },
  LAZY: { name: 'Lazy', desc: 'The floor is comfortable. Moving is optional.', speed: 0.7, sleepRate: 1.5 },
  ENERGETIC: { name: 'Energetic', desc: 'Has the 3:00 AM zoomies in broad daylight!', speed: 1.35, energyDecay: 1.3 },
  INDEPENDENT: { name: 'Independent', desc: 'Regal, self-sufficient, but secretly loves you.', speed: 0.95, affectionRate: 0.9 }
};

export const BREEDS = [
  {
    id: 'british_shorthair',
    name: 'British Shorthair',
    rarity: RARITY.COMMON,
    coatColor: '#8E9DA8',
    secondaryColor: '#B6C4CE',
    accentColor: '#5C6C77',
    pattern: 'solid',
    earType: 'round',
    bodyType: 'chubby',
    eyeColor: '#E67E22', // Copper
    personality: 'LAZY',
    favoriteFood: 'Tuna Delight',
    favoriteToy: 'Woolen Yarn',
    lore: 'Famous for plush round cheeks, thick velvet coat, and delightfully chubby silhouette. A master of the gentle afternoon snooze.',
    baseHappiness: 80,
    cost: 150
  },
  {
    id: 'persian',
    name: 'Persian',
    rarity: RARITY.RARE,
    coatColor: '#F5ECE3',
    secondaryColor: '#FFFFFF',
    accentColor: '#D8C6B6',
    pattern: 'fluffy_long',
    earType: 'small_tuft',
    bodyType: 'fluffy_giant',
    eyeColor: '#458588', // Emerald
    personality: 'AFFECTIONATE',
    favoriteFood: 'Salmon Flakes',
    favoriteToy: 'Feather Wand',
    lore: 'A royal cloud of silky fur with a sweet, doll-like face. Enjoys serene perches and being brushed like royalty.',
    baseHappiness: 85,
    cost: 450
  },
  {
    id: 'maine_coon',
    name: 'Maine Coon',
    rarity: RARITY.EPIC,
    coatColor: '#7A5A43',
    secondaryColor: '#D9C2AA',
    accentColor: '#4A3323',
    pattern: 'tabby_ruff',
    earType: 'tufted',
    bodyType: 'fluffy_giant',
    eyeColor: '#D4AC0D', // Amber gold
    personality: 'AFFECTIONATE',
    favoriteFood: 'Crispy Kibble',
    favoriteToy: 'Mechanical Mouse',
    lore: 'The magnificent gentle giant! Adorned with lynx-tipped ears, a lion ruff, and an enormous bushy feather tail.',
    baseHappiness: 90,
    cost: 750
  },
  {
    id: 'ragdoll',
    name: 'Ragdoll',
    rarity: RARITY.RARE,
    coatColor: '#F9F5F0',
    secondaryColor: '#6B5749',
    accentColor: '#3A2E26',
    pattern: 'colorpoint',
    earType: 'standard',
    bodyType: 'fluffy_giant',
    eyeColor: '#2E86C1', // Sapphire Blue
    personality: 'AFFECTIONATE',
    favoriteFood: 'Sweet Cream Stew',
    favoriteToy: 'Woolen Yarn',
    lore: 'Named for their habit of going completely limp with bliss when picked up. Devoted, floppy, and wonderfully sweet.',
    baseHappiness: 88,
    cost: 500
  },
  {
    id: 'siamese',
    name: 'Siamese',
    rarity: RARITY.UNCOMMON,
    coatColor: '#ECE2D3',
    secondaryColor: '#48372C',
    accentColor: '#2C1F16',
    pattern: 'colorpoint',
    earType: 'large_bat',
    bodyType: 'sleek',
    eyeColor: '#3498DB', // Bright Blue
    personality: 'PLAYFUL',
    favoriteFood: 'Tuna Delight',
    favoriteToy: 'Feather Wand',
    lore: 'A vocal, elegant socialite with deep chocolate points and striking blue eyes. Loves having full conversations with you.',
    baseHappiness: 82,
    cost: 320
  },
  {
    id: 'scottish_fold',
    name: 'Scottish Fold',
    rarity: RARITY.RARE,
    coatColor: '#DEBC99',
    secondaryColor: '#FDF6EE',
    accentColor: '#A88056',
    pattern: 'tabby_soft',
    earType: 'folded',
    bodyType: 'chubby',
    eyeColor: '#F39C12', // Amber
    personality: 'SLEEPY',
    favoriteFood: 'Catnip Biscuits',
    favoriteToy: 'Laser Beam',
    lore: 'Adorably folded ears give this owl-faced angel a perpetually innocent, questioning expression. Loves sitting on its hind legs.',
    baseHappiness: 85,
    cost: 480
  },
  {
    id: 'bengal',
    name: 'Bengal',
    rarity: RARITY.EPIC,
    coatColor: '#E29748',
    secondaryColor: '#8C4614',
    accentColor: '#421E07',
    pattern: 'rosette_spotted',
    earType: 'round',
    bodyType: 'sleek',
    eyeColor: '#27AE60', // Jade Green
    personality: 'ENERGETIC',
    favoriteFood: 'Dried Sardines',
    favoriteToy: 'Laser Beam',
    lore: 'A miniature room panther with wild leopard rosettes and a golden glitter coat. Incredibly agile, spirited, and playful.',
    baseHappiness: 88,
    cost: 800
  },
  {
    id: 'russian_blue',
    name: 'Russian Blue',
    rarity: RARITY.UNCOMMON,
    coatColor: '#7B8997',
    secondaryColor: '#97A7B7',
    accentColor: '#586573',
    pattern: 'solid_sheen',
    earType: 'pointed',
    bodyType: 'sleek',
    eyeColor: '#2ECC71', // Vivid Emerald
    personality: 'SHY',
    favoriteFood: 'Salmon Flakes',
    favoriteToy: 'Woolen Yarn',
    lore: 'A silver-sheened aristocrat with glowing emerald eyes and an enigmatic, quiet smile. Intensely loyal once friendship is won.',
    baseHappiness: 82,
    cost: 340
  },
  {
    id: 'sphynx',
    name: 'Sphynx',
    rarity: RARITY.LEGENDARY,
    coatColor: '#ECC7B4',
    secondaryColor: '#DFAC96',
    accentColor: '#C48C74',
    pattern: 'wrinkled_skin',
    earType: 'oversized_bat',
    bodyType: 'hairless',
    eyeColor: '#5DADE2', // Aqua
    personality: 'AFFECTIONATE',
    favoriteFood: 'Warm Chicken Broth',
    favoriteToy: 'Feather Wand',
    lore: 'Soft like warm peach fuzz with whimsical wrinkles and giant bat ears. A living hot water bottle that craves infinite cuddles.',
    baseHappiness: 92,
    cost: 1200
  },
  {
    id: 'norwegian_forest',
    name: 'Norwegian Forest Cat',
    rarity: RARITY.EPIC,
    coatColor: '#6B5848',
    secondaryColor: '#FAF4ED',
    accentColor: '#44352A',
    pattern: 'bicolor_fluff',
    earType: 'tufted',
    bodyType: 'fluffy_giant',
    eyeColor: '#F1C40F', // Golden
    personality: 'CURIOUS',
    favoriteFood: 'Fresh Salmon',
    favoriteToy: 'Mechanical Mouse',
    lore: 'A legendary fairy cat of Scandinavian folklore, gifted with snowshoe paws and a waterproof mane built for high climbing.',
    baseHappiness: 87,
    cost: 780
  },
  {
    id: 'turkish_angora',
    name: 'Turkish Angora',
    rarity: RARITY.EPIC,
    coatColor: '#FFFFFF',
    secondaryColor: '#F5F5FA',
    accentColor: '#E0E0EB',
    pattern: 'silky_pure',
    earType: 'pointed',
    bodyType: 'sleek',
    eyeColor: 'odd_eyed', // One blue, one amber!
    personality: 'PLAYFUL',
    favoriteFood: 'Tuna Delight',
    favoriteToy: 'Feather Wand',
    lore: 'A ballerina of the cat realm, boasting shimmering white fur and mesmerizing heterochromia (one blue eye, one amber eye).',
    baseHappiness: 90,
    cost: 850
  },
  {
    id: 'american_shorthair',
    name: 'American Shorthair',
    rarity: RARITY.UNCOMMON,
    coatColor: '#A6B1B9',
    secondaryColor: '#39424B',
    accentColor: '#20262C',
    pattern: 'classic_swirl_tabby',
    earType: 'standard',
    bodyType: 'standard',
    eyeColor: '#27AE60', // Green
    personality: 'INDEPENDENT',
    favoriteFood: 'Crispy Kibble',
    favoriteToy: 'Woolen Yarn',
    lore: 'Sturdy, friendly, and celebrated for classic target swirl markings. A peaceful companion who gets along with everyone.',
    baseHappiness: 80,
    cost: 280
  },
  {
    id: 'domestic_shorthair',
    name: 'Domestic Shorthair',
    rarity: RARITY.COMMON,
    coatColor: '#9C7A5B',
    secondaryColor: '#4A3421',
    accentColor: '#FBF5EE',
    pattern: 'mackerel_tabby',
    earType: 'standard',
    bodyType: 'standard',
    eyeColor: '#D4AC0D', // Golden Hazel
    personality: 'CURIOUS',
    favoriteFood: 'Crispy Kibble',
    favoriteToy: 'Feather Wand',
    lore: 'The beloved neighborhood tabby! Clever, resilient, and full of lively personality, with a warm heart and curious nose.',
    baseHappiness: 80,
    cost: 100
  },
  {
    id: 'munchkin',
    name: 'Munchkin',
    rarity: RARITY.RARE,
    coatColor: '#EBC7A2',
    secondaryColor: '#FAF0E6',
    accentColor: '#C49466',
    pattern: 'bicolor_cream',
    earType: 'standard',
    bodyType: 'stubby_legs',
    eyeColor: '#3498DB', // Sky Blue
    personality: 'PLAYFUL',
    favoriteFood: 'Catnip Biscuits',
    favoriteToy: 'Laser Beam',
    lore: 'Low-slung, ultra-cute stubby paws! Waddles with immense pride and perches upright on its haunches like a watchful meerkat.',
    baseHappiness: 85,
    cost: 520
  },
  {
    id: 'abyssinian',
    name: 'Abyssinian',
    rarity: RARITY.RARE,
    coatColor: '#BA6838',
    secondaryColor: '#DE935F',
    accentColor: '#5C2D13',
    pattern: 'ticked_agouti',
    earType: 'large_bat',
    bodyType: 'sleek',
    eyeColor: '#E67E22', // Warm Hazel
    personality: 'ENERGETIC',
    favoriteFood: 'Dried Sardines',
    favoriteToy: 'Laser Beam',
    lore: 'Possesses a ticked coat that shimmers like sun-kissed desert sands. A high-energy explorer who loves climbing to the tallest shelf.',
    baseHappiness: 86,
    cost: 490
  },
  {
    id: 'birman',
    name: 'Birman',
    rarity: RARITY.RARE,
    coatColor: '#FBF4EB',
    secondaryColor: '#785A48',
    accentColor: '#FFFFFF', // Mittens
    pattern: 'sacred_mittened',
    earType: 'standard',
    bodyType: 'fluffy_giant',
    eyeColor: '#1F618D', // Deep Sapphire
    personality: 'AFFECTIONATE',
    favoriteFood: 'Sweet Cream Stew',
    favoriteToy: 'Woolen Yarn',
    lore: 'Known as the Sacred Cat of Burma, famous for deep sapphire eyes, golden halo fur, and pure snow-white mittens on every paw.',
    baseHappiness: 88,
    cost: 510
  },
  {
    id: 'calico',
    name: 'Calico',
    rarity: RARITY.COMMON,
    coatColor: '#FFFFFF',
    secondaryColor: '#E67E22',
    accentColor: '#2C3E50',
    pattern: 'calico_patchwork',
    earType: 'standard',
    bodyType: 'standard',
    eyeColor: '#27AE60', // Clover Green
    personality: 'MISCHIEVOUS',
    favoriteFood: 'Tuna Delight',
    favoriteToy: 'Feather Wand',
    lore: 'A vibrant patchwork of white, marmalade ginger, and black patches. Traditionally believed to bring abundant good luck and cozy joy.',
    baseHappiness: 85,
    cost: 160
  },
  {
    id: 'tuxedo_cat',
    name: 'Tuxedo Cat',
    rarity: RARITY.COMMON,
    coatColor: '#2B2B2B',
    secondaryColor: '#FFFFFF',
    accentColor: '#1A1A1A',
    pattern: 'tuxedo_jacket',
    earType: 'standard',
    bodyType: 'standard',
    eyeColor: '#F1C40F', // Golden Glow
    personality: 'MISCHIEVOUS',
    favoriteFood: 'Crispy Kibble',
    favoriteToy: 'Laser Beam',
    lore: 'Permanently dressed in a black dinner jacket with a crisp white shirt bib and white paws. Cheeky, charismatic, and always stylish.',
    baseHappiness: 82,
    cost: 140
  },
  {
    id: 'orange_tabby',
    name: 'Orange Tabby',
    rarity: RARITY.COMMON,
    coatColor: '#E67E22',
    secondaryColor: '#F5B041',
    accentColor: '#BA4A00',
    pattern: 'ginger_mackerel',
    earType: 'standard',
    bodyType: 'chubby',
    eyeColor: '#D4AC0D', // Warm Gold
    personality: 'PLAYFUL',
    favoriteFood: 'Sweet Tuna Pate',
    favoriteToy: 'Mechanical Mouse',
    lore: 'The sunny ginger dynamo! Renowned for goofy antics, warm pink noses, and sharing the legendary single ginger braincell.',
    baseHappiness: 85,
    cost: 120
  },
  {
    id: 'black_cat',
    name: 'Black Cat (Bombay)',
    rarity: RARITY.COMMON,
    coatColor: '#1F1F24',
    secondaryColor: '#2C2C34',
    accentColor: '#121216',
    pattern: 'solid_gloss',
    earType: 'standard',
    bodyType: 'sleek',
    eyeColor: '#F4D03F', // Glowing Topaz
    personality: 'AFFECTIONATE',
    favoriteFood: 'Salmon Flakes',
    favoriteToy: 'Woolen Yarn',
    lore: 'A glossy velvet shadow with enormous golden headlights. Gentle, deeply loving, and an absolute magnet for chin scratches.',
    baseHappiness: 84,
    cost: 130
  },
  {
    id: 'celestial_cat',
    name: 'Starfall Celestial Cat',
    rarity: RARITY.LEGENDARY,
    coatColor: '#3A2E5B',
    secondaryColor: '#8E73B9',
    accentColor: '#F9E79F',
    pattern: 'starlight_dust',
    earType: 'pointed_aurora',
    bodyType: 'sleek',
    eyeColor: '#E8A598', // Pastel Violet-Pink
    personality: 'AFFECTIONATE',
    favoriteFood: 'Moonbeam Milk',
    favoriteToy: 'Laser Beam',
    lore: 'A mystical guest descended from the starry night sky. Leaves a trail of faint cosmic glitter and purrs in soothing harmony.',
    baseHappiness: 100,
    cost: 2500
  }
];

export function getBreedById(id) {
  return BREEDS.find(b => b.id === id) || BREEDS[0];
}
