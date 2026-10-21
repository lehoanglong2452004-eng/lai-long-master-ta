/* CMT Level 3 — Part 6a, lessons 28–30: classical methods I. Written by Lai Long Master TA in its own words. */
(function (L) {
  'use strict';
  const C = L.cmt, H = C.demoHtml;
  const ld = () => `<span class="spinner"></span>${L.t('loading')}`;

  /* ---------- demo: quantified bar patterns ---------- */
  H.patStats = (mk = 'vn_stock', sym = 'VNINDEX') => C.demoShell('patStats', C.symControls(mk, sym, '1D', ['1D', '1W']) + `<button class="btn primary d-go">${L.T('Thống kê', 'Count')}</button>`,
    L.T('Đếm các mẫu hình thanh khách quan và đo lợi suất trung bình 1 và 5 phiên sau đó, so với cơ sở.', 'Count objective bar patterns and measure average 1- and 5-bar returns afterwards versus the base.'));
  C.demoRun.patStats = box => {
    const out = box.querySelector('.demo-out'), el = box.querySelector('.demo-chart');
    if (el) el.style.display = 'none';
    C.wire(box, async () => {
      out.innerHTML = ld();
      try {
        const [mk, sym, tf] = C.readSym(box), b = await C.loadBars(mk, sym, tf), n = b.length;
        const rng = i => b[i].h - b[i].l;
        const P = {
          [L.T('Ngày trong (inside)', 'Inside bar')]: i => b[i].h < b[i - 1].h && b[i].l > b[i - 1].l,
          [L.T('Ngày bao trùm (outside) tăng', 'Bullish outside bar')]: i => b[i].h > b[i - 1].h && b[i].l < b[i - 1].l && b[i].c > b[i - 1].h - (b[i - 1].h - b[i - 1].l) * 0.1,
          [L.T('Biên độ hẹp nhất 7 phiên (NR7)', 'NR7')]: i => i >= 7 && [1, 2, 3, 4, 5, 6].every(k => rng(i) < rng(i - k)),
          [L.T('Ngày đảo chiều tăng (key reversal)', 'Bullish key reversal')]: i => b[i].l < b[i - 1].l && b[i].c > b[i - 1].c && b[i].c > b[i].o,
          [L.T('Gap tăng', 'Up gap')]: i => b[i].l > b[i - 1].h,
          [L.T('Gap giảm', 'Down gap')]: i => b[i].h < b[i - 1].l,
          [L.T('Biên độ rộng (> 2× TB 20) đóng cửa gần đỉnh', 'Wide-range bar closing near high')]: i => { if (i < 21) return false; let m = 0; for (let k = 1; k <= 20; k++) m += rng(i - k); m /= 20; return rng(i) > 2 * m && (b[i].c - b[i].l) / (rng(i) || 1) > 0.75; }
        };
        const fwd = (i, h) => i + h < n ? Math.log(b[i + h].c / b[i].c) * 100 : null;
        const stat = f => { const a1 = [], a5 = []; for (let i = 8; i < n - 1; i++) if (f(i)) { a1.push(fwd(i, 1)); const v = fwd(i, 5); if (v != null) a5.push(v); } const m = a => a.length ? a.reduce((x, y) => x + y, 0) / a.length : NaN; return [a1.length, m(a1), m(a5), a5.length ? a5.filter(x => x > 0).length / a5.length * 100 : NaN]; };
        const base = stat(() => true), f = v => isNaN(v) ? '—' : v.toFixed(2);
        out.innerHTML = `<table class="tbl"><thead><tr><th>${L.T('Mẫu hình', 'Pattern')}</th><th>n</th><th>+1 (%)</th><th>+5 (%)</th><th>% ${L.T('tăng sau 5', 'up after 5')}</th></tr></thead><tbody>
          ${Object.entries(P).map(([k, fn]) => { const s = stat(fn); return `<tr><td>${k}</td><td>${s[0]}</td><td>${f(s[1])}</td><td>${f(s[2])}</td><td>${f(s[3])}</td></tr>`; }).join('')}
          <tr><td><b>${L.T('Mọi phiên (cơ sở)', 'All bars (base)')}</b></td><td>${base[0]}</td><td>${f(base[1])}</td><td>${f(base[2])}</td><td>${f(base[3])}</td></tr></tbody></table>
          <p class="muted">${L.T('Khác biệt so với cơ sở chỉ có ý nghĩa khi n đủ lớn và lặp lại ở nhiều mã/giai đoạn. Mẫu hình thường là điều kiện (biến động sắp mở rộng, quyết định sắp đến) hơn là tín hiệu hướng.', 'Differences from the base matter only with enough n and repeatability across symbols/periods. Patterns are often conditions (pending expansion) rather than directional signals.')}</p>`;
      } catch (e) { C.err(out, e); }
    });
  };

  /* ---------- demo: multi-timeframe alignment ---------- */
  H.mtfAlign = (mk = 'vn_stock', sym = 'HPG') => C.demoShell('mtfAlign', C.symControls(mk, sym, '1D', ['1D']) + `<button class="btn primary d-go">${L.T('Đánh giá', 'Assess')}</button>`,
    L.T('Trạng thái xu hướng trên ba khung (tuần, ngày, 4 giờ hoặc 1 giờ): giá so với EMA 20 và EMA 50, độ dốc EMA 20.', 'Trend state on three timeframes (weekly, daily, 4H or 1H): price vs EMA 20 and EMA 50, EMA-20 slope.'));
  C.demoRun.mtfAlign = box => {
    const out = box.querySelector('.demo-out'), el = box.querySelector('.demo-chart');
    if (el) el.style.display = 'none';
    const ema = (a, p) => { const k = 2 / (p + 1); let e = a[0]; return a.map(v => (e = e + k * (v - e))); };
    C.wire(box, async () => {
      out.innerHTML = ld();
      try {
        const [mk, sym] = C.readSym(box), tfs = ['1W', '1D', mk === 'vn_stock' ? '1H' : '4H'];
        const res = await Promise.all(tfs.map(async tf => {
          const b = await C.loadBars(mk, sym, tf), c = b.map(x => x.c), e20 = ema(c, 20), e50 = ema(c, 50), i = c.length - 1;
          const sc = (c[i] > e20[i] ? 1 : -1) + (e20[i] > e50[i] ? 1 : -1) + (e20[i] > e20[i - 5] ? 1 : -1);
          return { tf, sc, txt: sc >= 2 ? L.T('Tăng', 'Up') : sc <= -2 ? L.T('Giảm', 'Down') : L.T('Hỗn hợp', 'Mixed') };
        }));
        const tot = res[0].sc * 3 + res[1].sc * 2 + res[2].sc;
        const verdict = res[0].sc >= 2 && res[1].sc >= 2 ? (res[2].sc >= 2 ? L.T('Đồng thuận tăng — chỉ còn cần điểm vào có rủi ro thấp', 'Aligned up — just need a low-risk entry') : L.T('Khung lớn tăng, khung nhỏ điều chỉnh — vùng tìm điểm mua khi khung nhỏ quay lại tăng', 'Higher frames up, lower correcting — look to buy as the lower frame turns up')) :
          res[0].sc <= -2 && res[1].sc <= -2 ? L.T('Đồng thuận giảm — tránh mua; với thị trường cho phép bán khống, tìm điểm bán khi khung nhỏ hồi lên', 'Aligned down — avoid longs; where shorting is allowed, sell lower-frame rallies') : L.T('Mâu thuẫn giữa các khung — giảm quy mô hoặc đứng ngoài', 'Conflicting frames — reduce size or stand aside');
        out.innerHTML = `<table class="tbl"><thead><tr><th>${L.T('Khung', 'Frame')}</th><th>${L.T('Điểm', 'Score')}</th><th>${L.T('Trạng thái', 'State')}</th></tr></thead><tbody>${res.map(r => `<tr><td>${r.tf}</td><td>${r.sc > 0 ? '+' : ''}${r.sc}</td><td style="color:var(${r.sc >= 2 ? '--up' : r.sc <= -2 ? '--down' : '--muted'})"><b>${r.txt}</b></td></tr>`).join('')}</tbody></table>
          <p>${L.T('Điểm tổng hợp (trọng số 3–2–1)', 'Weighted score (3–2–1)')}: <b>${tot}</b> / ±18 → <b>${verdict}</b></p>`;
      } catch (e) { C.err(out, e); }
    });
  };

  /* ================= L3-28 ================= */
  C.addLesson('l3-28', {
    goals: ['Định nghĩa khách quan các mẫu hình thanh và mẫu hình giá để kiểm định được.', 'Đánh giá độ tin cậy của mẫu hình bằng thống kê so với cơ sở.', 'Phân biệt mẫu hình báo hướng và mẫu hình báo điều kiện (biến động sắp mở rộng).', 'Kết hợp mẫu hình với bối cảnh xu hướng, khối lượng và quản lý rủi ro.'],
    body: () => `
<h3>1. Từ nhận diện bằng mắt đến định nghĩa khách quan</h3>
<p>Mẫu hình chỉ có thể kiểm định khi được <b>định nghĩa bằng quy tắc</b> mà hai người (hoặc máy tính) cho cùng kết quả. Ví dụ "ngày trong" (inside day): đỉnh thấp hơn đỉnh hôm trước <b>và</b> đáy cao hơn đáy hôm trước. "Ngày đảo chiều" (key reversal) tăng: đáy thấp hơn đáy hôm trước nhưng đóng cửa cao hơn giá đóng cửa hôm trước.</p>
<table class="tbl"><thead><tr><th>Mẫu hình</th><th>Định nghĩa</th><th>Ý nghĩa thường gặp</th></tr></thead><tbody>
<tr><td>Ngày trong / NR4, NR7</td><td>Biên độ nằm trong phiên trước / hẹp nhất 4 hoặc 7 phiên</td><td>Nén biến động — chuẩn bị mở rộng (hướng chưa rõ)</td></tr>
<tr><td>Ngày bao trùm (outside)</td><td>Đỉnh cao hơn và đáy thấp hơn phiên trước</td><td>Biến động mở rộng; hướng đóng cửa quan trọng</td></tr>
<tr><td>Ngày đảo chiều</td><td>Phá đáy (đỉnh) rồi đóng cửa ngược lại</td><td>Từ chối mức giá; mạnh hơn khi ở cực trị với khối lượng lớn</td></tr>
<tr><td>Gap và đảo chiều đảo (island)</td><td>Khoảng trống giá; nhóm phiên bị cô lập bởi hai gap ngược hướng</td><td>Thay đổi tâm lý đột ngột</td></tr>
<tr><td>Phiên biên độ rộng</td><td>Biên độ &gt; 2 lần trung bình 20 phiên</td><td>Sự kiện/cao trào; vị trí đóng cửa cho biết bên thắng</td></tr>
<tr><td>Cú bật nhọn (spike)</td><td>Giá vượt xa vùng lân cận rồi quay lại</td><td>Cao trào hoặc từ chối</td></tr></tbody></table>
<h3>2. Đánh giá thống kê</h3>
<ul><li>So sánh lợi suất sau mẫu hình với <b>cơ sở</b> (mọi phiên) — không chỉ nhìn lợi suất tuyệt đối.</li>
<li>Kiểm tra số lần xuất hiện (n), ổn định qua giai đoạn và qua nhiều thị trường.</li>
<li>Nhiều mẫu hình cho kết quả <b>gần cơ sở</b> khi đứng một mình; giá trị tăng khi kết hợp với <b>bối cảnh</b> (xu hướng, vị trí tại hỗ trợ/kháng cự, khối lượng).</li>
<li>Mẫu hình nén biến động (NR7, ngày trong) thường dự báo <b>độ lớn</b> chuyển động tiếp theo tốt hơn là hướng → kết hợp với lệnh chờ hai phía hoặc bộ lọc xu hướng.</li></ul>
${H.patStats()}
<h3>3. Mẫu hình giá nhiều phiên</h3>
<p>Mẫu hình cổ điển (vai đầu vai, hai đỉnh, tam giác, cờ) có thể định nghĩa khách quan qua <b>điểm xoay</b> (zigzag theo % hoặc ATR): số đỉnh/đáy, tỷ lệ độ cao, độ dốc đường viền, thời gian hình thành, khối lượng. Định nghĩa khách quan cho phép đo <b>tỷ lệ breakout thành công</b>, mức đạt mục tiêu và mức thất bại — thường thấp hơn nhiều so với cảm nhận khi nhìn biểu đồ quá khứ (thiên kiến nhận thức muộn).</p>
<h3>4. Giao dịch với mẫu hình</h3>
<ul><li>Vào lệnh khi mẫu hình được <b>xác nhận</b> (phá vỡ), đặt dừng ở điểm làm mẫu hình vô hiệu.</li>
<li>Mẫu hình thất bại (phá vỡ rồi quay lại) thường là tín hiệu mạnh theo hướng ngược lại.</li>
<li>Giữ kỳ vọng thực tế; quản lý rủi ro quan trọng hơn độ chính xác của mẫu hình.</li></ul>`,
    keys: ['Mẫu hình phải được định nghĩa bằng quy tắc để kiểm định.', 'Ngày trong/NR7 = nén biến động; ngày bao trùm, đảo chiều, gap, đảo, phiên biên độ rộng, spike.', 'Đánh giá so với cơ sở, n, độ ổn định; nhiều mẫu hình đứng một mình gần cơ sở — giá trị nằm ở bối cảnh.', 'Mẫu hình nén dự báo độ lớn hơn hướng.', 'Mẫu hình nhiều phiên định nghĩa qua điểm xoay; tỷ lệ thành công thực thấp hơn cảm nhận.', 'Vào khi xác nhận, dừng ở điểm vô hiệu; mẫu hình thất bại là tín hiệu ngược mạnh.'],
    terms: [['Inside bar', 'Ngày trong'], ['Outside bar', 'Ngày bao trùm'], ['NR7', 'Biên độ hẹp nhất 7 phiên'], ['Key reversal', 'Ngày đảo chiều'], ['Island reversal', 'Đảo chiều đảo'], ['Wide-range bar', 'Phiên biên độ rộng'], ['Failed pattern', 'Mẫu hình thất bại']]
  }, {
    goals: ['Define bar and price patterns objectively.', 'Assess reliability against a base.', 'Distinguish directional from conditional patterns.', 'Combine with context, volume and risk management.'],
    body: () => `
<h3>1. Objective definitions</h3><p>Inside bars, outside bars, NR4/NR7, key reversals, gaps and islands, wide-range bars, spikes.</p>
<h3>2. Statistics</h3><ul><li>Compare with the base.</li><li>Check n and stability.</li><li>Many patterns alone ≈ base; context adds value.</li><li>Compression patterns forecast magnitude more than direction.</li></ul>${H.patStats()}
<h3>3. Multi-bar patterns</h3><p>Define via swing points; measured success rates are usually lower than they look in hindsight.</p>
<h3>4. Trading</h3><ul><li>Enter on confirmation; stop at invalidation.</li><li>Failed patterns are strong opposite signals.</li><li>Risk management over accuracy.</li></ul>`,
    keys: ['Objective definitions.', 'Base comparison.', 'Context.', 'Compression.', 'Swing-point patterns.', 'Failure signals.'],
    terms: [['NR7', 'Narrowest range of 7 bars'], ['Failed pattern', 'Breakout that reverses']]
  }, [
    ['Mẫu hình chỉ kiểm định được khi:', 'A pattern can only be tested when:', ['Được định nghĩa bằng quy tắc khách quan', 'Được nhìn bằng mắt', 'Có tên đẹp', 'Xuất hiện trên báo'], ['It is defined by objective rules', 'Eyeballed', 'Nicely named', 'In the news'], 0, '', ''],
    ['Ngày trong (inside day) là:', 'An inside day is:', ['Đỉnh thấp hơn và đáy cao hơn phiên trước', 'Đỉnh cao hơn và đáy thấp hơn', 'Gap tăng', 'Đóng cửa bằng mở cửa'], ['Lower high and higher low than the prior bar', 'Higher high and lower low', 'An up gap', 'Close equals open'], 0, '', ''],
    ['Ngày bao trùm (outside day) là:', 'An outside day is:', ['Đỉnh cao hơn và đáy thấp hơn phiên trước', 'Nằm trong phiên trước', 'Gap giảm', 'Biên độ hẹp nhất'], ['Higher high and lower low than the prior bar', 'Inside the prior bar', 'A down gap', 'Narrowest range'], 0, '', ''],
    ['NR7 báo hiệu chủ yếu:', 'NR7 mainly signals:', ['Nén biến động — chuyển động lớn sắp đến (hướng chưa rõ)', 'Hướng tăng chắc chắn', 'Hướng giảm chắc chắn', 'Không gì'], ['Compression — a bigger move ahead (direction unclear)', 'Certain upside', 'Certain downside', 'Nothing'], 0, '', ''],
    ['Ngày đảo chiều tăng là:', 'A bullish key reversal day is:', ['Phá đáy phiên trước rồi đóng cửa cao hơn giá đóng cửa phiên trước', 'Gap tăng', 'Đóng cửa ở đáy', 'Ngày trong'], ['Breaks the prior low then closes above the prior close', 'An up gap', 'Closes at the low', 'An inside day'], 0, '', ''],
    ['Đảo chiều đảo (island reversal) gồm:', 'An island reversal consists of:', ['Nhóm phiên bị cô lập bởi hai gap ngược hướng', 'Một ngày trong', 'Ba nến trắng', 'Không gap'], ['Bars isolated by two opposite gaps', 'An inside day', 'Three white soldiers', 'No gaps'], 0, '', ''],
    ['Vì sao so sánh lợi suất sau mẫu hình với cơ sở?', 'Why compare post-pattern returns with a base?', ['Để tách giá trị của mẫu hình khỏi xu hướng chung của thị trường', 'Để tăng con số', 'Không cần', 'Do luật'], ['To separate pattern value from general market drift', 'Bigger numbers', 'Unneeded', 'Law'], 0, '', ''],
    ['Nhiều mẫu hình thanh khi đứng một mình thường cho kết quả:', 'Many bar patterns alone tend to give results:', ['Gần cơ sở; giá trị tăng khi có bối cảnh', 'Vượt trội tuyệt đối', 'Luôn âm', 'Không đo được'], ['Near the base; value rises with context', 'Hugely superior', 'Always negative', 'Unmeasurable'], 0, '', ''],
    ['Mẫu hình nén biến động thường dự báo tốt hơn:', 'Compression patterns forecast better:', ['Độ lớn chuyển động', 'Hướng chuyển động', 'Cổ tức', 'Lãi suất'], ['Move size', 'Move direction', 'Dividends', 'Rates'], 0, '', ''],
    ['Cách giao dịch hợp lý sau NR7:', 'A sensible way to trade after NR7:', ['Lệnh chờ hai phía hoặc theo bộ lọc xu hướng', 'Mua ngay bất kể', 'Bán khống ngay', 'Không giao dịch bao giờ'], ['Two-sided stop orders or a trend filter', 'Buy regardless', 'Short at once', 'Never trade'], 0, '', ''],
    ['Ngày đảo chiều mạnh hơn khi:', 'A key reversal is stronger when:', ['Xảy ra ở cực trị sau xu hướng dài với khối lượng lớn', 'Giữa vùng đi ngang', 'Khối lượng thấp', 'Không bao giờ'], ['At an extreme after a long trend on big volume', 'Mid-range', 'On low volume', 'Never'], 0, '', ''],
    ['Phiên biên độ rộng đóng cửa gần đỉnh cho thấy:', 'A wide-range bar closing near its high shows:', ['Bên mua thắng thế trong phiên biến động lớn', 'Bên bán thắng', 'Không ý nghĩa', 'Nén biến động'], ['Buyers won a high-volatility session', 'Sellers won', 'Meaningless', 'Compression'], 0, '', ''],
    ['Mẫu hình nhiều phiên được định nghĩa khách quan qua:', 'Multi-bar patterns are objectively defined via:', ['Điểm xoay (zigzag theo % hoặc ATR) và các tỷ lệ', 'Cảm nhận', 'Màu nến', 'Tin tức'], ['Swing points (%/ATR zigzag) and ratios', 'Feelings', 'Candle colours', 'News'], 0, '', ''],
    ['Tỷ lệ thành công thực của mẫu hình cổ điển thường:', 'Measured success rates of classical patterns are usually:', ['Thấp hơn cảm nhận khi nhìn biểu đồ quá khứ', 'Cao hơn cảm nhận', '100%', '0%'], ['Lower than they look on past charts', 'Higher than they look', '100%', '0%'], 0, '', ''],
    ['Vì sao mẫu hình trông đáng tin hơn thực tế khi nhìn biểu đồ cũ?', 'Why do patterns look more reliable on old charts?', ['Thiên kiến nhận thức muộn và chọn lọc ví dụ đẹp', 'Biểu đồ cũ chính xác hơn', 'Không đúng', 'Do luật'], ['Hindsight and cherry-picking good examples', 'Old charts are more accurate', 'False', 'Law'], 0, '', ''],
    ['Mẫu hình thất bại (phá vỡ rồi quay ngược lại) thường là:', 'A failed pattern (breakout then reversal) is often:', ['Tín hiệu mạnh theo hướng ngược lại', 'Không ý nghĩa', 'Tín hiệu tiếp diễn', 'Lỗi dữ liệu'], ['A strong signal in the opposite direction', 'Meaningless', 'A continuation signal', 'A data error'], 0, '', ''],
    ['Dừng lỗ cho giao dịch mẫu hình nên đặt ở:', 'A pattern trade’s stop should be at:', ['Điểm làm mẫu hình vô hiệu', 'Ngẫu nhiên 1%', 'Không đặt', 'Giá vào'], ['The pattern’s invalidation point', 'Random 1%', 'None', 'Entry'], 0, '', ''],
    ['Kiểm định mẫu hình trên một mã duy nhất với n = 15:', 'Testing a pattern on one stock with n 15:', ['Quá ít để kết luận', 'Đủ để kết luận chắc chắn', 'Hoàn hảo', 'Không cần'], ['Too few to conclude', 'Enough for certainty', 'Perfect', 'Unneeded'], 0, '', ''],
    ['Bối cảnh làm tăng giá trị mẫu hình gồm:', 'Context that adds value to patterns includes:', ['Xu hướng, vị trí tại hỗ trợ/kháng cự, khối lượng', 'Ngày sinh', 'Màu biểu đồ', 'Không gì'], ['Trend, location at S/R, volume', 'Birthdays', 'Chart colours', 'Nothing'], 0, '', ''],
    ['Ngày trong sau một phiên biên độ rộng thường cho thấy:', 'An inside day after a wide-range bar often shows:', ['Thị trường tạm dừng, cân nhắc sau sự kiện', 'Xu hướng tăng tốc', 'Gap', 'Không gì'], ['A pause/digestion after the event', 'Acceleration', 'A gap', 'Nothing'], 0, '', ''],
    ['Gap tăng vượt kháng cự với khối lượng lớn, không bị lấp sau 3 phiên:', 'An up gap over resistance on heavy volume, unfilled after 3 bars:', ['Xác nhận breakaway gap — tín hiệu mạnh', 'Gap kiệt sức', 'Không ý nghĩa', 'Sắp lấp chắc chắn'], ['Confirms a breakaway gap — strong signal', 'Exhaustion gap', 'Meaningless', 'Surely fills'], 0, '', ''],
    ['Cú bật nhọn (spike) lên đỉnh mới rồi đóng cửa thấp thường là:', 'A spike to a new high then a low close is often:', ['Từ chối mức giá / cao trào', 'Xác nhận tăng', 'Tích luỹ', 'Không ý nghĩa'], ['Rejection / climax', 'Bullish confirmation', 'Accumulation', 'Meaningless'], 0, '', ''],
    ['Khi một mẫu hình được nhiều người biết và dùng, hiệu quả có thể:', 'When a pattern becomes widely known, its edge may:', ['Suy giảm', 'Tăng mãi', 'Không đổi', 'Gấp đôi'], ['Decay', 'Grow forever', 'Stay', 'Double'], 0, '', ''],
    ['Điểm khác biệt giữa "mẫu hình hướng" và "mẫu hình điều kiện":', 'Directional vs conditional patterns:', ['Hướng dự báo chiều đi; điều kiện dự báo trạng thái (ví dụ biến động sắp mở rộng)', 'Giống nhau', 'Điều kiện luôn dự báo tăng', 'Không có khác biệt'], ['Directional forecasts the way; conditional forecasts a state (e.g. pending expansion)', 'Same', 'Conditional always bullish', 'No difference'], 0, '', ''],
    ['Định nghĩa khách quan mẫu hình hai đỉnh có thể gồm:', 'An objective double-top definition could include:', ['Hai đỉnh chênh nhau < x% ATR, cách nhau tối thiểu N phiên, phá đáy giữa để xác nhận', 'Cảm giác hai đỉnh', 'Chỉ màu nến', 'Không có'], ['Two peaks within x% ATR, N bars apart, confirmed by breaking the middle low', 'A feeling of two tops', 'Candle colours', 'None'], 0, '', ''],
    ['Kết quả thống kê mẫu hình khác nhau giữa VNINDEX và BTC cho thấy:', 'Different pattern stats on VNINDEX vs BTC show:', ['Hiệu quả phụ thuộc thị trường — cần kiểm định riêng', 'Một trong hai sai dữ liệu', 'Mẫu hình vô dụng', 'Không ý nghĩa'], ['Effectiveness is market-dependent — test separately', 'One has bad data', 'Patterns are useless', 'Meaningless'], 0, '', ''],
    ['Mục tiêu đo theo chiều cao mẫu hình nên được dùng:', 'Height-based measured targets should be used:', ['Như vùng tham chiếu, kết hợp quản lý lệnh động', 'Như con số chắc chắn', 'Không bao giờ', 'Để thêm đòn bẩy'], ['As reference zones with active trade management', 'As certainties', 'Never', 'To add leverage'], 0, '', ''],
    ['Quản lý rủi ro so với độ chính xác của mẫu hình:', 'Risk management versus pattern accuracy:', ['Quản lý rủi ro quan trọng hơn', 'Độ chính xác là tất cả', 'Không cần cả hai', 'Như nhau'], ['Risk management matters more', 'Accuracy is everything', 'Neither needed', 'Equal'], 0, '', ''],
    ['Ngày đảo chiều giảm ở đỉnh mới với khối lượng kỷ lục trong xu hướng tăng dài nên được xử lý:', 'A bearish key reversal at a new high on record volume after a long rally should be handled by:', ['Chặt dừng/chốt lời một phần, chờ xác nhận thêm', 'Mua thêm', 'Bỏ qua hoàn toàn', 'Bán khống toàn lực ngay'], ['Tightening stops/partial profits, awaiting more confirmation', 'Buying more', 'Ignoring it', 'Shorting heavily at once'], 0, '', ''],
    ['Bài học chính về nhận dạng mẫu hình:', 'Key lesson on pattern recognition:', ['Định nghĩa khách quan, đo so với cơ sở, dùng trong bối cảnh và quản lý rủi ro', 'Tin mọi mẫu hình nhìn thấy', 'Mẫu hình vô dụng', 'Không cần kiểm định'], ['Define objectively, measure versus base, use in context with risk control', 'Trust every pattern you see', 'Patterns are useless', 'No testing'], 0, '', '']
  ]);

  /* ================= L3-29 ================= */
  C.addLesson('l3-29', {
    goals: ['Giải thích nguyên lý phân tích đa khung thời gian và tỷ lệ giữa các khung.', 'Phân công vai trò: khung lớn (hướng), khung giữa (thiết lập), khung nhỏ (điểm vào).', 'Xử lý mâu thuẫn giữa các khung và định cỡ theo mức đồng thuận.', 'Định lượng sự đồng thuận đa khung trong hệ thống.'],
    body: () => `
<h3>1. Vì sao cần nhiều khung?</h3>
<p>Mỗi khung thời gian là một "đám đông" khác nhau: nhà đầu tư dài hạn quyết định trên khung tuần, nhà giao dịch lướt sóng trên khung giờ. Xu hướng khung lớn là <b>dòng chảy chính</b>; khung nhỏ là <b>sóng trên dòng chảy</b>. Giao dịch thuận dòng chảy chính nâng xác suất và tỷ lệ lợi nhuận/rủi ro.</p>
<h3>2. Chọn khung và tỷ lệ</h3>
<ul><li>Chọn <b>khung giao dịch chính</b> theo phong cách (ví dụ ngày).</li>
<li>Khung lớn hơn khoảng <b>4–6 lần</b> (tuần) và khung nhỏ hơn khoảng 4–6 lần (1 giờ hoặc 4 giờ).</li>
<li>Khung quá gần nhau cho thông tin trùng lặp; quá xa nhau thì mất liên kết.</li></ul>
<h3>3. Phân công vai trò</h3>
<table class="tbl"><thead><tr><th>Khung</th><th>Vai trò</th><th>Công cụ điển hình</th></tr></thead><tbody>
<tr><td><b>Lớn</b> (tuần)</td><td>Xác định hướng được phép giao dịch, bối cảnh Wyckoff, vùng hỗ trợ/kháng cự lớn</td><td>MA dài, cấu trúc đỉnh đáy, độ dốc</td></tr>
<tr><td><b>Giữa</b> (ngày)</td><td>Tìm thiết lập: điều chỉnh về hỗ trợ, mẫu hình tiếp diễn, dao động quá bán ngược hướng khung lớn</td><td>Dao động, mẫu hình, khối lượng</td></tr>
<tr><td><b>Nhỏ</b> (giờ)</td><td>Điểm vào và dừng lỗ chính xác: khung nhỏ quay lại theo hướng khung lớn</td><td>Phá đỉnh nhỏ, nến đảo chiều, MA ngắn</td></tr></tbody></table>
<div class="callout"><b>Ví dụ</b>: tuần — xu hướng tăng (giá trên MA, đỉnh đáy cao dần). Ngày — điều chỉnh 3 tuần về vùng hỗ trợ cũ, RSI ngày về 35. Giờ — tạo đáy cao hơn và phá đỉnh gần nhất → mua, dừng dưới đáy giờ. Rủi ro nhỏ (dừng theo khung giờ) trong khi mục tiêu theo khung ngày/tuần → tỷ lệ lợi nhuận/rủi ro cao.</div>
${H.mtfAlign()}
<h3>4. Khi các khung mâu thuẫn</h3>
<ul><li>Khung lớn có <b>trọng số cao hơn</b>: tín hiệu mua khung nhỏ ngược xu hướng giảm khung tuần chỉ nên là giao dịch ngắn, quy mô nhỏ — hoặc bỏ qua.</li>
<li>Khung lớn đi ngang: ưu tiên chiến lược dao động trong biên, chốt lời nhanh hơn.</li>
<li>Định cỡ theo mức đồng thuận: ba khung cùng hướng → quy mô đầy đủ; hai khung → giảm; một khung → đứng ngoài.</li></ul>
<h3>5. Định lượng trong hệ thống</h3>
<ul><li>Chấm điểm trạng thái mỗi khung (+1/0/−1 cho từng tiêu chí), nhân trọng số theo khung, cộng thành điểm đồng thuận.</li>
<li>Kiểm định: bộ lọc khung lớn thường <b>giảm số lệnh</b> và <b>tăng chất lượng</b> lệnh; phải kiểm tra ngoài mẫu như mọi quy tắc.</li>
<li>Lưu ý dữ liệu: khung lớn chưa đóng nến (tuần đang diễn ra) có thể thay đổi — dùng nến đã đóng để tránh nhìn trước.</li></ul>`,
    keys: ['Khung lớn = dòng chảy chính, khung nhỏ = sóng; thuận dòng chính nâng xác suất.', 'Tỷ lệ khoảng 4–6 lần giữa các khung.', 'Vai trò: lớn (hướng, bối cảnh), giữa (thiết lập), nhỏ (điểm vào, dừng).', 'Mâu thuẫn: khung lớn trọng số cao; định cỡ theo mức đồng thuận.', 'Định lượng: chấm điểm có trọng số, kiểm định, dùng nến đã đóng để tránh nhìn trước.'],
    terms: [['Multiple time frame analysis', 'Phân tích đa khung thời gian'], ['Higher time frame', 'Khung thời gian lớn'], ['Setup', 'Thiết lập'], ['Trigger', 'Điểm kích hoạt'], ['Alignment', 'Đồng thuận']]
  }, {
    goals: ['Explain multi-timeframe principles and ratios.', 'Assign roles: higher (direction), middle (setup), lower (entry).', 'Handle conflicts and size by alignment.', 'Quantify alignment in systems.'],
    body: () => `
<h3>1. Why</h3><p>Each timeframe is a different crowd; trade with the main current.</p>
<h3>2. Ratios</h3><p>About 4–6× between frames.</p>
<h3>3. Roles</h3><p>Higher: direction and context. Middle: setups. Lower: entries and stops.</p><div class="callout">Weekly uptrend, daily pullback to support with RSI 35, hourly higher low and breakout → buy with an hourly stop and daily/weekly targets.</div>${H.mtfAlign()}
<h3>4. Conflicts</h3><ul><li>Higher frames weigh more.</li><li>Ranging higher frame → range tactics.</li><li>Size by alignment.</li></ul>
<h3>5. Quantification</h3><p>Weighted scores; filters cut trades and raise quality; use completed bars to avoid look-ahead.</p>`,
    keys: ['Why.', 'Ratios.', 'Roles.', 'Conflicts.', 'Quantification.'],
    terms: [['Alignment', 'Agreement across timeframes']]
  }, [
    ['Trong phân tích đa khung, khung lớn đóng vai trò:', 'In multi-timeframe analysis the higher frame serves to:', ['Xác định hướng được phép giao dịch và bối cảnh', 'Điểm vào chính xác', 'Không vai trò', 'Tính phí'], ['Set the allowed direction and context', 'Pinpoint entries', 'No role', 'Compute fees'], 0, '', ''],
    ['Khung nhỏ chủ yếu dùng để:', 'The lower frame is mainly used for:', ['Điểm vào và dừng lỗ chính xác', 'Xác định xu hướng dài hạn', 'Định giá', 'Không gì'], ['Precise entries and stops', 'Long-term trend', 'Valuation', 'Nothing'], 0, '', ''],
    ['Tỷ lệ thường dùng giữa các khung liền kề:', 'The usual ratio between adjacent frames:', ['Khoảng 4–6 lần', '1.1 lần', '100 lần', 'Không quan trọng'], ['About 4–6×', '1.1×', '100×', 'Irrelevant'], 0, '', ''],
    ['Khung giao dịch chính là ngày; khung lớn phù hợp:', 'Main frame daily; a suitable higher frame:', ['Tuần', '15 phút', '1 giờ', 'Năm'], ['Weekly', '15 minutes', '1 hour', 'Yearly'], 0, '', ''],
    ['Khung quá gần nhau (ví dụ ngày và 2 ngày) gây:', 'Frames too close together (daily and 2-day) give:', ['Thông tin trùng lặp', 'Mất liên kết', 'Không ảnh hưởng', 'Dữ liệu sai'], ['Redundant information', 'Lost linkage', 'No effect', 'Bad data'], 0, '', ''],
    ['Thiết lập mua lý tưởng theo đa khung:', 'An ideal multi-frame long setup:', ['Tuần tăng, ngày điều chỉnh về hỗ trợ, giờ quay lại tăng', 'Tuần giảm, ngày giảm, giờ tăng', 'Ba khung giảm', 'Không cần khung lớn'], ['Weekly up, daily pullback to support, hourly turning up', 'Weekly down, daily down, hourly up', 'All three down', 'No higher frame'], 0, '', ''],
    ['Vì sao vào lệnh theo khung nhỏ giúp tỷ lệ lợi nhuận/rủi ro cao?', 'Why do lower-frame entries improve reward/risk?', ['Dừng lỗ nhỏ theo khung nhỏ, mục tiêu theo khung lớn', 'Phí thấp hơn', 'Luôn đúng', 'Không đúng'], ['Small lower-frame stops, higher-frame targets', 'Lower fees', 'Always right', 'False'], 0, '', ''],
    ['Tín hiệu mua khung giờ ngược xu hướng giảm khung tuần nên:', 'An hourly buy against a weekly downtrend should be:', ['Quy mô nhỏ, ngắn hạn, hoặc bỏ qua', 'Quy mô đầy đủ', 'Dùng đòn bẩy', 'Giữ dài hạn'], ['Small, short-term, or skipped', 'Full size', 'Levered', 'Held long term'], 0, '', ''],
    ['Khi khung lớn đi ngang, chiến lược phù hợp:', 'When the higher frame ranges, a fitting tactic:', ['Giao dịch trong biên, chốt lời nhanh hơn', 'Theo xu hướng dài', 'Không giao dịch bao giờ', 'Tăng đòn bẩy'], ['Range trading with quicker profits', 'Long-term trend following', 'Never trade', 'Leverage up'], 0, '', ''],
    ['Định cỡ theo mức đồng thuận: ba khung cùng hướng →', 'Sizing by alignment: all three agree →', ['Quy mô đầy đủ', 'Đứng ngoài', 'Quy mô tối thiểu', 'Bán khống'], ['Full size', 'Stand aside', 'Minimum size', 'Short'], 0, '', ''],
    ['Chỉ một khung ủng hộ tín hiệu →', 'Only one frame supports →', ['Đứng ngoài hoặc rất nhỏ', 'Quy mô đầy đủ', 'Gấp đôi', 'Đòn bẩy'], ['Stand aside or tiny', 'Full size', 'Double', 'Leverage'], 0, '', ''],
    ['Khung có trọng số cao nhất khi mâu thuẫn:', 'The frame weighted most in conflicts:', ['Khung lớn nhất', 'Khung nhỏ nhất', 'Như nhau', 'Ngẫu nhiên'], ['The highest', 'The lowest', 'Equal', 'Random'], 0, '', ''],
    ['Dùng nến tuần chưa đóng trong backtest gây:', 'Using an unfinished weekly bar in a backtest causes:', ['Thiên lệch nhìn trước', 'Thiên lệch sống sót', 'Không vấn đề', 'Đa cộng tuyến'], ['Look-ahead bias', 'Survivorship bias', 'No issue', 'Multicollinearity'], 0, '', ''],
    ['Bộ lọc khung lớn trong hệ thống thường:', 'A higher-frame filter in a system usually:', ['Giảm số lệnh và tăng chất lượng lệnh', 'Tăng số lệnh', 'Không ảnh hưởng', 'Giảm chất lượng'], ['Cuts trade count and improves quality', 'Adds trades', 'No effect', 'Lowers quality'], 0, '', ''],
    ['Khung giữa (ngày) đóng vai trò:', 'The middle frame (daily) serves to:', ['Tìm thiết lập: điều chỉnh, mẫu hình, dao động', 'Xác định xu hướng thế kỷ', 'Không gì', 'Tính thuế'], ['Find setups: pullbacks, patterns, oscillators', 'Century trends', 'Nothing', 'Taxes'], 0, '', ''],
    ['Dao động khung ngày quá bán trong xu hướng tăng khung tuần là:', 'A daily oscillator oversold within a weekly uptrend is:', ['Thiết lập mua tiềm năng', 'Tín hiệu bán', 'Không ý nghĩa', 'Xác nhận giảm'], ['A potential buy setup', 'A sell signal', 'Meaningless', 'Bearish confirmation'], 0, '', ''],
    ['Mỗi khung thời gian đại diện cho:', 'Each timeframe represents:', ['Một nhóm người tham gia với chân trời khác nhau', 'Cùng một nhóm', 'Không ai', 'Chỉ máy móc'], ['A participant group with its own horizon', 'The same group', 'No one', 'Only machines'], 0, '', ''],
    ['Phân tích Wyckoff đa khung: tích luỹ trên khung tuần, Spring trên khung ngày. Ý nghĩa:', 'Wyckoff multi-frame: weekly accumulation, daily spring. Meaning:', ['Thiết lập mua có bối cảnh mạnh', 'Tín hiệu bán', 'Mâu thuẫn', 'Không ý nghĩa'], ['A buy setup with strong context', 'A sell', 'Conflict', 'Meaningless'], 0, '', ''],
    ['Trọng số 3–2–1 cho tuần–ngày–giờ phản ánh:', '3–2–1 weights for weekly–daily–hourly reflect:', ['Khung lớn quan trọng hơn', 'Khung nhỏ quan trọng hơn', 'Ngẫu nhiên', 'Không có lý do'], ['Higher frames matter more', 'Lower frames matter more', 'Random', 'No reason'], 0, '', ''],
    ['Ứng dụng đa khung của Lai Long Master TA (tab Đa khung) giúp:', 'The app’s MTF tab helps:', ['Xem đồng thời trạng thái Wyckoff/VSA trên nhiều khung', 'Tính thuế', 'Đặt lệnh tự động', 'Không gì'], ['See Wyckoff/VSA states across frames at once', 'Compute tax', 'Auto-trade', 'Nothing'], 0, '', ''],
    ['Dừng lỗ trong giao dịch đa khung thường đặt theo:', 'Stops in multi-frame trades are usually set by:', ['Cấu trúc khung nhỏ (đáy khung vào lệnh)', 'Khung tuần', 'Ngẫu nhiên', 'Không đặt'], ['Lower-frame structure (entry-frame low)', 'Weekly frame', 'Random', 'None'], 0, '', ''],
    ['Mục tiêu lợi nhuận trong giao dịch đa khung thường dựa trên:', 'Targets in multi-frame trades are usually based on:', ['Kháng cự/cấu trúc khung giữa hoặc lớn', 'Khung phút', 'Không có', 'Giá vào'], ['Middle/higher-frame resistance and structure', 'Minute charts', 'None', 'Entry'], 0, '', ''],
    ['Nhà đầu tư dài hạn có cần đa khung không?', 'Do long-term investors need multiple frames?', ['Có — tháng/tuần cho hướng, ngày cho thời điểm', 'Không bao giờ', 'Chỉ dùng phút', 'Chỉ dùng năm'], ['Yes — monthly/weekly for direction, daily for timing', 'Never', 'Minutes only', 'Years only'], 0, '', ''],
    ['Lỗi phổ biến khi dùng đa khung:', 'A common multi-frame mistake:', ['Tìm khung nào đó ủng hộ quan điểm sẵn có (thiên kiến xác nhận)', 'Ưu tiên khung lớn', 'Định cỡ theo đồng thuận', 'Dùng nến đã đóng'], ['Hunting for a frame that agrees with you (confirmation bias)', 'Favouring higher frames', 'Alignment sizing', 'Closed bars'], 0, '', ''],
    ['Khung tuần giảm, khung ngày tăng mạnh 3 tuần: đây thường là:', 'Weekly down, daily up strongly for 3 weeks: often:', ['Hồi phục trong xu hướng giảm lớn — cẩn trọng ở kháng cự khung tuần', 'Xu hướng tăng mới chắc chắn', 'Không ý nghĩa', 'Tích luỹ hoàn tất'], ['A rally within a bigger downtrend — beware weekly resistance', 'A certain new uptrend', 'Meaningless', 'Completed accumulation'], 0, '', ''],
    ['Xu hướng khung lớn đổi chiều được xác nhận khi:', 'A higher-frame trend change is confirmed when:', ['Cấu trúc đỉnh/đáy trên chính khung đó thay đổi', 'Khung phút đổi chiều', 'Có tin tức', 'Không bao giờ'], ['Its own swing structure changes', 'Minute charts turn', 'News arrives', 'Never'], 0, '', ''],
    ['Kiểm định quy tắc đa khung cần:', 'Testing a multi-frame rule needs:', ['Đồng bộ dữ liệu đúng thời điểm, dùng nến đã đóng, ngoài mẫu', 'Dùng nến chưa đóng', 'Không kiểm định', 'Chỉ khung phút'], ['Correct time alignment, closed bars, out-of-sample', 'Unfinished bars', 'No testing', 'Minute frames only'], 0, '', ''],
    ['Đa khung giúp giảm loại lỗi nào?', 'Multi-frame analysis helps reduce which error?', ['Giao dịch ngược dòng chảy chính', 'Lỗi chính tả', 'Phí', 'Thuế'], ['Trading against the main current', 'Typos', 'Fees', 'Taxes'], 0, '', ''],
    ['Điểm đồng thuận đa khung ±18 tối đa trong demo nghĩa là:', 'A ±18 maximum alignment score in the demo means:', ['Mọi tiêu chí ở mọi khung cùng hướng', 'Lỗi', 'Trung tính', 'Không có'], ['Every criterion on every frame agrees', 'Error', 'Neutral', 'None'], 0, '', ''],
    ['Bài học chính:', 'Key lesson:', ['Giao dịch thuận khung lớn, thiết lập ở khung giữa, vào lệnh ở khung nhỏ, định cỡ theo đồng thuận', 'Chỉ cần một khung', 'Khung nhỏ quyết định tất cả', 'Không cần đồng thuận'], ['Trade with the higher frame, set up on the middle, enter on the lower, size by alignment', 'One frame suffices', 'Lowest frame decides all', 'No alignment needed'], 0, '', '']
  ]);

  /* ================= L3-30 ================= */
  C.addLesson('l3-30', {
    goals: ['Đánh giá độ tin cậy của mẫu hình nến bằng bối cảnh và thống kê.', 'Kết hợp nến với hỗ trợ/kháng cự, xu hướng và khối lượng.', 'Áp dụng quy tắc xác nhận và quản lý rủi ro cho tín hiệu nến.', 'Tránh các sai lầm phổ biến khi dùng nến.'],
    body: () => `
<h3>1. Nến là ngôn ngữ, không phải hệ thống</h3>
<p>Mẫu hình nến mô tả <b>cán cân cung cầu trong một hoặc vài phiên</b>: ai mở cửa, ai kiểm soát, ai thắng lúc đóng cửa. Khi đứng một mình, nhiều mẫu hình nến có độ tin cậy thống kê <b>chỉ nhỉnh hơn cơ sở một chút</b>. Giá trị thật đến từ <b>vị trí</b> và <b>bối cảnh</b>.</p>
<h3>2. Ba yếu tố bối cảnh</h3>
<table class="tbl"><thead><tr><th>Yếu tố</th><th>Câu hỏi</th></tr></thead><tbody>
<tr><td><b>Vị trí</b></td><td>Nến xuất hiện ở hỗ trợ/kháng cự quan trọng, đường xu hướng, Fibonacci, vùng Wyckoff (Spring, UTAD)?</td></tr>
<tr><td><b>Xu hướng trước đó</b></td><td>Mẫu hình đảo chiều cần có xu hướng để đảo; búa giữa vùng đi ngang ít ý nghĩa</td></tr>
<tr><td><b>Khối lượng và biên độ</b></td><td>Nến đảo chiều với khối lượng lớn, biên độ lớn mạnh hơn nhiều</td></tr></tbody></table>
<h3>3. Xác nhận</h3>
<ul><li>Chờ phiên sau xác nhận (ví dụ sau búa, phiên sau đóng cửa trên đỉnh búa) — đổi một phần lợi nhuận lấy độ tin cậy.</li>
<li>Xác nhận từ khung lớn hơn: nến đảo chiều tuần &gt; nến đảo chiều ngày.</li>
<li>Kết hợp với chỉ báo phương Tây: phân kỳ RSI, gãy đường xu hướng, phá MA.</li></ul>
${H.candles()}
<h3>4. Quản lý rủi ro với nến</h3>
<ul><li>Nến cho <b>điểm dừng tự nhiên</b>: dưới đáy búa, trên đỉnh sao băng, ngoài biên của mẫu hình bao trùm.</li>
<li>Tính tỷ lệ lợi nhuận/rủi ro trước khi vào: nến đảo chiều rất dài có điểm dừng xa → có thể không đáng giao dịch dù tín hiệu đẹp.</li>
<li>Tín hiệu nến bị phủ định (giá phá đáy búa) → thoát ngay; thường là tín hiệu tiếp diễn mạnh theo hướng cũ.</li></ul>
<h3>5. Sai lầm phổ biến</h3>
<ul><li>Coi mọi mẫu hình như tín hiệu độc lập, bỏ qua xu hướng.</li>
<li>Gọi tên mẫu hình một cách lỏng lẻo (thân "gần như" nhỏ, bóng "khá" dài) → không kiểm định được.</li>
<li>Dùng nến trên khung quá nhỏ, nhiều nhiễu; hoặc trên mã thanh khoản thấp (giá mở cửa/đóng cửa không đại diện).</li>
<li>Với thị trường có phiên ATO/ATC (Việt Nam), giá mở và đóng hình thành bởi khớp lệnh định kỳ — đặc điểm này ảnh hưởng tới hình dạng nến.</li></ul>`,
    keys: ['Nến là ngôn ngữ cung cầu; đứng một mình chỉ nhỉnh hơn cơ sở — giá trị ở vị trí và bối cảnh.', 'Bối cảnh: vị trí (S/R, Wyckoff), xu hướng trước đó, khối lượng/biên độ.', 'Xác nhận: phiên sau, khung lớn, chỉ báo phương Tây.', 'Rủi ro: dừng tự nhiên ở biên nến, kiểm tra tỷ lệ lợi nhuận/rủi ro, tín hiệu bị phủ định → thoát.', 'Sai lầm: bỏ qua xu hướng, định nghĩa lỏng, khung quá nhỏ/mã kém thanh khoản, đặc thù ATO/ATC.'],
    terms: [['Confirmation', 'Xác nhận'], ['Negated signal', 'Tín hiệu bị phủ định'], ['Location', 'Vị trí'], ['Shooting star', 'Sao băng'], ['Hammer', 'Búa']]
  }, {
    goals: ['Assess candle reliability with context and statistics.', 'Combine with S/R, trend and volume.', 'Apply confirmation and risk rules.', 'Avoid common mistakes.'],
    body: () => `
<h3>1. Language, not a system</h3><p>Candles describe short-term supply/demand; alone they are only slightly better than base — location and context add value.</p>
<h3>2. Context</h3><p>Location (S/R, Wyckoff events), prior trend, volume and range.</p>
<h3>3. Confirmation</h3><p>Next bar, higher timeframe, Western indicators.</p>${H.candles()}
<h3>4. Risk</h3><ul><li>Natural stops beyond the candle.</li><li>Check reward/risk.</li><li>Negated signals → exit; often strong continuation.</li></ul>
<h3>5. Mistakes</h3><p>Ignoring trend, loose definitions, noisy timeframes or illiquid names, auction-session effects.</p>`,
    keys: ['Context matters.', 'Three factors.', 'Confirmation.', 'Risk.', 'Mistakes.'],
    terms: [['Negated signal', 'Candle signal invalidated by price']]
  }, [
    ['Mẫu hình nến đứng một mình thường có độ tin cậy thống kê:', 'Candle patterns alone typically have statistical reliability:', ['Chỉ nhỉnh hơn cơ sở một chút', 'Rất cao', '100%', 'Âm'], ['Only slightly above base', 'Very high', '100%', 'Negative'], 0, '', ''],
    ['Giá trị thật của nến đến từ:', 'The real value of candles comes from:', ['Vị trí và bối cảnh', 'Tên gọi', 'Màu sắc', 'Số lượng'], ['Location and context', 'Names', 'Colours', 'Counts'], 0, '', ''],
    ['Búa xuất hiện giữa vùng đi ngang không có xu hướng trước:', 'A hammer mid-range with no prior trend:', ['Ít ý nghĩa', 'Tín hiệu mua mạnh', 'Tín hiệu bán', 'Đảo chiều chắc chắn'], ['Means little', 'A strong buy', 'A sell', 'A certain reversal'], 0, '', ''],
    ['Nến đảo chiều tăng tại vùng Spring Wyckoff với khối lượng lớn:', 'A bullish reversal candle at a Wyckoff spring on big volume:', ['Bối cảnh rất mạnh', 'Vô nghĩa', 'Tín hiệu bán', 'Không liên quan'], ['A very strong context', 'Meaningless', 'A sell', 'Unrelated'], 0, '', ''],
    ['Xác nhận búa thường là:', 'Hammer confirmation is usually:', ['Phiên sau đóng cửa trên đỉnh búa', 'Phiên sau giảm', 'Không cần', 'Khối lượng thấp'], ['The next bar closing above the hammer’s high', 'A down next bar', 'Unneeded', 'Low volume'], 0, '', ''],
    ['Đổi lại việc chờ xác nhận là:', 'The cost of waiting for confirmation is:', ['Mất một phần lợi nhuận tiềm năng', 'Rủi ro tăng', 'Không có', 'Phí tăng'], ['Giving up some potential profit', 'Higher risk', 'Nothing', 'Higher fees'], 0, '', ''],
    ['Nến đảo chiều trên khung tuần so với khung ngày thường:', 'A weekly reversal candle versus a daily one is usually:', ['Có ý nghĩa lớn hơn', 'Ít ý nghĩa hơn', 'Như nhau', 'Không liên quan'], ['More significant', 'Less significant', 'Equal', 'Unrelated'], 0, '', ''],
    ['Điểm dừng tự nhiên cho lệnh mua sau búa:', 'The natural stop for a long after a hammer:', ['Dưới đáy búa', 'Trên đỉnh búa', 'Không có', 'MA 200'], ['Below the hammer’s low', 'Above its high', 'None', '200-MA'], 0, '', ''],
    ['Điểm dừng tự nhiên cho lệnh bán sau sao băng:', 'The natural stop for a short after a shooting star:', ['Trên đỉnh sao băng', 'Dưới đáy', 'Không có', 'Giá mở cửa'], ['Above the star’s high', 'Below its low', 'None', 'Open'], 0, '', ''],
    ['Nến đảo chiều rất dài với điểm dừng xa:', 'A very long reversal candle with a distant stop:', ['Có thể không đáng giao dịch nếu tỷ lệ lợi nhuận/rủi ro kém', 'Luôn đáng giao dịch', 'Không có rủi ro', 'Tăng đòn bẩy'], ['May not be worth trading if reward/risk is poor', 'Always worth it', 'No risk', 'Leverage up'], 0, '', ''],
    ['Giá phá đáy búa sau khi mua:', 'Price breaking the hammer’s low after buying:', ['Tín hiệu bị phủ định — thoát ngay', 'Mua thêm', 'Giữ chờ hồi', 'Không ý nghĩa'], ['The signal is negated — exit', 'Buy more', 'Hold for a bounce', 'Meaningless'], 0, '', ''],
    ['Tín hiệu nến bị phủ định thường dẫn tới:', 'A negated candle signal often leads to:', ['Tiếp diễn mạnh theo hướng cũ', 'Đảo chiều chắc chắn', 'Không gì', 'Đi ngang'], ['Strong continuation in the prior direction', 'A sure reversal', 'Nothing', 'A range'], 0, '', ''],
    ['Kết hợp nến với chỉ báo phương Tây, ví dụ:', 'Combining candles with Western tools, e.g.:', ['Nến đảo chiều + phân kỳ RSI + kháng cự', 'Nến + tin đồn', 'Nến + màu sắc', 'Không kết hợp'], ['Reversal candle + RSI divergence + resistance', 'Candles + rumours', 'Candles + colours', 'No combination'], 0, '', ''],
    ['Sai lầm "định nghĩa lỏng" khi dùng nến dẫn tới:', 'Loose candle definitions lead to:', ['Không kiểm định được và thiên kiến xác nhận', 'Độ chính xác cao', 'Không vấn đề', 'Ít tín hiệu'], ['Untestability and confirmation bias', 'High accuracy', 'No issue', 'Fewer signals'], 0, '', ''],
    ['Nến trên mã thanh khoản rất thấp kém tin cậy vì:', 'Candles on very illiquid stocks are unreliable because:', ['Giá mở/đóng cửa có thể do vài lệnh nhỏ, không đại diện', 'Quá chính xác', 'Không có nến', 'Do luật'], ['Opens/closes may reflect a few small orders', 'Too precise', 'No candles', 'Law'], 0, '', ''],
    ['Ở Việt Nam, giá mở và đóng cửa hình thành bởi:', 'In Vietnam, opens and closes form via:', ['Phiên khớp lệnh định kỳ ATO/ATC', 'Khớp lệnh liên tục', 'Giá tham chiếu cố định', 'Không có'], ['Periodic ATO/ATC auctions', 'Continuous matching', 'Fixed reference', 'None'], 0, '', ''],
    ['Nến nhấn chìm giảm tại kháng cự lớn sau xu hướng tăng với khối lượng cao:', 'A bearish engulfing at major resistance after an uptrend on high volume:', ['Tín hiệu cảnh báo mạnh — chặt dừng/chốt lời', 'Tín hiệu mua', 'Vô nghĩa', 'Tích luỹ'], ['A strong warning — tighten stops/take profits', 'A buy', 'Meaningless', 'Accumulation'], 0, '', ''],
    ['Doji tại đỉnh sau xu hướng tăng dài cho thấy:', 'A doji at a top after a long rally shows:', ['Do dự — động lực tăng suy yếu, cần xác nhận', 'Xu hướng tăng tăng tốc', 'Đáy', 'Không gì'], ['Indecision — weakening momentum, needs confirmation', 'Acceleration', 'A bottom', 'Nothing'], 0, '', ''],
    ['Biên độ và khối lượng lớn của nến đảo chiều làm tín hiệu:', 'Large range and volume on a reversal candle make the signal:', ['Mạnh hơn', 'Yếu hơn', 'Không đổi', 'Vô hiệu'], ['Stronger', 'Weaker', 'Unchanged', 'Void'], 0, '', ''],
    ['Dùng nến trên khung 1 phút gặp vấn đề:', 'Using candles on 1-minute charts suffers from:', ['Nhiễu lớn', 'Quá ít dữ liệu', 'Không có nến', 'Luôn chính xác'], ['Heavy noise', 'Too little data', 'No candles', 'Always accurate'], 0, '', ''],
    ['Mẫu hình đảo chiều cần điều kiện gì trước tiên?', 'What does a reversal pattern need first?', ['Một xu hướng trước đó để đảo chiều', 'Thị trường đi ngang', 'Tin tức', 'Không gì'], ['A prior trend to reverse', 'A range', 'News', 'Nothing'], 0, '', ''],
    ['Nến cho biết điều gì rõ nhất?', 'What do candles show most clearly?', ['Ai kiểm soát phiên và ai thắng lúc đóng cửa', 'Giá trị doanh nghiệp', 'Lãi suất', 'Xu hướng 10 năm'], ['Who controlled the session and won at the close', 'Company value', 'Rates', 'A 10-year trend'], 0, '', ''],
    ['Kiểm định thống kê mẫu hình nến cần:', 'Statistically testing candles needs:', ['Định nghĩa định lượng chính xác và so sánh với cơ sở', 'Nhìn bằng mắt', 'Một ví dụ đẹp', 'Không cần'], ['Precise quantitative definitions and base comparison', 'Eyeballing', 'One nice example', 'Nothing'], 0, '', ''],
    ['Tình huống: búa xuất hiện ở hỗ trợ tuần, RSI ngày phân kỳ tăng, khối lượng lớn, phiên sau đóng cửa trên đỉnh búa. Hành động:', 'Case: hammer at weekly support, bullish daily RSI divergence, big volume, next bar closes above the hammer. Action:', ['Mua với dừng dưới đáy búa, kiểm tra tỷ lệ lợi nhuận/rủi ro', 'Bán khống', 'Bỏ qua', 'Mua không dừng'], ['Buy with a stop below the hammer, check reward/risk', 'Short', 'Ignore', 'Buy without a stop'], 0, '', ''],
    ['Tình huống: sao băng trong xu hướng tăng mạnh nhưng không ở kháng cự, khối lượng thấp, phiên sau tăng mạnh. Đánh giá:', 'Case: shooting star in a strong uptrend, not at resistance, low volume, next bar rallies. Assessment:', ['Tín hiệu yếu và đã bị phủ định — tiếp tục theo xu hướng', 'Bán khống ngay', 'Đỉnh chắc chắn', 'Không xác định'], ['Weak and negated — stay with the trend', 'Short now', 'A sure top', 'Undeterminable'], 0, '', ''],
    ['Nến là công cụ phù hợp nhất cho:', 'Candles are best suited to:', ['Thời điểm và quản lý rủi ro trong khung đã xác định bởi phân tích khác', 'Dự báo dài hạn độc lập', 'Định giá', 'Không gì'], ['Timing and risk within a framework from other analysis', 'Standalone long-term forecasts', 'Valuation', 'Nothing'], 0, '', ''],
    ['Kết hợp nến với Wyckoff giúp:', 'Combining candles with Wyckoff helps:', ['Xác nhận các sự kiện như Spring, kiểm tra, UTAD ở cấp độ phiên', 'Thay thế Wyckoff', 'Không gì', 'Tính phí'], ['Confirm events like springs, tests, UTADs at bar level', 'Replace Wyckoff', 'Nothing', 'Fees'], 0, '', ''],
    ['Mẫu hình nến xuất hiện quá thường xuyên trên một mã gợi ý:', 'A candle pattern appearing very often on a stock suggests:', ['Định nghĩa quá lỏng hoặc mã nhiễu — giá trị thông tin thấp', 'Tín hiệu rất mạnh', 'Lỗi dữ liệu chắc chắn', 'Không gì'], ['Too loose a definition or a noisy stock — low information', 'Very strong signals', 'Certain data error', 'Nothing'], 0, '', ''],
    ['Quy tắc xử lý tín hiệu nến tốt:', 'A good rule for candle signals:', ['Vào khi xác nhận, dừng ở biên nến, thoát khi bị phủ định', 'Vào mọi tín hiệu', 'Không dừng', 'Giữ mãi'], ['Enter on confirmation, stop beyond the candle, exit on negation', 'Take every signal', 'No stops', 'Hold forever'], 0, '', ''],
    ['Bài học chính về phân tích nến ứng dụng:', 'Key lesson on applied candlestick analysis:', ['Nến mạnh nhất khi ở đúng vị trí, có bối cảnh, được xác nhận và có quản lý rủi ro', 'Nến là hệ thống hoàn chỉnh', 'Nến vô dụng', 'Không cần bối cảnh'], ['Candles are strongest at the right location, in context, confirmed and risk-managed', 'Candles are a complete system', 'Candles are useless', 'No context needed'], 0, '', '']
  ]);
})(window.LLW);
