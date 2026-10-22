// © 2026 Lai Long Master TA. Bảo lưu mọi quyền. Không sao chép, chỉnh sửa hay dùng lại khi chưa được phép.
/* CMT Level 3 — roadmap. Study notes written by Lai Long Master TA in its own words,
   following the Level 3 body of knowledge. Not affiliated with the CMT Association. */
(function (L) {
  'use strict';
  const C = L.cmt;
  const v = (vi, en) => ({ vi, en });
  const ls = (n, vi, en) => ({ id: 'l3-' + String(n).padStart(2, '0'), no: n, title: v(vi, en) });

  C.levels[3] = {
    title: v('CMT Level 3 — Tích hợp và Ra quyết định', 'CMT Level 3 — Integration and Decision-Making'),
    intro: v(`
<p>Level 3 là cấp độ của <b>người ra quyết định</b>. Câu hỏi không còn là "chỉ báo này tính thế nào" mà là: <b>với bối cảnh này, bằng chứng này, rủi ro này — bạn sẽ làm gì, với tỷ trọng bao nhiêu, và vì sao?</b> Kiến thức Level 1 và 2 được tích hợp vào quản trị rủi ro, quan hệ liên thị trường, quản lý danh mục, tài chính hành vi, biến động và phân tích biểu đồ trong tình huống thực tế.</p>
<div class="callout"><b>Quy tắc học Level 3</b>
<ol><li>Mỗi bài có <b>bài kiểm tra 50 câu</b>: <b>30 câu Level 3</b> của bài + <b>10 câu ôn Level 2</b> + <b>10 câu ôn Level 1</b>, chọn ngẫu nhiên.</li>
<li>Cần đúng <b>≥ 40/50 (80%)</b> để mở khoá bài kế tiếp. Câu hỏi và đáp án được xáo trộn mỗi lần làm.</li>
<li>Level 3 mở khoá khi bạn đã đạt toàn bộ 37 bài Level 2.</li>
<li>Nhiều câu hỏi ở dạng <b>tình huống</b>: hãy đọc kỹ bối cảnh, xác định bằng chứng quan trọng nhất trước khi chọn.</li></ol></div>
<p class="muted">Nội dung do Lai Long Master TA biên soạn lại theo cách hiểu riêng, bám khung kiến thức CMT Level 3. Tài liệu học tập độc lập, không liên kết với CMT Association.</p>`,
    `<p>Level 3 is the <b>decision-maker’s</b> level: given this context, evidence and risk — what will you do, how large, and why? Levels 1–2 are integrated into risk management, asset relationships, portfolio management, behavioural finance, volatility and real-world chart analysis.</p>
<div class="callout"><b>Level 3 rules</b><ol><li>Each lesson test has <b>50 questions</b>: 30 Level 3 + 10 Level 2 review + 10 Level 1 review.</li><li>Score <b>≥ 40/50</b> to unlock the next lesson; shuffled every attempt.</li><li>Level 3 unlocks after all 37 Level 2 lessons are passed.</li><li>Many questions are case-based: identify the decisive evidence first.</li></ol></div>
<p class="muted">Independent study notes by Lai Long Master TA; not affiliated with the CMT Association.</p>`),
    parts: [
      { title: v('Quản trị rủi ro', 'Risk management'),
        goal: v('Thiết kế, đánh giá và vận hành hệ thống; quản lý vốn, kiểm soát rủi ro; thống kê và kiểm định ở mức ra quyết định.', 'Designing, evaluating and running systems; money management and risk control; statistics and testing for decisions.'),
        lessons: [ls(1, 'Thiết kế và kiểm định hệ thống (ứng dụng)', 'System design and testing (applied)'), ls(2, 'Quản lý vốn và rủi ro danh mục', 'Money and portfolio risk management'), ls(3, 'Đánh giá và kiểm định hệ thống', 'System evaluation and testing'), ls(4, 'Các vấn đề thực tiễn khi vận hành', 'Practical considerations'), ls(5, 'Kiểm soát rủi ro', 'Risk control'), ls(6, 'Phân tích thống kê', 'Statistical analysis'), ls(7, 'Kiểm định giả thuyết và khoảng tin cậy', 'Hypothesis tests and confidence intervals')] },
      { title: v('Quan hệ giữa các tài sản', 'Asset relationships'),
        goal: v('Hồi quy và tương quan liên thị trường; chỉ số quốc tế, hàng hoá, vàng; tương quan trong phiên; chỉ báo liên thị trường; trực quan hoá sức mạnh tương đối.', 'Intermarket regression and correlation; global indices, commodities, gold; intraday correlation; intermarket indicators; visualising relative strength.'),
        lessons: [ls(8, 'Hồi quy trong phân tích liên thị trường', 'Regression in intermarket analysis'), ls(9, 'Chỉ số quốc tế và hàng hoá', 'International indices and commodities'), ls(10, 'Chỉ số chứng khoán Mỹ và các yếu tố dẫn dắt', 'The US equity index and its drivers'), ls(11, 'Các chỉ số châu Âu', 'European indices'), ls(12, 'Vàng', 'Gold'), ls(13, 'Tương quan trong phiên', 'Intraday correlations'), ls(14, 'Chỉ báo liên thị trường', 'Intermarket indicators'), ls(15, 'Trực quan hoá sức mạnh tương đối', 'Visualising relative strength')] },
      { title: v('Quản lý danh mục', 'Portfolio management'),
        goal: v('Động lượng trong danh mục, phân tích môi trường vĩ mô – tài chính, rủi ro danh mục và phân bổ hiệu suất.', 'Momentum in portfolios, the macro-finance environment, portfolio risk and performance attribution.'),
        lessons: [ls(16, 'Đầu tư động lượng: sự thật và ngộ nhận', 'Momentum investing: facts and myths'), ls(17, 'Phân tích môi trường vĩ mô – tài chính', 'Analysing the macro-finance environment'), ls(18, 'Rủi ro danh mục và phân bổ hiệu suất', 'Portfolio risk and performance attribution')] },
      { title: v('Tài chính hành vi', 'Behavioural finance'),
        goal: v('Phân loại thiên kiến, tâm lý nhà đầu tư, ra quyết định nhóm, bong bóng và cách khai thác hành vi trong giao dịch.', 'Bias taxonomy, investor psychology, group decisions, bubbles and exploiting behaviour in trading.'),
        lessons: [ls(19, 'Thiên kiến hành vi: phân loại và xử lý', 'Behavioural biases: classification and treatment'), ls(20, 'Tâm lý nhà đầu tư', 'Investor psychology'), ls(21, 'Ra quyết định theo nhóm', 'Group decision-making'), ls(22, 'Giải phẫu một bong bóng', 'The anatomy of a bubble'), ls(23, 'Thoát bong bóng và tạo alpha', 'Escaping bubbles and generating alpha'), ls(24, 'Kỹ thuật giao dịch dựa trên hành vi', 'Behavioural trading techniques')] },
      { title: v('Phân tích biến động', 'Volatility analysis'),
        goal: v('VIX như chỉ báo thị trường, phòng ngừa bằng phái sinh VIX và các kỹ thuật biến động nâng cao.', 'VIX as a market indicator, hedging with VIX derivatives and advanced volatility techniques.'),
        lessons: [ls(25, 'VIX như chỉ báo thị trường cổ phiếu', 'VIX as a stock market indicator'), ls(26, 'Phòng ngừa bằng phái sinh VIX', 'Hedging with VIX derivatives'), ls(27, 'Kỹ thuật nâng cao', 'Advanced techniques')] },
      { title: v('Phương pháp cổ điển và tổng hợp', 'Classical methods and synthesis'),
        goal: v('Nhận dạng mẫu hình định lượng, đa khung thời gian, nến, biểu đồ diễn tiến và phân tích biểu đồ thực tế từ đầu đến cuối.', 'Quantified patterns, multiple timeframes, candles, progressive charting and end-to-end real-world chart analysis.'),
        lessons: [ls(28, 'Nhận dạng mẫu hình', 'Pattern recognition'), ls(29, 'Đa khung thời gian', 'Multiple time frames'), ls(30, 'Phân tích nến (ứng dụng)', 'Candlestick analysis (applied)'), ls(31, 'Biểu đồ diễn tiến', 'Progressive charting'), ls(32, 'Kết hợp tất cả: biểu đồ thực tế', 'Bringing it together: real-world charts'), ls(33, 'Tổng kết chương trình', 'Programme synthesis')] }
    ]
  };
})(window.LLW);
