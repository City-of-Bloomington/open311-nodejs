<template>
  <div>
    <header class="info-process">
      <headerNav
        :nav-sub-group="navSubGroup"
        :step-active="stepActive" />
    </header>

    <main class="info" ref="mainElm">
      <p>You may submit anonymously by leaving these fields empty.</p><br>
      <div class="form-group">
        <label for="first-name">First Name:</label>
        <input v-model="first_name"
               type="text"
               placeholder="First Name"
               id="first-name">
      </div>

      <div class="form-group">
        <label for="last-name">Last Name:</label>
        <input v-model="last_name"
               type="text"
               placeholder="Last Name"
               id="last-name">
      </div>

      <div class="form-group">
        <label for="phone">Phone:</label>
        <input v-model="phone"
               type="tel"
               placeholder="Phone"
               pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
               id="phone">
      </div>

      <div class="form-group">
        <label for="email">Email:</label>
        <input v-model="email"
               type="email"
               placeholder="Email"
               id="email">
      </div>

      <p v-if="reCaptchaError">Error - Please validate the reCaptcha below.</p>
      <!-- <div
        class="g-recaptcha"
        :data-sitekey="reCaptchaSiteKey"
        data-callback="getToken()"
        data-size="invisible"></div> -->

      <emerModal />
      <footer>
        <button
          class="g-recaptcha button next-button"
          :data-sitekey="reCaptchaSiteKey"
          data-size="invisible"
          @click="submitPost()">Submit</button>
      </footer>
    </main>
  </div>
</template>

<style lang="scss">

main {
  &.info {
    margin: 0 auto;
    height: calc(100vh - 210px);

    @media only screen
    and (min-device-width : 320px)
    and (max-device-width : 480px) {
      display: flex;
      background-color: purple !important;
      margin: 5px auto 0 auto;
    }
  }
}

.g-recaptcha {
  margin-bottom: 15px;
}
</style>

<script>
import axios          from 'axios'
import emerModal      from '~/components/emerModal.vue'
import headerNav      from '~/components/nav.vue'
import { mapFields }  from 'vuex-map-fields'

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
  created() {
     
  },
  mounted() {
    setTimeout(() => { grecaptcha.execute() }, 100);
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
      stepActive:         5,
    }
  },
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
    submitPost() {
      if(!grecaptcha.getResponse()) {
        this.reCaptchaError = true;
        console.log(`%c .: CS :: reCaptcha invalid :.`,`background: red; color: white; padding: 2px 5px; border-radius: 2px;`);
      } else {
        let formData        = new FormData(),
            blob            = this.dataURItoBlob(this.default_image),
            captchaReponse  = grecaptcha.getResponse();

        formData.append("g_recaptcha_response", captchaReponse)
        formData.append("service_code",         parseInt(this.service_code, 10))
        formData.append("lat",                  this.lat)
        formData.append("long",                 this.lng)
        formData.append("address_string",       this.address)
        formData.append("email",                this.email)
        formData.append("first_name",           this.first_name)
        formData.append("last_name",            this.last_name)
        formData.append("phone",                this.phone)
        formData.append("description",          this.default_description)

        if(blob != undefined)
          formData.append("media",              blob)

        Object.values(this.pre_service_attrs).map((key) => {
          return formData.append(`attribute[${key.code}]`, `${key.answer_value}`)
        }).join('&');

        let config = {
          onUploadProgress: (progressEvent) => {
            this.percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            console.log(`Percent Completed: ${this.percentCompleted}`);
          }
        }

        for (var pair of formData.entries()) {
          console.log(pair[0]+ ', ' + pair[1]);
        }

        let processingHTML = `
          <div>
            <p>Processing your service request.</p>
          </div>
        `;

        this.$refs.mainElm.innerHTML = processingHTML;

        this.formSubmitHandOff(formData, config)
        .then(res  => { console.log(res) })
        .catch(err => { console.log(err) });
      }
    }
  },
  computed: {
    ...mapFields([
      'serviceInfos.service_group.service_code',
      'serviceInfos.pre_service_attrs',
      'serviceInfos.service_attrs',
      'serviceInfos.location_data.lat',
      'serviceInfos.location_data.lng',
      'serviceInfos.location_data.address',
      'serviceInfos.personal_info.email',
      'serviceInfos.personal_info.first_name',
      'serviceInfos.personal_info.last_name',
      'serviceInfos.personal_info.phone',
      'serviceInfos.default_description',
      'serviceInfos.default_image',
    ]),
  }
}
</script>