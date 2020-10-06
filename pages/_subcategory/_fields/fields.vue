<template>
  <div>
    <header class="info-process">
      <headerNav
        :nav-sub-group="navSubGroup"
        :step-active="stepActive" />
    </header>

    <main class="questions" ref="mainElm">
      <fn1-alert v-if="reCaptchaError" variant="warning">
        <p><strong>Google reCaptcha error</strong>, please try submitting again.</p>
      </fn1-alert>


      <div class="location">
        <div class="field-group">
          <label for="location-search">
            <h2>Service request location: <span>{{ theLocation }}</span></h2>
          </label>

          <input ref="googleAutocomplete" placeholder="Search a location" type="text" v-model="placeAddress" :class="['autocomplete-search', {'locating': findingUserPosition }]">

          <button
            :class="['find-me', {'locating': findingUserPosition }]"
            @click="getCurrentPosition">
            <span v-if="findingUserPosition">Locating ...</span>
            <span v-else>Find me</span>
          </button>
        </div>

        <GmapMap
          v-if="mapLoaded"
          ref="gmap"
          :center="mapCenter()"
          @center_changed="updateCenter"
          @dragend="mapDragEnd"
          :zoom="zoom"
          map-type-id="hybrid"
          :options="{
            zoomControl:        true,
            mapTypeControl:     true,
            scaleControl:       false,
            streetViewControl:  false,
            rotateControl:      false,
            fullscreenControl:  false,
            disableDefaultUi:   true,
            draggable:          true,
            styles: [
              {
                featureType:    'poi',
                stylers: [
                  {
                    visibility: 'off'
                  }
                ]
              },
              {
                featureType:    'poi.medical',
                stylers: [
                  {
                    visibility: 'off'
                  }
                ]
              },
              {
                featureType:    'poi.government',
                stylers: [
                  {
                    visibility: 'off'
                  }
                ]
              }
            ]
          }">
          <div class="pin"></div>

          <GmapPolygon
            v-if="cityBoundary"
            :paths="cityBoundary"
            :options="{
              strokeColor:    'rgb(30, 90, 174)',
              strokeOpacity:  0.8,
              strokeWeight:   2,
              fillColor:      'rgb(30, 90, 174)',
              fillOpacity:    0.15
            }"
          />
        </GmapMap>
      </div>
      
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
              @click.prevent="$refs.fileInput.click()" 
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

        <div v-if="pre_service_attrs.length" class="specifics">
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
        <client-only>
        <recaptcha
          @error="onError"
          @success="onSuccess"
          @expired="onExpired"
        />

        <button
          class="button next-button"
          @click="submitPost()">Submit</button>
        </client-only>
      </footer>
    </main>
  </div>
</template>

