import API from "@/service/API/API";

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_MAIN_URL;

  let allBlogsCategory = [];
  try {
    const response = await API.get("/blog/category/all");
    allBlogsCategory = response.data;
  } catch (error) {
    console.error("Error fetching properties:", error);
  }

  const blogCategoryRoutes = allBlogsCategory.map(
    (post) =>
      `/blog/${encodeURIComponent(
        post.blog_category
          ?.toLowerCase()
          ?.replace(/[^a-z0-9\s]/gi, "")
          ?.replace(/\s+/g, "-")
      )}`
  );

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${blogCategoryRoutes
  .map(
    (route) => `
  <url>
    <loc>${baseUrl}${route}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`
  )
  .join("")}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}
