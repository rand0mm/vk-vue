<template>
  <div class="users">
    <h2 class="content__title">
      Общие друзья пользователей:
    </h2>
    <ul v-if="isShowUsers" class="users__list">
      <li
        v-for="user in selectedUSers"
        :key="'foundUser-' + user.id"
        class="users__item"
      >
        <span class="users__photo">
          <img class="users__img" :src="user.photo" :alt="'фото' + user.name">
        </span>
        <span class="users__name">{{ user.name }} </span>
        <span class="users__remove btn" @click.prevent="removeUser(user)">
          удалить
        </span>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {
    };
  },
  computed: {
  },
  watch: {
  },
  methods: {
  },
};
</script>
