import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { route } from 'ziggy-js';
import { Toaster } from "@/components/ui/sonner"; // ✅ ADD THIS
import '../css/app.css';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

window.route = route;

createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),
    resolve: (name) =>
        resolvePageComponent(
            `./pages/${name}.tsx`,
            import.meta.glob('./pages/**/*.tsx')
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(
            <>
                {/* ✅ GLOBAL SONNER */}
                <Toaster position="top-right" richColors />
                <App {...props} />
            </>
        );
    },
    progress: {
        color: '#4B5563',
    },
});