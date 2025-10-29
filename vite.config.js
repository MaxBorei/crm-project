// C:\Study\SASS\CRM-project\vite.config.js
import imagemin from "imagemin";
import imageminWebp from "imagemin-webp";
import path from "path";
import { defineConfig } from "vite";
import glob from "fast-glob";
import { fileURLToPath } from "url";
import { ViteImageOptimizer } from "vite-plugin-image-optimizer";
import purgecss from "@fullhuman/postcss-purgecss";

// 🧩 Фікс для ESM: визначаємо __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  // 🔑 базовий шлях має дорівнювати назві репозиторію
  base: "/crm-project/",
  plugins: [
    ViteImageOptimizer({
      png: { quality: 86 },
      jpeg: { quality: 86 },
      jpg: { quality: 86 },
    }),
    {
      // генеруємо webp під час dev (apply: 'serve')
      ...imagemin(["./src/img/**/*.{jpg,png,jpeg}"], {
        destination: "./src/img/webp/",
        plugins: [imageminWebp({ quality: 86 })],
      }),
      apply: "serve",
    },
    // якщо хочеш справжній PurgeCSS у білд — краще винести в postcss.config.cjs
    purgecss({ content: ["./**/*.html"] }),
  ],
  build: {
    minify: false,
    rollupOptions: {
      input: Object.fromEntries(
        glob
          .sync(["./*.html", "./pages/**/*.html"])
          .map((file) => [
            path.relative(
              __dirname,
              file.slice(0, file.length - path.extname(file).length)
            ),
            // робимо абсолютний URL до файлу
            fileURLToPath(new URL(file, import.meta.url)),
          ])
      ),
      output: {
        assetFileNames: "assets/[name].[ext]",
      },
    },
  },
});
