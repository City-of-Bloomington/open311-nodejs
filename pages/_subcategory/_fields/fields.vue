<template>
  <div>
    <header class="info-process">
      <headerNav
        :nav-sub-group="navSubGroup"
        :step-active="stepActive" />
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
            <div v-for="value, i in item.values"
                 :class="{'no-break': (value.name == 'no') || (value.name == 'yes')}">

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
        <button
          class="g-recaptcha button next-button"
          :data-sitekey="reCaptchaSiteKey"
          data-size="invisible"
          @click="submitPost()">Submit</button>
      </footer>
    </main>
  </div>
</template>

<style lang="scss" scoped>
  main {
    &.fields {
      height: calc(100vh - 244px);

      @media only screen
      and (min-device-width : 320px)
      and (max-device-width : 480px) {
        margin-top: 5px;
        height: 355px;
      }
    }

    h2 {
      color: white;
      font-size: 20px;
      line-height: 22px;
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
import headerNav              from '~/components/nav.vue'
import modal                  from '~/components/modal.vue'
import { mapFields,
         mapMultiRowFields }  from 'vuex-map-fields'

export default {
  beforeRouteEnter (to, from, next) {

    if(from.path == '/')
      next('/');
    next();

    next(vm => {
      let routeEqualsStoreCode = vm.service_code == to.params.fields,
          emptyServiceAttrs    = !vm.pre_service_attrs.length,
          runGetServiceAttrs   = from.path == '/' && emptyServiceAttrs;
      
      let serviceObj = vm.initGroupData.filter((e, i ) => {
        if(e.service_code == to.params.fields)
          return e
      });
      
      if(!routeEqualsStoreCode) {
        vm.$router.push({
          name:  'subcategory-fields',
          params: {
            subcategory: vm.stringToDashed(serviceObj[0].group),
            fields: to.params.fields
          }
        });
      }

      if(runGetServiceAttrs || !routeEqualsStoreCode) {
        vm.$store.dispatch('setGroupName',    serviceObj[0].group);
        vm.$store.dispatch('setSubGroupName', serviceObj[0].service_name);
        vm.$store.dispatch('setGroupCode',    to.params.fields);
        vm.$store.dispatch('setRouteCode',    to.params.fields);

        let routeID = to.params.fields;
        
        vm.getServiceAttrs(routeID)
        .then((res) => {
          let data = res.attributes.map((e, i) => {
            let dataReady = {...e, answer_value: ''}
            return dataReady
          });

          vm.$store.dispatch('setPreServiceAttrs', data);
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
      ],
      script: [
        { src: 'https://www.google.com/recaptcha/api.js', async: true, defer: true }
      ]
    }
  },
  props: ['item'],
  components: {
    headerNav,
    modal
  },
  data() {
    return {
      reCaptchaError:     false,
      reCaptchaSiteKey:   process.env.reCaptchaSiteKey,

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
      stepActive:          5,
    }
  },
  created() {
    let stepData = {
      name: this.$route.name,
      path: this.$route.fullPath,
    }

    this.$store.dispatch('setProgressStepFive', stepData);
  },
  mounted() {
    setTimeout(() => { grecaptcha.execute() }, 100);

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
    dataURItoBlob(dataURI) {
      if(dataURI) {
        // convert base64/URLEncoded data component to raw binary data held in a string
        var byteString;
        if (dataURI.split(',')[0].indexOf('base64') >= 0)
          byteString = atob(dataURI.split(',')[1]);
        else
          byteString = unescape(dataURI.split(',')[1]);
        // separate out the mime component
        var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
        // write the bytes of the string to a typed array
        var ia = new Uint8Array(byteString.length);
        for (var i = 0; i < byteString.length; i++) {
          ia[i] = byteString.charCodeAt(i);
        }
        return new Blob([ia], {type:mimeString});
      }
    },
    submitPost() {
      this.$store.commit('storeDefaultImage', this.captures[0]);

      if(!grecaptcha.getResponse()) {
        this.reCaptchaError = true;
        console.log(`%c .: CS :: reCaptcha invalid :.`,`background: red; color: white; padding: 2px 5px; border-radius: 2px;`);
      } else {
        let formData        = new FormData(),
            blob            = this.dataURItoBlob(this.default_image),
            captchaReponse  = grecaptcha.getResponse();

        formData.append("g_recaptcha_response", captchaReponse)
        formData.append("service_code",         parseInt(this.service_code, 10))
        formData.append("lat",                  this.lat)
        formData.append("long",                 this.lng)
        formData.append("address_string",       this.address)
        formData.append("email",                this.email)
        formData.append("first_name",           this.first_name)
        formData.append("last_name",            this.last_name)
        formData.append("phone",                this.phone)
        formData.append("description",          this.default_description)

        if(blob != undefined)
          formData.append("media",              blob)

        Object.values(this.pre_service_attrs).map((key) => {
          return formData.append(`attribute[${key.code}]`, `${key.answer_value}`)
        }).join('&');

        let config = {
          onUploadProgress: (progressEvent) => {
            this.percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            console.log(`Percent Completed: ${this.percentCompleted}`);
          }
        }

        for (var pair of formData.entries()) {
          console.log(pair[0]+ ', ' + pair[1]);
        }

        let processingHTML = `
          <div>
            <p>Processing your service request.</p>
          </div>
        `;

        this.$refs.mainElm.innerHTML = processingHTML;

        this.formSubmitHandOff(formData, config)
        .then(res  => { console.log(res) })
        .catch(err => { console.log(err) });
      }
    }
  },
  computed: {
    ...mapMultiRowFields(['serviceInfos.pre_service_attrs']),
    ...mapFields([
      'fromServiceCode',
      'subGroup',
      'initGroupData',
      'serviceInfos.service_group.service_code',
      'serviceInfos.service_group.service_name',
      'serviceInfos.service_attrs',
      'serviceInfos.location_data.lat',
      'serviceInfos.location_data.lng',
      'serviceInfos.location_data.address',
      'serviceInfos.personal_info.email',
      'serviceInfos.personal_info.first_name',
      'serviceInfos.personal_info.last_name',
      'serviceInfos.personal_info.phone',
      'serviceInfos.default_description',
      'serviceInfos.default_image',
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