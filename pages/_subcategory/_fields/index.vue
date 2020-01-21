<template>
  <div>
    <header class="info-process">
      <headerNav
        :back-home="backHome"
        :nav-sub-group="navSubGroup"
        :step-active="stepActive"
        :step-complete="stepComplete" />
    </header>

    <main class="info-process fields" ref="mainElm">
      <h2>General information:</h2>

      <div class="form-group camera-wrapper">  
        <div style="display: flex;">
          <label for="media">Include Image:
          <input
            type="file"
            accept=".jpeg, .jpg, .png, .gif, .jp2, .jpx, .jpm, .tiff, .tiff-fx, .bmp, .x-bmp, .webp, .heif, .heic"
            @change="updateCanvasImage"
            ref="fileInput"
            name="media"></label>

          <button
            @click="$refs.fileInput.click()" 
            v-if="captures.length < 1"
            class="image-input">Include Photo</button>
        </div>

        <canvas
          v-show="false"
          id="imageCanvas"
          ref="imageCanvas"></canvas>

        <ul v-if="captures.length">
          <li v-for="c in captures" :key="c">
            <img :src="c" />
            <button
              type="button"
              class="button"
              @click="removeImage(c)">remove</button>
          </li>
        </ul>
      </div>

      <div class="form-group">
        <label for="default-description">Describe this issue:</label>
        <textarea
          v-model="default_description"
          id="default-description"
          name="default-description"
          wrap="hard">
        </textarea>
      </div>

      <div v-if="pre_service_attrs.length">
        <h2>{{ service_name }} information:</h2>
        <div class="form-group"
             v-for="item, i in pre_service_attrs"
             :key="item.code">

          <div v-if="item.datatype === 'string'">
            <label :for="item.key">{{ item.description }}</label>
            <input
              v-model="item.answer_value"
              type="text"
              :id="item.key"
              :name="item.name" />
          </div>

          <div v-else-if="item.datatype === 'number'">
            <label :for="item.key">{{ item.description }}</label>
            <input
              type="number"
              v-model="item.answer_value"
              :id="item.key"
              :name="item.name" />
          </div>

          <div v-else-if="item.datatype === 'datetime'">
            <label :for="item.key">{{ item.description }}</label>
            <input
              type="datetime-local"
              v-model="item.answer_value"
              :id="item.key"
              :name="item.name" />
          </div>

          <div v-else-if="item.datatype === 'text'">
            <label :for="item.code">{{ item.description }}</label>
            <textarea
              v-model="item.answer_value"
              :id="item.code"
              :name="item.name"
              wrap="hard"></textarea>
          </div>

          <div v-else-if="item.datatype === 'singlevaluelist'" class="singlevaluelist">
            <legend>{{ item.description }}:</legend>
            <div v-for="value, i in item.values">
              <label :for="`${item.code}-${value.name}`">
                <input
                  type="radio"
                  v-model="item.answer_value"
                  :id="`${item.code}-${value.name}`"
                  :value="value.key"
                  :name="item.code" />
                  {{ value.name }}</label>
            </div>
          </div>

          <div v-else-if="item.datatype === 'multivaluelist'">
            <label :for="item.description">{{ item.description }}</label>
            <select
              :id="item.description"
              v-model="item.answer_value">
              <option
                v-for="item in item.values"
                :value="item.key"
                :key="item.name">{{ item.name }}
              </option>
            </select>
          </div>
        </div>
      </div>

      <footer>
        <nuxt-link
          to="/location"
          class="button next-button"
          @click.native="storeFormInfo">Next
        </nuxt-link>
      </footer>

      <emerModal />
    </main>
  </div>
</template>

<style lang="scss">
  main {
    h2 {
      font-weight: 600;
      letter-spacing: .25px;
      margin: 0 0 5px 0;
    }

    .fields {
      h2 {
        border-bottom: 1px solid rgba(225,225,225,0.2);
        margin: 0 0 10px 0;
      }

      .form-group {
        margin: 0 0 40px 0 !important;
      }
    }

    .g-recaptcha {
      margin-bottom: 15px;
    }

    footer {
      button {
        margin-bottom: 15px;
      }
    }
  }
</style>

<script>
import axios                  from 'axios'
import emerModal              from '~/components/emerModal.vue'
import headerNav              from '~/components/nav.vue'
import modal                  from '~/components/modal.vue'
import { mapGetters,
         mapState }           from 'vuex'
import { mapFields,
         mapMultiRowFields }  from 'vuex-map-fields'

