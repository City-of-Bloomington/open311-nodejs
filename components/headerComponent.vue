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
      cityName:           process.env.cityName,
      logoHeading:        process.env.logoHeading,
      logoSubHeading:     process.env.logoSubHeading,
      frontendBase:       process.env.frontendBase,
    }
  }
}
</script>

<style lang="scss" scoped>
</style>