<template>
  <div v-if="isShowUsers" class="users">
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
        <span class="users__info">
          <span class="users__name">
            {{ user.name }}
          </span>
          <span class="users__sex">Пол:&nbsp;{{ user.sex.title }} </span>
          <span class="users__age">Возвраст:&nbsp;{{ user.age }} </span>
          <span
            class="users__friends"
            :class="{ users__friends_error: !user.access }"
          >Друзей:&nbsp;{{ user.friendsCount }}
          </span>
        </span>

        <span class="users__remove btn" @click.prevent="removeUser(user)">
          Удалить
        </span>
      </li>
    </ul>
    <button class="btn build-btn" @click.prevent="showFriendList">
      Построить
    </button>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  computed: {
    isShowUsers() {
      return this.selectedUSers.length > 0;
    },
    selectedUSers() {
      const users = this.$store.getters['users/selectedUSers'];
      users.sort((a, b) => (a.name > b.name ? 1 : -1));
      return users;
    },
  },
  watch: {},
  methods: {
    removeUser(user) {
      let newArr = JSON.parse(JSON.stringify(this.selectedUSers));
      if (newArr.find((i) => i.id === user.id)) {
        newArr = newArr.filter((i) => i.id !== user.id);
        this.$store.commit('users/setSelectedUSers', newArr);
        localStorage.setItem('users', JSON.stringify(newArr));
      }
    },
    showFriendList() {
      this.$store.commit('users/setIsShowFriends', true);
      localStorage.setItem('setIsShowFriends', JSON.stringify(true));
    },
  },
};
</script>
