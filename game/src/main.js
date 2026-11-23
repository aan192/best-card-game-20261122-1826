import { BEST_KEY } from './config.js';
import { createRandom } from './random.js';
import { createWorld } from './world.js';
import { createRenderer, SCREEN_TITLE, SCREEN_PLAY, SCREEN_WIN, SCREEN_LOSE } from './render.js';
import { createInput, ACTION_CONFIRM, ACTION_END_TURN, ACTION_PLAY_CARD } from './input.js';
import { stageShot } from './shots.js';

function getBestWins() {
  try {
    const val = localStorage.getItem(BEST_KEY);
    return val ? parseInt(val, 10) || 0 : 0;
  } catch (e) {
    return 0;
  }
}

function saveBestWins(wins) {
  try {
    const current = getBestWins();
    if (wins > current) {
      localStorage.setItem(BEST_KEY, String(wins));
    }
  } catch (e) {}
}

function announce(text) {
  const statusEl = document.getElementById('status');
  if (statusEl) {
    statusEl.textContent = text;
  }
}

function main() {
  const canvas = document.getElementById('game');
  if (!canvas) return;

  const urlParams = new URLSearchParams(window.location.search);
  const shotName = urlParams.get('shot');
  const seedVal = parseInt(urlParams.get('seed') || '1', 10);

  const random = createRandom(seedVal);
  const world = createWorld(random);
  const renderer = createRenderer(canvas);
  const input = createInput(canvas, renderer);

  let bestWins = getBestWins();
  let sessionWins = 0;

  if (shotName) {
    const res = stageShot(shotName, world);
    renderer.draw(world.state, res.screen, res.best);
    requestAnimationFrame(() => {
      renderer.draw(world.state, res.screen, res.best);
      requestAnimationFrame(() => {
        window.__shotReady = true;
      });
    });
    return;
  }

  let currentScreen = SCREEN_TITLE;

  function frame() {
    const { mask, selectedIndex } = input.takeActions();

    if (currentScreen === SCREEN_TITLE) {
      if (mask & ACTION_CONFIRM) {
        world.reset();
        currentScreen = SCREEN_PLAY;
        announce('Game started. Player turn.');
      }
    } else if (currentScreen === SCREEN_PLAY) {
      if ((mask & ACTION_PLAY_CARD) && selectedIndex >= 0) {
        if (world.canPlay('player', selectedIndex)) {
          const res = world.playCard('player', selectedIndex);
          if (res) {
            announce(`Played ${res.card.name}`);
            if (world.state.phase === 'win') {
              currentScreen = SCREEN_WIN;
              sessionWins++;
              saveBestWins(sessionWins);
              announce('Victory! You defeated the Tidecaller.');
            } else if (world.state.phase === 'lose') {
              currentScreen = SCREEN_LOSE;
              announce('Defeat. The Tidecaller prevailed.');
            }
          }
        }
      } else if (mask & ACTION_END_TURN) {
        announce('Ending turn. Rival turn.');
        world.endTurn();
        if (world.state.phase === 'win') {
          currentScreen = SCREEN_WIN;
          sessionWins++;
          saveBestWins(sessionWins);
          announce('Victory! You defeated the Tidecaller.');
        } else if (world.state.phase === 'lose') {
          currentScreen = SCREEN_LOSE;
          announce('Defeat. The Tidecaller prevailed.');
        }
      }
    } else if (currentScreen === SCREEN_WIN || currentScreen === SCREEN_LOSE) {
      if (mask & ACTION_CONFIRM) {
        world.reset();
        currentScreen = SCREEN_PLAY;
        announce('New duel started. Player turn.');
      }
    }

    bestWins = Math.max(bestWins, sessionWins, getBestWins());
    renderer.draw(world.state, currentScreen, bestWins);

    requestAnimationFrame(frame);
  }

  requestAnimationFrame(frame);
}

main();
