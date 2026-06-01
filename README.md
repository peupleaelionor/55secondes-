# 55 Seconds

**Le jeu du profil finançable.** Transforme 0,18 € en profil finançable en
**55 secondes** — un jeu d'entraînement business ultra-rapide, premium, social
et addictif.

> **Simulation fictive. Réflexes réels.**

En 55 secondes, tu prends des décisions, tu crées du flux **fictif**, tu
maîtrises le risque et tu découvres ton style entrepreneurial. Tu finis avec un
**score**, un **rang**, un **ADN business**, un **archétype**, des **badges**,
et une **carte partageable** pour défier tes amis.

> 55 secondes pour prouver ton réflexe, ta précision et ton sang-froid.

---

## ⚠️ Disclaimer / positionnement légal

**55 Seconds est un jeu de simulation. Les montants, scores, flux et profils
sont fictifs. L'application ne fournit aucun conseil financier, ne garantit
aucun financement et n'encourage aucune action frauduleuse.**

55 Seconds **n'est pas** : un produit financier, un simulateur bancaire réel, un
service de financement, un jeu d'argent / de hasard, une promesse de revenus, ni
une méthode pour tromper un organisme. L'axe « risque » modélise uniquement la
sur-exposition commerciale (sur-promesse, tension de trésorerie, réputation),
**jamais** un comportement illégal. Aucun achat aléatoire / loot box.

Voir aussi les pages `/legal` et `/privacy` dans l'application.

---

## 🧱 Stack

- **Next.js 15** (App Router) + **React 19**
- **TypeScript** strict
- **Tailwind CSS** v3
- **Framer Motion** (animations)
- **Zustand** (état de jeu & profil)
- **Zod** (disponible pour la validation future)
- **Lucide React** (icônes)
- Persistance locale via **localStorage** (wrapper crash-proof), architecture
  prête pour Supabase / backend.

## 🚀 Installation

```bash
npm install
npm run dev
```

Ouvre http://localhost:3000.

## 📜 Scripts

| Script          | Description                          |
| --------------- | ------------------------------------ |
| `npm run dev`   | Serveur de développement             |
| `npm run build` | Build de production                  |
| `npm run start` | Sert le build de production          |
| `npm run lint`  | ESLint (next/core-web-vitals)        |
| `npm run check:assets` | Vérifie que les chemins d'assets existent (fallback toléré) |

> `pnpm` est aussi supporté (`pnpm dev` / `pnpm build` / `pnpm lint`).

## 🗂 Structure

```
app/                 Routes (/, /play, /result, /leaderboard, /profile,
                     /daily, /skills, /legal, /privacy)
components/
  layout/            AppShell, BottomNav, TopBar, Onboarding, Disclaimer
  game/              TimerRing, ProgressRing, StatCard, RiskBar, ScenarioCard,
                     ChoiceButton, ScoreCircle, BadgeCard
  leaderboard/       Podium, LeaderboardList, Avatar
  result/            ArchetypeCard, DnaPanel, ResultShareCard, NextBestAction
  ui/                GlassCard, GlowButton, GameToast, Confetti
lib/
  game/              types, scenarios (40+), badges, engine, scoring, dna,
                     archetypes, levels, ranks, modes, daily, seed, packs,
                     mockLeaderboard
  storage, analytics, assets, share, format, haptics, plans, features
store/               gameStore, profileStore, toastStore
scripts/             check-assets.mjs
public/
  assets/            app-icon.png, badges/, avatars/, story/, og/, ui/
  sounds/            click, success, risk, win, lose, badge (optional)
```

### Architecture du jeu

- **Moteur pur** (`lib/game/engine.ts`) : `createInitialGameState`, `startGame`,
  `applyChoice`, `pickNextScenario`, `computeRiskLabel`, `computeScore`,
  `checkWinCondition`, `finishGame`, `tick`, `resetGame`. Toutes les valeurs
  sont bornées et protégées contre les `NaN`.
- **Chrono** piloté par un **unique** `setInterval` au niveau module du store —
  impossible de lancer deux timers, nettoyage garanti.
