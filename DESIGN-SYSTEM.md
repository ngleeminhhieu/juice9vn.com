# RITA 丽塔饮料 (juice9vn.com) — Design System

Site tĩnh tiếng Trung giản thể (`lang="zh-CN"`), không build tool. Mọi trang là 1 file `.html` độc lập, dùng chung `css/fonts.css`, `css/site.css`, `js/main.js`. Quy ước code giống ritadrinks.co.uk.

## 1. Quy tắc chung

1. **Chỉ dùng token.** Không gõ thẳng font-size, màu, duration ngoài `:root`. Thiếu thì thêm token trước.
2. **Thiết kế dựng trên frame 1440–1512 px.** Token tỉ lệ theo viewport: `clamp(MIN, giá trị_Figma / 14.4 vw, MAX)`; MAX ≈ 1.15–1.3 × Figma (đạt ở 1920).
3. **Góc vuông.** Không bo góc nút, input, nav-button, panel (chỉ radio là tròn; chấm mốc dòng thời gian cũng vuông).
4. **Không comment** trong CSS/JS/HTML. Ngoại lệ: ghi chú bàn giao backend khi được yêu cầu (bắt đầu bằng "Ghi chú bàn giao backend"), vd. `CategoryPageModule.js` và khối dữ liệu trong `product-category.html`.
5. **Hook JS tách khỏi style:** class `…JS` (`siteHeaderJS`, `heroSliderJS`) không bao giờ được style.
6. **Mọi nút có chữ dùng hiệu ứng chữ 3D:** bọc chữ trong `<span class="button-label letterSwapJS">`. Đổi chữ bằng `new CustomEvent("letterswap:set", { detail: "…" })`, không set `textContent`.
7. Khoá cuộn trang trên `body` (`body:has(.site-menu[open])`), không đặt overflow trên `html`.
8. **Không để phần tử tràn ngang.** Trên điện thoại / tablet, `overflow-x: hidden` của `body` không chặn được: trang sẽ bị thu nhỏ cho vừa phần tràn. `main` có `overflow-x: clip` (không tạo vùng cuộn nên `sticky` vẫn chạy) để cắt các phần tử đang dịch ngang (hiệu ứng `left` / `right`, slider hé thẻ). Khi kiểm tra responsive phải tính cả trạng thái đang ẩn của hiệu ứng.
9. **Không dùng `box-shadow`.** Phong cách phẳng: tách lớp bằng viền 1 px `--line`, nền `--surface` hoặc khối màu đặc (`--black`, `--red`). Ngoại lệ duy nhất: đường kẻ 1 px dưới header (`box-shadow: 0 1px 0 var(--line)` để không làm đổi chiều cao header).

## 2. Font

`Noto Sans SC` (400–900, variable) tự host trong `assets/fonts/noto-sans-sc/`, chia 101 slice theo `unicode-range` (`css/fonts.css`) — trình duyệt chỉ tải slice chứa ký tự có trên trang. Không dùng Google Fonts (bị chặn ở Trung Quốc). Fallback: PingFang SC, Hiragino Sans GB, Microsoft YaHei.

Chữ Latin, số và ký hiệu (email, địa chỉ, số điện thoại, OEM / ODM, 490毫升, 2026年…) dùng `Poppins` (400 / 500 / 600 / 700, tự host trong `assets/fonts/poppins/`, lấy từ beveragevietnam.com để đồng bộ với các site RITA khác). `--font-body` đặt Poppins trước Noto Sans SC và `@font-face` của Poppins chỉ khai báo `unicode-range` Latin, nên trình duyệt tự chọn font theo từng ký tự, không cần class hay thẻ riêng. Dải Latin cố ý bỏ các dấu dùng chung với tiếng Trung — ngoặc kép “” ‘’ (U+2018–201F), dấu ba chấm … (U+2026), gạch dài — (U+2014) — để chúng vẫn theo Noto Sans SC, không bị hẹp trong câu tiếng Trung; gạch nối – (U+2013) trong "20–25天" dùng Poppins. Chữ 900 (h1–h3) với ký tự Latin hiển thị bằng Poppins 700 (không tải bản 900, `font-synthesis: none`). Mỗi file chỉ khoảng 5–8 KB và chỉ tải khi trang có ký tự thuộc dải đó.

### Vai trò chữ (bắt buộc theo bảng, không tự chọn cỡ / độ đậm cho từng component)

| Vai trò | Token | 1440 → 1920 | Weight | Dùng cho |
|---|---|---|---|---|
| Tiêu đề hiển thị | `--fs-h2` | 60 → 64 | 900 | `.section-title`, tiêu đề banner giới thiệu |
| Tiêu đề trang chi tiết | `--fs-title` | 44 → 48 | 900 | H1 trang chi tiết sản phẩm / bài viết (`.product-info__title`, `.post-header__title`) |
| Tiêu đề CTA | `--fs-cta` | 48 → 52 | 900 | `.cta-banner__title` |
| Con số lớn | `--stat-size` | 72 → 84 | 900 | `.stat__value` |
| Tiêu đề nổi bật (h3) | `--fs-h3` | 32 → 36 | 900 | Thẻ OEM / ODM, tiêu đề slide danh mục |
| Tiêu đề thẻ (h5) | `--fs-h5` | 20 → 22 | 700 | Thẻ vì sao chọn, thẻ tin tức, nhãn chỉ số |
| Tiêu đề nhỏ (h6) | `--fs-h6` | 16 → 18 | 700 | Tên sản phẩm, tab danh mục, nhóm menu |
| Nhãn form | `--fs-label` | 15 → 17 | 700 | Nhãn ô nhập, legend |
| Đoạn văn | `--fs-body` | 15.4 → 16 | 400 | **Mọi** mô tả, chú thích, nội dung thẻ, lựa chọn radio |
| Menu chính | `--fs-nav` | 14 → 16 | 500 | `.nav-link` |
| Chữ giao diện nhỏ | `--fs-small` | 13 → 14 | 500 (link) / 400 (chữ) | Liên hệ header, dropdown, breadcrumb, footer |
| Ghi chú | `--fs-caption` | 12 | 700 | Bản quyền, nhãn ghim bản đồ |
| Nút | `--fs-button` | 14 → 16 | 700 | `.button` |
| Ô nhập | `--fs-input` | 14 → 16 | 400 | Input, select (≤ 680 px luôn 16 để iOS không zoom) |

Cỡ chữ khớp thiết kế ở bề rộng laptop (khung thiết kế 1512 px, ảnh export 3024 px); từ khoảng 1536 px trở lên các cỡ hiển thị dừng ở trần (`--fs-h2` 64, `--fs-cta` 52, `--stat-size` 84, đoạn văn 16) để màn 1920 không bị to quá. Muốn chữ to / nhỏ hơn thì chỉnh trần (giá trị cuối trong `clamp`), không chỉnh trong media query.

Quy tắc: h1–h3 là 900, h4–h6 và nhãn là 700, chữ đọc là 400. Hai đoạn văn cạnh nhau không được khác cỡ. Màu chữ đọc: `--green` (trên nền sáng), `--on-dark-muted` (trên nền tối); `--text-muted` chỉ cho tóm tắt tin tức.

Line-height CJK: `--lh-tight` 1.25, `--lh-heading` 1.45, `--lh-body` 1.75.

## 3. Màu

`--red` #d92b2b (logo, nút chính, active) · `--red-dark` (hover) · `--black` (nút phụ, nút Alibaba trên nền trắng) · `--ink` #111 (tiêu đề, nhãn) · `--green` #1c3b33 (chữ thường, link phụ) · `--gray` (breadcrumb) · `--placeholder` · `--line` #e5e5e5 (viền input, đường kẻ) · `--surface` #faf9f6 trắng ngà (khung ảnh trong thẻ chứng nhận / hoạt động, nền ảnh thương hiệu; không dùng màu kem đậm hơn) · `--dark` #333 (thanh cuối footer).

## 4. Breakpoint

Desktop ≥ 1121 · Tablet ≤ 1120 (header mobile, menu full màn hình) · ≤ 900 · Mobile ≤ 680 (form 1 cột, footer 1 cột).

