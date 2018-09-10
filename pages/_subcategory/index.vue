<template>
  <div>
    <div class="top" ref="top">
      <headerNav />
    </div>

    <main v-bind:style="{top}">
      <ul class="subcategories">
        <li v-for="subCat in subGroupList"
          :key="subCat.service_name"
          @click="subGroupName(subCat)">
          <nuxt-link to="/info">{{ subCat.service_name }}</nuxt-link>
        </li>
      </ul>

      <button class="text-btn" @click="showModal = true">- Can't Find It? -</button>
      <modal v-if="showModal">
        <h3 slot="header">uReport: Can't Find It</h3>
        <p slot="body">Can't find what you are looking for?</p>

        <p slot="body">You may send an e-mail directly to <strong>info@bloomington.in.gov</strong>, or call the City at <strong>812.349.3400</strong>.</p>

        <button slot="footer" @click="showModal = false">OK</button>
      </modal>
    </main>
  </div>
</template>

<script>
import axios from 'axios'
import headerNav from '~/components/nav.vue'
import modal from '~/components/modal.vue'

export default {
  components: {
    modal,
    headerNav
  },
  data() {
    return {
      top:       '',
      showModal: false,
      allData:   []
    }
  },
  mounted() {
    this.topHeight();
    axios.post(`${process.env.apiUrl}${process.env.servicesApi}`)
    .then(res => { this.allData = res.data })
    .catch(err => {
      console.log(err);
    });
  },
  methods: {
    topHeight() {
      this.top = this.$refs.top.clientHeight + 'px';
    },
    subGroupName(name) {
      return this.$store.commit('storeSubGroupName', name)
    }
  },
  computed: {
    subGroupList() {
      const allsubGroups = this.allData.filter(
        g => g.group == this.$store.state.serviceInfos.service_group.group
      );
      return allsubGroups
    }
  }
}
</script>