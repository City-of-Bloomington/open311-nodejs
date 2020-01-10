<template>
  <div>
    <header class="location">
      <headerNav
        :nav-sub-group="navSubGroup"
        :step-active="stepActive"
        :step-complete="stepComplete" />

      <div class="search container">
        <form action="" @submit.prevent>
          <div class="form-group">

            <div v-if="loading">
              <h3 v-if="!geoError" style="position: absolute; margin: 0 0 0 40px; font-size: 20px; line-height: 33px;">Finding your location.</h3>

              <h3 v-if="geoError" style="position: absolute; margin: 0 0 0 45px; font-size: 20px; line-height: 33px;">Can't find your location.</h3>

              <div class="loader-wrapper" v-if="!geoError">
                <div class="bar"></div>
              </div>
            </div>

            <label for="location">Location:</label>
            <input v-model="address_string"
                   v-on:keyup.enter="searchAddressString"
                   v-on:keyup.delete="clearSearch"
                   type="text"
                   id="location"
                   ref="location-input"
                   autocomplete="off">
            <button type="button" class="locate" @click="getCurrentPosition">
              <span>Locate Me</span>
            </button>

            <button type="button" class="clear" @click="clearSearch">
              <span>Clear Search</span>
            </button>
          </div>
        </form>
      </div>
    </header>

    <main class="location">
      <div v-if="showGeoErrorHelp">
        <h3>Please report the issue location.</h3><br>
        <p>You may search for an address manually without using the Geolocation API.</p><br>
        <p>- or -</p><br>
        <p>How to enable (Geolocation API) using:</p>
        <ul>
          <li>
            <a :href="chromeGeoTutUrl" target="_blank">Google Chrome</a>
          </li>
          <li>
            <a :href="firefoxGeoTutUrl" target="_blank">FireFox</a>
          </li>
          <li>
            <a :href="safariGeoTutUrl" target="_blank">Safari</a>
          </li>
        </ul>
      </div>

      <div style="position: relative;" v-if="loadingLocation">
        <h3>Gathering results:</h3>
        <div class="loader-wrapper location">
          <div class="bar"></div>
        </div>
      </div>

      <div class="search-results" ref="results" v-if="showResults">
        <h3 v-if="addressResults">
          Search Results:
          <span v-if="addressResults.length >= 1">{{addressResults.length}} results</span>
          <span v-if="((addressResults.length == 0 || addressResults.length == '') && !loadingLocation) || (address_string == '')">No results</span>
        </h3>
        <ul class="address-results">
          <li v-for="address in addressResults"
              :key="address.streetAddress"
              @click="addressResult(address)">
              {{address.streetAddress}}
          </li>
        </ul>
      </div>

      <div v-if="(address_string == '') && (!loading) && (!showGeoErrorHelp)">
        <h3>A service request requires an address in order to proceed.</h3><br>
        <p>Please search for an address or use the Geolocation <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20.619 20.619" id="geo-loc-text-icon"><title>location-icon</title><g id="Layer_2" data-name="Layer 2"><g id="Layer_1-2" data-name="Layer 1"><g id="location-icon"><circle cx="10.309" cy="10.309" r="8.149" fill="none" stroke="#fff" stroke-miterlimit="10"/><circle cx="10.309" cy="10.309" r="3.963" fill="#fff"/><line x1="10.309" y1="18.459" x2="10.309" y2="20.619" fill="none" stroke="#fff" stroke-miterlimit="10"/><line x1="10.309" x2="10.309" y2="2.16" fill="none" stroke="#fff" stroke-miterlimit="10"/><line x1="2.16" y1="10.309" y2="10.309" fill="none" stroke="#fff" stroke-miterlimit="10"/><line x1="20.619" y1="10.309" x2="18.459" y2="10.309" fill="none" stroke="#fff" stroke-miterlimit="10"/></g></g></g></svg> icon in the search input to determine your location.</p><br>
      </div>

      <div id="map-element" ref="mapElement"></div>

      <footer>
        <nuxt-link
          v-if="showNextButton"
          to="/info"
          class="button next-button">Next</nuxt-link>
      </footer>
    </main>
  </div>
</template>

<style type="text/css">

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
import axios          from 'axios'
import headerNav      from '~/components/nav.vue'
import { mapFields }  from 'vuex-map-fields'

