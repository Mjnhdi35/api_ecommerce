# 🚀 Hướng dẫn Deploy lên Render (Tối ưu nhất)

Bạn đã có:
1. Dockerfile chuẩn (Multi-stage, Node 24).
2. GitHub Actions CI/CD (Auto Build & Push to GHCR).

## Cách 1: Render tự Build từ Git (Đơn giản nhất, Free)
Render sẽ checkout code của bạn và tự chạy lệnh `docker build`.
**Ưu điểm**: Không cần cấu hình Registry.
**Nhược điểm**: Tốn thời gian build trên Render (có thể chậm).

1. Vào [dashboard.render.com](https://dashboard.render.com/).
2. Chọn **New +** -> **Web Service**.
3. Kết nối GitHub Repository của bạn.
4. Cấu hình:
   - **Name**: `api-ecommerce`
   - **Region**: Singapore (hoặc gần nhất).
   - **Runtime**: **Docker**.
   - **Instance Type**: Free.
5. **Environment Variables** (Bắt buộc):
   - `NODE_ENV`: `production`
   - `PORT`: `3000`
   - `DATABASE_URL`: `postgres://...` (Copy từ Neon Console -> Dashboard -> Connection String -> Chọn "Pooled connection").

## Cách 2: Deploy từ GitHub Container Registry (Nhanh, Chuyên nghiệp)
GitHub Actions đã build sẵn image, Render chỉ việc kéo về chạy.

1. **GitHub**:
   - Vào Repo Settings -> Actions -> General -> Workflow permissions -> Chọn "Read and write permissions".
   - Push code lên nhánh `main`. Đợi Action chạy xong (xanh lá).
   - Vào trang chủ Repo, nhìn bên phải mục "Packages", copy link image (vd: `ghcr.io/username/repo/api-ecommerce:latest`).

2. **Render**:
   - Tạo Web Service mới, chọn "Deploy an existing image from a registry".
   - Paste link image vào: `ghcr.io/username/repo/api-ecommerce:latest`.
   - **Credential**: Nếu Repo Private, bạn cần cấu hình credential (username/token) trên Render. Nếu Public thì không cần.
   - Cấu hình Env Vars như cách 1.

## Setup Database (Neon PostgreSQL)
1. Vào Neon Console, tạo Project mới.
2. Lấy Connection String (Pooled).
3. Dán vào `DATABASE_URL` trên Render.
4. App sẽ tự động chạy `npm run migrate:prod` khi khởi động để tạo bảng.

## Kiểm tra
Sau khi deploy xong, truy cập `https://your-app.onrender.com/users` để test API.
