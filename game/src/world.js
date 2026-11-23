import { ELEMENTS, TRIANGLE_BONUS, COMBO_BONUS, START_LIFE, HAND_SIZE, MAX_MANA } from './config.js';
import { buildDeck, drawCard } from './deck.js';

export const EVENT_WIN = 'win';
export const EVENT_LOSE = 'lose';
export const EVENT_PLAY = 'play';

export function createWorld(random) {
  const state = {
    phase: 'title',
    turn: 1,
    player: {
      life: START_LIFE,
      mana: 1,
      maxMana: 1,
      hand: [],
      deck: [],
      block: 0,
      lastElement: null,
      playedThisTurn: []
    },
    rival: {
      life: START_LIFE,
      mana: 1,
      maxMana: 1,
      hand: [],
      deck: [],
      block: 0,
      lastElement: null,
      playedThisTurn: []
    },
    log: [],
    lastPlayedCard: null,
    comboActive: false,
    comboMessage: ''
  };

  function reset() {
    state.turn = 1;
    state.phase = 'play';
    state.log = ['Duel begins!'];
    state.comboActive = false;
    state.comboMessage = '';
    state.lastPlayedCard = null;

    const pDeck = buildDeck(random);
    const rDeck = buildDeck(random);

    const pHand = [];
    for (let i = 0; i < HAND_SIZE; i++) {
      const c = drawCard(pDeck);
      if (c) pHand.push(c);
    }

    const rHand = [];
    for (let i = 0; i < HAND_SIZE; i++) {
      const c = drawCard(rDeck);
      if (c) rHand.push(c);
    }

    state.player = {
      life: START_LIFE,
      mana: 1,
      maxMana: 1,
      hand: pHand,
      deck: pDeck,
      block: 0,
      lastElement: null,
      playedThisTurn: []
    };

    state.rival = {
      life: START_LIFE,
      mana: 1,
      maxMana: 1,
      hand: rHand,
      deck: rDeck,
      block: 0,
      lastElement: null,
      playedThisTurn: []
    };
  }

  function canPlay(side, index) {
    if (state.phase !== 'play') return false;
    const actor = side === 'player' ? state.player : state.rival;
    if (!actor || index < 0 || index >= actor.hand.length) return false;
    const card = actor.hand[index];
    return card && card.cost <= actor.mana;
  }

  function playCard(side, index) {
    if (!canPlay(side, index)) return null;

    const actor = side === 'player' ? state.player : state.rival;
    const target = side === 'player' ? state.rival : state.player;
    const card = actor.hand.splice(index, 1)[0];

    actor.mana -= card.cost;
    state.lastPlayedCard = card;

    const beatsTargetLast = target.lastElement &&
      ELEMENTS[card.element] &&
      ELEMENTS[card.element].beats === target.lastElement;
    const triangleBonus = beatsTargetLast ? TRIANGLE_BONUS : 0;

    const sameAsPrev = actor.playedThisTurn.length > 0 &&
      actor.playedThisTurn[actor.playedThisTurn.length - 1].element === card.element;
    const comboBonus = sameAsPrev ? COMBO_BONUS : 0;

    if (sameAsPrev) {
      state.comboActive = true;
      state.comboMessage = 'COMBO!';
    } else {
      state.comboActive = false;
    }

    let logLine = `${side === 'player' ? 'You' : 'Rival'} played ${card.name}`;

    if (card.type === 'Guard') {
      const addedBlock = card.block + comboBonus;
      actor.block += addedBlock;
      logLine += ` (Gained ${addedBlock} Guard)`;
    } else {
      let damage = card.attack + triangleBonus + comboBonus;
      const originalDamage = damage;
      logLine += ` (${originalDamage} Dmg`;
      if (beatsTargetLast) logLine += ' +2 Triangle';
      if (sameAsPrev) logLine += ' +3 Combo';
      logLine += ')';

      if (target.block > 0) {
        if (target.block >= damage) {
          target.block -= damage;
          damage = 0;
        } else {
          damage -= target.block;
          target.block = 0;
        }
      }

      if (damage > 0) {
        target.life = Math.max(0, target.life - damage);
      }
    }

    if (card.type === 'Surge' || card.draw > 0) {
      const drawnCard = drawCard(actor.deck);
      if (drawnCard) {
        actor.hand.push(drawnCard);
        logLine += ' & drew 1 card';
      }
    }

    actor.lastElement = card.element;
    actor.playedThisTurn.push(card);

    state.log.unshift(logLine);
    if (state.log.length > 5) state.log.pop();

    let eventType = EVENT_PLAY;
    if (state.rival.life <= 0) {
      state.phase = 'win';
      eventType = EVENT_WIN;
    } else if (state.player.life <= 0) {
      state.phase = 'lose';
      eventType = EVENT_LOSE;
    }

    return { type: eventType, card, triangle: beatsTargetLast, combo: sameAsPrev };
  }

  function aiTakeTurn() {
    if (state.phase !== 'play') return;

    let iterations = 10;
    while (state.phase === 'play' && iterations-- > 0) {
      let bestIndex = -1;
      let bestScore = -Infinity;

      for (let i = 0; i < state.rival.hand.length; i++) {
        const c = state.rival.hand[i];
        if (c.cost <= state.rival.mana) {
          const beatsPlayer = state.player.lastElement &&
            ELEMENTS[c.element] &&
            ELEMENTS[c.element].beats === state.player.lastElement;
          const val = c.attack + c.block;
          const score = (beatsPlayer ? 100 : 0) + val * 10 - c.cost;

          if (score > bestScore) {
            bestScore = score;
            bestIndex = i;
          }
        }
      }

      if (bestIndex >= 0) {
        playCard('rival', bestIndex);
      } else {
        break;
      }
    }
  }

  function endTurn() {
    if (state.phase !== 'play') return;

    aiTakeTurn();

    if (state.phase !== 'play') return;

    state.turn += 1;
    state.comboActive = false;

    state.player.maxMana = Math.min(MAX_MANA, state.player.maxMana + 1);
    state.player.mana = state.player.maxMana;
    state.player.playedThisTurn = [];

    state.rival.maxMana = Math.min(MAX_MANA, state.rival.maxMana + 1);
    state.rival.mana = state.rival.maxMana;
    state.rival.playedThisTurn = [];

    const pDrawn = drawCard(state.player.deck);
    if (pDrawn) state.player.hand.push(pDrawn);

    const rDrawn = drawCard(state.rival.deck);
    if (rDrawn) state.rival.hand.push(rDrawn);
  }

  return {
    state,
    reset,
    canPlay,
    playCard,
    endTurn,
    aiTakeTurn
  };
}
