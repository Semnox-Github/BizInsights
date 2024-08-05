import * as types from '../actions/types';

let initialState = {
  uuid: null,
  token: null,
  deviceValidity: false,
  lastUsedTime: null,
};

export const deviceInfo = (state = initialState, action) => {
  switch (action.type) {
    case types.SET_UUID:
      return {
        ...state,
        uuid: action.payload,
      };
    case types.SET_TOKEN:
      // console.log('token value *****', action.payload);
      return {
        ...state,
        token: action.payload,
      };
    case types.CLEAR_TOKEN:
      return {
        ...state,
        token: null,
      };
    case types.FETCH_APP_VALIDITY_SUCCESS:
      return {
        ...state,
        deviceValidity: true,
      };
    case types.SET_LAST_USED_TIME:
      return {
        ...state,
        lastUsedTime: action.payload,
      };
    default:
      return state;
  }
};
