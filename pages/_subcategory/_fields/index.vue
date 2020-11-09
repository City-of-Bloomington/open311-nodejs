<template>
  <div>
    <header class="info-process">
      <headerNav
        :nav-sub-group="navSubGroup"
        :step-active="stepActive" />
    </header>

    <main class="info" ref="mainElm">
      <h2>Your Information</h2>

      <p>By leaving the fields below empty, <strong>you may submit anonymously</strong>.</p>


      <p><strong>Note:</strong> <i>Information you provide through uReport is stored and retained by the City as a public record.</i></p>
        
      

      <form @submit.prevent="whoSubmit">
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
                id="phone">
        </div>

        <div class="form-group">
          <label for="email">Email:</label>
          <input v-model="email"
                type="email"
                placeholder="Email"
                id="email">
        </div>
      
      
      <footer>
          <input type="submit" value="Next" class="button next-button">
      </footer>

      </form>

      <emerModal />
    </main>
  </div>
</template>

<style lang="scss">

main {
  &.info {
    margin: 0 auto;
    height: calc(100vh - 210px);

    h2 {
      color: white;
      font-size: 20px;
      line-height: 22px;
      font-weight: 600;
      letter-spacing: .25px;
      margin: 0 0 5px 0;
    }

    p {
      color: rgba(255, 255, 255, 0.95);
      font-size: 16px;
      line-height: 24px;
      margin: 0 0 10px 0;

      strong {
        color: white;
      }
    }

    @media only screen
    and (min-device-width : 320px)
    and (max-device-width : 480px) {
      margin: 5px auto 0 auto;
      height: 100%;
    }
  }
}

.g-recaptcha {
  margin-bottom: 15px;
}
</style>

<script>
import emerModal      from '~/components/emerModal.vue'
import headerNav      from '~/components/nav.vue'
import { mapFields }  from 'vuex-map-fields'

export default {
  beforeRouteEnter (to, from, next) {
    // if(from.path == '/')
    //   next('/');
    // next();
    next(vm => {
      let serviceType = vm.initGroupData.find(obj => obj.service_code == to.params.fields);

      if(serviceType != undefined) {
        let catParam = vm.stringToDashed(serviceType.group);

        if(catParam != to.params.subcategory)
          vm.$router.replace({params: { subcategory: catParam }})

        vm.$store.dispatch('setSubGroupName', serviceType.service_name);
        vm.$store.dispatch('setGroupCode',    serviceType.service_code);
        vm.$store.dispatch('setRouteCode',    serviceType.service_code);
        vm.$store.dispatch('setGroupName',    serviceType.group)

      } else {
        vm.$router.push('/');
      }
    })
    next();
  },
  head () {
    return {
      titleTemplate: `%s - ${this.service_name}`,
      meta: [
        { hid: 'description', name: 'description', content: `Submit a ${this.group} (${this.service_name}) uReport service request.` }
      ]
    }
  },
  components: {
    headerNav,
    emerModal
  },
  created() {
    let stepThreeData = {
      name:     this.$route.name,
      path:     this.$route.fullPath,
    }
    
    let stepTwoData = {
      name:     'subcategory',
      path:     this.$route.params.subcategory,
    }
    
    this.$store.dispatch('setProgressStepThree', stepThreeData);
    this.$store.dispatch('setProgressStepTwo',   stepTwoData);
  },
  mounted() {},
  data() {
    return {
      routeCode:          '',
      routeCodeData:      '',
      allData:            [],
      navSubGroup:        true,
      stepActive:         3,
    }
  },
  methods: {
    whoSubmit() {
      this.$router.push({name: 'subcategory-fields-fields'});
    }
  },
  computed: {
    ...mapFields([
      'initGroupData',
      'serviceInfos.service_group.group',
      'serviceInfos.service_group.service_code',
      'serviceInfos.service_group.service_name',
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