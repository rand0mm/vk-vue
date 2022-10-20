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
        'vk1.a.iKXZl3bW2iUDqqXovCr-5dw7t0zSEkOQ9cHH8Dv20qet_9lC7-Y5MLnsrGony2MYIIw8R3E1N_z1TMczUFm9S0KGjk96P8Hscwep67aOwjBEl2Qh8eV8EM2g2vIjsWmHpsVFrs5dez51iqJekRPq3H7RIY-9lBrPOwHh6zm34gM3Vowrr76KthOYKvWrVoZXp2K3uod46zGaqh-NWrqq1Q',
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
        };
        return newUser;
      }) : [];
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
        const res = await this.$axios.$post(
          'https://api.vk.com/method/users.search?',
          null,
          {
            params: {
              q: JSON.stringify(value),
              fields: 'photo_100',
              access_token: token,
              count: '10',
              v: '5.131',
            },
          },
        );
        console.log(res);
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
        const resId = await this.$axios.$post(
          'https://api.vk.com/method/users.get?',
          null,
          {
            params: {
              user_ids: value,
              fields: 'photo_100',
              access_token: token,
              count: '10',
              v: '5.131',
            },
          },
        );
        console.log(resId);
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
    choiceUser(user) {
      const newArr = JSON.parse(JSON.stringify(this.selectedUSers));
      console.log('Выбранный пользователь', user); // выбранный пользователь
      if (!newArr.find((i) => i.id === user.id)) {
        newArr.push(user);
      }
      this.$store.commit('users/setSelectedUSers', newArr);
      this.isShowFoundData = false;
      console.log('массив после добавления', this.selectedUSers); // массив после добавления
    },
  },
};
</script>