Khoảng đệm section: `.ss-pd` (trên + dưới) = `--pd-sc`: 62 → 100 px trên desktop; ≤ 1120 px token được đặt lại `clamp(32px, 4.5vw, 48px)` (≈ 46 ở 1024, 35 ở 768, 32 trên điện thoại). Hai section liền nhau cùng nền: section trước dùng `.pdb-0`.

Lề trái / phải: `--page-gutter` (padding của `.container`, dùng chung cho header, footer, mọi section): 62 → 110 px trên desktop; ≤ 1120 px đặt lại `clamp(16px, 3.125vw, 32px)` (32 ở 1024, 24 ở 768, 16 trên điện thoại).

## 5. Component

### Nút — `.button`
`--primary` đỏ (hover đỏ đậm) · `--secondary` đen (hover đỏ) · `--tertiary` trắng viền `--line` (hover đen). Cao `--btn-h`, rộng tối thiểu `--btn-min-w`.

### Next / Prev — `.nav-button`
Ô vuông `--nav-btn` (32 → 36 px), trắng viền `--line`, hover đen. `.nav-button--next` đổi icon. `.nav-button--light` cho nền ảnh: trong suốt, viền trắng, hover nền trắng.

### Header — `.site-header`
Cố định trên cùng, 2 hàng: `.site-header__top` (email, 2 số điện thoại, nút search, nút menu) + `.site-header__main` (logo, menu chính, nút Alibaba). Cao 116 px ở 1920 (44 + 72).

| Trạng thái | Khi nào | Giao diện |
|---|---|---|
| Transparent | Trang có hero / page banner (`.site-header--overlay`), đang ở đầu trang, desktop | Nền trong suốt + gradient tối nhẹ, chữ trắng, nút Alibaba nền trắng |
| Subpage | Trang không có banner (product-detail, blog-detail) | Nền trắng, đủ 2 hàng; `main` tự chừa chỗ |
| Sticky (`.is-stuck`) | Cuộn > 4 px | Nền trắng, ẩn hàng trên, chỉ còn 1 hàng |
| Ẩn (`.is-hidden`) | Cuộn xuống quá 200 px | Trượt lên khỏi màn hình; cuộn lên thì hiện lại bản sticky |
| Search (`.is-searching`) | Bấm icon search | Menu + Alibaba thay bằng form 4 ô (尺码 / 包装 / 类别 / 搜索产品) + nút 搜索 + X; không bị ẩn khi cuộn |

- Dropdown: `.nav-dropdown` > `button.nav-link` + `.dropdown-panel` (`--columns` 2 cột, `--right` canh phải). Mở bằng hover, click, Enter; Esc / click ngoài để đóng.
- Active: link trang hiện tại có `aria-current="page"`; nút nhóm cha có `.is-current` → chữ đỏ + gạch chân đỏ.
- ≤ 1120 px: chỉ logo + `.header-tools` (search, menu); form search xổ xuống dạng lưới 2 cột.

### Menu mở — `.site-menu`
`<dialog>` mở bằng `showModal()` (`.menuOpenJS`). Desktop: ảnh `popup-profile.jpg` 50 % trái, panel trắng 50 % phải. Cả khối (ảnh + panel) trượt từ phải sang cùng lúc (`menu-in`, `--dur-slow`), đóng thì trượt ra phải (`menu-out`); không animate riêng ảnh hay panel. ≤ 1120 px: chỉ panel, kèm email / điện thoại / Alibaba ở cuối (`.site-menu__extra`). Đóng bằng X, Esc hoặc click ra ngoài panel.

### Hero trang chủ — `.hero`
Swiper fade, 2 ảnh, tự chuyển sau `--hero-delay` (6 s), không dừng khi hover. Thanh đáy: line nền 2 px tối + thanh đỏ 4 px chạy theo thời gian, `01 / 02`, `立即探索`, nav-button `--light`.
Desktop: hero `sticky`, lăn chuột xuống ở đầu trang thì khối nội dung trượt phủ lên hero trong 0.7 s (`HeroRevealModule`, giống en.crbeverage.com); lăn lên ở đầu nội dung thì trở lại hero. Mọi phần tử sau `.hero` cần có nền.

### Hero trên tablet / mobile (≤ 1120 px)
Ảnh giữ tỉ lệ gốc 1920 : 1008; thanh điều khiển (tiến trình, 01 / 02, 立即探索, nút ‹ ›) nằm **dưới** ảnh trên nền trắng, chữ và nút màu tối, không đè lên banner. Vạch tiến trình ở mép trên, viền `--line` ở mép dưới để dải điều khiển tách khỏi section kế tiếp.

### Page banner — `.page-banner`
`<header class="page-banner slideCoverJS">` > `.page-banner__media` (ảnh nền cover, cao `--banner-h`; trên PC ≥ 1121 px cao `100svh − --crumb-h` để banner + breadcrumb vừa đúng một màn hình, tối thiểu `--banner-min-h` 480 px) + `.crumb-bar`. Các trang chỉ khác ảnh nền, tên trang và breadcrumb.
- H1 tên trang hiển thị: `.page-banner__content.container` đặt ở góc trái dưới ảnh (cách đáy `--banner-pad`), `.page-banner__title` `--fs-h1` 900 trắng; ảnh có lớp tối `--overlay-banner` ở 60 % phía dưới để chữ đọc được.
- Hiệu ứng như trang chủ (PC): banner `sticky`, các phần tử sau nó có nền trắng trượt lên phủ banner (không đổ bóng); lăn chuột lần đầu thì cuộn thẳng tới section kế tiếp, lăn ngược ở đầu nội dung thì về lại banner (`HeroRevealModule`, hook `slideCoverJS`, dùng chung với `.hero`).
- Trang không có banner (product-detail, blog-detail): `.crumb-bar` đứng đầu `<main>`, H1 `sr-only`.
- Trang danh mục `product-category.html?category={slug}` (bản tĩnh chỉ có một file): `CategoryPageModule` đọc `?category=` (tương đương `$_GET['category']`) và dữ liệu trong `<script type="application/json" class="categoryDataJS">` (nằm trong banner, sau breadcrumb) để đổi ảnh `page-{slug}.jpg` (`.categoryImageJS`), H1 + mục breadcrumb cuối (`.categoryNameJS`), tiêu đề tab và `aria-current` của menu. Slug không hợp lệ hoặc thiếu thì giữ mặc định 果汁饮料. Backend: render phía server theo `$_GET['category']` rồi bỏ module, khối JSON và các hook này. Không đặt phần tử nào giữa banner và section đầu tiên (hiệu ứng trượt lấy phần tử liền sau banner).

### Tiêu đề section — `.section-head`
Căn giữa: `.section-title` (H2, `--fs-h2`, weight 900, `--black`) + `.section-desc` (`--fs-body`, `--green`, rộng tối đa 48.5em, `text-wrap: pretty`). Cách nội dung bên dưới `--head-gap`. Dùng cho 新发布, lead form và các section sau.

### Thanh tìm kiếm — `.search-bar`
Lưới 4 ô (`.search-bar__field`: 尺码 / 包装 / 类别 / 搜索产品) + `.search-bar__submit`. Các ô dính nhau (viền chung 1 px). ≤ 1120 px: lưới 2 cột, nút full hàng. Header dùng thêm `.header-search` (vị trí, nút X, panel xổ xuống trên mobile).

### 新发布 — `.releases` + `.release-card`
Ngay sau hero (`#new-releases`, link 立即探索 trỏ tới). `.section-head` → `.release-grid` (5 cột × 4 hàng desktop; 4 cột × 3 hàng ≤ 1120; 2 cột, 8 sản phẩm ≤ 680) → nút `.button--secondary` 了解更多 (sang `products.html`).
Thẻ: ô vuông trắng viền `--line`, ảnh `contain` đệm 8 %, tên `--fs-label` 700 (tối đa 2 dòng). Hover: viền đỏ, icon OEM/ODM đỏ góc trái trên (`ic-oem-odm.svg` mask, 15 %), tên đỏ, ảnh zoom 1.05. ≤ 1120 px: icon OEM/ODM luôn hiện.

