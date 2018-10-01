<template>
  <div>
    <div class="top" ref="topHeight">
      <headerNav />
    </div>

    <main v-bind:style="{paddingTop}">
      <div class="search">
        <form action="" @submit.prevent>
          <div class="form-group" v-if="!geoError">
            <div v-if="loading" class="loader-wrapper">
              <div class="bar"></div>
            </div>

            <label for="location">Location:</label>
            <input v-model="location.address_string"
                   v-on:keyup.enter="searchAddressString"
                   type="text"
                   id="location"
                   ref="location-input">
            <button type="button" class="locate" @click="getCurrentPosition">
              <span>Locate Me</span>
            </button>

            <button type="button" class="clear" @click="clearSearch">
              <span>Clear Search</span>
            </button>
          </div>
        </form>
      </div>

      <h3 v-if="loading">Loading location data.</h3>

      <div v-if="geoError">
        <h3>It's helpful to report the issue location.</h3><br>
        <p>Please allow your browser to access your location or you may click <strong>Next</strong> to move on without reporting a location.</p><br>
      </div>

      <div class="search-results" ref="results" v-if="showResults">
        <h3 v-if="addressResults">Search Results:</h3>
        <ul class="address-results">
          <li v-for="address in addressResults"
              :key="address.streetAddress"
              @click="addressResult(address)">
              {{address.streetAddress}}
          </li>
        </ul>
      </div>

      <div id="map-element" v-if="!geoError"></div>

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

  .loader-wrapper {
    position: absolute;
    top: 42px;
  }
</style>

<script>
import axios from 'axios'
import headerNav from '~/components/nav.vue'

let leaflet;
if (process.browser) {
  leaflet = require('leaflet')
}

export default {
  middleware: 'redirect-home',
  head () {
    return {
      titleTemplate: `%s - ${this.$store.getters.subGroup}`
    }
  },
  components: {
    headerNav
  },
  data() {
    return {
      paddingTop:       '',
      geoError:         false,
      loading:          false,
      location: {
        lat:            null,
        long:           null,
        address_string: null
      },
      showMap:          true,
      map:              null,
      search_results:   null,
      addressesList:    null,
      showResults:      true
    }
  },
  mounted() {
    var self = this;
    self.loading = true;
    self.geoError = false;
    self.topHeight();
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
      console.log(`%c .: Geolocation Error :.`,`background: red; color: white; padding: 2px 5px; border-radius: 2px;`);
    });
  },
  watch: {
    locationUpdate: function() {
      this.updateAddressString(this.location.lat,this.location.long);
    }
  },
  methods: {
    topHeight() {
      this.paddingTop = `${this.headerHeight + this.navHeight + 20}px`;
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
      axios.get(`https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/reverseGeocode?f=pjson&location=${long},${lat}`)
      .then(response => {
        this.loading = false;
        this.location.address_string = response.data.address.Match_addr;
        console.log(`updateAddressString() :: `, response.data.address.Match_addr);
      })
      .catch(error => {this.loading = false; })
      .then(function () {});
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
        iconUrl:      './crosshair.png',
        iconSize:     [150, 277],
        iconAnchor:   [70, 146],
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
        console.log(`Updated  -- latitude: `
                  + `${self.location.lat} | `
                  + `longitude: ${self.location.long}`
        );
      });

      L.tileLayer(process.env.mapBoxUrl,{
        attribution:  false,
        maxZoom:      18,
        setView:      true,
        detectRetina: true,
        id:           'mapbox.streets',
        accessToken:  `${process.env.mapBoxKey}`
      }).addTo(mymap);
    },
    updateMap(lat,long) {
      this.mymap.setView([lat,long], 20);
    },
    clearSearch() {
      this.loading = false;
      this.location.lat = '';
      this.location.long = '';
      this.search_results = '';
      this.location.address_string = '';
      // this.mymap.setView([39.1636505,-86.525757], 13);
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
      self.loading = true;
      if(self.location.address_string != '') {
        axios.get(`https://bloomington.in.gov/master_address/?format=json&queryType=address&query=${this.location.address_string}`)
        .then(response => {
          self.loading = false;
          self.search_results = response.data;
          console.log(self.search_results)
        })
        .catch(error => {
          alert(`SAS :: Error happened: ${error}`);
        })
        .then(function () {});
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
      this.address_string;
      this.location.lat;
      this.location.long;
      this.loading;
      return this.loading == false && this.address_string != '' && this.location.lat != '' && this.location.long != '';
    },
    headerHeight() {
      return this.$store.getters.headerHeight
    },
    navHeight() {
      return this.$store.getters.navHeight
    }
  }
}
</script>