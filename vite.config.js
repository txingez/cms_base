import {fileURLToPath, URL} from "node:url";

import {defineConfig} from "vite";
import vue from "@vitejs/plugin-vue";
import svgLoader from "vite-svg-loader";
import {nodePolyfills} from "vite-plugin-node-polyfills";
import inject from "@rollup/plugin-inject";
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig(({command, mode}) => {
    return {
        envDir: './environments',
        envPrefix: 'ENV_',
        plugins: [
            vue(),
            svgLoader({defaultImport: 'url'}),
            nodePolyfills({protocolImports: true}),
            VitePWA({registerType: 'autoUpdate'})
        ],
        resolve: {
            alias: {
                "@": fileURLToPath(new URL("./src", import.meta.url)),
            },
            extensions: [
                ".js",
                ".json",
                ".jsx",
                ".mjs",
                ".ts",
                ".tsx",
                ".vue",
                ".ts",
                ".html",
                ".css"
            ],
        },
        server: {
            port: 8989,
            strictPort: true
        },
        drop: ["console", "debugger"],
        build: {
            rollupOptions: {
                plugins: [inject({Buffer: ['buffer', 'Buffer'], process: 'process'})]
            }
        }
    }
});
