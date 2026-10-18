# TINA Pet Spa – Bản web (GitHub Pages)

Tất cả file nằm chung một thư mục, **không có thư mục con**, nên tải lên GitHub không lo bị lệch.

| File | Dùng để |
|---|---|
| `index.html` | Toàn bộ app (giống bản APK) |
| `manifest.json` | Cho phép "Thêm vào màn hình chính" như một app |
| `sw.js` | Lưu app vào máy để mở được khi mất mạng |
| `icon-*.png` | Icon app |

## Đưa lên GitHub Pages

1. Tạo repo mới, ví dụ `tina-web`, chọn **Public**.
   (GitHub Pages miễn phí chỉ chạy với repo Public. Repo này chỉ chứa giao diện app, **không chứa dữ liệu khách hàng**, nên để Public vẫn an toàn.)
2. Bấm **uploading an existing file**, kéo tất cả file trong thư mục này vào → **Commit changes**.
3. Vào **Settings → Pages**:
   - Source: **Deploy from a branch**
   - Branch: **main**, thư mục **/ (root)** → **Save**
4. Đợi 1–2 phút, tải lại trang Settings → Pages sẽ hiện link dạng
   `https://<tên-tài-khoản>.github.io/tina-web/`

## Cài lên điện thoại

- **Android (Chrome):** mở link → menu ⋮ → **Thêm vào màn hình chính** / **Cài đặt ứng dụng**.
- **iPhone (Safari):** mở link → nút Chia sẻ → **Thêm vào MH chính**.

Sau khi cài, app mở toàn màn hình như app thật, mất mạng vẫn dùng được.

## Dữ liệu lưu ở đâu?

- Dữ liệu (khách hàng, lịch hẹn, thu chi, ảnh) lưu **trong trình duyệt của từng máy**, không lưu lên GitHub.
- Bản web và bản APK là **hai kho dữ liệu riêng**. Muốn chuyển dữ liệu: vào **Cài đặt → Xuất dữ liệu** ở máy này, rồi **Nhập dữ liệu** ở máy kia.
- Xóa dữ liệu duyệt web / dữ liệu trang của Chrome sẽ xóa luôn dữ liệu app → nhớ xuất sao lưu định kỳ.

## Cập nhật

Sửa `index.html` rồi tải đè lên repo. Lần mở app tiếp theo (khi có mạng) sẽ tự dùng bản mới.
