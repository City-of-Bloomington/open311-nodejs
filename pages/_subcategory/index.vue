<template>
  <div>
    <header class="subcategory">
      <headerNav
        :nav-sub-group="navSubGroup"
        :step-active="stepActive" />
    </header>

    <main class="subcategory">
      <ul>
        <li v-for="subCat in subGroupList"
            :key="subCat.service_name"
            @click="subGroupName(subCat.service_name,subCat.service_code)">
            <nuxt-link :to="{name:'subcategory-fields', params:{'fields':subCat.service_code}}">{{ subCat.service_name }}</nuxt-link>
        </li>
        
        <li @click="showModal = true">
          <span>Can't find what your looking for?</span>
        </li>
      </ul>

      <modal v-if="showModal">
        <h4 slot="header">uReport: Can't Find It</h4>
        <p slot="body">Can't find what you are looking for?</p>

        <p slot="body">You may send an e-mail directly to <strong>info@bloomington.in.gov</strong>, or call the City at <strong>812.349.3400</strong>.</p>

        <button slot="footer" @click="showModal = false">OK</button>
      </modal>

      <emerModal />
    </main>
    <nuxt-child/>
  </div>
</template>

<style lang="scss" scoped>
  main {
    &.subcategory {
      margin: 0 auto;
      height: calc(100vh - 200px);

      ul {
        width: 100%;
      }

      @media only screen
      and (min-device-width : 320px)
      and (max-device-width : 480px) {
        margin-top: 5px;
        height: 375px;
      }
    }
  }
</style>

<script>
import axios     from 'axios'
import emerModal from '~/components/emerModal.vue'
import headerNav from '~/components/nav.vue'
import modal     from '~/components/modal.vue'
import { 
  mapFields }    from 'vuex-map-fields'

export default {
  beforeRouteEnter (to, from, next) {
    if(from.name !== 'index')
      next(vm => { vm.backHome = true; });
    next();
  },
  head () {
    return {
      titleTemplate: `%s - ${this.group}`,
      meta: [
        { hid:     'description',
          name:    'description',
          content: `Submit a ${this.group} uReport service request.`
        }
      ]
    }
  },
  components: {
    modal,
    emerModal,
    headerNav
  },
  data() {
    return {
      backHome:        false,
      showModal:       false,
      navSubGroup:     false,
      stepActive:      2,
      
    }
  },
  created(){
    console.log('To ::', this.$route)

    let stepData = {
      name: this.$route.name,
      path: this.$route.fullPath,
    }

    this.$store.dispatch('setProgressStepTwo', stepData);
  },
  mounted() {
    if(this.group == ''){
      switch (this.$route.params.subcategory) {
        case this.routeNames.cs:
          this.groupProperName = this.routeNames.csProper
          break;
        case this.routeNames.spt:
          this.groupProperName = this.routeNames.sptProper
          break;
        case this.routeNames.pr:
          this.groupProperName = this.routeNames.prProper
          break;
        case this.routeNames.h:
          this.groupProperName = this.routeNames.hProper
          break;
        case this.routeNames.wsu:
          this.groupProperName = this.routeNames.wsuProper
          break;
        case this.routeNames.m:
          this.groupProperName = this.routeNames.mProper
          break;
        default:
          this.$router.push({ path: '/' });
      }
      this.$store.dispatch('setGroupName', this.groupProperName)
    }
  },
  methods: {
    subGroupName(name, code) {
      let newCode = this.service_code != code || this.service_code == '';
      
      if(newCode) {
        this.$store.dispatch('setSubGroupName', name);
        this.$store.dispatch('setGroupCode',    code);
        this.$store.dispatch('setRouteCode',    code);

        this.getServiceAttrs(code)
        .then((res) => {
          let data = res.attributes.map((e, i) => {
            let dataReady = {...e, answer_value: ''}
            return dataReady
          });

          this.$store.dispatch('setPreServiceAttrs', data);
        })
        .catch(err => { console.log(`get fields err - ${err}`); });
      }
    }
  },
  computed: {
    ...mapFields([
      'initGroupData',
      'fromServiceCode',
      'routeNames',
      'serviceInfos.service_group.group',
      'serviceInfos.service_group.service_code',
    ]),
    subGroupList() {
      const allsubGroups = this.initGroupData
      .filter(g => g.group == this.group);
      return allsubGroups
    }
  }
}
</script>