// Ghi chú bàn giao backend:
// Bản HTML tĩnh chỉ có một trang product-category.html, nên module này đọc ?category= trên URL
// (tương đương $_GET['category']) và lấy dữ liệu trong <script class="categoryDataJS"> để đổi
// ảnh banner, H1, breadcrumb, tiêu đề tab và mục menu đang chọn.
// Khi làm backend: render các phần này phía server theo $_GET['category'], rồi bỏ module này,
// khối JSON categoryDataJS và các class categoryImageJS / categoryNameJS.
// Slug không có trong danh sách (hoặc không có ?category=) thì giữ nguyên nội dung mặc định (果汁饮料).

export default function CategoryPageModule() {
  const source = document.querySelector(".categoryDataJS");
  if (!source) return;

  const slug = new URLSearchParams(window.location.search).get("category")?.trim();
  if (!slug) return;

  let categories = [];
  try {
    categories = JSON.parse(source.textContent);
  } catch (error) {
    console.error("categoryDataJS is not valid JSON", error);
    return;
  }

  const category = categories.find((item) => item.slug === slug);
  if (!category) return;

  const image = document.querySelector(".categoryImageJS");
  if (image) {
    image.src = category.image;
    image.alt = category.alt;
    image.width = category.width;
    image.height = category.height;
  }

  const names = document.querySelectorAll(".categoryNameJS");
  const defaultName = names[0]?.textContent.trim();
  names.forEach((el) => {
    el.textContent = category.name;
  });
  if (defaultName) document.title = document.title.replace(defaultName, category.name);

  document.querySelectorAll('.site-header a[href*="product-category.html"], .site-menu a[href*="product-category.html"]').forEach((link) => {
    const linkSlug = new URL(link.href, window.location.href).searchParams.get("category");
    if (linkSlug === category.slug) {
      link.setAttribute("aria-current", "page");
    } else {
      link.removeAttribute("aria-current");
    }
  });
}
