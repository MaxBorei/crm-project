const isProd = process.env.NODE_ENV === 'production';

module.exports = {
  plugins: [
    // autoprefixer корисний і в dev, і в prod
    require('autoprefixer')(),

    // PurgeCSS — тільки у продакшені, щоб у dev нічого не зрізало
    ...(isProd
      ? [
          require('@fullhuman/postcss-purgecss')({
            // де шукати використані класи
            content: [
              './**/*.html',
              './src/**/*.{js,ts,jsx,tsx,vue}',
              './src/**/*.{scss,css}',
            ],
            // як витягувати класи
            defaultExtractor: (content) =>
              content.match(/[^<>"'`\\s]*[^<>"'`\\s:]/g) || [],
            // що ніколи не видаляти
            safelist: {
              standard: [
                'is-open',              // додаєш/знімаєш у JS
                'overflow-hidden',      // якщо використовуєш для lock-scroll
                // додай інші динамічні класи, якщо є
              ],
            },
          }),
        ]
      : []),
  ],
};