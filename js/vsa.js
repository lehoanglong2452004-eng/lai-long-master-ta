// © 2026 Lai Long Master TA. Bảo lưu mọi quyền. Không sao chép, chỉnh sửa hay dùng lại khi chưa được phép.
/* VSA bar reading: spread, close location and volume relative to background */
(function (L) {
  'use strict';
  const I = L.ind;
  const V = L.vsa = {};

  /** bias: +1 bullish (demand), -1 bearish (supply). w: importance. */
  V.SIGNALS = {
    SC_BAR: { bias: 1, w: 3, short: 'SC', vi: 'Cao trào bán (Selling Climax)', en: 'Selling climax',
      mvi: 'Khối lượng cực lớn, biên độ rộng tại đáy mới sau nhịp giảm dài: cung hoảng loạn được tiền lớn hấp thụ. Thường là điểm DỪNG xu hướng giảm (Pha A).',
      men: 'Ultra-high volume, wide spread at a new low after a long decline: panic supply absorbed by strong hands. Usually STOPS the downtrend (Phase A).' },
    BC_BAR: { bias: -1, w: 3, short: 'BC', vi: 'Cao trào mua (Buying Climax)', en: 'Buying climax',
      mvi: 'Khối lượng cực lớn, biên độ rộng tại đỉnh mới sau nhịp tăng dài: đám đông mua đuổi, tiền lớn phân phối. Thường DỪNG xu hướng tăng.',
      men: 'Ultra-high volume, wide spread at a new high after a long rally: the crowd chases while strong hands sell. Usually STOPS the uptrend.' },
    STOP_VOL: { bias: 1, w: 2, short: 'SV', vi: 'Khối lượng chặn (Stopping Volume)', en: 'Stopping volume',
      mvi: 'Nến giảm khối lượng lớn nhưng đóng cửa rời xa đáy: cầu chuyên nghiệp đang chặn đà giảm.',
      men: 'Heavy-volume down bar closing off its low: professional demand is stopping the decline.' },
    SHAKEOUT: { bias: 1, w: 2, short: 'SO', vi: 'Rũ bỏ (Shakeout)', en: 'Shakeout',
      mvi: 'Xuyên thủng đáy gần nhất rồi đóng cửa gần đỉnh nến: quét cắt lỗ, hấp thụ cung — dấu hiệu Spring.',
      men: 'Pierces recent lows then closes near the high: stops are run and supply absorbed — spring-like action.' },
    UPTHRUST: { bias: -1, w: 2, short: 'UT', vi: 'Upthrust (đẩy lên thất bại)', en: 'Upthrust',
      mvi: 'Vượt đỉnh gần nhất nhưng đóng cửa gần đáy nến với khối lượng lớn: bẫy mua, cung chiếm ưu thế.',
      men: 'Breaks recent highs but closes near the low on high volume: a bull trap, supply in control.' },
    NO_DEMAND: { bias: -1, w: 1, short: 'ND', vi: 'Không có cầu (No Demand)', en: 'No demand',
      mvi: 'Nến tăng biên độ hẹp, khối lượng thấp hơn 2 nến trước: tiền lớn không tham gia nhịp tăng.',
      men: 'Narrow up bar on volume lower than the previous two: professionals are not interested in higher prices.' },
    NO_SUPPLY: { bias: 1, w: 1, short: 'NS', vi: 'Không có cung (No Supply)', en: 'No supply',
      mvi: 'Nến giảm biên độ hẹp, khối lượng thấp hơn 2 nến trước: áp lực bán đã cạn.',
      men: 'Narrow down bar on volume lower than the previous two: selling pressure has dried up.' },
    TEST: { bias: 1, w: 1.5, short: 'T', vi: 'Kiểm tra cung (Test)', en: 'Test',
      mvi: 'Nhúng xuống dưới đáy gần nhất với khối lượng thấp rồi đóng cửa cao: thị trường kiểm tra và thấy không còn cung.',
      men: 'Dips below recent lows on low volume and closes high: the market tests for supply and finds little.' },
    EFFORT_UP: { bias: 1, w: 1.5, short: 'E↑', vi: 'Nỗ lực tăng (Effort to Rise)', en: 'Effort to rise',
      mvi: 'Nến tăng biên độ rộng, khối lượng tăng, đóng cửa gần đỉnh: cầu thật sự — nỗ lực tạo ra kết quả.',
      men: 'Wide up bar, rising volume, close near the high: genuine demand — effort producing result.' },
    EFFORT_DOWN: { bias: -1, w: 1.5, short: 'E↓', vi: 'Nỗ lực giảm (Effort to Fall)', en: 'Effort to fall',
      mvi: 'Nến giảm biên độ rộng, khối lượng tăng, đóng cửa gần đáy: cung thật sự đang chiếm ưu thế.',
      men: 'Wide down bar, rising volume, close near the low: genuine supply in control.' },
    NR_UP: { bias: -1, w: 1.5, short: 'NR↑', vi: 'Nỗ lực không kết quả ở vùng cao', en: 'Effort, no result (high)',
      mvi: 'Khối lượng lớn nhưng biên độ hẹp ở vùng giá cao: lực mua bị cung hấp thụ — cảnh báo phân phối.',
      men: 'High volume but narrow spread near highs: buying is being absorbed by supply — distribution warning.' },
    NR_DOWN: { bias: 1, w: 1.5, short: 'NR↓', vi: 'Nỗ lực không kết quả ở vùng thấp', en: 'Effort, no result (low)',
      mvi: 'Khối lượng lớn nhưng biên độ hẹp ở vùng giá thấp: lực bán bị cầu hấp thụ — dấu hiệu tích lũy.',
      men: 'High volume but narrow spread near lows: selling is being absorbed by demand — accumulation sign.' }
  };

  V.name = code => { const s = V.SIGNALS[code]; return s ? L.T(s.vi, s.en) : code; };
  V.meaning = code => { const s = V.SIGNALS[code]; return s ? L.T(s.mvi, s.men) : ''; };

  function classify(bars, i) {
    if (i < 3) return [];
    const b = bars[i], p1 = bars[i - 1], p2 = bars[i - 2];
    const out = [];
    const lowest10 = I.minL(bars, i - 10, i - 1), highest10 = I.maxH(bars, i - 10, i - 1);
    const lowest20 = I.minL(bars, i - 20, i - 1), highest20 = I.maxH(bars, i - 20, i - 1);
    const back = bars[Math.max(0, i - 20)];
    const drop = (back.c - b.c) / b.atr, rise = (b.c - back.c) / b.atr;
    const up = b.c > p1.c, down = b.c < p1.c;
    const lowerVol2 = b.v < p1.v && b.v < p2.v;
    const nearLow = b.l <= lowest20 + 0.5 * b.atr, nearHigh = b.h >= highest20 - 0.5 * b.atr;

    if (b.relVol >= 2 && b.relSpread >= 1.3 && b.l <= lowest20 && drop >= 3 && b.closePos >= 0.3) out.push('SC_BAR');
    else if (b.relVol >= 2 && b.relSpread >= 1.3 && b.h >= highest20 && rise >= 3 && b.closePos <= 0.7) out.push('BC_BAR');
    else if (b.relVol >= 1.6 && b.relSpread >= 1 && b.closePos >= 0.5 && drop >= 2 && nearLow) out.push('STOP_VOL');

    if (b.l < lowest10 && b.closePos >= 0.7 && b.relVol >= 1.2 && b.relSpread >= 1.2 && !out.length) out.push('SHAKEOUT');
    if (b.h > highest10 && b.closePos <= 0.3 && b.relVol >= 1.2 && b.relSpread >= 1) out.push('UPTHRUST');

    if (b.l < Math.min(p1.l, p2.l) && b.closePos >= 0.6 && b.relVol <= 0.8 && b.relSpread <= 1.1 && !out.length) out.push('TEST');
    else if (down && b.relSpread <= 0.75 && lowerVol2 && b.closePos >= 0.3 && !out.length) out.push('NO_SUPPLY');
    if (up && b.relSpread <= 0.75 && lowerVol2 && b.closePos <= 0.7 && b.c > b.sma20 && !out.length) out.push('NO_DEMAND');

    if (up && b.relSpread >= 1.3 && b.relVol >= 1.4 && b.closePos >= 0.7 && !out.length) out.push('EFFORT_UP');
    if (down && b.relSpread >= 1.3 && b.relVol >= 1.4 && b.closePos <= 0.3 && !out.length) out.push('EFFORT_DOWN');

    if (b.relVol >= 1.8 && b.relSpread <= 0.8 && !out.length) {
      if (nearHigh && b.closePos <= 0.6) out.push('NR_UP');
      else if (nearLow && b.closePos >= 0.4) out.push('NR_DOWN');
    }
    return out;
  }

  /** Per-bar signals; skips everything when the data has no volume. */
  V.scan = function (bars) {
    if (bars.noVolume) return bars.map(() => []);
    return bars.map((_, i) => classify(bars, i));
  };

  /** Decayed sum of recent signal bias (positive = demand). */
  V.recentScore = function (sig, end, look) {
    let s = 0;
    for (let j = Math.max(0, end - look + 1), age = end - Math.max(0, end - look + 1); j <= end; j++, age--) {
      for (const code of sig[j]) { const d = V.SIGNALS[code]; s += d.bias * d.w * Math.pow(0.9, age); }
    }
    return s;
  };

  /** Plain-language description of a bar: spread / close / volume. */
  V.describeBar = function (b) {
    const sp = b.relSpread >= 1.4 ? L.T('rộng', 'wide') : b.relSpread <= 0.7 ? L.T('hẹp', 'narrow') : L.T('trung bình', 'average');
    const cl = b.closePos >= 0.7 ? L.T('gần đỉnh nến', 'near the high') : b.closePos <= 0.3 ? L.T('gần đáy nến', 'near the low') : L.T('giữa nến', 'mid-bar');
    const vo = b.relVol >= 2.2 ? L.T('cực lớn', 'ultra high') : b.relVol >= 1.4 ? L.T('cao', 'high') : b.relVol <= 0.5 ? L.T('rất thấp', 'very low') : b.relVol <= 0.75 ? L.T('thấp', 'low') : L.T('trung bình', 'average');
    return { sp, cl, vo };
  };
})(window.LLW);