- **Decision DNA** (`lib/game/dna.ts`) : 8 dimensions (vitesse, contrôle du
  risque, négociation, régularité, lecture d'opportunité, cashflow, confiance,
  exécution) → **archétype** (`lib/game/archetypes.ts`).
- **Progression** (`lib/game/levels.ts`) : XP & niveaux non frustrants.
- **Rangs** (`lib/game/ranks.ts`) : 8 paliers (Bronze Pulse → Eclipse Master)
  mappés sur le score, affichés au résultat, au profil et dans le partage.
- **Modes** (`lib/game/modes.ts`) : Classic 55, Daily, Duel actifs ; Reflex
  Rush, Precision, Zen et arènes thématiques préparés (types + copy).
- **Défis du jour** (`lib/game/daily.ts`) : seed déterministe par date,
  progression stockée localement, « Daily Pulse ».
- **Challenge seed** (`lib/game/seed.ts`) : un ami peut rejouer le même ordre de
  scénarios via `/play?c=SEED`.

## 🗺 Roadmap

**V1 — Core (actuelle)** — Classic 55, score, meilleur score, **rangs**, badges,
ADN business, archétypes, partage (5 variantes + carte). Données locales.

**V2 — Rétention** — Daily Challenge enrichi, séries, historique de parties,
missions, carte de score exportable en image.

**V3 — Social** — liens de duel, leaderboard en ligne, profil joueur public,
challenges communautaires.

**V4 — B2B** — challenge sponsorisé, QR code, branding léger, analytics, export
des participants.

**V5 — Planet Modes** — Neon Mars, Saturn Loop, Jupiter Crown, Eclipse Arena et
événements saisonniers (architecture préparée dans `lib/game/modes.ts`).

## 💼 B2B

Un mini-challenge de 55 secondes pour **engager une communauté, animer un
événement ou collecter des participations**. Cas d'usage : animation de
communauté, jeu concours, activation de marque, salon/événement, challenge
interne, campagne TikTok/Instagram, collecte d'emails opt-in, leaderboard
sponsorisé, QR code vers un challenge personnalisé.

Offres envisagées (architecture seulement, pas de backend en V1) :

| Offre              | Contenu                                                       |
| ------------------ | ------------------------------------------------------------- |
| Starter Challenge  | Logo + leaderboard + lien partageable                         |
| Event Challenge    | QR code + classement live + export des résultats              |
| Brand Arena        | Thème visuel + badges sponsorisés + analytics                 |
| Community League   | Saison de 7 jours + récompenses + classement                  |

Un teaser « Équipes & communautés » est déjà présent, discrètement, sur l'accueil.

## 🎨 Assets

Un pack d'assets propres (sans filigrane, fonds transparents) est **inclus** dans
`public/assets/**`. **Tous les chemins passent par `lib/assets.ts`** via l'objet
`ASSETS` — ne jamais hardcoder un chemin `/assets/...` dans un composant.

```ts
import { ASSETS, getBadgeArt, asset } from "@/lib/assets";

ASSETS.appIcon                 // icône d'app
ASSETS.badges.shieldVerified   // illustration de badge
ASSETS.story.teaser            // fond ambiant 9:16 (accueil)
getBadgeArt("entrepreneur")    // badge id → illustration (ou undefined → fallback)
asset(path)                    // normalise + fallback vers ASSETS.appIcon
```

Chaque image est rendue via `<AssetImage>`, qui **bascule automatiquement sur un
placeholder CSS/SVG/Lucide** si le fichier est absent : un asset manquant ne casse
jamais le build ni l'UI.

### Fichiers inclus

