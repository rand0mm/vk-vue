<template>
  <div class="container">
    <h1 v-if="error.statusCode === 404">
      Страница не найдена
    </h1>
    <h1 v-else>
      {{ error.message }}
    </h1>
    <NuxtLink to="/vk-vue">
      Веруться на главную
    </NuxtLink>
  </div>
</template>

<script>
export default {
  layout: 'blog',
  props: ['error'], // you can set a custom layout for the error page
};
</script>
