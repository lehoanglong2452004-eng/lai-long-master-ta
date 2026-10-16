/* CMT study area: curriculum roadmap, lesson pages, progress, self-check quizzes, figures and live demos */
(function (L) {
  'use strict';
  const C = L.cmt = { levels: {}, lessons: {} };
  const $ = s => document.querySelector(s);
  const css = name => getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  const tx = o => (o == null ? '' : typeof o === 'string' ? o : (L.lang === 'en' && o.en != null ? o.en : o.vi));

  /* ---------- progress ---------- */
  const prog = () => L.store.get('cmt.progress', { done: {}, quiz: {} });
  const saveProg = p => L.store.set('cmt.progress', p);

  /* ---------- figures (original drawings) ---------- */
  const F = C.fig = {};
  /**
   * Line figure on a 0..100 grid.
   * opts: {w,h, series:[{pts:[[x,y]...], cls}], labels:[[x,y,text,'t'|'b'|'l'|'r', cls?]], hl:[[y,cls,text]], vl:[[x,text]], caption, zones:[[x1,x2,text,cls]]}
   */
  F.line = function (o) {
    const W = o.w || 640, H = o.h || 260, pl = 16, pr = 16, pt = o.vl || o.zones ? 30 : 16, pb = 16;
    const x = v => pl + v / 100 * (W - pl - pr), y = v => pt + (100 - v) / 100 * (H - pt - pb);
    const out = [`<svg viewBox="0 0 ${W} ${H}" class="schem cfig" role="img">`];
    (o.zones || []).forEach(z => {
      out.push(`<rect x="${x(z[0])}" y="${pt - 6}" width="${x(z[1]) - x(z[0])}" height="${H - pt - pb + 6}" class="${z[3] || 'z-a'}"/>`);
      out.push(`<text x="${(x(z[0]) + x(z[1])) / 2}" y="${pt - 12}" text-anchor="middle" class="s-phase">${z[2]}</text>`);
    });
    (o.vl || []).forEach(v => {
      out.push(`<line x1="${x(v[0])}" y1="${pt - 8}" x2="${x(v[0])}" y2="${H - pb}" class="s-sep"/>`);
      if (v[1]) out.push(`<text x="${x(v[0]) + 4}" y="${pt - 12}" class="s-small">${v[1]}</text>`);
    });
    (o.hl || []).forEach(h => {
      out.push(`<line x1="${x(0)}" y1="${y(h[0])}" x2="${x(100)}" y2="${y(h[0])}" class="${h[1] || 's-res'}"/>`);
      if (h[2]) out.push(`<text x="${x(100) - 4}" y="${y(h[0]) - 5}" text-anchor="end" class="s-small">${h[2]}</text>`);
    });
    (o.series || []).forEach(s => out.push(`<path d="${s.pts.map((p, k) => (k ? 'L' : 'M') + x(p[0]).toFixed(1) + ' ' + y(p[1]).toFixed(1)).join(' ')}" class="${s.cls || 's-price'}"/>`));
    (o.labels || []).forEach(l => {
      const dx = l[3] === 'l' ? -8 : l[3] === 'r' ? 8 : 0, dy = l[3] === 't' ? -9 : l[3] === 'b' ? 18 : 4;
      const anchor = l[3] === 'l' ? 'end' : l[3] === 'r' ? 'start' : 'middle';
      if (l[4] !== 'nodot') out.push(`<circle cx="${x(l[0])}" cy="${y(l[1])}" r="3.2" class="s-dot"/>`);
      out.push(`<text x="${x(l[0]) + dx}" y="${y(l[1]) + dy}" text-anchor="${anchor}" class="s-label">${l[2]}</text>`);
    });
    out.push('</svg>');
    return `<figure class="schem-fig">${out.join('')}${o.caption ? `<figcaption>${o.caption}</figcaption>` : ''}</figure>`;
  };
  F.row = (...figs) => `<div class="fig-row">${figs.join('')}</div>`;

  /* ---------- quiz: own questions + review questions from lower levels, shuffled, 80% to pass ---------- */
  const PASS = 0.8;
  // per level: own questions per lesson and review questions drawn from lower levels
  C.QUIZ_CFG = { 1: { own: 10, review: {} }, 2: { own: 20, review: { 1: 10 } }, 3: { own: 30, review: { 2: 10, 1: 10 } } };
  const shuffle = a => { const b = a.slice(); for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; };
  const quizOf = id => { const ls = C.lessons[id]; return ((L.lang === 'en' && ls.en) ? ls.en : ls.vi).quiz; };
  function levelPool(level) {
    return lessonList(level).filter(l => C.lessons[l.id]).flatMap(l => quizOf(l.id).map(q => Object.assign({ from: l.no }, q)));
  }
  function buildQuiz(id) {
    const level = +id[1], cfg = C.QUIZ_CFG[level] || C.QUIZ_CFG[1];
    const own = shuffle(quizOf(id)).slice(0, cfg.own).map(q => Object.assign({ tag: '' }, q));
    let review = [];
    Object.keys(cfg.review).forEach(lv => {
      review = review.concat(shuffle(levelPool(+lv)).slice(0, cfg.review[lv]).map(q => Object.assign({ tag: L.T('Ôn tập Level ', 'Review Level ') + lv + ' · ' + L.T('Bài ', 'Lesson ') + q.from }, q)));
    });
    // shuffle answer order so positions cannot be memorised
    return own.concat(review).map(q => {
      const order = shuffle(q.o.map((_, j) => j));
      return { q: q.q, e: q.e, tag: q.tag, o: order.map(j => q.o[j]), a: order.indexOf(q.a) };
    });
  }
  function quizInner(lessonId) {
    const p = prog(), qs = buildQuiz(lessonId), need = Math.ceil(qs.length * PASS), best = p.quiz[lessonId];
    return `<h2>${L.T('Bài kiểm tra cuối bài', 'End-of-lesson test')}</h2>
      <p class="muted">${L.T(`${qs.length} câu. Cần đúng ít nhất <b>${need}/${qs.length}</b> để mở khoá bài kế tiếp. Thứ tự câu hỏi và đáp án được xáo trộn mỗi lần làm.`, `${qs.length} questions. Score at least <b>${need}/${qs.length}</b> to unlock the next lesson. Questions and answers are shuffled every attempt.`)}${best != null ? ` · ${L.T('Điểm cao nhất', 'Best')}: <b>${best}%</b>` : ''}${p.done[lessonId] ? ` · <span class="up">✓ ${L.T('đã đạt', 'passed')}</span>` : ''}</p>
      ${qs.map((q, k) => `<div class="q" data-a="${q.a}">
        <p class="q-t"><b>${k + 1}.</b> ${q.tag ? `<span class="tag">${q.tag}</span> ` : ''}${q.q}</p>
        ${q.o.map((o, j) => `<label class="q-o"><input type="radio" name="${lessonId}-q${k}" value="${j}"><span>${String.fromCharCode(65 + j)}. ${o}</span></label>`).join('')}
        <p class="q-ex" hidden>${q.e || ''}</p></div>`).join('')}
      <div class="q-actions"><button class="btn primary" data-grade>${L.T('Nộp bài & chấm điểm', 'Submit & grade')}</button><span class="q-score"></span></div>`;
  }
  function quizHtml(lessonId) { return `<section class="quiz" data-quiz="${lessonId}">${quizInner(lessonId)}</section>`; }
  function bindQuiz(root) {
    const box = root.querySelector('[data-quiz]');
    if (!box) return;
    const id = box.dataset.quiz;
    box.querySelector('[data-grade]').onclick = () => {
      const qs = [...box.querySelectorAll('.q')];
      const blank = qs.filter(q => !q.querySelector('input:checked')).length;
      if (blank && !confirmBlank(box, blank)) return;
      let ok = 0;
      qs.forEach(q => {
        const sel = q.querySelector('input:checked');
        const a = +q.dataset.a;
        q.querySelectorAll('.q-o').forEach((lab, j) => { lab.classList.toggle('right', j === a); lab.classList.toggle('wrong', !!sel && +sel.value === j && j !== a); });
        q.querySelectorAll('input').forEach(i => { i.disabled = true; });
        q.classList.add(sel && +sel.value === a ? 'ok' : 'bad');
        q.querySelector('.q-ex').hidden = false;
        if (sel && +sel.value === a) ok++;
      });
      const total = qs.length, need = Math.ceil(total * PASS), score = Math.round(ok / total * 100), pass = ok >= need;
      const p = prog();
      p.quiz[id] = Math.max(p.quiz[id] || 0, score);
      if (pass) p.done[id] = true;
      saveProg(p);
      const next = nextLesson(id);
      box.querySelector('[data-grade]').remove();
      box.querySelector('.q-score').innerHTML = `<div class="q-result ${pass ? 'pass' : 'fail'}">
        <b>${ok}/${total}</b> ${L.T('câu đúng', 'correct')} (${score}%) — ${pass ? L.T('<b class="up">ĐẠT</b>. Bài kế tiếp đã được mở khoá.', '<b class="up">PASSED</b>. The next lesson is unlocked.') : L.T(`<b class="down">CHƯA ĐẠT</b> (cần ${need}/${total}). Xem lại giải thích từng câu rồi làm lại.`, `<b class="down">NOT YET</b> (need ${need}/${total}). Review the explanations and retry.`)}
        <div class="q-actions"><button class="btn" data-retry>↻ ${L.T('Làm lại (câu hỏi mới xáo trộn)', 'Retry (reshuffled)')}</button>${pass && next ? `<a class="btn primary" href="#cmt/${next.id}">${L.T('Sang bài', 'Go to lesson')} ${next.no} →</a>` : ''}</div></div>`;
      box.querySelector('[data-retry]').onclick = () => { box.innerHTML = quizInner(id); bindQuiz(root); box.scrollIntoView({ block: 'start' }); };
      box.querySelector('.q-result').scrollIntoView({ block: 'center' });
      renderToc();
      const nav = document.querySelector('[data-nextnav]');
      if (nav && pass && next) nav.outerHTML = `<a class="btn primary" href="#cmt/${next.id}">${L.T('Bài', 'Lesson')} ${next.no} →</a>`;
    };
  }
  function confirmBlank(box, n) {
    const s = box.querySelector('.q-score');
    if (s.dataset.warned) return true;
    s.dataset.warned = '1';
    s.innerHTML = `<span class="down">${L.T(`Còn ${n} câu chưa chọn đáp án. Bấm "Nộp bài" lần nữa để vẫn chấm điểm.`, `${n} question(s) unanswered. Press submit again to grade anyway.`)}</span>`;
    return false;
  }

  /* ---------- unlock rules ---------- */
  function levelUnlocked(n) {
    if (n === 1) return true;
    const prev = lessonList(n - 1), p = prog();
    return prev.length > 0 && prev.every(l => p.done[l.id]);
  }
  function unlocked(id) {
    const level = +id[1];
    if (!levelUnlocked(level)) return false;
    const all = lessonList(level), k = all.findIndex(l => l.id === id);
    const prev = all.slice(0, k).reverse().find(l => C.lessons[l.id]);
    return !prev || !!prog().done[prev.id];
  }
  function nextLesson(id) {
    const all = lessonList(+id[1]), k = all.findIndex(l => l.id === id);
    return all.slice(k + 1).find(l => C.lessons[l.id]);
  }
  C.unlocked = unlocked;

  /* ---------- live demos ---------- */
  const demos = [];
  function disposeDemos() { while (demos.length) { try { demos.pop().remove(); } catch (e) { /* ignore */ } } }
  function mkChart(el, extra) {
    const ch = LightweightCharts.createChart(el, Object.assign({
      autoSize: true,
      layout: { background: { type: 'solid', color: css('--panel2') }, textColor: css('--muted'), fontFamily: "'Be Vietnam Pro', sans-serif" },
      grid: { vertLines: { color: css('--grid') }, horzLines: { color: css('--grid') } },
      rightPriceScale: { borderColor: css('--line') },
      timeScale: { borderColor: css('--line'), timeVisible: false }
    }, extra || {}));
    demos.push(ch);
    return ch;
  }
  const demoShell = (id, controls, note) => `<div class="demo" data-demo="${id}">
    <div class="demo-head"><b>🔬 ${L.T('Thực hành trên dữ liệu thật', 'Hands-on with live data')}</b>${controls}</div>
    <div class="demo-chart"></div><div class="demo-out">${note || ''}</div></div>`;
  const mkSel = (cls, items, val) => `<select class="${cls}">${items.map(([v, t]) => `<option value="${v}" ${v === val ? 'selected' : ''}>${t}</option>`).join('')}</select>`;
  const mktItems = () => [['vn_stock', L.T('Cổ phiếu VN', 'VN stocks')], ['bn_spot', 'Crypto (Binance)']];

  C.demoHtml = {
    trendSwings: () => demoShell('trendSwings',
      `${mkSel('d-mk', mktItems(), 'vn_stock')}<input class="d-sym" value="VNINDEX" spellcheck="false">${mkSel('d-tf', [['1W', '1W'], ['1D', '1D'], ['4H', '4H']], '1W')}
       ${mkSel('d-zz', [['5', L.T('Xu hướng dài hạn (5 ATR)', 'Long-term (5 ATR)')], ['3', L.T('Trung hạn (3 ATR)', 'Intermediate (3 ATR)')], ['1.5', L.T('Ngắn hạn (1.5 ATR)', 'Short-term (1.5 ATR)')]], '3')}<button class="btn primary d-go">${L.T('Xem', 'Show')}</button>`,
      L.T('Đổi độ nhạy để thấy: cùng một biểu đồ, xu hướng ngắn hạn có thể ngược với xu hướng dài hạn.', 'Change the sensitivity: on the same chart, the short-term trend can oppose the long-term trend.')),
    dowConfirm: () => demoShell('dowConfirm',
      `${mkSel('d-pair', [['vn', 'VNINDEX ↔ VN30'], ['bn', 'BTCUSDT ↔ ETHUSDT']], 'vn')}${mkSel('d-tf', [['1W', '1W'], ['1D', '1D']], '1W')}<button class="btn primary d-go">${L.T('So sánh', 'Compare')}</button>`,
      L.T('Hai chỉ số được quy về cùng gốc 100 để so sánh các đỉnh/đáy.', 'Both series are rebased to 100 to compare peaks and troughs.')),
    chartTypes: () => demoShell('chartTypes',
      `${mkSel('d-mk', mktItems(), 'bn_spot')}<input class="d-sym" value="BTCUSDT" spellcheck="false">${mkSel('d-tf', [['1W', '1W'], ['1D', '1D']], '1W')}
       <span class="seg">${['line', 'bar', 'candle'].map(t => `<button class="btn d-type" data-t="${t}">${{ line: L.T('Đường', 'Line'), bar: 'Bar (OHLC)', candle: L.T('Nến', 'Candle') }[t]}</button>`).join('')}</span>
       <span class="seg"><button class="btn d-scale" data-s="0">${L.T('Thang số học', 'Arithmetic')}</button><button class="btn d-scale" data-s="1">${L.T('Thang logarit', 'Log scale')}</button></span>`,
      L.T('Với dữ liệu nhiều năm, hãy so sánh thang số học và thang logarit: trên thang log, cùng một % thay đổi chiếm cùng một khoảng cách.', 'With multi-year data compare arithmetic and log scales: on a log scale equal percentage moves take equal space.'))
  };

  async function loadBars(market, sym, tf) {
    const raw = await L.data.load(market, sym, tf);
    return L.ind.enrich(raw);
  }
  const t2 = b => b.t;
  const err = (out, e) => { out.innerHTML = `<span class="down">${L.t('err')}: ${L.esc(e.message)}</span>`; };
  // shared helpers for demo modules in other files
  Object.assign(C, { mkChart, demoShell, mkSel, mktItems, loadBars, err, css });
  /** Standard symbol controls: market, symbol, timeframe */
  C.symControls = (mk, sym, tf, tfs) => `${mkSel('d-mk', mktItems(), mk)}<input class="d-sym" value="${sym}" spellcheck="false">${mkSel('d-tf', (tfs || ['1W', '1D', '4H', '1H']).map(x => [x, x]), tf)}`;
  C.readSym = box => [box.querySelector('.d-mk').value, box.querySelector('.d-sym').value.trim().toUpperCase(), box.querySelector('.d-tf').value];
  C.candleSeries = ch => ch.addCandlestickSeries({ upColor: css('--up'), downColor: css('--down'), borderVisible: false, wickUpColor: css('--up'), wickDownColor: css('--down') });
  /** Wire a demo: run on button/Enter and once at start */
  C.wire = (box, run) => {
    const go = box.querySelector('.d-go');
    if (go) go.onclick = run;
    const s = box.querySelector('.d-sym');
    if (s) s.onkeydown = e => { if (e.key === 'Enter') run(); };
    run();
  };

  C.demoRun = {
    async trendSwings(box) {
      const out = box.querySelector('.demo-out'), el = box.querySelector('.demo-chart');
      const run = async () => {
        out.innerHTML = `<span class="spinner"></span>${L.t('loading')}`;
        try {
          const bars = await loadBars(box.querySelector('.d-mk').value, box.querySelector('.d-sym').value.trim().toUpperCase(), box.querySelector('.d-tf').value);
          const piv = L.ind.zigzag(bars, +box.querySelector('.d-zz').value).filter(p => !p.provisional);
          el.innerHTML = '';
          const ch = mkChart(el);
          const s = ch.addCandlestickSeries({ upColor: css('--up'), downColor: css('--down'), borderVisible: false, wickUpColor: css('--up'), wickDownColor: css('--down') });
          s.setData(bars.map(b => ({ time: t2(b), open: b.o, high: b.h, low: b.l, close: b.c })));
          const line = ch.addLineSeries({ color: css('--accent'), lineWidth: 2, priceLineVisible: false, lastValueVisible: false });
          line.setData(piv.map(p => ({ time: bars[p.i].t, value: p.p })));
          let lastH = null, lastL = null;
          const mk = piv.map(p => {
            let tag;
            if (p.type === 'H') { tag = lastH == null ? 'H' : p.p > lastH ? 'HH' : 'LH'; lastH = p.p; }
            else { tag = lastL == null ? 'L' : p.p > lastL ? 'HL' : 'LL'; lastL = p.p; }
            return { time: bars[p.i].t, position: p.type === 'H' ? 'aboveBar' : 'belowBar', color: tag === 'HH' || tag === 'HL' ? css('--up') : css('--down'), shape: 'circle', text: tag };
          });
          s.setMarkers(mk);
          ch.timeScale().fitContent();
          const hs = piv.filter(p => p.type === 'H').slice(-2), ls = piv.filter(p => p.type === 'L').slice(-2);
          let v = L.T('Chưa đủ đỉnh/đáy để kết luận.', 'Not enough swings to conclude.');
          if (hs.length === 2 && ls.length === 2) {
            const hh = hs[1].p > hs[0].p, hl = ls[1].p > ls[0].p;
            v = hh && hl ? L.T('<b class="up">Xu hướng TĂNG</b>: đỉnh sau cao hơn đỉnh trước VÀ đáy sau cao hơn đáy trước.', '<b class="up">UPTREND</b>: higher high AND higher low.')
              : !hh && !hl ? L.T('<b class="down">Xu hướng GIẢM</b>: đỉnh sau thấp hơn VÀ đáy sau thấp hơn.', '<b class="down">DOWNTREND</b>: lower high AND lower low.')
                : L.T('<b>Không rõ xu hướng / đi ngang</b>: đỉnh và đáy không cùng chiều — cần thêm bằng chứng.', '<b>No clear trend / sideways</b>: highs and lows disagree — more evidence needed.');
          }
          out.innerHTML = L.T('Kết luận theo định nghĩa đỉnh–đáy (2 đỉnh, 2 đáy gần nhất): ', 'Peak–trough verdict (last two highs and lows): ') + v;
        } catch (e) { err(out, e); }
      };
      box.querySelector('.d-go').onclick = run;
      run();
    },

    async dowConfirm(box) {
      const out = box.querySelector('.demo-out'), el = box.querySelector('.demo-chart');
      const run = async () => {
        out.innerHTML = `<span class="spinner"></span>${L.t('loading')}`;
        try {
          const pair = box.querySelector('.d-pair').value, tf = box.querySelector('.d-tf').value;
          const [m, a, b] = pair === 'vn' ? ['vn_stock', 'VNINDEX', 'VN30'] : ['bn_spot', 'BTCUSDT', 'ETHUSDT'];
          const [A, B] = await Promise.all([loadBars(m, a, tf), loadBars(m, b, tf)]);
          const mapB = new Map(B.map(x => [x.t, x]));
          const As = A.filter(x => mapB.has(x.t)).slice(-200), Bs = As.map(x => mapB.get(x.t));
          const ea = L.ind.enrich(As), eb = L.ind.enrich(Bs);
          el.innerHTML = '';
          const ch = mkChart(el);
          const sa = ch.addLineSeries({ color: css('--accent'), lineWidth: 2, title: a }), sb = ch.addLineSeries({ color: css('--up'), lineWidth: 2, title: b });
          sa.setData(ea.map(x => ({ time: x.t, value: x.c / ea[0].c * 100 })));
          sb.setData(eb.map(x => ({ time: x.t, value: x.c / eb[0].c * 100 })));
          ch.timeScale().fitContent();
          const verdict = bars => {
            const piv = L.ind.zigzag(bars, 3);
            const hs = piv.filter(p => p.type === 'H').slice(-2), ls = piv.filter(p => p.type === 'L').slice(-2);
            return { hh: hs.length === 2 ? hs[1].p > hs[0].p : null, hl: ls.length === 2 ? ls[1].p > ls[0].p : null };
          };
          const va = verdict(ea), vb = verdict(eb);
          const desc = (n, v) => `${n}: ${v.hh == null ? '—' : v.hh ? L.T('đỉnh cao hơn', 'higher high') : L.T('đỉnh thấp hơn', 'lower high')}, ${v.hl == null ? '—' : v.hl ? L.T('đáy cao hơn', 'higher low') : L.T('đáy thấp hơn', 'lower low')}`;
          let c;
          if (va.hh === vb.hh && va.hl === vb.hl) c = va.hh && va.hl ? L.T('<b class="up">Hai chỉ số XÁC NHẬN nhau theo chiều tăng.</b>', '<b class="up">The averages CONFIRM each other on the upside.</b>') : (!va.hh && !va.hl ? L.T('<b class="down">Hai chỉ số XÁC NHẬN nhau theo chiều giảm.</b>', '<b class="down">The averages CONFIRM each other on the downside.</b>') : L.T('<b>Hai chỉ số cùng trạng thái giằng co.</b>', '<b>Both averages are mixed in the same way.</b>'));
          else c = L.T('<b>PHÂN KỲ (non-confirmation)</b>: một chỉ số tạo đỉnh/đáy mới mà chỉ số kia không làm theo — theo Dow, tín hiệu xu hướng chưa được xác nhận.', '<b>NON-CONFIRMATION</b>: one average makes a new swing the other does not — per Dow, the trend signal is unconfirmed.');
          out.innerHTML = `${desc(a, va)} · ${desc(b, vb)}<br>${c}`;
        } catch (e) { err(out, e); }
      };
      box.querySelector('.d-go').onclick = run;
      run();
    },

    async chartTypes(box) {
      const out = box.querySelector('.demo-out'), el = box.querySelector('.demo-chart');
      let ch = null, series = null, bars = null, type = 'candle', scale = 1;
      const draw = () => {
        if (!bars) return;
        if (series) ch.removeSeries(series);
        const up = css('--up'), dn = css('--down');
        if (type === 'line') { series = ch.addLineSeries({ color: css('--accent'), lineWidth: 2 }); series.setData(bars.map(b => ({ time: b.t, value: b.c }))); }
        else if (type === 'bar') { series = ch.addBarSeries({ upColor: up, downColor: dn, thinBars: false }); series.setData(bars.map(b => ({ time: b.t, open: b.o, high: b.h, low: b.l, close: b.c }))); }
        else { series = ch.addCandlestickSeries({ upColor: up, downColor: dn, borderVisible: false, wickUpColor: up, wickDownColor: dn }); series.setData(bars.map(b => ({ time: b.t, open: b.o, high: b.h, low: b.l, close: b.c }))); }
        ch.priceScale('right').applyOptions({ mode: scale });
        box.querySelectorAll('.d-type').forEach(b => b.classList.toggle('active', b.dataset.t === type));
        box.querySelectorAll('.d-scale').forEach(b => b.classList.toggle('active', +b.dataset.s === scale));
      };
      const load = async () => {
        out.innerHTML = `<span class="spinner"></span>${L.t('loading')}`;
        try {
          bars = await loadBars(box.querySelector('.d-mk').value, box.querySelector('.d-sym').value.trim().toUpperCase(), box.querySelector('.d-tf').value);
          el.innerHTML = ''; ch = mkChart(el); series = null; draw(); ch.timeScale().fitContent();
          const lo = Math.min(...bars.map(b => b.l)), hi = Math.max(...bars.map(b => b.h));
          out.innerHTML = L.T(`${bars.length} nến, giá thấp nhất ${L.fmtP(lo)} – cao nhất ${L.fmtP(hi)} (gấp ${(hi / lo).toFixed(1)} lần). Khi biên độ lớn như vậy, thang logarit cho cái nhìn trung thực hơn về tốc độ tăng/giảm.`,
            `${bars.length} bars, low ${L.fmtP(lo)} – high ${L.fmtP(hi)} (${(hi / lo).toFixed(1)}×). With such a range the log scale gives a fairer view of the rate of change.`);
        } catch (e) { err(out, e); }
      };
      box.querySelectorAll('.d-type').forEach(b => b.onclick = () => { type = b.dataset.t; draw(); });
      box.querySelectorAll('.d-scale').forEach(b => b.onclick = () => { scale = +b.dataset.s; draw(); });
      box.querySelector('.d-sym').onkeydown = e => { if (e.key === 'Enter') load(); };
      box.querySelector('.d-tf').onchange = load;
      box.querySelector('.d-mk').onchange = load;
      load();
    }
  };

  /* ---------- views ---------- */
  let cur = { level: 1, lesson: null };

  function lessonList(level) {
    const lv = C.levels[level];
    return lv ? lv.parts.flatMap(p => p.lessons) : [];
  }

  function renderToc() {
    const toc = $('#cmtToc');
    if (!toc) return;
    const p = prog();
    const lv = C.levels[cur.level];
    const levels = [1, 2, 3].map(n => { const open = C.levels[n] && levelUnlocked(n); return `<button class="lv ${n === cur.level ? 'active' : ''}" data-lv="${n}" ${open ? '' : 'disabled'} title="${open ? '' : L.T('Hoàn thành toàn bộ Level trước để mở khoá', 'Complete the previous level to unlock')}">Level ${n}${open ? '' : ' 🔒'}</button>`; }).join('');
    let body = '';
    if (lv) {
      const all = lessonList(cur.level), ready = all.filter(l => C.lessons[l.id]), done = all.filter(l => p.done[l.id]);
      body = `<div class="cmt-progress"><div class="bar"><i style="width:${all.length ? done.length / all.length * 100 : 0}%"></i></div>
        <span class="muted">${L.T('Hoàn thành', 'Completed')} ${done.length}/${all.length} · ${L.T('đã biên soạn', 'written')} ${ready.length}</span></div>
        <button class="toc-link ${!cur.lesson ? 'active' : ''}" data-ls="">🧭 ${L.T('Lộ trình Level', 'Level roadmap')} ${cur.level}</button>` +
        lv.parts.map(part => `<div class="toc-part">${tx(part.title)}</div>` + part.lessons.map(l => {
          const ok = !!C.lessons[l.id], open = ok && unlocked(l.id);
          return `<button class="toc-link ${cur.lesson === l.id ? 'active' : ''}" data-ls="${l.id}" ${open ? '' : 'disabled'}>
            <span class="no">${l.no}</span><span>${tx(l.title)}</span><span class="st">${p.done[l.id] ? '✓' : !ok ? '…' : open ? '' : '🔒'}</span></button>`;
        }).join('')).join('');
    }
    toc.innerHTML = `<div class="lv-tabs">${levels}</div>${body}`;
    toc.querySelectorAll('[data-lv]').forEach(b => b.onclick = () => { location.hash = 'cmt/l' + b.dataset.lv; });
    toc.querySelectorAll('[data-ls]').forEach(b => b.onclick = () => { location.hash = 'cmt/' + (b.dataset.ls || 'l' + cur.level); });
  }

  function renderRoadmap() {
    const lv = C.levels[cur.level];
    const p = prog();
    $('#cmtBody').innerHTML = `<h1>${tx(lv.title)}</h1>${tx(lv.intro)}
      <div class="roadmap">${lv.parts.map((part, k) => `<div class="rm-part"><div class="rm-head"><span class="rm-no">${L.T('Phần', 'Part')} ${k + 1}</span><b>${tx(part.title)}</b></div>
        <p class="muted">${tx(part.goal)}</p>
        <ol class="rm-list">${part.lessons.map(l => {
          const ok = !!C.lessons[l.id], open = ok && unlocked(l.id), name = `${L.T('Bài', 'Lesson')} ${l.no}. ${tx(l.title)}`;
          const status = p.done[l.id] ? ` <span class="up">✓ ${p.quiz[l.id]}%</span>` : !ok ? ` <span class="tag">${L.T('đang biên soạn', 'in preparation')}</span>` : open ? ` <span class="tag">${L.T('đang học', 'current')}</span>` : ' 🔒';
          return `<li class="${open ? 'ready' : ''}">${open ? `<a href="#cmt/${l.id}">${name}</a>` : `<span>${name}</span>`}${status}</li>`;
        }).join('')}</ol></div>`).join('')}</div>`;
  }

  function renderLesson(id) {
    disposeDemos();
    const meta = lessonList(cur.level).find(l => l.id === id);
    const ls = C.lessons[id];
    const c = L.lang === 'en' && ls.en ? ls.en : ls.vi;
    const all = lessonList(cur.level), k = all.findIndex(l => l.id === id);
    const prev = all.slice(0, k).reverse().find(l => C.lessons[l.id]), next = all.slice(k + 1).find(l => C.lessons[l.id]);
    const p = prog();
    if (!unlocked(id)) {
      $('#cmtBody').innerHTML = `<div class="locked"><div class="lk-icon">🔒</div><h1>${tx(meta.title)}</h1>
        <p>${!levelUnlocked(cur.level) ? L.T(`Level ${cur.level} sẽ mở khoá khi bạn hoàn thành toàn bộ Level ${cur.level - 1}.`, `Level ${cur.level} unlocks after completing all of Level ${cur.level - 1}.`)
          : L.T(`Bài này sẽ mở khoá khi bạn đạt ≥ 80% bài kiểm tra của <b>Bài ${prev.no}</b>.`, `This lesson unlocks when you score ≥ 80% on the <b>Lesson ${prev.no}</b> test.`)}</p>
        ${prev && levelUnlocked(cur.level) ? `<a class="btn primary" href="#cmt/${prev.id}">← ${L.T('Về Bài', 'Go to Lesson')} ${prev.no}</a>` : ''}</div>`;
      return;
    }
    $('#cmtBody').innerHTML = `
      <div class="lesson-meta">CMT Level ${cur.level} · ${L.T('Bài', 'Lesson')} ${meta.no} ${p.done[id] ? '<span class="up">✓ ' + L.T('đã hoàn thành', 'completed') + '</span>' : ''}</div>
      <h1>${tx(meta.title)}</h1>
      <div class="objectives"><h2>${L.T('Mục tiêu bài học', 'Learning goals')}</h2><p class="muted">${L.T('Sau bài này, bạn có thể:', 'After this lesson you can:')}</p><ul>${c.goals.map(g => `<li>${g}</li>`).join('')}</ul></div>
      <div class="lesson-body">${c.body()}</div>
      <div class="keys"><h2>${L.T('Ghi nhớ cốt lõi', 'Key takeaways')}</h2><ol>${c.keys.map(x => `<li>${x}</li>`).join('')}</ol></div>
      ${c.terms && c.terms.length ? `<div class="terms"><h2>${L.T('Thuật ngữ', 'Terms')}</h2><table class="tbl"><tbody>${c.terms.map(t => `<tr><td><b>${t[0]}</b></td><td>${t[1]}</td></tr>`).join('')}</tbody></table></div>` : ''}
      ${quizHtml(id)}
      <div class="lesson-nav">${prev ? `<a class="btn" href="#cmt/${prev.id}">← ${L.T('Bài', 'Lesson')} ${prev.no}</a>` : '<span></span>'}
        ${next ? (p.done[id] ? `<a class="btn primary" href="#cmt/${next.id}">${L.T('Bài', 'Lesson')} ${next.no} →</a>` : `<span class="btn" data-nextnav disabled>🔒 ${L.T('Bài', 'Lesson')} ${next.no} — ${L.T('cần đạt ≥ 80%', 'need ≥ 80%')}</span>`) : '<span></span>'}</div>`;
    const body = $('#cmtBody');
    bindQuiz(body);
    body.querySelectorAll('[data-demo]').forEach(box => { const f = C.demoRun[box.dataset.demo]; if (f) f(box); });
  }

  /** Entry point from the router: sub = '' | 'l1' | 'l1-01' */
  C.render = function (sub) {
    if (C.applyExtra) C.applyExtra();
    if (sub && /^l\d$/.test(sub)) { cur.level = +sub[1]; cur.lesson = null; }
    else if (sub && C.lessons[sub]) { cur.level = +sub[1]; cur.lesson = sub; }
    else if (!sub) { cur.lesson = null; }
    if (!C.levels[cur.level]) cur.level = 1;
    renderToc();
    if (cur.lesson) renderLesson(cur.lesson); else { disposeDemos(); renderRoadmap(); }
    window.scrollTo({ top: 0 });
  };
})(window.LLW);
