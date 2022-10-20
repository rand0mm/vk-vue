<template>
  <main class="content container">
    <h1 class="content__title">
      Панель управления списком пользователей
    </h1>
    <SearchInput />
    <SelectedUsers />
    <button class="btn build-btn">
      Построить
    </button>
    <UsersFriends />
  </main>
</template>

<script>
export default {
  data() {
    return {
      isShowUsersFriends: false,
    };
  },
  computed: {},
  watch: {
  },
};
</script>
