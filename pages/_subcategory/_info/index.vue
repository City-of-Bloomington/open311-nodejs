<template>
  <div>
    <header ref="topHeight" v-bind:style="{height: paddingTop}">
      <headerNav :step-active="stepActive" :step-complete="stepComplete" />
    </header>

    <main v-bind:style="{paddingTop}">
      iiiii{{ $route.params }}
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

      <footer>
        <nuxt-link to="/location"
                   class="button next-button"
                   @click.native="storeCommitUserInfo">Next</nuxt-link>
        <p>Or, you may submit anonymously.</p>
      </footer>
    </main>
  </div>
</template>

<script>
import headerNav from '~/components/nav.vue'

export default {
  head () {
    return {
      titleTemplate: `%s - ${this.$store.getters.subGroup}`
    }
  },
  // middleware: ['redirect-home'],
  components: {
    headerNav
  },
  data() {
    return {
      paddingTop:   '',
      userInfo: {
        first_name: '',
        last_name:  '',
        phone:      '',
        email:      ''
      },
      stepActive: {
        one:   false,
        two:   false,
        three: true,
        four:  false,
        five:  false,
        six:   false
      },
      stepComplete: {
        one:   true,
        two:   true,
        three: false,
        four:  false,
        five:  false,
        six:   false
      }
    }
  },
  created() {
    console.log('info page created')
  },
  mounted() {
    this.topHeight();
  },
  methods: {
    topHeight() {
      this.paddingTop = `${this.topbarHeight + this.stepperHeight + this.navHeight}px`;
    },
    storeCommitUserInfo() {
      return this.$store.commit('storePersonalInfo', this.userInfo)
    }
  },
  computed: {
    topbarHeight() {
      return this.$store.getters.topbarHeight
    },
    navHeight() {
      return this.$store.getters.navHeight
    },
    stepperHeight() {
      return this.$store.getters.stepperHeight
    }
  }
}
</script>