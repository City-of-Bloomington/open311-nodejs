<template>
  <div>
    <header class="info-process">
      <headerNav
        :back-home="backHome"
        :nav-sub-group="navSubGroup"
        :step-active="stepActive"
        :step-complete="stepComplete" />
    </header>

    <main class="info-process" ref="mainElm">
      <p>To submit anonymously, leave these values empty.</p><br>
      <div class="form-group">
        <label for="first-name">First Name:</label>
        <input v-model="userInfo.first_name"
               type="text"
               placeholder="First Name"
               id="first-name">
      </div>

      <div class="form-group">
        <label for="last-name">Last Name:</label>
        <input v-model="userInfo.last_name"
               type="text"
               placeholder="Last Name"
               id="last-name">
      </div>

      <div class="form-group">
        <label for="phone">Phone:</label>
        <input v-model="userInfo.phone"
               type="tel"
               placeholder="Phone"
               pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
               id="phone">
      </div>

      <div class="form-group">
        <label for="email">Email:</label>
        <input v-model="userInfo.email"
               type="email"
               placeholder="Email"
               id="email">
      </div>

      <p v-if="reCaptchaError">Error - Please validate the reCaptcha below.</p>
      <div class="g-recaptcha" :data-sitekey="reCaptchaSiteKey"></div>

      <emerModal />
      <footer>
        <button class="button next-button" @click="submitPost()">Submit</button>
        <!-- <nuxt-link to="/location"
                   class="button next-button"
                   @click.native="storeCommitUserInfo">Submit Request</nuxt-link> -->
      </footer>
    </main>
  </div>
</template>

<style lang="scss">
.g-recaptcha {
  margin-bottom: 15px;
}
</style>

<script>
import axios     from 'axios'
import emerModal from '~/components/emerModal.vue'
import headerNav from '~/components/nav.vue'

