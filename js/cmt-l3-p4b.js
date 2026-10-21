/* CMT Level 3 — Part 4b, lessons 22–24: behavioural finance II. Written by Lai Long Master TA in its own words. */
(function (L) {
  'use strict';
  const C = L.cmt, H = C.demoHtml;
  const ld = () => `<span class="spinner"></span>${L.t('loading')}`;

  /* ---------- demo: price-shock event study ---------- */
  H.shockStudy = (mk = 'vn_stock', sym = 'VNINDEX') => C.demoShell('shockStudy', C.symControls(mk, sym, '1D', ['1D']) + C.mkSel('d-k', [['2', '2σ'], ['2.5', '2.5σ'], ['3', '3σ']], '2.5') + `<button class="btn primary d-go">${L.T('Nghiên cứu', 'Study')}</button>`,
    L.T('Tìm các phiên có biến động lớn bất thường (|lợi suất| > kσ của 60 phiên trước) và đo lợi suất trung bình sau đó 1, 5, 10, 20 phiên — kiểm tra phản ứng thái quá hay tiếp diễn.', 'Find unusually large moves (|return| > kσ of the prior 60 days) and measure average returns 1, 5, 10, 20 days later — overreaction or continuation?'));
  C.demoRun.shockStudy = box => {
    const out = box.querySelector('.demo-out'), el = box.querySelector('.demo-chart');
    if (el) el.style.display = 'none';
    C.wire(box, async () => {
      out.innerHTML = ld();
      try {
        const [mk, sym] = C.readSym(box), k = +box.querySelector('.d-k').value, bars = await C.loadBars(mk, sym, '1D');
        const c = bars.map(b => b.c), r = c.map((v, i) => i ? Math.log(v / c[i - 1]) : 0), H2 = [1, 5, 10, 20];
        const acc = { up: H2.map(() => []), dn: H2.map(() => []) }, base = H2.map(() => []);
        for (let i = 61; i < c.length; i++) {
          const w = r.slice(i - 60, i), m = w.reduce((a, b) => a + b, 0) / 60, s = Math.sqrt(w.reduce((a, b) => a + (b - m) ** 2, 0) / 59);
          H2.forEach((h, j) => { if (i + h < c.length) base[j].push(Math.log(c[i + h] / c[i])); });
          if (Math.abs(r[i]) > k * s) { const side = r[i] > 0 ? 'up' : 'dn'; H2.forEach((h, j) => { if (i + h < c.length) acc[side][j].push(Math.log(c[i + h] / c[i])); }); }
        }
        const avg = a => a.length ? (a.reduce((x, y) => x + y, 0) / a.length * 100) : NaN, win = a => a.length ? a.filter(x => x > 0).length / a.length * 100 : NaN;
        const row = (lab, arr) => `<tr><td>${lab} (n = ${arr[0].length})</td>${arr.map(a => `<td>${isNaN(avg(a)) ? '—' : avg(a).toFixed(2) + '% · ' + win(a).toFixed(0) + '%↑'}</td>`).join('')}</tr>`;
        out.innerHTML = `<table class="tbl"><thead><tr><th></th>${H2.map(h => `<th>+${h} ${L.T('phiên', 'd')}</th>`).join('')}</tr></thead><tbody>
          ${row(L.T('Sau cú tăng mạnh', 'After big up day'), acc.up)}${row(L.T('Sau cú giảm mạnh', 'After big down day'), acc.dn)}${row(L.T('Mọi phiên (cơ sở)', 'All days (base)'), base)}</tbody></table>
          <p class="muted">${L.T('So sánh với dòng "cơ sở". Mẫu sự kiện thường nhỏ → kết quả nhiễu; cần kiểm định trên nhiều mã và giai đoạn trước khi xây quy tắc.', 'Compare with the base row. Event samples are small → noisy; test across many symbols and periods before building rules.')}</p>`;
      } catch (e) { C.err(out, e); }
    });
  };

  /* ================= L3-22 ================= */
  C.addLesson('l3-22', {
    goals: ['Mô tả các giai đoạn hình thành và vỡ của bong bóng.', 'Phân tích các động lực hành vi và tín dụng nuôi bong bóng.', 'Nhận diện dấu hiệu kỹ thuật và tâm lý của bong bóng.', 'Rút bài học từ các bong bóng lịch sử, kể cả ở Việt Nam.'],
    body: () => `
<h3>1. Bong bóng là gì?</h3>
<p>Bong bóng là giai đoạn giá tài sản tăng <b>vượt xa</b> giá trị có thể biện minh bằng cơ bản, chủ yếu do kỳ vọng giá sẽ tiếp tục tăng (mua để bán lại cho người khác với giá cao hơn), sau đó sụp đổ mạnh. Bong bóng chỉ chắc chắn được xác nhận <b>sau khi vỡ</b> — nhưng các đặc điểm của nó lặp lại đáng kinh ngạc.</p>
<h3>2. Năm giai đoạn điển hình</h3>
<table class="tbl"><thead><tr><th>Giai đoạn</th><th>Diễn biến</th><th>Tâm lý</th></tr></thead><tbody>
<tr><td><b>1. Cú hích</b></td><td>Một thay đổi thật: công nghệ mới, chính sách, phát minh tài chính, lãi suất rất thấp</td><td>Cơ hội có thật, người đi đầu có lãi</td></tr>
<tr><td><b>2. Bùng nổ</b></td><td>Tín dụng mở rộng, giá tăng, truyền thông chú ý, người mới tham gia</td><td>Lạc quan, câu chuyện lan rộng</td></tr>
<tr><td><b>3. Hưng phấn</b></td><td>Giá tăng parabol, định giá phi lý, IPO và phát hành ồ ạt, đòn bẩy cao; "lần này khác"</td><td>Phấn khích, FOMO, coi thường rủi ro</td></tr>
<tr><td><b>4. Khủng hoảng / chốt lời</b></td><td>Người trong cuộc bán ra, một sự kiện châm ngòi (lãi suất, gian lận, vỡ nợ), giá chững lại</td><td>Lo lắng, phủ nhận</td></tr>
<tr><td><b>5. Hoảng loạn</b></td><td>Bán tháo, thanh lý ký quỹ, tín dụng co lại, giá giảm sâu thường dưới giá trị hợp lý</td><td>Sợ hãi, đầu hàng, ghê sợ tài sản đó</td></tr></tbody></table>
<h3>3. Động lực</h3>
<ul><li><b>Tín dụng/đòn bẩy</b>: hầu hết bong bóng lớn đi kèm mở rộng tín dụng; đòn bẩy cũng là cơ chế làm sụp đổ nhanh (thanh lý dây chuyền).</li>
<li><b>Hành vi</b>: ngoại suy xu hướng gần đây, quá tự tin, bầy đàn, câu chuyện hấp dẫn ("kỷ nguyên mới"), bỏ qua xác suất cơ sở, ngại hối tiếc khi đứng ngoài.</li>
<li><b>Giới hạn kinh doanh chênh lệch</b>: người hoài nghi khó bán khống đủ lâu; nhà quản lý quỹ có rủi ro nghề nghiệp nếu đứng ngoài.</li>
<li><b>Vòng phản hồi</b>: giá tăng → câu chuyện mạnh hơn → thêm người mua → giá tăng.</li></ul>
<h3>4. Dấu hiệu nhận biết</h3>
<table class="tbl"><thead><tr><th>Kỹ thuật</th><th>Tâm lý/cấu trúc</th></tr></thead><tbody>
<tr><td>Đường giá cong lên dạng parabol, góc dốc tăng dần</td><td>"Lần này khác", định giá được biện minh bằng thước đo mới</td></tr>
<tr><td>Khối lượng cao trào ở đỉnh (blow-off)</td><td>Nhà đầu tư mới tràn vào, tài khoản mới kỷ lục</td></tr>
<tr><td>Độ rộng thu hẹp: chỉ một nhóm nhỏ dẫn dắt</td><td>Phát hành mới, IPO, sáp nhập ồ ạt</td></tr>
<tr><td>Biến động tăng ngay cả khi giá tăng</td><td>Đòn bẩy, margin kỷ lục</td></tr>
<tr><td>Giá cách xa MA dài hạn bất thường</td><td>Người trong cuộc bán ra</td></tr></tbody></table>
<h3>5. Bài học lịch sử</h3>
<p>Từ hoa tulip, công ty thương mại biển Nam, thập niên 1920, Nhật Bản cuối 1980, công nghệ cuối 1990, nhà đất Mỹ 2006, đến các đợt tăng nóng của crypto và các chu kỳ sôi động của chứng khoán Việt Nam (2007, 2018, 2021–2022): <b>câu chuyện khác nhau, cấu trúc giống nhau</b> — tín dụng dễ, người mới tham gia, định giá phi lý, rồi sụp đổ khi điều kiện tín dụng thắt chặt. Sau đỉnh, giá thường giảm <b>50–90%</b> và mất nhiều năm (có khi hàng chục năm) để quay lại.</p>`,
    keys: ['Bong bóng: giá vượt xa cơ bản do kỳ vọng tăng tiếp, rồi sụp đổ; chỉ chắc chắn sau khi vỡ.', 'Năm giai đoạn: cú hích → bùng nổ → hưng phấn → khủng hoảng/chốt lời → hoảng loạn.', 'Động lực: tín dụng/đòn bẩy, hành vi (ngoại suy, bầy đàn, câu chuyện), giới hạn kinh doanh chênh lệch, vòng phản hồi.', 'Dấu hiệu: parabol, khối lượng cao trào, độ rộng hẹp, biến động tăng khi giá tăng, giá xa MA dài; "lần này khác", margin/tài khoản mới kỷ lục, IPO ồ ạt.', 'Lịch sử: câu chuyện khác, cấu trúc giống; giảm 50–90% sau đỉnh.'],
    terms: [['Displacement', 'Cú hích'], ['Euphoria', 'Hưng phấn'], ['Blow-off top', 'Đỉnh cao trào'], ['Revulsion', 'Ghê sợ / chán ghét'], ['New era thinking', 'Tư duy "kỷ nguyên mới"'], ['Margin debt', 'Dư nợ ký quỹ']]
  }, {
    goals: ['Describe bubble stages.', 'Analyse behavioural and credit drivers.', 'Recognise technical and psychological signs.', 'Learn from history, including Vietnam.'],
    body: () => `
<h3>1. Definition</h3><p>Prices far above fundamentals driven by expectations of further rises, followed by collapse; confirmed only afterwards, yet structurally repetitive.</p>
<h3>2. Five stages</h3><ol><li>Displacement</li><li>Boom</li><li>Euphoria</li><li>Distress/profit-taking</li><li>Panic/revulsion</li></ol>
<h3>3. Drivers</h3><ul><li>Credit and leverage.</li><li>Extrapolation, herding, narratives.</li><li>Limits to arbitrage, career risk.</li><li>Feedback loops.</li></ul>
<h3>4. Signs</h3><p>Parabolic price, blow-off volume, narrowing breadth, rising volatility in an advance, distance from long MAs; "this time is different", record margin and new accounts, issuance waves, insider selling.</p>
<h3>5. History</h3><p>Different stories, same structure; 50–90% declines and long recoveries.</p>`,
    keys: ['Definition.', 'Stages.', 'Drivers.', 'Signs.', 'History.'],
    terms: [['Blow-off top', 'Climactic final surge'], ['Displacement', 'Triggering change']]
  }, [
    ['Bong bóng tài sản là:', 'An asset bubble is:', ['Giá vượt xa giá trị cơ bản do kỳ vọng giá tiếp tục tăng, rồi sụp đổ', 'Mọi đợt tăng giá', 'Giá thấp hơn giá trị', 'Thị trường đi ngang'], ['Prices far above fundamentals on expectations of further rises, then collapsing', 'Any rally', 'Prices below value', 'A sideways market'], 0, '', ''],
    ['Bong bóng thường chỉ được xác nhận chắc chắn:', 'A bubble is usually only confirmed:', ['Sau khi vỡ', 'Ở giai đoạn cú hích', 'Trước khi bắt đầu', 'Không bao giờ'], ['After it bursts', 'At displacement', 'Before it starts', 'Never'], 0, '', ''],
    ['Giai đoạn đầu tiên của bong bóng:', 'The first stage of a bubble:', ['Cú hích — một thay đổi có thật', 'Hoảng loạn', 'Hưng phấn', 'Ghê sợ'], ['Displacement — a real change', 'Panic', 'Euphoria', 'Revulsion'], 0, '', ''],
    ['Giai đoạn có đặc điểm giá parabol, định giá phi lý, "lần này khác":', 'Parabolic prices, absurd valuations, "this time is different":', ['Hưng phấn', 'Cú hích', 'Hoảng loạn', 'Tích luỹ'], ['Euphoria', 'Displacement', 'Panic', 'Accumulation'], 0, '', ''],
    ['Yếu tố gần như luôn đi kèm bong bóng lớn:', 'A factor almost always present in major bubbles:', ['Mở rộng tín dụng/đòn bẩy', 'Lãi suất cao', 'Thanh khoản thấp', 'Bi quan'], ['Credit expansion/leverage', 'High rates', 'Low liquidity', 'Pessimism'], 0, '', ''],
    ['Đòn bẩy làm bong bóng sụp đổ nhanh vì:', 'Leverage speeds bubble collapses because:', ['Thanh lý ký quỹ dây chuyền', 'Tăng thanh khoản', 'Giảm biến động', 'Không đúng'], ['Margin liquidation cascades', 'More liquidity', 'Less volatility', 'False'], 0, '', ''],
    ['Vì sao người hoài nghi khó chống lại bong bóng?', 'Why can’t sceptics easily fight a bubble?', ['Bán khống có thể lỗ nặng trước khi đúng; quỹ có rủi ro nghề nghiệp nếu đứng ngoài', 'Bị cấm phân tích', 'Bong bóng không tồn tại', 'Không đúng'], ['Shorts can lose heavily before being right; managers face career risk', 'Analysis banned', 'Bubbles don’t exist', 'False'], 0, '', ''],
    ['Dấu hiệu kỹ thuật của bong bóng:', 'A technical sign of a bubble:', ['Đường giá parabol với góc dốc tăng dần', 'Đi ngang hẹp', 'Khối lượng cạn kiệt', 'Giá dưới MA 200'], ['A parabolic price path with increasing slope', 'A tight range', 'Dried-up volume', 'Price below its 200-MA'], 0, '', ''],
    ['Khối lượng cao trào ở đỉnh sau đợt tăng dài gọi là:', 'Climactic volume at a top after a long rise is a:', ['Đỉnh cao trào (blow-off)', 'Đáy cao trào', 'Tích luỹ', 'Gap kiệt sức giảm'], ['Blow-off top', 'Selling climax', 'Accumulation', 'Down exhaustion gap'], 0, '', ''],
    ['Độ rộng thu hẹp trong bong bóng nghĩa là:', 'Narrowing breadth in a bubble means:', ['Chỉ một nhóm nhỏ dẫn dắt chỉ số', 'Mọi mã cùng tăng', 'Thị trường giảm', 'Không ý nghĩa'], ['A small group drives the index', 'Everything rises', 'Market falls', 'Meaningless'], 0, '', ''],
    ['Dấu hiệu cấu trúc của hưng phấn:', 'A structural sign of euphoria:', ['IPO và phát hành mới ồ ạt, margin kỷ lục', 'Không có IPO', 'Margin thấp', 'Thanh khoản thấp'], ['Waves of IPOs/issuance, record margin', 'No IPOs', 'Low margin', 'Low turnover'], 0, '', ''],
    ['Người trong cuộc bán mạnh trong khi công chúng mua đuổi thường thuộc giai đoạn:', 'Insiders selling while the public chases usually belongs to:', ['Khủng hoảng/chốt lời (cuối hưng phấn)', 'Cú hích', 'Ghê sợ', 'Tích luỹ đầu'], ['Distress/profit-taking (late euphoria)', 'Displacement', 'Revulsion', 'Early accumulation'], 0, '', ''],
    ['Giai đoạn cuối, giá thường giảm:', 'In the final stage prices often fall:', ['Xuống dưới giá trị hợp lý', 'Đúng giá trị hợp lý', 'Không giảm', 'Tăng lại ngay'], ['Below fair value', 'Exactly to fair value', 'Not at all', 'Back up immediately'], 0, '', ''],
    ['Sau đỉnh bong bóng lớn, mức giảm thường thấy:', 'Typical declines after major bubble peaks:', ['50–90%', '5%', '0%', '10–15%'], null, 0, '', ''],
    ['"Lần này khác" là dấu hiệu của:', '"This time is different" signals:', ['Tư duy kỷ nguyên mới — biện minh cho định giá phi lý', 'Phân tích thận trọng', 'Đáy thị trường', 'Không gì'], ['New-era thinking justifying absurd valuations', 'Careful analysis', 'A bottom', 'Nothing'], 0, '', ''],
    ['Biến động tăng ngay cả khi giá đang tăng mạnh gợi ý:', 'Volatility rising even as prices surge suggests:', ['Tính bất ổn, đòn bẩy cao — rủi ro đỉnh', 'Xu hướng lành mạnh', 'Đáy', 'Không gì'], ['Instability and leverage — top risk', 'A healthy trend', 'A bottom', 'Nothing'], 0, '', ''],
    ['Vòng phản hồi trong bong bóng:', 'The bubble feedback loop:', ['Giá tăng → câu chuyện mạnh hơn → thêm người mua → giá tăng', 'Giá giảm → mua thêm', 'Không có', 'Lãi suất → cổ tức'], ['Rising price → stronger story → more buyers → higher price', 'Falling price → more buying', 'None', 'Rates → dividends'], 0, '', ''],
    ['Sự kiện châm ngòi phổ biến làm vỡ bong bóng:', 'A common trigger for bursting:', ['Thắt chặt tín dụng/lãi suất tăng, gian lận, vỡ nợ', 'Lãi suất giảm', 'Thêm người mua', 'Không có'], ['Credit tightening/higher rates, fraud, defaults', 'Rate cuts', 'More buyers', 'None'], 0, '', ''],
    ['Giai đoạn "ghê sợ" (revulsion) là:', 'The "revulsion" stage is:', ['Nhà đầu tư chán ghét tài sản sau khi sụp đổ, bán bất chấp giá trị', 'Giai đoạn hưng phấn', 'Cú hích', 'Tích luỹ thông minh'], ['Investors loathe the asset after the crash and dump it regardless of value', 'Euphoria', 'Displacement', 'Smart accumulation'], 0, '', ''],
    ['Bài học từ các bong bóng lịch sử:', 'The lesson from historical bubbles:', ['Câu chuyện khác nhau nhưng cấu trúc giống nhau', 'Mỗi bong bóng hoàn toàn khác', 'Không có bài học', 'Bong bóng không lặp lại'], ['Different stories, same structure', 'Each is entirely different', 'No lessons', 'They never recur'], 0, '', ''],
    ['Ở Việt Nam, dấu hiệu hưng phấn thường gặp:', 'In Vietnam, common euphoria signs:', ['Tài khoản mở mới và thanh khoản kỷ lục, margin cao, cổ phiếu đầu cơ tăng trần liên tiếp', 'Thanh khoản thấp', 'Khối ngoại mua ròng duy nhất', 'Không có'], ['Record new accounts and turnover, high margin, speculative stocks hitting limit-up repeatedly', 'Low turnover', 'Only foreign buying', 'None'], 0, '', ''],
    ['Giá cách xa MA 200 ngày ở mức kỷ lục so với lịch sử là:', 'Price at a record distance above its 200-day MA is:', ['Dấu hiệu quá đà, rủi ro tăng', 'Đáy', 'Bình thường', 'Tín hiệu mua an toàn'], ['A sign of overextension and rising risk', 'A bottom', 'Normal', 'A safe buy'], 0, '', ''],
    ['Ngoại suy xu hướng gần đây là thiên kiến thuộc:', 'Extrapolating recent trends is a bias related to:', ['Đại diện / sẵn có', 'Ghét lỗ', 'Hiện trạng', 'Sở hữu'], ['Representativeness / availability', 'Loss aversion', 'Status quo', 'Endowment'], 0, '', ''],
    ['Nhà đầu tư mới tham gia ồ ạt thường xảy ra ở giai đoạn:', 'A flood of new investors typically occurs in:', ['Bùng nổ muộn và hưng phấn', 'Cú hích', 'Ghê sợ', 'Tích luỹ'], ['Late boom and euphoria', 'Displacement', 'Revulsion', 'Accumulation'], 0, '', ''],
    ['Bong bóng có thể được xác định "chắc chắn" trước khi vỡ không?', 'Can a bubble be identified "for certain" before it bursts?', ['Không — chỉ nhận diện được mức rủi ro cao qua các dấu hiệu', 'Có, luôn luôn', 'Có, bằng một chỉ báo', 'Không cần'], ['No — only elevated risk via signs', 'Yes, always', 'Yes, with one indicator', 'Unneeded'], 0, '', ''],
    ['Ứng xử hợp lý khi nhiều dấu hiệu bong bóng xuất hiện:', 'Sensible conduct when many bubble signs appear:', ['Giảm quy mô, chặt dừng động, không dùng đòn bẩy, không bán khống sớm', 'Tăng đòn bẩy', 'Bán khống toàn lực', 'Mua thêm'], ['Cut size, tighten trailing stops, avoid leverage, don’t short early', 'Add leverage', 'Short heavily', 'Buy more'], 0, '', ''],
    ['Câu chuyện "kỷ nguyên mới" thường xuất phát từ:', 'New-era narratives usually start from:', ['Một thay đổi có thật bị ngoại suy quá mức', 'Hư cấu hoàn toàn', 'Luật pháp', 'Không có'], ['A real change over-extrapolated', 'Pure fiction', 'Law', 'Nothing'], 0, '', ''],
    ['Sau bong bóng vỡ, thời gian để giá quay lại đỉnh:', 'After a burst, time to regain the peak:', ['Thường nhiều năm, có khi hàng chục năm', 'Vài ngày', 'Luôn 1 tháng', 'Không bao giờ có thể'], ['Often many years, sometimes decades', 'Days', 'Always a month', 'Never possible'], 0, '', ''],
    ['Liên hệ bong bóng với Wyckoff: giai đoạn hưng phấn – khủng hoảng tương ứng:', 'Linking bubbles to Wyckoff, euphoria–distress corresponds to:', ['Phân phối', 'Tích luỹ', 'Tăng giá sớm', 'Không có'], ['Distribution', 'Accumulation', 'Early markup', 'None'], 0, '', ''],
    ['Bài học chính về giải phẫu bong bóng:', 'Key lesson on bubble anatomy:', ['Nhận diện mức rủi ro qua cấu trúc lặp lại để bảo vệ vốn', 'Bong bóng không thể nhận biết', 'Luôn bán khống sớm', 'Bỏ qua'], ['Recognise risk through recurring structure to protect capital', 'Bubbles are unknowable', 'Always short early', 'Ignore'], 0, '', '']
  ]);

  /* ================= L3-23 ================= */
  C.addLesson('l3-23', {
    goals: ['So sánh các chiến lược đối phó bong bóng: đứng ngoài, cưỡi sóng có kỷ luật, đi ngược.', 'Giải thích vì sao các nhà quản lý chuyên nghiệp vẫn tham gia bong bóng.', 'Xây dựng kỷ luật bán và các công cụ phòng vệ hành vi.', 'Tìm nguồn alpha từ sai lầm hành vi của thị trường.'],
    body: () => `
<h3>1. Ba cách đối phó bong bóng</h3>
<table class="tbl"><thead><tr><th>Chiến lược</th><th>Ưu điểm</th><th>Rủi ro</th></tr></thead><tbody>
<tr><td><b>Đứng ngoài</b> (kỷ luật định giá)</td><td>Tránh sụp đổ</td><td>Bỏ lỡ giai đoạn tăng mạnh nhất; áp lực nghề nghiệp/khách hàng; có thể quá sớm nhiều năm</td></tr>
<tr><td><b>Cưỡi sóng có kỷ luật</b> (theo xu hướng)</td><td>Tham gia phần lớn đợt tăng, thoát khi xu hướng gãy</td><td>Trả lại một phần lợi nhuận; gap giảm mạnh vượt dừng</td></tr>
<tr><td><b>Đi ngược sớm</b> (bán khống)</td><td>Lãi lớn nếu đúng thời điểm</td><td>"Đúng nhưng quá sớm" = thua; lỗ không giới hạn khi bán khống</td></tr></tbody></table>
<p>Với nhà PTKT, cách hợp lý thường là <b>cưỡi sóng có kỷ luật</b>: tham gia khi xu hướng xác nhận, <b>giảm quy mô khi các dấu hiệu bong bóng tích tụ</b>, dùng dừng động chặt dần, không dùng đòn bẩy ở giai đoạn muộn, và <b>chỉ đi ngược khi giá đã gãy cấu trúc</b>.</p>
<h3>2. Vì sao người chuyên nghiệp vẫn tham gia?</h3>
<ul><li><b>Rủi ro nghề nghiệp</b>: thua chuẩn trong lúc bong bóng phình to có thể mất khách hàng/việc; sai cùng đám đông thì "an toàn".</li>
<li><b>Thời gian đánh giá ngắn</b> (quý, năm) — không đủ để chờ bong bóng vỡ.</li>
<li><b>Ảo tưởng thoát kịp</b>: tin rằng mình sẽ bán trước người khác.</li>
<li>Kết quả: giá có thể duy trì sai lệch lâu hơn nhiều so với dự đoán của người hoài nghi.</li></ul>
<h3>3. Kỷ luật bán</h3>
<p>Phần lớn nhà đầu tư có quy trình mua chi tiết nhưng <b>không có quy trình bán</b>. Quy tắc bán cần viết sẵn:</p>
<ul><li><b>Dừng giá</b>: dừng động theo ATR/đáy gần nhất; gãy MA dài hạn trên khung tuần.</li>
<li><b>Dừng luận điểm</b>: lý do mua ban đầu không còn đúng.</li>
<li><b>Dừng định giá</b>: định giá vượt ngưỡng định trước → giảm tỷ trọng từng phần.</li>
<li><b>Dừng thời gian</b>: luận điểm không phát triển sau thời gian dự kiến.</li></ul>
<h3>4. Công cụ phòng vệ hành vi</h3>
<ul><li><b>Danh sách kiểm tra</b> trước mỗi quyết định (bằng chứng phản bác, xác suất cơ sở, kịch bản xấu).</li>
<li><b>Pre-mortem</b> cho các vị thế lớn.</li>
<li><b>Nhật ký quyết định</b> ghi lý do và mức tự tin để hiệu chỉnh sau.</li>
<li><b>Quy tắc tự động</b> để không phải quyết định khi cảm xúc cao.</li></ul>
<h3>5. Nguồn alpha từ hành vi</h3>
<ul><li><b>Phản ứng chậm</b> → theo xu hướng, trôi theo tin (mua sau tin tốt được giá xác nhận).</li>
<li><b>Phản ứng thái quá</b> → đảo chiều ở cực trị tâm lý, đặc biệt khi kèm tín hiệu giá (cao trào bán, đáy Wyckoff).</li>
<li><b>Bán bắt buộc</b> (thanh lý margin, quỹ bị rút vốn, loại khỏi rổ chỉ số) → giá tạm thời rẻ hơn giá trị.</li>
<li><b>Chân trời dài hơn đám đông</b>: chấp nhận thua chuẩn ngắn hạn là lợi thế cấu trúc của nhà đầu tư cá nhân có kỷ luật.</li></ul>
${H.biasCheck()}`,
    keys: ['Đối phó bong bóng: đứng ngoài (quá sớm), cưỡi sóng có kỷ luật (hợp lý cho PTKT), đi ngược sớm (đúng mà sớm = thua).', 'Người chuyên nghiệp tham gia vì rủi ro nghề nghiệp, thời gian đánh giá ngắn, ảo tưởng thoát kịp.', 'Kỷ luật bán: dừng giá, dừng luận điểm, dừng định giá, dừng thời gian — viết sẵn.', 'Phòng vệ: danh sách kiểm tra, pre-mortem, nhật ký, quy tắc tự động.', 'Alpha hành vi: phản ứng chậm, phản ứng thái quá, bán bắt buộc, chân trời dài.'],
    terms: [['Career risk', 'Rủi ro nghề nghiệp'], ['Sell discipline', 'Kỷ luật bán'], ['Thesis stop', 'Dừng luận điểm'], ['Forced selling', 'Bán bắt buộc'], ['Time-horizon arbitrage', 'Lợi thế chân trời thời gian']]
  }, {
    goals: ['Compare bubble strategies.', 'Explain why professionals participate.', 'Build sell discipline and behavioural safeguards.', 'Find alpha in others’ behavioural errors.'],
    body: () => `
<h3>1. Three approaches</h3><p>Stay out (often too early), ride with discipline (sensible for technicians), fight early (right but early = wrong). Ride confirmed trends, cut size as signs pile up, tighten trailing stops, avoid late leverage, fade only after structure breaks.</p>
<h3>2. Why professionals join</h3><ul><li>Career risk</li><li>Short evaluation horizons</li><li>Illusion of a timely exit</li></ul>
<h3>3. Sell discipline</h3><p>Price stops, thesis stops, valuation stops, time stops — written in advance.</p>
<h3>4. Safeguards</h3><p>Checklists, pre-mortems, decision journals, automatic rules.</p>
<h3>5. Behavioural alpha</h3><p>Underreaction (trend, drift), overreaction (extremes with price confirmation), forced selling, longer horizons.</p>${H.biasCheck()}`,
    keys: ['Three approaches.', 'Professional incentives.', 'Sell discipline.', 'Safeguards.', 'Sources of alpha.'],
    terms: [['Career risk', 'Fear of underperforming peers'], ['Forced selling', 'Non-economic selling pressure']]
  }, [
    ['Rủi ro chính của chiến lược đứng ngoài bong bóng:', 'The main risk of staying out of a bubble:', ['Bỏ lỡ giai đoạn tăng mạnh nhất, có thể quá sớm nhiều năm', 'Lỗ không giới hạn', 'Thanh lý ký quỹ', 'Không rủi ro'], ['Missing the strongest phase, possibly years too early', 'Unlimited loss', 'Margin calls', 'No risk'], 0, '', ''],
    ['"Đúng nhưng quá sớm" khi bán khống bong bóng thường dẫn tới:', '"Right but too early" shorting a bubble usually means:', ['Thua lỗ nặng trước khi được chứng minh đúng', 'Lãi lớn ngay', 'Không ảnh hưởng', 'Hoà vốn'], ['Heavy losses before being proven right', 'Instant big profits', 'No effect', 'Breakeven'], 0, '', ''],
    ['Cách hợp lý nhất với nhà PTKT khi đối mặt bong bóng:', 'The most sensible technician approach to a bubble:', ['Cưỡi sóng có kỷ luật, giảm quy mô khi dấu hiệu tích tụ, dừng động chặt dần', 'Bán khống ngay khi thấy tăng mạnh', 'Dùng đòn bẩy tối đa ở giai đoạn muộn', 'Không bao giờ tham gia'], ['Ride with discipline, cut size as signs accumulate, tighten trailing stops', 'Short at the first big rise', 'Max leverage late', 'Never participate'], 0, '', ''],
    ['Khi nào nên cân nhắc đi ngược (bán/giảm mạnh)?', 'When to consider fading (selling/cutting hard)?', ['Khi giá đã gãy cấu trúc xu hướng', 'Khi định giá cao lần đầu', 'Khi người khác nói bong bóng', 'Không bao giờ'], ['After price breaks the trend structure', 'At the first high valuation', 'When others say "bubble"', 'Never'], 0, '', ''],
    ['Rủi ro nghề nghiệp khiến nhà quản lý quỹ:', 'Career risk makes fund managers:', ['Tham gia bong bóng để không thua chuẩn', 'Luôn đứng ngoài', 'Bán khống mạnh', 'Không ảnh hưởng'], ['Join bubbles to avoid trailing the benchmark', 'Always stay out', 'Short heavily', 'Unaffected'], 0, '', ''],
    ['"Sai cùng đám đông thì an toàn" phản ánh:', '"Being wrong with the crowd is safe" reflects:', ['Động cơ nghề nghiệp và ngại hối tiếc', 'Phân tích cơ bản', 'Kỷ luật', 'Không gì'], ['Career incentives and regret aversion', 'Fundamental analysis', 'Discipline', 'Nothing'], 0, '', ''],
    ['Ảo tưởng thoát kịp là:', 'The illusion of a timely exit is:', ['Tin rằng mình sẽ bán trước những người khác khi bong bóng vỡ', 'Kỷ luật bán', 'Dừng lỗ', 'Không có'], ['Believing you’ll sell before others when it bursts', 'Sell discipline', 'A stop', 'None'], 0, '', ''],
    ['Phần lớn nhà đầu tư thiếu quy trình gì?', 'What process do most investors lack?', ['Quy trình bán', 'Quy trình mua', 'Mở tài khoản', 'Nạp tiền'], ['A sell process', 'A buy process', 'Account opening', 'Deposits'], 0, '', ''],
    ['Dừng luận điểm là:', 'A thesis stop is:', ['Bán khi lý do mua ban đầu không còn đúng', 'Bán khi giá giảm 1%', 'Bán theo lịch', 'Không bán'], ['Selling when the original reason no longer holds', 'Selling on −1%', 'Calendar selling', 'Never selling'], 0, '', ''],
    ['Dừng định giá là:', 'A valuation stop is:', ['Giảm tỷ trọng khi định giá vượt ngưỡng định trước', 'Mua thêm khi đắt', 'Không liên quan định giá', 'Bán khi rẻ'], ['Trim when valuation exceeds a preset level', 'Buy more when expensive', 'Unrelated to valuation', 'Sell when cheap'], 0, '', ''],
    ['Dừng thời gian là:', 'A time stop is:', ['Thoát khi luận điểm không phát triển sau thời gian dự kiến', 'Thoát khi lãi', 'Giữ mãi', 'Không có'], ['Exit when the thesis fails to develop in the expected time', 'Exit when profitable', 'Hold forever', 'None'], 0, '', ''],
    ['Nhật ký quyết định ghi mức tự tin giúp:', 'Logging confidence levels helps:', ['Hiệu chỉnh độ tự tin theo kết quả thực tế', 'Tăng quá tự tin', 'Không gì', 'Che sai lầm'], ['Calibrate confidence against outcomes', 'Raise overconfidence', 'Nothing', 'Hide errors'], 0, '', ''],
    ['Nguồn alpha từ phản ứng chậm của thị trường:', 'Alpha from market underreaction:', ['Theo xu hướng, trôi theo tin', 'Bắt đáy mọi lúc', 'Bán khống mọi đợt tăng', 'Không có'], ['Trend following, post-news drift', 'Bottom-fishing always', 'Shorting every rally', 'None'], 0, '', ''],
    ['Nguồn alpha từ phản ứng thái quá:', 'Alpha from overreaction:', ['Đảo chiều ở cực trị tâm lý kèm tín hiệu giá', 'Mua đuổi đỉnh', 'Theo đám đông', 'Không có'], ['Reversals at sentiment extremes with price confirmation', 'Chasing tops', 'Following crowds', 'None'], 0, '', ''],
    ['Bán bắt buộc (thanh lý margin, loại khỏi rổ chỉ số) tạo cơ hội vì:', 'Forced selling creates opportunity because:', ['Giá bị đẩy xuống vì lý do phi kinh tế, tạm thời rẻ hơn giá trị', 'Giá luôn đúng', 'Không có cơ hội', 'Bị cấm'], ['Prices are pushed down for non-economic reasons, temporarily cheap', 'Prices are always right', 'No opportunity', 'Banned'], 0, '', ''],
    ['Lợi thế cấu trúc của nhà đầu tư cá nhân có kỷ luật:', 'A disciplined individual investor’s structural edge:', ['Chân trời thời gian dài hơn, không bị đánh giá theo quý', 'Thông tin nội bộ', 'Phí thấp nhất', 'Không có'], ['A longer horizon, no quarterly evaluation', 'Inside info', 'Lowest fees', 'None'], 0, '', ''],
    ['Danh sách kiểm tra trước quyết định nên gồm:', 'A pre-decision checklist should include:', ['Bằng chứng phản bác, xác suất cơ sở, kịch bản xấu', 'Chỉ lý do mua', 'Tin đồn', 'Không gì'], ['Disconfirming evidence, base rates, bad scenarios', 'Only reasons to buy', 'Rumours', 'Nothing'], 0, '', ''],
    ['Tình huống: cổ phiếu đã tăng 400% trong 12 tháng, khối lượng cao trào, margin kỷ lục; giá vẫn trên dừng động. Hành động hợp lý:', 'Case: stock +400% in 12 months, climactic volume, record margin; price still above the trailing stop. Sensible action:', ['Giảm quy mô từng phần, chặt dừng động, không thêm đòn bẩy', 'Mua thêm gấp đôi', 'Bán khống toàn bộ', 'Bỏ dừng lỗ'], ['Trim partially, tighten the trailing stop, no added leverage', 'Double up', 'Short everything', 'Remove stops'], 0, '', ''],
    ['Tình huống: sau đợt sụp đổ, giá phá đáy với khối lượng cao trào rồi bật mạnh, test lại đáy với khối lượng thấp. Đây có thể là:', 'Case: after a crash, a climactic-volume low, sharp rebound, then a low-volume retest. This may be:', ['Cơ hội đảo chiều do phản ứng thái quá (cao trào bán + test thành công)', 'Đỉnh bong bóng', 'Không ý nghĩa', 'Tín hiệu bán khống'], ['An overreaction reversal opportunity (selling climax + successful test)', 'A bubble top', 'Meaningless', 'A short signal'], 0, '', ''],
    ['Giá có thể duy trì sai lệch lâu vì:', 'Mispricing can persist long because:', ['Động cơ nghề nghiệp và giới hạn kinh doanh chênh lệch', 'Thị trường luôn hiệu quả', 'Không có người giao dịch', 'Không đúng'], ['Career incentives and limits to arbitrage', 'Markets are always efficient', 'No traders', 'False'], 0, '', ''],
    ['Quy tắc tự động có ích nhất khi:', 'Automatic rules help most when:', ['Cảm xúc ở mức cao (hưng phấn hoặc hoảng loạn)', 'Thị trường yên', 'Không giao dịch', 'Không bao giờ'], ['Emotions run high (euphoria or panic)', 'Markets are calm', 'Not trading', 'Never'], 0, '', ''],
    ['Pre-mortem cho vị thế lớn giúp:', 'A pre-mortem for a large position helps:', ['Nhìn thấy kịch bản thất bại trước khi cam kết vốn', 'Tăng tự tin', 'Không gì', 'Giảm phí'], ['See failure scenarios before committing capital', 'Boost confidence', 'Nothing', 'Cut fees'], 0, '', ''],
    ['Thiếu quy trình bán thường khiến lợi nhuận:', 'Lacking a sell process often makes profits:', ['Bị trả lại thị trường khi xu hướng đảo', 'Tăng thêm', 'Được bảo vệ', 'Không ảnh hưởng'], ['Be given back when trends reverse', 'Grow', 'Be protected', 'Unaffected'], 0, '', ''],
    ['Theo xu hướng giúp tham gia bong bóng an toàn hơn vì:', 'Trend following makes bubble participation safer because:', ['Có quy tắc thoát khách quan khi xu hướng gãy', 'Không bao giờ lỗ', 'Bán ở đỉnh chính xác', 'Không đúng'], ['It has objective exits when the trend breaks', 'It never loses', 'It sells the exact top', 'False'], 0, '', ''],
    ['Gap giảm mạnh sau đỉnh bong bóng gây rủi ro gì cho người cưỡi sóng?', 'What risk do post-peak downside gaps pose to riders?', ['Lỗ vượt dừng động', 'Không rủi ro', 'Lãi thêm', 'Không thể xảy ra'], ['Losses beyond the trailing stop', 'No risk', 'Extra profit', 'Impossible'], 0, '', ''],
    ['Nhà đầu tư giá trị thuần thường gặp khó trong bong bóng vì:', 'Pure value investors struggle in bubbles because:', ['Bán quá sớm và thua chuẩn kéo dài', 'Mua quá muộn', 'Không có cổ phiếu', 'Do luật'], ['They sell too early and trail for long', 'Buy too late', 'No stocks', 'Law'], 0, '', ''],
    ['Kết hợp định giá và kỹ thuật trong bong bóng:', 'Combining valuation and technicals in bubbles:', ['Định giá báo rủi ro tăng (giảm quy mô), kỹ thuật quyết định thời điểm thoát', 'Chỉ dùng định giá', 'Chỉ dùng kỹ thuật, bỏ rủi ro', 'Không kết hợp'], ['Valuation flags rising risk (cut size), technicals time the exit', 'Valuation only', 'Technicals only, ignore risk', 'No combination'], 0, '', ''],
    ['Mục tiêu của "thoát bong bóng":', 'The goal of "de-bubbling":', ['Bảo toàn phần lớn lợi nhuận và tránh tổn thất vĩnh viễn', 'Bán đúng đỉnh', 'Không tham gia gì', 'Tối đa đòn bẩy'], ['Keep most gains and avoid permanent losses', 'Sell the exact top', 'Never participate', 'Max leverage'], 0, '', ''],
    ['Bài học chính:', 'Key lesson:', ['Kỷ luật quy trình (đặc biệt quy trình bán) quan trọng hơn dự đoán chính xác đỉnh', 'Phải dự đoán đúng đỉnh', 'Luôn đứng ngoài', 'Luôn bán khống'], ['Process discipline (especially selling) beats predicting the exact top', 'Must call the top', 'Always stay out', 'Always short'], 0, '', ''],
    ['Alpha hành vi bền vững nhất thường đến từ:', 'The most durable behavioural alpha usually comes from:', ['Kỷ luật hành động ngược với sai lầm hành vi phổ biến', 'Tin nội bộ', 'May mắn', 'Không có'], ['Disciplined action against common behavioural errors', 'Inside info', 'Luck', 'None'], 0, '', '']
  ]);

  /* ================= L3-24 ================= */
  C.addLesson('l3-24', {
    goals: ['Chuyển các hiện tượng hành vi thành quy tắc giao dịch khách quan.', 'Phân tích phản ứng của giá sau cú sốc và sự kiện.', 'Áp dụng các kỹ thuật: mua khi quá bán trong xu hướng tăng, giao dịch gap, số tròn, cực trị tâm lý.', 'Kiểm định và quản lý rủi ro cho các kỹ thuật hành vi.'],
    body: () => `
<h3>1. Từ hành vi đến quy tắc</h3>
<p>Hiểu thiên kiến chưa đủ — cần <b>định lượng</b> để giao dịch được. Quy trình: hiện tượng hành vi → giả thuyết giá → quy tắc khách quan → kiểm định → quản lý rủi ro.</p>
<h3>2. Phản ứng sau cú sốc giá</h3>
<ul><li>Cú sốc giá (biến động &gt; 2–3σ) thường do tin bất ngờ. Phản ứng ban đầu có thể <b>thái quá</b> (đảo chiều một phần sau đó) hoặc <b>chưa đủ</b> (trôi tiếp theo hướng sốc).</li>
<li>Kết quả phụ thuộc <b>bối cảnh</b>: cú giảm sốc trong xu hướng tăng dài hạn thường được mua lại; cú giảm sốc phá vỡ hỗ trợ quan trọng trong xu hướng giảm thường tiếp diễn.</li>
<li>Thị trường chỉ số (đa dạng hoá) hay đảo chiều sau sốc hơn cổ phiếu riêng lẻ (tin doanh nghiệp có thể thay đổi giá trị thật).</li></ul>
${H.shockStudy()}
<h3>3. Các kỹ thuật hành vi phổ biến</h3>
<table class="tbl"><thead><tr><th>Kỹ thuật</th><th>Cơ sở hành vi</th><th>Quy tắc mẫu</th></tr></thead><tbody>
<tr><td><b>Mua khi quá bán trong xu hướng tăng</b></td><td>Phản ứng thái quá ngắn hạn với tin xấu nhỏ</td><td>Giá trên MA 200, RSI(2–3) &lt; 10 → mua; thoát khi giá đóng cửa trên MA ngắn</td></tr>
<tr><td><b>Giao dịch gap</b></td><td>Phản ứng tin qua đêm</td><td>Gap nhỏ trong vùng giá cũ thường được lấp; gap lớn kèm khối lượng phá vùng thường tiếp diễn</td></tr>
<tr><td><b>Số tròn</b></td><td>Neo</td><td>Lệnh dừng và chốt lời tập trung quanh số tròn → đặt dừng tránh đúng số tròn, đặt lệnh vào sau khi vượt rõ</td></tr>
<tr><td><b>Cực trị tâm lý</b></td><td>Bầy đàn, mất tính độc lập</td><td>Chỉ báo tâm lý cực trị + tín hiệu giá đảo chiều → vào lệnh ngược</td></tr>
<tr><td><b>Trôi theo tin</b></td><td>Phản ứng chậm, bảo thủ</td><td>Tin tốt + gap tăng giữ được đến cuối phiên + khối lượng lớn → theo hướng tin</td></tr>
<tr><td><b>Hiệu ứng lịch</b></td><td>Dòng tiền định kỳ, tâm lý ngày lễ</td><td>Phải kiểm định cho từng thị trường, hiệu ứng thường yếu dần</td></tr></tbody></table>
<h3>4. Kiểm định và rủi ro</h3>
<ul><li>Kỹ thuật đảo chiều có <b>tỷ lệ thắng cao, phân phối lệch trái</b> → cần dừng lỗ thảm hoạ và giới hạn quy mô.</li>
<li>Mẫu sự kiện thường nhỏ → dễ quá khớp; kiểm định trên nhiều mã, nhiều giai đoạn, khử xu hướng.</li>
<li>Hiệu ứng hành vi có thể yếu đi khi bị khai thác rộng rãi; theo dõi hiệu suất lăn.</li>
<li>Kết hợp với bối cảnh xu hướng: cùng một hiện tượng có thể mang ý nghĩa ngược nhau trong xu hướng tăng và giảm.</li></ul>`,
    keys: ['Quy trình: hiện tượng hành vi → giả thuyết → quy tắc khách quan → kiểm định → quản lý rủi ro.', 'Sau cú sốc: thái quá (đảo chiều) hoặc chưa đủ (trôi tiếp) tuỳ bối cảnh; chỉ số hay đảo chiều hơn cổ phiếu riêng lẻ.', 'Kỹ thuật: quá bán trong xu hướng tăng, gap, số tròn, cực trị tâm lý, trôi theo tin, hiệu ứng lịch.', 'Đảo chiều: thắng nhiều, lệch trái → dừng thảm hoạ, giới hạn quy mô.', 'Mẫu nhỏ dễ quá khớp; bối cảnh xu hướng quyết định ý nghĩa.'],
    terms: [['Price shock', 'Cú sốc giá'], ['Event study', 'Nghiên cứu sự kiện'], ['Gap fill', 'Lấp gap'], ['Catastrophic stop', 'Dừng lỗ thảm hoạ'], ['Calendar effect', 'Hiệu ứng lịch']]
  }, {
    goals: ['Turn behavioural phenomena into objective rules.', 'Analyse post-shock and event reactions.', 'Apply oversold-in-uptrend, gap, round-number and sentiment-extreme techniques.', 'Test and manage risk.'],
    body: () => `
<h3>1. Behaviour to rules</h3><p>Phenomenon → hypothesis → objective rule → test → risk management.</p>
<h3>2. After price shocks</h3><ul><li>Overreaction (partial reversal) or underreaction (drift), depending on context.</li><li>Indices revert more than single stocks.</li></ul>${H.shockStudy()}
<h3>3. Techniques</h3><p>Oversold in uptrends, gaps, round numbers, sentiment extremes with price reversal, post-news drift, calendar effects.</p>
<h3>4. Testing and risk</h3><ul><li>Reversion: high win rate, negative skew → catastrophic stops and size limits.</li><li>Small event samples → overfitting risk.</li><li>Effects decay.</li><li>Trend context changes meaning.</li></ul>`,
    keys: ['Process.', 'Shock reactions.', 'Techniques.', 'Risk and testing.'],
    terms: [['Event study', 'Measuring returns after defined events'], ['Catastrophic stop', 'Wide stop against rare large losses']]
  }, [
    ['Quy trình chuyển hành vi thành giao dịch:', 'The process from behaviour to trading:', ['Hiện tượng → giả thuyết → quy tắc khách quan → kiểm định → quản lý rủi ro', 'Tin đồn → mua', 'Cảm giác → bán', 'Không cần quy trình'], ['Phenomenon → hypothesis → objective rule → test → risk control', 'Rumour → buy', 'Feeling → sell', 'No process'], 0, '', ''],
    ['Cú sốc giá thường được định nghĩa là biến động:', 'A price shock is usually defined as a move:', ['Vượt 2–3σ so với biến động gần đây', '0.1%', 'Bằng trung bình', 'Không xác định'], ['Beyond 2–3σ of recent volatility', '0.1%', 'Average', 'Undefined'], 0, '', ''],
    ['Cú giảm sốc trong xu hướng tăng dài hạn của chỉ số thường:', 'A shock drop within an index’s long uptrend often:', ['Được mua lại (đảo chiều một phần)', 'Tiếp diễn giảm mạnh chắc chắn', 'Không ảnh hưởng', 'Đóng cửa thị trường'], ['Gets bought back (partial reversal)', 'Surely continues down', 'No effect', 'Closes the market'], 0, '', ''],
    ['Vì sao chỉ số hay đảo chiều sau sốc hơn cổ phiếu riêng lẻ?', 'Why do indices revert after shocks more than single stocks?', ['Tin doanh nghiệp có thể thay đổi giá trị thật của cổ phiếu; chỉ số đa dạng hoá', 'Ngẫu nhiên', 'Chỉ số không có tin', 'Không đúng'], ['Company news can change a stock’s true value; indices are diversified', 'Random', 'Indices have no news', 'False'], 0, '', ''],
    ['Phản ứng "chưa đủ" với tin dẫn tới:', 'Underreaction to news leads to:', ['Giá trôi tiếp theo hướng tin', 'Đảo chiều ngay', 'Không gì', 'Gap lấp ngay'], ['Continued drift in the news direction', 'Immediate reversal', 'Nothing', 'Immediate gap fill'], 0, '', ''],
    ['Quy tắc "mua khi quá bán trong xu hướng tăng" dựa trên:', 'The "buy oversold in an uptrend" rule relies on:', ['Phản ứng thái quá ngắn hạn trong bối cảnh xu hướng tốt', 'Phản ứng chậm', 'Ngẫu nhiên', 'Định giá'], ['Short-term overreaction within a healthy trend', 'Underreaction', 'Randomness', 'Valuation'], 0, '', ''],
    ['Bộ lọc giá trên MA 200 trong quy tắc quá bán nhằm:', 'The "above 200-MA" filter in an oversold rule aims to:', ['Tránh bắt dao rơi trong xu hướng giảm', 'Tăng số lệnh', 'Giảm tỷ lệ thắng', 'Không mục đích'], ['Avoid catching falling knives in downtrends', 'More trades', 'Lower win rate', 'No purpose'], 0, '', ''],
    ['Gap nhỏ nằm trong vùng giá cũ thường:', 'A small gap within prior range usually:', ['Được lấp', 'Tiếp diễn mạnh', 'Không bao giờ lấp', 'Là gap kiệt sức'], ['Gets filled', 'Runs strongly', 'Never fills', 'Is an exhaustion gap'], 0, '', ''],
    ['Gap lớn kèm khối lượng cao phá vùng tích luỹ thường:', 'A large high-volume gap out of a base usually:', ['Tiếp diễn theo hướng gap', 'Lấp ngay', 'Không ý nghĩa', 'Đảo chiều chắc chắn'], ['Continues in the gap direction', 'Fills at once', 'Is meaningless', 'Surely reverses'], 0, '', ''],
    ['Đặt dừng lỗ đúng ngay số tròn có nhược điểm:', 'Stops exactly at round numbers have the drawback:', ['Dễ bị quét vì lệnh tập trung ở đó', 'Không bao giờ chạm', 'An toàn nhất', 'Không ảnh hưởng'], ['Easily swept because orders cluster there', 'Never hit', 'Safest', 'No effect'], 0, '', ''],
    ['Cơ sở hành vi của hiệu ứng số tròn:', 'The behavioural basis of round-number effects:', ['Neo', 'Ghét lỗ', 'Sở hữu', 'Hiện trạng'], ['Anchoring', 'Loss aversion', 'Endowment', 'Status quo'], 0, '', ''],
    ['Vào lệnh ngược ở cực trị tâm lý nên kèm:', 'Fading a sentiment extreme should come with:', ['Tín hiệu giá đảo chiều xác nhận', 'Không gì', 'Đòn bẩy cao', 'Tin đồn'], ['A confirming price reversal', 'Nothing', 'High leverage', 'Rumours'], 0, '', ''],
    ['Kỹ thuật đảo chiều thường có phân phối:', 'Reversal techniques usually have:', ['Tỷ lệ thắng cao, lệch trái', 'Tỷ lệ thắng thấp, lệch phải', 'Đối xứng', 'Không rủi ro'], ['High win rate, negative skew', 'Low win rate, positive skew', 'Symmetry', 'No risk'], 0, '', ''],
    ['Vì vậy kỹ thuật đảo chiều cần:', 'Hence reversal techniques need:', ['Dừng lỗ thảm hoạ và giới hạn quy mô', 'Không dừng lỗ', 'Đòn bẩy tối đa', 'Gấp thếp'], ['Catastrophic stops and size limits', 'No stops', 'Max leverage', 'Martingale'], 0, '', ''],
    ['Rủi ro chính khi kiểm định nghiên cứu sự kiện:', 'The main risk in event-study testing:', ['Mẫu nhỏ → quá khớp', 'Quá nhiều dữ liệu', 'Không có rủi ro', 'Phí thấp'], ['Small samples → overfitting', 'Too much data', 'No risk', 'Low fees'], 0, '', ''],
    ['Trôi theo tin: điều kiện xác nhận tốt là:', 'Post-news drift: a good confirmation is:', ['Gap tăng giữ được đến cuối phiên với khối lượng lớn', 'Gap bị lấp ngay', 'Khối lượng thấp', 'Không có tin'], ['An up-gap holding into the close on big volume', 'An immediately filled gap', 'Low volume', 'No news'], 0, '', ''],
    ['Hiệu ứng lịch (ví dụ đầu tháng, trước lễ) cần:', 'Calendar effects need:', ['Kiểm định riêng cho từng thị trường, thường yếu dần', 'Áp dụng máy móc', 'Không cần kiểm định', 'Luôn mạnh'], ['Market-specific testing; they often fade', 'Mechanical use', 'No testing', 'Always strong'], 0, '', ''],
    ['Cùng hiện tượng "RSI quá bán" mang ý nghĩa khác nhau trong:', 'The same "RSI oversold" means different things in:', ['Xu hướng tăng và xu hướng giảm', 'Mọi bối cảnh như nhau', 'Không bối cảnh nào', 'Chỉ ngày lễ'], ['Uptrends versus downtrends', 'All contexts alike', 'No context', 'Holidays only'], 0, '', ''],
    ['Dòng "cơ sở" trong nghiên cứu sự kiện dùng để:', 'The "base" row in an event study is used to:', ['So sánh lợi suất sau sự kiện với lợi suất thông thường', 'Trang trí', 'Tính phí', 'Không gì'], ['Compare post-event returns with normal returns', 'Decoration', 'Fees', 'Nothing'], 0, '', ''],
    ['Lợi suất trung bình sau cú giảm sốc là +0.8% (5 phiên), cơ sở +0.3%, n = 12. Kết luận:', 'Average after shock drops +0.8% (5 days), base +0.3%, n 12. Conclusion:', ['Gợi ý đảo chiều nhưng mẫu quá nhỏ — cần kiểm định thêm', 'Chắc chắn có lợi thế', 'Vô nghĩa hoàn toàn', 'Bán khống'], ['Suggests reversal but the sample is tiny — test more', 'A certain edge', 'Totally meaningless', 'Short'], 0, '', ''],
    ['Hiệu ứng hành vi có thể yếu đi khi:', 'Behavioural effects may weaken when:', ['Bị khai thác rộng rãi', 'Không ai biết', 'Thị trường đóng cửa', 'Không bao giờ'], ['Widely exploited', 'Unknown', 'Markets close', 'Never'], 0, '', ''],
    ['Cú giảm sốc phá hỗ trợ quan trọng trong xu hướng giảm thường:', 'A shock drop breaking key support in a downtrend usually:', ['Tiếp diễn', 'Đảo chiều ngay', 'Không ý nghĩa', 'Là đáy chắc chắn'], ['Continues', 'Reverses at once', 'Is meaningless', 'Is a sure bottom'], 0, '', ''],
    ['Ở Việt Nam, sau phiên giảm sàn diện rộng do tin vĩ mô bất ngờ, kỹ thuật hành vi hợp lý:', 'In Vietnam after a broad limit-down day on surprise macro news, a sensible behavioural approach:', ['Chờ dấu hiệu cạn cung/cao trào bán và xác nhận giá trước khi mua', 'Mua toàn bộ ngay phiên đó', 'Bán khống cổ phiếu cơ sở', 'Không làm gì mãi mãi'], ['Wait for supply exhaustion/climax and price confirmation before buying', 'Buy all that day', 'Short cash stocks', 'Never act'], 0, '', ''],
    ['Vì sao cần khử xu hướng khi kiểm định kỹ thuật mua sau sốc?', 'Why detrend when testing buy-after-shock rules?', ['Để không nhầm xu hướng tăng chung của thị trường với lợi thế', 'Để tăng lợi nhuận', 'Không cần', 'Do luật'], ['To avoid mistaking market drift for an edge', 'To raise profit', 'Unneeded', 'Law'], 0, '', ''],
    ['RSI(2) < 10 trong xu hướng tăng là ví dụ của:', 'RSI(2) < 10 in an uptrend exemplifies:', ['Kỹ thuật quá bán ngắn hạn trong xu hướng', 'Theo xu hướng dài hạn', 'Giao dịch gap', 'Số tròn'], ['A short-term oversold-in-trend technique', 'Long-term trend following', 'Gap trading', 'Round numbers'], 0, '', ''],
    ['Đặt lệnh mua ngay dưới số tròn kháng cự là:', 'Placing buys just below round-number resistance is:', ['Không tối ưu — nên chờ vượt rõ số tròn', 'Tối ưu', 'Bắt buộc', 'Không liên quan'], ['Suboptimal — wait for a clear break', 'Optimal', 'Required', 'Irrelevant'], 0, '', ''],
    ['Kỹ thuật hành vi tốt nhất nên được dùng như:', 'Behavioural techniques are best used as:', ['Một thành phần trong hệ thống có kiểm định và quản lý rủi ro', 'Bí quyết thắng chắc', 'Thay thế xu hướng', 'Không dùng'], ['A tested, risk-managed system component', 'A sure-win secret', 'A trend replacement', 'Not used'], 0, '', ''],
    ['Cơ sở hành vi của trôi theo tin:', 'The behavioural basis of post-news drift:', ['Bảo thủ, phản ứng chậm', 'Phản ứng thái quá', 'Ngẫu nhiên', 'Không có'], ['Conservatism, underreaction', 'Overreaction', 'Randomness', 'None'], 0, '', ''],
    ['Khi kỹ thuật hành vi mất hiệu quả trong hiệu suất lăn, nên:', 'When a behavioural technique’s rolling performance fades, you should:', ['Giảm quy mô, xem xét lại cơ sở và điều kiện thị trường', 'Tăng gấp đôi', 'Bỏ qua', 'Gấp thếp'], ['Cut size and review its basis and conditions', 'Double up', 'Ignore', 'Martingale'], 0, '', ''],
    ['Bài học chính:', 'Key lesson:', ['Hành vi tạo cơ hội, nhưng chỉ có giá trị khi được định lượng, kiểm định và đặt trong bối cảnh xu hướng', 'Mọi thiên kiến đều giao dịch được ngay', 'Không cần kiểm định', 'Bỏ qua bối cảnh'], ['Behaviour creates opportunities only when quantified, tested and placed in trend context', 'Every bias is instantly tradable', 'No testing', 'Ignore context'], 0, '', '']
  ]);
})(window.LLW);
