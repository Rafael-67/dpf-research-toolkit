import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/Delivered-Protection-Framework/",
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 550,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("pdfjs-dist")) return "pdf";
          if (id.includes("mammoth")) return "document-import";
          if (
            id.includes("react") ||
            id.includes("scheduler") ||
            id.includes("react-router")
          )
            return "react-vendor";
          if (id.includes("zod") || id.includes("react-hook-form"))
            return "forms";
          return undefined;
        },
      },
    },
  },
  test: {
    environment: "jsdom",
    setupFiles: "./tests/setup.ts",
    exclude: ["tests/e2e/**", "node_modules/**"],
  },
});
