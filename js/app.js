/* App shell: navigation, controls, analysis view, multi-timeframe view, knowledge, checklist, guide */
(function (L) {
  'use strict';
  const $ = s => document.querySelector(s);
  const W = L.wy, N = L.narr;
  const VIEWS = ['analysis', 'mtf', 'knowledge', 'cmt', 'checklist', 'guide'];
  const INDEXES = /^(VNINDEX|VN30|HNXINDEX|HNX30|UPCOMINDEX|VN30F\w*)$/;

  const defaults = { market: 'vn_stock', symbol: 'HPG', tf: '1D', view: 'analysis', vsa: true, phases: true, events: true, mtfTfs: L.TFS.slice(), theme: 'dark', kb: 'intro' };
  const st = L.state = Object.assign({}, defaults, L.store.get('state', {}));
  if (!L.MARKETS[st.market]) st.market = defaults.market;
  if (!L.TFS.includes(st.tf)) st.tf = '1D';
  if (st.market === 'csv') st.market = defaults.market; // CSV data is not persisted
  const save = () => L.store.set('state', st);

  let single = null;          // {raw, idx, sym, market, tf, r}
  let mtf = null;             // {sym, market, tfs, raws, results}
  let chartReady = false;
  let busy = false;

  /* ---------- helpers ---------- */
  function setStatus(html, err) {
    const s = $('#status');
    if (!html) { s.hidden = true; return; }
    s.hidden = false; s.className = 'status' + (err ? ' err' : ''); s.innerHTML = html;
  }
  const spin = txt => `<span class="spinner"></span>${txt}`;
  function setBusy(b) { busy = b; const g = $('#goBtn'); if (g) g.disabled = b; }
  const currentSymbol = () => (st.market === 'csv' ? (L.data.csv ? L.data.csv.name : '') : String(st.symbol || '').trim().toUpperCase());

  /* ---------- theme & language ---------- */
  function applyTheme() {
    document.documentElement.dataset.theme = st.theme;
    $('#themeBtn').textContent = st.theme === 'dark' ? '☀' : '☾';
    if (chartReady) L.chart.applyTheme();
  }
  function applyLang() {
    document.documentElement.lang = L.lang;
    $('#langBtn').textContent = L.lang === 'vi' ? 'EN' : 'VI';
    $('#disclaimer').textContent = L.t('disclaimer');
    $('#chartCredit').textContent = L.t('chart_credit');
  }

  /* ---------- navigation ---------- */
  function renderNav() {
    $('#nav').innerHTML = VIEWS.map(v => `<button data-v="${v}" class="${st.view === v ? 'active' : ''}">${L.t('nav_' + v)}</button>`).join('');
    $('#nav').querySelectorAll('button').forEach(b => b.onclick = () => { location.hash = b.dataset.v; });
  }
  function route() {
    const [v, sub] = (location.hash.replace('#', '') || st.view).split('/');
    st.view = VIEWS.includes(v) ? v : 'analysis';
    if (st.view === 'knowledge' && sub) st.kb = sub;
    save();
    VIEWS.forEach(x => $('#view-' + x).classList.toggle('active', x === st.view));
    renderNav();
    renderControls();
    if (st.view === 'knowledge') renderKB();
    if (st.view === 'cmt') { if (sub) st.cmt = sub; L.cmt.render(st.cmt || ''); save(); }
    if (st.view === 'checklist') renderChecklist();
    if (st.view === 'guide') renderGuide();
    if (st.view === 'analysis') {
      if (!single) runAnalysis(); else requestAnimationFrame(() => window.dispatchEvent(new Event('resize')));
    }
    if (st.view === 'mtf' && !mtf) renderMTFEmpty();
  }

  /* ---------- controls ---------- */
  function renderControls() {
    const c = $('#controls');
    if (!['analysis', 'mtf'].includes(st.view)) { c.hidden = true; return; }
    c.hidden = false;
    const avail = L.data.availableTFs(st.market);
    const mk = Object.keys(L.MARKETS).map(k => `<option value="${k}" ${k === st.market ? 'selected' : ''}>${L.T(L.MARKETS[k].vi, L.MARKETS[k].en)}</option>`).join('');
    const symField = st.market === 'csv'
      ? `<div class="field"><label>CSV</label><label class="btn csv-pick">${L.t('csv_pick')}<input type="file" id="csvFile" accept=".csv,.txt"></label></div>
         <div class="field"><label>&nbsp;</label><span class="muted">${L.data.csv ? `${L.t('csv_loaded')}: ${L.esc(L.data.csv.name)} (${L.data.csv.baseTF}, ${L.data.csv.bars.length} ${L.t('bars')})` : L.t('csv_hint')}</span></div>`
      : `<div class="field"><label>${L.t('symbol')}</label><input type="text" id="sym" list="symList" value="${L.esc(st.symbol)}" autocomplete="off" spellcheck="false">
         <datalist id="symList">${(L.SUGGEST[st.market] || []).map(s => `<option value="${s}">`).join('')}</datalist></div>`;
    const tfField = st.view === 'analysis'
      ? `<div class="field"><label>${L.t('timeframe')}</label><div class="tfs">${L.TFS.map(tf => `<button data-tf="${tf}" class="${tf === st.tf ? 'active' : ''}" ${avail.includes(tf) ? '' : 'disabled'}>${tf}</button>`).join('')}</div></div>`
      : `<div class="field"><label>${L.t('choose_tfs')}</label><div class="tfs">${L.TFS.map(tf => `<label><input type="checkbox" data-mtf="${tf}" ${st.mtfTfs.includes(tf) ? 'checked' : ''} ${avail.includes(tf) ? '' : 'disabled'}>${tf}</label>`).join('')}</div></div>`;
    c.innerHTML = `<div class="field"><label>${L.t('market')}</label><select id="mk">${mk}</select></div>${symField}${tfField}
      <div class="field"><label>&nbsp;</label><button class="btn primary" id="goBtn">${st.view === 'analysis' ? L.t('analyze') : L.t('scan')}</button></div>`;

    $('#mk').onchange = e => {
      st.market = e.target.value;
      st.symbol = L.MARKETS[st.market].ex || '';
      save(); renderControls();
    };
    const sym = $('#sym');
    if (sym) {
      sym.oninput = () => { st.symbol = sym.value.toUpperCase(); save(); };
      sym.onkeydown = e => { if (e.key === 'Enter') run(); };
    }
    const f = $('#csvFile');
    if (f) f.onchange = async () => {
      const file = f.files[0];
      if (!file) return;
      try {
        const parsed = L.data.parseCSV(await file.text());
        L.data.csv = Object.assign(parsed, { name: file.name });
        if (L.TF_SEC[st.tf] < L.TF_SEC[parsed.baseTF]) st.tf = parsed.baseTF;
        renderControls(); run();
      } catch (e) { setStatus(L.t('err') + ': ' + L.esc(e.message), true); }
    };
    c.querySelectorAll('[data-tf]').forEach(b => b.onclick = () => { st.tf = b.dataset.tf; save(); renderControls(); runAnalysis(); });
    c.querySelectorAll('[data-mtf]').forEach(cb => cb.onchange = () => {
      st.mtfTfs = L.TFS.filter(tf => { const x = c.querySelector(`[data-mtf="${tf}"]`); return x && x.checked; });
      save();
    });
    $('#goBtn').onclick = run;
    $('#goBtn').disabled = busy;
  }
  function run() { if (st.view === 'mtf') runMTF(); else runAnalysis(); }

  /* ---------- relative strength vs VNINDEX (Wyckoff step 2) ---------- */
  function relStrength(r, idxRaw) {
    const m = new Map(idxRaw.map(b => [b.t, b.c]));
    const ratio = [];
    r.bars.forEach(b => { const ic = m.get(b.t); if (ic) ratio.push(b.c / ic); });
    if (ratio.length < 25) return null;
    const n = ratio.length;
    const ch = k => (n > k ? ratio[n - 1] / ratio[n - 1 - k] - 1 : null);
    const r20 = ch(20), r60 = ch(60);
    const f = x => (x == null ? '—' : (x >= 0 ? '+' : '') + (x * 100).toFixed(1) + '%');
    const strong = (r20 || 0) + (r60 || 0) * 0.5;
    r.rsValue = { r20, r60 };
    return L.T(`Sức mạnh tương đối so với VNINDEX (bước 2 Wyckoff): 20 nến ${f(r20)}, 60 nến ${f(r60)} → cổ phiếu đang <b>${strong > 0.02 ? 'mạnh hơn' : strong < -0.02 ? 'yếu hơn' : 'tương đương'}</b> thị trường chung.`,
      `Relative strength vs VNINDEX (Wyckoff step 2): 20 bars ${f(r20)}, 60 bars ${f(r60)} → the stock is <b>${strong > 0.02 ? 'stronger than' : strong < -0.02 ? 'weaker than' : 'in line with'}</b> the market.`);
  }

  /* ---------- single timeframe ---------- */
  async function runAnalysis() {
    const sym = currentSymbol();
    if (!sym) { setStatus(st.market === 'csv' ? L.t('csv_hint') : L.T('Hãy nhập mã.', 'Please enter a symbol.'), true); return; }
    setBusy(true);
    setStatus(spin(L.t('loading')));
    try {
      const raw = await L.data.load(st.market, sym, st.tf);
      let idx = null;
      if (st.market === 'vn_stock' && !INDEXES.test(sym)) { try { idx = await L.data.load('vn_stock', 'VNINDEX', st.tf); } catch (e) { idx = null; } }
      single = { raw, idx, sym, market: st.market, tf: st.tf };
      renderSingle(true);
      setStatus(null);
    } catch (e) {
      setStatus(L.t('err') + ': ' + L.esc(e.message), true);
    } finally { setBusy(false); }
  }

  function renderSingle(fit) {
    if (!single) return;
    const r = W.analyze(single.raw, { tf: single.tf, symbol: single.sym, market: single.market });
    single.r = r;
    if (r.error) {
      $('#summary').innerHTML = `<p class="placeholder">${L.T('Không đủ dữ liệu (cần ≥ 60 nến).', 'Not enough data (≥ 60 bars needed).')}</p>`;
      $('#scenarios').innerHTML = ''; $('#narrative').innerHTML = '';
      return;
    }
    if (single.idx) r.rs = relStrength(r, single.idx);
    if (!chartReady) { L.chart.init($('#chart')); chartReady = true; }
    L.chart.render(r, { vsa: st.vsa, phases: st.phases, events: st.events, fit });
    renderHead(r);
    renderToggles();
    renderSummary(r);
    renderScenarios(r);
    $('#narrative').innerHTML = `<h2>${L.T('Luận Wyckoff', 'Wyckoff reading')} · ${L.esc(single.sym)} · ${single.tf}</h2>` + N.render(r);
  }

  function renderHead(r) {
    const last = r.last, prev = r.bars[r.n - 2];
    const ch = prev ? (last.c / prev.c - 1) * 100 : 0;
    $('#chartHead').innerHTML = `<span class="sym">${L.esc(single.sym)}</span><span class="muted">${L.T(L.MARKETS[single.market].vi, L.MARKETS[single.market].en)} · ${single.tf}</span>
      <span class="px">${L.fmtP(last.c)}</span><span class="${ch >= 0 ? 'up' : 'down'} mono">${ch >= 0 ? '+' : ''}${ch.toFixed(2)}%</span>
      ${last.live ? `<span class="muted">● ${L.t('live')}</span>` : ''}<span class="muted">${r.n} ${L.t('bars')}</span>`;
  }

  function renderToggles() {
    const t = $('#toggles');
    t.innerHTML = [['events', 'show_events'], ['phases', 'show_phase'], ['vsa', 'show_vsa']].map(([k, lbl]) =>
      `<label><input type="checkbox" data-tg="${k}" ${st[k] ? 'checked' : ''}> ${L.t(lbl)}</label>`).join('') +
      `<span>${L.T('Nhãn: ▲ cầu/tăng · ▼ cung/giảm · thanh khối lượng vàng = cao trào', 'Labels: ▲ demand · ▼ supply · gold volume = climax')}</span>`;
    t.querySelectorAll('[data-tg]').forEach(cb => cb.onchange = () => {
      st[cb.dataset.tg] = cb.checked; save();
      L.chart.render(single.r, { vsa: st.vsa, phases: st.phases, events: st.events, fit: false });
    });
  }

  function renderSummary(r) {
    const bl = N.biasLabel(r.bias);
    const ph = r.phase ? L.T(W.PHASE[r.phase].vi, W.PHASE[r.phase].en) : L.T('Không có TR đang hoạt động', 'No active TR');
    const lv = r.levels || {};
    const lastEv = r.events && r.events.length ? r.events[r.events.length - 1] : null;
    const row = (k, v, cls) => v == null ? '' : `<tr><td>${k}</td><td class="${cls || ''}">${L.fmtP(v)}</td></tr>`;
    const pnf = r.pnf;
    const rng = a => (L.fmtP(a[0]) === L.fmtP(a[1]) ? L.fmtP(a[0]) : L.fmtP(a[0]) + ' → ' + L.fmtP(a[1]));
    $('#summary').innerHTML = `<h2>${L.t('summary')}</h2>
      <div class="muted">${L.t('structure')}</div>
      <div class="struct-name">${W.structName(r.structure)}</div>
      <div><span class="phase-pill">${r.phase ? L.T('Pha ', 'Phase ') + N.phaseLabel(r) : '—'}</span> <span class="muted">${ph}</span></div>
      <div class="gauge"><i style="left:${((r.bias + 1) / 2 * 100).toFixed(1)}%"></i></div>
      <div class="gauge-lbl"><span>${L.t('bear')}</span><span class="${bl.cls}"><b>${bl.txt}</b> (${Math.round(r.bias * 100)})</span><span>${L.t('bull')}</span></div>
      <dl class="kv" style="margin-top:12px">
        <dt>${L.t('trend')}</dt><dd>${N.trendLabel(r.trend.dir)}</dd>
        <dt>${L.t('col_event')}</dt><dd>${lastEv ? W.evName(lastEv.code) + ' · ' + L.fmtTime(lastEv.t, r.tf) : '—'}</dd>
        <dt>${L.t('col_vsa')}</dt><dd>${r.sig[r.lastIdx].map(c => L.vsa.name(c)).join(', ') || '·'}</dd>
        ${r.rsValue ? `<dt>RS vs VNINDEX</dt><dd class="${(r.rsValue.r20 || 0) >= 0 ? 'up' : 'down'}">${r.rsValue.r20 != null ? ((r.rsValue.r20 >= 0 ? '+' : '') + (r.rsValue.r20 * 100).toFixed(1) + '% (20)') : '—'}</dd>` : ''}
      </dl>
      <table class="levels">
        ${row(L.t('res'), lv.res, 'down')}
        ${r.tr && lv.creek && Math.abs(lv.creek - lv.res) > lv.h * 0.08 ? row('Creek', lv.creek) : ''}
        ${row(L.t('mid'), lv.mid)}
        ${r.tr && lv.ice && Math.abs(lv.ice - lv.sup) > lv.h * 0.08 ? row('Ice', lv.ice) : ''}
        ${row(L.t('sup'), lv.sup, 'up')}
        ${pnf && pnf.small ? `<tr><td>P&F (${pnf.cols} ${L.T('cột', 'cols')})</td><td class="muted">${L.T('nguyên nhân còn nhỏ', 'cause still small')}</td></tr>` : ''}
        ${pnf && !pnf.small ? `<tr><td>P&F ↑ (${pnf.cols} ${L.T('cột', 'cols')})</td><td class="up">${rng(pnf.bull)}</td></tr>
        <tr><td>P&F ↓</td><td class="down">${rng(pnf.bear)}</td></tr>` : ''}
      </table>`;
  }

  function planHtml(p) {
    const tg = p.targets.map((t, k) => `T${k + 1} <b>${L.fmtP(t)}</b>`).join(' · ');
    return `<div class="plan"><div class="pn">${p.name}</div><div class="row">
      <span>${L.t('entry')}: <b>${L.fmtP(p.zone[0])} – ${L.fmtP(p.zone[1])}</b></span>
      ${p.stop != null ? `<span>${L.t('stop')}: <b>${L.fmtP(p.stop)}</b></span>` : ''}
      ${tg ? `<span>${tg}</span>` : ''}${p.rr ? `<span>R:R <b>${p.rr.toFixed(1)}</b></span>` : ''}</div></div>`;
  }

  function renderScenarios(r) {
    $('#scenarios').innerHTML = `<h2>${L.t('scenarios')}</h2>` + r.scenarios.map(s => `
      <div class="scn ${s.key}">
        <div class="scn-head"><b>${s.title}</b><span class="prob">${s.prob}%</span></div>
        <div class="probbar"><i style="width:${s.prob}%"></i></div>
        ${s.thesis.map(x => `<p>${x}</p>`).join('')}
        ${s.plan.map(planHtml).join('')}
        <details><summary>${L.t('trigger')} / ${L.t('invalid')}</summary>
          <ul>${s.trigger.map(x => `<li>${x}</li>`).join('')}</ul>
          <p><b>${L.t('invalid')}:</b> ${s.invalid}</p></details>
        ${s.note ? `<p class="note">${s.note}</p>` : ''}
      </div>`).join('') + `<p class="muted">${L.T('Tỷ trọng kịch bản là trọng số heuristic từ bằng chứng Wyckoff, không phải xác suất thống kê.', 'Scenario weights are heuristic, derived from Wyckoff evidence — not statistical probabilities.')}</p>`;
  }

  /* ---------- multi-timeframe ---------- */
  function renderMTFEmpty() {
    $('#mtfTable').innerHTML = `<h2>${L.t('tf_table')}</h2><p class="placeholder">${L.T('Chọn mã và bấm "Quét đa khung" để phân tích 9 khung thời gian 2W → 1m.', 'Pick a symbol and press "Scan all timeframes" to analyse 2W → 1m.')}</p>`;
    $('#mtfStory').innerHTML = '';
  }

  async function runMTF() {
    const sym = currentSymbol();
    if (!sym) { setStatus(L.T('Hãy nhập mã.', 'Please enter a symbol.'), true); return; }
    const avail = L.data.availableTFs(st.market);
    const tfs = st.mtfTfs.filter(tf => avail.includes(tf));
    if (!tfs.length) return;
    mtf = { sym, market: st.market, tfs, raws: {}, results: {} };
    setBusy(true);
    setStatus(spin(L.t('loading')));
    renderMTFTable();
    $('#mtfStory').innerHTML = '';
    const queue = tfs.slice();
    const my = mtf;
    const worker = async () => {
      while (queue.length) {
        const tf = queue.shift();
        try {
          const raw = await L.data.load(my.market, sym, tf);
          my.raws[tf] = raw;
          my.results[tf] = W.analyze(raw, { tf, symbol: sym, market: my.market });
        } catch (e) { my.results[tf] = { error: 'fetch', msg: e.message }; }
        if (mtf === my) renderMTFTable();
      }
    };
    await Promise.all([worker(), worker(), worker()]);
    if (mtf !== my) return;
    setBusy(false);
    setStatus(null);
    renderMTFStory();
  }

  function recomputeMTF() {
    if (!mtf) return;
    for (const tf of Object.keys(mtf.raws)) mtf.results[tf] = W.analyze(mtf.raws[tf], { tf, symbol: mtf.sym, market: mtf.market });
    renderMTFTable(); renderMTFStory();
  }

  function biasCell(b) {
    const bl = N.biasLabel(b);
    const left = b >= 0 ? 50 : 50 + b * 50, width = Math.abs(b) * 50;
    return `<span class="biasbar"><i style="left:${left}%;width:${width}%;background:var(--${b >= 0 ? 'up' : 'down'})"></i></span><span class="${bl.cls}">${bl.txt}</span>`;
  }

  function renderMTFTable() {
    if (!mtf) return;
    const rows = mtf.tfs.map(tf => {
      const r = mtf.results[tf];
      if (!r) return `<tr><td class="tf">${tf}</td><td colspan="7" class="muted"><span class="spinner"></span></td></tr>`;
      if (r.error) return `<tr><td class="tf">${tf}</td><td colspan="7" class="muted">${r.error === 'notEnough' ? L.T('Không đủ dữ liệu', 'Not enough data') : L.esc(r.msg || L.t('no_data'))}</td></tr>`;
      return `<tr><td class="tf">${tf}</td><td>${N.trendLabel(r.trend.dir)}</td><td>${W.structName(r.structure)}</td>
        <td><b>${N.phaseLabel(r)}</b></td><td class="mono">${N.latestEvent(r)}</td><td class="mono">${N.lastVsa(r)}</td>
        <td>${biasCell(r.bias)}</td><td><button class="btn ghost" data-open="${tf}">${L.t('open_tf')} →</button></td></tr>`;
    }).join('');
    $('#mtfTable').innerHTML = `<h2>${L.t('tf_table')} · ${L.esc(mtf.sym)}</h2><div class="tbl-wrap"><table class="mtf"><thead><tr>
      <th>${L.t('col_tf')}</th><th>${L.t('col_trend')}</th><th>${L.t('col_struct')}</th><th>${L.t('col_phase')}</th><th>${L.t('col_event')}</th><th>${L.t('col_vsa')}</th><th>${L.t('col_bias')}</th><th></th></tr></thead><tbody>${rows}</tbody></table></div>`;
    $('#mtfTable').querySelectorAll('[data-open]').forEach(b => b.onclick = () => {
      st.tf = b.dataset.open; st.symbol = mtf.market === 'csv' ? st.symbol : mtf.sym; st.market = mtf.market; save();
      single = null; location.hash = 'analysis';
    });
  }

  function renderMTFStory() {
    if (!mtf) return;
    $('#mtfStory').innerHTML = `<h2>${L.t('mtf_story')} · ${L.esc(mtf.sym)}</h2>` + N.renderMTF(mtf.results, mtf.sym);
  }

  /* ---------- knowledge ---------- */
  function renderKB() {
    const K = L.knowledge;
    if (!K.find(s => s.id === st.kb)) st.kb = K[0].id;
    $('#kbToc').innerHTML = K.map(s => `<button data-kb="${s.id}" class="${s.id === st.kb ? 'active' : ''}">${(L.lang === 'en' ? s.en : s.vi).title}</button>`).join('');
    $('#kbToc').querySelectorAll('[data-kb]').forEach(b => b.onclick = () => { location.hash = 'knowledge/' + b.dataset.kb; });
    const s = K.find(x => x.id === st.kb);
    const c = L.lang === 'en' ? s.en : s.vi;
    $('#kbBody').innerHTML = `<h1>${c.title}</h1>${c.html()}`;
    window.scrollTo({ top: 0 });
  }

  /* ---------- checklist ---------- */
  const CK_GROUPS = () => [
    { id: 'steps', title: L.T('Quy trình 5 bước', 'Five steps'), items: [
      L.T('Đã xác định vị trí & xu hướng thị trường chung (VNINDEX/BTC…)', 'Market position & trend determined'),
      L.T('Tài sản hài hoà với xu hướng (RS mạnh/yếu hơn)', 'Asset in harmony with the trend (RS)'),
      L.T('Nguyên nhân (P&F) đủ lớn so với mục tiêu', 'Cause (P&F) large enough'),
      L.T('Tài sản sẵn sàng (pha C/D, đạt nhiều phép thử)', 'Asset ready (Phase C/D, tests passed)'),
      L.T('Thời điểm khớp với bước ngoặt của chỉ số', 'Timing aligned with an index turn')] },
    { id: 'buy', title: L.T('9 phép thử MUA', 'Nine buying tests'), items: L.NINE.buy.map(x => L.T(x[0], x[1])) },
    { id: 'sell', title: L.T('9 phép thử BÁN', 'Nine selling tests'), items: L.NINE.sell.map(x => L.T(x[0], x[1])) },
    { id: 'mtf', title: L.T('Đa khung & quản trị lệnh', 'Multi-timeframe & trade'), items: [
      L.T('Khung lớn (2W/1W/1D) cùng chiều với lệnh', 'Higher TFs agree with the trade'),
      L.T('Vị trí giá thuận lợi trong TR khung lớn', 'Favourable location in the higher-TF TR'),
      L.T('Khung trung (4H/1H) có sự kiện Pha C/D', 'Middle TF shows a Phase C/D event'),
      L.T('Khung nhỏ xác nhận (tích lũy/phân phối nhỏ hoàn tất)', 'Lower TF confirms (small structure complete)'),
      L.T('Cắt lỗ đặt sau Spring/LPS (hoặc UTAD/LPSY)', 'Stop placed beyond Spring/LPS (or UTAD/LPSY)'),
      L.T('R:R ≥ 3 và khối lượng lệnh theo % rủi ro', 'R:R ≥ 3 and size from risk %')] }
  ];
  function ckKey() { return 'ck.' + st.market + '.' + (currentSymbol() || 'GENERAL'); }
  function renderChecklist() {
    const data = L.store.get(ckKey(), { checks: {}, notes: '' });
    const sym = currentSymbol() || 'GENERAL';
    $('#checklist').innerHTML = `<h2>${L.t('checklist_title')}</h2>
      <div class="ck-head"><span class="sym mono" style="font-size:18px;font-weight:700">${L.esc(sym)}</span>
        <span class="muted">${L.T(L.MARKETS[st.market].vi, L.MARKETS[st.market].en)}</span>
        <button class="btn" id="ckAuto">${L.T('Gợi ý từ phân tích', 'Suggest from analysis')}</button>
        <button class="btn" id="ckSave">${L.t('save')}</button><button class="btn" id="ckExport">${L.t('export')}</button><button class="btn ghost" id="ckReset">${L.t('reset')}</button>
        <span class="muted" id="ckMsg"></span></div>
      <div class="ck-grid">${CK_GROUPS().map(g => `<div class="ck-group"><h3><span>${g.title}</span><span class="mono" data-count="${g.id}"></span></h3>
        ${g.items.map((it, k) => `<label><input type="checkbox" data-ck="${g.id}.${k}" ${data.checks[g.id + '.' + k] ? 'checked' : ''}><span>${it}</span></label>`).join('')}</div>`).join('')}</div>
      <h3 style="margin-top:18px">${L.t('notes')}</h3><textarea id="ckNotes" placeholder="${L.T('Câu chuyện Wyckoff của bạn: pha, sự kiện, kế hoạch…', 'Your Wyckoff story: phase, events, plan…')}">${L.esc(data.notes)}</textarea>`;
    const count = () => CK_GROUPS().forEach(g => {
      const n = g.items.filter((_, k) => $(`[data-ck="${g.id}.${k}"]`).checked).length;
      $(`[data-count="${g.id}"]`).textContent = n + '/' + g.items.length;
    });
    count();
    const collect = () => {
      const checks = {};
      document.querySelectorAll('[data-ck]').forEach(cb => { if (cb.checked) checks[cb.dataset.ck] = true; });
      return { checks, notes: $('#ckNotes').value };
    };
    document.querySelectorAll('[data-ck]').forEach(cb => cb.onchange = count);
    $('#ckSave').onclick = () => { L.store.set(ckKey(), collect()); $('#ckMsg').textContent = L.t('saved') + ' ✓'; };
    $('#ckReset').onclick = () => { L.store.set(ckKey(), { checks: {}, notes: '' }); renderChecklist(); };
    $('#ckExport').onclick = () => {
      const d = collect();
      const lines = [`Lai Long Master Wyckoff — ${sym} — ${new Date().toLocaleString()}`, ''];
      CK_GROUPS().forEach(g => { lines.push('## ' + g.title); g.items.forEach((it, k) => lines.push((d.checks[g.id + '.' + k] ? '[x] ' : '[ ] ') + it)); lines.push(''); });
      lines.push('## ' + L.t('notes'), d.notes);
      const a = document.createElement('a');
      a.href = URL.createObjectURL(new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' }));
      a.download = `wyckoff-checklist-${sym}.txt`;
      a.click();
      setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    };
    $('#ckAuto').onclick = () => {
      const r = single && single.r && single.sym === sym ? single.r : null;
      if (!r || r.error) { $('#ckMsg').textContent = L.T('Hãy phân tích mã này ở tab Phân tích trước.', 'Analyse this symbol in the Analysis tab first.'); return; }
      const set = (id, on) => { const cb = $(`[data-ck="${id}"]`); if (cb && on) cb.checked = true; };
      const ev = c => r.events.some(e => e.code === c);
      const has = c => r.evidence.some(e => e.code === c);
      set('buy.1', ev('SC') && ev('ST'));
      set('buy.2', (r.legVolRatio || 0) > 1.15);
      set('buy.4', has('higherLows'));
      set('buy.5', has('higherHighs'));
      set('buy.6', r.rsValue && r.rsValue.r20 > 0);
      set('buy.7', r.tr && r.phase !== 'A');
      set('sell.1', (r.legVolRatio || 2) < 0.87);
      set('sell.2', ev('BC') || ev('PSY'));
      set('sell.3', r.rsValue && r.rsValue.r20 < 0);
      set('sell.5', has('lowerHighs'));
      set('sell.6', has('lowerLows'));
      set('steps.3', r.tr && ['C', 'D'].includes(r.phase));
      count();
      $('#ckMsg').textContent = L.T('Đã đánh dấu các mục máy phát hiện — hãy kiểm tra lại bằng mắt.', 'Machine-detected items ticked — verify them by eye.');
    };
  }

  /* ---------- guide ---------- */
  function renderGuide() {
    $('#guide').innerHTML = L.lang === 'en' ? `
<h2>Guide</h2>
<h3>1. Single-timeframe analysis</h3><ol><li>Choose a market: Vietnam stocks (incl. VNINDEX, VN30), VN30F futures, Binance spot/futures (crypto, XAUUSDT gold), or a CSV file.</li><li>Type the symbol (e.g. <code>HPG</code>, <code>BTCUSDT</code>) and pick a timeframe from 2W to 1m.</li><li>Read: the chart (events, phase bands, VSA dots), the overview (structure, phase, bias, levels, P&amp;F targets), the three scenarios with trade plans, and the 8-part Wyckoff narrative.</li></ol>
<h3>2. Multi-timeframe</h3><p>Pick the timeframes and press <b>Scan</b>. The table shows trend, structure, phase, latest event, last-bar VSA and bias for each TF; the synthesis explains alignment and nested structures. Click <b>Open →</b> to jump into any TF.</p>
<h3>3. How detection works</h3><ul><li>A <b>trading range</b> starts at a significant swing (≥ 4 ATR trend into it), with the automatic reaction defining the other boundary.</li><li><b>Events</b> are found from price relative to the range and relative volume/spread (vs. the previous 20 bars).</li><li>The <b>bias</b> sums evidence: Spring/UTAD, SOS/SOW, volume on rallies vs declines, higher/lower lows, position in range, recent VSA.</li><li>P&amp;F count: box ≈ ½ ATR, 3-box reversal, columns within the TR.</li></ul>
<div class="callout">Rule-based detection is a starting point. Wyckoff is an art of judgement — always confirm by reading the chart yourself.</div>
<h3>4. Data notes</h3><ul><li>VN data from VNDirect public chart API (1m–1D native; 4H = morning/afternoon sessions; 1W/2W from daily). Prices in thousand VND.</li><li>Binance: 1000 most recent bars per TF; 2W is built from 1W.</li><li>The last bar may still be forming; the narrative uses the last <i>closed</i> bar for VSA.</li></ul>` : `
<h2>Hướng dẫn sử dụng</h2>
<h3>1. Phân tích một khung</h3><ol><li>Chọn <b>thị trường</b>: Cổ phiếu cơ sở VN (kể cả VNINDEX, VN30), Phái sinh VN30F, Binance Spot/Futures (crypto, vàng XAUUSDT), hoặc nhập file CSV.</li><li>Nhập <b>mã</b> (ví dụ <code>HPG</code>, <code>FPT</code>, <code>BTCUSDT</code>) và chọn <b>khung</b> từ 2W đến 1m.</li><li>Đọc kết quả: biểu đồ (nhãn sự kiện, dải pha A–E, chấm VSA), thẻ <b>Tổng quan</b> (cấu trúc, pha, thiên hướng, các mức giá, mục tiêu P&amp;F), <b>3 kịch bản</b> kèm kế hoạch lệnh và phần <b>Luận Wyckoff</b> 8 mục.</li></ol>
<h3>2. Đa khung</h3><p>Chọn các khung cần quét và bấm <b>Quét đa khung</b>. Bảng cho thấy xu hướng, cấu trúc, pha, sự kiện gần nhất, VSA nến cuối và thiên hướng của từng khung. Phần <b>Luận đa khung</b> giải thích sự đồng thuận và các cấu trúc lồng nhau. Bấm <b>Mở →</b> để xem chi tiết một khung.</p>
<h3>3. Máy nhận diện hoạt động thế nào?</h3><ul>
<li><b>Trading Range</b> bắt đầu tại một đỉnh/đáy quan trọng (có xu hướng ≥ 4 ATR đi vào), biên còn lại là đỉnh/đáy của phản ứng tự động (AR).</li>
<li><b>Sự kiện</b> (PS, SC, AR, ST, Spring, UTAD, SOS, LPS…) được xác định từ vị trí giá so với TR và khối lượng/biên độ <i>tương đối</i> (so với 20 nến trước).</li>
<li><b>Thiên hướng</b> = tổng các bằng chứng: Spring/UTAD, SOS/SOW, khối lượng nhịp tăng so với nhịp giảm, đáy/đỉnh nâng hay hạ, vị trí giá trong TR, tín hiệu VSA gần đây.</li>
<li><b>Đếm P&amp;F</b>: ô ≈ ½ ATR, đảo chiều 3 ô, đếm số cột trong TR.</li></ul>
<div class="callout">Máy nhận diện theo quy tắc chỉ là điểm khởi đầu. Wyckoff là nghệ thuật phán đoán — luôn tự đọc lại biểu đồ trước khi ra quyết định.</div>
<h3>4. Ghi chú dữ liệu</h3><ul><li>Dữ liệu VN lấy từ API biểu đồ công khai của VNDirect (gốc 1m–1D; 4H = phiên sáng/chiều; 1W/2W gộp từ ngày). Giá theo đơn vị nghìn đồng.</li>
<li>Binance: 1000 nến gần nhất mỗi khung; 2W được gộp từ 1W.</li><li>Nến cuối có thể đang chạy; phần VSA dùng nến <i>đã đóng</i> gần nhất.</li>
<li>CSV: hỗ trợ file xuất từ MT4/MT5 (&lt;DATE&gt; &lt;TIME&gt; &lt;OPEN&gt;…&lt;TICKVOL&gt;), TradingView (time, open, high, low, close, Volume)…</li></ul>`;
  }

  /* ---------- boot ---------- */
  $('#langBtn').onclick = () => {
    L.lang = L.lang === 'vi' ? 'en' : 'vi';
    L.store.set('lang', L.lang);
    applyLang(); renderNav(); renderControls();
    if (single) renderSingle(false);
    if (mtf) recomputeMTF(); else if (st.view === 'mtf') renderMTFEmpty();
    if (st.view === 'knowledge') renderKB();
    if (st.view === 'cmt') L.cmt.render(st.cmt || '');
    if (st.view === 'checklist') renderChecklist();
    if (st.view === 'guide') renderGuide();
  };
  $('#themeBtn').onclick = () => {
    st.theme = st.theme === 'dark' ? 'light' : 'dark'; save(); applyTheme();
    if (st.view === 'cmt') L.cmt.render(st.cmt || ''); // demo charts read theme colours at creation
  };
  window.addEventListener('hashchange', route);
  applyTheme();
  applyLang();
  if (!location.hash) location.hash = st.view; else route();
})(window.LLW);
