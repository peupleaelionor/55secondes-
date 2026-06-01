# 55 Seconds

**Le jeu du profil finançable.** Transforme 0,18 € en profil finançable en
**55 secondes** — un jeu d'entraînement business ultra-rapide, premium, social
et addictif.

> **Simulation fictive. Réflexes réels.**

En 55 secondes, tu prends des décisions, tu crées du flux **fictif**, tu
maîtrises le risque et tu découvres ton style entrepreneurial. Tu finis avec un
score, un **ADN business**, un **archétype**, des badges, et une carte
partageable pour défier tes amis.

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
                     archetypes, levels, daily, seed, packs, mockLeaderboard
  storage, analytics, assets, share, format, haptics, plans, features
store/               gameStore, profileStore, toastStore
public/
  assets/            avatars, badges, icons, og, textures (placeholders)
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
- **Défis du jour** (`lib/game/daily.ts`) : seed déterministe par date,
  progression stockée localement, « Daily Pulse ».
- **Challenge seed** (`lib/game/seed.ts`) : un ami peut rejouer le même ordre de
  scénarios via `/play?c=SEED`.

## 🗺 Roadmap

**V1 (actuelle)** — jeu local, score, ADN business, archétypes, badges, niveaux,
classement mock, partage viral (5 variantes), défis quotidiens, défi par seed,
pages legal/privacy, données locales effaçables.

**V2** — comptes utilisateurs, leaderboard réel (backend), génération d'image
partageable, nouveaux scénarios, mode amis, analytics produit (avec
consentement).

**V3** — mode équipe, scénarios sponsorisés, packs premium, tournoi
hebdomadaire, PWA offline.

**V4** — app mobile native, haptics avancés, skins premium, traduction EN,
moteur de scénarios IA contrôlé.

## 💼 B2B Potential

55 Seconds peut devenir : un outil d'icebreaker entrepreneurial, un mini serious
game pour incubateurs, un entraînement décisionnel pour étudiants, un challenge
pour communautés business, un outil viral pour créateurs.

Monétisation B2B future (architecture seulement, pas de backend en V1) : licence
école, dashboard formateur, challenges privés, classement de cohorte, packs
sectoriels, export de résultats.

## 🎨 Assets à générer

Les images ne sont **pas** commitées : déposez-les dans `public/assets/**` (voir
`lib/assets.ts` pour le mapping). Tant qu'une image est absente, l'UI utilise des
placeholders CSS/SVG — rien ne casse.

### Fichiers attendus (drop-in, l'UI les détecte automatiquement)

| Fichier                                    | Usage                                  |
| ------------------------------------------ | -------------------------------------- |
| `public/assets/app-icon.png`               | Favicon, icône Apple/PWA               |
| `public/assets/ui/timer-ring.png`          | Anneau du chrono sur l'accueil         |
| `public/assets/ui/rocket.png`              | Carte de partage (résultat)            |
| `public/assets/ui/texture.png`             | Texture d'overlay (optionnel)          |
| `public/assets/og/hero.png`                | Fond ambiant 9:16 de l'accueil         |
| `public/assets/og/og-default.png`          | Image OpenGraph (1200×630)             |
| `public/assets/story/story-teaser.png`     | Visuel story 9:16                      |
| `public/assets/badges/entrepreneur.png`    | Badge « Entrepreneur validé »          |
| `public/assets/badges/banquier.png`        | Badge « Banquier impressionné »        |
| `public/assets/badges/cashflow.png`        | Badge « Cashflow propre »              |
| `public/assets/badges/roi-du-flux.png`     | Badge « Roi du flux »                  |
| `public/assets/badges/risque-maitrise.png` | Badge « Risque maîtrisé »              |
| `public/assets/badges/momentum-royal.png`  | Badge « Momentum royal »               |
| `public/assets/avatars/{neocash,mabeleflow,kevinb}.png` | Avatars du classement     |

> Les PNG doivent être **sans filigrane** et, pour les badges/icônes/avatars, à
> **fond transparent**. Format carré pour icônes/badges/avatars, 9:16 pour le
> hero et les visuels story. Tout asset encore filigrané ne doit pas être commité
> : l'UI affichera automatiquement le placeholder propre à la place.

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
