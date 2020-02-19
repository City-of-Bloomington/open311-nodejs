<template>
  <div>
    <header class="location">
      <headerNav
        :nav-sub-group="navSubGroup"
        :step-active="stepActive" />
    </header>

    <main class="location">
      <div class="field-group">
        <label for="location-search">
          Service request location:
        </label>

        <gmap-autocomplete
          :value="location_data.placeAddress"
          :class="['autocomplete-search', {'locating': findingUserPosition }]"
          placeholder="Service Request Location"
          @place_changed="setPlace"
          :select-first-on-enter="true"
          :options="{
            strictBounds: true,
            bounds: {
              north:  39.2,
              south:  39.1,
              east:  -86.5,
              west:  -86.6
            },
          }" />

        <button
          :class="['find-me', {'locating': findingUserPosition }]"
          @click="getCurrentPosition">
          <!-- <svg class="pulse" expanded="true" height="20px" width="20px">
            <circle class="pulse" cx="50%" cy="50%" r="2px"></circle>
          </svg> -->

          <span v-if="findingUserPosition">Locating ...</span>
          <span v-else>Find me</span>
        </button>
      </div>

      <GmapMap
        :center="mapCenter()"
        @center_changed="updateCenter"
        @dragend="mapDragEnd"
        :zoom="zoom"
        map-type-id="hybrid"
        :options="{
          zoomControl:        true,
          mapTypeControl:     true,
          scaleControl:       false,
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
                  visibility: 'off'
                }
              ]
            },
            {
              featureType:    'poi.government',
              stylers: [
                {
                  visibility: 'off'
                }
              ]
            }
          ]
        }">
        <div class="cross"></div>

        <GmapPolygon
          v-if="cityBoundary"
          :paths="cityBoundary"
          :options="{
            strokeColor:    'rgb(30, 90, 174)',
            strokeOpacity:  0.8,
            strokeWeight:   2,
            fillColor:      'rgb(30, 90, 174)',
            fillOpacity:    0.15
          }"
        />
      </GmapMap>
      <footer>
        <nuxt-link
          v-if="true"
          to="/info"
          class="button next-button">Next</nuxt-link>
      </footer>
    </main>
  </div>
</template>

