<template>
  <main class="content container">
    <NuxtLink class="btn btn_back" to="/vk-vue">
      Веруться к списку
    </NuxtLink>
    <h1 class="content__title">
      Профиль пользователя {{ `${friend.first_name} ${friend.last_name}` }}
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
import { jsonp } from 'vue-jsonp';

export default {
  async asyncData({ params }) {
    // https://github.com/rand0mm/vk-vue/blob/main/README.md
    // eslint-disable-next-line max-len, vue/max-len
    const tokenVK = 'vk1.a.Iu-BtXMlHKvmNtwrKbm6cMxzNDHuHKn8Gs_1jo1a9Ngobwc50e2iG-8IygsFbXz2MK_clnwDtao0Tuv0qCg572Fpua4k-iJfKmA4ChxGrua78DKtX6RmFHM-3jYn2yDc_HMGGGbM1AuYBVgc-GceVff0rDekFXsKY2Pamw2ciVQHxZkqeeudFuBZLA7h7X-4-FTSm4WgiLf-KN15KCLAfQ';
    let wall = null;
    function AddLeft(str, add, len) {
      let srting = String(str);
      while (srting.length < len) srting = add + srting;
      return srting;
    }
    try {
      const wallRes = await jsonp(
        'https://api.vk.com/method/wall.get',
        {
          owner_id: params.id,
          access_token: tokenVK,
          v: '5.131',
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
      console.log(`Ошибка запроса:${error.message || error}`);
      wall = [{ text: `Ошибка запроса:${error.message || error}` }];
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
      const obj = this.$store.getters['users/friends'];
      const id = this.$route.path.split('/')[3];
      return obj[id] || '';
    },
  },
};
</script>