export default {
  beforeRouteEnter (to, from, next) {
    next(vm => {
      let routeEqualsStoreCode = vm.service_code == to.params.fields,
          emptyServiceAttrs    = !vm.pre_service_attrs.length,
          runGetServiceAttrs   = from.path == '/' && emptyServiceAttrs;

      if(runGetServiceAttrs || !routeEqualsStoreCode) {
        vm.$store.dispatch('setGroupCode', to.params.fields);
        vm.$store.dispatch('setRouteCode', to.params.fields);

        let routeID = to.params.fields;

        console.log('running getServiceAttrs from fields')
        vm.getServiceAttrs(routeID)
        .then((res) => {
          let data = res.attributes.map((e, i) => {
            let dataReady = {...e, answer_value: ''}
            return dataReady
          });

          vm.$store.dispatch('setPreServiceAttrs', data);
          console.log('dispatched setPreServiceAttrs')
        })
        .catch(err => { console.log(`get fields err - ${err}`); });
      }

      if(vm.default_image)
        vm.captures.push(vm.default_image);

      if(from.name !== 'subcategory')
        vm.backHome = true;
    });

    next();
  },
  head () {
    return {
      titleTemplate: `%s - ${this.service_name}`,
      meta: [
        { hid: 'description',
          name: 'description',
          content: `Submit a ${this.group} (${this.service_name}) uReport service request.` }
      ]
    }
  },
  props: ['item'],
  components: {
    emerModal,
    headerNav,
    modal
  },
  data() {
    return {
      backHome:            false,
      routeCode:           '',
      routeCodeData:       '',
      allData:             [],
      navSubGroup:         true,
      percentCompleted:    '',
      modalImage:          null,
      formElements:        {},
      defaultDescription:  '',
      showVideoElm:        false,
      mainElm:             '',
      imgContext:          null,
      imgCanvas:           null,
      selectedImage:       null,
      imgElement:          null,
      imgOrientation:      '',
      video:               {},
      canvas:              {},
      captures:            [],
      response:            {},
      singleImgMessage:    'Sorry, we only support a single image at the moment.',
      stepActive: {
        one:               false,
        two:               false,
        three:             true,
        four:              false,
        five:              false,
        six:               false
      },
      stepComplete: {
        one:               true,
        two:               true,
        three:             false,
        four:              false,
        five:              false,
        six:               false
      }
    }
  },
  mounted() {
    let noServiceCode = this.service_code == '';

    if(noServiceCode) {
      this.routeCode = this.$route.params.fields.substr(this.$route.params.fields.lastIndexOf('/') + 1);

      this.$store.dispatch('setGroupCode', this.routeCode);
      this.$store.dispatch('setRouteCode', this.routeCode);
      
      this.allDatas;
      this.routeDataGroup;
      this.routeDataSubGroup;
    }
  },
  methods: {
    removeImage(c){
      this.$store.dispatch('setDefaultImage', '');
      this.captures.splice(this.captures.indexOf(c), 1);
      this.$refs.fileInput.value = '';
    },
    updateCanvasImage(e) {
      let self    = this,
          files   = e.target.files,
          reader  = new FileReader();

      reader.onload = (e) => {
        let img = new Image();

        img.onload = () => {
          self.drawCanvasImage(img);
        }
        img.src = e.target.result;
      };
      reader.readAsDataURL(files[0]);
    },
    drawCanvasImage(img) {
      const EXIF = require('exif-js');

      let self   = this,
          canvas = self.$refs.imageCanvas;

      EXIF.getData(img, function() {
        self.imgOrientation = this.exifdata.Orientation;
      });

      let max_width  = 1000,
          max_height = 1000,
          width      = img.width,
          height     = img.height,
          ctx        = canvas.getContext("2d");

      if (4 < self.imgOrientation && 
          self.imgOrientation < 9) {
        if (width > height) {
          if (width > max_width) {
            img.height    *= max_width / img.width;
            img.width     = max_width;

            height        = img.height;
            width         = img.width;

            canvas.width  = img.height;
            canvas.height = img.width;
          }
        }
      } else {
        if (height > max_height) {
          img.height      *= max_height / img.width;
          img.width       = max_width;

          height          = img.height;
          width           = img.width;

          canvas.width    = img.height;
          canvas.height   = img.width;
        }

        canvas.width = width;
        canvas.height = height;
      }

      switch (self.imgOrientation) {
        case 2: ctx.transform(-1, 0,  0,  1, width,   0);      break;
        case 3: ctx.transform(-1, 0,  0, -1, width,   height); break;
        case 4: ctx.transform(1,  0,  0, -1, 0,       height); break;
        case 5: ctx.transform(0,  1,  1,  0, 0,       0);      break;
        case 6: ctx.transform(0,  1, -1,  0, height,  0);      break;
        case 7: ctx.transform(0, -1, -1,  0, height,  width);  break;
        case 8: ctx.transform(0, -1,  1,  0, 0,       width);  break;
        default: break;
      }

      ctx.drawImage(img, 0, 0, width, height);

      if(self.captures.length < 1) {
        self.captures.push(canvas.toDataURL('image/jpeg', 0.7));
        this.$store.commit('storeDefaultImage', this.captures[0]);
      } else { alert(self.singleImgMessage) }
    },
    storeFormInfo() {
      this.$store.commit('storeDefaultImage', this.captures[0]);
    },
  },
  computed: {
    ...mapMultiRowFields(['serviceInfos.pre_service_attrs']),
    ...mapFields([
      'fromServiceCode',
      'subGroup',
      'initGroupData',
      'serviceInfos.service_attrs',
      'serviceInfos.default_image',
      'serviceInfos.default_description',
      'serviceInfos.service_group.group',
      'serviceInfos.service_group.service_code',
      'serviceInfos.service_group.service_name',
    ]),
    allDatas() {
      const allRoutesubGroups = this.initGroupData.filter(
        g => g.service_code == this.routeCode
      );
      return allRoutesubGroups[0];
    },
    routeDataGroup() {
      this.$store.commit('storeGroupName', this.allDatas.group);
      return this.allDatas.group;
    },
    routeDataSubGroup() {
      this.$store.commit('storeSubGroupName', this.allDatas.service_name);
      return this.allDatas.service_name;
    },
  }
}
</script>