export default {
  // beforeRouteEnter (to, from, next) {
  //   if(from.name !== 'subcategory')
  //     next(vm => {
  //       vm.backHome = true;
  //     });
  //   next();
  // },
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
      ],
      script: [
        { src: 'https://www.google.com/recaptcha/api.js', async: true, defer: true }
      ]
    }
  },
  components: {
    headerNav,
    emerModal
  },
  data() {
    return {
      reCaptchaError:     false,
      reCaptchaSiteKey:   process.env.reCaptchaSiteKey,
      backHome:           false,
      routeCode:          '',
      routeCodeData:      '',
      allData:            [],
      navSubGroup:        true,
      userInfo: {
        first_name:       this.hasFirstName(),
        last_name:        this.hasLastName(),
        phone:            this.hasPhone(),
        email:            this.hasEmail()
      },
      stepActive: {
        one:              true,
        two:              false,
        three:            false,
        four:             false,
        five:             false,
        six:              false
      },
      stepComplete: {
        one:              false,
        two:              false,
        three:            false,
        four:             false,
        five:             false,
        six:              false
      }
    }
  },
  mounted() {},
  methods: {
    dataURItoBlob(dataURI) {
      if(dataURI) {
        // convert base64/URLEncoded data component to raw binary data held in a string
        var byteString;
        if (dataURI.split(',')[0].indexOf('base64') >= 0)
          byteString = atob(dataURI.split(',')[1]);
        else
          byteString = unescape(dataURI.split(',')[1]);

        // separate out the mime component
        var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

        // write the bytes of the string to a typed array
        var ia = new Uint8Array(byteString.length);
        for (var i = 0; i < byteString.length; i++) {
          ia[i] = byteString.charCodeAt(i);
        }

        return new Blob([ia], {type:mimeString});
      }
    },
    hasFirstName(){
      if(
        !this.$store.getters.firstName ||
        this.$store.getters.firstName == '' ||
        this.$store.getters.firstName == null ||
        this.$store.getters.firstName == undefined
      )
        return ''
      return this.$store.getters.firstName
    },
    hasLastName(){
      if(
        !this.$store.getters.lastName ||
        this.$store.getters.lastName == '' ||
        this.$store.getters.lastName == null ||
        this.$store.getters.lastName == undefined
      )
        return ''
      return this.$store.getters.lastName
    },
    hasPhone(){
      if(
        !this.$store.getters.phone ||
        this.$store.getters.phone == '' ||
        this.$store.getters.phone == null ||
        this.$store.getters.phone == undefined
      )
        return ''
      return this.$store.getters.phone
    },
    hasEmail(){
      if(
        !this.$store.getters.email ||
        this.$store.getters.email == '' ||
        this.$store.getters.email == null ||
        this.$store.getters.email == undefined
      )
        return ''
      return this.$store.getters.email
    },
    submitPost() {
      if(!grecaptcha.getResponse()) {
        this.reCaptchaError = true;
        console.log(`%c .: CS :: reCaptcha invalid :.`,`background: red; color: white; padding: 2px 5px; border-radius: 2px;`);
      } else {
        this.$store.commit('storePersonalInfo', this.userInfo)

        var formData       = new FormData();
        var dataURL        = this.postMedia;
        var blob           = this.dataURItoBlob(dataURL);
        var requestAttrs   = this.postServiceAttrs; //serviceAttrs
        var captchaReponse = grecaptcha.getResponse();

        formData.append("g_recaptcha_response", captchaReponse)
        formData.append("service_code", this.postServiceCode)
        formData.append("lat", this.postLat)
        formData.append("long", this.postLong)
        formData.append("address_string", this.postAddressString)
        formData.append("email", this.postEmail)
        formData.append("first_name", this.postFirstName)
        formData.append("last_name", this.postLastName)
        formData.append("phone", this.postPhone)
        formData.append("description", this.postDefaultDescription)
        formData.append("media", blob)

        Object.keys(requestAttrs).map(function(key) {
          return formData.append(`attribute[${key}]`,`${requestAttrs[key]}`);
        }).join('&');

        var config = {
          onUploadProgress: function (progressEvent) {
            this.percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            console.log('Percent Completed:' + this.percentCompleted);
          }
        }

        // for (var pair of formData.entries()) {
        //   console.log(pair[0]+ ', ' + pair[1]);
        // }

        this.$refs.mainElm.innerHTML = 'Hold tight!<br><br>Almost finished processing your service request.';

        axios.post(`${process.env.postProxy}`, formData, config)
        .then(response => {
          this.$store.commit('storeResponseInfo', response);
        })
        .then(response => {
          this.$router.push({ path: 'confirm' })
        })
        .catch(error => {
          this.reCaptchaError = true;
          console.log(`%c .: SS :: ${JSON.stringify(error.response.data.responseDesc)} :.`,`background: red; color: white; padding: 2px 5px; border-radius: 2px;`);
        });
      }
    }
  },
  computed: {
    postLat() {
      return this.$store.state.serviceInfos.location_info.lat
    },
    postLong() {
      return this.$store.state.serviceInfos.location_info.long
    },
    postAddressString() {
      return this.$store.state.serviceInfos.location_info.address_string
    },
    postEmail() {
      return this.$store.state.serviceInfos.personal_info.email
    },
    postFirstName() {
      return this.$store.state.serviceInfos.personal_info.first_name
    },
    postLastName() {
      return this.$store.state.serviceInfos.personal_info.last_name
    },
    postPhone() {
      return this.$store.state.serviceInfos.personal_info.phone
    },
    postMedia() {
      return this.$store.getters.defaultImage
    },
    postServiceAttrs() {
      return this.$store.getters.serviceAttrs
    },
    postDefaultDescription() {
      return this.$store.getters.defaultDescription
    },
    postServiceCode() {
      var sc = parseInt(this.$store.state.serviceInfos.service_group.service_code, 10)
      return sc
    }
  }
}
</script>