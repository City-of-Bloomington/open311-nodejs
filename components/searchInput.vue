<template>
  <div
    class="search"
    v-on-clickaway="away">

    <fn1-input
      v-model="input"
      label="Search"
      placeholder="Seach"
      name="search"
      id="search" />

    <div
      v-if="focused"
      class="auto-suggest">
      <ul>
        <li
          v-for="(group, i) in data"
          :key="group.service_code"
          v-if="filter(group)"
          @keyup.enter="complete(i)"
          @click="complete(i)"
          tabindex="0"
          v-html="group.service_name">
        </li>
      </ul>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .search {
    // background: green;
    padding: 20px 0;

    ::v-deep label {
      @include visuallyHidden;
    }

    input {
      padding: 5px 10px;
      font-size: 18px;
    }

    .auto-suggest {
      background-color: cornflowerblue;
    }

    @media only screen
    and (min-device-width : 320px)
    and (max-device-width : 480px) {
      width: calc(100% - 40px);
      padding: 10px 0;
    }
  }
</style>

<script>
import { mixin as clickaway } from 'vue-clickaway';

export default {
  mixins: [ clickaway ],
  data() {
    return {
      input:        '',
      focused:      false,
      showClearBtn: false
    }
  },
  props: {
    groups: { type: Array,  required: false},
    data:   { type: Array,  required: true },
    value:  { type: String, required: false},
    field:  { type: String, required: false}
  },
  created() {
    this.input = this.value || ''
  },
  methods: {
    away() {
      this.focused = false;
      this.clearSearch();
    },
    complete(i) {
      this.select(this.data[i]);
      this.focused      = false;
      var selectedGroup = this.groupsAsCss(this.data[i].group);
      var selectedCode  = this.data[i].service_code;
      var selectedUrl   = `${selectedGroup}/${selectedCode}`
      this.$router.push({ path: selectedUrl })
    },
    groupsAsCss(group) {
      return group
      .replace(/\s+/g, '-')
      .replace(/,/g, '')
      .replace(/&/g, 'and')
      .toLowerCase();
    },
    select(row) {
      this.input    = row[this.field];
      this.selected = true;
      this.$store.commit('storeSubGroupName', row);
    },
    filter(row) {
      return row[this.field].toLowerCase().indexOf(this.input.toLowerCase()) != -1
    },
    clearSearch() {
      this.input = ''
    }
  },
  watch: {
    'input': function(val, oldVal){
      if(val.length >= 1) {
        this.focused = true
        this.showClearBtn = true
      } else {
        this.focused = false
        this.showClearBtn = false
      }
    }
  },
  updated() {
    this.$emit('input', this.input)
  }
}
</script>