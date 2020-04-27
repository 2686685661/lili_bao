export const mutations = {
    changeUserStatus(state, param) {
        state.user[param.name] = param.val;
    }
  }
  