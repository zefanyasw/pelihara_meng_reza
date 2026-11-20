# Technical Specification: MIMI & MOCHI — A LITTLE COZY CAT LIFE
**Document Version:** 1.0.0  
**Status:** Pending User Approval  
**Author:** Lead Architect & Product Manager (@pm)  
**Target Output Directory:** `app_build/`

---

## 1. Executive Summary

*"MIMI & MOCHI — A LITTLE COZY CAT LIFE"* is a cozy, tactile, indie 2.5D cat simulation, care, and collection web game. Players adopt, care for, name, cuddle, and nurture a thriving family of unique cats while custom-decorating multi-room sanctuaries (Cozy Bedroom, Living Room, Sunroom, Garden Patio, Cat Playground, Rooftop Garden).

The visual aesthetic follows a hand-crafted 2.5D illustrated indie art style inspired by beloved titles like *A Short Hike*, *Usagi Shima*, and *Calico*, featuring soft 3D depth, layered parallax, warm textures, and rounded silhouettes. The game is engineered with zero reliance on generic AI card dashboards or external image placeholders: every cat, animation cycle, piece of furniture, and ambient audio effect is procedurally and vector-rendered in-engine.

---

## 2. Requirements Matrix

### 2.1 Functional Requirements

1. **2.5D Cozy Environment Engine**:
   - Layered depth-sorted isometric/orthographic room renderer with warm wooden flooring, large sunlit windows with ambient dust/light motes, dynamic day/night ambient lighting (Morning, Afternoon, Golden Hour, Night).
   - 6 unlockable environments: *Cozy Living Room*, *Sunlit Bedroom*, *Garden Patio*, *Cat Playground*, *Glass Sunroom*, and *Rooftop Observatory*.
   - Interactive furniture & toys: scratching trees, cushions, automated laser towers, fish bowls, food & water dispensers, cat condos.

2. **Autonomous Cat AI & Behavioral FSM**:
   - Autonomous state machine: `Idle`, `Wandering`, `Seeking Food`, `Eating`, `Stretching`, `Playing`, `Napping`, `Grooming`, `Investigating`, `Curious Approach`, and `Being Petted`.
   - 9 distinct personality archetypes: *Playful, Sleepy, Affectionate, Shy, Curious, Mischievous, Lazy, Energetic, Independent*.
   - Dynamic need decay and gratification metrics:
     - **Happiness** (0–100%)
     - **Hunger** (0–100%)
     - **Energy** (0–100%)
     - **Cleanliness** (0–100%)
     - **Friendship / Bond Level** (Level 1 to 10 with unlockable perks and affectionate gifts).

3. **Cat Collection System (20+ Hand-Crafted Breeds & Visual Archetypes)**:
   - Full 20 distinct breeds with custom visual silhouettes, ear shapes, fur patterns, and animations:
     1. *British Shorthair* (Plump cheeks, dense blue-grey coat, calm)
     2. *Persian* (Fluffy longhair, sweet flat face, regal luxury)
     3. *Maine Coon* (Tufted ears, magnificent bushy tail, gentle giant)
     4. *Ragdoll* (Pointed blue eyes, silky cream coat, floppy cuddler)
     5. *Siamese* (Sleek cream body, seal point paws and mask, chatty)
     6. *Scottish Fold* (Folded ears, round owl-like eyes, sweet owl pose)
     7. *Bengal* (Wild rosette spots, sleek athletic build, energetic)
     8. *Russian Blue* (Shimmering silver-slate coat, emerald eyes, shy elegance)
     9. *Sphynx* (Wrinkly suede skin, giant bat ears, warm cuddler)
     10. *Norwegian Forest Cat* (Waterproof double coat, bushy ruff, majestic explorer)
     11. *Turkish Angora* (Silky pure white coat, heterochromia eyes, graceful)
     12. *American Shorthair* (Classic silver tabby whorls, sturdy and friendly)
     13. *Domestic Shorthair* (Spirited brown mackerel tabby, resilient sweetheart)
     14. *Munchkin* (Adorable stubby paws, low-rider waddle, curious explorer)
     15. *Abyssinian* (Agouti ticked coat, cougar-like grace, playful speedster)
     16. *Birman* (Mittened pure white paws, sapphire eyes, sacred grace)
     17. *Calico* (Tricolor patchwork of black, ginger, and cream, spirited luck-bringer)
     18. *Tuxedo Cat* (Dapper black jacket with white bib and mittens, cheeky gentleman)
     19. *Orange Tabby* (Sunny ginger stripes, warm pink nose, playful mischief)
     20. *Black Cat / Bombay* (Sleek midnight coat, luminous amber eyes, affectionate shadow)
   - 5 Rarity Tiers: `Common`, `Uncommon`, `Rare`, `Epic`, `Legendary` (with sparkle and halo aura effects).

