# Lai Long Master TA

Hệ thống **phân tích kỹ thuật** gồm hai mảng: (1) phân tích **Wyckoff & VSA đa khung** (2W · 1W · 1D · 4H · 1H · 30m · 15m · 5m · 1m), gồm:

- **Giáo trình ôn luyện CMT** (Level 1 → 3) do Lai Long Master TA tự biên soạn theo cách hiểu riêng, bám khung kiến thức CMT: lộ trình bài học, mục tiêu, nội dung, sơ đồ tự vẽ, demo trên dữ liệu thật, ghi nhớ, thuật ngữ và câu hỏi tự kiểm tra (đạt ≥ 80% mới qua bài). Đây là tài liệu học tập độc lập, không liên kết với CMT Association.
- **Thư viện kiến thức Wyckoff gốc** (song ngữ Việt/Anh). Nội dung gồm: Composite Man, 3 luật (Cung–Cầu, Nhân–Quả và đếm P&F, Nỗ lực–Kết quả), quy trình 5 bước, các sự kiện và 5 pha của tích lũy/phân phối, sơ đồ #1 và #2, tái tích lũy/tái phân phối, 3 loại Spring, UTAD, Creek/Ice, JAC/BU, 9 phép thử Mua/Bán, các mẫu nến VSA, ma trận nỗ lực–kết quả, luật đa khung, quản trị lệnh và đặc thù thị trường Việt Nam.
- **Máy phân tích tự động trên dữ liệu thật**:
  - Nhận diện Trading Range và các sự kiện PS/SC/AR/ST/Spring/UTAD/SOS/LPS/SOW/LPSY.
  - Xác định pha A–E, cấu trúc và thiên hướng.
  - Đọc luật Cung–Cầu, Nỗ lực–Kết quả, Nhân–Quả (đếm P&F), và ý nghĩa VSA của nến cuối.
  - Đưa ra **3 kịch bản Tăng / Đi ngang / Giảm** kèm vùng vào lệnh, cắt lỗ và mục tiêu.
- **Đa khung**: quét 9 khung cùng lúc, có bảng tổng hợp và phần luận về sự đồng thuận cũng như các cấu trúc lồng nhau.
- **Phiên bản đặc biệt cho cổ phiếu cơ sở Việt Nam**: dữ liệu HOSE/HNX/UPCoM, VNINDEX, VN30, phái sinh VN30F; tính sức mạnh tương đối so với VNINDEX; tính đến quy tắc T+2, biên độ giá và việc không bán khống được.
- **Thị trường hỗ trợ**: Crypto Spot/Futures (Binance, gồm cả vàng XAUUSDT), và file CSV (Forex, MT4/MT5, TradingView…).

> Công cụ học tập và hỗ trợ phân tích, không phải lời khuyên đầu tư. Máy nhận diện theo quy tắc nên kết quả chỉ là gợi ý.

---

## Chạy thử trên máy

Ứng dụng là web tĩnh (HTML/CSS/JS), không cần cài đặt hay build.

1. Mở thư mục `lai-long-master-wyckoff`.
2. Nhấp đúp `index.html` để mở bằng Chrome hoặc Edge.
   Nếu trình duyệt chặn dữ liệu khi mở trực tiếp từ file, hãy chạy máy chủ nhỏ (máy cần có Python):
   ```bash
   python -m http.server 8000
   ```
   rồi mở `http://localhost:8000`.

---

## Đưa lên GitHub và tạo website miễn phí (GitHub Pages)

Bạn đã có tài khoản GitHub. Máy bạn hiện **chưa cài Git**, nên cách dễ nhất là tải file lên qua trang web GitHub.

### Bước 1: Tạo repository mới
1. Đăng nhập https://github.com
2. Bấm **+** (góc trên phải), chọn **New repository**.
3. **Repository name**: `lai-long-master-wyckoff`
4. Chọn **Public**. GitHub Pages miễn phí chỉ hỗ trợ repo Public.
5. **Không** tích "Add a README" (vì đã có sẵn README).
6. Bấm **Create repository**.

