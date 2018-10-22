module.exports = {
    router: {
      base: '/open311-nodejs'
      },
    head: {
      title: 'uReport',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport',
          content: 'width=device-width, initial-scale=1'
        },
        { hid: 'uReport',
          name: 'uReport',
          content: 'uReport is a Vuejs webapp to notify the City of community issues, such as potholes, graffiti, malfunctioning street lights, and more.'
        }
      ],
      link: [
        { rel: 'icon',
          type: 'image/x-icon',
          href: '/favicon/favicon.ico'
        },
        { rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css?family=IBM+Plex+Sans:400,600|Abel'}
      ]
    },
    serverMiddleware: ['~/post/index'],
    router: {
      base: process.env.NODE_ENV === 'dev' ? '/' : '/open311-nodejs/'
    },
    loading: { color: '#FFFFFF' },
    css: [
      '@/assets/vendor/normalize/normalize.css',
      '@/assets/scss/main.scss',
      '~/plugins/leaflet/leaflet.css'
    ],
    modules: [
      '@nuxtjs/axios',
      '@nuxtjs/proxy',
      '@nuxtjs/pwa',
    ],
    /*workbox: {
      dev: true,
      importScripts: process.env.BASE_URL + ['/sw.js'],
      runtimeCaching: [{
        urlPattern: 'https://fonts.googleapis.com/.*',
        handler: 'cacheFirst',
        method: 'GET',
        strategyOptions: {cacheableResponse: {statuses: [0, 200]}}
      }]
    },*/
    manifest: {
      name: 'uReport',
      description: 'uReport is a Vuejs webapp to notify the City of community issues, such as potholes, graffiti, malfunctioning street lights, and more.',
      theme_color: '#1e59ae'
    },
    axios: {
      baseURL:     process.env.BASE_URL || '/open311-nodejs',
      browserBaseURL:     process.env.BROWSER_BASE_URL || '/open311-nodejs',
      proxy: true,
      credentials: true,
      proxyHeaders: true
    },
    env: {
      baseUrl:              process.env.BASE_URL,
      localPort:            process.env.LOCAL_PORT,
      servicesApi:          process.env.SERVICES_API,
      postApi:              process.env.POST_API,
      attrsApi:             process.env.ATTRS_API,
      open311Key:           process.env.OPEN_311_KEY,
      apiUrl:               process.env.PROD_API_URL,
      postProxy:            process.env.POST_PROXY,
      osmUrl:               process.env.OSM_URL,
      mapBoxUrl:            process.env.MAPBOX_URL,
      mapBoxKey:            process.env.MAPBOX_KEY,
      mapBoxId:             process.env.MAPBOX_ID,
      reCaptchaSiteKey:     process.env.RECAPTCHA_SITEKEY
    },
    plugins: [
      { src: '~/plugins/leaflet/leaflet.js', ssr: false}
    ],
    build: {
      vendors: ['babel-polyfill'],

      extend (config, { isDev, isClient }) {
        if (isDev && isClient) {
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