import ServiceHandler from '../../services/APIHandler';
import * as Constants from '../../constants';
import { ParafaitServer } from '../../constants/ParafaitServer';
import { generateDate, generateHashCode } from '../../utilitis';
import NavigationService from '../../lib/NavigationService';
import * as types from './types';
import { config } from '../../constants/parafaitConfig';
// import * as Constants from '../../constants'

export const updateRequired = (deprecated) => {
  // console.log("update required ", response?.data.Deprecated)
  return (dispatch) => {
    dispatch({ type: types.SET_DEPRECATED, payload: deprecated });
  };
};

const setLastUpdatedTime = (response) => {
  return (dispatch) => {
    dispatch({ type: types.LAST_UPDATED_TIME, payload: new Date() });
    if (response?.data.Deprecated == '') {
      dispatch(updateRequired(response?.data.Deprecated));
    }
  };
};

export const checkForUpdate = (securitycode) => {
  return async (dispatch) => {
    let securityCode = securitycode.slice(-2);
    const currentTime = generateDate();
    const hashedVal = generateHashCode(
      config.APP_ID,
      securitycode,
      currentTime,
    );

    try {
      const response = await ServiceHandler.post({
        url: Constants.CLIENT_APP_VERSION,
        headers: {
          queryParameters: {
            appId: config.APP_ID,
            buildNumber: config.VERSION,
            generatedTime: currentTime,
            securityCode: securityCode,
          },
        },
        data: { codeHash: hashedVal },
        timeout: ParafaitServer.DEFAULT_TIMEOUT,
      });

      if (response?.statusCode == 200) {
        dispatch(setLastUpdatedTime(response));
      }
    } catch (error) { }
  };
};

export const checkValidToken = async () => {
  try {
    const response = await ServiceHandler.get({
      url: Constants.CLIENT_APPS,
      data: { queryParameters: { appId: config.APP_ID } },
      timeout: ParafaitServer.DEFAULT_TIMEOUT,
    });

    if (response?.statusCode == 200) {
      NavigationService.reset({
        index: 0,
        actions: [NavigationService.navActions('HomeScreen')],
      });
    } else {
      NavigationService.reset({
        index: 0,
        actions: [NavigationService.navActions('RegestrationScreen')],
      });
    }
  } catch (error) {
    const errorMessage = `Request to ${url} failed with status ${response?.status}: ${error.message}`;
    // console.log('errorMessage', errorMessage);
    firebase.crashlytics().recordError(new Error(errorMessage));
  }
};
