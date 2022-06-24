import { defineConfig } from 'vite'
import { resolve } from 'path'
import vue from '@vitejs/plugin-vue'

function pathResolve(dir) {
  return resolve(__dirname, '.', dir)
}

export default ({ mode }) => {
  const IS_DEV = mode === 'development'
  const proxy = {
    '/api': {
      target: 'https://shopify-manage-test.yuanqisenlin.com', // 测试环境
      // targen: '192.168.224.93',
      changeOrigin: true
    },
  }
  return defineConfig({
    base: '/',
    plugins:[vue()],
    resolve: {
      alias: {
        '@': pathResolve('src'),
      }
    },
    optimizeDeps: {
      include: ['axios'],
    },
    build: {
      target: 'modules',
      // outDir: 'dist',
      outDir: 'frontend',
      assetsDir: 'static',
      minify: 'terser' // 混淆器
    },
    server: {
      cors: true,
      open: true,
      proxy: IS_DEV ? proxy : {}
    },
    fs: {
      strict: false,
      // Allow serving files from one level up to the project root
      allow: []
    }
  })
}