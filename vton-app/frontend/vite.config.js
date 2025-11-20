import { defineConfig, searchForWorkspaceRoot } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    fs: {
      allow: [
        path.resolve(__dirname, ".."),
        searchForWorkspaceRoot(process.cwd()),
      ],
    },
  },
  resolve: {
    alias: {
      "@firebase": path.resolve(__dirname, "../firebase"),
    },
  },
});