### 我们的饮料业务能力 — `.capabilities`
Sau 新发布. `.section-head--wide` (mô tả 1 dòng, không giới hạn rộng) → `.cap-stage` full-bleed:
- `.cap-tabs` (`role="tablist"`): 10 tab chia đều, nền trong suốt, chữ trắng, cao `--cap-tab-h` (45 → 60 px), đè lên đầu slide (`margin-bottom` âm `--cap-tab-h`); tab active nền `--red`. **Sticky**: dính đỉnh màn hình khi cuộn trong section, lùi xuống dưới header khi header sticky hiện (`body:has(.site-header.is-stuck:not(.is-hidden))`), cuộn qua hết section thì trôi đi cùng section. ≤ 1120 px cuộn ngang, tab đang chọn tự canh giữa.
- `.cap-slider` (Swiper fade, `rewind`, lazy-load ảnh slide sau): mỗi slide ảnh `page-{slug}.jpg` cover, cao `--cap-slide-h` (50vw, tối đa 100svh), lớp tối `--overlay-cap` ở đáy; đáy trái tiêu đề danh mục (H3, 900) + mô tả, đáy phải nút `.button--tertiary` 了解更多 (sang trang danh mục). Prev / Next `.nav-button--light` giữa hai bên. ≤ 680 px: ảnh 4 : 3, chữ và nút xuống dưới ảnh trên nền `--dark`.
- ≤ 900 px: ảnh 16 : 9 (đỡ bị cắt ảnh banner ngang) ở trên, tiêu đề / mô tả / nút xuống dưới trên nền `--dark`.
- `CapabilitiesModule`: bấm tab → đổi slide, đổi slide → đổi tab; phím ← → Home End trên thanh tab.

Ảnh danh mục: `assets/images/page-{slug}.jpg` (slug tiếng Anh như URL: fruit-drink, aloe-vera-juice, coconut-products, carbonated-drink, coffee-drink-series, energy-drink-series, milk-series, tea-honey-and-fruit, soft-drink, seed-drink). Dùng cho slide ở đây và page banner của trang danh mục.

### 越南领先的饮料制造商 — `.brand-intro`
Sau section danh mục, nền trắng, `pdb-0` (lead form ngay sau cũng nền trắng). `.brand-intro__banner`: ảnh phòng lab cover (cao `--intro-banner-h`), tiêu đề H2 (900, chữ đen) 2 dòng bằng nhau, mỗi dòng có một `.brand-intro__pill` (viên bo tròn `--pill-bg`, `aria-hidden`): dòng 1 ảnh lon trên băng chuyền (grayscale), dòng 2 hai lon SIZE + DIRECT PRINTING (`label-direct-printing.png`, nền trong suốt).
`.intro-grid` 3 cột: ảnh cao hai bên (`.intro-tile--tall`, span 2 hàng), giữa là `.intro-card` (chữ + nút 了解更多 / 立即咨询) và ảnh `.intro-tile--middle` (542 : 575, quyết định chiều cao lưới). Mỗi ảnh có `.intro-tile__caption` trắng đè đáy. ≤ 1120 px: 2 cột, ảnh thứ 3 full hàng 16 : 9; ≤ 680 px: 1 cột, ảnh 4 : 5.
≤ 1120 px: banner cao `clamp(200px, 36vw, 340px)`; `.intro-card` lên đầu, full hàng; 3 ảnh xếp một hàng tỉ lệ 4 : 5, chú thích nằm dưới ảnh (không đè); ≤ 680 px: 1 cột, ảnh 3 : 2.
`.stats`: 4 chỉ số (`--stat-size` 900 `--ink`, đơn vị đỏ, nhãn `--fs-h4` `--green`), đếm số khi cuộn tới (`CountUpModule`, `data-count`). ≤ 1120 px lưới 2 × 2.

### Các section cuối trang chủ (theo thứ tự, tất cả nền trắng, `pdb-0`; lead form luôn ở cuối trước footer)
- **我们的服务** `.services` → `.service-grid` (2 cột tràn mép, 1 cột ≤ 680 px) gồm 2 `<a class="service-card">` tới `oem-service.html` / `odm-service.html`: ảnh 2 : 1 (`oem-front.jpg`, `odm-front.jpg`), tiêu đề H3 900 + dòng `.service-card__accent` đỏ, mô tả; phần chữ thụt `--page-gutter` từ mép ảnh.
- **国际展会** `.exhibitions`: `.exhi-logos` 10 logo (cao `--exhi-logo-h`, cách nhau `--exhi-gap`) chạy marquee ngang ở mọi kích thước (2 nhóm giống nhau, nhóm `--clone` có `aria-hidden`; một vòng `--exhi-loop` 40 s; dừng khi hover). `.exhi-map` (`map.png`, rộng tối đa `--map-w`) với 11 `.exhi-pin` giống các site RITA khác: `<a>` tới site từng nước (美国 ritadrinks.us, 英国 ritadrinks.co.uk, 俄罗斯 ritabeverages.com, 伊朗 beveragevietnam.com, 阿联酋 ritadrink.com, 中国 ritadrinks.cn, 新加坡 ritadrinks.asia, 印度 ritadrinks.in, 澳大利亚 ritadrinks.com; mở tab mới), 欧洲 và 越南 là `<span aria-hidden>`. `--i` để rơi lần lượt, nhãn hiện khi hover / focus. `ExhibitionModule` cho ghim rơi lại mỗi lần cuộn tới.
- **我们的认证** `.certificates`: `.cert-logos` 2 hàng `.cert-logos__row` (7 + 4). Mỗi logo giữ tỉ lệ gốc của file: `width = --w / 132 × --cert-unit` (`style="--w: {rộng file}"`).
- **为什么选择丽塔？** `.why-us` → `.why-grid` 3 cột (2 ≤ 1120, 1 ≤ 680) gồm `.why-card`: ảnh 430 : 270, tiêu đề `--fs-h5` 900, mô tả `--green`.
- **CTA** `.cta-banner`: khung `.cta-banner__panel` trong container, nền `banner-cta.jpg` + `--overlay-cta`, tiêu đề `--fs-cta` 900 trắng, nút 立即联系 (`#enquiry`); bên phải 3 lon `label-glossy.png` / `label-direct-printing.png` / `label-matte.png` (lon giữa to hơn 1.11 lần, đứng trước, đáy lon bị cắt ở mép dưới). ≤ 900 px xếp dọc.
- **从工厂走向全球市场** `.news.newsJS`: tiêu đề trái + `.nav-button` phải; `.news-slider` Swiper (`NewsSliderModule`) 3 thẻ + hé thẻ thứ 4 tràn ra lề (section `overflow: clip`), 2 thẻ ≤ 1120, 1.15 ≤ 680. Trước khi Swiper chạy, CSS dàn sẵn theo `--news-pv` / `--news-gap` (giữ khớp với breakpoint trong module). `.news-card`: ảnh 440 : 300 (đúng tỉ lệ file `news-*.jpg`, không cắt), tiêu đề `--fs-h5` 700 (hover đỏ), tóm tắt 3 dòng `--text-muted`.

### Thứ tự section trang 我们的故事
Banner → `.story-intro` → `.leadership` → `.production` → `.exhibitions` → `.certificates` → `.why-us` → `.cta-banner` → form liên hệ. Bốn section 国际展会 / 我们的认证 / 为什么选择丽塔？ / CTA dùng chung partial với trang chủ (nội dung giống hệt, sửa một chỗ là cả hai trang đổi).