4. **Deep Interactive Care System**:
   - **Petting**: Real-time cursor stroke detection with purr audio feedback, heart particle explosions, and bliss facial expressions.
   - **Feeding & Treats**: Serve dry kibble, premium tuna pate, salmon flakes, and catnip treats into customized bowls.
   - **Playtime Toys**: Interactive feather wand (follows cursor), laser pointer dot (cats chase and pounce), bouncy yarn ball, and wind-up robotic mouse.
   - **Grooming & Bathing**: Soft brushing mode (shedding fluff mini-interaction with sparkle finish) and warm sudsy sponge bath with gentle bubble pop mechanics.
   - **Cat Photography Studio (Polaroid Mode)**: Freeze frame, camera zoom, instant Polaroid borders, sticker stamps, and instant download or album save.
   - **Naming & Personality Lore**: Full renaming, custom collar tags, and inspection modals.

5. **Adoption Center & Rescue Sanctuary**:
   - Rescue Adoption Center with daily rotating cats awaiting loving homes.
   - Mystery Cozy Rescue Box (rewarding surprise breeds and unboxing animations).
   - Welcome Home introduction celebration when an adopted cat arrives.

6. **Home & Room Customization Engine**:
   - Grid-aligned and free-form 2.5D furniture placement system.
   - Swappable wallpapers, hardwood/tatami/tile floorings, rugs, scratching posts, potted monsteras, cozy beds, fairy lights, and cat climbing trees.
   - Real-time drag-and-drop or tap-to-place editing with rotation, storage, and catalog shop.

7. **Cat-Dex Collection Book & Scrapbook**:
   - Illustrated encyclopedia with discovered vs. silhouette undiscovered cats.
   - Breed history, favorite food, favorite toy, stats, and individual photo logs.
   - Breed milestone badges and rewards.

8. **Cozy Progression, Economy & Quests**:
   - Soft currency: **Cat Coins** (earned via care, petting, daily logins, achievements).
   - Affection points & Player Leveling with unlockable furniture, rooms, and rare cat encounters.
   - Daily & Weekly Coziness Tasks (e.g., *"Brush a Persian"*, *"Feed 3 cats their favorite fish"*, *"Take a photo of a sleeping kitten"*).
   - Special Gifts: Grateful cats occasionally bring trinkets (shiny bottle caps, four-leaf clovers, seashells, pretty feathers).

9. **Synthesized Lo-Fi Audio & Cat Soundscape**:
   - Complete Web Audio API synthesizer for offline, zero-dependency cozy audio:
     - Dynamic lo-fi pentatonic/Rhodes piano progression with gentle ambient vinyl crackle and rain/breeze ambience.
     - Natural cat vocalizer: procedural meows, high-pitch chirps, sleepy mews, low-frequency purr oscillator, eating crunches, sponge splashes, and camera shutter sound.

10. **Persistence & Save Management**:
    - Automatic `localStorage` backup with versioning, export/import JSON save files, and reset capability.

### 2.2 Non-Functional Requirements

