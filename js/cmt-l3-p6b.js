// © 2026 Lai Long Master TA. Bảo lưu mọi quyền. Không sao chép, chỉnh sửa hay dùng lại khi chưa được phép.
/* CMT Level 3 — Part 6b, lessons 31–33: progressive charting, real-world synthesis. Written by Lai Long Master TA in its own words. */
(function (L) {
  'use strict';
  const C = L.cmt, H = C.demoHtml, css = C.css;
  const ld = () => `<span class="spinner"></span>${L.t('loading')}`;

  /* ---------- demo: bar-by-bar replay ---------- */
  H.replay = (mk = 'vn_stock', sym = 'VNINDEX') => C.demoShell('replay', C.symControls(mk, sym, '1D', ['1W', '1D', '4H']) + `<button class="btn primary d-go">${L.T('Tải', 'Load')}</button><button class="btn d-next">${L.T('▶ Nến tiếp', '▶ Next bar')}</button><button class="btn d-next5">⏩ +5</button><button class="btn d-all">${L.T('Hiện tất cả', 'Show all')}</button>`,
    L.T('Biểu đồ dừng ở 80 nến trước hiện tại. Trước mỗi lần bấm "Nến tiếp", hãy viết ra: xu hướng là gì, kịch bản chính, điểm vô hiệu, bạn sẽ làm gì. Sau đó so với diễn biến thật.', 'The chart stops 80 bars before the present. Before each "Next bar", write down the trend, main scenario, invalidation point and action, then compare with what happens.'));
  C.demoRun.replay = box => {
    const out = box.querySelector('.demo-out'), el = box.querySelector('.demo-chart');
    let bars = [], k = 0, s = null, ma = null, ch = null;
    const maAt = i => { if (i < 19) return null; let m = 0; for (let j = i - 19; j <= i; j++) m += bars[j].c; return m / 20; };
    const show = () => { out.innerHTML = L.T(`Đang ở nến ${k}/${bars.length} · ẩn ${bars.length - k} nến. Đóng cửa: <b>${L.fmtP(bars[k - 1].c)}</b>.`, `Bar ${k}/${bars.length} · ${bars.length - k} hidden. Close: <b>${L.fmtP(bars[k - 1].c)}</b>.`); };
    const step = n => { if (!s) return; for (let t = 0; t < n && k < bars.length; t++, k++) { const b = bars[k]; s.update({ time: b.t, open: b.o, high: b.h, low: b.l, close: b.c }); const m = maAt(k); if (m != null) ma.update({ time: b.t, value: m }); } show(); };
    box.querySelector('.d-next').onclick = () => step(1);
    box.querySelector('.d-next5').onclick = () => step(5);
    box.querySelector('.d-all').onclick = () => step(bars.length);
    C.wire(box, async () => {
      out.innerHTML = ld();
      try {
        const [mk, sym, tf] = C.readSym(box);
        bars = (await C.loadBars(mk, sym, tf)).slice(-300); k = Math.max(30, bars.length - 80);
        el.innerHTML = ''; ch = C.mkChart(el); s = C.candleSeries(ch);
        ma = ch.addLineSeries({ color: css('--accent'), lineWidth: 1, priceLineVisible: false, lastValueVisible: false });
        s.setData(bars.slice(0, k).map(b => ({ time: b.t, open: b.o, high: b.h, low: b.l, close: b.c })));
        ma.setData(bars.slice(0, k).map((b, i) => ({ time: b.t, value: maAt(i) })).filter(p => p.value != null));
        ch.timeScale().fitContent(); show();
      } catch (e) { C.err(out, e); }
    });
  };

  /* ---------- calculator: trade plan worksheet ---------- */
  H.planSheet = () => C.calcShell('planSheet', `${C.num('eq', 500, L.T('Vốn (triệu)', 'Equity (M)'), 10)}${C.num('rk', 1, L.T('Rủi ro %', 'Risk %'), 0.25)}${C.num('en', 25, L.T('Giá vào (nghìn)', 'Entry (k)'), 0.1)}${C.num('st', 23.5, L.T('Dừng lỗ (nghìn)', 'Stop (k)'), 0.1)}${C.num('tg', 29.5, L.T('Mục tiêu (nghìn)', 'Target (k)'), 0.1)}${C.num('p', 45, L.T('Xác suất ước tính đạt mục tiêu %', 'Est. P(target) %'), 1)}`,
    L.T('Phiếu kế hoạch giao dịch: kiểm tra tỷ lệ lợi nhuận/rủi ro, kỳ vọng và khối lượng trước khi vào lệnh.', 'Trade-plan worksheet: check reward/risk, expectancy and size before entering.'));
  C.demoRun.planSheet = box => {
    const run = () => {
      const g = c => +box.querySelector('.' + c).value, risk = Math.abs(g('en') - g('st')), rew = Math.abs(g('tg') - g('en')), rr = risk ? rew / risk : 0, p = g('p') / 100;
      const ex = p * rr - (1 - p), sh = risk ? Math.floor(g('eq') * 1e6 * g('rk') / 100 / (risk * 1000) / 100) * 100 : 0;
      const ok = [[rr >= 2, L.T('Lợi nhuận/rủi ro ≥ 2', 'Reward/risk ≥ 2')], [ex > 0, L.T('Kỳ vọng dương', 'Positive expectancy')], [g('rk') <= 2, L.T('Rủi ro ≤ 2% vốn', 'Risk ≤ 2% of equity')], [sh * g('en') * 1000 <= g('eq') * 1e6, L.T('Không cần đòn bẩy', 'No leverage needed')]];
      box.querySelector('.demo-out').innerHTML = L.T(`Lợi nhuận/rủi ro = <b>${rr.toFixed(2)}</b> · kỳ vọng ≈ <b>${ex.toFixed(2)}R</b> · khối lượng ≈ <b>${sh.toLocaleString()}</b> cổ phiếu (lô 100) · giá trị ≈ ${(sh * g('en') / 1000).toFixed(1)} triệu.`, `Reward/risk = <b>${rr.toFixed(2)}</b> · expectancy ≈ <b>${ex.toFixed(2)}R</b> · size ≈ <b>${sh.toLocaleString()}</b> shares (lots of 100) · value ≈ ${(sh * g('en') / 1000).toFixed(1)}M.`) +
        `<ul>${ok.map(o => `<li style="color:var(${o[0] ? '--up' : '--down'})">${o[0] ? '✔' : '✘'} ${o[1]}</li>`).join('')}</ul>` + (ok.every(o => o[0]) ? L.T('<b>Kế hoạch đạt yêu cầu.</b>', '<b>Plan passes.</b>') : L.T('<b>Chưa đạt — điều chỉnh điểm vào/dừng/mục tiêu hoặc bỏ qua giao dịch.</b>', '<b>Fails — adjust entry/stop/target or skip.</b>'));
    };
    box.querySelectorAll('.d-num').forEach(i => { i.oninput = run; });
    run();
  };

  /* ================= L3-31 ================= */
  C.addLesson('l3-31', {
    goals: ['Phân tích biểu đồ theo tiến trình từng phiên như khi giao dịch thật.', 'Đặt và cập nhật kịch bản, điểm vô hiệu và kế hoạch hành động ở mỗi bước.', 'Dùng nguyên lý đổi vai (polarity) và tín hiệu nến tại vùng then chốt.', 'Tránh thiên kiến nhận thức muộn khi học từ biểu đồ quá khứ.'],
    body: () => `
<h3>1. Vì sao phân tích theo tiến trình?</h3>
<p>Nhìn một biểu đồ đã hoàn chỉnh, mọi đỉnh đáy đều "hiển nhiên" — đó là <b>thiên kiến nhận thức muộn</b>. Khi giao dịch thật, bạn chỉ thấy đến phiên hiện tại và phải quyết định trong sự không chắc chắn. Biểu đồ diễn tiến (progressive charting) là luyện tập phân tích <b>từng phiên một</b>: dừng lại, nhận định, lập kế hoạch, rồi mới xem phiên tiếp theo.</p>
<h3>2. Quy trình ở mỗi bước</h3>
<ol><li><b>Bối cảnh</b>: xu hướng khung lớn, vị trí hiện tại trong cấu trúc (gần hỗ trợ/kháng cự? trong vùng giao dịch Wyckoff nào?).</li>
<li><b>Tín hiệu mới</b>: phiên vừa rồi cho thêm thông tin gì (nến đảo chiều, phá vỡ, khối lượng bất thường)?</li>
<li><b>Kịch bản chính và thay thế</b>, kèm <b>điểm vô hiệu</b> của kịch bản chính.</li>
<li><b>Hành động</b>: chờ, vào, giữ, chặt dừng, chốt một phần, thoát — với lý do.</li>
<li><b>Tỷ lệ lợi nhuận/rủi ro</b> tại thời điểm đó — không phải tại điểm đẹp nhất nhìn lại.</li></ol>
${H.replay()}
<h3>3. Nguyên lý đổi vai và vùng then chốt</h3>
<ul><li>Hỗ trợ bị phá thường trở thành <b>kháng cự</b> và ngược lại. Lần quay lại kiểm tra vùng đổi vai là cơ hội vào lệnh với điểm dừng rõ ràng.</li>
<li>Tín hiệu nến (búa, nhấn chìm, sao băng) có giá trị cao nhất khi xuất hiện <b>đúng tại</b> vùng then chốt này.</li>
<li>Vùng then chốt là <b>vùng</b>, không phải một đường mảnh; giá có thể đâm qua một chút rồi quay lại.</li></ul>
<h3>4. Cập nhật quan điểm</h3>
<ul><li>Quan điểm phải thay đổi khi bằng chứng thay đổi — không "yêu" kịch bản ban đầu.</li>
<li>Nhiều tín hiệu trái chiều liên tiếp (thất bại breakout, nến đảo chiều tại kháng cự, khối lượng giảm khi tăng) → giảm mức tự tin, giảm quy mô.</li>
<li>Ghi lại quyết định ở mỗi bước để so sánh sau — đây là cách học hiệu quả nhất từ biểu đồ.</li></ul>`,
    keys: ['Biểu đồ hoàn chỉnh gây thiên kiến nhận thức muộn; phân tích theo tiến trình mô phỏng quyết định thật.', 'Mỗi bước: bối cảnh → tín hiệu mới → kịch bản chính/thay thế + điểm vô hiệu → hành động → lợi nhuận/rủi ro tại thời điểm đó.', 'Đổi vai hỗ trợ/kháng cự; tín hiệu nến mạnh nhất tại vùng then chốt; vùng chứ không phải đường.', 'Cập nhật quan điểm theo bằng chứng; nhiều tín hiệu trái chiều → giảm tự tin và quy mô; ghi nhật ký từng bước.'],
    terms: [['Progressive charting', 'Biểu đồ diễn tiến'], ['Polarity', 'Đổi vai hỗ trợ/kháng cự'], ['Invalidation point', 'Điểm vô hiệu'], ['Bar replay', 'Phát lại từng nến']]
  }, {
    goals: ['Analyse charts bar by bar as in live trading.', 'Set and update scenarios, invalidation and actions at each step.', 'Use polarity and candle signals at key zones.', 'Avoid hindsight when learning from past charts.'],
    body: () => `
<h3>1. Why progressive?</h3><p>Completed charts breed hindsight; analyse one bar at a time and decide before seeing the next.</p>
<h3>2. Each step</h3><ol><li>Context</li><li>New information</li><li>Main/alternative scenario + invalidation</li><li>Action with reasons</li><li>Reward/risk at that moment</li></ol>${H.replay()}
<h3>3. Polarity and key zones</h3><p>Broken support becomes resistance; candle signals matter most at these zones; zones, not lines.</p>
<h3>4. Updating</h3><p>Change views with evidence, reduce size on conflicting signals, journal each step.</p>`,
    keys: ['Hindsight.', 'Step process.', 'Polarity.', 'Updating.'],
    terms: [['Polarity', 'Support/resistance role reversal']]
  }, [
    ['Mục đích chính của biểu đồ diễn tiến:', 'The main purpose of progressive charting:', ['Mô phỏng quyết định thật trong sự không chắc chắn, tránh nhận thức muộn', 'Vẽ đẹp hơn', 'Dự báo chắc chắn', 'Không có'], ['Simulate real decisions under uncertainty, avoiding hindsight', 'Prettier charts', 'Certain forecasts', 'None'], 0, '', ''],
    ['Nhìn biểu đồ đã hoàn chỉnh, đỉnh đáy trông "hiển nhiên" là do:', 'On completed charts, tops and bottoms look "obvious" because of:', ['Thiên kiến nhận thức muộn', 'Dữ liệu tốt hơn', 'Nến đẹp', 'Không lý do'], ['Hindsight bias', 'Better data', 'Nice candles', 'No reason'], 0, '', ''],
    ['Bước đầu tiên ở mỗi điểm dừng phân tích:', 'The first step at each analysis pause:', ['Xác định bối cảnh: xu hướng khung lớn và vị trí trong cấu trúc', 'Vào lệnh', 'Xem nến tiếp theo', 'Đọc tin'], ['Establish context: higher-frame trend and structural location', 'Enter', 'Peek at the next bar', 'Read news'], 0, '', ''],
    ['Mỗi kịch bản chính cần kèm:', 'Every main scenario needs:', ['Điểm vô hiệu', 'Tên đẹp', 'Đòn bẩy', 'Không gì'], ['An invalidation point', 'A nice name', 'Leverage', 'Nothing'], 0, '', ''],
    ['Tỷ lệ lợi nhuận/rủi ro nên tính tại:', 'Reward/risk should be computed at:', ['Thời điểm quyết định, với thông tin lúc đó', 'Điểm đẹp nhất nhìn lại', 'Cuối năm', 'Không cần'], ['The decision moment with information then', 'The best point in hindsight', 'Year-end', 'Never'], 0, '', ''],
    ['Nguyên lý đổi vai: hỗ trợ bị phá thường:', 'Polarity: broken support usually:', ['Trở thành kháng cự', 'Biến mất', 'Trở thành hỗ trợ mạnh hơn', 'Không đổi'], ['Becomes resistance', 'Disappears', 'Becomes stronger support', 'Unchanged'], 0, '', ''],
    ['Lần quay lại kiểm tra vùng đổi vai là:', 'A retest of a polarity zone is:', ['Cơ hội vào lệnh với điểm dừng rõ ràng', 'Tín hiệu bỏ qua', 'Luôn thất bại', 'Không ý nghĩa'], ['An entry opportunity with a clear stop', 'Ignorable', 'Always fails', 'Meaningless'], 0, '', ''],
    ['Vùng then chốt nên được hiểu là:', 'Key levels should be treated as:', ['Vùng có độ rộng, giá có thể đâm qua một chút', 'Đường mảnh tuyệt đối', 'Không tồn tại', 'Một con số chính xác'], ['Zones with width; price may poke through', 'Razor-thin lines', 'Nonexistent', 'Exact numbers'], 0, '', ''],
    ['Tín hiệu nến có giá trị cao nhất khi:', 'Candle signals are most valuable when:', ['Xuất hiện đúng tại vùng then chốt', 'Giữa vùng đi ngang', 'Ngẫu nhiên', 'Trên khung phút'], ['They occur right at key zones', 'Mid-range', 'Randomly', 'On minute charts'], 0, '', ''],
    ['Khi bằng chứng mới mâu thuẫn với kịch bản ban đầu, nên:', 'When new evidence contradicts the initial scenario, you should:', ['Cập nhật quan điểm, giảm tự tin và quy mô', 'Giữ nguyên bằng mọi giá', 'Tăng vị thế', 'Bỏ qua bằng chứng'], ['Update views, lower confidence and size', 'Hold at all costs', 'Size up', 'Ignore evidence'], 0, '', ''],
    ['"Yêu" kịch bản ban đầu là biểu hiện của:', 'Falling in love with the initial scenario reflects:', ['Thiên kiến xác nhận / bảo thủ', 'Kỷ luật', 'Quản lý rủi ro', 'Không gì'], ['Confirmation/conservatism bias', 'Discipline', 'Risk management', 'Nothing'], 0, '', ''],
    ['Ghi quyết định ở mỗi bước giúp:', 'Recording decisions at each step helps:', ['So sánh sau và học hiệu quả, tránh tự lừa mình', 'Tăng phí', 'Không gì', 'Che sai lầm'], ['Compare later and learn honestly', 'Raise fees', 'Nothing', 'Hide mistakes'], 0, '', ''],
    ['Trong demo phát lại, trước mỗi lần bấm "Nến tiếp" nên:', 'In the replay demo, before each "Next bar" you should:', ['Viết ra xu hướng, kịch bản, điểm vô hiệu, hành động', 'Bấm liên tục cho nhanh', 'Xem hết rồi đoán', 'Không làm gì'], ['Write trend, scenario, invalidation, action', 'Click quickly', 'View all then guess', 'Nothing'], 0, '', ''],
    ['Breakout thất bại, nến đảo chiều tại kháng cự, khối lượng giảm khi tăng — nhận định:', 'Failed breakout, reversal candle at resistance, falling volume on rallies — read:', ['Bằng chứng trái chiều tích tụ — giảm tự tin, chặt dừng', 'Mua thêm mạnh', 'Không ý nghĩa', 'Tăng đòn bẩy'], ['Mounting contrary evidence — lower confidence, tighten stops', 'Buy heavily', 'Meaningless', 'Leverage'], 0, '', ''],
    ['Hành động "chờ" trong biểu đồ diễn tiến là:', '"Wait" as an action in progressive charting is:', ['Một quyết định hợp lệ khi chưa có lợi thế rõ', 'Thất bại', 'Không được phép', 'Luôn sai'], ['A valid decision when no clear edge exists', 'Failure', 'Not allowed', 'Always wrong'], 0, '', ''],
    ['Kịch bản thay thế cần có vì:', 'An alternative scenario is needed because:', ['Thị trường không chắc chắn; chuẩn bị trước giúp phản ứng nhanh', 'Để viết dài', 'Không cần', 'Do luật'], ['Markets are uncertain; preparation speeds response', 'To write more', 'Unneeded', 'Law'], 0, '', ''],
    ['Nhận định ở mỗi bước nên dựa trên:', 'Each step’s assessment should rest on:', ['Thông tin có đến phiên hiện tại', 'Thông tin tương lai', 'Tin đồn', 'Cảm giác'], ['Information up to the current bar', 'Future information', 'Rumours', 'Feelings'], 0, '', ''],
    ['Giá đâm thủng hỗ trợ một chút rồi đóng cửa lại trên hỗ trợ với khối lượng lớn có thể là:', 'Price piercing support briefly then closing back above on big volume may be:', ['Spring / phá vỡ giả — tín hiệu tăng tiềm năng', 'Phá vỡ giảm chắc chắn', 'Không ý nghĩa', 'Gap kiệt sức'], ['A spring / false break — potential bullish signal', 'A sure breakdown', 'Meaningless', 'An exhaustion gap'], 0, '', ''],
    ['Đặt dừng lỗ trong phân tích diễn tiến dựa trên:', 'Stops in progressive analysis are based on:', ['Điểm vô hiệu của kịch bản tại thời điểm đó', 'Số ngẫu nhiên', 'Không đặt', 'Đỉnh tương lai'], ['The scenario’s current invalidation point', 'Random numbers', 'None', 'Future highs'], 0, '', ''],
    ['Khi đang giữ lệnh có lãi và xuất hiện nến đảo chiều tại kháng cự lớn, hành động hợp lý:', 'Holding a profit when a reversal candle forms at major resistance, sensible action:', ['Chặt dừng hoặc chốt một phần', 'Mua thêm gấp đôi', 'Bỏ dừng', 'Không làm gì dù quy tắc'], ['Tighten the stop or take partial profits', 'Double up', 'Remove the stop', 'Ignore rules'], 0, '', ''],
    ['Học từ biểu đồ quá khứ hiệu quả nhất bằng cách:', 'The best way to learn from past charts:', ['Che phần tương lai và phân tích từng bước', 'Xem toàn bộ rồi giải thích', 'Chỉ chọn ví dụ đẹp', 'Không học'], ['Hide the future and analyse step by step', 'View everything then explain', 'Pick only nice examples', 'Don’t learn'], 0, '', ''],
    ['Phân tích diễn tiến kết hợp tốt với:', 'Progressive analysis pairs well with:', ['Wyckoff (sự kiện theo trình tự), nến, khối lượng', 'Chỉ định giá', 'Chỉ tin tức', 'Không gì'], ['Wyckoff (sequential events), candles, volume', 'Valuation only', 'News only', 'Nothing'], 0, '', ''],
    ['Mức tự tin nên được thể hiện qua:', 'Confidence should be expressed through:', ['Quy mô vị thế', 'Giọng nói', 'Số lần kiểm tra giá', 'Không gì'], ['Position size', 'Tone of voice', 'Price-check frequency', 'Nothing'], 0, '', ''],
    ['Cạm bẫy khi "phát lại" biểu đồ quen thuộc:', 'A trap when replaying a familiar chart:', ['Đã biết kết quả nên vô thức bị ảnh hưởng', 'Không có', 'Dữ liệu sai', 'Quá khó'], ['Knowing the outcome biases you subconsciously', 'None', 'Bad data', 'Too hard'], 0, '', ''],
    ['Vì vậy nên luyện tập phát lại với:', 'So practise replay with:', ['Mã/giai đoạn chưa quen hoặc ẩn tên mã', 'Mã đã thuộc lòng', 'Chỉ VNINDEX 2022', 'Không luyện'], ['Unfamiliar symbols/periods or hidden tickers', 'Memorised charts', 'Only VNINDEX 2022', 'No practice'], 0, '', ''],
    ['Mục tiêu đánh giá sau khi phát lại:', 'The post-replay evaluation goal:', ['Chất lượng quyết định ở từng bước, không chỉ kết quả cuối', 'Chỉ lãi lỗ', 'Không đánh giá', 'Đổ lỗi thị trường'], ['Decision quality at each step, not just the final result', 'P&L only', 'No review', 'Blame the market'], 0, '', ''],
    ['Kháng cự cũ bị vượt, giá quay lại kiểm tra và tạo búa với khối lượng thấp. Nhận định:', 'Old resistance broken; price retests and forms a low-volume hammer. Read:', ['Kiểm tra đổi vai thành công — thiết lập mua, dừng dưới vùng', 'Breakout thất bại', 'Không ý nghĩa', 'Bán khống'], ['A successful polarity test — buy setup, stop below the zone', 'Failed breakout', 'Meaningless', 'Short'], 0, '', ''],
    ['Biểu đồ diễn tiến rèn luyện kỹ năng nào nhất?', 'Which skill does progressive charting train most?', ['Ra quyết định có kỷ luật trong điều kiện không chắc chắn', 'Vẽ đường thẳng', 'Thuộc tên mẫu hình', 'Tính thuế'], ['Disciplined decisions under uncertainty', 'Drawing lines', 'Memorising names', 'Tax'], 0, '', ''],
    ['Bài học chính:', 'Key lesson:', ['Phân tích phải diễn ra theo thời gian thực: bối cảnh, kịch bản, điểm vô hiệu, hành động — và cập nhật liên tục', 'Biểu đồ quá khứ đủ để học', 'Không cần điểm vô hiệu', 'Giữ quan điểm bằng mọi giá'], ['Analysis must run in real time: context, scenario, invalidation, action — and continuous updating', 'Past charts suffice', 'No invalidation needed', 'Hold views at all costs'], 0, '', ''],
    ['Trong biểu đồ diễn tiến, quyết định tốt nhưng kết quả lỗ nên được đánh giá:', 'In progressive charting, a sound decision that lost should be rated:', ['Tốt nếu quy trình và thông tin lúc đó hợp lý', 'Tồi vì lỗ', 'Không đánh giá được', 'Phải đổi hệ thống'], ['Good if the process and information then were sound', 'Bad because it lost', 'Unratable', 'Grounds to switch systems'], 0, '', '']
  ]);

  /* ================= L3-32 ================= */
  C.addLesson('l3-32', {
    goals: ['Áp dụng quy trình phân tích từ trên xuống trên biểu đồ thực tế.', 'Tổng hợp xu hướng, cấu trúc, khối lượng, động lượng, tâm lý, liên thị trường thành một nhận định.', 'Xây dựng kế hoạch giao dịch hoàn chỉnh với kịch bản, rủi ro và quy mô.', 'Trình bày và bảo vệ nhận định một cách rõ ràng.'],
    body: () => `
<h3>1. Quy trình tổng hợp từ trên xuống</h3>
<div class="flow"><span>Bối cảnh vĩ mô & liên thị trường</span><span>→</span><span>Thị trường chung (xu hướng, độ rộng, tâm lý)</span><span>→</span><span>Ngành (sức mạnh tương đối, xoay vòng)</span><span>→</span><span>Mã (cấu trúc, Wyckoff, khối lượng)</span><span>→</span><span>Thiết lập & điểm vào (đa khung, nến)</span><span>→</span><span>Kế hoạch & rủi ro</span></div>
<h3>2. Bảng kiểm tra bằng chứng</h3>
<table class="tbl"><thead><tr><th>Lớp</th><th>Câu hỏi</th><th>Công cụ</th></tr></thead><tbody>
<tr><td>Xu hướng</td><td>Xu hướng chính, trung hạn, ngắn hạn là gì?</td><td>MA, cấu trúc đỉnh đáy, đường xu hướng, đa khung</td></tr>
<tr><td>Cấu trúc</td><td>Đang ở giai đoạn nào: tích luỹ, tăng giá, phân phối, giảm giá?</td><td>Wyckoff, mẫu hình, hỗ trợ/kháng cự</td></tr>
<tr><td>Khối lượng / độ rộng</td><td>Sự tham gia xác nhận hay phân kỳ?</td><td>VSA, OBV, A/D, % mã trên MA</td></tr>
<tr><td>Động lượng</td><td>Tăng tốc hay suy yếu, có phân kỳ?</td><td>RSI, MACD, ROC</td></tr>
<tr><td>Tâm lý</td><td>Đám đông đang ở cực trị nào?</td><td>Khảo sát, margin, biến động</td></tr>
<tr><td>Liên thị trường</td><td>Bối cảnh lãi suất, tỷ giá, hàng hoá ủng hộ hay cản trở?</td><td>Tương quan lăn, tỷ lệ</td></tr>
<tr><td>Sức mạnh tương đối</td><td>Mã/ngành có dẫn dắt không?</td><td>Đường RS, đồ thị xoay vòng</td></tr></tbody></table>
<p>Tổng hợp theo <b>trọng lượng bằng chứng</b>: không chỉ báo nào quyết định; đếm mức đồng thuận và xác định <b>bằng chứng quyết định</b> (thường là giá và cấu trúc).</p>
<h3>3. Kế hoạch giao dịch hoàn chỉnh</h3>
<ol><li><b>Nhận định</b> và mức tự tin (cao/trung bình/thấp).</li><li><b>Kịch bản chính</b> và <b>thay thế</b>; điều kiện kích hoạt mỗi kịch bản.</li><li><b>Điểm vào</b>, <b>điểm dừng</b> (vô hiệu), <b>mục tiêu</b> theo cấu trúc.</li><li><b>Quy mô</b> theo rủi ro cố định %, điều chỉnh theo mức tự tin.</li><li><b>Quản lý lệnh</b>: dời dừng, chốt từng phần, điều kiện thoát sớm.</li><li><b>Những gì sẽ khiến bạn đổi ý</b>.</li></ol>
${H.planSheet()}
<h3>4. Trình bày nhận định</h3>
<ul><li>Bắt đầu bằng <b>kết luận</b> (hướng, mức tự tin, hành động), sau đó là bằng chứng theo thứ tự quan trọng.</li><li>Nêu rõ <b>rủi ro</b> và <b>điểm vô hiệu</b> — một nhận định không có điểm vô hiệu không phải là phân tích chuyên nghiệp.</li><li>Phân biệt <b>sự kiện</b> (giá đã phá đỉnh) và <b>diễn giải</b> (có thể là breakout thật).</li><li>Dùng ngôn ngữ xác suất ("nhiều khả năng", "nếu… thì…"), tránh khẳng định tuyệt đối.</li></ul>`,
    keys: ['Quy trình từ trên xuống: vĩ mô/liên thị trường → thị trường chung → ngành → mã → thiết lập → kế hoạch.', 'Bảng bằng chứng: xu hướng, cấu trúc, khối lượng/độ rộng, động lượng, tâm lý, liên thị trường, sức mạnh tương đối — tổng hợp theo trọng lượng bằng chứng, giá/cấu trúc là quyết định.', 'Kế hoạch: nhận định + tự tin, kịch bản chính/thay thế, vào/dừng/mục tiêu, quy mô, quản lý lệnh, điều kiện đổi ý.', 'Trình bày: kết luận trước, rủi ro và điểm vô hiệu, tách sự kiện và diễn giải, ngôn ngữ xác suất.'],
    terms: [['Top-down synthesis', 'Tổng hợp từ trên xuống'], ['Decisive evidence', 'Bằng chứng quyết định'], ['Trade plan', 'Kế hoạch giao dịch'], ['Conviction', 'Mức tự tin'], ['Probabilistic language', 'Ngôn ngữ xác suất']]
  }, {
    goals: ['Apply a top-down process to real charts.', 'Synthesise trend, structure, volume, momentum, sentiment and intermarket evidence.', 'Build a complete trade plan.', 'Present and defend a view clearly.'],
    body: () => `
<h3>1. Top-down process</h3><p>Macro/intermarket → market → sector → stock → setup → plan.</p>
<h3>2. Evidence table</h3><p>Trend, structure (Wyckoff), volume/breadth, momentum, sentiment, intermarket, relative strength — weight of evidence; price and structure decide.</p>
<h3>3. Trade plan</h3><ol><li>View and conviction</li><li>Main and alternative scenarios</li><li>Entry, stop, target</li><li>Size</li><li>Management</li><li>What would change your mind</li></ol>${H.planSheet()}
<h3>4. Presentation</h3><p>Conclusion first, risks and invalidation, facts vs interpretation, probabilistic language.</p>`,
    keys: ['Process.', 'Evidence.', 'Plan.', 'Presentation.'],
    terms: [['Conviction', 'Confidence level driving size']]
  }, [
    ['Thứ tự đúng của quy trình từ trên xuống:', 'The correct top-down order:', ['Vĩ mô/liên thị trường → thị trường → ngành → mã → thiết lập → kế hoạch', 'Mã → vĩ mô → ngành', 'Kế hoạch → mã → thị trường', 'Ngẫu nhiên'], ['Macro/intermarket → market → sector → stock → setup → plan', 'Stock → macro → sector', 'Plan → stock → market', 'Random'], 0, '', ''],
    ['Bằng chứng thường mang tính quyết định trong tổng hợp kỹ thuật:', 'The usually decisive evidence in technical synthesis:', ['Giá và cấu trúc', 'Tin đồn', 'Định giá', 'Màu biểu đồ'], ['Price and structure', 'Rumours', 'Valuation', 'Chart colour'], 0, '', ''],
    ['Tổng hợp theo trọng lượng bằng chứng nghĩa là:', 'Weight-of-evidence synthesis means:', ['Không chỉ báo nào quyết định một mình; đếm mức đồng thuận', 'Một chỉ báo quyết định tất cả', 'Bỏ qua chỉ báo', 'Chọn chỉ báo ủng hộ quan điểm'], ['No single indicator decides; count agreement', 'One indicator decides', 'Ignore indicators', 'Pick agreeing indicators'], 0, '', ''],
    ['Lớp "cấu trúc" trả lời câu hỏi:', 'The "structure" layer asks:', ['Thị trường đang ở giai đoạn tích luỹ, tăng, phân phối hay giảm?', 'Lãi suất bao nhiêu?', 'Cổ tức?', 'Không gì'], ['Is it accumulation, markup, distribution or markdown?', 'Rates?', 'Dividends?', 'Nothing'], 0, '', ''],
    ['Kế hoạch giao dịch hoàn chỉnh phải có:', 'A complete trade plan must include:', ['Điểm vào, dừng (vô hiệu), mục tiêu, quy mô, quản lý lệnh, điều kiện đổi ý', 'Chỉ điểm vào', 'Chỉ mục tiêu', 'Không cần'], ['Entry, stop (invalidation), target, size, management, change-of-mind conditions', 'Entry only', 'Target only', 'Nothing'], 0, '', ''],
    ['Giá vào 25, dừng 23.5, mục tiêu 29.5. Lợi nhuận/rủi ro:', 'Entry 25, stop 23.5, target 29.5. Reward/risk:', ['3', '1.5', '4.5', '2'], null, 0, '4.5/1.5.', ''],
    ['Tiếp câu trên, xác suất đạt mục tiêu 40%. Kỳ vọng:', 'Continuing, P(target) 40%. Expectancy:', ['0.6R', '−0.2R', '1.2R', '0.4R'], null, 0, '0.4 × 3 − 0.6 = 0.6.', ''],
    ['Quy mô nên được điều chỉnh theo:', 'Size should be adjusted by:', ['Mức tự tin và rủi ro cố định %', 'Cảm xúc', 'Tin đồn', 'Không điều chỉnh'], ['Conviction and fixed % risk', 'Emotion', 'Rumours', 'Never'], 0, '', ''],
    ['Khi trình bày nhận định, nên bắt đầu bằng:', 'A presentation should start with:', ['Kết luận: hướng, mức tự tin, hành động', 'Lịch sử công ty', 'Toàn bộ chỉ báo', 'Lời xin lỗi'], ['The conclusion: direction, conviction, action', 'Company history', 'Every indicator', 'An apology'], 0, '', ''],
    ['Nhận định không có điểm vô hiệu:', 'A view without an invalidation point:', ['Không phải phân tích chuyên nghiệp', 'Hoàn hảo', 'An toàn nhất', 'Bắt buộc'], ['Is not professional analysis', 'Is perfect', 'Is safest', 'Is required'], 0, '', ''],
    ['"Giá đã phá đỉnh 52 tuần" là:', '"Price broke its 52-week high" is:', ['Sự kiện', 'Diễn giải', 'Dự báo', 'Ý kiến'], ['A fact', 'An interpretation', 'A forecast', 'An opinion'], 0, '', ''],
    ['"Đây có thể là breakout thật" là:', '"This may be a genuine breakout" is:', ['Diễn giải', 'Sự kiện', 'Dữ liệu', 'Luật'], ['An interpretation', 'A fact', 'Data', 'Law'], 0, '', ''],
    ['Ngôn ngữ phù hợp khi trình bày nhận định:', 'Suitable language for a view:', ['Xác suất, có điều kiện ("nếu… thì…")', 'Tuyệt đối ("chắc chắn")', 'Mơ hồ', 'Cảm xúc'], ['Probabilistic, conditional ("if… then…")', 'Absolute ("certainly")', 'Vague', 'Emotional'], 0, '', ''],
    ['Lớp liên thị trường trong bảng bằng chứng hỏi:', 'The intermarket layer asks:', ['Lãi suất, tỷ giá, hàng hoá ủng hộ hay cản trở?', 'Nến nào?', 'RSI bao nhiêu?', 'Không gì'], ['Do rates, FX, commodities support or hinder?', 'Which candle?', 'RSI value?', 'Nothing'], 0, '', ''],
    ['Tình huống: thị trường chung giảm dưới MA 200, độ rộng yếu, nhưng một mã có RS mạnh và đang tích luỹ Wyckoff. Kế hoạch hợp lý:', 'Case: market below its 200-MA, weak breadth, but one stock with strong RS in Wyckoff accumulation. Sensible plan:', ['Theo dõi, chờ dấu hiệu SOS/LPS và thị trường cải thiện; nếu vào thì quy mô nhỏ', 'Mua toàn lực ngay', 'Bán khống mã đó', 'Bỏ qua mãi mãi'], ['Watch for SOS/LPS and market improvement; if entering, small size', 'Buy fully now', 'Short it', 'Ignore forever'], 0, '', ''],
    ['Tình huống: mọi lớp bằng chứng đồng thuận tăng, nhưng tâm lý ở mức hưng phấn cực độ. Điều chỉnh:', 'Case: all layers bullish but sentiment euphoric. Adjustment:', ['Giữ hướng tăng nhưng giảm quy mô mới, chặt dừng', 'Bán khống toàn lực', 'Tăng đòn bẩy', 'Bỏ qua tâm lý'], ['Keep the bullish bias but reduce new size, tighten stops', 'Short heavily', 'Add leverage', 'Ignore sentiment'], 0, '', ''],
    ['"Những gì sẽ khiến bạn đổi ý" trong kế hoạch giúp:', '"What would change your mind" helps:', ['Chống thiên kiến xác nhận, phản ứng nhanh khi sai', 'Tăng tự tin', 'Không gì', 'Làm kế hoạch dài'], ['Counter confirmation bias and react fast when wrong', 'Boost confidence', 'Nothing', 'Lengthen the plan'], 0, '', ''],
    ['Mục tiêu nên đặt theo:', 'Targets should be set by:', ['Cấu trúc: kháng cự, đo mẫu hình, đếm P&F', 'Ngẫu nhiên', 'Mong muốn', 'Số tròn bất kỳ'], ['Structure: resistance, pattern measures, P&F counts', 'Randomness', 'Wishes', 'Any round number'], 0, '', ''],
    ['Kế hoạch có lợi nhuận/rủi ro 1.2 và xác suất 45% thì:', 'A plan with 1.2 reward/risk and 45% probability:', ['Kỳ vọng âm — điều chỉnh hoặc bỏ qua', 'Rất tốt', 'Hoà vốn', 'Bắt buộc vào'], ['Negative expectancy — adjust or skip', 'Very good', 'Breakeven', 'Must enter'], 0, '0.45 × 1.2 − 0.55 = −0.01.', ''],
    ['Kiểm tra "không cần đòn bẩy" trong phiếu kế hoạch nhằm:', 'The "no leverage needed" check aims to:', ['Tránh vị thế vượt vốn do dừng quá gần', 'Tăng lợi nhuận', 'Không mục đích', 'Giảm phí'], ['Avoid positions exceeding equity from tight stops', 'Raise profit', 'No purpose', 'Cut fees'], 0, '', ''],
    ['Bằng chứng động lượng phân kỳ giảm khi giá ở đỉnh mới nên:', 'Bearish momentum divergence at a new price high should:', ['Hạ mức tự tin, không phải tự động đảo chiều', 'Bán khống ngay', 'Mua thêm', 'Bỏ qua'], ['Lower conviction, not trigger an automatic reversal', 'Short now', 'Buy more', 'Be ignored'], 0, '', ''],
    ['Lớp sức mạnh tương đối giúp quyết định:', 'The relative-strength layer helps decide:', ['Chọn mã/ngành dẫn dắt để phân bổ vốn', 'Lãi suất', 'Thuế', 'Không gì'], ['Which leading stocks/sectors get capital', 'Rates', 'Tax', 'Nothing'], 0, '', ''],
    ['Khi các lớp bằng chứng mâu thuẫn mạnh, quyết định tốt nhất thường là:', 'With strongly conflicting layers, the best decision is often:', ['Đứng ngoài hoặc quy mô rất nhỏ', 'Vào lệnh lớn', 'Đòn bẩy', 'Tin cảm giác'], ['Stand aside or very small', 'Big position', 'Leverage', 'Trust gut'], 0, '', ''],
    ['Biểu đồ thực tế khác sách giáo khoa ở chỗ:', 'Real charts differ from textbooks in that:', ['Hiếm khi hoàn hảo; tín hiệu lẫn lộn, cần tổng hợp xác suất', 'Luôn đẹp', 'Không có nhiễu', 'Dễ hơn'], ['They are rarely perfect; signals mix and need probabilistic synthesis', 'Always neat', 'Noise-free', 'Easier'], 0, '', ''],
    ['Quản lý lệnh sau khi vào gồm:', 'Post-entry trade management includes:', ['Dời dừng, chốt từng phần, thoát sớm khi điều kiện thay đổi', 'Không làm gì', 'Bỏ dừng', 'Gấp thếp'], ['Moving stops, partial exits, early exits on changed conditions', 'Nothing', 'Removing stops', 'Martingale'], 0, '', ''],
    ['Tình huống: VNINDEX trên MA 200, độ rộng mạnh, ngân hàng dẫn đầu trên đồ thị xoay vòng, lãi suất liên ngân hàng giảm. Mã ngân hàng X vừa có LPS. Nhận định:', 'Case: VNINDEX above 200-MA, strong breadth, banks leading in rotation, interbank rates falling; bank X just printed an LPS. View:', ['Bằng chứng đồng thuận cao — mua với dừng dưới LPS, quy mô đầy đủ theo rủi ro', 'Bán khống X', 'Đứng ngoài vì quá tốt', 'Không đủ thông tin'], ['High agreement — buy with a stop below the LPS, full risk-based size', 'Short X', 'Stay out because it looks too good', 'Not enough info'], 0, '', ''],
    ['Phân tích chuyên nghiệp khác ý kiến cá nhân ở chỗ:', 'Professional analysis differs from opinion by:', ['Có quy trình, bằng chứng, điểm vô hiệu và quản lý rủi ro', 'Nói hay hơn', 'Có nhiều chỉ báo hơn', 'Không khác'], ['Process, evidence, invalidation and risk control', 'Better speaking', 'More indicators', 'No difference'], 0, '', ''],
    ['Kiểm tra lại kế hoạch sau khi giao dịch kết thúc nhằm:', 'Reviewing the plan after the trade ends aims to:', ['Đánh giá quy trình và cải thiện', 'Tìm người đổ lỗi', 'Không mục đích', 'Xoá dữ liệu'], ['Assess the process and improve', 'Assign blame', 'No purpose', 'Delete data'], 0, '', ''],
    ['Bài học chính về phân tích biểu đồ thực tế:', 'Key lesson on real-world charts:', ['Tổng hợp nhiều lớp bằng chứng thành kế hoạch có rủi ro xác định, trình bày rõ ràng và cập nhật liên tục', 'Một chỉ báo là đủ', 'Không cần kế hoạch', 'Luôn chắc chắn'], ['Synthesise layered evidence into a defined-risk plan, presented clearly and updated continuously', 'One indicator suffices', 'No plan needed', 'Always certain'], 0, '', ''],
    ['Mức tự tin thấp nhưng lợi nhuận/rủi ro rất cao. Cách xử lý hợp lý:', 'Low conviction but very high reward/risk. Sensible handling:', ['Vào lệnh quy mô nhỏ với dừng rõ ràng', 'Quy mô tối đa', 'Bỏ dừng', 'Đòn bẩy'], ['Enter small with a clear stop', 'Maximum size', 'No stop', 'Leverage'], 0, '', '']
  ]);

  /* ================= L3-33 ================= */
  C.addLesson('l3-33', {
    goals: ['Hệ thống hoá toàn bộ kiến thức Level 1–3 thành một khung ra quyết định.', 'Liên kết lý thuyết thị trường, công cụ, kiểm định, rủi ro và hành vi.', 'Xác định lộ trình phát triển tiếp theo của nhà phân tích kỹ thuật.', 'Củng cố chuẩn mực nghề nghiệp và đạo đức.'],
    body: () => `
<h3>1. Bức tranh tổng thể</h3>
<table class="tbl"><thead><tr><th>Cấp độ</th><th>Câu hỏi trung tâm</th><th>Kết quả</th></tr></thead><tbody>
<tr><td><b>Level 1</b></td><td>Các công cụ là gì, hoạt động ra sao?</td><td>Từ vựng: lý thuyết Dow, xu hướng, mẫu hình, chỉ báo, chu kỳ, tâm lý, thống kê cơ bản, đạo đức</td></tr>
<tr><td><b>Level 2</b></td><td>Vận dụng và đánh giá công cụ thế nào?</td><td>Tính toán, hệ thống, biến động, hành vi, thống kê suy luận, liên thị trường, kiểm định</td></tr>
<tr><td><b>Level 3</b></td><td>Với bằng chứng này, quyết định gì, quy mô bao nhiêu, vì sao?</td><td>Quản trị rủi ro, quan hệ tài sản, danh mục, hành vi, biến động, tổng hợp biểu đồ</td></tr></tbody></table>
<h3>2. Khung ra quyết định của nhà PTKT</h3>
<ol><li><b>Hiểu vì sao giá có thể dự báo được</b> (phản ứng chậm, phản ứng thái quá, dòng tiền, giới hạn kinh doanh chênh lệch) — để biết công cụ nào có cơ sở.</li>
<li><b>Xác định bối cảnh</b>: chế độ vĩ mô, liên thị trường, xu hướng đa khung, giai đoạn Wyckoff.</li>
<li><b>Thu thập bằng chứng có hệ thống</b>: xu hướng, cấu trúc, khối lượng, động lượng, tâm lý, sức mạnh tương đối.</li>
<li><b>Định lượng và kiểm định</b> mọi quy tắc trước khi tin; điều chỉnh cho đào bới dữ liệu.</li>
<li><b>Quản trị rủi ro trước, lợi nhuận sau</b>: định cỡ, giới hạn nhiều tầng, kịch bản xấu.</li>
<li><b>Thực hiện có kỷ luật</b>: kế hoạch viết sẵn, quy tắc tự động cho thiên kiến cảm xúc.</li>
<li><b>Đánh giá và cải thiện</b>: nhật ký, phân bổ hiệu suất, theo dõi suy giảm.</li></ol>
${H.planSheet()}
<h3>3. Những nguyên tắc xuyên suốt</h3>
<ul><li><b>Giá là trọng tài cuối cùng</b>; mọi câu chuyện phải được giá xác nhận.</li>
<li><b>Xu hướng là bạn</b> cho tới khi có bằng chứng thay đổi; cực trị tâm lý là nơi rủi ro/cơ hội lớn nhất.</li>
<li><b>Không có chén thánh</b>: lợi thế nhỏ, thay đổi theo thời gian, cần nhiều lần lặp để hiện ra.</li>
<li><b>Tồn tại quan trọng hơn tối đa hoá</b>: không có lợi nhuận kép nếu không còn vốn.</li>
<li><b>Khiêm tốn trước dữ liệu</b>: nghi ngờ kết quả quá đẹp, tìm bằng chứng phản bác.</li></ul>
<h3>4. Chuẩn mực nghề nghiệp</h3>
<ul><li>Trung thực về giả định, rủi ro và giới hạn của phân tích; tách sự kiện và ý kiến.</li><li>Đặt lợi ích khách hàng lên trước; công bố xung đột lợi ích.</li><li>Không sử dụng thông tin nội bộ; không thao túng thị trường hay lan truyền tin đồn.</li><li>Ghi nhận nguồn khi dùng công trình của người khác.</li></ul>
<h3>5. Lộ trình tiếp theo</h3>
<ul><li>Xây dựng và vận hành <b>một hệ thống của riêng bạn</b> trên tài khoản nhỏ, ghi nhật ký đầy đủ trong tối thiểu 100 lệnh.</li>
<li>Thực hành phân tích diễn tiến hằng tuần trên nhiều thị trường.</li>
<li>Dùng các công cụ trong ứng dụng này (phân tích Wyckoff đa khung, kịch bản) như phòng thí nghiệm để kiểm tra giả thuyết.</li>
<li>Tiếp tục học: thống kê, lập trình kiểm định, quản lý danh mục — và luôn đặt quản trị rủi ro ở trung tâm.</li></ul>`,
    keys: ['L1 = công cụ; L2 = vận dụng và đánh giá; L3 = quyết định với quy mô và lý do.', 'Khung quyết định: vì sao dự báo được → bối cảnh → bằng chứng → kiểm định → rủi ro → thực hiện kỷ luật → đánh giá.', 'Nguyên tắc: giá là trọng tài, xu hướng là bạn, không có chén thánh, tồn tại trước, khiêm tốn trước dữ liệu.', 'Chuẩn mực: trung thực, khách hàng trước, không dùng thông tin nội bộ/thao túng, ghi nhận nguồn.', 'Lộ trình: hệ thống riêng trên tài khoản nhỏ, nhật ký 100+ lệnh, luyện phân tích diễn tiến, học tiếp thống kê và lập trình.'],
    terms: [['Decision framework', 'Khung ra quyết định'], ['Edge', 'Lợi thế'], ['Survival first', 'Tồn tại trước tiên'], ['Professional standards', 'Chuẩn mực nghề nghiệp'], ['Conflict of interest', 'Xung đột lợi ích']]
  }, {
    goals: ['Organise Levels 1–3 into one decision framework.', 'Link theory, tools, testing, risk and behaviour.', 'Plan further development.', 'Reinforce professional and ethical standards.'],
    body: () => `
<h3>1. Overview</h3><p>Level 1: tools. Level 2: application and evaluation. Level 3: decisions — what, how much, why.</p>
<h3>2. Decision framework</h3><ol><li>Why prices are predictable</li><li>Context</li><li>Systematic evidence</li><li>Quantify and test</li><li>Risk first</li><li>Disciplined execution</li><li>Review and improve</li></ol>${H.planSheet()}
<h3>3. Principles</h3><ul><li>Price is the final arbiter.</li><li>The trend is your friend; extremes hold the biggest risk/opportunity.</li><li>No holy grail.</li><li>Survival beats maximisation.</li><li>Humility before data.</li></ul>
<h3>4. Standards</h3><p>Honesty about assumptions and limits, clients first, no inside information or manipulation, credit sources.</p>
<h3>5. Next steps</h3><p>Run your own system small with a 100+ trade journal, practise progressive analysis weekly, use the app’s tools as a lab, keep learning statistics and programming.</p>`,
    keys: ['Levels.', 'Framework.', 'Principles.', 'Standards.', 'Next steps.'],
    terms: [['Survival first', 'Capital preservation before growth']]
  }, [
    ['Câu hỏi trung tâm của Level 3:', 'The central question of Level 3:', ['Với bằng chứng này, quyết định gì, quy mô bao nhiêu và vì sao?', 'Công cụ là gì?', 'Chỉ báo tính thế nào?', 'Không có'], ['Given this evidence, what to do, how big and why?', 'What are the tools?', 'How is an indicator computed?', 'None'], 0, '', ''],
    ['Bước đầu tiên của khung ra quyết định:', 'The first step of the decision framework:', ['Hiểu vì sao giá có thể dự báo được', 'Vào lệnh', 'Mua chỉ báo', 'Đọc tin'], ['Understand why prices can be predictable', 'Enter a trade', 'Buy indicators', 'Read news'], 0, '', ''],
    ['"Giá là trọng tài cuối cùng" nghĩa là:', '"Price is the final arbiter" means:', ['Mọi câu chuyện phải được giá xác nhận', 'Bỏ qua giá', 'Tin tức quan trọng hơn', 'Không có nghĩa'], ['Every story needs price confirmation', 'Ignore price', 'News matters more', 'Meaningless'], 0, '', ''],
    ['"Không có chén thánh" hàm ý:', '"No holy grail" implies:', ['Lợi thế nhỏ, thay đổi, cần nhiều lần lặp để hiện ra', 'Có hệ thống không bao giờ thua', 'PTKT vô dụng', 'Không cần quản lý rủi ro'], ['Edges are small, changing and need many repetitions', 'A never-losing system exists', 'TA is useless', 'No risk control needed'], 0, '', ''],
    ['"Tồn tại quan trọng hơn tối đa hoá" vì:', '"Survival beats maximisation" because:', ['Không có lợi nhuận kép nếu mất vốn', 'Lợi nhuận không quan trọng', 'Do luật', 'Không đúng'], ['No compounding without capital', 'Profit doesn’t matter', 'Law', 'False'], 0, '', ''],
    ['Quy tắc nên được tin khi nào?', 'When should a rule be trusted?', ['Sau khi định lượng, kiểm định và điều chỉnh cho đào bới dữ liệu', 'Khi nghe chuyên gia nói', 'Khi backtest đẹp', 'Ngay lập tức'], ['After quantification, testing and data-mining adjustment', 'When an expert says so', 'When a backtest looks great', 'Immediately'], 0, '', ''],
    ['Thiên kiến cảm xúc trong thực hiện được xử lý tốt nhất bằng:', 'Emotional biases in execution are best handled by:', ['Kế hoạch viết sẵn và quy tắc tự động', 'Ý chí', 'Đòn bẩy', 'Không xử lý'], ['Written plans and automatic rules', 'Willpower', 'Leverage', 'Nothing'], 0, '', ''],
    ['Phân bổ hiệu suất và nhật ký thuộc bước:', 'Attribution and journals belong to the step:', ['Đánh giá và cải thiện', 'Bối cảnh', 'Thực hiện', 'Kiểm định ban đầu'], ['Review and improve', 'Context', 'Execution', 'Initial testing'], 0, '', ''],
    ['Chuẩn mực nghề nghiệp yêu cầu:', 'Professional standards require:', ['Trung thực về giả định, rủi ro và giới hạn', 'Che giấu rủi ro', 'Khẳng định tuyệt đối', 'Lan truyền tin đồn'], ['Honesty about assumptions, risks and limits', 'Hiding risks', 'Absolute claims', 'Spreading rumours'], 0, '', ''],
    ['Xung đột lợi ích phải được:', 'Conflicts of interest must be:', ['Công bố', 'Giấu kín', 'Bỏ qua', 'Tận dụng'], ['Disclosed', 'Hidden', 'Ignored', 'Exploited'], 0, '', ''],
    ['Sử dụng thông tin nội bộ chưa công bố để giao dịch là:', 'Trading on undisclosed inside information is:', ['Vi phạm pháp luật và chuẩn mực', 'Lợi thế hợp pháp', 'Phân tích kỹ thuật', 'Bắt buộc'], ['Illegal and unethical', 'A legal edge', 'Technical analysis', 'Required'], 0, '', ''],
    ['Khi dùng công trình của người khác trong báo cáo, cần:', 'Using others’ work in a report requires:', ['Ghi nhận nguồn', 'Coi là của mình', 'Không cần', 'Sửa tên'], ['Crediting the source', 'Claiming it', 'Nothing', 'Renaming'], 0, '', ''],
    ['Lộ trình phát triển hợp lý sau khi hoàn thành chương trình:', 'A sensible path after completing the programme:', ['Vận hành hệ thống riêng trên tài khoản nhỏ, nhật ký 100+ lệnh', 'Dùng toàn bộ vốn với đòn bẩy ngay', 'Ngừng học', 'Sao chép người khác'], ['Run your own system small with a 100+ trade journal', 'Go all-in with leverage', 'Stop learning', 'Copy others'], 0, '', ''],
    ['Vì sao cần tối thiểu khoảng 100 lệnh trước khi đánh giá hệ thống thật?', 'Why about 100 trades before judging a live system?', ['Lợi thế nhỏ cần nhiều lần lặp để phân biệt với may mắn', 'Để tăng phí', 'Không cần', 'Do luật'], ['Small edges need many repetitions to beat luck', 'Raise fees', 'Unneeded', 'Law'], 0, '', ''],
    ['Level 2 tập trung vào:', 'Level 2 focuses on:', ['Vận dụng và đánh giá công cụ', 'Từ vựng cơ bản', 'Quyết định danh mục', 'Không gì'], ['Applying and evaluating tools', 'Basic vocabulary', 'Portfolio decisions', 'Nothing'], 0, '', ''],
    ['Level 1 cung cấp chủ yếu:', 'Level 1 mainly provides:', ['Từ vựng và hiểu biết công cụ', 'Quyết định quy mô', 'Hồi quy bội', 'Phái sinh VIX'], ['Vocabulary and tool knowledge', 'Sizing decisions', 'Multiple regression', 'VIX derivatives'], 0, '', ''],
    ['Cơ sở lý thuyết cho khả năng dự báo của giá gồm:', 'Theoretical bases for price predictability include:', ['Phản ứng chậm, phản ứng thái quá, giới hạn kinh doanh chênh lệch', 'Ngẫu nhiên hoàn toàn', 'Luật pháp', 'Không có'], ['Underreaction, overreaction, limits to arbitrage', 'Pure randomness', 'Law', 'None'], 0, '', ''],
    ['"Khiêm tốn trước dữ liệu" nghĩa là:', '"Humility before data" means:', ['Nghi ngờ kết quả quá đẹp, tìm bằng chứng phản bác', 'Tin mọi kết quả', 'Bỏ qua dữ liệu', 'Chỉ tin trực giác'], ['Doubt too-good results and seek disconfirmation', 'Trust every result', 'Ignore data', 'Trust intuition only'], 0, '', ''],
    ['Thứ tự ưu tiên đúng:', 'The right priority:', ['Quản trị rủi ro trước, lợi nhuận sau', 'Lợi nhuận trước, rủi ro sau', 'Chỉ lợi nhuận', 'Không ưu tiên'], ['Risk first, returns second', 'Returns first, risk later', 'Returns only', 'No priority'], 0, '', ''],
    ['Bối cảnh trong khung quyết định bao gồm:', 'Context in the framework includes:', ['Chế độ vĩ mô, liên thị trường, xu hướng đa khung, giai đoạn Wyckoff', 'Chỉ nến', 'Chỉ tin', 'Không gì'], ['Macro regime, intermarket, multi-frame trend, Wyckoff phase', 'Candles only', 'News only', 'Nothing'], 0, '', ''],
    ['Cực trị tâm lý là nơi:', 'Sentiment extremes are where:', ['Rủi ro và cơ hội lớn nhất', 'Không có gì xảy ra', 'Luôn an toàn', 'Không ý nghĩa'], ['Risk and opportunity are greatest', 'Nothing happens', 'It is always safe', 'Meaningless'], 0, '', ''],
    ['Nhà PTKT chuyên nghiệp nên tách:', 'A professional technician should separate:', ['Sự kiện và ý kiến', 'Rủi ro và lợi nhuận', 'Không gì', 'Giá và khối lượng'], ['Facts and opinions', 'Risk and return', 'Nothing', 'Price and volume'], 0, '', ''],
    ['Dùng ứng dụng Lai Long Master TA như "phòng thí nghiệm" nghĩa là:', 'Using this app as a "lab" means:', ['Kiểm tra giả thuyết bằng công cụ trước khi mạo hiểm vốn', 'Giao dịch theo mọi tín hiệu', 'Không học', 'Thay thế quản lý rủi ro'], ['Testing hypotheses with tools before risking capital', 'Trading every signal', 'Not learning', 'Replacing risk control'], 0, '', ''],
    ['Thao túng thị trường hoặc lan truyền tin đồn để trục lợi là:', 'Market manipulation or spreading rumours for gain is:', ['Vi phạm đạo đức và pháp luật', 'Chiến lược hợp pháp', 'Phân tích tâm lý', 'Không sao'], ['Unethical and illegal', 'A legal strategy', 'Sentiment analysis', 'Fine'], 0, '', ''],
    ['Theo dõi suy giảm hệ thống thuộc bước:', 'Monitoring system decay belongs to:', ['Đánh giá và cải thiện', 'Bối cảnh', 'Bằng chứng', 'Không bước nào'], ['Review and improvement', 'Context', 'Evidence', 'None'], 0, '', ''],
    ['Tình huống: một hệ thống mới có backtest lợi nhuận 80%/năm, sụt giảm 5%, 40 lệnh, 12 tham số. Đánh giá theo tinh thần Level 3:', 'Case: a new system backtests 80%/yr, 5% drawdown, 40 trades, 12 parameters. Level 3 assessment:', ['Rất đáng nghi — ít lệnh, nhiều tham số, khả năng quá khớp cao; cần kiểm định ngoài mẫu', 'Dùng toàn bộ vốn ngay', 'Hoàn hảo', 'Không cần kiểm định'], ['Highly suspect — few trades, many parameters, likely overfit; test out of sample', 'Go all-in now', 'Perfect', 'No testing needed'], 0, '', ''],
    ['Tình huống: bạn rất tự tin vào một kịch bản và muốn bỏ dừng lỗ. Theo khung quyết định:', 'Case: you feel very sure of a scenario and want to drop the stop. Per the framework:', ['Giữ dừng lỗ — tự tin cao là tín hiệu kiểm tra lại thiên kiến', 'Bỏ dừng', 'Tăng đòn bẩy', 'Gấp thếp'], ['Keep the stop — high confidence is a cue to check bias', 'Drop it', 'Lever up', 'Martingale'], 0, '', ''],
    ['Mục tiêu sau cùng của chương trình CMT theo tinh thần bài học:', 'The ultimate aim of the CMT journey per this course:', ['Trở thành người ra quyết định có kỷ luật, dựa trên bằng chứng và quản trị rủi ro', 'Học thuộc mọi chỉ báo', 'Dự báo mọi đỉnh đáy', 'Giao dịch nhiều nhất'], ['Become a disciplined, evidence-based, risk-managing decision-maker', 'Memorise all indicators', 'Call every top and bottom', 'Trade the most'], 0, '', ''],
    ['Thành phần nào KHÔNG thuộc khung ra quyết định?', 'Which is NOT part of the decision framework?', ['Làm theo tin đồn trên mạng xã hội', 'Kiểm định quy tắc', 'Quản trị rủi ro', 'Đánh giá và cải thiện'], ['Following social-media rumours', 'Testing rules', 'Risk management', 'Review and improvement'], 0, '', ''],
    ['Bài học tổng kết:', 'The closing lesson:', ['Kiến thức chỉ có giá trị khi được vận dụng có hệ thống, kiểm định, quản trị rủi ro và kỷ luật', 'Biết nhiều chỉ báo là đủ', 'Không cần kỷ luật', 'Thị trường luôn dự báo được'], ['Knowledge pays only when applied systematically, tested, risk-managed and disciplined', 'Knowing many indicators suffices', 'Discipline is optional', 'Markets are always predictable'], 0, '', '']
  ]);
})(window.LLW);
