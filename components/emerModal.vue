<template>
  <modal v-if="!seen_modal">
    <template v-if="!seen_modal">
      <h4 slot="header">Notice</h4>
      <h4 slot="body">Non-Emergency Use Only</h4>
      <p slot="body">This system is not for reporting emergencies or imminent safety hazards.</p>

      <p slot="body">If this is an emergency, please dial 911.</p>

      <hr slot="body">

      <h4 slot="body">Public Record</h4>
      <p slot="body">Information you provide through uReport is stored and retained by the City as a public record.</p>

      <button
        slot="footer"
        @click="commitSeenModal"
        tabindex="0"
        autofocus>I Understand</button>
    </template>
  </modal>
</template>

<script>
import modal     from '~/components/modal.vue'
import { 
  mapFields }    from 'vuex-map-fields'

export default {
  components: { modal },
  head () {
    return {
      bodyAttrs: {
        class: !this.seenEmerModal ? 'showing-modal' : ''
      }
    }
  },
  methods: {
    commitSeenModal() {
      this.$store.commit('seenModal', true);
    }
  },
  computed: {
    ...mapFields([
      'seen_modal'
    ]),
  }
}
</script>