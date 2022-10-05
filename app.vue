<template>
  <html>
    <body>
      <header class="header">
        <div class="header__wrapper">
          <NuxtLink class="header__logo" to="/vk-vue/">
            <img
              src="@/assets/img/logo.webp"
              alt="Логотип"
              width="121"
              height="33"
            />
            Vk <br>search
          </NuxtLink>
          <h1 class="header__info">Поиск&nbsp;в&nbsp;вк</h1>
        </div>
      </header>
      <NuxtPage />
      <div id="teleport-target"></div>
    </body>
  </html>
</template>

<script setup>
import { useEmployesStore } from "@/store/employes";

const employesStore = useEmployesStore();
employesStore.fetchData();
</script>
