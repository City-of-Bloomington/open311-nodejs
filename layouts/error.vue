<template>
  <div>
    <main>
      <h1>Sorry, an error occurred.</h1>
      <code>{{ error }}</code>
      <nuxt-link to="/">Go Home</nuxt-link>
    </main>
  </div>
</template>

<script>
export default {
   props: ['error'],
}
</script>

<style lang="scss" scoped>
main {
  padding: 50px 0 0 0;
  text-align: center;
}

a {
  text-decoration: underline;
}

code {
  display: block;
  margin: 10px auto;
  background-color: darken($color-blue, 5%);
  padding: 20px;
  font-size: 16px;
  border-radius: 3px;
}

h1 {
  color: white;
}
</style>