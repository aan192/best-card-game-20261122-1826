import { ELEMENTS } from './config.js';

export const CARD_TYPES = ['Strike', 'Guard', 'Surge'];

const CARD_SPECS = [
  // EMBER (10 cards)
  { name: 'Cinder Fang',   element: 'EMBER', type: 'Strike', cost: 1, attack: 3, block: 0, draw: 0 },
  { name: 'Flame Lash',    element: 'EMBER', type: 'Strike', cost: 2, attack: 4, block: 0, draw: 0 },
  { name: 'Blaze Strike',  element: 'EMBER', type: 'Strike', cost: 3, attack: 5, block: 0, draw: 0 },
  { name: 'Pyre Burst',    element: 'EMBER', type: 'Strike', cost: 4, attack: 6, block: 0, draw: 0 },
  { name: 'Inferno Strike',element: 'EMBER', type: 'Strike', cost: 5, attack: 7, block: 0, draw: 0 },
  { name: 'Ember Guard',   element: 'EMBER', type: 'Guard',  cost: 1, attack: 0, block: 3, draw: 0 },
  { name: 'Sear Barrier',  element: 'EMBER', type: 'Guard',  cost: 2, attack: 0, block: 4, draw: 0 },
  { name: 'Flame Shield',  element: 'EMBER', type: 'Guard',  cost: 4, attack: 0, block: 6, draw: 0 },
  { name: 'Ash Surge',     element: 'EMBER', type: 'Surge',  cost: 2, attack: 2, block: 0, draw: 1 },
  { name: 'Solar Surge',   element: 'EMBER', type: 'Surge',  cost: 4, attack: 4, block: 0, draw: 1 },

  // LEAF (10 cards)
  { name: 'Root Snare',    element: 'LEAF',  type: 'Strike', cost: 1, attack: 2, block: 0, draw: 0 },
  { name: 'Leaf Blade',    element: 'LEAF',  type: 'Strike', cost: 2, attack: 4, block: 0, draw: 0 },
  { name: 'Vine Strike',   element: 'LEAF',  type: 'Strike', cost: 3, attack: 5, block: 0, draw: 0 },
  { name: 'Bramble Lash',  element: 'LEAF',  type: 'Strike', cost: 4, attack: 6, block: 0, draw: 0 },
  { name: 'Bloom Shield',  element: 'LEAF',  type: 'Guard',  cost: 1, attack: 0, block: 3, draw: 0 },
  { name: 'Thorn Guard',   element: 'LEAF',  type: 'Guard',  cost: 2, attack: 0, block: 4, draw: 0 },
  { name: 'Bark Aegis',    element: 'LEAF',  type: 'Guard',  cost: 3, attack: 0, block: 5, draw: 0 },
  { name: 'Forest Surge',  element: 'LEAF',  type: 'Surge',  cost: 2, attack: 2, block: 0, draw: 1 },
  { name: 'Spore Surge',   element: 'LEAF',  type: 'Surge',  cost: 3, attack: 3, block: 0, draw: 1 },
  { name: 'Willow Surge',  element: 'LEAF',  type: 'Surge',  cost: 5, attack: 5, block: 0, draw: 1 },

  // TIDE (10 cards)
  { name: 'Tide Lash',     element: 'TIDE',  type: 'Strike', cost: 1, attack: 2, block: 0, draw: 0 },
  { name: 'Wave Crash',    element: 'TIDE',  type: 'Strike', cost: 3, attack: 5, block: 0, draw: 0 },
  { name: 'Aqua Strike',   element: 'TIDE',  type: 'Strike', cost: 4, attack: 6, block: 0, draw: 0 },
  { name: 'Abyssal Strike',element: 'TIDE',  type: 'Strike', cost: 5, attack: 7, block: 0, draw: 0 },
  { name: 'Frost Shield',  element: 'TIDE',  type: 'Guard',  cost: 1, attack: 0, block: 3, draw: 0 },
  { name: 'Torrent Guard', element: 'TIDE',  type: 'Guard',  cost: 2, attack: 0, block: 4, draw: 0 },
  { name: 'Mist Barrier',  element: 'TIDE',  type: 'Guard',  cost: 3, attack: 0, block: 5, draw: 0 },
  { name: 'Surge Tide',    element: 'TIDE',  type: 'Surge',  cost: 2, attack: 2, block: 0, draw: 1 },
  { name: 'Riptide Surge', element: 'TIDE',  type: 'Surge',  cost: 3, attack: 3, block: 0, draw: 1 },
  { name: 'Ocean Surge',   element: 'TIDE',  type: 'Surge',  cost: 4, attack: 4, block: 0, draw: 1 }
];

export function shuffle(deck, random) {
  const arr = [...deck];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = random ? random.nextInt(i + 1) : Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function buildDeck(random) {
  let id = 1;
  const rawCards = CARD_SPECS.map(spec => ({
    id: id++,
    name: spec.name,
    element: spec.element,
    type: spec.type,
    cost: spec.cost,
    attack: spec.attack,
    block: spec.block,
    draw: spec.draw
  }));
  return shuffle(rawCards, random);
}

export function drawCard(deck) {
  if (!deck || deck.length === 0) return null;
  return deck.pop();
}
