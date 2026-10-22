// © 2026 Lai Long Master TA. Bảo lưu mọi quyền. Không sao chép, chỉnh sửa hay dùng lại khi chưa được phép.
/* CMT Level 3 — Part 3, lessons 16–18: portfolio management. Written by Lai Long Master TA in its own words. */
(function (L) {
  'use strict';
  const C = L.cmt, H = C.demoHtml;

  /* ---------- calculator: growth/inflation regime ---------- */
  H.macroQuad = () => `<div class="demo" data-demo="macroQuad"><div class="demo-head"><b>🧮 ${L.T('Xác định chế độ vĩ mô', 'Macro regime finder')}</b>
    ${C.mkSel('q-g', [['up', L.T('Tăng trưởng đang tăng tốc', 'Growth accelerating')], ['dn', L.T('Tăng trưởng đang chậm lại', 'Growth decelerating')]], 'up')}
    ${C.mkSel('q-i', [['up', L.T('Lạm phát đang tăng', 'Inflation rising')], ['dn', L.T('Lạm phát đang giảm', 'Inflation falling')]], 'dn')}</div><div class="demo-calc"></div><div class="demo-out"></div></div>`;
  C.demoRun.macroQuad = box => {
    const M = {
      'up-dn': [L.T('Tăng trưởng tốt, lạm phát thấp ("vùng lý tưởng")', 'Goldilocks'), L.T('Cổ phiếu (đặc biệt tăng trưởng, công nghệ, tiêu dùng không thiết yếu), trái phiếu doanh nghiệp', 'Equities (growth, tech, discretionary), credit'), L.T('Tiền mặt, hàng hoá phòng thủ', 'Cash, defensive commodities')],
      'up-up': [L.T('Tái lạm phát / tăng trưởng nóng', 'Reflation / overheating'), L.T('Hàng hoá, năng lượng, vật liệu, ngân hàng, cổ phiếu giá trị', 'Commodities, energy, materials, banks, value'), L.T('Trái phiếu dài hạn, cổ phiếu tăng trưởng định giá cao', 'Long bonds, richly valued growth')],
      'dn-up': [L.T('Đình lạm (tăng trưởng chậm, lạm phát cao)', 'Stagflation'), L.T('Hàng hoá, vàng, tiền mặt, ngành phòng thủ có sức định giá', 'Commodities, gold, cash, defensives with pricing power'), L.T('Cổ phiếu nói chung và trái phiếu (cả hai cùng yếu)', 'Equities and bonds (both weak)')],
      'dn-dn': [L.T('Giảm phát / suy thoái', 'Deflation / recession'), L.T('Trái phiếu chính phủ dài hạn, tiện ích, y tế, tiêu dùng thiết yếu, USD', 'Long government bonds, utilities, healthcare, staples, USD'), L.T('Hàng hoá, cổ phiếu chu kỳ, trái phiếu rủi ro', 'Commodities, cyclicals, high-yield credit')]
    };
    const run = () => {
      const k = box.querySelector('.q-g').value + '-' + box.querySelector('.q-i').value, m = M[k];
      box.querySelector('.demo-out').innerHTML = `<b>${m[0]}</b><br>${L.T('Thường thuận lợi', 'Often favoured')}: ${m[1]}<br>${L.T('Thường bất lợi', 'Often unfavoured')}: ${m[2]}<p class="muted">${L.T('Đây là xu hướng trung bình lịch sử, không phải quy luật. Dùng như bối cảnh/bộ lọc; xác nhận bằng xu hướng giá và sức mạnh tương đối của chính tài sản.', 'Historical tendencies, not laws. Use as context/filters; confirm with price trend and relative strength.')}</p>`;
    };
    box.querySelectorAll('select').forEach(s => { s.onchange = run; });
    run();
  };

  /* ---------- calculator: two-asset portfolio risk ---------- */
  H.port2 = () => C.calcShell('port2', `${C.num('w', 60, L.T('Tỷ trọng A %', 'Weight A %'), 5)}${C.num('ra', 12, L.T('LN kỳ vọng A %', 'Exp. return A %'), 0.5)}${C.num('sa', 22, 'σA %', 1)}${C.num('rb', 5, L.T('LN kỳ vọng B %', 'Exp. return B %'), 0.5)}${C.num('sb', 7, 'σB %', 1)}${C.num('rho', 0.1, 'ρ', 0.1)}`);
  C.demoRun.port2 = box => {
    const run = () => {
      const g = c => +box.querySelector('.' + c).value, w = g('w') / 100, v = 1 - w, sa = g('sa'), sb = g('sb'), r = Math.max(-1, Math.min(1, g('rho')));
      const varp = w * w * sa * sa + v * v * sb * sb + 2 * w * v * r * sa * sb, sp = Math.sqrt(varp), rp = w * g('ra') + v * g('rb');
      const ca = (w * w * sa * sa + w * v * r * sa * sb) / varp * 100;
      box.querySelector('.demo-out').innerHTML = L.T(`LN kỳ vọng danh mục = <b>${rp.toFixed(2)}%</b>, σ danh mục = <b>${sp.toFixed(2)}%</b> (bình quân gia quyền σ = ${(w * sa + v * sb).toFixed(2)}% — phần chênh là lợi ích đa dạng hoá). Đóng góp rủi ro: A = <b>${ca.toFixed(0)}%</b>, B = ${(100 - ca).toFixed(0)}% — dù tỷ trọng vốn A chỉ ${(w * 100).toFixed(0)}%.`,
        `Portfolio return = <b>${rp.toFixed(2)}%</b>, σ = <b>${sp.toFixed(2)}%</b> (weighted-average σ = ${(w * sa + v * sb).toFixed(2)}% — the gap is diversification). Risk contribution: A = <b>${ca.toFixed(0)}%</b>, B = ${(100 - ca).toFixed(0)}% though A’s capital weight is ${(w * 100).toFixed(0)}%.`);
    };
    box.querySelectorAll('.d-num').forEach(i => { i.oninput = run; });
    run();
  };

  /* ---------- calculator: Brinson attribution (3 sectors) ---------- */
  const SEC = () => [['s1', L.T('Ngân hàng', 'Banks'), 40, 30, 8, 6], ['s2', L.T('Công nghệ', 'Tech'), 30, 20, 15, 12], ['s3', L.T('Bất động sản', 'Real estate'), 30, 50, -4, -2]];
  H.brinson = () => `<div class="demo" data-demo="brinson"><div class="demo-head"><b>🧮 ${L.T('Phân bổ hiệu suất theo ngành', 'Sector performance attribution')}</b></div><div class="demo-calc"><table class="tbl"><thead><tr><th>${L.T('Ngành', 'Sector')}</th><th>w<sub>p</sub>%</th><th>w<sub>b</sub>%</th><th>R<sub>p</sub>%</th><th>R<sub>b</sub>%</th></tr></thead><tbody>
    ${SEC().map(s => `<tr><td>${s[1]}</td>${['wp', 'wb', 'rp', 'rb'].map((k, j) => `<td><input type="number" class="d-num ${s[0]}-${k}" value="${s[2 + j]}" step="1" style="width:64px"></td>`).join('')}</tr>`).join('')}</tbody></table></div><div class="demo-out"></div></div>`;
  C.demoRun.brinson = box => {
    const run = () => {
      const g = c => +box.querySelector('.' + c).value / 100;
      const rows = SEC().map(s => ({ n: s[1], wp: g(s[0] + '-wp'), wb: g(s[0] + '-wb'), rp: g(s[0] + '-rp'), rb: g(s[0] + '-rb') }));
      const Rb = rows.reduce((a, r) => a + r.wb * r.rb, 0), Rp = rows.reduce((a, r) => a + r.wp * r.rp, 0);
      let A = 0, S = 0, I = 0;
      const tr = rows.map(r => { const a = (r.wp - r.wb) * (r.rb - Rb), s = r.wb * (r.rp - r.rb), i = (r.wp - r.wb) * (r.rp - r.rb); A += a; S += s; I += i; return `<tr><td>${r.n}</td><td>${(a * 100).toFixed(2)}</td><td>${(s * 100).toFixed(2)}</td><td>${(i * 100).toFixed(2)}</td></tr>`; }).join('');
      box.querySelector('.demo-out').innerHTML = `<table class="tbl"><thead><tr><th></th><th>${L.T('Phân bổ', 'Allocation')}</th><th>${L.T('Chọn lọc', 'Selection')}</th><th>${L.T('Tương tác', 'Interaction')}</th></tr></thead><tbody>${tr}<tr><td><b>${L.T('Tổng', 'Total')}</b></td><td><b>${(A * 100).toFixed(2)}</b></td><td><b>${(S * 100).toFixed(2)}</b></td><td><b>${(I * 100).toFixed(2)}</b></td></tr></tbody></table>
        <p>${L.T(`Danh mục ${(Rp * 100).toFixed(2)}% so với chuẩn ${(Rb * 100).toFixed(2)}% → vượt trội <b>${((Rp - Rb) * 100).toFixed(2)}%</b> = phân bổ + chọn lọc + tương tác (đơn vị: điểm %).`, `Portfolio ${(Rp * 100).toFixed(2)}% vs benchmark ${(Rb * 100).toFixed(2)}% → active <b>${((Rp - Rb) * 100).toFixed(2)}%</b> = allocation + selection + interaction (percentage points).`)}${Math.abs(rows.reduce((a, r) => a + r.wp, 0) - 1) > 0.001 || Math.abs(rows.reduce((a, r) => a + r.wb, 0) - 1) > 0.001 ? ' <b>' + L.T('Lưu ý: tổng tỷ trọng phải bằng 100%.', 'Note: weights must sum to 100%.') + '</b>' : ''}</p>`;
    };
    box.querySelectorAll('.d-num').forEach(i => { i.oninput = run; });
    run();
  };

  /* ================= L3-16 ================= */
  C.addLesson('l3-16', {
    goals: ['Phân biệt động lượng chéo (tương đối) và động lượng chuỗi thời gian (tuyệt đối).', 'Đánh giá bằng chứng về động lượng qua tài sản, quốc gia và thời kỳ.', 'Phản biện các ngộ nhận phổ biến về động lượng.', 'Thiết kế cách dùng động lượng trong danh mục, kể cả kết hợp với giá trị.'],
    body: () => `
<h3>1. Hai dạng động lượng</h3>
<table class="tbl"><thead><tr><th></th><th>Động lượng chéo (tương đối)</th><th>Động lượng chuỗi thời gian (tuyệt đối)</th></tr></thead><tbody>
<tr><td>So sánh</td><td>Tài sản này với tài sản khác</td><td>Tài sản với chính quá khứ của nó</td></tr>
<tr><td>Quy tắc điển hình</td><td>Mua nhóm thắng, (bán) nhóm thua trong 12 tháng qua, bỏ tháng gần nhất</td><td>Mua nếu lợi nhuận 12 tháng &gt; 0 (hoặc giá trên MA dài), ngược lại đứng ngoài/bán</td></tr>
<tr><td>Rủi ro thị trường</td><td>Phần lớn được triệt tiêu nếu long/short</td><td>Thay đổi theo hướng thị trường</td></tr>
<tr><td>Liên hệ PTKT</td><td>Sức mạnh tương đối (Bài 29 Level 2)</td><td>Theo xu hướng (hệ thống MA, breakout)</td></tr></tbody></table>
<h3>2. Bằng chứng</h3>
<ul><li>Hiệu ứng động lượng được ghi nhận <b>rộng khắp</b>: cổ phiếu ở nhiều quốc gia, ngành, chỉ số quốc gia, trái phiếu, tiền tệ, hàng hoá — và trong dữ liệu lịch sử rất dài, kể cả giai đoạn trước khi hiệu ứng được công bố (bằng chứng ngoài mẫu).</li>
<li>Động lượng chuỗi thời gian từng mang lại lợi nhuận tốt trong các đợt giảm kéo dài của thị trường — một dạng "bảo hiểm" khủng hoảng.</li>
<li>Lợi thế không cố định: có thập kỷ rất mạnh, có giai đoạn yếu.</li></ul>
<h3>3. Các ngộ nhận và phản biện</h3>
<table class="tbl"><thead><tr><th>Ngộ nhận</th><th>Thực tế (theo bằng chứng)</th></tr></thead><tbody>
<tr><td>"Lợi nhuận động lượng quá nhỏ, chỉ là may mắn"</td><td>Có ý nghĩa thống kê qua nhiều thị trường và thời kỳ độc lập</td></tr>
<tr><td>"Chỉ hoạt động ở phía bán khống"</td><td>Đóng góp đến từ cả phía mua; phía mua quan trọng với nhà đầu tư chỉ mua</td></tr>
<tr><td>"Chỉ có ở cổ phiếu nhỏ, kém thanh khoản"</td><td>Có ở cả cổ phiếu vốn hoá lớn, dù yếu hơn</td></tr>
<tr><td>"Bị chi phí giao dịch xoá sạch"</td><td>Chi phí đáng kể nhưng có thể quản lý bằng vùng giữ, tần suất hợp lý, thực hiện tốt — với quy mô hợp lý vẫn còn lợi thế</td></tr>
<tr><td>"Không hiệu quả về thuế"</td><td>Động lượng tự nhiên cắt lỗ sớm, giữ lãi lâu → thường không tệ về thuế</td></tr>
<tr><td>"Không có lý giải nên sẽ biến mất"</td><td>Có cả lý giải hành vi (phản ứng chậm rồi thái quá) và rủi ro; hiệu ứng vẫn tồn tại sau khi được công bố rộng rãi</td></tr></tbody></table>
<h3>4. Rủi ro thật</h3>
<ul><li><b>Sụp đổ động lượng</b>: khi thị trường bật mạnh từ đáy sâu, nhóm thua bật lên dữ dội → long/short động lượng lỗ nặng. Có thể giảm bằng cách điều chỉnh quy mô theo biến động của chính chiến lược.</li>
<li>Tập trung theo chủ đề/ngành.</li>
<li>Thời gian kém hiệu quả kéo dài thử thách kỷ luật.</li></ul>
<h3>5. Động lượng và giá trị</h3>
<p>Động lượng và giá trị có <b>tương quan âm</b> với nhau: cổ phiếu rẻ thường là cổ phiếu đã giảm (động lượng yếu). Kết hợp cả hai trong danh mục làm <b>lợi nhuận/rủi ro tốt hơn</b> từng yếu tố riêng lẻ. Với nhà PTKT: dùng động lượng/xu hướng để chọn <b>thời điểm</b> cho các ý tưởng giá trị.</p>
${H.rsRank()}`,
    keys: ['Động lượng chéo (so với tài sản khác) và chuỗi thời gian (so với chính nó = theo xu hướng).', 'Bằng chứng rộng: nhiều loại tài sản, quốc gia, thời kỳ; chuỗi thời gian có tính bảo hiểm khủng hoảng.', 'Ngộ nhận về quy mô, phía bán, vốn hoá nhỏ, chi phí, thuế, thiếu lý giải — phần lớn không đứng vững trước bằng chứng.', 'Rủi ro thật: sụp đổ động lượng, tập trung, giai đoạn yếu kéo dài; điều chỉnh quy mô theo biến động.', 'Động lượng và giá trị tương quan âm — kết hợp cải thiện lợi nhuận/rủi ro.'],
    terms: [['Cross-sectional momentum', 'Động lượng chéo'], ['Time-series momentum', 'Động lượng chuỗi thời gian'], ['Momentum crash', 'Sụp đổ động lượng'], ['Value factor', 'Yếu tố giá trị'], ['Volatility scaling', 'Điều chỉnh quy mô theo biến động']]
  }, {
    goals: ['Distinguish cross-sectional and time-series momentum.', 'Assess the evidence.', 'Rebut common myths.', 'Design portfolio uses, including with value.'],
    body: () => `
<h3>1. Two forms</h3><p>Cross-sectional: winners vs losers. Time-series: an asset vs its own past (trend following).</p>
<h3>2. Evidence</h3><ul><li>Pervasive across assets, countries and long histories, including pre-publication data.</li><li>Time-series momentum has helped in prolonged bear markets.</li><li>Varies over time.</li></ul>
<h3>3. Myths vs evidence</h3><ul><li>Not just luck; long side matters; not only small caps; costs manageable; not tax-inefficient; behavioural and risk explanations exist.</li></ul>
<h3>4. Real risks</h3><ul><li>Momentum crashes — scale by strategy volatility.</li><li>Concentration.</li><li>Long weak spells.</li></ul>
<h3>5. Momentum and value</h3><p>Negatively correlated; combining improves risk-adjusted returns; use momentum to time value ideas.</p>${H.rsRank()}`,
    keys: ['Two forms.', 'Evidence.', 'Myths.', 'Risks.', 'Value combination.'],
    terms: [['Time-series momentum', 'Trend following on an asset’s own returns']]
  }, [
    ['Động lượng chéo so sánh:', 'Cross-sectional momentum compares:', ['Tài sản này với tài sản khác', 'Tài sản với quá khứ của chính nó', 'Giá với khối lượng', 'Không gì'], ['Assets against each other', 'An asset with its own past', 'Price with volume', 'Nothing'], 0, '', ''],
    ['Động lượng chuỗi thời gian tương đương với:', 'Time-series momentum is equivalent to:', ['Theo xu hướng trên chính tài sản', 'Giao dịch cặp', 'Bán quyền chọn', 'Định giá'], ['Trend following on the asset itself', 'Pairs trading', 'Option selling', 'Valuation'], 0, '', ''],
    ['Quy tắc động lượng chéo điển hình:', 'A typical cross-sectional rule:', ['Mua nhóm thắng 12 tháng qua (bỏ tháng gần nhất)', 'Mua nhóm thua', 'Mua ngẫu nhiên', 'Mua theo cổ tức'], ['Buy 12-month winners (skipping the last month)', 'Buy losers', 'Buy randomly', 'Buy on dividends'], 0, '', ''],
    ['Bằng chứng ngoài mẫu mạnh nhất cho động lượng:', 'The strongest out-of-sample evidence for momentum:', ['Hiệu ứng tồn tại ở nhiều tài sản, quốc gia và cả dữ liệu trước khi được công bố', 'Một nghiên cứu duy nhất', 'Quảng cáo quỹ', 'Không có'], ['It appears across assets, countries and pre-publication data', 'One study', 'Fund ads', 'None'], 0, '', ''],
    ['Động lượng chuỗi thời gian từng hoạt động tốt trong:', 'Time-series momentum has historically done well in:', ['Các đợt giảm kéo dài của thị trường', 'Thị trường đi ngang hẹp', 'Không bao giờ', 'Ngày lễ'], ['Prolonged market declines', 'Tight ranges', 'Never', 'Holidays'], 0, '', ''],
    ['Phản biện ngộ nhận "động lượng chỉ hoạt động ở phía bán khống":', 'Rebuttal to "momentum only works on the short side":', ['Phía mua cũng đóng góp đáng kể', 'Đúng hoàn toàn', 'Chỉ phía bán', 'Không có phía nào'], ['The long side contributes materially too', 'Entirely true', 'Only shorts', 'Neither side'], 0, '', ''],
    ['Phản biện "động lượng chỉ có ở cổ phiếu nhỏ":', 'Rebuttal to "momentum is only in small caps":', ['Có cả ở vốn hoá lớn, dù yếu hơn', 'Chỉ ở cổ phiếu nhỏ', 'Không ở đâu', 'Chỉ ở crypto'], ['It exists in large caps too, though weaker', 'Small caps only', 'Nowhere', 'Crypto only'], 0, '', ''],
    ['Vì sao động lượng thường không quá tệ về thuế?', 'Why is momentum often not tax-inefficient?', ['Tự nhiên cắt lỗ sớm, giữ lãi lâu', 'Không giao dịch', 'Được miễn thuế', 'Không đúng'], ['It naturally realises losses early and holds winners', 'No trading', 'Tax-exempt', 'False'], 0, '', ''],
    ['Chi phí giao dịch của động lượng có thể quản lý bằng:', 'Momentum costs can be managed by:', ['Vùng giữ, tần suất hợp lý, thực hiện tốt', 'Giao dịch mỗi ngày', 'Bỏ qua chi phí', 'Tăng vòng quay'], ['Holding buffers, sensible frequency, good execution', 'Daily trading', 'Ignoring costs', 'Higher turnover'], 0, '', ''],
    ['Sụp đổ động lượng thường xảy ra khi:', 'Momentum crashes typically occur when:', ['Thị trường bật mạnh từ đáy sâu, nhóm thua bật dữ dội', 'Xu hướng tăng ổn định', 'Thị trường yên', 'Lãi suất ổn định'], ['Markets rebound from deep lows and losers surge', 'Steady uptrends', 'Calm markets', 'Stable rates'], 0, '', ''],
    ['Cách giảm rủi ro sụp đổ động lượng:', 'A way to reduce momentum-crash risk:', ['Điều chỉnh quy mô theo biến động của chính chiến lược', 'Tăng đòn bẩy', 'Bỏ dừng lỗ', 'Mua nhóm thua'], ['Scale exposure by the strategy’s own volatility', 'More leverage', 'No stops', 'Buy losers'], 0, '', ''],
    ['Tương quan giữa yếu tố động lượng và giá trị thường:', 'Correlation between momentum and value factors is usually:', ['Âm', 'Dương cao', 'Bằng 1', 'Không xác định'], ['Negative', 'High positive', 'One', 'Undefined'], 0, '', ''],
    ['Vì sao kết hợp động lượng và giá trị có lợi?', 'Why combine momentum and value?', ['Tương quan âm → lợi nhuận/rủi ro danh mục tốt hơn', 'Tăng rủi ro', 'Giống nhau', 'Không có lợi'], ['Negative correlation → better risk-adjusted returns', 'More risk', 'They are the same', 'No benefit'], 0, '', ''],
    ['Cổ phiếu "rẻ" theo định giá thường có động lượng:', '"Cheap" stocks usually have momentum that is:', ['Yếu (đã giảm giá)', 'Mạnh', 'Không liên quan', 'Bằng 0'], ['Weak (prices have fallen)', 'Strong', 'Unrelated', 'Zero'], 0, '', ''],
    ['Nhà PTKT dùng động lượng với ý tưởng giá trị bằng cách:', 'Technicians use momentum with value ideas by:', ['Chờ xu hướng/động lượng cải thiện để chọn thời điểm', 'Mua ngay khi rẻ', 'Bỏ qua giá trị', 'Bán khống'], ['Waiting for trend/momentum to improve for timing', 'Buying as soon as cheap', 'Ignoring value', 'Shorting'], 0, '', ''],
    ['Lý giải hành vi cho động lượng:', 'A behavioural explanation of momentum:', ['Phản ứng chậm rồi phản ứng thái quá', 'Thị trường hiệu quả hoàn hảo', 'Ngẫu nhiên', 'Luật'], ['Underreaction then overreaction', 'Perfect efficiency', 'Randomness', 'Law'], 0, '', ''],
    ['Hiệu ứng động lượng sau khi được công bố rộng rãi:', 'After wide publication, the momentum effect:', ['Vẫn tồn tại trong nhiều thị trường', 'Biến mất ngay', 'Đảo ngược', 'Bị cấm'], ['Has persisted in many markets', 'Vanished at once', 'Reversed', 'Was banned'], 0, '', ''],
    ['Động lượng chéo long/short có rủi ro thị trường:', 'Long/short cross-sectional momentum has market risk that is:', ['Phần lớn được triệt tiêu', 'Gấp đôi thị trường', 'Bằng thị trường', 'Không xác định'], ['Largely hedged out', 'Double the market', 'Equal to the market', 'Undefined'], 0, '', ''],
    ['Rủi ro hành vi lớn nhất khi theo chiến lược động lượng:', 'The biggest behavioural risk following momentum:', ['Bỏ cuộc trong giai đoạn kém hiệu quả kéo dài', 'Quá kỷ luật', 'Không có', 'Lãi quá nhiều'], ['Quitting during long weak spells', 'Too much discipline', 'None', 'Too much profit'], 0, '', ''],
    ['Với nhà đầu tư chỉ mua (không bán khống) ở Việt Nam, động lượng nên áp dụng dạng:', 'For long-only investors in Vietnam, momentum is best applied as:', ['Chọn nhóm mạnh nhất + bộ lọc xu hướng tuyệt đối của thị trường', 'Long/short thuần', 'Mua nhóm yếu nhất', 'Không áp dụng'], ['Hold the strongest + an absolute market trend filter', 'Pure long/short', 'Buy the weakest', 'Not applicable'], 0, '', ''],
    ['Vì sao bỏ tháng gần nhất khi đo động lượng 12 tháng?', 'Why skip the latest month in 12-month momentum?', ['Tránh hiệu ứng đảo chiều ngắn hạn', 'Thiếu dữ liệu', 'Do thuế', 'Không lý do'], ['To avoid short-term reversal', 'Missing data', 'Taxes', 'No reason'], 0, '', ''],
    ['Động lượng hoạt động trên hàng hoá và tiền tệ cho thấy:', 'Momentum in commodities and currencies shows:', ['Hiệu ứng không chỉ là đặc thù cổ phiếu', 'Chỉ là lỗi dữ liệu', 'Chỉ ở cổ phiếu', 'Không có ý nghĩa'], ['The effect is not equity-specific', 'Just data errors', 'Equity-only', 'Meaningless'], 0, '', ''],
    ['Lợi thế động lượng qua thời gian:', 'Momentum’s edge over time:', ['Thay đổi: có giai đoạn rất mạnh, có giai đoạn yếu', 'Cố định mỗi năm', 'Luôn âm', 'Luôn dương mỗi tháng'], ['Varies: very strong periods and weak ones', 'Fixed each year', 'Always negative', 'Positive every month'], 0, '', ''],
    ['Động lượng chuỗi thời gian khác RS ở chỗ:', 'Time-series momentum differs from RS by:', ['Có thể đứng ngoài/bán toàn bộ khi xu hướng tuyệt đối âm', 'Luôn đầu tư đủ', 'Không dùng giá', 'Giống hệt'], ['It can go to cash/short when the absolute trend is negative', 'Always fully invested', 'No prices', 'Identical'], 0, '', ''],
    ['Chiến lược kết hợp động lượng chéo + động lượng tuyệt đối gọi là:', 'Combining relative and absolute momentum is called:', ['Động lượng kép', 'Giá trị sâu', 'Giao dịch cặp', 'Martingale'], ['Dual momentum', 'Deep value', 'Pairs trading', 'Martingale'], 0, '', ''],
    ['Tình huống: chiến lược động lượng kém thị trường 2 năm liên tiếp, nằm trong phạm vi lịch sử. Quyết định hợp lý:', 'Case: a momentum strategy trails for 2 years, within historical range. Sensible decision:', ['Duy trì theo kế hoạch, kiểm tra thực hiện và rủi ro tập trung', 'Bỏ ngay', 'Tăng đòn bẩy gấp ba', 'Đổi sang mua nhóm thua'], ['Stay the course; review execution and concentration', 'Abandon at once', 'Triple leverage', 'Switch to buying losers'], 0, '', ''],
    ['Động lượng ngành (mua ngành mạnh) phù hợp với nhà đầu tư Việt Nam vì:', 'Sector momentum suits Vietnamese investors because:', ['Thực hiện được qua cổ phiếu dẫn đầu/ETF ngành, không cần bán khống', 'Cần bán khống', 'Không có ngành', 'Bị cấm'], ['It can be implemented via leaders/sector funds without shorting', 'Requires shorting', 'No sectors', 'Banned'], 0, '', ''],
    ['Rủi ro tập trung của động lượng tăng khi:', 'Momentum concentration risk rises when:', ['Một chủ đề dẫn dắt thị trường quá lâu', 'Thị trường đa dạng', 'Không có xu hướng', 'Lãi suất thấp'], ['One theme leads for a long time', 'Markets are diverse', 'No trends', 'Low rates'], 0, '', ''],
    ['Câu nào đúng về động lượng?', 'Which statement about momentum is correct?', ['Là một trong các hiệu ứng được ghi nhận rộng nhất, nhưng có rủi ro sụp đổ cần quản lý', 'Không có bằng chứng', 'Không bao giờ thua', 'Chỉ là may mắn'], ['One of the most widely documented effects, with crash risk to manage', 'No evidence', 'Never loses', 'Pure luck'], 0, '', ''],
    ['Vai trò của động lượng trong danh mục đa yếu tố:', 'Momentum’s role in a multi-factor portfolio:', ['Một nguồn lợi nhuận đa dạng hoá, bổ sung cho giá trị', 'Thay thế mọi yếu tố', 'Không có vai trò', 'Tăng rủi ro duy nhất'], ['A diversifying return source complementing value', 'Replaces all factors', 'No role', 'Only adds risk'], 0, '', '']
  ]);

  /* ================= L3-17 ================= */
  C.addLesson('l3-17', {
    goals: ['Phân tích chu kỳ kinh doanh và các chỉ báo dẫn trước vĩ mô.', 'Phân loại chế độ vĩ mô theo tăng trưởng và lạm phát; liên hệ với hiệu suất tài sản.', 'Đánh giá điều kiện tiền tệ, thanh khoản và tín dụng.', 'Tích hợp phân tích vĩ mô với phân tích kỹ thuật trong quyết định phân bổ.'],
    body: () => `
<h3>1. Chu kỳ kinh doanh và chỉ báo dẫn trước</h3>
<table class="tbl"><thead><tr><th>Chỉ báo</th><th>Vì sao dẫn trước</th></tr></thead><tbody>
<tr><td>Chỉ số quản trị mua hàng (PMI), đơn hàng mới</td><td>Doanh nghiệp điều chỉnh sản xuất trước khi số liệu GDP ghi nhận</td></tr>
<tr><td>Đường cong lợi suất (10 năm − 2 năm/3 tháng)</td><td>Đảo ngược thường đi trước suy thoái 6–24 tháng</td></tr>
<tr><td>Chênh lệch tín dụng</td><td>Chủ nợ phản ứng sớm với rủi ro vỡ nợ</td></tr>
<tr><td>Cung tiền, tăng trưởng tín dụng</td><td>Thanh khoản là nhiên liệu cho hoạt động và tài sản</td></tr>
<tr><td>Đơn xin trợ cấp thất nghiệp, giờ làm</td><td>Thị trường lao động thay đổi sớm ở biên</td></tr>
<tr><td>Thị trường cổ phiếu</td><td>Bản thân là chỉ báo dẫn trước nền kinh tế</td></tr></tbody></table>
<p>Quan trọng là <b>hướng thay đổi</b> (tăng tốc hay chậm lại) hơn là mức tuyệt đối — thị trường phản ứng với "tốt hơn/xấu hơn kỳ vọng".</p>
<h3>2. Bốn chế độ vĩ mô</h3>
<p>Phân loại theo hai trục: <b>tăng trưởng</b> tăng tốc/chậm lại và <b>lạm phát</b> tăng/giảm.</p>
${H.macroQuad()}
<h3>3. Điều kiện tiền tệ và thanh khoản</h3>
<ul><li><b>Lãi suất chính sách thực</b> (danh nghĩa − lạm phát): âm = nới lỏng thực chất.</li>
<li><b>Bảng cân đối ngân hàng trung ương</b>: mở rộng (bơm thanh khoản) thường hỗ trợ tài sản rủi ro.</li>
<li><b>Chỉ số điều kiện tài chính</b>: tổng hợp lãi suất, chênh lệch tín dụng, tỷ giá, giá cổ phiếu — thắt chặt nhanh là cảnh báo.</li>
<li><b>Thanh khoản USD toàn cầu</b>: USD mạnh = điều kiện thắt chặt cho thế giới, đặc biệt thị trường mới nổi.</li>
<li>Ở Việt Nam: lãi suất điều hành, lãi suất liên ngân hàng, tăng trưởng tín dụng, tỷ giá, hoạt động thị trường mở của Ngân hàng Nhà nước.</li></ul>
<h3>4. Tích hợp vĩ mô và kỹ thuật</h3>
<ol><li><b>Vĩ mô xác định bối cảnh</b>: chế độ nào, tài sản/ngành nào thường thuận lợi.</li>
<li><b>Kỹ thuật xác nhận và chọn thời điểm</b>: xu hướng giá, sức mạnh tương đối, độ rộng có xác nhận câu chuyện vĩ mô không?</li>
<li><b>Khi hai bên mâu thuẫn</b>: ưu tiên giá (thị trường dẫn trước số liệu vĩ mô vốn công bố chậm và hay điều chỉnh), giảm quy mô, chờ thêm bằng chứng.</li>
<li>Dùng vĩ mô làm <b>bộ lọc/tỷ trọng</b>, không làm tín hiệu vào lệnh ngắn hạn.</li></ol>
<div class="callout"><b>Ví dụ</b>: PMI tăng 3 tháng liên tiếp, lạm phát giảm, chênh lệch tín dụng thu hẹp → chế độ "tăng trưởng tốt, lạm phát thấp". Kỹ thuật: chỉ số trên MA 200, độ rộng mạnh, ngành công nghệ và tiêu dùng không thiết yếu dẫn đầu trên đồ thị xoay vòng → bằng chứng đồng thuận, tăng tỷ trọng cổ phiếu. Nếu ngược lại giá phá xuống dưới MA 200 với độ rộng yếu, giảm tỷ trọng dù câu chuyện vĩ mô còn tốt.</div>`,
    keys: ['Chỉ báo dẫn trước: PMI/đơn hàng mới, đường cong lợi suất, chênh lệch tín dụng, cung tiền/tín dụng, thất nghiệp, thị trường cổ phiếu; hướng thay đổi quan trọng hơn mức.', 'Bốn chế độ: tăng trưởng × lạm phát → nhóm tài sản thuận lợi/bất lợi khác nhau.', 'Điều kiện tiền tệ: lãi suất thực, bảng cân đối NHTW, chỉ số điều kiện tài chính, thanh khoản USD; Việt Nam: lãi suất điều hành, liên ngân hàng, tín dụng, tỷ giá.', 'Tích hợp: vĩ mô cho bối cảnh, kỹ thuật xác nhận/thời điểm; mâu thuẫn → ưu tiên giá, giảm quy mô.'],
    terms: [['Leading indicators', 'Chỉ báo dẫn trước'], ['PMI', 'Chỉ số quản trị mua hàng'], ['Yield curve inversion', 'Đường cong lợi suất đảo ngược'], ['Financial conditions index', 'Chỉ số điều kiện tài chính'], ['Goldilocks / Reflation / Stagflation / Deflation', 'Lý tưởng / Tái lạm phát / Đình lạm / Giảm phát']]
  }, {
    goals: ['Analyse the business cycle and leading indicators.', 'Classify growth/inflation regimes and asset behaviour.', 'Assess monetary, liquidity and credit conditions.', 'Integrate macro with technical analysis.'],
    body: () => `
<h3>1. Leading indicators</h3><p>PMIs and new orders, yield curve, credit spreads, money and credit growth, jobless claims, the stock market. Direction of change matters most.</p>
<h3>2. Four regimes</h3>${H.macroQuad()}
<h3>3. Monetary conditions</h3><ul><li>Real policy rate.</li><li>Central-bank balance sheets.</li><li>Financial conditions indices.</li><li>Global USD liquidity.</li><li>Vietnam: policy and interbank rates, credit growth, FX, open-market operations.</li></ul>
<h3>4. Integration</h3><ol><li>Macro sets context.</li><li>Technicals confirm and time.</li><li>On conflict, favour price, cut size, wait.</li><li>Macro as filter/weighting, not short-term trigger.</li></ol><div class="callout">Rising PMI, falling inflation, tighter spreads + index above 200-MA with strong breadth → raise equity weight; if price breaks down, reduce despite the story.</div>`,
    keys: ['Leading indicators.', 'Regimes.', 'Monetary conditions.', 'Integration.'],
    terms: [['Financial conditions index', 'Composite of rates, spreads, FX and equities']]
  }, [
    ['Với chỉ báo vĩ mô, điều thường quan trọng hơn mức tuyệt đối là:', 'For macro indicators, what usually matters more than the level:', ['Hướng thay đổi (tăng tốc hay chậm lại) so với kỳ vọng', 'Số chữ số', 'Ngày công bố', 'Không gì'], ['Direction of change versus expectations', 'Digits', 'Release date', 'Nothing'], 0, '', ''],
    ['Đường cong lợi suất đảo ngược thường đi trước suy thoái khoảng:', 'Yield-curve inversion usually precedes recession by about:', ['6–24 tháng', '1 ngày', '10 năm', 'Không bao giờ'], ['6–24 months', '1 day', '10 years', 'Never'], 0, '', ''],
    ['PMI là chỉ báo dẫn trước vì:', 'The PMI leads because:', ['Doanh nghiệp điều chỉnh mua hàng và sản xuất trước khi GDP ghi nhận', 'Công bố cuối năm', 'Ngẫu nhiên', 'Không đúng'], ['Firms adjust purchasing/production before GDP records it', 'Released yearly', 'Randomly', 'False'], 0, '', ''],
    ['Tăng trưởng tăng tốc, lạm phát giảm — chế độ:', 'Growth accelerating, inflation falling — regime:', ['Lý tưởng', 'Đình lạm', 'Giảm phát', 'Tái lạm phát'], ['Goldilocks', 'Stagflation', 'Deflation', 'Reflation'], 0, '', ''],
    ['Tăng trưởng chậm lại, lạm phát tăng — chế độ:', 'Growth slowing, inflation rising — regime:', ['Đình lạm', 'Lý tưởng', 'Giảm phát', 'Tái lạm phát'], ['Stagflation', 'Goldilocks', 'Deflation', 'Reflation'], 0, '', ''],
    ['Trong chế độ đình lạm, tài sản thường bất lợi:', 'In stagflation, typically unfavoured:', ['Cả cổ phiếu và trái phiếu', 'Hàng hoá', 'Vàng', 'Tiền mặt'], ['Both stocks and bonds', 'Commodities', 'Gold', 'Cash'], 0, '', ''],
    ['Trong giảm phát/suy thoái, tài sản thường thuận lợi:', 'In deflation/recession, typically favoured:', ['Trái phiếu chính phủ dài hạn, ngành phòng thủ', 'Hàng hoá', 'Cổ phiếu chu kỳ', 'Trái phiếu rủi ro cao'], ['Long government bonds, defensives', 'Commodities', 'Cyclicals', 'High yield'], 0, '', ''],
    ['Trong tái lạm phát (tăng trưởng nóng, lạm phát tăng), thường thuận lợi:', 'In reflation, typically favoured:', ['Hàng hoá, năng lượng, ngân hàng, cổ phiếu giá trị', 'Trái phiếu dài hạn', 'Tiện ích', 'Tiền mặt duy nhất'], ['Commodities, energy, banks, value', 'Long bonds', 'Utilities', 'Cash only'], 0, '', ''],
    ['Lãi suất chính sách 5%, lạm phát 6%. Lãi suất thực:', 'Policy rate 5%, inflation 6%. Real rate:', ['−1% (nới lỏng thực chất)', '+11%', '+1%', '0'], ['−1% (effectively easy)', '+11%', '+1%', '0'], 0, '', ''],
    ['Bảng cân đối ngân hàng trung ương mở rộng thường:', 'Expanding central-bank balance sheets usually:', ['Hỗ trợ tài sản rủi ro (bơm thanh khoản)', 'Gây sập cổ phiếu', 'Không ảnh hưởng', 'Tăng lãi suất'], ['Support risk assets (liquidity injection)', 'Crash stocks', 'No effect', 'Raise rates'], 0, '', ''],
    ['Chỉ số điều kiện tài chính thắt chặt nhanh là:', 'Rapidly tightening financial conditions are:', ['Cảnh báo cho tài sản rủi ro', 'Tín hiệu mua', 'Không ý nghĩa', 'Tốt cho cổ phiếu chu kỳ'], ['A warning for risk assets', 'A buy signal', 'Meaningless', 'Good for cyclicals'], 0, '', ''],
    ['USD mạnh lên toàn cầu nghĩa là điều kiện tài chính với thế giới:', 'A globally stronger USD means world financial conditions are:', ['Thắt chặt hơn', 'Nới lỏng hơn', 'Không đổi', 'Không liên quan'], ['Tighter', 'Easier', 'Unchanged', 'Unrelated'], 0, '', ''],
    ['Chỉ báo vĩ mô quan trọng ở Việt Nam:', 'Key macro indicators in Vietnam:', ['Lãi suất điều hành, liên ngân hàng, tăng trưởng tín dụng, tỷ giá', 'Chỉ giá vàng', 'Số ngày nắng', 'Không có'], ['Policy and interbank rates, credit growth, FX', 'Gold only', 'Sunny days', 'None'], 0, '', ''],
    ['Khi vĩ mô và kỹ thuật mâu thuẫn, nguyên tắc hợp lý:', 'When macro and technicals conflict, a sound rule:', ['Ưu tiên giá, giảm quy mô, chờ thêm bằng chứng', 'Ưu tiên vĩ mô, tăng đòn bẩy', 'Bỏ qua cả hai', 'Giao dịch ngẫu nhiên'], ['Favour price, cut size, await evidence', 'Favour macro and lever up', 'Ignore both', 'Trade randomly'], 0, '', ''],
    ['Vì sao giá thường dẫn trước số liệu vĩ mô?', 'Why does price usually lead macro data?', ['Số liệu vĩ mô công bố chậm và hay được điều chỉnh; thị trường chiết khấu tương lai', 'Giá là ngẫu nhiên', 'Số liệu vĩ mô luôn đúng ngay', 'Không đúng'], ['Macro data are late and revised; markets discount the future', 'Prices are random', 'Macro data are instantly final', 'False'], 0, '', ''],
    ['Vai trò hợp lý của vĩ mô trong quy trình kỹ thuật:', 'Macro’s sensible role in a technical process:', ['Bối cảnh, bộ lọc, quyết định tỷ trọng', 'Tín hiệu vào lệnh trong phiên', 'Thay dừng lỗ', 'Không vai trò'], ['Context, filter, weighting', 'Intraday triggers', 'Stop replacement', 'No role'], 0, '', ''],
    ['Chênh lệch tín dụng thu hẹp, PMI tăng, chỉ số trên MA 200, độ rộng mạnh. Kết luận:', 'Spreads narrowing, PMI rising, index above 200-MA, strong breadth. Conclusion:', ['Bằng chứng đồng thuận — tăng tỷ trọng cổ phiếu', 'Bán toàn bộ', 'Mâu thuẫn hoàn toàn', 'Không đủ thông tin'], ['Aligned evidence — raise equity weight', 'Sell everything', 'Total conflict', 'Not enough info'], 0, '', ''],
    ['Câu chuyện vĩ mô vẫn tốt nhưng chỉ số phá MA 200 với độ rộng yếu. Hành động:', 'The macro story is fine but the index breaks its 200-MA with weak breadth. Action:', ['Giảm tỷ trọng theo giá', 'Mua thêm vì vĩ mô tốt', 'Không làm gì', 'Tăng đòn bẩy'], ['Reduce exposure per price', 'Buy more on macro', 'Do nothing', 'Add leverage'], 0, '', ''],
    ['Tăng trưởng tín dụng tăng mạnh thường hỗ trợ ngành nào ở Việt Nam?', 'Strong credit growth usually supports which Vietnamese sectors?', ['Ngân hàng, bất động sản, chứng khoán', 'Chỉ dầu khí', 'Không ngành nào', 'Chỉ tiện ích'], ['Banks, real estate, brokers', 'Oil only', 'None', 'Utilities only'], 0, '', ''],
    ['Đơn xin trợ cấp thất nghiệp tăng liên tục thường báo hiệu:', 'Persistently rising jobless claims usually signal:', ['Kinh tế suy yếu', 'Bùng nổ', 'Lạm phát cao', 'Không gì'], ['Economic weakening', 'Boom', 'High inflation', 'Nothing'], 0, '', ''],
    ['Phân loại 4 chế độ vĩ mô là:', 'The four-regime classification is:', ['Xu hướng lịch sử trung bình, không phải quy luật cố định', 'Quy luật bất biến', 'Vô dụng', 'Dự báo chính xác'], ['A historical tendency, not a fixed law', 'An immutable law', 'Useless', 'An exact forecast'], 0, '', ''],
    ['Lãi suất thực dương cao và tăng thường gây áp lực lên:', 'High and rising positive real rates pressure:', ['Vàng và cổ phiếu tăng trưởng định giá cao', 'Tiền mặt', 'USD', 'Không gì'], ['Gold and richly valued growth stocks', 'Cash', 'USD', 'Nothing'], 0, '', ''],
    ['Chế độ "tăng trưởng tốt, lạm phát thấp" thường thuận lợi nhất cho:', 'Goldilocks is usually best for:', ['Cổ phiếu tăng trưởng, công nghệ', 'Vàng', 'Tiền mặt', 'Trái phiếu rủi ro thấp duy nhất'], ['Growth stocks, tech', 'Gold', 'Cash', 'Only safe bonds'], 0, '', ''],
    ['Thị trường cổ phiếu được coi là chỉ báo dẫn trước vì:', 'The stock market is a leading indicator because:', ['Giá chiết khấu kỳ vọng lợi nhuận tương lai', 'Công bố chậm', 'Ngẫu nhiên', 'Do luật'], ['Prices discount expected future earnings', 'Released late', 'Randomly', 'Law'], 0, '', ''],
    ['Tình huống: lợi suất 10 năm − 3 tháng chuyển từ âm sang dương nhanh (dốc lại) sau thời gian đảo ngược dài. Lịch sử cho thấy:', 'Case: the 10y−3m spread re-steepens fast after a long inversion. History suggests:', ['Suy thoái thường đến gần thời điểm dốc lại — thận trọng với rủi ro', 'Bùng nổ chắc chắn', 'Không gì', 'Mua mạnh hàng hoá'], ['Recessions often arrive around re-steepening — be cautious', 'A certain boom', 'Nothing', 'Buy commodities heavily'], 0, '', ''],
    ['Số liệu GDP thường là chỉ báo:', 'GDP data are typically:', ['Trễ (ghi nhận quá khứ)', 'Dẫn trước mạnh', 'Đồng thời tương lai', 'Không có'], ['Lagging (records the past)', 'Strongly leading', 'Future-coincident', 'None'], 0, '', ''],
    ['Vì sao nhà PTKT nên hiểu vĩ mô?', 'Why should technicians understand macro?', ['Để hiểu bối cảnh, giải thích thay đổi quan hệ liên thị trường và đặt tỷ trọng hợp lý', 'Để bỏ phân tích giá', 'Không cần', 'Để dự báo GDP chính xác'], ['To grasp context, explain intermarket shifts and set weights', 'To drop price analysis', 'Unneeded', 'To forecast GDP exactly'], 0, '', ''],
    ['Ngân hàng Nhà nước bơm ròng qua thị trường mở liên tục thường:', 'Continuous net injections by the central bank via open-market operations usually:', ['Hạ nhiệt lãi suất liên ngân hàng, hỗ trợ thanh khoản', 'Tăng lãi suất mạnh', 'Không ảnh hưởng', 'Làm VND tăng giá chắc chắn'], ['Ease interbank rates, supporting liquidity', 'Spike rates', 'No effect', 'Surely strengthen VND'], 0, '', ''],
    ['Đầu ra tốt nhất của phân tích vĩ mô cho nhà quản lý danh mục:', 'The best output of macro analysis for a portfolio manager:', ['Chế độ hiện tại + nhóm tài sản/ngành nên nghiêng về + mức độ tin cậy', 'Giá mục tiêu ngày mai', 'Danh sách tin đồn', 'Không có'], ['Current regime + tilts + confidence', 'Tomorrow’s target', 'Rumours', 'None'], 0, '', ''],
    ['Bài học chính:', 'Key lesson:', ['Vĩ mô định hướng, giá quyết định; kết hợp cả hai để phân bổ có kỷ luật', 'Chỉ cần vĩ mô', 'Chỉ cần giá, bỏ qua bối cảnh', 'Không cần cả hai'], ['Macro guides, price decides; combine both for disciplined allocation', 'Macro only', 'Price only, ignore context', 'Neither'], 0, '', '']
  ]);

  /* ================= L3-18 ================= */
  C.addLesson('l3-18', {
    goals: ['Tính rủi ro danh mục và đóng góp rủi ro của từng thành phần.', 'Phân biệt rủi ro tổng thể, rủi ro hệ thống, rủi ro chủ động; áp dụng ngân sách rủi ro.', 'Thực hiện phân bổ hiệu suất: phân bổ, chọn lọc, tương tác.', 'Đánh giá hiệu suất điều chỉnh rủi ro và phân tích yếu tố.'],
    body: () => `
<h3>1. Rủi ro danh mục</h3>
<p>Với hai tài sản: σ<sub>p</sub>² = w<sub>A</sub>²σ<sub>A</sub>² + w<sub>B</sub>²σ<sub>B</sub>² + 2w<sub>A</sub>w<sub>B</sub>ρσ<sub>A</sub>σ<sub>B</sub>. Khi ρ &lt; 1, σ<sub>p</sub> nhỏ hơn bình quân gia quyền σ — đó là <b>lợi ích đa dạng hoá</b>.</p>
<p><b>Đóng góp rủi ro</b> của một tài sản phụ thuộc tỷ trọng, biến động của nó và tương quan với phần còn lại. Danh mục 60% cổ phiếu/40% trái phiếu theo vốn thường có <b>trên 85–90% rủi ro</b> đến từ cổ phiếu.</p>
${H.port2()}
<h3>2. Các loại rủi ro và ngân sách rủi ro</h3>
<ul><li><b>Rủi ro hệ thống</b> (beta × biến động thị trường) không đa dạng hoá được; <b>rủi ro riêng</b> giảm khi thêm tài sản.</li>
<li><b>Rủi ro chủ động</b> (tracking error) = độ lệch chuẩn của chênh lệch lợi nhuận so với chuẩn.</li>
<li><b>Ngân sách rủi ro</b>: phân bổ "lượng rủi ro" (không phải lượng vốn) cho từng quyết định — ví dụ 40% rủi ro chủ động cho chọn ngành, 60% cho chọn cổ phiếu.</li>
<li><b>Cân bằng rủi ro</b> (risk parity): mỗi tài sản đóng góp rủi ro ngang nhau → tăng tỷ trọng tài sản ít biến động (thường cần đòn bẩy).</li></ul>
<h3>3. Phân bổ hiệu suất (theo ngành)</h3>
<table class="tbl"><thead><tr><th>Hiệu ứng</th><th>Công thức mỗi ngành</th><th>Trả lời câu hỏi</th></tr></thead><tbody>
<tr><td><b>Phân bổ</b></td><td>(w<sub>p</sub> − w<sub>b</sub>) × (R<sub>b,ngành</sub> − R<sub>b,tổng</sub>)</td><td>Có tăng tỷ trọng đúng ngành tốt hơn chuẩn không?</td></tr>
<tr><td><b>Chọn lọc</b></td><td>w<sub>b</sub> × (R<sub>p,ngành</sub> − R<sub>b,ngành</sub>)</td><td>Có chọn đúng cổ phiếu tốt hơn trong ngành không?</td></tr>
<tr><td><b>Tương tác</b></td><td>(w<sub>p</sub> − w<sub>b</sub>) × (R<sub>p,ngành</sub> − R<sub>b,ngành</sub>)</td><td>Có tăng tỷ trọng ngành mà mình chọn cổ phiếu giỏi không?</td></tr></tbody></table>
<p>Tổng ba hiệu ứng = lợi nhuận danh mục − lợi nhuận chuẩn. Với nhà PTKT dùng luân chuyển ngành (đồ thị xoay vòng), hiệu ứng <b>phân bổ</b> đo kỹ năng chọn ngành; dùng sức mạnh tương đối trong ngành thì hiệu ứng <b>chọn lọc</b> đo kỹ năng chọn mã.</p>
${H.brinson()}
<h3>4. Hiệu suất điều chỉnh rủi ro và phân tích yếu tố</h3>
<table class="tbl"><tbody>
<tr><td>Sharpe</td><td>(R<sub>p</sub> − R<sub>f</sub>)/σ<sub>p</sub> — rủi ro tổng</td></tr>
<tr><td>Treynor</td><td>(R<sub>p</sub> − R<sub>f</sub>)/β — rủi ro hệ thống, cho danh mục đã đa dạng hoá</td></tr>
<tr><td>Information ratio</td><td>Lợi nhuận chủ động / tracking error</td></tr>
<tr><td>M²</td><td>Lợi nhuận danh mục sau khi điều chỉnh về cùng σ với chuẩn — đọc theo đơn vị %</td></tr>
<tr><td>Alpha (hồi quy yếu tố)</td><td>Phần lợi nhuận không giải thích được bởi các yếu tố thị trường, quy mô, giá trị, động lượng…</td></tr></tbody></table>
<p>Phân tích yếu tố cho biết lợi nhuận "vượt trội" có thực sự là kỹ năng hay chỉ là <b>tiếp xúc yếu tố</b> (ví dụ một danh mục kỹ thuật theo RS có beta động lượng cao — lợi nhuận đến từ yếu tố động lượng, có thể sao chép rẻ hơn).</p>`,
    keys: ['σp² = wA²σA² + wB²σB² + 2wAwBρσAσB; ρ < 1 → đa dạng hoá; đóng góp rủi ro ≠ tỷ trọng vốn.', 'Rủi ro hệ thống vs riêng; rủi ro chủ động = tracking error; ngân sách rủi ro; cân bằng rủi ro.', 'Phân bổ hiệu suất: phân bổ (chọn ngành), chọn lọc (chọn mã), tương tác — tổng = lợi nhuận chủ động.', 'Sharpe, Treynor, IR, M², alpha yếu tố; phân biệt kỹ năng với tiếp xúc yếu tố.'],
    terms: [['Risk contribution', 'Đóng góp rủi ro'], ['Risk budgeting', 'Ngân sách rủi ro'], ['Risk parity', 'Cân bằng rủi ro'], ['Allocation effect', 'Hiệu ứng phân bổ'], ['Selection effect', 'Hiệu ứng chọn lọc'], ['Interaction effect', 'Hiệu ứng tương tác'], ['Treynor ratio', 'Tỷ số Treynor'], ['M-squared', 'M²'], ['Factor exposure', 'Tiếp xúc yếu tố']]
  }, {
    goals: ['Compute portfolio risk and risk contributions.', 'Distinguish total, systematic and active risk; risk budgets.', 'Perform allocation/selection/interaction attribution.', 'Evaluate risk-adjusted performance and factors.'],
    body: () => `
<h3>1. Portfolio risk</h3><p>σp² = wA²σA² + wB²σB² + 2wAwBρσAσB. 60/40 by capital is often 85–90% equity risk.</p>${H.port2()}
<h3>2. Risk types and budgets</h3><ul><li>Systematic vs specific.</li><li>Active risk = tracking error.</li><li>Risk budgets allocate risk, not capital.</li><li>Risk parity equalises contributions.</li></ul>
<h3>3. Attribution</h3><table class="tbl"><tbody><tr><td>Allocation</td><td>(wp − wb)(Rb,i − Rb)</td></tr><tr><td>Selection</td><td>wb(Rp,i − Rb,i)</td></tr><tr><td>Interaction</td><td>(wp − wb)(Rp,i − Rb,i)</td></tr></tbody></table><p>Sum = active return. Sector rotation shows in allocation; RS stock picking in selection.</p>${H.brinson()}
<h3>4. Risk-adjusted measures</h3><p>Sharpe, Treynor, IR, M², factor alpha — separate skill from factor exposure.</p>`,
    keys: ['Portfolio variance.', 'Risk budgets.', 'Attribution.', 'Risk-adjusted metrics and factors.'],
    terms: [['Allocation effect', 'Return from sector weighting'], ['Selection effect', 'Return from security choice']]
  }, [
    ['Hai tài sản σ 20% và 10%, tỷ trọng 50/50, ρ = 1. σ danh mục:', 'Two assets σ 20% and 10%, 50/50, ρ = 1. Portfolio σ:', ['15%', '11.2%', '5%', '30%'], null, 0, 'ρ = 1 → bình quân gia quyền.', ''],
    ['Cùng dữ liệu nhưng ρ = 0. σ danh mục ≈', 'Same data with ρ = 0. Portfolio σ ≈', ['15%', '11.2%', '5%', '7.5%'], null, 1, '√(0.25×400 + 0.25×100) = √125.', ''],
    ['Lợi ích đa dạng hoá xuất hiện khi:', 'Diversification benefit appears when:', ['Tương quan < 1', 'Tương quan = 1', 'Chỉ khi tương quan âm', 'Không bao giờ'], ['Correlation < 1', 'Correlation = 1', 'Only negative correlation', 'Never'], 0, '', ''],
    ['Danh mục 60/40 theo vốn thường có phần lớn rủi ro đến từ:', 'A 60/40 portfolio by capital usually gets most risk from:', ['Cổ phiếu', 'Trái phiếu', 'Chia đều', 'Tiền mặt'], ['Stocks', 'Bonds', 'Equally', 'Cash'], 0, '', ''],
    ['Rủi ro không thể đa dạng hoá:', 'Non-diversifiable risk:', ['Rủi ro hệ thống', 'Rủi ro riêng', 'Rủi ro dữ liệu', 'Không có'], ['Systematic risk', 'Specific risk', 'Data risk', 'None'], 0, '', ''],
    ['Ngân sách rủi ro phân bổ:', 'Risk budgeting allocates:', ['Lượng rủi ro cho từng quyết định/thành phần', 'Lượng vốn bằng nhau', 'Phí', 'Thời gian'], ['Risk to each decision/component', 'Equal capital', 'Fees', 'Time'], 0, '', ''],
    ['Cân bằng rủi ro (risk parity) thường:', 'Risk parity usually:', ['Tăng tỷ trọng tài sản ít biến động, có thể cần đòn bẩy', 'Dồn vào cổ phiếu', 'Bỏ trái phiếu', 'Không dùng đòn bẩy bao giờ'], ['Overweights low-volatility assets, possibly with leverage', 'Concentrates in stocks', 'Drops bonds', 'Never uses leverage'], 0, '', ''],
    ['Hiệu ứng phân bổ đo:', 'The allocation effect measures:', ['Kỹ năng tăng/giảm tỷ trọng ngành so với chuẩn', 'Kỹ năng chọn mã', 'Phí', 'Biến động'], ['Skill in over/underweighting sectors', 'Stock-picking skill', 'Fees', 'Volatility'], 0, '', ''],
    ['Hiệu ứng chọn lọc đo:', 'The selection effect measures:', ['Kỹ năng chọn cổ phiếu tốt hơn trong ngành', 'Chọn ngành', 'Thời điểm thị trường', 'Thuế'], ['Picking better stocks within sectors', 'Sector choice', 'Market timing', 'Taxes'], 0, '', ''],
    ['Ngành có wp = 30%, wb = 20%, Rb,ngành = 10%, Rb tổng = 6%. Hiệu ứng phân bổ ngành đó:', 'Sector wp 30%, wb 20%, sector Rb 10%, total Rb 6%. Allocation effect:', ['+0.4%', '+1%', '+0.6%', '−0.4%'], null, 0, '0.1 × 0.04.', ''],
    ['Ngành wb = 25%, Rp,ngành = 12%, Rb,ngành = 8%. Hiệu ứng chọn lọc:', 'Sector wb 25%, Rp 12%, Rb 8%. Selection effect:', ['+1%', '+3%', '+4%', '+0.25%'], null, 0, '0.25 × 0.04.', ''],
    ['Tổng phân bổ + chọn lọc + tương tác bằng:', 'Allocation + selection + interaction equals:', ['Lợi nhuận danh mục − lợi nhuận chuẩn', 'Lợi nhuận danh mục', 'Phí', 'Beta'], ['Portfolio minus benchmark return', 'Portfolio return', 'Fees', 'Beta'], 0, '', ''],
    ['Nhà PTKT luân chuyển ngành bằng đồ thị xoay vòng; kỹ năng thể hiện chủ yếu ở hiệu ứng:', 'A technician rotating sectors via rotation charts shows skill mainly in:', ['Phân bổ', 'Chọn lọc', 'Tương tác', 'Không hiệu ứng nào'], ['Allocation', 'Selection', 'Interaction', 'None'], 0, '', ''],
    ['Tỷ số Treynor dùng mẫu số:', 'The Treynor ratio’s denominator:', ['Beta', 'σ tổng', 'Tracking error', 'Sụt giảm'], ['Beta', 'Total σ', 'Tracking error', 'Drawdown'], 0, '', ''],
    ['Treynor phù hợp nhất cho:', 'Treynor suits best:', ['Danh mục đã đa dạng hoá tốt (rủi ro riêng nhỏ)', 'Danh mục một mã', 'Không danh mục nào', 'Quỹ trái phiếu duy nhất'], ['Well-diversified portfolios', 'Single-stock portfolios', 'None', 'Only bond funds'], 0, '', ''],
    ['M² cho phép:', 'M² allows:', ['So sánh lợi nhuận ở cùng mức rủi ro với chuẩn, đọc theo %', 'Tính phí', 'Đo thanh khoản', 'Không gì'], ['Comparing returns at the benchmark’s risk, in % terms', 'Computing fees', 'Measuring liquidity', 'Nothing'], 0, '', ''],
    ['Rp 15%, Rf 3%, β 1.2. Treynor =', 'Rp 15%, Rf 3%, β 1.2. Treynor =', ['10', '12.5', '15', '0.1'], null, 0, '12/1.2 = 10 (điểm %).', ''],
    ['Phân tích yếu tố giúp:', 'Factor analysis helps:', ['Phân biệt kỹ năng thật với tiếp xúc yếu tố có thể sao chép', 'Tăng lợi nhuận', 'Giảm phí', 'Không gì'], ['Separate true skill from replicable factor exposure', 'Raise returns', 'Cut fees', 'Nothing'], 0, '', ''],
    ['Danh mục RS có alpha bằng 0 sau khi kiểm soát yếu tố động lượng. Kết luận:', 'An RS portfolio has zero alpha after controlling for momentum. Conclusion:', ['Lợi nhuận đến từ tiếp xúc yếu tố động lượng', 'Kỹ năng chọn mã xuất sắc', 'Lỗi dữ liệu', 'Không kết luận gì'], ['Returns come from momentum factor exposure', 'Superb stock picking', 'Data error', 'Nothing'], 0, '', ''],
    ['Đóng góp rủi ro của một tài sản phụ thuộc:', 'An asset’s risk contribution depends on:', ['Tỷ trọng, biến động và tương quan với phần còn lại', 'Chỉ tỷ trọng vốn', 'Chỉ giá', 'Tên mã'], ['Weight, volatility and correlation with the rest', 'Capital weight only', 'Price only', 'Ticker'], 0, '', ''],
    ['Tracking error cao nghĩa là:', 'High tracking error means:', ['Danh mục lệch nhiều khỏi chuẩn', 'Giống chuẩn', 'Rủi ro thấp', 'Phí thấp'], ['The portfolio deviates a lot from the benchmark', 'Mirrors the benchmark', 'Low risk', 'Low fees'], 0, '', ''],
    ['Tình huống: quỹ vượt chuẩn 2%, toàn bộ từ hiệu ứng phân bổ, chọn lọc âm. Đánh giá:', 'Case: a fund beats its benchmark by 2%, all from allocation; selection negative. Assessment:', ['Kỹ năng chọn ngành tốt, chọn mã trong ngành yếu', 'Chọn mã xuất sắc', 'May mắn hoàn toàn', 'Không đánh giá được'], ['Good sector calls, weak stock picking within sectors', 'Superb stock picking', 'Pure luck', 'Cannot assess'], 0, '', ''],
    ['Hiệu ứng tương tác dương khi:', 'The interaction effect is positive when:', ['Tăng tỷ trọng ngành mà mình chọn mã tốt hơn chuẩn', 'Giảm tỷ trọng ngành chọn mã tốt', 'Không bao giờ', 'Tỷ trọng bằng chuẩn'], ['Overweighting sectors where your picks beat the benchmark', 'Underweighting good-pick sectors', 'Never', 'Equal weights'], 0, '', ''],
    ['Thêm tài sản có tương quan âm với danh mục sẽ:', 'Adding an asset negatively correlated with the portfolio will:', ['Giảm rủi ro danh mục đáng kể', 'Tăng rủi ro', 'Không ảnh hưởng', 'Tăng beta'], ['Reduce portfolio risk materially', 'Raise risk', 'No effect', 'Raise beta'], 0, '', ''],
    ['Vì sao đánh giá theo rủi ro thay vì chỉ lợi nhuận?', 'Why evaluate risk-adjusted rather than raw returns?', ['Lợi nhuận cao có thể chỉ do nhận nhiều rủi ro hơn', 'Lợi nhuận không quan trọng', 'Do luật', 'Không cần'], ['High returns may merely reflect more risk', 'Returns don’t matter', 'Law', 'Unneeded'], 0, '', ''],
    ['Quỹ A Sharpe 0.8, quỹ B Sharpe 0.5 (cùng giai đoạn). Theo lợi nhuận trên rủi ro tổng:', 'Fund A Sharpe 0.8, B 0.5 (same period). On return per total risk:', ['A tốt hơn', 'B tốt hơn', 'Như nhau', 'Không so được'], ['A is better', 'B is better', 'Equal', 'Incomparable'], 0, '', ''],
    ['Rủi ro riêng giảm khi:', 'Specific risk falls when:', ['Thêm nhiều tài sản ít tương quan', 'Tập trung một mã', 'Tăng đòn bẩy', 'Không bao giờ'], ['Adding many lowly correlated assets', 'Concentrating', 'Leveraging', 'Never'], 0, '', ''],
    ['Lợi nhuận chủ động 3%, tracking error 6%. IR =', 'Active return 3%, TE 6%. IR =', ['0.5', '2', '18', '0.3'], null, 0, '', ''],
    ['Ngân sách rủi ro hợp lý cho nhà quản lý giỏi chọn ngành, yếu chọn mã:', 'A sensible risk budget for a manager good at sectors, weak at stocks:', ['Dành phần lớn rủi ro chủ động cho quyết định ngành; dùng rổ đa dạng trong ngành', 'Dồn rủi ro vào chọn mã', 'Không dùng rủi ro', 'Chia đều bất kể kỹ năng'], ['Spend most active risk on sector calls; use diversified baskets within sectors', 'Concentrate on stock picks', 'Take no risk', 'Split equally regardless'], 0, '', ''],
    ['Bài học chính của rủi ro danh mục và phân bổ hiệu suất:', 'Key lesson of portfolio risk and attribution:', ['Biết rủi ro đến từ đâu và lợi nhuận đến từ quyết định nào để cải thiện có hệ thống', 'Chỉ cần lợi nhuận', 'Không cần đo', 'Mọi rủi ro như nhau'], ['Know where risk and returns come from to improve systematically', 'Only returns matter', 'No measuring', 'All risk alike'], 0, '', '']
  ]);
})(window.LLW);
