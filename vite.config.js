import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/offenedaten-koeln/",
  plugins: [react()],
  server: {
    proxy: {
      "/thki": {
        target: "https://chat.kiconnect.nrw",
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/thki/, ""),
      },
    },
  },
});
