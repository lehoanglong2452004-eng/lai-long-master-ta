// © 2026 Lai Long Master TA. Bảo lưu mọi quyền. Không sao chép, chỉnh sửa hay dùng lại khi chưa được phép.
/* CMT Level 3 — Part 5, lessons 25–27: volatility analysis. Written by Lai Long Master TA in its own words. */
(function (L) {
  'use strict';
  const C = L.cmt, H = C.demoHtml, css = C.css;
  const ld = () => `<span class="spinner"></span>${L.t('loading')}`;

  /* ---------- calculator: futures roll / contango decay ---------- */
  H.rollCalc = () => C.calcShell('rollCalc', `${C.num('sp', 15, L.T('VIX giao ngay', 'Spot VIX'), 0.5)}${C.num('f1', 17, L.T('HĐTL tháng 1', 'Month-1 future'), 0.5)}${C.num('f2', 18.5, L.T('HĐTL tháng 2', 'Month-2 future'), 0.5)}${C.num('m', 12, L.T('Số tháng nắm giữ', 'Months held'), 1)}`,
    L.T('Ước lượng hao hụt do cuộn hợp đồng khi cấu trúc kỳ hạn dốc lên (contango) và giao ngay đứng yên.', 'Estimate roll decay in contango when spot stays unchanged.'));
  C.demoRun.rollCalc = box => {
    const run = () => {
      const g = c => +box.querySelector('.' + c).value, roll = (g('f2') - g('f1')) / g('f1'), conv = (g('sp') - g('f1')) / g('f1');
      const left = Math.pow(1 + roll * -1, g('m')) * 100;
      box.querySelector('.demo-out').innerHTML = L.T(`Chênh lệch tháng 2 so với tháng 1 = <b>${(roll * 100).toFixed(1)}%</b>${roll > 0 ? ' (contango)' : ' (backwardation)'}. Nếu VIX giao ngay đứng yên, HĐTL tháng 1 hội tụ về giao ngay: ${(conv * 100).toFixed(1)}% trong tháng tới. Sản phẩm nắm giữ vị thế mua HĐTL cuộn liên tục với độ dốc này sẽ còn khoảng <b>${left.toFixed(0)}%</b> giá trị sau ${g('m')} tháng — chi phí "bảo hiểm" rất lớn nếu không có cú sốc.`,
        `Month-2 vs month-1 = <b>${(roll * 100).toFixed(1)}%</b>${roll > 0 ? ' (contango)' : ' (backwardation)'}. With spot unchanged, month-1 converges to spot: ${(conv * 100).toFixed(1)}% next month. A constantly rolled long-futures product at this slope keeps about <b>${left.toFixed(0)}%</b> after ${g('m')} months — a costly hedge without a shock.`);
    };
    box.querySelectorAll('.d-num').forEach(i => { i.oninput = run; });
    run();
  };

  /* ---------- demo: adaptive moving average (efficiency ratio) ---------- */
  H.kamaDemo = (mk = 'bn_spot', sym = 'BTCUSDT') => C.demoShell('kamaDemo', C.symControls(mk, sym, '1D', ['1W', '1D', '4H']) + `<button class="btn primary d-go">${L.T('Xem', 'Show')}</button>`,
    L.T('Đường trung bình thích nghi (dựa trên tỷ lệ hiệu quả 10 kỳ, nhanh 2 – chậm 30) so với EMA 20. Đường thích nghi đi phẳng khi thị trường nhiễu và bám sát khi xu hướng rõ.', 'Adaptive average (10-bar efficiency ratio, fast 2 – slow 30) vs EMA 20. It flattens in noise and hugs price in clean trends.'));
  C.demoRun.kamaDemo = box => {
    const out = box.querySelector('.demo-out'), el = box.querySelector('.demo-chart');
    C.wire(box, async () => {
      out.innerHTML = ld();
      try {
        const [mk, sym, tf] = C.readSym(box), bars = (await C.loadBars(mk, sym, tf)).slice(-300), c = bars.map(b => b.c);
        const fsc = 2 / 3, ssc = 2 / 31, ka = [], em = [], ers = []; let k = c[0], e = c[0];
        c.forEach((v, i) => {
          let er = 0; if (i >= 10) { const net = Math.abs(v - c[i - 10]); let path = 0; for (let j = i - 9; j <= i; j++) path += Math.abs(c[j] - c[j - 1]); er = path ? net / path : 0; }
          const sc = Math.pow(er * (fsc - ssc) + ssc, 2); k = k + sc * (v - k); e = e + 2 / 21 * (v - e);
          ka.push({ time: bars[i].t, value: k }); em.push({ time: bars[i].t, value: e }); ers.push(er);
        });
        el.innerHTML = '';
        const ch = C.mkChart(el), s = C.candleSeries(ch);
        s.setData(bars.map(b => ({ time: b.t, open: b.o, high: b.h, low: b.l, close: b.c })));
        ch.addLineSeries({ color: css('--accent'), lineWidth: 2, priceLineVisible: false }).setData(ka.slice(10));
        ch.addLineSeries({ color: css('--muted'), lineWidth: 1, lineStyle: 2, priceLineVisible: false }).setData(em.slice(10));
        ch.timeScale().fitContent();
        const er = ers[ers.length - 1];
        out.innerHTML = L.T(`Tỷ lệ hiệu quả hiện tại = <b>${er.toFixed(2)}</b> → ${er > 0.5 ? 'xu hướng rõ, đường thích nghi phản ứng nhanh' : er > 0.25 ? 'trung gian' : 'nhiễu/đi ngang, đường thích nghi gần như phẳng — giảm tín hiệu giả'}. Màu nhấn: đường thích nghi; nét đứt: EMA 20.`,
          `Current efficiency ratio = <b>${er.toFixed(2)}</b> → ${er > 0.5 ? 'clean trend, fast adaptation' : er > 0.25 ? 'intermediate' : 'noisy/sideways, the adaptive line is nearly flat — fewer whipsaws'}. Accent: adaptive line; dashed: EMA 20.`);
      } catch (e) { C.err(out, e); }
    });
  };

  /* ================= L3-25 ================= */
  C.addLesson('l3-25', {
    goals: ['Diễn giải hành vi của VIX: quay về trung bình, tăng vọt, quan hệ bất đối xứng với cổ phiếu.', 'Xây dựng tín hiệu từ VIX: so với trung bình, dải, phân vị, cấu trúc kỳ hạn.', 'Liên hệ mức VIX với lợi nhuận tương lai của cổ phiếu.', 'Áp dụng tư duy VIX cho thị trường không có chỉ số biến động chính thức.'],
    body: () => `
<h3>1. Hành vi đặc trưng của VIX</h3>
<ul><li><b>Quay về trung bình</b>: VIX không có xu hướng dài hạn như giá cổ phiếu; các đợt tăng vọt luôn kết thúc và quay về vùng trung bình dài hạn.</li>
<li><b>Bất đối xứng</b>: VIX tăng nhanh và mạnh khi cổ phiếu giảm, giảm từ từ khi cổ phiếu tăng ("thang máy xuống, cầu thang lên" của cổ phiếu phản chiếu trên VIX).</li>
<li><b>Tụm lại</b>: giai đoạn biến động cao kéo dài; giai đoạn yên ả cũng kéo dài.</li>
<li><b>Mức nền khác nhau theo thời kỳ</b>: "cao" trong giai đoạn yên ả có thể là "bình thường" trong giai đoạn căng thẳng → dùng thước đo <b>tương đối</b>.</li></ul>
<h3>2. Tín hiệu từ VIX</h3>
<table class="tbl"><thead><tr><th>Phương pháp</th><th>Tín hiệu điển hình</th></tr></thead><tbody>
<tr><td>% so với MA 10 ngày</td><td>VIX cao hơn MA10 trên ~20% → sợ hãi quá mức ngắn hạn, cổ phiếu dễ bật lại</td></tr>
<tr><td>Dải Bollinger trên VIX</td><td>VIX đóng cửa ngoài dải trên rồi quay vào trong → tín hiệu đảo chiều của sợ hãi</td></tr>
<tr><td>Phân vị lịch sử (1 năm)</td><td>Phân vị &gt; 90% = sợ hãi cực độ; &lt; 10% = tự mãn</td></tr>
<tr><td><b>Cấu trúc kỳ hạn</b> (VIX / chỉ số biến động 3 tháng)</td><td>Tỷ lệ &gt; 1 (đảo ngược) = căng thẳng cấp tính, thường gần đáy ngắn hạn khi quay lại &lt; 1</td></tr>
<tr><td>VIX so với biến động thực tế</td><td>VIX thường cao hơn biến động thực tế (phần bù rủi ro biến động); chênh lệch âm hiếm và báo căng thẳng</td></tr></tbody></table>
<h3>3. VIX và lợi nhuận tương lai</h3>
<p>Lịch sử cho thấy lợi nhuận trung bình của cổ phiếu trong các tháng sau khi VIX ở mức <b>rất cao</b> thường <b>cao hơn</b> trung bình (mua khi sợ hãi), nhưng <b>biến động cũng lớn hơn</b> — con đường đi đến lợi nhuận đó rất gập ghềnh. VIX thấp kéo dài không phải tín hiệu bán ngay, mà là dấu hiệu <b>rủi ro tự mãn</b> tích tụ; cú sốc tiếp theo sẽ được khuếch đại.</p>
<div class="callout"><b>Ví dụ quy tắc</b>: mua chỉ số khi VIX đóng cửa trên MA10 hơn 20% <b>và</b> chỉ số vẫn trên MA 200 ngày; thoát sau 5 phiên hoặc khi VIX về dưới MA10. Bộ lọc MA 200 tránh mua trong thị trường giá xuống — nơi VIX cao có thể còn cao hơn.</div>
${H.vixCalc()}
<h3>4. Thị trường không có chỉ số biến động chính thức</h3>
<p>Với VNINDEX hoặc crypto, có thể dùng <b>biến động lịch sử ngắn hạn</b> (HV10–HV20) và các phân vị của nó làm đại diện; hoặc biên độ trung bình (ATR%). Các nguyên tắc vẫn đúng: biến động quay về trung bình, tăng vọt khi giá giảm mạnh, đỉnh biến động thường đi cùng đáy giá ngắn hạn.</p>
${H.histVol()}`,
    keys: ['VIX quay về trung bình, tăng nhanh – giảm chậm, tụm lại, mức nền thay đổi → dùng thước đo tương đối.', 'Tín hiệu: % so với MA10, dải Bollinger, phân vị, cấu trúc kỳ hạn, so với biến động thực tế.', 'VIX rất cao → lợi nhuận tương lai trung bình cao hơn nhưng biến động lớn; VIX thấp kéo dài = rủi ro tự mãn.', 'Kết hợp tín hiệu VIX với bộ lọc xu hướng (MA 200).', 'Thị trường không có VIX: dùng HV ngắn hạn, phân vị, ATR% làm đại diện.'],
    terms: [['Mean reversion', 'Quay về trung bình'], ['VIX term structure', 'Cấu trúc kỳ hạn VIX'], ['Volatility risk premium', 'Phần bù rủi ro biến động'], ['Complacency', 'Tự mãn'], ['Realised volatility', 'Biến động thực tế']]
  }, {
    goals: ['Interpret VIX behaviour.', 'Build VIX-based signals.', 'Relate VIX levels to forward returns.', 'Apply VIX thinking where no official index exists.'],
    body: () => `
<h3>1. Behaviour</h3><ul><li>Mean reverting.</li><li>Asymmetric: spikes on declines, drifts lower in rallies.</li><li>Clustering.</li><li>Changing baselines — use relative measures.</li></ul>
<h3>2. Signals</h3><p>% above 10-day MA, Bollinger re-entry, percentiles, term-structure ratio > 1, VIX vs realised volatility.</p>
<h3>3. Forward returns</h3><p>Very high VIX has preceded above-average but volatile returns; persistently low VIX signals complacency risk.</p><div class="callout">Buy when VIX is >20% above its MA10 and the index is above its 200-MA; exit after 5 days or when VIX falls below MA10.</div>${H.vixCalc()}
<h3>4. Without a VIX</h3><p>Use short-term HV, percentiles or ATR% as proxies.</p>${H.histVol()}`,
    keys: ['Behaviour.', 'Signals.', 'Forward returns.', 'Trend filter.', 'Proxies.'],
    terms: [['Term structure', 'Spot vs longer-dated implied volatility']]
  }, [
    ['Đặc điểm nổi bật nhất của VIX so với giá cổ phiếu:', 'VIX’s most distinctive feature versus stock prices:', ['Quay về trung bình', 'Xu hướng tăng dài hạn', 'Ngẫu nhiên tuyệt đối', 'Không biến động'], ['Mean reversion', 'A long-term uptrend', 'Pure randomness', 'No movement'], 0, '', ''],
    ['VIX thường tăng nhanh khi:', 'VIX usually rises fast when:', ['Cổ phiếu giảm mạnh', 'Cổ phiếu tăng chậm', 'Thị trường đóng cửa', 'Lãi suất ổn định'], ['Stocks fall sharply', 'Stocks rise slowly', 'Markets close', 'Rates are stable'], 0, '', ''],
    ['Vì sao nên dùng thước đo tương đối cho VIX?', 'Why use relative measures for VIX?', ['Mức nền của VIX thay đổi theo thời kỳ', 'VIX luôn cố định', 'Do luật', 'Không cần'], ['VIX’s baseline shifts across regimes', 'VIX is fixed', 'Law', 'Unneeded'], 0, '', ''],
    ['VIX = 30, MA10 = 24. VIX cao hơn MA10:', 'VIX 30, MA10 24. VIX above MA10 by:', ['6%', '25%', '20%', '80%'], null, 1, '30/24 − 1.', ''],
    ['VIX đóng cửa ngoài dải Bollinger trên rồi quay vào trong thường được xem là:', 'VIX closing outside its upper band then back inside is seen as:', ['Sợ hãi bắt đầu giảm — tín hiệu tích cực ngắn hạn cho cổ phiếu', 'Tín hiệu bán cổ phiếu', 'Không ý nghĩa', 'Đỉnh dài hạn'], ['Fear starting to fade — short-term bullish for stocks', 'A sell', 'Meaningless', 'A long-term top'], 0, '', ''],
    ['Phân vị VIX 1 năm ở mức 95% nghĩa là:', 'A 1-year VIX percentile of 95% means:', ['VIX cao hơn 95% số ngày trong năm — sợ hãi cực độ', 'Tự mãn', 'Bình thường', 'Lỗi'], ['VIX above 95% of the year’s days — extreme fear', 'Complacency', 'Normal', 'Error'], 0, '', ''],
    ['Tỷ lệ VIX / biến động ngụ ý 3 tháng > 1 cho thấy:', 'VIX / 3-month implied vol > 1 indicates:', ['Cấu trúc kỳ hạn đảo ngược — căng thẳng cấp tính', 'Yên ả', 'Tự mãn', 'Không gì'], ['Inverted term structure — acute stress', 'Calm', 'Complacency', 'Nothing'], 0, '', ''],
    ['VIX thường cao hơn biến động thực tế vì:', 'VIX usually exceeds realised volatility because:', ['Người mua bảo hiểm trả phần bù rủi ro biến động', 'Lỗi tính toán', 'Không đúng', 'Do luật'], ['Insurance buyers pay a volatility risk premium', 'Calculation error', 'False', 'Law'], 0, '', ''],
    ['Lịch sử: sau khi VIX ở mức rất cao, lợi nhuận cổ phiếu các tháng sau thường:', 'Historically after very high VIX, subsequent stock returns are often:', ['Cao hơn trung bình nhưng biến động lớn', 'Âm chắc chắn', 'Bằng 0', 'Thấp và ổn định'], ['Above average but volatile', 'Surely negative', 'Zero', 'Low and stable'], 0, '', ''],
    ['VIX thấp kéo dài nên được hiểu là:', 'Persistently low VIX should be read as:', ['Rủi ro tự mãn tích tụ, không phải tín hiệu bán ngay', 'Tín hiệu bán ngay', 'Tín hiệu mua mạnh', 'Không ý nghĩa'], ['Building complacency risk, not an immediate sell', 'An immediate sell', 'A strong buy', 'Meaningless'], 0, '', ''],
    ['Vì sao quy tắc mua khi VIX cao nên kèm bộ lọc MA 200 của chỉ số?', 'Why add an index 200-MA filter to a high-VIX buy rule?', ['Trong thị trường giá xuống, VIX cao có thể còn cao hơn nữa', 'Để tăng số lệnh', 'Không cần', 'Do luật'], ['In bear markets high VIX can go higher', 'More trades', 'Unneeded', 'Law'], 0, '', ''],
    ['"Thang máy xuống, cầu thang lên" của cổ phiếu phản chiếu trên VIX là:', 'Stocks’ "escalator up, elevator down" mirrored in VIX is:', ['VIX tăng vọt nhanh, giảm từ từ', 'VIX giảm nhanh, tăng chậm', 'Không đối xứng ngược', 'Không có'], ['VIX spikes fast and declines slowly', 'VIX falls fast, rises slowly', 'Nothing', 'None'], 0, '', ''],
    ['Biến động tụm lại nghĩa là:', 'Volatility clustering means:', ['Giai đoạn biến động cao/thấp đều có xu hướng kéo dài', 'Biến động thay đổi ngẫu nhiên mỗi ngày', 'Biến động cố định', 'Không có'], ['High and low volatility regimes both persist', 'Daily random changes', 'Constant volatility', 'None'], 0, '', ''],
    ['Biến động thực tế vượt VIX (phần bù âm) thường xảy ra:', 'Realised volatility exceeding VIX usually occurs:', ['Trong căng thẳng cấp tính', 'Khi thị trường yên', 'Luôn luôn', 'Không bao giờ'], ['During acute stress', 'In calm markets', 'Always', 'Never'], 0, '', ''],
    ['Đại diện cho VIX trên VNINDEX có thể là:', 'A VIX proxy for VNINDEX could be:', ['Biến động lịch sử ngắn hạn (HV10–20) và phân vị của nó', 'Giá vàng', 'Số mã tăng', 'P/E'], ['Short-term historical volatility (HV10–20) and its percentile', 'Gold', 'Advancers', 'P/E'], 0, '', ''],
    ['Đỉnh biến động trên một thị trường thường đi cùng:', 'Volatility peaks usually coincide with:', ['Đáy giá ngắn hạn', 'Đỉnh giá dài hạn', 'Không liên quan', 'Thị trường đi ngang yên'], ['Short-term price lows', 'Long-term price tops', 'Unrelated', 'Quiet ranges'], 0, '', ''],
    ['Tín hiệu VIX nên dùng chủ yếu cho:', 'VIX signals are mainly for:', ['Thời điểm ngắn – trung hạn và đánh giá rủi ro', 'Định giá doanh nghiệp', 'Đầu tư 20 năm', 'Không gì'], ['Short-to-medium timing and risk assessment', 'Company valuation', '20-year investing', 'Nothing'], 0, '', ''],
    ['VIX = 40 → biên độ 1σ 30 ngày ước tính khoảng:', 'VIX 40 → 30-day 1σ move ≈', ['±3.3%', '±11.5%', '±40%', '±1%'], null, 1, '40/√12.', ''],
    ['VIX là thước đo:', 'VIX is a measure of:', ['Kỳ vọng biến động 30 ngày của chỉ số cổ phiếu Mỹ', 'Biến động quá khứ 1 năm', 'Khối lượng', 'Lãi suất'], ['Expected 30-day volatility of the US equity index', 'Past 1-year volatility', 'Volume', 'Rates'], 0, '', ''],
    ['Khi cấu trúc kỳ hạn VIX quay lại dốc lên bình thường sau đảo ngược:', 'When the VIX curve returns to normal contango after inversion:', ['Căng thẳng cấp tính có thể đã qua — thường gần đáy ngắn hạn', 'Khủng hoảng bắt đầu', 'Không ý nghĩa', 'Bán toàn bộ'], ['Acute stress may be passing — often near a short-term low', 'A crisis begins', 'Meaningless', 'Sell all'], 0, '', ''],
    ['Rủi ro khi mua theo tín hiệu VIX cao:', 'Risk of buying on high-VIX signals:', ['Biến động lớn, có thể giảm thêm trước khi hồi', 'Không có rủi ro', 'Lợi nhuận chắc chắn', 'Phí cao'], ['High volatility; prices may fall further first', 'No risk', 'Certain profit', 'High fees'], 0, '', ''],
    ['VIX tăng trong khi chỉ số tăng lên đỉnh mới cho thấy:', 'VIX rising while the index makes new highs shows:', ['Nhu cầu bảo hiểm tăng bất thường — thận trọng', 'Xác nhận lành mạnh', 'Không gì', 'Tín hiệu mua mạnh'], ['Unusual hedging demand — caution', 'Healthy confirmation', 'Nothing', 'A strong buy'], 0, '', ''],
    ['Thoát lệnh trong quy tắc VIX mẫu là:', 'The sample VIX rule exits:', ['Sau 5 phiên hoặc khi VIX về dưới MA10', 'Không bao giờ', 'Khi VIX lên 80', 'Sau 1 năm'], ['After 5 days or when VIX falls below MA10', 'Never', 'At VIX 80', 'After a year'], 0, '', ''],
    ['Không thể giao dịch trực tiếp VIX giao ngay vì:', 'Spot VIX cannot be traded directly because:', ['Nó là một chỉ số tính toán, không phải tài sản', 'Bị cấm', 'Quá đắt', 'Không đúng'], ['It is a calculated index, not an asset', 'Banned', 'Too expensive', 'False'], 0, '', ''],
    ['Biến động của biến động (VIX dao động mạnh) thường cao khi:', 'Vol-of-vol tends to be high when:', ['Thị trường căng thẳng', 'Thị trường yên', 'Luôn thấp', 'Cuối tuần'], ['Markets are stressed', 'Markets are calm', 'Always low', 'Weekends'], 0, '', ''],
    ['Quan hệ VIX – cổ phiếu chủ yếu là:', 'The VIX–stock relationship is mainly:', ['Nghịch chiều và bất đối xứng', 'Cùng chiều', 'Không liên quan', 'Đối xứng hoàn hảo'], ['Inverse and asymmetric', 'Positive', 'Unrelated', 'Perfectly symmetric'], 0, '', ''],
    ['VIX ở phân vị 5% kéo dài cùng margin kỷ lục:', 'VIX at the 5th percentile for long with record margin:', ['Tự mãn cao — giảm rủi ro, chặt dừng', 'Mua mạnh với đòn bẩy', 'Không ý nghĩa', 'Đáy'], ['High complacency — reduce risk, tighten stops', 'Buy with leverage', 'Meaningless', 'A bottom'], 0, '', ''],
    ['Biến động thực tế 20 ngày tăng vọt lên phân vị 98% trên VNINDEX. Theo nguyên tắc quay về trung bình:', 'VNINDEX 20-day realised vol at its 98th percentile. By mean reversion:', ['Biến động nhiều khả năng giảm dần; thường gần vùng đáy ngắn hạn', 'Sẽ tăng mãi', 'Không đổi', 'Bán toàn bộ'], ['Volatility likely subsides; often near short-term lows', 'Rises forever', 'Unchanged', 'Sell all'], 0, '', ''],
    ['Tín hiệu VIX nên kết hợp với:', 'VIX signals should combine with:', ['Xu hướng giá, độ rộng và quản lý rủi ro', 'Chỉ tin tức', 'Không gì', 'Cổ tức'], ['Price trend, breadth and risk management', 'News only', 'Nothing', 'Dividends'], 0, '', ''],
    ['Bài học chính về VIX như chỉ báo:', 'Key lesson on VIX as an indicator:', ['Đo sợ hãi tương đối, quay về trung bình — hữu ích nhất ở cực trị kèm bộ lọc xu hướng', 'Dự báo chính xác đỉnh đáy', 'Vô dụng', 'Luôn bán khi VIX cao'], ['Measures relative fear, mean-reverting — most useful at extremes with trend filters', 'Calls exact tops and bottoms', 'Useless', 'Always sell when high'], 0, '', '']
  ]);

  /* ================= L3-26 ================= */
  C.addLesson('l3-26', {
    goals: ['Giải thích cách định giá và vận động của hợp đồng tương lai VIX.', 'Phân tích contango, backwardation và hao hụt khi cuộn hợp đồng.', 'Đánh giá sản phẩm biến động niêm yết và quyền chọn VIX.', 'Thiết kế phòng ngừa danh mục bằng phái sinh VIX và so sánh với quyền chọn bán chỉ số.'],
    body: () => `
<h3>1. Hợp đồng tương lai VIX</h3>
<ul><li>Giá HĐTL VIX là <b>kỳ vọng của thị trường về VIX tại ngày đáo hạn</b>, không phải VIX hiện tại. Vì VIX quay về trung bình, HĐTL thường nằm giữa VIX giao ngay và mức trung bình dài hạn.</li>
<li>Khi đáo hạn, HĐTL <b>hội tụ</b> về VIX giao ngay.</li>
<li>Thông thường (yên ả): cấu trúc <b>contango</b> — kỳ hạn xa cao hơn kỳ hạn gần và giao ngay. Khi căng thẳng: <b>backwardation</b> — kỳ hạn gần cao hơn.</li>
<li>HĐTL VIX có beta thấp hơn VIX giao ngay: khi VIX giao ngay tăng 50%, HĐTL tháng gần có thể chỉ tăng 20–30%.</li></ul>
<h3>2. Hao hụt khi cuộn</h3>
<p>Sản phẩm giữ vị thế mua HĐTL VIX phải liên tục bán hợp đồng gần đáo hạn (giá thấp hơn) và mua hợp đồng xa hơn (giá cao hơn) trong contango → mất giá đều đặn dù VIX giao ngay đứng yên. Đây là "phí bảo hiểm" rất lớn; các sản phẩm mua biến động dài hạn có lịch sử mất giá gần như hoàn toàn theo thời gian.</p>
${H.rollCalc()}
<h3>3. Quyền chọn VIX</h3>
<ul><li>Định giá dựa trên <b>HĐTL VIX cùng kỳ hạn</b>, không dựa trên VIX giao ngay → call VIX có thể không tăng nhiều như kỳ vọng khi giao ngay tăng.</li>
<li>Quyền chọn kiểu châu Âu, thanh toán tiền mặt.</li>
<li>Skew của quyền chọn VIX thường <b>dương</b> (call OTM đắt) — ngược với quyền chọn chỉ số cổ phiếu.</li></ul>
<h3>4. Phòng ngừa danh mục</h3>
<table class="tbl"><thead><tr><th></th><th>Call VIX / mua HĐTL VIX</th><th>Put chỉ số cổ phiếu</th></tr></thead><tbody>
<tr><td>Hiệu quả trong cú sốc</td><td>Rất mạnh (độ lồi cao) khi biến động bùng nổ</td><td>Trực tiếp theo mức giảm của chỉ số</td></tr>
<tr><td>Chi phí khi yên ả</td><td>Hao hụt contango, phí quyền chọn mất trắng</td><td>Phí thời gian, đắt do skew</td></tr>
<tr><td>Rủi ro cơ sở</td><td>Danh mục giảm từ từ mà VIX không tăng mạnh → phòng ngừa không trả</td><td>Thấp hơn nếu danh mục giống chỉ số</td></tr>
<tr><td>Phù hợp</td><td>Phòng ngừa đuôi cực đoan, quy mô nhỏ</td><td>Phòng ngừa giảm giá nói chung</td></tr></tbody></table>
<ul><li><b>Thời điểm</b>: mua bảo hiểm khi rẻ (VIX thấp, contango phẳng) hiệu quả hơn mua khi đã hoảng loạn.</li>
<li><b>Quy mô</b>: phần nhỏ danh mục (ví dụ 0.5–2%/năm chi phí) cho call OTM; chấp nhận mất phí phần lớn thời gian.</li>
<li><b>Chốt lời phòng ngừa</b>: khi VIX tăng vọt, bán một phần vị thế phòng ngừa (VIX quay về trung bình nhanh).</li>
<li>Với nhà đầu tư Việt Nam: không có phái sinh VIX trong nước; phòng ngừa thực tế qua <b>bán HĐTL VN30F</b>, giảm tỷ trọng, tiền mặt. Bài học về chi phí và thời điểm phòng ngừa vẫn áp dụng.</li></ul>`,
    keys: ['HĐTL VIX = kỳ vọng VIX tại đáo hạn, hội tụ về giao ngay; beta thấp hơn giao ngay.', 'Contango (yên ả) vs backwardation (căng thẳng); hao hụt khi cuộn làm sản phẩm mua biến động mất giá theo thời gian.', 'Quyền chọn VIX định giá theo HĐTL; skew dương.', 'Phòng ngừa bằng VIX: lồi mạnh trong sốc, tốn kém khi yên, rủi ro cơ sở; put chỉ số trực tiếp hơn.', 'Mua bảo hiểm khi rẻ, quy mô nhỏ, chốt lời phòng ngừa khi VIX vọt; Việt Nam dùng VN30F và tiền mặt.'],
    terms: [['Contango', 'Kỳ hạn xa cao hơn kỳ hạn gần'], ['Backwardation', 'Kỳ hạn gần cao hơn kỳ hạn xa'], ['Roll yield', 'Lợi suất cuộn'], ['Convexity', 'Độ lồi'], ['Basis risk', 'Rủi ro cơ sở'], ['Tail hedge', 'Phòng ngừa đuôi']]
  }, {
    goals: ['Explain VIX futures pricing.', 'Analyse contango, backwardation and roll decay.', 'Assess volatility ETPs and VIX options.', 'Design portfolio hedges and compare with index puts.'],
    body: () => `
<h3>1. VIX futures</h3><p>Expected VIX at expiry, converging to spot; usually between spot and the long-run mean; lower beta than spot.</p>
<h3>2. Roll decay</h3><p>Long-futures products lose value in contango even with flat spot.</p>${H.rollCalc()}
<h3>3. VIX options</h3><p>Priced off futures; European, cash-settled; positive skew.</p>
<h3>4. Hedging</h3><p>VIX calls: strong convexity in shocks, costly in calm, basis risk. Index puts: direct but expensive skew. Buy protection when cheap, keep it small, monetise spikes. In Vietnam use VN30F shorts, lower exposure and cash.</p>`,
    keys: ['Futures.', 'Roll decay.', 'Options.', 'Hedging trade-offs.', 'Vietnam practice.'],
    terms: [['Contango', 'Upward-sloping futures curve'], ['Roll yield', 'Return from rolling futures']]
  }, [
    ['Giá HĐTL VIX phản ánh:', 'A VIX future’s price reflects:', ['Kỳ vọng của VIX tại ngày đáo hạn', 'VIX hiện tại', 'Biến động quá khứ', 'Giá chỉ số'], ['Expected VIX at expiry', 'Current VIX', 'Past volatility', 'Index price'], 0, '', ''],
    ['Khi đáo hạn, HĐTL VIX:', 'At expiry a VIX future:', ['Hội tụ về VIX giao ngay', 'Về 0', 'Tăng gấp đôi', 'Không đổi'], ['Converges to spot VIX', 'Goes to 0', 'Doubles', 'Stays the same'], 0, '', ''],
    ['Trạng thái thông thường khi thị trường yên ả:', 'The usual state in calm markets:', ['Contango', 'Backwardation', 'Phẳng tuyệt đối', 'Không xác định'], ['Contango', 'Backwardation', 'Perfectly flat', 'Undefined'], 0, '', ''],
    ['Backwardation trên đường cong VIX thường xuất hiện khi:', 'Backwardation in the VIX curve usually appears when:', ['Thị trường căng thẳng', 'Thị trường yên ả', 'Lãi suất thấp', 'Không bao giờ'], ['Markets are stressed', 'Calm', 'Rates are low', 'Never'], 0, '', ''],
    ['Vì sao sản phẩm mua HĐTL VIX dài hạn mất giá theo thời gian?', 'Why do long VIX-futures products decay over time?', ['Hao hụt khi cuộn trong contango', 'Phí quản lý duy nhất', 'VIX luôn giảm', 'Không đúng'], ['Roll decay in contango', 'Management fees only', 'VIX always falls', 'False'], 0, '', ''],
    ['VIX giao ngay 14, HĐTL tháng 1 = 16. Nếu VIX đứng yên đến đáo hạn, HĐTL:', 'Spot 14, month-1 future 16. If spot stays, the future:', ['Giảm về khoảng 14', 'Tăng lên 18', 'Giữ 16', 'Về 0'], ['Falls to about 14', 'Rises to 18', 'Stays at 16', 'Goes to 0'], 0, '', ''],
    ['Khi VIX giao ngay tăng 50%, HĐTL tháng gần thường:', 'When spot VIX jumps 50%, the front future usually:', ['Tăng ít hơn (beta thấp hơn)', 'Tăng nhiều hơn', 'Giảm', 'Không đổi'], ['Rises less (lower beta)', 'Rises more', 'Falls', 'Unchanged'], 0, '', ''],
    ['Quyền chọn VIX được định giá dựa trên:', 'VIX options are priced off:', ['HĐTL VIX cùng kỳ hạn', 'VIX giao ngay', 'Chỉ số cổ phiếu', 'Lãi suất'], ['The same-expiry VIX future', 'Spot VIX', 'The stock index', 'Rates'], 0, '', ''],
    ['Skew của quyền chọn VIX thường:', 'VIX option skew is usually:', ['Dương (call OTM đắt)', 'Âm như chỉ số', 'Phẳng', 'Không có'], ['Positive (OTM calls rich)', 'Negative like indices', 'Flat', 'None'], 0, '', ''],
    ['Ưu điểm của call VIX như công cụ phòng ngừa:', 'An advantage of VIX calls as hedges:', ['Độ lồi cao trong cú sốc biến động', 'Không tốn chi phí', 'Luôn trả khi thị trường giảm từ từ', 'Không có rủi ro cơ sở'], ['High convexity in volatility shocks', 'No cost', 'Always pays in slow declines', 'No basis risk'], 0, '', ''],
    ['Rủi ro cơ sở của phòng ngừa bằng VIX:', 'Basis risk of VIX hedges:', ['Danh mục giảm từ từ mà VIX không tăng mạnh → phòng ngừa không trả', 'Không có', 'VIX luôn khớp danh mục', 'Phí bằng 0'], ['Portfolios grind lower without a VIX spike → hedge fails to pay', 'None', 'VIX always matches', 'Zero cost'], 0, '', ''],
    ['Thời điểm tốt để mua bảo hiểm biến động:', 'A good time to buy volatility protection:', ['Khi VIX thấp, đường cong phẳng (bảo hiểm rẻ)', 'Khi đang hoảng loạn', 'Khi VIX ở đỉnh', 'Không bao giờ'], ['When VIX is low and the curve flat (cheap)', 'During panic', 'At VIX peaks', 'Never'], 0, '', ''],
    ['Khi VIX tăng vọt, vị thế phòng ngừa nên:', 'When VIX spikes, hedges should be:', ['Chốt lời một phần vì VIX quay về trung bình nhanh', 'Giữ mãi', 'Mua thêm nhiều', 'Bỏ qua'], ['Partly monetised because VIX mean-reverts fast', 'Held forever', 'Added to heavily', 'Ignored'], 0, '', ''],
    ['Chi phí hợp lý cho phòng ngừa đuôi bằng call OTM thường là:', 'A reasonable tail-hedge cost via OTM calls:', ['Phần nhỏ danh mục mỗi năm (ví dụ 0.5–2%)', '20% danh mục', '0%', '100%'], ['A small slice yearly (e.g. 0.5–2%)', '20%', '0%', '100%'], 0, '', ''],
    ['Put chỉ số so với call VIX:', 'Index puts versus VIX calls:', ['Trực tiếp theo mức giảm chỉ số, ít rủi ro cơ sở hơn nếu danh mục giống chỉ số', 'Luôn rẻ hơn', 'Không trả khi chỉ số giảm', 'Không có phí'], ['Pay directly on index declines, less basis risk if the portfolio mirrors the index', 'Always cheaper', 'Don’t pay on declines', 'No premium'], 0, '', ''],
    ['Put chỉ số thường đắt vì:', 'Index puts are often expensive because of:', ['Skew âm — nhu cầu bảo hiểm sập giá cao', 'Không có cầu', 'Lãi suất', 'Không đúng'], ['Negative skew — strong crash-insurance demand', 'No demand', 'Rates', 'False'], 0, '', ''],
    ['Bán HĐTL VIX (đặt cược contango) có rủi ro:', 'Shorting VIX futures (harvesting contango) risks:', ['Lỗ cực lớn khi biến động bùng nổ', 'Không rủi ro', 'Lãi chắc chắn', 'Phí cao duy nhất'], ['Huge losses when volatility explodes', 'No risk', 'Sure profit', 'Only fees'], 0, '', ''],
    ['HĐTL VIX tháng 1 = 18, tháng 2 = 19.8. Độ dốc contango:', 'Month-1 18, month-2 19.8. Contango slope:', ['10%', '1.8%', '18%', '−10%'], null, 0, '', ''],
    ['Nhà đầu tư Việt Nam muốn phòng ngừa danh mục cổ phiếu lớn có thể:', 'A Vietnamese investor hedging a large equity book can:', ['Bán HĐTL VN30F, giảm tỷ trọng, tăng tiền mặt', 'Mua VIX trong nước', 'Mua quyền chọn VIX trong nước', 'Không có cách'], ['Short VN30F, cut exposure, raise cash', 'Buy a local VIX', 'Buy local VIX options', 'No way'], 0, '', ''],
    ['Phòng ngừa bằng bán VN30F có rủi ro cơ sở khi:', 'Hedging with VN30F shorts has basis risk when:', ['Danh mục khác biệt nhiều so với rổ VN30', 'Danh mục giống VN30', 'Không bao giờ', 'Luôn luôn'], ['The portfolio differs a lot from the VN30 basket', 'It mirrors VN30', 'Never', 'Always'], 0, '', ''],
    ['Số hợp đồng VN30F cần bán để phòng ngừa danh mục 3 tỷ, beta 1.2, VN30F = 1.500 điểm, hệ số 100.000đ/điểm:', 'VN30F contracts to short to hedge 3bn, beta 1.2, VN30F 1,500, 100,000 VND/point:', ['20', '24', '12', '30'], null, 1, '3 tỷ × 1.2 / (1.500 × 100.000) = 24.', ''],
    ['Độ lồi của phòng ngừa nghĩa là:', 'Hedge convexity means:', ['Lợi nhuận phòng ngừa tăng nhanh hơn khi cú sốc lớn hơn', 'Lợi nhuận tuyến tính', 'Không lợi nhuận', 'Chỉ lỗ'], ['Hedge payoff grows faster as the shock grows', 'Linear payoff', 'No payoff', 'Only losses'], 0, '', ''],
    ['Vì sao call VIX có thể không tăng nhiều như kỳ vọng khi VIX giao ngay tăng?', 'Why might VIX calls rise less than expected when spot jumps?', ['Chúng dựa trên HĐTL, vốn tăng ít hơn giao ngay', 'Lỗi sàn', 'Không đúng', 'Do thuế'], ['They track futures, which move less than spot', 'Exchange error', 'False', 'Taxes'], 0, '', ''],
    ['Sai lầm phổ biến khi phòng ngừa:', 'A common hedging mistake:', ['Mua bảo hiểm khi đã hoảng loạn và giá bảo hiểm đắt nhất', 'Mua khi rẻ', 'Quy mô nhỏ', 'Chốt lời khi VIX vọt'], ['Buying protection in panic when it is most expensive', 'Buying when cheap', 'Small size', 'Monetising spikes'], 0, '', ''],
    ['Nắm giữ dài hạn sản phẩm mua biến động như một khoản đầu tư:', 'Holding long-volatility products as a long-term investment:', ['Thường mất giá gần như hoàn toàn theo thời gian', 'Sinh lời ổn định', 'Không rủi ro', 'Bắt buộc'], ['Has historically decayed almost completely', 'Earns steady returns', 'Is riskless', 'Is mandatory'], 0, '', ''],
    ['HĐTL VIX thường nằm giữa:', 'VIX futures usually sit between:', ['VIX giao ngay và mức trung bình dài hạn', '0 và VIX', '100 và 200', 'Không xác định'], ['Spot VIX and the long-run mean', '0 and VIX', '100 and 200', 'Undefined'], 0, '', ''],
    ['Đường cong VIX đảo sang backwardation thì sản phẩm mua HĐTL:', 'When the VIX curve flips to backwardation, long-futures products:', ['Có lợi suất cuộn dương', 'Mất giá nhanh hơn', 'Không đổi', 'Bị huỷ'], ['Enjoy positive roll yield', 'Decay faster', 'Unchanged', 'Delisted'], 0, '', ''],
    ['Quyền chọn VIX có kiểu thực hiện:', 'VIX options are exercise style:', ['Châu Âu, thanh toán tiền mặt', 'Mỹ, giao vật chất', 'Không thực hiện', 'Theo hợp đồng'], ['European, cash-settled', 'American, physical', 'Not exercisable', 'Contractual'], 0, '', ''],
    ['Chiến lược phòng ngừa tốt cân nhắc:', 'A good hedging strategy weighs:', ['Chi phí, rủi ro cơ sở, thời điểm, quy mô và quy tắc chốt lời', 'Chỉ chi phí', 'Chỉ lợi nhuận tối đa', 'Không gì'], ['Cost, basis risk, timing, size and monetisation rules', 'Cost only', 'Max profit only', 'Nothing'], 0, '', ''],
    ['Bài học chính về phái sinh VIX:', 'Key lesson on VIX derivatives:', ['Là bảo hiểm hiệu quả nhưng đắt; cần hiểu cấu trúc kỳ hạn và dùng có kỷ luật', 'Là khoản đầu tư sinh lời dài hạn', 'Không rủi ro', 'Giống hệt VIX giao ngay'], ['Effective but costly insurance; know the curve and use with discipline', 'A long-term money-maker', 'Riskless', 'Identical to spot VIX'], 0, '', '']
  ]);

  /* ================= L3-27 ================= */
  C.addLesson('l3-27', {
    goals: ['Áp dụng các kỹ thuật thích nghi theo biến động: trung bình động thích nghi, kênh và dừng theo biến động.', 'Thiết kế hệ thống breakout biến động và bộ lọc chế độ biến động.', 'Kết hợp nhiều hệ thống/khung thời gian để tăng độ bền.', 'Đánh giá thận trọng các kỹ thuật phức tạp (tối ưu thích nghi, học máy).'],
    body: () => `
<h3>1. Vì sao cần thích nghi?</h3>
<p>Tham số cố định (ví dụ MA 50, dừng 3%) giả định thị trường không đổi. Thực tế biến động và tính xu hướng thay đổi liên tục. Kỹ thuật thích nghi để <b>chính dữ liệu</b> điều chỉnh tốc độ phản ứng hoặc khoảng cách dừng.</p>
<h3>2. Trung bình động thích nghi</h3>
<ul><li>Dựa trên <b>tỷ lệ hiệu quả</b> (ER): khi giá đi thẳng (ER cao), đường trung bình nhanh lên; khi nhiễu (ER thấp), đường chậm lại gần như phẳng → giảm tín hiệu giả trong vùng đi ngang.</li>
<li>Biến thể: dùng độ lệch chuẩn hoặc chỉ báo động lượng để điều chỉnh hằng số làm mượt.</li></ul>
${H.kamaDemo()}
<h3>3. Kênh, breakout và dừng theo biến động</h3>
<ul><li><b>Breakout biến động</b>: mua khi giá vượt (giá đóng cửa hôm trước + k × ATR); bán khi xuống dưới (− k × ATR). Ngưỡng tự mở rộng khi biến động cao.</li>
<li><b>Kênh Keltner / Bollinger</b>: dải dựa trên ATR hoặc độ lệch chuẩn.</li>
<li><b>Dừng theo biến động</b>: k × ATR thay vì % cố định → đồng nhất rủi ro giữa các thị trường và thời kỳ.</li></ul>
<h3>4. Bộ lọc chế độ biến động</h3>
<ul><li>Chỉ giao dịch hệ thống xu hướng khi biến động nằm trong dải "bình thường" — biến động quá thấp (không đủ biên độ) hoặc quá cao (rủi ro gap, nhiễu) đều có thể làm giảm hiệu quả.</li>
<li>Biến động nén lại (dải Bollinger hẹp nhất N kỳ) thường đi trước <b>bùng nổ</b> — điều kiện cho hệ thống breakout.</li>
<li>Định cỡ vị thế nghịch với biến động (Bài 2, 5).</li></ul>
<h3>5. Kết hợp nhiều hệ thống và khung thời gian</h3>
<ul><li>Chạy nhiều hệ thống <b>ít tương quan</b> (xu hướng ngắn, xu hướng dài, đảo chiều) và nhiều bộ tham số → đường vốn mượt hơn, ít phụ thuộc một tham số "tối ưu".</li>
<li>Xác nhận đa khung: xu hướng khung lớn làm bộ lọc, tín hiệu khung nhỏ làm điểm vào (Bài 29).</li></ul>
<h3>6. Kỹ thuật phức tạp: thận trọng</h3>
<ul><li><b>Tối ưu thích nghi liên tục</b> (tái tối ưu mỗi kỳ): thực chất là walk-forward — phải đánh giá bằng kết quả ngoài mẫu.</li>
<li><b>Học máy, mạng nơ-ron</b>: rất mạnh trong việc tìm mẫu hình — kể cả mẫu hình nhiễu. Nguy cơ quá khớp lớn; cần dữ liệu ngoài mẫu nghiêm ngặt, ít đặc trưng, có cơ sở kinh tế.</li>
<li>Nguyên tắc: thêm độ phức tạp chỉ khi cải thiện <b>ngoài mẫu</b> đáng kể và bền vững; hệ thống đơn giản thường sống lâu hơn.</li></ul>`,
    keys: ['Kỹ thuật thích nghi để dữ liệu điều chỉnh tốc độ phản ứng/khoảng dừng.', 'Trung bình thích nghi theo ER: nhanh khi xu hướng, phẳng khi nhiễu.', 'Breakout biến động (± k × ATR), kênh Keltner/Bollinger, dừng theo ATR.', 'Bộ lọc chế độ biến động; nén biến động trước bùng nổ; định cỡ nghịch biến động.', 'Kết hợp hệ thống ít tương quan, đa tham số, đa khung.', 'Kỹ thuật phức tạp (tái tối ưu, học máy): chỉ dùng khi cải thiện ngoài mẫu bền vững.'],
    terms: [['Adaptive moving average', 'Trung bình động thích nghi'], ['Volatility breakout', 'Breakout biến động'], ['Keltner channel', 'Kênh Keltner'], ['Volatility squeeze', 'Nén biến động'], ['Ensemble of systems', 'Tổ hợp hệ thống'], ['Machine learning', 'Học máy']]
  }, {
    goals: ['Apply volatility-adaptive techniques.', 'Design volatility breakouts and regime filters.', 'Combine systems and timeframes.', 'Treat complex techniques with caution.'],
    body: () => `
<h3>1. Why adapt</h3><p>Fixed parameters assume a constant market; let data set speed and stop distance.</p>
<h3>2. Adaptive averages</h3><p>Efficiency-ratio-driven smoothing: fast in clean trends, flat in noise.</p>${H.kamaDemo()}
<h3>3. Volatility channels and stops</h3><p>Breakouts at prior close ± k×ATR, Keltner/Bollinger channels, ATR stops.</p>
<h3>4. Volatility regimes</h3><p>Trade within normal volatility bands; squeezes precede expansions; size inversely to volatility.</p>
<h3>5. Combining</h3><p>Lowly correlated systems, parameter sets and timeframes.</p>
<h3>6. Complexity</h3><p>Continuous re-optimisation is walk-forward; machine learning overfits easily — add complexity only for durable out-of-sample gains.</p>`,
    keys: ['Adaptation.', 'Adaptive averages.', 'Volatility tools.', 'Regimes.', 'Combining.', 'Caution with complexity.'],
    terms: [['Volatility squeeze', 'Contracted volatility before expansion']]
  }, [
    ['Kỹ thuật thích nghi nhằm:', 'Adaptive techniques aim to:', ['Để dữ liệu điều chỉnh tốc độ phản ứng hoặc khoảng dừng', 'Cố định mọi tham số', 'Tăng phí', 'Không mục đích'], ['Let data adjust speed or stop distance', 'Fix all parameters', 'Raise fees', 'No purpose'], 0, '', ''],
    ['Trung bình động thích nghi theo ER sẽ:', 'An ER-driven adaptive average will:', ['Nhanh khi xu hướng rõ, chậm/phẳng khi nhiễu', 'Luôn nhanh', 'Luôn chậm', 'Không đổi'], ['Speed up in clean trends, flatten in noise', 'Always be fast', 'Always be slow', 'Never change'], 0, '', ''],
    ['Lợi ích chính của đường thích nghi trong thị trường đi ngang:', 'The main benefit of an adaptive line in ranges:', ['Giảm tín hiệu giả', 'Tăng số lệnh', 'Bắt đỉnh đáy', 'Không có'], ['Fewer whipsaws', 'More trades', 'Picks tops/bottoms', 'None'], 0, '', ''],
    ['Giá tăng 8 trong 10 phiên, tổng quãng đường 10. ER =', 'Price +8 over 10 bars, path 10. ER =', ['0.8', '0.08', '1.25', '8'], null, 0, '', ''],
    ['Breakout biến động mua khi giá vượt:', 'A volatility breakout buys when price exceeds:', ['Giá đóng cửa hôm trước + k × ATR', 'MA 200', 'Đỉnh lịch sử', 'Giá mở cửa − 1%'], ['Prior close + k × ATR', 'The 200-MA', 'The all-time high', 'Open − 1%'], 0, '', ''],
    ['Ưu điểm của ngưỡng dựa trên ATR:', 'The advantage of ATR-based thresholds:', ['Tự điều chỉnh theo biến động hiện tại', 'Cố định', 'Không cần dữ liệu', 'Luôn hẹp'], ['Self-adjusting to current volatility', 'Fixed', 'No data', 'Always narrow'], 0, '', ''],
    ['Kênh Keltner dựa trên:', 'Keltner channels are based on:', ['ATR quanh một đường trung bình', 'Độ lệch chuẩn', 'Fibonacci', 'Khối lượng'], ['ATR around an average', 'Standard deviation', 'Fibonacci', 'Volume'], 0, '', ''],
    ['Dừng theo k × ATR thay vì % cố định giúp:', 'k × ATR stops instead of fixed % help:', ['Đồng nhất rủi ro giữa các thị trường và thời kỳ', 'Tăng rủi ro', 'Không ảnh hưởng', 'Giảm dữ liệu'], ['Equalise risk across markets and periods', 'Raise risk', 'No effect', 'Reduce data'], 0, '', ''],
    ['Nén biến động (dải Bollinger hẹp nhất N kỳ) thường đi trước:', 'A volatility squeeze usually precedes:', ['Bùng nổ biến động', 'Thị trường đóng cửa', 'Không gì', 'Biến động thấp mãi'], ['A volatility expansion', 'Market closure', 'Nothing', 'Perpetually low vol'], 0, '', ''],
    ['Bộ lọc chế độ biến động có thể loại bỏ giao dịch khi:', 'A volatility-regime filter may skip trades when:', ['Biến động quá thấp hoặc quá cao so với bình thường', 'Biến động bình thường', 'Luôn luôn', 'Không bao giờ'], ['Volatility is abnormally low or high', 'Normal volatility', 'Always', 'Never'], 0, '', ''],
    ['Định cỡ vị thế theo biến động:', 'Volatility-based sizing:', ['Nghịch với biến động — biến động cao thì vị thế nhỏ', 'Thuận với biến động', 'Không liên quan', 'Cố định'], ['Inverse to volatility — smaller when vol is high', 'Proportional to vol', 'Unrelated', 'Fixed'], 0, '', ''],
    ['Kết hợp nhiều hệ thống ít tương quan giúp:', 'Combining lowly correlated systems helps:', ['Đường vốn mượt hơn, giảm phụ thuộc tham số', 'Tăng sụt giảm', 'Không gì', 'Tăng phí duy nhất'], ['Smoother equity, less parameter dependence', 'Bigger drawdowns', 'Nothing', 'Only more fees'], 0, '', ''],
    ['Tái tối ưu tham số mỗi kỳ thực chất là:', 'Re-optimising parameters every period is essentially:', ['Walk-forward — phải đánh giá ngoài mẫu', 'Không cần kiểm định', 'Luôn tốt hơn', 'Quá khớp chắc chắn'], ['Walk-forward — judge out of sample', 'Testing-free', 'Always better', 'Certain overfitting'], 0, '', ''],
    ['Rủi ro lớn nhất của học máy trong giao dịch:', 'The biggest risk of machine learning in trading:', ['Quá khớp nhiễu', 'Quá đơn giản', 'Không tìm được mẫu hình', 'Không có'], ['Overfitting noise', 'Too simple', 'Finds no patterns', 'None'], 0, '', ''],
    ['Nguyên tắc thêm độ phức tạp vào hệ thống:', 'The rule for adding complexity:', ['Chỉ khi cải thiện ngoài mẫu đáng kể và bền vững', 'Càng phức tạp càng tốt', 'Khi backtest đẹp hơn', 'Không bao giờ'], ['Only for meaningful, durable out-of-sample gains', 'More is better', 'When backtests look nicer', 'Never'], 0, '', ''],
    ['Vì sao hệ thống đơn giản thường sống lâu hơn?', 'Why do simple systems often survive longer?', ['Ít tham số, ít quá khớp, dựa trên hiệu ứng bền', 'Do may mắn', 'Không đúng', 'Do luật'], ['Few parameters, less overfitting, robust effects', 'Luck', 'False', 'Law'], 0, '', ''],
    ['Biến động cao bất thường có thể làm hệ thống xu hướng kém vì:', 'Abnormally high volatility can hurt trend systems because of:', ['Nhiễu và rủi ro gap tăng', 'Không có xu hướng bao giờ', 'Phí giảm', 'Không đúng'], ['More noise and gap risk', 'Never trends', 'Lower fees', 'False'], 0, '', ''],
    ['Biến động quá thấp có thể làm hệ thống kém vì:', 'Very low volatility can hurt systems because:', ['Biên độ không đủ để vượt chi phí', 'Quá nhiều lợi nhuận', 'Không có dữ liệu', 'Không đúng'], ['Ranges are too small to beat costs', 'Too much profit', 'No data', 'False'], 0, '', ''],
    ['Hệ thống breakout phù hợp nhất ngay sau:', 'Breakout systems fit best right after:', ['Giai đoạn nén biến động', 'Cao trào biến động', 'Đỉnh parabol', 'Gap kiệt sức'], ['A volatility squeeze', 'A volatility climax', 'A parabolic top', 'An exhaustion gap'], 0, '', ''],
    ['Biến thể thích nghi khác của trung bình động có thể dùng:', 'Another adaptive average variant may use:', ['Độ lệch chuẩn hoặc chỉ báo động lượng để điều chỉnh hằng số làm mượt', 'Màu sắc', 'Ngày trong tuần', 'Không có'], ['Standard deviation or momentum to adjust smoothing', 'Colours', 'Weekdays', 'None'], 0, '', ''],
    ['Xác nhận đa khung trong hệ thống: khung lớn đóng vai trò:', 'In multi-timeframe systems, the higher timeframe acts as:', ['Bộ lọc hướng', 'Điểm vào chính xác', 'Thay dừng lỗ', 'Không vai trò'], ['A direction filter', 'Precise entry', 'Stop replacement', 'No role'], 0, '', ''],
    ['Mạng nơ-ron với hàng trăm đặc trưng trên 5 năm dữ liệu ngày dễ:', 'A neural net with hundreds of features on 5 years of daily data is prone to:', ['Quá khớp nghiêm trọng', 'Tổng quát hoá hoàn hảo', 'Không học gì', 'Không rủi ro'], ['Severe overfitting', 'Perfect generalisation', 'Learning nothing', 'No risk'], 0, '', ''],
    ['Đặc trưng đầu vào cho mô hình học máy nên:', 'ML input features should be:', ['Ít, có cơ sở kinh tế/kỹ thuật rõ ràng', 'Càng nhiều càng tốt', 'Ngẫu nhiên', 'Dữ liệu tương lai'], ['Few, with clear economic/technical rationale', 'As many as possible', 'Random', 'Future data'], 0, '', ''],
    ['Đa dạng hoá tham số khác tối ưu một tham số ở chỗ:', 'Parameter diversification differs from single optimisation in:', ['Giảm rủi ro tham số "tối ưu" chỉ là may mắn', 'Tăng quá khớp', 'Giống hệt', 'Không có lợi'], ['Cutting the risk that the "optimal" set was luck', 'More overfitting', 'Being identical', 'No benefit'], 0, '', ''],
    ['ER = 0.15 trên VNINDEX trong 3 tháng gợi ý:', 'An ER of 0.15 on VNINDEX over 3 months suggests:', ['Thị trường nhiễu — hệ thống xu hướng dễ bị tín hiệu giả', 'Xu hướng mạnh', 'Breakout chắc chắn', 'Không ý nghĩa'], ['A noisy market — trend systems prone to whipsaws', 'A strong trend', 'A certain breakout', 'Meaningless'], 0, '', ''],
    ['Khoảng dừng 2 × ATR với ATR tăng gấp đôi sau cú sốc sẽ:', 'A 2 × ATR stop when ATR doubles after a shock will:', ['Rộng gấp đôi — nên giảm quy mô để giữ rủi ro', 'Hẹp lại', 'Không đổi', 'Bỏ đi'], ['Double in width — reduce size to keep risk constant', 'Narrow', 'Stay the same', 'Be removed'], 0, '', ''],
    ['Kỹ thuật nâng cao nên được đánh giá bằng:', 'Advanced techniques should be judged by:', ['Kết quả ngoài mẫu, độ bền và khả năng thực hiện', 'Độ phức tạp', 'Tên gọi', 'Kết quả trong mẫu'], ['Out-of-sample results, robustness and executability', 'Complexity', 'Name', 'In-sample results'], 0, '', ''],
    ['Hệ thống xu hướng ngắn + xu hướng dài + đảo chiều trong một danh mục là ví dụ:', 'Short trend + long trend + mean reversion in one portfolio is an example of:', ['Tổ hợp hệ thống', 'Quá khớp', 'Martingale', 'Không có'], ['An ensemble of systems', 'Overfitting', 'Martingale', 'None'], 0, '', ''],
    ['Bài học chính về kỹ thuật nâng cao:', 'Key lesson on advanced techniques:', ['Thích nghi theo biến động và kết hợp đơn giản thường hiệu quả hơn mô hình phức tạp quá khớp', 'Càng phức tạp càng thắng', 'Không cần biến động', 'Bỏ kiểm định'], ['Volatility adaptation and simple combinations usually beat overfit complexity', 'Complexity always wins', 'Ignore volatility', 'Skip testing'], 0, '', ''],
    ['Đường thích nghi gần như phẳng trong khi giá dao động quanh nó cho thấy:', 'An adaptive line staying nearly flat while price oscillates around it shows:', ['Thị trường đang nhiễu/đi ngang — hạn chế giao dịch theo xu hướng', 'Xu hướng rất mạnh', 'Lỗi tính toán', 'Tín hiệu mua chắc chắn'], ['A noisy, sideways market — limit trend trading', 'A very strong trend', 'A calculation error', 'A sure buy'], 0, '', '']
  ]);
})(window.LLW);
