export const mutations = {
    changeUserStatus(state, param) {
        state.user[param.name] = param.val;
    },
    changeDetailedStatus(state, param) {
        state.detailed[param.name] = param.val;
    }
  }
  