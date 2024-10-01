import * as types from '../actions/types';

let initialState = {
  clientDTO: {},
  clientGateway: {},
  deprecated: '',
  securityCode: null,
  lastClientUpdated: null,
  isVerificationCodeChanged: false
};
export const client = (state = initialState, action) => {
  switch (action.type) {
    case types.FETCH_CLIENT_DETAILS_SUCCESS:
      return {
        ...state,
        clientDTO: action.payload,
      };
    case types.SET_CLIENT_GATEWAY:
      return {
        ...state,
        clientGateway: action.payload,
      };

    case types.IS_VERIFICATION_CODE_CHANGED:
      console.log('isVerificationCodeChangedINreducer', action.payload);

      return {
        ...state,
        isVerificationCodeChanged: action.payload,
      };

    case types.SET_SECURITY_CODE:
      return {
        ...state,
        securityCode: action.payload,
      };
    case types.SET_DEPRECATED:
      return {
        ...state,
        deprecated: action.payload,
      };

    case types.CLEAR_CLIENT:
      return {
        ...state,
        initialState,
      };
    case types.LAST_UPDATED_TIME:
      //  console.log("last client updated ",action.payload )
      return {
        ...state,
        lastClientUpdated: action.payload,
      };
    default:
      return state;
  }
};