### Bước 2: Tải mã nguồn lên
1. Trong trang repo vừa tạo, bấm dòng chữ **uploading an existing file**.
2. Mở thư mục `lai-long-master-wyckoff` trên máy, chọn **toàn bộ nội dung bên trong** (`index.html`, `README.md`, `.nojekyll`, các thư mục `css`, `js`, `assets`) rồi **kéo thả** vào trang GitHub.
   - Kéo nội dung *bên trong* thư mục, đừng kéo cả thư mục cha. Như vậy `index.html` sẽ nằm ở gốc repo.
   - File `.nojekyll` bị ẩn trên Windows. Nếu không thấy, bật hiển thị trong File Explorer: **View → Show → Hidden items**. Nếu vẫn thiếu file này thì web vẫn chạy được.
3. Ô **Commit changes**: ghi `Phiên bản đầu tiên`, rồi bấm **Commit changes**.

### Bước 3: Bật GitHub Pages
1. Trong repo, vào **Settings → Pages** (menu bên trái).
2. Mục **Build and deployment → Source**: chọn **Deploy from a branch**.
3. **Branch**: chọn `main`, thư mục `/ (root)`, rồi bấm **Save**.
4. Chờ 1–2 phút rồi tải lại trang. GitHub sẽ hiện địa chỉ web:
   `https://<tên-tài-khoản>.github.io/lai-long-master-wyckoff/`

### Bước 4: Cập nhật về sau
- Sửa file trên máy, rồi vào repo, bấm **Add file → Upload files** và kéo thả các file đã sửa (GitHub tự ghi đè), sau đó **Commit**.
- Khi sửa JS/CSS, hãy tăng số phiên bản `?v=…` trong `index.html` để trình duyệt tải bản mới.

### (Tuỳ chọn) Dùng Git hoặc GitHub Desktop
Nếu muốn làm chuyên nghiệp hơn, cài **GitHub Desktop** (https://desktop.github.com). Sau đó chọn **File → Add local repository**, trỏ tới thư mục dự án, rồi dùng **Publish repository**. Từ đó mỗi lần sửa chỉ cần **Commit** và **Push**.

---

## Cấu trúc mã nguồn

| File | Vai trò |
|---|---|
| `index.html` | Khung trang |
| `css/style.css` | Giao diện sáng/tối |
| `js/core.js` | Từ điển song ngữ, định dạng số, cấu hình thị trường |
| `js/data.js` | Lấy dữ liệu: Binance, VNDirect, CSV; gộp nến 4H/1W/2W |
| `js/indicators.js` | ATR, khối lượng/biên độ tương đối, zigzag, sóng, Point & Figure |
| `js/vsa.js` | Nhận diện mẫu nến VSA |
| `js/wyckoff.js` | Engine Wyckoff: TR, sự kiện, pha, thiên hướng, P&F, 3 kịch bản |
| `js/narrative.js` | Viết "luận Wyckoff" một khung và đa khung |
| `js/chart.js` | Biểu đồ (TradingView Lightweight Charts) và dải pha |
| `js/knowledge.js`, `js/schematics.js` | Thư viện kiến thức và sơ đồ SVG tự vẽ |
| `js/cmt.js` | Khu vực CMT: lộ trình, bài học, tiến độ, câu hỏi, demo |
| `js/cmt-level1.js` | Nội dung CMT Level 1 |
| `js/app.js` | Điều hướng, các tab, checklist |

## Nguồn dữ liệu
- **Binance** Spot `api.binance.com` và Futures USDⓈ-M `fapi.binance.com`: 1000 nến gần nhất.
- **VNDirect** dchart API (công khai): cổ phiếu, chỉ số và VN30F. Giá tính theo nghìn đồng.
- **CSV**: do người dùng tự nạp.

## Ghi công
Biểu đồ sử dụng [TradingView Lightweight Charts™](https://www.tradingview.com/lightweight-charts/) (giấy phép Apache 2.0). Kiến thức dựa trên phương pháp gốc của Richard D. Wyckoff (1873–1934). Toàn bộ nội dung và sơ đồ trong ứng dụng được biên soạn và vẽ lại riêng cho Lai Long Master TA.
