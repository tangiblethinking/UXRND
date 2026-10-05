import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

function figmaAssetResolver() {
  return {
    name: 'figma-asset-resolver',
    resolveId(id) {
      if (id.startsWith('figma:asset/')) {
        const filename = id.replace('figma:asset/', '')
        return path.resolve(__dirname, 'src/assets', filename)
      }
    },
  }
}

function figmaVersionedPackageResolver() {
  const versionSuffix = /@\d+\.\d+\.\d+(?:[-+][\w.-]+)?$/
  return {
    name: 'figma-versioned-package-resolver',
    enforce: 'pre',
    async resolveId(id, importer, options) {
      if (!versionSuffix.test(id)) return null
      const bare = id.replace(versionSuffix, '')
      return this.resolve(bare, importer, { ...options, skipSelf: true })
    },
  }
}

export default defineConfig({
  plugins: [
    figmaVersionedPackageResolver(),
    figmaAssetResolver(),
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src/app'),
    },
  },
})
