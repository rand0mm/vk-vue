<script setup>
import { useEmployesStore } from "@/store/employes";
import {
  getCurrentMonth,
  formatDate,
  hoursFormat,
  changeDate,
} from "@/helpers/getDaysData";

const route = useRoute();
const employer = ref(null);
const employerName = ref('');
const employesStore = useEmployesStore();

// for render
const curWeek = computed({
  get() {
    return employesStore.getWeek || 0;
  },
  set(value) {
    employesStore.curWeek = value;
  },
});
const curDay = computed({
  get() {
    return employesStore.getDay || 0;
  },
  set(value) {
    employesStore.curDay = value;
  },
});
const currentMonth = computed({
  get() {
    return employesStore.getMonth || getCurrentMonth();
  },
  set(value) {
    employesStore.curMonth = value;
  },
});
// id первого дня текущей недели
const first = computed({
  get() {
    return employesStore.getFirst || formatDate(currentMonth.value[curWeek.value][0], true);
  },
  set(value) {
    employesStore.curFirst = value;
  },
});
const currentEmployRender = computed(() => {
  let newWeek = employer.value
    ? employer.value.data.filter(
        (i) => i.date >= first.value && i.date <= first.value + 6
      )
    : [];
  let lengthEmpty = 7 - newWeek.length;
  if (lengthEmpty > 0) {
    for (let j = 0; j < lengthEmpty; j++) {
      let newDate = changeDate(first.value, 7 - lengthEmpty + j, true);
      newWeek.push({ date: newDate, active: "", start: "" });
    }
  }
  return newWeek;
});
// for logic
const employerlData = computed(() => employesStore.getEmployes);
const currentWeekData = computed(() => {
  if (!employer.value) return;
  // текущая неделя:
  let newWeek = employer.value.data
    ? employer.value.data.filter(
        (i) => i.date >= first.value - 1 && i.date <= first.value + 7
      )
    : [];
  let lengthEmpty = 9 - newWeek.length;
  if (lengthEmpty > 0) {
    for (let j = 0; j < lengthEmpty; j++) {
      let newDate = changeDate(first.value, 9 - lengthEmpty + j - 1, true);
      newWeek.push({ date: newDate, active: "", start: "" });
      employer.value.data.push({ date: newDate, active: "", start: "" });
    }
  }
  return newWeek;
});

