// require('dotenv').config()
module.exports = {
  telemetry: false,
  
  dev: (process.env.NODE_ENV !== 'production'),

  router: {
    base:         process.env.BASE_URL
  },

  manifest: {
    name:             'uReport - City of Bloomington, Indiana',
    short_name:       'uReport',
    theme_color:      '#1e59ae',
    background_color: '#1e5aae',
    display:          'standalone',
    description:      'Use uReport to notify the City of Bloomington, Indiana of community issues, such as potholes, graffiti, malfunctioning street lights, and more.'
  },

  head: {
    title:        'uReport',
    meta: [
      { charset:  'utf-8' },
      { name:     'viewport',
        content:  'width=device-width, initial-scale=1, maximum-scale=1'
      },
      { hid:      'description',
        name:     'description',
        content:  'Use uReport to notify the City of Bloomington, Indiana of community issues, such as potholes, graffiti, malfunctioning street lights, and more.'
      },
      {
        name:     'apple-mobile-web-app-title',
        content:  'uReport'
      },
      {
        name:     'application-name',
        content:  'uReport'
      },
      {
        name:     'msapplication-TileColor',
        content:  '#244698'
      },
      {
        name:     'theme-color',
        content:  '#ffffff'
      }
    ],
    link: [
      { 
        rel:    'preconnect',
        href:   'https://fonts.gstatic.com/',
        crossorigin: 'true'
      },
      { rel:      'stylesheet',
        href:     'https://fonts.googleapis.com/css?family=IBM+Plex+Sans:400,600|Abel'
      }
    ]
  },

  serverMiddleware: ['~/post/index'],
  loading: { color: '#FFFFFF' },
  css: [
    // '@/assets/vendor/normalize/normalize.css',
    '@/assets/scss/main.scss',
  ],

  styleResources: {
    scss: [
      '@/assets/scss/system.utils.scss',
      '@/assets/scss/main.scss',
    ]
  },

  buildModules: [
    ['@nuxtjs/dotenv']
  ],

  modules: [
    '@nuxtjs/axios',
    '@nuxtjs/proxy',
    '@nuxtjs/style-resources',
    '@nuxtjs/recaptcha',
    ['@nuxtjs/pwa', {
      icon: true,
      sizes: [16, 120, 144, 152, 192, 384, 512],
    }]
  ],

  recaptcha: {
    hideBadge:  false,
    siteKey:    process.env.RECAPTCHA_SITEKEY,
    version:    2,
    size:       'invisible'
  },

  axios: {
    baseURL:              process.env.BASE_URL,
    browserBaseURL:       process.env.BROWSER_BASE_URL,
    proxy:                true,
    credentials:          true,
    proxyHeaders:         true
  },

  env: {
    // A2HS - Add To Home Screen PWA Support
    a2hsPrompt:           false,
  },

  plugins: [
    { src: '~/plugins/axios' },
    { src: '~/plugins/api-methods' },
    { src: '~/plugins/design-system' },
    { src: '~/plugins/universal-computed' },
    { src: '~/plugins/ga.js',        ssr: false },
    { src: '~/plugins/localStorage', ssr: false },
    { src: '~/plugins/google-map',   ssr: false },
    { src: '~/plugins/a2hs',         ssr: false }
  ],

  workbox: {
    swScope: '/ureport/',
    // importScripts: [
    //   '/js/service-worker.js'
    // ],
    runtimeCaching: [
      {
        urlPattern: 'https://fonts.googleapis.com/.*',
        handler:    'cacheFirst',
        method:     'GET',
        strategyOptions: { cacheableResponse: { statuses: [0, 200] } }
      },
      {
        urlPattern: 'https://fonts.gstatic.com/.*',
        handler:    'cacheFirst',
        method:     'GET',
        strategyOptions: { cacheableResponse: { statuses: [0, 200] } }
      },
    ],
  },

  build: {
    vendors:    ['babel-polyfill'],
    transpile:  [/^vue2-google-maps($|\/)/],
    // transpile:  [/^cob-design-system($|\/)/],

    extend (config, { isDev, isClient }) {
      if (isDev && process.client) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
    }
  }
}