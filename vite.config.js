import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 3000,
    proxy: {
      "/api": {
        target: "http://127.0.0.1:8000", // Your Django backend
        // target: "https://workmate.api.dataidea.org",
        changeOrigin: true,
      },
    },
  },
  base: "/",
});
