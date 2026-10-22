// © 2026 Lai Long Master TA. Bảo lưu mọi quyền. Không sao chép, chỉnh sửa hay dùng lại khi chưa được phép.
/* CMT Level 3 — Part 2a, lessons 8–11: asset relationships I. Written by Lai Long Master TA in its own words. */
(function (L) {
  'use strict';
  const C = L.cmt, H = C.demoHtml, S = C.stat;
  const ld = () => `<span class="spinner"></span>${L.t('loading')}`;

  /* ---------- demo: lead–lag correlation table ---------- */
  H.leadLag = (a = 'BTCUSDT', b = 'ETHUSDT', mk = 'bn_spot', tf = '1D') => C.demoShell('leadLag', C.symControls(mk, a, tf, ['1W', '1D', '4H', '1H', '15m', '5m']) + `<input class="d-sym2" value="${b}" spellcheck="false"><button class="btn primary d-go">${L.T('Phân tích', 'Analyse')}</button>`,
    L.T('Tương quan giữa lợi suất của mã thứ nhất hôm nay với lợi suất của mã thứ hai k kỳ trước (k dương = mã thứ hai đi trước). Kèm hồi quy cùng kỳ: beta, R².', 'Correlation of symbol 1 returns now with symbol 2 returns k bars earlier (k > 0 = symbol 2 leads), plus same-bar regression beta and R².'));
  C.demoRun.leadLag = box => {
    const out = box.querySelector('.demo-out'), el = box.querySelector('.demo-chart');
    if (el) el.style.display = 'none';
    C.wire(box, async () => {
      out.innerHTML = ld();
      try {
        const [mk, s1, tf] = C.readSym(box), s2 = box.querySelector('.d-sym2').value.trim().toUpperCase();
        const [A, B] = await Promise.all([C.loadBars(mk, s1, tf), C.loadBars(mk, s2, tf)]);
        const mb = new Map(B.map(x => [x.t, x.c])), j = A.filter(x => mb.has(x.t)).map(x => [x.c, mb.get(x.t)]).slice(-500);
        if (j.length < 60) throw new Error(L.T('Không đủ dữ liệu trùng thời gian.', 'Not enough overlapping data.'));
        const ra = [], rb = []; for (let i = 1; i < j.length; i++) { ra.push(Math.log(j[i][0] / j[i - 1][0])); rb.push(Math.log(j[i][1] / j[i - 1][1])); }
        const n = ra.length, band = 2 / Math.sqrt(n), rows = [];
        for (let k = -5; k <= 5; k++) {
          const x = [], y = []; for (let i = 0; i < n; i++) { const jj = i - k; if (jj >= 0 && jj < n) { y.push(ra[i]); x.push(rb[jj]); } }
          const r = S.corr(x, y); rows.push(`<tr${k === 0 ? ' style="font-weight:700"' : ''}><td>${k > 0 ? s2 + ' ' + L.T('đi trước', 'leads') + ' ' + k : k < 0 ? s1 + ' ' + L.T('đi trước', 'leads') + ' ' + (-k) : L.T('Cùng kỳ', 'Same bar')}</td><td${Math.abs(r) > band && k ? ' style="color:var(--accent);font-weight:700"' : ''}>${r.toFixed(3)}</td></tr>`);
        }
        const reg = S.ols(rb, ra);
        out.innerHTML = `<table class="tbl"><thead><tr><th>${L.T('Độ trễ', 'Lag')}</th><th>r</th></tr></thead><tbody>${rows.join('')}</tbody></table>
          <p>${L.T(`n = ${n}; ngưỡng có ý nghĩa ≈ ±${band.toFixed(3)} (ô tô màu = độ trễ khác 0 vượt ngưỡng). Hồi quy cùng kỳ: ${s1} = a + <b>${reg.b.toFixed(2)}</b> × ${s2}, R² = <b>${reg.r2.toFixed(2)}</b>. Quan hệ cùng kỳ mạnh không giúp dự báo; chỉ tương quan ở độ trễ khác 0 (ổn định, sau chi phí) mới có giá trị dẫn báo.`,
            `n = ${n}; significance ≈ ±${band.toFixed(3)} (highlighted = non-zero lags beyond it). Same-bar regression: ${s1} = a + <b>${reg.b.toFixed(2)}</b> × ${s2}, R² = <b>${reg.r2.toFixed(2)}</b>. Strong same-bar links don’t forecast; only stable non-zero-lag correlation (after costs) has leading value.`)}</p>`;
      } catch (e) { C.err(out, e); }
    });
  };

  /* ================= L3-08 ================= */
  C.addLesson('l3-08', {
    goals: ['Dùng hồi quy đơn và bội để định lượng quan hệ liên thị trường.', 'Phân biệt quan hệ cùng kỳ và quan hệ dẫn trước (có độ trễ).', 'Xây dựng tín hiệu từ chênh lệch giữa giá thực và giá dự báo bởi hồi quy.', 'Nhận diện các bẫy: không dừng, quá khớp, quan hệ thay đổi theo chế độ.'],
    body: () => `
<h3>1. Từ quan sát sang định lượng</h3>
<p>Level 2 mô tả các quan hệ liên thị trường bằng lời ("USD mạnh thì hàng hoá yếu"). Level 3 yêu cầu <b>định lượng</b>: quan hệ mạnh tới đâu, ổn định không, và có dùng để <b>ra quyết định</b> được không. Công cụ chính là hồi quy trên <b>lợi suất</b> (không phải giá — tránh hồi quy giả tạo).</p>
<h3>2. Hồi quy đơn và hồi quy bội</h3>
<ul><li>Đơn: r<sub>chỉ số</sub> = a + b × r<sub>thị trường liên quan</sub> + ε. b cho biết độ nhạy; R² cho biết tỷ lệ biến động được giải thích.</li>
<li>Bội: r<sub>chỉ số</sub> = a + b₁r<sub>USD</sub> + b₂r<sub>lợi suất TP</sub> + b₃r<sub>dầu</sub> + … Mỗi hệ số là tác động khi giữ các biến khác cố định. Cẩn thận <b>đa cộng tuyến</b> (USD và vàng, dầu và chỉ số hàng hoá thường tương quan cao).</li>
<li>Chọn biến bằng lý thuyết kinh tế trước, thống kê sau. Ưu tiên ít biến.</li></ul>
<h3>3. Cùng kỳ và dẫn trước</h3>
<p>Một quan hệ <b>cùng kỳ</b> mạnh (R² cao) giúp <b>hiểu</b> thị trường nhưng không giúp <b>dự báo</b> — vì khi biết lợi suất của biến giải thích thì đã biết luôn lợi suất của chỉ số. Để dự báo cần quan hệ <b>có độ trễ</b>: r<sub>chỉ số, t+1</sub> theo r<sub>liên quan, t</sub>. Quan hệ có độ trễ thường <b>yếu hơn nhiều</b> và kém ổn định.</p>
${H.leadLag('BTCUSDT', 'ETHUSDT', 'bn_spot', '1H')}
<h3>4. Tín hiệu từ phần dư hồi quy</h3>
<p>Dùng hồi quy lăn (ví dụ 60–120 phiên) để tính <b>giá trị "hợp lý"</b> của thị trường mục tiêu dựa trên các thị trường liên quan. Khi giá thực lệch xa giá dự báo (phần dư lớn tính theo độ lệch chuẩn), có hai cách hiểu:</p>
<ul><li><b>Hội tụ</b>: kỳ vọng thị trường mục tiêu quay về quan hệ → giao dịch theo hướng thu hẹp chênh lệch.</li>
<li><b>Phân kỳ cảnh báo</b>: thị trường liên quan dẫn trước, chênh lệch là cảnh báo sớm của đảo chiều.</li></ul>
<div class="callout"><b>Ví dụ</b>: hồi quy 100 phiên cho thấy chỉ số cổ phiếu tăng trung bình 0.8% khi lợi suất TP 10 năm giảm 10 điểm cơ bản và USD giảm 1%. Tuần này lợi suất và USD đều giảm mạnh nhưng chỉ số đi ngang — phần dư âm −2σ. Nếu quan hệ ổn định, đây là tín hiệu chỉ số "đi sau" và có thể bắt kịp. Trước khi hành động: kiểm tra quan hệ còn ổn định không (tương quan lăn), có tin riêng của thị trường cổ phiếu không, và giá của chính chỉ số có xác nhận không.</div>
<h3>5. Các bẫy</h3>
<ul><li><b>Hồi quy trên giá</b> → giả tạo. Dùng lợi suất hoặc kiểm tra đồng liên kết.</li>
<li><b>Quan hệ thay đổi theo chế độ</b> (lạm phát/giảm phát) → dùng cửa sổ lăn, theo dõi dấu của hệ số.</li>
<li><b>Quá khớp</b>: thử nhiều biến và nhiều độ trễ rồi chọn tốt nhất = đào bới dữ liệu.</li>
<li><b>Dữ liệu không đồng bộ</b>: giờ đóng cửa khác nhau giữa các thị trường tạo ra quan hệ "dẫn trước" giả.</li></ul>`,
    keys: ['Định lượng quan hệ liên thị trường bằng hồi quy trên lợi suất, không trên giá.', 'Hồi quy bội: hệ số khi giữ biến khác cố định; chú ý đa cộng tuyến; chọn biến theo lý thuyết.', 'Quan hệ cùng kỳ giúp hiểu, không giúp dự báo; dự báo cần quan hệ có độ trễ — thường yếu.', 'Phần dư hồi quy lăn: hội tụ hoặc phân kỳ cảnh báo; luôn kiểm tra độ ổn định và xác nhận giá.', 'Bẫy: hồi quy giá, thay đổi chế độ, quá khớp, dữ liệu không đồng bộ.'],
    terms: [['Lagged regression', 'Hồi quy có độ trễ'], ['Rolling regression', 'Hồi quy lăn'], ['Residual signal', 'Tín hiệu phần dư'], ['Cointegration', 'Đồng liên kết'], ['Asynchronous data', 'Dữ liệu không đồng bộ']]
  }, {
    goals: ['Quantify intermarket links with simple and multiple regression.', 'Separate same-period from lagged relationships.', 'Build residual-based signals.', 'Recognise pitfalls.'],
    body: () => `
<h3>1. Quantify</h3><p>Regress returns, not prices.</p>
<h3>2. Simple and multiple</h3><ul><li>b = sensitivity, R² = explained share.</li><li>Multiple: ceteris paribus coefficients; beware multicollinearity; theory first.</li></ul>
<h3>3. Same-period vs lagged</h3><p>Same-period R² explains but doesn’t forecast; lagged links forecast but are usually weak and unstable.</p>${H.leadLag('BTCUSDT', 'ETHUSDT', 'bn_spot', '1H')}
<h3>4. Residual signals</h3><p>Rolling-regression fair value; large residuals mean convergence trades or divergence warnings.</p><div class="callout">Yields and USD fall sharply, index flat → −2σ residual; check stability, idiosyncratic news and price confirmation first.</div>
<h3>5. Pitfalls</h3><ul><li>Price regressions</li><li>Regime shifts</li><li>Overfitting</li><li>Asynchronous closes</li></ul>`,
    keys: ['Returns.', 'Multiple regression.', 'Lagged vs same-period.', 'Residual signals.', 'Pitfalls.'],
    terms: [['Lagged regression', 'Predictor at t, target at t+1'], ['Asynchronous data', 'Different closing times']]
  }, [
    ['Hồi quy liên thị trường nên thực hiện trên:', 'Intermarket regressions should use:', ['Lợi suất (thay đổi)', 'Mức giá', 'Khối lượng', 'Tên mã'], ['Returns (changes)', 'Price levels', 'Volume', 'Tickers'], 0, '', ''],
    ['Hồi quy cùng kỳ có R² = 0.6 giữa chỉ số và lợi suất trái phiếu. Điều này:', 'A same-period regression with R² 0.6 between an index and bond yields:', ['Giúp hiểu quan hệ nhưng không tự nó giúp dự báo', 'Cho phép dự báo chính xác ngày mai', 'Vô nghĩa', 'Chứng minh nhân quả'], ['Explains the link but doesn’t forecast by itself', 'Forecasts tomorrow precisely', 'Is meaningless', 'Proves causation'], 0, '', ''],
    ['Để dự báo, cần loại quan hệ nào?', 'Forecasting requires which kind of relationship?', ['Có độ trễ: biến hôm nay giải thích mục tiêu ngày mai', 'Cùng kỳ', 'Không quan hệ', 'Ngược thời gian'], ['Lagged: today’s variable explains tomorrow’s target', 'Same-period', 'None', 'Backward in time'], 0, '', ''],
    ['Quan hệ có độ trễ giữa các thị trường thường:', 'Lagged intermarket relationships are usually:', ['Yếu hơn và kém ổn định hơn quan hệ cùng kỳ', 'Mạnh hơn nhiều', 'Hoàn hảo', 'Không tồn tại'], ['Weaker and less stable than same-period ones', 'Much stronger', 'Perfect', 'Nonexistent'], 0, '', ''],
    ['Trong hồi quy bội, USD và vàng cùng làm biến giải thích gây rủi ro:', 'Using USD and gold together as regressors risks:', ['Đa cộng tuyến', 'Hồi quy giả tạo do dừng', 'Thiên lệch sống sót', 'Không gì'], ['Multicollinearity', 'Stationarity spuriousness', 'Survivorship', 'Nothing'], 0, '', ''],
    ['Chọn biến cho mô hình liên thị trường nên dựa trước hết vào:', 'Choose intermarket model variables first by:', ['Lý thuyết kinh tế hợp lý', 'Biến cho R² cao nhất trong mẫu', 'Ngẫu nhiên', 'Số lượng càng nhiều càng tốt'], ['Sound economic theory', 'Highest in-sample R²', 'Randomly', 'As many as possible'], 0, '', ''],
    ['Phần dư hồi quy = −2σ nghĩa là:', 'A −2σ regression residual means:', ['Thị trường mục tiêu thấp hơn nhiều so với mức dự báo bởi các thị trường liên quan', 'Cao hơn dự báo', 'Bằng dự báo', 'Lỗi dữ liệu chắc chắn'], ['The target is far below what related markets predict', 'Above prediction', 'Equal', 'Certain data error'], 0, '', ''],
    ['Cách hiểu "hội tụ" của phần dư lớn:', 'The "convergence" reading of a large residual:', ['Kỳ vọng thị trường mục tiêu quay về quan hệ', 'Quan hệ đã chấm dứt', 'Không giao dịch', 'Mua thị trường liên quan'], ['Expect the target to revert to the relationship', 'The relationship ended', 'No trade', 'Buy the related market'], 0, '', ''],
    ['Trước khi giao dịch theo phần dư lớn, cần kiểm tra:', 'Before trading a large residual, check:', ['Quan hệ còn ổn định, có tin riêng không, giá của chính thị trường có xác nhận không', 'Chỉ cần độ lớn phần dư', 'Không cần kiểm tra', 'Màu biểu đồ'], ['Relationship stability, idiosyncratic news, the target’s own price confirmation', 'Residual size only', 'Nothing', 'Chart colour'], 0, '', ''],
    ['Hồi quy lăn được dùng vì:', 'Rolling regressions are used because:', ['Quan hệ liên thị trường thay đổi theo thời gian/chế độ', 'Dữ liệu cố định', 'Tính nhanh hơn', 'Không lý do'], ['Intermarket links change across time/regimes', 'Data are fixed', 'Faster', 'No reason'], 0, '', ''],
    ['Hệ số của lợi suất trái phiếu đổi dấu trong hồi quy lăn gợi ý:', 'The bond-yield coefficient flipping sign in a rolling regression suggests:', ['Chế độ thị trường đã thay đổi (ví dụ lạm phát ↔ giảm phát)', 'Lỗi phần mềm', 'Quan hệ ổn định', 'Không gì'], ['A regime change (e.g. inflation ↔ deflation)', 'Software bug', 'Stable relation', 'Nothing'], 0, '', ''],
    ['Thử 20 biến × 10 độ trễ rồi chọn tổ hợp tốt nhất là:', 'Trying 20 variables × 10 lags and picking the best is:', ['Đào bới dữ liệu — dễ quá khớp', 'Phương pháp chuẩn không rủi ro', 'Bắt buộc', 'Hồi quy đơn'], ['Data mining — prone to overfitting', 'Risk-free standard practice', 'Mandatory', 'Simple regression'], 0, '', ''],
    ['Giờ đóng cửa khác nhau giữa thị trường Mỹ và châu Á có thể tạo ra:', 'Different closing times between US and Asian markets can create:', ['Quan hệ "dẫn trước" giả do dữ liệu không đồng bộ', 'Dữ liệu hoàn hảo', 'Không ảnh hưởng', 'Đồng liên kết'], ['Spurious "lead" effects from asynchronous data', 'Perfect data', 'No effect', 'Cointegration'], 0, '', ''],
    ['Đồng liên kết là:', 'Cointegration is:', ['Hai chuỗi không dừng có tổ hợp tuyến tính dừng — quan hệ cân bằng dài hạn', 'Hai chuỗi tương quan cao trên lợi suất', 'Hai chuỗi giống hệt', 'Không có'], ['Two nonstationary series with a stationary linear combination — a long-run equilibrium', 'High return correlation', 'Identical series', 'None'], 0, '', ''],
    ['Hệ số b = −1.5 khi hồi quy lợi suất chỉ số theo thay đổi USD (%) nghĩa là:', 'b = −1.5 regressing index returns on USD % changes means:', ['USD tăng 1% thì chỉ số trung bình giảm 1.5%', 'USD tăng 1% thì chỉ số tăng 1.5%', 'Không quan hệ', 'R² = 1.5'], ['USD +1% → index −1.5% on average', 'USD +1% → index +1.5%', 'No relation', 'R² = 1.5'], 0, '', ''],
    ['R² = 0.05 cho hồi quy có độ trễ 1 ngày, n = 2.000. Nhận xét:', 'R² 0.05 for a 1-day lagged regression, n 2,000. Assessment:', ['Có thể có ý nghĩa thống kê nhưng khả năng dự báo nhỏ; cần kiểm định ngoài mẫu và sau chi phí', 'Dự báo rất mạnh', 'Vô nghĩa hoàn toàn', 'Lỗi'], ['Possibly significant but weak; test out of sample and after costs', 'Very strong forecasting', 'Totally meaningless', 'Error'], 0, '', ''],
    ['Vì sao giữ ít biến trong mô hình liên thị trường?', 'Why keep few variables in an intermarket model?', ['Giảm quá khớp và đa cộng tuyến, dễ diễn giải', 'Để R² cao hơn', 'Theo luật', 'Không lý do'], ['Less overfitting and multicollinearity, easier to interpret', 'Higher R²', 'Law', 'No reason'], 0, '', ''],
    ['Cách hiểu "phân kỳ cảnh báo" của phần dư:', 'The "divergence warning" reading:', ['Thị trường liên quan dẫn trước; mục tiêu có thể đảo chiều theo sau', 'Mục tiêu dẫn trước', 'Không ý nghĩa', 'Tăng vị thế bất kể'], ['The related market leads; the target may follow with a reversal', 'The target leads', 'Meaningless', 'Add size regardless'], 0, '', ''],
    ['Kiểm tra độ ổn định của quan hệ bằng:', 'Test a relationship’s stability with:', ['Tương quan/hồi quy lăn và kiểm định trên các giai đoạn con', 'Một hồi quy 20 năm', 'Không kiểm tra', 'Màu biểu đồ'], ['Rolling correlation/regression and sub-period tests', 'One 20-year regression', 'Nothing', 'Chart colour'], 0, '', ''],
    ['Hồi quy cho thấy chỉ số "rẻ" so với các thị trường liên quan, nhưng giá chỉ số vẫn tạo đáy thấp hơn. Hành động hợp lý:', 'The model says the index is "cheap" but price keeps making lower lows. Sensible action:', ['Chờ giá xác nhận (cấu trúc đảo chiều) trước khi mua', 'Mua ngay toàn bộ', 'Bán khống các thị trường liên quan', 'Bỏ qua mô hình mãi mãi'], ['Wait for price confirmation (reversal structure) before buying', 'Buy all now', 'Short related markets', 'Discard the model forever'], 0, '', ''],
    ['R² trong hồi quy đơn bằng:', 'R² in simple regression equals:', ['r²', 'r', 'b', '1 − r'], null, 0, '', ''],
    ['Biến giải thích phù hợp cho cổ phiếu dầu khí Việt Nam:', 'A suitable explanatory variable for Vietnamese oil & gas stocks:', ['Lợi suất giá dầu Brent', 'Giá gạo', 'Số ngày nghỉ', 'Chỉ số Nikkei duy nhất'], ['Brent oil returns', 'Rice prices', 'Holidays', 'Nikkei alone'], 0, '', ''],
    ['Biến giải thích phù hợp cho cổ phiếu thép:', 'A suitable explanatory variable for steel stocks:', ['Giá thép/quặng sắt quốc tế', 'Giá cà phê', 'VIX duy nhất', 'Không có'], ['International steel/iron-ore prices', 'Coffee', 'VIX alone', 'None'], 0, '', ''],
    ['Độ dài cửa sổ hồi quy lăn quá ngắn gây:', 'A too-short rolling window causes:', ['Hệ số nhiễu, không ổn định', 'Hệ số quá chậm', 'R² = 1', 'Không ảnh hưởng'], ['Noisy, unstable coefficients', 'Too slow coefficients', 'R² = 1', 'No effect'], 0, '', ''],
    ['Độ dài cửa sổ quá dài gây:', 'A too-long window causes:', ['Chậm phản ánh thay đổi chế độ', 'Quá nhiễu', 'Không có dữ liệu', 'Không ảnh hưởng'], ['Slow adaptation to regime change', 'Too much noise', 'No data', 'No effect'], 0, '', ''],
    ['Mục đích chính của định lượng quan hệ liên thị trường ở Level 3:', 'The main purpose of quantifying intermarket links at Level 3:', ['Hỗ trợ ra quyết định có căn cứ và đo được độ tin cậy', 'Thay thế phân tích giá', 'Viết báo cáo', 'Không có'], ['Support evidence-based decisions with measurable reliability', 'Replace price analysis', 'Write reports', 'None'], 0, '', ''],
    ['Hệ số hồi quy có t = 0.8. Kết luận:', 'A regression coefficient has t = 0.8. Conclusion:', ['Không có bằng chứng biến đó giải thích được mục tiêu', 'Biến rất quan trọng', 'R² cao', 'Đa cộng tuyến chắc chắn'], ['No evidence the variable explains the target', 'Very important', 'High R²', 'Certain multicollinearity'], 0, '', ''],
    ['Quan hệ liên thị trường nên được dùng như:', 'Intermarket relationships are best used as:', ['Bối cảnh và bộ lọc, kết hợp với tín hiệu giá', 'Tín hiệu duy nhất', 'Thay quản lý rủi ro', 'Không dùng'], ['Context and filters combined with price signals', 'Sole signals', 'A risk-management substitute', 'Not used'], 0, '', ''],
    ['Hồi quy lợi suất ETH theo BTC cùng giờ cho beta 1.2, R² 0.7. Điều này cho thấy:', 'ETH on BTC hourly returns: beta 1.2, R² 0.7. This shows:', ['ETH biến động mạnh hơn BTC và phần lớn chuyển động là chung', 'ETH dẫn trước BTC', 'Không liên quan', 'ETH ít biến động hơn'], ['ETH is more volatile than BTC and moves are largely common', 'ETH leads BTC', 'Unrelated', 'ETH less volatile'], 0, '', ''],
    ['Đồng liên kết giữa hai cổ phiếu cùng ngành cho phép chiến lược:', 'Cointegration between two same-sector stocks enables:', ['Giao dịch cặp (mua mã rẻ tương đối, bán mã đắt tương đối) khi chênh lệch lệch xa cân bằng', 'Mua cả hai mãi mãi', 'Không gì', 'Bán khống chỉ số'], ['Pairs trading (long the cheap, short the rich) when the spread deviates', 'Buying both forever', 'Nothing', 'Shorting the index'], 0, '', '']
  ]);

  /* ================= L3-09 ================= */
  C.addLesson('l3-09', {
    goals: ['Mô tả cấu trúc liên kết của các chỉ số chứng khoán toàn cầu.', 'Giải thích quan hệ giữa hàng hoá, tiền tệ hàng hoá và thị trường mới nổi.', 'Phân tích quan hệ dầu – cổ phiếu theo nguồn gốc cú sốc.', 'Áp dụng cho các nhóm ngành trên thị trường Việt Nam.'],
    body: () => `
<h3>1. Thị trường toàn cầu liên kết</h3>
<ul><li>Các chỉ số chứng khoán lớn có <b>tương quan dương</b> và tương quan tăng mạnh trong khủng hoảng.</li>
<li><b>Lệch múi giờ</b>: phiên Mỹ đóng cửa sau phiên châu Á; biến động lớn của Mỹ đêm trước thường phản ánh vào phiên châu Á sáng hôm sau. Đây là "dẫn trước" do thời gian, không phải do thông tin vượt trội.</li>
<li>Thị trường mới nổi nhạy với <b>USD</b> và <b>lãi suất Mỹ</b>: USD mạnh, lãi suất Mỹ tăng → dòng vốn rút khỏi mới nổi.</li></ul>
<h3>2. Hàng hoá và tiền tệ hàng hoá</h3>
<table class="tbl"><thead><tr><th>Hàng hoá</th><th>Liên kết</th></tr></thead><tbody>
<tr><td>Dầu</td><td>Tiền tệ nước xuất khẩu dầu (CAD, NOK), cổ phiếu năng lượng, lạm phát kỳ vọng</td></tr>
<tr><td>Đồng (copper)</td><td>"Phong vũ biểu" kinh tế toàn cầu (nhu cầu xây dựng, công nghiệp); AUD, CLP; chỉ số Trung Quốc</td></tr>
<tr><td>Quặng sắt, thép</td><td>Kinh tế Trung Quốc, cổ phiếu thép</td></tr>
<tr><td>Nông sản</td><td>Thời tiết, mùa vụ — tương quan thấp với cổ phiếu</td></tr>
<tr><td>Chỉ số hàng hoá tổng hợp</td><td>Lạm phát, nghịch chiều với giá trái phiếu</td></tr></tbody></table>
<h3>3. Dầu và cổ phiếu: phụ thuộc nguồn gốc cú sốc</h3>
<ul><li><b>Cú sốc cầu</b> (kinh tế mạnh lên): dầu và cổ phiếu cùng tăng — tương quan dương.</li>
<li><b>Cú sốc cung</b> (chiến tranh, cắt giảm sản lượng): dầu tăng làm tăng chi phí, giảm biên lợi nhuận → cổ phiếu giảm — tương quan âm.</li>
<li>Trong khủng hoảng giảm phát: cả hai cùng giảm.</li></ul>
<p>Bài học: không áp dụng máy móc dấu của tương quan; hãy hỏi "<b>vì sao</b> dầu đang di chuyển?"</p>
<h3>4. Tỷ lệ đồng/vàng</h3>
<p>Đồng phản ánh tăng trưởng, vàng phản ánh phòng thủ. Tỷ lệ đồng/vàng tăng thường đi cùng lợi suất trái phiếu tăng và khẩu vị rủi ro tăng; giảm thường báo hiệu lo ngại tăng trưởng.</p>
<h3>5. Áp dụng tại Việt Nam</h3>
<table class="tbl"><thead><tr><th>Nhóm ngành</th><th>Biến liên thị trường cần theo dõi</th></tr></thead><tbody>
<tr><td>Dầu khí</td><td>Brent, WTI, giá khí</td></tr><tr><td>Thép</td><td>Giá thép, quặng sắt, than cốc; chỉ số Trung Quốc</td></tr><tr><td>Phân bón, hoá chất</td><td>Giá urê, khí, phốt pho</td></tr><tr><td>Cao su, thuỷ sản, dệt may</td><td>Giá cao su; tỷ giá; nhu cầu Mỹ/EU</td></tr><tr><td>Ngân hàng, chứng khoán, bất động sản</td><td>Lãi suất liên ngân hàng, tỷ giá, DXY, dòng vốn ngoại</td></tr></tbody></table>
${H.corrLab('BTCUSDT', 'PAXGUSDT', 'bn_spot', '1D')}
<p class="muted">Demo dùng BTC và PAXG (token gắn giá vàng) trên Binance để minh hoạ quan hệ giữa một tài sản rủi ro và tài sản phòng thủ.</p>`,
    keys: ['Chỉ số toàn cầu tương quan dương, tăng trong khủng hoảng; lệch múi giờ tạo "dẫn trước" theo thời gian.', 'Mới nổi nhạy với USD và lãi suất Mỹ.', 'Đồng = phong vũ biểu kinh tế; dầu ↔ CAD/NOK, năng lượng, lạm phát.', 'Dầu – cổ phiếu: cú sốc cầu → cùng chiều; cú sốc cung → ngược chiều.', 'Tỷ lệ đồng/vàng ↔ khẩu vị rủi ro, lợi suất.', 'Việt Nam: gắn từng nhóm ngành với biến hàng hoá/tiền tệ tương ứng.'],
    terms: [['Commodity currencies', 'Tiền tệ hàng hoá'], ['Supply / demand shock', 'Cú sốc cung / cầu'], ['Copper/gold ratio', 'Tỷ lệ đồng/vàng'], ['Emerging markets', 'Thị trường mới nổi']]
  }, {
    goals: ['Describe global equity linkages.', 'Explain commodity, commodity-currency and EM links.', 'Analyse oil–stock links by shock type.', 'Apply to Vietnamese sectors.'],
    body: () => `
<h3>1. Global linkages</h3><ul><li>Positive correlations rising in crises.</li><li>Time-zone lead of US closes.</li><li>EM sensitive to USD and US rates.</li></ul>
<h3>2. Commodities</h3><p>Oil ↔ CAD/NOK, energy, inflation; copper ↔ global growth, AUD, China; iron ore/steel ↔ China; agriculture low equity correlation.</p>
<h3>3. Oil and stocks</h3><p>Demand shocks → positive; supply shocks → negative; deflationary crises → both fall. Ask why oil moves.</p>
<h3>4. Copper/gold</h3><p>Rising = risk appetite and higher yields.</p>
<h3>5. Vietnam</h3><p>Map each sector to its commodity/currency drivers.</p>${H.corrLab('BTCUSDT', 'PAXGUSDT', 'bn_spot', '1D')}`,
    keys: ['Global links.', 'EM and USD.', 'Commodities.', 'Oil shock type.', 'Copper/gold.', 'Vietnam mapping.'],
    terms: [['Supply shock', 'Output disruption raising prices'], ['Copper/gold ratio', 'Growth vs safety gauge']]
  }, [
    ['Tương quan giữa các chỉ số chứng khoán lớn trong khủng hoảng thường:', 'Correlations among major equity indices in crises tend to:', ['Tăng mạnh', 'Giảm về 0', 'Đổi dấu âm', 'Không đổi'], ['Rise sharply', 'Fall to 0', 'Turn negative', 'Stay the same'], 0, '', ''],
    ['Phiên Mỹ giảm mạnh đêm qua, phiên châu Á sáng nay mở cửa giảm. Đây chủ yếu là:', 'US fell sharply overnight; Asia opens lower. This is mainly:', ['Hiệu ứng lệch múi giờ', 'Châu Á dẫn trước Mỹ', 'Ngẫu nhiên', 'Tin nội bộ'], ['A time-zone effect', 'Asia leading the US', 'Random', 'Insider news'], 0, '', ''],
    ['USD mạnh và lãi suất Mỹ tăng thường gây:', 'A strong USD and rising US rates usually cause:', ['Dòng vốn rút khỏi thị trường mới nổi', 'Dòng vốn đổ vào mới nổi', 'Không ảnh hưởng', 'Hàng hoá tăng mạnh'], ['Capital outflows from emerging markets', 'Inflows to EM', 'No effect', 'Commodity rally'], 0, '', ''],
    ['Kim loại được gọi là "phong vũ biểu" kinh tế toàn cầu:', 'The metal dubbed a global economic barometer:', ['Đồng', 'Vàng', 'Bạc', 'Bạch kim'], ['Copper', 'Gold', 'Silver', 'Platinum'], 0, '', ''],
    ['Tiền tệ liên kết chặt với giá dầu:', 'A currency closely tied to oil:', ['CAD hoặc NOK', 'JPY', 'CHF', 'EUR'], ['CAD or NOK', 'JPY', 'CHF', 'EUR'], 0, '', ''],
    ['AUD thường liên kết với:', 'AUD is often linked to:', ['Kim loại công nghiệp, nhu cầu Trung Quốc', 'Giá dầu duy nhất', 'Vàng duy nhất', 'Không gì'], ['Industrial metals, Chinese demand', 'Oil only', 'Gold only', 'Nothing'], 0, '', ''],
    ['Giá dầu tăng do kinh tế toàn cầu tăng trưởng mạnh (cú sốc cầu). Quan hệ dầu – cổ phiếu:', 'Oil rises on strong global growth (demand shock). Oil–stock link:', ['Thường cùng chiều', 'Thường ngược chiều', 'Không liên quan', 'Cổ phiếu sập chắc chắn'], ['Usually positive', 'Usually negative', 'Unrelated', 'Stocks surely crash'], 0, '', ''],
    ['Giá dầu tăng vọt do xung đột làm gián đoạn nguồn cung. Quan hệ thường:', 'Oil spikes on a supply disruption. The link is usually:', ['Ngược chiều — chi phí tăng gây áp lực lên cổ phiếu', 'Cùng chiều', 'Không đổi', 'Không xác định được'], ['Negative — higher costs pressure stocks', 'Positive', 'Unchanged', 'Indeterminable'], 0, '', ''],
    ['Bài học chính về quan hệ dầu – cổ phiếu:', 'The key lesson on oil–stocks:', ['Hỏi vì sao dầu di chuyển trước khi áp dụng dấu tương quan', 'Luôn cùng chiều', 'Luôn ngược chiều', 'Không quan trọng'], ['Ask why oil moves before applying a correlation sign', 'Always positive', 'Always negative', 'Irrelevant'], 0, '', ''],
    ['Tỷ lệ đồng/vàng tăng thường đi cùng:', 'A rising copper/gold ratio usually accompanies:', ['Lợi suất trái phiếu tăng, khẩu vị rủi ro tăng', 'Suy thoái', 'Lãi suất giảm mạnh', 'Hoảng loạn'], ['Rising yields and risk appetite', 'Recession', 'Plunging rates', 'Panic'], 0, '', ''],
    ['Tỷ lệ đồng/vàng giảm mạnh thường báo hiệu:', 'A sharply falling copper/gold ratio often signals:', ['Lo ngại tăng trưởng', 'Bùng nổ kinh tế', 'Lạm phát cao', 'Không gì'], ['Growth worries', 'A boom', 'High inflation', 'Nothing'], 0, '', ''],
    ['Nông sản thường có tương quan với cổ phiếu:', 'Agricultural commodities usually correlate with stocks:', ['Thấp — chịu ảnh hưởng thời tiết, mùa vụ', 'Rất cao', 'Âm hoàn hảo', 'Bằng 1'], ['Lowly — driven by weather and seasons', 'Very highly', 'Perfectly negatively', 'Equal to 1'], 0, '', ''],
    ['Chỉ số hàng hoá tổng hợp tăng mạnh thường đi cùng giá trái phiếu:', 'A sharply rising commodity index usually comes with bond prices that:', ['Giảm', 'Tăng', 'Không đổi', 'Bằng mệnh giá'], ['Fall', 'Rise', 'Stay', 'Equal par'], 0, '', ''],
    ['Cổ phiếu thép Việt Nam nên được theo dõi cùng:', 'Vietnamese steel stocks should be tracked with:', ['Giá thép/quặng sắt và kinh tế Trung Quốc', 'Giá cà phê', 'Giá vàng duy nhất', 'Không gì'], ['Steel/iron-ore prices and China’s economy', 'Coffee', 'Gold only', 'Nothing'], 0, '', ''],
    ['Cổ phiếu phân bón nên theo dõi:', 'Fertiliser stocks should track:', ['Giá urê, khí đầu vào', 'Giá thép', 'VIX', 'Bitcoin'], ['Urea and gas input prices', 'Steel', 'VIX', 'Bitcoin'], 0, '', ''],
    ['Ngân hàng và chứng khoán Việt Nam nhạy với:', 'Vietnamese banks and brokers are sensitive to:', ['Lãi suất liên ngân hàng, tỷ giá, dòng vốn ngoại', 'Giá cao su', 'Thời tiết', 'Không gì'], ['Interbank rates, FX, foreign flows', 'Rubber', 'Weather', 'Nothing'], 0, '', ''],
    ['Cổ phiếu xuất khẩu dệt may chịu ảnh hưởng của:', 'Textile exporters are affected by:', ['Tỷ giá và nhu cầu Mỹ/EU', 'Giá dầu duy nhất', 'Không gì', 'VN30F'], ['FX and US/EU demand', 'Oil only', 'Nothing', 'VN30F'], 0, '', ''],
    ['Dẫn trước do lệch múi giờ có giá trị giao dịch khi:', 'A time-zone lead is tradable when:', ['Có thể hành động trước khi thị trường đi sau mở cửa và sau chi phí vẫn có lãi', 'Luôn luôn', 'Không bao giờ', 'Khi thị trường đóng cửa'], ['You can act before the lagging market opens and profit after costs', 'Always', 'Never', 'When markets are closed'], 0, '', ''],
    ['Trong khủng hoảng giảm phát, dầu và cổ phiếu thường:', 'In deflationary crises, oil and stocks usually:', ['Cùng giảm', 'Ngược chiều', 'Dầu tăng mạnh', 'Không đổi'], ['Fall together', 'Move oppositely', 'Oil surges', 'Stay flat'], 0, '', ''],
    ['Quỹ ngoại rút ròng mạnh khỏi Việt Nam khi DXY tăng vọt. Đây là ví dụ về:', 'Foreign funds sell Vietnam heavily as DXY surges. This exemplifies:', ['Độ nhạy của thị trường mới nổi với USD', 'Hiệu ứng lịch', 'Ngẫu nhiên', 'Short squeeze'], ['EM sensitivity to the USD', 'Calendar effect', 'Randomness', 'Short squeeze'], 0, '', ''],
    ['Cách đúng để dùng tương quan hàng hoá – cổ phiếu:', 'The right way to use commodity–stock correlations:', ['Theo dõi tương quan lăn và hiểu cơ chế', 'Dùng một con số cố định', 'Bỏ qua', 'Chỉ dùng cho vàng'], ['Track rolling correlations and understand mechanisms', 'Use one fixed number', 'Ignore them', 'Gold only'], 0, '', ''],
    ['Chỉ số Trung Quốc giảm mạnh thường ảnh hưởng tiêu cực nhất tới:', 'A sharp fall in Chinese indices hurts most:', ['Kim loại công nghiệp và nước xuất khẩu hàng hoá', 'Trái phiếu Mỹ', 'Vàng', 'USD'], ['Industrial metals and commodity exporters', 'US Treasuries', 'Gold', 'USD'], 0, '', ''],
    ['Đồng tăng mạnh nhưng chỉ số cổ phiếu toàn cầu đi ngang có thể là:', 'Copper surging while global equities stall may be:', ['Tín hiệu sớm của tăng trưởng (cổ phiếu có thể theo sau) — cần xác nhận', 'Tín hiệu bán chắc chắn', 'Vô nghĩa', 'Lỗi'], ['An early growth signal (stocks may follow) — confirm first', 'A sure sell', 'Meaningless', 'Error'], 0, '', ''],
    ['Thị trường mới nổi có xu hướng làm tốt khi:', 'EM tends to do well when:', ['USD yếu, hàng hoá tăng, lãi suất Mỹ giảm', 'USD rất mạnh', 'Lãi suất Mỹ tăng nhanh', 'Hàng hoá sập'], ['USD weakens, commodities rise, US rates fall', 'USD very strong', 'US rates rise fast', 'Commodities crash'], 0, '', ''],
    ['Đa dạng hoá quốc tế ít hiệu quả nhất khi:', 'International diversification helps least when:', ['Khủng hoảng toàn cầu khiến tương quan tăng vọt', 'Thị trường yên bình', 'Lãi suất ổn định', 'Luôn hiệu quả'], ['Global crises spike correlations', 'Markets are calm', 'Rates are stable', 'Always works'], 0, '', ''],
    ['CAD mạnh lên cùng giá dầu tăng thể hiện:', 'CAD strengthening with oil illustrates:', ['Quan hệ tiền tệ hàng hoá', 'Quan hệ ngẫu nhiên', 'Hiệu ứng lịch', 'Không gì'], ['A commodity-currency link', 'Randomness', 'Calendar effect', 'Nothing'], 0, '', ''],
    ['Phân tích liên thị trường quốc tế giúp nhà đầu tư Việt Nam chủ yếu ở:', 'International intermarket analysis helps Vietnamese investors mainly with:', ['Bối cảnh ngành và rủi ro dòng vốn', 'Thời điểm vào lệnh trong phút', 'Kế toán', 'Không gì'], ['Sector context and flow risk', 'Minute-level entries', 'Accounting', 'Nothing'], 0, '', ''],
    ['Vì sao dùng PAXG/BTC làm demo minh hoạ?', 'Why use PAXG/BTC for the demo?', ['Minh hoạ quan hệ giữa tài sản phòng thủ (vàng) và tài sản rủi ro', 'Vì giống hệt nhau', 'Không lý do', 'Để giao dịch ngay'], ['To illustrate a defensive (gold) vs risky asset link', 'They are identical', 'No reason', 'To trade at once'], 0, '', ''],
    ['Kết luận đúng khi tương quan dầu – chỉ số đổi từ +0.4 sang −0.3 trong 3 tháng:', 'Correct conclusion when oil–index correlation shifts from +0.4 to −0.3 in 3 months:', ['Nguồn gốc cú sốc có thể đã thay đổi (cầu → cung)', 'Dữ liệu sai', 'Không có ý nghĩa gì', 'Luôn mua dầu'], ['The shock source may have changed (demand → supply)', 'Bad data', 'Nothing', 'Always buy oil'], 0, '', ''],
    ['Đồng tăng giá kéo dài thường được xem là tín hiệu:', 'A sustained copper rally is usually read as:', ['Nhu cầu công nghiệp và tăng trưởng toàn cầu cải thiện', 'Suy thoái', 'Hoảng loạn tài chính', 'Không gì'], ['Improving industrial demand and global growth', 'Recession', 'Financial panic', 'Nothing'], 0, '', '']
  ]);

  /* ================= L3-10 ================= */
  C.addLesson('l3-10', {
    goals: ['Phân tích các yếu tố liên thị trường tác động tới chỉ số chứng khoán Mỹ.', 'Diễn giải sự thay đổi quan hệ cổ phiếu – trái phiếu qua các chế độ lạm phát.', 'Dùng các nhóm dẫn dắt nội bộ (vận tải, vốn hoá nhỏ, bán dẫn, tài chính) làm chỉ báo.', 'Đánh giá ảnh hưởng của thị trường Mỹ tới thị trường Việt Nam.'],
    body: () => `
<h3>1. Vì sao chỉ số Mỹ quan trọng với mọi nhà đầu tư?</h3>
<p>Chỉ số cổ phiếu Mỹ là thị trường lớn nhất thế giới, "neo" khẩu vị rủi ro toàn cầu. Biến động lớn của nó lan sang mọi thị trường, kể cả Việt Nam, qua kênh tâm lý và dòng vốn.</p>
<h3>2. Các yếu tố liên thị trường chính</h3>
<table class="tbl"><thead><tr><th>Yếu tố</th><th>Quan hệ thường gặp</th><th>Lưu ý</th></tr></thead><tbody>
<tr><td>Lợi suất TP 10 năm</td><td>Thay đổi theo chế độ (xem mục 3)</td><td>Tốc độ tăng lợi suất quan trọng hơn mức</td></tr>
<tr><td>USD</td><td>Yếu/thay đổi; USD tăng vọt thường cùng căng thẳng</td><td>Hại doanh nghiệp đa quốc gia</td></tr>
<tr><td>VIX</td><td>Nghịch chiều mạnh</td><td>Đỉnh VIX ↔ đáy ngắn hạn</td></tr>
<tr><td>Dầu</td><td>Phụ thuộc loại cú sốc</td><td>Bài 9</td></tr>
<tr><td>Vàng</td><td>Thấp/âm trong căng thẳng</td><td>Bài 12</td></tr>
<tr><td>Chênh lệch tín dụng (lợi suất TP doanh nghiệp rủi ro − TP chính phủ)</td><td>Nghịch chiều; thường <b>dẫn trước</b> cổ phiếu</td><td>Thị trường tín dụng "ngửi" rủi ro sớm</td></tr></tbody></table>
<h3>3. Quan hệ cổ phiếu – trái phiếu đổi dấu</h3>
<ul><li><b>Chế độ lạm phát cao/biến động lạm phát</b>: lợi suất tăng (giá TP giảm) do lạm phát → cổ phiếu giảm. Giá TP và cổ phiếu <b>cùng chiều</b> (tương quan dương).</li>
<li><b>Chế độ lạm phát thấp/giảm phát</b>: lợi suất tăng do kỳ vọng tăng trưởng → cổ phiếu tăng. Giá TP và cổ phiếu <b>ngược chiều</b> (TP là tài sản phòng thủ).</li>
<li>Hệ quả cho danh mục 60/40: lợi ích đa dạng hoá của trái phiếu <b>biến mất</b> khi lạm phát quay lại (cả hai cùng giảm).</li></ul>
<h3>4. Các nhóm dẫn dắt nội bộ</h3>
<ul><li><b>Vận tải</b> (lý thuyết Dow): hoạt động kinh tế thực; phân kỳ với chỉ số công nghiệp là cảnh báo.</li>
<li><b>Vốn hoá nhỏ</b>: nhạy với tín dụng và chu kỳ; dẫn dắt khi khẩu vị rủi ro mở rộng.</li>
<li><b>Bán dẫn</b>: chu kỳ công nghệ, nhạy cảm cao, thường dẫn trước.</li>
<li><b>Tài chính/ngân hàng</b>: đường cong lợi suất, tín dụng.</li>
<li><b>Tiêu dùng không thiết yếu / thiết yếu</b>: tỷ lệ tăng = khẩu vị rủi ro tăng.</li></ul>
<h3>5. Ảnh hưởng tới Việt Nam</h3>
<ul><li>Kênh trực tiếp: tâm lý phiên sáng sau một phiên Mỹ biến động mạnh; dòng vốn ETF ngoại.</li>
<li>Kênh gián tiếp: USD/lãi suất Mỹ → tỷ giá USD/VND → chính sách lãi suất trong nước; nhu cầu xuất khẩu.</li>
<li>Trong ngắn hạn tương quan VNINDEX với chỉ số Mỹ thường <b>vừa phải</b>; trong các cú sốc toàn cầu, tương quan tăng mạnh.</li></ul>`,
    keys: ['Chỉ số Mỹ neo khẩu vị rủi ro toàn cầu.', 'Yếu tố: lợi suất 10 năm, USD, VIX, dầu, vàng, chênh lệch tín dụng (thường dẫn trước).', 'Lạm phát cao: giá TP và cổ phiếu cùng chiều; lạm phát thấp: ngược chiều — đa dạng hoá 60/40 phụ thuộc chế độ.', 'Nhóm dẫn dắt: vận tải, vốn hoá nhỏ, bán dẫn, tài chính, tỷ lệ tiêu dùng không thiết yếu/thiết yếu.', 'Việt Nam: kênh tâm lý, dòng vốn, tỷ giá, lãi suất, xuất khẩu.'],
    terms: [['Credit spread', 'Chênh lệch tín dụng'], ['Stock–bond correlation', 'Tương quan cổ phiếu – trái phiếu'], ['60/40 portfolio', 'Danh mục 60% cổ phiếu/40% trái phiếu'], ['Discretionary/staples ratio', 'Tỷ lệ tiêu dùng không thiết yếu/thiết yếu']]
  }, {
    goals: ['Analyse intermarket drivers of the US index.', 'Explain regime-dependent stock–bond correlation.', 'Use internal leadership groups.', 'Assess US influence on Vietnam.'],
    body: () => `
<h3>1. Why it matters</h3><p>The US index anchors global risk appetite.</p>
<h3>2. Drivers</h3><p>10-year yields (regime-dependent; speed matters), USD, VIX (inverse), oil (shock type), gold, credit spreads (inverse, often leading).</p>
<h3>3. Stock–bond correlation</h3><ul><li>High/volatile inflation: bond and stock prices move together.</li><li>Low inflation: they move oppositely; bonds hedge.</li><li>60/40 diversification depends on regime.</li></ul>
<h3>4. Leadership groups</h3><p>Transports, small caps, semiconductors, financials, discretionary/staples.</p>
<h3>5. Vietnam</h3><p>Sentiment, ETF flows, FX and rate transmission, export demand; correlation rises in global shocks.</p>`,
    keys: ['Anchor.', 'Drivers.', 'Regime-dependent stock–bond link.', 'Leadership groups.', 'Vietnam channels.'],
    terms: [['Credit spread', 'Risky minus government yields'], ['60/40', 'Classic balanced portfolio']]
  }, [
    ['Chênh lệch tín dụng mở rộng nhanh thường:', 'Rapidly widening credit spreads usually:', ['Là cảnh báo sớm cho cổ phiếu', 'Tín hiệu mua mạnh', 'Không liên quan', 'Đi sau cổ phiếu luôn'], ['Warn early for stocks', 'Are a strong buy', 'Are unrelated', 'Always lag stocks'], 0, '', ''],
    ['Trong chế độ lạm phát cao, giá trái phiếu và cổ phiếu thường:', 'In high-inflation regimes, bond and stock prices tend to:', ['Cùng chiều (tương quan dương)', 'Ngược chiều', 'Không liên quan', 'Bằng nhau'], ['Move together (positive correlation)', 'Move oppositely', 'Be unrelated', 'Be equal'], 0, '', ''],
    ['Trong chế độ lạm phát thấp, trái phiếu thường:', 'In low-inflation regimes, bonds usually:', ['Là tài sản phòng thủ, ngược chiều cổ phiếu khi căng thẳng', 'Cùng giảm với cổ phiếu', 'Không giao dịch', 'Tăng cùng hàng hoá'], ['Act as a hedge, moving opposite to stocks under stress', 'Fall with stocks', 'Don’t trade', 'Rise with commodities'], 0, '', ''],
    ['Vì sao danh mục 60/40 kém hiệu quả khi lạm phát quay lại?', 'Why does 60/40 struggle when inflation returns?', ['Cổ phiếu và trái phiếu cùng giảm — mất lợi ích đa dạng hoá', 'Trái phiếu tăng quá mạnh', 'Cổ phiếu không biến động', 'Không đúng'], ['Stocks and bonds fall together — diversification disappears', 'Bonds rally too much', 'Stocks don’t move', 'False'], 0, '', ''],
    ['Với lợi suất trái phiếu, điều thường quan trọng hơn mức tuyệt đối là:', 'For bond yields, what usually matters more than the level:', ['Tốc độ thay đổi', 'Số chữ số', 'Ngày công bố', 'Không gì'], ['The speed of change', 'Digits', 'Publication date', 'Nothing'], 0, '', ''],
    ['VIX và chỉ số Mỹ có quan hệ:', 'VIX and the US index relate:', ['Nghịch chiều mạnh', 'Cùng chiều', 'Không liên quan', 'Bằng nhau'], ['Strongly inversely', 'Positively', 'Unrelated', 'Equally'], 0, '', ''],
    ['Theo lý thuyết Dow, chỉ số vận tải không xác nhận đỉnh mới của chỉ số công nghiệp là:', 'Per Dow theory, transports failing to confirm an industrial high is:', ['Cảnh báo', 'Xác nhận tăng', 'Không ý nghĩa', 'Tín hiệu mua'], ['A warning', 'Bullish confirmation', 'Meaningless', 'A buy'], 0, '', ''],
    ['Tỷ lệ tiêu dùng không thiết yếu/thiết yếu tăng phản ánh:', 'A rising discretionary/staples ratio reflects:', ['Khẩu vị rủi ro tăng', 'Phòng thủ', 'Suy thoái', 'Không gì'], ['Rising risk appetite', 'Defensiveness', 'Recession', 'Nothing'], 0, '', ''],
    ['Cổ phiếu vốn hoá nhỏ dẫn dắt thường cho thấy:', 'Small caps leading usually shows:', ['Khẩu vị rủi ro và điều kiện tín dụng thuận lợi', 'Hoảng loạn', 'Lãi suất tăng vọt', 'Không gì'], ['Risk appetite and easy credit', 'Panic', 'Spiking rates', 'Nothing'], 0, '', ''],
    ['Nhóm bán dẫn được theo dõi vì:', 'Semiconductors are watched because:', ['Nhạy với chu kỳ công nghệ và thường dẫn trước', 'Ổn định nhất', 'Không biến động', 'Là cổ phiếu phòng thủ'], ['They are cycle-sensitive and often lead', 'Most stable', 'Don’t move', 'Defensive'], 0, '', ''],
    ['Ngân hàng hưởng lợi khi đường cong lợi suất:', 'Banks benefit when the yield curve:', ['Dốc lên', 'Đảo ngược', 'Phẳng tuyệt đối', 'Không liên quan'], ['Steepens', 'Inverts', 'Is perfectly flat', 'Irrelevant'], 0, '', ''],
    ['USD tăng vọt đột ngột cùng cổ phiếu giảm thường phản ánh:', 'A sudden USD spike with falling stocks usually reflects:', ['Căng thẳng/thiếu thanh khoản USD toàn cầu', 'Bùng nổ kinh tế', 'Lạm phát thấp', 'Không gì'], ['Global stress/dollar funding squeeze', 'A boom', 'Low inflation', 'Nothing'], 0, '', ''],
    ['Kênh tác động trực tiếp của phiên Mỹ tới Việt Nam:', 'A direct channel from the US session to Vietnam:', ['Tâm lý phiên sáng hôm sau và dòng vốn ETF ngoại', 'Giá gạo', 'Thời tiết', 'Không có'], ['Next-morning sentiment and foreign ETF flows', 'Rice prices', 'Weather', 'None'], 0, '', ''],
    ['Kênh gián tiếp: lãi suất Mỹ tăng → ...', 'Indirect channel: US rates up → ...', ['Áp lực tỷ giá USD/VND → chính sách lãi suất trong nước', 'VND mạnh lên chắc chắn', 'Không ảnh hưởng', 'Giá thép tăng'], ['USD/VND pressure → domestic rate policy', 'VND surely stronger', 'No effect', 'Steel up'], 0, '', ''],
    ['Tương quan VNINDEX với chỉ số Mỹ trong cú sốc toàn cầu thường:', 'VNINDEX–US correlation in global shocks tends to:', ['Tăng mạnh', 'Giảm về 0', 'Âm', 'Không đổi'], ['Rise sharply', 'Fall to 0', 'Turn negative', 'Stay the same'], 0, '', ''],
    ['Tình huống: lợi suất 10 năm tăng nhanh 60 điểm cơ bản trong một tháng do lo ngại lạm phát. Rủi ro lớn nhất cho:', 'Case: 10-year yields jump 60bp in a month on inflation fears. Biggest risk for:', ['Cổ phiếu tăng trưởng định giá cao', 'Cổ phiếu năng lượng', 'Tiền mặt', 'Hàng hoá'], ['Highly valued growth stocks', 'Energy stocks', 'Cash', 'Commodities'], 0, 'Lãi suất chiết khấu tăng ảnh hưởng mạnh tới dòng tiền xa.', ''],
    ['Thị trường tín dụng thường "ngửi" rủi ro sớm hơn cổ phiếu vì:', 'Credit markets often sense risk before stocks because:', ['Chủ nợ tập trung vào rủi ro vỡ nợ, phản ứng sớm với suy giảm', 'Ngẫu nhiên', 'Giao dịch nhiều hơn', 'Không đúng'], ['Lenders focus on default risk and react early', 'Randomly', 'More trading', 'False'], 0, '', ''],
    ['Vàng tăng, VIX tăng, chênh lệch tín dụng mở rộng, cổ phiếu vẫn ở đỉnh. Đánh giá:', 'Gold up, VIX up, credit spreads wider, stocks still at highs. Assessment:', ['Nhiều cảnh báo liên thị trường — giảm rủi ro/chặt dừng', 'Mua mạnh', 'Không ý nghĩa', 'Tăng đòn bẩy'], ['Multiple intermarket warnings — reduce risk/tighten stops', 'Strong buy', 'Meaningless', 'Add leverage'], 0, '', ''],
    ['Quan hệ cổ phiếu – trái phiếu nên được theo dõi bằng:', 'Track the stock–bond relationship with:', ['Tương quan lăn giữa lợi suất cổ phiếu và trái phiếu', 'Một con số lịch sử', 'Không theo dõi', 'Giá vàng'], ['Rolling correlation of stock and bond returns', 'One historical number', 'Not at all', 'Gold price'], 0, '', ''],
    ['Lợi suất tăng do kỳ vọng tăng trưởng (lạm phát thấp) thường:', 'Yields rising on growth expectations (low inflation) usually:', ['Đi cùng cổ phiếu tăng', 'Gây sập cổ phiếu', 'Không ảnh hưởng', 'Làm vàng tăng mạnh'], ['Accompany rising stocks', 'Crash stocks', 'No effect', 'Lift gold strongly'], 0, '', ''],
    ['Bốn nhóm dẫn dắt nội bộ trong bài gồm:', 'The internal leadership groups include:', ['Vận tải, vốn hoá nhỏ, bán dẫn, tài chính', 'Tiện ích, vàng, dầu, gạo', 'Chỉ trái phiếu', 'Chỉ crypto'], ['Transports, small caps, semis, financials', 'Utilities, gold, oil, rice', 'Bonds only', 'Crypto only'], 0, '', ''],
    ['Phân kỳ: chỉ số lớn tạo đỉnh mới, vốn hoá nhỏ và vận tải không. Ý nghĩa:', 'Divergence: the main index makes a new high, small caps and transports don’t. Meaning:', ['Sự tham gia thu hẹp — rủi ro tăng', 'Xác nhận mạnh', 'Không gì', 'Mua thêm'], ['Narrowing participation — rising risk', 'Strong confirmation', 'Nothing', 'Buy more'], 0, '', ''],
    ['Doanh nghiệp Mỹ đa quốc gia bị ảnh hưởng tiêu cực khi:', 'US multinationals are hurt when:', ['USD mạnh lên', 'USD yếu đi', 'Lãi suất giảm', 'Dầu giảm'], ['The USD strengthens', 'The USD weakens', 'Rates fall', 'Oil falls'], 0, '', ''],
    ['Đỉnh VIX đảo chiều giảm thường gắn với:', 'A reversing VIX peak often marks:', ['Đáy ngắn hạn của chỉ số', 'Đỉnh dài hạn', 'Không gì', 'Lãi suất tăng'], ['A short-term index low', 'A long-term top', 'Nothing', 'Rising rates'], 0, '', ''],
    ['Nhà đầu tư Việt Nam nên dùng chỉ số Mỹ như:', 'Vietnamese investors should use the US index as:', ['Bối cảnh rủi ro toàn cầu, không phải tín hiệu giao dịch duy nhất', 'Tín hiệu duy nhất', 'Không quan tâm', 'Thay thế VNINDEX'], ['Global risk context, not the sole signal', 'The only signal', 'Irrelevant', 'A VNINDEX substitute'], 0, '', ''],
    ['Thời kỳ nào trái phiếu là tài sản phòng vệ tốt nhất cho cổ phiếu?', 'When are bonds the best hedge for stocks?', ['Lạm phát thấp, ổn định; cú sốc tăng trưởng/giảm phát', 'Lạm phát cao biến động', 'Luôn luôn', 'Không bao giờ'], ['Low, stable inflation; growth/deflation shocks', 'High, volatile inflation', 'Always', 'Never'], 0, '', ''],
    ['Tình huống: cổ phiếu giảm, trái phiếu cũng giảm, USD tăng, hàng hoá tăng. Chế độ có khả năng:', 'Case: stocks down, bonds down, USD up, commodities up. Likely regime:', ['Lạm phát/thắt chặt tiền tệ', 'Giảm phát', 'Bùng nổ lạm phát thấp', 'Không xác định'], ['Inflation/monetary tightening', 'Deflation', 'Low-inflation boom', 'Undeterminable'], 0, '', ''],
    ['Tình huống: cổ phiếu giảm mạnh, trái phiếu tăng mạnh, hàng hoá giảm, vàng tăng. Chế độ:', 'Case: stocks plunge, bonds rally, commodities fall, gold rises. Regime:', ['Lo ngại suy thoái/giảm phát — tìm nơi trú ẩn', 'Lạm phát cao', 'Bùng nổ', 'Không xác định'], ['Recession/deflation fear — flight to safety', 'High inflation', 'Boom', 'Undeterminable'], 0, '', ''],
    ['Phân tích liên thị trường của chỉ số Mỹ nên kết hợp với:', 'Intermarket analysis of the US index should combine with:', ['Phân tích giá, độ rộng và tâm lý của chính chỉ số', 'Chỉ tin tức', 'Không gì', 'Chỉ định giá'], ['The index’s own price, breadth and sentiment analysis', 'News only', 'Nothing', 'Valuation only'], 0, '', ''],
    ['Chênh lệch tín dụng thu hẹp liên tục trong khi cổ phiếu tăng là:', 'Credit spreads steadily narrowing while stocks rise is:', ['Xác nhận lành mạnh cho xu hướng tăng', 'Cảnh báo đỉnh', 'Không liên quan', 'Tín hiệu bán'], ['Healthy confirmation of the uptrend', 'A top warning', 'Unrelated', 'A sell'], 0, '', '']
  ]);

  /* ================= L3-11 ================= */
  C.addLesson('l3-11', {
    goals: ['Mô tả các chỉ số chứng khoán châu Âu chính và đặc điểm cấu trúc ngành.', 'Phân tích tác động của tỷ giá (EUR, GBP) và lợi suất trái phiếu lên các chỉ số này.', 'Đánh giá quan hệ dẫn – theo giữa châu Âu và Mỹ.', 'Rút ra nguyên tắc áp dụng cho các chỉ số có cơ cấu ngành tập trung (như VNINDEX).'],
    body: () => `
<h3>1. Các chỉ số chính và cấu trúc ngành</h3>
<table class="tbl"><thead><tr><th>Chỉ số</th><th>Đặc điểm</th></tr></thead><tbody>
<tr><td>Đức (DAX)</td><td>Nặng về công nghiệp, ô tô, hoá chất — doanh nghiệp xuất khẩu; nhạy với chu kỳ toàn cầu và Trung Quốc</td></tr>
<tr><td>Anh (FTSE 100)</td><td>Nhiều doanh nghiệp năng lượng, khai khoáng, ngân hàng, hàng tiêu dùng đa quốc gia; doanh thu phần lớn ở nước ngoài</td></tr>
<tr><td>Pháp (CAC 40)</td><td>Hàng xa xỉ, công nghiệp, ngân hàng</td></tr>
<tr><td>Khu vực đồng euro (Euro Stoxx 50)</td><td>Các doanh nghiệp lớn nhất khu vực; ngân hàng chiếm tỷ trọng đáng kể</td></tr></tbody></table>
<p>Cấu trúc ngành quyết định <b>yếu tố liên thị trường</b> nào quan trọng: FTSE nhạy với hàng hoá; DAX nhạy với xuất khẩu và chu kỳ; chỉ số nặng ngân hàng nhạy với lợi suất và đường cong lợi suất.</p>
<h3>2. Tác động của tỷ giá</h3>
<ul><li><b>Đồng nội tệ yếu</b> giúp doanh nghiệp xuất khẩu (doanh thu ngoại tệ quy đổi cao hơn) → chỉ số nặng xuất khẩu thường tăng khi nội tệ yếu.</li>
<li>Với FTSE 100: GBP và chỉ số thường <b>ngược chiều</b> vì phần lớn lợi nhuận bằng ngoại tệ.</li>
<li>Nhà đầu tư nước ngoài phải xét <b>lợi nhuận quy đổi</b>: chỉ số tăng 10% nhưng đồng tiền mất 8% thì lợi nhuận theo USD chỉ khoảng 1%.</li></ul>
<h3>3. Lợi suất và ngân hàng</h3>
<p>Lợi suất trái phiếu dài hạn tăng và đường cong dốc lên hỗ trợ biên lãi ngân hàng → chỉ số nặng ngân hàng tăng. Chênh lệch lợi suất giữa các nước trong khối (rủi ro phân mảnh) là thước đo căng thẳng khu vực.</p>
<h3>4. Dẫn – theo với Mỹ</h3>
<ul><li>Châu Âu mở cửa trước Mỹ, đóng cửa khi Mỹ đang giao dịch → phần lớn biến động cùng ngày là chung; phần còn lại chịu ảnh hưởng phiên Mỹ hôm trước.</li>
<li>Tương quan lợi suất ngày giữa châu Âu và Mỹ cao; tương quan cao hơn nữa khi tính trên lợi suất hai ngày (khắc phục lệch giờ).</li>
<li>Châu Âu thường biến động cùng chiều nhưng có thể <b>dẫn trước</b> khi cú sốc bắt nguồn từ châu Âu (ví dụ khủng hoảng nợ công).</li></ul>
<h3>5. Nguyên tắc áp dụng cho Việt Nam</h3>
<ul><li>VNINDEX có tỷ trọng lớn ở <b>ngân hàng, bất động sản</b> và một số mã vốn hoá lớn → nhạy với lãi suất, tín dụng và tâm lý các nhóm này.</li>
<li>Khi phân tích chỉ số, luôn hỏi: ngành nào chiếm tỷ trọng lớn, yếu tố liên thị trường nào chi phối ngành đó.</li>
<li>Theo dõi chỉ số loại trừ nhóm vốn hoá lớn đặc biệt để thấy "sức khoẻ thật" của thị trường.</li></ul>`,
    keys: ['Cấu trúc ngành quyết định yếu tố liên thị trường quan trọng của chỉ số.', 'DAX: xuất khẩu, chu kỳ; FTSE: hàng hoá, đa quốc gia, ngược chiều GBP; CAC: xa xỉ; Euro Stoxx: ngân hàng.', 'Nội tệ yếu giúp chỉ số nặng xuất khẩu; nhà đầu tư ngoại xét lợi nhuận quy đổi.', 'Lợi suất dài tăng, đường cong dốc → ngân hàng tăng; chênh lệch lợi suất nội khối = căng thẳng.', 'Châu Âu – Mỹ: tương quan cao, lệch giờ; có thể dẫn trước khi cú sốc ở châu Âu.', 'Việt Nam: VNINDEX nặng ngân hàng, bất động sản — phân tích theo cấu trúc ngành.'],
    terms: [['Sector composition', 'Cơ cấu ngành'], ['Currency-adjusted return', 'Lợi nhuận quy đổi tiền tệ'], ['Fragmentation risk', 'Rủi ro phân mảnh'], ['Two-day returns', 'Lợi suất hai ngày']]
  }, {
    goals: ['Describe major European indices and their sector make-up.', 'Analyse currency and yield effects.', 'Assess Europe–US lead–lag.', 'Apply principles to concentrated indices like VNINDEX.'],
    body: () => `
<h3>1. Indices</h3><p>DAX (exporters, cyclicals), FTSE 100 (energy, mining, banks, multinationals), CAC 40 (luxury, industrials, banks), Euro Stoxx 50 (largest firms, banks). Composition decides which intermarket factors matter.</p>
<h3>2. Currency</h3><ul><li>Weak home currency helps exporters.</li><li>FTSE vs GBP often inverse.</li><li>Foreigners must consider currency-adjusted returns.</li></ul>
<h3>3. Yields and banks</h3><p>Rising long yields and steeper curves help bank-heavy indices; intra-bloc yield spreads gauge stress.</p>
<h3>4. Lead–lag with the US</h3><p>High correlation, time-zone overlap; two-day returns raise measured correlation; Europe may lead when shocks start there.</p>
<h3>5. Vietnam</h3><p>VNINDEX is heavy in banks and real estate — analyse by composition; watch ex-mega-cap measures.</p>`,
    keys: ['Composition.', 'Currency effects.', 'Yields and banks.', 'Lead–lag.', 'Vietnam.'],
    terms: [['Currency-adjusted return', 'Return in the investor’s currency']]
  }, [
    ['Yếu tố quyết định những biến liên thị trường quan trọng với một chỉ số:', 'What decides which intermarket factors matter for an index:', ['Cơ cấu ngành của chỉ số', 'Tên chỉ số', 'Số mã', 'Giờ giao dịch'], ['Its sector composition', 'Its name', 'Number of stocks', 'Trading hours'], 0, '', ''],
    ['Chỉ số Đức nhạy nhất với:', 'The German index is most sensitive to:', ['Xuất khẩu và chu kỳ công nghiệp toàn cầu', 'Giá vàng', 'Giá gạo', 'Không gì'], ['Exports and the global industrial cycle', 'Gold', 'Rice', 'Nothing'], 0, '', ''],
    ['FTSE 100 thường ngược chiều với GBP vì:', 'FTSE 100 often moves opposite to GBP because:', ['Phần lớn lợi nhuận của các doanh nghiệp bằng ngoại tệ', 'Không có doanh nghiệp xuất khẩu', 'Do luật', 'Không đúng'], ['Most constituent profits are earned abroad', 'No exporters', 'Law', 'False'], 0, '', ''],
    ['FTSE 100 nhạy với hàng hoá vì:', 'FTSE 100 is commodity-sensitive because:', ['Tỷ trọng lớn của năng lượng và khai khoáng', 'Không có ngân hàng', 'Ngẫu nhiên', 'Không đúng'], ['Large energy and mining weights', 'No banks', 'Randomly', 'False'], 0, '', ''],
    ['Đồng nội tệ yếu đi thường giúp:', 'A weaker home currency usually helps:', ['Doanh nghiệp xuất khẩu', 'Doanh nghiệp nhập khẩu', 'Nhà đầu tư nước ngoài quy đổi', 'Không ai'], ['Exporters', 'Importers', 'Foreign investors in their currency', 'Nobody'], 0, '', ''],
    ['Chỉ số tăng 12%, đồng nội tệ mất 10% so với USD. Lợi nhuận theo USD khoảng:', 'Index +12%, local currency −10% vs USD. USD return ≈', ['+0.8%', '+12%', '+22%', '−10%'], null, 0, '1.12 × 0.9 − 1.', ''],
    ['Lợi suất dài hạn tăng và đường cong dốc lên thường hỗ trợ:', 'Rising long yields and a steeper curve usually support:', ['Ngân hàng', 'Tiện ích', 'Bất động sản', 'Vàng'], ['Banks', 'Utilities', 'Real estate', 'Gold'], 0, '', ''],
    ['Chênh lệch lợi suất giữa các nước trong khối euro mở rộng phản ánh:', 'Widening intra-euro yield spreads reflect:', ['Căng thẳng/rủi ro phân mảnh khu vực', 'Tăng trưởng mạnh', 'Lạm phát thấp', 'Không gì'], ['Regional stress/fragmentation risk', 'Strong growth', 'Low inflation', 'Nothing'], 0, '', ''],
    ['Tương quan châu Âu – Mỹ tính trên lợi suất hai ngày thường cao hơn vì:', 'Europe–US correlation on two-day returns is higher because:', ['Khắc phục lệch giờ đóng cửa', 'Ngẫu nhiên', 'Ít dữ liệu', 'Không đúng'], ['It corrects for closing-time mismatch', 'Random', 'Less data', 'False'], 0, '', ''],
    ['Châu Âu có thể dẫn trước Mỹ khi:', 'Europe may lead the US when:', ['Cú sốc bắt nguồn từ châu Âu', 'Luôn luôn', 'Không bao giờ', 'Mỹ nghỉ lễ'], ['The shock originates in Europe', 'Always', 'Never', 'US holidays'], 0, '', ''],
    ['CAC 40 có tỷ trọng đáng kể ở nhóm:', 'CAC 40 has notable weight in:', ['Hàng xa xỉ', 'Khai thác than', 'Nông nghiệp', 'Crypto'], ['Luxury goods', 'Coal', 'Agriculture', 'Crypto'], 0, '', ''],
    ['Nhà đầu tư nước ngoài phải xét lợi nhuận quy đổi vì:', 'Foreign investors must consider converted returns because:', ['Biến động tỷ giá có thể xoá phần lớn lợi nhuận chỉ số', 'Không quan trọng', 'Do thuế', 'Luôn có lợi'], ['FX moves can erase much of the index gain', 'It doesn’t matter', 'Taxes', 'Always favourable'], 0, '', ''],
    ['VNINDEX nhạy với lãi suất và tín dụng chủ yếu vì:', 'VNINDEX is rate- and credit-sensitive mainly because:', ['Tỷ trọng lớn của ngân hàng và bất động sản', 'Nhiều cổ phiếu công nghệ', 'Không có ngân hàng', 'Ngẫu nhiên'], ['Large bank and real-estate weights', 'Many tech stocks', 'No banks', 'Randomly'], 0, '', ''],
    ['Theo dõi chỉ số loại trừ nhóm vốn hoá lớn đặc biệt giúp:', 'Watching an index excluding a few mega-caps helps:', ['Thấy "sức khoẻ thật" của số đông cổ phiếu', 'Tăng lợi nhuận', 'Không gì', 'Giảm phí'], ['See the real health of most stocks', 'Raise profit', 'Nothing', 'Cut fees'], 0, '', ''],
    ['Tình huống: EUR giảm mạnh, DAX tăng. Lý giải hợp lý:', 'Case: EUR drops sharply, DAX rises. A sound explanation:', ['Doanh nghiệp xuất khẩu được lợi từ đồng tiền yếu', 'Ngẫu nhiên', 'Lãi suất Mỹ giảm', 'Không lý giải được'], ['Exporters benefit from the weak currency', 'Random', 'US rates fell', 'Inexplicable'], 0, '', ''],
    ['Tình huống: giá dầu và kim loại tăng mạnh. Chỉ số châu Âu nào có khả năng hưởng lợi nhiều nhất?', 'Case: oil and metals surge. Which European index likely benefits most?', ['FTSE 100', 'CAC 40', 'Không chỉ số nào', 'Chỉ số trái phiếu'], ['FTSE 100', 'CAC 40', 'None', 'A bond index'], 0, '', ''],
    ['Chỉ số nặng ngân hàng chịu áp lực khi:', 'Bank-heavy indices suffer when:', ['Đường cong lợi suất phẳng/đảo ngược và rủi ro tín dụng tăng', 'Đường cong dốc', 'Lãi suất ổn định', 'Không bao giờ'], ['Curves flatten/invert and credit risk rises', 'Curves steepen', 'Rates are stable', 'Never'], 0, '', ''],
    ['Phần lớn biến động cùng ngày giữa châu Âu và Mỹ là:', 'Most same-day co-movement between Europe and the US is:', ['Chung (yếu tố toàn cầu)', 'Hoàn toàn riêng', 'Ngẫu nhiên', 'Ngược chiều'], ['Common (global factors)', 'Fully idiosyncratic', 'Random', 'Opposite'], 0, '', ''],
    ['Nguyên tắc chính rút ra từ chỉ số châu Âu cho mọi chỉ số:', 'The general principle from European indices:', ['Phân tích chỉ số theo cơ cấu ngành và yếu tố chi phối từng ngành', 'Mọi chỉ số giống nhau', 'Chỉ nhìn giá', 'Bỏ qua tỷ giá'], ['Analyse indices by composition and each sector’s drivers', 'All indices are alike', 'Price only', 'Ignore FX'], 0, '', ''],
    ['Khủng hoảng nợ công châu Âu là ví dụ về:', 'The European sovereign-debt crisis exemplifies:', ['Cú sốc khu vực khiến châu Âu dẫn trước', 'Châu Á dẫn trước', 'Không ảnh hưởng thị trường', 'Bùng nổ'], ['A regional shock making Europe lead', 'Asia leading', 'No market impact', 'A boom'], 0, '', ''],
    ['Đồng tiền yếu khiến nhà đầu tư ngoại nắm cổ phiếu nội địa:', 'A weak currency leaves foreign holders of local stocks:', ['Chịu lỗ tỷ giá khi quy đổi', 'Có lãi tỷ giá', 'Không ảnh hưởng', 'Được miễn thuế'], ['With FX losses on conversion', 'With FX gains', 'Unaffected', 'Tax-exempt'], 0, '', ''],
    ['Euro Stoxx 50 gồm:', 'Euro Stoxx 50 contains:', ['Các doanh nghiệp lớn nhất khu vực đồng euro', 'Chỉ doanh nghiệp Anh', 'Chỉ ngân hàng', 'Doanh nghiệp nhỏ'], ['The largest euro-area companies', 'UK firms only', 'Banks only', 'Small caps'], 0, '', ''],
    ['Phân tích chỉ số tập trung ngành, rủi ro lớn nhất là:', 'With a sector-concentrated index, the biggest risk is:', ['Một ngành chi phối biến động của cả chỉ số', 'Đa dạng hoá quá mức', 'Không có rủi ro', 'Thanh khoản quá cao'], ['One sector dominating index moves', 'Over-diversification', 'No risk', 'Too much liquidity'], 0, '', ''],
    ['Nhóm ô tô châu Âu nhạy cảm đặc biệt với:', 'European autos are especially sensitive to:', ['Nhu cầu Trung Quốc, tỷ giá, thuế quan', 'Giá cà phê', 'Không gì', 'Lãi suất Việt Nam'], ['Chinese demand, FX, tariffs', 'Coffee', 'Nothing', 'Vietnamese rates'], 0, '', ''],
    ['Khi phân tích VNINDEX tăng mạnh nhờ vài mã vốn hoá lớn trong khi độ rộng yếu, nên:', 'When VNINDEX rallies on a few mega-caps with weak breadth, you should:', ['Thận trọng — sự tham gia hẹp', 'Mua mọi cổ phiếu', 'Bỏ qua độ rộng', 'Tăng đòn bẩy'], ['Be cautious — narrow participation', 'Buy everything', 'Ignore breadth', 'Add leverage'], 0, '', ''],
    ['Biến động lợi suất trái phiếu chính phủ một nước ngoại vi trong khối tăng vọt cho thấy:', 'A spike in a peripheral euro country’s yields signals:', ['Căng thẳng tín dụng khu vực — tiêu cực cho ngân hàng', 'Tăng trưởng mạnh', 'Lạm phát thấp', 'Không gì'], ['Regional credit stress — negative for banks', 'Strong growth', 'Low inflation', 'Nothing'], 0, '', ''],
    ['Doanh nghiệp đa quốc gia niêm yết ở nước có đồng tiền mạnh lên sẽ:', 'Multinationals listed where the currency strengthens will:', ['Có lợi nhuận quy đổi thấp hơn', 'Có lợi nhuận quy đổi cao hơn', 'Không ảnh hưởng', 'Không xác định'], ['See lower translated profits', 'Higher translated profits', 'No effect', 'Undetermined'], 0, '', ''],
    ['Tương quan cao giữa các chỉ số châu Âu với nhau hàm ý:', 'High correlation among European indices implies:', ['Đa dạng hoá giữa chúng hạn chế', 'Đa dạng hoá rất tốt', 'Không liên quan', 'Rủi ro bằng 0'], ['Limited diversification among them', 'Great diversification', 'Unrelated', 'Zero risk'], 0, '', ''],
    ['Câu hỏi đầu tiên khi phân tích liên thị trường một chỉ số lạ:', 'The first intermarket question for an unfamiliar index:', ['Ngành nào chiếm tỷ trọng lớn và yếu tố nào chi phối các ngành đó?', 'Chỉ số có bao nhiêu chữ cái?', 'Giá hôm qua?', 'Không cần hỏi'], ['Which sectors dominate and what drives them?', 'How many letters?', 'Yesterday’s price?', 'None'], 0, '', ''],
    ['Bài học tổng quát về tiền tệ và chỉ số:', 'The general currency–index lesson:', ['Tác động phụ thuộc chỉ số nặng về xuất khẩu hay nhập khẩu và góc nhìn của nhà đầu tư', 'Đồng tiền mạnh luôn tốt', 'Đồng tiền yếu luôn tốt', 'Không liên quan'], ['Effects depend on export/import weight and the investor’s currency', 'Strong currency always good', 'Weak currency always good', 'Unrelated'], 0, '', '']
  ]);
})(window.LLW);
