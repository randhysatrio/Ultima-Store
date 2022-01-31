const init_state = {
  id: 0,
  firstname: '',
  lastname: '',
  username: '',
  email: '',
  password: '',
  telephone: '',
  address: '',
  profilePic: '',
  fullnamePref: false,
  checkoutDataPref: false,
  checkoutItems: [],
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
