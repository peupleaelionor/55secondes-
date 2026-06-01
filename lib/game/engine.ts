import type { Choice, GameState, RiskLabel, Scenario, ChoiceEffects } from "./types";
import { SCENARIOS } from "./scenarios";

/** Tunable game constants — single source of truth for balancing. */
export const GAME = {
  START_TIME: 55,
  INITIAL: {
    balance: 0.18,
    incomingFlow: 0,
    transactions: 0,
    confidence: 50,
    risk: 10,
    momentum: 0,
    streak: 0,
    multiplier: 1,
  },
  OBJECTIVES: {
    balance: 5000,
    flow: 10000,
    transactions: 100,
    confidence: 70,
  },
  RISK_MAX_OK: 60, // win requires risk at or below this
  RISK_CRITICAL: 85, // "Profil instable" + score penalty above this
  RISK_BLOCK: 100, // profile blocked → game over
  MAX_MULTIPLIER: 4,
} as const;

const clamp = (n: number, min: number, max: number): number =>
  Math.min(max, Math.max(min, n));

/** Guarantee a finite number; protects every mutation from NaN/Infinity. */
const finite = (n: number, fallback = 0): number =>
  Number.isFinite(n) ? n : fallback;

export function createInitialGameState(): GameState {
  return {
    ...GAME.INITIAL,
    bestStreak: 0,
    timeLeft: GAME.START_TIME,
    selectedScenario: null,
    history: [],
    status: "idle",
    finalScore: 0,
    badgesUnlocked: [],
    objectivesReachedAt: null,
    lastDeltas: null,
  };
}

/** Pick a scenario that isn't the current one nor in the last few seen. */
export function pickNextScenario(state: GameState): Scenario {
  const recent = new Set(
    state.history.slice(-6).map((h) => h.scenarioId),
  );
  if (state.selectedScenario) recent.add(state.selectedScenario.id);

  const pool = SCENARIOS.filter((s) => !recent.has(s.id));
  const source = pool.length > 0 ? pool : SCENARIOS;
  const index = Math.floor(Math.random() * source.length);
  return source[index] ?? SCENARIOS[0];
}

export function startGame(): GameState {
  const base = createInitialGameState();
  return {
    ...base,
    status: "playing",
    selectedScenario: pickNextScenario(base),
  };
}

function computeMultiplier(streak: number): number {
  return clamp(1 + Math.floor(streak / 3), 1, GAME.MAX_MULTIPLIER);
}

/**
 * Apply a choice. Pure function: returns a brand new state.
 * Positive flow/balance gains are amplified by the active multiplier;
 * risk/confidence/transactions are applied flat. Everything is clamped and
 * guarded against NaN.
 */
export function applyChoice(state: GameState, choice: Choice): GameState {
  if (state.status !== "playing" || !state.selectedScenario) return state;

  const e = choice.effects;
  const mult = clamp(finite(state.multiplier, 1), 1, GAME.MAX_MULTIPLIER);

  const amplify = (delta: number) =>
    delta > 0 ? Math.round(delta * mult) : Math.round(delta);

  const balanceGain = amplify(e.balanceDelta);
  const flowGain = amplify(e.flowDelta);

  const isReset = choice.tone === "refuse" || e.momentumDelta < 0;
  let streak = isReset ? 0 : state.streak + 1;
  if (!isReset && e.multiplierDelta && e.multiplierDelta > 0) {
    streak += 2 * e.multiplierDelta; // power choices accelerate the combo
  }
  streak = clamp(finite(streak, 0), 0, 99);
  const bestStreak = Math.max(state.bestStreak, streak);

  const balance = finite(state.balance + balanceGain);
  const incomingFlow = Math.max(0, finite(state.incomingFlow + flowGain));
  const transactions = Math.max(
    0,
    finite(state.transactions + e.transactionsDelta),
  );
  const confidence = clamp(finite(state.confidence + e.confidenceDelta, 50), 0, 100);
  const risk = clamp(finite(state.risk + e.riskDelta, 0), 0, 100);
  const momentum = clamp(finite(state.momentum + e.momentumDelta, 0), 0, 100);
  const multiplier = computeMultiplier(streak);

  const appliedDeltas: ChoiceEffects = {
    balanceDelta: balanceGain,
    flowDelta: flowGain,
    transactionsDelta: e.transactionsDelta,
    confidenceDelta: e.confidenceDelta,
    riskDelta: e.riskDelta,
    momentumDelta: e.momentumDelta,
  };

  const risky =
    e.riskDelta >= 6 || choice.tone === "premium";

  const history = [
    ...state.history,
    {
      scenarioId: state.selectedScenario.id,
      choiceId: choice.id,
      risky,
    },
  ];

  const next: GameState = {
    ...state,
    balance,
    incomingFlow,
    transactions,
    confidence,
    risk,
    momentum,
    streak,
    bestStreak,
    multiplier,
    history,
    lastDeltas: appliedDeltas,
  };

  // Track first time the profile becomes "financeable" (game objective).
  if (next.objectivesReachedAt === null && checkWinCondition(next)) {
    next.objectivesReachedAt = next.timeLeft;
  }

  // Hard block: over-exposed profile (game over, not a real-world action).
  if (risk >= GAME.RISK_BLOCK) {
    return finishGame({ ...next, selectedScenario: next.selectedScenario });
  }

  next.selectedScenario = pickNextScenario(next);
  return next;
}

