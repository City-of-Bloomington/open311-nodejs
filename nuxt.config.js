require('dotenv').config()
module.exports = {
  dev: (process.env.NODE_ENV !== 'production'),
  router: {
    base:         process.env.BASE_URL
  },
  manifest: {
    name:         'uReport - City of Bloomington, Indiana',
    short_name:   'uReport',
    description:  'uReport is an app to notify the City of community issues, such as potholes, graffiti, malfunctioning street lights, and more.',
    theme_color:  '#1e59ae'
  },
  head: {
    title:        'uReport',
    meta: [
      { charset:  'utf-8' },
      { name:     'viewport',
        content:  'width=device-width, initial-scale=1'
      },
      { hid:      'description',
        name:     'description',
        content:  'uReport is an app to notify the City of community issues, such as potholes, graffiti, malfunctioning street lights, and more.'
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
      { rel:      'stylesheet',
        href:     'https://fonts.googleapis.com/css?family=IBM+Plex+Sans:400,600|Abel'
      }
    ]
  },
  serverMiddleware: ['~/post/index'],
  loading: { color: '#FFFFFF' },
  css: [
    '@/assets/vendor/normalize/normalize.css',
    '@/assets/scss/main.scss',
    '~/plugins/leaflet/leaflet.css'
  ],
  modules: [
    '@nuxtjs/axios',
    '@nuxtjs/proxy',
    ['@nuxtjs/pwa', {
      icon: true,
      sizes: [16, 120, 144, 152, 192, 384, 512],
    }]
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
  axios: {
    baseURL:              process.env.BASE_URL,
    browserBaseURL:       process.env.BROWSER_BASE_URL,
    proxy:                true,
    credentials:          true,
    proxyHeaders:         true
  },
  env: {
    crmBaseUrl:           process.env.CRM_BASE_URL,
    crmTickets:           process.env.CRM_TICKETS,
    logoUrl:              process.env.LOGO_URL,
    baseUrl:              process.env.BASE_URL,
    localPort:            process.env.LOCAL_PORT,
    servicesApi:          process.env.SERVICES_API,
    postApi:              process.env.POST_API,
    attrsApi:             process.env.ATTRS_API,
    open311Key:           process.env.OPEN_311_KEY,
    apiUrl:               process.env.CRM_API_URL,
    postProxy:            process.env.POST_PROXY,
    masterAddUrl:         process.env.MASTER_ADD_URL,
    arcgisRevGeo:         process.env.ARCGIS_REV_GEO,
    osmUrl:               process.env.OSM_URL,
    mapBoxUrl:            process.env.MAPBOX_URL,
    mapBoxKey:            process.env.MAPBOX_KEY,
    mapBoxId:             process.env.MAPBOX_ID,
    reCaptchaSiteKey:     process.env.RECAPTCHA_SITEKEY
  },
  plugins: [
    { src: '~/plugins/ga.js', ssr: false }
  ],
  build: {
    vendors: ['babel-polyfill'],

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