/* CMT Level 2 — Part 5, lessons 27–32: technical methods and market selection. Written by Lai Long Master TA in its own words. */
(function (L) {
  'use strict';
  const C = L.cmt, H = C.demoHtml;
  const ld = () => `<span class="spinner"></span>${L.t('loading')}`;

  /* ---------- demo: market selection screener ---------- */
  H.selScreen = () => C.demoShell('selScreen', C.mkSel('d-mk', C.mktItems(), 'vn_stock') + `<input class="d-sym" style="min-width:260px" value="FPT,HPG,VNM,MWG,SSI,VCB,DGC,GEX" spellcheck="false"><button class="btn primary d-go">${L.T('Sàng lọc', 'Screen')}</button>`,
    L.T('Chấm điểm mức "đáng giao dịch theo xu hướng" cho một danh sách mã (khung ngày, 100 phiên gần nhất).', 'Score a list of symbols for trend-trading suitability (daily, last 100 bars).'));
  C.demoRun.selScreen = box => {
    const out = box.querySelector('.demo-out'), el = box.querySelector('.demo-chart');
    if (el) el.style.display = 'none';
    C.wire(box, async () => {
      out.innerHTML = ld();
      try {
        const mk = box.querySelector('.d-mk').value, syms = box.querySelector('.d-sym').value.split(/[\s,;]+/).map(s => s.trim().toUpperCase()).filter(Boolean).slice(0, 12);
        const rows = await Promise.all(syms.map(async s => {
          try {
            const bars = (await C.loadBars(mk, s, '1D')).slice(-160), w = bars.slice(-100), n = 20;
            const c = w.map(b => b.c), net = Math.abs(c[c.length - 1] - c[c.length - 1 - n]);
            let path = 0; for (let i = c.length - n; i < c.length; i++) path += Math.abs(c[i] - c[i - 1]);
            const er = path ? net / path : 0, adx = C.ind2.dmi(bars).adx.slice(-1)[0] || 0, atr = L.ind.atr(bars, 14).slice(-1)[0], px = c[c.length - 1];
            const val = w.slice(-20).reduce((a, b) => a + b.c * (b.v || 0), 0) / 20, chg = (px / c[0] - 1) * 100;
            return { s, er, adx, atrp: atr / px * 100, val, chg, score: adx * (atr / px * 100) * (0.5 + er) };
          } catch (e) { return { s, err: true }; }
        }));
        const ok = rows.filter(r => !r.err).sort((a, b) => b.score - a.score), bad = rows.filter(r => r.err).map(r => r.s);
        const fv = v => v >= 1e9 ? (v / 1e9).toFixed(1) + 'B' : v >= 1e6 ? (v / 1e6).toFixed(1) + 'M' : v.toFixed(0);
        out.innerHTML = `<table class="tbl"><thead><tr><th>#</th><th>${L.T('Mã', 'Symbol')}</th><th>ADX</th><th>ER(20)</th><th>ATR%</th><th>${L.T('GT TB 20p', 'Avg value 20d')}</th><th>${L.T('Thay đổi 100p', '100-bar chg')}</th><th>${L.T('Điểm', 'Score')}</th></tr></thead><tbody>
          ${ok.map((r, i) => `<tr><td>${i + 1}</td><td><b>${r.s}</b></td><td>${r.adx.toFixed(0)}</td><td>${r.er.toFixed(2)}</td><td>${r.atrp.toFixed(2)}</td><td>${fv(r.val)}</td><td style="color:var(${r.chg >= 0 ? '--up' : '--down'})">${r.chg.toFixed(1)}%</td><td><b>${r.score.toFixed(0)}</b></td></tr>`).join('')}</tbody></table>
          <p class="muted">${L.T('Điểm = ADX × ATR% × (0.5 + ER): ưu tiên mã có xu hướng rõ (ADX), đủ biên độ để có lời (ATR%), và đi "hiệu quả" (ER cao = ít nhiễu). Luôn kiểm tra thêm thanh khoản (giá trị giao dịch) và chi phí trước khi chọn.', 'Score = ADX × ATR% × (0.5 + ER): favours clear trends, enough range to profit, and efficient movement. Always check liquidity and costs too.')}${bad.length ? ' ' + L.T('Không tải được: ', 'Failed: ') + bad.join(', ') : ''}</p>`;
      } catch (e) { C.err(out, e); }
    });
  };

  /* ---------- calculator: weight-of-evidence model ---------- */
  const WOE = [
    ['tr', 'Chỉ số trên MA 200 ngày', 'Index above 200-day MA', 'Xu hướng', 'Trend'],
    ['tr2', 'MA 50 trên MA 200', '50-day MA above 200-day', 'Xu hướng', 'Trend'],
    ['mo', 'ROC 13 tuần dương', '13-week ROC positive', 'Động lượng', 'Momentum'],
    ['br', 'Đường A/D trên MA 50 ngày', 'A/D line above its 50-day MA', 'Độ rộng', 'Breadth'],
    ['br2', '> 60% số mã trên MA 50', '> 60% of stocks above 50-day MA', 'Độ rộng', 'Breadth'],
    ['mn', 'Lãi suất ngắn hạn giảm trong 6 tháng', 'Short rates falling over 6 months', 'Tiền tệ', 'Monetary'],
    ['mn2', 'Lợi suất trái phiếu 10 năm dưới MA 26 tuần', '10-yr yield below 26-week MA', 'Tiền tệ', 'Monetary'],
    ['se', 'Tâm lý bi quan cực độ (ngược = tích cực)', 'Extreme pessimism (contrarian positive)', 'Tâm lý', 'Sentiment'],
    ['va', 'Định giá dưới trung bình lịch sử', 'Valuation below historical average', 'Định giá', 'Valuation']];
  H.woeCalc = () => `<div class="demo" data-demo="woeCalc"><div class="demo-head"><b>🧮 ${L.T('Mô hình "trọng lượng bằng chứng"', 'Weight-of-evidence model')}</b></div>
    <div class="demo-calc">${WOE.map(w => `<label class="chk" style="display:block"><input type="checkbox" class="w-${w[0]}"> <b>[${L.T(w[3], w[4])}]</b> ${L.T(w[1], w[2])}</label>`).join('')}</div><div class="demo-out"></div></div>`;
  C.demoRun.woeCalc = box => {
    const run = () => {
      const on = WOE.filter(w => box.querySelector('.w-' + w[0]).checked).length, pct = on / WOE.length * 100;
      const [vi, en] = pct >= 67 ? ['Tích cực — tỷ trọng cổ phiếu cao (ví dụ 80–100%)', 'Bullish — high equity exposure (e.g. 80–100%)'] : pct >= 34 ? ['Trung tính — tỷ trọng vừa phải (ví dụ 40–60%)', 'Neutral — moderate exposure (e.g. 40–60%)'] : ['Tiêu cực — phòng thủ, tỷ trọng thấp (ví dụ 0–30%)', 'Bearish — defensive, low exposure (e.g. 0–30%)'];
      box.querySelector('.demo-out').innerHTML = L.T(`Điểm: <b>${on}/${WOE.length}</b> (${pct.toFixed(0)}%) → <b>${vi}</b>. Mô hình thật cần kiểm định ngược từng thành phần và cả tổ hợp, với ngưỡng và tỷ trọng được xác định trước.`, `Score: <b>${on}/${WOE.length}</b> (${pct.toFixed(0)}%) → <b>${en}</b>. A real model must backtest each component and the composite with predefined thresholds and weights.`);
    };
    box.querySelectorAll('input').forEach(i => { i.onchange = run; });
    run();
  };

  /* ---------- calculator: active management ---------- */
  H.irCalc = () => C.calcShell('irCalc', `${C.num('rp', 14, L.T('LN danh mục %', 'Portfolio return %'), 0.5)}${C.num('rb', 11, L.T('LN chuẩn %', 'Benchmark return %'), 0.5)}${C.num('te', 4, L.T('Tracking error %', 'Tracking error %'), 0.5)}${C.num('sp', 18, L.T('σ danh mục %', 'Portfolio σ %'), 0.5)}${C.num('rf', 4, 'Rf %', 0.5)}${C.num('fee', 1.5, L.T('Phí %/năm', 'Fees %/yr'), 0.1)}`);
  C.demoRun.irCalc = box => {
    const run = () => {
      const g = c => +box.querySelector('.' + c).value, net = g('rp') - g('fee'), act = net - g('rb');
      const ir = act / (g('te') || 1e-9), sh = (net - g('rf')) / (g('sp') || 1e-9);
      box.querySelector('.demo-out').innerHTML = L.T(`LN sau phí = ${net.toFixed(2)}%. LN chủ động (so với chuẩn) = <b>${act.toFixed(2)}%</b>. Information ratio = <b>${ir.toFixed(2)}</b> ${ir >= 0.5 ? '(tốt)' : ir > 0 ? '(khiêm tốn)' : '(âm — thua chuẩn)'}. Sharpe = ${sh.toFixed(2)}.`,
        `Net return = ${net.toFixed(2)}%. Active return = <b>${act.toFixed(2)}%</b>. Information ratio = <b>${ir.toFixed(2)}</b> ${ir >= 0.5 ? '(good)' : ir > 0 ? '(modest)' : '(negative)'}. Sharpe = ${sh.toFixed(2)}.`);
    };
    box.querySelectorAll('.d-num').forEach(i => { i.oninput = run; });
    run();
  };

  /* ================= L2-27 ================= */
  C.addLesson('l2-27', {
    goals: ['Nêu tiêu chí chọn thị trường và mã giao dịch.', 'Dùng thanh khoản, biến động, xu hướng và chi phí để sàng lọc.', 'Mô tả chỉ số chọn hàng hoá (CSI) và tỷ lệ hiệu quả (ER).', 'Phân biệt phương pháp từ trên xuống và từ dưới lên.'],
    body: () => `
<h3>1. Vì sao chọn thị trường quan trọng</h3>
<p>Cùng một hệ thống, áp dụng lên các thị trường khác nhau cho kết quả rất khác nhau. Hệ thống theo xu hướng cần thị trường <b>có xu hướng</b>; hệ thống đảo chiều cần thị trường <b>dao động trong biên</b>. Chọn đúng "sân chơi" thường quan trọng không kém chọn chiến lược.</p>
<h3>2. Các tiêu chí chính</h3>
<table class="tbl"><thead><tr><th>Tiêu chí</th><th>Đo bằng</th><th>Lý do</th></tr></thead><tbody>
<tr><td><b>Thanh khoản</b></td><td>Giá trị giao dịch trung bình, chênh lệch mua–bán, OI</td><td>Vào/ra không trượt giá; tránh bị mắc kẹt</td></tr>
<tr><td><b>Biến động</b></td><td>ATR, ATR% của giá, độ lệch chuẩn</td><td>Đủ biên độ để lợi nhuận vượt chi phí; nhưng không quá lớn so với vốn</td></tr>
<tr><td><b>Tính xu hướng</b></td><td>ADX/ADXR, tỷ lệ hiệu quả, R² hồi quy</td><td>Phù hợp với loại hệ thống</td></tr>
<tr><td><b>Chi phí</b></td><td>Phí, thuế, trượt giá, ký quỹ</td><td>Chi phí cao "ăn" lợi thế nhỏ</td></tr>
<tr><td><b>Tương quan</b></td><td>Tương quan với các vị thế đang có</td><td>Đa dạng hoá thực sự, tránh rủi ro tập trung</td></tr>
<tr><td><b>Quy mô hợp đồng/vốn</b></td><td>Giá trị 1 điểm, ký quỹ</td><td>Có thể định cỡ vị thế theo quy tắc rủi ro</td></tr></tbody></table>
<h3>3. Hai thước đo đặc trưng</h3>
<ul><li><b>Tỷ lệ hiệu quả (Efficiency Ratio, ER)</b> = |thay đổi ròng N kỳ| / Σ|thay đổi từng kỳ|. ER gần 1 = giá đi thẳng (xu hướng sạch); gần 0 = nhiễu, đi ngang.</li>
<li><b>Chỉ số chọn hàng hoá (Commodity Selection Index, CSI)</b> của Wilder kết hợp <b>ADXR</b> (tính xu hướng) với <b>ATR</b> (biến động), điều chỉnh theo giá trị mỗi điểm giá, ký quỹ và hoa hồng. Ý tưởng: ưu tiên thị trường vừa có xu hướng mạnh vừa có biên độ lớn so với chi phí vốn bỏ ra.</li></ul>
<div class="callout"><b>Ví dụ ER</b>: giá đi từ 100 lên 110 sau 10 phiên, tổng quãng đường các bước là 25. ER = 10/25 = <b>0.4</b>. Cùng mức tăng 10 nhưng quãng đường 12 thì ER = 0.83 — xu hướng sạch hơn nhiều.</div>
<h3>4. Từ trên xuống và từ dưới lên</h3>
<ul><li><b>Từ trên xuống</b>: thị trường chung → ngành mạnh (sức mạnh tương đối) → cổ phiếu dẫn đầu trong ngành.</li>
<li><b>Từ dưới lên</b>: sàng lọc cổ phiếu theo tiêu chí kỹ thuật (breakout, RS cao, khối lượng) bất kể ngành, sau đó kiểm tra bối cảnh thị trường.</li>
<li>Trong thực tế, kết hợp: thị trường chung quyết định <b>tỷ trọng</b>, ngành và cổ phiếu quyết định <b>chọn gì</b>.</li></ul>
<h3>5. Quy trình sàng lọc gợi ý</h3>
<ol><li>Lọc thanh khoản tối thiểu (ví dụ giá trị giao dịch trung bình 20 phiên).</li><li>Lọc tính xu hướng (ADX &gt; 20–25, ER cao, giá trên MA dài).</li><li>Xếp hạng sức mạnh tương đối.</li><li>Kiểm tra tương quan với danh mục hiện tại.</li><li>Định cỡ vị thế theo ATR.</li></ol>
${H.selScreen()}`,
    keys: ['Chọn thị trường phù hợp với loại hệ thống: xu hướng hay dao động.', 'Tiêu chí: thanh khoản, biến động, tính xu hướng, chi phí, tương quan, quy mô.', 'ER = |thay đổi ròng|/Σ|thay đổi|: gần 1 = xu hướng sạch.', 'CSI (Wilder): ADXR × ATR, điều chỉnh theo giá trị điểm, ký quỹ, phí.', 'Từ trên xuống: thị trường → ngành → cổ phiếu; từ dưới lên: sàng lọc cổ phiếu rồi kiểm tra bối cảnh.'],
    terms: [['Efficiency ratio', 'Tỷ lệ hiệu quả'], ['Commodity Selection Index', 'Chỉ số chọn hàng hoá'], ['ADXR', 'ADX đánh giá (trung bình ADX hiện tại và N kỳ trước)'], ['Top-down / bottom-up', 'Từ trên xuống / từ dưới lên'], ['Slippage', 'Trượt giá']]
  }, {
    goals: ['State market-selection criteria.', 'Screen by liquidity, volatility, trendiness and cost.', 'Describe the CSI and efficiency ratio.', 'Contrast top-down and bottom-up.'],
    body: () => `
<h3>1. Why it matters</h3><p>The same system performs very differently across markets; match market character to system type.</p>
<h3>2. Criteria</h3><table class="tbl"><tbody><tr><td>Liquidity</td><td>value traded, spreads, OI</td></tr><tr><td>Volatility</td><td>ATR, ATR%</td></tr><tr><td>Trendiness</td><td>ADX/ADXR, ER, R²</td></tr><tr><td>Costs</td><td>fees, slippage, margin</td></tr><tr><td>Correlation</td><td>with current holdings</td></tr><tr><td>Contract size</td><td>position-sizing feasibility</td></tr></tbody></table>
<h3>3. Measures</h3><ul><li>ER = |net change| / Σ|changes|.</li><li>Wilder’s CSI: ADXR × ATR adjusted for point value, margin, commission.</li></ul><div class="callout">+10 over a path of 25 → ER 0.4; path 12 → 0.83.</div>
<h3>4. Top-down vs bottom-up</h3><ul><li>Market → sector → stock.</li><li>Screen stocks, then check context.</li></ul>
<h3>5. Screening steps</h3><ol><li>Liquidity</li><li>Trendiness</li><li>RS ranking</li><li>Correlation</li><li>ATR sizing</li></ol>${H.selScreen()}`,
    keys: ['Match market to system.', 'Criteria.', 'ER.', 'CSI.', 'Top-down/bottom-up.'],
    terms: [['Efficiency ratio', 'Net change / path length'], ['CSI', 'Commodity Selection Index']]
  }, [
    ['Hệ thống theo xu hướng nên được áp dụng lên thị trường:', 'Trend systems should be applied to markets that:', ['Có tính xu hướng cao', 'Đi ngang hẹp', 'Không thanh khoản', 'Có chi phí cao nhất'], ['Trend well', 'Range tightly', 'Are illiquid', 'Cost the most'], 0, '', ''],
    ['Thước đo phù hợp cho thanh khoản:', 'A suitable liquidity measure:', ['Giá trị giao dịch trung bình và chênh lệch mua–bán', 'RSI', 'Fibonacci', 'P/E'], ['Average value traded and bid–ask spread', 'RSI', 'Fibonacci', 'P/E'], 0, '', ''],
    ['Giá tăng từ 50 lên 56 trong 10 phiên, tổng quãng đường 20. ER =', 'Price 50 → 56 over 10 bars, path 20. ER =', ['0.12', '0.3', '0.56', '3.3'], null, 1, '6/20.', ''],
    ['ER gần 0 cho thấy:', 'ER near 0 shows:', ['Nhiễu, đi ngang', 'Xu hướng rất sạch', 'Thanh khoản cao', 'Biến động thấp tuyệt đối'], ['Noise, sideways', 'A very clean trend', 'High liquidity', 'Zero volatility'], 0, '', ''],
    ['Commodity Selection Index của Wilder kết hợp:', 'Wilder’s Commodity Selection Index combines:', ['ADXR và ATR, điều chỉnh theo giá trị điểm, ký quỹ, phí', 'RSI và MACD', 'Khối lượng và OI', 'P/E và cổ tức'], ['ADXR and ATR adjusted for point value, margin, commission', 'RSI and MACD', 'Volume and OI', 'P/E and dividends'], 0, '', ''],
    ['Vì sao cần biến động đủ lớn?', 'Why is enough volatility needed?', ['Để lợi nhuận tiềm năng vượt chi phí giao dịch', 'Để rủi ro bằng 0', 'Để tăng phí', 'Không cần'], ['So potential profit exceeds costs', 'For zero risk', 'Higher fees', 'Not needed'], 0, '', ''],
    ['Vì sao kiểm tra tương quan với danh mục hiện có?', 'Why check correlation with current holdings?', ['Tránh rủi ro tập trung, đa dạng hoá thực sự', 'Tăng thanh khoản', 'Tăng ADX', 'Không cần'], ['Avoid concentration, achieve real diversification', 'Liquidity', 'Raise ADX', 'Not needed'], 0, '', ''],
    ['Phương pháp từ trên xuống bắt đầu từ:', 'Top-down starts with:', ['Thị trường chung, rồi ngành, rồi cổ phiếu', 'Một cổ phiếu', 'Báo cáo tài chính', 'Tin đồn'], ['The market, then sectors, then stocks', 'One stock', 'Financial statements', 'Rumours'], 0, '', ''],
    ['Phương pháp từ dưới lên:', 'Bottom-up:', ['Sàng lọc cổ phiếu theo tiêu chí trước, rồi kiểm tra bối cảnh', 'Bắt đầu từ chỉ số', 'Chỉ đọc vĩ mô', 'Không sàng lọc'], ['Screen stocks first, then check context', 'Starts with the index', 'Macro only', 'No screening'], 0, '', ''],
    ['ADX dùng trong chọn thị trường để đo:', 'ADX in market selection measures:', ['Tính xu hướng (độ mạnh, không hướng)', 'Hướng xu hướng', 'Thanh khoản', 'Chi phí'], ['Trendiness (strength, not direction)', 'Direction', 'Liquidity', 'Cost'], 0, '', ''],
    ['Thị trường có chênh lệch mua–bán rất rộng gây ra:', 'Very wide bid–ask spreads cause:', ['Chi phí trượt giá cao', 'Lợi nhuận chắc chắn', 'Biến động thấp', 'ADX cao'], ['High slippage costs', 'Sure profit', 'Low volatility', 'High ADX'], 0, '', ''],
    ['ATR% (ATR/giá) hữu ích hơn ATR tuyệt đối vì:', 'ATR% is more useful than raw ATR because:', ['So sánh được giữa các mã có mức giá khác nhau', 'Luôn nhỏ hơn', 'Không cần giá', 'Bằng ADX'], ['It compares across price levels', 'Always smaller', 'Price-free', 'Equals ADX'], 0, '', ''],
    ['Hệ thống đảo chiều (mean reversion) phù hợp với thị trường:', 'Mean-reversion systems suit markets that:', ['Dao động trong biên, ER thấp', 'Có xu hướng mạnh', 'Không thanh khoản', 'Đang breakout'], ['Range-bound, low ER', 'Trend strongly', 'Are illiquid', 'Are breaking out'], 0, '', ''],
    ['Trong kết hợp từ trên xuống và từ dưới lên, thị trường chung quyết định:', 'Combining both, the overall market decides:', ['Tỷ trọng đầu tư', 'Mã cụ thể', 'Phí', 'Không gì'], ['Exposure level', 'Specific stock', 'Fees', 'Nothing'], 0, '', ''],
    ['ADXR là:', 'ADXR is:', ['Trung bình của ADX hiện tại và ADX N kỳ trước', 'ADX nhân 2', 'ADX trừ RSI', 'ATR làm mượt'], ['Average of current ADX and ADX N bars ago', 'ADX × 2', 'ADX − RSI', 'Smoothed ATR'], 0, '', ''],
    ['Bước đầu tiên hợp lý của quy trình sàng lọc:', 'A sensible first screening step:', ['Lọc thanh khoản tối thiểu', 'Xếp hạng RSI', 'Đọc tin', 'Mua ngay'], ['Minimum liquidity filter', 'RSI ranking', 'Read news', 'Buy now'], 0, '', ''],
    ['Thị trường có ký quỹ quá lớn so với vốn khiến:', 'Margin too large relative to capital means:', ['Không thể định cỡ vị thế theo quy tắc rủi ro', 'Lợi nhuận cao hơn', 'Không rủi ro', 'ADX tăng'], ['Position sizing by risk rules becomes impossible', 'Higher profit', 'No risk', 'Higher ADX'], 0, '', ''],
    ['Hai mã cùng tăng 20% trong 100 phiên; mã A có ER 0.6, mã B ER 0.15. Với hệ thống xu hướng, nên ưu tiên:', 'Two stocks +20% in 100 bars; A ER 0.6, B ER 0.15. For a trend system prefer:', ['A', 'B', 'Như nhau', 'Không mã nào'], ['A', 'B', 'Equal', 'Neither'], 0, '', ''],
    ['Chi phí giao dịch cao đặc biệt nguy hiểm với:', 'High costs are especially harmful to:', ['Hệ thống tần suất cao, lợi thế mỗi lệnh nhỏ', 'Nhà đầu tư dài hạn', 'Danh mục chỉ số', 'Không ai'], ['High-frequency systems with small per-trade edges', 'Long-term investors', 'Index funds', 'Nobody'], 0, '', ''],
    ['Định cỡ vị thế theo ATR giúp:', 'ATR-based position sizing:', ['Cân bằng rủi ro giữa các mã có biến động khác nhau', 'Tăng rủi ro', 'Bỏ qua biến động', 'Không ảnh hưởng'], ['Equalises risk across differently volatile markets', 'Raises risk', 'Ignores volatility', 'No effect'], 0, '', '']
  ]);

  /* ================= L2-28 ================= */
  C.addLesson('l2-28', {
    goals: ['Mô tả các mối quan hệ liên thị trường chính.', 'Giải thích trình tự của trái phiếu, cổ phiếu, hàng hoá qua chu kỳ kinh doanh.', 'Nhận diện thay đổi quan hệ trong môi trường giảm phát.', 'Ứng dụng liên thị trường cho luân chuyển ngành và thị trường Việt Nam.'],
    body: () => `
<h3>1. Bốn thị trường liên kết</h3>
<p>Phân tích liên thị trường xem <b>cổ phiếu, trái phiếu, hàng hoá và tiền tệ</b> như một hệ thống. Không thị trường nào vận động độc lập — tín hiệu ở thị trường này thường <b>dẫn trước</b> thị trường khác.</p>
<table class="tbl"><thead><tr><th>Quan hệ</th><th>Thường gặp (môi trường lạm phát vừa phải)</th><th>Cơ chế</th></tr></thead><tbody>
<tr><td>USD ↔ hàng hoá</td><td><b>Nghịch chiều</b></td><td>Hàng hoá định giá bằng USD; USD mạnh làm hàng hoá đắt hơn với người mua ngoài Mỹ</td></tr>
<tr><td>Hàng hoá ↔ trái phiếu (giá)</td><td><b>Nghịch chiều</b></td><td>Hàng hoá tăng = lạm phát tăng = lợi suất tăng = giá trái phiếu giảm</td></tr>
<tr><td>Trái phiếu ↔ cổ phiếu</td><td><b>Cùng chiều</b>, trái phiếu thường dẫn trước</td><td>Lãi suất giảm hỗ trợ định giá và kinh tế</td></tr>
<tr><td>USD ↔ cổ phiếu Mỹ</td><td>Quan hệ yếu, thay đổi</td><td>USD mạnh hút vốn nhưng hại lợi nhuận đa quốc gia</td></tr></tbody></table>
<h3>2. Trình tự qua chu kỳ kinh doanh</h3>
<p>Ở <b>đáy</b> chu kỳ: trái phiếu tạo đáy trước (lãi suất giảm), rồi cổ phiếu, cuối cùng hàng hoá. Ở <b>đỉnh</b>: trái phiếu tạo đỉnh trước (lãi suất bắt đầu tăng), rồi cổ phiếu, rồi hàng hoá. Cổ phiếu thường dẫn trước nền kinh tế 6–9 tháng.</p>
<div class="flow"><span>Trái phiếu</span><span>→</span><span>Cổ phiếu</span><span>→</span><span>Hàng hoá</span></div>
<h3>3. Luân chuyển ngành</h3>
<table class="tbl"><thead><tr><th>Giai đoạn</th><th>Ngành thường dẫn dắt</th></tr></thead><tbody>
<tr><td>Đầu phục hồi (lãi suất thấp)</td><td>Tài chính, tiêu dùng không thiết yếu, vận tải</td></tr>
<tr><td>Giữa chu kỳ</td><td>Công nghệ, công nghiệp</td></tr>
<tr><td>Cuối chu kỳ (lạm phát tăng)</td><td>Năng lượng, vật liệu cơ bản</td></tr>
<tr><td>Suy thoái</td><td>Tiện ích, y tế, tiêu dùng thiết yếu (phòng thủ)</td></tr></tbody></table>
<h3>4. Khi quan hệ thay đổi: giảm phát</h3>
<p>Trong môi trường <b>giảm phát</b> (hoặc lo ngại suy thoái nặng), giá cổ phiếu và lợi suất trái phiếu đi <b>cùng chiều</b> — tức giá trái phiếu và cổ phiếu <b>nghịch chiều</b>: tiền chạy vào trái phiếu an toàn khi cổ phiếu giảm. Bài học: quan hệ liên thị trường <b>không cố định</b>; hãy theo dõi bằng tương quan lăn và tỷ lệ giá.</p>
<h3>5. Liên thị trường toàn cầu và Việt Nam</h3>
<ul><li>Thị trường toàn cầu liên kết; biến động lớn ở Mỹ thường lan sang châu Á.</li>
<li>Với Việt Nam: <b>DXY và tỷ giá USD/VND</b> (USD mạnh gây áp lực tỷ giá, dòng vốn ngoại rút), <b>lãi suất liên ngân hàng</b> và chính sách của Ngân hàng Nhà nước, <b>giá dầu, thép, phân bón</b> (với cổ phiếu ngành tương ứng), <b>giao dịch khối ngoại</b>.</li>
<li>Công cụ: biểu đồ tỷ lệ (ví dụ cổ phiếu/trái phiếu, đồng/vàng), tương quan lăn, so sánh nhiều biểu đồ cùng khung.</li></ul>
${H.corrLab()}`,
    keys: ['Bốn thị trường: cổ phiếu, trái phiếu, hàng hoá, tiền tệ — liên kết, dẫn trước nhau.', 'USD ↔ hàng hoá nghịch; hàng hoá ↔ giá trái phiếu nghịch; trái phiếu ↔ cổ phiếu cùng chiều, trái phiếu dẫn trước.', 'Trình tự đáy và đỉnh: trái phiếu → cổ phiếu → hàng hoá.', 'Luân chuyển ngành theo giai đoạn chu kỳ.', 'Giảm phát: giá trái phiếu và cổ phiếu nghịch chiều — quan hệ thay đổi theo chế độ.', 'Việt Nam: DXY, USD/VND, lãi suất liên ngân hàng, hàng hoá, khối ngoại.'],
    terms: [['Intermarket analysis', 'Phân tích liên thị trường'], ['Sector rotation', 'Luân chuyển ngành'], ['Deflation', 'Giảm phát'], ['Ratio chart', 'Biểu đồ tỷ lệ'], ['Leading market', 'Thị trường dẫn trước']]
  }, {
    goals: ['Describe key intermarket relationships.', 'Explain the bond–stock–commodity sequence.', 'Recognise the deflationary regime change.', 'Apply to sector rotation and Vietnam.'],
    body: () => `
<h3>1. Relationships</h3><table class="tbl"><tbody><tr><td>USD vs commodities</td><td>inverse</td></tr><tr><td>Commodities vs bond prices</td><td>inverse</td></tr><tr><td>Bonds vs stocks</td><td>positive, bonds lead</td></tr><tr><td>USD vs US stocks</td><td>weak, variable</td></tr></tbody></table>
<h3>2. Sequence</h3><p>At bottoms and tops: bonds → stocks → commodities. Stocks lead the economy by 6–9 months.</p>
<h3>3. Sector rotation</h3><p>Early: financials, discretionary, transports. Mid: tech, industrials. Late: energy, materials. Recession: utilities, healthcare, staples.</p>
<h3>4. Deflation</h3><p>Stock prices and bond yields move together (bond and stock prices inverse). Relationships are regime-dependent — monitor rolling correlations.</p>
<h3>5. Global and Vietnam</h3><ul><li>DXY, USD/VND, interbank rates, commodities, foreign flows.</li><li>Ratio charts, rolling correlations.</li></ul>${H.corrLab()}`,
    keys: ['Four markets.', 'Core relationships.', 'Sequence.', 'Rotation.', 'Deflation regime.', 'Vietnam links.'],
    terms: [['Intermarket analysis', 'Studying cross-market links'], ['Sector rotation', 'Leadership shifts through the cycle']]
  }, [
    ['Quan hệ điển hình giữa USD và giá hàng hoá:', 'Typical USD–commodity relationship:', ['Nghịch chiều', 'Cùng chiều', 'Không liên quan', 'Luôn bằng nhau'], ['Inverse', 'Positive', 'Unrelated', 'Equal'], 0, '', ''],
    ['Hàng hoá tăng mạnh thường đi kèm giá trái phiếu:', 'Strongly rising commodities usually accompany bond prices that:', ['Giảm (lợi suất tăng)', 'Tăng', 'Không đổi', 'Bằng 0'], ['Fall (yields rise)', 'Rise', 'Unchanged', 'Zero'], 0, '', ''],
    ['Trong môi trường lạm phát bình thường, giá trái phiếu và cổ phiếu:', 'In normal inflation regimes, bond and stock prices:', ['Cùng chiều, trái phiếu thường dẫn trước', 'Nghịch chiều', 'Không liên quan', 'Cổ phiếu luôn dẫn trước'], ['Move together, bonds often leading', 'Move inversely', 'Unrelated', 'Stocks always lead'], 0, '', ''],
    ['Trình tự tạo đáy thường gặp qua chu kỳ kinh doanh:', 'The usual bottoming sequence:', ['Trái phiếu → cổ phiếu → hàng hoá', 'Hàng hoá → cổ phiếu → trái phiếu', 'Cổ phiếu → hàng hoá → trái phiếu', 'Đồng thời'], ['Bonds → stocks → commodities', 'Commodities → stocks → bonds', 'Stocks → commodities → bonds', 'Simultaneous'], 0, '', ''],
    ['Thị trường thường tạo đỉnh cuối cùng trong chu kỳ:', 'Typically the last to peak in the cycle:', ['Hàng hoá', 'Trái phiếu', 'Cổ phiếu', 'Tiền mặt'], ['Commodities', 'Bonds', 'Stocks', 'Cash'], 0, '', ''],
    ['Cổ phiếu thường dẫn trước nền kinh tế khoảng:', 'Stocks usually lead the economy by about:', ['6–9 tháng', '1 ngày', '5 năm', 'Không dẫn trước'], ['6–9 months', '1 day', '5 years', 'Never'], 0, '', ''],
    ['Trong môi trường giảm phát, giá trái phiếu và cổ phiếu thường:', 'In deflation, bond and stock prices tend to:', ['Nghịch chiều', 'Cùng chiều', 'Bằng nhau', 'Không giao dịch'], ['Move inversely', 'Move together', 'Be equal', 'Not trade'], 0, '', ''],
    ['Ngành thường dẫn dắt cuối chu kỳ khi lạm phát tăng:', 'Sectors leading late-cycle with rising inflation:', ['Năng lượng, vật liệu', 'Tiện ích', 'Tài chính', 'Bất động sản'], ['Energy, materials', 'Utilities', 'Financials', 'Real estate'], 0, '', ''],
    ['Ngành phòng thủ trong suy thoái:', 'Defensive sectors in recession:', ['Tiện ích, y tế, tiêu dùng thiết yếu', 'Công nghệ', 'Vật liệu', 'Năng lượng'], ['Utilities, healthcare, staples', 'Tech', 'Materials', 'Energy'], 0, '', ''],
    ['Ngành thường dẫn dắt đầu phục hồi khi lãi suất thấp:', 'Early-recovery leaders with low rates:', ['Tài chính, tiêu dùng không thiết yếu', 'Năng lượng', 'Tiện ích', 'Vàng'], ['Financials, consumer discretionary', 'Energy', 'Utilities', 'Gold'], 0, '', ''],
    ['Bài học chính về quan hệ liên thị trường:', 'Key lesson on intermarket relationships:', ['Không cố định — thay đổi theo chế độ, cần theo dõi liên tục', 'Luôn cố định', 'Không tồn tại', 'Chỉ đúng ở Mỹ'], ['Not fixed — regime-dependent, monitor continuously', 'Always fixed', 'Nonexistent', 'US-only'], 0, '', ''],
    ['Với thị trường Việt Nam, USD mạnh lên thường gây:', 'For Vietnam, a stronger USD often brings:', ['Áp lực tỷ giá và dòng vốn ngoại rút ra', 'Dòng vốn ngoại đổ vào chắc chắn', 'Không ảnh hưởng', 'Lãi suất giảm'], ['FX pressure and foreign outflows', 'Certain inflows', 'No effect', 'Lower rates'], 0, '', ''],
    ['Công cụ phù hợp để theo dõi quan hệ thay đổi:', 'A suitable tool to monitor changing relationships:', ['Tương quan lăn và biểu đồ tỷ lệ', 'Một hệ số tương quan cố định 20 năm', 'RSI', 'Nến Nhật'], ['Rolling correlation and ratio charts', 'One fixed 20-year correlation', 'RSI', 'Candles'], 0, '', ''],
    ['Giá dầu tăng mạnh thường có lợi trực tiếp cho cổ phiếu ngành:', 'Surging oil prices most directly help:', ['Khai thác dầu khí', 'Hàng không', 'Vận tải đường bộ', 'Nhựa'], ['Oil & gas producers', 'Airlines', 'Trucking', 'Plastics'], 0, '', ''],
    ['Trái phiếu tạo đỉnh (lãi suất bắt đầu tăng) thường là cảnh báo sớm cho:', 'A bond peak (rising rates) is often an early warning for:', ['Đỉnh cổ phiếu sau đó', 'Đáy cổ phiếu', 'Đáy hàng hoá', 'Không gì'], ['A later stock top', 'A stock bottom', 'A commodity bottom', 'Nothing'], 0, '', ''],
    ['Cơ chế khiến hàng hoá và giá trái phiếu nghịch chiều:', 'Mechanism linking commodities and bond prices inversely:', ['Hàng hoá tăng → kỳ vọng lạm phát tăng → lợi suất tăng', 'Cổ tức', 'Khối lượng', 'Không có'], ['Rising commodities → inflation expectations → higher yields', 'Dividends', 'Volume', 'None'], 0, '', ''],
    ['Biểu đồ tỷ lệ cổ phiếu/trái phiếu tăng cho thấy:', 'A rising stocks/bonds ratio shows:', ['Cổ phiếu vượt trội trái phiếu — khẩu vị rủi ro tăng', 'Trái phiếu vượt trội', 'Giảm phát', 'Không gì'], ['Stocks outperforming — rising risk appetite', 'Bonds outperforming', 'Deflation', 'Nothing'], 0, '', ''],
    ['Vì sao tính tương quan liên thị trường trên lợi suất?', 'Why compute intermarket correlations on returns?', ['Tránh tương quan giả tạo của chuỗi giá có xu hướng', 'Cho số lớn hơn', 'Theo luật', 'Không cần'], ['Avoid spurious correlation of trending prices', 'Bigger numbers', 'Law', 'Unneeded'], 0, '', ''],
    ['Giao dịch khối ngoại là yếu tố liên thị trường vì:', 'Foreign flows are an intermarket factor because:', ['Phản ánh tỷ giá, lãi suất toàn cầu và khẩu vị rủi ro quốc tế', 'Không liên quan', 'Do cổ tức', 'Luôn mua'], ['They reflect FX, global rates and risk appetite', 'Unrelated', 'Dividends', 'Always buying'], 0, '', ''],
    ['Phân tích liên thị trường nên được dùng như:', 'Intermarket analysis is best used as:', ['Bối cảnh và cảnh báo sớm, kết hợp với phân tích giá của chính thị trường', 'Tín hiệu vào lệnh duy nhất', 'Thay thế quản lý rủi ro', 'Không dùng'], ['Context and early warning combined with the market’s own price analysis', 'The only entry signal', 'A substitute for risk management', 'Not at all'], 0, '', '']
  ]);

  /* ================= L2-29 ================= */
  C.addLesson('l2-29', {
    goals: ['Phân biệt sức mạnh tương đối (RS) và chỉ báo RSI.', 'Mô tả bằng chứng về hiệu ứng động lượng.', 'Xây dựng chiến lược xếp hạng và luân chuyển theo RS.', 'Nhận diện rủi ro của chiến lược động lượng.'],
    body: () => `
<h3>1. Sức mạnh tương đối là gì?</h3>
<p><b>RS</b> so sánh hiệu suất của một tài sản với chuẩn hoặc với tài sản khác: <b>RS = giá A / giá B</b> (biểu đồ tỷ lệ), hoặc thứ hạng % thay đổi trong một kỳ. RS khác hoàn toàn với <b>RSI</b> (chỉ báo dao động của chính một mã).</p>
<ul><li>Đường RS tăng = A vượt trội B, kể cả khi cả hai đều giảm.</li><li>Đường RS tạo đỉnh mới trước giá: dấu hiệu dẫn dắt.</li></ul>
<h3>2. Bằng chứng về động lượng</h3>
<ul><li>Nghiên cứu học thuật (Jegadeesh & Titman và nhiều nghiên cứu sau đó) cho thấy cổ phiếu có hiệu suất tốt nhất trong <b>3–12 tháng</b> qua có xu hướng tiếp tục vượt trội trong <b>3–12 tháng</b> tiếp theo.</li>
<li>Ngược lại, ở khung rất ngắn (1 tuần – 1 tháng) và rất dài (3–5 năm) thường có hiện tượng <b>đảo chiều</b>.</li>
<li>Lý giải hành vi: phản ứng chậm (neo, bảo thủ, hiệu ứng phân bổ) rồi phản ứng thái quá (bầy đàn).</li></ul>
<h3>3. Xây dựng chiến lược RS</h3>
<ol><li><b>Vũ trụ</b>: danh sách đủ thanh khoản (ví dụ VN100, các ngành, các quỹ ETF).</li>
<li><b>Thước đo</b>: % thay đổi 6 hoặc 12 tháng (thường bỏ tháng gần nhất để tránh đảo chiều ngắn hạn), hoặc tỷ lệ giá/MA (kiểu Levy), hoặc kết hợp nhiều kỳ.</li>
<li><b>Xếp hạng</b> và chọn nhóm đứng đầu (ví dụ top 10% hoặc top 3 ngành).</li>
<li><b>Tái cân bằng</b> định kỳ (hằng tháng/quý); quy tắc giữ: chỉ bán khi rơi xuống dưới một ngưỡng thấp hơn (ví dụ rơi khỏi top 30%) để giảm vòng quay.</li>
<li><b>Bộ lọc tuyệt đối</b>: chỉ nắm giữ khi tài sản/thị trường có động lượng dương (<b>động lượng kép</b> = tương đối + tuyệt đối); nếu không thì giữ tiền mặt/trái phiếu.</li></ol>
<div class="callout"><b>Ví dụ</b>: mỗi tháng xếp hạng 10 nhóm ngành theo % thay đổi 6 tháng, nắm giữ 3 ngành đứng đầu, nhưng chỉ khi VNINDEX trên MA 200 ngày; ngược lại giữ tiền mặt.</div>
${H.rsRank()}
<h3>4. Rủi ro</h3>
<ul><li><b>Sụp đổ động lượng</b>: khi thị trường đảo chiều mạnh từ đáy, các mã thua cuộc trước đó bật mạnh, mã dẫn đầu giảm — chiến lược long/short động lượng có thể lỗ nặng.</li>
<li><b>Vòng quay và chi phí</b> cao.</li>
<li><b>Tập trung</b> vào một chủ đề/ngành.</li>
<li>Hiệu ứng có thể suy yếu khi nhiều người khai thác.</li></ul>`,
    keys: ['RS = A/B hoặc thứ hạng hiệu suất — khác RSI.', 'Động lượng 3–12 tháng có xu hướng tiếp diễn; khung rất ngắn và rất dài thường đảo chiều.', 'Quy trình: vũ trụ → thước đo → xếp hạng → tái cân bằng với vùng giữ → bộ lọc tuyệt đối.', 'Động lượng kép = tương đối + tuyệt đối.', 'Rủi ro: sụp đổ động lượng, vòng quay, tập trung.'],
    terms: [['Relative strength', 'Sức mạnh tương đối'], ['Momentum effect', 'Hiệu ứng động lượng'], ['Dual momentum', 'Động lượng kép'], ['Momentum crash', 'Sụp đổ động lượng'], ['Turnover', 'Vòng quay danh mục'], ['Holding buffer', 'Vùng giữ']]
  }, {
    goals: ['Distinguish RS from RSI.', 'Describe momentum evidence.', 'Build RS ranking and rotation strategies.', 'Recognise momentum risks.'],
    body: () => `
<h3>1. RS</h3><p>RS = price A / price B or performance rank — not RSI. Rising RS line = outperformance; RS leading price to new highs = leadership.</p>
<h3>2. Evidence</h3><ul><li>3–12-month winners tend to keep outperforming for 3–12 months.</li><li>Very short and very long horizons show reversals.</li><li>Behavioural: underreaction then overreaction.</li></ul>
<h3>3. Strategy</h3><ol><li>Universe</li><li>Measure (6/12-month, skip last month; Levy ratio)</li><li>Rank and select top group</li><li>Rebalance with a holding buffer</li><li>Absolute filter (dual momentum)</li></ol><div class="callout">Monthly: hold top 3 of 10 sectors by 6-month change only if the index is above its 200-day MA.</div>${H.rsRank()}
<h3>4. Risks</h3><ul><li>Momentum crashes</li><li>Turnover and costs</li><li>Concentration</li><li>Decay</li></ul>`,
    keys: ['RS vs RSI.', 'Momentum horizons.', 'Strategy steps.', 'Dual momentum.', 'Risks.'],
    terms: [['Dual momentum', 'Relative plus absolute momentum'], ['Momentum crash', 'Sharp reversal hurting momentum strategies']]
  }, [
    ['Sức mạnh tương đối (RS) khác RSI ở chỗ:', 'RS differs from RSI in that:', ['RS so sánh với chuẩn/tài sản khác; RSI là dao động của chính một mã', 'Là một', 'RSI so sánh hai mã', 'RS chỉ dùng cho tiền tệ'], ['RS compares to a benchmark; RSI is a single-asset oscillator', 'Same', 'RSI compares two assets', 'RS is FX-only'], 0, '', ''],
    ['A giảm 5%, chỉ số giảm 15%. Đường RS của A so với chỉ số:', 'A −5%, index −15%. A’s RS line:', ['Tăng', 'Giảm', 'Không đổi', 'Không xác định'], ['Rises', 'Falls', 'Flat', 'Undefined'], 0, '', ''],
    ['Bằng chứng động lượng mạnh nhất ở khung:', 'Momentum evidence is strongest over:', ['3–12 tháng', '1 ngày', '10 năm', '1 phút'], ['3–12 months', '1 day', '10 years', '1 minute'], 0, '', ''],
    ['Ở khung 3–5 năm, cổ phiếu thắng/thua thường:', 'Over 3–5 years, winners/losers tend to:', ['Đảo chiều', 'Tiếp diễn mạnh', 'Không đổi', 'Ngẫu nhiên tuyệt đối'], ['Reverse', 'Strongly continue', 'Stay flat', 'Be purely random'], 0, '', ''],
    ['Vì sao nhiều chiến lược bỏ qua tháng gần nhất khi đo động lượng 12 tháng?', 'Why skip the most recent month in 12-month momentum?', ['Tránh hiệu ứng đảo chiều ngắn hạn', 'Thiếu dữ liệu', 'Theo luật', 'Tăng phí'], ['Avoid short-term reversal', 'Missing data', 'Law', 'Fees'], 0, '', ''],
    ['Động lượng kép kết hợp:', 'Dual momentum combines:', ['Động lượng tương đối và tuyệt đối', 'RSI và MACD', 'Hai cổ phiếu', 'Giá và khối lượng'], ['Relative and absolute momentum', 'RSI and MACD', 'Two stocks', 'Price and volume'], 0, '', ''],
    ['Bộ lọc tuyệt đối giúp chiến lược RS:', 'An absolute filter helps an RS strategy:', ['Giữ tiền mặt trong thị trường giá xuống, giảm sụt giảm', 'Tăng vòng quay', 'Luôn đầu tư đủ', 'Không ảnh hưởng'], ['Hold cash in bear markets, reducing drawdowns', 'Raise turnover', 'Stay fully invested', 'No effect'], 0, '', ''],
    ['Vùng giữ (ví dụ chỉ bán khi rơi khỏi top 30%) nhằm:', 'A holding buffer (sell only below top 30%) aims to:', ['Giảm vòng quay và chi phí', 'Tăng rủi ro', 'Mua nhiều hơn', 'Không có tác dụng'], ['Cut turnover and costs', 'Raise risk', 'Buy more', 'Nothing'], 0, '', ''],
    ['"Sụp đổ động lượng" thường xảy ra khi:', 'Momentum crashes typically happen when:', ['Thị trường bật mạnh từ đáy sau giai đoạn giảm sâu', 'Xu hướng tăng ổn định', 'Thị trường đi ngang yên', 'Không bao giờ'], ['Markets rebound sharply from deep lows', 'Steady uptrends', 'Quiet ranges', 'Never'], 0, '', ''],
    ['Lý giải hành vi cho động lượng:', 'A behavioural explanation for momentum:', ['Phản ứng chậm rồi phản ứng thái quá', 'Thị trường hiệu quả hoàn hảo', 'Ngẫu nhiên', 'Do luật'], ['Underreaction then overreaction', 'Perfect efficiency', 'Randomness', 'Law'], 0, '', ''],
    ['Đường RS tạo đỉnh mới trước khi giá tạo đỉnh mới cho thấy:', 'An RS line making new highs before price does shows:', ['Dấu hiệu dẫn dắt', 'Yếu', 'Phân kỳ giảm', 'Không gì'], ['Leadership', 'Weakness', 'Bearish divergence', 'Nothing'], 0, '', ''],
    ['Rủi ro tập trung của chiến lược RS phát sinh khi:', 'Concentration risk in RS strategies arises when:', ['Các mã đứng đầu cùng thuộc một chủ đề/ngành', 'Đa dạng hoá rộng', 'Không giao dịch', 'Dùng chỉ số'], ['Top names share one theme/sector', 'Broad diversification', 'No trading', 'Index use'], 0, '', ''],
    ['Thước đo RS kiểu Levy là:', 'A Levy-style RS measure is:', ['Tỷ lệ giá hiện tại / MA dài hạn', 'RSI 14', 'Giá / cổ tức', 'Khối lượng / OI'], ['Current price / long MA', 'RSI 14', 'Price / dividend', 'Volume / OI'], 0, '', ''],
    ['Chiến lược luân chuyển ngành theo RS thường tái cân bằng:', 'Sector RS rotation usually rebalances:', ['Định kỳ (tháng/quý)', 'Mỗi phút', 'Không bao giờ', 'Mỗi 10 năm'], ['Periodically (monthly/quarterly)', 'Every minute', 'Never', 'Every decade'], 0, '', ''],
    ['Vũ trụ đầu tư của chiến lược RS nên:', 'An RS universe should:', ['Đủ thanh khoản để thực hiện', 'Gồm mã không thanh khoản', 'Chỉ một mã', 'Không cần'], ['Be liquid enough to execute', 'Include illiquid names', 'Be one stock', 'Not matter'], 0, '', ''],
    ['Lợi thế động lượng có thể suy yếu vì:', 'Momentum’s edge may decay because:', ['Nhiều người cùng khai thác', 'Luật cấm', 'Không có dữ liệu', 'Không thể'], ['Crowding by many users', 'Banned', 'No data', 'Impossible'], 0, '', ''],
    ['Cả mã A và chỉ số đều giảm, nhưng đường RS của A tăng. Nhà đầu tư dài hạn nên:', 'A and the index both fall but A’s RS rises. A long-term investor should:', ['Theo dõi A như ứng viên dẫn dắt khi thị trường phục hồi', 'Mua ngay bất kể thị trường', 'Bán A', 'Bỏ qua RS'], ['Watch A as a potential leader for the recovery', 'Buy now regardless', 'Sell A', 'Ignore RS'], 0, '', ''],
    ['Nhược điểm chi phí của chiến lược RS chủ yếu đến từ:', 'RS strategy cost drag mostly comes from:', ['Vòng quay cao', 'Cổ tức', 'Lãi suất', 'Không có'], ['High turnover', 'Dividends', 'Rates', 'None'], 0, '', ''],
    ['Xếp hạng theo nhiều kỳ (3, 6, 12 tháng) giúp:', 'Ranking on several horizons (3, 6, 12 months) helps:', ['Giảm phụ thuộc vào một kỳ cụ thể, ổn định hơn', 'Tăng nhiễu', 'Không ý nghĩa', 'Tăng chi phí gấp ba'], ['Reduce dependence on one horizon, more robust', 'Add noise', 'Nothing', 'Triple costs'], 0, '', ''],
    ['Chiến lược RS là một dạng của:', 'RS strategies are a form of:', ['Theo xu hướng / động lượng', 'Đảo chiều', 'Phân tích cơ bản thuần', 'Kinh doanh chênh lệch giá'], ['Trend following / momentum', 'Mean reversion', 'Pure fundamentals', 'Arbitrage'], 0, '', '']
  ]);

  /* ================= L2-30 ================= */
  C.addLesson('l2-30', {
    goals: ['Giải thích cách tiếp cận "trọng lượng bằng chứng".', 'Liệt kê các nhóm chỉ báo trong mô hình thị trường cổ phiếu.', 'Mô tả các chỉ báo tiền tệ kinh điển.', 'Xây dựng, chấm điểm và kiểm định mô hình.'],
    body: () => `
<h3>1. Trọng lượng bằng chứng</h3>
<p>Không chỉ báo nào đúng mọi lúc. Mô hình thị trường cổ phiếu kết hợp <b>nhiều chỉ báo độc lập</b> thuộc các nhóm khác nhau; mỗi chỉ báo cho +1 (tích cực) hoặc 0/−1; tổng điểm quyết định <b>tỷ trọng cổ phiếu</b>. Mục tiêu là tránh phần lớn các đợt giảm lớn và tham gia phần lớn các đợt tăng lớn — không phải bắt đỉnh đáy chính xác.</p>
<h3>2. Các nhóm chỉ báo</h3>
<table class="tbl"><thead><tr><th>Nhóm</th><th>Ví dụ</th><th>Vai trò</th></tr></thead><tbody>
<tr><td><b>Xu hướng giá</b></td><td>Chỉ số so với MA 200 ngày/40 tuần, MA ngắn so với MA dài</td><td>Cốt lõi — "đừng đi ngược băng chuyền"</td></tr>
<tr><td><b>Động lượng</b></td><td>ROC 13/26 tuần, MACD tuần</td><td>Xác nhận sức mạnh</td></tr>
<tr><td><b>Độ rộng</b></td><td>Đường A/D, % mã trên MA 50/200, đỉnh mới − đáy mới, lực đẩy độ rộng</td><td>Kiểm tra sự tham gia; phân kỳ cảnh báo sớm</td></tr>
<tr><td><b>Tiền tệ</b></td><td>Lãi suất chính sách, lợi suất trái phiếu, cung tiền, đường cong lợi suất</td><td>"Nhiên liệu" của thị trường</td></tr>
<tr><td><b>Tâm lý</b></td><td>Khảo sát, put/call, VIX</td><td>Theo hướng ngược ở cực trị</td></tr>
<tr><td><b>Định giá</b></td><td>P/E, lợi suất cổ tức, chênh lệch lợi suất lợi nhuận – trái phiếu</td><td>Bối cảnh dài hạn, kém cho thời điểm</td></tr></tbody></table>
<h3>3. Chỉ báo tiền tệ kinh điển</h3>
<ul><li><b>"Đừng chống lại ngân hàng trung ương"</b>: chu kỳ nới lỏng (giảm lãi suất) thường hỗ trợ cổ phiếu; chu kỳ thắt chặt gây áp lực.</li>
<li><b>"Hai cú ngã và một cú nhảy"</b>: sau hai lần giảm lãi suất liên tiếp, thị trường thường tăng trong 12 tháng tiếp theo.</li>
<li><b>"Ba bước và một cú vấp"</b>: sau ba lần tăng lãi suất liên tiếp, thị trường thường gặp khó khăn.</li>
<li>Xu hướng của lợi suất trái phiếu (so với MA) và đường cong lợi suất (đảo ngược = cảnh báo suy thoái).</li></ul>
<h3>4. Xây dựng và kiểm định</h3>
<ol><li>Chọn chỉ báo <b>độc lập</b> nhau (tránh nhiều chỉ báo xu hướng gần như trùng nhau).</li>
<li>Định nghĩa trước quy tắc +1/0 cho từng chỉ báo.</li>
<li>Kiểm định từng thành phần: % thời gian tích cực, lợi suất hằng năm khi tích cực so với khi tiêu cực.</li>
<li>Gộp thành điểm tổng hợp; ánh xạ điểm → tỷ trọng (ví dụ ≥ 67% → 100% cổ phiếu, 34–66% → 50%, ≤ 33% → 0–20%).</li>
<li>Kiểm định ngoài mẫu và qua nhiều chu kỳ; giữ mô hình <b>đơn giản</b> (ít tham số).</li></ol>
${H.woeCalc()}`,
    keys: ['Trọng lượng bằng chứng: nhiều chỉ báo độc lập, chấm điểm, điểm tổng → tỷ trọng.', 'Nhóm: xu hướng, động lượng, độ rộng, tiền tệ, tâm lý, định giá.', 'Tiền tệ: đừng chống lại NHTW; hai cú ngã và một cú nhảy; ba bước và một cú vấp; đường cong lợi suất.', 'Xây dựng: chỉ báo độc lập, quy tắc định trước, kiểm định từng thành phần và tổng hợp, ngoài mẫu, đơn giản.'],
    terms: [['Weight of evidence', 'Trọng lượng bằng chứng'], ['Composite model', 'Mô hình tổng hợp'], ['Don’t fight the Fed', 'Đừng chống lại NHTW'], ['Two tumbles and a jump', 'Hai cú ngã và một cú nhảy'], ['Three steps and a stumble', 'Ba bước và một cú vấp'], ['Yield curve inversion', 'Đường cong lợi suất đảo ngược']]
  }, {
    goals: ['Explain weight of evidence.', 'List indicator categories.', 'Describe classic monetary indicators.', 'Build, score and test a model.'],
    body: () => `
<h3>1. Weight of evidence</h3><p>Combine independent indicators, score them, map the composite to equity exposure. Aim to avoid most big declines and catch most big advances.</p>
<h3>2. Categories</h3><table class="tbl"><tbody><tr><td>Trend</td><td>200-day / 40-week MA</td></tr><tr><td>Momentum</td><td>13/26-week ROC</td></tr><tr><td>Breadth</td><td>A/D, % above MAs, new highs−lows</td></tr><tr><td>Monetary</td><td>policy rates, yields, curve</td></tr><tr><td>Sentiment</td><td>contrarian extremes</td></tr><tr><td>Valuation</td><td>long-term context</td></tr></tbody></table>
<h3>3. Monetary</h3><ul><li>Don’t fight the Fed.</li><li>Two tumbles and a jump.</li><li>Three steps and a stumble.</li><li>Yield trends; curve inversion.</li></ul>
<h3>4. Building and testing</h3><ol><li>Independent indicators</li><li>Predefined rules</li><li>Test each component</li><li>Composite → exposure</li><li>Out-of-sample, parsimony</li></ol>${H.woeCalc()}`,
    keys: ['Weight of evidence.', 'Six categories.', 'Monetary rules.', 'Model building.'],
    terms: [['Weight of evidence', 'Multi-indicator scoring approach'], ['Two tumbles and a jump', 'Two consecutive rate cuts → bullish']]
  }, [
    ['Mục tiêu của mô hình trọng lượng bằng chứng:', 'Goal of a weight-of-evidence model:', ['Tránh phần lớn đợt giảm lớn và tham gia phần lớn đợt tăng lớn', 'Bắt chính xác đỉnh đáy', 'Giao dịch mỗi ngày', 'Thay thế quản lý rủi ro'], ['Avoid most big declines and join most big advances', 'Pick exact tops and bottoms', 'Trade daily', 'Replace risk management'], 0, '', ''],
    ['Vì sao chọn các chỉ báo độc lập nhau?', 'Why choose independent indicators?', ['Tránh đếm trùng cùng một thông tin', 'Để có nhiều tín hiệu hơn', 'Theo luật', 'Không cần'], ['Avoid double-counting the same information', 'More signals', 'Law', 'Unneeded'], 0, '', ''],
    ['Nhóm chỉ báo được xem là "cốt lõi" trong mô hình:', 'The "core" category in the model:', ['Xu hướng giá', 'Định giá', 'Tâm lý', 'Mùa vụ'], ['Price trend', 'Valuation', 'Sentiment', 'Seasonality'], 0, '', ''],
    ['"Đừng chống lại ngân hàng trung ương" nghĩa là:', '"Don’t fight the Fed" means:', ['Chu kỳ nới lỏng hỗ trợ cổ phiếu, thắt chặt gây áp lực', 'Luôn bán khi giảm lãi suất', 'Không liên quan', 'Mua trái phiếu luôn'], ['Easing supports stocks; tightening pressures them', 'Sell on cuts', 'Irrelevant', 'Always buy bonds'], 0, '', ''],
    ['"Hai cú ngã và một cú nhảy" chỉ:', '"Two tumbles and a jump" refers to:', ['Hai lần giảm lãi suất liên tiếp → thị trường thường tăng', 'Hai phiên giảm rồi tăng', 'Hai đáy', 'Hai gap'], ['Two consecutive rate cuts → stocks usually rise', 'Two down days then up', 'Double bottom', 'Two gaps'], 0, '', ''],
    ['"Ba bước và một cú vấp" chỉ:', '"Three steps and a stumble" refers to:', ['Ba lần tăng lãi suất liên tiếp → thị trường thường gặp khó', 'Ba phiên tăng', 'Ba đỉnh', 'Ba nến trắng'], ['Three consecutive hikes → stocks usually stumble', 'Three up days', 'Triple top', 'Three white soldiers'], 0, '', ''],
    ['Đường cong lợi suất đảo ngược thường là cảnh báo về:', 'An inverted yield curve usually warns of:', ['Suy thoái', 'Tăng trưởng nóng chắc chắn', 'Không gì', 'Cổ tức tăng'], ['Recession', 'Certain boom', 'Nothing', 'Higher dividends'], 0, '', ''],
    ['Định giá trong mô hình thường:', 'Valuation in the model is usually:', ['Bối cảnh dài hạn, kém cho thời điểm', 'Tín hiệu thời điểm tốt nhất', 'Không dùng', 'Chỉ báo ngắn hạn'], ['Long-term context, poor for timing', 'The best timing signal', 'Unused', 'Short-term'], 0, '', ''],
    ['Phân kỳ giữa chỉ số và đường A/D trong mô hình có vai trò:', 'Index–A/D divergence in the model:', ['Cảnh báo sớm sự tham gia suy yếu', 'Xác nhận tăng mạnh', 'Không ý nghĩa', 'Tín hiệu mua'], ['Early warning of weakening participation', 'Strong confirmation', 'Meaningless', 'Buy signal'], 0, '', ''],
    ['Điểm tổng hợp 7/9 trong ví dụ ánh xạ tỷ trọng thường dẫn tới:', 'A composite of 7/9 in the example maps to:', ['Tỷ trọng cổ phiếu cao', 'Tiền mặt 100%', 'Bán khống', 'Không đổi'], ['High equity exposure', '100% cash', 'Shorting', 'No change'], 0, '', ''],
    ['Kiểm định từng thành phần nên đo:', 'Testing each component should measure:', ['Lợi suất khi tích cực so với khi tiêu cực, % thời gian tích cực', 'Màu sắc biểu đồ', 'Số lượng chỉ báo', 'Không gì'], ['Returns when positive vs negative, % time positive', 'Chart colours', 'Indicator count', 'Nothing'], 0, '', ''],
    ['Vì sao giữ mô hình đơn giản (ít tham số)?', 'Why keep the model simple?', ['Giảm rủi ro quá khớp, bền vững ngoài mẫu', 'Dễ quảng cáo', 'Theo luật', 'Không lý do'], ['Less overfitting, more robust out of sample', 'Marketing', 'Law', 'No reason'], 0, '', ''],
    ['Chỉ báo tâm lý trong mô hình được dùng:', 'Sentiment indicators in the model are used:', ['Theo hướng ngược ở cực trị', 'Theo đám đông', 'Bỏ qua', 'Làm chỉ báo xu hướng'], ['Contrarily at extremes', 'With the crowd', 'Ignored', 'As trend indicators'], 0, '', ''],
    ['"Nhiên liệu" của thị trường trong mô hình là nhóm:', 'The market’s "fuel" category:', ['Tiền tệ', 'Định giá', 'Mùa vụ', 'Nến'], ['Monetary', 'Valuation', 'Seasonality', 'Candles'], 0, '', ''],
    ['Quy tắc +1/0 cho mỗi chỉ báo nên được:', '+1/0 rules for each indicator should be:', ['Định nghĩa trước khi kiểm định', 'Điều chỉnh sau khi xem kết quả', 'Ngẫu nhiên', 'Không cần'], ['Defined before testing', 'Tweaked after seeing results', 'Random', 'Unneeded'], 0, '', ''],
    ['Thêm 5 chỉ báo MA khác nhau (20, 30, 40, 50, 60 ngày) vào mô hình sẽ:', 'Adding five MAs (20–60 day) to the model will:', ['Đếm trùng thông tin xu hướng — làm lệch mô hình', 'Tăng độ chính xác gấp 5', 'Giảm rủi ro', 'Không ảnh hưởng'], ['Double-count trend information — skewing the model', 'Quintuple accuracy', 'Cut risk', 'No effect'], 0, '', ''],
    ['Kết quả đầu ra của mô hình thị trường cổ phiếu thường là:', 'A stock-market model’s output is usually:', ['Mức tỷ trọng cổ phiếu', 'Một mã cụ thể', 'Giá mục tiêu chính xác', 'Ngày đỉnh'], ['An equity exposure level', 'A specific stock', 'An exact target', 'A top date'], 0, '', ''],
    ['Độ rộng "lực đẩy" (breadth thrust) trong mô hình thường được xem là:', 'A breadth thrust in the model is usually seen as:', ['Tín hiệu tích cực mạnh, thường ở đầu xu hướng tăng mới', 'Tín hiệu bán', 'Không ý nghĩa', 'Cảnh báo đỉnh'], ['A strong bullish signal, often at the start of new advances', 'A sell', 'Meaningless', 'A top warning'], 0, '', ''],
    ['Mô hình nên được kiểm định qua:', 'The model should be tested across:', ['Nhiều chu kỳ thị trường và ngoài mẫu', 'Chỉ một năm tăng', 'Chỉ dữ liệu gần nhất', 'Không cần'], ['Many cycles and out of sample', 'One bull year', 'Recent data only', 'No testing'], 0, '', ''],
    ['Lợi suất trái phiếu nằm trên MA 26 tuần và đang tăng thường được chấm:', 'Bond yields above a rising 26-week MA are usually scored:', ['Tiêu cực cho cổ phiếu', 'Tích cực', 'Trung tính luôn', 'Không chấm'], ['Negative for stocks', 'Positive', 'Always neutral', 'Not scored'], 0, '', '']
  ]);

  /* ================= L2-31 ================= */
  C.addLesson('l2-31', {
    goals: ['Ôn quan hệ giá – lợi suất và thời lượng.', 'Mô tả các yếu tố của mô hình trái phiếu đơn giản.', 'Xây dựng mô hình chấm điểm cho trái phiếu.', 'Ứng dụng vào phân bổ tài sản.'],
    body: () => `
<h3>1. Nền tảng</h3>
<ul><li>Giá trái phiếu và lợi suất <b>nghịch chiều</b>.</li>
<li><b>Thời lượng (duration)</b> đo độ nhạy giá: %Δgiá ≈ −D × Δlợi suất. Trái phiếu 10 năm thời lượng ~8: lợi suất tăng 1 điểm % → giá giảm ~8%.</li>
<li>Kẻ thù chính của trái phiếu là <b>lạm phát</b> và <b>tăng trưởng nóng</b>; bạn của trái phiếu là giảm phát, suy thoái và nới lỏng tiền tệ.</li></ul>
${H.bondCalc()}
<h3>2. Các yếu tố của mô hình trái phiếu đơn giản</h3>
<table class="tbl"><thead><tr><th>Yếu tố</th><th>Tích cực cho trái phiếu khi</th><th>Lý do</th></tr></thead><tbody>
<tr><td><b>Xu hướng giá trái phiếu</b> (hoặc lợi suất)</td><td>Giá trên MA (lợi suất dưới MA)</td><td>Xu hướng của chính thị trường</td></tr>
<tr><td><b>Giá hàng hoá</b> (chỉ số hàng hoá, đồng, dầu)</td><td>Dưới MA, đang giảm</td><td>Áp lực lạm phát giảm</td></tr>
<tr><td><b>Cổ phiếu tiện ích</b></td><td>Đang tăng</td><td>Nhạy lãi suất — thường dẫn trước trái phiếu</td></tr>
<tr><td><b>Đồng nội tệ / USD</b></td><td>Mạnh lên</td><td>Giảm lạm phát nhập khẩu, hút vốn</td></tr>
<tr><td><b>Lãi suất chính sách</b></td><td>Ổn định hoặc giảm</td><td>Nới lỏng</td></tr>
<tr><td><b>Đường cong lợi suất</b></td><td>Dốc lên rõ (kỳ hạn dài trả bù cao)</td><td>Lợi thế lợi suất của kỳ hạn dài</td></tr></tbody></table>
<h3>3. Chấm điểm và quy tắc</h3>
<p>Ví dụ mô hình 4 yếu tố, mỗi yếu tố +1 nếu tích cực: <b>giá trái phiếu trên MA 50 ngày</b>, <b>chỉ số hàng hoá dưới MA 50 ngày</b>, <b>cổ phiếu tiện ích trên MA 50 ngày</b>, <b>lãi suất ngắn hạn không tăng trong 3 tháng</b>.</p>
<ul><li>3–4 điểm: tích cực — kéo dài thời lượng, tăng tỷ trọng trái phiếu dài hạn.</li><li>2 điểm: trung tính.</li><li>0–1 điểm: tiêu cực — rút ngắn thời lượng, ưu tiên tiền mặt/trái phiếu ngắn hạn.</li></ul>
<div class="callout">Kết quả thường thấy ở các mô hình kiểu này: lợi nhuận tập trung trong các giai đoạn điểm cao, sụt giảm được giảm đáng kể so với nắm giữ thụ động. Như mọi mô hình, cần kiểm định ngoài mẫu và cập nhật khi chế độ thị trường thay đổi (ví dụ quan hệ cổ phiếu – trái phiếu đảo chiều trong giảm phát).</div>
<h3>4. Áp dụng ở Việt Nam</h3>
<p>Thị trường trái phiếu bán lẻ hạn chế, nhưng tư duy mô hình vẫn hữu ích: theo dõi <b>lợi suất trái phiếu chính phủ 10 năm</b>, <b>lãi suất liên ngân hàng</b>, <b>tỷ giá</b> và giá hàng hoá để đánh giá môi trường lãi suất — ảnh hưởng tới ngân hàng, bất động sản, chứng khoán và quyết định tỷ trọng cổ phiếu/tiền gửi.</p>`,
    keys: ['Giá – lợi suất nghịch chiều; %Δgiá ≈ −D × Δlợi suất.', 'Kẻ thù của trái phiếu: lạm phát, tăng trưởng nóng; bạn: giảm phát, nới lỏng.', 'Yếu tố: xu hướng trái phiếu, hàng hoá (nghịch), cổ phiếu tiện ích (dẫn trước), tiền tệ, lãi suất chính sách, đường cong.', 'Chấm điểm → thời lượng và tỷ trọng; kiểm định ngoài mẫu; chú ý thay đổi chế độ.'],
    terms: [['Duration', 'Thời lượng'], ['Utilities', 'Cổ phiếu tiện ích'], ['Commodity index', 'Chỉ số hàng hoá'], ['Lengthen/shorten duration', 'Kéo dài/rút ngắn thời lượng']]
  }, {
    goals: ['Review price–yield and duration.', 'Describe bond-model factors.', 'Build a scoring model.', 'Apply to allocation.'],
    body: () => `
<h3>1. Basics</h3><ul><li>Prices and yields inverse.</li><li>%Δprice ≈ −D × Δyield.</li><li>Inflation and overheating hurt bonds; deflation and easing help.</li></ul>${H.bondCalc()}
<h3>2. Factors</h3><table class="tbl"><tbody><tr><td>Bond trend</td><td>above MA</td></tr><tr><td>Commodities</td><td>below MA</td></tr><tr><td>Utilities</td><td>rising (lead bonds)</td></tr><tr><td>Currency</td><td>strengthening</td></tr><tr><td>Policy rates</td><td>stable/falling</td></tr><tr><td>Curve</td><td>steep</td></tr></tbody></table>
<h3>3. Scoring</h3><p>Four factors; 3–4 lengthen duration, 2 neutral, 0–1 shorten.</p><div class="callout">Such models concentrate gains in high-score periods and cut drawdowns; test out of sample and watch regime shifts.</div>
<h3>4. Vietnam</h3><p>Track 10-year government yields, interbank rates, FX and commodities.</p>`,
    keys: ['Price–yield, duration.', 'Factors.', 'Scoring.', 'Application.'],
    terms: [['Duration', 'Price sensitivity to yield']]
  }, [
    ['Lợi suất trái phiếu tăng thì giá trái phiếu:', 'When bond yields rise, prices:', ['Giảm', 'Tăng', 'Không đổi', 'Bằng mệnh giá'], ['Fall', 'Rise', 'Unchanged', 'Equal par'], 0, '', ''],
    ['Thời lượng 7, lợi suất tăng 0.5 điểm %. Giá thay đổi khoảng:', 'Duration 7, yields +0.5 pt. Price change ≈', ['−0.5%', '−3.5%', '+3.5%', '−7%'], null, 1, '−7 × 0.5.', ''],
    ['Thời lượng 12, lợi suất giảm 1 điểm %. Giá thay đổi khoảng:', 'Duration 12, yields −1 pt. Price ≈', ['+12%', '−12%', '+1%', '0'], null, 0, '', ''],
    ['"Kẻ thù" chính của trái phiếu:', 'Bonds’ main enemy:', ['Lạm phát', 'Giảm phát', 'Suy thoái', 'Nới lỏng tiền tệ'], ['Inflation', 'Deflation', 'Recession', 'Easing'], 0, '', ''],
    ['Giá hàng hoá giảm, dưới MA thường được chấm:', 'Falling commodities below their MA are scored:', ['Tích cực cho trái phiếu', 'Tiêu cực cho trái phiếu', 'Trung tính', 'Không chấm'], ['Positive for bonds', 'Negative', 'Neutral', 'Not scored'], 0, '', ''],
    ['Vì sao cổ phiếu tiện ích được dùng trong mô hình trái phiếu?', 'Why use utilities in a bond model?', ['Nhạy lãi suất và thường dẫn trước trái phiếu', 'Có cổ tức thấp', 'Không liên quan', 'Theo luật'], ['They are rate-sensitive and often lead bonds', 'Low dividends', 'Unrelated', 'Law'], 0, '', ''],
    ['Đồng nội tệ mạnh lên thường tích cực cho trái phiếu vì:', 'A stronger home currency helps bonds because:', ['Giảm lạm phát nhập khẩu và thu hút vốn', 'Tăng lạm phát', 'Không ảnh hưởng', 'Tăng lãi suất'], ['It lowers imported inflation and attracts capital', 'Raises inflation', 'No effect', 'Raises rates'], 0, '', ''],
    ['Điểm mô hình 0–1/4 gợi ý:', 'A 0–1 of 4 score suggests:', ['Rút ngắn thời lượng, ưu tiên ngắn hạn/tiền mặt', 'Kéo dài thời lượng tối đa', 'Mua trái phiếu 30 năm', 'Không làm gì'], ['Shorten duration, favour short-term/cash', 'Max duration', 'Buy 30-year bonds', 'Nothing'], 0, '', ''],
    ['Điểm mô hình 4/4 gợi ý:', 'A 4/4 score suggests:', ['Kéo dài thời lượng, tăng tỷ trọng trái phiếu dài hạn', 'Bán toàn bộ trái phiếu', 'Chỉ giữ tiền mặt', 'Bán khống trái phiếu'], ['Lengthen duration, add long bonds', 'Sell all bonds', 'Cash only', 'Short bonds'], 0, '', ''],
    ['Trái phiếu thời lượng dài nhạy với lãi suất:', 'Long-duration bonds are rate-sensitive:', ['Hơn trái phiếu ngắn hạn', 'Kém hơn', 'Như nhau', 'Không nhạy'], ['More than short-term', 'Less', 'Equally', 'Not at all'], 0, '', ''],
    ['Lãi suất chính sách liên tục tăng thường:', 'Steadily rising policy rates are usually:', ['Tiêu cực cho trái phiếu', 'Tích cực', 'Không ảnh hưởng', 'Tích cực cho trái phiếu dài'], ['Negative for bonds', 'Positive', 'No effect', 'Good for long bonds'], 0, '', ''],
    ['Mô hình trái phiếu cần cập nhật khi chế độ thị trường thay đổi vì:', 'Bond models need updating on regime change because:', ['Quan hệ liên thị trường (ví dụ cổ phiếu – trái phiếu) có thể đảo chiều', 'Luật thay đổi', 'Dữ liệu biến mất', 'Không cần'], ['Intermarket relationships (e.g. stock–bond) can flip', 'Laws change', 'Data vanishes', 'Unneeded'], 0, '', ''],
    ['Lợi ích thường thấy của mô hình trái phiếu kỹ thuật so với nắm giữ thụ động:', 'Typical benefit of a technical bond model vs buy-and-hold:', ['Giảm sụt giảm đáng kể', 'Lợi nhuận gấp 10', 'Không rủi ro', 'Không phí'], ['Much smaller drawdowns', '10× returns', 'No risk', 'No fees'], 0, '', ''],
    ['Đường cong lợi suất dốc lên rõ cho thấy:', 'A clearly upward-sloping curve shows:', ['Kỳ hạn dài trả phần bù lợi suất cao hơn', 'Suy thoái chắc chắn', 'Lạm phát âm', 'Không gì'], ['Long maturities pay a higher yield premium', 'Certain recession', 'Negative inflation', 'Nothing'], 0, '', ''],
    ['Ở Việt Nam, chỉ số nên theo dõi cho môi trường lãi suất:', 'In Vietnam, watch for the rate environment:', ['Lợi suất TPCP 10 năm, lãi suất liên ngân hàng, tỷ giá', 'Chỉ giá vàng', 'Số tài khoản mở mới', 'Không có'], ['10-year government yield, interbank rates, FX', 'Gold only', 'New accounts', 'None'], 0, '', ''],
    ['Môi trường lãi suất giảm thường có lợi cho nhóm cổ phiếu:', 'Falling rates usually help stocks in:', ['Ngân hàng, bất động sản, chứng khoán', 'Chỉ dầu khí', 'Không nhóm nào', 'Chỉ xuất khẩu'], ['Banks, real estate, brokers', 'Oil only', 'None', 'Exporters only'], 0, '', ''],
    ['Thành phần "xu hướng giá trái phiếu" có vai trò:', 'The "bond price trend" component:', ['Phản ánh xu hướng của chính thị trường trái phiếu', 'Đo lạm phát trực tiếp', 'Đo cổ tức', 'Không vai trò'], ['Reflects the bond market’s own trend', 'Measures inflation directly', 'Dividends', 'None'], 0, '', ''],
    ['Kéo dài thời lượng khi mô hình tích cực nhằm:', 'Lengthening duration when the model is bullish aims to:', ['Tận dụng tối đa lợi nhuận khi lợi suất giảm', 'Giảm rủi ro', 'Tránh lãi suất', 'Không mục đích'], ['Maximise gains as yields fall', 'Cut risk', 'Avoid rates', 'No purpose'], 0, '', ''],
    ['Tăng trưởng kinh tế nóng thường gây hại cho trái phiếu vì:', 'Overheating growth hurts bonds because:', ['Kéo theo lạm phát và lãi suất tăng', 'Giảm lạm phát', 'Tăng giá trái phiếu', 'Không ảnh hưởng'], ['It brings inflation and higher rates', 'Lowers inflation', 'Raises bond prices', 'No effect'], 0, '', ''],
    ['Mô hình trái phiếu đơn giản giống mô hình cổ phiếu ở chỗ:', 'A simple bond model resembles the stock model in:', ['Dùng trọng lượng bằng chứng từ nhiều yếu tố', 'Dùng một chỉ báo duy nhất', 'Không kiểm định', 'Bắt đỉnh chính xác'], ['Using weight of evidence across factors', 'A single indicator', 'No testing', 'Exact tops'], 0, '', '']
  ]);

  /* ================= L2-32 ================= */
  C.addLesson('l2-32', {
    goals: ['So sánh quản lý chủ động và thụ động.', 'Liên hệ với giả thuyết thị trường hiệu quả.', 'Tính và diễn giải alpha, tracking error, information ratio.', 'Mô tả vai trò của PTKT trong quản lý chủ động và phân bổ tài sản chiến thuật.'],
    body: () => `
<h3>1. Thụ động và chủ động</h3>
<table class="tbl"><thead><tr><th></th><th>Thụ động</th><th>Chủ động</th></tr></thead><tbody>
<tr><td>Mục tiêu</td><td>Sao chép chỉ số chuẩn</td><td>Vượt chuẩn (sau phí, điều chỉnh rủi ro)</td></tr>
<tr><td>Chi phí</td><td>Rất thấp</td><td>Cao hơn (phí quản lý, giao dịch, thuế)</td></tr>
<tr><td>Niềm tin nền tảng</td><td>Thị trường khó đánh bại (EMH)</td><td>Có kém hiệu quả có thể khai thác</td></tr>
<tr><td>Rủi ro</td><td>Rủi ro thị trường đầy đủ</td><td>Thêm rủi ro chủ động (lệch chuẩn)</td></tr></tbody></table>
<h3>2. Giả thuyết thị trường hiệu quả (EMH)</h3>
<ul><li><b>Dạng yếu</b>: giá phản ánh mọi thông tin giá quá khứ → PTKT không tạo lợi nhuận vượt trội.</li><li><b>Dạng vừa</b>: phản ánh mọi thông tin công khai → cả phân tích cơ bản cũng không.</li><li><b>Dạng mạnh</b>: phản ánh cả thông tin nội bộ.</li></ul>
<p>Lập luận cho PTKT: bằng chứng về động lượng, phản ứng chậm, tài chính hành vi, giới hạn kinh doanh chênh lệch (Bài 35) cho thấy thị trường không hoàn toàn hiệu quả — nhưng lợi thế thường nhỏ, thay đổi theo thời gian, và phải đủ lớn để vượt chi phí.</p>
<h3>3. Đo lường hiệu quả chủ động</h3>
<table class="tbl"><tbody>
<tr><td><b>Lợi nhuận chủ động</b></td><td>R<sub>danh mục</sub> − R<sub>chuẩn</sub></td></tr>
<tr><td><b>Alpha (Jensen)</b></td><td>R<sub>p</sub> − [R<sub>f</sub> + β(R<sub>m</sub> − R<sub>f</sub>)]: lợi nhuận vượt mức dự kiến theo rủi ro hệ thống</td></tr>
<tr><td><b>Tracking error</b></td><td>Độ lệch chuẩn của lợi nhuận chủ động</td></tr>
<tr><td><b>Information ratio (IR)</b></td><td>Lợi nhuận chủ động / tracking error: kỹ năng trên mỗi đơn vị rủi ro chủ động; IR ≥ 0.5 được xem là tốt</td></tr>
<tr><td><b>Sharpe</b></td><td>(R<sub>p</sub> − R<sub>f</sub>)/σ<sub>p</sub></td></tr></tbody></table>
<div class="callout"><b>Ví dụ alpha</b>: R<sub>f</sub> 4%, thị trường 10%, β = 1.2, danh mục 13%. Lợi nhuận dự kiến = 4 + 1.2 × 6 = 11.2% → alpha = <b>+1.8%</b>.</div>
${H.irCalc()}
<h3>4. Vai trò của PTKT</h3>
<ul><li><b>Phân bổ tài sản chiến thuật (TAA)</b>: điều chỉnh tỷ trọng cổ phiếu/trái phiếu/tiền mặt theo mô hình kỹ thuật (Bài 30, 31) quanh một tỷ trọng chiến lược.</li>
<li><b>Chọn ngành và cổ phiếu</b> theo sức mạnh tương đối (Bài 29).</li>
<li><b>Thời điểm thực hiện</b>: dùng PTKT để vào/ra lệnh cho quyết định đã có từ phân tích cơ bản.</li>
<li><b>Quản lý rủi ro</b>: điểm dừng, định cỡ vị thế, giảm tỷ trọng khi xu hướng hỏng.</li>
<li><b>Lai</b>: lõi thụ động (chi phí thấp) + vệ tinh chủ động kỹ thuật (core–satellite); hoặc các chiến lược yếu tố (smart beta) như động lượng, biến động thấp.</li></ul>`,
    keys: ['Thụ động: sao chép chuẩn, chi phí thấp; chủ động: vượt chuẩn sau phí, thêm rủi ro chủ động.', 'EMH yếu/vừa/mạnh; bằng chứng hành vi và động lượng cho thấy kém hiệu quả nhỏ, thay đổi.', 'Alpha = Rp − [Rf + β(Rm − Rf)]; tracking error = σ(lợi nhuận chủ động); IR = chủ động/TE.', 'PTKT: TAA, RS chọn ngành, thời điểm thực hiện, quản lý rủi ro, core–satellite, smart beta.'],
    terms: [['Passive management', 'Quản lý thụ động'], ['Active return', 'Lợi nhuận chủ động'], ['Jensen’s alpha', 'Alpha Jensen'], ['Tracking error', 'Sai lệch theo dõi'], ['Information ratio', 'Tỷ số thông tin'], ['Tactical asset allocation', 'Phân bổ tài sản chiến thuật'], ['Core–satellite', 'Lõi – vệ tinh'], ['Smart beta', 'Beta thông minh / chiến lược yếu tố']]
  }, {
    goals: ['Compare active and passive.', 'Relate to the EMH.', 'Compute alpha, tracking error, IR.', 'Describe TA’s role.'],
    body: () => `
<h3>1. Passive vs active</h3><p>Replicate vs beat the benchmark after costs; low vs higher fees; efficiency vs exploitable inefficiencies.</p>
<h3>2. EMH</h3><ul><li>Weak: past prices.</li><li>Semi-strong: public info.</li><li>Strong: all info.</li></ul><p>Momentum and behavioural evidence suggest small, time-varying inefficiencies.</p>
<h3>3. Measures</h3><table class="tbl"><tbody><tr><td>Active return</td><td>Rp − Rb</td></tr><tr><td>Jensen’s alpha</td><td>Rp − [Rf + β(Rm − Rf)]</td></tr><tr><td>Tracking error</td><td>σ(active return)</td></tr><tr><td>IR</td><td>active / TE; ≥ 0.5 good</td></tr><tr><td>Sharpe</td><td>(Rp − Rf)/σp</td></tr></tbody></table><div class="callout">Rf 4, Rm 10, β 1.2, Rp 13 → alpha +1.8%.</div>${H.irCalc()}
<h3>4. TA’s role</h3><ul><li>Tactical asset allocation</li><li>RS sector/stock selection</li><li>Execution timing</li><li>Risk management</li><li>Core–satellite, smart beta</li></ul>`,
    keys: ['Active vs passive.', 'EMH forms.', 'Alpha, TE, IR.', 'TA roles.'],
    terms: [['Information ratio', 'Active return / tracking error'], ['TAA', 'Tactical asset allocation']]
  }, [
    ['Mục tiêu của quản lý thụ động:', 'Passive management aims to:', ['Sao chép hiệu suất chỉ số chuẩn với chi phí thấp', 'Đánh bại thị trường', 'Bắt đỉnh đáy', 'Giao dịch nhiều'], ['Replicate a benchmark cheaply', 'Beat the market', 'Time tops and bottoms', 'Trade a lot'], 0, '', ''],
    ['Dạng yếu của EMH cho rằng:', 'Weak-form EMH says:', ['Giá phản ánh mọi thông tin giá quá khứ', 'Giá phản ánh thông tin nội bộ', 'Không có thông tin', 'Giá luôn sai'], ['Prices reflect all past price information', 'Prices reflect insider info', 'No information', 'Prices always wrong'], 0, '', ''],
    ['Nếu EMH dạng yếu đúng tuyệt đối, PTKT:', 'If weak-form EMH held perfectly, TA would:', ['Không tạo được lợi nhuận vượt trội sau điều chỉnh rủi ro', 'Luôn thắng', 'Bị cấm', 'Không đổi'], ['Not earn risk-adjusted excess returns', 'Always win', 'Be banned', 'Be unchanged'], 0, '', ''],
    ['Rf 3%, Rm 9%, β 0.8, Rp 9%. Alpha Jensen:', 'Rf 3, Rm 9, β 0.8, Rp 9. Jensen’s alpha:', ['+1.2%', '0%', '+6%', '−1.2%'], null, 0, '9 − (3 + 0.8 × 6) = 1.2.', ''],
    ['Tracking error là:', 'Tracking error is:', ['Độ lệch chuẩn của lợi nhuận chủ động', 'Phí quản lý', 'Beta', 'Lợi nhuận chuẩn'], ['St.dev of active return', 'Management fee', 'Beta', 'Benchmark return'], 0, '', ''],
    ['Lợi nhuận chủ động 3%, tracking error 6%. IR =', 'Active return 3%, TE 6%. IR =', ['0.5', '2', '18', '0.18'], null, 0, '', ''],
    ['IR được xem là tốt khi khoảng:', 'An IR is considered good around:', ['≥ 0.5', '≥ 5', '< 0', '= 0'], null, 0, '', ''],
    ['Danh mục lãi 12% trước phí, phí 2%, chuẩn 10.5%. Lợi nhuận chủ động sau phí:', 'Portfolio 12% gross, fees 2%, benchmark 10.5%. Net active return:', ['+1.5%', '−0.5%', '+2%', '+10%'], null, 1, '10 − 10.5.', ''],
    ['Phân bổ tài sản chiến thuật (TAA) là:', 'Tactical asset allocation is:', ['Điều chỉnh tỷ trọng tài sản quanh mức chiến lược theo điều kiện thị trường', 'Giữ cố định mãi', 'Chọn một cổ phiếu', 'Bán khống mọi thứ'], ['Shifting weights around a strategic mix by conditions', 'Fixed forever', 'One stock', 'Shorting everything'], 0, '', ''],
    ['Chiến lược lõi – vệ tinh gồm:', 'Core–satellite combines:', ['Lõi thụ động chi phí thấp và vệ tinh chủ động', 'Hai quỹ chỉ số', 'Toàn bộ chủ động', 'Không có'], ['A cheap passive core with active satellites', 'Two index funds', 'All active', 'None'], 0, '', ''],
    ['Bằng chứng nào thách thức EMH và ủng hộ PTKT?', 'Which evidence challenges the EMH and supports TA?', ['Hiệu ứng động lượng và tài chính hành vi', 'Giá luôn ngẫu nhiên', 'Không có', 'Lãi suất'], ['Momentum and behavioural finance', 'Prices always random', 'None', 'Rates'], 0, '', ''],
    ['Rủi ro chủ động phát sinh do:', 'Active risk arises from:', ['Danh mục lệch khỏi chuẩn', 'Nắm giữ đúng chỉ số', 'Phí thấp', 'Không giao dịch'], ['Deviating from the benchmark', 'Holding the index exactly', 'Low fees', 'No trading'], 0, '', ''],
    ['Alpha dương nghĩa là:', 'Positive alpha means:', ['Lợi nhuận cao hơn mức dự kiến theo rủi ro hệ thống', 'Beta cao', 'Phí thấp', 'Rủi ro bằng 0'], ['Returns above what systematic risk predicts', 'High beta', 'Low fees', 'Zero risk'], 0, '', ''],
    ['Thách thức lớn nhất với quản lý chủ động:', 'The biggest challenge for active management:', ['Vượt chuẩn sau khi trừ chi phí', 'Tìm dữ liệu', 'Có chỉ số', 'Không có'], ['Beating the benchmark after costs', 'Finding data', 'Having an index', 'None'], 0, '', ''],
    ['Smart beta / chiến lược yếu tố ví dụ:', 'A smart-beta / factor strategy example:', ['Danh mục động lượng hoặc biến động thấp theo quy tắc', 'Chọn cổ phiếu theo tin đồn', 'Quỹ tiền tệ', 'Gửi tiết kiệm'], ['Rules-based momentum or low-volatility portfolios', 'Rumour picking', 'Money market', 'Savings'], 0, '', ''],
    ['PTKT có thể hỗ trợ nhà đầu tư cơ bản ở khâu:', 'TA can help fundamental investors with:', ['Thời điểm vào/ra và quản lý rủi ro', 'Định giá doanh nghiệp', 'Kế toán', 'Không gì'], ['Entry/exit timing and risk management', 'Valuation', 'Accounting', 'Nothing'], 0, '', ''],
    ['Sharpe = (Rp − Rf)/σp. Rp 15%, Rf 5%, σ 20%. Sharpe =', 'Rp 15, Rf 5, σ 20. Sharpe =', ['0.5', '0.75', '2', '10'], null, 0, '', ''],
    ['IR khác Sharpe ở chỗ:', 'IR differs from Sharpe in using:', ['Dùng lợi nhuận và rủi ro so với chuẩn thay vì so với lãi suất phi rủi ro', 'Không dùng rủi ro', 'Giống hệt', 'Chỉ dùng beta'], ['Return and risk relative to a benchmark rather than the risk-free rate', 'No risk', 'Identical', 'Only beta'], 0, '', ''],
    ['Dạng mạnh của EMH cho rằng giá phản ánh:', 'Strong-form EMH says prices reflect:', ['Mọi thông tin, kể cả nội bộ', 'Chỉ giá quá khứ', 'Chỉ thông tin công khai', 'Không gì'], ['All information, including insider', 'Past prices only', 'Public info only', 'Nothing'], 0, '', ''],
    ['Một quỹ có tracking error 0.1% so với VN30 nhiều khả năng là:', 'A fund with 0.1% TE vs VN30 is most likely:', ['Quỹ chỉ số thụ động (ETF)', 'Quỹ chủ động tập trung', 'Quỹ phòng hộ', 'Quỹ trái phiếu'], ['A passive index fund (ETF)', 'A concentrated active fund', 'A hedge fund', 'A bond fund'], 0, '', '']
  ]);
})(window.LLW);
