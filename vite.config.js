"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var vite_plugin_wayfinder_1 = require("@laravel/vite-plugin-wayfinder");
var vite_1 = require("@tailwindcss/vite");
var plugin_react_1 = require("@vitejs/plugin-react");
var laravel_vite_plugin_1 = require("laravel-vite-plugin");
var vite_2 = require("vite");
var isProd = process.env.NODE_ENV === 'production';
exports.default = (0, vite_2.defineConfig)({
    plugins: __spreadArray([
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
        (0, vite_1.default)()
    ], (!isProd ? [(0, vite_plugin_wayfinder_1.wayfinder)({ formVariants: true })] : []), true),
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
