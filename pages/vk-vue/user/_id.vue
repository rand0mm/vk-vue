<template>
  <main class="content container">
    <NuxtLink class="btn btn_back" to="/vk-vue">
      Веруться к списку
    </NuxtLink>
    <h1 class="content__title">
      Профиль пользователя {{ friend.name }}
    </h1>
    <div v-if="crossUsers" class="users">
      <h2 class="content__title">
        Общие друзья:
      </h2>
      <ul class="users__list users__list_friends">
        <li
          v-for="user in crossUsers"
          :key="'foundUser-' + user.id"
          class="users__item"
        >
          <span class="users__photo">
            <img
              class="users__img"
              :src="user.photo"
              :alt="'фото' + user.name"
            >
          </span>
          <span class="users__name users__name_friends">{{ user.name }} </span>
        </li>
      </ul>
    </div>
    <div class="wall">
      <h2 class="content__title">
        Записи на стене:
      </h2>
      <ul class="wall__list">
        <li v-for="post in wall" :key="'post' + post.id" class="wall__item">
          {{ post.dateSrt }}&nbsp;{{ post.text || "Пост без текста" }}
        </li>
      </ul>
    </div>
  </main>
</template>

<script>
export default {
  async asyncData({ params, $axios }) {
    // https://github.com/rand0mm/vk-vue/blob/main/README.md
    // eslint-disable-next-line max-len, vue/max-len
    const tokenVK = 'vk1.a.iKXZl3bW2iUDqqXovCr-5dw7t0zSEkOQ9cHH8Dv20qet_9lC7-Y5MLnsrGony2MYIIw8R3E1N_z1TMczUFm9S0KGjk96P8Hscwep67aOwjBEl2Qh8eV8EM2g2vIjsWmHpsVFrs5dez51iqJekRPq3H7RIY-9lBrPOwHh6zm34gM3Vowrr76KthOYKvWrVoZXp2K3uod46zGaqh-NWrqq1Q';
    let wall = null;
    function AddLeft(str, add, len) {
      let srting = String(str);
      while (srting.length < len) srting = add + srting;
      return srting;
    }
    try {
      const wallRes = await $axios.$post(
        'https://api.vk.com/method/wall.get?',
        null,
        {
          params: {
            owner_id: params.id,
            access_token: tokenVK,
            v: '5.131',
          },
        },
      );
      if (wallRes.error) {
        throw wallRes.error.error_msg;
      }
      wall = wallRes.response.items.map((i) => {
        const date = new Date(i.date * 1000);
        const dataStr = `${date.getFullYear()}-${AddLeft(
          date.getMonth() + 1,
          '0',
          2,
        )}-${AddLeft(date.getDate(), '0', 2)}: `;
        const newI = i;
        newI.dateSrt = dataStr;
        return newI;
      });
    } catch (error) {
      console.log(`Ошибка запроса:${error.message}`);
      return 'error';
    }
    return {
      wall,
    };
  },
  data() {
    return {};
  },
  computed: {
    crossUsers() {
      const users = this.$store.getters['users/selectedUSers'];
      return users.filter((i) => this.friend.cross.includes(i.id));
    },
    friend() {
      let obj = this.$store.getters['users/friends'];
      const id = this.$route.path.split('/')[3];
      obj = obj[id];
      return obj || '';
    },
  },
};
</script>
