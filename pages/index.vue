<template>
  <div>
    <header class="location">
      <headerNav
        :nav-sub-group="navSubGroup"
        :step-active="stepActive"
        :step-complete="stepComplete" />

      <div class="search container">
        <form @submit.prevent>
          <div class="form-group">

            <!-- <div v-if="loading">
              <h3 v-if="!geoError" style="position: absolute; margin: 0 0 0 40px; font-size: 20px; line-height: 33px;">Finding your location.</h3>

              <h3 v-if="geoError" style="position: absolute; margin: 0 0 0 45px; font-size: 20px; line-height: 33px;">Can't find your location.</h3>

              <div class="loader-wrapper" v-if="!geoError">
                <div class="bar"></div>
              </div>
            </div> -->

            <label for="location">Location:</label>
            <input v-model="addressSearchAuto"
                   type="text"
                   id="location"
                   ref="location-input"
                   autocomplete="off">
            <button
              type="button"
              class="locate">
              <span>Locate Me</span>
            </button>

            <button
              type="button"
              class="clear">
              <span>Clear Search</span>
            </button>
          </div>
        </form>

        {{ autoSuggestRes }}
        <!-- {{ addressRes }} -->

        <GmapMap
        :center="latLong"
        :zoom="zoom"
        ref="defaultMap"
        map-type-id="satellite"
        :options="{
          zoomControl:        true,
          mapTypeControl:     true,
          scaleControl:       true,
          streetViewControl:  false,
          rotateControl:      false,
          fullscreenControl:  false,
          disableDefaultUi:   true,
          draggable:          true,
          styles: [
            {
              featureType:    'poi',
              stylers: [
                {
                  visibility: 'off'
                }
              ]
            },
            {
              featureType:    'poi.medical',
              stylers: [
                {
                  visibility: 'on'
                }
              ]
            },
            {
              featureType:    'poi.government',
              stylers: [
                {
                  visibility: 'on'
                }
              ]
            }
          ]
        }">

        <!-- <GmapPolygon
          v-if="cityBoundary"
          :paths="cityBoundary"
          :options="{
            strokeColor:    'rgb(30, 90, 174)',
            strokeOpacity:  0.8,
            strokeWeight:   2,
            fillColor:      'rgb(30, 90, 174)',
            fillOpacity:    0.15
          }"
        /> -->

        <GmapMarker
          :position="latLong"
          :clickable="false"
          :draggable="false"
        />
      </GmapMap>
      </div>
    </header>

    <main>

    </main>
  </div>
</template>

<style type="text/css">
.vue-map-container {
    width: 100%;
    height: 450px;
  }
  #geo-loc-text-icon {
    display: inline-block;
    top: 8px;
    position: relative;
    width: 30px;
    height: 30px;
    background: rgba(255,255,255,0.1);
    border-radius: 4px;
    padding: 5px;
    box-sizing: border-box;
  }

  .leaflet-control-attribution {
    display: none;
  }

  h3 strong {
    font-weight: 600;
  }

  h4 {
    margin: 0 0 20px 0;
  }

  button {
    color: white;
  }

  .form-group {
    margin: 0 0 20px 0 !important;
  }
</style>

<script>
import axios     from 'axios'
import headerNav from '~/components/nav.vue'
import debounce  from 'lodash.debounce'

let leaflet;
if (process.browser) {
  leaflet = require('leaflet')
}

export default {
  // beforeRouteEnter (to, from, next) {
  //   if(from.path == '/')
  //     next('/');
  //   next();
  // },
  head () {
    return {
      // titleTemplate: `%s - ${this.$store.getters.subGroup}`,
      // meta: [
      //   { hid: 'description', name: 'description', content: `Submit a ${this.$store.getters.group} (${this.$store.getters.subGroup}) uReport service request.` }
      // ]
    }
  },
  components: {
    headerNav
  },
  data() {
    return {
      zoom:         19,
      latLong:      {
        "lat": 39.1703084,
        "lng": -86.5369425
      },
      cityHallLong:     '-86.5369425',
      cityHallLat:      '39.1703084',
      chromeGeoTutUrl:  'https://support.google.com/chrome/answer/142065?hl=en',
      firefoxGeoTutUrl: 'https://support.mozilla.org/en-US/kb/does-firefox-share-my-location-websites',
      safariGeoTutUrl:  'https://support.apple.com/en-us/HT204690',
      geoError:         false,
      loadingLocation:  false,
      loading:          false,
      address_string:   null,
      addressSearchAuto:    null,
      autoSuggestRes: null,
      showMap:          true,
      map:              null,
      search_results:   null,
      addressesList:    null,
      addressRes: null,
      addressResData:       null,
      addressMapped:        null,
      addressResChoices:    null,
      error: {
        addressRes: null,
      },
      showResults:      false,
      navSubGroup:      true,
      stepActive: {
        one:            true,
        two:            false,
        three:          false,
        four:           false,
        five:           false,
        six:            false,
      },
      stepComplete: {
        one:            false,
        two:            false,
        three:          false,
        four:           false,
        five:           false,
        six:            false,
      }
    }
  },
  mounted() {
  },
  watch: {
    addressSearchAuto: debounce(function(val, oldVal){
      if(this.addressSearchAuto) {
        let regExTest   = /\d+\s+\w+/,
          addressTest = regExTest.test(val),
          searchValue = this.addressSearchAuto;

        if(searchValue.length > 3 &&
           addressTest) {
          this.getAddress(val)
          .then((res) => {
            this.autoSuggestRes = res;
          })
          .catch((e)  => {
            // this.errors.addressRes = e;
            // console.log(`%c getAutoAddress 🛑 `,
            //             this.consoleLog.error,
            //             `\n\n ${e} \n\n`);
          })
        } else {
          console.dir('search no val');
          this.autoSuggestRes = null;
          // this.searchEnteredWarning = false;
        }
      } else {
        this.autoSuggestRes = null;
      }
    }, 500),
  },
  methods: {
    /**
     * A promise returning an Address result
     * via an Address String.
     *
     * @promise   getAddress
     * @param     { String } address
     * @resolve   { Object }
     * @reject    { Error }
     * @return    { Promise <Object> }
     */
    getAddress(address) {
      return new Promise((resolve, reject) => {
        let regExTest     = /\d+\s+\w+/,
            addressTest   = regExTest.test(address),
            encodeAddress = encodeURIComponent(address).replace(/%20/g, "+");

        if(addressTest) {
          axios.get(`${process.env.masterAddUrl}${address}`)
          .then((res) => {
            if(res.data.length == 1) {
              resolve(res.data[0])
            } else if(res.data.length == 0) {
              reject(`No results for ${address}.`)
            } else if (res.data.length == 2) {
              reject(`Please select!!!!`)
            } else if(res.data.length <= 20) {
              resolve(res.data)
              console.dir(`getAddress() Search Result Count: ${res.data.length}`);
            } else {
              reject(`We didn't find an Address for '${address}'.`)
              console.dir(`getAddress() Search Result Count: ${res.data.length}`);
            }
          })
          .catch((e)  => reject(e))
        } else {
          reject('Please refine your Address Search.')
        }
      })
    },
  },
  computed: {
  }
}
</script>