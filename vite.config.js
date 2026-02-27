"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vite_1 = require("@tailwindcss/vite");
var plugin_react_1 = require("@vitejs/plugin-react");
var laravel_vite_plugin_1 = require("laravel-vite-plugin");
var vite_2 = require("vite");
var isProd = process.env.NODE_ENV === 'production';
var plugins = [
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
];
if (!isProd) {
    var wayfinder = (await Promise.resolve().then(function () { return require('@laravel/vite-plugin-wayfinder'); })).wayfinder;
    plugins.push(wayfinder({ formVariants: true }));
}
exports.default = (0, vite_2.defineConfig)({
    build: {
        chunkSizeWarningLimit: 1000,
        rollupOptions: {
            output: {
                manualChunks: {
                    vendor: ['react', 'react-dom'],
                    inertia: ['@inertiajs/react'],
                },
            },
        },
    },
    plugins: plugins,
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
