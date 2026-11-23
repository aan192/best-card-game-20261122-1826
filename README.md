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
