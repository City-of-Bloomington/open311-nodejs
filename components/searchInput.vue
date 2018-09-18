<template>
  <div class="search homepage-search">

    <div class="form-group">
      <label>Search</label>
      <input type="text"
             v-model="input"
             @keydown.tab.prevent="complete()"
             @blur="blur(false)"
             placeholder="Search"/>
      <button type="button" class="clear" @click="clearSearch" v-if="showClearBtn">
        <span>Clear Search</span>
      </button>

      <div class="auto-suggest" v-if="focused">
        <ul>
          <li v-for="(group, i) in data"
            :key="group.service_code"
            v-if="filter(group)"
            @mousedown="complete(i)">
            <span v-html="group.group"></span>
            <ul>
              <li v-html="group.service_name"></li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      input: '',
      focused: false,
      showClearBtn: false
    }
  },
  props: {
    groups: { type: Array, required: false},
    data:   { type: Array, required: true},
    value:  { type: String, required: false},
    field:  { type: String, required: false}
  },
  created() {
    this.input = this.value || ''
  },
  methods: {
    complete(i) {
      this.select(this.data[i]);
      this.focused = false;
      this.$router.push({ path: 'info' })
    },
    select(row) {
      this.input = row[this.field];
      this.selected = true;
      this.$store.commit('storeSubGroupName', row);
    },
    filter(row) {
      return row[this.field].toLowerCase().indexOf(this.input.toLowerCase()) != -1
    },
    blur(val) {
      this.focused = val
      console.log('blur');
    },
    clearSearch() {
      console.log('clicked');
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
    console.log('emit updated')
    this.$emit('input', this.input)
  }
}
</script>