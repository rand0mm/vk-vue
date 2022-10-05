

<script setup>
  const searchStr = ref(null)
</script>
    
    
<template>
  <main class="content container">
    <div class="content__add add">
      <label class="add__label" for="add">
        <input
          class="add__input"
          type="text"
          name="add"
          placeholder="Введите индентификатор или имя пользователя"
          v-model="searchStr"
          autocomplete="off"
        />
      </label>
    </div>
  </main>
</template>