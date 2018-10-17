<template>
  <div>
    <header ref="topHeight" v-bind:style="{height: paddingTop}">
      <headerNav :step-active="stepActive" :step-complete="stepComplete"/>
    </header>

    <main v-bind:style="{paddingTop}">
      <!-- {{ $route.params }}<br><br>
      {{allDatas()}}<br><br>
      {{group}}<br><br> -->
      <ul class="subcategories">
        <li v-if="!groupProperName"
            v-for="subCat in subGroupList"
            :key="subCat.service_name"
            @click="subGroupName(subCat.service_name,subCat.service_code)">
            <nuxt-link :to="{name:'subcategory-info', params:{'info':subCat.service_code}}">{{ subCat.service_name }}</nuxt-link>
        </li>

        <li v-if="groupProperName"
            v-for="groups in allDatas()"
            :key="groups.service_name"
            @click="subGroupName(groups.service_name,subCat.service_code)">
            <nuxt-link :to="{name:'subcategory-info', params:{'info':groups.service_code}}">{{ groups.service_name }}</nuxt-link>
        </li>
      </ul>

      <button class="text-btn" @click="showModal = true">- Can't Find It? -</button>
      <modal v-if="showModal">
        <h4 slot="header">uReport: Can't Find It</h4>
        <p slot="body">Can't find what you are looking for?</p>

        <p slot="body">You may send an e-mail directly to <strong>info@bloomington.in.gov</strong>, or call the City at <strong>812.349.3400</strong>.</p>

        <button slot="footer" @click="showModal = false">OK</button>
      </modal>
    </main>
    <nuxt-child/>
  </div>
</template>

<script>
import axios from 'axios'
import headerNav from '~/components/nav.vue'
import modal from '~/components/modal.vue'

export default {
  middleware: 'redirect-home',
  head () {
    return {
      titleTemplate: `%s - ${this.$store.getters.group}`,
      bodyAttrs: {
        class: this.showingModal ? 'showing-modal' : ''
      }
    }
  },
  components: {
    modal,
    headerNav
  },
  data() {
    return {
      groupName: '',
      groupRouteName: '',
      groupProperName: '',
      paddingTop:   '',
      showModal:    false,
      allData:      [],
      stepActive: {
        one:   false,
        two:   true,
        three: false,
        four:  false,
        five:  false,
        six:   false
      },
      stepComplete: {
        one:   true,
        two:   false,
        three: false,
        four:  false,
        five:  false,
        six:   false
      }
    }
  },
  mounted() {
    console.log('created mounted');

    this.topHeight();

    if(this.group == ''){
      this.groupRouteName = this.groupsAsLong(this.$route.params.subcategory);
      console.log('groupRouteName', this.groupRouteName);
      this.allDatas();
      this.formatGroupName();

      if(this.groupRouteName == 'cleanupsanitation') {
        this.groupProperName = 'Cleanup & Sanitation';
      } else if (this.groupRouteName == 'streetsparkingtraffic') {
        this.groupProperName = 'Streets, Parking & Traffic';
      } else if (this.groupRouteName == 'parksrecreation') {
        this.groupProperName = 'Parks & Recreation';
      } else if (this.groupRouteName == 'hazards') {
        this.groupProperName = 'Hazards';
      } else if (this.groupRouteName == 'watersewageutility') {
        this.groupProperName = 'Water, Sewage & Utility';
      }  else if (this.groupRouteName == 'miscellaneous') {
        this.groupProperName = 'Miscellaneous';
      } else {
        this.groupProperName = 'Unknown';
      };

      this.group = this.$store.commit('storeGroupName', this.groupProperName)
    }
  },
  methods: {
    topHeight() {
      this.paddingTop = `${this.topbarHeight + this.stepperHeight + this.navHeight}px`;
    },
    subGroupName(name,code) {
      return this.$store.commit('storeSubGroupName', name)
    },
    groupsAsLong(group) {
      return group
      .replace(/\s+/g, '')
      .replace(/,/g, '')
      .replace(/&/g, '')
      .replace(/\-/g, '')
      .replace(/and/g, '')
      .toLowerCase();
    },
    allDatas() {
      const allRoutesubGroups = this.allInitGroupData.filter(
        g => this.groupsAsLong(g.group) == this.groupRouteName
      );
      return allRoutesubGroups;
    },
    formatGroupName() {
      var paramName = this.$route.params.subcategory;

      console.log(paramName);
    }
  },
  computed: {
    allInitGroupData() {
      return this.$store.getters.initGroupData
    },
    routePath() {
      return this.groupsAsLong(this.$route.path)
    },
    subGroupList() {
      const allsubGroups = this.allInitGroupData.filter(
        g => g.group == this.$store.state.serviceInfos.service_group.group
      );
      return allsubGroups
    },
    topbarHeight() {
      return this.$store.getters.topbarHeight
    },
    navHeight() {
      return this.$store.getters.navHeight
    },
    stepperHeight() {
      return this.$store.getters.stepperHeight
    },
    group() { return this.$store.getters.group }
  }
}
</script>