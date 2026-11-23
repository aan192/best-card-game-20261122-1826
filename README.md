[![make.fun](https://make.fun/badge.svg)](https://make.fun/c/best-card-game-20261122-1826)
[![agent](https://make.fun/badge-agent.svg)](https://make.fun/c/best-card-game-20261122-1826)
[![live](https://make.fun/badge-live.svg)](https://make.fun/c/best-card-game-20261122-1826)

# Ember & Tide

**Ember & Tide** is an original turn-based elemental card duel where you battle against the rival AI "Tidecaller".

## Elemental Triangle
- **EMBER** (Red Flame) beats **LEAF** (+2 Attack)
- **LEAF** (Green Leaf) beats **TIDE** (+2 Attack)
- **TIDE** (Blue Wave) beats **EMBER** (+2 Attack)

## Features & Controls
- **Combo System**: Playing 2 cards of the SAME element in one turn grants a +3 bonus and displays a "COMBO!" banner.
- **Card Types**:
  - **Strike**: Direct damage.
  - **Guard**: Absorbs incoming damage.
  - **Surge**: Deals damage and draws 1 extra card.
- **Rival AI**: "Tidecaller" strategically plays its best affordable card, prioritizing counter-elements.
- **Controls**:
  - Click cards or press keys `1`-`5` to play.
  - Click **END TURN** or press `Space`/`Enter` to finish your turn.

## How to Run

1. Start local server:
   ```bash
   node serve.ts
   ```
2. Open [http://localhost:8080](http://localhost:8080) in your browser.

## How to play

You and the Tidecaller each start on 20 life, and the duel is won by
dragging the other side down to zero: bring the rival to 0 and the win
screen is yours, drop to 0 yourself and the loss screen ends the run.
Either way, the play-again button deals a fresh duel.

You open with a hand of five cards and draw one more at the start of
every turn. Cards are paid for with mana. Your pool begins at a single
point and refills each turn one larger than the turn before, topping out
at ten, so the early turns are about cheap plays and patience while the
late turns let the heavy cards land. On your turn, click a card (or tap
its number key, 1–5) to play it if you can afford it, play as many as
your mana allows, then press END TURN — or Space/Enter — to hand over.
Strikes hit for their printed attack, Guards soak up the next blow aimed
at you, and Surges wound the rival while pulling an extra card into your
hand.

Every card belongs to one of three elements, and the triangle decides
the bonuses: Ember burns Leaf, Leaf drinks Tide, and Tide douses Ember,
with the winning element striking for +2 extra attack — so a card that
looks weak on paper can be the right answer to what the rival just put
down. The Tidecaller reads the table the same way and likes to answer
your last element with its counter, which makes holding a counter of
your own worthwhile. One more trick: play two cards of the same element
in a single turn and the second one hits with a +3 combo bonus, banner
and all — sometimes the strongest turn is not the biggest card, but two
matching ones played back to back.
