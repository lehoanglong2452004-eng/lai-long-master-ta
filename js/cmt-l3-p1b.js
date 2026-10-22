// © 2026 Lai Long Master TA. Bảo lưu mọi quyền. Không sao chép, chỉnh sửa hay dùng lại khi chưa được phép.
/* CMT Level 3 — Part 1b, lessons 5–7: risk control and statistics. Written by Lai Long Master TA in its own words. */
(function (L) {
  'use strict';
  const C = L.cmt, H = C.demoHtml;

  /* ---------- calculator: VaR / expected shortfall / volatility targeting ---------- */
  H.varCalc = () => C.calcShell('varCalc', `${C.num('v', 1000, L.T('Giá trị danh mục (triệu)', 'Portfolio (M)'), 50)}${C.num('s', 22, L.T('σ năm %', 'Annual σ %'), 1)}${C.num('d', 1, L.T('Số ngày', 'Days'), 1)}${C.num('c', 95, L.T('Độ tin cậy %', 'Confidence %'), 1)}${C.num('tg', 12, L.T('σ mục tiêu %', 'Target σ %'), 1)}`,
    L.T('VaR tham số (giả định chuẩn), expected shortfall và đòn bẩy theo mục tiêu biến động.', 'Parametric VaR (normal), expected shortfall and volatility-target exposure.'));
  C.demoRun.varCalc = box => {
    const zOf = c => { const t = { 90: 1.2816, 95: 1.6449, 97.5: 1.96, 99: 2.3263, 99.5: 2.5758 }; return t[c] || (c >= 99 ? 2.3263 : c >= 97.5 ? 1.96 : c >= 95 ? 1.6449 : 1.2816); };
    const run = () => {
      const g = c => +box.querySelector('.' + c).value, V = g('v'), sd = g('s') / 100 * Math.sqrt(Math.max(1, g('d')) / 252), cl = g('c'), z = zOf(cl);
      const varv = V * z * sd, es = V * sd * Math.exp(-z * z / 2) / Math.sqrt(2 * Math.PI) / (1 - cl / 100), w = g('tg') / g('s');
      box.querySelector('.demo-out').innerHTML = L.T(`σ cho ${g('d')} ngày ≈ ${(sd * 100).toFixed(2)}%. <b>VaR ${cl}%</b> ≈ <b>${varv.toFixed(1)} triệu</b>: trong ${100 - cl}% số trường hợp xấu nhất, lỗ sẽ <i>vượt</i> mức này. <b>Expected shortfall</b> (lỗ trung bình khi đã vượt VaR) ≈ <b>${es.toFixed(1)} triệu</b>. Với thực tế đuôi dày, cả hai thường bị đánh giá thấp. Mục tiêu biến động ${g('tg')}% → tỷ trọng ≈ <b>${(w * 100).toFixed(0)}%</b> danh mục rủi ro${w > 1 ? ' (cần đòn bẩy)' : ''}.`,
        `${g('d')}-day σ ≈ ${(sd * 100).toFixed(2)}%. <b>${cl}% VaR</b> ≈ <b>${varv.toFixed(1)}M</b>: in the worst ${100 - cl}% of cases the loss <i>exceeds</i> this. <b>Expected shortfall</b> ≈ <b>${es.toFixed(1)}M</b>. Fat tails mean both are usually understated. Target volatility ${g('tg')}% → exposure ≈ <b>${(w * 100).toFixed(0)}%</b>${w > 1 ? ' (leverage needed)' : ''}.`);
    };
    box.querySelectorAll('.d-num').forEach(i => { i.oninput = run; });
    run();
  };

  /* ================= L3-05 ================= */
  C.addLesson('l3-05', {
    goals: ['Đo lường rủi ro bằng độ lệch chuẩn, VaR, expected shortfall và sụt giảm.', 'Kiểm soát đòn bẩy và áp dụng mục tiêu biến động.', 'Thiết lập giới hạn rủi ro nhiều tầng: lệnh, vị thế, nhóm, danh mục.', 'Đánh giá rủi ro đuôi, thanh khoản và giao dịch theo đường vốn.'],
    body: () => `
<h3>1. Đo lường rủi ro</h3>
<table class="tbl"><thead><tr><th>Thước đo</th><th>Ý nghĩa</th><th>Hạn chế</th></tr></thead><tbody>
<tr><td>Độ lệch chuẩn (σ)</td><td>Mức dao động điển hình</td><td>Coi biến động tăng và giảm như nhau; giả định đối xứng</td></tr>
<tr><td><b>VaR</b> (Value at Risk)</td><td>Mức lỗ chỉ bị vượt trong x% trường hợp xấu nhất trong một khoảng thời gian</td><td>Không nói lỗ <b>lớn tới đâu</b> khi đã vượt; đánh giá thấp đuôi dày</td></tr>
<tr><td><b>Expected shortfall</b> (CVaR)</td><td>Lỗ trung bình trong các trường hợp vượt VaR</td><td>Cần nhiều dữ liệu đuôi</td></tr>
<tr><td>Sụt giảm tối đa</td><td>Mất mát thực tế từ đỉnh</td><td>Phụ thuộc lịch sử; tương lai có thể tệ hơn</td></tr>
<tr><td>Kiểm tra căng thẳng / kịch bản</td><td>"Nếu lặp lại 2008, 2020, 2022 thì sao?"</td><td>Kịch bản tương lai có thể khác quá khứ</td></tr></tbody></table>
<div class="callout"><b>Ví dụ VaR tham số</b>: danh mục 1 tỷ, σ năm 22%. σ 1 ngày ≈ 22%/√252 ≈ 1.39%. VaR 95% 1 ngày ≈ 1.645 × 1.39% × 1 tỷ ≈ <b>22.8 triệu</b>. VaR 10 ngày ≈ 22.8 × √10 ≈ 72 triệu.</div>
${H.varCalc()}
<h3>2. Đòn bẩy và mục tiêu biến động</h3>
<ul><li>Đòn bẩy nhân cả lợi nhuận và sụt giảm; với lợi suất biến động, đòn bẩy cao còn làm <b>giảm tăng trưởng hình học</b> (lợi nhuận kép ≈ trung bình − σ²/2).</li>
<li><b>Mục tiêu biến động</b>: tỷ trọng = σ mục tiêu / σ hiện tại (ước lượng gần đây). Khi biến động tăng (thường trong thị trường giảm), tỷ trọng tự giảm → giảm sụt giảm; khi yên ả, tăng tỷ trọng.</li>
<li>Rủi ro: biến động có thể tăng vọt nhanh hơn tốc độ điều chỉnh; dùng ước lượng phản ứng nhanh (EWMA) và giới hạn đòn bẩy tối đa.</li></ul>
<h3>3. Giới hạn rủi ro nhiều tầng</h3>
<ol><li><b>Lệnh</b>: rủi ro tối đa mỗi lệnh (ví dụ 1%).</li><li><b>Vị thế</b>: tỷ trọng tối đa một mã (ví dụ 10–15%) — vì gap có thể vượt dừng.</li><li><b>Nhóm</b>: tối đa theo ngành/nhóm tương quan (ví dụ 25%).</li><li><b>Danh mục</b>: tổng rủi ro mở, đòn bẩy tối đa, VaR tối đa.</li><li><b>Sụt giảm</b>: ngưỡng cắt giảm (ví dụ −10% giảm một nửa rủi ro, −20% dừng giao dịch và xem xét).</li></ol>
<h3>4. Rủi ro đuôi và thanh khoản</h3>
<ul><li>Trong khủng hoảng, <b>tương quan tăng</b>, thanh khoản biến mất, dừng lỗ trượt mạnh — đa dạng hoá "biến mất" đúng lúc cần.</li>
<li>Phòng vệ đuôi: tỷ trọng tiền mặt, quyền chọn bán, hệ thống xu hướng (thường lãi trong khủng hoảng kéo dài), tài sản tương quan âm.</li>
<li>Rủi ro thanh khoản: không nắm giữ vị thế lớn hơn một tỷ lệ nhỏ khối lượng trung bình (ví dụ có thể thoát trong 1–3 phiên).</li></ul>
<h3>5. Giao dịch theo đường vốn</h3>
<p>Áp dụng phân tích kỹ thuật lên chính đường vốn của hệ thống: giảm hoặc dừng giao dịch khi đường vốn dưới MA của nó, quay lại khi trên. Có thể giảm sụt giảm nếu hiệu suất có tính "chuỗi" (thắng/thua theo cụm), nhưng có thể bỏ lỡ giai đoạn hồi phục mạnh — phải kiểm định như mọi quy tắc khác.</p>`,
    keys: ['σ, VaR, expected shortfall, sụt giảm, kịch bản — VaR không cho biết lỗ lớn tới đâu khi vượt và đánh giá thấp đuôi dày.', 'VaR tham số = z × σ × √t × giá trị.', 'Đòn bẩy làm giảm tăng trưởng hình học khi biến động cao; mục tiêu biến động: tỷ trọng = σ mục tiêu/σ hiện tại.', 'Giới hạn nhiều tầng: lệnh, vị thế, nhóm, danh mục, sụt giảm.', 'Khủng hoảng: tương quan tăng, thanh khoản cạn; phòng vệ đuôi; giới hạn theo khối lượng.', 'Giao dịch theo đường vốn: cần kiểm định.'],
    terms: [['Value at Risk', 'Giá trị chịu rủi ro'], ['Expected shortfall / CVaR', 'Tổn thất kỳ vọng vượt VaR'], ['Volatility targeting', 'Mục tiêu biến động'], ['Volatility drag', 'Hao hụt do biến động'], ['Tail hedge', 'Phòng vệ đuôi'], ['Equity-curve trading', 'Giao dịch theo đường vốn']]
  }, {
    goals: ['Measure risk with σ, VaR, ES and drawdown.', 'Control leverage; volatility targeting.', 'Set layered risk limits.', 'Assess tail, liquidity risk and equity-curve trading.'],
    body: () => `
<h3>1. Measures</h3><table class="tbl"><tbody><tr><td>σ</td><td>symmetric</td></tr><tr><td>VaR</td><td>loss exceeded x% of the time; silent on tail size</td></tr><tr><td>Expected shortfall</td><td>average loss beyond VaR</td></tr><tr><td>Drawdown</td><td>realised pain</td></tr><tr><td>Stress tests</td><td>scenarios</td></tr></tbody></table><div class="callout">1bn, σ 22% → 1-day 95% VaR ≈ 22.8M; 10-day ≈ 72M.</div>${H.varCalc()}
<h3>2. Leverage and vol targeting</h3><ul><li>Geometric return ≈ mean − σ²/2.</li><li>Weight = target σ / current σ.</li><li>Use fast estimates and caps.</li></ul>
<h3>3. Layered limits</h3><ol><li>Trade</li><li>Position</li><li>Group</li><li>Portfolio</li><li>Drawdown</li></ol>
<h3>4. Tail and liquidity</h3><ul><li>Correlations rise, liquidity vanishes.</li><li>Tail hedges: cash, puts, trend systems.</li><li>Size versus average volume.</li></ul>
<h3>5. Equity-curve trading</h3><p>Trade the system’s equity vs its MA — must be tested.</p>`,
    keys: ['Risk measures.', 'Parametric VaR.', 'Leverage and vol targeting.', 'Layered limits.', 'Tails and liquidity.', 'Equity-curve trading.'],
    terms: [['Expected shortfall', 'Mean loss beyond VaR'], ['Volatility targeting', 'Scale exposure by target/current σ']]
  }, [
    ['VaR 95% một ngày = 20 triệu nghĩa là:', 'A 1-day 95% VaR of 20M means:', ['Trong 5% số ngày xấu nhất, lỗ vượt 20 triệu', 'Lỗ tối đa là 20 triệu', 'Lỗ trung bình 20 triệu', 'Lãi 20 triệu'], ['On the worst 5% of days the loss exceeds 20M', 'Max loss is 20M', 'Average loss 20M', 'Profit 20M'], 0, '', ''],
    ['Hạn chế lớn nhất của VaR:', 'VaR’s biggest limitation:', ['Không cho biết lỗ lớn tới đâu khi đã vượt ngưỡng', 'Quá khó tính', 'Luôn quá bi quan', 'Không dùng σ'], ['It says nothing about loss size beyond the threshold', 'Too hard to compute', 'Always too pessimistic', 'No σ used'], 0, '', ''],
    ['Expected shortfall là:', 'Expected shortfall is:', ['Lỗ trung bình trong các trường hợp vượt VaR', 'Lỗ nhỏ nhất', 'VaR × 2', 'Lợi nhuận kỳ vọng'], ['The average loss beyond VaR', 'Smallest loss', 'VaR × 2', 'Expected profit'], 0, '', ''],
    ['Danh mục 500 triệu, σ ngày 2%. VaR 95% 1 ngày (z = 1.645) ≈', 'Portfolio 500M, daily σ 2%. 1-day 95% VaR ≈', ['10 triệu', '16.5 triệu', '32.9 triệu', '1.645 triệu'], null, 1, '1.645 × 2% × 500.', ''],
    ['VaR 1 ngày 10 triệu. VaR 25 ngày (theo √t) ≈', '1-day VaR 10M. 25-day VaR (√t) ≈', ['25 triệu', '50 triệu', '250 triệu', '10 triệu'], null, 1, '10 × √25.', ''],
    ['Vì sao VaR tham số thường đánh giá thấp rủi ro thực?', 'Why does parametric VaR often understate real risk?', ['Lợi suất thực có đuôi dày hơn phân phối chuẩn', 'Lợi suất quá ổn định', 'Do luật', 'Không đúng'], ['Real returns have fatter tails than normal', 'Returns too stable', 'Law', 'False'], 0, '', ''],
    ['Mục tiêu biến động 10%, biến động hiện tại 25%. Tỷ trọng tài sản rủi ro:', 'Target vol 10%, current vol 25%. Risky-asset weight:', ['40%', '250%', '10%', '100%'], null, 0, '10/25.', ''],
    ['Khi biến động thị trường tăng mạnh, chiến lược mục tiêu biến động sẽ:', 'When market volatility spikes, a vol-target strategy will:', ['Giảm tỷ trọng', 'Tăng tỷ trọng', 'Giữ nguyên', 'Bán khống'], ['Reduce exposure', 'Increase exposure', 'Hold', 'Short'], 0, '', ''],
    ['Lợi nhuận hình học ≈ trung bình − σ²/2 cho thấy:', 'Geometric return ≈ mean − σ²/2 shows:', ['Biến động cao (và đòn bẩy) ăn mòn tăng trưởng kép', 'Biến động không ảnh hưởng', 'Đòn bẩy luôn tốt', 'σ càng cao càng tốt'], ['High volatility (and leverage) erodes compounding', 'Volatility is irrelevant', 'Leverage always helps', 'Higher σ is better'], 0, '', ''],
    ['Trung bình năm 10%, σ 40%. Lợi nhuận hình học xấp xỉ:', 'Mean 10%, σ 40%. Geometric return ≈', ['10%', '2%', '−6%', '18%'], null, 1, '10 − 16/2 = 2.', ''],
    ['Giới hạn tỷ trọng tối đa một mã (dù đã có dừng lỗ) vì:', 'Cap single-name weight (despite stops) because:', ['Gap có thể vượt qua dừng lỗ', 'Dừng luôn khớp đúng giá', 'Không cần', 'Do thuế'], ['Gaps can jump stops', 'Stops always fill', 'Unneeded', 'Taxes'], 0, '', ''],
    ['Trong khủng hoảng, đa dạng hoá thường kém hiệu quả vì:', 'In crises diversification often fails because:', ['Tương quan giữa tài sản rủi ro tăng mạnh', 'Tương quan giảm về 0', 'Thị trường đóng cửa', 'Lãi suất tăng'], ['Correlations among risky assets surge', 'Correlations fall to 0', 'Markets close', 'Rates rise'], 0, '', ''],
    ['Công cụ phòng vệ đuôi phổ biến:', 'A common tail hedge:', ['Quyền chọn bán, tiền mặt, hệ thống xu hướng', 'Tăng đòn bẩy', 'Cổ phiếu penny', 'Bình quân giá xuống'], ['Puts, cash, trend-following systems', 'More leverage', 'Penny stocks', 'Averaging down'], 0, '', ''],
    ['Vì sao hệ thống xu hướng được xem là phòng vệ đuôi một phần?', 'Why are trend systems a partial tail hedge?', ['Thường lãi trong các đợt giảm kéo dài (có thể bán khống/đứng ngoài)', 'Luôn lãi mỗi ngày', 'Không giao dịch', 'Không đúng'], ['They often profit in prolonged declines (short/flat)', 'Profit daily', 'Don’t trade', 'False'], 0, '', ''],
    ['Rủi ro thanh khoản được kiểm soát bằng:', 'Liquidity risk is controlled by:', ['Giới hạn vị thế theo % khối lượng trung bình để thoát trong vài phiên', 'Mua mã ít thanh khoản', 'Bỏ dừng lỗ', 'Tăng đòn bẩy'], ['Capping positions to a % of ADV to exit within days', 'Buying illiquid names', 'No stops', 'Leverage'], 0, '', ''],
    ['Quy tắc "sụt giảm −10% thì giảm một nửa rủi ro" thuộc tầng giới hạn:', '"Halve risk at −10% drawdown" is a limit at the level of:', ['Sụt giảm danh mục', 'Lệnh đơn lẻ', 'Phí', 'Dữ liệu'], ['Portfolio drawdown', 'Single trade', 'Fees', 'Data'], 0, '', ''],
    ['Giao dịch theo đường vốn là:', 'Equity-curve trading is:', ['Điều chỉnh giao dịch dựa trên tín hiệu kỹ thuật của chính đường vốn hệ thống', 'Mua cổ phiếu có vốn lớn', 'Không giao dịch', 'Tăng vốn'], ['Adjusting trading by technical signals on the system’s own equity curve', 'Buying large caps', 'Not trading', 'Adding capital'], 0, '', ''],
    ['Giao dịch theo đường vốn có thể hiệu quả khi:', 'Equity-curve trading may help when:', ['Hiệu suất có tính cụm (thắng/thua theo chuỗi)', 'Lệnh hoàn toàn độc lập', 'Không có lệnh', 'Luôn luôn'], ['Performance is clustered (streaky)', 'Trades are fully independent', 'No trades', 'Always'], 0, '', ''],
    ['Nhược điểm của giao dịch theo đường vốn:', 'Drawback of equity-curve trading:', ['Có thể bỏ lỡ giai đoạn hồi phục mạnh của hệ thống', 'Không có', 'Tăng rủi ro chắc chắn', 'Không kiểm định được'], ['May miss the system’s strong recoveries', 'None', 'Surely more risk', 'Untestable'], 0, '', ''],
    ['Kiểm tra căng thẳng theo kịch bản trả lời câu hỏi:', 'Scenario stress tests answer:', ['"Nếu một cú sốc như quá khứ lặp lại, danh mục mất bao nhiêu?"', '"Lợi nhuận trung bình bao nhiêu?"', '"Phí bao nhiêu?"', 'Không câu nào'], ['"If a past shock recurred, what would we lose?"', '"What is the average return?"', '"What are fees?"', 'None'], 0, '', ''],
    ['σ coi biến động tăng và giảm:', 'σ treats upside and downside moves:', ['Như nhau', 'Chỉ tính giảm', 'Chỉ tính tăng', 'Không tính'], ['Equally', 'Downside only', 'Upside only', 'Neither'], 0, '', ''],
    ['Ước lượng biến động phản ứng nhanh (EWMA) giúp mục tiêu biến động:', 'Fast (EWMA) volatility estimates help vol targeting by:', ['Phản ứng kịp khi biến động tăng vọt', 'Chậm hơn', 'Không thay đổi', 'Tăng đòn bẩy trong khủng hoảng'], ['Reacting in time to volatility spikes', 'Being slower', 'Nothing', 'Levering up in crises'], 0, '', ''],
    ['Đặt đòn bẩy tối đa trong chiến lược mục tiêu biến động nhằm:', 'A max leverage cap in vol targeting aims to:', ['Tránh đòn bẩy quá lớn khi biến động thấp bất thường trước cú sốc', 'Tăng lợi nhuận', 'Không mục đích', 'Giảm phí'], ['Avoid excessive leverage during abnormally calm pre-shock periods', 'Raise profit', 'No purpose', 'Cut fees'], 0, '', ''],
    ['Tình huống: danh mục có 30% vào một ngành, dù mỗi mã chỉ 6%. Vấn đề:', 'Case: 30% in one sector though each stock is 6%. Issue:', ['Vượt giới hạn nhóm tương quan — rủi ro tập trung', 'Không vấn đề', 'Quá đa dạng', 'Thiếu đòn bẩy'], ['Breaches the correlated-group limit — concentration', 'No issue', 'Too diversified', 'Too little leverage'], 0, '', ''],
    ['VaR lịch sử khác VaR tham số ở chỗ:', 'Historical VaR differs from parametric VaR by:', ['Dùng phân phối lợi suất thực tế quá khứ thay vì giả định chuẩn', 'Không dùng dữ liệu', 'Luôn nhỏ hơn', 'Giống hệt'], ['Using actual past returns instead of a normal assumption', 'Using no data', 'Always smaller', 'Identical'], 0, '', ''],
    ['Ngưỡng dừng giao dịch khi sụt giảm −20% có tác dụng:', 'A −20% drawdown trading halt serves to:', ['Buộc xem xét lại trước khi tổn thất trở nên không thể hồi phục', 'Tăng lợi nhuận', 'Không tác dụng', 'Giảm thuế'], ['Force a review before losses become unrecoverable', 'Raise profit', 'Nothing', 'Cut taxes'], 0, '', ''],
    ['Đòn bẩy 3 lần trên tài sản sụt giảm 30% dẫn tới:', '3× leverage on an asset falling 30% leads to:', ['Mất khoảng 90% vốn', 'Mất 30%', 'Mất 10%', 'Lãi'], ['About a 90% loss', 'A 30% loss', 'A 10% loss', 'A gain'], 0, '', ''],
    ['VaR 99% so với VaR 95% (cùng danh mục):', '99% VaR vs 95% VaR (same portfolio):', ['Lớn hơn', 'Nhỏ hơn', 'Bằng', 'Không so được'], ['Larger', 'Smaller', 'Equal', 'Incomparable'], 0, '', ''],
    ['Rủi ro được đo tốt nhất bằng:', 'Risk is best measured by:', ['Kết hợp nhiều thước đo (σ, VaR/ES, sụt giảm, kịch bản)', 'Một con số duy nhất', 'Lợi nhuận', 'Tỷ lệ thắng'], ['A combination of measures (σ, VaR/ES, drawdown, scenarios)', 'One number', 'Return', 'Win rate'], 0, '', ''],
    ['Mục tiêu cuối cùng của kiểm soát rủi ro:', 'The ultimate aim of risk control:', ['Đảm bảo tồn tại qua mọi chế độ thị trường để lợi thế phát huy', 'Không bao giờ lỗ', 'Tối đa đòn bẩy', 'Giao dịch nhiều'], ['Survive every regime so the edge can compound', 'Never lose', 'Max leverage', 'Trade more'], 0, '', '']
  ]);

  /* ================= L3-06 ================= */
  C.addLesson('l3-06', {
    goals: ['Mô tả dữ liệu tài chính bằng thống kê mô tả và nhận diện đặc điểm phân phối.', 'Áp dụng xác suất, luật số lớn và định lý giới hạn trung tâm cho kết quả giao dịch.', 'Hiểu phân phối mẫu và cách xây dựng bằng bootstrap.', 'Xử lý dữ liệu: lợi suất log, ngoại lai, khử xu hướng.'],
    body: () => `
<h3>1. Thống kê mô tả cho dữ liệu tài chính</h3>
<table class="tbl"><tbody>
<tr><td>Xu hướng trung tâm</td><td>Trung bình (nhạy ngoại lai), trung vị (bền), yếu vị</td></tr>
<tr><td>Phân tán</td><td>Phương sai, độ lệch chuẩn, khoảng tứ phân vị (bền với ngoại lai)</td></tr>
<tr><td><b>Độ lệch (skewness)</b></td><td>&gt; 0: đuôi phải dài (hệ thống xu hướng); &lt; 0: đuôi trái dài (bán quyền chọn, đảo chiều, chỉ số cổ phiếu ngắn hạn)</td></tr>
<tr><td><b>Độ nhọn (kurtosis)</b></td><td>&gt; 3 (dư &gt; 0): đuôi dày — sự kiện cực đoan thường hơn phân phối chuẩn</td></tr></tbody></table>
<p>Lợi suất hằng ngày của cổ phiếu và chỉ số thường: trung bình gần 0, độ lệch hơi âm, <b>độ nhọn cao</b>, biến động tụm lại.</p>
${H.retDist()}
<h3>2. Xác suất và luật số lớn</h3>
<ul><li><b>Luật số lớn</b>: khi số lần thử tăng, trung bình mẫu hội tụ về trung bình thật. Một lợi thế nhỏ chỉ "hiện ra" sau <b>nhiều</b> lệnh.</li>
<li><b>Định lý giới hạn trung tâm</b>: trung bình của nhiều quan sát độc lập xấp xỉ chuẩn, độ lệch chuẩn σ/√n — nền tảng cho khoảng tin cậy của lợi nhuận trung bình.</li>
<li>Xác suất có điều kiện: P(tăng | tín hiệu) so với P(tăng) — tín hiệu chỉ có giá trị nếu xác suất có điều kiện khác đáng kể xác suất cơ sở.</li></ul>
<div class="callout"><b>Ví dụ</b>: thị trường tăng 53% số phiên. Quy tắc cho tín hiệu mua với tỷ lệ phiên tăng sau đó 56% trên 400 tín hiệu. SE của tỷ lệ ≈ √(0.53 × 0.47/400) ≈ 2.5%; chênh lệch 3% ≈ 1.2 SE — <b>chưa đủ</b> bằng chứng.</div>
<h3>3. Phân phối mẫu và bootstrap</h3>
<p>Phân phối mẫu của một thống kê (ví dụ lợi nhuận trung bình của quy tắc) cho biết thống kê đó sẽ dao động thế nào nếu lặp lại việc lấy mẫu. Khi không muốn giả định chuẩn, dùng <b>bootstrap</b>: lấy mẫu lại có hoàn lại từ chính dữ liệu hàng nghìn lần, tính thống kê mỗi lần → phân phối thực nghiệm.</p>
<h3>4. Chuẩn bị dữ liệu</h3>
<ul><li><b>Lợi suất log</b> ln(P<sub>t</sub>/P<sub>t−1</sub>): cộng được theo thời gian, đối xứng hơn; xấp xỉ % thay đổi khi nhỏ.</li>
<li><b>Ngoại lai</b>: kiểm tra là lỗi dữ liệu hay sự kiện thật; không xoá sự kiện thật — chúng chính là rủi ro.</li>
<li><b>Khử xu hướng</b> trước khi đánh giá quy tắc (trừ lợi suất trung bình) để loại thiên lệch vị thế.</li>
<li><b>Tính dừng</b>: dùng lợi suất thay vì giá cho phân tích thống kê.</li></ul>`,
    keys: ['Mô tả: trung bình/trung vị, σ/IQR, độ lệch, độ nhọn; lợi suất có đuôi dày, biến động tụm lại.', 'Hệ thống xu hướng lệch phải; bán quyền chọn/đảo chiều lệch trái.', 'Luật số lớn: lợi thế nhỏ cần nhiều lệnh; CLT → SE = σ/√n.', 'Tín hiệu có giá trị khi xác suất có điều kiện khác đáng kể xác suất cơ sở.', 'Bootstrap tạo phân phối mẫu thực nghiệm.', 'Lợi suất log, xử lý ngoại lai đúng cách, khử xu hướng, dùng lợi suất cho tính dừng.'],
    terms: [['Skewness', 'Độ lệch'], ['Kurtosis', 'Độ nhọn'], ['Law of large numbers', 'Luật số lớn'], ['Conditional probability', 'Xác suất có điều kiện'], ['Base rate', 'Xác suất cơ sở'], ['Log return', 'Lợi suất log'], ['Interquartile range', 'Khoảng tứ phân vị']]
  }, {
    goals: ['Describe financial data and distribution features.', 'Apply probability, LLN and CLT to trading results.', 'Understand sampling distributions and bootstrapping.', 'Prepare data: log returns, outliers, detrending.'],
    body: () => `
<h3>1. Descriptive statistics</h3><p>Mean/median, σ/IQR, skewness (trend systems positive; option selling negative), kurtosis (fat tails). Daily returns: near-zero mean, slight negative skew, high kurtosis, volatility clustering.</p>${H.retDist()}
<h3>2. Probability</h3><ul><li>LLN: small edges need many trades.</li><li>CLT: SE = σ/√n.</li><li>Conditional vs base-rate probability.</li></ul><div class="callout">Base rate 53%, signal 56% on 400 → SE ≈ 2.5%, difference ≈ 1.2 SE — not enough.</div>
<h3>3. Sampling distributions and bootstrap</h3><p>Resample with replacement thousands of times to obtain an empirical distribution.</p>
<h3>4. Data preparation</h3><ul><li>Log returns.</li><li>Outliers: errors vs real events.</li><li>Detrend before evaluating rules.</li><li>Use returns for stationarity.</li></ul>`,
    keys: ['Descriptives.', 'Skew by strategy.', 'LLN and CLT.', 'Base rates.', 'Bootstrap.', 'Data preparation.'],
    terms: [['Kurtosis', 'Tail heaviness'], ['Base rate', 'Unconditional probability']]
  }, [
    ['Trung vị được ưa dùng hơn trung bình khi:', 'The median is preferred over the mean when:', ['Dữ liệu có ngoại lai', 'Dữ liệu hoàn toàn chuẩn', 'Không có dữ liệu', 'Luôn luôn'], ['Data have outliers', 'Data are perfectly normal', 'No data', 'Always'], 0, '', ''],
    ['Độ lệch dương của phân phối lợi nhuận lệnh nghĩa là:', 'Positive skew of trade returns means:', ['Đuôi phải dài — vài lệnh lãi rất lớn', 'Đuôi trái dài', 'Đối xứng', 'Không lệnh lỗ'], ['A long right tail — a few huge winners', 'Long left tail', 'Symmetric', 'No losers'], 0, '', ''],
    ['Chiến lược bán quyền chọn thường có phân phối:', 'Option-selling strategies typically have:', ['Độ lệch âm — nhiều lãi nhỏ, thỉnh thoảng lỗ rất lớn', 'Độ lệch dương', 'Đối xứng', 'Không rủi ro'], ['Negative skew — many small wins, rare huge losses', 'Positive skew', 'Symmetric', 'No risk'], 0, '', ''],
    ['Độ nhọn dư > 0 cho thấy:', 'Excess kurtosis > 0 shows:', ['Đuôi dày — sự kiện cực đoan thường hơn chuẩn', 'Đuôi mỏng', 'Phân phối đều', 'Không biến động'], ['Fat tails — extremes more frequent than normal', 'Thin tails', 'Uniform', 'No volatility'], 0, '', ''],
    ['Đặc điểm điển hình của lợi suất ngày của chỉ số cổ phiếu:', 'Typical features of daily index returns:', ['Trung bình gần 0, đuôi dày, biến động tụm lại', 'Trung bình lớn, đuôi mỏng', 'Phân phối đều', 'Không biến động'], ['Near-zero mean, fat tails, volatility clustering', 'Large mean, thin tails', 'Uniform', 'No volatility'], 0, '', ''],
    ['Luật số lớn hàm ý với nhà giao dịch:', 'The law of large numbers implies for traders:', ['Lợi thế nhỏ chỉ hiện ra sau nhiều lệnh', 'Một lệnh đủ để đánh giá', 'Không cần thống kê', 'Lệnh càng ít càng chính xác'], ['A small edge only shows after many trades', 'One trade suffices', 'No statistics needed', 'Fewer trades are more accurate'], 0, '', ''],
    ['Theo CLT, sai số chuẩn của trung bình với σ = 3%, n = 900:', 'By the CLT, SE of the mean with σ 3%, n 900:', ['0.1%', '0.3%', '3%', '0.01%'], null, 0, '3/30.', ''],
    ['Tín hiệu có giá trị khi:', 'A signal is valuable when:', ['Xác suất có điều kiện khác đáng kể xác suất cơ sở', 'Xác suất có điều kiện = xác suất cơ sở', 'Xuất hiện nhiều', 'Có tên đẹp'], ['Its conditional probability differs materially from the base rate', 'It equals the base rate', 'It is frequent', 'It has a nice name'], 0, '', ''],
    ['Thị trường tăng 55% số tuần; tín hiệu cho 57% tuần tăng sau đó trên 100 tín hiệu. Kết luận:', 'Market up 55% of weeks; signal 57% on 100 signals. Conclusion:', ['Chưa đủ bằng chứng (chênh lệch < 1 SE ≈ 5%)', 'Tín hiệu rất mạnh', 'Tín hiệu vô dụng chắc chắn', 'Không tính được'], ['Not enough evidence (gap < 1 SE ≈ 5%)', 'Very strong', 'Surely useless', 'Uncomputable'], 0, 'SE ≈ √(0.55×0.45/100) ≈ 5%.', ''],
    ['Bootstrap tạo phân phối mẫu bằng cách:', 'Bootstrapping builds a sampling distribution by:', ['Lấy mẫu lại có hoàn lại từ dữ liệu nhiều lần', 'Giả định phân phối chuẩn', 'Thêm dữ liệu tương lai', 'Bỏ ngoại lai'], ['Resampling with replacement many times', 'Assuming normality', 'Adding future data', 'Removing outliers'], 0, '', ''],
    ['Ưu điểm của bootstrap:', 'An advantage of bootstrapping:', ['Không cần giả định dạng phân phối', 'Luôn cho kết quả lạc quan', 'Không cần dữ liệu', 'Bỏ qua phụ thuộc'], ['No distributional assumption needed', 'Always optimistic', 'No data needed', 'Ignores dependence safely'], 0, '', ''],
    ['Lợi suất log có ưu điểm:', 'Log returns have the advantage of:', ['Cộng được theo thời gian', 'Luôn dương', 'Bằng giá', 'Không cần giá'], ['Being additive over time', 'Always positive', 'Equal to price', 'Needing no prices'], 0, '', ''],
    ['Giá từ 100 lên 110 rồi về 100. Tổng lợi suất log:', 'Price 100 → 110 → 100. Sum of log returns:', ['0', '+10%', '−10%', '+1%'], null, 0, '', ''],
    ['Một ngày giảm 10% của chỉ số được xác nhận là sự kiện thật. Nên:', 'A verified real −10% index day should be:', ['Giữ lại — đó chính là rủi ro cần đo', 'Xoá khỏi dữ liệu', 'Thay bằng trung bình', 'Nhân đôi'], ['Kept — it is the risk you must measure', 'Deleted', 'Replaced by the mean', 'Doubled'], 0, '', ''],
    ['Giá đóng cửa bị nhập sai thêm một số 0. Nên:', 'A close mistyped with an extra zero should be:', ['Sửa lỗi dữ liệu', 'Giữ lại', 'Tính là cú sốc', 'Bỏ qua'], ['Corrected', 'Kept', 'Counted as a shock', 'Ignored'], 0, '', ''],
    ['Khoảng tứ phân vị (IQR) là thước đo phân tán:', 'The interquartile range is a dispersion measure that is:', ['Bền với ngoại lai', 'Rất nhạy với ngoại lai', 'Đo trung tâm', 'Đo tương quan'], ['Robust to outliers', 'Very outlier-sensitive', 'A central measure', 'A correlation'], 0, '', ''],
    ['Vì sao phân tích thống kê nên dùng lợi suất thay vì giá?', 'Why analyse returns rather than prices?', ['Lợi suất gần dừng hơn', 'Giá luôn dừng', 'Lợi suất lớn hơn', 'Không lý do'], ['Returns are closer to stationary', 'Prices are stationary', 'Returns are bigger', 'No reason'], 0, '', ''],
    ['Biến động tụm lại nghĩa là:', 'Volatility clustering means:', ['Ngày biến động lớn thường theo sau ngày biến động lớn', 'Biến động cố định', 'Ngẫu nhiên đều', 'Không có biến động'], ['Large moves tend to follow large moves', 'Constant volatility', 'Uniform randomness', 'No volatility'], 0, '', ''],
    ['Trung bình nhạy với ngoại lai vì:', 'The mean is outlier-sensitive because:', ['Mọi giá trị đều được cộng với trọng số như nhau', 'Chỉ dùng giá trị giữa', 'Bỏ qua cực trị', 'Không đúng'], ['Every value is summed with equal weight', 'Uses only middle values', 'Ignores extremes', 'False'], 0, '', ''],
    ['Khử xu hướng trước khi đánh giá quy tắc nhằm:', 'Detrending before evaluating a rule aims to:', ['Loại bỏ thiên lệch vị thế', 'Tăng lợi nhuận', 'Tăng độ nhọn', 'Không mục đích'], ['Remove position bias', 'Raise returns', 'Raise kurtosis', 'No purpose'], 0, '', ''],
    ['Phân phối mẫu của lợi nhuận trung bình hẹp lại khi:', 'The sampling distribution of the mean narrows as:', ['n tăng', 'n giảm', 'σ tăng', 'Không bao giờ'], ['n increases', 'n decreases', 'σ increases', 'Never'], 0, '', ''],
    ['Xác suất có điều kiện P(tăng | RSI < 30 trong xu hướng tăng) dùng để:', 'P(up | RSI < 30 in an uptrend) is used to:', ['Đánh giá giá trị của điều kiện so với xác suất cơ sở', 'Tính phí', 'Đo khối lượng', 'Không gì'], ['Assess the condition’s value versus the base rate', 'Compute fees', 'Measure volume', 'Nothing'], 0, '', ''],
    ['Tỷ lệ thắng 60% trên 20 lệnh đáng tin hơn hay kém hơn 60% trên 500 lệnh?', 'Is a 60% win rate on 20 trades more or less reliable than on 500?', ['Kém tin cậy hơn nhiều (SE ≈ 11% so với ≈ 2.2%)', 'Đáng tin hơn', 'Như nhau', 'Không so được'], ['Much less reliable (SE ≈ 11% vs ≈ 2.2%)', 'More reliable', 'Equal', 'Incomparable'], 0, '', ''],
    ['Hệ thống có độ lệch âm và độ nhọn cao cần chú ý:', 'A negatively skewed, high-kurtosis system needs attention to:', ['Rủi ro lỗ đuôi hiếm nhưng rất lớn', 'Không gì', 'Lãi đuôi', 'Phí'], ['Rare but very large tail losses', 'Nothing', 'Tail gains', 'Fees'], 0, '', ''],
    ['Yếu vị (mode) là:', 'The mode is:', ['Giá trị xuất hiện nhiều nhất', 'Giá trị giữa', 'Trung bình', 'Độ lệch'], ['The most frequent value', 'The middle value', 'The mean', 'Skew'], 0, '', ''],
    ['Thống kê mô tả trả lời câu hỏi:', 'Descriptive statistics answer:', ['"Dữ liệu đang có trông như thế nào?"', '"Tổng thể ra sao?"', '"Quy tắc có lợi thế không?"', '"Ngày mai giá bao nhiêu?"'], ['"What do our data look like?"', '"What is the population?"', '"Does the rule have an edge?"', '"What is tomorrow’s price?"'], 0, '', ''],
    ['Vì sao dùng lợi suất log khi tổng hợp nhiều kỳ?', 'Why use log returns when aggregating periods?', ['Tổng lợi suất log bằng lợi suất log của cả giai đoạn', 'Luôn dương', 'Dễ đọc hơn %', 'Không lý do'], ['Their sum equals the whole-period log return', 'Always positive', 'Easier than %', 'No reason'], 0, '', ''],
    ['Giả định chuẩn cho lợi suất ngày sẽ:', 'Assuming normal daily returns will:', ['Đánh giá thấp tần suất ngày biến động cực đoan', 'Đánh giá cao', 'Chính xác hoàn toàn', 'Không ảnh hưởng'], ['Underestimate the frequency of extreme days', 'Overestimate it', 'Be exact', 'No effect'], 0, '', ''],
    ['Thống kê được tính từ mẫu dùng để ước lượng:', 'Statistics computed from a sample estimate:', ['Tham số của tổng thể', 'Phí giao dịch', 'Lãi suất', 'Không gì'], ['Population parameters', 'Fees', 'Rates', 'Nothing'], 0, '', ''],
    ['Bước đầu tiên khi phân tích một chuỗi kết quả giao dịch:', 'The first step analysing a trade series:', ['Mô tả phân phối (trung bình, σ, độ lệch, độ nhọn, ngoại lai)', 'Kết luận ngay', 'Tăng vị thế', 'Xoá lệnh thua'], ['Describe its distribution (mean, σ, skew, kurtosis, outliers)', 'Conclude at once', 'Increase size', 'Delete losers'], 0, '', '']
  ]);

  /* ================= L3-07 ================= */
  C.addLesson('l3-07', {
    goals: ['Thiết lập và thực hiện kiểm định giả thuyết cho một quy tắc giao dịch.', 'Chọn kiểm định một phía hay hai phía, diễn giải p-value và lực kiểm định.', 'Xây dựng khoảng tin cậy bằng công thức và bằng bootstrap.', 'Diễn giải kết quả trong bối cảnh kiểm định bội và ý nghĩa kinh tế.'],
    body: () => `
<h3>1. Khung kiểm định</h3>
<ol><li><b>H₀</b>: lợi nhuận kỳ vọng (đã khử xu hướng) của quy tắc ≤ 0. <b>H₁</b>: &gt; 0.</li>
<li>Mức ý nghĩa α (thường 5%; nghiêm hơn khi thử nhiều quy tắc).</li>
<li>Thống kê kiểm định và phân phối của nó khi H₀ đúng (t, bootstrap, hoán vị).</li>
<li>Quyết định và diễn giải.</li></ol>
<h3>2. Một phía hay hai phía?</h3>
<p>Nhà giao dịch chỉ quan tâm quy tắc <b>tốt hơn</b> 0 → kiểm định <b>một phía</b> (ngưỡng t ≈ 1.645 ở 5% với n lớn). Kiểm định hai phía (≈ 1.96) dùng khi quan tâm cả hai hướng khác biệt. Quyết định này phải được đưa ra <b>trước</b> khi xem dữ liệu.</p>
<h3>3. p-value và lực kiểm định</h3>
<ul><li>p-value là xác suất có kết quả ít nhất cực đoan như vậy <b>nếu H₀ đúng</b> — không phải xác suất quy tắc tốt.</li>
<li><b>Lực</b> (1 − β) tăng khi: lợi thế thật lớn hơn, n lớn hơn, nhiễu (σ) nhỏ hơn, α lớn hơn. Lợi thế nhỏ trong dữ liệu nhiễu cần rất nhiều quan sát mới phát hiện được.</li></ul>
<div class="callout"><b>Ví dụ</b>: quy tắc có lợi nhuận trung bình 0.04%/ngày (đã khử xu hướng), σ 1.2%, n = 2.500 ngày. SE = 1.2/50 = 0.024%. t = 1.67 &gt; 1.645 → có ý nghĩa ở 5% (một phía), vừa đủ. Khoảng tin cậy 90% hai phía: 0.04 ± 1.645 × 0.024 = <b>0.0005% … 0.079%</b> — rất rộng tương đối so với ước lượng.</div>
${H.tCalc()}
<h3>4. Khoảng tin cậy</h3>
<ul><li><b>Công thức</b>: ước lượng ± t* × SE — giả định gần chuẩn.</li>
<li><b>Bootstrap</b>: lấy mẫu lại nhiều lần, lấy phân vị 2.5% và 97.5% của thống kê → khoảng tin cậy 95% không cần giả định chuẩn.</li>
<li>Khoảng tin cậy chứa nhiều thông tin hơn p-value: cho biết <b>độ lớn</b> và <b>độ không chắc chắn</b> của lợi thế. Nếu cận dưới vẫn dương sau chi phí, lợi thế có ý nghĩa kinh tế.</li></ul>
<h3>5. Kiểm định hoán vị Monte Carlo</h3>
<p>Ghép ngẫu nhiên vị thế của quy tắc với lợi suất (đã khử xu hướng) hàng nghìn lần, tính lợi nhuận mỗi lần. p-value = tỷ lệ số lần ngẫu nhiên đạt kết quả ≥ thực tế. Ưu điểm: không giả định phân phối; giữ nguyên số ngày mua/bán của quy tắc.</p>
<h3>6. Diễn giải đúng</h3>
<ul><li>Đã thử nhiều quy tắc → điều chỉnh cho kiểm định bội (Level 2, Bài 36).</li>
<li>Ý nghĩa thống kê ≠ ý nghĩa kinh tế: kiểm tra sau chi phí, khả năng thực hiện, ổn định qua giai đoạn con.</li>
<li>Không bác bỏ H₀ ≠ chứng minh quy tắc vô dụng; có thể lực kiểm định quá thấp.</li></ul>
${H.dmCalc()}`,
    keys: ['H₀: lợi nhuận đã khử xu hướng ≤ 0; chọn α, thống kê, phân phối khi H₀ đúng.', 'Nhà giao dịch thường dùng kiểm định một phía; quyết định trước khi xem dữ liệu.', 'p-value: xác suất kết quả cực đoan nếu H₀ đúng; lực tăng theo lợi thế, n, α và giảm theo σ.', 'Khoảng tin cậy (công thức hoặc bootstrap) cho biết độ lớn và độ không chắc chắn.', 'Hoán vị Monte Carlo: không giả định phân phối.', 'Điều chỉnh kiểm định bội; ý nghĩa kinh tế; không bác bỏ ≠ vô dụng.'],
    terms: [['One-tailed test', 'Kiểm định một phía'], ['Power', 'Lực kiểm định'], ['Bootstrap confidence interval', 'Khoảng tin cậy bootstrap'], ['Permutation test', 'Kiểm định hoán vị'], ['Economic significance', 'Ý nghĩa kinh tế']]
  }, {
    goals: ['Set up and run a hypothesis test for a rule.', 'Choose one/two-tailed; read p-values and power.', 'Build formula and bootstrap CIs.', 'Interpret with multiple testing and economics in mind.'],
    body: () => `
<h3>1. Framework</h3><ol><li>H₀: detrended expected return ≤ 0.</li><li>α.</li><li>Statistic and null distribution.</li><li>Decide and interpret.</li></ol>
<h3>2. Tails</h3><p>Traders care about better-than-zero → one-tailed (≈ 1.645). Decide before seeing data.</p>
<h3>3. p-values and power</h3><p>p is P(data this extreme | H₀), not P(rule good). Power rises with edge size, n, α; falls with noise.</p><div class="callout">0.04%/day, σ 1.2%, n 2,500 → SE 0.024%, t 1.67 — barely significant; 90% CI ≈ 0.0005%…0.079%.</div>${H.tCalc()}
<h3>4. Confidence intervals</h3><ul><li>Estimate ± t*·SE.</li><li>Bootstrap percentiles.</li><li>CIs show size and uncertainty; check the lower bound after costs.</li></ul>
<h3>5. Permutation tests</h3><p>Randomly pair positions with detrended returns; p = share of shuffles ≥ actual.</p>
<h3>6. Interpretation</h3><ul><li>Adjust for multiple tests.</li><li>Economic significance.</li><li>Non-rejection may mean low power.</li></ul>${H.dmCalc()}`,
    keys: ['Framework.', 'One-tailed.', 'p and power.', 'CIs.', 'Permutation.', 'Interpretation.'],
    terms: [['Power', '1 − β'], ['Permutation test', 'Shuffle-based null distribution']]
  }, [
    ['H₀ phù hợp khi kiểm định một quy tắc mua:', 'A suitable H₀ when testing a long rule:', ['Lợi nhuận kỳ vọng đã khử xu hướng ≤ 0', 'Quy tắc luôn lãi', 'Lợi nhuận = thị trường', 'Không có H₀'], ['Detrended expected return ≤ 0', 'The rule always profits', 'Return = market', 'No H₀'], 0, '', ''],
    ['Vì sao nhà giao dịch thường dùng kiểm định một phía?', 'Why do traders usually use one-tailed tests?', ['Chỉ quan tâm quy tắc tốt hơn 0', 'Dễ tính hơn', 'Bắt buộc', 'Không đúng'], ['They only care whether the rule beats zero', 'Easier', 'Mandatory', 'False'], 0, '', ''],
    ['Ngưỡng t một phía ở 5% với n lớn:', 'One-tailed 5% critical t with large n:', ['1.282', '1.645', '1.96', '2.576'], null, 1, '', ''],
    ['Quyết định một phía hay hai phía nên được đưa ra:', 'One- vs two-tailed should be decided:', ['Trước khi xem dữ liệu', 'Sau khi xem kết quả', 'Ngẫu nhiên', 'Không cần'], ['Before seeing the data', 'After seeing results', 'Randomly', 'Never'], 0, '', ''],
    ['p-value = 0.02 có nghĩa:', 'p = 0.02 means:', ['Nếu H₀ đúng, chỉ 2% khả năng có kết quả cực đoan như vậy', 'Quy tắc có 98% khả năng tốt', 'H₀ đúng 2%', 'Lợi nhuận 2%'], ['If H₀ were true, results this extreme occur 2% of the time', '98% chance the rule is good', 'H₀ true 2%', '2% return'], 0, '', ''],
    ['Lực kiểm định tăng khi:', 'Power increases when:', ['Lợi thế thật lớn hơn và n lớn hơn', 'σ lớn hơn', 'n nhỏ hơn', 'α nhỏ hơn'], ['The true edge and n are larger', 'σ is larger', 'n is smaller', 'α is smaller'], 0, '', ''],
    ['Mean 0.05%/ngày, σ 1%, n = 1.600. SE =', 'Mean 0.05%/day, σ 1%, n 1,600. SE =', ['0.025%', '0.0625%', '0.05%', '1%'], null, 0, '1/40.', ''],
    ['Tiếp câu trên, t =', 'Continuing, t =', ['0.5', '1.25', '2', '20'], null, 2, '0.05/0.025.', ''],
    ['Tiếp câu trên, ở mức 5% một phía, kết luận:', 'Continuing, at 5% one-tailed:', ['Bác bỏ H₀', 'Không bác bỏ', 'Không xác định', 'Cần thêm α'], ['Reject H₀', 'Do not reject', 'Undetermined', 'Need more α'], 0, '', ''],
    ['Khoảng tin cậy bootstrap 95% được lấy từ:', 'A 95% bootstrap CI is taken from:', ['Phân vị 2.5% và 97.5% của thống kê qua các lần lấy mẫu lại', 'Trung bình ± 1', 'Giá trị lớn nhất và nhỏ nhất', 'Không có'], ['The 2.5th and 97.5th percentiles of resampled statistics', 'Mean ± 1', 'Max and min', 'None'], 0, '', ''],
    ['Khoảng tin cậy có ưu điểm hơn p-value vì:', 'CIs beat p-values because they show:', ['Cho biết độ lớn và độ không chắc chắn của lợi thế', 'Luôn hẹp hơn', 'Không cần dữ liệu', 'Không có'], ['The size and uncertainty of the edge', 'Always narrower', 'No data needed', 'Nothing'], 0, '', ''],
    ['Khoảng tin cậy 95% của lợi nhuận/lệnh là −0.1% … +0.9%. Kết luận ở 5% hai phía:', '95% CI of return/trade is −0.1%…+0.9%. At 5% two-tailed:', ['Không bác bỏ H₀ (khoảng chứa 0)', 'Bác bỏ H₀', 'Quy tắc lỗ chắc chắn', 'Không xác định'], ['Do not reject H₀ (contains 0)', 'Reject H₀', 'Surely losing', 'Undetermined'], 0, '', ''],
    ['Cận dưới khoảng tin cậy dương nhưng nhỏ hơn chi phí mỗi lệnh. Ý nghĩa kinh tế:', 'CI lower bound positive but below per-trade costs. Economic significance:', ['Chưa chắc chắn — có thể không có lãi sau chi phí', 'Chắc chắn có lãi', 'Không liên quan', 'Rất mạnh'], ['Uncertain — may not profit after costs', 'Surely profitable', 'Irrelevant', 'Very strong'], 0, '', ''],
    ['Kiểm định hoán vị Monte Carlo giữ nguyên:', 'A Monte Carlo permutation test preserves:', ['Số ngày mua/bán của quy tắc nhưng phá liên hệ thời điểm', 'Thời điểm tín hiệu', 'Lợi nhuận thực của quy tắc', 'Không gì'], ['The rule’s count of long/short days while breaking timing links', 'Signal timing', 'Actual returns', 'Nothing'], 0, '', ''],
    ['500/10.000 lần hoán vị đạt kết quả ≥ thực tế. p-value =', '500 of 10,000 permutations ≥ actual. p =', ['0.005', '0.05', '0.5', '5'], null, 1, '', ''],
    ['Không bác bỏ H₀ với n = 40 lệnh có thể do:', 'Failing to reject H₀ with 40 trades may be due to:', ['Lực kiểm định thấp', 'Quy tắc chắc chắn vô dụng', 'α quá lớn', 'Dữ liệu quá nhiều'], ['Low power', 'Surely useless rule', 'α too large', 'Too much data'], 0, '', ''],
    ['Sai lầm loại II là:', 'A Type II error is:', ['Không bác bỏ H₀ khi quy tắc thật sự có lợi thế', 'Bác bỏ H₀ đúng', 'Lỗi dữ liệu', 'Phí'], ['Not rejecting H₀ when the rule truly has an edge', 'Rejecting a true H₀', 'Data error', 'Fees'], 0, '', ''],
    ['Thử 50 quy tắc rồi báo cáo quy tắc tốt nhất với p = 0.03 mà không điều chỉnh:', 'Testing 50 rules and reporting the best with p 0.03 unadjusted:', ['Kết luận dễ là sai lầm loại I', 'Hoàn toàn hợp lệ', 'Lực quá cao', 'Không vấn đề'], ['The conclusion is likely a Type I error', 'Fully valid', 'Power too high', 'No issue'], 0, '', ''],
    ['Ngưỡng t hai phía 5% với n lớn:', 'Two-tailed 5% critical t, large n:', ['1.645', '1.96', '2.33', '3'], null, 1, '', ''],
    ['Lợi thế nhỏ trong dữ liệu nhiễu cần:', 'A small edge in noisy data needs:', ['Rất nhiều quan sát để phát hiện', 'Ít quan sát', 'Không cần kiểm định', 'α = 0'], ['Many observations to detect', 'Few observations', 'No testing', 'α = 0'], 0, '', ''],
    ['Khoảng tin cậy rộng cho biết:', 'A wide confidence interval indicates:', ['Ước lượng rất không chắc chắn', 'Ước lượng rất chính xác', 'Lợi thế lớn', 'Không gì'], ['A very uncertain estimate', 'Very precise estimate', 'A large edge', 'Nothing'], 0, '', ''],
    ['Ưu điểm của kiểm định hoán vị so với kiểm định t:', 'Permutation tests’ advantage over t-tests:', ['Không cần giả định phân phối chuẩn', 'Luôn bác bỏ H₀', 'Nhanh hơn', 'Không cần dữ liệu'], ['No normality assumption', 'Always reject H₀', 'Faster', 'No data'], 0, '', ''],
    ['Kiểm tra ổn định qua giai đoạn con nhằm:', 'Checking stability across sub-periods aims to:', ['Đảm bảo lợi thế không chỉ đến từ một giai đoạn', 'Tăng n', 'Giảm phí', 'Không gì'], ['Ensure the edge isn’t from one period only', 'Raise n', 'Cut fees', 'Nothing'], 0, '', ''],
    ['Tăng α từ 5% lên 10% sẽ:', 'Raising α from 5% to 10% will:', ['Tăng lực nhưng tăng sai lầm loại I', 'Giảm cả hai sai lầm', 'Không ảnh hưởng', 'Giảm lực'], ['Raise power but also Type I errors', 'Cut both errors', 'No effect', 'Lower power'], 0, '', ''],
    ['Khoảng tin cậy 90% so với 95% (cùng dữ liệu):', '90% vs 95% CI (same data):', ['Hẹp hơn', 'Rộng hơn', 'Bằng', 'Không so được'], ['Narrower', 'Wider', 'Equal', 'Incomparable'], 0, '', ''],
    ['Thống kê kiểm định khi dùng bootstrap cho H₀ cần dữ liệu:', 'For a bootstrap null, the data must be:', ['Đặt về trung bình 0 (phù hợp H₀)', 'Giữ nguyên trung bình dương', 'Nhân đôi', 'Không xử lý'], ['Zero-centred (consistent with H₀)', 'Kept at positive mean', 'Doubled', 'Untreated'], 0, '', ''],
    ['"Quy tắc có ý nghĩa thống kê" không đồng nghĩa với:', '"Statistically significant" does not mean:', ['Có lãi sau chi phí và thực hiện được', 'Bác bỏ H₀', 'p < α', 'Có bằng chứng'], ['Profitable after costs and executable', 'Rejecting H₀', 'p < α', 'Evidence'], 0, '', ''],
    ['t = 1.4 với n = 3.000 ngày gợi ý:', 't = 1.4 over 3,000 days suggests:', ['Lợi thế (nếu có) rất nhỏ so với nhiễu', 'Lợi thế rất lớn', 'Dữ liệu ít', 'Lỗi'], ['Any edge is tiny relative to noise', 'A huge edge', 'Little data', 'Error'], 0, '', ''],
    ['Quy trình kiểm định đúng đắn cần:', 'A sound testing process needs:', ['Định nghĩa trước H₀, α, phía kiểm định và điều chỉnh cho số quy tắc đã thử', 'Chọn α sau khi xem kết quả', 'Bỏ qua chi phí', 'Chỉ báo cáo quy tắc tốt'], ['Predefined H₀, α, tails and adjustment for rules tried', 'Choosing α after results', 'Ignoring costs', 'Reporting only winners'], 0, '', ''],
    ['Mục tiêu cuối cùng của kiểm định giả thuyết với nhà PTKT:', 'The ultimate goal of hypothesis testing for technicians:', ['Phân biệt lợi thế thật với may mắn trước khi mạo hiểm vốn', 'Chứng minh mọi quy tắc tốt', 'Làm báo cáo đẹp', 'Không có'], ['Separate real edges from luck before risking capital', 'Prove every rule good', 'Pretty reports', 'None'], 0, '', '']
  ]);
})(window.LLW);
