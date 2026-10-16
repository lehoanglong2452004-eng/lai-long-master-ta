/* CMT Level 1 — Part V, lessons 27–35: efficient markets, behavioural finance, sentiment. Written by Lai Long Master TA in its own words. */
(function (L) {
  'use strict';
  const C = L.cmt, F = C.fig;
  const T = (lang, vi, en) => (lang === 'en' ? en : vi);
  const Q = (q, o, a, e) => ({ q, o, a, e });
  const css = C.css;
  const ld = () => `<span class="spinner"></span>${L.t('loading')}`;

  /* ---------- figures ---------- */
  const fg = {
    prospect: lg => {
      const pts = [];
      for (let x = -50; x <= 50; x += 1) { const v = x >= 0 ? Math.pow(x, 0.7) : -2.25 * Math.pow(-x, 0.7); pts.push([x + 50, 50 + v * 1.25]); }
      return F.line({ h: 260, hl: [[50, 's-sep']], vl: [[50, T(lg, 'điểm tham chiếu', 'reference point')]], series: [{ pts: pts.map(p => [p[0], Math.max(2, Math.min(98, p[1]))]) }],
        labels: [[97, 78, T(lg, 'Vùng lãi: dốc thoải dần', 'Gains: flattening'), 'l', 'nodot'], [54, 18, T(lg, 'Vùng lỗ: dốc gấp ~2 lần', 'Losses: ~2× steeper'), 'r', 'nodot']],
        caption: T(lg, 'Hàm giá trị của Lý thuyết Triển vọng: dốc hơn ở vùng lỗ (ghét lỗ), lõm ở vùng lãi, lồi ở vùng lỗ', 'Prospect theory value function: steeper for losses (loss aversion), concave for gains, convex for losses') });
    },
    feedback: lg => F.line({ h: 240, series: [{ pts: [[0, 20], [15, 24], [25, 30], [35, 40], [45, 55], [55, 72], [62, 88], [68, 80], [74, 60], [82, 42], [90, 34], [100, 30]] }, { pts: [[0, 22], [100, 40]], cls: 's-trend' }],
      labels: [[25, 30, T(lg, 'phản ứng chậm', 'underreaction'), 'b'], [62, 88, T(lg, 'phản ứng thái quá', 'overreaction'), 't'], [90, 34, T(lg, 'quay về giá trị', 'reversion'), 'b']],
      caption: T(lg, 'Đường nét đứt = "giá trị". Giá phản ứng chậm (tạo xu hướng), rồi vòng lặp phản hồi đẩy quá đà, cuối cùng quay về', 'Dashed = "value". Price underreacts (trend), feedback loops overshoot, then it reverts') })
  };

  /* ---------- demo: random or real? ---------- */
  C.demoHtml.randomReal = () => `<div class="demo" data-demo="randomReal"><div class="demo-head"><b>🎲 ${L.T('Thử thách: Ngẫu nhiên hay thật?', 'Challenge: random or real?')}</b>
    <span class="muted">${L.T('Một biểu đồ là giá thật (VNINDEX hoặc BTC), biểu đồ kia là bước ngẫu nhiên có cùng biến động. Bạn đoán biểu đồ nào là thật?', 'One chart is real (VNINDEX or BTC), the other a random walk with the same volatility. Which is real?')}</span></div>
    <div class="rr-grid"><div class="demo-chart rr-a"></div><div class="demo-chart rr-b"></div></div>
    <div class="demo-head"><button class="btn rr-pick" data-p="a">${L.T('Biểu đồ A là thật', 'A is real')}</button><button class="btn rr-pick" data-p="b">${L.T('Biểu đồ B là thật', 'B is real')}</button><button class="btn ghost rr-new">${L.T('Ván mới', 'New round')}</button></div>
    <div class="demo-out"></div></div>`;
  C.demoRun.randomReal = box => {
    const out = box.querySelector('.demo-out');
    let answer = null, score = { ok: 0, n: 0 };
    const round = async () => {
      out.innerHTML = ld();
      try {
        const src = Math.random() < 0.5 ? ['vn_stock', 'VNINDEX'] : ['bn_spot', 'BTCUSDT'];
        const all = await C.loadBars(src[0], src[1], '1D');
        const start = Math.floor(Math.random() * Math.max(1, all.length - 160));
        const real = all.slice(start, start + 150);
        const r = real.slice(1).map((b, i) => Math.log(b.c / real[i].c));
        const m = r.reduce((a, b) => a + b, 0) / r.length, sd = Math.sqrt(r.reduce((a, x) => a + (x - m) ** 2, 0) / r.length);
        const gauss = () => { let u = 0, v = 0; while (!u) u = Math.random(); while (!v) v = Math.random(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); };
        let c = real[0].c; const fake = real.map((b, i) => {
          const o = c; if (i) c = c * Math.exp(m + sd * gauss());
          const w = Math.abs(gauss()) * sd * 0.6 * c;
          return { t: b.t, o, c, h: Math.max(o, c) + w, l: Math.min(o, c) - w };
        });
        answer = Math.random() < 0.5 ? 'a' : 'b';
        const sets = answer === 'a' ? [real, fake] : [fake, real];
        ['.rr-a', '.rr-b'].forEach((q, k) => {
          const el = box.querySelector(q); el.innerHTML = '';
          const ch = C.mkChart(el, { timeScale: { visible: false }, rightPriceScale: { visible: false } }), s = C.candleSeries(ch);
          s.setData(sets[k].map((b, i) => ({ time: i + 1, open: b.o, high: b.h, low: b.l, close: b.c })));
          ch.timeScale().fitContent();
        });
        box.dataset.src = src[1];
        out.innerHTML = L.T('Hãy chọn A hoặc B.', 'Pick A or B.');
      } catch (e) { C.err(out, e); }
    };
    box.querySelectorAll('.rr-pick').forEach(b => b.onclick = () => {
      if (!answer) return;
      score.n++; const ok = b.dataset.p === answer; if (ok) score.ok++;
      out.innerHTML = (ok ? L.T('<b class="up">Chính xác!</b> ', '<b class="up">Correct!</b> ') : L.T('<b class="down">Chưa đúng.</b> ', '<b class="down">Not quite.</b> ')) +
        L.T(`Biểu đồ ${answer.toUpperCase()} là ${box.dataset.src} thật. Điểm: ${score.ok}/${score.n}. Nếu tỷ lệ đúng của bạn gần 50% sau nhiều ván, điều đó minh hoạ luận điểm của thuyết bước ngẫu nhiên: mắt người dễ thấy "mẫu hình" trong dữ liệu ngẫu nhiên. Nhà PTKT nghiêm túc vì thế cần kiểm định thống kê (Phần VI–VII).`,
          `Chart ${answer.toUpperCase()} is real ${box.dataset.src}. Score: ${score.ok}/${score.n}. A hit rate near 50% illustrates the random-walk argument: people see patterns in noise — hence statistical testing (Parts VI–VII).`);
      answer = null;
    });
    box.querySelector('.rr-new').onclick = round;
    round();
  };

  /* ---------- demo: sentiment extreme proxy (RSI + volatility) ---------- */
  C.demoHtml.sentProxy = () => C.demoShell('sentProxy', C.symControls('vn_stock', 'VNINDEX', '1D', ['1D', '1W']) + `<button class="btn primary d-go">${L.T('Xem', 'Show')}</button>`,
    L.T('Đại diện tâm lý từ dữ liệu giá: RSI 14 (đường vàng, thang trái). Vùng > 70 = hưng phấn, < 30 = sợ hãi. Mũi tên = cực trị tâm lý.', 'Price-based sentiment proxy: RSI 14 (gold, left scale). > 70 euphoria, < 30 fear; arrows mark extremes.'));
  C.demoRun.sentProxy = box => {
    const out = box.querySelector('.demo-out'), el = box.querySelector('.demo-chart');
    C.wire(box, async () => {
      out.innerHTML = ld();
      try {
        const bars = (await C.loadBars(...C.readSym(box))).slice(-400);
        let ag = 0, al = 0; const rsi = bars.map((b, i) => {
          if (!i) return null; const d = b.c - bars[i - 1].c, g = Math.max(0, d), l = Math.max(0, -d);
          if (i <= 14) { ag += g / 14; al += l / 14; return i < 14 ? null : 100 - 100 / (1 + ag / (al || 1e-9)); }
          ag = (ag * 13 + g) / 14; al = (al * 13 + l) / 14; return 100 - 100 / (1 + ag / (al || 1e-9));
        });
        el.innerHTML = '';
        const ch = C.mkChart(el, { leftPriceScale: { visible: true, borderColor: css('--line') } }), s = C.candleSeries(ch);
        s.setData(bars.map(b => ({ time: b.t, open: b.o, high: b.h, low: b.l, close: b.c })));
        const rl = ch.addLineSeries({ color: css('--accent'), lineWidth: 1, priceScaleId: 'left', priceLineVisible: false, lastValueVisible: false });
        rl.setData(bars.map((b, i) => rsi[i] == null ? null : { time: b.t, value: rsi[i] }).filter(Boolean));
        [70, 30].forEach(v => rl.createPriceLine({ price: v, color: css('--muted'), lineStyle: 2, lineWidth: 1, axisLabelVisible: true, title: String(v) }));
        const mk = []; let fear = 0, greed = 0, fwdF = [], fwdG = [];
        bars.forEach((b, i) => {
          if (rsi[i] == null || rsi[i - 1] == null) return;
          if (rsi[i - 1] < 30 && rsi[i] >= 30) { mk.push({ time: b.t, position: 'belowBar', color: css('--up'), shape: 'arrowUp', text: L.T('sợ', 'fear') }); fear++; if (i + 20 < bars.length) fwdF.push(bars[i + 20].c / b.c - 1); }
          if (rsi[i - 1] > 70 && rsi[i] <= 70) { mk.push({ time: b.t, position: 'aboveBar', color: css('--down'), shape: 'arrowDown', text: L.T('tham', 'greed') }); greed++; if (i + 20 < bars.length) fwdG.push(bars[i + 20].c / b.c - 1); }
        });
        s.setMarkers(mk);
        ch.timeScale().fitContent();
        const avg = a => a.length ? (a.reduce((x, y) => x + y, 0) / a.length * 100).toFixed(1) + '%' : '—';
        out.innerHTML = L.T(`${fear} lần thoát vùng sợ hãi (RSI cắt lên 30) — lợi nhuận trung bình 20 nến sau: <b>${avg(fwdF)}</b>. ${greed} lần thoát vùng hưng phấn (RSI cắt xuống 70) — 20 nến sau: <b>${avg(fwdG)}</b>. Đây là kiểm tra nhanh tinh thần "đi ngược đám đông" trên chính dữ liệu này, không phải kết luận tổng quát.`,
          `${fear} exits from fear (RSI up through 30) — average 20-bar forward return <b>${avg(fwdF)}</b>. ${greed} exits from greed (RSI down through 70) — <b>${avg(fwdG)}</b>. A quick contrarian check on this data only.`);
      } catch (e) { C.err(out, e); }
    });
  };

  /* ================= 27 ================= */
  C.lessons['l1-27'] = {
    vi: {
      goals: ['Định nghĩa Giả thuyết Thị trường Hiệu quả (EMH).', 'Phân biệt ba dạng: yếu, bán mạnh, mạnh.', 'Hiểu thuyết bước ngẫu nhiên và hệ quả với PTKT.', 'Nêu các điều kiện để thị trường hiệu quả và vấn đề "giả thuyết kép".'],
      body: () => `
<h3>1. Ý tưởng</h3>
<p><b>Giả thuyết Thị trường Hiệu quả (EMH)</b>, gắn với Eugene Fama (thập niên 1960–1970): giá chứng khoán <b>phản ánh đầy đủ và nhanh chóng</b> mọi thông tin sẵn có. Nếu đúng, không ai có thể liên tục kiếm lợi nhuận vượt trội (sau khi điều chỉnh rủi ro) chỉ bằng cách khai thác thông tin đã biết.</p>
<p>Lập luận nền: có rất nhiều người lý trí, có thông tin và cạnh tranh nhau. Bất kỳ sai lệch nào cũng bị khai thác ngay, nên giá chỉ thay đổi khi có <b>thông tin mới</b>. Mà thông tin mới thì không thể dự đoán, nên thay đổi giá là <b>ngẫu nhiên</b>.</p>
<h3>2. Ba dạng EMH</h3>
<table class="tbl"><thead><tr><th>Dạng</th><th>Giá phản ánh</th><th>Hệ quả</th></tr></thead><tbody>
<tr><td><b>Yếu</b></td><td>Toàn bộ thông tin giá và khối lượng quá khứ</td><td><b>PTKT không tạo lợi nhuận vượt trội</b></td></tr>
<tr><td><b>Bán mạnh</b></td><td>Mọi thông tin công khai (báo cáo tài chính, tin tức)</td><td>Cả phân tích cơ bản cũng không tạo lợi thế</td></tr>
<tr><td><b>Mạnh</b></td><td>Mọi thông tin, kể cả thông tin nội bộ</td><td>Không ai có lợi thế, kể cả người trong cuộc</td></tr></tbody></table>
<p>Dạng mạnh rõ ràng không đúng hoàn toàn: giao dịch nội gián có lợi nhuận, nên mới bị cấm. Tranh luận chủ yếu xoay quanh dạng yếu và bán mạnh.</p>
<h3>3. Bước ngẫu nhiên (random walk)</h3>
<p>Nếu thay đổi giá độc lập với quá khứ, đường giá giống như một bước đi ngẫu nhiên. Các "xu hướng" và "mẫu hình" nhìn thấy chỉ là ngẫu nhiên. Một thử nghiệm nổi tiếng cho thấy người xem khó phân biệt biểu đồ thật với biểu đồ sinh ngẫu nhiên. Hãy tự thử:</p>
${C.demoHtml.randomReal()}
<h3>4. Điều kiện và giới hạn</h3>
<ul><li>EMH cần: thông tin lan truyền tức thời và miễn phí; nhà đầu tư lý trí; không có chi phí và giới hạn kinh doanh chênh lệch. Thực tế không thoả hoàn toàn các điều kiện này.</li>
<li><b>Nghịch lý Grossman–Stiglitz</b>: nếu thị trường hoàn toàn hiệu quả thì không ai có động lực tốn chi phí thu thập thông tin, mà khi đó thị trường không thể hiệu quả. Vì vậy thị trường chỉ có thể "hiệu quả ở mức vừa đủ".</li>
<li><b>Vấn đề giả thuyết kép (joint hypothesis)</b>: muốn kiểm định EMH thì phải có mô hình định giá "lợi nhuận bình thường". Khi thấy lợi nhuận bất thường, ta không biết thị trường kém hiệu quả hay mô hình định giá sai.</li></ul>
<div class="callout">Với nhà PTKT, EMH là <b>giả thuyết không (null hypothesis)</b> cần vượt qua: một phương pháp chỉ có giá trị khi chứng minh được lợi thế vượt trội sau chi phí và rủi ro, một cách có ý nghĩa thống kê.</div>`,
      keys: ['EMH: giá phản ánh đầy đủ, nhanh chóng thông tin sẵn có → không thể liên tục vượt trội sau điều chỉnh rủi ro.', 'Dạng yếu (giá quá khứ — phủ nhận PTKT), bán mạnh (thông tin công khai), mạnh (cả thông tin nội bộ).', 'Bước ngẫu nhiên: thay đổi giá độc lập; mắt người dễ thấy mẫu hình trong dữ liệu ngẫu nhiên.', 'Nghịch lý Grossman–Stiglitz; vấn đề giả thuyết kép.', 'Với PTKT, EMH là giả thuyết không cần vượt qua bằng bằng chứng thống kê.'],
      terms: [['EMH', 'Giả thuyết Thị trường Hiệu quả'], ['Weak / Semi-strong / Strong form', 'Dạng yếu / bán mạnh / mạnh'], ['Random walk', 'Bước ngẫu nhiên'], ['Abnormal return', 'Lợi nhuận bất thường'], ['Joint hypothesis problem', 'Vấn đề giả thuyết kép'], ['Null hypothesis', 'Giả thuyết không']],
      quiz: [
        Q('Dạng EMH nào trực tiếp phủ nhận giá trị của PTKT?', ['Dạng yếu', 'Dạng bán mạnh', 'Dạng mạnh', 'Không dạng nào'], 0, 'Dạng yếu cho rằng giá đã phản ánh mọi dữ liệu giá/khối lượng quá khứ.'),
        Q('Dạng bán mạnh nói giá phản ánh:', ['Chỉ giá quá khứ', 'Mọi thông tin công khai', 'Cả thông tin nội bộ', 'Không thông tin nào'], 1, 'Cả phân tích cơ bản cũng không tạo lợi thế.'),
        Q('Bằng chứng nào cho thấy dạng mạnh không đúng hoàn toàn?', ['PTKT thất bại', 'Giao dịch nội gián có lợi nhuận (nên bị cấm)', 'Giá biến động', 'Có cổ tức'], 1, 'Người có thông tin nội bộ có lợi thế.'),
        Q('Theo EMH, giá chỉ thay đổi khi:', ['Có xu hướng', 'Có thông tin mới (không dự đoán được)', 'Có khối lượng', 'Có mẫu hình'], 1, 'Do đó thay đổi giá là ngẫu nhiên.'),
        Q('Nghịch lý Grossman–Stiglitz nói rằng:', ['Thị trường luôn hiệu quả hoàn toàn', 'Nếu hoàn toàn hiệu quả thì không ai thu thập thông tin, nên không thể hoàn toàn hiệu quả', 'PTKT luôn thắng', 'Giá cố định'], 1, 'Cần một mức kém hiệu quả để bù chi phí thông tin.'),
        Q('Vấn đề giả thuyết kép là:', ['Có hai thị trường', 'Kiểm định EMH luôn đi kèm kiểm định một mô hình định giá', 'Có hai dạng EMH', 'Không có'], 1, 'Không tách được nguyên nhân của lợi nhuận bất thường.'),
        Q('Với nhà PTKT, cách nhìn đúng về EMH là:', ['Bỏ qua hoàn toàn', 'Coi là giả thuyết không cần vượt qua bằng bằng chứng', 'Tin tuyệt đối', 'Chỉ áp dụng cho trái phiếu'], 1, 'Cần chứng minh lợi thế có ý nghĩa thống kê sau chi phí.'),
        Q('Gắn với EMH là nhà kinh tế:', ['Charles Dow', 'Eugene Fama', 'R.N. Elliott', 'Steve Nison'], 1, 'Fama hệ thống hoá EMH.')
      ]
    },
    en: {
      goals: ['Define the EMH.', 'Distinguish weak, semi-strong, strong forms.', 'Understand the random walk.', 'Know conditions and the joint-hypothesis problem.'],
      body: () => `
<h3>1. Idea</h3><p>Associated with Eugene Fama: prices fully and quickly reflect available information, so nobody can consistently earn risk-adjusted excess returns from it. Only new, unpredictable information moves prices, so changes are random.</p>
<h3>2. Forms</h3><table class="tbl"><tbody><tr><td>Weak</td><td>Past prices/volume → TA cannot outperform</td></tr><tr><td>Semi-strong</td><td>All public information</td></tr><tr><td>Strong</td><td>All information including insider — clearly not fully true</td></tr></tbody></table>
<h3>3. Random walk</h3><p>If changes are independent, trends and patterns are illusions. Try it:</p>${C.demoHtml.randomReal()}
<h3>4. Limits</h3><ul><li>Conditions (free instant information, rationality, frictionless arbitrage) are not fully met.</li><li><b>Grossman–Stiglitz paradox</b>.</li><li><b>Joint-hypothesis problem</b>.</li></ul><div class="callout">For technicians the EMH is the <b>null hypothesis</b> to beat with statistically significant, after-cost evidence.</div>`,
      keys: ['EMH: prices reflect information.', 'Weak form denies TA; semi-strong; strong.', 'Random walk; people see patterns in noise.', 'Grossman–Stiglitz; joint hypothesis.', 'EMH is the null to beat.'],
      terms: [['Null hypothesis', 'Default assumption to reject'], ['Joint hypothesis', 'EMH tests also test a pricing model']],
      quiz: [
        Q('Which form directly denies TA?', ['Weak', 'Semi-strong', 'Strong', 'None'], 0, ''),
        Q('Semi-strong form reflects:', ['Past prices only', 'All public information', 'Insider information', 'Nothing'], 1, ''),
        Q('Evidence against the strong form:', ['TA fails', 'Profitable insider trading', 'Volatility', 'Dividends'], 1, ''),
        Q('Under EMH prices change on:', ['Trends', 'New unpredictable information', 'Volume', 'Patterns'], 1, ''),
        Q('Grossman–Stiglitz:', ['Markets are perfectly efficient', 'Perfect efficiency removes the incentive to gather information', 'TA always wins', 'Fixed prices'], 1, ''),
        Q('Joint hypothesis problem:', ['Two markets', 'EMH tests also test a pricing model', 'Two forms', 'None'], 1, ''),
        Q('Technicians should treat EMH as:', ['Irrelevant', 'A null hypothesis to overcome', 'Gospel', 'Bonds only'], 1, ''),
        Q('EMH is associated with:', ['Dow', 'Fama', 'Elliott', 'Nison'], 1, '')
      ]
    }
  };

  /* ================= 28 ================= */
  C.lessons['l1-28'] = {
    vi: {
      goals: ['Hiểu "mô hình thị trường" và CAPM: alpha, beta.', 'Đo lợi nhuận vượt trội đã điều chỉnh rủi ro.', 'Nắm các "bất thường" (anomalies) thách thức EMH.', 'Hiểu bong bóng và biến động vượt mức như bằng chứng chống EMH.'],
      body: () => `
<h3>1. Mô hình thị trường và CAPM</h3>
<p>Để biết một chiến lược có "vượt trội" hay không, cần một chuẩn cho lợi nhuận <b>bình thường</b> ứng với rủi ro gánh chịu.</p>
<ul><li><b>Mô hình thị trường</b>: R<sub>i</sub> = α + β × R<sub>m</sub> + ε. Lợi nhuận cổ phiếu được giải thích bằng lợi nhuận thị trường.</li>
<li><b>Beta (β)</b>: độ nhạy với thị trường. β = 1 biến động như thị trường; β = 1.5 biến động mạnh hơn 50%; β &lt; 1 phòng thủ hơn.</li>
<li><b>Alpha (α)</b>: phần lợi nhuận <b>không giải thích được</b> bởi rủi ro thị trường, tức thước đo kỹ năng. EMH dự báo α bằng 0 (sau chi phí).</li>
<li><b>CAPM</b>: lợi nhuận kỳ vọng = lãi suất phi rủi ro + β × (lợi nhuận thị trường − lãi suất phi rủi ro).</li></ul>
<div class="callout"><b>Ví dụ</b>: lãi suất phi rủi ro 3%, thị trường 10%, β = 1.2. CAPM: 3% + 1.2 × 7% = 11.4%. Nếu danh mục đạt 14% thì alpha ≈ +2.6%.</div>
<h3>2. Các "bất thường" (anomalies)</h3>
<table class="tbl"><thead><tr><th>Bất thường</th><th>Mô tả</th><th>Liên quan PTKT</th></tr></thead><tbody>
<tr><td><b>Động lượng (momentum)</b></td><td>Mã tăng mạnh nhất 3–12 tháng qua tiếp tục vượt trội trong 3–12 tháng tới</td><td>Nền tảng của theo xu hướng và sức mạnh tương đối</td></tr>
<tr><td><b>Đảo chiều dài hạn</b></td><td>Mã thua lỗ nặng 3–5 năm có xu hướng hồi phục</td><td>Phản ứng thái quá rồi quay về</td></tr>
<tr><td><b>Quy mô (size)</b>, <b>giá trị (value)</b></td><td>Lịch sử cho thấy cổ phiếu nhỏ và P/B thấp có lợi nhuận cao hơn (không ổn định qua thời gian)</td><td>Có thể là bù rủi ro</td></tr>
<tr><td><b>Lịch</b></td><td>Hiệu ứng tháng Giêng, cuối tuần, quanh ngày lễ</td><td>Phần lớn đã yếu đi sau khi được công bố</td></tr>
<tr><td><b>Phản ứng chậm sau tin</b></td><td>Giá tiếp tục trôi theo hướng của tin lợi nhuận bất ngờ</td><td>Xu hướng sau "gap tin tức"</td></tr></tbody></table>
<p>Phe EMH giải thích các bất thường là bù đắp cho rủi ro chưa đo lường được, là kết quả của đào bới dữ liệu, hoặc biến mất sau khi công bố. Phe hành vi giải thích chúng bằng tâm lý (Bài 29–31).</p>
<h3>3. Bong bóng và biến động vượt mức</h3>
<ul><li>Robert Shiller chỉ ra rằng giá cổ phiếu biến động <b>mạnh hơn nhiều</b> so với mức có thể giải thích bằng thay đổi cổ tức tương lai (excess volatility).</li>
<li>Bong bóng lịch sử (hoa tulip thế kỷ 17, South Sea, dot-com 2000, nhà đất 2007) và các vụ sụp đổ không có tin tức tương xứng (ví dụ ngày 19/10/1987) rất khó giải thích bằng EMH thuần tuý.</li></ul>
<h3>4. Kết luận cân bằng</h3>
<p>Thị trường <b>khá hiệu quả</b>: rất khó vượt trội ổn định, và đa số quỹ chủ động thua chỉ số sau phí. Nhưng thị trường <b>không hoàn toàn hiệu quả</b>: có những quy luật (đặc biệt động lượng) tồn tại dai dẳng. Lợi thế của nhà PTKT nằm ở kỷ luật khai thác những quy luật này, với quản trị rủi ro.</p>`,
      keys: ['Mô hình thị trường: R = α + βR_m; β = độ nhạy thị trường, α = phần vượt trội (kỹ năng).', 'CAPM: E(R) = Rf + β(Rm − Rf).', 'Bất thường: động lượng (quan trọng nhất với PTKT), đảo chiều dài hạn, size/value, lịch, trôi sau tin.', 'Shiller: biến động vượt mức; bong bóng và sụp đổ khó giải thích bằng EMH.', 'Thị trường khá hiệu quả nhưng không hoàn toàn; động lượng là quy luật bền bỉ.'],
      terms: [['Alpha / Beta', 'Lợi nhuận vượt trội / Độ nhạy thị trường'], ['CAPM', 'Mô hình định giá tài sản vốn'], ['Anomaly', 'Bất thường'], ['Momentum effect', 'Hiệu ứng động lượng'], ['Excess volatility', 'Biến động vượt mức'], ['Bubble', 'Bong bóng']],
      quiz: [
        Q('Beta = 1.5 nghĩa là:', ['Ít biến động hơn thị trường 50%', 'Biến động mạnh hơn thị trường khoảng 50%', 'Lợi nhuận vượt trội 1.5%', 'Không liên quan thị trường'], 1, 'Độ nhạy với thị trường.'),
        Q('Rf = 2%, Rm = 10%, β = 1. Lợi nhuận kỳ vọng theo CAPM:', ['2%', '8%', '10%', '12%'], 2, '2% + 1 × 8% = 10%.'),
        Q('Rf = 3%, Rm = 10%, β = 1.2, danh mục đạt 14%. Alpha khoảng:', ['+1.4%', '+2.6%', '+4%', '0%'], 1, 'CAPM = 11.4%; 14 − 11.4 = 2.6.'),
        Q('Bất thường nào là nền tảng của chiến lược theo xu hướng và sức mạnh tương đối?', ['Hiệu ứng tháng Giêng', 'Động lượng', 'Size', 'Value'], 1, 'Mã mạnh tiếp tục mạnh trong trung hạn.'),
        Q('Phe EMH thường giải thích bất thường bằng:', ['Tâm lý đám đông', 'Bù rủi ro chưa đo được, đào bới dữ liệu', 'Thao túng', 'Không giải thích'], 1, 'Theo họ, đó không phải lợi nhuận "miễn phí".'),
        Q('Shiller chỉ ra điều gì?', ['Giá biến động ít hơn mức hợp lý', 'Giá biến động mạnh hơn nhiều so với thay đổi cổ tức', 'Beta luôn bằng 1', 'Không có bong bóng'], 1, 'Biến động vượt mức.'),
        Q('Alpha đo:', ['Rủi ro thị trường', 'Lợi nhuận không giải thích được bởi rủi ro thị trường', 'Khối lượng', 'Phí'], 1, 'Thước đo kỹ năng.'),
        Q('Kết luận cân bằng về hiệu quả thị trường:', ['Hoàn toàn hiệu quả', 'Hoàn toàn kém hiệu quả', 'Khá hiệu quả nhưng tồn tại quy luật bền bỉ như động lượng', 'Không thể biết'], 2, 'Khó vượt trội nhưng có lợi thế có thể khai thác.')
      ]
    },
    en: {
      goals: ['Understand the market model and CAPM.', 'Measure risk-adjusted excess return.', 'Know anomalies.', 'See bubbles and excess volatility as evidence against EMH.'],
      body: () => `
<h3>1. Market model and CAPM</h3><ul><li>R<sub>i</sub> = α + β R<sub>m</sub> + ε.</li><li>Beta = market sensitivity; alpha = unexplained return (skill).</li><li>CAPM: E(R) = Rf + β(Rm − Rf).</li></ul><div class="callout">Rf 3%, market 10%, β 1.2 → 11.4%; a 14% return gives alpha ≈ +2.6%.</div>
<h3>2. Anomalies</h3><table class="tbl"><tbody><tr><td>Momentum</td><td>3–12-month winners keep winning — basis of trend following and RS</td></tr><tr><td>Long-term reversal</td><td>3–5-year losers recover</td></tr><tr><td>Size, value</td><td>Historically higher returns, unstable</td></tr><tr><td>Calendar</td><td>Mostly faded after publication</td></tr><tr><td>Post-earnings drift</td><td>Prices keep drifting after surprises</td></tr></tbody></table><p>EMH: risk premia, data mining, disappearance. Behavioural: psychology.</p>
<h3>3. Bubbles</h3><p>Shiller’s excess volatility; tulips, South Sea, dot-com, housing, 1987 crash.</p>
<h3>4. Balance</h3><p>Markets are fairly but not perfectly efficient; momentum persists, and disciplined risk-managed exploitation is the technician’s edge.</p>`,
      keys: ['R = α + βRm.', 'CAPM.', 'Momentum is the key anomaly.', 'Excess volatility and bubbles.', 'Fairly, not perfectly, efficient.'],
      terms: [['Alpha', 'Excess return'], ['Beta', 'Market sensitivity'], ['Momentum', 'Winners keep winning']],
      quiz: [
        Q('Beta 1.5 means:', ['50% less volatile', 'About 50% more market-sensitive', '1.5% excess', 'Unrelated'], 1, ''),
        Q('Rf 2%, Rm 10%, β 1 → CAPM:', ['2%', '8%', '10%', '12%'], 2, ''),
        Q('Rf 3%, Rm 10%, β 1.2, actual 14% → alpha:', ['+1.4%', '+2.6%', '+4%', '0%'], 1, ''),
        Q('Basis of trend following and RS:', ['January effect', 'Momentum', 'Size', 'Value'], 1, ''),
        Q('EMH explains anomalies by:', ['Crowd psychology', 'Unmeasured risk, data mining', 'Manipulation', 'Nothing'], 1, ''),
        Q('Shiller showed:', ['Too little volatility', 'Far more volatility than dividends justify', 'Beta = 1', 'No bubbles'], 1, ''),
        Q('Alpha measures:', ['Market risk', 'Return unexplained by market risk', 'Volume', 'Fees'], 1, ''),
        Q('Balanced view:', ['Fully efficient', 'Fully inefficient', 'Fairly efficient with persistent regularities', 'Unknowable'], 2, '')
      ]
    }
  };

  /* ================= 29 ================= */
  C.lessons['l1-29'] = {
    vi: {
      goals: ['Nêu nguồn gốc của tài chính hành vi.', 'So sánh lý thuyết hữu dụng kỳ vọng và lý thuyết triển vọng.', 'Hiểu ghét thua lỗ và hiệu ứng khung (framing).', 'Nhận diện các thiên kiến nhận thức và thiên kiến quán tính.'],
      body: () => `
<h3>1. Từ "con người kinh tế" đến con người thật</h3>
<p>Lý thuyết tài chính cổ điển giả định nhà đầu tư <b>lý trí</b>: tối đa hoá <b>hữu dụng kỳ vọng</b>, cập nhật niềm tin đúng theo xác suất. Từ thập niên 1970, các nhà tâm lý học Daniel Kahneman và Amos Tversky chứng minh bằng thực nghiệm rằng con người lệch khỏi lý trí theo những cách <b>có hệ thống và dự đoán được</b>. Đó là nền móng của <b>tài chính hành vi</b>. Kahneman nhận giải Nobel Kinh tế năm 2002; Richard Thaler và Robert Shiller cũng là những nhân vật then chốt.</p>
<h3>2. Lý thuyết triển vọng (Prospect Theory)</h3>
<ul><li>Con người đánh giá kết quả theo <b>lãi/lỗ so với một điểm tham chiếu</b>, không theo tổng tài sản.</li>
<li><b>Ghét thua lỗ (loss aversion)</b>: nỗi đau mất 1 đồng lớn hơn khoảng 2 lần niềm vui được 1 đồng.</li>
<li>Ở vùng lãi, con người <b>né rủi ro</b> (thích chắc ăn). Ở vùng lỗ, con người <b>thích rủi ro</b> (đánh cược để gỡ).</li>
<li><b>Trọng số xác suất</b>: đánh giá quá cao xác suất nhỏ (xổ số, bảo hiểm) và quá thấp xác suất trung bình đến cao.</li></ul>
${fg.prospect('vi')}
<p>Hệ quả trên thị trường: <b>hiệu ứng phân bổ (disposition effect)</b>. Nhà đầu tư bán cổ phiếu đang lãi quá sớm và ôm cổ phiếu đang lỗ quá lâu, đúng ngược với nguyên tắc "cắt lỗ, để lãi chạy".</p>
<div class="callout">Giới hạn lớn nhất của lý thuyết triển vọng: <b>điểm tham chiếu</b> không được xác định rõ. Đó là giá mua, đỉnh gần nhất, hay kỳ vọng? Thay đổi điểm tham chiếu sẽ thay đổi dự báo.</div>
<h3>3. Hiệu ứng khung (framing)</h3>
<p>Cùng một lựa chọn nhưng trình bày khác nhau ("cứu được 200 người" và "400 người sẽ chết") dẫn tới quyết định khác nhau. Trên thị trường, cách tin tức được "đóng khung" ảnh hưởng mạnh tới phản ứng.</p>
<h3>4. Thiên kiến nhận thức</h3>
<table class="tbl"><thead><tr><th>Thiên kiến</th><th>Biểu hiện trên thị trường</th></tr></thead><tbody>
<tr><td><b>Đại diện (representativeness)</b></td><td>Thấy vài quý tăng trưởng tốt liền suy ra công ty "tuyệt vời mãi mãi"; ngoại suy xu hướng ngắn</td></tr>
<tr><td><b>Sẵn có (availability)</b></td><td>Đánh giá xác suất theo những gì dễ nhớ, mới xảy ra, được truyền thông nhắc nhiều</td></tr>
<tr><td><b>Neo (anchoring)</b></td><td>Bám vào một con số (giá mua, đỉnh cũ) và điều chỉnh không đủ khi có thông tin mới</td></tr>
<tr><td><b>Tự tin thái quá (overconfidence)</b></td><td>Giao dịch quá nhiều, đánh giá thấp rủi ro, gán thành công cho tài năng</td></tr>
<tr><td><b>Xác nhận (confirmation)</b></td><td>Chỉ tìm thông tin ủng hộ quan điểm sẵn có</td></tr></tbody></table>
<h3>5. Thiên kiến quán tính</h3>
<ul><li><b>Bảo thủ (conservatism)</b>: cập nhật niềm tin quá chậm khi có bằng chứng mới, dẫn tới phản ứng chậm và tạo xu hướng.</li>
<li><b>Hiện trạng (status quo)</b>: thích giữ nguyên, ngại thay đổi danh mục.</li>
<li><b>Sở hữu (endowment)</b>: đánh giá cao thứ mình đang nắm giữ hơn khi chưa có nó.</li></ul>
<div class="callout">Thiên kiến chính là "nhiên liệu" của xu hướng và mẫu hình. Hiểu chúng giúp nhà PTKT vừa đọc được thị trường, vừa <b>kiểm soát chính mình</b>: kế hoạch giao dịch viết sẵn, điểm dừng đặt trước, nhật ký giao dịch.</div>`,
      keys: ['Tài chính hành vi: con người lệch khỏi lý trí theo cách có hệ thống (Kahneman, Tversky, Thaler, Shiller).', 'Lý thuyết triển vọng: đánh giá lãi/lỗ so với điểm tham chiếu; ghét thua lỗ (~2 lần); né rủi ro khi lãi, thích rủi ro khi lỗ.', 'Hiệu ứng phân bổ: bán lãi sớm, ôm lỗ lâu.', 'Giới hạn lớn nhất của lý thuyết triển vọng: điểm tham chiếu không rõ ràng.', 'Thiên kiến nhận thức: đại diện, sẵn có, neo, tự tin thái quá, xác nhận.', 'Thiên kiến quán tính: bảo thủ, hiện trạng, sở hữu.'],
      terms: [['Prospect theory', 'Lý thuyết triển vọng'], ['Loss aversion', 'Ghét thua lỗ'], ['Disposition effect', 'Hiệu ứng phân bổ'], ['Framing', 'Hiệu ứng khung'], ['Representativeness / Availability / Anchoring', 'Đại diện / Sẵn có / Neo'], ['Conservatism', 'Bảo thủ'], ['Endowment effect', 'Hiệu ứng sở hữu']],
      quiz: [
        Q('Ghét thua lỗ nghĩa là:', ['Thích lỗ', 'Nỗi đau mất mát lớn hơn khoảng 2 lần niềm vui có lãi tương đương', 'Không quan tâm lãi lỗ', 'Chỉ quan tâm lãi'], 1, 'Hệ số thường được ước lượng khoảng 2–2.5.'),
        Q('Theo lý thuyết triển vọng, ở vùng LỖ con người thường:', ['Né rủi ro', 'Thích rủi ro (đánh cược để gỡ)', 'Trung lập', 'Bán ngay'], 1, 'Hàm giá trị lồi ở vùng lỗ.'),
        Q('Hiệu ứng phân bổ là:', ['Bán lãi sớm, ôm lỗ lâu', 'Cắt lỗ nhanh, để lãi chạy', 'Đa dạng hoá', 'Mua ETF'], 0, 'Ngược với nguyên tắc quản trị lệnh.'),
        Q('Giới hạn lớn nhất của lý thuyết triển vọng là:', ['Không có thực nghiệm', 'Điểm tham chiếu không được xác định rõ', 'Không giải thích được ghét lỗ', 'Chỉ dùng cho trái phiếu'], 1, 'Đổi điểm tham chiếu thì dự báo thay đổi.'),
        Q('Nhà đầu tư không bán vì "phải về lại giá mua đã". Đây là thiên kiến:', ['Sẵn có', 'Neo', 'Đại diện', 'Tự tin thái quá'], 1, 'Neo vào giá mua.'),
        Q('Ngoại suy vài quý tăng trưởng thành "mãi mãi tốt" là thiên kiến:', ['Đại diện', 'Hiện trạng', 'Sở hữu', 'Khung'], 0, 'Đánh giá dựa trên sự giống nhau bề ngoài.'),
        Q('Thiên kiến bảo thủ giải thích hiện tượng nào?', ['Bong bóng tức thời', 'Phản ứng chậm với thông tin mới, tạo xu hướng', 'Biến động bằng 0', 'Giá cố định'], 1, 'Niềm tin cập nhật quá chậm.'),
        Q('Công cụ tốt nhất để nhà PTKT chống thiên kiến của chính mình là:', ['Giao dịch theo cảm xúc', 'Kế hoạch viết sẵn, điểm dừng đặt trước, nhật ký giao dịch', 'Theo tin đồn', 'Không cắt lỗ'], 1, 'Kỷ luật hoá quyết định.')
      ]
    },
    en: {
      goals: ['Trace behavioural finance.', 'Compare expected utility and prospect theory.', 'Understand loss aversion and framing.', 'Identify perception and inertial biases.'],
      body: () => `
<h3>1. From homo economicus to real people</h3><p>Kahneman and Tversky showed systematic, predictable deviations from rationality; Kahneman’s 2002 Nobel, with Thaler and Shiller, anchored behavioural finance.</p>
<h3>2. Prospect theory</h3><ul><li>Gains and losses relative to a reference point.</li><li>Loss aversion (~2×).</li><li>Risk-averse in gains, risk-seeking in losses.</li><li>Probability weighting.</li></ul>${fg.prospect('en')}<p>Result: the <b>disposition effect</b>.</p><div class="callout">Its greatest limitation: the reference point is not well defined.</div>
<h3>3. Framing</h3><p>The same choice framed differently yields different decisions.</p>
<h3>4. Perception biases</h3><ul><li>Representativeness</li><li>Availability</li><li>Anchoring</li><li>Overconfidence</li><li>Confirmation</li></ul>
<h3>5. Inertial effects</h3><ul><li>Conservatism — slow updating creates trends.</li><li>Status quo.</li><li>Endowment.</li></ul><div class="callout">Biases fuel trends — and plans, preset stops and journals control your own.</div>`,
      keys: ['Systematic deviations from rationality.', 'Prospect theory, loss aversion ~2×.', 'Disposition effect.', 'Reference-point ambiguity is the main limitation.', 'Perception biases.', 'Inertial biases.'],
      terms: [['Loss aversion', 'Losses loom larger'], ['Disposition effect', 'Sell winners, hold losers'], ['Anchoring', 'Sticking to a number']],
      quiz: [
        Q('Loss aversion:', ['Liking losses', 'Losses hurt ~2× equal gains', 'Indifference', 'Gains only'], 1, ''),
        Q('In losses people tend to be:', ['Risk-averse', 'Risk-seeking', 'Neutral', 'Sellers'], 1, ''),
        Q('Disposition effect:', ['Sell winners early, hold losers', 'Cut losses fast', 'Diversify', 'Buy ETFs'], 0, ''),
        Q('Prospect theory’s main limitation:', ['No experiments', 'Undefined reference point', 'No loss aversion', 'Bonds only'], 1, ''),
        Q('"I’ll sell once it’s back to my cost":', ['Availability', 'Anchoring', 'Representativeness', 'Overconfidence'], 1, ''),
        Q('Extrapolating a few good quarters forever:', ['Representativeness', 'Status quo', 'Endowment', 'Framing'], 0, ''),
        Q('Conservatism explains:', ['Instant bubbles', 'Slow reaction that creates trends', 'Zero volatility', 'Fixed prices'], 1, ''),
        Q('Best defence against your own biases:', ['Emotional trading', 'Written plans, preset stops, journals', 'Rumours', 'No stops'], 1, '')
      ]
    }
  };

  /* ================= 30 ================= */
  C.lessons['l1-30'] = {
    vi: {
      goals: ['Hiểu luật một giá và vai trò của kinh doanh chênh lệch.', 'Định nghĩa nhà giao dịch nhiễu (noise trader).', 'Giải thích giới hạn của kinh doanh chênh lệch.', 'Phân tích các ví dụ thực tế sai lệch giá kéo dài.'],
      body: () => `
<h3>1. Luật một giá</h3>
<p>Hai tài sản giống hệt nhau phải có cùng giá. Nếu không, nhà kinh doanh chênh lệch sẽ mua cái rẻ, bán cái đắt cho tới khi giá hội tụ. Đây là cơ chế "tự sửa sai" mà EMH dựa vào: dù một số người phi lý trí, người lý trí sẽ <b>kinh doanh chênh lệch</b> để kéo giá về giá trị.</p>
<h3>2. Nhà giao dịch nhiễu</h3>
<p>Fischer Black gọi những người giao dịch dựa trên thông tin không liên quan đến giá trị (tin đồn, cảm xúc, "nhiễu") là <b>noise traders</b>. Nếu nhiễu của họ ngẫu nhiên và triệt tiêu nhau thì vô hại. Vấn đề: cảm xúc của đám đông thường <b>tương quan</b> (cùng lạc quan, cùng sợ hãi), nên chúng không triệt tiêu mà đẩy giá lệch theo một hướng.</p>
<h3>3. Giới hạn của kinh doanh chênh lệch</h3>
<table class="tbl"><thead><tr><th>Giới hạn</th><th>Nội dung</th></tr></thead><tbody>
<tr><td><b>Rủi ro cơ bản</b></td><td>Không có tài sản thay thế hoàn hảo để phòng ngừa; tin tức mới có thể làm thay đổi giá trị</td></tr>
<tr><td><b>Rủi ro từ nhà giao dịch nhiễu</b></td><td>Sai lệch có thể <b>lớn thêm</b> trước khi thu hẹp. "Thị trường có thể phi lý lâu hơn khả năng bạn trụ được" (ý của Keynes)</td></tr>
<tr><td><b>Chi phí thực hiện</b></td><td>Phí, chi phí vay để bán khống, hạn chế bán khống, ký quỹ, thanh khoản</td></tr>
<tr><td><b>Ràng buộc vốn</b></td><td>Quỹ bị nhà đầu tư rút vốn đúng lúc sai lệch lớn nhất, buộc phải đóng vị thế lỗ</td></tr></tbody></table>
<h3>4. Ví dụ kinh điển</h3>
<ul><li><b>Cổ phiếu "song sinh"</b>: hai cổ phiếu của cùng một tập đoàn (niêm yết ở hai nước, với tỷ lệ chia lợi nhuận cố định) giao dịch lệch nhau nhiều phần trăm suốt nhiều năm.</li>
<li><b>Tách công ty con</b>: công ty mẹ còn nắm phần lớn công ty con vừa niêm yết, nhưng giá trị thị trường của công ty mẹ lại thấp hơn phần giá trị công ty con nó nắm giữ, hàm ý phần còn lại "âm".</li>
<li><b>Quỹ đóng</b>: giao dịch chiết khấu hoặc thặng dư dai dẳng so với NAV.</li>
<li><b>Thay đổi rổ chỉ số</b>: cổ phiếu tăng giá chỉ vì được thêm vào chỉ số, dù giá trị cơ bản không đổi.</li></ul>
<div class="callout">Ý nghĩa cho nhà PTKT: sai lệch giá có thể <b>kéo dài và lớn dần</b> vì tâm lý đám đông. Đó chính là xu hướng. Đừng đứng chắn trước xu hướng chỉ vì "giá đã quá đắt/quá rẻ".</div>`,
      keys: ['Luật một giá: tài sản giống nhau phải cùng giá; kinh doanh chênh lệch là cơ chế tự sửa sai.', 'Noise traders giao dịch theo nhiễu; vì cảm xúc tương quan nên không triệt tiêu.', 'Giới hạn chênh lệch: rủi ro cơ bản, rủi ro nhà giao dịch nhiễu, chi phí thực hiện, ràng buộc vốn.', 'Ví dụ: cổ phiếu song sinh, tách công ty con, quỹ đóng, hiệu ứng thêm vào chỉ số.', 'Sai lệch có thể kéo dài — đừng chống lại xu hướng chỉ vì định giá.'],
      terms: [['Law of one price', 'Luật một giá'], ['Arbitrage', 'Kinh doanh chênh lệch'], ['Noise trader', 'Nhà giao dịch nhiễu'], ['Limits to arbitrage', 'Giới hạn kinh doanh chênh lệch'], ['Twin shares', 'Cổ phiếu song sinh'], ['Closed-end fund discount', 'Chiết khấu quỹ đóng']],
      quiz: [
        Q('Luật một giá phát biểu:', ['Mọi cổ phiếu cùng giá', 'Hai tài sản giống hệt nhau phải có cùng giá', 'Giá luôn tăng', 'Không có chênh lệch'], 1, 'Nếu không, sẽ có kinh doanh chênh lệch.'),
        Q('Vì sao nhiễu của noise traders không tự triệt tiêu?', ['Họ giao dịch ít', 'Cảm xúc đám đông tương quan, cùng một hướng', 'Do luật', 'Họ luôn lý trí'], 1, 'Cùng lạc quan hoặc cùng sợ hãi.'),
        Q('Rủi ro từ nhà giao dịch nhiễu là:', ['Sai lệch có thể lớn thêm trước khi thu hẹp', 'Không có rủi ro', 'Phí giao dịch', 'Thuế'], 0, 'Người kinh doanh chênh lệch có thể bị lỗ nặng trước khi đúng.'),
        Q('Ví dụ cổ phiếu song sinh cho thấy:', ['Luật một giá luôn đúng', 'Sai lệch giá có thể tồn tại nhiều năm', 'Không có chênh lệch', 'Thị trường cố định'], 1, 'Bằng chứng giới hạn kinh doanh chênh lệch.'),
        Q('Cổ phiếu tăng vì được đưa vào chỉ số dù cơ bản không đổi thể hiện:', ['Hiệu quả thị trường', 'Cầu không liên quan giá trị ảnh hưởng tới giá', 'Thao túng', 'Lỗi dữ liệu'], 1, 'Cầu từ quỹ chỉ số.'),
        Q('Ràng buộc vốn nghĩa là:', ['Quỹ có vốn vô hạn', 'Nhà đầu tư rút vốn đúng lúc sai lệch lớn nhất', 'Không có ký quỹ', 'Vốn luôn tăng'], 1, 'Buộc đóng vị thế lỗ.'),
        Q('Bài học cho nhà PTKT là:', ['Luôn đi ngược xu hướng khi giá "đắt"', 'Sai lệch có thể kéo dài — tôn trọng xu hướng', 'Bỏ qua tâm lý', 'Chỉ dùng định giá'], 1, 'Xu hướng có thể đi xa hơn dự kiến.'),
        Q('Ai đặt ra thuật ngữ "noise" cho kiểu giao dịch này?', ['Fischer Black', 'Charles Dow', 'Elliott', 'Homma'], 0, 'Trong bài viết nổi tiếng "Noise".')
      ]
    },
    en: {
      goals: ['Understand the law of one price and arbitrage.', 'Define noise traders.', 'Explain limits to arbitrage.', 'Analyse real mispricings.'],
      body: () => `
<h3>1. Law of one price</h3><p>Identical assets should trade at one price; arbitrage enforces it — the EMH’s self-correcting mechanism.</p>
<h3>2. Noise traders</h3><p>Fischer Black’s term for trading on non-value information. Because crowd emotions are <b>correlated</b>, noise does not cancel.</p>
<h3>3. Limits to arbitrage</h3><ul><li>Fundamental risk</li><li>Noise-trader risk — mispricing can widen first</li><li>Implementation costs</li><li>Capital constraints</li></ul>
<h3>4. Examples</h3><ul><li>Twin shares</li><li>Carve-outs with "negative stub" values</li><li>Closed-end fund discounts</li><li>Index-inclusion effects</li></ul><div class="callout">Mispricing can persist and grow — that is a trend; don’t fight it on valuation alone.</div>`,
      keys: ['Law of one price and arbitrage.', 'Correlated noise does not cancel.', 'Four limits to arbitrage.', 'Real persistent mispricings.', 'Respect trends.'],
      terms: [['Noise trader', 'Trader on non-value information'], ['Limits to arbitrage', 'Why mispricing persists']],
      quiz: [
        Q('Law of one price:', ['All stocks same price', 'Identical assets, same price', 'Prices rise', 'No spreads'], 1, ''),
        Q('Noise does not cancel because:', ['Little trading', 'Emotions are correlated', 'Law', 'Rationality'], 1, ''),
        Q('Noise-trader risk:', ['Mispricing can widen first', 'No risk', 'Fees', 'Taxes'], 0, ''),
        Q('Twin shares show:', ['The law always holds', 'Mispricing can last years', 'No spreads', 'Fixed markets'], 1, ''),
        Q('Index-inclusion rallies show:', ['Efficiency', 'Non-value demand moves prices', 'Manipulation', 'Data error'], 1, ''),
        Q('Capital constraints:', ['Unlimited capital', 'Withdrawals when mispricing peaks', 'No margin', 'Rising capital'], 1, ''),
        Q('Lesson for technicians:', ['Fight "expensive" trends', 'Mispricing persists — respect trends', 'Ignore psychology', 'Valuation only'], 1, ''),
        Q('Who coined "noise"?', ['Fischer Black', 'Dow', 'Elliott', 'Homma'], 0, '')
      ]
    }
  };

  /* ================= 31 ================= */
  C.lessons['l1-31'] = {
    vi: {
      goals: ['Giải thích vì sao hành vi đám đông tạo ra xu hướng.', 'Hiểu phản ứng chậm, phản ứng thái quá và vòng lặp phản hồi.', 'Hiểu bầy đàn và giao dịch phản hồi dương.', 'Liên hệ tài chính hành vi với các công cụ PTKT.'],
      body: () => `
<h3>1. PTKT là "tài chính hành vi ứng dụng"</h3>
<p>Nếu giá chỉ phản ánh giá trị, sẽ không có xu hướng hay mẫu hình. Tài chính hành vi giải thích vì sao <b>giá có tính lặp lại</b>. Đó là cơ sở lý luận để PTKT hoạt động.</p>
<h3>2. Vòng đời của một xu hướng theo góc nhìn hành vi</h3>
${fg.feedback('vi')}
<ol><li><b>Phản ứng chậm (underreaction)</b>: thiên kiến bảo thủ và neo khiến thị trường cập nhật thông tin tốt từ từ, nên giá tăng dần thành <b>xu hướng</b> (giai đoạn tích lũy rồi markup).</li>
<li><b>Vòng lặp phản hồi dương</b>: giá tăng thu hút sự chú ý, người theo xu hướng mua thêm, giá tăng tiếp, câu chuyện lạc quan lan rộng. Đây là đặc trưng của <b>bong bóng</b>.</li>
<li><b>Phản ứng thái quá (overreaction)</b>: thiên kiến đại diện khiến đám đông ngoại suy quá xa. Giá vượt giá trị (giai đoạn hưng phấn, phân phối).</li>
<li><b>Đảo chiều</b>: khi không còn người mua mới, vòng lặp đảo chiều thành phản hồi âm và giá quay về, thường quá đà theo chiều ngược lại.</li></ol>
<h3>3. Bầy đàn và giao dịch phản hồi dương</h3>
<ul><li><b>Bầy đàn (herding)</b>: làm theo số đông vì cho rằng người khác biết điều mình không biết, hoặc vì "sai cùng mọi người" ít đau hơn sai một mình (quản lý quỹ sợ khác chỉ số).</li>
<li><b>Giao dịch phản hồi dương</b>: mua khi giá tăng, bán khi giá giảm (theo xu hướng, cắt lỗ, gọi ký quỹ). Nó khuếch đại biến động. Nhà kinh doanh chênh lệch hợp lý thậm chí có thể <b>mua trước</b> người theo phản hồi để bán lại cho họ, làm xu hướng mạnh thêm.</li>
<li><b>Thác thông tin (information cascade)</b>: mỗi người bỏ qua thông tin riêng để làm theo người trước, nên cả chuỗi có thể sai.</li></ul>
<h3>4. Ánh xạ sang công cụ PTKT</h3>
<table class="tbl"><thead><tr><th>Hiện tượng hành vi</th><th>Công cụ PTKT nắm bắt</th></tr></thead><tbody>
<tr><td>Phản ứng chậm → xu hướng</td><td>Đường xu hướng, MA, phá vỡ, động lượng, sức mạnh tương đối</td></tr>
<tr><td>Neo vào mức giá cũ</td><td>Hỗ trợ/kháng cự, đổi vai</td></tr>
<tr><td>Phản ứng thái quá, hưng phấn</td><td>Quá mua/quá bán, phân kỳ, cao trào khối lượng, chỉ báo tâm lý</td></tr>
<tr><td>Ghét lỗ, hiệu ứng phân bổ</td><td>Vùng "hoà vốn" thành kháng cự; cung xuất hiện khi giá hồi về giá mua cũ</td></tr>
<tr><td>Bầy đàn ở cực trị</td><td>Lý thuyết đi ngược đám đông, khảo sát tâm lý</td></tr></tbody></table>`,
      keys: ['Tài chính hành vi là cơ sở lý luận giải thích vì sao PTKT có thể hoạt động.', 'Vòng đời xu hướng: phản ứng chậm → phản hồi dương → phản ứng thái quá → đảo chiều.', 'Bầy đàn, giao dịch phản hồi dương, thác thông tin khuếch đại xu hướng.', 'Công cụ PTKT ánh xạ trực tiếp các hiện tượng hành vi: xu hướng, hỗ trợ/kháng cự, cực trị tâm lý.'],
      terms: [['Underreaction / Overreaction', 'Phản ứng chậm / thái quá'], ['Positive feedback', 'Phản hồi dương'], ['Herding', 'Bầy đàn'], ['Information cascade', 'Thác thông tin']],
      quiz: [
        Q('Phản ứng chậm với thông tin tốt thường tạo ra:', ['Đảo chiều ngay', 'Xu hướng tăng dần', 'Đi ngang mãi', 'Gap giảm'], 1, 'Giá cập nhật dần dần.'),
        Q('Giao dịch phản hồi dương là:', ['Mua khi giá giảm', 'Mua khi giá tăng, bán khi giá giảm', 'Không giao dịch', 'Chỉ bán khống'], 1, 'Khuếch đại xu hướng và biến động.'),
        Q('Bong bóng được đặc trưng bởi:', ['Phản hồi âm', 'Vòng lặp phản hồi dương', 'Khối lượng thấp', 'Không có tin tức'], 1, 'Giá tăng → chú ý → mua thêm.'),
        Q('Thác thông tin là khi:', ['Mỗi người dùng thông tin riêng', 'Mọi người bỏ qua thông tin riêng để làm theo người trước', 'Thông tin bị cấm', 'Không có giao dịch'], 1, 'Cả chuỗi có thể sai.'),
        Q('Công cụ PTKT nào nắm bắt hiện tượng neo vào mức giá cũ?', ['Hỗ trợ/kháng cự', 'Beta', 'Lãi suất', 'P/E'], 0, 'Thị trường "nhớ" các mức giá.'),
        Q('Phản ứng thái quá thường được phát hiện qua:', ['Quá mua/quá bán, phân kỳ, cao trào', 'Báo cáo tài chính', 'Cổ tức', 'Không phát hiện được'], 0, 'Dấu hiệu hưng phấn hoặc hoảng loạn.'),
        Q('Vì sao nhà quản lý quỹ có xu hướng bầy đàn?', ['Sai cùng mọi người ít bị phạt hơn sai một mình', 'Luật bắt buộc', 'Không có lý do', 'Để giảm phí'], 0, 'Rủi ro nghề nghiệp.'),
        Q('Vùng giá mua cũ của nhiều người đang lỗ thường trở thành kháng cự vì:', ['Hiệu ứng phân bổ và mong muốn hoà vốn', 'Lãi suất', 'Cổ tức', 'Thanh khoản'], 0, 'Họ bán khi giá hồi về hoà vốn.')
      ]
    },
    en: {
      goals: ['Explain how crowd behaviour creates trends.', 'Understand underreaction, overreaction, feedback.', 'Understand herding and positive feedback.', 'Map behaviour to TA tools.'],
      body: () => `
<h3>1. TA as applied behavioural finance</h3><p>Behavioural finance explains why prices repeat — TA’s theoretical basis.</p>
<h3>2. A trend’s life</h3>${fg.feedback('en')}<ol><li>Underreaction → trend.</li><li>Positive feedback → bubble dynamics.</li><li>Overreaction → overshoot.</li><li>Reversal → negative feedback.</li></ol>
<h3>3. Herding and feedback</h3><ul><li>Herding — safety in numbers, career risk.</li><li>Positive-feedback trading amplifies moves; rational speculators may front-run it.</li><li>Information cascades.</li></ul>
<h3>4. Mapping</h3><table class="tbl"><tbody><tr><td>Underreaction</td><td>Trendlines, MAs, breakouts, momentum, RS</td></tr><tr><td>Anchoring</td><td>Support/resistance</td></tr><tr><td>Overreaction</td><td>Overbought/oversold, divergence, climaxes, sentiment</td></tr><tr><td>Loss aversion</td><td>Break-even supply as resistance</td></tr><tr><td>Herding at extremes</td><td>Contrary opinion</td></tr></tbody></table>`,
      keys: ['Behavioural finance underpins TA.', 'Underreaction → feedback → overreaction → reversal.', 'Herding, positive feedback, cascades.', 'TA tools map behaviour.'],
      terms: [['Positive feedback', 'Buy rising, sell falling'], ['Information cascade', 'Ignoring private signals']],
      quiz: [
        Q('Underreaction creates:', ['Instant reversal', 'Gradual trends', 'Endless ranges', 'Gaps down'], 1, ''),
        Q('Positive-feedback trading:', ['Buy dips', 'Buy rising, sell falling', 'No trading', 'Shorts only'], 1, ''),
        Q('Bubbles feature:', ['Negative feedback', 'Positive feedback loops', 'Low volume', 'No news'], 1, ''),
        Q('An information cascade:', ['Using private info', 'Ignoring private info to follow others', 'Banned info', 'No trading'], 1, ''),
        Q('Anchoring maps to:', ['Support/resistance', 'Beta', 'Rates', 'P/E'], 0, ''),
        Q('Overreaction shows in:', ['Overbought/oversold, divergence, climaxes', 'Financials', 'Dividends', 'Nothing'], 0, ''),
        Q('Managers herd because:', ['Being wrong together is safer', 'Law', 'No reason', 'Lower fees'], 0, ''),
        Q('Old cost-basis zones become resistance due to:', ['Disposition effect / break-even selling', 'Rates', 'Dividends', 'Liquidity'], 0, '')
      ]
    }
  };

  /* ================= 32 ================= */
  C.lessons['l1-32'] = {
    vi: {
      goals: ['Hiểu thái độ của giới học thuật với PTKT qua các thời kỳ.', 'Nêu các nghiên cứu tiêu biểu ủng hộ và phản bác.', 'Hiểu Giả thuyết Thị trường Thích nghi (AMH).', 'Nhận diện các rủi ro phương pháp: đào bới dữ liệu, chi phí, ổn định theo thời gian.'],
      body: () => `
<h3>1. Từ hoài nghi đến công nhận một phần</h3>
<p>Trong nhiều thập kỷ, giới học thuật xem PTKT như "thuật chiêm tinh tài chính". Các nghiên cứu ban đầu (thập niên 1960) dùng quy tắc đơn giản và dữ liệu hạn chế, thường thấy không có lợi nhuận sau chi phí. Từ thập niên 1990, với dữ liệu và phương pháp tốt hơn, nhiều nghiên cứu tìm thấy <b>khả năng dự báo nhất định</b>.</p>
<h3>2. Nghiên cứu tiêu biểu (khái quát)</h3>
<ul><li><b>Quy tắc MA và phá vỡ biên</b> trên chỉ số Dow Jones dài hạn: tín hiệu mua có lợi nhuận và biến động khác biệt có ý nghĩa so với tín hiệu bán. Đây là bằng chứng rằng các quy tắc kỹ thuật đơn giản nắm bắt được điều gì đó (nghiên cứu nổi tiếng đầu thập niên 1990).</li>
<li><b>Nhận dạng mẫu hình bằng thuật toán</b>: dùng thống kê phi tham số làm mượt giá để nhận diện khách quan vai–đầu–vai, hai đỉnh…; nhiều mẫu hình mang lại thông tin gia tăng về phân phối lợi nhuận (đầu những năm 2000).</li>
<li><b>Động lượng</b>: chiến lược mua mã thắng, bán mã thua (3–12 tháng) có lợi nhuận vượt trội ở nhiều thị trường và thời kỳ. Đây là bằng chứng mạnh nhất cho tư duy theo xu hướng.</li>
<li><b>Theo xu hướng đa tài sản</b> (managed futures): lợi nhuận dài hạn và đặc biệt tốt trong các cuộc khủng hoảng.</li>
<li>Ngược lại: nhiều quy tắc mất hiệu quả sau khi được công bố, hoặc sau chi phí giao dịch thực tế.</li></ul>
<h3>3. Giả thuyết Thị trường Thích nghi (AMH)</h3>
<p>Andrew Lo đề xuất nhìn thị trường như một <b>hệ sinh thái tiến hoá</b>. Người tham gia (các "loài") thích nghi, cạnh tranh, sinh tồn. Hiệu quả thị trường <b>thay đổi theo thời gian và môi trường</b>:</p>
<ul><li>Cơ hội lợi nhuận xuất hiện, bị khai thác, biến mất, rồi có thể quay lại khi điều kiện đổi.</li>
<li>Không có chiến lược hiệu quả mãi mãi. Khả năng thích nghi là chìa khoá sống còn.</li>
<li>Dung hoà EMH và tài chính hành vi: hành vi "phi lý" là phản ứng tiến hoá trong môi trường thay đổi.</li></ul>
<h3>4. Rủi ro phương pháp khi đánh giá PTKT</h3>
<ul><li><b>Đào bới dữ liệu (data mining/snooping)</b>: thử đủ nhiều quy tắc thì chắc chắn sẽ có quy tắc "thắng" do may mắn.</li>
<li><b>Chi phí giao dịch và trượt giá</b> thực tế.</li>
<li><b>Rủi ro</b>: lợi nhuận cao hơn có phải chỉ vì gánh rủi ro cao hơn?</li>
<li><b>Ổn định theo thời gian</b>: kiểm tra trên nhiều giai đoạn, nhiều thị trường, dữ liệu ngoài mẫu (Phần VII).</li></ul>`,
      keys: ['Giới học thuật chuyển từ hoài nghi sang công nhận một phần khả năng dự báo của PTKT.', 'Bằng chứng: quy tắc MA/phá vỡ, nhận dạng mẫu hình thuật toán, động lượng, theo xu hướng đa tài sản.', 'Nhiều quy tắc suy yếu sau khi công bố hoặc sau chi phí.', 'AMH (Lo): hiệu quả thị trường thay đổi theo môi trường; chiến lược cần thích nghi.', 'Cẩn trọng: đào bới dữ liệu, chi phí, rủi ro, kiểm định ngoài mẫu.'],
      terms: [['Adaptive Markets Hypothesis', 'Giả thuyết Thị trường Thích nghi'], ['Data snooping', 'Đào bới dữ liệu'], ['Out-of-sample', 'Ngoài mẫu'], ['Managed futures', 'Quỹ theo xu hướng đa tài sản'], ['Nonparametric smoothing', 'Làm mượt phi tham số']],
      quiz: [
        Q('Bằng chứng học thuật mạnh nhất ủng hộ tư duy theo xu hướng là:', ['Hiệu ứng tháng Giêng', 'Hiệu ứng động lượng', 'Mẫu hình nến', 'Chu kỳ Kondratieff'], 1, 'Lặp lại ở nhiều thị trường, thời kỳ.'),
        Q('Theo AMH, hiệu quả thị trường:', ['Cố định mãi mãi', 'Thay đổi theo thời gian và môi trường', 'Không tồn tại', 'Chỉ đúng ở trái phiếu'], 1, 'Thị trường như một hệ sinh thái.'),
        Q('Ai đề xuất Giả thuyết Thị trường Thích nghi?', ['Eugene Fama', 'Andrew Lo', 'Charles Dow', 'Robert Prechter'], 1, ''),
        Q('Đào bới dữ liệu là rủi ro vì:', ['Thiếu dữ liệu', 'Thử nhiều quy tắc thì sẽ có quy tắc thắng do may mắn', 'Dữ liệu sai', 'Không có máy tính'], 1, 'Cần điều chỉnh cho số lần thử.'),
        Q('Theo AMH, một chiến lược có lợi nhuận:', ['Hiệu quả mãi mãi', 'Có thể suy yếu khi bị khai thác và quay lại khi môi trường đổi', 'Không bao giờ có', 'Chỉ dùng một lần'], 1, 'Cơ hội đến và đi.'),
        Q('Nhận dạng mẫu hình bằng thuật toán giúp:', ['Tăng tính chủ quan', 'Định nghĩa khách quan, kiểm định được', 'Bỏ qua dữ liệu', 'Không có tác dụng'], 1, 'Giảm sự diễn giải tuỳ ý.'),
        Q('Khi đánh giá một quy tắc, cần kiểm tra lợi nhuận sau:', ['Chi phí giao dịch và điều chỉnh rủi ro', 'Cổ tức', 'Lãi suất', 'Không cần'], 0, 'Lợi nhuận thô dễ đánh lừa.'),
        Q('AMH dung hoà hai trường phái nào?', ['Dow và Elliott', 'EMH và tài chính hành vi', 'Nến và P&F', 'Cơ bản và vĩ mô'], 1, '')
      ]
    },
    en: {
      goals: ['Trace academic attitudes to TA.', 'Know key studies.', 'Understand the AMH.', 'Recognise methodological risks.'],
      body: () => `
<h3>1. From scepticism to partial acceptance</h3><p>Early studies (1960s) found little after costs; better data and methods since the 1990s found some predictability.</p>
<h3>2. Studies (overview)</h3><ul><li>Moving-average and range-breakout rules on long Dow history showed meaningful buy/sell differences.</li><li>Algorithmic pattern recognition via nonparametric smoothing found incremental information.</li><li>Momentum — the strongest evidence.</li><li>Managed-futures trend following, strong in crises.</li><li>Many rules decay after publication or costs.</li></ul>
<h3>3. Adaptive Markets Hypothesis</h3><p>Andrew Lo: markets as an evolving ecology; efficiency varies with conditions; opportunities come and go; adaptation matters.</p>
<h3>4. Methodological risks</h3><ul><li>Data snooping</li><li>Costs and slippage</li><li>Risk adjustment</li><li>Stability and out-of-sample testing</li></ul>`,
      keys: ['Partial academic acceptance.', 'MA/breakout rules, pattern algorithms, momentum, trend following.', 'Decay after publication/costs.', 'AMH: changing efficiency.', 'Beware snooping, costs, risk.'],
      terms: [['AMH', 'Adaptive Markets Hypothesis'], ['Data snooping', 'Finding luck by testing many rules']],
      quiz: [
        Q('Strongest academic support for trend thinking:', ['January effect', 'Momentum', 'Candles', 'Kondratieff'], 1, ''),
        Q('Under AMH efficiency:', ['Is fixed', 'Varies with conditions', 'Does not exist', 'Bonds only'], 1, ''),
        Q('AMH was proposed by:', ['Fama', 'Lo', 'Dow', 'Prechter'], 1, ''),
        Q('Data snooping is risky because:', ['Too little data', 'Testing many rules yields lucky winners', 'Bad data', 'No computers'], 1, ''),
        Q('Under AMH a profitable strategy:', ['Works forever', 'May fade and return', 'Never exists', 'Works once'], 1, ''),
        Q('Algorithmic pattern recognition:', ['Adds subjectivity', 'Makes patterns objective and testable', 'Ignores data', 'Is useless'], 1, ''),
        Q('Evaluate rules after:', ['Costs and risk adjustment', 'Dividends', 'Rates', 'Nothing'], 0, ''),
        Q('AMH reconciles:', ['Dow and Elliott', 'EMH and behavioural finance', 'Candles and P&F', 'Fundamentals and macro'], 1, '')
      ]
    }
  };

  /* ================= 33 ================= */
  C.lessons['l1-33'] = {
    vi: {
      goals: ['Hiểu tâm lý thị trường và vì sao nó quan trọng.', 'Nắm lý thuyết đi ngược đám đông (contrary opinion) và điều kiện áp dụng.', 'Phân biệt chỉ báo tâm lý dùng theo hướng ngược và theo hướng thuận.', 'Biết đặt tâm lý trong bối cảnh khung thời gian và xu hướng.'],
      body: () => `
<h3>1. Tâm lý thị trường</h3>
<p>Tâm lý (sentiment) là trạng thái cảm xúc tổng hợp của người tham gia: lạc quan hay bi quan, tham lam hay sợ hãi. Giá phản ánh hành động. Tâm lý cho biết <b>còn bao nhiêu "nhiên liệu"</b> để hành động tiếp tục.</p>
<h3>2. Lý thuyết đi ngược đám đông</h3>
<p>Ý tưởng (được Humphrey Neill phổ biến): khi <b>hầu hết</b> mọi người đã đồng ý về một hướng, họ <b>đã hành động</b>. Người lạc quan đã mua, người bi quan đã bán. Vì vậy không còn ai để đẩy giá tiếp theo hướng đó, và rủi ro đảo chiều cao.</p>
<ul><li>Đám đông thường <b>đúng trong xu hướng</b> nhưng <b>sai ở các bước ngoặt</b>.</li>
<li>Tín hiệu ngược chỉ có giá trị ở <b>cực trị</b>, không phải khi tâm lý ở mức trung bình.</li>
<li>Cực trị có thể <b>kéo dài</b>: tâm lý hưng phấn có thể duy trì nhiều tháng trong bong bóng. Cần giá xác nhận đảo chiều.</li></ul>
<div class="callout">Câu nói quen thuộc của tinh thần đi ngược: "Hãy sợ hãi khi người khác tham lam, và tham lam khi người khác sợ hãi". Nhưng nhà PTKT bổ sung: <b>và chờ giá xác nhận</b>.</div>
<h3>3. Phân loại chỉ báo tâm lý</h3>
<table class="tbl"><thead><tr><th>Nhóm</th><th>Ví dụ</th><th>Cách dùng</th></tr></thead><tbody>
<tr><td>Từ dữ liệu thị trường</td><td>Put/Call, VIX, TRIN, short interest, margin debt, dòng tiền quỹ</td><td>Bài 34</td></tr>
<tr><td>Từ dữ liệu bên ngoài</td><td>Khảo sát nhà đầu tư, tin tức/truyền thông, giao dịch nội bộ, mạng xã hội</td><td>Bài 35</td></tr>
<tr><td>Nhóm "tiền thông minh"</td><td>Người nội bộ, commercials (COT)</td><td>Dùng <b>thuận</b> theo họ</td></tr>
<tr><td>Nhóm "đám đông"</td><td>Nhà đầu tư nhỏ lẻ, bản tin đại chúng</td><td>Dùng <b>ngược</b> ở cực trị</td></tr></tbody></table>
<h3>4. Bối cảnh</h3>
<ul><li>Trong <b>thị trường tăng mạnh</b>, tâm lý có thể giữ ở mức lạc quan rất lâu. Ngưỡng "cực trị" nên được điều chỉnh theo xu hướng chung.</li>
<li>Tâm lý thường hữu ích nhất ở <b>đáy</b>: sợ hãi tột độ thường đến nhanh và dứt khoát hơn hưng phấn ở đỉnh.</li>
<li>Khung thời gian: chỉ báo tâm lý hằng ngày cho tín hiệu ngắn hạn; khảo sát tuần/tháng cho bối cảnh trung hạn.</li></ul>
${C.demoHtml.sentProxy()}`,
      keys: ['Tâm lý = cảm xúc tổng hợp; cho biết còn bao nhiêu "nhiên liệu" cho xu hướng.', 'Đi ngược đám đông: khi hầu hết đã đồng ý, họ đã hành động → rủi ro đảo chiều.', 'Đám đông đúng trong xu hướng, sai ở bước ngoặt; tín hiệu ngược chỉ có giá trị ở cực trị và cần giá xác nhận.', '"Tiền thông minh" dùng thuận; "đám đông" dùng ngược.', 'Ngưỡng cực trị thay đổi theo xu hướng chung; tâm lý hữu ích nhất ở đáy.'],
      terms: [['Sentiment', 'Tâm lý thị trường'], ['Contrary opinion', 'Lý thuyết đi ngược đám đông'], ['Smart money', 'Tiền thông minh'], ['Extreme', 'Cực trị tâm lý']],
      quiz: [
        Q('Logic cốt lõi của đi ngược đám đông là:', ['Đám đông luôn sai', 'Khi hầu hết đã đồng ý thì họ đã hành động, không còn nhiên liệu', 'Luôn bán khi giá tăng', 'Không tin tâm lý'], 1, 'Người lạc quan đã mua hết.'),
        Q('Đám đông thường:', ['Sai trong xu hướng', 'Đúng trong xu hướng, sai ở bước ngoặt', 'Luôn đúng', 'Luôn sai'], 1, ''),
        Q('Tín hiệu đi ngược có giá trị khi tâm lý:', ['Ở mức trung bình', 'Ở cực trị', 'Không thay đổi', 'Bất kỳ lúc nào'], 1, 'Mức trung bình không mang thông tin ngược.'),
        Q('Nhóm nào thường được dùng THUẬN theo?', ['Nhà đầu tư nhỏ lẻ', 'Người nội bộ, commercials', 'Bản tin đại chúng', 'Mạng xã hội'], 1, 'Tiền thông minh.'),
        Q('Vì sao vẫn cần giá xác nhận khi tâm lý cực đoan?', ['Không cần', 'Cực trị có thể kéo dài nhiều tháng', 'Vì luật', 'Vì phí'], 1, 'Hưng phấn có thể duy trì trong bong bóng.'),
        Q('Tâm lý thường hữu ích nhất ở:', ['Đỉnh', 'Đáy — sợ hãi đến nhanh và dứt khoát', 'Giữa xu hướng', 'Không lúc nào'], 1, ''),
        Q('Trong thị trường tăng mạnh, ngưỡng "quá lạc quan" nên:', ['Giữ cố định', 'Điều chỉnh theo xu hướng chung', 'Bỏ qua', 'Đặt bằng 0'], 1, 'Lạc quan cao có thể là bình thường.'),
        Q('Ai phổ biến lý thuyết đi ngược đám đông?', ['Humphrey Neill', 'Ralph Elliott', 'Charles Dow', 'Fischer Black'], 0, '')
      ]
    },
    en: {
      goals: ['Understand sentiment.', 'Know contrary opinion and when it applies.', 'Distinguish contrarian and smart-money indicators.', 'Put sentiment in context.'],
      body: () => `
<h3>1. Sentiment</h3><p>The crowd’s aggregate emotion — how much "fuel" remains for the move.</p>
<h3>2. Contrary opinion</h3><p>Popularised by Humphrey Neill: when nearly everyone agrees, they have already acted. Crowds are right in trends, wrong at turns; signals matter only at extremes, which can persist — wait for price confirmation.</p>
<h3>3. Indicator groups</h3><table class="tbl"><tbody><tr><td>Market data</td><td>Put/call, VIX, TRIN, short interest, margin, flows</td></tr><tr><td>External data</td><td>Surveys, media, insiders, social media</td></tr><tr><td>Smart money</td><td>Follow</td></tr><tr><td>Crowd</td><td>Fade at extremes</td></tr></tbody></table>
<h3>4. Context</h3><ul><li>Adjust thresholds to the prevailing trend.</li><li>Most useful at bottoms.</li><li>Match timeframes.</li></ul>${C.demoHtml.sentProxy()}`,
      keys: ['Sentiment = remaining fuel.', 'Consensus has already acted.', 'Right in trends, wrong at turns; extremes + confirmation.', 'Follow smart money, fade the crowd.', 'Context-dependent thresholds; best at bottoms.'],
      terms: [['Contrary opinion', 'Fading consensus extremes'], ['Smart money', 'Informed participants']],
      quiz: [
        Q('Core contrarian logic:', ['Crowds are always wrong', 'Consensus has already acted', 'Sell all rallies', 'Ignore sentiment'], 1, ''),
        Q('Crowds are usually:', ['Wrong in trends', 'Right in trends, wrong at turns', 'Always right', 'Always wrong'], 1, ''),
        Q('Contrarian signals matter at:', ['Average levels', 'Extremes', 'No change', 'Any time'], 1, ''),
        Q('Followed, not faded:', ['Small investors', 'Insiders, commercials', 'Mass newsletters', 'Social media'], 1, ''),
        Q('Why wait for price confirmation?', ['No need', 'Extremes can last months', 'Law', 'Fees'], 1, ''),
        Q('Sentiment works best at:', ['Tops', 'Bottoms', 'Mid-trend', 'Never'], 1, ''),
        Q('In strong bull markets thresholds should:', ['Stay fixed', 'Adjust to the trend', 'Be ignored', 'Be zero'], 1, ''),
        Q('Contrary opinion was popularised by:', ['Humphrey Neill', 'Elliott', 'Dow', 'Black'], 0, '')
      ]
    }
  };

  /* ================= 34 ================= */
  C.lessons['l1-34'] = {
    vi: {
      goals: ['Diễn giải các chỉ báo tâm lý lấy từ dữ liệu thị trường.', 'Nắm cách dùng: put/call, VIX, TRIN, short interest, margin debt, dòng tiền quỹ, COT.', 'Hiểu khái niệm làm mượt và chuẩn hoá cực trị.', 'Áp dụng cho thị trường Việt Nam và crypto.'],
      body: () => `
<h3>1. Chỉ báo từ thị trường quyền chọn</h3>
<ul><li><b>Tỷ lệ Put/Call</b>: khối lượng (hoặc OI) put ÷ call. Cao thì sợ hãi (tín hiệu tăng theo hướng ngược). Thấp thì tự mãn (cảnh báo). Nên dùng MA 5–21 ngày để làm mượt. Tách riêng put/call của <b>cổ phiếu</b> (nhà đầu tư nhỏ lẻ chiếm tỷ trọng lớn) với của <b>chỉ số</b> (chủ yếu là tổ chức phòng ngừa rủi ro), vì hai loại này mang ý nghĩa khác nhau.</li>
<li><b>VIX / biến động ngụ ý</b>: tăng vọt thì sợ hãi; thấp kéo dài thì tự mãn (Bài 26).</li></ul>
<h3>2. Chỉ báo từ dòng lệnh và vị thế</h3>
<table class="tbl"><thead><tr><th>Chỉ báo</th><th>Ý nghĩa</th><th>Diễn giải ngược</th></tr></thead><tbody>
<tr><td><b>TRIN (Arms)</b></td><td>Độ rộng so với khối lượng</td><td>Cực cao thì bán tháo hoảng loạn, gần đáy</td></tr>
<tr><td><b>Short interest / days to cover</b></td><td>Lượng bán khống chưa đóng</td><td>Rất cao thì bi quan, là nhiên liệu cho short squeeze</td></tr>
<tr><td><b>Margin debt (dư nợ ký quỹ)</b></td><td>Mức độ dùng đòn bẩy</td><td>Đạt đỉnh kỷ lục rồi giảm thường cảnh báo đỉnh; giảm mạnh thì giải chấp, gần đáy</td></tr>
<tr><td><b>Dòng tiền quỹ / tiền mặt của quỹ</b></td><td>Nhà đầu tư rót hay rút vốn</td><td>Tiền mặt quỹ rất thấp thì đã đầu tư hết, ít sức mua; dòng tiền rút mạnh là sợ hãi</td></tr>
<tr><td><b>COT</b></td><td>Vị thế commercials và đầu cơ lớn</td><td>Đầu cơ lớn cực đoan một phía thì rủi ro đảo chiều</td></tr>
<tr><td><b>Đỉnh/đáy mới, % trên MA</b></td><td>Độ rộng cực trị</td><td>Quá bán toàn diện thì đáy tiềm năng</td></tr></tbody></table>
<h3>3. Kỹ thuật xử lý chỉ báo tâm lý</h3>
<ul><li><b>Làm mượt</b> bằng MA để giảm nhiễu từng ngày.</li>
<li><b>Chuẩn hoá</b>: dùng dải Bollinger, z-score hoặc phân vị trong cửa sổ dài, thay vì ngưỡng cố định, vì mức "bình thường" thay đổi theo thời gian.</li>
<li><b>Kết hợp</b> nhiều chỉ báo độc lập. Một "bảng tổng hợp tâm lý" đáng tin hơn một chỉ báo đơn lẻ.</li>
<li><b>Xác nhận bằng giá</b>: cực trị tâm lý + tín hiệu đảo chiều của giá.</li></ul>
<h3>4. Việt Nam và crypto</h3>
<ul><li><b>Việt Nam</b>: chưa có put/call hay VIX chính thức. Có thể theo dõi dư nợ margin toàn thị trường (theo quý), giao dịch khối ngoại, giá trị giao dịch cực lớn hoặc cực nhỏ, basis VN30F, tỷ lệ mã tăng/giảm, % cổ phiếu trên MA.</li>
<li><b>Crypto</b>: <b>funding rate</b> của hợp đồng vĩnh cửu (dương cao thì phe mua đòn bẩy đông, dễ bị thanh lý dây chuyền), OI, tỷ lệ long/short, khối lượng thanh lý.</li></ul>`,
      keys: ['Put/Call: cao = sợ hãi (ngược tăng); làm mượt; tách cổ phiếu và chỉ số.', 'VIX, TRIN cực cao = hoảng loạn gần đáy.', 'Short interest cao = nhiên liệu short squeeze; margin debt đạt đỉnh rồi giảm = cảnh báo.', 'Làm mượt, chuẩn hoá (z-score/phân vị), kết hợp nhiều chỉ báo, xác nhận bằng giá.', 'VN: margin, khối ngoại, thanh khoản cực trị, basis VN30F; crypto: funding rate, OI, thanh lý.'],
      terms: [['Put/Call ratio', 'Tỷ lệ Put/Call'], ['Days to cover', 'Số ngày để đóng hết vị thế bán khống'], ['Margin debt', 'Dư nợ ký quỹ'], ['Funding rate', 'Phí tài trợ hợp đồng vĩnh cửu'], ['Z-score', 'Điểm chuẩn hoá'], ['Sentiment composite', 'Chỉ báo tâm lý tổng hợp']],
      quiz: [
        Q('Put/Call ratio (MA 10 ngày) lên mức cao nhất 1 năm. Diễn giải ngược:', ['Tín hiệu đỉnh', 'Sợ hãi cao — tiềm năng đáy', 'Không ý nghĩa', 'Bán ngay'], 1, 'Đám đông phòng thủ quá mức.'),
        Q('Vì sao nên tách put/call cổ phiếu với chỉ số?', ['Giống nhau', 'Chỉ số chủ yếu là tổ chức phòng ngừa, cổ phiếu có nhiều nhỏ lẻ', 'Do thuế', 'Không cần'], 1, 'Ý nghĩa tâm lý khác nhau.'),
        Q('Short interest rất cao có thể dẫn tới:', ['Giá giảm chắc chắn', 'Short squeeze khi giá tăng', 'Không gì', 'Cổ tức tăng'], 1, 'Người bán khống phải mua lại.'),
        Q('Margin debt đạt kỷ lục rồi bắt đầu giảm thường là:', ['Tín hiệu đáy', 'Cảnh báo đỉnh', 'Không liên quan', 'Tín hiệu mua mạnh'], 1, 'Đòn bẩy rút đi.'),
        Q('Vì sao nên dùng z-score/phân vị thay vì ngưỡng cố định?', ['Đẹp hơn', 'Mức "bình thường" thay đổi theo thời gian', 'Do luật', 'Không có lý do'], 1, 'Chuẩn hoá theo bối cảnh.'),
        Q('Funding rate dương rất cao trên thị trường crypto cho thấy:', ['Phe bán khống áp đảo', 'Phe mua đòn bẩy quá đông — rủi ro thanh lý dây chuyền', 'Thị trường yên bình', 'Không gì'], 1, 'Người long trả phí cho người short.'),
        Q('TRIN cực cao trong ngày bán tháo cho thấy:', ['Hưng phấn', 'Hoảng loạn — gần đáy ngắn hạn', 'Xu hướng tăng', 'Không gì'], 1, ''),
        Q('Cách dùng chỉ báo tâm lý tốt nhất là:', ['Một chỉ báo, ngưỡng cố định', 'Kết hợp nhiều chỉ báo, chuẩn hoá, xác nhận bằng giá', 'Bỏ qua giá', 'Theo tin tức'], 1, '')
      ]
    },
    en: {
      goals: ['Interpret market-data sentiment indicators.', 'Use put/call, VIX, TRIN, short interest, margin, flows, COT.', 'Smooth and normalise.', 'Apply to Vietnam and crypto.'],
      body: () => `
<h3>1. Options</h3><ul><li><b>Put/call</b>: high = fear (contrarian bullish); smooth with MAs; separate equity (retail-heavy) from index (hedging).</li><li><b>VIX / IV</b>.</li></ul>
<h3>2. Flows and positioning</h3><table class="tbl"><tbody><tr><td>TRIN</td><td>Extreme highs = panic lows</td></tr><tr><td>Short interest</td><td>High = squeeze fuel</td></tr><tr><td>Margin debt</td><td>Record then falling = top warning</td></tr><tr><td>Fund flows / cash</td><td>Low cash = little buying power</td></tr><tr><td>COT</td><td>Extreme spec positioning</td></tr><tr><td>Breadth extremes</td><td>Washouts</td></tr></tbody></table>
<h3>3. Processing</h3><ul><li>Smooth.</li><li>Normalise (Bollinger, z-score, percentile).</li><li>Combine into composites.</li><li>Confirm with price.</li></ul>
<h3>4. Vietnam and crypto</h3><ul><li>Vietnam: margin balances, foreign flows, liquidity extremes, VN30F basis, breadth.</li><li>Crypto: funding rates, OI, long/short ratios, liquidations.</li></ul>`,
      keys: ['Put/call high = fear.', 'VIX and TRIN spikes = panic.', 'Short interest fuels squeezes; margin peaks warn.', 'Smooth, normalise, combine, confirm.', 'Local proxies for VN and crypto.'],
      terms: [['Funding rate', 'Perpetual swap fee'], ['Days to cover', 'Short interest / average volume']],
      quiz: [
        Q('Put/call at a 1-year high (contrarian):', ['Top', 'Fear — potential low', 'Meaningless', 'Sell'], 1, ''),
        Q('Separate equity and index put/call because:', ['Same', 'Index is hedging, equity is retail-heavy', 'Tax', 'No need'], 1, ''),
        Q('Very high short interest can cause:', ['Certain decline', 'A squeeze on a rally', 'Nothing', 'Higher dividends'], 1, ''),
        Q('Record margin debt then falling:', ['Bottom', 'Top warning', 'Unrelated', 'Strong buy'], 1, ''),
        Q('Why z-scores?', ['Prettier', 'What is "normal" changes', 'Law', 'None'], 1, ''),
        Q('Very high positive crypto funding:', ['Shorts dominate', 'Crowded leveraged longs — liquidation risk', 'Calm', 'Nothing'], 1, ''),
        Q('Extreme TRIN on a sell-off:', ['Euphoria', 'Panic near a low', 'Uptrend', 'Nothing'], 1, ''),
        Q('Best practice:', ['One fixed indicator', 'Combine, normalise, confirm with price', 'Ignore price', 'Follow news'], 1, '')
      ]
    }
  };

  /* ================= 35 ================= */
  C.lessons['l1-35'] = {
    vi: {
      goals: ['Diễn giải chỉ báo tâm lý từ dữ liệu bên ngoài thị trường.', 'Hiểu khảo sát tâm lý nhà đầu tư và bản tin.', 'Dùng truyền thông, giao dịch nội bộ, mạng xã hội như chỉ báo.', 'Đánh giá độ tin cậy và giới hạn.'],
      body: () => `
<h3>1. Khảo sát tâm lý</h3>
<ul><li><b>Khảo sát nhà đầu tư cá nhân</b> hằng tuần (tỷ lệ lạc quan/bi quan/trung lập về 6 tháng tới): tỷ lệ lạc quan cực cao là cảnh báo, bi quan cực cao là tín hiệu tăng (ngược).</li>
<li><b>Khảo sát các bản tin chuyên nghiệp</b>: đo tỷ lệ người viết bản tin tăng giá/giảm giá. Họ thường theo xu hướng, nên mức đồng thuận cực đoan có ý nghĩa ngược.</li>
<li><b>Khảo sát quản lý quỹ</b> (phân bổ tài sản, tỷ lệ tiền mặt): tiền mặt rất thấp thì ít sức mua còn lại.</li></ul>
<h3>2. Truyền thông</h3>
<p>Khi một chủ đề tài chính lên trang bìa tạp chí đại chúng hoặc tin thời sự chính, nó thường đã ở giai đoạn muộn của xu hướng. Truyền thông phản ánh điều <b>đã</b> xảy ra và mức độ phổ biến của một quan điểm. Đây là chỉ báo định tính, khó định lượng, nhưng cực trị thường rất rõ.</p>
<h3>3. Giao dịch nội bộ</h3>
<p>Người nội bộ (ban lãnh đạo, cổ đông lớn) hiểu doanh nghiệp nhất. <b>Mua</b> của nội bộ có ý nghĩa hơn <b>bán</b>, vì người ta bán vì nhiều lý do (đa dạng hoá, nhu cầu tiền) nhưng chỉ mua vì một lý do: kỳ vọng giá tăng. Mua cụm (nhiều người nội bộ cùng mua) và mua sau nhịp giảm mạnh là tín hiệu đáng chú ý. Ở Việt Nam, giao dịch của người nội bộ và người liên quan phải công bố trước và sau giao dịch.</p>
<h3>4. Dữ liệu mới</h3>
<ul><li><b>Mạng xã hội, diễn đàn</b>: đếm số lần nhắc đến, phân tích cảm xúc văn bản (NLP). Mức "sốt" cực điểm thường trùng giai đoạn hưng phấn.</li>
<li><b>Xu hướng tìm kiếm</b> (ví dụ số lượt tìm "mua cổ phiếu", "bitcoin"): tăng vọt khi đám đông mới đổ vào, thường gần đỉnh.</li>
<li><b>Hoạt động IPO và phát hành</b>: IPO dồn dập, định giá cao là dấu hiệu thị trường nóng; doanh nghiệp tranh thủ bán cổ phiếu khi giá cao.</li>
<li>Ở Việt Nam: số tài khoản chứng khoán mở mới mỗi tháng là thước đo dòng nhà đầu tư mới. Mức kỷ lục thường gắn với giai đoạn hưng phấn.</li></ul>
<h3>5. Độ tin cậy</h3>
<ul><li>Dữ liệu khảo sát có <b>độ trễ</b> và mẫu nhỏ; phương pháp có thể thay đổi.</li>
<li>Tâm lý cực đoan có thể <b>kéo dài</b>; chỉ báo tâm lý cho biết <b>rủi ro</b>, không cho biết <b>thời điểm</b> chính xác.</li>
<li>Hãy dùng như <b>bối cảnh</b> và chờ giá xác nhận. Kết hợp với dữ liệu thị trường (Bài 34) để tạo bức tranh tổng hợp.</li></ul>`,
      keys: ['Khảo sát nhà đầu tư, bản tin, quản lý quỹ: cực trị dùng theo hướng ngược.', 'Truyền thông đại chúng phản ánh giai đoạn muộn của xu hướng.', 'Nội bộ mua có ý nghĩa hơn nội bộ bán; mua cụm sau nhịp giảm là tín hiệu đáng chú ý.', 'Dữ liệu mới: mạng xã hội, tìm kiếm, IPO, số tài khoản mở mới.', 'Chỉ báo tâm lý cho biết rủi ro, không cho biết thời điểm — cần giá xác nhận.'],
      terms: [['Investor survey', 'Khảo sát nhà đầu tư'], ['Newsletter sentiment', 'Tâm lý bản tin'], ['Insider buying', 'Mua của người nội bộ'], ['Magazine cover indicator', 'Chỉ báo trang bìa'], ['Search trends', 'Xu hướng tìm kiếm'], ['New account openings', 'Số tài khoản mở mới']],
      quiz: [
        Q('Khảo sát cho thấy tỷ lệ nhà đầu tư lạc quan cao kỷ lục. Diễn giải ngược:', ['Mua mạnh', 'Cảnh báo rủi ro đỉnh', 'Không ý nghĩa', 'Bán khống ngay'], 1, 'Người lạc quan đã mua.'),
        Q('Vì sao nội bộ MUA có ý nghĩa hơn nội bộ BÁN?', ['Mua ít hơn', 'Bán có nhiều lý do, mua chủ yếu vì kỳ vọng giá tăng', 'Do luật', 'Không đúng'], 1, ''),
        Q('Chủ đề tài chính lên trang bìa tạp chí đại chúng thường cho thấy:', ['Xu hướng mới bắt đầu', 'Xu hướng đã ở giai đoạn muộn', 'Không liên quan', 'Thị trường yên bình'], 1, 'Truyền thông phản ánh điều đã phổ biến.'),
        Q('IPO dồn dập với định giá cao thường là dấu hiệu:', ['Thị trường lạnh', 'Thị trường nóng, gần giai đoạn hưng phấn', 'Đáy', 'Không gì'], 1, 'Doanh nghiệp bán khi giá cao.'),
        Q('Số tài khoản chứng khoán mở mới đạt kỷ lục thường gắn với:', ['Đáy hoảng loạn', 'Giai đoạn hưng phấn', 'Đi ngang', 'Không gì'], 1, 'Nhà đầu tư mới đổ vào.'),
        Q('Giới hạn chính của chỉ báo tâm lý:', ['Cho biết chính xác thời điểm', 'Cho biết rủi ro, không cho biết thời điểm; cực trị có thể kéo dài', 'Không có dữ liệu', 'Luôn đúng'], 1, ''),
        Q('Bản tin chuyên nghiệp thường:', ['Đi ngược xu hướng', 'Theo xu hướng — đồng thuận cực đoan có ý nghĩa ngược', 'Không có quan điểm', 'Luôn đúng'], 1, ''),
        Q('Lượt tìm kiếm "mua bitcoin" tăng vọt thường xuất hiện:', ['Gần đáy', 'Gần đỉnh khi đám đông mới đổ vào', 'Giữa xu hướng giảm', 'Không liên quan'], 1, '')
      ]
    },
    en: {
      goals: ['Interpret external sentiment data.', 'Use surveys and newsletters.', 'Use media, insiders, social data.', 'Judge reliability.'],
      body: () => `
<h3>1. Surveys</h3><ul><li>Weekly individual-investor surveys — extremes are contrarian.</li><li>Newsletter writers — trend followers, so consensus extremes matter.</li><li>Fund-manager surveys — low cash means little buying power.</li></ul>
<h3>2. Media</h3><p>Front-page and magazine-cover attention usually comes late in a move.</p>
<h3>3. Insiders</h3><p>Insider <b>buying</b> matters more than selling; cluster buying after declines stands out. Vietnam requires pre- and post-trade disclosure.</p>
<h3>4. New data</h3><ul><li>Social media mentions and NLP sentiment.</li><li>Search trends.</li><li>IPO activity.</li><li>Vietnam: new brokerage accounts.</li></ul>
<h3>5. Reliability</h3><ul><li>Lags and small samples.</li><li>Extremes persist — sentiment shows risk, not timing.</li><li>Use as context with price confirmation and market-data indicators.</li></ul>`,
      keys: ['Surveys: fade extremes.', 'Media signals late stages.', 'Insider buying > selling.', 'Social, search, IPO, account data.', 'Risk, not timing.'],
      terms: [['Insider buying', 'Purchases by executives/major holders'], ['Search trends', 'Query volume']],
      quiz: [
        Q('Record investor optimism (contrarian):', ['Buy hard', 'Top-risk warning', 'Meaningless', 'Short now'], 1, ''),
        Q('Insider buying matters more because:', ['It is rarer', 'Selling has many motives, buying one', 'Law', 'False'], 1, ''),
        Q('Magazine-cover attention signals:', ['A new trend', 'A late-stage trend', 'Nothing', 'Calm'], 1, ''),
        Q('IPO boom at high valuations:', ['Cold market', 'Hot market near euphoria', 'Bottom', 'Nothing'], 1, ''),
        Q('Record new brokerage accounts:', ['Panic low', 'Euphoria', 'Range', 'Nothing'], 1, ''),
        Q('Main limitation:', ['Exact timing', 'Shows risk not timing; extremes persist', 'No data', 'Always right'], 1, ''),
        Q('Newsletter writers tend to:', ['Fade trends', 'Follow trends — extremes are contrarian', 'Have no view', 'Be right'], 1, ''),
        Q('A spike in "buy bitcoin" searches tends to come:', ['Near lows', 'Near highs as newcomers arrive', 'Mid-decline', 'Unrelated'], 1, '')
      ]
    }
  };
})(window.LLW);
