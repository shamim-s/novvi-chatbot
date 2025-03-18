import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    lib: {
      entry: "src/widget.js",
      name: "NovviChatbot",
      fileName: "novvi-chatbot-widget",
      formats: ["iife"],
    },
    rollupOptions: {
      output: {
        entryFileNames: "novvi-chatbot-widget.min.js",
        extend: true,
        // Add cache busting
        chunkFileNames: "[name].[hash].js",
        // Add compression
        compact: true,
        // Add source maps
        sourcemap: true,
      },
    },
    // Optimize for production
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true,
      },
    },
  },
});
