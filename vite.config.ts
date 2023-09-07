import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import vue from '@vitejs/plugin-vue'
import svgicon from 'vite-plugin-svgicon'

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
  }
})
