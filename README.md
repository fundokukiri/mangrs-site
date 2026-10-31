# MăngRS Website

Trang giới thiệu bộ gõ tiếng Việt **MăngRS** — Vietnamese input method cho IBus, viết bằng Rust trên nền [`bamboo-core`](https://github.com/fundokukiri/ibus-mangrs).

- Repo: https://github.com/fundokukiri/ibus-mangrs
- Trang: https://mangrs.fundoku.io.vn
- Giấy phép: MIT

## Nội dung

One-page tĩnh, không framework, không build tool: hero wordmark pixel, giới thiệu, tính năng, 6 chế độ hiển thị, hướng dẫn cài đặt từ mã nguồn và liên kết tải về. Tiếng Việt là ngôn ngữ mặc định.

- **Theme**: 6 lựa chọn, mặc định Catppuccin Latte; đổi bằng phím `T` hoặc nút palette; lưu `localStorage`.
- **i18n**: en / vi / zh-CN / zh-TW tại `assets/languages/languages.json`; lưu `localStorage`.
- **Hero**: nền pixel field động (canvas) và wordmark pixel MăngRS (canvas, có hiệu ứng hover/click).
- **Responsive**: mobile-first, hamburger menu ≤1024px.
- **Accessibility**: skip link, semantic HTML, ARIA, focus state, reduced-motion.

## Chạy thử

```bash
python3 -m http.server 8000
# mở http://localhost:8000
```

Mở trực tiếp `index.html` vẫn xem được, nhưng `fetch()` file JSON có thể bị chặn trên `file://` → chỉ hiển thị tiếng Anh.

## Cấu trúc

```
.
├── index.html
├── vercel.json
└── assets/
    ├── css/styles.css       # biến theme, layout, responsive
    ├── img/                 # logo MăngRS
    ├── js/main.js           # theme, i18n, nav, canvas
    └── languages/languages.json
```

## Deploy

Static hosting bất kỳ: GitHub Pages, Cloudflare Pages, Netlify, Vercel. Không có biến môi trường hay bước build.
