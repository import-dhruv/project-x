/**
 * Sitemap generation for SEO
 * Run this during build time to generate sitemap.xml
 */

import fs from 'fs';
import path from 'path';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

const routes = [
  { path: '/', priority: 1.0, changefreq: 'weekly' },
  { path: '/dashboard', priority: 0.9, changefreq: 'daily' },
  { path: '/employees', priority: 0.8, changefreq: 'weekly' },
  { path: '/feedback', priority: 0.7, changefreq: 'weekly' },
  { path: '/risk', priority: 0.8, changefreq: 'daily' },
  { path: '/pay-fairness', priority: 0.7, changefreq: 'monthly' },
  { path: '/login', priority: 0.5, changefreq: 'yearly' },
];

function generateSitemap() {
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes
  .map(
    (route) => `  <url>
    <loc>${BASE_URL}${route.path}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;

  return sitemap;
}

/**
 * Write sitemap.xml to public directory
 */
function writeSitemap() {
  const sitemap = generateSitemap();
  const sitemapPath = path.join(__dirname, '../public/sitemap.xml');

  try {
    fs.writeFileSync(sitemapPath, sitemap);
    console.log('✅ Sitemap generated:', sitemapPath);
  } catch (error) {
    console.error('❌ Error writing sitemap:', error);
    process.exit(1);
  }
}

/**
 * Generate robots.txt
 */
function generateRobotsTxt() {
  const robotsTxt = `# Employee Intelligence Robots Configuration
User-agent: *
Allow: /
Disallow: /admin
Disallow: /.next

Sitemap: ${BASE_URL}/sitemap.xml`;

  return robotsTxt;
}

/**
 * Write robots.txt to public directory
 */
function writeRobotsTxt() {
  const robotsTxt = generateRobotsTxt();
  const robotsPath = path.join(__dirname, '../public/robots.txt');

  try {
    fs.writeFileSync(robotsPath, robotsTxt);
    console.log('✅ robots.txt generated:', robotsPath);
  } catch (error) {
    console.error('❌ Error writing robots.txt:', error);
    process.exit(1);
  }
}

// Run if executed directly
if (require.main === module) {
  writeSitemap();
  writeRobotsTxt();
  console.log('\n✅ SEO files generated successfully');
}

module.exports = { generateSitemap, generateRobotsTxt };
