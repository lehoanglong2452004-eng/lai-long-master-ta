// © 2026 Lai Long Master TA. Bảo lưu mọi quyền. Không sao chép, chỉnh sửa hay dùng lại khi chưa được phép.
/* Narrative generator: turns engine output into a Wyckoff "story" (vi/en) */
(function (L) {
  'use strict';
  const W = L.wy, V = L.vsa, I = L.ind;
  const N = L.narr = {};
  const P = p => L.fmtP(p);
  const X = x => L.fmtX(x);
  const tm = (r, i) => L.fmtTime(r.bars[i].t, r.tf);
  const b = s => '<b>' + s + '</b>';

  N.biasLabel = function (bias) {
    if (bias >= 0.45) return { txt: L.T('Tăng mạnh', 'Strongly bullish'), cls: 'up' };
    if (bias >= 0.15) return { txt: L.T('Nghiêng tăng', 'Leaning bullish'), cls: 'up' };
    if (bias <= -0.45) return { txt: L.T('Giảm mạnh', 'Strongly bearish'), cls: 'down' };
    if (bias <= -0.15) return { txt: L.T('Nghiêng giảm', 'Leaning bearish'), cls: 'down' };
    return { txt: L.T('Trung tính', 'Neutral'), cls: 'flat' };
  };
  N.trendLabel = function (d) {
    return ({ 2: L.T('Tăng mạnh', 'Strong up'), 1: L.T('Tăng', 'Up'), 0: L.T('Đi ngang', 'Sideways'), '-1': L.T('Giảm', 'Down'), '-2': L.T('Giảm mạnh', 'Strong down') })[d];
  };
  N.phaseLabel = function (r) {
    if (!r.phase) return '—';
    const dir = r.phaseDir > 0 ? ' ↑' : r.phaseDir < 0 ? ' ↓' : '';
    return r.phase + dir;
  };

  /* ---------- event sentences ---------- */
  function eventSentence(r, e) {
    const isL = r.tr.type === 'L';
    const t = tm(r, e.i), rv = X(e.relVol);
    switch (e.code) {
      case 'PS': return L.T(`${t}: ${b('PS')} tại ${P(e.price)} — khối lượng ${rv} trung bình. Lực mua lớn đầu tiên xuất hiện, xu hướng giảm bắt đầu chậm lại nhưng chưa dừng.`,
        `${t}: ${b('PS')} at ${P(e.price)} — volume ${rv} average. First substantial buying appears; the decline slows but has not stopped.`);
      case 'PSY': return L.T(`${t}: ${b('PSY')} tại ${P(e.price)} — khối lượng ${rv}. Tiền lớn bắt đầu bán ra, đà tăng chậm lại.`,
        `${t}: ${b('PSY')} at ${P(e.price)} — volume ${rv}. Large interests begin to sell; the advance slows.`);
      case 'SC': return L.T(`${t}: ${b('SC – Cao trào bán')} tại ${P(e.price)}, khối lượng ${rv} trung bình${e.relVol < 1.5 ? ' (không quá lớn — điểm dừng chưa thật dứt khoát)' : ''}. Cung hoảng loạn được tiền lớn hấp thụ; đáy SC trở thành hỗ trợ của TR.`,
        `${t}: ${b('SC – Selling Climax')} at ${P(e.price)}, volume ${rv} average${e.relVol < 1.5 ? ' (not climactic — the stop is less decisive)' : ''}. Panic supply absorbed by strong hands; the SC low becomes TR support.`);
      case 'BC': return L.T(`${t}: ${b('BC – Cao trào mua/điểm dừng tăng')} tại ${P(e.price)}, khối lượng ${rv}${e.relVol < 1.5 ? ' (không quá lớn)' : ''}. Đám đông mua đuổi trong khi tiền lớn bán ra; đỉnh BC trở thành kháng cự TR.`,
        `${t}: ${b('BC – Buying Climax/stop')} at ${P(e.price)}, volume ${rv}${e.relVol < 1.5 ? ' (not climactic)' : ''}. The public buys while large interests sell; the BC high becomes TR resistance.`);
      case 'AR': return isL
        ? L.T(`${t}: ${b('AR')} hồi lên ${P(e.price)}. Áp lực bán cạn kiệt, lệnh mua bù và cầu bắt đáy đẩy giá — đỉnh AR xác định ${b('kháng cự TR')}.`,
          `${t}: ${b('AR')} rallies to ${P(e.price)}. Selling exhausted, short covering and bargain demand lift price — the AR high defines ${b('TR resistance')}.`)
        : L.T(`${t}: ${b('AR')} giảm về ${P(e.price)}. Cầu suy yếu sau cao trào — đáy AR xác định ${b('hỗ trợ TR')} (Ice).`,
          `${t}: ${b('AR')} drops to ${P(e.price)}. Demand fades after the climax — the AR low defines ${b('TR support')} (Ice).`);
      case 'ST': {
        const q = e.volRatio < 0.7 ? L.T('khối lượng thấp hơn hẳn cao trào → áp lực đã cạn, điểm dừng được xác nhận', 'volume well below the climax → pressure exhausted, the stop is confirmed')
          : L.T('khối lượng vẫn còn cao → cần thêm thời gian hấp thụ', 'volume still heavy → more absorption needed');
        return L.T(`${t}: ${b('ST')} quay lại kiểm tra vùng cao trào tại ${P(e.price)}, khối lượng ≈ ${Math.round(e.volRatio * 100)}% cao trào: ${q}. Pha A hoàn tất.`,
          `${t}: ${b('ST')} revisits the climax area at ${P(e.price)}, volume ≈ ${Math.round(e.volRatio * 100)}% of the climax: ${q}. Phase A complete.`);
      }
      case 'STB': return L.T(`${t}: ${b('ST trong Pha B')} xuống ${P(e.price)} (thủng nhẹ hỗ trợ rồi hồi), khối lượng ${rv}. Tiền lớn tiếp tục kiểm tra và gom cung.`,
        `${t}: ${b('ST in Phase B')} to ${P(e.price)} (slight break of support then recovery), volume ${rv}. Strong hands keep testing and absorbing supply.`);
      case 'UA': return L.T(`${t}: ${b('UA')} vượt nhẹ kháng cự lên ${P(e.price)} rồi quay lại TR — phép thử cung ở biên trên trong Pha B.`,
        `${t}: ${b('UA')} pokes above resistance to ${P(e.price)} then returns — a Phase B probe of supply at the top.`);
      case 'UT': return L.T(`${t}: ${b('UT')} vượt đỉnh lên ${P(e.price)} rồi thất bại, khối lượng ${rv}: cung chờ sẵn ở vùng cao.`,
        `${t}: ${b('UT')} above the highs to ${P(e.price)} then fails, volume ${rv}: supply is waiting overhead.`);
      case 'SOWB': return L.T(`${t}: ${b('mSOW')} trong Pha B — thủng hỗ trợ xuống ${P(e.price)} rồi hồi: cung bắt đầu lộ diện.`,
        `${t}: ${b('mSOW')} in Phase B — dips below support to ${P(e.price)} then recovers: supply begins to show.`);
      case 'SPRING': {
        const ty = { 1: L.T('#1 (khối lượng lớn, xuyên sâu — thực chất là Shakeout/rũ bỏ mạnh, cần Test nhiều lần)', '#1 (heavy volume, deep — a terminal shakeout that needs several tests)'),
          2: L.T('#2 (khối lượng vừa — cần một Test khối lượng thấp)', '#2 (moderate volume — needs a low-volume test)'),
          3: L.T('#3 (khối lượng thấp, xuyên nông — cung đã cạn, có thể mua ngay)', '#3 (low volume, shallow — supply exhausted, a buy on its own)') }[e.springType];
        return L.T(`${t}: ${b('SPRING')} thủng hỗ trợ xuống ${P(e.price)} rồi đóng cửa trở lại TR — loại ${ty}. Đây là phép thử cuối (Pha C) xem còn cung hay không.`,
          `${t}: ${b('SPRING')} breaks support to ${P(e.price)} then closes back inside — type ${ty}. This is the final Phase C test for remaining supply.`);
      }
      case 'UTAD': return L.T(`${t}: ${b('UTAD')} vượt kháng cự lên ${P(e.price)} rồi đóng cửa quay lại TR, khối lượng ${rv}. Bẫy mua cuối cùng (Pha C) — tiền lớn phân phối cho người mua phá vỡ.`,
        `${t}: ${b('UTAD')} breaks resistance to ${P(e.price)} then closes back inside, volume ${rv}. The final bull trap (Phase C) — large interests distribute to breakout buyers.`);
      case 'TESTS': return L.T(`${t}: ${b('Test')} của Spring tại ${P(e.price)} (đáy cao hơn Spring), khối lượng ≈ ${Math.round(e.volRatio * 100)}% Spring → ${e.volRatio < 0.8 ? 'Test thành công, cung cạn' : 'khối lượng còn cao, cần test lại'}.`,
        `${t}: ${b('Test')} of the Spring at ${P(e.price)} (higher low), volume ≈ ${Math.round(e.volRatio * 100)}% of the Spring → ${e.volRatio < 0.8 ? 'successful test, supply exhausted' : 'volume still high, another test needed'}.`);
      case 'TESTU': return L.T(`${t}: ${b('Test')} của UTAD tại ${P(e.price)} (đỉnh thấp hơn), khối lượng ≈ ${Math.round(e.volRatio * 100)}% UTAD → ${e.volRatio < 0.8 ? 'cầu cạn kiệt' : 'còn tranh chấp'}.`,
        `${t}: ${b('Test')} of the UTAD at ${P(e.price)} (lower high), volume ≈ ${Math.round(e.volRatio * 100)}% of the UTAD → ${e.volRatio < 0.8 ? 'demand exhausted' : 'still contested'}.`);
      case 'MSOS': return L.T(`${t}: ${b('mSOS')} — nhịp tăng lên ${P(e.price)} chạm nửa trên TR: cầu bắt đầu kiểm soát (Pha D trong TR).`,
        `${t}: ${b('mSOS')} — a rally to ${P(e.price)} into the upper TR: demand takes control (Phase D within the TR).`);
      case 'MSOW': return L.T(`${t}: ${b('mSOW')} — nhịp giảm về ${P(e.price)} chạm nửa dưới TR: cung bắt đầu kiểm soát.`,
        `${t}: ${b('mSOW')} — a drop to ${P(e.price)} into the lower TR: supply takes control.`);
      case 'SOS': return L.T(`${t}: ${b(e.jac ? 'SOS / JAC' : 'SOS')} — đóng cửa ${P(e.price)} vượt kháng cự TR${e.jac ? ' với biên độ rộng, khối lượng lớn ("nhảy qua con lạch")' : ''}${e.failed ? '. ⚠ Sau đó giá quay lại sâu trong TR — SOS thất bại' : ''}.`,
        `${t}: ${b(e.jac ? 'SOS / JAC' : 'SOS')} — closes at ${P(e.price)} above TR resistance${e.jac ? ' on wide spread and heavy volume ("jump across the creek")' : ''}${e.failed ? '. ⚠ Price later fell deep back into the TR — failed SOS' : ''}.`);
      case 'SOW': return L.T(`${t}: ${b('SOW')} — đóng cửa ${P(e.price)} thủng hỗ trợ TR (phá Ice)${e.failed ? '. ⚠ Sau đó giá quay lại sâu trong TR — SOW thất bại' : ''}.`,
        `${t}: ${b('SOW')} — closes at ${P(e.price)} below TR support (Ice break)${e.failed ? '. ⚠ Price later rose deep back into the TR — failed SOW' : ''}.`);
      case 'LPS': return L.T(`${t}: ${b('LPS')} tại ${P(e.price)} — đáy cao hơn, khối lượng ${rv}: cung không còn đẩy giá xuống được.`,
        `${t}: ${b('LPS')} at ${P(e.price)} — a higher low on ${rv} volume: supply can no longer push price down.`);
      case 'BU': return L.T(`${t}: ${b('BU/LPS')} — giá lùi về ${P(e.price)} quanh mép Creek, khối lượng ${rv}. Kiểm tra lại vùng phá vỡ — điểm vào lệnh kinh điển.`,
        `${t}: ${b('BU/LPS')} — price backs up to ${P(e.price)} at the edge of the Creek on ${rv} volume. A retest of the breakout — the classic entry.`);
      case 'LPSY': return L.T(`${t}: ${b('LPSY')} tại ${P(e.price)} — nhịp hồi yếu, khối lượng ${rv}: cầu cạn, điểm bán cuối cùng.`,
        `${t}: ${b('LPSY')} at ${P(e.price)} — a weak rally on ${rv} volume: demand exhausted, the last selling point.`);
      case 'MARKUP': return L.T(`${t}: ${b('Pha E bắt đầu')} — giá rời TR đi lên và giữ vững bên trên. Nguyên nhân đã chuyển thành hiệu ứng.`,
        `${t}: ${b('Phase E begins')} — price leaves the TR upward and holds. The cause is turning into effect.`);
      case 'MARKDOWN': return L.T(`${t}: ${b('Pha E bắt đầu')} — giá rời TR đi xuống và không hồi lại được.`,
        `${t}: ${b('Phase E begins')} — price leaves the TR downward and cannot recover.`);
      default: return '';
    }
  }

  /* ---------- effort vs result on waves ---------- */
  function legReading(r) {
    const legs = r.legs.filter(l => !l.provisional || l.bars >= 2);
    const ups = legs.filter(l => l.dir > 0), dns = legs.filter(l => l.dir < 0);
    const out = [];
    const cmp = (cur, prev, dir) => {
      if (!cur || !prev) return null;
      const e = cur.volPerBar / Math.max(1e-9, prev.volPerBar), res = cur.moveAtr / Math.max(1e-9, prev.moveAtr);
      const E = e > 1.15 ? 1 : e < 0.85 ? -1 : 0, R = res > 1.15 ? 1 : res < 0.85 ? -1 : 0;
      let txt, sign = 0;
      const easier = (E === 0 && R > 0) || (E < 0 && R === 0), harder = (E === 0 && R < 0) || (E > 0 && R === 0);
      if (easier || harder) {
        if (dir > 0) {
          txt = easier ? L.T('đi xa hơn so với nỗ lực bỏ ra → giá tăng dễ dàng hơn (tích cực)', 'more distance for the effort spent → easier advance (positive)')
            : L.T('nỗ lực không tạo thêm kết quả → cung đang xuất hiện chặn đà tăng (cảnh báo)', 'effort is not producing more result → supply is appearing (warning)');
          sign = easier ? 1 : -1;
        } else {
          txt = easier ? L.T('giá giảm dễ dàng hơn so với khối lượng → thiếu cầu (tiêu cực)', 'price falls more easily for the volume → lack of demand (negative)')
            : L.T('lực bán không đẩy giá xuống thêm → cầu đang hấp thụ (tích cực)', 'selling no longer pushes price lower → demand absorbing (positive)');
          sign = easier ? -1 : 1;
        }
        return { e, res, txt, sign };
      }
      if (dir > 0) {
        if (E > 0 && R < 0) { txt = L.T('nỗ lực tăng LỚN hơn nhưng kết quả NHỎ hơn → cung đang chặn đà tăng (cảnh báo)', 'MORE effort but LESS result → supply is capping the rally (warning)'); sign = -1; }
        else if (E < 0 && R > 0) { txt = L.T('nỗ lực ít hơn nhưng đi xa hơn → giá tăng dễ dàng, nguồn cung mỏng (tích cực)', 'LESS effort, MORE result → ease of movement up, thin supply (positive)'); sign = 1; }
        else if (E > 0 && R > 0) { txt = L.T('nỗ lực và kết quả cùng tăng → cầu khoẻ, hài hoà', 'effort and result both rise → healthy demand'); sign = 1; }
        else if (E < 0 && R < 0) { txt = L.T('nỗ lực và kết quả cùng giảm → lực cầu đang suy yếu', 'effort and result both shrink → demand is fading'); sign = -1; }
        else txt = L.T('tương đương nhịp trước', 'similar to the prior rally');
      } else {
        if (E > 0 && R < 0) { txt = L.T('nỗ lực bán LỚN hơn nhưng giảm ÍT hơn → cầu đang hấp thụ cung (tích cực)', 'MORE selling effort but LESS result → demand absorbing supply (positive)'); sign = 1; }
        else if (E < 0 && R > 0) { txt = L.T('khối lượng ít mà giảm sâu hơn → giá rơi dễ dàng, thiếu cầu (tiêu cực)', 'LESS volume yet a deeper drop → ease of movement down, lack of demand (negative)'); sign = -1; }
        else if (E > 0 && R > 0) { txt = L.T('nỗ lực và kết quả giảm cùng tăng → cung mạnh', 'selling effort and result both rise → strong supply'); sign = -1; }
        else if (E < 0 && R < 0) { txt = L.T('khối lượng và biên độ giảm cùng co lại → cung đang cạn', 'volume and drop both contract → supply drying up'); sign = 1; }
        else txt = L.T('tương đương nhịp trước', 'similar to the prior decline');
      }
      return { e, res, txt, sign };
    };
    const u = cmp(ups[ups.length - 1], ups[ups.length - 2], 1);
    const d = cmp(dns[dns.length - 1], dns[dns.length - 2], -1);
    if (u) out.push(L.T(`Nhịp TĂNG gần nhất so với nhịp tăng trước: khối lượng/nến ${X(u.e)}, quãng đường ${X(u.res)} → ${u.txt}.`,
      `Latest RALLY vs the previous one: volume/bar ${X(u.e)}, distance ${X(u.res)} → ${u.txt}.`));
    if (d) out.push(L.T(`Nhịp GIẢM gần nhất so với nhịp giảm trước: khối lượng/nến ${X(d.e)}, quãng đường ${X(d.res)} → ${d.txt}.`,
      `Latest DECLINE vs the previous one: volume/bar ${X(d.e)}, distance ${X(d.res)} → ${d.txt}.`));
    const lu = ups[ups.length - 1], ld = dns[dns.length - 1];
    if (lu && ld) {
      const q = lu.volPerBar / Math.max(1e-9, ld.volPerBar);
      out.push(L.T(`Khối lượng/nến của nhịp tăng gần nhất bằng ${X(q)} nhịp giảm gần nhất → ${q > 1.2 ? 'cầu áp đảo cung' : q < 0.8 ? 'cung áp đảo cầu' : 'cung cầu cân bằng'}.`,
        `Volume/bar on the latest rally is ${X(q)} that of the latest decline → ${q > 1.2 ? 'demand outweighs supply' : q < 0.8 ? 'supply outweighs demand' : 'balanced'}.`));
    }
    return { lines: out, up: u, down: d };
  }

  function supplyDemand(r) {
    const end = r.lastIdx, start = Math.max(0, end - 19);
    let upV = 0, dnV = 0, cp = 0, cnt = 0, bull = 0, bear = 0;
    for (let j = start; j <= end; j++) {
      const x = r.bars[j];
      if (x.dir > 0) upV += x.v; else if (x.dir < 0) dnV += x.v;
      cp += x.closePos; cnt++;
      for (const c of r.sig[j]) { if (V.SIGNALS[c].bias > 0) bull++; else bear++; }
    }
    const ratio = upV / Math.max(1e-9, dnV), acp = cp / cnt;
    const lines = [];
    if (!r.noVolume) lines.push(L.T(`20 nến gần nhất: tổng khối lượng nến tăng bằng ${X(ratio)} nến giảm → ${ratio > 1.25 ? 'cầu chiếm ưu thế' : ratio < 0.8 ? 'cung chiếm ưu thế' : 'cung–cầu giằng co'}.`,
      `Last 20 bars: up-bar volume is ${X(ratio)} down-bar volume → ${ratio > 1.25 ? 'demand dominates' : ratio < 0.8 ? 'supply dominates' : 'supply and demand are balanced'}.`));
    lines.push(L.T(`Vị trí đóng cửa trung bình ${Math.round(acp * 100)}% thân nến → ${acp > 0.58 ? 'người mua thắng các phiên' : acp < 0.42 ? 'người bán thắng các phiên' : 'không bên nào áp đảo'}.`,
      `Average close location ${Math.round(acp * 100)}% of the bar range → ${acp > 0.58 ? 'buyers win the sessions' : acp < 0.42 ? 'sellers win the sessions' : 'neither side dominates'}.`));
    if (!r.noVolume) lines.push(L.T(`Tín hiệu VSA trong 20 nến: ${bull} tín hiệu cầu / ${bear} tín hiệu cung.`, `VSA signals in 20 bars: ${bull} demand / ${bear} supply.`));
    if (r.posInRange != null && r.levels) {
      const pos = r.posInRange;
      lines.push(L.T(`Giá đang ở ${Math.round(pos * 100)}% biên TR (${P(r.levels.sup)} → ${P(r.levels.res)}) — ${pos > 1 ? 'trên kháng cự' : pos < 0 ? 'dưới hỗ trợ' : pos > 0.66 ? 'vùng cung (biên trên)' : pos < 0.33 ? 'vùng cầu (biên dưới)' : 'giữa TR — vùng "không giao dịch"'}.`,
        `Price sits at ${Math.round(pos * 100)}% of the TR (${P(r.levels.sup)} → ${P(r.levels.res)}) — ${pos > 1 ? 'above resistance' : pos < 0 ? 'below support' : pos > 0.66 ? 'supply zone (upper edge)' : pos < 0.33 ? 'demand zone (lower edge)' : 'mid-range — the "no trade" zone'}.`));
    }
    return { lines, ratio, acp, bull, bear };
  }

  function lastBarReading(r) {
    const x = r.lastClosed, d = V.describeBar(x);
    const lines = [];
    const dirTxt = x.dir > 0 ? L.T('tăng', 'up') : x.dir < 0 ? L.T('giảm', 'down') : L.T('đứng giá', 'unchanged');
    lines.push(L.T(`Nến đã đóng gần nhất (${tm(r, r.lastIdx)}): nến ${dirTxt}, biên độ ${d.sp} (${X(x.relSpread)} TB), đóng cửa ${d.cl}, khối lượng ${d.vo} (${X(x.relVol)} TB).`,
      `Last closed bar (${tm(r, r.lastIdx)}): ${dirTxt} bar, ${d.sp} spread (${X(x.relSpread)} avg), closing ${d.cl}, ${d.vo} volume (${X(x.relVol)} avg).`));
    const sigs = r.sig[r.lastIdx];
    if (sigs.length) sigs.forEach(c => lines.push(b(V.name(c)) + ': ' + V.meaning(c)));
    else {
      let m;
      if (x.relVol >= 1.4 && x.relSpread <= 0.8) m = L.T('Khối lượng cao nhưng biên độ hẹp: nỗ lực không tạo kết quả — có lực đối ứng đang hấp thụ.', 'High volume but narrow spread: effort without result — the other side is absorbing.');
      else if (x.relVol <= 0.75 && x.relSpread <= 0.8) m = L.T('Biên độ hẹp, khối lượng thấp: thị trường nghỉ, thiếu sự tham gia của tiền lớn.', 'Narrow spread, low volume: a resting market with little professional participation.');
      else if (x.relVol >= 1.3 && x.relSpread >= 1.2) m = x.closePos >= 0.5 ? L.T('Nỗ lực lớn và kết quả tương xứng, đóng cửa cao: cầu thật.', 'Large effort with matching result and a high close: real demand.') : L.T('Nỗ lực lớn và kết quả tương xứng, đóng cửa thấp: cung thật.', 'Large effort with matching result and a low close: real supply.');
      else m = L.T('Không có tín hiệu VSA đặc biệt — nến bình thường trong bối cảnh hiện tại.', 'No notable VSA signal — an ordinary bar in this context.');
      lines.push(m);
    }
    if (r.last.live) lines.push(L.T(`<i>Nến hiện tại (${tm(r, r.n - 1)}) đang chạy — chỉ đánh giá khi đóng nến.</i>`, `<i>The current bar (${tm(r, r.n - 1)}) is still forming — judge it at the close.</i>`));
    if (r.noVolume) lines.push(L.T('⚠ Dữ liệu không có khối lượng — các luận điểm VSA bị tắt.', '⚠ The data has no volume — VSA readings are disabled.'));
    return lines;
  }

  function watchList(r) {
    const lv = r.levels, out = [];
    if (!r.tr) {
      out.push(L.T('Theo dõi cao trào (khối lượng cực lớn, biên độ rộng) để nhận diện Pha A của cấu trúc mới.', 'Watch for a climax (ultra volume, wide spread) marking Phase A of a new structure.'));
      return out;
    }
    switch (r.phase) {
      case 'A': out.push(L.T('Chờ ST: giá quay lại vùng cao trào với khối lượng và biên độ giảm rõ rệt.', 'Wait for the ST: a return to the climax area on clearly lower volume and spread.')); break;
      case 'B': out.push(L.T('Pha B có thể kéo dài. Quan sát khối lượng ở hai biên: cạn dần ở biên dưới = tích lũy; cạn dần ở biên trên = phân phối.', 'Phase B can last long. Watch volume at both edges: drying at the bottom = accumulation; drying at the top = distribution.'));
        out.push(L.T(`Sự kiện Pha C sắp tới: Spring dưới ${P(lv.sup)} hoặc UTAD trên ${P(lv.res)}.`, `Upcoming Phase C event: a Spring below ${P(lv.sup)} or a UTAD above ${P(lv.res)}.`)); break;
      case 'C': out.push(r.phaseDir > 0 ? L.T('Chờ Test của Spring khối lượng thấp, sau đó mSOS/SOS với khối lượng tăng.', 'Wait for a low-volume Spring test, then mSOS/SOS on expanding volume.') : L.T('Chờ Test của UTAD (đỉnh thấp hơn, khối lượng thấp), sau đó mSOW.', 'Wait for the UTAD test (lower high, low volume), then mSOW.')); break;
      case 'D': out.push(r.phaseDir > 0 ? L.T(`Chờ BU/LPS giữ trên ${P(lv.res - 0.15 * lv.h)} với khối lượng thấp; khối lượng phải tăng khi giá đi lên.`, `Wait for a BU/LPS holding above ${P(lv.res - 0.15 * lv.h)} on low volume; volume must expand on the advance.`) : L.T(`Chờ LPSY không vượt ${P(lv.sup + 0.15 * lv.h)}; khối lượng tăng khi giá giảm.`, `Wait for an LPSY failing below ${P(lv.sup + 0.15 * lv.h)}; volume expands on declines.`)); break;
      case 'E': out.push(r.phaseDir > 0 ? L.T('Trong Markup: theo dõi tái tích lũy (TR nhỏ) hoặc dấu hiệu PSY/BC báo kết thúc xu hướng.', 'In Markup: watch for re-accumulation (small TRs) or PSY/BC signalling the end of the trend.') : L.T('Trong Markdown: theo dõi tái phân phối hoặc PS/SC báo kết thúc xu hướng giảm.', 'In Markdown: watch for re-distribution or PS/SC signalling the end of the decline.')); break;
    }
    if (r.freshClimax) out.push(L.T(`⚠ Vừa xuất hiện ${V.name(r.freshClimax.code)} lúc ${tm(r, r.freshClimax.i)} — có thể là khởi đầu của một Pha A mới.`, `⚠ A fresh ${V.name(r.freshClimax.code)} at ${tm(r, r.freshClimax.i)} — possibly the start of a new Phase A.`));
    if (r.info.pendingDown) out.push(L.T(`⚠ Giá đang nằm dưới hỗ trợ ${P(lv.sup)}: nếu đóng cửa trở lại trong TR trong 1–3 nến → Spring; nếu không → SOW/breakdown.`, `⚠ Price is below support ${P(lv.sup)}: a close back inside within 1–3 bars → Spring; otherwise → SOW/breakdown.`));
    if (r.info.pendingUp) out.push(L.T(`⚠ Giá đang nằm trên kháng cự ${P(lv.res)}: quay lại TR trong 1–3 nến → UTAD/UA; giữ được → SOS/JAC.`, `⚠ Price is above resistance ${P(lv.res)}: back inside within 1–3 bars → UTAD/UA; holding → SOS/JAC.`));
    return out;
  }

  function phaseText(r) {
    const tr = r.tr, out = [];
    if (!tr) {
      if (r.structure === 'TREND_UP') out.push(L.T('Không tìm thấy Trading Range gần đây: thị trường đang trong xu hướng tăng (Markup) với cấu trúc đỉnh/đáy cao dần.', 'No recent trading range: the market is in an uptrend (Markup) with higher highs and lows.'));
      else if (r.structure === 'TREND_DOWN') out.push(L.T('Không tìm thấy Trading Range gần đây: thị trường đang trong xu hướng giảm (Markdown).', 'No recent trading range: the market is in a downtrend (Markdown).'));
      else out.push(L.T(`Giá đi ngang trong biên hẹp ${P(r.levels.sup)} – ${P(r.levels.res)} nhưng chưa có cao trào/Pha A rõ ràng.`, `Price moves sideways within ${P(r.levels.sup)} – ${P(r.levels.res)} but without a clear climax/Phase A.`));
      return out;
    }
    const ph = W.PHASE[r.phase];
    out.push(L.T(`Cấu trúc: ${b(W.structName(r.structure))}. Pha hiện tại: ${b(L.T(ph.vi, ph.en))}${r.phaseDir ? (r.phaseDir > 0 ? L.T(' — hướng lên', ' — upward') : L.T(' — hướng xuống', ' — downward')) : ''}.`,
      `Structure: ${b(W.structName(r.structure))}. Current phase: ${b(L.T(ph.vi, ph.en))}${r.phaseDir ? (r.phaseDir > 0 ? ' — upward' : ' — downward') : ''}.`));
    out.push(L.T(`Trading Range: hỗ trợ ${P(tr.bot)} – kháng cự ${P(tr.top)} (cao ${P(tr.h)} ≈ ${(tr.h / r.last.atr).toFixed(1)} ATR), bắt đầu từ ${tm(r, tr.climax.i)} và đã kéo dài ${r.n - 1 - tr.climax.i} nến.`,
      `Trading range: support ${P(tr.bot)} – resistance ${P(tr.top)} (height ${P(tr.h)} ≈ ${(tr.h / r.last.atr).toFixed(1)} ATR), starting ${tm(r, tr.climax.i)}, ${r.n - 1 - tr.climax.i} bars long.`));
    const meaning = {
      A: L.T('Xu hướng cũ vừa bị chặn lại. Chưa nên giao dịch theo hướng mới — cần thời gian xây dựng nguyên nhân.', 'The old trend has just been stopped. Do not trade a new direction yet — a cause must be built.'),
      B: L.T('Tiền lớn đang gom (hoặc phân phối) hàng trong biên. Đây là giai đoạn dài nhất, nhiều bẫy hai đầu; ưu tiên quan sát.', 'Large interests are absorbing (or distributing) inside the range. The longest stage, with traps at both ends; mostly observe.'),
      C: L.T('Phép thử quyết định: tiền lớn kiểm tra cung/cầu còn lại trước khi đẩy giá. Rủi ro thấp nhất cho người vào sớm nếu Test thành công.', 'The decisive test: large interests probe for remaining supply/demand before the move. Lowest-risk entry if the test succeeds.'),
      D: L.T('Bên thắng đã lộ diện; giá di chuyển về phía biên đối diện với khối lượng tương thích. Giai đoạn vào lệnh an toàn tại LPS/LPSY.', 'The winner is revealed; price moves toward the opposite edge with supportive volume. Safer entries at LPS/LPSY.'),
      E: L.T('Giá đã rời TR — nguyên nhân chuyển hoá thành hiệu ứng. Giao dịch theo xu hướng, quản trị lệnh bằng các đáy/đỉnh mới.', 'Price has left the TR — cause turns into effect. Trade with the trend, trail stops behind new swings.')
    }[r.phase];
    out.push(meaning);
    if (r.phase === 'C' && (r.structure === 'TR_L' || r.structure === 'TR_H')) out.push(L.T(
      `⚠ Sự kiện Pha C (${r.phaseDir > 0 ? 'Spring' : 'UTAD'}) chỉ về một hướng nhưng các bằng chứng khác (khối lượng, đáy/đỉnh, VSA) nghiêng hướng ngược lại. Cần Test xác nhận trước khi kết luận tích lũy hay phân phối.`,
      `⚠ The Phase C event (${r.phaseDir > 0 ? 'Spring' : 'UTAD'}) points one way while other evidence (volume, swings, VSA) leans the other. Wait for the test before calling accumulation or distribution.`));
    if (r.schematic2) out.push(L.T('Không có Spring/UTAD rõ ràng → giống <b>Sơ đồ #2</b> (Pha C chỉ là một LPS/LPSY nông hơn).', 'No clear Spring/UTAD → resembles <b>Schematic #2</b> (Phase C is just a shallower LPS/LPSY).'));
    if (r.eExtended) out.push(L.T('Pha E đã kéo dài xa khỏi TR gốc — chú ý dấu hiệu dừng xu hướng (PSY/BC hoặc PS/SC).', 'Phase E has travelled far from the original TR — watch for stopping action (PSY/BC or PS/SC).'));
    return out;
  }

  function contextText(r) {
    const tr = r.tr, out = [];
    out.push(L.T(`Xu hướng theo cấu trúc sóng: ${b(N.trendLabel(r.trend.dir))} (độ dốc 30 nến ≈ ${r.trend.notes.slope.toFixed(1)} ATR; giá ${r.last.c > r.last.sma50 ? 'trên' : 'dưới'} trung bình 50 nến).`,
      `Swing-structure trend: ${b(N.trendLabel(r.trend.dir))} (30-bar slope ≈ ${r.trend.notes.slope.toFixed(1)} ATR; price ${r.last.c > r.last.sma50 ? 'above' : 'below'} the 50-bar average).`));
    if (tr) out.push(tr.type === 'L'
      ? L.T(`Trước TR là một nhịp giảm ≈ ${tr.prior.toFixed(1)} ATR. Câu hỏi Wyckoff: đây là nơi tiền lớn tích lũy, hay chỉ là chỗ nghỉ để tái phân phối rồi giảm tiếp?`, `The TR follows a decline of ≈ ${tr.prior.toFixed(1)} ATR. The Wyckoff question: are large interests accumulating here, or is this a pause before re-distribution?`)
      : L.T(`Trước TR là một nhịp tăng ≈ ${tr.prior.toFixed(1)} ATR. Câu hỏi Wyckoff: đây là phân phối ở đỉnh, hay tái tích lũy để tăng tiếp?`, `The TR follows an advance of ≈ ${tr.prior.toFixed(1)} ATR. The Wyckoff question: distribution at a top, or re-accumulation for another leg up?`));
    if (r.rs) out.push(r.rs);
    return out;
  }

  function causeText(r) {
    const out = [];
    if (!r.tr || !r.pnf) { out.push(L.T('Chưa có Trading Range nên chưa đo được Nguyên nhân. Trong xu hướng, hiệu ứng đang tiêu hao nguyên nhân của TR trước đó.', 'No trading range, so no cause to measure. In a trend, the effect is consuming the cause of a prior TR.')); return out; }
    const p = r.pnf, lv = r.levels;
    out.push(L.T(`Nguyên nhân: TR kéo dài ${r.n - 1 - r.tr.climax.i} nến. Đếm ngang Point & Figure (ô = ${P(p.box)} ≈ ½ ATR, đảo chiều 3 ô) trên ${p.bars} nến: ${b(p.cols + ' cột')} → biên độ dự phóng ≈ ${P(p.proj)}.`,
      `Cause: the TR spans ${r.n - 1 - r.tr.climax.i} bars. Horizontal Point & Figure count (box = ${P(p.box)} ≈ ½ ATR, 3-box reversal) over ${p.bars} bars: ${b(p.cols + ' columns')} → projected move ≈ ${P(p.proj)}.`));
    if (p.small) {
      out.push(L.T(`⚠ Nguyên nhân còn nhỏ: biên độ dự phóng (${P(p.proj)}) mới bằng ${Math.round(p.proj / lv.h * 100)}% chiều cao TR (${P(lv.h)}). TR cần thêm thời gian để tích lũy/phân phối; tạm dùng mục tiêu theo chiều cao TR: tăng ${P(lv.res + lv.h)}, giảm ${P(Math.max(0, lv.sup - lv.h))}.`,
        `⚠ The cause is still small: the projection (${P(p.proj)}) is only ${Math.round(p.proj / lv.h * 100)}% of the TR height (${P(lv.h)}). The TR needs more time; use range-height objectives for now: up ${P(lv.res + lv.h)}, down ${P(Math.max(0, lv.sup - lv.h))}.`));
      return out;
    }
    const same = (x, y) => Math.abs(x - y) < 1e-9 * Math.max(1, Math.abs(x));
    const upTxt = same(p.bull[0], p.bull[1]) ? P(p.bull[0]) + L.T(' (đo từ đáy TR)', ' (from the TR low)')
      : `${P(p.bull[0])}${L.T(' (đo từ đáy TR) → ', ' (from the TR low) → ')}${P(p.bull[1])}${L.T(' (đo từ đường đếm LPS ', ' (from the LPS count line ')}${P(p.lineBull)})`;
    const dnTxt = same(p.bear[0], p.bear[1]) ? P(p.bear[0]) + L.T(' (đo từ đỉnh TR)', ' (from the TR high)')
      : `${P(p.bear[0])}${L.T(' (đo từ đỉnh TR) → ', ' (from the TR high) → ')}${P(p.bear[1])}${L.T(' (đo từ đường đếm LPSY ', ' (from the LPSY count line ')}${P(p.lineBear)})`;
    out.push(L.T(`Mục tiêu nếu TĂNG: ${upTxt}. Đo theo chiều cao TR: ${P(lv.res + lv.h)}.`, `Upside objective: ${upTxt}. Range-height projection: ${P(lv.res + lv.h)}.`));
    out.push(L.T(`Mục tiêu nếu GIẢM: ${dnTxt}. Đo theo chiều cao TR: ${P(Math.max(0, lv.sup - lv.h))}.`, `Downside objective: ${dnTxt}. Range-height projection: ${P(Math.max(0, lv.sup - lv.h))}.`));
    out.push(L.T('<i>Mục tiêu P&F là vùng tham khảo về "độ lớn của hiệu ứng", không phải điểm chốt lời cứng.</i>', '<i>P&F objectives describe the likely size of the effect, not exact exit points.</i>'));
    return out;
  }

  function evidenceText(r) {
    const map = {
      spring: L.T('Spring', 'Spring'), utad: 'UTAD', sos: 'SOS', sosFailed: L.T('SOS thất bại', 'failed SOS'), sow: 'SOW', sowFailed: L.T('SOW thất bại', 'failed SOW'),
      msos: 'mSOS', msow: 'mSOW', lps: 'LPS', lpsy: 'LPSY', exitUp: L.T('Rời TR đi lên', 'Exit up'), exitDown: L.T('Rời TR đi xuống', 'Exit down'),
      stLowVol: L.T('ST khối lượng thấp', 'Low-volume ST'), stLowVolH: L.T('ST khối lượng thấp (đỉnh)', 'Low-volume ST (top)'),
      legVol: L.T('KL nhịp tăng/giảm trong TR', 'TR rally/decline volume'), higherLows: L.T('Đáy nâng dần', 'Higher lows'), lowerLows: L.T('Đáy hạ dần', 'Lower lows'),
      lowerHighs: L.T('Đỉnh hạ dần', 'Lower highs'), higherHighs: L.T('Đỉnh nâng dần', 'Higher highs'), position: L.T('Vị trí giá trong TR', 'Position in TR'),
      vsa: L.T('Tín hiệu VSA 15 nến', 'VSA last 15 bars'), trend: L.T('Cấu trúc xu hướng', 'Trend structure'), slope: L.T('Độ dốc giá', 'Price slope')
    };
    return r.evidence.filter(e => Math.abs(e.val) >= 0.01).map(e => `<span class="chip ${e.val > 0 ? 'up' : 'down'}">${map[e.code] || e.code} ${e.val > 0 ? '+' : ''}${Math.round(e.val * 100)}</span>`).join(' ');
  }

  /** Full single-timeframe narrative as HTML. */
  N.render = function (r) {
    if (r.error) return `<p>${L.T('Không đủ dữ liệu (cần tối thiểu 60 nến).', 'Not enough data (at least 60 bars needed).')}</p>`;
    const sec = (title, lines, cls) => `<section class="nsec ${cls || ''}"><h3>${title}</h3>${Array.isArray(lines) ? '<ul>' + lines.filter(Boolean).map(x => '<li>' + x + '</li>').join('') + '</ul>' : lines}</section>`;
    const story = r.tr ? r.events.map(e => eventSentence(r, e)).filter(Boolean) : [L.T('Chưa có chuỗi sự kiện Wyckoff trong vùng dữ liệu gần đây.', 'No Wyckoff event sequence in the recent data.')];
    const lr = legReading(r), sd = supplyDemand(r);
    const html = [];
    html.push(sec(L.T('1. Bối cảnh', '1. Background'), contextText(r)));
    html.push(sec(L.T('2. Câu chuyện trước đó — chuỗi sự kiện', '2. The story so far — event sequence'), story, 'story'));
    html.push(sec(L.T('3. Pha & cấu trúc hiện tại', '3. Current phase & structure'), phaseText(r)));
    html.push(sec(L.T('4. Luật Cung – Cầu: giá hiện tại nói gì?', '4. Law of Supply & Demand: what is price saying?'), sd.lines));
    html.push(sec(L.T('5. Luật Nỗ lực – Kết quả', '5. Law of Effort vs Result'), r.noVolume ? [L.T('Không có dữ liệu khối lượng.', 'No volume data.')] : lr.lines));
    html.push(sec(L.T('6. Luật Nhân – Quả (Cause & Effect)', '6. Law of Cause & Effect'), causeText(r)));
    html.push(sec(L.T('7. Ý nghĩa giá & khối lượng hiện tại (VSA)', '7. Current price & volume (VSA)'), lastBarReading(r)));
    html.push(sec(L.T('8. Cần theo dõi tiếp', '8. What to watch next'), watchList(r)));
    html.push(`<section class="nsec"><h3>${L.T('Bằng chứng tính thiên hướng', 'Evidence behind the bias')}</h3><div class="chips">${evidenceText(r)}</div><p class="muted">${L.T('Điểm dương = nghiêng cầu/tăng, âm = nghiêng cung/giảm. Tổng (giới hạn ±100) = thiên hướng.', 'Positive = demand/bullish, negative = supply/bearish. The capped sum (±100) is the bias.')}</p></section>`);
    return html.join('');
  };

  /** One-line summary for the multi-timeframe table. */
  N.latestEvent = function (r) {
    if (!r.events || !r.events.length) return '—';
    const e = r.events[r.events.length - 1];
    return W.EVT[e.code].s + ' · ' + L.fmtTime(e.t, r.tf);
  };
  N.lastVsa = function (r) {
    if (r.error) return '—';
    const s = r.sig[r.lastIdx];
    return s.length ? s.map(c => V.SIGNALS[c].short).join(', ') : '·';
  };

  /* ---------- multi-timeframe synthesis ---------- */
  N.renderMTF = function (results, symbol) {
    const ok = L.TFS.filter(tf => results[tf] && !results[tf].error);
    if (!ok.length) return '';
    const group = tfs => {
      const xs = tfs.filter(tf => results[tf] && !results[tf].error);
      if (!xs.length) return null;
      let s = 0, w = 0;
      xs.forEach(tf => { s += results[tf].bias * L.TF_WEIGHT[tf]; w += L.TF_WEIGHT[tf]; });
      return { bias: s / w, tfs: xs };
    };
    const H = group(['2W', '1W', '1D']), M = group(['4H', '1H']), S = group(['30m', '15m', '5m', '1m']);
    const lbl = g => g ? N.biasLabel(g.bias).txt + ` (${Math.round(g.bias * 100)})` : '—';
    const lines = [];
    lines.push(L.T(`${b('Khung lớn')} (2W/1W/1D — xác định chu kỳ & hướng chính): ${lbl(H)}.`, `${b('Higher TFs')} (2W/1W/1D — cycle and main direction): ${lbl(H)}.`));
    lines.push(L.T(`${b('Khung trung')} (4H/1H — cấu trúc giao dịch): ${lbl(M)}.`, `${b('Middle TFs')} (4H/1H — the tradable structure): ${lbl(M)}.`));
    lines.push(L.T(`${b('Khung nhỏ')} (30m→1m — điểm vào & kiểm tra): ${lbl(S)}.`, `${b('Lower TFs')} (30m→1m — entry timing and tests): ${lbl(S)}.`));
    const sg = x => x == null ? 0 : x.bias >= 0.15 ? 1 : x.bias <= -0.15 ? -1 : 0;
    const h = sg(H), m = sg(M), s = sg(S);
    let concl;
    if (h && h === m && m === s) concl = h > 0
      ? L.T('Ba tầng khung ĐỒNG THUẬN TĂNG: ưu tiên mua theo LPS/BU ở khung trung, căn điểm vào bằng Spring/Test ở khung nhỏ.', 'All three tiers AGREE BULLISH: favour buying LPS/BU on the middle TFs, timing entries with lower-TF Springs/Tests.')
      : L.T('Ba tầng khung ĐỒNG THUẬN GIẢM: ưu tiên đứng ngoài/bán tại LPSY; không bắt đáy.', 'All three tiers AGREE BEARISH: stay out or sell LPSYs; do not bottom-fish.');
    else if (h > 0 && s < 0) concl = L.T('Khung lớn tăng nhưng khung nhỏ đang giảm: đây thường là nhịp điều chỉnh/kiểm tra trong cấu trúc lớn. Chờ khung nhỏ hình thành tích lũy (SC→ST→Spring) để vào lệnh theo khung lớn.', 'Higher TFs bullish while lower TFs decline: usually a correction/test inside the larger structure. Wait for a lower-TF accumulation (SC→ST→Spring) to enter with the higher trend.');
    else if (h < 0 && s > 0) concl = L.T('Khung lớn giảm nhưng khung nhỏ hồi lên: thường là nhịp hồi kỹ thuật (LPSY ở khung lớn). Không mua đuổi; quan sát phân phối nhỏ ở khung nhỏ.', 'Higher TFs bearish while lower TFs rally: often a technical bounce (an LPSY on the higher TF). Do not chase; watch for small distributions on lower TFs.');
    else if (!h) concl = L.T('Khung lớn trung tính (đang trong TR): giao dịch theo cấu trúc khung trung, khối lượng nhỏ, chốt lời ở biên TR khung lớn.', 'Higher TFs neutral (inside a TR): trade the middle-TF structure with smaller size and take profits at the higher-TF range edges.');
    else concl = L.T('Các khung chưa đồng thuận hoàn toàn: giảm khối lượng, chờ khung trung xác nhận cùng chiều khung lớn.', 'Timeframes are not fully aligned: reduce size and wait for the middle TFs to confirm the higher-TF direction.');
    lines.push(b(L.T('Kết luận: ', 'Conclusion: ')) + concl);

    // nesting: a higher TF phase-C/D event confirmed by a lower TF structure
    const nests = [];
    for (let k = 0; k < ok.length; k++) {
      const hi = results[ok[k]];
      if (!hi.tr || !['C', 'D'].includes(hi.phase)) continue;
      for (let j = k + 1; j < ok.length && j <= k + 3; j++) {
        const lo = results[ok[j]];
        if (!lo.tr) continue;
        if (hi.phaseDir > 0 && lo.phaseDir > 0 && ['D', 'E'].includes(lo.phase))
          nests.push(L.T(`${b(ok[k])} đang ở Pha ${hi.phase}↑ (${hi.info.c ? 'Spring' : 'mSOS'}) và ${b(ok[j])} đã ở Pha ${lo.phase}↑: cấu trúc tích lũy nhỏ đang xác nhận sự kiện của khung lớn.`, `${b(ok[k])} is in Phase ${hi.phase}↑ and ${b(ok[j])} has reached Phase ${lo.phase}↑: a small accumulation is confirming the higher-TF event.`));
        if (hi.phaseDir < 0 && lo.phaseDir < 0 && ['D', 'E'].includes(lo.phase))
          nests.push(L.T(`${b(ok[k])} đang ở Pha ${hi.phase}↓ và ${b(ok[j])} đã ở Pha ${lo.phase}↓: phân phối nhỏ xác nhận UTAD/SOW của khung lớn.`, `${b(ok[k])} is in Phase ${hi.phase}↓ and ${b(ok[j])} has reached Phase ${lo.phase}↓: a small distribution confirms the higher-TF UTAD/SOW.`));
      }
    }
    // where the lower TF sits inside the higher TF range
    const anchor = ['1D', '4H', '1W'].find(tf => ok.includes(tf) && results[tf].tr);
    if (anchor) {
      const a = results[anchor], lv = a.levels, px = a.last.c;
      lines.push(L.T(`Vị trí giá so với TR khung ${anchor} (${P(lv.sup)} – ${P(lv.res)}): ${Math.round(a.posInRange * 100)}%. Mọi cấu trúc khung nhỏ cần được đọc trong vị trí này — tích lũy nhỏ ở đáy TR lớn đáng tin hơn tích lũy nhỏ ở đỉnh TR lớn.`,
        `Price vs the ${anchor} TR (${P(lv.sup)} – ${P(lv.res)}): ${Math.round(a.posInRange * 100)}%. Read every lower-TF structure in this location — a small accumulation at the bottom of a large TR is far more reliable than one at its top.`));
    }
    const html = ['<ul>' + lines.map(x => '<li>' + x + '</li>').join('') + '</ul>'];
    if (nests.length) html.push(`<h4>${L.T('Cấu trúc lồng nhau', 'Nested structures')}</h4><ul>${nests.map(x => '<li>' + x + '</li>').join('')}</ul>`);
    // per-tf mini stories
    html.push(`<h4>${L.T('Tóm tắt câu chuyện từng khung', 'Per-timeframe story')}</h4>`);
    for (const tf of ok) {
      const r = results[tf];
      const ev = r.events && r.events.length ? r.events.slice(-4).map(e => W.EVT[e.code].s).join(' → ') : L.T('chưa có sự kiện', 'no events');
      const st = W.structName(r.structure);
      const top = r.scenarios[0];
      html.push(`<details class="tfstory"><summary><b>${tf}</b> · ${st} · ${L.t('phase')} ${N.phaseLabel(r)} · <span class="${N.biasLabel(r.bias).cls}">${N.biasLabel(r.bias).txt}</span></summary>
        <p>${L.T('Chuỗi sự kiện gần nhất', 'Latest sequence')}: ${ev}</p>
        <p>${L.T('Kịch bản ưu tiên', 'Preferred scenario')}: <b>${top.title}</b> (${top.prob}%) — ${top.thesis[0] || ''}</p>
        <p>${phaseText(r).slice(1, 2).join(' ')}</p></details>`);
    }
    return html.join('');
  };
})(window.LLW);
