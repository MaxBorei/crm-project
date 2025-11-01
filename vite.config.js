// vite.config.js
// ✅ Готово до деплою на GitHub Pages під репозиторій /crm-project/
// - коректний base
// - оптимізація зображень
// - підтримка множинних HTML-ентрі
// - стабільні іменування asset-ів із хешем для кешування
// - PurgeCSS винесено у postcss.config.cjs (не додаємо як Vite-плагін)

import path from 'path';
import { defineConfig } from 'vite';
import { fileURLToPath } from 'url';
import glob from 'fast-glob';
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';
import imagemin from 'imagemin';
import imageminWebp from 'imagemin-webp';

// 🧩 Фікс для ESM: визначаємо __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  // 🔑 базовий шлях має дорівнювати назві репозиторію на GitHub Pages
  base: '/',

  plugins: [
    // ⚙️ Оптимізація зображень під час білду
    ViteImageOptimizer({
      png: { quality: 86 },
      jpeg: { quality: 86 },
      jpg: { quality: 86 },
      webp: { quality: 86 },
      avif: { quality: 50 },
    }),

    // 🧪 Генерація .webp у DEV (не блокує білд)
    {
      name: 'dev-webp-generator',
      apply: 'serve',
      async buildStart() {
        await imagemin(['./src/img/**/*.{jpg,jpeg,png}'], {
          destination: './src/img/webp/',
          plugins: [imageminWebp({ quality: 86 })],
        });
      },
    },
  ],

  css: {
    // sourcemaps зручно дебажити у dev, у проді Vite вимкне сам
    devSourcemap: true,
  },

  build: {
    // за замовчуванням Vite мінімізує; залишаємо дефолт
    // minify: 'esbuild',
    emptyOutDir: true,
    rollupOptions: {
      // 🔗 підтримка кількох HTML-сторінок
      input: Object.fromEntries(
        glob
          .sync(['./*.html', './pages/**/*.html'])
          .map((file) => [
            // ключ — відносний шлях без розширення
            path.relative(
              __dirname,
              file.slice(0, file.length - path.extname(file).length)
            ),
            // значення — абсолютний URL до файлу
            fileURLToPath(new URL(file, import.meta.url)),
          ])
      ),
      output: {
        // 📦 Іменування asset-ів з хешем для коректного кешування на Pages
        // (і без підпапки dist у шляхах)
        assetFileNames: (assetInfo) => {
          // Зберігаємо розширення як є, додаємо хеш
          // приклад: assets/index-2a9f1d.css, assets/logo-3bd1a.svg
          return 'assets/[name]-[hash][extname]';
        },
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
      },
    },
  },
});
