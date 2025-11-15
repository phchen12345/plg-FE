/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: { turbo: false }, // 可保留或刪掉，重要的是 webpack(config)
  webpack(config) {
    const fileLoaderRule = config.module.rules.find((rule) =>
      rule.test?.test?.(".svg")
    );
    if (fileLoaderRule) fileLoaderRule.exclude = /\.svg$/i;

    config.module.rules.push(
      {
        test: /\.svg$/i,
        resourceQuery: { not: [/url/] },
        use: [
          {
            loader: "@svgr/webpack",
            options: { svgo: true, titleProp: true, ref: true },
          },
        ],
      },
      {
        test: /\.svg$/i,
        type: "asset/resource",
        resourceQuery: /url/,
      }
    );
    return config;
  },
};
module.exports = nextConfig;
