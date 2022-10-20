<template>
  <div class="users">
    <h2 class="content__title">
      Выбранные пользователи:
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
        <span class="users__remove" @click.prevent="removeUser(user)">
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
    isShowUsers() {
      return this.selectedUSers.length > 0;
    },
    selectedUSers() {
      return this.$store.getters['users/selectedUSers'];
    },
  },
  watch: {
  },
  methods: {
    removeUser(user) {
      let newArr = JSON.parse(JSON.stringify(this.selectedUSers));
      if (newArr.find((i) => i.id === user.id)) {
        newArr = newArr.filter((i) => i.id !== user.id);
        this.$store.commit('users/setSelectedUSers', newArr);
      }
    },
  },
};
</script>
