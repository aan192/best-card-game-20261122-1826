import { SCREEN_WIN, SCREEN_LOSE, SCREEN_PLAY, SCREEN_TITLE } from './render.js';

export function stageShot(name, world) {
  world.reset();

  if (name === 'start') {
    world.state.phase = SCREEN_TITLE;
    return { screen: SCREEN_TITLE, best: 0 };
  }

  if (name === 'play') {
    world.state.phase = SCREEN_PLAY;
    for (let t = 0; t < 5; t++) {
      if (world.state.phase !== SCREEN_PLAY) break;
      let played = true;
      let safety = 10;
      while (played && safety-- > 0 && world.state.phase === SCREEN_PLAY) {
        played = false;
        for (let i = 0; i < world.state.player.hand.length; i++) {
          if (world.canPlay('player', i)) {
            world.playCard('player', i);
            played = true;
            break;
          }
        }
      }
      if (world.state.phase === SCREEN_PLAY) {
        world.endTurn();
      }
    }
    world.state.phase = SCREEN_PLAY;
    return { screen: SCREEN_PLAY, best: 0 };
  }

  if (name === 'win') {
    world.state.phase = SCREEN_PLAY;
    for (let t = 0; t < 60; t++) {
      if (world.state.phase === 'win' || world.state.rival.life <= 0) break;
      let played = true;
      let safety = 10;
      while (played && safety-- > 0 && world.state.phase === SCREEN_PLAY) {
        played = false;
        let bestIdx = -1;
        let maxAtk = -1;
        for (let i = 0; i < world.state.player.hand.length; i++) {
          if (world.canPlay('player', i)) {
            const card = world.state.player.hand[i];
            if (card.attack >= maxAtk) {
              maxAtk = card.attack;
              bestIdx = i;
            }
          }
        }
        if (bestIdx >= 0) {
          world.playCard('player', bestIdx);
          played = true;
        }
      }
      if (world.state.phase === SCREEN_PLAY) {
        world.endTurn();
      }
    }
    world.state.phase = SCREEN_WIN;
    world.state.rival.life = 0;
    return { screen: SCREEN_WIN, best: 1 };
  }

  if (name === 'loss' || name === 'lose') {
    world.state.phase = SCREEN_PLAY;
    for (let t = 0; t < 60; t++) {
      if (world.state.phase === 'lose' || world.state.player.life <= 0) break;
      world.endTurn();
    }
    world.state.phase = SCREEN_LOSE;
    world.state.player.life = 0;
    return { screen: SCREEN_LOSE, best: 0 };
  }

  return { screen: SCREEN_TITLE, best: 0 };
}