### Trang 我们的故事 — `.story-intro` (ngay sau banner)
`.section-head` (越南领先的饮料制造商 + mô tả) → `.story-strip.storyStripJS` 9 ảnh full ngang màn hình (`story-01/03/05/06/08/10/12.jpg`, `intro-partners.jpg`, `intro-cans.jpg`; tỉ lệ 275 : 340) → `.stats` (dùng chung partial với trang chủ).
- PC ≥ 1121 px: lưới 9 cột cách nhau `--story-gap`, ban đầu thẳng hàng; cuộn tới (30 % dải ảnh trong màn hình) thì `.is-staggered`: ảnh lẻ lên, ảnh chẵn xuống `--story-offset / 2`, so le từ trái sang (`--i` × 70 ms). Ra khỏi màn hình thì về thẳng hàng để lần sau chạy lại. Dải có `padding-block` = `--story-offset / 2` để ảnh không bị cắt.
- Tablet / mobile: Swiper vuốt ngang (`StoryStripModule`), `--story-pv` ảnh mỗi màn (3.4 tablet, 2.2 mobile), lề đầu / cuối bằng `--page-gutter`; trước khi Swiper chạy CSS dàn sẵn cùng số đo. Swiper bị huỷ khi lên PC và tạo lại khi xuống tablet.

### Trang 我们的故事 — `.leadership` (领导团队与发展愿景)
`.section-head` → `.leader-grid` 2 cột: trái 2 `.value-card` (我们的愿景 / 我们的使命: tiêu đề `--fs-h3` 900 `--green`, chữ canh phải, icon `decor-vision.png` / `decor-mission.png` góc dưới phải); phải `.chairman` chiếm 2 hàng (tên `--fs-h2` 900 `--red`, chức danh `--fs-h5` 700, 2 đoạn trích dẫn, nút 我们的历史 + 立即咨询, ảnh bao bì `ceo-packaging.png` sát đáy thẻ và bị cắt nhẹ). Thẻ viền `--line`, padding `--leader-pad`. ≤ 1120 px: thẻ chủ tịch lên đầu full hàng, 2 thẻ giá trị bên dưới; ≤ 680 px: 1 cột, chữ canh trái.

### Trang 我们的故事 — `.production` (生产流程)
Banner full ngang (`banner-production.jpg`, cao `--production-h`, lớp tối `--overlay-production`), tiêu đề + mô tả trắng canh giữa ở đáy. Dưới banner: `.process-slider` (Swiper, `FitSliderModule`, `data-autoplay="3500"`) 9 bước, bước 01 nằm đầu tiên canh lề trái theo `--page-gutter` (các bước sau hé bên phải), tự chạy 3.5 s tới bước 09 rồi quay về bước 01 (`rewind`), dừng khi hover; đường kẻ đỏ ngang ở mép trên (`.process-slider::before`, full chiều ngang, đứng yên khi lướt), mỗi thẻ có vạch dọc `--tick-h` nối lên đường kẻ. Thẻ `.process-card`: ảnh 3 : 2 với nhãn đỏ `步骤 0N` góc trái trên, tiêu đề `--fs-h5` 700, mô tả. Số thẻ nằm trọn trong vùng nội dung `--process-pv` (PC 4 thẻ trọn, thẻ thứ 5 hé ở lề phải; tablet 2.2, mobile 1.15 để thẻ sau vẫn hé vì lề ≈ khoảng cách giữa thẻ; JS tự quy đổi ra `slidesPerView`), khoảng cách `--process-gap`; trước khi Swiper chạy CSS dàn sẵn cùng vị trí.

### Trang 我们的历史 — `.history` (从2004年走向全球市场)
Thứ tự trang: banner → `.history` → `.cta-banner` (partial chung) → form. Dữ liệu 14 mốc (2004 → 2026, ảnh `history-{năm}.jpg`) nằm trong script dựng trang, mỗi mốc một `.history-card`: chấm đỏ vuông `--history-dot` trên đường kẻ `--line-strong`. Đường kẻ là `.history-slider::before`: một đường duy nhất full chiều ngang màn hình, đứng yên khi lướt (chỉ thẻ trượt), năm `--fs-h4` 900 `--red`, ảnh 420 : 340, tiêu đề `--fs-h5` 700, mô tả.
- Slider `FitSliderModule` (`data-pv="--history-pv"`, `data-gap="--history-gap"`): PC 4 mốc trọn trong vùng nội dung, mốc sau hé bên phải; tablet 2.2, mobile 1.15. Không tự chạy (người xem tự lướt). Bên dưới: thanh tiến trình đỏ `.history__progress` (Swiper `progressbar`) + nút ‹ ›; bàn phím ← → cũng chuyển được.
- Khi cuộn tới (`InViewModule`, `.is-observed` / `.is-inview`): đường kẻ full màn hình vẽ từ trái sang (`--dur-line`) và chấm đỏ hiện lần lượt (trễ theo `--i`, tối đa 6 bước); ra khỏi màn hình thì thu lại để lần sau chạy lại.

### Slider dùng chung — `FitSliderModule`
Hook `.fitSliderJS` + `data-pv` (token số thẻ nằm trọn trong vùng nội dung) + `data-gap` (token khoảng cách) + tuỳ chọn `data-autoplay` (ms, kèm `rewind`). Điều khiển tìm trong cùng section: `.fitPrevJS`, `.fitNextJS`, `.fitProgressJS`. Thẻ đầu canh lề trái theo `--page-gutter`; JS quy đổi ra `slidesPerView`. Trước khi Swiper chạy, CSS dàn sẵn bằng cùng công thức.

### Trang 我们的证书
Thứ tự: banner → `.cert-system` → `.cert-list` → `.cta-banner` (partial chung) → form. Dữ liệu chứng nhận (tên tiếng Trung, logo `cef-logo-*.png`, bản scan `cef-digicert_*.webp`) nằm trong script dựng trang.
- `.cert-system` (国际认证体系), dạng số liệu, phẳng: `.section-head` + `.cert-stats`: 4 chỉ số (11 项国际认证 · 3 大认证体系 · 180+ 出口国家和地区 · 20+ 年品质管理经验), không kẻ viền (giống hàng chỉ số các trang khác), 4 cột cách nhau `--gap-lg`; dùng markup `.stat` nên `CountUpModule` đếm số. Đơn vị chữ Hán dùng `.stat__unit--word` (0.42 em, canh đáy). Mỗi chỉ số có dòng giải thích `.cert-stat__desc`. ≤ 900 px: 2 × 2.
- `.cert-list` (证书一览): `.cert-grid.loadMoreListJS` 11 `.cert-tile` (4 / 3 / 2 cột; ô có bản scan đứng trước, IFS và SMETA cuối), hiện 8 đầu (4 trên mobile), nút `.loadMoreBtnJS` 查看更多证书 hiện phần còn lại (`LoadMoreModule`, `.is-revealed` trồi lên so le). Ô có bản scan là `<a data-fancybox="certificates">`: ảnh thu nhỏ `cef-thumb-*.jpg` (480 px) trong khung `.cert-tile__photo` tỉ lệ A4 (1 : 1.414, `object-fit: contain`) đặt trên nền `--surface` đệm `--frame-pad` đều 4 phía, tên thẳng mép ảnh, bấm mở bản scan gốc trong Fancybox (`LightboxModule`, giao diện tiếng Trung); hover viền đỏ. IFS và SMETA chưa có bản scan: ô `.cert-tile--logo` không bấm được, ghi 证书副本可按需提供.
- Fancybox chỉ nạp ở trang có `fancybox => 1` trong script dựng trang (CSS qua `{{EXTRA_HEAD}}`, JS qua `{{EXTRA_SCRIPTS}}`).

