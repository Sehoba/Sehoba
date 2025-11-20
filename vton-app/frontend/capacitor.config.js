import { defineConfig } from '@capacitor/cli';

export default defineConfig({
  appId: 'com.vton.app',
  appName: 'VTON',
  webDir: 'dist',
  bundledWebRuntime: false,
  server: {
    androidScheme: 'https'
  }
});
