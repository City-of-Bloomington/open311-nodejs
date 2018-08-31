<template>
  <main>
    <search-input/>

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

    <button class="text-btn" @click="showModal = true">- Disclaimer -</button>
    <modal v-if="showModal">
      <h3 slot="header">uReport: Disclaimer</h3>
      <p slot="body"><strong>PLEASE NOTE:</strong></p>
      <p slot="body"><i>This system is <strong>not</strong> for reporting emergencies or imminent safety hazards.</i></p>

      <p slot="body">If this is an emergency, please immediately dial <strong>911</strong> for assistance.</p>

      <p slot="body">If this is a safety hazard that could cause an injury, please immediately call <strong>City Utilities Control at 812-339-1444</strong>.</p>

      <p slot="body">This number is staffed 24 hours a day. The appropriate staff will be dispatched to address the safety hazard.</p>

      <p slot="body">When in doubt, please call, even if you are not sure.</p>

      <p slot="body">You may also send an e-mail directly to info@bloomington.in.gov, or call the City at <strong>812.349.3400</strong>.</p>

      <button slot="footer" @click="showModal = false">OK</button>
    </modal>
  </main>
</template>

<script>
import axios from 'axios'
import searchInput from '~/components/searchInput.vue'
import modal from '~/components/modal.vue'

export default {
  components: {
    searchInput,
    modal
  },
  data() {
    return {
      showModal: false,
      groups: []
    }
  },
  mounted() {
    axios.post(`${process.env.apiUrl}${process.env.servicesApi}`)
    .then(res => { this.groups = res.data })
    .catch(err => { console.log(err); });
  },
  methods: {
    groupsAsCss(group) {
      return group
      .replace(/\s+/g, '-')
      .replace(/,/g, '')
      .replace(/&/g, 'and')
      .toLowerCase();
    },
    groupName(name) {
      return this.$store.commit('storeGroupName', name)
    }
  },
  computed: {
    groupCategories() {
      return [...new Set(this.groups.map(g => g.group))]
    }
  }
}
</script>