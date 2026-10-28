import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/abb-tic-tac-toe-assessment/',
  plugins: [react()],
});
