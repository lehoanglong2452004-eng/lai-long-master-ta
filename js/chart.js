/* Chart rendering with TradingView Lightweight Charts v4 + Wyckoff overlays */
(function (L) {
  'use strict';
  const C = L.chart = {};
  let chart = null, candle = null, vol = null, lines = [], last = null, layer = null, wrap = null;

  const css = name => getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  const shift = (t, tf) => (L.isIntraday(tf) ? t - new Date(t * 1000).getTimezoneOffset() * 60 : t);

  function themeOpts() {
    return {
      layout: { background: { type: 'solid', color: css('--panel') }, textColor: css('--muted'), fontFamily: "'Be Vietnam Pro', system-ui, sans-serif" },
      grid: { vertLines: { color: css('--grid') }, horzLines: { color: css('--grid') } },
      rightPriceScale: { borderColor: css('--line') },
      timeScale: { borderColor: css('--line'), timeVisible: true, secondsVisible: false, rightOffset: 6 },
      crosshair: { mode: 0 }
    };
  }

  C.init = function (el) {
    wrap = el;
    const host = document.createElement('div');
    host.className = 'chart-host';
    wrap.appendChild(host);
    layer = document.createElement('div');
    layer.className = 'phase-layer';
    wrap.appendChild(layer);
    chart = LightweightCharts.createChart(host, Object.assign({ autoSize: true }, themeOpts()));
    candle = chart.addCandlestickSeries({
      upColor: css('--up'), downColor: css('--down'), borderVisible: false, wickUpColor: css('--up'), wickDownColor: css('--down')
    });
    candle.priceScale().applyOptions({ scaleMargins: { top: 0.06, bottom: 0.26 } });
    vol = chart.addHistogramSeries({ priceFormat: { type: 'volume' }, priceScaleId: 'vol', lastValueVisible: false, priceLineVisible: false });
    chart.priceScale('vol').applyOptions({ scaleMargins: { top: 0.8, bottom: 0 } });
    chart.timeScale().subscribeVisibleLogicalRangeChange(drawPhases);
    new ResizeObserver(() => drawPhases()).observe(wrap);
  };

  C.applyTheme = function () {
    if (!chart) return;
    chart.applyOptions(themeOpts());
    candle.applyOptions({ upColor: css('--up'), downColor: css('--down'), wickUpColor: css('--up'), wickDownColor: css('--down') });
    if (last) C.render(last.r, last.opts);
  };

  const PH_COLORS = { A: '--ph-a', B: '--ph-b', C: '--ph-c', D: '--ph-d', E: '--ph-e' };

  function drawPhases() {
    if (!layer) return;
    layer.innerHTML = '';
    if (!last || !last.opts.phases || !last.r.segments) return;
    const ts = chart.timeScale();
    const w = wrap.clientWidth - chart.priceScale('right').width();
    for (const s of last.r.segments) {
      let x1 = ts.logicalToCoordinate(s.from), x2 = ts.logicalToCoordinate(s.to);
      if (x1 == null || x2 == null) continue;
      x1 = Math.max(0, x1); x2 = Math.min(w, x2);
      if (x2 - x1 < 2) continue;
      const d = document.createElement('div');
      d.className = 'phase-band';
      d.style.left = x1 + 'px';
      d.style.width = (x2 - x1) + 'px';
      d.style.background = css(PH_COLORS[s.phase]);
      d.innerHTML = '<span>' + s.phase + '</span>';
      layer.appendChild(d);
    }
  }

  C.render = function (r, opts) {
    last = { r, opts };
    const tf = r.tf;
    const bars = r.bars;
    const up = css('--up'), dn = css('--down'), gold = css('--accent');
    candle.setData(bars.map(b => ({ time: shift(b.t, tf), open: b.o, high: b.h, low: b.l, close: b.c })));
    const climaxSet = new Set();
    r.sig.forEach((s, i) => { if (s.some(c => c === 'SC_BAR' || c === 'BC_BAR' || c === 'STOP_VOL')) climaxSet.add(i); });
    vol.setData(bars.map((b, i) => ({
      time: shift(b.t, tf), value: b.v,
      color: climaxSet.has(i) ? gold : (b.c >= b.o ? up + '88' : dn + '88')
    })));
    candle.applyOptions({ priceFormat: { type: 'price', precision: L.decimals(bars[bars.length - 1].c), minMove: Math.pow(10, -L.decimals(bars[bars.length - 1].c)) } });

    // markers
    const mk = [];
    if (opts.events && r.events) {
      for (const e of r.events) {
        const b = bars[e.i];
        const def = L.wy.EVT[e.code];
        const above = Math.abs(e.price - b.h) <= Math.abs(e.price - b.l);
        mk.push({ time: shift(b.t, tf), position: above ? 'aboveBar' : 'belowBar', color: def.b > 0 ? up : def.b < 0 ? dn : gold, shape: above ? 'arrowDown' : 'arrowUp', text: def.s });
      }
    }
    if (opts.vsa) {
      // older bars: only the stronger signals; the last 40 bars: everything (keeps the chart readable)
      const from = Math.max(0, bars.length - 400), recent = bars.length - 40;
      for (let i = from; i < bars.length; i++) {
        for (const c of r.sig[i]) {
          const d = L.vsa.SIGNALS[c];
          if (i < recent && d.w < 1.5) continue;
          mk.push({ time: shift(bars[i].t, tf), position: d.bias > 0 ? 'belowBar' : 'aboveBar', color: d.bias > 0 ? up : dn, shape: 'circle', text: d.short, size: 0.6 });
        }
      }
    }
    mk.sort((a, b) => a.time - b.time);
    candle.setMarkers(mk);

    // levels
    lines.forEach(l => candle.removePriceLine(l));
    lines = [];
    const lv = r.levels;
    if (lv) {
      const add = (price, color, title, style) => { if (price != null && isFinite(price)) lines.push(candle.createPriceLine({ price, color, lineWidth: 1, lineStyle: style, axisLabelVisible: true, title })); };
      add(lv.res, dn, r.tr ? L.t('res') : 'Swing H', 2);
      add(lv.sup, up, r.tr ? L.t('sup') : 'Swing L', 2);
      if (r.tr && lv.creek && Math.abs(lv.creek - lv.res) > lv.h * 0.08) add(lv.creek, css('--muted'), 'Creek', 3);
      if (r.tr && lv.ice && Math.abs(lv.ice - lv.sup) > lv.h * 0.08) add(lv.ice, css('--muted'), 'Ice', 3);
    }
    if (opts.fit !== false) {
      const n = bars.length;
      const from = r.tr ? Math.max(0, Math.min(r.tr.start - 30, n - 150)) : Math.max(0, n - 200);
      chart.timeScale().setVisibleLogicalRange({ from, to: n + 5 });
    }
    requestAnimationFrame(drawPhases);
  };
})(window.LLW);
