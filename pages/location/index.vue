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
            <!-- <input v-bind:value="location.address_string"
                   v-on:input="location.address_string = $event.target.value"
                   type="text"
                   id="location"
                   ref="location-input"
                   autocomplete="off"
                   > -->
            <input v-model="location.address_string"
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
        <h3 v-if="addressResults">Search Results:</h3>
        <ul class="address-results">
          <li v-for="address in addressResults"
              :key="address.streetAddress"
              @click="addressResult(address)">
              {{address.streetAddress}}
          </li>
          <h4 v-show="(addressResults.length == 0 || addressResults.length == '') && !loadingLocation">No results</h4>
        </ul>
      </div>

      <div v-if="(location.address_string == '') && (!loading) && (!showGeoErrorHelp)">
        <h3>A service request requires an address in order to proceed.</h3><br>
        <p>Please search for an address or use the Geolocation <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20.619 20.619" id="geo-loc-text-icon"><title>location-icon</title><g id="Layer_2" data-name="Layer 2"><g id="Layer_1-2" data-name="Layer 1"><g id="location-icon"><circle cx="10.309" cy="10.309" r="8.149" fill="none" stroke="#fff" stroke-miterlimit="10"/><circle cx="10.309" cy="10.309" r="3.963" fill="#fff"/><line x1="10.309" y1="18.459" x2="10.309" y2="20.619" fill="none" stroke="#fff" stroke-miterlimit="10"/><line x1="10.309" x2="10.309" y2="2.16" fill="none" stroke="#fff" stroke-miterlimit="10"/><line x1="2.16" y1="10.309" y2="10.309" fill="none" stroke="#fff" stroke-miterlimit="10"/><line x1="20.619" y1="10.309" x2="18.459" y2="10.309" fill="none" stroke="#fff" stroke-miterlimit="10"/></g></g></g></svg> icon in the search to determine your location.</p><br>
      </div>

      <div id="map-element" ref="mapElement"></div>

      <footer>
        <nuxt-link
          v-if="showNextButton"
          to="/fields"
          class="button next-button"
          @click.native="storeCommitLocationInfo">Next</nuxt-link>
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
import axios     from 'axios'
import headerNav from '~/components/nav.vue'

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
      location: {
        lat:            this.hasLocationLat(),
        long:           this.hasLocationLong(),
        address_string: this.hasLocationAddress()
      },
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
    var self = this;
    self.geoError = false;

    if(self.hasLocationLat() == '') {
      self.loading = true;

      self.geoLocatePromise()
      .then(position => {
        if(position.coords) {
          self.location.lat = position.coords.latitude;
          self.location.long = position.coords.longitude;
        } else {
          console.log(`%c .: Geolocation position missing :.`,`background: red; color: white; padding: 2px 5px; border-radius: 2px;`);
        }
      })
      .then(function(){
        self.initMap();
      })
      .catch(function(){
        self.geoError = true;
        self.loading = false;
        console.log(`%c .: Geolocation Error :.`,`background: red; color: white; padding: 2px 5px; border-radius: 2px;`);
        self.location.lat = self.cityHallLat;
        self.location.long = self.cityHallLong;
        self.initMap();
      });
    } else {
      self.location.lat = this.$store.getters.locationLat;
      self.location.long = this.$store.getters.locationLong;
      self.initMap();
    }
  },
  watch: {
    locationUpdate: function() {
      this.updateAddressString(this.location.lat,this.location.long);
    }
  },
  methods: {
    hasLocationLat(){
      if(
        !this.$store.getters.locationLat ||
        this.$store.getters.locationLat == '' ||
        this.$store.getters.locationLat == null ||
        this.$store.getters.locationLat == undefined
      )
        return ''
      return this.$store.getters.locationLat
    },
    hasLocationLong(){
      if(
        !this.$store.getters.locationLong ||
        this.$store.getters.locationLong == '' ||
        this.$store.getters.locationLong == null ||
        this.$store.getters.locationLong == undefined
      )
        return ''
      return this.$store.getters.locationLong
    },
    hasLocationAddress(){
      if(
        !this.$store.getters.locationAddress ||
        this.$store.getters.locationAddress == '' ||
        this.$store.getters.locationAddress == null ||
        this.$store.getters.locationAddress == undefined
      )
        return ''
      return this.$store.getters.locationAddress
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
      var self = this;
      self.loading = true;
      if(self.location.address_string != '')
        self.location.address_string = ''
      self.geoLocatePromise()
      .then(position => {
        if(position.coords) {
          self.location.lat = position.coords.latitude;
          self.location.long = position.coords.longitude;
          self.updateMap(self.location.lat,self.location.long);
          console.log(`Original -- latitude: `
                      + `${self.location.lat} | `
                      + `longitude: ${self.location.long}`
          );
        } else {
          console.log(`%c .: Geolocation position N/A :.`,`background: red; color: white; padding: 2px 5px; border-radius: 2px;`);
        }
      })
      .catch( error => {
        console.log(error);
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
        console.log(`%c .: Geolocation Error -- ${errMsg}:.`,`background: red; color: white; padding: 2px 5px; border-radius: 2px;`);
      })
    },
    updateAddressString(lat,long){
      // does this return x/y backwards?!
      axios.get(`${process.env.arcgisRevGeo}${long},${lat}`)
      .then(response => {
        this.loading = false;
        this.location.address_string = response.data.address.Match_addr;
        this.updateMap(this.location.lat,this.location.long);
        // console.log(`updateAddressString() :: `, response.data.address.Match_addr);
      })
      .catch(error => {this.loading = false; });
    },
    storeCommitLocationInfo() {
      return this.$store.commit('storeLocationInfo', this.location)
    },
    initMap() {
      var self = this;

      var mymap = L.map('map-element');
      this.mymap = mymap;

      mymap.setView([this.location.lat,this.location.long], 20);

      var crosshairIcon = L.icon({
        iconUrl:      `${process.env.baseUrl}/images/map-crosshair.png`,
        iconSize:     [71, 71],
        iconAnchor:   [35.5, 35.5],
      });

      var crosshair = new L.marker(mymap.getCenter(),{
        icon:       crosshairIcon,
        clickable:  false
      }).addTo(mymap);

      mymap.on('move', function(ev) {
        crosshair.setLatLng(mymap.getCenter());
      });

      mymap.on('moveend', function(ev) {
        self.location.lat = mymap.getCenter().lat;
        self.location.long = mymap.getCenter().lng;
        // console.log(`Updated  -- latitude: `
        //           + `${self.location.lat} | `
        //           + `longitude: ${self.location.long}`
        // );
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
      // this.mymap.invalidateSize();
    },
    clearSearch() {
      this.loading = false;
      this.location.lat = '';
      this.location.long = '';
      this.search_results = '';
      this.location.address_string = '';
      this.$refs.mapElement.style.display = "none";
    },
    addressResult(address) {
      console.dir(JSON.stringify(address));
      this.location.lat = address.latitude;
      this.location.long = address.longitude;
      this.location.address_string = address.streetAddress;
      this.updateMap(this.location.lat,this.location.long);
      this.showResults = false;
    },
    searchAddressString() {
      var self = this;
      self.loadingLocation = true;
      console.log('loading search results');
      if(self.location.address_string != '') {
        axios.get(`${process.env.masterAddUrl}${this.location.address_string}`)
        .then(response => {
          self.showResults = true;
          self.loadingLocation = false;
          self.search_results = response.data;
          console.log(self.search_results)
        })
        .catch(error => {
          alert(`SAS :: Error happened: ${error}`);
        })
      }
    }
  },
  computed: {
    locationUpdate() {
      let { lat, long, address_string } = this.location
      return location
    },
    addressResults() {
      return this.search_results
    },
    showNextButton() {
      this.location.address_string;
      this.location.lat;
      this.location.long;
      this.loading;
      // this.geoError;
      return this.loading == false && (this.location.address_string != null || this.location.address_string != '') && this.location.lat != '' && this.location.long != '';

      // return (this.location.address_string != null || this.location.address_string != "");
    },
    showGeoErrorHelp() {
      this.geoError;
      this.loadingLocation;
      this.showResults;
      this.location.address_string;
      return this.geoError && this.loadingLocation == false && this.showResults == false && (this.location.address_string == null || this.location.address_string == '');
    }
  }
}
</script>