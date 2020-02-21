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
      margin: 5px auto 0 auto;
      height: 355px;
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
      
      backHome:           false,
      routeCode:          '',
      routeCodeData:      '',
      allData:            [],
      navSubGroup:        true,
      stepActive:         5,
    }
  },
  methods: {
    
  },
  computed: {
    ...mapFields([
      
    ]),
  }
}
</script>