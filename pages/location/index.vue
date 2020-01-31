<template>
  <div>
    <header class="location">
      <headerNav
        :nav-sub-group="navSubGroup"
        :step-active="stepActive"
        :step-complete="stepComplete" />
    </header>

    <main class="location">
        <div class="field-group">
          <label for="location-search" v-if="geoLocationPosition.geoCoded">
            Service Request Location: {{ geoLocationPosition.geoCoded[0].formatted_address }}
          </label>

          <gmap-autocomplete
            placeholder="Service Request Location"
            @place_changed="setPlace"
            :select-first-on-enter="true"
            :options="{
              radius:       150000,
              strictBounds: true,
              bounds:       cityBoundary,
              componentRestrictions: { country: 'us' }
            }" />
        </div>

      <GmapMap
        :center="mapCenter()"
        @center_changed="updateCenter"
        @dragend="geocodeLatLng"
        :zoom="13"
        map-type-id="roadmap"
        style="width: 100%; height: 300px"
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
        <div id="cross"></div>

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
    margin: 5px auto 0 auto;
    background-color: pink;
    height: auto;

    form {
      margin: 0 0 20px 0;
    }

    ::v-deep .vue-map-hidden {
      display: block;
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
      background-color: purple !important;
      height: auto;
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
  // beforeRouteEnter (to, from, next) {
  //   if(from.path == '/')
  //     next('/');
  //   next();
  // },
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
      addressInput:     '',

      autosuggChoice: '',
      latLng: null,

      cityHallLong:     -86.5369425,
      cityHallLat:      39.1703084,
      chromeGeoTutUrl:  'https://support.google.com/chrome/answer/142065?hl=en',
      firefoxGeoTutUrl: 'https://support.mozilla.org/en-US/kb/does-firefox-share-my-location-websites',
      safariGeoTutUrl:  'https://support.apple.com/en-us/HT204690',
      geoError:         false,
      loadingLocation:  false,
      loading:          false,
      showMap:          true,
      map:              null,
      search_results:   null,
      addressesList:    null,
      showResults:      false,
      navSubGroup:      true,
      stepActive: {
        one:            false,
        two:            false,
        three:          false,
        four:           true,
        five:           false,
        six:            false,
      },
      stepComplete: {
        one:            true,
        two:            true,
        three:          true,
        four:           false,
        five:           false,
        six:            false,
      },
      newBounds: null,
      autoSuggResults: null,

      geoLocationPositionError: null,
      geoLocationPosition:      {
        lat:      null,
        lng:      null,
        accuracy: null,
        geoCoded: null,
      },

      reportedMapCenter: null,

    }
  },
  mounted() {
    this.$gmapApiPromiseLazy()
    .then(() => {
      console.log('google -', google)
      console.log('cityBoundary -', this.cityBoundary)

      this.geoLocatePromise()
      .then((res) => {

        console.log('geoLocatePromise() -', res);

        this.reportedMapCenter = {
          lat: res.coords.latitude,
          lng: res.coords.longitude,
        }
        
        // this.geoLocationPosition.lat = res.coords.latitude;
        // this.geoLocationPosition.lng = res.coords.longitude;

        
        this.geoLocationPosition.accuracy = res.coords.accuracy;

        let pos = {
          lat: res.coords.latitude,
          lng: res.coords.longitude
        };

        this.geocodeLatLng(pos);
      })
      .catch((err) => {
        this.geoLocationPositionError = err.message;
        console.log('geoLocatePromise() -', err.message);
      });
    });

    // this.getCurrentPosition()
    // .then((position) => {
    //   if(position.coords) {
    //     self.location.lat = position.coords.latitude;
    //     self.location.long = position.coords.longitude;
    //   } else {
    //     console.log(`%c .: Geolocation position missing :.`,`background: red; color: white; padding: 2px 5px; border-radius: 2px;`);
    //   }
    // })
    // .catch((err) => {
      
    // });

    

    // this.newBounds = new google.maps.LatLngBounds(
    //   new google.maps.LatLng(28.70, -127.50), 
    //   new google.maps.LatLng(48.85, -55.90));
    // });

   

    this.getCityBoundaryGeoJson()
    .then((res) => {
      console.log('getCityBoundaryGeoJson() -', res)
      this.setCityBoundary(res);
    })
    .catch((e) => {
      console.log(`City Boundary Failed 🛑`,
                  `\n\n ${e} \n\n`);
    });
  },
  watch: {},
  methods: {
    updateCenter(latLng) {
      
      if(latLng) {
        this.reportedMapCenter = {
          lat: latLng.lat(),
          lng: latLng.lng(),
        }

        console.log('reportedMapCenter - ', this.reportedMapCenter)
        // this.mapCenter();
      }
      
    },
    mapCenter(){
      // if(this.geoLocationPosition.lat != null)
      //   return {"lat": this.geoLocationPosition.lat,"lng": this.geoLocationPosition.lng}

      if(this.reportedMapCenter != null)
        return this.reportedMapCenter
        
      return this.cityHallLatLong
    },
    setPlace(place){
      console.log('setPlace() - ', place.formatted_address);
      console.log('setPlace() - ', place.address_components);
      console.log('setPlace() - ', place.name)
      console.log('setPlace() - ', place)

      
      this.autoSuggResults = place;

      this.reportedMapCenter = {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
      }
    },
    geoLocatePromise() {
      return new Promise((resolve, reject) => {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        }
      })
    },
    geocodeLatLng(map){

      // this.reportedMapCenter = {
      //     lat: latLng.lat(),
      //     lng: latLng.lng(),
      //   }

      // let pos = {
      //   lat: this.geoLocationPosition.lat,
      //   lng: this.geoLocationPosition.lng
      // };

      const geocoder = new google.maps.Geocoder();

      if(this.reportedMapCenter) {
        geocoder.geocode({ 'location': this.reportedMapCenter }, (results, status) => {
          this.geoLocationPosition.geoCoded = results;

          console.log('geocodeLatLng() - ', results, status); 
        });
      }
    },
    getCurrentPosition() {
      this.geoLocatePromise()
      .then(position => {
        if(position.coords) {
          console.log(`Original -- latitude: `
                      + `${position.coords.latitud} | `
                      + `longitude: ${position.coords.longitude}`
          );
        } else {
          console.log(`%c .: Geolocation position N/A :.`,`background: red; color: white; padding: 2px 5px; border-radius: 2px;`);
        }
      })
      .catch((error) => {
        var errMsg = null;
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
        console.log('geo fail ', error)
        console.log(`%c .: Geolocation Error -- ${errMsg}:.`,`background: red; color: white; padding: 2px 5px; border-radius: 2px;`);
      })
    },
  },
  computed: {
    ...mapFields([
      'serviceInfos.location_info.address_string',
      'serviceInfos.location_info.lat',
      'serviceInfos.location_info.long',
    ]),
    google: gmapApi,
  }
}
</script>