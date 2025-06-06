import API from "@/service/API/API";

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_MAIN_URL;

  let allCourse = [];
  try {
    const response = await API.get("/course");
    allCourse = response.data;
  } catch (error) {
    console.error("Error fetching properties:", error);
  }

  const courseRoutes = allCourse.map(
    (post) =>
      `/course/${encodeURIComponent(post?.uniqueId)}/${encodeURIComponent(
        post.course_name
          ?.toLowerCase()
          ?.replace(/[^a-z0-9\s]/gi, "")
          ?.replace(/\s+/g, "-")
      )}`
  );

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${courseRoutes
  .map(
    (route) => `
  <url>
    <loc>${baseUrl}${route}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
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
