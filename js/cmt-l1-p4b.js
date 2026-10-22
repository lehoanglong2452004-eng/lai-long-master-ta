// © 2026 Lai Long Master TA. Bảo lưu mọi quyền. Không sao chép, chỉnh sửa hay dùng lại khi chưa được phép.
/* CMT Level 1 — Part IV (b), lessons 22–26: ETPs, FX, options, implied volatility, VIX. Written by Lai Long Master TA in its own words. */
(function (L) {
  'use strict';
  const C = L.cmt, F = C.fig;
  const T = (lang, vi, en) => (lang === 'en' ? en : vi);
  const Q = (q, o, a, e) => ({ q, o, a, e });
  const css = C.css;
  const ld = () => `<span class="spinner"></span>${L.t('loading')}`;

  /* ---------- leveraged ETF decay ---------- */
  C.demoHtml.levDecay = () => C.calcShell('levDecay', `${C.num('lev', 2, L.T('Đòn bẩy (x)', 'Leverage (x)'), 1)}${C.num('mv', 10, L.T('Biến động mỗi ngày ±%', 'Daily swing ±%'), 1)}${C.num('days', 10, L.T('Số ngày', 'Days'), 1)}`,
    '');
  C.demoRun.levDecay = box => {
    const run = () => {
      const k = +box.querySelector('.lev').value, m = +box.querySelector('.mv').value / 100, n = Math.max(2, Math.round(+box.querySelector('.days').value));
      let idx = 100, etf = 100; const rows = [];
      for (let d = 1; d <= n; d++) { const r = d % 2 ? m : -m; idx *= 1 + r; etf *= 1 + k * r; if (d <= 4 || d === n) rows.push(`<tr><td>${d}</td><td>${r > 0 ? '+' : ''}${(r * 100).toFixed(0)}%</td><td>${idx.toFixed(2)}</td><td>${etf.toFixed(2)}</td></tr>`); }
      box.querySelector('.demo-out').innerHTML = `<table class="tbl"><thead><tr><th>${L.T('Ngày', 'Day')}</th><th>${L.T('Chỉ số', 'Index')}</th><th>${L.T('Giá trị chỉ số', 'Index value')}</th><th>ETF ${k}x</th></tr></thead><tbody>${rows.join('')}</tbody></table>
        <p>${L.T(`Sau ${n} ngày dao động lên xuống, chỉ số còn <b>${idx.toFixed(2)}</b> (${(idx - 100).toFixed(2)}%), nhưng ETF ${k}x còn <b>${etf.toFixed(2)}</b> (${(etf - 100).toFixed(2)}%) — tức lỗ nhiều hơn ${k} lần. Đây là <b>hao mòn biến động (volatility decay)</b>: sản phẩm đòn bẩy cân bằng lại mỗi ngày nên chỉ phù hợp giao dịch ngắn hạn theo xu hướng rõ.`,
        `After ${n} back-and-forth days the index is <b>${idx.toFixed(2)}</b> (${(idx - 100).toFixed(2)}%) but the ${k}x ETF is <b>${etf.toFixed(2)}</b> (${(etf - 100).toFixed(2)}%) — far worse than ${k}×. This is <b>volatility decay</b> from daily rebalancing.`)}</p>`;
    };
    box.querySelectorAll('.d-num').forEach(i => { i.oninput = run; });
    run();
  };

  /* ---------- option payoff ---------- */
  C.demoHtml.optPay = () => C.calcShell('optPay', `${C.mkSel('d-type', [['call', L.T('Mua Call', 'Long call')], ['put', L.T('Mua Put', 'Long put')], ['scall', L.T('Bán Call', 'Short call')], ['sput', L.T('Bán Put', 'Short put')]], 'call')}${C.num('k', 100, 'Strike', 1)}${C.num('prem', 5, L.T('Phí', 'Premium'), 0.5)}`);
  C.demoRun.optPay = box => {
    const run = () => {
      const type = box.querySelector('.d-type').value, K = +box.querySelector('.k').value, P = +box.querySelector('.prem').value;
      const pay = S => { const call = Math.max(0, S - K) - P, put = Math.max(0, K - S) - P; return { call, put, scall: -call, sput: -put }[type]; };
      const lo = K * 0.6, hi = K * 1.4, pts = [];
      for (let k = 0; k <= 80; k++) { const S = lo + (hi - lo) * k / 80; pts.push([S, pay(S)]); }
      const ys = pts.map(p => p[1]), ymin = Math.min(...ys, -P * 1.5), ymax = Math.max(...ys, P * 1.5);
      const W = 640, H = 220, x = S => 30 + (S - lo) / (hi - lo) * (W - 50), y = v => 15 + (ymax - v) / (ymax - ymin) * (H - 40);
      const path = pts.map((p, k) => (k ? 'L' : 'M') + x(p[0]).toFixed(1) + ' ' + y(p[1]).toFixed(1)).join(' ');
      const be = type === 'call' || type === 'scall' ? K + P : K - P;
      box.querySelector('.demo-calc').innerHTML = `<svg viewBox="0 0 ${W} ${H}" class="schem cfig"><line x1="30" y1="${y(0)}" x2="${W - 20}" y2="${y(0)}" class="s-sep"/><line x1="${x(K)}" y1="10" x2="${x(K)}" y2="${H - 20}" class="s-trend2"/>
        <path d="${path}" class="s-price"/><text x="${x(K) + 4}" y="22" class="s-small">K = ${K}</text><text x="${x(be)}" y="${y(0) - 6}" class="s-label" text-anchor="middle">BE ${be}</text>
        <text x="32" y="${H - 6}" class="s-small">${L.T('Giá tài sản cơ sở khi đáo hạn →', 'Underlying at expiry →')}</text></svg>`;
      const info = {
        call: L.T(`Lỗ tối đa = phí ${P}; lãi không giới hạn khi giá tăng; hoà vốn ${be}.`, `Max loss = premium ${P}; unlimited upside; breakeven ${be}.`),
        put: L.T(`Lỗ tối đa = phí ${P}; lãi tối đa ${K - P} nếu giá về 0; hoà vốn ${be}.`, `Max loss ${P}; max gain ${K - P}; breakeven ${be}.`),
        scall: L.T(`Lãi tối đa = phí ${P}; lỗ không giới hạn khi giá tăng mạnh — rủi ro rất cao.`, `Max gain ${P}; unlimited loss — very risky.`),
        sput: L.T(`Lãi tối đa = phí ${P}; lỗ lớn nếu giá sụp (tối đa ${K - P}).`, `Max gain ${P}; large loss if price collapses (max ${K - P}).`)
      }[type];
      box.querySelector('.demo-out').innerHTML = info;
    };
    box.querySelectorAll('.d-num, .d-type').forEach(i => { i.oninput = run; i.onchange = run; });
    run();
  };

  /* ---------- historical volatility & expected move ---------- */
  C.demoHtml.histVol = () => C.demoShell('histVol', C.symControls('bn_spot', 'BTCUSDT', '1D', ['1D']) + C.mkSel('d-n', [['20', 'HV 20'], ['60', 'HV 60']], '20') + `<button class="btn primary d-go">${L.T('Xem', 'Show')}</button>`,
    L.T('Đường vàng = biến động lịch sử năm hoá (thang bên trái, %).', 'Gold line = annualised historical volatility (left scale, %).'));
  C.demoRun.histVol = box => {
    const out = box.querySelector('.demo-out'), el = box.querySelector('.demo-chart');
    C.wire(box, async () => {
      out.innerHTML = ld();
      try {
        const [mk, sym] = C.readSym(box);
        const bars = await C.loadBars(mk, sym, '1D'), n = +box.querySelector('.d-n').value;
        const yearDays = mk === 'bn_spot' ? 365 : 252;
        const r = bars.map((b, i) => (i ? Math.log(b.c / bars[i - 1].c) : 0));
        const hv = bars.map((_, i) => { if (i < n) return null; const s = r.slice(i - n + 1, i + 1), m = s.reduce((a, b) => a + b, 0) / n; return Math.sqrt(s.reduce((a, x) => a + (x - m) ** 2, 0) / (n - 1)) * Math.sqrt(yearDays) * 100; });
        el.innerHTML = '';
        const ch = C.mkChart(el, { leftPriceScale: { visible: true, borderColor: css('--line') } }), s = C.candleSeries(ch);
        s.setData(bars.map(b => ({ time: b.t, open: b.o, high: b.h, low: b.l, close: b.c })));
        ch.addLineSeries({ color: css('--accent'), lineWidth: 2, priceScaleId: 'left', priceLineVisible: false }).setData(bars.map((b, i) => hv[i] == null ? null : { time: b.t, value: hv[i] }).filter(Boolean));
        ch.timeScale().fitContent();
        const last = hv[hv.length - 1], px = bars[bars.length - 1].c;
        const valid = hv.filter(v => v != null), rank = valid.filter(v => v <= last).length / valid.length * 100;
        const d1 = last / 100 / Math.sqrt(yearDays), d30 = last / 100 * Math.sqrt(30 / 365);
        out.innerHTML = L.T(`HV${n} hiện tại ≈ <b>${last.toFixed(1)}%/năm</b> (cao hơn ${rank.toFixed(0)}% số ngày trong dữ liệu). Biến động 1 độ lệch chuẩn dự kiến: 1 ngày ≈ ±${(d1 * 100).toFixed(2)}% (±${L.fmtP(px * d1)}), 30 ngày lịch ≈ ±${(d30 * 100).toFixed(1)}% (±${L.fmtP(px * d30)}). Khoảng ±1σ chứa giá khoảng 68% thời gian (giả định phân phối chuẩn).`,
          `HV${n} ≈ <b>${last.toFixed(1)}%/yr</b> (above ${rank.toFixed(0)}% of days). 1σ expected move: 1 day ≈ ±${(d1 * 100).toFixed(2)}% (±${L.fmtP(px * d1)}), 30 calendar days ≈ ±${(d30 * 100).toFixed(1)}% (±${L.fmtP(px * d30)}). ±1σ covers about 68% of outcomes under normality.`);
      } catch (e) { C.err(out, e); }
    });
  };

  const fg = {
    vix: lg => F.line({ h: 240, series: [{ pts: [[0, 60], [15, 70], [25, 66], [40, 78], [48, 40], [55, 30], [62, 48], [75, 58], [90, 70], [100, 76]] }, { pts: [[0, 20], [15, 16], [25, 18], [40, 14], [48, 70], [55, 88], [62, 50], [75, 30], [90, 20], [100, 18]], cls: 's-price2' }],
      labels: [[55, 88, T(lg, 'VIX tăng vọt = sợ hãi', 'VIX spike = fear'), 'r'], [55, 30, T(lg, 'đáy giá', 'price low'), 'b']],
      caption: T(lg, 'Chỉ số (trắng) và VIX (xanh) thường nghịch chiều; VIX tăng vọt thường trùng đáy hoảng loạn', 'Index (white) and VIX (green) move inversely; VIX spikes often coincide with panic lows') })
  };

  /* ================= LESSON 22 ================= */
  C.lessons['l1-22'] = {
    vi: {
      goals: ['Phân biệt ETF, ETN và các sản phẩm giao dịch trên sàn khác.', 'Hiểu cơ chế tạo lập/mua lại và quan hệ giá – NAV.', 'Hiểu rủi ro của ETF đòn bẩy và đảo ngược (hao mòn biến động).', 'Dùng ETP như công cụ của nhà PTKT.'],
      body: () => `
<h3>1. Các loại ETP</h3>
<table class="tbl"><thead><tr><th>Loại</th><th>Bản chất</th><th>Rủi ro đặc thù</th></tr></thead><tbody>
<tr><td><b>ETF</b></td><td>Quỹ nắm giữ rổ tài sản, mô phỏng một chỉ số</td><td>Sai lệch theo dõi (tracking error), phí</td></tr>
<tr><td><b>ETN</b></td><td>Trái phiếu không bảo đảm do tổ chức phát hành, trả theo hiệu suất chỉ số</td><td>Rủi ro tín dụng của tổ chức phát hành</td></tr>
<tr><td><b>ETF đòn bẩy / đảo ngược</b></td><td>Mục tiêu 2x, 3x hoặc −1x… hiệu suất <b>trong ngày</b></td><td>Hao mòn biến động khi nắm giữ lâu</td></tr>
<tr><td><b>ETF hàng hoá dùng hợp đồng tương lai</b></td><td>Nắm giữ và roll hợp đồng tương lai</td><td>Chi phí roll khi thị trường contango</td></tr></tbody></table>
<h3>2. Cơ chế tạo lập / mua lại</h3>
<p>Các <b>thành viên lập quỹ (authorized participants)</b> có thể đổi rổ cổ phiếu lấy chứng chỉ ETF (tạo lập) và ngược lại (mua lại). Khi giá ETF cao hơn giá trị tài sản ròng (NAV), họ tạo lập và bán ETF; khi thấp hơn, họ mua ETF và mua lại. Cơ chế <b>kinh doanh chênh lệch</b> này giữ giá ETF sát NAV.</p>
<h3>3. Hao mòn biến động của sản phẩm đòn bẩy</h3>
<p>Sản phẩm đòn bẩy cân bằng lại mỗi ngày để đạt đúng bội số của lợi nhuận <b>ngày</b>. Qua nhiều ngày dao động lên xuống, lợi nhuận kép khiến kết quả xấu hơn nhiều so với "bội số × lợi nhuận kỳ".</p>
${C.demoHtml.levDecay()}
<h3>4. ETP trong tay nhà PTKT</h3>
<ul><li>Giao dịch <b>ngành, quốc gia, tài sản</b> (vàng, trái phiếu) dễ dàng bằng một mã.</li>
<li>Phân tích <b>sức mạnh tương đối</b> giữa các ETF ngành để thấy luân chuyển dòng tiền.</li>
<li>Dòng tiền vào/ra ETF và số chứng chỉ lưu hành là thông tin tâm lý.</li>
<li>Việt Nam: các ETF như E1VFVN30, FUESSVFL, FUEVFVND… mô phỏng chỉ số trong nước; dòng tiền ETF ngoại (thường được truyền thông theo dõi) ảnh hưởng tới các mã trong rổ khi tái cơ cấu.</li></ul>`,
      keys: ['ETF nắm giữ tài sản; ETN là nợ của tổ chức phát hành (rủi ro tín dụng).', 'Tạo lập/mua lại bởi thành viên lập quỹ giữ giá ETF sát NAV.', 'ETF đòn bẩy/đảo ngược nhắm bội số lợi nhuận ngày → hao mòn biến động khi giữ lâu.', 'ETF hàng hoá dùng tương lai chịu chi phí roll khi contango.', 'ETP giúp giao dịch ngành/tài sản và phân tích sức mạnh tương đối.'],
      terms: [['ETF / ETN', 'Quỹ hoán đổi danh mục / Chứng chỉ nợ giao dịch trên sàn'], ['NAV', 'Giá trị tài sản ròng'], ['Authorized participant', 'Thành viên lập quỹ'], ['Tracking error', 'Sai lệch theo dõi'], ['Volatility decay', 'Hao mòn biến động'], ['Roll cost', 'Chi phí chuyển hợp đồng']],
      quiz: [
        Q('Rủi ro đặc thù của ETN so với ETF là:', ['Không có', 'Rủi ro tín dụng của tổ chức phát hành', 'Không giao dịch được', 'Không theo chỉ số'], 1, 'ETN là nợ không bảo đảm.'),
        Q('Giá ETF cao hơn NAV đáng kể. Thành viên lập quỹ sẽ:', ['Mua lại chứng chỉ', 'Tạo lập chứng chỉ mới và bán ra', 'Không làm gì', 'Huỷ quỹ'], 1, 'Kinh doanh chênh lệch kéo giá về sát NAV.'),
        Q('Chỉ số +10% rồi −10%. ETF 2x (cân bằng hằng ngày) có kết quả:', ['0%', '−4%', '−1%', '+2%'], 1, '1.2 × 0.8 = 0.96 → −4%; chỉ số: 1.1 × 0.9 = 0.99 → −1%.'),
        Q('ETF đòn bẩy phù hợp nhất cho:', ['Nắm giữ nhiều năm', 'Giao dịch ngắn hạn theo xu hướng rõ', 'Thị trường đi ngang', 'Hưu trí'], 1, 'Hao mòn biến động khi giữ lâu trong dao động.'),
        Q('ETF dầu dùng hợp đồng tương lai trong thị trường contango thường:', ['Theo sát giá giao ngay', 'Kém hơn giá giao ngay do chi phí roll', 'Tốt hơn giá giao ngay', 'Không bị ảnh hưởng'], 1, 'Liên tục bán rẻ hợp đồng gần, mua đắt hợp đồng xa.'),
        Q('Vì sao ETF ngành hữu ích cho nhà PTKT?', ['Không có biến động', 'Dễ phân tích sức mạnh tương đối và luân chuyển ngành', 'Luôn tăng', 'Không cần dữ liệu'], 1, 'So sánh các ngành bằng một mã duy nhất.'),
        Q('Tracking error là:', ['Lỗi hiển thị', 'Chênh lệch hiệu suất giữa ETF và chỉ số mục tiêu', 'Phí giao dịch', 'Giá NAV'], 1, 'Do phí, cách chọn mẫu, chi phí giao dịch.'),
        Q('ETF đảo ngược −1x nhắm tới:', ['−1 lần lợi nhuận cả năm', '−1 lần lợi nhuận trong ngày', 'Lợi nhuận cố định', 'Giá vàng'], 1, 'Mục tiêu theo ngày, không theo kỳ dài.')
      ]
    },
    en: {
      goals: ['Distinguish ETFs, ETNs and other ETPs.', 'Understand creation/redemption.', 'Understand leveraged/inverse decay.', 'Use ETPs as a technician.'],
      body: () => `
<h3>1. Types</h3><table class="tbl"><tbody><tr><td>ETF</td><td>Holds a basket; tracking error, fees</td></tr><tr><td>ETN</td><td>Unsecured note; issuer credit risk</td></tr><tr><td>Leveraged/inverse</td><td>Daily multiple; decay over time</td></tr><tr><td>Futures-based commodity ETF</td><td>Roll costs in contango</td></tr></tbody></table>
<h3>2. Creation/redemption</h3><p>Authorized participants arbitrage price versus NAV, keeping them close.</p>
<h3>3. Volatility decay</h3><p>Daily rebalancing compounds poorly in choppy markets.</p>${C.demoHtml.levDecay()}
<h3>4. For technicians</h3><ul><li>Trade sectors, countries, assets with one ticker.</li><li>Sector relative strength and rotation.</li><li>Flows as sentiment.</li><li>Vietnam: E1VFVN30, FUESSVFL, FUEVFVND; foreign ETF rebalancing.</li></ul>`,
      keys: ['ETF holds assets; ETN is issuer debt.', 'AP arbitrage keeps price near NAV.', 'Leveraged products decay over time.', 'Futures ETFs pay roll costs in contango.', 'ETPs enable sector RS analysis.'],
      terms: [['NAV', 'Net asset value'], ['Volatility decay', 'Loss from daily rebalancing in chop']],
      quiz: [
        Q('ETN-specific risk:', ['None', 'Issuer credit risk', 'Untradable', 'No index'], 1, ''),
        Q('ETF well above NAV — APs:', ['Redeem', 'Create and sell', 'Nothing', 'Close the fund'], 1, ''),
        Q('Index +10% then −10%; 2x daily ETF:', ['0%', '−4%', '−1%', '+2%'], 1, '1.2 × 0.8.'),
        Q('Leveraged ETFs suit:', ['Multi-year holding', 'Short-term trend trades', 'Ranges', 'Retirement'], 1, ''),
        Q('Futures oil ETF in contango:', ['Tracks spot', 'Lags spot from roll costs', 'Beats spot', 'Unaffected'], 1, ''),
        Q('Sector ETFs help technicians with:', ['No volatility', 'Relative strength and rotation', 'Always rising', 'No data'], 1, ''),
        Q('Tracking error is:', ['Display bug', 'Performance gap vs the index', 'A fee', 'NAV'], 1, ''),
        Q('A −1x inverse ETF targets:', ['−1× annual return', '−1× daily return', 'Fixed return', 'Gold'], 1, '')
      ]
    }
  };

  /* ================= LESSON 23 ================= */
  C.lessons['l1-23'] = {
    vi: {
      goals: ['Hiểu cách yết giá cặp tiền: đồng cơ sở, đồng định giá, pip.', 'Nắm cấu trúc thị trường ngoại hối: OTC, 24 giờ, các phiên.', 'Hiểu các động lực chính: lãi suất, carry trade, chỉ số USD.', 'Nhận biết hạn chế dữ liệu khối lượng trong ngoại hối.'],
      body: () => `
<h3>1. Cặp tiền và yết giá</h3>
<p>Ngoại hối luôn giao dịch theo <b>cặp</b>. Trong EUR/USD = 1.0850, EUR là <b>đồng cơ sở</b> và USD là <b>đồng định giá</b>: 1 EUR đổi được 1.0850 USD. Mua EUR/USD nghĩa là mua EUR, bán USD.</p>
<ul><li><b>Pip</b>: đơn vị thay đổi nhỏ nhất thông dụng, thường là 0.0001 (với cặp có JPY là 0.01).</li>
<li><b>Lot chuẩn</b>: 100.000 đơn vị đồng cơ sở.</li>
<li><b>Cặp chính (majors)</b>: có USD (EUR/USD, USD/JPY, GBP/USD…). <b>Cặp chéo (crosses)</b>: không có USD (EUR/JPY…).</li></ul>
<h3>2. Cấu trúc thị trường</h3>
<ul><li>Thị trường <b>phi tập trung</b> lớn nhất thế giới, giao dịch gần 24 giờ từ thứ Hai đến thứ Sáu, theo các phiên Á (Tokyo, Sydney), Âu (London), Mỹ (New York). Thanh khoản cao nhất khi phiên London và New York chồng lên nhau.</li>
<li>Thành phần: ngân hàng (liên ngân hàng), ngân hàng trung ương, quỹ, doanh nghiệp xuất nhập khẩu, nhà đầu cơ cá nhân qua môi giới.</li>
<li>Không có khối lượng tập trung. Dữ liệu khối lượng thường là <b>tick volume</b> (số lần giá thay đổi) của từng nhà cung cấp. Có thể dùng hợp đồng tương lai tiền tệ trên sàn để tham khảo khối lượng và OI thật.</li></ul>
<h3>3. Động lực giá</h3>
<ul><li><b>Chênh lệch lãi suất</b>: đồng tiền có lãi suất cao (hoặc kỳ vọng tăng lãi suất) thường được ưa chuộng.</li>
<li><b>Carry trade</b>: vay đồng lãi suất thấp, đầu tư vào đồng lãi suất cao để hưởng chênh lệch. Khi tâm lý chuyển sang tránh rủi ro, các vị thế carry bị đóng ồ ạt, gây biến động mạnh.</li>
<li><b>Chỉ số USD (DXY)</b>: đo USD so với rổ tiền chính (EUR chiếm tỷ trọng lớn). Xu hướng USD ảnh hưởng mạnh tới hàng hoá (thường nghịch chiều) và thị trường mới nổi.</li>
<li>Cán cân thương mại, dòng vốn, chính sách tiền tệ, sự kiện địa chính trị.</li></ul>
<h3>4. PTKT trong ngoại hối</h3>
<p>Ngoại hối có xu hướng kéo dài do các chu kỳ chính sách tiền tệ, nên các phương pháp theo xu hướng thường hiệu quả. Thị trường 24 giờ có ít khoảng trống, nhưng có thể có gap vào đầu tuần. Các mức số tròn và các đỉnh/đáy của phiên trước là vùng hỗ trợ/kháng cự quan trọng. Với Việt Nam, tỷ giá USD/VND được quản lý trong biên độ quanh tỷ giá trung tâm, nên ít phù hợp cho giao dịch kỹ thuật ngắn hạn.</p>`,
      keys: ['Cặp tiền: đồng cơ sở/định giá; pip thường 0.0001 (JPY 0.01); lot chuẩn 100.000.', 'Thị trường OTC, gần 24h, các phiên Á–Âu–Mỹ; thanh khoản cao nhất khi London–New York chồng nhau.', 'Không có khối lượng tập trung — dùng tick volume hoặc futures tiền tệ.', 'Động lực: chênh lệch lãi suất, carry trade, chỉ số USD, dòng vốn.', 'Xu hướng ngoại hối thường kéo dài theo chu kỳ chính sách tiền tệ.'],
      terms: [['Base / Quote currency', 'Đồng cơ sở / đồng định giá'], ['Pip', 'Đơn vị giá nhỏ'], ['Major / Cross', 'Cặp chính / cặp chéo'], ['Carry trade', 'Giao dịch chênh lệch lãi suất'], ['DXY', 'Chỉ số đô la Mỹ'], ['Tick volume', 'Số lần thay đổi giá']],
      quiz: [
        Q('Trong USD/JPY = 150.00, đồng cơ sở là:', ['JPY', 'USD', 'Cả hai', 'Không có'], 1, 'Đồng đứng trước là đồng cơ sở.'),
        Q('EUR/USD tăng từ 1.0850 lên 1.0870. Đó là bao nhiêu pip?', ['2', '20', '200', '0.002'], 1, '0.0020 / 0.0001 = 20 pip.'),
        Q('Thanh khoản ngoại hối thường cao nhất khi:', ['Phiên Á', 'Phiên London và New York chồng nhau', 'Cuối tuần', 'Ngày lễ'], 1, 'Hai trung tâm lớn nhất cùng hoạt động.'),
        Q('Carry trade là:', ['Mua đồng lãi suất thấp', 'Vay đồng lãi suất thấp, đầu tư đồng lãi suất cao', 'Mua vàng', 'Bán khống cổ phiếu'], 1, 'Hưởng chênh lệch lãi suất.'),
        Q('Rủi ro chính của carry trade là:', ['Không có', 'Đóng vị thế ồ ạt khi tâm lý tránh rủi ro', 'Lãi suất bằng nhau', 'Không thanh khoản'], 1, 'Biến động có thể xoá lợi nhuận chênh lệch nhiều tháng.'),
        Q('Vì sao dữ liệu khối lượng ngoại hối giao ngay hạn chế?', ['Không ai giao dịch', 'Thị trường phi tập trung', 'Bị cấm', 'Giá cố định'], 1, 'Dùng tick volume hoặc futures tiền tệ.'),
        Q('USD mạnh lên thường tác động tới giá hàng hoá:', ['Cùng chiều', 'Nghịch chiều', 'Không liên quan', 'Luôn tăng'], 1, 'Hàng hoá định giá bằng USD trở nên đắt hơn với người mua khác.'),
        Q('Lot chuẩn trong ngoại hối là:', ['1.000', '10.000', '100.000', '1.000.000'], 2, '100.000 đơn vị đồng cơ sở.')
      ]
    },
    en: {
      goals: ['Read currency quotes.', 'Understand FX structure.', 'Know key drivers.', 'Recognise volume limitations.'],
      body: () => `
<h3>1. Pairs</h3><p>In EUR/USD = 1.0850, EUR is the base and USD the quote. A pip is usually 0.0001 (0.01 for JPY pairs); a standard lot is 100,000 units. Majors include USD; crosses do not.</p>
<h3>2. Structure</h3><ul><li>Largest OTC market, near 24 hours, Asian/European/US sessions; peak liquidity in the London–New York overlap.</li><li>Banks, central banks, funds, corporates, retail.</li><li>No central volume — tick volume or currency futures.</li></ul>
<h3>3. Drivers</h3><ul><li>Rate differentials.</li><li>Carry trades and their violent unwinds.</li><li>The dollar index (DXY), usually inverse to commodities.</li><li>Trade, flows, policy, geopolitics.</li></ul>
<h3>4. TA in FX</h3><p>Policy cycles produce persistent trends; round numbers and prior-session extremes matter. USD/VND is managed within a band, less suited to short-term TA.</p>`,
      keys: ['Base/quote, pips, lots.', 'OTC, 24h, session overlap.', 'No central volume.', 'Rates, carry, DXY.', 'FX trends persist.'],
      terms: [['Carry trade', 'Borrow low-yield, invest high-yield'], ['DXY', 'Dollar index']],
      quiz: [
        Q('In USD/JPY the base is:', ['JPY', 'USD', 'Both', 'None'], 1, ''),
        Q('EUR/USD 1.0850 → 1.0870 is:', ['2 pips', '20 pips', '200 pips', '0.002 pips'], 1, ''),
        Q('Peak FX liquidity:', ['Asia', 'London–New York overlap', 'Weekend', 'Holidays'], 1, ''),
        Q('Carry trade:', ['Buy low-yielder', 'Borrow low-yield, invest high-yield', 'Buy gold', 'Short stocks'], 1, ''),
        Q('Carry risk:', ['None', 'Violent unwinds in risk-off', 'Equal rates', 'Illiquidity'], 1, ''),
        Q('Spot FX volume is limited because:', ['No trading', 'Decentralised', 'Banned', 'Fixed'], 1, ''),
        Q('A stronger USD tends to push commodities:', ['Up', 'Down', 'Unrelated', 'Always up'], 1, ''),
        Q('A standard lot:', ['1,000', '10,000', '100,000', '1,000,000'], 2, '')
      ]
    }
  };

  /* ================= LESSON 24 ================= */
  C.lessons['l1-24'] = {
    vi: {
      goals: ['Hiểu quyền chọn mua (call) và bán (put), các thông số cơ bản.', 'Phân biệt giá trị nội tại và giá trị thời gian; trạng thái ITM/ATM/OTM.', 'Vẽ và đọc biểu đồ lãi/lỗ khi đáo hạn.', 'Hiểu ngang giá put–call và các yếu tố ảnh hưởng phí quyền chọn.', 'Biết cách dùng dữ liệu quyền chọn làm chỉ báo tâm lý.'],
      body: () => `
<h3>1. Khái niệm</h3>
<ul><li><b>Call</b>: quyền (không phải nghĩa vụ) <b>mua</b> tài sản cơ sở ở giá thực hiện (strike) trước hoặc vào ngày đáo hạn.</li>
<li><b>Put</b>: quyền <b>bán</b> tài sản cơ sở ở giá thực hiện.</li>
<li>Người <b>mua</b> trả <b>phí (premium)</b> để có quyền; người <b>bán</b> nhận phí và gánh nghĩa vụ.</li>
<li>Kiểu Mỹ: thực hiện bất cứ lúc nào trước đáo hạn; kiểu châu Âu: chỉ vào ngày đáo hạn.</li></ul>
<h3>2. Giá trị nội tại và giá trị thời gian</h3>
<p><b>Phí = giá trị nội tại + giá trị thời gian.</b></p>
<ul><li>Giá trị nội tại của call = max(0, S − K); của put = max(0, K − S).</li>
<li><b>ITM</b> (có lãi nếu thực hiện ngay), <b>ATM</b> (giá cơ sở ≈ strike), <b>OTM</b> (không có giá trị nội tại).</li>
<li>Giá trị thời gian giảm dần về 0 khi tới đáo hạn (<b>hao mòn thời gian, theta</b>), và giảm nhanh hơn ở những tuần cuối.</li></ul>
<div class="callout"><b>Ví dụ</b>: cổ phiếu giá 105, call strike 100 có phí 8. Giá trị nội tại = 5, giá trị thời gian = 3.</div>
<h3>3. Lãi/lỗ khi đáo hạn</h3>
${C.demoHtml.optPay()}
<h3>4. Các yếu tố ảnh hưởng tới phí</h3>
<table class="tbl"><thead><tr><th>Yếu tố tăng</th><th>Call</th><th>Put</th><th>Hệ số (Greek)</th></tr></thead><tbody>
<tr><td>Giá tài sản cơ sở</td><td>↑</td><td>↓</td><td>Delta</td></tr>
<tr><td>Thời gian còn lại</td><td>↑</td><td>↑</td><td>Theta (hao mòn thời gian)</td></tr>
<tr><td>Biến động (volatility)</td><td>↑</td><td>↑</td><td>Vega</td></tr>
<tr><td>Lãi suất</td><td>↑</td><td>↓</td><td>Rho</td></tr></tbody></table>
<p>Gamma đo tốc độ thay đổi của delta. Biến động là yếu tố duy nhất không quan sát trực tiếp được, nên ta suy ngược nó từ giá quyền chọn: đó là <b>biến động ngụ ý</b> (Bài 25).</p>
<h3>5. Ngang giá put–call (put–call parity)</h3>
<p>Với quyền chọn kiểu châu Âu cùng strike và đáo hạn: <b>Call − Put = S − K × e^(−rT)</b> (bỏ qua cổ tức). Nếu đẳng thức bị phá vỡ, nhà kinh doanh chênh lệch sẽ can thiệp. Ý nghĩa: giá call và put gắn chặt với nhau qua giá cơ sở và lãi suất. Áp lực cung cầu lên một loại quyền chọn sẽ lan sang loại kia.</p>
<h3>6. Quyền chọn như chỉ báo tâm lý</h3>
<ul><li><b>Tỷ lệ Put/Call</b> (khối lượng put ÷ khối lượng call): cao thì sợ hãi, thường là tín hiệu ngược (gần đáy); thấp thì tự mãn (gần đỉnh).</li>
<li><b>Biến động ngụ ý và VIX</b> (Bài 25–26).</li>
<li><b>Lệch biến động (skew)</b>: put OTM đắt bất thường cho thấy nhu cầu phòng ngừa rủi ro giảm giá cao.</li></ul>`,
      keys: ['Call = quyền mua, put = quyền bán; người mua trả phí, người bán nhận phí và gánh nghĩa vụ.', 'Phí = giá trị nội tại + giá trị thời gian; ITM/ATM/OTM.', 'Mua quyền chọn: lỗ tối đa = phí; bán call: lỗ không giới hạn.', 'Delta (giá), theta (thời gian), vega (biến động), rho (lãi suất), gamma (tốc độ delta).', 'Put–call parity: C − P = S − K·e^(−rT).', 'Put/Call ratio, IV, skew là chỉ báo tâm lý — thường dùng theo hướng ngược.'],
      terms: [['Call / Put', 'Quyền chọn mua / bán'], ['Strike', 'Giá thực hiện'], ['Premium', 'Phí quyền chọn'], ['Intrinsic / Time value', 'Giá trị nội tại / thời gian'], ['ITM / ATM / OTM', 'Có lãi / Ngang giá / Không có lãi'], ['Greeks', 'Delta, Gamma, Theta, Vega, Rho'], ['Put–call parity', 'Ngang giá put–call'], ['Put/Call ratio', 'Tỷ lệ Put/Call']],
      quiz: [
        Q('Cổ phiếu 105, call strike 100, phí 8. Giá trị thời gian là:', ['8', '5', '3', '0'], 2, 'Nội tại 5, thời gian 8 − 5 = 3.'),
        Q('Lỗ tối đa của người MUA call là:', ['Không giới hạn', 'Phí đã trả', 'Strike', 'Giá cổ phiếu'], 1, 'Không thực hiện thì chỉ mất phí.'),
        Q('Vị thế nào có lỗ tiềm năng không giới hạn?', ['Mua call', 'Mua put', 'Bán call không có cổ phiếu', 'Mua cổ phiếu'], 2, 'Giá có thể tăng vô hạn.'),
        Q('Put strike 50, cổ phiếu 45. Quyền chọn đang:', ['OTM', 'ATM', 'ITM', 'Không xác định'], 2, 'Bán được 50 khi giá thị trường 45.'),
        Q('Biến động tăng thì phí call và put:', ['Cùng tăng', 'Cùng giảm', 'Call tăng, put giảm', 'Không đổi'], 0, 'Vega dương cho cả hai.'),
        Q('Theta đo:', ['Độ nhạy với giá', 'Hao mòn theo thời gian', 'Độ nhạy với lãi suất', 'Tốc độ thay đổi delta'], 1, 'Giá trị thời gian giảm dần về đáo hạn.'),
        Q('Tỷ lệ Put/Call rất cao thường được hiểu theo hướng ngược là:', ['Tín hiệu đỉnh', 'Sợ hãi cao — gần đáy', 'Không ý nghĩa', 'Tín hiệu bán'], 1, 'Đám đông phòng thủ quá mức.'),
        Q('Hoà vốn của mua call strike 100, phí 5 khi đáo hạn là:', ['95', '100', '105', '110'], 2, 'K + phí.')
      ]
    },
    en: {
      goals: ['Understand calls, puts and terms.', 'Separate intrinsic and time value.', 'Read payoff diagrams.', 'Know parity and premium drivers.', 'Use options data as sentiment.'],
      body: () => `
<h3>1. Basics</h3><ul><li><b>Call</b>: right to buy at the strike; <b>put</b>: right to sell.</li><li>Buyers pay premium; sellers collect it and take the obligation.</li><li>American vs European exercise.</li></ul>
<h3>2. Value</h3><p>Premium = intrinsic + time value; call intrinsic = max(0, S−K), put = max(0, K−S); ITM/ATM/OTM; time value decays (theta), faster near expiry.</p><div class="callout">Stock 105, 100-call at 8 → intrinsic 5, time value 3.</div>
<h3>3. Payoffs</h3>${C.demoHtml.optPay()}
<h3>4. Drivers</h3><table class="tbl"><thead><tr><th>Increase</th><th>Call</th><th>Put</th><th>Greek</th></tr></thead><tbody><tr><td>Underlying</td><td>↑</td><td>↓</td><td>Delta</td></tr><tr><td>Time</td><td>↑</td><td>↑</td><td>Theta</td></tr><tr><td>Volatility</td><td>↑</td><td>↑</td><td>Vega</td></tr><tr><td>Rates</td><td>↑</td><td>↓</td><td>Rho</td></tr></tbody></table><p>Gamma measures delta’s change. Volatility is inferred from prices — implied volatility.</p>
<h3>5. Put–call parity</h3><p>C − P = S − K·e^(−rT) (European, no dividends); pressure on one side spreads to the other.</p>
<h3>6. Sentiment</h3><ul><li>Put/call ratio — high = fear (contrarian bullish), low = complacency.</li><li>Implied volatility and VIX.</li><li>Skew.</li></ul>`,
      keys: ['Calls and puts; buyers pay, sellers carry obligation.', 'Premium = intrinsic + time.', 'Long options risk the premium; short calls risk unlimited loss.', 'Greeks: delta, gamma, theta, vega, rho.', 'Put–call parity.', 'Put/call ratio, IV, skew as contrarian sentiment.'],
      terms: [['Strike', 'Exercise price'], ['Theta', 'Time decay'], ['Vega', 'Volatility sensitivity']],
      quiz: [
        Q('Stock 105, 100-call at 8. Time value:', ['8', '5', '3', '0'], 2, ''),
        Q('Max loss buying a call:', ['Unlimited', 'Premium', 'Strike', 'Stock price'], 1, ''),
        Q('Unlimited potential loss:', ['Long call', 'Long put', 'Naked short call', 'Long stock'], 2, ''),
        Q('50-put, stock 45:', ['OTM', 'ATM', 'ITM', 'Unknown'], 2, ''),
        Q('Higher volatility makes calls and puts:', ['Both rise', 'Both fall', 'Calls up, puts down', 'Unchanged'], 0, ''),
        Q('Theta measures:', ['Price sensitivity', 'Time decay', 'Rate sensitivity', 'Delta change'], 1, ''),
        Q('Very high put/call ratio (contrarian):', ['Top', 'High fear — near a low', 'Meaningless', 'Sell'], 1, ''),
        Q('Breakeven for a 100-call bought at 5:', ['95', '100', '105', '110'], 2, '')
      ]
    }
  };

  /* ================= LESSON 25 ================= */
  C.lessons['l1-25'] = {
    vi: {
      goals: ['Phân biệt biến động lịch sử và biến động ngụ ý.', 'Tính biến động năm hoá và quy đổi theo thời gian (quy tắc căn bậc hai).', 'Ước lượng biên độ dịch chuyển kỳ vọng từ biến động.', 'Hiểu nụ cười/lệch biến động và ý nghĩa của IV cao/thấp.'],
      body: () => `
<h3>1. Hai loại biến động</h3>
<ul><li><b>Biến động lịch sử (HV)</b>: độ lệch chuẩn của lợi suất (thường dùng log-return) trong quá khứ, năm hoá. Đây là đo lường <b>đã xảy ra</b>.</li>
<li><b>Biến động ngụ ý (IV)</b>: mức biến động mà thị trường "đặt giá" vào quyền chọn, suy ngược từ giá quyền chọn bằng mô hình (ví dụ Black–Scholes). Đây là kỳ vọng <b>tương lai</b>, và chứa cả nỗi sợ, lòng tham.</li></ul>
<h3>2. Năm hoá và quy tắc căn bậc hai thời gian</h3>
<p>Biến động tỷ lệ với căn bậc hai của thời gian:</p>
<ul><li>σ<sub>năm</sub> = σ<sub>ngày</sub> × √(số ngày giao dịch/năm) — cổ phiếu dùng ≈ √252; crypto giao dịch cả năm dùng √365.</li>
<li>σ<sub>ngày</sub> = σ<sub>năm</sub> / √252.</li>
<li>σ cho n ngày = σ<sub>năm</sub> × √(n/252).</li></ul>
<div class="callout"><b>Ví dụ</b>: IV = 32%/năm. Biến động 1 ngày ≈ 32% / √252 ≈ 32 / 15.87 ≈ <b>2.0%</b>. Mẹo nhanh: chia IV năm cho 16 để ra biến động ngày. Với cổ phiếu giá 100, khoảng ±1σ cho ngày mai là 98–102, tức khoảng 68% khả năng (giả định phân phối chuẩn).</div>
${C.demoHtml.histVol()}
<h3>3. Biên độ kỳ vọng (expected move)</h3>
<p>Biên độ kỳ vọng ≈ Giá × IV × √(t), với t tính bằng năm. Đây là cách các nhà giao dịch quyền chọn ước lượng phạm vi giá trước các sự kiện như báo cáo lợi nhuận hay họp chính sách. Lưu ý: lợi suất thực tế có <b>đuôi dày</b>, nên các biến động lớn xảy ra thường xuyên hơn mô hình chuẩn dự báo.</p>
<h3>4. Cấu trúc của biến động ngụ ý</h3>
<ul><li><b>Nụ cười / lệch (smile / skew)</b>: IV khác nhau theo strike. Với chỉ số cổ phiếu, put OTM thường có IV cao hơn (lệch giảm) vì nhu cầu bảo hiểm sập giá.</li>
<li><b>Cấu trúc kỳ hạn</b>: IV khác nhau theo thời gian đáo hạn. Bình thường kỳ hạn xa IV cao hơn; khi khủng hoảng, IV ngắn hạn vọt lên trên dài hạn.</li>
<li><b>IV rank / percentile</b>: vị trí của IV hiện tại so với dải 1 năm, để biết quyền chọn đang "đắt" hay "rẻ".</li></ul>
<h3>5. Ý nghĩa cho nhà PTKT</h3>
<ul><li>Biến động có tính <b>quay về trung bình</b> và tính <b>cụm</b>: giai đoạn biến động thấp kéo dài thường kết thúc bằng bùng nổ (giống Bollinger squeeze ở Bài 6).</li>
<li>Biến động cao thường đi kèm thị trường giảm (cổ phiếu "đi thang bộ lên, đi thang máy xuống").</li>
<li>Dùng biến động để đặt <b>điểm dừng và mục tiêu theo ATR/σ</b> thay vì số cố định.</li></ul>`,
      keys: ['HV đo biến động đã xảy ra; IV là kỳ vọng thị trường suy từ giá quyền chọn.', 'Biến động tỷ lệ với √thời gian: σ ngày ≈ σ năm/√252 (≈ chia 16).', 'Biên độ kỳ vọng ≈ Giá × IV × √t; ±1σ ≈ 68% (giả định chuẩn), thực tế đuôi dày.', 'Smile/skew theo strike; cấu trúc kỳ hạn; IV rank cho biết đắt/rẻ.', 'Biến động quay về trung bình và có tính cụm; biến động cao thường đi với thị trường giảm.'],
      terms: [['Historical volatility', 'Biến động lịch sử'], ['Implied volatility', 'Biến động ngụ ý'], ['Annualize', 'Năm hoá'], ['Expected move', 'Biên độ kỳ vọng'], ['Skew / Smile', 'Lệch / Nụ cười biến động'], ['Fat tails', 'Đuôi dày'], ['IV rank', 'Thứ hạng IV']],
      quiz: [
        Q('Biến động ngụ ý được xác định bằng cách:', ['Tính độ lệch chuẩn quá khứ', 'Suy ngược từ giá quyền chọn', 'Lấy trung bình giá', 'Đếm số phiên'], 1, 'Đó là kỳ vọng của thị trường.'),
        Q('IV = 48%/năm. Biến động 1 ngày (252 ngày) xấp xỉ:', ['1%', '3%', '4.8%', '0.2%'], 1, '48 / 15.87 ≈ 3%.'),
        Q('Biến động năm 20%. Biến động cho 63 ngày giao dịch (1 quý) xấp xỉ:', ['5%', '10%', '20%', '2.5%'], 1, '20% × √(63/252) = 20% × 0.5 = 10%.'),
        Q('Cổ phiếu giá 200, biến động 1 ngày 1.5%. Khoảng ±1σ ngày mai là:', ['197–203', '170–230', '199–201', '180–220'], 0, '200 × 1.5% = 3.'),
        Q('Với chỉ số cổ phiếu, put OTM thường có IV:', ['Thấp hơn call OTM', 'Cao hơn — do nhu cầu bảo hiểm giảm giá', 'Bằng 0', 'Không đổi'], 1, 'Hiện tượng lệch (skew).'),
        Q('Biến động thấp kéo dài thường:', ['Kéo dài mãi', 'Kết thúc bằng bùng nổ biến động', 'Báo hiệu đỉnh chắc chắn', 'Không có ý nghĩa'], 1, 'Biến động có tính chu kỳ và quay về trung bình.'),
        Q('"Đuôi dày" nghĩa là:', ['Biến động lớn hiếm hơn mô hình chuẩn', 'Biến động lớn thường xuyên hơn mô hình chuẩn dự báo', 'Không có biến động', 'Giá cố định'], 1, 'Mô hình chuẩn đánh giá thấp rủi ro cực trị.'),
        Q('Hằng số thường dùng để năm hoá biến động ngày của cổ phiếu là:', ['√12', '√52', '√252', '√365'], 2, 'Khoảng 252 ngày giao dịch/năm.')
      ]
    },
    en: {
      goals: ['Separate historical and implied volatility.', 'Annualise and scale with the square-root rule.', 'Estimate expected moves.', 'Understand smile/skew and IV levels.'],
      body: () => `
<h3>1. HV vs IV</h3><p><b>Historical volatility</b> = annualised st.dev of past (log) returns; <b>implied volatility</b> = the volatility priced into options — a forward-looking expectation including fear and greed.</p>
<h3>2. Square-root rule</h3><ul><li>σ<sub>annual</sub> = σ<sub>daily</sub> × √252 (√365 for 24/7 markets).</li><li>σ for n days = σ<sub>annual</sub> × √(n/252).</li></ul><div class="callout">IV 32% → daily ≈ 32/15.87 ≈ <b>2%</b> (divide by 16). A 100 stock: ±1σ tomorrow ≈ 98–102, ~68% under normality.</div>${C.demoHtml.histVol()}
<h3>3. Expected move</h3><p>≈ Price × IV × √t; real returns have fat tails.</p>
<h3>4. Structure</h3><ul><li>Smile/skew by strike — index puts carry higher IV.</li><li>Term structure — inverts in crises.</li><li>IV rank/percentile.</li></ul>
<h3>5. For technicians</h3><ul><li>Volatility mean-reverts and clusters.</li><li>High volatility accompanies declines.</li><li>Size stops and targets with ATR/σ.</li></ul>`,
      keys: ['HV past, IV expected.', 'σ scales with √time; ÷16 shortcut.', 'Expected move ≈ P × IV × √t; fat tails.', 'Skew, term structure, IV rank.', 'Volatility mean-reverts and clusters.'],
      terms: [['Implied volatility', 'Volatility priced into options'], ['Fat tails', 'More extreme moves than normal'], ['Skew', 'IV differences by strike']],
      quiz: [
        Q('Implied volatility is found by:', ['Past st.dev', 'Backing it out of option prices', 'Average price', 'Counting sessions'], 1, ''),
        Q('IV 48% → daily ≈', ['1%', '3%', '4.8%', '0.2%'], 1, ''),
        Q('20% annual → one quarter (63 days) ≈', ['5%', '10%', '20%', '2.5%'], 1, ''),
        Q('Price 200, daily σ 1.5% → ±1σ:', ['197–203', '170–230', '199–201', '180–220'], 0, ''),
        Q('Index OTM puts typically have:', ['Lower IV', 'Higher IV (skew)', 'Zero IV', 'Constant IV'], 1, ''),
        Q('Prolonged low volatility usually:', ['Lasts forever', 'Ends in expansion', 'Marks a certain top', 'Means nothing'], 1, ''),
        Q('Fat tails mean:', ['Fewer big moves', 'More big moves than normal predicts', 'No volatility', 'Fixed prices'], 1, ''),
        Q('Stock annualisation constant:', ['√12', '√52', '√252', '√365'], 2, '')
      ]
    }
  };

  /* ================= LESSON 26 ================= */
  C.lessons['l1-26'] = {
    vi: {
      goals: ['Hiểu VIX đo gì và được tính từ đâu.', 'Diễn giải VIX như chỉ báo tâm lý "thước đo sợ hãi".', 'Tính biên độ dịch chuyển 30 ngày từ VIX.', 'Hiểu cấu trúc kỳ hạn hợp đồng tương lai VIX và rủi ro của sản phẩm VIX.', 'Biết các chỉ báo tương tự ở thị trường khác.'],
      body: () => `
<h3>1. VIX là gì?</h3>
<p>VIX là chỉ số do sàn CBOE công bố, đo <b>biến động ngụ ý 30 ngày tới</b> của chỉ số S&P 500, tính từ giá của một dải rộng các quyền chọn S&P 500 (cả put và call, nhiều strike). VIX được biểu thị theo % năm hoá: VIX = 20 nghĩa là thị trường kỳ vọng biến động khoảng 20%/năm.</p>
<h3>2. "Thước đo sợ hãi"</h3>
${fg.vix('vi')}
<ul><li>VIX thường <b>nghịch chiều</b> với S&P 500: thị trường giảm thì nhu cầu mua put bảo hiểm tăng, IV tăng, VIX tăng.</li>
<li>VIX <b>tăng vọt</b> lên mức rất cao thường trùng với đáy do hoảng loạn (tín hiệu ngược). VIX thấp kéo dài phản ánh sự tự mãn, và có thể là môi trường trước khi biến động quay lại.</li>
<li>VIX có tính <b>quay về trung bình</b> mạnh. Nó không có xu hướng tăng dài hạn như giá cổ phiếu, nên các cực trị của nó có ý nghĩa.</li>
<li>Kỹ thuật thường dùng: so VIX với dải Bollinger hoặc MA của chính nó. VIX đóng cửa vượt xa dải trên rồi quay lại trong dải thường gợi ý đáy ngắn hạn của cổ phiếu.</li></ul>
<h3>3. Từ VIX đến biên độ kỳ vọng</h3>
<p>Vì VIX là biến động năm hoá cho 30 ngày, biên độ 1σ kỳ vọng trong 30 ngày ≈ <b>VIX / √12</b> (khoảng VIX/3.46).</p>
<div class="callout"><b>Ví dụ</b>: VIX = 24 thì biên độ 30 ngày ≈ 24/3.46 ≈ <b>6.9%</b>. Với S&P 500 ở 5.000 điểm, khoảng ±1σ là 4.655–5.345 (≈ 68% khả năng). Biến động ngày ≈ VIX/16 = 1.5%.</div>
<h3>4. Hợp đồng tương lai VIX và sản phẩm VIX</h3>
<ul><li>Không thể mua "VIX giao ngay". Các sản phẩm (ETP về VIX) dùng <b>hợp đồng tương lai VIX</b>.</li>
<li>Cấu trúc kỳ hạn VIX phần lớn thời gian ở trạng thái <b>contango</b>. Sản phẩm mua VIX dài hạn vì thế bị hao mòn do chi phí roll (Bài 21–22), và về dài hạn mất giá đáng kể.</li>
<li>Khi khủng hoảng, cấu trúc đảo sang <b>backwardation</b> (VIX gần cao hơn xa). Đây là dấu hiệu căng thẳng thị trường.</li>
<li>Sản phẩm bán khống VIX có thể chịu tổn thất cực lớn chỉ trong một phiên khi VIX tăng vọt.</li></ul>
<h3>5. Các thước đo tương tự</h3>
<ul><li>VXN (Nasdaq-100), RVX (Russell 2000), VSTOXX (châu Âu), các chỉ số biến động vàng, dầu, trái phiếu (MOVE).</li>
<li>Crypto: các chỉ số biến động ngụ ý cho BTC/ETH từ thị trường quyền chọn crypto.</li>
<li>Việt Nam chưa có chỉ số biến động ngụ ý chính thức. Có thể dùng biến động lịch sử (HV) của VN30 và basis VN30F làm đại diện cho tâm lý.</li></ul>`,
      keys: ['VIX = biến động ngụ ý 30 ngày của S&P 500, tính từ dải quyền chọn, biểu thị % năm hoá.', 'VIX thường nghịch chiều cổ phiếu; tăng vọt = sợ hãi, thường gần đáy (tín hiệu ngược).', 'Biên độ 30 ngày ≈ VIX/√12; biến động ngày ≈ VIX/16.', 'VIX quay về trung bình mạnh; so với dải Bollinger để tìm cực trị.', 'Sản phẩm VIX dùng futures; contango gây hao mòn; backwardation = căng thẳng.'],
      terms: [['VIX', 'Chỉ số biến động CBOE'], ['Fear gauge', 'Thước đo sợ hãi'], ['Mean reversion', 'Quay về trung bình'], ['VIX futures term structure', 'Cấu trúc kỳ hạn futures VIX'], ['MOVE index', 'Chỉ số biến động trái phiếu']],
      quiz: [
        Q('VIX đo:', ['Biến động lịch sử 1 năm', 'Biến động ngụ ý 30 ngày tới của S&P 500', 'Khối lượng giao dịch', 'Lãi suất'], 1, 'Tính từ giá quyền chọn S&P 500.'),
        Q('VIX = 30. Biên độ 1σ kỳ vọng trong 30 ngày khoảng:', ['30%', '8.7%', '2.5%', '1.9%'], 1, '30 / √12 ≈ 30 / 3.46 ≈ 8.7%.'),
        Q('VIX = 16. Biến động 1 ngày kỳ vọng khoảng:', ['16%', '4%', '1%', '0.1%'], 2, '16 / 16 = 1%.'),
        Q('VIX tăng vọt lên mức rất cao thường được hiểu theo hướng ngược là:', ['Dấu hiệu đỉnh cổ phiếu', 'Hoảng loạn — thường gần đáy', 'Xu hướng tăng bền vững', 'Không có ý nghĩa'], 1, 'Sợ hãi cực độ thường đánh dấu vùng đáy.'),
        Q('Vì sao ETP mua VIX dài hạn thường mất giá về lâu dài?', ['Phí quản lý cao', 'Cấu trúc kỳ hạn thường contango gây chi phí roll', 'VIX luôn giảm', 'Không có lý do'], 1, 'Liên tục bán rẻ hợp đồng gần, mua đắt hợp đồng xa.'),
        Q('Cấu trúc kỳ hạn VIX chuyển sang backwardation thường cho thấy:', ['Thị trường yên bình', 'Căng thẳng, sợ hãi ngắn hạn', 'Lãi suất giảm', 'Không gì'], 1, 'VIX gần cao hơn VIX xa.'),
        Q('Đặc tính nào khiến cực trị của VIX có ý nghĩa?', ['VIX có xu hướng tăng dài hạn', 'VIX quay về trung bình mạnh', 'VIX không đổi', 'VIX bằng giá cổ phiếu'], 1, 'Không có xu hướng dài hạn như giá cổ phiếu.'),
        Q('Quan hệ điển hình giữa VIX và S&P 500 là:', ['Cùng chiều', 'Nghịch chiều', 'Không liên quan', 'Luôn bằng nhau'], 1, 'Giảm giá thì nhu cầu bảo hiểm tăng.')
      ]
    },
    en: {
      goals: ['Understand what VIX measures.', 'Interpret it as a fear gauge.', 'Compute 30-day expected moves.', 'Understand VIX futures and products.', 'Know similar gauges.'],
      body: () => `
<h3>1. VIX</h3><p>CBOE’s measure of S&P 500 <b>30-day implied volatility</b>, built from a wide strip of options, quoted in annualised %.</p>
<h3>2. Fear gauge</h3>${fg.vix('en')}<ul><li>Usually inverse to stocks.</li><li>Spikes often mark panic lows; low VIX = complacency.</li><li>Strong mean reversion — extremes matter.</li><li>Compare VIX with its own Bollinger Bands.</li></ul>
<h3>3. Expected move</h3><p>30-day 1σ ≈ <b>VIX/√12</b>; daily ≈ VIX/16.</p><div class="callout">VIX 24 → ≈ 6.9% over 30 days; S&P 5,000 → 4,655–5,345.</div>
<h3>4. Futures and products</h3><ul><li>Products use VIX futures.</li><li>Usual contango causes decay in long-VIX products.</li><li>Backwardation signals stress.</li><li>Short-VIX products can suffer catastrophic one-day losses.</li></ul>
<h3>5. Similar gauges</h3><ul><li>VXN, RVX, VSTOXX, MOVE, commodity vol indexes.</li><li>Crypto implied-vol indexes.</li><li>Vietnam lacks one — use VN30 HV and VN30F basis.</li></ul>`,
      keys: ['VIX = 30-day S&P 500 implied volatility.', 'Inverse to stocks; spikes near panic lows.', '30-day move ≈ VIX/√12; daily ≈ VIX/16.', 'Strong mean reversion.', 'Contango decays long-VIX products; backwardation = stress.'],
      terms: [['Fear gauge', 'VIX nickname'], ['Mean reversion', 'Return toward average']],
      quiz: [
        Q('VIX measures:', ['1-year HV', '30-day S&P 500 implied volatility', 'Volume', 'Rates'], 1, ''),
        Q('VIX 30 → 30-day 1σ ≈', ['30%', '8.7%', '2.5%', '1.9%'], 1, ''),
        Q('VIX 16 → daily ≈', ['16%', '4%', '1%', '0.1%'], 2, ''),
        Q('A VIX spike (contrarian):', ['Stock top', 'Panic — often near a low', 'Durable uptrend', 'Nothing'], 1, ''),
        Q('Long-VIX ETPs lose over time because:', ['High fees', 'Contango roll costs', 'VIX always falls', 'No reason'], 1, ''),
        Q('VIX futures in backwardation signal:', ['Calm', 'Stress', 'Falling rates', 'Nothing'], 1, ''),
        Q('What makes VIX extremes meaningful?', ['Long-term uptrend', 'Strong mean reversion', 'Constant', 'Equals price'], 1, ''),
        Q('VIX vs S&P 500:', ['Same direction', 'Inverse', 'Unrelated', 'Equal'], 1, '')
      ]
    }
  };
})(window.LLW);
