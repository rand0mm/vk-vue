/* eslint-disable no-shadow */
/* eslint-disable no-param-reassign */
export const state = () => ({
  selectedUSersData: null,
});

export const getters = {
  selectedUSers(state) {
    return state.selectedUSersData ? state.selectedUSersData : [];
  },
};

export const mutations = {
  setSelectedUSers(state, value) {
    state.selectedUSersData = value;
  },
};

export const actions = {
};
