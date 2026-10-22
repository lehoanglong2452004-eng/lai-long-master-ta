// © 2026 Lai Long Master TA. Bảo lưu mọi quyền. Không sao chép, chỉnh sửa hay dùng lại khi chưa được phép.
/* Original SVG schematics for the knowledge library (drawn from coordinates, themed by CSS variables) */
(function (L) {
  'use strict';
  const S = L.schem = {};

  // Each point: [x, y, label?, labelSide('t'|'b')?, volume hint 0..1?]
  const ACC1 = {
    pts: [[0, 96], [4, 82], [6, 88], [10, 66, 'PS', 't', 0.55], [12, 72], [17, 28, 'SC', 'b', 1], [22, 62, 'AR', 't', 0.5], [27, 36, 'ST', 'b', 0.35],
      [31, 54], [35, 44], [39, 65, 'UA', 't', 0.45], [44, 40], [48, 55], [53, 31, 'ST-B', 'b', 0.3], [57, 52], [61, 44], [65, 57], [69, 36],
      [72, 22, 'Spring', 'b', 0.45], [75, 40], [78, 33, 'Test', 'b', 0.18], [83, 57, 'mSOS', 't', 0.6], [86, 47, 'LPS', 'b', 0.22], [90, 72, 'SOS', 't', 0.9],
      [93, 63, 'BU/LPS', 'b', 0.25], [100, 92]],
    phases: [[0, 'A'], [28, 'B'], [70, 'C'], [80, 'D'], [94, 'E']], res: 62, sup: 28
  };
  const ACC2 = {
    pts: [[0, 96], [4, 82], [6, 88], [10, 66, 'PS', 't', 0.55], [12, 72], [17, 28, 'SC', 'b', 1], [22, 62, 'AR', 't', 0.5], [27, 36, 'ST', 'b', 0.35],
      [31, 54], [35, 44], [39, 60], [44, 38], [48, 55], [53, 32, 'ST-B', 'b', 0.3], [57, 52], [61, 44], [65, 58], [70, 38, 'LPS (C)', 'b', 0.2],
      [74, 54], [77, 46], [83, 60, 'mSOS', 't', 0.55], [86, 50, 'LPS', 'b', 0.2], [90, 73, 'SOS', 't', 0.9], [93, 64, 'BU', 'b', 0.25], [100, 92]],
    phases: [[0, 'A'], [28, 'B'], [67, 'C'], [80, 'D'], [94, 'E']], res: 62, sup: 28
  };
  const REACC = {
    pts: [[0, 8], [6, 30], [9, 25], [15, 58, 'PSY', 't', 0.5], [17, 52], [21, 70, 'Stop', 't', 0.9], [25, 48, 'AR', 'b', 0.5], [30, 66, 'ST', 't', 0.35],
      [35, 50], [40, 64], [45, 47], [50, 62], [55, 50], [60, 63], [64, 44, 'Spring', 'b', 0.35], [67, 54], [70, 50, 'Test', 'b', 0.15],
      [76, 74, 'SOS', 't', 0.85], [80, 66, 'BU/LPS', 'b', 0.22], [100, 96]],
    phases: [[0, ''], [17, 'A'], [31, 'B'], [62, 'C'], [72, 'D'], [82, 'E']], res: 70, sup: 48
  };
  const mirror = (def, map) => ({
    pts: def.pts.map(p => [p[0], 100 - p[1], p[2] ? (map[p[2]] || p[2]) : undefined, p[3] === 't' ? 'b' : 't', p[4]]),
    phases: def.phases, res: 100 - def.sup, sup: 100 - def.res
  });
  const DMAP = { PS: 'PSY', SC: 'BC', ST: 'ST', UA: 'mSOW', 'ST-B': 'UT', Spring: 'UTAD', Test: 'Test', mSOS: 'mSOW', LPS: 'LPSY', SOS: 'SOW', 'BU/LPS': 'LPSY', 'LPS (C)': 'LPSY (C)', BU: 'LPSY', PSY: 'PS', Stop: 'Stop' };
  S.DEFS = {
    acc1: { def: ACC1, vi: 'Sơ đồ Tích lũy #1 (có Spring)', en: 'Accumulation Schematic #1 (with Spring)' },
    acc2: { def: ACC2, vi: 'Sơ đồ Tích lũy #2 (không Spring — Pha C là LPS)', en: 'Accumulation Schematic #2 (no Spring — Phase C is an LPS)' },
    dist1: { def: mirror(ACC1, DMAP), vi: 'Sơ đồ Phân phối #1 (có UTAD)', en: 'Distribution Schematic #1 (with UTAD)' },
    dist2: { def: mirror(ACC2, DMAP), vi: 'Sơ đồ Phân phối #2 (không UTAD — Pha C là LPSY)', en: 'Distribution Schematic #2 (no UTAD — Phase C is an LPSY)' },
    reacc: { def: REACC, vi: 'Tái tích lũy (Re-accumulation)', en: 'Re-accumulation' },
    redist: { def: mirror(REACC, Object.assign({}, DMAP, { Spring: 'UT', 'BU/LPS': 'LPSY', SOS: 'SOW', PSY: 'PS' })), vi: 'Tái phân phối (Re-distribution)', en: 'Re-distribution' }
  };

  S.svg = function (key) {
    const item = S.DEFS[key];
    const d = item.def;
    const W = 760, H = 380, padL = 20, padR = 20, top = 34, priceH = 250, volTop = 300, volH = 64;
    const x = v => padL + v / 100 * (W - padL - padR);
    const y = v => top + (100 - v) / 100 * priceH;
    const path = d.pts.map((p, k) => (k ? 'L' : 'M') + x(p[0]).toFixed(1) + ' ' + y(p[1]).toFixed(1)).join(' ');
    const out = [];
    out.push(`<svg viewBox="0 0 ${W} ${H}" class="schem" role="img" aria-label="${L.esc(L.T(item.vi, item.en))}">`);
    // phases
    d.phases.forEach((ph, k) => {
      const x1 = x(ph[0]), x2 = k + 1 < d.phases.length ? x(d.phases[k + 1][0]) : x(100);
      if (k > 0) out.push(`<line x1="${x1}" y1="${top - 14}" x2="${x1}" y2="${volTop + volH}" class="s-sep"/>`);
      if (ph[1]) out.push(`<text x="${(x1 + x2) / 2}" y="${top - 16}" class="s-phase" text-anchor="middle">${L.T('Pha', 'Phase')} ${ph[1]}</text>`);
    });
    // TR lines
    out.push(`<line x1="${x(14)}" y1="${y(d.res)}" x2="${x(96)}" y2="${y(d.res)}" class="s-res"/>`);
    out.push(`<line x1="${x(14)}" y1="${y(d.sup)}" x2="${x(96)}" y2="${y(d.sup)}" class="s-sup"/>`);
    out.push(`<path d="${path}" class="s-price"/>`);
    // labels
    d.pts.forEach(p => {
      if (!p[2]) return;
      const above = p[3] === 't';
      const ty = above ? y(p[1]) - 10 : y(p[1]) + 20;
      out.push(`<circle cx="${x(p[0])}" cy="${y(p[1])}" r="3.5" class="s-dot"/>`);
      out.push(`<text x="${x(p[0])}" y="${ty}" class="s-label" text-anchor="middle">${L.esc(p[2])}</text>`);
    });
    // volume bars: one per segment, boosted at labelled points
    for (let k = 1; k < d.pts.length; k++) {
      const a = d.pts[k - 1], b = d.pts[k];
      const hint = b[4] != null ? b[4] : Math.min(0.55, 0.12 + Math.abs(b[1] - a[1]) / 70);
      const n = Math.max(1, Math.round((b[0] - a[0]) / 1.4));
      for (let j = 0; j < n; j++) {
        const xx = a[0] + (b[0] - a[0]) * (j + 0.5) / n;
        const v = j === n - 1 ? hint : Math.max(0.08, hint * (0.45 + 0.4 * ((j * 7 + k * 3) % 5) / 5));
        const hh = v * volH;
        out.push(`<rect x="${(x(xx) - 2.2).toFixed(1)}" y="${(volTop + volH - hh).toFixed(1)}" width="4.4" height="${hh.toFixed(1)}" class="${b[1] >= a[1] ? 's-vu' : 's-vd'}"/>`);
      }
    }
    out.push(`<text x="${padL}" y="${volTop - 6}" class="s-small">${L.T('Khối lượng', 'Volume')}</text>`);
    out.push('</svg>');
    return `<figure class="schem-fig">${out.join('')}<figcaption>${L.T(item.vi, item.en)}</figcaption></figure>`;
  };

  /** Small spring-type illustration */
  S.springTypes = function () {
    const W = 760, H = 210;
    const box = (ox, label, depth, vol) => {
      const pts = [[0, 60], [12, 30], [24, 55], [36, 32], [48, 52], [58, 30 - depth], [68, 52], [80, 44], [100, 80]];
      const x = v => ox + v * 2.2, y = v => 150 - v * 1.2;
      const path = pts.map((p, k) => (k ? 'L' : 'M') + x(p[0]) + ' ' + y(p[1])).join(' ');
      return `<line x1="${x(0)}" y1="${y(30)}" x2="${x(100)}" y2="${y(30)}" class="s-sup"/><path d="${path}" class="s-price"/>
        <rect x="${x(58) - 3}" y="${190 - vol * 34}" width="6" height="${vol * 34}" class="s-vd"/>
        <text x="${x(50)}" y="20" text-anchor="middle" class="s-phase">${label}</text>`;
    };
    return `<figure class="schem-fig"><svg viewBox="0 0 ${W} ${H}" class="schem">${box(10, 'Spring #1', 26, 1)}${box(270, 'Spring #2', 14, 0.6)}${box(530, 'Spring #3', 6, 0.25)}</svg>
      <figcaption>${L.T('Ba loại Spring: độ xuyên thủng và khối lượng giảm dần từ #1 đến #3', 'Three Spring types: penetration and volume decrease from #1 to #3')}</figcaption></figure>`;
  };
})(window.LLW);