### Trang 我们的奖项 — `.awards` (荣誉与认可)
Thứ tự: banner → `.awards` → `.exhibitions` → `.cta-banner` (partial chung) → form. Dữ liệu 8 giải (2026年巴黎国际食品展 / 2026年泰国国际食品展; dịch từ ritadrinks.co.uk, tên và dung tích theo ảnh lon) nằm trong script dựng trang.
- `.award-grid` 4 / 3 / 2 cột. Concept "lon trồi khỏi khung" cho ảnh lon tách nền: mỗi `.award-card` (`<button class="awardOpenJS" data-award="N" aria-haspopup="dialog">`, không viền) có khung vuông `.award-card__stage`: nửa trên trắng, nửa dưới là khối màu phẳng `--tint` (màu nhạt theo lon, khai báo inline trong dữ liệu); lon `award-can-N.webp` cao 76 % khung, đứng cách đáy 8 %, vươn từ khối màu lên vùng trắng. Huy hiệu SIAL (đen) ở góc trái trên, trong vùng trắng. Bên dưới khối: tên hội chợ (`--fs-small` xám), tên giải (`--fs-h6` 900 đỏ), tên sản phẩm. Hover: lon nhô lên 4 % và phóng 1.04, tên sản phẩm đỏ.
- `.award-dialog` (`<dialog>`, `AwardsModule`): nền trắng, không bóng, rộng tối đa `--award-dialog-w`; cao cố định `--award-dialog-h` (không đổi khi chuyển giải nên không bị giật), phần chữ tự cuộn bên trong; mỗi giải một `.award-detail` (ẩn / hiện): bố cục lưới 2 cột bằng nhau 50 : 50 (`.award-detail` là `display: contents`): cột trái tô kín `--tint`, lon cao 72 % cột, nhãn thành phố + cờ (nền trắng) góc trái trên, huy hiệu đen góc phải trên; cột phải là phần chữ canh giữa theo chiều dọc (cuộn nếu dài) và bên dưới là thanh `.award-dialog__bar` với nút 立即咨询 dùng chung. Nút ‹ › (`.award-dialog__arrows`, phủ lên cột ảnh) nằm ở mép trái / phải ảnh sản phẩm, canh giữa dọc; số 1 / 8 ở giữa đáy cột ảnh; phải tên hội chợ, tên giải đỏ `--fs-h3` 900, sản phẩm, mô tả, bảng 3 ô (容量 / 包装 / 起订量) kẻ 1 px. Nút 立即咨询 đóng cửa sổ rồi tới `#enquiry`. Phím ← → cũng chuyển; đóng bằng X, Esc hoặc bấm nền tối; khoá cuộn trang khi mở (`body:has(.award-dialog[open])`). ≤ 900 px: khối lon cao `--award-media-h-sm` ở trên, chữ cuộn ở giữa, thanh nút ghim dưới cùng (kẻ trên `--line`); ≤ 680 px: cửa sổ toàn màn hình.

### Trang 我们的活动 — `.activities` (企业文化与员工活动)
Thứ tự: banner → `.activities` → `.cta-banner` (partial chung) → form; trang có `fancybox => 1`. Dữ liệu (ảnh `activity-N.jpg`, tên tiếng Trung) nằm trong script dựng trang. Không dùng ảnh khai công (`activity-15`) và cúng Vu Lan (`activity-10`) theo yêu cầu.
- `.activity-grid` 12 thẻ rời nhau kiểu ảnh chụp lấy liền (4 cột × 3 hàng PC, 3 cột ≤ 1120 px, 2 cột ≤ 680 px; khoảng cách `--gap-lg` dọc, `--gap-md` ngang). Mỗi `.activity-card` (`<a data-fancybox="activities">`): nền trắng, viền 1 px `--line`; `.activity-card__media` là khung nền `--surface` đệm `--frame-pad` (= nửa `--gap-md`, dùng chung với ô chứng nhận), bên trong `.activity-card__photo` ảnh 4 : 3; tên `--fs-h6` 700 trên nền trắng, đệm dọc `--gap-md`, ngang `--frame-pad` để thẳng mép ảnh. Không nhãn nhóm. Hover viền đỏ, ảnh phóng 1.06 trong khung, tên đỏ.

### Trang 我们的品牌 — `.brands` (不止代工，更有自有品牌)
Thứ tự: banner → `.brands` → `.cta-banner` (partial chung) → form. Dữ liệu 3 thương hiệu (丽塔 / Trobico / TroBest; nội dung dịch từ ritadrinks.co.uk) nằm trong script dựng trang. Tên Trobico, TroBest là tên riêng nên giữ chữ Latin; 丽塔 viết tiếng Trung.
- `.brand-list`: 3 `.brand-row` cách nhau `--gap-lg`, mỗi hàng viền 1 px `--line`, nền trắng, lưới 5 : 7 (ảnh : chữ), mọi hàng ảnh bên trái (không so le). Ảnh vuông `brand-*-1.jpg` cover (giữ JPG vì WebP không nhẹ hơn), hover phóng 1.04.
- `.brand-row__body` (đệm `--brand-pad`, canh giữa dọc): H3 là logo `brand-*.png` (cắt theo đúng vùng có hình + 2 px, không được cắt lẹm chữ / dấu ®; cao `--brand-logo-h`, `alt` là tên thương hiệu) → định vị (`--fs-h3` 900 đen) → mô tả (`--fs-body`, `--green`). Không đánh số thứ tự, không nút CTA (CTA nằm ở `.cta-banner` và form bên dưới).
- Hiệu ứng xếp chồng khi cuộn: mỗi `.brand-row` là `position: sticky`, `top` = `--brand-stack-top` + `--stack` (thứ tự 0, 1, 2 ghi inline trong markup) × `--brand-stack-step` (20 px). Thẻ sau trượt lên phủ thẻ trước, thẻ trước lộ một dải 20 px phía trên tạo cảm giác chồng lớp. `--brand-stack-top` = `--gap-lg`, cộng thêm chiều cao header khi header đang hiện (`body:has(.site-header.is-stuck:not(.is-hidden))`, ≤ 1120 px dùng `--hd-mobile-h` + `--gap-md`), đổi bằng transition `top`. Ảnh có `max-height` theo `100svh` để cả thẻ luôn nằm gọn trong màn hình; màn hình thấp hơn 640 px thì tắt sticky. Chữ trong thẻ trồi lên so le (`RevealModule`); ảnh không có hiệu ứng trượt riêng.
- Hiệu năng: chỉ banner tải ngay, ảnh thương hiệu và logo `loading="lazy" decoding="async"` có `width` / `height`; hiệu ứng chỉ dùng `position: sticky`, `opacity`, `translate`, `scale` (không gắn sự kiện cuộn riêng).
- ≤ 680 px: mọi hàng xếp dọc, ảnh lên trên với tỉ lệ 16 : 9 cho thẻ thấp, vừa màn hình khi xếp chồng.

### Trang 产品展示 / 搜索结果 — `.catalog`
`products.html`, `searching.html` và `product-category.html` dùng chung partial `catalog`, chỉ khác page banner (产品展示 / 搜索结果 / tên danh mục). Bản tĩnh hiện cùng một danh sách mẫu ở cả 3 trang, không lọc theo danh mục; ở trang danh mục, `?category=` trên URL tự đánh dấu sẵn lựa chọn tương ứng trong drawer 筛选. Thứ tự: banner → `.catalog` → form. Dữ liệu (20 sản phẩm mẫu, lựa chọn bộ lọc) nằm trong script dựng trang; có "Ghi chú bàn giao backend" trong partial. Không kẻ ô kiểu bảng như bản tham chiếu beveragevietnam.com.
- `.catalog-bar` (thanh công cụ, `position: sticky` dưới header, nền trắng, chỉ kẻ dưới `--line`, đệm dọc `--catalog-bar-pad`), lưới 3 phần đối xứng: trái là nút 筛选 (`ic-filter`, kèm huy hiệu đỏ đếm số lựa chọn); giữa là `.nav-button` ‹ › kẹp dòng "共 N 款产品，当前第 1–20 款" (`--fs-small`, số đậm, không hiện số trang "1 / 3"); phải là nút 排序 (`ic-sort`). Hai nút là `button--tertiary` cao `--page-btn` có icon; nút đang mở drawer nền đen. Tự dịch xuống dưới header khi header hiện; trượt ẩn khi phân trang cuối danh sách vào màn hình (`CatalogModule`, IntersectionObserver, không gắn sự kiện cuộn). Form bọc thanh + 2 drawer là `display: contents` để thanh dính theo cả section.
- Danh sách dùng đúng `.release-grid` + `.release-card` của mục 新发布 trang chủ (5 / 4 / 2 cột, cùng khoảng cách, cùng hiệu ứng trồi lên); không thêm chi tiết riêng để hai nơi luôn đồng bộ. Luật ẩn bớt thẻ trên tablet / mobile chỉ áp cho `.releases` ở trang chủ.
- `.pagination` (phân trang số, cuối danh sách): ô vuông `--page-btn`, viền `--line`, trang hiện tại nền đỏ chữ trắng, hover nền đen; hai đầu là `.nav-button` (kích thước lấy theo `--page-btn`). Có sẵn `.pagination__gap` cho dấu "…".
- `.catalog-drawer` (`<dialog>` mở bằng `showModal()`, trượt từ phải giống menu, nền tối `--overlay-menu`, rộng `--drawer-w`, mobile toàn màn hình): đầu là tiêu đề canh trái (`--fs-h4` 700) + nút X; thân cuộn riêng; các nhóm có tiêu đề canh trái: 产品名称 (ô tìm kiếm), 产品类别 và 包装 (2 cột), 容量 (3 cột, hiện 12 lựa chọn đầu + nút 查看更多 / 收起). Lựa chọn là `.catalog-option`: nút radio tròn dùng chung kiểu với radio trong form liên hệ (viền `--line`, chấm đỏ khi chọn) + chữ `--fs-body`; đang chọn thì chữ đỏ đậm, bấm lại để bỏ chọn. Chân là 2 nút 清除 (`button--tertiary`) và 应用 (`button--secondary`). Drawer 排序 có 4 lựa chọn: 最新上架 / 最多浏览 / 名称升序 / 名称降序. Tên tham số và giá trị giống form tìm kiếm trên header (q, category, packaging, size) nên kết quả tìm kiếm từ header tự đánh dấu lại trong drawer. Khoá cuộn trang khi mở (`body:has(.catalog-drawer[open])`); Esc, nút X hoặc bấm nền tối để đóng.
- ≤ 680 px: ẩn phần "当前第 1–20 款"; 2 nút 筛选 / 排序 chỉ còn icon (chữ ẩn cho trình đọc màn hình, huy hiệu nằm ở góc nút).

