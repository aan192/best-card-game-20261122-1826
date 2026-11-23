export const ACTION_CONFIRM = 1;
export const ACTION_END_TURN = 2;
export const ACTION_PLAY_CARD = 4;
export const ACTION_PAUSE = 8;

export function createInput(canvas, layout) {
  let pendingMask = 0;
  let pendingIndex = -1;

  function onPointerDown(e) {
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = 1280 / (rect.width || 1280);
    const scaleY = 720 / (rect.height || 720);
    const mx = (e.clientX - rect.left) * scaleX;
    const my = (e.clientY - rect.top) * scaleY;

    const et = layout.endTurnRect();
    if (mx >= et.x && mx <= et.x + et.width && my >= et.y && my <= et.y + et.height) {
      pendingMask |= ACTION_END_TURN;
      return;
    }

    for (let i = 0; i < 7; i++) {
      const cr = layout.cardRect(i, 7);
      if (mx >= cr.x && mx <= cr.x + cr.width && my >= cr.y && my <= cr.y + cr.height) {
        pendingMask |= ACTION_PLAY_CARD;
        pendingIndex = i;
        return;
      }
    }

    pendingMask |= ACTION_CONFIRM;
  }

  function onKeyDown(e) {
    if (e.key >= '1' && e.key <= '7') {
      pendingMask |= ACTION_PLAY_CARD;
      pendingIndex = parseInt(e.key, 10) - 1;
    } else if (e.key === ' ' || e.key === 'Enter') {
      pendingMask |= (ACTION_CONFIRM | ACTION_END_TURN);
    } else if (e.key === 'p' || e.key === 'P') {
      pendingMask |= ACTION_PAUSE;
    }
  }

  if (canvas) {
    canvas.addEventListener('pointerdown', onPointerDown);
  }
  if (typeof window !== 'undefined') {
    window.addEventListener('keydown', onKeyDown);
  }

  function takeActions() {
    const mask = pendingMask;
    const selectedIndex = pendingIndex;
    pendingMask = 0;
    pendingIndex = -1;
    return { mask, selectedIndex };
  }

  function destroy() {
    if (canvas) {
      canvas.removeEventListener('pointerdown', onPointerDown);
    }
    if (typeof window !== 'undefined') {
      window.removeEventListener('keydown', onKeyDown);
    }
  }

  return {
    takeActions,
    destroy
  };
}
