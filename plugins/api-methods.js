import Vue    from 'vue'
import axios  from 'axios'

Vue.mixin({
  data() { return {} },
  computed: {},
  methods: {
    /**
     * An HTTP GET request promise returning service question
     * attributes given a service category ID.
     *
     * @promise     getServiceAttrs
     * @param       { Number } code - service category id
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
  }
})