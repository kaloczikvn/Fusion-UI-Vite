import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
// import vext from 'vite-plugin-vext';

// https://vite.dev/config/
export default defineConfig({
    plugins: [react()], // vext()
    server: {
        port: 3000,
    },
});
