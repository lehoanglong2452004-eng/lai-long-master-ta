// © 2026 Lai Long Master TA. Bảo lưu mọi quyền. Không sao chép, chỉnh sửa hay dùng lại khi chưa được phép.
/* Lai Long Master Wyckoff — core: namespace, storage, i18n, formatting */
window.LLW = (function () {
  'use strict';
  const L = {};

  L.store = {
    get(k, d) {
      try { const v = localStorage.getItem('llw.' + k); return v == null ? d : JSON.parse(v); }
      catch (e) { return d; }
    },
    set(k, v) { try { localStorage.setItem('llw.' + k, JSON.stringify(v)); } catch (e) { /* ignore */ } }
  };

  L.lang = L.store.get('lang', 'vi');
  /** Inline bilingual text: L.T('Tiếng Việt', 'English') */
  L.T = (vi, en) => (L.lang === 'en' && en != null ? en : vi);

  L.TFS = ['2W', '1W', '1D', '4H', '1H', '30m', '15m', '5m', '1m'];
  L.TF_SEC = { '1m': 60, '5m': 300, '15m': 900, '30m': 1800, '1H': 3600, '4H': 14400, '1D': 86400, '1W': 604800, '2W': 1209600 };
  L.TF_WEIGHT = { '2W': 3, '1W': 3, '1D': 2.5, '4H': 2, '1H': 1.5, '30m': 1, '15m': 1, '5m': 0.7, '1m': 0.5 };
  L.isIntraday = tf => L.TF_SEC[tf] < 86400;

  L.MARKETS = {
    vn_stock: { vi: 'Cổ phiếu cơ sở Việt Nam', en: 'Vietnam stocks', canShort: false, src: 'vn', ex: 'HPG' },
    vn_der: { vi: 'Phái sinh VN (VN30F)', en: 'VN derivatives (VN30F)', canShort: true, src: 'vn', ex: 'VN30F1M' },
    bn_spot: { vi: 'Crypto Spot (Binance)', en: 'Crypto Spot (Binance)', canShort: false, src: 'bn', ex: 'BTCUSDT' },
    bn_fut: { vi: 'Futures USDⓈ-M (Binance)', en: 'Futures USDⓈ-M (Binance)', canShort: true, src: 'bn', ex: 'BTCUSDT' },
    csv: { vi: 'Nhập file CSV (Forex, MT5…)', en: 'Import CSV (Forex, MT5…)', canShort: true, src: 'csv', ex: '' }
  };

  L.SUGGEST = {
    vn_stock: ['VNINDEX', 'VN30', 'HPG', 'FPT', 'VNM', 'VCB', 'TCB', 'MBB', 'SSI', 'VND', 'MWG', 'VHM', 'VIC', 'HSG', 'DGC', 'GEX', 'DIG', 'PDR', 'STB', 'CTG', 'BID', 'ACB', 'GAS', 'MSN', 'PNJ', 'REE', 'KBC', 'NVL', 'DXG', 'VRE'],
    vn_der: ['VN30F1M', 'VN30F2M'],
    bn_spot: ['BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'SOLUSDT', 'XRPUSDT', 'PAXGUSDT', 'DOGEUSDT', 'ADAUSDT', 'LINKUSDT', 'AVAXUSDT'],
    bn_fut: ['BTCUSDT', 'ETHUSDT', 'XAUUSDT', 'XAGUSDT', 'SOLUSDT', 'BNBUSDT', 'XRPUSDT', 'DOGEUSDT'],
    csv: []
  };

  /* ---------- UI dictionary ---------- */
  L.dict = {
    vi: {
      nav_analysis: 'Phân tích', nav_mtf: 'Đa khung', nav_knowledge: 'Wyckoff', nav_cmt: 'CMT', nav_checklist: 'Checklist', nav_guide: 'Hướng dẫn',
      market: 'Thị trường', symbol: 'Mã', timeframe: 'Khung', analyze: 'Phân tích', scan: 'Quét đa khung',
      csv_pick: 'Chọn file CSV', csv_loaded: 'Đã nạp', loading: 'Đang tải dữ liệu…', show_vsa: 'Tín hiệu VSA', show_phase: 'Pha Wyckoff', show_events: 'Sự kiện',
      summary: 'Tổng quan Wyckoff', structure: 'Cấu trúc', phase: 'Pha', bias: 'Thiên hướng', trend: 'Xu hướng', levels: 'Các mức giá',
      scenarios: 'Ba kịch bản', prob: 'Tỷ trọng', entry: 'Vùng vào', stop: 'Cắt lỗ', targets: 'Mục tiêu', trigger: 'Điều kiện kích hoạt', invalid: 'Vô hiệu khi',
      res: 'Kháng cự TR', sup: 'Hỗ trợ TR', creek: 'Creek', ice: 'Ice', mid: 'Giữa TR', last_price: 'Giá', tf_table: 'Bảng đa khung',
      col_tf: 'Khung', col_trend: 'Xu hướng', col_struct: 'Cấu trúc', col_phase: 'Pha', col_event: 'Sự kiện gần nhất', col_vsa: 'VSA nến cuối', col_bias: 'Thiên hướng',
      mtf_story: 'Luận đa khung', choose_tfs: 'Chọn khung cần quét', open_tf: 'Mở', no_data: 'Không có dữ liệu', err: 'Lỗi',
      disclaimer: 'Công cụ học tập & hỗ trợ phân tích. Không phải lời khuyên đầu tư. Máy nhận diện theo quy tắc nên chỉ là gợi ý — luôn tự kiểm chứng bằng mắt và quản trị rủi ro.',
      chart_credit: 'Biểu đồ: TradingView Lightweight Charts™',
      checklist_title: 'Checklist phân tích Wyckoff', notes: 'Ghi chú', save: 'Lưu', export: 'Xuất file .txt', reset: 'Xoá', saved: 'Đã lưu',
      bull: 'Tăng', bear: 'Giảm', side: 'Đi ngang', toc: 'Mục lục', live: 'nến đang chạy', bars: 'nến',
      csv_hint: 'File CSV cần cột thời gian, Open, High, Low, Close, Volume (hỗ trợ xuất từ MT4/MT5, TradingView).'
    },
    en: {
      nav_analysis: 'Analysis', nav_mtf: 'Multi-TF', nav_knowledge: 'Wyckoff', nav_cmt: 'CMT', nav_checklist: 'Checklist', nav_guide: 'Guide',
      market: 'Market', symbol: 'Symbol', timeframe: 'Timeframe', analyze: 'Analyze', scan: 'Scan all timeframes',
      csv_pick: 'Choose CSV file', csv_loaded: 'Loaded', loading: 'Loading data…', show_vsa: 'VSA signals', show_phase: 'Wyckoff phases', show_events: 'Events',
      summary: 'Wyckoff overview', structure: 'Structure', phase: 'Phase', bias: 'Bias', trend: 'Trend', levels: 'Key levels',
      scenarios: 'Three scenarios', prob: 'Weight', entry: 'Entry zone', stop: 'Stop', targets: 'Targets', trigger: 'Trigger', invalid: 'Invalidated if',
      res: 'TR resistance', sup: 'TR support', creek: 'Creek', ice: 'Ice', mid: 'TR midpoint', last_price: 'Price', tf_table: 'Multi-timeframe table',
      col_tf: 'TF', col_trend: 'Trend', col_struct: 'Structure', col_phase: 'Phase', col_event: 'Latest event', col_vsa: 'Last-bar VSA', col_bias: 'Bias',
      mtf_story: 'Multi-timeframe reading', choose_tfs: 'Timeframes to scan', open_tf: 'Open', no_data: 'No data', err: 'Error',
      disclaimer: 'Educational and analysis-support tool. Not investment advice. Detection is rule-based and only a suggestion — always verify by eye and manage risk.',
      chart_credit: 'Charts: TradingView Lightweight Charts™',
      checklist_title: 'Wyckoff analysis checklist', notes: 'Notes', save: 'Save', export: 'Export .txt', reset: 'Clear', saved: 'Saved',
      bull: 'Bullish', bear: 'Bearish', side: 'Sideways', toc: 'Contents', live: 'bar in progress', bars: 'bars',
      csv_hint: 'CSV needs time, Open, High, Low, Close, Volume columns (MT4/MT5 and TradingView exports supported).'
    }
  };
  L.t = k => (L.dict[L.lang] && L.dict[L.lang][k]) || L.dict.vi[k] || k;

  /* ---------- formatting ---------- */
  L.decimals = function (p) {
    const a = Math.abs(p);
    if (a >= 1000) return 2;
    if (a >= 10) return 2;
    if (a >= 1) return 3;
    if (a >= 0.01) return 5;
    return 8;
  };
  L.fmtP = function (p) {
    if (p == null || !isFinite(p)) return '—';
    const s = p.toFixed(L.decimals(p));
    const [a, b] = s.split('.');
    const ai = a.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    const bt = b ? b.replace(/0+$/, '') : '';
    return bt ? ai + '.' + bt : ai;
  };
  L.fmtVol = function (v) {
    if (v == null || !isFinite(v)) return '—';
    const a = Math.abs(v);
    if (a >= 1e9) return (v / 1e9).toFixed(2) + 'B';
    if (a >= 1e6) return (v / 1e6).toFixed(2) + 'M';
    if (a >= 1e3) return (v / 1e3).toFixed(1) + 'K';
    return v.toFixed(a < 10 ? 2 : 0);
  };
  L.fmtX = x => (x == null || !isFinite(x) ? '—' : x.toFixed(x >= 10 ? 0 : 1) + 'x');
  const pad = n => String(n).padStart(2, '0');
  L.fmtTime = function (t, tf) {
    if (L.isIntraday(tf)) {
      const d = new Date(t * 1000);
      return pad(d.getDate()) + '/' + pad(d.getMonth() + 1) + ' ' + pad(d.getHours()) + ':' + pad(d.getMinutes());
    }
    const d = new Date(t * 1000);
    return pad(d.getUTCDate()) + '/' + pad(d.getUTCMonth() + 1) + '/' + d.getUTCFullYear();
  };
  L.esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  L.pct = x => Math.round(x * 100) + '%';

  return L;
})();
