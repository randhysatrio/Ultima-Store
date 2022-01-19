const init_state = {
  id: 0,
  username: '',
  firstname: '',
  lastname: '',
  role: '',
};

const userReducer = (state = init_state, action) => {
  switch (action.type) {
    case 'USER_REGISTER':
      return { ...state, ...action.payload };
    case 'USER_LOGOUT':
      return init_state;
    default:
      return state;
  }
};

export default userReducer;
