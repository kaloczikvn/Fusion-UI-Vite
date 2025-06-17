import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { vext } from '@vextjs/vite-plugin';

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        react(),
        vext({
            outputPath: '../',
        }),
    ],
});
