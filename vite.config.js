import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 3000,
  },
  // Use the repository name as the base path for GitHub Pages (process.env.BASE_PATH) or "/" for local development
  base: process.env.BASE_PATH || "/",
});
