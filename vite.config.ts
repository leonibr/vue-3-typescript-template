import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv } from 'vite'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import vue from '@vitejs/plugin-vue'
import svgicon from 'vite-plugin-svgicon'

// If your port is set to 80,
// use administrator privileges to execute the command line.
// For example, on Mac: sudo npm run / sudo yarn
const env = loadEnv(process.env.NODE_ENV!, process.cwd(), '')
const devServerPort = 9527 // TODO: get this variable from setting.ts
const mockServerPort = 9528 // TODO: get this variable from setting.ts
// const name = 'Vue Typescript Admin' // TODO: get this variable from setting.ts

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      resolvers: [ElementPlusResolver()]
    }),
    Components({
      resolvers: [ElementPlusResolver()]
    }),
    svgicon({
      include: ['**/icons/svg/**/*.svg']
    })
    // VueI18nPlugin({
    //   runtimeOnly: false,
    //   include: resolve(dirname(fileURLToPath(import.meta.url)), './src/lang/**')
    // })
  ],

  resolve: {
    alias: {
      // 'vue-i18n': 'vue-i18n/dist/vue-i18n.runtime.esm-bundler.js',
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `
          @import '@/styles/variables.scss';
          @import '@/styles/mixins.scss';
        `
      }
    }
  },
  server: {
    port: devServerPort,
    open: true,
    proxy: {
      [env.VITE_VUE_APP_BASE_API]: {
        target: `http://127.0.0.1:${mockServerPort}/mock-api/v1`,
        changeOrigin: true, // needed for virtual hosted sites
        ws: true, // proxy websockets,
        rewrite: (path) => path.replace(env.VITE_VUE_APP_BASE_API, '')
      }
    }
  }
})
