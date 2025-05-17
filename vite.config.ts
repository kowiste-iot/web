//vite.config.ts
import { fileURLToPath, URL } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import path from 'path'

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_')

  const isPublic = mode === 'public'
  const root = isPublic ? '.' : 'src/private'

  return {
    plugins: [vue(), vueDevTools()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    root,
    publicDir: path.resolve(__dirname, 'public'),
    envDir: '.',
    build: {
      outDir: path.resolve(__dirname, `dist/${isPublic  ? 'web' : 'full'}`),
      emptyOutDir: true,
    },
    optimizeDeps: {
      include: ['keycloak-js', 'luxon', 'primevue/config'],
    },
    server: {
      fs: {
        strict: false,
        allow: ['.'],
      },
    },
    define: {
      'process.env': env,
    },
  }
})
