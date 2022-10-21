<template>
  <div id="app">
    <header class="header">
      <div class="header__wrapper">
        <NuxtLink class="header__logo" to="/vk-vue/">
          <img
            src="@/assets/img/logo.webp"
            alt="Логотип"
            width="121"
            height="33"
          >
          Vk <br>search
        </NuxtLink>
        <h1 class="header__info">
          Поиск&nbsp;в&nbsp;вк
        </h1>
      </div>
    </header>
    <nuxt />
    <portal-target name="destination" />
  </div>
</template>

<script>
export default {
  mounted() { this.$store.dispatch('users/getLocal'); },
};
</script>