### Trang chi tiết sản phẩm — `product-detail.html`
Không có page banner: header nền trắng → crumb bar (产品展示 › 功能饮料系列 › tên sản phẩm) → `.product-overview` → `.product-story` → `.related` → form; thêm `.sticky-cta` cố định đáy màn hình. Trang có `fancybox => 1` và `own_h1 => 1` (H1 là tên sản phẩm, không thêm H1 ẩn). Dữ liệu nằm trong script dựng trang; sản phẩm mẫu đặt theo ảnh `product-detail.jpg` (黄瓜青柠味电解质饮料 490毫升罐装).
- `.product-overview`: lưới 2 cột bằng nhau, cách `--product-gap`. Trái `.product-media` dính theo cuộn: cách mép trên `--gap-lg`, khi header hiện thì cộng thêm chiều cao header (transition `top`) để khoảng cách luôn đều: khung vuông viền `--line`, ảnh `contain` đệm 6 %, không gắn huy hiệu OEM / ODM lên ảnh (đã có ở ô dịch vụ bên phải), bấm phóng to bằng Fancybox, hover viền đỏ + ảnh phóng 1.04. Phải `.product-info`: nhãn danh mục (`.product-info__tag`, viền mảnh, link về danh mục) → H1 (`--fs-title` 900) → mô tả ngắn → `.product-perks` 4 ô rời, mỗi ô viền kín 1 px `--line`, cách nhau `--gap-sm` (icon đỏ `ic-oem-odm` / `ic-free-sample` / `ic-free-label` / `ic-flexible-moq` + chữ `--fs-small` 700) → 产品信息 (`.product-specs`, bảng `dl` đóng khung kín: viền ngoài, kẻ giữa các dòng và giữa 2 cột, nhãn đậm, giá trị `--green`; không dùng kiểu chỉ kẻ ngang hở hai đầu; dòng 离岸价 là link 获取最新报价 tới form) → 口味 (`.product-flavors`, mỗi vị là link `.product-flavors__link` tới sản phẩm vị đó: ô vuông viền `--line` chứa icon `flavor/*.png` + tên; hover viền đỏ, icon phóng 1.15, chữ đỏ; vị hiện tại có `aria-current` viền + chữ đỏ đậm) → 认证 (ghi chú + hàng logo `cef-logo-*.png` cao `--cert-logo-h`, `alt` tiếng Trung) → 2 nút 立即咨询 (`#enquiry`) và 下载产品目录 (mở `brochure.html` của rita.com.vn). Tiêu đề các khối là H2 `--fs-h5` 700, cách nhau `--product-block-gap`.
- `.product-story` (产品介绍): không khung, không viền, không đệm (nội dung thẳng mép container); nội dung `.content-detail` (xem mục riêng) thu gọn ở `--story-collapsed-h` với lớp mờ `--fade-white` phía dưới; nút 查看更多 / 收起 (`button--secondary`) mở / thu (`ProductDetailModule`); nội dung ngắn thì tự bỏ nút.
- `.related` (相关产品): đầu section giống tin tức trang chủ (tiêu đề + 2 `.nav-button`); slider Swiper (`RelatedSliderModule`) dùng thẻ `.release-card` như trang chủ, 5 / 4 / 2.2 thẻ, khoảng cách theo `--gap-sm`; trượt vào từ phải khi cuộn.
- `.sticky-cta`: thanh trắng kẻ trên `--line` cố định đáy, hiện khi 2 nút trong `.product-info` đã cuộn qua và ẩn lại khi tới form liên hệ (IntersectionObserver); gồm ảnh nhỏ, tên sản phẩm (`--fs-h6` 700, cắt bằng "…") và 2 nút; nút về đầu trang tự nâng lên trên thanh. ≤ 680 px chỉ còn ảnh + nút 立即咨询 kéo giãn.
- ≤ 900 px: xếp dọc, ảnh không dính, rộng tối đa 520 px canh giữa. ≤ 680 px: `.product-perks` 2 × 2.

### Trang 新闻 — `blog.html`
Thứ tự: banner → `.featured` (精选资讯) → `.blog-list` (最新资讯) → form. Dữ liệu bài viết nằm trong script dựng trang; có "Ghi chú bàn giao backend" trong partial. Không dùng ảnh có chữ tiếng Ả Rập (`news-0.jpg`, `blog-detail-cover.jpg`) cho trang tiếng Trung; `news-10.jpg` (660 × 450) cắt từ banner hội chợ.
- Mọi ảnh bài viết (bài lớn, bài nhỏ, thẻ danh sách và thẻ tin tức trang chủ) cùng tỉ lệ `--post-ratio` 440 : 300 (gần 3 : 2, đúng kích thước ảnh tin tức gốc nên gần như không bị cắt).
- `.post-meta` (dùng chung): danh mục đỏ 700 + ngày dạng 2026年9月28日 (`<time datetime>`), `--fs-small`, ngày màu `--gray`.
- `.featured`: `.section-head` canh giữa → lưới 7 : 5 cách `--featured-gap`. Trái `.featured-lead`: ảnh `--post-ratio` → meta → H3 `--fs-h3` 900 → tóm tắt `--fs-body` → nút 阅读全文 (`button--secondary`). Phải `.featured-list`: 3 `.featured-item` cách nhau `--gap-lg`, mỗi bài là ảnh `--post-ratio` (2 phần) + chữ (3 phần): meta + tiêu đề `--fs-h5` 700 tối đa 3 dòng. Không kẻ ô. Hover ảnh phóng 1.04, tiêu đề đỏ.
- `.blog-list`: đầu section tiêu đề trái + dòng "共 N 篇文章，当前第 1–9 篇" bên phải (`--fs-small`) → `.post-grid` 3 / 2 / 1 cột (dòng cách `--post-row-gap`) dùng đúng `.news-card` của trang chủ, thêm `.post-meta` trên tiêu đề → `.pagination` dùng chung với trang sản phẩm (có `.pagination__gap` "…").
- Hiệu ứng: bài lớn trồi lên, 3 bài nhỏ trượt từ phải, thẻ danh sách trồi lên so le.
- ≤ 900 px: phần nổi bật xếp dọc. ≤ 680 px: danh sách 1 cột, tiêu đề bài nhỏ `--fs-h6`.

