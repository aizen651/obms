"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vite_plugin_wayfinder_1 = require("@laravel/vite-plugin-wayfinder");
var vite_1 = require("@tailwindcss/vite");
var plugin_react_1 = require("@vitejs/plugin-react");
var laravel_vite_plugin_1 = require("laravel-vite-plugin");
var vite_2 = require("vite");
exports.default = (0, vite_2.defineConfig)({
    plugins: [
        (0, laravel_vite_plugin_1.default)({
            input: ['resources/css/app.css', 'resources/js/app.tsx'],
            ssr: 'resources/js/ssr.tsx',
            refresh: true,
        }),
        (0, plugin_react_1.default)({
            babel: {
                plugins: ['babel-plugin-react-compiler'],
            },
        }),
        (0, vite_1.default)(),
        (0, vite_plugin_wayfinder_1.wayfinder)({
            formVariants: true,
        }),
    ],
    server: {
        hmr: {
            host: 'localhost',
        },
        watch: {
            usePolling: true,
        },
    },
    esbuild: {
        jsx: 'automatic',
    },
});
