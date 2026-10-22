// © 2026 Lai Long Master TA. Bảo lưu mọi quyền. Không sao chép, chỉnh sửa hay dùng lại khi chưa được phép.
/* CMT Level 1 — Parts VI–VII, lessons 36–41: statistics, probability, trading systems, relative strength. Written by Lai Long Master TA in its own words. */
(function (L) {
  'use strict';
  const C = L.cmt, F = C.fig;
  const T = (lang, vi, en) => (lang === 'en' ? en : vi);
  const Q = (q, o, a, e) => ({ q, o, a, e });
  const css = C.css;
  const ld = () => `<span class="spinner"></span>${L.t('loading')}`;
  const P = x => (x * 100).toFixed(2) + '%';

  /* ---------- stats helpers ---------- */
  const S = {
    mean: a => a.reduce((x, y) => x + y, 0) / a.length,
    sd: a => { const m = S.mean(a); return Math.sqrt(a.reduce((x, y) => x + (y - m) ** 2, 0) / (a.length - 1)); },
    skew: a => { const m = S.mean(a), s = S.sd(a), n = a.length; return a.reduce((x, y) => x + ((y - m) / s) ** 3, 0) / n; },
    kurt: a => { const m = S.mean(a), s = S.sd(a), n = a.length; return a.reduce((x, y) => x + ((y - m) / s) ** 4, 0) / n - 3; },
    median: a => L.ind.median(a)
  };

  /* ---------- demo: return distribution ---------- */
  C.demoHtml.retDist = () => `<div class="demo" data-demo="retDist"><div class="demo-head"><b>🔬 ${L.T('Phân phối lợi suất thực tế', 'Real return distribution')}</b>${C.symControls('vn_stock', 'VNINDEX', '1D', ['1D', '1W'])}<button class="btn primary d-go">${L.T('Xem', 'Show')}</button></div><div class="demo-calc"></div><div class="demo-out"></div></div>`;
  C.demoRun.retDist = box => {
    const out = box.querySelector('.demo-out'), calc = box.querySelector('.demo-calc');
    C.wire(box, async () => {
      out.innerHTML = ld();
      try {
        const bars = await C.loadBars(...C.readSym(box));
        const r = bars.slice(1).map((b, i) => Math.log(b.c / bars[i].c));
        const m = S.mean(r), s = S.sd(r), sk = S.skew(r), ku = S.kurt(r);
        const lo = m - 5 * s, hi = m + 5 * s, nb = 50, w = (hi - lo) / nb, cnt = new Array(nb).fill(0);
        r.forEach(x => { const k = Math.floor((x - lo) / w); if (k >= 0 && k < nb) cnt[k]++; });
        const mx = Math.max(...cnt), W = 640, H = 220, bw = (W - 40) / nb;
        const npdf = x => Math.exp(-((x - m) ** 2) / (2 * s * s)) / (s * Math.sqrt(2 * Math.PI)) * r.length * w;
        const g = [`<svg viewBox="0 0 ${W} ${H}" class="schem cfig">`];
        cnt.forEach((c, k) => { const h = c / mx * (H - 40); g.push(`<rect x="${20 + k * bw}" y="${H - 20 - h}" width="${bw - 1}" height="${h}" class="s-vu"/>`); });
        g.push(`<path d="${Array.from({ length: 101 }, (_, k) => { const x = lo + (hi - lo) * k / 100; return (k ? 'L' : 'M') + (20 + (x - lo) / (hi - lo) * (W - 40)).toFixed(1) + ' ' + (H - 20 - npdf(x) / mx * (H - 40)).toFixed(1); }).join(' ')}" class="s-trend"/>`);
        g.push(`<text x="20" y="${H - 4}" class="s-small">−5σ</text><text x="${W - 40}" y="${H - 4}" class="s-small">+5σ</text></svg>`);
        calc.innerHTML = g.join('');
        const beyond3 = r.filter(x => Math.abs(x - m) > 3 * s).length / r.length;
        out.innerHTML = L.T(`${r.length} lợi suất log. Trung bình ${P(m)}, độ lệch chuẩn ${P(s)}, độ lệch (skew) ${sk.toFixed(2)}, độ nhọn dư (kurtosis) ${ku.toFixed(2)}. Tỷ lệ ngày vượt ±3σ: <b>${P(beyond3)}</b> so với 0.27% nếu phân phối chuẩn. Cột xanh = thực tế, đường nét đứt = phân phối chuẩn cùng trung bình và độ lệch chuẩn. Kurtosis dương và nhiều ngày vượt 3σ chính là <b>đuôi dày</b>.`,
          `${r.length} log returns. Mean ${P(m)}, st.dev ${P(s)}, skew ${sk.toFixed(2)}, excess kurtosis ${ku.toFixed(2)}. Days beyond ±3σ: <b>${P(beyond3)}</b> vs 0.27% under normality. Bars = actual, dashed = normal. Positive kurtosis and many 3σ days are <b>fat tails</b>.`);
      } catch (e) { C.err(out, e); }
    });
  };

  /* ---------- demo: expectancy & streaks ---------- */
  C.demoHtml.expect = () => C.calcShell('expect', `${C.num('wr', 40, L.T('Tỷ lệ thắng %', 'Win rate %'), 1)}${C.num('aw', 3, L.T('Lãi TB (R)', 'Avg win (R)'), 0.1)}${C.num('al', 1, L.T('Lỗ TB (R)', 'Avg loss (R)'), 0.1)}${C.num('nt', 100, L.T('Số lệnh', 'Trades'), 1)}`);
  C.demoRun.expect = box => {
    const run = () => {
      const p = +box.querySelector('.wr').value / 100, aw = +box.querySelector('.aw').value, al = +box.querySelector('.al').value, n = Math.max(1, Math.round(+box.querySelector('.nt').value));
      const e = p * aw - (1 - p) * al, q = 1 - p;
      let streak = 0; for (let k = 1; k <= 30; k++) { if (1 - Math.pow(1 - Math.pow(q, k), n - k + 1) < 0.5) { streak = k - 1; break; } }
      const be = al / (aw + al);
      box.querySelector('.demo-out').innerHTML = L.T(`Kỳ vọng mỗi lệnh = ${(p * 100).toFixed(0)}% × ${aw} − ${(q * 100).toFixed(0)}% × ${al} = <b class="${e >= 0 ? 'up' : 'down'}">${e.toFixed(2)}R</b>. Sau ${n} lệnh, kỳ vọng ≈ <b>${(e * n).toFixed(1)}R</b>. Tỷ lệ thắng hoà vốn với tỷ lệ lãi/lỗ này: ${(be * 100).toFixed(1)}%. Xác suất thua 5 lệnh liên tiếp ở một lệnh bất kỳ: ${(Math.pow(q, 5) * 100).toFixed(2)}%; trong ${n} lệnh, chuỗi thua dài khoảng <b>${streak}</b> lệnh là chuyện bình thường (≈ 50% khả năng). Hãy chuẩn bị vốn và tâm lý cho điều đó.`,
        `Expectancy = ${(p * 100).toFixed(0)}% × ${aw} − ${(q * 100).toFixed(0)}% × ${al} = <b class="${e >= 0 ? 'up' : 'down'}">${e.toFixed(2)}R</b>; over ${n} trades ≈ <b>${(e * n).toFixed(1)}R</b>. Breakeven win rate: ${(be * 100).toFixed(1)}%. P(5 straight losses from a given trade) = ${(Math.pow(q, 5) * 100).toFixed(2)}%; across ${n} trades a losing streak of about <b>${streak}</b> is normal (~50% chance).`);
    };
    box.querySelectorAll('.d-num').forEach(i => { i.oninput = run; });
    run();
  };

  /* ---------- demo: MA rule backtest with in/out-of-sample ---------- */
  C.demoHtml.backtest = () => `<div class="demo" data-demo="backtest"><div class="demo-head"><b>🔬 ${L.T('Kiểm định một quy tắc khách quan', 'Testing an objective rule')}</b>${C.symControls('vn_stock', 'VNINDEX', '1D', ['1D', '1W'])}${C.num('ma', 50, L.T('MA', 'MA'), 1)}${C.num('cost', 0.15, L.T('Phí 1 chiều %', 'Cost/side %'), 0.05)}<button class="btn primary d-go">${L.T('Kiểm định', 'Test')}</button></div><div class="demo-chart"></div><div class="demo-out"></div></div>`;
  C.demoRun.backtest = box => {
    const out = box.querySelector('.demo-out'), el = box.querySelector('.demo-chart');
    C.wire(box, async () => {
      out.innerHTML = ld();
      try {
        const bars = await C.loadBars(...C.readSym(box));
        const n = Math.max(2, Math.round(+box.querySelector('.ma').value)), cost = +box.querySelector('.cost').value / 100;
        const ma = C.math.sma(bars.map(b => b.c), n);
        let eq = 1, bh = 1, pos = 0, trades = 0, wins = 0, entry = 0; const curve = [], bhc = [], rets = [];
        for (let i = n; i < bars.length; i++) {
          const r = bars[i].c / bars[i - 1].c - 1;
          bh *= 1 + r;
          let dr = pos ? r : 0;
          const want = bars[i].c > ma[i] ? 1 : 0;
          if (want !== pos) { dr -= cost; trades++; if (pos && bars[i].c > entry) wins++; if (want) entry = bars[i].c; pos = want; }
          eq *= 1 + dr; rets.push(dr);
          curve.push({ time: bars[i].t, value: eq }); bhc.push({ time: bars[i].t, value: bh });
        }
        el.innerHTML = '';
        const ch = C.mkChart(el, { rightPriceScale: { mode: 1 } });
        ch.addLineSeries({ color: css('--accent'), lineWidth: 2, title: L.T('Quy tắc MA', 'MA rule') }).setData(curve);
        ch.addLineSeries({ color: css('--muted'), lineWidth: 1, title: L.T('Mua & giữ', 'Buy & hold') }).setData(bhc);
        const half = Math.floor(curve.length / 2);
        ch.timeScale().fitContent();
        const seg = (a, b) => ({ rule: curve[b].value / curve[a].value - 1, bh: bhc[b].value / bhc[a].value - 1 });
        const ins = seg(0, half), oos = seg(half, curve.length - 1);
        const m = S.mean(rets), s = S.sd(rets), tstat = m / (s / Math.sqrt(rets.length));
        out.innerHTML = L.T(`Toàn kỳ: quy tắc <b>${P(eq - 1)}</b> so với mua & giữ ${P(bh - 1)}; ${trades} lần đổi trạng thái, tỷ lệ lệnh thắng ≈ ${trades ? (wins / Math.max(1, Math.floor(trades / 2)) * 100).toFixed(0) : 0}%. <b>Nửa đầu (trong mẫu)</b>: ${P(ins.rule)} vs ${P(ins.bh)} · <b>Nửa sau (ngoài mẫu)</b>: ${P(oos.rule)} vs ${P(oos.bh)}. Thống kê t của lợi suất ngày ≈ ${tstat.toFixed(2)} (|t| > 2 mới gợi ý có ý nghĩa). Hãy thử nhiều độ dài MA: nếu chỉ một vài giá trị "đẹp" thì đó có thể là đào bới dữ liệu.`,
          `Full period: rule <b>${P(eq - 1)}</b> vs buy & hold ${P(bh - 1)}; ${trades} switches. <b>First half (in-sample)</b>: ${P(ins.rule)} vs ${P(ins.bh)} · <b>Second half (out-of-sample)</b>: ${P(oos.rule)} vs ${P(oos.bh)}. Daily-return t-stat ≈ ${tstat.toFixed(2)} (|t| > 2 suggests significance). Try many MA lengths — if only a few look good, suspect data mining.`);
      } catch (e) { C.err(out, e); }
    });
  };

  /* ---------- demo: relative strength ranking ---------- */
  const RS_LIST = ['HPG', 'FPT', 'VNM', 'VCB', 'TCB', 'MBB', 'SSI', 'MWG', 'VHM', 'GAS', 'DGC', 'PNJ'];
  C.demoHtml.rsRank = () => `<div class="demo" data-demo="rsRank"><div class="demo-head"><b>🔬 ${L.T('Xếp hạng sức mạnh tương đối (kiểu Levy)', 'Relative-strength ranking (Levy style)')}</b>
    <input class="d-list" value="${RS_LIST.join(',')}" spellcheck="false" style="width:320px">${C.mkSel('d-w', [['26', L.T('26 tuần', '26 weeks')], ['13', L.T('13 tuần', '13 weeks')]], '26')}<button class="btn primary d-go">${L.T('Xếp hạng', 'Rank')}</button></div><div class="demo-calc"></div><div class="demo-out"></div></div>`;
  C.demoRun.rsRank = box => {
    const out = box.querySelector('.demo-out'), calc = box.querySelector('.demo-calc');
    const run = async () => {
      out.innerHTML = ld();
      try {
        const syms = box.querySelector('.d-list').value.toUpperCase().split(/[,\s]+/).filter(Boolean).slice(0, 20);
        const wk = +box.querySelector('.d-w').value, days = wk * 5;
        const idx = await C.loadBars('vn_stock', 'VNINDEX', '1D');
        const iRet = idx[idx.length - 1].c / idx[Math.max(0, idx.length - 1 - days)].c - 1;
        const rows = [];
        for (const s of syms) {
          try {
            const b = await C.loadBars('vn_stock', s, '1D');
            if (b.length < days + 1) continue;
            const c = b[b.length - 1].c, ma = S.mean(b.slice(-days).map(x => x.c));
            rows.push({ s, levy: c / ma, ret: c / b[b.length - 1 - days].c - 1 });
          } catch (e) { /* skip symbol */ }
        }
        rows.sort((a, b) => b.levy - a.levy);
        calc.innerHTML = `<table class="tbl"><thead><tr><th>#</th><th>${L.T('Mã', 'Symbol')}</th><th>${L.T('Tỷ số Levy (giá / MA ' + wk + ' tuần)', 'Levy ratio (price / ' + wk + '-week MA)')}</th><th>${L.T('Lợi suất', 'Return')} ${wk}w</th><th>${L.T('So với VNINDEX', 'vs VNINDEX')}</th></tr></thead><tbody>${rows.map((r, k) => `<tr><td>${k + 1}</td><td><b>${r.s}</b></td><td class="${r.levy >= 1 ? 'up' : 'down'}">${r.levy.toFixed(3)}</td><td>${P(r.ret)}</td><td class="${r.ret > iRet ? 'up' : 'down'}">${r.ret > iRet ? L.T('mạnh hơn', 'stronger') : L.T('yếu hơn', 'weaker')}</td></tr>`).join('')}</tbody></table>`;
        out.innerHTML = L.T(`VNINDEX ${wk} tuần: ${P(iRet)}. Theo tinh thần nghiên cứu của Levy: ưu tiên nhóm xếp hạng đầu (tỷ số cao nhất), loại bỏ khi rơi xuống nhóm dưới. Đây là công cụ cho bước 2 của Wyckoff — chọn cổ phiếu mạnh hơn thị trường.`,
          `VNINDEX ${wk}-week: ${P(iRet)}. In Levy’s spirit, favour the top ranks and drop names that fall into the bottom group — Wyckoff step 2.`);
      } catch (e) { C.err(out, e); }
    };
    box.querySelector('.d-go').onclick = run;
    run();
  };

  /* ================= 36 ================= */
  C.lessons['l1-36'] = {
    vi: {
      goals: ['Phân biệt tổng thể/mẫu, các loại dữ liệu.', 'Tính và diễn giải trung bình, trung vị, yếu vị, trung bình nhân.', 'Tính và diễn giải phương sai, độ lệch chuẩn, khoảng biến thiên.', 'Hiểu hình dạng phân phối: độ lệch, độ nhọn, đuôi dày.', 'Áp dụng cho lợi suất tài sản: lợi suất đơn, lợi suất log, z-score.'],
      body: () => `
<h3>1. Vì sao nhà PTKT cần thống kê?</h3>
<p>Thống kê biến "cảm giác" thành <b>con số kiểm chứng được</b>: mức biến động bình thường, một cú giảm có bất thường không, một quy tắc có thật sự hiệu quả không. Đây là ngôn ngữ của PTKT hiện đại.</p>
<h3>2. Khái niệm nền</h3>
<ul><li><b>Tổng thể (population)</b> và <b>mẫu (sample)</b>: ta hầu như chỉ có mẫu (dữ liệu quá khứ) để suy ra tổng thể (hành vi tương lai).</li>
<li>Dữ liệu <b>định lượng</b> (giá, khối lượng) và <b>định tính</b> (ngành, xếp hạng); dữ liệu <b>chuỗi thời gian</b> và <b>dữ liệu chéo</b> (nhiều mã cùng thời điểm).</li></ul>
<h3>3. Đo xu hướng trung tâm</h3>
<table class="tbl"><thead><tr><th>Thước đo</th><th>Cách tính</th><th>Lưu ý</th></tr></thead><tbody>
<tr><td><b>Trung bình cộng</b></td><td>Tổng ÷ số quan sát</td><td>Nhạy với giá trị ngoại lai</td></tr>
<tr><td><b>Trung vị</b></td><td>Giá trị ở giữa khi sắp xếp</td><td>Bền vững trước ngoại lai</td></tr>
<tr><td><b>Yếu vị</b></td><td>Giá trị xuất hiện nhiều nhất</td><td>Hữu ích cho dữ liệu rời rạc (ví dụ vùng giá giao dịch nhiều nhất)</td></tr>
<tr><td><b>Trung bình nhân</b></td><td>[(1+r₁)(1+r₂)…(1+rₙ)]^(1/n) − 1</td><td><b>Đúng cho lợi suất kép</b> qua nhiều kỳ</td></tr></tbody></table>
<div class="callout"><b>Ví dụ</b>: +50% rồi −50%. Trung bình cộng = 0%, nhưng thực tế 100 → 150 → 75, tức lỗ 25%. Trung bình nhân = √(1.5 × 0.5) − 1 ≈ <b>−13.4%/kỳ</b>. Dùng trung bình cộng để đánh giá hiệu suất nhiều kỳ là sai lầm phổ biến.</div>
<h3>4. Đo độ phân tán</h3>
<ul><li><b>Khoảng biến thiên</b> = lớn nhất − nhỏ nhất.</li>
<li><b>Phương sai</b> = trung bình bình phương độ lệch so với trung bình (mẫu: chia n − 1).</li>
<li><b>Độ lệch chuẩn (σ)</b> = căn bậc hai phương sai, cùng đơn vị với dữ liệu. Đây là thước đo biến động/rủi ro cơ bản nhất (Bài 25).</li>
<li><b>Z-score</b> = (x − trung bình) / σ: cho biết một giá trị cách trung bình bao nhiêu độ lệch chuẩn. Dùng để chuẩn hoá chỉ báo (Bài 34).</li></ul>
<h3>5. Hình dạng phân phối</h3>
<ul><li><b>Phân phối chuẩn</b>: hình chuông đối xứng. Khoảng ±1σ chứa khoảng 68%, ±2σ chứa khoảng 95%, ±3σ chứa khoảng 99.7% dữ liệu.</li>
<li><b>Độ lệch (skewness)</b>: đuôi dài về bên nào. Lợi suất cổ phiếu thường lệch âm (các cú sập lớn).</li>
<li><b>Độ nhọn (kurtosis)</b>: độ nhọn dư dương nghĩa là <b>đuôi dày</b>, tức biến động cực đoan xảy ra thường xuyên hơn phân phối chuẩn dự báo.</li>
<li>Giá thường có phân phối <b>log-chuẩn</b> (không âm, lệch phải). Vì vậy ta phân tích <b>lợi suất log</b> ln(Pₜ/Pₜ₋₁), có tính cộng dồn theo thời gian.</li></ul>
${C.demoHtml.retDist()}`,
      keys: ['Thống kê biến cảm giác thành con số kiểm chứng; ta suy từ mẫu (quá khứ) ra tổng thể.', 'Trung bình cộng nhạy ngoại lai; trung vị bền vững; trung bình nhân đúng cho lợi suất kép.', 'σ đo biến động; z-score = (x − μ)/σ dùng chuẩn hoá.', 'Chuẩn: ±1σ ≈ 68%, ±2σ ≈ 95%, ±3σ ≈ 99.7%.', 'Lợi suất tài sản có đuôi dày (kurtosis dư > 0), thường lệch âm; dùng lợi suất log.'],
      terms: [['Population / Sample', 'Tổng thể / Mẫu'], ['Mean / Median / Mode', 'Trung bình / Trung vị / Yếu vị'], ['Geometric mean', 'Trung bình nhân'], ['Variance / Standard deviation', 'Phương sai / Độ lệch chuẩn'], ['Z-score', 'Điểm chuẩn hoá'], ['Skewness / Kurtosis', 'Độ lệch / Độ nhọn'], ['Log return', 'Lợi suất logarit']],
      quiz: [
        Q('Lợi suất +20% rồi −20%. Kết quả thực tế sau 2 kỳ:', ['0%', '−4%', '+4%', '−20%'], 1, '1.2 × 0.8 = 0.96.'),
        Q('Thước đo nào đúng cho lợi suất kép nhiều kỳ?', ['Trung bình cộng', 'Trung bình nhân', 'Yếu vị', 'Khoảng biến thiên'], 1, 'Phản ánh tăng trưởng thực tế.'),
        Q('Dữ liệu có vài giá trị ngoại lai rất lớn. Thước đo trung tâm bền vững hơn là:', ['Trung bình cộng', 'Trung vị', 'Phương sai', 'Độ nhọn'], 1, 'Không bị kéo bởi ngoại lai.'),
        Q('Trong phân phối chuẩn, ±2σ chứa khoảng:', ['50%', '68%', '95%', '99.7%'], 2, ''),
        Q('Trung bình 2%, σ = 4%. Giá trị 10% có z-score:', ['2', '2.5', '3', '4'], 0, '(10 − 2)/4 = 2.'),
        Q('Kurtosis dư dương có nghĩa:', ['Đuôi mỏng', 'Đuôi dày — biến động cực đoan thường xuyên hơn', 'Phân phối đều', 'Không có biến động'], 1, ''),
        Q('Lợi suất cổ phiếu thường có độ lệch:', ['Dương mạnh', 'Âm (các cú sập lớn)', 'Bằng 0 tuyệt đối', 'Không xác định'], 1, ''),
        Q('Ưu điểm của lợi suất log là:', ['Luôn dương', 'Cộng dồn được theo thời gian', 'Không cần giá', 'Bằng lợi suất đơn'], 1, 'ln(P₂/P₀) = ln(P₂/P₁) + ln(P₁/P₀).')
      ]
    },
    en: {
      goals: ['Population vs sample; data types.', 'Mean, median, mode, geometric mean.', 'Variance, st.dev, range.', 'Skewness, kurtosis, fat tails.', 'Returns, log returns, z-scores.'],
      body: () => `
<h3>1. Why statistics</h3><p>Turning impressions into testable numbers.</p>
<h3>2. Basics</h3><ul><li>We infer populations (future) from samples (past).</li><li>Quantitative/qualitative; time-series/cross-section.</li></ul>
<h3>3. Central tendency</h3><table class="tbl"><tbody><tr><td>Mean</td><td>Outlier-sensitive</td></tr><tr><td>Median</td><td>Robust</td></tr><tr><td>Mode</td><td>Most frequent</td></tr><tr><td>Geometric mean</td><td>Correct for compounding</td></tr></tbody></table><div class="callout">+50% then −50%: arithmetic 0%, actual −25%, geometric ≈ −13.4% per period.</div>
<h3>4. Dispersion</h3><ul><li>Range, variance (n − 1), standard deviation.</li><li>Z-score = (x − mean)/σ.</li></ul>
<h3>5. Shape</h3><ul><li>Normal: 68/95/99.7.</li><li>Skew — stocks often negative.</li><li>Excess kurtosis — fat tails.</li><li>Prices ~log-normal; use log returns.</li></ul>${C.demoHtml.retDist()}`,
      keys: ['Infer from samples.', 'Mean, median, geometric mean for compounding.', 'σ and z-scores.', '68/95/99.7.', 'Fat tails and negative skew; log returns.'],
      terms: [['Geometric mean', 'Compound average'], ['Kurtosis', 'Tail heaviness'], ['Z-score', 'Standardised value']],
      quiz: [
        Q('+20% then −20% →', ['0%', '−4%', '+4%', '−20%'], 1, ''),
        Q('Correct for multi-period compounding:', ['Arithmetic mean', 'Geometric mean', 'Mode', 'Range'], 1, ''),
        Q('Robust centre with outliers:', ['Mean', 'Median', 'Variance', 'Kurtosis'], 1, ''),
        Q('±2σ under normality:', ['50%', '68%', '95%', '99.7%'], 2, ''),
        Q('Mean 2%, σ 4%, value 10% → z:', ['2', '2.5', '3', '4'], 0, ''),
        Q('Positive excess kurtosis:', ['Thin tails', 'Fat tails', 'Uniform', 'No volatility'], 1, ''),
        Q('Stock returns are usually skewed:', ['Strongly positive', 'Negative', 'Exactly zero', 'Undefined'], 1, ''),
        Q('Log returns are:', ['Always positive', 'Additive over time', 'Price-free', 'Equal to simple returns'], 1, '')
      ]
    }
  };

  /* ================= 37 ================= */
  C.lessons['l1-37'] = {
    vi: {
      goals: ['Phân biệt các cách tiếp cận xác suất.', 'Áp dụng quy tắc cộng, nhân, xác suất có điều kiện, độc lập.', 'Hiểu định lý Bayes và cập nhật niềm tin.', 'Tính kỳ vọng của hệ thống giao dịch và xác suất chuỗi thua.'],
      body: () => `
<h3>1. Ba cách hiểu xác suất</h3>
<ul><li><b>Cổ điển</b>: số kết quả thuận lợi ÷ tổng số kết quả đồng khả năng (tung đồng xu: 1/2).</li>
<li><b>Thực nghiệm (tần suất)</b>: tỷ lệ xuất hiện trong dữ liệu quá khứ, ví dụ 62% số lần phá vỡ có khối lượng lớn đi tiếp. Đây là cách nhà PTKT dùng nhiều nhất.</li>
<li><b>Chủ quan</b>: mức độ tin tưởng cá nhân. Hữu ích nhưng dễ bị thiên kiến (Bài 29).</li></ul>
<h3>2. Các quy tắc cơ bản</h3>
<table class="tbl"><thead><tr><th>Quy tắc</th><th>Công thức</th></tr></thead><tbody>
<tr><td>Bù</td><td>P(không A) = 1 − P(A)</td></tr>
<tr><td>Cộng</td><td>P(A hoặc B) = P(A) + P(B) − P(A và B)</td></tr>
<tr><td>Nhân (độc lập)</td><td>P(A và B) = P(A) × P(B)</td></tr>
<tr><td>Có điều kiện</td><td>P(A | B) = P(A và B) / P(B)</td></tr></tbody></table>
<p><b>Độc lập</b>: kết quả này không ảnh hưởng xác suất kết quả kia. Ngộ nhận phổ biến (<b>ngụy biện con bạc</b>): "đã thua 5 lần liên tiếp thì lần sau chắc thắng". Nếu các lệnh độc lập, xác suất lần sau không đổi.</p>
<h3>3. Định lý Bayes — cập nhật niềm tin</h3>
<p>P(A | B) = P(B | A) × P(A) / P(B).</p>
<div class="callout"><b>Ví dụ</b>: 30% số phiên là "đáy ngắn hạn" (A). Tín hiệu X xuất hiện ở 60% các đáy, và ở 20% các phiên không phải đáy. P(X) = 0.6 × 0.3 + 0.2 × 0.7 = 0.32. Khi thấy X: P(đáy | X) = 0.6 × 0.3 / 0.32 ≈ <b>56%</b>. Tín hiệu nâng xác suất từ 30% lên 56%: hữu ích, nhưng còn xa mức "chắc chắn".</div>
<h3>4. Kỳ vọng — thước đo cốt lõi của một hệ thống</h3>
<p><b>Kỳ vọng (expectancy) = Tỷ lệ thắng × Lãi trung bình − Tỷ lệ thua × Lỗ trung bình.</b> Đo bằng đơn vị R (rủi ro một lệnh) cho dễ so sánh.</p>
<ul><li>Hệ thống thắng 40% với lãi trung bình 3R, lỗ 1R: kỳ vọng = 0.4 × 3 − 0.6 × 1 = <b>+0.6R/lệnh</b>, tức là có lời dù thua nhiều hơn thắng.</li>
<li>Hệ thống thắng 70% với lãi 0.5R, lỗ 1.5R: kỳ vọng = 0.35 − 0.45 = <b>−0.1R</b>, tức là lỗ dù thắng nhiều.</li></ul>
${C.demoHtml.expect()}
<h3>5. Chuỗi thua và rủi ro phá sản</h3>
<p>Với tỷ lệ thua q, xác suất thua n lệnh liên tiếp (tính từ một thời điểm) là qⁿ. Nhưng trong hàng trăm lệnh, <b>gần như chắc chắn</b> sẽ có những chuỗi thua dài. Vì vậy khối lượng mỗi lệnh phải đủ nhỏ (ví dụ rủi ro 1–2% tài khoản) để sống sót qua các chuỗi đó. Đây là nền tảng toán học của quản lý vốn.</p>`,
      keys: ['Xác suất cổ điển, thực nghiệm (tần suất — dùng nhiều nhất), chủ quan.', 'Quy tắc: bù, cộng, nhân (độc lập), có điều kiện; tránh ngụy biện con bạc.', 'Bayes: cập nhật xác suất khi có tín hiệu mới.', 'Kỳ vọng = W × lãi TB − L × lỗ TB; tỷ lệ thắng thấp vẫn có lời nếu lãi/lỗ lớn.', 'Chuỗi thua dài gần như chắc chắn xảy ra → rủi ro mỗi lệnh phải nhỏ.'],
      terms: [['Empirical probability', 'Xác suất thực nghiệm'], ['Conditional probability', 'Xác suất có điều kiện'], ['Independence', 'Độc lập'], ["Gambler's fallacy", 'Ngụy biện con bạc'], ['Bayes theorem', 'Định lý Bayes'], ['Expectancy', 'Kỳ vọng'], ['R-multiple', 'Bội số rủi ro']],
      quiz: [
        Q('Tỷ lệ thắng 40%, lãi TB 2R, lỗ TB 1R. Kỳ vọng mỗi lệnh:', ['−0.2R', '+0.2R', '+0.8R', '+1R'], 1, '0.4 × 2 − 0.6 × 1 = 0.2.'),
        Q('Tỷ lệ thắng 80%, lãi TB 0.25R, lỗ TB 1.5R. Kỳ vọng:', ['+0.2R', '−0.1R', '0', '+0.5R'], 1, '0.2 − 0.3 = −0.1.'),
        Q('Với lãi TB 2R, lỗ TB 1R, tỷ lệ thắng hoà vốn là:', ['50%', '33.3%', '66.7%', '25%'], 1, '1 / (2 + 1).'),
        Q('Tỷ lệ thua 50%. Xác suất thua 3 lệnh liên tiếp (độc lập) là:', ['50%', '25%', '12.5%', '6.25%'], 2, '0.5³.'),
        Q('"Đã thua 5 lần liền nên lần sau chắc thắng" là:', ['Đúng', 'Ngụy biện con bạc (nếu các lệnh độc lập)', 'Định lý Bayes', 'Kỳ vọng'], 1, ''),
        Q('P(A) = 0.3, P(B) = 0.4, A và B độc lập. P(A và B) =', ['0.7', '0.12', '0.1', '0.58'], 1, '0.3 × 0.4.'),
        Q('Định lý Bayes giúp:', ['Tính trung bình', 'Cập nhật xác suất khi có thông tin mới', 'Tính độ lệch chuẩn', 'Vẽ biểu đồ'], 1, ''),
        Q('Vì sao rủi ro mỗi lệnh nên nhỏ (1–2%)?', ['Để giao dịch nhiều', 'Để sống sót qua các chuỗi thua gần như chắc chắn xảy ra', 'Do luật', 'Để tăng phí'], 1, '')
      ]
    },
    en: {
      goals: ['Approaches to probability.', 'Addition, multiplication, conditional, independence.', 'Bayes.', 'Expectancy and losing streaks.'],
      body: () => `
<h3>1. Approaches</h3><ul><li>Classical</li><li>Empirical (frequency) — the technician’s main tool</li><li>Subjective</li></ul>
<h3>2. Rules</h3><table class="tbl"><tbody><tr><td>Complement</td><td>1 − P(A)</td></tr><tr><td>Addition</td><td>P(A)+P(B)−P(A∩B)</td></tr><tr><td>Multiplication (independent)</td><td>P(A)P(B)</td></tr><tr><td>Conditional</td><td>P(A∩B)/P(B)</td></tr></tbody></table><p>Beware the gambler’s fallacy.</p>
<h3>3. Bayes</h3><p>P(A|B) = P(B|A)P(A)/P(B).</p><div class="callout">Base rate 30%, signal hit rate 60% at lows, 20% otherwise → P(low | signal) ≈ 56%.</div>
<h3>4. Expectancy</h3><p>Win% × avg win − loss% × avg loss (in R). 40% wins at 3R vs 1R = +0.6R; 70% wins at 0.5R vs 1.5R = −0.1R.</p>${C.demoHtml.expect()}
<h3>5. Streaks</h3><p>qⁿ for a specific streak, but over hundreds of trades long streaks are nearly certain — keep risk per trade small.</p>`,
      keys: ['Empirical probability.', 'Rules; gambler’s fallacy.', 'Bayes updating.', 'Expectancy.', 'Streaks require small risk per trade.'],
      terms: [['Expectancy', 'Average R per trade'], ['Gambler’s fallacy', 'Believing independent outcomes are "due"']],
      quiz: [
        Q('40% wins, 2R avg win, 1R avg loss → expectancy:', ['−0.2R', '+0.2R', '+0.8R', '+1R'], 1, ''),
        Q('80% wins, 0.25R win, 1.5R loss →', ['+0.2R', '−0.1R', '0', '+0.5R'], 1, ''),
        Q('Breakeven win rate at 2R:1R:', ['50%', '33.3%', '66.7%', '25%'], 1, ''),
        Q('50% loss rate, 3 straight losses:', ['50%', '25%', '12.5%', '6.25%'], 2, ''),
        Q('"Five losses, so a win is due":', ['True', 'Gambler’s fallacy', 'Bayes', 'Expectancy'], 1, ''),
        Q('Independent P(A)=0.3, P(B)=0.4 → P(A∩B):', ['0.7', '0.12', '0.1', '0.58'], 1, ''),
        Q('Bayes helps:', ['Average', 'Update probabilities with new information', 'St.dev', 'Plot'], 1, ''),
        Q('Why small risk per trade?', ['Trade more', 'Survive near-certain losing streaks', 'Law', 'Fees'], 1, '')
      ]
    }
  };

  /* ================= 38 ================= */
  C.lessons['l1-38'] = {
    vi: {
      goals: ['Phân biệt PTKT chủ quan và PTKT khách quan.', 'Biết cách biến một ý tưởng thành quy tắc có thể kiểm định.', 'Hiểu kiểm định giả thuyết, ý nghĩa thống kê, cỡ mẫu.', 'Nhận diện thiên lệch đào bới dữ liệu và cách giảm thiểu: ngoài mẫu, walk-forward, kiểm định nhiều thị trường.'],
      body: () => `
<h3>1. Chủ quan và khách quan</h3>
<p><b>PTKT chủ quan</b>: diễn giải phụ thuộc người phân tích ("tôi thấy một vai–đầu–vai"). Không thể kiểm định vì hai người có thể thấy hai điều khác nhau. <b>PTKT khách quan</b>: quy tắc được định nghĩa chính xác đến mức <b>máy tính có thể thực hiện</b> và cho cùng một kết quả. Chỉ PTKT khách quan mới kiểm định được bằng phương pháp khoa học.</p>
<h3>2. Biến ý tưởng thành quy tắc</h3>
<ol><li>Định nghĩa chính xác tín hiệu vào và ra. Ví dụ: "mua khi giá đóng cửa vượt MA50, bán khi đóng cửa dưới MA50".</li>
<li>Xác định thị trường, khung thời gian, giai đoạn dữ liệu, chi phí giao dịch.</li>
<li>Chọn <b>chuẩn so sánh</b> (benchmark): thường là mua & giữ, hoặc kết quả kỳ vọng của quy tắc ngẫu nhiên. Với dữ liệu có xu hướng tăng dài hạn, cần <b>khử xu hướng</b> để quy tắc "luôn mua" không trông có vẻ tốt chỉ nhờ xu hướng chung.</li></ol>
<h3>3. Kiểm định giả thuyết</h3>
<ul><li><b>Giả thuyết không (H₀)</b>: quy tắc không có khả năng dự báo, tức lợi nhuận kỳ vọng bằng 0 hoặc bằng chuẩn. <b>Giả thuyết thay thế (H₁)</b>: quy tắc có lợi thế.</li>
<li><b>p-value</b>: xác suất thu được kết quả tốt ít nhất như vậy <b>nếu H₀ đúng</b> (tức chỉ do may mắn). p &lt; 0.05 là ngưỡng thường dùng để bác bỏ H₀.</li>
<li><b>Thống kê t</b> ≈ trung bình / (độ lệch chuẩn / √n). Cỡ mẫu (số lệnh) càng lớn, kết luận càng đáng tin. Vài chục lệnh hiếm khi đủ.</li>
<li>Phương pháp <b>bootstrap / Monte Carlo</b>: xáo trộn dữ liệu nhiều lần để tạo phân phối kết quả "nếu ngẫu nhiên", rồi so sánh kết quả thật với phân phối đó.</li></ul>
<h3>4. Thiên lệch đào bới dữ liệu</h3>
<p>Khi thử <b>rất nhiều</b> quy tắc hoặc tham số và chọn cái tốt nhất, kết quả của "người thắng" luôn bị <b>phóng đại</b>, vì một phần là may mắn. Hiệu suất tương lai thường kém hơn. Cách giảm thiểu:</p>
<ul><li>Chia dữ liệu: <b>trong mẫu</b> (để thiết kế) và <b>ngoài mẫu</b> (để kiểm tra, chỉ dùng một lần).</li>
<li><b>Walk-forward</b>: tối ưu trên một cửa sổ, kiểm tra trên cửa sổ kế tiếp, rồi trượt dần.</li>
<li>Kiểm tra trên <b>nhiều thị trường, nhiều giai đoạn</b>; ưu tiên quy tắc đơn giản, ít tham số.</li>
<li>Kiểm tra <b>độ bền</b>: hiệu suất có ổn định khi đổi tham số một chút không (vùng tham số tốt rộng hay chỉ một "đỉnh nhọn")?</li>
<li>Điều chỉnh mức ý nghĩa cho số lần thử.</li></ul>
${C.demoHtml.backtest()}`,
      keys: ['Chỉ PTKT khách quan (máy tính thực hiện được) mới kiểm định được.', 'Quy tắc cần: tín hiệu chính xác, thị trường, khung thời gian, chi phí, chuẩn so sánh, khử xu hướng.', 'H₀: không có lợi thế; p-value; thống kê t ≈ mean/(sd/√n); cỡ mẫu đủ lớn.', 'Bootstrap/Monte Carlo tạo phân phối "nếu ngẫu nhiên".', 'Đào bới dữ liệu phóng đại kết quả; dùng ngoài mẫu, walk-forward, đa thị trường, quy tắc đơn giản, kiểm tra độ bền.'],
      terms: [['Objective rule', 'Quy tắc khách quan'], ['Benchmark', 'Chuẩn so sánh'], ['Detrending', 'Khử xu hướng'], ['Null hypothesis / p-value', 'Giả thuyết không / giá trị p'], ['Data-mining bias', 'Thiên lệch đào bới dữ liệu'], ['In-sample / Out-of-sample', 'Trong mẫu / Ngoài mẫu'], ['Walk-forward', 'Kiểm định trượt'], ['Bootstrap', 'Lấy mẫu lặp']],
      quiz: [
        Q('Đặc điểm của quy tắc khách quan là:', ['Phụ thuộc người phân tích', 'Máy tính thực hiện được và cho kết quả như nhau', 'Không cần dữ liệu', 'Luôn có lãi'], 1, ''),
        Q('p-value = 0.03 nghĩa là:', ['Quy tắc chắc chắn đúng', 'Nếu quy tắc vô dụng, chỉ có 3% khả năng thu được kết quả tốt như vậy do may mắn', 'Lợi nhuận 3%', 'Sai số 3%'], 1, ''),
        Q('Vì sao cần khử xu hướng khi kiểm định trên dữ liệu tăng dài hạn?', ['Cho đẹp', 'Để quy tắc thiên về mua không trông tốt chỉ nhờ xu hướng chung', 'Giảm dữ liệu', 'Không cần'], 1, ''),
        Q('Thử 500 bộ tham số rồi chọn bộ tốt nhất. Rủi ro là:', ['Không có', 'Thiên lệch đào bới dữ liệu — hiệu suất bị phóng đại', 'Thiếu dữ liệu', 'Chi phí thấp'], 1, ''),
        Q('Dữ liệu ngoài mẫu nên được dùng:', ['Nhiều lần để tinh chỉnh', 'Chỉ một lần để kiểm tra cuối cùng', 'Không dùng', 'Để tính phí'], 1, 'Dùng nhiều lần thì nó trở thành dữ liệu trong mẫu.'),
        Q('Walk-forward là:', ['Tối ưu một lần trên toàn bộ dữ liệu', 'Tối ưu trên cửa sổ này, kiểm tra trên cửa sổ kế tiếp, rồi trượt', 'Đi bộ', 'Mua & giữ'], 1, ''),
        Q('Dấu hiệu quy tắc bền vững là:', ['Chỉ một giá trị tham số cho kết quả tốt', 'Hiệu suất ổn định trong một vùng tham số rộng', 'Ít lệnh', 'Chỉ đúng một thị trường'], 1, ''),
        Q('Thống kê t tăng khi:', ['Số lệnh giảm', 'Số lệnh tăng (với cùng trung bình và độ lệch chuẩn)', 'Độ lệch chuẩn tăng', 'Trung bình bằng 0'], 1, 't ≈ mean/(sd/√n).')
      ]
    },
    en: {
      goals: ['Subjective vs objective TA.', 'Turn ideas into testable rules.', 'Hypothesis testing and significance.', 'Data-mining bias and remedies.'],
      body: () => `
<h3>1. Subjective vs objective</h3><p>Only rules a computer can execute identically can be tested scientifically.</p>
<h3>2. Defining rules</h3><ol><li>Exact entry/exit.</li><li>Market, timeframe, period, costs.</li><li>Benchmark; detrend so "always long" doesn’t look good merely from drift.</li></ol>
<h3>3. Hypothesis testing</h3><ul><li>H₀: no predictive power.</li><li>p-value: chance of results at least this good if H₀ is true; p &lt; 0.05 common.</li><li>t ≈ mean/(sd/√n); sample size matters.</li><li>Bootstrap / Monte Carlo.</li></ul>
<h3>4. Data-mining bias</h3><p>Picking the best of many inflates results. Remedies: in/out-of-sample, walk-forward, multiple markets, simplicity, robustness, adjusted significance.</p>${C.demoHtml.backtest()}`,
      keys: ['Objective rules are testable.', 'Benchmark and detrending.', 'H₀, p-values, t-stats, sample size.', 'Bootstrap/Monte Carlo.', 'Data-mining bias remedies.'],
      terms: [['Out-of-sample', 'Data reserved for final testing'], ['Walk-forward', 'Rolling optimise-then-test'], ['Data-mining bias', 'Inflated best-of-many results']],
      quiz: [
        Q('An objective rule:', ['Depends on the analyst', 'Is computer-executable with identical results', 'Needs no data', 'Always profits'], 1, ''),
        Q('p = 0.03 means:', ['Certain truth', '3% chance of such results by luck if useless', '3% profit', '3% error'], 1, ''),
        Q('Why detrend?', ['Aesthetics', 'So long-biased rules don’t benefit merely from drift', 'Less data', 'No need'], 1, ''),
        Q('Testing 500 parameter sets and picking the best risks:', ['Nothing', 'Data-mining bias', 'Too little data', 'Low costs'], 1, ''),
        Q('Out-of-sample data should be used:', ['Repeatedly', 'Once for final testing', 'Never', 'For fees'], 1, ''),
        Q('Walk-forward:', ['One full optimisation', 'Optimise, test next window, roll', 'Walking', 'Buy & hold'], 1, ''),
        Q('Robustness sign:', ['One good value', 'Stable across a wide parameter range', 'Few trades', 'One market only'], 1, ''),
        Q('t rises when:', ['Trades fall', 'Trades rise', 'St.dev rises', 'Mean is zero'], 1, '')
      ]
    }
  };

  /* ================= 39 ================= */
  C.lessons['l1-39'] = {
    vi: {
      goals: ['Phân biệt mục tiêu "đúng" và mục tiêu "kiếm tiền".', 'Hiểu vai trò của kỷ luật, linh hoạt và quản trị rủi ro.', 'Hiểu phương pháp "trọng lượng bằng chứng".', 'Áp dụng các nguyên tắc ứng xử của người giao dịch chuyên nghiệp.'],
      body: () => `
<h3>1. Đúng không quan trọng bằng kiếm được tiền</h3>
<p>Nhiều người phân tích giỏi vẫn thua lỗ vì họ muốn <b>chứng minh mình đúng</b>: giữ lệnh lỗ để chờ "thị trường hiểu ra", cãi lại với giá. Thị trường không quan tâm đến cái tôi. Mục tiêu là <b>kiếm tiền</b>, và điều đó đến từ việc thua ít khi sai, thắng nhiều khi đúng (kỳ vọng dương, Bài 37), không phải từ tỷ lệ dự báo đúng.</p>
<h3>2. Các nguyên tắc cốt lõi</h3>
<ol><li><b>Đi theo xu hướng, đừng chống lại "băng chuyền"</b>: hãy giao dịch theo hướng giá đang đi, kể cả khi bạn cho rằng nó "không hợp lý".</li>
<li><b>Linh hoạt</b>: sẵn sàng đổi quan điểm khi bằng chứng đổi. Dự báo là giả thuyết, không phải lời hứa.</li>
<li><b>Kiểm soát rủi ro trước, lợi nhuận sau</b>: mọi lệnh có điểm dừng; quy mô lệnh theo rủi ro.</li>
<li><b>Kỷ luật</b>: tuân thủ hệ thống. Các ngoại lệ do cảm xúc thường là nguồn thua lỗ lớn nhất.</li>
<li><b>Khiêm tốn</b>: không ai biết chắc tương lai. Nghĩ theo xác suất và kịch bản (giống 3 kịch bản trong phần Wyckoff của web này).</li></ol>
<h3>3. Phương pháp "trọng lượng bằng chứng"</h3>
<p>Không dựa vào một chỉ báo duy nhất. Hãy tổng hợp nhiều chỉ báo <b>độc lập</b> từ các nhóm khác nhau:</p>
<table class="tbl"><thead><tr><th>Nhóm</th><th>Ví dụ</th></tr></thead><tbody>
<tr><td>Xu hướng giá ("băng chuyền")</td><td>Giá so với MA dài, đỉnh/đáy, sức mạnh tương đối</td></tr>
<tr><td>Độ rộng</td><td>Đường A/D, % cổ phiếu trên MA</td></tr>
<tr><td>Tâm lý</td><td>Put/Call, khảo sát, VIX</td></tr>
<tr><td>Tiền tệ / lãi suất</td><td>Xu hướng lãi suất, chính sách ngân hàng trung ương ("đừng chống lại ngân hàng trung ương")</td></tr>
<tr><td>Định giá / vĩ mô</td><td>Bối cảnh dài hạn</td></tr></tbody></table>
<p>Khi đa số chỉ báo cùng hướng, ta tăng tỷ trọng. Khi chúng phân kỳ, ta giảm tỷ trọng và giữ tiền mặt. Cách này giúp tránh phụ thuộc vào một tín hiệu dễ sai.</p>
<h3>4. Thói quen của người giao dịch hiệu quả</h3>
<ul><li>Kế hoạch giao dịch viết trước khi vào lệnh: lý do vào, điểm dừng, mục tiêu, kịch bản sai.</li>
<li>Nhật ký giao dịch: ghi lại cả cảm xúc, rồi đánh giá định kỳ.</li>
<li>Đánh giá quy trình, không chỉ kết quả: một lệnh lỗ nhưng đúng quy trình vẫn là lệnh "tốt".</li>
<li>Giảm quy mô khi đang chuỗi thua hoặc khi không chắc; tăng dần khi hệ thống chứng minh hiệu quả.</li></ul>`,
      keys: ['Mục tiêu là kiếm tiền (kỳ vọng dương), không phải chứng minh mình đúng.', 'Nguyên tắc: theo xu hướng, linh hoạt, rủi ro trước lợi nhuận sau, kỷ luật, khiêm tốn.', 'Trọng lượng bằng chứng: tổng hợp chỉ báo độc lập (giá, độ rộng, tâm lý, tiền tệ, vĩ mô).', 'Đánh giá quy trình, không chỉ kết quả; nhật ký và kế hoạch viết sẵn.'],
      terms: [['Weight of the evidence', 'Trọng lượng bằng chứng'], ["Don't fight the tape", 'Đừng chống lại xu hướng giá'], ["Don't fight the Fed", 'Đừng chống lại ngân hàng trung ương'], ['Trading journal', 'Nhật ký giao dịch'], ['Process vs outcome', 'Quy trình và kết quả']],
      quiz: [
        Q('Nguồn thua lỗ phổ biến của người phân tích giỏi là:', ['Thiếu dữ liệu', 'Muốn chứng minh mình đúng, giữ lệnh lỗ', 'Phí thấp', 'Dùng quá nhiều điểm dừng'], 1, ''),
        Q('"Đừng chống lại băng chuyền" nghĩa là:', ['Đừng dùng máy tính', 'Giao dịch theo hướng giá đang đi', 'Mua đáy', 'Bán đỉnh'], 1, ''),
        Q('Phương pháp trọng lượng bằng chứng khuyên:', ['Dùng một chỉ báo tốt nhất', 'Tổng hợp nhiều chỉ báo độc lập từ các nhóm khác nhau', 'Theo tin tức', 'Không dùng chỉ báo'], 1, ''),
        Q('Khi các nhóm chỉ báo phân kỳ, nên:', ['Tăng đòn bẩy', 'Giảm tỷ trọng, giữ tiền mặt', 'Mua thêm', 'Bỏ điểm dừng'], 1, ''),
        Q('Một lệnh lỗ nhưng tuân thủ đúng quy trình là:', ['Lệnh xấu', 'Lệnh "tốt" về quy trình', 'Lỗi hệ thống', 'Cần bỏ hệ thống'], 1, 'Kết quả từng lệnh có yếu tố ngẫu nhiên.'),
        Q('"Đừng chống lại ngân hàng trung ương" thuộc nhóm chỉ báo:', ['Độ rộng', 'Tiền tệ/lãi suất', 'Tâm lý', 'Mẫu hình'], 1, ''),
        Q('Khi đang trong chuỗi thua, nên:', ['Tăng quy mô để gỡ', 'Giảm quy mô, rà soát quy trình', 'Bỏ điểm dừng', 'Đổi hệ thống ngay'], 1, ''),
        Q('Linh hoạt nghĩa là:', ['Đổi hệ thống mỗi ngày', 'Sẵn sàng đổi quan điểm khi bằng chứng đổi', 'Không có kế hoạch', 'Giao dịch theo cảm xúc'], 1, '')
      ]
    },
    en: {
      goals: ['Being right vs making money.', 'Discipline, flexibility, risk control.', 'Weight of the evidence.', 'Professional habits.'],
      body: () => `
<h3>1. Making money beats being right</h3><p>Ego keeps losers open. Profit comes from small losses and large gains (positive expectancy), not forecast accuracy.</p>
<h3>2. Principles</h3><ol><li>Don’t fight the tape.</li><li>Be flexible.</li><li>Risk first.</li><li>Discipline.</li><li>Humility — think in scenarios.</li></ol>
<h3>3. Weight of the evidence</h3><table class="tbl"><tbody><tr><td>Price trend</td><td>MAs, swings, RS</td></tr><tr><td>Breadth</td><td>A/D, % above MA</td></tr><tr><td>Sentiment</td><td>Put/call, surveys, VIX</td></tr><tr><td>Monetary</td><td>Rates, central banks ("don’t fight the Fed")</td></tr><tr><td>Valuation/macro</td><td>Long-term context</td></tr></tbody></table><p>Agreement → more exposure; disagreement → less.</p>
<h3>4. Habits</h3><ul><li>Written plans.</li><li>Journals.</li><li>Judge process, not just outcome.</li><li>Cut size in drawdowns.</li></ul>`,
      keys: ['Making money, not being right.', 'Tape, flexibility, risk, discipline, humility.', 'Weight of independent evidence.', 'Process over outcome.'],
      terms: [['Weight of the evidence', 'Combining independent indicators'], ['Process vs outcome', 'Judging decisions, not luck']],
      quiz: [
        Q('Common loss source for good analysts:', ['No data', 'Needing to be right, holding losers', 'Low fees', 'Too many stops'], 1, ''),
        Q('"Don’t fight the tape":', ['No computers', 'Trade with price direction', 'Buy lows', 'Sell highs'], 1, ''),
        Q('Weight of the evidence:', ['One best indicator', 'Combine independent indicator groups', 'Follow news', 'No indicators'], 1, ''),
        Q('When groups diverge:', ['More leverage', 'Less exposure, more cash', 'Buy more', 'Drop stops'], 1, ''),
        Q('A losing trade that followed the process is:', ['Bad', 'Good by process', 'A system error', 'Reason to quit'], 1, ''),
        Q('"Don’t fight the Fed" belongs to:', ['Breadth', 'Monetary', 'Sentiment', 'Patterns'], 1, ''),
        Q('During a losing streak:', ['Size up', 'Size down and review', 'Drop stops', 'Switch instantly'], 1, ''),
        Q('Flexibility means:', ['New system daily', 'Changing views when evidence changes', 'No plan', 'Emotional trading'], 1, '')
      ]
    }
  };

  /* ================= 40 ================= */
  C.lessons['l1-40'] = {
    vi: {
      goals: ['Nắm các bước xây dựng một mô hình/hệ thống giao dịch.', 'Biết chọn và kết hợp chỉ báo thành mô hình tổng hợp.', 'Tránh tối ưu quá mức; đánh giá mô hình bằng nhiều thước đo.', 'Duy trì và giám sát mô hình theo thời gian.'],
      body: () => `
<h3>1. Quy trình xây dựng mô hình</h3>
<ol><li><b>Xác định mục tiêu</b>: thị trường, khung thời gian, loại tín hiệu (định thời điểm vào/ra thị trường, phân bổ tài sản, chọn cổ phiếu), mức rủi ro chấp nhận.</li>
<li><b>Ý tưởng có cơ sở</b>: mỗi chỉ báo nên có lý do kinh tế hoặc hành vi giải thích vì sao nó hoạt động (Phần V), không chỉ vì "khớp dữ liệu".</li>
<li><b>Chọn chỉ báo</b> từ các nhóm độc lập (xu hướng, độ rộng, tâm lý, tiền tệ…) để tránh trùng lặp thông tin.</li>
<li><b>Định nghĩa tín hiệu</b> khách quan cho từng chỉ báo (tăng/giảm/trung tính).</li>
<li><b>Kiểm định từng chỉ báo</b>: lợi nhuận của thị trường khi chỉ báo ở trạng thái tăng so với khi ở trạng thái giảm.</li>
<li><b>Kết hợp</b> thành mô hình tổng hợp: cộng điểm các chỉ báo, quyết định theo tổng điểm.</li>
<li><b>Kiểm định toàn mô hình</b> ngoài mẫu, đa giai đoạn (Bài 38).</li>
<li><b>Triển khai và giám sát</b>.</li></ol>
<h3>2. Mô hình tổng hợp</h3>
<div class="callout"><b>Ví dụ đơn giản</b>: 5 chỉ báo, mỗi chỉ báo +1 (tăng), 0 (trung tính), −1 (giảm). Tổng từ +3 đến +5: tỷ trọng cổ phiếu 100%. Từ −2 đến +2: 50%. Từ −5 đến −3: 0%. Kiểm tra lợi nhuận lịch sử của thị trường trong từng vùng điểm để xem mô hình có phân loại tốt không.</div>
<p>Ưu điểm: không phụ thuộc một chỉ báo; khi một chỉ báo "hỏng", mô hình vẫn hoạt động. Hãy dùng ít chỉ báo nhưng chất lượng, độc lập với nhau.</p>
<h3>3. Đánh giá mô hình</h3>
<table class="tbl"><thead><tr><th>Thước đo</th><th>Ý nghĩa</th></tr></thead><tbody>
<tr><td>Lợi nhuận hằng năm (CAGR)</td><td>Tăng trưởng kép</td></tr>
<tr><td>Sụt giảm tối đa (max drawdown)</td><td>Cú giảm lớn nhất từ đỉnh tài khoản: thước đo nỗi đau thực tế</td></tr>
<tr><td>Tỷ lệ Sharpe</td><td>(Lợi nhuận − lãi suất phi rủi ro) / độ lệch chuẩn</td></tr>
<tr><td>Tỷ lệ thắng, tỷ lệ lãi/lỗ, kỳ vọng</td><td>Cấu trúc lợi nhuận (Bài 37)</td></tr>
<tr><td>Thời gian trong thị trường</td><td>Phần trăm thời gian có vị thế</td></tr>
<tr><td>Số lệnh</td><td>Đủ lớn để có ý nghĩa thống kê</td></tr></tbody></table>
<h3>4. Tránh tối ưu quá mức</h3>
<ul><li>Càng nhiều tham số, càng dễ "khớp" với nhiễu của quá khứ.</li>
<li>Ưu tiên tham số "tròn", phổ biến, nằm giữa vùng ổn định thay vì đúng đỉnh tối ưu.</li>
<li>Mô hình phải <b>có lý</b> khi giải thích bằng lời. Nếu không giải thích được, hãy nghi ngờ.</li></ul>
<h3>5. Giám sát và bảo trì</h3>
<p>Thị trường thay đổi (Bài 32, AMH). Hãy theo dõi hiệu suất thực tế so với kiểm định. Nếu kết quả lệch quá mức hợp lý (ví dụ sụt giảm vượt xa mức tối đa lịch sử), hãy xem lại mô hình. Nhưng đừng sửa mô hình sau mỗi lần thua: đó lại là tối ưu quá mức.</p>`,
      keys: ['Quy trình: mục tiêu → ý tưởng có cơ sở → chỉ báo độc lập → tín hiệu khách quan → kiểm định từng phần → kết hợp → kiểm định toàn mô hình → giám sát.', 'Mô hình tổng hợp cộng điểm nhiều chỉ báo để quyết định tỷ trọng.', 'Đánh giá: CAGR, max drawdown, Sharpe, kỳ vọng, thời gian trong thị trường, số lệnh.', 'Tránh tối ưu quá mức: ít tham số, tham số ở vùng ổn định, giải thích được.', 'Giám sát hiệu suất thực tế nhưng không sửa sau mỗi lần thua.'],
      terms: [['Composite model', 'Mô hình tổng hợp'], ['Max drawdown', 'Sụt giảm tối đa'], ['Sharpe ratio', 'Tỷ lệ Sharpe'], ['CAGR', 'Tăng trưởng kép hằng năm'], ['Overfitting', 'Tối ưu quá mức'], ['Time in market', 'Thời gian có vị thế']],
      quiz: [
        Q('Bước đầu tiên của xây dựng mô hình là:', ['Chọn chỉ báo yêu thích', 'Xác định mục tiêu, thị trường, khung thời gian, rủi ro chấp nhận', 'Tối ưu tham số', 'Giao dịch thật'], 1, ''),
        Q('Vì sao nên chọn chỉ báo từ các nhóm độc lập?', ['Cho đẹp', 'Tránh trùng lặp thông tin, tăng độ bền', 'Giảm dữ liệu', 'Không có lý do'], 1, ''),
        Q('Max drawdown đo:', ['Lợi nhuận lớn nhất', 'Cú giảm lớn nhất từ đỉnh tài khoản', 'Số lệnh', 'Phí'], 1, ''),
        Q('Tỷ lệ Sharpe =', ['Lợi nhuận / phí', '(Lợi nhuận − lãi suất phi rủi ro) / độ lệch chuẩn', 'Tỷ lệ thắng', 'Drawdown / lợi nhuận'], 1, ''),
        Q('Dấu hiệu tối ưu quá mức là:', ['Ít tham số', 'Nhiều tham số, chỉ một bộ giá trị cho kết quả tốt', 'Kiểm định ngoài mẫu tốt', 'Giải thích được bằng lời'], 1, ''),
        Q('Khi mô hình thua một vài lệnh, nên:', ['Sửa ngay tham số', 'Theo dõi; chỉ xem lại nếu lệch quá mức hợp lý so với kiểm định', 'Bỏ mô hình', 'Tăng đòn bẩy'], 1, ''),
        Q('Ưu điểm của mô hình tổng hợp là:', ['Phụ thuộc một chỉ báo', 'Vẫn hoạt động khi một chỉ báo hỏng', 'Không cần kiểm định', 'Luôn thắng'], 1, ''),
        Q('Mỗi chỉ báo trong mô hình nên có:', ['Lý do kinh tế/hành vi giải thích vì sao nó hoạt động', 'Càng nhiều tham số càng tốt', 'Kết quả hoàn hảo trong quá khứ', 'Không cần lý do'], 0, '')
      ]
    },
    en: {
      goals: ['Steps to build a model.', 'Combine indicators into composites.', 'Avoid overfitting; evaluate broadly.', 'Monitor over time.'],
      body: () => `
<h3>1. Process</h3><ol><li>Objective.</li><li>Ideas with economic/behavioural rationale.</li><li>Independent indicator groups.</li><li>Objective signals.</li><li>Test each indicator.</li><li>Combine.</li><li>Test the whole out-of-sample.</li><li>Deploy and monitor.</li></ol>
<h3>2. Composites</h3><div class="callout">Five indicators scored +1/0/−1: +3…+5 → 100% equities, −2…+2 → 50%, −5…−3 → 0%; check historical returns per zone.</div>
<h3>3. Evaluation</h3><table class="tbl"><tbody><tr><td>CAGR</td></tr><tr><td>Max drawdown</td></tr><tr><td>Sharpe</td></tr><tr><td>Win rate, payoff, expectancy</td></tr><tr><td>Time in market</td></tr><tr><td>Number of trades</td></tr></tbody></table>
<h3>4. Overfitting</h3><ul><li>Fewer parameters.</li><li>Values in stable regions.</li><li>Must make sense in words.</li></ul>
<h3>5. Monitoring</h3><p>Compare live with tested results; review on abnormal deviations, not after every loss.</p>`,
      keys: ['Objective → rationale → independent indicators → signals → tests → composite → OOS → monitoring.', 'Composite scoring.', 'CAGR, drawdown, Sharpe, expectancy.', 'Avoid overfitting.', 'Monitor without constant tinkering.'],
      terms: [['Max drawdown', 'Largest peak-to-trough equity fall'], ['Sharpe ratio', 'Excess return per unit of volatility']],
      quiz: [
        Q('First step:', ['Pick favourite indicators', 'Define objective, market, timeframe, risk', 'Optimise', 'Trade live'], 1, ''),
        Q('Independent groups because:', ['Aesthetics', 'Avoid redundancy, improve robustness', 'Less data', 'None'], 1, ''),
        Q('Max drawdown:', ['Largest gain', 'Largest peak-to-trough fall', 'Trades', 'Fees'], 1, ''),
        Q('Sharpe =', ['Return/fees', '(Return − rf)/st.dev', 'Win rate', 'Drawdown/return'], 1, ''),
        Q('Overfitting sign:', ['Few parameters', 'Many parameters, one lucky set', 'Good OOS', 'Explainable'], 1, ''),
        Q('After a few losses:', ['Re-optimise now', 'Monitor; review only on abnormal deviation', 'Abandon', 'More leverage'], 1, ''),
        Q('Composite advantage:', ['Single dependency', 'Survives one indicator failing', 'No testing', 'Always wins'], 1, ''),
        Q('Each indicator should have:', ['A rationale', 'Many parameters', 'Perfect history', 'No reason'], 0, '')
      ]
    }
  };

  /* ================= 41 ================= */
  C.lessons['l1-41'] = {
    vi: {
      goals: ['Định nghĩa sức mạnh tương đối (RS) và các cách tính.', 'Hiểu nghiên cứu kinh điển về RS làm tiêu chí chọn cổ phiếu.', 'Áp dụng RS: đường RS, xếp hạng, luân chuyển ngành.', 'Nhận biết rủi ro và hạn chế của chiến lược RS.'],
      body: () => `
<h3>1. Sức mạnh tương đối là gì?</h3>
<p>Lưu ý: "sức mạnh tương đối" ở đây <b>không phải</b> chỉ báo RSI. RS so sánh hiệu suất của một tài sản với một chuẩn (chỉ số, ngành) hoặc với các tài sản khác.</p>
<ul><li><b>Đường RS</b> = Giá cổ phiếu ÷ Giá chỉ số. Đường đi lên nghĩa là cổ phiếu mạnh hơn thị trường, kể cả khi cả hai cùng giảm.</li>
<li><b>RS theo tỷ lệ với trung bình</b>: giá hiện tại ÷ giá trung bình trong N tuần (ví dụ 26 tuần), dùng để xếp hạng nhiều mã.</li>
<li><b>RS theo lợi suất</b>: lợi suất N tháng, xếp hạng theo phân vị (cách thường gặp trong nghiên cứu động lượng).</li></ul>
<h3>2. Nghiên cứu kinh điển</h3>
<p>Cuối thập niên 1960, Robert Levy đề xuất xếp hạng cổ phiếu theo tỷ số <b>giá hiện tại / giá trung bình 26 tuần</b>. Ông cho thấy nhóm có RS cao nhất tiếp tục vượt trội trong các tháng sau, và nhóm thấp nhất tiếp tục kém. Kết quả này đi ngược quan điểm "bước ngẫu nhiên" lúc bấy giờ. Nó báo trước khối nghiên cứu lớn về <b>hiệu ứng động lượng</b> sau này (Bài 28).</p>
<h3>3. Ứng dụng</h3>
<ul><li><b>Chọn cổ phiếu</b> (bước 2 của Wyckoff): ưu tiên mã mạnh hơn thị trường trong xu hướng tăng; tránh hoặc bán mã yếu hơn.</li>
<li><b>Luân chuyển ngành</b>: xếp hạng các ngành (hoặc ETF ngành), đặt tỷ trọng vào nhóm dẫn đầu, định kỳ cân bằng lại.</li>
<li><b>Xác nhận</b>: phá vỡ giá kèm đường RS cũng phá vỡ lên đỉnh mới là tín hiệu mạnh. Giá lập đỉnh mới mà đường RS không theo là cảnh báo (phân kỳ).</li>
<li><b>Phân bổ tài sản</b>: so sánh cổ phiếu, trái phiếu, vàng, tiền mặt theo RS (chiến lược động lượng đa tài sản), có thể kèm bộ lọc xu hướng tuyệt đối (chỉ nắm giữ khi xu hướng tăng).</li></ul>
${C.demoHtml.rsRank()}
<h3>4. Rủi ro và hạn chế</h3>
<ul><li><b>Sụp đổ động lượng</b>: ở các điểm đảo chiều mạnh của thị trường (đặc biệt khi hồi phục sau khủng hoảng), nhóm mạnh trước đó có thể giảm mạnh còn nhóm yếu bật tăng mạnh.</li>
<li><b>Chi phí giao dịch</b> do cân bằng lại thường xuyên.</li>
<li>RS chỉ là <b>tương đối</b>: trong thị trường giá xuống, mã "mạnh nhất" vẫn có thể giảm. Nên kết hợp với bộ lọc xu hướng tuyệt đối.</li>
<li>Chu kỳ xếp hạng và chu kỳ cân bằng lại ảnh hưởng nhiều đến kết quả. Hãy kiểm định cẩn thận (Bài 38).</li></ul>
<div class="callout">🎓 <b>Bạn đã hoàn thành lộ trình Level 1.</b> Hãy làm lại các bài chưa đạt 80%, tự vẽ sơ đồ tư duy cho 7 Phần, rồi sẵn sàng cho Level 2: chỉ báo chuyên sâu, mẫu hình nâng cao, phân tích liên thị trường, thống kê ứng dụng và quản trị danh mục.</div>`,
      keys: ['RS (không phải RSI) so sánh hiệu suất với chuẩn hoặc tài sản khác; đường RS = giá / chỉ số.', 'Nghiên cứu của Levy: giá / trung bình 26 tuần; nhóm RS cao tiếp tục vượt trội — tiền thân của nghiên cứu động lượng.', 'Ứng dụng: chọn cổ phiếu (bước 2 Wyckoff), luân chuyển ngành, xác nhận phá vỡ, phân bổ tài sản.', 'Rủi ro: sụp đổ động lượng ở điểm đảo chiều, chi phí, tính tương đối trong thị trường giá xuống — kết hợp bộ lọc xu hướng tuyệt đối.'],
      terms: [['Relative strength', 'Sức mạnh tương đối'], ['RS line', 'Đường RS (giá / chỉ số)'], ['Ranking', 'Xếp hạng'], ['Sector rotation', 'Luân chuyển ngành'], ['Momentum crash', 'Sụp đổ động lượng'], ['Absolute trend filter', 'Bộ lọc xu hướng tuyệt đối']],
      quiz: [
        Q('Sức mạnh tương đối (RS) trong bài này là:', ['Chỉ báo RSI', 'So sánh hiệu suất với chuẩn hoặc tài sản khác', 'Khối lượng', 'Biến động'], 1, 'Không nhầm với RSI.'),
        Q('Đường RS đi lên trong khi cả cổ phiếu và chỉ số đều giảm nghĩa là:', ['Cổ phiếu yếu hơn', 'Cổ phiếu giảm ít hơn thị trường — mạnh hơn tương đối', 'Lỗi dữ liệu', 'Không ý nghĩa'], 1, ''),
        Q('Tỷ số Levy kinh điển là:', ['Giá / EPS', 'Giá hiện tại / giá trung bình 26 tuần', 'Khối lượng / giá', 'RSI 14'], 1, ''),
        Q('Kết quả của Levy đi ngược quan điểm nào?', ['Theo xu hướng', 'Bước ngẫu nhiên', 'Lý thuyết Dow', 'Wyckoff'], 1, ''),
        Q('Giá lập đỉnh mới nhưng đường RS không theo. Đây là:', ['Xác nhận mạnh', 'Phân kỳ — cảnh báo', 'Tín hiệu mua chắc chắn', 'Không ý nghĩa'], 1, ''),
        Q('"Sụp đổ động lượng" thường xảy ra khi:', ['Thị trường đi ngang', 'Thị trường đảo chiều mạnh, nhất là khi hồi phục sau khủng hoảng', 'Lãi suất ổn định', 'Không bao giờ'], 1, ''),
        Q('Vì sao nên kết hợp RS với bộ lọc xu hướng tuyệt đối?', ['Giảm phí', 'Trong thị trường giá xuống, mã mạnh nhất vẫn có thể giảm', 'Do luật', 'Không cần'], 1, ''),
        Q('RS hỗ trợ trực tiếp bước nào trong quy trình 5 bước của Wyckoff?', ['Bước 1', 'Bước 2 — chọn tài sản hài hoà và mạnh hơn thị trường', 'Bước 4', 'Bước 5'], 1, '')
      ]
    },
    en: {
      goals: ['Define relative strength.', 'Know Levy’s classic study.', 'Apply RS: lines, rankings, rotation.', 'Recognise risks.'],
      body: () => `
<h3>1. RS</h3><p>Not RSI: RS compares performance with a benchmark or peers. RS line = stock ÷ index; ratio-to-average (e.g. price / 26-week average); return ranks.</p>
<h3>2. Classic study</h3><p>In the late 1960s Robert Levy ranked stocks by price / 26-week average; top-ranked stocks kept outperforming — a forerunner of momentum research and a challenge to the random walk.</p>
<h3>3. Uses</h3><ul><li>Stock selection — Wyckoff step 2.</li><li>Sector rotation.</li><li>Confirmation — RS line breaking out with price; divergence warns.</li><li>Multi-asset momentum with absolute trend filters.</li></ul>${C.demoHtml.rsRank()}
<h3>4. Risks</h3><ul><li>Momentum crashes at sharp turns.</li><li>Costs.</li><li>RS is relative — add absolute trend filters.</li><li>Ranking/rebalancing choices matter.</li></ul><div class="callout">🎓 <b>You have completed the Level 1 roadmap.</b> Revisit lessons below 80%, mind-map the seven Parts, and get ready for Level 2.</div>`,
      keys: ['RS ≠ RSI; RS line = price/index.', 'Levy’s price/26-week average ranking.', 'Selection, rotation, confirmation, allocation.', 'Momentum crashes; use absolute filters.'],
      terms: [['RS line', 'Price ÷ index'], ['Momentum crash', 'Sharp reversal of winners/losers']],
      quiz: [
        Q('RS here is:', ['RSI', 'Performance vs a benchmark or peers', 'Volume', 'Volatility'], 1, ''),
        Q('Rising RS line while both fall:', ['Weaker', 'Falling less — relatively stronger', 'Data error', 'Meaningless'], 1, ''),
        Q('Levy’s ratio:', ['Price/EPS', 'Price / 26-week average', 'Volume/price', 'RSI 14'], 1, ''),
        Q('Levy challenged:', ['Trend following', 'Random walk', 'Dow Theory', 'Wyckoff'], 1, ''),
        Q('New price high without new RS high:', ['Strong confirmation', 'Divergence warning', 'Certain buy', 'Meaningless'], 1, ''),
        Q('Momentum crashes occur:', ['In ranges', 'At sharp reversals, especially post-crisis rebounds', 'With stable rates', 'Never'], 1, ''),
        Q('Why add an absolute trend filter?', ['Lower fees', 'The strongest stock can still fall in a bear market', 'Law', 'No need'], 1, ''),
        Q('RS directly supports Wyckoff step:', ['1', '2', '4', '5'], 1, '')
      ]
    }
  };
})(window.LLW);
