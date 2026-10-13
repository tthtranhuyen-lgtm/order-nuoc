# 🍵 Menu Đồ Uống Tiếng Trung - Thực Hành Order Nước (茶语 CháYǔ)

Ứng dụng web tương tác song ngữ Trung - Việt phục vụ học sinh luyện nói chủ đề **"Bạn thích uống đồ gì? (你喜欢喝什么？)"**, bấm chọn 10 món nước, điều chỉnh đường đá, size ly và in hóa đơn (小票).

---

## 🚀 Hướng Dẫn Deploy Lên GitHub Pages (Tránh Màn Hình Trắng)

Nếu bạn vừa đẩy code lên GitHub và gặp **màn hình trắng**, lý do là vì GitHub Pages mặc định load file mã nguồn gốc (`src/main.tsx` chưa biên dịch) thay vì file đã build (`dist/` hoặc `docs/`).

Bạn có thể chọn **1 trong 3 cách sau** để chạy ngay:

### 🌟 Cách 1: Dùng thư mục `/docs` (Đơn giản nhất, không cần cài đặt gì thêm)
Dự án đã tự động copy toàn bộ bản build hoàn chỉnh vào thư mục `/docs`.
1. Vào repository trên GitHub của bạn.
2. Chọn **Settings** (Cài đặt) -> Chọn mục **Pages** (ở menu bên trái).
3. Tại phần **Build and deployment**:
   - **Source**: Chọn `Deploy from a branch`
   - **Branch**: Chọn `main` (hoặc `master`) và ở ô bên cạnh chọn thư mục **/docs** (thay vì `/root`).
4. Nhấn **Save**. Đợi 1 phút, trang web sẽ hiển thị ngay lập tức, không còn bị trắng màn hình!

---

### 🌟 Cách 2: Tự động hóa với GitHub Actions (Chuẩn lập trình)
Dự án đã có sẵn file `.github/workflows/deploy.yml`.
1. Vào repository trên GitHub -> **Settings** -> **Pages**.
2. Tại phần **Source**, chọn **GitHub Actions**.
3. Mỗi khi bạn `git push` code mới lên, GitHub sẽ tự động build và cập nhật trang web sau 30 giây!

---

### 🌟 Cách 3: Dùng lệnh `npm run deploy`
Nếu bạn đã clone về máy tính:
```bash
npm install
npm run deploy
```
Lệnh này sẽ tự động build và đẩy lên nhánh `gh-pages` cho bạn.
