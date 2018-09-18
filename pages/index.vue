<template>
  <div>
    <div class="top" ref="top">
      <search-input :data="groups" field="service_name"/>
    </div>

    <main v-bind:style="{paddingTop}">
    <!-- <main> -->
      <div class="grid">
        <div v-for="group in groupCategories"
             :key="group"
             @click="groupName(group)">
          <nuxt-link :to="'/subcategory'"
                     v-bind:class="groupsAsCss(`${group}`)"
                     class="item">
            <div class="icon"></div>
            <h3>{{ group }}</h3>
          </nuxt-link>
        </div>
      </div>

      <button class="text-btn" @click="showModal(true)">- Click to Read Disclaimer -</button>
      <modal v-if="showingModal">
        <h4 slot="header">uReport: Disclaimer</h4>
        <p slot="body"><strong>PLEASE NOTE:</strong></p>
        <p slot="body"><i>This system is <strong>not</strong> for reporting emergencies or imminent safety hazards.</i></p>

        <p slot="body">If this is an emergency, please immediately dial <strong>911</strong> for assistance.</p>

        <p slot="body">If this is a safety hazard that could cause an injury, please immediately call <strong>City Utilities Control at 812-339-1444</strong>.</p>

        <p slot="body">This number is staffed 24 hours a day. The appropriate staff will be dispatched to address the safety hazard.</p>

        <p slot="body">When in doubt, please call, even if you are not sure.</p>

        <p slot="body">You may also send an e-mail directly to info@bloomington.in.gov, or call the City at <strong>812.349.3400</strong>.</p>

        <button slot="footer" @click="showModal(false)">Ok</button>
      </modal>
      <p class="emergency">.: No Emergency Usage :.</p>
    </main>
  </div>
</template>

<script>
import axios from 'axios'
import searchInput from '~/components/searchInput.vue'
import modal from '~/components/modal.vue'

export default {
  head () {
    return {
      bodyAttrs: {
        class: this.showingModal ? 'showing-modal' : ''
      }
    }
  },
  components: {
    searchInput,
    modal
  },
  data() {
    return {
      paddingTop: '',
      showingModal: false,
      groups: []
    }
  },
  asyncData ({req, params}) {
    return axios.get(`${process.env.apiUrl}${process.env.servicesApi}`)
    .then((res) => { return { groups: res.data }})
    .catch((err) => { console.log(err); });
  },
  mounted() {
    this.topHeight();
  },
  methods: {
    topHeight() {
      this.paddingTop = `${this.$refs.top.clientHeight}px`;
    },
    groupsAsCss(group) {
      return group
      .replace(/\s+/g, '-')
      .replace(/,/g, '')
      .replace(/&/g, 'and')
      .toLowerCase();
    },
    groupName(name) {
      return this.$store.commit('storeGroupName', name)
    },
    showModal(val) {
      console.log(this.showingModal)
      console.log(val)
      this.showingModal = val;
    }
  },
  computed: {
    groupCategories() {
      return [...new Set(this.groups.map(g => g.group))]
    }
  }
}
</script>