- **Performance**: 60 FPS rendering on modern desktop and mobile browsers with efficient Canvas2D/Layered DOM rendering.
- **Visual Fidelity**: Clean vector/procedural 2.5D graphics adhering strictly to the warm cream/peach/sage palette without pixel-art aliasing or generic AI look.
- **Zero Broken Assets**: All graphic assets, cat sprites, furniture elements, and audio waveforms are packaged or dynamically generated in code.
- **Responsive Layout**: Seamless presentation on 16:9 widescreen, ultrawide, tablets, and mobile screens.

---

## 3. Architecture & Tech Stack

### 3.1 Technology Selection

| Layer | Chosen Technology | Rationale |
|---|---|---|
| **Language** | **TypeScript 5.x** | Enforces strict typing across cat states, inventory schemas, room layouts, and events. |
| **UI Framework** | **React 19 + Vite** | Blazing-fast build tool, reactive state orchestration, component isolation, and high ecosystem stability. |
| **Styling & Theme** | **Tailwind CSS v4** | Rapid utility styling configured with the custom cozy color palette (cream, peach, dusty pink, sage green, chocolate brown, lavender, butter yellow, powder blue). |
| **Game Rendering** | **Hybrid 2.5D Isometric Engine (Canvas2D + Layered CSS3D/SVG)** | Combines high-performance sprite rendering for cats and particle effects with crisp, scalable vector graphics for rooms and furniture. |
| **Audio Engine** | **Web Audio API Synth Engine** | 100% self-contained audio synthesis for cozy music and cat sound effects without external MP3 asset dependency risks. |
| **State & Storage** | **Zustand + LocalStorage Sync** | Lightweight, decoupled global game state with atomic selectors and robust persistence. |
| **Icons & Accents** | **Lucide React** | Clean, minimalist, modern iconography styled to match indie game HUD conventions. |

### 3.2 Directory & File Layout (`app_build/`)

```
app_build/
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── index.css
│   ├── types/
│   │   ├── cat.ts               # Cat breeds, personality, needs, state definitions
│   │   ├── room.ts              # Furniture, room themes, grid positions
│   │   ├── quest.ts             # Daily/weekly missions and achievements
│   │   └── audio.ts             # Audio engine configurations
│   ├── constants/
│   │   ├── breeds.ts            # Detailed definitions for all 20+ breeds
│   │   ├── furnitureCatalog.ts  # Catalog of beds, toys, plants, wallpapers
│   │   ├── questsCatalog.ts     # Initial quests and progression milestones
│   │   └── palette.ts           # Hex color tokens and thematic styling
│   ├── engine/
│   │   ├── CatRenderer.ts       # Canvas/SVG procedural cat sprite generator & animator
│   │   ├── RoomRenderer.ts      # 2.5D isometric room layout & depth sorting
│   │   ├── AudioEngine.ts       # Procedural lo-fi music & cat sound synthesizer
│   │   └── ParticleSystem.ts    # Hearts, bubbles, sparkles, sunbeams, dust motes
│   ├── state/
│   │   ├── useGameStore.ts      # Global game store (cats, inventory, coins, level, active room)
│   │   └── persistence.ts       # LocalStorage serialize/deserialize & save backups
│   ├── components/
│   │   ├── game/
│   │   │   ├── RoomViewport.tsx      # Main 2.5D interactive viewport
│   │   │   ├── CatActor.tsx          # Autonomous animated cat entity with interactive bounds
│   │   │   ├── FurnitureActor.tsx    # Interactive placed furniture
│   │   │   └── FloatingEmotes.tsx    # Speech bubbles, purrs, hunger icons
│   │   ├── hud/
│   │   │   ├── TopBar.tsx            # Coins, affection, time-of-day, room selector
│   │   │   ├── BottomNav.tsx         # Navigation bar (Home, Cats, Adopt, Book, Decorate, Quests)
│   │   │   └── MiniNotification.tsx  # Toast achievements and cat alerts
│   │   ├── modals/
│   │   │   ├── CatCareModal.tsx      # Pet, Brush, Bathe, Feed, Play, Rename modal
│   │   │   ├── AdoptionModal.tsx     # Rescue shelter browser & mystery box unboxing
│   │   │   ├── CatDexModal.tsx       # 20-breed encyclopedia with discovery badges
│   │   │   ├── DecorateModal.tsx     # Furniture placement catalog & room styler
│   │   │   ├── QuestsModal.tsx       # Daily/Weekly quests & rewards
│   │   │   ├── PhotoStudioModal.tsx  # Polaroid camera snapshot mode
│   │   │   └── SettingsModal.tsx     # Audio sliders, save/load, reset data
│   │   └── ui/
│   │       ├── CozyButton.tsx        # Styled rounded indie tactile button
│   │       ├── CozyBadge.tsx         # Rarity & status indicators
│   │       └── ProgressBar.tsx       # Smooth stat bars for hunger/energy/happiness
```

