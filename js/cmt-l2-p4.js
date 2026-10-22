// © 2026 Lai Long Master TA. Bảo lưu mọi quyền. Không sao chép, chỉnh sửa hay dùng lại khi chưa được phép.
/* CMT Level 2 — Part 4, lessons 23–26: statistics for technicians. Written by Lai Long Master TA in its own words. */
(function (L) {
  'use strict';
  const C = L.cmt, H = C.demoHtml, css = C.css;
  const ld = () => `<span class="spinner"></span>${L.t('loading')}`;

  /* ---------- statistics helpers ---------- */
  const S = C.stat = {};
  S.mean = a => a.reduce((x, y) => x + y, 0) / a.length;
  S.sd = a => { const m = S.mean(a); return Math.sqrt(a.reduce((x, y) => x + (y - m) ** 2, 0) / (a.length - 1)); };
  S.corr = (x, y) => { const mx = S.mean(x), my = S.mean(y); let sxy = 0, sxx = 0, syy = 0; for (let i = 0; i < x.length; i++) { sxy += (x[i] - mx) * (y[i] - my); sxx += (x[i] - mx) ** 2; syy += (y[i] - my) ** 2; } return sxy / Math.sqrt(sxx * syy); };
  S.rank = a => { const idx = a.map((v, i) => [v, i]).sort((p, q) => p[0] - q[0]), r = new Array(a.length); idx.forEach((p, k) => { r[p[1]] = k + 1; }); return r; };
  S.ols = (x, y) => {
    const n = x.length, mx = S.mean(x), my = S.mean(y); let sxy = 0, sxx = 0;
    for (let i = 0; i < n; i++) { sxy += (x[i] - mx) * (y[i] - my); sxx += (x[i] - mx) ** 2; }
    const b = sxy / sxx, a = my - b * mx, res = y.map((v, i) => v - (a + b * x[i]));
    const sse = res.reduce((s, e) => s + e * e, 0), sst = y.reduce((s, v) => s + (v - my) ** 2, 0);
    const se = Math.sqrt(sse / (n - 2)), seB = se / Math.sqrt(sxx);
    let dw = 0; for (let i = 1; i < n; i++) dw += (res[i] - res[i - 1]) ** 2;
    return { a, b, r2: 1 - sse / sst, se, seB, t: b / seB, res, dw: dw / sse };
  };
  S.acf = (a, k) => { const m = S.mean(a); let num = 0, den = 0; for (let i = 0; i < a.length; i++) { den += (a[i] - m) ** 2; if (i >= k) num += (a[i] - m) * (a[i - k] - m); } return num / den; };

  /* ---------- demo: regression channel ---------- */
  H.regChan = () => C.demoShell('regChan', C.symControls('vn_stock', 'VNINDEX', '1D', ['1W', '1D', '4H']) + C.mkSel('d-n', [['50', 'N 50'], ['100', 'N 100'], ['200', 'N 200']], '100') + `<button class="btn primary d-go">${L.T('Xem', 'Show')}</button>`,
    L.T('Hồi quy tuyến tính giá đóng cửa theo thời gian trên N nến gần nhất; dải = đường hồi quy ± 2 sai số chuẩn ước lượng.', 'Linear regression of close on time over the last N bars; bands = line ± 2 standard errors of estimate.'));
  C.demoRun.regChan = box => {
    const out = box.querySelector('.demo-out'), el = box.querySelector('.demo-chart');
    C.wire(box, async () => {
      out.innerHTML = ld();
      try {
        const [mk, sym, tf] = C.readSym(box), n = +box.querySelector('.d-n').value;
        const all = await C.loadBars(mk, sym, tf), bars = all.slice(-Math.max(n, 30) - 50), win = bars.slice(-n);
        const x = win.map((_, i) => i), y = win.map(b => b.c), r = S.ols(x, y), off = bars.length - n;
        el.innerHTML = '';
        const ch = C.mkChart(el), s = C.candleSeries(ch);
        s.setData(bars.map(b => ({ time: b.t, open: b.o, high: b.h, low: b.l, close: b.c })));
        [[0, '--accent', 2], [2, '--muted', 1], [-2, '--muted', 1]].forEach(([k, col, w]) => ch.addLineSeries({ color: css(col), lineWidth: w, lineStyle: k ? 2 : 0, priceLineVisible: false, lastValueVisible: false })
          .setData(win.map((b, i) => ({ time: b.t, value: r.a + r.b * i + k * r.se }))));
        ch.timeScale().fitContent();
        const z = r.res[n - 1] / r.se, pct = r.b / S.mean(y) * 100;
        out.innerHTML = L.T(`Độ dốc ≈ <b>${L.fmtP(r.b)}/nến</b> (${pct.toFixed(3)}%/nến) · R² = <b>${r.r2.toFixed(2)}</b> · t(độ dốc) = ${r.t.toFixed(1)} · Sai số chuẩn ước lượng = ${L.fmtP(r.se)} · Giá hiện tại cách đường hồi quy <b>${z.toFixed(2)} SE</b> · Durbin–Watson = ${r.dw.toFixed(2)}. <span class="muted">DW gần 0 cho thấy phần dư tự tương quan mạnh — đặc trưng của chuỗi giá, nên t-stat ở đây bị thổi phồng; đây là lý do Bài 26 nhấn mạnh tính dừng.</span>`,
          `Slope ≈ <b>${L.fmtP(r.b)}/bar</b> (${pct.toFixed(3)}%/bar) · R² = <b>${r.r2.toFixed(2)}</b> · slope t = ${r.t.toFixed(1)} · SE of estimate = ${L.fmtP(r.se)} · price is <b>${z.toFixed(2)} SE</b> from the line · Durbin–Watson = ${r.dw.toFixed(2)}. <span class="muted">DW near 0 means strongly autocorrelated residuals — typical of price series — so the t-stat is inflated; hence Lesson 26’s stress on stationarity.</span>`);
      } catch (e) { C.err(out, e); }
    });
  };

  /* ---------- demo: correlation lab ---------- */
  H.corrLab = (a = 'BTCUSDT', b = 'ETHUSDT', mk = 'bn_spot', tf = '1D') => C.demoShell('corrLab', C.symControls(mk, a, tf, ['1W', '1D', '4H', '1H', '15m']) + `<input class="d-sym2" value="${b}" spellcheck="false">` + C.mkSel('d-n', [['20', L.T('Lăn 20', 'Rolling 20')], ['60', L.T('Lăn 60', 'Rolling 60')]], '60') + `<button class="btn primary d-go">${L.T('Xem', 'Show')}</button>`,
    L.T('So sánh hai mã cùng thị trường: tương quan của <b>lợi suất</b> (đúng) với tương quan của <b>giá</b> (dễ giả tạo), beta và tương quan lăn.', 'Two symbols in one market: correlation of <b>returns</b> (proper) vs of <b>prices</b> (prone to spuriousness), beta and rolling correlation.'));
  C.demoRun.corrLab = box => {
    const out = box.querySelector('.demo-out'), el = box.querySelector('.demo-chart');
    C.wire(box, async () => {
      out.innerHTML = ld();
      try {
        const [mk, s1, tf] = C.readSym(box), s2 = box.querySelector('.d-sym2').value.trim().toUpperCase(), n = +box.querySelector('.d-n').value;
        const [a, b] = await Promise.all([C.loadBars(mk, s1, tf), C.loadBars(mk, s2, tf)]);
        const mb = new Map(b.map(x => [x.t, x.c])), j = a.filter(x => mb.has(x.t)).map(x => ({ t: x.t, p: x.c, q: mb.get(x.t) })).slice(-400);
        if (j.length < n + 10) throw new Error(L.T('Không đủ dữ liệu trùng thời gian.', 'Not enough overlapping data.'));
        const ra = [], rb = [], tt = [];
        for (let i = 1; i < j.length; i++) { ra.push(Math.log(j[i].p / j[i - 1].p)); rb.push(Math.log(j[i].q / j[i - 1].q)); tt.push(j[i].t); }
        const rRet = S.corr(ra, rb), rPx = S.corr(j.map(x => x.p), j.map(x => x.q)), rSp = S.corr(S.rank(ra), S.rank(rb)), reg = S.ols(rb, ra), N = ra.length;
        const tStat = rRet * Math.sqrt(N - 2) / Math.sqrt(1 - rRet * rRet);
        const roll = []; for (let i = n; i <= ra.length; i++) roll.push({ time: tt[i - 1], value: S.corr(ra.slice(i - n, i), rb.slice(i - n, i)) });
        el.innerHTML = '';
        const ch = C.mkChart(el);
        ch.addLineSeries({ color: css('--accent'), lineWidth: 2, priceLineVisible: false }).setData(roll);
        ch.addLineSeries({ color: css('--muted'), lineWidth: 1, lineStyle: 2, priceLineVisible: false, lastValueVisible: false }).setData(roll.map(p => ({ time: p.time, value: 0 })));
        ch.timeScale().fitContent();
        out.innerHTML = L.T(`${N} quan sát. Tương quan lợi suất Pearson <b>${rRet.toFixed(2)}</b> (t = ${tStat.toFixed(1)}), Spearman ${rSp.toFixed(2)}, r² = ${(rRet * rRet).toFixed(2)}. Beta của ${s1} theo ${s2} = <b>${reg.b.toFixed(2)}</b>. Tương quan <b>giá</b> = ${rPx.toFixed(2)} — thường cao hơn và kém tin cậy vì hai chuỗi giá đều có xu hướng. Đường trên biểu đồ: tương quan lăn ${n} kỳ — cho thấy tương quan không cố định.`,
          `${N} observations. Pearson return correlation <b>${rRet.toFixed(2)}</b> (t = ${tStat.toFixed(1)}), Spearman ${rSp.toFixed(2)}, r² = ${(rRet * rRet).toFixed(2)}. Beta of ${s1} on ${s2} = <b>${reg.b.toFixed(2)}</b>. <b>Price</b> correlation = ${rPx.toFixed(2)} — usually higher and less reliable because both series trend. Line: ${n}-period rolling correlation — correlation is not constant.`);
      } catch (e) { C.err(out, e); }
    });
  };

  /* ---------- demo: autocorrelation ---------- */
  H.acfLab = () => C.demoShell('acfLab', C.symControls('bn_spot', 'BTCUSDT', '1D', ['1W', '1D', '4H', '1H']) + `<button class="btn primary d-go">${L.T('Xem', 'Show')}</button>`,
    L.T('Hệ số tự tương quan (ACF) của <b>giá</b> và của <b>lợi suất</b>, độ trễ 1–10. Dải ±2/√n là ngưỡng có ý nghĩa gần đúng.', 'Autocorrelation (ACF) of <b>prices</b> vs <b>returns</b>, lags 1–10; ±2/√n is the approximate significance band.'));
  C.demoRun.acfLab = box => {
    const out = box.querySelector('.demo-out'), el = box.querySelector('.demo-chart');
    C.wire(box, async () => {
      out.innerHTML = ld();
      try {
        const [mk, sym, tf] = C.readSym(box), bars = (await C.loadBars(mk, sym, tf)).slice(-500);
        const px = bars.map(b => b.c), r = px.slice(1).map((p, i) => Math.log(p / px[i])), band = 2 / Math.sqrt(r.length);
        const row = k => { const a = S.acf(px, k), q = S.acf(r, k), sig = Math.abs(q) > band; return `<tr><td>${k}</td><td>${a.toFixed(2)}</td><td${sig ? ' style="color:var(--accent);font-weight:700"' : ''}>${q.toFixed(3)}</td></tr>`; };
        el.innerHTML = '';
        el.style.display = 'none';
        let lb = 0; for (let k = 1; k <= 10; k++) lb += S.acf(r, k) ** 2 / (r.length - k);
        lb *= r.length * (r.length + 2);
        out.innerHTML = `<table class="tbl"><thead><tr><th>${L.T('Độ trễ', 'Lag')}</th><th>ACF ${L.T('giá', 'price')}</th><th>ACF ${L.T('lợi suất', 'returns')}</th></tr></thead><tbody>${Array.from({ length: 10 }, (_, i) => row(i + 1)).join('')}</tbody></table>
          <p>${L.T(`n = ${r.length}; ngưỡng ±${band.toFixed(3)}. Ljung–Box Q(10) = <b>${lb.toFixed(1)}</b> (giá trị tới hạn χ²(10) ở 5% ≈ 18.3). ACF của giá gần 1 và giảm rất chậm → <b>không dừng</b>; ACF lợi suất nhỏ → gần dừng. Ô tô màu là độ trễ vượt ngưỡng.`,
            `n = ${r.length}; band ±${band.toFixed(3)}. Ljung–Box Q(10) = <b>${lb.toFixed(1)}</b> (5% χ²(10) critical ≈ 18.3). Price ACF near 1 decaying slowly → <b>nonstationary</b>; small return ACF → near-stationary. Highlighted cells exceed the band.`)}</p>`;
      } catch (e) { C.err(out, e); }
    });
  };

  /* ---------- calculator: t-test / confidence interval ---------- */
  H.tCalc = () => C.calcShell('tCalc', `${C.num('m', 0.4, L.T('Trung bình mẫu', 'Sample mean'), 0.1)}${C.num('s', 2.5, L.T('Độ lệch chuẩn', 'St. dev.'), 0.1)}${C.num('n', 100, 'n', 1)}${C.num('mu', 0, 'μ₀', 0.1)}`,
    L.T('Kiểm định t một mẫu: lợi nhuận trung bình mỗi giao dịch có thật sự khác μ₀ không?', 'One-sample t-test: is the mean return per trade really different from μ₀?'));
  C.demoRun.tCalc = box => {
    const run = () => {
      const g = c => +box.querySelector('.' + c).value, n = Math.max(2, g('n')), se = g('s') / Math.sqrt(n), t = (g('m') - g('mu')) / se;
      const crit = n > 120 ? 1.96 : [12.71, 4.30, 3.18, 2.78, 2.57, 2.45, 2.36, 2.31, 2.26, 2.23][n - 2] || (n > 60 ? 2.0 : n > 30 ? 2.04 : 2.09);
      const lo = g('m') - crit * se, hi = g('m') + crit * se, sig = Math.abs(t) > crit;
      box.querySelector('.demo-out').innerHTML = L.T(`Sai số chuẩn = s/√n = <b>${se.toFixed(3)}</b>. t = (x̄ − μ₀)/SE = <b>${t.toFixed(2)}</b> (df = ${n - 1}, ngưỡng hai phía 5% ≈ ${crit}). Khoảng tin cậy 95%: <b>${lo.toFixed(3)} … ${hi.toFixed(3)}</b>. ${sig ? '→ <b>Bác bỏ H₀</b> ở mức 5%.' : '→ <b>Chưa đủ bằng chứng</b> bác bỏ H₀.'}`,
        `SE = s/√n = <b>${se.toFixed(3)}</b>. t = <b>${t.toFixed(2)}</b> (df ${n - 1}, 5% two-tailed ≈ ${crit}). 95% CI: <b>${lo.toFixed(3)} … ${hi.toFixed(3)}</b>. ${sig ? '→ <b>Reject H₀</b> at 5%.' : '→ <b>Insufficient evidence</b> to reject H₀.'}`);
    };
    box.querySelectorAll('.d-num').forEach(i => { i.oninput = run; });
    run();
  };

  /* ================= L2-23 ================= */
  C.addLesson('l2-23', {
    goals: ['Phân biệt tổng thể và mẫu, tham số và thống kê.', 'Giải thích phân phối mẫu, định lý giới hạn trung tâm và sai số chuẩn.', 'Xây dựng khoảng tin cậy.', 'Thực hiện kiểm định giả thuyết và hiểu sai lầm loại I, loại II, p-value.'],
    body: () => `
<h3>1. Từ mô tả sang suy luận</h3>
<p>Thống kê mô tả (Level 1) tóm tắt dữ liệu đang có. <b>Thống kê suy luận</b> dùng một <b>mẫu</b> để rút ra kết luận về <b>tổng thể</b> mà ta không quan sát được hết. Với nhà PTKT, kết quả backtest 10 năm chỉ là một mẫu của mọi điều kiện thị trường có thể xảy ra — câu hỏi luôn là: "kết quả này có phải do may mắn không?"</p>
<table class="tbl"><tbody><tr><td>Tham số (tổng thể)</td><td>μ, σ — cố định nhưng chưa biết</td></tr><tr><td>Thống kê (mẫu)</td><td>x̄, s — tính được, thay đổi theo từng mẫu</td></tr></tbody></table>
<h3>2. Phân phối mẫu và định lý giới hạn trung tâm</h3>
<ul><li>Nếu lấy rất nhiều mẫu cỡ n và tính x̄ cho mỗi mẫu, các x̄ tạo thành <b>phân phối mẫu</b> của trung bình.</li>
<li><b>Định lý giới hạn trung tâm (CLT)</b>: với n đủ lớn (thường ≥ 30), phân phối mẫu của x̄ xấp xỉ <b>chuẩn</b>, dù tổng thể không chuẩn, với trung bình μ và độ lệch chuẩn σ/√n.</li>
<li><b>Sai số chuẩn</b> SE = s/√n: độ không chắc chắn của x̄. Muốn giảm SE một nửa phải tăng n gấp bốn.</li></ul>
<h3>3. Khoảng tin cậy</h3>
<p><b>x̄ ± t* × SE</b>, với t* phụ thuộc mức tin cậy và bậc tự do (df = n − 1). Với n lớn, t* ≈ 1.645 (90%), 1.96 (95%), 2.576 (99%). Diễn giải: nếu lặp lại quy trình lấy mẫu nhiều lần, 95% các khoảng như vậy sẽ chứa μ.</p>
<p>Dùng <b>phân phối t</b> (đuôi dày hơn chuẩn) khi σ chưa biết và phải ước lượng bằng s; khi n tăng, t tiến về chuẩn.</p>
<h3>4. Kiểm định giả thuyết</h3>
<ol><li>Phát biểu <b>H₀</b> (giả thuyết không — ví dụ: lợi nhuận trung bình của hệ thống = 0) và <b>H₁</b> (≠ 0, hoặc &gt; 0 với kiểm định một phía).</li>
<li>Chọn mức ý nghĩa α (thường 5%).</li>
<li>Tính thống kê kiểm định: <b>t = (x̄ − μ₀)/SE</b>.</li>
<li>So với giá trị tới hạn hoặc tính <b>p-value</b> (xác suất thu được kết quả cực đoan như vậy <i>nếu H₀ đúng</i>).</li>
<li>p &lt; α → bác bỏ H₀; ngược lại → "chưa đủ bằng chứng" (không phải "chứng minh H₀ đúng").</li></ol>
<table class="tbl"><thead><tr><th></th><th>H₀ đúng</th><th>H₀ sai</th></tr></thead><tbody>
<tr><td>Bác bỏ H₀</td><td><b>Sai lầm loại I</b> (α) — tin một hệ thống vô dụng là tốt</td><td>Đúng (lực kiểm định = 1 − β)</td></tr>
<tr><td>Không bác bỏ</td><td>Đúng</td><td><b>Sai lầm loại II</b> (β) — bỏ lỡ hệ thống tốt</td></tr></tbody></table>
<div class="callout"><b>Ví dụ</b>: 100 giao dịch, lợi nhuận trung bình 0.4%, độ lệch chuẩn 2.5%. SE = 0.25%, t = 1.6 &lt; 1.98 → chưa đủ bằng chứng hệ thống có lợi thế ở mức 5%. Cần thêm giao dịch hoặc lợi thế lớn hơn.</div>
${H.tCalc()}
<h3>5. Cảnh báo cho nhà PTKT</h3>
<ul><li>Lợi suất tài chính có <b>đuôi dày</b> và không độc lập hoàn toàn → kiểm định t chỉ là xấp xỉ.</li>
<li>Thử nhiều quy tắc rồi chọn quy tắc tốt nhất làm tăng khả năng sai lầm loại I (thiên lệch đào bới dữ liệu — Bài 33, 36).</li>
<li>Ý nghĩa thống kê ≠ ý nghĩa kinh tế: lợi thế có ý nghĩa thống kê có thể bị phí giao dịch xoá sạch.</li></ul>`,
    keys: ['Suy luận: dùng mẫu (x̄, s) để kết luận về tổng thể (μ, σ).', 'CLT: x̄ xấp xỉ chuẩn với n đủ lớn; SE = s/√n.', 'Khoảng tin cậy = x̄ ± t* × SE; dùng phân phối t khi σ chưa biết.', 'Kiểm định: H₀/H₁, α, t = (x̄ − μ₀)/SE, p-value; không bác bỏ ≠ chứng minh H₀.', 'Loại I = bác bỏ H₀ đúng (α); loại II = không bác bỏ H₀ sai (β); lực = 1 − β.', 'Đuôi dày, đào bới dữ liệu, chi phí giao dịch làm giảm giá trị của ý nghĩa thống kê.'],
    terms: [['Inferential statistics', 'Thống kê suy luận'], ['Sampling distribution', 'Phân phối mẫu'], ['Central limit theorem', 'Định lý giới hạn trung tâm'], ['Standard error', 'Sai số chuẩn'], ['Confidence interval', 'Khoảng tin cậy'], ['Null hypothesis', 'Giả thuyết không'], ['p-value', 'Giá trị p'], ['Type I / II error', 'Sai lầm loại I / II'], ['Power', 'Lực kiểm định'], ['Degrees of freedom', 'Bậc tự do']]
  }, {
    goals: ['Distinguish population/sample, parameter/statistic.', 'Explain sampling distributions, CLT and standard error.', 'Build confidence intervals.', 'Run hypothesis tests; Type I/II errors and p-values.'],
    body: () => `
<h3>1. Inference</h3><p>Use a sample to conclude about an unobservable population. A backtest is one sample — was it luck?</p>
<h3>2. Sampling distribution and CLT</h3><ul><li>x̄ is approximately normal for large n (≥ 30), mean μ, st.dev σ/√n.</li><li>SE = s/√n; halving SE needs 4× n.</li></ul>
<h3>3. Confidence intervals</h3><p>x̄ ± t*·SE; t* ≈ 1.645/1.96/2.576 for 90/95/99% with large n. Use t when σ is unknown.</p>
<h3>4. Hypothesis testing</h3><ol><li>H₀ and H₁.</li><li>Choose α.</li><li>t = (x̄ − μ₀)/SE.</li><li>Compare with critical value / p-value.</li><li>Reject or "insufficient evidence".</li></ol>
<table class="tbl"><tbody><tr><td>Type I (α)</td><td>reject a true H₀ — trust a useless system</td></tr><tr><td>Type II (β)</td><td>keep a false H₀ — miss a good system</td></tr><tr><td>Power</td><td>1 − β</td></tr></tbody></table>
<div class="callout">100 trades, mean 0.4%, sd 2.5% → SE 0.25%, t = 1.6 → not significant at 5%.</div>${H.tCalc()}
<h3>5. Caveats</h3><ul><li>Fat tails and dependence.</li><li>Multiple testing inflates Type I errors.</li><li>Statistical ≠ economic significance.</li></ul>`,
    keys: ['Sample → population.', 'CLT; SE = s/√n.', 'CI = x̄ ± t*·SE.', 't-test, p-value.', 'Type I/II, power.', 'Caveats.'],
    terms: [['Standard error', 's/√n'], ['p-value', 'Probability of results this extreme if H₀ is true'], ['Power', '1 − β']]
  }, [
    ['Thống kê suy luận dùng để:', 'Inferential statistics is used to:', ['Rút ra kết luận về tổng thể từ một mẫu', 'Chỉ tóm tắt dữ liệu', 'Vẽ biểu đồ', 'Tính phí'], ['Draw conclusions about a population from a sample', 'Only summarise data', 'Draw charts', 'Compute fees'], 0, '', ''],
    ['μ và σ là:', 'μ and σ are:', ['Tham số của tổng thể', 'Thống kê của mẫu', 'Giá trị p', 'Bậc tự do'], ['Population parameters', 'Sample statistics', 'p-values', 'Degrees of freedom'], 0, '', ''],
    ['Định lý giới hạn trung tâm phát biểu rằng với n đủ lớn:', 'The CLT states that for large n:', ['Phân phối mẫu của x̄ xấp xỉ chuẩn', 'Tổng thể trở thành chuẩn', 'Mọi mẫu bằng nhau', 'σ = 0'], ['The sampling distribution of x̄ is approximately normal', 'The population becomes normal', 'All samples are equal', 'σ = 0'], 0, '', ''],
    ['s = 3%, n = 36. Sai số chuẩn của trung bình:', 's = 3%, n = 36. Standard error:', ['0.083%', '0.5%', '3%', '18%'], null, 1, '3/√36 = 0.5.', ''],
    ['Muốn giảm sai số chuẩn một nửa, cỡ mẫu phải:', 'To halve the standard error, sample size must:', ['Tăng gấp đôi', 'Tăng gấp bốn', 'Giảm một nửa', 'Không đổi'], ['Double', 'Quadruple', 'Halve', 'Stay'], 1, 'SE tỷ lệ với 1/√n.', 'SE ∝ 1/√n.'],
    ['x̄ = 1.2, SE = 0.4, n lớn. Khoảng tin cậy 95%:', 'x̄ = 1.2, SE = 0.4, large n. 95% CI:', ['0.416 – 1.984', '0.8 – 1.6', '1.0 – 1.4', '0 – 2.4'], null, 0, '1.2 ± 1.96 × 0.4.', ''],
    ['Phân phối t được dùng thay cho phân phối chuẩn khi:', 'The t-distribution replaces the normal when:', ['σ tổng thể chưa biết và được ước lượng bằng s', 'n vô hạn', 'Dữ liệu không có', 'Luôn luôn'], ['Population σ is unknown and estimated by s', 'n is infinite', 'No data', 'Always'], 0, '', ''],
    ['So với phân phối chuẩn, phân phối t có:', 'Compared with the normal, the t-distribution has:', ['Đuôi dày hơn, tiến về chuẩn khi df tăng', 'Đuôi mỏng hơn', 'Không đối xứng', 'Trung bình khác 0'], ['Fatter tails, converging as df grows', 'Thinner tails', 'Asymmetry', 'Non-zero mean'], 0, '', ''],
    ['x̄ = 0.6, μ₀ = 0, s = 3, n = 100. Thống kê t:', 'x̄ 0.6, μ₀ 0, s 3, n 100. t =', ['0.2', '2', '6', '20'], null, 1, 'SE = 0.3; t = 0.6/0.3.', ''],
    ['p-value là:', 'The p-value is:', ['Xác suất có kết quả cực đoan như vậy nếu H₀ đúng', 'Xác suất H₀ đúng', 'Xác suất H₁ đúng', 'Mức ý nghĩa'], ['Probability of results this extreme if H₀ is true', 'Probability H₀ is true', 'Probability H₁ is true', 'The significance level'], 0, '', ''],
    ['p = 0.03, α = 0.05. Kết luận:', 'p = 0.03, α = 0.05. Conclusion:', ['Bác bỏ H₀', 'Chấp nhận H₀ là đúng', 'Không kết luận được', 'Tăng α'], ['Reject H₀', 'Accept H₀ as true', 'No conclusion', 'Raise α'], 0, '', ''],
    ['Không bác bỏ H₀ có nghĩa là:', 'Failing to reject H₀ means:', ['Chưa đủ bằng chứng chống lại H₀', 'H₀ đã được chứng minh đúng', 'H₁ đúng', 'Dữ liệu sai'], ['Insufficient evidence against H₀', 'H₀ is proven', 'H₁ is true', 'Data is wrong'], 0, '', ''],
    ['Kết luận một hệ thống ngẫu nhiên là có lợi thế là sai lầm:', 'Concluding a random system has an edge is a:', ['Loại I', 'Loại II', 'Đo lường', 'Làm tròn'], ['Type I error', 'Type II error', 'Measurement error', 'Rounding error'], 0, '', ''],
    ['Bỏ qua một hệ thống thật sự có lợi thế là sai lầm:', 'Rejecting a system that truly has an edge is a:', ['Loại I', 'Loại II', 'Chọn mẫu', 'Không sai'], ['Type I', 'Type II', 'Sampling', 'Not an error'], 1, '', ''],
    ['Lực kiểm định bằng:', 'Statistical power equals:', ['1 − β', 'α', 'β', '1 − α'], null, 0, '', ''],
    ['Giảm α từ 5% xuống 1% (giữ nguyên n) thường:', 'Lowering α from 5% to 1% (same n) usually:', ['Giảm sai lầm loại I nhưng tăng sai lầm loại II', 'Giảm cả hai', 'Tăng cả hai', 'Không ảnh hưởng'], ['Cuts Type I but raises Type II errors', 'Cuts both', 'Raises both', 'No effect'], 0, '', ''],
    ['Bậc tự do của kiểm định t một mẫu cỡ n:', 'Degrees of freedom of a one-sample t-test of size n:', ['n', 'n − 1', 'n − 2', 'n + 1'], null, 1, '', ''],
    ['Vì sao kiểm định t trên lợi suất tài chính chỉ là xấp xỉ?', 'Why is a t-test on financial returns only approximate?', ['Lợi suất có đuôi dày và không hoàn toàn độc lập', 'Lợi suất luôn chuẩn', 'Không có dữ liệu', 'Do luật'], ['Returns have fat tails and are not fully independent', 'Returns are always normal', 'No data', 'Law'], 0, '', ''],
    ['Thử 200 quy tắc rồi chọn quy tắc có p nhỏ nhất làm tăng:', 'Testing 200 rules and picking the lowest p raises:', ['Khả năng sai lầm loại I', 'Lực kiểm định thật', 'Cỡ mẫu', 'Không gì'], ['The chance of a Type I error', 'True power', 'Sample size', 'Nothing'], 0, '', ''],
    ['Một lợi thế "có ý nghĩa thống kê" vẫn có thể vô dụng vì:', 'A "statistically significant" edge may still be useless because:', ['Chi phí giao dịch xoá sạch lợi nhuận', 'p quá nhỏ', 'n quá lớn', 'Không thể'], ['Transaction costs erase it', 'p is too small', 'n is too large', 'Impossible'], 0, '', '']
  ]);

  /* ================= L2-24 ================= */
  C.addLesson('l2-24', {
    goals: ['Tính và diễn giải hiệp phương sai, hệ số tương quan Pearson và Spearman.', 'Kiểm định ý nghĩa của hệ số tương quan.', 'Nhận diện tương quan giả tạo và hạn chế của tương quan.', 'Ứng dụng tương quan trong phân tích liên thị trường và đa dạng hoá.'],
    body: () => `
<h3>1. Hiệp phương sai và tương quan</h3>
<p><b>Hiệp phương sai</b> cov(X,Y) = Σ(x − x̄)(y − ȳ)/(n − 1): dương khi hai biến cùng chiều, âm khi ngược chiều. Nhược điểm: phụ thuộc đơn vị đo nên khó so sánh.</p>
<p><b>Hệ số tương quan Pearson</b> r = cov(X,Y)/(s<sub>X</sub>·s<sub>Y</sub>) chuẩn hoá về khoảng <b>−1 … +1</b>. r đo mức độ quan hệ <b>tuyến tính</b>.</p>
<table class="tbl"><tbody><tr><td>|r| &lt; 0.3</td><td>Yếu</td></tr><tr><td>0.3 – 0.7</td><td>Trung bình</td></tr><tr><td>&gt; 0.7</td><td>Mạnh</td></tr></tbody></table>
<p><b>r²</b> (hệ số xác định) = tỷ lệ biến thiên của Y được giải thích bởi quan hệ tuyến tính với X. r = 0.6 → chỉ 36% được giải thích.</p>
<h3>2. Tương quan hạng Spearman</h3>
<p>Thay giá trị bằng <b>thứ hạng</b> rồi tính Pearson trên thứ hạng. Ưu điểm: bắt được quan hệ <b>đơn điệu</b> phi tuyến và <b>ít nhạy với giá trị ngoại lai</b> — phù hợp với dữ liệu tài chính đuôi dày.</p>
<h3>3. Kiểm định ý nghĩa</h3>
<p>H₀: ρ = 0. Thống kê: <b>t = r·√(n − 2)/√(1 − r²)</b>, df = n − 2. Với n lớn, ngay cả r nhỏ cũng có thể có ý nghĩa thống kê — nhưng chưa chắc có ý nghĩa thực tế.</p>
<div class="callout"><b>Ví dụ</b>: r = 0.25, n = 120. t = 0.25 × √118 / √(1 − 0.0625) ≈ 0.25 × 10.86 / 0.968 ≈ <b>2.81</b> &gt; 1.98 → có ý nghĩa ở 5%, nhưng r² chỉ 6%.</div>
<h3>4. Bẫy và hạn chế</h3>
<ul><li><b>Tương quan ≠ nhân quả</b>: có thể có biến thứ ba chung (lạm phát tác động cả vàng và trái phiếu).</li>
<li><b>Tương quan giả tạo trên chuỗi giá</b>: hai chuỗi có xu hướng (không dừng) thường cho r rất cao dù không liên quan. Hãy tính tương quan trên <b>lợi suất</b> (thay đổi), không phải mức giá.</li>
<li><b>Ngoại lai</b>: một vài điểm cực đoan có thể làm r thay đổi mạnh.</li>
<li><b>Phi tuyến</b>: r ≈ 0 không có nghĩa là không có quan hệ (ví dụ quan hệ hình chữ U).</li>
<li><b>Không ổn định</b>: tương quan thay đổi theo chế độ thị trường; trong khủng hoảng, tương quan giữa các tài sản rủi ro thường <b>tăng về 1</b> đúng lúc cần đa dạng hoá nhất.</li></ul>
<h3>5. Ứng dụng</h3>
<ul><li>Liên thị trường (Bài 28): đo quan hệ cổ phiếu – trái phiếu – USD – hàng hoá bằng <b>tương quan lăn</b>.</li>
<li>Đa dạng hoá: kết hợp tài sản tương quan thấp giảm biến động danh mục.</li>
<li>Kiểm tra trùng lặp chỉ báo: hai chỉ báo tương quan 0.95 thì dùng cả hai không thêm thông tin (đa cộng tuyến — Bài 25).</li></ul>
${H.corrLab()}`,
    keys: ['cov phụ thuộc đơn vị; r = cov/(sX·sY) ∈ [−1, 1], đo quan hệ tuyến tính.', 'r² = tỷ lệ biến thiên được giải thích.', 'Spearman dùng thứ hạng: bắt quan hệ đơn điệu, chống ngoại lai.', 'Kiểm định: t = r√(n−2)/√(1−r²), df = n − 2.', 'Tương quan ≠ nhân quả; tính trên lợi suất, không trên giá; ngoại lai; phi tuyến; không ổn định (tăng về 1 trong khủng hoảng).', 'Ứng dụng: liên thị trường (tương quan lăn), đa dạng hoá, loại bỏ chỉ báo trùng lặp.'],
    terms: [['Covariance', 'Hiệp phương sai'], ['Pearson correlation', 'Tương quan Pearson'], ['Spearman rank correlation', 'Tương quan hạng Spearman'], ['Coefficient of determination', 'Hệ số xác định (r²)'], ['Spurious correlation', 'Tương quan giả tạo'], ['Rolling correlation', 'Tương quan lăn']]
  }, {
    goals: ['Compute and read covariance, Pearson and Spearman.', 'Test a correlation’s significance.', 'Recognise spurious correlation and limits.', 'Apply correlation in intermarket work and diversification.'],
    body: () => `
<h3>1. Covariance and correlation</h3><p>cov is unit-dependent; r = cov/(sX·sY) ∈ [−1, 1] measures linear association. r² = explained share.</p>
<h3>2. Spearman</h3><p>Pearson on ranks: monotonic relations, robust to outliers.</p>
<h3>3. Significance</h3><p>t = r√(n−2)/√(1−r²), df n − 2.</p><div class="callout">r 0.25, n 120 → t ≈ 2.81 (significant) yet r² = 6%.</div>
<h3>4. Pitfalls</h3><ul><li>Correlation ≠ causation.</li><li>Spurious correlation of trending prices — use returns.</li><li>Outliers.</li><li>Nonlinearity.</li><li>Instability — correlations rise toward 1 in crises.</li></ul>
<h3>5. Uses</h3><ul><li>Intermarket rolling correlations.</li><li>Diversification.</li><li>Redundant indicators.</li></ul>${H.corrLab()}`,
    keys: ['r and r².', 'Spearman.', 't-test for r.', 'Pitfalls.', 'Uses.'],
    terms: [['Spurious correlation', 'High r between unrelated trending series'], ['Spearman', 'Rank correlation']]
  }, [
    ['Nhược điểm chính của hiệp phương sai:', 'Covariance’s main drawback:', ['Phụ thuộc đơn vị đo nên khó so sánh', 'Luôn dương', 'Không tính được', 'Luôn bằng 1'], ['Unit-dependent, hard to compare', 'Always positive', 'Uncomputable', 'Always 1'], 0, '', ''],
    ['Hệ số tương quan Pearson nằm trong khoảng:', 'Pearson r lies in:', ['0 … 1', '−1 … +1', '−∞ … +∞', '0 … 100'], null, 1, '', ''],
    ['cov = 0.0006, sX = 0.02, sY = 0.05. r =', 'cov 0.0006, sX 0.02, sY 0.05. r =', ['0.06', '0.6', '0.3', '0.0006'], null, 1, '0.0006/(0.001).', ''],
    ['r = 0.7. Tỷ lệ biến thiên được giải thích:', 'r = 0.7. Share of variance explained:', ['70%', '49%', '84%', '30%'], null, 1, 'r² = 0.49.', ''],
    ['Pearson đo loại quan hệ nào?', 'Pearson measures which relation?', ['Tuyến tính', 'Mọi quan hệ', 'Chỉ nhân quả', 'Chỉ phi tuyến'], ['Linear', 'Any', 'Causal only', 'Nonlinear only'], 0, '', ''],
    ['Ưu điểm của tương quan Spearman:', 'Spearman’s advantage:', ['Ít nhạy với ngoại lai, bắt quan hệ đơn điệu', 'Luôn lớn hơn Pearson', 'Không cần dữ liệu', 'Đo nhân quả'], ['Robust to outliers, captures monotonic relations', 'Always larger', 'Needs no data', 'Measures causation'], 0, '', ''],
    ['Thống kê kiểm định cho r:', 'Test statistic for r:', ['r√(n−2)/√(1−r²)', 'r × n', 'r/n', '(1 − r)/n'], null, 0, '', ''],
    ['r = 0.5, n = 27. Thống kê t ≈', 'r 0.5, n 27. t ≈', ['1.0', '2.89', '5.0', '13.5'], null, 1, '0.5 × 5 / 0.866.', ''],
    ['Bậc tự do khi kiểm định hệ số tương quan:', 'df when testing a correlation:', ['n', 'n − 1', 'n − 2', '2'], null, 2, '', ''],
    ['Vì sao nên tính tương quan trên lợi suất thay vì giá?', 'Why correlate returns rather than prices?', ['Chuỗi giá có xu hướng tạo tương quan giả tạo cao', 'Lợi suất luôn lớn hơn', 'Giá không có dữ liệu', 'Không có lý do'], ['Trending price series create spurious high correlation', 'Returns are bigger', 'Prices lack data', 'No reason'], 0, '', ''],
    ['r ≈ 0 giữa X và Y có nghĩa:', 'r ≈ 0 between X and Y means:', ['Không có quan hệ tuyến tính (có thể vẫn có quan hệ phi tuyến)', 'Không có bất kỳ quan hệ nào', 'X gây ra Y', 'Dữ liệu sai'], ['No linear relation (a nonlinear one may exist)', 'No relation at all', 'X causes Y', 'Bad data'], 0, '', ''],
    ['Trong khủng hoảng, tương quan giữa các tài sản rủi ro thường:', 'In crises, correlations among risky assets tend to:', ['Tăng về gần 1', 'Giảm về 0', 'Âm hoàn toàn', 'Không đổi'], ['Rise toward 1', 'Fall to 0', 'Turn fully negative', 'Stay constant'], 0, '', ''],
    ['Vàng và trái phiếu cùng tăng do lạm phát giảm kỳ vọng lãi suất thực. Đây là ví dụ của:', 'Gold and bonds both rise as real-rate expectations fall. This illustrates:', ['Biến thứ ba chung — tương quan ≠ nhân quả', 'Vàng gây ra trái phiếu', 'Tương quan giả tạo do ngoại lai', 'Spearman'], ['A common third variable — correlation ≠ causation', 'Gold causes bonds', 'Outlier spuriousness', 'Spearman'], 0, '', ''],
    ['n = 1.000 và r = 0.08 có ý nghĩa thống kê. Điều này cho thấy:', 'n 1,000 and r 0.08 is significant. This shows:', ['Ý nghĩa thống kê có thể không có ý nghĩa thực tế (r² < 1%)', 'Quan hệ rất mạnh', 'Lỗi tính toán', 'Nhân quả'], ['Statistical significance may lack practical meaning (r² < 1%)', 'A very strong relation', 'Error', 'Causation'], 0, '', ''],
    ['Tương quan lăn dùng để:', 'Rolling correlation is used to:', ['Theo dõi quan hệ thay đổi theo thời gian', 'Tăng r', 'Loại ngoại lai', 'Tính beta cố định'], ['Track a relationship over time', 'Raise r', 'Remove outliers', 'Fix beta'], 0, '', ''],
    ['Hai chỉ báo tương quan 0.95 với nhau. Dùng cả hai trong một mô hình:', 'Two indicators correlated 0.95. Using both:', ['Gần như không thêm thông tin, gây đa cộng tuyến', 'Tăng gấp đôi độ chính xác', 'Bắt buộc', 'Giảm rủi ro'], ['Adds little information and causes multicollinearity', 'Doubles accuracy', 'Required', 'Cuts risk'], 0, '', ''],
    ['Kết hợp tài sản có tương quan thấp giúp:', 'Combining low-correlation assets:', ['Giảm biến động danh mục', 'Tăng biến động', 'Không ảnh hưởng', 'Tăng phí'], ['Reduces portfolio volatility', 'Raises volatility', 'No effect', 'Raises fees'], 0, '', ''],
    ['Một ngoại lai cực đoan có thể:', 'A single extreme outlier can:', ['Làm thay đổi mạnh hệ số Pearson', 'Không ảnh hưởng gì', 'Chỉ ảnh hưởng Spearman', 'Làm r = 0 luôn'], ['Swing Pearson r sharply', 'Have no effect', 'Only affect Spearman', 'Force r = 0'], 0, '', ''],
    ['Tương quan âm −0.8 giữa USD và hàng hoá nghĩa là:', 'A −0.8 USD–commodities correlation means:', ['Thường di chuyển ngược chiều, quan hệ tuyến tính mạnh', 'Không liên quan', 'Cùng chiều', 'USD gây ra hàng hoá chắc chắn'], ['They usually move oppositely with a strong linear relation', 'Unrelated', 'Same direction', 'USD surely causes it'], 0, '', ''],
    ['Tương quan hạng Spearman được tính bằng cách:', 'Spearman correlation is computed by:', ['Tính Pearson trên thứ hạng của dữ liệu', 'Bình phương r', 'Lấy log giá', 'Chia cov cho n'], ['Pearson on the data’s ranks', 'Squaring r', 'Log prices', 'cov / n'], 0, '', '']
  ]);

  /* ================= L2-25 ================= */
  C.addLesson('l2-25', {
    goals: ['Ước lượng hồi quy tuyến tính đơn bằng bình phương nhỏ nhất.', 'Diễn giải hệ số, R², sai số chuẩn ước lượng và kiểm định t.', 'Nêu các giả định của hồi quy.', 'Mở rộng sang hồi quy bội, R² hiệu chỉnh, kiểm định F và đa cộng tuyến.'],
    body: () => `
<h3>1. Hồi quy tuyến tính đơn</h3>
<p>Mô hình: <b>Y = a + bX + ε</b>. Phương pháp <b>bình phương nhỏ nhất (OLS)</b> chọn a, b sao cho tổng bình phương phần dư Σ(y − ŷ)² nhỏ nhất.</p>
<ul><li>Độ dốc <b>b = cov(X,Y)/var(X) = r·s<sub>Y</sub>/s<sub>X</sub></b>.</li><li>Hệ số chặn <b>a = ȳ − b·x̄</b> (đường hồi quy luôn đi qua điểm (x̄, ȳ)).</li></ul>
<p>Tương quan chỉ cho biết mức độ quan hệ; hồi quy cho biết <b>Y thay đổi bao nhiêu khi X thay đổi một đơn vị</b> và cho phép dự báo.</p>
<div class="callout"><b>Beta</b> là một ứng dụng: hồi quy lợi suất cổ phiếu theo lợi suất chỉ số. b = 1.3 → khi thị trường tăng 1%, cổ phiếu trung bình tăng 1.3%.</div>
<h3>2. Đánh giá mô hình</h3>
<table class="tbl"><tbody>
<tr><td><b>R²</b></td><td>= 1 − SSE/SST: tỷ lệ biến thiên của Y được mô hình giải thích (với hồi quy đơn, R² = r²)</td></tr>
<tr><td><b>Sai số chuẩn ước lượng (SEE)</b></td><td>= √(SSE/(n − 2)): độ phân tán điển hình của điểm quanh đường hồi quy — cơ sở của <b>kênh hồi quy</b></td></tr>
<tr><td><b>Kiểm định t cho b</b></td><td>t = b/SE(b), df = n − 2; H₀: b = 0 (X không giải thích được Y)</td></tr>
<tr><td><b>Phần dư</b></td><td>Nên ngẫu nhiên quanh 0; có mẫu hình = mô hình thiếu sót</td></tr></tbody></table>
<h3>3. Giả định của OLS</h3>
<ol><li><b>Tuyến tính</b> giữa X và Y.</li><li>Phần dư <b>độc lập</b> (không tự tương quan) — vi phạm phổ biến với chuỗi thời gian giá.</li><li><b>Phương sai không đổi</b> (homoscedasticity) — vi phạm khi biến động tụm lại (heteroscedasticity).</li><li>Phần dư xấp xỉ <b>chuẩn</b> (quan trọng cho kiểm định với n nhỏ).</li><li>X không tương quan với phần dư.</li></ol>
<p>Vi phạm giả định 2 và 3 không làm hệ số bị lệch nhưng làm <b>sai số chuẩn sai</b> → t-stat và kết luận sai (thường quá lạc quan).</p>
<h3>4. Hồi quy bội</h3>
<p><b>Y = a + b₁X₁ + b₂X₂ + … + b<sub>k</sub>X<sub>k</sub> + ε</b>. Mỗi b<sub>i</sub> là tác động của X<sub>i</sub> khi <b>giữ nguyên các biến khác</b>.</p>
<ul><li><b>R² hiệu chỉnh</b> = 1 − (1 − R²)(n − 1)/(n − k − 1): phạt việc thêm biến vô ích (R² thường luôn tăng khi thêm biến).</li>
<li><b>Kiểm định F</b>: H₀ là tất cả b<sub>i</sub> = 0 — mô hình có giải thích được gì không.</li>
<li><b>Đa cộng tuyến</b>: các biến X tương quan cao với nhau → hệ số không ổn định, sai số chuẩn lớn, dấu có thể ngược lý thuyết, dù R² cao.</li></ul>
<h3>5. Hồi quy trong PTKT</h3>
<ul><li><b>Đường hồi quy tuyến tính</b> giá theo thời gian = "xu hướng khách quan"; <b>kênh hồi quy</b> = đường ± k × SEE.</li>
<li>Độ dốc hồi quy làm chỉ báo động lượng; R² làm chỉ báo <b>độ mạnh xu hướng</b>.</li>
<li>Nhớ: giá là chuỗi không dừng, phần dư tự tương quan mạnh → t-stat của hồi quy giá theo thời gian thường bị thổi phồng; hãy dùng như công cụ mô tả, không phải bằng chứng thống kê.</li></ul>
${H.regChan()}`,
    keys: ['Y = a + bX + ε; OLS tối thiểu Σ phần dư²; b = cov/var(X), a = ȳ − b·x̄.', 'R² = 1 − SSE/SST; SEE = √(SSE/(n−2)); t(b) = b/SE(b), df n − 2.', 'Giả định: tuyến tính, độc lập, phương sai không đổi, phần dư chuẩn, X không tương quan với phần dư.', 'Vi phạm độc lập/phương sai → sai số chuẩn sai → kết luận quá lạc quan.', 'Hồi quy bội: R² hiệu chỉnh, kiểm định F, đa cộng tuyến.', 'PTKT: đường/kênh hồi quy, độ dốc và R² làm chỉ báo; dùng mô tả, cẩn trọng với t-stat.'],
    terms: [['Ordinary least squares', 'Bình phương nhỏ nhất'], ['Residual', 'Phần dư'], ['Standard error of estimate', 'Sai số chuẩn ước lượng'], ['Homoscedasticity', 'Phương sai không đổi'], ['Heteroscedasticity', 'Phương sai thay đổi'], ['Adjusted R²', 'R² hiệu chỉnh'], ['F-test', 'Kiểm định F'], ['Multicollinearity', 'Đa cộng tuyến'], ['Regression channel', 'Kênh hồi quy']]
  }, {
    goals: ['Estimate simple OLS regression.', 'Read coefficients, R², SEE and t-tests.', 'State the assumptions.', 'Extend to multiple regression, adjusted R², F-test, multicollinearity.'],
    body: () => `
<h3>1. Simple regression</h3><p>Y = a + bX + ε; OLS minimises squared residuals. b = cov/var(X) = r·sY/sX; a = ȳ − b·x̄.</p><div class="callout">Beta = slope of stock returns on index returns.</div>
<h3>2. Evaluation</h3><table class="tbl"><tbody><tr><td>R²</td><td>1 − SSE/SST</td></tr><tr><td>SEE</td><td>√(SSE/(n−2)) — basis of regression channels</td></tr><tr><td>t for b</td><td>b/SE(b), df n − 2</td></tr><tr><td>Residuals</td><td>should be patternless</td></tr></tbody></table>
<h3>3. Assumptions</h3><ol><li>Linearity</li><li>Independent residuals</li><li>Homoscedasticity</li><li>Normal residuals</li><li>X uncorrelated with ε</li></ol><p>Violating 2–3 leaves coefficients unbiased but standard errors wrong.</p>
<h3>4. Multiple regression</h3><ul><li>Coefficients hold others constant.</li><li>Adjusted R² penalises extra variables.</li><li>F-test: all slopes zero.</li><li>Multicollinearity: unstable coefficients.</li></ul>
<h3>5. In TA</h3><ul><li>Regression lines and channels.</li><li>Slope as momentum, R² as trend strength.</li><li>Price-on-time t-stats are inflated — descriptive use.</li></ul>${H.regChan()}`,
    keys: ['OLS.', 'R², SEE, t.', 'Assumptions.', 'Multiple regression.', 'TA uses.'],
    terms: [['SEE', 'Standard error of estimate'], ['Multicollinearity', 'Correlated regressors']]
  }, [
    ['OLS chọn hệ số sao cho:', 'OLS chooses coefficients that:', ['Tổng bình phương phần dư nhỏ nhất', 'Tổng phần dư lớn nhất', 'R² = 0', 'Độ dốc = 1'], ['Minimise the sum of squared residuals', 'Maximise residuals', 'Make R² = 0', 'Make slope = 1'], 0, '', ''],
    ['cov(X,Y) = 8, var(X) = 4. Độ dốc b =', 'cov 8, var(X) 4. Slope b =', ['0.5', '2', '4', '32'], null, 1, '8/4.', ''],
    ['x̄ = 10, ȳ = 25, b = 2. Hệ số chặn a =', 'x̄ 10, ȳ 25, b 2. Intercept a =', ['5', '15', '20', '45'], null, 0, '25 − 2 × 10.', ''],
    ['Đường hồi quy OLS luôn đi qua điểm:', 'The OLS line always passes through:', ['(x̄, ȳ)', '(0, 0)', '(1, 1)', 'Điểm cao nhất'], ['(x̄, ȳ)', '(0, 0)', '(1, 1)', 'The highest point'], 0, '', ''],
    ['Beta của cổ phiếu = 1.4 nghĩa là:', 'A stock beta of 1.4 means:', ['Thị trường tăng 1% thì cổ phiếu trung bình tăng 1.4%', 'Cổ phiếu tăng 1.4% mỗi ngày', 'r = 1.4', 'Rủi ro bằng 0'], ['Market +1% → stock ≈ +1.4% on average', 'Stock rises 1.4% daily', 'r = 1.4', 'Zero risk'], 0, '', ''],
    ['SSE = 30, SST = 120. R² =', 'SSE 30, SST 120. R² =', ['0.25', '0.75', '4', '0.5'], null, 1, '1 − 30/120.', ''],
    ['Sai số chuẩn ước lượng (SEE) đo:', 'The standard error of estimate measures:', ['Độ phân tán điển hình của điểm quanh đường hồi quy', 'Độ dốc', 'Tương quan', 'Số quan sát'], ['Typical scatter of points around the line', 'Slope', 'Correlation', 'Observations'], 0, '', ''],
    ['b = 0.9, SE(b) = 0.3. Thống kê t =', 'b 0.9, SE(b) 0.3. t =', ['0.27', '3', '1.2', '0.6'], null, 1, '', ''],
    ['Kiểm định t cho độ dốc với H₀:', 'The slope t-test’s H₀ is:', ['b = 0', 'b = 1', 'a = 0', 'R² = 1'], null, 0, '', ''],
    ['Giả định nào thường bị vi phạm nhất khi hồi quy chuỗi giá theo thời gian?', 'Which assumption is most often violated regressing prices on time?', ['Phần dư độc lập (không tự tương quan)', 'Có dữ liệu', 'X là số', 'n > 2'], ['Independent (non-autocorrelated) residuals', 'Data exists', 'X numeric', 'n > 2'], 0, '', ''],
    ['Phương sai phần dư thay đổi theo thời gian gọi là:', 'Residual variance changing over time is:', ['Heteroscedasticity', 'Homoscedasticity', 'Đa cộng tuyến', 'Tính dừng'], ['Heteroscedasticity', 'Homoscedasticity', 'Multicollinearity', 'Stationarity'], 0, '', ''],
    ['Tự tương quan phần dư dương thường khiến t-stat:', 'Positive residual autocorrelation usually makes t-stats:', ['Bị thổi phồng (quá lạc quan)', 'Bị thu nhỏ', 'Chính xác', 'Bằng 0'], ['Inflated (too optimistic)', 'Deflated', 'Accurate', 'Zero'], 0, '', ''],
    ['Trong hồi quy bội, hệ số b₁ là tác động của X₁ khi:', 'In multiple regression b₁ is X₁’s effect:', ['Giữ nguyên các biến khác', 'Bỏ các biến khác', 'X₁ = 0', 'R² = 1'], ['Holding the other variables constant', 'Dropping others', 'X₁ = 0', 'R² = 1'], 0, '', ''],
    ['R² hiệu chỉnh khác R² ở chỗ:', 'Adjusted R² differs from R² by:', ['Phạt việc thêm biến không giúp ích', 'Luôn lớn hơn R²', 'Không phụ thuộc n', 'Bằng r'], ['Penalising unhelpful extra variables', 'Always exceeding R²', 'Ignoring n', 'Equalling r'], 0, '', ''],
    ['R² = 0.40, n = 61, k = 3. R² hiệu chỉnh ≈', 'R² 0.40, n 61, k 3. Adjusted R² ≈', ['0.37', '0.40', '0.43', '0.20'], null, 0, '1 − 0.6 × 60/57 ≈ 0.368.', ''],
    ['Kiểm định F trong hồi quy bội kiểm tra:', 'The F-test in multiple regression tests:', ['Tất cả hệ số độ dốc đồng thời bằng 0', 'Chỉ hệ số chặn', 'Tính chuẩn', 'Tự tương quan'], ['All slopes jointly zero', 'Intercept only', 'Normality', 'Autocorrelation'], 0, '', ''],
    ['Dấu hiệu của đa cộng tuyến:', 'A sign of multicollinearity:', ['R² cao nhưng các hệ số không có ý nghĩa, dấu bất thường', 'R² thấp', 'Phần dư bằng 0', 'n nhỏ'], ['High R² but insignificant coefficients with odd signs', 'Low R²', 'Zero residuals', 'Small n'], 0, '', ''],
    ['Kênh hồi quy tuyến tính được xây dựng bằng:', 'A linear regression channel is built as:', ['Đường hồi quy ± k × sai số chuẩn ước lượng', 'MA ± ATR', 'Đỉnh và đáy', 'Fibonacci'], ['Regression line ± k × SEE', 'MA ± ATR', 'Highs and lows', 'Fibonacci'], 0, '', ''],
    ['R² của hồi quy giá theo thời gian có thể dùng làm:', 'R² of price on time can serve as:', ['Chỉ báo độ mạnh xu hướng', 'Chỉ báo khối lượng', 'Lãi suất', 'Không gì'], ['A trend-strength indicator', 'A volume indicator', 'Rates', 'Nothing'], 0, '', ''],
    ['Vi phạm giả định phương sai không đổi chủ yếu làm:', 'Violating homoscedasticity mainly makes:', ['Sai số chuẩn và kiểm định sai, hệ số vẫn không lệch', 'Hệ số bị lệch nặng', 'R² = 1', 'Không ảnh hưởng'], ['Standard errors and tests wrong, coefficients still unbiased', 'Coefficients badly biased', 'R² = 1', 'No effect'], 0, '', '']
  ]);

  /* ================= L2-26 ================= */
  C.addLesson('l2-26', {
    goals: ['Giải thích tính dừng và vì sao nó quan trọng.', 'Đọc tự tương quan (ACF, PACF) và kiểm định Durbin–Watson, Ljung–Box.', 'Mô tả mô hình AR, MA, ARIMA và quy trình Box–Jenkins.', 'Ứng dụng các chỉ báo dựa trên hồi quy để tạo tín hiệu.'],
    body: () => `
<h3>1. Tính dừng</h3>
<p>Một chuỗi <b>dừng</b> có trung bình, phương sai và cấu trúc tự tương quan <b>không đổi theo thời gian</b>. Hầu hết công cụ thống kê (hồi quy, kiểm định t) giả định dữ liệu dừng.</p>
<ul><li><b>Giá</b> thường <b>không dừng</b> (có xu hướng, "bước ngẫu nhiên"). Hồi quy hai chuỗi giá không dừng dễ cho kết quả <b>hồi quy giả tạo</b>: R² cao, t-stat lớn, nhưng vô nghĩa.</li>
<li><b>Lợi suất</b> (sai phân bậc 1 của log giá) thường gần dừng về trung bình nhưng phương sai vẫn thay đổi (biến động tụm lại).</li>
<li>Biến chuỗi không dừng thành dừng bằng <b>lấy sai phân</b>: d = số lần lấy sai phân cần thiết. Kiểm định nghiệm đơn vị (ví dụ Dickey–Fuller) dùng để kiểm tra tính dừng.</li></ul>
<h3>2. Tự tương quan</h3>
<ul><li><b>ACF</b> ở độ trễ k: tương quan của chuỗi với chính nó lùi k kỳ.</li>
<li><b>PACF</b>: tương quan ở độ trễ k sau khi loại bỏ ảnh hưởng của các độ trễ ngắn hơn.</li>
<li>Ngưỡng có ý nghĩa gần đúng: <b>±2/√n</b>.</li>
<li><b>Durbin–Watson</b> (DW) kiểm tra tự tương quan bậc 1 của phần dư hồi quy: ≈ 2 là không tự tương quan; gần 0 là tự tương quan dương mạnh; gần 4 là âm. DW ≈ 2(1 − ρ).</li>
<li><b>Ljung–Box Q</b> kiểm tra đồng thời nhiều độ trễ (H₀: không có tự tương quan đến độ trễ m), so với χ²(m).</li></ul>
${H.acfLab()}
<h3>3. Mô hình AR, MA, ARIMA</h3>
<table class="tbl"><thead><tr><th>Mô hình</th><th>Ý tưởng</th><th>Dấu hiệu nhận dạng</th></tr></thead><tbody>
<tr><td><b>AR(p)</b></td><td>Giá trị hiện tại phụ thuộc p giá trị quá khứ: y<sub>t</sub> = c + φ₁y<sub>t−1</sub> + … + ε<sub>t</sub></td><td>ACF giảm dần; PACF <b>cắt</b> sau độ trễ p</td></tr>
<tr><td><b>MA(q)</b></td><td>Phụ thuộc q cú sốc (sai số) quá khứ: y<sub>t</sub> = μ + ε<sub>t</sub> + θ₁ε<sub>t−1</sub> + …</td><td>ACF <b>cắt</b> sau độ trễ q; PACF giảm dần</td></tr>
<tr><td><b>ARMA(p,q)</b></td><td>Kết hợp cả hai trên chuỗi dừng</td><td>Cả hai giảm dần</td></tr>
<tr><td><b>ARIMA(p,d,q)</b></td><td>ARMA trên chuỗi đã lấy sai phân d lần</td><td>d: số lần sai phân để dừng</td></tr></tbody></table>
<p>Ví dụ: ARIMA(0,1,0) của log giá chính là <b>bước ngẫu nhiên</b> — dự báo tốt nhất cho ngày mai là giá hôm nay.</p>
<h3>4. Quy trình Box–Jenkins</h3>
<ol><li><b>Nhận dạng</b>: kiểm tra tính dừng, chọn d; đọc ACF/PACF để chọn p, q.</li>
<li><b>Ước lượng</b> tham số (thường bằng hợp lý cực đại); so sánh mô hình bằng tiêu chí thông tin (AIC, BIC) — ưu tiên mô hình <b>đơn giản</b>.</li>
<li><b>Kiểm tra chẩn đoán</b>: phần dư phải giống nhiễu trắng (Ljung–Box không có ý nghĩa).</li>
<li><b>Dự báo</b>, và kiểm định ngoài mẫu.</li></ol>
<p>Hạn chế: ARIMA giả định quan hệ tuyến tính, ổn định; phù hợp dự báo ngắn hạn. Biến động thay đổi được mô hình hoá bằng <b>ARCH/GARCH</b> (phương sai có điều kiện phụ thuộc cú sốc và phương sai quá khứ) — rất hữu ích cho dự báo biến động hơn là hướng giá.</p>
<h3>5. Tín hiệu từ hồi quy</h3>
<table class="tbl"><tbody>
<tr><td><b>Dự báo chuỗi thời gian (TSF)</b></td><td>Giá trị của đường hồi quy N kỳ ngoại suy thêm 1 kỳ; giá cắt TSF làm tín hiệu</td></tr>
<tr><td><b>Độ dốc hồi quy</b></td><td>Đổi dấu từ âm sang dương = động lượng chuyển tăng</td></tr>
<tr><td><b>R² hồi quy</b></td><td>Cao (&gt; 0.7) = xu hướng rõ, nên dùng hệ thống theo xu hướng; thấp = đi ngang, dùng dao động</td></tr>
<tr><td><b>Kênh sai số chuẩn</b></td><td>Giá chạm biên ±2 SEE trong xu hướng mạnh: điểm chốt lời/điểm vào lại; phá ra ngoài với R² giảm: có thể kết thúc xu hướng</td></tr>
<tr><td><b>Z-score phần dư</b></td><td>(Giá − đường hồi quy)/SEE: đo mức quá mua/quá bán so với xu hướng</td></tr></tbody></table>`,
    keys: ['Chuỗi dừng: trung bình, phương sai, tự tương quan không đổi; giá không dừng, lợi suất gần dừng.', 'Hồi quy hai chuỗi không dừng → hồi quy giả tạo; sai phân để đạt tính dừng; Dickey–Fuller kiểm tra.', 'ACF/PACF, ngưỡng ±2/√n; DW ≈ 2 là không tự tương quan, DW ≈ 2(1 − ρ); Ljung–Box cho nhiều độ trễ.', 'AR(p): PACF cắt sau p; MA(q): ACF cắt sau q; ARIMA(p,d,q); ARIMA(0,1,0) = bước ngẫu nhiên.', 'Box–Jenkins: nhận dạng → ước lượng → chẩn đoán (phần dư là nhiễu trắng) → dự báo; GARCH cho biến động.', 'Tín hiệu hồi quy: TSF, độ dốc, R², kênh SEE, z-score phần dư.'],
    terms: [['Stationarity', 'Tính dừng'], ['Differencing', 'Lấy sai phân'], ['Unit root test', 'Kiểm định nghiệm đơn vị'], ['Spurious regression', 'Hồi quy giả tạo'], ['ACF / PACF', 'Tự tương quan / tự tương quan riêng phần'], ['White noise', 'Nhiễu trắng'], ['Box–Jenkins', 'Quy trình Box–Jenkins'], ['Time series forecast', 'Dự báo chuỗi thời gian'], ['GARCH', 'Mô hình phương sai có điều kiện']]
  }, {
    goals: ['Explain stationarity.', 'Read ACF/PACF, Durbin–Watson, Ljung–Box.', 'Describe AR, MA, ARIMA and Box–Jenkins.', 'Use regression-based indicators for signals.'],
    body: () => `
<h3>1. Stationarity</h3><ul><li>Constant mean, variance, autocorrelation.</li><li>Prices nonstationary → spurious regressions; returns near-stationary.</li><li>Difference to stationarity; unit-root tests.</li></ul>
<h3>2. Autocorrelation</h3><ul><li>ACF and PACF; band ±2/√n.</li><li>DW ≈ 2(1 − ρ): 2 none, 0 positive, 4 negative.</li><li>Ljung–Box for multiple lags.</li></ul>${H.acfLab()}
<h3>3. Models</h3><table class="tbl"><tbody><tr><td>AR(p)</td><td>PACF cuts off after p</td></tr><tr><td>MA(q)</td><td>ACF cuts off after q</td></tr><tr><td>ARMA</td><td>both tail off</td></tr><tr><td>ARIMA(p,d,q)</td><td>ARMA on d-differenced data</td></tr></tbody></table><p>ARIMA(0,1,0) of log price = random walk.</p>
<h3>4. Box–Jenkins</h3><ol><li>Identify</li><li>Estimate (AIC/BIC, parsimony)</li><li>Diagnose (white-noise residuals)</li><li>Forecast out of sample</li></ol><p>GARCH models volatility clustering.</p>
<h3>5. Regression signals</h3><ul><li>Time series forecast</li><li>Slope sign changes</li><li>R² regime filter</li><li>SEE channels</li><li>Residual z-scores</li></ul>`,
    keys: ['Stationarity.', 'ACF/PACF, DW, Ljung–Box.', 'AR/MA/ARIMA.', 'Box–Jenkins, GARCH.', 'Regression signals.'],
    terms: [['Stationarity', 'Time-invariant statistical properties'], ['White noise', 'Uncorrelated zero-mean noise']]
  }, [
    ['Một chuỗi dừng có:', 'A stationary series has:', ['Trung bình, phương sai, tự tương quan không đổi theo thời gian', 'Xu hướng tăng mãi', 'Phương sai tăng dần', 'Không có dữ liệu'], ['Time-constant mean, variance and autocorrelation', 'A permanent uptrend', 'Rising variance', 'No data'], 0, '', ''],
    ['Chuỗi giá cổ phiếu thường:', 'Stock price series are usually:', ['Không dừng', 'Dừng hoàn toàn', 'Nhiễu trắng', 'Hằng số'], ['Nonstationary', 'Fully stationary', 'White noise', 'Constant'], 0, '', ''],
    ['Hồi quy hai chuỗi giá không dừng không liên quan thường cho:', 'Regressing two unrelated nonstationary prices often yields:', ['R² cao và t-stat lớn nhưng vô nghĩa (hồi quy giả tạo)', 'R² = 0', 'Lỗi tính toán', 'Kết quả đáng tin'], ['High R² and t-stats that mean nothing (spurious regression)', 'R² = 0', 'Errors', 'Reliable results'], 0, '', ''],
    ['Cách thông thường biến chuỗi giá thành gần dừng:', 'The usual way to make prices near-stationary:', ['Lấy sai phân (tính lợi suất)', 'Bình phương giá', 'Nhân đôi giá', 'Lấy MA 200'], ['Differencing (returns)', 'Squaring', 'Doubling', '200-MA'], 0, '', ''],
    ['Trong ARIMA(p,d,q), d là:', 'In ARIMA(p,d,q), d is:', ['Số lần lấy sai phân', 'Số độ trễ AR', 'Số độ trễ MA', 'Số ngày'], ['Number of differences', 'AR lags', 'MA lags', 'Days'], 0, '', ''],
    ['Durbin–Watson ≈ 2 cho thấy:', 'Durbin–Watson ≈ 2 indicates:', ['Không có tự tương quan bậc 1', 'Tự tương quan dương mạnh', 'Tự tương quan âm mạnh', 'R² = 1'], ['No first-order autocorrelation', 'Strong positive', 'Strong negative', 'R² = 1'], 0, '', ''],
    ['DW = 0.4 cho thấy:', 'DW = 0.4 indicates:', ['Tự tương quan dương mạnh của phần dư', 'Không tự tương quan', 'Tự tương quan âm', 'Phần dư chuẩn'], ['Strong positive residual autocorrelation', 'None', 'Negative', 'Normal residuals'], 0, 'DW ≈ 2(1 − ρ) → ρ ≈ 0.8.', ''],
    ['Tự tương quan phần dư ρ = 0.3. DW xấp xỉ:', 'Residual ρ = 0.3. DW ≈', ['0.6', '1.4', '2.6', '0.3'], null, 1, '2 × 0.7.', ''],
    ['n = 400. Ngưỡng có ý nghĩa gần đúng của ACF:', 'n = 400. Approximate ACF significance band:', ['±0.01', '±0.1', '±0.5', '±2'], null, 1, '2/√400 = 0.1.', ''],
    ['Mô hình AR(p) nhận dạng bởi:', 'An AR(p) model is identified by:', ['PACF cắt sau độ trễ p, ACF giảm dần', 'ACF cắt sau p', 'Cả hai bằng 0', 'DW = 4'], ['PACF cutting off after p, ACF tailing off', 'ACF cutting off after p', 'Both zero', 'DW = 4'], 0, '', ''],
    ['Mô hình MA(q) nhận dạng bởi:', 'An MA(q) model is identified by:', ['ACF cắt sau độ trễ q, PACF giảm dần', 'PACF cắt sau q', 'Không cắt', 'R² cao'], ['ACF cutting off after q, PACF tailing off', 'PACF cutting off', 'No cut-off', 'High R²'], 0, '', ''],
    ['ARIMA(0,1,0) của log giá tương ứng với:', 'ARIMA(0,1,0) on log prices is:', ['Bước ngẫu nhiên', 'Xu hướng xác định', 'Chu kỳ', 'Hồi quy bội'], ['A random walk', 'A deterministic trend', 'A cycle', 'Multiple regression'], 0, '', ''],
    ['Thứ tự đúng của quy trình Box–Jenkins:', 'Correct Box–Jenkins order:', ['Nhận dạng → ước lượng → kiểm tra chẩn đoán → dự báo', 'Dự báo → ước lượng → nhận dạng', 'Ước lượng → dự báo → nhận dạng', 'Chẩn đoán → nhận dạng → ước lượng'], ['Identify → estimate → diagnose → forecast', 'Forecast → estimate → identify', 'Estimate → forecast → identify', 'Diagnose → identify → estimate'], 0, '', ''],
    ['Ở bước chẩn đoán, phần dư của mô hình tốt phải:', 'At diagnosis, a good model’s residuals should be:', ['Giống nhiễu trắng (không tự tương quan)', 'Có xu hướng', 'Tự tương quan mạnh', 'Bằng giá'], ['White-noise-like', 'Trending', 'Strongly autocorrelated', 'Equal to price'], 0, '', ''],
    ['Kiểm định Ljung–Box có H₀:', 'The Ljung–Box test’s H₀:', ['Không có tự tương quan đến độ trễ m', 'Chuỗi có xu hướng', 'R² = 0', 'Phần dư chuẩn'], ['No autocorrelation up to lag m', 'Trend present', 'R² = 0', 'Normal residuals'], 0, '', ''],
    ['AIC/BIC dùng để:', 'AIC/BIC are used to:', ['So sánh mô hình, ưu tiên mô hình đơn giản hơn', 'Tính lợi suất', 'Đo khối lượng', 'Kiểm định tính chuẩn'], ['Compare models, favouring parsimony', 'Compute returns', 'Measure volume', 'Test normality'], 0, '', ''],
    ['Mô hình phù hợp nhất cho biến động tụm lại:', 'The model best suited to volatility clustering:', ['GARCH', 'AR(1) giá', 'Hồi quy tuyến tính đơn', 'MA 50'], ['GARCH', 'AR(1) on price', 'Simple regression', '50-MA'], 0, '', ''],
    ['Chỉ báo Time Series Forecast (TSF) là:', 'The Time Series Forecast indicator is:', ['Giá trị đường hồi quy N kỳ ngoại suy thêm 1 kỳ', 'MA của khối lượng', 'RSI làm mượt', 'Trung bình của đỉnh'], ['The N-period regression line extended one bar', 'Volume MA', 'Smoothed RSI', 'Average of highs'], 0, '', ''],
    ['R² hồi quy giá theo thời gian ở mức thấp gợi ý:', 'A low price-on-time R² suggests:', ['Thị trường đi ngang — ưu tiên công cụ dao động', 'Xu hướng mạnh', 'Breakout chắc chắn', 'Dùng hệ thống xu hướng'], ['A range — favour oscillators', 'A strong trend', 'A certain breakout', 'Use trend systems'], 0, '', ''],
    ['Z-score phần dư = (giá − đường hồi quy)/SEE = +2.3 trong xu hướng tăng nghĩa là:', 'Residual z-score +2.3 in an uptrend means:', ['Giá đang kéo căng quá mức so với xu hướng', 'Giá dưới xu hướng', 'Xu hướng kết thúc chắc chắn', 'Không ý nghĩa'], ['Price is stretched above its trend', 'Below trend', 'Trend surely over', 'Meaningless'], 0, '', '']
  ]);
})(window.LLW);
