<template>
  <div v-if="isShowUsers" class="users">
    <h2 class="content__title">
      Друзья пользователей:
    </h2>
    <ul class="users__list users__list_friends">
      <li
        v-for="user in friends"
        :key="'foundUser-' + user.id"
        class="users__item"
        :style="{ 'opacity': (user.cross.percent || 20 ) / 100}"
        @click.prevent="goToProfile(user.id)"
      >
        <span class="users__photo">
          <img class="users__img" :src="user.photo" :alt="'фото' + user.name">
        </span>
        <span class="users__name users__name_friends">{{ user.name }} </span>
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
    friends() {
      const arr = Object.values(this.$store.getters['users/friends']);
      return arr ? arr.map((i) => {
        let percent = 0;
        if (i.cross) {
          percent = this.maxCross ? Math.ceil(((i.cross.length || 0) * 100) / this.maxCross) : 100;
        }
        return {
          id: i.id,
          name: `${i.first_name} ${i.last_name}`,
          photo: i.photo_100,
          cross: {
            percent,
            items: i.cross || [],
          },
        };
      }) : [];
    },
    isShowUsers() {
      return this.$store.getters['users/isShowFriends'];
    },
    maxCross() {
      return this.$store.getters['users/maxCross'];
    },
  },
  watch: {
  },
  methods: {
    goToProfile(id) {
      this.$router.push({ path: `/vk-vue/user/${id}` });
    },
  },
};
</script>
