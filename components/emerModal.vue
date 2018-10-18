<template>
  <modal v-if="!seenEmerModal">
    <h4 slot="header">uReport: Non-Emergency Use Only</h4>
    <p slot="body">This system is not for reporting emergencies or imminent safety hazards.</p>

    <p slot="body">If this is an emergency, please immediately dial 911 for assistance.</p>

    <button slot="footer" @click="emerModal">I Understand</button>
  </modal>
</template>

<script>
import modal from '~/components/modal.vue'

export default {
  components: { modal },
  methods: {
    emerModal() {
      this.$store.commit('seenNonEmerModal', true);
    }
  },
  computed: {
    seenEmerModal() {
      return this.$store.getters.seenNonEmerModal
    }
  }
}
</script>