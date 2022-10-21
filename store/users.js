/* eslint-disable no-shadow */
/* eslint-disable no-param-reassign */
function getAge(dateString) {
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
}
export const state = () => ({
  selectedUSersData: null,
  friendsData: {},
  maxCrossData: null,
  isShowFriendsData: false,
});

export const getters = {
  selectedUSers(state) {
    return state.selectedUSersData ? state.selectedUSersData.map((i) => ({
      id: i.id,
      name: i.name,
      photo: i.photo,
      sex: i.sex,
      access: i.access,
      friendsCount: i.access ? i.friendsCount : 'Нет доступа',
      age: getAge(i.bdate),
      bdate: i.bdate,
    })) : [];
  },
  friends(state) {
    return state.friendsData; // {['id']: {name:'example'}}
  },
  maxCross(state) {
    return state.maxCrossData ? state.maxCrossData : 0; // маскимальное значение пересечения
  },
  isShowFriends(state) {
    return state.isShowFriendsData;
  },

};

export const mutations = {
  setSelectedUSers(state, value) {
    state.selectedUSersData = value;
  },
  setFriends(state, value) {
    state.friendsData = value;
  },
  setMaxCross(state, value) {
    state.maxCrossData = value;
  },
  setIsShowFriends(state, value) {
    state.isShowFriendsData = value;
  },
};

export const actions = {
  getLocal({ commit }) {
    const users = localStorage.getItem('users');
    if (users) {
      commit('setSelectedUSers', JSON.parse(users));
    }
    const friends = localStorage.getItem('friends');
    if (friends) {
      commit('setFriends', JSON.parse(friends));
    }
    const cross = localStorage.getItem('cross');
    if (cross) {
      commit('setMaxCross', JSON.parse(cross));
    }
    const showFriends = localStorage.getItem('showFriends');
    if (showFriends) {
      commit('setIsShowFriends', JSON.parse(showFriends));
    }
  },
};