### Trang chi tiết bài viết — `blog-detail.html`
Không có page banner: header nền trắng → crumb bar (新闻 › tiêu đề) → `.post` → `.news` (相关资讯, dùng lại slider tin tức trang chủ, thẻ có `.post-meta`) → form. Trang có `own_h1 => 1` (H1 là tiêu đề bài). Refactor từ blog-detail của ritadrinks.co.uk; nội dung bài dịch sang tiếng Trung và dùng đủ các thẻ của `.content-detail` (h2, h3, ul, ol, bảng, trích dẫn, ảnh có chú thích, hỏi đáp). Ảnh bìa `blog-detail-01.jpg` (không dùng `blog-detail-cover.jpg` vì có chữ tiếng Ả Rập).
- `.post-header` canh giữa: `.post-meta` (danh mục là link về 新闻, ngày, tác giả 丽塔食品饮料有限公司) → H1 `--fs-title` 900, rộng tối đa 24 em; `word-break: keep-all` + `overflow-wrap: anywhere` để tiêu đề tiếng Trung chỉ xuống dòng ở dấu câu / khoảng trắng (không tách đôi một từ như 攀|升), quá hẹp mới ngắt giữa chữ. Tiêu đề bài lớn ở trang 新闻 dùng cùng cách này.
- `.post-layout` 3 cột: mục lục `--toc-w` | bài viết | cột phụ `--post-side-w`, cách nhau `--post-gap`. Bài viết: ảnh bìa tỉ lệ `--post-ratio` → `.content-detail` → `.post-footer` (kẻ trên `--line`): 分享文章 + 4 ô vuông viền kín `--share-size` (脸书, 领英, X, 复制链接; hover viền đỏ, đã chép thì nền đỏ, có dòng trạng thái cho trình đọc màn hình) và nút 返回新闻列表.
- `.toc` (目录, `<details>`): ô viền kín, dính theo cuộn (cách mép trên `--gap-lg`, cộng chiều cao header khi header hiện), tự cuộn bên trong nếu dài. `PostModule` tạo mục lục 2 cấp từ các h2 và h3 trong bài, không đánh số: h3 thụt vào dưới h2 của nó trong nhóm thu gọn được (`.toc__sub-wrap`, mở / đóng bằng nút mũi tên `.toc__toggle` cạnh h2, chuyển động bằng `grid-template-rows`; nhóm đóng thì `inert`). Chỉ mở một nhóm một lúc. Mục đang đọc được đánh dấu bằng IntersectionObserver (chữ đỏ đậm, `aria-current="location"`), nhóm chứa nó tự mở và các nhóm khác tự đóng; khi đang ở một h3 thì h2 cha cũng đỏ (`.is-parent`); khung mục lục dài thì tự cuộn tới mục đang đọc; ≥ 1121 px luôn mở, nhỏ hơn thì đóng sẵn và tự đóng khi bấm một mục.
- `.post-side`: chỉ có `.latest-posts` (最新资讯, ô viền kín, 4 bài: ảnh `--post-ratio` + tiêu đề `--fs-small` 700 tối đa 3 dòng + ngày; hover ảnh phóng, tiêu đề đỏ), dính theo cuộn giống mục lục. Không đặt khối kêu gọi liên hệ trong cột phụ.
- ≤ 1120 px: 1 cột (mục lục thu gọn ở trên → bài viết → 最新资讯 chia 2 cột), bỏ dính. ≤ 680 px: 最新资讯 1 cột, chân bài xếp dọc.

### Trang 联系我们 — `contact.html`
Thứ tự: banner → `.contact` → `.faq` → form. Refactor từ contact của ritadrinks.co.uk; dữ liệu nằm trong script dựng trang, số điện thoại / email / địa chỉ giống footer.
- `.contact`: `.section-head` canh giữa → lưới 50 : 50. Trái `.contact-cards` 2 cột: mỗi `.contact-card` là ô viền kín `--line` (ô vuông đỏ `--contact-icon` chứa icon nét mảnh trắng, nhãn `--fs-small` xám, giá trị `--fs-h6` 700); địa chỉ và email chiếm cả hàng (`--wide`); hover link đỏ, ô viền đỏ. Phải `.contact-map`: iframe Google Maps (giao diện tiếng Trung, `loading="lazy"`, đặt `absolute` phủ kín khung) trong khung viền kín; trên PC khung cao đúng bằng cột ô liên hệ (không đặt chiều cao riêng để hai bên luôn bằng nhau), khi xếp dọc (≤ 1120 px) mới dùng `--map-min-h`.
- `.faq` (常见问题): lưới 5 : 7. Trái tiêu đề canh trái + mô tả + nút 我要提问 (`button--secondary`, tới form), không có ảnh; cột này dính theo cuộn (cách mép trên `--gap-lg`, cộng chiều cao header khi header hiện). Phải 7 câu hỏi `<details name="faq">` (mở câu này thì câu khác tự đóng, câu đầu mở sẵn): ô viền kín, đang mở thì viền đen; dấu + chuyển thành − khi mở; nội dung trượt mở bằng `::details-content` (trình duyệt chưa hỗ trợ thì mở ngay, không lỗi).
- ≤ 1120 px: các ô liên hệ lên trên, bản đồ xuống dưới. ≤ 900 px: FAQ 1 cột, cột trái không dính. ≤ 680 px: ô liên hệ 1 cột.

### Trang OEM 服务 / ODM 服务 — `oem-service.html`, `odm-service.html`
Refactor từ oem-service / odm-service của ritadrinks.co.uk (beveragevietnam.com, ritadrink.com, ritadrinks.in cùng khung). Hai trang cùng thứ tự, chỉ khác nội dung 3 partial riêng (`oem-*` / `odm-*`): banner → `.service-intro` → các bước (`.history`) → `.production` (partial của 我们的故事) → `.why-us` (partial trang chủ) → `.formats` → `.finishes` → `.cta-banner` → `.faq` → form. Dữ liệu nằm trong script dựng trang.
- `.service-intro`: `.section-head` → `.service-steps` 4 / 2 cột: ảnh 4 : 3 (`oem-01…04`, hover phóng 1.04) → tiêu đề `--fs-h5` 700 → mô tả; không đánh số. OEM: 您的配方，我们来生产; ODM: 成熟配方，打造您的品牌.
- `.milestones` (OEM 从构想到上架只需3个月 / ODM 从概念到市场), refactor từ section "How your beverage is produced" của ritadrinks.co.uk nhưng nét vuông: 9 bước xếp lưới 3 cột chạy hình rắn (hàng 1 trái → phải, hàng 2 phải → trái…; `MilestonePathModule` gán `--col` / `--row`). Một đường SVG nối tâm các ô số `.milestone__dot` (ô vuông `--milestone-dot`, viền 2 px `--line-strong`), đi vào từ mép trái màn hình, quay đầu bằng góc vuông 90° ở hai mép container (không bo cong) và đi ra mép màn hình ở bước cuối; nét nền đứt xám `6 6`, nét chính đỏ 2 px đầu vuông, góc `miter`. Nét đỏ tự vẽ theo cuộn (cuộn lên thì rút lại); đường chạy tới bước nào thì ô số đổi nền đỏ chữ trắng và tiêu đề, mô tả, nhãn thời gian (`.milestone__tag`, ô viền đỏ, đặt cuối thẻ để tiêu đề thẳng hàng) mới hiện. Chỉ nghe sự kiện cuộn khi section ở gần màn hình (IntersectionObserver), mỗi khung hình chỉ đổi `stroke-dashoffset` và class. Không có JS thì mọi bước hiện bình thường, không có đường. ≤ 900 px: 2 cột. ≤ 680 px: 1 cột, ô số bên trái, đường thẳng đứng.
- `.formats` (包装形式与规格, `FormatsModule`): lưới 50 : 50. Trái: khung ảnh viền kín cao bằng cột phải (tối thiểu `--format-stage-min`), slider Swiper gồm ảnh chai / lon, ảnh khay / thùng, ảnh các loại container và bảng 集装箱装载量 (20英尺 / 40英尺 / 40英尺高柜: dài, rộng, cao, số lượng đỏ); ảnh sản phẩm nhỏ được phóng tối thiểu `--format-shot-min`; dưới là 4 ô ảnh nhỏ 4 : 3 (đang chọn viền đỏ). Phải: 包装形式 4 ô (icon + 铝罐 / 玻璃瓶 / 聚酯塑料瓶 / 聚丙烯塑料瓶) và 规格 (ảnh + tên dung tích), ô đang chọn viền + chữ đỏ; dòng 最低起订量：一个20英尺集装箱. Chọn 定制规格 thì khung ảnh đổi thành khối 没有您需要的规格？ + nút 定制您的规格 (tới form). Dữ liệu từng quy cách (ảnh, số lượng xếp container) là JSON `.formatsDataJS` trong partial.
- `.finishes` (您的标签，您的品牌印记): 3 ô viền kín (亮光标签 / 哑光标签 / 罐身直印), ảnh lon cao `--finish-media-h`, hover viền đỏ. ≤ 680 px mỗi ô thành hàng ngang ảnh trái, chữ phải.
- `.faq`: dùng chung kiểu FAQ của trang 联系我们 (7 câu riêng cho OEM / ODM).
- ≤ 1120 px: phần bao bì 1 cột, 4 bước 2 cột. ≤ 680 px: 包装形式 2 cột, 规格 3 cột.

