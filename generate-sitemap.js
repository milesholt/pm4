const { SitemapStream, streamToPromise } = require("sitemap");
const { createWriteStream } = require("fs");
const { resolve } = require("path");

const links = [
  { url: "/", changefreq: "daily", priority: 1.0 },
  { url: "/about-us", changefreq: "monthly", priority: 0.8 },
  { url: "/shop/fungi", changefreq: "monthly", priority: 0.8 },
  { url: "/shop/anti-ageing", changefreq: "monthly", priority: 0.8 },
  { url: "/shop/vegan", changefreq: "monthly", priority: 0.8 },
  { url: "/shop/organic", changefreq: "monthly", priority: 0.8 },
  { url: "/shop/ayurvedic", changefreq: "monthly", priority: 0.8 },
  { url: "/shop/natural-supplements", changefreq: "monthly", priority: 0.8 },
  {
    url: "/shop/product/lions-mane-mushroom",
    changefreq: "monthly",
    priority: 0.8,
  },
  {
    url: "/shop/product/cordyceps-mushroom",
    changefreq: "monthly",
    priority: 0.8,
  },
  { url: "/shop/product/ashwagandha", changefreq: "monthly", priority: 0.8 },
  {
    url: "/shop/product/mushroom-coffee-fusion-lion-s-mane-chaga-16oz",
    changefreq: "monthly",
    priority: 0.8,
  },
  {
    url: "/shop/product/collagen-gummies-adult",
    changefreq: "monthly",
    priority: 0.8,
  },
  {
    url: "/shop/product/bee-pearl-powder",
    changefreq: "monthly",
    priority: 0.8,
  },
  {
    url: "/shop/product/birch-chaga-microbiome-wellness-powder",
    changefreq: "monthly",
    priority: 0.8,
  },
  {
    url: "/shop/product/5-htp",
    changefreq: "monthly",
    priority: 0.8,
  },
  {
    url: "/shop/product/mushroom-extract-complex",
    changefreq: "monthly",
    priority: 0.8,
  },
  {
    url: "/shop/product/mushroom-complex-10-x",
    changefreq: "monthly",
    priority: 0.8,
  },
  {
    url: "/shop/product/vegan-pea-protein-chocolate",
    changefreq: "monthly",
    priority: 0.8,
  },
  {
    url: "/shop/product/complete-multivitamin",
    changefreq: "monthly",
    priority: 0.8,
  },
];

(async () => {
  const sitemapStream = new SitemapStream({
    hostname: "https://obscura.solutions",
  });

  links.forEach((link) => {
    sitemapStream.write(link);
  });

  sitemapStream.end();

  const sitemap = await streamToPromise(sitemapStream).then((sm) =>
    sm.toString(),
  );

  const sitemapPath = resolve(__dirname, "dist", "sitemap.xml");
  createWriteStream(sitemapPath).write(sitemap);

  console.log("Sitemap generated at:", sitemapPath);
})();