export function computeRiskLabel(risk: number): RiskLabel {
  const r = finite(risk, 0);
  if (r <= 30) return "faible";
  if (r <= 60) return "modéré";
  if (r < GAME.RISK_CRITICAL) return "élevé";
  return "critique";
}

/** All four headline objectives reached AND risk within safe bounds. */
export function checkWinCondition(state: GameState): boolean {
  return (
    state.balance >= GAME.OBJECTIVES.balance &&
    state.incomingFlow >= GAME.OBJECTIVES.flow &&
    state.transactions >= GAME.OBJECTIVES.transactions &&
    state.confidence >= GAME.OBJECTIVES.confidence &&
    state.risk <= GAME.RISK_MAX_OK
  );
}

/** 0..1 progress for each headline objective (for the play screen). */
export function objectiveProgress(state: GameState) {
  return {
    balance: clamp(state.balance / GAME.OBJECTIVES.balance, 0, 1),
    flow: clamp(state.incomingFlow / GAME.OBJECTIVES.flow, 0, 1),
    transactions: clamp(state.transactions / GAME.OBJECTIVES.transactions, 0, 1),
    confidence: clamp(state.confidence / GAME.OBJECTIVES.confidence, 0, 1),
  };
}

/** Final score on 100, with partial credit + risk penalties. Never negative. */
export function computeScore(state: GameState): number {
  const o = GAME.OBJECTIVES;
  const balanceScore = 20 * clamp(state.balance / o.balance, 0, 1);
  const flowScore = 20 * clamp(state.incomingFlow / o.flow, 0, 1);
  const txScore = 20 * clamp(state.transactions / o.transactions, 0, 1);
  const confScore = 15 * clamp(state.confidence / o.confidence, 0, 1);

  // Risk: full 10 at <=40, fading to 0 at the critical threshold.
  const riskScore =
    state.risk <= 40
      ? 10
      : 10 * clamp((GAME.RISK_CRITICAL - state.risk) / (GAME.RISK_CRITICAL - 40), 0, 1);

  const streakBonus = 10 * clamp(state.bestStreak / 8, 0, 1);
  const timeBonus = 5 * clamp(state.timeLeft / GAME.START_TIME, 0, 1);

  let total = balanceScore + flowScore + txScore + confScore + riskScore + streakBonus + timeBonus;

  if (state.risk > GAME.RISK_CRITICAL) total -= 12;
  if (state.risk >= GAME.RISK_BLOCK) total -= 20;

  return Math.round(clamp(finite(total, 0), 0, 100));
}

/** Finalize a game: compute status, score and unlocked badges. */
export function finishGame(state: GameState): GameState {
  const won = checkWinCondition(state) && state.risk < GAME.RISK_BLOCK;
  const finalScore = computeScore(state);
  const finished: GameState = {
    ...state,
    status: won ? "won" : "lost",
    finalScore,
  };
  // Badges are evaluated lazily by the store to avoid a circular import.
  return finished;
}

export function resetGame(): GameState {
  return createInitialGameState();
}

/** Decrement the timer by one second; auto-finish at zero. */
export function tick(state: GameState): GameState {
  if (state.status !== "playing") return state;
  const timeLeft = Math.max(0, state.timeLeft - 1);
  if (timeLeft <= 0) {
    return finishGame({ ...state, timeLeft: 0 });
  }
  return { ...state, timeLeft };
}
