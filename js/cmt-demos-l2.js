/* CMT Level 2 — indicator lab and trend-system tester (live data) */
(function (L) {
  'use strict';
  const C = L.cmt, M = C.math;
  const css = C.css;
  const ld = () => `<span class="spinner"></span>${L.t('loading')}`;
  const ser = (bars, v) => bars.map((b, i) => (v[i] == null || !isFinite(v[i]) ? null : { time: b.t, value: v[i] })).filter(Boolean);

  /* ---------- indicator math ---------- */
  const I = C.ind2 = {};
  I.rsi = (c, n = 14) => { let ag = 0, al = 0; return c.map((x, i) => { if (!i) return null; const d = x - c[i - 1], g = Math.max(0, d), l = Math.max(0, -d); if (i <= n) { ag += g / n; al += l / n; return i < n ? null : 100 - 100 / (1 + ag / (al || 1e-12)); } ag = (ag * (n - 1) + g) / n; al = (al * (n - 1) + l) / n; return 100 - 100 / (1 + ag / (al || 1e-12)); }); };
  I.stoch = (bars, n = 14, k = 3, d = 3) => {
    const raw = bars.map((b, i) => { if (i < n - 1) return null; let hh = -Infinity, ll = Infinity; for (let j = i - n + 1; j <= i; j++) { hh = Math.max(hh, bars[j].h); ll = Math.min(ll, bars[j].l); } return hh > ll ? (b.c - ll) / (hh - ll) * 100 : 50; });
    const sm = (a, p) => a.map((_, i) => { const s = a.slice(Math.max(0, i - p + 1), i + 1); return s.length < p || s.some(v => v == null) ? null : s.reduce((x, y) => x + y, 0) / p; });
    const K = sm(raw, k); return { k: K, d: sm(K, d) };
  };
  I.macd = (c, f = 12, s = 26, g = 9) => { const ef = M.ema(c, f), es = M.ema(c, s), line = c.map((_, i) => (ef[i] == null || es[i] == null ? null : ef[i] - es[i])); const start = line.findIndex(v => v != null); const sig = new Array(c.length).fill(null); if (start >= 0) { const e = M.ema(line.slice(start), g); e.forEach((v, j) => { sig[start + j] = v; }); } return { line, sig, hist: line.map((v, i) => (v == null || sig[i] == null ? null : v - sig[i])) }; };
  I.trix = (c, n = 15) => { const e1 = M.ema(c, n).map((v, i) => v == null ? c[i] : v), e2 = M.ema(e1, n).map((v, i) => v == null ? e1[i] : v), e3 = M.ema(e2, n); return e3.map((v, i) => (i < 3 * n || e3[i - 1] == null ? null : (v / e3[i - 1] - 1) * 100)); };
  I.roc = (c, n = 12) => c.map((x, i) => (i < n ? null : (x / c[i - n] - 1) * 100));
  I.mom = (c, n = 12) => c.map((x, i) => (i < n ? null : x - c[i - n]));
  I.dmi = (bars, n = 14) => {
    let tr = 0, pdm = 0, mdm = 0, adx = null; const P = [], Mi = [], A = [];
    const dxs = [];
    bars.forEach((b, i) => {
      if (!i) { P.push(null); Mi.push(null); A.push(null); return; }
      const p = bars[i - 1], up = b.h - p.h, dn = p.l - b.l;
      const t = Math.max(b.h - b.l, Math.abs(b.h - p.c), Math.abs(b.l - p.c));
      const pd = up > dn && up > 0 ? up : 0, md = dn > up && dn > 0 ? dn : 0;
      if (i <= n) { tr += t; pdm += pd; mdm += md; } else { tr = tr - tr / n + t; pdm = pdm - pdm / n + pd; mdm = mdm - mdm / n + md; }
      if (i < n) { P.push(null); Mi.push(null); A.push(null); return; }
      const pdi = 100 * pdm / tr, mdi = 100 * mdm / tr, dx = 100 * Math.abs(pdi - mdi) / ((pdi + mdi) || 1e-12);
      dxs.push(dx);
      if (dxs.length === n) adx = dxs.reduce((x, y) => x + y, 0) / n; else if (dxs.length > n) adx = (adx * (n - 1) + dx) / n;
      P.push(pdi); Mi.push(mdi); A.push(dxs.length >= n ? adx : null);
    });
    return { pdi: P, mdi: Mi, adx: A };
  };

  /* ---------- oscillator lab ---------- */
  const IND = { macd: 'MACD (12,26,9)', rsi: 'RSI (14)', stoch: 'Stochastic (14,3,3)', trix: 'TRIX (15)', roc: 'ROC (12)', mom: 'Momentum (12)', dmi: 'DMI / ADX (14)' };
  C.demoHtml.oscLab = (def) => C.demoShell('oscLab', C.symControls('vn_stock', 'VNINDEX', '1D', ['1D', '1W', '4H', '1H']) + C.mkSel('d-ind', Object.entries(IND), def || 'macd') + `<button class="btn primary d-go">${L.T('Xem', 'Show')}</button>`,
    L.T('Chỉ báo nằm ở vùng dưới biểu đồ (thang riêng).', 'The indicator is drawn in the lower area (own scale).'));
  C.demoRun.oscLab = box => {
    const out = box.querySelector('.demo-out'), el = box.querySelector('.demo-chart');
    const run = async () => {
      out.innerHTML = ld();
      try {
        const bars = (await C.loadBars(...C.readSym(box))).slice(-400), c = bars.map(b => b.c), kind = box.querySelector('.d-ind').value;
        el.innerHTML = '';
        const ch = C.mkChart(el), s = C.candleSeries(ch);
        s.priceScale().applyOptions({ scaleMargins: { top: 0.04, bottom: 0.38 } });
        s.setData(bars.map(b => ({ time: b.t, open: b.o, high: b.h, low: b.l, close: b.c })));
        const add = (v, color, w, extra) => { const x = ch.addLineSeries(Object.assign({ color, lineWidth: w || 2, priceScaleId: 'ind', priceLineVisible: false, lastValueVisible: false }, extra || {})); x.setData(ser(bars, v)); return x; };
        ch.priceScale('ind').applyOptions({ scaleMargins: { top: 0.66, bottom: 0.02 } });
        const n = bars.length - 1; let msg = '';
        const lvl = (x, vals) => vals.forEach(v => x.createPriceLine({ price: v, color: css('--muted'), lineStyle: 2, lineWidth: 1, axisLabelVisible: false }));
        if (kind === 'macd') {
          const m = I.macd(c); const h = ch.addHistogramSeries({ priceScaleId: 'ind', priceLineVisible: false, lastValueVisible: false });
          h.setData(bars.map((b, i) => (m.hist[i] == null ? null : { time: b.t, value: m.hist[i], color: m.hist[i] >= 0 ? css('--up') + '99' : css('--down') + '99' })).filter(Boolean));
          add(m.line, css('--accent')); add(m.sig, '#5b8def', 1);
          msg = L.T(`MACD ${m.line[n].toFixed(3)} ${m.line[n] > m.sig[n] ? 'trên' : 'dưới'} đường tín hiệu; histogram ${m.hist[n] > m.hist[n - 1] ? 'đang tăng' : 'đang giảm'}; MACD ${m.line[n] > 0 ? 'trên' : 'dưới'} 0 (xu hướng ${m.line[n] > 0 ? 'tăng' : 'giảm'} trung hạn).`, `MACD ${m.line[n].toFixed(3)} is ${m.line[n] > m.sig[n] ? 'above' : 'below'} its signal; histogram ${m.hist[n] > m.hist[n - 1] ? 'rising' : 'falling'}; MACD ${m.line[n] > 0 ? 'above' : 'below'} zero.`);
        } else if (kind === 'rsi') {
          const r = I.rsi(c); lvl(add(r, css('--accent')), [70, 50, 30]);
          msg = L.T(`RSI = ${r[n].toFixed(1)}. Trong xu hướng tăng mạnh RSI thường dao động 40–80; trong xu hướng giảm 20–60 (dịch chuyển vùng).`, `RSI = ${r[n].toFixed(1)}. In strong uptrends RSI tends to range 40–80; in downtrends 20–60 (range shift).`);
        } else if (kind === 'stoch') {
          const st = I.stoch(bars); lvl(add(st.k, css('--accent')), [80, 20]); add(st.d, '#5b8def', 1);
          msg = L.T(`%K ${st.k[n].toFixed(1)}, %D ${st.d[n].toFixed(1)}. Tín hiệu kinh điển: %K cắt %D ở vùng quá mua/quá bán, ưu tiên cùng chiều xu hướng.`, `%K ${st.k[n].toFixed(1)}, %D ${st.d[n].toFixed(1)}. Classic signal: %K crossing %D in overbought/oversold zones, in the trend’s direction.`);
        } else if (kind === 'trix') {
          const t = I.trix(c); const sig = M.ema(t.map(v => v == null ? 0 : v), 9); lvl(add(t, css('--accent')), [0]); add(t.map((v, i) => v == null ? null : sig[i]), '#5b8def', 1);
          msg = L.T(`TRIX ${t[n].toFixed(3)}%: ba lần làm mượt EMA loại bỏ phần lớn nhiễu; cắt qua 0 hoặc cắt đường tín hiệu là tín hiệu.`, `TRIX ${t[n].toFixed(3)}%: triple EMA smoothing removes most noise; zero or signal-line crosses are signals.`);
        } else if (kind === 'roc' || kind === 'mom') {
          const v = kind === 'roc' ? I.roc(c) : I.mom(c); lvl(add(v, css('--accent')), [0]);
          msg = kind === 'roc' ? L.T(`ROC 12 = ${v[n].toFixed(2)}% (tỷ lệ % so với 12 phiên trước).`, `ROC 12 = ${v[n].toFixed(2)}%.`) : L.T(`Momentum 12 = ${L.fmtP(v[n])} (chênh lệch giá tuyệt đối so với 12 phiên trước).`, `Momentum 12 = ${L.fmtP(v[n])} (absolute price difference).`);
        } else {
          const d = I.dmi(bars); add(d.pdi, css('--up'), 1); add(d.mdi, css('--down'), 1); lvl(add(d.adx, css('--accent'), 2), [20, 25, 40]);
          msg = L.T(`+DI ${d.pdi[n].toFixed(1)}, −DI ${d.mdi[n].toFixed(1)}, ADX ${d.adx[n].toFixed(1)} → ${d.adx[n] > 25 ? 'có xu hướng' : d.adx[n] < 20 ? 'không xu hướng (đi ngang)' : 'xu hướng yếu'}${d.adx[n] > 25 ? (d.pdi[n] > d.mdi[n] ? ' tăng' : ' giảm') : ''}. ADX đo <b>độ mạnh</b>, không đo hướng.`, `+DI ${d.pdi[n].toFixed(1)}, −DI ${d.mdi[n].toFixed(1)}, ADX ${d.adx[n].toFixed(1)} → ${d.adx[n] > 25 ? 'trending' : d.adx[n] < 20 ? 'non-trending' : 'weak trend'}. ADX measures <b>strength</b>, not direction.`);
        }
        ch.timeScale().fitContent();
        out.innerHTML = msg;
      } catch (e) { C.err(out, e); }
    };
    box.querySelector('.d-ind').onchange = run;
    C.wire(box, run);
  };

  /* ---------- trend-system tester ---------- */
  C.demoHtml.trendSys = () => `<div class="demo" data-demo="trendSys"><div class="demo-head"><b>🔬 ${L.T('Kiểm định hệ thống theo xu hướng', 'Trend-system tester')}</b>${C.symControls('vn_stock', 'VNINDEX', '1D', ['1D', '1W'])}
    ${C.mkSel('d-sys', [['ma1', L.T('1 đường: giá vs MA', 'Price vs one MA')], ['ma2', L.T('2 đường: MA nhanh/chậm', 'Two MAs')], ['ma3', L.T('3 đường (4-9-18 kiểu)', 'Three MAs (4-9-18 style)')], ['bb', L.T('Phá dải Bollinger', 'Bollinger breakout')]], 'ma2')}
    ${C.num('p1', 10, 'n1', 1)}${C.num('p2', 40, 'n2', 1)}${C.num('p3', 0, 'n3', 1)}
    ${C.mkSel('d-exit', [['rev', L.T('Thoát khi tín hiệu đảo', 'Exit on reverse signal')], ['fast', L.T('Thoát khi giá cắt MA nhanh', 'Exit on fast-MA cross')]], 'rev')}
    ${C.num('cost', 0.15, L.T('Phí %', 'Cost %'), 0.05)}<button class="btn primary d-go">${L.T('Chạy', 'Run')}</button></div><div class="demo-chart"></div><div class="demo-out"></div></div>`;
  C.demoRun.trendSys = box => {
    const out = box.querySelector('.demo-out'), el = box.querySelector('.demo-chart');
    const run = async () => {
      out.innerHTML = ld();
      try {
        const bars = await C.loadBars(...C.readSym(box)), c = bars.map(b => b.c);
        const sys = box.querySelector('.d-sys').value, ex = box.querySelector('.d-exit').value, cost = +box.querySelector('.cost').value / 100;
        const g = q => Math.max(2, Math.round(+box.querySelector(q).value || 0));
        const n1 = g('.p1'), n2 = g('.p2'), n3 = Math.max(2, Math.round(+box.querySelector('.p3').value) || n2 * 2);
        const a = M.sma(c, n1), b = M.sma(c, n2), d = M.sma(c, n3), sd = M.std(c, 20, M.sma(c, 20)), mid = M.sma(c, 20);
        const want = i => {
          if (sys === 'ma1') return a[i] == null ? null : c[i] > a[i];
          if (sys === 'ma2') return b[i] == null ? null : a[i] > b[i];
          if (sys === 'ma3') return d[i] == null ? null : (a[i] > b[i] && b[i] > d[i]) ? true : (a[i] < b[i] && b[i] < d[i]) ? false : 'hold';
          if (mid[i] == null) return null; return c[i] > mid[i] + 2 * sd[i] ? true : c[i] < mid[i] ? false : 'hold';
        };
        let eq = 1, bh = 1, pos = 0, entry = 0, trades = [], peak = 1, mdd = 0; const curve = [], bhc = [], rets = [];
        for (let i = 1; i < bars.length; i++) {
          const r = c[i] / c[i - 1] - 1; bh *= 1 + r;
          let dr = pos ? r : 0;
          let w = want(i);
          if (w === 'hold' || w == null) w = !!pos;
          if (pos && ex === 'fast' && a[i] != null && c[i] < a[i]) w = false;
          if (w !== !!pos) { dr -= cost; if (pos) trades.push(c[i] / entry - 1 - 2 * cost); else entry = c[i]; pos = w ? 1 : 0; }
          eq *= 1 + dr; rets.push(dr); peak = Math.max(peak, eq); mdd = Math.max(mdd, 1 - eq / peak);
          curve.push({ time: bars[i].t, value: eq }); bhc.push({ time: bars[i].t, value: bh });
        }
        el.innerHTML = '';
        const ch = C.mkChart(el, { rightPriceScale: { mode: 1 } });
        ch.addLineSeries({ color: css('--accent'), lineWidth: 2, title: L.T('Hệ thống', 'System') }).setData(curve);
        ch.addLineSeries({ color: css('--muted'), lineWidth: 1, title: L.T('Mua & giữ', 'Buy & hold') }).setData(bhc);
        ch.timeScale().fitContent();
        const wins = trades.filter(x => x > 0), loss = trades.filter(x => x <= 0);
        const gp = wins.reduce((x, y) => x + y, 0), gl = -loss.reduce((x, y) => x + y, 0);
        const yrs = (bars[bars.length - 1].t - bars[0].t) / 31557600, cagr = Math.pow(eq, 1 / Math.max(yrs, 0.1)) - 1;
        const per = rets.length / Math.max(yrs, 0.1), mean = rets.reduce((x, y) => x + y, 0) / rets.length, sdv = Math.sqrt(rets.reduce((x, y) => x + (y - mean) ** 2, 0) / rets.length);
        const neg = rets.filter(x => x < 0), dd = Math.sqrt(neg.reduce((x, y) => x + y * y, 0) / rets.length);
        const P = x => (x * 100).toFixed(1) + '%';
        out.innerHTML = `<table class="tbl"><tbody>
          <tr><td>${L.T('Lợi nhuận / CAGR', 'Return / CAGR')}</td><td><b>${P(eq - 1)}</b> / ${P(cagr)} (${L.T('mua & giữ', 'buy & hold')} ${P(bh - 1)})</td></tr>
          <tr><td>${L.T('Số lệnh · % thắng', 'Trades · % profitable')}</td><td>${trades.length} · ${trades.length ? P(wins.length / trades.length) : '—'}</td></tr>
          <tr><td>Profit factor</td><td>${gl > 0 ? (gp / gl).toFixed(2) : '—'}</td></tr>
          <tr><td>${L.T('Lãi TB / lỗ TB mỗi lệnh', 'Avg win / avg loss')}</td><td>${wins.length ? P(gp / wins.length) : '—'} / ${loss.length ? P(-gl / loss.length) : '—'}</td></tr>
          <tr><td>Max drawdown</td><td class="down">${P(mdd)}</td></tr>
          <tr><td>Sharpe · Sortino (${L.T('năm hoá, rf=0', 'annualised, rf=0')})</td><td>${(mean / (sdv || 1e-12) * Math.sqrt(per)).toFixed(2)} · ${(mean / (dd || 1e-12) * Math.sqrt(per)).toFixed(2)}</td></tr></tbody></table>
          <p class="muted">${L.T('Đổi hệ thống, tham số và quy tắc thoát để thấy: hệ theo xu hướng thường có % thắng thấp nhưng lãi TB lớn hơn lỗ TB nhiều lần.', 'Change system, parameters and exit rule: trend systems usually win less than half the time but with average wins much larger than losses.')}</p>`;
      } catch (e) { C.err(out, e); }
    };
    C.wire(box, run);
  };
})(window.LLW);
