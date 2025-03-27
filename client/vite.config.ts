import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path';

const expressPort = 3001;
const expressHost = 'localhost';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/v1': {
        target: `http://${expressHost}:${expressPort}`,
        changeOrigin: true,
        secure: false,
      }
    },
  },
  resolve: {
    alias: {
      '@gofetch': path.resolve(__dirname, '../shared/src/*')
    },
  },
})
