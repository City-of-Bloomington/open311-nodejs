import Vue from 'vue'
import * as VueGoogleMaps from 'vue2-google-maps'
// import GmapCluster from 'vue2-google-maps/dist/components/cluster'

// Vue.component('GmapCluster', GmapCluster)
Vue.use(VueGoogleMaps, {
  load: {
    key: process.env.GOOGLE_API_KEY,
    libraries: 'places',
    // v: '3.26',
  },
  installComponents: true
})