// © 2026 Lai Long Master TA. Bảo lưu mọi quyền. Không sao chép, chỉnh sửa hay dùng lại khi chưa được phép.
/* Wyckoff structure engine: trading range, events, phases, bias, cause (P&F), scenarios */
(function (L) {
  'use strict';
  const I = L.ind, V = L.vsa;
  const W = L.wy = {};

  /* ---------- event dictionary ---------- */
  W.EVT = {
    PS: { s: 'PS', b: 1, vi: 'Hỗ trợ sơ bộ (Preliminary Support)', en: 'Preliminary Support' },
    PSY: { s: 'PSY', b: -1, vi: 'Cung sơ bộ (Preliminary Supply)', en: 'Preliminary Supply' },
    SC: { s: 'SC', b: 1, vi: 'Cao trào bán (Selling Climax)', en: 'Selling Climax' },
    BC: { s: 'BC', b: -1, vi: 'Cao trào mua / điểm dừng tăng (Buying Climax)', en: 'Buying Climax / stopping action' },
    AR: { s: 'AR', b: 0, vi: 'Phản ứng tự động (Automatic Reaction/Rally)', en: 'Automatic Reaction / Rally' },
    ST: { s: 'ST', b: 0, vi: 'Kiểm tra thứ cấp (Secondary Test)', en: 'Secondary Test' },
    STB: { s: 'ST-B', b: 0, vi: 'Kiểm tra thứ cấp trong Pha B', en: 'Secondary Test in Phase B' },
    UA: { s: 'UA', b: 0, vi: 'Upthrust Action trong Pha B', en: 'Upthrust Action (Phase B)' },
    UT: { s: 'UT', b: -1, vi: 'Upthrust (đẩy lên thất bại)', en: 'Upthrust' },
    SOWB: { s: 'mSOW', b: -1, vi: 'Dấu hiệu yếu trong Pha B', en: 'Minor sign of weakness (Phase B)' },
    SPRING: { s: 'Spring', b: 1, vi: 'Spring (xuyên thủng hỗ trợ rồi hồi)', en: 'Spring' },
    UTAD: { s: 'UTAD', b: -1, vi: 'UTAD (Upthrust sau phân phối)', en: 'Upthrust After Distribution' },
    TESTS: { s: 'Test', b: 1, vi: 'Test của Spring', en: 'Test of the spring' },
    TESTU: { s: 'Test', b: -1, vi: 'Test của UTAD', en: 'Test of the UTAD' },
    MSOS: { s: 'mSOS', b: 1, vi: 'Dấu hiệu sức mạnh trong TR', en: 'Minor Sign of Strength' },
    SOS: { s: 'SOS', b: 1, vi: 'Dấu hiệu sức mạnh / JAC (nhảy qua Creek)', en: 'Sign of Strength / JAC' },
    LPS: { s: 'LPS', b: 1, vi: 'Điểm hỗ trợ cuối (Last Point of Support)', en: 'Last Point of Support' },
    BU: { s: 'BU/LPS', b: 1, vi: 'Back-Up về mép Creek (BU/LPS)', en: 'Back-Up to the Creek (BU/LPS)' },
    MSOW: { s: 'mSOW', b: -1, vi: 'Dấu hiệu yếu trong TR', en: 'Minor Sign of Weakness' },
    SOW: { s: 'SOW', b: -1, vi: 'Dấu hiệu yếu / phá Ice', en: 'Sign of Weakness / break of Ice' },
    LPSY: { s: 'LPSY', b: -1, vi: 'Điểm cung cuối (Last Point of Supply)', en: 'Last Point of Supply' },
    MARKUP: { s: 'Markup', b: 1, vi: 'Bắt đầu Markup (Pha E)', en: 'Markup begins (Phase E)' },
    MARKDOWN: { s: 'Markdown', b: -1, vi: 'Bắt đầu Markdown (Pha E)', en: 'Markdown begins (Phase E)' }
  };
  W.evName = c => L.T(W.EVT[c].vi, W.EVT[c].en);

  W.STRUCT = {
    ACC: { vi: 'Tích lũy (Accumulation)', en: 'Accumulation', b: 1 },
    REACC: { vi: 'Tái tích lũy (Re-accumulation)', en: 'Re-accumulation', b: 1 },
    DIST: { vi: 'Phân phối (Distribution)', en: 'Distribution', b: -1 },
    REDIST: { vi: 'Tái phân phối (Re-distribution)', en: 'Re-distribution', b: -1 },
    TR_L: { vi: 'Trading Range sau nhịp giảm (chưa xác nhận)', en: 'Trading range after a decline (unconfirmed)', b: 0 },
    TR_H: { vi: 'Trading Range sau nhịp tăng (chưa xác nhận)', en: 'Trading range after an advance (unconfirmed)', b: 0 },
    TREND_UP: { vi: 'Xu hướng tăng (Markup)', en: 'Uptrend (Markup)', b: 1 },
    TREND_DOWN: { vi: 'Xu hướng giảm (Markdown)', en: 'Downtrend (Markdown)', b: -1 },
    RANGE_NC: { vi: 'Đi ngang chưa có cao trào rõ', en: 'Sideways without a clear climax', b: 0 }
  };
  W.structName = c => L.T(W.STRUCT[c].vi, W.STRUCT[c].en);

  W.PHASE = {
    A: { vi: 'Pha A — Dừng xu hướng cũ', en: 'Phase A — Stopping the prior trend' },
    B: { vi: 'Pha B — Xây dựng Nguyên nhân', en: 'Phase B — Building the cause' },
    C: { vi: 'Pha C — Kiểm tra (Spring/UTAD)', en: 'Phase C — The test (Spring/UTAD)' },
    D: { vi: 'Pha D — Xu hướng trong TR', en: 'Phase D — Trend within the TR' },
    E: { vi: 'Pha E — Rời TR, xu hướng mới', en: 'Phase E — Leaving the TR, new trend' }
  };

  /* ---------- trading range detection ---------- */
  function detectExit(bars, from, top, bot, h) {
    const n = bars.length;
    for (let j = from + 1; j < n; j++) {
      const c = bars[j].c;
      const dir = c > top + 0.1 * h ? 1 : (c < bot - 0.1 * h ? -1 : 0);
      if (!dir) continue;
      const edge = dir > 0 ? top : bot;
      let ok = true, cnt = 0, k = j;
      for (; k < n && k < j + 6; k++) {
        const ck = bars[k].c;
        if (dir > 0 ? ck < edge : ck > edge) { ok = false; break; }
        cnt++;
      }
      if (!ok) continue;
      if (cnt >= 6) return { idx: j, dir, confirmed: true };
      const far = dir > 0 ? I.maxH(bars, j, n - 1) - top > h : bot - I.minL(bars, j, n - 1) > h;
      return { idx: j, dir, confirmed: far };
    }
    return null;
  }

  function buildCandidate(bars, piv, k) {
    const n = bars.length, p = piv[k];
    const atr = bars[p.i].atr;
    const isL = p.type === 'L';
    const look = Math.max(0, p.i - 60);
    if (p.i - look < 5) return null;
    const ext = isL ? I.maxH(bars, look, p.i - 1) : I.minL(bars, look, p.i - 1);
    const prior = isL ? (ext - p.p) / atr : (p.p - ext) / atr;
    if (prior < 4) return null;
    // Automatic reaction: merge minor pullbacks so AR is the real reaction extreme
    let qk = k + 1;
    while (qk + 2 < piv.length && qk - k < 6) {
      const q = piv[qk], r = piv[qk + 1], q2 = piv[qk + 2];
      const leg = Math.abs(q.p - p.p);
      const retr = Math.abs(q.p - r.p) / leg;
      const extends_ = isL ? q2.p > q.p : q2.p < q.p;
      const holds = isL ? r.p > p.p : r.p < p.p;
      if (retr < 0.4 && extends_ && holds) qk += 2; else break;
    }
    const q = piv[qk];
    const top = Math.max(p.p, q.p), bot = Math.min(p.p, q.p), h = top - bot;
    const hA = h / atr;
    if (hA < 1.5 || hA > 30) return null;
    if (n - 1 - p.i < 4) return null;
    const exit = detectExit(bars, q.i, top, bot, h);
    if (exit && exit.confirmed && exit.idx - p.i < 12) return null; // just a reaction inside a trend
    const cv = I.maxRelVol(bars, p.i - 3, p.i + 1);
    return { type: p.type, climax: p, ar: q, top, bot, h, climaxVol: cv.v, climaxBar: cv.i, prior, exit, start: p.i };
  }

  function findTR(bars, piv) {
    const start = Math.max(0, bars.length - 400);
    let cur = null;
    for (let k = 0; k < piv.length - 1; k++) {
      const p = piv[k];
      if (p.i < start) continue;
      if (cur && !(cur.exit && cur.exit.confirmed && p.i > cur.exit.idx)) continue;
      const cand = buildCandidate(bars, piv, k);
      if (cand) cur = cand;
    }
    return cur;
  }

  /** Consecutive bars piercing a level; recovered = closed back inside within 3 bars of the extreme. */
  function clusters(bars, a, b, side, level) {
    const out = [];
    let cur = null;
    for (let j = a; j <= b; j++) {
      const pierce = side < 0 ? bars[j].l < level - 0.02 * bars[j].atr : bars[j].h > level + 0.02 * bars[j].atr;
      if (pierce) {
        if (!cur || j - cur.end > 2) { cur = { start: j, end: j, ext: j }; out.push(cur); }
        cur.end = j;
        if (side < 0 ? bars[j].l < bars[cur.ext].l : bars[j].h > bars[cur.ext].h) cur.ext = j;
      }
    }
    for (const c of out) {
      c.price = side < 0 ? bars[c.ext].l : bars[c.ext].h;
      c.side = side;
      c.recovered = false;
      for (let m = c.ext; m <= Math.min(bars.length - 1, c.ext + 3); m++) {
        if (side < 0 ? bars[m].c > level : bars[m].c < level) { c.recovered = true; break; }
      }
      c.pending = !c.recovered && c.ext + 3 > bars.length - 1;
      c.vol = I.maxRelVol(bars, c.start, c.end).v;
      c.depth = Math.abs(c.price - level) / bars[c.ext].atr;
    }
    return out;
  }

  function detectEvents(bars, tr, mp) {
    const n = bars.length, isL = tr.type === 'L', sup = tr.bot, res = tr.top, h = tr.h;
    const ev = [];
    const add = (code, i, price, extra) => {
      const b = bars[i];
      const e = Object.assign({ code, i, price, t: b.t, relVol: b.relVol, relSpread: b.relSpread, closePos: b.closePos }, extra || {});
      ev.push(e);
      return e;
    };
    const endIdx = tr.exit && tr.exit.confirmed ? tr.exit.idx : n - 1;
    const info = {};

    // PS / PSY: earlier pause on rising volume before the climax
    let best = null;
    for (const p of mp) {
      if (p.i < tr.climax.i - 40 || p.i > tr.climax.i - 2 || p.type !== tr.type) continue;
      if (isL ? p.p <= tr.climax.p : p.p >= tr.climax.p) continue;
      const rv = I.maxRelVol(bars, p.i - 1, p.i + 1).v;
      if (rv >= 1.3 && (!best || rv > best.rv)) best = { p, rv };
    }
    if (best) info.ps = add(isL ? 'PS' : 'PSY', best.p.i, best.p.p);
    info.climax = add(isL ? 'SC' : 'BC', tr.climax.i, tr.climax.p, { relVol: tr.climaxVol });
    info.ar = add('AR', tr.ar.i, tr.ar.p);

    const after = mp.filter(p => p.i > tr.ar.i && p.i <= endIdx);
    // Secondary test near the climax level
    for (const p of after) {
      if (p.type !== tr.type) continue;
      const d = isL ? (p.p - sup) / h : (res - p.p) / h;
      if (d <= 0.35 && d >= -0.25) {
        const rv = I.maxRelVol(bars, p.i - 1, p.i + 1).v;
        info.st = add('ST', p.i, p.p, { relVol: rv, volRatio: rv / Math.max(tr.climaxVol, 0.01) });
        break;
      }
    }

    // Penetrations of support / resistance
    const bStart = (info.st ? info.st.i : tr.ar.i) + 1;
    const down = clusters(bars, bStart, endIdx, -1, sup);
    const up = clusters(bars, bStart, endIdx, 1, res);
    const recovered = down.concat(up).filter(c => c.recovered).sort((a, b) => a.ext - b.ext);
    const span = Math.max(1, endIdx - tr.climax.i);
    let cEv = null;
    const lastRec = recovered[recovered.length - 1];
    const skip = new Set();
    if (lastRec && lastRec.ext - tr.climax.i >= Math.max(10, 0.25 * span)) {
      // the Phase C event is the extreme of the latest group of same-side penetrations; later ones are its tests
      const win = Math.max(15, 0.2 * span);
      const group = recovered.filter(c => c.side === lastRec.side && c.ext >= lastRec.ext - win && c.ext - tr.climax.i >= 10);
      cEv = group.reduce((m, c) => (c.side < 0 ? c.price < m.price : c.price > m.price) ? c : m, lastRec);
      group.forEach(c => { if (c.ext > cEv.ext) skip.add(c); });
    }
    for (const c of recovered) {
      if (c === cEv || skip.has(c)) continue;
      if (c.side < 0) add(isL ? 'STB' : 'SOWB', c.ext, c.price, { relVol: c.vol });
      else add(isL ? 'UA' : 'UT', c.ext, c.price, { relVol: c.vol });
    }
    info.pendingDown = down.find(c => c.pending) || null;
    info.pendingUp = up.find(c => c.pending) || null;

    if (cEv) {
      if (cEv.side < 0) {
        const type = cEv.vol >= 2 || cEv.depth >= 2.5 ? 1 : (cEv.vol >= 1.2 || cEv.depth >= 1 ? 2 : 3);
        info.c = add('SPRING', cEv.ext, cEv.price, { relVol: cEv.vol, depth: cEv.depth, springType: type, start: cEv.start });
      } else {
        info.c = add('UTAD', cEv.ext, cEv.price, { relVol: cEv.vol, depth: cEv.depth, start: cEv.start });
      }
      // test of the phase-C event
      const bull = cEv.side < 0;
      for (const p of mp) {
        if (p.i <= cEv.ext + 1 || p.type !== (bull ? 'L' : 'H')) continue;
        const ok = bull ? (p.p > cEv.price && p.p <= sup + 0.4 * h) : (p.p < cEv.price && p.p >= res - 0.4 * h);
        if (ok) {
          const rv = I.maxRelVol(bars, p.i - 1, p.i + 1).v;
          info.test = add(bull ? 'TESTS' : 'TESTU', p.i, p.p, { relVol: rv, volRatio: rv / Math.max(cEv.vol, 0.01) });
        }
        break;
      }
    }

    // Phase D: closes outside the TR that are not part of a recovered penetration
    const inRecovered = j => recovered.some(c => j >= c.start && j <= Math.min(n - 1, c.ext + 3));
    const dFrom = info.c ? info.c.i + 1 : bStart;
    for (let j = dFrom; j < n; j++) {
      if (inRecovered(j)) continue;
      const b = bars[j];
      const atExit = tr.exit && j >= tr.exit.idx; // the confirmed exit bar always counts as the breakout
      if (!info.sos && b.c > res && (b.relVol >= 1 || (atExit && tr.exit.dir > 0))) { info.sos = add('SOS', j, b.c, { jac: b.relSpread >= 1.2 && b.relVol >= 1.5 }); }
      if (!info.sow && b.c < sup && (b.relVol >= 1 || (atExit && tr.exit.dir < 0))) { info.sow = add('SOW', j, b.c); }
      if (info.sos || info.sow) break;
    }
    if (info.c && !info.sos && !info.sow) {
      const bull = info.c.code === 'SPRING';
      for (const p of mp) {
        if (p.i <= info.c.i || p.type !== (bull ? 'H' : 'L')) continue;
        if (bull ? p.p >= sup + 0.7 * h : p.p <= res - 0.7 * h) { info.msos = add(bull ? 'MSOS' : 'MSOW', p.i, p.p); break; }
      }
    }
    // LPS / BU / LPSY
    if (info.sos) {
      const p = mp.find(x => x.i > info.sos.i && x.type === 'L' && x.p >= res - 0.35 * h);
      if (p) info.lps = add('BU', p.i, p.p, { relVol: I.maxRelVol(bars, p.i - 1, p.i + 1).v });
    } else if (info.msos && info.msos.code === 'MSOS') {
      const floor = info.test ? info.test.price : info.c.price;
      const p = mp.find(x => x.i > info.msos.i && x.type === 'L' && x.p > floor && x.p >= sup + 0.25 * h);
      if (p) info.lps = add('LPS', p.i, p.p, { relVol: I.maxRelVol(bars, p.i - 1, p.i + 1).v });
    }
    if (info.sow) {
      const p = mp.find(x => x.i > info.sow.i && x.type === 'H' && x.p <= sup + 0.35 * h);
      if (p) info.lpsy = add('LPSY', p.i, p.p, { relVol: I.maxRelVol(bars, p.i - 1, p.i + 1).v });
    } else if (info.msos && info.msos.code === 'MSOW') {
      const ceil = info.test ? info.test.price : info.c.price;
      const p = mp.find(x => x.i > info.msos.i && x.type === 'H' && x.p < ceil && x.p <= res - 0.25 * h);
      if (p) info.lpsy = add('LPSY', p.i, p.p, { relVol: I.maxRelVol(bars, p.i - 1, p.i + 1).v });
    }
    if (tr.exit && tr.exit.confirmed) add(tr.exit.dir > 0 ? 'MARKUP' : 'MARKDOWN', tr.exit.idx, bars[tr.exit.idx].c);

    // failed breakouts: price back deep inside the TR without confirmed exit
    const lastC = bars[n - 1].c;
    if (!(tr.exit && tr.exit.confirmed)) {
      if (info.sos && lastC < sup + 0.4 * h) info.sos.failed = true;
      if (info.sow && lastC > res - 0.4 * h) info.sow.failed = true;
    }
    ev.sort((a, b) => a.i - b.i);
    return { ev, info, endIdx };
  }

  function phaseOf(bars, tr, info) {
    const n = bars.length;
    const d = [info.sos, info.sow, info.msos].filter(e => e && !e.failed).sort((a, b) => b.i - a.i)[0];
    if (tr.exit && tr.exit.confirmed) return { phase: 'E', dir: tr.exit.dir };
    if (d) return { phase: 'D', dir: (d.code === 'SOS' || d.code === 'MSOS') ? 1 : -1 };
    if (tr.exit) return { phase: 'D', dir: tr.exit.dir };
    if (info.c) return { phase: 'C', dir: info.c.code === 'SPRING' ? 1 : -1 };
    if (info.st || n - 1 - tr.climax.i >= 12) return { phase: 'B', dir: 0 };
    return { phase: 'A', dir: 0 };
  }

  function phaseSegments(bars, tr, info, ph) {
    const n = bars.length, segs = [];
    const aStart = info.ps ? info.ps.i : tr.climax.i;
    const aEnd = info.st ? info.st.i : Math.min(n - 1, tr.ar.i + 2);
    const push = (phase, from, to) => { if (to > from) segs.push({ phase, from, to }); };
    const cStart = info.c ? (info.c.start != null ? info.c.start : info.c.i) : null;
    const dEv = [info.sos, info.sow, info.msos].filter(e => e && !e.failed).sort((a, b) => a.i - b.i)[0];
    const eStart = tr.exit && tr.exit.confirmed ? tr.exit.idx : null;
    if (ph.phase === 'A') { push('A', aStart, n - 1); return segs; }
    push('A', aStart, aEnd);
    const bEnd = cStart != null ? cStart : (dEv ? dEv.i : (eStart != null ? eStart : n - 1));
    push('B', aEnd, bEnd);
    if (cStart != null) push('C', cStart, dEv ? dEv.i : (eStart != null ? eStart : n - 1));
    if (dEv) push('D', dEv.i, eStart != null ? eStart : n - 1);
    else if (eStart != null && cStart == null) push('D', bEnd, eStart);
    if (eStart != null) push('E', eStart, n - 1);
    return segs;
  }

  /* ---------- main ---------- */
  W.analyze = function (raw, opts) {
    opts = opts || {};
    const bars = I.enrich(raw);
    const n = bars.length;
    const res = { tf: opts.tf, symbol: opts.symbol, market: opts.market, bars, n };
    if (n < 60) { res.error = 'notEnough'; return res; }
    const lastIdx = bars[n - 1].live && n > 1 ? n - 2 : n - 1;
    res.lastIdx = lastIdx;
    res.last = bars[n - 1];
    res.lastClosed = bars[lastIdx];
    res.noVolume = bars.noVolume;
    const sig = res.sig = V.scan(bars);
    const majorPiv = res.majorPiv = I.zigzag(bars, 3);
    const minorPiv = res.minorPiv = I.zigzag(bars, 1.5);
    res.legs = I.legs(bars, minorPiv);
    res.trend = I.trendState(bars, minorPiv);
    const tr = res.tr = findTR(bars, majorPiv);
    const evidence = res.evidence = [];
    const addEv = (code, val, data) => evidence.push(Object.assign({ code, val }, data || {}));
    const lastC = res.last.c;

    if (tr) {
      const { ev, info, endIdx } = detectEvents(bars, tr, minorPiv);
      res.events = ev; res.info = info; tr.endIdx = endIdx;
      const ph = phaseOf(bars, tr, info);
      res.phase = ph.phase; res.phaseDir = ph.dir;
      res.segments = phaseSegments(bars, tr, info, ph);
      const h = tr.h, sup = tr.bot, rs = tr.top;
      // levels
      const inner = minorPiv.filter(p => p.i > tr.ar.i && p.i <= endIdx && !p.provisional);
      const hs = inner.filter(p => p.type === 'H' && p.p <= rs + 0.1 * h && p.p >= sup + 0.5 * h).map(p => p.p);
      const ls = inner.filter(p => p.type === 'L' && p.p >= sup - 0.1 * h && p.p <= sup + 0.5 * h).map(p => p.p);
      res.levels = { res: rs, sup, mid: (rs + sup) / 2, creek: I.median(hs) || rs, ice: I.median(ls) || sup, h };

      // ---- evidence for bias ----
      if (info.c && info.c.code === 'SPRING') addEv('spring', info.test ? 0.3 : 0.2);
      if (info.c && info.c.code === 'UTAD') addEv('utad', info.test ? -0.3 : -0.2);
      if (info.sos) addEv(info.sos.failed ? 'sosFailed' : 'sos', info.sos.failed ? -0.2 : 0.25);
      if (info.sow) addEv(info.sow.failed ? 'sowFailed' : 'sow', info.sow.failed ? 0.2 : -0.25);
      if (info.msos) addEv(info.msos.code === 'MSOS' ? 'msos' : 'msow', info.msos.code === 'MSOS' ? 0.15 : -0.15);
      if (info.lps) addEv('lps', 0.1);
      if (info.lpsy) addEv('lpsy', -0.1);
      if (tr.exit) addEv(tr.exit.dir > 0 ? 'exitUp' : 'exitDown', (tr.exit.confirmed ? 0.35 : 0.2) * tr.exit.dir);
      if (info.st && tr.type === 'L' && info.st.volRatio < 0.7) addEv('stLowVol', 0.05);
      if (info.st && tr.type === 'H' && info.st.volRatio < 0.7) addEv('stLowVolH', -0.05);
      // volume on rallies vs declines inside TR
      const trLegs = res.legs.filter(l => l.from >= tr.ar.i && l.to <= Math.max(endIdx, n - 1));
      const ups = trLegs.filter(l => l.dir > 0).slice(-3), dns = trLegs.filter(l => l.dir < 0).slice(-3);
      if (ups.length && dns.length && !res.noVolume) {
        const r = (ups.reduce((s, l) => s + l.volPerBar, 0) / ups.length) / Math.max(1e-9, dns.reduce((s, l) => s + l.volPerBar, 0) / dns.length);
        res.legVolRatio = r;
        addEv('legVol', I.clamp(Math.log(r) * 0.5, -0.2, 0.2), { r });
      }
      const lows = inner.filter(p => p.type === 'L').slice(-3), highs = inner.filter(p => p.type === 'H').slice(-3);
      if (lows.length >= 2) {
        const rising = lows.every((p, k) => k === 0 || p.p > lows[k - 1].p);
        const falling = lows.every((p, k) => k === 0 || p.p < lows[k - 1].p);
        if (rising) addEv('higherLows', 0.1); else if (falling) addEv('lowerLows', -0.1);
      }
      if (highs.length >= 2) {
        const falling = highs.every((p, k) => k === 0 || p.p < highs[k - 1].p);
        const rising = highs.every((p, k) => k === 0 || p.p > highs[k - 1].p);
        if (falling) addEv('lowerHighs', -0.1); else if (rising) addEv('higherHighs', 0.05);
      }
      const pos = (lastC - sup) / h;
      res.posInRange = pos;
      addEv('position', I.clamp((pos - 0.5) * 0.2, -0.15, 0.15), { pos });
    } else {
      res.events = []; res.info = {}; res.segments = [];
      const k = Math.min(40, n - 1);
      const hi = I.maxH(bars, n - 1 - k, n - 1), lo = I.minL(bars, n - 1 - k, n - 1);
      const atr = res.last.atr;
      if ((hi - lo) / atr <= 7 && Math.abs(res.trend.dir) < 2) {
        res.levels = { res: hi, sup: lo, mid: (hi + lo) / 2, creek: hi, ice: lo, h: hi - lo, box: true };
        res.posInRange = (lastC - lo) / Math.max(1e-9, hi - lo);
      } else {
        const lastH = minorPiv.filter(p => p.type === 'H').slice(-1)[0], lastL = minorPiv.filter(p => p.type === 'L').slice(-1)[0];
        res.levels = { res: lastH ? lastH.p : hi, sup: lastL ? lastL.p : lo, mid: null, creek: null, ice: null, h: (lastH && lastL) ? Math.abs(lastH.p - lastL.p) : hi - lo, swing: true };
      }
      addEv('trend', res.trend.dir * 0.2);
    }
    const vs = V.recentScore(sig, lastIdx, 15);
    res.vsaScore = vs;
    addEv('vsa', I.clamp(vs / 8, -0.2, 0.2), { s: vs });
    if (!tr) addEv('slope', I.clamp(res.trend.notes.slope / 15, -0.25, 0.25));
    res.bias = I.clamp(evidence.reduce((s, e) => s + e.val, 0), -1, 1);

    // ---- structure name ----
    if (tr) {
      const b = res.bias;
      if (tr.type === 'L') res.structure = b >= 0.1 ? 'ACC' : b <= -0.1 ? 'REDIST' : 'TR_L';
      else res.structure = b <= -0.1 ? 'DIST' : b >= 0.1 ? 'REACC' : 'TR_H';
      if (res.phase === 'C' && res.phaseDir * b < 0) res.structure = tr.type === 'L' ? 'TR_L' : 'TR_H'; // test points one way, evidence the other
      else if (res.phase === 'C' || res.phase === 'E' || res.phase === 'D') {
        if (res.phaseDir > 0) res.structure = tr.type === 'L' ? 'ACC' : 'REACC';
        if (res.phaseDir < 0) res.structure = tr.type === 'H' ? 'DIST' : 'REDIST';
      }
      res.schematic2 = (res.phase === 'D' || res.phase === 'E') && !res.info.c;
      if (res.phase === 'E') {
        const since = n - 1 - tr.exit.idx;
        const dist = tr.exit.dir > 0 ? (lastC - tr.top) / tr.h : (tr.bot - lastC) / tr.h;
        res.eExtended = since > 60 && dist > 2;
      }
    } else {
      res.structure = res.levels.box ? 'RANGE_NC' : (res.trend.dir > 0 ? 'TREND_UP' : res.trend.dir < 0 ? 'TREND_DOWN' : 'RANGE_NC');
    }
    // fresh climax warning at the right edge
    res.freshClimax = null;
    if (!tr || res.phase === 'E') for (let j = Math.max(0, lastIdx - 8); j <= lastIdx; j++) {
      for (const c of sig[j]) if (c === 'SC_BAR' || c === 'BC_BAR' || c === 'STOP_VOL') res.freshClimax = { code: c, i: j };
    }

    // ---- cause: Point & Figure horizontal count ----
    if (tr) {
      const a = tr.climax.i, b = Math.min(tr.endIdx, n - 1);
      let atrSum = 0; for (let j = a; j <= b; j++) atrSum += bars[j].atr;
      const box = 0.5 * atrSum / Math.max(1, b - a + 1);
      const from = Math.max(a, b - 150);
      const cols = I.pnfColumns(bars, from, b, box, 3);
      const proj = cols * box * 3;
      const info = res.info;
      const lineBull = info.lps ? info.lps.price : info.test && info.test.code === 'TESTS' ? info.test.price : info.c && info.c.code === 'SPRING' ? res.levels.sup : res.levels.sup;
      const lineBear = info.lpsy ? info.lpsy.price : info.test && info.test.code === 'TESTU' ? info.test.price : res.levels.res;
      res.pnf = {
        box, cols, proj, bars: b - from + 1, small: proj < 0.6 * res.levels.h,
        bull: [res.levels.sup + proj, lineBull + proj],
        bear: [Math.max(0, res.levels.res - proj), Math.max(0, lineBear - proj)],
        lineBull, lineBear
      };
    }
    res.scenarios = buildScenarios(res, opts);
    return res;
  };

  /* ---------- scenarios & trade plans ---------- */
  function rr(entry, stop, target) {
    const risk = Math.abs(entry - stop);
    return risk > 0 ? Math.abs(target - entry) / risk : null;
  }

  function buildScenarios(r, opts) {
    const mk = L.MARKETS[opts.market] || L.MARKETS.csv;
    const canShort = mk.canShort;
    const isVN = opts.market === 'vn_stock';
    const a = r.last.atr, lv = r.levels, tr = r.tr, info = r.info || {};
    const P = L.fmtP;
    const phase = r.phase;
    const sideW = !tr ? (r.structure === 'RANGE_NC' ? 0.5 : 0.2) : ({ A: 0.55, B: 0.5, C: 0.3, D: 0.2, E: 0.15 })[phase];
    const b = r.bias;
    let up = (1 - sideW) * (0.5 + 0.5 * b), dn = (1 - sideW) * (0.5 - 0.5 * b);
    let pu = Math.round(up * 20) * 5, pd = Math.round(dn * 20) * 5, ps = 100 - pu - pd;
    if (ps < 5) { ps = 5; if (pu >= pd) pu -= 5; else pd -= 5; }
    const minorL = r.minorPiv.filter(p => p.type === 'L' && !p.provisional).slice(-1)[0];
    const minorH = r.minorPiv.filter(p => p.type === 'H' && !p.provisional).slice(-1)[0];
    const lastC = r.last.c;

    const bull = { key: 'bull', prob: pu, title: L.T('Kịch bản TĂNG', 'BULLISH scenario'), thesis: [], trigger: [], invalid: '', plan: [] };
    const bear = { key: 'bear', prob: pd, title: L.T('Kịch bản GIẢM', 'BEARISH scenario'), thesis: [], trigger: [], invalid: '', plan: [] };
    const side = { key: 'side', prob: ps, title: L.T('Kịch bản ĐI NGANG', 'SIDEWAYS scenario'), thesis: [], trigger: [], invalid: '', plan: [] };
    const plan = (name, z1, z2, stop, targets, note) => {
      const lo = Math.min(z1, z2), hi = Math.max(z1, z2), mid = (lo + hi) / 2;
      const long = stop != null && stop < mid;
      // keep only targets beyond the entry zone, nearest first, without duplicates
      const tg = targets.filter(t => t != null && isFinite(t) && t > 0 && (long ? t > hi : t < lo))
        .sort((x, y) => long ? x - y : y - x)
        .filter((t, k, arr) => k === 0 || Math.abs(t - arr[k - 1]) > a * 0.25);
      return { name, zone: [lo, hi], stop, targets: tg, rr: tg.length ? rr(mid, stop, tg[0]) : null, note };
    };

    if (tr) {
      const h = lv.h, sup = lv.sup, res = lv.res;
      const pnfB = r.pnf && !r.pnf.small ? r.pnf.bull : [], pnfS = r.pnf && !r.pnf.small ? r.pnf.bear : [];
      // ---------- bullish ----------
      if (phase === 'E' && r.phaseDir > 0) {
        const anchor = minorL && minorL.p > sup ? minorL.p : res;
        bull.thesis.push(L.T('Giá đã rời TR đi lên (Pha E – Markup). Cầu kiểm soát; chiến lược là mua các nhịp điều chỉnh khối lượng thấp.',
          'Price has left the TR upward (Phase E – Markup). Demand is in control; buy low-volume pullbacks.'));
        bull.plan.push(plan(L.T('Mua pullback / BU', 'Buy pullback / BU'), anchor, anchor + 0.8 * a, anchor - 1.2 * a, [Math.max(...pnfB.slice(0, 1), res + h), pnfB[1]]));
        bull.trigger.push(L.T(`Nhịp điều chỉnh về ${P(anchor)} với biên độ hẹp, khối lượng thấp (No Supply/Test), sau đó nến tăng khối lượng tăng.`, `Pullback into ${P(anchor)} on narrow spread and low volume (No Supply/Test), then an up bar on rising volume.`));
      } else if (r.phaseDir > 0 && (phase === 'D')) {
        if (lastC > res || info.sos) {
          bull.thesis.push(L.T('Đã có SOS vượt kháng cự TR. Chờ Back-Up (BU/LPS) về mép Creek với khối lượng thấp để vào lệnh an toàn.',
            'A Sign of Strength has cleared TR resistance. Wait for a low-volume Back-Up (BU/LPS) to the edge of the Creek.'));
          bull.plan.push(plan(L.T('Mua BU/LPS', 'Buy BU/LPS'), res - 0.1 * h, res + 0.3 * a, res - 0.4 * h, [res + h, pnfB[0], pnfB[1]]));
        } else {
          const lps = info.lps ? info.lps.price : sup + 0.35 * h;
          bull.thesis.push(L.T('Pha D trong TR: cầu đã thể hiện sức mạnh (mSOS), các đáy nâng dần. Mua ở LPS trước khi giá vượt Creek.',
            'Phase D inside the TR: demand has shown strength (mSOS) with rising lows. Buy LPS before the Creek is crossed.'));
          bull.plan.push(plan(L.T('Mua LPS', 'Buy LPS'), lps, lps + 0.6 * a, Math.min(lps, info.c ? info.c.price : sup) - 0.8 * a, [res, res + h, pnfB[0]]));
        }
      } else if (phase === 'C' && r.phaseDir > 0) {
        const sp = info.c.price;
        bull.thesis.push(L.T(`Spring loại #${info.c.springType} đã xuất hiện tại ${P(sp)}. Nếu Test thành công (khối lượng thấp, đáy cao hơn Spring) cầu sẽ bắt đầu Pha D.`,
          `A type #${info.c.springType} Spring printed at ${P(sp)}. A successful low-volume Test above it would launch Phase D.`));
        bull.plan.push(plan(L.T('Mua Test của Spring (mạnh tay)', 'Buy the Spring test (aggressive)'), sp + 0.2 * a, sup + 0.15 * h, sp - 0.6 * a, [res, res + h, pnfB[0]]));
        bull.plan.push(plan(L.T('Mua BU/LPS sau SOS (thận trọng)', 'Buy BU/LPS after SOS (conservative)'), res - 0.1 * h, res + 0.3 * a, res - 0.4 * h, [res + h, pnfB[0]]));
      } else {
        bull.thesis.push(L.T('Cấu trúc chưa có dấu hiệu Pha C phía tăng. Không mua giữa TR; chờ Spring/Shakeout + Test hoặc SOS + BU.',
          'No bullish Phase C yet. Do not buy mid-range; wait for a Spring/Shakeout + Test or SOS + Back-Up.'));
        bull.plan.push(plan(L.T('Chờ Spring + Test', 'Wait for Spring + Test'), sup - 0.3 * a, sup + 0.15 * h, sup - 0.25 * h - a, [lv.mid, res, pnfB[0]]));
        bull.plan.push(plan(L.T('Chờ SOS + BU', 'Wait for SOS + BU'), res - 0.1 * h, res + 0.3 * a, res - 0.4 * h, [res + h, pnfB[0]]));
      }
      bull.trigger.push(L.T(`Đóng cửa trên ${P(res)} với biên độ rộng, khối lượng tăng (JAC/SOS), pullback sau đó khối lượng giảm và giữ trên ${P(res - 0.15 * h)}.`,
        `Close above ${P(res)} on a wide spread and rising volume (JAC/SOS); the following pullback shrinks in volume and holds above ${P(res - 0.15 * h)}.`));
      if (phase !== 'E') bull.trigger.push(L.T(`Hoặc: thủng ${P(sup)} rồi đóng cửa trở lại trong TR (Spring), tiếp theo một Test khối lượng thấp.`, `Or: a dip below ${P(sup)} that closes back inside (Spring) followed by a low-volume Test.`));
      bull.invalid = L.T(`Đóng cửa dưới ${P(sup - 0.25 * h)} với khối lượng lớn và không hồi lại trong 3 nến (SOW thật).`, `A close below ${P(sup - 0.25 * h)} on heavy volume with no recovery within 3 bars (genuine SOW).`);

      // ---------- bearish ----------
      if (phase === 'E' && r.phaseDir < 0) {
        const anchor = minorH && minorH.p < res ? minorH.p : sup;
        bear.thesis.push(L.T('Giá đã rời TR đi xuống (Pha E – Markdown). Cung kiểm soát; mọi nhịp hồi khối lượng thấp là LPSY.',
          'Price has left the TR downward (Phase E – Markdown). Supply is in control; low-volume rallies are LPSYs.'));
        bear.plan.push(plan(canShort ? L.T('Bán khống tại LPSY', 'Short the LPSY') : L.T('Bán/hạ tỷ trọng khi hồi', 'Sell / reduce on rallies'), anchor - 0.8 * a, anchor, anchor + 1.2 * a, [Math.min(...pnfS.slice(0, 1), sup - h), pnfS[1]]));
      } else if (r.phaseDir < 0 && phase === 'D') {
        bear.thesis.push(L.T('Pha D phía giảm: cung đã thắng (SOW/mSOW). Các nhịp hồi yếu về Ice là LPSY — điểm bán.',
          'Bearish Phase D: supply has won (SOW/mSOW). Weak rallies back to the Ice are LPSYs — sell points.'));
        const z = lastC < sup ? sup : (info.lpsy ? info.lpsy.price : res - 0.35 * h);
        bear.plan.push(plan(canShort ? L.T('Bán khống LPSY', 'Short LPSY') : L.T('Thoát hàng tại LPSY', 'Exit at LPSY'), z - 0.6 * a, z + 0.1 * h, z + 0.4 * h, [sup - h, pnfS[0], pnfS[1]]));
      } else if (phase === 'C' && r.phaseDir < 0) {
        const ut = info.c.price;
        bear.thesis.push(L.T(`UTAD tại ${P(ut)}: vượt kháng cự thất bại. Nếu Test của UTAD có khối lượng thấp và đỉnh thấp hơn, cung sẽ đẩy giá về đáy TR.`,
          `UTAD at ${P(ut)}: a failed breakout. A low-volume Test with a lower high would let supply drive price to the TR low.`));
        bear.plan.push(plan(canShort ? L.T('Bán khống Test UTAD', 'Short the UTAD test') : L.T('Chốt lời/hạ tỷ trọng tại Test UTAD', 'Take profit at the UTAD test'), res - 0.15 * h, ut - 0.2 * a, ut + 0.6 * a, [sup, sup - h, pnfS[0]]));
      } else {
        bear.thesis.push(L.T('Chưa có UTAD/SOW. Nếu cấu trúc là phân phối, tín hiệu sẽ là: vượt đỉnh thất bại (UT/UTAD) hoặc thủng Ice với khối lượng lớn.',
          'No UTAD/SOW yet. If this is distribution, expect a failed breakout (UT/UTAD) or a heavy-volume break of the Ice.'));
        bear.plan.push(plan(canShort ? L.T('Chờ UTAD/LPSY để bán khống', 'Wait for UTAD/LPSY to short') : L.T('Chờ UTAD để chốt lời', 'Wait for UTAD to take profit'), res - 0.15 * h, res + 0.3 * a, res + 0.25 * h + a, [lv.mid, sup, pnfS[0]]));
      }
      bear.trigger.push(L.T(`Đóng cửa dưới ${P(sup)} với biên độ rộng, khối lượng lớn (SOW – thủng Ice), nhịp hồi sau đó khối lượng thấp không vượt lại ${P(sup + 0.15 * h)} (LPSY).`,
        `Close below ${P(sup)} on wide spread and heavy volume (SOW – Ice break); the next rally is low-volume and fails below ${P(sup + 0.15 * h)} (LPSY).`));
      if (phase !== 'E') bear.trigger.push(L.T(`Hoặc: vượt ${P(res)} rồi đóng cửa quay lại trong TR (UTAD) với khối lượng lớn.`, `Or: a push above ${P(res)} that closes back inside the TR (UTAD) on high volume.`));
      bear.invalid = L.T(`Đóng cửa trên ${P(res + 0.25 * h)} với khối lượng lớn và giữ vững (SOS thật).`, `A close above ${P(res + 0.25 * h)} on heavy volume that holds (genuine SOS).`);

      // ---------- sideways ----------
      side.thesis.push(L.T(`Giá tiếp tục dao động trong biên ${P(sup)} – ${P(res)} (biên độ ${P(h)}). Nguyên nhân (cause) tiếp tục được xây dựng — TR càng dài, hiệu ứng sau này càng lớn.`,
        `Price keeps rotating within ${P(sup)} – ${P(res)} (height ${P(h)}). The cause keeps building — the longer the TR, the larger the eventual effect.`));
      side.plan.push(plan(L.T('Mua vùng hỗ trợ khi có No Supply/Test', 'Buy support on No Supply/Test'), sup, sup + 0.2 * h, sup - a, [lv.mid, res]));
      const sellPlan = plan(canShort ? L.T('Bán vùng kháng cự khi có No Demand/UT', 'Sell resistance on No Demand/UT') : L.T('Chốt lời vùng kháng cự', 'Take profit at resistance'), res - 0.2 * h, res, res + a, [lv.mid, sup]);
      sellPlan.sell = true;
      side.plan.push(sellPlan);
      side.trigger.push(L.T('Các nhịp chạm biên cho thấy khối lượng giảm dần, không có nến cao trào; biên độ nến co hẹp.', 'Touches of the boundaries show shrinking volume, no climactic bars and narrowing spreads.'));
      side.invalid = L.T(`Đóng cửa ngoài TR (trên ${P(res)} hoặc dưới ${P(sup)}) và giữ được ≥ 3 nến.`, `A close outside the TR (above ${P(res)} or below ${P(sup)}) that holds for 3+ bars.`);
    } else {
      const hi = lv.res, lo = lv.sup, h = Math.max(lv.h, a);
      if (r.structure === 'TREND_UP') {
        bull.thesis.push(L.T('Xu hướng tăng (Markup) với đỉnh/đáy cao dần. Mua pullback có khối lượng thấp; cảnh giác PSY/BC khi xuất hiện cao trào.', 'Uptrend (Markup) with higher highs/lows. Buy low-volume pullbacks; watch for PSY/BC climaxes.'));
        bull.plan.push(plan(L.T('Mua pullback', 'Buy pullback'), lo, lo + 0.8 * a, lo - 1.2 * a, [hi, hi + h]));
        bear.thesis.push(L.T('Chỉ xét giảm khi xuất hiện Phase A phân phối: BC khối lượng cực lớn, AR giảm mạnh, ST yếu.', 'Only consider the bear case once a distribution Phase A appears: ultra-volume BC, sharp AR, weak ST.'));
        bear.plan.push(plan(canShort ? L.T('Bán khống sau BC + ST yếu', 'Short after BC + weak ST') : L.T('Chốt lời khi có BC', 'Take profit on a BC'), hi - 0.5 * a, hi + 0.5 * a, hi + 1.5 * a, [lo, lo - h]));
      } else if (r.structure === 'TREND_DOWN') {
        bear.thesis.push(L.T('Xu hướng giảm (Markdown) với đỉnh/đáy thấp dần. Nhịp hồi khối lượng thấp là cơ hội bán (LPSY).', 'Downtrend (Markdown) with lower highs/lows. Low-volume rallies are sell opportunities (LPSY).'));
        bear.plan.push(plan(canShort ? L.T('Bán khống nhịp hồi', 'Short the rally') : L.T('Không mua / hạ tỷ trọng khi hồi', 'Do not buy / reduce on rallies'), hi - 0.8 * a, hi, hi + 1.2 * a, [lo, lo - h]));
        bull.thesis.push(L.T('Chỉ xét tăng khi xuất hiện PS → SC (khối lượng cực lớn) → AR → ST khối lượng thấp: Pha A tích lũy.', 'Only consider the bull case after PS → SC (ultra volume) → AR → low-volume ST: an accumulation Phase A.'));
        bull.plan.push(plan(L.T('Mua ST sau SC', 'Buy the ST after an SC'), lo - 0.5 * a, lo + 0.5 * a, lo - 1.5 * a, [hi, hi + h]));
      } else {
        bull.thesis.push(L.T('Biên đi ngang hẹp, chưa có cao trào. Chờ phá vỡ có khối lượng.', 'Narrow sideways box without a climax. Wait for a breakout on volume.'));
        bull.plan.push(plan(L.T('Mua phá vỡ + pullback', 'Buy breakout + pullback'), hi - 0.2 * a, hi + 0.4 * a, lo - 0.3 * a, [hi + h, hi + 2 * h]));
        bear.thesis.push(L.T('Nếu thủng đáy biên với khối lượng lớn → cung chiếm ưu thế.', 'A heavy-volume break of the box low means supply wins.'));
        bear.plan.push(plan(canShort ? L.T('Bán khống phá vỡ', 'Short the breakdown') : L.T('Thoát hàng khi thủng', 'Exit on breakdown'), lo - 0.4 * a, lo + 0.2 * a, hi + 0.3 * a, [lo - h, lo - 2 * h]));
      }
      side.thesis.push(L.T(`Giá dao động trong ${P(lo)} – ${P(hi)}.`, `Price rotates within ${P(lo)} – ${P(hi)}.`));
      side.plan.push(plan(L.T('Đứng ngoài, chờ cấu trúc', 'Stand aside, wait for structure'), lo, hi, null, []));
      bull.trigger.push(L.T(`Đóng cửa trên ${P(hi)} với khối lượng tăng.`, `Close above ${P(hi)} on rising volume.`));
      bear.trigger.push(L.T(`Đóng cửa dưới ${P(lo)} với khối lượng tăng.`, `Close below ${P(lo)} on rising volume.`));
      side.trigger.push(L.T('Khối lượng giảm dần, biên độ thu hẹp.', 'Volume and spread contract.'));
      bull.invalid = L.T(`Thủng ${P(lo - a)}.`, `Break of ${P(lo - a)}.`);
      bear.invalid = L.T(`Vượt ${P(hi + a)}.`, `Break of ${P(hi + a)}.`);
      side.invalid = L.T('Phá vỡ biên có khối lượng.', 'A breakout on volume.');
    }
    if (!canShort) {
      // without shorting, a "sell" plan is an exit: no stop and no reward/risk
      bear.plan.concat(side.plan.filter(p => p.sell)).forEach(p => { p.stop = null; p.rr = null; });
      bear.note = isVN
        ? L.T('Cổ phiếu cơ sở VN không bán khống được: kịch bản giảm = không mua mới, chốt lời/hạ tỷ trọng. Lưu ý T+2.5 — lệnh cắt lỗ chỉ thực hiện được khi hàng về.', 'VN cash stocks cannot be shorted: bearish = no new buys, take profit / reduce. Mind T+2.5 settlement — stops only work once shares arrive.')
        : L.T('Thị trường Spot không bán khống: kịch bản giảm = đứng ngoài hoặc chốt lời.', 'Spot cannot be shorted: bearish = stay out or take profit.');
    }
    if (isVN) bull.note = L.T('Mua theo lô 100 cổ phiếu, chia 2–3 lần (Spring/Test → SOS → BU). Tránh mua đuổi nến trần; T+2.5 nên đặt cắt lỗ theo giá đóng cửa.', 'Buy in 100-share lots, scale in 2–3 times (Spring/Test → SOS → BU). Avoid chasing limit-up bars; with T+2.5 use closing-price stops.');
    return [bull, side, bear].sort((x, y) => y.prob - x.prob);
  }
})(window.LLW);
