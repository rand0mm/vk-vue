import employes from '~~/helpers/employes'


import { acceptHMRUpdate, defineStore } from 'pinia'

export const useEmployesStore = defineStore('employes', {
  state: () => {
    return {
      data: null,
      weekDays: employes.weekDays || [
        { id: 1, title: "Понедельник" },
        { id: 2, title: "Вторник" },
        { id: 3, title: "Среда" },
        { id: 4, title: "Четверг" },
        { id: 5, title: "Пятница" },
        { id: 6, title: "Суббота" },
        { id: 7, title: "Воскресенье" },
      ],
      curDay: null,
      curWeek: null,
      curMonth: null,
      curFirst: null,
    }
  },
  actions: {
    fetchData() {
      setTimeout(() => {
        this.data = !this.data ? employes || {
          employes: [
          ],
          newEmployId: 3,
          weekDays: [
            { id: 1, title: "Понедельник" },
            { id: 2, title: "Вторник" },
            { id: 3, title: "Среда" },
            { id: 4, title: "Четверг" },
            { id: 5, title: "Пятница" },
            { id: 6, title: "Суббота" },
            { id: 7, title: "Воскресенье" },
          ],
        } : this.data;
      }, 100)
    },
    getLocal() {
      let data = localStorage.getItem('employes')
      if (data) {
        this.data = JSON.parse(data)
      }
    }
  },
  getters: {
    getEmployes(state) {
      return state.data
    },
    getDay(state) {
      return state.curDay
    },
    getWeek(state) {
      return state.curWeek
    },
    getMonth(state) {
      return state.curMonth
    },
    getFirst(state) {
      return state.curFirst
    }
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useEmployesStore, import.meta.hot))
}