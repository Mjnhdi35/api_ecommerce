# 🚀 Tối ưu Deploy Render Free & GitHub Actions

## 1. Giảm "Cold Start" (Downtime) trên Render Free
Render Free Tier sẽ tự động tắt server sau 15 phút không hoạt động. Để giữ server luôn chạy:

### Cách 1: Sử dụng UptimeRobot (Khuyên dùng)
Đây là cách tốt nhất, miễn phí và không tốn GitHub Actions minutes.
1. Đăng ký tài khoản miễn phí tại [UptimeRobot.com](https://uptimerobot.com/).
2. Tạo "New Monitor".
3. Chọn Monitor Type: **HTTP(s)**.
4. Friendly Name: `API Ecommerce`.
5. URL (or IP): `https://your-app-name.onrender.com/` (hoặc `/health` nếu có).
6. Monitoring Interval: **10 minutes** (quan trọng, phải < 15 phút).
7. Create Monitor.

### Cách 2: GitHub Actions Cron (Dự phòng)
Nếu không muốn dùng tool ngoài, bạn có thể tạo workflow ping định kỳ. Tạo file `.github/workflows/keep-alive.yml`:
```yaml
name: Keep Alive
on:
  schedule:
    - cron: '*/14 * * * *' # Chạy mỗi 14 phút
jobs:
  ping:
    runs-on: ubuntu-latest
    steps:
      - name: Ping Render
        run: curl -I https://your-app.onrender.com/health || true
```

## 2. Tiết kiệm GitHub Actions Minutes
Workflow CI đã được tối ưu:
- **Paths Ignore**: Chỉ chạy build khi sửa code (`.ts`, `.json`), bỏ qua docs (`.md`).
- **Concurrency**: Tự động hủy build cũ nếu bạn push liên tục.
- **Caching**:
  - `pnpm` store được cache.
  - `docker` layers được cache (Build Docker cực nhanh ở lần sau).

## 3. Database Neon PostgreSQL
Database này là Serverless, nó cũng sẽ "ngủ" (scale to zero) khi không dùng.
- **Connection**: Đã cấu hình `ssl: { rejectUnauthorized: false }`.
- **Downtime**: Request đầu tiên kết nối DB sẽ chậm khoảng 1-2s. Đây là đặc tính của Neon Free, khó tránh khỏi hoàn toàn nhưng chấp nhận được.
