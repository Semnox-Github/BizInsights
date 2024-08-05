import * as types from '../actions/types';

let initialState = {
  clientAppuserId: {},
  clientAppId: null,
  clientAppUserDTO: {},
  clientAppUserLoginDTO: {},
  loginId: null,
  deviceGUID: null,
  isChecked: false,
  hideSecurityCode: false,
  defaultConfig: {},
  userRoleId: -1,
  // securityCode: null,

};
export const user = (state = initialState, action) => {
  switch (action.type) {
    case types.AUTHENTICATE_CLIENT_DETAILS_SUCCESS:
      return {
        ...state,
        clientAppuserId: action.payload,
      };
    case types.SET_LOGIN_ID:
      return {
        ...state,
        loginId: action.payload,
      };

    // case types.FETCH_USER_ROLE_SUCCESS:
    //   return {
    //     ...state,
    //     userRoleId: action.payload,
    //   };

    case types.FETCH_DEFAULT_APP_CONFIGURATION_SUCCESS:
      // console.log('reducer object', action.payload);
      {
        return {
          ...state,
          defaultConfig: action.payload,
        };
      }

    case types.FETCH_USER_ROLE_SUCCESS: {
      return {
        ...state,
        userRoleId: action.payload,
      };
    }

    case types.FETCH_CLIENT_APP_DETAILS_SUCCESS:
      return {
        ...state,
        clientAppId: action.payload,
      };
    case types.REGISTER_CLIENT_DETAILS_SUCCESS:
      return {
        ...state,
        clientAppUserDTO: action.payload,
      };

    case types.LOGIN_CLIENT_DETAILS_SUCCESS:
      return {
        ...state,
        clientAppUserLoginDTO: action.payload,
        isChecked: true,
      };
    case types.SET_GUID:
      return {
        ...state,
        deviceGUID: action.payload,
      };
    case types.HIDE_SECURITY_CODE:
      return {
        ...state,
        hideSecurityCode: action.payload,
      };
    case types.SET_CHECKED:
      return {
        ...state,
        isChecked: action.payload,
      };

    case types.SIGN_OUT_USER_SUCESS:
      return {
        ...state,
      };
    // //added by shobith
    // case types.SET_SECURITY_CODE:
    //   return {
    //     ...state,
    //     securityCode: action.payload,
    //   };

    default:
      return state;
  }
};
