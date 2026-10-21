/* CMT Level 2 — Part 1 (a), lessons 1–7. Written by Lai Long Master TA in its own words. */
(function (L) {
  'use strict';
  const C = L.cmt, F = C.fig, H = C.demoHtml;
  const T = (lg, vi, en) => (lg === 'en' ? en : vi);

  /* ---------- figures ---------- */
  const fig = {
    workflow: lg => `<div class="flow">${(lg === 'en'
      ? ['1. Monthly/weekly: primary trend & cycle', '2. Daily: structure, S/R zones, trendlines', '3. Pattern & candles at key zones', '4. Confirmation: volume, momentum, breadth', '5. Plan: entry, stop, target, R:R, size']
      : ['1. Tháng/tuần: xu hướng cấp 1 & chu kỳ', '2. Ngày: cấu trúc, vùng hỗ trợ/kháng cự, đường xu hướng', '3. Mẫu hình & nến tại vùng then chốt', '4. Xác nhận: khối lượng, động lượng, độ rộng', '5. Kế hoạch: vào, dừng, mục tiêu, R:R, khối lượng']).map(s => `<div class="flow-step">${s}</div>`).join('<div class="flow-arrow">→</div>')}</div>`,
    dmi: lg => F.line({ h: 250, hl: [[25, 's-sep', 'ADX 25']], series: [{ pts: [[0, 15], [15, 18], [30, 30], [45, 42], [60, 48], [72, 44], [85, 33], [100, 22]] }, { pts: [[0, 30], [20, 28], [35, 45], [55, 55], [75, 40], [100, 30]], cls: 's-price2' }, { pts: [[0, 32], [20, 33], [35, 20], [55, 14], [75, 22], [100, 30]], cls: 's-stop' }],
      labels: [[60, 48, 'ADX', 't'], [55, 55, '+DI', 't'], [55, 14, '−DI', 'b'], [72, 44, T(lg, 'ADX quay đầu', 'ADX turns down'), 'r']],
      caption: T(lg, 'ADX tăng trên 25 khi +DI tách xa −DI: xu hướng tăng mạnh dần; ADX quay đầu: xu hướng yếu đi (chưa chắc đảo chiều)', 'ADX rising above 25 as +DI separates from −DI: strengthening uptrend; ADX turning down: weakening (not necessarily reversing)') }),
    weights: lg => F.row(
      F.line({ w: 240, h: 170, series: [{ pts: [[0, 50], [100, 50]] }], caption: T(lg, 'SMA: trọng số đều', 'SMA: equal weights') }),
      F.line({ w: 240, h: 170, series: [{ pts: [[0, 10], [100, 90]] }], caption: T(lg, 'WMA: tăng tuyến tính', 'WMA: linear') }),
      F.line({ w: 240, h: 170, series: [{ pts: Array.from({ length: 21 }, (_, k) => [k * 5, 8 + 85 * Math.pow(0.88, 20 - k)]) }], caption: T(lg, 'EMA: giảm theo hàm mũ', 'EMA: exponential decay') }),
      F.line({ w: 240, h: 170, series: [{ pts: [[0, 10], [50, 90], [100, 10]] }], caption: T(lg, 'Tam giác: nặng ở giữa', 'Triangular: centre-weighted') }))
  };

  /* ================= L2-01 ================= */
  C.addLesson('l2-01', {
    goals: ['Vận dụng 6 nguyên lý Dow vào đọc biểu đồ hiện đại.', 'Xác định và xếp hạng các vùng hỗ trợ/kháng cự theo độ tin cậy.', 'Đánh giá đường xu hướng, kênh và các tín hiệu phá vỡ.', 'Phân loại khoảng trống và áp dụng mục tiêu giá cho từng mẫu hình.', 'Thực hiện quy trình phân tích biểu đồ từ trên xuống một cách nhất quán.'],
    body: () => `
<h3>1. Từ kiến thức rời rạc đến quy trình phân tích</h3>
<p>Level 1 trang bị từng công cụ. Level 2 yêu cầu <b>kết hợp chúng thành một quy trình nhất quán</b>, có thứ tự ưu tiên và có thể kiểm tra lại. Một nhà phân tích chuyên nghiệp luôn đi từ khung lớn xuống khung nhỏ, từ bối cảnh tới tín hiệu, rồi tới kế hoạch.</p>
${fig.workflow('vi')}
<h3>2. Lý thuyết Dow ở thực tế hiện đại</h3>
<ul><li><b>Chỉ số phản ánh tất cả</b>: đọc chỉ số chính trước khi đọc cổ phiếu (bước 1 Wyckoff).</li>
<li><b>Ba cấp xu hướng</b>: chọn khung giao dịch, xác định xu hướng cấp cao hơn một bậc làm "bộ lọc".</li>
<li><b>Ba giai đoạn</b>: định vị thị trường đang ở tích lũy, tham gia đại chúng hay hưng phấn để chọn chiến thuật (mua đột phá, mua điều chỉnh hay chốt lời).</li>
<li><b>Xác nhận</b>: thay cặp Công nghiệp–Vận tải bằng chỉ số chính với chỉ số vốn hoá nhỏ, chỉ số ngành dẫn dắt, đường A/D.</li>
<li><b>Khối lượng</b> và <b>xu hướng còn hiệu lực đến khi có tín hiệu đảo chiều</b> vẫn giữ nguyên giá trị.</li></ul>
<h3>3. Xếp hạng vùng hỗ trợ/kháng cự</h3>
<table class="tbl"><thead><tr><th>Nguồn</th><th>Độ tin cậy</th><th>Ghi chú</th></tr></thead><tbody>
<tr><td>Đỉnh/đáy lớn ở khung tuần, tháng</td><td>Rất cao</td><td>Nhiều người tham gia nhớ mức này</td></tr>
<tr><td>Vùng tích lũy/phân phối dài (TR)</td><td>Cao</td><td>Khối lượng lớn đã giao dịch tại đó</td></tr>
<tr><td>Đường xu hướng/kênh nhiều lần chạm</td><td>Trung bình – cao</td><td>Phụ thuộc thang giá, độ dốc</td></tr>
<tr><td>Khoảng trống chưa lấp, mức thoái lui 50%, MA 200</td><td>Trung bình</td><td>Mạnh hơn khi trùng với nguồn khác</td></tr>
<tr><td>Số tròn</td><td>Thấp – trung bình</td><td>Tâm lý, nơi tập trung lệnh chờ</td></tr></tbody></table>
<p>Nguyên tắc vàng: <b>sự hội tụ (confluence)</b>. Một vùng có 3 nguồn trùng nhau đáng tin hơn nhiều so với một mức đơn lẻ.</p>
${H.srZones()}
<h3>4. Đường xu hướng và kênh: tiêu chí chuyên nghiệp</h3>
<ul><li>Hợp lệ khi có ≥ 3 lần chạm, các điểm chạm cách nhau hợp lý (không dồn trong vài phiên).</li>
<li>Đường "nội bộ" (internal trendline) đi xuyên qua thân nến nhưng nối nhiều điểm hơn có thể hữu ích hơn đường nối các cực trị.</li>
<li>Phá vỡ kênh theo chiều xu hướng (vượt biên trên của kênh tăng) báo hiệu tăng tốc; mục tiêu thường bằng độ rộng kênh cộng thêm từ điểm phá.</li>
<li>Phá vỡ đường xu hướng cần bộ lọc (giá đóng cửa, %, ATR, thời gian) như mọi phá vỡ khác.</li></ul>
<h3>5. Mục tiêu giá theo mẫu hình — bảng tổng hợp</h3>
<table class="tbl"><thead><tr><th>Mẫu hình</th><th>Cách đo</th></tr></thead><tbody>
<tr><td>Vai–đầu–vai</td><td>Khoảng cách đầu → đường viền cổ, chiếu từ điểm phá đường viền cổ</td></tr>
<tr><td>Hai đỉnh/đáy, hình chữ nhật</td><td>Chiều cao mẫu hình, chiếu từ điểm phá</td></tr>
<tr><td>Tam giác</td><td>Chiều cao phần rộng nhất, chiếu từ điểm phá (hoặc vẽ đường song song qua điểm đầu)</td></tr>
<tr><td>Cờ, cờ đuôi nheo</td><td>Chiều dài cột cờ, chiếu từ điểm phá</td></tr>
<tr><td>Phá vỡ kênh</td><td>Độ rộng kênh</td></tr>
<tr><td>Gap tiếp diễn</td><td>Khoảng cách từ điểm bắt đầu nước đi đến gap, chiếu thêm một lần</td></tr>
<tr><td>Đếm P&F</td><td>Số cột × ô × đảo chiều (ngang) hoặc chiều dài cột × đảo chiều (dọc)</td></tr></tbody></table>
<p>Mục tiêu là <b>tối thiểu và tham khảo</b>. Trên thực tế, giá thường đạt mục tiêu ở tỷ lệ cao hơn khi phá vỡ thuận xu hướng chính và có khối lượng xác nhận.</p>
<h3>6. Nến trong bối cảnh</h3>
<p>Mẫu nến chỉ có ý nghĩa tại <b>vị trí then chốt</b> (vùng hỗ trợ/kháng cự, mức thoái lui, biên kênh) và cần <b>xác nhận</b> từ nến kế tiếp. Ba nội dung chuyên sâu về nến được học ở Bài 10–12.</p>`,
    keys: ['Quy trình từ trên xuống: xu hướng cấp cao → cấu trúc → mẫu hình/nến tại vùng then chốt → xác nhận → kế hoạch.', 'Nguyên lý Dow hiện đại hoá: xác nhận bằng chỉ số nhỏ, ngành dẫn dắt, đường A/D.', 'Xếp hạng vùng hỗ trợ/kháng cự; ưu tiên sự hội tụ nhiều nguồn.', 'Đường xu hướng hợp lệ ≥ 3 lần chạm; phá kênh thuận xu hướng = tăng tốc.', 'Bảng mục tiêu giá theo mẫu hình — là mục tiêu tối thiểu, tham khảo.'],
    terms: [['Confluence', 'Hội tụ nhiều tín hiệu'], ['Internal trendline', 'Đường xu hướng nội bộ'], ['Measured move', 'Mục tiêu đo'], ['Top-down analysis', 'Phân tích từ trên xuống']]
  }, {
    goals: ['Apply Dow’s tenets to modern charts.', 'Rank support/resistance zones.', 'Evaluate trendlines, channels and breaks.', 'Apply pattern price objectives.', 'Run a consistent top-down workflow.'],
    body: () => `
<h3>1. From tools to process</h3><p>Level 2 combines tools into a prioritised, repeatable top-down process.</p>${fig.workflow('en')}
<h3>2. Dow today</h3><ul><li>Read the index first.</li><li>Use the next-higher trend as a filter.</li><li>Locate the phase to choose tactics.</li><li>Confirm with small caps, leading sectors, the A/D line.</li></ul>
<h3>3. Ranking S/R</h3><table class="tbl"><tbody><tr><td>Weekly/monthly extremes</td><td>Very high</td></tr><tr><td>Long trading ranges</td><td>High</td></tr><tr><td>Multi-touch lines</td><td>Medium–high</td></tr><tr><td>Open gaps, 50% retracement, 200-MA</td><td>Medium</td></tr><tr><td>Round numbers</td><td>Low–medium</td></tr></tbody></table><p>Prefer <b>confluence</b>.</p>${H.srZones()}
<h3>4. Trendlines and channels</h3><ul><li>Valid with ≥ 3 well-spaced touches.</li><li>Internal trendlines can be more useful.</li><li>With-trend channel breakouts signal acceleration; target ≈ channel width.</li><li>Filter breaks.</li></ul>
<h3>5. Pattern objectives</h3><table class="tbl"><tbody><tr><td>H&S</td><td>Head-to-neckline from the break</td></tr><tr><td>Double top/rectangle</td><td>Height from the break</td></tr><tr><td>Triangle</td><td>Widest height</td></tr><tr><td>Flag/pennant</td><td>Pole length</td></tr><tr><td>Channel break</td><td>Channel width</td></tr><tr><td>Runaway gap</td><td>Move to the gap, projected again</td></tr><tr><td>P&F</td><td>Horizontal/vertical counts</td></tr></tbody></table><p>Objectives are minimum references.</p>
<h3>6. Candles in context</h3><p>Only at key locations and with confirmation (Lessons 10–12).</p>`,
    keys: ['Top-down workflow.', 'Modern Dow confirmation.', 'Rank S/R; seek confluence.', '≥3-touch trendlines; channel breaks.', 'Pattern objectives are minimums.'],
    terms: [['Confluence', 'Several signals at one level'], ['Measured move', 'Height-based target']]
  }, [
    ['Bước đầu tiên của quy trình phân tích từ trên xuống là:', 'First step of top-down analysis:', ['Tìm mẫu nến', 'Xác định xu hướng ở khung lớn (tháng/tuần)', 'Đặt lệnh', 'Tính RSI'], ['Find candles', 'Identify the higher-timeframe trend', 'Place orders', 'Compute RSI'], 1, 'Bối cảnh khung lớn quyết định chiến thuật ở khung nhỏ.', ''],
    ['Thay thế hiện đại cho nguyên tắc xác nhận Công nghiệp–Vận tải có thể là:', 'A modern substitute for Industrials–Transports confirmation:', ['Chỉ số chính và đường A/D', 'Hai cổ phiếu bất kỳ', 'Giá vàng và dầu', 'Không cần'], ['Main index and A/D line', 'Any two stocks', 'Gold and oil', 'None'], 0, '', ''],
    ['Vùng hỗ trợ nào thường đáng tin nhất?', 'Usually the most reliable support:', ['Số tròn đơn lẻ', 'Đáy lớn khung tháng trùng vùng tích lũy dài', 'Đáy của phiên hôm qua', 'Mức 23.6%'], ['A lone round number', 'A monthly low coinciding with a long base', 'Yesterday’s low', '23.6%'], 1, 'Hội tụ của khung lớn và khối lượng lớn.', ''],
    ['"Hội tụ" (confluence) nghĩa là:', '"Confluence" means:', ['Nhiều nguồn tín hiệu trùng tại một vùng giá', 'Giá đi ngang', 'Hai MA cắt nhau', 'Khối lượng bằng 0'], ['Several sources agreeing at one zone', 'Sideways price', 'Two MAs crossing', 'Zero volume'], 0, '', ''],
    ['Một đường xu hướng thường được xem là hợp lệ khi có:', 'A trendline is usually valid with:', ['1 điểm chạm', '2 điểm chạm sát nhau', '≥ 3 điểm chạm cách nhau hợp lý', 'Không cần điểm chạm'], ['1 touch', '2 adjacent touches', '≥3 well-spaced touches', 'No touches'], 2, '', ''],
    ['Giá phá lên trên biên trên của một kênh tăng. Ý nghĩa thường gặp:', 'Price breaks above an up-channel’s upper line:', ['Đảo chiều giảm', 'Xu hướng tăng tốc', 'Không có ý nghĩa', 'Chắc chắn là phá vỡ giả'], ['Bearish reversal', 'Trend acceleration', 'Meaningless', 'Certainly false'], 1, 'Có thể cũng là pha hưng phấn cuối, cần theo dõi.', ''],
    ['Kênh tăng rộng 8 điểm, giá phá lên ở 112. Mục tiêu theo độ rộng kênh:', 'Up-channel 8 points wide, breakout at 112. Channel-width target:', ['104', '116', '120', '128'], null, 2, '112 + 8 = 120.', ''],
    ['Vai–đầu–vai đỉnh: đầu 150, đường viền cổ 130, phá ở 130. Mục tiêu:', 'H&S top: head 150, neckline 130, break at 130. Target:', ['120', '110', '100', '140'], null, 1, '130 − (150 − 130) = 110.', ''],
    ['Cờ tăng: cột cờ từ 40 lên 55, lá cờ phá lên ở 52. Mục tiêu:', 'Bull flag: pole 40→55, breakout at 52. Target:', ['55', '62', '67', '70'], null, 2, '52 + 15 = 67.', ''],
    ['Tam giác: phần rộng nhất cao 12 điểm, phá xuống ở 88. Mục tiêu:', 'Triangle 12 points at widest, breaks down at 88:', ['76', '80', '100', '64'], null, 0, '88 − 12 = 76.', ''],
    ['Gap tiếp diễn ở 65 trong nhịp tăng bắt đầu từ 45. Mục tiêu theo gap đo lường:', 'Runaway gap at 65 in a move from 45. Measuring target:', ['75', '85', '95', '105'], null, 1, '65 + (65 − 45) = 85.', ''],
    ['Mục tiêu từ mẫu hình nên được hiểu là:', 'Pattern objectives should be seen as:', ['Điểm chốt lời chính xác', 'Mục tiêu tối thiểu, mang tính tham khảo', 'Không có giá trị', 'Mức cắt lỗ'], ['Exact exits', 'Minimum, reference targets', 'Worthless', 'Stop levels'], 1, '', ''],
    ['Mẫu nến đảo chiều có giá trị nhất khi:', 'A reversal candle matters most:', ['Ở giữa vùng đi ngang', 'Tại vùng hỗ trợ/kháng cự then chốt và được nến sau xác nhận', 'Khối lượng thấp nhất năm', 'Xuất hiện cuối tuần'], ['Mid-range', 'At key S/R with next-bar confirmation', 'On record-low volume', 'On Fridays'], 1, '', ''],
    ['Theo Dow, chiến thuật hợp lý ở giai đoạn "tham gia đại chúng" là:', 'Per Dow, a sensible tactic in the public-participation phase:', ['Bán khống mạnh', 'Mua các nhịp điều chỉnh theo xu hướng', 'Đứng ngoài hoàn toàn', 'Bắt đáy'], ['Heavy shorting', 'Buy pullbacks with the trend', 'Stay out', 'Bottom-fish'], 1, '', ''],
    ['Đường xu hướng "nội bộ" (internal) là:', 'An internal trendline:', ['Đường chỉ nối các cực trị', 'Đường đi qua thân nến nhưng nối được nhiều điểm phản ứng hơn', 'Đường MA', 'Đường nằm ngang'], ['Only extremes', 'Cuts through bars but connects more reaction points', 'An MA', 'Horizontal'], 1, '', ''],
    ['Vì sao đỉnh khung tháng mạnh hơn đỉnh khung giờ?', 'Why are monthly highs stronger than hourly highs?', ['Vì giá cao hơn', 'Vì nhiều người tham gia và khối lượng lớn "nhớ" mức đó', 'Vì luật', 'Không đúng'], ['Higher price', 'More participants and volume remember it', 'Law', 'Untrue'], 1, '', ''],
    ['Phá vỡ đường xu hướng nên được xác nhận bằng:', 'Trendline breaks should be confirmed by:', ['Bộ lọc giá đóng cửa/%/ATR/thời gian', 'Tin đồn', 'Không cần', 'Một nến bất kỳ'], ['Close/%/ATR/time filters', 'Rumours', 'Nothing', 'Any bar'], 0, '', ''],
    ['Bước cuối cùng của quy trình phân tích là:', 'The last step of the workflow:', ['Tìm thêm chỉ báo', 'Lập kế hoạch: vào, dừng, mục tiêu, R:R, khối lượng', 'Đọc tin tức', 'Vẽ thêm đường'], ['More indicators', 'A plan: entry, stop, target, R:R, size', 'Read news', 'Draw more lines'], 1, '', ''],
    ['Giá vượt kháng cự lớn nhưng chỉ số chính đang giảm và đường A/D giảm. Đánh giá:', 'A stock breaks major resistance while the index and A/D line fall:', ['Tín hiệu rất đáng tin', 'Tín hiệu kém tin cậy hơn — đi ngược bối cảnh chung', 'Không liên quan', 'Chắc chắn thất bại'], ['Very reliable', 'Less reliable — against the backdrop', 'Unrelated', 'Certain failure'], 1, 'Bước 1 & 5 của Wyckoff: thị trường chung quan trọng.', ''],
    ['Mức thoái lui 50% trùng với MA200 và đỉnh cũ đã bị phá. Đây là:', '50% retracement coincides with the 200-MA and an old broken high:', ['Vùng hỗ trợ hội tụ mạnh', 'Vùng yếu', 'Không có ý nghĩa', 'Kháng cự'], ['Strong confluent support', 'Weak zone', 'Meaningless', 'Resistance'], 0, '', '']
  ]);

  /* ================= L2-02 ================= */
  C.addLesson('l2-02', {
    goals: ['So sánh các loại MA và biến thể (dịch chuyển, nhiều đường, kép/ba).', 'Tính và diễn giải hệ thống Định hướng (DMI): +DI, −DI, DX, ADX, ADXR.', 'Phân biệt dải bao %, Bollinger, Keltner, kênh giá (Donchian) và các chỉ số phụ %b, bandwidth.', 'Biết kết hợp ADX để chọn công cụ phù hợp trạng thái thị trường.'],
    body: () => `
<h3>1. Ôn nhanh và mở rộng về MA</h3>
${fig.weights('vi')}
<ul><li><b>SMA, WMA, EMA</b> (Level 1, Bài 6). Thêm: <b>MA tam giác</b> (SMA của SMA, rất mượt, trễ nhiều), <b>DEMA/TEMA</b> (giảm độ trễ bằng cách trừ bớt phần trễ của EMA lồng nhau), <b>MA thích nghi</b> (độ dài tự thay đổi theo mức nhiễu/biến động, ví dụ dựa trên "tỷ lệ hiệu quả" — Bài 4).</li>
<li><b>MA dịch chuyển (displaced)</b>: dời MA về phía trước k kỳ để giá phải đi xa hơn mới tạo giao cắt, giảm whipsaw.</li>
<li>Bốn cách dùng: hướng/độ dốc; giao cắt giá–MA; giao cắt nhiều MA; hỗ trợ/kháng cự động.</li></ul>
<h3>2. Hệ thống Định hướng (Directional Movement — DMI)</h3>
<p>Do J. Welles Wilder phát triển, đo <b>hướng</b> và <b>độ mạnh</b> của xu hướng.</p>
<ol><li><b>+DM</b> = H<sub>t</sub> − H<sub>t−1</sub> nếu lớn hơn (L<sub>t−1</sub> − L<sub>t</sub>) và dương; ngược lại 0. <b>−DM</b> = L<sub>t−1</sub> − L<sub>t</sub> nếu lớn hơn (H<sub>t</sub> − H<sub>t−1</sub>) và dương; ngược lại 0. Mỗi phiên chỉ một trong hai được tính (hoặc cả hai bằng 0).</li>
<li><b>True Range (TR)</b> = max(H − L, |H − C<sub>t−1</sub>|, |L − C<sub>t−1</sub>|).</li>
<li>Làm mượt kiểu Wilder 14 kỳ cho +DM, −DM, TR.</li>
<li><b>+DI</b> = 100 × +DM<sub>14</sub> / TR<sub>14</sub>; <b>−DI</b> = 100 × −DM<sub>14</sub> / TR<sub>14</sub>.</li>
<li><b>DX</b> = 100 × |+DI − −DI| / (+DI + −DI); <b>ADX</b> = trung bình làm mượt của DX; <b>ADXR</b> = (ADX hiện tại + ADX của 14 kỳ trước)/2.</li></ol>
${fig.dmi('vi')}
<table class="tbl"><thead><tr><th>Tín hiệu</th><th>Cách đọc</th></tr></thead><tbody>
<tr><td>+DI cắt lên −DI</td><td>Xu hướng tăng (Wilder: mua khi giá vượt đỉnh của phiên giao cắt — "extreme point rule")</td></tr>
<tr><td>ADX &gt; 25 và đang tăng</td><td>Có xu hướng và đang mạnh lên → ưu tiên công cụ theo xu hướng</td></tr>
<tr><td>ADX &lt; 20</td><td>Không xu hướng → ưu tiên dao động/giao dịch biên</td></tr>
<tr><td>ADX quay đầu từ vùng rất cao (&gt; 40–50)</td><td>Xu hướng đang yếu đi; thường là lúc chốt lời một phần</td></tr></tbody></table>
<div class="callout">ADX đo <b>độ mạnh</b>, không đo hướng. ADX tăng khi giá giảm mạnh cũng là "xu hướng mạnh" — xu hướng giảm.</div>
${H.oscLab('dmi')}
<h3>3. Dải bao, kênh và băng</h3>
<table class="tbl"><thead><tr><th>Công cụ</th><th>Cấu tạo</th><th>Đặc điểm</th></tr></thead><tbody>
<tr><td>Envelope %</td><td>MA ± k%</td><td>Độ rộng cố định theo %, không theo biến động</td></tr>
<tr><td>Bollinger</td><td>SMA20 ± 2σ</td><td>Co giãn theo biến động; %b = (giá − dải dưới)/(dải trên − dải dưới); Bandwidth = (trên − dưới)/giữa</td></tr>
<tr><td>Keltner</td><td>EMA ± k × ATR</td><td>Mượt hơn Bollinger</td></tr>
<tr><td>Kênh giá (Donchian)</td><td>Cao nhất / thấp nhất n kỳ</td><td>Cơ sở của quy tắc phá vỡ n kỳ (ví dụ 20 ngày)</td></tr></tbody></table>
<p>Hai cách dùng ngược nhau: trong <b>thị trường đi ngang</b>, chạm dải ngoài là quá mua/quá bán (giao dịch quay về giữa). Trong <b>xu hướng</b>, đóng cửa ngoài dải là dấu hiệu sức mạnh (giao dịch theo phá vỡ). ADX giúp quyết định dùng cách nào.</p>`,
    keys: ['MA tam giác rất mượt, DEMA/TEMA giảm trễ, MA thích nghi đổi độ dài theo nhiễu; MA dịch chuyển giảm whipsaw.', 'DMI: +DM/−DM, TR, làm mượt 14, +DI/−DI, DX, ADX, ADXR.', 'ADX đo độ mạnh xu hướng (>25 có xu hướng, <20 không), không đo hướng.', 'Envelope %, Bollinger (σ), Keltner (ATR), Donchian (n kỳ); %b, bandwidth.', 'ADX quyết định dùng dải theo kiểu quay về giữa (đi ngang) hay theo phá vỡ (xu hướng).'],
    terms: [['DMI', 'Hệ thống Định hướng'], ['+DI / −DI', 'Chỉ số hướng dương / âm'], ['ADX / ADXR', 'Chỉ số độ mạnh xu hướng / bản làm mượt'], ['True Range', 'Biên độ thực'], ['%b / Bandwidth', 'Vị trí trong dải / độ rộng dải'], ['Donchian channel', 'Kênh giá cao/thấp nhất n kỳ'], ['DEMA / TEMA', 'EMA kép / ba']]
  }, {
    goals: ['Compare MA types and variants.', 'Compute and read DMI: +DI, −DI, DX, ADX, ADXR.', 'Distinguish envelopes, Bollinger, Keltner, Donchian; %b, bandwidth.', 'Use ADX to choose tools for the market state.'],
    body: () => `
<h3>1. MAs extended</h3>${fig.weights('en')}<ul><li>Triangular, DEMA/TEMA, adaptive MAs; displaced MAs.</li><li>Four uses.</li></ul>
<h3>2. Directional Movement (Wilder)</h3><ol><li>+DM / −DM (only the larger positive one counts).</li><li>True Range.</li><li>Wilder 14-period smoothing.</li><li>+DI = 100·+DM14/TR14; −DI likewise.</li><li>DX = 100·|+DI − −DI|/(+DI + −DI); ADX = smoothed DX; ADXR = (ADX + ADX 14 bars ago)/2.</li></ol>${fig.dmi('en')}
<table class="tbl"><tbody><tr><td>+DI above −DI</td><td>Uptrend (extreme point rule)</td></tr><tr><td>ADX &gt; 25 rising</td><td>Trend tools</td></tr><tr><td>ADX &lt; 20</td><td>Range tools</td></tr><tr><td>ADX turning from &gt; 40–50</td><td>Weakening trend</td></tr></tbody></table><div class="callout">ADX measures <b>strength</b>, not direction.</div>${H.oscLab('dmi')}
<h3>3. Bands</h3><table class="tbl"><tbody><tr><td>Envelope</td><td>MA ± k%</td></tr><tr><td>Bollinger</td><td>SMA20 ± 2σ; %b; bandwidth</td></tr><tr><td>Keltner</td><td>EMA ± k·ATR</td></tr><tr><td>Donchian</td><td>n-bar high/low</td></tr></tbody></table><p>Ranges: fade the bands; trends: trade closes outside them. ADX decides.</p>`,
    keys: ['MA variants.', 'DMI construction.', 'ADX = strength.', 'Band types, %b, bandwidth.', 'ADX picks the band usage.'],
    terms: [['ADX', 'Trend strength'], ['%b', 'Position within bands'], ['Donchian', 'n-bar high/low channel']]
  }, [
    ['H hôm nay 52, hôm qua 50; L hôm nay 47, hôm qua 48. +DM và −DM là:', 'Today H 52 (yesterday 50), L 47 (yesterday 48). +DM, −DM:', ['+DM 2, −DM 0', '+DM 0, −DM 1', '+DM 2, −DM 1', 'Cả hai bằng 0'], ['+2, 0', '0, 1', '2, 1', 'both 0'], 0, 'Lên 2 > xuống 1 nên chỉ +DM = 2 được tính.', 'Only the larger move counts.'],
    ['H 30, L 27, giá đóng cửa hôm qua 32. True Range là:', 'H 30, L 27, prior close 32. True Range:', ['3', '2', '5', '32'], null, 2, 'max(3, |30−32| = 2, |27−32| = 5) = 5.', ''],
    ['+DI = 30, −DI = 10. DX bằng:', '+DI 30, −DI 10. DX:', ['20', '33.3', '50', '75'], null, 2, '100 × 20 / 40 = 50.', ''],
    ['ADX = 15 cho thấy:', 'ADX 15 indicates:', ['Xu hướng tăng mạnh', 'Thị trường không xu hướng', 'Xu hướng giảm mạnh', 'Quá mua'], ['Strong uptrend', 'Non-trending market', 'Strong downtrend', 'Overbought'], 1, '', ''],
    ['Giá giảm mạnh, ADX tăng từ 20 lên 40. Điều này nghĩa là:', 'Price falls hard, ADX rises 20→40:', ['Xu hướng tăng đang mạnh', 'Xu hướng (giảm) đang mạnh lên', 'Sắp đảo chiều tăng', 'ADX lỗi'], ['Strong uptrend', 'A strengthening (down)trend', 'Imminent rally', 'Error'], 1, 'ADX đo độ mạnh, không đo hướng.', ''],
    ['ADXR được tính bằng:', 'ADXR equals:', ['(ADX + ADX của 14 kỳ trước) / 2', 'ADX × 2', '+DI − −DI', 'ADX / 14'], ['(ADX + ADX 14 bars ago)/2', 'ADX × 2', '+DI − −DI', 'ADX/14'], 0, '', ''],
    ['"Extreme point rule" của Wilder: sau khi +DI cắt lên −DI, mua khi:', 'Wilder’s extreme point rule: after +DI crosses above −DI, buy when:', ['Ngay lập tức', 'Giá vượt đỉnh của phiên giao cắt', 'ADX < 10', 'Giá giảm 5%'], ['Immediately', 'Price exceeds the crossover bar’s high', 'ADX < 10', 'Price drops 5%'], 1, '', ''],
    ['Khi ADX > 25 và đang tăng, công cụ phù hợp hơn là:', 'With ADX > 25 and rising, better tools are:', ['Dao động quá mua/quá bán', 'Công cụ theo xu hướng (MA, phá vỡ)', 'Không giao dịch', 'Chỉ dùng nến'], ['Oscillators', 'Trend tools (MAs, breakouts)', 'No trading', 'Candles only'], 1, '', ''],
    ['Bollinger: dải trên 110, dải dưới 90, giá 105. %b bằng:', 'Bollinger upper 110, lower 90, price 105. %b:', ['0.25', '0.5', '0.75', '1.05'], null, 2, '(105 − 90)/(110 − 90) = 0.75.', ''],
    ['Bollinger: trên 110, dưới 90, giữa 100. Bandwidth:', 'Upper 110, lower 90, middle 100. Bandwidth:', ['0.1', '0.2', '2', '20'], null, 1, '(110 − 90)/100 = 0.2.', ''],
    ['Keltner Channel dùng thước đo nào cho độ rộng?', 'Keltner width is based on:', ['Độ lệch chuẩn', 'ATR', '% cố định', 'Khối lượng'], ['St.dev', 'ATR', 'Fixed %', 'Volume'], 1, '', ''],
    ['Kênh Donchian 20 ngày gồm:', 'A 20-day Donchian channel is:', ['MA20 ± 2σ', 'Cao nhất và thấp nhất 20 ngày', 'EMA20 ± ATR', 'MA20 ± 5%'], ['MA20 ± 2σ', '20-day highest high and lowest low', 'EMA20 ± ATR', 'MA20 ± 5%'], 1, '', ''],
    ['Trong thị trường đi ngang (ADX thấp), giá chạm dải Bollinger trên thường được dùng để:', 'In a range (low ADX), touching the upper Bollinger Band is used to:', ['Mua theo phá vỡ', 'Chốt lời/bán chờ quay về giữa', 'Tăng đòn bẩy', 'Không làm gì'], ['Buy the breakout', 'Take profit / fade toward the middle', 'Add leverage', 'Nothing'], 1, '', ''],
    ['MA dịch chuyển (displaced) có tác dụng chính là:', 'A displaced MA mainly:', ['Tăng độ nhạy', 'Giảm tín hiệu giả (whipsaw)', 'Loại bỏ độ trễ', 'Tính khối lượng'], ['Increases sensitivity', 'Reduces whipsaws', 'Removes lag', 'Computes volume'], 1, '', ''],
    ['MA tam giác có đặc điểm:', 'A triangular MA:', ['Trọng số lớn nhất ở dữ liệu mới nhất', 'Trọng số lớn nhất ở giữa cửa sổ — rất mượt, trễ nhiều', 'Không có trễ', 'Trọng số đều'], ['Heaviest on newest data', 'Heaviest in the middle — very smooth, laggy', 'No lag', 'Equal weights'], 1, '', ''],
    ['DEMA/TEMA được thiết kế để:', 'DEMA/TEMA are designed to:', ['Tăng độ trễ', 'Giảm độ trễ của EMA', 'Đo khối lượng', 'Đo độ rộng'], ['Add lag', 'Reduce EMA lag', 'Measure volume', 'Measure breadth'], 1, '', ''],
    ['Bandwidth của Bollinger ở mức thấp nhất 6 tháng gợi ý:', 'Six-month-low Bollinger bandwidth suggests:', ['Biến động sắp mở rộng', 'Xu hướng mạnh đang diễn ra', 'Không có giao dịch', 'Đỉnh chắc chắn'], ['Volatility expansion ahead', 'A strong trend now', 'No trading', 'A certain top'], 0, 'Squeeze.', ''],
    ['MA thích nghi thay đổi độ dài dựa trên:', 'Adaptive MAs change length based on:', ['Ngày trong tuần', 'Mức nhiễu/hiệu quả của chuyển động giá', 'Khối lượng cố định', 'Ngẫu nhiên'], ['Weekday', 'Noise/efficiency of price movement', 'Fixed volume', 'Randomly'], 1, '', ''],
    ['+DI = 18, −DI = 26, ADX = 32 và tăng. Trạng thái:', '+DI 18, −DI 26, ADX 32 rising:', ['Xu hướng tăng mạnh', 'Xu hướng giảm có sức mạnh', 'Đi ngang', 'Quá bán chắc chắn'], ['Strong uptrend', 'A strong downtrend', 'Range', 'Certainly oversold'], 1, '', ''],
    ['Envelope ±5% có nhược điểm chính là:', 'A ±5% envelope’s main drawback:', ['Không co giãn theo biến động thị trường', 'Quá phức tạp', 'Không có đường giữa', 'Chỉ dùng cho crypto'], ['It ignores changing volatility', 'Too complex', 'No midline', 'Crypto only'], 0, '', '']
  ]);

  /* ================= L2-03 ================= */
  C.addLesson('l2-03', {
    goals: ['Trình bày các phương pháp dự báo hướng giá: hồi quy tuyến tính, đường xu hướng, MA.', 'Tính động lượng đơn giản và hiểu vai trò như một công cụ xu hướng.', 'So sánh các phương pháp trọng số MA: đều, bậc thang, tuyến tính, hàm mũ, tam giác.', 'Giải thích hiệu ứng rơi dữ liệu và tác động lên chỉ báo.', 'Ước lượng độ trễ của MA.'],
    body: () => `
<h3>1. Dự báo hướng giá</h3>
<p>Mọi công cụ xu hướng đều cố gắng trả lời: <b>giá đang đi về đâu</b>, với độ trễ ít nhất và nhiễu ít nhất. Ba họ phương pháp:</p>
<ul><li><b>Hồi quy tuyến tính</b> (least squares): khớp một đường thẳng qua n giá đóng cửa gần nhất. <b>Độ dốc</b> = tốc độ xu hướng; giá trị cuối của đường = "giá ước lượng hiện tại", ít trễ hơn SMA cùng độ dài. Có thể ngoại suy 1 kỳ để dự báo.</li>
<li><b>Trung bình động</b>: làm mượt, hướng của MA cho biết xu hướng.</li>
<li><b>Động lượng</b>: thay đổi giá qua n kỳ.</li></ul>
<h3>2. Động lượng đơn giản như công cụ xu hướng</h3>
<p>Momentum<sub>n</sub> = C<sub>t</sub> − C<sub>t−n</sub>. Dương khi giá cao hơn n kỳ trước. Quy tắc đơn giản: <b>mua khi momentum chuyển dương, bán khi chuyển âm</b>. Đây là quy tắc theo xu hướng tương đương với "giá cắt qua giá của n kỳ trước". Nó phản ứng nhanh hơn SMA n kỳ, nhưng nhiễu hơn.</p>
<div class="callout">Liên hệ quan trọng: độ dốc của SMA n kỳ tỷ lệ với momentum n kỳ: SMA<sub>t</sub> − SMA<sub>t−1</sub> = (C<sub>t</sub> − C<sub>t−n</sub>)/n. Vì vậy "SMA đổi hướng" và "momentum đổi dấu" là <b>cùng một sự kiện</b>.</div>
<h3>3. Các phương pháp trọng số</h3>
${fig.weights('vi')}
<table class="tbl"><thead><tr><th>Phương pháp</th><th>Trọng số</th><th>Độ trễ tương đối</th></tr></thead><tbody>
<tr><td>Đều (SMA)</td><td>1, 1, …, 1</td><td>(n − 1)/2 kỳ</td></tr>
<tr><td>Bậc thang (step-weighted)</td><td>Nhóm dữ liệu gần có trọng số cao hơn theo bậc</td><td>Ít hơn SMA</td></tr>
<tr><td>Tuyến tính (WMA)</td><td>1, 2, …, n (mới nhất = n)</td><td>≈ (n − 1)/3 kỳ</td></tr>
<tr><td>Hàm mũ (EMA)</td><td>α, α(1−α), α(1−α)², …</td><td>≈ (n − 1)/2 với α = 2/(n+1) (tâm khối lượng tương đương SMA n)</td></tr>
<tr><td>Tam giác</td><td>Tăng rồi giảm, nặng ở giữa</td><td>Lớn — rất mượt</td></tr></tbody></table>
<p>Ví dụ WMA 3 kỳ của 10, 11, 13: (1×10 + 2×11 + 3×13)/(1+2+3) = (10 + 22 + 39)/6 = <b>11.83</b>, cao hơn SMA (11.33) vì dữ liệu mới nhất có trọng số lớn hơn.</p>
<h3>4. Hiệu ứng rơi dữ liệu (drop-off effect)</h3>
<p>Với SMA, khi một giá trị cũ <b>rời khỏi cửa sổ</b>, MA thay đổi theo giá trị bị loại chứ không phải theo giá mới. Nếu cách đây n kỳ có một phiên tăng vọt, hôm nay khi phiên đó bị loại, SMA có thể <b>giảm</b> dù giá hôm nay tăng. Đây là "tín hiệu do quá khứ", không phải do hiện tại.</p>
<div class="callout"><b>Ví dụ</b>: SMA 5 của 10, 10, 10, 10, 20 là 12. Phiên mới đóng cửa 11 → cửa sổ 10, 10, 10, 20, 11 → SMA = 12.2 (tăng). Thêm 4 phiên 11 nữa → khi số 20 bị loại, SMA rơi từ 12.8 xuống 11.0 dù giá đứng yên ở 11.</div>
<p>EMA giảm mạnh hiệu ứng này vì trọng số giảm dần chứ không bị cắt đột ngột. Các chỉ báo dựa trên SMA (ví dụ Bollinger dùng SMA, Stochastic, ROC) đều chịu hiệu ứng rơi ở mức độ khác nhau.</p>
${H.maDemo()}`,
    keys: ['Dự báo hướng: hồi quy tuyến tính (độ dốc, giá ước lượng ít trễ), MA, động lượng.', 'Momentum = C − C(n); độ dốc SMA n = momentum n / n — cùng một sự kiện.', 'Trọng số: đều, bậc thang, tuyến tính, hàm mũ, tam giác; độ trễ SMA ≈ (n−1)/2.', 'Hiệu ứng rơi: SMA thay đổi do dữ liệu cũ bị loại; EMA giảm thiểu.', 'Chỉ báo dựa trên SMA đều chịu hiệu ứng rơi.'],
    terms: [['Linear regression line', 'Đường hồi quy tuyến tính'], ['Momentum', 'Động lượng'], ['Step-weighted MA', 'MA trọng số bậc thang'], ['Drop-off effect', 'Hiệu ứng rơi dữ liệu'], ['Lag', 'Độ trễ']]
  }, {
    goals: ['Methods to forecast direction.', 'Simple momentum as a trend tool.', 'MA weighting methods.', 'The drop-off effect.', 'Estimate MA lag.'],
    body: () => `
<h3>1. Forecasting direction</h3><ul><li>Linear regression: slope and endpoint (less lag than an SMA).</li><li>Moving averages.</li><li>Momentum.</li></ul>
<h3>2. Momentum</h3><p>Momentum = C<sub>t</sub> − C<sub>t−n</sub>; buy when it turns positive. Note: SMA<sub>t</sub> − SMA<sub>t−1</sub> = (C<sub>t</sub> − C<sub>t−n</sub>)/n — an SMA turning and momentum changing sign are the same event.</p>
<h3>3. Weighting</h3>${fig.weights('en')}<table class="tbl"><tbody><tr><td>SMA</td><td>lag (n−1)/2</td></tr><tr><td>Step-weighted</td><td>less lag</td></tr><tr><td>WMA</td><td>≈ (n−1)/3</td></tr><tr><td>EMA</td><td>centre of mass like SMA n with α = 2/(n+1)</td></tr><tr><td>Triangular</td><td>very smooth, laggy</td></tr></tbody></table><p>WMA(3) of 10, 11, 13 = 71/6 = 11.83.</p>
<h3>4. Drop-off effect</h3><p>An SMA changes when old data leaves the window.</p><div class="callout">SMA5 of 10,10,10,10,20 = 12; after the 20 drops out with price flat at 11, the SMA falls from 12.8 to 11.0.</div><p>EMAs largely avoid it; SMA-based indicators inherit it.</p>${H.maDemo()}`,
    keys: ['Regression, MA, momentum.', 'SMA slope = momentum/n.', 'Weighting methods and lag.', 'Drop-off effect.', 'SMA-based indicators inherit it.'],
    terms: [['Drop-off effect', 'Old data leaving an SMA'], ['Linear regression', 'Least-squares line']]
  }, [
    ['Momentum 10 kỳ khi giá hôm nay 58, giá 10 kỳ trước 50:', '10-period momentum with price 58 today and 50 ten bars ago:', ['8', '16%', '−8', '1.16'], null, 0, '58 − 50 = 8.', ''],
    ['Độ dốc của SMA 10 kỳ hôm nay (so với hôm qua) khi C = 58, C(−10) = 50:', 'Today’s 10-SMA change with C 58 and C(−10) 50:', ['+0.8', '+8', '−0.8', '0'], null, 0, '(58 − 50)/10 = 0.8.', ''],
    ['"SMA n kỳ đổi hướng" tương đương với:', '"An n-SMA turns" is equivalent to:', ['Giá cắt SMA', 'Momentum n kỳ đổi dấu', 'RSI cắt 50', 'Khối lượng tăng'], ['Price crossing the SMA', 'n-period momentum changing sign', 'RSI crossing 50', 'Rising volume'], 1, '', ''],
    ['WMA 3 kỳ của 20, 22, 24 (24 mới nhất) là:', 'WMA(3) of 20, 22, 24 (24 newest):', ['22', '22.67', '23', '24'], null, 1, '(20 + 44 + 72)/6 = 136/6 = 22.67.', ''],
    ['Độ trễ xấp xỉ của SMA 21 kỳ là:', 'Approximate lag of a 21-SMA:', ['21 kỳ', '10 kỳ', '7 kỳ', '1 kỳ'], ['21', '10', '7', '1'], 1, '(21 − 1)/2 = 10.', ''],
    ['Ưu điểm của giá trị cuối đường hồi quy tuyến tính so với SMA cùng độ dài:', 'Advantage of the regression endpoint over a same-length SMA:', ['Trễ hơn', 'Ít trễ hơn', 'Không có nhiễu', 'Không cần dữ liệu'], ['More lag', 'Less lag', 'No noise', 'No data'], 1, '', ''],
    ['Hiệu ứng rơi dữ liệu đặc trưng cho:', 'The drop-off effect characterises:', ['EMA', 'SMA và các chỉ báo dựa trên SMA', 'Giá đóng cửa', 'Khối lượng'], ['EMA', 'SMA and SMA-based indicators', 'Closes', 'Volume'], 1, '', ''],
    ['SMA 5 của 10, 10, 10, 10, 20 là:', 'SMA5 of 10, 10, 10, 10, 20:', ['10', '12', '14', '20'], null, 1, '60/5.', ''],
    ['Giá đứng yên nhưng SMA giảm mạnh một phiên. Nguyên nhân hợp lý nhất:', 'Price is flat but the SMA drops sharply one day:', ['Thị trường sụp đổ', 'Một giá trị rất cao cũ vừa rời khỏi cửa sổ (drop-off)', 'Lỗi giao dịch', 'Cổ tức'], ['Crash', 'A high old value left the window', 'Trading error', 'Dividend'], 1, '', ''],
    ['MA bậc thang (step-weighted) gán trọng số:', 'A step-weighted MA assigns weights:', ['Đều nhau', 'Theo từng nhóm, nhóm gần hơn trọng số cao hơn', 'Ngẫu nhiên', 'Nặng ở giữa'], ['Equally', 'By groups, recent groups heavier', 'Randomly', 'Centre-heavy'], 1, '', ''],
    ['Quy tắc "mua khi momentum n kỳ dương" tương đương với:', '"Buy when n-momentum is positive" equals:', ['Mua khi giá trên giá của n kỳ trước', 'Mua khi RSI > 70', 'Mua khi khối lượng cao', 'Mua ngẫu nhiên'], ['Buy when price exceeds the price n bars ago', 'RSI > 70', 'High volume', 'Random'], 0, '', ''],
    ['EMA có α = 2/(n+1) có tâm khối lượng tương đương:', 'An EMA with α = 2/(n+1) has a centre of mass like:', ['SMA n kỳ', 'SMA 2n kỳ', 'WMA n/3', 'Không so được'], ['An n-SMA', 'A 2n-SMA', 'WMA n/3', 'Not comparable'], 0, '', ''],
    ['Vì sao EMA giảm hiệu ứng rơi?', 'Why does the EMA reduce drop-off?', ['Trọng số giảm dần, không cắt đột ngột', 'Dùng khối lượng', 'Không dùng giá cũ', 'Do làm tròn'], ['Weights decay rather than being cut off', 'Uses volume', 'Ignores old prices', 'Rounding'], 0, '', ''],
    ['Độ dốc đường hồi quy 20 kỳ = +0.5 điểm/kỳ. Ý nghĩa:', 'A 20-bar regression slope of +0.5 pt/bar means:', ['Giá giảm', 'Xu hướng tăng với tốc độ khoảng 0.5 điểm mỗi kỳ', 'Biến động 0.5%', 'Không ý nghĩa'], ['Falling price', 'Uptrend of about 0.5 points per bar', '0.5% volatility', 'Nothing'], 1, '', ''],
    ['WMA phản ứng nhanh hơn SMA vì:', 'A WMA reacts faster than an SMA because:', ['Dùng ít dữ liệu hơn', 'Dữ liệu mới có trọng số lớn hơn', 'Dùng khối lượng', 'Không có trễ'], ['Less data', 'Recent data weighs more', 'Volume', 'No lag'], 1, '', ''],
    ['Momentum nhạy hơn SMA cùng độ dài nhưng đổi lại:', 'Momentum is faster than a same-length SMA but:', ['Nhiễu hơn', 'Trễ hơn', 'Không tính được', 'Chỉ dùng cho tuần'], ['Noisier', 'Laggier', 'Incomputable', 'Weekly only'], 0, '', ''],
    ['MA tam giác n kỳ có thể tạo bằng:', 'An n-period triangular MA can be built as:', ['SMA của SMA', 'EMA của giá', 'Giá − SMA', 'Momentum của SMA'], ['An SMA of an SMA', 'An EMA of price', 'Price − SMA', 'Momentum of an SMA'], 0, '', ''],
    ['Bollinger (dùng SMA20) có thể đổi độ rộng đột ngột khi:', 'Bollinger (SMA20) width can jump when:', ['Một phiên biến động lớn cũ rời khỏi cửa sổ 20 kỳ', 'Khối lượng tăng', 'Cuối tuần', 'Không bao giờ'], ['A big old bar leaves the 20-bar window', 'Volume rises', 'Weekends', 'Never'], 0, '', ''],
    ['Ngoại suy đường hồi quy 1 kỳ dùng để:', 'Extending the regression line one bar is used to:', ['Dự báo giá kỳ kế tiếp theo xu hướng hiện tại', 'Tính khối lượng', 'Đo độ rộng', 'Tính cổ tức'], ['Forecast next bar along the trend', 'Volume', 'Breadth', 'Dividends'], 0, '', ''],
    ['Đánh đổi chung của mọi công cụ xu hướng là giữa:', 'The universal trend-tool trade-off is between:', ['Phí và thuế', 'Độ trễ và độ nhiễu', 'Giá và khối lượng', 'Ngày và tuần'], ['Fees and taxes', 'Lag and noise', 'Price and volume', 'Days and weeks'], 1, '', '']
  ]);

  /* ================= L2-04 ================= */
  C.addLesson('l2-04', {
    goals: ['Giải thích ba lý do hệ thống theo xu hướng hoạt động.', 'Chọn tài sản phù hợp cho hệ thống xu hướng (độ "xu hướng", thanh khoản, biến động, tương quan).', 'Khái quát tín hiệu mua/bán từ MA, Bollinger, Keltner, dải %, dải biến động và kết hợp.', 'Áp dụng quy tắc MA 10 ngày và các bộ lọc.'],
    body: () => `
<h3>1. Vì sao hệ thống theo xu hướng hoạt động?</h3>
<ol><li><b>Giá có xu hướng</b>: thông tin lan truyền dần dần, nhà đầu tư phản ứng chậm rồi phản ứng thái quá, các chính sách kinh tế (lãi suất) kéo dài nhiều năm (Phần V Level 1).</li>
<li><b>Phân phối lợi suất có đuôi dày</b>: các nước đi rất lớn xảy ra thường hơn phân phối chuẩn. Hệ thống "cắt lỗ ngắn, để lãi chạy" nắm được những nước đi này, chỉ cần vài lệnh lớn bù cho nhiều lệnh nhỏ thua.</li>
<li><b>Kỷ luật và quản trị rủi ro được tích hợp sẵn</b>: luôn có quy tắc thoát, nên không bao giờ "kẹt" trong một xu hướng ngược kéo dài; kết quả có độ lệch dương (positive skew).</li></ol>
<h3>2. Chọn tài sản cho hệ thống xu hướng</h3>
<ul><li><b>Độ xu hướng</b>: đo bằng <b>tỷ lệ hiệu quả (efficiency ratio)</b> = |C<sub>t</sub> − C<sub>t−n</sub>| / Σ|C<sub>i</sub> − C<sub>i−1</sub>|. Gần 1 là đi thẳng (xu hướng), gần 0 là nhiễu. Hoặc dùng ADX trung bình dài hạn.</li>
<li><b>Thanh khoản</b>: đủ để vào/ra với trượt giá thấp.</li>
<li><b>Biến động đủ</b>: để lợi nhuận vượt chi phí.</li>
<li><b>Tương quan thấp giữa các tài sản</b>: một danh mục nhiều thị trường ít tương quan giúp đường vốn mượt hơn (nguyên lý của các quỹ theo xu hướng đa tài sản).</li></ul>
<h3>3. Tín hiệu từ các công cụ</h3>
<table class="tbl"><thead><tr><th>Công cụ</th><th>Tín hiệu mua</th><th>Tín hiệu bán / thoát</th></tr></thead><tbody>
<tr><td>MA đơn</td><td>Đóng cửa trên MA (có thể kèm dải lọc)</td><td>Đóng cửa dưới MA</td></tr>
<tr><td>Bollinger</td><td>Đóng cửa trên dải trên (phá vỡ biến động)</td><td>Đóng cửa dưới đường giữa hoặc dải dưới</td></tr>
<tr><td>Keltner</td><td>Đóng cửa trên dải trên</td><td>Dưới đường giữa / dải dưới</td></tr>
<tr><td>Dải % (percentage bands)</td><td>Vượt MA + k%</td><td>Thủng MA − k%</td></tr>
<tr><td>Dải biến động (volatility bands)</td><td>Vượt MA + k × ATR hoặc σ</td><td>Thủng MA − k × ATR</td></tr>
<tr><td>Kết hợp</td><td>Phá dải + xác nhận bộ lọc xu hướng dài (ví dụ giá trên MA200 hoặc ADX &gt; 20)</td><td>Thoát theo trailing stop</td></tr></tbody></table>
<p>Dải tạo ra một <b>vùng trung lập</b>: giữa hai dải không có tín hiệu mới, nên giảm whipsaw so với giao cắt MA đơn.</p>
<h3>4. Quy tắc MA 10 ngày</h3>
<p>Quy tắc cổ điển, đơn giản cho giao dịch ngắn–trung hạn: <b>mua khi giá đóng cửa trên MA 10 ngày, bán khi đóng cửa dưới</b>. Nó phản ứng nhanh nhưng nhiều whipsaw, nên thường được cải tiến bằng:</p>
<ul><li><b>Dải lọc</b>: chỉ hành động khi vượt MA ± một tỷ lệ nhỏ hoặc một phần ATR.</li>
<li><b>Bộ lọc thời gian</b>: chỉ hành động khi giá đóng cửa ngoài MA 2 phiên liên tiếp.</li>
<li><b>Bộ lọc xu hướng dài</b>: chỉ lấy tín hiệu mua khi MA dài (50/200) đang tăng.</li></ul>
${H.trendSys()}`,
    keys: ['Ba lý do: giá có xu hướng (hành vi, chính sách), đuôi dày, kỷ luật cắt lỗ – để lãi chạy tạo độ lệch dương.', 'Chọn tài sản: tỷ lệ hiệu quả/ADX cao, thanh khoản, biến động đủ, tương quan thấp.', 'Tín hiệu từ MA, Bollinger, Keltner, dải %, dải biến động; dải tạo vùng trung lập giảm whipsaw.', 'Quy tắc MA 10 ngày + bộ lọc dải, thời gian, xu hướng dài.'],
    terms: [['Efficiency ratio', 'Tỷ lệ hiệu quả'], ['Positive skew', 'Độ lệch dương'], ['Neutral zone', 'Vùng trung lập'], ['Volatility band', 'Dải biến động'], ['Time filter', 'Bộ lọc thời gian']]
  }, {
    goals: ['Three reasons trend systems work.', 'Select suitable assets.', 'Generalise signals from MAs and bands.', 'Apply the 10-day MA rule with filters.'],
    body: () => `
<h3>1. Why trend systems work</h3><ol><li>Prices trend (diffusion, behaviour, long policy cycles).</li><li>Fat tails — a few big trades pay for many small losses.</li><li>Built-in discipline — always an exit, positive skew.</li></ol>
<h3>2. Asset selection</h3><ul><li>Trendiness: efficiency ratio = |C<sub>t</sub> − C<sub>t−n</sub>| / Σ|ΔC|, or long-run ADX.</li><li>Liquidity.</li><li>Enough volatility.</li><li>Low correlation across the portfolio.</li></ul>
<h3>3. Signals</h3><table class="tbl"><tbody><tr><td>Single MA</td><td>close above / below</td></tr><tr><td>Bollinger, Keltner</td><td>close beyond the upper band / back below the middle</td></tr><tr><td>% bands, volatility bands</td><td>beyond MA ± k% or k·ATR</td></tr><tr><td>Combinations</td><td>band break + long trend filter; trailing exits</td></tr></tbody></table><p>Bands create a neutral zone.</p>
<h3>4. The 10-day MA rule</h3><p>Buy on a close above the 10-day MA, sell on a close below; add band, time and long-trend filters.</p>${H.trendSys()}`,
    keys: ['Trends, fat tails, discipline.', 'Efficiency ratio, liquidity, volatility, low correlation.', 'Band signals and neutral zones.', '10-day MA rule with filters.'],
    terms: [['Efficiency ratio', 'Net move / total path'], ['Positive skew', 'Few large wins, many small losses']]
  }, [
    ['Lý do nào KHÔNG phải là lý do hệ thống xu hướng hoạt động?', 'Which is NOT a reason trend systems work?', ['Giá có xu hướng', 'Lợi suất có đuôi dày', 'Kỷ luật cắt lỗ – để lãi chạy', 'Giá hoàn toàn ngẫu nhiên'], ['Prices trend', 'Fat tails', 'Cut losses, let profits run', 'Prices are purely random'], 3, '', ''],
    ['Giá đi từ 100 đến 110 trong 10 phiên, tổng các thay đổi tuyệt đối từng phiên là 40. Tỷ lệ hiệu quả:', 'Price moves 100→110 over 10 bars; the sum of absolute daily changes is 40. Efficiency ratio:', ['0.1', '0.25', '0.4', '4'], null, 1, '10/40 = 0.25 — khá nhiễu.', ''],
    ['Tỷ lệ hiệu quả gần 1 nghĩa là:', 'An efficiency ratio near 1 means:', ['Giá đi gần như thẳng — xu hướng', 'Nhiễu cao', 'Không giao dịch', 'Khối lượng thấp'], ['Nearly straight movement — trend', 'High noise', 'No trading', 'Low volume'], 0, '', ''],
    ['Hệ thống xu hướng điển hình có:', 'A typical trend system has:', ['Tỷ lệ thắng cao, lãi TB nhỏ', 'Tỷ lệ thắng thấp, lãi TB lớn hơn nhiều lỗ TB', 'Không có lệnh thua', 'Lãi đều đặn hằng ngày'], ['High win rate, small wins', 'Low win rate, wins much larger than losses', 'No losers', 'Daily steady gains'], 1, 'Độ lệch dương.', ''],
    ['Vì sao danh mục nhiều thị trường ít tương quan có lợi cho hệ thống xu hướng?', 'Why do many low-correlated markets help trend systems?', ['Tăng phí', 'Làm đường vốn mượt hơn, tăng cơ hội bắt xu hướng lớn', 'Giảm số lệnh về 0', 'Không có lợi'], ['Higher fees', 'Smoother equity, more chances to catch big trends', 'Zero trades', 'No benefit'], 1, '', ''],
    ['Tín hiệu mua theo phá vỡ Bollinger trong hệ thống xu hướng là:', 'A Bollinger breakout buy in a trend system:', ['Chạm dải dưới', 'Đóng cửa trên dải trên', 'Giá về đường giữa', 'Bandwidth giảm'], ['Touching the lower band', 'A close above the upper band', 'Return to middle', 'Falling bandwidth'], 1, '', ''],
    ['Dải quanh MA tạo "vùng trung lập" giúp:', 'A neutral zone around an MA helps:', ['Tăng whipsaw', 'Giảm whipsaw', 'Tăng phí', 'Không đổi'], ['More whipsaw', 'Fewer whipsaws', 'Higher fees', 'Nothing'], 1, '', ''],
    ['Quy tắc MA 10 ngày cơ bản: mua khi:', 'Basic 10-day MA rule: buy when:', ['Giá đóng cửa trên MA10', 'MA10 dưới MA50', 'RSI < 30', 'Khối lượng giảm'], ['Close above the 10-day MA', '10-MA below 50-MA', 'RSI < 30', 'Falling volume'], 0, '', ''],
    ['Bộ lọc thời gian cho quy tắc MA 10 ngày có thể là:', 'A time filter for the 10-day rule:', ['Hai phiên đóng cửa liên tiếp ngoài MA', 'Giao dịch thứ Hai', 'Khối lượng tăng', 'Không cần'], ['Two consecutive closes beyond the MA', 'Trade Mondays', 'Rising volume', 'None'], 0, '', ''],
    ['Dải biến động khác dải % ở chỗ:', 'Volatility bands differ from % bands by:', ['Độ rộng theo ATR/σ thay vì % cố định', 'Không có MA', 'Dùng khối lượng', 'Không khác'], ['Width from ATR/σ rather than fixed %', 'No MA', 'Volume', 'No difference'], 0, '', ''],
    ['Bộ lọc xu hướng dài thường dùng:', 'A common long-trend filter:', ['MA200 đang tăng hoặc giá trên MA200', 'RSI 2 kỳ', 'Doji', 'Gap'], ['Rising 200-MA or price above it', '2-period RSI', 'Doji', 'Gap'], 0, '', ''],
    ['Tài sản có ADX dài hạn thấp và tỷ lệ hiệu quả thấp phù hợp hơn với:', 'Assets with low long-run ADX and efficiency suit:', ['Hệ thống xu hướng', 'Hệ thống quay về trung bình', 'Mua & giữ đòn bẩy', 'Không gì'], ['Trend systems', 'Mean-reversion systems', 'Leveraged buy & hold', 'Nothing'], 1, '', ''],
    ['Độ lệch dương của lợi nhuận hệ thống nghĩa là:', 'Positive skew of system returns means:', ['Nhiều lệnh lỗ nhỏ, ít lệnh lãi rất lớn', 'Nhiều lệnh lãi nhỏ, ít lệnh lỗ rất lớn', 'Không có phân phối', 'Lãi = lỗ'], ['Many small losses, few very large wins', 'Many small wins, few huge losses', 'No distribution', 'Wins equal losses'], 0, '', ''],
    ['Đuôi dày hỗ trợ hệ thống xu hướng vì:', 'Fat tails help trend systems because:', ['Nước đi cực lớn xảy ra thường hơn dự kiến, và hệ thống giữ được chúng', 'Giảm biến động', 'Giảm số lệnh', 'Không liên quan'], ['Huge moves occur more often than expected and the system holds them', 'Lower volatility', 'Fewer trades', 'Unrelated'], 0, '', ''],
    ['Keltner phá vỡ khác Bollinger phá vỡ chủ yếu ở:', 'Keltner vs Bollinger breakouts differ mainly in:', ['Đo độ rộng bằng ATR thay vì σ', 'Không có đường giữa', 'Chỉ dùng tuần', 'Dùng khối lượng'], ['ATR width instead of σ', 'No middle line', 'Weekly only', 'Volume'], 0, '', ''],
    ['Nhược điểm chính của quy tắc MA 10 ngày không lọc:', 'Main drawback of an unfiltered 10-day rule:', ['Quá chậm', 'Nhiều whipsaw, chi phí cao', 'Không có tín hiệu', 'Chỉ mua'], ['Too slow', 'Many whipsaws, high costs', 'No signals', 'Long only'], 1, '', ''],
    ['Hệ thống xu hướng thường hoạt động kém nhất khi:', 'Trend systems usually struggle most:', ['Thị trường có xu hướng mạnh', 'Thị trường đi ngang biến động', 'Có tin tức', 'Cuối năm'], ['Strong trends', 'Choppy sideways markets', 'News', 'Year-end'], 1, '', ''],
    ['Thanh khoản quan trọng với hệ thống xu hướng vì:', 'Liquidity matters because:', ['Giảm trượt giá khi vào/ra', 'Tăng đòn bẩy', 'Tăng cổ tức', 'Không quan trọng'], ['Lower slippage on entry/exit', 'More leverage', 'More dividends', 'It doesn’t'], 0, '', ''],
    ['Kết hợp phá dải với ADX > 20 nhằm:', 'Combining band breaks with ADX > 20 aims to:', ['Chỉ lấy phá vỡ khi có xu hướng', 'Tăng số lệnh', 'Bỏ cắt lỗ', 'Giao dịch ngược xu hướng'], ['Take breaks only in trending conditions', 'More trades', 'No stops', 'Counter-trend trading'], 0, '', ''],
    ['Thoát lệnh bằng trailing stop trong hệ thống xu hướng giúp:', 'Trailing exits in trend systems:', ['Giữ phần lớn lợi nhuận khi xu hướng kết thúc', 'Tăng tỷ lệ thắng lên 100%', 'Loại bỏ thua lỗ', 'Không tác dụng'], ['Keep most profit when the trend ends', '100% win rate', 'No losses', 'No effect'], 0, '', '']
  ]);

  /* ================= L2-05 ================= */
  C.addLesson('l2-05', {
    goals: ['Biết cách chọn độ dài MA phù hợp.', 'Giải thích vai trò từng MA trong hệ 2 đường và 3 đường.', 'So sánh hai quy tắc thoát lệnh với MA và lý do một quy tắc thường được ưu tiên.', 'Thiết kế hệ thống "vào chậm, ra nhanh".'],
    body: () => `
<h3>1. Chọn độ dài MA "đúng"</h3>
<ul><li><b>Khớp với khung thời gian và mục tiêu</b>: đầu tư dài hạn (MA 100–200 ngày, MA 40 tuần), giao dịch trung hạn (20–50), ngắn hạn (5–20).</li>
<li><b>Khớp với mức nhiễu của thị trường</b>: thị trường nhiễu cần MA dài hơn hoặc dải lọc rộng hơn để giảm whipsaw.</li>
<li><b>Kiểm định một dải độ dài</b>, không chỉ một giá trị. Chọn giá trị nằm giữa một <b>vùng ổn định</b> (cao nguyên) thay vì "đỉnh nhọn" tối ưu (Level 1, Bài 38, 40).</li>
<li>Ưu tiên giá trị phổ biến (20, 50, 200) vì nhiều người theo dõi có thể làm mức đó tự củng cố; nhưng chớ tin vào "con số thần kỳ".</li></ul>
<h3>2. Hệ hai đường và ba đường</h3>
<table class="tbl"><thead><tr><th>Đường</th><th>Vai trò</th></tr></thead><tbody>
<tr><td>MA nhanh</td><td>Định thời điểm vào/ra; phản ứng sớm</td></tr>
<tr><td>MA trung</td><td>Xác nhận; chỉ vào lệnh khi nhanh và trung cùng hướng</td></tr>
<tr><td>MA chậm</td><td>Bộ lọc xu hướng chính; chỉ giao dịch theo hướng của nó</td></tr></tbody></table>
<p>Hệ 3 đường (ví dụ 4–9–18 ngày): <b>mua khi nhanh &gt; trung &gt; chậm</b>, <b>bán khi nhanh &lt; trung &lt; chậm</b>, các trạng thái khác là trung lập/giữ nguyên. Hệ 2 đường (ví dụ 50/200) đơn giản hơn, chậm hơn, ít tín hiệu hơn.</p>
<h3>3. Hai quy tắc thoát lệnh</h3>
<ol><li><b>Thoát khi có tín hiệu ngược (stop-and-reverse)</b>: chờ chính giao cắt đã dùng để vào lệnh đảo ngược. Luôn có vị thế; nhưng thường trả lại một phần lớn lợi nhuận vì tín hiệu ngược đến muộn.</li>
<li><b>Thoát sớm bằng thành phần nhanh hơn</b>: ví dụ vào lệnh theo giao cắt 9/18 nhưng thoát khi giá cắt xuống MA 4 (hoặc trailing stop). Đứng ngoài trong giai đoạn trung lập.</li></ol>
<div class="callout">Quy tắc 2 thường được đánh giá <b>tốt hơn</b>: tín hiệu vào lệnh cần chắc chắn (chậm, nhiều xác nhận), nhưng tín hiệu thoát cần <b>nhanh</b> để bảo vệ lợi nhuận và giảm sụt giảm. Đây là nguyên tắc <b>"vào chậm, ra nhanh"</b> — tính bất đối xứng giữa vào và ra.</div>
<h3>4. Thực hành</h3>
<p>Dùng công cụ dưới đây: chạy hệ 3 đường 4–9–18 với hai quy tắc thoát, so sánh max drawdown và profit factor. Sau đó thử hệ 2 đường 50/200 trên khung tuần.</p>
${H.trendSys()}`,
    keys: ['Chọn MA theo khung thời gian, mức nhiễu; kiểm định một dải và chọn vùng ổn định.', 'Hệ nhiều đường: nhanh = định thời điểm, trung = xác nhận, chậm = bộ lọc xu hướng.', 'Hệ 3 đường: mua khi nhanh > trung > chậm; còn lại trung lập.', 'Hai quy tắc thoát: chờ tín hiệu ngược hoặc thoát sớm bằng thành phần nhanh — quy tắc sau thường tốt hơn.', 'Nguyên tắc "vào chậm, ra nhanh".'],
    terms: [['Stop-and-reverse', 'Dừng và đảo vị thế'], ['Three-MA crossover', 'Hệ giao cắt 3 đường'], ['Plateau (parameter)', 'Vùng tham số ổn định'], ['Asymmetric exits', 'Thoát bất đối xứng']]
  }, {
    goals: ['Choose MA lengths.', 'Roles of MAs in two- and three-MA methods.', 'Compare two MA exit rules.', 'Design "enter slow, exit fast".'],
    body: () => `
<h3>1. Choosing the MA</h3><ul><li>Match horizon and goal.</li><li>Match market noise.</li><li>Test a range; pick a stable plateau.</li><li>Popular values help but are not magic.</li></ul>
<h3>2. Two- and three-MA methods</h3><table class="tbl"><tbody><tr><td>Fast</td><td>timing</td></tr><tr><td>Medium</td><td>confirmation</td></tr><tr><td>Slow</td><td>trend filter</td></tr></tbody></table><p>Three-MA (e.g. 4-9-18): long when fast &gt; medium &gt; slow, short when reversed, otherwise neutral.</p>
<h3>3. Two exit rules</h3><ol><li>Exit on the reverse signal (stop-and-reverse) — gives back profits.</li><li>Exit earlier on a faster component or trailing stop.</li></ol><div class="callout">Rule 2 is generally considered better: <b>enter slowly, exit quickly</b>.</div>${H.trendSys()}`,
    keys: ['Horizon, noise, plateaus.', 'Fast/medium/slow roles.', 'Three-MA alignment.', 'Faster exits generally better.', 'Enter slow, exit fast.'],
    terms: [['Stop-and-reverse', 'Always-in-market reversal'], ['Plateau', 'Stable parameter region']]
  }, [
    ['Nhà đầu tư dài hạn thường dùng MA nào?', 'Long-term investors typically use:', ['MA 5 ngày', 'MA 200 ngày hoặc 40 tuần', 'MA 3 phút', 'MA 1 ngày'], ['5-day', '200-day or 40-week', '3-minute', '1-day'], 1, '', ''],
    ['Thị trường rất nhiễu nên dùng:', 'A very noisy market calls for:', ['MA ngắn hơn', 'MA dài hơn hoặc dải lọc rộng hơn', 'Không dùng MA', 'MA 1 kỳ'], ['Shorter MA', 'Longer MA or wider filter', 'No MA', '1-period MA'], 1, '', ''],
    ['Khi tối ưu độ dài MA, nên chọn:', 'When optimising MA length choose:', ['Đỉnh nhọn tốt nhất', 'Giá trị giữa vùng kết quả ổn định', 'Giá trị tệ nhất', 'Ngẫu nhiên'], ['The sharp best peak', 'A value mid-way in a stable region', 'The worst', 'Random'], 1, '', ''],
    ['Trong hệ 3 đường, MA chậm đóng vai trò:', 'In a three-MA system the slow MA:', ['Định thời điểm', 'Bộ lọc xu hướng chính', 'Đo khối lượng', 'Không có vai trò'], ['Timing', 'Main trend filter', 'Volume', 'None'], 1, '', ''],
    ['Hệ 4–9–18: MA4 = 52, MA9 = 50, MA18 = 51. Trạng thái:', '4-9-18: MA4 52, MA9 50, MA18 51. State:', ['Mua', 'Bán', 'Trung lập', 'Bán khống mạnh'], ['Long', 'Short', 'Neutral', 'Strong short'], 2, 'Không xếp đúng thứ tự tăng hay giảm.', ''],
    ['Hệ 4–9–18: 55 > 53 > 50. Trạng thái:', '4-9-18: 55 > 53 > 50:', ['Mua', 'Bán', 'Trung lập', 'Không xác định'], ['Long', 'Short', 'Neutral', 'Undefined'], 0, '', ''],
    ['Nhược điểm của thoát lệnh bằng tín hiệu ngược (stop-and-reverse):', 'Drawback of exiting on the reverse signal:', ['Thoát quá sớm', 'Thường trả lại phần lớn lợi nhuận vì tín hiệu đến muộn', 'Không có vị thế', 'Phí bằng 0'], ['Exits too early', 'Often gives back much profit as the signal is late', 'No positions', 'Zero fees'], 1, '', ''],
    ['Quy tắc thoát thường được đánh giá tốt hơn là:', 'The generally preferred exit rule:', ['Chờ tín hiệu ngược', 'Thoát sớm bằng thành phần nhanh/trailing stop', 'Không bao giờ thoát', 'Thoát ngẫu nhiên'], ['Wait for the reverse signal', 'Exit earlier on a faster component/trailing stop', 'Never exit', 'Random exits'], 1, '', ''],
    ['"Vào chậm, ra nhanh" nghĩa là:', '"Enter slow, exit fast" means:', ['Vào khi nhiều xác nhận, thoát nhanh để bảo vệ lợi nhuận', 'Vào ngay, thoát chậm', 'Không giao dịch', 'Giao dịch ngược xu hướng'], ['Enter on confirmation, exit quickly to protect profits', 'Enter instantly, exit late', 'No trading', 'Counter-trend'], 0, '', ''],
    ['Hệ 2 đường 50/200 so với hệ 4–9–18:', 'A 50/200 system vs 4-9-18:', ['Nhanh hơn, nhiều tín hiệu', 'Chậm hơn, ít tín hiệu hơn', 'Giống hệt', 'Không có tín hiệu'], ['Faster, more signals', 'Slower, fewer signals', 'Identical', 'No signals'], 1, '', ''],
    ['Vai trò của MA nhanh:', 'The fast MA’s role:', ['Định thời điểm vào/ra', 'Bộ lọc dài hạn', 'Đo biến động', 'Đo độ rộng'], ['Timing entries/exits', 'Long filter', 'Volatility', 'Breadth'], 0, '', ''],
    ['Hệ stop-and-reverse luôn:', 'A stop-and-reverse system is always:', ['Có vị thế (mua hoặc bán)', 'Đứng ngoài', 'Chỉ mua', 'Chỉ bán'], ['In the market (long or short)', 'Flat', 'Long only', 'Short only'], 0, '', ''],
    ['Thoát sớm bằng thành phần nhanh thường giúp giảm:', 'Exiting early on the fast component reduces:', ['Max drawdown và lợi nhuận bị trả lại', 'Số lệnh về 0', 'Tỷ lệ thắng', 'Thanh khoản'], ['Drawdown and giveback', 'Trades to zero', 'Win rate', 'Liquidity'], 0, '', ''],
    ['Vì sao nên kiểm định một dải độ dài MA thay vì một giá trị?', 'Why test a range of MA lengths?', ['Để thấy độ bền của hệ thống', 'Cho vui', 'Giảm dữ liệu', 'Không cần'], ['To see robustness', 'For fun', 'Less data', 'No need'], 0, '', ''],
    ['Một nhược điểm khi chọn MA "phổ biến" như 200:', 'A drawback of a popular MA like 200:', ['Không ai theo dõi', 'Nhiều người cùng đặt lệnh quanh đó có thể tạo phá vỡ giả/quét lệnh', 'Không tính được', 'Quá nhanh'], ['Nobody watches it', 'Crowded orders can cause false breaks/stop runs', 'Incomputable', 'Too fast'], 1, '', ''],
    ['Trạng thái trung lập trong hệ 3 đường giúp:', 'A neutral state in three-MA systems:', ['Đứng ngoài khi tín hiệu mâu thuẫn', 'Tăng đòn bẩy', 'Tăng tần suất giao dịch', 'Không có lợi'], ['Stay out when signals conflict', 'More leverage', 'More trades', 'No benefit'], 0, '', ''],
    ['Trailing stop là:', 'A trailing stop:', ['Điểm dừng cố định', 'Điểm dừng dời theo hướng có lợi', 'Lệnh mua thêm', 'Lệnh giới hạn'], ['Fixed stop', 'A stop moved in the favourable direction', 'Add-on order', 'Limit order'], 1, '', ''],
    ['MA trung trong hệ 3 đường có vai trò:', 'The medium MA in a three-MA system:', ['Xác nhận tín hiệu của MA nhanh', 'Đo khối lượng', 'Bỏ qua', 'Thay thế MA chậm'], ['Confirms the fast MA', 'Volume', 'Ignored', 'Replaces the slow MA'], 0, '', ''],
    ['Hệ có profit factor 1.8 và max drawdown 15% so với hệ có profit factor 1.9 và max drawdown 40%. Lựa chọn hợp lý cho đa số:', 'PF 1.8 with 15% DD vs PF 1.9 with 40% DD. Sensible choice:', ['Hệ thứ hai', 'Hệ thứ nhất — rủi ro thấp hơn nhiều, dễ tuân thủ', 'Không chọn', 'Ngẫu nhiên'], ['The second', 'The first — far lower risk, easier to follow', 'Neither', 'Random'], 1, '', ''],
    ['Tín hiệu vào lệnh trong triết lý "vào chậm" nên:', 'Entries under "enter slow" should be:', ['Có nhiều xác nhận', 'Ngay khi giá nhúc nhích', 'Theo tin đồn', 'Ngẫu nhiên'], ['Well confirmed', 'On the first wiggle', 'On rumours', 'Random'], 0, '', '']
  ]);

  /* ================= L2-06 ================= */
  C.addLesson('l2-06', {
    goals: ['Phân biệt momentum và ROC; các cách tính động lượng.', 'Dùng động lượng để xác định xu hướng (qua đường 0) và cực trị giá (quá mua/quá bán, phân kỳ).', 'Tính và sử dụng MACD: đường MACD, tín hiệu, histogram.', 'So sánh RSI, Stochastic, TRIX và tín hiệu của chúng (kể cả failure swing của RSI).'],
    body: () => `
<h3>1. Momentum và ROC</h3>
<ul><li><b>Momentum</b> = C<sub>t</sub> − C<sub>t−n</sub> (đơn vị giá). Không so sánh được giữa các tài sản có mức giá khác nhau.</li>
<li><b>ROC</b> = (C<sub>t</sub>/C<sub>t−n</sub> − 1) × 100 (đơn vị %). Chuẩn hoá nên so sánh được. Một số tài liệu dùng dạng tỷ số C<sub>t</sub>/C<sub>t−n</sub> × 100 (đường trung tâm là 100).</li></ul>
<h3>2. Hai cách dùng động lượng</h3>
<table class="tbl"><thead><tr><th>Mục đích</th><th>Tín hiệu</th></tr></thead><tbody>
<tr><td><b>Chỉ báo xu hướng</b></td><td>Cắt qua đường 0 (hoặc 100): dương = xu hướng tăng; độ dốc của momentum = gia tốc</td></tr>
<tr><td><b>Tìm cực trị giá</b></td><td>Vùng quá mua/quá bán (theo lịch sử của chính tài sản); <b>phân kỳ</b> giữa giá và động lượng cảnh báo xu hướng yếu đi</td></tr></tbody></table>
<h3>3. MACD (Gerald Appel)</h3>
<ul><li><b>Đường MACD</b> = EMA12 − EMA26. <b>Đường tín hiệu</b> = EMA9 của MACD. <b>Histogram</b> = MACD − tín hiệu.</li>
<li>Tín hiệu: MACD cắt đường tín hiệu; MACD cắt 0 (tương đương EMA12 cắt EMA26); phân kỳ MACD với giá; histogram đổi chiều (cảnh báo sớm nhất, vì histogram là "động lượng của động lượng").</li></ul>
<h3>4. RSI (J. Welles Wilder)</h3>
<p>RSI = 100 − 100/(1 + RS), RS = trung bình mức tăng / trung bình mức giảm trong 14 kỳ (làm mượt kiểu Wilder).</p>
<div class="callout"><b>Ví dụ</b>: trung bình tăng 1.2, trung bình giảm 0.8 → RS = 1.5 → RSI = 100 − 100/2.5 = <b>60</b>.</div>
<ul><li>Quá mua &gt; 70, quá bán &lt; 30 (hoặc 80/20 trong xu hướng mạnh).</li>
<li><b>Dịch chuyển vùng</b>: trong xu hướng tăng RSI thường dao động 40–80, xu hướng giảm 20–60.</li>
<li><b>Failure swing</b> (Wilder): đỉnh: RSI vượt 70, giảm, hồi nhưng không vượt lại đỉnh RSI trước, rồi thủng đáy của nhịp giảm trước → tín hiệu bán, độc lập với giá. Đáy: ngược lại.</li></ul>
<h3>5. Stochastic (George Lane) và TRIX</h3>
<ul><li><b>%K</b> = (C − L<sub>n</sub>)/(H<sub>n</sub> − L<sub>n</sub>) × 100, với H<sub>n</sub>, L<sub>n</sub> là cao/thấp nhất n kỳ. <b>%D</b> = SMA3 của %K. Bản "chậm" dùng %D làm %K và làm mượt thêm. Ý tưởng: trong xu hướng tăng, giá đóng cửa gần đỉnh biên độ.</li>
<li><b>TRIX</b> = % thay đổi 1 kỳ của EMA ba lần (EMA của EMA của EMA). Loại bỏ chu kỳ ngắn hơn độ dài chọn; cắt 0 và cắt đường tín hiệu là tín hiệu.</li></ul>
${H.oscLab('rsi')}
<div class="callout">Nguyên tắc dùng dao động: <b>ưu tiên tín hiệu cùng chiều xu hướng</b>. Trong xu hướng tăng, dùng quá bán để mua điều chỉnh; tín hiệu quá mua chỉ là cảnh báo, không phải lệnh bán khống.</div>`,
    keys: ['Momentum = C − C(n) (đơn vị giá); ROC = % thay đổi (chuẩn hoá).', 'Động lượng dùng cho xu hướng (đường 0) và cực trị (quá mua/bán, phân kỳ).', 'MACD = EMA12 − EMA26; tín hiệu EMA9; histogram cảnh báo sớm nhất.', 'RSI = 100 − 100/(1+RS); dịch chuyển vùng theo xu hướng; failure swing của Wilder.', 'Stochastic đo vị trí đóng cửa trong biên độ n kỳ; TRIX = ROC của EMA ba lần.', 'Ưu tiên tín hiệu dao động cùng chiều xu hướng.'],
    terms: [['ROC', 'Tốc độ thay đổi'], ['MACD / Signal / Histogram', 'Đường MACD / tín hiệu / biểu đồ cột'], ['RSI / RS', 'Chỉ số sức mạnh tương đối / tỷ số tăng–giảm'], ['Failure swing', 'Dao động thất bại'], ['%K / %D', 'Đường Stochastic nhanh / chậm'], ['TRIX', 'ROC của EMA ba lần'], ['Range shift', 'Dịch chuyển vùng RSI']]
  }, {
    goals: ['Distinguish momentum and ROC.', 'Use momentum for trend and extremes.', 'Compute and use MACD.', 'Compare RSI, Stochastics, TRIX including RSI failure swings.'],
    body: () => `
<h3>1. Momentum vs ROC</h3><ul><li>Momentum = C<sub>t</sub> − C<sub>t−n</sub> (price units).</li><li>ROC = (C<sub>t</sub>/C<sub>t−n</sub> − 1)·100 (or ratio ×100 around 100).</li></ul>
<h3>2. Uses</h3><table class="tbl"><tbody><tr><td>Trend</td><td>zero-line crosses, slope</td></tr><tr><td>Extremes</td><td>overbought/oversold, divergence</td></tr></tbody></table>
<h3>3. MACD</h3><p>EMA12 − EMA26; signal EMA9; histogram; crossovers, zero line, divergence, histogram turns (earliest).</p>
<h3>4. RSI</h3><p>RSI = 100 − 100/(1 + RS).</p><div class="callout">Avg gain 1.2, avg loss 0.8 → RS 1.5 → RSI 60.</div><ul><li>70/30 (80/20).</li><li>Range shift: 40–80 in uptrends, 20–60 in downtrends.</li><li>Wilder’s failure swings.</li></ul>
<h3>5. Stochastics and TRIX</h3><ul><li>%K = (C − L<sub>n</sub>)/(H<sub>n</sub> − L<sub>n</sub>)·100; %D = SMA3.</li><li>TRIX = 1-bar % change of a triple EMA.</li></ul>${H.oscLab('rsi')}<div class="callout">Favour oscillator signals in the trend’s direction.</div>`,
    keys: ['Momentum vs ROC.', 'Trend and extremes.', 'MACD components.', 'RSI, range shift, failure swings.', 'Stochastics and TRIX.', 'Trade with the trend.'],
    terms: [['Failure swing', 'Wilder’s RSI reversal pattern'], ['Range shift', 'RSI band change with trend']]
  }, [
    ['C hôm nay 66, C 10 kỳ trước 60. ROC 10 (%) là:', 'C 66, C 10 bars ago 60. ROC10 (%):', ['6', '10', '1.1', '−10'], null, 1, '(66/60 − 1) × 100 = 10%.', ''],
    ['Vì sao ROC so sánh được giữa các cổ phiếu còn momentum thì không?', 'Why is ROC comparable across stocks but momentum is not?', ['ROC tính theo %, momentum theo đơn vị giá', 'ROC dùng khối lượng', 'Không đúng', 'Momentum dùng log'], ['ROC is %, momentum is price units', 'ROC uses volume', 'False', 'Momentum is log'], 0, '', ''],
    ['MACD tiêu chuẩn = ', 'Standard MACD =', ['EMA12 − EMA26', 'SMA12 − SMA26', 'EMA26 − EMA12', 'EMA9 của giá'], null, 0, '', ''],
    ['MACD cắt lên đường 0 tương đương với:', 'MACD crossing above zero equals:', ['EMA12 cắt lên EMA26', 'RSI > 50', 'Giá cắt EMA9', 'Histogram âm'], ['EMA12 crossing above EMA26', 'RSI > 50', 'Price crossing EMA9', 'Negative histogram'], 0, '', ''],
    ['Tín hiệu nào của MACD thường xuất hiện sớm nhất?', 'Which MACD signal usually comes first?', ['Cắt 0', 'Histogram đổi chiều', 'Cắt đường tín hiệu', 'Không có'], ['Zero cross', 'Histogram turn', 'Signal cross', 'None'], 1, 'Histogram là động lượng của động lượng.', ''],
    ['Trung bình tăng 2, trung bình giảm 1. RSI =', 'Avg gain 2, avg loss 1. RSI =', ['50', '66.7', '75', '33.3'], null, 1, 'RS = 2 → 100 − 100/3 = 66.7.', ''],
    ['Trung bình tăng 0.5, trung bình giảm 1.5. RSI =', 'Avg gain 0.5, avg loss 1.5. RSI =', ['25', '33.3', '50', '75'], null, 0, 'RS = 1/3 → 100 − 100/(4/3) = 25.', ''],
    ['Trong xu hướng tăng mạnh, RSI thường dao động trong vùng:', 'In strong uptrends RSI usually ranges:', ['0–30', '20–60', '40–80', '70–100'], null, 2, 'Dịch chuyển vùng.', ''],
    ['Failure swing đỉnh của RSI hoàn thành khi:', 'An RSI top failure swing completes when:', ['RSI vượt 70', 'RSI không vượt lại đỉnh trước rồi thủng đáy RSI của nhịp giảm trước', 'Giá lập đỉnh mới', 'RSI = 50'], ['RSI exceeds 70', 'RSI fails below its prior peak, then breaks its prior trough', 'New price high', 'RSI = 50'], 1, '', ''],
    ['Biên độ 14 phiên: cao 120, thấp 100, đóng cửa 115. %K =', '14-bar high 120, low 100, close 115. %K =', ['15', '50', '75', '115'], null, 2, '(115 − 100)/20 × 100 = 75.', ''],
    ['%D của Stochastic thường là:', 'Stochastic %D is usually:', ['SMA3 của %K', 'EMA26', 'RSI của %K', '%K × 2'], ['SMA3 of %K', 'EMA26', 'RSI of %K', '%K × 2'], 0, '', ''],
    ['Ý tưởng nền của Stochastic là:', 'Stochastics’ underlying idea:', ['Trong xu hướng tăng, giá đóng cửa thường gần đỉnh biên độ', 'Khối lượng đi trước giá', 'Giá ngẫu nhiên', 'Chu kỳ 4 năm'], ['In uptrends closes cluster near the range high', 'Volume leads price', 'Random prices', 'Four-year cycle'], 0, '', ''],
    ['TRIX được tính từ:', 'TRIX is computed from:', ['EMA ba lần của giá, lấy % thay đổi 1 kỳ', 'Ba MA đơn', 'RSI ba kỳ', 'Khối lượng'], ['A triple EMA, 1-bar % change', 'Three SMAs', '3-period RSI', 'Volume'], 0, '', ''],
    ['Giá lập đỉnh mới nhưng MACD lập đỉnh thấp hơn. Đây là:', 'New price high, lower MACD high:', ['Phân kỳ âm — cảnh báo', 'Xác nhận tăng', 'Tín hiệu mua', 'Không ý nghĩa'], ['Bearish divergence — warning', 'Bullish confirmation', 'Buy', 'Nothing'], 0, '', ''],
    ['Trong xu hướng tăng, cách dùng dao động hợp lý là:', 'In an uptrend use oscillators to:', ['Bán khống mỗi khi quá mua', 'Mua khi quá bán (điều chỉnh), coi quá mua là cảnh báo', 'Bỏ qua hoàn toàn', 'Chỉ dùng phân kỳ dương'], ['Short every overbought', 'Buy oversold pullbacks; treat overbought as a warning', 'Ignore them', 'Only bullish divergence'], 1, '', ''],
    ['Momentum dương và đang giảm dần (độ dốc âm) nghĩa là:', 'Positive but falling momentum means:', ['Giá đang giảm', 'Giá vẫn tăng nhưng tốc độ chậm lại', 'Xu hướng giảm mạnh', 'Không ý nghĩa'], ['Price falling', 'Price still rising but decelerating', 'Strong downtrend', 'Nothing'], 1, '', ''],
    ['ROC dạng tỷ số (C/C(n) × 100) có đường trung tâm ở:', 'Ratio-form ROC (C/C(n)·100) centres on:', ['0', '50', '100', '1'], null, 2, '', ''],
    ['MACD = 1.2, tín hiệu = 1.5. Histogram =', 'MACD 1.2, signal 1.5. Histogram:', ['2.7', '−0.3', '0.3', '1.5'], null, 1, '', ''],
    ['Ngưỡng quá mua/quá bán tốt nhất nên:', 'Overbought/oversold thresholds are best:', ['Cố định 70/30 cho mọi tài sản', 'Điều chỉnh theo lịch sử và xu hướng của chính tài sản', 'Bằng 50', 'Ngẫu nhiên'], ['Fixed 70/30 everywhere', 'Adapted to the asset’s history and trend', '50', 'Random'], 1, '', ''],
    ['Ai phát triển RSI?', 'Who developed RSI?', ['George Lane', 'J. Welles Wilder', 'Gerald Appel', 'Joseph Granville'], null, 1, 'Lane: Stochastic; Appel: MACD; Granville: OBV.', '']
  ]);

  /* ================= L2-07 ================= */
  C.addLesson('l2-07', {
    goals: ['Diễn giải chuẩn mực khối lượng và hợp đồng mở trong cổ phiếu và hợp đồng tương lai.', 'So sánh OBV, A/D, VWAP và các chỉ báo khối lượng khác.', 'Phân tích thay đổi độ rộng; McClellan (kể cả dạng điều chỉnh theo tỷ lệ).', 'Diễn giải Arms Index và Thrust Oscillator.'],
    body: () => `
<h3>1. Khối lượng và OI — quy tắc chuẩn</h3>
<table class="tbl"><thead><tr><th>Giá</th><th>Khối lượng</th><th>OI (phái sinh)</th><th>Diễn giải</th></tr></thead><tbody>
<tr><td>Tăng</td><td>Tăng</td><td>Tăng</td><td class="up">Mạnh</td></tr><tr><td>Tăng</td><td>Giảm</td><td>Giảm</td><td class="down">Yếu (đóng vị thế bán)</td></tr>
<tr><td>Giảm</td><td>Tăng</td><td>Tăng</td><td class="down">Mạnh (phía giảm)</td></tr><tr><td>Giảm</td><td>Giảm</td><td>Giảm</td><td class="up">Yếu (thanh lý mua)</td></tr></tbody></table>
<p>Với cổ phiếu (không có OI), khối lượng xác nhận xu hướng, phá vỡ và cao trào. Với tương lai, OI thường giảm theo mùa gần đáo hạn, nên cần so sánh trên chuỗi tổng các kỳ hạn.</p>
<h3>2. Chỉ báo khối lượng</h3>
<table class="tbl"><thead><tr><th>Chỉ báo</th><th>Công thức ý tưởng</th><th>Dùng để</th></tr></thead><tbody>
<tr><td>OBV (Granville)</td><td>± toàn bộ khối lượng theo hướng đóng cửa</td><td>Xác nhận, phân kỳ, phá vỡ OBV trước giá</td></tr>
<tr><td>A/D (Chaikin)</td><td>Khối lượng × [(C−L)−(H−C)]/(H−L)</td><td>Tích lũy/phân phối trong phiên</td></tr>
<tr><td>Chaikin Oscillator</td><td>EMA3 − EMA10 của đường A/D</td><td>Động lượng của dòng tiền</td></tr>
<tr><td>VWAP</td><td>Σ(giá × khối lượng)/Σ khối lượng từ đầu phiên</td><td>Chuẩn đánh giá khớp lệnh của tổ chức; trên VWAP = bên mua kiểm soát trong phiên</td></tr>
<tr><td>Volume-Price Trend</td><td>Cộng dồn khối lượng × % thay đổi giá</td><td>Như OBV nhưng theo tỷ lệ</td></tr></tbody></table>
<div class="callout"><b>Ví dụ VWAP</b>: 3 lần khớp: 1.000 cp giá 10; 2.000 cp giá 11; 1.000 cp giá 12. VWAP = (10.000 + 22.000 + 12.000)/4.000 = <b>11.0</b>.</div>
${H.volConfirm()}
<h3>3. Độ rộng nâng cao</h3>
<ul><li><b>Đường A/D</b> phân kỳ với chỉ số thường cảnh báo đỉnh sớm (Level 1, Bài 14).</li>
<li><b>McClellan Oscillator</b> = EMA19 − EMA39 của (tăng − giảm). Dạng <b>điều chỉnh theo tỷ lệ</b> dùng (tăng − giảm)/(tăng + giảm) × 1.000 để loại ảnh hưởng của số lượng mã niêm yết thay đổi theo thời gian.</li>
<li><b>Summation Index</b>: cộng dồn McClellan; vượt các ngưỡng cao (theo dạng điều chỉnh) gắn với khởi đầu thị trường tăng.</li></ul>
<h3>4. Kết hợp độ rộng và khối lượng</h3>
<ul><li><b>Arms Index (TRIN)</b> = (A/D số mã)/(A/D khối lượng). Thường làm mượt bằng MA 10 ngày: MA10 &gt; 1.2–1.3 là quá bán, &lt; 0.8 là quá mua (ngưỡng tuỳ thị trường).</li>
<li><b>Thrust Oscillator</b> = (Số mã tăng × KL tăng − Số mã giảm × KL giảm)/(Số mã tăng × KL tăng + Số mã giảm × KL giảm). Dao động −1 đến +1, kết hợp cả độ rộng và khối lượng theo cùng chiều (không nghịch như TRIN).</li>
<li><b>Lực đẩy độ rộng</b> (breadth thrust) như đã học: chuyển rất nhanh từ quá bán sang mua lan rộng.</li></ul>`,
    keys: ['Bảng giá–khối lượng–OI; OI phái sinh giảm theo mùa gần đáo hạn.', 'OBV, A/D, Chaikin Oscillator, VWAP (chuẩn khớp lệnh tổ chức), VPT.', 'McClellan và dạng điều chỉnh theo tỷ lệ; Summation Index.', 'TRIN thường làm mượt MA10; Thrust Oscillator kết hợp độ rộng và khối lượng cùng chiều, −1 đến +1.'],
    terms: [['VWAP', 'Giá bình quân theo khối lượng'], ['Chaikin Oscillator', 'Dao động Chaikin'], ['Ratio-adjusted McClellan', 'McClellan điều chỉnh theo tỷ lệ'], ['Thrust Oscillator', 'Dao động lực đẩy'], ['Volume-Price Trend', 'Xu hướng giá–khối lượng']]
  }, {
    goals: ['Standard volume and OI interpretation.', 'Compare OBV, A/D, VWAP and others.', 'Breadth, including ratio-adjusted McClellan.', 'Arms Index and Thrust Oscillator.'],
    body: () => `
<h3>1. Volume and OI</h3><table class="tbl"><tbody><tr><td>Up/up/up</td><td>strong</td></tr><tr><td>Up/down/down</td><td>weak (short covering)</td></tr><tr><td>Down/up/up</td><td>strong down</td></tr><tr><td>Down/down/down</td><td>weak (long liquidation)</td></tr></tbody></table><p>Futures OI falls seasonally near expiry — use totals across months.</p>
<h3>2. Volume indicators</h3><table class="tbl"><tbody><tr><td>OBV</td><td>± full volume</td></tr><tr><td>A/D</td><td>volume × CLV</td></tr><tr><td>Chaikin Oscillator</td><td>EMA3 − EMA10 of A/D</td></tr><tr><td>VWAP</td><td>Σ(p·v)/Σv — execution benchmark</td></tr><tr><td>VPT</td><td>cumulative volume × % change</td></tr></tbody></table><div class="callout">1,000 @10, 2,000 @11, 1,000 @12 → VWAP 11.0.</div>${H.volConfirm()}
<h3>3. Breadth</h3><ul><li>A/D divergences.</li><li>McClellan; ratio-adjusted form (A − D)/(A + D)·1000.</li><li>Summation Index thresholds.</li></ul>
<h3>4. Breadth with volume</h3><ul><li>TRIN, often smoothed with a 10-day MA.</li><li>Thrust Oscillator = (A·AV − D·DV)/(A·AV + D·DV), −1 to +1.</li><li>Breadth thrusts.</li></ul>`,
    keys: ['Price–volume–OI table.', 'OBV, A/D, Chaikin, VWAP, VPT.', 'Ratio-adjusted McClellan.', 'TRIN MA10; Thrust Oscillator.'],
    terms: [['VWAP', 'Volume-weighted average price'], ['Thrust Oscillator', 'Breadth × volume oscillator']]
  }, [
    ['Hợp đồng tương lai: giá giảm, khối lượng giảm, OI giảm. Đọc:', 'Futures: price down, volume down, OI down:', ['Xu hướng giảm mạnh', 'Giảm yếu — thanh lý vị thế mua', 'Tăng mạnh', 'Short squeeze'], ['Strong decline', 'Weak decline — long liquidation', 'Strong rise', 'Short squeeze'], 1, '', ''],
    ['Vì sao OI của một hợp đồng giảm dần khi gần đáo hạn?', 'Why does OI fall near expiry?', ['Thị trường yếu', 'Vị thế được đóng/chuyển sang kỳ hạn sau — yếu tố mùa vụ', 'Lỗi dữ liệu', 'Cổ tức'], ['Weak market', 'Positions close/roll — seasonal', 'Data error', 'Dividends'], 1, '', ''],
    ['VWAP của: 500 cp giá 20 và 1.500 cp giá 24 là:', 'VWAP of 500 @20 and 1,500 @24:', ['22', '23', '24', '21'], null, 1, '(10.000 + 36.000)/2.000 = 23.', ''],
    ['Giá giao dịch trên VWAP trong phiên thường cho thấy:', 'Trading above VWAP intraday suggests:', ['Bên bán kiểm soát', 'Bên mua kiểm soát trong phiên', 'Không ý nghĩa', 'Sắp đóng cửa'], ['Sellers in control', 'Buyers in control intraday', 'Nothing', 'Near the close'], 1, '', ''],
    ['Chaikin Oscillator =', 'Chaikin Oscillator =', ['EMA3 − EMA10 của đường A/D', 'OBV − MA', 'RSI của khối lượng', 'TRIN × 10'], ['EMA3 − EMA10 of the A/D line', 'OBV − MA', 'RSI of volume', 'TRIN × 10'], 0, '', ''],
    ['Ai phát triển OBV?', 'Who developed OBV?', ['Joseph Granville', 'Marc Chaikin', 'Richard Arms', 'Sherman McClellan'], null, 0, '', ''],
    ['McClellan điều chỉnh theo tỷ lệ dùng:', 'Ratio-adjusted McClellan uses:', ['(Tăng − giảm)/(tăng + giảm) × 1.000', 'Tăng × giảm', 'Khối lượng', 'Giá đóng cửa'], ['(A − D)/(A + D) × 1000', 'A × D', 'Volume', 'Closes'], 0, 'Loại ảnh hưởng của số mã niêm yết thay đổi.', ''],
    ['Lý do dùng dạng điều chỉnh theo tỷ lệ là:', 'The ratio-adjusted form exists because:', ['Số mã niêm yết thay đổi theo thời gian', 'Cho đẹp', 'Dữ liệu ít', 'Không có lý do'], ['The number of issues changes over time', 'Aesthetics', 'Little data', 'No reason'], 0, '', ''],
    ['300 mã tăng (KL 60 triệu), 200 mã giảm (KL 40 triệu). Thrust Oscillator ≈', '300 adv (60M vol), 200 dec (40M vol). Thrust Oscillator ≈', ['0.38', '0.5', '1.0', '−0.38'], null, 0, '(18.000 − 8.000)/(18.000 + 8.000) ≈ 0.385 (đơn vị: mã × triệu).', ''],
    ['Thrust Oscillator dao động trong khoảng:', 'Thrust Oscillator ranges:', ['0 đến 100', '−1 đến +1', '0 đến 1', 'Không giới hạn'], ['0–100', '−1 to +1', '0–1', 'Unbounded'], 1, '', ''],
    ['TRIN thường được làm mượt bằng:', 'TRIN is often smoothed with:', ['MA 10 ngày', 'EMA 200', 'RSI', 'Không làm mượt'], ['10-day MA', '200-EMA', 'RSI', 'Never'], 0, '', ''],
    ['MA10 của TRIN = 1.35 thường được hiểu là:', 'A 10-day TRIN MA of 1.35 is read as:', ['Quá mua', 'Quá bán (áp lực bán kéo dài)', 'Trung tính', 'Lỗi'], ['Overbought', 'Oversold (sustained selling)', 'Neutral', 'Error'], 1, '', ''],
    ['Khác biệt giữa Thrust Oscillator và TRIN:', 'Thrust Oscillator vs TRIN:', ['Thrust đi cùng chiều thị trường, TRIN nghịch chiều', 'Giống hệt', 'Thrust không dùng khối lượng', 'TRIN không dùng độ rộng'], ['Thrust moves with the market, TRIN inversely', 'Identical', 'Thrust ignores volume', 'TRIN ignores breadth'], 0, '', ''],
    ['OBV phá vỡ lên đỉnh mới trước khi giá phá kháng cự. Gợi ý:', 'OBV breaks to a new high before price clears resistance:', ['Tích lũy đi trước — khả năng giá phá lên', 'Phân phối', 'Không ý nghĩa', 'Bán'], ['Accumulation leads — price may follow', 'Distribution', 'Nothing', 'Sell'], 0, '', ''],
    ['Phiên: H 50, L 40, C 42, KL 10.000. Đóng góp A/D:', 'Bar H 50, L 40, C 42, volume 10,000. A/D contribution:', ['+6.000', '−6.000', '+2.000', '−10.000'], null, 1, 'CLV = [(2) − (8)]/10 = −0.6.', ''],
    ['Cổ phiếu tăng mạnh nhưng khối lượng ngày càng thấp ở mỗi đỉnh mới. Diễn giải:', 'A stock rallies to new highs on ever-lower volume:', ['Xác nhận mạnh', 'Phân kỳ — sự tham gia suy yếu', 'Short squeeze', 'Không ý nghĩa'], ['Strong confirmation', 'Divergence — fading participation', 'Short squeeze', 'Nothing'], 1, '', ''],
    ['Volume-Price Trend khác OBV ở chỗ:', 'VPT differs from OBV by:', ['Nhân khối lượng với % thay đổi giá thay vì cộng/trừ toàn bộ', 'Không dùng khối lượng', 'Chỉ cho phái sinh', 'Giống hệt'], ['Scaling volume by % price change instead of all-or-nothing', 'No volume', 'Derivatives only', 'Identical'], 0, '', ''],
    ['Summation Index tăng vượt ngưỡng rất cao sau đáy lớn thường gắn với:', 'A Summation Index surge to very high levels after a major low:', ['Đỉnh thị trường', 'Khởi đầu thị trường tăng', 'Đi ngang', 'Không gì'], ['A market top', 'The start of a bull market', 'Range', 'Nothing'], 1, '', ''],
    ['Với cổ phiếu cơ sở (không có OI), khối lượng dùng để:', 'For cash stocks (no OI) volume is used to:', ['Xác nhận xu hướng, phá vỡ, nhận diện cao trào', 'Tính cổ tức', 'Không dùng', 'Đo lãi suất'], ['Confirm trends, breakouts, climaxes', 'Dividends', 'Nothing', 'Rates'], 0, '', ''],
    ['Đường A/D đi ngang trong khi chỉ số vốn hoá lập đỉnh mới liên tục 3 tháng. Cảnh báo:', 'A flat A/D line while the cap-weighted index makes new highs for 3 months:', ['Sự tham gia thu hẹp', 'Xu hướng khoẻ toàn diện', 'Không gì', 'Đáy'], ['Narrowing participation', 'Broad health', 'Nothing', 'Bottom'], 0, '', '']
  ]);
})(window.LLW);
