<template>
  <component :is="type">
    <div :class="[{ contained: contained }]">
      <a v-if="logo" :href="logo.url" :title="logo.imageAlt">
        <img v-if="logo" :src="logo.image" :alt="logo.imageAlt" />
      </a>

      <a :href="logo.url"
         :title="logo.imageAlt">
        <h1
          v-if="logoHeadings.topHeading"
          v-html="logoHeadings.topHeading"></h1>
        <h2
          v-if="logoHeadings.subHeading"
          v-html="logoHeadings.subHeading"></h2>
      </a>

      <a
        v-if="application"
        :href="application.url"
        v-html="application.name"
        :target="application.target"
        :title="application.name"></a>

      <nav
        v-if="navItems"
        id="navigation"
        role="navigation"
        aria-labelledby="navigation">
        <ul>
          <li v-for="(item, index) in navItems" :key="index">
            <a
              :href="item.href"
              :class="item.class"
              :disabled="item.disabled"
              :title="item.name"
              :target="item.target"
              v-html="item.name"></a>
          </li>
        </ul>
      </nav>

      <slot name="dropdown"></slot>

      <nav
        v-if="subNavItems"
        role="navigation"
        id="sub-navigation"
        aria-labelledby="sub-navigation">
        <ul>
          <li v-for="(item, index) in subNavItems" :key="index">
            <a
              :href="item.href"
              :class="item.class"
              :disabled="item.disabled"
              :title="item.name"
              :target="item.target"
              v-html="item.name"></a>
          </li>
        </ul>
      </nav>
    </div>
  </component>
</template>

<script>
/**
 * Used as the Header template.
 */
export default {
  name: "example-header",
  status: "ready",
  release: "1.0.0",
  props: {
    /**
     * The html element name used for the nav bar.
     * `header`
     */
    type: {
      type: String,
      default: "header",
      validator: value => {
        return value.match(/(header)/)
      },
    },
    /**
     * Application information, name & url.
     */
    application: {
      type: Object,
      default: null,
    },
    /**
     * Menu items to be displayed on the nav bar.
     */
    navItems: {
      type: Array,
      default: null,
    },
    /**
     * Displays sub-navigation menu items.
     */
    subNavItems: {
      type: Array,
      default: null,
    },
    /**
     * Displays the City of Bloomington snowflake logo.
     *
     * size: `55px x 55px`
     */
    logo: {
      type: Object,
      default: null,
      required: true,
    },
    /**
     * Headings of the logo.
     */
    logoHeadings: {
      type: Object,
      default: null,
    },
    /**
     * Determines if the header should fully expand or be contained.
     */
    contained: {
      type: Boolean,
      default: false,
    },
  },
}
</script>

<style lang="scss" scoped>
header {
  position: fixed;
  display: flex;
  flex-wrap: wrap;
  font-family: $font-text;
  width: 100%;
  background: white;
  border-top: 4px solid $color-blue;
  // border-bottom: 1px solid $color-grey;
  padding: 15px 20px;

  div {
    &:first-of-type {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      width: 100%;
      margin: 0 auto;

      &.contained {
        margin: 0 auto;
        width: 1080px;

        nav {
          &[role="sub navigation"] {
            margin: 15px 0 0 0;
          }
        }
      }
    }
  }

  a {
    display: flex;
    align-items: center;
    text-decoration: none;
    margin: 0 10px;
    padding: 0;

    &:first-of-type {
      margin: 0;
      display: block;
      margin: 0 10px 0 0;
      width: 55px;
      height: 55px;

      img {
        display: block;
        width: 55px;
        height: 55px;
      }
    }

    &:nth-child(2) {
      display: inline-grid;
      flex-wrap: wrap;
      align-content: center;
      position: relative;
      margin: 0;

      div {
        flex-direction: column;
      }

      h1,
      h2 {
        margin: 0;
        padding: 0;
        flex-basis: 100%;
        display: inline-block;
        width: auto;
      }

      h1 {
        letter-spacing: $spacing-s;
        font-size: $size-m + 2px;
        font-weight: $weight-semi-bold;
        line-height: $size-m + 5px;
        color: $color-blue;
      }

      h2 {
        letter-spacing: $spacing-s;
        font-size: $size-m;
        font-weight: $weight-normal;
        line-height: $size-m + 5px;
        color: tint($color-blue, 20%);
      }
    }

    &:nth-child(3) {
      position: relative;
      margin: 0 0 0 20px;
      color: tint($color-slate, 20%);
      letter-spacing: $spacing-s;
      font-size: $size-m;
      font-weight: $weight-normal;
      line-height: $size-m + 5px;

      &:before {
        position: absolute;
        content: "";
        height: $size-l;
        left: -10px;
        border-left: 1px solid tint($color-slate, 20%);
      }
    }
  }

  nav {
    display: flex;
    align-items: center;
    align-self: center;
    // margin: 0 0 0 auto;

    &.navigation-dropdown {
      margin: 0 0 0 20px;
    }


    &:not(.navigation-dropdown) {
      margin: 0 0 0 auto;

      ul {
        display: flex;
        align-items: center;
        align-self: center;
        padding: 0;
        list-style: none;

        li {
          font-size: 16px;
          margin: 0 5px 0 0;

          &:last-of-type {
            margin: 0;
          }

          a {
            font-size: 16px;
            width: auto;
            height: auto;
            color: tint($color-slate, 20%);

            &:hover {
              text-decoration: underline;
            }
          }
        }
      }
    }

    &[role="sub navigation"] {
      display: block;

      background: tint($color-blue, 10%);
      width: calc(100% + 40px);
      margin: 15px -20px 0 -20px;
      padding: 5px 20px;

      ul {
        li {
          a {
            font-size: $size-s;
            color: white;
          }
        }
      }
    }
  }

  @media (max-width: 767px) {
    a {
      &:first-of-type {
        margin: 0;
        width: 35px;
        height: 35px;

        img {
          width: 35px;
          height: 35px;
        }
      }

      &:nth-child(2) {
        h1, h2 {
          display: none;
        }
      }
    }
  }
}
</style>
