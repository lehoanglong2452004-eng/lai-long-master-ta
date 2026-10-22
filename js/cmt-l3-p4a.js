// © 2026 Lai Long Master TA. Bảo lưu mọi quyền. Không sao chép, chỉnh sửa hay dùng lại khi chưa được phép.
/* CMT Level 3 — Part 4a, lessons 19–21: behavioural finance I. Written by Lai Long Master TA in its own words. */
(function (L) {
  'use strict';
  const C = L.cmt, H = C.demoHtml;

  /* ---------- self-check: bias diagnosis ---------- */
  const BQ = () => [
    ['c', L.T('Tôi thường tìm thông tin ủng hộ vị thế đang nắm hơn là thông tin phản bác.', 'I look for information supporting my position more than contradicting it.')],
    ['c', L.T('Tôi chậm thay đổi quan điểm khi có dữ liệu mới.', 'I am slow to change my view when new data arrives.')],
    ['c', L.T('Tôi đánh giá cổ phiếu dựa trên giá mua của mình.', 'I judge a stock against my own purchase price.')],
    ['c', L.T('Tôi chia tiền thành các "túi" (tiền lãi thì dám rủi ro hơn).', 'I treat money in separate "pots" (house money feels freer).')],
    ['e', L.T('Tôi rất khó chịu khi phải cắt lỗ, thường dời dừng lỗ.', 'I hate taking losses and often move my stop.')],
    ['e', L.T('Tôi tin mình giỏi hơn phần lớn nhà đầu tư khác.', 'I believe I am better than most investors.')],
    ['e', L.T('Tôi thường không làm gì dù biết nên tái cân bằng.', 'I often do nothing though I know I should rebalance.')],
    ['e', L.T('Tôi sợ cảm giác hối tiếc nếu bán rồi giá tăng.', 'I fear regret if I sell and the price then rises.')]];
  H.biasCheck = () => `<div class="demo" data-demo="biasCheck"><div class="demo-head"><b>🧭 ${L.T('Tự đánh giá thiên kiến (0 = không bao giờ, 3 = rất thường xuyên)', 'Bias self-check (0 = never, 3 = very often)')}</b></div><div class="demo-calc">${BQ().map((q, i) => `<label class="chk" style="display:flex;justify-content:space-between;gap:8px;margin:4px 0"><span>${q[1]}</span><input type="number" min="0" max="3" step="1" value="1" class="d-num b${i}" style="width:56px"></label>`).join('')}</div><div class="demo-out"></div></div>`;
  C.demoRun.biasCheck = box => {
    const run = () => {
      let c = 0, e = 0; BQ().forEach((q, i) => { const v = Math.max(0, Math.min(3, +box.querySelector('.b' + i).value || 0)); if (q[0] === 'c') c += v; else e += v; });
      const lead = c > e ? L.T('nhận thức', 'cognitive') : e > c ? L.T('cảm xúc', 'emotional') : L.T('cân bằng', 'balanced');
      box.querySelector('.demo-out').innerHTML = L.T(`Điểm thiên kiến nhận thức: <b>${c}/12</b> · cảm xúc: <b>${e}/12</b> → nghiêng về <b>${lead}</b>. ${c > e ? 'Hướng xử lý: <b>điều chỉnh</b> bằng giáo dục, quy trình, danh sách kiểm tra, tìm bằng chứng phản bác.' : e > c ? 'Hướng xử lý: <b>thích nghi</b> — thiết kế quy tắc tự động (dừng lỗ đặt sẵn, tái cân bằng định kỳ, giới hạn quy mô) thay vì cố "sửa" cảm xúc.' : 'Kết hợp cả quy trình và quy tắc tự động.'}`,
        `Cognitive score: <b>${c}/12</b> · emotional: <b>${e}/12</b> → leaning <b>${lead}</b>. ${c > e ? 'Approach: <b>moderate</b> via education, process, checklists, seeking disconfirming evidence.' : e > c ? 'Approach: <b>adapt</b> — automatic rules (pre-set stops, scheduled rebalancing, size limits) rather than trying to fix emotions.' : 'Combine process and automatic rules.'}`);
    };
    box.querySelectorAll('.d-num').forEach(i => { i.oninput = run; });
    run();
  };

  /* ================= L3-19 ================= */
  C.addLesson('l3-19', {
    goals: ['Phân loại thiên kiến thành nhận thức (niềm tin cố hữu, xử lý thông tin) và cảm xúc.', 'Nhận diện từng thiên kiến qua hành vi đầu tư cụ thể.', 'Chọn cách xử lý: điều chỉnh hay thích nghi.', 'Áp dụng trong tư vấn và tự quản lý danh mục.'],
    body: () => `
<h3>1. Vì sao phải phân loại?</h3>
<p>Biết "có thiên kiến" chưa đủ; cần biết <b>loại</b> thiên kiến để chọn cách xử lý. Thiên kiến <b>nhận thức</b> xuất phát từ lỗi suy luận, thiếu thông tin hoặc xử lý sai — có thể sửa bằng giáo dục và quy trình. Thiên kiến <b>cảm xúc</b> xuất phát từ cảm giác, trực giác, xung động — rất khó sửa, thường phải <b>thích nghi</b>.</p>
<h3>2. Thiên kiến nhận thức</h3>
<table class="tbl"><thead><tr><th>Nhóm</th><th>Thiên kiến</th><th>Biểu hiện</th></tr></thead><tbody>
<tr><td rowspan="5"><b>Niềm tin cố hữu</b></td><td>Bảo thủ</td><td>Cập nhật chậm khi có thông tin mới</td></tr>
<tr><td>Xác nhận</td><td>Tìm và tin thông tin ủng hộ quan điểm sẵn có</td></tr>
<tr><td>Đại diện</td><td>Phân loại theo khuôn mẫu ("công ty tốt = cổ phiếu tốt"), bỏ qua xác suất cơ sở</td></tr>
<tr><td>Ảo tưởng kiểm soát</td><td>Tin mình kiểm soát được kết quả ngẫu nhiên → giao dịch quá mức</td></tr>
<tr><td>Nhận thức muộn</td><td>"Tôi đã biết trước" → đánh giá thấp rủi ro tương lai</td></tr>
<tr><td rowspan="4"><b>Xử lý thông tin</b></td><td>Neo và điều chỉnh</td><td>Bám vào giá mua, dự báo ban đầu</td></tr>
<tr><td>Kế toán tâm lý</td><td>Chia tiền thành "túi", mỗi túi đối xử khác nhau; bỏ qua tương quan danh mục</td></tr>
<tr><td>Đóng khung</td><td>Quyết định thay đổi theo cách trình bày</td></tr>
<tr><td>Sẵn có</td><td>Đánh giá xác suất theo mức dễ nhớ (tin gần đây, gây ấn tượng)</td></tr></tbody></table>
<h3>3. Thiên kiến cảm xúc</h3>
<table class="tbl"><tbody>
<tr><td><b>Ghét thua lỗ</b></td><td>Giữ lỗ, bán lãi sớm; chấp nhận rủi ro lớn để gỡ</td></tr>
<tr><td><b>Quá tự tin</b></td><td>Giao dịch nhiều, đa dạng hoá kém, đánh giá thấp rủi ro</td></tr>
<tr><td><b>Tự kiểm soát kém</b></td><td>Ưu tiên tiêu dùng/kết quả ngắn hạn, không theo kế hoạch</td></tr>
<tr><td><b>Hiện trạng</b></td><td>Không thay đổi danh mục dù cần</td></tr>
<tr><td><b>Sở hữu</b></td><td>Định giá cao thứ mình đang có</td></tr>
<tr><td><b>Ngại hối tiếc</b></td><td>Không dám hành động (hoặc chạy theo đám đông) để tránh cảm giác sai</td></tr></tbody></table>
<h3>4. Điều chỉnh hay thích nghi?</h3>
<ul><li><b>Thiên kiến nhận thức → điều chỉnh (moderate)</b>: giáo dục, quy trình phân tích, danh sách kiểm tra, chủ động tìm bằng chứng phản bác, ghi nhật ký.</li>
<li><b>Thiên kiến cảm xúc → thích nghi (adapt)</b>: thiết kế môi trường và quy tắc tự động để hành vi xấu khó xảy ra — dừng lỗ đặt sẵn, tái cân bằng định kỳ tự động, giới hạn quy mô, tách tài khoản "đầu cơ" nhỏ.</li>
<li>Mức độ <b>tài sản</b> và mục tiêu cũng quan trọng: thiên kiến đe doạ mục tiêu sống còn (ví dụ hưu trí) phải được xử lý mạnh tay hơn.</li></ul>
${H.biasCheck()}
<h3>5. Bốn kiểu hành vi nhà đầu tư (khái quát)</h3>
<table class="tbl"><thead><tr><th>Kiểu</th><th>Khẩu vị rủi ro</th><th>Thiên kiến chủ đạo</th></tr></thead><tbody>
<tr><td>Bảo toàn</td><td>Thấp</td><td>Cảm xúc: ghét lỗ, hiện trạng</td></tr>
<tr><td>Đi theo</td><td>Thấp – vừa</td><td>Nhận thức: theo đám đông, sẵn có, nhận thức muộn</td></tr>
<tr><td>Độc lập</td><td>Vừa – cao</td><td>Nhận thức: xác nhận, ảo tưởng kiểm soát</td></tr>
<tr><td>Tích luỹ tích cực</td><td>Cao</td><td>Cảm xúc: quá tự tin, ảo tưởng kiểm soát</td></tr></tbody></table>`,
    keys: ['Nhận thức (niềm tin cố hữu + xử lý thông tin) vs cảm xúc.', 'Niềm tin cố hữu: bảo thủ, xác nhận, đại diện, ảo tưởng kiểm soát, nhận thức muộn; xử lý thông tin: neo, kế toán tâm lý, đóng khung, sẵn có.', 'Cảm xúc: ghét lỗ, quá tự tin, tự kiểm soát, hiện trạng, sở hữu, ngại hối tiếc.', 'Nhận thức → điều chỉnh; cảm xúc → thích nghi bằng quy tắc tự động; mức độ tài sản/mục tiêu quyết định độ mạnh tay.', 'Bốn kiểu hành vi: bảo toàn, đi theo, độc lập, tích luỹ tích cực.'],
    terms: [['Belief perseverance', 'Niềm tin cố hữu'], ['Mental accounting', 'Kế toán tâm lý'], ['Availability bias', 'Thiên kiến sẵn có'], ['Illusion of control', 'Ảo tưởng kiểm soát'], ['Hindsight bias', 'Thiên kiến nhận thức muộn'], ['Regret aversion', 'Ngại hối tiếc'], ['Moderate vs adapt', 'Điều chỉnh vs thích nghi']]
  }, {
    goals: ['Classify biases as cognitive (belief perseverance, processing) or emotional.', 'Recognise each in investor behaviour.', 'Choose to moderate or adapt.', 'Apply in advice and self-management.'],
    body: () => `
<h3>1. Why classify</h3><p>Cognitive biases come from faulty reasoning and can be corrected; emotional ones come from feelings and usually must be accommodated.</p>
<h3>2. Cognitive</h3><p>Belief perseverance: conservatism, confirmation, representativeness, illusion of control, hindsight. Processing: anchoring, mental accounting, framing, availability.</p>
<h3>3. Emotional</h3><p>Loss aversion, overconfidence, self-control, status quo, endowment, regret aversion.</p>
<h3>4. Moderate or adapt</h3><ul><li>Cognitive → education, process, checklists, disconfirmation, journals.</li><li>Emotional → automatic rules and environment design.</li><li>Wealth and goals set intensity.</li></ul>${H.biasCheck()}
<h3>5. Four behavioural profiles</h3><p>Preserving (emotional), following (cognitive), independent (cognitive), active accumulating (emotional).</p>`,
    keys: ['Two families.', 'Cognitive list.', 'Emotional list.', 'Moderate vs adapt.', 'Profiles.'],
    terms: [['Mental accounting', 'Treating money in separate pots'], ['Regret aversion', 'Avoiding decisions that may cause regret']]
  }, [
    ['Thiên kiến nhận thức xuất phát từ:', 'Cognitive biases stem from:', ['Lỗi suy luận, xử lý thông tin', 'Cảm xúc, xung động', 'Luật pháp', 'Phí'], ['Faulty reasoning and information processing', 'Feelings and impulses', 'Law', 'Fees'], 0, '', ''],
    ['Cách xử lý phù hợp với thiên kiến nhận thức:', 'The fitting treatment for cognitive biases:', ['Điều chỉnh bằng giáo dục, quy trình, danh sách kiểm tra', 'Chấp nhận hoàn toàn', 'Tăng đòn bẩy', 'Không làm gì'], ['Moderate via education, process, checklists', 'Accept fully', 'Add leverage', 'Do nothing'], 0, '', ''],
    ['Cách xử lý phù hợp với thiên kiến cảm xúc:', 'The fitting treatment for emotional biases:', ['Thích nghi bằng quy tắc tự động và thiết kế môi trường', 'Chỉ đọc sách', 'Bỏ qua', 'Giao dịch nhiều hơn'], ['Adapt via automatic rules and environment design', 'Read books only', 'Ignore', 'Trade more'], 0, '', ''],
    ['Thiên kiến nào thuộc nhóm "niềm tin cố hữu"?', 'Which is a belief-perseverance bias?', ['Xác nhận', 'Ghét thua lỗ', 'Sở hữu', 'Tự kiểm soát'], ['Confirmation', 'Loss aversion', 'Endowment', 'Self-control'], 0, '', ''],
    ['Thiên kiến nào thuộc nhóm "xử lý thông tin"?', 'Which is an information-processing bias?', ['Kế toán tâm lý', 'Quá tự tin', 'Ngại hối tiếc', 'Hiện trạng'], ['Mental accounting', 'Overconfidence', 'Regret aversion', 'Status quo'], 0, '', ''],
    ['Thiên kiến nào là cảm xúc?', 'Which bias is emotional?', ['Ngại hối tiếc', 'Neo', 'Đóng khung', 'Sẵn có'], ['Regret aversion', 'Anchoring', 'Framing', 'Availability'], 0, '', ''],
    ['Nhà đầu tư chỉ đọc tin tích cực về cổ phiếu mình đang nắm. Thiên kiến:', 'An investor reads only positive news on holdings. Bias:', ['Xác nhận', 'Neo', 'Sở hữu', 'Tự kiểm soát'], ['Confirmation', 'Anchoring', 'Endowment', 'Self-control'], 0, '', ''],
    ['Dùng "tiền lãi" để đầu cơ mạo hiểm hơn tiền gốc là:', 'Speculating more with "house money" than principal is:', ['Kế toán tâm lý', 'Đại diện', 'Bảo thủ', 'Nhận thức muộn'], ['Mental accounting', 'Representativeness', 'Conservatism', 'Hindsight'], 0, '', ''],
    ['"Công ty tốt thì chắc chắn là cổ phiếu tốt" là:', '"A great company must be a great stock" is:', ['Đại diện', 'Sẵn có', 'Hiện trạng', 'Sở hữu'], ['Representativeness', 'Availability', 'Status quo', 'Endowment'], 0, '', ''],
    ['"Tôi đã biết thị trường sẽ sập" sau khi sập là:', '"I knew it would crash" after the crash is:', ['Nhận thức muộn', 'Neo', 'Ghét lỗ', 'Đóng khung'], ['Hindsight bias', 'Anchoring', 'Loss aversion', 'Framing'], 0, '', ''],
    ['Tin rằng việc tự tay chọn thời điểm giúp kiểm soát kết quả ngẫu nhiên là:', 'Believing personal timing controls random outcomes is:', ['Ảo tưởng kiểm soát', 'Bảo thủ', 'Kế toán tâm lý', 'Sở hữu'], ['Illusion of control', 'Conservatism', 'Mental accounting', 'Endowment'], 0, '', ''],
    ['Ước lượng xác suất sập thị trường cao bất thường ngay sau khi xem phim tài liệu về khủng hoảng là:', 'Overestimating crash odds right after a crisis documentary is:', ['Sẵn có', 'Neo', 'Sở hữu', 'Hiện trạng'], ['Availability', 'Anchoring', 'Endowment', 'Status quo'], 0, '', ''],
    ['Quá tự tin thường dẫn tới:', 'Overconfidence often leads to:', ['Giao dịch quá mức, đa dạng hoá kém', 'Giao dịch quá ít', 'Đa dạng hoá quá mức', 'Không gì'], ['Overtrading and under-diversification', 'Undertrading', 'Over-diversification', 'Nothing'], 0, '', ''],
    ['Ngại hối tiếc có thể khiến nhà đầu tư:', 'Regret aversion may make investors:', ['Không dám hành động hoặc chạy theo đám đông', 'Luôn đi ngược đám đông', 'Giao dịch hợp lý hơn', 'Không ảnh hưởng'], ['Freeze or herd with the crowd', 'Always contrarian', 'Trade more rationally', 'No effect'], 0, '', ''],
    ['Dừng lỗ đặt sẵn và tái cân bằng tự động là ví dụ của:', 'Pre-set stops and automatic rebalancing exemplify:', ['Thích nghi với thiên kiến cảm xúc', 'Điều chỉnh thiên kiến nhận thức', 'Tăng thiên kiến', 'Không liên quan'], ['Adapting to emotional biases', 'Moderating cognitive biases', 'Raising bias', 'Unrelated'], 0, '', ''],
    ['Danh sách kiểm tra phân tích và tìm bằng chứng phản bác là cách:', 'Checklists and seeking disconfirming evidence are ways to:', ['Điều chỉnh thiên kiến nhận thức', 'Thích nghi thiên kiến cảm xúc', 'Tăng quá tự tin', 'Không gì'], ['Moderate cognitive biases', 'Adapt to emotional ones', 'Raise overconfidence', 'Nothing'], 0, '', ''],
    ['Khi thiên kiến đe doạ mục tiêu sống còn (hưu trí) của khách hàng giàu ít, nhà tư vấn nên:', 'When a bias threatens a less wealthy client’s vital goal (retirement), an adviser should:', ['Xử lý mạnh tay hơn — điều chỉnh/hạn chế hành vi', 'Chiều theo hoàn toàn', 'Không quan tâm', 'Tăng rủi ro'], ['Act more firmly — moderate/restrict the behaviour', 'Fully accommodate', 'Ignore', 'Add risk'], 0, '', ''],
    ['Khách hàng rất giàu, thiên kiến cảm xúc mạnh, mục tiêu không bị đe doạ. Cách tiếp cận:', 'A very wealthy client, strong emotional bias, goals not threatened. Approach:', ['Thích nghi nhiều hơn với sở thích của khách', 'Sửa bằng mọi giá', 'Từ chối tư vấn', 'Tăng đòn bẩy'], ['Accommodate more of the client’s preferences', 'Fix at all costs', 'Refuse to advise', 'Add leverage'], 0, '', ''],
    ['Kế toán tâm lý gây hại vì:', 'Mental accounting harms because it:', ['Bỏ qua tương quan và bức tranh tổng thể của danh mục', 'Tăng đa dạng hoá', 'Giảm phí', 'Không hại'], ['Ignores correlations and the whole-portfolio view', 'Adds diversification', 'Cuts fees', 'Is harmless'], 0, '', ''],
    ['Thiên kiến bảo thủ khiến nhà phân tích:', 'Conservatism makes analysts:', ['Điều chỉnh dự báo chậm khi có tin mới', 'Điều chỉnh quá nhanh', 'Không dự báo', 'Luôn đúng'], ['Revise forecasts slowly on new information', 'Revise too fast', 'Not forecast', 'Always be right'], 0, '', ''],
    ['Kiểu nhà đầu tư "bảo toàn" thường có thiên kiến chủ đạo:', 'The "preserving" investor’s dominant biases:', ['Cảm xúc: ghét lỗ, hiện trạng', 'Quá tự tin', 'Ảo tưởng kiểm soát', 'Không có'], ['Emotional: loss aversion, status quo', 'Overconfidence', 'Illusion of control', 'None'], 0, '', ''],
    ['Kiểu "tích luỹ tích cực" thường có thiên kiến:', 'The "active accumulator" typically shows:', ['Quá tự tin, ảo tưởng kiểm soát', 'Ghét lỗ cực độ', 'Hiện trạng', 'Không có'], ['Overconfidence, illusion of control', 'Extreme loss aversion', 'Status quo', 'None'], 0, '', ''],
    ['Kiểu "đi theo" dễ mắc:', 'The "following" investor is prone to:', ['Theo đám đông, thiên kiến sẵn có', 'Quá tự tin cực độ', 'Không giao dịch', 'Phân tích sâu'], ['Herding, availability', 'Extreme overconfidence', 'Never trading', 'Deep analysis'], 0, '', ''],
    ['Nhật ký giao dịch giúp chủ yếu với:', 'A trading journal mainly helps with:', ['Nhận diện thiên kiến lặp lại và nhận thức muộn', 'Tăng phí', 'Tăng đòn bẩy', 'Không gì'], ['Spotting recurring biases and hindsight', 'Raising fees', 'Leverage', 'Nothing'], 0, '', ''],
    ['Dời dừng lỗ xa hơn khi giá tiến gần là biểu hiện của:', 'Moving a stop further as price nears it reflects:', ['Ghét thua lỗ', 'Bảo thủ', 'Đóng khung', 'Sẵn có'], ['Loss aversion', 'Conservatism', 'Framing', 'Availability'], 0, '', ''],
    ['Không tái cân bằng dù biết nên làm là:', 'Not rebalancing though you know you should is:', ['Hiện trạng / tự kiểm soát kém', 'Đại diện', 'Neo', 'Nhận thức muộn'], ['Status quo / poor self-control', 'Representativeness', 'Anchoring', 'Hindsight'], 0, '', ''],
    ['Vì sao thiên kiến cảm xúc khó sửa hơn?', 'Why are emotional biases harder to fix?', ['Xuất phát từ cảm giác và xung động, không phải thiếu kiến thức', 'Ít gặp', 'Dễ đo', 'Không đúng'], ['They arise from feelings and impulses, not lack of knowledge', 'Rare', 'Easy to measure', 'False'], 0, '', ''],
    ['Một nhà PTKT thường xuyên đếm lại sóng cho khớp với quan điểm tăng giá của mình là:', 'A technician recounting waves to fit a bullish view shows:', ['Thiên kiến xác nhận', 'Sẵn có', 'Hiện trạng', 'Sở hữu'], ['Confirmation bias', 'Availability', 'Status quo', 'Endowment'], 0, '', ''],
    ['Biện pháp hiệu quả chống thiên kiến xác nhận cho nhà PTKT:', 'An effective counter to confirmation bias for technicians:', ['Viết trước điều kiện giá làm vô hiệu kịch bản', 'Chỉ đọc phân tích đồng quan điểm', 'Bỏ dừng lỗ', 'Tăng vị thế'], ['Pre-write the price condition that invalidates the scenario', 'Read only agreeing analysis', 'Drop stops', 'Size up'], 0, '', ''],
    ['Bài học chính của phân loại thiên kiến:', 'Key lesson of bias classification:', ['Đúng loại thiên kiến → đúng cách xử lý (điều chỉnh hay thích nghi)', 'Mọi thiên kiến xử lý như nhau', 'Không cần xử lý', 'Chỉ có thiên kiến cảm xúc'], ['Right bias type → right treatment (moderate or adapt)', 'Treat all the same', 'No treatment needed', 'Only emotional biases exist'], 0, '', '']
  ]);

  /* ================= L3-20 ================= */
  C.addLesson('l3-20', {
    goals: ['Mô tả chu kỳ cảm xúc của nhà đầu tư và liên hệ với các pha thị trường.', 'Giải thích vai trò của sợ hãi, tham lam, căng thẳng và bất hoà nhận thức.', 'Xây dựng quy trình giao dịch giúp kiểm soát cảm xúc.', 'Đánh giá trạng thái tâm lý của bản thân và đám đông.'],
    body: () => `
<h3>1. Chu kỳ cảm xúc</h3>
<div class="flow"><span>Lạc quan</span><span>→</span><span>Hào hứng</span><span>→</span><span>Hưng phấn</span><span>→</span><span><b>Phấn khích tột độ</b> (rủi ro cao nhất)</span><span>→</span><span>Lo lắng</span><span>→</span><span>Phủ nhận</span><span>→</span><span>Sợ hãi</span><span>→</span><span>Tuyệt vọng</span><span>→</span><span>Hoảng loạn</span><span>→</span><span><b>Đầu hàng</b></span><span>→</span><span>Chán nản</span><span>→</span><span>Hy vọng</span><span>→</span><span>Nhẹ nhõm</span></div>
<p>Thời điểm cảm xúc tích cực nhất thường trùng <b>rủi ro tài chính cao nhất</b>, và ngược lại. Chu kỳ này khớp với các pha Dow/Wyckoff: tích luỹ (chán nản, hy vọng) → tham gia đại chúng (lạc quan, hào hứng) → phân phối (phấn khích, lo lắng) → giảm giá (sợ hãi, hoảng loạn, đầu hàng).</p>
<h3>2. Các lực tâm lý chính</h3>
<ul><li><b>Sợ hãi và tham lam</b>: sợ hãi khiến bán ở đáy, không dám vào lại; tham lam khiến mua đuổi, tăng quy mô quá mức ở đỉnh.</li>
<li><b>Sợ bỏ lỡ (FOMO)</b>: áp lực xã hội khi người khác có lãi.</li>
<li><b>Bất hoà nhận thức</b>: khi hành vi (đang nắm lỗ) mâu thuẫn với niềm tin (mình là nhà đầu tư giỏi), con người thay đổi niềm tin ("đầu tư dài hạn") thay vì hành vi (cắt lỗ).</li>
<li><b>Căng thẳng</b>: căng thẳng cao thu hẹp sự chú ý, tăng quyết định bốc đồng; ngủ kém và mệt mỏi làm giảm chất lượng quyết định.</li>
<li><b>Thiên kiến kết quả</b>: đánh giá quyết định theo kết quả thay vì chất lượng quy trình.</li></ul>
<h3>3. Quy trình kiểm soát cảm xúc</h3>
<ol><li><b>Kế hoạch giao dịch viết sẵn</b>: điều kiện vào, ra, dừng lỗ, quy mô — trước khi vào lệnh.</li>
<li><b>Giới hạn rủi ro</b> mỗi lệnh và mỗi ngày/tuần; dừng giao dịch khi chạm giới hạn lỗ ngày.</li>
<li><b>Nhật ký</b>: ghi lý do, cảm xúc, kết quả; đánh giá chất lượng quyết định, không chỉ kết quả.</li>
<li><b>Thói quen</b>: chuẩn bị trước phiên, xem lại sau phiên, nghỉ ngơi, vận động.</li>
<li><b>Quy mô phù hợp</b>: nếu bạn mất ngủ vì vị thế, nó quá lớn.</li></ol>
<h3>4. Đọc tâm lý đám đông</h3>
<ul><li>Chỉ báo tâm lý (Level 2): khảo sát, put/call, VIX, short interest, dòng tiền vào quỹ, mức margin.</li>
<li>Dấu hiệu định tính: chủ đề thị trường xuất hiện ở trang nhất, người không quan tâm đầu tư bắt đầu hỏi mã, số tài khoản mở mới tăng vọt.</li>
<li>Ở Việt Nam: dư nợ margin, số tài khoản mở mới, thanh khoản kỷ lục, mức độ thảo luận trên mạng xã hội.</li></ul>
<div class="callout">Nguyên tắc: <b>cảm xúc của chính bạn cũng là dữ liệu</b>. Khi bạn cảm thấy "chắc chắn" và muốn tăng gấp đôi quy mô, hoặc muốn bán tất cả "cho xong" — hãy dừng lại, kiểm tra kế hoạch và các chỉ báo tâm lý đám đông.</div>`,
    keys: ['Chu kỳ cảm xúc: phấn khích tột độ = rủi ro cao nhất; đầu hàng/chán nản = cơ hội; khớp với pha Dow/Wyckoff.', 'Lực tâm lý: sợ hãi/tham lam, FOMO, bất hoà nhận thức, căng thẳng, thiên kiến kết quả.', 'Quy trình: kế hoạch viết sẵn, giới hạn rủi ro, nhật ký, thói quen, quy mô phù hợp.', 'Đọc đám đông: chỉ báo tâm lý + dấu hiệu định tính; Việt Nam: margin, tài khoản mới, thanh khoản kỷ lục.', 'Cảm xúc của chính mình là dữ liệu.'],
    terms: [['Emotional cycle', 'Chu kỳ cảm xúc'], ['Euphoria', 'Phấn khích tột độ'], ['Capitulation', 'Đầu hàng'], ['FOMO', 'Sợ bỏ lỡ'], ['Cognitive dissonance', 'Bất hoà nhận thức'], ['Outcome bias', 'Thiên kiến kết quả']]
  }, {
    goals: ['Describe the investor emotional cycle.', 'Explain fear, greed, stress and dissonance.', 'Build an emotion-controlling process.', 'Assess own and crowd psychology.'],
    body: () => `
<h3>1. Emotional cycle</h3><p>Optimism → excitement → thrill → euphoria (max risk) → anxiety → denial → fear → desperation → panic → capitulation → despondency → hope → relief. Matches Dow/Wyckoff phases.</p>
<h3>2. Forces</h3><ul><li>Fear and greed; FOMO.</li><li>Cognitive dissonance.</li><li>Stress and fatigue.</li><li>Outcome bias.</li></ul>
<h3>3. Process</h3><ol><li>Written plan</li><li>Risk limits incl. daily loss limits</li><li>Journal</li><li>Routines</li><li>Right size</li></ol>
<h3>4. Crowd</h3><p>Sentiment indicators plus qualitative signs; in Vietnam margin debt, new accounts, record turnover.</p><div class="callout">Your own emotions are data.</div>`,
    keys: ['Cycle.', 'Forces.', 'Process.', 'Crowd reading.', 'Own emotions as data.'],
    terms: [['Capitulation', 'Final surrender selling'], ['Cognitive dissonance', 'Changing beliefs to fit actions']]
  }, [
    ['Trong chu kỳ cảm xúc, giai đoạn có rủi ro tài chính cao nhất:', 'In the emotional cycle, the highest-risk stage:', ['Phấn khích tột độ', 'Đầu hàng', 'Chán nản', 'Hy vọng'], ['Euphoria', 'Capitulation', 'Despondency', 'Hope'], 0, '', ''],
    ['Giai đoạn thường gần đáy thị trường:', 'The stage usually near market bottoms:', ['Đầu hàng / chán nản', 'Phấn khích', 'Hào hứng', 'Lạc quan'], ['Capitulation / despondency', 'Euphoria', 'Thrill', 'Optimism'], 0, '', ''],
    ['Chu kỳ cảm xúc khớp với pha nào của Wyckoff khi đám đông phấn khích, tiền thông minh bán ra?', 'Euphoric crowd while smart money sells matches which Wyckoff phase?', ['Phân phối', 'Tích luỹ', 'Tăng giá đầu', 'Không pha nào'], ['Distribution', 'Accumulation', 'Early markup', 'None'], 0, '', ''],
    ['FOMO là:', 'FOMO is:', ['Sợ bỏ lỡ khi người khác có lãi', 'Sợ thua lỗ', 'Ghét rủi ro', 'Không có'], ['Fear of missing out as others profit', 'Fear of loss', 'Risk aversion', 'None'], 0, '', ''],
    ['Đang nắm lỗ nhưng đổi thành "đầu tư dài hạn" để khỏi cắt lỗ là:', 'Relabelling a losing trade "long-term" to avoid cutting it is:', ['Bất hoà nhận thức', 'Đóng khung', 'Sẵn có', 'Đại diện'], ['Cognitive dissonance', 'Framing', 'Availability', 'Representativeness'], 0, '', ''],
    ['Căng thẳng cao thường khiến quyết định:', 'High stress tends to make decisions:', ['Bốc đồng hơn, tầm nhìn hẹp hơn', 'Hợp lý hơn', 'Chậm và cẩn thận hơn', 'Không ảnh hưởng'], ['More impulsive and narrow', 'More rational', 'Slower and careful', 'Unaffected'], 0, '', ''],
    ['Thiên kiến kết quả là:', 'Outcome bias is:', ['Đánh giá quyết định theo kết quả thay vì chất lượng quy trình', 'Đánh giá theo quy trình', 'Không đánh giá', 'Ghét lỗ'], ['Judging decisions by outcome, not process quality', 'Judging by process', 'Not judging', 'Loss aversion'], 0, '', ''],
    ['Một lệnh tuân thủ kế hoạch nhưng lỗ được đánh giá là:', 'A losing trade that followed the plan should be rated:', ['Quyết định tốt nếu quy trình đúng', 'Quyết định tồi', 'Không đánh giá được', 'Phải đổi hệ thống'], ['A good decision if the process was sound', 'A bad decision', 'Unratable', 'Grounds to switch systems'], 0, '', ''],
    ['Giới hạn lỗ theo ngày giúp:', 'A daily loss limit helps:', ['Ngăn giao dịch trả thù sau chuỗi thua', 'Tăng lợi nhuận', 'Tăng phí', 'Không gì'], ['Prevent revenge trading after losses', 'Raise profit', 'Raise fees', 'Nothing'], 0, '', ''],
    ['Dấu hiệu vị thế quá lớn so với tâm lý:', 'A sign a position is psychologically too large:', ['Mất ngủ, liên tục kiểm tra giá', 'Ngủ ngon', 'Không quan tâm', 'Lãi đều'], ['Losing sleep, constantly checking prices', 'Sleeping well', 'Indifference', 'Steady profits'], 0, '', ''],
    ['Kế hoạch giao dịch nên được viết:', 'A trading plan should be written:', ['Trước khi vào lệnh', 'Sau khi thoát lệnh', 'Khi đang lỗ', 'Không cần'], ['Before entering', 'After exiting', 'While losing', 'Never'], 0, '', ''],
    ['Dấu hiệu định tính của hưng phấn đám đông:', 'A qualitative sign of crowd euphoria:', ['Người không quan tâm đầu tư bắt đầu hỏi mã cổ phiếu', 'Thị trường bị lãng quên', 'Thanh khoản cạn kiệt', 'Tin tức bi quan'], ['People uninterested in investing start asking for tips', 'Market forgotten', 'Dried-up liquidity', 'Gloomy news'], 0, '', ''],
    ['Ở Việt Nam, chỉ báo tâm lý đáng chú ý:', 'In Vietnam, a notable sentiment gauge:', ['Dư nợ margin và số tài khoản mở mới', 'Giá gạo', 'Số ngày nghỉ', 'Không có'], ['Margin debt and new account openings', 'Rice price', 'Holidays', 'None'], 0, '', ''],
    ['Cảm thấy "chắc chắn tuyệt đối" và muốn tăng gấp đôi quy mô là tín hiệu để:', 'Feeling "absolutely certain" and wanting to double size signals you to:', ['Dừng lại, kiểm tra kế hoạch và chỉ báo đám đông', 'Tăng gấp đôi ngay', 'Dùng đòn bẩy tối đa', 'Bỏ dừng lỗ'], ['Pause and check the plan and crowd gauges', 'Double now', 'Max leverage', 'Drop stops'], 0, '', ''],
    ['Sợ hãi ở đáy thường khiến nhà đầu tư:', 'Fear at bottoms often makes investors:', ['Bán ở giá thấp và không dám vào lại', 'Mua mạnh', 'Giữ kỷ luật', 'Không ảnh hưởng'], ['Sell low and not re-enter', 'Buy heavily', 'Stay disciplined', 'Unaffected'], 0, '', ''],
    ['Tham lam ở đỉnh thường khiến nhà đầu tư:', 'Greed at tops often makes investors:', ['Mua đuổi và tăng quy mô quá mức', 'Bán sớm', 'Đứng ngoài', 'Giảm rủi ro'], ['Chase and oversize', 'Sell early', 'Stay out', 'Cut risk'], 0, '', ''],
    ['Xem lại sau phiên nên tập trung vào:', 'Post-session review should focus on:', ['Việc tuân thủ quy trình và chất lượng quyết định', 'Chỉ lãi/lỗ', 'Tin đồn', 'Không gì'], ['Process adherence and decision quality', 'P&L only', 'Rumours', 'Nothing'], 0, '', ''],
    ['Giai đoạn "phủ nhận" trong chu kỳ: nhà đầu tư thường nói:', 'In the "denial" stage investors typically say:', ['"Chỉ là điều chỉnh tạm thời, tôi đầu tư dài hạn"', '"Tôi bán hết rồi"', '"Tôi sẽ mua thêm gấp ba"', '"Thị trường đã chết"'], ['"Just a temporary correction, I’m long-term"', '"I sold everything"', '"I’ll triple my buys"', '"The market is dead"'], 0, '', ''],
    ['Giai đoạn "chán nản" thường có đặc điểm:', 'The "despondency" stage features:', ['Thanh khoản thấp, ít người quan tâm, tin xấu không còn làm giá giảm nhiều', 'Thanh khoản kỷ lục', 'Hưng phấn', 'Mua đuổi'], ['Low turnover, little interest, bad news no longer hits prices', 'Record turnover', 'Euphoria', 'Chasing'], 0, '', ''],
    ['Vì sao nhật ký nên ghi cả cảm xúc?', 'Why record emotions in the journal?', ['Để nhận ra mối liên hệ giữa cảm xúc và quyết định sai', 'Để viết dài', 'Không cần', 'Để khoe'], ['To link emotions to poor decisions', 'To write more', 'Unneeded', 'To show off'], 0, '', ''],
    ['Thói quen hỗ trợ tâm lý giao dịch:', 'A habit that supports trading psychology:', ['Chuẩn bị trước phiên, nghỉ ngơi, vận động', 'Giao dịch khi mệt', 'Theo dõi giá 24/7', 'Không ngủ'], ['Pre-session prep, rest, exercise', 'Trading tired', 'Watching prices 24/7', 'No sleep'], 0, '', ''],
    ['Sau khi thua lớn, người giao dịch muốn "gỡ" ngay bằng vị thế lớn hơn. Đây là:', 'After a big loss a trader wants to "win it back" with a bigger position. This is:', ['Giao dịch trả thù — thích ứng ghét lỗ/vùng lỗ thích rủi ro', 'Kỷ luật tốt', 'Kim tự tháp đúng cách', 'Không vấn đề'], ['Revenge trading — loss-domain risk seeking', 'Good discipline', 'Proper pyramiding', 'No problem'], 0, '', ''],
    ['Bất hoà nhận thức gây hại vì:', 'Cognitive dissonance harms because:', ['Thay đổi niềm tin để biện minh thay vì sửa hành vi sai', 'Làm quyết định nhanh hơn', 'Không gây hại', 'Tăng đa dạng hoá'], ['Beliefs change to justify rather than fixing bad actions', 'Faster decisions', 'Harmless', 'More diversification'], 0, '', ''],
    ['Tâm lý đám đông hữu ích nhất cho:', 'Crowd psychology is most useful for:', ['Nhận diện cực trị rủi ro/cơ hội', 'Thời điểm chính xác từng phiên', 'Kế toán', 'Không gì'], ['Spotting risk/opportunity extremes', 'Exact daily timing', 'Accounting', 'Nothing'], 0, '', ''],
    ['Trang nhất báo chí đại chúng đồng loạt nói về cổ phiếu/crypto tăng phi mã thường gần:', 'Mass-media front pages celebrating soaring stocks/crypto usually come near:', ['Giai đoạn hưng phấn muộn', 'Đáy', 'Tích luỹ', 'Không liên quan'], ['Late euphoria', 'Bottoms', 'Accumulation', 'Unrelated'], 0, '', ''],
    ['Quy mô vị thế phù hợp tâm lý giúp:', 'Psychologically appropriate sizing helps:', ['Duy trì kỷ luật trong chuỗi thua', 'Tăng cảm xúc', 'Không gì', 'Tăng phí'], ['Maintain discipline through losing streaks', 'Raise emotions', 'Nothing', 'Raise fees'], 0, '', ''],
    ['Giai đoạn "hy vọng" và "nhẹ nhõm" thường xuất hiện:', '"Hope" and "relief" stages usually appear:', ['Sau đáy, đầu xu hướng tăng mới', 'Ở đỉnh', 'Giữa đợt giảm', 'Không bao giờ'], ['After the low, early in a new advance', 'At tops', 'Mid-decline', 'Never'], 0, '', ''],
    ['Thiên kiến kết quả có thể khiến người giao dịch:', 'Outcome bias can make traders:', ['Bỏ một hệ thống tốt sau chuỗi thua ngẫu nhiên', 'Giữ kỷ luật hơn', 'Không ảnh hưởng', 'Tăng kiểm định'], ['Abandon a good system after a random losing run', 'Be more disciplined', 'Unaffected', 'Test more'], 0, '', ''],
    ['"Cảm xúc của bạn là dữ liệu" nghĩa là:', '"Your emotions are data" means:', ['Dùng cảm xúc cực đoan của bản thân như tín hiệu cần kiểm tra lại', 'Giao dịch theo cảm xúc', 'Bỏ qua cảm xúc', 'Không có nghĩa'], ['Treat your extreme feelings as a signal to double-check', 'Trade on emotions', 'Ignore emotions', 'Meaningless'], 0, '', ''],
    ['Bài học chính của tâm lý nhà đầu tư:', 'Key lesson of investor psychology:', ['Quy trình và quy mô đúng giúp hành động có kỷ luật bất chấp cảm xúc', 'Loại bỏ hoàn toàn cảm xúc là dễ', 'Cảm xúc luôn đúng', 'Không cần quy trình'], ['Process and proper sizing enable discipline despite emotions', 'Eliminating emotions is easy', 'Emotions are always right', 'No process needed'], 0, '', '']
  ]);

  /* ================= L3-21 ================= */
  C.addLesson('l3-21', {
    goals: ['Giải thích vì sao nhóm có thể ra quyết định kém hơn cá nhân.', 'Nhận diện tư duy nhóm, phân cực nhóm, dòng thác thông tin và hiệu ứng thông tin chung.', 'Nêu điều kiện để "trí tuệ đám đông" hoạt động.', 'Thiết kế quy trình ra quyết định cho hội đồng đầu tư.'],
    body: () => `
<h3>1. Hai cái đầu có tốt hơn một?</h3>
<p>Về lý thuyết, nhóm gộp được nhiều thông tin và góc nhìn hơn. Thực tế, các nghiên cứu tâm lý cho thấy nhóm thường <b>không tốt hơn</b> — thậm chí kém hơn — thành viên giỏi nhất, và thường <b>tự tin hơn</b> mức đáng có.</p>
<h3>2. Các vấn đề của nhóm</h3>
<table class="tbl"><thead><tr><th>Hiện tượng</th><th>Mô tả</th></tr></thead><tbody>
<tr><td><b>Tư duy nhóm</b></td><td>Ưu tiên sự đồng thuận và hoà khí, ngại phản biện; ảo tưởng nhất trí</td></tr>
<tr><td><b>Phân cực nhóm</b></td><td>Thảo luận khiến quan điểm chung trở nên <b>cực đoan hơn</b> quan điểm trung bình ban đầu của các thành viên</td></tr>
<tr><td><b>Hiệu ứng thông tin chung</b></td><td>Nhóm dành phần lớn thời gian bàn về thông tin <b>ai cũng biết</b>, bỏ sót thông tin riêng của từng người — chính là giá trị gia tăng của nhóm</td></tr>
<tr><td><b>Dòng thác thông tin</b></td><td>Người phát biểu sau làm theo người trước (đặc biệt người có thâm niên), bỏ qua thông tin riêng</td></tr>
<tr><td><b>Lười biếng xã hội</b></td><td>Trách nhiệm bị pha loãng, ít người phân tích kỹ</td></tr>
<tr><td><b>Khuếch đại quá tự tin</b></td><td>Đồng thuận tạo cảm giác chắc chắn giả</td></tr></tbody></table>
<h3>3. Khi nào đám đông thông minh?</h3>
<p>Trung bình các ước lượng độc lập có thể rất chính xác, nhưng cần <b>bốn điều kiện</b>: (1) <b>đa dạng</b> thông tin/góc nhìn, (2) <b>độc lập</b> — không ảnh hưởng lẫn nhau, (3) <b>phân tán</b> — mỗi người dựa trên kiến thức cục bộ, (4) <b>cơ chế tổng hợp</b> phù hợp. Thị trường tài chính "thông minh" khi các điều kiện này được giữ; trở thành <b>bong bóng/hoảng loạn</b> khi tính độc lập sụp đổ (mọi người làm theo nhau).</p>
<div class="callout">Liên hệ PTKT: các chỉ báo tâm lý ngược (contrarian) hoạt động tốt nhất ở cực trị chính vì đó là lúc <b>tính độc lập của đám đông biến mất</b>.</div>
<h3>4. Thiết kế quy trình cho hội đồng đầu tư</h3>
<ol><li>Mỗi thành viên <b>ghi ước lượng/quan điểm độc lập</b> trước cuộc họp.</li>
<li>Người <b>ít thâm niên phát biểu trước</b>; trưởng nhóm phát biểu sau cùng.</li>
<li>Chỉ định <b>người phản biện</b> (devil's advocate) luân phiên; khuyến khích "đội đỏ".</li>
<li><b>Phân tích tiền nghiệm thất bại</b> (pre-mortem): "Giả sử một năm sau khoản đầu tư này thất bại — vì sao?"</li>
<li>Tập trung khai thác <b>thông tin riêng</b>, không lặp lại thông tin chung.</li>
<li>Quy tắc định lượng (mô hình trọng lượng bằng chứng, hệ thống) làm <b>neo khách quan</b>, giảm ảnh hưởng của người nói to nhất.</li>
<li>Lưu lại lập luận và kết quả để đánh giá sau.</li></ol>`,
    keys: ['Nhóm thường không tốt hơn thành viên giỏi nhất và tự tin quá mức.', 'Tư duy nhóm, phân cực nhóm, hiệu ứng thông tin chung, dòng thác thông tin, lười biếng xã hội, khuếch đại quá tự tin.', 'Trí tuệ đám đông cần: đa dạng, độc lập, phân tán, cơ chế tổng hợp; mất độc lập → bong bóng/hoảng loạn.', 'Chỉ báo ngược hiệu quả ở cực trị vì tính độc lập biến mất.', 'Quy trình: ước lượng độc lập trước, người ít thâm niên nói trước, người phản biện, pre-mortem, khai thác thông tin riêng, quy tắc định lượng, lưu hồ sơ.'],
    terms: [['Groupthink', 'Tư duy nhóm'], ['Group polarisation', 'Phân cực nhóm'], ['Common knowledge effect', 'Hiệu ứng thông tin chung'], ['Social loafing', 'Lười biếng xã hội'], ['Wisdom of crowds', 'Trí tuệ đám đông'], ['Devil’s advocate', 'Người phản biện'], ['Pre-mortem', 'Phân tích tiền nghiệm thất bại']]
  }, {
    goals: ['Explain why groups can decide worse than individuals.', 'Recognise groupthink, polarisation, cascades, common-knowledge effects.', 'State conditions for crowd wisdom.', 'Design an investment-committee process.'],
    body: () => `
<h3>1. Two heads?</h3><p>Groups often do no better than their best member and are overconfident.</p>
<h3>2. Group problems</h3><p>Groupthink, polarisation, common-knowledge effect, information cascades, social loafing, amplified overconfidence.</p>
<h3>3. Crowd wisdom</h3><p>Needs diversity, independence, decentralisation and aggregation; when independence collapses, bubbles and panics follow.</p><div class="callout">Contrarian sentiment works at extremes because independence vanishes.</div>
<h3>4. Committee process</h3><ol><li>Independent written views first</li><li>Juniors speak first</li><li>Devil’s advocate</li><li>Pre-mortem</li><li>Surface private information</li><li>Quantitative anchors</li><li>Record reasoning</li></ol>`,
    keys: ['Groups underperform.', 'Pathologies.', 'Four conditions.', 'Contrarian link.', 'Process design.'],
    terms: [['Common knowledge effect', 'Groups discuss shared rather than private information'], ['Pre-mortem', 'Imagining failure in advance']]
  }, [
    ['Nghiên cứu tâm lý cho thấy nhóm thường:', 'Psychology research shows groups often:', ['Không tốt hơn thành viên giỏi nhất và tự tin quá mức', 'Luôn tốt hơn mọi cá nhân', 'Không bao giờ sai', 'Ít tự tin hơn'], ['Do no better than their best member and are overconfident', 'Beat every individual', 'Never err', 'Are less confident'], 0, '', ''],
    ['Tư duy nhóm là:', 'Groupthink is:', ['Ưu tiên đồng thuận, ngại phản biện', 'Phản biện quá mức', 'Làm việc độc lập', 'Không có'], ['Prioritising consensus, avoiding dissent', 'Excess dissent', 'Working independently', 'None'], 0, '', ''],
    ['Phân cực nhóm nghĩa là sau thảo luận, quan điểm nhóm:', 'Group polarisation means after discussion the group view is:', ['Cực đoan hơn trung bình ban đầu', 'Ôn hoà hơn', 'Không đổi', 'Ngẫu nhiên'], ['More extreme than the initial average', 'More moderate', 'Unchanged', 'Random'], 0, '', ''],
    ['Hiệu ứng thông tin chung là:', 'The common knowledge effect is:', ['Nhóm bàn chủ yếu thông tin ai cũng biết, bỏ sót thông tin riêng', 'Nhóm chia sẻ mọi thông tin riêng', 'Không có thông tin', 'Thông tin bị cấm'], ['Groups dwell on shared info and miss private info', 'Groups share all private info', 'No info', 'Banned info'], 0, '', ''],
    ['Giá trị gia tăng thật của một nhóm đến từ:', 'A group’s real added value comes from:', ['Thông tin riêng và góc nhìn khác biệt của từng thành viên', 'Thông tin ai cũng biết', 'Sự đồng thuận nhanh', 'Người nói to nhất'], ['Members’ private information and diverse views', 'Shared info', 'Quick consensus', 'The loudest voice'], 0, '', ''],
    ['Dòng thác thông tin trong cuộc họp xảy ra khi:', 'An information cascade in a meeting occurs when:', ['Người phát biểu sau làm theo người trước, bỏ qua thông tin riêng', 'Mọi người viết ý kiến độc lập', 'Không ai nói', 'Có người phản biện'], ['Later speakers follow earlier ones, ignoring private info', 'Everyone writes independently', 'No one speaks', 'A devil’s advocate exists'], 0, '', ''],
    ['Bốn điều kiện cho trí tuệ đám đông:', 'Four conditions for crowd wisdom:', ['Đa dạng, độc lập, phân tán, cơ chế tổng hợp', 'Đồng nhất, phụ thuộc, tập trung, không tổng hợp', 'Chỉ cần đông người', 'Chỉ cần chuyên gia'], ['Diversity, independence, decentralisation, aggregation', 'Uniformity, dependence, centralisation, none', 'Just numbers', 'Just experts'], 0, '', ''],
    ['Thị trường dễ hình thành bong bóng khi điều kiện nào sụp đổ?', 'Markets form bubbles when which condition collapses?', ['Tính độc lập', 'Số lượng người', 'Thanh khoản', 'Giờ giao dịch'], ['Independence', 'Numbers', 'Liquidity', 'Hours'], 0, '', ''],
    ['Vì sao chỉ báo tâm lý ngược hoạt động tốt nhất ở cực trị?', 'Why do contrarian sentiment indicators work best at extremes?', ['Tính độc lập của đám đông biến mất — mọi người làm theo nhau', 'Ngẫu nhiên', 'Đám đông luôn sai', 'Không đúng'], ['Crowd independence disappears — everyone copies everyone', 'Randomly', 'The crowd is always wrong', 'False'], 0, '', ''],
    ['Để giảm dòng thác thông tin, nên để ai phát biểu trước?', 'To curb cascades, who should speak first?', ['Thành viên ít thâm niên', 'Trưởng nhóm', 'Người nói to nhất', 'Không ai'], ['Junior members', 'The leader', 'The loudest', 'Nobody'], 0, '', ''],
    ['Ghi quan điểm độc lập trước cuộc họp nhằm:', 'Writing independent views before meeting aims to:', ['Giữ tính độc lập và thông tin riêng', 'Tiết kiệm giấy', 'Tăng đồng thuận', 'Không mục đích'], ['Preserve independence and private info', 'Save paper', 'Boost consensus', 'No purpose'], 0, '', ''],
    ['Pre-mortem là:', 'A pre-mortem is:', ['Giả định khoản đầu tư đã thất bại và tìm lý do', 'Phân tích sau khi thất bại', 'Kiểm định ngược', 'Không có'], ['Assuming the investment failed and finding why', 'Post-failure analysis', 'Backtesting', 'None'], 0, '', ''],
    ['Vai trò của người phản biện (devil’s advocate):', 'The devil’s advocate’s role:', ['Chủ động đưa ra lập luận ngược để kiểm tra quan điểm chung', 'Đồng ý với trưởng nhóm', 'Ghi biên bản', 'Không có'], ['Argue the opposite to test the consensus', 'Agree with the leader', 'Take minutes', 'None'], 0, '', ''],
    ['Lười biếng xã hội trong nhóm là:', 'Social loafing is:', ['Trách nhiệm pha loãng, ít người phân tích kỹ', 'Làm việc quá sức', 'Phản biện mạnh', 'Không có'], ['Diluted responsibility, less thorough analysis', 'Overwork', 'Strong dissent', 'None'], 0, '', ''],
    ['Quy tắc định lượng giúp hội đồng đầu tư bằng cách:', 'Quantitative rules help committees by:', ['Tạo neo khách quan, giảm ảnh hưởng người nói to nhất', 'Tăng tư duy nhóm', 'Loại bỏ thảo luận', 'Không gì'], ['Providing an objective anchor, reducing the loudest voice’s sway', 'Raising groupthink', 'Ending discussion', 'Nothing'], 0, '', ''],
    ['Trung bình ước lượng độc lập của nhiều người thường chính xác vì:', 'Averages of independent estimates are often accurate because:', ['Sai số cá nhân ngẫu nhiên triệt tiêu nhau', 'Mọi người đều đúng', 'Có chuyên gia', 'Không đúng'], ['Individual random errors cancel', 'Everyone is right', 'Experts exist', 'False'], 0, '', ''],
    ['Nếu mọi người trong nhóm dùng cùng nguồn thông tin, trí tuệ đám đông:', 'If all members use the same information source, crowd wisdom:', ['Suy yếu do thiếu đa dạng', 'Mạnh hơn', 'Không đổi', 'Hoàn hảo'], ['Weakens for lack of diversity', 'Strengthens', 'Unchanged', 'Becomes perfect'], 0, '', ''],
    ['Đồng thuận nhanh và nhất trí trong hội đồng nên được xem là:', 'Quick unanimous agreement in committee should be seen as:', ['Dấu hiệu cần kiểm tra tư duy nhóm', 'Chắc chắn đúng', 'Hiệu quả tối đa', 'Không ý nghĩa'], ['A cue to check for groupthink', 'Surely right', 'Maximum efficiency', 'Meaningless'], 0, '', ''],
    ['Lưu lại lập luận và kết quả quyết định giúp:', 'Recording reasoning and outcomes helps:', ['Đánh giá chất lượng quy trình, tránh nhận thức muộn', 'Tăng thời gian họp', 'Không gì', 'Che giấu sai lầm'], ['Evaluate process quality and avoid hindsight', 'Longer meetings', 'Nothing', 'Hide mistakes'], 0, '', ''],
    ['Trong bong bóng, đám đông nhà đầu tư:', 'In bubbles, investor crowds:', ['Làm theo nhau, mất tính độc lập', 'Hoàn toàn độc lập', 'Đa dạng tối đa', 'Bi quan'], ['Copy each other, losing independence', 'Are fully independent', 'Are maximally diverse', 'Are pessimistic'], 0, '', ''],
    ['Khuếch đại quá tự tin trong nhóm nghĩa là:', 'Amplified overconfidence in groups means:', ['Đồng thuận tạo cảm giác chắc chắn giả', 'Nhóm luôn khiêm tốn', 'Không ảnh hưởng', 'Giảm rủi ro'], ['Consensus breeds false certainty', 'Groups stay humble', 'No effect', 'Lower risk'], 0, '', ''],
    ['Tình huống: hội đồng đồng thuận mua mạnh một ngành sau 20 phút, chỉ thảo luận các tin tích cực đã đăng báo. Vấn đề:', 'Case: a committee agrees in 20 minutes to buy a sector heavily, discussing only published positive news. Problem:', ['Tư duy nhóm + hiệu ứng thông tin chung', 'Không vấn đề', 'Quá thận trọng', 'Thiếu thanh khoản'], ['Groupthink + common-knowledge effect', 'None', 'Too cautious', 'Illiquidity'], 0, '', ''],
    ['Đội đỏ (red team) trong đầu tư có nhiệm vụ:', 'A red team in investing is tasked with:', ['Tấn công luận điểm đầu tư để tìm điểm yếu', 'Ủng hộ luận điểm', 'Giao dịch thay', 'Không có'], ['Attacking the thesis to find weaknesses', 'Supporting the thesis', 'Trading instead', 'None'], 0, '', ''],
    ['Trưởng nhóm phát biểu đầu tiên thường gây:', 'A leader speaking first often causes:', ['Dòng thác — mọi người neo theo ý kiến trưởng nhóm', 'Thảo luận đa dạng hơn', 'Không ảnh hưởng', 'Phản biện mạnh'], ['A cascade — everyone anchors on the leader', 'More diverse discussion', 'No effect', 'Strong dissent'], 0, '', ''],
    ['Cơ chế tổng hợp tốt cho trí tuệ đám đông có thể là:', 'A good aggregation mechanism for crowd wisdom:', ['Lấy trung vị/trung bình của các ước lượng độc lập', 'Theo ý người nói to nhất', 'Bỏ phiếu công khai lần lượt', 'Không tổng hợp'], ['Median/mean of independent estimates', 'The loudest view', 'Sequential open voting', 'No aggregation'], 0, '', ''],
    ['Bỏ phiếu công khai lần lượt trong hội đồng có nhược điểm:', 'Sequential open voting has the drawback:', ['Gây dòng thác thông tin', 'Quá độc lập', 'Không có', 'Quá chậm luôn'], ['It triggers cascades', 'Too independent', 'None', 'Always too slow'], 0, '', ''],
    ['Đa dạng trong nhóm đầu tư nên bao gồm:', 'Diversity in an investment team should include:', ['Phương pháp phân tích, kinh nghiệm, nguồn thông tin khác nhau', 'Chỉ giới tính', 'Không cần', 'Cùng trường phái'], ['Different methods, experience and information sources', 'Only gender', 'Unneeded', 'One school of thought'], 0, '', ''],
    ['Kết hợp nhà PTKT và nhà phân tích cơ bản trong một hội đồng có lợi vì:', 'Combining technicians and fundamentalists in a committee helps because:', ['Tăng đa dạng thông tin và góc nhìn', 'Tăng tư duy nhóm', 'Không lợi', 'Giảm thông tin'], ['It increases information and viewpoint diversity', 'Increases groupthink', 'No benefit', 'Less information'], 0, '', ''],
    ['Bài học chính của ra quyết định nhóm:', 'Key lesson of group decisions:', ['Nhóm chỉ thông minh khi giữ được độc lập và đa dạng — cần thiết kế quy trình', 'Nhóm luôn thông minh hơn', 'Không bao giờ dùng nhóm', 'Chỉ cần trưởng nhóm giỏi'], ['Groups are wise only with independence and diversity — design the process', 'Groups are always smarter', 'Never use groups', 'Just a good leader'], 0, '', ''],
    ['Hội đồng nên tập trung thời gian thảo luận vào:', 'A committee should spend its discussion time on:', ['Thông tin riêng và quan điểm bất đồng', 'Nhắc lại thông tin ai cũng biết', 'Khen ngợi trưởng nhóm', 'Không gì'], ['Private information and dissenting views', 'Repeating shared facts', 'Praising the leader', 'Nothing'], 0, '', '']
  ]);
})(window.LLW);
