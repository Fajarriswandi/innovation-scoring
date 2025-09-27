import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const proxyBase = env.VITE_API_DEV_BASE ?? "/__api";
  const proxyTarget = env.VITE_API_PROXY_TARGET ?? env.VITE_API_BASE_URL;

  return {
    plugins: [react()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src"),
      },
    },
    server: {
      host: true,
      port: 5173,
      allowedHosts: ["demo-ai-powered-call-center.zafarlabs.com"],
      watch: {
        usePolling: true,
      },
      proxy: proxyTarget
        ? {
            [proxyBase]: {
              target: proxyTarget,
              changeOrigin: true,
              secure: false,
              rewrite: (path) => path.replace(proxyBase, ""),
            },
          }
        : undefined,
    },
  };
});