let leaflet;
if (process.browser) {
  leaflet = require('leaflet')
}

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
      cityHallLong:     '-86.5369425',
      cityHallLat:      '39.1703084',
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
      }
    }
  },
  mounted() {
    let vm      = this;
    vm.geoError = false;

    if(vm.hasLocationLat() == '') {
      vm.loading = true;

      vm.geoLocatePromise()
      .then(position => {
        if(position.coords) {
          vm.lat  = position.coords.latitude;
          vm.long = position.coords.longitude;
        } else {
          console.log(`%c .: Geolocation position missing :.`,`background: red; color: white; padding: 2px 5px; border-radius: 2px;`);
        }
      })
      .then(function(){
        vm.initMap();
      })
      .catch(function(){
        vm.geoError = true;
        vm.loading  = false;
        vm.lat      = vm.cityHallLat;
        vm.long     = vm.cityHallLong;
        vm.initMap();

        console.log(`%c .: Geolocation Error :.`,`background: red; color: white; padding: 2px 5px; border-radius: 2px;`);
      });
    } else {
      vm.initMap();
    }
  },
  watch: {
    lat: function() {
      this.updateAddressString(this.lat, this.long);
    }
  },
  methods: {
    hasLocationLat(){
      if(
        !this.lat ||
        this.lat == '' ||
        this.lat == null ||
        this.lat == undefined
      )
        return ''
      return this.lat
    },
    hasLocationLong(){
      if(
        !this.long ||
        this.long == '' ||
        this.long == null ||
        this.long == undefined
      )
        return ''
      return this.long
    },
    hasLocationAddress(){
      if(
        !this.address_string ||
        this.address_string == '' ||
        this.address_string == null ||
        this.address_string == undefined
      )
        return ''
      return this.address_string
    },
    geoLocatePromise() {
      if (navigator.geolocation) {
        console.log(`%c .: Geolocation supported :.`,`background: #1e59ae; color: white; padding: 2px 5px; border-radius: 2px;`);
        return new Promise((resolve, reject) =>
          navigator.geolocation.getCurrentPosition(resolve, reject)
        )
      } else {
        return new Promise(
          resolve => resolve({})
        )
      }
    },
    getCurrentPosition() {
      this.loading = true;

      if(this.address_string != '')
        this.address_string = ''
      this.geoLocatePromise()
      .then(position => {
        if(position.coords) {
          this.lat = position.coords.latitude;
          this.long = position.coords.longitude;
          this.updateMap(this.lat, this.long);
          console.log(`Original -- latitude: `
                      + `${this.lat} | `
                      + `longitude: ${this.long}`
          );
        } else {
          console.log(`%c .: Geolocation position N/A :.`,`background: red; color: white; padding: 2px 5px; border-radius: 2px;`);
        }
      })
      .catch( error => {
        console.log(error);
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
        console.log(`%c .: Geolocation Error -- ${errMsg}:.`,`background: red; color: white; padding: 2px 5px; border-radius: 2px;`);
      })
    },
    updateAddressString(lat, long){
      axios.get(`${process.env.arcgisRevGeo}${long},${lat}`)
      .then(response => {
        this.loading = false;
        this.address_string = response.data.address.Match_addr;
        this.updateMap(lat, long);
        this.$store.dispatch('setLocationLat', lat)
        this.$store.dispatch('setLocationLong', long)
      })
      .catch(error => {this.loading = false; });
    },
    initMap() {
      let self    = this,
          mymap   = L.map('map-element');
      this.mymap  = mymap;

      mymap.setView([this.lat, this.long], 20);

      let crosshairIcon = L.icon({
        iconUrl:      `${process.env.baseUrl}/images/map-crosshair.png`,
        iconSize:     [71, 71],
        iconAnchor:   [35.5, 35.5],
      });

      let crosshair = new L.marker(mymap.getCenter(),{
        icon:       crosshairIcon,
        clickable:  false
      }).addTo(mymap);

      mymap.on('move', function(ev) {
        crosshair.setLatLng(mymap.getCenter());
      });

      mymap.on('moveend', function(ev) {
        self.lat = mymap.getCenter().lat;
        self.long = mymap.getCenter().lng;
      });

      L.tileLayer(process.env.mapBoxUrl,{
        attribution:  false,
        maxZoom:      18,
        setView:      true,
        detectRetina: true,
        id:           `${process.env.mapBoxId}`,
        accessToken:  `${process.env.mapBoxKey}`
      }).addTo(mymap);
    },
    updateMap(lat,long) {
      this.mymap.setView([lat,long]);
      this.$refs.mapElement.style.display = "block";
    },
    clearSearch() {
      this.loading        = false;
      this.lat            = '';
      this.long           = '';
      this.search_results = '';
      this.address_string = '';
      this.$refs.mapElement.style.display = "none";
    },
    addressResult(address) {
      this.lat            = address.latitude;
      this.long           = address.longitude;
      this.address_string = address.streetAddress;
      this.showResults    = false;
      this.updateMap(this.lat, this.long);
    },
    searchAddressString() {
      this.loadingLocation = true;

      if(this.address_string != '') {
        axios.get(`${process.env.masterAddUrl}${this.address_string}`)
        .then(response => {
          this.showResults      = true;
          this.loadingLocation  = false;
          this.search_results   = response.data;
        })
        .catch(error => {
          alert(`Error via Master Address API: ${error}`);
        })
      }
    }
  },
  computed: {
    ...mapFields([
      'serviceInfos.location_info.address_string',
      'serviceInfos.location_info.lat',
      'serviceInfos.location_info.long',
    ]),
    addressResults() {
      return this.search_results
    },
    showNextButton() {
      this.address_string;
      this.lat;
      this.long;
      this.loading;
      return this.loading == false && (this.address_string != null || this.address_string != '') && this.lat != '' && this.long != '';
    },
    showGeoErrorHelp() {
      this.geoError;
      this.loadingLocation;
      this.showResults;
      this.address_string;
      return this.geoError && this.loadingLocation == false && this.showResults == false && (this.address_string == null || this.address_string == '');
    }
  }
}
</script>