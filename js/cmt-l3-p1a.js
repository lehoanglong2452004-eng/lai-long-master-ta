/* CMT Level 3 — Part 1a, lessons 1–4: risk management I. Written by Lai Long Master TA in its own words. */
(function (L) {
  'use strict';
  const C = L.cmt, H = C.demoHtml;

  /* ---------- calculator: position sizing (fixed fractional, volatility, Kelly) ---------- */
  H.sizeCalc = () => C.calcShell('sizeCalc', `${C.num('eq', 500, L.T('Vốn (triệu)', 'Equity (M)'), 10)}${C.num('rk', 1, L.T('Rủi ro/lệnh %', 'Risk/trade %'), 0.25)}${C.num('px', 50, L.T('Giá vào (nghìn đ)', 'Entry (k VND)'), 0.1)}${C.num('atr', 1.5, L.T('ATR (nghìn đ)', 'ATR (k VND)'), 0.1)}${C.num('m', 2, L.T('Dừng = k×ATR', 'Stop = k×ATR'), 0.5)}${C.num('w', 45, L.T('Tỷ lệ thắng %', 'Win %'), 1)}${C.num('r', 2, L.T('Lãi TB/Lỗ TB', 'Payoff'), 0.1)}`,
    L.T('Ba cách định cỡ vị thế: rủi ro cố định theo %, theo biến động (ATR), và tỷ lệ Kelly.', 'Three sizing views: fixed-fractional risk, volatility (ATR) stop, and Kelly.'));
  C.demoRun.sizeCalc = box => {
    const run = () => {
      const g = c => +box.querySelector('.' + c).value, eq = g('eq') * 1e6, risk = eq * g('rk') / 100, stop = g('atr') * g('m');
      const sh = stop > 0 ? Math.floor(risk / (stop * 1000)) : 0, val = sh * g('px') * 1000, w = g('w') / 100, R = g('r') || 1e-9, kelly = w - (1 - w) / R;
      const ex = w * R - (1 - w);
      box.querySelector('.demo-out').innerHTML = L.T(`Rủi ro mỗi lệnh = <b>${(risk / 1e6).toFixed(2)} triệu</b>. Khoảng dừng = ${stop.toFixed(2)} (giá dừng ≈ ${(g('px') - stop).toFixed(2)}). Khối lượng = <b>${sh.toLocaleString()}</b> cổ phiếu, giá trị ≈ ${(val / 1e6).toFixed(1)} triệu (${(val / eq * 100).toFixed(0)}% vốn${val > eq ? ' — <b>vượt vốn, cần đòn bẩy hoặc giảm rủi ro</b>' : ''}).<br>Kỳ vọng = ${ex.toFixed(2)}R/lệnh. Kelly f* = W − (1−W)/R = <b>${(kelly * 100).toFixed(1)}%</b>${kelly <= 0 ? ' → <b>không có lợi thế, không nên giao dịch</b>' : ` (thực tế thường dùng ¼–½ Kelly ≈ ${(kelly * 25).toFixed(1)}–${(kelly * 50).toFixed(1)}% vì Kelly đầy đủ có sụt giảm rất lớn và tham số ước lượng sai)`}.`,
        `Risk per trade = <b>${(risk / 1e6).toFixed(2)}M</b>. Stop distance = ${stop.toFixed(2)} (stop ≈ ${(g('px') - stop).toFixed(2)}). Size = <b>${sh.toLocaleString()}</b> shares, value ≈ ${(val / 1e6).toFixed(1)}M (${(val / eq * 100).toFixed(0)}% of equity${val > eq ? ' — <b>exceeds equity</b>' : ''}).<br>Expectancy = ${ex.toFixed(2)}R. Kelly f* = W − (1−W)/R = <b>${(kelly * 100).toFixed(1)}%</b>${kelly <= 0 ? ' → <b>no edge, do not trade</b>' : ` (practitioners use ¼–½ Kelly ≈ ${(kelly * 25).toFixed(1)}–${(kelly * 50).toFixed(1)}%)`}.`);
    };
    box.querySelectorAll('.d-num').forEach(i => { i.oninput = run; });
    run();
  };

  /* ---------- calculator: drawdown recovery and risk of ruin ---------- */
  H.ddCalc = () => C.calcShell('ddCalc', `${C.num('dd', 30, L.T('Sụt giảm %', 'Drawdown %'), 5)}${C.num('w', 50, L.T('Tỷ lệ thắng %', 'Win %'), 1)}${C.num('r', 1.5, L.T('Lãi/Lỗ', 'Payoff'), 0.1)}${C.num('f', 2, L.T('Rủi ro/lệnh %', 'Risk/trade %'), 0.5)}${C.num('lim', 40, L.T('Ngưỡng "phá sản" %', 'Ruin level %'), 5)}`);
  C.demoRun.ddCalc = box => {
    const run = () => {
      const g = c => +box.querySelector('.' + c).value, dd = Math.min(99, g('dd')) / 100, need = (1 / (1 - dd) - 1) * 100;
      const w = g('w') / 100, R = g('r'), f = g('f') / 100, lim = g('lim') / 100;
      let ruin = 0; const N = 3000, T = 300;
      for (let k = 0; k < N; k++) { let e = 1; for (let i = 0; i < T; i++) { e *= Math.random() < w ? 1 + f * R : 1 - f; if (e <= 1 - lim) { ruin++; break; } } }
      box.querySelector('.demo-out').innerHTML = L.T(`Sụt giảm ${(dd * 100).toFixed(0)}% cần lãi <b>${need.toFixed(1)}%</b> để về đỉnh cũ. Mô phỏng ${N.toLocaleString()} chuỗi × ${T} lệnh: xác suất chạm mức mất ${(lim * 100).toFixed(0)}% vốn ≈ <b>${(ruin / N * 100).toFixed(1)}%</b> với rủi ro ${(f * 100).toFixed(1)}%/lệnh. Thử tăng rủi ro/lệnh để thấy xác suất "phá sản" tăng phi tuyến.`,
        `A ${(dd * 100).toFixed(0)}% drawdown needs <b>${need.toFixed(1)}%</b> to recover. Simulating ${N} paths × ${T} trades: chance of hitting −${(lim * 100).toFixed(0)}% ≈ <b>${(ruin / N * 100).toFixed(1)}%</b> at ${(f * 100).toFixed(1)}% risk per trade. Raise the risk to see ruin rise nonlinearly.`);
    };
    box.querySelectorAll('.d-num').forEach(i => { i.oninput = run; });
    run();
  };

  /* ================= L3-01 ================= */
  C.addLesson('l3-01', {
    goals: ['Chọn kiến trúc hệ thống phù hợp với thị trường, khung thời gian và tính cách người giao dịch.', 'Thiết kế đầy đủ các thành phần: vào, ra, bộ lọc, định cỡ, quản lý rủi ro.', 'So sánh các loại lệnh thoát và tác động của chúng tới phân phối lợi nhuận.', 'Ra quyết định giữ, sửa hay bỏ một hệ thống dựa trên bằng chứng.'],
    body: () => `
<h3>1. Hai họ hệ thống chính</h3>
<table class="tbl"><thead><tr><th></th><th>Theo xu hướng</th><th>Đảo chiều về trung bình</th></tr></thead><tbody>
<tr><td>Giả định</td><td>Giá đã chạy thì có xu hướng tiếp tục</td><td>Giá lệch xa thì có xu hướng quay lại</td></tr>
<tr><td>Tỷ lệ thắng</td><td>Thấp (30–45%)</td><td>Cao (55–75%)</td></tr>
<tr><td>Lãi/lỗ trung bình</td><td>Cao (lãi lớn bù nhiều lỗ nhỏ)</td><td>Thấp hoặc &lt; 1</td></tr>
<tr><td>Phân phối lợi nhuận</td><td>Lệch phải — vài lệnh rất lớn</td><td>Lệch trái — nhiều lãi nhỏ, thỉnh thoảng lỗ lớn</td></tr>
<tr><td>Rủi ro chính</td><td>Thị trường đi ngang kéo dài, chuỗi thua dài</td><td>Xu hướng mạnh một chiều, "bắt dao rơi"</td></tr>
<tr><td>Tâm lý</td><td>Chịu được nhiều lần thua nhỏ liên tiếp</td><td>Chịu được lỗ lớn hiếm gặp</td></tr></tbody></table>
<p>Hai họ này thường có <b>tương quan thấp</b> với nhau; kết hợp chúng trong một danh mục có thể làm đường vốn mượt hơn.</p>
<h3>2. Các thành phần của hệ thống hoàn chỉnh</h3>
<ol><li><b>Bộ lọc chế độ</b>: thị trường đang xu hướng hay đi ngang (ADX, ER, giá so với MA dài)? Chỉ kích hoạt hệ thống phù hợp.</li>
<li><b>Điều kiện vào</b>: breakout, cắt MA, kéo về trong xu hướng, quá bán trong xu hướng tăng…</li>
<li><b>Điều kiện ra</b> — quan trọng hơn điều kiện vào trong việc định hình lợi nhuận.</li>
<li><b>Định cỡ vị thế</b> (Bài 2).</li>
<li><b>Giới hạn rủi ro danh mục</b> (Bài 5).</li></ol>
<h3>3. Các loại lệnh thoát</h3>
<table class="tbl"><thead><tr><th>Loại</th><th>Ưu điểm</th><th>Nhược điểm</th></tr></thead><tbody>
<tr><td>Dừng lỗ ban đầu (cố định, theo ATR, theo cấu trúc)</td><td>Giới hạn lỗ mỗi lệnh, cơ sở để định cỡ</td><td>Quá gần → bị quét bởi nhiễu</td></tr>
<tr><td>Dừng động (trailing: ATR, đáy N phiên, chandelier)</td><td>Để lãi chạy, bảo vệ lợi nhuận</td><td>Trả lại một phần lợi nhuận</td></tr>
<tr><td>Mục tiêu lợi nhuận</td><td>Tăng tỷ lệ thắng</td><td>Cắt mất các lệnh lớn — hại hệ thống xu hướng</td></tr>
<tr><td>Thoát theo thời gian</td><td>Giải phóng vốn khỏi lệnh "không đi đâu"</td><td>Có thể thoát ngay trước khi giá chạy</td></tr>
<tr><td>Dừng hoà vốn</td><td>Cảm giác an toàn</td><td>Thường làm giảm kỳ vọng nếu dời quá sớm</td></tr>
<tr><td>Tín hiệu ngược</td><td>Luôn có vị thế (hệ thống đảo chiều)</td><td>Lỗ lớn nếu tín hiệu ngược đến chậm</td></tr></tbody></table>
<p>Dùng <b>MAE</b> (mức lỗ tạm thời lớn nhất trong lệnh) của các lệnh thắng để đặt dừng lỗ: nếu hầu hết lệnh thắng chưa bao giờ đi ngược quá 1.5 ATR, đặt dừng ở khoảng 2 ATR sẽ ít cắt nhầm lệnh tốt.</p>
<h3>4. Hệ thống phải phù hợp với người dùng</h3>
<p>Hệ thống tốt nhất trên giấy là vô dụng nếu người giao dịch không thể tuân thủ khi gặp chuỗi 12 lệnh thua. Hãy chọn tần suất giao dịch, mức sụt giảm và tỷ lệ thắng mà bạn <b>chịu được</b>.</p>
${H.trendSys()}
<h3>5. Giữ, sửa hay bỏ?</h3>
<ul><li>Hiệu suất thực nằm trong phạm vi mô phỏng → <b>giữ</b>, không sửa.</li>
<li>Vượt ngưỡng xấu định trước (ví dụ sụt giảm &gt; phân vị 95%) → <b>tạm dừng, xem xét</b>: chế độ thị trường đã thay đổi? Chi phí thực tăng? Lỗi thực hiện?</li>
<li>Sửa đổi chỉ khi có lý do cấu trúc, và phải kiểm định lại ngoài mẫu.</li></ul>`,
    keys: ['Xu hướng: thắng ít, lãi lớn, lệch phải; đảo chiều: thắng nhiều, lãi nhỏ, lệch trái — tương quan thấp, kết hợp được.', 'Hệ thống hoàn chỉnh: bộ lọc chế độ, vào, ra, định cỡ, giới hạn rủi ro danh mục.', 'Lệnh thoát định hình phân phối lợi nhuận; mục tiêu lợi nhuận hại hệ thống xu hướng.', 'Dùng MAE của lệnh thắng để đặt dừng lỗ.', 'Hệ thống phải phù hợp khả năng chịu đựng của người dùng.', 'Giữ khi trong phạm vi kỳ vọng; tạm dừng khi vượt ngưỡng định trước; sửa chỉ khi có lý do cấu trúc.'],
    terms: [['Regime filter', 'Bộ lọc chế độ thị trường'], ['Chandelier exit', 'Dừng treo (từ đỉnh trừ k×ATR)'], ['Time stop', 'Thoát theo thời gian'], ['MAE / MFE', 'Lỗ tạm thời lớn nhất / lãi tạm thời lớn nhất'], ['Positive skew', 'Lệch phải']]
  }, {
    goals: ['Choose a system architecture fitting market, timeframe and trader.', 'Design all components.', 'Compare exits.', 'Decide keep/modify/abandon with evidence.'],
    body: () => `
<h3>1. Two families</h3><table class="tbl"><tbody><tr><td>Trend following</td><td>low win rate, high payoff, positive skew; risk: long ranges</td></tr><tr><td>Mean reversion</td><td>high win rate, low payoff, negative skew; risk: strong trends</td></tr></tbody></table><p>Low mutual correlation — combine them.</p>
<h3>2. Components</h3><ol><li>Regime filter</li><li>Entry</li><li>Exit</li><li>Sizing</li><li>Portfolio risk limits</li></ol>
<h3>3. Exits</h3><p>Initial stops, trailing stops, profit targets (hurt trend systems), time stops, breakeven stops, reversal signals. Use winners’ MAE to place stops.</p>
<h3>4. Fit the trader</h3><p>A system you cannot follow through a 12-loss streak is useless.</p>${H.trendSys()}
<h3>5. Keep or change?</h3><ul><li>Within simulated range → keep.</li><li>Beyond predefined limits → pause and review.</li><li>Change only for structural reasons, then retest out of sample.</li></ul>`,
    keys: ['Two families.', 'Components.', 'Exits shape returns.', 'MAE stops.', 'Fit the trader.', 'Keep/pause/modify.'],
    terms: [['MAE', 'Maximum adverse excursion'], ['Regime filter', 'Trend vs range switch']]
  }, [
    ['Hệ thống theo xu hướng điển hình có phân phối lợi nhuận:', 'A typical trend system’s return distribution is:', ['Lệch phải — vài lệnh lãi rất lớn', 'Lệch trái', 'Đối xứng hoàn hảo', 'Đều'], ['Positively skewed — a few very large winners', 'Negatively skewed', 'Perfectly symmetric', 'Uniform'], 0, '', ''],
    ['Rủi ro chính của hệ thống đảo chiều về trung bình:', 'The main risk of a mean-reversion system:', ['Xu hướng mạnh một chiều — lỗ lớn hiếm gặp', 'Thị trường đi ngang', 'Quá nhiều lệnh thắng', 'Không có'], ['Strong one-way trends — rare large losses', 'Sideways markets', 'Too many winners', 'None'], 0, '', ''],
    ['Vì sao kết hợp hệ thống xu hướng và đảo chiều có thể có lợi?', 'Why combine trend and mean-reversion systems?', ['Chúng thường tương quan thấp → đường vốn mượt hơn', 'Tăng phí', 'Chúng giống hệt nhau', 'Không có lợi'], ['They are often lowly correlated → smoother equity', 'Higher fees', 'They are identical', 'No benefit'], 0, '', ''],
    ['Thêm mục tiêu lợi nhuận cố định vào hệ thống theo xu hướng thường:', 'Adding a fixed profit target to a trend system usually:', ['Tăng tỷ lệ thắng nhưng cắt mất các lệnh lớn, giảm kỳ vọng', 'Tăng kỳ vọng mạnh', 'Không ảnh hưởng', 'Giảm tỷ lệ thắng'], ['Raises win rate but cuts the big winners, lowering expectancy', 'Sharply raises expectancy', 'No effect', 'Lowers win rate'], 0, '', ''],
    ['Bộ lọc chế độ thị trường dùng để:', 'A regime filter is used to:', ['Chỉ kích hoạt hệ thống phù hợp với trạng thái xu hướng/đi ngang', 'Tăng đòn bẩy', 'Đặt mục tiêu', 'Tính phí'], ['Activate only the system suited to trend/range conditions', 'Raise leverage', 'Set targets', 'Compute fees'], 0, '', ''],
    ['Chandelier exit đặt dừng ở:', 'A chandelier exit places the stop at:', ['Đỉnh cao nhất kể từ khi vào trừ k × ATR', 'Giá vào trừ 1%', 'MA 200', 'Đáy hôm qua'], ['Highest high since entry minus k × ATR', 'Entry minus 1%', '200-MA', 'Yesterday’s low'], 0, '', ''],
    ['MAE là:', 'MAE is:', ['Mức lỗ tạm thời lớn nhất trong thời gian giữ lệnh', 'Lãi lớn nhất', 'Phí giao dịch', 'Biên độ ngày'], ['The largest open loss during a trade', 'Largest gain', 'Fees', 'Daily range'], 0, '', ''],
    ['90% lệnh thắng có MAE < 1.2 ATR. Dừng lỗ hợp lý là khoảng:', '90% of winners have MAE < 1.2 ATR. A sensible stop is about:', ['0.5 ATR', '1.5–2 ATR', '10 ATR', 'Không dùng dừng'], ['0.5 ATR', '1.5–2 ATR', '10 ATR', 'No stop'], 1, 'Đủ xa để không cắt nhầm lệnh tốt, đủ gần để giới hạn lỗ.', ''],
    ['Thoát theo thời gian phù hợp nhất khi:', 'A time stop fits best when:', ['Lệnh không phát triển sau một số phiên dự kiến, chiếm dụng vốn', 'Lệnh đang lãi mạnh', 'Thị trường đóng cửa', 'Không bao giờ'], ['A trade fails to develop and ties up capital', 'A trade is strongly profitable', 'Markets close', 'Never'], 0, '', ''],
    ['Dời dừng về hoà vốn quá sớm thường:', 'Moving a stop to breakeven too early usually:', ['Làm tăng số lệnh bị quét và giảm kỳ vọng', 'Luôn tăng lợi nhuận', 'Không ảnh hưởng', 'Giảm số lệnh thua lớn về 0'], ['Increases stop-outs and lowers expectancy', 'Always raises profit', 'No effect', 'Removes big losses entirely'], 0, '', ''],
    ['Thành phần nào định hình phân phối lợi nhuận nhiều nhất?', 'Which component shapes the return distribution most?', ['Quy tắc thoát lệnh', 'Màu biểu đồ', 'Tên hệ thống', 'Thời điểm kiểm định'], ['Exit rules', 'Chart colours', 'System name', 'Test date'], 0, '', ''],
    ['Tình huống: hệ thống xu hướng sụt giảm 18%, phân vị 95% Monte Carlo là 25%. Nên:', 'Case: a trend system is down 18%; 95th-percentile simulated DD is 25%. You should:', ['Tiếp tục theo hệ thống — vẫn trong phạm vi kỳ vọng', 'Bỏ hệ thống ngay', 'Tăng gấp đôi rủi ro để gỡ', 'Thêm mục tiêu lợi nhuận'], ['Keep following — still within expectations', 'Abandon at once', 'Double risk to recover', 'Add targets'], 0, '', ''],
    ['Tình huống: sụt giảm 32% (vượt phân vị 95% = 25%). Bước đầu tiên:', 'Case: drawdown 32% (beyond 95th pct 25%). First step:', ['Tạm dừng và xem xét chế độ thị trường, chi phí, lỗi thực hiện', 'Tối ưu lại tham số trên dữ liệu gần nhất rồi chạy tiếp', 'Tăng đòn bẩy', 'Không làm gì'], ['Pause and review regime, costs and execution', 'Re-optimise on recent data and continue', 'Add leverage', 'Do nothing'], 0, '', ''],
    ['Người giao dịch không chịu được chuỗi thua dài nên ưu tiên:', 'A trader who can’t tolerate long losing streaks should favour:', ['Hệ thống tỷ lệ thắng cao (với kiểm soát lỗ lớn)', 'Hệ thống xu hướng dài hạn', 'Không quản lý rủi ro', 'Đòn bẩy cao'], ['High-win-rate systems (with tail-loss control)', 'Long-term trend systems', 'No risk control', 'High leverage'], 0, '', ''],
    ['Hệ thống đảo chiều luôn có vị thế (stop and reverse) có nhược điểm:', 'An always-in stop-and-reverse system’s drawback:', ['Lỗ lớn nếu tín hiệu ngược đến chậm', 'Không bao giờ giao dịch', 'Không có lỗ', 'Phí bằng 0'], ['Large losses if the reverse signal is late', 'Never trades', 'No losses', 'Zero fees'], 0, '', ''],
    ['Dừng động (trailing stop) nhằm:', 'A trailing stop aims to:', ['Để lãi chạy đồng thời bảo vệ lợi nhuận đã có', 'Tăng lỗ', 'Thoát sớm nhất có thể', 'Không mục đích'], ['Let profits run while protecting gains', 'Increase losses', 'Exit ASAP', 'No purpose'], 0, '', ''],
    ['Đặt dừng lỗ quá gần thường dẫn tới:', 'Stops placed too close usually lead to:', ['Bị quét bởi nhiễu, tỷ lệ thắng giảm', 'Lỗ mỗi lệnh lớn hơn', 'Lợi nhuận tăng chắc chắn', 'Không ảnh hưởng'], ['Noise stop-outs, lower win rate', 'Bigger per-trade losses', 'Certain profit', 'No effect'], 0, '', ''],
    ['MFE của một lệnh là:', 'A trade’s MFE is:', ['Mức lãi tạm thời lớn nhất trong lệnh', 'Mức lỗ lớn nhất', 'Giá vào', 'Thời gian giữ'], ['Its largest open profit', 'Largest loss', 'Entry', 'Holding time'], 0, '', ''],
    ['Lệnh có MFE lớn nhưng kết thúc lỗ thường xuyên gợi ý:', 'Trades with large MFE often ending as losers suggest:', ['Cần quy tắc bảo vệ lợi nhuận/dừng động tốt hơn', 'Dừng lỗ quá xa', 'Hệ thống hoàn hảo', 'Tăng vị thế'], ['Better profit protection/trailing rules are needed', 'Stops too wide', 'A perfect system', 'Bigger size'], 0, '', ''],
    ['Hệ thống đảo chiều về trung bình nên dùng bộ lọc nào để tránh "bắt dao rơi"?', 'Which filter helps mean reversion avoid catching falling knives?', ['Chỉ mua quá bán khi xu hướng dài hạn tăng (giá trên MA dài)', 'Mua mọi lúc RSI < 30', 'Không lọc', 'Mua khi ADX > 50 trong xu hướng giảm'], ['Only buy oversold when the long-term trend is up', 'Buy any RSI < 30', 'No filter', 'Buy when ADX > 50 in downtrends'], 0, '', ''],
    ['Vì sao điều kiện ra quan trọng hơn điều kiện vào?', 'Why do exits matter more than entries?', ['Chúng quyết định độ lớn lãi và lỗ', 'Vì vào lệnh ngẫu nhiên', 'Không đúng', 'Do luật'], ['They determine the size of wins and losses', 'Entries are random', 'False', 'Law'], 0, '', ''],
    ['Hệ thống đảo chiều có phân phối lệch trái nghĩa là:', 'A left-skewed mean-reversion system means:', ['Nhiều lãi nhỏ, thỉnh thoảng lỗ lớn', 'Nhiều lỗ nhỏ, vài lãi lớn', 'Đối xứng', 'Không lỗ'], ['Many small wins, occasional large loss', 'Many small losses, few big wins', 'Symmetric', 'No losses'], 0, '', ''],
    ['Khi nào nên sửa quy tắc hệ thống?', 'When should system rules be changed?', ['Khi có lý do cấu trúc rõ ràng và đã kiểm định lại ngoài mẫu', 'Sau mỗi lệnh thua', 'Khi cảm thấy lo lắng', 'Hằng tuần'], ['With a clear structural reason and fresh out-of-sample testing', 'After each loss', 'When anxious', 'Weekly'], 0, '', ''],
    ['Bộ lọc ADX > 25 cho hệ thống breakout nhằm:', 'An ADX > 25 filter for a breakout system aims to:', ['Chỉ giao dịch khi thị trường có xu hướng', 'Giao dịch khi đi ngang', 'Tăng số lệnh', 'Không mục đích'], ['Trade only in trending conditions', 'Trade ranges', 'More trades', 'No purpose'], 0, '', ''],
    ['Hệ thống có tỷ lệ thắng 35% và lãi/lỗ 2.5:', 'A system with 35% wins and 2.5 payoff:', ['Có kỳ vọng dương 0.225R', 'Kỳ vọng âm', 'Kỳ vọng bằng 0', 'Không tính được'], ['Has positive expectancy 0.225R', 'Negative', 'Zero', 'Uncomputable'], 0, '0.35 × 2.5 − 0.65 = 0.225.', ''],
    ['Dừng lỗ theo cấu trúc (dưới đáy gần nhất) có ưu điểm:', 'A structural stop (below the last swing low) has the advantage of:', ['Gắn với mức mà giả thuyết giao dịch bị vô hiệu', 'Luôn gần nhất', 'Không cần biểu đồ', 'Cố định %'], ['Being tied to where the trade idea is invalidated', 'Always closest', 'No chart needed', 'Fixed %'], 0, '', ''],
    ['Tần suất giao dịch cao đòi hỏi:', 'High trading frequency requires:', ['Chi phí thấp và thực hiện tốt', 'Phí cao', 'Không cần dữ liệu', 'Dừng lỗ xa'], ['Low costs and good execution', 'High fees', 'No data', 'Wide stops'], 0, '', ''],
    ['Tình huống: hệ thống breakout lỗ liên tục 9 lần khi VNINDEX đi ngang 3 tháng (trong phạm vi kỳ vọng). Hành động hợp lý:', 'Case: a breakout system loses 9 straight in a 3-month VNINDEX range (within expectations). Sensible action:', ['Tuân thủ hệ thống; cân nhắc bộ lọc chế độ đã kiểm định cho tương lai', 'Đổi sang hệ thống khác ngay', 'Tăng vị thế', 'Bỏ dừng lỗ'], ['Stay disciplined; consider a tested regime filter going forward', 'Switch systems immediately', 'Increase size', 'Drop stops'], 0, '', ''],
    ['Hệ thống tốt nhất trên giấy là vô dụng nếu:', 'The best paper system is useless if:', ['Người giao dịch không thể tuân thủ nó', 'Có lãi', 'Có ít tham số', 'Đã kiểm định'], ['The trader cannot follow it', 'It profits', 'It has few parameters', 'It was tested'], 0, '', ''],
    ['Giới hạn rủi ro danh mục cần thiết vì:', 'Portfolio risk limits are needed because:', ['Nhiều vị thế tương quan có thể cùng lỗ một lúc', 'Mỗi lệnh độc lập tuyệt đối', 'Không cần', 'Để tăng phí'], ['Correlated positions can lose together', 'Trades are fully independent', 'Unneeded', 'Fees'], 0, '', '']
  ]);

  /* ================= L3-02 ================= */
  C.addLesson('l3-02', {
    goals: ['Phân biệt quản lý vốn (định cỡ) và quản lý rủi ro.', 'Tính và so sánh rủi ro cố định theo %, theo biến động, tỷ lệ cố định, Kelly, optimal f.', 'Đánh giá rủi ro phá sản và toán học của sụt giảm.', 'Quản lý rủi ro danh mục: tổng rủi ro mở, tương quan, kim tự tháp.'],
    body: () => `
<h3>1. Vì sao định cỡ vị thế quan trọng nhất?</h3>
<p>Cùng một chuỗi tín hiệu, cách định cỡ có thể biến hệ thống thành công thành phá sản. Định cỡ quyết định <b>tốc độ tăng trưởng</b> và <b>độ sâu sụt giảm</b>. Lợi thế (kỳ vọng dương) là điều kiện cần; định cỡ hợp lý là điều kiện đủ để tồn tại.</p>
<h3>2. Toán học của sụt giảm</h3>
<table class="tbl"><thead><tr><th>Sụt giảm</th><th>10%</th><th>20%</th><th>30%</th><th>50%</th><th>75%</th></tr></thead><tbody><tr><td>Lãi cần để hồi phục</td><td>11.1%</td><td>25%</td><td>42.9%</td><td>100%</td><td>300%</td></tr></tbody></table>
<p>Công thức: lãi cần = 1/(1 − DD) − 1. Mất mát lớn cần lãi lớn phi tuyến để gỡ — vì vậy <b>bảo toàn vốn</b> là ưu tiên số một.</p>
<h3>3. Các phương pháp định cỡ</h3>
<table class="tbl"><thead><tr><th>Phương pháp</th><th>Cách tính</th><th>Nhận xét</th></tr></thead><tbody>
<tr><td>Cố định số lượng</td><td>Luôn 1.000 cp / 1 hợp đồng</td><td>Đơn giản; không tăng trưởng kép; rủi ro thay đổi theo biến động</td></tr>
<tr><td><b>Rủi ro cố định theo %</b> (fixed fractional)</td><td>Số lượng = (Vốn × r%) / (Giá vào − Giá dừng)</td><td>Phổ biến nhất; tự giảm quy mô khi thua, tăng khi thắng</td></tr>
<tr><td><b>Theo biến động</b></td><td>Số lượng = (Vốn × r%) / (k × ATR)</td><td>Cân bằng rủi ro giữa các thị trường</td></tr>
<tr><td>Tỷ lệ cố định (fixed ratio)</td><td>Tăng 1 đơn vị khi lợi nhuận tăng thêm "delta" × số đơn vị hiện có</td><td>Tăng trưởng chậm hơn ở quy mô lớn; phù hợp tài khoản nhỏ</td></tr>
<tr><td><b>Kelly</b></td><td>f* = W − (1 − W)/R</td><td>Tối đa hoá tăng trưởng dài hạn về lý thuyết; sụt giảm rất lớn, nhạy với sai số ước lượng</td></tr>
<tr><td>Optimal f</td><td>Tỷ lệ tối ưu hoá lợi nhuận hình học dựa trên lệnh lỗ lớn nhất lịch sử</td><td>Cùng nhược điểm như Kelly; thường dùng một phần</td></tr></tbody></table>
<div class="callout"><b>Ví dụ</b>: vốn 500 triệu, rủi ro 1% = 5 triệu. Mua ở 50.000, ATR 1.500, dừng 2 ATR = 3.000 đ → số cổ phiếu = 5.000.000 / 3.000 ≈ <b>1.666</b> (làm tròn 1.600 theo lô). Kelly với W = 45%, R = 2: f* = 0.45 − 0.55/2 = <b>17.5%</b> — quá lớn cho thực tế; ½ Kelly ≈ 8.75% rủi ro vốn mỗi lệnh vẫn rất mạnh tay; đa số nhà quản lý dùng 0.5–2%.</div>
${H.sizeCalc()}
<h3>4. Martingale và chống martingale</h3>
<ul><li><b>Martingale</b>: tăng quy mô sau khi thua (gấp thếp) — một chuỗi thua đủ dài sẽ phá sản. Tránh.</li>
<li><b>Chống martingale</b>: tăng quy mô khi thắng (vốn tăng), giảm khi thua — cơ chế của rủi ro cố định theo %.</li>
<li><b>Kim tự tháp (pyramiding)</b>: thêm vị thế vào lệnh đang lãi, mỗi lần thêm <b>nhỏ hơn</b> lần trước, và dời dừng lỗ để tổng rủi ro không tăng.</li></ul>
<h3>5. Rủi ro danh mục</h3>
<ul><li><b>Tổng rủi ro mở (portfolio heat)</b>: tổng rủi ro của tất cả vị thế nếu đồng loạt chạm dừng — ví dụ giới hạn 6–10% vốn.</li>
<li><b>Tương quan</b>: 5 cổ phiếu ngân hàng rủi ro 1% mỗi mã gần giống một vị thế 5%. Giới hạn theo nhóm/ngành.</li>
<li><b>Rủi ro phá sản</b> tăng phi tuyến theo rủi ro mỗi lệnh; giảm khi kỳ vọng cao hơn và khi rủi ro mỗi lệnh nhỏ.</li>
<li>Giảm quy mô sau sụt giảm (ví dụ giảm một nửa rủi ro khi sụt giảm &gt; 10%) giúp tồn tại qua giai đoạn xấu.</li></ul>
${H.ddCalc()}`,
    keys: ['Định cỡ quyết định tăng trưởng và độ sâu sụt giảm; lợi thế là cần, định cỡ là đủ.', 'Lãi cần để hồi phục = 1/(1 − DD) − 1 (50% → 100%).', 'Rủi ro cố định %: số lượng = vốn × r% / khoảng dừng; theo biến động dùng k × ATR.', 'Kelly f* = W − (1−W)/R: tối đa tăng trưởng lý thuyết nhưng sụt giảm lớn — dùng một phần.', 'Tránh martingale; chống martingale và kim tự tháp giảm dần.', 'Rủi ro danh mục: tổng rủi ro mở, tương quan/nhóm ngành, giảm quy mô sau sụt giảm.'],
    terms: [['Fixed fractional', 'Rủi ro cố định theo tỷ lệ vốn'], ['Fixed ratio', 'Tỷ lệ cố định'], ['Kelly criterion', 'Tiêu chuẩn Kelly'], ['Optimal f', 'Tỷ lệ f tối ưu'], ['Martingale', 'Gấp thếp'], ['Pyramiding', 'Kim tự tháp / nhồi lệnh thắng'], ['Portfolio heat', 'Tổng rủi ro mở'], ['Risk of ruin', 'Rủi ro phá sản']]
  }, {
    goals: ['Distinguish money and risk management.', 'Compute fixed-fractional, volatility, fixed-ratio, Kelly and optimal-f sizing.', 'Assess risk of ruin and drawdown math.', 'Manage portfolio heat, correlation and pyramiding.'],
    body: () => `
<h3>1. Why sizing matters most</h3><p>Sizing decides growth and drawdown depth; edge is necessary, sizing sufficient.</p>
<h3>2. Drawdown math</h3><p>Required gain = 1/(1 − DD) − 1: 20% → 25%, 50% → 100%, 75% → 300%.</p>
<h3>3. Methods</h3><table class="tbl"><tbody><tr><td>Fixed units</td><td>simple, no compounding</td></tr><tr><td>Fixed fractional</td><td>equity × r% / stop distance</td></tr><tr><td>Volatility</td><td>equity × r% / (k × ATR)</td></tr><tr><td>Fixed ratio</td><td>add a unit per "delta" of profit</td></tr><tr><td>Kelly</td><td>W − (1−W)/R</td></tr><tr><td>Optimal f</td><td>maximises geometric growth vs largest loss</td></tr></tbody></table><div class="callout">500M, 1% risk, stop 3,000 → ~1,666 shares. Kelly (45%, 2) = 17.5% — far too aggressive; most use 0.5–2%.</div>${H.sizeCalc()}
<h3>4. Martingale vs anti-martingale</h3><ul><li>Avoid martingale.</li><li>Anti-martingale scales with equity.</li><li>Pyramid with decreasing adds and raised stops.</li></ul>
<h3>5. Portfolio risk</h3><ul><li>Portfolio heat limits.</li><li>Correlated positions ≈ one bigger position.</li><li>Ruin rises nonlinearly with risk per trade.</li><li>Cut size after drawdowns.</li></ul>${H.ddCalc()}`,
    keys: ['Sizing.', 'Drawdown math.', 'Methods.', 'Kelly caution.', 'Martingale.', 'Portfolio heat.'],
    terms: [['Kelly', 'Growth-optimal fraction'], ['Portfolio heat', 'Total open risk']]
  }, [
    ['Sụt giảm 40% cần lãi bao nhiêu để hồi phục?', 'A 40% drawdown needs what gain to recover?', ['40%', '66.7%', '60%', '100%'], null, 1, '1/0.6 − 1.', ''],
    ['Sụt giảm 25% cần lãi:', 'A 25% drawdown needs:', ['25%', '33.3%', '20%', '50%'], null, 1, '', ''],
    ['Vốn 1 tỷ, rủi ro 1%, giá vào 40.000, dừng 37.500. Số cổ phiếu:', 'Equity 1bn, 1% risk, entry 40,000, stop 37,500. Shares:', ['2.500', '4.000', '10.000', '25.000'], null, 1, '10.000.000 / 2.500 = 4.000.', ''],
    ['Vốn 200 triệu, rủi ro 1.5%, ATR 800, dừng 2.5 ATR. Số cổ phiếu:', 'Equity 200M, 1.5% risk, ATR 800, stop 2.5 ATR. Shares:', ['1.500', '3.000', '6.000', '375'], null, 0, '3.000.000 / 2.000 = 1.500.', ''],
    ['Kelly với W = 55%, R = 1.5:', 'Kelly with W 55%, R 1.5:', ['25%', '55%', '10%', '−5%'], null, 0, '0.55 − 0.45/1.5 = 0.25.', ''],
    ['Kelly âm có nghĩa:', 'A negative Kelly fraction means:', ['Không có lợi thế — không nên giao dịch', 'Nên bán khống gấp đôi', 'Tăng vị thế', 'Lỗi tính toán'], ['No edge — don’t trade', 'Short double', 'Increase size', 'Calculation error'], 0, '', ''],
    ['Vì sao người thực hành thường chỉ dùng một phần Kelly?', 'Why do practitioners use fractional Kelly?', ['Kelly đầy đủ gây sụt giảm rất lớn và nhạy với sai số ước lượng', 'Kelly quá nhỏ', 'Do luật', 'Kelly không tồn tại'], ['Full Kelly brings huge drawdowns and is sensitive to estimation error', 'Kelly is too small', 'Law', 'Kelly doesn’t exist'], 0, '', ''],
    ['Rủi ro cố định theo % là dạng:', 'Fixed fractional sizing is a form of:', ['Chống martingale', 'Martingale', 'Cố định số lượng', 'Không định cỡ'], ['Anti-martingale', 'Martingale', 'Fixed units', 'No sizing'], 0, '', ''],
    ['Martingale (gấp thếp sau khi thua) nguy hiểm vì:', 'Martingale is dangerous because:', ['Một chuỗi thua đủ dài sẽ phá sản tài khoản', 'Lợi nhuận quá nhỏ', 'Không có lệnh thua', 'Do luật'], ['A long enough losing streak bankrupts the account', 'Profits too small', 'No losers', 'Law'], 0, '', ''],
    ['Kim tự tháp đúng cách là:', 'Proper pyramiding is:', ['Thêm vào lệnh đang lãi, lần sau nhỏ hơn lần trước, dời dừng để tổng rủi ro không tăng', 'Thêm vào lệnh đang lỗ', 'Thêm lần sau lớn hơn', 'Không dời dừng'], ['Add to winners, each add smaller, raise stops so total risk doesn’t grow', 'Add to losers', 'Larger adds', 'Never move stops'], 0, '', ''],
    ['Portfolio heat là:', 'Portfolio heat is:', ['Tổng rủi ro nếu mọi vị thế cùng chạm dừng', 'Nhiệt độ thị trường', 'Biến động chỉ số', 'Phí'], ['Total loss if all positions hit their stops', 'Market temperature', 'Index volatility', 'Fees'], 0, '', ''],
    ['Tình huống: 6 cổ phiếu ngân hàng, mỗi mã rủi ro 1%. Nhận xét:', 'Case: six bank stocks at 1% risk each. Assessment:', ['Rủi ro thực gần như một vị thế 6% do tương quan cao — nên giới hạn theo nhóm', 'Đa dạng hoá tốt', 'Rủi ro 1%', 'Không rủi ro'], ['Effectively ~6% in one bet due to high correlation — cap by group', 'Well diversified', '1% risk', 'No risk'], 0, '', ''],
    ['Rủi ro phá sản thay đổi thế nào khi tăng rủi ro mỗi lệnh?', 'How does risk of ruin change as risk per trade rises?', ['Tăng phi tuyến', 'Giảm', 'Không đổi', 'Tuyến tính chính xác'], ['Rises nonlinearly', 'Falls', 'Unchanged', 'Exactly linear'], 0, '', ''],
    ['Định cỡ theo biến động giúp:', 'Volatility-based sizing helps:', ['Cân bằng rủi ro giữa các thị trường có biến động khác nhau', 'Tăng rủi ro ở mã biến động mạnh', 'Bỏ qua dừng lỗ', 'Không gì'], ['Equalise risk across markets of different volatility', 'Raise risk in volatile names', 'Ignore stops', 'Nothing'], 0, '', ''],
    ['Cố định số lượng mỗi lệnh có nhược điểm:', 'Fixed units per trade has the drawback:', ['Không tăng trưởng kép và rủi ro thay đổi theo biến động', 'Quá phức tạp', 'Tăng trưởng quá nhanh', 'Không có'], ['No compounding and risk varies with volatility', 'Too complex', 'Too fast growth', 'None'], 0, '', ''],
    ['Fixed ratio phù hợp hơn với:', 'Fixed ratio suits better:', ['Tài khoản nhỏ muốn tăng quy mô từ từ', 'Quỹ rất lớn', 'Không ai', 'Martingale'], ['Small accounts scaling gradually', 'Very large funds', 'Nobody', 'Martingale'], 0, '', ''],
    ['Optimal f có nhược điểm tương tự Kelly vì:', 'Optimal f shares Kelly’s drawback because:', ['Tối đa tăng trưởng hình học nhưng sụt giảm cực lớn, phụ thuộc lệnh lỗ lớn nhất lịch sử', 'Quá thận trọng', 'Không tính được', 'Không liên quan'], ['It maximises geometric growth with extreme drawdowns, depending on the largest historical loss', 'Too cautious', 'Uncomputable', 'Unrelated'], 0, '', ''],
    ['Giảm một nửa rủi ro mỗi lệnh khi sụt giảm > 10% nhằm:', 'Halving risk per trade after a >10% drawdown aims to:', ['Tăng khả năng tồn tại qua giai đoạn xấu', 'Gỡ nhanh hơn', 'Tăng phí', 'Không mục đích'], ['Improve survival through bad periods', 'Recover faster', 'Raise fees', 'No purpose'], 0, '', ''],
    ['Lợi thế (kỳ vọng dương) và định cỡ: phát biểu đúng là:', 'Edge and sizing — the correct statement:', ['Lợi thế là điều kiện cần, định cỡ hợp lý là điều kiện để tồn tại và tăng trưởng', 'Chỉ cần lợi thế', 'Chỉ cần định cỡ', 'Cả hai không quan trọng'], ['Edge is necessary; sound sizing is needed to survive and grow', 'Edge alone suffices', 'Sizing alone suffices', 'Neither matters'], 0, '', ''],
    ['Tình huống: hệ thống có W = 40%, R = 1.2. Bạn nên:', 'Case: W 40%, R 1.2. You should:', ['Không giao dịch — kỳ vọng âm (−0.12R)', 'Dùng Kelly đầy đủ', 'Tăng rủi ro lên 5%', 'Gấp thếp'], ['Not trade — negative expectancy (−0.12R)', 'Use full Kelly', 'Raise risk to 5%', 'Martingale'], 0, '0.4 × 1.2 − 0.6 = −0.12.', ''],
    ['Với rủi ro cố định %, sau chuỗi thua quy mô vị thế:', 'Under fixed fractional, after losses position size:', ['Tự giảm', 'Tự tăng', 'Không đổi', 'Gấp đôi'], ['Shrinks automatically', 'Grows', 'Unchanged', 'Doubles'], 0, '', ''],
    ['Giới hạn portfolio heat thường gặp:', 'A common portfolio heat limit:', ['6–10% vốn', '50–100% vốn', '0%', '200%'], ['6–10% of equity', '50–100%', '0%', '200%'], 0, '', ''],
    ['Sụt giảm 60% cần lãi:', 'A 60% drawdown requires:', ['60%', '100%', '150%', '240%'], null, 2, '1/0.4 − 1 = 1.5.', ''],
    ['Rủi ro 2%/lệnh, 10 lệnh thua liên tiếp (rủi ro cố định %). Vốn còn khoảng:', '2% risk, 10 straight losses (fixed fractional). Equity left ≈', ['80%', '81.7%', '98%', '60%'], null, 1, '0.98^10 ≈ 0.817.', ''],
    ['Khi kỳ vọng mỗi lệnh tăng (giữ rủi ro/lệnh), rủi ro phá sản:', 'With higher expectancy (same risk/trade), risk of ruin:', ['Giảm', 'Tăng', 'Không đổi', 'Bằng 1'], ['Falls', 'Rises', 'Unchanged', 'One'], 0, '', ''],
    ['Thêm vị thế vào lệnh đang lỗ ("bình quân giá xuống") về bản chất là:', 'Adding to a losing position is essentially:', ['Một dạng martingale, tăng rủi ro', 'Kim tự tháp đúng cách', 'Giảm rủi ro', 'Chống martingale'], ['A form of martingale, raising risk', 'Proper pyramiding', 'Risk reduction', 'Anti-martingale'], 0, '', ''],
    ['Rủi ro 1% với dừng 5% giá. Giá trị vị thế bằng:', '1% risk with a 5% price stop. Position value equals:', ['5% vốn', '20% vốn', '1% vốn', '100% vốn'], ['5% of equity', '20% of equity', '1%', '100%'], 1, '1%/5% = 20%.', ''],
    ['Rủi ro 1% với dừng 0.5% giá cho giá trị vị thế 200% vốn. Vấn đề:', '1% risk with a 0.5% stop gives a 200% position. Issue:', ['Cần đòn bẩy và rủi ro gap vượt dừng rất lớn', 'Không có vấn đề', 'Quá nhỏ', 'Không giao dịch được'], ['Needs leverage and gap risk beyond the stop is large', 'No problem', 'Too small', 'Untradeable'], 0, '', ''],
    ['Quản lý vốn khác quản lý rủi ro ở chỗ:', 'Money management differs from risk management in that:', ['Quản lý vốn quyết định quy mô; quản lý rủi ro bao gồm cả giới hạn, dừng lỗ, tương quan, kịch bản', 'Là một', 'Quản lý vốn chỉ là tiết kiệm', 'Không khác'], ['Money management sets size; risk management also covers limits, stops, correlation, scenarios', 'Identical', 'Money management is saving', 'No difference'], 0, '', ''],
    ['Mục tiêu số một của quản lý vốn:', 'The top goal of money management:', ['Bảo toàn vốn để tồn tại lâu dài', 'Tối đa lợi nhuận một lệnh', 'Giao dịch nhiều nhất', 'Gỡ lỗ nhanh'], ['Preserve capital to survive long term', 'Maximise one trade', 'Trade the most', 'Recover fast'], 0, '', '']
  ]);

  /* ================= L3-03 ================= */
  C.addLesson('l3-03', {
    goals: ['Đánh giá hệ thống bằng bộ thước đo đầy đủ: R-multiple, hiệu quả, chất lượng đường vốn.', 'Phân tích bề mặt tối ưu hoá và độ bền tham số.', 'Thiết kế quy trình kiểm định: trong mẫu, ngoài mẫu, walk-forward, nhiều thị trường.', 'So sánh và kết hợp nhiều hệ thống.'],
    body: () => `
<h3>1. Đo lường theo R</h3>
<p>Biểu diễn mỗi lệnh theo bội số của rủi ro ban đầu (<b>R-multiple</b>): lãi 3 lần rủi ro = +3R, lỗ đúng dừng = −1R. Cách này chuẩn hoá các lệnh có quy mô khác nhau. Kỳ vọng = trung bình R; độ lệch chuẩn của R cho biết độ ổn định. Một chỉ số chất lượng thường dùng: <b>kỳ vọng / độ lệch chuẩn R × √(số lệnh)</b> — giống thống kê t của lợi thế.</p>
<h3>2. Chất lượng đường vốn</h3>
<table class="tbl"><tbody>
<tr><td><b>Sụt giảm tối đa và thời gian sụt giảm dài nhất</b></td><td>Độ sâu và độ dài của "cơn đau"</td></tr>
<tr><td><b>Ulcer index</b></td><td>Căn bậc hai trung bình bình phương % sụt giảm — đo cả độ sâu lẫn thời gian</td></tr>
<tr><td><b>Độ mượt</b></td><td>R² của đường vốn (log) theo thời gian; % tháng/năm có lãi</td></tr>
<tr><td><b>Tỷ lệ lợi nhuận/sụt giảm</b></td><td>MAR, Calmar</td></tr>
<tr><td><b>Phụ thuộc lệnh lớn</b></td><td>% lợi nhuận đến từ top 5 lệnh</td></tr></tbody></table>
<p>Sharpe giả định lợi nhuận đối xứng; với hệ thống lệch phải (xu hướng), Sharpe phạt cả biến động <b>tăng</b> — nên xem cùng Sortino và MAR.</p>
<h3>3. Bề mặt tối ưu hoá</h3>
<ul><li>Vẽ kết quả theo lưới tham số (ví dụ MA nhanh × MA chậm). Một <b>bề mặt mượt</b> với vùng rộng có kết quả tốt cho thấy ý tưởng bền; bề mặt <b>lởm chởm</b> với đỉnh cô lập là dấu hiệu quá khớp.</li>
<li>Chọn tham số ở <b>trung tâm vùng tốt</b>; tốt hơn nữa là dùng <b>nhiều tham số cùng lúc</b> (đa dạng hoá tham số) thay vì một bộ "tối ưu".</li>
<li>Tỷ lệ số tổ hợp có lãi trên toàn lưới là thước đo độ bền đơn giản.</li></ul>
<h3>4. Quy trình kiểm định</h3>
<ol><li>Kiểm định ý tưởng trên dữ liệu trong mẫu với tham số "hợp lý" (chưa tối ưu).</li><li>Kiểm tra bề mặt tham số.</li><li>Walk-forward; tính hiệu quả walk-forward.</li><li>Kiểm định trên <b>nhiều thị trường</b> không dùng khi phát triển.</li><li>Kiểm tra căng thẳng: chi phí gấp đôi, bỏ ngẫu nhiên 10% lệnh, trễ 1 phiên khi vào lệnh.</li><li>Monte Carlo để đặt kỳ vọng sụt giảm và chuỗi thua.</li></ol>
<div class="callout">Một ý tưởng thật sự có lợi thế thường <b>vẫn có lãi</b> khi vào lệnh trễ 1 phiên hoặc thay tham số ±20%. Nếu chỉ một thay đổi nhỏ làm hệ thống từ lãi thành lỗ, lợi thế có thể chỉ là ảo giác của dữ liệu.</div>
<h3>5. So sánh và kết hợp hệ thống</h3>
<ul><li>So sánh trên cùng giai đoạn, cùng chi phí, cùng mức rủi ro (chuẩn hoá theo biến động).</li><li>Đo <b>tương quan của lợi nhuận hằng tháng</b> giữa các hệ thống; kết hợp hệ thống tương quan thấp làm tăng tỷ lệ lợi nhuận/rủi ro của danh mục.</li><li>Một hệ thống "kém" riêng lẻ nhưng tương quan âm với danh mục vẫn có thể đáng giá.</li></ul>
${H.mcSim()}`,
    keys: ['R-multiple chuẩn hoá lệnh; chất lượng ≈ kỳ vọng/σR × √n.', 'Đường vốn: sụt giảm, thời gian sụt giảm, Ulcer index, độ mượt, MAR; Sharpe phạt cả biến động tăng.', 'Bề mặt tối ưu mượt, vùng rộng = bền; đỉnh cô lập = quá khớp; đa dạng hoá tham số.', 'Quy trình: ý tưởng → bề mặt → walk-forward → nhiều thị trường → căng thẳng → Monte Carlo.', 'Kết hợp hệ thống tương quan thấp; đánh giá đóng góp cho danh mục, không chỉ riêng lẻ.'],
    terms: [['R-multiple', 'Bội số rủi ro'], ['Ulcer index', 'Chỉ số Ulcer'], ['Optimisation surface', 'Bề mặt tối ưu hoá'], ['Parameter diversification', 'Đa dạng hoá tham số'], ['Stress test', 'Kiểm tra căng thẳng']]
  }, {
    goals: ['Evaluate with R-multiples and equity-curve quality.', 'Analyse optimisation surfaces.', 'Design a full testing protocol.', 'Compare and combine systems.'],
    body: () => `
<h3>1. R-multiples</h3><p>Trades in units of initial risk; quality ≈ mean R / σR × √n.</p>
<h3>2. Equity-curve quality</h3><p>Max drawdown and duration, Ulcer index, smoothness, MAR, dependence on top trades. Sharpe penalises upside volatility — pair with Sortino and MAR.</p>
<h3>3. Optimisation surfaces</h3><p>Smooth broad plateaus = robust; jagged isolated peaks = overfit. Choose the centre or diversify parameters.</p>
<h3>4. Protocol</h3><ol><li>Idea test</li><li>Surface</li><li>Walk-forward</li><li>Other markets</li><li>Stress (double costs, drop trades, 1-bar delay)</li><li>Monte Carlo</li></ol><div class="callout">Real edges survive a 1-bar delay or ±20% parameter changes.</div>
<h3>5. Combining systems</h3><p>Compare on equal terms; combine low-correlation systems; judge portfolio contribution.</p>${H.mcSim()}`,
    keys: ['R-multiples.', 'Equity quality.', 'Surfaces.', 'Protocol.', 'Combining.'],
    terms: [['Ulcer index', 'Depth-and-duration drawdown measure'], ['R-multiple', 'Profit in units of initial risk']]
  }, [
    ['Lệnh rủi ro 2 triệu, lãi 7 triệu. R-multiple:', 'Risk 2M, profit 7M. R-multiple:', ['+2R', '+3.5R', '+7R', '+5R'], null, 1, '', ''],
    ['Lệnh rủi ro 4 triệu, lỗ 6 triệu (gap qua dừng). R-multiple:', 'Risk 4M, loss 6M (gapped through stop). R-multiple:', ['−1R', '−1.5R', '−6R', '−0.67R'], null, 1, '', ''],
    ['Ưu điểm của R-multiple:', 'The advantage of R-multiples:', ['Chuẩn hoá các lệnh có quy mô khác nhau', 'Tăng lợi nhuận', 'Bỏ qua rủi ro', 'Không có'], ['Normalises trades of different sizes', 'Raises profit', 'Ignores risk', 'None'], 0, '', ''],
    ['Trung bình R = 0.3, σR = 2, 100 lệnh. Chỉ số chất lượng (≈ t) =', 'Mean R 0.3, σR 2, 100 trades. Quality (≈ t) =', ['0.15', '1.5', '15', '0.6'], null, 1, '0.3/2 × 10.', ''],
    ['Ulcer index đo:', 'The Ulcer index measures:', ['Cả độ sâu và thời gian sụt giảm', 'Chỉ lợi nhuận', 'Tỷ lệ thắng', 'Khối lượng'], ['Both depth and duration of drawdowns', 'Only returns', 'Win rate', 'Volume'], 0, '', ''],
    ['Vì sao Sharpe có thể đánh giá thấp hệ thống xu hướng?', 'Why can Sharpe understate trend systems?', ['Phạt cả biến động tăng của các lệnh lãi lớn', 'Bỏ qua lợi nhuận', 'Quá dễ dãi', 'Không đúng'], ['It penalises upside volatility from big winners', 'Ignores returns', 'Too lenient', 'False'], 0, '', ''],
    ['Bề mặt tối ưu mượt với vùng rộng có kết quả tốt cho thấy:', 'A smooth surface with a broad good region shows:', ['Ý tưởng bền với tham số', 'Quá khớp', 'Lỗi dữ liệu', 'Không ý nghĩa'], ['A parameter-robust idea', 'Overfitting', 'Data errors', 'Nothing'], 0, '', ''],
    ['Bề mặt lởm chởm với một đỉnh cô lập cho thấy:', 'A jagged surface with one isolated peak shows:', ['Khả năng quá khớp cao', 'Ý tưởng bền', 'Hệ thống hoàn hảo', 'Cần thêm tham số'], ['Likely overfitting', 'A robust idea', 'A perfect system', 'More parameters needed'], 0, '', ''],
    ['Đa dạng hoá tham số là:', 'Parameter diversification is:', ['Chạy đồng thời nhiều bộ tham số trong vùng tốt', 'Chỉ dùng bộ tối ưu nhất', 'Thay tham số hằng ngày', 'Không dùng tham số'], ['Running several parameter sets from the good region at once', 'Only the optimum', 'Daily changes', 'No parameters'], 0, '', ''],
    ['80% tổ hợp tham số trên lưới đều có lãi gợi ý:', '80% of grid combinations profitable suggests:', ['Ý tưởng có lợi thế bền vững', 'Quá khớp', 'Không ý nghĩa', 'Lỗi'], ['A robust underlying edge', 'Overfitting', 'Nothing', 'Error'], 0, '', ''],
    ['Kiểm tra "vào lệnh trễ 1 phiên" nhằm:', 'A "1-bar delayed entry" test aims to:', ['Kiểm tra lợi thế có phụ thuộc vào thời điểm vào chính xác hay không', 'Tăng lợi nhuận', 'Giảm phí', 'Không mục đích'], ['Check whether the edge depends on exact timing', 'Raise profit', 'Cut fees', 'No purpose'], 0, '', ''],
    ['Hệ thống từ lãi thành lỗ khi đổi MA từ 50 sang 45. Kết luận:', 'A system flips to loss when MA changes from 50 to 45. Conclusion:', ['Lợi thế có thể là ảo giác của dữ liệu', 'Dùng đúng MA 50', 'Hệ thống rất bền', 'Tăng vị thế'], ['The edge may be a data illusion', 'Use exactly 50', 'Very robust', 'Increase size'], 0, '', ''],
    ['Kiểm định trên thị trường không dùng khi phát triển giúp:', 'Testing on markets not used in development helps:', ['Xác nhận ý tưởng mang tính tổng quát', 'Tăng quá khớp', 'Không tác dụng', 'Giảm dữ liệu'], ['Confirm the idea generalises', 'Raise overfitting', 'Nothing', 'Reduce data'], 0, '', ''],
    ['So sánh hai hệ thống công bằng cần:', 'Fairly comparing two systems requires:', ['Cùng giai đoạn, cùng chi phí, chuẩn hoá cùng mức rủi ro', 'Giai đoạn khác nhau', 'Bỏ qua chi phí', 'So lợi nhuận tuyệt đối'], ['Same period, same costs, risk-normalised', 'Different periods', 'Ignore costs', 'Raw profits'], 0, '', ''],
    ['Hệ thống lãi ít riêng lẻ nhưng tương quan âm với danh mục:', 'A modestly profitable system negatively correlated with the portfolio:', ['Có thể rất đáng giá vì cải thiện lợi nhuận/rủi ro của danh mục', 'Nên loại bỏ', 'Vô dụng', 'Làm tăng rủi ro'], ['Can be valuable by improving portfolio risk-return', 'Should be dropped', 'Useless', 'Raises risk'], 0, '', ''],
    ['% lợi nhuận từ top 5 lệnh lên tới 120% tổng lợi nhuận cho thấy:', 'Top 5 trades = 120% of total profit shows:', ['Hệ thống phụ thuộc mạnh vào vài lệnh lớn (đặc trưng hệ thống xu hướng) — cần nhiều dữ liệu để tin', 'Hệ thống đảo chiều', 'Không có rủi ro', 'Lỗi'], ['Heavy dependence on a few big trades (typical of trend systems) — needs lots of data', 'A mean-reversion system', 'No risk', 'Error'], 0, '', ''],
    ['Thời gian sụt giảm dài nhất quan trọng vì:', 'Longest drawdown duration matters because:', ['Thử thách kỷ luật và kiên nhẫn của nhà đầu tư', 'Không quan trọng', 'Chỉ để báo cáo', 'Do luật'], ['It tests investor discipline and patience', 'It doesn’t', 'Reporting only', 'Law'], 0, '', ''],
    ['Độ mượt đường vốn có thể đo bằng:', 'Equity-curve smoothness can be measured by:', ['R² của log đường vốn theo thời gian', 'Số lệnh', 'Phí', 'Giá vào'], ['R² of log equity against time', 'Trade count', 'Fees', 'Entry price'], 0, '', ''],
    ['Bước đầu tiên của quy trình kiểm định hợp lý:', 'The first step of a sound testing protocol:', ['Kiểm định ý tưởng với tham số hợp lý, chưa tối ưu', 'Tối ưu tối đa', 'Giao dịch thật', 'Monte Carlo'], ['Test the idea with sensible, unoptimised parameters', 'Max optimisation', 'Live trading', 'Monte Carlo'], 0, '', ''],
    ['Bỏ ngẫu nhiên 10% lệnh rồi kiểm định lại dùng để:', 'Randomly dropping 10% of trades and retesting is used to:', ['Kiểm tra độ phụ thuộc vào một vài lệnh cụ thể', 'Tăng lợi nhuận', 'Giảm chi phí', 'Không gì'], ['Check dependence on specific trades', 'Raise profit', 'Cut costs', 'Nothing'], 0, '', ''],
    ['Tương quan lợi nhuận hằng tháng giữa hai hệ thống là 0.9. Kết hợp chúng:', 'Monthly return correlation between two systems is 0.9. Combining them:', ['Lợi ích đa dạng hoá rất ít', 'Giảm rủi ro mạnh', 'Loại bỏ sụt giảm', 'Bắt buộc'], ['Gives little diversification', 'Cuts risk a lot', 'Eliminates drawdowns', 'Mandatory'], 0, '', ''],
    ['Kiểm tra căng thẳng "chi phí gấp đôi" thất bại cho thấy:', 'Failing the "double costs" stress test shows:', ['Lợi thế quá mỏng so với chi phí thực tế', 'Hệ thống rất mạnh', 'Phí quá thấp', 'Không ý nghĩa'], ['The edge is too thin versus realistic costs', 'A strong system', 'Fees too low', 'Nothing'], 0, '', ''],
    ['Sortino bổ sung cho Sharpe vì:', 'Sortino complements Sharpe by:', ['Chỉ phạt biến động chiều giảm', 'Phạt cả hai chiều', 'Không dùng rủi ro', 'Dùng beta'], ['Penalising only downside volatility', 'Penalising both', 'Ignoring risk', 'Using beta'], 0, '', ''],
    ['Hệ thống A: CAGR 15%, DD 30%. Hệ thống B: CAGR 10%, DD 12%. Theo MAR:', 'A: CAGR 15%, DD 30%. B: CAGR 10%, DD 12%. By MAR:', ['B tốt hơn (0.83 so với 0.5)', 'A tốt hơn', 'Như nhau', 'Không so được'], ['B is better (0.83 vs 0.5)', 'A is better', 'Equal', 'Not comparable'], 0, '', ''],
    ['Monte Carlo trong đánh giá hệ thống giúp:', 'Monte Carlo in evaluation helps:', ['Đặt kỳ vọng thực tế về sụt giảm và chuỗi thua', 'Tối ưu tham số', 'Thay dữ liệu thật', 'Giảm phí'], ['Set realistic drawdown and streak expectations', 'Optimise parameters', 'Replace real data', 'Cut fees'], 0, '', ''],
    ['Hiệu quả walk-forward 20% cho thấy:', 'Walk-forward efficiency of 20% shows:', ['Hiệu suất ngoài mẫu kém xa trong mẫu — nghi ngờ quá khớp', 'Rất tốt', 'Hoàn hảo', 'Không ý nghĩa'], ['OOS far worse than IS — suspect overfitting', 'Very good', 'Perfect', 'Nothing'], 0, '', ''],
    ['Chuẩn hoá hệ thống theo biến động trước khi so sánh nhằm:', 'Volatility-normalising systems before comparing aims to:', ['So sánh ở cùng mức rủi ro', 'Tăng lợi nhuận', 'Giảm số lệnh', 'Không mục đích'], ['Compare at equal risk', 'Raise profit', 'Fewer trades', 'No purpose'], 0, '', ''],
    ['% tháng có lãi cao nhưng sụt giảm tối đa rất lớn gợi ý:', 'High % profitable months but a huge max drawdown suggests:', ['Phân phối lệch trái — rủi ro đuôi', 'Hệ thống xu hướng điển hình', 'Không rủi ro', 'Lỗi'], ['Left skew — tail risk', 'Typical trend system', 'No risk', 'Error'], 0, '', ''],
    ['Đánh giá hệ thống nên tập trung vào:', 'System evaluation should focus on:', ['Bộ thước đo đầy đủ về lợi nhuận, rủi ro, độ bền và khả năng thực hiện', 'Chỉ lợi nhuận ròng', 'Chỉ tỷ lệ thắng', 'Màu đường vốn'], ['A full set of return, risk, robustness and executability measures', 'Net profit only', 'Win rate only', 'Equity colour'], 0, '', ''],
    ['Tham số nên được chọn ở:', 'Parameters should be chosen at:', ['Trung tâm vùng kết quả tốt', 'Đỉnh cao nhất bất kể xung quanh', 'Biên của lưới', 'Ngẫu nhiên'], ['The centre of the good region', 'The highest peak regardless', 'The grid edge', 'Random'], 0, '', '']
  ]);

  /* ================= L3-04 ================= */
  C.addLesson('l3-04', {
    goals: ['Ước lượng chi phí thực hiện: phí, thuế, trượt giá, tác động thị trường.', 'Xử lý gap, cú sốc giá và rủi ro vượt dừng.', 'Chuẩn bị dữ liệu: hợp đồng tương lai nối, điều chỉnh, lỗi dữ liệu.', 'Đánh giá năng lực (capacity), suy giảm hệ thống và khi nào can thiệp.'],
    body: () => `
<h3>1. Chi phí thực hiện</h3>
<table class="tbl"><thead><tr><th>Chi phí</th><th>Ghi chú</th></tr></thead><tbody>
<tr><td>Phí môi giới, thuế</td><td>Ở Việt Nam: phí mua và bán, thuế 0.1% khi bán cổ phiếu</td></tr>
<tr><td><b>Trượt giá</b></td><td>Chênh lệch giữa giá tín hiệu và giá khớp thực — lớn hơn với lệnh dừng (mua khi giá đang tăng, bán khi đang giảm) và khi thị trường biến động mạnh</td></tr>
<tr><td>Chênh lệch mua–bán</td><td>Lớn ở mã thanh khoản thấp</td></tr>
<tr><td><b>Tác động thị trường</b></td><td>Lệnh lớn so với khối lượng làm giá dịch chuyển bất lợi; tăng theo quy mô</td></tr>
<tr><td>Chi phí vốn, ký quỹ, vay</td><td>Lãi margin, chi phí vay để bán khống</td></tr></tbody></table>
<p>Trong backtest, hãy giả định trượt giá <b>bi quan</b> (ví dụ một phần ATR hoặc vài bước giá), đặc biệt cho lệnh breakout. Hệ thống tần suất cao nhạy nhất với chi phí.</p>
<h3>2. Gap, cú sốc giá và rủi ro vượt dừng</h3>
<ul><li>Dừng lỗ không đảm bảo giá: gap qua đêm, tin bất ngờ, phiên giảm sàn liên tiếp (ở Việt Nam có thể không khớp được) → lỗ thực tế &gt; 1R.</li>
<li><b>Cú sốc giá</b> (biến động ±4–5σ) xảy ra thường xuyên hơn phân phối chuẩn dự báo (đuôi dày). Hãy kiểm tra kết quả hệ thống quanh các ngày sốc: hệ thống ở đúng phía hay sai phía?</li>
<li>Biện pháp: giảm quy mô qua sự kiện (báo cáo, chính sách), đa dạng hoá, quyền chọn bảo vệ (nếu có), giới hạn tổng rủi ro mở.</li></ul>
<h3>3. Dữ liệu</h3>
<ul><li><b>Hợp đồng tương lai nối</b>: nối thô tạo khoảng nhảy giả khi chuyển kỳ hạn; <b>điều chỉnh lùi</b> (back-adjusted) giữ đúng biến động điểm nhưng giá quá khứ có thể âm và % thay đổi bị sai; <b>điều chỉnh theo tỷ lệ</b> giữ đúng % nhưng làm méo điểm. Chọn theo việc hệ thống dùng điểm hay %.</li>
<li>Với VN30F: chú ý ngày đáo hạn (thứ Năm tuần thứ ba) và chênh lệch cơ sở.</li>
<li>Cổ phiếu: điều chỉnh chia tách, cổ tức, phát hành thêm; tránh thiên lệch sống sót.</li>
<li>Lỗi dữ liệu: giá sai, thiếu phiên, đỉnh/đáy bất thường — kiểm tra trước khi tin kết quả.</li></ul>
<h3>4. Thực hiện lệnh</h3>
<ul><li>Lệnh thị trường: chắc khớp, chịu trượt giá. Lệnh giới hạn: kiểm soát giá, có thể không khớp — thường bỏ lỡ đúng các lệnh tốt nhất (giá chạy luôn).</li>
<li>Tín hiệu cuối ngày thực hiện vào phiên sau: dùng giá mở cửa phiên sau trong backtest, không dùng giá đóng cửa hôm tín hiệu.</li>
<li>Biên độ trần/sàn, phiên ATO/ATC, T+2 (T+2.5) ở Việt Nam ảnh hưởng khả năng thoát lệnh.</li></ul>
<h3>5. Năng lực, suy giảm và can thiệp</h3>
<ul><li><b>Năng lực (capacity)</b>: quy mô vốn tối đa trước khi tác động thị trường ăn mòn lợi thế. Hệ thống trên cổ phiếu vốn hoá nhỏ có năng lực thấp.</li>
<li><b>Suy giảm</b>: lợi thế có thể yếu dần khi thị trường thay đổi hoặc bị khai thác đông đúc. Theo dõi hiệu suất lăn so với kỳ vọng.</li>
<li><b>Can thiệp thủ công</b>: chỉ theo quy tắc định trước (ví dụ giảm rủi ro trước sự kiện lớn). Can thiệp tuỳ tiện biến hệ thống đã kiểm định thành hệ thống chưa kiểm định.</li></ul>`,
    keys: ['Chi phí: phí, thuế, trượt giá (lớn với lệnh dừng, thị trường biến động), chênh lệch mua–bán, tác động thị trường, chi phí vốn.', 'Dừng lỗ không đảm bảo giá; cú sốc giá thường gặp hơn phân phối chuẩn; giảm quy mô qua sự kiện, đa dạng hoá, giới hạn rủi ro mở.', 'Hợp đồng nối: điều chỉnh lùi (đúng điểm) vs theo tỷ lệ (đúng %); dữ liệu cổ phiếu điều chỉnh, không sống sót.', 'Backtest vào lệnh ở giá mở cửa phiên sau; giới hạn trần/sàn, T+2 ở Việt Nam.', 'Năng lực, suy giảm, can thiệp chỉ theo quy tắc định trước.'],
    terms: [['Slippage', 'Trượt giá'], ['Market impact', 'Tác động thị trường'], ['Price shock', 'Cú sốc giá'], ['Back-adjusted series', 'Chuỗi điều chỉnh lùi'], ['Ratio-adjusted series', 'Chuỗi điều chỉnh tỷ lệ'], ['Capacity', 'Năng lực vốn của hệ thống'], ['System decay', 'Suy giảm hệ thống']]
  }, {
    goals: ['Estimate execution costs.', 'Handle gaps, shocks and stop slippage.', 'Prepare data: continuous futures, adjustments, errors.', 'Assess capacity, decay and intervention.'],
    body: () => `
<h3>1. Costs</h3><p>Commissions, taxes, slippage (worse for stop orders and fast markets), spreads, market impact, financing. Assume pessimistic slippage.</p>
<h3>2. Gaps and shocks</h3><ul><li>Stops don’t guarantee prices; limit-down sequences may not fill.</li><li>Shocks are more frequent than normal tails imply.</li><li>Reduce size through events, diversify, cap heat.</li></ul>
<h3>3. Data</h3><ul><li>Back-adjusted (correct points) vs ratio-adjusted (correct %).</li><li>VN30F expiries and basis.</li><li>Adjust stocks; avoid survivorship; check errors.</li></ul>
<h3>4. Execution</h3><ul><li>Market vs limit orders.</li><li>EOD signals execute next open.</li><li>Price limits, ATO/ATC, T+2 in Vietnam.</li></ul>
<h3>5. Capacity, decay, intervention</h3><ul><li>Capacity limits.</li><li>Monitor rolling performance.</li><li>Intervene only by predefined rules.</li></ul>`,
    keys: ['Costs.', 'Shocks.', 'Data.', 'Execution.', 'Capacity and decay.'],
    terms: [['Slippage', 'Signal vs fill difference'], ['Capacity', 'Max capital before impact erodes edge']]
  }, [
    ['Trượt giá thường lớn nhất với:', 'Slippage is usually largest for:', ['Lệnh dừng trong thị trường biến động nhanh', 'Lệnh giới hạn trong thị trường yên', 'Không lệnh nào', 'Lệnh huỷ'], ['Stop orders in fast markets', 'Limit orders in calm markets', 'No order', 'Cancelled orders'], 0, '', ''],
    ['Tác động thị trường tăng khi:', 'Market impact rises when:', ['Quy mô lệnh lớn so với khối lượng giao dịch', 'Lệnh nhỏ', 'Thanh khoản cao', 'Không giao dịch'], ['Order size is large relative to volume', 'Orders are small', 'Liquidity is high', 'No trading'], 0, '', ''],
    ['Hệ thống nhạy nhất với chi phí giao dịch:', 'The system most sensitive to costs:', ['Tần suất cao, lợi thế mỗi lệnh nhỏ', 'Dài hạn, ít lệnh', 'Mua và nắm giữ', 'Không giao dịch'], ['High-frequency with small per-trade edge', 'Long-term, few trades', 'Buy and hold', 'No trading'], 0, '', ''],
    ['Dừng lỗ có đảm bảo giá thực hiện không?', 'Does a stop-loss guarantee the fill price?', ['Không — gap và giảm sàn có thể làm lỗ vượt 1R', 'Có, luôn luôn', 'Chỉ ở Việt Nam', 'Chỉ với crypto'], ['No — gaps and limit-downs can push losses beyond 1R', 'Yes, always', 'Only in Vietnam', 'Only crypto'], 0, '', ''],
    ['Cú sốc giá ±5σ xảy ra:', '±5σ price shocks occur:', ['Thường hơn nhiều so với dự báo của phân phối chuẩn', 'Không bao giờ', 'Đúng như phân phối chuẩn', 'Chỉ mỗi thế kỷ'], ['Far more often than the normal distribution predicts', 'Never', 'Exactly as normal', 'Once a century'], 0, '', ''],
    ['Chuỗi hợp đồng tương lai điều chỉnh lùi (back-adjusted):', 'A back-adjusted futures series:', ['Giữ đúng thay đổi theo điểm nhưng % quá khứ có thể sai, giá có thể âm', 'Giữ đúng %', 'Không có khoảng nhảy và đúng mọi thứ', 'Là giá thực tế quá khứ'], ['Preserves point changes, but past % can be wrong and prices negative', 'Preserves %', 'Perfect in all respects', 'Actual past prices'], 0, '', ''],
    ['Hệ thống dùng % thay đổi và dừng theo % nên dùng chuỗi:', 'A system using % changes and % stops should use:', ['Điều chỉnh theo tỷ lệ', 'Điều chỉnh lùi', 'Nối thô', 'Không dữ liệu'], ['Ratio-adjusted', 'Back-adjusted', 'Raw spliced', 'No data'], 0, '', ''],
    ['Nối thô các hợp đồng tương lai gây:', 'Raw splicing of futures causes:', ['Khoảng nhảy giả khi chuyển kỳ hạn → tín hiệu sai', 'Dữ liệu hoàn hảo', 'Không ảnh hưởng', 'Ít dữ liệu'], ['Artificial roll gaps → false signals', 'Perfect data', 'No effect', 'Less data'], 0, '', ''],
    ['Tín hiệu xuất hiện lúc đóng cửa. Backtest nên vào lệnh ở:', 'Signal at the close. The backtest should enter at:', ['Giá mở cửa phiên sau', 'Giá đóng cửa cùng phiên tín hiệu (nếu không thực hiện được trong ATC)', 'Đáy phiên sau', 'Đỉnh phiên trước'], ['Next session’s open', 'Same close (if not executable in ATC)', 'Next low', 'Prior high'], 0, '', ''],
    ['Lệnh giới hạn khi vào lệnh breakout có nhược điểm:', 'Limit orders for breakout entries have the drawback:', ['Thường bỏ lỡ đúng các lệnh tốt nhất (giá chạy luôn)', 'Trượt giá lớn', 'Luôn khớp', 'Không có'], ['They often miss the best trades (price runs away)', 'Large slippage', 'Always fill', 'None'], 0, '', ''],
    ['Ở thị trường Việt Nam, yếu tố nào làm khó thoát lệnh trong cú sốc?', 'In Vietnam, what hampers exits in a shock?', ['Giới hạn biên độ sàn và chu kỳ thanh toán', 'Không có giới hạn', 'Giao dịch 24/7', 'Không phí'], ['Price-limit floors and settlement cycle', 'No limits', '24/7 trading', 'No fees'], 0, '', ''],
    ['Năng lực (capacity) của hệ thống là:', 'A system’s capacity is:', ['Quy mô vốn tối đa trước khi tác động thị trường ăn mòn lợi thế', 'Số lệnh tối đa', 'Số tham số', 'Dung lượng máy tính'], ['Max capital before market impact erodes the edge', 'Max trades', 'Parameters', 'Computer storage'], 0, '', ''],
    ['Hệ thống giao dịch cổ phiếu vốn hoá nhỏ thường có:', 'A small-cap stock system usually has:', ['Năng lực thấp', 'Năng lực vô hạn', 'Không trượt giá', 'Chi phí bằng 0'], ['Low capacity', 'Unlimited capacity', 'No slippage', 'Zero cost'], 0, '', ''],
    ['Can thiệp thủ công hợp lý khi:', 'Manual intervention is reasonable when:', ['Theo quy tắc định trước, ví dụ giảm rủi ro trước sự kiện lớn', 'Cảm thấy lo', 'Sau mỗi lệnh thua', 'Khi đọc tin đồn'], ['It follows predefined rules, e.g. cut risk before major events', 'Feeling anxious', 'After every loss', 'On rumours'], 0, '', ''],
    ['Can thiệp tuỳ tiện vào hệ thống đã kiểm định biến nó thành:', 'Arbitrary intervention turns a tested system into:', ['Một hệ thống chưa kiểm định', 'Hệ thống tốt hơn chắc chắn', 'Không ảnh hưởng', 'Hệ thống vô rủi ro'], ['An untested system', 'A surely better one', 'No change', 'Riskless'], 0, '', ''],
    ['Thuế bán cổ phiếu ở Việt Nam (cá nhân) là khoảng:', 'Vietnam’s individual stock-sale tax is about:', ['0.1% giá trị bán', '10% lợi nhuận', '0%', '1%'], ['0.1% of sale value', '10% of profit', '0%', '1%'], 0, '', ''],
    ['Giả định trượt giá trong backtest nên:', 'Backtest slippage assumptions should be:', ['Bi quan, đặc biệt với lệnh breakout', 'Bằng 0', 'Lạc quan', 'Bỏ qua'], ['Pessimistic, especially for breakouts', 'Zero', 'Optimistic', 'Ignored'], 0, '', ''],
    ['Suy giảm hệ thống có thể do:', 'System decay may result from:', ['Thay đổi cấu trúc thị trường hoặc bị khai thác đông đúc', 'Màu biểu đồ', 'Máy tính chậm', 'Không bao giờ'], ['Structural change or crowding', 'Chart colours', 'Slow computer', 'Never'], 0, '', ''],
    ['Tình huống: sắp có quyết định lãi suất quan trọng, danh mục đang có tổng rủi ro mở 9%. Theo quy tắc định trước, bạn nên:', 'Case: a key rate decision is due; open heat is 9%. Per predefined rules you should:', ['Giảm quy mô/tổng rủi ro mở trước sự kiện', 'Tăng đòn bẩy', 'Bỏ toàn bộ dừng lỗ', 'Không làm gì dù có quy tắc'], ['Reduce size/heat before the event', 'Add leverage', 'Remove all stops', 'Ignore the rule'], 0, '', ''],
    ['Kiểm tra hệ thống quanh các ngày sốc giá nhằm:', 'Checking results around shock days aims to:', ['Biết hệ thống thường ở đúng hay sai phía khi có sốc', 'Tăng lợi nhuận', 'Xoá ngày sốc khỏi dữ liệu', 'Không gì'], ['Learn whether the system tends to be on the right side of shocks', 'Raise profit', 'Delete shock days', 'Nothing'], 0, '', ''],
    ['Xoá các ngày sốc giá khỏi dữ liệu backtest:', 'Deleting shock days from backtest data:', ['Làm kết quả lạc quan phi thực tế', 'Làm kết quả chính xác hơn', 'Bắt buộc', 'Không ảnh hưởng'], ['Makes results unrealistically optimistic', 'Improves accuracy', 'Required', 'No effect'], 0, '', ''],
    ['Đáo hạn VN30F thường vào:', 'VN30F contracts usually expire on:', ['Thứ Năm tuần thứ ba của tháng đáo hạn', 'Ngày 1 hằng tháng', 'Cuối năm', 'Thứ Hai đầu tiên'], ['The third Thursday of the expiry month', 'The 1st of the month', 'Year-end', 'First Monday'], 0, '', ''],
    ['Chênh lệch mua–bán ảnh hưởng nhiều nhất tới:', 'Bid–ask spreads affect most:', ['Mã thanh khoản thấp và hệ thống giao dịch nhiều', 'Mã thanh khoản cao, dài hạn', 'Không ai', 'Quỹ chỉ số'], ['Illiquid names and frequent traders', 'Liquid long-term holders', 'Nobody', 'Index funds'], 0, '', ''],
    ['Kiểm tra lỗi dữ liệu trước khi tin kết quả vì:', 'Check data errors before trusting results because:', ['Một giá sai có thể tạo lệnh "thắng lớn" giả', 'Dữ liệu luôn đúng', 'Không quan trọng', 'Luật'], ['One bad price can create a fake big winner', 'Data is always right', 'Unimportant', 'Law'], 0, '', ''],
    ['Giảm quy mô vị thế qua mùa báo cáo kết quả kinh doanh nhằm:', 'Reducing size through earnings season aims to:', ['Hạn chế rủi ro gap vượt dừng', 'Tăng lợi nhuận', 'Tăng phí', 'Không mục đích'], ['Limit gap-through-stop risk', 'Raise profit', 'Raise fees', 'No purpose'], 0, '', ''],
    ['Cổ phiếu chưa điều chỉnh phát hành thêm/cổ tức cổ phiếu gây:', 'Unadjusted stock dividends/rights issues cause:', ['Tín hiệu giả do giá "giảm" kỹ thuật', 'Dữ liệu tốt hơn', 'Không gì', 'Ít lệnh'], ['False signals from technical price drops', 'Better data', 'Nothing', 'Fewer trades'], 0, '', ''],
    ['Lệnh thị trường có ưu điểm:', 'Market orders have the advantage of:', ['Chắc chắn khớp', 'Không trượt giá', 'Giá tốt nhất luôn', 'Không phí'], ['Certain execution', 'No slippage', 'Always best price', 'No fees'], 0, '', ''],
    ['Theo dõi hiệu suất lăn của hệ thống so với kỳ vọng giúp:', 'Tracking rolling performance against expectations helps:', ['Phát hiện suy giảm sớm', 'Tăng lợi nhuận', 'Giảm thuế', 'Không gì'], ['Detect decay early', 'Raise profit', 'Cut taxes', 'Nothing'], 0, '', ''],
    ['Chi phí vay để bán khống là chi phí thuộc nhóm:', 'Borrow cost for short selling belongs to:', ['Chi phí vốn/tài trợ', 'Trượt giá', 'Tác động thị trường', 'Thuế'], ['Financing costs', 'Slippage', 'Market impact', 'Taxes'], 0, '', ''],
    ['Bài học chính về các vấn đề thực tiễn:', 'Key lesson on practical considerations:', ['Kết quả thực tế luôn kém backtest — phải mô hình hoá chi phí, dữ liệu, thực hiện một cách bi quan', 'Backtest luôn đúng', 'Chi phí không quan trọng', 'Không cần dữ liệu sạch'], ['Live results trail backtests — model costs, data and execution pessimistically', 'Backtests are always right', 'Costs don’t matter', 'Clean data unnecessary'], 0, '', '']
  ]);
})(window.LLW);