---

## 4. State Management & Data Flow

```
+-------------------------------------------------------------+
|                      Game Loop (60 FPS)                     |
|  - Decays hunger, energy, cleanliness over real-time ticks  |
|  - Updates autonomous Cat AI FSM positions and target goals |
|  - Triggers ambient particles (sun motes, purr hearts)      |
+-------------------------------------------------------------+
                              |
                              v
+-------------------------------------------------------------+
|               Zustand Global Store (useGameStore)           |
|                                                             |
|  [Cats]         - List of adopted cats with live stats      |
|  [Rooms]        - Active room, unlocked rooms, placements  |
|  [Inventory]    - Owned furniture, toys, gourmet foods      |
|  [Economy]      - Cat Coins, Affection Stars, Player Level  |
|  [Quests]       - Active daily/weekly quests and claims     |
|  [Collection]   - Discovered breed indices & achievements   |
|  [Settings]     - Music volume, SFX volume, time-of-day     |
+-------------------------------------------------------------+
        |                                       |
        v                                       v
+---------------------+               +-----------------------+
|  2.5D Room Viewport |               |  Modals & HUD System  |
|  - Depth Sorting    |               |  - Care & Grooming    |
|  - Cat Wandering    |               |  - Adoption Shelter   |
|  - Direct Click/Pet |               |  - Collection Book    |
|  - Toy Interaction  |               |  - Decorator Catalog  |
+---------------------+               +-----------------------+
        |                                       |
        +-------------------+-------------------+
                            |
                            v
               +--------------------------+
               | LocalStorage Persistence |
               | (Auto-save on state tick)|
               +--------------------------+
```

---

## 5. Detailed Gameplay Systems Specification

### 5.1 Cat AI Behavior State Machine

Every cat maintains an individual AI ticker influenced by its personality traits:
- **Affectionate**: High probability of seeking the player's cursor, nuzzling other cats, or curling up in player-adjacent beds.
- **Playful**: Frequently initiates running, chases floating toys/laser pointers, and pounces on scratching posts.
- **Sleepy / Lazy**: Spends up to 60% of idle cycles snoozing on warm rugs, sofas, or sunny window sills.
- **Curious / Mischievous**: Wanders between room props, taps decorative plants, and explores room corners.
- **Shy**: Retains a cautious movement radius until friendship level reaches Tier 3 ("Trusting").

### 5.2 The 20 Breeds & Rarity Roster

