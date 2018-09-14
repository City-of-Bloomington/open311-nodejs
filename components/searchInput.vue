<template>
  <div class="search homepage-search">

    <div class="form-group">
      <label>Search</label>
      <input type="text"
             v-model="input"
             @keydown.tab.prevent="complete()"
             @focus="focus(true)"
             @blur="focus(false)"
             placeholder="Search"/>
      <button type="button" class="clear" @click="clearSearch" v-if="focused">
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
      focused: false
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

      // if (i == undefined) {
      //   for (let row of this.data) {
      //     if (this.filter(row)) {
      //       this.select(row)
      //       return
      //     }
      //   }
      // }
      this.select(this.data[i]);
      this.focused = false;
      this.$router.push({ path: 'info' })
    },
    select(row) {
      this.input = row[this.field];
      this.selected = true;

      // this.row.service_name;
      // this.row.group;
      // this.row.service_code;

      // this.$store.commit('storeGroupName', row.group)
      // this.$store.commit('storeGroupName', row.service_name)
      // this.$store.commit('storeGroupName', row.service_code)

      this.$store.commit('storeSubGroupName', row)

      // alert(JSON.stringify(row.service_name))

    },
    filter(row) {
      return row[this.field].toLowerCase().indexOf(this.input.toLowerCase()) != -1
    },
    focus(val) { this.focused = val },
    clearSearch() { this.input = '' }
  },
  updated() {
    this.$emit('input', this.input)
  }
}
</script>