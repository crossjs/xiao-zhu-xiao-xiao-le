export function onScroll(handler) {
  let x0;
  let y0;
  let startId;

  wx.onTouchStart(e => {
    const [ point ] = e.changedTouches;
    x0 = point.clientX;
    y0 = point.clientY;
    startId = point.identifier;
  });

  wx.onTouchEnd(e => {
    const [ point ] = e.changedTouches;
    const x1 = point.clientX;
    const y1 = point.clientY;
    const endId = point.identifier;

    // 判断是否为同一次触摸，若不是则直接忽略
    if (endId === startId) {
      const dx = x1 - x0;
      const dy = y1 - y0;
      // 滑动 20px 以上激活，防止误触
      // 不使用 1 判断斜率，而留有余量，防止误触
      if (Math.abs(dy) > 20 && Math.abs(dy / dx) > 2) {
        handler(dy > 0 ? -1 : 1);
      }
    }
  });
}
