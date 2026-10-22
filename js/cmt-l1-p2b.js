// © 2026 Lai Long Master TA. Bảo lưu mọi quyền. Không sao chép, chỉnh sửa hay dùng lại khi chưa được phép.
/* CMT Level 1 — Part II, lessons 8–11. Written by Lai Long Master TA in its own words. */
(function (L) {
  'use strict';
  const C = L.cmt, F = C.fig;
  const T = (lang, vi, en) => (lang === 'en' ? en : vi);
  const Q = (q, o, a, e) => ({ q, o, a, e });

  /* static P&F drawing: cols = [[dir, lo, hi], ...] in box units */
  function pnfFig(cols, caption, marks) {
    const lo = Math.min(...cols.map(c => c[1])), hi = Math.max(...cols.map(c => c[2])), cs = 18;
    const W = cols.length * cs + 20, H = (hi - lo + 1) * cs + 30;
    const g = [`<svg viewBox="0 0 ${W} ${H}" class="schem cfig" style="max-width:${W * 1.6}px">`];
    cols.forEach((c, k) => {
      for (let r = c[1]; r <= c[2]; r++) {
        const cx = 10 + k * cs + cs / 2, cy = H - 20 - (r - lo + 0.5) * cs, d = cs * 0.32;
        g.push(c[0] > 0 ? `<path d="M${cx - d} ${cy - d}L${cx + d} ${cy + d}M${cx + d} ${cy - d}L${cx - d} ${cy + d}" class="pnf-x"/>` : `<circle cx="${cx}" cy="${cy}" r="${d}" class="pnf-o"/>`);
      }
    });
    (marks || []).forEach(m => g.push(`<text x="${10 + m[0] * cs + cs / 2}" y="${H - 20 - (m[1] - lo + 0.5) * cs - 12}" text-anchor="middle" class="s-label">${m[2]}</text>`));
    g.push('</svg>');
    return `<figure class="schem-fig">${g.join('')}<figcaption>${caption}</figcaption></figure>`;
  }

  /* ---------- figures ---------- */
  const fg = {
    gaps: lg => F.candles({ w: 640, h: 240, bars: [[30, 34, 27, 32], [32, 35, 29, 30], [30, 33, 27, 31], [31, 34, 28, 33], [33, 35, 29, 30], [40, 46, 39, 45], [45, 50, 43, 49], [49, 53, 47, 52], [52, 55, 50, 54], [60, 66, 59, 65], [65, 70, 63, 69], [69, 74, 67, 73], [80, 86, 79, 82], [82, 85, 78, 80], [72, 75, 66, 68], [68, 70, 60, 62]],
      labels: [[5, 'Breakaway', 'b'], [9, 'Runaway', 'b'], [12, 'Exhaustion', 't'], [14, T(lg, 'Đảo (island)', 'Island'), 'b']],
      caption: T(lg, 'Các loại khoảng trống: phá vỡ → tiếp diễn (đo lường) → kiệt sức → đảo chiều dạng đảo', 'Gap types: breakaway → runaway (measuring) → exhaustion → island reversal') }),
    bars2: lg => F.row(
      F.candles({ w: 300, h: 200, bars: [[40, 46, 38, 45], [45, 52, 43, 50], [50, 58, 48, 56], [56, 64, 46, 48]], labels: [[3, 'Key reversal', 't']], caption: T(lg, 'Key reversal: đỉnh mới nhưng đóng cửa dưới phiên trước', 'Key reversal: new high, close below the prior close') }),
      F.candles({ w: 300, h: 200, bars: [[40, 70, 35, 66], [60, 64, 50, 55], [55, 60, 48, 58]], labels: [[1, 'Inside', 't']], caption: T(lg, 'Inside bar: biên độ nằm trọn trong nến trước — tích tụ', 'Inside bar: range inside the prior bar — compression') }),
      F.candles({ w: 300, h: 200, bars: [[50, 56, 46, 54], [55, 58, 50, 52], [53, 64, 42, 44]], labels: [[2, 'Outside', 't']], caption: T(lg, 'Outside bar: bao trùm nến trước — biến động mở rộng', 'Outside bar: engulfs the prior range — expansion') })),
    vol: lg => F.line({ h: 250, series: [{ pts: [[0, 40], [25, 72], [40, 58], [65, 88], [80, 66], [100, 74]] }, { pts: [[0, 5], [25, 30], [40, 20], [65, 24], [80, 10], [100, 14]], cls: 's-price2' }],
      labels: [[65, 88, T(lg, 'Giá: đỉnh cao hơn', 'Price: higher high'), 't'], [65, 24, T(lg, 'OBV: đỉnh thấp hơn → phân kỳ', 'OBV: lower high → divergence'), 't']],
      caption: T(lg, 'Phân kỳ khối lượng: giá lập đỉnh mới nhưng dòng khối lượng không xác nhận', 'Volume divergence: price makes a new high but the volume line does not') }),
    single: lg => F.row(
      F.candles({ w: 250, h: 190, bars: [[80, 82, 70, 72], [72, 74, 62, 64], [64, 66, 54, 56], [56, 58, 46, 48], [45, 49, 22, 48]], labels: [[4, T(lg, 'Búa', 'Hammer'), 'b']], caption: T(lg, 'Búa — sau nhịp giảm', 'Hammer — after a decline') }),
      F.candles({ w: 250, h: 190, bars: [[20, 28, 18, 26], [26, 36, 24, 34], [34, 44, 32, 42], [42, 52, 40, 50], [54, 57, 30, 55]], labels: [[4, T(lg, 'Người treo cổ', 'Hanging man'), 't']], caption: T(lg, 'Người treo cổ — cùng hình dạng, sau nhịp tăng', 'Hanging man — same shape, after a rise') }),
      F.candles({ w: 250, h: 190, bars: [[20, 28, 18, 26], [26, 36, 24, 34], [34, 44, 32, 42], [42, 52, 40, 50], [52, 82, 50, 54]], labels: [[4, T(lg, 'Sao băng', 'Shooting star'), 'b']], caption: T(lg, 'Sao băng — bóng trên dài', 'Shooting star — long upper shadow') }),
      F.candles({ w: 250, h: 190, bars: [[40, 75, 25, 41], [50, 52, 18, 51], [50, 82, 48, 50], [30, 70, 28, 68]], labels: [[0, 'Doji', 'b'], [1, 'Dragonfly', 'b'], [2, 'Gravestone', 'b'], [3, 'Marubozu', 'b']], caption: T(lg, 'Họ doji và marubozu', 'Doji family and marubozu') })),
    multi: lg => F.row(
      F.candles({ w: 250, h: 190, bars: [[78, 80, 66, 68], [68, 70, 56, 58], [60, 62, 50, 52], [50, 66, 48, 64]], labels: [[3, T(lg, 'Nhấn chìm tăng', 'Bull engulfing'), 't']], caption: T(lg, 'Nhấn chìm tăng', 'Bullish engulfing') }),
      F.candles({ w: 250, h: 190, bars: [[80, 82, 66, 68], [70, 72, 52, 54], [50, 53, 45, 48], [52, 70, 50, 68]], labels: [[2, T(lg, 'Sao mai', 'Morning star'), 'b']], caption: T(lg, 'Sao mai (3 nến)', 'Morning star (3 bars)') }),
      F.candles({ w: 250, h: 190, bars: [[20, 34, 18, 32], [32, 50, 30, 48], [50, 74, 48, 72], [66, 68, 58, 60]], labels: [[3, 'Harami', 't']], caption: T(lg, 'Harami giảm: thân nhỏ nằm trong thân lớn', 'Bearish harami: small body within the large one') }),
      F.candles({ w: 250, h: 190, bars: [[20, 34, 18, 32], [32, 50, 30, 48], [48, 72, 46, 70], [76, 78, 54, 56]], labels: [[3, T(lg, 'Mây đen', 'Dark cloud'), 't']], caption: T(lg, 'Mây đen che phủ: mở trên đỉnh, đóng dưới giữa thân trước', 'Dark cloud cover: opens above, closes below mid-body') })),
    pnfBasic: lg => pnfFig([[1, 0, 5], [-1, 2, 4], [1, 3, 6], [-1, 3, 5], [1, 4, 8], [-1, 5, 7], [1, 6, 9]],
      T(lg, 'P&F đảo chiều 3 ô: mỗi cột X là nhịp tăng, cột O là nhịp giảm; đỉnh cột X vượt đỉnh cột X trước = phá vỡ đỉnh đôi', '3-box P&F: X columns rise, O columns fall; an X column exceeding the prior X top = double-top breakout'), [[2, 6, T(lg, 'mua', 'buy')], [4, 8, T(lg, 'mua', 'buy')]]),
    pnfTriple: lg => pnfFig([[-1, 0, 6], [1, 1, 5], [-1, 2, 4], [1, 3, 5], [-1, 2, 4], [1, 3, 7]],
      T(lg, 'Phá vỡ đỉnh ba: cột X thứ ba vượt hai đỉnh bằng nhau trước đó', 'Triple-top breakout: the third X column clears two equal tops'), [[5, 7, T(lg, 'mua', 'buy')]])
  };

  /* ================= LESSON 8 ================= */
  C.lessons['l1-08'] = {
    vi: {
      goals: ['Phân loại các khoảng trống giá và ý nghĩa của từng loại.', 'Nhận diện mẫu hình 1–2 nến: key reversal, inside/outside bar, two-bar reversal.', 'Hiểu ý nghĩa nến biên độ rộng và biên độ hẹp (NR4, NR7).', 'Biết đặt mẫu hình ngắn hạn trong bối cảnh xu hướng dài hơn.'],
      body: () => `
<h3>1. Vì sao cần mẫu hình ngắn hạn?</h3>
<p>Mẫu hình lớn (Bài 7) cần nhiều tuần, nhiều tháng để hình thành. Mẫu hình ngắn hạn chỉ gồm vài nến. Chúng cho tín hiệu sớm về sự thay đổi tâm lý, giúp tinh chỉnh <b>điểm vào/ra</b> và đặt <b>điểm dừng sát hơn</b>. Đổi lại, chúng nhiều nhiễu, nên phải luôn đặt trong <b>bối cảnh</b>: xu hướng lớn, vị trí so với hỗ trợ/kháng cự, khối lượng.</p>
<h3>2. Khoảng trống giá (gaps)</h3>
<p>Khoảng trống xuất hiện khi giá thấp nhất của phiên này cao hơn giá cao nhất của phiên trước (gap tăng), hoặc ngược lại (gap giảm). Không có giao dịch nào diễn ra trong vùng trống.</p>
<table class="tbl"><thead><tr><th>Loại</th><th>Vị trí</th><th>Ý nghĩa</th></tr></thead><tbody>
<tr><td><b>Common (thông thường)</b></td><td>Trong vùng đi ngang, thanh khoản thấp</td><td>Ít ý nghĩa, thường bị lấp nhanh</td></tr>
<tr><td><b>Breakaway (phá vỡ)</b></td><td>Khi giá thoát khỏi vùng tích lũy/mẫu hình, kèm khối lượng lớn</td><td>Khởi đầu xu hướng mới; thường không bị lấp sớm</td></tr>
<tr><td><b>Runaway / Measuring (tiếp diễn, đo lường)</b></td><td>Giữa một xu hướng mạnh</td><td>Xác nhận xu hướng; thường nằm khoảng giữa nước đi, nên dùng để ước lượng mục tiêu</td></tr>
<tr><td><b>Exhaustion (kiệt sức)</b></td><td>Cuối một xu hướng dài, thường khối lượng cực lớn</td><td>Nỗ lực cuối cùng; bị lấp nhanh là dấu hiệu đảo chiều</td></tr>
<tr><td><b>Island reversal (đảo)</b></td><td>Một gap kiệt sức theo sau bởi một gap ngược chiều</td><td>Một cụm giá bị "cô lập" như hòn đảo: tín hiệu đảo chiều mạnh</td></tr></tbody></table>
${fg.gaps('vi')}
<p>Câu "gap nào cũng bị lấp" là không chính xác: gap phá vỡ và gap tiếp diễn có thể không bị lấp trong rất lâu. Vùng gap thường đóng vai trò <b>hỗ trợ/kháng cự</b> về sau.</p>
<h3>3. Mẫu hình một và hai nến</h3>
<ul><li><b>Key reversal (đảo chiều chủ chốt)</b>: trong xu hướng tăng, giá tạo đỉnh mới nhưng đóng cửa <b>dưới</b> giá đóng cửa phiên trước (ngược lại ở đáy). Đáng tin hơn khi kèm khối lượng lớn và biên độ rộng.</li>
<li><b>Outside bar</b>: biên độ bao trùm hoàn toàn nến trước, cho thấy biến động mở rộng. Vị trí đóng cửa cho biết bên nào thắng.</li>
<li><b>Inside bar</b>: biên độ nằm trọn trong nến trước, thể hiện sự do dự và tích tụ năng lượng. Phá vỡ đỉnh/đáy của nến mẹ là tín hiệu theo hướng phá vỡ.</li>
<li><b>Two-bar reversal</b>: hai nến dài liên tiếp ngược chiều, đóng cửa gần nhau ở hai đầu, cho thấy sự đổi chiều nhanh của tâm lý.</li>
<li><b>Spike / pivot reversal</b>: một nến có râu rất dài vượt ra khỏi các nến xung quanh rồi bị đẩy ngược lại. Liên hệ Wyckoff: Spring / Upthrust.</li></ul>
${fg.bars2('vi')}
<h3>4. Nến biên độ rộng và biên độ hẹp</h3>
<p>Biến động có tính <b>chu kỳ</b>: giai đoạn biên độ hẹp thường đi trước giai đoạn biên độ rộng, và ngược lại.</p>
<ul><li><b>NR4 / NR7</b>: nến có biên độ hẹp nhất trong 4 (hoặc 7) nến gần nhất. Đây là dấu hiệu nén biến động; giao dịch theo hướng phá vỡ đỉnh/đáy của nến này.</li>
<li><b>Nến biên độ rộng (wide-range bar)</b>: thường xuất hiện khi phá vỡ, hoặc là cao trào kết thúc xu hướng. Vị trí đóng cửa và khối lượng quyết định cách đọc (hãy nối với VSA trong phần Wyckoff).</li></ul>
${C.demoHtml.shortPat()}
<div class="callout">Mẫu hình ngắn hạn có tỷ lệ thành công đơn lẻ không cao. Giá trị của chúng tăng mạnh khi xuất hiện <b>đúng chỗ</b> (tại hỗ trợ/kháng cự, sau nhịp thoái lui về vùng Fibonacci, thuận xu hướng lớn) và được <b>nến sau xác nhận</b>.</div>`,
      keys: ['Mẫu hình ngắn hạn giúp tinh chỉnh điểm vào/ra và điểm dừng, nhưng cần bối cảnh.', 'Gap: thông thường, phá vỡ, tiếp diễn (đo lường), kiệt sức, đảo; không phải gap nào cũng bị lấp.', 'Gap tiếp diễn thường nằm khoảng giữa nước đi → ước lượng mục tiêu.', 'Key reversal: đỉnh/đáy mới nhưng đóng cửa ngược chiều phiên trước.', 'Inside bar = nén, outside bar = mở rộng; NR4/NR7 báo hiệu biến động sắp tăng.', 'Biến động có tính chu kỳ: hẹp → rộng → hẹp.'],
      terms: [['Breakaway / Runaway / Exhaustion gap', 'Gap phá vỡ / tiếp diễn / kiệt sức'], ['Island reversal', 'Đảo chiều dạng đảo'], ['Key reversal', 'Đảo chiều chủ chốt'], ['Inside / Outside bar', 'Nến trong / nến bao'], ['NR7', 'Biên độ hẹp nhất 7 nến'], ['Wide-range bar', 'Nến biên độ rộng']],
      quiz: [
        Q('Gap xuất hiện khi giá thoát khỏi vùng tích lũy kèm khối lượng lớn là:', ['Common gap', 'Breakaway gap', 'Exhaustion gap', 'Island'], 1, 'Gap phá vỡ khởi đầu xu hướng mới.'),
        Q('Gap tiếp diễn (runaway) hữu ích để:', ['Dự báo đảo chiều', 'Ước lượng mục tiêu vì thường nằm khoảng giữa nước đi', 'Đặt lệnh bán khống', 'Không có tác dụng'], 1, 'Nó còn gọi là measuring gap.'),
        Q('Đảo chiều dạng đảo (island) được tạo bởi:', ['Hai gap cùng chiều', 'Một gap kiệt sức và một gap ngược chiều sau đó', 'Một inside bar', 'Một doji'], 1, 'Cụm giá ở giữa bị cô lập như hòn đảo.'),
        Q('Key reversal trong xu hướng tăng là nến:', ['Tạo đáy mới, đóng cửa cao', 'Tạo đỉnh mới nhưng đóng cửa dưới giá đóng cửa phiên trước', 'Có biên độ hẹp nhất', 'Không có râu'], 1, 'Người mua đẩy lên đỉnh mới nhưng bị áp đảo trước khi đóng cửa.'),
        Q('Inside bar thể hiện:', ['Biến động mở rộng', 'Sự do dự và tích tụ năng lượng', 'Đảo chiều chắc chắn', 'Khối lượng cao'], 1, 'Giao dịch theo hướng phá vỡ nến mẹ.'),
        Q('NR7 là:', ['Nến có biên độ rộng nhất 7 nến', 'Nến có biên độ hẹp nhất trong 7 nến gần nhất', 'Nến thứ 7 của tuần', 'Mẫu hình 7 nến'], 1, 'Nén biến động thường đi trước bùng nổ.'),
        Q('Nhận định nào ĐÚNG về gap?', ['Gap nào cũng bị lấp ngay', 'Gap phá vỡ có thể không bị lấp trong thời gian dài', 'Gap chỉ có ở crypto', 'Gap không bao giờ là hỗ trợ/kháng cự'], 1, 'Vùng gap thường trở thành hỗ trợ/kháng cự.'),
        Q('Giá trị của mẫu hình ngắn hạn tăng mạnh nhất khi:', ['Xuất hiện ở bất kỳ đâu', 'Xuất hiện tại hỗ trợ/kháng cự, thuận xu hướng lớn và được nến sau xác nhận', 'Khối lượng bằng 0', 'Xuất hiện liên tiếp nhiều lần trong ngày'], 1, 'Bối cảnh và xác nhận là then chốt.')
      ]
    },
    en: {
      goals: ['Classify gaps.', 'Recognise one- and two-bar patterns.', 'Interpret wide- and narrow-range bars.', 'Place short-term patterns in context.'],
      body: () => `
<h3>1. Why short-term patterns</h3><p>They refine entries, exits and stops, but are noisy — always read them in context.</p>
<h3>2. Gaps</h3><table class="tbl"><tbody><tr><td><b>Common</b></td><td>Inside ranges; usually filled</td></tr><tr><td><b>Breakaway</b></td><td>Leaving a base on volume; starts a trend</td></tr><tr><td><b>Runaway / measuring</b></td><td>Mid-trend; often near the move’s midpoint</td></tr><tr><td><b>Exhaustion</b></td><td>End of a long move; quickly filled</td></tr><tr><td><b>Island reversal</b></td><td>Exhaustion gap then opposite gap</td></tr></tbody></table>${fg.gaps('en')}<p>Not all gaps fill; gap zones often act as support/resistance.</p>
<h3>3. One- and two-bar patterns</h3><ul><li><b>Key reversal</b>: new high, close below prior close (or the reverse).</li><li><b>Outside bar</b>: range expansion.</li><li><b>Inside bar</b>: compression; trade the break of the mother bar.</li><li><b>Two-bar reversal</b>, <b>spikes</b> (compare Wyckoff springs/upthrusts).</li></ul>${fg.bars2('en')}
<h3>4. Range</h3><p>Volatility cycles: <b>NR4/NR7</b> bars signal compression; <b>wide-range bars</b> mark breakouts or climaxes.</p>${C.demoHtml.shortPat()}<div class="callout">Short-term patterns gain value at the right place and with next-bar confirmation.</div>`,
      keys: ['Short-term patterns refine timing but need context.', 'Gaps: common, breakaway, runaway, exhaustion, island.', 'Runaway gaps help estimate targets.', 'Key reversal: new extreme, opposite close.', 'Inside = compression; outside = expansion; NR7 precedes expansion.', 'Volatility is cyclical.'],
      terms: [['Measuring gap', 'Runaway gap'], ['Island reversal', 'Isolated price cluster'], ['NR7', 'Narrowest range of 7 bars']],
      quiz: [
        Q('A gap leaving a base on heavy volume is:', ['Common', 'Breakaway', 'Exhaustion', 'Island'], 1, 'It starts a trend.'),
        Q('Runaway gaps help:', ['Predict reversals', 'Estimate targets', 'Short', 'Nothing'], 1, 'They often sit mid-move.'),
        Q('An island reversal is formed by:', ['Two same-direction gaps', 'An exhaustion gap then an opposite gap', 'An inside bar', 'A doji'], 1, 'The cluster is isolated.'),
        Q('A key reversal in an uptrend:', ['New low, high close', 'New high, close below the prior close', 'Narrowest range', 'No shadows'], 1, 'Buyers are overwhelmed.'),
        Q('An inside bar shows:', ['Expansion', 'Indecision/compression', 'Certain reversal', 'High volume'], 1, 'Trade the mother-bar break.'),
        Q('NR7 is:', ['Widest of 7', 'Narrowest of the last 7', 'The 7th bar of the week', 'A 7-bar pattern'], 1, 'Compression.'),
        Q('Which is TRUE about gaps?', ['All fill at once', 'Breakaway gaps may stay unfilled for long', 'Crypto only', 'Never S/R'], 1, 'Gap zones become S/R.'),
        Q('Short-term patterns work best:', ['Anywhere', 'At S/R, with the larger trend, confirmed by the next bar', 'With zero volume', 'Many times a day'], 1, 'Context and confirmation.')
      ]
    }
  };

  /* ================= LESSON 9 ================= */
  C.lessons['l1-09'] = {
    vi: {
      goals: ['Hiểu nguyên tắc dùng khối lượng và hợp đồng mở để xác nhận xu hướng.', 'Tính và diễn giải OBV, Accumulation/Distribution, Money Flow.', 'Nắm quy tắc kết hợp giá – khối lượng – OI trong phái sinh.', 'Hiểu khái niệm phân kỳ và vai trò của chỉ báo động lượng trong xác nhận.'],
      body: () => `
<h3>1. Nguyên tắc xác nhận</h3>
<p>Giá cho biết <b>điều gì</b> đang xảy ra. Khối lượng, hợp đồng mở (OI) và động lượng cho biết điều đó <b>mạnh hay yếu</b>. Một tín hiệu giá được nhiều yếu tố độc lập cùng ủng hộ sẽ đáng tin hơn. Khi các yếu tố này đi ngược nhau, ta có <b>phân kỳ (divergence)</b>, một lời cảnh báo sớm.</p>
<h3>2. Khối lượng</h3>
<ul><li><b>Khối lượng xác nhận xu hướng</b>: trong xu hướng tăng lành mạnh, khối lượng tăng khi giá tăng và giảm khi giá điều chỉnh.</li>
<li><b>Khối lượng xác nhận phá vỡ</b>: phá vỡ kèm khối lượng tăng mạnh đáng tin hơn hẳn phá vỡ khối lượng thấp.</li>
<li><b>Cao trào</b>: khối lượng cực lớn sau một xu hướng dài thường đánh dấu sự kiệt sức, gồm cao trào mua ở đỉnh và cao trào bán ở đáy (xem Wyckoff/VSA).</li>
<li><b>"Khối lượng đi trước giá"</b>: sự thay đổi trong khối lượng (tăng dần ở vùng đáy, cạn dần ở vùng đỉnh) thường xuất hiện trước khi giá đổi hướng.</li></ul>
<h3>3. Các chỉ báo khối lượng</h3>
<table class="tbl"><thead><tr><th>Chỉ báo</th><th>Cách tính</th><th>Diễn giải</th></tr></thead><tbody>
<tr><td><b>OBV</b> (On-Balance Volume)</td><td>Cộng toàn bộ khối lượng nếu giá đóng cửa tăng, trừ nếu giảm, giữ nguyên nếu không đổi</td><td>Quan trọng là <b>hướng</b> và phân kỳ với giá, không phải giá trị tuyệt đối</td></tr>
<tr><td><b>Accumulation/Distribution</b></td><td>Cộng khối lượng × hệ số vị trí đóng cửa: [(C − L) − (H − C)] / (H − L)</td><td>Tinh tế hơn OBV vì tính tới vị trí đóng cửa trong biên độ</td></tr>
<tr><td><b>Money Flow Index (MFI)</b></td><td>Giống RSI nhưng dùng giá điển hình × khối lượng; dao động 0–100</td><td>Trên 80 là quá mua, dưới 20 là quá bán; có phân kỳ</td></tr>
<tr><td><b>Volume oscillator</b></td><td>MA ngắn của khối lượng trừ MA dài</td><td>Khối lượng đang tăng hay giảm so với nền</td></tr>
<tr><td><b>VWAP</b></td><td>Giá trung bình có trọng số khối lượng</td><td>Mốc "giá hợp lý" trong phiên mà tổ chức hay dùng để đánh giá chất lượng khớp lệnh</td></tr></tbody></table>
${fg.vol('vi')}
${C.demoHtml.volConfirm()}
<h3>4. Hợp đồng mở (Open Interest) trong phái sinh</h3>
<p>OI là số hợp đồng chưa tất toán. OI tăng nghĩa là <b>tiền mới</b> đang vào thị trường; OI giảm nghĩa là các vị thế đang được đóng lại.</p>
<table class="tbl"><thead><tr><th>Giá</th><th>Khối lượng</th><th>OI</th><th>Diễn giải</th></tr></thead><tbody>
<tr><td>Tăng</td><td>Tăng</td><td>Tăng</td><td class="up">Xu hướng tăng mạnh: tiền mới mua vào</td></tr>
<tr><td>Tăng</td><td>Giảm</td><td>Giảm</td><td class="down">Tăng yếu: chủ yếu do người bán khống đóng vị thế</td></tr>
<tr><td>Giảm</td><td>Tăng</td><td>Tăng</td><td class="down">Xu hướng giảm mạnh: tiền mới bán khống</td></tr>
<tr><td>Giảm</td><td>Giảm</td><td>Giảm</td><td class="up">Giảm yếu: người mua cũ thoát hàng, có thể sắp hết lực giảm</td></tr></tbody></table>
<h3>5. Động lượng và phân kỳ</h3>
<p>Chỉ báo động lượng (ROC, RSI, MACD, Stochastic, học kỹ ở Level 2) đo <b>tốc độ</b> thay đổi giá. Trong xu hướng tăng khoẻ, động lượng lập đỉnh mới cùng giá. Khi giá lập đỉnh mới mà động lượng thì không (<b>phân kỳ âm</b>), lực đẩy đang yếu đi. Phân kỳ dương ở đáy thì ngược lại.</p>
<div class="callout">Phân kỳ là <b>cảnh báo</b>, không phải tín hiệu bán/mua độc lập. Phân kỳ có thể kéo dài nhiều nhịp trước khi giá thực sự đảo chiều. Hãy chờ xác nhận từ chính giá: phá đường xu hướng, thủng đáy gần nhất…</div>`,
      keys: ['Giá cho biết điều gì xảy ra; khối lượng, OI, động lượng cho biết mạnh hay yếu.', 'Khối lượng tăng theo chiều xu hướng, giảm khi điều chỉnh; phá vỡ cần khối lượng.', 'OBV cộng/trừ khối lượng theo hướng đóng cửa; A/D tính thêm vị trí đóng cửa; MFI là "RSI có khối lượng".', 'OI tăng = tiền mới vào; giá tăng + OI tăng = xu hướng mạnh; giá tăng + OI giảm = short covering, tăng yếu.', 'Phân kỳ giữa giá và chỉ báo là cảnh báo sớm, cần giá xác nhận.'],
      terms: [['Confirmation', 'Xác nhận'], ['Divergence', 'Phân kỳ'], ['OBV', 'On-Balance Volume'], ['A/D line', 'Đường tích lũy/phân phối'], ['MFI', 'Money Flow Index'], ['Open interest', 'Hợp đồng mở'], ['Short covering', 'Mua lại để đóng vị thế bán khống'], ['VWAP', 'Giá bình quân theo khối lượng']],
      quiz: [
        Q('Trong xu hướng tăng lành mạnh, khối lượng thường:', ['Tăng khi giá giảm', 'Tăng khi giá tăng, giảm khi điều chỉnh', 'Không đổi', 'Luôn giảm'], 1, 'Nỗ lực đi cùng hướng xu hướng.'),
        Q('Hôm qua OBV = 1.000.000. Hôm nay giá đóng cửa tăng, khối lượng 200.000. OBV hôm nay:', ['800.000', '1.000.000', '1.200.000', '200.000'], 2, 'Đóng cửa tăng nên cộng toàn bộ khối lượng.'),
        Q('Ưu điểm của A/D so với OBV là:', ['Không dùng khối lượng', 'Tính tới vị trí đóng cửa trong biên độ nến', 'Chỉ dùng giá mở cửa', 'Luôn tăng'], 1, 'OBV cộng/trừ toàn bộ khối lượng; A/D phân bổ theo vị trí đóng cửa.'),
        Q('Giá tăng, khối lượng giảm, OI giảm cho thấy:', ['Xu hướng tăng mạnh với tiền mới', 'Tăng chủ yếu do short covering — tăng yếu', 'Xu hướng giảm mạnh', 'Không có ý nghĩa'], 1, 'Không có tiền mới; vị thế đang đóng.'),
        Q('Giá giảm, khối lượng tăng, OI tăng cho thấy:', ['Xu hướng giảm mạnh với vị thế bán mới', 'Đáy đã hình thành', 'Short covering', 'Tăng yếu'], 0, 'Tiền mới vào phía bán.'),
        Q('Phân kỳ âm (bearish divergence) là khi:', ['Giá và chỉ báo cùng lập đỉnh mới', 'Giá lập đỉnh mới nhưng chỉ báo thì không', 'Giá lập đáy mới, chỉ báo lập đáy cao hơn', 'Khối lượng bằng 0'], 1, 'Lực đẩy yếu dần dù giá còn tăng.'),
        Q('Cách dùng phân kỳ hợp lý nhất là:', ['Bán ngay khi thấy phân kỳ', 'Xem là cảnh báo, chờ giá xác nhận', 'Bỏ qua', 'Mua thêm'], 1, 'Phân kỳ có thể kéo dài nhiều nhịp.'),
        Q('MFI trên 80 thường được xem là:', ['Quá bán', 'Quá mua', 'Trung tính', 'Lỗi dữ liệu'], 1, 'Tương tự RSI, có tính khối lượng.')
      ]
    },
    en: {
      goals: ['Use volume and open interest to confirm trends.', 'Compute and read OBV, A/D, MFI.', 'Combine price, volume and OI.', 'Understand divergence and momentum confirmation.'],
      body: () => `
<h3>1. Principle</h3><p>Price shows <b>what</b>; volume, OI and momentum show <b>how strongly</b>. Disagreement is <b>divergence</b> — an early warning.</p>
<h3>2. Volume</h3><ul><li>Expands with the trend, contracts on corrections.</li><li>Confirms breakouts.</li><li>Climaxes mark exhaustion.</li><li>Volume often leads price.</li></ul>
<h3>3. Volume indicators</h3><table class="tbl"><tbody><tr><td><b>OBV</b></td><td>Add volume on up closes, subtract on down closes; read direction and divergence</td></tr><tr><td><b>A/D</b></td><td>Volume × close-location value [(C−L)−(H−C)]/(H−L)</td></tr><tr><td><b>MFI</b></td><td>Volume-weighted RSI, 0–100</td></tr><tr><td><b>Volume oscillator</b></td><td>Short MA − long MA of volume</td></tr><tr><td><b>VWAP</b></td><td>Volume-weighted average price</td></tr></tbody></table>${fg.vol('en')}${C.demoHtml.volConfirm()}
<h3>4. Open interest</h3><table class="tbl"><thead><tr><th>Price</th><th>Volume</th><th>OI</th><th>Reading</th></tr></thead><tbody><tr><td>Up</td><td>Up</td><td>Up</td><td class="up">Strong — new buying</td></tr><tr><td>Up</td><td>Down</td><td>Down</td><td class="down">Weak — short covering</td></tr><tr><td>Down</td><td>Up</td><td>Up</td><td class="down">Strong — new selling</td></tr><tr><td>Down</td><td>Down</td><td>Down</td><td class="up">Weak — longs liquidating</td></tr></tbody></table>
<h3>5. Momentum and divergence</h3><p>Momentum measures speed. A new price high without a new momentum high is a bearish divergence; the reverse at lows is bullish.</p><div class="callout">Divergence is a warning, not a standalone signal — wait for price confirmation.</div>`,
      keys: ['Price = what; volume/OI/momentum = strength.', 'Volume expands with the trend; breakouts need volume.', 'OBV, A/D, MFI.', 'Rising price + rising OI = strong; rising price + falling OI = short covering.', 'Divergence warns; price confirms.'],
      terms: [['Divergence', 'Price vs indicator disagreement'], ['Open interest', 'Outstanding contracts'], ['Short covering', 'Buying back shorts']],
      quiz: [
        Q('In a healthy uptrend volume:', ['Rises on declines', 'Rises on rallies, falls on corrections', 'Is flat', 'Always falls'], 1, 'Effort follows the trend.'),
        Q('OBV 1,000,000; up close on 200,000 volume. New OBV:', ['800,000', '1,000,000', '1,200,000', '200,000'], 2, 'Add the full volume.'),
        Q('A/D improves on OBV by:', ['Ignoring volume', 'Using close location', 'Using opens only', 'Always rising'], 1, 'It allocates volume by close location.'),
        Q('Price up, volume down, OI down:', ['Strong new buying', 'Short covering — weak rally', 'Strong downtrend', 'Meaningless'], 1, 'No new money.'),
        Q('Price down, volume up, OI up:', ['Strong downtrend with new shorts', 'A bottom', 'Short covering', 'Weak rally'], 0, 'New money on the sell side.'),
        Q('A bearish divergence is:', ['Price and indicator both make new highs', 'Price makes a new high, the indicator does not', 'Price new low, indicator higher low', 'Zero volume'], 1, 'Weakening thrust.'),
        Q('Best use of divergence:', ['Sell immediately', 'A warning awaiting price confirmation', 'Ignore', 'Buy more'], 1, 'Divergences can persist.'),
        Q('MFI above 80 is:', ['Oversold', 'Overbought', 'Neutral', 'A data error'], 1, 'Like RSI with volume.')
      ]
    }
  };

  /* ================= LESSON 10 ================= */
  C.lessons['l1-10'] = {
    vi: {
      goals: ['Hiểu nguồn gốc và cấu tạo của nến Nhật.', 'Đọc tâm lý thị trường qua thân và bóng nến.', 'Nhận diện các nến đơn quan trọng: doji, búa, người treo cổ, sao băng, marubozu.', 'Nhận diện mẫu hình nhiều nến: nhấn chìm, harami, sao mai/sao hôm, đường xuyên/mây đen, ba chàng lính…', 'Kết hợp nến với bối cảnh xu hướng, hỗ trợ/kháng cự và nhiều khung thời gian.'],
      body: () => `
<h3>1. Nguồn gốc và tinh thần</h3>
<p>Nến Nhật bắt nguồn từ giới buôn gạo Nhật Bản thế kỷ 18. Phương Tây chỉ biết tới rộng rãi từ cuối thế kỷ 20. Nến dùng cùng bốn mức giá với biểu đồ thanh (Bài 3), nhưng làm nổi bật <b>quan hệ giữa giá mở và giá đóng cửa</b>: ai thắng trong phiên, thắng áp đảo hay suýt soát.</p>
<ul><li><b>Thân dài</b>: một bên áp đảo. <b>Thân ngắn</b>: giằng co.</li>
<li><b>Bóng trên dài</b>: giá bị từ chối ở vùng cao, người bán xuất hiện. <b>Bóng dưới dài</b>: giá bị từ chối ở vùng thấp, người mua xuất hiện.</li></ul>
<h3>2. Nến đơn</h3>
${fg.single('vi')}
<table class="tbl"><thead><tr><th>Nến</th><th>Hình dạng</th><th>Bối cảnh cần có</th><th>Ý nghĩa</th></tr></thead><tbody>
<tr><td><b>Doji</b></td><td>Mở ≈ đóng cửa</td><td>Đặc biệt sau xu hướng dài</td><td>Do dự; cảnh báo xu hướng chững lại. Biến thể: chân dài, chuồn chuồn (dragonfly), bia mộ (gravestone)</td></tr>
<tr><td><b>Spinning top</b></td><td>Thân nhỏ, hai bóng</td><td>—</td><td>Cân bằng cung cầu</td></tr>
<tr><td><b>Marubozu</b></td><td>Thân dài, gần như không bóng</td><td>—</td><td>Một bên kiểm soát hoàn toàn phiên</td></tr>
<tr><td><b>Búa (hammer)</b></td><td>Thân nhỏ ở trên, bóng dưới ≥ 2 lần thân</td><td>Sau nhịp giảm</td><td>Bên bán đạp xuống nhưng bên mua đẩy lại: đảo chiều tăng tiềm năng</td></tr>
<tr><td><b>Người treo cổ (hanging man)</b></td><td>Giống hệt búa</td><td>Sau nhịp tăng</td><td>Cảnh báo: áp lực bán đã xuất hiện trong phiên</td></tr>
<tr><td><b>Sao băng (shooting star)</b></td><td>Thân nhỏ ở dưới, bóng trên dài</td><td>Sau nhịp tăng</td><td>Giá cao bị từ chối: đảo chiều giảm tiềm năng</td></tr>
<tr><td><b>Búa ngược (inverted hammer)</b></td><td>Giống sao băng</td><td>Sau nhịp giảm</td><td>Đảo chiều tăng tiềm năng, cần xác nhận mạnh</td></tr></tbody></table>
<div class="callout">Cùng một hình dạng (búa và người treo cổ) có ý nghĩa ngược nhau tuỳ <b>bối cảnh xu hướng</b>. Nến không có xu hướng trước đó thì không có gì để "đảo chiều".</div>
<h3>3. Mẫu hình nhiều nến</h3>
${fg.multi('vi')}
<ul><li><b>Nhấn chìm (engulfing)</b>: thân nến thứ hai bao trùm thân nến thứ nhất, ngược màu. Nhấn chìm tăng ở đáy, nhấn chìm giảm ở đỉnh.</li>
<li><b>Harami</b>: thân nhỏ nằm trong thân lớn trước đó ("người mẹ mang thai"), báo hiệu xu hướng mất đà. Harami cross là harami với nến thứ hai là doji.</li>
<li><b>Đường xuyên (piercing line)</b> / <b>Mây đen che phủ (dark cloud cover)</b>: nến thứ hai mở vượt ra ngoài nến trước nhưng đóng cửa lấn quá <b>nửa thân</b> nến trước, ngược chiều xu hướng.</li>
<li><b>Sao mai (morning star)</b> / <b>Sao hôm (evening star)</b>: nến dài → nến thân nhỏ (ngôi sao, thường có khoảng trống) → nến dài ngược chiều đóng sâu vào thân nến đầu. Mẫu hình ba nến đảo chiều kinh điển.</li>
<li><b>Ba chàng lính trắng / Ba con quạ đen</b>: ba nến dài liên tiếp cùng chiều, đóng cửa gần đỉnh/đáy, cho thấy đà mạnh.</li>
<li><b>Đỉnh/đáy nhíp (tweezers)</b>: hai nến có đỉnh (hoặc đáy) bằng nhau tại vùng kháng cự/hỗ trợ.</li>
<li><b>"Cửa sổ" (window)</b>: tên gọi của gap trong thuật ngữ nến. Cửa sổ thường đóng vai trò hỗ trợ/kháng cự.</li></ul>
${C.demoHtml.candles()}
<h3>4. Dùng nến như một chuyên gia</h3>
<ol><li><b>Bối cảnh trước tiên</b>: xu hướng trước đó, vị trí tại hỗ trợ/kháng cự, vùng Fibonacci, mức MA quan trọng.</li>
<li><b>Xác nhận</b>: chờ nến kế tiếp đi theo hướng tín hiệu (ví dụ sau búa là một nến tăng đóng cửa trên thân búa).</li>
<li><b>Kết hợp kỹ thuật phương Tây</b>: nến đảo chiều tại đường viền cổ, tại đường xu hướng, kèm phân kỳ động lượng… sẽ mạnh hơn nhiều.</li>
<li><b>Quản trị rủi ro</b>: nến cho điểm dừng tự nhiên. Ví dụ dưới đáy bóng nến búa, trên đỉnh bóng nến sao băng.</li>
<li><b>Nhiều khung thời gian</b>: một nến búa ở khung tuần chứa nhiều nến ngày bên trong. Hãy kiểm tra khung nhỏ để thấy chi tiết.</li></ol>`,
      keys: ['Nến nhấn mạnh quan hệ mở–đóng cửa: thân thể hiện bên thắng, bóng thể hiện mức giá bị từ chối.', 'Búa và người treo cổ cùng hình dạng nhưng ngược nghĩa tuỳ bối cảnh.', 'Doji = do dự; marubozu = một bên áp đảo.', 'Mẫu hình nhiều nến: nhấn chìm, harami, đường xuyên/mây đen, sao mai/sao hôm, ba chàng lính/ba con quạ.', 'Luôn cần bối cảnh và xác nhận; kết hợp với kỹ thuật phương Tây và đặt điểm dừng ngoài bóng nến.'],
      terms: [['Real body / Shadow', 'Thân / bóng nến'], ['Doji', 'Nến do dự'], ['Hammer / Hanging man', 'Búa / Người treo cổ'], ['Shooting star', 'Sao băng'], ['Engulfing', 'Nhấn chìm'], ['Harami', 'Mẫu hình "mang thai"'], ['Morning / Evening star', 'Sao mai / Sao hôm'], ['Window', 'Cửa sổ (gap)']],
      quiz: [
        Q('Nến búa có ý nghĩa đảo chiều tăng khi xuất hiện:', ['Sau một nhịp tăng', 'Sau một nhịp giảm', 'Ở giữa vùng đi ngang', 'Bất kỳ đâu'], 1, 'Búa cần xu hướng giảm trước đó để có gì đó mà đảo chiều.'),
        Q('Người treo cổ và búa:', ['Khác hình dạng', 'Cùng hình dạng, khác bối cảnh', 'Đều là nến tăng', 'Đều cần gap'], 1, 'Người treo cổ xuất hiện sau nhịp tăng.'),
        Q('Bóng trên dài cho thấy:', ['Giá thấp bị từ chối', 'Giá cao bị từ chối, người bán xuất hiện', 'Khối lượng thấp', 'Không có ý nghĩa'], 1, 'Người mua đẩy lên nhưng không giữ được.'),
        Q('Mây đen che phủ (dark cloud cover) yêu cầu nến thứ hai:', ['Đóng cửa trên đỉnh nến trước', 'Mở trên nến trước và đóng cửa dưới điểm giữa thân nến trước', 'Là doji', 'Có thân nhỏ hơn'], 1, 'Lấn quá nửa thân thể hiện sức bán đáng kể.'),
        Q('Mẫu hình sao mai gồm:', ['1 nến', '2 nến', '3 nến: nến giảm dài, ngôi sao thân nhỏ, nến tăng dài', '5 nến'], 2, 'Mẫu hình đảo chiều tăng ba nến kinh điển.'),
        Q('Doji thể hiện:', ['Bên mua áp đảo', 'Sự do dự, cân bằng giữa hai bên', 'Bên bán áp đảo', 'Khoảng trống giá'], 1, 'Mở cửa ≈ đóng cửa.'),
        Q('Harami là mẫu hình mà:', ['Thân sau bao trùm thân trước', 'Thân nhỏ nằm trong thân lớn trước đó', 'Có ba nến cùng màu', 'Có gap lớn'], 1, 'Báo hiệu xu hướng mất đà.'),
        Q('Điểm dừng tự nhiên cho lệnh mua theo nến búa là:', ['Trên đỉnh búa', 'Dưới đáy bóng dưới của búa', 'Tại giá mở cửa', 'Không cần'], 1, 'Nếu thủng đáy bóng nến thì luận điểm sai.')
      ]
    },
    en: {
      goals: ['Understand candlestick origins and anatomy.', 'Read psychology from bodies and shadows.', 'Identify key single candles.', 'Identify multi-candle patterns.', 'Use context, confirmation and multiple timeframes.'],
      body: () => `
<h3>1. Spirit</h3><p>Candles, from 18th-century Japanese rice trading, highlight the <b>open–close relationship</b>. Long bodies = dominance; short bodies = balance; long upper shadows = rejection of highs; long lower shadows = rejection of lows.</p>
<h3>2. Single candles</h3>${fg.single('en')}<table class="tbl"><tbody><tr><td><b>Doji</b></td><td>Open ≈ close — indecision (long-legged, dragonfly, gravestone)</td></tr><tr><td><b>Spinning top</b></td><td>Small body — balance</td></tr><tr><td><b>Marubozu</b></td><td>No shadows — full control</td></tr><tr><td><b>Hammer</b></td><td>Small top body, long lower shadow, after a decline</td></tr><tr><td><b>Hanging man</b></td><td>Same shape after a rise — warning</td></tr><tr><td><b>Shooting star</b></td><td>Long upper shadow after a rise</td></tr><tr><td><b>Inverted hammer</b></td><td>Same shape after a decline</td></tr></tbody></table><div class="callout">The same shape can mean opposite things depending on the trend.</div>
<h3>3. Multi-candle patterns</h3>${fg.multi('en')}<ul><li><b>Engulfing</b>, <b>harami</b> (and harami cross)</li><li><b>Piercing line / dark cloud cover</b> — beyond the midpoint of the prior body</li><li><b>Morning / evening star</b></li><li><b>Three white soldiers / three black crows</b></li><li><b>Tweezers</b>, <b>windows</b> (gaps) as S/R</li></ul>${C.demoHtml.candles()}
<h3>4. Using candles well</h3><ol><li>Context first.</li><li>Confirmation by the next bar.</li><li>Combine with Western tools.</li><li>Stops beyond the shadow.</li><li>Multiple timeframes.</li></ol>`,
      keys: ['Bodies show who won; shadows show rejected prices.', 'Hammer vs hanging man: same shape, different context.', 'Doji = indecision; marubozu = control.', 'Engulfing, harami, piercing/dark cloud, stars, soldiers/crows.', 'Context, confirmation, Western tools, stops beyond shadows.'],
      terms: [['Window', 'Candlestick term for a gap'], ['Harami', 'Small body within a large one'], ['Marubozu', 'Candle without shadows']],
      quiz: [
        Q('A hammer is bullish when it appears:', ['After a rise', 'After a decline', 'Mid-range', 'Anywhere'], 1, 'It needs something to reverse.'),
        Q('Hanging man and hammer:', ['Differ in shape', 'Same shape, different context', 'Both bullish', 'Both need gaps'], 1, 'Context decides.'),
        Q('A long upper shadow shows:', ['Rejected lows', 'Rejected highs — sellers appeared', 'Low volume', 'Nothing'], 1, 'Buyers could not hold.'),
        Q('Dark cloud cover requires the second candle to:', ['Close above the prior high', 'Open above and close below the prior body’s midpoint', 'Be a doji', 'Be smaller'], 1, 'Deep penetration.'),
        Q('A morning star has:', ['1 candle', '2 candles', '3 candles: long down, small star, long up', '5 candles'], 2, 'Classic three-candle reversal.'),
        Q('A doji shows:', ['Buyer dominance', 'Indecision', 'Seller dominance', 'A gap'], 1, 'Open ≈ close.'),
        Q('Harami means:', ['The second body engulfs the first', 'A small body inside the prior large one', 'Three same-colour candles', 'A big gap'], 1, 'Loss of momentum.'),
        Q('Natural stop for a hammer long:', ['Above the hammer', 'Below the lower shadow', 'At the open', 'None'], 1, 'A break invalidates it.')
      ]
    }
  };

  /* ================= LESSON 11 ================= */
  C.lessons['l1-11'] = {
    vi: {
      goals: ['Hiểu nguyên lý của biểu đồ Point & Figure: loại bỏ thời gian, chỉ ghi biến động đáng kể.', 'Dựng biểu đồ P&F với kích thước ô và số ô đảo chiều.', 'Nhận diện tín hiệu: phá vỡ đỉnh/đáy đôi, ba, tam giác, catapult.', 'Vẽ đường xu hướng 45°.', 'Tính mục tiêu giá bằng đếm ngang và đếm dọc.'],
      body: () => `
<h3>1. Tinh thần của P&F</h3>
<p>Point & Figure là một trong những kỹ thuật vẽ biểu đồ lâu đời nhất ở phương Tây. Điểm đặc biệt: <b>không có trục thời gian</b>. Biểu đồ chỉ ghi lại khi giá di chuyển đủ một ngưỡng nhất định. Những dao động nhỏ bị lọc bỏ, chỉ còn lại "khung xương" cung–cầu: các mức hỗ trợ, kháng cự và phá vỡ hiện ra rất rõ ràng.</p>
<ul><li><b>X</b>: một ô giá tăng. Một cột X là một nhịp tăng.</li>
<li><b>O</b>: một ô giá giảm. Một cột O là một nhịp giảm.</li>
<li><b>Kích thước ô (box size)</b>: mức giá mỗi ô đại diện. Có thể cố định (ví dụ 1 điểm), theo % giá (thang log), hoặc theo ATR.</li>
<li><b>Số ô đảo chiều (reversal)</b>: số ô giá phải đi ngược lại để mở cột mới. Phổ biến nhất là <b>3 ô</b>; loại 1 ô chi tiết hơn và được Wyckoff dùng nhiều cho đếm ngang.</li></ul>
<h3>2. Cách dựng (đảo chiều 3 ô, dùng giá đóng cửa)</h3>
<ol><li>Đang ở cột X: nếu giá tăng thêm ≥ 1 ô thì vẽ thêm X lên trên.</li>
<li>Nếu giá không tăng thêm mà giảm ≥ 3 ô tính từ X cao nhất thì chuyển sang cột mới bên phải, vẽ O bắt đầu từ ô ngay dưới X cao nhất.</li>
<li>Đang ở cột O: làm tương tự theo chiều ngược lại.</li>
<li>Mỗi cột ít nhất 3 ô (với đảo chiều 3 ô). Cột X và O luôn xen kẽ.</li></ol>
${fg.pnfBasic('vi')}
<h3>3. Tín hiệu cơ bản</h3>
<table class="tbl"><thead><tr><th>Tín hiệu</th><th>Mô tả</th></tr></thead><tbody>
<tr><td><b>Phá vỡ đỉnh đôi</b> (mua)</td><td>Cột X vượt đỉnh cột X liền trước</td></tr>
<tr><td><b>Phá vỡ đáy đôi</b> (bán)</td><td>Cột O thủng đáy cột O liền trước</td></tr>
<tr><td><b>Phá vỡ đỉnh/đáy ba</b></td><td>Vượt hai đỉnh (hoặc thủng hai đáy) bằng nhau: tín hiệu mạnh hơn vì kháng cự/hỗ trợ đã được kiểm tra nhiều lần</td></tr>
<tr><td><b>Phá vỡ tam giác</b></td><td>Các đỉnh thấp dần, đáy cao dần rồi phá vỡ</td></tr>
<tr><td><b>Catapult</b></td><td>Phá vỡ đỉnh ba, điều chỉnh nhẹ, rồi tiếp tục phá lên: tín hiệu tiếp diễn</td></tr></tbody></table>
${fg.pnfTriple('vi')}
<h3>4. Đường xu hướng 45°</h3>
<p>Trên P&F, đường xu hướng thường vẽ theo góc 45° (mỗi cột đi một ô) chứ không nối đỉnh/đáy như biểu đồ thanh. <b>Đường hỗ trợ tăng</b> vẽ từ dưới đáy cột O thấp nhất đi lên phải; khi giá còn trên đường thì xu hướng chính là tăng. <b>Đường kháng cự giảm</b> vẽ từ trên đỉnh cột X cao nhất đi xuống phải.</p>
<h3>5. Mục tiêu giá</h3>
<ul><li><b>Đếm ngang (horizontal count)</b>: đếm số cột trong vùng tích lũy/phân phối, nhân với kích thước ô và số ô đảo chiều, rồi cộng (hoặc trừ) từ mức đếm. Đây chính là công cụ đo <b>Luật Nhân – Quả</b> của Wyckoff (xem tab Wyckoff).</li>
<li><b>Đếm dọc (vertical count)</b>: lấy chiều dài cột phá vỡ đầu tiên (số ô) nhân với số ô đảo chiều, rồi cộng vào đáy của cột đó (với xu hướng tăng).</li></ul>
<div class="callout"><b>Ví dụ</b>: ô = 1 điểm, đảo chiều 3 ô. Vùng tích lũy có 8 cột, mức đếm tại 50. Mục tiêu ≈ 50 + 8 × 1 × 3 = <b>74</b>.</div>
${C.demoHtml.pnf()}
<h3>6. Ưu nhược điểm</h3>
<ul><li><b>Ưu</b>: lọc nhiễu, tín hiệu khách quan và rõ ràng, hỗ trợ/kháng cự nổi bật, có phương pháp đo mục tiêu.</li>
<li><b>Nhược</b>: mất thông tin thời gian và khối lượng; kết quả phụ thuộc mạnh vào lựa chọn kích thước ô và số ô đảo chiều; ô quá nhỏ thì nhiễu, ô quá lớn thì trễ.</li></ul>`,
      keys: ['P&F bỏ trục thời gian, chỉ ghi biến động ≥ 1 ô; X = tăng, O = giảm.', 'Hai tham số: kích thước ô (cố định, %, ATR) và số ô đảo chiều (phổ biến 3; Wyckoff hay dùng 1).', 'Tín hiệu: phá vỡ đỉnh/đáy đôi, ba, tam giác, catapult.', 'Đường xu hướng P&F vẽ theo góc 45°.', 'Mục tiêu: đếm ngang = số cột × ô × đảo chiều cộng vào mức đếm; đếm dọc dựa vào cột phá vỡ.', 'Nhược: mất thời gian và khối lượng, nhạy với tham số.'],
      terms: [['Box size', 'Kích thước ô'], ['Reversal amount', 'Số ô đảo chiều'], ['Double top breakout', 'Phá vỡ đỉnh đôi'], ['Catapult', 'Phá vỡ – điều chỉnh – phá tiếp'], ['Bullish support line', 'Đường hỗ trợ tăng 45°'], ['Horizontal / Vertical count', 'Đếm ngang / đếm dọc']],
      quiz: [
        Q('Đặc điểm nổi bật nhất của biểu đồ P&F là:', ['Có trục thời gian chi tiết', 'Không có trục thời gian, chỉ ghi biến động đáng kể', 'Dựa vào khối lượng', 'Chỉ dùng giá mở cửa'], 1, 'Thời gian bị loại bỏ để lọc nhiễu.'),
        Q('Với đảo chiều 3 ô, đang ở cột X, giá phải giảm bao nhiêu để mở cột O?', ['1 ô', '2 ô', 'Ít nhất 3 ô', '10 ô'], 2, 'Số ô đảo chiều quyết định độ nhạy.'),
        Q('Phá vỡ đỉnh đôi trên P&F là khi:', ['Cột O thủng đáy trước', 'Cột X vượt đỉnh cột X liền trước', 'Hai cột X bằng nhau', 'Có 2 cột O liên tiếp'], 1, 'Tín hiệu mua cơ bản.'),
        Q('Ô = 2 điểm, đảo chiều 3 ô, vùng tích lũy 10 cột, mức đếm 100. Mục tiêu đếm ngang là:', ['106', '120', '160', '130'], 2, '100 + 10 × 2 × 3 = 160.'),
        Q('Đường xu hướng trên P&F thường được vẽ:', ['Nối hai đỉnh bất kỳ', 'Theo góc 45°', 'Nằm ngang', 'Theo đường trung bình'], 1, 'Mỗi cột đi một ô.'),
        Q('Đếm ngang P&F liên hệ trực tiếp với luật nào của Wyckoff?', ['Cung – Cầu', 'Nhân – Quả', 'Nỗ lực – Kết quả', 'Không liên hệ'], 1, 'Chiều rộng vùng tích lũy (nguyên nhân) ước lượng độ lớn xu hướng (hiệu ứng).'),
        Q('Nhược điểm của P&F là:', ['Quá nhiều nhiễu', 'Mất thông tin thời gian và khối lượng, nhạy với tham số', 'Không có tín hiệu', 'Không dùng được cho cổ phiếu'], 1, 'Kích thước ô và số ô đảo chiều thay đổi đáng kể kết quả.'),
        Q('Tín hiệu catapult là:', ['Phá vỡ đáy ba', 'Phá vỡ đỉnh ba, điều chỉnh nhẹ rồi phá lên tiếp', 'Một cột O dài', 'Hai cột X bằng nhau'], 1, 'Tín hiệu tiếp diễn tăng.')
      ]
    },
    en: {
      goals: ['Understand P&F: no time axis, only significant moves.', 'Build P&F with box size and reversal.', 'Recognise double/triple tops, triangles, catapults.', 'Draw 45° trendlines.', 'Compute horizontal and vertical counts.'],
      body: () => `
<h3>1. Spirit</h3><p>P&F has <b>no time axis</b>: it records only moves of at least one box, leaving the supply–demand skeleton. <b>X</b> = rising box, <b>O</b> = falling box; <b>box size</b> may be fixed, percentage or ATR; the <b>reversal</b> amount (commonly 3; Wyckoffians often use 1) opens a new column.</p>
<h3>2. Construction (3-box, closes)</h3><ol><li>In an X column, add X for each new box up.</li><li>If price instead falls ≥ 3 boxes from the top, start an O column one box lower.</li><li>Mirror for O columns.</li></ol>${fg.pnfBasic('en')}
<h3>3. Signals</h3><ul><li>Double-top breakout (buy), double-bottom breakdown (sell)</li><li>Triple top/bottom — stronger</li><li>Triangle breakouts</li><li>Catapults — continuation</li></ul>${fg.pnfTriple('en')}
<h3>4. 45° trendlines</h3><p>Bullish support lines rise at 45° from below the lowest O; bearish resistance lines fall from above the highest X.</p>
<h3>5. Targets</h3><ul><li><b>Horizontal count</b>: columns × box × reversal added to the count line — Wyckoff’s Cause & Effect.</li><li><b>Vertical count</b>: length of the first breakout column × reversal from its base.</li></ul><div class="callout">Box 1, 3-box, 8 columns, count line 50 → 50 + 8×1×3 = <b>74</b>.</div>${C.demoHtml.pnf()}
<h3>6. Pros and cons</h3><ul><li>Pros: noise filtering, objective signals, clear S/R, built-in targets.</li><li>Cons: no time or volume; sensitive to parameters.</li></ul>`,
      keys: ['No time axis; X up, O down.', 'Parameters: box size and reversal.', 'Signals: double/triple breakouts, triangles, catapults.', '45° trendlines.', 'Horizontal count = columns × box × reversal; vertical count from the breakout column.', 'Cons: no time/volume, parameter-sensitive.'],
      terms: [['Box size', 'Value per box'], ['Reversal amount', 'Boxes to start a new column'], ['Catapult', 'Breakout–pullback–breakout']],
      quiz: [
        Q('P&F’s defining feature:', ['Detailed time axis', 'No time axis, significant moves only', 'Volume-based', 'Opens only'], 1, 'Time is removed.'),
        Q('With a 3-box reversal, an X column turns when price falls:', ['1 box', '2 boxes', 'At least 3 boxes', '10 boxes'], 2, 'The reversal sets sensitivity.'),
        Q('A double-top breakout is:', ['O below the prior O', 'X above the prior X top', 'Two equal X columns', 'Two O columns'], 1, 'Basic buy signal.'),
        Q('Box 2, 3-box, 10 columns, count line 100. Target:', ['106', '120', '160', '130'], 2, '100 + 60.'),
        Q('P&F trendlines are drawn:', ['Through any two tops', 'At 45°', 'Horizontally', 'Along an MA'], 1, 'One box per column.'),
        Q('The horizontal count relates to which Wyckoff law?', ['Supply & demand', 'Cause & effect', 'Effort vs result', 'None'], 1, 'Width of the cause → size of the effect.'),
        Q('A P&F drawback:', ['Too noisy', 'No time/volume; parameter-sensitive', 'No signals', 'Unusable for stocks'], 1, 'Parameters matter.'),
        Q('A catapult is:', ['A triple-bottom break', 'Triple-top breakout, small pullback, further breakout', 'A long O column', 'Two equal X'], 1, 'Continuation signal.')
      ]
    }
  };
})(window.LLW);
