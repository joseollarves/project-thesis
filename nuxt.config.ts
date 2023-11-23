export default defineNuxtConfig({
  devtools: { enabled: true },
  ssr: false,
  modules: [
    '@nuxtjs/supabase',
    '@samk-dev/nuxt-vcalendar',
    '@nuxt/image',
    '@vite-pwa/nuxt',
  ],
  experimental: {
    payloadExtraction: false,
  },
  nitro: {
    esbuild: {
      options: {
        target: 'esnext',
      },
    },
  },
  imports: {
    autoImport: true,
  },
  pwa: {
    registerType: 'autoUpdate',
    manifest: {
      name: 'Bufete',
      short_name: 'Bufete',
      description: 'Bufete de Abogados',
      theme_color: '#FFFFFF',
      lang: 'es',
      icons: [
        {
          src: 'icons/icon_64x64.png',
          sizes: '64x64',
          type: 'image/png'
        },
        {
          src: 'icons/icon_144x144.png',
          sizes: '144x144',
          type: 'image/png'
        },
        {
          src: 'icons/icon_192x192.png',
          sizes: '192x192',
          type: 'image/png'
        },
        {
          src: 'icons/icon_512x512.png',
          sizes: '512x512',
          type: 'image/png'
        },
      ],
    },
    workbox: {
      globPatterns: ['**/*.{js,css,html,png,svg,ico}'],
    },
    client: {
      installPrompt: true,
    },
    devOptions: {
      enabled: true,
      suppressWarnings: true,
      navigateFallbackAllowlist: [/^\/$/],
      type: 'module',
    }
  },
  supabase: {
    redirect: false,
  },
  runtimeConfig: {
    public: {
      clientId: '',
      clientSecret: '',
    }
  }
})
