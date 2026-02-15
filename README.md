# Jurassic World Travel 🦖

Chào mừng đến với hệ thống đặt vé tham quan đảo Isla Nublar - Jurassic World Travel. Dự án này là một website đặt vé du lịch cao cấp, lấy cảm hứng từ phong cách "High-tech x Jungle".

## 🌟 Tính năng nổi bật

- **Bản đồ tương tác (Interactive Map)**: Sử dụng `react-leaflet` với bản đồ vệ tinh tùy chỉnh (ImageOverlay). Người dùng có thể chọn các khu vực (Zone) để xem chi tiết.
- **Đặt vé thông minh**: Form đặt vé có tính năng kiểm tra ngày hợp lệ (không cho chọn ngày quá khứ) và lưu trữ dữ liệu vào `localStorage` (không mất dữ liệu khi reload).
- **Giao diện hiện đại**: Thiết kế theo phong cách Command Center kết hợp Jungle, sử dụng Tailwind CSS với các hiệu ứng Motion mượt mà.
- **Hiệu ứng động (Animations)**: Sử dụng `framer-motion` cho các hiệu ứng chuyển cảnh, popup, và nhảy số (counter animation) giá vé.

## 🛠️ Công nghệ sử dụng

- **ReactJS (Vite)**: Framework chính, tối ưu tốc độ.
- **Tailwind CSS**: Styling, theme tùy chỉnh (Jungle Green / Command Blue).
- **Zustand**: Quản lý state toàn cục (Booking, Active Zone) và Persist Middleware.
- **React-Leaflet**: Thư viện bản đồ.
- **Framer Motion**: Thư viện Animation.

## 🚀 Hướng dẫn cài đặt

1.  **Clone dự án về máy:**
    ```bash
    git clone https://github.com/your-username/jurassic-travel.git
    cd jurassic-travel
    ```

2.  **Cài đặt các gói phụ thuộc (Dependencies):**
    ```bash
    npm install --legacy-peer-deps
    ```
    *Lưu ý: Flag `--legacy-peer-deps` được khuyến nghị để đảm bảo tương thích giữa React 19 và React-Leaflet.*

3.  **Chạy dự án (Development Mode):**
    ```bash
    npm run dev
    ```

4.  **Truy cập vào:** `http://localhost:5173`

## 📦 Build cho Production

```bash
npm run build
```

## 👨‍💻 Tác giả

Designed & Developed by [Your Name]
Isla Nublar Sector 4 Development Team.
