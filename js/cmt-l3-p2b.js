// © 2026 Lai Long Master TA. Bảo lưu mọi quyền. Không sao chép, chỉnh sửa hay dùng lại khi chưa được phép.
/* CMT Level 3 — Part 2b, lessons 12–15: asset relationships II. Written by Lai Long Master TA in its own words. */
(function (L) {
  'use strict';
  const C = L.cmt, H = C.demoHtml, css = C.css;
  const ld = () => `<span class="spinner"></span>${L.t('loading')}`;

  /* ---------- demo: relative rotation (RS trend vs RS momentum) ---------- */
  H.rotGraph = (mk = 'vn_stock', bench = 'VNINDEX', list = 'FPT,HPG,VCB,SSI,MWG,VNM,GAS,DGC') => C.demoShell('rotGraph', C.symControls(mk, bench, '1W', ['1W', '1D']) + `<input class="d-list" style="min-width:240px" value="${list}" spellcheck="false"><button class="btn primary d-go">${L.T('Vẽ', 'Plot')}</button>`,
    L.T('Ô đầu là chỉ số chuẩn, ô sau là danh sách mã. Trục ngang = xu hướng sức mạnh tương đối (RS so với trung bình 10 kỳ của nó), trục dọc = động lượng của xu hướng đó (thay đổi 4 kỳ). Đuôi = 6 kỳ gần nhất.', 'First box = benchmark, second = symbols. X = RS trend (RS vs its 10-bar average), Y = momentum of that trend (4-bar change). Tails = last 6 bars.'));
  C.demoRun.rotGraph = box => {
    const out = box.querySelector('.demo-out'), el = box.querySelector('.demo-chart');
    C.wire(box, async () => {
      out.innerHTML = ld();
      try {
        const [mk, bs, tf] = C.readSym(box), syms = box.querySelector('.d-list').value.split(/[\s,;]+/).map(s => s.trim().toUpperCase()).filter(Boolean).slice(0, 10);
        const B = await C.loadBars(mk, bs, tf), bm = new Map(B.map(b => [b.t, b.c]));
        const res = await Promise.all(syms.map(async s => {
          try {
            const A = (await C.loadBars(mk, s, tf)).filter(b => bm.has(b.t)).slice(-80);
            const rs = A.map(b => b.c / bm.get(b.t) * 100), ratio = rs.map((v, i) => { if (i < 9) return null; let m = 0; for (let k = i - 9; k <= i; k++) m += rs[k]; return 100 * v / (m / 10); });
            const mom = ratio.map((v, i) => (v == null || i < 4 || ratio[i - 4] == null) ? null : 100 + (v - ratio[i - 4]));
            const pts = []; for (let i = ratio.length - 6; i < ratio.length; i++) if (i >= 0 && mom[i] != null) pts.push([ratio[i], mom[i]]);
            return pts.length ? { s, pts } : null;
          } catch (e) { return null; }
        }));
        const ok = res.filter(Boolean);
        if (!ok.length) throw new Error(L.T('Không đủ dữ liệu.', 'Not enough data.'));
        const all = ok.flatMap(r => r.pts), dx = Math.max(2, ...all.map(p => Math.abs(p[0] - 100))) * 1.15, dy = Math.max(2, ...all.map(p => Math.abs(p[1] - 100))) * 1.15;
        const W = 560, Hh = 400, X = v => W / 2 + (v - 100) / dx * (W / 2 - 20), Y = v => Hh / 2 - (v - 100) / dy * (Hh / 2 - 20);
        const quad = (x, y, c, t) => `<rect x="${x}" y="${y}" width="${W / 2}" height="${Hh / 2}" fill="var(${c})" opacity="0.07"/><text x="${x + 8}" y="${y + 18}" font-size="12" fill="var(--muted)">${t}</text>`;
        const pal = ['--accent', '--up', '--down', '#8b5cf6', '#06b6d4', '#f59e0b', '#ec4899', '#84cc16', '#64748b', '#ef4444'];
        const col = i => pal[i].startsWith('--') ? `var(${pal[i]})` : pal[i];
        const quadName = p => p[0] >= 100 ? (p[1] >= 100 ? L.T('Dẫn đầu', 'Leading') : L.T('Suy yếu', 'Weakening')) : (p[1] >= 100 ? L.T('Cải thiện', 'Improving') : L.T('Tụt hậu', 'Lagging'));
        el.innerHTML = `<svg viewBox="0 0 ${W} ${Hh}" style="width:100%;max-width:${W}px;height:auto;display:block;margin:auto">
          ${quad(W / 2, 0, '--up', L.T('Dẫn đầu', 'Leading'))}${quad(W / 2, Hh / 2, '--accent', L.T('Suy yếu', 'Weakening'))}${quad(0, Hh / 2, '--down', L.T('Tụt hậu', 'Lagging'))}${quad(0, 0, '--muted', L.T('Cải thiện', 'Improving'))}
          <line x1="${W / 2}" y1="0" x2="${W / 2}" y2="${Hh}" stroke="var(--line)"/><line x1="0" y1="${Hh / 2}" x2="${W}" y2="${Hh / 2}" stroke="var(--line)"/>
          ${ok.map((r, i) => `<polyline fill="none" stroke="${col(i)}" stroke-width="1.6" points="${r.pts.map(p => X(p[0]).toFixed(1) + ',' + Y(p[1]).toFixed(1)).join(' ')}"/>
            <circle cx="${X(r.pts[r.pts.length - 1][0]).toFixed(1)}" cy="${Y(r.pts[r.pts.length - 1][1]).toFixed(1)}" r="4.5" fill="${col(i)}"/>
            <text x="${(X(r.pts[r.pts.length - 1][0]) + 6).toFixed(1)}" y="${(Y(r.pts[r.pts.length - 1][1]) - 6).toFixed(1)}" font-size="11" fill="var(--text)">${r.s}</text>`).join('')}</svg>`;
        out.innerHTML = ok.map(r => `<b>${r.s}</b>: ${quadName(r.pts[r.pts.length - 1])}`).join(' · ') + `<p class="muted">${L.T('Xoay vòng điển hình theo chiều kim đồng hồ: Cải thiện → Dẫn đầu → Suy yếu → Tụt hậu. Đây là công cụ sàng lọc theo bối cảnh, không phải tín hiệu vào lệnh độc lập.', 'Typical clockwise rotation: Improving → Leading → Weakening → Lagging. A context screen, not a standalone entry signal.')}</p>`;
      } catch (e) { C.err(out, e); }
    });
  };

  /* ---------- demo: intermarket disparity oscillator ---------- */
  H.imDisp = (mk = 'bn_spot', a = 'ETHUSDT', b = 'BTCUSDT') => C.demoShell('imDisp', C.symControls(mk, a, '1D', ['1W', '1D', '4H']) + `<input class="d-sym2" value="${b}" spellcheck="false">` + C.mkSel('d-n', [['20', 'N 20'], ['40', 'N 40']], '20') + `<button class="btn primary d-go">${L.T('Xem', 'Show')}</button>`,
    L.T('Dao động "chênh lệch liên thị trường": z-score của (ROC mã thứ nhất − β × ROC mã thứ hai). Dương lớn = mã thứ nhất chạy vượt quan hệ thông thường; âm lớn = tụt lại.', 'Intermarket disparity: z-score of (ROC of symbol 1 − β × ROC of symbol 2). Large positive = symbol 1 ahead of its usual relation; large negative = lagging.'));
  C.demoRun.imDisp = box => {
    const out = box.querySelector('.demo-out'), el = box.querySelector('.demo-chart');
    C.wire(box, async () => {
      out.innerHTML = ld();
      try {
        const [mk, s1, tf] = C.readSym(box), s2 = box.querySelector('.d-sym2').value.trim().toUpperCase(), n = +box.querySelector('.d-n').value;
        const [A, B] = await Promise.all([C.loadBars(mk, s1, tf), C.loadBars(mk, s2, tf)]);
        const mb = new Map(B.map(x => [x.t, x.c])), j = A.filter(x => mb.has(x.t)).map(x => ({ t: x.t, a: x.c, b: mb.get(x.t) })).slice(-400);
        const ra = [], rb = []; for (let i = 1; i < j.length; i++) { ra.push(Math.log(j[i].a / j[i - 1].a)); rb.push(Math.log(j[i].b / j[i - 1].b)); }
        const beta = C.stat.ols(rb, ra).b, d = [];
        for (let i = n; i < j.length; i++) d.push({ t: j[i].t, v: Math.log(j[i].a / j[i - n].a) - beta * Math.log(j[i].b / j[i - n].b) });
        const z = d.map((p, i) => { if (i < 60) return null; const w = d.slice(i - 60, i).map(q => q.v), m = C.stat.mean(w), s = C.stat.sd(w) || 1e-9; return { time: p.t, value: (p.v - m) / s }; }).filter(Boolean);
        el.innerHTML = '';
        const ch = C.mkChart(el);
        ch.addLineSeries({ color: css('--accent'), lineWidth: 2, priceLineVisible: false }).setData(z);
        [2, -2, 0].forEach(k => ch.addLineSeries({ color: css('--muted'), lineWidth: 1, lineStyle: 2, priceLineVisible: false, lastValueVisible: false }).setData(z.map(p => ({ time: p.time, value: k }))));
        ch.timeScale().fitContent();
        const last = z[z.length - 1].value;
        out.innerHTML = L.T(`β (${s1} theo ${s2}) = ${beta.toFixed(2)}. Chênh lệch hiện tại = <b>${last.toFixed(2)}σ</b>. ${Math.abs(last) > 2 ? 'Cực trị — xem xét hội tụ hoặc cảnh báo phân kỳ, chờ giá xác nhận.' : 'Trong vùng bình thường.'}`,
          `β (${s1} on ${s2}) = ${beta.toFixed(2)}. Current disparity = <b>${last.toFixed(2)}σ</b>. ${Math.abs(last) > 2 ? 'Extreme — consider convergence or divergence warning; wait for price confirmation.' : 'Within the normal range.'}`);
      } catch (e) { C.err(out, e); }
    });
  };

  /* ================= L3-12 ================= */
  C.addLesson('l3-12', {
    goals: ['Phân tích các yếu tố chi phối giá vàng.', 'Giải thích quan hệ vàng với lãi suất thực, USD, lạm phát và cổ phiếu.', 'Dùng tỷ lệ vàng/bạc và cổ phiếu khai thác vàng làm chỉ báo.', 'Áp dụng cho thị trường vàng trong nước.'],
    body: () => `
<h3>1. Vàng là tài sản gì?</h3>
<p>Vàng không tạo dòng tiền (không lãi, không cổ tức). Vì vậy giá trị của nó được quyết định bởi <b>chi phí cơ hội</b> khi nắm giữ và nhu cầu <b>trú ẩn/phòng vệ</b>. Vàng vừa là hàng hoá, vừa là "tiền tệ" phi chính phủ.</p>
<h3>2. Các yếu tố chi phối</h3>
<table class="tbl"><thead><tr><th>Yếu tố</th><th>Quan hệ</th><th>Cơ chế</th></tr></thead><tbody>
<tr><td><b>Lãi suất thực</b> (lợi suất danh nghĩa − lạm phát kỳ vọng)</td><td><b>Nghịch chiều mạnh</b></td><td>Lãi suất thực cao = chi phí cơ hội cao của việc giữ tài sản không sinh lời</td></tr>
<tr><td>USD</td><td>Thường nghịch chiều</td><td>Vàng định giá bằng USD</td></tr>
<tr><td>Lạm phát kỳ vọng</td><td>Cùng chiều</td><td>Bảo toàn sức mua</td></tr>
<tr><td>Căng thẳng tài chính, địa chính trị</td><td>Cùng chiều (trú ẩn)</td><td>Nhu cầu tài sản không có rủi ro đối tác</td></tr>
<tr><td>Mua của ngân hàng trung ương</td><td>Cùng chiều</td><td>Đa dạng hoá dự trữ khỏi USD</td></tr>
<tr><td>Cổ phiếu</td><td>Thấp, thường âm khi căng thẳng</td><td>Phòng vệ danh mục</td></tr></tbody></table>
<div class="callout"><b>Lưu ý</b>: trong cú sốc thanh khoản cấp tính, vàng có thể <b>giảm</b> cùng cổ phiếu (nhà đầu tư bán tài sản có lãi để đáp ứng ký quỹ) trước khi phục hồi như tài sản trú ẩn.</div>
${H.corrLab('BTCUSDT', 'PAXGUSDT', 'bn_spot', '1W')}
<h3>3. Chỉ báo liên quan</h3>
<ul><li><b>Tỷ lệ vàng/bạc</b>: bạc có tính công nghiệp và biến động hơn. Tỷ lệ tăng (vàng mạnh hơn) thường đi cùng phòng thủ, kinh tế yếu; tỷ lệ giảm đi cùng khẩu vị rủi ro, giai đoạn mạnh của thị trường kim loại quý.</li>
<li><b>Cổ phiếu khai thác vàng</b>: có đòn bẩy hoạt động theo giá vàng (chi phí sản xuất gần cố định) → biến động mạnh hơn vàng; thường <b>dẫn trước</b> ở các điểm đảo chiều. Cổ phiếu khai thác yếu hơn vàng khi vàng tạo đỉnh mới là phân kỳ cảnh báo.</li>
<li><b>Tỷ lệ vàng/chỉ số cổ phiếu</b>: tăng = môi trường phòng thủ.</li></ul>
<h3>4. Phân tích kỹ thuật trên vàng</h3>
<p>Vàng có xu hướng dài, phù hợp hệ thống theo xu hướng trên khung tuần; số tròn (mốc nghìn USD/oz) là vùng tâm lý quan trọng. Kết hợp xu hướng của vàng với lãi suất thực và USD để đánh giá độ bền.</p>
<h3>5. Vàng trong nước</h3>
<ul><li>Giá vàng miếng trong nước có thể chênh đáng kể so với giá thế giới quy đổi do cung bị kiểm soát và nhu cầu nội địa — <b>chênh lệch</b> này có xu hướng thu hẹp khi nguồn cung tăng, mở rộng khi cầu tăng đột biến.</li>
<li>Giá thế giới quy đổi = giá USD/oz × tỷ giá × hệ số đổi đơn vị (1 lượng ≈ 1.2057 oz).</li>
<li>Rủi ro: chênh lệch mua–bán rộng và rủi ro chính sách — phân tích kỹ thuật trên giá trong nước phải tính đến các yếu tố này.</li></ul>`,
    keys: ['Vàng không tạo dòng tiền: giá phụ thuộc chi phí cơ hội và nhu cầu trú ẩn.', 'Nghịch chiều mạnh với lãi suất thực; thường nghịch với USD; cùng chiều lạm phát kỳ vọng, căng thẳng, NHTW mua.', 'Cú sốc thanh khoản: vàng có thể giảm cùng cổ phiếu trước khi phục hồi.', 'Tỷ lệ vàng/bạc; cổ phiếu khai thác dẫn trước, đòn bẩy hoạt động; phân kỳ cảnh báo.', 'Vàng trong nước: chênh lệch với thế giới, chênh lệch mua–bán, rủi ro chính sách.'],
    terms: [['Real interest rate', 'Lãi suất thực'], ['Opportunity cost', 'Chi phí cơ hội'], ['Safe haven', 'Tài sản trú ẩn'], ['Gold/silver ratio', 'Tỷ lệ vàng/bạc'], ['Gold miners', 'Cổ phiếu khai thác vàng'], ['Operating leverage', 'Đòn bẩy hoạt động']]
  }, {
    goals: ['Analyse gold’s drivers.', 'Explain links with real rates, USD, inflation and stocks.', 'Use the gold/silver ratio and miners.', 'Apply to the domestic gold market.'],
    body: () => `
<h3>1. Nature</h3><p>No cash flows: driven by opportunity cost and safe-haven demand.</p>
<h3>2. Drivers</h3><table class="tbl"><tbody><tr><td>Real rates</td><td>strongly inverse</td></tr><tr><td>USD</td><td>usually inverse</td></tr><tr><td>Inflation expectations</td><td>positive</td></tr><tr><td>Stress</td><td>positive</td></tr><tr><td>Central-bank buying</td><td>positive</td></tr><tr><td>Stocks</td><td>low/negative under stress</td></tr></tbody></table><div class="callout">In acute liquidity shocks gold may fall with stocks before recovering.</div>${H.corrLab('BTCUSDT', 'PAXGUSDT', 'bn_spot', '1W')}
<h3>3. Related indicators</h3><ul><li>Gold/silver ratio.</li><li>Miners: operating leverage, often lead; divergences warn.</li><li>Gold/equity ratio.</li></ul>
<h3>4. TA on gold</h3><p>Long trends; round numbers; combine with real rates and USD.</p>
<h3>5. Domestic gold</h3><p>Premiums to world prices, wide spreads, policy risk; 1 tael ≈ 1.2057 oz.</p>`,
    keys: ['Nature.', 'Drivers.', 'Liquidity shocks.', 'Ratios and miners.', 'Domestic market.'],
    terms: [['Real rate', 'Nominal yield minus expected inflation'], ['Gold/silver ratio', 'Defensive vs cyclical precious-metal gauge']]
  }, [
    ['Yếu tố có quan hệ nghịch chiều mạnh nhất với giá vàng:', 'The factor most strongly inverse to gold:', ['Lãi suất thực', 'Lạm phát kỳ vọng', 'Căng thẳng địa chính trị', 'Mua của NHTW'], ['Real interest rates', 'Inflation expectations', 'Geopolitical stress', 'Central-bank buying'], 0, '', ''],
    ['Vì sao lãi suất thực cao gây áp lực lên vàng?', 'Why do high real rates pressure gold?', ['Chi phí cơ hội của tài sản không sinh lời tăng', 'Vàng trả lãi thấp hơn', 'Do luật', 'Không đúng'], ['Higher opportunity cost of a non-yielding asset', 'Gold pays less interest', 'Law', 'False'], 0, '', ''],
    ['Lợi suất danh nghĩa 4%, lạm phát kỳ vọng 2.5%. Lãi suất thực:', 'Nominal yield 4%, expected inflation 2.5%. Real rate:', ['6.5%', '1.5%', '−1.5%', '4%'], null, 1, '', ''],
    ['USD mạnh lên thường khiến giá vàng (theo USD):', 'A stronger USD usually makes gold (in USD):', ['Giảm', 'Tăng', 'Không đổi', 'Bằng 0'], ['Fall', 'Rise', 'Unchanged', 'Zero'], 0, '', ''],
    ['Trong cú sốc thanh khoản cấp tính, vàng có thể:', 'In an acute liquidity shock, gold may:', ['Giảm cùng cổ phiếu trước khi phục hồi', 'Luôn tăng ngay', 'Không giao dịch', 'Về 0'], ['Fall with stocks before recovering', 'Always rise at once', 'Stop trading', 'Go to zero'], 0, 'Nhà đầu tư bán tài sản có lãi để đáp ứng ký quỹ.', ''],
    ['Ngân hàng trung ương mua vàng mạnh nhằm:', 'Central banks buy gold heavily to:', ['Đa dạng hoá dự trữ khỏi USD', 'Đầu cơ ngắn hạn', 'Tăng lãi suất', 'Không lý do'], ['Diversify reserves away from USD', 'Short-term speculation', 'Raise rates', 'No reason'], 0, '', ''],
    ['Tỷ lệ vàng/bạc tăng mạnh thường đi cùng:', 'A sharply rising gold/silver ratio often accompanies:', ['Phòng thủ, kinh tế yếu', 'Bùng nổ công nghiệp', 'Khẩu vị rủi ro cao', 'Không gì'], ['Defensiveness, weak economy', 'Industrial boom', 'High risk appetite', 'Nothing'], 0, '', ''],
    ['Vì sao cổ phiếu khai thác vàng biến động mạnh hơn vàng?', 'Why are gold miners more volatile than gold?', ['Đòn bẩy hoạt động: chi phí sản xuất gần cố định', 'Không có lý do', 'Do cổ tức', 'Do luật'], ['Operating leverage: production costs are nearly fixed', 'No reason', 'Dividends', 'Law'], 0, '', ''],
    ['Vàng $2.400, chi phí sản xuất $1.400. Vàng tăng 10%. Lợi nhuận/oz của doanh nghiệp tăng khoảng:', 'Gold $2,400, cost $1,400. Gold +10%. Margin per oz rises ≈', ['10%', '24%', '5%', '0%'], null, 1, '(2640 − 1400)/(1000) − 1 = 24%.', ''],
    ['Vàng tạo đỉnh mới nhưng cổ phiếu khai thác không xác nhận. Ý nghĩa:', 'Gold makes a new high but miners don’t confirm. Meaning:', ['Phân kỳ cảnh báo', 'Xác nhận tăng mạnh', 'Không ý nghĩa', 'Mua thêm'], ['A divergence warning', 'Strong confirmation', 'Meaningless', 'Buy more'], 0, '', ''],
    ['Tương quan vàng – cổ phiếu trong giai đoạn căng thẳng thường:', 'Gold–stock correlation under stress tends to be:', ['Thấp hoặc âm', 'Rất cao dương', 'Bằng 1', 'Không xác định'], ['Low or negative', 'Very high positive', 'Equal to 1', 'Undefined'], 0, '', ''],
    ['Tỷ lệ vàng/chỉ số cổ phiếu tăng phản ánh:', 'A rising gold/equity ratio reflects:', ['Môi trường phòng thủ', 'Khẩu vị rủi ro', 'Lạm phát âm', 'Không gì'], ['A defensive environment', 'Risk appetite', 'Deflation', 'Nothing'], 0, '', ''],
    ['Vàng phù hợp nhất với loại hệ thống nào trên khung tuần?', 'Which system type suits gold on weekly charts?', ['Theo xu hướng', 'Lướt sóng phút', 'Không hệ thống nào', 'Bán quyền chọn'], ['Trend following', 'Minute scalping', 'None', 'Option selling'], 0, '', ''],
    ['1 lượng vàng xấp xỉ:', 'One tael of gold is about:', ['1.2057 oz', '1 oz', '10 oz', '0.5 oz'], null, 0, '', ''],
    ['Vàng thế giới $2.500/oz, USD/VND 25.000. Giá quy đổi 1 lượng (chưa thuế phí) khoảng:', 'Gold $2,500/oz, USD/VND 25,000. Converted price per tael ≈', ['62.5 triệu', '75.4 triệu', '30 triệu', '125 triệu'], null, 1, '2.500 × 1.2057 × 25.000 ≈ 75.4 triệu.', ''],
    ['Chênh lệch giá vàng miếng trong nước so với thế giới có xu hướng thu hẹp khi:', 'The domestic bar premium tends to narrow when:', ['Nguồn cung trong nước tăng', 'Cầu tăng đột biến', 'Cung bị siết', 'Không bao giờ'], ['Domestic supply increases', 'Demand spikes', 'Supply tightens', 'Never'], 0, '', ''],
    ['Rủi ro đặc thù khi giao dịch vàng trong nước:', 'A specific risk of domestic gold trading:', ['Chênh lệch mua–bán rộng và rủi ro chính sách', 'Không có rủi ro', 'Thanh khoản vô hạn', 'Không có phí'], ['Wide spreads and policy risk', 'No risk', 'Infinite liquidity', 'No fees'], 0, '', ''],
    ['Lạm phát kỳ vọng tăng trong khi lãi suất danh nghĩa đứng yên. Vàng thường:', 'Expected inflation rises while nominal yields are flat. Gold usually:', ['Tăng (lãi suất thực giảm)', 'Giảm', 'Không đổi', 'Về 0'], ['Rises (real rates fall)', 'Falls', 'Unchanged', 'Zero'], 0, '', ''],
    ['Vàng là tài sản đặc biệt vì:', 'Gold is special because it:', ['Không có rủi ro đối tác và không tạo dòng tiền', 'Trả cổ tức cao', 'Là cổ phiếu', 'Không có giá'], ['Has no counterparty risk and no cash flow', 'Pays high dividends', 'Is a stock', 'Has no price'], 0, '', ''],
    ['Bạc khác vàng ở chỗ:', 'Silver differs from gold in:', ['Có tính công nghiệp cao hơn, biến động hơn', 'Ít biến động hơn', 'Không có nhu cầu công nghiệp', 'Giống hệt'], ['Higher industrial use and volatility', 'Lower volatility', 'No industrial use', 'Being identical'], 0, '', ''],
    ['Tình huống: lãi suất thực tăng mạnh, USD tăng, vàng vẫn giữ vững gần đỉnh. Nhận định:', 'Case: real rates and USD surge, gold holds near highs. Read:', ['Có lực cầu mạnh khác (NHTW, trú ẩn) — sức mạnh tương đối đáng chú ý', 'Vàng sắp sập chắc chắn', 'Dữ liệu sai', 'Không ý nghĩa'], ['Another strong bid (central banks, haven) — notable relative strength', 'Gold will surely crash', 'Bad data', 'Meaningless'], 0, '', ''],
    ['Số tròn (ví dụ mốc nghìn USD/oz) với vàng có vai trò:', 'Round numbers (e.g. thousand-dollar marks) for gold act as:', ['Vùng tâm lý hỗ trợ/kháng cự', 'Không vai trò', 'Ngày đáo hạn', 'Lãi suất'], ['Psychological support/resistance', 'No role', 'Expiry dates', 'Rates'], 0, '', ''],
    ['PAXG trên Binance là:', 'PAXG on Binance is:', ['Token gắn với giá vàng', 'Cổ phiếu khai thác', 'Hợp đồng dầu', 'Stablecoin USD'], ['A gold-backed token', 'A miner stock', 'An oil contract', 'A USD stablecoin'], 0, '', ''],
    ['Vàng tăng cùng lúc lợi suất thực tăng thường gợi ý:', 'Gold rising alongside rising real rates often suggests:', ['Nhu cầu trú ẩn/địa chính trị hoặc NHTW lấn át yếu tố lãi suất', 'Quan hệ bình thường', 'Lỗi dữ liệu', 'Lạm phát âm'], ['Haven/geopolitical or central-bank demand overriding rates', 'Normal behaviour', 'Bad data', 'Deflation'], 0, '', ''],
    ['Cổ phiếu khai thác vàng thường dẫn trước vàng ở:', 'Gold miners often lead gold at:', ['Các điểm đảo chiều', 'Giữa xu hướng', 'Không bao giờ', 'Ngày lễ'], ['Turning points', 'Mid-trend', 'Never', 'Holidays'], 0, '', ''],
    ['Phân tích vàng toàn diện nên kết hợp:', 'A complete gold analysis combines:', ['Xu hướng giá, lãi suất thực, USD, tỷ lệ liên quan, tâm lý', 'Chỉ tin tức', 'Chỉ giá trong nước', 'Không gì'], ['Price trend, real rates, USD, ratios, sentiment', 'News only', 'Domestic price only', 'Nothing'], 0, '', ''],
    ['Nắm giữ vàng trong danh mục cổ phiếu chủ yếu nhằm:', 'Holding gold in an equity portfolio mainly aims to:', ['Đa dạng hoá và phòng vệ căng thẳng', 'Tăng cổ tức', 'Tăng đòn bẩy', 'Tăng thanh khoản'], ['Diversify and hedge stress', 'Raise dividends', 'Add leverage', 'Raise liquidity'], 0, '', ''],
    ['Lãi suất thực âm sâu thường là môi trường:', 'Deeply negative real rates are usually an environment:', ['Thuận lợi cho vàng', 'Bất lợi cho vàng', 'Không ảnh hưởng', 'Cấm giao dịch'], ['Favourable for gold', 'Unfavourable', 'Irrelevant', 'Banned'], 0, '', ''],
    ['Tỷ lệ vàng/bạc giảm cùng đồng tăng giá gợi ý:', 'A falling gold/silver ratio with rising copper suggests:', ['Khẩu vị rủi ro và tăng trưởng cải thiện', 'Suy thoái', 'Hoảng loạn', 'Không gì'], ['Improving risk appetite and growth', 'Recession', 'Panic', 'Nothing'], 0, '', ''],
    ['Phát biểu đúng về vàng:', 'A correct statement about gold:', ['Quan hệ của vàng với các yếu tố có thể thay đổi; cần theo dõi bối cảnh', 'Vàng luôn tăng khi cổ phiếu giảm', 'Vàng luôn giảm khi USD tăng', 'Vàng không có xu hướng'], ['Gold’s relationships can shift; monitor context', 'Gold always rises when stocks fall', 'Always falls when USD rises', 'Gold never trends'], 0, '', '']
  ]);

  /* ================= L3-13 ================= */
  C.addLesson('l3-13', {
    goals: ['Đo lường tương quan và quan hệ dẫn – theo trên dữ liệu trong phiên.', 'Nhận diện các vấn đề vi cấu trúc: giao dịch không đồng bộ, nhiễu, chênh lệch mua–bán.', 'Hiểu quan hệ hợp đồng tương lai – chỉ số cơ sở trong phiên.', 'Dùng tương quan trong phiên cho thời điểm và phòng ngừa.'],
    body: () => `
<h3>1. Vì sao dữ liệu trong phiên khác?</h3>
<p>Ở khung phút, giá chứa nhiều <b>nhiễu vi cấu trúc</b> (nhảy giữa giá mua và giá bán, lệnh lớn đơn lẻ). Tương quan đo trên khung rất ngắn thường <b>thấp hơn</b> khung ngày — hiện tượng tương quan giảm khi khung thời gian rút ngắn — vì thông tin cần thời gian để lan giữa các thị trường và vì các mã ít thanh khoản giao dịch thưa thớt.</p>
<h3>2. Các vấn đề cần xử lý</h3>
<ul><li><b>Giao dịch không đồng bộ</b>: mã ít thanh khoản không khớp lệnh trong một số phút → giá "cũ" tạo ra dẫn – theo giả.</li>
<li><b>Chênh lệch mua–bán</b>: giá khớp nhảy qua lại gây tự tương quan âm giả ở độ trễ 1.</li>
<li><b>Khung giờ</b>: biến động và khối lượng cao ở đầu và cuối phiên (đường cong chữ U), thấp giữa phiên; phiên ATO/ATC có cơ chế khớp khác.</li>
<li><b>Lựa chọn khung</b>: 5–15 phút thường là thỏa hiệp giữa độ chi tiết và nhiễu.</li></ul>
<h3>3. Hợp đồng tương lai và chỉ số cơ sở</h3>
<ul><li>Hợp đồng tương lai chỉ số thường <b>phản ánh thông tin nhanh hơn</b> rổ cổ phiếu cơ sở (chi phí giao dịch thấp, đòn bẩy, bán khống dễ) → dẫn trước vài phút.</li>
<li><b>Chênh lệch cơ sở</b> (giá tương lai − chỉ số): mở rộng/thu hẹp bất thường phản ánh tâm lý và áp lực phòng ngừa; về 0 khi đáo hạn.</li>
<li>Ở Việt Nam: VN30F thường biến động trước VN30 trong phiên; cơ sở âm sâu phản ánh tâm lý bi quan hoặc nhu cầu phòng ngừa.</li></ul>
${H.leadLag('ETHUSDT', 'BTCUSDT', 'bn_spot', '5m')}
<h3>4. Ứng dụng</h3>
<ul><li><b>Thời điểm</b>: dùng thị trường dẫn trước để xác nhận hoặc tinh chỉnh điểm vào ở thị trường đi sau (ví dụ chờ hợp đồng tương lai xác nhận breakout của rổ cơ sở).</li>
<li><b>Phòng ngừa trong phiên</b>: tỷ lệ phòng ngừa (beta) ước lượng trên dữ liệu trong phiên có thể khác dữ liệu ngày; cập nhật thường xuyên.</li>
<li><b>Giao dịch cặp trong phiên</b>: cần chi phí rất thấp; lợi thế dẫn – theo vài phút thường bị chi phí và độ trễ thực hiện xoá sạch với nhà đầu tư cá nhân.</li></ul>
<div class="callout">Quy tắc thực tế: một quan hệ dẫn – theo trong phiên có ý nghĩa thống kê <b>chưa chắc</b> giao dịch được. Hãy tính độ trễ thực hiện, chênh lệch mua–bán và phí trước khi kết luận.</div>`,
    keys: ['Tương quan trên khung rất ngắn thường thấp hơn khung ngày do nhiễu và lan truyền thông tin chậm.', 'Vấn đề: giao dịch không đồng bộ, chênh lệch mua–bán, mẫu hình trong ngày chữ U, ATO/ATC.', 'Hợp đồng tương lai thường dẫn trước rổ cơ sở; chênh lệch cơ sở phản ánh tâm lý/phòng ngừa.', 'Ứng dụng: thời điểm, phòng ngừa trong phiên, giao dịch cặp — chi phí quyết định khả năng thực hiện.'],
    terms: [['Market microstructure', 'Vi cấu trúc thị trường'], ['Asynchronous trading', 'Giao dịch không đồng bộ'], ['Bid–ask bounce', 'Nhảy giá mua – bán'], ['Intraday U-shape', 'Mẫu hình chữ U trong phiên'], ['Basis', 'Chênh lệch cơ sở'], ['Price discovery', 'Khám phá giá']]
  }, {
    goals: ['Measure intraday correlations and lead–lag.', 'Recognise microstructure issues.', 'Understand futures–cash dynamics.', 'Apply intraday correlation to timing and hedging.'],
    body: () => `
<h3>1. Why intraday differs</h3><p>Microstructure noise; correlations shrink at very short horizons as information takes time to spread and illiquid names trade sparsely.</p>
<h3>2. Issues</h3><ul><li>Asynchronous trading</li><li>Bid–ask bounce</li><li>U-shaped intraday activity; auction sessions</li><li>Choice of bar size</li></ul>
<h3>3. Futures and cash</h3><ul><li>Futures usually lead the basket by minutes.</li><li>Basis reflects sentiment and hedging; converges at expiry.</li><li>VN30F often moves before VN30.</li></ul>${H.leadLag('ETHUSDT', 'BTCUSDT', 'bn_spot', '5m')}
<h3>4. Uses</h3><ul><li>Timing confirmation.</li><li>Intraday hedge ratios.</li><li>Intraday pairs — costs decide.</li></ul><div class="callout">Statistically significant lead–lag is not necessarily tradable.</div>`,
    keys: ['Shorter horizons, lower correlations.', 'Microstructure.', 'Futures lead.', 'Uses and costs.'],
    terms: [['Asynchronous trading', 'Stale prices from infrequent trades'], ['Basis', 'Futures minus cash']]
  }, [
    ['Tương quan giữa hai thị trường đo trên khung 1 phút so với khung ngày thường:', 'Correlation measured on 1-minute vs daily bars is usually:', ['Thấp hơn', 'Cao hơn', 'Bằng', 'Luôn bằng 1'], ['Lower', 'Higher', 'Equal', 'Always 1'], 0, '', ''],
    ['Một nguyên nhân khiến tương quan giảm ở khung rất ngắn:', 'One reason correlation falls at very short horizons:', ['Thông tin cần thời gian lan giữa các thị trường; mã ít thanh khoản khớp thưa', 'Dữ liệu quá ít', 'Do luật', 'Không đúng'], ['Information takes time to spread; illiquid names trade sparsely', 'Too little data', 'Law', 'False'], 0, '', ''],
    ['Giao dịch không đồng bộ tạo ra:', 'Asynchronous trading creates:', ['Quan hệ dẫn – theo giả do giá cũ', 'Tương quan hoàn hảo', 'Không ảnh hưởng', 'Gap'], ['Spurious lead–lag from stale prices', 'Perfect correlation', 'No effect', 'Gaps'], 0, '', ''],
    ['Nhảy giá mua – bán gây:', 'Bid–ask bounce causes:', ['Tự tương quan âm giả ở độ trễ 1', 'Tự tương quan dương', 'Xu hướng', 'Không gì'], ['Spurious negative lag-1 autocorrelation', 'Positive autocorrelation', 'Trends', 'Nothing'], 0, '', ''],
    ['Mẫu hình chữ U trong phiên nghĩa là:', 'The intraday U-shape means:', ['Biến động và khối lượng cao ở đầu và cuối phiên, thấp giữa phiên', 'Cao giữa phiên', 'Không đổi', 'Chỉ cao cuối tuần'], ['Volume and volatility high at open and close, low midday', 'High midday', 'Constant', 'Only Fridays'], 0, '', ''],
    ['Hợp đồng tương lai chỉ số thường dẫn trước rổ cơ sở vì:', 'Index futures often lead the cash basket because:', ['Chi phí thấp, đòn bẩy, bán khống dễ — thông tin phản ánh nhanh hơn', 'Ít người giao dịch', 'Do luật', 'Không đúng'], ['Low cost, leverage, easy shorting — faster information', 'Few traders', 'Law', 'False'], 0, '', ''],
    ['Chênh lệch cơ sở = ', 'Basis =', ['Giá tương lai − chỉ số cơ sở', 'Chỉ số × 2', 'Khối lượng − OI', 'Không có'], ['Futures price − cash index', 'Index × 2', 'Volume − OI', 'None'], 0, '', ''],
    ['Chênh lệch cơ sở về 0 khi:', 'The basis converges to zero at:', ['Đáo hạn', 'Đầu phiên', 'Không bao giờ', 'Cuối năm'], ['Expiry', 'The open', 'Never', 'Year-end'], 0, '', ''],
    ['VN30F giao dịch thấp hơn VN30 rất nhiều (cơ sở âm sâu) phản ánh:', 'VN30F trading far below VN30 (deep negative basis) reflects:', ['Tâm lý bi quan hoặc nhu cầu phòng ngừa lớn', 'Lạc quan cực độ', 'Không gì', 'Lỗi dữ liệu chắc chắn'], ['Pessimism or heavy hedging demand', 'Extreme optimism', 'Nothing', 'Certain error'], 0, '', ''],
    ['Khung trong phiên thường là thỏa hiệp tốt giữa chi tiết và nhiễu:', 'An intraday bar size that balances detail and noise:', ['5–15 phút', '1 giây', '1 tuần', '1 tháng'], ['5–15 minutes', '1 second', '1 week', '1 month'], 0, '', ''],
    ['Quan hệ dẫn – theo trong phiên có ý nghĩa thống kê:', 'A statistically significant intraday lead–lag:', ['Chưa chắc giao dịch được sau độ trễ thực hiện và chi phí', 'Luôn có lãi', 'Vô nghĩa', 'Bị cấm'], ['May not be tradable after latency and costs', 'Always profitable', 'Meaningless', 'Banned'], 0, '', ''],
    ['Tỷ lệ phòng ngừa (beta) ước lượng trên dữ liệu trong phiên:', 'Hedge ratios estimated intraday:', ['Có thể khác dữ liệu ngày và cần cập nhật thường xuyên', 'Luôn bằng beta ngày', 'Bằng 1', 'Không cần'], ['May differ from daily ones and need frequent updates', 'Always equal daily beta', 'Equal 1', 'Unneeded'], 0, '', ''],
    ['Dùng thị trường dẫn trước để xác nhận breakout ở thị trường đi sau là ứng dụng về:', 'Using the leading market to confirm a breakout in the lagging one is a:', ['Thời điểm', 'Định giá', 'Kế toán', 'Thuế'], ['Timing use', 'Valuation use', 'Accounting use', 'Tax use'], 0, '', ''],
    ['Phiên ATO/ATC ở Việt Nam khác phiên khớp liên tục ở:', 'Vietnam’s ATO/ATC sessions differ from continuous trading in:', ['Cơ chế khớp lệnh định kỳ một giá', 'Không có lệnh', 'Giá cố định', 'Không khác'], ['Single-price periodic matching', 'No orders', 'Fixed prices', 'No difference'], 0, '', ''],
    ['Giao dịch cặp trong phiên đòi hỏi:', 'Intraday pairs trading requires:', ['Chi phí rất thấp và thực hiện nhanh', 'Phí cao', 'Dữ liệu tuần', 'Không cần gì'], ['Very low costs and fast execution', 'High fees', 'Weekly data', 'Nothing'], 0, '', ''],
    ['Nhà đầu tư cá nhân khai thác dẫn – theo vài phút thường gặp khó vì:', 'Retail traders struggle to exploit minute-level leads because:', ['Độ trễ và chi phí xoá lợi thế', 'Lợi thế quá lớn', 'Không có dữ liệu', 'Do luật'], ['Latency and costs erase the edge', 'The edge is too big', 'No data', 'Law'], 0, '', ''],
    ['Tự tương quan âm ở độ trễ 1 trên dữ liệu 1 phút có thể là:', 'Negative lag-1 autocorrelation on 1-minute data may be:', ['Hiện tượng vi cấu trúc (nhảy giá mua – bán), không phải cơ hội đảo chiều thật', 'Lợi thế chắc chắn', 'Xu hướng', 'Lỗi máy'], ['A microstructure artefact (bid–ask bounce), not a real reversal edge', 'A sure edge', 'A trend', 'A glitch'], 0, '', ''],
    ['Khi tính tương quan trong phiên giữa mã thanh khoản cao và mã thanh khoản thấp, rủi ro chính:', 'Computing intraday correlation between liquid and illiquid names risks:', ['Giá cũ của mã thanh khoản thấp làm sai lệch kết quả', 'Không rủi ro', 'Quá ít nhiễu', 'Tương quan bằng 1'], ['Stale illiquid prices distorting results', 'No risk', 'Too little noise', 'Correlation of 1'], 0, '', ''],
    ['Biến động cuối phiên ở Việt Nam thường chịu ảnh hưởng của:', 'Late-session moves in Vietnam are often influenced by:', ['Phiên ATC và hoạt động cơ cấu danh mục quỹ', 'Không gì', 'Giờ mở cửa Mỹ', 'Tin tức tuần trước'], ['The ATC auction and fund rebalancing', 'Nothing', 'US open', 'Last week’s news'], 0, '', ''],
    ['Khám phá giá chủ yếu diễn ra ở thị trường:', 'Price discovery mainly occurs in the market with:', ['Chi phí thấp, thanh khoản cao, đòn bẩy dễ', 'Thanh khoản thấp nhất', 'Không giao dịch', 'Giá cố định'], ['Low cost, high liquidity, easy leverage', 'The least liquidity', 'No trading', 'Fixed prices'], 0, '', ''],
    ['Đo tương quan trong phiên giữa ETH và BTC trên khung 5 phút cho r cùng kỳ = 0.85, các độ trễ ≈ 0. Kết luận:', 'ETH–BTC 5-minute: same-bar r 0.85, lags ≈ 0. Conclusion:', ['Phản ứng gần như đồng thời — không có lợi thế dẫn trước đáng kể', 'BTC dẫn trước mạnh', 'Không liên quan', 'ETH dẫn trước 5 phút'], ['Near-simultaneous — no meaningful lead', 'BTC strongly leads', 'Unrelated', 'ETH leads by 5 minutes'], 0, '', ''],
    ['Vì sao nên loại bỏ vài phút đầu phiên khi ước lượng quan hệ trong phiên?', 'Why exclude the first minutes when estimating intraday links?', ['Cơ chế khớp mở cửa và biến động bất thường làm méo kết quả', 'Không có giao dịch', 'Luật cấm', 'Không cần'], ['Opening auction mechanics and abnormal volatility distort results', 'No trading', 'Banned', 'Unneeded'], 0, '', ''],
    ['Chênh lệch cơ sở mở rộng đột ngột trong phiên khi thị trường giảm mạnh thường phản ánh:', 'A sudden basis widening during a sharp intraday fall reflects:', ['Áp lực bán phòng ngừa trên hợp đồng tương lai', 'Lạc quan', 'Lỗi dữ liệu', 'Đáo hạn'], ['Hedging pressure on futures', 'Optimism', 'Bad data', 'Expiry'], 0, '', ''],
    ['Tương quan trong phiên tăng mạnh trong ngày có tin vĩ mô lớn vì:', 'Intraday correlations jump on big macro-news days because:', ['Một yếu tố chung chi phối mọi tài sản', 'Ngẫu nhiên', 'Ít giao dịch', 'Không đúng'], ['A common factor dominates all assets', 'Random', 'Low trading', 'False'], 0, '', ''],
    ['Khi kiểm định hệ thống trong phiên, giả định khớp lệnh nên:', 'When testing intraday systems, fill assumptions should be:', ['Bi quan: tính chênh lệch mua–bán và trượt giá', 'Khớp tại giá giữa', 'Không phí', 'Khớp giá tốt nhất'], ['Pessimistic: include spread and slippage', 'Mid-price fills', 'No fees', 'Best-price fills'], 0, '', ''],
    ['Dữ liệu 1 phút của mã thanh khoản thấp có nhiều nến không có giao dịch. Cách xử lý hợp lý:', '1-minute data of an illiquid stock has many no-trade bars. Sensible handling:', ['Dùng khung dài hơn hoặc chỉ tính khi có giao dịch', 'Coi giá cũ là giao dịch thật', 'Bỏ qua vấn đề', 'Nhân đôi khối lượng'], ['Use longer bars or only traded bars', 'Treat stale prices as trades', 'Ignore it', 'Double volume'], 0, '', ''],
    ['Biến động cao đầu phiên làm cho dừng lỗ trong phiên:', 'High opening volatility makes intraday stops:', ['Dễ bị quét hơn nếu đặt quá gần', 'An toàn hơn', 'Không ảnh hưởng', 'Luôn khớp tốt'], ['Easier to hit if too tight', 'Safer', 'Unaffected', 'Always well filled'], 0, '', ''],
    ['Ưu điểm của phân tích tương quan trong phiên với nhà giao dịch ngắn hạn:', 'The benefit of intraday correlation analysis for short-term traders:', ['Hiểu thị trường nào dẫn dắt để xác nhận và quản lý rủi ro', 'Dự báo chắc chắn', 'Không cần dừng lỗ', 'Không có'], ['Know which market leads to confirm and manage risk', 'Certain forecasts', 'No stops', 'None'], 0, '', ''],
    ['Phát biểu đúng:', 'A correct statement:', ['Tương quan và dẫn – theo phụ thuộc mạnh vào khung thời gian đo', 'Tương quan không phụ thuộc khung', 'Dữ liệu phút luôn tốt hơn', 'Không cần xử lý vi cấu trúc'], ['Correlation and lead–lag depend strongly on the horizon', 'Correlation is horizon-free', 'Minute data is always better', 'Microstructure can be ignored'], 0, '', ''],
    ['Bài học chính của tương quan trong phiên:', 'The main lesson of intraday correlation:', ['Hiểu vi cấu trúc trước khi tin vào con số; khả năng thực hiện quyết định giá trị', 'Mọi con số đều đáng tin', 'Không cần chi phí', 'Luôn giao dịch theo dẫn – theo'], ['Understand microstructure before trusting numbers; executability decides value', 'All numbers are reliable', 'Costs don’t matter', 'Always trade lead–lag'], 0, '', '']
  ]);

  /* ================= L3-14 ================= */
  C.addLesson('l3-14', {
    goals: ['Xây dựng chỉ báo từ quan hệ liên thị trường: chênh lệch động lượng, tỷ lệ chuẩn hoá, phần dư hồi quy.', 'Thiết kế quy tắc giao dịch dựa trên chỉ báo liên thị trường.', 'Kiểm định và kết hợp chỉ báo liên thị trường với chỉ báo giá.', 'Nhận diện điều kiện khiến chỉ báo liên thị trường thất bại.'],
    body: () => `
<h3>1. Từ quan hệ đến chỉ báo</h3>
<p>Quan hệ liên thị trường chỉ hữu ích khi được chuyển thành <b>chỉ báo khách quan</b> có thể kiểm định. Ba họ chỉ báo chính:</p>
<table class="tbl"><thead><tr><th>Họ</th><th>Cách xây dựng</th><th>Ý nghĩa</th></tr></thead><tbody>
<tr><td><b>Chênh lệch động lượng</b></td><td>ROC(N) của thị trường mục tiêu − β × ROC(N) của thị trường liên quan, chuẩn hoá thành z-score</td><td>Mục tiêu chạy vượt/tụt so với quan hệ thông thường</td></tr>
<tr><td><b>Tỷ lệ chuẩn hoá</b></td><td>Tỷ lệ giá A/B so với MA của nó, hoặc dao động trên tỷ lệ</td><td>Sức mạnh tương đối và điểm đảo chiều của tỷ lệ</td></tr>
<tr><td><b>Phần dư hồi quy</b></td><td>(Giá thực − giá dự báo từ hồi quy lăn) / σ phần dư</td><td>Định giá tương đối theo nhiều biến</td></tr></tbody></table>
${H.imDisp()}
<h3>2. Quy tắc giao dịch</h3>
<ul><li><b>Phân kỳ dẫn trước</b> (khi thị trường liên quan dẫn): mua mục tiêu khi thị trường liên quan đã tăng mạnh mà mục tiêu chưa theo (chênh lệch âm lớn), <b>và</b> giá mục tiêu bắt đầu xác nhận (ví dụ vượt MA ngắn).</li>
<li><b>Hội tụ</b> (giao dịch cặp): mua mã tụt, bán mã vượt khi z-score cực trị; thoát khi z về 0; dừng khi z mở rộng thêm (quan hệ có thể đã gãy).</li>
<li><b>Bộ lọc</b>: chỉ giao dịch tín hiệu giá theo hướng được thị trường liên quan ủng hộ (ví dụ chỉ mua cổ phiếu khi trái phiếu cũng đang trong xu hướng tăng ở chế độ lạm phát thấp).</li></ul>
<h3>3. Kiểm định và kết hợp</h3>
<ul><li>Áp dụng toàn bộ quy trình Level 3: khử xu hướng, ngoài mẫu, walk-forward, chi phí.</li>
<li>Chỉ báo liên thị trường thường có <b>tần suất tín hiệu thấp</b> và độ trễ thay đổi → dùng tốt nhất làm <b>bộ lọc</b> hoặc yếu tố trong mô hình trọng lượng bằng chứng, không phải hệ thống độc lập.</li>
<li>Kết hợp với chỉ báo giá của chính thị trường giảm số tín hiệu sai.</li></ul>
<h3>4. Khi nào thất bại?</h3>
<ul><li><b>Thay đổi chế độ</b>: quan hệ đổi dấu (cổ phiếu – trái phiếu) → chỉ báo cho tín hiệu ngược.</li>
<li><b>Cú sốc riêng</b> của một thị trường (tin doanh nghiệp, chính sách) phá vỡ quan hệ.</li>
<li><b>Độ trễ không ổn định</b>: thị trường liên quan dẫn trước 2 tuần lúc này, 3 tháng lúc khác.</li>
<li>Biện pháp: theo dõi tương quan lăn làm "công tắc" — chỉ dùng chỉ báo khi quan hệ còn đủ mạnh và đúng dấu.</li></ul>`,
    keys: ['Ba họ chỉ báo liên thị trường: chênh lệch động lượng (z-score), tỷ lệ chuẩn hoá, phần dư hồi quy.', 'Quy tắc: phân kỳ dẫn trước + xác nhận giá; hội tụ (cặp) với dừng khi z mở rộng; bộ lọc hướng.', 'Kiểm định như mọi quy tắc; tốt nhất làm bộ lọc/yếu tố trong mô hình bằng chứng.', 'Thất bại khi đổi chế độ, cú sốc riêng, độ trễ không ổn định — dùng tương quan lăn làm công tắc.'],
    terms: [['Intermarket disparity', 'Chênh lệch liên thị trường'], ['Normalised ratio', 'Tỷ lệ chuẩn hoá'], ['Correlation switch', 'Công tắc tương quan'], ['Pairs trading', 'Giao dịch cặp']]
  }, {
    goals: ['Build intermarket indicators.', 'Design rules.', 'Test and combine with price indicators.', 'Recognise failure conditions.'],
    body: () => `
<h3>1. Indicator families</h3><table class="tbl"><tbody><tr><td>Momentum disparity</td><td>ROC(target) − β·ROC(related), z-scored</td></tr><tr><td>Normalised ratio</td><td>A/B vs its MA</td></tr><tr><td>Regression residual</td><td>(actual − fitted)/σ</td></tr></tbody></table>${H.imDisp()}
<h3>2. Rules</h3><ul><li>Leading divergence + price confirmation.</li><li>Convergence pairs with stops on widening.</li><li>Directional filters.</li></ul>
<h3>3. Testing</h3><p>Full protocol; best as filters or weight-of-evidence components; combine with price.</p>
<h3>4. Failure</h3><p>Regime change, idiosyncratic shocks, unstable lags — use rolling correlation as an on/off switch.</p>`,
    keys: ['Families.', 'Rules.', 'Testing.', 'Failure modes.'],
    terms: [['Intermarket disparity', 'Momentum gap vs a related market']]
  }, [
    ['Chỉ báo chênh lệch động lượng liên thị trường được tính bằng:', 'An intermarket momentum disparity is computed as:', ['ROC mục tiêu − β × ROC thị trường liên quan, chuẩn hoá z', 'RSI × 2', 'Khối lượng / OI', 'MA 200'], ['Target ROC − β × related ROC, z-scored', 'RSI × 2', 'Volume / OI', '200-MA'], 0, '', ''],
    ['Vì sao nhân β khi tính chênh lệch?', 'Why multiply by β in the disparity?', ['Điều chỉnh theo độ nhạy thông thường giữa hai thị trường', 'Để số lớn hơn', 'Không lý do', 'Do luật'], ['To adjust for the usual sensitivity between the markets', 'Bigger numbers', 'No reason', 'Law'], 0, '', ''],
    ['z-score chênh lệch = −2.5 nghĩa là:', 'A disparity z-score of −2.5 means:', ['Mục tiêu tụt xa so với quan hệ thông thường', 'Mục tiêu vượt xa', 'Bình thường', 'Lỗi'], ['The target lags far behind its usual relation', 'Far ahead', 'Normal', 'Error'], 0, '', ''],
    ['Quy tắc phân kỳ dẫn trước hợp lý:', 'A sound leading-divergence rule:', ['Mua mục tiêu khi chênh lệch âm lớn VÀ giá mục tiêu bắt đầu xác nhận', 'Mua ngay khi chênh lệch âm', 'Bán khi chênh lệch âm', 'Không cần giá'], ['Buy when disparity is very negative AND price starts confirming', 'Buy as soon as it’s negative', 'Sell when negative', 'Ignore price'], 0, '', ''],
    ['Trong giao dịch cặp, nên đặt dừng khi:', 'In pairs trading, stop out when:', ['z-score tiếp tục mở rộng — quan hệ có thể đã gãy', 'z về 0', 'Có lãi', 'Không bao giờ'], ['The z-score keeps widening — the relation may have broken', 'z returns to 0', 'In profit', 'Never'], 0, '', ''],
    ['Thoát lệnh giao dịch cặp theo hội tụ thường khi:', 'Convergence pairs trades typically exit when:', ['z-score về gần 0', 'z đạt −5', 'Sau 1 năm bất kể', 'Không thoát'], ['The z-score returns near 0', 'z reaches −5', 'After a year regardless', 'Never'], 0, '', ''],
    ['Chỉ báo liên thị trường thường được dùng tốt nhất như:', 'Intermarket indicators are usually best used as:', ['Bộ lọc hoặc yếu tố trong mô hình bằng chứng', 'Hệ thống độc lập duy nhất', 'Thay quản lý rủi ro', 'Không dùng'], ['Filters or weight-of-evidence components', 'The sole standalone system', 'Risk-management substitutes', 'Not at all'], 0, '', ''],
    ['Vì sao chỉ báo liên thị trường khó làm hệ thống độc lập?', 'Why are intermarket indicators hard to run standalone?', ['Tần suất tín hiệu thấp và độ trễ không ổn định', 'Quá nhiều tín hiệu', 'Không tính được', 'Do luật'], ['Few signals and unstable lags', 'Too many signals', 'Uncomputable', 'Law'], 0, '', ''],
    ['Công tắc tương quan là:', 'A correlation switch is:', ['Chỉ dùng chỉ báo liên thị trường khi tương quan lăn đủ mạnh và đúng dấu', 'Tắt máy tính', 'Đổi mã ngẫu nhiên', 'Không có'], ['Use the indicator only when rolling correlation is strong and of the right sign', 'Turning off the computer', 'Random switching', 'None'], 0, '', ''],
    ['Tình huống: tương quan lăn cổ phiếu – trái phiếu đổi từ âm sang dương. Bộ lọc "chỉ mua cổ phiếu khi trái phiếu tăng" nên:', 'Case: rolling stock–bond correlation turns from negative to positive. The filter "buy stocks only when bonds rise" should:', ['Được xem xét lại vì chế độ đã đổi', 'Giữ nguyên vĩnh viễn', 'Đảo ngược ngay không cần kiểm định', 'Bỏ qua'], ['Be reviewed because the regime changed', 'Stay forever', 'Be reversed without testing', 'Be ignored'], 0, '', ''],
    ['Một tin riêng của doanh nghiệp làm cổ phiếu tách khỏi ngành. Chỉ báo chênh lệch sẽ:', 'Company-specific news decouples a stock from its sector. The disparity indicator will:', ['Cho tín hiệu cực trị có thể sai vì quan hệ bị phá vỡ', 'Luôn đúng', 'Không thay đổi', 'Về 0'], ['Give an extreme reading that may be wrong because the link broke', 'Always be right', 'Not change', 'Go to 0'], 0, '', ''],
    ['Tỷ lệ chuẩn hoá A/B so với MA của nó vượt lên trên 1 nghĩa là:', 'A normalised A/B ratio crossing above 1 (vs its MA) means:', ['A bắt đầu mạnh hơn B so với xu hướng gần đây', 'A yếu hơn', 'Bằng nhau', 'Không gì'], ['A starts outperforming B relative to its recent trend', 'A weaker', 'Equal', 'Nothing'], 0, '', ''],
    ['Phần dư hồi quy làm chỉ báo có ưu điểm:', 'A regression-residual indicator’s advantage:', ['Kết hợp nhiều thị trường liên quan cùng lúc', 'Chỉ dùng một thị trường', 'Không cần dữ liệu', 'Không có'], ['Combines several related markets at once', 'Uses only one market', 'No data', 'None'], 0, '', ''],
    ['Kiểm định chỉ báo liên thị trường cần:', 'Testing intermarket indicators requires:', ['Khử xu hướng, ngoài mẫu, walk-forward, chi phí — như mọi quy tắc', 'Không cần kiểm định', 'Chỉ trong mẫu', 'Chỉ nhìn biểu đồ'], ['Detrending, OOS, walk-forward, costs — like any rule', 'No testing', 'In-sample only', 'Eyeballing'], 0, '', ''],
    ['Độ trễ không ổn định giữa thị trường dẫn và theo khiến:', 'Unstable lead times cause:', ['Khó xác định thời điểm vào lệnh chính xác', 'Dễ dự báo', 'Không ảnh hưởng', 'Lợi nhuận chắc chắn'], ['Hard-to-time entries', 'Easy forecasts', 'No effect', 'Certain profit'], 0, '', ''],
    ['Kết hợp chỉ báo liên thị trường với chỉ báo giá của chính thị trường giúp:', 'Combining intermarket with own-price indicators helps:', ['Giảm tín hiệu sai', 'Tăng tín hiệu sai', 'Không gì', 'Tăng phí'], ['Cut false signals', 'Add false signals', 'Nothing', 'Raise fees'], 0, '', ''],
    ['Cửa sổ chuẩn hoá z-score (ví dụ 60 kỳ) quá ngắn gây:', 'A too-short z-score normalisation window causes:', ['z dao động nhiễu, cực trị giả', 'z quá chậm', 'Không ảnh hưởng', 'Không có cực trị'], ['Noisy z with false extremes', 'Too slow z', 'No effect', 'No extremes'], 0, '', ''],
    ['Bộ lọc hướng: "chỉ mua cổ phiếu dầu khí khi giá dầu trên MA 50". Đây là ứng dụng:', 'Directional filter "buy oil stocks only when oil is above its 50-MA" is:', ['Dùng thị trường liên quan làm bộ lọc', 'Giao dịch cặp', 'Phân kỳ', 'Không liên quan'], ['Using a related market as a filter', 'Pairs trading', 'Divergence', 'Unrelated'], 0, '', ''],
    ['Giao dịch cặp có rủi ro chính:', 'The main risk of pairs trading:', ['Quan hệ cân bằng bị phá vỡ vĩnh viễn', 'Không có rủi ro', 'Lợi nhuận quá lớn', 'Không giao dịch được'], ['A permanent break in the equilibrium', 'No risk', 'Too much profit', 'Untradeable'], 0, '', ''],
    ['Ở Việt Nam, giao dịch cặp cổ phiếu cơ sở bị hạn chế vì:', 'In Vietnam, cash-stock pairs trading is limited because:', ['Bán khống cổ phiếu cơ sở bị hạn chế', 'Không có cổ phiếu', 'Không có dữ liệu', 'Phí bằng 0'], ['Short-selling of cash stocks is restricted', 'No stocks', 'No data', 'Zero fees'], 0, 'Có thể thay bằng phân bổ tương đối (tăng tỷ trọng mã mạnh, giảm mã yếu) hoặc phái sinh chỉ số.', ''],
    ['Thay thế cho bán khống khi không được phép:', 'An alternative to shorting when it isn’t allowed:', ['Điều chỉnh tỷ trọng tương đối hoặc dùng hợp đồng tương lai chỉ số', 'Vay cổ phiếu trái phép', 'Không làm gì', 'Mua gấp đôi'], ['Relative weighting or index futures', 'Illegal borrowing', 'Nothing', 'Double buying'], 0, '', ''],
    ['Chỉ báo liên thị trường cho tín hiệu ngược trong chế độ mới là ví dụ của:', 'An intermarket indicator flipping wrong in a new regime illustrates:', ['Rủi ro thay đổi chế độ', 'Đào bới dữ liệu', 'Thiên lệch sống sót', 'Không gì'], ['Regime-change risk', 'Data mining', 'Survivorship', 'Nothing'], 0, '', ''],
    ['Bước đầu tiên khi xây chỉ báo liên thị trường:', 'The first step in building an intermarket indicator:', ['Xác định quan hệ có cơ sở kinh tế giữa các thị trường', 'Tối ưu tham số', 'Giao dịch thật', 'Chọn màu'], ['Identify an economically grounded relationship', 'Optimise parameters', 'Trade live', 'Pick colours'], 0, '', ''],
    ['Thị trường liên quan tăng 8% trong 20 phiên, β = 1, mục tiêu tăng 1%. Chênh lệch thô:', 'Related market +8% over 20 bars, β 1, target +1%. Raw disparity:', ['−7%', '+7%', '+9%', '0'], null, 0, '', ''],
    ['Tín hiệu chênh lệch cực trị nhưng giá mục tiêu vẫn yếu và tạo đáy thấp hơn. Hành động:', 'Extreme disparity but the target keeps making lower lows. Action:', ['Chờ xác nhận giá', 'Mua ngay toàn bộ', 'Bán khống thị trường liên quan', 'Tăng đòn bẩy'], ['Wait for price confirmation', 'Buy everything now', 'Short the related market', 'Add leverage'], 0, '', ''],
    ['Tần suất tín hiệu thấp ảnh hưởng tới kiểm định vì:', 'Low signal frequency affects testing because:', ['Ít lệnh → kết quả kém tin cậy thống kê', 'Nhiều lệnh hơn', 'Không ảnh hưởng', 'Kết quả chính xác hơn'], ['Few trades → statistically weak results', 'More trades', 'No effect', 'More precise'], 0, '', ''],
    ['Theo dõi tương quan lăn đồng thời với chỉ báo liên thị trường giúp:', 'Monitoring rolling correlation alongside the indicator helps:', ['Biết khi nào chỉ báo đáng tin', 'Tăng lợi nhuận chắc chắn', 'Không gì', 'Giảm dữ liệu'], ['Know when the indicator is trustworthy', 'Guarantee profit', 'Nothing', 'Reduce data'], 0, '', ''],
    ['Đưa chỉ báo liên thị trường vào mô hình trọng lượng bằng chứng nghĩa là:', 'Adding an intermarket indicator to a weight-of-evidence model means:', ['Nó đóng góp một điểm trong tổng điểm, cùng các chỉ báo khác', 'Nó quyết định tất cả', 'Bỏ các chỉ báo khác', 'Không có ý nghĩa'], ['It contributes one score among others', 'It decides everything', 'Dropping other indicators', 'Nothing'], 0, '', ''],
    ['Giao dịch cặp giữa hai ngân hàng tương quan cao về bản chất đặt cược vào:', 'A pairs trade between two highly correlated banks bets on:', ['Chênh lệch tương đối quay về, không phải hướng thị trường', 'Thị trường tăng', 'Thị trường giảm', 'Lãi suất'], ['The relative spread reverting, not market direction', 'Market up', 'Market down', 'Rates'], 0, '', ''],
    ['Bài học chính về chỉ báo liên thị trường:', 'The key lesson on intermarket indicators:', ['Biến quan hệ thành chỉ báo khách quan, kiểm định, dùng kèm công tắc chế độ và xác nhận giá', 'Luôn tin quan hệ lịch sử', 'Không cần giá', 'Chỉ cần một chỉ báo'], ['Turn links into objective, tested indicators with regime switches and price confirmation', 'Always trust history', 'Ignore price', 'One indicator suffices'], 0, '', '']
  ]);

  /* ================= L3-15 ================= */
  C.addLesson('l3-15', {
    goals: ['Giải thích ý tưởng đồ thị xoay vòng sức mạnh tương đối: hai trục xu hướng RS và động lượng RS.', 'Diễn giải bốn góc phần tư và chu trình xoay vòng.', 'Dùng đồ thị để luân chuyển ngành/cổ phiếu và quản lý danh mục.', 'Nhận diện các hạn chế: chọn chuẩn, khung thời gian, độ trễ.'],
    body: () => `
<h3>1. Vấn đề của biểu đồ RS truyền thống</h3>
<p>Đường RS (giá mã / giá chuẩn) cho từng mã là hữu ích, nhưng so sánh 10–20 mã cùng lúc trên các biểu đồ riêng lẻ rất khó. Đồ thị xoay vòng sức mạnh tương đối đặt <b>tất cả</b> các mã lên <b>một</b> mặt phẳng hai chiều để thấy ngay ai đang mạnh, ai đang chuyển biến.</p>
<h3>2. Hai trục</h3>
<ul><li><b>Trục ngang — xu hướng RS</b>: RS hiện tại so với trung bình của chính nó, chuẩn hoá quanh 100. &gt; 100: mã đang trong xu hướng mạnh hơn chuẩn.</li>
<li><b>Trục dọc — động lượng RS</b>: tốc độ thay đổi của xu hướng RS, chuẩn hoá quanh 100. &gt; 100: sức mạnh tương đối đang tăng tốc.</li></ul>
<h3>3. Bốn góc phần tư và chu trình</h3>
<table class="tbl"><thead><tr><th>Góc</th><th>Xu hướng RS</th><th>Động lượng RS</th><th>Ý nghĩa</th></tr></thead><tbody>
<tr><td><b>Dẫn đầu</b> (trên phải)</td><td>&gt; 100</td><td>&gt; 100</td><td>Mạnh hơn chuẩn và còn tăng tốc</td></tr>
<tr><td><b>Suy yếu</b> (dưới phải)</td><td>&gt; 100</td><td>&lt; 100</td><td>Vẫn mạnh nhưng mất đà</td></tr>
<tr><td><b>Tụt hậu</b> (dưới trái)</td><td>&lt; 100</td><td>&lt; 100</td><td>Yếu hơn chuẩn, tiếp tục yếu</td></tr>
<tr><td><b>Cải thiện</b> (trên trái)</td><td>&lt; 100</td><td>&gt; 100</td><td>Còn yếu nhưng đang lấy lại đà</td></tr></tbody></table>
<p>Các mã thường xoay <b>theo chiều kim đồng hồ</b>: Cải thiện → Dẫn đầu → Suy yếu → Tụt hậu → Cải thiện. <b>Đuôi</b> (đường nối các điểm gần nhất) cho biết <b>hướng</b> và <b>tốc độ</b> di chuyển: đuôi dài = chuyển động mạnh; hướng đuôi về phía trên phải (góc khoảng 0–90°) là tích cực nhất.</p>
${H.rotGraph()}
<h3>4. Ứng dụng</h3>
<ul><li><b>Luân chuyển ngành</b>: ưu tiên ngành trong Dẫn đầu hoặc Cải thiện đang tiến về Dẫn đầu; giảm tỷ trọng ngành trong Suy yếu đang tiến về Tụt hậu.</li>
<li><b>Chọn cổ phiếu trong ngành</b>: dùng ngành làm chuẩn để tìm mã dẫn dắt trong ngành dẫn dắt.</li>
<li><b>Đa khung thời gian</b>: tuần cho bối cảnh, ngày cho thời điểm. Mã Dẫn đầu trên tuần và vừa từ Suy yếu quay lại Dẫn đầu trên ngày là cơ hội hấp dẫn.</li>
<li><b>Danh mục</b>: kiểm tra phân bố các vị thế đang nắm — quá nhiều trong Suy yếu/Tụt hậu là dấu hiệu cần tái cân bằng.</li></ul>
<h3>5. Hạn chế</h3>
<ul><li>Chỉ đo <b>tương đối</b>: trong thị trường giá xuống, mã Dẫn đầu vẫn có thể giảm giá (chỉ giảm ít hơn). Kết hợp với xu hướng tuyệt đối.</li>
<li>Kết quả phụ thuộc <b>chuẩn</b> và <b>khung thời gian</b> được chọn.</li>
<li>Là chỉ báo dựa trên trung bình → có độ trễ; xoay vòng không phải lúc nào cũng theo đúng chiều (có thể "móc" ngược lại).</li>
<li>Là công cụ sàng lọc và bối cảnh; vào lệnh vẫn cần tín hiệu giá và quản lý rủi ro.</li></ul>`,
    keys: ['Đặt nhiều mã trên một mặt phẳng: trục ngang xu hướng RS, trục dọc động lượng RS, chuẩn hoá quanh 100.', 'Bốn góc: Dẫn đầu, Suy yếu, Tụt hậu, Cải thiện; xoay theo chiều kim đồng hồ; đuôi cho hướng và tốc độ.', 'Ứng dụng: luân chuyển ngành, chọn mã trong ngành, đa khung thời gian, kiểm tra danh mục.', 'Hạn chế: chỉ tương đối, phụ thuộc chuẩn và khung, có độ trễ — cần tín hiệu giá và xu hướng tuyệt đối.'],
    terms: [['Relative rotation', 'Xoay vòng sức mạnh tương đối'], ['RS trend', 'Xu hướng sức mạnh tương đối'], ['RS momentum', 'Động lượng sức mạnh tương đối'], ['Leading / Weakening / Lagging / Improving', 'Dẫn đầu / Suy yếu / Tụt hậu / Cải thiện'], ['Tail', 'Đuôi (lịch sử vị trí gần đây)']]
  }, {
    goals: ['Explain the two-axis RS rotation view.', 'Read the four quadrants and rotation.', 'Use it for sector/stock rotation and portfolio checks.', 'Recognise limitations.'],
    body: () => `
<h3>1. Problem</h3><p>Comparing many RS lines is hard; plot all symbols on one plane.</p>
<h3>2. Axes</h3><ul><li>X: RS trend vs its own average, centred on 100.</li><li>Y: momentum of that trend, centred on 100.</li></ul>
<h3>3. Quadrants</h3><p>Leading (both > 100), Weakening, Lagging, Improving; typical clockwise rotation; tails show direction and speed.</p>${H.rotGraph()}
<h3>4. Uses</h3><ul><li>Sector rotation</li><li>Stocks within sectors</li><li>Multiple timeframes</li><li>Portfolio checks</li></ul>
<h3>5. Limitations</h3><ul><li>Relative only — combine with absolute trend.</li><li>Benchmark and timeframe dependent.</li><li>Lagging; rotations can hook back.</li><li>A screen, not an entry signal.</li></ul>`,
    keys: ['Two axes.', 'Quadrants and rotation.', 'Uses.', 'Limitations.'],
    terms: [['RS momentum', 'Rate of change of the RS trend']]
  }, [
    ['Trục ngang của đồ thị xoay vòng RS đo:', 'The horizontal axis of the RS rotation chart measures:', ['Xu hướng sức mạnh tương đối so với chuẩn', 'Giá tuyệt đối', 'Khối lượng', 'Biến động'], ['The RS trend versus the benchmark', 'Absolute price', 'Volume', 'Volatility'], 0, '', ''],
    ['Trục dọc đo:', 'The vertical axis measures:', ['Động lượng (tốc độ thay đổi) của xu hướng RS', 'Giá', 'Cổ tức', 'ADX'], ['Momentum (rate of change) of the RS trend', 'Price', 'Dividends', 'ADX'], 0, '', ''],
    ['Mã có xu hướng RS > 100 và động lượng RS > 100 nằm ở góc:', 'A symbol with RS trend > 100 and RS momentum > 100 sits in:', ['Dẫn đầu', 'Suy yếu', 'Tụt hậu', 'Cải thiện'], ['Leading', 'Weakening', 'Lagging', 'Improving'], 0, '', ''],
    ['Xu hướng RS > 100, động lượng RS < 100:', 'RS trend > 100, RS momentum < 100:', ['Suy yếu', 'Dẫn đầu', 'Tụt hậu', 'Cải thiện'], ['Weakening', 'Leading', 'Lagging', 'Improving'], 0, '', ''],
    ['Xu hướng RS < 100, động lượng RS > 100:', 'RS trend < 100, RS momentum > 100:', ['Cải thiện', 'Tụt hậu', 'Dẫn đầu', 'Suy yếu'], ['Improving', 'Lagging', 'Leading', 'Weakening'], 0, '', ''],
    ['Chiều xoay vòng điển hình:', 'The typical rotation direction:', ['Theo chiều kim đồng hồ: Cải thiện → Dẫn đầu → Suy yếu → Tụt hậu', 'Ngược chiều kim đồng hồ', 'Đi thẳng', 'Ngẫu nhiên hoàn toàn'], ['Clockwise: Improving → Leading → Weakening → Lagging', 'Counter-clockwise', 'Straight', 'Fully random'], 0, '', ''],
    ['Đuôi dài trên đồ thị cho biết:', 'A long tail on the chart indicates:', ['Chuyển động sức mạnh tương đối mạnh', 'Không chuyển động', 'Giá cao', 'Lỗi'], ['Strong relative movement', 'No movement', 'High price', 'Error'], 0, '', ''],
    ['Hướng đuôi tích cực nhất:', 'The most positive tail heading:', ['Về phía trên phải', 'Về phía dưới trái', 'Thẳng xuống', 'Thẳng sang trái'], ['Towards the upper right', 'Lower left', 'Straight down', 'Straight left'], 0, '', ''],
    ['Trong thị trường giá xuống, mã nằm ở góc Dẫn đầu:', 'In a bear market, a Leading symbol:', ['Vẫn có thể giảm giá, chỉ giảm ít hơn chuẩn', 'Chắc chắn tăng giá', 'Không giao dịch', 'Luôn là mua'], ['May still fall, just less than the benchmark', 'Surely rises', 'Doesn’t trade', 'Is always a buy'], 0, '', ''],
    ['Vì sao phải kết hợp với xu hướng tuyệt đối?', 'Why combine with absolute trend?', ['Đồ thị chỉ đo sức mạnh tương đối', 'Đồ thị đo giá tuyệt đối', 'Không cần', 'Do luật'], ['The chart measures relative strength only', 'It measures absolute price', 'Unneeded', 'Law'], 0, '', ''],
    ['Ứng dụng luân chuyển ngành: nên ưu tiên ngành:', 'Sector rotation: prefer sectors:', ['Ở Dẫn đầu hoặc Cải thiện đang tiến về Dẫn đầu', 'Ở Tụt hậu đang đi sâu', 'Ở Suy yếu tiến về Tụt hậu', 'Bất kỳ'], ['Leading or Improving heading to Leading', 'Lagging and sinking', 'Weakening heading to Lagging', 'Any'], 0, '', ''],
    ['Để chọn cổ phiếu dẫn dắt trong ngành, chuẩn nên là:', 'To pick leaders within a sector, the benchmark should be:', ['Chỉ số ngành đó', 'Giá vàng', 'Lãi suất', 'Bitcoin'], ['That sector’s index', 'Gold', 'Rates', 'Bitcoin'], 0, '', ''],
    ['Kết quả của đồ thị phụ thuộc vào:', 'The chart’s output depends on:', ['Chuẩn và khung thời gian được chọn', 'Không gì', 'Màu sắc', 'Tên mã'], ['The chosen benchmark and timeframe', 'Nothing', 'Colours', 'Ticker names'], 0, '', ''],
    ['Đồ thị có độ trễ vì:', 'The chart lags because:', ['Dựa trên trung bình và tốc độ thay đổi', 'Dùng dữ liệu tương lai', 'Không có độ trễ', 'Ngẫu nhiên'], ['It is built from averages and rates of change', 'Uses future data', 'No lag', 'Randomly'], 0, '', ''],
    ['Mã Dẫn đầu trên khung tuần, vừa từ Suy yếu quay lại Dẫn đầu trên khung ngày:', 'Leading on weekly and just hooking from Weakening back to Leading on daily:', ['Cơ hội hấp dẫn để xem xét vào lệnh (cần tín hiệu giá)', 'Tín hiệu bán', 'Không ý nghĩa', 'Luôn tránh'], ['An attractive candidate (still needs a price signal)', 'A sell', 'Meaningless', 'Always avoid'], 0, '', ''],
    ['Danh mục có nhiều vị thế nằm ở Suy yếu và Tụt hậu gợi ý:', 'A portfolio with many holdings in Weakening and Lagging suggests:', ['Cần tái cân bằng', 'Danh mục hoàn hảo', 'Mua thêm các mã đó', 'Không gì'], ['A need to rebalance', 'A perfect portfolio', 'Buy more of them', 'Nothing'], 0, '', ''],
    ['Xoay vòng "móc ngược" là:', 'A rotation "hook" is:', ['Mã quay đầu trở lại góc cũ thay vì đi tiếp theo chiều kim đồng hồ', 'Lỗi dữ liệu', 'Không tồn tại', 'Tín hiệu bán chắc chắn'], ['A symbol turning back to its prior quadrant instead of continuing clockwise', 'A data error', 'Nonexistent', 'A sure sell'], 0, '', ''],
    ['Ưu điểm chính của đồ thị xoay vòng so với nhiều đường RS riêng lẻ:', 'Main advantage over many separate RS lines:', ['So sánh nhiều mã cùng lúc trên một mặt phẳng', 'Dự báo chính xác giá', 'Không cần chuẩn', 'Không có độ trễ'], ['Compare many symbols at once on one plane', 'Exact price forecasts', 'No benchmark needed', 'No lag'], 0, '', ''],
    ['Giá trị 100 trên mỗi trục nghĩa là:', 'A value of 100 on each axis means:', ['Trung tính so với chuẩn', 'Mạnh nhất', 'Yếu nhất', 'Không xác định'], ['Neutral versus the benchmark', 'Strongest', 'Weakest', 'Undefined'], 0, '', ''],
    ['Đồ thị xoay vòng nên được dùng như:', 'The rotation chart should be used as:', ['Công cụ sàng lọc và bối cảnh', 'Tín hiệu vào lệnh độc lập', 'Thay dừng lỗ', 'Không dùng'], ['A screening and context tool', 'A standalone entry signal', 'A stop substitute', 'Not used'], 0, '', ''],
    ['Mã ở góc Cải thiện nhưng đuôi chỉ xuống dưới:', 'A symbol in Improving with its tail pointing down:', ['Đang mất đà cải thiện — có thể quay về Tụt hậu', 'Sắp vào Dẫn đầu chắc chắn', 'Mạnh nhất', 'Không ý nghĩa'], ['Is losing improvement momentum — may return to Lagging', 'Will surely enter Leading', 'Is strongest', 'Means nothing'], 0, '', ''],
    ['Khi mọi ngành đều ở Tụt hậu so với VNINDEX, có thể do:', 'If all sectors are Lagging versus VNINDEX, it may be because:', ['Chỉ số bị kéo bởi vài mã vốn hoá lớn ngoài các ngành đã chọn', 'Lỗi chắc chắn', 'Thị trường cân bằng', 'Không có lý do'], ['A few mega-caps outside the chosen sectors drive the index', 'A sure error', 'A balanced market', 'No reason'], 0, '', ''],
    ['Khung tuần trong đồ thị xoay vòng phù hợp cho:', 'The weekly rotation chart suits:', ['Bối cảnh và phân bổ trung hạn', 'Lướt sóng trong phiên', 'Không gì', 'Tính phí'], ['Context and medium-term allocation', 'Intraday scalping', 'Nothing', 'Fees'], 0, '', ''],
    ['Khung ngày phù hợp cho:', 'The daily rotation chart suits:', ['Tinh chỉnh thời điểm', 'Phân bổ dài hạn nhiều năm', 'Không gì', 'Kế toán'], ['Fine-tuning timing', 'Multi-year allocation', 'Nothing', 'Accounting'], 0, '', ''],
    ['Đồ thị xoay vòng là sự mở rộng của khái niệm nào từ Level 1–2?', 'The rotation chart extends which Level 1–2 concept?', ['Sức mạnh tương đối và luân chuyển ngành', 'Nến Nhật', 'Fibonacci', 'Điểm xoay'], ['Relative strength and sector rotation', 'Candlesticks', 'Fibonacci', 'Pivot points'], 0, '', ''],
    ['Mã đi từ Dẫn đầu sang Suy yếu thường là lúc:', 'Moving from Leading to Weakening is often when:', ['Cân nhắc chốt lời một phần/chặt dừng', 'Mua thêm mạnh', 'Không làm gì', 'Bán khống ngay'], ['Consider partial profits/tighter stops', 'Buy heavily', 'Do nothing', 'Short immediately'], 0, '', ''],
    ['Trong chu trình, góc thường đến ngay sau Tụt hậu:', 'In the cycle, the quadrant that usually follows Lagging:', ['Cải thiện', 'Dẫn đầu', 'Suy yếu', 'Không có'], ['Improving', 'Leading', 'Weakening', 'None'], 0, '', ''],
    ['Cách tính trong demo: xu hướng RS = RS / trung bình 10 kỳ của RS × 100. Giá trị 103 nghĩa là:', 'In the demo, RS trend = RS / its 10-bar average × 100. A value of 103 means:', ['RS cao hơn trung bình gần đây 3%', 'Giá tăng 3%', 'RSI = 103', 'Không gì'], ['RS is 3% above its recent average', 'Price up 3%', 'RSI = 103', 'Nothing'], 0, '', ''],
    ['Rủi ro khi dùng chuẩn không phù hợp (ví dụ so cổ phiếu Việt Nam với chỉ số Mỹ):', 'Risk of an unsuitable benchmark (e.g. Vietnamese stocks vs a US index):', ['Kết quả phản ánh tỷ giá và yếu tố quốc gia hơn là sức mạnh tương đối thực', 'Không rủi ro', 'Chính xác hơn', 'Luôn tốt'], ['Output reflects FX and country factors rather than true RS', 'No risk', 'More accurate', 'Always good'], 0, '', ''],
    ['Bài học chính về trực quan hoá sức mạnh tương đối:', 'Key lesson on visualising RS:', ['Thấy nhanh bức tranh luân chuyển, nhưng vẫn cần xu hướng tuyệt đối, tín hiệu giá và quản lý rủi ro', 'Thay thế mọi phân tích khác', 'Không có giá trị', 'Dự báo chính xác'], ['A fast rotation overview that still needs absolute trend, price signals and risk control', 'Replaces all analysis', 'Worthless', 'Exact forecasts'], 0, '', '']
  ]);
})(window.LLW);
