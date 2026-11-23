import { ELEMENTS, PALETTE, FONT } from './config.js';

export const SCREEN_TITLE = 'title';
export const SCREEN_PLAY = 'play';
export const SCREEN_WIN = 'win';
export const SCREEN_LOSE = 'lose';

export function cardRect(index, handLength = 5) {
  const cardW = 135;
  const cardH = 195;
  // Shrink the gap (never the cards) when the hand grows, so every card stays on the table.
  const spacing = handLength > 1 ? Math.min(145, (1240 - cardW) / (handLength - 1)) : 145;
  const totalW = handLength * spacing - (spacing - cardW);
  const startX = (1280 - totalW) / 2;
  return {
    x: startX + index * spacing,
    y: 490,
    width: cardW,
    height: cardH
  };
}

export function endTurnRect() {
  return {
    x: 1060,
    y: 330,
    width: 170,
    height: 55
  };
}

export function createRenderer(canvas) {
  const ctx = canvas.getContext('2d');

  function drawFlame(cx, cy, size, color) {
    ctx.save();
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(cx, cy + size * 0.5);
    ctx.quadraticCurveTo(cx - size * 0.6, cy + size * 0.2, cx - size * 0.4, cy - size * 0.2);
    ctx.quadraticCurveTo(cx - size * 0.1, cy - size * 0.6, cx, cy - size * 0.7);
    ctx.quadraticCurveTo(cx + size * 0.1, cy - size * 0.6, cx + size * 0.4, cy - size * 0.2);
    ctx.quadraticCurveTo(cx + size * 0.6, cy + size * 0.2, cx, cy + size * 0.5);
    ctx.fill();
    ctx.restore();
  }

  function drawLeaf(cx, cy, size, color) {
    ctx.save();
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(cx, cy - size * 0.6);
    ctx.quadraticCurveTo(cx + size * 0.6, cy - size * 0.2, cx, cy + size * 0.6);
    ctx.quadraticCurveTo(cx - size * 0.6, cy - size * 0.2, cx, cy - size * 0.6);
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(cx, cy - size * 0.4);
    ctx.lineTo(cx, cy + size * 0.4);
    ctx.stroke();
    ctx.restore();
  }

  function drawWave(cx, cy, size, color) {
    ctx.save();
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(cx - size * 0.6, cy + size * 0.3);
    ctx.quadraticCurveTo(cx - size * 0.3, cy - size * 0.5, cx, cy + size * 0.1);
    ctx.quadraticCurveTo(cx + size * 0.3, cy - size * 0.5, cx + size * 0.6, cy + size * 0.3);
    ctx.lineTo(cx + size * 0.6, cy + size * 0.5);
    ctx.lineTo(cx - size * 0.6, cy + size * 0.5);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  function drawElementIcon(cx, cy, size, elementKey) {
    const elem = ELEMENTS[elementKey];
    if (!elem) return;
    if (elem.shape === 'flame') {
      drawFlame(cx, cy, size, elem.color);
    } else if (elem.shape === 'leaf') {
      drawLeaf(cx, cy, size, elem.color);
    } else if (elem.shape === 'wave') {
      drawWave(cx, cy, size, elem.color);
    }
  }

  function drawFeltTable() {
    ctx.fillStyle = PALETTE.table;
    ctx.fillRect(0, 0, 1280, 720);

    ctx.fillStyle = PALETTE.felt;
    ctx.fillRect(20, 20, 1240, 680);

    ctx.strokeStyle = PALETTE.gold;
    ctx.lineWidth = 4;
    ctx.strokeRect(22, 22, 1236, 676);

    ctx.strokeStyle = 'rgba(242, 201, 76, 0.3)';
    ctx.lineWidth = 1;
    ctx.strokeRect(30, 30, 1220, 660);
  }

  function drawLifeBar(x, y, life, maxLife, block, label) {
    ctx.save();
    ctx.fillStyle = PALETTE.panel;
    ctx.fillRect(x, y, 260, 40);
    ctx.strokeStyle = PALETTE.gold;
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, 260, 40);

    ctx.fillStyle = PALETTE.muted;
    ctx.font = `bold 14px ${FONT}`;
    ctx.textAlign = 'left';
    ctx.fillText(label, x + 10, y + 25);

    const barX = x + 90;
    const barY = y + 10;
    const barW = 150;
    const barH = 20;

    ctx.fillStyle = '#401010';
    ctx.fillRect(barX, barY, barW, barH);

    const ratio = Math.max(0, Math.min(1, life / maxLife));
    ctx.fillStyle = ratio > 0.4 ? '#4caf50' : '#e5534b';
    ctx.fillRect(barX, barY, barW * ratio, barH);

    ctx.fillStyle = PALETTE.text;
    ctx.font = `bold 12px ${FONT}`;
    ctx.textAlign = 'center';
    ctx.fillText(`${life}/${maxLife}`, barX + barW / 2, barY + 14);

    if (block > 0) {
      ctx.fillStyle = '#2196f3';
      ctx.beginPath();
      ctx.arc(x + 250, y + 20, 14, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.font = `bold 11px ${FONT}`;
      ctx.fillText(`🛡${block}`, x + 250, y + 24);
    }
    ctx.restore();
  }

  function drawManaCrystals(x, y, mana, maxMana) {
    ctx.save();
    for (let i = 0; i < 10; i++) {
      const cx = x + i * 22;
      const cy = y;
      ctx.beginPath();
      ctx.arc(cx, cy, 8, 0, Math.PI * 2);
      if (i < mana) {
        ctx.fillStyle = '#2196f3';
        ctx.fill();
        ctx.strokeStyle = PALETTE.gold;
        ctx.lineWidth = 2;
        ctx.stroke();
      } else if (i < maxMana) {
        ctx.fillStyle = '#1a2638';
        ctx.fill();
        ctx.strokeStyle = '#4a5568';
        ctx.lineWidth = 1;
        ctx.stroke();
      } else {
        ctx.fillStyle = 'rgba(20, 25, 35, 0.4)';
        ctx.fill();
      }
    }
    ctx.restore();
  }

  function drawCard(card, rect, isPlayer, affordable = true) {
    ctx.save();
    ctx.fillStyle = isPlayer ? PALETTE.panel : PALETTE.cardBack;
    ctx.fillRect(rect.x, rect.y, rect.width, rect.height);

    const elemColor = ELEMENTS[card.element] ? ELEMENTS[card.element].color : PALETTE.gold;
    ctx.strokeStyle = isPlayer ? (affordable ? elemColor : '#4a5568') : PALETTE.gold;
    ctx.lineWidth = 3;
    ctx.strokeRect(rect.x, rect.y, rect.width, rect.height);

    if (!isPlayer) {
      ctx.fillStyle = 'rgba(255,255,255,0.05)';
      ctx.fillRect(rect.x + 10, rect.y + 10, rect.width - 20, rect.height - 20);
      drawFlame(rect.x + rect.width / 2, rect.y + rect.height / 2, 25, 'rgba(242, 201, 76, 0.3)');
      ctx.restore();
      return;
    }

    if (!affordable) {
      ctx.fillStyle = 'rgba(0,0,0,0.4)';
      ctx.fillRect(rect.x, rect.y, rect.width, rect.height);
    }

    ctx.fillStyle = PALETTE.gold;
    ctx.beginPath();
    ctx.arc(rect.x + 20, rect.y + 20, 14, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#111';
    ctx.font = `bold 16px ${FONT}`;
    ctx.textAlign = 'center';
    ctx.fillText(`${card.cost}`, rect.x + 20, rect.y + 25);

    drawElementIcon(rect.x + rect.width - 24, rect.y + 20, 20, card.element);

    ctx.fillStyle = PALETTE.text;
    ctx.font = `bold 13px ${FONT}`;
    ctx.textAlign = 'center';
    ctx.fillText(card.name, rect.x + rect.width / 2, rect.y + 70);

    drawElementIcon(rect.x + rect.width / 2, rect.y + 105, 30, card.element);

    ctx.fillStyle = PALETTE.muted;
    ctx.font = `11px ${FONT}`;
    ctx.fillText(card.type, rect.x + rect.width / 2, rect.y + 140);

    ctx.fillStyle = elemColor;
    ctx.font = `bold 14px ${FONT}`;
    if (card.type === 'Strike') {
      ctx.fillText(`⚔ ${card.attack} ATK`, rect.x + rect.width / 2, rect.y + 170);
    } else if (card.type === 'Guard') {
      ctx.fillText(`🛡 ${card.block} BLK`, rect.x + rect.width / 2, rect.y + 170);
    } else {
      ctx.fillText(`⚔ ${card.attack} | 🎴+1`, rect.x + rect.width / 2, rect.y + 170);
    }

    ctx.restore();
  }

  function drawTriangleWidget(x, y) {
    ctx.save();
    ctx.fillStyle = 'rgba(25, 33, 44, 0.85)';
    ctx.fillRect(x, y, 220, 95);
    ctx.strokeStyle = PALETTE.gold;
    ctx.lineWidth = 1;
    ctx.strokeRect(x, y, 220, 95);

    ctx.fillStyle = PALETTE.gold;
    ctx.font = `bold 11px ${FONT}`;
    ctx.textAlign = 'center';
    ctx.fillText('ELEMENT ADVANTAGE (+2 ATK)', x + 110, y + 20);

    drawElementIcon(x + 35, y + 55, 18, 'EMBER');
    ctx.fillStyle = ELEMENTS.EMBER.color;
    ctx.font = `bold 12px ${FONT}`;
    ctx.fillText('Ember', x + 35, y + 80);

    ctx.fillStyle = PALETTE.text;
    ctx.fillText('➔', x + 72, y + 60);

    drawElementIcon(x + 110, y + 55, 18, 'LEAF');
    ctx.fillStyle = ELEMENTS.LEAF.color;
    ctx.fillText('Leaf', x + 110, y + 80);

    ctx.fillStyle = PALETTE.text;
    ctx.fillText('➔', x + 148, y + 60);

    drawElementIcon(x + 185, y + 55, 18, 'TIDE');
    ctx.fillStyle = ELEMENTS.TIDE.color;
    ctx.fillText('Tide', x + 185, y + 80);

    ctx.restore();
  }

  function drawTitleScreen(best) {
    drawFeltTable();

    ctx.save();
    ctx.fillStyle = PALETTE.gold;
    ctx.font = `bold 64px ${FONT}`;
    ctx.textAlign = 'center';
    ctx.fillText('EMBER & TIDE', 640, 220);

    ctx.fillStyle = PALETTE.text;
    ctx.font = `22px ${FONT}`;
    ctx.fillText('A Turn-Based Elemental Card Duel', 640, 270);

    ctx.fillStyle = PALETTE.muted;
    ctx.font = `18px ${FONT}`;
    ctx.fillText('Rival AI: Tidecaller', 640, 310);

    drawTriangleWidget(530, 350);

    ctx.fillStyle = PALETTE.gold;
    ctx.font = `bold 24px ${FONT}`;
    ctx.fillText('Click or press Enter to play', 640, 520);

    ctx.fillStyle = PALETTE.text;
    ctx.font = `bold 16px ${FONT}`;
    ctx.fillText(`Best Wins Record: ${best}`, 640, 570);

    ctx.restore();
  }

  function drawPlayScreen(state) {
    drawFeltTable();

    ctx.save();

    drawLifeBar(40, 40, state.rival.life, 20, state.rival.block, 'RIVAL');
    drawManaCrystals(40, 95, state.rival.mana, state.rival.maxMana);

    drawLifeBar(40, 380, state.player.life, 20, state.player.block, 'PLAYER');
    drawManaCrystals(40, 435, state.player.mana, state.player.maxMana);

    const rHand = state.rival.hand || [];
    const rCount = rHand.length;
    const rSpacing = 80;
    const rStartX = 640 - (rCount * rSpacing) / 2;
    for (let i = 0; i < rCount; i++) {
      drawCard(rHand[i], { x: rStartX + i * rSpacing, y: 40, width: 70, height: 100 }, false, true);
    }

    const pHand = state.player.hand || [];
    for (let i = 0; i < pHand.length; i++) {
      const cr = cardRect(i, pHand.length);
      const affordable = state.player.mana >= pHand[i].cost;
      drawCard(pHand[i], cr, true, affordable);

      ctx.fillStyle = PALETTE.gold;
      ctx.font = `bold 12px ${FONT}`;
      ctx.textAlign = 'center';
      ctx.fillText(`[${i + 1}]`, cr.x + cr.width / 2, cr.y - 8);
    }

    const et = endTurnRect();
    ctx.fillStyle = PALETTE.gold;
    ctx.fillRect(et.x, et.y, et.width, et.height);
    ctx.fillStyle = '#111';
    ctx.font = `bold 18px ${FONT}`;
    ctx.textAlign = 'center';
    ctx.fillText('END TURN', et.x + et.width / 2, et.y + 34);

    drawTriangleWidget(1020, 40);

    if (state.comboActive) {
      ctx.fillStyle = '#f2c94c';
      ctx.font = `bold 36px ${FONT}`;
      ctx.textAlign = 'center';
      ctx.fillText('★ COMBO! +3 BONUS ★', 640, 230);
    }

    ctx.fillStyle = 'rgba(25, 33, 44, 0.9)';
    ctx.fillRect(340, 320, 600, 45);
    ctx.strokeStyle = PALETTE.gold;
    ctx.lineWidth = 1;
    ctx.strokeRect(340, 320, 600, 45);

    ctx.fillStyle = PALETTE.text;
    ctx.font = `15px ${FONT}`;
    ctx.textAlign = 'center';
    const latestLog = state.log[0] || 'Select a card [1-5] or click End Turn.';
    ctx.fillText(latestLog, 640, 348);

    ctx.restore();
  }

  function drawWinScreen(state, best) {
    drawPlayScreen(state);

    ctx.save();
    ctx.fillStyle = '#0a1912';
    ctx.fillRect(0, 0, 1280, 720);

    for (let i = 0; i < 70; i++) {
      const cx = (i * 97 + 15) % 1280;
      const cy = (i * 53 + 20) % 720;
      const colors = ['#e5534b', '#4caf50', '#2196f3', '#f2c94c'];
      ctx.fillStyle = colors[i % colors.length];
      ctx.beginPath();
      ctx.arc(cx, cy, (i % 5) + 3, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.fillStyle = PALETTE.gold;
    ctx.font = `bold 72px ${FONT}`;
    ctx.textAlign = 'center';
    ctx.fillText('VICTORY!', 640, 300);

    ctx.fillStyle = PALETTE.text;
    ctx.font = `24px ${FONT}`;
    ctx.fillText('You defeated the Tidecaller!', 640, 360);

    ctx.fillStyle = PALETTE.gold;
    ctx.font = `bold 22px ${FONT}`;
    ctx.fillText('Click or press Enter to play again', 640, 460);

    ctx.fillStyle = PALETTE.muted;
    ctx.font = `16px ${FONT}`;
    ctx.fillText(`Best Wins: ${best}`, 640, 410);

    ctx.restore();
  }

  function drawLoseScreen(state, best) {
    drawPlayScreen(state);

    ctx.save();
    ctx.fillStyle = '#190a0a';
    ctx.fillRect(0, 0, 1280, 720);

    ctx.fillStyle = '#e5534b';
    ctx.font = `bold 72px ${FONT}`;
    ctx.textAlign = 'center';
    ctx.fillText('DEFEAT', 640, 300);

    ctx.fillStyle = PALETTE.text;
    ctx.font = `24px ${FONT}`;
    ctx.fillText('The Tidecaller prevailed this time.', 640, 360);

    ctx.fillStyle = PALETTE.gold;
    ctx.font = `bold 22px ${FONT}`;
    ctx.fillText('Click or press Enter to try again', 640, 460);

    ctx.fillStyle = PALETTE.muted;
    ctx.font = `16px ${FONT}`;
    ctx.fillText(`Best Wins: ${best}`, 640, 410);

    ctx.restore();
  }

  function draw(state, screen, best = 0) {
    ctx.save();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const scaleX = canvas.width / 1280;
    const scaleY = canvas.height / 720;
    ctx.scale(scaleX, scaleY);

    if (screen === SCREEN_TITLE) {
      drawTitleScreen(best);
    } else if (screen === SCREEN_WIN) {
      drawWinScreen(state, best);
    } else if (screen === SCREEN_LOSE) {
      drawLoseScreen(state, best);
    } else {
      drawPlayScreen(state);
    }

    ctx.restore();
  }

  return {
    draw,
    cardRect,
    endTurnRect
  };
}
