import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    dedupe: [
      'react',
      'react-dom',
      'react-helmet-async',
      '@sudobility/components',
      '@sudobility/building_blocks',
    ],
    alias: {
      react: resolve(__dirname, 'node_modules/react'),
      'react-dom': resolve(__dirname, 'node_modules/react-dom'),
      'react-helmet-async': resolve(__dirname, 'node_modules/react-helmet-async'),
      // Optional peer dependencies of @sudobility/building_blocks that this site doesn't use.
      'firebase/auth': resolve(__dirname, 'src/stubs/firebase-auth.ts'),
      '@sudobility/subscription-components': resolve(
        __dirname,
        'src/stubs/subscription-components.ts'
      ),
      '@sudobility/devops-components': resolve(__dirname, 'src/stubs/devops-components.ts'),
      '@sudobility/di_web': resolve(__dirname, 'src/stubs/di_web.ts'),
      '@sudobility/auth_lib': resolve(__dirname, 'src/stubs/auth_lib.ts'),
      '@sudobility/subscription_lib': resolve(__dirname, 'src/stubs/subscription_lib.ts'),
    },
  },
  optimizeDeps: {
    include: ['react', 'react-dom'],
  },
  server: {
    port: 4010,
  },
  build: {
    target: 'es2020',
    outDir: 'dist',
    cssCodeSplit: true,
    sourcemap: false,
    chunkSizeWarningLimit: 1100,
  },
});
