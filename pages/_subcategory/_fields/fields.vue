<template>
  <div>
    <header class="info-process">
      <headerNav
        :nav-sub-group="navSubGroup"
        :step-active="stepActive" />
    </header>

    <main class="questions" ref="mainElm">
      <h2>General information:</h2>

      <form>
        <div class="form-group image-upload-wrapper">  
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
      </form>
      
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
    &.questions {
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

    .image-upload-wrapper {
      img {
        max-width: 100%;
      }

      input {
        &[type=file] {
          @include visuallyHidden;
        }
      }

      button {
        display: inline-flex;
        flex-direction: row;
        color: $biscay;
        background: gainsboro;
        margin: 0 20px 0 0;
        padding: 5px 10px;
        font-size: 14px;
        line-height: 14px;
        // font-weight: 600;
        letter-spacing: .5px;

        &:hover {
          background: darken(gainsboro, 5%);
        }

        &.image-input {
          position: relative;
          margin: 0 0 0 20px;
          padding: 0 10px 0 40px;

          &:before {
            position: absolute;
            content: '';
            left: 10px;
            top: 6px;
            width: 20px;
            height: 15px;
            background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 335.25 257.4373'%3E%3Ctitle%3EAsset 1%3C/title%3E%3Cg id='Layer_2' data-name='Layer 2'%3E%3Cg id='Layer_1-2' data-name='Layer 1'%3E%3Ccircle cx='167.625' cy='142.37726' r='67.71762' fill='none' stroke='%231a3464' stroke-miterlimit='10' stroke-width='15'/%3E%3Cpath d='M317.794,249.9373H17.456c-5.47578,0-9.956-3.81411-9.956-8.47579V55.34736c0-4.66169,4.48018-8.47579,9.956-8.47579H83.575a17.40057,17.40057,0,0,0,14.13532-6.72763L108.914,16.37682a14.40256,14.40256,0,0,1,5.20835-6.06182,18.57288,18.57288,0,0,1,9.9401-2.815h87.30608a18.59964,18.59964,0,0,1,9.80785,2.73165,14.4177,14.4177,0,0,1,5.22238,5.90892l10.23946,20.762a17.57146,17.57146,0,0,0,14.62648,9.94025q.52673.02862,1.059.02872H317.794c5.47578,0,9.956,3.8141,9.956,8.47579V241.46151C327.75,246.12319,323.26982,249.9373,317.794,249.9373Z' fill='none' stroke='%231a3464' stroke-miterlimit='10' stroke-width='15'/%3E%3Crect x='24.84969' y='19.88012' width='54.83301' height='7.5' fill='%231a3464'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E%0A");
            background-position: contain;
            background-repeat: no-repeat;
          }
        }

        &.take {
          span {
            @include visuallyHidden;
          }

          position: absolute;
          left: 50%;
          bottom: 80px;
          transform: translateX(-50%);
          width: 60px;
          height: 60px;
          background-color: transparent;
          background-repeat: no-repeat;
          background-size: cover;
          background-image: url("data:image/svg+xml,%3Csvg id='capture-picture-icon' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' width='40px' height='40px' viewBox='0 0 40 40' enable-background='new 0 0 40 40' xml:space='preserve'%3E%3Ccircle opacity='0.65' fill='%23FFFFFF' cx='20' cy='20' r='16.0050011'/%3E%3Cpath opacity='0.65' fill='%23FFFFFF' d='M20,40C8.9718189,40,0,31.0277157,0,20C0,8.9718189,8.9718189,0,20,0s20,8.9718189,20,20 C40,31.0277157,31.0281811,40,20,40z M20,1.9047619C10.0223217,1.9047619,1.9047619,10.0223217,1.9047619,20 S10.0223217,38.0952377,20,38.0952377S38.0952377,29.9776783,38.0952377,20S29.9776783,1.9047619,20,1.9047619z'/%3E%3C/svg%3E");

          &:hover {
            background-image: url("data:image/svg+xml,%3Csvg id='capture-picture-icon' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' width='40px' height='40px' viewBox='0 0 40 40' enable-background='new 0 0 40 40' xml:space='preserve'%3E%3Ccircle opacity='0.85' fill='%23FFFFFF' cx='20' cy='20' r='16.0050011'/%3E%3Cpath opacity='0.85' fill='%23FFFFFF' d='M20,40C8.9718189,40,0,31.0277157,0,20C0,8.9718189,8.9718189,0,20,0s20,8.9718189,20,20 C40,31.0277157,31.0281811,40,20,40z M20,1.9047619C10.0223217,1.9047619,1.9047619,10.0223217,1.9047619,20 S10.0223217,38.0952377,20,38.0952377S38.0952377,29.9776783,38.0952377,20S29.9776783,1.9047619,20,1.9047619z'/%3E%3C/svg%3E");
          }
        }

        &.close {
          position: absolute;
          left: 50%;
          bottom: 40px;
          transform: translateX(-50%);
          color: white;
          letter-spacing: 1px;
          background: rgba(0,0,0,0.55);
        }
      }

      ul {
        display: block;
        margin: 10px 0;
        padding: 10px;
        border-radius: 4px;
        background-color: rgba(225,225,225,0.1);

        li {
          display: inline-block;
          margin: 0;

          img {
            cursor: pointer;
            margin: 0 0 5px 0;
            // transform: scaleX(-1);
            // width: 100px;
            // height: 75px;
          }

          button {
            text-align: center;
            margin: 0 auto !important;
            display: block;
            width: 100%;
          }
        }
      }
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
      reCaptchaSiteKey:   process.env.RECAPTCHA_SITEKEY,

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