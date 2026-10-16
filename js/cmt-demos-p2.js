/* CMT Level 1 Part II — candlestick figure helper and live demos */
(function (L) {
  'use strict';
  const C = L.cmt, F = C.fig, I = L.ind;
  const css = C.css;
  const ld = () => `<span class="spinner"></span>${L.t('loading')}`;

  /* ---------- figure: hand-made candles  bars = [[o,h,l,c], ...] on a 0..100 price grid ---------- */
  F.candles = function (o) {
    const W = o.w || 320, H = o.h || 200, n = o.bars.length, pad = 18;
    const cw = (W - 2 * pad) / n, y = v => 14 + (100 - v) / 100 * (H - 42);
    const out = [`<svg viewBox="0 0 ${W} ${H}" class="schem cfig">`];
    (o.hl || []).forEach(h => out.push(`<line x1="${pad}" y1="${y(h[0])}" x2="${W - pad}" y2="${y(h[0])}" class="${h[1] || 's-res'}"/>`));
    o.bars.forEach((b, k) => {
      const cx = pad + cw * (k + 0.5), up = b[3] >= b[0], bw = Math.min(18, cw * 0.55);
      const top = y(Math.max(b[0], b[3])), bot = y(Math.min(b[0], b[3]));
      out.push(`<line x1="${cx}" y1="${y(b[1])}" x2="${cx}" y2="${y(b[2])}" class="a-wick"/>`);
      out.push(`<rect x="${cx - bw / 2}" y="${top}" width="${bw}" height="${Math.max(1.5, bot - top)}" class="${up ? 'a-up' : 'a-dn'}"/>`);
    });
    (o.labels || []).forEach(l => out.push(`<text x="${pad + cw * (l[0] + 0.5)}" y="${l[2] === 'b' ? H - 8 : 12}" text-anchor="middle" class="s-label">${l[1]}</text>`));
    out.push('</svg>');
    return `<figure class="schem-fig">${out.join('')}${o.caption ? `<figcaption>${o.caption}</figcaption>` : ''}</figure>`;
  };

  /* ---------- indicator math used by demos ---------- */
  const sma = (a, n) => a.map((_, i) => { if (i < n - 1) return null; let s = 0; for (let j = i - n + 1; j <= i; j++) s += a[j]; return s / n; });
  const ema = (a, n) => { const k = 2 / (n + 1); let e = null; return a.map((x, i) => { e = e == null ? x : x * k + e * (1 - k); return i < n - 1 ? null : e; }); };
  const std = (a, n, m) => a.map((_, i) => { if (m[i] == null) return null; let s = 0; for (let j = i - n + 1; j <= i; j++) s += (a[j] - m[i]) ** 2; return Math.sqrt(s / n); });
  C.math = { sma, ema, std };
  const ser = (bars, vals) => bars.map((b, i) => (vals[i] == null ? null : { time: b.t, value: vals[i] })).filter(Boolean);

  /* ---------- demo shells ---------- */
  const H = C.demoHtml, R = C.demoRun;
  const go = () => `<button class="btn primary d-go">${L.T('Xem', 'Show')}</button>`;

  H.srZones = () => C.demoShell('srZones', C.symControls('vn_stock', 'HPG', '1D') + go(),
    L.T('Máy gom các đỉnh/đáy gần nhau thành <b>vùng</b> hỗ trợ/kháng cự; vùng càng nhiều lần chạm càng mạnh.', 'Nearby swing points are clustered into support/resistance <b>zones</b>; more touches = stronger.'));
  R.srZones = box => {
    const out = box.querySelector('.demo-out'), el = box.querySelector('.demo-chart');
    C.wire(box, async () => {
      out.innerHTML = ld();
      try {
        const bars = await C.loadBars(...C.readSym(box));
        const n = bars.length, from = Math.max(0, n - 300), last = bars[n - 1];
        const piv = I.zigzag(bars, 2).filter(p => p.i >= from && !p.provisional);
        const tol = 0.6 * last.atr, pts = piv.map(p => p.p).sort((a, b) => a - b);
        const zones = [];
        for (const p of pts) { const z = zones[zones.length - 1]; if (z && p - z.hi <= tol) { z.hi = p; z.n++; z.sum += p; } else zones.push({ lo: p, hi: p, n: 1, sum: p }); }
        const strong = zones.filter(z => z.n >= 2).sort((a, b) => b.n - a.n).slice(0, 6);
        el.innerHTML = '';
        const ch = C.mkChart(el), s = C.candleSeries(ch);
        s.setData(bars.slice(from).map(b => ({ time: b.t, open: b.o, high: b.h, low: b.l, close: b.c })));
        strong.forEach(z => {
          const mid = z.sum / z.n, isSup = mid < last.c;
          s.createPriceLine({ price: mid, color: isSup ? css('--up') : css('--down'), lineWidth: Math.min(4, z.n), lineStyle: 2, axisLabelVisible: true, title: (isSup ? 'S' : 'R') + '×' + z.n });
        });
        ch.timeScale().fitContent();
        const below = strong.filter(z => z.sum / z.n < last.c).sort((a, b) => b.sum / b.n - a.sum / a.n)[0];
        const above = strong.filter(z => z.sum / z.n >= last.c).sort((a, b) => a.sum / a.n - b.sum / b.n)[0];
        out.innerHTML = L.T(`Giá hiện tại ${L.fmtP(last.c)}. Hỗ trợ gần nhất: <b class="up">${below ? L.fmtP(below.sum / below.n) + ' (' + below.n + ' lần chạm)' : '—'}</b>; kháng cự gần nhất: <b class="down">${above ? L.fmtP(above.sum / above.n) + ' (' + above.n + ' lần chạm)' : '—'}</b>. Hãy quan sát các vùng từng là kháng cự nay đóng vai hỗ trợ (đổi vai).`,
          `Price ${L.fmtP(last.c)}. Nearest support: <b class="up">${below ? L.fmtP(below.sum / below.n) + ' (' + below.n + ' touches)' : '—'}</b>; nearest resistance: <b class="down">${above ? L.fmtP(above.sum / above.n) + ' (' + above.n + ' touches)' : '—'}</b>. Look for old resistance acting as support (polarity).`);
      } catch (e) { C.err(out, e); }
    });
  };

  H.fibo = () => C.demoShell('fibo', C.symControls('bn_spot', 'BTCUSDT', '1D') + go(),
    L.T('Các mức thoái lui được tính trên nhịp sóng lớn gần nhất đã hoàn tất (zigzag 3 ATR).', 'Retracement levels on the latest completed major swing (3-ATR zigzag).'));
  R.fibo = box => {
    const out = box.querySelector('.demo-out'), el = box.querySelector('.demo-chart');
    C.wire(box, async () => {
      out.innerHTML = ld();
      try {
        const bars = await C.loadBars(...C.readSym(box));
        const piv = I.zigzag(bars, 3).filter(p => !p.provisional);
        if (piv.length < 2) throw new Error(L.T('Chưa đủ sóng', 'Not enough swings'));
        const a = piv[piv.length - 2], b = piv[piv.length - 1], up = b.p > a.p, rng = b.p - a.p;
        el.innerHTML = '';
        const ch = C.mkChart(el), s = C.candleSeries(ch);
        const from = Math.max(0, a.i - 40);
        s.setData(bars.slice(from).map(x => ({ time: x.t, open: x.o, high: x.h, low: x.l, close: x.c })));
        const lv = [0, 0.236, 0.382, 0.5, 0.618, 0.786, 1];
        lv.forEach(f => s.createPriceLine({ price: b.p - rng * f, color: f === 0.5 || f === 0.382 || f === 0.618 ? css('--accent') : css('--muted'), lineWidth: 1, lineStyle: 2, axisLabelVisible: true, title: (f * 100).toFixed(1) + '%' }));
        s.setMarkers([{ time: bars[a.i].t, position: up ? 'belowBar' : 'aboveBar', color: css('--accent'), shape: 'circle', text: 'A' }, { time: bars[b.i].t, position: up ? 'aboveBar' : 'belowBar', color: css('--accent'), shape: 'circle', text: 'B' }]);
        ch.timeScale().fitContent();
        const c = bars[bars.length - 1].c, ret = (b.p - c) / rng;
        out.innerHTML = L.T(`Nhịp ${up ? 'TĂNG' : 'GIẢM'} từ ${L.fmtP(a.p)} (A) đến ${L.fmtP(b.p)} (B). Giá hiện tại đã thoái lui khoảng <b>${(ret * 100).toFixed(1)}%</b> nhịp này. Vùng 38.2%–61.8% (đặc biệt 50%) là nơi thường được theo dõi để tìm điểm vào theo xu hướng.`,
          `${up ? 'Up' : 'Down'}swing from ${L.fmtP(a.p)} (A) to ${L.fmtP(b.p)} (B). Price has retraced about <b>${(ret * 100).toFixed(1)}%</b>. The 38.2–61.8% zone (especially 50%) is watched for with-trend entries.`);
      } catch (e) { C.err(out, e); }
    });
  };

  H.maDemo = () => C.demoShell('maDemo', C.symControls('vn_stock', 'VNINDEX', '1D') +
    C.mkSel('d-kind', [['sma', 'SMA'], ['ema', 'EMA']], 'sma') + C.mkSel('d-f', [['10', '10'], ['20', '20'], ['50', '50']], '50') + C.mkSel('d-s', [['50', '50'], ['100', '100'], ['200', '200']], '200') +
    `<label class="chk"><input type="checkbox" class="d-bb"> Bollinger (20, 2)</label>` + go(),
    L.T('Mũi tên ▲ = giao cắt vàng (đường nhanh cắt lên đường chậm), ▼ = giao cắt tử thần.', '▲ = golden cross (fast above slow), ▼ = death cross.'));
  R.maDemo = box => {
    const out = box.querySelector('.demo-out'), el = box.querySelector('.demo-chart');
    const run = async () => {
      out.innerHTML = ld();
      try {
        const bars = await C.loadBars(...C.readSym(box));
        const kind = box.querySelector('.d-kind').value, nf = +box.querySelector('.d-f').value, ns = +box.querySelector('.d-s').value;
        const cl = bars.map(b => b.c), fn = kind === 'ema' ? ema : sma;
        const f = fn(cl, nf), s2 = fn(cl, ns);
        el.innerHTML = '';
        const ch = C.mkChart(el), s = C.candleSeries(ch);
        s.setData(bars.map(b => ({ time: b.t, open: b.o, high: b.h, low: b.l, close: b.c })));
        ch.addLineSeries({ color: css('--accent'), lineWidth: 2, priceLineVisible: false, lastValueVisible: false }).setData(ser(bars, f));
        ch.addLineSeries({ color: '#5b8def', lineWidth: 2, priceLineVisible: false, lastValueVisible: false }).setData(ser(bars, s2));
        if (box.querySelector('.d-bb').checked) {
          const m = sma(cl, 20), sd = std(cl, 20, m);
          [2, -2].forEach(k => ch.addLineSeries({ color: css('--muted'), lineWidth: 1, lineStyle: 2, priceLineVisible: false, lastValueVisible: false }).setData(ser(bars, m.map((x, i) => x == null ? null : x + k * sd[i]))));
        }
        const mk = []; let lastX = null;
        for (let i = 1; i < bars.length; i++) {
          if (f[i] == null || s2[i] == null || f[i - 1] == null || s2[i - 1] == null) continue;
          if (f[i - 1] <= s2[i - 1] && f[i] > s2[i]) { mk.push({ time: bars[i].t, position: 'belowBar', color: css('--up'), shape: 'arrowUp', text: 'GC' }); lastX = { up: true, i }; }
          if (f[i - 1] >= s2[i - 1] && f[i] < s2[i]) { mk.push({ time: bars[i].t, position: 'aboveBar', color: css('--down'), shape: 'arrowDown', text: 'DC' }); lastX = { up: false, i }; }
        }
        s.setMarkers(mk);
        ch.timeScale().fitContent();
        const n = bars.length - 1, slope = s2[n] != null && s2[n - 5] != null ? (s2[n] - s2[n - 5]) / s2[n - 5] * 100 : null;
        out.innerHTML = L.T(`${mk.length} lần giao cắt trong dữ liệu. Giao cắt gần nhất: <b>${lastX ? (lastX.up ? 'giao cắt vàng' : 'giao cắt tử thần') + ' ' + L.fmtTime(bars[lastX.i].t, '1D') : '—'}</b>. Giá ${cl[n] > s2[n] ? 'trên' : 'dưới'} ${kind.toUpperCase()}${ns}; độ dốc ${kind.toUpperCase()}${ns} (5 nến) ${slope == null ? '—' : slope.toFixed(2) + '%'}. Đếm xem bao nhiêu giao cắt là tín hiệu sai khi thị trường đi ngang.`,
          `${mk.length} crossovers. Latest: <b>${lastX ? (lastX.up ? 'golden cross' : 'death cross') + ' ' + L.fmtTime(bars[lastX.i].t, '1D') : '—'}</b>. Price is ${cl[n] > s2[n] ? 'above' : 'below'} ${kind.toUpperCase()}${ns}; 5-bar slope ${slope == null ? '—' : slope.toFixed(2) + '%'}. Count how many crosses whipsawed in sideways periods.`);
      } catch (e) { C.err(out, e); }
    };
    ['.d-kind', '.d-f', '.d-s', '.d-bb'].forEach(q => { box.querySelector(q).onchange = run; });
    C.wire(box, run);
  };

  H.shortPat = () => C.demoShell('shortPat', C.symControls('bn_spot', 'ETHUSDT', '1D') + go(),
    L.T('GU/GD = gap tăng/giảm · IB = inside bar · OB = outside bar · NR7 = biên độ hẹp nhất 7 nến · KR = key reversal.', 'GU/GD = gap up/down · IB = inside bar · OB = outside bar · NR7 = narrowest of 7 · KR = key reversal.'));
  R.shortPat = box => {
    const out = box.querySelector('.demo-out'), el = box.querySelector('.demo-chart');
    C.wire(box, async () => {
      out.innerHTML = ld();
      try {
        const all = await C.loadBars(...C.readSym(box));
        const bars = all.slice(-160), mk = [], cnt = {};
        const add = (b, pos, color, text) => { mk.push({ time: b.t, position: pos, color, shape: 'circle', text }); cnt[text] = (cnt[text] || 0) + 1; };
        for (let i = 7; i < bars.length; i++) {
          const b = bars[i], p = bars[i - 1];
          if (b.l > p.h) add(b, 'belowBar', css('--up'), 'GU');
          if (b.h < p.l) add(b, 'aboveBar', css('--down'), 'GD');
          if (b.h < p.h && b.l > p.l) add(b, 'aboveBar', css('--muted'), 'IB');
          if (b.h > p.h && b.l < p.l) add(b, 'aboveBar', css('--accent'), 'OB');
          const r = b.h - b.l; let nr = true; for (let j = i - 6; j < i; j++) if (bars[j].h - bars[j].l <= r) nr = false;
          if (nr) add(b, 'belowBar', css('--muted'), 'NR7');
          const hh = Math.max(...bars.slice(i - 10, i).map(x => x.h)), ll = Math.min(...bars.slice(i - 10, i).map(x => x.l));
          if (b.h > hh && b.c < p.c) add(b, 'aboveBar', css('--down'), 'KR');
          if (b.l < ll && b.c > p.c) add(b, 'belowBar', css('--up'), 'KR');
        }
        el.innerHTML = '';
        const ch = C.mkChart(el), s = C.candleSeries(ch);
        s.setData(bars.map(b => ({ time: b.t, open: b.o, high: b.h, low: b.l, close: b.c })));
        s.setMarkers(mk.sort((a, b) => a.time - b.time));
        ch.timeScale().fitContent();
        out.innerHTML = L.T('Đếm trong 160 nến gần nhất: ', 'Counts in the last 160 bars: ') + Object.entries(cnt).map(([k, v]) => `<b>${k}</b> ${v}`).join(' · ') + L.T('. Lưu ý: mẫu hình ngắn hạn chỉ có ý nghĩa khi đặt trong bối cảnh xu hướng và vị trí hỗ trợ/kháng cự.', '. Short-term patterns only matter in the context of trend and support/resistance.');
      } catch (e) { C.err(out, e); }
    });
  };

  H.volConfirm = () => C.demoShell('volConfirm', C.symControls('vn_stock', 'FPT', '1D') + go(),
    L.T('Đường vàng = OBV, đường xanh = Accumulation/Distribution (thang riêng phía dưới).', 'Gold = OBV, blue = Accumulation/Distribution (separate lower scale).'));
  R.volConfirm = box => {
    const out = box.querySelector('.demo-out'), el = box.querySelector('.demo-chart');
    C.wire(box, async () => {
      out.innerHTML = ld();
      try {
        const bars = (await C.loadBars(...C.readSym(box))).slice(-300);
        let obv = 0, ad = 0;
        const O = [], A = [];
        bars.forEach((b, i) => {
          if (i > 0) obv += b.c > bars[i - 1].c ? b.v : b.c < bars[i - 1].c ? -b.v : 0;
          const r = b.h - b.l; ad += r > 0 ? ((b.c - b.l) - (b.h - b.c)) / r * b.v : 0;
          O.push(obv); A.push(ad);
        });
        el.innerHTML = '';
        const ch = C.mkChart(el), s = C.candleSeries(ch);
        s.priceScale().applyOptions({ scaleMargins: { top: 0.05, bottom: 0.4 } });
        s.setData(bars.map(b => ({ time: b.t, open: b.o, high: b.h, low: b.l, close: b.c })));
        const o = ch.addLineSeries({ color: css('--accent'), lineWidth: 2, priceScaleId: 'obv', priceLineVisible: false, lastValueVisible: false });
        ch.priceScale('obv').applyOptions({ scaleMargins: { top: 0.65, bottom: 0 } });
        o.setData(bars.map((b, i) => ({ time: b.t, value: O[i] })));
        const a = ch.addLineSeries({ color: '#5b8def', lineWidth: 2, priceScaleId: 'ad', priceLineVisible: false, lastValueVisible: false });
        ch.priceScale('ad').applyOptions({ scaleMargins: { top: 0.65, bottom: 0 }, visible: false });
        a.setData(bars.map((b, i) => ({ time: b.t, value: A[i] })));
        ch.timeScale().fitContent();
        const piv = I.zigzag(bars, 2.5).filter(p => p.type === 'H' && !p.provisional).slice(-2);
        let msg = L.T('Chưa đủ hai đỉnh để so sánh.', 'Not enough peaks to compare.');
        if (piv.length === 2) {
          const pUp = piv[1].p > piv[0].p, oUp = O[piv[1].i] > O[piv[0].i];
          msg = pUp === oUp ? L.T(`Hai đỉnh gần nhất: giá ${pUp ? 'cao hơn' : 'thấp hơn'} và OBV cũng ${oUp ? 'cao hơn' : 'thấp hơn'} → <b>khối lượng XÁC NHẬN giá</b>.`, `Last two peaks: price ${pUp ? 'higher' : 'lower'} and OBV ${oUp ? 'higher' : 'lower'} → <b>volume CONFIRMS price</b>.`)
            : L.T(`Hai đỉnh gần nhất: giá ${pUp ? 'cao hơn' : 'thấp hơn'} nhưng OBV ${oUp ? 'cao hơn' : 'thấp hơn'} → <b>PHÂN KỲ</b>: khối lượng không xác nhận, cảnh báo xu hướng suy yếu.`, `Last two peaks: price ${pUp ? 'higher' : 'lower'} but OBV ${oUp ? 'higher' : 'lower'} → <b>DIVERGENCE</b>: volume does not confirm.`);
        }
        out.innerHTML = msg;
      } catch (e) { C.err(out, e); }
    });
  };

  /* candle pattern scanner */
  function candlePats(bars, i) {
    const b = bars[i], p = bars[i - 1], q = bars[i - 2];
    const body = x => Math.abs(x.c - x.o), rng = x => x.h - x.l || 1e-9, up = x => x.c > x.o, dn = x => x.c < x.o;
    const trend = (bars[i - 1].c - bars[Math.max(0, i - 8)].c) / b.atr; // context before the pattern
    const lowerSh = Math.min(b.o, b.c) - b.l, upperSh = b.h - Math.max(b.o, b.c);
    const res = [];
    if (body(b) <= 0.1 * rng(b)) res.push(['Doji', 0]);
    else if (lowerSh >= 2 * body(b) && upperSh <= 0.3 * body(b) + 0.05 * rng(b)) res.push([trend < -1.5 ? 'Hammer' : trend > 1.5 ? 'Hanging man' : '', trend < -1.5 ? 1 : trend > 1.5 ? -1 : 0]);
    else if (upperSh >= 2 * body(b) && lowerSh <= 0.3 * body(b) + 0.05 * rng(b)) res.push([trend > 1.5 ? 'Shooting star' : trend < -1.5 ? 'Inverted hammer' : '', trend > 1.5 ? -1 : trend < -1.5 ? 1 : 0]);
    if (up(b) && dn(p) && b.c >= p.o && b.o <= p.c && body(b) > body(p) && trend < 0) res.push(['Bull engulfing', 1]);
    if (dn(b) && up(p) && b.o >= p.c && b.c <= p.o && body(b) > body(p) && trend > 0) res.push(['Bear engulfing', -1]);
    if (dn(p) && up(b) && b.o < p.c && b.c > (p.o + p.c) / 2 && b.c < p.o && trend < 0) res.push(['Piercing', 1]);
    if (up(p) && dn(b) && b.o > p.c && b.c < (p.o + p.c) / 2 && b.c > p.o && trend > 0) res.push(['Dark cloud', -1]);
    if (dn(q) && body(q) > 0.6 * rng(q) && body(p) < 0.3 * body(q) && up(b) && b.c > (q.o + q.c) / 2 && trend < -1) res.push(['Morning star', 1]);
    if (up(q) && body(q) > 0.6 * rng(q) && body(p) < 0.3 * body(q) && dn(b) && b.c < (q.o + q.c) / 2 && trend > 1) res.push(['Evening star', -1]);
    return res.filter(r => r[0]);
  }
  H.candles = () => C.demoShell('candles', C.symControls('vn_stock', 'HPG', '1D') + go(),
    L.T('Máy quét mẫu nến kèm điều kiện bối cảnh (xu hướng 8 nến trước đó). Ký hiệu: ▲ đảo chiều tăng, ▼ đảo chiều giảm, ● trung tính.', 'Pattern scan with trend context (prior 8 bars). ▲ bullish reversal, ▼ bearish, ● neutral.'));
  R.candles = box => {
    const out = box.querySelector('.demo-out'), el = box.querySelector('.demo-chart');
    C.wire(box, async () => {
      out.innerHTML = ld();
      try {
        const bars = (await C.loadBars(...C.readSym(box))).slice(-150), mk = [], cnt = {};
        for (let i = 9; i < bars.length; i++) candlePats(bars, i).forEach(([nm, bias]) => {
          mk.push({ time: bars[i].t, position: bias > 0 ? 'belowBar' : 'aboveBar', color: bias > 0 ? css('--up') : bias < 0 ? css('--down') : css('--muted'), shape: bias > 0 ? 'arrowUp' : bias < 0 ? 'arrowDown' : 'circle', text: nm });
          cnt[nm] = (cnt[nm] || 0) + 1;
        });
        el.innerHTML = '';
        const ch = C.mkChart(el), s = C.candleSeries(ch);
        s.setData(bars.map(b => ({ time: b.t, open: b.o, high: b.h, low: b.l, close: b.c })));
        s.setMarkers(mk);
        ch.timeScale().fitContent();
        out.innerHTML = L.T('Trong 150 nến: ', 'In 150 bars: ') + (Object.entries(cnt).map(([k, v]) => `<b>${k}</b> ${v}`).join(' · ') || '—') + L.T('. Hãy kiểm tra: bao nhiêu mẫu xuất hiện tại vùng hỗ trợ/kháng cự và được nến sau xác nhận?', '. Check: how many appeared at support/resistance and were confirmed by the next bar?');
      } catch (e) { C.err(out, e); }
    });
  };

  /* point & figure */
  function pnf(bars, box, rev) {
    const cols = []; let col = null;
    const idx = p => Math.floor(p / box);
    for (const b of bars) {
      const k = idx(b.c);
      if (!col) { col = { dir: 0, lo: k, hi: k }; cols.push(col); continue; }
      if (col.dir >= 0 && k > col.hi) { col.hi = k; if (col.dir === 0) col.dir = 1; }
      else if (col.dir <= 0 && k < col.lo) { col.lo = k; if (col.dir === 0) col.dir = -1; }
      else if (col.dir === 1 && k <= col.hi - rev) { col = { dir: -1, hi: col.hi - 1, lo: k }; cols.push(col); }
      else if (col.dir === -1 && k >= col.lo + rev) { col = { dir: 1, lo: col.lo + 1, hi: k }; cols.push(col); }
    }
    return cols.filter(c => c.dir !== 0);
  }
  H.pnf = () => C.demoShell('pnf', C.symControls('vn_stock', 'VNINDEX', '1D', ['1D', '1W', '4H']) +
    C.mkSel('d-box', [['0.01', L.T('Ô = 1% giá', 'Box = 1%')], ['0.02', L.T('Ô = 2% giá', 'Box = 2%')], ['atr', L.T('Ô = 1 ATR', 'Box = 1 ATR')]], '0.01') +
    C.mkSel('d-rev', [['3', L.T('Đảo chiều 3 ô', '3-box reversal')], ['1', L.T('Đảo chiều 1 ô', '1-box reversal')]], '3') + go(),
    L.T('Biểu đồ P&F dựng từ giá đóng cửa. X = cột tăng, O = cột giảm; trục ngang không phải thời gian.', 'P&F built from closes. X = rising column, O = falling; the horizontal axis is not time.'));
  R.pnf = box => {
    const out = box.querySelector('.demo-out'), el = box.querySelector('.demo-chart');
    const run = async () => {
      out.innerHTML = ld();
      try {
        const bars = await C.loadBars(...C.readSym(box));
        const last = bars[bars.length - 1], bsel = box.querySelector('.d-box').value, rev = +box.querySelector('.d-rev').value;
        const boxSize = bsel === 'atr' ? last.atr : +bsel * last.c;
        const cols = pnf(bars, boxSize, rev).slice(-60);
        const lo = Math.min(...cols.map(c => c.lo)), hi = Math.max(...cols.map(c => c.hi)), rows = hi - lo + 1;
        const cs = 13, Wd = cols.length * cs + 70, Hd = rows * cs + 10;
        const g = [`<svg viewBox="0 0 ${Wd} ${Hd}" class="pnf-svg" style="width:${Math.max(Wd, 300)}px;height:${Hd}px">`];
        for (let r = 0; r < rows; r += Math.max(1, Math.round(rows / 12))) { const yy = Hd - 5 - (r + 0.5) * cs; g.push(`<text x="${Wd - 66}" y="${yy + 4}" class="s-small">${L.fmtP((lo + r) * boxSize)}</text>`); }
        cols.forEach((c, k) => {
          for (let r = c.lo; r <= c.hi; r++) {
            const cx = k * cs + cs / 2, cy = Hd - 5 - (r - lo + 0.5) * cs, d = cs * 0.35;
            g.push(c.dir > 0 ? `<path d="M${cx - d} ${cy - d}L${cx + d} ${cy + d}M${cx + d} ${cy - d}L${cx - d} ${cy + d}" class="pnf-x"/>` : `<circle cx="${cx}" cy="${cy}" r="${d}" class="pnf-o"/>`);
          }
        });
        g.push('</svg>');
        el.innerHTML = `<div class="pnf-wrap">${g.join('')}</div>`;
        const wrap = el.querySelector('.pnf-wrap'); wrap.scrollLeft = wrap.scrollWidth;
        const c = cols[cols.length - 1], prevSame = cols.slice(0, -1).filter(x => x.dir === c.dir).slice(-2);
        let sig = L.T('Chưa có tín hiệu phá vỡ ở cột hiện tại.', 'No breakout in the current column.');
        if (c.dir > 0 && prevSame[1] && c.hi > prevSame[1].hi) sig = prevSame[0] && prevSame[0].hi === prevSame[1].hi ? L.T('<b class="up">Phá vỡ đỉnh ba (Triple top breakout)</b> — tín hiệu mua mạnh.', '<b class="up">Triple top breakout</b> — strong buy.') : L.T('<b class="up">Phá vỡ đỉnh đôi (Double top breakout)</b> — tín hiệu mua.', '<b class="up">Double top breakout</b> — buy signal.');
        if (c.dir < 0 && prevSame[1] && c.lo < prevSame[1].lo) sig = prevSame[0] && prevSame[0].lo === prevSame[1].lo ? L.T('<b class="down">Phá vỡ đáy ba (Triple bottom breakdown)</b> — tín hiệu bán mạnh.', '<b class="down">Triple bottom breakdown</b> — strong sell.') : L.T('<b class="down">Phá vỡ đáy đôi (Double bottom breakdown)</b> — tín hiệu bán.', '<b class="down">Double bottom breakdown</b> — sell signal.');
        out.innerHTML = L.T(`Ô = ${L.fmtP(boxSize)}, đảo chiều ${rev} ô, ${cols.length} cột gần nhất (từ ${bars.length} nến). Cột hiện tại: ${c.dir > 0 ? 'X (tăng)' : 'O (giảm)'}. `, `Box ${L.fmtP(boxSize)}, ${rev}-box reversal, last ${cols.length} columns (from ${bars.length} bars). Current column: ${c.dir > 0 ? 'X' : 'O'}. `) + sig;
      } catch (e) { C.err(out, e); }
    };
    box.querySelector('.d-box').onchange = run; box.querySelector('.d-rev').onchange = run;
    C.wire(box, run);
  };
})(window.LLW);
