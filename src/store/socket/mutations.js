export default {
  setOnlineUser (state, { onlineUser }) {
    if (onlineUser && onlineUser.length) {
      state.onlineUser = onlineUser
    }
  }
}
