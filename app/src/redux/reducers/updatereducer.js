import * as types from '../actions/types';

let initialState = {
  userName: null,
  password: null,
  securityCode: 'ABCE1235',
};

export const update = (state = initialState, action) => {
  switch (action.type) {
    case types.SET_USER_ID:
      return {
        ...state,
        userName: action.payload,
      };
    case types.SET_USER_PASSWORD:
      return {
        ...state,
        password: action.payload,
      };

    default:
      return state;
  }
};
