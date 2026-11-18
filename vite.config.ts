import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base './' lets the build run from any folder or sub-path
export default defineConfig({
  plugins: [react()],
  base: './'
});
