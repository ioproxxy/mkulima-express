import path from 'path'
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '')

  return {
    plugins: [react()],
    server: {
      port: 3000,
      host: true, // allows connections from external hosts
      allowedHosts: [
        'mkulima-express.onrender.com', // Render domain
        'localhost',
        '127.0.0.1'
      ]
    },
    define: {
      'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
    },
    resolve: {
      alias: {
        // Fix: In an ES module context, `__dirname` is not available.
        // `path.resolve('.')` is used instead to resolve to the project root directory.
        '@': path.resolve('.'),
      }
    },
    preview: {
      port: 3000,
      allowedHosts: ['mkulima-express.onrender.com']
    }
  }
})
