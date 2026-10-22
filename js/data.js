// © 2026 Lai Long Master TA. Bảo lưu mọi quyền. Không sao chép, chỉnh sửa hay dùng lại khi chưa được phép.
/* Market data: Binance spot/futures, VNDirect (VN stocks, indices, VN30F), CSV import, timeframe aggregation */
(function (L) {
  'use strict';
  const D = L.data = {};

  const BN = { bn_spot: 'https://api.binance.com/api/v3/klines', bn_fut: 'https://fapi.binance.com/fapi/v1/klines' };
  const BN_TF = { '1m': '1m', '5m': '5m', '15m': '15m', '30m': '30m', '1H': '1h', '4H': '4h', '1D': '1d', '1W': '1w', '2W': '1w' };
  const VN_URL = 'https://dchart-api.vndirect.com.vn/dchart/history';
  // VNDirect native resolution + lookback (days) per timeframe
  const VN_TF = { '1m': ['1', 7], '5m': ['5', 35], '15m': ['15', 100], '30m': ['30', 200], '1H': ['60', 420], '4H': ['60', 800], '1D': ['D', 365 * 6], '1W': ['D', 365 * 14], '2W': ['D', 365 * 20] };

  const nowSec = () => Math.floor(Date.now() / 1000);

  /* ---------- aggregation ---------- */
  const weekIdx = t => Math.floor((Math.floor(t / 86400) + 3) / 7); // Monday-based weeks
  D.bucketKey = function (tf, t) {
    switch (tf) {
      case '1W': return weekIdx(t);
      case '2W': return Math.floor(weekIdx(t) / 2);
      case '1D': return Math.floor(t / 86400);
      default: return Math.floor(t / L.TF_SEC[tf]);
    }
  };
  D.aggregate = function (bars, keyFn) {
    const out = [];
    let cur = null, ck = null;
    for (const b of bars) {
      const k = keyFn(b.t);
      if (cur && k === ck) {
        cur.h = Math.max(cur.h, b.h); cur.l = Math.min(cur.l, b.l); cur.c = b.c; cur.v += b.v; cur.live = cur.live || b.live;
      } else {
        cur = { t: b.t, o: b.o, h: b.h, l: b.l, c: b.c, v: b.v, live: !!b.live };
        ck = k; out.push(cur);
      }
    }
    return out;
  };
  D.toTF = function (bars, tf) { return D.aggregate(bars, t => D.bucketKey(tf, t)); };
  /** VN "4H": morning and afternoon sessions (ICT +7) as two bars per day. */
  const vnHalfDay = t => { const lt = t + 7 * 3600; return Math.floor(lt / 86400) * 2 + (((lt % 86400) / 3600) >= 12 ? 1 : 0); };

  /* ---------- sources ---------- */
  async function getJSON(url) {
    let res;
    try { res = await fetch(url); }
    catch (e) { throw new Error(L.T('Không kết nối được nguồn dữ liệu (mạng hoặc bị chặn).', 'Could not reach the data source (network or blocked).')); }
    let js = null;
    try { js = await res.json(); } catch (e) { /* ignore */ }
    if (!res.ok) throw new Error((js && (js.msg || js.message)) || ('HTTP ' + res.status));
    return js;
  }

  async function binance(market, symbol, tf) {
    const url = `${BN[market]}?symbol=${encodeURIComponent(symbol)}&interval=${BN_TF[tf]}&limit=1000`;
    const rows = await getJSON(url);
    const now = Date.now();
    let bars = rows.map(r => ({ t: Math.floor(r[0] / 1000), o: +r[1], h: +r[2], l: +r[3], c: +r[4], v: +r[5], live: r[6] > now }));
    if (tf === '2W') bars = D.toTF(bars, '2W');
    return bars;
  }

  async function vndirect(symbol, tf) {
    const [res, days] = VN_TF[tf];
    const to = nowSec() + 86400, from = to - days * 86400;
    const js = await getJSON(`${VN_URL}?resolution=${res}&symbol=${encodeURIComponent(symbol)}&from=${from}&to=${to}`);
    if (!js || js.s !== 'ok' || !js.t || !js.t.length) throw new Error(L.T(`Không có dữ liệu cho mã ${symbol}.`, `No data for ${symbol}.`));
    const step = res === 'D' ? 86400 : (+res) * 60;
    const now = nowSec();
    let bars = js.t.map((t, k) => ({ t, o: +js.o[k], h: +js.h[k], l: +js.l[k], c: +js.c[k], v: +js.v[k] || 0, live: t + step > now }));
    bars = bars.filter(x => isFinite(x.c) && x.h >= x.l);
    // de-duplicate / sort
    bars.sort((a, b) => a.t - b.t);
    bars = bars.filter((x, k) => k === 0 || x.t !== bars[k - 1].t);
    if (tf === '4H') bars = D.aggregate(bars, vnHalfDay);
    else if (tf === '1W' || tf === '2W') bars = D.toTF(bars, tf);
    return bars;
  }

  /* ---------- CSV ---------- */
  function parseTime(s) {
    s = String(s).trim().replace(/^"|"$/g, '');
    if (/^\d{9,10}$/.test(s)) return +s;
    if (/^\d{12,13}$/.test(s)) return Math.floor(+s / 1000);
    let m = s.match(/^(\d{4})[.\-/](\d{1,2})[.\-/](\d{1,2})(?:[ T](\d{1,2}):(\d{2})(?::(\d{2}))?)?/);
    if (m) return Date.UTC(+m[1], +m[2] - 1, +m[3], +(m[4] || 0), +(m[5] || 0), +(m[6] || 0)) / 1000;
    m = s.match(/^(\d{1,2})[.\-/](\d{1,2})[.\-/](\d{4})(?:[ T](\d{1,2}):(\d{2})(?::(\d{2}))?)?/);
    if (m) return Date.UTC(+m[3], +m[2] - 1, +m[1], +(m[4] || 0), +(m[5] || 0), +(m[6] || 0)) / 1000;
    const d = Date.parse(s);
    return isNaN(d) ? null : Math.floor(d / 1000);
  }
  D.parseCSV = function (text) {
    const lines = text.split(/\r?\n/).filter(x => x.trim());
    if (lines.length < 2) throw new Error('CSV empty');
    const sep = lines[0].includes('\t') ? '\t' : (lines[0].split(';').length > lines[0].split(',').length ? ';' : ',');
    const head = lines[0].split(sep).map(h => h.trim().replace(/[<>"]/g, '').toLowerCase());
    const find = (...names) => head.findIndex(h => names.includes(h));
    const iDate = find('date', 'time', 'datetime', 'timestamp', 'ngày', 'ngay', 'open time', 'opentime');
    const iTime = head.indexOf('time') !== iDate ? head.indexOf('time') : -1;
    const iO = find('open', 'o', 'mở cửa'), iH = find('high', 'h', 'cao nhất'), iL = find('low', 'l', 'thấp nhất'), iC = find('close', 'c', 'đóng cửa', 'last');
    let iV = find('volume', 'vol', 'v', 'khối lượng', 'real_volume');
    const iTick = find('tickvol', 'tick_volume', 'tickvolume');
    if (iV === -1 || (iTick !== -1 && head[iV] === 'vol')) iV = iTick !== -1 ? iTick : iV;
    if ([iDate, iO, iH, iL, iC].some(x => x < 0)) throw new Error(L.T('Không nhận ra các cột Date/Open/High/Low/Close.', 'Could not find Date/Open/High/Low/Close columns.'));
    const bars = [];
    for (let k = 1; k < lines.length; k++) {
      const c = lines[k].split(sep);
      const ts = iTime >= 0 && iTime !== iDate ? c[iDate] + ' ' + c[iTime] : c[iDate];
      const t = parseTime(ts);
      const num = x => parseFloat(String(x).replace(/"/g, ''));
      const b = { t, o: num(c[iO]), h: num(c[iH]), l: num(c[iL]), c: num(c[iC]), v: iV >= 0 ? num(c[iV]) || 0 : 0 };
      if (t != null && isFinite(b.c) && isFinite(b.h) && isFinite(b.l)) bars.push(b);
    }
    bars.sort((a, b) => a.t - b.t);
    const uniq = bars.filter((x, k) => k === 0 || x.t !== bars[k - 1].t);
    const diffs = [];
    for (let k = 1; k < Math.min(uniq.length, 300); k++) diffs.push(uniq[k].t - uniq[k - 1].t);
    diffs.sort((a, b) => a - b);
    const step = diffs[Math.floor(diffs.length / 2)] || 86400;
    let baseTF = '1m';
    for (const tf of L.TFS.slice().reverse()) if (L.TF_SEC[tf] <= step * 1.05) baseTF = tf;
    return { bars: uniq, step, baseTF };
  };
  D.csv = null; // {bars, baseTF, name}

  /** Public entry point. */
  D.load = async function (market, symbol, tf) {
    const mk = L.MARKETS[market];
    if (!mk) throw new Error('market');
    if (mk.src === 'bn') return binance(market, symbol.toUpperCase().replace(/[^A-Z0-9]/g, ''), tf);
    if (mk.src === 'vn') return vndirect(symbol.toUpperCase().replace(/[^A-Z0-9]/g, ''), tf);
    if (!D.csv) throw new Error(L.T('Hãy chọn file CSV trước.', 'Please choose a CSV file first.'));
    if (L.TF_SEC[tf] < L.TF_SEC[D.csv.baseTF]) throw new Error(L.T(`File CSV có khung gốc ${D.csv.baseTF} — không tạo được khung nhỏ hơn.`, `The CSV base timeframe is ${D.csv.baseTF} — cannot build smaller timeframes.`));
    return tf === D.csv.baseTF ? D.csv.bars.slice(-3000) : D.toTF(D.csv.bars, tf).slice(-3000);
  };
  D.availableTFs = function (market) {
    if (market === 'csv' && D.csv) return L.TFS.filter(tf => L.TF_SEC[tf] >= L.TF_SEC[D.csv.baseTF]);
    return L.TFS.slice();
  };
})(window.LLW);