const doSetHours = (hour, day) => {
  console.log("Выбрали:", "час", hour, "день", day);
  let h = Number(hour);
  let d = Number(day);
  let currArr = currentWeekData.value.filter(
    (i) => Number(i.date) >= d - 1 && Number(i.date) <= d + 1
  );
  let currentObj = {
    active: "",
    start: "",
  };
  let prevDay = currArr[0];
  let curDay = currArr[1];
  let nextDay = currArr[2];
  let changePrevDay = {
    active: prevDay.active.match(/.{1,2}/g),
    start: prevDay.start.match(/.{1,2}/g),
  };
  changePrevDay.active = changePrevDay.active
    ? changePrevDay.active.map((i) => Number(i) - 24)
    : [];
  changePrevDay.start = changePrevDay.start
    ? changePrevDay.start.map((i) => Number(i) - 24)
    : [];
  let changeCurDay = {
    active: curDay.active.match(/.{1,2}/g),
    start: curDay.start.match(/.{1,2}/g),
  };
  changeCurDay.active = changeCurDay.active
    ? changeCurDay.active.map((i) => Number(i))
    : [];
  changeCurDay.start = changeCurDay.start
    ? changeCurDay.start.map((i) => Number(i))
    : [];
  let changeNextDay = {
    active: nextDay.active.match(/.{1,2}/g),
    start: nextDay.start.match(/.{1,2}/g),
  };
  changeNextDay.active = changeNextDay.active
    ? changeNextDay.active.map((i) => Number(i) + 24)
    : [];
  changeNextDay.start = changeNextDay.start
    ? changeNextDay.start.map((i) => Number(i) + 24)
    : [];
  console.log("Получили данные:", changePrevDay, changeCurDay, changeNextDay);
  currentObj.active = changePrevDay.active.concat(
    changeCurDay.active,
    changeNextDay.active
  );
  currentObj.start = changePrevDay.start.concat(
    changeCurDay.start,
    changeNextDay.start
  );
  console.log("Рабочий объект:", currentObj);
  let targetStart = currentObj.start.filter((i) => h >= i - 3 && h <= i + 8);
  targetStart = targetStart[targetStart.length - 1];
  console.log("Час входит в смену начало которой с", targetStart);
  if (targetStart || targetStart === 0) {
    let closeTarget = currentObj.start.find((i) => {
      return i > targetStart + 3
    }) - 1 || 99; // соседняя смена справо
    Math.min(targetStart + 8, closeTarget)
    // есть ли активная смена в этот час
    let activeIndex = currentObj.active.indexOf(h);
    if (activeIndex !== -1) {
      // если час уже активен удаляем час
      let activeLine = currentObj.active.filter(
        (i) => i >= targetStart && i <= Math.min(targetStart + 8, closeTarget)
      );
      console.log("Нужная смена", activeLine);
      if (activeLine.length < 5) {
        // удаление часа приведет к отмене смены
        currentObj.active = currentObj.active.filter(
          (i) => !activeLine.includes(i)
        );
      } else {
        currentObj.active.splice(activeIndex, 1);
        if (activeLine[0] === h) {
          // переставить начало смены правее
          currentObj.start.push(activeLine[1]);
        }
      }
      currentObj.start = currentObj.start.filter((i) => i !== h);
    } else {
      let stepValue = targetStart - h;
      if (stepValue > 0) {
        // сдвиг смены на 1-3 часа влево
        currentObj.start = currentObj.start.filter((i) => i !== targetStart);
        currentObj.active = currentObj.active.map((i) => {
          if (i >= targetStart && i <= targetStart + 8) {
            i -= stepValue;
          }
          return i;
        });
        currentObj.start.push(h);
      } else {
        // добавление часа к смене
        currentObj.active.push(h);
      }
    }
  } else {
    // добавление новой смены
    currentObj.start.push(h);
    for (let j = 0; j < 4; j++) {
      currentObj.active.push(h + j);
    }
  }
  console.log("Итоговые данные", currentObj);
  //Запись данных:
  const newPrevDay = { active: [], start: [] };
  const newCurDay = { active: [], start: [] };
  const newNextDay = { active: [], start: [] };
  for (var key in currentObj) {
    const value = currentObj[key];
    value.forEach((i) => {
      if (i < 0) {
        newPrevDay[key].push(hoursFormat(i + 24));
      } else if (i > 23) {
        newNextDay[key].push(hoursFormat(i - 24));
      } else {
        newCurDay[key].push(hoursFormat(i));
      }
    });
  }
  console.log("Новые данные по дням", newPrevDay, newCurDay, newNextDay);
  employer.value.data = employer.value.data.map((i) => {
    if (i.date === d) {
      i.active = newCurDay.active.join("");
      i.start = newCurDay.start.join("");
    } else if (i.date === d - 1) {
      (i.active = newPrevDay.active.join("")),
        (i.start = newPrevDay.start.join(""));
    } else if (i.date === d + 1) {
      (i.active = newNextDay.active.join("")),
        (i.start = newNextDay.start.join(""));
    }
    return i;
  });
  console.log("Новые данные в компоненте", employer.value);
  employesStore.data.employes = employesStore.data.employes.map((i) => {
    if (i.id == route.params.id) {
      i.data = employer.value.data;
    }
    return i;
  });
  localStorage.setItem("employes", JSON.stringify(employesStore.data));
};
//входит ли час в масссив всех  отмеченных часов
const isCover = (hour, data) => {
  if (!data) return false;
  return data.match(/.{1,2}/g).includes(hoursFormat(hour - 1));
};

const changeWeek = (newValue) => {
  curWeek.value = newValue;
  first.value = formatDate(currentMonth.value[curWeek.value][0], true)
}

watch([employerlData,curWeek], () => {
  let data = employerlData.value.employes;
  employer.value = data ? data.find((i) => i.id == route.params.id) : {};
  employerName.value = employer.value ? employer.value.name : '';
  console.log("Данные по текущему работнику из хранилища", employer.value);
});
employesStore.getLocal();


</script>
        
        
<template>
  <main class="content container">
    <div class="content__top">
      <h2 class="content__title">
        <nuxt-link class="content__link" to="/vk-vue/">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M14 16V5L13 6V15H1V3H10L11 2H0V16H14Z" fill="currentColor"/>
            <path d="M16 0H11L12.8 1.8L6 8.6L7.4 10L14.2 3.2L16 5V0Z" fill="currentColor"/>
          </svg>
        </nuxt-link>
        {{ employerName }}
      </h2>
      <div class="content__tab-link tab-link">
        <ul class="tab-link__list">
          <li
            class="tab-link__item"
            :class="{ 'tab-link__item--active': curWeek === index }"
            v-for="(week, index) in currentMonth"
            :key="index"
            @click.prevent="changeWeek(index)"
          >
            {{ formatDate(week[0]) }}-{{ formatDate(week[6]) }}
          </li>
        </ul>
      </div>
    </div>
    <section class="table">
      <div
        class="table__row"
        v-for="(day, index) in currentEmployRender"
        :key="index"
      >
        <div class="table__caption">
          <div class="table__date">
            {{ formatDate(currentMonth[curWeek][index]) }}
          </div>
          <div class="table__weekday">
            {{ employesStore.weekDays[index].title }}
          </div>
        </div>
        <div class="table__hours">
          <div
            class="table__hour"
            v-for="hour in 24"
            :class="{
              'table__hour--chosen': isCover(hour, day.start),
              'table__hour--cover': isCover(hour, day.active),
            }"
            :key="hour"
            @click.prevent="
              doSetHours(
                hoursFormat(hour - 1),
                formatDate(currentMonth[curWeek][index], true)
              )
            "
          >
            {{ hoursFormat(hour - 1) }}
          </div>
        </div>
      </div>
    </section>
  </main>
</template>