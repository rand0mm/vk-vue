<template>
  <div class="content__add add">
    <label class="add__label" for="users">
      <input
        v-model="searchStr"
        class="add__input"
        type="text"
        name="users"
        placeholder="Введите индентификатор или имя пользователя"
        autocomplete="off"
        @focus.prevent="isShowFoundData=true"
      >
    </label>
    <div v-if="isShowFound" class="users add__users" :class="{'add_error': isSomeAxiosError}">
      <ul class="users__list">
        <li
          v-for="user in users"
          :key="'foundUser-' + user.id"
          class="users__item"
          @click.prevent="choiceUser(user)"
        >
          <span v-if="!isSomeAxiosError" class="users__photo">
            <img class="users__img" :src="user.photo" :alt="'фото' + user.name">
          </span>
          <span class="users__name">{{ user.name }} </span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      searchStr: '',
      delay: null,
      foundUsers: [],
      isSomeAxiosError: false,
      isShowFoundData: false,
      tokenVK:
        // https://github.com/rand0mm/vk-vue/blob/main/README.md
        // eslint-disable-next-line max-len, vue/max-len
        'vk1.a.Iu-BtXMlHKvmNtwrKbm6cMxzNDHuHKn8Gs_1jo1a9Ngobwc50e2iG-8IygsFbXz2MK_clnwDtao0Tuv0qCg572Fpua4k-iJfKmA4ChxGrua78DKtX6RmFHM-3jYn2yDc_HMGGGbM1AuYBVgc-GceVff0rDekFXsKY2Pamw2ciVQHxZkqeeudFuBZLA7h7X-4-FTSm4WgiLf-KN15KCLAfQ',
    };
  },
  computed: {
    isShowFound() {
      return this.isShowFoundData ? this.users.length > 0 : false;
    },
    selectedUSers() {
      return this.$store.getters['users/selectedUSers'];
    },
    users() {
      return this.foundUsers ? this.foundUsers.map((i) => {
        const newUser = {
          id: i.id,
          name: `${i.first_name} ${i.last_name}`,
          photo: i.photo_100,
          bdate: i.bdate,
          sex: {
            id: i.sex,
            title: i.sex === 2 ? 'Мужской' : 'Женский',
          },
          access: i.can_access_closed,
        };
        return newUser;
      }) : [];
    },
    friends() {
      return this.$store.getters['users/friends'];
    },
    maxCross() {
      return this.$store.getters['users/maxCross'];
    },
  },
  watch: {
    searchStr() {
      this.delay = clearTimeout(this.delay);
      this.delay = setTimeout(async () => {
        const str = this.searchStr;
        this.foundUsers = [];
        // 222697945
        // xobbit29ru
        if (str.length > 2 && str.length <= 256) {
          this.searchByStr(str, this.tokenVK);
          this.searchById(str, this.tokenVK);
        }
      }, 300);
    },
  },
  beforeMount() {
    window.addEventListener('click', (e) => {
      if (!e.target.closest('.add')) {
        this.isShowFoundData = false;
      }
    });
  },
  methods: {
    async searchByStr(value, token) { // запрос отдельно по строке
      try {
        const res = await this.$jsonp(
          'https://api.vk.com/method/users.search',
          {
            q: JSON.stringify(value),
            fields: 'photo_100,bdate,sex',
            access_token: token,
            count: '10',
            v: '5.131',
          },
        );
        if (res.error) {
          this.isSomeAxiosError = true;
          throw res.error.error_msg;
        }
        if (res.response.items.length && !this.isSomeAxiosError) {
          this.foundUsers = this.foundUsers.concat(res.response.items);
        }
      } catch (error) {
        this.foundUsers = [{ first_name: 'Ошибка при запросе', last_name: error.message || error }];
      }
    },
    async searchById(value, token) { // запрос отдельно по id
      try {
        const resId = await this.$jsonp(
          'https://api.vk.com/method/wall.get',
          {
            user_ids: value,
            fields: 'photo_100,bdate,sex',
            access_token: token,
            count: '10',
            v: '5.131',
          },
        );
        if (resId.error) {
          this.isSomeAxiosError = true;
          throw resId.error.error_msg;
        }
        if (resId.response.length && !this.isSomeAxiosError) {
          resId.response.forEach((e) => {
            this.foundUsers.unshift(e);
          });
        }
      } catch (error) {
        this.foundUsers = [{ first_name: 'Ошибка при запросе', last_name: error.message || error }];
      }
    },
    async getFriends(user, token) { // получение друзей пользователя
      try {
        const friends = await this.$jsonp(
          'https://api.vk.com/method/friends.get',
          {
            user_id: user.id,
            access_token: token,
            fields: 'photo_100',
            v: '5.131',
          },
        );
        if (friends.error) {
          throw friends.error.error_msg;
        }
        // добавляем друзей
        const curList = JSON.parse(JSON.stringify(this.friends));

        // console.log('test', curList);
        // console.log('test', friends.response.items);
        friends.response.items.map((i) => {
          if (curList[i.id]) {
            if (curList[i.id].cross) {
              curList[i.id].cross.push(user.id);
            } else {
              curList[i.id].cross = [user.id];
            }
            const itemCross = curList[i.id].cross.length;
            if (this.maxCross < itemCross) {
              this.$store.commit('users/setMaxCross', itemCross);
              localStorage.setItem('cross', JSON.stringify(itemCross));
            }
          } else {
            const newItem = i;
            newItem.cross = [user.id];
            curList[i.id] = newItem;
          }
          return i;
        });
        this.$store.commit('users/setFriends', curList); // записан обновленный список всех друзей
        localStorage.setItem('friends', JSON.stringify(curList));
        console.log('обновленный список всех друзей', Object.values(this.friends).length);
        return friends.response.count;
      } catch (error) {
        console.log(`Ошибка запроса:${error.message}`);
        return 'error';
      }
    },
    async choiceUser(user) {
      const token = this.tokenVK;
      const newUser = user;
      const newArr = JSON.parse(JSON.stringify(this.selectedUSers));
      this.isShowFoundData = false;
      console.log('Выбранный пользователь', user); // выбранный пользователь
      if (!newArr.find((i) => i.id === user.id)) {
        if (user.access) { // если профиль не закрыт смотрим друзей
          const friendsCount = await this.getFriends(user, token);
          newUser.friendsCount = friendsCount;
        }
        newArr.push(newUser);
        this.$store.commit('users/setSelectedUSers', newArr);
        localStorage.setItem('users', JSON.stringify(newArr));
      }

      console.log('массив после добавления', this.selectedUSers); // массив после добавления
    },
  },
};
</script>
