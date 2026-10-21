/* CMT Level 2 — Parts 2–3, lessons 15–22: volatility and behavioural finance. Written by Lai Long Master TA in its own words. */
(function (L) {
  'use strict';
  const C = L.cmt, F = C.fig, H = C.demoHtml;

  /* ---------- Black–Scholes calculator ---------- */
  const ncdf = x => { const t = 1 / (1 + 0.2316419 * Math.abs(x)), d = 0.3989423 * Math.exp(-x * x / 2); const p = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274)))); return x > 0 ? 1 - p : p; };
  const npdf = x => Math.exp(-x * x / 2) / Math.sqrt(2 * Math.PI);
  C.bs = function (S, K, T, r, s) {
    const d1 = (Math.log(S / K) + (r + s * s / 2) * T) / (s * Math.sqrt(T)), d2 = d1 - s * Math.sqrt(T);
    const call = S * ncdf(d1) - K * Math.exp(-r * T) * ncdf(d2), put = call - S + K * Math.exp(-r * T);
    return { call, put, dC: ncdf(d1), dP: ncdf(d1) - 1, gamma: npdf(d1) / (S * s * Math.sqrt(T)), vega: S * npdf(d1) * Math.sqrt(T) / 100,
      thC: (-S * npdf(d1) * s / (2 * Math.sqrt(T)) - r * K * Math.exp(-r * T) * ncdf(d2)) / 365, thP: (-S * npdf(d1) * s / (2 * Math.sqrt(T)) + r * K * Math.exp(-r * T) * ncdf(-d2)) / 365 };
  };
  H.bsCalc = () => C.calcShell('bsCalc', `${C.num('s', 100, 'S', 1)}${C.num('k', 100, 'K', 1)}${C.num('d', 30, L.T('Ngày', 'Days'), 1)}${C.num('v', 25, 'IV %', 1)}${C.num('r', 4, 'r %', 0.5)}`,
    L.T('Mô hình Black–Scholes (quyền chọn kiểu châu Âu, không cổ tức). Đổi từng tham số để thấy phí và Greeks thay đổi.', 'Black–Scholes (European, no dividends). Change inputs to see premiums and Greeks move.'));
  C.demoRun.bsCalc = box => {
    const run = () => {
      const g = c => +box.querySelector('.' + c).value;
      const T = Math.max(1, g('d')) / 365, r = C.bs(g('s'), g('k'), T, g('r') / 100, Math.max(0.01, g('v') / 100));
      const f = x => x.toFixed(3);
      box.querySelector('.demo-out').innerHTML = `<table class="tbl"><thead><tr><th></th><th>Call</th><th>Put</th></tr></thead><tbody>
        <tr><td>${L.T('Phí lý thuyết', 'Theoretical price')}</td><td><b>${f(r.call)}</b></td><td><b>${f(r.put)}</b></td></tr>
        <tr><td>Delta</td><td>${f(r.dC)}</td><td>${f(r.dP)}</td></tr>
        <tr><td>Gamma</td><td colspan="2">${r.gamma.toFixed(4)}</td></tr>
        <tr><td>Vega (${L.T('mỗi 1% IV', 'per 1% IV')})</td><td colspan="2">${f(r.vega)}</td></tr>
        <tr><td>Theta (${L.T('mỗi ngày', 'per day')})</td><td>${f(r.thC)}</td><td>${f(r.thP)}</td></tr></tbody></table>
        <p class="muted">${L.T(`Biến động kỳ vọng 1 ngày ≈ ${(g('s') * g('v') / 100 / Math.sqrt(252)).toFixed(2)} (IV/√252); đến đáo hạn ≈ ±${(g('s') * g('v') / 100 * Math.sqrt(Math.max(1, g('d')) / 365)).toFixed(2)}.`, `1-day expected move ≈ ${(g('s') * g('v') / 100 / Math.sqrt(252)).toFixed(2)}; to expiry ≈ ±${(g('s') * g('v') / 100 * Math.sqrt(Math.max(1, g('d')) / 365)).toFixed(2)}.`)}</p>`;
    };
    box.querySelectorAll('.d-num').forEach(i => { i.oninput = run; });
    run();
  };
  H.vixCalc = () => C.calcShell('vixCalc', `${C.num('vix', 20, 'VIX / IV', 1)}${C.num('px', 1800, L.T('Giá / chỉ số', 'Price / index'), 1)}`);
  C.demoRun.vixCalc = box => {
    const run = () => {
      const v = +box.querySelector('.vix').value / 100, p = +box.querySelector('.px').value;
      const m30 = v / Math.sqrt(12), m1 = v / Math.sqrt(252);
      box.querySelector('.demo-out').innerHTML = L.T(`Biên độ 1σ 30 ngày ≈ ${(m30 * 100).toFixed(2)}% → <b>${(p * (1 - m30)).toFixed(1)} – ${(p * (1 + m30)).toFixed(1)}</b> (≈ 68%). Biên độ 2σ ≈ ${(p * (1 - 2 * m30)).toFixed(1)} – ${(p * (1 + 2 * m30)).toFixed(1)} (≈ 95%). Biên độ 1 ngày ≈ ±${(m1 * 100).toFixed(2)}% (±${(p * m1).toFixed(1)}).`,
        `30-day 1σ ≈ ${(m30 * 100).toFixed(2)}% → <b>${(p * (1 - m30)).toFixed(1)} – ${(p * (1 + m30)).toFixed(1)}</b> (~68%); 2σ ≈ ${(p * (1 - 2 * m30)).toFixed(1)} – ${(p * (1 + 2 * m30)).toFixed(1)}; 1-day ≈ ±${(m1 * 100).toFixed(2)}%.`);
    };
    box.querySelectorAll('.d-num').forEach(i => { i.oninput = run; });
    run();
  };

  /* ================= L2-15 ================= */
  C.addLesson('l2-15', {
    goals: ['Giải thích mục đích của thị trường quyền chọn.', 'Liệt kê các điều khoản chính của hợp đồng quyền chọn.', 'Mô tả các Greeks và cách dùng chúng.', 'Định nghĩa biến động ngụ ý.'],
    body: () => `
<h3>1. Mục đích của thị trường quyền chọn</h3>
<ul><li><b>Phòng ngừa rủi ro</b>: mua put bảo vệ danh mục, giống như mua bảo hiểm.</li>
<li><b>Đòn bẩy có giới hạn rủi ro</b>: người mua chỉ mất phí.</li>
<li><b>Tạo thu nhập</b>: bán call có bảo đảm (covered call) trên cổ phiếu đang nắm giữ.</li>
<li><b>Giao dịch biến động</b>: quyền chọn là công cụ duy nhất cho phép đặt cược trực tiếp vào <b>độ lớn</b> biến động, không chỉ hướng.</li>
<li><b>Khám phá thông tin</b>: giá quyền chọn tiết lộ kỳ vọng biến động và tâm lý (IV, skew, put/call).</li></ul>
<h3>2. Điều khoản hợp đồng</h3>
<table class="tbl"><tbody>
<tr><td>Tài sản cơ sở</td><td>Cổ phiếu, chỉ số, hợp đồng tương lai, tiền tệ…</td></tr>
<tr><td>Loại</td><td>Call (quyền mua) / Put (quyền bán)</td></tr>
<tr><td>Giá thực hiện (strike)</td><td>Mức giá mua/bán khi thực hiện</td></tr>
<tr><td>Ngày đáo hạn</td><td>Thời điểm quyền hết hiệu lực</td></tr>
<tr><td>Kiểu</td><td>Mỹ (thực hiện bất cứ lúc nào) / châu Âu (chỉ khi đáo hạn)</td></tr>
<tr><td>Hệ số nhân / quy mô</td><td>Số đơn vị cơ sở mỗi hợp đồng (ví dụ 100 cổ phiếu)</td></tr>
<tr><td>Phương thức thanh toán</td><td>Giao vật chất hoặc tiền mặt</td></tr>
<tr><td>Phí (premium)</td><td>Giá của quyền chọn = giá trị nội tại + giá trị thời gian</td></tr></tbody></table>
<h3>3. Các Greeks</h3>
<table class="tbl"><thead><tr><th>Greek</th><th>Đo độ nhạy của phí với</th><th>Đặc điểm</th></tr></thead><tbody>
<tr><td><b>Delta</b></td><td>Giá tài sản cơ sở</td><td>Call 0 → 1, put −1 → 0; ATM ≈ ±0.5; còn dùng như xác suất gần đúng đáo hạn ITM và tỷ lệ phòng ngừa</td></tr>
<tr><td><b>Gamma</b></td><td>Tốc độ thay đổi của delta</td><td>Cao nhất ở ATM gần đáo hạn; người mua quyền chọn có gamma dương</td></tr>
<tr><td><b>Theta</b></td><td>Thời gian trôi qua</td><td>Thường âm với người mua; tăng tốc khi gần đáo hạn</td></tr>
<tr><td><b>Vega</b></td><td>Biến động ngụ ý</td><td>Dương với cả call và put mua; lớn nhất ở ATM, kỳ hạn dài</td></tr>
<tr><td><b>Rho</b></td><td>Lãi suất</td><td>Call dương, put âm; nhỏ với kỳ hạn ngắn</td></tr></tbody></table>
<div class="callout"><b>Ví dụ delta</b>: call delta 0.6. Cổ phiếu tăng 2 thì phí call tăng khoảng 1.2. Để phòng ngừa 10 hợp đồng call (×100) cần bán khoảng 600 cổ phiếu (phòng ngừa trung tính delta).</div>
${H.bsCalc()}
<h3>4. Biến động ngụ ý</h3>
<p>Trong mô hình định giá, mọi đầu vào đều quan sát được (giá cơ sở, strike, thời gian, lãi suất, cổ tức), <b>trừ biến động tương lai</b>. Biến động ngụ ý (IV) là mức biến động làm cho giá lý thuyết <b>bằng</b> giá thị trường của quyền chọn. Nó là "kỳ vọng biến động" mà thị trường đang đặt giá.</p>`,
    keys: ['Quyền chọn để phòng ngừa, đòn bẩy giới hạn rủi ro, thu nhập, giao dịch biến động, khám phá thông tin.', 'Điều khoản: cơ sở, loại, strike, đáo hạn, kiểu Mỹ/Âu, hệ số nhân, thanh toán, phí.', 'Delta (giá), gamma (tốc độ delta), theta (thời gian), vega (IV), rho (lãi suất).', 'Delta ATM ≈ 0.5; dùng làm tỷ lệ phòng ngừa; gamma lớn nhất ở ATM gần đáo hạn.', 'IV = biến động làm giá lý thuyết bằng giá thị trường.'],
    terms: [['Covered call', 'Bán call có bảo đảm'], ['Delta hedge', 'Phòng ngừa trung tính delta'], ['Gamma / Theta / Vega / Rho', 'Các hệ số nhạy'], ['Multiplier', 'Hệ số nhân'], ['Implied volatility', 'Biến động ngụ ý']]
  }, {
    goals: ['Explain options markets’ purpose.', 'List contract terms.', 'Describe the Greeks.', 'Define implied volatility.'],
    body: () => `
<h3>1. Purpose</h3><ul><li>Hedging, limited-risk leverage, income, volatility trading, information.</li></ul>
<h3>2. Terms</h3><p>Underlying, call/put, strike, expiry, American/European, multiplier, settlement, premium.</p>
<h3>3. Greeks</h3><table class="tbl"><tbody><tr><td>Delta</td><td>underlying; ATM ≈ 0.5; hedge ratio</td></tr><tr><td>Gamma</td><td>delta’s rate of change; highest ATM near expiry</td></tr><tr><td>Theta</td><td>time decay, accelerating</td></tr><tr><td>Vega</td><td>implied volatility</td></tr><tr><td>Rho</td><td>rates</td></tr></tbody></table><div class="callout">Delta 0.6: stock +2 → call ≈ +1.2; hedge 10 calls (×100) by selling ~600 shares.</div>${H.bsCalc()}
<h3>4. Implied volatility</h3><p>The volatility that equates the model price with the market price.</p>`,
    keys: ['Purposes.', 'Terms.', 'Greeks.', 'Delta hedging.', 'IV definition.'],
    terms: [['Vega', 'Sensitivity to IV'], ['Delta hedge', 'Delta-neutral hedge']]
  }, [
    ['Mục đích nào chỉ quyền chọn mới thực hiện trực tiếp được?', 'Which purpose is uniquely served by options?', ['Mua cổ phiếu', 'Giao dịch độ lớn biến động (không chỉ hướng)', 'Nhận cổ tức', 'Gửi tiết kiệm'], ['Buying stock', 'Trading the size of volatility, not just direction', 'Dividends', 'Savings'], 1, '', ''],
    ['Covered call là:', 'A covered call is:', ['Bán call trên cổ phiếu đang nắm giữ', 'Mua call không có cổ phiếu', 'Mua put', 'Bán put'], ['Selling calls against owned stock', 'Buying naked calls', 'Buying puts', 'Selling puts'], 0, '', ''],
    ['Delta của call ATM xấp xỉ:', 'ATM call delta ≈', ['0', '0.5', '1', '−0.5'], null, 1, '', ''],
    ['Call delta 0.4, cổ phiếu tăng 5. Phí call thay đổi khoảng:', 'Call delta 0.4; stock +5. Call price change ≈', ['+0.4', '+2', '+5', '−2'], null, 1, '0.4 × 5 = 2.', ''],
    ['Put delta −0.3, cổ phiếu giảm 10. Phí put thay đổi khoảng:', 'Put delta −0.3; stock −10. Put change ≈', ['−3', '+3', '+10', '0'], null, 1, '−0.3 × (−10) = +3.', ''],
    ['Để phòng ngừa trung tính delta 5 hợp đồng call (×100 cp), delta 0.7, cần:', 'To delta-hedge 5 calls (×100), delta 0.7, you:', ['Bán 350 cổ phiếu', 'Mua 350 cổ phiếu', 'Bán 500', 'Mua 70'], ['Sell 350 shares', 'Buy 350', 'Sell 500', 'Buy 70'], 0, '5 × 100 × 0.7 = 350.', ''],
    ['Gamma lớn nhất khi quyền chọn:', 'Gamma is largest when an option is:', ['ATM và gần đáo hạn', 'Rất sâu ITM, xa đáo hạn', 'Rất sâu OTM', 'Đã đáo hạn'], ['ATM near expiry', 'Deep ITM far out', 'Deep OTM', 'Expired'], 0, '', ''],
    ['Theta của người mua quyền chọn thường:', 'A long option’s theta is usually:', ['Dương', 'Âm và tăng tốc khi gần đáo hạn', 'Bằng 0', 'Không xác định'], ['Positive', 'Negative, accelerating near expiry', 'Zero', 'Undefined'], 1, '', ''],
    ['Vega dương với:', 'Vega is positive for:', ['Người mua call và put', 'Chỉ người mua call', 'Người bán call', 'Không ai'], ['Long calls and puts', 'Long calls only', 'Short calls', 'Nobody'], 0, '', ''],
    ['Vega = 0.15, IV tăng 4 điểm %. Phí thay đổi khoảng:', 'Vega 0.15; IV +4 points. Premium change ≈', ['+0.15', '+0.6', '+4', '−0.6'], null, 1, '0.15 × 4.', ''],
    ['Rho của call thường:', 'A call’s rho is usually:', ['Dương', 'Âm', 'Bằng 0 tuyệt đối', 'Bằng delta'], ['Positive', 'Negative', 'Exactly zero', 'Equal to delta'], 0, '', ''],
    ['Quyền chọn kiểu Mỹ khác kiểu châu Âu ở:', 'American vs European options differ in:', ['Có thể thực hiện bất cứ lúc nào trước đáo hạn', 'Chỉ giao dịch ở Mỹ', 'Không có phí', 'Không có strike'], ['Exercisable any time before expiry', 'Traded only in the US', 'No premium', 'No strike'], 0, '', ''],
    ['Đầu vào nào của mô hình định giá KHÔNG quan sát trực tiếp được?', 'Which pricing input is NOT directly observable?', ['Giá cơ sở', 'Strike', 'Biến động tương lai', 'Thời gian đáo hạn'], ['Underlying price', 'Strike', 'Future volatility', 'Time to expiry'], 2, '', ''],
    ['Biến động ngụ ý được định nghĩa là:', 'Implied volatility is:', ['Độ lệch chuẩn lịch sử', 'Biến động làm giá lý thuyết bằng giá thị trường', 'Phí quyền chọn', 'Delta × 100'], ['Historical st.dev', 'The volatility equating model and market price', 'The premium', 'Delta × 100'], 1, '', ''],
    ['Delta còn được dùng như xấp xỉ của:', 'Delta also approximates:', ['Xác suất đáo hạn ITM', 'Lãi suất', 'Cổ tức', 'Khối lượng'], ['Probability of finishing ITM', 'Rates', 'Dividends', 'Volume'], 0, '', ''],
    ['Người mua quyền chọn có gamma:', 'Option buyers have gamma that is:', ['Dương', 'Âm', 'Bằng 0', 'Không xác định'], ['Positive', 'Negative', 'Zero', 'Undefined'], 0, '', ''],
    ['Giá trị thời gian của quyền chọn sâu OTM bằng:', 'A deep OTM option’s time value equals:', ['Toàn bộ phí (giá trị nội tại = 0)', '0', 'Strike', 'Delta'], ['The whole premium (no intrinsic value)', 'Zero', 'Strike', 'Delta'], 0, '', ''],
    ['Vega lớn nhất ở quyền chọn:', 'Vega is greatest for:', ['ATM, kỳ hạn dài', 'Sâu ITM, sắp đáo hạn', 'Đã đáo hạn', 'Sâu OTM, 1 ngày'], ['ATM, long-dated', 'Deep ITM near expiry', 'Expired', 'Deep OTM, 1 day'], 0, '', ''],
    ['Theta tăng tốc ở giai đoạn:', 'Theta accelerates:', ['Gần đáo hạn', 'Mới phát hành', 'Không bao giờ', 'Khi lãi suất tăng'], ['Near expiry', 'At issue', 'Never', 'When rates rise'], 0, '', ''],
    ['Giá quyền chọn giúp "khám phá thông tin" vì:', 'Option prices aid information discovery because:', ['Tiết lộ kỳ vọng biến động và tâm lý (IV, skew)', 'Có cổ tức', 'Không có giao dịch', 'Do luật'], ['They reveal volatility expectations and sentiment', 'Dividends', 'No trading', 'Law'], 0, '', '']
  ]);

  /* ================= L2-16 ================= */
  C.addLesson('l2-16', {
    goals: ['So sánh biến động lịch sử và ngụ ý khi phân tích, dự báo.', 'Diễn giải IV như ước lượng của thị trường về phạm vi giá tương lai.', 'Tính biến động ngụ ý một ngày.', 'Liệt kê các đầu vào của mô hình định giá quyền chọn.'],
    body: () => `
<h3>1. HV và IV trong phân tích</h3>
<table class="tbl"><thead><tr><th></th><th>Biến động lịch sử (HV)</th><th>Biến động ngụ ý (IV)</th></tr></thead><tbody>
<tr><td>Nguồn</td><td>Giá quá khứ của tài sản</td><td>Giá quyền chọn hiện tại</td></tr>
<tr><td>Hướng thời gian</td><td>Nhìn lại</td><td>Nhìn tới (đến đáo hạn)</td></tr>
<tr><td>Chứa</td><td>Biến động đã xảy ra</td><td>Kỳ vọng + phần bù rủi ro + cung cầu quyền chọn</td></tr>
<tr><td>Dùng để</td><td>Đặt dừng/mục tiêu theo σ, so sánh với IV</td><td>Ước lượng phạm vi tương lai, đo tâm lý</td></tr></tbody></table>
<p>IV thường <b>cao hơn</b> HV trung bình (người mua bảo hiểm trả phần bù). IV cao hơn HV nhiều cho thấy thị trường lo ngại sự kiện sắp tới; IV thấp hơn HV hiếm gặp, đôi khi là cơ hội mua quyền chọn rẻ.</p>
<h3>2. IV như phạm vi giá kỳ vọng</h3>
<p>Với giả định phân phối log-chuẩn, IV cho phép ước lượng phạm vi ±1σ (≈ 68%) đến một thời điểm: <b>Giá × IV × √(t)</b>, t tính bằng năm.</p>
<h3>3. Biến động ngụ ý một ngày</h3>
<p><b>IV<sub>1 ngày</sub> = IV<sub>năm</sub> / √252</b> (≈ chia 16). Ví dụ IV = 48% → 1 ngày ≈ 3%. Trước sự kiện (báo cáo lợi nhuận), có thể suy ra "biên độ kỳ vọng của sự kiện" từ chênh lệch IV giữa kỳ hạn chứa sự kiện và kỳ hạn không chứa.</p>
<div class="callout"><b>Ví dụ</b>: cổ phiếu 80, IV 32%. Biến động 1 ngày ≈ 80 × 0.32/15.87 ≈ <b>1.61</b>. Khoảng ±1σ ngày mai ≈ 78.4–81.6. Khoảng ±1σ cho 1 tháng (21 phiên) ≈ 80 × 0.32 × √(21/252) ≈ ±7.4.</div>
${H.histVol()}
<h3>4. Đầu vào của mô hình định giá</h3>
<ol><li>Giá tài sản cơ sở (S)</li><li>Giá thực hiện (K)</li><li>Thời gian đến đáo hạn (T)</li><li>Lãi suất phi rủi ro (r)</li><li>Biến động (σ) — đầu vào duy nhất không quan sát được</li><li>Cổ tức (với cổ phiếu) / lợi suất tiện ích (với hàng hoá)</li></ol>
${H.bsCalc()}`,
    keys: ['HV nhìn lại, IV nhìn tới; IV gồm kỳ vọng + phần bù rủi ro + cung cầu quyền chọn.', 'IV thường cao hơn HV trung bình; IV ≫ HV = lo ngại sự kiện.', 'Phạm vi ±1σ = Giá × IV × √t.', 'IV 1 ngày = IV năm / √252 (≈ /16).', 'Đầu vào: S, K, T, r, σ, cổ tức — σ là đầu vào không quan sát được.'],
    terms: [['Volatility risk premium', 'Phần bù rủi ro biến động'], ['Event volatility', 'Biến động sự kiện'], ['Single-day IV', 'Biến động ngụ ý một ngày']]
  }, {
    goals: ['Contrast HV and IV.', 'Read IV as the market’s range estimate.', 'Compute single-day IV.', 'List pricing-model inputs.'],
    body: () => `
<h3>1. HV vs IV</h3><table class="tbl"><tbody><tr><td>Source</td><td>past prices / option prices</td></tr><tr><td>Direction</td><td>backward / forward</td></tr><tr><td>Content</td><td>realised / expectation + risk premium + option supply-demand</td></tr></tbody></table><p>IV usually exceeds average HV; IV ≫ HV signals event worry.</p>
<h3>2. Range</h3><p>±1σ ≈ Price × IV × √t.</p>
<h3>3. Single-day IV</h3><p>IV/√252 (≈ ÷16).</p><div class="callout">Stock 80, IV 32% → ≈ 1.61 per day; 1 month ≈ ±7.4.</div>${H.histVol()}
<h3>4. Inputs</h3><ol><li>S</li><li>K</li><li>T</li><li>r</li><li>σ — unobservable</li><li>Dividends / convenience yield</li></ol>${H.bsCalc()}`,
    keys: ['HV backward, IV forward.', 'IV > HV typically.', 'Price × IV × √t.', 'IV/√252.', 'Six inputs; σ unobservable.'],
    terms: [['Volatility risk premium', 'IV minus realised volatility']]
  }, [
    ['IV khác HV chủ yếu ở chỗ:', 'IV differs from HV mainly in being:', ['Nhìn tới, suy ra từ giá quyền chọn', 'Nhìn lại', 'Không dùng giá', 'Bằng nhau'], ['Forward-looking from option prices', 'Backward', 'Price-free', 'Equal'], 0, '', ''],
    ['IV thường cao hơn HV trung bình vì:', 'IV usually exceeds average HV because:', ['Người mua bảo hiểm trả phần bù rủi ro', 'Lỗi tính toán', 'Không có lý do', 'HV luôn bằng 0'], ['Insurance buyers pay a risk premium', 'Calculation error', 'No reason', 'HV is zero'], 0, '', ''],
    ['IV = 40%. IV một ngày (252 phiên) xấp xỉ:', 'IV 40%. Single-day IV ≈', ['0.16%', '2.5%', '4%', '10%'], null, 1, '40/15.87 ≈ 2.52%.', ''],
    ['Cổ phiếu 50, IV 24%. Biến động 1σ một ngày khoảng:', 'Stock 50, IV 24%. 1-day 1σ ≈', ['0.24', '0.76', '1.2', '12'], null, 1, '50 × 0.24/15.87 ≈ 0.76.', ''],
    ['Cổ phiếu 100, IV 20%. Phạm vi ±1σ trong 3 tháng (0.25 năm) khoảng:', 'Stock 100, IV 20%. ±1σ over 3 months:', ['±5', '±10', '±20', '±2.5'], null, 1, '100 × 0.2 × √0.25 = 10.', ''],
    ['Khoảng ±1σ chứa khoảng bao nhiêu phần trăm kết quả (giả định chuẩn)?', 'What share of outcomes lies within ±1σ (normal)?', ['50%', '68%', '95%', '99.7%'], null, 1, '', ''],
    ['IV cao hơn HV rất nhiều trước báo cáo lợi nhuận cho thấy:', 'IV far above HV before earnings shows:', ['Thị trường kỳ vọng biến động lớn từ sự kiện', 'Không có sự kiện', 'Lỗi', 'Cổ tức'], ['The market expects a big event move', 'No event', 'Error', 'Dividend'], 0, '', ''],
    ['Đầu vào duy nhất không quan sát được của Black–Scholes:', 'Black–Scholes’ only unobservable input:', ['Strike', 'Lãi suất', 'Biến động', 'Thời gian'], ['Strike', 'Rate', 'Volatility', 'Time'], 2, '', ''],
    ['Đầu vào nào KHÔNG thuộc mô hình định giá quyền chọn?', 'Which is NOT an option-pricing input?', ['Giá cơ sở', 'Strike', 'Tỷ lệ P/E', 'Lãi suất'], ['Underlying price', 'Strike', 'P/E ratio', 'Rate'], 2, '', ''],
    ['Công thức phạm vi giá kỳ vọng ±1σ:', '±1σ expected-range formula:', ['Giá × IV × √t', 'Giá × IV × t', 'Giá / IV', 'IV × 252'], ['Price × IV × √t', 'Price × IV × t', 'Price / IV', 'IV × 252'], 0, '', ''],
    ['Biến động có tính quay về trung bình nên IV ở mức thấp kỷ lục thường:', 'Volatility mean-reverts, so record-low IV usually:', ['Có xu hướng tăng trở lại sau đó', 'Giữ mãi', 'Về 0', 'Không liên quan'], ['Tends to rise later', 'Stays forever', 'Goes to zero', 'Unrelated'], 0, '', ''],
    ['"Biên độ sự kiện" có thể suy ra từ:', 'Event move can be inferred from:', ['Chênh lệch IV giữa kỳ hạn chứa và không chứa sự kiện', 'Giá đóng cửa', 'Khối lượng', 'Cổ tức'], ['IV difference between expiries with and without the event', 'Closes', 'Volume', 'Dividends'], 0, '', ''],
    ['HV dùng tốt cho:', 'HV is useful for:', ['Đặt dừng/mục tiêu theo σ, so sánh với IV', 'Dự báo tin tức', 'Tính cổ tức', 'Không gì'], ['σ-based stops/targets and comparison with IV', 'News forecasting', 'Dividends', 'Nothing'], 0, '', ''],
    ['IV thấp hơn HV đáng kể có thể nghĩa là:', 'IV well below HV may mean:', ['Quyền chọn tương đối rẻ', 'Quyền chọn rất đắt', 'Không có giao dịch', 'Lỗi chắc chắn'], ['Options are relatively cheap', 'Very expensive', 'No trading', 'Certain error'], 0, '', ''],
    ['Hằng số √252 phản ánh:', '√252 reflects:', ['Số phiên giao dịch mỗi năm', 'Số ngày lịch', 'Số tuần', 'Số tháng'], ['Trading days per year', 'Calendar days', 'Weeks', 'Months'], 0, '', ''],
    ['IV chứa những thành phần nào?', 'IV contains:', ['Kỳ vọng biến động, phần bù rủi ro, cung cầu quyền chọn', 'Chỉ giá quá khứ', 'Chỉ cổ tức', 'Chỉ lãi suất'], ['Expected volatility, risk premium, option supply/demand', 'Past prices only', 'Dividends only', 'Rates only'], 0, '', ''],
    ['Cổ phiếu 120, IV 48%. Khoảng ±1σ cho ngày mai:', 'Stock 120, IV 48%. ±1σ tomorrow:', ['116.4–123.6', '108–132', '119–121', '60–180'], null, 0, '120 × 0.48/15.87 ≈ 3.6.', ''],
    ['Với hàng hoá, đầu vào tương tự cổ tức là:', 'For commodities the dividend-like input is:', ['Lợi suất tiện ích / chi phí lưu kho', 'P/E', 'Khối lượng', 'Không có'], ['Convenience yield / carry', 'P/E', 'Volume', 'None'], 0, '', ''],
    ['Khi IV tăng, phí quyền chọn mua (call và put):', 'When IV rises, long call and put premiums:', ['Tăng', 'Giảm', 'Không đổi', 'Về 0'], ['Rise', 'Fall', 'Unchanged', 'Zero'], 0, '', ''],
    ['Giả định phân phối thường dùng trong định giá quyền chọn cổ phiếu là:', 'The usual distribution assumption for stock prices in option pricing:', ['Log-chuẩn', 'Đều', 'Nhị thức tuyệt đối', 'Không có'], ['Log-normal', 'Uniform', 'Exactly binomial', 'None'], 0, '', '']
  ]);

  /* ================= L2-17 ================= */
  C.addLesson('l2-17', {
    goals: ['Phân tích cách ngang giá put–call và cung cầu quyền chọn ảnh hưởng tới VIX.', 'Diễn giải VIX như chỉ báo tâm lý.', 'Diễn giải thay đổi của VIX như một phần của dự báo thị trường.', 'Tính biên độ dịch chuyển kỳ vọng 30 ngày của chỉ số hoặc cổ phiếu.'],
    body: () => `
<h3>1. VIX được tạo ra như thế nào (khái niệm)</h3>
<p>VIX tổng hợp giá của một dải rộng các quyền chọn S&P 500 <b>OTM</b> (put dưới giá hiện tại, call trên giá hiện tại) ở hai kỳ hạn gần, có trọng số theo strike, rồi nội suy về đúng <b>30 ngày</b>. Kết quả là một con số biến động ngụ ý năm hoá <b>không phụ thuộc mô hình</b> cụ thể.</p>
<h3>2. Ngang giá put–call và cung cầu quyền chọn</h3>
<ul><li>Khi thị trường lo sợ, nhu cầu mua <b>put</b> bảo hiểm tăng, đẩy giá put lên, tức IV của put tăng.</li>
<li><b>Ngang giá put–call</b> (C − P = S − K·e<sup>−rT</sup>) liên kết giá call và put cùng strike. Nếu put đắt lên mà call không đổi, sẽ có cơ hội kinh doanh chênh lệch. Nhà tạo lập vì thế điều chỉnh, và IV của call cùng strike cũng tăng theo.</li>
<li>Kết quả: áp lực mua put lan ra toàn bộ bề mặt biến động, làm <b>VIX tăng</b>. Ngược lại, khi tâm lý tự mãn, nhu cầu bảo hiểm giảm thì VIX giảm.</li></ul>
<h3>3. VIX như chỉ báo tâm lý</h3>
<ul><li>VIX cao = sợ hãi; VIX thấp = tự mãn. Quan hệ thường <b>nghịch chiều</b> với cổ phiếu.</li>
<li>Mức "cao/thấp" nên đánh giá <b>tương đối</b>: so với MA của VIX (ví dụ VIX cao hơn MA10 trên 10–20%), dải Bollinger, hoặc phân vị lịch sử.</li></ul>
<h3>4. Thay đổi của VIX trong dự báo</h3>
<table class="tbl"><thead><tr><th>Hiện tượng</th><th>Hàm ý thường gặp</th></tr></thead><tbody>
<tr><td>VIX tăng vọt rồi đảo chiều giảm (đỉnh VIX)</td><td>Đáy ngắn hạn của cổ phiếu</td></tr>
<tr><td>VIX thấp kéo dài, bắt đầu tăng khi cổ phiếu còn ở đỉnh</td><td>Cảnh báo sớm điều chỉnh</td></tr>
<tr><td>Cổ phiếu và VIX cùng tăng</td><td>Bất thường — thị trường tăng nhưng nhu cầu bảo hiểm tăng, thận trọng</td></tr>
<tr><td>Cấu trúc kỳ hạn VIX đảo ngược (gần &gt; xa)</td><td>Căng thẳng cấp tính</td></tr></tbody></table>
<h3>5. Biên độ dịch chuyển kỳ vọng 30 ngày</h3>
<p><b>Biên độ 1σ 30 ngày ≈ VIX/√12</b>, vì 30 ngày ≈ 1/12 năm. Với cổ phiếu riêng lẻ, dùng IV 30 ngày của chính nó theo cùng công thức.</p>
${H.vixCalc()}`,
    keys: ['VIX tổng hợp quyền chọn OTM S&P 500 ở hai kỳ hạn gần, nội suy 30 ngày, không phụ thuộc mô hình.', 'Nhu cầu put tăng + ngang giá put–call lan áp lực sang call → VIX tăng.', 'VIX cao = sợ hãi, thấp = tự mãn; đánh giá tương đối so với MA, dải, phân vị.', 'Đỉnh VIX đảo chiều ↔ đáy cổ phiếu; cổ phiếu và VIX cùng tăng là bất thường.', 'Biên độ 30 ngày ≈ VIX/√12; cổ phiếu dùng IV riêng.'],
    terms: [['OTM strip', 'Dải quyền chọn ngoài tiền'], ['Model-free', 'Không phụ thuộc mô hình'], ['Volatility surface', 'Bề mặt biến động'], ['VIX term structure', 'Cấu trúc kỳ hạn VIX']]
  }, {
    goals: ['Analyse how put–call parity and option supply/demand affect VIX.', 'Read VIX as sentiment.', 'Use VIX changes in forecasts.', 'Compute 30-day expected moves.'],
    body: () => `
<h3>1. Construction</h3><p>A strip of OTM S&P 500 puts and calls in two near expiries, strike-weighted, interpolated to 30 days — model-free.</p>
<h3>2. Parity and demand</h3><p>Fear lifts put demand and put IV; put–call parity transmits it to calls at the same strike; VIX rises.</p>
<h3>3. Sentiment</h3><p>High = fear, low = complacency; judge relatively (vs MA, bands, percentiles).</p>
<h3>4. Changes</h3><table class="tbl"><tbody><tr><td>VIX spike reversing</td><td>stock low</td></tr><tr><td>Low VIX turning up at highs</td><td>early warning</td></tr><tr><td>Stocks and VIX both rising</td><td>unusual, caution</td></tr><tr><td>Inverted VIX curve</td><td>acute stress</td></tr></tbody></table>
<h3>5. 30-day move</h3><p>≈ VIX/√12; for a stock use its own 30-day IV.</p>${H.vixCalc()}`,
    keys: ['Model-free 30-day OTM strip.', 'Put demand + parity → higher VIX.', 'Relative extremes.', 'VIX patterns.', 'VIX/√12.'],
    terms: [['Model-free', 'Not dependent on a pricing model']]
  }, [
    ['VIX được tính từ quyền chọn:', 'VIX is computed from:', ['OTM của S&P 500 ở hai kỳ hạn gần, nội suy 30 ngày', 'Chỉ call ATM', 'Cổ phiếu riêng lẻ', 'Hợp đồng tương lai dầu'], ['OTM S&P 500 options in two near expiries, interpolated to 30 days', 'ATM calls only', 'Single stocks', 'Oil futures'], 0, '', ''],
    ['"Không phụ thuộc mô hình" nghĩa là:', '"Model-free" means:', ['Không cần một mô hình định giá cụ thể như Black–Scholes', 'Không có công thức', 'Ngẫu nhiên', 'Không có dữ liệu'], ['No specific pricing model like Black–Scholes is required', 'No formula', 'Random', 'No data'], 0, '', ''],
    ['Khi nhu cầu mua put tăng mạnh, VIX thường:', 'When put demand surges, VIX usually:', ['Tăng', 'Giảm', 'Không đổi', 'Về 0'], ['Rises', 'Falls', 'Unchanged', 'Zero'], 0, '', ''],
    ['Vì sao giá call cũng tăng IV khi put đắt lên?', 'Why does call IV rise when puts get expensive?', ['Ngang giá put–call liên kết giá call và put cùng strike', 'Ngẫu nhiên', 'Do cổ tức', 'Không đúng'], ['Put–call parity links same-strike calls and puts', 'Randomly', 'Dividends', 'False'], 0, '', ''],
    ['VIX = 24. Biên độ 1σ 30 ngày khoảng:', 'VIX 24. 30-day 1σ ≈', ['2%', '6.9%', '24%', '1.5%'], null, 1, '24/3.46.', ''],
    ['VIX = 12, S&P = 6.000. Khoảng ±1σ 30 ngày:', 'VIX 12, S&P 6,000. 30-day ±1σ:', ['5.792–6.208', '5.280–6.720', '5.988–6.012', '5.400–6.600'], null, 0, '12/3.46 = 3.46% × 6.000 ≈ 208.', ''],
    ['Cổ phiếu có IV 30 ngày 45%, giá 40. Biên độ 1σ 30 ngày:', 'Stock with 45% 30-day IV, price 40. 30-day 1σ:', ['±1.8', '±5.2', '±18', '±0.45'], null, 1, '40 × 0.45/3.46 ≈ 5.2.', ''],
    ['VIX tăng vọt rồi đảo chiều giảm mạnh thường gắn với:', 'A VIX spike reversing sharply often marks:', ['Đáy ngắn hạn của cổ phiếu', 'Đỉnh cổ phiếu', 'Không gì', 'Lãi suất tăng'], ['A short-term stock low', 'A stock top', 'Nothing', 'Higher rates'], 0, '', ''],
    ['Cổ phiếu và VIX cùng tăng là tín hiệu:', 'Stocks and VIX rising together is:', ['Bình thường', 'Bất thường — thận trọng', 'Mua mạnh', 'Không ý nghĩa'], ['Normal', 'Unusual — caution', 'Strong buy', 'Meaningless'], 1, '', ''],
    ['Đánh giá VIX "cao" nên làm theo cách:', 'Judge a "high" VIX by:', ['So sánh tương đối với MA, dải, phân vị của chính VIX', 'Một ngưỡng cố định mãi mãi', 'Không đánh giá', 'So với giá vàng'], ['Relative to its own MA, bands, percentiles', 'A permanent fixed level', 'Not at all', 'Gold'], 0, '', ''],
    ['Cấu trúc kỳ hạn VIX đảo ngược (VIX gần > xa) cho thấy:', 'An inverted VIX term structure shows:', ['Căng thẳng cấp tính', 'Thị trường yên bình', 'Lãi suất giảm', 'Không gì'], ['Acute stress', 'Calm', 'Lower rates', 'Nothing'], 0, '', ''],
    ['VIX là thước đo của:', 'VIX measures:', ['Biến động ngụ ý 30 ngày của S&P 500', 'Biến động lịch sử 1 năm', 'Khối lượng', 'Độ rộng'], ['30-day S&P 500 implied volatility', '1-year HV', 'Volume', 'Breadth'], 0, '', ''],
    ['VIX thấp kéo dài và bắt đầu tăng khi cổ phiếu vẫn ở đỉnh:', 'Low VIX turning up while stocks are at highs:', ['Cảnh báo sớm điều chỉnh', 'Tín hiệu mua', 'Vô nghĩa', 'Đáy'], ['Early correction warning', 'Buy', 'Meaningless', 'Bottom'], 0, '', ''],
    ['Vì sao chia cho √12 khi tính biên độ 30 ngày từ VIX?', 'Why divide VIX by √12 for 30 days?', ['30 ngày ≈ 1/12 năm, biến động tỷ lệ với √thời gian', 'Có 12 tháng lương', 'Quy ước ngẫu nhiên', 'Không đúng'], ['30 days ≈ 1/12 year and volatility scales with √time', 'Twelve paychecks', 'Random', 'False'], 0, '', ''],
    ['Biên độ 2σ 30 ngày khi VIX = 30:', '30-day 2σ with VIX 30:', ['≈ 8.7%', '≈ 17.3%', '≈ 30%', '≈ 60%'], null, 1, '2 × 30/3.46.', ''],
    ['Quyền chọn dùng để tính VIX gồm:', 'Options used for VIX include:', ['Put dưới giá hiện tại và call trên giá hiện tại', 'Chỉ put ITM', 'Chỉ call ITM', 'Quyền chọn cổ phiếu riêng'], ['Puts below and calls above the current level', 'ITM puts only', 'ITM calls only', 'Single-stock options'], 0, '', ''],
    ['VIX cao hơn MA10 của nó 25% là dấu hiệu:', 'VIX 25% above its 10-day MA signals:', ['Sợ hãi tương đối cao — thường gần đáy ngắn hạn', 'Tự mãn', 'Không gì', 'Lãi suất'], ['Relatively high fear — often near a short-term low', 'Complacency', 'Nothing', 'Rates'], 0, '', ''],
    ['Quan hệ điển hình VIX – cổ phiếu:', 'Typical VIX–stocks relationship:', ['Nghịch chiều', 'Cùng chiều', 'Không liên quan', 'Bằng nhau'], ['Inverse', 'Same direction', 'Unrelated', 'Equal'], 0, '', ''],
    ['VIX = 18 thì biến động 1 ngày kỳ vọng khoảng:', 'VIX 18 → expected 1-day move ≈', ['1.1%', '18%', '5.2%', '0.1%'], null, 0, '18/16.', ''],
    ['Áp lực mua put lan rộng toàn bề mặt biến động là nhờ:', 'Put buying spreads across the vol surface via:', ['Kinh doanh chênh lệch và ngang giá put–call', 'Cổ tức', 'Thuế', 'Không gì'], ['Arbitrage and put–call parity', 'Dividends', 'Taxes', 'Nothing'], 0, '', '']
  ]);

  /* ================= L2-18 ================= */
  C.addLesson('l2-18', {
    goals: ['So sánh lý thuyết hữu dụng kỳ vọng và lý thuyết triển vọng.', 'Mô tả ghét thua lỗ và hệ số ghét lỗ.', 'Mô tả giới hạn lớn nhất của lý thuyết triển vọng.', 'Nhận diện hiệu ứng chắc chắn, hiệu ứng cô lập và trọng số quyết định.'],
    body: () => `
<h3>1. Lý thuyết hữu dụng kỳ vọng</h3>
<p>Theo lý thuyết cổ điển (von Neumann–Morgenstern), người ra quyết định lý trí chọn phương án có <b>hữu dụng kỳ vọng</b> cao nhất: Σ xác suất × hữu dụng của kết quả. Hữu dụng tính trên <b>tổng tài sản cuối cùng</b>, hàm hữu dụng lõm (né rủi ro): mỗi đồng tăng thêm mang lại ít hữu dụng hơn.</p>
<h3>2. Lý thuyết triển vọng (Kahneman & Tversky)</h3>
<table class="tbl"><thead><tr><th>Đặc điểm</th><th>Hữu dụng kỳ vọng</th><th>Lý thuyết triển vọng</th></tr></thead><tbody>
<tr><td>Đơn vị đánh giá</td><td>Tổng tài sản</td><td><b>Lãi/lỗ so với điểm tham chiếu</b></td></tr>
<tr><td>Thái độ rủi ro</td><td>Né rủi ro mọi nơi</td><td>Né rủi ro khi lãi, <b>thích rủi ro khi lỗ</b></td></tr>
<tr><td>Lãi và lỗ</td><td>Đối xứng</td><td><b>Lỗ "nặng" hơn lãi</b> (hệ số ghét lỗ ≈ 2–2.5)</td></tr>
<tr><td>Xác suất</td><td>Dùng nguyên giá trị</td><td><b>Trọng số quyết định</b>: phóng đại xác suất nhỏ, giảm nhẹ xác suất vừa và lớn</td></tr>
<tr><td>Mô tả</td><td>Chuẩn tắc (nên làm gì)</td><td>Mô tả (thực tế làm gì)</td></tr></tbody></table>
<p>Quá trình ra quyết định có hai giai đoạn: <b>biên tập</b> (đóng khung, đơn giản hoá lựa chọn, chọn điểm tham chiếu) và <b>đánh giá</b> (dùng hàm giá trị và trọng số quyết định).</p>
<h3>3. Các hiệu ứng</h3>
<ul><li><b>Ghét thua lỗ</b>: mất 100 đau bằng khoảng được 200–250.</li>
<li><b>Hiệu ứng chắc chắn</b>: đánh giá quá cao kết quả chắc chắn so với kết quả gần chắc chắn (sẵn sàng trả nhiều để biến 99% thành 100%).</li>
<li><b>Hiệu ứng phản chiếu</b>: thái độ rủi ro đảo ngược giữa vùng lãi và vùng lỗ.</li>
<li><b>Hiệu ứng cô lập</b>: bỏ qua các thành phần chung giữa các lựa chọn, chỉ tập trung vào khác biệt — khiến cách đóng khung thay đổi quyết định.</li></ul>
<div class="callout"><b>Giới hạn lớn nhất</b>: lý thuyết <b>không xác định điểm tham chiếu</b> được hình thành và cập nhật như thế nào. Trên thị trường, điểm tham chiếu có thể là giá mua, đỉnh gần nhất, giá kỳ vọng… và nó dịch chuyển theo thời gian. Không biết điểm tham chiếu thì khó dự báo chính xác hành vi.</div>
<h3>4. Hệ quả trên thị trường</h3>
<ul><li>Hiệu ứng phân bổ: bán lãi sớm, giữ lỗ lâu.</li>
<li>Kháng cự ở vùng hoà vốn của đám đông (giá mua cũ).</li>
<li>Thích mua "xổ số" (cổ phiếu penny, quyền chọn rất OTM) do phóng đại xác suất nhỏ.</li></ul>`,
    keys: ['Hữu dụng kỳ vọng: tổng tài sản, hàm lõm, xác suất nguyên giá trị — chuẩn tắc.', 'Triển vọng: lãi/lỗ so với điểm tham chiếu, né rủi ro khi lãi, thích rủi ro khi lỗ, ghét lỗ ≈ 2–2.5, trọng số quyết định — mô tả.', 'Hai giai đoạn: biên tập và đánh giá.', 'Hiệu ứng chắc chắn, phản chiếu, cô lập.', 'Giới hạn lớn nhất: không xác định điểm tham chiếu.'],
    terms: [['Expected utility', 'Hữu dụng kỳ vọng'], ['Value function', 'Hàm giá trị'], ['Decision weights', 'Trọng số quyết định'], ['Certainty effect', 'Hiệu ứng chắc chắn'], ['Reflection effect', 'Hiệu ứng phản chiếu'], ['Isolation effect', 'Hiệu ứng cô lập'], ['Editing phase', 'Giai đoạn biên tập']]
  }, {
    goals: ['Compare expected utility and prospect theory.', 'Describe loss aversion.', 'State prospect theory’s greatest limitation.', 'Recognise certainty, reflection and isolation effects.'],
    body: () => `
<h3>1. Expected utility</h3><p>Maximise Σ p·U(final wealth), concave utility — normative.</p>
<h3>2. Prospect theory</h3><table class="tbl"><tbody><tr><td>Unit</td><td>gains/losses vs a reference point</td></tr><tr><td>Risk</td><td>averse in gains, seeking in losses</td></tr><tr><td>Asymmetry</td><td>loss aversion ≈ 2–2.5</td></tr><tr><td>Probabilities</td><td>decision weights</td></tr><tr><td>Nature</td><td>descriptive</td></tr></tbody></table><p>Editing then evaluation.</p>
<h3>3. Effects</h3><ul><li>Loss aversion</li><li>Certainty effect</li><li>Reflection effect</li><li>Isolation effect</li></ul><div class="callout"><b>Greatest limitation</b>: it does not specify how the reference point is formed and updated.</div>
<h3>4. Market consequences</h3><ul><li>Disposition effect.</li><li>Break-even resistance.</li><li>Lottery-like preferences.</li></ul>`,
    keys: ['Normative EU vs descriptive PT.', 'Reference points, loss aversion, decision weights.', 'Editing and evaluation.', 'Certainty, reflection, isolation.', 'Undefined reference point.'],
    terms: [['Decision weights', 'Distorted probabilities'], ['Isolation effect', 'Ignoring shared components']]
  }, [
    ['Lý thuyết hữu dụng kỳ vọng đánh giá kết quả theo:', 'Expected utility evaluates outcomes by:', ['Tổng tài sản cuối cùng', 'Lãi/lỗ so với điểm tham chiếu', 'Cảm xúc', 'Khối lượng'], ['Final wealth', 'Gains/losses vs a reference point', 'Emotion', 'Volume'], 0, '', ''],
    ['Lý thuyết triển vọng là lý thuyết:', 'Prospect theory is:', ['Mô tả (con người thực tế quyết định ra sao)', 'Chuẩn tắc', 'Kỹ thuật', 'Pháp lý'], ['Descriptive', 'Normative', 'Technical', 'Legal'], 0, '', ''],
    ['Hệ số ghét lỗ thường được ước lượng khoảng:', 'Loss aversion is usually estimated around:', ['0.5', '1', '2–2.5', '10'], null, 2, '', ''],
    ['Ở vùng lỗ, theo lý thuyết triển vọng, con người thường:', 'In losses, people tend to be:', ['Né rủi ro', 'Thích rủi ro', 'Trung lập', 'Không quyết định'], ['Risk-averse', 'Risk-seeking', 'Neutral', 'Undecided'], 1, '', ''],
    ['Hiệu ứng phản chiếu là:', 'The reflection effect is:', ['Thái độ rủi ro đảo ngược giữa vùng lãi và vùng lỗ', 'Nhìn gương', 'Ghét lãi', 'Không có'], ['Risk attitude flips between gains and losses', 'Mirror gazing', 'Gain aversion', 'None'], 0, '', ''],
    ['Hiệu ứng chắc chắn là:', 'The certainty effect is:', ['Đánh giá quá cao kết quả chắc chắn so với gần chắc chắn', 'Luôn chọn rủi ro', 'Không quan tâm xác suất', 'Ghét lỗ'], ['Overweighting certain vs near-certain outcomes', 'Always choosing risk', 'Ignoring probability', 'Loss aversion'], 0, '', ''],
    ['Hiệu ứng cô lập dẫn tới:', 'The isolation effect leads to:', ['Cách đóng khung khác nhau thay đổi quyết định', 'Quyết định nhất quán tuyệt đối', 'Không quyết định', 'Ghét lãi'], ['Different framings changing decisions', 'Perfect consistency', 'No decisions', 'Gain aversion'], 0, '', ''],
    ['Giới hạn lớn nhất của lý thuyết triển vọng:', 'Prospect theory’s greatest limitation:', ['Không xác định điểm tham chiếu hình thành và cập nhật thế nào', 'Không có thực nghiệm', 'Không giải thích ghét lỗ', 'Quá đơn giản'], ['It doesn’t specify how the reference point forms and updates', 'No experiments', 'No loss aversion', 'Too simple'], 0, '', ''],
    ['Trọng số quyết định thường:', 'Decision weights typically:', ['Phóng đại xác suất nhỏ, giảm nhẹ xác suất vừa/lớn', 'Bằng xác suất thật', 'Bằng 0', 'Bằng 1'], ['Overweight small and underweight moderate/large probabilities', 'Equal true probabilities', 'Zero', 'One'], 0, '', ''],
    ['Hai giai đoạn ra quyết định trong lý thuyết triển vọng:', 'Prospect theory’s two decision phases:', ['Biên tập và đánh giá', 'Mua và bán', 'Phân tích và giao dịch', 'Không có'], ['Editing and evaluation', 'Buy and sell', 'Analysis and trading', 'None'], 0, '', ''],
    ['Hàm hữu dụng lõm thể hiện:', 'A concave utility function shows:', ['Né rủi ro — mỗi đồng thêm mang lại ít hữu dụng hơn', 'Thích rủi ro', 'Trung lập', 'Ghét lỗ'], ['Risk aversion — diminishing marginal utility', 'Risk seeking', 'Neutrality', 'Loss aversion'], 0, '', ''],
    ['Sở thích mua cổ phiếu penny, quyền chọn rất OTM được giải thích bởi:', 'Preference for penny stocks and far-OTM options is explained by:', ['Phóng đại xác suất nhỏ', 'Ghét rủi ro', 'Hiệu ứng sở hữu', 'Không gì'], ['Overweighting small probabilities', 'Risk aversion', 'Endowment', 'Nothing'], 0, '', ''],
    ['Kháng cự ở vùng giá mua cũ của đám đông liên quan tới:', 'Resistance at the crowd’s old cost basis relates to:', ['Ghét lỗ và mong muốn hoà vốn', 'Lãi suất', 'Cổ tức', 'Không gì'], ['Loss aversion and break-even selling', 'Rates', 'Dividends', 'Nothing'], 0, '', ''],
    ['Theo lý thuyết triển vọng, mất 100 đau tương đương khoảng được:', 'Losing 100 hurts about as much as gaining:', ['50', '100', '200–250', '1.000'], null, 2, '', ''],
    ['Ai phát triển lý thuyết triển vọng?', 'Who developed prospect theory?', ['Kahneman và Tversky', 'Fama và French', 'Markowitz', 'Dow'], ['Kahneman and Tversky', 'Fama and French', 'Markowitz', 'Dow'], 0, '', ''],
    ['Lý thuyết hữu dụng kỳ vọng mang tính:', 'Expected utility theory is:', ['Chuẩn tắc — mô tả nên quyết định thế nào', 'Mô tả hành vi thực', 'Kỹ thuật', 'Không có'], ['Normative', 'Descriptive', 'Technical', 'None'], 0, '', ''],
    ['Nhà đầu tư đang lỗ chấp nhận rủi ro lớn để gỡ. Đây là:', 'An investor in losses takes big risks to get even:', ['Thích rủi ro ở vùng lỗ', 'Né rủi ro', 'Hiệu ứng chắc chắn', 'Hiệu ứng cô lập'], ['Risk seeking in losses', 'Risk aversion', 'Certainty effect', 'Isolation'], 0, '', ''],
    ['Điểm tham chiếu trên thị trường có thể là:', 'A market reference point may be:', ['Giá mua, đỉnh gần nhất, giá kỳ vọng', 'Chỉ giá mở cửa', 'Lãi suất', 'Không có'], ['Purchase price, recent high, expected price', 'The open only', 'Rates', 'None'], 0, '', ''],
    ['Sẵn sàng trả nhiều để biến xác suất 99% thành 100% là:', 'Paying a lot to turn 99% into 100% is:', ['Hiệu ứng chắc chắn', 'Ghét lãi', 'Đại diện', 'Neo'], ['Certainty effect', 'Gain aversion', 'Representativeness', 'Anchoring'], 0, '', ''],
    ['Ở vùng lãi, con người thường:', 'In gains people tend to be:', ['Né rủi ro — chốt lời chắc chắn', 'Thích rủi ro', 'Trung lập', 'Không quyết định'], ['Risk-averse — take sure gains', 'Risk-seeking', 'Neutral', 'Undecided'], 0, '', '']
  ]);

  /* ================= L2-19 ================= */
  C.addLesson('l2-19', {
    goals: ['Mô tả bốn thiên kiến nhận thức: nổi bật (saliency), đóng khung (framing), neo (anchoring), chi phí chìm (sunk cost).', 'Minh hoạ cách mỗi thiên kiến ảnh hưởng tới hành vi nhà đầu tư.', 'Đề xuất cách nhà PTKT tự phòng vệ.'],
    body: () => `
<h3>1. Thiên kiến nhận thức là gì?</h3>
<p>Thiên kiến nhận thức (perception biases) là những sai lệch trong cách chúng ta <b>tiếp nhận và trình bày</b> thông tin trước khi ra quyết định. Cùng một dữ kiện, cách nó "hiện ra" trong đầu ta có thể dẫn tới quyết định khác nhau.</p>
<table class="tbl"><thead><tr><th>Thiên kiến</th><th>Bản chất</th><th>Biểu hiện trên thị trường</th></tr></thead><tbody>
<tr><td><b>Nổi bật (saliency)</b></td><td>Đánh giá quá cao những sự kiện gây ấn tượng mạnh, hiếm, mới xảy ra</td><td>Phản ứng thái quá với tin giật gân; đánh giá thấp những thay đổi chậm nhưng quan trọng; bỏ qua xu hướng âm thầm cho tới khi nó "nổi bật"</td></tr>
<tr><td><b>Đóng khung (framing)</b></td><td>Cách trình bày (lãi/lỗ, % hay giá trị tuyệt đối) thay đổi quyết định</td><td>"Giảm 50% so với đỉnh" nghe hấp dẫn để mua; báo cáo hiệu suất được trình bày để trông tốt hơn</td></tr>
<tr><td><b>Neo (anchoring)</b></td><td>Bám vào một con số ban đầu và điều chỉnh không đủ</td><td>Neo vào giá mua, đỉnh cũ, dự báo của chuyên gia; chậm cập nhật khi cơ bản thay đổi</td></tr>
<tr><td><b>Chi phí chìm (sunk cost)</b></td><td>Để chi phí đã bỏ ra (không lấy lại được) ảnh hưởng quyết định tương lai</td><td>"Đã lỗ nhiều rồi nên phải giữ", bình quân giá xuống để "không phí" khoản đã đầu tư</td></tr></tbody></table>
<h3>2. Liên hệ với PTKT</h3>
<ul><li><b>Nổi bật</b> giải thích vì sao xu hướng chậm lúc đầu (ít người để ý) rồi tăng tốc khi trở nên "nổi bật" (tin tức, mạng xã hội) — giai đoạn tham gia đại chúng của Dow.</li>
<li><b>Neo</b> giải thích sức mạnh của hỗ trợ/kháng cự và số tròn.</li>
<li><b>Chi phí chìm</b> và ghét lỗ khiến người thua lỗ không cắt lỗ, tạo nguồn cung chờ sẵn ở vùng hoà vốn.</li></ul>
<h3>3. Tự phòng vệ</h3>
<ul><li>Quyết định dựa trên <b>quy tắc viết sẵn</b> (điểm dừng đặt trước) thay vì cảm nhận tức thời.</li>
<li>Tự hỏi: "Nếu hôm nay tôi chưa nắm giữ, tôi có mua ở giá này không?" — loại bỏ chi phí chìm và neo giá mua.</li>
<li>Đọc thông tin theo nhiều khung (cả % và tuyệt đối, cả lãi và lỗ).</li>
<li>Nhật ký giao dịch giúp nhận ra thiên kiến lặp lại của chính mình.</li></ul>
${H.sentProxy()}`,
    keys: ['Bốn thiên kiến nhận thức: nổi bật, đóng khung, neo, chi phí chìm.', 'Nổi bật: phản ứng thái quá với tin ấn tượng, bỏ qua thay đổi chậm.', 'Đóng khung: cách trình bày đổi quyết định; neo: điều chỉnh không đủ từ con số ban đầu.', 'Chi phí chìm: để khoản đã mất chi phối quyết định → không cắt lỗ.', 'Phòng vệ: quy tắc viết sẵn, câu hỏi "nếu chưa nắm giữ", nhiều khung, nhật ký.'],
    terms: [['Perception bias', 'Thiên kiến nhận thức'], ['Saliency', 'Tính nổi bật'], ['Framing', 'Đóng khung'], ['Anchoring', 'Neo'], ['Sunk cost fallacy', 'Ngụy biện chi phí chìm']]
  }, {
    goals: ['Describe saliency, framing, anchoring and sunk-cost biases.', 'Illustrate their effects on investors.', 'Suggest defences.'],
    body: () => `
<h3>1. Perception biases</h3><table class="tbl"><tbody><tr><td>Saliency</td><td>overweighting vivid, rare, recent events</td></tr><tr><td>Framing</td><td>presentation changes decisions</td></tr><tr><td>Anchoring</td><td>insufficient adjustment from an initial number</td></tr><tr><td>Sunk cost</td><td>letting unrecoverable costs drive decisions</td></tr></tbody></table>
<h3>2. Links to TA</h3><ul><li>Saliency explains slow starts then acceleration of trends.</li><li>Anchoring explains S/R and round numbers.</li><li>Sunk cost plus loss aversion creates break-even supply.</li></ul>
<h3>3. Defences</h3><ul><li>Pre-written rules and stops.</li><li>"Would I buy it today at this price?"</li><li>Multiple framings.</li><li>Journals.</li></ul>${H.sentProxy()}`,
    keys: ['Four perception biases.', 'Saliency, framing, anchoring, sunk cost.', 'Links to trends and S/R.', 'Defences.'],
    terms: [['Saliency', 'Vividness bias'], ['Sunk cost', 'Unrecoverable past cost']]
  }, [
    ['Thiên kiến nào KHÔNG thuộc bốn thiên kiến nhận thức trong bài?', 'Which is NOT one of the four perception biases?', ['Nổi bật', 'Đóng khung', 'Neo', 'Hiệu ứng sở hữu'], ['Saliency', 'Framing', 'Anchoring', 'Endowment effect'], 3, 'Hiệu ứng sở hữu thuộc nhóm quán tính (Bài 20).', ''],
    ['Phản ứng thái quá với một tin giật gân hiếm gặp là:', 'Overreacting to a rare sensational news item:', ['Nổi bật (saliency)', 'Chi phí chìm', 'Hiện trạng', 'Sở hữu'], ['Saliency', 'Sunk cost', 'Status quo', 'Endowment'], 0, '', ''],
    ['"Đã lỗ 40% rồi, giờ bán thì phí" là:', '"Down 40% already, selling would waste it":', ['Ngụy biện chi phí chìm', 'Đóng khung', 'Nổi bật', 'Bảo thủ'], ['Sunk cost fallacy', 'Framing', 'Saliency', 'Conservatism'], 0, '', ''],
    ['Cùng một quỹ, báo "lãi 80% trong 5 năm" thay vì "lỗ 30% năm qua" để thu hút. Đây là:', 'A fund advertising "+80% in 5 years" instead of "−30% last year":', ['Đóng khung', 'Neo', 'Chi phí chìm', 'Nổi bật'], ['Framing', 'Anchoring', 'Sunk cost', 'Saliency'], 0, '', ''],
    ['Bám vào dự báo giá mục tiêu ban đầu của chuyên gia dù cơ bản đã đổi:', 'Clinging to an analyst’s original target despite changed fundamentals:', ['Neo', 'Nổi bật', 'Chi phí chìm', 'Đóng khung'], ['Anchoring', 'Saliency', 'Sunk cost', 'Framing'], 0, '', ''],
    ['Câu hỏi giúp loại bỏ chi phí chìm và neo giá mua:', 'A question that removes sunk cost and cost anchoring:', ['"Nếu hôm nay chưa nắm giữ, tôi có mua ở giá này không?"', '"Tôi đã lỗ bao nhiêu?"', '"Giá mua của tôi là bao nhiêu?"', '"Người khác nghĩ gì?"'], ['"If I didn’t own it, would I buy it here?"', '"How much have I lost?"', '"What did I pay?"', '"What do others think?"'], 0, '', ''],
    ['Thiên kiến nổi bật giải thích vì sao xu hướng:', 'Saliency explains why trends:', ['Bắt đầu chậm rồi tăng tốc khi trở nên nổi bật', 'Không bao giờ tồn tại', 'Luôn đi thẳng', 'Kết thúc ngay'], ['Start slowly then accelerate as they become salient', 'Never exist', 'Move straight', 'End at once'], 0, '', ''],
    ['Sức mạnh của số tròn làm hỗ trợ/kháng cự liên quan nhất tới:', 'Round-number S/R relates most to:', ['Neo', 'Chi phí chìm', 'Hiện trạng', 'Bảo thủ'], ['Anchoring', 'Sunk cost', 'Status quo', 'Conservatism'], 0, '', ''],
    ['"Giảm 60% so với đỉnh, quá rẻ rồi" là ví dụ kết hợp của:', '"Down 60% from the high, so cheap" combines:', ['Neo vào đỉnh và đóng khung theo %', 'Chi phí chìm và sở hữu', 'Nổi bật và hiện trạng', 'Không thiên kiến'], ['Anchoring on the high and % framing', 'Sunk cost and endowment', 'Saliency and status quo', 'No bias'], 0, '', ''],
    ['Bình quân giá xuống liên tục để "không phí khoản đã đầu tư" là:', 'Averaging down repeatedly to "not waste" the investment:', ['Chi phí chìm', 'Đóng khung', 'Nổi bật', 'Đại diện'], ['Sunk cost', 'Framing', 'Saliency', 'Representativeness'], 0, '', ''],
    ['Thiên kiến nhận thức liên quan tới:', 'Perception biases concern:', ['Cách tiếp nhận và trình bày thông tin', 'Khối lượng giao dịch', 'Lãi suất', 'Thuế'], ['How information is perceived and presented', 'Volume', 'Rates', 'Taxes'], 0, '', ''],
    ['Cách phòng vệ tốt trước đóng khung:', 'A good defence against framing:', ['Xem thông tin theo nhiều khung (% và tuyệt đối, lãi và lỗ)', 'Chỉ đọc tiêu đề', 'Tin quảng cáo', 'Bỏ qua dữ liệu'], ['View information in several frames', 'Read only headlines', 'Trust ads', 'Ignore data'], 0, '', ''],
    ['Bỏ qua một thay đổi chậm nhưng quan trọng (ví dụ lãi suất tăng dần) cho tới khi nó gây khủng hoảng là do:', 'Ignoring a slow but important change until it causes a crisis is due to:', ['Thiếu tính nổi bật', 'Chi phí chìm', 'Sở hữu', 'Không gì'], ['Lack of saliency', 'Sunk cost', 'Endowment', 'Nothing'], 0, '', ''],
    ['Điểm dừng đặt trước giúp chống lại:', 'Pre-set stops help counter:', ['Chi phí chìm và ghét lỗ', 'Thông tin', 'Lợi nhuận', 'Thanh khoản'], ['Sunk cost and loss aversion', 'Information', 'Profit', 'Liquidity'], 0, '', ''],
    ['Neo giá mua khiến nhà đầu tư:', 'Anchoring to cost makes investors:', ['Đợi hoà vốn mới bán', 'Bán sớm', 'Không giao dịch', 'Mua thêm ngay'], ['Wait to break even before selling', 'Sell early', 'Not trade', 'Buy more at once'], 0, '', ''],
    ['Nhật ký giao dịch giúp:', 'A trading journal helps:', ['Nhận ra thiên kiến lặp lại của bản thân', 'Tăng phí', 'Giảm dữ liệu', 'Không gì'], ['Spot your recurring biases', 'Raise fees', 'Reduce data', 'Nothing'], 0, '', ''],
    ['Nhà đầu tư mua vì "cổ phiếu này vừa lên bản tin thời sự". Thiên kiến chính:', 'Buying because "it was on the evening news":', ['Nổi bật', 'Chi phí chìm', 'Sở hữu', 'Bảo thủ'], ['Saliency', 'Sunk cost', 'Endowment', 'Conservatism'], 0, '', ''],
    ['Chi phí chìm nên được:', 'Sunk costs should be:', ['Bỏ qua khi quyết định tương lai', 'Là yếu tố quyết định chính', 'Gỡ lại bằng mọi giá', 'Tăng gấp đôi'], ['Ignored for future decisions', 'The main driver', 'Recovered at all costs', 'Doubled'], 0, '', ''],
    ['Đóng khung ảnh hưởng tới quyết định vì:', 'Framing affects decisions because:', ['Con người phản ứng với cách trình bày, không chỉ với nội dung', 'Do luật', 'Thông tin khác nhau', 'Không ảnh hưởng'], ['People react to presentation, not just content', 'Law', 'Different facts', 'It doesn’t'], 0, '', ''],
    ['Neo có thể tạo hỗ trợ/kháng cự vì:', 'Anchoring can create S/R because:', ['Nhiều người cùng bám vào các mức giá đáng nhớ', 'Do sàn quy định', 'Không đúng', 'Do cổ tức'], ['Many people fixate on memorable levels', 'Exchange rules', 'False', 'Dividends'], 0, '', '']
  ]);

  /* ================= L2-20 ================= */
  C.addLesson('l2-20', {
    goals: ['Mô tả ba hiệu ứng quán tính: hiệu ứng sở hữu, thiên kiến hiện trạng, hiệu ứng phân bổ.', 'Minh hoạ ảnh hưởng của mỗi hiệu ứng tới hành vi nhà đầu tư và tới giá.'],
    body: () => `
<h3>1. Hiệu ứng quán tính là gì?</h3>
<p>Hiệu ứng quán tính (inertial effects) khiến con người <b>ngại thay đổi</b> vị thế, danh mục và niềm tin hiện có, ngay cả khi thay đổi là hợp lý.</p>
<table class="tbl"><thead><tr><th>Hiệu ứng</th><th>Bản chất</th><th>Hành vi đầu tư</th></tr></thead><tbody>
<tr><td><b>Sở hữu (endowment)</b></td><td>Định giá thứ mình đang có cao hơn khi chưa có nó (giá muốn bán &gt; giá sẵn sàng mua)</td><td>Giữ cổ phiếu được thừa kế/được thưởng dù không còn phù hợp; đặt giá bán quá cao</td></tr>
<tr><td><b>Hiện trạng (status quo)</b></td><td>Ưu tiên giữ nguyên, coi "không làm gì" là lựa chọn mặc định an toàn</td><td>Không tái cân bằng danh mục; giữ phân bổ mặc định trong quỹ hưu trí nhiều năm</td></tr>
<tr><td><b>Phân bổ (disposition)</b></td><td>Bán mã đang lãi quá sớm, giữ mã đang lỗ quá lâu</td><td>Trái nguyên tắc "cắt lỗ, để lãi chạy"</td></tr></tbody></table>
<h3>2. Ảnh hưởng tới giá — vì sao tạo ra xu hướng</h3>
<ul><li><b>Phân bổ</b>: khi có tin tốt, người đang lãi bán sớm, tạo lực cung tạm thời, khiến giá phản ứng <b>chậm</b> so với thông tin. Phần còn lại được "trả" dần theo thời gian → <b>động lượng/xu hướng</b>. Khi có tin xấu, người đang lỗ không bán, cũng làm giá giảm chậm.</li>
<li><b>Hiện trạng và sở hữu</b>: dòng tiền điều chỉnh chậm, nhà đầu tư cập nhật danh mục từ từ, kéo dài các xu hướng phân bổ tài sản.</li>
<li><b>Vùng hoà vốn</b>: số lượng lớn cổ phiếu được mua ở một vùng giá rồi bị lỗ trở thành <b>nguồn cung chờ</b> khi giá quay về vùng đó (kháng cự).</li></ul>
<div class="callout">Nhà PTKT tận dụng: xu hướng sau tin tức (trôi theo tin), kháng cự ở vùng tích tụ khối lượng lớn, và kỷ luật đi ngược hiệu ứng phân bổ của chính mình — <b>cắt lỗ nhanh, để lãi chạy</b>.</div>`,
    keys: ['Ba hiệu ứng quán tính: sở hữu, hiện trạng, phân bổ.', 'Sở hữu: định giá thứ đang có cao hơn; hiện trạng: mặc định giữ nguyên; phân bổ: bán lãi sớm, giữ lỗ lâu.', 'Phân bổ làm giá phản ứng chậm với tin → tạo động lượng/xu hướng.', 'Vùng hoà vốn của người đang lỗ tạo kháng cự.', 'Kỷ luật: cắt lỗ nhanh, để lãi chạy.'],
    terms: [['Inertial effects', 'Hiệu ứng quán tính'], ['Endowment effect', 'Hiệu ứng sở hữu'], ['Status quo bias', 'Thiên kiến hiện trạng'], ['Disposition effect', 'Hiệu ứng phân bổ'], ['Overhang supply', 'Nguồn cung treo']]
  }, {
    goals: ['Describe endowment, status quo and disposition effects.', 'Illustrate effects on behaviour and prices.'],
    body: () => `
<h3>1. Inertial effects</h3><table class="tbl"><tbody><tr><td>Endowment</td><td>valuing what you own more</td></tr><tr><td>Status quo</td><td>defaulting to no change</td></tr><tr><td>Disposition</td><td>selling winners early, holding losers</td></tr></tbody></table>
<h3>2. Price effects</h3><ul><li>Disposition makes prices underreact, producing momentum.</li><li>Slow portfolio updating extends allocation trends.</li><li>Break-even overhang creates resistance.</li></ul><div class="callout">Exploit post-news drift and overhang resistance; personally, cut losses and let profits run.</div>`,
    keys: ['Endowment, status quo, disposition.', 'Underreaction → momentum.', 'Overhang resistance.', 'Cut losses, let profits run.'],
    terms: [['Disposition effect', 'Sell winners, hold losers'], ['Overhang', 'Supply from trapped holders']]
  }, [
    ['Ba hiệu ứng quán tính trong bài gồm:', 'The three inertial effects are:', ['Sở hữu, hiện trạng, phân bổ', 'Neo, khung, nổi bật', 'Đại diện, sẵn có, neo', 'Ghét lỗ, chắc chắn, cô lập'], ['Endowment, status quo, disposition', 'Anchoring, framing, saliency', 'Representativeness, availability, anchoring', 'Loss aversion, certainty, isolation'], 0, '', ''],
    ['Giá muốn bán cao hơn nhiều giá sẵn sàng mua cho cùng một món là:', 'Asking far more to sell than you’d pay to buy:', ['Hiệu ứng sở hữu', 'Hiện trạng', 'Phân bổ', 'Neo'], ['Endowment effect', 'Status quo', 'Disposition', 'Anchoring'], 0, '', ''],
    ['Không tái cân bằng danh mục nhiều năm vì "cứ để vậy" là:', 'Never rebalancing because "just leave it":', ['Thiên kiến hiện trạng', 'Phân bổ', 'Nổi bật', 'Chắc chắn'], ['Status quo bias', 'Disposition', 'Saliency', 'Certainty'], 0, '', ''],
    ['Bán mã đang lãi 8% nhưng giữ mã đang lỗ 25% là:', 'Selling a +8% winner while holding a −25% loser:', ['Hiệu ứng phân bổ', 'Hiệu ứng sở hữu', 'Đóng khung', 'Nổi bật'], ['Disposition effect', 'Endowment', 'Framing', 'Saliency'], 0, '', ''],
    ['Hiệu ứng phân bổ làm giá phản ứng với tin tốt:', 'The disposition effect makes prices react to good news:', ['Chậm hơn — tạo xu hướng/động lượng sau tin', 'Nhanh hơn', 'Không phản ứng', 'Ngược chiều'], ['More slowly — post-news drift/momentum', 'Faster', 'Not at all', 'Opposite'], 0, '', ''],
    ['Vùng giá có nhiều người mua rồi bị lỗ thường trở thành:', 'A zone where many bought and are now losing becomes:', ['Kháng cự khi giá quay lại', 'Hỗ trợ', 'Không gì', 'Gap'], ['Resistance when revisited', 'Support', 'Nothing', 'Gap'], 0, '', ''],
    ['Giữ cổ phiếu được thừa kế dù không còn phù hợp chủ yếu do:', 'Keeping inherited stock that no longer fits is mainly due to:', ['Sở hữu và hiện trạng', 'Nổi bật', 'Đóng khung', 'Không gì'], ['Endowment and status quo', 'Saliency', 'Framing', 'Nothing'], 0, '', ''],
    ['Kỷ luật đối nghịch với hiệu ứng phân bổ là:', 'The discipline opposite to the disposition effect:', ['Cắt lỗ nhanh, để lãi chạy', 'Bán lãi sớm', 'Giữ lỗ', 'Không giao dịch'], ['Cut losses fast, let profits run', 'Sell winners early', 'Hold losers', 'Don’t trade'], 0, '', ''],
    ['Hiệu ứng quán tính khiến con người:', 'Inertial effects make people:', ['Ngại thay đổi vị thế và niềm tin', 'Giao dịch liên tục', 'Luôn bán', 'Luôn mua'], ['Reluctant to change positions and beliefs', 'Trade constantly', 'Always sell', 'Always buy'], 0, '', ''],
    ['"Nguồn cung treo" (overhang) hình thành do:', 'Overhang supply forms because:', ['Người đang lỗ chờ hoà vốn để bán', 'Cổ tức', 'Lãi suất', 'Không gì'], ['Losing holders wait to break even', 'Dividends', 'Rates', 'Nothing'], 0, '', ''],
    ['Với tin xấu, hiệu ứng phân bổ khiến:', 'With bad news, the disposition effect causes:', ['Người lỗ không bán → giá giảm chậm', 'Bán tháo tức thì', 'Không ảnh hưởng', 'Giá tăng'], ['Losers don’t sell → slower declines', 'Instant dumping', 'No effect', 'Rising prices'], 0, '', ''],
    ['Lựa chọn mặc định trong quỹ hưu trí được giữ nhiều năm là ví dụ của:', 'Keeping a pension’s default allocation for years:', ['Hiện trạng', 'Phân bổ', 'Nổi bật', 'Neo'], ['Status quo', 'Disposition', 'Saliency', 'Anchoring'], 0, '', ''],
    ['Xu hướng phân bổ tài sản kéo dài một phần do:', 'Asset-allocation trends persist partly because:', ['Nhà đầu tư cập nhật danh mục từ từ (quán tính)', 'Luật', 'Không có lý do', 'Cổ tức'], ['Investors update slowly (inertia)', 'Law', 'No reason', 'Dividends'], 0, '', ''],
    ['Đặt giá bán quá cao cho căn nhà mình đang ở là:', 'Overpricing your own home for sale:', ['Hiệu ứng sở hữu', 'Phân bổ', 'Nổi bật', 'Chi phí chìm'], ['Endowment', 'Disposition', 'Saliency', 'Sunk cost'], 0, '', ''],
    ['Nhà PTKT có thể tận dụng hiệu ứng phân bổ bằng cách:', 'Technicians can exploit the disposition effect by:', ['Theo xu hướng sau tin tức và chú ý kháng cự ở vùng tích tụ', 'Bắt đáy mọi lúc', 'Bỏ qua tin', 'Không làm gì'], ['Following post-news drift and watching overhang resistance', 'Bottom-fishing always', 'Ignoring news', 'Nothing'], 0, '', ''],
    ['Hiệu ứng phân bổ liên quan chặt với:', 'The disposition effect is closely tied to:', ['Ghét lỗ và neo giá mua', 'Lãi suất', 'Biến động ngụ ý', 'Độ rộng'], ['Loss aversion and cost anchoring', 'Rates', 'Implied vol', 'Breadth'], 0, '', ''],
    ['"Không làm gì" được coi là an toàn — đây là:', '"Doing nothing" feels safe — this is:', ['Thiên kiến hiện trạng', 'Hiệu ứng chắc chắn', 'Đóng khung', 'Nổi bật'], ['Status quo bias', 'Certainty effect', 'Framing', 'Saliency'], 0, '', ''],
    ['Hệ quả thị trường của quán tính tổng hợp:', 'Aggregate market consequence of inertia:', ['Thông tin được phản ánh dần dần — xu hướng', 'Giá ngẫu nhiên', 'Không có xu hướng', 'Gap liên tục'], ['Information is reflected gradually — trends', 'Random prices', 'No trends', 'Constant gaps'], 0, '', ''],
    ['Câu hỏi "nếu chưa có, tôi có mua không?" giúp chống:', '"If I didn’t own it, would I buy?" counters:', ['Hiệu ứng sở hữu', 'Lãi suất', 'Biến động', 'Thanh khoản'], ['Endowment effect', 'Rates', 'Volatility', 'Liquidity'], 0, '', ''],
    ['Quỹ tự động tái cân bằng định kỳ giúp chống:', 'Automatic periodic rebalancing counters:', ['Thiên kiến hiện trạng', 'Đóng khung', 'Nổi bật', 'Đại diện'], ['Status quo bias', 'Framing', 'Saliency', 'Representativeness'], 0, '', '']
  ]);

  /* ================= L2-21 ================= */
  C.addLesson('l2-21', {
    goals: ['Đánh giá tác động của giao dịch nội bộ lên giá.', 'So sánh mua nội bộ và bán nội bộ.', 'Phân tích short interest và tỷ lệ short interest.', 'Diễn giải tâm lý từ khảo sát nhà đầu tư và chuyên gia.'],
    body: () => `
<h3>1. Giao dịch nội bộ</h3>
<ul><li>Người nội bộ (ban điều hành, thành viên hội đồng quản trị, cổ đông lớn) có hiểu biết sâu nhất về doanh nghiệp. Giao dịch của họ phải được công bố.</li>
<li><b>Mua nội bộ</b> có giá trị thông tin cao hơn <b>bán nội bộ</b>: người ta bán vì nhiều lý do (đa dạng hoá, thuế, nhu cầu tiền, thực hiện quyền chọn thưởng), nhưng chủ yếu mua vì kỳ vọng giá tăng.</li>
<li>Tín hiệu mạnh hơn khi: <b>mua cụm</b> (nhiều người nội bộ cùng mua trong thời gian ngắn), giá trị lớn so với tài sản cá nhân, mua sau nhịp giảm mạnh, người mua là lãnh đạo cấp cao.</li>
<li>Tỷ lệ bán/mua nội bộ trên toàn thị trường có thể dùng như chỉ báo tâm lý: khi người nội bộ toàn thị trường mua nhiều bất thường thường gần đáy.</li></ul>
<h3>2. Short interest</h3>
<ul><li><b>Short interest</b> = tổng số cổ phiếu đang bị bán khống chưa mua lại.</li>
<li><b>Tỷ lệ short interest (days to cover)</b> = short interest ÷ khối lượng giao dịch trung bình ngày. Đây là số ngày cần để tất cả người bán khống mua lại.</li>
<li>Diễn giải kép: short interest cao = bi quan (thường đúng về cơ bản) nhưng cũng là <b>nhiên liệu tiềm năng</b> cho short squeeze nếu giá tăng. Ở cấp toàn thị trường, tỷ lệ short interest cao thường có ý nghĩa tăng giá (theo hướng ngược).</li></ul>
<div class="callout"><b>Ví dụ</b>: short interest 6 triệu cổ phiếu, khối lượng trung bình 800.000/ngày → days to cover = <b>7.5 ngày</b>. Nếu giá phá kháng cự lớn, việc mua lại có thể kéo dài nhiều phiên và đẩy giá.</div>
<h3>3. Khảo sát tâm lý</h3>
<table class="tbl"><thead><tr><th>Đối tượng</th><th>Cách dùng</th></tr></thead><tbody>
<tr><td>Nhà đầu tư cá nhân (khảo sát hằng tuần lạc quan/bi quan/trung lập)</td><td>Theo hướng ngược ở cực trị; nên làm mượt (MA 4–8 tuần) và so với phân vị lịch sử</td></tr>
<tr><td>Chuyên gia viết bản tin</td><td>Họ theo xu hướng, nên tỷ lệ lạc quan rất cao (và bi quan rất thấp) là cảnh báo</td></tr>
<tr><td>Quản lý quỹ (phân bổ, tiền mặt)</td><td>Tiền mặt thấp = đã đầu tư hết, sức mua cạn; tiền mặt cao = nhiên liệu cho tăng giá</td></tr></tbody></table>
<p>Khảo sát có độ trễ và sai số mẫu. Hãy chú ý <b>chênh lệch</b> (lạc quan − bi quan) và các cực trị, không phải từng con số tuần.</p>
${H.sentProxy()}`,
    keys: ['Mua nội bộ có giá trị thông tin cao hơn bán; mua cụm, giá trị lớn, sau nhịp giảm là tín hiệu mạnh.', 'Short interest và days to cover = SI / KL trung bình ngày.', 'SI cao: bi quan nhưng là nhiên liệu short squeeze; cấp thị trường thường mang ý nghĩa ngược (tăng).', 'Khảo sát cá nhân, bản tin, quản lý quỹ: dùng ngược ở cực trị, làm mượt, chú ý chênh lệch.'],
    terms: [['Cluster buying', 'Mua cụm'], ['Short interest ratio', 'Tỷ lệ short interest (days to cover)'], ['Bull–bear spread', 'Chênh lệch lạc quan − bi quan'], ['Fund cash levels', 'Tỷ lệ tiền mặt của quỹ']]
  }, {
    goals: ['Appraise insider activity.', 'Insider buying vs selling.', 'Short interest and the short-interest ratio.', 'Survey-based sentiment.'],
    body: () => `
<h3>1. Insiders</h3><ul><li>Buying carries more information than selling.</li><li>Stronger: clusters, large size, after declines, senior buyers.</li><li>Market-wide insider ratios as sentiment.</li></ul>
<h3>2. Short interest</h3><ul><li>Days to cover = short interest ÷ average daily volume.</li><li>High SI: pessimism but squeeze fuel; market-wide high ratios often bullish (contrarian).</li></ul><div class="callout">6M short, 800k ADV → 7.5 days.</div>
<h3>3. Surveys</h3><table class="tbl"><tbody><tr><td>Individuals</td><td>fade extremes; smooth; percentiles</td></tr><tr><td>Newsletter writers</td><td>trend followers — extremes warn</td></tr><tr><td>Fund managers</td><td>low cash = little buying power</td></tr></tbody></table><p>Watch spreads and extremes.</p>${H.sentProxy()}`,
    keys: ['Insider buying > selling.', 'Days to cover.', 'Squeeze fuel.', 'Survey extremes.'],
    terms: [['Days to cover', 'Short interest / ADV'], ['Cluster buying', 'Several insiders buying together']]
  }, [
    ['Vì sao mua nội bộ có giá trị thông tin cao hơn bán nội bộ?', 'Why does insider buying carry more information than selling?', ['Bán có nhiều lý do, mua chủ yếu vì kỳ vọng giá tăng', 'Mua hiếm hơn nên không ý nghĩa', 'Do luật', 'Không đúng'], ['Selling has many motives; buying mostly one', 'Buying is rarer so meaningless', 'Law', 'False'], 0, '', ''],
    ['Tín hiệu nội bộ mạnh nhất:', 'The strongest insider signal:', ['Nhiều lãnh đạo cấp cao cùng mua giá trị lớn sau nhịp giảm mạnh', 'Một người bán nhỏ', 'Thực hiện quyền chọn thưởng', 'Bán để nộp thuế'], ['Several senior insiders buying large amounts after a steep fall', 'One small sale', 'Option exercise', 'Tax sale'], 0, '', ''],
    ['Short interest 9 triệu, KL trung bình 1.5 triệu/ngày. Days to cover:', 'Short interest 9M, ADV 1.5M. Days to cover:', ['1.5', '6', '9', '13.5'], null, 1, '9 / 1.5 = 6.', ''],
    ['Short interest cao có ý nghĩa kép vì:', 'High short interest is double-edged because:', ['Phản ánh bi quan nhưng cũng là nhiên liệu cho short squeeze', 'Luôn tăng giá', 'Luôn giảm giá', 'Không ý nghĩa'], ['It shows pessimism but fuels squeezes', 'Always bullish', 'Always bearish', 'Meaningless'], 0, '', ''],
    ['Ở cấp toàn thị trường, tỷ lệ short interest cao kỷ lục thường được xem là:', 'Market-wide record short-interest ratios are often seen as:', ['Tín hiệu tăng (theo hướng ngược)', 'Tín hiệu giảm mạnh', 'Không ý nghĩa', 'Lỗi'], ['Bullish (contrarian)', 'Strongly bearish', 'Meaningless', 'Error'], 0, '', ''],
    ['Bán nội bộ có thể vì lý do không liên quan triển vọng như:', 'Insider selling may be unrelated to outlook, e.g.:', ['Đa dạng hoá, thuế, nhu cầu tiền', 'Kỳ vọng giá tăng', 'Mua cụm', 'Không có'], ['Diversification, taxes, cash needs', 'Expected rise', 'Cluster buying', 'None'], 0, '', ''],
    ['Chuyên gia viết bản tin thường:', 'Newsletter writers tend to:', ['Theo xu hướng — mức lạc quan rất cao là cảnh báo', 'Đi ngược xu hướng', 'Không có quan điểm', 'Luôn đúng'], ['Follow trends — very high bullishness warns', 'Fade trends', 'Have no view', 'Always be right'], 0, '', ''],
    ['Tiền mặt của các quỹ ở mức thấp kỷ lục cho thấy:', 'Record-low fund cash shows:', ['Sức mua còn lại ít — rủi ro', 'Nhiên liệu tăng giá dồi dào', 'Không ý nghĩa', 'Đáy'], ['Little buying power left — risk', 'Ample fuel', 'Nothing', 'Bottom'], 0, '', ''],
    ['Khảo sát cá nhân nên được xử lý bằng:', 'Individual surveys should be processed by:', ['Làm mượt và so với phân vị lịch sử', 'Dùng từng tuần riêng lẻ', 'Bỏ qua', 'Nhân đôi'], ['Smoothing and historical percentiles', 'Single weeks', 'Ignoring', 'Doubling'], 0, '', ''],
    ['Chênh lệch "lạc quan − bi quan" cực cao trong khảo sát cá nhân gợi ý:', 'An extreme bull–bear spread among individuals suggests:', ['Rủi ro đỉnh (ngược)', 'Mua thêm', 'Không gì', 'Đáy'], ['Top risk (contrarian)', 'Buy more', 'Nothing', 'Bottom'], 0, '', ''],
    ['Days to cover cao + giá phá kháng cự lớn có thể dẫn tới:', 'High days-to-cover + a major breakout may cause:', ['Short squeeze kéo dài nhiều phiên', 'Giảm mạnh', 'Không gì', 'Cổ tức'], ['A multi-day short squeeze', 'Sharp decline', 'Nothing', 'Dividend'], 0, '', ''],
    ['Giao dịch nội bộ hữu ích nhất ở khung thời gian:', 'Insider data is most useful over:', ['Trung–dài hạn', 'Vài phút', 'Trong phiên', 'Không khung nào'], ['Intermediate to long term', 'Minutes', 'Intraday', 'None'], 0, '', ''],
    ['Hạn chế của dữ liệu khảo sát:', 'Survey data limitation:', ['Độ trễ và sai số mẫu', 'Quá chính xác', 'Không có dữ liệu', 'Không có'], ['Lags and sampling error', 'Too precise', 'No data', 'None'], 0, '', ''],
    ['Tỷ lệ bán/mua nội bộ toàn thị trường thấp bất thường (mua nhiều) thường gần:', 'An unusually low market-wide insider sell/buy ratio usually comes near:', ['Đáy', 'Đỉnh', 'Giữa xu hướng', 'Không liên quan'], ['Bottoms', 'Tops', 'Mid-trend', 'Unrelated'], 0, '', ''],
    ['Short interest là:', 'Short interest is:', ['Tổng cổ phiếu đang bị bán khống chưa mua lại', 'Khối lượng ngày', 'Số lệnh mua', 'Cổ tức'], ['Total shares sold short not yet covered', 'Daily volume', 'Buy orders', 'Dividends'], 0, '', ''],
    ['Việc thực hiện quyền chọn cổ phiếu thưởng rồi bán ngay của lãnh đạo:', 'Executives exercising and immediately selling award options:', ['Thường mang ít thông tin', 'Là tín hiệu bán mạnh', 'Là tín hiệu mua', 'Bị cấm'], ['Usually carries little information', 'A strong sell', 'A buy', 'Banned'], 0, '', ''],
    ['Short interest cao về cơ bản thường:', 'High short interest is fundamentally often:', ['Đúng về cơ bản, nhưng điểm vào lệnh bán khống muộn có rủi ro squeeze', 'Luôn sai', 'Không liên quan', 'Đảm bảo lợi nhuận'], ['Fundamentally right but late shorts risk squeezes', 'Always wrong', 'Unrelated', 'Guaranteed profit'], 0, '', ''],
    ['Khảo sát tâm lý cho thấy điều gì tốt nhất?', 'Surveys best reveal:', ['Mức độ rủi ro ở cực trị, không phải thời điểm chính xác', 'Thời điểm chính xác', 'Giá mục tiêu', 'Lợi nhuận doanh nghiệp'], ['Risk at extremes, not exact timing', 'Exact timing', 'Targets', 'Earnings'], 0, '', ''],
    ['Ở Việt Nam, giao dịch của người nội bộ phải:', 'In Vietnam, insider trades must be:', ['Công bố thông tin trước và sau giao dịch', 'Giữ bí mật', 'Không được phép', 'Chỉ công bố cuối năm'], ['Disclosed before and after trading', 'Kept secret', 'Forbidden', 'Disclosed annually'], 0, '', ''],
    ['Kết hợp tốt nhất để dùng các chỉ báo tâm lý cổ phiếu:', 'Best way to use stock-sentiment indicators:', ['Kết hợp nhiều nguồn, tìm cực trị, chờ giá xác nhận', 'Một chỉ báo duy nhất', 'Theo tin đồn', 'Bỏ qua giá'], ['Combine sources, find extremes, await price confirmation', 'One indicator', 'Rumours', 'Ignore price'], 0, '', '']
  ]);

  /* ================= L2-22 ================= */
  C.addLesson('l2-22', {
    goals: ['Diễn giải thay đổi OI hợp đồng tương lai trong bối cảnh giá.', 'Phân tích báo cáo Commitments of Traders.', 'Dùng tỷ lệ put/call quyền chọn làm chỉ báo tâm lý.', 'Diễn giải dữ liệu biến động từ thị trường quyền chọn.'],
    body: () => `
<h3>1. OI hợp đồng tương lai và giá</h3>
<p>Quy tắc chuẩn (Level 1 và Bài 7): giá và OI cùng tăng là xu hướng mạnh với tiền mới; giá tăng OI giảm là short covering. Bổ sung:</p>
<ul><li><b>OI cực cao ở cuối một xu hướng dài</b>: nhiều vị thế cùng phía, rủi ro thanh lý dây chuyền khi xu hướng đảo.</li>
<li><b>OI giảm mạnh sau cao trào</b>: các vị thế yếu đã bị loại, thị trường "sạch" hơn cho xu hướng mới.</li></ul>
<h3>2. Báo cáo Commitments of Traders (COT)</h3>
<table class="tbl"><thead><tr><th>Nhóm</th><th>Hành vi</th><th>Cách dùng</th></tr></thead><tbody>
<tr><td><b>Commercials</b> (nhà phòng ngừa: nhà sản xuất, người tiêu dùng hàng hoá)</td><td>Thường giao dịch <b>ngược xu hướng</b>: bán khi giá cao, mua khi giá thấp</td><td>Vị thế ròng cực đoan theo hướng mua thường gần đáy giá — "tiền thông minh"</td></tr>
<tr><td><b>Large speculators</b> (quỹ, CTA)</td><td>Theo xu hướng</td><td>Đúng trong xu hướng, nhưng vị thế cực đoan thường xuất hiện gần đỉnh/đáy</td></tr>
<tr><td><b>Small traders</b> (phần còn lại)</td><td>Thường sai ở cực trị</td><td>Dùng theo hướng ngược</td></tr></tbody></table>
<p><b>Chỉ số COT</b> = (vị thế ròng hiện tại − thấp nhất N tuần)/(cao nhất N tuần − thấp nhất N tuần) × 100. Giá trị gần 100 hoặc 0 là cực trị của nhóm đó trong N tuần (ví dụ 3 năm).</p>
<div class="callout"><b>Ví dụ</b>: vị thế ròng commercials hiện tại +20.000, thấp nhất 3 năm −60.000, cao nhất +40.000 → chỉ số COT = (20.000 + 60.000)/(100.000) × 100 = <b>80</b>: commercials đang mua ròng ở mức cao so với lịch sử → nghiêng tăng.</div>
<h3>3. Tỷ lệ put/call</h3>
<ul><li><b>Put/call cổ phiếu</b> (nhiều nhà đầu tư nhỏ lẻ, đầu cơ) phản ánh tâm lý đám đông tốt hơn; <b>put/call chỉ số</b> chịu ảnh hưởng của phòng ngừa tổ chức (thường cao một cách cấu trúc).</li>
<li>Làm mượt bằng MA 5–21 ngày; so với dải Bollinger hoặc phân vị.</li>
<li>Có thể dùng theo khối lượng hoặc theo OI, hoặc theo <b>giá trị phí</b> (dollar-weighted) — tập trung vào tiền thật bỏ ra.</li></ul>
<h3>4. Dữ liệu biến động từ quyền chọn</h3>
<ul><li><b>VIX và IV của cổ phiếu</b>: cao = sợ hãi; IV của một cổ phiếu tăng mạnh trước tin có thể báo sự kiện.</li>
<li><b>Skew</b>: put OTM đắt bất thường = nhu cầu bảo hiểm sập giá cao.</li>
<li><b>Cấu trúc kỳ hạn</b>: đảo ngược = căng thẳng cấp tính.</li>
<li>Crypto: funding rate, OI và tỷ lệ long/short trên hợp đồng vĩnh cửu là "COT" của thị trường crypto.</li></ul>`,
    keys: ['OI cực cao cuối xu hướng = rủi ro thanh lý dây chuyền; OI giảm mạnh sau cao trào = thị trường sạch.', 'COT: commercials ngược xu hướng (tiền thông minh ở cực trị), large specs theo xu hướng, small traders sai ở cực trị.', 'Chỉ số COT = (ròng − min)/(max − min) × 100.', 'Put/call cổ phiếu phản ánh đám đông tốt hơn put/call chỉ số; làm mượt, phân vị, dollar-weighted.', 'VIX/IV, skew, cấu trúc kỳ hạn; crypto: funding, OI, long/short.'],
    terms: [['Commercials', 'Nhà phòng ngừa thương mại'], ['Large speculators', 'Đầu cơ lớn'], ['COT index', 'Chỉ số COT'], ['Dollar-weighted put/call', 'Put/call theo giá trị phí'], ['Skew', 'Độ lệch biến động']]
  }, {
    goals: ['Interpret futures OI with price.', 'Analyse the COT report.', 'Use put/call ratios.', 'Interpret options volatility data.'],
    body: () => `
<h3>1. OI</h3><ul><li>Very high OI late in a trend = liquidation risk.</li><li>Collapsing OI after a climax = cleaner market.</li></ul>
<h3>2. COT</h3><table class="tbl"><tbody><tr><td>Commercials</td><td>counter-trend hedgers; extremes = smart money</td></tr><tr><td>Large speculators</td><td>trend followers; extremes near turns</td></tr><tr><td>Small traders</td><td>fade extremes</td></tr></tbody></table><p>COT index = (net − min)/(max − min)·100.</p><div class="callout">Net +20k, 3-year range −60k…+40k → 80.</div>
<h3>3. Put/call</h3><ul><li>Equity (crowd) vs index (hedging).</li><li>Smooth; percentiles; dollar-weighted versions.</li></ul>
<h3>4. Volatility data</h3><ul><li>VIX/IV, skew, term structure.</li><li>Crypto: funding, OI, long/short ratios.</li></ul>`,
    keys: ['OI extremes.', 'COT groups.', 'COT index.', 'Put/call variants.', 'Vol data.'],
    terms: [['COT index', 'Normalised net position'], ['Commercials', 'Hedgers']]
  }, [
    ['OI cực cao ở cuối một xu hướng tăng dài cho thấy:', 'Very high OI late in a long uptrend shows:', ['Rủi ro thanh lý dây chuyền khi xu hướng đảo', 'Không rủi ro', 'Đáy', 'Thị trường sạch'], ['Liquidation-cascade risk on a reversal', 'No risk', 'Bottom', 'Clean market'], 0, '', ''],
    ['Commercials trong COT thường:', 'COT commercials usually:', ['Giao dịch ngược xu hướng (phòng ngừa)', 'Theo xu hướng', 'Không giao dịch', 'Luôn bán'], ['Trade counter-trend (hedging)', 'Follow trends', 'Don’t trade', 'Always sell'], 0, '', ''],
    ['Large speculators thường:', 'Large speculators usually:', ['Theo xu hướng', 'Ngược xu hướng', 'Là nhà sản xuất', 'Không có'], ['Follow trends', 'Fade trends', 'Are producers', 'Don’t exist'], 0, '', ''],
    ['Ròng hiện tại 10.000; min 3 năm −30.000; max 50.000. Chỉ số COT:', 'Net 10,000; 3-year min −30,000; max 50,000. COT index:', ['20', '50', '62.5', '80'], null, 1, '(10.000 + 30.000)/80.000 × 100 = 50.', ''],
    ['Chỉ số COT của commercials = 95 cho thấy:', 'Commercials’ COT index at 95 shows:', ['Commercials mua ròng ở mức cực trị — nghiêng tăng', 'Bán ròng cực trị', 'Trung tính', 'Lỗi'], ['Extreme net buying — bullish lean', 'Extreme net selling', 'Neutral', 'Error'], 0, '', ''],
    ['Vì sao put/call chỉ số thường cao một cách cấu trúc?', 'Why is the index put/call structurally high?', ['Tổ chức mua put chỉ số để phòng ngừa danh mục', 'Nhà đầu tư nhỏ thích put', 'Do luật', 'Không đúng'], ['Institutions buy index puts to hedge', 'Retail loves puts', 'Law', 'False'], 0, '', ''],
    ['Put/call nào phản ánh tâm lý đám đông tốt hơn?', 'Which put/call better reflects the crowd?', ['Put/call cổ phiếu', 'Put/call chỉ số', 'Như nhau', 'Không loại nào'], ['Equity put/call', 'Index put/call', 'Equal', 'Neither'], 0, '', ''],
    ['Put/call theo giá trị phí (dollar-weighted) tập trung vào:', 'Dollar-weighted put/call focuses on:', ['Tiền thật bỏ ra, không chỉ số hợp đồng', 'Khối lượng cổ phiếu', 'Số mã', 'Cổ tức'], ['Real money spent, not contract counts', 'Share volume', 'Issue counts', 'Dividends'], 0, '', ''],
    ['OI giảm mạnh sau một cao trào bán:', 'Collapsing OI after a selling climax:', ['Vị thế yếu bị loại — thị trường "sạch" hơn', 'Xu hướng giảm mạnh thêm chắc chắn', 'Không gì', 'Lỗi'], ['Weak positions flushed — cleaner market', 'Certain further decline', 'Nothing', 'Error'], 0, '', ''],
    ['Small traders trong COT thường được dùng:', 'COT small traders are usually used:', ['Theo hướng ngược ở cực trị', 'Theo hướng thuận', 'Không dùng', 'Làm benchmark'], ['Contrarily at extremes', 'Directly', 'Not at all', 'As a benchmark'], 0, '', ''],
    ['Skew put OTM cao bất thường cho thấy:', 'Unusually high OTM put skew shows:', ['Nhu cầu bảo hiểm sập giá cao', 'Tự mãn', 'Không gì', 'Thanh khoản thấp'], ['High demand for crash insurance', 'Complacency', 'Nothing', 'Low liquidity'], 0, '', ''],
    ['IV của một cổ phiếu tăng vọt trước tin tức:', 'A stock’s IV spiking before news:', ['Có thể báo hiệu sự kiện/kỳ vọng biến động lớn', 'Luôn vô nghĩa', 'Báo cổ tức', 'Lỗi'], ['May signal an event/expected big move', 'Meaningless', 'Dividend', 'Error'], 0, '', ''],
    ['"COT" của thị trường crypto có thể là:', 'Crypto’s "COT" equivalent:', ['Funding rate, OI, tỷ lệ long/short hợp đồng vĩnh cửu', 'Giá đóng cửa', 'Số ví', 'Không có'], ['Perpetual funding, OI, long/short ratios', 'Closes', 'Wallet count', 'None'], 0, '', ''],
    ['Put/call cổ phiếu nên được làm mượt bằng:', 'Equity put/call should be smoothed with:', ['MA 5–21 ngày', 'MA 500 ngày', 'Không làm mượt', 'RSI'], ['5–21-day MA', '500-day MA', 'No smoothing', 'RSI'], 0, '', ''],
    ['Giá tăng, OI tăng mạnh trên hợp đồng tương lai:', 'Futures price up, OI up strongly:', ['Xu hướng tăng với tiền mới — mạnh', 'Short covering', 'Yếu', 'Đáo hạn'], ['Uptrend with new money — strong', 'Short covering', 'Weak', 'Expiry'], 0, '', ''],
    ['COT được công bố ở Mỹ với tần suất:', 'The US COT report is published:', ['Hằng tuần', 'Hằng ngày', 'Hằng năm', 'Không công bố'], ['Weekly', 'Daily', 'Yearly', 'Never'], 0, '', ''],
    ['Large speculators có vị thế mua ròng cực đoan thường xuất hiện:', 'Extreme net-long large speculators tend to appear:', ['Gần đỉnh', 'Gần đáy', 'Giữa xu hướng giảm', 'Không bao giờ'], ['Near tops', 'Near bottoms', 'Mid-decline', 'Never'], 0, '', ''],
    ['Cấu trúc kỳ hạn biến động đảo ngược cho thấy:', 'An inverted volatility term structure shows:', ['Căng thẳng cấp tính', 'Yên bình', 'Không gì', 'Lãi suất giảm'], ['Acute stress', 'Calm', 'Nothing', 'Lower rates'], 0, '', ''],
    ['Chỉ số COT chuẩn hoá vị thế ròng nhằm:', 'The COT index normalises net positions to:', ['So sánh với dải lịch sử của chính nhóm đó', 'Tăng dữ liệu', 'Tính cổ tức', 'Không mục đích'], ['Compare with the group’s own historical range', 'Add data', 'Dividends', 'No purpose'], 0, '', ''],
    ['Cách dùng tốt nhất dữ liệu tâm lý phái sinh:', 'Best use of derivatives sentiment data:', ['Kết hợp nhiều nguồn, tìm cực trị, chờ giá xác nhận', 'Giao dịch theo một con số tuần', 'Bỏ qua giá', 'Theo tin đồn'], ['Combine sources, find extremes, await price confirmation', 'Trade one weekly number', 'Ignore price', 'Rumours'], 0, '', '']
  ]);
})(window.LLW);
