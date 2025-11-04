// postcss.config.js
const purgecss = require('@fullhuman/postcss-purgecss');

module.exports = {
  plugins: [
    require('autoprefixer'),
    ...(process.env.NODE_ENV === 'production'
      ? [purgecss({
          content: [
            './index.html',
            './pages/**/*.html',
            './src/js/**/*.js',
            './src/**/*.scss',
          ],
          defaultExtractor: (content) => content.match(/[\w-/:.%]+/g) || [],
          safelist: [
            // состояния/утилиты
            'hidden', 'visually-hidden', 'current', 'is-open',
            // ваши блоки/компоненты
            /^page/, /^menu/, /^sidebar/, /^header/,
            /^btn/, 'btn', 'btn--primary', 'btn--secondary', 'btn--transparent', 'btn-inner',
            /^companies/, /^co-workers/, /^tasks/, /^reports/,
          ],
        })]
      : []),
  ],
};
