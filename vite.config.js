import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  root: "./", // ✅ Asegura que la raíz sea el directorio principal
  base: "/",  // ✅ Define la base correctamente para servir los archivos
  server: {
    port: 3000,
    open: true,
    strictPort: true,
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
    rollupOptions: {
      input: "index.html", // ✅ Usa el `index.html` en la raíz
    },
  },
});