### Nội dung soạn thảo — `.content-detail`
Dùng cho mọi khối nội dung từ CMS (bài viết tin tức, giới thiệu sản phẩm). Refactor từ `content-detail.css` của ritadrinks.co.uk / beveragevietnam.com, đổi sang token của dự án; style theo thẻ HTML nên backend chỉ cần đổ HTML vào, không phải thêm class.
- Chữ `--fs-body` `--green`, line-height `--lh-body`; phần tử đầu không có khoảng trên. Các khối (p, ul, ol, dl, figure, blockquote, table, pre, iframe, video) cách nhau `--gap-md`; tiêu đề cách khối trước `--content-head-gap`, cách khối ngay sau `--gap-sm`.
- Tiêu đề trong nội dung đều 700 chữ `--ink` (vai trò tiêu đề thẻ, không dùng 900): h1, h2 `--fs-h4`; h3 `--fs-h5`; h4 `--fs-h6`; h5, h6 `--fs-body`.
- Link đỏ gạch chân, hover chữ đen; strong / b chữ `--ink` 700. ul chấm tròn, ol số, dấu đầu dòng màu đỏ, danh sách lồng nhau cách 8 px.
- Ảnh: `max-width: 100%`; ảnh nằm trực tiếp trong `figure` hoặc `p` kéo full chiều rộng; figcaption `--fs-small` `--gray`.
- blockquote là ô đóng kín: viền `--line`, cạnh trái 3 px đỏ, nền `--surface`, chữ `--ink` 700.
- Bảng đóng khung kín (viền mọi ô `--line`), th nền `--surface` chữ đậm, caption `--fs-small` xám phía trên. `ContentTableModule` tự bọc mỗi bảng trong `.content-detail__table`, đặt độ rộng tối thiểu theo số cột (`--content-col-min` × số cột) và cho cuộn ngang khi hẹp; bảng đang cuộn được thì nhận `tabindex`, `role="region"`, nhãn 可横向滚动的表格 để dùng bàn phím.
- iframe / video 16 : 9 full chiều rộng; pre ô đóng kín nền `--surface`; hr kẻ 1 px `--line`.
- ≤ 680 px: thụt lề danh sách 1.25 em, ô bảng đệm 10 × 12 px.

### Breadcrumb — `.breadcrumbs`
`<ol>` trong `.crumb-bar` (`role="navigation"`): icon nhà, mũi tên xám, link xám (hover đỏ), mục cuối `aria-current="page"` màu `--green`, dài thì cắt `…`.

### Lead form — `.enquiry`
Cuối `<main>` mọi trang (`#enquiry`). Tiêu đề giữa, lưới 2 cột (1 cột ≤ 680): 姓名, 电子邮箱, 电话 / WhatsApp, 国家/地区, 感兴趣的产品, 服务需求 (radio), 留言, nút `立即联系`.

### Về đầu trang — `.back-to-top`
Nút vuông cố định sát góc dưới phải màn hình (cách mép `--float-gap`, 12 → 20 px, nằm ngoài lề nội dung để không đè lên thẻ), cỡ `--btn-h`, nền `--black`, mũi tên trắng (`ic-dropdown.svg` xoay 180°), hover / focus nền `--red`. Hiện khi đã cuộn quá một màn hình (`BackToTopModule`, `.is-visible`), bấm thì cuộn mượt về đầu trang; bấm bằng bàn phím thì focus về logo. Nằm ngay sau `</footer>` trên mọi trang.

### Footer — `.site-footer`
Logo + ô Alibaba / QR · 4 cột: thông tin công ty (`<dl>`), liên hệ (`<dl>`), 快速链接, 我们的饮料制造实力 (2 cột) · thanh `--dark` với bản quyền và icon mạng xã hội.

### Hiệu ứng theo cuộn — `RevealModule`
- Danh sách phần tử nằm trong `RULES` của `js/modules/RevealModule.js` (selector, kiểu, độ trễ so le). Module gắn `data-reveal` và thêm `.reveal-ready` vào `<html>`; không có JS thì mọi thứ hiện bình thường.
- Kiểu: `up` (trồi lên `--reveal-shift`), `left` / `right` (trượt ngang), `zoom` (0.8 → 1), `zoom-out` (ảnh nền 1.15 → 1), `rise` (lon trồi lên 35 %). Thời gian `--dur-reveal`, easing `--ease-out`.
- Lúc tải trang, trạng thái ẩn được áp ngay (`.reveal-instant`, không transition) để phần tử đang hiện không bị mờ đi rồi hiện lại.
- Hai chiều: ra khỏi màn hình thì ẩn lại; ra phía trên thì nhận `.is-above` để lần sau đi xuống vào chỗ, ra phía dưới thì lần sau trồi lên. Các phần tử vào cùng lúc được so le theo thứ tự trên → dưới, trái → phải (tối đa 8 bước).
- Không tắt theo `prefers-reduced-motion` (máy dùng để duyệt site đang bật chế độ này của Windows).
- Không gắn hiệu ứng cho phần tử có `transform` riêng (ghim bản đồ, slide Swiper); với khối lớn có ảnh bên trong, quan sát khối ngoài và animate phần tử con (`children`) để tránh bật / tắt liên tục ở mép màn hình.
- Ghim bản đồ và con số chỉ số cũng chạy lại mỗi lần cuộn tới.
- Form liên hệ (`.enquiry`, kể cả tiêu đề) giữ tĩnh, không gắn hiệu ứng.

## 6. Nội dung

- Toàn bộ chữ hiển thị là tiếng Trung giản thể. Không viết tên thương hiệu bằng chữ Latin (không "RITA", "RITA Beverage"): dùng 丽塔 / 丽塔饮料 / 丽塔食品饮料有限公司.
- Chữ Latin chỉ còn: số, thuật ngữ OEM / ODM, email, số điện thoại, "WhatsApp" và địa chỉ công ty (site tiếng Trung hiện tại cũng để địa chỉ tiếng Anh).
- Đơn vị viết bằng chữ Hán: 330毫升、1.5升; bao bì 聚酯塑料瓶 / 聚丙烯塑料瓶 (không PET / PP).

## 7. Tài nguyên

- Ảnh JPG đưa lên site phải nén trước: bỏ metadata, màu 4:2:0, chất lượng tương đương `ffmpeg -q:v 5` (banner rộng 2268 px khoảng 250–400 KB, ảnh nhỏ dùng `-q:v 4`). Giữ nguyên kích thước để `width` / `height` trong HTML vẫn đúng.
- Ảnh lấy từ beveragevietnam.com, ritadrinks.in, ritadrinks.co.uk; thư viện JS từ beveragevietnam.com (`assets/library`). Trang chỉ nạp Swiper, SmoothScroll và `js/main.js`.
- Ảnh dưới màn hình đầu: `loading="lazy" decoding="async"`, luôn có `width` / `height`.
- Icon SVG tô màu bằng `mask` + `background: currentColor`.
