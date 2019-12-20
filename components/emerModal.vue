<template>
  <modal v-if="!seenSeenModal">
    <template v-if="!seenEmerModal">
      <h4 slot="header">Non-Emergency Use Only</h4>
      <p slot="body">This system is not for reporting emergencies or imminent safety hazards.</p>

      <p slot="body">If this is an emergency, please dial 911.</p>

      <button
        slot="footer"
        @click="emerModal"
        tabindex="0"
        autofocus>I Understand</button>
    </template>

    <template v-if="seenEmerModal && !seenPubRecordModal">
      <h4 slot="header">Public Information</h4>
      <p slot="body">The information you provide in a report is retained as public record.</p>

      <button
        slot="footer"
        @click="seenModal"
        tabindex="0"
        autofocus>I Understand</button>
    </template>
  </modal>
</template>

<script>
import modal from '~/components/modal.vue'

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
    emerModal() {
      this.$store.commit('seenNonEmerModal', true);
    },
    pubRecordModal() {
      this.$store.commit('seenpubRecordModal', true);
    },
    seenModal() {
      this.$store.commit('seenModal', true);
    }
  },
  computed: {
    seenEmerModal() {
      return this.$store.getters.seenNonEmerModal
    },
    seenPubRecordModal() {
      return this.$store.getters.seenPubRecordModal
    },
    seenSeenModal() {
      return this.$store.getters.seenModal
    }
  }
}
</script>