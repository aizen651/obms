import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { Toaster } from '@/components/ui/sonner';
import { route } from 'ziggy-js';
import '../css/app.css';
import { configureEcho } from '@laravel/echo-react';

configureEcho({
    broadcaster: 'reverb',
});

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

window.route = route;

createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),
    resolve: (name) => resolvePageComponent(`./pages/${name}.tsx`, import.meta.glob('./pages/**/*.tsx')),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(
          <>
            <Toaster
      position="top-right"
      toastOptions={{
        style: {
          background: '#fff',
          border: '1px solid rgba(0,0,0,0.08)',
          color: '#1e1b4b',
          fontFamily: "'DM Sans', sans-serif",
          fontSize: '13px',
          borderRadius: '10px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          padding: '12px 16px',
        },
        success: { style: { borderLeft: '3px solid #4f46e5' } },
        error:   { style: { borderLeft: '3px solid #ef4444' } },
      }}
    />
          <App {...props} />
          </>
          );
    },
    progress: {
        color: '#4B5563',
    },
});
