<template>
  <main>
    <headerNav />

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
</template>

<script>
import headerNav from '~/components/nav.vue'

export default {
  components: {
    headerNav
  },
  data() {
    return {
      userInfo: {
        first_name: '',
        last_name: '',
        phone: '',
        email: ''
      }
    }
  },
  methods: {
    storeCommitUserInfo() {
      return this.$store.commit('storePersonalInfo', this.userInfo)
    }
  },
  computed: {}
}
</script>