| Fichier                                      | Usage                                   |
| -------------------------------------------- | --------------------------------------- |
| `public/assets/app-icon.png`                 | Favicon, icône Apple/PWA                |
| `public/assets/ui/badge-frame.png`           | Cadre de badge (UI)                     |
| `public/assets/badges/shield-verified.png`   | Badge « Entrepreneur validé »           |
| `public/assets/badges/shield-lock.png`       | Badge « Risque maîtrisé »               |
| `public/assets/badges/shield-energy.png`     | Badge « Cashflow propre »               |
| `public/assets/badges/crown-upgrade.png`     | Badge « Roi du flux »                   |
| `public/assets/badges/flame-core.png`        | Badge « Série chaude »                  |
| `public/assets/badges/rocket-boost.png`      | Badge « Momentum royal » + carte partage|
| `public/assets/avatars/mystery-gentleman.png`| Badge « Banquier impressionné »         |
| `public/assets/story/story-teaser.png`       | Fond ambiant 9:16 (accueil)             |
| `public/assets/og/og-main.png`               | Image OpenGraph (1200×630)              |

Assets optionnels non fournis (fallback automatique) : `ui/timer-ring.png`
(sinon anneau SVG animé). Pour en ajouter, dépose le PNG au chemin référencé dans
`ASSETS` — aucun code à modifier.

Prompts recommandés (compatibles avec n'importe quel générateur d'images) :

- **A. App icon** — `Premium mobile game app icon for "55 Seconds", dark navy black background, glowing electric purple number 55, circular timer ring, fintech gaming aesthetic, high contrast, minimal, luxury, no text except 55, iOS app icon, 1024x1024, clean vector-like 3D glow.`
- **B. Hero background** — `Dark premium mobile game background, deep black and midnight purple gradient, subtle glassmorphism panels, electric purple light streaks, soft neon particles, luxury fintech game aesthetic, no text, 9:16 vertical.`
- **C. Timer ring** — `Futuristic circular countdown timer ring, electric purple neon glow, segmented progress, dark transparent center, premium mobile game UI asset, isolated on transparent background, no text.`
- **D. Rocket share** — `Small premium 3D neon rocket icon, electric purple flame, dark luxury fintech game style, isolated on transparent background, high detail, glossy, no text.`
- **E. Badge — Entrepreneur validé** — `Premium achievement badge, shield shape, electric purple glow, checkmark symbol, luxury game reward, dark metallic material, subtle stars, isolated transparent background, no text.`
- **F. Badge — Banquier impressionné** — `Premium game badge icon, elegant banker mascot silhouette with top hat and monocle, purple neon frame, luxury fintech game aesthetic, dark metal, isolated transparent background, no text.`
- **G. Badge — Cashflow propre** — `Premium badge icon representing clean cashflow, upward flow lines, shield, electric purple and emerald accents, luxury mobile game reward, isolated transparent background, no text.`
- **H. Badge — Roi du flux** — `Legendary achievement badge, crown above glowing upward financial flow arrow, electric purple and gold, dark premium game aesthetic, isolated transparent background, no text.`
- **I. Avatar — NeoCash** — `Futuristic anonymous champion avatar, black helmet, purple neon reflection, luxury mobile game leaderboard profile picture, circular composition, dark background, no text.`
- **J. Avatar — MabeleFlow** — `Mysterious hooded avatar, dark silhouette, electric purple aura, premium leaderboard profile picture, circular composition, luxury game aesthetic, no text.`
- **K. Avatar — KevinB** — `Confident young entrepreneur avatar, side profile, dark navy background, subtle purple rim light, premium mobile game leaderboard style, circular composition, no text.`
- **L. OG image** — `OpenGraph promo image for mobile game "55 Seconds", dark luxury fintech gaming aesthetic, big glowing 55, circular timer, purple neon, headline area, premium app launch visual, 1200x630.`
- **M. Story teaser** — `Vertical Instagram story teaser for "55 Seconds", dark premium background, glowing purple 55 timer ring, rocket, leaderboard energy, space for text, luxury mobile game UI aesthetic, 9:16, no written text.`
- **N. Texture overlay** — `Subtle dark glassmorphism texture overlay, midnight purple, faint noise, soft neon particles, premium mobile app background, seamless, no text.`

### Sons (optionnels)

Déposez `click.mp3`, `success.mp3`, `risk.mp3`, `win.mp3`, `lose.mp3`,
`badge.mp3` dans `public/sounds/`. En leur absence, le jeu génère des sons légers
via la Web Audio API (jamais de crash). Activable/désactivable dans le profil.
