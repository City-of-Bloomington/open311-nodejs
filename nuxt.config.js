module.exports = {
  head: {
    title: 'uReport',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport',
        content: 'width=device-width, initial-scale=1'
      },
      { hid: 'description',
        name: 'description',
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
  loading: { color: '#FFFFFF' },
  css: [
    '@/assets/vendor/normalize/normalize.css',
    '@/assets/scss/main.scss',
    '~/plugins/leaflet/leaflet.css'
  ],
  modules: [
    '@nuxtjs/axios',
    '@nuxtjs/proxy',
  ],
  axios: {
    proxy: true,
    credentials: true,
    proxyHeaders: true
  },
  env: {
    localPort:   process.env.LOCAL_PORT || 2222,
    servicesApi: process.SERVICES_API || 'services.json',
    postApi:     process.POST_API || 'requests.json',
    attrsApi:    process.ATTRS_API || 'services/',
    open311Key:  process.env.OPEN_311_KEY,
    apiUrl:      process.env.API_URL || 'https://ureport-stage.bloomington.in.gov/crm-test/open311/v2/',
    osmUrl:      process.env.OSM_URL || 'https://nominatim.openstreetmap.org/reverse?format=jsonv2',
    mapBoxUrl:   process.env.MAPBOX_URL || 'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.mvt?access_token={accessToken}',
    mapBoxKey:   process.env.MAPBOX_KEY
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