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
          <button type="button" @click="searchAddressString">Search</button>
          <button type="button" @click="clearSearch">Clear</button>
        </div>
      </div>

      <h3 v-if="loading">Detecting your location.</h3>

      <div v-if="geoError">
        <h3>It's helpful to report the issue location.</h3><br>
        <p>Please allow your browser to access your location or you may click <strong>Next</strong> to move on without reporting a location.</p><br>
      </div>

      <h4 v-html="location.address_string"></h4>

      <ul>
        <li v-for="address in addressResults"
            :key="address.streetAddress"
            @click="addressResult(address)">
            {{address.streetAddress}} - - - {{address.latitude}},{{address.longitude}}
        </li>
      </ul>

      <div id="map-element" v-if="!geoError"></div>

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

  h4 {
    margin: 0 0 20px 0;
  }

  /*.search {
    margin: 0 0 20px 0;
  }*/

  .loader-wrapper {
    position: absolute;
    top: 42px;
  }
</style>

<script>
import L from 'leaflet';
import axios from 'axios'
import headerNav from '~/components/nav.vue'

export default {
  head () {
    return {
      script: [
        { src: './leaflet/leaflet.js' }
      ],
      link: [
        { rel: 'stylesheet', href: './leaflet/leaflet.css' }
      ]
    }
  },
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
    self.loading = true;
    self.geoError = false;

    if(navigator.geolocation){
      navigator.geolocation.getCurrentPosition(displayLocationInfo, geolocation_error, geolocation_options);
      console.log(`%c .: Geolocation supported :.`,`background: #1e59ae; color: white; padding: 2px 5px; border-radius: 2px;`);
    } else {
      console.log(`%c .: Geolocation NOT supported :.`,`background: red; color: white; padding: 2px 5px; border-radius: 2px;`);
    }

    function geolocation_error() {
      self.loading = false;
      self.geoError = true;
      console.log(`%c .: User Blocked Geolocation :.`,`background: red; color: white; padding: 2px 5px; border-radius: 2px;`);
    }

    var geolocation_options = {
      enableHighAccuracy: true,
      timeout           : 27000
    };

    function displayLocationInfo(position) {
      self.location.lat = position.coords.latitude;
      self.location.long = position.coords.longitude;
      self.initMap();
      console.log(`Original -- latitude: `
                  + `${self.location.lat} | `
                  + `longitude: ${self.location.long}`
      );
    }
  },
  watch: {
    locationUpdate: function() {
      this.updateAddressString(this.location.lat,this.location.long);
    },
    mapsCords: function() {
      this.initMap(this.location.lat,this.location.long);
    }
  },
  methods: {
    topHeight() {
      this.top = this.$refs.top.clientHeight + 'px';
    },
    updateAddressString(lat,long){
      axios.get(`https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/reverseGeocode?f=pjson&featureTypes=&location=${long},${lat}`)
      .then(response => {
        this.loading = false;
        this.location.address_string = response.data.address.Match_addr;
        console.log(`UAS :: `,response.data);
      })
      .catch(error => {
        this.loading = false;
        // alert(`UAS :: Error happened: ${error}`);
      })
      .then(function () {});
    },
    storeCommitLocationInfo() {
      return this.$store.commit('storeLocationInfo', this.location)
    },
    initMap(lat,long) {
      var self = this;
      var mymap = L.map('map-element');
      mymap.setView([self.lat,self.long], 20);

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
    clearSearch() {
      this.loading = false;
      this.location.lat = '',
      this.location.long = '',
      this.search_results = '',
      this.location.address_string = ''
    },
    addressResult(address) {
      console.dir(JSON.stringify(address)),
      this.location.lat = address.latitude,
      this.location.long = address.longitude,
      this.location.address_string = address.streetAddress
    },
    searchAddressString() {
      var self = this;
      alert(`clicked search ... this take A WHILE`);
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