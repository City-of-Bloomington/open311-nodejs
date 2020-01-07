<template>
  <div>
    <header class="subcategory">
      <headerNav
        :back-home="backHome"
        :nav-sub-group="navSubGroup"
        :step-active="stepActive"
        :step-complete="stepComplete" />
    </header>

    <main class="subcategory">
      <ul class="subcategories">
        <li v-for="subCat in subGroupList"
            :key="subCat.service_name"
            @click="subGroupName(subCat.service_name,subCat.service_code)">
            <nuxt-link :to="{name:'subcategory-fields', params:{'fields':subCat.service_code}}">{{ subCat.service_name }}</nuxt-link>
        </li>
      </ul>

      <button
        class="text-btn"
        @click="showModal = true">- Can't Find It? -</button>

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

<script>
import axios     from 'axios'
import emerModal from '~/components/emerModal.vue'
import headerNav from '~/components/nav.vue'
import modal     from '~/components/modal.vue'
import { mapFields }  from 'vuex-map-fields'

export default {
  beforeRouteEnter (to, from, next) {
    if(from.name !== 'index')
      next(vm => {
        vm.backHome = true;
      });
    next();
  },
  head () {
    return {
      titleTemplate: `%s - ${this.$store.getters.group}`,
      meta: [
        { hid:     'description',
          name:    'description',
          content: `Submit a ${this.$store.getters.group} uReport service request.`
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
      groupName:       '',
      groupRouteName:  '',
      groupProperName: '',
      showModal:       false,
      allData:         [],
      navSubGroup:     false,
      stepActive: {
        one:           false,
        two:           true,
        three:         false,
        four:          false,
        five:          false,
        six:           false
      },
      stepComplete: {
        one:           true,
        two:           false,
        three:         false,
        four:          false,
        five:          false,
        six:           false
      },
      routeNames: {
        cs:           'cleanup-and-sanitation',
        csProper:     'Cleanup & Sanitation',
        spt:          'streets-parking-and-traffic',
        sptProper:    'Streets, Parking & Traffic',
        pr:           'parks-and-recreation',
        prProper:     'Parks & Recreation',
        h:            'hazards',
        hProper:      'Hazards',
        wsu:          'water-and-sewage-utility',
        wsuProper:    'Water & Sewage Utility',
        m:            'miscellaneous',
        mProper:      'Miscellaneous'
      }
    }
  },
  mounted() {
    if(this.group == ''){
      this.groupRouteName = this.$route.params.subcategory;

      switch (this.groupRouteName) {
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
      this.$store.commit('storeGroupName', this.groupProperName)
    }
  },
  methods: {
    subGroupName(name,code) {
      this.$store.commit('storeSubGroupName', name);
      this.$store.commit('storeGroupCode', code);
      this.$store.commit('storeRouteCode', code);
    }
  },
  computed: {
    ...mapFields([
      'initGroupData',
      'serviceInfos.service_group.group',
    ]),
    subGroupList() {
      const allsubGroups = this.initGroupData
      .filter(g => g.group == this.group);
      return allsubGroups
    }
  }
}
</script>