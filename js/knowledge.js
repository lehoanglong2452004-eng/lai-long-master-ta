// © 2026 Lai Long Master TA. Bảo lưu mọi quyền. Không sao chép, chỉnh sửa hay dùng lại khi chưa được phép.
/* Knowledge library — Wyckoff foundations (vi / en). Content written for Lai Long Master Wyckoff. */
(function (L) {
  'use strict';
  const S = () => L.schem;
  const K = L.knowledge = [];
  const sec = (id, vi, en) => K.push({ id, vi, en });

  /* ============ 1. INTRO & COMPOSITE MAN ============ */
  sec('intro', {
    title: 'Wyckoff & Composite Man',
    html: () => `
<p><b>Richard D. Wyckoff (1873–1934)</b> bắt đầu làm việc ở Phố Wall từ năm 15 tuổi. Ông quan sát trực tiếp cách các nhà đầu cơ lớn như Jesse Livermore và J.P. Morgan vận hành thị trường, rồi hệ thống hoá thành một phương pháp đọc thị trường chỉ dựa trên <b>giá, khối lượng và thời gian</b>. Ông giảng dạy phương pháp này qua khoá học tại Stock Market Institute (1930s).</p>
<p>Triết lý cốt lõi: <b>giá chỉ thay đổi khi cán cân cung – cầu thay đổi</b>. Mọi tin tức, báo cáo hay tâm lý cuối cùng đều thể hiện qua hành động giá và khối lượng. Người đọc được giá và khối lượng sẽ thấy dấu vết của dòng tiền lớn trước khi tin tức xuất hiện.</p>
<h3>Composite Man – "Nhà đầu tư tổng hợp"</h3>
<p>Wyckoff khuyên học viên hãy tưởng tượng mọi biến động là do <b>một thực thể duy nhất</b> điều khiển: Composite Man (còn gọi là Composite Operator). Thực thể này đại diện cho toàn bộ dòng tiền lớn và hiểu biết (quỹ, tổ chức, tay chơi lớn). Bốn nguyên tắc:</p>
<ol>
<li>Composite Man <b>lên kế hoạch, thực thi và kết thúc</b> chiến dịch một cách cẩn thận.</li>
<li>Họ thu hút công chúng mua một cổ phiếu mà chính họ đã <b>gom ở giá thấp</b>, bằng cách giao dịch nhiều lượng lớn và "quảng bá" cổ phiếu qua chính hành động giá.</li>
<li>Bạn phải <b>nghiên cứu từng biểu đồ</b> để đánh giá hành vi và động cơ của người điều khiển nó.</li>
<li>Với thực hành, bạn sẽ đọc được động cơ đằng sau hành động giá — và <b>giao dịch cùng phía với tiền lớn</b> thay vì làm đối ứng cho họ.</li>
</ol>
<div class="callout">Câu hỏi thường trực của người theo Wyckoff: <i>"Composite Man đang muốn làm gì ở đây? Gom hàng, đẩy giá, phân phối hay đạp giá?"</i></div>
<h3>Chu trình chiến dịch của Composite Man</h3>
<ol>
<li><b>Tích lũy</b>: gom hàng âm thầm trong một vùng đi ngang (Trading Range – TR) sau khi giá đã giảm sâu.</li>
<li><b>Markup – Đẩy giá</b>: khi nguồn cung trôi nổi đã cạn, giá tăng gần như "không cần nỗ lực". Công chúng bị thu hút bởi đà tăng.</li>
<li><b>Phân phối</b>: bán dần cho đám đông hưng phấn trong một TR ở vùng giá cao.</li>
<li><b>Markdown – Đạp giá</b>: khi cầu cạn, giá giảm, và chu kỳ lặp lại.</li>
</ol>`
  }, {
    title: 'Wyckoff & the Composite Man',
    html: () => `
<p><b>Richard D. Wyckoff (1873–1934)</b> started on Wall Street at 15. He watched great operators such as Jesse Livermore and J.P. Morgan at work and systematised a method that reads the market through <b>price, volume and time</b> alone. He taught it through his Stock Market Institute course in the 1930s.</p>
<p>Core idea: <b>price changes only when the balance of supply and demand changes</b>. News, reports and sentiment all end up as price action and volume. If you can read them, you see large-money footprints before the news.</p>
<h3>The Composite Man</h3>
<p>Wyckoff told students to imagine that <b>a single entity</b> drives every move: the Composite Man (or Composite Operator). It stands for all large, informed money. Four principles:</p>
<ol><li>He <b>plans, executes and concludes</b> his campaigns carefully.</li>
<li>He attracts the public into a stock he has already <b>accumulated cheaply</b>, trading heavily and advertising it through price action.</li>
<li>You must <b>study each chart</b> to judge the behaviour and motives of the operator behind it.</li>
<li>With practice you can read those motives and <b>trade on the same side as big money</b> instead of against it.</li></ol>
<div class="callout">The standing question: <i>"What is the Composite Man trying to do here — accumulate, mark up, distribute or mark down?"</i></div>
<h3>The campaign cycle</h3>
<ol><li><b>Accumulation</b> inside a trading range (TR) after a decline.</li><li><b>Markup</b> once floating supply is gone.</li><li><b>Distribution</b> to an enthusiastic public at high prices.</li><li><b>Markdown</b> when demand is exhausted — and the cycle repeats.</li></ol>`
  });

  /* ============ 2. THREE LAWS ============ */
  sec('laws', {
    title: '3 Luật gốc của Wyckoff',
    html: () => `
<h3>1. Luật Cung – Cầu (Supply & Demand)</h3>
<p>Cầu &gt; Cung → giá tăng. Cung &gt; Cầu → giá giảm. Cung ≈ Cầu → giá đi ngang. Ta không đo cung cầu trực tiếp mà <b>suy ra</b> từ cách giá và khối lượng tương tác qua từng nến, từng nhịp sóng.</p>
<ul><li>Nến tăng biên độ rộng, đóng cửa cao, khối lượng tăng → cầu chiếm ưu thế.</li>
<li>Nến giảm biên độ rộng, đóng cửa thấp, khối lượng tăng → cung chiếm ưu thế.</li>
<li>Khối lượng cạn dần ở biên dưới TR → cung cạn kiệt (tốt). Ở biên trên → cầu cạn kiệt (xấu).</li></ul>
<h3>2. Luật Nhân – Quả (Cause & Effect)</h3>
<p>Muốn có một xu hướng (hiệu ứng) thì phải có nguyên nhân. Nguyên nhân được xây dựng trong Trading Range qua quá trình tích lũy hoặc phân phối. <b>TR càng lớn và càng dài thì hiệu ứng càng mạnh.</b></p>
<p><b>Đo nguyên nhân bằng Point &amp; Figure (đếm ngang):</b></p>
<ol><li>Dựng biểu đồ P&amp;F (thường đảo chiều 3 ô; kích thước ô phù hợp với giá/biến động).</li>
<li>Xác định <b>đường đếm</b> (count line): tích lũy thường dùng mức LPS, phân phối thường dùng mức LPSY.</li>
<li>Đếm số cột từ điểm cuối (LPS/LPSY) ngược về đầu TR (thường là PS/SC hoặc PSY/BC). Có thể đếm theo từng giai đoạn để có các mục tiêu từng nấc.</li>
<li>Biên độ dự phóng = <b>số cột × kích thước ô × hệ số đảo chiều</b>.</li>
<li>Mục tiêu tăng = mức đếm (hoặc đáy TR) + biên độ dự phóng. Mục tiêu giảm = mức đếm (hoặc đỉnh TR) − biên độ dự phóng.</li></ol>
<div class="callout">Mục tiêu P&amp;F cho biết <b>độ lớn tiềm năng</b> của xu hướng, không phải điểm chốt lời chính xác. Hãy kết hợp với phản ứng giá thực tế tại vùng mục tiêu. Trong ứng dụng này, ô P&amp;F ≈ ½ ATR và hệ số đảo chiều là 3.</div>
<h3>3. Luật Nỗ lực – Kết quả (Effort vs Result)</h3>
<p>Khối lượng là <b>nỗ lực</b>, biên độ/quãng đường giá là <b>kết quả</b>. Khi chúng hài hoà, xu hướng tiếp diễn. Khi chúng <b>phân kỳ</b>, đó là cảnh báo đổi hướng.</p>
<ul><li>Khối lượng rất lớn nhưng giá đi rất ít → có lực đối ứng đang hấp thụ (ví dụ: ở đáy là cầu hấp thụ cung, ở đỉnh là cung hấp thụ cầu).</li>
<li>Nhịp tăng mới có khối lượng lớn hơn nhưng đi ngắn hơn nhịp trước → cung đang chặn.</li>
<li>Giá đi xa với khối lượng nhỏ → "dễ dàng di chuyển" (ease of movement): phía đối diện rất mỏng.</li></ul>
<p>Áp dụng ở 3 cấp: từng nến (VSA), từng nhịp sóng (so sánh tổng khối lượng các sóng — kiểu sóng Weis), và toàn bộ TR.</p>`
  }, {
    title: 'The three Wyckoff laws',
    html: () => `
<h3>1. Supply & Demand</h3><p>Demand &gt; supply → price rises; supply &gt; demand → price falls; balance → sideways. We infer the balance from how price and volume interact bar by bar and wave by wave.</p>
<ul><li>Wide up bar, high close, rising volume → demand dominates.</li><li>Wide down bar, low close, rising volume → supply dominates.</li><li>Volume drying up at the TR low → supply exhausted (good); at the TR high → demand exhausted (bad).</li></ul>
<h3>2. Cause & Effect</h3><p>Every trend (effect) needs a cause, built inside a trading range by accumulation or distribution. <b>The bigger and longer the TR, the larger the effect.</b></p>
<p><b>Measuring the cause with a Point &amp; Figure horizontal count:</b></p>
<ol><li>Build a P&amp;F chart (usually 3-box reversal, box size suited to the instrument).</li><li>Pick the count line — the LPS level for accumulation, the LPSY level for distribution.</li><li>Count columns from the LPS/LPSY back to the start of the TR (PS/SC or PSY/BC); phase-by-phase counts give stepped targets.</li><li>Projection = <b>columns × box × reversal</b>.</li><li>Upside target = count line (or TR low) + projection; downside = count line (or TR high) − projection.</li></ol>
<div class="callout">P&amp;F objectives describe the <b>potential size</b> of the move, not exact exits. In this app, box ≈ ½ ATR with a 3-box reversal.</div>
<h3>3. Effort vs Result</h3><p>Volume is <b>effort</b>, price travel is <b>result</b>. Harmony means continuation; <b>divergence</b> warns of a change.</p>
<ul><li>Huge volume but little progress → the other side is absorbing.</li><li>A new rally with more volume but less distance → supply is capping it.</li><li>Large travel on light volume → ease of movement; the other side is thin.</li></ul><p>Apply it at three levels: single bars (VSA), waves (Weis-style wave volume), and the whole TR.</p>`
  });

  /* ============ 3. FIVE STEPS ============ */
  sec('steps', {
    title: 'Quy trình 5 bước Wyckoff',
    html: () => `
<ol class="steps">
<li><b>Xác định vị trí và xu hướng tương lai của thị trường chung.</b> Thị trường đang tích lũy, tăng, phân phối hay giảm? Cung – cầu đang nghiêng về đâu? (Với cổ phiếu VN: đọc VNINDEX/VN30 trước.)</li>
<li><b>Chọn tài sản hài hoà với xu hướng đó.</b> Khi thị trường tăng, chọn cổ phiếu <b>mạnh hơn thị trường</b> (giảm ít hơn khi thị trường điều chỉnh, tăng mạnh hơn khi thị trường hồi). Khi thị trường giảm, chọn mã yếu hơn để bán.</li>
<li><b>Chọn tài sản có "nguyên nhân" đủ lớn</b> (đếm P&amp;F) so với mục tiêu lợi nhuận tối thiểu của bạn.</li>
<li><b>Xác định tài sản đã sẵn sàng di chuyển chưa</b>: áp dụng 9 phép thử Mua/Bán và nhận diện pha (lý tưởng là cuối Pha C hoặc Pha D).</li>
<li><b>Chọn thời điểm cam kết theo bước ngoặt của chỉ số thị trường.</b> Vào lệnh khi thị trường chung cũng xác nhận (ví dụ chỉ số có Spring/Test hoặc SOS).</li></ol>
<div class="callout">Ứng dụng này hỗ trợ bước 1 (phân tích chỉ số), bước 2 (sức mạnh tương đối so với VNINDEX), bước 3 (đếm P&amp;F tự động), bước 4 (pha + checklist 9 phép thử) và bước 5 (đa khung).</div>`
  }, {
    title: 'Wyckoff’s five-step approach',
    html: () => `
<ol class="steps"><li><b>Determine the present position and probable future trend of the market.</b> Is it accumulating, marking up, distributing or marking down?</li>
<li><b>Select assets in harmony with that trend</b> — stronger than the market in an uptrend, weaker in a downtrend.</li>
<li><b>Select assets with a cause</b> (P&amp;F count) that equals or exceeds your minimum objective.</li>
<li><b>Determine whether the asset is ready to move</b> — apply the nine buying/selling tests and identify the phase (ideally late Phase C or Phase D).</li>
<li><b>Time your commitment with a turn in the market index.</b></li></ol>
<div class="callout">The app supports step 1 (index analysis), step 2 (relative strength vs VNINDEX), step 3 (automatic P&amp;F count), step 4 (phase + nine-test checklist) and step 5 (multi-timeframe).</div>`
  });

  /* ============ 4. MARKET CYCLE ============ */
  sec('cycle', {
    title: 'Chu kỳ giá 4 giai đoạn',
    html: () => `
<table class="tbl"><thead><tr><th>Giai đoạn</th><th>Đặc điểm</th><th>Ai đang làm gì</th><th>Hành động</th></tr></thead><tbody>
<tr><td><b>Tích lũy</b></td><td>Đi ngang sau xu hướng giảm; khối lượng cao ở Pha A, cạn dần về sau</td><td>Tiền lớn gom hàng từ người bán hoảng loạn/chán nản</td><td>Chờ Spring/Test, LPS để mua</td></tr>
<tr><td><b>Markup</b></td><td>Đỉnh/đáy cao dần; khối lượng tăng khi tăng, giảm khi điều chỉnh</td><td>Tiền lớn giữ hàng, công chúng bắt đầu tham gia</td><td>Mua pullback/BU, giữ lệnh</td></tr>
<tr><td><b>Phân phối</b></td><td>Đi ngang sau xu hướng tăng; khối lượng lớn nhưng giá không tiến</td><td>Tiền lớn bán cho đám đông hưng phấn</td><td>Chốt lời, chờ UTAD/LPSY</td></tr>
<tr><td><b>Markdown</b></td><td>Đỉnh/đáy thấp dần; khối lượng tăng khi giảm</td><td>Công chúng cắt lỗ, tiền lớn đứng ngoài hoặc bán khống</td><td>Đứng ngoài / bán khống LPSY</td></tr>
</tbody></table>
<p>Trong xu hướng lớn thường có các TR nhỏ: <b>tái tích lũy</b> (nghỉ giữa Markup) và <b>tái phân phối</b> (nghỉ giữa Markdown). Bài toán khó nhất của Wyckoff là phân biệt một TR là phân phối hay tái tích lũy (hoặc tích lũy hay tái phân phối). Câu trả lời luôn nằm ở <b>Pha C và Pha D</b>.</p>`
  }, {
    title: 'The four-stage price cycle',
    html: () => `
<table class="tbl"><thead><tr><th>Stage</th><th>Character</th><th>Who does what</th><th>Action</th></tr></thead><tbody>
<tr><td><b>Accumulation</b></td><td>Sideways after a decline; heavy volume in Phase A, drying later</td><td>Big money buys from fearful sellers</td><td>Wait for Spring/Test, LPS</td></tr>
<tr><td><b>Markup</b></td><td>Higher highs/lows; volume expands on rallies</td><td>Big money holds; the public joins</td><td>Buy pullbacks/BU</td></tr>
<tr><td><b>Distribution</b></td><td>Sideways after an advance; heavy volume, little progress</td><td>Big money sells to an eager public</td><td>Take profit; wait for UTAD/LPSY</td></tr>
<tr><td><b>Markdown</b></td><td>Lower highs/lows; volume expands on declines</td><td>The public capitulates</td><td>Stay out / short LPSYs</td></tr></tbody></table>
<p>Big trends contain smaller TRs: <b>re-accumulation</b> inside markups and <b>re-distribution</b> inside markdowns. Telling distribution from re-accumulation is the hardest Wyckoff problem; the answer is always in <b>Phases C and D</b>.</p>`
  });

  /* ============ 5. ACCUMULATION EVENTS & PHASES ============ */
  const accTableVi = `
<table class="tbl"><thead><tr><th>Sự kiện</th><th>Vị trí trong cấu trúc</th><th>Biên độ (spread)</th><th>Đóng cửa</th><th>Khối lượng</th><th>Ý nghĩa</th></tr></thead><tbody>
<tr><td><b>PS</b> – Preliminary Support</td><td>Trong nhịp giảm, trước SC</td><td>Mở rộng dần</td><td>Khá cao</td><td>Tăng dần</td><td>Lực mua lớn đầu tiên; xu hướng giảm chậm lại</td></tr>
<tr><td><b>SC</b> – Selling Climax</td><td>Đáy hình thành Pha A</td><td>Rất rộng</td><td>Thấp → thường rút chân</td><td>Cao trào</td><td>Bán tháo hoảng loạn, tiền lớn hấp thụ</td></tr>
<tr><td><b>AR</b> – Automatic Rally</td><td>Xác định biên trên TR</td><td>Trung bình/rộng</td><td>Cao</td><td>Trung bình/thấp</td><td>Áp lực bán cạn, giá bật lên tự nhiên</td></tr>
<tr><td><b>ST</b> – Secondary Test</td><td>Quanh vùng SC (có thể cao hơn hoặc thấp hơn chút)</td><td>Thu hẹp</td><td>Trung bình/cao</td><td>Giảm rõ so với SC</td><td>Xác nhận cung đã giảm</td></tr>
<tr><td><b>UA</b> – Upthrust Action</td><td>Pha B, vượt nhẹ AR</td><td>Trung bình</td><td>Quay về TR</td><td>Trung bình</td><td>Thử cung ở biên trên</td></tr>
<tr><td><b>ST-B</b> (ST as SOW)</td><td>Pha B, đáy thấp hơn SC chút</td><td>Trung bình</td><td>Trung bình</td><td>Giảm dần</td><td>Rũ bỏ/kiểm tra trong Pha B</td></tr>
<tr><td><b>Spring / Shakeout</b></td><td>Pha C, dưới hỗ trợ TR</td><td>Trung bình/rộng</td><td>Hồi về trong TR</td><td>Từ thấp đến cao (xem 3 loại)</td><td>Phép thử cung cuối cùng, bẫy bán</td></tr>
<tr><td><b>Test</b></td><td>Sau Spring, đáy cao hơn</td><td>Hẹp</td><td>Cao</td><td>Thấp</td><td>Xác nhận cung cạn</td></tr>
<tr><td><b>SOS / mSOS</b></td><td>Pha D, tăng lên biên trên / vượt TR</td><td>Rộng</td><td>Cao</td><td>Tăng dần/cao</td><td>Cầu kiểm soát</td></tr>
<tr><td><b>LPS</b></td><td>Đáy cao hơn trong/ngoài TR</td><td>Hẹp</td><td>Cao</td><td>Giảm dần/thấp</td><td>Cung không còn đè giá</td></tr>
<tr><td><b>JAC</b></td><td>Vượt Creek</td><td>Rộng, có thể gap</td><td>Cao</td><td>Cao</td><td>"Nhảy qua con lạch"</td></tr>
<tr><td><b>BU / BUEC</b></td><td>Lùi về mép Creek sau JAC</td><td>Hẹp</td><td>Cao</td><td>Giảm dần/thấp</td><td>Kiểm tra lại vùng phá vỡ, điểm mua kinh điển</td></tr>
</tbody></table>`;
  const accTableEn = `
<table class="tbl"><thead><tr><th>Event</th><th>Location</th><th>Spread</th><th>Close</th><th>Volume</th><th>Meaning</th></tr></thead><tbody>
<tr><td><b>PS</b></td><td>In the decline, before SC</td><td>Widening</td><td>Fairly high</td><td>Rising</td><td>First substantial buying; decline slows</td></tr>
<tr><td><b>SC</b></td><td>Phase A low</td><td>Very wide</td><td>Low, often with a tail</td><td>Climactic</td><td>Panic selling absorbed</td></tr>
<tr><td><b>AR</b></td><td>Defines TR top</td><td>Average/wide</td><td>High</td><td>Average/low</td><td>Selling exhausted, natural bounce</td></tr>
<tr><td><b>ST</b></td><td>Around SC</td><td>Narrowing</td><td>Mid/high</td><td>Clearly lower than SC</td><td>Confirms supply has diminished</td></tr>
<tr><td><b>UA</b></td><td>Phase B, slightly above AR</td><td>Average</td><td>Back inside</td><td>Average</td><td>Probe of supply at the top</td></tr>
<tr><td><b>ST-B</b></td><td>Phase B, marginally below SC</td><td>Average</td><td>Mid</td><td>Decreasing</td><td>Phase B shakeout/test</td></tr>
<tr><td><b>Spring / Shakeout</b></td><td>Phase C, below support</td><td>Average/wide</td><td>Recovers inside</td><td>Low to high (3 types)</td><td>Final test of supply; bear trap</td></tr>
<tr><td><b>Test</b></td><td>After the Spring, higher low</td><td>Narrow</td><td>High</td><td>Low</td><td>Supply exhausted</td></tr>
<tr><td><b>SOS / mSOS</b></td><td>Phase D rally to/through the top</td><td>Wide</td><td>High</td><td>Rising/high</td><td>Demand in control</td></tr>
<tr><td><b>LPS</b></td><td>Higher low in/after TR</td><td>Narrow</td><td>High</td><td>Low</td><td>Supply no longer presses</td></tr>
<tr><td><b>JAC</b></td><td>Crossing the Creek</td><td>Wide, may gap</td><td>High</td><td>High</td><td>"Jump across the creek"</td></tr>
<tr><td><b>BU / BUEC</b></td><td>Back to the Creek edge</td><td>Narrow</td><td>High</td><td>Low</td><td>Retest of the breakout; classic buy</td></tr></tbody></table>`;

  sec('accumulation', {
    title: 'Tích lũy: sự kiện & 5 pha',
    html: () => `
${accTableVi}
<h3>Năm pha của cấu trúc tích lũy</h3>
<dl class="phases">
<dt>Pha A – Dừng xu hướng giảm</dt><dd>PS → SC → AR → ST. Cung vẫn chiếm ưu thế nhưng đang bị chặn. SC và AR xác định hai biên của TR. Có thể không có cao trào rõ ràng: xu hướng giảm "nhạt dần" thì Pha A kéo dài và kém kịch tính hơn.</dd>
<dt>Pha B – Xây dựng nguyên nhân</dt><dd>Cung ≈ cầu. Giá dao động quanh vùng SC – AR với nhiều ST, UA, ST-B. Tiền lớn gom hàng dần. Ở đầu Pha B, khối lượng và biên độ lớn; về cuối, khối lượng ở các nhịp giảm cạn dần. Đây thường là pha dài nhất.</dd>
<dt>Pha C – Kiểm tra</dt><dd>Spring hoặc Shakeout kiểm tra nguồn cung còn lại bên dưới TR, sau đó là Test. Nếu Spring không xuất hiện (Sơ đồ #2), Pha C là một LPS – đáy cao hơn với khối lượng thấp.</dd>
<dt>Pha D – Cầu kiểm soát</dt><dd>LPS → mSOS → SOS/JAC → BU/LPS. Giá đi lên biên trên với biên độ mở rộng và khối lượng tăng; các nhịp lùi có khối lượng thấp. Cấu trúc đỉnh cao hơn, đáy cao hơn.</dd>
<dt>Pha E – Markup</dt><dd>Giá rời TR, cầu chiếm ưu thế. Các TR nhỏ (tái tích lũy) có thể xuất hiện trên đường tăng.</dd></dl>
${S().svg('acc1')}
${S().svg('acc2')}`
  }, {
    title: 'Accumulation: events & phases',
    html: () => `${accTableEn}
<h3>The five phases of accumulation</h3><dl class="phases">
<dt>Phase A – Stopping the downtrend</dt><dd>PS → SC → AR → ST. Supply still dominates but is being halted. SC and AR define the TR. Without a clear climax, Phase A is longer and less dramatic.</dd>
<dt>Phase B – Building the cause</dt><dd>Supply ≈ demand; repeated STs, UAs and ST-Bs while big money absorbs supply. Volume on declines dries up towards the end. Usually the longest phase.</dd>
<dt>Phase C – The test</dt><dd>A Spring/Shakeout tests remaining supply below the TR, followed by a Test. Without a Spring (Schematic #2), Phase C is a higher, low-volume LPS.</dd>
<dt>Phase D – Demand in control</dt><dd>LPS → mSOS → SOS/JAC → BU/LPS with expanding spreads and volume on rallies and light pullbacks.</dd>
<dt>Phase E – Markup</dt><dd>Price leaves the TR; smaller re-accumulations may follow.</dd></dl>
${S().svg('acc1')}${S().svg('acc2')}`
  });

  /* ============ 6. DISTRIBUTION ============ */
  sec('distribution', {
    title: 'Phân phối: sự kiện & 5 pha',
    html: () => `
<table class="tbl"><thead><tr><th>Sự kiện</th><th>Mô tả</th><th>Giá / Khối lượng điển hình</th></tr></thead><tbody>
<tr><td><b>PSY</b> – Preliminary Supply</td><td>Tiền lớn bắt đầu bán ra trong xu hướng tăng</td><td>Khối lượng tăng, biên độ rộng, giá khựng lại</td></tr>
<tr><td><b>BC</b> – Buying Climax</td><td>Công chúng mua đuổi cao trào, tiền lớn bán mạnh</td><td>Biên độ rất rộng, khối lượng cao trào, thường có râu trên</td></tr>
<tr><td><b>AR</b> – Automatic Reaction</td><td>Cầu cạn sau BC, giá rơi tự nhiên; đáy AR là biên dưới TR</td><td>Biên độ rộng, khối lượng giảm dần</td></tr>
<tr><td><b>ST</b></td><td>Quay lại vùng BC để kiểm tra cầu</td><td>Khối lượng và biên độ giảm; đỉnh có thể thấp hơn BC</td></tr>
<tr><td><b>UT</b> – Upthrust (Pha B)</td><td>Vượt đỉnh rồi quay lại TR</td><td>Khối lượng có thể cao; đóng cửa thấp</td></tr>
<tr><td><b>mSOW</b> (SOW Pha B)</td><td>Thủng nhẹ biên dưới trong Pha B</td><td>Biên độ rộng, khối lượng tăng</td></tr>
<tr><td><b>UTAD</b></td><td>Phép thử cầu cuối cùng ở Pha C — bẫy mua</td><td>Vượt kháng cự rồi đóng cửa quay lại TR; khối lượng thường cao</td></tr>
<tr><td><b>SOW</b></td><td>Giá giảm thủng Ice / đáy TR</td><td>Biên độ rộng, khối lượng tăng, đóng cửa thấp</td></tr>
<tr><td><b>LPSY</b></td><td>Nhịp hồi yếu sau SOW — điểm cung cuối</td><td>Biên độ hẹp, khối lượng thấp, đỉnh thấp dần</td></tr>
<tr><td><b>Ice</b></td><td>Đường hỗ trợ (như "mặt băng") của TR phân phối</td><td>Thủng Ice = SOW; hồi lên chạm đáy Ice = LPSY</td></tr></tbody></table>
<h3>Năm pha của phân phối</h3>
<dl class="phases">
<dt>Pha A</dt><dd>PSY → BC → AR → ST: xu hướng tăng bị chặn lại.</dd>
<dt>Pha B</dt><dd>Xây dựng nguyên nhân phía giảm: UT, mSOW. Khối lượng ở các nhịp tăng không còn mở rộng, các nhịp giảm có khối lượng lớn hơn.</dd>
<dt>Pha C</dt><dd>UTAD (hoặc đỉnh thấp hơn — LPSY — ở Sơ đồ #2) kiểm tra lực cầu cuối cùng.</dd>
<dt>Pha D</dt><dd>SOW, LPSY: cung kiểm soát, giá đi về và thủng biên dưới.</dd>
<dt>Pha E</dt><dd>Markdown: giá rời TR đi xuống, các nhịp hồi yếu.</dd></dl>
${S().svg('dist1')}
${S().svg('dist2')}`
  }, {
    title: 'Distribution: events & phases',
    html: () => `
<table class="tbl"><thead><tr><th>Event</th><th>Description</th><th>Typical price/volume</th></tr></thead><tbody>
<tr><td><b>PSY</b></td><td>Large interests begin to sell into the uptrend</td><td>Rising volume, wide spread, stalling price</td></tr>
<tr><td><b>BC</b></td><td>Public buying frenzy met by heavy professional selling</td><td>Very wide spread, climactic volume, upper tail</td></tr>
<tr><td><b>AR</b></td><td>Demand exhausted; the AR low marks TR support</td><td>Wide spread, falling volume</td></tr>
<tr><td><b>ST</b></td><td>Revisit of the BC area to test demand</td><td>Lower volume and spread</td></tr>
<tr><td><b>UT</b></td><td>Phase B break above the highs that fails</td><td>Possibly high volume, low close</td></tr>
<tr><td><b>mSOW</b></td><td>Phase B dip below support</td><td>Wide spread, rising volume</td></tr>
<tr><td><b>UTAD</b></td><td>Final demand test in Phase C — a bull trap</td><td>Break above resistance, closes back inside</td></tr>
<tr><td><b>SOW</b></td><td>Break through the Ice / TR low</td><td>Wide spread, rising volume, low close</td></tr>
<tr><td><b>LPSY</b></td><td>Weak rally after the SOW</td><td>Narrow spread, low volume, lower highs</td></tr>
<tr><td><b>Ice</b></td><td>The support "ice" of a distribution TR</td><td>Break = SOW; rally back to it = LPSY</td></tr></tbody></table>
<h3>Phases</h3><dl class="phases"><dt>A</dt><dd>PSY → BC → AR → ST stop the uptrend.</dd><dt>B</dt><dd>Building the bearish cause: UTs and mSOWs; rallies stop expanding in volume.</dd><dt>C</dt><dd>UTAD (or a lower-high LPSY in Schematic #2) tests remaining demand.</dd><dt>D</dt><dd>SOW, LPSY: supply in control.</dd><dt>E</dt><dd>Markdown.</dd></dl>
${S().svg('dist1')}${S().svg('dist2')}`
  });

  /* ============ 7. RE-ACCUMULATION / RE-DISTRIBUTION & TR VARIANTS ============ */
  sec('re', {
    title: 'Tái tích lũy, tái phân phối & biến thể TR',
    html: () => `
<p><b>Tái tích lũy</b> là TR hình thành <i>giữa</i> một xu hướng tăng: tiền lớn gom thêm hàng (từ người chốt lời sớm) trước khi đẩy giá tiếp. <b>Tái phân phối</b> là TR giữa xu hướng giảm.</p>
<h3>Phân biệt tái tích lũy và phân phối (TR sau nhịp tăng)</h3>
<table class="tbl"><thead><tr><th>Dấu hiệu</th><th>Tái tích lũy</th><th>Phân phối</th></tr></thead><tbody>
<tr><td>Khối lượng nhịp giảm trong TR</td><td>Giảm dần, cạn kiệt</td><td>Tăng dần, mở rộng</td></tr>
<tr><td>Khối lượng nhịp tăng trong TR</td><td>Tăng, nhịp tăng dễ dàng</td><td>Lớn nhưng giá không tiến (nỗ lực không kết quả)</td></tr>
<tr><td>Đáy trong TR</td><td>Nâng dần, giữ trên vùng AR</td><td>Hạ dần, thủng vùng AR (mSOW)</td></tr>
<tr><td>Sự kiện Pha C</td><td>Spring/Shakeout + Test thành công</td><td>UTAD + Test thất bại</td></tr>
<tr><td>Pha D</td><td>SOS, LPS, BU</td><td>SOW, LPSY</td></tr>
<tr><td>Sức mạnh tương đối so với chỉ số</td><td>Mạnh hơn</td><td>Yếu hơn</td></tr></tbody></table>
${S().svg('reacc')}
${S().svg('redist')}
<h3>Các biến thể Trading Range thường gặp</h3>
<ul>
<li><b>TR tiêu chuẩn</b>: đi đủ 5 pha, có Spring hoặc UTAD rõ ràng.</li>
<li><b>Hấp thụ ở mức cao hơn</b>: sau Pha A, đáy TR không bị kiểm tra lại. Cung bị hấp thụ ở nửa trên TR, sau đó giá vượt lên. Cấu trúc này thể hiện cầu rất mạnh.</li>
<li><b>Yếu liên tục</b>: TR trượt xuống với nhiều SOW và đáy thấp dần, nhưng cuối cùng vẫn đảo chiều tăng sau một Spring sâu. Cấu trúc này dễ đánh lừa người mua sớm.</li>
<li><b>Sức mạnh vượt trội</b>: Pha B rất ngắn, các đáy nâng dần và giá thoát TR sớm. Thường đi kèm sức mạnh tương đối vượt trội.</li>
<li><b>Đáy tròn (saucer)</b>: tích lũy dài, biên dạng vòng cung với các SC/AR/Spring "cục bộ" lồng bên trong.</li>
<li><b>Phân phối kiểu "kim tiêm" (hypodermic)</b>: đỉnh nhọn tăng thẳng đứng rồi phân phối rất ngắn trên đường đi xuống. Pha B gần như không tồn tại.</li>
<li><b>Phân phối dạng đáy nâng (shakeout ở Pha A)</b>: đáy TR được nâng lên trong khi đỉnh đi ngang. Nhìn bề ngoài giống tích lũy, nhưng UTAD và Test thất bại cho thấy đây là phân phối.</li></ul>
<div class="callout">Không có hai TR giống hệt nhau. Sơ đồ chỉ là khung tham chiếu — hãy đọc <b>hành vi</b> (cung cầu, nỗ lực/kết quả), đừng cố "ép" biểu đồ vào hình mẫu.</div>`
  }, {
    title: 'Re-accumulation, re-distribution & TR variants',
    html: () => `
<p><b>Re-accumulation</b> is a TR <i>inside</i> an uptrend where big money adds positions before continuing higher; <b>re-distribution</b> is a TR inside a downtrend.</p>
<h3>Re-accumulation vs distribution (TR after an advance)</h3>
<table class="tbl"><thead><tr><th>Clue</th><th>Re-accumulation</th><th>Distribution</th></tr></thead><tbody>
<tr><td>Volume on TR declines</td><td>Drying up</td><td>Expanding</td></tr><tr><td>Volume on TR rallies</td><td>Rising, easy progress</td><td>Heavy but little progress</td></tr>
<tr><td>Lows inside TR</td><td>Rising, hold the AR area</td><td>Falling, break the AR area</td></tr><tr><td>Phase C</td><td>Spring + successful test</td><td>UTAD + failed test</td></tr>
<tr><td>Phase D</td><td>SOS, LPS, BU</td><td>SOW, LPSY</td></tr><tr><td>Relative strength</td><td>Stronger than the index</td><td>Weaker</td></tr></tbody></table>
${S().svg('reacc')}${S().svg('redist')}
<h3>Common TR variants</h3><ul><li><b>Conventional</b>: all five phases with a clear Spring/UTAD.</li><li><b>Absorption at a higher level</b>: the TR low is never retested; supply is absorbed in the upper half — very strong demand.</li>
<li><b>Continuous weakness</b>: the TR drifts lower with several SOWs before a deep Spring reverses it — easily fools early buyers.</li><li><b>Extra strength</b>: short Phase B, rising lows, early exit with strong RS.</li>
<li><b>Saucer / rounding bottom</b>: long arc-shaped accumulation with local SC/AR/Springs inside.</li><li><b>Hypodermic distribution</b>: a vertical spike top followed by a very short distribution on the way down.</li>
<li><b>Distribution with rising lows</b>: looks like accumulation until the UTAD and failed test reveal it.</li></ul>
<div class="callout">No two TRs are identical. Schematics are reference frames — read the <b>behaviour</b>, do not force the chart into a template.</div>`
  });

  /* ============ 8. SPRING, UTAD, CREEK, ICE ============ */
  sec('spring', {
    title: 'Spring, Shakeout, UTAD, Creek & Ice',
    html: () => `
<h3>Ba loại Spring (theo cách phân loại kinh điển)</h3>
${S().springTypes()}
<table class="tbl"><thead><tr><th>Loại</th><th>Xuyên thủng</th><th>Khối lượng</th><th>Ý nghĩa</th><th>Hành động</th></tr></thead><tbody>
<tr><td><b>Spring #1</b> (Terminal Shakeout)</td><td>Sâu, mạnh</td><td>Lớn</td><td>Cung còn nhiều, giá có thể cần thời gian xây dựng lại</td><td>Không mua ngay; chờ nhiều Test hoặc một TR nhỏ mới</td></tr>
<tr><td><b>Spring #2</b></td><td>Vừa phải</td><td>Trung bình</td><td>Còn một ít cung</td><td>Chờ một Test khối lượng thấp rồi mua</td></tr>
<tr><td><b>Spring #3</b></td><td>Nông</td><td>Thấp</td><td>Cung đã cạn</td><td>Có thể mua ngay khi giá hồi về TR</td></tr></tbody></table>
<p><b>Shakeout</b> là một cú rũ bỏ mạnh, nhanh, biên độ rộng, xuyên xuống dưới rồi đóng cửa gần đỉnh nến. Shakeout thường xuất hiện ở tái tích lũy hoặc khi TR nằm gần vùng hỗ trợ lớn.</p>
<h3>Upthrust & UTAD</h3>
<p><b>UT</b> (Pha B) và <b>UTAD</b> (Pha C) đều là những lần vượt kháng cự thất bại. Đây là bẫy mua, giúp tiền lớn bán cho người mua phá vỡ và quét lệnh dừng lỗ của người bán khống. UTAD đáng tin hơn khi khối lượng lớn nhưng đóng cửa thấp, sau đó Test có đỉnh thấp hơn với khối lượng thấp.</p>
<h3>Creek, JAC, BU/BUEC</h3>
<p><b>Creek</b> ("con lạch") là đường kháng cự ziczac nối các đỉnh trong TR tích lũy. Khi giá <b>JAC – Jump Across the Creek</b> (vượt Creek bằng nến rộng, khối lượng lớn, có thể gap), cầu đã thắng. Sau đó giá thường <b>Back-Up to the Edge of the Creek (BU/BUEC)</b>: lùi về kiểm tra mép Creek với khối lượng thấp. Đây là điểm vào lệnh rủi ro thấp kinh điển.</p>
<h3>Ice</h3>
<p><b>Ice</b> ("mặt băng") là đường hỗ trợ nối các đáy trong TR phân phối. Khi giá <b>"rơi qua mặt băng"</b> với khối lượng lớn (SOW), các nhịp hồi lên mặt dưới của Ice với khối lượng thấp là LPSY — điểm bán kinh điển.</p>`
  }, {
    title: 'Spring, Shakeout, UTAD, Creek & Ice',
    html: () => `
<h3>Three Spring types</h3>${S().springTypes()}
<table class="tbl"><thead><tr><th>Type</th><th>Penetration</th><th>Volume</th><th>Meaning</th><th>Action</th></tr></thead><tbody>
<tr><td><b>#1</b> (terminal shakeout)</td><td>Deep</td><td>Heavy</td><td>Plenty of supply left</td><td>Do not buy yet; wait for several tests or a new small TR</td></tr>
<tr><td><b>#2</b></td><td>Moderate</td><td>Moderate</td><td>Some supply left</td><td>Buy after a low-volume test</td></tr>
<tr><td><b>#3</b></td><td>Shallow</td><td>Light</td><td>Supply exhausted</td><td>Can be bought as price returns inside</td></tr></tbody></table>
<p>A <b>shakeout</b> is a fast, wide-range dip below support that closes near the high, common in re-accumulations.</p>
<h3>Upthrust & UTAD</h3><p>UT (Phase B) and UTAD (Phase C) are failed breakouts — bull traps that let big money sell to breakout buyers. A UTAD is more reliable on heavy volume with a low close, followed by a lower-high, low-volume test.</p>
<h3>Creek, JAC, BU/BUEC</h3><p>The <b>Creek</b> is the wavy resistance connecting the highs of an accumulation TR. A <b>JAC</b> crosses it on a wide, high-volume bar (possibly a gap). The <b>Back-Up to the Edge of the Creek</b> is the low-volume retest — the classic low-risk entry.</p>
<h3>Ice</h3><p>The <b>Ice</b> is the support of a distribution TR. A heavy-volume fall through the ice is a SOW; a low-volume rally back to its underside is an LPSY — the classic short.</p>`
  });

  /* ============ 9. NINE TESTS ============ */
  L.NINE = {
    buy: [
      ['Mục tiêu giảm (đếm P&F) đã hoàn thành', 'Downside price objective accomplished'],
      ['Có hoạt động sơ bộ PS, SC, ST', 'Preliminary support, selling climax, secondary test present'],
      ['Hoạt động tăng: khối lượng tăng khi giá lên, giảm khi giá xuống', 'Activity bullish: volume expands on rallies, shrinks on reactions'],
      ['Đường xu hướng giảm (đường cung) đã bị phá vỡ', 'Downward stride (supply line) broken'],
      ['Các đáy cao dần', 'Higher supports (higher lows)'],
      ['Các đỉnh cao dần', 'Higher tops'],
      ['Mạnh hơn thị trường chung (chỉ số)', 'Stronger than the market (index)'],
      ['Đã hình thành nền giá (đường nằm ngang trên P&F)', 'Base forming (horizontal line on the P&F chart)'],
      ['Lợi nhuận tiềm năng ≥ 3 lần rủi ro (đến cắt lỗ)', 'Upside potential at least 3× the risk to the stop']
    ],
    sell: [
      ['Mục tiêu tăng (đếm P&F) đã hoàn thành', 'Upside price objective accomplished'],
      ['Hoạt động giảm: khối lượng giảm khi giá lên, tăng khi giá xuống', 'Activity bearish: volume shrinks on rallies, expands on declines'],
      ['Có cung sơ bộ PSY và cao trào mua BC', 'Preliminary supply and buying climax present'],
      ['Yếu hơn thị trường chung (chỉ số)', 'Weaker than the market (index)'],
      ['Đường xu hướng tăng (đường cầu) đã bị phá vỡ', 'Upward stride (support line) broken'],
      ['Các đỉnh thấp dần', 'Lower tops'],
      ['Các đáy thấp dần', 'Lower supports'],
      ['Đã hình thành "vương miện" (đường nằm ngang trên P&F ở đỉnh)', 'Crown forming (horizontal line on the P&F chart)'],
      ['Lợi nhuận tiềm năng phía giảm ≥ 3 lần rủi ro', 'Downside potential at least 3× the risk']
    ]
  };
  const nineHtml = (lang) => {
    const li = arr => arr.map(x => `<li>${lang === 'en' ? x[1] : x[0]}</li>`).join('');
    return `<div class="two-col"><div><h3>${lang === 'en' ? 'Nine buying tests (accumulation)' : '9 phép thử MUA (tích lũy)'}</h3><ol>${li(L.NINE.buy)}</ol></div>
      <div><h3>${lang === 'en' ? 'Nine selling tests (distribution)' : '9 phép thử BÁN (phân phối)'}</h3><ol>${li(L.NINE.sell)}</ol></div></div>`;
  };
  sec('tests', {
    title: '9 phép thử Mua & 9 phép thử Bán',
    html: () => `<p>Wyckoff dùng 9 phép thử để xác nhận một cấu trúc tích lũy đã hoàn tất (sẵn sàng tăng) hoặc phân phối đã hoàn tất (sẵn sàng giảm). Không cần đạt đủ 9/9, nhưng càng nhiều phép thử đạt thì xác suất càng cao. Phép thử 9 (tỷ lệ lợi nhuận/rủi ro) là <b>bắt buộc</b>.</p>
${nineHtml('vi')}
<div class="callout">Mở tab <b>Checklist</b> để chấm điểm 9 phép thử cho từng mã và lưu ghi chú.</div>`
  }, {
    title: 'Nine buying & selling tests',
    html: () => `<p>Wyckoff’s nine tests confirm that accumulation (or distribution) is complete and the asset is ready to move. You do not need 9/9, but the more that pass, the better; test 9 (reward/risk) is <b>mandatory</b>.</p>${nineHtml('en')}<div class="callout">Use the <b>Checklist</b> tab to score the tests for each symbol.</div>`
  });

  /* ============ 10. VSA ============ */
  sec('vsa', {
    title: 'VSA – Phân tích Khối lượng & Biên độ',
    html: () => `
<p><b>VSA (Volume Spread Analysis)</b> phát triển từ tư tưởng Wyckoff. Mỗi nến được đọc qua 3 yếu tố: <b>biên độ (spread)</b>, <b>vị trí đóng cửa</b> và <b>khối lượng so với các nến trước</b>, và luôn đặt trong <b>bối cảnh</b> (xu hướng, vị trí trong TR). Cùng một hình dạng nến có thể mang ý nghĩa ngược nhau ở hai bối cảnh khác nhau.</p>
<table class="tbl"><thead><tr><th>Mẫu</th><th>Hình dạng</th><th>Bối cảnh</th><th>Ý nghĩa</th></tr></thead><tbody>
<tr><td><b>No Demand</b></td><td>Nến tăng hẹp, KL thấp hơn 2 nến trước, đóng cửa giữa/thấp</td><td>Trong nhịp tăng, gần kháng cự</td><td>Tiền lớn không mua lên → yếu</td></tr>
<tr><td><b>No Supply</b></td><td>Nến giảm hẹp, KL thấp hơn 2 nến trước</td><td>Trong nhịp giảm, gần hỗ trợ</td><td>Không còn áp lực bán → mạnh</td></tr>
<tr><td><b>Test</b></td><td>Nhúng xuống dưới đáy gần nhất, đóng cửa cao, KL thấp</td><td>Sau tích lũy / sau Spring / trong xu hướng tăng</td><td>Kiểm tra cung thành công → mua</td></tr>
<tr><td><b>Stopping Volume</b></td><td>Nến giảm KL rất lớn, đóng cửa rời đáy</td><td>Sau nhịp giảm dài</td><td>Cầu chuyên nghiệp chặn đà giảm</td></tr>
<tr><td><b>Selling Climax</b></td><td>Biên độ rất rộng, KL cao trào, đáy mới, thường rút chân</td><td>Cuối xu hướng giảm</td><td>Hoảng loạn được hấp thụ (SC)</td></tr>
<tr><td><b>Buying Climax</b></td><td>Biên độ rất rộng, KL cao trào, đỉnh mới, thường có râu trên</td><td>Cuối xu hướng tăng</td><td>Hưng phấn bị phân phối (BC)</td></tr>
<tr><td><b>Upthrust</b></td><td>Vượt đỉnh gần nhất, đóng cửa gần đáy nến, KL cao</td><td>Vùng kháng cự / trong TR</td><td>Bẫy mua → yếu</td></tr>
<tr><td><b>Pseudo Upthrust</b></td><td>Giống Upthrust nhưng KL thấp</td><td>Trong xu hướng tăng mạnh</td><td>Rũ bỏ người bán, không phải yếu thật</td></tr>
<tr><td><b>Shakeout</b></td><td>Xuyên đáy rồi đóng cửa gần đỉnh, biên độ rộng</td><td>Hỗ trợ / TR</td><td>Quét cắt lỗ → mạnh</td></tr>
<tr><td><b>Effort to Rise</b></td><td>Nến tăng rộng, KL tăng, đóng cửa cao</td><td>Thoát khỏi vùng tích lũy</td><td>Cầu thật</td></tr>
<tr><td><b>Effort to Fall</b></td><td>Nến giảm rộng, KL tăng, đóng cửa thấp</td><td>Thoát khỏi vùng phân phối</td><td>Cung thật</td></tr>
<tr><td><b>Nỗ lực không kết quả</b> (Squat)</td><td>KL rất cao, biên độ hẹp</td><td>Ở đỉnh: cung hấp thụ cầu; ở đáy: cầu hấp thụ cung</td><td>Cảnh báo đảo chiều</td></tr>
<tr><td><b>End of Rising Market</b></td><td>Nến tăng hẹp, KL cực lớn tại đỉnh mới</td><td>Cuối xu hướng tăng</td><td>Cung lớn ẩn bên trong</td></tr>
<tr><td><b>Bag Holding</b></td><td>Chuỗi nến giảm KL lớn, sau đó giá không giảm tiếp</td><td>Vùng thấp</td><td>Tiền lớn "ôm hàng" từ đám đông</td></tr></tbody></table>
<div class="callout">Ba câu hỏi VSA cho mỗi nến: (1) Khối lượng lớn hay nhỏ so với nền? (2) Biên độ có tương xứng với khối lượng không? (3) Đóng cửa ở đâu, và <b>nến tiếp theo xác nhận hay phủ nhận</b>?</div>`
  }, {
    title: 'VSA — Volume Spread Analysis',
    html: () => `
<p><b>VSA</b> grew out of Wyckoff’s work. Each bar is read through <b>spread</b>, <b>close location</b> and <b>volume relative to prior bars</b>, always <b>in context</b> (trend, location in the TR).</p>
<table class="tbl"><thead><tr><th>Pattern</th><th>Shape</th><th>Context</th><th>Meaning</th></tr></thead><tbody>
<tr><td><b>No Demand</b></td><td>Narrow up bar, volume below the previous two</td><td>Rally, near resistance</td><td>Professionals not buying → weak</td></tr>
<tr><td><b>No Supply</b></td><td>Narrow down bar, volume below the previous two</td><td>Decline, near support</td><td>No selling pressure → strong</td></tr>
<tr><td><b>Test</b></td><td>Dip below recent low, high close, low volume</td><td>After accumulation/Spring</td><td>Successful supply test → buy</td></tr>
<tr><td><b>Stopping Volume</b></td><td>Heavy-volume down bar closing off its low</td><td>After a long decline</td><td>Professional demand halting the fall</td></tr>
<tr><td><b>Selling Climax</b></td><td>Very wide, climactic volume, new low, tail</td><td>End of downtrend</td><td>Panic absorbed</td></tr>
<tr><td><b>Buying Climax</b></td><td>Very wide, climactic volume, new high</td><td>End of uptrend</td><td>Euphoria distributed</td></tr>
<tr><td><b>Upthrust</b></td><td>Breaks recent highs, closes near the low on high volume</td><td>Resistance / TR</td><td>Bull trap</td></tr>
<tr><td><b>Pseudo Upthrust</b></td><td>Upthrust shape on low volume</td><td>Strong uptrend</td><td>Shakes out sellers</td></tr>
<tr><td><b>Shakeout</b></td><td>Dips below lows, closes near the high, wide</td><td>Support / TR</td><td>Stop run → strong</td></tr>
<tr><td><b>Effort to Rise / Fall</b></td><td>Wide bar, rising volume, close at the extreme</td><td>Leaving accumulation / distribution</td><td>Genuine demand / supply</td></tr>
<tr><td><b>Effort, no result</b></td><td>Very high volume, narrow spread</td><td>Top: supply absorbing; bottom: demand absorbing</td><td>Reversal warning</td></tr>
<tr><td><b>End of Rising Market</b></td><td>Narrow up bar, ultra volume at a new high</td><td>Late uptrend</td><td>Hidden supply</td></tr>
<tr><td><b>Bag Holding</b></td><td>Heavy-volume down bars, then no further decline</td><td>Lows</td><td>Big money taking the public’s stock</td></tr></tbody></table>
<div class="callout">Three VSA questions: (1) Is volume high or low vs the background? (2) Does the spread match the volume? (3) Where is the close — and does the <b>next bar confirm</b>?</div>`
  });

  /* ============ 11. EFFORT / RESULT MATRIX ============ */
  sec('effort', {
    title: 'Ma trận Nỗ lực – Kết quả (10 tình huống)',
    html: () => `
<p>Kết quả được đo bằng <b>biên độ/quãng đường giá</b>, nỗ lực đo bằng <b>khối lượng</b>. Luôn so với nến hoặc nhịp trước đó, trong cùng bối cảnh xu hướng.</p>
<h3>Bối cảnh xu hướng TĂNG</h3>
<table class="tbl"><thead><tr><th>#</th><th>Biên độ</th><th>Khối lượng</th><th>Đọc hiểu</th><th>Thiên hướng</th></tr></thead><tbody>
<tr><td>1</td><td>Tăng</td><td>Tăng</td><td>Nỗ lực và kết quả hài hoà, cầu thật</td><td class="up">Tăng</td></tr>
<tr><td>2</td><td>Giảm</td><td>Tăng</td><td>Nỗ lực lớn, kết quả nhỏ: cung đang chặn đà tăng</td><td class="down">Giảm</td></tr>
<tr><td>3</td><td>Giảm</td><td>Giảm</td><td>Cầu yếu dần, dễ bị đảo chiều trong nhịp điều chỉnh</td><td class="down">Giảm (cảnh báo)</td></tr>
<tr><td>4</td><td>Tăng</td><td>Giảm</td><td>Dễ dàng di chuyển (ease of movement): cung rất mỏng</td><td class="up">Tăng</td></tr>
<tr><td>5</td><td>Tăng mạnh</td><td>Cực lớn, rồi giá dừng lại</td><td>Cao trào mua: tiền lớn bán vào đà tăng</td><td class="down">Giảm</td></tr></tbody></table>
<h3>Bối cảnh xu hướng GIẢM</h3>
<table class="tbl"><thead><tr><th>#</th><th>Biên độ</th><th>Khối lượng</th><th>Đọc hiểu</th><th>Thiên hướng</th></tr></thead><tbody>
<tr><td>6</td><td>Tăng</td><td>Tăng</td><td>Hành động giảm bình thường, cung thật</td><td class="down">Giảm</td></tr>
<tr><td>7</td><td>Giảm</td><td>Tăng</td><td>Cầu đang cố gắng chặn đà giảm (hấp thụ)</td><td class="up">Tăng</td></tr>
<tr><td>8</td><td>Giảm</td><td>Giảm</td><td>Cung cạn dần, dễ bị đảo chiều trong các nhịp hồi</td><td class="up">Tăng</td></tr>
<tr><td>9</td><td>Tăng</td><td>Giảm</td><td>Giá rơi dễ dàng, thiếu cầu</td><td class="down">Giảm</td></tr>
<tr><td>10</td><td>Tăng mạnh</td><td>Cực lớn, rồi giá dừng lại</td><td>Cầu lớn ngăn chặn xu hướng giảm (SC / Stopping Volume)</td><td class="up">Tăng</td></tr></tbody></table>
<div class="callout">Công thức ghi nhớ: <b>Nỗ lực ↑ + Kết quả ↓ = có lực đối ứng</b>. <b>Nỗ lực ↓ + Kết quả ↑ = phía đối diện mỏng</b>.</div>`
  }, {
    title: 'Effort vs Result matrix (10 cases)',
    html: () => `
<p>Result = <b>spread/price travel</b>; effort = <b>volume</b>. Always compare with the previous bar or wave in the same trend context.</p>
<h3>Uptrend context</h3><table class="tbl"><thead><tr><th>#</th><th>Spread</th><th>Volume</th><th>Reading</th><th>Bias</th></tr></thead><tbody>
<tr><td>1</td><td>Up</td><td>Up</td><td>Harmony, genuine demand</td><td class="up">Bullish</td></tr><tr><td>2</td><td>Down</td><td>Up</td><td>Big effort, small result: supply capping</td><td class="down">Bearish</td></tr>
<tr><td>3</td><td>Down</td><td>Down</td><td>Demand fading; vulnerable on reactions</td><td class="down">Bearish (warning)</td></tr><tr><td>4</td><td>Up</td><td>Down</td><td>Ease of movement: thin supply</td><td class="up">Bullish</td></tr>
<tr><td>5</td><td>Wide</td><td>Ultra, then stalls</td><td>Buying climax</td><td class="down">Bearish</td></tr></tbody></table>
<h3>Downtrend context</h3><table class="tbl"><thead><tr><th>#</th><th>Spread</th><th>Volume</th><th>Reading</th><th>Bias</th></tr></thead><tbody>
<tr><td>6</td><td>Up</td><td>Up</td><td>Normal bearish action</td><td class="down">Bearish</td></tr><tr><td>7</td><td>Down</td><td>Up</td><td>Demand trying to stop the decline</td><td class="up">Bullish</td></tr>
<tr><td>8</td><td>Down</td><td>Down</td><td>Supply drying; vulnerable to rallies</td><td class="up">Bullish</td></tr><tr><td>9</td><td>Up</td><td>Down</td><td>Ease of movement down</td><td class="down">Bearish</td></tr>
<tr><td>10</td><td>Wide</td><td>Ultra, then stalls</td><td>Large demand halting the fall (SC)</td><td class="up">Bullish</td></tr></tbody></table>
<div class="callout"><b>More effort + less result = the other side is active.</b> <b>Less effort + more result = the other side is thin.</b></div>`
  });

  /* ============ 12. MULTI-TIMEFRAME ============ */
  sec('mtf', {
    title: 'Luật đa khung thời gian',
    html: () => `
<p>Cấu trúc Wyckoff mang tính <b>phân dạng (fractal)</b>: mỗi sự kiện ở khung lớn là cả một cấu trúc ở khung nhỏ.</p>
<ul><li>Một <b>Spring ở khung H4</b> thường là một <b>cấu trúc tích lũy hoàn chỉnh (SC → ST → Spring → SOS) ở khung M15</b>.</li>
<li>Một <b>UTAD ở khung D1</b> thường là một <b>phân phối nhỏ ở khung H1</b>.</li>
<li>Pha B dài ở khung lớn chứa nhiều cấu trúc tích lũy/phân phối nhỏ xen kẽ ở khung nhỏ. Đó là lý do khung nhỏ trong Pha B rất "nhiễu".</li></ul>
<h3>Vai trò từng khung</h3>
<table class="tbl"><thead><tr><th>Khung</th><th>Vai trò</th><th>Câu hỏi cần trả lời</th></tr></thead><tbody>
<tr><td>2W · 1W</td><td>Chu kỳ lớn</td><td>Thị trường đang ở giai đoạn nào của chu kỳ? Nguyên nhân lớn nhất ở đâu?</td></tr>
<tr><td>1D</td><td>Xu hướng chính &amp; TR giao dịch</td><td>TR hiện tại là tích lũy hay phân phối? Đang ở pha nào?</td></tr>
<tr><td>4H · 1H</td><td>Cấu trúc thực thi</td><td>Sự kiện Pha C/D của khung ngày đang diễn ra thế nào?</td></tr>
<tr><td>30m · 15m</td><td>Xác nhận</td><td>Có tích lũy/phân phối nhỏ xác nhận sự kiện khung trên không?</td></tr>
<tr><td>5m · 1m</td><td>Điểm vào</td><td>Spring/Test/LPS nhỏ nào cho điểm cắt lỗ gần nhất?</td></tr></tbody></table>
<h3>Quy tắc thực hành</h3>
<ol><li><b>Từ trên xuống</b>: luôn đọc khung lớn trước. Khung nhỏ chỉ dùng để thực thi theo hướng khung lớn.</li>
<li><b>Tỷ lệ khung 4–6 lần</b> (ví dụ 1D → 4H → 1H → 15m) để mỗi khung nhỏ thể hiện rõ cấu trúc bên trong một sự kiện của khung lớn.</li>
<li><b>Vị trí quan trọng hơn mẫu hình</b>: tích lũy nhỏ ở đáy TR lớn đáng tin hơn nhiều so với tích lũy nhỏ ở giữa hoặc đỉnh TR lớn.</li>
<li><b>Khi khung lớn đang ở Pha B</b>: giảm khối lượng, giao dịch biên hoặc đứng ngoài.</li>
<li><b>Lệnh tốt nhất</b>: khung lớn ở cuối Pha C/đầu Pha D + khung nhỏ hoàn tất tích lũy (Pha D/E) cùng chiều.</li>
<li><b>Mâu thuẫn</b>: khi khung nhỏ đi ngược khung lớn, coi đó là nhịp điều chỉnh/kiểm tra cho đến khi khung trung xác nhận đảo chiều.</li></ol>`
  }, {
    title: 'Multi-timeframe rules',
    html: () => `
<p>Wyckoff structures are <b>fractal</b>: each higher-TF event is a full structure on a lower TF.</p>
<ul><li>An <b>H4 Spring</b> is often a <b>complete M15 accumulation</b> (SC → ST → Spring → SOS).</li><li>A <b>D1 UTAD</b> is often a <b>small H1 distribution</b>.</li><li>A long higher-TF Phase B contains many alternating small structures — hence lower-TF noise.</li></ul>
<h3>Role of each timeframe</h3><table class="tbl"><thead><tr><th>TF</th><th>Role</th><th>Question</th></tr></thead><tbody>
<tr><td>2W · 1W</td><td>Cycle</td><td>Which stage of the cycle? Where is the biggest cause?</td></tr><tr><td>1D</td><td>Main trend &amp; trading TR</td><td>Accumulation or distribution? Which phase?</td></tr>
<tr><td>4H · 1H</td><td>Execution structure</td><td>How is the daily Phase C/D event unfolding?</td></tr><tr><td>30m · 15m</td><td>Confirmation</td><td>Does a small structure confirm the higher event?</td></tr><tr><td>5m · 1m</td><td>Entry</td><td>Which small Spring/Test/LPS gives the tightest stop?</td></tr></tbody></table>
<h3>Practical rules</h3><ol><li><b>Top-down</b>: read the higher TF first; lower TFs only execute its direction.</li><li><b>4–6× TF ratio</b> between levels.</li><li><b>Location beats pattern</b>: a small accumulation at the bottom of a big TR is far more reliable.</li>
<li><b>Higher TF in Phase B</b>: reduce size, trade edges or stand aside.</li><li><b>Best trades</b>: higher TF late Phase C/early D + lower TF completed structure in the same direction.</li><li><b>Conflict</b>: a lower TF against the higher TF is a correction until the middle TF confirms a reversal.</li></ol>`
  });

  /* ============ 13. TRADE MANAGEMENT ============ */
  sec('trade', {
    title: 'Quản trị lệnh theo 3 kịch bản',
    html: () => `
<h3>Kịch bản TĂNG (tích lũy / tái tích lũy)</h3>
<table class="tbl"><thead><tr><th>Điểm vào</th><th>Điều kiện</th><th>Cắt lỗ</th><th>Mục tiêu</th></tr></thead><tbody>
<tr><td>1. Spring/Test (mạnh tay)</td><td>Spring #3 hoặc Test khối lượng thấp sau Spring #2</td><td>Dưới đáy Spring 0.5–1 ATR</td><td>T1: kháng cự TR · T2: chiều cao TR · T3: P&amp;F</td></tr>
<tr><td>2. LPS trong TR</td><td>Đáy cao hơn sau mSOS, KL thấp</td><td>Dưới LPS / dưới Test</td><td>Như trên</td></tr>
<tr><td>3. BU/LPS sau SOS (thận trọng)</td><td>JAC rồi lùi về Creek với KL thấp</td><td>Dưới Creek ~0.3–0.4 chiều cao TR</td><td>Chiều cao TR, P&amp;F</td></tr>
<tr><td>4. Pullback trong Markup</td><td>Điều chỉnh KL thấp (No Supply/Test)</td><td>Dưới đáy nhịp điều chỉnh</td><td>P&amp;F, đỉnh mới</td></tr></tbody></table>
<h3>Kịch bản GIẢM (phân phối / tái phân phối)</h3>
<table class="tbl"><thead><tr><th>Điểm vào</th><th>Điều kiện</th><th>Cắt lỗ</th><th>Mục tiêu</th></tr></thead><tbody>
<tr><td>1. Test UTAD</td><td>Đỉnh thấp hơn UTAD, KL thấp</td><td>Trên đỉnh UTAD</td><td>Hỗ trợ TR, chiều cao TR, P&amp;F</td></tr>
<tr><td>2. LPSY sau SOW</td><td>Hồi về Ice, KL thấp, No Demand</td><td>Trên LPSY / trên Ice ~0.3 chiều cao</td><td>Chiều cao TR, P&amp;F</td></tr>
<tr><td>3. Hồi trong Markdown</td><td>Nhịp hồi KL thấp</td><td>Trên đỉnh nhịp hồi</td><td>Đáy mới</td></tr></tbody></table>
<p><i>Thị trường không bán khống được (cổ phiếu cơ sở VN, crypto spot): kịch bản giảm có nghĩa là không mua mới, chốt lời hoặc hạ tỷ trọng tại các điểm trên.</i></p>
<h3>Kịch bản ĐI NGANG (Pha B)</h3>
<ul><li>Ưu tiên <b>đứng ngoài</b>. Nếu giao dịch thì dùng khối lượng nhỏ: mua sát hỗ trợ khi có No Supply/Test, chốt lời hoặc bán ở kháng cự khi có No Demand/UT.</li>
<li>Không bao giờ mua/bán ở <b>giữa TR</b>.</li></ul>
<h3>Quy tắc vốn</h3>
<ul><li>Rủi ro mỗi lệnh 0.5–2% tài khoản. <b>Khối lượng lệnh = (Vốn × %rủi ro) ÷ (Giá vào − Giá cắt lỗ)</b>.</li>
<li>Chia lệnh 2–3 lần theo tiến trình xác nhận: Spring/Test → SOS → BU/LPS.</li>
<li>Kéo cắt lỗ theo các LPS mới (tăng) hoặc LPSY mới (giảm).</li>
<li>Thoát lệnh khi xuất hiện dấu hiệu ngược chiều: PSY/BC, UT, nỗ lực không kết quả ở vùng cao, hoặc khi giá đạt mục tiêu P&amp;F và phản ứng yếu.</li>
<li>Chỉ vào lệnh khi lợi nhuận tiềm năng ≥ 3 lần rủi ro (phép thử thứ 9).</li></ul>`
  }, {
    title: 'Trade management for the three scenarios',
    html: () => `
<h3>BULLISH (accumulation / re-accumulation)</h3><table class="tbl"><thead><tr><th>Entry</th><th>Condition</th><th>Stop</th><th>Targets</th></tr></thead><tbody>
<tr><td>1. Spring/Test (aggressive)</td><td>Spring #3, or low-volume test after Spring #2</td><td>0.5–1 ATR below the Spring low</td><td>T1 TR top · T2 range height · T3 P&amp;F</td></tr>
<tr><td>2. LPS inside the TR</td><td>Higher low after mSOS, low volume</td><td>Below LPS/Test</td><td>Same</td></tr>
<tr><td>3. BU/LPS after SOS (conservative)</td><td>JAC then low-volume back-up</td><td>~0.3–0.4 TR height below the Creek</td><td>Range height, P&amp;F</td></tr>
<tr><td>4. Markup pullback</td><td>No Supply/Test</td><td>Below the pullback low</td><td>P&amp;F, new highs</td></tr></tbody></table>
<h3>BEARISH (distribution / re-distribution)</h3><table class="tbl"><thead><tr><th>Entry</th><th>Condition</th><th>Stop</th><th>Targets</th></tr></thead><tbody>
<tr><td>1. UTAD test</td><td>Lower high, low volume</td><td>Above the UTAD high</td><td>TR low, height, P&amp;F</td></tr><tr><td>2. LPSY after SOW</td><td>Rally to the Ice on low volume</td><td>Above the LPSY</td><td>Height, P&amp;F</td></tr><tr><td>3. Markdown rally</td><td>Low-volume bounce</td><td>Above the bounce high</td><td>New lows</td></tr></tbody></table>
<p><i>If shorting is impossible (VN cash stocks, crypto spot), bearish means no new buys and taking profit/reducing at these points.</i></p>
<h3>SIDEWAYS (Phase B)</h3><ul><li>Prefer to <b>stand aside</b>; if trading, use small size: buy support on No Supply/Test, sell resistance on No Demand/UT.</li><li>Never trade the <b>middle of the TR</b>.</li></ul>
<h3>Money management</h3><ul><li>Risk 0.5–2% per trade. <b>Size = (Equity × risk%) ÷ (Entry − Stop)</b>.</li><li>Scale in 2–3 times: Spring/Test → SOS → BU/LPS.</li><li>Trail stops under new LPSs (or above new LPSYs).</li><li>Exit on opposing signs: PSY/BC, UT, effort without result at highs, or weak reaction at the P&amp;F target.</li><li>Only take trades with ≥ 3:1 reward/risk (test 9).</li></ul>`
  });

  /* ============ 14. VIETNAM MARKET ============ */
  sec('vietnam', {
    title: 'Phiên bản đặc biệt: cổ phiếu cơ sở Việt Nam',
    html: () => `
<p>Phương pháp Wyckoff ra đời trên thị trường cổ phiếu, nên rất phù hợp với cổ phiếu cơ sở Việt Nam. Tuy vậy, cần điều chỉnh theo các đặc thù sau:</p>
<table class="tbl"><thead><tr><th>Đặc thù</th><th>Ảnh hưởng đến phân tích Wyckoff</th></tr></thead><tbody>
<tr><td>Thanh toán T+2 (bán được từ chiều T+2)</td><td>Không cắt lỗ ngay trong ngày mua. Nên vào lệnh ở Test/LPS (rủi ro thấp) thay vì mua đuổi SOS. Đặt cắt lỗ theo <b>giá đóng cửa</b> để tránh bị rũ bỏ trong phiên.</td></tr>
<tr><td>Biên độ giá: HOSE ±7%, HNX ±10%, UPCoM ±15%</td><td>Nến trần/sàn có "biên độ bị cắt". Khi đó khối lượng thấp không có nghĩa là thiếu cầu (hoặc cung) mà có thể do dư mua trần (hoặc dư bán sàn). Hãy đọc thêm khối lượng dư mua/dư bán.</td></tr>
<tr><td>Phiên ATO/ATC</td><td>Nến ngày thường có khối lượng lớn ở ATC. Khung 1m/5m đầu và cuối phiên có khối lượng đột biến mang tính kỹ thuật, không phải luôn là cao trào.</td></tr>
<tr><td>Không bán khống cổ phiếu cơ sở</td><td>Kịch bản giảm = không mua mới, hạ tỷ trọng, chốt lời tại UTAD/LPSY. Muốn tận dụng chiều giảm thì dùng phái sinh VN30F (T+0, bán khống được).</td></tr>
<tr><td>Đơn vị giá: nghìn đồng; lô 100 cổ phiếu</td><td>Mức giá trong ứng dụng hiển thị theo nghìn đồng (ví dụ 25.4 = 25,400đ).</td></tr>
<tr><td>Thị trường chung: VNINDEX / VN30</td><td>Bước 1 & 5 của Wyckoff: phân tích VNINDEX trước. Bước 2: ứng dụng tự tính <b>sức mạnh tương đối</b> của cổ phiếu so với VNINDEX.</td></tr>
<tr><td>Khung 4H</td><td>Một ngày giao dịch chỉ khoảng 4.5 giờ, nên "4H" ở đây là <b>2 nến mỗi ngày: phiên sáng và phiên chiều</b>.</td></tr>
<tr><td>Khung 1W/2W</td><td>Được gộp từ dữ liệu ngày (tuần bắt đầu thứ Hai).</td></tr></tbody></table>
<div class="callout">Kinh nghiệm: ở thị trường VN, Pha B thường dài và có nhiều Shakeout mạnh trong phiên (kéo sàn rồi rút chân). Hãy ưu tiên đọc nến <b>đóng cửa</b> ở khung ngày, và dùng khung 1H/15m để tìm Test/LPS.</div>`
  }, {
    title: 'Special edition: Vietnam cash stocks',
    html: () => `
<p>Wyckoff was born in the stock market and fits Vietnamese cash equities well, with these adjustments:</p>
<table class="tbl"><thead><tr><th>Feature</th><th>Impact on Wyckoff analysis</th></tr></thead><tbody>
<tr><td>T+2 settlement (sellable from the afternoon of T+2)</td><td>No same-day stop. Prefer Test/LPS entries over chasing SOS; use <b>closing-price stops</b>.</td></tr>
<tr><td>Daily limits: HOSE ±7%, HNX ±10%, UPCoM ±15%</td><td>Limit-up/down bars have truncated spreads; low volume there may mean unfilled demand/supply, not its absence.</td></tr>
<tr><td>ATO/ATC auctions</td><td>Opening/closing volume spikes on 1m/5m are technical, not always climaxes.</td></tr>
<tr><td>No shorting of cash stocks</td><td>Bearish = no new buys, reduce, take profit at UTAD/LPSY. Use VN30F futures (T+0, shortable) for the downside.</td></tr>
<tr><td>Prices in thousand VND; 100-share lots</td><td>e.g. 25.4 = 25,400 VND.</td></tr>
<tr><td>Market index: VNINDEX / VN30</td><td>Steps 1 & 5: read VNINDEX first. Step 2: the app computes <b>relative strength</b> vs VNINDEX.</td></tr>
<tr><td>4H timeframe</td><td>A session is ~4.5 hours, so "4H" here = <b>two bars per day: morning and afternoon</b>.</td></tr>
<tr><td>1W/2W</td><td>Built from daily data (Monday weeks).</td></tr></tbody></table>
<div class="callout">In Vietnam, Phase B is often long with violent intraday shakeouts. Read daily <b>closes</b> and use 1H/15m to time Tests/LPS.</div>`
  });

  /* ============ 15. GLOSSARY ============ */
  const G = [
    ['TR – Trading Range', 'Vùng đi ngang nơi xây dựng nguyên nhân', 'Sideways range where the cause is built'],
    ['PS / PSY', 'Hỗ trợ sơ bộ / Cung sơ bộ', 'Preliminary Support / Supply'],
    ['SC / BC', 'Cao trào bán / Cao trào mua', 'Selling / Buying Climax'],
    ['AR', 'Phản ứng tự động sau cao trào', 'Automatic Rally / Reaction'],
    ['ST', 'Kiểm tra thứ cấp', 'Secondary Test'],
    ['UA / UT', 'Upthrust Action / Upthrust', 'Upthrust Action / Upthrust'],
    ['Spring / Shakeout', 'Xuyên thủng hỗ trợ rồi hồi — bẫy bán', 'Break of support that recovers — a bear trap'],
    ['UTAD', 'Upthrust sau phân phối — bẫy mua', 'Upthrust After Distribution — a bull trap'],
    ['SOS / SOW', 'Dấu hiệu sức mạnh / yếu', 'Sign of Strength / Weakness'],
    ['LPS / LPSY', 'Điểm hỗ trợ cuối / Điểm cung cuối', 'Last Point of Support / Supply'],
    ['JAC', 'Nhảy qua con lạch (vượt Creek)', 'Jump Across the Creek'],
    ['BU / BUEC', 'Lùi về mép con lạch', 'Back-Up to the Edge of the Creek'],
    ['Creek / Ice', 'Kháng cự tích lũy / Hỗ trợ phân phối', 'Accumulation resistance / Distribution support'],
    ['Cause / Effect', 'Nguyên nhân (TR) / Hiệu ứng (xu hướng)', 'TR cause / trend effect'],
    ['P&F count', 'Đếm ngang Point & Figure để ước lượng mục tiêu', 'Horizontal Point & Figure count for targets'],
    ['Spread', 'Biên độ nến (cao – thấp)', 'Bar range (high – low)'],
    ['EoM', 'Dễ dàng di chuyển (Ease of Movement)', 'Ease of Movement'],
    ['RS', 'Sức mạnh tương đối so với chỉ số', 'Relative strength vs the index'],
    ['Composite Man', 'Nhà đầu tư tổng hợp – đại diện dòng tiền lớn', 'The composite operator — big money']
  ];
  sec('glossary', {
    title: 'Thuật ngữ',
    html: () => `<table class="tbl"><thead><tr><th>Thuật ngữ</th><th>Nghĩa</th></tr></thead><tbody>${G.map(g => `<tr><td><b>${g[0]}</b></td><td>${g[1]}</td></tr>`).join('')}</tbody></table>`
  }, {
    title: 'Glossary',
    html: () => `<table class="tbl"><thead><tr><th>Term</th><th>Meaning</th></tr></thead><tbody>${G.map(g => `<tr><td><b>${g[0]}</b></td><td>${g[2]}</td></tr>`).join('')}</tbody></table>`
  });
})(window.LLW);
