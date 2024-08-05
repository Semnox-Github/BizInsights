import * as types from '../actions/types';
import {ParafaitServer} from '../../constants/ParafaitServer';

const initalState = {
  currentScreen: null,
  loading: false,
  error: null,
  errorCode: ParafaitServer.ERROR_TYPES.NONE,
  errorStatus: null,
};

export const ui = (state = initalState, action) => {
  const {type, payload} = action;
  const matches = /(.*)_(REQUEST|SUCCESS|FAILURE)/.exec(type);

  if (matches) {
    const [, requestName, requestState] = matches;
    switch (requestState) {
      case 'REQUEST':
        return {
          ...state,
          loading: true,
          error: null,
          errorCode: ParafaitServer.ERROR_TYPES.NONE,
        };
      case 'SUCCESS':
        return {
          ...state,
          loading: false,
          error: null,
          errorCode: ParafaitServer.ERROR_TYPES.NONE,
        };
      case 'FAILURE':
        return {
          ...state,
          loading: false,
          error: payload,
          errorStatus: payload,
        };
      default:
        return state;
    }
  } else {
    switch (type) {
      case types.SET_CURRENT_SCREEN:
        return {
          ...state,
          currentScreen: payload,
          loading: false,
          error: null,
          errorCode: ParafaitServer.ERROR_TYPES.NONE,
        };
      case types.RESET_UI:
        return {
          ...state,
          currentScreen: null,
          loading: false,
          error: null,
          errorCode: ParafaitServer.ERROR_TYPES.NONE,
        };
      case types.SET_ERROR_CODE:
        return {
          ...state,
          errorCode: payload,
        };
      default:
        return state;
    }
  }
};