<style lang="scss" scoped>
main {
  &.location {
    margin: 0 auto;
    height: calc(100vh - 210px);
    
    $duration: 1.4s;

    @keyframes spin {
      0%   { transform: rotate(0deg);   }
      50%  { transform: rotate(135deg); }
      100% { transform: rotate(450deg); }
    } 

    form {
      margin: 0 0 20px 0;
    }

    label {
      color: white;
      font-weight: 600;
      font-size: 16px;
      margin: 0 0 5px 0;
    }

    .vue-map-container {
      width: 100%;
      height: 350px;
      margin: 20px 0;
    }

    .autocomplete-search {
      padding: 5px 8px 5px 95px;
      height: 28px;

      &.locating {
        padding-left: 110px;
      }
    }

    .field-group {
      position: relative;

      input {
        box-shadow: none;
      }
    }

    button {
      position: relative;

      &.find-me {
        height: 28px !important;
        margin: 0 0 0 auto;
        background: $color-green;
        // background: $color-orange-dark;
        // color: darken($color-orange-darker, 35%);
        padding: 5px 8px 5px 28px;
        font-size: 14px;
        position: absolute;
        left: 0;
        bottom: 0;
        -webkit-border-radius: 3px;
        -webkit-border-top-right-radius: 0 !important;
        -webkit-border-bottom-right-radius: 0 !important;
        -moz-border-radius: 3px;
        -moz-border-radius-topright: 0 !important;
        -moz-border-radius-bottomright: 0 !important;
        border-radius: 3px;
        border-top-right-radius: 0 !important;
        border-bottom-right-radius: 0 !important;

        &:focus {
          outline: none;
        }

        &:before {
          position: absolute;
          content: '';
          top: 5px;
          left: 5px;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20.619 20.619'%3E%3Ctitle%3Elocation-icon%3C/title%3E%3Cg id='Layer_2' data-name='Layer 2'%3E%3Cg id='Layer_1-2' data-name='Layer 1'%3E%3Cg id='location-icon'%3E%3Ccircle cx='10.309' cy='10.309' r='8.149' fill='none' stroke='%23fff' stroke-miterlimit='10'/%3E%3Ccircle cx='10.309' cy='10.309' r='3.963' fill='%23fff'/%3E%3Cline x1='10.309' y1='18.459' x2='10.309' y2='20.619' fill='none' stroke='%23fff' stroke-miterlimit='10'/%3E%3Cline x1='10.309' x2='10.309' y2='2.16' fill='none' stroke='%23fff' stroke-miterlimit='10'/%3E%3Cline x1='2.16' y1='10.309' y2='10.309' fill='none' stroke='%23fff' stroke-miterlimit='10'/%3E%3Cline x1='20.619' y1='10.309' x2='18.459' y2='10.309' fill='none' stroke='%23fff' stroke-miterlimit='10'/%3E%3C/g%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
          background-size: contain;
          width: 18px;
          height: 18px;
        }

        svg {
          position: absolute;
          left: 4px;

          .pulse {
            stroke: white; 
            stroke-width: 2px;
            stroke-opacity: 1;
            fill: white;
            fill-opacity: 0;
            transform-origin: 50% 50%;
            animation-duration: 2s;
            animation-name: pulse;
            animation-iteration-count: infinite;
          }

          @keyframes pulse {
            from {
              stroke-width: 3px;
              stroke-opacity: 1;
              transform: scale(0.3);
            }
            to {
              stroke-width: 0;
              stroke-opacity: 0.2;
              transform: scale(2.2);
            }
          }
        }

        &.locating {
          &:before {
            animation: spin $duration linear infinite;
          }
        }
      }

      &.locate {
        z-index: 1000;
        position: absolute;
        bottom: 5px;
        left: 0;
        width: 20px;
        height: 20px;
        background: red;
        display: block;

        span {
          @include visuallyHidden();
        }

        &:before {
          position: absolute;
          content: '';
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20.619 20.619'%3E%3Ctitle%3Elocation-icon%3C/title%3E%3Cg id='Layer_2' data-name='Layer 2'%3E%3Cg id='Layer_1-2' data-name='Layer 1'%3E%3Cg id='location-icon'%3E%3Ccircle cx='10.309' cy='10.309' r='8.149' fill='none' stroke='%23fff' stroke-miterlimit='10'/%3E%3Ccircle cx='10.309' cy='10.309' r='3.963' fill='%23fff'/%3E%3Cline x1='10.309' y1='18.459' x2='10.309' y2='20.619' fill='none' stroke='%23fff' stroke-miterlimit='10'/%3E%3Cline x1='10.309' x2='10.309' y2='2.16' fill='none' stroke='%23fff' stroke-miterlimit='10'/%3E%3Cline x1='2.16' y1='10.309' y2='10.309' fill='none' stroke='%23fff' stroke-miterlimit='10'/%3E%3Cline x1='20.619' y1='10.309' x2='18.459' y2='10.309' fill='none' stroke='%23fff' stroke-miterlimit='10'/%3E%3C/g%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
          background-size: contain;
          width: 20px;
          height: 20px;
        }
      }
    }

    ::v-deep .vue-map-hidden {
      pointer-events: none;
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
      
      .cross {
        display: block;
        width: 40px;
        height: 40px;
        background-size: contain;
        background-image: url("data:image/svg+xml,%3C%3Fxml version='1.0' encoding='utf-8'%3F%3E%3Csvg version='1.1' id='Layer_1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' width='71px' height='71px' viewBox='0 0 71 71' enable-background='new 0 0 71 71' xml:space='preserve'%3E%3Cg%3E%3Cg%3E%3Cpath fill='black' d='M35.5,47.6c-6.7,0-12.1-5.4-12.1-12.1c0-6.7,5.4-12.1,12.1-12.1c6.7,0,12.1,5.4,12.1,12.1C47.6,42.2,42.2,47.6,35.5,47.6z M35.5,25.4c-5.6,0-10.1,4.5-10.1,10.1s4.5,10.1,10.1,10.1s10.1-4.5,10.1-10.1S41.1,25.4,35.5,25.4z'/%3E%3C/g%3E%3Cg%3E%3Cpath fill='black' d='M71,33.8h-5.8c-0.9-15-12.9-27.1-28-28V0h-3.4v5.8c-15,0.9-27.1,12.9-28,28H0v3.4h5.8c0.9,15,12.9,27.1,28,28V71h3.4v-5.8 c15-0.9,27.1-12.9,28-28H71V33.8z M35.5,61.8C21,61.8,9.2,50,9.2,35.5S21,9.2,35.5,9.2S61.8,21,61.8,35.5S50,61.8,35.5,61.8z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
      }

      #cross{
        position: absolute;
        width: 2px;
        height: 20px;
        background: #000;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        pointer-events: none;
      }

      #cross::before{
        content: "";
        position: absolute;
        width: 20px;
        height: 2px;
        background: #000;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
    }

    @media only screen
    and (min-device-width : 320px)
    and (max-device-width : 480px) {
      margin-top: 10px;
      background-color: green !important;
      height: 355px;

      .vue-map-container {
        height: 210px;
        margin: 10px 0;
      }
    }
  }
}

