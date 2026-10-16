/* CMT Level 1 — Part II, lessons 4–7. Written by Lai Long Master TA in its own words. */
(function (L) {
  'use strict';
  const C = L.cmt, F = C.fig;
  const T = (lang, vi, en) => (lang === 'en' ? en : vi);

  /* ---------- figures ---------- */
  const fg = {
    polarity: lg => F.line({ h: 240, hl: [[57, 's-res', T(lg, 'Kháng cự cũ → Hỗ trợ mới', 'Old resistance → new support')]],
      series: [{ pts: [[0, 20], [14, 56], [24, 38], [34, 57], [44, 40], [54, 57], [64, 78], [74, 58], [82, 66], [89, 58], [100, 88]] }],
      labels: [[14, 56, 'R', 't'], [34, 57, 'R', 't'], [54, 57, 'R', 't'], [74, 58, 'S', 'b'], [89, 58, 'S', 'b']],
      caption: T(lg, 'Nguyên lý đổi vai (polarity): kháng cự bị phá vỡ trở thành hỗ trợ', 'Polarity: broken resistance becomes support') }),
    trendline: lg => F.line({ h: 260,
      series: [{ pts: [[0, 10.8], [100, 66.8]], cls: 's-trend' }, { pts: [[0, 30.8], [100, 86.8]], cls: 's-trend2' },
        { pts: [[0, 12], [12, 36], [20, 22], [35, 50], [45, 36], [60, 64], [70, 50], [85, 78], [92, 63], [100, 74]] }],
      labels: [[20, 22, '1', 'b'], [45, 36, '2', 'b'], [70, 50, T(lg, '3 = xác nhận', '3 = confirmed'), 'b'], [92, 63, T(lg, 'phá vỡ', 'break'), 'b'], [85, 78, T(lg, 'đường song song', 'return line'), 't']],
      caption: T(lg, 'Đường xu hướng tăng nối các đáy; lần chạm thứ 3 xác nhận. Đường song song qua các đỉnh tạo thành kênh giá', 'An uptrend line joins lows; the third touch confirms it. A parallel line through highs forms a channel') }),
    breakout: lg => F.line({ h: 240, hl: [[60, 's-res', T(lg, 'Kháng cự', 'Resistance')], [64, 's-trend2', T(lg, 'Bộ lọc xác nhận', 'Confirmation filter')]],
      series: [{ pts: [[0, 40], [10, 60], [20, 42], [30, 60], [40, 43], [50, 59], [57, 75], [64, 62], [74, 84], [100, 94]] }],
      labels: [[57, 75, T(lg, 'Phá vỡ', 'Breakout'), 't'], [64, 62, 'Pullback', 'b']],
      caption: T(lg, 'Phá vỡ kháng cự, vượt bộ lọc, rồi pullback kiểm tra lại mức cũ', 'Breakout through resistance and the filter, then a pullback to retest') }),
    trailing: lg => F.line({ h: 240,
      series: [{ pts: [[0, 18], [22, 18], [22, 25], [46, 25], [46, 42], [70, 42], [70, 58], [92, 58]], cls: 's-stop' },
        { pts: [[0, 10], [15, 35], [22, 27], [38, 55], [46, 44], [62, 72], [70, 60], [85, 88], [93, 56], [100, 50]] }],
      labels: [[93, 56, T(lg, 'chạm stop', 'stopped out'), 'r']],
      caption: T(lg, 'Trailing stop: dời điểm dừng lên dưới mỗi đáy mới — bảo vệ lợi nhuận', 'Trailing stop: raised beneath each new low to lock in profit') }),
    retrace: lg => F.line({ h: 250, hl: [[59.4, 's-trend2', '38.2%'], [50, 's-trend', '50%'], [40.6, 's-trend2', '61.8%']],
      series: [{ pts: [[0, 10], [45, 90], [62, 52], [72, 60], [78, 48], [100, 95]] }],
      labels: [[0, 10, 'A', 'r'], [45, 90, 'B', 't'], [78, 48, T(lg, 'vùng mua', 'buy zone'), 'b']],
      caption: T(lg, 'Thoái lui về vùng 38.2–61.8% của nhịp AB trước khi xu hướng tiếp diễn', 'A retracement into 38.2–61.8% of AB before the trend resumes') }),
    maLag: lg => {
      const p = [], m = [];
      for (let x = 0; x <= 100; x += 2) { p.push([x, 25 + 0.45 * x + 12 * Math.sin(x / 5)]); if (x >= 12) m.push([x, 25 + 0.45 * (x - 9) + 4 * Math.sin((x - 9) / 5)]); }
      return F.line({ h: 230, series: [{ pts: p }, { pts: m, cls: 's-price2' }], labels: [[100, p[p.length - 1][1], T(lg, 'Giá', 'Price'), 'l', 'nodot'], [100, m[m.length - 1][1], 'MA', 'l', 'nodot']],
        caption: T(lg, 'Đường MA mượt hơn giá nhưng luôn đi sau giá (độ trễ)', 'The MA is smoother than price but lags it') });
    },
    cross: lg => {
      const f = [], s = [], lab = [];
      let prev = null;
      for (let x = 0; x <= 100; x += 1) {
        const a = 50 + 28 * Math.sin(x / 15), b = 50 + 14 * Math.sin((x - 10) / 15);
        f.push([x, a]); s.push([x, b]);
        if (prev != null && Math.sign(a - b) !== Math.sign(prev)) lab.push([x, b, a > b ? T(lg, 'giao cắt vàng', 'golden cross') : T(lg, 'giao cắt tử thần', 'death cross'), a > b ? 'b' : 't']);
        prev = a - b;
      }
      return F.line({ h: 230, series: [{ pts: f }, { pts: s, cls: 's-price2' }], labels: lab,
        caption: T(lg, 'Đường nhanh (trắng) cắt đường chậm (xanh): tín hiệu giao cắt', 'Fast line (white) crossing the slow line (green)') });
    },
    hs: lg => F.line({ h: 240, hl: [[42, 's-sup', T(lg, 'Đường viền cổ', 'Neckline')]],
      series: [{ pts: [[0, 15], [15, 56], [25, 42], [38, 78], [50, 42], [63, 58], [72, 41], [80, 30], [86, 39], [100, 6]] }],
      labels: [[15, 56, T(lg, 'Vai trái', 'Left shoulder'), 't'], [38, 78, T(lg, 'Đầu', 'Head'), 't'], [63, 58, T(lg, 'Vai phải', 'Right shoulder'), 't'], [86, 39, 'Pullback', 't'], [100, 6, T(lg, 'Mục tiêu', 'Target'), 'l']],
      caption: T(lg, 'Vai–đầu–vai đỉnh: mục tiêu ≈ khoảng cách từ đầu đến đường viền cổ, đo xuống từ điểm phá vỡ', 'Head-and-shoulders top: target ≈ head-to-neckline distance projected down from the break') }),
    dbl: lg => F.line({ w: 320, h: 210, hl: [[45, 's-sup', T(lg, 'Xác nhận', 'Confirm')]], series: [{ pts: [[0, 15], [22, 72], [42, 45], [62, 71], [78, 40], [85, 47], [100, 18]] }],
      labels: [[22, 72, T(lg, 'Đỉnh 1', 'Top 1'), 't'], [62, 71, T(lg, 'Đỉnh 2', 'Top 2'), 't']], caption: T(lg, 'Hai đỉnh', 'Double top') }),
    tri: (lg, kind) => {
      const d = {
        sym: { s: [[[8, 85], [80, 57]], [[18, 22], [80, 48]]], p: [[0, 50], [8, 85], [18, 22], [32, 77], [44, 33], [58, 68], [68, 42], [78, 56], [88, 78], [100, 90]], c: T(lg, 'Tam giác cân', 'Symmetrical triangle') },
        asc: { s: [[[10, 75], [82, 75]], [[16, 20], [76, 66]]], p: [[0, 40], [10, 75], [16, 20], [32, 75], [42, 40], [56, 75], [64, 55], [74, 75], [80, 67], [90, 88], [100, 95]], c: T(lg, 'Tam giác tăng', 'Ascending triangle') },
        desc: { s: [[[10, 25], [82, 25]], [[16, 80], [76, 34]]], p: [[0, 60], [10, 25], [16, 80], [32, 25], [42, 60], [56, 25], [64, 45], [74, 25], [80, 33], [90, 12], [100, 5]], c: T(lg, 'Tam giác giảm', 'Descending triangle') }
      }[kind];
      return F.line({ w: 320, h: 210, series: d.s.map(pts => ({ pts, cls: 's-trend' })).concat([{ pts: d.p }]), caption: d.c });
    },
    wedge: lg => F.line({ w: 320, h: 210, series: [{ pts: [[5, 20], [80, 75]], cls: 's-trend' }, { pts: [[5, 45], [80, 82]], cls: 's-trend' }, { pts: [[0, 25], [5, 45], [18, 30], [32, 60], [44, 46], [58, 72], [66, 62], [76, 80], [84, 66], [100, 30]] }],
      caption: T(lg, 'Nêm tăng (thường giảm sau phá vỡ)', 'Rising wedge (usually breaks down)') }),
    flag: lg => F.line({ w: 320, h: 210, series: [{ pts: [[38, 72], [64, 58]], cls: 's-trend' }, { pts: [[42, 60], [66, 46]], cls: 's-trend' }, { pts: [[0, 10], [6, 14], [34, 72], [42, 60], [50, 66], [57, 54], [64, 58], [68, 48], [100, 92]] }],
      labels: [[20, 42, T(lg, 'cột cờ', 'pole'), 'l', 'nodot'], [52, 70, T(lg, 'lá cờ', 'flag'), 't', 'nodot']], caption: T(lg, 'Cờ tăng: mẫu hình "nửa cột cờ"', 'Bull flag: a "half-mast" pattern') }),
    rect: lg => F.line({ w: 320, h: 210, hl: [[70, 's-res'], [35, 's-sup']], series: [{ pts: [[0, 15], [10, 70], [22, 35], [36, 70], [50, 35], [64, 70], [76, 36], [86, 72], [92, 66], [100, 92]] }], caption: T(lg, 'Hình chữ nhật', 'Rectangle') })
  };

  const Q = (q, o, a, e) => ({ q, o, a, e });

  /* ================= LESSON 4 ================= */
  C.lessons['l1-04'] = {
    vi: {
      goals: ['Hiểu hỗ trợ, kháng cự và vì sao chúng hình thành.', 'Đánh giá độ mạnh của một vùng hỗ trợ/kháng cự.', 'Vẽ đúng đường xu hướng và đánh giá độ tin cậy của nó.', 'Dựng kênh giá và hiểu ứng dụng của kênh.', 'Nhận biết khi đường xu hướng bị phá vỡ và ý nghĩa.'],
      body: () => `
<h3>1. Hỗ trợ và kháng cự</h3>
<p><b>Hỗ trợ (support)</b> là vùng giá mà tại đó lực cầu đủ mạnh để chặn đà giảm. <b>Kháng cự (resistance)</b> là vùng giá mà tại đó lực cung đủ mạnh để chặn đà tăng. Đây là <b>vùng</b> chứ không phải một con số chính xác: giá có thể xuyên nhẹ qua mức rồi quay lại.</p>
<p><b>Vì sao chúng tồn tại?</b> Vì thị trường có trí nhớ:</p>
<ul><li><b>Người mua bị kẹt</b> ở vùng đỉnh cũ muốn "hoà vốn" khi giá quay lại, nên họ bán ra và tạo kháng cự.</li>
<li><b>Người bỏ lỡ</b> cơ hội mua ở đáy cũ sẵn sàng mua khi giá về lại đó, tạo hỗ trợ.</li>
<li><b>Người bán khống</b> chốt lời ở các đáy cũ, góp thêm lực mua.</li>
<li><b>Số tròn</b> và các mức được nhiều người chú ý (đỉnh lịch sử, giá phát hành) thu hút lệnh chờ.</li></ul>
<h3>2. Nguyên lý đổi vai (polarity)</h3>
<p>Khi kháng cự bị phá vỡ rõ ràng, nó thường trở thành hỗ trợ. Ngược lại, hỗ trợ bị phá vỡ thường thành kháng cự. Lý do: những người từng bán ở kháng cự giờ "thấy mình sai" và muốn mua lại khi giá quay về mức đó.</p>
${fg.polarity('vi')}
<h3>3. Độ mạnh của một vùng hỗ trợ/kháng cự</h3>
<table class="tbl"><thead><tr><th>Yếu tố</th><th>Vùng mạnh hơn khi…</th></tr></thead><tbody>
<tr><td>Số lần chạm</td><td>Giá phản ứng nhiều lần tại vùng đó</td></tr>
<tr><td>Khối lượng</td><td>Khối lượng giao dịch tại vùng đó lớn (nhiều người có "kỷ niệm" với mức giá)</td></tr>
<tr><td>Thời gian</td><td>Vùng hình thành trong thời gian dài và ở khung thời gian lớn</td></tr>
<tr><td>Độ gần</td><td>Vùng hình thành gần đây (trí nhớ còn mới)</td></tr>
<tr><td>Biên độ phản ứng</td><td>Lần trước giá bật ra mạnh từ vùng đó</td></tr></tbody></table>
<p>Lưu ý: mỗi lần giá quay lại kiểm tra, lượng lệnh chờ tại vùng bị tiêu hao dần. Vì vậy một vùng bị chạm quá nhiều lần trong thời gian ngắn có thể đang <b>yếu đi</b> chứ không mạnh lên.</p>
${C.demoHtml.srZones()}
<h3>4. Đường xu hướng (trendline)</h3>
<p><b>Đường xu hướng tăng</b> nối ít nhất hai đáy tăng dần và nằm dưới giá. <b>Đường xu hướng giảm</b> nối ít nhất hai đỉnh giảm dần và nằm trên giá. Hai điểm đủ để <i>vẽ</i> đường; lần chạm thứ ba mới <i>xác nhận</i> nó.</p>
<p>Đánh giá độ tin cậy:</p>
<ul><li><b>Số lần chạm</b>: càng nhiều càng có ý nghĩa.</li>
<li><b>Độ dài</b>: đường kéo dài nhiều tháng quan trọng hơn đường vài ngày.</li>
<li><b>Góc dốc</b>: đường quá dốc khó duy trì và dễ bị phá vỡ sớm. Khi xu hướng tăng tốc, ta có thể vẽ các đường mới dốc hơn ("đường quạt"); khi đường thứ ba bị phá, xu hướng thường đã kết thúc.</li>
<li><b>Thang giá</b>: với dữ liệu dài hạn, đường vẽ trên thang log và thang số học có thể cho điểm phá vỡ khác nhau (Bài 3).</li></ul>
${fg.trendline('vi')}
<h3>5. Kênh giá (channel)</h3>
<p>Vẽ một đường song song với đường xu hướng, đi qua đỉnh (với xu hướng tăng) hoặc đáy (với xu hướng giảm). Đường này gọi là <b>đường song song / return line</b>, và hai đường tạo thành <b>kênh giá</b>. Ứng dụng:</p>
<ul><li>Chốt lời một phần khi giá chạm biên trên của kênh tăng.</li>
<li>Khi giá <b>không chạm được</b> biên trên, sức mạnh đang suy yếu: cảnh báo sớm trước khi đường xu hướng bị phá.</li>
<li>Khi giá phá lên trên biên trên, xu hướng đang tăng tốc. Có thể là dấu hiệu mạnh, nhưng cũng có thể là giai đoạn hưng phấn cuối.</li></ul>
<p>Ngoài kênh vẽ tay còn có <b>kênh hồi quy tuyến tính</b> (đường hồi quy ± độ lệch chuẩn). Kênh này khách quan hơn vì tính bằng công thức.</p>
<h3>6. Phá vỡ đường xu hướng</h3>
<p>Phá vỡ đường xu hướng cho biết <b>tốc độ</b> của xu hướng đã thay đổi. Điều đó <b>chưa chắc</b> có nghĩa là xu hướng đảo chiều: giá có thể chuyển sang đi ngang. Cách xử lý thận trọng là xem phá vỡ đường xu hướng là <b>tín hiệu cảnh báo</b> (thu hẹp vị thế, nâng điểm dừng). Chỉ coi là đảo chiều khi cấu trúc đỉnh-đáy cũng bị phá (Bài 1–2).</p>`,
      keys: ['Hỗ trợ/kháng cự là vùng nơi cầu/cung đủ mạnh để chặn giá; chúng tồn tại vì thị trường có trí nhớ.', 'Đổi vai: kháng cự bị phá thành hỗ trợ và ngược lại.', 'Độ mạnh của vùng: số lần chạm, khối lượng, thời gian, độ gần, biên độ phản ứng.', 'Đường xu hướng nối ≥ 2 đáy (tăng) hoặc đỉnh (giảm); lần chạm thứ 3 xác nhận; đường quá dốc dễ gãy.', 'Kênh giá = đường xu hướng + đường song song; không chạm được biên ngoài là dấu hiệu suy yếu.', 'Phá đường xu hướng = tốc độ xu hướng thay đổi, chưa chắc là đảo chiều.'],
      terms: [['Support / Resistance', 'Hỗ trợ / Kháng cự'], ['Polarity', 'Nguyên lý đổi vai'], ['Trendline', 'Đường xu hướng'], ['Return line', 'Đường song song tạo kênh'], ['Channel', 'Kênh giá'], ['Fan lines', 'Đường quạt — các đường xu hướng dốc dần'], ['Linear regression channel', 'Kênh hồi quy tuyến tính']],
      quiz: [
        Q('Vì sao kháng cự bị phá vỡ thường trở thành hỗ trợ?', ['Do quy định của sàn', 'Người từng bán ở mức đó muốn mua lại khi giá quay về', 'Do đường trung bình động', 'Không có lý do'], 1, 'Đây là nguyên lý đổi vai dựa trên tâm lý "thấy mình sai" của người đã bán.'),
        Q('Yếu tố nào KHÔNG làm vùng hỗ trợ mạnh hơn?', ['Nhiều lần chạm', 'Khối lượng lớn tại vùng', 'Hình thành ở khung thời gian lớn', 'Giá chạm liên tục trong vài phiên với khối lượng giảm dần'], 3, 'Chạm liên tục trong thời gian ngắn tiêu hao lệnh chờ, nên vùng có thể đang yếu đi.'),
        Q('Đường xu hướng tăng được vẽ bằng cách nối:', ['Các đỉnh tăng dần', 'Ít nhất hai đáy tăng dần, nằm dưới giá', 'Giá đóng cửa đầu và cuối', 'Hai đỉnh bất kỳ'], 1, 'Đường xu hướng tăng nằm dưới giá và nối các đáy cao dần.'),
        Q('Lần chạm thứ mấy thường được xem là xác nhận đường xu hướng?', ['Lần 1', 'Lần 2', 'Lần 3', 'Lần 10'], 2, 'Hai điểm để vẽ, điểm thứ ba để xác nhận.'),
        Q('Đường xu hướng quá dốc thường:', ['Bền vững nhất', 'Khó duy trì, dễ bị phá vỡ', 'Không thể bị phá vỡ', 'Chỉ có ở thị trường giảm'], 1, 'Tốc độ tăng quá nhanh khó duy trì; xu hướng thường điều chỉnh về độ dốc hợp lý hơn.'),
        Q('Giá trong kênh tăng không chạm được biên trên ở nhịp hồi gần nhất. Điều này gợi ý:', ['Xu hướng tăng tốc', 'Sức mạnh suy yếu — cảnh báo sớm', 'Chắc chắn đảo chiều ngay', 'Không có ý nghĩa'], 1, 'Không đạt biên ngoài là dấu hiệu lực đẩy yếu đi, thường đến trước khi đường xu hướng bị phá.'),
        Q('Ý nghĩa thận trọng nhất của việc phá vỡ đường xu hướng tăng là:', ['Chắc chắn bắt đầu xu hướng giảm', 'Tốc độ xu hướng thay đổi — có thể chuyển sang đi ngang', 'Mua thêm', 'Không có ý nghĩa'], 1, 'Phá đường xu hướng chỉ cho biết xu hướng chậm lại; cần cấu trúc đỉnh-đáy bị phá mới kết luận đảo chiều.'),
        Q('Ưu điểm của kênh hồi quy tuyến tính so với kênh vẽ tay là:', ['Luôn đúng', 'Khách quan, tính bằng công thức', 'Không bao giờ bị phá vỡ', 'Không cần dữ liệu'], 1, 'Hồi quy cho cùng một kết quả với cùng dữ liệu, giảm tính chủ quan.')
      ]
    },
    en: {
      goals: ['Understand support, resistance and why they form.', 'Judge the strength of a zone.', 'Draw trendlines and judge reliability.', 'Build channels and use them.', 'Interpret trendline breaks.'],
      body: () => `
<h3>1. Support and resistance</h3><p><b>Support</b> is a zone where demand halts declines; <b>resistance</b> a zone where supply halts advances. They are <b>zones</b>, not exact numbers, and exist because markets have memory: trapped buyers sell to break even, regretful non-buyers buy at old lows, shorts cover, and round numbers attract orders.</p>
<h3>2. Polarity</h3><p>Broken resistance tends to become support and vice versa.</p>${fg.polarity('en')}
<h3>3. Strength of a zone</h3><ul><li>Number of touches</li><li>Volume traded there</li><li>Time and timeframe</li><li>Recency</li><li>Size of the prior reaction</li></ul><p>Repeated quick retests consume resting orders and can <b>weaken</b> a level.</p>${C.demoHtml.srZones()}
<h3>4. Trendlines</h3><p>An uptrend line joins at least two rising lows beneath price; a downtrend line joins falling highs above price. Two points draw it, a third confirms it. Reliability grows with touches and length; very steep lines break easily (fan lines show acceleration); scale choice matters.</p>${fg.trendline('en')}
<h3>5. Channels</h3><p>A parallel <b>return line</b> through highs (or lows) forms a channel: take partial profits at the far line; failure to reach it warns of weakness; a break beyond it shows acceleration or a blow-off. Linear-regression channels are an objective alternative.</p>
<h3>6. Trendline breaks</h3><p>A break shows the trend’s <b>rate</b> has changed — not necessarily a reversal. Treat it as a warning; call a reversal only when the peak-trough structure also breaks.</p>`,
      keys: ['Support/resistance are zones created by market memory.', 'Polarity: broken resistance becomes support and vice versa.', 'Strength: touches, volume, time, recency, reaction size.', 'Trendlines join ≥2 lows/highs; the 3rd touch confirms; steep lines break early.', 'Channel = trendline + return line; failing to reach the far line warns.', 'A trendline break signals a change in rate, not necessarily reversal.'],
      terms: [['Polarity', 'Role reversal of S/R'], ['Return line', 'Parallel channel line'], ['Fan lines', 'Successively steeper trendlines'], ['Regression channel', 'Objective statistical channel']],
      quiz: [
        Q('Why does broken resistance often become support?', ['Exchange rules', 'Earlier sellers want to buy back on a return', 'Moving averages', 'No reason'], 1, 'Polarity reflects the psychology of those who sold.'),
        Q('Which does NOT strengthen support?', ['Many touches', 'High volume there', 'Higher timeframe', 'Repeated quick retests on falling volume'], 3, 'Quick retests consume orders.'),
        Q('An uptrend line connects:', ['Rising highs', 'At least two rising lows below price', 'First and last close', 'Any two highs'], 1, 'It lies beneath price.'),
        Q('Which touch usually confirms a trendline?', ['1st', '2nd', '3rd', '10th'], 2, 'Two to draw, three to confirm.'),
        Q('Very steep trendlines:', ['Are most durable', 'Are hard to sustain and break early', 'Never break', 'Only in bear markets'], 1, 'Such speed rarely lasts.'),
        Q('Price fails to reach the channel’s upper line:', ['Acceleration', 'Weakening — early warning', 'Certain reversal', 'Meaningless'], 1, 'Momentum is fading.'),
        Q('A break of an uptrend line most cautiously means:', ['A bear market', 'The trend’s rate changed — maybe sideways', 'Buy more', 'Nothing'], 1, 'Structure must also break to call a reversal.'),
        Q('Advantage of a regression channel:', ['Always right', 'Objective, formula-based', 'Never breaks', 'Needs no data'], 1, 'Same data, same result.')
      ]
    }
  };

  /* ================= LESSON 5 ================= */
  C.lessons['l1-05'] = {
    vi: {
      goals: ['Định nghĩa phá vỡ (breakout) và các bộ lọc xác nhận.', 'Nhận diện phá vỡ giả và pullback/throwback.', 'Phân loại điểm dừng lỗ và cách đặt hợp lý.', 'Sử dụng mức thoái lui (1/3–2/3, Fibonacci) để tìm điểm vào.', 'Hiểu mối quan hệ giữa phá vỡ, điểm dừng và quản lý rủi ro.'],
      body: () => `
<h3>1. Phá vỡ (breakout)</h3>
<p>Phá vỡ xảy ra khi giá vượt khỏi một mức tham chiếu quan trọng: kháng cự, hỗ trợ, đường xu hướng hay biên của mẫu hình. Phá vỡ cho thấy cán cân cung–cầu đã nghiêng hẳn về một phía. Đây thường là thời điểm xu hướng mới bắt đầu hoặc xu hướng cũ tiếp diễn.</p>
<p>Vấn đề lớn nhất: <b>phá vỡ giả (false breakout)</b>. Giá vượt mức rồi quay lại ngay, khiến người vào lệnh bị "whipsaw". Vì vậy ta dùng <b>bộ lọc xác nhận</b>:</p>
<table class="tbl"><thead><tr><th>Bộ lọc</th><th>Cách làm</th><th>Đánh đổi</th></tr></thead><tbody>
<tr><td>Giá đóng cửa</td><td>Chỉ chấp nhận khi <b>đóng cửa</b> vượt mức, không tính xuyên trong phiên</td><td>Đơn giản, loại bớt râu nến</td></tr>
<tr><td>Phần trăm / điểm</td><td>Vượt mức thêm x% hoặc x điểm</td><td>Bộ lọc lớn → ít tín hiệu sai nhưng vào muộn hơn</td></tr>
<tr><td>Biến động (ATR)</td><td>Vượt mức thêm k × ATR</td><td>Tự điều chỉnh theo độ biến động của thị trường</td></tr>
<tr><td>Thời gian</td><td>Giữ được bên ngoài mức trong n phiên</td><td>Tránh các cú vượt chớp nhoáng</td></tr>
<tr><td>Khối lượng</td><td>Phá vỡ kèm khối lượng tăng mạnh</td><td>Rất hữu ích cho phá vỡ đi lên</td></tr></tbody></table>
<p>Không có bộ lọc hoàn hảo. Bộ lọc chặt thì an toàn hơn nhưng vào lệnh muộn và mất một phần lợi nhuận. Bộ lọc lỏng thì vào sớm nhưng nhiều tín hiệu sai.</p>
${fg.breakout('vi')}
<p><b>Pullback / throwback</b>: sau khi phá vỡ, giá thường quay lại kiểm tra mức vừa vượt. Pullback là quay về sau phá vỡ đi xuống; throwback là quay về sau phá vỡ đi lên (một số tài liệu dùng lẫn hai từ). Đây là cơ hội vào lệnh với điểm dừng gần. Nhưng không phải phá vỡ nào cũng có nhịp quay lại; phá vỡ mạnh nhất đôi khi không quay lại.</p>
<h3>2. Điểm dừng (stops)</h3>
<p>Điểm dừng là lệnh hoặc mức giá định trước để thoát vị thế. Mục đích là <b>giới hạn thua lỗ</b> và <b>bảo vệ lợi nhuận</b>. Đây là công cụ biến PTKT thành kỷ luật quản trị rủi ro.</p>
<ul><li><b>Điểm dừng bảo vệ ban đầu (initial protective stop)</b>: đặt ngay khi vào lệnh, tại mức giá mà nhận định bị chứng minh là sai. Ví dụ dưới hỗ trợ, dưới đáy gần nhất hoặc phía bên kia mẫu hình.</li>
<li><b>Điểm dừng kéo theo (trailing stop)</b>: dời theo hướng có lợi khi xu hướng tiến triển, ví dụ dưới mỗi đáy mới, hoặc cách giá cao nhất k × ATR (kiểu chandelier).</li>
<li><b>Điểm dừng hoà vốn (break-even)</b>: dời về giá vào sau khi lệnh có lãi đủ xa. Cẩn thận: dời quá sớm dễ bị quét bởi dao động bình thường.</li>
<li><b>Điểm dừng thời gian (time stop)</b>: thoát nếu sau n phiên giá không chạy như kỳ vọng. Vốn bị "giam" cũng là một chi phí.</li>
<li><b>Điểm dừng theo tiền (money stop)</b>: thoát khi lỗ x đồng. Đơn giản, nhưng không gắn với cấu trúc thị trường nên dễ bị đặt ở vị trí vô lý.</li></ul>
${fg.trailing('vi')}
<div class="callout"><b>Nguyên tắc đặt điểm dừng</b>: đặt ở nơi mà nếu giá chạm tới thì luận điểm giao dịch <b>không còn đúng</b>. Thêm một khoảng đệm (theo % hoặc ATR) để tránh dao động ngẫu nhiên. Tránh đặt đúng số tròn hoặc ngay sát mức hiển nhiên, vì nơi đó tập trung nhiều điểm dừng và dễ bị quét.</div>
<h3>3. Thoái lui (retracement)</h3>
<p>Xu hướng không đi thẳng. Sau mỗi nhịp đẩy là một nhịp thoái lui một phần quãng đường. Các tỷ lệ thường được theo dõi:</p>
<ul><li><b>1/3, 1/2, 2/3</b>: truyền thống từ Lý thuyết Dow. Nhịp cấp 2 thường thoái lui 1/3–2/3.</li>
<li><b>Fibonacci 38.2%, 50%, 61.8%</b> (đôi khi thêm 23.6% và 78.6%). Thoái lui nông (≤ 38.2%) cho thấy xu hướng mạnh. Thoái lui sâu hơn 61.8% làm tăng khả năng xu hướng đã kết thúc.</li></ul>
${fg.retrace('vi')}
<p>Mức thoái lui là <b>vùng quan sát</b>, không phải điểm mua tự động. Hãy chờ tín hiệu xác nhận tại vùng: mẫu nến đảo chiều, khối lượng cạn, hội tụ với hỗ trợ cũ hoặc đường xu hướng. Nhiều công cụ cùng chỉ về một vùng (confluence) thì vùng đó đáng tin hơn.</p>
${C.demoHtml.fibo()}`,
      keys: ['Phá vỡ là giá vượt mức tham chiếu quan trọng; vấn đề lớn nhất là phá vỡ giả.', 'Bộ lọc: đóng cửa, %/điểm, ATR, thời gian, khối lượng — chặt thì an toàn nhưng muộn.', 'Pullback/throwback là nhịp quay lại kiểm tra mức vừa phá, tạo điểm vào có rủi ro thấp.', 'Điểm dừng: bảo vệ ban đầu, kéo theo, hoà vốn, thời gian, theo tiền. Đặt nơi luận điểm sai + khoảng đệm.', 'Thoái lui phổ biến: 1/3–1/2–2/3 và Fibonacci 38.2/50/61.8%; nông = xu hướng mạnh.', 'Mức thoái lui là vùng quan sát, cần tín hiệu xác nhận và sự hội tụ.'],
      terms: [['Breakout', 'Phá vỡ'], ['False breakout / Whipsaw', 'Phá vỡ giả / bị quét hai chiều'], ['Filter', 'Bộ lọc xác nhận'], ['Pullback / Throwback', 'Nhịp quay lại kiểm tra sau phá vỡ'], ['Protective stop', 'Điểm dừng bảo vệ'], ['Trailing stop', 'Điểm dừng kéo theo'], ['Retracement', 'Thoái lui'], ['Confluence', 'Sự hội tụ nhiều tín hiệu']],
      quiz: [
        Q('Mục đích chính của bộ lọc phá vỡ là:', ['Tăng số tín hiệu', 'Giảm phá vỡ giả', 'Vào lệnh sớm nhất', 'Bỏ qua khối lượng'], 1, 'Bộ lọc đánh đổi việc vào muộn hơn để giảm tín hiệu sai.'),
        Q('Bộ lọc dựa trên ATR có ưu điểm:', ['Cố định mọi thị trường', 'Tự điều chỉnh theo độ biến động', 'Không bao giờ sai', 'Không cần dữ liệu'], 1, 'Thị trường biến động mạnh cần ngưỡng lớn hơn; ATR phản ánh điều đó.'),
        Q('Điểm dừng bảo vệ ban đầu nên đặt ở:', ['Số tròn gần nhất', 'Nơi luận điểm giao dịch bị chứng minh là sai, cộng khoảng đệm', 'Cách giá vào đúng 1%', 'Không cần đặt'], 1, 'Điểm dừng phải gắn với cấu trúc thị trường.'),
        Q('Nhược điểm của dời điểm dừng về hoà vốn quá sớm là:', ['Không có', 'Dễ bị quét bởi dao động bình thường', 'Tăng rủi ro tối đa', 'Làm chậm lệnh'], 1, 'Giá cần không gian dao động; dời quá sớm biến lệnh tốt thành lệnh hoà.'),
        Q('Thoái lui nông (dưới khoảng 38.2%) thường cho thấy:', ['Xu hướng yếu', 'Xu hướng mạnh', 'Đảo chiều chắc chắn', 'Thị trường đi ngang'], 1, 'Người mua sẵn sàng vào sớm, không đợi giá giảm sâu.'),
        Q('Theo truyền thống Dow, nhịp điều chỉnh cấp 2 thường thoái lui:', ['5–10%', '1/3 đến 2/3', 'Đúng 61.8%', 'Trên 100%'], 1, 'Khoảng 1/3–2/3 nhịp trước đó.'),
        Q('Cách dùng mức Fibonacci đúng nhất là:', ['Mua ngay khi chạm 61.8%', 'Xem là vùng quan sát, chờ tín hiệu xác nhận và hội tụ', 'Bỏ qua hoàn toàn', 'Chỉ dùng cho tiền điện tử'], 1, 'Mức thoái lui không tự tạo tín hiệu; cần xác nhận.'),
        Q('Throwback (sau phá vỡ đi lên) mang lại lợi ích gì?', ['Không có', 'Điểm vào với điểm dừng gần, rủi ro thấp', 'Đảm bảo lợi nhuận', 'Xác nhận đảo chiều giảm'], 1, 'Giá quay lại mức vừa phá cho phép đặt điểm dừng ngay dưới mức đó.')
      ]
    },
    en: {
      goals: ['Define breakouts and confirmation filters.', 'Recognise false breakouts and pullbacks/throwbacks.', 'Classify stops and place them sensibly.', 'Use retracements (1/3–2/3, Fibonacci) for entries.'],
      body: () => `
<h3>1. Breakouts</h3><p>A breakout is a move beyond an important reference — support, resistance, a trendline or pattern boundary. The main problem is the <b>false breakout</b>. Filters: <b>close</b> beyond the level, a <b>%/point</b> margin, an <b>ATR</b> margin, a <b>time</b> requirement, <b>volume</b> expansion. Tighter filters mean fewer false signals but later entries.</p>${fg.breakout('en')}
<p>After a breakout price often returns to test the level (pullback/throwback) — a low-risk entry, though the strongest breakouts may never come back.</p>
<h3>2. Stops</h3><ul><li><b>Initial protective stop</b> — where the thesis is wrong.</li><li><b>Trailing stop</b> — under each new low or k×ATR from the high.</li><li><b>Break-even stop</b> — beware moving it too early.</li><li><b>Time stop</b> — exit if nothing happens in n bars.</li><li><b>Money stop</b> — simple but structure-blind.</li></ul>${fg.trailing('en')}
<div class="callout">Place stops where the trade idea is invalid, plus a buffer; avoid obvious round numbers where stops cluster.</div>
<h3>3. Retracements</h3><p>Watch 1/3, 1/2, 2/3 (Dow) and Fibonacci 38.2/50/61.8% (plus 23.6/78.6). Shallow retracements signal strength; beyond 61.8% the trend may be over. Treat levels as zones needing confirmation and confluence.</p>${fg.retrace('en')}${C.demoHtml.fibo()}`,
      keys: ['False breakouts are the main problem.', 'Filters: close, %, ATR, time, volume — tighter is safer but later.', 'Pullbacks/throwbacks give low-risk entries.', 'Stops: protective, trailing, break-even, time, money; place at invalidation + buffer.', 'Retracements: 1/3–1/2–2/3, Fibonacci 38.2/50/61.8.', 'Levels are zones needing confirmation.'],
      terms: [['Whipsaw', 'Being stopped both ways'], ['Throwback', 'Return after an upside breakout'], ['Trailing stop', 'Stop moved with the trend'], ['Confluence', 'Several tools agreeing']],
      quiz: [
        Q('The main purpose of breakout filters is:', ['More signals', 'Fewer false breakouts', 'Earliest entry', 'Ignore volume'], 1, 'They trade lateness for reliability.'),
        Q('An ATR filter:', ['Is fixed for all markets', 'Adapts to volatility', 'Is never wrong', 'Needs no data'], 1, 'Volatile markets need wider thresholds.'),
        Q('The initial stop belongs:', ['At the nearest round number', 'Where the thesis is wrong, plus a buffer', 'Exactly 1% away', 'Nowhere'], 1, 'Tie stops to structure.'),
        Q('Moving to break-even too early:', ['Has no drawback', 'Gets taken out by normal noise', 'Raises max risk', 'Slows execution'], 1, 'Price needs room.'),
        Q('A shallow retracement usually shows:', ['Weakness', 'Strength', 'A reversal', 'A range'], 1, 'Buyers step in early.'),
        Q('Dow secondary reactions typically retrace:', ['5–10%', '1/3 to 2/3', 'Exactly 61.8%', '>100%'], 1, 'One-third to two-thirds.'),
        Q('Best use of Fibonacci levels:', ['Buy at 61.8% automatically', 'Zones awaiting confirmation and confluence', 'Ignore them', 'Crypto only'], 1, 'Levels need confirmation.'),
        Q('A throwback offers:', ['Nothing', 'A tight-stop, low-risk entry', 'Guaranteed profit', 'A bearish reversal'], 1, 'The stop can sit just below the level.')
      ]
    }
  };

  /* ================= LESSON 6 ================= */
  C.lessons['l1-06'] = {
    vi: {
      goals: ['Tính được SMA, WMA, EMA và hiểu khác biệt.', 'Giải thích sự đánh đổi giữa độ trễ và độ mượt.', 'Áp dụng MA để xác định xu hướng, hỗ trợ/kháng cự động và tín hiệu giao cắt.', 'Hiểu dải bao (envelope), Bollinger Bands, Keltner Channel.', 'Nhận biết giới hạn của MA: whipsaw, hiệu ứng rơi dữ liệu, tối ưu quá mức.'],
      body: () => `
<h3>1. Ý tưởng</h3>
<p>Đường trung bình động (MA) làm <b>mượt</b> chuỗi giá để lộ ra xu hướng nằm bên dưới các dao động ngắn hạn. Đây là công cụ theo xu hướng phổ biến nhất, đồng thời là nền móng của nhiều chỉ báo khác (MACD, Bollinger, Keltner…).</p>
<h3>2. Ba cách tính</h3>
<table class="tbl"><thead><tr><th>Loại</th><th>Công thức</th><th>Đặc điểm</th></tr></thead><tbody>
<tr><td><b>SMA</b> (đơn giản)</td><td>(C₁ + C₂ + … + Cₙ) / n</td><td>Mọi giá có trọng số bằng nhau. Có "hiệu ứng rơi": khi một giá cũ bị loại khỏi cửa sổ, MA có thể đổi hướng dù giá hôm nay không đổi</td></tr>
<tr><td><b>WMA</b> (trọng số tuyến tính)</td><td>Σ (wᵢ × Cᵢ) / Σ wᵢ, với giá mới nhất có trọng số n, giá cũ nhất có trọng số 1</td><td>Phản ứng nhanh hơn SMA</td></tr>
<tr><td><b>EMA</b> (hàm mũ)</td><td>EMAₜ = α × Cₜ + (1 − α) × EMAₜ₋₁, với α = 2 / (n + 1)</td><td>Ưu tiên dữ liệu mới, giảm dần trọng số cũ nhưng không bao giờ loại bỏ hẳn, nên không có hiệu ứng rơi đột ngột</td></tr></tbody></table>
<div class="callout"><b>Ví dụ</b>: EMA 9 kỳ có α = 2/10 = 0.2. Nếu EMA hôm qua là 100 và giá đóng cửa hôm nay là 110 thì EMA hôm nay = 0.2 × 110 + 0.8 × 100 = <b>102</b>.</div>
<h3>3. Độ trễ và độ mượt</h3>
<p>MA càng dài thì càng mượt nhưng càng <b>trễ</b>. MA càng ngắn thì càng nhạy nhưng càng nhiều <b>tín hiệu sai</b>. Không có độ dài "đúng" cho mọi thị trường. Độ dài phổ biến: 10–20 (ngắn hạn), 50 (trung hạn), 100–200 (dài hạn). MA 200 ngày được rất nhiều tổ chức theo dõi như ranh giới thị trường tăng/giảm.</p>
${fg.maLag('vi')}
<h3>4. Bốn cách sử dụng MA</h3>
<ol><li><b>Xác định xu hướng</b>: hướng (độ dốc) của MA, và giá nằm trên hay dưới MA.</li>
<li><b>Hỗ trợ/kháng cự động</b>: trong xu hướng mạnh, giá thường điều chỉnh về MA rồi bật lại.</li>
<li><b>Giao cắt giá – MA</b>: giá cắt lên MA là tín hiệu mua, cắt xuống là tín hiệu bán. Đơn giản nhưng nhiều tín hiệu sai.</li>
<li><b>Giao cắt hai hoặc ba đường</b>: MA nhanh cắt lên MA chậm (ví dụ 50 cắt lên 200: <i>giao cắt vàng</i>), cắt xuống là <i>giao cắt tử thần</i>. Hệ ba đường (ví dụ 4–9–18) yêu cầu các đường xếp đúng thứ tự mới vào lệnh.</li></ol>
${fg.cross('vi')}
<p>Biến thể: <b>MA dịch chuyển (displaced)</b>, tức là dời MA về phía trước vài kỳ để giảm tín hiệu sai. Hoặc dùng MA của giá cao nhất và giá thấp nhất để tạo một "dải" thay vì một đường.</p>
<h3>5. Dải bao, Bollinger và Keltner</h3>
<ul><li><b>Envelope</b>: MA ± một tỷ lệ % cố định. Giá chạm dải ngoài là vùng quá mức, hoặc là dấu hiệu xu hướng mạnh khi giá bám dải.</li>
<li><b>Bollinger Bands</b>: SMA 20 ± 2 độ lệch chuẩn. Dải tự co giãn theo biến động. Khi dải co hẹp (squeeze), biến động thấp thường đi trước một đợt biến động mạnh.</li>
<li><b>Keltner Channel</b>: EMA ± k × ATR. Mượt hơn Bollinger.</li></ul>
${C.demoHtml.maDemo()}
<h3>6. Giới hạn</h3>
<ul><li><b>Whipsaw trong đi ngang</b>: MA là công cụ theo xu hướng, nên hoạt động kém khi không có xu hướng.</li>
<li><b>Độ trễ</b>: luôn vào sau, ra sau. Đó là cái giá của sự xác nhận.</li>
<li><b>Tối ưu quá mức</b>: chọn độ dài "hoàn hảo" cho dữ liệu quá khứ thường không lặp lại trong tương lai (sẽ học ở Phần VII).</li></ul>`,
      keys: ['MA làm mượt giá để lộ xu hướng; MA dài mượt nhưng trễ, MA ngắn nhạy nhưng nhiễu.', 'SMA trọng số bằng nhau (có hiệu ứng rơi), WMA tuyến tính, EMA với α = 2/(n+1).', 'Bốn cách dùng: xu hướng (độ dốc/vị trí), hỗ trợ–kháng cự động, giao cắt giá–MA, giao cắt nhiều MA.', 'Giao cắt vàng/tử thần: MA nhanh cắt lên/xuống MA chậm (ví dụ 50/200).', 'Envelope (%), Bollinger (±2σ, co giãn theo biến động), Keltner (±ATR).', 'Giới hạn: whipsaw khi đi ngang, độ trễ, tối ưu quá mức.'],
      terms: [['SMA / WMA / EMA', 'Trung bình đơn giản / trọng số / hàm mũ'], ['Lag', 'Độ trễ'], ['Drop-off effect', 'Hiệu ứng rơi dữ liệu cũ khỏi cửa sổ'], ['Golden / Death cross', 'Giao cắt vàng / tử thần'], ['Envelope', 'Dải bao theo %'], ['Bollinger Bands', 'Dải ±2 độ lệch chuẩn'], ['Squeeze', 'Dải co hẹp — biến động thấp']],
      quiz: [
        Q('EMA 9 kỳ có hệ số α bằng:', ['0.1', '0.2', '0.9', '2'], 1, 'α = 2/(n+1) = 2/10 = 0.2.'),
        Q('EMA hôm qua = 50, giá hôm nay = 60, α = 0.2. EMA hôm nay là:', ['52', '55', '58', '60'], 0, '0.2×60 + 0.8×50 = 12 + 40 = 52.'),
        Q('"Hiệu ứng rơi" (drop-off) đặc trưng cho loại MA nào?', ['EMA', 'SMA', 'Không loại nào', 'Mọi MA như nhau'], 1, 'SMA đột ngột loại bỏ giá cũ khỏi cửa sổ nên có thể đổi hướng dù giá hiện tại không đổi.'),
        Q('Đánh đổi chính khi kéo dài chu kỳ MA là:', ['Nhạy hơn, nhiều nhiễu hơn', 'Mượt hơn nhưng trễ hơn', 'Không thay đổi gì', 'Chính xác tuyệt đối'], 1, 'Độ mượt luôn đi kèm độ trễ.'),
        Q('Giao cắt vàng xảy ra khi:', ['MA chậm cắt lên MA nhanh', 'MA nhanh cắt lên MA chậm', 'Giá chạm dải Bollinger trên', 'Khối lượng tăng'], 1, 'Ví dụ MA50 cắt lên MA200.'),
        Q('Bollinger Bands co hẹp (squeeze) thường báo hiệu:', ['Xu hướng mạnh đang diễn ra', 'Biến động thấp, có thể sắp bùng nổ', 'Đảo chiều chắc chắn', 'Hết thanh khoản vĩnh viễn'], 1, 'Biến động có tính chu kỳ: co hẹp thường đi trước mở rộng.'),
        Q('Hệ thống giao cắt MA hoạt động kém nhất khi:', ['Xu hướng mạnh', 'Thị trường đi ngang', 'Khối lượng cao', 'Biến động thấp kéo dài trong xu hướng'], 1, 'Không có xu hướng gây whipsaw liên tục.'),
        Q('Keltner Channel khác Bollinger ở điểm:', ['Dùng ATR thay vì độ lệch chuẩn', 'Không có đường giữa', 'Chỉ dùng cho tuần', 'Dùng khối lượng'], 0, 'Keltner = EMA ± k×ATR.')
      ]
    },
    en: {
      goals: ['Compute SMA, WMA and EMA.', 'Explain the lag–smoothness trade-off.', 'Use MAs for trend, dynamic S/R and crossovers.', 'Understand envelopes, Bollinger Bands and Keltner Channels.', 'Recognise MA limitations.'],
      body: () => `
<h3>1. Idea</h3><p>A moving average smooths price to reveal the underlying trend and underpins many indicators.</p>
<h3>2. Calculations</h3><table class="tbl"><tbody><tr><td><b>SMA</b></td><td>(C₁+…+Cₙ)/n — equal weights; drop-off effect</td></tr><tr><td><b>WMA</b></td><td>Linearly heavier weights on recent data</td></tr><tr><td><b>EMA</b></td><td>α·Cₜ + (1−α)·EMAₜ₋₁, α = 2/(n+1); no abrupt drop-off</td></tr></tbody></table>
<div class="callout">EMA(9): α = 0.2. Yesterday 100, close 110 → 0.2×110 + 0.8×100 = <b>102</b>.</div>
<h3>3. Lag vs smoothness</h3><p>Longer = smoother but later; shorter = faster but noisier. Common lengths 10–20, 50, 100–200; the 200-day is widely watched.</p>${fg.maLag('en')}
<h3>4. Four uses</h3><ol><li>Trend: slope and price position.</li><li>Dynamic support/resistance.</li><li>Price–MA crossovers.</li><li>Two/three-MA crossovers (golden / death cross; 4–9–18).</li></ol>${fg.cross('en')}<p>Variants: displaced MAs, high/low MA bands.</p>
<h3>5. Envelopes and bands</h3><ul><li><b>Envelope</b>: MA ± fixed %.</li><li><b>Bollinger</b>: SMA20 ± 2σ; a squeeze often precedes expansion.</li><li><b>Keltner</b>: EMA ± k·ATR.</li></ul>${C.demoHtml.maDemo()}
<h3>6. Limits</h3><ul><li>Whipsaws in ranges.</li><li>Lag.</li><li>Over-optimisation.</li></ul>`,
      keys: ['MAs reveal trend; longer = smoother/later.', 'SMA (drop-off), WMA, EMA (α = 2/(n+1)).', 'Uses: trend, dynamic S/R, price crossovers, MA crossovers.', 'Golden/death cross = fast crossing slow.', 'Envelope, Bollinger (±2σ), Keltner (±ATR).', 'Limits: whipsaw, lag, over-fitting.'],
      terms: [['Lag', 'Delay versus price'], ['Drop-off effect', 'Old data leaving an SMA window'], ['Squeeze', 'Narrow Bollinger Bands']],
      quiz: [
        Q('α for a 9-period EMA:', ['0.1', '0.2', '0.9', '2'], 1, '2/(9+1).'),
        Q('EMA 50, close 60, α 0.2 → EMA:', ['52', '55', '58', '60'], 0, '12 + 40.'),
        Q('The drop-off effect belongs to:', ['EMA', 'SMA', 'None', 'All equally'], 1, 'Old data leaves the SMA window abruptly.'),
        Q('Lengthening an MA makes it:', ['Faster, noisier', 'Smoother, later', 'Unchanged', 'Perfect'], 1, 'Smoothness costs lag.'),
        Q('A golden cross is:', ['Slow crossing above fast', 'Fast crossing above slow', 'Touching the upper band', 'Rising volume'], 1, 'e.g. 50 above 200.'),
        Q('A Bollinger squeeze suggests:', ['A strong trend now', 'Low volatility that may expand', 'Certain reversal', 'No liquidity'], 1, 'Volatility cycles.'),
        Q('MA crossovers perform worst in:', ['Strong trends', 'Sideways markets', 'High volume', 'Quiet trends'], 1, 'Whipsaws.'),
        Q('Keltner differs from Bollinger by using:', ['ATR instead of σ', 'No midline', 'Weekly only', 'Volume'], 0, 'EMA ± k·ATR.')
      ]
    }
  };

  /* ================= LESSON 7 ================= */
  C.lessons['l1-07'] = {
    vi: {
      goals: ['Phân biệt mẫu hình đảo chiều và mẫu hình tiếp diễn.', 'Nêu các điều kiện chung để một mẫu hình có giá trị.', 'Nhận diện và đo mục tiêu cho: hai/ba đỉnh–đáy, vai–đầu–vai, hình chữ nhật, tam giác, nêm, cờ, cờ đuôi nheo.', 'Hiểu vai trò khối lượng và pullback/throwback trong mẫu hình.', 'Hiểu giá trị của một mẫu hình thất bại.'],
      body: () => `
<h3>1. Mẫu hình giá là gì?</h3>
<p>Mẫu hình là những hình dạng lặp lại trên biểu đồ, phản ánh cuộc giằng co giữa bên mua và bên bán trong một vùng giá. Có hai nhóm:</p>
<ul><li><b>Mẫu hình đảo chiều</b>: báo hiệu xu hướng trước đó kết thúc (vai–đầu–vai, hai/ba đỉnh–đáy, đáy tròn…).</li>
<li><b>Mẫu hình tiếp diễn</b>: một nhịp nghỉ trước khi xu hướng chạy tiếp (cờ, cờ đuôi nheo, nhiều dạng tam giác và hình chữ nhật).</li></ul>
<p>Thực tế, nhiều mẫu hình (đặc biệt tam giác và hình chữ nhật) có thể phá vỡ theo <b>cả hai hướng</b>. Vì vậy luôn chờ <b>phá vỡ xác nhận</b> trước khi kết luận.</p>
<h3>2. Điều kiện chung</h3>
<ol><li><b>Phải có xu hướng trước đó</b> để đảo chiều hoặc tiếp diễn. Mẫu hình đảo chiều mà không có gì để đảo thì vô nghĩa.</li>
<li><b>Kích thước và thời gian</b>: mẫu hình càng lớn và càng lâu thì nước đi sau phá vỡ càng có ý nghĩa.</li>
<li><b>Khối lượng</b>: thường giảm dần trong quá trình hình thành và <b>tăng mạnh khi phá vỡ</b>, nhất là phá vỡ đi lên.</li>
<li><b>Phá vỡ xác nhận</b>: dùng bộ lọc như ở Bài 5. Chưa phá vỡ thì mẫu hình chưa hoàn thành.</li>
<li><b>Mục tiêu đo (measured move)</b>: thường bằng chiều cao mẫu hình, đo từ điểm phá vỡ. Đây là mục tiêu tối thiểu mang tính tham khảo.</li></ol>
<h3>3. Vai–đầu–vai (Head and Shoulders)</h3>
<p>Mẫu hình đảo chiều nổi tiếng nhất. Ở đỉnh: vai trái → đầu (đỉnh cao nhất) → vai phải (thấp hơn đầu). Hai đáy giữa các đỉnh nối thành <b>đường viền cổ (neckline)</b>. Khối lượng thường giảm dần từ vai trái sang vai phải: cầu yếu dần. Mẫu hình hoàn thành khi giá đóng cửa thủng đường viền cổ. Mục tiêu ≈ khoảng cách từ đầu đến đường viền cổ, đo xuống từ điểm phá vỡ. Sau phá vỡ thường có nhịp pullback về đường viền cổ.</p>
${fg.hs('vi')}
<p><b>Vai–đầu–vai ngược</b> (ở đáy) là hình ảnh đối xứng: báo hiệu đảo chiều tăng. Riêng phá vỡ đi lên cần khối lượng tăng rõ rệt.</p>
<h3>4. Hai đỉnh/đáy, ba đỉnh/đáy, hình chữ nhật</h3>
<p><b>Hai đỉnh (double top)</b>: hai đỉnh xấp xỉ bằng nhau, cách nhau một khoảng thời gian đáng kể. Mẫu hình chỉ hoàn thành khi giá thủng <b>đáy giữa hai đỉnh</b>. Ba đỉnh tương tự nhưng có ba lần thất bại. Hình chữ nhật là vùng đi ngang giữa hai đường song song nằm ngang; có thể là tích lũy hoặc phân phối, hãy liên hệ Wyckoff.</p>
${F.row(fg.dbl('vi'), fg.rect('vi'))}
<h3>5. Tam giác</h3>
<ul><li><b>Tam giác cân</b>: đỉnh thấp dần, đáy cao dần; thể hiện sự do dự. Thường phá vỡ theo xu hướng trước đó, nhưng không chắc chắn.</li>
<li><b>Tam giác tăng</b>: cạnh trên nằm ngang, đáy cao dần; người mua ngày càng sốt ruột. Thiên hướng phá lên.</li>
<li><b>Tam giác giảm</b>: cạnh dưới nằm ngang, đỉnh thấp dần. Thiên hướng phá xuống.</li></ul>
<p>Phá vỡ đáng tin thường xảy ra trước khi giá đi tới khoảng 3/4 chiều dài tam giác. Nếu giá trôi tới sát đỉnh tam giác mới phá thì tín hiệu yếu. Mục tiêu: chiều cao phần rộng nhất, đo từ điểm phá vỡ.</p>
${F.row(fg.tri('vi', 'sym'), fg.tri('vi', 'asc'), fg.tri('vi', 'desc'))}
<h3>6. Nêm, cờ và cờ đuôi nheo</h3>
<ul><li><b>Nêm</b>: hai đường hội tụ cùng dốc lên (nêm tăng, thường phá xuống) hoặc cùng dốc xuống (nêm giảm, thường phá lên).</li>
<li><b>Cờ (flag)</b> và <b>cờ đuôi nheo (pennant)</b>: nhịp nghỉ ngắn, dốc nhẹ ngược hướng, sau một <b>cột cờ</b> là nhịp tăng/giảm rất mạnh. Được gọi là mẫu hình "nửa cột cờ" vì thường xuất hiện ở giữa nước đi: mục tiêu ≈ chiều dài cột cờ, đo từ điểm phá vỡ. Khối lượng cạn trong lá cờ, bùng lên khi phá vỡ.</li></ul>
${F.row(fg.wedge('vi'), fg.flag('vi'))}
<h3>7. Các mẫu hình khác và mẫu hình thất bại</h3>
<p>Ngoài ra còn: đáy/đỉnh tròn (saucer), cốc và tay cầm, hình mở rộng (broadening, biến động tăng dần, thường xuất hiện ở đỉnh), kim cương… Đặc biệt quan trọng: <b>mẫu hình thất bại</b>. Khi giá phá vỡ rồi quay ngược lại vượt phía bên kia mẫu hình, những người vào lệnh theo phá vỡ bị kẹt. Nước đi ngược chiều sau đó thường mạnh. Một mẫu hình thất bại chính là một tín hiệu.</p>
<div class="callout">Ghi nhớ: <b>bối cảnh quan trọng hơn hình dạng</b>. Một mẫu hình đảo chiều tăng ở vùng hỗ trợ lớn, trong thị trường chung đang tích lũy, đáng tin hơn nhiều so với cùng hình dạng đó ở giữa xu hướng giảm.</div>`,
      keys: ['Hai nhóm: đảo chiều và tiếp diễn; luôn chờ phá vỡ xác nhận vì nhiều mẫu hình có thể phá theo cả hai hướng.', 'Điều kiện: có xu hướng trước đó, kích thước/thời gian đủ, khối lượng (cạn khi hình thành, tăng khi phá), phá vỡ xác nhận.', 'Mục tiêu đo ≈ chiều cao mẫu hình (hoặc cột cờ) tính từ điểm phá vỡ — mục tiêu tối thiểu.', 'Vai–đầu–vai hoàn thành khi thủng đường viền cổ; hai đỉnh hoàn thành khi thủng đáy giữa.', 'Tam giác tăng thiên lên, tam giác giảm thiên xuống; phá vỡ trước 3/4 chiều dài đáng tin hơn.', 'Mẫu hình thất bại là tín hiệu mạnh theo chiều ngược lại; bối cảnh quan trọng hơn hình dạng.'],
      terms: [['Reversal / Continuation pattern', 'Mẫu hình đảo chiều / tiếp diễn'], ['Neckline', 'Đường viền cổ'], ['Measured move', 'Mục tiêu đo'], ['Double / Triple top', 'Hai / ba đỉnh'], ['Symmetrical / Ascending / Descending triangle', 'Tam giác cân / tăng / giảm'], ['Wedge', 'Nêm'], ['Flag / Pennant', 'Cờ / cờ đuôi nheo'], ['Failed pattern', 'Mẫu hình thất bại']],
      quiz: [
        Q('Mẫu hình vai–đầu–vai đỉnh hoàn thành khi:', ['Hình thành vai phải', 'Giá đóng cửa thủng đường viền cổ', 'Khối lượng tăng ở đầu', 'Giá chạm đỉnh đầu lần hai'], 1, 'Chưa thủng đường viền cổ thì mẫu hình chưa hoàn thành.'),
        Q('Đầu cao hơn đường viền cổ 20 điểm, đường viền cổ ở 100. Mục tiêu tối thiểu sau phá vỡ là khoảng:', ['120', '100', '80', '60'], 2, '100 − 20 = 80.'),
        Q('Tam giác tăng có đặc điểm:', ['Cạnh dưới nằm ngang, đỉnh thấp dần', 'Cạnh trên nằm ngang, đáy cao dần', 'Hai cạnh cùng dốc lên', 'Biên độ mở rộng'], 1, 'Người mua ngày càng sốt ruột; thiên hướng phá lên.'),
        Q('Khối lượng điển hình trong quá trình hình thành mẫu hình là:', ['Tăng dần', 'Giảm dần, tăng mạnh khi phá vỡ', 'Không đổi', 'Không quan trọng'], 1, 'Sự do dự làm khối lượng cạn; quyết định làm khối lượng bùng lên.'),
        Q('Cờ và cờ đuôi nheo được gọi là mẫu hình "nửa cột cờ" vì:', ['Luôn ở đỉnh', 'Thường xuất hiện ở giữa nước đi — mục tiêu ≈ chiều dài cột cờ', 'Chỉ dài nửa ngày', 'Không có cột cờ'], 1, 'Nước đi sau phá vỡ thường bằng nước đi trước lá cờ.'),
        Q('Nêm tăng thường:', ['Phá lên', 'Phá xuống', 'Không bao giờ phá', 'Là mẫu hình tiếp diễn tăng'], 1, 'Lực tăng yếu dần trong biên hội tụ dốc lên.'),
        Q('Mẫu hình hai đỉnh chỉ được xác nhận khi:', ['Đỉnh thứ hai hình thành', 'Giá thủng đáy giữa hai đỉnh', 'Khối lượng giảm', 'Giá tăng vượt đỉnh'], 1, 'Trước đó chỉ là một nhịp điều chỉnh trong xu hướng tăng.'),
        Q('Một mẫu hình phá vỡ rồi quay ngược và vượt phía bên kia thường:', ['Vô nghĩa', 'Là tín hiệu mạnh theo chiều ngược lại', 'Báo hiệu đi ngang', 'Cần xoá khỏi biểu đồ'], 1, 'Người vào theo phá vỡ bị kẹt, tạo lực đẩy chiều ngược lại.')
      ]
    },
    en: {
      goals: ['Distinguish reversal and continuation patterns.', 'State conditions for valid patterns.', 'Recognise and measure double/triple tops, head-and-shoulders, rectangles, triangles, wedges, flags and pennants.', 'Understand volume and pullbacks.', 'Value failed patterns.'],
      body: () => `
<h3>1. Patterns</h3><p>Recurring shapes reflecting the buyer–seller struggle: <b>reversal</b> patterns and <b>continuation</b> patterns. Many can break either way — wait for confirmation.</p>
<h3>2. Conditions</h3><ol><li>A prior trend.</li><li>Size and duration.</li><li>Volume: drying up during formation, expanding on breakout.</li><li>A confirmed breakout.</li><li>Measured move ≈ pattern height from the breakout (minimum target).</li></ol>
<h3>3. Head and shoulders</h3><p>Left shoulder → head → lower right shoulder; the troughs form the <b>neckline</b>. Completed on a close through the neckline; target ≈ head-to-neckline distance; pullbacks to the neckline are common. The inverse form marks bottoms.</p>${fg.hs('en')}
<h3>4. Double/triple tops and rectangles</h3><p>A double top completes only when the middle trough breaks. Rectangles may be accumulation or distribution (see Wyckoff).</p>${F.row(fg.dbl('en'), fg.rect('en'))}
<h3>5. Triangles</h3><p>Symmetrical (indecision), ascending (bullish bias), descending (bearish bias). Breakouts before ~3/4 of the way to the apex are more reliable; target = widest height.</p>${F.row(fg.tri('en', 'sym'), fg.tri('en', 'asc'), fg.tri('en', 'desc'))}
<h3>6. Wedges, flags, pennants</h3><p>Rising wedges tend to break down, falling wedges up. Flags and pennants are short counter-trend pauses after a sharp <b>pole</b> — "half-mast" patterns: target ≈ pole length from the breakout.</p>${F.row(fg.wedge('en'), fg.flag('en'))}
<h3>7. Others and failures</h3><p>Saucers, cup-and-handle, broadening formations, diamonds. A <b>failed pattern</b> traps breakout traders and often produces a strong opposite move.</p><div class="callout"><b>Context beats shape.</b></div>`,
      keys: ['Reversal vs continuation; wait for confirmation.', 'Prior trend, size, volume, confirmed break.', 'Measured move ≈ height (or pole) from the breakout.', 'H&S completes at the neckline; double top at the middle trough.', 'Ascending triangles lean up, descending down; break before 3/4.', 'Failed patterns are strong opposite signals; context beats shape.'],
      terms: [['Neckline', 'H&S trough line'], ['Measured move', 'Height-based target'], ['Half-mast pattern', 'Flag/pennant midway in a move'], ['Failed pattern', 'Breakout that reverses']],
      quiz: [
        Q('An H&S top completes when:', ['The right shoulder forms', 'Price closes through the neckline', 'Volume rises at the head', 'Price retests the head'], 1, 'Until then it is incomplete.'),
        Q('Head 20 points above a neckline at 100. Minimum target:', ['120', '100', '80', '60'], 2, '100 − 20.'),
        Q('An ascending triangle has:', ['Flat bottom, falling highs', 'Flat top, rising lows', 'Both lines rising', 'Expanding range'], 1, 'Bullish bias.'),
        Q('Volume during formation typically:', ['Rises', 'Falls, then expands on breakout', 'Is flat', 'Is irrelevant'], 1, 'Indecision then decision.'),
        Q('Flags are "half-mast" patterns because:', ['They form at tops', 'They appear midway; target ≈ pole', 'They last half a day', 'They lack a pole'], 1, 'The move after equals the move before.'),
        Q('A rising wedge usually:', ['Breaks up', 'Breaks down', 'Never breaks', 'Is bullish continuation'], 1, 'Waning upside force.'),
        Q('A double top is confirmed when:', ['The second top forms', 'The middle trough breaks', 'Volume falls', 'Price exceeds the tops'], 1, 'Before that it is just a correction.'),
        Q('A breakout that reverses through the other side:', ['Is meaningless', 'Is a strong opposite signal', 'Means sideways', 'Should be ignored'], 1, 'Trapped traders fuel the reversal.')
      ]
    }
  };
})(window.LLW);
