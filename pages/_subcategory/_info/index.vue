<template>
  <div>
    <!-- <header ref="topHeight" v-bind:style="{height: paddingTop}"> -->
    <header ref="topHeight" style="height: 180px;">
      <headerNav :step-active="stepActive" :step-complete="stepComplete" />
    </header>

    <main style="top: 180px;">
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

      <emerModal />
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
import axios     from 'axios'
import emerModal from '~/components/emerModal.vue'
import headerNav from '~/components/nav.vue'

export default {
  head () {
    return {
      titleTemplate: `%s - ${this.$store.getters.subGroup}`
    }
  },
  components: {
    headerNav,
    emerModal
  },
  data() {
    return {
      paddingTop:   '',
      routeCode:    '',
      routeCodeData:'',
      allData:      [],
      userInfo: {
        first_name: this.hasFirstName(),
        last_name:  this.hasLastName(),
        phone:      this.hasPhone(),
        email:      this.hasEmail()
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
  mounted() {
    if(this.$store.state.serviceInfos.service_group.service_code){
      this.topHeight();
      console.log('has group');
    } else if (this.$store.state.serviceInfos.service_group.service_code == '') {
      console.log('no group');
      this.routeCode = this.$route.params.info.substr(this.$route.params.info.lastIndexOf('/') + 1);
      this.$store.commit('storeRouteCode', this.routeCode);

      this.allDatas;
      this.routeDataGroup;
      this.routeDataSubGroup;
      this.topHeight();

      // axios.post(`${process.env.apiUrl}${process.env.servicesApi}`)
      // .then(res => { this.allData = res.data })
      // .then(res => {
      //   this.allDatas;
      //   this.routeDataGroup;
      //   this.routeDataSubGroup;
      //   // this.topHeight();
      // })
      // .then(res => {
      //   this.topHeightPlus();
      // })
      // .catch(err => {
      //   console.log(err);
      // });
    }
  },
  methods: {
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
    topHeight() {
      this.paddingTop = `${this.topbarHeight + this.stepperHeight + this.navHeight}px`;
    },
    topHeightPlus() {
      // look into this extra spacing on refactor
      this.paddingTop = `${this.topbarHeight + this.stepperHeight + this.navHeight + 30}px`;
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
    },
    allInitGroupData() {
      return this.$store.getters.initGroupData
    },
    allDatas() {
      const allRoutesubGroups = this.allInitGroupData.filter(
        g => g.service_code == this.routeCode
      );
      return allRoutesubGroups[0];
    },
    routeDataGroup() {
      this.$store.commit('storeGroupName', this.allDatas.group);
      return this.allDatas.group;
    },
    routeDataSubGroup() {
      this.$store.commit('storeSubGroupName', this.allDatas.service_name);
      return this.allDatas.service_name;
    }
  }
}
</script>