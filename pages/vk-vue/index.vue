<template>
  <main class="content container">
    <div class="content__add add">
      <label class="add__label" for="add">
        <input
          v-model="searchStr"
          class="add__input"
          type="text"
          name="add"
          placeholder="Введите индентификатор или имя пользователя"
          autocomplete="off"
        >
      </label>
    </div>
  </main>
</template>

<script>

export default {
  data() {
    return {
    };
  },
  computed: {

  },

};
</script>
