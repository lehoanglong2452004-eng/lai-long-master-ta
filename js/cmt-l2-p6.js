/* CMT Level 2 — Part 6, lessons 33–37: designing and testing trading systems. Written by Lai Long Master TA in its own words. */
(function (L) {
  'use strict';
  const C = L.cmt, H = C.demoHtml;

  /* ---------- calculator: Monte Carlo of a trade distribution ---------- */
  H.mcSim = () => C.calcShell('mcSim', `${C.num('wr', 40, L.T('Tỷ lệ thắng %', 'Win rate %'), 1)}${C.num('aw', 2.5, L.T('Lãi TB (R)', 'Avg win (R)'), 0.1)}${C.num('al', 1, L.T('Lỗ TB (R)', 'Avg loss (R)'), 0.1)}${C.num('n', 100, L.T('Số lệnh', 'Trades'), 10)}${C.num('risk', 1, L.T('Rủi ro/lệnh %', 'Risk/trade %'), 0.25)}<button class="btn primary d-go">${L.T('Mô phỏng 2.000 lần', 'Run 2,000 paths')}</button>`,
    L.T('Mô phỏng Monte Carlo: xáo ngẫu nhiên thứ tự thắng/thua để thấy cùng một hệ thống có thể cho kết quả rất khác nhau.', 'Monte Carlo: randomise win/loss order to see how widely one system’s outcomes can vary.'));
  C.demoRun.mcSim = box => {
    const run = () => {
      const g = c => +box.querySelector('.' + c).value, wr = g('wr') / 100, aw = g('aw'), al = g('al'), n = Math.max(10, Math.min(1000, g('n'))), r = g('risk') / 100;
      const fin = [], dds = [], streaks = []; let losers = 0;
      for (let k = 0; k < 2000; k++) {
        let eq = 1, pk = 1, dd = 0, st = 0, mx = 0;
        for (let i = 0; i < n; i++) {
          const win = Math.random() < wr, rr = win ? aw * (0.5 + Math.random()) : -al * (0.5 + Math.random());
          eq *= 1 + r * rr; if (eq > pk) pk = eq; dd = Math.max(dd, 1 - eq / pk);
          st = win ? 0 : st + 1; mx = Math.max(mx, st);
        }
        fin.push((eq - 1) * 100); dds.push(dd * 100); streaks.push(mx); if (eq < 1) losers++;
      }
      const q = (a, p) => { const s = a.slice().sort((x, y) => x - y); return s[Math.floor(p * (s.length - 1))]; };
      const ex = wr * aw - (1 - wr) * al;
      box.querySelector('.demo-out').innerHTML = `<table class="tbl"><thead><tr><th></th><th>${L.T('Tệ (5%)', 'Bad (5%)')}</th><th>${L.T('Trung vị', 'Median')}</th><th>${L.T('Tốt (95%)', 'Good (95%)')}</th></tr></thead><tbody>
        <tr><td>${L.T('Lợi nhuận cuối', 'Final return')}</td><td>${q(fin, 0.05).toFixed(1)}%</td><td><b>${q(fin, 0.5).toFixed(1)}%</b></td><td>${q(fin, 0.95).toFixed(1)}%</td></tr>
        <tr><td>${L.T('Sụt giảm tối đa', 'Max drawdown')}</td><td>${q(dds, 0.95).toFixed(1)}%</td><td><b>${q(dds, 0.5).toFixed(1)}%</b></td><td>${q(dds, 0.05).toFixed(1)}%</td></tr>
        <tr><td>${L.T('Chuỗi thua dài nhất', 'Longest losing streak')}</td><td>${q(streaks, 0.95)}</td><td><b>${q(streaks, 0.5)}</b></td><td>${q(streaks, 0.05)}</td></tr></tbody></table>
        <p>${L.T(`Kỳ vọng ≈ <b>${ex.toFixed(2)}R</b>/lệnh. ${(losers / 20).toFixed(1)}% số đường mô phỏng kết thúc lỗ dù hệ thống ${ex > 0 ? 'có kỳ vọng dương' : 'có kỳ vọng âm'}. Hãy chuẩn bị tâm lý và vốn cho kịch bản "tệ 5%", không phải kết quả backtest duy nhất.`,
          `Expectancy ≈ <b>${ex.toFixed(2)}R</b>/trade. ${(losers / 20).toFixed(1)}% of paths end in a loss although expectancy is ${ex > 0 ? 'positive' : 'negative'}. Plan capital and psychology for the "bad 5%" case, not the single backtest.`)}</p>`;
    };
    box.querySelectorAll('.d-num').forEach(i => { i.oninput = null; });
    box.querySelector('.d-go').onclick = run;
    run();
  };

  /* ---------- calculator: multiple testing ---------- */
  H.dmCalc = () => C.calcShell('dmCalc', `${C.num('k', 500, L.T('Số quy tắc thử', 'Rules tested'), 10)}${C.num('a', 5, 'α %', 0.5)}${C.num('t', 2.4, L.T('t của quy tắc tốt nhất', 'Best rule t-stat'), 0.1)}`);
  C.demoRun.dmCalc = box => {
    const ncdf = x => { const t = 1 / (1 + 0.2316419 * Math.abs(x)), d = 0.3989423 * Math.exp(-x * x / 2); const p = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274)))); return x > 0 ? 1 - p : p; };
    const run = () => {
      const g = c => +box.querySelector('.' + c).value, k = Math.max(1, g('k')), a = g('a') / 100, t = g('t');
      const p1 = 1 - ncdf(t), fw = 1 - Math.pow(1 - p1, k), fp = k * a, bon = a / k;
      box.querySelector('.demo-out').innerHTML = L.T(`Nếu tất cả ${k} quy tắc đều vô dụng, vẫn có khoảng <b>${fp.toFixed(0)}</b> quy tắc "có ý nghĩa" ở mức ${(a * 100).toFixed(1)}% chỉ do may mắn. p một phía của quy tắc tốt nhất (t = ${t}) = ${p1.toFixed(4)}, nhưng xác suất <b>ít nhất một</b> quy tắc vô dụng đạt t như vậy = <b>${(fw * 100).toFixed(1)}%</b>. Ngưỡng hiệu chỉnh Bonferroni cho mỗi quy tắc: α/k = ${bon.toExponential(1)} → ${p1 < bon ? '<b>vượt qua</b>' : '<b>không vượt qua</b>'}.`,
        `If all ${k} rules were useless, about <b>${fp.toFixed(0)}</b> would look "significant" at ${(a * 100).toFixed(1)}% by luck. The best rule’s one-tailed p (t = ${t}) = ${p1.toFixed(4)}, but the chance that <b>at least one</b> useless rule reaches it = <b>${(fw * 100).toFixed(1)}%</b>. Bonferroni per-rule threshold α/k = ${bon.toExponential(1)} → ${p1 < bon ? '<b>passes</b>' : '<b>fails</b>'}.`);
    };
    box.querySelectorAll('.d-num').forEach(i => { i.oninput = run; });
    run();
  };

  /* ================= L2-33 ================= */
  C.addLesson('l2-33', {
    goals: ['Liệt kê và tính các thống kê hiệu suất của backtest.', 'Đánh giá độ tin cậy của kết quả theo số lệnh và phân phối lệnh.', 'Dùng Monte Carlo để ước lượng phạm vi kết quả.', 'Nhận diện các thiên lệch phổ biến trong kiểm định ngược.'],
    body: () => `
<h3>1. Bảng thống kê hiệu suất</h3>
<table class="tbl"><thead><tr><th>Thước đo</th><th>Định nghĩa</th><th>Lưu ý</th></tr></thead><tbody>
<tr><td>Lợi nhuận ròng, CAGR</td><td>Sau phí và trượt giá</td><td>So với mua và nắm giữ cùng kỳ</td></tr>
<tr><td>Tỷ lệ thắng</td><td>Số lệnh thắng / tổng số lệnh</td><td>Vô nghĩa nếu không kèm tỷ lệ lãi/lỗ trung bình</td></tr>
<tr><td>Tỷ lệ lãi TB / lỗ TB</td><td>Payoff ratio</td><td>Hệ thống xu hướng: thắng ít nhưng lãi lớn</td></tr>
<tr><td><b>Kỳ vọng</b></td><td>p<sub>thắng</sub> × lãi TB − p<sub>thua</sub> × lỗ TB</td><td>Phải dương sau chi phí</td></tr>
<tr><td><b>Profit factor</b></td><td>Tổng lãi gộp / tổng lỗ gộp</td><td>&gt; 1.5 thường được xem là tốt</td></tr>
<tr><td><b>Sụt giảm tối đa</b></td><td>Mức giảm lớn nhất từ đỉnh vốn</td><td>Thước đo "đau" thực tế; thời gian hồi phục cũng quan trọng</td></tr>
<tr><td>Sharpe / Sortino</td><td>Lợi nhuận vượt trên độ lệch chuẩn (toàn phần / chiều giảm)</td><td>Sortino phù hợp hơn với hệ thống có lợi nhuận lệch phải</td></tr>
<tr><td>MAR / Calmar</td><td>CAGR / sụt giảm tối đa</td><td>So sánh hệ thống có mức rủi ro khác nhau</td></tr>
<tr><td>Chuỗi thua dài nhất</td><td>Số lệnh thua liên tiếp</td><td>Kiểm tra khả năng chịu đựng tâm lý và vốn</td></tr>
<tr><td>Thời gian trong thị trường</td><td>% thời gian có vị thế</td><td>Rủi ro thấp hơn khi ít thời gian trong thị trường</td></tr></tbody></table>
<div class="callout"><b>Ví dụ</b>: 80 lệnh, 35% thắng, lãi TB 3.2R, lỗ TB 1R. Kỳ vọng = 0.35 × 3.2 − 0.65 × 1 = <b>0.47R</b>. Profit factor = (28 × 3.2)/(52 × 1) ≈ <b>1.72</b>.</div>
<h3>2. Bao nhiêu lệnh là đủ?</h3>
<ul><li>Sai số chuẩn của lợi nhuận trung bình mỗi lệnh = s/√n. Với ít lệnh, khoảng tin cậy rất rộng.</li>
<li>Quy tắc kinh nghiệm: tối thiểu <b>30</b> lệnh, tốt hơn là <b>100+</b>, trải qua nhiều chế độ thị trường (tăng, giảm, đi ngang; biến động cao/thấp).</li>
<li>Kiểm tra phân phối lệnh: lợi nhuận có phụ thuộc vào một vài lệnh ngoại lai không? Bỏ 1–3 lệnh tốt nhất và tính lại.</li></ul>
<h3>3. Monte Carlo và bootstrap</h3>
<p>Backtest chỉ là <b>một</b> thứ tự lệnh. Bằng cách lấy mẫu lại (có hoàn lại) hoặc xáo thứ tự các lệnh hàng nghìn lần, ta thu được <b>phân phối</b> của lợi nhuận cuối, sụt giảm và chuỗi thua — để lập kế hoạch vốn theo kịch bản xấu (ví dụ phân vị 95% của sụt giảm) thay vì con số duy nhất.</p>
${H.mcSim()}
<h3>4. Các thiên lệch cần tránh</h3>
<ul><li><b>Nhìn trước (look-ahead)</b>: dùng dữ liệu chưa có tại thời điểm ra quyết định (ví dụ giá đóng cửa để vào lệnh ở giá mở cửa cùng phiên, dữ liệu cơ bản được công bố muộn).</li>
<li><b>Sống sót (survivorship)</b>: chỉ kiểm định trên các mã còn niêm yết hôm nay, bỏ qua mã đã huỷ niêm yết.</li>
<li><b>Đào bới dữ liệu / quá khớp</b>: thử quá nhiều biến thể (Bài 36).</li>
<li><b>Chi phí phi thực tế</b>: bỏ qua phí, thuế, trượt giá, biên độ trần/sàn, thanh khoản.</li>
<li><b>Dữ liệu chưa điều chỉnh</b>: chia tách, cổ tức, hợp đồng tương lai nối kỳ hạn.</li></ul>`,
    keys: ['Thống kê: lợi nhuận ròng/CAGR, tỷ lệ thắng, payoff, kỳ vọng, profit factor, sụt giảm tối đa, Sharpe/Sortino, MAR, chuỗi thua, thời gian trong thị trường.', 'Kỳ vọng = p·lãi TB − q·lỗ TB; PF = lãi gộp/lỗ gộp.', 'Tối thiểu 30, tốt hơn 100+ lệnh qua nhiều chế độ; kiểm tra ngoại lai.', 'Monte Carlo/bootstrap cho phân phối kết quả; lập kế hoạch theo kịch bản xấu.', 'Thiên lệch: nhìn trước, sống sót, quá khớp, chi phí phi thực tế, dữ liệu chưa điều chỉnh.'],
    terms: [['Profit factor', 'Hệ số lợi nhuận'], ['Payoff ratio', 'Tỷ lệ lãi/lỗ trung bình'], ['MAR ratio', 'Tỷ số MAR'], ['Monte Carlo simulation', 'Mô phỏng Monte Carlo'], ['Bootstrap', 'Lấy mẫu lại có hoàn lại'], ['Look-ahead bias', 'Thiên lệch nhìn trước'], ['Survivorship bias', 'Thiên lệch sống sót']]
  }, {
    goals: ['Compute backtest statistics.', 'Judge reliability by trade count and distribution.', 'Use Monte Carlo for outcome ranges.', 'Recognise backtest biases.'],
    body: () => `
<h3>1. Statistics</h3><table class="tbl"><tbody><tr><td>Net profit/CAGR</td><td>after costs</td></tr><tr><td>Win rate</td><td>needs payoff ratio</td></tr><tr><td>Expectancy</td><td>p·avg win − q·avg loss</td></tr><tr><td>Profit factor</td><td>gross profit / gross loss</td></tr><tr><td>Max drawdown</td><td>plus recovery time</td></tr><tr><td>Sharpe/Sortino</td><td>total/downside deviation</td></tr><tr><td>MAR</td><td>CAGR / max DD</td></tr><tr><td>Longest losing streak</td><td></td></tr><tr><td>Time in market</td><td></td></tr></tbody></table><div class="callout">80 trades, 35% wins, 3.2R vs 1R → expectancy 0.47R, PF ≈ 1.72.</div>
<h3>2. How many trades?</h3><ul><li>SE = s/√n.</li><li>≥ 30, ideally 100+, across regimes.</li><li>Remove the best trades and recheck.</li></ul>
<h3>3. Monte Carlo</h3><p>Resample or reshuffle trades to get distributions of returns, drawdowns and streaks.</p>${H.mcSim()}
<h3>4. Biases</h3><ul><li>Look-ahead</li><li>Survivorship</li><li>Data mining / overfitting</li><li>Unrealistic costs</li><li>Unadjusted data</li></ul>`,
    keys: ['Statistics.', 'Expectancy and PF.', 'Trade counts.', 'Monte Carlo.', 'Biases.'],
    terms: [['Profit factor', 'Gross profit / gross loss'], ['Survivorship bias', 'Testing only surviving issues']]
  }, [
    ['Kỳ vọng mỗi lệnh: thắng 40%, lãi TB 2.5R, lỗ TB 1R:', 'Expectancy: 40% wins, 2.5R vs 1R:', ['0.4R', '1.0R', '0.6R', '−0.2R'], null, 0, '0.4 × 2.5 − 0.6 = 0.4.', ''],
    ['Tổng lãi gộp 120 triệu, tổng lỗ gộp 80 triệu. Profit factor:', 'Gross profit 120, gross loss 80. Profit factor:', ['0.67', '1.5', '40', '200'], null, 1, '', ''],
    ['Tỷ lệ thắng 80% có thể vẫn là hệ thống tồi nếu:', 'An 80% win rate can still be a bad system if:', ['Lỗ TB lớn hơn rất nhiều lãi TB', 'Lãi TB lớn', 'Có nhiều lệnh', 'Phí thấp'], ['Average loss far exceeds average win', 'Big wins', 'Many trades', 'Low fees'], 0, '', ''],
    ['MAR ratio = ', 'MAR ratio =', ['CAGR / sụt giảm tối đa', 'Lãi gộp / lỗ gộp', 'Tỷ lệ thắng × payoff', 'Sharpe × 2'], ['CAGR / max drawdown', 'Gross profit / gross loss', 'Win rate × payoff', 'Sharpe × 2'], 0, '', ''],
    ['Sortino khác Sharpe ở chỗ:', 'Sortino differs from Sharpe by:', ['Chỉ dùng độ lệch chiều giảm làm rủi ro', 'Không dùng rủi ro', 'Dùng beta', 'Dùng khối lượng'], ['Using only downside deviation as risk', 'No risk', 'Beta', 'Volume'], 0, '', ''],
    ['Số lệnh tối thiểu thường được khuyến nghị cho một backtest đáng tin:', 'Minimum trades usually recommended for a credible backtest:', ['3', '10', '30 (tốt hơn là 100+)', '1'], ['3', '10', '30 (better 100+)', '1'], 2, '', ''],
    ['Bỏ 2 lệnh tốt nhất khiến hệ thống từ lãi thành lỗ cho thấy:', 'Removing the 2 best trades turns profit into loss. This shows:', ['Kết quả phụ thuộc ngoại lai — kém tin cậy', 'Hệ thống rất ổn định', 'Không ý nghĩa', 'Cần tăng đòn bẩy'], ['Outlier dependence — unreliable', 'Great stability', 'Nothing', 'Add leverage'], 0, '', ''],
    ['Mô phỏng Monte Carlo trong backtest dùng để:', 'Monte Carlo in backtesting is used to:', ['Ước lượng phân phối kết quả (lợi nhuận, sụt giảm, chuỗi thua)', 'Tăng lợi nhuận', 'Thay thế dữ liệu thật', 'Tính phí'], ['Estimate outcome distributions', 'Raise profit', 'Replace real data', 'Compute fees'], 0, '', ''],
    ['Kế hoạch vốn nên dựa trên:', 'Capital planning should rely on:', ['Kịch bản xấu (ví dụ sụt giảm phân vị 95%)', 'Sụt giảm của một backtest duy nhất', 'Kịch bản tốt nhất', 'Không cần'], ['A bad-case scenario (e.g. 95th-percentile drawdown)', 'One backtest’s drawdown', 'The best case', 'Nothing'], 0, '', ''],
    ['Vào lệnh tại giá mở cửa dựa trên tín hiệu từ giá đóng cửa cùng phiên là:', 'Entering at today’s open on a signal from today’s close is:', ['Thiên lệch nhìn trước', 'Thiên lệch sống sót', 'Hợp lệ', 'Monte Carlo'], ['Look-ahead bias', 'Survivorship bias', 'Valid', 'Monte Carlo'], 0, '', ''],
    ['Kiểm định chiến lược chỉ trên các mã VN30 hiện tại cho 15 năm qua gây:', 'Testing only today’s VN30 members over 15 years causes:', ['Thiên lệch sống sót', 'Thiên lệch nhìn trước', 'Không thiên lệch', 'Đa cộng tuyến'], ['Survivorship bias', 'Look-ahead bias', 'No bias', 'Multicollinearity'], 0, '', ''],
    ['Bỏ qua giới hạn trần/sàn và thanh khoản trên thị trường Việt Nam dẫn tới:', 'Ignoring price limits and liquidity in Vietnam leads to:', ['Kết quả backtest lạc quan phi thực tế', 'Kết quả bi quan', 'Không ảnh hưởng', 'Sụt giảm lớn hơn'], ['Unrealistically optimistic results', 'Pessimistic results', 'No effect', 'Larger drawdowns'], 0, '', ''],
    ['Hệ thống theo xu hướng điển hình có:', 'A typical trend system has:', ['Tỷ lệ thắng thấp, payoff cao', 'Tỷ lệ thắng cao, payoff thấp', 'Không có lệnh thua', 'Sụt giảm bằng 0'], ['Low win rate, high payoff', 'High win rate, low payoff', 'No losers', 'Zero drawdown'], 0, '', ''],
    ['Thời gian hồi phục sau sụt giảm quan trọng vì:', 'Recovery time matters because:', ['Phản ánh mức "đau" và khả năng duy trì kỷ luật', 'Không quan trọng', 'Chỉ để báo cáo', 'Do luật'], ['It reflects pain and the ability to stay disciplined', 'It doesn’t', 'Reporting only', 'Law'], 0, '', ''],
    ['Dữ liệu chưa điều chỉnh chia tách cổ phiếu gây ra:', 'Unadjusted split data causes:', ['Tín hiệu giả do giá "giảm" đột ngột', 'Kết quả chính xác hơn', 'Không gì', 'Ít lệnh hơn'], ['False signals from artificial price drops', 'Better accuracy', 'Nothing', 'Fewer trades'], 0, '', ''],
    ['Sai số chuẩn của lợi nhuận TB mỗi lệnh giảm khi:', 'The SE of mean trade return falls when:', ['Số lệnh tăng', 'Số lệnh giảm', 'Phí tăng', 'Không bao giờ'], ['Trade count rises', 'Trade count falls', 'Fees rise', 'Never'], 0, '', ''],
    ['Backtest chỉ trong thị trường tăng giá có hạn chế:', 'A backtest only in a bull market is limited because:', ['Không phản ánh các chế độ thị trường khác', 'Quá nhiều dữ liệu', 'Luôn chính xác', 'Không hạn chế'], ['It misses other market regimes', 'Too much data', 'Always accurate', 'No limitation'], 0, '', ''],
    ['Bootstrap là:', 'Bootstrapping is:', ['Lấy mẫu lại có hoàn lại từ dữ liệu quan sát', 'Thêm dữ liệu giả', 'Tối ưu tham số', 'Bỏ ngoại lai'], ['Resampling with replacement from observed data', 'Adding fake data', 'Optimising parameters', 'Removing outliers'], 0, '', ''],
    ['"Thời gian trong thị trường" thấp với lợi nhuận tương đương mua và nắm giữ cho thấy:', 'Low time in market with buy-and-hold-like returns shows:', ['Hiệu quả rủi ro tốt hơn', 'Hệ thống tồi', 'Không ý nghĩa', 'Rủi ro cao hơn'], ['Better risk efficiency', 'A bad system', 'Nothing', 'Higher risk'], 0, '', ''],
    ['Kỳ vọng dương trên backtest nhưng âm sau khi trừ phí và trượt giá thì hệ thống:', 'Positive gross expectancy but negative after costs means:', ['Không khả thi', 'Rất tốt', 'Cần tăng tần suất', 'Không ảnh hưởng'], ['Not viable', 'Excellent', 'Trade more', 'No effect'], 0, '', '']
  ]);

  /* ================= L2-34 ================= */
  C.addLesson('l2-34', {
    goals: ['Phân biệt PTKT chủ quan và khách quan.', 'Mô tả phương pháp khoa học và tính khả bác bỏ.', 'Áp dụng kiểm định giả thuyết cho quy tắc giao dịch.', 'Giải thích việc khử xu hướng và kiểm định ngẫu nhiên hoá.'],
    body: () => `
<h3>1. PTKT chủ quan và khách quan</h3>
<p><b>PTKT chủ quan</b> phụ thuộc vào diễn giải của người phân tích (đếm sóng, nhận diện mẫu hình bằng mắt) — hai người có thể kết luận khác nhau, nên <b>không thể kiểm định</b> một cách nghiêm ngặt. <b>PTKT khách quan</b> định nghĩa quy tắc rõ ràng đến mức máy tính thực hiện được, cho cùng kết quả với cùng dữ liệu — vì vậy <b>có thể kiểm định</b>.</p>
<p>Phương pháp chủ quan không nhất thiết sai, nhưng muốn được coi là tri thức, nó phải được chuyển thành quy tắc khách quan để kiểm định.</p>
<h3>2. Phương pháp khoa học</h3>
<ol><li><b>Quan sát</b> một hiện tượng (ví dụ: giá thường tiếp tục tăng sau khi phá đỉnh 52 tuần).</li>
<li><b>Giả thuyết</b> có thể kiểm định: "quy tắc mua khi phá đỉnh 52 tuần có lợi nhuận kỳ vọng dương".</li>
<li><b>Dự đoán</b>: nếu giả thuyết đúng thì kết quả phải ở dạng nào.</li>
<li><b>Kiểm định</b> bằng dữ liệu, đặc biệt là dữ liệu <b>chưa dùng</b> để hình thành giả thuyết.</li>
<li><b>Kết luận</b>: bác bỏ hay giữ lại (tạm thời) giả thuyết.</li></ol>
<p><b>Tính khả bác bỏ</b> (Popper): một phát biểu khoa học phải có khả năng bị chứng minh là sai. "Thị trường sẽ đảo chiều vào lúc nào đó" không bác bỏ được nên không có giá trị khoa học. Tri thức khoa học luôn <b>tạm thời</b> — ta không bao giờ "chứng minh" quy tắc đúng, chỉ chưa bác bỏ được.</p>
<p><b>Suy diễn</b> đi từ nguyên lý tổng quát đến kết luận cụ thể (chắc chắn nếu tiền đề đúng); <b>quy nạp</b> đi từ quan sát cụ thể đến khái quát (chỉ có xác suất) — PTKT chủ yếu dựa trên quy nạp, vì vậy cần thống kê.</p>
<h3>3. Kiểm định một quy tắc</h3>
<ul><li><b>H₀</b>: quy tắc không có khả năng dự báo — lợi nhuận kỳ vọng ≤ 0 (sau khi điều chỉnh).</li>
<li>Dùng lợi nhuận quá khứ để ước lượng phân phối mẫu của lợi nhuận quy tắc <i>nếu H₀ đúng</i>, rồi xem kết quả thực có nằm ở đuôi không (p-value).</li></ul>
<h3>4. Khử xu hướng (detrending)</h3>
<p>Nếu thị trường tăng trung bình 0.05%/phiên, một quy tắc chủ yếu nắm giữ vị thế mua sẽ có lời chỉ nhờ <b>thiên lệch vị thế</b>, không nhờ khả năng dự báo. Cách xử lý: trừ lợi nhuận trung bình hằng ngày của thị trường khỏi dữ liệu trước khi kiểm định (lợi nhuận khử xu hướng có trung bình 0). Khi đó, quy tắc vô dụng có kỳ vọng đúng bằng 0.</p>
<h3>5. Tạo phân phối mẫu khi H₀ đúng</h3>
<table class="tbl"><tbody>
<tr><td><b>Bootstrap</b></td><td>Lấy mẫu lại có hoàn lại từ lợi nhuận hằng ngày đã khử xu hướng (đặt về trung bình 0) → phân phối của lợi nhuận trung bình khi không có khả năng dự báo</td></tr>
<tr><td><b>Hoán vị Monte Carlo</b></td><td>Xáo ngẫu nhiên vị thế của quy tắc (hoặc thứ tự lợi nhuận) để phá vỡ mọi liên hệ giữa tín hiệu và lợi nhuận tương lai, lặp lại hàng nghìn lần → kết quả thực tốt hơn 95%+ các lần xáo thì có ý nghĩa ở 5%</td></tr></tbody></table>
${H.randomReal()}`,
    keys: ['Chủ quan: phụ thuộc diễn giải, không kiểm định được; khách quan: quy tắc rõ ràng, kiểm định được.', 'Phương pháp khoa học: quan sát → giả thuyết → dự đoán → kiểm định → kết luận; tri thức là tạm thời.', 'Tính khả bác bỏ (Popper); suy diễn và quy nạp — PTKT dựa trên quy nạp nên cần thống kê.', 'H₀: quy tắc không có khả năng dự báo.', 'Khử xu hướng để loại thiên lệch vị thế.', 'Bootstrap và hoán vị Monte Carlo để xây phân phối mẫu khi H₀ đúng.'],
    terms: [['Subjective / objective TA', 'PTKT chủ quan / khách quan'], ['Falsifiability', 'Tính khả bác bỏ'], ['Deduction / induction', 'Suy diễn / quy nạp'], ['Detrending', 'Khử xu hướng'], ['Position bias', 'Thiên lệch vị thế'], ['Monte Carlo permutation', 'Hoán vị Monte Carlo']]
  }, {
    goals: ['Distinguish subjective and objective TA.', 'Describe the scientific method and falsifiability.', 'Apply hypothesis tests to rules.', 'Explain detrending and randomisation tests.'],
    body: () => `
<h3>1. Subjective vs objective</h3><p>Subjective methods depend on interpretation and cannot be rigorously tested; objective rules are computer-executable and testable.</p>
<h3>2. Scientific method</h3><ol><li>Observe</li><li>Hypothesise</li><li>Predict</li><li>Test on unused data</li><li>Conclude provisionally</li></ol><p>Falsifiability (Popper); deduction vs induction — TA is inductive, hence statistics.</p>
<h3>3. Testing a rule</h3><p>H₀: no predictive power; build the sampling distribution under H₀ and locate the actual result.</p>
<h3>4. Detrending</h3><p>Subtract the market’s mean daily return to remove position bias; a useless rule then has zero expectation.</p>
<h3>5. Null distributions</h3><table class="tbl"><tbody><tr><td>Bootstrap</td><td>resample zero-centred returns</td></tr><tr><td>Monte Carlo permutation</td><td>shuffle positions to break predictive links</td></tr></tbody></table>${H.randomReal()}`,
    keys: ['Objective TA is testable.', 'Scientific method.', 'Falsifiability; induction.', 'H₀.', 'Detrending.', 'Bootstrap and permutation.'],
    terms: [['Falsifiability', 'Capacity to be proven false'], ['Detrending', 'Removing the average return']]
  }, [
    ['PTKT khách quan khác chủ quan ở chỗ:', 'Objective TA differs from subjective TA in that:', ['Quy tắc rõ ràng, máy tính thực hiện được, kiểm định được', 'Luôn có lãi', 'Không dùng biểu đồ', 'Do chuyên gia quyết định'], ['Rules are explicit, computable and testable', 'Always profitable', 'No charts', 'Expert-decided'], 0, '', ''],
    ['Đếm sóng Elliott bằng mắt là ví dụ của:', 'Eyeballed Elliott wave counts are an example of:', ['PTKT chủ quan', 'PTKT khách quan', 'Thống kê suy luận', 'Hồi quy'], ['Subjective TA', 'Objective TA', 'Inference', 'Regression'], 0, '', ''],
    ['Tính khả bác bỏ nghĩa là một phát biểu khoa học:', 'Falsifiability means a scientific statement:', ['Có khả năng bị chứng minh là sai bằng dữ liệu', 'Luôn đúng', 'Không thể kiểm tra', 'Do số đông quyết định'], ['Can be proven false by data', 'Is always true', 'Is untestable', 'Is decided by majority'], 0, '', ''],
    ['"Thị trường sẽ đảo chiều vào lúc nào đó" là phát biểu:', '"The market will reverse at some point" is:', ['Không bác bỏ được — không có giá trị khoa học', 'Giả thuyết tốt', 'Đã được chứng minh', 'Khách quan'], ['Unfalsifiable — not scientific', 'A good hypothesis', 'Proven', 'Objective'], 0, '', ''],
    ['PTKT chủ yếu dựa trên lập luận:', 'TA relies mainly on:', ['Quy nạp — từ quan sát đến khái quát có xác suất', 'Suy diễn chắc chắn', 'Trực giác', 'Luật'], ['Induction — from observations to probable generalisations', 'Certain deduction', 'Intuition', 'Law'], 0, '', ''],
    ['Theo phương pháp khoa học, tri thức về một quy tắc giao dịch là:', 'Under the scientific method, knowledge of a rule is:', ['Tạm thời — chưa bị bác bỏ', 'Chứng minh vĩnh viễn', 'Vô nghĩa', 'Chỉ là ý kiến'], ['Provisional — not yet refuted', 'Permanently proven', 'Meaningless', 'Mere opinion'], 0, '', ''],
    ['H₀ khi kiểm định một quy tắc giao dịch thường là:', 'H₀ when testing a trading rule is usually:', ['Quy tắc không có khả năng dự báo', 'Quy tắc luôn thắng', 'Thị trường luôn tăng', 'Phí bằng 0'], ['The rule has no predictive power', 'The rule always wins', 'Markets always rise', 'Zero fees'], 0, '', ''],
    ['Thiên lệch vị thế phát sinh khi:', 'Position bias arises when:', ['Quy tắc chủ yếu mua trong thị trường có xu hướng tăng dài hạn', 'Quy tắc không giao dịch', 'Phí cao', 'Dùng dữ liệu tuần'], ['A rule is mostly long in a market with an upward drift', 'The rule never trades', 'High fees', 'Weekly data'], 0, '', ''],
    ['Khử xu hướng dữ liệu bằng cách:', 'Detrending is done by:', ['Trừ lợi nhuận trung bình hằng ngày khỏi mỗi lợi nhuận', 'Lấy MA 200', 'Bỏ ngày giảm', 'Nhân đôi lợi nhuận'], ['Subtracting the mean daily return from each return', 'Using a 200-MA', 'Dropping down days', 'Doubling returns'], 0, '', ''],
    ['Sau khi khử xu hướng, một quy tắc vô dụng có lợi nhuận kỳ vọng:', 'After detrending, a useless rule’s expected return is:', ['Bằng 0', 'Dương', 'Âm vô hạn', 'Bằng thị trường'], ['Zero', 'Positive', 'Very negative', 'Market return'], 0, '', ''],
    ['Hoán vị Monte Carlo phá vỡ:', 'Monte Carlo permutation breaks:', ['Liên hệ giữa tín hiệu và lợi nhuận tương lai', 'Dữ liệu giá', 'Phí giao dịch', 'Máy tính'], ['The link between signals and future returns', 'Price data', 'Fees', 'Computers'], 0, '', ''],
    ['Kết quả thực tốt hơn 97% các lần hoán vị nghĩa là p-value xấp xỉ:', 'Actual result beats 97% of permutations, so p ≈', ['0.03', '0.97', '0.5', '3'], null, 0, '', ''],
    ['Vì sao phải kiểm định trên dữ liệu không dùng để hình thành giả thuyết?', 'Why test on data not used to form the hypothesis?', ['Tránh việc giả thuyết chỉ "mô tả lại" dữ liệu đã thấy', 'Để có nhiều dữ liệu hơn', 'Theo luật', 'Không cần'], ['To avoid merely re-describing the data already seen', 'More data', 'Law', 'Unneeded'], 0, '', ''],
    ['Phương pháp chủ quan muốn được coi là tri thức cần:', 'To count as knowledge, a subjective method must:', ['Chuyển thành quy tắc khách quan và kiểm định', 'Được nhiều người tin', 'Có sách viết', 'Có tên nổi tiếng'], ['Be converted into objective rules and tested', 'Be widely believed', 'Have a book', 'Have a famous name'], 0, '', ''],
    ['Bước đầu tiên của phương pháp khoa học:', 'The first step of the scientific method:', ['Quan sát', 'Kết luận', 'Kiểm định', 'Công bố'], ['Observation', 'Conclusion', 'Testing', 'Publication'], 0, '', ''],
    ['Bootstrap trong kiểm định quy tắc dùng dữ liệu:', 'Bootstrap in rule testing uses data that are:', ['Lợi nhuận đã khử xu hướng, lấy mẫu lại có hoàn lại', 'Dữ liệu giả hoàn toàn', 'Chỉ ngày tăng', 'Dữ liệu tương lai'], ['Detrended returns resampled with replacement', 'Entirely fake data', 'Up days only', 'Future data'], 0, '', ''],
    ['Suy diễn cho kết luận:', 'Deduction yields conclusions that are:', ['Chắc chắn nếu tiền đề đúng', 'Chỉ có xác suất', 'Luôn sai', 'Ngẫu nhiên'], ['Certain if premises are true', 'Only probable', 'Always false', 'Random'], 0, '', ''],
    ['Giả thuyết tốt cho nghiên cứu PTKT phải:', 'A good TA research hypothesis must be:', ['Cụ thể, khách quan, có thể bác bỏ', 'Mơ hồ', 'Không thể kiểm tra', 'Phụ thuộc người phân tích'], ['Specific, objective, falsifiable', 'Vague', 'Untestable', 'Analyst-dependent'], 0, '', ''],
    ['Một quy tắc lãi 12%/năm khi thị trường tăng 10%/năm và quy tắc mua 90% thời gian. Trước khi kết luận cần:', 'A rule earns 12%/yr, market 10%/yr, rule long 90% of the time. Before concluding you must:', ['Khử xu hướng để tách khả năng dự báo khỏi thiên lệch vị thế', 'Kết luận ngay quy tắc tốt', 'Tăng đòn bẩy', 'Bỏ qua thị trường'], ['Detrend to separate skill from position bias', 'Declare it good', 'Add leverage', 'Ignore the market'], 0, '', ''],
    ['Khi không bác bỏ được H₀, kết luận đúng là:', 'If H₀ cannot be rejected, the right conclusion:', ['Chưa có bằng chứng quy tắc có khả năng dự báo', 'Quy tắc chắc chắn vô dụng', 'Quy tắc chắc chắn tốt', 'Dữ liệu sai'], ['No evidence yet of predictive power', 'Surely useless', 'Surely good', 'Bad data'], 0, '', '']
  ]);

  /* ================= L2-35 ================= */
  C.addLesson('l2-35', {
    goals: ['Trình bày các phê phán đối với EMH.', 'Giải thích các lý thuyết hành vi về chuyển động giá phi ngẫu nhiên.', 'Mô tả giới hạn của kinh doanh chênh lệch.', 'Nêu các giải thích "hợp lý" (phần bù rủi ro) cho xu hướng.'],
    body: () => `
<h3>1. Vì sao PTKT cần lý thuyết?</h3>
<p>Nếu giá là bước ngẫu nhiên, mọi quy tắc kỹ thuật đều vô dụng. Để tin rằng PTKT có thể hoạt động, ta cần những lý do <b>có cơ sở</b> giải thích vì sao giá có thể có cấu trúc dự báo được — và lý do đó phải phù hợp với bằng chứng.</p>
<h3>2. Phê phán EMH</h3>
<ul><li>EMH giả định nhà đầu tư <b>lý trí</b>, hoặc nếu không thì sai lầm của họ <b>ngẫu nhiên, triệt tiêu nhau</b>, hoặc nếu không thì <b>nhà kinh doanh chênh lệch</b> sẽ sửa giá.</li>
<li>Cả ba giả định đều bị thách thức: con người có thiên kiến <b>có hệ thống</b> (cùng chiều, không triệt tiêu), và kinh doanh chênh lệch có <b>giới hạn</b>.</li>
<li>Bằng chứng thực nghiệm: động lượng, trôi theo tin, bong bóng và sụp đổ, biến động quá mức so với thay đổi cơ bản.</li></ul>
<h3>3. Lý thuyết hành vi</h3>
<table class="tbl"><thead><tr><th>Cơ chế</th><th>Tác động tới giá</th></tr></thead><tbody>
<tr><td><b>Bảo thủ, neo</b> — cập nhật niềm tin chậm khi có tin mới</td><td><b>Phản ứng chậm</b> → xu hướng, trôi theo tin</td></tr>
<tr><td><b>Đại diện, ngoại suy</b> — coi chuỗi tin tốt gần đây là đại diện cho tương lai</td><td><b>Phản ứng thái quá</b> → quá đà, rồi đảo chiều dài hạn</td></tr>
<tr><td><b>Hiệu ứng phân bổ</b></td><td>Giá phản ánh tin chậm; kháng cự ở vùng hoà vốn</td></tr>
<tr><td><b>Bầy đàn, dòng thác thông tin</b> — làm theo người khác thay vì thông tin riêng</td><td>Xu hướng tự củng cố, bong bóng</td></tr>
<tr><td><b>Vòng phản hồi</b> — giá tăng thu hút người mua mới, tạo câu chuyện, thu hút thêm người mua</td><td>Xu hướng kéo dài vượt cơ bản</td></tr>
<tr><td><b>Quá tự tin, tự quy kết</b></td><td>Giao dịch quá mức, phản ứng quá đà với thông tin riêng</td></tr></tbody></table>
<h3>4. Giới hạn của kinh doanh chênh lệch</h3>
<ul><li><b>Rủi ro cơ bản</b>: không có tài sản thay thế hoàn hảo để phòng ngừa.</li>
<li><b>Rủi ro nhà giao dịch nhiễu</b>: giá sai lệch có thể <b>sai lệch thêm</b> trước khi về đúng; nhà kinh doanh chênh lệch có thể bị buộc thanh lý (thị trường có thể phi lý lâu hơn khả năng bạn còn thanh khoản).</li>
<li><b>Chi phí thực hiện</b>: phí, chi phí vay để bán khống, hạn chế bán khống.</li>
<li><b>Vốn hạn chế và rủi ro nghề nghiệp</b> của người quản lý quỹ.</li></ul>
<h3>5. Giải thích "hợp lý" (không cần phi lý)</h3>
<ul><li><b>Phần bù rủi ro</b>: nhà đầu cơ theo xu hướng có thể được trả công vì <b>cung cấp thanh khoản/bảo hiểm</b> cho nhà phòng ngừa (ý tưởng "hoàn trả bình thường" — hedger chấp nhận trả phí để chuyển rủi ro).</li>
<li><b>Thông tin lan toả chậm</b>: thông tin đến các nhóm nhà đầu tư vào thời điểm khác nhau; chi phí thu thập thông tin khiến giá điều chỉnh từ từ.</li>
<li><b>Thị trường thích nghi</b>: hiệu quả thị trường thay đổi theo thời gian và môi trường; lợi thế xuất hiện, bị khai thác, suy yếu, rồi xuất hiện lại ở dạng khác.</li>
<li><b>Động lực học phi tuyến / phức hợp</b>: tương tác của nhiều tác nhân có thể tạo ra cấu trúc (xu hướng, cụm biến động) dù từng tác nhân đơn giản.</li></ul>
<div class="callout"><b>Hệ quả cho nhà PTKT</b>: các lý thuyết trên ủng hộ sự tồn tại của <b>xu hướng</b> (phản ứng chậm, bầy đàn, phản hồi) và <b>đảo chiều ở cực trị</b> (phản ứng thái quá) — chính là hai trụ cột của PTKT. Nhưng lợi thế nhỏ, thay đổi, và cần kiểm định nghiêm ngặt.</div>`,
    keys: ['EMH dựa trên lý trí, sai lầm ngẫu nhiên, hoặc kinh doanh chênh lệch — cả ba đều bị thách thức.', 'Hành vi: bảo thủ/neo → phản ứng chậm; đại diện/ngoại suy → phản ứng thái quá; bầy đàn, dòng thác thông tin, vòng phản hồi.', 'Giới hạn kinh doanh chênh lệch: rủi ro cơ bản, rủi ro nhà giao dịch nhiễu, chi phí, vốn hạn chế.', 'Giải thích hợp lý: phần bù rủi ro cho nhà đầu cơ, thông tin lan toả chậm, thị trường thích nghi, phi tuyến.', 'Hệ quả: hỗ trợ xu hướng và đảo chiều ở cực trị — lợi thế nhỏ, cần kiểm định.'],
    terms: [['Limits to arbitrage', 'Giới hạn của kinh doanh chênh lệch'], ['Noise trader risk', 'Rủi ro nhà giao dịch nhiễu'], ['Information cascade', 'Dòng thác thông tin'], ['Feedback loop', 'Vòng phản hồi'], ['Conservatism bias', 'Thiên kiến bảo thủ'], ['Adaptive markets', 'Thị trường thích nghi'], ['Normal backwardation', 'Hoàn trả bình thường']]
  }, {
    goals: ['Present critiques of the EMH.', 'Explain behavioural theories of nonrandom motion.', 'Describe limits to arbitrage.', 'Give rational (risk-premium) explanations of trends.'],
    body: () => `
<h3>1. Why theory</h3><p>Without a plausible reason for predictable structure, rules are suspect.</p>
<h3>2. EMH critique</h3><p>Rational investors, offsetting errors or arbitrage — all challenged: biases are systematic and arbitrage is limited.</p>
<h3>3. Behavioural</h3><table class="tbl"><tbody><tr><td>Conservatism, anchoring</td><td>underreaction → trends</td></tr><tr><td>Representativeness, extrapolation</td><td>overreaction → reversals</td></tr><tr><td>Disposition</td><td>slow adjustment, overhang</td></tr><tr><td>Herding, cascades</td><td>self-reinforcing trends</td></tr><tr><td>Feedback loops</td><td>trends beyond fundamentals</td></tr><tr><td>Overconfidence</td><td>overtrading</td></tr></tbody></table>
<h3>4. Limits to arbitrage</h3><ul><li>Fundamental risk</li><li>Noise trader risk</li><li>Implementation costs</li><li>Limited capital, career risk</li></ul>
<h3>5. Rational explanations</h3><ul><li>Risk premiums paid by hedgers to speculators</li><li>Slow information diffusion</li><li>Adaptive markets</li><li>Nonlinear dynamics</li></ul><div class="callout">These support trends and extreme reversals — TA’s two pillars — but edges are small and must be tested.</div>`,
    keys: ['EMH pillars challenged.', 'Behavioural mechanisms.', 'Limits to arbitrage.', 'Rational explanations.', 'Implications.'],
    terms: [['Limits to arbitrage', 'Why mispricings persist'], ['Adaptive markets', 'Efficiency varies over time']]
  }, [
    ['Ba "tuyến phòng thủ" của EMH là:', 'The EMH’s three lines of defence:', ['Nhà đầu tư lý trí; sai lầm ngẫu nhiên triệt tiêu; kinh doanh chênh lệch sửa giá', 'Phí thấp; thanh khoản; luật', 'Cổ tức; lãi suất; thuế', 'Không có'], ['Rational investors; offsetting random errors; arbitrage', 'Low fees; liquidity; law', 'Dividends; rates; taxes', 'None'], 0, '', ''],
    ['Thiên kiến của nhà đầu tư thách thức EMH vì chúng:', 'Investor biases challenge the EMH because they are:', ['Có hệ thống, cùng chiều, không triệt tiêu', 'Ngẫu nhiên', 'Hiếm', 'Không tồn tại'], ['Systematic and correlated, not offsetting', 'Random', 'Rare', 'Nonexistent'], 0, '', ''],
    ['Thiên kiến bảo thủ dẫn tới:', 'Conservatism bias leads to:', ['Phản ứng chậm với tin → xu hướng', 'Phản ứng thái quá', 'Không ảnh hưởng', 'Giá ngẫu nhiên'], ['Underreaction → trends', 'Overreaction', 'No effect', 'Random prices'], 0, '', ''],
    ['Ngoại suy chuỗi tin tốt gần đây (đại diện) dẫn tới:', 'Extrapolating recent good news (representativeness) leads to:', ['Phản ứng thái quá rồi đảo chiều dài hạn', 'Phản ứng chậm', 'Không gì', 'Giá ổn định'], ['Overreaction then long-run reversal', 'Underreaction', 'Nothing', 'Stable prices'], 0, '', ''],
    ['Dòng thác thông tin xảy ra khi:', 'An information cascade occurs when:', ['Người ta làm theo hành động của người khác thay vì thông tin riêng', 'Mọi người dùng thông tin riêng', 'Không có thông tin', 'Thị trường đóng cửa'], ['People follow others instead of their own information', 'Everyone uses private info', 'No information', 'Markets close'], 0, '', ''],
    ['Vòng phản hồi giá giải thích:', 'Price feedback loops explain:', ['Xu hướng kéo dài vượt cơ bản, bong bóng', 'Giá luôn đúng', 'Biến động thấp', 'Không gì'], ['Trends overshooting fundamentals, bubbles', 'Always-correct prices', 'Low volatility', 'Nothing'], 0, '', ''],
    ['Rủi ro nhà giao dịch nhiễu là:', 'Noise trader risk is:', ['Giá sai lệch có thể sai lệch thêm trước khi về đúng', 'Nhiễu dữ liệu', 'Phí cao', 'Không có'], ['Mispricing may worsen before correcting', 'Data noise', 'High fees', 'None'], 0, '', ''],
    ['Yếu tố nào KHÔNG phải giới hạn của kinh doanh chênh lệch?', 'Which is NOT a limit to arbitrage?', ['Rủi ro cơ bản', 'Chi phí thực hiện', 'Rủi ro nhà giao dịch nhiễu', 'Thông tin đầy đủ miễn phí'], ['Fundamental risk', 'Implementation costs', 'Noise trader risk', 'Free complete information'], 3, '', ''],
    ['Hạn chế bán khống làm cho:', 'Short-sale restrictions make:', ['Định giá quá cao khó được sửa', 'Định giá thấp khó sửa', 'Giá luôn đúng', 'Không ảnh hưởng'], ['Overpricing harder to correct', 'Underpricing harder', 'Prices always right', 'No effect'], 0, '', ''],
    ['Giải thích "phần bù rủi ro" cho lợi nhuận của nhà đầu cơ theo xu hướng:', 'The risk-premium explanation for trend-follower profits:', ['Họ được nhà phòng ngừa trả công vì nhận rủi ro/cung cấp thanh khoản', 'Họ có thông tin nội bộ', 'May mắn', 'Do luật'], ['Hedgers pay them for bearing risk/providing liquidity', 'Inside info', 'Luck', 'Law'], 0, '', ''],
    ['Thị trường thích nghi cho rằng:', 'The adaptive markets view holds that:', ['Hiệu quả thay đổi theo thời gian, lợi thế xuất hiện rồi suy yếu', 'Thị trường luôn hiệu quả', 'Thị trường không bao giờ hiệu quả', 'Giá cố định'], ['Efficiency varies; edges appear and decay', 'Always efficient', 'Never efficient', 'Fixed prices'], 0, '', ''],
    ['Thông tin lan toả chậm giữa các nhóm nhà đầu tư dẫn tới:', 'Slow information diffusion leads to:', ['Giá điều chỉnh từ từ — xu hướng', 'Gap liên tục', 'Giá ngẫu nhiên', 'Không gì'], ['Gradual adjustment — trends', 'Constant gaps', 'Random prices', 'Nothing'], 0, '', ''],
    ['Hai trụ cột của PTKT được các lý thuyết hành vi ủng hộ:', 'Two TA pillars supported by behavioural theories:', ['Xu hướng và đảo chiều ở cực trị', 'Cổ tức và lãi suất', 'Định giá và kế toán', 'Không có'], ['Trends and reversals at extremes', 'Dividends and rates', 'Valuation and accounting', 'None'], 0, '', ''],
    ['Quá tự tin của nhà đầu tư thường gây:', 'Investor overconfidence often causes:', ['Giao dịch quá mức', 'Ít giao dịch', 'Đa dạng hoá tốt', 'Không gì'], ['Overtrading', 'Undertrading', 'Good diversification', 'Nothing'], 0, '', ''],
    ['Động lực học phi tuyến gợi ý:', 'Nonlinear dynamics suggest:', ['Tương tác đơn giản của nhiều tác nhân có thể tạo cấu trúc giá', 'Giá luôn tuyến tính', 'Không có cấu trúc', 'Chỉ có ngẫu nhiên'], ['Simple agent interactions can create price structure', 'Prices are linear', 'No structure', 'Pure randomness'], 0, '', ''],
    ['Biến động giá quá mức so với thay đổi cơ bản là bằng chứng chống lại:', 'Price volatility excessive relative to fundamentals is evidence against:', ['EMH', 'Tài chính hành vi', 'PTKT', 'Không gì'], ['The EMH', 'Behavioural finance', 'TA', 'Nothing'], 0, '', ''],
    ['"Thị trường có thể phi lý lâu hơn khả năng bạn còn thanh khoản" minh hoạ:', '"Markets can stay irrational longer than you can stay solvent" illustrates:', ['Rủi ro nhà giao dịch nhiễu / giới hạn kinh doanh chênh lệch', 'Hiệu ứng chắc chắn', 'Thiên lệch sống sót', 'Đa cộng tuyến'], ['Noise trader risk / limits to arbitrage', 'Certainty effect', 'Survivorship', 'Multicollinearity'], 0, '', ''],
    ['Vì sao cần một lý thuyết giải thích chuyển động giá phi ngẫu nhiên?', 'Why do we need a theory of nonrandom price motion?', ['Để quy tắc tìm được có cơ sở, không chỉ là trùng hợp từ dữ liệu', 'Để quảng cáo', 'Không cần', 'Để tính phí'], ['So discovered rules have a rationale, not just data coincidence', 'Marketing', 'Not needed', 'Fees'], 0, '', ''],
    ['Hiệu ứng phân bổ góp phần vào chuyển động phi ngẫu nhiên vì:', 'The disposition effect contributes to nonrandom motion because:', ['Làm giá phản ánh tin chậm và tạo kháng cự ở vùng hoà vốn', 'Làm giá phản ứng tức thì', 'Không liên quan', 'Tạo cổ tức'], ['It slows price adjustment and creates break-even resistance', 'Instant reaction', 'Unrelated', 'Dividends'], 0, '', ''],
    ['Kết luận thận trọng cho nhà PTKT:', 'A cautious conclusion for technicians:', ['Lý thuyết ủng hộ khả năng có lợi thế, nhưng lợi thế nhỏ, thay đổi và phải kiểm định', 'PTKT luôn thắng', 'PTKT vô dụng', 'Không cần kiểm định'], ['Theory supports possible edges, but they are small, changing and must be tested', 'TA always wins', 'TA is useless', 'No testing needed'], 0, '', '']
  ]);

  /* ================= L2-36 ================= */
  C.addLesson('l2-36', {
    goals: ['Định nghĩa đào bới dữ liệu và thiên lệch đào bới dữ liệu.', 'Phân tích các yếu tố làm tăng hoặc giảm thiên lệch.', 'Mô tả cách điều chỉnh: ngoài mẫu, kiểm định ngẫu nhiên hoá, hiệu chỉnh kiểm định bội.', 'Rút ra bài học từ một nghiên cứu tình huống kiểm định hàng nghìn quy tắc.'],
    body: () => `
<h3>1. Đào bới dữ liệu là gì?</h3>
<p><b>Đào bới dữ liệu (data mining)</b> là quá trình thử <b>rất nhiều</b> quy tắc trên cùng một dữ liệu rồi chọn quy tắc tốt nhất. Bản thân việc này không sai — đó là cách khám phá hiệu quả. Vấn đề là <b>hiệu suất của quy tắc tốt nhất bị phóng đại</b>.</p>
<p><b>Hiệu suất quan sát = giá trị thực + may mắn.</b> Khi chọn quy tắc có hiệu suất quan sát cao nhất trong số nhiều quy tắc, ta có xu hướng chọn quy tắc có <b>may mắn lớn nhất</b>. Phần may mắn đó không lặp lại trong tương lai → hiệu suất ngoài mẫu thường kém hơn. Phần phóng đại này gọi là <b>thiên lệch đào bới dữ liệu</b>.</p>
<h3>2. Các yếu tố ảnh hưởng tới mức thiên lệch</h3>
<table class="tbl"><thead><tr><th>Yếu tố</th><th>Thiên lệch tăng khi</th></tr></thead><tbody>
<tr><td>Số quy tắc được thử</td><td><b>Nhiều</b> quy tắc hơn</td></tr>
<tr><td>Số quan sát (độ dài dữ liệu)</td><td><b>Ít</b> quan sát hơn (may mắn chiếm tỷ trọng lớn)</td></tr>
<tr><td>Tương quan giữa các quy tắc</td><td>Quy tắc <b>ít tương quan</b> nhau (mỗi quy tắc là một "lần thử" độc lập)</td></tr>
<tr><td>Chênh lệch giá trị thực giữa các quy tắc</td><td>Các quy tắc có giá trị thực <b>gần như nhau</b> (may mắn quyết định thứ hạng)</td></tr>
<tr><td>Ngoại lai trong dữ liệu</td><td>Có vài quan sát cực đoan mà một quy tắc tình cờ "bắt" được</td></tr></tbody></table>
${H.dmCalc()}
<h3>3. Cách đối phó</h3>
<ul><li><b>Kiểm định ngoài mẫu</b>: giữ lại một phần dữ liệu chưa động tới; chỉ kiểm định quy tắc đã chọn <b>một lần</b>. Nếu dùng dữ liệu ngoài mẫu nhiều lần, nó trở thành trong mẫu.</li>
<li><b>Kiểm định ngẫu nhiên hoá cho quy tắc tốt nhất</b>: với mỗi lần hoán vị/bootstrap, chạy <b>toàn bộ</b> quy trình đào bới (thử tất cả quy tắc và lấy quy tắc tốt nhất), ghi lại hiệu suất của quy tắc tốt nhất. Phân phối này cho biết "quy tắc tốt nhất của một tập quy tắc vô dụng" trông như thế nào. Quy tắc thực chỉ có ý nghĩa khi vượt phân phối đó (ý tưởng của "kiểm tra thực tế" kiểu White và kiểm định hoán vị Monte Carlo cho quy tắc tốt nhất).</li>
<li><b>Hiệu chỉnh kiểm định bội</b>: ví dụ Bonferroni, dùng ngưỡng α/k — đơn giản nhưng quá khắt khe khi các quy tắc tương quan.</li>
<li><b>Ưu tiên quy tắc có cơ sở lý thuyết</b> (Bài 35) và ít tham số; dùng dữ liệu dài, nhiều thị trường.</li></ul>
<h3>4. Nghiên cứu tình huống (khái quát)</h3>
<p>Một kiểu nghiên cứu điển hình: xây dựng hàng nghìn quy tắc khách quan từ nhiều họ chỉ báo (xu hướng, dao động, phân kỳ, độ rộng, liên thị trường), áp dụng lên một chỉ số chứng khoán trong nhiều năm, dùng lợi nhuận đã khử xu hướng và kiểm định ngẫu nhiên hoá có tính tới việc chọn quy tắc tốt nhất.</p>
<ul><li>Nhiều quy tắc trông rất tốt nếu xét riêng lẻ (p &lt; 5%), nhưng sau khi tính đến thiên lệch đào bới dữ liệu, <b>rất ít hoặc không quy tắc nào</b> còn có ý nghĩa.</li>
<li>Bài học: hiệu suất ấn tượng của "quy tắc tốt nhất" trong backtest <b>không phải bằng chứng</b> nếu không điều chỉnh cho số lần thử. Một quy tắc đơn lẻ không vượt qua không có nghĩa PTKT vô dụng — có thể cần dữ liệu khác, kết hợp quy tắc, hoặc thị trường kém hiệu quả hơn.</li>
<li>Điều quan trọng nhất là <b>quy trình</b>: định nghĩa khách quan, khử xu hướng, kiểm định có điều chỉnh, ngoài mẫu.</li></ul>`,
    keys: ['Đào bới dữ liệu: thử nhiều quy tắc và chọn quy tắc tốt nhất — hiệu suất bị phóng đại.', 'Hiệu suất quan sát = giá trị thực + may mắn; chọn tốt nhất = chọn may mắn nhất.', 'Thiên lệch tăng khi: nhiều quy tắc, ít quan sát, quy tắc ít tương quan, giá trị thực gần nhau, có ngoại lai.', 'Đối phó: ngoài mẫu (dùng một lần), kiểm định ngẫu nhiên hoá cho quy tắc tốt nhất, Bonferroni, cơ sở lý thuyết, ít tham số.', 'Tình huống: nhiều quy tắc có ý nghĩa riêng lẻ nhưng rất ít còn lại sau điều chỉnh.'],
    terms: [['Data mining', 'Đào bới dữ liệu'], ['Data-mining bias', 'Thiên lệch đào bới dữ liệu'], ['Multiple comparisons', 'Kiểm định bội'], ['Bonferroni correction', 'Hiệu chỉnh Bonferroni'], ['Out-of-sample', 'Ngoài mẫu'], ['Reality check', 'Kiểm tra thực tế']]
  }, {
    goals: ['Define data mining and its bias.', 'Analyse factors driving the bias.', 'Describe remedies.', 'Draw lessons from a mass rule-testing case study.'],
    body: () => `
<h3>1. Data mining</h3><p>Testing many rules and picking the best inflates its performance: observed = true merit + luck.</p>
<h3>2. Factors</h3><table class="tbl"><tbody><tr><td>More rules</td><td>more bias</td></tr><tr><td>Fewer observations</td><td>more bias</td></tr><tr><td>Less correlated rules</td><td>more bias</td></tr><tr><td>Similar true merit</td><td>more bias</td></tr><tr><td>Outliers</td><td>more bias</td></tr></tbody></table>${H.dmCalc()}
<h3>3. Remedies</h3><ul><li>Out-of-sample, used once.</li><li>Randomisation tests that rerun the whole mining process (reality-check style).</li><li>Bonferroni α/k.</li><li>Theory-based, parsimonious rules; long, broad data.</li></ul>
<h3>4. Case study (in outline)</h3><p>Thousands of objective rules on an index with detrended returns: many look significant alone, few or none survive adjustment. Process matters most.</p>`,
    keys: ['Definition.', 'Merit + luck.', 'Factors.', 'Remedies.', 'Case lessons.'],
    terms: [['Data-mining bias', 'Upward bias of the best rule'], ['Bonferroni', 'α/k threshold']]
  }, [
    ['Thiên lệch đào bới dữ liệu là:', 'Data-mining bias is:', ['Sự phóng đại hiệu suất của quy tắc tốt nhất được chọn từ nhiều quy tắc', 'Lỗi dữ liệu', 'Phí giao dịch', 'Thiên lệch sống sót'], ['The upward bias of the best rule chosen from many', 'Data errors', 'Fees', 'Survivorship'], 0, '', ''],
    ['Hiệu suất quan sát của một quy tắc gồm:', 'A rule’s observed performance consists of:', ['Giá trị thực + may mắn', 'Chỉ giá trị thực', 'Chỉ may mắn', 'Phí'], ['True merit + luck', 'Merit only', 'Luck only', 'Fees'], 0, '', ''],
    ['Thử 200 quy tắc vô dụng ở α = 5%. Số quy tắc "có ý nghĩa" kỳ vọng do may mắn:', '200 useless rules at α 5%. Expected "significant" by luck:', ['0', '5', '10', '100'], null, 2, '200 × 0.05.', ''],
    ['Thiên lệch tăng khi số quan sát:', 'The bias increases when observations are:', ['Ít hơn', 'Nhiều hơn', 'Không liên quan', 'Bằng 0'], ['Fewer', 'More', 'Irrelevant', 'Zero'], 0, '', ''],
    ['Thiên lệch tăng khi các quy tắc:', 'The bias increases when rules are:', ['Ít tương quan với nhau', 'Tương quan rất cao', 'Giống hệt nhau', 'Chỉ có một'], ['Less correlated', 'Highly correlated', 'Identical', 'Only one'], 0, '', ''],
    ['Khi các quy tắc có giá trị thực gần như nhau, thứ hạng của chúng chủ yếu do:', 'When rules have similar true merit, their ranking is mostly due to:', ['May mắn', 'Kỹ năng', 'Phí', 'Luật'], ['Luck', 'Skill', 'Fees', 'Law'], 0, '', ''],
    ['Hiệu chỉnh Bonferroni với 100 quy tắc, α = 5% cho ngưỡng mỗi quy tắc:', 'Bonferroni with 100 rules, α 5% gives a per-rule threshold of:', ['5%', '0.05%', '0.5%', '50%'], null, 1, '0.05/100 = 0.0005.', ''],
    ['Nhược điểm của Bonferroni:', 'Bonferroni’s drawback:', ['Quá khắt khe khi các quy tắc tương quan', 'Quá dễ dãi', 'Không tính được', 'Không có'], ['Too strict when rules are correlated', 'Too lenient', 'Uncomputable', 'None'], 0, '', ''],
    ['Dữ liệu ngoài mẫu mất giá trị khi:', 'Out-of-sample data loses value when:', ['Được dùng nhiều lần để điều chỉnh quy tắc', 'Dùng một lần', 'Đủ dài', 'Mới'], ['Used repeatedly to adjust rules', 'Used once', 'Long enough', 'Recent'], 0, '', ''],
    ['Kiểm định ngẫu nhiên hoá đúng cho quy tắc tốt nhất phải:', 'A correct randomisation test for the best rule must:', ['Lặp lại toàn bộ quy trình chọn quy tắc tốt nhất trên mỗi dữ liệu ngẫu nhiên', 'Chỉ kiểm tra quy tắc tốt nhất một lần', 'Bỏ qua các quy tắc khác', 'Dùng dữ liệu tương lai'], ['Rerun the whole best-rule selection on each randomised dataset', 'Test only the best rule once', 'Ignore other rules', 'Use future data'], 0, '', ''],
    ['Quy tắc tốt nhất trong backtest với p = 0.01 (riêng lẻ) sau khi thử 1.000 quy tắc:', 'Best backtest rule with p 0.01 alone after testing 1,000 rules:', ['Không phải bằng chứng đủ mạnh nếu không điều chỉnh', 'Chắc chắn có lợi thế', 'Chắc chắn vô dụng', 'Không liên quan'], ['Not strong evidence without adjustment', 'Surely has an edge', 'Surely useless', 'Irrelevant'], 0, '', ''],
    ['Đào bới dữ liệu tự nó:', 'Data mining in itself is:', ['Là cách khám phá hiệu quả, miễn là điều chỉnh thiên lệch', 'Luôn sai', 'Bị cấm', 'Vô dụng'], ['An efficient discovery method if bias is adjusted', 'Always wrong', 'Banned', 'Useless'], 0, '', ''],
    ['Một ngoại lai cực đoan trong dữ liệu làm thiên lệch tăng vì:', 'An extreme outlier raises the bias because:', ['Một quy tắc có thể tình cờ "bắt" được nó và trông xuất sắc', 'Nó giảm dữ liệu', 'Theo luật', 'Không đúng'], ['A rule may luckily capture it and look brilliant', 'It reduces data', 'Law', 'False'], 0, '', ''],
    ['Kết quả điển hình của nghiên cứu kiểm định hàng nghìn quy tắc với điều chỉnh:', 'Typical result of testing thousands of rules with adjustment:', ['Rất ít hoặc không quy tắc nào còn có ý nghĩa', 'Hầu hết đều có ý nghĩa', 'Tất cả thua lỗ', 'Không có kết quả'], ['Few or none remain significant', 'Most are significant', 'All lose', 'No result'], 0, '', ''],
    ['Bài học chính từ nghiên cứu tình huống:', 'The case study’s main lesson:', ['Quy trình kiểm định nghiêm ngặt quan trọng hơn hiệu suất ấn tượng', 'PTKT chắc chắn vô dụng', 'Chỉ cần quy tắc tốt nhất', 'Không cần dữ liệu'], ['Rigorous process matters more than impressive results', 'TA is surely useless', 'Just use the best rule', 'No data needed'], 0, '', ''],
    ['Cách giảm thiên lệch ngay từ đầu:', 'Reducing bias from the start:', ['Thử ít quy tắc có cơ sở lý thuyết, ít tham số', 'Thử càng nhiều càng tốt', 'Dùng dữ liệu ngắn', 'Bỏ khử xu hướng'], ['Test fewer theory-based, parsimonious rules', 'Test as many as possible', 'Short data', 'Skip detrending'], 0, '', ''],
    ['Xác suất ít nhất 1 trong 50 quy tắc vô dụng độc lập có p < 0.05:', 'Probability at least 1 of 50 independent useless rules has p < 0.05:', ['5%', '≈ 50%', '≈ 92%', '100%'], null, 2, '1 − 0.95^50 ≈ 0.92.', ''],
    ['Vì sao hiệu suất ngoài mẫu của quy tắc tốt nhất thường kém hơn trong mẫu?', 'Why is the best rule usually worse out of sample?', ['Phần may mắn không lặp lại', 'Dữ liệu sai', 'Phí tăng', 'Không đúng'], ['Its luck component doesn’t repeat', 'Bad data', 'Higher fees', 'False'], 0, '', ''],
    ['Dùng dữ liệu dài và nhiều thị trường giúp:', 'Long, multi-market data helps by:', ['Tăng số quan sát, giảm vai trò may mắn', 'Tăng thiên lệch', 'Không tác dụng', 'Giảm lệnh'], ['Increasing observations and reducing luck’s role', 'Raising bias', 'No effect', 'Fewer trades'], 0, '', ''],
    ['Một quy tắc không vượt qua kiểm định có điều chỉnh có nghĩa:', 'A rule failing an adjusted test means:', ['Chưa có bằng chứng — không chứng minh PTKT vô dụng', 'PTKT vô dụng hoàn toàn', 'Quy tắc chắc chắn lỗ', 'Dữ liệu sai'], ['No evidence yet — not proof TA is useless', 'TA is wholly useless', 'Sure loss', 'Bad data'], 0, '', '']
  ]);

  /* ================= L2-37 ================= */
  C.addLesson('l2-37', {
    goals: ['Mô tả quy trình thiết kế hệ thống giao dịch từ ý tưởng đến vận hành.', 'Phân biệt tối ưu hoá và quá khớp; nhận diện vùng tham số ổn định.', 'Áp dụng kiểm định tiến bước (walk-forward) và phân tích độ nhạy.', 'Lập kế hoạch giám sát và tiêu chí dừng hệ thống.'],
    body: () => `
<h3>1. Quy trình thiết kế</h3>
<div class="flow"><span>Ý tưởng</span><span>→</span><span>Quy tắc khách quan</span><span>→</span><span>Dữ liệu sạch</span><span>→</span><span>Kiểm định trong mẫu</span><span>→</span><span>Tối ưu thận trọng</span><span>→</span><span>Walk-forward / ngoài mẫu</span><span>→</span><span>Định cỡ & rủi ro</span><span>→</span><span>Giao dịch thử</span><span>→</span><span>Giám sát</span></div>
<ol><li><b>Ý tưởng có cơ sở</b>: vì sao lợi thế tồn tại (Bài 35)? Ai ở phía bên kia giao dịch?</li>
<li><b>Quy tắc khách quan</b>: điều kiện vào, ra (dừng lỗ, chốt lời, thoát theo thời gian, dừng động), bộ lọc, định cỡ vị thế.</li>
<li><b>Dữ liệu</b>: đủ dài, điều chỉnh chia tách/cổ tức, không thiên lệch sống sót, có chi phí thực tế.</li>
<li><b>Kiểm định</b> với thống kê đầy đủ (Bài 33).</li></ol>
<h3>2. Tối ưu hoá và quá khớp</h3>
<ul><li><b>Tối ưu hoá</b>: tìm tham số tốt trong một phạm vi. Hợp lý khi số tham số ít và kết quả ổn định.</li>
<li><b>Quá khớp</b>: hệ thống "học thuộc" nhiễu của dữ liệu quá khứ — nhiều tham số, nhiều quy tắc ngoại lệ, kết quả rất đẹp trong mẫu nhưng sụp đổ ngoài mẫu.</li>
<li>Chọn tham số ở giữa một <b>"cao nguyên"</b> (vùng rộng nơi các tham số lân cận đều cho kết quả tốt), không phải một <b>"đỉnh nhọn"</b> cô lập.</li>
<li><b>Bậc tự do</b>: mỗi tham số/điều kiện "tiêu tốn" dữ liệu; cần nhiều lệnh cho mỗi tham số.</li></ul>
<h3>3. Kiểm định tiến bước (walk-forward)</h3>
<p>Chia dữ liệu thành các cửa sổ liên tiếp: tối ưu trên cửa sổ trong mẫu (ví dụ 3 năm) → áp dụng tham số tốt nhất cho cửa sổ ngoài mẫu kế tiếp (ví dụ 1 năm) → trượt cửa sổ và lặp lại. Nối các đoạn ngoài mẫu lại thành đường vốn "như thật". <b>Hiệu quả walk-forward</b> = hiệu suất ngoài mẫu / hiệu suất trong mẫu (năm hoá); trên ~50–60% thường được xem là chấp nhận được.</p>
<h3>4. Kiểm tra độ bền</h3>
<ul><li><b>Độ nhạy tham số</b>: thay đổi ±10–20% từng tham số — kết quả không nên sụp đổ.</li>
<li><b>Nhiều thị trường và khung thời gian</b>: ý tưởng tốt thường hoạt động ở nhiều nơi.</li>
<li><b>Monte Carlo</b> trên thứ tự lệnh và trên dữ liệu (thêm nhiễu, bỏ ngẫu nhiên một số lệnh).</li>
<li><b>Chi phí gấp đôi</b>: hệ thống còn lãi khi nhân đôi phí và trượt giá?</li></ul>
${H.trendSys()}
<h3>5. Định cỡ vị thế và rủi ro</h3>
<ul><li>Rủi ro cố định theo % vốn mỗi lệnh (ví dụ 0.5–2%), khoảng dừng dựa trên ATR.</li><li>Giới hạn rủi ro danh mục, tương quan giữa các vị thế, sụt giảm tối đa cho phép.</li></ul>
<h3>6. Vận hành và giám sát</h3>
<ul><li>Bắt đầu bằng <b>giao dịch giấy</b> hoặc quy mô nhỏ; so sánh lệnh thật với tín hiệu backtest (trượt giá, độ trễ).</li>
<li>Theo dõi đường vốn so với <b>phạm vi Monte Carlo</b>: kết quả thật nằm trong phạm vi kỳ vọng thì kiên nhẫn.</li>
<li><b>Tiêu chí dừng định trước</b>: ví dụ sụt giảm vượt phân vị 95% của mô phỏng, hoặc chuỗi thua dài hơn mức tối đa kỳ vọng → tạm dừng và xem xét lại.</li>
<li>Không thay đổi quy tắc giữa chừng chỉ vì vài lệnh thua — đó là quay lại quá khớp.</li></ul>`,
    keys: ['Quy trình: ý tưởng có cơ sở → quy tắc khách quan → dữ liệu sạch → kiểm định → tối ưu thận trọng → walk-forward → định cỡ → giao dịch thử → giám sát.', 'Quá khớp = học thuộc nhiễu; chọn tham số trên "cao nguyên", không "đỉnh nhọn"; tiết kiệm bậc tự do.', 'Walk-forward: tối ưu trong mẫu, áp dụng ngoài mẫu, trượt cửa sổ; hiệu quả WF ≈ ngoài mẫu/trong mẫu.', 'Độ bền: độ nhạy tham số, nhiều thị trường, Monte Carlo, chi phí gấp đôi.', 'Giám sát so với phạm vi Monte Carlo; tiêu chí dừng định trước; không sửa quy tắc vì vài lệnh thua.'],
    terms: [['Optimisation', 'Tối ưu hoá'], ['Overfitting / curve fitting', 'Quá khớp'], ['Parameter plateau', 'Cao nguyên tham số'], ['Walk-forward analysis', 'Kiểm định tiến bước'], ['Walk-forward efficiency', 'Hiệu quả walk-forward'], ['Sensitivity analysis', 'Phân tích độ nhạy'], ['Paper trading', 'Giao dịch giấy']]
  }, {
    goals: ['Describe the design process.', 'Distinguish optimisation from overfitting.', 'Apply walk-forward and sensitivity analysis.', 'Plan monitoring and stop criteria.'],
    body: () => `
<h3>1. Process</h3><div class="flow"><span>Idea</span><span>→</span><span>Rules</span><span>→</span><span>Data</span><span>→</span><span>Test</span><span>→</span><span>Optimise</span><span>→</span><span>Walk-forward</span><span>→</span><span>Sizing</span><span>→</span><span>Paper trade</span><span>→</span><span>Monitor</span></div>
<h3>2. Optimisation vs overfitting</h3><ul><li>Few parameters, stable results.</li><li>Choose plateaus, not spikes.</li><li>Conserve degrees of freedom.</li></ul>
<h3>3. Walk-forward</h3><p>Optimise in-sample, apply to the next out-of-sample window, roll forward; WF efficiency = OOS / IS annualised performance (≳ 50–60% acceptable).</p>
<h3>4. Robustness</h3><ul><li>±10–20% parameter changes.</li><li>Multiple markets/timeframes.</li><li>Monte Carlo.</li><li>Double costs.</li></ul>${H.trendSys()}
<h3>5. Sizing and risk</h3><ul><li>Fixed % risk with ATR stops.</li><li>Portfolio and drawdown limits.</li></ul>
<h3>6. Operation</h3><ul><li>Paper/small size; compare fills.</li><li>Track against Monte Carlo ranges.</li><li>Predefined stop criteria.</li><li>Don’t tweak after a few losses.</li></ul>`,
    keys: ['Process.', 'Plateaus vs spikes.', 'Walk-forward.', 'Robustness.', 'Monitoring and stop criteria.'],
    terms: [['Walk-forward', 'Rolling optimise-then-test'], ['Overfitting', 'Fitting noise']]
  }, [
    ['Câu hỏi đầu tiên khi thiết kế hệ thống:', 'The first question when designing a system:', ['Vì sao lợi thế này tồn tại và ai ở phía bên kia?', 'Tham số tối ưu là gì?', 'Đòn bẩy bao nhiêu?', 'Mua mã nào?'], ['Why does the edge exist and who is on the other side?', 'Optimal parameters?', 'Leverage?', 'Which stock?'], 0, '', ''],
    ['Quá khớp là:', 'Overfitting is:', ['Hệ thống học thuộc nhiễu của dữ liệu quá khứ', 'Hệ thống quá đơn giản', 'Dùng quá ít dữ liệu ngoài mẫu', 'Phí cao'], ['A system memorising past noise', 'Too simple a system', 'Too little OOS data', 'High fees'], 0, '', ''],
    ['Khi chọn tham số, nên chọn:', 'When choosing parameters, pick:', ['Giữa một cao nguyên kết quả tốt và ổn định', 'Đỉnh nhọn cao nhất', 'Ngẫu nhiên', 'Giá trị nhỏ nhất'], ['The middle of a stable plateau', 'The highest isolated spike', 'Random', 'The smallest value'], 0, '', ''],
    ['Dấu hiệu quá khớp:', 'A sign of overfitting:', ['Nhiều tham số, kết quả trong mẫu tuyệt vời nhưng ngoài mẫu sụp đổ', 'Ít tham số, kết quả ổn định', 'Hoạt động trên nhiều thị trường', 'Còn lãi khi chi phí gấp đôi'], ['Many parameters, great in-sample, collapsing out of sample', 'Few parameters, stable', 'Works across markets', 'Survives doubled costs'], 0, '', ''],
    ['Walk-forward analysis là:', 'Walk-forward analysis is:', ['Tối ưu trên cửa sổ trong mẫu, áp dụng cho cửa sổ ngoài mẫu kế tiếp, rồi trượt', 'Tối ưu một lần trên toàn bộ dữ liệu', 'Chỉ giao dịch giấy', 'Đi bộ'], ['Optimise in-sample, apply to the next OOS window, roll forward', 'One full-data optimisation', 'Paper trading only', 'Walking'], 0, '', ''],
    ['Hiệu suất trong mẫu 20%/năm, ngoài mẫu 12%/năm. Hiệu quả walk-forward:', 'IS 20%/yr, OOS 12%/yr. Walk-forward efficiency:', ['60%', '167%', '8%', '32%'], null, 0, '12/20.', ''],
    ['Phân tích độ nhạy kiểm tra:', 'Sensitivity analysis checks:', ['Kết quả có giữ vững khi tham số thay đổi nhẹ không', 'Phí', 'Cổ tức', 'Tin tức'], ['Whether results hold when parameters shift slightly', 'Fees', 'Dividends', 'News'], 0, '', ''],
    ['Kiểm tra "chi phí gấp đôi" nhằm:', 'The "double costs" check aims to:', ['Đảm bảo lợi thế đủ lớn để chịu chi phí thực tế xấu hơn', 'Tăng lợi nhuận', 'Giảm số lệnh', 'Không mục đích'], ['Ensure the edge survives worse real costs', 'Raise profit', 'Cut trades', 'No purpose'], 0, '', ''],
    ['Ý tưởng tốt thường:', 'Good ideas usually:', ['Hoạt động trên nhiều thị trường và khung thời gian', 'Chỉ chạy trên một mã', 'Cần 20 tham số', 'Không cần kiểm định'], ['Work across many markets and timeframes', 'Work on one symbol only', 'Need 20 parameters', 'Need no testing'], 0, '', ''],
    ['"Bậc tự do" trong thiết kế hệ thống liên quan tới:', '"Degrees of freedom" in system design relate to:', ['Mỗi tham số/điều kiện tiêu tốn dữ liệu, cần nhiều lệnh cho mỗi tham số', 'Số ngày nghỉ', 'Phí', 'Đòn bẩy'], ['Each parameter consumes data; need many trades per parameter', 'Holidays', 'Fees', 'Leverage'], 0, '', ''],
    ['Bước nên làm trước khi giao dịch với toàn bộ vốn:', 'Before trading full size you should:', ['Giao dịch giấy hoặc quy mô nhỏ, so sánh lệnh thật với backtest', 'Tăng đòn bẩy', 'Bỏ dừng lỗ', 'Không cần'], ['Paper trade or trade small, compare live fills with backtest', 'Raise leverage', 'Drop stops', 'Nothing'], 0, '', ''],
    ['Tiêu chí dừng hệ thống nên được:', 'System stop criteria should be:', ['Xác định trước, dựa trên phạm vi Monte Carlo', 'Quyết định theo cảm xúc', 'Không có', 'Sau mỗi lệnh thua'], ['Predefined, based on Monte Carlo ranges', 'Emotional', 'None', 'After each loss'], 0, '', ''],
    ['Sửa quy tắc ngay sau 3 lệnh thua liên tiếp (trong phạm vi kỳ vọng) là:', 'Changing rules after 3 losses (within expectations) is:', ['Quay lại quá khớp, phá kỷ luật', 'Quản lý rủi ro tốt', 'Bắt buộc', 'Walk-forward'], ['A return to overfitting and indiscipline', 'Good risk management', 'Required', 'Walk-forward'], 0, '', ''],
    ['Thành phần nào KHÔNG thuộc quy tắc thoát lệnh?', 'Which is NOT an exit rule component?', ['Dừng lỗ', 'Chốt lời', 'Thoát theo thời gian', 'Lọc thanh khoản đầu vào'], ['Stop-loss', 'Profit target', 'Time exit', 'Entry liquidity filter'], 3, '', ''],
    ['Rủi ro cố định 1% vốn, dừng lỗ = 2 × ATR, ATR = 1.500đ, vốn 300 triệu. Số cổ phiếu:', 'Risk 1% of 300M, stop = 2 × ATR, ATR 1,500. Shares:', ['1.000', '2.000', '3.000', '10.000'], null, 0, '3.000.000 / 3.000 = 1.000.', ''],
    ['Dữ liệu cho kiểm định hệ thống cổ phiếu Việt Nam cần:', 'Data for testing a Vietnam stock system needs:', ['Điều chỉnh cổ tức/chia tách, gồm mã đã huỷ niêm yết, có phí và thuế', 'Chỉ giá hiện tại', 'Chỉ VN30 hiện tại', 'Không cần điều chỉnh'], ['Dividend/split adjustment, delisted names, fees and taxes', 'Current prices only', 'Today’s VN30 only', 'No adjustment'], 0, '', ''],
    ['Kết quả thực tế nằm trong phạm vi Monte Carlo kỳ vọng thì nên:', 'If live results fall within expected Monte Carlo ranges you should:', ['Kiên nhẫn tiếp tục theo hệ thống', 'Dừng ngay', 'Tăng gấp đôi rủi ro', 'Đổi hệ thống'], ['Stay patient and follow the system', 'Stop at once', 'Double risk', 'Switch systems'], 0, '', ''],
    ['Kết quả walk-forward được nối từ:', 'Walk-forward equity is stitched from:', ['Các đoạn ngoài mẫu liên tiếp', 'Các đoạn trong mẫu', 'Dữ liệu ngẫu nhiên', 'Kết quả tốt nhất'], ['Consecutive out-of-sample segments', 'In-sample segments', 'Random data', 'Best results'], 0, '', ''],
    ['Thêm quy tắc ngoại lệ để tránh vài lệnh thua lớn trong quá khứ thường:', 'Adding exception rules to dodge a few past big losers usually:', ['Làm tăng quá khớp', 'Tăng độ bền', 'Không ảnh hưởng', 'Giảm bậc tự do tiêu tốn'], ['Increases overfitting', 'Improves robustness', 'No effect', 'Saves degrees of freedom'], 0, '', ''],
    ['Mục tiêu cuối cùng của thiết kế và kiểm định hệ thống:', 'The ultimate goal of design and testing:', ['Một hệ thống có lợi thế bền vững, rủi ro được kiểm soát, có thể thực hiện với kỷ luật', 'Backtest đẹp nhất', 'Nhiều tham số nhất', 'Không thua lệnh nào'], ['A robust, risk-controlled edge you can execute with discipline', 'The prettiest backtest', 'Most parameters', 'No losing trades'], 0, '', '']
  ]);
})(window.LLW);