button {
  color: white;
}
</style>

<script>
import axios          from 'axios'
import headerNav      from '~/components/nav.vue'
import { mapFields }  from 'vuex-map-fields'
import { gmapApi }    from 'vue2-google-maps'

export default {
  beforeRouteEnter (to, from, next) {
    if(from.path == '/')
      next('/');
    next();
  },
  head () {
    return {
      titleTemplate: `%s - ${this.$store.getters.subGroup}`,
      meta: [
        { hid: 'description', name: 'description', content: `Submit a ${this.$store.getters.group} (${this.$store.getters.subGroup}) uReport service request.` }
      ]
    }
  },
  components: {
    headerNav
  },
  data() {
    return {
      chromeGeoTutUrl:  'https://support.google.com/chrome/answer/142065?hl=en',
      firefoxGeoTutUrl: 'https://support.mozilla.org/en-US/kb/does-firefox-share-my-location-websites',
      safariGeoTutUrl:  'https://support.apple.com/en-us/HT204690',



      navSubGroup:      true,
      stepActive:       4,
      geoLocationPositionError: null,
      geoLocationPosition:      {
        lat:      null,
        lng:      null,
        accuracy: null,
        geoCoded: null,
      },

      reportedMapCenter:   null,
      zoom:                17,
      mapCenterCoords:     null,
      findingUserPosition: false
    }
  },
  created() {
    let stepData = {
      name: this.$route.name,
      path: this.$route.fullPath,
    }

    this.$store.dispatch('setProgressStepFour', stepData);
  },
  mounted() {
    this.$gmapApiPromiseLazy()
    .then(() => {
      if(this.location_data == null) {
        this.geoLocatePromise()
        .then((res) => {

          this.findingUserPosition = false;

          console.log(`geoLocatePromise() `,
                      this.consoleLog.success
                      `\n\n ${res} \n\n`);

          this.reportedMapCenter = {
            lat: res.coords.latitude,
            lng: res.coords.longitude,
          }

          this.geoLocationPosition.accuracy = res.coords.accuracy;

          this.geocodeLatLng(this.reportedMapCenter);
        })
        .catch((err) => {
          this.geoLocationPositionError = err.message;
          console.log('geoLocatePromise() -', err.message);
        });
      } else {
        this.reportedMapCenter = {
          lat: this.location_data.lat,
          lng: this.location_data.lng,
        }
      }
    });

    if(!this.cityBoundary){
      this.getCityBoundaryGeoJson()
      .then((res) => this.setCityBoundary(res))
      .catch((e)  => {
        console.log(`City Boundary Failed 🛑`,
                    this.consoleLog.error
                    `\n\n ${e} \n\n`);
      });
    }
  },
  watch: {},
  methods: {
    updateCenter(latLng) {
      if(latLng) {
        this.mapCenterCoords = {
          lat: latLng.lat(),
          lng: latLng.lng(),
        }
        console.log('updateCenter() - ', this.mapCenterCoords)
      }
    },
    geocodeLatLng(coords){
      const geocoder = new google.maps.Geocoder();

      if(coords) {
        geocoder.geocode({ 'location': coords }, (results, status) => {
          this.geoLocationPosition.geoCoded = results;

          let locationData = {
            address:      results[0].formatted_address,
            placeAddress: results[0].formatted_address,
            lat:          results[0].geometry.location.lat(),
            lng:          results[0].geometry.location.lng()
          }

          this.$store.dispatch('setLocationData', locationData);

          console.log('geocodeLatLng() - ', results, status); 
        });
      } else {
        console.log('Sorry cant run geocodeLatLng(coords) w/ out `coords = { lat:xxx, lng:xxx }`')
      }
    },
    mapDragEnd() {
      if(this.mapCenterCoords) {
        this.geocodeLatLng(this.mapCenterCoords);

        this.reportedMapCenter = {
          lat: this.mapCenterCoords.lat,
          lng: this.mapCenterCoords.lng,
        }
      }
    },
    mapCenter(){
      if(this.reportedMapCenter != null)
        return this.reportedMapCenter
        
      return this.cityHallLatLong
    },
    setPlace(place){
      console.log('setPlace() - ', place)

      let locationData = {
        address:      place.name,
        placeAddress: place.name + ', ' + place.formatted_address,
        lat:          place.geometry.location.lat(),
        lng:          place.geometry.location.lng()
      }

      this.$store.dispatch('setLocationData', locationData);

      this.zoom = 19;

      this.reportedMapCenter = {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
      }
    },
    geoLocatePromise() {
      return new Promise((resolve, reject) => {
        if (navigator.geolocation) {
          this.findingUserPosition = true;
          navigator.geolocation.getCurrentPosition(resolve, reject)
        }
      })
    },
    getCurrentPosition() {
      
      this.geoLocatePromise()
      .then((position) => {
        if(position.coords) {
          
          let pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          
          this.reportedMapCenter = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          }

          this.findingUserPosition = false;
        
          console.log(this.geocodeLatLng(pos));
          console.log('getCurrentPosition() - ', position);
          console.log(this.reportedMapCenter);
        } else {
          console.log(`%c .: Geolocation position N/A :.`,`background: red; color: white; padding: 2px 5px; border-radius: 2px;`);
        }
      })
      .catch((error) => {
        let errMsg = null;

        switch(error.code) {
          case error.PERMISSION_DENIED:
            errMsg = "User denied the request for Geolocation.";
            break;
          case error.POSITION_UNAVAILABLE:
            errMsg = "Location information is unavailable.";
            break;
          case error.TIMEOUT:
            errMsg = "The request to get user location timed out.";
            break;
          case error.UNKNOWN_ERROR:
            errMsg = "An unknown error occurred.";
            break;
        }
        console.log('getCurrentPosition() geoLocatePromise - ', error)
        console.log(`%c .: Geolocation Error -- ${errMsg}:.`,`background: red; color: white; padding: 2px 5px; border-radius: 2px;`);
      })
    },
  },
  computed: {
    ...mapFields([
      'serviceInfos.location_data'
    ]),
    google: gmapApi,
  }
}
</script>