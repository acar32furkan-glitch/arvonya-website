import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [
    TanStackRouterVite({ target: "react", autoCodeSplitting: true }),
    react(),
    tailwindcss(),
    tsconfigPaths(),
  ],
  build: {
    outDir: "dist",
    target: "es2022",
    cssCodeSplit: true,
    cssMinify: true,
    minify: "esbuild",
    modulePreload: { polyfill: false },
    rollupOptions: {
      treeshake: "recommended",
      output: {
        manualChunks(id) {
          if (!id.includes("node_modules")) return undefined;

          if (id.includes("@tanstack")) return "tanstack";
          if (id.includes("react-dom") || id.includes("react/") || id.includes("scheduler")) {
            return "react-vendor";
          }
          if (id.includes("framer-motion")) return "framer-motion";
          if (id.includes("lucide-react")) return "icons";
          if (id.includes("recharts")) return "charts";
          if (id.includes("date-fns")) return "date-fns";
          if (id.includes("embla-carousel")) return "embla-carousel";

          return "vendor";
        },
      },
    },
  },
});
