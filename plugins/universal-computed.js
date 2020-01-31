import Vue          from 'vue'
import {
  mapFields }       from 'vuex-map-fields'

Vue.mixin({
  data() { return {} },
  computed: {
    ...mapFields([
      'consoleLog',
      'cityBoundary',
      'cityName',
      'coordsProjection',
      'cityHallLatLong',
    ]),
    isMobile() {
      if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        return true
      } else {
        return false
      }
    },
  },
});