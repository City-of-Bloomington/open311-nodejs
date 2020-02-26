<template>
  <div>
    <example-header
      :logo="{
        url:          `${baseUrl}`,
        image:        `${headerLogo}`,
        imageAlt:     `${cityName}`
      }"

      :logoHeadings="{
        topHeading:   `${logoHeading}`,
        subHeading:   `${logoSubHeading}`,
      }"

      :application="{
        name:         `${appName}`,
        url:          `${baseUrl}${frontendBase}`
      }"

      :navItems="[
        { name:       'Help',
          href:       'disclaimer' },
        { name:       'Feedback',
          href:       `miscellaneous/53`,
          target:     '_blank' }
      ]"

      :subNavItems="null">

      <fn1-button
        slot="dropdown"
        :title="`Add uReport to your desktop`"
        class="a2hs-button button">
        Add as App
      </fn1-button>
    </example-header>
  </div>
</template>

<script>
import exampleHeader  from '~/components/design-system/exampleHeader.vue'

export default {
  components: { exampleHeader },
  data() {
    return {
      appName:            process.env.appName,
      baseUrl:            process.env.cityWebsiteUrl,
      headerLogo:         'city-of-bloomington-logo.svg',
      logoHeading:        process.env.logoHeading,
      logoSubHeading:     process.env.logoSubHeading,
      frontendBase:       process.env.frontendBase,
    }
  }
}
</script>

<style lang="scss" scoped>
  button {
    &.a2hs-button {
      position: relative;
      background-color: $color-green;
      padding: 5px 30px 5px 10px;
      font-size: 16px;
      line-height: 16px;
      color: white;

      &:before {
        position: absolute;
        content: '';
        right: 8px;
        top: 5px;
        width: 16px;
        height: 16px;
        background-size: inherit;
        background-image: url("data:image/svg+xml,%3Csvg aria-hidden='true' focusable='false' data-prefix='fas' data-icon='external-link-square-alt' role='img' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 448 512' class='svg-inline--fa fa-external-link-square-alt fa-w-14 fa-3x'%3E%3Cpath fill='rgba(255,255,255,0.95)' d='M448 80v352c0 26.51-21.49 48-48 48H48c-26.51 0-48-21.49-48-48V80c0-26.51 21.49-48 48-48h352c26.51 0 48 21.49 48 48zm-88 16H248.029c-21.313 0-32.08 25.861-16.971 40.971l31.984 31.987L67.515 364.485c-4.686 4.686-4.686 12.284 0 16.971l31.029 31.029c4.687 4.686 12.285 4.686 16.971 0l195.526-195.526 31.988 31.991C358.058 263.977 384 253.425 384 231.979V120c0-13.255-10.745-24-24-24z' class=''%3E%3C/path%3E%3C/svg%3E");
      }

      &:hover {
        background-color: darken($color-green, 3%);
      }
    }
  }
</style>