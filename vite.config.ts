import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import laravel from 'laravel-vite-plugin';
import { defineConfig } from 'vite';

const isProd = process.env.NODE_ENV === 'production';

// Only import wayfinder in development
const plugins = [
    laravel({
        input: ['resources/css/app.css', 'resources/js/app.tsx'],
        ssr: 'resources/js/ssr.tsx',
        refresh: true,
    }),
    react({
        babel: {
            plugins: ['babel-plugin-react-compiler'],
        },
    }),
    tailwindcss(),
];

if (!isProd) {
    const { wayfinder } = await import('@laravel/vite-plugin-wayfinder');
    plugins.push(wayfinder({ formVariants: true }));
}

export default defineConfig({
    plugins,
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