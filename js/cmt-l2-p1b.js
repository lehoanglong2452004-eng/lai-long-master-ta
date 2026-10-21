/* CMT Level 2 — Part 1 (b), lessons 8–14: patterns, candles, cycles. Written by Lai Long Master TA in its own words. */
(function (L) {
  'use strict';
  const C = L.cmt, F = C.fig, H = C.demoHtml;
  const T = (lg, vi, en) => (lg === 'en' ? en : vi);

  const fig = {
    rounding: lg => F.row(
      F.line({ w: 320, h: 200, series: [{ pts: Array.from({ length: 41 }, (_, k) => { const x = k * 2.5; return [x, 70 - 50 * Math.sin(Math.PI * x / 100)]; }).concat([[100, 82]]) }], caption: T(lg, 'Đáy tròn (saucer): chuyển đổi từ từ, khối lượng hình chữ U', 'Rounding bottom: gradual shift, U-shaped volume') }),
      F.line({ w: 320, h: 200, hl: [[62, 's-res']], series: [{ pts: [[0, 80], [10, 60], [22, 30], [35, 22], [50, 30], [62, 62], [70, 52], [76, 56], [82, 50], [92, 66], [100, 80]] }], labels: [[35, 22, T(lg, 'cốc', 'cup'), 'b'], [76, 56, T(lg, 'tay cầm', 'handle'), 't']], caption: T(lg, 'Cốc và tay cầm', 'Cup with handle') })),
    midcycle: lg => {
      const pts = []; for (let x = 0; x <= 100; x += 1) { const base = 40 + 30 * Math.sin(Math.PI * x / 100); const half = -7 * Math.sin(2 * Math.PI * x / 100 * 2) * (x > 25 && x < 75 ? 1 : 0.3); pts.push([x, base + half]); }
      return F.line({ h: 230, series: [{ pts }], labels: [[0, 40, T(lg, 'đáy chu kỳ', 'cycle low'), 'b'], [50, 62, T(lg, 'nhịp giảm giữa chu kỳ', 'mid-cycle dip'), 'b'], [100, 40, T(lg, 'đáy chu kỳ', 'cycle low'), 'l']], caption: T(lg, 'Chu kỳ 1/2 tạo đáy ở giữa chu kỳ lớn → nhịp giảm giữa chu kỳ; đỉnh thường ở khoảng 1/4 và 3/4', 'The half-cycle bottoms mid-way → mid-cycle dip; crests near 1/4 and 3/4') });
    },
    vtl: lg => F.line({ h: 230, series: [{ pts: [[0, 30], [12, 50], [20, 42], [33, 68], [42, 60], [55, 78], [64, 66], [72, 72], [80, 58], [100, 44]] }, { pts: [[20, 42], [64, 66], [100, 85.6]], cls: 's-trend' }],
      labels: [[20, 42, T(lg, 'đáy chu kỳ 1/2', 'half-cycle low'), 'b'], [64, 66, T(lg, 'đáy chu kỳ 1/2', 'half-cycle low'), 'b'], [80, 58, T(lg, 'thủng VTL', 'VTL break'), 'b']],
      caption: T(lg, 'Đường xu hướng hợp lệ (VTL) nối hai đáy của chu kỳ nhỏ hơn liên tiếp, không cắt qua giá; thủng VTL xác nhận đỉnh chu kỳ lớn đã qua', 'A valid trendline joins consecutive lows of the smaller cycle without cutting price; its break confirms the larger cycle has topped') })
  };

  /* ================= L2-08 ================= */
  C.addLesson('l2-08', {
    goals: ['Phản biện tranh luận "mẫu hình có giao dịch được không".', 'Đánh giá ảnh hưởng của máy tính đến nghiên cứu mẫu hình.', 'Vẽ và phân tích tam giác, hai/ba đỉnh–đáy, mẫu hình tròn, vai–đầu–vai, nửa cột cờ.', 'Áp dụng phương pháp xác định mục tiêu giá và thống kê thành công/thất bại.'],
    body: () => `
<h3>1. Tranh luận: mẫu hình có tồn tại và giao dịch được không?</h3>
<ul><li><b>Phe hoài nghi</b>: mẫu hình là ảo giác của mắt người trên dữ liệu ngẫu nhiên (Level 1, Bài 27); định nghĩa chủ quan; nghiên cứu cũ thiếu kiểm định.</li>
<li><b>Phe ủng hộ</b>: hành vi đám đông lặp lại tạo ra cấu trúc cung–cầu tương tự; nghiên cứu thống kê lớn (theo dõi hàng chục nghìn mẫu hình) cho thấy nhiều mẫu hình có <b>tỷ lệ phá vỡ đúng hướng, mức tăng trung bình và tỷ lệ thất bại</b> khác biệt đáng kể so với ngẫu nhiên.</li>
<li><b>Kết luận cân bằng</b>: mẫu hình mang <b>lợi thế xác suất</b> nhỏ, không phải chắc chắn. Giá trị nằm ở việc kết hợp với bối cảnh, xác nhận và quản trị rủi ro.</li></ul>
<h3>2. Máy tính thay đổi việc nghiên cứu mẫu hình</h3>
<ul><li>Cho phép <b>định nghĩa khách quan</b> (thuật toán nhận diện đỉnh/đáy, độ cao, độ rộng tương đối) và đếm trên hàng nghìn mã, nhiều thập kỷ.</li>
<li>Thống kê được: tỷ lệ phá vỡ lên/xuống, mức đi tiếp trung bình, tần suất pullback/throwback, tỷ lệ "thất bại" (không đạt được ví dụ 5–10% sau phá vỡ).</li>
<li>Mặt trái: nhiều người cùng dùng phần mềm quét có thể làm một số mẫu hình kém hiệu quả hơn (thị trường thích nghi).</li></ul>
<h3>3. Những phát hiện thực tiễn thường gặp</h3>
<table class="tbl"><thead><tr><th>Quan sát</th><th>Ý nghĩa giao dịch</th></tr></thead><tbody>
<tr><td>Phá vỡ theo hướng xu hướng chính có tỷ lệ thành công cao hơn</td><td>Ưu tiên mẫu hình tiếp diễn thuận xu hướng</td></tr>
<tr><td>Pullback/throwback xảy ra ở phần đáng kể các phá vỡ</td><td>Có thể vào ở nhịp quay lại, nhưng có pullback thì mức đi tiếp trung bình thường thấp hơn</td></tr>
<tr><td>Mẫu hình rộng, cao hơn thường cho nước đi lớn hơn</td><td>Tôn trọng tỷ lệ chiều cao/độ rộng</td></tr>
<tr><td>Khối lượng lớn khi phá vỡ cải thiện kết quả (đặc biệt phá lên)</td><td>Dùng khối lượng làm bộ lọc</td></tr>
<tr><td>Mẫu hình thất bại cho tín hiệu ngược khá đáng tin</td><td>Có kế hoạch cho cả kịch bản thất bại</td></tr></tbody></table>
<h3>4. Mẫu hình tròn và nửa cột cờ</h3>
${fig.rounding('vi')}
<ul><li><b>Đáy tròn/đỉnh tròn</b>: chuyển đổi chậm của cung–cầu, khối lượng thường cũng có dạng chữ U (đáy). Ít mục tiêu đo chuẩn.</li>
<li><b>Cốc và tay cầm</b>: đáy tròn, sau đó nhịp điều chỉnh nhỏ (tay cầm) ở nửa trên; phá vỡ vùng miệng cốc với khối lượng.</li>
<li><b>Vai–đầu–vai</b>: biến thể có nhiều vai, đường viền cổ dốc; đường viền cổ dốc lên ở đỉnh (yếu hơn) hay dốc xuống (mạnh hơn khi phá).</li>
<li><b>Cờ, cờ đuôi nheo</b>: "nửa cột cờ"; lá cờ nên ngắn (thường dưới khoảng 3 tuần trên biểu đồ ngày) và dốc ngược xu hướng.</li></ul>
${H.candles()}`,
    keys: ['Mẫu hình mang lợi thế xác suất nhỏ, không chắc chắn; cần bối cảnh và quản trị rủi ro.', 'Máy tính cho phép định nghĩa khách quan và thống kê trên quy mô lớn; thị trường có thể thích nghi.', 'Phá vỡ thuận xu hướng, có khối lượng và mẫu hình lớn thường tốt hơn; pullback thường gặp.', 'Mẫu hình thất bại là tín hiệu ngược đáng tin.', 'Đáy tròn, cốc tay cầm, vai–đầu–vai biến thể, cờ ngắn và dốc ngược.'],
    terms: [['Failure rate', 'Tỷ lệ thất bại'], ['Rounding bottom', 'Đáy tròn'], ['Cup with handle', 'Cốc và tay cầm'], ['Sloping neckline', 'Đường viền cổ dốc']]
  }, {
    goals: ['Critique whether tradable patterns exist.', 'Appraise computers’ influence.', 'Diagram classic, rounding and half-mast patterns.', 'Apply objectives and failure statistics.'],
    body: () => `
<h3>1. The debate</h3><ul><li>Sceptics: illusions in noise, subjective definitions.</li><li>Supporters: repeated crowd behaviour; large studies show breakout direction, average moves and failure rates differ from random.</li><li>Balance: a small probabilistic edge.</li></ul>
<h3>2. Computers</h3><ul><li>Objective definitions and large-sample statistics.</li><li>Widespread scanning may erode some edges.</li></ul>
<h3>3. Common findings</h3><table class="tbl"><tbody><tr><td>With-trend breakouts work better</td></tr><tr><td>Pullbacks are common but reduce average follow-through</td></tr><tr><td>Taller, wider patterns move more</td></tr><tr><td>Breakout volume helps</td></tr><tr><td>Failed patterns are reliable opposite signals</td></tr></tbody></table>
<h3>4. Rounding and half-mast patterns</h3>${fig.rounding('en')}<ul><li>Rounding bottoms/tops with U-shaped volume.</li><li>Cup with handle.</li><li>Complex H&S, sloping necklines.</li><li>Short, counter-sloped flags.</li></ul>${H.candles()}`,
    keys: ['Small probabilistic edge.', 'Objective large-sample research.', 'With-trend, high-volume, larger patterns.', 'Failures as signals.', 'Rounding, cup-handle, half-mast.'],
    terms: [['Failure rate', 'Share of breakouts that fail'], ['Cup with handle', 'Rounded base plus small pullback']]
  }, [
    ['Kết luận cân bằng về mẫu hình biểu đồ là:', 'A balanced conclusion about chart patterns:', ['Luôn đúng', 'Hoàn toàn vô nghĩa', 'Mang lợi thế xác suất nhỏ, cần bối cảnh và quản trị rủi ro', 'Chỉ đúng với crypto'], ['Always right', 'Meaningless', 'A small probabilistic edge needing context and risk control', 'Crypto only'], 2, '', ''],
    ['Lợi ích lớn nhất của máy tính với nghiên cứu mẫu hình:', 'Computers’ biggest contribution to pattern research:', ['Vẽ đẹp hơn', 'Định nghĩa khách quan và thống kê trên mẫu lớn', 'Loại bỏ rủi ro', 'Dự báo chắc chắn'], ['Prettier charts', 'Objective definitions and large-sample statistics', 'No risk', 'Certain forecasts'], 1, '', ''],
    ['Phá vỡ mẫu hình nào thường có tỷ lệ thành công cao hơn?', 'Which breakouts tend to succeed more?', ['Ngược xu hướng chính', 'Thuận xu hướng chính, có khối lượng', 'Khối lượng thấp', 'Ở giữa tam giác'], ['Against the main trend', 'With the main trend, on volume', 'Low volume', 'Mid-triangle'], 1, '', ''],
    ['Khi phá vỡ có pullback, mức đi tiếp trung bình thường:', 'When a breakout pulls back, average follow-through is usually:', ['Cao hơn', 'Thấp hơn', 'Bằng 0', 'Không đổi'], ['Higher', 'Lower', 'Zero', 'Unchanged'], 1, '', ''],
    ['Mẫu hình thất bại nên được xem là:', 'A failed pattern should be viewed as:', ['Không có ý nghĩa', 'Tín hiệu ngược chiều khá đáng tin', 'Lỗi dữ liệu', 'Tín hiệu cùng chiều'], ['Meaningless', 'A fairly reliable opposite signal', 'Data error', 'A same-direction signal'], 1, '', ''],
    ['Khối lượng của đáy tròn điển hình có dạng:', 'Typical rounding-bottom volume is:', ['Hình chữ U', 'Tăng liên tục', 'Giảm liên tục', 'Bằng 0'], ['U-shaped', 'Steadily rising', 'Steadily falling', 'Zero'], 0, '', ''],
    ['Tay cầm trong mẫu hình cốc và tay cầm nên nằm ở:', 'The handle of a cup with handle should form:', ['Đáy cốc', 'Nửa trên của cốc', 'Dưới đáy cốc', 'Bất kỳ đâu'], ['At the cup bottom', 'In the upper half of the cup', 'Below the cup', 'Anywhere'], 1, '', ''],
    ['Lá cờ trên biểu đồ ngày thường kéo dài:', 'A flag on a daily chart usually lasts:', ['Vài năm', 'Ngắn — thường dưới khoảng 3 tuần', 'Đúng 1 ngày', '6 tháng'], ['Years', 'Briefly — usually under ~3 weeks', 'Exactly 1 day', '6 months'], 1, '', ''],
    ['Vai–đầu–vai đỉnh với đường viền cổ dốc xuống, khi phá vỡ thường:', 'An H&S top with a down-sloping neckline, on breaking:', ['Yếu hơn', 'Cho thấy sức yếu rõ hơn', 'Không thể phá', 'Là mẫu hình tăng'], ['Weaker', 'Shows clearer weakness', 'Cannot break', 'Is bullish'], 1, '', ''],
    ['"Tỷ lệ thất bại" của mẫu hình thường được định nghĩa là:', 'A pattern "failure rate" is usually defined as:', ['Không đạt một mức đi tiếp tối thiểu (ví dụ 5–10%) sau phá vỡ', 'Không có khối lượng', 'Có pullback', 'Phá sai hướng ngay lập tức'], ['Failing to move a minimum (e.g. 5–10%) after breakout', 'No volume', 'Any pullback', 'Instant wrong-way break'], 0, '', ''],
    ['Lập luận chính của phe hoài nghi mẫu hình:', 'The sceptics’ main argument:', ['Mắt người thấy mẫu hình trong dữ liệu ngẫu nhiên; định nghĩa chủ quan', 'Mẫu hình quá ít', 'Máy tính không vẽ được', 'Khối lượng không tồn tại'], ['People see patterns in randomness; subjective definitions', 'Too few patterns', 'Computers can’t draw', 'No volume'], 0, '', ''],
    ['Việc nhiều người cùng quét mẫu hình bằng phần mềm có thể:', 'Widespread pattern scanning may:', ['Làm lợi thế của một số mẫu hình suy giảm', 'Tăng lợi thế vô hạn', 'Không ảnh hưởng', 'Cấm giao dịch'], ['Erode some patterns’ edge', 'Increase the edge forever', 'No effect', 'Ban trading'], 0, 'Thị trường thích nghi.', ''],
    ['Mẫu hình cao và rộng hơn thường:', 'Taller, wider patterns usually:', ['Cho nước đi lớn hơn sau phá vỡ', 'Không phá vỡ', 'Nhỏ hơn', 'Vô nghĩa'], ['Produce larger moves', 'Never break', 'Smaller moves', 'Meaningless'], 0, '', ''],
    ['Đáy tròn thường thiếu điều gì so với vai–đầu–vai?', 'Rounding bottoms typically lack:', ['Một mục tiêu đo chuẩn rõ ràng', 'Khối lượng', 'Đáy', 'Thời gian'], ['A standard measured objective', 'Volume', 'A bottom', 'Time'], 0, '', ''],
    ['Vì sao nên có kế hoạch cho kịch bản mẫu hình thất bại?', 'Why plan for pattern failure?', ['Vì thất bại là một phần của xác suất và có thể giao dịch theo chiều ngược', 'Vì luôn thất bại', 'Không cần', 'Do luật'], ['Failures are part of the odds and tradable the other way', 'They always fail', 'No need', 'Law'], 0, '', ''],
    ['Mẫu hình nửa cột cờ gồm:', 'Half-mast patterns include:', ['Cờ và cờ đuôi nheo', 'Đáy tròn', 'Kim cương', 'Hai đỉnh'], ['Flags and pennants', 'Rounding bottoms', 'Diamonds', 'Double tops'], 0, '', ''],
    ['Phá vỡ lên của mẫu hình với khối lượng thấp hơn trung bình nên:', 'An upside breakout on below-average volume should be:', ['Tin tưởng tuyệt đối', 'Thận trọng hơn, giảm quy mô hoặc chờ xác nhận', 'Bán khống ngay', 'Bỏ qua mọi tín hiệu'], ['Fully trusted', 'Treated cautiously — smaller size or await confirmation', 'Shorted', 'Ignored entirely'], 1, '', ''],
    ['Một thước đo quan trọng để thống kê mẫu hình là:', 'A key pattern statistic is:', ['Mức tăng/giảm trung bình sau phá vỡ', 'Màu nến', 'Tên mã', 'Ngày trong tuần'], ['Average move after breakout', 'Candle colour', 'Ticker', 'Weekday'], 0, '', ''],
    ['Hành vi lặp lại của đám đông là lập luận của:', 'Repeated crowd behaviour is the argument of:', ['Phe ủng hộ mẫu hình', 'Phe EMH mạnh', 'Phe chống PTKT', 'Không ai'], ['Pattern supporters', 'Strong-form EMH', 'TA critics', 'Nobody'], 0, '', ''],
    ['Nên dùng mẫu hình kết hợp với:', 'Patterns should be combined with:', ['Bối cảnh xu hướng, khối lượng và quản trị rủi ro', 'Tin đồn', 'Không gì', 'Chỉ cảm xúc'], ['Trend context, volume and risk management', 'Rumours', 'Nothing', 'Emotion'], 0, '', '']
  ]);

  /* ================= L2-09 ================= */
  C.addLesson('l2-09', {
    goals: ['Phân tích đảo chiều của xu hướng dài bằng mẫu hình ngắn hạn.', 'Diễn giải ý nghĩa các loại gap và thống kê lấp gap.', 'So sánh nến biên độ rộng/hẹp và hàm ý biến động.', 'Vẽ mẫu hình đảo chiều 1–2 nến và mẫu nến phổ biến trong xu hướng.'],
    body: () => `
<h3>1. Mẫu hình ngắn hạn trong bối cảnh dài hạn</h3>
<p>Một đảo chiều lớn thường <b>bắt đầu</b> bằng một dấu hiệu ngắn hạn: một key reversal với khối lượng kỷ lục, một gap kiệt sức, một nến bao trùm tại kháng cự lớn. Mẫu hình ngắn hạn không đủ để kết luận đảo chiều dài hạn, nhưng là <b>tín hiệu sớm</b> để thắt chặt quản trị rủi ro và theo dõi xác nhận trên khung lớn hơn.</p>
<h3>2. Gap chuyên sâu</h3>
<ul><li><b>Phân loại theo vị trí</b> (Level 1): thông thường, phá vỡ, tiếp diễn, kiệt sức, đảo.</li>
<li><b>Gap trong phiên vs gap qua đêm</b>: thị trường 24/7 (crypto) hầu như không có gap ngày; cổ phiếu có gap qua đêm sau tin tức.</li>
<li><b>Lấp gap</b>: gap thông thường thường được lấp sớm; gap phá vỡ có thể không lấp trong thời gian rất dài. Gap không được lấp trong vài phiên đầu là dấu hiệu sức mạnh của nước đi.</li>
<li><b>Gap tiếp diễn kép</b>: nhiều gap liên tiếp — gap cuối thường là kiệt sức.</li></ul>
<h3>3. Biên độ và biến động</h3>
<table class="tbl"><thead><tr><th>Mẫu</th><th>Định nghĩa</th><th>Hàm ý</th></tr></thead><tbody>
<tr><td>Nến biên độ rộng (WRB)</td><td>Biên độ lớn hơn nhiều so với trung bình (ví dụ &gt; 2 ATR)</td><td>Phá vỡ, cao trào hoặc tin tức; hướng đóng cửa quyết định</td></tr>
<tr><td>NR4 / NR7</td><td>Biên độ hẹp nhất trong 4/7 nến</td><td>Nén biến động → thường mở rộng sắp tới</td></tr>
<tr><td>Inside day + NR</td><td>Nến trong và hẹp nhất</td><td>Tín hiệu nén mạnh; giao dịch theo phá vỡ đỉnh/đáy nến</td></tr>
<tr><td>Chuỗi biên độ thu hẹp</td><td>Nhiều nến liên tiếp thu hẹp</td><td>Chuẩn bị bùng nổ</td></tr></tbody></table>
<h3>4. Mẫu hình đảo chiều 1–2 nến</h3>
<ul><li><b>Key reversal</b>, <b>outside reversal</b> (nến bao trùm ngược chiều), <b>two-bar reversal</b>, <b>pivot point reversal</b> (đỉnh/đáy cao/thấp hơn các nến hai bên), <b>hook reversal</b> (đỉnh cao hơn, đáy cao hơn nhưng đóng cửa ngược).</li>
<li>Độ tin cậy tăng khi: khối lượng lớn, xảy ra sau một nhịp kéo dài, tại vùng hỗ trợ/kháng cự lớn, và được nến sau xác nhận.</li></ul>
${H.shortPat()}`,
    keys: ['Mẫu hình ngắn hạn là tín hiệu sớm của đảo chiều dài hạn — cần xác nhận khung lớn.', 'Gap không lấp trong vài phiên đầu = nước đi mạnh; gap phá vỡ có thể không lấp lâu dài; nhiều gap liên tiếp → gap cuối thường là kiệt sức.', 'WRB = phá vỡ/cao trào; NR4/NR7, inside + NR = nén biến động.', 'Đảo chiều 1–2 nến tin cậy hơn với khối lượng, sau nhịp dài, tại vùng then chốt, có xác nhận.'],
    terms: [['Wide-range bar', 'Nến biên độ rộng'], ['Outside reversal', 'Đảo chiều bao trùm'], ['Pivot point reversal', 'Đảo chiều điểm xoay'], ['Hook reversal', 'Đảo chiều móc câu'], ['Gap fill', 'Lấp gap']]
  }, {
    goals: ['Use short-term patterns for long-term reversals.', 'Interpret gaps and gap fills.', 'Wide- vs narrow-range bars.', 'One- and two-bar reversals.'],
    body: () => `
<h3>1. Short-term signals, long-term context</h3><p>Major reversals often start with a short-term sign; use it as an early warning and seek higher-timeframe confirmation.</p>
<h3>2. Gaps</h3><ul><li>Classification by location.</li><li>Overnight vs 24/7 markets.</li><li>Unfilled gaps in the first days signal strength; breakaway gaps may stay open.</li><li>Several consecutive gaps — the last is often exhaustion.</li></ul>
<h3>3. Range</h3><table class="tbl"><tbody><tr><td>WRB</td><td>breakouts, climaxes</td></tr><tr><td>NR4/NR7</td><td>compression</td></tr><tr><td>Inside + NR</td><td>strong compression</td></tr></tbody></table>
<h3>4. Reversals</h3><ul><li>Key, outside, two-bar, pivot-point, hook reversals.</li><li>More reliable with volume, after extended moves, at key levels, with confirmation.</li></ul>${H.shortPat()}`,
    keys: ['Early warnings.', 'Gap behaviour.', 'WRB vs NR bars.', 'Reversal reliability factors.'],
    terms: [['Hook reversal', 'Higher high/low but opposite close'], ['WRB', 'Wide-range bar']]
  }, [
    ['Một đảo chiều dài hạn thường:', 'A long-term reversal often:', ['Bắt đầu bằng một dấu hiệu ngắn hạn, cần xác nhận khung lớn', 'Không có dấu hiệu', 'Chỉ có trên khung tháng', 'Không bao giờ có gap'], ['Starts with a short-term sign needing higher-TF confirmation', 'Has no signs', 'Only on monthly charts', 'Never gaps'], 0, '', ''],
    ['Gap không được lấp trong vài phiên đầu thường cho thấy:', 'A gap left unfilled in the first few sessions shows:', ['Nước đi yếu', 'Nước đi mạnh', 'Lỗi dữ liệu', 'Thị trường đóng cửa'], ['A weak move', 'A strong move', 'Data error', 'Closed market'], 1, '', ''],
    ['Sau 3 gap tăng liên tiếp trong một nhịp dài, gap cuối thường được nghi ngờ là:', 'After three consecutive up gaps in a long run, the last is often suspected to be:', ['Gap phá vỡ', 'Gap kiệt sức', 'Gap thông thường', 'Không phải gap'], ['Breakaway', 'Exhaustion', 'Common', 'Not a gap'], 1, '', ''],
    ['Thị trường crypto ít có gap ngày vì:', 'Crypto rarely shows daily gaps because:', ['Giao dịch liên tục 24/7', 'Không có biến động', 'Luật cấm', 'Không có khối lượng'], ['It trades 24/7', 'No volatility', 'Banned', 'No volume'], 0, '', ''],
    ['Nến biên độ rộng thường đi kèm:', 'Wide-range bars often accompany:', ['Phá vỡ, cao trào hoặc tin tức', 'Thị trường yên ắng', 'Cuối tuần', 'Không gì'], ['Breakouts, climaxes or news', 'Quiet markets', 'Weekends', 'Nothing'], 0, '', ''],
    ['Inside day đồng thời là NR7 cho thấy:', 'An inside day that is also an NR7 shows:', ['Biến động nén mạnh — chuẩn bị mở rộng', 'Xu hướng mạnh', 'Đảo chiều chắc chắn', 'Không ý nghĩa'], ['Strong compression — expansion likely', 'Strong trend', 'Certain reversal', 'Nothing'], 0, '', ''],
    ['Outside reversal giảm là nến:', 'A bearish outside reversal bar:', ['Bao trùm biên độ nến trước và đóng cửa thấp', 'Nằm trong nến trước', 'Có biên độ hẹp nhất', 'Gap tăng'], ['Engulfs the prior range and closes low', 'Inside the prior bar', 'Narrowest', 'Gaps up'], 0, '', ''],
    ['Pivot point reversal ở đỉnh là:', 'A pivot-point top:', ['Nến có đỉnh cao hơn các nến hai bên, sau đó giá giảm', 'Nến có đáy thấp nhất', 'Doji', 'Gap'], ['A bar whose high exceeds neighbours on both sides, then declines', 'Lowest low', 'Doji', 'Gap'], 0, '', ''],
    ['Hook reversal (đỉnh) là nến:', 'A hook reversal (top):', ['Đỉnh cao hơn, đáy cao hơn nến trước nhưng đóng cửa thấp hơn nến trước', 'Đóng cửa cao nhất', 'Nến trong', 'Không có thân'], ['Higher high and low than the prior bar but a lower close', 'Highest close', 'Inside bar', 'No body'], 0, '', ''],
    ['Yếu tố KHÔNG làm tăng độ tin cậy của đảo chiều 1–2 nến:', 'NOT a reliability factor for 1–2-bar reversals:', ['Khối lượng lớn', 'Sau một nhịp kéo dài', 'Tại vùng kháng cự lớn', 'Xuất hiện giữa vùng đi ngang không có xu hướng'], ['High volume', 'After an extended move', 'At major resistance', 'Mid-range with no trend'], 3, '', ''],
    ['Chuỗi nhiều nến liên tiếp thu hẹp biên độ thường:', 'A run of progressively narrower bars usually:', ['Báo trước bùng nổ biến động', 'Báo hiệu xu hướng kết thúc chắc chắn', 'Vô nghĩa', 'Cấm giao dịch'], ['Precedes a volatility burst', 'Certainly ends the trend', 'Means nothing', 'Bans trading'], 0, '', ''],
    ['Gap thông thường (common) có đặc điểm:', 'Common gaps:', ['Thường được lấp sớm', 'Không bao giờ lấp', 'Khởi đầu xu hướng', 'Luôn kèm khối lượng kỷ lục'], ['Usually fill soon', 'Never fill', 'Start trends', 'Always record volume'], 0, '', ''],
    ['Cách giao dịch NR7 phổ biến:', 'A common NR7 tactic:', ['Đặt lệnh chờ ở đỉnh và đáy nến NR7, theo hướng phá vỡ', 'Mua ở giữa', 'Bỏ qua', 'Bán khống ngay'], ['Bracket the NR7 high and low and trade the break', 'Buy the middle', 'Ignore', 'Short at once'], 0, '', ''],
    ['Key reversal với khối lượng kỷ lục sau 1 năm tăng giá là:', 'A record-volume key reversal after a year-long rally is:', ['Tín hiệu sớm cần chú ý — có thể là cao trào mua', 'Tín hiệu mua thêm', 'Vô nghĩa', 'Xác nhận chắc chắn đảo chiều dài hạn'], ['An early warning — possibly a buying climax', 'A buy signal', 'Meaningless', 'Certain long-term reversal'], 0, '', ''],
    ['Gap phá vỡ khỏi vùng tích lũy dài thường:', 'A breakaway gap from a long base:', ['Có thể không được lấp trong thời gian dài', 'Luôn lấp ngay', 'Là gap kiệt sức', 'Không có khối lượng'], ['May stay unfilled for a long time', 'Always fills at once', 'Is exhaustion', 'Has no volume'], 0, '', ''],
    ['Two-bar reversal đỉnh gồm:', 'A two-bar top reversal:', ['Một nến tăng dài rồi một nến giảm dài đóng cửa gần đáy nến trước', 'Hai doji', 'Hai gap', 'Hai nến trong'], ['A long up bar then a long down bar closing near the prior low', 'Two dojis', 'Two gaps', 'Two inside bars'], 0, '', ''],
    ['Để dùng mẫu hình ngắn hạn cho quyết định dài hạn, cần:', 'To use short-term patterns for long-term decisions you need:', ['Xác nhận trên khung thời gian lớn hơn', 'Không gì', 'Chỉ mẫu nến', 'Tin tức'], ['Confirmation on higher timeframes', 'Nothing', 'Only candles', 'News'], 0, '', ''],
    ['WRB đóng cửa ở đáy biên độ sau nhịp tăng dài gợi ý:', 'A WRB closing at its low after a long rally suggests:', ['Cung mạnh xuất hiện — cảnh báo', 'Cầu mạnh', 'Không gì', 'Gap tăng'], ['Strong supply — a warning', 'Strong demand', 'Nothing', 'Gap up'], 0, '', ''],
    ['Biến động có tính chu kỳ nghĩa là:', 'Volatility is cyclical, meaning:', ['Giai đoạn hẹp thường nối tiếp giai đoạn rộng và ngược lại', 'Biến động không đổi', 'Chỉ tăng', 'Chỉ giảm'], ['Narrow phases alternate with wide phases', 'Constant volatility', 'Only rises', 'Only falls'], 0, '', ''],
    ['Gap giảm ngay sau gap tăng kiệt sức, để lại cụm giá cô lập, gọi là:', 'A gap down right after an exhaustion gap up, isolating a cluster, is:', ['Island reversal', 'Runaway gap', 'NR7', 'Inside day'], ['Island reversal', 'Runaway gap', 'NR7', 'Inside day'], 0, '', '']
  ]);

  /* ================= L2-10 ================= */
  C.addLesson('l2-10', {
    goals: ['Đọc tâm lý thị trường từ hình dạng nến.', 'Vẽ và diễn giải nến búa, người treo cổ, doji và các biến thể.', 'Giải thích tầm quan trọng của bối cảnh xu hướng.', 'Phân biệt hoạt động mua/bán thể hiện qua thân và bóng nến.'],
    body: () => `
<h3>1. Nến như một "câu chuyện" trong phiên</h3>
<p>Mỗi nến kể lại trận chiến giữa bên mua và bên bán trong kỳ. <b>Thân nến</b> cho biết ai thắng (tính từ giá mở cửa) và thắng bao nhiêu. <b>Bóng nến</b> cho biết mức giá nào đã bị <b>từ chối</b>: bóng dưới dài nghĩa là giá thấp bị từ chối, bên mua đã phản công; bóng trên dài nghĩa là giá cao bị từ chối.</p>
<table class="tbl"><thead><tr><th>Đặc điểm</th><th>Tâm lý</th></tr></thead><tbody>
<tr><td>Thân dài, bóng ngắn</td><td>Một bên áp đảo từ đầu đến cuối phiên — niềm tin cao</td></tr>
<tr><td>Thân nhỏ, bóng hai đầu dài</td><td>Hai bên giằng co dữ dội — do dự cao</td></tr>
<tr><td>Thân nhỏ ở đỉnh, bóng dưới dài</td><td>Bên bán đạp mạnh nhưng thất bại</td></tr>
<tr><td>Thân nhỏ ở đáy, bóng trên dài</td><td>Bên mua đẩy mạnh nhưng thất bại</td></tr>
<tr><td>Nến lớn ngược màu so với chuỗi trước</td><td>Thay đổi đột ngột về kiểm soát</td></tr></tbody></table>
<h3>2. Nến đơn quan trọng</h3>
<ul><li><b>Búa / người treo cổ</b>: thân nhỏ ở phần trên, bóng dưới ≥ 2 lần thân, bóng trên rất nhỏ. Sau nhịp giảm là búa (tăng); sau nhịp tăng là người treo cổ (cần xác nhận giảm — phiên sau đóng cửa dưới thân người treo cổ).</li>
<li><b>Búa ngược / sao băng</b>: bóng trên dài. Sau nhịp giảm là búa ngược (cần xác nhận mạnh); sau nhịp tăng là sao băng.</li>
<li><b>Doji</b>: mở ≈ đóng. Doji sau một nến thân dài trong xu hướng mạnh là cảnh báo "xu hướng mệt". Doji ở đỉnh đáng chú ý hơn doji ở đáy (thị trường có thể "tự giảm" vì trọng lượng của nó, còn tăng cần lực mua).</li>
<li><b>Biến thể doji</b>: chân dài (do dự cực đại), chuồn chuồn (bóng dưới dài, như búa), bia mộ (bóng trên dài, như sao băng).</li>
<li><b>Marubozu</b>, <b>con xoay (spinning top)</b>, <b>nến thân dài</b> (long white/black): niềm tin mạnh hoặc do dự.</li></ul>
<h3>3. Bối cảnh là điều kiện bắt buộc</h3>
<p>Nến đảo chiều <b>phải có xu hướng để đảo</b>. Ngoài ra, cùng một nến có giá trị khác nhau tuỳ vị trí: tại hỗ trợ/kháng cự lớn, sau nhịp đi dài, kèm khối lượng cao thì có giá trị hơn nhiều. Kích thước tương đối cũng quan trọng: một "búa" bé xíu giữa những nến lớn ít ý nghĩa.</p>
${H.candles()}`,
    keys: ['Thân = ai thắng và thắng bao nhiêu; bóng = mức giá bị từ chối.', 'Búa/người treo cổ, búa ngược/sao băng: cùng hình dạng, khác bối cảnh; người treo cổ, búa ngược cần xác nhận.', 'Doji sau nến thân dài = xu hướng mệt; doji ở đỉnh đáng chú ý hơn ở đáy.', 'Bối cảnh bắt buộc: có xu hướng để đảo, vị trí then chốt, khối lượng, kích thước tương đối.'],
    terms: [['Long-legged doji', 'Doji chân dài'], ['Dragonfly / Gravestone doji', 'Doji chuồn chuồn / bia mộ'], ['Spinning top', 'Con xoay'], ['Marubozu', 'Nến không bóng'], ['Rejection', 'Sự từ chối giá']]
  }, {
    goals: ['Read psychology from candle shapes.', 'Interpret hammer, hanging man, doji and variants.', 'Explain trend context.', 'Distinguish buying/selling in bodies vs shadows.'],
    body: () => `
<h3>1. A candle tells a story</h3><p>The body shows who won and by how much; shadows show rejected prices.</p><table class="tbl"><tbody><tr><td>Long body, short shadows</td><td>conviction</td></tr><tr><td>Small body, long shadows</td><td>indecision</td></tr><tr><td>Small top body, long lower shadow</td><td>failed selling</td></tr><tr><td>Small bottom body, long upper shadow</td><td>failed buying</td></tr></tbody></table>
<h3>2. Key single candles</h3><ul><li>Hammer / hanging man (needs bearish confirmation).</li><li>Inverted hammer / shooting star.</li><li>Doji after a long body = tired trend; doji at tops matters more than at bottoms.</li><li>Long-legged, dragonfly, gravestone; marubozu, spinning tops.</li></ul>
<h3>3. Context</h3><p>A reversal needs a trend; location, volume and relative size matter.</p>${H.candles()}`,
    keys: ['Body vs shadows.', 'Same shape, different context.', 'Doji significance.', 'Context is mandatory.'],
    terms: [['Gravestone doji', 'Long upper shadow doji'], ['Spinning top', 'Small body, both shadows']]
  }, [
    ['Bóng dưới dài cho thấy:', 'A long lower shadow shows:', ['Giá cao bị từ chối', 'Giá thấp bị từ chối — bên mua phản công', 'Không có giao dịch', 'Gap'], ['Rejected highs', 'Rejected lows — buyers fought back', 'No trading', 'A gap'], 1, '', ''],
    ['Thân nến dài, bóng ngắn thể hiện:', 'A long body with short shadows shows:', ['Do dự', 'Một bên áp đảo, niềm tin cao', 'Không ai giao dịch', 'Đảo chiều chắc chắn'], ['Indecision', 'One side dominated with conviction', 'No trading', 'Certain reversal'], 1, '', ''],
    ['Người treo cổ cần xác nhận nào để có ý nghĩa giảm?', 'What confirms a hanging man?', ['Phiên sau đóng cửa dưới thân người treo cổ', 'Phiên sau tăng mạnh', 'Khối lượng thấp', 'Không cần'], ['Next close below its body', 'A strong next rally', 'Low volume', 'None'], 0, '', ''],
    ['Doji xuất hiện ngay sau một nến tăng thân dài trong xu hướng tăng mạnh cho thấy:', 'A doji right after a long white candle in a strong uptrend:', ['Xu hướng tăng tốc', 'Xu hướng có thể đang "mệt" — cảnh báo', 'Tín hiệu mua', 'Không ý nghĩa'], ['Acceleration', 'A possibly tired trend — warning', 'Buy', 'Nothing'], 1, '', ''],
    ['Vì sao doji ở đỉnh thường được coi trọng hơn doji ở đáy?', 'Why do dojis at tops matter more than at bottoms?', ['Giá có thể giảm vì "trọng lượng" của nó, còn tăng cần lực mua thực sự', 'Do luật', 'Doji ở đáy không tồn tại', 'Không đúng'], ['Prices can fall under their own weight; rises need active buying', 'Law', 'Bottom dojis don’t exist', 'False'], 0, '', ''],
    ['Doji bia mộ có:', 'A gravestone doji has:', ['Bóng trên dài, mở ≈ đóng ở gần đáy', 'Bóng dưới dài', 'Thân dài', 'Không bóng'], ['A long upper shadow with open ≈ close near the low', 'Long lower shadow', 'Long body', 'No shadows'], 0, '', ''],
    ['Doji chuồn chuồn có hình dạng gần giống:', 'A dragonfly doji resembles:', ['Búa (bóng dưới dài)', 'Sao băng', 'Marubozu', 'Con xoay'], ['A hammer (long lower shadow)', 'Shooting star', 'Marubozu', 'Spinning top'], 0, '', ''],
    ['Búa ngược sau nhịp giảm cần:', 'An inverted hammer after a decline needs:', ['Xác nhận mạnh từ phiên sau', 'Không cần gì', 'Gap giảm', 'Khối lượng bằng 0'], ['Strong next-session confirmation', 'Nothing', 'Gap down', 'Zero volume'], 0, '', ''],
    ['Con xoay (spinning top) thể hiện:', 'A spinning top shows:', ['Do dự, cân bằng', 'Áp đảo tuyệt đối', 'Gap', 'Đảo chiều chắc chắn'], ['Indecision', 'Total dominance', 'Gap', 'Certain reversal'], 0, '', ''],
    ['Điều kiện tiên quyết của nến đảo chiều:', 'A prerequisite for a reversal candle:', ['Có xu hướng trước đó để đảo', 'Khối lượng thấp', 'Thứ Sáu', 'Màu xanh'], ['A prior trend to reverse', 'Low volume', 'Friday', 'Green colour'], 0, '', ''],
    ['Một "búa" rất nhỏ giữa những nến biên độ lớn có ý nghĩa:', 'A tiny hammer among large bars means:', ['Ít ý nghĩa — kích thước tương đối quan trọng', 'Rất mạnh', 'Đảo chiều chắc chắn', 'Gap'], ['Little — relative size matters', 'Very strong', 'Certain reversal', 'Gap'], 0, '', ''],
    ['Tiêu chuẩn hình dạng của búa:', 'Hammer shape criteria:', ['Bóng dưới ≥ 2 lần thân, bóng trên rất nhỏ, thân ở phần trên', 'Bóng trên dài', 'Thân dài', 'Không có bóng'], ['Lower shadow ≥ 2× body, tiny upper shadow, body near top', 'Long upper shadow', 'Long body', 'No shadows'], 0, '', ''],
    ['Marubozu tăng nghĩa là:', 'A white marubozu means:', ['Mở cửa ở đáy, đóng cửa ở đỉnh, bên mua kiểm soát suốt phiên', 'Do dự', 'Gap giảm', 'Không giao dịch'], ['Opened at the low, closed at the high — buyers controlled all session', 'Indecision', 'Gap down', 'No trading'], 0, '', ''],
    ['Doji chân dài thể hiện:', 'A long-legged doji shows:', ['Do dự cực đại, giằng co mạnh', 'Xu hướng mạnh', 'Không biến động', 'Gap'], ['Extreme indecision', 'Strong trend', 'No volatility', 'Gap'], 0, '', ''],
    ['Sao băng xuất hiện tại kháng cự lớn với khối lượng cao là:', 'A high-volume shooting star at major resistance is:', ['Tín hiệu cảnh báo giảm đáng tin hơn', 'Tín hiệu mua', 'Không ý nghĩa', 'Gap'], ['A more reliable bearish warning', 'Buy', 'Nothing', 'Gap'], 0, '', ''],
    ['Nến lớn ngược màu sau một chuỗi nến cùng màu cho thấy:', 'A large opposite-colour candle after a same-colour run shows:', ['Thay đổi đột ngột về quyền kiểm soát', 'Không gì', 'Tiếp diễn chắc chắn', 'Lỗi'], ['A sudden change of control', 'Nothing', 'Certain continuation', 'Error'], 0, '', ''],
    ['Thân nến được tính từ:', 'The real body spans:', ['Giá mở cửa đến giá đóng cửa', 'Cao đến thấp', 'Đóng hôm qua đến đóng hôm nay', 'Cao đến đóng'], ['Open to close', 'High to low', 'Yesterday’s close to today’s', 'High to close'], 0, '', ''],
    ['Búa và người treo cổ khác nhau ở:', 'Hammer vs hanging man differ in:', ['Bối cảnh xu hướng trước đó', 'Hình dạng', 'Màu bắt buộc', 'Khối lượng bắt buộc'], ['Prior trend context', 'Shape', 'Required colour', 'Required volume'], 0, '', ''],
    ['Bóng trên dài ở đỉnh xu hướng tăng thể hiện:', 'A long upper shadow at an uptrend high shows:', ['Bên mua đẩy giá lên nhưng bị bên bán đẩy lùi', 'Bên mua thắng tuyệt đối', 'Không có bên bán', 'Gap'], ['Buyers pushed up but sellers drove price back', 'Total buyer win', 'No sellers', 'Gap'], 0, '', ''],
    ['Một nến đơn đủ để kết luận đảo chiều xu hướng dài hạn không?', 'Is one candle enough to call a long-term reversal?', ['Có, luôn luôn', 'Không — cần bối cảnh, xác nhận và khung lớn', 'Chỉ khi màu đỏ', 'Chỉ khi là doji'], ['Always', 'No — needs context, confirmation and higher TFs', 'Only red ones', 'Only dojis'], 1, '', '']
  ]);

  /* ================= L2-11 ================= */
  C.addLesson('l2-11', {
    goals: ['Vẽ và diễn giải mẫu hình nhiều nến: nhấn chìm, sao, cửa sổ và các mẫu khác.', 'Chứng minh tầm quan trọng của xu hướng hiện hành khi đọc mẫu nến.', 'Phân biệt hoạt động mua/bán qua thân và bóng trong mẫu nhiều nến.', 'Diễn giải mẫu nến như hỗ trợ/kháng cự.'],
    body: () => `
<h3>1. Mẫu hình đảo chiều nhiều nến</h3>
<table class="tbl"><thead><tr><th>Mẫu</th><th>Cấu tạo</th><th>Mức tin cậy tăng khi</th></tr></thead><tbody>
<tr><td>Nhấn chìm (engulfing)</td><td>Thân nến 2 bao trùm thân nến 1, ngược màu</td><td>Thân 2 rất lớn so với thân 1; bao trùm cả bóng; khối lượng cao</td></tr>
<tr><td>Đường xuyên / Mây đen</td><td>Nến 2 mở vượt ra ngoài nến 1, đóng lấn quá nửa thân nến 1</td><td>Lấn càng sâu càng mạnh</td></tr>
<tr><td>Harami / Harami cross</td><td>Thân nến 2 nằm trong thân nến 1</td><td>Nến 2 là doji (harami cross)</td></tr>
<tr><td>Sao mai / Sao hôm</td><td>Thân dài → ngôi sao (thân nhỏ, thường có gap) → thân dài ngược màu đóng sâu vào nến 1</td><td>Ngôi sao là doji (doji star), có gap hai phía</td></tr>
<tr><td>Đỉnh/đáy nhíp (tweezers)</td><td>Hai nến cùng đỉnh/đáy</td><td>Kết hợp với mẫu khác (ví dụ nhíp + nhấn chìm)</td></tr>
<tr><td>Ba con quạ đen / Ba chàng lính trắng</td><td>Ba thân dài cùng màu đóng gần cực trị</td><td>Sau xu hướng ngược chiều kéo dài</td></tr>
<tr><td>Belt hold</td><td>Mở cửa ở cực trị và đi một chiều</td><td>Thân rất dài</td></tr></tbody></table>
<h3>2. Cửa sổ (window) — gap trong ngôn ngữ nến</h3>
<ul><li><b>Cửa sổ tăng</b> là vùng <b>hỗ trợ</b>: các nhịp điều chỉnh thường dừng lại trong cửa sổ. Giá đóng cửa dưới đáy cửa sổ thì tín hiệu tăng bị vô hiệu.</li>
<li><b>Cửa sổ giảm</b> là vùng <b>kháng cự</b>.</li>
<li>Mẫu hình tiếp diễn có cửa sổ: <b>upside/downside gap tasuki</b>, <b>rising/falling three methods</b> (ba nến điều chỉnh nhỏ nằm trong nến dài trước đó rồi tiếp diễn).</li></ul>
<h3>3. Xu hướng hiện hành quyết định ý nghĩa</h3>
<p>Mẫu nhấn chìm tăng ở giữa xu hướng giảm mạnh không có hỗ trợ là kém tin cậy; cùng mẫu đó tại hỗ trợ lớn, sau nhịp giảm kéo dài, với khối lượng cao là đáng tin hơn nhiều. Mẫu tiếp diễn (three methods, tasuki) chỉ có giá trị <b>thuận</b> xu hướng.</p>
<h3>4. Mẫu nến như hỗ trợ/kháng cự</h3>
<ul><li>Đáy của mẫu đảo chiều tăng (ví dụ đáy thấp nhất của sao mai) trở thành <b>hỗ trợ</b>; đỉnh của mẫu đảo chiều giảm trở thành <b>kháng cự</b>.</li>
<li>Điểm dừng lỗ tự nhiên: dưới đáy mẫu hình tăng; trên đỉnh mẫu hình giảm.</li></ul>
${H.candles()}`,
    keys: ['Nhấn chìm, xuyên/mây đen (lấn quá nửa thân), harami, sao mai/hôm, nhíp, ba quạ/ba lính, belt hold.', 'Cửa sổ tăng = hỗ trợ, cửa sổ giảm = kháng cự; đóng cửa xuyên cửa sổ vô hiệu tín hiệu.', 'Mẫu tiếp diễn: tasuki, three methods — chỉ có giá trị thuận xu hướng.', 'Đáy mẫu tăng = hỗ trợ, đỉnh mẫu giảm = kháng cự — điểm dừng tự nhiên.'],
    terms: [['Window', 'Cửa sổ (gap)'], ['Rising/Falling three methods', 'Ba phương pháp tăng/giảm'], ['Tasuki gap', 'Gap tasuki'], ['Belt hold', 'Nến giữ đai'], ['Doji star', 'Sao doji']]
  }, {
    goals: ['Interpret multi-candle patterns.', 'Show the importance of the prevailing trend.', 'Read buying/selling in bodies and shadows.', 'Use patterns as support/resistance.'],
    body: () => `
<h3>1. Reversal patterns</h3><table class="tbl"><tbody><tr><td>Engulfing</td><td>body 2 engulfs body 1</td></tr><tr><td>Piercing / dark cloud</td><td>beyond the midpoint</td></tr><tr><td>Harami / harami cross</td><td>small body inside</td></tr><tr><td>Morning / evening star</td><td>long – star – long</td></tr><tr><td>Tweezers</td><td>matching highs/lows</td></tr><tr><td>Three crows / soldiers</td><td>three long bodies</td></tr><tr><td>Belt hold</td><td>opens at an extreme</td></tr></tbody></table>
<h3>2. Windows</h3><ul><li>Rising windows = support; falling windows = resistance; closes through them negate the signal.</li><li>Continuation: tasuki gaps, rising/falling three methods.</li></ul>
<h3>3. Trend context</h3><p>The same pattern varies in reliability with location, extension and volume; continuation patterns only with the trend.</p>
<h3>4. Support/resistance</h3><p>A bullish pattern’s low becomes support; a bearish pattern’s high, resistance — natural stops.</p>${H.candles()}`,
    keys: ['Multi-candle reversals.', 'Windows as S/R.', 'Continuation patterns with the trend.', 'Pattern extremes as stops.'],
    terms: [['Window', 'Candlestick gap'], ['Three methods', 'Continuation pattern']]
  }, [
    ['Mẫu nhấn chìm tăng đáng tin hơn khi:', 'A bullish engulfing is more reliable when:', ['Thân nến 2 rất lớn so với nến 1 và có khối lượng cao', 'Thân nến 2 nhỏ hơn', 'Ở giữa xu hướng tăng', 'Khối lượng rất thấp'], ['Body 2 dwarfs body 1 on high volume', 'Body 2 is smaller', 'Mid-uptrend', 'Very low volume'], 0, '', ''],
    ['Mây đen che phủ cần nến 2 đóng cửa:', 'Dark cloud cover needs candle 2 to close:', ['Dưới điểm giữa thân nến 1', 'Trên đỉnh nến 1', 'Bằng giá mở nến 1', 'Bất kỳ'], ['Below candle 1’s mid-body', 'Above candle 1’s high', 'At candle 1’s open', 'Anywhere'], 0, '', ''],
    ['Harami cross khác harami thường ở chỗ:', 'A harami cross differs because:', ['Nến 2 là doji', 'Nến 2 lớn hơn', 'Có gap', 'Có 3 nến'], ['Candle 2 is a doji', 'Candle 2 is bigger', 'There is a gap', 'Three candles'], 0, '', ''],
    ['Cửa sổ tăng có vai trò:', 'A rising window acts as:', ['Hỗ trợ', 'Kháng cự', 'Không vai trò', 'Đỉnh'], ['Support', 'Resistance', 'Nothing', 'A top'], 0, '', ''],
    ['Giá đóng cửa dưới đáy của một cửa sổ tăng nghĩa là:', 'A close below a rising window’s bottom means:', ['Tín hiệu tăng của cửa sổ bị vô hiệu', 'Tín hiệu tăng mạnh hơn', 'Không ý nghĩa', 'Cửa sổ mới'], ['The bullish window is negated', 'Stronger bullishness', 'Nothing', 'A new window'], 0, '', ''],
    ['Rising three methods là mẫu hình:', 'Rising three methods is:', ['Tiếp diễn tăng', 'Đảo chiều giảm', 'Đi ngang', 'Gap giảm'], ['Bullish continuation', 'Bearish reversal', 'Range', 'Gap down'], 0, '', ''],
    ['Trong rising three methods, các nến điều chỉnh nhỏ:', 'In rising three methods the small corrective candles:', ['Nằm trong biên độ của nến tăng dài đầu tiên', 'Thủng đáy nến đầu', 'Tạo gap giảm', 'Là doji bắt buộc'], ['Stay within the first long candle’s range', 'Break its low', 'Gap down', 'Must be dojis'], 0, '', ''],
    ['Mẫu tiếp diễn có giá trị khi:', 'Continuation patterns are valid when:', ['Thuận xu hướng hiện hành', 'Ngược xu hướng', 'Không có xu hướng', 'Bất kỳ lúc nào'], ['With the prevailing trend', 'Against it', 'With no trend', 'Any time'], 0, '', ''],
    ['Sao mai đáng tin hơn khi ngôi sao là:', 'A morning star is stronger when the star is:', ['Doji có gap hai phía', 'Nến thân dài', 'Nến tăng lớn', 'Không có'], ['A doji gapped on both sides', 'A long body', 'A big white candle', 'Absent'], 0, '', ''],
    ['Điểm dừng lỗ tự nhiên cho lệnh mua theo sao mai là:', 'Natural stop for a morning-star long:', ['Dưới đáy thấp nhất của mẫu hình', 'Trên đỉnh nến 3', 'Tại giá mở nến 2', 'Không cần'], ['Below the pattern’s lowest low', 'Above candle 3', 'At candle 2’s open', 'None'], 0, '', ''],
    ['Đỉnh nhíp mạnh hơn khi:', 'Tweezer tops are stronger when:', ['Kết hợp với mẫu khác như nhấn chìm giảm hoặc sao băng', 'Ở đáy', 'Khối lượng bằng 0', 'Không có xu hướng'], ['Combined with e.g. bearish engulfing or a shooting star', 'At bottoms', 'Zero volume', 'No trend'], 0, '', ''],
    ['Belt hold tăng là nến:', 'A bullish belt hold:', ['Mở cửa ở đáy và tăng mạnh suốt phiên', 'Mở ở đỉnh', 'Doji', 'Nến trong'], ['Opens at the low and rallies all session', 'Opens at the high', 'Doji', 'Inside bar'], 0, '', ''],
    ['Ba con quạ đen có ý nghĩa nhất khi:', 'Three black crows matter most:', ['Sau xu hướng tăng kéo dài', 'Sau xu hướng giảm', 'Đi ngang', 'Không cần bối cảnh'], ['After an extended uptrend', 'After a decline', 'In ranges', 'Context-free'], 0, '', ''],
    ['Cửa sổ giảm đóng vai trò:', 'A falling window acts as:', ['Kháng cự', 'Hỗ trợ', 'Không gì', 'Đáy'], ['Resistance', 'Support', 'Nothing', 'Bottom'], 0, '', ''],
    ['Nhấn chìm tăng ở giữa xu hướng giảm mạnh, không có hỗ trợ:', 'Bullish engulfing mid-steep-decline, no support:', ['Kém tin cậy hơn', 'Rất đáng tin', 'Tín hiệu bán', 'Không thể xảy ra'], ['Less reliable', 'Very reliable', 'Sell', 'Impossible'], 0, '', ''],
    ['Đường xuyên (piercing) là mẫu hình:', 'A piercing line is:', ['Đảo chiều tăng hai nến', 'Đảo chiều giảm', 'Tiếp diễn giảm', 'Ba nến'], ['A two-candle bullish reversal', 'Bearish reversal', 'Bearish continuation', 'Three candles'], 0, '', ''],
    ['Upside tasuki gap là mẫu:', 'An upside tasuki gap is:', ['Tiếp diễn tăng, nến giảm không lấp kín cửa sổ', 'Đảo chiều giảm', 'Doji', 'Đi ngang'], ['Bullish continuation where the down candle fails to close the window', 'Bearish reversal', 'Doji', 'Range'], 0, '', ''],
    ['Đỉnh của mẫu đảo chiều giảm trở thành:', 'The high of a bearish reversal pattern becomes:', ['Kháng cự', 'Hỗ trợ', 'Không gì', 'Mục tiêu'], ['Resistance', 'Support', 'Nothing', 'Target'], 0, '', ''],
    ['Harami thể hiện tâm lý:', 'A harami expresses:', ['Đà xu hướng chững lại, do dự', 'Tăng tốc', 'Gap', 'Cao trào'], ['Stalling momentum, hesitation', 'Acceleration', 'Gap', 'Climax'], 0, '', ''],
    ['Khác biệt giữa nhấn chìm và harami:', 'Engulfing vs harami:', ['Nhấn chìm: thân 2 bao thân 1; harami: thân 2 nằm trong thân 1', 'Giống nhau', 'Harami cần 3 nến', 'Nhấn chìm cần gap'], ['Engulfing: body 2 contains body 1; harami: body 2 inside body 1', 'Same', 'Harami needs 3', 'Engulfing needs a gap'], 0, '', '']
  ]);

  /* ================= L2-12 ================= */
  C.addLesson('l2-12', {
    goals: ['Phân tích mẫu nến cho đảo chiều và tiếp diễn trên biểu đồ thực.', 'Diễn giải mẫu nến như hỗ trợ/kháng cự và xác nhận.', 'Kết hợp phân tích biểu đồ phương Tây với nến.', 'Dùng nến trong quản trị rủi ro và trên nhiều khung thời gian.'],
    body: () => `
<h3>1. Quy trình giao dịch với nến</h3>
<ol><li><b>Bối cảnh</b>: xu hướng khung lớn, vị trí so với hỗ trợ/kháng cự, mức thoái lui, MA quan trọng.</li>
<li><b>Tín hiệu</b>: mẫu nến tại vùng then chốt.</li>
<li><b>Xác nhận</b>: nến sau đi theo hướng tín hiệu; với mẫu yêu cầu xác nhận (người treo cổ, búa ngược) điều này bắt buộc.</li>
<li><b>Tỷ lệ lợi nhuận/rủi ro</b>: điểm dừng ngoài mẫu hình, mục tiêu ở vùng hỗ trợ/kháng cự kế tiếp. Nếu R:R kém thì bỏ qua dù mẫu nến "đẹp".</li>
<li><b>Quản lý lệnh</b>: dời điểm dừng theo cửa sổ và các mẫu nến mới.</li></ol>
<h3>2. Kết hợp với kỹ thuật phương Tây</h3>
<table class="tbl"><thead><tr><th>Công cụ phương Tây</th><th>Nến bổ sung</th></tr></thead><tbody>
<tr><td>Đường xu hướng, kháng cự</td><td>Sao băng, mây đen tại kháng cự → xác nhận kháng cự giữ</td></tr>
<tr><td>Mức thoái lui Fibonacci</td><td>Búa, nhấn chìm tăng tại 50–61.8% → điểm vào theo xu hướng</td></tr>
<tr><td>MA</td><td>Nến bật lên từ MA50 trong xu hướng tăng</td></tr>
<tr><td>Dao động (RSI)</td><td>Mẫu đảo chiều + phân kỳ RSI → tín hiệu mạnh hơn</td></tr>
<tr><td>Khối lượng</td><td>Nhấn chìm với khối lượng cao → đáng tin hơn</td></tr></tbody></table>
<h3>3. Quản trị rủi ro bằng nến</h3>
<ul><li>Mẫu nến cho điểm dừng <b>gần và hợp lý</b> (đáy búa, đỉnh sao băng), giúp R:R tốt.</li>
<li>Khi mẫu nến ngược chiều xuất hiện trong lúc đang có lãi: chốt một phần hoặc thắt chặt điểm dừng.</li>
<li>Không để một mẫu nến đơn lẻ khiến bạn giao dịch ngược xu hướng lớn với quy mô đầy đủ.</li></ul>
<h3>4. Nến trên nhiều khung thời gian</h3>
<p>Một nến tuần là tổng hợp 5 nến ngày. Búa trên khung tuần có thể là cả một chuỗi giảm rồi hồi trên khung ngày. Quy trình: xác định tín hiệu trên khung lớn (tuần), tìm điểm vào chính xác trên khung nhỏ (ngày/giờ), đặt điểm dừng theo cấu trúc khung nhỏ nhưng không ngược nghĩa với khung lớn.</p>
${H.candles()}`,
    keys: ['Quy trình: bối cảnh → tín hiệu → xác nhận → R:R → quản lý lệnh.', 'Kết hợp nến với đường xu hướng, Fibonacci, MA, RSI, khối lượng.', 'Nến cho điểm dừng gần; mẫu ngược chiều khi đang lãi → chốt bớt/thắt dừng.', 'Đa khung: tín hiệu khung lớn, điểm vào khung nhỏ.'],
    terms: [['Confirmation', 'Xác nhận'], ['Multiple time frames', 'Đa khung thời gian'], ['Risk/reward filter', 'Bộ lọc lợi nhuận/rủi ro']]
  }, {
    goals: ['Analyse candle patterns on real charts.', 'Use them as S/R and confirmation.', 'Combine Western analysis with candles.', 'Use candles for risk management and multiple timeframes.'],
    body: () => `
<h3>1. Workflow</h3><ol><li>Context.</li><li>Signal at a key zone.</li><li>Confirmation.</li><li>Reward/risk — skip poor ratios.</li><li>Management via windows and new patterns.</li></ol>
<h3>2. With Western tools</h3><table class="tbl"><tbody><tr><td>Trendlines/resistance</td><td>shooting star, dark cloud</td></tr><tr><td>Fibonacci</td><td>hammer/engulfing at 50–61.8%</td></tr><tr><td>MAs</td><td>bounces from the 50-MA</td></tr><tr><td>RSI</td><td>pattern + divergence</td></tr><tr><td>Volume</td><td>high-volume engulfing</td></tr></tbody></table>
<h3>3. Risk</h3><ul><li>Tight logical stops.</li><li>Opposite patterns while in profit → scale out / tighten.</li><li>Don’t fight the major trend with full size on one candle.</li></ul>
<h3>4. Multiple timeframes</h3><p>Signal on the weekly, entry on the daily/hourly, stop on the lower-TF structure.</p>${H.candles()}`,
    keys: ['Context → signal → confirmation → R:R → management.', 'Combine with Western tools.', 'Candles give tight stops.', 'Signal high TF, entry low TF.'],
    terms: [['Confirmation', 'Next-bar follow-through'], ['Multiple time frames', 'Top-down candle reading']]
  }, [
    ['Bước đầu tiên khi giao dịch với nến là:', 'First step when trading candles:', ['Xác định bối cảnh xu hướng và vị trí', 'Tìm mẫu nến bất kỳ', 'Đặt lệnh', 'Đếm sóng'], ['Establish trend context and location', 'Find any pattern', 'Place an order', 'Count waves'], 0, '', ''],
    ['Mẫu nến đẹp nhưng R:R chỉ 1:0.5. Nên:', 'A nice pattern but R:R only 1:0.5. You should:', ['Bỏ qua giao dịch', 'Vào toàn bộ vốn', 'Tăng đòn bẩy', 'Bỏ điểm dừng'], ['Skip the trade', 'Go all-in', 'Add leverage', 'Drop the stop'], 0, '', ''],
    ['Búa xuất hiện tại mức thoái lui 61.8% trong xu hướng tăng là:', 'A hammer at the 61.8% retracement in an uptrend is:', ['Điểm vào theo xu hướng tiềm năng', 'Tín hiệu bán', 'Vô nghĩa', 'Gap'], ['A potential with-trend entry', 'Sell', 'Meaningless', 'Gap'], 0, '', ''],
    ['Mẫu đảo chiều giảm kèm phân kỳ âm RSI:', 'A bearish reversal pattern with bearish RSI divergence:', ['Tín hiệu mạnh hơn', 'Yếu hơn', 'Không liên quan', 'Mâu thuẫn'], ['A stronger signal', 'Weaker', 'Unrelated', 'Contradictory'], 0, '', ''],
    ['Khi đang có lãi mà xuất hiện mẫu nến ngược chiều, nên:', 'In profit when an opposite pattern appears, you should:', ['Chốt một phần hoặc thắt chặt điểm dừng', 'Mua thêm gấp đôi', 'Bỏ điểm dừng', 'Không làm gì'], ['Scale out or tighten the stop', 'Double up', 'Remove the stop', 'Do nothing'], 0, '', ''],
    ['Một nến tuần tổng hợp từ:', 'A weekly candle aggregates:', ['5 nến ngày (tuần giao dịch)', '1 nến ngày', '30 nến ngày', '7 nến giờ'], ['5 daily candles (trading week)', '1 daily', '30 dailies', '7 hourlies'], 0, '', ''],
    ['Quy trình đa khung với nến:', 'Multi-timeframe candle workflow:', ['Tín hiệu khung lớn, điểm vào khung nhỏ', 'Tín hiệu khung nhỏ, bỏ qua khung lớn', 'Chỉ dùng khung phút', 'Không cần'], ['Signal on the higher TF, entry on the lower TF', 'Lower TF only', 'Minute charts only', 'None'], 0, '', ''],
    ['Sao băng tại đường xu hướng giảm (kháng cự) xác nhận:', 'A shooting star at a down trendline confirms:', ['Kháng cự đang giữ', 'Phá vỡ lên', 'Hỗ trợ', 'Không gì'], ['Resistance holding', 'Upside break', 'Support', 'Nothing'], 0, '', ''],
    ['Nhấn chìm tăng với khối lượng gấp 3 trung bình tại hỗ trợ lớn:', 'A bullish engulfing on 3× volume at major support:', ['Đáng tin hơn nhiều', 'Kém tin cậy', 'Tín hiệu bán', 'Không đổi'], ['Much more reliable', 'Less reliable', 'Sell', 'Unchanged'], 0, '', ''],
    ['Điểm dừng cho lệnh bán theo sao băng nên đặt:', 'Stop for a shooting-star short:', ['Trên đỉnh bóng trên của sao băng', 'Dưới đáy', 'Tại giá mở', 'Không cần'], ['Above its upper shadow', 'Below the low', 'At the open', 'None'], 0, '', ''],
    ['Vì sao không nên giao dịch ngược xu hướng lớn với quy mô đầy đủ chỉ vì một mẫu nến?', 'Why not fight the major trend at full size on one candle?', ['Mẫu nến đơn lẻ có xác suất hạn chế; xu hướng lớn chi phối', 'Do luật', 'Nến không tồn tại', 'Không có lý do'], ['Single patterns have limited odds; the big trend dominates', 'Law', 'Candles don’t exist', 'No reason'], 0, '', ''],
    ['Cửa sổ tăng dùng để quản lý lệnh như thế nào?', 'How are rising windows used in management?', ['Dời điểm dừng xuống dưới đáy cửa sổ', 'Bán khi thấy cửa sổ', 'Bỏ qua', 'Mua thêm khi lấp'], ['Trail the stop below the window', 'Sell on sight', 'Ignore', 'Add when filled'], 0, '', ''],
    ['Búa trên biểu đồ tuần có thể tương ứng trên biểu đồ ngày với:', 'A weekly hammer may appear on the daily chart as:', ['Một chuỗi giảm rồi hồi mạnh', 'Một doji duy nhất', 'Không gì', 'Gap tăng'], ['A decline followed by a strong recovery', 'One doji', 'Nothing', 'Gap up'], 0, '', ''],
    ['Mẫu nến bật lên từ MA50 trong xu hướng tăng là:', 'A candle bounce off the 50-MA in an uptrend is:', ['Tín hiệu tiếp diễn theo xu hướng', 'Đảo chiều giảm', 'Vô nghĩa', 'Gap'], ['A with-trend continuation signal', 'Bearish reversal', 'Meaningless', 'Gap'], 0, '', ''],
    ['Xác nhận bắt buộc với:', 'Confirmation is mandatory for:', ['Người treo cổ và búa ngược', 'Marubozu', 'Mọi nến tăng', 'Không mẫu nào'], ['Hanging man and inverted hammer', 'Marubozu', 'All white candles', 'None'], 0, '', ''],
    ['Mục tiêu hợp lý cho lệnh theo mẫu nến thường là:', 'A sensible target for a candle trade is usually:', ['Vùng hỗ trợ/kháng cự kế tiếp', 'Vô hạn', 'Giá mở cửa', 'Không có'], ['The next S/R zone', 'Infinite', 'The open', 'None'], 0, '', ''],
    ['Nến cung cấp lợi thế quản trị rủi ro vì:', 'Candles help risk management because:', ['Cho điểm dừng gần, hợp lý', 'Loại bỏ rủi ro', 'Không cần dừng', 'Tăng đòn bẩy'], ['They give tight, logical stops', 'Remove risk', 'No stops needed', 'More leverage'], 0, '', ''],
    ['Điểm dừng trên khung nhỏ nên:', 'Lower-TF stops should:', ['Theo cấu trúc khung nhỏ nhưng không mâu thuẫn ý nghĩa khung lớn', 'Ngẫu nhiên', 'Rất xa', 'Không cần'], ['Follow lower-TF structure without contradicting the higher TF', 'Random', 'Very wide', 'None'], 0, '', ''],
    ['Mẫu đảo chiều tăng nhưng giá vẫn đóng cửa dưới đáy mẫu ở phiên sau:', 'A bullish pattern but the next close is below the pattern low:', ['Tín hiệu vô hiệu — thoát', 'Mua thêm', 'Tín hiệu mạnh hơn', 'Bỏ qua dừng'], ['Negated — exit', 'Add', 'Stronger', 'Ignore the stop'], 0, '', ''],
    ['Kết hợp nến với phương pháp phương Tây nhằm:', 'Combining candles with Western methods aims to:', ['Tăng xác suất nhờ hội tụ nhiều bằng chứng', 'Phức tạp hoá', 'Loại bỏ khối lượng', 'Không có mục đích'], ['Raise odds through converging evidence', 'Complicate', 'Drop volume', 'No purpose'], 0, '', '']
  ]);

  /* ================= L2-13 ================= */
  C.addLesson('l2-13', {
    goals: ['Minh hoạ nguyên nhân của "nhịp giảm giữa chu kỳ" và "đỉnh 3/4 chu kỳ".', 'Phân tích hàm ý của đảo pha (inversion).', 'Giải thích theo chu kỳ cho đỉnh tròn và đáy chữ V.', 'Diễn giải lệch trái/phải; tính dải bao MA trung tâm; dùng đường xu hướng hợp lệ (VTL).'],
    body: () => `
<h3>1. Nhịp giảm giữa chu kỳ và đỉnh 3/4</h3>
<p>Theo nguyên lý hài hoà, mỗi chu kỳ chứa hai chu kỳ bằng một nửa. Chu kỳ một nửa tạo đáy ở <b>giữa</b> chu kỳ lớn, nên khi cộng lại ta thấy một <b>nhịp giảm giữa chu kỳ</b> (mid-cycle dip). Hai đỉnh của chu kỳ nhỏ nằm quanh <b>1/4 và 3/4</b> độ dài chu kỳ lớn. Trong xu hướng tăng, đỉnh 3/4 thường cao hơn; trong xu hướng giảm, đỉnh 1/4 cao hơn.</p>
${fig.midcycle('vi')}
<h3>2. Đảo pha (inversion)</h3>
<p>Đảo pha xảy ra khi tại thời điểm dự kiến đáy chu kỳ lại xuất hiện <b>đỉnh</b> (hoặc ngược lại). Nguyên nhân: một chu kỳ khác (thường lớn hơn) đang chi phối, hoặc tin tức bất ngờ. Hàm ý: đừng giao dịch máy móc theo ngày dự kiến; khi giá hành xử ngược chu kỳ, có thể cấu trúc chu kỳ lớn hơn đang thay đổi.</p>
<h3>3. Đỉnh tròn và đáy chữ V</h3>
<p>Khi nhiều chu kỳ cùng tạo đáy (đồng bộ), các thành phần cộng hưởng tạo ra <b>đáy sắc nhọn (chữ V)</b>. Ở đỉnh, các chu kỳ thường <b>lệch pha</b> (chu kỳ nhỏ đã quay xuống trong khi chu kỳ lớn vẫn còn đi lên), tạo ra <b>đỉnh tròn</b> hoặc phức tạp. Đây là lý do chu kỳ thường được đo từ đáy đến đáy.</p>
<h3>4. Lệch trái/phải</h3>
<p>Lệch phải: đỉnh sau điểm giữa chu kỳ, cho thấy xu hướng tăng ở cấp lớn hơn. Lệch trái: đỉnh trước điểm giữa, cho thấy xu hướng giảm. Một chu kỳ lệch trái sau chuỗi lệch phải cảnh báo xu hướng lớn có thể đổi chiều.</p>
<h3>5. Dải bao MA trung tâm (CMA envelope)</h3>
<ul><li>Tính SMA có độ dài bằng <b>nửa chu kỳ</b> (ví dụ chu kỳ 40 ngày → SMA 20).</li>
<li><b>Dời lùi</b> MA đó về giữa cửa sổ: dời (n − 1)/2 kỳ. Với SMA 21 kỳ là dời 10 kỳ.</li>
<li>Vẽ hai đường song song trên/dưới sao cho bao gần hết các dao động. Dải bao cho thấy xu hướng của chu kỳ lớn hơn và biên độ của chu kỳ đang phân tích.</li>
<li>Hạn chế: thiếu dữ liệu ở nửa chu kỳ cuối; phải <b>ngoại suy</b> phần cuối của đường MA dựa trên kinh nghiệm và xu hướng.</li></ul>
<h3>6. Đường xu hướng hợp lệ (Valid Trend Line — VTL)</h3>
${fig.vtl('vi')}
<ul><li>VTL tăng nối hai đáy <b>liên tiếp</b> của chu kỳ nhỏ hơn bên trong chu kỳ đang xét, và <b>không cắt qua giá</b> giữa hai điểm đó.</li>
<li>Giá đóng cửa thủng VTL tăng xác nhận <b>đỉnh của chu kỳ lớn đã qua</b> và giá đang đi về đáy chu kỳ.</li>
<li>VTL giảm (nối các đỉnh) bị vượt xác nhận đáy chu kỳ đã qua.</li>
<li>Có thể dùng VTL để ước lượng mục tiêu giảm: khoảng cách từ đỉnh đến VTL, chiếu từ điểm thủng.</li></ul>`,
    keys: ['Chu kỳ một nửa tạo nhịp giảm giữa chu kỳ; đỉnh của chu kỳ nhỏ ở khoảng 1/4 và 3/4.', 'Đảo pha: đỉnh ở thời điểm dự kiến đáy — đừng giao dịch máy móc theo ngày.', 'Đồng bộ ở đáy tạo đáy chữ V; lệch pha ở đỉnh tạo đỉnh tròn.', 'Lệch phải = xu hướng tăng, lệch trái = giảm.', 'CMA: SMA nửa chu kỳ dời lùi (n−1)/2; thiếu dữ liệu ở cuối.', 'VTL nối hai đáy chu kỳ nhỏ liên tiếp không cắt giá; thủng VTL xác nhận đỉnh chu kỳ.'],
    terms: [['Mid-cycle dip', 'Nhịp giảm giữa chu kỳ'], ['3/4 cycle high', 'Đỉnh 3/4 chu kỳ'], ['Inversion', 'Đảo pha'], ['Centered MA envelope', 'Dải bao MA trung tâm'], ['Valid Trend Line (VTL)', 'Đường xu hướng hợp lệ']]
  }, {
    goals: ['Explain the mid-cycle dip and 3/4 cycle high.', 'Analyse inversions.', 'Cyclical rounded tops and V-bottoms.', 'Translation; CMA envelopes; VTLs.'],
    body: () => `
<h3>1. Mid-cycle dip</h3><p>The half-cycle bottoms mid-way, producing a dip; its crests sit near 1/4 and 3/4. In uptrends the 3/4 crest is often higher.</p>${fig.midcycle('en')}
<h3>2. Inversions</h3><p>A crest where a trough was expected — a larger cycle or news dominates; don’t trade dates mechanically.</p>
<h3>3. Rounded tops, V-bottoms</h3><p>Synchronised troughs make sharp V-bottoms; out-of-phase crests make rounded tops — hence trough-to-trough measurement.</p>
<h3>4. Translation</h3><p>Right = uptrend; left = downtrend; a left-translated cycle after right ones warns.</p>
<h3>5. CMA envelope</h3><ul><li>SMA of half the cycle length.</li><li>Shift back (n − 1)/2 bars.</li><li>Parallel bands enclosing swings.</li><li>The latest half-cycle must be extrapolated.</li></ul>
<h3>6. VTL</h3>${fig.vtl('en')}<ul><li>Connect consecutive lows of the smaller cycle without cutting price.</li><li>A close below an up-VTL confirms the larger cycle topped.</li><li>Down-VTL breaks confirm troughs.</li><li>Measured targets from the VTL.</li></ul>`,
    keys: ['Mid-cycle dip; 1/4 and 3/4 crests.', 'Inversions.', 'V-bottoms vs rounded tops.', 'Translation.', 'CMA shifted (n−1)/2.', 'VTL breaks confirm turns.'],
    terms: [['Inversion', 'Crest at an expected trough'], ['VTL', 'Valid trend line']]
  }, [
    ['Nhịp giảm giữa chu kỳ là do:', 'The mid-cycle dip is caused by:', ['Chu kỳ một nửa tạo đáy ở giữa chu kỳ lớn', 'Tin tức', 'Khối lượng thấp', 'Cổ tức'], ['The half-cycle bottoming mid-way', 'News', 'Low volume', 'Dividends'], 0, '', ''],
    ['Trong chu kỳ 40 ngày, các đỉnh của chu kỳ 20 ngày thường nằm quanh ngày:', 'In a 40-day cycle the 20-day crests sit near days:', ['10 và 30', '20 và 40', '5 và 15', '0 và 20'], ['10 and 30', '20 and 40', '5 and 15', '0 and 20'], 0, '1/4 và 3/4 của 40.', ''],
    ['Trong xu hướng tăng, đỉnh nào trong hai đỉnh 1/4 và 3/4 thường cao hơn?', 'In an uptrend which crest is usually higher?', ['Đỉnh 1/4', 'Đỉnh 3/4', 'Bằng nhau', 'Không có đỉnh'], ['1/4', '3/4', 'Equal', 'None'], 1, 'Lệch phải.', ''],
    ['Đảo pha (inversion) là:', 'An inversion is:', ['Đỉnh xuất hiện ở thời điểm dự kiến đáy', 'Chu kỳ dài gấp đôi', 'Không có chu kỳ', 'Gap'], ['A crest at an expected trough', 'Doubled cycle', 'No cycle', 'Gap'], 0, '', ''],
    ['Hàm ý thực tiễn của đảo pha:', 'Practical implication of inversions:', ['Không giao dịch máy móc theo ngày dự kiến', 'Luôn mua đúng ngày', 'Bỏ chu kỳ', 'Tăng đòn bẩy'], ['Don’t trade expected dates mechanically', 'Always buy on the date', 'Abandon cycles', 'More leverage'], 0, '', ''],
    ['Vì sao đáy thường sắc nhọn (chữ V)?', 'Why are bottoms often sharp V-shapes?', ['Nhiều chu kỳ cùng tạo đáy (đồng bộ) và cộng hưởng', 'Do luật', 'Ngẫu nhiên', 'Không đúng'], ['Several cycles bottom together and reinforce', 'Law', 'Random', 'False'], 0, '', ''],
    ['Đỉnh tròn hình thành do:', 'Rounded tops form because:', ['Các chu kỳ lệch pha ở đỉnh', 'Các chu kỳ đồng bộ', 'Không có chu kỳ', 'Gap'], ['Cycles are out of phase at tops', 'Cycles synchronise', 'No cycles', 'Gap'], 0, '', ''],
    ['Để phân tích chu kỳ 40 ngày bằng CMA, dùng SMA:', 'For a 40-day cycle the CMA uses an SMA of:', ['40', '20 (nửa chu kỳ)', '80', '10'], ['40', '20 (half cycle)', '80', '10'], 1, '', ''],
    ['SMA 21 kỳ trong CMA được dời lùi bao nhiêu kỳ?', 'A 21-bar SMA in a CMA is shifted back:', ['21', '10', '7', '1'], null, 1, '(21 − 1)/2 = 10.', ''],
    ['Hạn chế chính của CMA:', 'The CMA’s main limitation:', ['Thiếu dữ liệu ở nửa chu kỳ gần nhất — phải ngoại suy', 'Quá nhanh', 'Không làm mượt', 'Cần khối lượng'], ['Missing the latest half-cycle — must extrapolate', 'Too fast', 'No smoothing', 'Needs volume'], 0, '', ''],
    ['VTL tăng nối:', 'An up-VTL connects:', ['Hai đáy liên tiếp của chu kỳ nhỏ hơn, không cắt qua giá', 'Hai đỉnh bất kỳ', 'Đáy và đỉnh', 'Các MA'], ['Two consecutive lows of the smaller cycle without cutting price', 'Any two highs', 'A low and a high', 'MAs'], 0, '', ''],
    ['Giá đóng cửa thủng VTL tăng xác nhận:', 'A close below an up-VTL confirms:', ['Đỉnh chu kỳ lớn đã qua', 'Đáy chu kỳ', 'Xu hướng tăng tiếp', 'Không gì'], ['The larger cycle has topped', 'A cycle low', 'Continued rise', 'Nothing'], 0, '', ''],
    ['Đường VTL không hợp lệ khi:', 'A VTL is invalid when:', ['Cắt qua giá giữa hai điểm nối', 'Nối hai đáy', 'Dốc lên', 'Có khối lượng'], ['It cuts through price between its points', 'It joins two lows', 'It slopes up', 'There is volume'], 0, '', ''],
    ['Chu kỳ lệch trái cho thấy:', 'Left translation indicates:', ['Xu hướng giảm ở cấp lớn hơn', 'Xu hướng tăng', 'Đi ngang chắc chắn', 'Không gì'], ['A downtrend at a higher degree', 'Uptrend', 'Certain range', 'Nothing'], 0, '', ''],
    ['Vì sao chu kỳ thường đo từ đáy đến đáy?', 'Why measure trough to trough?', ['Đáy sắc nét hơn do đồng bộ; đỉnh thường tròn và lệch', 'Do quy ước pháp lý', 'Đỉnh không tồn tại', 'Không lý do'], ['Troughs are sharper (synchronised); crests are rounded and translated', 'Legal convention', 'No crests', 'No reason'], 0, '', ''],
    ['Mục tiêu giảm ước lượng từ VTL:', 'A downside estimate from a VTL:', ['Khoảng cách từ đỉnh đến VTL, chiếu từ điểm thủng', 'Bằng 0', 'Gấp đôi giá', 'Không có'], ['Peak-to-VTL distance projected from the break', 'Zero', 'Double the price', 'None'], 0, '', ''],
    ['Nhịp giảm giữa chu kỳ trong xu hướng tăng thường là:', 'A mid-cycle dip within an uptrend is often:', ['Cơ hội mua theo xu hướng', 'Đỉnh chu kỳ lớn', 'Tín hiệu bán khống mạnh', 'Vô nghĩa'], ['A with-trend buying opportunity', 'The major top', 'A strong short', 'Meaningless'], 0, '', ''],
    ['Dải bao CMA cho biết:', 'A CMA envelope shows:', ['Xu hướng của chu kỳ lớn hơn và biên độ chu kỳ đang xét', 'Khối lượng', 'Lãi suất', 'Cổ tức'], ['The larger cycle’s trend and the analysed cycle’s amplitude', 'Volume', 'Rates', 'Dividends'], 0, '', ''],
    ['VTL giảm (nối các đỉnh) bị vượt lên xác nhận:', 'A break above a down-VTL confirms:', ['Đáy chu kỳ đã qua', 'Đỉnh chu kỳ', 'Không gì', 'Đảo pha'], ['A cycle trough has passed', 'A crest', 'Nothing', 'Inversion'], 0, '', ''],
    ['Đỉnh 1/4 cao hơn đỉnh 3/4 trong một chu kỳ gợi ý:', 'A 1/4 crest above the 3/4 crest suggests:', ['Lệch trái — xu hướng giảm ở cấp lớn hơn', 'Lệch phải', 'Đồng bộ', 'Không gì'], ['Left translation — higher-degree downtrend', 'Right translation', 'Synchronicity', 'Nothing'], 0, '', '']
  ]);

  /* ================= L2-14 ================= */
  C.addLesson('l2-14', {
    goals: ['Trình bày các bước phân tích chu kỳ toàn diện.', 'Phân biệt công cụ tìm chu kỳ và công cụ xác định pha chu kỳ.', 'Hiểu cách nhận diện chu kỳ trội bằng phổ (spectrogram).', 'So sánh việc phân pha các chu kỳ hài hoà nhỏ và lớn.'],
    body: () => `
<h3>1. Các bước phân tích chu kỳ toàn diện</h3>
<ol><li><b>Chuẩn bị dữ liệu</b>: đủ dài (ít nhất vài lần chu kỳ dài nhất cần xét), làm sạch, khử xu hướng nếu cần.</li>
<li><b>Tìm chu kỳ</b>: xác định các độ dài chu kỳ có thể có (đếm đáy–đáy, phân tích phổ).</li>
<li><b>Kiểm tra độ tin cậy</b>: chu kỳ có lặp lại ổn định, có ý nghĩa thống kê, có quan hệ hài hoà với chu kỳ khác?</li>
<li><b>Phân pha</b>: xác định vị trí hiện tại trong mỗi chu kỳ (đáy gần nhất ở đâu, đang ở pha nào).</li>
<li><b>Tổng hợp</b>: kết hợp các chu kỳ để dự kiến vùng thời gian đỉnh/đáy kế tiếp.</li>
<li><b>Xác nhận bằng giá</b>: VTL, phá vỡ, mẫu hình, dao động.</li></ol>
<h3>2. Tìm chu kỳ và phân pha chu kỳ — hai việc khác nhau</h3>
<table class="tbl"><thead><tr><th>Mục đích</th><th>Công cụ</th></tr></thead><tbody>
<tr><td><b>Tìm</b> chu kỳ (độ dài là bao nhiêu?)</td><td>Phân tích phổ/Fourier, MESA, periodogram, spectrogram, tự tương quan, đếm đáy–đáy</td></tr>
<tr><td><b>Phân pha</b> chu kỳ (đang ở đâu trong chu kỳ?)</td><td>Dải bao CMA, VTL, dao động detrend, đánh dấu đáy trực quan, công cụ thước chu kỳ</td></tr></tbody></table>
<h3>3. Spectrogram</h3>
<p>Phổ (periodogram) cho biết <b>độ mạnh</b> của từng độ dài chu kỳ trong một đoạn dữ liệu. <b>Spectrogram</b> lặp lại phép phân tích phổ trên cửa sổ trượt theo thời gian và hiển thị dạng bản đồ nhiệt: trục ngang là thời gian, trục dọc là độ dài chu kỳ, màu là độ mạnh. Chu kỳ trội hiện ra như một <b>dải sáng</b> kéo dài. Nếu dải đó ổn định theo thời gian thì chu kỳ đáng tin; nếu dải trôi hoặc đứt quãng thì chu kỳ không ổn định.</p>
<h3>4. Phân pha từ chu kỳ nhỏ đến chu kỳ lớn</h3>
<ul><li>Bắt đầu từ <b>chu kỳ nhỏ</b> (dễ thấy, nhiều mẫu): đánh dấu các đáy của nó.</li>
<li>Nhóm các đáy nhỏ theo hài hoà (thường 2 đáy nhỏ = 1 chu kỳ lớn hơn) để xác định đáy của chu kỳ lớn hơn. Đáy của chu kỳ lớn thường là <b>đáy thấp nhất</b> trong nhóm và thường sắc nhọn hơn (đồng bộ).</li>
<li>Kiểm tra tính nhất quán: đáy của chu kỳ lớn phải trùng với một đáy của chu kỳ nhỏ (nguyên lý đồng bộ).</li>
<li>Khi các cấp chu kỳ cùng dự kiến tạo đáy trong một vùng thời gian, đó là cơ hội có xác suất cao nhất.</li></ul>
${H.cycles()}`,
    keys: ['Quy trình: dữ liệu → tìm chu kỳ → kiểm tra độ tin cậy → phân pha → tổng hợp → xác nhận bằng giá.', 'Công cụ tìm chu kỳ (phổ, Fourier, MESA, spectrogram) khác công cụ phân pha (CMA, VTL, detrend).', 'Spectrogram: phổ trên cửa sổ trượt; chu kỳ trội là dải sáng ổn định.', 'Phân pha từ chu kỳ nhỏ lên lớn; đáy lớn trùng một đáy nhỏ; nhiều cấp cùng tạo đáy = xác suất cao.'],
    terms: [['Periodogram', 'Đồ thị phổ'], ['Spectrogram', 'Phổ đồ theo thời gian'], ['Phasing', 'Phân pha'], ['Dominant cycle', 'Chu kỳ trội'], ['Autocorrelation', 'Tự tương quan']]
  }, {
    goals: ['Steps of comprehensive cycle analysis.', 'Tools that find vs phase cycles.', 'Identifying the dominant cycle with a spectrogram.', 'Phasing smaller vs larger harmonics.'],
    body: () => `
<h3>1. Steps</h3><ol><li>Prepare data.</li><li>Find cycles.</li><li>Test reliability.</li><li>Phase them.</li><li>Combine.</li><li>Confirm with price.</li></ol>
<h3>2. Finding vs phasing</h3><table class="tbl"><tbody><tr><td>Find</td><td>Fourier, MESA, periodograms, spectrograms, autocorrelation, trough counts</td></tr><tr><td>Phase</td><td>CMA envelopes, VTLs, detrended oscillators, visual troughs</td></tr></tbody></table>
<h3>3. Spectrogram</h3><p>Rolling spectral analysis shown as a heat map; a dominant cycle is a stable bright band.</p>
<h3>4. Phasing harmonics</h3><ul><li>Start with the smaller cycle’s troughs.</li><li>Group them harmonically to locate larger troughs (lowest, sharper).</li><li>Larger troughs must coincide with smaller ones.</li><li>Multi-degree troughs in one window offer the best odds.</li></ul>${H.cycles()}`,
    keys: ['Six-step process.', 'Finding vs phasing tools.', 'Spectrogram bands.', 'Phase small to large; synchronised troughs.'],
    terms: [['Spectrogram', 'Rolling spectrum heat map'], ['Phasing', 'Locating position within cycles']]
  }, [
    ['Bước nào đến TRƯỚC trong phân tích chu kỳ?', 'Which comes FIRST in cycle analysis?', ['Phân pha', 'Tìm các độ dài chu kỳ', 'Xác nhận bằng giá', 'Tổng hợp'], ['Phasing', 'Finding cycle lengths', 'Price confirmation', 'Combining'], 1, '', ''],
    ['Công cụ nào dùng để TÌM chu kỳ?', 'Which tool FINDS cycles?', ['VTL', 'Phân tích phổ / spectrogram', 'Dải bao CMA', 'Mẫu nến'], ['VTL', 'Spectral analysis / spectrogram', 'CMA envelope', 'Candles'], 1, '', ''],
    ['Công cụ nào dùng để PHÂN PHA chu kỳ?', 'Which tool PHASES cycles?', ['Periodogram', 'Dải bao CMA và VTL', 'Fourier', 'MESA'], ['Periodogram', 'CMA envelopes and VTLs', 'Fourier', 'MESA'], 1, '', ''],
    ['Spectrogram hiển thị:', 'A spectrogram shows:', ['Độ mạnh của các độ dài chu kỳ theo thời gian', 'Giá đóng cửa', 'Khối lượng', 'Lãi suất'], ['Cycle strength across lengths over time', 'Closes', 'Volume', 'Rates'], 0, '', ''],
    ['Trên spectrogram, chu kỳ trội đáng tin xuất hiện như:', 'On a spectrogram a reliable dominant cycle appears as:', ['Dải sáng ổn định kéo dài theo thời gian', 'Điểm sáng đơn lẻ', 'Vùng tối', 'Đường chéo ngẫu nhiên'], ['A stable bright band over time', 'A single bright dot', 'A dark area', 'A random diagonal'], 0, '', ''],
    ['Dải sáng trên spectrogram trôi liên tục sang độ dài khác cho thấy:', 'A bright band drifting across lengths indicates:', ['Chu kỳ không ổn định', 'Chu kỳ rất ổn định', 'Lỗi dữ liệu chắc chắn', 'Xu hướng mạnh'], ['An unstable cycle', 'A very stable cycle', 'Certain data error', 'Strong trend'], 0, '', ''],
    ['Khi phân pha, nên bắt đầu từ:', 'Phasing should start with:', ['Chu kỳ nhỏ (nhiều mẫu, dễ thấy)', 'Chu kỳ lớn nhất', 'Ngẫu nhiên', 'Khối lượng'], ['The smaller cycle (many examples)', 'The largest', 'Random', 'Volume'], 0, '', ''],
    ['Đáy của chu kỳ lớn thường:', 'A larger-cycle trough is usually:', ['Là đáy thấp nhất trong nhóm đáy nhỏ và trùng với một đáy nhỏ', 'Nằm giữa hai đáy nhỏ', 'Không trùng đáy nào', 'Là đỉnh'], ['The lowest of its group of small troughs and coincides with one', 'Between two small troughs', 'Coincides with none', 'A crest'], 0, '', ''],
    ['Cơ hội có xác suất cao nhất trong phân tích chu kỳ là khi:', 'The highest-probability cycle setup is when:', ['Nhiều cấp chu kỳ cùng dự kiến tạo đáy trong một vùng thời gian', 'Chỉ một chu kỳ nhỏ tạo đáy', 'Không có chu kỳ', 'Đảo pha'], ['Several degrees expect troughs in one window', 'Only a small cycle bottoms', 'No cycles', 'Inversion'], 0, '', ''],
    ['Bước "kiểm tra độ tin cậy" chu kỳ xem xét:', '"Reliability testing" checks:', ['Lặp lại ổn định, ý nghĩa thống kê, quan hệ hài hoà', 'Màu biểu đồ', 'Tên mã', 'Tin tức'], ['Stable repetition, significance, harmonic relations', 'Chart colour', 'Ticker', 'News'], 0, '', ''],
    ['Tự tương quan (autocorrelation) có thể giúp:', 'Autocorrelation can help:', ['Phát hiện độ dài chu kỳ lặp lại', 'Tính cổ tức', 'Vẽ nến', 'Đo độ rộng'], ['Detect repeating cycle lengths', 'Dividends', 'Candles', 'Breadth'], 0, '', ''],
    ['Bước cuối cùng của phân tích chu kỳ là:', 'The last step of cycle analysis:', ['Xác nhận bằng hành động giá', 'Tìm chu kỳ', 'Chuẩn bị dữ liệu', 'Bỏ qua'], ['Confirming with price action', 'Finding cycles', 'Preparing data', 'Skip'], 0, '', ''],
    ['Dữ liệu cho phân tích chu kỳ nên dài ít nhất:', 'Cycle data should span at least:', ['Vài lần chu kỳ dài nhất cần xét', 'Một nửa chu kỳ', 'Một ngày', 'Không quan trọng'], ['Several times the longest cycle studied', 'Half a cycle', 'One day', 'Irrelevant'], 0, '', ''],
    ['Nhóm 2 đáy chu kỳ 20 ngày thường tạo thành:', 'Grouping two 20-day troughs usually forms:', ['Một chu kỳ 40 ngày', 'Chu kỳ 10 ngày', 'Chu kỳ 20 ngày', 'Không gì'], ['A 40-day cycle', '10-day', '20-day', 'Nothing'], 0, 'Hài hoà × 2.', ''],
    ['Vì sao cần khử xu hướng trước khi phân tích phổ?', 'Why detrend before spectral analysis?', ['Xu hướng dài làm méo phổ, che các chu kỳ ngắn', 'Cho đẹp', 'Giảm dữ liệu', 'Không cần'], ['A long trend distorts the spectrum and hides shorter cycles', 'Aesthetics', 'Less data', 'No need'], 0, '', ''],
    ['Đáy nhỏ không trùng với đáy chu kỳ lớn dự kiến. Có thể là do:', 'A small trough not aligning with the expected larger trough may be due to:', ['Phân pha sai hoặc chu kỳ biến đổi', 'Luật', 'Khối lượng', 'Không thể'], ['Mis-phasing or cycle variation', 'Law', 'Volume', 'Impossible'], 0, '', ''],
    ['MESA và Fourier khác nhau chủ yếu ở:', 'MESA vs Fourier differ mainly in:', ['Phương pháp ước lượng phổ (MESA phù hợp hơn với dữ liệu ngắn)', 'Không khác', 'MESA dùng khối lượng', 'Fourier chỉ cho tuần'], ['Estimation method (MESA suits shorter data)', 'No difference', 'MESA uses volume', 'Fourier weekly only'], 0, '', ''],
    ['Kết quả của phân tích chu kỳ nên được trình bày như:', 'Cycle analysis output should be stated as:', ['Vùng thời gian kỳ vọng cho đỉnh/đáy', 'Ngày chính xác tuyệt đối', 'Giá mục tiêu chắc chắn', 'Không có kết quả'], ['Expected time windows for turns', 'Exact dates', 'Certain price targets', 'Nothing'], 0, '', ''],
    ['Phân pha chu kỳ trả lời câu hỏi:', 'Phasing answers:', ['Hiện đang ở vị trí nào trong chu kỳ?', 'Chu kỳ dài bao nhiêu?', 'Khối lượng bao nhiêu?', 'Ai giao dịch?'], ['Where are we within the cycle?', 'How long is it?', 'Volume?', 'Who trades?'], 0, '', ''],
    ['Tìm chu kỳ trả lời câu hỏi:', 'Finding cycles answers:', ['Chu kỳ dài bao nhiêu?', 'Đang ở pha nào?', 'Mua ở đâu?', 'Cổ tức bao nhiêu?'], ['How long is the cycle?', 'Which phase?', 'Where to buy?', 'Dividend?'], 0, '', '']
  ]);
})(window.LLW);