<style lang="scss" scoped>
  main {
    .alert {
      margin: 0 0 15px 0;
      padding: 10px 15px;
    }

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
            top: 8px;
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

    .location {
      margin: 0 auto 20px auto;
      padding: 0 0 20px 0;
      border-bottom: 1px solid rgba(225, 225, 225, 0.45);
      // height: calc(100vh - 210px);
      
      $duration: 1.4s;

      @keyframes spin {
        0%   { transform: rotate(0deg);   }
        50%  { transform: rotate(135deg); }
        100% { transform: rotate(450deg); }
      } 

      form {
        margin: 0 0 20px 0;
      }

      label {
        color: white;
        font-weight: 600;
        font-size: 16px;
        margin: 0 0 5px 0;
      }

      .next-button {
        margin: 20px 0 0 0;
      }

      .vue-map-container {
        width: 100%;
        height: 350px;
        margin: 20px 0 0 0;
      }

      .autocomplete-search {
        // margin: 0 0 20px 0;
        padding: 5px 8px 5px 95px;
        height: 28px;

        &.locating {
          padding-left: 110px;
        }
      }

      .field-group {
        position: relative;

        input {
          box-shadow: none;
        }
      }

      button {
        position: relative;

        &.find-me {
          height: 28px !important;
          margin: 0 0 0 auto;
          background: $color-green;
          // background: $color-orange-dark;
          // color: darken($color-orange-darker, 35%);
          padding: 5px 8px 5px 28px;
          font-size: 14px;
          line-height: 14px;
          position: absolute;
          left: 0;
          bottom: 0;
          -webkit-border-radius: 3px;
          -webkit-border-top-right-radius: 0 !important;
          -webkit-border-bottom-right-radius: 0 !important;
          -moz-border-radius: 3px;
          -moz-border-radius-topright: 0 !important;
          -moz-border-radius-bottomright: 0 !important;
          border-radius: 3px;
          border-top-right-radius: 0 !important;
          border-bottom-right-radius: 0 !important;

          &:focus {
            outline: none;
          }

          &:before {
            position: absolute;
            content: '';
            top: 5px;
            left: 5px;
            background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20.619 20.619'%3E%3Ctitle%3Elocation-icon%3C/title%3E%3Cg id='Layer_2' data-name='Layer 2'%3E%3Cg id='Layer_1-2' data-name='Layer 1'%3E%3Cg id='location-icon'%3E%3Ccircle cx='10.309' cy='10.309' r='8.149' fill='none' stroke='%23fff' stroke-miterlimit='10'/%3E%3Ccircle cx='10.309' cy='10.309' r='3.963' fill='%23fff'/%3E%3Cline x1='10.309' y1='18.459' x2='10.309' y2='20.619' fill='none' stroke='%23fff' stroke-miterlimit='10'/%3E%3Cline x1='10.309' x2='10.309' y2='2.16' fill='none' stroke='%23fff' stroke-miterlimit='10'/%3E%3Cline x1='2.16' y1='10.309' y2='10.309' fill='none' stroke='%23fff' stroke-miterlimit='10'/%3E%3Cline x1='20.619' y1='10.309' x2='18.459' y2='10.309' fill='none' stroke='%23fff' stroke-miterlimit='10'/%3E%3C/g%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
            background-size: contain;
            width: 18px;
            height: 18px;
          }

          svg {
            position: absolute;
            left: 4px;

            .pulse {
              stroke: white; 
              stroke-width: 2px;
              stroke-opacity: 1;
              fill: white;
              fill-opacity: 0;
              transform-origin: 50% 50%;
              animation-duration: 2s;
              animation-name: pulse;
              animation-iteration-count: infinite;
            }

            @keyframes pulse {
              from {
                stroke-width: 3px;
                stroke-opacity: 1;
                transform: scale(0.3);
              }
              to {
                stroke-width: 0;
                stroke-opacity: 0.2;
                transform: scale(2.2);
              }
            }
          }

          &.locating {
            &:before {
              animation: spin $duration linear infinite;
            }
          }
        }

        &.locate {
          z-index: 1000;
          position: absolute;
          bottom: 5px;
          left: 0;
          width: 20px;
          height: 20px;
          background: red;
          display: block;

          span {
            @include visuallyHidden();
          }

          &:before {
            position: absolute;
            content: '';
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20.619 20.619'%3E%3Ctitle%3Elocation-icon%3C/title%3E%3Cg id='Layer_2' data-name='Layer 2'%3E%3Cg id='Layer_1-2' data-name='Layer 1'%3E%3Cg id='location-icon'%3E%3Ccircle cx='10.309' cy='10.309' r='8.149' fill='none' stroke='%23fff' stroke-miterlimit='10'/%3E%3Ccircle cx='10.309' cy='10.309' r='3.963' fill='%23fff'/%3E%3Cline x1='10.309' y1='18.459' x2='10.309' y2='20.619' fill='none' stroke='%23fff' stroke-miterlimit='10'/%3E%3Cline x1='10.309' x2='10.309' y2='2.16' fill='none' stroke='%23fff' stroke-miterlimit='10'/%3E%3Cline x1='2.16' y1='10.309' y2='10.309' fill='none' stroke='%23fff' stroke-miterlimit='10'/%3E%3Cline x1='20.619' y1='10.309' x2='18.459' y2='10.309' fill='none' stroke='%23fff' stroke-miterlimit='10'/%3E%3C/g%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
            background-size: contain;
            width: 20px;
            height: 20px;
          }
        }
      }

      ::v-deep .vue-map-hidden {
        pointer-events: none;
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100%;

        .pin {
          display: block;
          width: 42px;
          height: 55px;
          background-size: contain;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' viewBox='0 0 67 88'%3E%3Ctitle%3Emap-pin-two%3C/title%3E%3Cg style='isolation: isolate'%3E%3Cg id='Layer_2' data-name='Layer 2'%3E%3Cg id='Layer_1-2' data-name='Layer 1'%3E%3Cg%3E%3Cimage width='67' height='88' opacity='0.42' xlink:href='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEMAAABYCAYAAACu20orAAAACXBIWXMAAAsSAAALEgHS3X78AAAUsklEQVR4Xu1cXU4by7b+1qrqbhtjCCHsG6GjKPvZj2cCTIL5+ExjTyGTyAzOk1/2U3SEfLaSDcYYt93dVWvdh6pqtwkQSIDkSveTWvwktNtffeu3VplUFf+PAPut//CcICK67ff6k1aIXuJ1u296PB5vETCZTLZ+Ho1GWw80Ho/bn5+bpGcjIxEwHo8pveHRaETT6ZRmsxmNRiOcn5/fqozDw0OdTCY4ODjQ4+NjnUwmmkhK5DwHMU9qJl0CTk9P6cuXLzSdTunt27dsreXpdErWWh4Oh3R+fk5VVdHOzs4WIWVZ6vn5uQ6HQ7XW6nQ6lcFgIABkOp3qycmJnpycSBLbU5LyJMq4qYKDgwMuioKttVxVlTHGsLXWOucMMzMRtZf3fosMY4yqqqTLWuvLsvTWWl8Uhd/d3fWTyURGo5FMJhP98OGDInDyw2/kh8kgIuqSUNe18d6bV69eGWutNcZY732mqpmIZMxsRcSoqgHAxhgSEQIAZlbvvQIQIvLM7ImoYeamqqqGiBrnnKuqyu3v77uzszP/lKR8t5kkNZyenvJ0OuW3b99yURTWGGOdc1lVVbmq5k3TFAAKZs6ZuQCQEVHGzBYAe++ZmQkAvPdqjBEAoqoOQOO9rwHUzLwGUOV5XhFRDaD+/fffm/l87gD48XgsCCQC+D7z+S4yumoAYBDuY1U1r+u6cM71sizrAegTUR9AX0R6zNxT1QJArqoWgCEiA4DifVVVPQAPwAGoAVQAVsaYlaquvPclM69Uda2qawD1cDhs5vO5Ozs786enp340GikRPZqQR5tJIgIAn5+fm6Io7HK5zIui6Flre977HQADIhqo6q73fsDMO0S0A6Cvqj0iygFkqprMJfkNJSJPRF5EGiKqVXVNRKWIlER0TUTXqrpU1WWWZUsAK+fcmogqa21TVZU7PDz0AGQ8Hj/KbB5FRpeIT58+WWbOrLWFtbafZdmOtXbXez9U1T0AewD2iGgXwC4R7ajqDoCCiHJVzRBUxaraKgOAAPBE1KhqSwaAa1W9VtUFgCsAV8aYhaouRGRpjCnrul6ralWWpXv//r3DIwl5MBmJiOl0auq6NsPhMG+aptfr9XZEZBfhzb8iolfM/EpEXjHznogMEckA0AdQAMgQzMoQ0RYZqipE1JqJqlZEVKrqkoiuAVyp6lxV58aYSxGZi8jcWrtg5uu6rst+v7/+/Plz81hCHkRGl4jBYGCdcxkz95l5QERDVX3lvX9NRK9V9ZCIDhCI2QewC2CADRG5qmYUfAVTYKBLhmLjQB2AiojWAEoASwALVZ0DuCSiGYALIpqJyExE5qp61ev1llVVrReLRf0YQr7pQLumUde1KYoiY+a+iOyKyB4RvQZwSERvALxh5jeqegDgFYAhbhABwBKRBcAAOIVVAFDV1lSIyKtqay4dQvaIaBjvvauqO0TUA5DHMM7eeyqKAgDw6dMnvH//3o3HY6FvONV7yegS8enTJzscDvNEhDFmPyrhSFWPiOg3AEeqeoigij0E80gRJCMiq8FhJqeZri40XkJEkghBIDQ55x0RGcSfeyJSEFEmIoaIyDmH9XoNVQUz6/n5uf7111/pvnfim8qYTCb09u1bs7OzYwEUWZbtVFW1l4gA8D/x+g3AEQUT2UMwj76q5gg+wsSHZXRIIPqqctXOVyEiQVBUAaAHoKchIm2ZHQBjjGHvPYwxCkCMMSIiUhSFANDT01NEgm8l5U4ykiomk4kpisKuVqsiz/Odqqr2jDEHAN4A+B8iegvgLREdichr2viJpAhLHf+AbTXcWqhhQwjH71WDs7UIxGYIoTkjoqQ4VlUiIhURsdZ6773f3d311lp/cHCgAHQ8Ht+Zg9ynDALA//jHP4xzLsvzvCciu8y8r6qHqvobOqrQ4DgTEX1s/INR1dZRdoRwFxHp3xTRwVPwIwwg5SWGiNKVlIb4Nx6A8943zOzqunYi4gBIXdfy8ePH9H++wq1kEBGdnp7SZDLh4XBoh8NhISI7qjq01h6o6hsiOoqEHAE4xMZh9lU1JyIbH7R92C4TD0D6m+7PFO/BCERxh2hQMClHRA3FlN0YU3vvm6IonLXWHx0dyV3O9C5l0Gg0ovl8bgBkzNzz3g9UdV9VD6Iy3gB4QyGa3FREhg0J6Q38CCiqoyUi/T5+1UQEgEZVawBrAGtVXTNz1TRNrSFc+48fPwpuUcdXZHRV8fvvv1tVzUWkT0RDItpX1ddEdBjN4kBV94lol4j6qppyiLRiwP3m8Bh0QzDduHfKXJ2qNghErIiopJDKr4honWVZfXR01CAWdjfVcasykiqapsmYufDe78RM8hURHVBMqtCJGjG82WcioguikJyl17AIakyJWpuTaEjfr1X1mpmXTdOs8jyvBoOBi0Xm3WZC1EYQPjo6MlmWZbHaHFBIdPYRSNhn5qGqDijkETkFT2/0eYlIINo2mwxBGX0KtdBaVa8BLJj5SlWviGhhrV0659Zv3rxp8jz3sYV4tzImkwkNBgPO89wycw6g55wbxDe/B2BPVW9mlimjvCnf50R6jRR+M4Rn6SM82xBBuUNV3dVQJPZUtayqyhwfH7dOPZnKV2TEpi0bY2xd1zmAvjFmByGb3EVIgRMRbfhEx2HevOczokuIQYcQii0EhOceiMgOERVFUWRlWZpPnz7xcrncMhXu3jkWY2St5dVqZY0xuTGmF1kdYFMLtNWnbvcjfhYIIam7SUibvjNzD0AhItnOzo7J85xHo9HWc7dkJH0XRcHGGDbGWFXNNGSR/UhIn0LU6BZd3VziZ5BCnYsR1J4BKDSk7Sl978XWo3XOmdStH3f2cbaUMZlMaLFYkHPO5Hluos8oiKjXuQoKnaq28sSvgUQGI/RKMiLKRaRAICZX1axpGktEvF6vaTab3a4MAPjy5QsdHBwQM3Nd11ZDAZRu1ks3RSDiZtH1M1SRQJ2vjPBsFkG5GTNn8fu2oTQYDGg0Gm3dpCVDVXFycoJY+RlmTmRk2LTqUu/SIrTrutngz8ZNQlhDj9WKiEVsMSL4Fq6qitKOXnIRLRn/+te/aDqdUlmWxMwsIsZ73yUksZv6lm277hcCqWrqnHHHn3FShDGGvPftTl53r3fLTP75z39id3eX8jyn+IeGmU28kUGsGinshiVCgV9HHTdBXYhIu2F1G7bI+O9//0sA4JwjYwxx2NxhACwibdT4BRXRgpnB/H0+/Zudrv9rEBEA6Jb+D8YWGdPpVJ1z2NvbS1XgV5eGVr58fatfEqqqqVOmcVM7/uprfKWnXq+nGnfAvfde454nETlVdRT2NBI53X7lrwAlIqXYYVfVdhEpdNsl7udqWZYKbA/HtGSMx2M9Pj5W55yIiDRN4+Obbyh0p2sADUIDJRGyVfX9ZHQXpiWAiBwzd59ZVFWKotDDw0MFNpvUW8r4+PEjBoOBiojkee6YucZmE6dCh5AO63fK7gVxk4ikaEdEjYikZ3ZJIcvlUieTydZNtnzG0dGRzmYzffXqlRcRFxVRadzx7pDSEJGLL5xkCfzcENsqQsNOftqerCn2QxGe26uq9Ho9tdZurWI3A9XRaKTv37+XPM+9996JSE1ElYisAazilRSSpPfTTSUqM/kJ31nEdiFFpIrvp7HWeuecHB8fa5oRA25xoNPpVEVEnHPOWlt3iCjj1RKim1mKn2kqSZlJGVtzHRT7oES0NsbUqurKsvR1XctkMrldGUBwon/++ad676Xf7zsRST6jBLBU1TJe6yi/Btum8uKMdFWBsDANOkSoaiki7SImZQyHQx3dGLP8ShlHR0fqnBPnnFuv1433fg1gpZuRgOvENDbO1GvAzds9N75SRfQP7UwH4vMikFMZY5qiKHxVVQJsS3qLjOQ3qqqSoig8gIaZ1/HNX6vqIhGCYDJrRKdERPKT1LGlirhI7eLF512q6oridI/3Xv78888tfwHcooxkKru7u55CjlExc0lE18ycpmYWCLMSaw0bNk5Dovai6kgmoiHMp+ixTkSISKsMY8zae18vl0u/v7/vT05Ovsqib61oTk5OZDKZSFVVrmmamohWGuaoFgiTMwtEdXTM5aXV0ZoIhay49RUISljExVt670vn3NoY01RV5abTacti94ZfkaGqOh6PdTQayf7+viuKovber621y2gmV0Q0R1RHXIkXV4eqIr5WN4KsACyTikUkmckKQGWtbYqi8LPZTG6aCHCHMgBgMpno/v6+z7KsAVDFkcOFiFyp6hWiuRDREjERw8upI9UgQiH5S1uKaRBukZQhImWWZauiKOrFYuGrqpLRaHTrit1KhqqmsCOXl5e+aZraObdG8BNXRDTXMFd1FX+Xco+XUId2VJEyzdY8EBZoTkRX3vtrIiqrqqqWy2Xz22+/udscZ8KdyhiPxzqZTPT4+Ngxc2OtXTvn0izmnJkTGS+uDiISDqPUHtFpIqhiAeBKRK4QFu3aGFOqalVVlZtMJnKb40y4k4yuOpIj1RCeromoHT/Ey6ojEawSujgNYlKom/nQy6jchaouvffroijq/f19NxqN7p36u7c/dpc6omO6VR0Ukp5nUYd2sk3atBVWCJHtCsBlWiQNPqMEUGVZ1pydnfmb6fdN3EvGY9ShqtdxhWoK44rdrPQpCGmbNtgMpSQ/tkCcCyWiGTPPKUYRIqqapnGj0Ug+fPhwr1y/2Tm9TR0ac45IxGX8mhKxFWJWGu36SVqEGp0m0A6l1NjMYMwBXIpIUsZCVZd1Xa/n83lXFd+vDOB2dQBYMXMrTXTslEIdsAbQRLvWzvW9aENpVFwKpUts/ESrCmPMAiElr5Kv+JYqgAeQAWyrYzAY1Ih5B+IcNyIhCA+WkpytqvYbz3EfNKlCO70KhOz3mkICeKmqMxGZE9GVc67MsmxNRA9WBfDArQJVVSLS0WgkTdM4Iqp04zvmqjokol0N8xBbsxsaNp2IqO3dP7obRsEZew15RVseoKMKVb1k5rlz7toYUzrn6rIs3ZcvX+Tjx493DsJ28SBlROhkMtGzszM/n8+beJwh1SuXqjqjMNh+iTDsfleo/eZDddCaWCSiVQUzXyH6iWQeqrowxpTMXFlrmzzPby3I7sKDlAFs1DEej2U+n7v1ep1OCC2aptkxxgxUNU33DCgMtORElCHsiqcTDA9dAFVtB2K7mWYJ4FpErogonSy4dM5dIRRlawrh3c1mM/njjz/aVfgWHvpgCa06iKjJsmx9U67p4TR49NaZxpV9lDOlzf6H1xA9UvU8j6Yxi1/nxphFN9u8rwa5C48iQ1X1w4cP8uXLFynL0jnnaoRYfi3hrMdMVS8SIUS0ZS7Y7pfe95CJsNTgTeOMSyJKydWMmS8QHbfGULparer7KtP78CgyEk5OTiTPc2+tbZbLZSUiS4QHulTVGYALhAduo4uGI1YeIXu8l4gOWVvRQ8M4Y3voRkRmRHSpqoumaUqNofTw8NA/JJTexIN9RoKqKhHh9PRUiqJI/Y4VgKUx5orCWbQBYlSheDAm+Q6Ns97YLMRX0aVrHtH+U/dqDmAmIhcALowxs+QrYierOTs782dnZw82xS4eTQaw5Uz9fD5vnHOVMaYUkQUzp0Myt51YTMMuhDjaQJvhVuAW80AkAsEvpWNY58x8ISJzhP7Fqg54VCi9ie8yk4gtZ1pV1dp7vxSROTPPVPUiruCMQi6yRHCmt5lLCp/p+y3zQKw9AFyo6rmqXjjnLonoSkSWWZatATw6lN7EdykDaNUhJycnNBgMXJ7nlbW2BJCLSM8Y0xeRPkIC1keYzk1HL7bMRTcH9trtwdvMA4GMCwpRa05E1/1+f3VxcdG8e/fOTSaTR4XSm/gRZQDYOFMATZZlaxFZUkiJL1X1QlXPER0qwgqXiJs5CBvEbd2BoIp27+OGeZyr6rkx5gIh2Vo0TVMaY6p37941AB5Uf9yH71YGsO1MR6OR+89//tO8fv165b3POJx776lqn4iS/+ip6tYcaVJHvOXN5OpW8zDGXMUIVs1ms2Y2m/nj4+PuvMh34YfIALbrlnfv3jWr1YrX63VJRDkzF8aYnoTzKn1sDty1pxAQnKeJt3Maj20+0DzqpzCPhB8mI0IByHQ6TeZSqerSGJM759JJw/ZDAhDnzqPvIGwcaNoRu+4Q0ZqHiFyKyMJ7X+Z5/mTmkfAkZNxiLvU95tLHZnzZRjPJ4j0qxA0gInox80h4EjKAb5sLIiHM3JNwoCfXcCJBEZIyRXCaCwBzhJB8LiLPbh4JT0ZGxJ3mgnhIVzeT/jmCrxAEpShCU+iSiFIUaiPRc5pHwpOScZu55Hm+UtXMGJMzc6EhmqSzKoQQQYqojBLBT/zNzH93VPGs5pHwpGQA2+YiIo2IsLW2NMZkGqJIjs1ZFSA0bIr4pyWFIuyLqv6NUIzNvffXIrKq6/pZzCPhycmIUAA3kzHLzNZ7n45sM0K2uSaiIpJYIlS7n1X1nJlneZ5fVVVVOucqCVN7T24eCc9CRtdcADhrbd3v98uqqgwRWWOM8d4The3BZTQdRSj158lxxjpnmWXZuq7rJpL75OaR8CxkAJva5fT0FMaYpq5rNsaUTdOkQztKIe1eUDjLogiZ50JDc/eSQsN5tV6v69ls5gA8i3kkPBsZCXHPxQOoV6sVUTieAeecqGoFoM/MmaoqM9cSP2ioaZrrXq9XMnNljGkA+A8fPnxXaf5Q/HChdh9UNW3/y3Q69bPZrAGwqqrqWlUvY7T4oqqfjTGfAfztnJvVdX3lnFtWVbXe2dlpDg8P/c3JvOfAsyvjpv9Ivy6Kwltra46f6CYiqOu67WPs7e3VOzs7zXQ69cfHxw/6zJwfxbOTAWz7DwA6GAy0qipvjGnW67Xp9XoEAHmet9PJnz9/9nme++PjY/8SRAAvRAbwFSGuKAohIt80DfX7fQKA5XKps9lMlsuljEYjAR72KUpPhWf1GTehGrYajo+P/V9//eX+/e9/NwCaq6ur+urqqgbQfPr0qT0O8ZJEAC+ojITkQxByBTo5Odn69z/++EMB4MOHD3hJIgA87EPLnhNE24fJXpqALn46Gb8SXtRn/Or4X+4mflPKxYlfAAAAAElFTkSuQmCC' style='mix-blend-mode: multiply'/%3E%3Cg%3E%3Ccircle cx='33.88798' cy='29.98535' r='11.625' fill='%2390000b'/%3E%3Cpath d='M33.888,6.39329A23.929,23.929,0,0,0,9.85287,30.21368c0,13.15682,24.03511,45.29823,24.03511,45.29823S57.92309,43.3705,57.92309,30.21368A23.929,23.929,0,0,0,33.888,6.39329Zm-.07851,30.9444a7.35265,7.35265,0,1,1,7.42044-7.35154A7.385,7.385,0,0,1,33.80947,37.33769Z' fill='%23dd2a27'/%3E%3C/g%3E%3C/g%3E%3C/g%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
        }
        
        .cross {
          display: block;
          width: 40px;
          height: 40px;
          background-size: contain;
          background-image: url("data:image/svg+xml,%3C%3Fxml version='1.0' encoding='utf-8'%3F%3E%3Csvg version='1.1' id='Layer_1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' width='71px' height='71px' viewBox='0 0 71 71' enable-background='new 0 0 71 71' xml:space='preserve'%3E%3Cg%3E%3Cg%3E%3Cpath fill='black' d='M35.5,47.6c-6.7,0-12.1-5.4-12.1-12.1c0-6.7,5.4-12.1,12.1-12.1c6.7,0,12.1,5.4,12.1,12.1C47.6,42.2,42.2,47.6,35.5,47.6z M35.5,25.4c-5.6,0-10.1,4.5-10.1,10.1s4.5,10.1,10.1,10.1s10.1-4.5,10.1-10.1S41.1,25.4,35.5,25.4z'/%3E%3C/g%3E%3Cg%3E%3Cpath fill='black' d='M71,33.8h-5.8c-0.9-15-12.9-27.1-28-28V0h-3.4v5.8c-15,0.9-27.1,12.9-28,28H0v3.4h5.8c0.9,15,12.9,27.1,28,28V71h3.4v-5.8 c15-0.9,27.1-12.9,28-28H71V33.8z M35.5,61.8C21,61.8,9.2,50,9.2,35.5S21,9.2,35.5,9.2S61.8,21,61.8,35.5S50,61.8,35.5,61.8z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
        }

        #cross{
          position: absolute;
          width: 2px;
          height: 20px;
          background: #000;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          pointer-events: none;
        }

        #cross::before{
          content: "";
          position: absolute;
          width: 20px;
          height: 2px;
          background: #000;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }
      }

      @media only screen
      and (min-device-width : 320px)
      and (max-device-width : 480px) {
        margin-top: 10px;
        height: 355px;

        .vue-map-container {
          height: 210px;
          margin: 10px 0 0 0;
        }
      }

      @media (max-height: 800px) {
        .vue-map-container {
          height: 230px;
        }
      }
    }

    .specifics {
      margin: 20px 0 0 0;
      padding: 20px 0 0 0;
      border-top: 1px solid rgba(225, 225, 225, 0.45);
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

import { gmapApi }            from 'vue2-google-maps'

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
      stepActive:          4,

      mapLoaded: false,
      chromeGeoTutUrl:  'https://support.google.com/chrome/answer/142065?hl=en',
      firefoxGeoTutUrl: 'https://support.mozilla.org/en-US/kb/does-firefox-share-my-location-websites',
      safariGeoTutUrl:  'https://support.apple.com/en-us/HT204690',
      geoLocationPositionError: null,
      geoLocationPosition:      {
        lat:      null,
        lng:      null,
        accuracy: null,
        geoCoded: null,
      },

      reportedMapCenter:   null,
      zoom:                17,
      mapCenterCoords:     null,
      findingUserPosition: false,
      hasGeoNav:           false,
    }
  },
  created() {
    let stepData = {
      name: this.$route.name,
      path: this.$route.fullPath,
    }

    this.$store.dispatch('setProgressStepFour', stepData);
  },
  mounted() {
    // grecaptcha.execute()
    // this.updateReCaptcha();

    

    this.$gmapApiPromiseLazy()
    .then(() => {
      let hasLocationData = Object.entries(this.location_data).length != 0;

      if(hasLocationData) {
        this.mapLoaded = true;
        this.reportedMapCenter = {
          lat: this.location_data.lat,
          lng: this.location_data.lng,
        }
      }
      // else { this.getCurrentPosition(); }

      let options = {
        strictBounds: true,
        bounds: {
          north:  39.2,
          south:  39.1,
          east:  -86.5,
          west:  -86.6
        },
      };

      let googleAutocomplete = new google.maps.places.Autocomplete((this.$refs.googleAutocomplete), { options },  );

      let geocoder = new google.maps.Geocoder();

      google.maps.event.addListener(googleAutocomplete, 'place_changed', (event) => {
        let place = googleAutocomplete.getPlace();
        this.setPlace(place);
        this.mapCenter();
        // this.updateMapViaInput(place.geometry.location)
      });

      this.hasGeoNavigator();
    });

    if(!this.cityBoundary){
      this.getCityBoundaryGeoJson()
      .then((res) => this.setCityBoundary(res))
      .catch((e)  => {
        console.log(`City Boundary Failed 🛑`,
                    this.consoleLog.error
                    `\n\n ${e} \n\n`);
      });
    }
    
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
  updated() {
    this.hasGeoNavigator();
  },
  watch: {
    placeAddress: function(val, oldVal){
      console.log('val', val)
      console.log('old val', oldVal)

      if(!val) {
        this.mapLoaded = false;
        this.$store.dispatch('setLocationData', {});
      }
    }
  },
  methods: {
    onError (error) {
      console.log('reCaptcha Error happened:', error)
    },
    onSuccess (token) {
      console.log('reCaptcha Succeeded:', token)
    },
    onExpired () {
      console.log('reCaptcha Expired')
    },
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
    async submitPost() {
      try {
        const token = await this.$recaptcha.getResponse();
        console.log('ReCaptcha token:', token);

        this.$store.commit('storeDefaultImage', this.captures[0]);

        
        if(!token) {
          this.reCaptchaError = true;

          alert('reCaptcha invalid, please try again.');

          console.log(`%c .: CS :: reCaptcha invalid :.`,`background: red; color: white; padding: 2px 5px; border-radius: 2px;`);

        } else {
          let formData        = new FormData(),
              blob            = this.dataURItoBlob(this.default_image),
              captchaReponse  = token;

          formData.append("g_recaptcha_response", captchaReponse)
          formData.append("service_code",         parseInt(this.service_code, 10))
          formData.append("lat",                  Object.is(this.lat, undefined) ? '' : this.lat)
          formData.append("long",                 Object.is(this.lng, undefined) ? '' : this.lng)
          formData.append("address_string",       Object.is(this.placeAddress, undefined) ? '' : this.placeAddress)
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
          .then((res)  => {
            this.$store.dispatch('resetBaseState');

            this.$store.commit('storeResponseInfo', res);

            let resData = JSON.parse(res.data.body.body),
                ticketID = resData[0].service_request_id;

            console.log('Res', res);
            console.log('ResData', resData);
            console.log('Ticket ID', ticketID);
            
            

            this.$axios.get(`${process.env.CRM_API_URL}${process.env.SERVICES_API}`)
            .then((res)  => {
              this.$store.dispatch('setInitGroupData', res.data)
            })
            .catch((err) => {
              console.error('setInitGroupData Err', err)
            });

            this.getServiceRequestCRMHTML(ticketID)
            .then((res) => {
              this.$store.dispatch("setServiceTicketCRMHTML", res);
            })
            .catch((e) => console.log(e));
          })
          .catch((err) => { console.log(err) });
        }

      } catch (error) {
        console.log('Client Submit Error:', error);
        await this.$recaptcha.reset();
      }
    },

    getCurrentPosition() {
      
      this.geoLocatePromise()
      .then((position) => {
        console.log(position)

        if(position.coords) {
          
          let pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          
          this.reportedMapCenter = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          }

          this.findingUserPosition = false;

          this.geocodeLatLng(pos);
          
          this.mapLoaded = true;

          return position;
        } else {
          console.log(`%c .: Geolocation position N/A :.`,`background: red; color: white; padding: 2px 5px; border-radius: 2px;`);

          this.findingUserPosition = false;
          this.mapLoaded = true;

          this.location_data = {...this.default_location_data}

          this.reportedMapCenter = {
            lat: this.default_location_data.lat,
            lng: this.default_location_data.lng,
          }

          console.info('HERE')
        }
      })
      .catch((error) => {
        let errMsg = null;

        this.findingUserPosition = false;

        switch(error.code) {
          case error.PERMISSION_DENIED:
            errMsg = "User denied the request for Geolocation.";
            break;
          case error.POSITION_UNAVAILABLE:
            errMsg = "Location information is unavailable.";
            break;
          case error.TIMEOUT:
            errMsg = "The request to get user location timed out.";
            break;
          case error.UNKNOWN_ERROR:
            errMsg = "An unknown error occurred.";
            break;
        }
        console.log('getCurrentPosition() geoLocatePromise - ', error)
        console.log(`%c .: Geolocation Error -- ${errMsg}:.`,`background: red; color: white; padding: 2px 5px; border-radius: 2px;`);
        
        this.findingUserPosition = false;
        this.mapLoaded = true;

        this.location_data = {...this.default_location_data}

        this.reportedMapCenter = {
          lat: this.default_location_data.lat,
          lng: this.default_location_data.lng,
        }

        console.info('HERE')
      })
    },
    hasGeoNavigator() {
      navigator.permissions &&
      navigator.permissions.query({name: 'geolocation'})
      .then((res) => {
        if(res.state == 'granted' || res.state == 'prompt'){
          this.hasGeoNav = true;
        }
      });
    },
    updateCenter(latLng) {
      if(latLng) {
        this.mapCenterCoords = {
          lat: latLng.lat(),
          lng: latLng.lng(),
        }
        console.log('updateCenter() - ', this.mapCenterCoords)
      }
    },
    geocodeLatLng(coords){
      const geocoder = new google.maps.Geocoder();
      
      if(coords) {
        geocoder.geocode({ 'location': coords }, (results, status) => {
          this.geoLocationPosition.geoCoded = results;

          

          geocoder.geocode({ placeId: results[0].place_id }, (res, stat) => {
            if (stat === "OK") {
              if (res[0]) {
                console.log('HIIIIII', res[0])

                let locationData = {
                  address:      results[0].address_components[0].short_name + ' ' + results[0].address_components[1].short_name,
                  placeAddress: results[0].formatted_address,
                  lat:          results[0].geometry.location.lat(),
                  lng:          results[0].geometry.location.lng()
                }

                this.$store.dispatch('setLocationData', locationData);

              } else {
                alert("No results found");
              }
            } else {
              alert("Geocoder failed due to: " + stat);
            }
          });

          

          console.log('geocodeLatLng() - ', results, status);
        });
      } else {
        console.log('Sorry cant run geocodeLatLng(coords) w/ out `coords = { lat:xxx, lng:xxx }`')
      }
    },
    mapDragEnd() {
      if(this.mapCenterCoords) {
        this.geocodeLatLng(this.mapCenterCoords);

        this.reportedMapCenter = {
          lat: this.mapCenterCoords.lat,
          lng: this.mapCenterCoords.lng,
        }
      }
    },
    mapCenter(){
      if(this.reportedMapCenter != null)
        return this.reportedMapCenter
        
      return this.cityHallLatLong
    },
    setPlace(place){
      console.log('setPlace() - ', place)

      let locationData = {
        address:      place.name,
        placeAddress: place.formatted_address,
        lat:          place.geometry.location.lat(),
        lng:          place.geometry.location.lng(),
      }

      this.$store.dispatch('setLocationData', locationData);

      this.zoom = 19;

      this.reportedMapCenter = {
          lat:          place.geometry.location.lat(),
          lng:          place.geometry.location.lng()
      }

      this.mapCenterCoords = {
          lat:          place.geometry.location.lat(),
          lng:          place.geometry.location.lng()
        }

      this.mapLoaded = true;
    },
    geoLocatePromise() {
      return new Promise((resolve, reject) => {
        if (navigator.geolocation) {
          this.findingUserPosition = true;
          this.hasGeoNav = true;
          navigator.geolocation.getCurrentPosition(resolve, reject)
        }
      })
    },
  },
  computed: {
    google: gmapApi,
    ...mapMultiRowFields(['serviceInfos.pre_service_attrs']),
    ...mapFields([
      'fromServiceCode',
      'subGroup',
      'initGroupData',
      'serviceInfos.service_group.service_code',
      'serviceInfos.service_group.service_name',
      'serviceInfos.service_attrs',
      'serviceInfos.location_data',
      'serviceInfos.default_location_data',
      'serviceInfos.location_data.lat',
      'serviceInfos.location_data.lng',
      'serviceInfos.location_data.placeAddress',
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
    theLocation() {
      if(this.address) {
        return this.address
      }
    },
  }
}
</script>