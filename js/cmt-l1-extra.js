// © 2026 Lai Long Master TA. Bảo lưu mọi quyền. Không sao chép, chỉnh sửa hay dùng lại khi chưa được phép.
/* CMT Level 1 — two additional (harder, applied) self-check questions per lesson, bringing each to 10. Written by Lai Long Master TA. */
(function (L) {
  'use strict';
  const C = L.cmt;
  const Q = (q, o, a, e) => ({ q, o, a, e });
  const X = {
    'l1-01': [
      [Q('Một nhà giao dịch mua tại 50, xác định nhận định sai nếu giá đóng cửa dưới 46, mục tiêu 62. Tỷ lệ lợi nhuận/rủi ro là:', ['1:1', '2:1', '3:1', '4:1'], 2, 'Rủi ro 4, lợi nhuận kỳ vọng 12 → 3:1. Xác định trước điểm sai là ưu thế cốt lõi của PTKT.'),
        Q('Trên khung tuần giá tạo đỉnh/đáy cao dần, trên khung ngày 2 tuần gần nhất tạo đỉnh/đáy thấp dần. Cách hiểu hợp lý nhất:', ['Xu hướng dài hạn đã đảo chiều giảm', 'Một nhịp điều chỉnh ngắn hạn trong xu hướng tăng dài hạn', 'Thị trường không có xu hướng', 'Dữ liệu sai'], 1, 'Xu hướng nhiều cấp lồng nhau; khung nhỏ có thể ngược khung lớn trong các nhịp điều chỉnh.')],
      [Q('A trader buys at 50, is wrong below a 46 close, targets 62. Reward/risk:', ['1:1', '2:1', '3:1', '4:1'], 2, 'Risk 4, reward 12.'),
        Q('Weekly chart: higher highs/lows; daily chart last two weeks: lower highs/lows. Best reading:', ['Long-term reversal', 'A short-term correction within a long-term uptrend', 'No trend', 'Bad data'], 1, 'Nested trends.')]
    ],
    'l1-02': [
      [Q('Chỉ số Công nghiệp và Vận tải cùng vượt đỉnh cũ, nhưng khối lượng giảm dần ở mỗi nhịp tăng. Theo Dow:', ['Không có tín hiệu', 'Xu hướng tăng được xác nhận bởi giá; khối lượng giảm là cảnh báo phụ', 'Tín hiệu bán ngay', 'Hai chỉ số phân kỳ'], 1, 'Giá là tín hiệu chính; khối lượng là bằng chứng phụ mang tính cảnh báo.'),
        Q('Nhịp tăng cấp 1 đi từ 100 lên 160. Một nhịp điều chỉnh cấp 2 điển hình theo Dow sẽ kết thúc trong vùng khoảng:', ['155–158', '120–140', '90–100', '60–80'], 1, 'Thoái lui 1/3–2/3 của 60 điểm: 160 − 20 = 140 đến 160 − 40 = 120.')],
      [Q('Industrials and Transports both make new highs on shrinking volume. Per Dow:', ['No signal', 'Uptrend confirmed by price; falling volume is a secondary warning', 'Sell now', 'Non-confirmation'], 1, 'Price decides.'),
        Q('A primary advance from 100 to 160. A typical secondary reaction ends near:', ['155–158', '120–140', '90–100', '60–80'], 1, '1/3–2/3 of 60.')]
    ],
    'l1-03': [
      [Q('Cổ phiếu A tăng từ 10 lên 20; cổ phiếu B tăng từ 100 lên 150 trong cùng giai đoạn. Trên thang LOG, đoạn tăng nào dài hơn?', ['A', 'B', 'Bằng nhau', 'Không so được'], 0, 'A tăng 100%, B tăng 50%; thang log thể hiện phần trăm.'),
        Q('Một cổ phiếu chia tách 1:2 nhưng nguồn dữ liệu không điều chỉnh. Hệ quả khả dĩ nhất trên biểu đồ:', ['Khối lượng giảm một nửa', 'Một "khoảng trống" giảm 50% giả, có thể kích hoạt tín hiệu thủng hỗ trợ sai', 'Không ảnh hưởng', 'Biểu đồ chuyển sang thang log'], 1, 'Sự kiện doanh nghiệp không phải cung cầu.')],
      [Q('Stock A rises 10→20, stock B 100→150. On a LOG scale which move is longer?', ['A', 'B', 'Equal', 'Cannot compare'], 0, '100% vs 50%.'),
        Q('A 1:2 split left unadjusted most likely causes:', ['Half volume', 'A false 50% gap that can trigger a false support break', 'Nothing', 'A log scale'], 1, '')]
    ],
    'l1-04': [
      [Q('Giá phá kháng cự 50 với khối lượng lớn, tăng lên 56 rồi quay về 50.5 với khối lượng thấp và bật lên. Đây là minh hoạ của:', ['Phá vỡ giả', 'Nguyên lý đổi vai — kháng cự cũ thành hỗ trợ', 'Đỉnh đôi', 'Không có ý nghĩa'], 1, 'Nhịp quay lại kiểm tra thành công vùng phá vỡ.'),
        Q('Đường xu hướng tăng được vẽ qua hai đáy trên thang số học bị phá, nhưng trên thang log thì chưa. Xử lý chuyên nghiệp:', ['Chọn thang cho kết quả mình thích', 'Nhận thức sự khác biệt, xem đó là vùng cảnh báo và chờ thêm xác nhận từ cấu trúc giá', 'Bỏ qua đường xu hướng', 'Luôn tin thang số học'], 1, 'Với dữ liệu dài hạn, hai thang có thể cho điểm phá khác nhau.')],
      [Q('Price breaks 50 resistance on heavy volume, runs to 56, returns to 50.5 on light volume and bounces. This shows:', ['A false breakout', 'Polarity — old resistance as support', 'A double top', 'Nothing'], 1, ''),
        Q('An uptrend line breaks on an arithmetic scale but not on a log scale. Professional handling:', ['Pick the convenient scale', 'Treat it as a warning zone and wait for structural confirmation', 'Ignore trendlines', 'Trust arithmetic'], 1, '')]
    ],
    'l1-05': [
      [Q('Kháng cự 100, ATR 2. Bạn dùng bộ lọc 0.5 ATR theo giá đóng cửa. Mức đóng cửa tối thiểu để xác nhận phá vỡ là:', ['100', '100.5', '101', '102'], 2, '100 + 0.5 × 2 = 101.'),
        Q('Nhịp tăng từ 40 lên 80. Mức thoái lui Fibonacci 61.8% nằm ở:', ['55.28', '64.72', '60', '49.44'], 0, '80 − 0.618 × 40 = 55.28.')],
      [Q('Resistance 100, ATR 2, 0.5-ATR close filter. Minimum confirming close:', ['100', '100.5', '101', '102'], 2, ''),
        Q('Advance 40→80. The 61.8% retracement is at:', ['55.28', '64.72', '60', '49.44'], 0, '')]
    ],
    'l1-06': [
      [Q('SMA 3 kỳ của chuỗi giá 10, 12, 14, 16 tại kỳ cuối là:', ['13', '14', '15', '16'], 1, '(12 + 14 + 16) / 3 = 14.'),
        Q('Giá liên tục cắt qua lại MA50 trong 3 tháng và MA50 gần như nằm ngang. Kết luận hợp lý:', ['Xu hướng tăng mạnh', 'Thị trường đi ngang — tín hiệu giao cắt kém tin cậy', 'Xu hướng giảm mạnh', 'Nên rút ngắn MA xuống 5'], 1, 'MA phẳng và giao cắt liên tục là đặc trưng của whipsaw.')],
      [Q('3-period SMA of 10, 12, 14, 16 at the last bar:', ['13', '14', '15', '16'], 1, ''),
        Q('Price whipsaws around a flat 50-MA for three months:', ['Strong uptrend', 'A range — crossovers unreliable', 'Strong downtrend', 'Use a 5-MA'], 1, '')]
    ],
    'l1-07': [
      [Q('Đáy hai lần ở 40, đỉnh giữa ở 52. Giá đóng cửa trên 52 với khối lượng lớn. Mục tiêu đo tối thiểu:', ['52', '58', '64', '76'], 2, 'Chiều cao 12, cộng vào 52 = 64.'),
        Q('Tam giác cân trong xu hướng tăng, giá trôi đến sát đỉnh tam giác mới phá lên với khối lượng thấp. Đánh giá:', ['Tín hiệu rất mạnh', 'Tín hiệu yếu, dễ thất bại', 'Chắc chắn đảo chiều giảm', 'Không phải tam giác'], 1, 'Phá vỡ đáng tin thường trước khoảng 3/4 chiều dài và kèm khối lượng.')],
      [Q('Double bottom at 40, middle peak 52, heavy-volume close above 52. Minimum target:', ['52', '58', '64', '76'], 2, ''),
        Q('A symmetrical triangle breaks up near its apex on low volume:', ['Very strong', 'Weak and failure-prone', 'Certain reversal down', 'Not a triangle'], 1, '')]
    ],
    'l1-08': [
      [Q('Sau 6 tháng tăng, giá mở gap tăng với khối lượng cực lớn, 2 phiên sau gap giảm để lại cụm giá cô lập. Mẫu hình:', ['Gap phá vỡ', 'Đảo chiều dạng đảo (island) sau gap kiệt sức', 'Gap tiếp diễn', 'Inside bar'], 1, ''),
        Q('Gap tiếp diễn xuất hiện ở 70 trong nhịp tăng bắt đầu từ 50. Mục tiêu ước lượng theo nguyên tắc "gap ở giữa nước đi":', ['70', '80', '90', '100'], 2, 'Nửa đầu 20 điểm → nửa sau ≈ 20 điểm: 90.')],
      [Q('After a six-month rise, a heavy-volume gap up then a gap down two bars later isolates a cluster:', ['Breakaway gap', 'Island reversal after an exhaustion gap', 'Runaway gap', 'Inside bar'], 1, ''),
        Q('A runaway gap at 70 in a move that began at 50. Measuring-gap target:', ['70', '80', '90', '100'], 2, '')]
    ],
    'l1-09': [
      [Q('Phiên: cao 20, thấp 16, đóng 19, khối lượng 1.000. Đóng góp vào đường A/D (Chaikin) là:', ['+1.000', '+500', '−500', '+250'], 1, '[(19−16) − (20−19)] / 4 = 0.5 → +500.'),
        Q('Hợp đồng tương lai: giá tăng mạnh 3 tuần, OI giảm liên tục. Cách đọc hợp lý:', ['Tiền mới mua vào mạnh', 'Nhịp tăng chủ yếu do đóng vị thế bán — nền tảng yếu', 'Xu hướng giảm mạnh', 'Không có ý nghĩa'], 1, 'Giá tăng + OI giảm = short covering.')],
      [Q('High 20, low 16, close 19, volume 1,000. A/D contribution:', ['+1,000', '+500', '−500', '+250'], 1, 'CLV 0.5.'),
        Q('Futures rally three weeks while OI falls:', ['Strong new buying', 'Mostly short covering — weak base', 'Strong downtrend', 'Meaningless'], 1, '')]
    ],
    'l1-10': [
      [Q('Nến có thân nhỏ ở đỉnh biên độ, bóng dưới dài gấp 3 thân, xuất hiện ngay dưới kháng cự sau 5 phiên tăng. Tên và ý nghĩa:', ['Búa — tín hiệu tăng', 'Người treo cổ — cảnh báo giảm', 'Sao băng — tín hiệu tăng', 'Doji — trung tính'], 1, 'Cùng hình dạng búa nhưng sau nhịp tăng.'),
        Q('Sau nến búa tại hỗ trợ, phiên kế tiếp mở thấp và đóng cửa dưới đáy bóng nến búa. Kết luận:', ['Tín hiệu búa được xác nhận', 'Tín hiệu búa bị vô hiệu — cắt lỗ', 'Mua thêm', 'Không có ý nghĩa'], 1, 'Đáy bóng nến là điểm vô hiệu tự nhiên.')],
      [Q('Small body at the top of the range, lower shadow 3× the body, just below resistance after five up days:', ['Hammer — bullish', 'Hanging man — bearish warning', 'Shooting star — bullish', 'Doji'], 1, ''),
        Q('After a hammer at support, the next bar closes below the hammer’s low:', ['Hammer confirmed', 'Hammer invalidated — stop out', 'Buy more', 'Meaningless'], 1, '')]
    ],
    'l1-11': [
      [Q('P&F ô 1 điểm, đảo chiều 3 ô. Cột X lên đến 60; giá đóng cửa sau đó 58, rồi 57. Cột O mới:', ['Mở khi giá 58', 'Mở khi giá 57 (giảm đủ 3 ô từ 60)', 'Không bao giờ mở', 'Mở khi giá 59'], 1, 'Cần giảm ít nhất 3 ô từ X cao nhất.'),
        Q('Đếm dọc: cột X phá vỡ đầu tiên dài 8 ô, ô 2 điểm, đảo chiều 3 ô, đáy cột ở 40. Mục tiêu:', ['56', '64', '88', '72'], 2, '40 + 8 × 2 × 3 = 88.')],
      [Q('Box 1, 3-box reversal. X column tops at 60; closes then 58, 57. New O column opens at:', ['58', '57 (three boxes down)', 'Never', '59'], 1, ''),
        Q('Vertical count: first breakout X column 8 boxes, box 2, 3-box, base 40. Target:', ['56', '64', '88', '72'], 2, '')]
    ],
    'l1-12': [
      [Q('Đếm sóng: nhịp tăng gồm 3 sóng nhỏ, sau đó giá giảm sâu. Theo Elliott, nhịp tăng 3 sóng đó nhiều khả năng là:', ['Sóng đẩy hoàn chỉnh', 'Một sóng điều chỉnh (ngược xu hướng lớn hơn)', 'Sóng 3 mở rộng', 'Không thể xác định'], 1, 'Sóng đẩy chia 5; cấu trúc 3 sóng gợi ý điều chỉnh.'),
        Q('Ở sóng 5, giá lập đỉnh mới nhưng RSI và độ rộng thấp hơn sóng 3. Đây là:', ['Xác nhận sóng 5 mạnh nhất', 'Phân kỳ điển hình của sóng 5 — cảnh báo kết thúc chu kỳ', 'Sóng B', 'Lỗi đếm chắc chắn'], 1, '')],
      [Q('A rise in three sub-waves followed by a deep decline. Elliott says the rise was likely:', ['A complete impulse', 'A correction', 'An extended wave 3', 'Unknowable'], 1, ''),
        Q('Wave 5 makes a new high but RSI and breadth are below wave 3:', ['Strongest wave 5', 'Typical fifth-wave divergence — end-of-cycle warning', 'Wave B', 'Certain miscount'], 1, '')]
    ],
    'l1-13': [
      [Q('Sóng 1: 100→120. Sóng 2 kết thúc ở 108. Sóng 3 theo tỷ lệ 161.8% sóng 1 (tính từ đáy sóng 2) nhắm tới khoảng:', ['120', '132.4', '140.4', '161.8'], 2, '108 + 1.618 × 20 = 140.36.'),
        Q('Đang đếm sóng 4. Đỉnh sóng 1 là 120. Giá giảm xuống 118. Kết luận:', ['Sóng 4 vẫn hợp lệ', 'Vi phạm quy tắc chồng lấn — phải đếm lại (trừ khi là diagonal)', 'Sóng 5 sẽ mạnh', 'Sóng 2 kéo dài'], 1, '')],
      [Q('Wave 1 100→120; wave 2 ends at 108. A 161.8% wave 3 from the wave-2 low targets about:', ['120', '132.4', '140.4', '161.8'], 2, ''),
        Q('Counting wave 4; wave 1 topped at 120; price falls to 118:', ['Still valid', 'Overlap rule broken — recount (unless diagonal)', 'Strong wave 5', 'Extended wave 2'], 1, '')]
    ],
    'l1-14': [
      [Q('Hôm nay: 200 mã tăng, 300 mã giảm; KL mã tăng 80 triệu, KL mã giảm 40 triệu. TRIN là:', ['0.33', '0.67', '1.5', '3.0'], 0, '(200/300) / (80/40) = 0.667 / 2 = 0.33: khối lượng dồn mạnh vào mã tăng.'),
        Q('McClellan Oscillator vừa cắt lên trên 0 sau thời gian dài ở vùng âm sâu. Gợi ý:', ['Độ rộng xấu đi', 'Độ rộng cải thiện — thay đổi ngắn–trung hạn tích cực', 'Không có ý nghĩa', 'Đỉnh dài hạn'], 1, '')],
      [Q('200 up, 300 down; up volume 80M, down volume 40M. TRIN:', ['0.33', '0.67', '1.5', '3.0'], 0, '0.667 / 2.'),
        Q('McClellan crosses above zero after a long deep negative stretch:', ['Worsening breadth', 'Improving breadth', 'Meaningless', 'Major top'], 1, '')]
    ],
    'l1-15': [
      [Q('Chu kỳ trội ước lượng 40 ngày. Theo nguyên lý hài hoà, chu kỳ nhỏ hơn kế tiếp thường khoảng:', ['10 ngày', '20 ngày', '35 ngày', '80 ngày'], 1, 'Quan hệ thường gấp 2.'),
        Q('Trong chu kỳ 40 ngày, đỉnh xuất hiện ở ngày 12 và giá kết thúc chu kỳ dưới đáy trước. Điều này cho thấy:', ['Lệch phải — xu hướng tăng', 'Lệch trái — xu hướng giảm', 'Đồng bộ', 'Không ý nghĩa'], 1, 'Đỉnh trước điểm giữa (ngày 20) và đáy thấp hơn.')],
      [Q('Dominant cycle 40 days. The next shorter harmonic is typically:', ['10', '20', '35', '80'], 1, ''),
        Q('In a 40-day cycle the crest comes on day 12 and the cycle ends below the prior trough:', ['Right translation — uptrend', 'Left translation — downtrend', 'Synchronicity', 'Meaningless'], 1, '')]
    ],
    'l1-16': [
      [Q('Khoảng cách các đáy (ngày): 38, 42, 40, 41. Đáy gần nhất cách đây 30 ngày. Vùng thời gian đáy kế tiếp hợp lý:', ['Ngay hôm nay', 'Khoảng 8–12 ngày tới', 'Sau 40 ngày nữa', 'Không dự báo được'], 1, 'Chu kỳ ≈ 40 ± 2; còn khoảng 10 ± 2 ngày.'),
        Q('Đến vùng thời gian đáy nhưng giá vẫn lập đáy thấp hơn, không có tín hiệu đảo chiều. Xử lý đúng:', ['Mua vì "đã đến ngày"', 'Kiên nhẫn chờ xác nhận giá; có thể chu kỳ kéo dài hoặc đảo pha', 'Bán khống mạnh', 'Bỏ hoàn toàn phân tích chu kỳ'], 1, 'Chu kỳ cho thời gian, giá cho xác nhận.')],
      [Q('Trough spacing 38, 42, 40, 41; last trough 30 days ago. Next low window:', ['Today', 'About 8–12 days ahead', '40 days ahead', 'Unknowable'], 1, ''),
        Q('The window arrives but price keeps making lower lows without a reversal signal:', ['Buy because it’s "time"', 'Wait for price confirmation; the cycle may stretch or invert', 'Short heavily', 'Abandon cycles'], 1, '')]
    ],
    'l1-17': [
      [Q('Bạn đặt lệnh dừng bán ở 48 khi giá 50. Qua đêm có tin xấu, giá mở cửa 44. Lệnh của bạn nhiều khả năng khớp ở:', ['48', 'Khoảng 44 (trượt giá do gap)', 'Không khớp', '50'], 1, 'Lệnh dừng thành lệnh thị trường khi kích hoạt.'),
        Q('Kiểm định chiến lược trên danh sách cổ phiếu VN30 hiện tại cho giai đoạn 10 năm trước. Sai lệch chính:', ['Không có', 'Thiên lệch sống sót — bỏ sót mã đã bị loại khỏi rổ', 'Thiên lệch neo', 'Thiếu khối lượng'], 1, '')],
      [Q('Sell stop at 48 with price 50; bad news overnight, open at 44. Likely fill:', ['48', 'Around 44 (gap slippage)', 'No fill', '50'], 1, ''),
        Q('Backtesting today’s VN30 members over the past ten years mainly suffers from:', ['Nothing', 'Survivorship bias', 'Anchoring', 'Missing volume'], 1, '')]
    ],
    'l1-18': [
      [Q('Cổ phiếu giá 30.000đ, trả cổ tức tiền mặt 2.000đ. Ngày giao dịch không hưởng quyền, giá tham chiếu điều chỉnh khoảng:', ['30.000', '28.000', '32.000', '15.000'], 1, 'Giá giảm bằng cổ tức.'),
        Q('Short interest bằng 12 ngày khối lượng trung bình, giá vừa phá kháng cự lớn. Rủi ro/cơ hội nổi bật:', ['Không có', 'Short squeeze có thể khuếch đại nhịp tăng', 'Chắc chắn giảm', 'Cổ tức tăng'], 1, '')],
      [Q('A 30,000 stock pays a 2,000 cash dividend. Ex-date reference price ≈', ['30,000', '28,000', '32,000', '15,000'], 1, ''),
        Q('Short interest = 12 days to cover and price breaks major resistance:', ['Nothing', 'A short squeeze may amplify the rally', 'Certain decline', 'Higher dividend'], 1, '')]
    ],
    'l1-19': [
      [Q('Chỉ số trọng số giá gồm 3 mã: 100, 50, 10 (ước số 3). Mã giá 10 tăng gấp đôi. Chỉ số tăng khoảng:', ['50%', '6.25%', '20%', '1%'], 1, 'Tổng 160 → 170: +6.25%.'),
        Q('Chỉ số vốn hoá VN tăng 3% trong tuần, nhưng chỉ số trọng số bằng nhau giảm 1%. Đọc:', ['Thị trường khoẻ toàn diện', 'Vài mã vốn hoá lớn kéo chỉ số; đa số cổ phiếu yếu', 'Lỗi dữ liệu', 'Không ý nghĩa'], 1, '')],
      [Q('Price-weighted index of 100, 50, 10 (divisor 3); the 10 stock doubles. Index change:', ['50%', '6.25%', '20%', '1%'], 1, '160 → 170.'),
        Q('Cap-weighted index +3% while the equal-weight version −1%:', ['Broad health', 'A few large caps carry it; most stocks weak', 'Data error', 'Nothing'], 1, '')]
    ],
    'l1-20': [
      [Q('Trái phiếu duration 8 năm, lợi suất giảm 0.5%. Giá thay đổi xấp xỉ:', ['−4%', '+4%', '+0.5%', '+8%'], 1, '≈ −8 × (−0.5%) = +4%.'),
        Q('Lợi suất 2 năm vượt lợi suất 10 năm và chênh lệch tín dụng doanh nghiệp đang mở rộng. Bức tranh:', ['Kinh tế tăng tốc, rủi ro thấp', 'Cảnh báo suy thoái và tâm lý tránh rủi ro', 'Lạm phát giảm chắc chắn', 'Không ý nghĩa'], 1, '')],
      [Q('Duration 8, yields −0.5%. Price change ≈', ['−4%', '+4%', '+0.5%', '+8%'], 1, ''),
        Q('2-year yield above 10-year and widening credit spreads:', ['Acceleration, low risk', 'Recession warning and risk-off', 'Certain disinflation', 'Nothing'], 1, '')]
    ],
    'l1-21': [
      [Q('Mua 2 hợp đồng VN30F ở 1.800, đóng ở 1.785 (hệ số 100.000đ/điểm). Lãi/lỗ:', ['−1.500.000đ', '−3.000.000đ', '+3.000.000đ', '−300.000đ'], 1, '−15 điểm × 100.000 × 2.'),
        Q('Hợp đồng tháng gần giá cao hơn hẳn các tháng xa và chênh lệch ngày càng lớn. Thị trường đang:', ['Contango — dư cung', 'Backwardation — khan hiếm, cầu tức thời mạnh', 'Cân bằng', 'Đáo hạn'], 1, '')],
      [Q('Long 2 VN30F at 1,800, exit 1,785 (100,000 VND/pt). P&L:', ['−1.5M', '−3.0M', '+3.0M', '−0.3M'], 1, ''),
        Q('Nearby far above deferred months and widening:', ['Contango — surplus', 'Backwardation — scarcity', 'Balance', 'Expiry'], 1, '')]
    ],
    'l1-22': [
      [Q('ETF 3x theo chỉ số. Chỉ số: +5%, −5%, +5%, −5%. ETF (cân bằng hằng ngày) sau 4 ngày khoảng:', ['0%', '−0.5%', '−4.4%', '+15%'], 2, '(1.15 × 0.85)² ≈ 0.9555 → −4.4%; chỉ số ≈ −0.5%.'),
        Q('ETF giao dịch với mức chiết khấu kéo dài 5% so với NAV, thanh khoản kém. Nguyên nhân khả dĩ:', ['Cơ chế tạo lập/mua lại vận hành tốt', 'Kinh doanh chênh lệch bị hạn chế (chi phí, thanh khoản tài sản cơ sở)', 'Không thể xảy ra', 'Do cổ tức'], 1, '')],
      [Q('3x daily ETF; index +5, −5, +5, −5%. ETF after four days ≈', ['0%', '−0.5%', '−4.4%', '+15%'], 2, ''),
        Q('An illiquid ETF holds a persistent 5% discount to NAV:', ['Arbitrage works well', 'Arbitrage is constrained', 'Impossible', 'Dividends'], 1, '')]
    ],
    'l1-23': [
      [Q('USD/JPY tăng từ 150.00 lên 151.20. Đây là:', ['12 pip', '120 pip', '1.200 pip', '1.2 pip'], 1, 'Với cặp JPY, pip = 0.01: 1.20 / 0.01 = 120.'),
        Q('Ngân hàng trung ương nước A bất ngờ tăng lãi suất mạnh, nước B giữ nguyên. Tác động thường thấy lên cặp A/B:', ['Giảm', 'Tăng — đồng A hấp dẫn hơn', 'Không đổi', 'Không dự báo được'], 1, 'Chênh lệch lãi suất là động lực chính.')],
      [Q('USD/JPY 150.00 → 151.20:', ['12 pips', '120 pips', '1,200 pips', '1.2 pips'], 1, ''),
        Q('Country A hikes sharply, B holds. Pair A/B typically:', ['Falls', 'Rises', 'Unchanged', 'Unpredictable'], 1, '')]
    ],
    'l1-24': [
      [Q('Cổ phiếu 48, put strike 50 có phí 4. Giá trị nội tại và giá trị thời gian lần lượt là:', ['2 và 2', '4 và 0', '0 và 4', '2 và 4'], 0, 'Nội tại = 50 − 48 = 2; thời gian = 4 − 2 = 2.'),
        Q('Theo put–call parity (bỏ lãi suất, cổ tức): S = 100, K = 100, call = 6. Put xấp xỉ:', ['6', '0', '12', '106'], 0, 'C − P = S − K = 0 → P ≈ C.')],
      [Q('Stock 48, 50-put at 4. Intrinsic and time value:', ['2 and 2', '4 and 0', '0 and 4', '2 and 4'], 0, ''),
        Q('Parity (ignore rates, dividends): S = K = 100, call 6. Put ≈', ['6', '0', '12', '106'], 0, '')]
    ],
    'l1-25': [
      [Q('IV = 40%/năm, cổ phiếu 50. Biên độ ±1σ kỳ vọng trong 1 tuần (5 phiên, 252 phiên/năm):', ['±0.9', '±2.8', '±5.0', '±20'], 1, '50 × 0.40 × √(5/252) ≈ 50 × 0.40 × 0.141 ≈ 2.8.'),
        Q('Trước báo cáo lợi nhuận, IV tăng vọt; sau báo cáo, giá đi đúng hướng mua call nhưng call vẫn lỗ. Nguyên nhân chính:', ['Phí giao dịch', 'IV sụt mạnh sau sự kiện (vega) lớn hơn lãi từ biến động giá', 'Delta bằng 0', 'Do lãi suất'], 1, 'Hiện tượng "IV crush".')],
      [Q('IV 40%, stock 50. 1-week (5 of 252 days) ±1σ:', ['±0.9', '±2.8', '±5.0', '±20'], 1, ''),
        Q('IV spikes before earnings; price moves your way but the call still loses:', ['Fees', 'Post-event IV crush outweighs the price gain', 'Zero delta', 'Rates'], 1, '')]
    ],
    'l1-26': [
      [Q('VIX = 36, S&P 500 = 4.800. Biên độ ±1σ kỳ vọng 30 ngày khoảng:', ['±170', '±500', '±1.730', '±36'], 1, '36/√12 ≈ 10.4% × 4.800 ≈ 500.'),
        Q('VIX tăng vọt lên trên dải Bollinger trên rồi đóng cửa quay lại trong dải. Cách dùng phổ biến:', ['Tín hiệu đỉnh cổ phiếu', 'Gợi ý đáy ngắn hạn của cổ phiếu', 'Mua ETP VIX dài hạn', 'Không ý nghĩa'], 1, 'Sợ hãi đạt cực trị rồi hạ nhiệt.')],
      [Q('VIX 36, S&P 4,800. 30-day ±1σ ≈', ['±170', '±500', '±1,730', '±36'], 1, ''),
        Q('VIX closes back inside its upper Bollinger Band after spiking above it:', ['Stock top', 'Suggests a short-term stock low', 'Buy long-VIX ETPs', 'Nothing'], 1, '')]
    ],
    'l1-27': [
      [Q('Một quỹ dùng thông tin báo cáo tài chính công khai và liên tục vượt trội sau điều chỉnh rủi ro trong 20 năm. Điều này mâu thuẫn trực tiếp với:', ['Dạng yếu', 'Dạng bán mạnh', 'Dạng mạnh', 'Không dạng nào'], 1, 'Dạng bán mạnh: thông tin công khai đã phản ánh vào giá.'),
        Q('100 quỹ chọn cổ phiếu ngẫu nhiên; sau 5 năm, quỹ tốt nhất vượt trội rõ rệt. Bài học:', ['Quỹ đó chắc chắn có kỹ năng', 'Trong số đông, may mắn đơn thuần cũng tạo ra "người thắng" — cần kiểm định', 'EMH sai', 'Nên mua quỹ đó'], 1, '')],
      [Q('A fund using public financial statements beats the market risk-adjusted for 20 years. This contradicts:', ['Weak form', 'Semi-strong form', 'Strong form', 'None'], 1, ''),
        Q('100 random-picking funds; after five years the best clearly outperforms:', ['It surely has skill', 'Among many, luck alone produces winners — test it', 'EMH is false', 'Buy it'], 1, '')]
    ],
    'l1-28': [
      [Q('Rf = 4%, Rm = 9%, β = 0.8, danh mục đạt 9%. Alpha:', ['0%', '+1%', '+5%', '−1%'], 1, 'CAPM = 4 + 0.8 × 5 = 8%; alpha = 9 − 8 = +1%.'),
        Q('Một "bất thường" lịch được công bố rộng rãi rồi biến mất trong dữ liệu sau đó. Cách giải thích hợp lý:', ['Thị trường ngừng giao dịch', 'Bị khai thác đến hết sau khi phổ biến (hoặc vốn là đào bới dữ liệu)', 'Bằng chứng chống tài chính hành vi', 'Lỗi dữ liệu chắc chắn'], 1, '')],
      [Q('Rf 4%, Rm 9%, β 0.8, portfolio 9%. Alpha:', ['0%', '+1%', '+5%', '−1%'], 1, ''),
        Q('A published calendar anomaly then disappears:', ['Trading stopped', 'Arbitraged away after publicity (or was data-mined)', 'Evidence against behavioural finance', 'Certain data error'], 1, '')]
    ],
    'l1-29': [
      [Q('Lựa chọn A: chắc chắn mất 800. Lựa chọn B: 85% mất 1.000, 15% không mất gì. Đa số chọn B. Lý thuyết triển vọng giải thích bằng:', ['Né rủi ro ở vùng lỗ', 'Thích rủi ro ở vùng lỗ', 'Ghét lãi', 'Đại diện'], 1, 'Hàm giá trị lồi ở vùng lỗ.'),
        Q('Nhà đầu tư bán cổ phiếu vừa lãi 10% nhưng giữ cổ phiếu lỗ 30% "vì chưa bán thì chưa lỗ". Hai thiên kiến chính:', ['Đại diện và sẵn có', 'Hiệu ứng phân bổ và neo vào giá mua', 'Tự tin thái quá và khung', 'Bảo thủ và hiện trạng'], 1, '')],
      [Q('A: sure loss of 800. B: 85% lose 1,000, 15% lose nothing. Most choose B because of:', ['Risk aversion in losses', 'Risk seeking in losses', 'Gain aversion', 'Representativeness'], 1, ''),
        Q('Selling a 10% winner but holding a 30% loser "since it isn’t a loss until sold":', ['Representativeness and availability', 'Disposition effect and anchoring to cost', 'Overconfidence and framing', 'Conservatism and status quo'], 1, '')]
    ],
    'l1-30': [
      [Q('Hai cổ phiếu đại diện cùng một tài sản, đáng lẽ giá bằng nhau, đang lệch 10%. Bạn mua mã rẻ, bán khống mã đắt; sau 6 tháng chênh lệch lên 18%. Rủi ro nào đã xảy ra?', ['Rủi ro tín dụng', 'Rủi ro nhà giao dịch nhiễu — sai lệch lớn thêm trước khi thu hẹp', 'Rủi ro lãi suất', 'Không có rủi ro'], 1, ''),
        Q('Quỹ kinh doanh chênh lệch bị nhà đầu tư rút vốn đúng lúc chênh lệch lớn nhất, buộc phải đóng vị thế. Đây là:', ['Ràng buộc vốn', 'Rủi ro cơ bản', 'Luật một giá', 'Hiệu quả thị trường'], 0, '')],
      [Q('Twin shares mispriced 10%; you go long cheap / short rich and six months later the gap is 18%:', ['Credit risk', 'Noise-trader risk', 'Rate risk', 'No risk'], 1, ''),
        Q('An arbitrage fund faces redemptions exactly when spreads are widest:', ['Capital constraints', 'Fundamental risk', 'Law of one price', 'Efficiency'], 0, '')]
    ],
    'l1-31': [
      [Q('Tin lợi nhuận tốt bất ngờ; giá tăng dần trong 3 tháng sau đó. Hiện tượng hành vi phù hợp nhất:', ['Phản ứng thái quá', 'Phản ứng chậm do thiên kiến bảo thủ', 'Ghét lỗ', 'Thác thông tin ngược'], 1, ''),
        Q('Quỹ cân bằng tự động bán cổ phiếu khi giá giảm, nhà đầu tư bị gọi ký quỹ cũng bán. Cơ chế làm nhịp giảm mạnh hơn là:', ['Phản hồi âm', 'Phản hồi dương', 'Luật một giá', 'Kinh doanh chênh lệch'], 1, '')],
      [Q('A positive earnings surprise; price drifts up for three months:', ['Overreaction', 'Underreaction from conservatism', 'Loss aversion', 'Reverse cascade'], 1, ''),
        Q('Rebalancing sellers and margin calls sell into a decline:', ['Negative feedback', 'Positive feedback', 'Law of one price', 'Arbitrage'], 1, '')]
    ],
    'l1-32': [
      [Q('Một quy tắc có lợi nhuận tốt trong 1950–1990 nhưng không còn hiệu quả sau 2000. Theo AMH:', ['Quy tắc chưa bao giờ hiệu quả', 'Môi trường thị trường thay đổi và lợi thế bị khai thác; có thể quay lại khi điều kiện đổi', 'EMH chắc chắn đúng', 'Dữ liệu sai'], 1, ''),
        Q('Bạn kiểm định 200 quy tắc và thấy 10 quy tắc có ý nghĩa ở mức 5%. Điều này:', ['Chứng minh 10 quy tắc hiệu quả', 'Khớp với kỳ vọng do may mắn (200 × 5% = 10) — chưa chứng minh gì', 'Chứng minh PTKT sai', 'Là lỗi tính toán'], 1, 'Cần điều chỉnh cho số lần thử.')],
      [Q('A rule worked 1950–1990 but not after 2000. Per AMH:', ['It never worked', 'Conditions changed and the edge was exploited; it may return', 'EMH proven', 'Bad data'], 1, ''),
        Q('Testing 200 rules, 10 are significant at 5%:', ['Ten rules proven', 'Exactly what luck predicts (200 × 5%) — nothing proven', 'TA disproven', 'A calculation error'], 1, '')]
    ],
    'l1-33': [
      [Q('Khảo sát cho thấy tỷ lệ lạc quan cực cao trong 2 tháng liền nhưng chỉ số vẫn tăng đều, chưa có tín hiệu đảo chiều. Hành động hợp lý:', ['Bán khống toàn bộ ngay', 'Giữ vị thế theo xu hướng nhưng thắt chặt quản trị rủi ro, chờ giá xác nhận', 'Mua thêm bằng đòn bẩy', 'Bỏ qua tâm lý'], 1, ''),
        Q('Nhóm nào dưới đây thường được dùng theo hướng NGƯỢC ở cực trị?', ['Người nội bộ mua cụm', 'Đám đông nhà đầu tư nhỏ lẻ', 'Commercials trong COT', 'Ngân hàng trung ương'], 1, '')],
      [Q('Survey optimism extreme for two months while the index keeps rising without reversal signals:', ['Short everything now', 'Stay with the trend but tighten risk; await price confirmation', 'Add leverage', 'Ignore sentiment'], 1, ''),
        Q('Typically faded at extremes:', ['Cluster insider buying', 'The retail crowd', 'COT commercials', 'Central banks'], 1, '')]
    ],
    'l1-34': [
      [Q('Put/Call 10 ngày có trung bình 1 năm 0.85, độ lệch chuẩn 0.10, hiện tại 1.12. Z-score và cách đọc:', ['0.27 — bình thường', '2.7 — sợ hãi cực trị, gợi ý đáy (ngược)', '−2.7 — tham lam', '1.12 — trung tính'], 1, '(1.12 − 0.85) / 0.10 = 2.7.'),
        Q('Funding rate BTC vĩnh cửu cao kỷ lục, OI tăng mạnh trong khi giá đi ngang. Rủi ro chính:', ['Short squeeze', 'Thanh lý dây chuyền phe mua đòn bẩy nếu giá giảm', 'Không có rủi ro', 'Cổ tức giảm'], 1, '')],
      [Q('10-day put/call: 1-year mean 0.85, st.dev 0.10, now 1.12. Z and reading:', ['0.27 — normal', '2.7 — extreme fear, contrarian low', '−2.7 — greed', '1.12 — neutral'], 1, ''),
        Q('Record perpetual funding and surging OI while price stalls:', ['Short squeeze', 'Long liquidation cascade if price drops', 'No risk', 'Lower dividends'], 1, '')]
    ],
    'l1-35': [
      [Q('Ba thành viên HĐQT cùng mua lượng lớn cổ phiếu sau khi giá giảm 40%. Ý nghĩa:', ['Không ý nghĩa', 'Tín hiệu đáng chú ý — mua cụm của nội bộ sau nhịp giảm mạnh', 'Tín hiệu bán', 'Bắt buộc theo luật'], 1, ''),
        Q('Số tài khoản chứng khoán mở mới lập kỷ lục, IPO dồn dập, mạng xã hội bàn tán cổ phiếu khắp nơi. Bức tranh tổng hợp:', ['Đáy hoảng loạn', 'Dấu hiệu hưng phấn muộn — rủi ro tăng', 'Tích lũy âm thầm', 'Không liên quan'], 1, '')],
      [Q('Three directors buy heavily after a 40% drop:', ['Meaningless', 'Noteworthy cluster insider buying', 'Sell signal', 'Legally required'], 1, ''),
        Q('Record new accounts, an IPO rush and stocks all over social media:', ['Panic low', 'Late-stage euphoria — rising risk', 'Quiet accumulation', 'Unrelated'], 1, '')]
    ],
    'l1-36': [
      [Q('Chuỗi lợi suất năm: +30%, −10%, +20%. Trung bình nhân (CAGR) xấp xỉ:', ['13.3%', '12.0%', '10.4%', '40%'], 2, '(1.3 × 0.9 × 1.2)^(1/3) − 1 = 1.404^(1/3) − 1 ≈ 12.0%… kiểm tra: 1.3 × 0.9 = 1.17; × 1.2 = 1.404; căn bậc 3 ≈ 1.1198 → ≈ 12.0%.'),
        Q('Lợi suất ngày có trung bình 0.05%, σ = 1.2%. Một phiên giảm 6% có z-score khoảng:', ['−5.0', '−4.0', '−6.0', '−2.5'], 0, '(−6 − 0.05) / 1.2 ≈ −5.04: cực hiếm với phân phối chuẩn, nhưng xảy ra thực tế do đuôi dày.')],
      [Q('Annual returns +30%, −10%, +20%. Geometric mean ≈', ['13.3%', '12.0%', '10.4%', '40%'], 1, '1.404^(1/3) − 1 ≈ 12.0%.'),
        Q('Daily mean 0.05%, σ 1.2%. A −6% day has z ≈', ['−5.0', '−4.0', '−6.0', '−2.5'], 0, '')]
    ],
    'l1-37': [
      [Q('Hệ thống thắng 35%, lãi TB 2.5R, lỗ TB 1R. Sau 200 lệnh, kỳ vọng tổng khoảng:', ['+25R', '+45R', '−20R', '+175R'], 0, 'Kỳ vọng = 0.35 × 2.5 − 0.65 = 0.225R... kiểm tra: 0.875 − 0.65 = 0.225 → × 200 = 45R.'),
        Q('Tỷ lệ thua 60%. Xác suất thua 4 lệnh liên tiếp (độc lập) là khoảng:', ['2.6%', '13%', '24%', '60%'], 1, '0.6⁴ = 0.1296.')],
      [Q('35% wins, 2.5R avg win, 1R avg loss. After 200 trades expectancy ≈', ['+25R', '+45R', '−20R', '+175R'], 1, '0.225R × 200.'),
        Q('60% loss rate; 4 straight losses:', ['2.6%', '13%', '24%', '60%'], 1, '0.6⁴.')]
    ],
    'l1-38': [
      [Q('Quy tắc có lợi suất ngày trung bình 0.04%, độ lệch chuẩn 1%, trên 400 phiên. Thống kê t xấp xỉ:', ['0.04', '0.8', '4', '40'], 1, '0.04 / (1 / √400) = 0.04 / 0.05 = 0.8 → chưa có ý nghĩa.'),
        Q('Bạn chỉnh tham số liên tục cho tới khi kết quả trên dữ liệu "ngoài mẫu" đẹp. Hậu quả:', ['Kết quả đáng tin hơn', 'Dữ liệu ngoài mẫu đã trở thành trong mẫu — mất giá trị kiểm định', 'Không ảnh hưởng', 'Giảm chi phí'], 1, '')],
      [Q('Mean daily return 0.04%, st.dev 1%, 400 days. t ≈', ['0.04', '0.8', '4', '40'], 1, '0.04 / 0.05.'),
        Q('Tweaking parameters until out-of-sample results look good:', ['More reliable', 'OOS data became in-sample — test value lost', 'No effect', 'Lower costs'], 1, '')]
    ],
    'l1-39': [
      [Q('Nhà phân tích dự báo đúng 70% xu hướng nhưng tài khoản vẫn thua lỗ. Nguyên nhân khả dĩ nhất:', ['Dự báo kém', 'Lỗ khi sai quá lớn so với lãi khi đúng (không cắt lỗ, chốt lời sớm)', 'Thị trường gian lận', 'Phí thấp'], 1, ''),
        Q('Trong 5 nhóm chỉ báo: giá tăng, độ rộng tăng, tâm lý trung tính, lãi suất đang tăng nhanh, định giá cao. Theo trọng lượng bằng chứng:', ['Tỷ trọng tối đa', 'Tỷ trọng vừa phải, theo dõi chặt nhóm tiền tệ', 'Bán toàn bộ', 'Không thể quyết định'], 1, '')],
      [Q('An analyst is right 70% of the time yet loses money. Most likely:', ['Poor forecasts', 'Losses when wrong dwarf gains when right', 'Rigged markets', 'Low fees'], 1, ''),
        Q('Price up, breadth up, sentiment neutral, rates rising fast, valuations high. Weight of evidence:', ['Maximum exposure', 'Moderate exposure, watch monetary closely', 'Sell all', 'Undecidable'], 1, '')]
    ],
    'l1-40': [
      [Q('Mô hình A: CAGR 14%, max drawdown 45%. Mô hình B: CAGR 11%, max drawdown 15%. Với hầu hết nhà đầu tư, nhận định hợp lý:', ['A luôn tốt hơn', 'B có thể tốt hơn — lợi nhuận/rủi ro cân bằng hơn, dễ tuân thủ', 'Không so được', 'Chọn mô hình nhiều tham số hơn'], 1, ''),
        Q('Khi tối ưu, tham số MA tốt nhất là 47 nhưng 40–60 đều cho kết quả gần tương đương. Lựa chọn khôn ngoan:', ['Đúng 47', 'Một giá trị "tròn" ở giữa vùng ổn định, ví dụ 50', 'Giá trị cho kết quả tệ nhất', 'Đổi mỗi tháng'], 1, '')],
      [Q('Model A: CAGR 14%, max DD 45%. Model B: CAGR 11%, max DD 15%. For most investors:', ['A is always better', 'B may be better — balanced and easier to follow', 'Not comparable', 'More parameters'], 1, ''),
        Q('Best MA is 47 but 40–60 perform similarly. Wise choice:', ['Exactly 47', 'A round value mid-region, e.g. 50', 'The worst value', 'Change monthly'], 1, '')]
    ],
    'l1-41': [
      [Q('Cổ phiếu giảm 8%, VNINDEX giảm 15% trong cùng kỳ. Đường RS của cổ phiếu:', ['Giảm', 'Tăng — mạnh hơn tương đối', 'Không đổi', 'Không tính được'], 1, '0.92 / 0.85 > 1.'),
        Q('Tỷ số Levy của mã A = giá / MA 26 tuần = 1.25; mã B = 0.92. Theo tinh thần Levy:', ['Ưu tiên B vì "rẻ"', 'Ưu tiên A — RS cao', 'Hai mã như nhau', 'Không dùng được'], 1, '')],
      [Q('A stock −8% while VNINDEX −15%. Its RS line:', ['Falls', 'Rises — relatively stronger', 'Flat', 'Undefined'], 1, ''),
        Q('Levy ratio: A = 1.25, B = 0.92. In Levy’s spirit:', ['Prefer B as "cheap"', 'Prefer A — higher RS', 'Equal', 'Unusable'], 1, '')]
    ]
  };
  // fix: two explanations above contain working notes; keep statements concise and correct
  X['l1-36'][0][0] = Q('Chuỗi lợi suất năm: +30%, −10%, +20%. Trung bình nhân (CAGR) xấp xỉ:', ['13.3%', '12.0%', '10.4%', '40%'], 1, '1.3 × 0.9 × 1.2 = 1.404; căn bậc ba ≈ 1.120 → khoảng 12.0%/năm (thấp hơn trung bình cộng 13.3%).');
  X['l1-37'][0][0] = Q('Hệ thống thắng 35%, lãi TB 2.5R, lỗ TB 1R. Sau 200 lệnh, kỳ vọng tổng khoảng:', ['+25R', '+45R', '−20R', '+175R'], 1, 'Kỳ vọng = 0.35 × 2.5 − 0.65 × 1 = 0.225R/lệnh → × 200 = 45R.');

  C.l1Extra = X;
  C.applyExtra = function () {
    Object.keys(X).forEach(id => {
      const ls = C.lessons[id];
      if (!ls || ls._extra) return;
      ls.vi.quiz = ls.vi.quiz.concat(X[id][0]);
      if (ls.en) ls.en.quiz = ls.en.quiz.concat(X[id][1]);
      ls._extra = true;
    });
  };
})(window.LLW);
