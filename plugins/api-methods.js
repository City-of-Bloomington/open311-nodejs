import Vue    from 'vue'
import axios  from 'axios'
import proj4  from 'proj4'

Vue.mixin({
  data() { return {} },
  computed: {},
  methods: {
    /**
     * An HTTP GET request promise returning service question
     * attributes given a service category ID.
     *
     * @promise     getServiceAttrs
     * @param       { String } code - service category id
     * @resolve     { Object }
     * @reject      { Error }
     * @return      { Promise <Object> } Resolves to an Object containing
     *              any additional service questions 
     */
    getServiceAttrs(code) {
      return new Promise((resolve, reject) => {
        axios.get(`${process.env.apiUrl}${process.env.attrsApi}${code}.json`)
        .then(res => resolve(res.data))
        .catch(e => reject(e))
      })
    },
    /**
     * An HTTP GET request promise returning a service request
     * given the service request ID.
     *
     * @promise     getServiceRequest
     * @param       { String } id - service category id
     * @resolve     { Object }
     * @reject      { Error }
     * @return      { Promise <Object> } Resolves to an Object containing
     *              the service request by id.
     */
    getServiceRequest(id) {
      // https://bloomington.in.gov/crm/open311/v2/requests/171665.json
      return new Promise((resolve, reject) => {
        axios.get(`${process.env.apiUrl}/requests/${id}.json`)
        .then(res => resolve(res.data))
        .catch(e => reject(e));
      })
    },
    /**
     * An HTTP POST request promise which hands off our formData
     * to Vuex for Express submission.
     *
     * @promise     formSubmitHandOff
     * @param       { Object } formData
     * @param       { Object } config - optional
     * @resolve     { Object }
     * @reject      { Error }
     * @return      { Promise <Object> } Resolves to an Object containing
     *              any additional service questions
     */
    formSubmitHandOff(formData, config){
      return new Promise((resolve, reject) => {
        axios.post(`${process.env.postProxy}`, formData, config)
        .then(response => {
          this.$store.commit('storeResponseInfo', response);
        })
        .then(response => {
          this.$router.push({ path: 'confirm' });
          resolve('formData sent')
        })
        .catch(error => {
          this.reCaptchaError = true;
          console.log(`%c .: SS :: ${JSON.stringify(error.response.data.responseDesc)} :.`, `background: red; color: white; padding: 2px 5px; border-radius: 2px;`);
          reject('formData fail', error.response.data.responseDesc)
        });
      })
    },
    /**
     * Given a string, you'll get it back formatted
     * replacing spaces for dashes, & for and, and removing commas.
     * Helps for use with CSS, etc.
     *
     * @promise     stringToDashed
     * @param       { String } string
     * @return      { String}  The string formatted with dashes.
     * 
     */
    stringToDashed(string){
      return string
        .replace(/\s+/g, '-')
        .replace(/,/g, '')
        .replace(/&/g, 'and')
        .toLowerCase();
    },
    getCityBoundaryGeoJson() {
      return new Promise((resolve, reject) => {
        axios.get(process.env.cityBoundaryGeoJson)
          .then((res) => resolve(res.data.features))
          .catch((e) => reject(e))
      })
    },
    setCityBoundary(res) {
      let lngLat    = [],
          geoCoords = [],
           boundary = res;

      if (boundary) {
        let raw = [];
        
        boundary.forEach((r) => {
          raw.push(r.geometry.coordinates)
        })
        var repJson = [].concat.apply([], [].concat.apply([], raw));

        let projCoords = repJson.map((p) => {
          return p.map((e) => {
            return proj4(this.coordsProjection).inverse(e);
          })
        });

        let projCoordsLatLng = projCoords.map((p) => {
          return p.map((e) => {
            return { lat: e[1], lng: e[0] }
          })
        });

        // remove 2, 3, 4 as they are n/a areas
        let setOrder = [0, 1, 5, 6, 7, 8],
            output   = setOrder.map(i => projCoordsLatLng[i]);

        return this.$store.dispatch('setCityBoundaryData', output);
      }
    },
  }
})