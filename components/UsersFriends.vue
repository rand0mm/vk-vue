<template>
  <div v-if="isShowUsers" class="users">
    <h2 class="content__title">
      Друзья пользователей:
    </h2>
    <perfect-scrollbar class="users__wrapper">
      <ul class="users__list users__list_friends">
        <li
          v-for="user in friends"
          :key="'foundUser-' + user.id"
          class="users__item"
          :style="{
            backgroundColor: `rgba(0, 119, 255, ${
              (user.cross.percent || 20) / 100
            })`,
          }"
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
    </perfect-scrollbar>
  </div>
</template>

<script>
export default {
  data() {
    return {
      delay: null,
      isLoading: false,
      test: 0,
      refreshKey: 0,
      tokenVK:
        // https://github.com/rand0mm/vk-vue/blob/main/README.md
        // eslint-disable-next-line max-len, vue/max-len
        'vk1.a.Iu-BtXMlHKvmNtwrKbm6cMxzNDHuHKn8Gs_1jo1a9Ngobwc50e2iG-8IygsFbXz2MK_clnwDtao0Tuv0qCg572Fpua4k-iJfKmA4ChxGrua78DKtX6RmFHM-3jYn2yDc_HMGGGbM1AuYBVgc-GceVff0rDekFXsKY2Pamw2ciVQHxZkqeeudFuBZLA7h7X-4-FTSm4WgiLf-KN15KCLAfQ',
    };
  },
  computed: {
    friends() {
      // eslint-disable-next-line no-unused-expressions
      this.refreshKey;
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
      return this.$store.getters['users/toLoadFriendData'];
    },
  },
  watch: {
    toLoadFriendData() {
      if (!this.isLoading) {
        this.loadFriend();
      }
    },
  },
  mounted() {
    if (this.isShowUsers) {
      this.loadFriend();
    }
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
      if (this.toLoadFriendData.length < 1) {
        return;
      }
      const routeName = this.$route.path.split('/');
      let errorRequest = false;
      this.isLoading = 1;
      clearTimeout(this.delay);
      this.delay = setTimeout(async () => {
        this.isLoading = 0;
      }, 1000);
      if (routeName[routeName.length - 1] === 'vk-vue') {
        const newArr = JSON.parse(JSON.stringify(this.toLoadFriendData));
        const workArr = newArr.slice(0, 3);
        const resultArray = await Promise.all(
          workArr.map((i) => this.resFriend(i.id)),
        );
        resultArray.forEach((i) => {
          if (i) {
            this.$store.commit('users/setFriendInfo', {
              id: i.id,
              value: i.count,
            });
          } else {
            errorRequest = true;
          }
        });
        if (!errorRequest) {
          newArr.splice(0, 3);
          this.refreshKey += 1;
          this.$store.commit('users/setToLoadFriendData', newArr);
          localStorage.setItem('toLoadFriendData', JSON.stringify(newArr));
        }
        // если запросы обработались раньше ограничения vk api
        if (this.isLoading === 1) {
        // eslint-disable-next-line no-promise-executor-return, no-unused-vars
          const sleep = await new Promise((r) => setTimeout(r, 1200));
          this.loadFriend();
        } else if (this.isLoading === 0) {
          this.loadFriend();
        }
      }
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
          console.log(res.error.error_msg);
          throw res.error.error_msg;
        }
        return {
          id,
          count: res.response[0].counters
            ? res.response[0].counters.friends
            : '?',
        };
      } catch (error) {
        console.log('Ошибка при запросе resFriend', error.message || error);
        return null;
      }
    },
  },
};
</script>
