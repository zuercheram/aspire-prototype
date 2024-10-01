import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  optimizeDeps: { force: true },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "setupTests.ts",
    css: true,
  },
});
