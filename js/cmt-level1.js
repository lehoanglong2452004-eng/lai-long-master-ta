/* CMT Level 1 — study notes written by Lai Long Master TA in its own words, following the Level 1 body of knowledge.
   Not affiliated with, nor reproduced from, the CMT Association or its publishers. */
(function (L) {
  'use strict';
  const C = L.cmt, F = C.fig;
  const v = (vi, en) => ({ vi, en });

  /* ================= ROADMAP ================= */
  C.levels[1] = {
    title: v('CMT Level 1 — Nền tảng Phân tích Kỹ thuật', 'CMT Level 1 — Foundations of Technical Analysis'),
    intro: v(`
<p>Level 1 trả lời câu hỏi <b>"Phân tích kỹ thuật là gì và các công cụ cơ bản vận hành ra sao?"</b>. Đây là tầng nền: thuật ngữ, cách dựng và đọc biểu đồ, xu hướng, mẫu hình, chỉ báo, đặc điểm các thị trường, tâm lý học hành vi, thống kê cơ bản và tư duy hệ thống.</p>
<div class="callout"><b>Quy trình học được đề xuất</b>
<ol><li>Học <b>tuần tự</b> từng Phần, từng Bài. Không nhảy cóc: kiến thức sau dựa trên kiến thức trước.</li>
<li>Mỗi bài: đọc <i>Mục tiêu</i> → học <i>Nội dung</i> → làm phần <i>Thực hành</i> (nếu có) → học thuộc <i>Ghi nhớ cốt lõi</i> và <i>Thuật ngữ</i>.</li>
<li>Làm <b>Câu hỏi tự kiểm tra</b>. Chỉ chuyển bài khi đạt <b>≥ 80%</b>; chưa đạt thì đọc lại phần giải thích.</li>
<li>Cuối mỗi Phần: tự tóm tắt lại bằng sơ đồ tư duy của riêng bạn.</li></ol></div>
<p class="muted">Nội dung do Lai Long Master TA biên soạn lại theo cách hiểu riêng, bám theo khung kiến thức CMT Level 1. Đây là tài liệu học tập độc lập, không liên kết với CMT Association và không thay thế giáo trình chính thức. Thông tin kỳ thi xem tại cmtassociation.org.</p>`,
    `<p>Level 1 answers <b>"What is technical analysis and how do its basic tools work?"</b> — terminology, chart construction, trends, patterns, indicators, market characteristics, behavioural finance, basic statistics and systems thinking.</p>
<div class="callout"><b>Suggested process</b><ol><li>Study the Parts and Lessons <b>in order</b>.</li><li>Each lesson: goals → content → hands-on (if any) → key takeaways and terms.</li><li>Take the <b>self-check</b>; move on only at <b>≥ 80%</b>.</li><li>At the end of each Part, summarise it in your own mind map.</li></ol></div>
<p class="muted">Written independently by Lai Long Master TA in its own words, following the CMT Level 1 body of knowledge. Not affiliated with the CMT Association; not a substitute for the official curriculum. Exam information: cmtassociation.org.</p>`),
    parts: [
      { title: v('Lý thuyết và lịch sử Phân tích Kỹ thuật', 'Theory and history of technical analysis'),
        goal: v('Hiểu triết lý nền tảng: xu hướng, Lý thuyết Dow và công cụ cơ bản nhất — biểu đồ.', 'The founding ideas: the trend, Dow Theory and the basic tool — the chart.'),
        lessons: [
          { id: 'l1-01', no: 1, title: v('Nguyên lý cơ bản của PTKT: Xu hướng', 'The basic principle: the trend') },
          { id: 'l1-02', no: 2, title: v('Lý thuyết Dow', 'Dow Theory') },
          { id: 'l1-03', no: 3, title: v('Lịch sử và cấu tạo biểu đồ', 'History and construction of charts') }] },
      { title: v('Biểu đồ, xu hướng và mẫu hình', 'Charts, trends and patterns'),
        goal: v('Bộ công cụ cốt lõi: đường xu hướng, hỗ trợ/kháng cự, trung bình động, mẫu hình giá, nến Nhật, P&F và xác nhận bằng khối lượng.', 'The core toolkit: trendlines, support/resistance, moving averages, price patterns, candlesticks, P&F and volume confirmation.'),
        lessons: [
          { id: 'l1-04', no: 4, title: v('Xu hướng — kiến thức nền', 'Trends — the basics') },
          { id: 'l1-05', no: 5, title: v('Phá vỡ, điểm dừng và mức thoái lui', 'Breakouts, stops and retracements') },
          { id: 'l1-06', no: 6, title: v('Đường trung bình động', 'Moving averages') },
          { id: 'l1-07', no: 7, title: v('Mẫu hình trên biểu đồ thanh', 'Bar chart patterns') },
          { id: 'l1-08', no: 8, title: v('Mẫu hình ngắn hạn', 'Short-term patterns') },
          { id: 'l1-09', no: 9, title: v('Xác nhận: khối lượng và chỉ báo', 'Confirmation') },
          { id: 'l1-10', no: 10, title: v('Nền tảng biểu đồ nến Nhật', 'Candlestick charting essentials') },
          { id: 'l1-11', no: 11, title: v('Biểu đồ Point & Figure', 'Point-and-figure charting') }] },
      { title: v('Khái niệm nâng cao về biểu đồ và xu hướng', 'Advanced concepts in charting and trend analysis'),
        goal: v('Sóng Elliott, đo lường sức mạnh thị trường (độ rộng) và lý thuyết chu kỳ.', 'Elliott waves, market strength (breadth) and cycle theory.'),
        lessons: [
          { id: 'l1-12', no: 12, title: v('Nhập môn Nguyên lý Sóng', 'Introduction to the Wave Principle') },
          { id: 'l1-13', no: 13, title: v('Giải phẫu giao dịch theo sóng Elliott', 'The anatomy of Elliott wave trading') },
          { id: 'l1-14', no: 14, title: v('Đo lường sức mạnh thị trường', 'Measuring market strength') },
          { id: 'l1-15', no: 15, title: v('Nền tảng lý thuyết chu kỳ', 'Foundations of cycle theory') },
          { id: 'l1-16', no: 16, title: v('Cơ bản về phân tích chu kỳ', 'Basics of cycle analysis') }] },
      { title: v('Thị trường và biến động', 'Markets and volatility'),
        goal: v('Đặc điểm từng loại thị trường, dữ liệu, công cụ phái sinh và biến động ngụ ý.', 'Market types, data, derivatives and implied volatility.'),
        lessons: [
          { id: 'l1-17', no: 17, title: v('Thị trường, công cụ, dữ liệu và nhà PTKT', 'Markets, instruments, data and the analyst') },
          { id: 'l1-18', no: 18, title: v('Cổ phiếu', 'Equities') },
          { id: 'l1-19', no: 19, title: v('Chỉ số', 'Indexes') },
          { id: 'l1-20', no: 20, title: v('Thu nhập cố định / Trái phiếu', 'Fixed income / bonds') },
          { id: 'l1-21', no: 21, title: v('Hợp đồng tương lai', 'Futures') },
          { id: 'l1-22', no: 22, title: v('Sản phẩm giao dịch trên sàn (ETP)', 'Exchange-traded products') },
          { id: 'l1-23', no: 23, title: v('Ngoại hối', 'Foreign exchange') },
          { id: 'l1-24', no: 24, title: v('Quyền chọn', 'Options') },
          { id: 'l1-25', no: 25, title: v('Hiểu về biến động ngụ ý', 'Understanding implied volatility') },
          { id: 'l1-26', no: 26, title: v('Chỉ số VIX', 'The VIX index') }] },
      { title: v('Tài chính hành vi và các lý thuyết động lực thị trường', 'Behavioural finance and theories of market dynamics'),
        goal: v('Thị trường hiệu quả hay không? Vì sao PTKT có thể hoạt động; đo lường tâm lý thị trường.', 'Are markets efficient? Why TA can work; measuring sentiment.'),
        lessons: [
          { id: 'l1-27', no: 27, title: v('Giả thuyết Thị trường Hiệu quả là gì?', 'What is the Efficient Market Hypothesis?') },
          { id: 'l1-28', no: 28, title: v('EMH và "mô hình thị trường"', 'The EMH and the "market model"') },
          { id: 'l1-29', no: 29, title: v('Tiền thân của tài chính hành vi', 'Forerunners of behavioural finance') },
          { id: 'l1-30', no: 30, title: v('Nhà giao dịch nhiễu và luật một giá', 'Noise traders and the law of one price') },
          { id: 'l1-31', no: 31, title: v('Nhà giao dịch nhiễu với vai trò nhà PTKT', 'Noise traders as technical traders') },
          { id: 'l1-32', no: 32, title: v('Các tiếp cận học thuật về PTKT', 'Academic approaches to TA') },
          { id: 'l1-33', no: 33, title: v('Tâm lý thị trường và PTKT', 'Market sentiment and TA') },
          { id: 'l1-34', no: 34, title: v('Đo tâm lý từ dữ liệu thị trường', 'Sentiment from market data') },
          { id: 'l1-35', no: 35, title: v('Đo tâm lý từ dữ liệu bên ngoài', 'Sentiment from external data') }] },
      { title: v('Thống kê cơ bản cho nhà PTKT', 'Basic statistics for the technical analyst'),
        goal: v('Ngôn ngữ định lượng: thống kê mô tả và xác suất.', 'The quantitative language: descriptive statistics and probability.'),
        lessons: [
          { id: 'l1-36', no: 36, title: v('Nhập môn thống kê mô tả', 'Introduction to descriptive statistics') },
          { id: 'l1-37', no: 37, title: v('Nhập môn xác suất', 'Introduction to probability') }] },
      { title: v('Góc nhìn về hệ thống giao dịch kỹ thuật', 'Perspectives on technical trading systems'),
        goal: v('Quy tắc khách quan, đánh giá hệ thống, xây dựng mô hình và sức mạnh tương đối.', 'Objective rules, system evaluation, model building and relative strength.'),
        lessons: [
          { id: 'l1-38', no: 38, title: v('Quy tắc khách quan và cách đánh giá', 'Objective rules and their evaluation') },
          { id: 'l1-39', no: 39, title: v('Đúng hay kiếm được tiền?', 'Being right or making money') },
          { id: 'l1-40', no: 40, title: v('Quy trình xây dựng mô hình', 'The model-building process') },
          { id: 'l1-41', no: 41, title: v('Sức mạnh tương đối làm tiêu chí chọn đầu tư', 'Relative strength for investment selection') }] }
    ]
  };

  /* ================= FIGURES ================= */
  const fig = {
    trends: (lang) => {
      const t = lang === 'en' ? ['Uptrend', 'Downtrend', 'Sideways (trading range)'] : ['Xu hướng tăng', 'Xu hướng giảm', 'Đi ngang (vùng giao dịch)'];
      return F.row(
        F.line({ w: 320, h: 210, series: [{ pts: [[0, 12], [15, 40], [26, 26], [44, 60], [55, 46], [72, 80], [82, 66], [100, 94]] }], labels: [[15, 40, 'H', 't'], [26, 26, 'L', 'b'], [44, 60, 'HH', 't'], [55, 46, 'HL', 'b'], [72, 80, 'HH', 't'], [82, 66, 'HL', 'b']], caption: t[0] }),
        F.line({ w: 320, h: 210, series: [{ pts: [[0, 88], [15, 60], [26, 74], [44, 40], [55, 54], [72, 20], [82, 34], [100, 6]] }], labels: [[15, 60, 'L', 'b'], [26, 74, 'H', 't'], [44, 40, 'LL', 'b'], [55, 54, 'LH', 't'], [72, 20, 'LL', 'b'], [82, 34, 'LH', 't']], caption: t[1] }),
        F.line({ w: 320, h: 210, hl: [[74, 's-res'], [28, 's-sup']], series: [{ pts: [[0, 50], [13, 72], [26, 30], [41, 71], [55, 31], [70, 73], [85, 29], [100, 52]] }], labels: [[13, 72, 'H', 't'], [26, 30, 'L', 'b'], [41, 71, 'H', 't'], [55, 31, 'L', 'b']], caption: t[2] }));
    },
    nested: (lang) => F.line({
      h: 280, series: [{ pts: [[0, 8], [100, 82]], cls: 's-trend' }, { pts: [[0, 10], [7, 22], [10, 17], [15, 30], [18, 26], [24, 42], [31, 27], [34, 33], [37, 29], [43, 52], [47, 46], [53, 61], [61, 43], [64, 49], [67, 45], [74, 68], [78, 62], [84, 79], [91, 63], [95, 70], [100, 90]] }],
      labels: [[31, 27, lang === 'en' ? 'Secondary' : 'Điều chỉnh cấp 2', 'b'], [61, 43, lang === 'en' ? 'Secondary' : 'Điều chỉnh cấp 2', 'b'], [91, 63, lang === 'en' ? 'Secondary' : 'Điều chỉnh cấp 2', 'b'], [10, 17, lang === 'en' ? 'minor' : 'cấp 3', 'b'], [47, 46, lang === 'en' ? 'minor' : 'cấp 3', 'r']],
      caption: lang === 'en' ? 'Trends of different degree: the dashed line is the primary trend; corrections and ripples live inside it' : 'Xu hướng nhiều cấp: đường nét đứt là xu hướng cấp 1; các nhịp điều chỉnh (cấp 2) và dao động nhỏ (cấp 3) nằm bên trong'
    }),
    dowBull: (lang) => F.line({
      h: 270, zones: lang === 'en' ? [[0, 24, 'Accumulation', 'z-a'], [24, 66, 'Public participation', 'z-b'], [66, 100, 'Excess / distribution', 'z-c']] : [[0, 24, 'Tích lũy', 'z-a'], [24, 66, 'Công chúng tham gia', 'z-b'], [66, 100, 'Hưng phấn / Phân phối', 'z-c']],
      series: [{ pts: [[0, 22], [5, 10], [10, 18], [15, 9], [20, 20], [24, 16], [33, 38], [37, 32], [46, 56], [50, 50], [59, 72], [63, 66], [71, 84], [75, 78], [81, 92], [86, 82], [91, 90], [96, 79], [100, 84]] }],
      caption: lang === 'en' ? 'The three phases of a primary bull market' : 'Ba giai đoạn của thị trường giá lên cấp 1'
    }),
    dowBear: (lang) => F.line({
      h: 270, zones: lang === 'en' ? [[0, 24, 'Distribution', 'z-c'], [24, 66, 'Panic', 'z-a'], [66, 100, 'Discouraged selling', 'z-b']] : [[0, 24, 'Phân phối', 'z-c'], [24, 66, 'Hoảng loạn', 'z-a'], [66, 100, 'Bán tháo chán nản', 'z-b']],
      series: [{ pts: [[0, 78], [5, 90], [10, 82], [15, 91], [20, 80], [24, 84], [32, 60], [36, 66], [44, 38], [48, 45], [56, 22], [60, 28], [70, 16], [74, 22], [81, 10], [86, 17], [92, 8], [96, 14], [100, 9]] }],
      caption: lang === 'en' ? 'The three phases of a primary bear market' : 'Ba giai đoạn của thị trường giá xuống cấp 1'
    }),
    dowSignals: (lang) => F.row(
      F.line({ w: 360, h: 230, hl: [[44, 's-sup', 'B']], series: [{ pts: [[0, 18], [28, 74], [46, 44], [64, 62], [82, 36], [100, 26]] }], labels: [[28, 74, 'A', 't'], [46, 44, 'B', 'b'], [64, 62, lang === 'en' ? 'C < A' : 'C thấp hơn A', 't'], [82, 36, lang === 'en' ? 'sell' : 'bán', 'b']], caption: lang === 'en' ? 'Failure swing: the rally C fails below A; breaking B confirms the reversal' : 'Failure swing: nhịp hồi C không vượt được A; thủng B xác nhận đảo chiều' }),
      F.line({ w: 360, h: 230, hl: [[40, 's-sup', 'B']], series: [{ pts: [[0, 18], [24, 62], [42, 40], [60, 76], [80, 34], [100, 24]] }], labels: [[24, 62, 'A', 't'], [42, 40, 'B', 'b'], [60, 76, lang === 'en' ? 'C > A' : 'C cao hơn A', 't'], [80, 34, lang === 'en' ? 'sell' : 'bán', 'b']], caption: lang === 'en' ? 'Non-failure swing: C makes a new high, but the decline still breaks B' : 'Non-failure swing: C tạo đỉnh mới nhưng nhịp giảm sau đó vẫn thủng B' })),
    confirm: (lang) => F.line({
      h: 250, series: [{ pts: [[0, 30], [20, 56], [36, 42], [60, 78], [76, 62], [100, 86]] }, { pts: [[0, 22], [20, 48], [36, 34], [60, 46], [76, 30], [100, 38]], cls: 's-price2' }],
      labels: [[60, 78, lang === 'en' ? 'Industrials: new high' : 'Chỉ số Công nghiệp: đỉnh mới', 't'], [60, 46, lang === 'en' ? 'Transports: no new high → non-confirmation' : 'Chỉ số Vận tải: không vượt đỉnh → phân kỳ', 'b']],
      caption: lang === 'en' ? 'Non-confirmation: one average makes a new high, the other does not' : 'Không xác nhận (phân kỳ): một chỉ số tạo đỉnh mới, chỉ số kia không theo'
    }),
    anatomy: (lang) => {
      const T = (vi, en) => (lang === 'en' ? en : vi);
      return `<figure class="schem-fig"><svg viewBox="0 0 640 260" class="schem cfig">
        <line x1="110" y1="30" x2="110" y2="220" class="a-wick"/><line x1="86" y1="170" x2="110" y2="170" class="a-wick"/><line x1="110" y1="80" x2="134" y2="80" class="a-wick"/>
        <text x="122" y="34" class="s-label">${T('Cao', 'High')}</text><text x="122" y="224" class="s-label">${T('Thấp', 'Low')}</text>
        <text x="80" y="174" text-anchor="end" class="s-label">${T('Mở', 'Open')}</text><text x="140" y="84" class="s-label">${T('Đóng', 'Close')}</text>
        <text x="110" y="250" text-anchor="middle" class="s-phase">Bar (OHLC)</text>
        <line x1="330" y1="30" x2="330" y2="220" class="a-wick"/><rect x="310" y="80" width="40" height="90" class="a-up"/>
        <text x="356" y="84" class="s-label">${T('Đóng', 'Close')}</text><text x="356" y="174" class="s-label">${T('Mở', 'Open')}</text>
        <text x="300" y="56" text-anchor="end" class="s-small">${T('Bóng trên', 'Upper shadow')}</text><text x="300" y="200" text-anchor="end" class="s-small">${T('Bóng dưới', 'Lower shadow')}</text>
        <text x="330" y="250" text-anchor="middle" class="s-phase">${T('Nến tăng', 'Bullish candle')}</text>
        <line x1="530" y1="30" x2="530" y2="220" class="a-wick"/><rect x="510" y="80" width="40" height="90" class="a-dn"/>
        <text x="556" y="84" class="s-label">${T('Mở', 'Open')}</text><text x="556" y="174" class="s-label">${T('Đóng', 'Close')}</text>
        <text x="500" y="128" text-anchor="end" class="s-small">${T('Thân nến', 'Real body')}</text>
        <text x="530" y="250" text-anchor="middle" class="s-phase">${T('Nến giảm', 'Bearish candle')}</text></svg>
        <figcaption>${T('Cấu tạo thanh OHLC và nến Nhật: cùng 4 mức giá, khác cách thể hiện', 'Anatomy of an OHLC bar and candlesticks: the same four prices, displayed differently')}</figcaption></figure>`;
    },
    scales: (lang) => {
      const pts = [], ptsLog = [];
      for (let k = 0; k <= 40; k++) { const x = k * 2.5, val = Math.pow(2, x / 12.5); pts.push([x, val / 256 * 96 + 2]); ptsLog.push([x, Math.log2(val) / 8 * 96 + 2]); }
      return F.row(
        F.line({ w: 360, h: 230, series: [{ pts }], labels: [[37.5, 8 / 256 * 96 + 2, lang === 'en' ? '+100%' : '+100%', 't'], [87.5, 128 / 256 * 96 + 2, '+100%', 'l']], caption: lang === 'en' ? 'Arithmetic scale: steady growth looks like an accelerating curve' : 'Thang số học: tăng trưởng đều theo % trông như đường cong tăng tốc' }),
        F.line({ w: 360, h: 230, series: [{ pts: ptsLog }], labels: [[37.5, 3 / 8 * 96 + 2, '+100%', 't'], [87.5, 7 / 8 * 96 + 2, '+100%', 'l']], caption: lang === 'en' ? 'Log scale: the same data is a straight line — each doubling takes the same height' : 'Thang logarit: cùng dữ liệu là đường thẳng — mỗi lần tăng gấp đôi chiếm cùng một chiều cao' }));
    }
  };

  /* ================= LESSON 1 ================= */
  C.lessons['l1-01'] = {
    vi: {
      goals: ['Định nghĩa phân tích kỹ thuật và đối tượng nghiên cứu của nó.', 'Giải thích vì sao "xu hướng" là khái niệm trung tâm.', 'Nhận diện xu hướng tăng, giảm, đi ngang bằng cấu trúc đỉnh – đáy.', 'Hiểu khái niệm xu hướng nhiều cấp theo khung thời gian.', 'Trình bày các giả định nền tảng, ưu điểm và giới hạn của PTKT.', 'Liên hệ PTKT với quản trị rủi ro và quản lý vốn.'],
      body: () => `
<h3>1. Phân tích kỹ thuật là gì?</h3>
<p><b>Phân tích kỹ thuật (PTKT)</b> là việc nghiên cứu <b>hành vi của thị trường</b>, chủ yếu qua <b>giá</b>, kết hợp <b>khối lượng</b>, <b>thời gian</b> và các dữ liệu tâm lý, nhằm đưa ra quyết định mua, bán hoặc đứng ngoài. Nhà PTKT không hỏi "tài sản này đáng giá bao nhiêu?" mà hỏi: <i>"Giá đang làm gì, và nhiều khả năng sẽ làm gì tiếp theo?"</i></p>
<p>Giá thị trường là điểm cân bằng tức thời giữa người mua và người bán. Nó tổng hợp mọi kỳ vọng, nỗi sợ, lòng tham, thông tin công khai lẫn hiểu biết của người trong cuộc. Vì vậy, nghiên cứu giá là nghiên cứu <b>kết quả cuối cùng</b> của mọi yếu tố tác động lên thị trường.</p>

<h3>2. Mục tiêu thực tế: kiếm lời và không bị loại khỏi cuộc chơi</h3>
<p>Mọi vị thế đều gồm hai quyết định: <b>khi nào vào</b> và <b>khi nào ra</b>. Quyết định "ra" lại có hai nhánh:</p>
<ul><li><b>Ra khi có lãi</b>: khi giá đi đúng hướng và xu hướng có dấu hiệu kết thúc.</li>
<li><b>Ra khi thua lỗ</b>: khi giá đi ngược kỳ vọng, chứng tỏ phân tích sai.</li></ul>
<p>Ưu thế lớn nhất của PTKT là: vì làm việc trực tiếp với giá, ta <b>xác định được trước</b> mức giá mà tại đó nhận định của mình bị chứng minh là sai. Rủi ro vì thế được <b>định lượng ngay khi vào lệnh</b>, và từ đó áp dụng được quản lý vốn. Ít phương pháp đầu tư nào khác làm được điều này rõ ràng như vậy.</p>
<div class="callout"><b>Ba nguyên tắc chiến lược</b>
<ol><li><b>Đi theo xu hướng</b>: "xu hướng là bạn".</li>
<li><b>Không để lỗ lớn</b>: kiểm soát rủi ro của từng vị thế.</li>
<li><b>Quản lý tiền</b>: tránh "phá sản tài khoản" (risk of ruin), tức là mất nhiều vốn đến mức không thể phục hồi.</li></ol></div>
<p>Tóm lại, PTKT trả lời bốn câu hỏi: <b>xu hướng là gì → khi nào nó thay đổi → vào ở đâu → ra ở đâu</b> (cả khi đúng lẫn khi sai).</p>

<h3>3. Xu hướng là gì?</h3>
<p>Giá không đi theo đường thẳng mà đi theo các <b>nhịp sóng</b>, tạo thành chuỗi <b>đỉnh (peak)</b> và <b>đáy (trough)</b>. Xu hướng được định nghĩa bằng mối quan hệ giữa các đỉnh và đáy liên tiếp:</p>
<ul><li><b>Xu hướng tăng (uptrend)</b>: đỉnh sau <b>cao hơn</b> đỉnh trước <i>và</i> đáy sau <b>cao hơn</b> đáy trước (HH – HL).</li>
<li><b>Xu hướng giảm (downtrend)</b>: đỉnh sau <b>thấp hơn</b> <i>và</i> đáy sau <b>thấp hơn</b> (LH – LL).</li>
<li><b>Đi ngang (sideways / trading range)</b>: giá dao động trong một vùng, đỉnh và đáy không có hướng rõ ràng.</li></ul>
${fig.trends('vi')}
<p>Lưu ý quan trọng: xu hướng chỉ <b>rõ ràng khi nhìn lại</b>. Tại thời điểm hiện tại, ta chỉ thấy xu hướng <i>đã</i> hình thành. Mục tiêu của nhà PTKT không phải mua đúng đáy, bán đúng đỉnh, mà là <b>nhận ra xu hướng đủ sớm</b> để ăn được phần thân của nó, và <b>nhận ra sự thay đổi xu hướng đủ sớm</b> để bảo vệ lợi nhuận.</p>
<p>Thực tế, thị trường đi ngang trong một tỷ lệ thời gian đáng kể. Các phương pháp theo xu hướng hoạt động kém trong giai đoạn đi ngang, ngược lại các phương pháp giao dịch trong biên (mua gần hỗ trợ, bán gần kháng cự) lại phù hợp. Nhận biết đúng <b>trạng thái</b> của thị trường là bước đầu tiên.</p>

<h3>4. Xu hướng nhiều cấp và khung thời gian</h3>
<p>Một biểu đồ luôn chứa nhiều xu hướng lồng vào nhau. Xu hướng <b>dài hạn</b> (nhiều tháng đến nhiều năm) chứa các nhịp điều chỉnh <b>trung hạn</b> (vài tuần đến vài tháng), và bên trong đó lại là các dao động <b>ngắn hạn</b> (vài ngày). Ở khung nhỏ hơn nữa là các dao động trong phiên.</p>
${fig.nested('vi')}
<ul><li>Không có "xu hướng đúng" duy nhất. Xu hướng chỉ có nghĩa khi gắn với <b>khung thời gian</b> mà bạn giao dịch.</li>
<li>Xu hướng ở khung lớn thường chi phối khung nhỏ. Giao dịch <b>thuận</b> xu hướng lớn có xác suất cao hơn giao dịch ngược.</li>
<li>Nhà đầu tư dài hạn có thể bỏ qua các dao động ngắn hạn. Ngược lại, người giao dịch ngắn hạn phải tôn trọng khung lớn để không đi ngược dòng chảy chính.</li></ul>
${C.demoHtml.trendSwings()}

<h3>5. Các giả định nền tảng của PTKT</h3>
<ol><li><b>Giá được quyết định bởi cung và cầu.</b> Mọi yếu tố (kinh tế, tin tức, cảm xúc) chỉ tác động lên giá thông qua hành động mua, bán thực sự.</li>
<li><b>Giá phản ánh (chiết khấu) thông tin.</b> Những gì quan trọng phần lớn đã được phản ánh vào giá, kể cả kỳ vọng.</li>
<li><b>Giá vận động theo xu hướng, và xu hướng có quán tính.</b> Một xu hướng đã hình thành có xác suất tiếp diễn cao hơn là đảo chiều đột ngột.</li>
<li><b>Hành vi con người lặp lại.</b> Sợ hãi và tham lam tạo ra những mẫu hình giá tương tự nhau qua nhiều thế hệ và nhiều thị trường.</li>
<li><b>Thị trường không hoàn toàn hiệu quả.</b> Thông tin lan truyền không tức thời, con người phản ứng thái quá hoặc chậm trễ. Chính điều này tạo ra xu hướng và cơ hội.</li></ol>
<p>Giả định 5 mâu thuẫn trực tiếp với <b>Giả thuyết Thị trường Hiệu quả (EMH)</b> và thuyết <b>bước ngẫu nhiên</b>. Theo các thuyết này, giá đã phản ánh tức thời mọi thông tin nên không thể dự báo từ lịch sử giá. Cuộc tranh luận này, cùng các bằng chứng từ <b>tài chính hành vi</b>, sẽ được học kỹ ở Phần V.</p>

<h3>6. PTKT và phân tích cơ bản</h3>
<table class="tbl"><thead><tr><th></th><th>Phân tích cơ bản</th><th>Phân tích kỹ thuật</th></tr></thead><tbody>
<tr><td>Câu hỏi chính</td><td>Tài sản <b>đáng giá</b> bao nhiêu? Vì sao?</td><td>Giá <b>đang làm gì</b>? Khi nào hành động?</td></tr>
<tr><td>Dữ liệu</td><td>Báo cáo tài chính, kinh tế vĩ mô, ngành</td><td>Giá, khối lượng, thời gian, tâm lý</td></tr>
<tr><td>Thế mạnh</td><td>Đánh giá giá trị dài hạn</td><td>Thời điểm, quản trị rủi ro, áp dụng cho mọi thị trường</td></tr>
<tr><td>Điểm yếu</td><td>Giá có thể lệch xa giá trị trong thời gian dài; thông tin đến chậm</td><td>Tín hiệu sai, đặc biệt trong thị trường đi ngang; dễ chủ quan</td></tr></tbody></table>
<p>Hai trường phái không loại trừ nhau. Nhiều nhà đầu tư dùng phân tích cơ bản để chọn <i>cái gì</i>, và dùng PTKT để quyết định <i>khi nào</i>. Riêng nhà PTKT thuần tuý lập luận rằng nếu giá đã phản ánh thông tin thì đọc giá là đủ.</p>

<h3>7. Giới hạn cần nhớ</h3>
<ul><li>Chỉ báo và mẫu hình <b>không phải quả cầu pha lê</b>. Chúng nói về xác suất, không phải sự chắc chắn.</li>
<li>Xu hướng có thể đổi hướng <b>đột ngột, không báo trước</b>, ví dụ do tin bất ngờ hay biến cố. Vì vậy cắt lỗ là bắt buộc.</li>
<li>Diễn giải biểu đồ dễ bị <b>chủ quan</b>. Các Phần sau sẽ hướng tới quy tắc khách quan và kiểm định thống kê.</li></ul>`,
      keys: ['PTKT nghiên cứu hành vi giá (cùng khối lượng, thời gian, tâm lý) để ra quyết định hành động.', 'Mọi vị thế có hai quyết định: vào và ra; "ra" gồm ra khi đúng và ra khi sai.', 'Ưu thế cốt lõi: xác định trước điểm sai → định lượng rủi ro → quản lý vốn, tránh phá sản tài khoản.', 'Uptrend = HH + HL; downtrend = LH + LL; còn lại là đi ngang.', 'Xu hướng luôn gắn với khung thời gian; xu hướng nhiều cấp lồng vào nhau, khung lớn chi phối khung nhỏ.', 'Các giả định: cung–cầu quyết định giá, giá phản ánh thông tin, xu hướng có quán tính, hành vi lặp lại, thị trường không hoàn toàn hiệu quả.'],
      terms: [['Trend', 'Xu hướng: hướng vận động chủ đạo của giá qua chuỗi đỉnh – đáy'], ['Peak / Trough', 'Đỉnh / Đáy của một nhịp sóng'], ['HH, HL, LH, LL', 'Đỉnh cao hơn, đáy cao hơn, đỉnh thấp hơn, đáy thấp hơn'], ['Trading range', 'Vùng giao dịch đi ngang'], ['Risk of ruin', 'Rủi ro mất vốn đến mức không thể tiếp tục giao dịch'], ['Time horizon', 'Khung thời gian đầu tư / giao dịch'], ['EMH', 'Giả thuyết Thị trường Hiệu quả'], ['Random walk', 'Bước ngẫu nhiên: giá thay đổi không dự báo được']],
      quiz: [
        { q: 'Xu hướng tăng được định nghĩa chuẩn xác nhất là:', o: ['Giá đóng cửa hôm nay cao hơn hôm qua', 'Chuỗi đỉnh sau cao hơn đỉnh trước và đáy sau cao hơn đáy trước', 'Giá nằm trên đường trung bình 200 phiên', 'Khối lượng tăng liên tục'], a: 1, e: 'Xu hướng được định nghĩa bằng cấu trúc đỉnh – đáy (HH + HL). Các tiêu chí khác chỉ là công cụ hỗ trợ.' },
        { q: 'Ưu thế quan trọng nhất của PTKT trong quản trị rủi ro là gì?', o: ['Dự báo chính xác đỉnh và đáy', 'Xác định trước mức giá mà tại đó nhận định bị chứng minh là sai', 'Không bao giờ cần cắt lỗ', 'Loại bỏ hoàn toàn rủi ro'], a: 1, e: 'Vì làm việc trực tiếp với giá, ta biết trước điểm sai, nên định lượng được rủi ro và áp dụng quản lý vốn.' },
        { q: 'Nếu đỉnh sau thấp hơn đỉnh trước nhưng đáy sau cao hơn đáy trước, thị trường đang:', o: ['Xu hướng tăng', 'Xu hướng giảm', 'Không có xu hướng rõ ràng / tích luỹ thu hẹp', 'Chắc chắn sắp tăng mạnh'], a: 2, e: 'Đỉnh và đáy không cùng chiều nên không thoả định nghĩa tăng hay giảm. Đây là trạng thái đi ngang/thu hẹp, cần thêm bằng chứng.' },
        { q: 'Câu nào phản ánh đúng khái niệm xu hướng nhiều cấp?', o: ['Mỗi thị trường chỉ có một xu hướng', 'Xu hướng ngắn hạn luôn cùng chiều xu hướng dài hạn', 'Xu hướng dài hạn chứa các nhịp điều chỉnh trung hạn và dao động ngắn hạn bên trong', 'Khung thời gian không ảnh hưởng đến việc xác định xu hướng'], a: 2, e: 'Các xu hướng lồng vào nhau. Xu hướng ngắn hạn có thể ngược chiều xu hướng dài hạn trong các nhịp điều chỉnh.' },
        { q: '"Risk of ruin" là gì?', o: ['Rủi ro thị trường đóng cửa', 'Rủi ro mất vốn tới mức không thể tiếp tục giao dịch', 'Rủi ro trượt giá', 'Rủi ro lạm phát'], a: 1, e: 'Mục tiêu số một của quản lý vốn là không bao giờ để tài khoản bị tổn thất đến mức không thể phục hồi.' },
        { q: 'Giả định nào của PTKT trực tiếp mâu thuẫn với Giả thuyết Thị trường Hiệu quả?', o: ['Giá do cung cầu quyết định', 'Thị trường không hoàn toàn hiệu quả nên lịch sử giá có giá trị dự báo', 'Giá đóng cửa quan trọng', 'Biểu đồ có trục thời gian'], a: 1, e: 'EMH cho rằng giá phản ánh tức thời mọi thông tin nên lịch sử giá không giúp dự báo. PTKT giả định điều ngược lại.' },
        { q: 'Trong giai đoạn thị trường đi ngang, điều gì thường xảy ra với hệ thống theo xu hướng?', o: ['Hoạt động tốt nhất', 'Phát sinh nhiều tín hiệu sai (whipsaw)', 'Không tạo tín hiệu nào', 'Luôn có lãi'], a: 1, e: 'Không có xu hướng thì tín hiệu phá vỡ thường thất bại. Đây là lý do cần nhận diện trạng thái thị trường trước.' },
        { q: 'Mối quan hệ hợp lý giữa phân tích cơ bản và PTKT là:', o: ['Loại trừ hoàn toàn nhau', 'Cơ bản trả lời "cái gì/vì sao", kỹ thuật trả lời "khi nào" — có thể kết hợp', 'PTKT chỉ dùng cho tiền điện tử', 'Phân tích cơ bản cho biết điểm cắt lỗ chính xác'], a: 1, e: 'Hai trường phái bổ trợ nhau. Nhiều nhà đầu tư chọn tài sản bằng cơ bản và chọn thời điểm bằng kỹ thuật.' }
      ]
    },
    en: {
      goals: ['Define technical analysis and what it studies.', 'Explain why the trend is the central concept.', 'Identify up, down and sideways trends from peaks and troughs.', 'Understand trends of different degree and time horizon.', 'Present TA’s assumptions, strengths and limits.', 'Link TA with risk control and money management.'],
      body: () => `
<h3>1. What is technical analysis?</h3><p><b>Technical analysis</b> studies <b>market behaviour</b> — mainly <b>price</b>, together with <b>volume</b>, <b>time</b> and sentiment — to decide whether to buy, sell or stand aside. The technician asks not "what is it worth?" but <i>"what is price doing, and what is it likely to do next?"</i> Price is the momentary balance of buyers and sellers, the net result of every expectation, fear and piece of information.</p>
<h3>2. The practical goal</h3><p>Every position involves two decisions: <b>entry</b> and <b>exit</b> — exit with a profit when the trend ends, or with a loss when the analysis proves wrong. Because TA works directly with price, the level at which you are wrong can be <b>defined in advance</b>; risk is quantified at entry and money management becomes possible.</p>
<div class="callout"><b>Three strategic principles</b><ol><li><b>Play the trend.</b></li><li><b>Don’t lose big</b> — control the risk of each position.</li><li><b>Manage your money</b> — avoid the risk of ruin.</li></ol></div>
<h3>3. What is a trend?</h3><ul><li><b>Uptrend</b>: higher highs <i>and</i> higher lows.</li><li><b>Downtrend</b>: lower highs <i>and</i> lower lows.</li><li><b>Sideways</b>: price oscillates in a range without direction.</li></ul>
${fig.trends('en')}
<p>Trends are clear only in hindsight. The aim is to recognise a trend early enough to capture its body, and to recognise its change early enough to protect profits. Markets spend much time going sideways, where trend-following struggles and range tactics fit better.</p>
<h3>4. Trends of different degree</h3><p>Long-term trends contain intermediate corrections, which contain short-term swings. A trend only has meaning relative to your <b>time horizon</b>; the larger trend usually dominates the smaller one.</p>
${fig.nested('en')}${C.demoHtml.trendSwings()}
<h3>5. Basic assumptions</h3><ol><li>Prices are determined by supply and demand.</li><li>Prices discount information.</li><li>Prices trend, and trends tend to persist.</li><li>Human behaviour repeats, so patterns recur.</li><li>Markets are not perfectly efficient.</li></ol><p>Assumption 5 conflicts with the <b>Efficient Market Hypothesis</b> and the <b>random walk</b>; Part V covers this debate and behavioural finance.</p>
<h3>6. Technical vs fundamental analysis</h3><table class="tbl"><thead><tr><th></th><th>Fundamental</th><th>Technical</th></tr></thead><tbody><tr><td>Question</td><td>What is it worth, and why?</td><td>What is price doing; when to act?</td></tr><tr><td>Data</td><td>Financials, economy, industry</td><td>Price, volume, time, sentiment</td></tr><tr><td>Strength</td><td>Long-term value</td><td>Timing, risk control, any market</td></tr><tr><td>Weakness</td><td>Price can diverge from value for long</td><td>False signals, subjectivity</td></tr></tbody></table>
<h3>7. Limits</h3><ul><li>Indicators speak in probabilities, not certainties.</li><li>Trends can reverse suddenly — stops are mandatory.</li><li>Interpretation can be subjective; later Parts move toward objective, testable rules.</li></ul>`,
      keys: ['TA studies price behaviour (with volume, time, sentiment) to make decisions.', 'Every position has an entry and an exit — for being right and for being wrong.', 'Core edge: a predefined point of being wrong → quantified risk → money management.', 'Uptrend = HH + HL; downtrend = LH + LL; otherwise sideways.', 'Trends are nested and tied to a time horizon; the larger trend dominates.', 'Assumptions: supply/demand, discounting, persistence, repetition, imperfect efficiency.'],
      terms: [['Trend', 'Prevailing direction defined by peaks and troughs'], ['HH, HL, LH, LL', 'Higher high, higher low, lower high, lower low'], ['Trading range', 'Sideways market'], ['Risk of ruin', 'Losing so much capital you cannot continue'], ['EMH', 'Efficient Market Hypothesis'], ['Random walk', 'Unpredictable price changes']],
      quiz: [
        { q: 'The most precise definition of an uptrend is:', o: ['Today’s close above yesterday’s', 'Successively higher highs and higher lows', 'Price above the 200-day average', 'Rising volume'], a: 1, e: 'Trends are defined by peaks and troughs; other criteria are supporting tools.' },
        { q: 'TA’s key advantage in risk control is:', o: ['Exact tops and bottoms', 'Knowing in advance the price at which you are wrong', 'Never needing stops', 'Eliminating risk'], a: 1, e: 'A predefined invalidation level quantifies risk at entry.' },
        { q: 'Lower high but higher low means:', o: ['Uptrend', 'Downtrend', 'No clear trend / contraction', 'A certain rally'], a: 2, e: 'Highs and lows disagree, so neither definition is met.' },
        { q: 'Which statement describes trends of different degree?', o: ['A market has one trend', 'Short-term always matches long-term', 'Long-term trends contain intermediate and short-term swings', 'Time horizon is irrelevant'], a: 2, e: 'Trends are nested; short-term moves can oppose the larger trend.' },
        { q: '"Risk of ruin" means:', o: ['Exchange closure', 'Losing so much you cannot continue', 'Slippage', 'Inflation'], a: 1, e: 'Survival is money management’s first goal.' },
        { q: 'Which TA assumption contradicts the EMH?', o: ['Supply and demand set prices', 'Markets are not perfectly efficient, so history has predictive value', 'Closes matter', 'Charts have a time axis'], a: 1, e: 'EMH says past prices cannot predict future prices.' },
        { q: 'In sideways markets trend systems typically:', o: ['Perform best', 'Suffer whipsaws', 'Give no signals', 'Always profit'], a: 1, e: 'Breakouts fail without a trend.' },
        { q: 'A sensible view of fundamental vs technical analysis:', o: ['Mutually exclusive', 'Fundamentals answer what/why, technicals answer when', 'TA is only for crypto', 'Fundamentals give exact stops'], a: 1, e: 'They are complementary.' }
      ]
    }
  };

  /* ================= LESSON 2 ================= */
  C.lessons['l1-02'] = {
    vi: {
      goals: ['Trình bày lịch sử hình thành Lý thuyết Dow.', 'Nêu và giải thích các nguyên lý cơ bản của Lý thuyết Dow.', 'Phân biệt ba loại xu hướng theo thời gian: cấp 1, cấp 2, cấp 3.', 'Mô tả ba giai đoạn của thị trường giá lên và giá xuống.', 'Giải thích khái niệm xác nhận (confirmation) giữa các chỉ số.', 'Nêu vai trò của khối lượng và các phê phán đối với Lý thuyết Dow.'],
      body: () => `
<h3>1. Lịch sử: từ những bài xã luận thành nền móng của PTKT</h3>
<p><b>Charles H. Dow (1851–1902)</b> là nhà báo tài chính, đồng sáng lập công ty Dow Jones (cùng Edward Jones) và là biên tập viên đầu tiên của tờ <i>The Wall Street Journal</i>. Ông tạo ra các <b>chỉ số bình quân</b> để đo "sức khoẻ" của thị trường: chỉ số Công nghiệp (Industrials) và chỉ số Đường sắt (Rails, sau này là Vận tải – Transportation).</p>
<p>Dow chưa từng viết một "lý thuyết" hoàn chỉnh. Các quan sát của ông nằm rải rác trong những bài xã luận. Người kế nhiệm <b>William P. Hamilton</b> đã phát triển và áp dụng chúng để dự báo thị trường suốt nhiều năm. Sau đó <b>Robert Rhea</b> hệ thống hoá thành các nguyên lý cụ thể. Cái tên "Lý thuyết Dow" do những người kế thừa đặt ra.</p>
<div class="callout">Ý tưởng cốt lõi của Dow: thị trường chứng khoán là <b>phong vũ biểu</b> của nền kinh tế. Giá cổ phiếu phản ánh kỳ vọng về hoạt động kinh doanh trong tương lai.</div>

<h3>2. Các nguyên lý cơ bản</h3>
<ol>
<li><b>Các chỉ số phản ánh tất cả.</b> Mọi thông tin đã biết hoặc có thể dự đoán, kể cả thiên tai bất ngờ một khi đã xảy ra, đều nhanh chóng được phản ánh vào giá của các chỉ số.</li>
<li><b>Thị trường có ba loại xu hướng</b>: cấp 1 (primary), cấp 2 (secondary) và cấp 3 (minor). Dow ví chúng như <i>thuỷ triều, sóng và gợn sóng</i>.</li>
<li><b>Xu hướng cấp 1 có ba giai đoạn</b>, phản ánh tâm lý của đám đông.</li>
<li><b>Các chỉ số phải xác nhận lẫn nhau.</b> Một tín hiệu chỉ đáng tin khi cả chỉ số Công nghiệp và Vận tải cùng đưa ra.</li>
<li><b>Khối lượng xác nhận xu hướng.</b> Khối lượng nên tăng theo hướng của xu hướng chính.</li>
<li><b>Xu hướng tiếp diễn cho đến khi có tín hiệu đảo chiều rõ ràng.</b></li>
</ol>
<p>Ngoài ra, Lý thuyết Dow còn có hai quy ước: chỉ dùng <b>giá đóng cửa</b>, và khái niệm <b>"đường ngang" (line)</b>. "Đường ngang" là giai đoạn giá đi ngang trong biên hẹp nhiều tuần, cho thấy tích lũy hoặc phân phối. Khi giá phá ra khỏi đường ngang, đó là tín hiệu về hướng tiếp theo.</p>

<h3>3. Ba loại xu hướng</h3>
<table class="tbl"><thead><tr><th>Loại</th><th>Thời gian điển hình</th><th>Đặc điểm</th><th>Ví von</th></tr></thead><tbody>
<tr><td><b>Cấp 1 (primary)</b></td><td>Khoảng 1 năm đến vài năm</td><td>Xu hướng lớn: thị trường giá lên (bull) hoặc giá xuống (bear). Mục tiêu chính của nhà đầu tư là xác định xu hướng này.</td><td>Thuỷ triều</td></tr>
<tr><td><b>Cấp 2 (secondary)</b></td><td>Vài tuần đến vài tháng</td><td>Nhịp điều chỉnh ngược xu hướng cấp 1, thường thoái lui khoảng <b>1/3 đến 2/3</b> nhịp tăng/giảm trước đó.</td><td>Sóng</td></tr>
<tr><td><b>Cấp 3 (minor)</b></td><td>Dưới khoảng 3 tuần</td><td>Dao động ngắn, nhiều "nhiễu", dễ bị tác động. Dow cho rằng ít có ý nghĩa dự báo.</td><td>Gợn sóng</td></tr></tbody></table>
${C.fig.line ? fig.nested('vi') : ''}

<h3>4. Ba giai đoạn của xu hướng cấp 1</h3>
<p><b>Thị trường giá lên</b>:</p>
<ol><li><b>Tích lũy (accumulation)</b>: tin tức còn xấu, đám đông bi quan. Nhà đầu tư hiểu biết âm thầm mua vào từ người bán chán nản.</li>
<li><b>Công chúng tham gia (public participation)</b>: kinh tế và lợi nhuận doanh nghiệp cải thiện, giá tăng ổn định. Nhà theo xu hướng vào cuộc, đây là giai đoạn dài nhất.</li>
<li><b>Hưng phấn / phân phối (excess)</b>: tin tức cực tốt, đám đông đổ xô mua, đầu cơ tràn lan. Nhà đầu tư hiểu biết bán ra.</li></ol>
${fig.dowBull('vi')}
<p><b>Thị trường giá xuống</b> đi theo trật tự ngược lại:</p>
<ol><li><b>Phân phối (distribution)</b>: người hiểu biết thoát hàng khi đám đông vẫn lạc quan.</li>
<li><b>Hoảng loạn (panic)</b>: người mua biến mất, người bán vội vã, giá rơi nhanh.</li>
<li><b>Bán tháo chán nản (discouraged selling)</b>: những người nắm giữ cuối cùng bỏ cuộc. Giá giảm chậm dần cho đến khi tin xấu không còn làm giá giảm thêm.</li></ol>
${fig.dowBear('vi')}
<div class="callout">Hãy liên hệ với <b>Wyckoff</b>: tích lũy → markup → phân phối → markdown. Hai trường phái mô tả cùng một chu kỳ tâm lý từ hai góc nhìn khác nhau.</div>

<h3>5. Xác định xu hướng và tín hiệu đảo chiều</h3>
<p>Dow định nghĩa xu hướng tăng là chuỗi <b>đỉnh và đáy cao dần</b>, xu hướng giảm là chuỗi <b>đỉnh và đáy thấp dần</b>. Xu hướng được giả định là <b>còn hiệu lực</b> cho đến khi có bằng chứng ngược lại. Tín hiệu đảo chiều từ tăng sang giảm có hai dạng:</p>
${fig.dowSignals('vi')}
<ul><li><b>Failure swing</b>: nhịp hồi (C) không vượt được đỉnh trước (A). Khi giá sau đó thủng đáy B, xu hướng tăng bị phá vỡ.</li>
<li><b>Non-failure swing</b>: nhịp hồi C có vượt A, nhưng nhịp giảm kế tiếp vẫn thủng đáy B. Đỉnh-đáy cao dần đã bị phá vỡ, nên đây vẫn là tín hiệu đảo chiều.</li></ul>
<p>Đảo chiều từ giảm sang tăng là hình ảnh đối xứng.</p>

<h3>6. Nguyên tắc xác nhận (confirmation)</h3>
<p>Theo Dow, nền kinh tế khoẻ mạnh khi doanh nghiệp vừa <b>sản xuất</b> (Công nghiệp) vừa <b>vận chuyển</b> hàng hoá (Vận tải). Vì thế một xu hướng tăng chỉ được xác nhận khi <b>cả hai chỉ số</b> cùng vượt đỉnh trước. Nếu một chỉ số tạo đỉnh mới mà chỉ số kia không theo, ta có hiện tượng <b>không xác nhận (non-confirmation)</b>. Đây là lời cảnh báo xu hướng đang yếu đi.</p>
${fig.confirm('vi')}
<p>Lý thuyết không quy định hai tín hiệu phải xảy ra cùng lúc. Khoảng cách thời gian càng ngắn thì tín hiệu càng mạnh. Ngày nay, nguyên tắc này được mở rộng thành <b>phân tích liên thị trường</b> (Level 2, 3): so sánh chỉ số chính với chỉ số ngành, chỉ số vốn hoá nhỏ, hoặc với độ rộng thị trường.</p>
${C.demoHtml.dowConfirm()}

<h3>7. Vai trò của khối lượng</h3>
<p>Trong xu hướng tăng, khối lượng nên <b>tăng khi giá tăng</b> và <b>giảm khi giá điều chỉnh</b>. Trong xu hướng giảm thì ngược lại. Tuy vậy, theo Dow, tín hiệu cuối cùng luôn đến từ <b>giá</b>. Khối lượng chỉ là bằng chứng phụ để xác nhận hoặc cảnh báo.</p>

<h3>8. Đánh giá và phê phán</h3>
<ul><li><b>Tín hiệu đến muộn</b>: phải chờ đỉnh/đáy được phá vỡ nên thường bỏ lỡ phần đầu và phần cuối của xu hướng.</li>
<li><b>Tính chủ quan</b>: thế nào là một nhịp cấp 2 "đủ lớn"? Các nhà phân tích có thể kết luận khác nhau.</li>
<li><b>Thay đổi cấu trúc kinh tế</b>: vai trò của ngành vận tải ngày nay khác thời Dow; thành phần các chỉ số cũng thay đổi theo thời gian.</li>
<li><b>Nhưng di sản là vô giá</b>: định nghĩa xu hướng bằng đỉnh-đáy, khái niệm xu hướng nhiều cấp, các giai đoạn tâm lý của thị trường, nguyên tắc xác nhận. Tất cả là nền móng cho Wyckoff, Elliott và gần như mọi phương pháp PTKT hiện đại.</li></ul>`,
      keys: ['Dow tạo chỉ số bình quân như phong vũ biểu kinh tế; Hamilton và Rhea hệ thống hoá thành lý thuyết.', 'Sáu nguyên lý: chỉ số phản ánh tất cả; ba loại xu hướng; ba giai đoạn; các chỉ số xác nhận nhau; khối lượng xác nhận; xu hướng tiếp diễn đến khi có tín hiệu đảo chiều.', 'Cấp 1: khoảng 1 đến vài năm; cấp 2: vài tuần đến vài tháng, thoái lui khoảng 1/3–2/3; cấp 3: dưới khoảng 3 tuần.', 'Giá lên: tích lũy → công chúng tham gia → hưng phấn. Giá xuống: phân phối → hoảng loạn → bán chán nản.', 'Non-confirmation (một chỉ số không xác nhận chỉ số kia) là cảnh báo xu hướng suy yếu.', 'Giá là tín hiệu chính, khối lượng là bằng chứng phụ; chỉ dùng giá đóng cửa.'],
      terms: [['Primary trend', 'Xu hướng cấp 1 (thuỷ triều)'], ['Secondary reaction', 'Nhịp điều chỉnh cấp 2 (sóng)'], ['Minor trend', 'Dao động cấp 3 (gợn sóng)'], ['Confirmation', 'Xác nhận: các chỉ số cùng đưa ra tín hiệu'], ['Non-confirmation', 'Không xác nhận / phân kỳ giữa các chỉ số'], ['Line', '"Đường ngang": giai đoạn đi ngang biên hẹp'], ['Failure swing', 'Nhịp hồi thất bại không vượt đỉnh trước'], ['Accumulation / Distribution', 'Tích lũy / Phân phối']],
      quiz: [
        { q: 'Theo Lý thuyết Dow, nhịp điều chỉnh cấp 2 thường thoái lui bao nhiêu so với nhịp trước đó?', o: ['Dưới 10%', 'Khoảng 1/3 đến 2/3', 'Luôn đúng 50%', 'Hơn 100%'], a: 1, e: 'Nhịp cấp 2 thường thoái lui khoảng 1/3 đến 2/3 nhịp của xu hướng cấp 1 trước đó, và kéo dài vài tuần đến vài tháng.' },
        { q: 'Giai đoạn đầu tiên của thị trường giá lên cấp 1 là:', o: ['Hưng phấn', 'Công chúng tham gia', 'Tích lũy', 'Hoảng loạn'], a: 2, e: 'Nhà đầu tư hiểu biết mua vào khi tin tức còn xấu: đó là giai đoạn tích lũy.' },
        { q: 'Chỉ số Công nghiệp tạo đỉnh mới nhưng chỉ số Vận tải không vượt đỉnh cũ. Theo Dow, đây là:', o: ['Tín hiệu mua mạnh', 'Hiện tượng không xác nhận — cảnh báo', 'Không có ý nghĩa', 'Tín hiệu bán khống ngay lập tức'], a: 1, e: 'Các chỉ số phải xác nhận nhau. Non-confirmation là lời cảnh báo, chưa phải tín hiệu đảo chiều hoàn chỉnh.' },
        { q: 'Theo Lý thuyết Dow, tín hiệu cuối cùng để xác định xu hướng đến từ:', o: ['Khối lượng', 'Tin tức kinh tế', 'Giá (đóng cửa) của các chỉ số', 'Ý kiến chuyên gia'], a: 2, e: 'Khối lượng chỉ là bằng chứng phụ. Tín hiệu quyết định là hành động giá, dựa trên giá đóng cửa.' },
        { q: '"Failure swing" ở đỉnh nghĩa là:', o: ['Nhịp hồi vượt đỉnh trước rồi tăng tiếp', 'Nhịp hồi không vượt được đỉnh trước, sau đó giá thủng đáy gần nhất', 'Giá đi ngang mãi', 'Khối lượng giảm'], a: 1, e: 'Đỉnh C thấp hơn đỉnh A, rồi thủng đáy B: cấu trúc đỉnh-đáy cao dần bị phá vỡ.' },
        { q: 'Dow ví ba loại xu hướng với:', o: ['Núi, đồi, gò', 'Thuỷ triều, sóng, gợn sóng', 'Năm, tháng, ngày', 'Rừng, cây, lá'], a: 1, e: 'Thuỷ triều (cấp 1), sóng (cấp 2), gợn sóng (cấp 3).' },
        { q: 'Phê phán phổ biến nhất về Lý thuyết Dow là:', o: ['Tín hiệu đến quá sớm', 'Tín hiệu thường đến muộn, bỏ lỡ phần đầu/cuối xu hướng', 'Không dùng giá đóng cửa', 'Chỉ dùng cho tiền tệ'], a: 1, e: 'Vì phải chờ đỉnh/đáy bị phá vỡ để xác nhận, tín hiệu thường trễ.' },
        { q: '"Đường ngang" (line) trong Lý thuyết Dow là:', o: ['Đường trung bình động', 'Giai đoạn đi ngang biên hẹp nhiều tuần, gợi ý tích lũy hoặc phân phối', 'Đường xu hướng tăng', 'Khoảng trống giá'], a: 1, e: 'Phá vỡ khỏi "đường ngang" là tín hiệu về hướng tiếp theo của thị trường.' }
      ]
    },
    en: {
      goals: ['Describe the origins of Dow Theory.', 'Explain its basic principles.', 'Distinguish primary, secondary and minor trends.', 'Describe the three phases of bull and bear markets.', 'Explain confirmation between averages.', 'State the role of volume and the main criticisms.'],
      body: () => `
<h3>1. History</h3><p><b>Charles H. Dow (1851–1902)</b> co-founded Dow Jones & Company and was the first editor of <i>The Wall Street Journal</i>. He built market <b>averages</b> — Industrials and Rails (later Transportation) — as a barometer of business. Dow never wrote a formal theory; <b>William P. Hamilton</b> developed and applied his ideas and <b>Robert Rhea</b> codified them.</p>
<h3>2. Basic principles</h3><ol><li><b>The averages discount everything.</b></li><li><b>Three trends</b>: primary, secondary, minor — the tide, the waves, the ripples.</li><li><b>Primary trends have three phases.</b></li><li><b>The averages must confirm each other.</b></li><li><b>Volume confirms the trend.</b></li><li><b>A trend persists until a definite reversal signal.</b></li></ol><p>Conventions: only <b>closing prices</b> count; a <b>"line"</b> is a narrow sideways range lasting weeks that signals accumulation or distribution.</p>
<h3>3. Three trends</h3><table class="tbl"><thead><tr><th>Trend</th><th>Typical duration</th><th>Character</th></tr></thead><tbody><tr><td>Primary</td><td>About a year to several years</td><td>The bull or bear market</td></tr><tr><td>Secondary</td><td>Weeks to months</td><td>Counter-trend corrections retracing roughly 1/3–2/3</td></tr><tr><td>Minor</td><td>Under ~3 weeks</td><td>Noise, little forecasting value</td></tr></tbody></table>
${fig.nested('en')}
<h3>4. Three phases</h3><p><b>Bull</b>: accumulation → public participation → excess.</p>${fig.dowBull('en')}<p><b>Bear</b>: distribution → panic → discouraged selling.</p>${fig.dowBear('en')}
<div class="callout">Compare with <b>Wyckoff</b>: accumulation → markup → distribution → markdown — the same psychological cycle.</div>
<h3>5. Reversal signals</h3>${fig.dowSignals('en')}<p>A trend is assumed intact until the peak-trough sequence breaks — via a failure swing or a non-failure swing.</p>
<h3>6. Confirmation</h3><p>A healthy economy both <b>makes</b> (Industrials) and <b>moves</b> (Transports) goods, so a signal is valid only when both averages give it. When one makes a new high and the other does not, we have <b>non-confirmation</b> — a warning.</p>${fig.confirm('en')}${C.demoHtml.dowConfirm()}
<h3>7. Volume</h3><p>Volume should expand with the primary trend, but the decisive signal always comes from price.</p>
<h3>8. Criticism and legacy</h3><ul><li>Signals are late.</li><li>Defining a "significant" secondary move is subjective.</li><li>The economy and index composition have changed.</li><li>Yet the peak-trough trend definition, trend degrees, market phases and confirmation underpin Wyckoff, Elliott and modern TA.</li></ul>`,
      keys: ['Dow built averages as a business barometer; Hamilton and Rhea codified the theory.', 'Six tenets: discounting, three trends, three phases, confirmation, volume, persistence.', 'Primary ≈ 1+ years; secondary weeks–months retracing 1/3–2/3; minor < ~3 weeks.', 'Bull: accumulation → participation → excess. Bear: distribution → panic → discouraged selling.', 'Non-confirmation warns of a weakening trend.', 'Price is the decisive signal; volume is secondary; closes only.'],
      terms: [['Primary trend', 'The tide'], ['Secondary reaction', 'The waves'], ['Minor trend', 'The ripples'], ['Confirmation', 'Both averages signal'], ['Non-confirmation', 'Divergence between averages'], ['Line', 'Narrow sideways range'], ['Failure swing', 'Rally that fails below the prior high']],
      quiz: [
        { q: 'A secondary reaction typically retraces:', o: ['Under 10%', 'About 1/3 to 2/3', 'Exactly 50%', 'More than 100%'], a: 1, e: 'Roughly one-third to two-thirds of the prior primary swing.' },
        { q: 'The first phase of a primary bull market is:', o: ['Excess', 'Public participation', 'Accumulation', 'Panic'], a: 2, e: 'Informed investors buy while news is still bad.' },
        { q: 'Industrials make a new high, Transports do not. This is:', o: ['A strong buy', 'Non-confirmation — a warning', 'Meaningless', 'An immediate short'], a: 1, e: 'The averages must confirm each other.' },
        { q: 'The decisive signal in Dow Theory comes from:', o: ['Volume', 'Economic news', 'Closing prices of the averages', 'Expert opinion'], a: 2, e: 'Volume is secondary evidence.' },
        { q: 'A failure swing at a top is:', o: ['A rally to new highs', 'A rally that fails below the prior high, then a break of the last low', 'Endless sideways action', 'Falling volume'], a: 1, e: 'The rising peak-trough sequence breaks.' },
        { q: 'Dow compared the three trends to:', o: ['Mountains, hills, mounds', 'Tide, waves, ripples', 'Years, months, days', 'Forest, trees, leaves'], a: 1, e: 'Tide, waves and ripples.' },
        { q: 'The most common criticism of Dow Theory:', o: ['Signals too early', 'Signals arrive late', 'Ignores closes', 'Only for currencies'], a: 1, e: 'Waiting for confirmation makes signals late.' },
        { q: 'A Dow "line" is:', o: ['A moving average', 'A narrow multi-week sideways range', 'An uptrend line', 'A gap'], a: 1, e: 'A breakout from the line shows the next direction.' }
      ]
    }
  };

  /* ================= LESSON 3 ================= */
  C.lessons['l1-03'] = {
    vi: {
      goals: ['Nêu lợi ích của việc trình bày dữ liệu giá dưới dạng biểu đồ.', 'Liệt kê các dữ liệu cần thiết để dựng biểu đồ đường, thanh và nến.', 'Mô tả cách dựng biểu đồ đường, thanh (OHLC) và nến Nhật.', 'Phân biệt thang giá số học và thang logarit, biết khi nào dùng loại nào.', 'Nhận biết các vấn đề về chất lượng dữ liệu: điều chỉnh giá, hợp đồng liên tục, khoảng trống.'],
      body: () => `
<h3>1. Vì sao dùng biểu đồ?</h3>
<p>Biểu đồ là công cụ truyền thống và căn bản nhất của nhà PTKT. Ở nhiều nơi, người làm PTKT vẫn được gọi là <i>"chartist"</i>. Biểu đồ biến hàng nghìn con số thành một <b>hình ảnh</b>, nhờ đó ta:</p>
<ul><li>nhìn thấy ngay <b>xu hướng</b> và <b>trạng thái</b> của thị trường (tăng, giảm, đi ngang);</li>
<li>nhận ra các vùng <b>hỗ trợ / kháng cự</b> nơi giá từng đảo chiều;</li>
<li>phát hiện <b>mẫu hình</b> lặp lại do tâm lý đám đông tạo ra;</li>
<li>đặt hành động giá hiện tại vào <b>bối cảnh lịch sử</b> của nó.</li></ul>
<p>Máy tính giúp dựng và tính toán nhanh hơn, nhưng nguyên tắc vẫn không đổi: biểu đồ là cách hiển thị dữ liệu giá theo thời gian.</p>

<h3>2. Sơ lược lịch sử</h3>
<ul><li><b>Nhật Bản, thế kỷ 18</b>: các thương nhân buôn gạo đã ghi chép giá và phát triển những dạng biểu đồ là tiền thân của <b>nến Nhật</b>. Phương Tây chỉ biết rộng rãi đến kỹ thuật này từ cuối thế kỷ 20.</li>
<li><b>Phương Tây, cuối thế kỷ 19</b>: các nhà giao dịch ghi giá bằng tay. Từ đây ra đời phương pháp <b>Point & Figure</b> (ghi các biến động giá, bỏ qua thời gian) và <b>biểu đồ thanh</b>.</li>
<li><b>Thời máy tính</b> (từ thập niên 1970–1980): biểu đồ điện tử, chỉ báo tự động, dữ liệu trong phiên (intraday) và dữ liệu từng giao dịch (tick).</li></ul>

<h3>3. Dữ liệu cần có</h3>
<table class="tbl"><thead><tr><th>Dữ liệu</th><th>Ý nghĩa</th><th>Dùng cho</th></tr></thead><tbody>
<tr><td><b>Open (giá mở cửa)</b></td><td>Giá giao dịch đầu tiên của kỳ</td><td>Thanh, nến</td></tr>
<tr><td><b>High (giá cao nhất)</b></td><td>Mức giá cao nhất trong kỳ</td><td>Thanh, nến</td></tr>
<tr><td><b>Low (giá thấp nhất)</b></td><td>Mức giá thấp nhất trong kỳ</td><td>Thanh, nến</td></tr>
<tr><td><b>Close (giá đóng cửa)</b></td><td>Giá cuối kỳ: mức mà thị trường "đồng ý" ở cuối phiên, được coi là quan trọng nhất</td><td>Đường, thanh, nến</td></tr>
<tr><td><b>Volume (khối lượng)</b></td><td>Số đơn vị được giao dịch: thước đo "nỗ lực"</td><td>Biểu đồ cột bên dưới</td></tr>
<tr><td><b>Open interest (OI)</b></td><td>Số hợp đồng phái sinh còn mở</td><td>Hợp đồng tương lai, quyền chọn</td></tr></tbody></table>
<p>"Kỳ" có thể là 1 phút, 1 giờ, 1 ngày, 1 tuần hay 1 tháng. Mỗi thanh hoặc nến tóm tắt toàn bộ giao dịch trong kỳ đó.</p>

<h3>4. Ba loại biểu đồ cơ bản</h3>
<p><b>Biểu đồ đường (line chart)</b>: nối các giá đóng cửa liên tiếp. Đơn giản, sạch, phù hợp để thấy xu hướng dài hạn và so sánh nhiều tài sản. Nhược điểm: mất thông tin về biên độ trong kỳ.</p>
<p><b>Biểu đồ thanh (bar chart, OHLC)</b>: mỗi kỳ là một đoạn thẳng đứng từ giá thấp nhất lên giá cao nhất. Vạch ngang nhỏ bên trái là giá mở cửa, bên phải là giá đóng cửa. Biểu đồ thanh cho thấy <b>biên độ (range)</b> và <b>vị trí đóng cửa</b> trong kỳ. Đây chính là dữ liệu mà VSA và Wyckoff dựa vào.</p>
<p><b>Biểu đồ nến (candlestick)</b>: cùng bốn mức giá như biểu đồ thanh. Phần giữa giá mở và giá đóng được tô thành <b>thân nến (real body)</b>: màu sáng/xanh khi đóng cửa cao hơn mở cửa, màu tối/đỏ khi ngược lại. Hai đầu là <b>bóng nến (shadow)</b> nối tới giá cao và giá thấp. Nến giúp nhìn nhanh cuộc giằng co giữa bên mua và bên bán trong kỳ (Bài 10 học sâu).</p>
${fig.anatomy('vi')}
<p>Ngoài ra còn các dạng khác: <b>Point & Figure</b> (chỉ ghi biến động đủ lớn, không có trục thời gian, học ở Bài 11), Heikin-Ashi, Renko, Kagi, biểu đồ theo khối lượng (equivolume), Market Profile… Chúng đều là những cách khác nhau để lọc và trình bày cùng một dữ liệu giá.</p>

<h3>5. Trục thời gian</h3>
<ul><li>Biểu đồ thường chỉ hiển thị <b>ngày giao dịch</b>, bỏ qua cuối tuần và ngày lễ, nên các thanh được xếp liên tục.</li>
<li><b>Khung lớn</b> (tuần, tháng) dùng cho xu hướng dài hạn. <b>Khung nhỏ</b> (giờ, phút) dùng cho thời điểm vào lệnh. Đây là cơ sở của phân tích đa khung.</li>
<li>Thanh tuần hoặc tháng được gộp từ dữ liệu ngày: mở cửa của ngày đầu, cao/thấp nhất trong kỳ, đóng cửa của ngày cuối, khối lượng là tổng.</li></ul>

<h3>6. Thang giá: số học và logarit</h3>
<p><b>Thang số học (arithmetic / linear)</b>: khoảng cách bằng nhau trên trục tung tương ứng với <b>mức thay đổi giá tuyệt đối</b> bằng nhau. Ví dụ: 10 → 20 và 100 → 110 dài như nhau (cùng +10).</p>
<p><b>Thang logarit (log / semi-log)</b>: khoảng cách bằng nhau tương ứng với <b>tỷ lệ % thay đổi</b> bằng nhau. Ví dụ: 10 → 20 và 100 → 200 dài như nhau (cùng +100%).</p>
${fig.scales('vi')}
<table class="tbl"><thead><tr><th>Tình huống</th><th>Nên dùng</th></tr></thead><tbody>
<tr><td>Dữ liệu nhiều năm, giá biến động gấp nhiều lần (ví dụ cổ phiếu tăng trưởng, crypto)</td><td><b>Logarit</b>: so sánh công bằng tốc độ tăng/giảm qua các giai đoạn</td></tr>
<tr><td>Khung ngắn, biên độ giá nhỏ</td><td>Hai thang gần như giống nhau; số học dễ đọc hơn</td></tr>
<tr><td>Vẽ đường xu hướng dài hạn</td><td>Cần biết đang dùng thang nào: một đường thẳng trên thang này là đường cong trên thang kia, nên điểm phá vỡ có thể khác nhau</td></tr></tbody></table>
${C.demoHtml.chartTypes()}

<h3>7. Chất lượng dữ liệu: "rác vào, rác ra"</h3>
<ul><li><b>Điều chỉnh giá cổ phiếu</b>: khi chia tách, trả cổ tức bằng cổ phiếu hoặc phát hành thêm, giá quá khứ phải được điều chỉnh. Nếu không, biểu đồ sẽ có những "cú rơi" giả. (Ở Việt Nam: giá điều chỉnh sau ngày giao dịch không hưởng quyền.)</li>
<li><b>Hợp đồng tương lai</b>: mỗi hợp đồng có ngày đáo hạn, nên phải ghép thành <b>chuỗi liên tục</b> (continuous contract). Có nhiều cách ghép (chuyển tiếp theo khối lượng, điều chỉnh chênh lệch giá…), và mỗi cách cho ra một biểu đồ hơi khác nhau.</li>
<li><b>Khoảng trống (gap)</b>: phiên sau mở cửa cách xa phiên trước. Đó có thể là gap thật (tin tức) hoặc do lỗi/thiếu dữ liệu.</li>
<li><b>Dữ liệu trong phiên</b>: chú ý múi giờ, giờ giao dịch, các phiên khớp lệnh định kỳ (ATO/ATC).</li></ul>`,
      keys: ['Biểu đồ biến dữ liệu thành hình ảnh, giúp nhận ra xu hướng, hỗ trợ/kháng cự, mẫu hình và bối cảnh.', 'Dữ liệu cơ bản: Open, High, Low, Close, Volume (và Open Interest cho phái sinh); giá đóng cửa quan trọng nhất.', 'Biểu đồ đường dùng giá đóng cửa; thanh OHLC và nến dùng đủ 4 mức giá; nến tô thân giữa mở và đóng cửa.', 'Thang số học: khoảng cách bằng nhau = thay đổi tuyệt đối bằng nhau. Thang log: khoảng cách bằng nhau = % thay đổi bằng nhau.', 'Dữ liệu dài hạn, biên độ lớn nên dùng thang log; đường xu hướng có thể cho tín hiệu khác nhau giữa hai thang.', 'Chất lượng dữ liệu quyết định chất lượng phân tích: điều chỉnh giá, hợp đồng liên tục, gap, múi giờ.'],
      terms: [['OHLC', 'Open – High – Low – Close'], ['Line chart', 'Biểu đồ đường (nối giá đóng cửa)'], ['Bar chart', 'Biểu đồ thanh'], ['Candlestick', 'Nến Nhật'], ['Real body', 'Thân nến'], ['Shadow / Wick', 'Bóng nến'], ['Arithmetic scale', 'Thang số học (tuyến tính)'], ['Logarithmic scale', 'Thang logarit (bán log)'], ['Open interest', 'Số hợp đồng phái sinh đang mở'], ['Continuous contract', 'Chuỗi hợp đồng tương lai liên tục']],
      quiz: [
        { q: 'Biểu đồ đường (line chart) thông thường được dựng từ:', o: ['Giá cao nhất', 'Giá mở cửa', 'Giá đóng cửa', 'Khối lượng'], a: 2, e: 'Biểu đồ đường nối các giá đóng cửa liên tiếp, mức giá được coi là quan trọng nhất của mỗi kỳ.' },
        { q: 'Trên thanh OHLC, vạch ngang nhỏ bên PHẢI biểu thị:', o: ['Giá mở cửa', 'Giá đóng cửa', 'Giá cao nhất', 'Khối lượng'], a: 1, e: 'Vạch trái là giá mở cửa, vạch phải là giá đóng cửa.' },
        { q: 'Thân nến (real body) là phần giữa:', o: ['Giá cao nhất và thấp nhất', 'Giá mở cửa và đóng cửa', 'Giá đóng cửa hôm nay và hôm qua', 'Giá cao nhất và đóng cửa'], a: 1, e: 'Thân nến nằm giữa giá mở và đóng cửa; bóng nến nối tới giá cao và thấp nhất.' },
        { q: 'Trên thang LOGARIT, đoạn nào có độ dài bằng đoạn từ 10 lên 20?', o: ['100 lên 110', '100 lên 200', '20 lên 30', '50 lên 60'], a: 1, e: 'Thang log thể hiện % thay đổi: 10→20 và 100→200 đều là +100%.' },
        { q: 'Khi nào thang logarit đặc biệt hữu ích?', o: ['Biểu đồ 1 phút trong một phiên', 'Dữ liệu nhiều năm với giá thay đổi gấp nhiều lần', 'Khi không có khối lượng', 'Khi giá không đổi'], a: 1, e: 'Với biên độ lớn, thang log giúp so sánh công bằng tốc độ thay đổi giữa các giai đoạn.' },
        { q: 'Vì sao biểu đồ cổ phiếu cần dùng giá điều chỉnh?', o: ['Để giá đẹp hơn', 'Để loại bỏ các "cú rơi" giả do chia tách / quyền', 'Để tăng khối lượng', 'Không cần thiết'], a: 1, e: 'Sự kiện doanh nghiệp làm giá thay đổi về kỹ thuật chứ không phải do cung cầu. Không điều chỉnh sẽ sinh tín hiệu sai.' },
        { q: 'Open interest là dữ liệu đặc trưng của:', o: ['Cổ phiếu cơ sở', 'Thị trường phái sinh (hợp đồng tương lai, quyền chọn)', 'Trái phiếu chính phủ', 'Chỉ số chứng khoán'], a: 1, e: 'OI đếm số hợp đồng phái sinh còn mở, cho biết dòng tiền mới vào hay đang rút ra.' },
        { q: 'Một đường xu hướng dài hạn vẽ trên thang số học và trên thang log:', o: ['Luôn cho cùng điểm phá vỡ', 'Có thể cho điểm phá vỡ khác nhau', 'Không thể vẽ trên thang log', 'Chỉ đúng trên thang số học'], a: 1, e: 'Đường thẳng trên thang này là đường cong trên thang kia, nên vị trí giá cắt đường có thể khác.' }
      ]
    },
    en: {
      goals: ['State the benefits of charting price data.', 'List the data needed for line, bar and candlestick charts.', 'Describe how each chart type is built.', 'Distinguish arithmetic and logarithmic scales and when to use each.', 'Recognise data-quality issues: adjustments, continuous contracts, gaps.'],
      body: () => `
<h3>1. Why charts?</h3><p>Charts turn thousands of numbers into a picture: the <b>trend</b> and market state, <b>support/resistance</b>, recurring <b>patterns</b>, and the <b>context</b> of today’s action.</p>
<h3>2. Brief history</h3><ul><li><b>18th-century Japan</b>: rice traders developed the forerunners of <b>candlesticks</b>.</li><li><b>Late 19th-century West</b>: hand-kept records gave rise to <b>point-and-figure</b> and <b>bar charts</b>.</li><li><b>The computer era</b>: electronic charts, automatic indicators, intraday and tick data.</li></ul>
<h3>3. Data</h3><table class="tbl"><thead><tr><th>Field</th><th>Meaning</th></tr></thead><tbody><tr><td>Open</td><td>First trade of the period</td></tr><tr><td>High / Low</td><td>Extremes of the period</td></tr><tr><td>Close</td><td>Last trade — usually the most important</td></tr><tr><td>Volume</td><td>Units traded — effort</td></tr><tr><td>Open interest</td><td>Outstanding derivative contracts</td></tr></tbody></table>
<h3>4. Basic chart types</h3><p><b>Line</b>: connects closes — clean, good for long trends and comparisons, but loses the range. <b>Bar (OHLC)</b>: a vertical line from low to high, open tick left, close tick right — shows range and close location. <b>Candlestick</b>: the same four prices with a coloured <b>real body</b> between open and close and <b>shadows</b> to the extremes.</p>
${fig.anatomy('en')}<p>Other forms — P&F, Heikin-Ashi, Renko, Kagi, equivolume, Market Profile — filter and display the same data differently.</p>
<h3>5. The time axis</h3><ul><li>Charts usually show trading days only.</li><li>Higher timeframes for trend, lower ones for timing.</li><li>Weekly/monthly bars aggregate daily data.</li></ul>
<h3>6. Arithmetic vs logarithmic scale</h3><p><b>Arithmetic</b>: equal distance = equal absolute change. <b>Log</b>: equal distance = equal percentage change (10→20 equals 100→200).</p>
${fig.scales('en')}<p>Use log scales for long histories with large ranges. Trendlines can break at different points on the two scales.</p>${C.demoHtml.chartTypes()}
<h3>7. Data quality</h3><ul><li><b>Adjusted prices</b> for splits and stock dividends.</li><li><b>Continuous futures contracts</b> — several splicing methods.</li><li><b>Gaps</b> — real or data errors.</li><li><b>Intraday data</b> — time zones, sessions, auctions.</li></ul>`,
      keys: ['Charts reveal trend, support/resistance, patterns and context.', 'Data: OHLC, volume, open interest; the close matters most.', 'Line = closes; bars and candles use all four prices; candles colour the open–close body.', 'Arithmetic: equal absolute changes; log: equal percentage changes.', 'Use log for long, wide-ranging histories; trendline breaks may differ by scale.', 'Data quality — adjustments, continuous contracts, gaps — drives analysis quality.'],
      terms: [['OHLC', 'Open, High, Low, Close'], ['Real body', 'Open–close part of a candle'], ['Shadow', 'Line to high/low'], ['Arithmetic scale', 'Linear price axis'], ['Log scale', 'Percentage-based price axis'], ['Open interest', 'Outstanding contracts'], ['Continuous contract', 'Spliced futures series']],
      quiz: [
        { q: 'A standard line chart plots:', o: ['Highs', 'Opens', 'Closes', 'Volume'], a: 2, e: 'Closes are considered the most important price.' },
        { q: 'On an OHLC bar the right-hand tick is:', o: ['Open', 'Close', 'High', 'Volume'], a: 1, e: 'Left = open, right = close.' },
        { q: 'The real body lies between:', o: ['High and low', 'Open and close', 'Today’s and yesterday’s close', 'High and close'], a: 1, e: 'Shadows reach the high and low.' },
        { q: 'On a log scale, which move has the same length as 10→20?', o: ['100→110', '100→200', '20→30', '50→60'], a: 1, e: 'Both are +100%.' },
        { q: 'Log scales are most useful for:', o: ['One-minute intraday charts', 'Multi-year data with large ranges', 'Data without volume', 'Flat prices'], a: 1, e: 'They compare rates of change fairly.' },
        { q: 'Why use adjusted stock prices?', o: ['Aesthetics', 'To remove false drops caused by splits/rights', 'To raise volume', 'Not needed'], a: 1, e: 'Corporate actions are not supply and demand.' },
        { q: 'Open interest belongs to:', o: ['Cash stocks', 'Derivatives', 'Government bonds', 'Stock indexes'], a: 1, e: 'It counts outstanding contracts.' },
        { q: 'A long-term trendline on arithmetic vs log scale:', o: ['Always breaks at the same point', 'May break at different points', 'Cannot be drawn on log', 'Valid only on arithmetic'], a: 1, e: 'A straight line on one is a curve on the other.' }
      ]
    }
  };
})(window.LLW);
