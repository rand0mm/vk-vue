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
        :style="{ opacity: (user.cross.percent || 20) / 100 }"
        @click.prevent="goToProfile(user.id)"
      >
        <span class="users__photo">
          <img class="users__img" :src="user.photo" :alt="'фото' + user.name">
        </span>
        <span class="users__info">
          <span class="users__name">
            {{ user.name }}
          </span>
          <span class="users__sex">Пол:&nbsp;{{ user.sex }} </span>
          <span class="users__age">Возвраст:&nbsp;{{ user.age }} </span>
          <span
            class="users__friends"
            :class="{ users__friends_error: !user.access }"
          >Друзей:&nbsp;{{ user.friendsCount || "Загрузка..." }}
          </span>
        </span>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {
      delay: null,
      tokenVK:
        // https://github.com/rand0mm/vk-vue/blob/main/README.md
        // eslint-disable-next-line max-len, vue/max-len
        'vk1.a.Iu-BtXMlHKvmNtwrKbm6cMxzNDHuHKn8Gs_1jo1a9Ngobwc50e2iG-8IygsFbXz2MK_clnwDtao0Tuv0qCg572Fpua4k-iJfKmA4ChxGrua78DKtX6RmFHM-3jYn2yDc_HMGGGbM1AuYBVgc-GceVff0rDekFXsKY2Pamw2ciVQHxZkqeeudFuBZLA7h7X-4-FTSm4WgiLf-KN15KCLAfQ',
    };
  },
  computed: {
    friends() {
      const arr = Object.values(this.$store.getters['users/friends']);
      return arr
        ? arr
          .map((i) => {
            let percent = 0;
            if (i.cross) {
              percent = this.maxCross
                ? Math.ceil(((i.cross.length || 0) * 100) / this.maxCross)
                : 100;
            }
            return {
              id: i.id,
              name: `${i.first_name} ${i.last_name}`,
              photo: i.photo_100,
              cross: {
                percent,
                items: i.cross || [],
              },
              sex: i.sex === 2 ? 'Мужской' : 'Женский',
              age: this.getAge(i.bdate),
              friendsCount: i.friendsCount,
            };
          })
          .sort((a, b) => (a.name > b.name ? 1 : -1))
        : [];
    },
    isShowUsers() {
      return this.$store.getters['users/isShowFriends'];
    },
    maxCross() {
      return this.$store.getters['users/maxCross'];
    },
    // получаем данные из стора
    toLoadFriendData() {
      const arr = Object.values(this.$store.getters['users/toLoadFriendData']);
      return arr;
    },
  },
  watch: {},
  mounted() {
    // прокидываем запрос
    console.log(this.$store.getters['users/toLoadFriendData']);
    this.delay = clearInterval(this.delay);
    this.delay = setInterval(async () => {
      this.loadFriend();
    }, 600);
  },
  methods: {
    goToProfile(id) {
      this.$router.push({ path: `/vk-vue/user/${id}` });
    },
    getAge(dateString) {
      if (!dateString) return '?';
      const today = new Date();
      const date = dateString.split('.');
      if (!date[2] || !date[1] || !date[0]) {
        return '?';
      }
      const birthDate = new Date(date[2], Number(date[1]) - 1, date[0]);
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age -= 1;
      }
      return age;
    },
    async loadFriend() {
      const newArr = JSON.parse(JSON.stringify(this.toLoadFriendData));
      if (newArr.length < 1) { return; }
      const workArr = [this.toLoadFriendData[0], this.toLoadFriendData[1], this.toLoadFriendData[2]];
      const resultArray = await Promise.all([
        this.resFriend(workArr[0].id),
        this.resFriend(workArr[1].id),
        this.resFriend(workArr[2].id),
      ]);
      resultArray.forEach((i) => {
        this.$store.commit('users/setFriendInfo', {
          id: i.id,
          value: i.friendsCount,
        });
      });
      newArr.splice(0, 3);
      this.$store.commit('users/setToLoadFriendData', newArr);
    },
    async resFriend(id) {
      try {
        const res = await this.$jsonp('https://api.vk.com/method/users.get', {
          user_id: id,
          access_token: this.tokenVK,
          fields: 'counters',
          v: '5.131',
        });
        if (res.error) {
          throw res.error.error_msg;
        }
        return res.counters.friends;
      } catch (error) {
        console.log('Ошибка при запросе resFriend', error.message || error);
        return null;
      }
    },
  },
};
</script>
