// © 2026 Lai Long Master TA. Bảo lưu mọi quyền. Không sao chép, chỉnh sửa hay dùng lại khi chưa được phép.
/* CMT Level 1 — Part III, lessons 12–16: Elliott waves, market strength, cycles. Written by Lai Long Master TA in its own words. */
(function (L) {
  'use strict';
  const C = L.cmt, F = C.fig;
  const T = (lang, vi, en) => (lang === 'en' ? en : vi);
  const Q = (q, o, a, e) => ({ q, o, a, e });
  const css = C.css;
  const ld = () => `<span class="spinner"></span>${L.t('loading')}`;

  /* ---------- figures ---------- */
  const fg = {
    eight: lg => F.line({ h: 270,
      series: [{ pts: [[0, 10], [14, 40], [22, 28], [44, 78], [54, 58], [66, 86], [76, 64], [84, 76], [100, 44]] }],
      labels: [[0, 10, '0', 'b'], [14, 40, '1', 't'], [22, 28, '2', 'b'], [44, 78, '3', 't'], [54, 58, '4', 'b'], [66, 86, '5', 't'], [76, 64, 'A', 'b'], [84, 76, 'B', 't'], [100, 44, 'C', 'l']],
      zones: [[0, 66, T(lg, 'Sóng đẩy 1-2-3-4-5', 'Motive 1-2-3-4-5'), 'z-b'], [66, 100, T(lg, 'Điều chỉnh A-B-C', 'Corrective A-B-C'), 'z-a']],
      caption: T(lg, 'Chu kỳ Elliott cơ bản: 5 sóng theo xu hướng + 3 sóng điều chỉnh', 'The basic Elliott cycle: five waves with the trend, three against') }),
    fractal: lg => F.line({ h: 260,
      series: [{ pts: [[0, 10], [5, 22], [8, 17], [14, 34], [17, 30], [22, 42], [27, 30], [31, 36], [34, 32], [38, 50], [41, 45], [47, 66], [51, 59], [56, 76], [60, 70], [64, 82], [70, 66], [74, 72], [77, 68], [82, 86], [86, 80], [90, 92], [100, 70]] }],
      labels: [[22, 42, '(1)', 't'], [34, 32, '(2)', 'b'], [64, 82, '(3)', 't'], [77, 68, '(4)', 'b'], [90, 92, '(5)', 't'], [5, 22, 'i', 't'], [8, 17, 'ii', 'b'], [14, 34, 'iii', 't'], [17, 30, 'iv', 'b']],
      caption: T(lg, 'Tính phân dạng: sóng (1) lớn lại gồm 5 sóng nhỏ i-ii-iii-iv-v', 'Fractal: wave (1) itself subdivides into i-ii-iii-iv-v') }),
    corr: lg => F.row(
      F.line({ w: 240, h: 190, series: [{ pts: [[0, 85], [35, 35], [55, 60], [100, 12]] }], labels: [[35, 35, 'A', 'b'], [55, 60, 'B', 't'], [100, 12, 'C', 'l']], caption: T(lg, 'Zigzag (5-3-5): dốc, sắc', 'Zigzag (5-3-5): sharp') }),
      F.line({ w: 240, h: 190, series: [{ pts: [[0, 80], [30, 40], [60, 82], [100, 38]] }], labels: [[30, 40, 'A', 'b'], [60, 82, 'B', 't'], [100, 38, 'C', 'l']], caption: T(lg, 'Flat (3-3-5): đi ngang', 'Flat (3-3-5): sideways') }),
      F.line({ w: 240, h: 190, series: [{ pts: [[0, 50], [15, 85], [30, 25], [45, 72], [60, 36], [75, 62], [88, 44], [100, 55]] }], labels: [[30, 25, 'a', 'b'], [45, 72, 'b', 't'], [60, 36, 'c', 'b'], [75, 62, 'd', 't'], [88, 44, 'e', 'b']], caption: T(lg, 'Tam giác (3-3-3-3-3): hội tụ', 'Triangle (3-3-3-3-3): contracting') })),
    ad: lg => F.line({ h: 250, series: [{ pts: [[0, 30], [25, 55], [40, 48], [65, 85], [80, 70], [100, 90]] }, { pts: [[0, 22], [25, 50], [40, 42], [65, 58], [80, 40], [100, 44]], cls: 's-price2' }],
      labels: [[65, 85, T(lg, 'Chỉ số: đỉnh mới', 'Index: new high'), 't'], [65, 58, T(lg, 'Đường A/D: đỉnh thấp hơn', 'A/D line: lower high'), 'b']],
      caption: T(lg, 'Phân kỳ độ rộng: chỉ số tăng nhờ ít cổ phiếu lớn trong khi đa số cổ phiếu đã yếu đi', 'Breadth divergence: the index rises on a few large stocks while most stocks weaken') }),
    cycle: lg => {
      // two cycles (troughs at 0, 50, 100); crest at 32 of 50 units = right-translated, plus a rising trend
      const p = [], val = x => {
        const c = x % 50, k = Math.floor(x / 50), base = 20 + k * 14;
        return c <= 32 ? base + 45 * (1 - Math.cos(Math.PI * c / 32)) / 2 : base + 14 + (45 - 14) * (1 + Math.cos(Math.PI * (c - 32) / 18)) / 2;
      };
      for (let x = 0; x <= 100; x += 1) p.push([x, x === 100 ? 48 : val(x)]);
      return F.line({ h: 230, vl: [[25, T(lg, 'giữa chu kỳ', 'midpoint')], [75, '']], series: [{ pts: p }],
        labels: [[0, val(0), T(lg, 'đáy', 'trough'), 'b'], [50, val(50), T(lg, 'đáy', 'trough'), 'b'], [100, 48, T(lg, 'đáy', 'trough'), 'l'], [32, val(32), T(lg, 'đỉnh lệch phải', 'right-translated crest'), 't'], [82, val(82), T(lg, 'đỉnh lệch phải', 'right-translated crest'), 't']],
        caption: T(lg, 'Chu kỳ đo từ đáy đến đáy. Trong xu hướng tăng, đỉnh nằm sau điểm giữa chu kỳ (lệch phải) và đáy sau cao hơn đáy trước', 'Cycles run trough to trough. In an uptrend the crest falls after the midpoint (right translation) and each trough is higher') });
    },
    harmonics: lg => {
      const a = [], b = [], c = [];
      for (let x = 0; x <= 100; x += 1) { const t = x / 100 * 2 * Math.PI; a.push([x, 50 + 25 * Math.sin(t - Math.PI / 2)]); b.push([x, 50 + 12 * Math.sin(2 * t - Math.PI / 2)]); c.push([x, 50 + 25 * Math.sin(t - Math.PI / 2) + 12 * Math.sin(2 * t - Math.PI / 2)]); }
      return F.line({ h: 230, series: [{ pts: a, cls: 's-trend2' }, { pts: b, cls: 's-price2' }, { pts: c }],
        caption: T(lg, 'Nguyên lý tổng hợp và hài hoà: chu kỳ dài (nét đứt) + chu kỳ bằng một nửa (xanh) = đường giá (trắng)', 'Summation and harmonicity: long cycle (dashed) + half-length cycle (green) = price (white)') });
    }
  };

  /* ---------- demos ---------- */
  const go = () => `<button class="btn primary d-go">${L.T('Xem', 'Show')}</button>`;
  C.demoHtml.waves = () => C.demoShell('waves', C.symControls('vn_stock', 'VNINDEX', '1W', ['1W', '1D']) + C.mkSel('d-zz', [['4', '4 ATR'], ['3', '3 ATR'], ['6', '6 ATR']], '4') + go(),
    L.T('Máy đánh số các sóng (zigzag) kể từ đáy quan trọng nhất và kiểm tra 3 quy tắc bất biến cho cách đếm 5 sóng giả định. Đây là bài tập, không phải cách đếm "chuẩn".', 'Swings counted from the major low, testing the three inviolable rules for a hypothetical five-wave count. An exercise, not the "correct" count.'));
  C.demoRun.waves = box => {
    const out = box.querySelector('.demo-out'), el = box.querySelector('.demo-chart');
    C.wire(box, async () => {
      out.innerHTML = ld();
      try {
        const bars = await C.loadBars(...C.readSym(box));
        const piv = L.ind.zigzag(bars, +box.querySelector('.d-zz').value).filter(p => !p.provisional);
        let start = 0; // lowest low pivot in the second half → wave 0
        const lows = piv.map((p, k) => [p, k]).filter(([p]) => p.type === 'L');
        if (lows.length) start = lows.slice(0, Math.max(1, lows.length - 2)).reduce((m, x) => (x[0].p < m[0].p ? x : m))[1];
        const seq = piv.slice(start, start + 6);
        el.innerHTML = '';
        const ch = C.mkChart(el), s = C.candleSeries(ch);
        s.setData(bars.map(b => ({ time: b.t, open: b.o, high: b.h, low: b.l, close: b.c })));
        const names = ['0', '1', '2', '3', '4', '5'];
        s.setMarkers(seq.map((p, k) => ({ time: bars[p.i].t, position: p.type === 'H' ? 'aboveBar' : 'belowBar', color: css('--accent'), shape: 'circle', text: names[k] })));
        ch.addLineSeries({ color: css('--accent'), lineWidth: 2, priceLineVisible: false, lastValueVisible: false }).setData(seq.map(p => ({ time: bars[p.i].t, value: p.p })));
        ch.timeScale().fitContent();
        if (seq.length < 6) { out.innerHTML = L.T(`Mới có ${seq.length - 1} sóng kể từ đáy — cấu trúc 5 sóng chưa hoàn tất.`, `Only ${seq.length - 1} swings since the low — five waves not complete.`); return; }
        const w = k => Math.abs(seq[k].p - seq[k - 1].p);
        const r1 = seq[2].p > seq[0].p, r2 = !(w(3) < w(1) && w(3) < w(5)), r3 = seq[4].p > seq[1].p;
        const ok = v => v ? '<b class="up">✓</b>' : '<b class="down">✗</b>';
        out.innerHTML = L.T(`Quy tắc 1 — sóng 2 không thoái lui quá điểm đầu sóng 1: ${ok(r1)} · Quy tắc 2 — sóng 3 không phải sóng ngắn nhất: ${ok(r2)} · Quy tắc 3 — sóng 4 không chồng lấn vùng giá sóng 1: ${ok(r3)}. ${r1 && r2 && r3 ? 'Cách đếm giả định hợp lệ.' : 'Cách đếm giả định vi phạm quy tắc → phải đếm lại (có thể là sóng điều chỉnh, hoặc đang ở cấp sóng khác).'}`,
          `Rule 1 — wave 2 never retraces beyond the start of wave 1: ${ok(r1)} · Rule 2 — wave 3 is never the shortest: ${ok(r2)} · Rule 3 — wave 4 does not overlap wave 1: ${ok(r3)}. ${r1 && r2 && r3 ? 'The hypothetical count is valid.' : 'The count breaks a rule → recount (it may be corrective, or a different degree).'}`);
      } catch (e) { C.err(out, e); }
    });
  };

  C.demoHtml.cycles = () => C.demoShell('cycles', C.symControls('vn_stock', 'VNINDEX', '1D', ['1D', '1W']) + go(),
    L.T('Máy tìm các đáy quan trọng (zigzag 3 ATR), đo khoảng cách đáy–đáy và ước lượng thời điểm đáy chu kỳ tiếp theo.', 'Major troughs (3-ATR zigzag), trough-to-trough spacing and an estimate of the next cycle low.'));
  C.demoRun.cycles = box => {
    const out = box.querySelector('.demo-out'), el = box.querySelector('.demo-chart');
    C.wire(box, async () => {
      out.innerHTML = ld();
      try {
        const [mk, sym, tf] = C.readSym(box);
        const bars = (await C.loadBars(mk, sym, tf)).slice(-500);
        const lows = L.ind.zigzag(bars, 3).filter(p => p.type === 'L' && !p.provisional);
        const gaps = lows.slice(1).map((p, k) => p.i - lows[k].i);
        el.innerHTML = '';
        const ch = C.mkChart(el), s = C.candleSeries(ch);
        s.setData(bars.map(b => ({ time: b.t, open: b.o, high: b.h, low: b.l, close: b.c })));
        s.setMarkers(lows.map((p, k) => ({ time: bars[p.i].t, position: 'belowBar', color: css('--accent'), shape: 'arrowUp', text: k ? String(gaps[k - 1]) : 'T' })));
        ch.timeScale().fitContent();
        if (gaps.length < 2) { out.innerHTML = L.T('Chưa đủ đáy để đo chu kỳ.', 'Not enough troughs.'); return; }
        const med = L.ind.median(gaps), mean = gaps.reduce((a, b) => a + b, 0) / gaps.length;
        const sd = Math.sqrt(gaps.reduce((a, g) => a + (g - mean) ** 2, 0) / gaps.length);
        const since = bars.length - 1 - lows[lows.length - 1].i;
        out.innerHTML = L.T(`Khoảng cách đáy–đáy (nến): ${gaps.join(', ')}. Trung vị ≈ <b>${med}</b> nến, độ lệch chuẩn ≈ ${sd.toFixed(1)}. Đáy gần nhất cách đây ${since} nến → đáy chu kỳ kế tiếp dự kiến trong khoảng <b>${Math.max(0, Math.round(med - sd - since))}–${Math.round(med + sd - since)}</b> nến tới (vùng thời gian, không phải ngày chính xác). Độ lệch chuẩn lớn = chu kỳ không ổn định.`,
          `Trough spacing (bars): ${gaps.join(', ')}. Median ≈ <b>${med}</b>, st.dev ≈ ${sd.toFixed(1)}. Last trough ${since} bars ago → next cycle low expected in about <b>${Math.max(0, Math.round(med - sd - since))}–${Math.round(med + sd - since)}</b> bars (a window, not a date). A large deviation means an unstable cycle.`);
      } catch (e) { C.err(out, e); }
    });
  };

  /* ================= LESSON 12 ================= */
  C.lessons['l1-12'] = {
    vi: {
      goals: ['Nêu nguồn gốc và ý tưởng cốt lõi của Nguyên lý Sóng Elliott.', 'Mô tả mô hình cơ bản 5–3 và tính phân dạng của sóng.', 'Phân biệt sóng đẩy (motive) và sóng điều chỉnh (corrective).', 'Nêu các cấp độ sóng và cách ký hiệu.', 'Hiểu đặc tính tâm lý điển hình của từng sóng.'],
      body: () => `
<h3>1. Nguồn gốc và ý tưởng</h3>
<p><b>Ralph Nelson Elliott (1871–1948)</b> là một kế toán viên. Trong thời gian dưỡng bệnh, ông nghiên cứu hàng chục năm dữ liệu chỉ số chứng khoán Mỹ ở nhiều khung thời gian. Ông kết luận rằng tâm lý đám đông dao động giữa lạc quan và bi quan theo những <b>mô thức lặp lại</b>, tạo nên các "sóng" có cấu trúc. Tác phẩm chính của ông ra đời vào cuối thập niên 1930 và thập niên 1940. Về sau, A.J. Frost và Robert Prechter hệ thống hoá và phổ biến phương pháp này.</p>
<div class="callout">Ý tưởng cốt lõi: thị trường không chuyển động ngẫu nhiên mà theo <b>nhịp điệu của tâm lý tập thể</b>. Nhịp điệu ấy lặp lại ở mọi cấp độ, từ biểu đồ vài phút đến chu kỳ hàng thế kỷ.</div>
<h3>2. Mô hình cơ bản: 5 sóng đẩy + 3 sóng điều chỉnh</h3>
<p>Theo hướng của xu hướng lớn hơn, thị trường đi theo <b>5 sóng</b> (1-2-3-4-5): ba sóng đi theo hướng xu hướng (1, 3, 5) xen kẽ hai sóng ngược lại (2, 4). Sau đó là <b>3 sóng điều chỉnh</b> (A-B-C) đi ngược hướng. Một chu kỳ hoàn chỉnh gồm 8 sóng.</p>
${fg.eight('vi')}
<ul><li><b>Sóng đẩy (motive)</b>: chia thành 5 sóng nhỏ hơn, đi theo hướng của cấp sóng lớn hơn. Gồm sóng xung lực (impulse) và tam giác chéo (diagonal).</li>
<li><b>Sóng điều chỉnh (corrective)</b>: chia thành 3 sóng (hoặc biến thể), đi ngược hướng cấp lớn hơn. Hình dạng phức tạp và khó đếm hơn nhiều.</li></ul>
<h3>3. Tính phân dạng (fractal) và cấp độ sóng</h3>
<p>Mỗi sóng là một phần của sóng lớn hơn và đồng thời chứa các sóng nhỏ hơn. Sóng 1, 3, 5 (sóng đẩy) lại chia thành 5 sóng nhỏ; sóng 2, 4 (điều chỉnh) chia thành 3 sóng nhỏ. Vì vậy một chu kỳ 8 sóng ở cấp lớn chứa 34 sóng ở cấp nhỏ hơn, rồi 144 sóng ở cấp nhỏ hơn nữa. Đây là các số Fibonacci, và là lý do Fibonacci gắn chặt với lý thuyết sóng.</p>
${fg.fractal('vi')}
<table class="tbl"><thead><tr><th>Cấp độ (từ lớn đến nhỏ)</th><th>Thời gian gợi ý</th></tr></thead><tbody>
<tr><td>Grand Supercycle → Supercycle → Cycle</td><td>Nhiều thập kỷ → vài năm</td></tr>
<tr><td>Primary → Intermediate</td><td>Vài tháng đến 1–2 năm → vài tuần đến vài tháng</td></tr>
<tr><td>Minor → Minute → Minuette → Subminuette</td><td>Vài tuần → vài ngày → vài giờ → vài phút</td></tr></tbody></table>
<p>Mỗi cấp có <b>ký hiệu riêng</b> (số La Mã, số trong ngoặc, chữ thường…) để biết sóng thuộc cấp nào. Cấp sóng được xác định bởi <b>hình dạng và vị trí</b>, không phải bởi độ dài thời gian.</p>
<h3>4. Tính cách của từng sóng</h3>
<table class="tbl"><thead><tr><th>Sóng</th><th>Tâm lý và đặc điểm điển hình</th></tr></thead><tbody>
<tr><td><b>1</b></td><td>Khởi đầu âm thầm; đa số vẫn bi quan sau xu hướng giảm trước, nên coi đây chỉ là nhịp hồi</td></tr>
<tr><td><b>2</b></td><td>Thoái lui sâu (thường 50–61.8%); nỗi sợ quay lại, nhưng giá không thủng đáy sóng 1</td></tr>
<tr><td><b>3</b></td><td>Thường dài và mạnh nhất; tin tốt xuất hiện, khối lượng và độ rộng thị trường lớn; "điểm nhận diện"</td></tr>
<tr><td><b>4</b></td><td>Điều chỉnh đi ngang, phức tạp, gây chán nản; thường nông</td></tr>
<tr><td><b>5</b></td><td>Lạc quan lan rộng, nhưng động lượng và độ rộng thường yếu hơn sóng 3 (phân kỳ)</td></tr>
<tr><td><b>A</b></td><td>Đám đông tin đây chỉ là điều chỉnh nhỏ</td></tr>
<tr><td><b>B</b></td><td>Nhịp hồi "bẫy", khối lượng thấp; nhiều người tưởng xu hướng tăng quay lại</td></tr>
<tr><td><b>C</b></td><td>Mạnh, lan rộng, thường phá vỡ ảo tưởng; tương tự sóng 3 theo chiều ngược lại</td></tr></tbody></table>
<div class="callout">Liên hệ: sóng 1 ≈ giai đoạn tích lũy của Dow/Wyckoff; sóng 3 ≈ giai đoạn công chúng tham gia (markup); sóng 5 ≈ giai đoạn hưng phấn, gần vùng phân phối.</div>`,
      keys: ['Elliott: thị trường vận động theo nhịp điệu tâm lý đám đông, lặp lại ở mọi cấp độ.', 'Chu kỳ cơ bản = 5 sóng đẩy (1-2-3-4-5) + 3 sóng điều chỉnh (A-B-C).', 'Sóng đẩy chia thành 5; sóng điều chỉnh chia thành 3 (hoặc biến thể).', 'Tính phân dạng: số sóng theo dãy Fibonacci (8 → 34 → 144).', 'Cấp sóng xác định bởi hình dạng và vị trí, không chỉ bởi thời gian.', 'Sóng 3 thường mạnh nhất; sóng 5 thường kèm phân kỳ; sóng B là "bẫy".'],
      terms: [['Wave Principle', 'Nguyên lý Sóng'], ['Motive / Impulse wave', 'Sóng đẩy / sóng xung lực'], ['Corrective wave', 'Sóng điều chỉnh'], ['Degree', 'Cấp độ sóng'], ['Fractal', 'Tính phân dạng — tự đồng dạng ở mọi cấp']],
      quiz: [
        Q('Một chu kỳ Elliott cơ bản gồm:', ['3 sóng đẩy + 5 sóng điều chỉnh', '5 sóng đẩy + 3 sóng điều chỉnh', '7 sóng', '4 sóng'], 1, '5 sóng theo xu hướng, 3 sóng ngược lại.'),
        Q('Sóng đẩy chia thành bao nhiêu sóng nhỏ hơn?', ['3', '5', '8', '2'], 1, 'Sóng đẩy chia 5, sóng điều chỉnh chia 3.'),
        Q('Ở cấp nhỏ hơn kế tiếp, một chu kỳ 8 sóng chứa bao nhiêu sóng?', ['16', '21', '34', '89'], 2, 'Phần đẩy 1-2-3-4-5 chia thành 5+3+5+3+5 = 21 sóng; phần điều chỉnh A-B-C chia thành 5+3+5 = 13 sóng; tổng 34.'),
        Q('Sóng nào thường dài và mạnh nhất?', ['Sóng 1', 'Sóng 3', 'Sóng 5', 'Sóng B'], 1, 'Sóng 3 có độ rộng và khối lượng lớn nhất.'),
        Q('Cấp độ sóng được xác định chủ yếu bởi:', ['Độ dài thời gian', 'Hình dạng và vị trí trong cấu trúc lớn hơn', 'Khối lượng', 'Biên độ giá tuyệt đối'], 1, 'Thời gian chỉ mang tính gợi ý.'),
        Q('Sóng 5 thường đi kèm:', ['Độ rộng và động lượng mạnh nhất', 'Phân kỳ động lượng so với sóng 3', 'Bi quan cực độ', 'Không có khối lượng'], 1, 'Giá lên cao hơn nhưng lực đẩy yếu hơn.'),
        Q('Sóng B có đặc điểm tâm lý:', ['Hoảng loạn', 'Nhịp hồi "bẫy", nhiều người tưởng xu hướng cũ quay lại', 'Tích lũy âm thầm', 'Hưng phấn cực độ'], 1, 'Thường khối lượng thấp và cấu trúc kém thuyết phục.'),
        Q('Sóng 1 tương ứng với giai đoạn nào của Dow/Wyckoff?', ['Hưng phấn', 'Tích lũy', 'Hoảng loạn', 'Phân phối'], 1, 'Khởi đầu âm thầm khi đa số còn bi quan.')
      ]
    },
    en: {
      goals: ['Explain the origin and core idea of the Wave Principle.', 'Describe the 5–3 model and its fractal nature.', 'Distinguish motive and corrective waves.', 'Name wave degrees and notation.', 'Describe the personality of each wave.'],
      body: () => `
<h3>1. Origin</h3><p><b>R.N. Elliott (1871–1948)</b>, an accountant, studied decades of index data and concluded that crowd psychology swings between optimism and pessimism in <b>repeating patterns</b>. Frost and Prechter later popularised his work.</p>
<h3>2. Basic model</h3><p>With the larger trend: <b>five waves</b> (1-2-3-4-5); against it: <b>three</b> (A-B-C) — eight waves per cycle.</p>${fg.eight('en')}<ul><li><b>Motive</b> waves subdivide into five (impulses, diagonals).</li><li><b>Corrective</b> waves subdivide into three (or variations) and are harder to count.</li></ul>
<h3>3. Fractals and degree</h3><p>Every wave is part of a larger one and contains smaller ones: 8 → 34 → 144 waves — Fibonacci numbers.</p>${fg.fractal('en')}<p>Degrees run from Grand Supercycle down to Subminuette, each with its own notation; degree depends on <b>form and position</b>, not time alone.</p>
<h3>4. Wave personality</h3><table class="tbl"><tbody><tr><td>1</td><td>Quiet start; most still bearish</td></tr><tr><td>2</td><td>Deep retracement (often 50–61.8%) but above wave 1’s start</td></tr><tr><td>3</td><td>Usually longest and strongest; broad participation</td></tr><tr><td>4</td><td>Sideways, complex, often shallow</td></tr><tr><td>5</td><td>Widespread optimism; weaker momentum and breadth than 3</td></tr><tr><td>A</td><td>Seen as a mere pullback</td></tr><tr><td>B</td><td>A "sucker" rally on low volume</td></tr><tr><td>C</td><td>Strong, broad, destroys illusions</td></tr></tbody></table><div class="callout">Wave 1 ≈ accumulation; wave 3 ≈ markup; wave 5 ≈ excess near distribution.</div>`,
      keys: ['Markets move in rhythms of crowd psychology at every degree.', 'Cycle = 5 motive + 3 corrective waves.', 'Motive waves subdivide into 5, corrective into 3.', 'Fractal wave counts follow Fibonacci (8, 34, 144).', 'Degree depends on form and position.', 'Wave 3 strongest; wave 5 shows divergence; wave B is a trap.'],
      terms: [['Motive wave', 'Five-wave move with the trend'], ['Corrective wave', 'Three-wave move against it'], ['Degree', 'Wave size class']],
      quiz: [
        Q('A basic Elliott cycle has:', ['3 motive + 5 corrective', '5 motive + 3 corrective', '7 waves', '4 waves'], 1, 'Five with, three against.'),
        Q('Motive waves subdivide into:', ['3', '5', '8', '2'], 1, 'Corrective ones into 3.'),
        Q('At the next lower degree an 8-wave cycle contains:', ['16', '21', '34', '89'], 2, '21 + 13 = 34.'),
        Q('The usually longest, strongest wave:', ['1', '3', '5', 'B'], 1, 'Broadest participation.'),
        Q('Degree depends mainly on:', ['Duration', 'Form and position', 'Volume', 'Absolute size'], 1, 'Time is only a guide.'),
        Q('Wave 5 typically shows:', ['Strongest breadth', 'Momentum divergence versus wave 3', 'Extreme pessimism', 'No volume'], 1, 'Higher price, weaker thrust.'),
        Q('Wave B psychology:', ['Panic', 'A trap rally', 'Quiet accumulation', 'Euphoria'], 1, 'Often low volume.'),
        Q('Wave 1 corresponds to which Dow/Wyckoff stage?', ['Excess', 'Accumulation', 'Panic', 'Distribution'], 1, 'A quiet start.')
      ]
    }
  };

  /* ================= LESSON 13 ================= */
  C.lessons['l1-13'] = {
    vi: {
      goals: ['Nêu 3 quy tắc bất biến của sóng xung lực.', 'Hiểu các hướng dẫn: sóng mở rộng, luân phiên, độ sâu điều chỉnh, kênh sóng.', 'Phân biệt các dạng điều chỉnh: zigzag, flat, tam giác, kết hợp.', 'Áp dụng tỷ lệ Fibonacci để ước lượng mục tiêu và vùng đảo chiều.', 'Xây dựng kế hoạch giao dịch theo sóng: điểm vào, điểm vô hiệu, mục tiêu.'],
      body: () => `
<h3>1. Ba quy tắc bất biến của sóng xung lực</h3>
<ol><li><b>Sóng 2 không bao giờ thoái lui quá 100% sóng 1</b> (không thủng điểm bắt đầu sóng 1).</li>
<li><b>Sóng 3 không bao giờ là sóng ngắn nhất</b> trong ba sóng 1, 3, 5.</li>
<li><b>Sóng 4 không chồng lấn vùng giá của sóng 1</b>. Ngoại lệ duy nhất là tam giác chéo (diagonal).</li></ol>
<div class="callout">Vi phạm bất kỳ quy tắc nào thì cách đếm sai. Chính các quy tắc này cho ta <b>điểm vô hiệu</b> rõ ràng, tức là nơi đặt cắt lỗ. Đây là giá trị thực tiễn lớn nhất của Elliott.</div>
${C.demoHtml.waves()}
<h3>2. Các hướng dẫn (guidelines) — thường đúng nhưng không bắt buộc</h3>
<ul><li><b>Sóng mở rộng (extension)</b>: thường một trong ba sóng đẩy kéo dài bất thường. Với cổ phiếu, sóng mở rộng hay là sóng 3.</li>
<li><b>Luân phiên (alternation)</b>: nếu sóng 2 sắc và sâu (zigzag) thì sóng 4 thường đi ngang và nông (flat/tam giác), và ngược lại.</li>
<li><b>Độ sâu điều chỉnh</b>: sóng điều chỉnh thường kết thúc trong vùng sóng 4 của cấp nhỏ hơn trước đó.</li>
<li><b>Kênh sóng</b>: nối đỉnh sóng 2 và 4, rồi vẽ đường song song qua đỉnh sóng 3 để ước lượng vùng kết thúc sóng 5.</li>
<li><b>Sóng 5 hụt (truncation)</b>: sóng 5 không vượt được đỉnh sóng 3. Đây là dấu hiệu yếu, thường sau một sóng 3 cực mạnh.</li></ul>
<h3>3. Các dạng sóng điều chỉnh</h3>
${fg.corr('vi')}
<ul><li><b>Zigzag (5-3-5)</b>: điều chỉnh sắc, sâu. A có 5 sóng, B có 3 sóng, C có 5 sóng. Có thể nối tiếp (double/triple zigzag).</li>
<li><b>Flat (3-3-5)</b>: điều chỉnh đi ngang. Sóng B hồi gần hết sóng A. Biến thể <i>expanded flat</i> có B vượt điểm đầu A và C vượt cuối A.</li>
<li><b>Tam giác (3-3-3-3-3)</b>: a-b-c-d-e hội tụ, thường xuất hiện ở sóng 4 hoặc sóng B, ngay trước nước đi cuối cùng theo xu hướng.</li>
<li><b>Kết hợp (W-X-Y, W-X-Y-X-Z)</b>: chuỗi các dạng trên nối bằng sóng X.</li></ul>
<h3>4. Fibonacci trong sóng Elliott</h3>
<table class="tbl"><thead><tr><th>Quan hệ</th><th>Tỷ lệ thường gặp</th></tr></thead><tbody>
<tr><td>Sóng 2 thoái lui sóng 1</td><td>50%, 61.8%</td></tr>
<tr><td>Sóng 3 so với sóng 1</td><td>161.8% (hoặc 261.8% khi mở rộng)</td></tr>
<tr><td>Sóng 4 thoái lui sóng 3</td><td>23.6%, 38.2%</td></tr>
<tr><td>Sóng 5 so với sóng 1</td><td>Bằng nhau (100%), hoặc 61.8% của quãng 1→3</td></tr>
<tr><td>Sóng C so với sóng A</td><td>100%, 161.8%</td></tr></tbody></table>
<h3>5. Kế hoạch giao dịch theo sóng</h3>
<ol><li><b>Xác định cấp sóng</b> phù hợp với khung thời gian giao dịch, luôn đối chiếu với cấp lớn hơn.</li>
<li><b>Vị trí tốt nhất</b>: cuối sóng 2 (để bắt sóng 3) hoặc cuối sóng 4 (để bắt sóng 5). Ở đó ta có điểm vô hiệu gần: đáy sóng 1 cho sóng 2, đỉnh sóng 1 cho sóng 4.</li>
<li><b>Xác nhận</b>: giá phá đường nối sóng điều chỉnh, kèm khối lượng và động lượng.</li>
<li><b>Mục tiêu</b>: dùng tỷ lệ Fibonacci và kênh sóng; chốt dần khi tới vùng mục tiêu.</li>
<li><b>Luôn có cách đếm thay thế</b>: nhà phân tích sóng giỏi chuẩn bị sẵn kịch bản thứ hai và biết mức giá nào sẽ chuyển sang kịch bản đó.</li></ol>
<div class="callout">Phê phán: đếm sóng mang tính chủ quan cao, hai nhà phân tích có thể đếm khác nhau. Hãy dùng Elliott như một <b>khung bản đồ xác suất</b> kết hợp với quy tắc vô hiệu rõ ràng, không phải công cụ tiên tri.</div>`,
      keys: ['3 quy tắc: sóng 2 không thủng đầu sóng 1; sóng 3 không ngắn nhất; sóng 4 không chồng lấn sóng 1 (trừ diagonal).', 'Quy tắc cho điểm vô hiệu rõ ràng — giá trị thực tiễn lớn nhất.', 'Hướng dẫn: sóng mở rộng, luân phiên, độ sâu điều chỉnh, kênh sóng, sóng 5 hụt.', 'Điều chỉnh: zigzag 5-3-5, flat 3-3-5, tam giác 3-3-3-3-3, kết hợp W-X-Y.', 'Fibonacci: sóng 2 ≈ 50–61.8%, sóng 3 ≈ 161.8% sóng 1, sóng 4 ≈ 23.6–38.2%, C ≈ A.', 'Vị trí giao dịch tốt nhất: cuối sóng 2 và cuối sóng 4; luôn có cách đếm thay thế.'],
      terms: [['Extension', 'Sóng mở rộng'], ['Alternation', 'Luân phiên'], ['Truncation', 'Sóng 5 hụt'], ['Zigzag / Flat / Triangle', 'Các dạng điều chỉnh'], ['Diagonal', 'Tam giác chéo'], ['Alternate count', 'Cách đếm thay thế']],
      quiz: [
        Q('Quy tắc nào là bất biến?', ['Sóng 5 luôn dài nhất', 'Sóng 3 không bao giờ là sóng ngắn nhất', 'Sóng 2 luôn thoái lui 61.8%', 'Sóng 4 luôn là tam giác'], 1, 'Đây là một trong ba quy tắc bất biến.'),
        Q('Sóng 4 chồng lấn vùng giá sóng 1 trong một sóng xung lực (không phải diagonal). Kết luận:', ['Hợp lệ', 'Cách đếm sai', 'Sóng 5 sẽ rất mạnh', 'Sóng 3 mở rộng'], 1, 'Vi phạm quy tắc 3.'),
        Q('Nguyên tắc luân phiên nói rằng:', ['Sóng 2 và 4 thường khác dạng', 'Sóng 1 và 5 luôn bằng nhau', 'Mọi sóng đều là zigzag', 'Không có ý nghĩa'], 0, 'Sóng 2 sắc thì sóng 4 thường đi ngang, và ngược lại.'),
        Q('Cấu trúc của zigzag là:', ['3-3-5', '5-3-5', '3-3-3-3-3', '5-5-5'], 1, 'A 5 sóng, B 3 sóng, C 5 sóng.'),
        Q('Tam giác Elliott thường xuất hiện ở:', ['Sóng 3', 'Sóng 4 hoặc sóng B', 'Sóng 1', 'Sóng C'], 1, 'Ngay trước nước đi cuối cùng theo xu hướng.'),
        Q('Sóng 1 dài 10 điểm. Mục tiêu phổ biến cho sóng 3 (tính từ đáy sóng 2) là khoảng:', ['6.18 điểm', '10 điểm', '16.18 điểm', '50 điểm'], 2, 'Sóng 3 ≈ 161.8% sóng 1.'),
        Q('Điểm vô hiệu khi mua cuối sóng 2 là:', ['Đỉnh sóng 1', 'Điểm bắt đầu sóng 1', 'Đỉnh sóng 3', 'Không có'], 1, 'Sóng 2 không thể thủng điểm đầu sóng 1.'),
        Q('Phê phán chính với Elliott là:', ['Quá khách quan', 'Đếm sóng chủ quan, có nhiều cách đếm', 'Không dùng Fibonacci', 'Chỉ dùng cho tiền tệ'], 1, 'Nên dùng như bản đồ xác suất với quy tắc vô hiệu.')
      ]
    },
    en: {
      goals: ['State the three inviolable impulse rules.', 'Know the guidelines.', 'Distinguish corrective forms.', 'Use Fibonacci ratios.', 'Build a wave-based trade plan.'],
      body: () => `
<h3>1. Three rules</h3><ol><li>Wave 2 never retraces more than 100% of wave 1.</li><li>Wave 3 is never the shortest of 1, 3, 5.</li><li>Wave 4 never overlaps wave 1 (except diagonals).</li></ol><div class="callout">A violated rule means a wrong count — the rules give clear <b>invalidation</b> levels.</div>${C.demoHtml.waves()}
<h3>2. Guidelines</h3><ul><li><b>Extension</b> — usually wave 3 in stocks.</li><li><b>Alternation</b> between waves 2 and 4.</li><li>Corrections often end in the prior fourth wave of lesser degree.</li><li><b>Channelling</b> 2–4 with a parallel through 3.</li><li><b>Truncation</b> of wave 5.</li></ul>
<h3>3. Corrections</h3>${fg.corr('en')}<ul><li>Zigzag 5-3-5 (doubles/triples)</li><li>Flat 3-3-5 (expanded flats)</li><li>Triangle 3-3-3-3-3 — usually wave 4 or B</li><li>Combinations W-X-Y(-X-Z)</li></ul>
<h3>4. Fibonacci</h3><table class="tbl"><tbody><tr><td>Wave 2</td><td>50–61.8% of 1</td></tr><tr><td>Wave 3</td><td>161.8% (261.8%) of 1</td></tr><tr><td>Wave 4</td><td>23.6–38.2% of 3</td></tr><tr><td>Wave 5</td><td>= wave 1, or 61.8% of 1→3</td></tr><tr><td>C</td><td>100% or 161.8% of A</td></tr></tbody></table>
<h3>5. Trade plan</h3><ol><li>Pick the degree for your timeframe.</li><li>Best spots: end of wave 2 (stop below wave 1’s start) and end of wave 4 (stop at wave 1’s top).</li><li>Confirm with breaks, volume, momentum.</li><li>Targets from ratios and channels.</li><li>Always keep an alternate count.</li></ol><div class="callout">Counts are subjective — use Elliott as a probability map with clear invalidation.</div>`,
      keys: ['Three inviolable rules.', 'Rules give invalidation levels.', 'Guidelines: extension, alternation, depth, channels, truncation.', 'Zigzag, flat, triangle, combinations.', 'Fibonacci relationships.', 'Trade ends of waves 2 and 4; keep alternates.'],
      terms: [['Alternation', 'Waves 2 and 4 differ in form'], ['Truncation', 'Wave 5 failing to exceed wave 3'], ['Diagonal', 'Wedge-shaped motive wave']],
      quiz: [
        Q('Which is an inviolable rule?', ['Wave 5 is longest', 'Wave 3 is never the shortest', 'Wave 2 retraces 61.8%', 'Wave 4 is a triangle'], 1, 'One of three rules.'),
        Q('Wave 4 overlaps wave 1 in an impulse:', ['Valid', 'Wrong count', 'Strong wave 5', 'Wave 3 extension'], 1, 'Rule 3.'),
        Q('Alternation means:', ['Waves 2 and 4 usually differ', 'Waves 1 and 5 are equal', 'All zigzags', 'Nothing'], 0, 'Sharp vs sideways.'),
        Q('A zigzag is:', ['3-3-5', '5-3-5', '3-3-3-3-3', '5-5-5'], 1, ''),
        Q('Triangles usually appear in:', ['Wave 3', 'Wave 4 or B', 'Wave 1', 'Wave C'], 1, 'Before the final move.'),
        Q('Wave 1 = 10 points. Common wave 3 length:', ['6.18', '10', '16.18', '50'], 2, '161.8%.'),
        Q('Invalidation for a wave-2 buy:', ['Wave 1 top', 'Wave 1 start', 'Wave 3 top', 'None'], 1, 'Wave 2 cannot break it.'),
        Q('Main criticism of Elliott:', ['Too objective', 'Subjective counts', 'No Fibonacci', 'Currencies only'], 1, 'Use it as a probability map.')
      ]
    }
  };

  /* ================= LESSON 14 ================= */
  C.lessons['l1-14'] = {
    vi: {
      goals: ['Hiểu khái niệm độ rộng thị trường (breadth) và vì sao nó quan trọng.', 'Tính và diễn giải đường A/D, tỷ lệ A/D, chỉ số New High–New Low.', 'Hiểu McClellan Oscillator / Summation Index và các chỉ báo "lực đẩy" (breadth thrust).', 'Hiểu Arms Index (TRIN) — kết hợp độ rộng và khối lượng.', 'Nhận diện phân kỳ độ rộng và tỷ lệ cổ phiếu trên MA.'],
      body: () => `
<h3>1. Độ rộng thị trường là gì?</h3>
<p>Chỉ số (VNINDEX, S&P 500…) thường được tính theo vốn hoá, nên vài cổ phiếu lớn có thể kéo cả chỉ số. <b>Độ rộng (breadth)</b> đo xem <b>bao nhiêu</b> cổ phiếu đang tham gia xu hướng. Xu hướng tăng lành mạnh là xu hướng có <b>đa số</b> cổ phiếu cùng tăng ("đội quân đi theo tướng"). Khi chỉ số tăng nhưng số cổ phiếu tăng ngày càng ít, xu hướng đang được chống đỡ bởi một nhóm nhỏ và dễ gãy.</p>
<h3>2. Dữ liệu và chỉ báo cơ bản</h3>
<table class="tbl"><thead><tr><th>Chỉ báo</th><th>Cách tính</th><th>Diễn giải</th></tr></thead><tbody>
<tr><td><b>Đường A/D (Advance–Decline line)</b></td><td>Cộng dồn (số mã tăng − số mã giảm) mỗi phiên</td><td>Đi cùng chỉ số = xác nhận; phân kỳ = cảnh báo (thường xuất hiện trước các đỉnh lớn)</td></tr>
<tr><td><b>Tỷ lệ A/D</b></td><td>Số mã tăng / số mã giảm</td><td>Đo cường độ trong ngày; cực trị là dấu hiệu quá mua/quá bán</td></tr>
<tr><td><b>New Highs – New Lows</b></td><td>Số mã lập đỉnh 52 tuần − số mã lập đáy 52 tuần</td><td>Âm khi chỉ số còn gần đỉnh là dấu hiệu suy yếu bên trong</td></tr>
<tr><td><b>% cổ phiếu trên MA (50/200)</b></td><td>Tỷ lệ mã có giá trên đường trung bình</td><td>&gt; 80% quá mua, &lt; 20% quá bán; phân kỳ với chỉ số</td></tr>
<tr><td><b>Up/Down volume</b></td><td>Khối lượng mã tăng so với khối lượng mã giảm</td><td>Đo dòng tiền theo độ rộng</td></tr></tbody></table>
${fg.ad('vi')}
<h3>3. McClellan Oscillator và Summation Index</h3>
<p><b>McClellan Oscillator</b> = EMA 19 ngày của (mã tăng − mã giảm) trừ EMA 39 ngày của cùng chuỗi đó. Đây là một "MACD của độ rộng":</p>
<ul><li>Dương và tăng: độ rộng đang cải thiện. Âm sâu: quá bán.</li>
<li>Cắt qua 0 là tín hiệu đổi hướng ngắn–trung hạn của độ rộng.</li>
<li><b>Summation Index</b> = cộng dồn McClellan Oscillator, dùng để xác định xu hướng trung–dài hạn của độ rộng.</li></ul>
<h3>4. Lực đẩy độ rộng (breadth thrust)</h3>
<p>Một số chỉ báo tìm những đợt chuyển từ quá bán sang mua mạnh trong thời gian rất ngắn. Ví dụ phổ biến: tỷ lệ mã tăng / (tăng + giảm), làm mượt bằng EMA 10 ngày, đi từ dưới khoảng 40% lên trên khoảng 61.5% trong vòng 10 phiên. Những tín hiệu này hiếm, nhưng lịch sử cho thấy chúng thường đánh dấu khởi đầu của các xu hướng tăng lớn.</p>
<h3>5. Arms Index (TRIN) — kết hợp độ rộng và khối lượng</h3>
<p>TRIN = (Số mã tăng / Số mã giảm) ÷ (Khối lượng mã tăng / Khối lượng mã giảm).</p>
<ul><li>TRIN &lt; 1: khối lượng dồn vào mã tăng nhiều hơn tỷ lệ số mã, tức là lực mua mạnh.</li>
<li>TRIN &gt; 1: khối lượng dồn vào mã giảm, tức là lực bán mạnh.</li>
<li>Giá trị cực cao (ví dụ trên 2–3) trong ngày bán tháo thường gắn với đáy ngắn hạn do hoảng loạn. Chỉ báo này nghịch biến với thị trường.</li></ul>
<div class="callout"><b>Ví dụ</b>: 300 mã tăng, 150 mã giảm; khối lượng mã tăng 60 triệu, mã giảm 60 triệu. TRIN = (300/150) / (60/60) = 2 / 1 = <b>2.0</b>: dù số mã tăng gấp đôi, khối lượng không ủng hộ, một tín hiệu đáng ngờ.</div>
<h3>6. Áp dụng</h3>
<ul><li>Dùng độ rộng để <b>xác nhận</b> xu hướng chỉ số (Bài 2: nguyên tắc xác nhận của Dow mở rộng).</li>
<li>Phân kỳ độ rộng ở đỉnh thường xuất hiện sớm, đôi khi trước nhiều tháng. Ở đáy, tín hiệu độ rộng thường đến nhanh và dứt khoát hơn (lực đẩy, TRIN cực trị).</li>
<li>Với thị trường Việt Nam: theo dõi số mã tăng/giảm trên HOSE, tỷ lệ cổ phiếu trên MA, và nhóm vốn hoá lớn (VN30) so với phần còn lại.</li></ul>`,
      keys: ['Độ rộng đo bao nhiêu cổ phiếu tham gia xu hướng; xu hướng khoẻ cần đa số tham gia.', 'Đường A/D cộng dồn (tăng − giảm); phân kỳ với chỉ số là cảnh báo đỉnh.', 'New Highs − New Lows, % cổ phiếu trên MA bổ sung góc nhìn.', 'McClellan Oscillator = EMA19 − EMA39 của (tăng − giảm); Summation Index là tổng cộng dồn.', 'Breadth thrust: chuyển nhanh từ quá bán sang mua mạnh, thường mở đầu xu hướng tăng lớn.', 'TRIN = (tăng/giảm) ÷ (KL tăng/KL giảm); < 1 lực mua, > 1 lực bán, cực cao là hoảng loạn.'],
      terms: [['Breadth', 'Độ rộng thị trường'], ['A/D line', 'Đường tăng–giảm'], ['New Highs–New Lows', 'Đỉnh mới − đáy mới 52 tuần'], ['McClellan Oscillator', 'Dao động độ rộng'], ['Summation Index', 'Chỉ số tổng hợp McClellan'], ['Breadth thrust', 'Lực đẩy độ rộng'], ['TRIN / Arms Index', 'Chỉ số Arms']],
      quiz: [
        Q('Mục đích chính của chỉ báo độ rộng là:', ['Đo giá của cổ phiếu lớn nhất', 'Đo bao nhiêu cổ phiếu tham gia xu hướng', 'Đo lãi suất', 'Đo biến động'], 1, 'Chỉ số có thể bị vài mã lớn chi phối.'),
        Q('Hôm nay 250 mã tăng, 150 mã giảm; đường A/D hôm qua là 1.000. Hôm nay:', ['900', '1.100', '1.250', '1.400'], 1, '1.000 + (250 − 150) = 1.100.'),
        Q('Chỉ số lập đỉnh mới nhưng đường A/D thì không. Điều này gợi ý:', ['Xu hướng khoẻ', 'Sự tham gia thu hẹp — cảnh báo', 'Tín hiệu mua', 'Không có ý nghĩa'], 1, 'Phân kỳ độ rộng thường đi trước đỉnh lớn.'),
        Q('McClellan Oscillator được tính bằng:', ['EMA19 − EMA39 của (mã tăng − mã giảm)', 'Tổng khối lượng', 'Số mã lập đỉnh mới', 'Giá đóng cửa trung bình'], 0, 'Một dạng "MACD" của độ rộng.'),
        Q('300 mã tăng, 100 mã giảm; KL mã tăng 90 triệu, KL mã giảm 30 triệu. TRIN là:', ['0.5', '1.0', '2.0', '3.0'], 1, '(300/100) / (90/30) = 3/3 = 1.0.'),
        Q('TRIN rất cao (ví dụ 3) trong một ngày bán tháo thường gắn với:', ['Đỉnh thị trường', 'Đáy ngắn hạn do hoảng loạn', 'Xu hướng tăng bền vững', 'Không có gì'], 1, 'TRIN nghịch biến với thị trường.'),
        Q('Summation Index dùng để:', ['Đo xu hướng trung–dài hạn của độ rộng', 'Đo giá vàng', 'Thay thế khối lượng', 'Tính P/E'], 0, 'Là tổng cộng dồn của McClellan Oscillator.'),
        Q('Tín hiệu "breadth thrust" thường được xem là:', ['Dấu hiệu đỉnh', 'Khởi đầu tiềm năng của xu hướng tăng lớn', 'Dấu hiệu đi ngang', 'Lỗi dữ liệu'], 1, 'Chuyển rất nhanh từ quá bán sang mua mạnh.')
      ]
    },
    en: {
      goals: ['Understand breadth and why it matters.', 'Compute A/D line, A/D ratio, new highs–lows.', 'Understand McClellan Oscillator/Summation Index and breadth thrusts.', 'Understand the Arms Index.', 'Spot breadth divergence.'],
      body: () => `
<h3>1. Breadth</h3><p>Cap-weighted indexes can be carried by a few giants; <b>breadth</b> measures how many stocks participate. Healthy trends have broad participation.</p>
<h3>2. Basic measures</h3><table class="tbl"><tbody><tr><td><b>A/D line</b></td><td>Cumulative advances − declines; divergence warns</td></tr><tr><td><b>A/D ratio</b></td><td>Advances / declines</td></tr><tr><td><b>New highs − new lows</b></td><td>52-week extremes</td></tr><tr><td><b>% above MA</b></td><td>&gt;80% overbought, &lt;20% oversold</td></tr><tr><td><b>Up/down volume</b></td><td>Volume behind breadth</td></tr></tbody></table>${fg.ad('en')}
<h3>3. McClellan</h3><p>Oscillator = EMA19 − EMA39 of (advances − declines); zero crosses mark shifts; the <b>Summation Index</b> cumulates it for the longer trend.</p>
<h3>4. Breadth thrusts</h3><p>A rapid move from oversold to strong buying (e.g. a 10-day EMA of advances/(advances+declines) rising from below ~40% to above ~61.5% within 10 days) has historically often marked major advances.</p>
<h3>5. Arms Index (TRIN)</h3><p>TRIN = (advances/declines) ÷ (advancing volume/declining volume). Below 1 = buying pressure; above 1 = selling; extreme highs in sell-offs often mark panic lows.</p><div class="callout">300 up, 150 down, equal volumes → TRIN = 2/1 = <b>2.0</b>.</div>
<h3>6. Application</h3><ul><li>Confirm index trends with breadth.</li><li>Breadth divergences lead tops; thrusts and extreme TRIN mark bottoms.</li><li>In Vietnam: HOSE advances/declines, % above MA, VN30 versus the rest.</li></ul>`,
      keys: ['Breadth = participation.', 'A/D line divergence warns of tops.', 'New highs–lows, % above MA.', 'McClellan = EMA19 − EMA39; Summation cumulates.', 'Breadth thrusts often start major advances.', 'TRIN < 1 buying, > 1 selling; extremes = panic.'],
      terms: [['Breadth', 'Market participation'], ['TRIN', 'Arms Index'], ['Breadth thrust', 'Rapid breadth surge']],
      quiz: [
        Q('Breadth indicators measure:', ['The largest stock', 'How many stocks participate', 'Rates', 'Volatility'], 1, ''),
        Q('250 up, 150 down, A/D line 1,000 → ', ['900', '1,100', '1,250', '1,400'], 1, '+100.'),
        Q('Index new high, A/D line not:', ['Healthy', 'Narrowing participation — warning', 'Buy', 'Nothing'], 1, ''),
        Q('McClellan Oscillator =', ['EMA19 − EMA39 of net advances', 'Total volume', 'New highs', 'Average close'], 0, ''),
        Q('300 up, 100 down; 90M vs 30M volume. TRIN:', ['0.5', '1.0', '2.0', '3.0'], 1, '3/3.'),
        Q('Very high TRIN on a sell-off suggests:', ['A top', 'A panic low', 'Durable uptrend', 'Nothing'], 1, 'Contrarian.'),
        Q('The Summation Index tracks:', ['Longer-term breadth trend', 'Gold', 'Volume', 'P/E'], 0, ''),
        Q('A breadth thrust is usually:', ['A top', 'A potential start of a major advance', 'A range', 'An error'], 1, '')
      ]
    }
  };

  /* ================= LESSON 15 ================= */
  C.lessons['l1-15'] = {
    vi: {
      goals: ['Hiểu chu kỳ là gì: chu kỳ, biên độ, pha.', 'Nêu các nguyên lý của lý thuyết chu kỳ.', 'Hiểu "lệch trái/lệch phải" (translation) và ý nghĩa xu hướng.', 'Phân biệt các loại chu kỳ thị trường quen thuộc.'],
      body: () => `
<h3>1. Chu kỳ là gì?</h3>
<p>Chu kỳ là sự <b>lặp lại tương đối đều đặn</b> của các đỉnh và đáy theo thời gian. Ba thông số mô tả một chu kỳ:</p>
<ul><li><b>Độ dài (period)</b>: khoảng thời gian giữa hai đáy liên tiếp. Trong thị trường tài chính, chu kỳ thường được đo <b>từ đáy đến đáy</b> vì đáy thường rõ ràng và sắc nét hơn đỉnh.</li>
<li><b>Biên độ (amplitude)</b>: độ lớn dao động.</li>
<li><b>Pha (phase)</b>: vị trí hiện tại trong chu kỳ (gần đáy, giữa, gần đỉnh).</li></ul>
${fg.cycle('vi')}
<h3>2. Các nguyên lý của lý thuyết chu kỳ</h3>
<table class="tbl"><thead><tr><th>Nguyên lý</th><th>Nội dung</th></tr></thead><tbody>
<tr><td><b>Tổng hợp (summation)</b></td><td>Đường giá là tổng của nhiều chu kỳ có độ dài khác nhau cộng với xu hướng và nhiễu</td></tr>
<tr><td><b>Hài hoà (harmonicity)</b></td><td>Các chu kỳ kề nhau thường có quan hệ bội số đơn giản, thường gấp 2 (đôi khi gấp 3)</td></tr>
<tr><td><b>Đồng bộ (synchronicity)</b></td><td>Các chu kỳ có xu hướng tạo đáy cùng lúc. Đáy của chu kỳ lớn trùng với đáy của các chu kỳ nhỏ, tạo ra đáy mạnh</td></tr>
<tr><td><b>Tỷ lệ (proportionality)</b></td><td>Chu kỳ càng dài thì biên độ càng lớn</td></tr>
<tr><td><b>Biến đổi (variation)</b></td><td>Các nguyên lý trên chỉ đúng "tương đối": độ dài thực tế dao động quanh giá trị danh nghĩa</td></tr>
<tr><td><b>Danh nghĩa (nominality)</b></td><td>Có một tập độ dài chu kỳ "danh nghĩa" chung cho nhiều thị trường</td></tr></tbody></table>
${fg.harmonics('vi')}
<h3>3. Lệch trái / lệch phải (translation)</h3>
<p>Nếu không có xu hướng, đỉnh chu kỳ sẽ nằm đúng giữa hai đáy. Thực tế:</p>
<ul><li><b>Lệch phải (right translation)</b>: đỉnh nằm sau điểm giữa, tức là giá tăng lâu hơn giảm. Đây là dấu hiệu của <b>xu hướng tăng</b> ở cấp chu kỳ lớn hơn.</li>
<li><b>Lệch trái (left translation)</b>: đỉnh nằm trước điểm giữa, tức là giá tăng ngắn rồi giảm lâu. Đây là dấu hiệu <b>xu hướng giảm</b>.</li></ul>
<p>Một chu kỳ lệch trái sau chuỗi chu kỳ lệch phải là cảnh báo xu hướng lớn có thể đang đổi chiều.</p>
<h3>4. Các chu kỳ quen thuộc</h3>
<ul><li><b>Chu kỳ 4 năm</b> (Kitchin / chu kỳ bầu cử ở Mỹ): đáy cổ phiếu Mỹ thường cách nhau khoảng 4 năm.</li>
<li><b>Chu kỳ kinh doanh</b> (Juglar khoảng 7–11 năm), chu kỳ xây dựng (Kuznets khoảng 18 năm), sóng dài (Kondratieff khoảng 50–60 năm). Các chu kỳ này mang tính kinh tế học và còn nhiều tranh luận.</li>
<li><b>Mùa vụ (seasonality)</b>: hiệu ứng theo tháng/ngày trong năm, rõ nhất ở hàng hoá nông sản.</li>
<li><b>Chu kỳ ngắn hạn</b>: 20 ngày, 40 ngày, 10 tuần, 20 tuần… thường được dùng trong giao dịch.</li></ul>
<div class="callout">Chu kỳ cho biết <b>khi nào</b> có thể xảy ra một đáy/đỉnh, chứ không cho biết <b>giá</b> sẽ ở đâu. Kết hợp chu kỳ (thời gian) với hỗ trợ/kháng cự và mẫu hình (giá) cho các điểm đảo chiều đáng tin hơn.</div>`,
      keys: ['Chu kỳ = lặp lại đỉnh/đáy theo thời gian; mô tả bằng độ dài, biên độ, pha; đo từ đáy đến đáy.', 'Nguyên lý: tổng hợp, hài hoà (×2), đồng bộ, tỷ lệ, biến đổi, danh nghĩa.', 'Lệch phải = xu hướng tăng; lệch trái = xu hướng giảm.', 'Đáy mạnh khi nhiều chu kỳ cùng tạo đáy (đồng bộ).', 'Chu kỳ dự báo thời gian, không dự báo giá — cần kết hợp với phân tích giá.'],
      terms: [['Period / Amplitude / Phase', 'Độ dài / Biên độ / Pha'], ['Trough-to-trough', 'Đo từ đáy đến đáy'], ['Summation / Harmonicity / Synchronicity', 'Tổng hợp / Hài hoà / Đồng bộ'], ['Right / Left translation', 'Lệch phải / Lệch trái'], ['Seasonality', 'Tính mùa vụ']],
      quiz: [
        Q('Chu kỳ thị trường thường được đo:', ['Từ đỉnh đến đỉnh', 'Từ đáy đến đáy', 'Từ đầu năm đến cuối năm', 'Theo khối lượng'], 1, 'Đáy thường sắc nét và rõ ràng hơn.'),
        Q('Nguyên lý hài hoà nói rằng:', ['Các chu kỳ kề nhau thường có quan hệ bội số đơn giản (thường ×2)', 'Mọi chu kỳ dài bằng nhau', 'Chu kỳ không tồn tại', 'Biên độ không đổi'], 0, 'Ví dụ 20 ngày – 40 ngày – 80 ngày.'),
        Q('Đỉnh chu kỳ nằm sau điểm giữa hai đáy (lệch phải) gợi ý:', ['Xu hướng giảm', 'Xu hướng tăng ở cấp lớn hơn', 'Đi ngang', 'Không có ý nghĩa'], 1, 'Giá tăng lâu hơn giảm.'),
        Q('Nguyên lý đồng bộ có ý nghĩa thực tế là:', ['Đáy mạnh khi nhiều chu kỳ cùng tạo đáy', 'Mọi thị trường cùng tăng', 'Biên độ bằng nhau', 'Không có đáy'], 0, 'Nhiều chu kỳ trùng đáy tạo đáy quan trọng.'),
        Q('Nguyên lý tỷ lệ: chu kỳ dài hơn thì:', ['Biên độ nhỏ hơn', 'Biên độ lớn hơn', 'Không có biên độ', 'Biên độ ngẫu nhiên'], 1, 'Tỷ lệ thuận giữa độ dài và biên độ.'),
        Q('Chu kỳ chủ yếu giúp dự báo:', ['Giá chính xác', 'Thời điểm có khả năng xảy ra đỉnh/đáy', 'Lợi nhuận doanh nghiệp', 'Lãi suất'], 1, 'Chu kỳ là công cụ thời gian.'),
        Q('Chuỗi chu kỳ lệch phải rồi bất ngờ xuất hiện một chu kỳ lệch trái là:', ['Xác nhận xu hướng tăng', 'Cảnh báo xu hướng lớn có thể đổi chiều', 'Tín hiệu mua', 'Không quan trọng'], 1, 'Tính chất chu kỳ thay đổi phản ánh xu hướng lớn thay đổi.'),
        Q('Nguyên lý tổng hợp nói rằng đường giá là:', ['Một chu kỳ duy nhất', 'Tổng của nhiều chu kỳ, xu hướng và nhiễu', 'Hoàn toàn ngẫu nhiên', 'Đường thẳng'], 1, 'Nhiều sóng chồng lên nhau.')
      ]
    },
    en: {
      goals: ['Define period, amplitude, phase.', 'State the principles of cycle theory.', 'Understand translation.', 'Know common market cycles.'],
      body: () => `
<h3>1. Cycles</h3><p>A cycle is a roughly regular recurrence of troughs and crests: <b>period</b> (measured trough to trough), <b>amplitude</b>, <b>phase</b>.</p>${fg.cycle('en')}
<h3>2. Principles</h3><table class="tbl"><tbody><tr><td>Summation</td><td>Price = sum of cycles + trend + noise</td></tr><tr><td>Harmonicity</td><td>Adjacent cycles relate by small multiples (usually 2)</td></tr><tr><td>Synchronicity</td><td>Cycles tend to bottom together</td></tr><tr><td>Proportionality</td><td>Longer cycles have larger amplitude</td></tr><tr><td>Variation</td><td>Principles hold only approximately</td></tr><tr><td>Nominality</td><td>A common set of nominal periods</td></tr></tbody></table>${fg.harmonics('en')}
<h3>3. Translation</h3><p><b>Right translation</b> (crest after midpoint) = uptrend; <b>left translation</b> = downtrend. A left-translated cycle after right-translated ones warns of a trend change.</p>
<h3>4. Familiar cycles</h3><ul><li>Four-year (Kitchin / US presidential)</li><li>Juglar, Kuznets, Kondratieff — debated</li><li>Seasonality</li><li>Short trading cycles: 20/40 days, 10/20 weeks</li></ul><div class="callout">Cycles suggest <b>when</b>, not <b>where</b>; combine with price analysis.</div>`,
      keys: ['Period, amplitude, phase; trough to trough.', 'Summation, harmonicity, synchronicity, proportionality, variation, nominality.', 'Right = uptrend, left = downtrend.', 'Synchronised troughs make strong lows.', 'Cycles time; price analysis locates.'],
      terms: [['Translation', 'Crest position within a cycle'], ['Harmonicity', 'Simple multiples between cycles']],
      quiz: [
        Q('Market cycles are usually measured:', ['Crest to crest', 'Trough to trough', 'Calendar year', 'By volume'], 1, ''),
        Q('Harmonicity:', ['Adjacent cycles relate by simple multiples', 'All equal', 'No cycles', 'Constant amplitude'], 0, ''),
        Q('Right translation suggests:', ['Downtrend', 'Uptrend at a higher degree', 'Range', 'Nothing'], 1, ''),
        Q('Synchronicity implies:', ['Strong lows when cycles bottom together', 'All markets rise', 'Equal amplitudes', 'No lows'], 0, ''),
        Q('Longer cycles have:', ['Smaller amplitude', 'Larger amplitude', 'None', 'Random'], 1, ''),
        Q('Cycles mainly forecast:', ['Exact price', 'Likely timing of turns', 'Earnings', 'Rates'], 1, ''),
        Q('A sudden left-translated cycle after right-translated ones:', ['Confirms the uptrend', 'Warns of a trend change', 'Buy', 'Unimportant'], 1, ''),
        Q('Summation says price is:', ['One cycle', 'Many cycles plus trend and noise', 'Random', 'A line'], 1, '')
      ]
    }
  };

  /* ================= LESSON 16 ================= */
  C.lessons['l1-16'] = {
    vi: {
      goals: ['Nhận diện chu kỳ trên biểu đồ bằng phương pháp trực quan.', 'Dùng công cụ: đường bao chu kỳ, MA trung tâm, phân tích phổ cơ bản.', 'Đặt "vùng thời gian" cho đáy chu kỳ kế tiếp.', 'Kết hợp chu kỳ với các công cụ giá và quản trị rủi ro.'],
      body: () => `
<h3>1. Quy trình phân tích chu kỳ</h3>
<ol><li><b>Chọn khung dữ liệu</b> đủ dài (ít nhất vài chục chu kỳ nhỏ, hoặc vài chu kỳ lớn).</li>
<li><b>Đánh dấu các đáy quan trọng</b> và đo khoảng cách đáy–đáy (theo số nến).</li>
<li><b>Tìm độ dài trội</b>: trung vị, phân bố của các khoảng cách. Kiểm tra quan hệ hài hoà với chu kỳ lớn hơn và nhỏ hơn (×2).</li>
<li><b>Dựng vùng thời gian</b> cho đáy kế tiếp: độ dài trội ± biến động.</li>
<li><b>Xác nhận bằng giá</b>: khi vào vùng thời gian, chờ tín hiệu đáy (phá đường xu hướng giảm ngắn hạn, mẫu nến, phân kỳ…).</li></ol>
${C.demoHtml.cycles()}
<h3>2. Công cụ</h3>
<ul><li><b>Đường bao chu kỳ (cycle envelope)</b>: các đường cong song song bao quanh giá, cho thấy chu kỳ và xu hướng cùng lúc.</li>
<li><b>MA trung tâm (centered MA)</b>: MA có độ dài bằng nửa chu kỳ, dịch lùi về giữa cửa sổ. Nó cho thấy "xu hướng" của chu kỳ lớn hơn. Nhược điểm: thiếu dữ liệu ở phần cuối (nửa chu kỳ gần nhất).</li>
<li><b>Bộ dao động "detrend"</b>: lấy giá trừ MA trung tâm để làm lộ chu kỳ ngắn hơn.</li>
<li><b>Phân tích phổ / Fourier, MESA</b>: phương pháp toán học tìm các chu kỳ trội trong dữ liệu. Mạnh, nhưng nhạy với nhiễu và dễ "tìm ra" chu kỳ không có thật nếu không kiểm định.</li>
<li><b>Mùa vụ</b>: trung bình lợi nhuận theo tháng/tuần qua nhiều năm.</li></ul>
<h3>3. Ứng dụng giao dịch</h3>
<table class="tbl"><thead><tr><th>Tình huống</th><th>Hành động gợi ý</th></tr></thead><tbody>
<tr><td>Vào vùng thời gian đáy + giá tới hỗ trợ + tín hiệu đảo chiều</td><td>Cân nhắc mua, điểm dừng dưới đáy chu kỳ</td></tr>
<tr><td>Chu kỳ lệch phải liên tiếp</td><td>Ưu tiên mua các đáy chu kỳ, giữ lệnh qua đỉnh chu kỳ nhỏ</td></tr>
<tr><td>Chu kỳ lệch trái</td><td>Ưu tiên bán ở đỉnh chu kỳ, không bắt đáy</td></tr>
<tr><td>Giá thủng đáy chu kỳ trước đó</td><td>Dấu hiệu chu kỳ lớn đã đổi sang pha giảm</td></tr></tbody></table>
<h3>4. Cạm bẫy</h3>
<ul><li><b>Chu kỳ "co giãn"</b>: độ dài thực tế biến động. Dùng <b>vùng</b> thay vì ngày cố định.</li>
<li><b>Đảo pha (inversion)</b>: đôi khi đỉnh xuất hiện đúng lúc dự kiến đáy.</li>
<li><b>Chu kỳ biến mất</b>: một chu kỳ trội có thể yếu đi hoặc biến mất khi điều kiện thị trường thay đổi.</li>
<li><b>Ảo giác mẫu hình</b>: mắt người dễ thấy chu kỳ trong dữ liệu ngẫu nhiên. Cần kiểm định thống kê (Phần VI–VII).</li></ul>`,
      keys: ['Quy trình: đánh dấu đáy → đo đáy–đáy → độ dài trội → vùng thời gian → xác nhận bằng giá.', 'Công cụ: đường bao chu kỳ, MA trung tâm (nửa chu kỳ), detrend, phổ/Fourier/MESA, mùa vụ.', 'Dùng vùng thời gian, không dùng ngày chính xác.', 'Lệch phải → mua đáy chu kỳ; lệch trái → bán đỉnh chu kỳ; thủng đáy chu kỳ trước = đổi pha.', 'Cạm bẫy: co giãn, đảo pha, chu kỳ biến mất, ảo giác mẫu hình.'],
      terms: [['Dominant cycle', 'Chu kỳ trội'], ['Centered moving average', 'MA trung tâm'], ['Cycle envelope', 'Đường bao chu kỳ'], ['Detrending', 'Loại bỏ xu hướng'], ['Spectral analysis / MESA', 'Phân tích phổ'], ['Inversion', 'Đảo pha']],
      quiz: [
        Q('Bước đầu tiên khi phân tích chu kỳ là:', ['Dự báo ngày chính xác', 'Đánh dấu các đáy quan trọng và đo khoảng cách', 'Mua ngay', 'Tính P/E'], 1, 'Chu kỳ đo từ đáy đến đáy.'),
        Q('MA trung tâm có nhược điểm:', ['Không làm mượt', 'Thiếu dữ liệu ở phần cuối (nửa chu kỳ gần nhất)', 'Quá nhanh', 'Không dùng được'], 1, 'Vì phải dịch lùi về giữa cửa sổ.'),
        Q('Vì sao nên dùng "vùng thời gian" thay vì ngày cố định?', ['Cho đẹp', 'Vì độ dài chu kỳ thực tế co giãn quanh giá trị danh nghĩa', 'Vì không có dữ liệu', 'Không có lý do'], 1, 'Nguyên lý biến đổi.'),
        Q('Giá thủng đáy của chu kỳ trước đó gợi ý:', ['Chu kỳ lớn đã chuyển sang pha giảm', 'Xu hướng tăng mạnh hơn', 'Không có ý nghĩa', 'Tín hiệu mua'], 0, 'Đáy sau thấp hơn đáy trước là dấu hiệu xu hướng giảm.'),
        Q('Rủi ro chính của phân tích phổ/Fourier là:', ['Không tính được', 'Có thể tìm ra chu kỳ không có thật nếu không kiểm định', 'Quá đơn giản', 'Không dùng dữ liệu'], 1, 'Cần kiểm định thống kê.'),
        Q('"Đảo pha" (inversion) là khi:', ['Đỉnh xuất hiện đúng lúc dự kiến đáy', 'Chu kỳ dài gấp đôi', 'Không có chu kỳ', 'Khối lượng tăng'], 0, 'Một cạm bẫy thường gặp.'),
        Q('Cách vào lệnh hợp lý nhất theo chu kỳ:', ['Mua đúng ngày dự kiến', 'Khi vào vùng thời gian đáy, chờ tín hiệu giá xác nhận', 'Bán khi đến đáy', 'Không đặt điểm dừng'], 1, 'Chu kỳ cho thời gian, giá cho xác nhận.'),
        Q('Detrending dùng để:', ['Tăng xu hướng', 'Loại bỏ xu hướng dài để làm lộ chu kỳ ngắn hơn', 'Tính khối lượng', 'Vẽ nến'], 1, 'Ví dụ: giá trừ MA trung tâm.')
      ]
    },
    en: {
      goals: ['Identify cycles visually.', 'Use envelopes, centered MAs, spectral analysis.', 'Project a time window for the next low.', 'Combine cycles with price tools.'],
      body: () => `
<h3>1. Process</h3><ol><li>Use enough data.</li><li>Mark major troughs and measure spacing.</li><li>Find the dominant length; check harmonics (×2).</li><li>Project a time window: length ± variation.</li><li>Confirm with price signals.</li></ol>${C.demoHtml.cycles()}
<h3>2. Tools</h3><ul><li>Cycle envelopes</li><li>Centered MA (half-cycle) — missing the latest half-cycle</li><li>Detrended oscillators</li><li>Spectral analysis / Fourier / MESA — beware spurious cycles</li><li>Seasonality</li></ul>
<h3>3. Trading</h3><table class="tbl"><tbody><tr><td>Low window + support + reversal signal</td><td>Consider buying, stop below the cycle low</td></tr><tr><td>Right translation</td><td>Buy cycle lows</td></tr><tr><td>Left translation</td><td>Sell cycle highs</td></tr><tr><td>Break below the prior cycle low</td><td>Larger cycle turned down</td></tr></tbody></table>
<h3>4. Pitfalls</h3><ul><li>Cycles stretch — use windows.</li><li>Inversions.</li><li>Cycles fade.</li><li>Seeing patterns in noise — test statistically.</li></ul>`,
      keys: ['Mark troughs → spacing → dominant length → window → price confirmation.', 'Envelopes, centered MA, detrending, spectral methods, seasonality.', 'Windows, not dates.', 'Right translation: buy lows; left: sell highs; lower low = phase change.', 'Pitfalls: stretching, inversion, fading, illusion.'],
      terms: [['Dominant cycle', 'Strongest cycle'], ['Centered MA', 'MA shifted to mid-window'], ['Inversion', 'High where a low was expected']],
      quiz: [
        Q('First step in cycle analysis:', ['Forecast exact dates', 'Mark troughs and measure spacing', 'Buy', 'P/E'], 1, ''),
        Q('Centered MA drawback:', ['No smoothing', 'Missing the latest half-cycle', 'Too fast', 'Unusable'], 1, ''),
        Q('Why time windows?', ['Aesthetics', 'Cycle lengths vary', 'No data', 'None'], 1, ''),
        Q('Breaking below the prior cycle low suggests:', ['The larger cycle turned down', 'Stronger uptrend', 'Nothing', 'Buy'], 0, ''),
        Q('Spectral analysis risk:', ['Cannot compute', 'Spurious cycles without testing', 'Too simple', 'No data'], 1, ''),
        Q('Inversion means:', ['A high where a low was expected', 'Double length', 'No cycle', 'Rising volume'], 0, ''),
        Q('Best cycle-based entry:', ['Buy on the exact date', 'In the low window, wait for price confirmation', 'Sell at lows', 'No stops'], 1, ''),
        Q('Detrending:', ['Adds trend', 'Removes the long trend to expose shorter cycles', 'Computes volume', 'Draws candles'], 1, '')
      ]
    }
  };
})(window.LLW);
