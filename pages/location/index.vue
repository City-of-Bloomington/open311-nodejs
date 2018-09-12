<template>
  <div>
    <div class="top" ref="top">
      <headerNav />
    </div>

    <main v-bind:style="{top}">
      <div class="search">
        <div class="form-group" v-if="!geoError">
          <div v-if="loading" class="loader-wrapper">
            <div class="bar"></div>
          </div>

          <label for="location">Location:</label>
          <input v-model="location.address_string"
                 type="text"
                 id="location"
                 ref="location-input">
          <button type="button" @click="getCurrentPosition">Locate Me</button>
          <button type="button" @click="searchAddressString">Search</button>
          <button type="button" @click="clearSearch">Clear</button>
        </div>
      </div>

      <h3 v-if="loading">Detecting your location.</h3>

      <div v-if="geoError">
        <h3>It's helpful to report the issue location.</h3><br>
        <p>Please allow your browser to access your location or you may click <strong>Next</strong> to move on without reporting a location.</p><br>
      </div>

      <div id="map-element" v-if="!geoError"></div>

      <h3 v-if="addressResults">Search Results:</h3>
      <ul>
        <li v-for="address in addressResults"
            :key="address.streetAddress"
            @click="addressResult(address)">
            {{address.streetAddress}}
        </li>
      </ul>

      <footer>
        <nuxt-link
          v-if="!loading"
          to="/fields"
          class="button next-button"
          @click.native="storeCommitLocationInfo">Next</nuxt-link>
      </footer>
    </main>
  </div>
</template>

<style type="text/css">

  h3 strong {
    font-weight: 600;
  }

  h4 {
    margin: 0 0 20px 0;
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
  components: {
    headerNav
  },
  data() {
    return {
      top:              '',
      geoError:         false,
      loading:          false,
      location: {
        lat:            null,
        long:           null,
        address_string: null
      },
      map:              null,
      search_results:   null,
      addressesList:    null
    }
  },
  mounted() {
    var self = this;
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
      alert('error')
    });


    // self.geoLocate().then(function() {
    //   console.log('promise then...')
    //   setTimeout(function(){ self.initMap() }, 5000);
    // })
    // self.initMap();
  },
  watch: {
    locationUpdate: function() {
      this.updateAddressString(this.location.lat,this.location.long);
    }
  },
  methods: {
    topHeight() {
      this.top = this.$refs.top.clientHeight + 'px';
    },
    geoLocate() {
      // if (navigator.geolocation) {
      //   console.log(`%c .: Geolocation supported :.`,`background: #1e59ae; color: white; padding: 2px 5px; border-radius: 2px;`);
      //   return new Promise((resolve, reject) =>  {
      //     var self = this;
      //     navigator.geolocation.getCurrentPosition(displayLocationInfo, resolve, reject);
      //     resolve(displayLocationInfo);

      //     self.loading = true;
      //     self.geoError = false;

      //     function displayLocationInfo(position) {
      //       self.location.lat = position.coords.latitude;
      //       self.location.long = position.coords.longitude;
      //       self.updateMap(self.location.lat,self.location.long);
      //       console.log(`Original -- latitude: `
      //                   + `${self.location.lat} | `
      //                   + `longitude: ${self.location.long}`
      //       );
      //     }
      //   }, error => {
      //     self.loading = false;
      //     self.geoError = true;
      //     console.log(`%c .: User Blocked Geolocation :.`,`background: red; color: white; padding: 2px 5px; border-radius: 2px;`);
      //     reject(error);
      //   })
      // } else {
      //   console.log(`%c .: Geolocation NOT supported :.`,`background: red; color: white; padding: 2px 5px; border-radius: 2px;`);
      // }
      // geoPromise().then(geo => {
      //   alert('running geoloco');
      // }).catch(error => {
      //   alert('NOT running geoloco');
      // });
      // return geoPromise;

        // var self = this;
        // self.loading = true;
        // self.geoError = false;

        // if(navigator.geolocation){
        //   navigator.geolocation.getCurrentPosition(displayLocationInfo, geolocation_error, geolocation_options);
        //   console.log(`%c .: Geolocation supported :.`,`background: #1e59ae; color: white; padding: 2px 5px; border-radius: 2px;`);
        // } else {
        //   console.log(`%c .: Geolocation NOT supported :.`,`background: red; color: white; padding: 2px 5px; border-radius: 2px;`);
        // }

        // function geolocation_error() {
          // self.loading = false;
          // self.geoError = true;
          // console.log(`%c .: User Blocked Geolocation :.`,`background: red; color: white; padding: 2px 5px; border-radius: 2px;`);
        // }

        // var geolocation_options = {
        //   enableHighAccuracy: true
        // };

        // function displayLocationInfo(position) {
          // self.location.lat = position.coords.latitude;
          // self.location.long = position.coords.longitude;
          // self.updateMap(self.location.lat,self.location.long);
          // console.log(`Original -- latitude: `
          //             + `${self.location.lat} | `
          //             + `longitude: ${self.location.long}`
          // );
        // };
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
          console.log(`%c .: Geolocation NOT supported :.`,`background: red; color: white; padding: 2px 5px; border-radius: 2px;`);
        }
      })
      .catch( error => {
        console.log(error);
        // var msg = null;
        // switch(error.code) {
        //   case error.PERMISSION_DENIED:
        //       msg = "User denied the request for Geolocation.";
        //       break;
        //   case error.POSITION_UNAVAILABLE:
        //       msg = "Location information is unavailable.";
        //       break;
        //   case error.TIMEOUT:
        //       msg = "The request to get user location timed out.";
        //       break;
        //   case error.UNKNOWN_ERROR:
        //       msg = "An unknown error occurred.";
        //       break;
        // }
        // alert(msg);
      })
    },
    updateAddressString(lat,long){

      // does this return x/y backwards?!
      axios.get(`https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/reverseGeocode?f=pjson&location=${long},${lat}`)
      .then(response => {
        this.loading = false;
        this.location.address_string = response.data.address.Match_addr;

        // it's backwards?
        // this.location.lat = response.data.location.x;
        // this.location.long = response.data.location.y;
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
        iconUrl:      '/crosshair.png',
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
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
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
    },
    searchAddressString() {
      var self = this;
      if(self.location.address_string != '') {
        alert(`This might take a while ...`);
        axios.get(`https://bloomington.in.gov/master_address/?format=json&queryType=address&query=${this.location.address_string}`)
        .then(response => {
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
    }
  }
}
</script>