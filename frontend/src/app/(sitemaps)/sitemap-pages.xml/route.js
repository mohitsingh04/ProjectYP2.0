export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_MAIN_URL;

  const staticRoutes = [
    { path: "", priority: 1.0, changefreq: "weekly" },
    { path: "/properties", priority: 0.9, changefreq: "weekly" },
    { path: "/blog", priority: 0.8, changefreq: "weekly" },
    { path: "/events", priority: 0.8, changefreq: "weekly" },
    { path: "/register", priority: 0.8, changefreq: "weekly" },
    { path: "/login", priority: 0.8, changefreq: "weekly" },
  ];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticRoutes
  .map(
    ({ path, priority, changefreq }) => `
  <url>
    <loc>${baseUrl}${path}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
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
