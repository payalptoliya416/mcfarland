const fs = require("fs");
const path = require("path");
const { loadEnvConfig } = require("@next/env");

const projectDir = path.join(__dirname, "..");

// Load Next.js environment variables
loadEnvConfig(projectDir);

const BASE_URL = (process.env.NEXT_PUBLIC_WEBSITE_URL || "").replace(/\/$/, "");
const API_BASE = process.env.NEXT_PUBLIC_BASE_URL;

const slugify = (text) =>
  text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

async function fetchAllCategories() {
  try {
    const response = await fetch(`${API_BASE}/inventory/categories`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    const text = await response.text();
    let data;
    try { data = JSON.parse(text); } catch { return []; }
    if (!data.success || !data.data) return [];
    return data.data;
  } catch (error) {
    console.error("Failed to fetch categories:", error.message);
    return [];
  }
}

async function fetchAllMachinery() {
  try {
    // First get all categories
    const categories = await fetchAllCategories();
    if (!categories.length) { console.error("No categories found"); return []; }

    const categoryNames = categories.map((c) => c.category_name);
    console.log(`📦 Fetching machinery for ${categoryNames.length} categories...`);

    const response = await fetch(`${API_BASE}/inventory/machinery/category`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        categoryName: categoryNames,
        sort_by: "id",
        page: 1,
        per_page: 1000,
      }),
    });

    const text = await response.text();
    let data;
    try { data = JSON.parse(text); } catch { console.error("Invalid JSON:", text.slice(0, 200)); return []; }

    if (!data.success || !data.data) {
      console.error("API error:", data?.message || "No data");
      return [];
    }
    return data.data;
  } catch (error) {
    console.error("Failed to fetch machinery:", error.message);
    return [];
  }
}

async function generateSitemap() {
  console.log("🔄 Generating sitemap...");

  const staticPages = [
    { url: "/", priority: "1.0", changefreq: "daily" },
    { url: "/about-us", priority: "0.8", changefreq: "monthly" },
    { url: "/services", priority: "0.8", changefreq: "monthly" },
    { url: "/inventory", priority: "0.9", changefreq: "daily" },
    { url: "/faq", priority: "0.7", changefreq: "monthly" },
    { url: "/contact-us", priority: "0.8", changefreq: "monthly" },
    { url: "/privacy-policy", priority: "0.5", changefreq: "yearly" },
    { url: "/terms-condition", priority: "0.5", changefreq: "yearly" },
  ];

  const machinery = await fetchAllMachinery();
  console.log(`✅ Fetched ${machinery.length} machinery items`);

  const machineryUrls = machinery.map((item) => {
    const categorySlug = slugify(item.category?.category_name || "");
    const makeSlug = slugify(item.make || "");
    const modelSlug = slugify(item.model || "");
    const auctionId = item.auction_id || item.id;

    return {
      url: `/inventory/${categorySlug}/${makeSlug}/${modelSlug}/${auctionId}`,
      priority: "0.8",
      changefreq: "daily",
    };
  });

  const allUrls = [...staticPages, ...machineryUrls];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls
  .map(
    (page) => `  <url>
    <loc>${BASE_URL}${page.url}</loc>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>`;

  const publicDir = path.join(process.cwd(), "public");
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  fs.writeFileSync(path.join(publicDir, "sitemap.xml"), sitemap);
  console.log(`✅ Sitemap generated with ${allUrls.length} URLs at public/sitemap.xml`);
}

generateSitemap();
