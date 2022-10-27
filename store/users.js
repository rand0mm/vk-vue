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
  loadedFriendInfoData: null,
  toLoadFriendData: null,
  isLoading: false,

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
  loadedFriendInfoData(state) {
    return state.loadedFriendInfoData ? state.loadedFriendInfoData : [];
  },
  toLoadFriendData(state) {
    return state.toLoadFriendData && state.isShowFriendsData ? state.toLoadFriendData : [];
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
  setToLoadFriendData(state, value) {
    state.toLoadFriendData = value;
  },
  setFriendInfo(state, value) {
    if (state.friendsData[value.id]) {
      state.friendsData[value.id].friendsCount = value.value;
    }
    localStorage.setItem('friends', JSON.stringify(state.friendsData));
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
    const toLoadFriendData = localStorage.getItem('toLoadFriendData');
    if (toLoadFriendData) {
      commit('setToLoadFriendData', JSON.parse(toLoadFriendData));
    }
  },
  loadFriendsInfo({ commit, state }) {
    const arr = Object.values(state.friendsData);
    commit('setToLoadFriendData', arr.filter((i) => !i.friendsCount).sort((a, b) => (a.first_name + a.last_name
      > b.first_name + b.last_name ? 1 : -1)));
    localStorage.setItem('toLoadFriendData', JSON.stringify(arr));
  },
  syncFriendList({ commit, state }) {
    const friendsObj = {};
    let cross = 0;
    const users = state.selectedUSersData.map((i) => i.id);
    let friendsArr = JSON.parse(JSON.stringify(Object.values(state.friendsData)));
    friendsArr = friendsArr.map((i) => {
      i.cross = i.cross.filter((x) => users.includes(x));
      if (i.cross.length > cross) cross = i.cross.length;
      return i;
    }).filter((i) => i.cross.length);
    friendsArr.map((i) => {
      friendsObj[i.id] = i;
      return i;
    });
    commit('setFriends', friendsObj);
    commit('setIsShowFriends', friendsArr.length > 0);
    commit('setMaxCross', JSON.parse(cross));
    localStorage.setItem('friends', JSON.stringify(friendsObj));
    localStorage.setItem('cross', JSON.stringify(cross));
    localStorage.setItem('showFriends', JSON.stringify(friendsArr.length > 0));

    let arr = Object.values(friendsObj);
    arr = arr.filter((i) => !i.friendsCount).sort((a, b) => (a.first_name + a.last_name
      > b.first_name + b.last_name ? 1 : -1));
    commit('setToLoadFriendData', arr);
    localStorage.setItem('toLoadFriendData', JSON.stringify(arr));
  },
};
