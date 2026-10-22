// © 2026 Lai Long Master TA. Bảo lưu mọi quyền. Không sao chép, chỉnh sửa hay dùng lại khi chưa được phép.
/* Indicators: ATR, moving averages, bar enrichment, zigzag swings, wave legs, Point & Figure */
(function (L) {
  'use strict';
  const I = L.ind = {};

  I.clamp = (x, a, b) => Math.max(a, Math.min(b, x));

  I.atr = function (bars, n) {
    const out = new Array(bars.length);
    let sum = 0;
    for (let i = 0; i < bars.length; i++) {
      const b = bars[i];
      const pc = i > 0 ? bars[i - 1].c : b.c;
      const tr = Math.max(b.h - b.l, Math.abs(b.h - pc), Math.abs(b.l - pc));
      if (i < n) { sum += tr; out[i] = sum / (i + 1); }
      else out[i] = (out[i - 1] * (n - 1) + tr) / n;
    }
    return out;
  };

  /** Simple moving average; early values average whatever is available. */
  I.sma = function (vals, n) {
    const out = new Array(vals.length);
    let s = 0;
    for (let i = 0; i < vals.length; i++) {
      s += vals[i];
      if (i >= n) s -= vals[i - n];
      out[i] = s / Math.min(i + 1, n);
    }
    return out;
  };

  /** Adds spread, ATR, relative volume/spread (vs previous 20 bars), close position, direction. */
  I.enrich = function (raw) {
    const bars = raw.map(b => Object.assign({}, b));
    const atr = I.atr(bars, 14);
    const vMA = I.sma(bars.map(b => b.v), 20);
    const sMA = I.sma(bars.map(b => b.h - b.l), 20);
    const c20 = I.sma(bars.map(b => b.c), 20);
    const c50 = I.sma(bars.map(b => b.c), 50);
    const noVol = bars.every(b => !b.v);
    bars.forEach((b, i) => {
      b.i = i;
      b.spread = b.h - b.l;
      b.atr = Math.max(atr[i] || 0, Math.abs(b.c) * 1e-6, 1e-12);
      const va = i > 0 ? vMA[i - 1] : b.v;
      const sa = i > 0 ? sMA[i - 1] : b.spread;
      b.relVol = noVol || !(va > 0) ? 1 : b.v / va;
      b.relSpread = sa > 0 ? b.spread / sa : 1;
      b.closePos = b.spread > 0 ? (b.c - b.l) / b.spread : 0.5;
      const pc = i > 0 ? bars[i - 1].c : b.o;
      b.dir = b.c > pc ? 1 : (b.c < pc ? -1 : 0);
      b.sma20 = c20[i];
      b.sma50 = c50[i];
    });
    bars.noVolume = noVol;
    return bars;
  };

  /** ATR-based zigzag. Returns pivots [{type:'H'|'L', i, p, provisional?}] */
  I.zigzag = function (bars, mult) {
    const piv = [];
    if (bars.length < 3) return piv;
    let trend = 0;
    let hi = { i: 0, p: bars[0].h }, lo = { i: 0, p: bars[0].l }, ext = null;
    for (let i = 1; i < bars.length; i++) {
      const b = bars[i];
      const th = b.atr * mult;
      if (trend === 0) {
        if (b.h > hi.p) hi = { i, p: b.h };
        if (b.l < lo.p) lo = { i, p: b.l };
        if (hi.p - lo.p >= th) {
          if (hi.i > lo.i) { piv.push({ type: 'L', i: lo.i, p: lo.p }); trend = 1; ext = hi; }
          else { piv.push({ type: 'H', i: hi.i, p: hi.p }); trend = -1; ext = lo; }
        }
      } else if (trend === 1) {
        if (b.h >= ext.p) ext = { i, p: b.h };
        else if (ext.p - b.l >= th) { piv.push({ type: 'H', i: ext.i, p: ext.p }); trend = -1; ext = { i, p: b.l }; }
      } else {
        if (b.l <= ext.p) ext = { i, p: b.l };
        else if (b.h - ext.p >= th) { piv.push({ type: 'L', i: ext.i, p: ext.p }); trend = 1; ext = { i, p: b.h }; }
      }
    }
    if (ext) piv.push({ type: trend === 1 ? 'H' : 'L', i: ext.i, p: ext.p, provisional: true });
    return piv;
  };

  /** Waves between pivots (Weis-style): effort = volume, result = price travel. */
  I.legs = function (bars, piv) {
    const legs = [];
    for (let k = 1; k < piv.length; k++) {
      const a = piv[k - 1], b = piv[k];
      let vol = 0, cnt = 0;
      for (let j = a.i + 1; j <= b.i; j++) { vol += bars[j].v; cnt++; }
      if (!cnt) continue;
      const atr = bars[b.i].atr;
      legs.push({
        dir: b.type === 'H' ? 1 : -1, from: a.i, to: b.i, p0: a.p, p1: b.p,
        bars: cnt, vol, volPerBar: vol / cnt, move: Math.abs(b.p - a.p), moveAtr: Math.abs(b.p - a.p) / atr,
        provisional: !!b.provisional
      });
    }
    return legs;
  };

  /** Number of Point & Figure columns built on closes in [a,b]. */
  I.pnfColumns = function (bars, a, b, box, rev) {
    if (!(box > 0) || b <= a) return 0;
    let cols = 0, dir = 0;
    let colHi = Math.floor(bars[a].c / box) * box, colLo = colHi;
    for (let j = a + 1; j <= b; j++) {
      const c = bars[j].c;
      if (dir === 0) {
        if (c >= colHi + box) { colHi = Math.floor(c / box) * box; dir = 1; cols = 1; }
        else if (c <= colLo - box) { colLo = Math.ceil(c / box) * box; dir = -1; cols = 1; }
      } else if (dir === 1) {
        if (c >= colHi + box) colHi = Math.floor(c / box) * box;
        else if (c <= colHi - rev * box) { dir = -1; colLo = Math.ceil(c / box) * box; cols++; }
      } else {
        if (c <= colLo - box) colLo = Math.ceil(c / box) * box;
        else if (c >= colLo + rev * box) { dir = 1; colHi = Math.floor(c / box) * box; cols++; }
      }
    }
    return cols;
  };

  I.maxH = function (bars, a, b) { let m = -Infinity; for (let j = Math.max(0, a); j <= Math.min(bars.length - 1, b); j++) if (bars[j].h > m) m = bars[j].h; return m; };
  I.minL = function (bars, a, b) { let m = Infinity; for (let j = Math.max(0, a); j <= Math.min(bars.length - 1, b); j++) if (bars[j].l < m) m = bars[j].l; return m; };
  I.maxRelVol = function (bars, a, b) {
    let m = 0, idx = Math.max(0, a);
    for (let j = Math.max(0, a); j <= Math.min(bars.length - 1, b); j++) if (bars[j].relVol > m) { m = bars[j].relVol; idx = j; }
    return { v: m, i: idx };
  };
  I.median = function (arr) {
    if (!arr.length) return null;
    const s = arr.slice().sort((x, y) => x - y);
    const m = Math.floor(s.length / 2);
    return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
  };

  /** Trend from swing structure + slope + position vs SMA50. dir: 2 strong up … -2 strong down */
  I.trendState = function (bars, piv) {
    const n = bars.length;
    const highs = piv.filter(p => p.type === 'H').slice(-3);
    const lows = piv.filter(p => p.type === 'L').slice(-3);
    let score = 0;
    const notes = {};
    if (highs.length >= 2) { notes.hh = highs[highs.length - 1].p > highs[highs.length - 2].p; score += notes.hh ? 1 : -1; }
    if (lows.length >= 2) { notes.hl = lows[lows.length - 1].p > lows[lows.length - 2].p; score += notes.hl ? 1 : -1; }
    const last = bars[n - 1];
    const k = Math.min(30, n - 1);
    const slope = (last.c - bars[n - 1 - k].c) / last.atr;
    notes.slope = slope;
    score += I.clamp(slope / 5, -1, 1);
    score += last.c > last.sma50 ? 0.5 : -0.5;
    let dir = 0;
    if (score >= 2.2) dir = 2; else if (score >= 1) dir = 1; else if (score <= -2.2) dir = -2; else if (score <= -1) dir = -1;
    return { dir, score, notes };
  };
})(window.LLW);
