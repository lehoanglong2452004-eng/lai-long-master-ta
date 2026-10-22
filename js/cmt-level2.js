// © 2026 Lai Long Master TA. Bảo lưu mọi quyền. Không sao chép, chỉnh sửa hay dùng lại khi chưa được phép.
/* CMT Level 2 — roadmap and lesson helper. Study notes written by Lai Long Master TA in its own words,
   following the Level 2 body of knowledge. Not affiliated with the CMT Association. */
(function (L) {
  'use strict';
  const C = L.cmt;
  const v = (vi, en) => ({ vi, en });

  /**
   * Register a lesson. quiz rows: [qVi, qEn, optsVi, optsEn|null, answerIndex, explVi, explEn]
   */
  C.addLesson = function (id, vi, en, quiz) {
    vi.quiz = quiz.map(r => ({ q: r[0], o: r[2], a: r[4], e: r[5] || '' }));
    en.quiz = quiz.map(r => ({ q: r[1], o: r[3] || r[2], a: r[4], e: r[6] || r[5] || '' }));
    C.lessons[id] = { vi, en };
  };

  C.levels[2] = {
    title: v('CMT Level 2 — Lý thuyết và Phân tích', 'CMT Level 2 — Theory and Analysis'),
    intro: v(`
<p>Level 2 chuyển từ <b>"biết công cụ"</b> sang <b>"vận dụng và đánh giá công cụ"</b>. Bạn sẽ tính toán chỉ báo, xây dựng và kiểm định hệ thống, đọc chu kỳ, định lượng biến động, áp dụng thống kê suy luận và hồi quy, phân tích liên thị trường và mô hình môi trường thị trường.</p>
<div class="callout"><b>Quy tắc học Level 2</b>
<ol><li>Mỗi bài có <b>bài kiểm tra 30 câu</b>: <b>20 câu Level 2</b> của bài + <b>10 câu ôn tập Level 1</b> chọn ngẫu nhiên.</li>
<li>Cần đúng <b>≥ 24/30 (80%)</b> để mở khoá bài kế tiếp. Câu hỏi và đáp án được xáo trộn mỗi lần làm.</li>
<li>Level 2 mở khoá khi bạn đã đạt toàn bộ 41 bài Level 1.</li></ol></div>
<p class="muted">Nội dung do Lai Long Master TA biên soạn lại theo cách hiểu riêng, bám khung kiến thức CMT Level 2. Tài liệu học tập độc lập, không liên kết với CMT Association.</p>`,
    `<p>Level 2 moves from <b>knowing</b> tools to <b>applying and evaluating</b> them: computing indicators, building and testing systems, cycles, volatility, inferential statistics and regression, intermarket analysis and market models.</p>
<div class="callout"><b>Level 2 rules</b><ol><li>Each lesson test has <b>30 questions</b>: 20 Level 2 + 10 random Level 1 review.</li><li>Score <b>≥ 24/30</b> to unlock the next lesson; shuffled every attempt.</li><li>Level 2 unlocks after all 41 Level 1 lessons are passed.</li></ol></div>
<p class="muted">Independent study notes by Lai Long Master TA; not affiliated with the CMT Association.</p>`),
    parts: [
      { title: v('Phát triển và phân tích biểu đồ', 'Chart development and analysis'),
        goal: v('Vận dụng biểu đồ, trung bình động, động lượng, khối lượng – độ rộng, mẫu hình, nến và chu kỳ ở mức phân tích chuyên sâu.', 'Applied charting, moving averages, momentum, volume and breadth, patterns, candles and cycles.'),
        lessons: [
          { id: 'l2-01', no: 1, title: v('Phân tích biểu đồ tổng hợp', 'Integrated chart analysis') },
          { id: 'l2-02', no: 2, title: v('Trung bình động nâng cao và DMI/ADX', 'Advanced moving averages and DMI/ADX') },
          { id: 'l2-03', no: 3, title: v('Tính toán xu hướng theo thời gian', 'Time-based trend calculations') },
          { id: 'l2-04', no: 4, title: v('Hệ thống theo xu hướng (1)', 'Trend systems (1)') },
          { id: 'l2-05', no: 5, title: v('Hệ thống theo xu hướng (2)', 'Trend systems (2)') },
          { id: 'l2-06', no: 6, title: v('Động lượng và dao động', 'Momentum and oscillators') },
          { id: 'l2-07', no: 7, title: v('Khối lượng, hợp đồng mở và độ rộng', 'Volume, open interest and breadth') },
          { id: 'l2-08', no: 8, title: v('Mẫu hình biểu đồ thanh (chuyên sâu)', 'Bar chart patterns (advanced)') },
          { id: 'l2-09', no: 9, title: v('Mẫu hình ngắn hạn (chuyên sâu)', 'Short-term patterns (advanced)') },
          { id: 'l2-10', no: 10, title: v('Nến đơn', 'Single candle lines') },
          { id: 'l2-11', no: 11, title: v('Mẫu hình nhiều nến', 'Multi-candle patterns') },
          { id: 'l2-12', no: 12, title: v('Dự báo và giao dịch với nến', 'Candle forecasting and trading') },
          { id: 'l2-13', no: 13, title: v('Khái niệm trong lý thuyết chu kỳ', 'Concepts in cycle theory') },
          { id: 'l2-14', no: 14, title: v('Phân tích chu kỳ ứng dụng', 'Applied cycle analysis') }] },
      { title: v('Đo lường biến động trên thị trường tài chính', 'Volatility measures in financial markets'),
        goal: v('Quyền chọn, Greeks, biến động ngụ ý và VIX ở mức tính toán.', 'Options, Greeks, implied volatility and VIX at a computational level.'),
        lessons: [
          { id: 'l2-15', no: 15, title: v('Quyền chọn (chuyên sâu)', 'Options (advanced)') },
          { id: 'l2-16', no: 16, title: v('Biến động ngụ ý (chuyên sâu)', 'Implied volatility (advanced)') },
          { id: 'l2-17', no: 17, title: v('Chỉ số VIX (chuyên sâu)', 'The VIX (advanced)') }] },
      { title: v('Chủ đề tài chính hành vi', 'Topics in behavioural finance'),
        goal: v('Lý thuyết triển vọng, thiên kiến nhận thức, hiệu ứng quán tính và phân tích tâm lý trên thị trường cổ phiếu, phái sinh.', 'Prospect theory, perception biases, inertial effects and sentiment in stock and derivatives markets.'),
        lessons: [
          { id: 'l2-18', no: 18, title: v('Lý thuyết triển vọng', 'Prospect theory') },
          { id: 'l2-19', no: 19, title: v('Thiên kiến nhận thức', 'Perception biases') },
          { id: 'l2-20', no: 20, title: v('Hiệu ứng quán tính', 'Inertial effects') },
          { id: 'l2-21', no: 21, title: v('Phân tích tâm lý thị trường cổ phiếu', 'Sentiment in the stock market') },
          { id: 'l2-22', no: 22, title: v('Phân tích tâm lý thị trường phái sinh', 'Sentiment in derivatives markets') }] },
      { title: v('Ứng dụng thống kê cho nhà PTKT', 'Statistical applications'),
        goal: v('Thống kê suy luận, tương quan, hồi quy, ARIMA và tín hiệu từ hồi quy.', 'Inferential statistics, correlation, regression, ARIMA and regression-based signals.'),
        lessons: [
          { id: 'l2-23', no: 23, title: v('Thống kê suy luận', 'Inferential statistics') },
          { id: 'l2-24', no: 24, title: v('Tương quan', 'Correlation') },
          { id: 'l2-25', no: 25, title: v('Hồi quy', 'Regression') },
          { id: 'l2-26', no: 26, title: v('Phân tích hồi quy và ARIMA', 'Regression analysis and ARIMA') }] },
      { title: v('Phương pháp kỹ thuật và chọn thị trường', 'Technical methods and market selection'),
        goal: v('Chọn thị trường, liên thị trường, chiến lược sức mạnh tương đối, mô hình thị trường cổ phiếu và trái phiếu, quản lý chủ động/thụ động.', 'Market selection, intermarket analysis, RS strategies, stock and bond models, active vs passive.'),
        lessons: [
          { id: 'l2-27', no: 27, title: v('Chọn thị trường và mã giao dịch', 'Selection of markets and issues') },
          { id: 'l2-28', no: 28, title: v('Phân tích liên thị trường', 'Intermarket analysis') },
          { id: 'l2-29', no: 29, title: v('Chiến lược đầu tư theo sức mạnh tương đối', 'Relative-strength investing strategies') },
          { id: 'l2-30', no: 30, title: v('Mô hình thị trường cổ phiếu', 'A stock market model') },
          { id: 'l2-31', no: 31, title: v('Mô hình đơn giản cho trái phiếu', 'A simple model for bonds') },
          { id: 'l2-32', no: 32, title: v('Quản lý tiền chủ động và thụ động', 'Active and passive management') }] },
      { title: v('Thiết kế và kiểm định hệ thống giao dịch', 'Designing and testing trading systems'),
        goal: v('Thống kê backtest, phương pháp khoa học, chuyển động giá phi ngẫu nhiên, đào bới dữ liệu và thiết kế hệ thống.', 'Backtest statistics, the scientific method, nonrandom price motion, data mining and system design.'),
        lessons: [
          { id: 'l2-33', no: 33, title: v('Thống kê của kiểm định ngược', 'The statistics of backtesting') },
          { id: 'l2-34', no: 34, title: v('Phương pháp khoa học và PTKT', 'The scientific method and TA') },
          { id: 'l2-35', no: 35, title: v('Lý thuyết về chuyển động giá phi ngẫu nhiên', 'Theories of nonrandom price motion') },
          { id: 'l2-36', no: 36, title: v('Nghiên cứu tình huống đào bới dữ liệu', 'A data-mining case study') },
          { id: 'l2-37', no: 37, title: v('Thiết kế và kiểm định hệ thống', 'System design and testing') }] }
    ]
  };
})(window.LLW);
