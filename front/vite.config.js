import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
      preprocessorOptions: {
          less: {
              // modifyVars: {
              //     hack: `true; @import (reference) "${path.resolve("src/assets/css/base.less")}";`,
              // },
              javascriptEnabled: true,
          },
      },
  },
  resolve: {
    alias: {
      '@': path.resolve(process.cwd(), 'src'),
    },
  },
  server: {
    host: '0.0.0.0',
    port: 8686,
    open: false,
    proxy: {
      '/api': {
        // target: 'http://localhost:3002/',
        target: 'http://47.106.217.43:3002/',
        changeOrigin: true, // 允许跨域
        rewrite: path => path.replace('/api/', '/api/'),
      },
    },
   
  },
  build: {
    rollupOptions: {
      output: {
        sourcemap: false,
        reportCompressedSize: false,
        manualChunks(id) {  
            if (id.includes("node_modules")) {
                return id
                        .toString()
                        .split("node_modules/")[1]
                        .split("/")[0]
                        .toString();
            }
        }
    }
    }
  }
})
