// © 2026 Lai Long Master TA. Bảo lưu mọi quyền. Không sao chép, chỉnh sửa hay dùng lại khi chưa được phép.
/* CMT Level 1 — Part IV (a), lessons 17–21: markets, equities, indexes, bonds, futures. Written by Lai Long Master TA in its own words. */
(function (L) {
  'use strict';
  const C = L.cmt, F = C.fig;
  const T = (lang, vi, en) => (lang === 'en' ? en : vi);
  const Q = (q, o, a, e) => ({ q, o, a, e });

  /* calculator shell (no market data) */
  C.calcShell = (id, inputs, note) => `<div class="demo" data-demo="${id}"><div class="demo-head"><b>🧮 ${L.T('Máy tính thực hành', 'Practice calculator')}</b>${inputs}</div><div class="demo-calc"></div><div class="demo-out">${note || ''}</div></div>`;
  C.num = (cls, val, label, step) => `<label class="chk">${label} <input type="number" class="${cls} d-num" value="${val}" step="${step || 'any'}"></label>`;

  /* ---------- figures ---------- */
  const fg = {
    curves: lg => F.row(
      F.line({ w: 240, h: 190, series: [{ pts: [[0, 20], [15, 45], [35, 62], [60, 72], [100, 80]] }], caption: T(lg, 'Bình thường (dốc lên)', 'Normal (upward)') }),
      F.line({ w: 240, h: 190, series: [{ pts: [[0, 55], [30, 57], [60, 56], [100, 57]] }], caption: T(lg, 'Phẳng', 'Flat') }),
      F.line({ w: 240, h: 190, series: [{ pts: [[0, 80], [15, 70], [35, 58], [60, 50], [100, 45]] }], caption: T(lg, 'Đảo ngược — thường báo trước suy thoái', 'Inverted — often precedes recession') })),
    term: lg => F.row(
      F.line({ w: 320, h: 200, series: [{ pts: [[0, 30], [25, 45], [50, 56], [75, 63], [100, 68]] }], labels: [[0, 30, T(lg, 'giao ngay', 'spot'), 'r'], [100, 68, T(lg, 'xa', 'far'), 'l']], caption: 'Contango: ' + T(lg, 'kỳ hạn xa giá cao hơn', 'later months priced higher') }),
      F.line({ w: 320, h: 200, series: [{ pts: [[0, 72], [25, 60], [50, 52], [75, 47], [100, 44]] }], labels: [[0, 72, T(lg, 'giao ngay', 'spot'), 'r'], [100, 44, T(lg, 'xa', 'far'), 'l']], caption: 'Backwardation: ' + T(lg, 'kỳ hạn gần giá cao hơn', 'nearby priced higher') }))
  };

  /* ---------- index weighting calculator ---------- */
  C.demoHtml.indexCalc = () => C.calcShell('indexCalc',
    `<span class="muted">${L.T('3 cổ phiếu: giá và số cổ phiếu lưu hành', '3 stocks: price and shares outstanding')}</span>
     ${C.num('p1', 100, 'A: P', 1)}${C.num('s1', 1000, 'SL', 1)}${C.num('p2', 20, 'B: P', 1)}${C.num('s2', 50000, 'SL', 1)}${C.num('p3', 50, 'C: P', 1)}${C.num('s3', 4000, 'SL', 1)}
     ${C.num('chg', 10, L.T('A tăng %', 'A rises %'), 1)}`);
  C.demoRun.indexCalc = box => {
    const run = () => {
      const g = c => +box.querySelector('.' + c).value || 0;
      const P = [g('p1'), g('p2'), g('p3')], S = [g('s1'), g('s2'), g('s3')], ch = g('chg') / 100;
      const P2 = [P[0] * (1 + ch), P[1], P[2]];
      const pw = (p) => p.reduce((a, b) => a + b, 0);
      const cw = (p) => p.reduce((a, b, k) => a + b * S[k], 0);
      const pct = (a, b) => ((b / a - 1) * 100).toFixed(2) + '%';
      const capW = P.map((p, k) => p * S[k] / cw(P) * 100);
      box.querySelector('.demo-out').innerHTML = `<table class="tbl"><thead><tr><th>${L.T('Phương pháp', 'Method')}</th><th>${L.T('Thay đổi chỉ số khi A tăng', 'Index change when A rises')} ${(ch * 100).toFixed(0)}%</th></tr></thead><tbody>
        <tr><td>${L.T('Trọng số giá (kiểu Dow)', 'Price-weighted (Dow style)')}</td><td><b>${pct(pw(P), pw(P2))}</b></td></tr>
        <tr><td>${L.T('Trọng số vốn hoá (kiểu S&P, VNINDEX)', 'Cap-weighted (S&P, VNINDEX style)')}</td><td><b>${pct(cw(P), cw(P2))}</b></td></tr>
        <tr><td>${L.T('Trọng số bằng nhau', 'Equal-weighted')}</td><td><b>${(ch * 100 / 3).toFixed(2)}%</b></td></tr></tbody></table>
        <p class="muted">${L.T('Tỷ trọng vốn hoá hiện tại', 'Current cap weights')}: A ${capW[0].toFixed(1)}% · B ${capW[1].toFixed(1)}% · C ${capW[2].toFixed(1)}%. ${L.T('Thử đổi giá A thật cao: chỉ số trọng số giá bị cổ phiếu giá cao chi phối bất kể quy mô công ty.', 'Try a very high price for A: a price-weighted index is dominated by high-priced shares regardless of company size.')}</p>`;
    };
    box.querySelectorAll('.d-num').forEach(i => { i.oninput = run; });
    run();
  };

  /* ---------- bond calculator ---------- */
  C.demoHtml.bondCalc = () => C.calcShell('bondCalc', `${C.num('cp', 5, L.T('Lãi coupon %/năm', 'Coupon %/yr'), 0.1)}${C.num('yr', 10, L.T('Số năm', 'Years'), 1)}${C.num('yl', 5, L.T('Lợi suất thị trường %', 'Market yield %'), 0.1)}`);
  C.demoRun.bondCalc = box => {
    const price = (c, n, y) => { let p = 0; for (let t = 1; t <= n; t++) p += c / Math.pow(1 + y, t); return p + 100 / Math.pow(1 + y, n); };
    const run = () => {
      const c = +box.querySelector('.cp').value, n = Math.max(1, Math.round(+box.querySelector('.yr').value)), y = +box.querySelector('.yl').value / 100;
      const p0 = price(c, n, y), up = price(c, n, y + 0.01), dn = price(c, n, Math.max(0, y - 0.01));
      let dur = 0; for (let t = 1; t <= n; t++) dur += t * c / Math.pow(1 + y, t); dur = (dur + n * 100 / Math.pow(1 + y, n)) / p0;
      box.querySelector('.demo-out').innerHTML = L.T(`Giá trái phiếu (mệnh giá 100): <b>${p0.toFixed(2)}</b>. Nếu lợi suất <b>tăng</b> 1% → giá ${up.toFixed(2)} (${((up / p0 - 1) * 100).toFixed(2)}%); nếu <b>giảm</b> 1% → ${dn.toFixed(2)} (+${((dn / p0 - 1) * 100).toFixed(2)}%). Duration Macaulay ≈ <b>${dur.toFixed(2)} năm</b> — kỳ hạn càng dài, coupon càng thấp thì giá càng nhạy với lợi suất.`,
        `Bond price (par 100): <b>${p0.toFixed(2)}</b>. Yield <b>+1%</b> → ${up.toFixed(2)} (${((up / p0 - 1) * 100).toFixed(2)}%); <b>−1%</b> → ${dn.toFixed(2)} (+${((dn / p0 - 1) * 100).toFixed(2)}%). Macaulay duration ≈ <b>${dur.toFixed(2)} years</b> — longer maturity and lower coupon mean more rate sensitivity.`);
    };
    box.querySelectorAll('.d-num').forEach(i => { i.oninput = run; });
    run();
  };

  /* ---------- futures margin calculator ---------- */
  C.demoHtml.futCalc = () => C.calcShell('futCalc', `${C.num('fp', 1850, L.T('Giá HĐ', 'Price'), 1)}${C.num('mult', 100000, L.T('Hệ số nhân (đ/điểm)', 'Multiplier'), 1)}${C.num('im', 17, L.T('Ký quỹ ban đầu %', 'Initial margin %'), 0.5)}${C.num('mv', -30, L.T('Biến động giá (điểm)', 'Price move (pts)'), 1)}`,
    L.T('Mặc định mô phỏng VN30F: 1 điểm = 100.000đ.', 'Defaults mimic VN30F: 1 point = 100,000 VND.'));
  C.demoRun.futCalc = box => {
    const run = () => {
      const g = c => +box.querySelector('.' + c).value;
      const notional = g('fp') * g('mult'), margin = notional * g('im') / 100, pnl = g('mv') * g('mult');
      const f = x => Math.round(x).toLocaleString('vi-VN');
      box.querySelector('.demo-out').innerHTML = L.T(`Giá trị danh nghĩa 1 hợp đồng: <b>${f(notional)}</b> · Ký quỹ ban đầu: <b>${f(margin)}</b> · Đòn bẩy ≈ <b>${(notional / margin).toFixed(1)}x</b>. Giá đi ${g('mv')} điểm → lãi/lỗ (vị thế mua) <b class="${pnl >= 0 ? 'up' : 'down'}">${f(pnl)}</b> = <b>${(pnl / margin * 100).toFixed(1)}%</b> số tiền ký quỹ. Đó là lý do quản trị rủi ro phái sinh phải chặt chẽ.`,
        `Notional per contract: <b>${f(notional)}</b> · Initial margin: <b>${f(margin)}</b> · Leverage ≈ <b>${(notional / margin).toFixed(1)}x</b>. A ${g('mv')}-point move → long P&L <b class="${pnl >= 0 ? 'up' : 'down'}">${f(pnl)}</b> = <b>${(pnl / margin * 100).toFixed(1)}%</b> of margin.`);
    };
    box.querySelectorAll('.d-num').forEach(i => { i.oninput = run; });
    run();
  };

  /* ================= LESSON 17 ================= */
  C.lessons['l1-17'] = {
    vi: {
      goals: ['Phân biệt các loại thị trường: giao ngay/phái sinh, tập trung/OTC, sơ cấp/thứ cấp.', 'Hiểu cấu trúc khớp lệnh: giá chào mua/bán, thanh khoản, trượt giá.', 'Nắm các loại lệnh cơ bản và khi nào dùng.', 'Nhận diện các vấn đề dữ liệu: thiên lệch sống sót, điều chỉnh, múi giờ.'],
      body: () => `
<h3>1. Bản đồ thị trường</h3>
<table class="tbl"><thead><tr><th>Phân loại</th><th>Nội dung</th></tr></thead><tbody>
<tr><td>Giao ngay / Phái sinh</td><td>Giao ngay: mua bán tài sản thật (cổ phiếu, vàng, ngoại tệ). Phái sinh: hợp đồng có giá trị phụ thuộc tài sản cơ sở (tương lai, quyền chọn, swap)</td></tr>
<tr><td>Tập trung (sàn) / OTC</td><td>Sàn có quy chuẩn, minh bạch, có bù trừ trung tâm. OTC (phi tập trung) giao dịch song phương, linh hoạt nhưng có rủi ro đối tác (ví dụ phần lớn thị trường ngoại hối)</td></tr>
<tr><td>Sơ cấp / Thứ cấp</td><td>Sơ cấp: phát hành lần đầu (IPO). Thứ cấp: nhà đầu tư giao dịch với nhau. PTKT làm việc chủ yếu ở thị trường thứ cấp</td></tr></tbody></table>
<p>Người tham gia: nhà đầu tư cá nhân, quỹ, tổ chức, tạo lập thị trường (market maker), nhà đầu cơ, nhà phòng ngừa rủi ro (hedger). Mỗi nhóm có mục tiêu và khung thời gian khác nhau, và chính sự khác biệt đó tạo ra giao dịch.</p>
<h3>2. Cấu trúc khớp lệnh</h3>
<ul><li><b>Bid</b>: giá cao nhất người mua sẵn sàng trả. <b>Ask/Offer</b>: giá thấp nhất người bán chấp nhận. <b>Spread</b> = Ask − Bid, là chi phí giao dịch ngầm.</li>
<li><b>Thanh khoản</b>: khả năng mua bán khối lượng lớn mà không làm giá xê dịch nhiều. Thanh khoản thấp thì spread rộng và trượt giá lớn.</li>
<li><b>Trượt giá (slippage)</b>: chênh lệch giữa giá dự kiến và giá khớp thực tế, đặc biệt khi thị trường biến động mạnh hoặc khi lệnh dừng bị kích hoạt.</li></ul>
<h3>3. Các loại lệnh</h3>
<table class="tbl"><thead><tr><th>Lệnh</th><th>Cách hoạt động</th><th>Ưu / nhược</th></tr></thead><tbody>
<tr><td><b>Thị trường (market)</b></td><td>Khớp ngay ở giá tốt nhất hiện có</td><td>Chắc khớp, không chắc giá</td></tr>
<tr><td><b>Giới hạn (limit)</b></td><td>Chỉ khớp ở giá bằng hoặc tốt hơn mức đặt</td><td>Chắc giá, không chắc khớp</td></tr>
<tr><td><b>Dừng (stop)</b></td><td>Khi giá chạm mức kích hoạt thì thành lệnh thị trường</td><td>Dùng để cắt lỗ / vào theo phá vỡ; có thể trượt giá</td></tr>
<tr><td><b>Dừng giới hạn (stop-limit)</b></td><td>Khi kích hoạt thì thành lệnh giới hạn</td><td>Kiểm soát giá, nhưng có thể không khớp khi giá "nhảy"</td></tr>
<tr><td><b>Lệnh phiên mở/đóng cửa</b></td><td>Khớp ở phiên định kỳ (ATO/ATC ở Việt Nam)</td><td>Lấy giá tham chiếu chính thức của phiên</td></tr></tbody></table>
<h3>4. Dữ liệu — nguyên liệu của nhà PTKT</h3>
<ul><li><b>Thiên lệch sống sót (survivorship bias)</b>: dữ liệu chỉ gồm các mã còn niêm yết bỏ sót các công ty đã phá sản hoặc huỷ niêm yết, làm kết quả kiểm định đẹp hơn thực tế.</li>
<li><b>Điều chỉnh sự kiện doanh nghiệp</b> (Bài 3) và <b>hợp đồng tương lai liên tục</b>.</li>
<li><b>Khung giờ và múi giờ</b>: thị trường 24/7 (crypto) và thị trường có phiên; nến ngày của các nguồn khác nhau có thể đóng ở giờ khác nhau.</li>
<li><b>Khối lượng không tập trung</b>: ngoại hối và nhiều sản phẩm OTC không có khối lượng toàn thị trường, chỉ có "tick volume" của từng nhà cung cấp.</li></ul>
<div class="callout">Nhà PTKT chuyên nghiệp luôn hỏi: dữ liệu này đến từ đâu, đã được điều chỉnh chưa, có thiếu gì không, và nó phản ánh đúng điều tôi muốn đo hay không?</div>`,
      keys: ['Thị trường: giao ngay/phái sinh, sàn/OTC, sơ cấp/thứ cấp.', 'Spread = Ask − Bid là chi phí ngầm; thanh khoản thấp → spread rộng, trượt giá lớn.', 'Lệnh thị trường chắc khớp không chắc giá; lệnh giới hạn chắc giá không chắc khớp.', 'Lệnh dừng thành lệnh thị trường khi kích hoạt; stop-limit thành lệnh giới hạn.', 'Vấn đề dữ liệu: thiên lệch sống sót, điều chỉnh, múi giờ, khối lượng không tập trung.'],
      terms: [['Spot / Derivative', 'Giao ngay / Phái sinh'], ['OTC', 'Thị trường phi tập trung'], ['Bid / Ask / Spread', 'Giá mua / Giá bán / Chênh lệch'], ['Liquidity', 'Thanh khoản'], ['Slippage', 'Trượt giá'], ['Market / Limit / Stop order', 'Lệnh thị trường / giới hạn / dừng'], ['Survivorship bias', 'Thiên lệch sống sót']],
      quiz: [
        Q('Bid 25.0, Ask 25.2. Spread là:', ['0.1', '0.2', '25.1', '50.2'], 1, 'Spread = Ask − Bid.'),
        Q('Lệnh nào chắc chắn khớp nhưng không chắc giá?', ['Lệnh giới hạn', 'Lệnh thị trường', 'Stop-limit', 'Không có'], 1, 'Khớp ngay ở giá tốt nhất hiện có.'),
        Q('Lệnh dừng (stop) khi được kích hoạt sẽ trở thành:', ['Lệnh giới hạn', 'Lệnh thị trường', 'Bị huỷ', 'Lệnh ATC'], 1, 'Vì vậy có thể bị trượt giá.'),
        Q('Rủi ro của lệnh stop-limit là:', ['Trượt giá vô hạn', 'Có thể không khớp khi giá nhảy qua mức giới hạn', 'Không có rủi ro', 'Luôn khớp ở giá tệ'], 1, 'Kiểm soát giá đổi lấy rủi ro không khớp.'),
        Q('Thiên lệch sống sót làm kết quả kiểm định:', ['Tệ hơn thực tế', 'Đẹp hơn thực tế', 'Không ảnh hưởng', 'Ngẫu nhiên'], 1, 'Các công ty thất bại bị loại khỏi dữ liệu.'),
        Q('Thị trường OTC có đặc điểm:', ['Luôn minh bạch hơn sàn', 'Giao dịch song phương, có rủi ro đối tác', 'Không có giá', 'Chỉ có cổ phiếu'], 1, 'Không có bù trừ trung tâm như sàn.'),
        Q('Vì sao dữ liệu khối lượng ngoại hối giao ngay hạn chế?', ['Vì không ai giao dịch', 'Vì thị trường phi tập trung, không có khối lượng toàn thị trường', 'Vì luật cấm', 'Vì giá cố định'], 1, 'Chỉ có tick volume của từng nhà cung cấp.'),
        Q('Thanh khoản thấp thường dẫn đến:', ['Spread hẹp', 'Spread rộng và trượt giá lớn', 'Không ảnh hưởng', 'Giá cố định'], 1, 'Ít người tham gia, khó khớp khối lượng lớn.')
      ]
    },
    en: {
      goals: ['Classify markets.', 'Understand bid/ask, liquidity, slippage.', 'Know order types.', 'Spot data problems.'],
      body: () => `
<h3>1. Market map</h3><ul><li>Spot vs derivatives</li><li>Exchange vs OTC (counterparty risk)</li><li>Primary vs secondary — TA works mostly in secondary markets</li></ul><p>Participants — individuals, funds, market makers, speculators, hedgers — differ in goals and horizons, which creates trading.</p>
<h3>2. Microstructure</h3><ul><li>Bid, ask, spread (= ask − bid)</li><li>Liquidity</li><li>Slippage</li></ul>
<h3>3. Orders</h3><table class="tbl"><tbody><tr><td>Market</td><td>Certain fill, uncertain price</td></tr><tr><td>Limit</td><td>Certain price, uncertain fill</td></tr><tr><td>Stop</td><td>Becomes a market order when triggered</td></tr><tr><td>Stop-limit</td><td>Becomes a limit order — may not fill on gaps</td></tr><tr><td>On open/close</td><td>Auction fills (ATO/ATC)</td></tr></tbody></table>
<h3>4. Data</h3><ul><li>Survivorship bias</li><li>Adjustments and continuous contracts</li><li>Sessions and time zones</li><li>Decentralised volume (FX tick volume)</li></ul>`,
      keys: ['Spot/derivative, exchange/OTC, primary/secondary.', 'Spread is a hidden cost; illiquidity widens it.', 'Market = sure fill; limit = sure price.', 'Stops become market orders; stop-limits become limits.', 'Data issues: survivorship, adjustments, sessions, volume.'],
      terms: [['OTC', 'Over the counter'], ['Slippage', 'Expected vs actual fill'], ['Survivorship bias', 'Dead companies missing from data']],
      quiz: [
        Q('Bid 25.0, ask 25.2. Spread:', ['0.1', '0.2', '25.1', '50.2'], 1, ''),
        Q('Certain fill, uncertain price:', ['Limit', 'Market', 'Stop-limit', 'None'], 1, ''),
        Q('A triggered stop becomes:', ['Limit', 'Market', 'Cancelled', 'ATC'], 1, ''),
        Q('Stop-limit risk:', ['Unlimited slippage', 'No fill on a gap', 'None', 'Bad fills'], 1, ''),
        Q('Survivorship bias makes backtests:', ['Worse', 'Better than reality', 'Unaffected', 'Random'], 1, ''),
        Q('OTC markets:', ['More transparent', 'Bilateral, counterparty risk', 'No prices', 'Stocks only'], 1, ''),
        Q('Spot FX volume is limited because:', ['Nobody trades', 'The market is decentralised', 'Law', 'Fixed prices'], 1, ''),
        Q('Low liquidity leads to:', ['Tight spreads', 'Wide spreads and slippage', 'Nothing', 'Fixed prices'], 1, '')
      ]
    }
  };

  /* ================= LESSON 18 ================= */
  C.lessons['l1-18'] = {
    vi: {
      goals: ['Hiểu bản chất cổ phiếu phổ thông và ưu đãi.', 'Nắm các sự kiện doanh nghiệp ảnh hưởng đến giá: chia tách, cổ tức, quyền mua.', 'Hiểu bán khống, ký quỹ và các hạn chế.', 'Liên hệ với đặc thù thị trường cổ phiếu Việt Nam.'],
      body: () => `
<h3>1. Cổ phiếu là gì?</h3>
<p>Cổ phiếu là chứng nhận <b>quyền sở hữu</b> một phần công ty. <b>Cổ phiếu phổ thông</b> có quyền biểu quyết và hưởng phần còn lại sau mọi nghĩa vụ: rủi ro cao, tiềm năng không giới hạn. <b>Cổ phiếu ưu đãi</b> thường nhận cổ tức cố định và được ưu tiên khi thanh lý, nhưng ít hoặc không có quyền biểu quyết; giá của nó hành xử gần giống trái phiếu.</p>
<h3>2. Sự kiện doanh nghiệp</h3>
<table class="tbl"><thead><tr><th>Sự kiện</th><th>Ảnh hưởng tới giá</th><th>Xử lý dữ liệu</th></tr></thead><tbody>
<tr><td><b>Chia tách (split) 2:1</b></td><td>Giá giảm còn ~1/2, số cổ phiếu gấp đôi; giá trị không đổi</td><td>Chia toàn bộ giá quá khứ cho 2</td></tr>
<tr><td><b>Cổ tức tiền mặt</b></td><td>Giá điều chỉnh giảm bằng cổ tức vào ngày giao dịch không hưởng quyền</td><td>Điều chỉnh theo tỷ lệ (tuỳ nguồn)</td></tr>
<tr><td><b>Cổ tức cổ phiếu / thưởng</b></td><td>Giống chia tách theo tỷ lệ</td><td>Điều chỉnh theo tỷ lệ</td></tr>
<tr><td><b>Phát hành quyền mua</b></td><td>Giá điều chỉnh theo giá phát hành và tỷ lệ</td><td>Điều chỉnh theo công thức</td></tr></tbody></table>
<p>Nếu dùng dữ liệu không điều chỉnh, các "khoảng trống" giả sẽ kích hoạt tín hiệu sai (thủng hỗ trợ, cắt MA…).</p>
<h3>3. Bán khống và ký quỹ</h3>
<ul><li><b>Bán khống</b>: vay cổ phiếu để bán, kỳ vọng mua lại giá thấp hơn. Lỗ về lý thuyết là không giới hạn. Người bán khống phải trả chi phí vay và cổ tức (nếu có). Khi nhiều người bán khống buộc phải mua lại cùng lúc, giá có thể tăng vọt (<b>short squeeze</b>).</li>
<li><b>Short interest</b> (khối lượng bán khống chưa đóng) và <b>days to cover</b> là chỉ báo tâm lý (Phần V).</li>
<li><b>Ký quỹ (margin)</b>: vay tiền để mua, khuếch đại cả lãi và lỗ. Khi tài sản giảm dưới ngưỡng, công ty chứng khoán sẽ <b>gọi ký quỹ</b> hoặc bán giải chấp, có thể tạo các đợt bán tháo dây chuyền.</li></ul>
<h3>4. Phân ngành và luân chuyển</h3>
<p>Cổ phiếu được nhóm theo ngành (chuẩn GICS hoặc ICB). Ngành phản ứng khác nhau với chu kỳ kinh tế: phòng thủ (tiện ích, tiêu dùng thiết yếu) và chu kỳ (nguyên vật liệu, tài chính, công nghiệp). Theo dõi <b>sức mạnh tương đối của ngành</b> là một bước quan trọng (Bài 41, và bước 2 của Wyckoff).</p>
<h3>5. Đặc thù Việt Nam</h3>
<ul><li>Ba sàn HOSE, HNX, UPCoM với biên độ giá ngày ±7%, ±10%, ±15%. Lô giao dịch 100 cổ phiếu (HOSE).</li>
<li>Chu kỳ thanh toán T+2: cổ phiếu mua về tài khoản sau 2 ngày làm việc.</li>
<li>Bán khống cổ phiếu cơ sở hiện chưa được phép rộng rãi. Muốn đi theo chiều giảm thì dùng phái sinh VN30F.</li>
<li>Giao dịch ký quỹ (margin) phổ biến, nên các đợt <b>call margin</b> có thể khuếch đại nhịp giảm.</li>
<li>Room khối ngoại: một số mã hết room có thể giao dịch với mức chênh lệch đặc thù.</li></ul>`,
      keys: ['Cổ phiếu phổ thông: biểu quyết, rủi ro cao; ưu đãi: cổ tức cố định, giống trái phiếu.', 'Chia tách, cổ tức, quyền mua cần điều chỉnh dữ liệu giá quá khứ.', 'Bán khống: lỗ lý thuyết không giới hạn; short squeeze; short interest là chỉ báo tâm lý.', 'Ký quỹ khuếch đại lãi/lỗ; call margin gây bán tháo dây chuyền.', 'VN: biên độ ±7/10/15%, T+2, chưa bán khống cơ sở, margin phổ biến.'],
      terms: [['Common / Preferred stock', 'Cổ phiếu phổ thông / ưu đãi'], ['Stock split', 'Chia tách cổ phiếu'], ['Ex-dividend date', 'Ngày giao dịch không hưởng quyền'], ['Short selling / Short squeeze', 'Bán khống / ép mua lại'], ['Margin call', 'Gọi ký quỹ'], ['Short interest', 'Khối lượng bán khống chưa đóng']],
      quiz: [
        Q('Sau chia tách 2:1, cổ phiếu giá 80 sẽ có giá khoảng:', ['160', '80', '40', '20'], 2, 'Giá trị không đổi, số cổ phiếu gấp đôi.'),
        Q('Không điều chỉnh dữ liệu sau chia tách sẽ gây:', ['Không ảnh hưởng', 'Khoảng trống giả và tín hiệu sai', 'Tăng khối lượng thật', 'Giảm biến động'], 1, 'Biểu đồ xuất hiện "cú rơi" giả.'),
        Q('Rủi ro lớn nhất của bán khống là:', ['Lỗ giới hạn ở 100%', 'Lỗ về lý thuyết không giới hạn', 'Không có rủi ro', 'Chỉ mất phí'], 1, 'Giá có thể tăng không giới hạn.'),
        Q('Short squeeze xảy ra khi:', ['Người bán khống buộc phải mua lại cùng lúc, đẩy giá tăng vọt', 'Cổ tức tăng', 'Chia tách', 'Thanh khoản giảm'], 0, 'Lực mua cưỡng bức.'),
        Q('Giao dịch ký quỹ có tác động:', ['Giảm rủi ro', 'Khuếch đại cả lãi và lỗ', 'Không ảnh hưởng', 'Chỉ khuếch đại lãi'], 1, 'Đòn bẩy hai chiều.'),
        Q('Cổ phiếu ưu đãi có giá hành xử gần giống:', ['Hợp đồng tương lai', 'Trái phiếu', 'Tiền điện tử', 'Quyền chọn'], 1, 'Do cổ tức cố định.'),
        Q('Biên độ giá ngày trên HOSE là:', ['±5%', '±7%', '±10%', '±15%'], 1, 'HNX ±10%, UPCoM ±15%.'),
        Q('Ngành phòng thủ thường gồm:', ['Nguyên vật liệu', 'Tiện ích và tiêu dùng thiết yếu', 'Chứng khoán', 'Bất động sản đầu cơ'], 1, 'Nhu cầu ổn định qua chu kỳ.')
      ]
    },
    en: {
      goals: ['Understand common and preferred stock.', 'Know corporate actions.', 'Understand short selling and margin.', 'Relate to Vietnam.'],
      body: () => `
<h3>1. Stocks</h3><p>Common stock = ownership and votes, residual claim; preferred = fixed dividends and priority, bond-like.</p>
<h3>2. Corporate actions</h3><table class="tbl"><tbody><tr><td>2:1 split</td><td>Price halves; adjust history</td></tr><tr><td>Cash dividend</td><td>Price drops by the dividend on the ex-date</td></tr><tr><td>Stock dividend</td><td>Like a split</td></tr><tr><td>Rights issue</td><td>Formula adjustment</td></tr></tbody></table><p>Unadjusted data creates false gaps and signals.</p>
<h3>3. Shorting and margin</h3><ul><li>Short selling: unlimited theoretical loss; borrow costs; short squeezes.</li><li>Short interest and days to cover are sentiment tools.</li><li>Margin amplifies gains and losses; margin calls can cascade.</li></ul>
<h3>4. Sectors</h3><p>GICS/ICB sectors; defensive vs cyclical; sector relative strength matters.</p>
<h3>5. Vietnam</h3><ul><li>HOSE/HNX/UPCoM limits ±7/10/15%; 100-share lots.</li><li>T+2 settlement.</li><li>No broad cash-stock shorting — use VN30F.</li><li>Widespread margin; foreign-room effects.</li></ul>`,
      keys: ['Common vs preferred.', 'Adjust for splits, dividends, rights.', 'Shorting: unlimited loss, squeezes, short interest.', 'Margin amplifies; margin calls cascade.', 'Vietnam: limits, T+2, no shorting, margin.'],
      terms: [['Ex-dividend', 'Date without dividend right'], ['Short squeeze', 'Forced short covering'], ['Margin call', 'Demand for more collateral']],
      quiz: [
        Q('After a 2:1 split an 80 stock trades near:', ['160', '80', '40', '20'], 2, ''),
        Q('Unadjusted split data causes:', ['Nothing', 'False gaps and signals', 'Real volume', 'Lower volatility'], 1, ''),
        Q('Biggest short-selling risk:', ['Loss capped at 100%', 'Unlimited theoretical loss', 'None', 'Fees only'], 1, ''),
        Q('A short squeeze is:', ['Forced covering spiking price', 'Higher dividends', 'A split', 'Lower liquidity'], 0, ''),
        Q('Margin trading:', ['Reduces risk', 'Amplifies gains and losses', 'No effect', 'Amplifies gains only'], 1, ''),
        Q('Preferred stock behaves like:', ['Futures', 'Bonds', 'Crypto', 'Options'], 1, ''),
        Q('HOSE daily limit:', ['±5%', '±7%', '±10%', '±15%'], 1, ''),
        Q('Defensive sectors include:', ['Materials', 'Utilities and staples', 'Brokers', 'Speculative property'], 1, '')
      ]
    }
  };

  /* ================= LESSON 19 ================= */
  C.lessons['l1-19'] = {
    vi: {
      goals: ['Hiểu chỉ số là gì và vai trò của nó.', 'Phân biệt các phương pháp tính: trọng số giá, vốn hoá, vốn hoá tự do chuyển nhượng, bằng nhau.', 'Hiểu ước số (divisor), tái cơ cấu và chỉ số tổng lợi nhuận.', 'Nhận biết hạn chế khi phân tích kỹ thuật trên chỉ số.'],
      body: () => `
<h3>1. Chỉ số là gì?</h3>
<p>Chỉ số là con số đại diện cho giá trị của một <b>rổ tài sản</b>. Nó dùng để đo "thị trường chung", làm chuẩn so sánh (benchmark) và làm cơ sở cho sản phẩm (ETF, hợp đồng tương lai). Với nhà PTKT, chỉ số là công cụ cho <b>bước 1 của Wyckoff</b>: xác định xu hướng thị trường chung.</p>
<h3>2. Phương pháp tính</h3>
<table class="tbl"><thead><tr><th>Phương pháp</th><th>Công thức ý tưởng</th><th>Đặc điểm</th><th>Ví dụ</th></tr></thead><tbody>
<tr><td><b>Trọng số giá</b></td><td>Tổng giá các mã ÷ ước số</td><td>Mã giá cao chi phối, bất kể quy mô công ty</td><td>Dow Jones Industrial, Nikkei 225</td></tr>
<tr><td><b>Trọng số vốn hoá</b></td><td>Tổng (giá × số CP lưu hành) ÷ ước số</td><td>Công ty lớn chi phối</td><td>S&P 500, VNINDEX</td></tr>
<tr><td><b>Vốn hoá tự do chuyển nhượng (free float)</b></td><td>Chỉ tính phần cổ phiếu thực sự giao dịch được</td><td>Phản ánh tốt hơn khả năng đầu tư; thường kèm giới hạn tỷ trọng tối đa</td><td>VN30, MSCI</td></tr>
<tr><td><b>Trọng số bằng nhau</b></td><td>Mỗi mã cùng tỷ trọng (tái cân bằng định kỳ)</td><td>Phản ánh "cổ phiếu trung bình" và độ rộng tốt hơn</td><td>S&P 500 Equal Weight</td></tr></tbody></table>
${C.demoHtml.indexCalc()}
<h3>3. Ước số, tái cơ cấu và tổng lợi nhuận</h3>
<ul><li><b>Ước số (divisor)</b> được điều chỉnh khi có chia tách, thay đổi thành phần… để chỉ số không "nhảy" vì lý do kỹ thuật.</li>
<li><b>Tái cơ cấu</b>: định kỳ thêm hoặc bớt mã. Mã yếu bị loại, mã mạnh được thêm, nên chỉ số mang sẵn một chút <b>thiên lệch sống sót</b>.</li>
<li><b>Chỉ số giá</b> và <b>chỉ số tổng lợi nhuận</b>: chỉ số tổng lợi nhuận tái đầu tư cổ tức, nên dài hạn cao hơn đáng kể so với chỉ số giá.</li></ul>
<h3>4. Lưu ý cho nhà PTKT</h3>
<ul><li>Chỉ số vốn hoá có thể tăng nhờ vài mã lớn trong khi đa số giảm. Hãy dùng <b>độ rộng</b> (Bài 14) và chỉ số trọng số bằng nhau để kiểm tra.</li>
<li>Chỉ số không giao dịch trực tiếp; khối lượng của chỉ số là tổng khối lượng thành phần, có thể bị chi phối bởi vài mã.</li>
<li>So sánh nhiều chỉ số (vốn hoá lớn và nhỏ, các ngành) để thấy <b>luân chuyển dòng tiền</b>.</li>
<li>Việt Nam: VNINDEX (toàn sàn HOSE, vốn hoá), VN30 (30 mã lớn, free float, có giới hạn tỷ trọng), HNX-Index, UPCoM-Index, cùng các chỉ số ngành và VNMidcap, VNSmallcap.</li></ul>`,
      keys: ['Chỉ số đại diện cho rổ tài sản: đo thị trường chung, benchmark, cơ sở sản phẩm.', 'Trọng số giá: mã giá cao chi phối; vốn hoá: công ty lớn chi phối; free float: phần giao dịch được; bằng nhau: "cổ phiếu trung bình".', 'Ước số điều chỉnh khi chia tách/thay thành phần; tái cơ cấu tạo thiên lệch sống sót.', 'Chỉ số tổng lợi nhuận gồm cổ tức tái đầu tư.', 'Kiểm tra chỉ số vốn hoá bằng độ rộng và chỉ số bằng trọng số.'],
      terms: [['Price-weighted', 'Trọng số giá'], ['Cap-weighted', 'Trọng số vốn hoá'], ['Free float', 'Cổ phiếu tự do chuyển nhượng'], ['Equal-weighted', 'Trọng số bằng nhau'], ['Divisor', 'Ước số'], ['Total return index', 'Chỉ số tổng lợi nhuận'], ['Benchmark', 'Chuẩn so sánh']],
      quiz: [
        Q('Trong chỉ số trọng số giá, mã nào ảnh hưởng nhiều nhất?', ['Mã có vốn hoá lớn nhất', 'Mã có giá cao nhất', 'Mã có khối lượng lớn nhất', 'Như nhau'], 1, 'Giá cao thì đóng góp lớn, bất kể quy mô.'),
        Q('VNINDEX được tính theo phương pháp:', ['Trọng số giá', 'Trọng số vốn hoá', 'Trọng số bằng nhau', 'Ngẫu nhiên'], 1, 'Công ty lớn chi phối.'),
        Q('Mục đích của điều chỉnh ước số là:', ['Tăng chỉ số', 'Giữ chỉ số không nhảy do sự kiện kỹ thuật (chia tách, thay thành phần)', 'Tính cổ tức', 'Giảm biến động'], 1, 'Đảm bảo tính liên tục.'),
        Q('Chỉ số tổng lợi nhuận khác chỉ số giá ở chỗ:', ['Không tính cổ tức', 'Tái đầu tư cổ tức', 'Chỉ gồm trái phiếu', 'Không đổi'], 1, 'Dài hạn cao hơn đáng kể.'),
        Q('Chỉ số vốn hoá tăng mạnh trong khi đa số cổ phiếu giảm. Cần kiểm tra:', ['Độ rộng thị trường', 'Lãi suất', 'Tỷ giá', 'Không cần'], 0, 'Vài mã lớn có thể kéo chỉ số.'),
        Q('Tái cơ cấu chỉ số tạo ra thiên lệch gì?', ['Thiên lệch sống sót', 'Thiên lệch xác nhận', 'Thiên lệch neo', 'Không có'], 0, 'Mã yếu bị loại, mã mạnh được thêm.'),
        Q('Chỉ số free float có ưu điểm:', ['Tính cả cổ phiếu không giao dịch được', 'Phản ánh phần cổ phiếu thực sự giao dịch được', 'Bỏ qua giá', 'Không thay đổi'], 1, 'Loại bỏ cổ phần nhà nước, cổ đông chiến lược nắm giữ dài hạn…'),
        Q('Chỉ số trọng số bằng nhau phản ánh tốt hơn:', ['Công ty lớn nhất', '"Cổ phiếu trung bình" và độ rộng', 'Giá vàng', 'Lãi suất'], 1, 'Mỗi mã cùng tỷ trọng.')
      ]
    },
    en: {
      goals: ['Understand indexes.', 'Compare weighting methods.', 'Know divisors, reconstitution, total return.', 'Know index limitations for TA.'],
      body: () => `
<h3>1. Indexes</h3><p>A number representing a basket: market gauge, benchmark, product base — and Wyckoff step 1.</p>
<h3>2. Weighting</h3><table class="tbl"><tbody><tr><td>Price-weighted</td><td>High-priced shares dominate (Dow, Nikkei)</td></tr><tr><td>Cap-weighted</td><td>Large companies dominate (S&P 500, VNINDEX)</td></tr><tr><td>Free-float</td><td>Only tradable shares; often capped (VN30, MSCI)</td></tr><tr><td>Equal-weighted</td><td>The "average stock"</td></tr></tbody></table>${C.demoHtml.indexCalc()}
<h3>3. Mechanics</h3><ul><li>Divisor adjustments keep continuity.</li><li>Reconstitution adds survivorship bias.</li><li>Total-return indexes reinvest dividends.</li></ul>
<h3>4. For technicians</h3><ul><li>Check cap-weighted indexes with breadth and equal-weight versions.</li><li>Index volume can be dominated by a few names.</li><li>Compare indexes for rotation.</li><li>Vietnam: VNINDEX, VN30, HNX, UPCoM, sector and size indexes.</li></ul>`,
      keys: ['Indexes gauge markets and anchor products.', 'Price, cap, free-float, equal weighting.', 'Divisors, reconstitution bias, total return.', 'Verify with breadth.'],
      terms: [['Divisor', 'Continuity factor'], ['Free float', 'Tradable shares'], ['Total return', 'Includes reinvested dividends']],
      quiz: [
        Q('In a price-weighted index the biggest influence is:', ['Largest cap', 'Highest price', 'Most volume', 'Equal'], 1, ''),
        Q('VNINDEX is:', ['Price-weighted', 'Cap-weighted', 'Equal-weighted', 'Random'], 1, ''),
        Q('Divisor adjustments:', ['Raise the index', 'Prevent technical jumps', 'Compute dividends', 'Cut volatility'], 1, ''),
        Q('Total-return indexes:', ['Exclude dividends', 'Reinvest dividends', 'Bonds only', 'Constant'], 1, ''),
        Q('Cap index up, most stocks down — check:', ['Breadth', 'Rates', 'FX', 'Nothing'], 0, ''),
        Q('Reconstitution creates:', ['Survivorship bias', 'Confirmation bias', 'Anchoring', 'None'], 0, ''),
        Q('Free-float indexes reflect:', ['Untradable shares', 'Shares actually tradable', 'No price', 'Nothing'], 1, ''),
        Q('Equal weighting reflects:', ['The largest firm', 'The average stock and breadth', 'Gold', 'Rates'], 1, '')
      ]
    }
  };

  /* ================= LESSON 20 ================= */
  C.lessons['l1-20'] = {
    vi: {
      goals: ['Hiểu quan hệ nghịch giữa giá trái phiếu và lợi suất.', 'Nắm các khái niệm coupon, kỳ hạn, duration, rủi ro tín dụng.', 'Đọc đường cong lợi suất và ý nghĩa kinh tế.', 'Liên hệ thị trường trái phiếu với cổ phiếu và hàng hoá.'],
      body: () => `
<h3>1. Trái phiếu cơ bản</h3>
<p>Trái phiếu là khoản vay: người mua cho tổ chức phát hành vay, nhận <b>lãi coupon</b> định kỳ và <b>mệnh giá</b> khi đáo hạn. Giá trái phiếu là giá trị hiện tại của các dòng tiền đó, chiết khấu theo <b>lợi suất thị trường</b>.</p>
<div class="callout"><b>Quy luật cốt lõi</b>: giá trái phiếu và lợi suất <b>đi ngược chiều</b>. Lãi suất thị trường tăng thì trái phiếu cũ (coupon thấp hơn) kém hấp dẫn, nên giá giảm.</div>
${C.demoHtml.bondCalc()}
<h3>2. Các yếu tố rủi ro</h3>
<ul><li><b>Rủi ro lãi suất</b>: đo bằng <b>duration</b>, tức độ nhạy của giá với thay đổi lợi suất (≈ % thay đổi giá khi lợi suất thay đổi 1%). Kỳ hạn dài, coupon thấp thì duration cao và rủi ro cao.</li>
<li><b>Rủi ro tín dụng</b>: khả năng tổ chức phát hành vỡ nợ. Phản ánh qua <b>chênh lệch tín dụng (credit spread)</b> so với trái phiếu chính phủ. Spread mở rộng là dấu hiệu lo ngại rủi ro (risk-off).</li>
<li><b>Rủi ro lạm phát</b>: lạm phát bào mòn giá trị thực của coupon.</li></ul>
<h3>3. Đường cong lợi suất</h3>
<p>Là đồ thị lợi suất theo kỳ hạn (thường của trái phiếu chính phủ).</p>
${fg.curves('vi')}
<ul><li><b>Bình thường (dốc lên)</b>: kỳ hạn dài lợi suất cao hơn. Kinh tế được kỳ vọng tăng trưởng.</li>
<li><b>Phẳng</b>: giai đoạn chuyển tiếp, thường khi ngân hàng trung ương thắt chặt.</li>
<li><b>Đảo ngược</b>: lợi suất ngắn hạn cao hơn dài hạn. Trong lịch sử, đây thường là dấu hiệu sớm của suy thoái.</li></ul>
<h3>4. Liên thị trường (giới thiệu)</h3>
<p>Theo mô hình kinh điển của phân tích liên thị trường (học kỹ ở Level 2–3): trái phiếu thường đổi chiều <b>trước</b> cổ phiếu, và cổ phiếu đổi chiều trước hàng hoá trong chu kỳ kinh doanh. Lãi suất giảm (giá trái phiếu tăng) thường hỗ trợ cổ phiếu. Tuy vậy, quan hệ này có thể đảo trong một số giai đoạn, ví dụ khi lạm phát cao.</p>
<h3>5. PTKT trên trái phiếu</h3>
<p>Các công cụ PTKT áp dụng được trên <b>giá</b> hợp đồng tương lai trái phiếu hoặc trên <b>lợi suất</b>. Lưu ý chiều ngược nhau: xu hướng tăng của lợi suất tương ứng với xu hướng giảm của giá trái phiếu.</p>`,
      keys: ['Giá trái phiếu = giá trị hiện tại của coupon + mệnh giá; giá và lợi suất đi ngược chiều.', 'Duration đo độ nhạy lãi suất; kỳ hạn dài, coupon thấp → nhạy hơn.', 'Credit spread mở rộng = lo ngại rủi ro.', 'Đường cong lợi suất: bình thường, phẳng, đảo ngược (thường báo trước suy thoái).', 'Trái phiếu thường đổi chiều trước cổ phiếu trong chu kỳ kinh tế.'],
      terms: [['Coupon', 'Lãi định kỳ'], ['Par / Face value', 'Mệnh giá'], ['Yield', 'Lợi suất'], ['Duration', 'Thời lượng — độ nhạy lãi suất'], ['Credit spread', 'Chênh lệch tín dụng'], ['Yield curve', 'Đường cong lợi suất'], ['Inverted curve', 'Đường cong đảo ngược']],
      quiz: [
        Q('Khi lợi suất thị trường tăng, giá trái phiếu đang lưu hành:', ['Tăng', 'Giảm', 'Không đổi', 'Bằng mệnh giá'], 1, 'Quan hệ nghịch.'),
        Q('Trái phiếu nào nhạy nhất với lãi suất?', ['Kỳ hạn ngắn, coupon cao', 'Kỳ hạn dài, coupon thấp', 'Kỳ hạn ngắn, coupon thấp', 'Như nhau'], 1, 'Duration cao nhất.'),
        Q('Duration 7 năm, lợi suất tăng 1%. Giá thay đổi khoảng:', ['+7%', '−7%', '−1%', '0%'], 1, 'Xấp xỉ −duration × Δlợi suất.'),
        Q('Đường cong lợi suất đảo ngược thường được xem là:', ['Dấu hiệu tăng trưởng mạnh', 'Dấu hiệu sớm của suy thoái', 'Không có ý nghĩa', 'Dấu hiệu lạm phát thấp'], 1, 'Lịch sử cho thấy mối liên hệ này.'),
        Q('Credit spread mở rộng phản ánh:', ['Tâm lý chấp nhận rủi ro', 'Lo ngại rủi ro tín dụng (risk-off)', 'Lãi suất giảm', 'Không gì'], 1, 'Nhà đầu tư đòi bù rủi ro cao hơn.'),
        Q('Trong mô hình liên thị trường kinh điển, thị trường nào thường đổi chiều sớm nhất?', ['Hàng hoá', 'Trái phiếu', 'Cổ phiếu', 'Bất động sản'], 1, 'Trái phiếu → cổ phiếu → hàng hoá.'),
        Q('Xu hướng tăng của lợi suất tương ứng với:', ['Xu hướng tăng giá trái phiếu', 'Xu hướng giảm giá trái phiếu', 'Không liên quan', 'Giá cổ phiếu tăng chắc chắn'], 1, 'Nhớ chiều ngược nhau khi phân tích.'),
        Q('Đường cong lợi suất bình thường có dạng:', ['Dốc xuống', 'Dốc lên — kỳ hạn dài lợi suất cao hơn', 'Phẳng tuyệt đối', 'Hình chữ U'], 1, 'Bù cho rủi ro thời gian.')
      ]
    },
    en: {
      goals: ['Understand the price–yield relationship.', 'Know coupon, maturity, duration, credit risk.', 'Read the yield curve.', 'Link bonds with stocks and commodities.'],
      body: () => `
<h3>1. Basics</h3><p>A bond pays coupons and par; its price is the present value at the market yield. <b>Price and yield move inversely.</b></p>${C.demoHtml.bondCalc()}
<h3>2. Risks</h3><ul><li>Interest-rate risk — <b>duration</b> (≈ % price change per 1% yield change).</li><li>Credit risk — <b>credit spreads</b>; widening = risk-off.</li><li>Inflation risk.</li></ul>
<h3>3. Yield curve</h3>${fg.curves('en')}<ul><li>Normal — growth expected.</li><li>Flat — transition, tightening.</li><li>Inverted — historically an early recession warning.</li></ul>
<h3>4. Intermarket</h3><p>Classically bonds turn before stocks, and stocks before commodities; falling rates usually support stocks, though relationships can flip (e.g. high inflation).</p>
<h3>5. TA on bonds</h3><p>Apply tools to futures prices or yields — remembering they move inversely.</p>`,
      keys: ['Price and yield move inversely.', 'Duration measures rate sensitivity.', 'Widening credit spreads = risk-off.', 'Normal, flat, inverted curves.', 'Bonds often turn before stocks.'],
      terms: [['Duration', 'Rate sensitivity'], ['Credit spread', 'Yield premium over government bonds'], ['Inverted curve', 'Short yields above long']],
      quiz: [
        Q('When yields rise, existing bond prices:', ['Rise', 'Fall', 'Stay', 'Equal par'], 1, ''),
        Q('Most rate-sensitive:', ['Short, high coupon', 'Long, low coupon', 'Short, low coupon', 'Equal'], 1, ''),
        Q('Duration 7, yields +1% → price ≈', ['+7%', '−7%', '−1%', '0%'], 1, ''),
        Q('An inverted curve is seen as:', ['Strong growth', 'An early recession warning', 'Meaningless', 'Low inflation'], 1, ''),
        Q('Widening credit spreads:', ['Risk-on', 'Risk-off', 'Falling rates', 'Nothing'], 1, ''),
        Q('Classically the earliest to turn:', ['Commodities', 'Bonds', 'Stocks', 'Property'], 1, ''),
        Q('A rising yield trend means bond prices are:', ['Rising', 'Falling', 'Unrelated', 'Certainly up for stocks'], 1, ''),
        Q('A normal curve slopes:', ['Down', 'Up', 'Flat', 'U-shaped'], 1, '')
      ]
    }
  };

  /* ================= LESSON 21 ================= */
  C.lessons['l1-21'] = {
    vi: {
      goals: ['Hiểu hợp đồng tương lai: thông số, ký quỹ, đánh giá theo thị trường hằng ngày.', 'Tính đòn bẩy và tác động lãi/lỗ.', 'Nắm khái niệm đáo hạn, chuyển hợp đồng, chuỗi liên tục.', 'Hiểu basis, contango/backwardation và báo cáo COT.', 'Liên hệ với hợp đồng VN30F.'],
      body: () => `
<h3>1. Hợp đồng tương lai là gì?</h3>
<p>Là thoả thuận <b>chuẩn hoá</b>, giao dịch trên sàn, để mua hoặc bán một tài sản cơ sở với giá xác định vào một ngày trong tương lai. Các thông số chuẩn gồm: tài sản cơ sở, quy mô hợp đồng (hệ số nhân), bước giá, tháng đáo hạn, phương thức thanh toán (giao vật chất hoặc tiền mặt).</p>
<h3>2. Ký quỹ và đánh giá theo thị trường</h3>
<ul><li><b>Ký quỹ ban đầu (initial margin)</b>: tiền đặt cọc để mở vị thế, chỉ bằng một phần nhỏ giá trị danh nghĩa, tạo ra <b>đòn bẩy</b>.</li>
<li><b>Ký quỹ duy trì (maintenance margin)</b>: mức tối thiểu phải duy trì. Dưới mức này thì bị gọi ký quỹ bổ sung.</li>
<li><b>Mark-to-market</b>: lãi/lỗ được ghi nhận <b>hằng ngày</b> theo giá thanh toán cuối ngày.</li></ul>
${C.demoHtml.futCalc()}
<h3>3. Đáo hạn và chuỗi liên tục</h3>
<p>Mỗi hợp đồng có ngày đáo hạn, nên nhà giao dịch phải <b>chuyển (roll)</b> sang hợp đồng kỳ hạn kế tiếp. Để phân tích dài hạn, ta ghép thành <b>chuỗi liên tục</b> (Bài 3): ghép theo khối lượng/OI, có hoặc không điều chỉnh chênh lệch giá. Chuỗi điều chỉnh (back-adjusted) giữ đúng biên độ biến động nhưng mức giá quá khứ không còn là giá thật, có khi còn âm.</p>
<h3>4. Basis, contango, backwardation</h3>
<p><b>Basis</b> = giá giao ngay − giá tương lai. Về đáo hạn, giá tương lai hội tụ về giá giao ngay.</p>
${fg.term('vi')}
<ul><li><b>Contango</b>: kỳ hạn xa giá cao hơn (chi phí lưu kho, lãi vốn). Trạng thái thường gặp.</li>
<li><b>Backwardation</b>: kỳ hạn gần giá cao hơn, cho thấy nguồn cung khan hiếm và nhu cầu tức thời cao. Thường là dấu hiệu thị trường mạnh.</li></ul>
<h3>5. Báo cáo COT (Commitments of Traders)</h3>
<p>Ở Mỹ, cơ quan quản lý công bố hằng tuần vị thế của các nhóm: <b>commercials</b> (nhà phòng ngừa rủi ro, thường giao dịch ngược xu hướng và được coi là "tiền thông minh" ở cực trị), <b>large speculators</b> (quỹ, thường theo xu hướng) và <b>small traders</b>. Vị thế cực đoan của các nhóm là chỉ báo tâm lý (Phần V).</p>
<h3>6. VN30F — phái sinh chỉ số Việt Nam</h3>
<ul><li>Tài sản cơ sở là chỉ số VN30; hệ số nhân 100.000đ/điểm; thanh toán bằng tiền mặt.</li>
<li>Đáo hạn vào ngày thứ Năm thứ ba của tháng đáo hạn. Có các mã tháng gần (VN30F1M), tháng kế (VN30F2M) và các quý.</li>
<li>Giao dịch T+0, được mở vị thế bán, là công cụ chính để đi theo chiều giảm và phòng ngừa danh mục.</li>
<li>Basis VN30F so với VN30 phản ánh tâm lý: chênh âm sâu thường cho thấy bi quan.</li></ul>`,
      keys: ['Hợp đồng tương lai chuẩn hoá, giao dịch trên sàn, có đáo hạn.', 'Ký quỹ ban đầu tạo đòn bẩy; ký quỹ duy trì; lãi/lỗ ghi nhận hằng ngày (mark-to-market).', 'Phải roll hợp đồng; chuỗi liên tục có nhiều cách ghép.', 'Basis = giao ngay − tương lai; contango (xa cao hơn), backwardation (gần cao hơn, thường là dấu hiệu mạnh).', 'COT: commercials, large specs, small traders — vị thế cực đoan là chỉ báo tâm lý.', 'VN30F: 100.000đ/điểm, T+0, bán khống được, đáo hạn thứ Năm thứ ba.'],
      terms: [['Initial / Maintenance margin', 'Ký quỹ ban đầu / duy trì'], ['Mark-to-market', 'Đánh giá theo thị trường hằng ngày'], ['Roll', 'Chuyển sang hợp đồng kỳ hạn sau'], ['Basis', 'Chênh lệch giao ngay − tương lai'], ['Contango / Backwardation', 'Cấu trúc kỳ hạn thuận / nghịch'], ['COT report', 'Báo cáo vị thế nhà giao dịch']],
      quiz: [
        Q('Ký quỹ ban đầu 15% giá trị danh nghĩa tương ứng đòn bẩy khoảng:', ['1.5x', '6.7x', '15x', '100x'], 1, '1 / 0.15 ≈ 6.7.'),
        Q('Mark-to-market nghĩa là:', ['Lãi/lỗ chỉ tính khi đóng vị thế', 'Lãi/lỗ được ghi nhận hằng ngày theo giá thanh toán', 'Không có lãi/lỗ', 'Tính theo giá mở cửa'], 1, 'Tài khoản được cập nhật mỗi ngày.'),
        Q('Contango là khi:', ['Kỳ hạn gần giá cao hơn', 'Kỳ hạn xa giá cao hơn', 'Mọi kỳ hạn bằng giá', 'Không có hợp đồng xa'], 1, 'Phản ánh chi phí lưu kho, lãi vốn.'),
        Q('Backwardation thường cho thấy:', ['Nguồn cung dồi dào', 'Khan hiếm, nhu cầu tức thời cao — thị trường mạnh', 'Không có giao dịch', 'Lãi suất âm'], 1, 'Người mua chấp nhận trả cao để có hàng ngay.'),
        Q('VN30F có hệ số nhân:', ['10.000đ/điểm', '100.000đ/điểm', '1.000.000đ/điểm', '1đ/điểm'], 1, 'Mỗi điểm biến động = 100.000đ/hợp đồng.'),
        Q('Nhóm nào trong báo cáo COT thường được coi là "tiền thông minh" ở vùng cực trị?', ['Small traders', 'Commercials', 'Large speculators', 'Không nhóm nào'], 1, 'Họ phòng ngừa rủi ro, thường giao dịch ngược xu hướng.'),
        Q('Nhược điểm của chuỗi liên tục điều chỉnh chênh lệch (back-adjusted) là:', ['Sai biên độ biến động', 'Mức giá quá khứ không còn là giá thật', 'Không dùng được cho PTKT', 'Thiếu khối lượng'], 1, 'Có thể ra giá âm, nhưng giữ đúng biến động.'),
        Q('Vào ngày đáo hạn, giá tương lai:', ['Tách xa giá giao ngay', 'Hội tụ về giá giao ngay', 'Bằng 0', 'Không xác định'], 1, 'Basis tiến về 0.')
      ]
    },
    en: {
      goals: ['Understand futures specs, margin, mark-to-market.', 'Compute leverage.', 'Know expiry, roll, continuous series.', 'Understand basis, contango, backwardation, COT.', 'Relate to VN30F.'],
      body: () => `
<h3>1. Futures</h3><p>Standardised, exchange-traded agreements with set underlying, size, tick, expiry and settlement.</p>
<h3>2. Margin</h3><ul><li>Initial margin — leverage.</li><li>Maintenance margin — margin calls below it.</li><li>Daily mark-to-market.</li></ul>${C.demoHtml.futCalc()}
<h3>3. Expiry and continuity</h3><p>Positions must be rolled; continuous series can be spliced several ways — back-adjusted series keep volatility but not true price levels.</p>
<h3>4. Basis and term structure</h3><p>Basis = spot − futures, converging at expiry.</p>${fg.term('en')}<ul><li>Contango — later months higher (carry).</li><li>Backwardation — nearby higher (scarcity, strength).</li></ul>
<h3>5. COT</h3><p>Weekly positions of commercials (hedgers, "smart money" at extremes), large speculators (trend followers) and small traders.</p>
<h3>6. VN30F</h3><ul><li>Underlying VN30, 100,000 VND per point, cash-settled.</li><li>Expires on the third Thursday; 1M, 2M and quarterly contracts.</li><li>T+0 and shortable.</li><li>Basis reflects sentiment.</li></ul>`,
      keys: ['Standardised contracts with expiry.', 'Margin leverage; daily mark-to-market.', 'Rolling and continuous series.', 'Contango vs backwardation.', 'COT positioning as sentiment.', 'VN30F specifics.'],
      terms: [['Mark-to-market', 'Daily settlement'], ['Roll', 'Moving to the next contract'], ['Backwardation', 'Nearby priced higher']],
      quiz: [
        Q('15% initial margin ≈ leverage of:', ['1.5x', '6.7x', '15x', '100x'], 1, ''),
        Q('Mark-to-market means:', ['P&L only at exit', 'Daily P&L at settlement', 'No P&L', 'Opening prices'], 1, ''),
        Q('Contango:', ['Nearby higher', 'Later months higher', 'All equal', 'No far months'], 1, ''),
        Q('Backwardation suggests:', ['Ample supply', 'Scarcity — strength', 'No trading', 'Negative rates'], 1, ''),
        Q('VN30F multiplier:', ['10,000', '100,000', '1,000,000', '1'], 1, ''),
        Q('"Smart money" in COT:', ['Small traders', 'Commercials', 'Large specs', 'None'], 1, ''),
        Q('Back-adjusted series drawback:', ['Wrong volatility', 'Historical levels are not real prices', 'Unusable for TA', 'No volume'], 1, ''),
        Q('At expiry futures:', ['Diverge', 'Converge to spot', 'Go to zero', 'Undefined'], 1, '')
      ]
    }
  };
})(window.LLW);
