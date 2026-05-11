import { defineConfig } from "vite";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";
import { version } from "./package.json";

const __dirname = dirname(fileURLToPath(import.meta.url));
const packagesCwd = resolve(__dirname, "..");

export default defineConfig({
  base: process.env.BASE_PATH || "/",
  build: { sourcemap: true },
  define: {
    __APP_VERSION__: JSON.stringify(version),
  },
});
