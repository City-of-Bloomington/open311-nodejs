import Vue    from 'vue'
import axios  from 'axios'

Vue.mixin({
  data() { return {} },
  computed: {},
  methods: {
    /**
     * A Promise returning service question attributes.
     *
     * @promise     getUser
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
  }
})