| # | Breed Name | Rarity | Visual Signature | Personality Defaults |
|---|---|---|---|---|
| 1 | **British Shorthair** | Common | Plush round face, smoky blue coat, copper eyes | Lazy, Calm |
| 2 | **Orange Tabby** | Common | Warm ginger marmalade stripes, pink paw pads | Mischievous, Playful |
| 3 | **Domestic Shorthair** | Common | Classic brown mackerel coat, white bib | Independent, Curious |
| 4 | **Black Cat (Bombay)**| Common | Midnight glossy black fur, golden glowing eyes | Affectionate, Playful |
| 5 | **Tuxedo Cat** | Common | Symmetrical black dinner jacket, white boots | Mischievous, Curious |
| 6 | **Calico** | Uncommon | Three-color patchwork, perky ears | Affectionate, Sassy |
| 7 | **American Shorthair** | Uncommon | Sterling silver swirls, wide expressive eyes | Curious, Friendly |
| 8 | **Siamese** | Uncommon | Toasted almond points, cream body, sapphire eyes | Vocal, Affectionate |
| 9 | **Russian Blue** | Uncommon | Silvery blue sheen, aristocratic slim neck, jade eyes | Shy, Gentle |
| 10 | **Scottish Fold** | Rare | Tightly folded ears, sweet round baby face | Sweet, Sleepy |
| 11 | **Ragdoll** | Rare | Silky long white coat, dark point ears, blue eyes | Affectionate, Relaxed |
| 12 | **Munchkin** | Rare | Adorable short low-rider legs, upright meerkat stance | Playful, Energetic |
| 13 | **Abyssinian** | Rare | Ruddy ticked agouti coat, amber eyes, slender athletic | Energetic, Curious |
| 14 | **Birman** | Rare | Sacred cream silky coat, golden halo, pure white mittens | Gentle, Loving |
| 15 | **Bengal** | Epic | Leopard rosettes, golden glitter sheen, muscular stride | Energetic, Bold |
| 16 | **Maine Coon** | Epic | Lynx-tufted ears, lion-like ruff, magnificent plumy tail | Gentle Giant, Friendly |
| 17 | **Norwegian Forest Cat** | Epic | Thick frost-resistant mane, almond emerald eyes | Adventurous, Brave |
| 18 | **Turkish Angora** | Epic | Shimmering snow-white coat, odd heterochromia eyes | Regal, Affectionate |
| 19 | **Sphynx** | Legendary | Soft peach-fuzz skin, elegant wrinkles, oversized ears | Deeply Cuddly, Warm |
| 20 | **Starfall Celestial Cat** | Legendary | Cosmic pastel fur with floating starlight particles | Mystical, Serene |

### 5.3 Interactive Care Suite

- **Petting**: Moving the mouse over the cat triggers a dynamic stroke counter. As the stroke progress fills, musical pitch increases, purring oscillator kicks in, and hearts burst.
- **Feeding**: Choose between 4 gourmet treats: *Crispy Kibble*, *Tuna Delight*, *Salmon Flakes*, and *Catnip Biscuits*.
- **Wand & Laser Play**: Switch to Toy Mode; an interactive toy tracks the cursor. Nearby cats enter `Playing` state, tracking and pouncing when the toy pauses.
- **Bath & Grooming Spa**: Enter the cozy grooming room; use a soft lather sponge to soap away grime, then dry with a fluffy towel for a +30 cleanliness and happiness boost.
- **Camera Studio**: Capture framed 4:3 instant photos with custom captions, timestamps, and cat stickers. Photos persist in the player's in-game Scrapbook.

---

## 6. Implementation Roadmap

1. **Step 1**: PM Spec Approval Gate (This Document).
2. **Step 2**: Engineer scaffolding & full-stack implementation in `app_build/`:
   - Initialize Vite + React + TypeScript + Tailwind project.
   - Build 2.5D Canvas & SVG cat sprite rendering engine with 20 distinct breeds and animated cycles (walk, idle, sit, sleep, play, eat, purr).
   - Build room environment engine with multi-room switching, day/night lighting, and furniture placement.
   - Build complete interactive care systems (feed, pet, groom, bathe, play with laser/feather).
   - Build Adoption Center, Cat-Dex Book, Scrapbook Photo Studio, Quests, and Shop.
   - Build offline Web Audio API synthesizer for cozy music and cat sound effects.
3. **Step 3**: QA Engineer Audit for dependency mismatches, rendering bugs, and edge-case testing.
4. **Step 4**: DevOps launch, local server hosting, and playable preview link generation.

---

## 7. Approval Gate Question

**Do you approve of this tech stack and specification? You can safely open `production_artifacts/Technical_Specification.md` and add comments or modifications if you want me to rework anything!**
