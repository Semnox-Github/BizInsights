import * as types from './types';
import ServiceHandler from '../../services/APIHandler';
import * as Constants from '../../constants';
import { Alert, Platform } from 'react-native';
//import * as GenericMethods from '../../common/'
//import { ClientDTO } from '../lib/model/ClientDTO'
//import PackageJson from '../../../package.json'
import AsyncStorageHanlder from '../../services/AsyncStorageHanlder';
import { ParafaitServer } from '../../constants/ParafaitServer';
import { store } from '../../../index';
import {
  generateDate,
  generateHashCode,
  generateUUID,
  formatCurrency,
} from '../../utilitis';
import { setPushNotificationToken, setInactivePushNotificationToken } from './deviceInfoAcions';
var asyncStorageHandler = new AsyncStorageHanlder();
import NavigationService from '../../lib/NavigationService';
import {
  getTableauDasboard,
  getBusinessStartTime,
  getSalesDashboard,
} from './dashboardActions';
import { config } from '../../constants/parafaitConfig';

export function intialSetUp(deviceGUID, clientDTO, gatewayURL) {
  return (dispatch) => {
    dispatch({ type: types.SET_GUID, payload: deviceGUID });
    dispatch({ type: types.FETCH_CLIENT_DETAILS_SUCCESS, payload: clientDTO });
    dispatch({ type: types.SET_CLIENT_GATEWAY, payload: gatewayURL });
    dispatch(authenticateUser(userId, password));
  };
}

export function authenticateUser(loginId, password) {
  return (dispatch, getState) => {
    let data = {
      LoginId: loginId,
      Password: password,
    };

    dispatch({ type: types.SYSTEM_USER_DETAILS_REQUEST });
    ServiceHandler.post({
      url: Constants.SYSTEM_USER,
      data,
      timeout: ParafaitServer.DEFAULT_TIMEOUT,
    })
      .then((response) => {
        //console.log('responseCheck', response);
        try {
          if (response instanceof Error) throw response;
          if (response.statusCode === 200) {
            // console.log('HelooAuth');
            var UserPkId = response.data.UserPKId;
            dispatch({
              type: types.AUTHENTICATE_CLIENT_DETAILS_SUCCESS,
              payload: response.data.UserPKId,
            });
            dispatch(getUserRole(response.data.UserPKId));
            dispatch(
              authenticateUserNew(
                response.data.UserId,
                response.data.UserPKId,
                response.data?.SiteId,
                loginId,
                password,
              ),
            );
            // console.log('UserPkId1234', UserPkId);
            // Alert.alert('UserPkId');
            // console.log('pkId', response.data.UserPKId);
            dispatch(setPushNotificationToken(null, response.data.UserPKId, config.APP_NAME));
            dispatch();

            //asyncStorageHandler.setItem(Constants.LOGIN_DATE, response.data.userDTO.LastLoginTime.slice(8,10))
          } else {
            //   console.log('errorfound');
            //dispatch({type:types.SET_ERROR_CODE, payload:response.statusCode})
            dispatch({
              type: types.SYSTEM_USER_DETAILS_FAILURE,
              payload: new Error(
                response?.data || Constants.UNKNOWN_ERROR_MESSAGE,
              ),
            });
          }
        } catch (error) {
          // console.log('error3', error);

          //dispatch({type:types.SET_ERROR_CODE, payload:ParafaitServer.ERROR_TYPES.BAD_REQUEST})
          dispatch({
            type: types.SYSTEM_USER_DETAILS_FAILURE,
            payload: error,
          });
        }
      })
      .catch((error) => {
        //console.log('error3', error);

        //dispatch({type:types.SET_ERROR_CODE, payload:ParafaitServer.ERROR_TYPES.REQUEST_TIMEOUT})
        dispatch({
          type: types.SYSTEM_USER_DETAILS_FAILURE,
          payload: error,
        });
      });
  };
}

export function authenticateUserNew(
  userName,
  userId,
  siteId,
  loginId,
  password,
) {
  return (dispatch, getState) => {
    let data = {
      LoginId: loginId,
      Password: password,
      SiteId: siteId,
      MachineName: 'BizInsightLite',
      NewPassword: '',
      TagNumber: '',
    };

    dispatch({ type: types.AUTHENTICATE_CLIENT_DETAILS_REQUEST });
    ServiceHandler.post({
      url: Constants.USER_LOGIN,
      data,
      timeout: ParafaitServer.DEFAULT_TIMEOUT,
    })
      .then((response) => {
        try {
          if (response instanceof Error) throw response;
          if (response.statusCode === 200) {
            // console.log('login success', JSON.stringify(response.data));

            dispatch({
              type: types.SET_LOGIN_ID,
              payload: response.data.UserId,
            });
            asyncStorageHandler.setItem(
              Constants.SET_USER_ID,
              response.data.UserId,
            );

            //  dispatch(getBusinessStartTime(false))
            //  dispatch(getSalesDashboard())
            dispatch(getDefaultAppConfiguration(response.data?.SiteId));
            dispatch(
              getClientApp(loginId, password, userId, response.data?.SiteId),
            );

            asyncStorageHandler.setItem(Constants.USER_NAME, userName);
            asyncStorageHandler.setItem(
              Constants.USER_PASSWORD,
              response.data.LoginId,
            );
            //asyncStorageHandler.setItem(Constants.LOGIN_DATE, response.data.userDTO.LastLoginTime.slice(8,10))
          } else {
            //console.log('error3', response?.data);
            //dispatch({type:types.SET_ERROR_CODE, payload:response.statusCode})
            dispatch({
              type: types.AUTHENTICATE_CLIENT_DETAILS_FAILURE,
              payload: new Error(
                response?.data || Constants.UNKNOWN_ERROR_MESSAGE,
              ),
            });
          }
        } catch (error) {
          // console.log('error3', error);

          //dispatch({type:types.SET_ERROR_CODE, payload:ParafaitServer.ERROR_TYPES.BAD_REQUEST})
          dispatch({
            type: types.AUTHENTICATE_CLIENT_DETAILS_FAILURE,
            payload: error,
          });
        }
      })
      .catch((error) => {
        //console.log('error3', error);

        //dispatch({type:types.SET_ERROR_CODE, payload:ParafaitServer.ERROR_TYPES.REQUEST_TIMEOUT})
        dispatch({
          type: types.AUTHENTICATE_CLIENT_DETAILS_FAILURE,
          payload: error,
        });
      });
  };
}

export const getUserRole = (userId) => {
  //console.log('get user role id ***', userId);
  return (dispatch, getState) => {
    dispatch({ type: types.FETCH_USER_ROLE_REQUEST });
    ServiceHandler.get({
      url: Constants.GET_USER_ROLE,
      data: { queryParameters: { userId: userId } },
      timeout: ParafaitServer.DEFAULT_TIMEOUT,
    })
      .then((response) => {
        try {
          if (response instanceof Error) throw response;
          if (response.statusCode === 200) {
            // console.log('user id *****', response.data);
            // console.log(
            //   'smartfun response ****',
            //   JSON.stringify(response.data[0].RoleId),
            // );
            dispatch({
              type: types.FETCH_USER_ROLE_SUCCESS,
              payload: response.data[0].RoleId,
            });
          } else {
            // dispatch({type:types.SET_ERROR_CODE, payload:response.statusCode})
            dispatch({
              type: types.FETCH_USER_ROLE_FAILURE,
              payload: new Error(
                response?.data || Constants.UNKNOWN_ERROR_MESSAGE,
              ),
            });
          }
        } catch (error) {
          dispatch({
            type: types.FETCH_USER_ROLE_FAILURE,
            payload: error,
          });
        }
      })
      .catch((error) => {
        // dispatch({type:types.SET_ERROR_CODE, payload:ParafaitServer.ERROR_TYPES.REQUEST_TIMEOUT})
        dispatch({
          type: types.FETCH_USER_ROLE_FAILURE,
          payload: error,
        });
      });
  };
};

export function getClientApp(loginId, password, userId, siteId) {
  return (dispatch, getState) => {
    dispatch({ type: types.FETCH_CLIENT_APP_DETAILS_REQUEST });
    ServiceHandler.get({
      url: Constants.CLIENT_APPS,
      data: { queryParameters: { appId: config.APP_ID } },
      timeout: ParafaitServer.DEFAULT_TIMEOUT,
    })
      .then((response) => {
        try {
          if (response instanceof Error) throw response;
          if (response.statusCode === 200) {
            dispatch({
              type: types.FETCH_CLIENT_APP_DETAILS_SUCCESS,
              payload: response.data[0]?.ClientAppId,
            });
            if (
              Object.keys(store.getState().user.clientAppUserDTO).length ===
              0 &&
              store.getState().user.clientAppUserDTO.constructor === Object
            )
              dispatch(registerClientUser(loginId, password, userId, siteId));
            else dispatch(loginUser(loginId, password));
          } else {
            // dispatch({type:types.SET_ERROR_CODE, payload:response.statusCode})
            dispatch({
              type: types.FETCH_CLIENT_APP_DETAILS_FAILURE,
              payload: new Error(
                response?.data || Constants.UNKNOWN_ERROR_MESSAGE,
              ),
            });
          }
        } catch (error) {
          dispatch({
            type: types.FETCH_CLIENT_APP_DETAILS_FAILURE,
            payload: error,
          });
        }
      })
      .catch((error) => {
        // dispatch({type:types.SET_ERROR_CODE, payload:ParafaitServer.ERROR_TYPES.REQUEST_TIMEOUT})
        dispatch({
          type: types.FETCH_CLIENT_APP_DETAILS_FAILURE,
          payload: error,
        });
      });
  };
}

export function registerClientUser(loginId, password, userId, siteId) {
  const guid = store.getState().user.deviceGUID || generateUUID();
  let data = {
    ClientAppUserId: store.getState().user.clientAppuserId,
    ClientAppId: store.getState().user.clientAppId,
    UserId: userId,
    SiteId: siteId,
    IsActive: true,
    CustomerId: -1,
    DeviceGuid: guid,
    DeviceType: Platform.OS === 'android' ? 'android' : 'ios', //'android'
  };

  return (dispatch, getState) => {
    dispatch({ type: types.REGISTER_CLIENT_DETAILS_REQUEST });
    //console.log('registerClientUser', data);
    ServiceHandler.post({
      url: Constants.USER_REGISTER,
      data,
      timeout: ParafaitServer.DEFAULT_TIMEOUT,
    })
      .then((response) => {
        // console.log('registerClientUser2', response);
        try {
          if (response instanceof Error) throw response;
          if (response.statusCode === 200) {
            dispatch({
              type: types.REGISTER_CLIENT_DETAILS_SUCCESS,
              payload: response.data,
            });
            asyncStorageHandler.setItem(
              Constants.REGISTER_CLIENT,
              response.data,
            );
            dispatch(loginUser(loginId, password));
          } else {
            //dispatch({type:types.SET_ERROR_CODE, payload:response.statusCode})
            dispatch({
              type: types.REGISTER_CLIENT_DETAILS_FAILURE,
              payload: new Error(
                response?.data || Constants.UNKNOWN_ERROR_MESSAGE,
              ),
            });
          }
        } catch (error) {
          dispatch({
            type: types.REGISTER_CLIENT_DETAILS_FAILURE,
            payload: error,
          });
        }
      })
      .catch((error) => {
        dispatch({ type: types.REGISTER_CLIENT_DETAILS_FAILURE, payload: error });
      });
  };
}

export function loginUser(loginId, password) {
  let val = store.getState().user.clientAppUserDTO;

  return (dispatch, getState) => {
    dispatch({ type: types.LOGIN_CLIENT_DETAILS_REQUEST });
    ServiceHandler.post({
      url: Constants.LOGIN_USER,
      data: store.getState().user.clientAppUserDTO,
      timeout: ParafaitServer.DEFAULT_TIMEOUT,
    })
      .then((response) => {
        try {
          if (response instanceof Error) throw response;
          if (response.statusCode === 200) {
            dispatch({
              type: types.LOGIN_CLIENT_DETAILS_SUCCESS,
              payload: response.data,
            });
            dispatch({
              type: types.SET_GUID,
              payload: response.data.DeviceGuid,
            });

            asyncStorageHandler.setItem(
              Constants.DEVICE_GUID,
              response.data.DeviceGuid,
            );

            dispatch({
              type: types.HIDE_SECURITY_CODE,
              payload: true,
            });
            asyncStorageHandler.setItem(Constants.SHOW_SECURITY_CODE, true);

            // dispatch(getBusinessStratTime())
            // dispatch(getTableauDasboard())
            asyncStorageHandler
              .getItem(Constants.SET_ON_CHECK)
              .then((checked) => {
                if (checked == 'true') {
                  asyncStorageHandler.setItem(Constants.USER_ID, loginId);
                  asyncStorageHandler.setItem(Constants.PASSWORD, password);
                  asyncStorageHandler.setItem(Constants.SET_AUTH, true);
                } else {
                  asyncStorageHandler.setItem(Constants.USER_ID, '');
                  asyncStorageHandler.setItem(Constants.PASSWORD, '');
                  asyncStorageHandler.setItem(Constants.SET_ON_CHECK, false);
                }
              })
              .catch((error) => { });

            NavigationService.reset({
              index: 0,
              actions: [NavigationService.navActions('HomeScreen')],
            });
          } else {
            //dispatch({type:types.SET_ERROR_CODE, payload:response.statusCode})
            dispatch({
              type: types.LOGIN_CLIENT_DETAILS_FAILURE,
              payload: new Error(
                response?.data || Constants.UNKNOWN_ERROR_MESSAGE,
              ),
            });
          }
        } catch (error) {
          dispatch({ type: types.LOGIN_CLIENT_DETAILS_FAILURE, payload: error });
        }
      })
      .catch((error) => {
        //dispatch({type:types.SET_ERROR_CODE, payload:ParafaitServer.ERROR_TYPES.REQUEST_TIMEOUT})

        dispatch({ type: types.LOGIN_CLIENT_DETAILS_FAILURE, payload: error });
      });
  };
}

export function signoutUser() {
  let val = store.getState().user.clientAppUserDTO;

  return (dispatch, getState) => {
    dispatch({ type: types.SIGN_OUT_USER_REQUEST });
    ServiceHandler.post({
      url: 'api/ClientApp/ClientAppUser/Logout',
      data: store.getState().user.clientAppUserDTO,
      timeout: ParafaitServer.DEFAULT_TIMEOUT,
    })
      .then((response) => {
        try {
          if (response instanceof Error) throw response;
          if (response.statusCode === 200) {
            // console.log("sign out success"+ response.data);

            dispatch({
              type: types.SIGN_OUT_USER_SUCESS,
            });

            asyncStorageHandler.deleteItem(Constants.USER_ID);
            asyncStorageHandler.deleteItem(Constants.PASSWORD);
            asyncStorageHandler.deleteItem(Constants.SET_ON_CHECK);
            dispatch({ type: types.CLEAR_TOKEN });
            asyncStorageHandler.setItem(Constants.LOGIN_TOKEN, null);
            NavigationService.reset({
              index: 0,
              actions: [NavigationService.navActions('RegestrationScreen')],
            });

            //NavigationService.navigate('RegestrationScreen');
          } else {
            //dispatch({type:types.SET_ERROR_CODE, payload:response.statusCode})
            dispatch({
              type: types.SIGN_OUT_USER_FAILURE,
              payload: new Error(
                response.data || Constants.UNKNOWN_ERROR_MESSAGE,
              ),
            });
          }
        } catch (error) {
          dispatch({ type: types.SIGN_OUT_USER_FAILURE, payload: error });
        }
      })
      .catch((error) => {
        //dispatch({type:types.SET_ERROR_CODE, payload:ParafaitServer.ERROR_TYPES.REQUEST_TIMEOUT})

        dispatch({ type: types.SIGN_OUT_USER_FAILURE, payload: error });
      });
  };
}

export function signoutAllUser() {
  let val = store.getState().user.clientAppUserDTO;
  return (dispatch, getState) => {
    dispatch({ type: types.SIGN_OUT_USER_REQUEST });
    ServiceHandler.post({
      url: 'api/ClientApp/ClientAppUser/Logout',
      headers: { queryParameters: { allDevices: true } },
      data: store.getState().user.clientAppUserDTO,
      timeout: ParafaitServer.DEFAULT_TIMEOUT,
    })
      .then((response) => {
        try {
          if (response instanceof Error) throw response;
          if (response.statusCode === 200) {
            dispatch({
              type: types.SIGN_OUT_USER_SUCESS,
            });

            asyncStorageHandler.deleteItem(Constants.USER_ID);
            asyncStorageHandler.deleteItem(Constants.PASSWORD);
            asyncStorageHandler.deleteItem(Constants.SET_ON_CHECK);
            dispatch({ type: types.CLEAR_TOKEN });
            asyncStorageHandler.setItem(Constants.LOGIN_TOKEN, null);
            NavigationService.reset({
              index: 0,
              actions: [NavigationService.navActions('RegestrationScreen')],
            });

            // NavigationService.navigate('RegestrationScreen');
          } else {
            //dispatch({type:types.SET_ERROR_CODE, payload:response.statusCode})
            dispatch({
              type: types.SIGN_OUT_USER_FAILURE,
              payload: new Error(
                response?.data || Constants.UNKNOWN_ERROR_MESSAGE,
              ),
            });
          }
        } catch (error) {
          dispatch({ type: types.SIGN_OUT_USER_FAILURE, payload: error });
        }
      })
      .catch((error) => {
        //dispatch({type:types.SET_ERROR_CODE, payload:ParafaitServer.ERROR_TYPES.REQUEST_TIMEOUT})
        dispatch({ type: types.SIGN_OUT_USER_FAILURE, payload: error });
      });
  };
}

export function getDefaultAppConfiguration(siteId) {
  //console.log('**************');
  return (dispatch, getState) => {
    dispatch({ type: types.FETCH_DEFAULT_APP_CONFIGURATION_REQUEST });
    ServiceHandler.get({
      url: ParafaitServer.DEFAULT_CONFIGURATION,
      data: {
        queryParameters: {
          siteId: siteId,
          userPkId: -1,
          machineId: -1,
          hash: null,
          rebuildCache: false,
        },
      },
      timeout: ParafaitServer.DEFAULT_TIMEOUT,
    })
      .then((response) => {
        try {
          // console.log(' default config ****' + response.data);

          if (response instanceof Error) throw response;
          if (response.statusCode === 200) {
            //let appConfig = new AppAccessDTO(response.data);

            dispatch(setDefaultAppConfiguration(response.data));
            // dispatch({ type: types.FETCH_STRINGS });
          } else {
            dispatch({
              type: types.FETCH_DEFAULT_APP_CONFIGURATION_FAILURE,
              payload: new Error(response.data),
            });
          }
        } catch (error) {
          dispatch({
            type: types.FETCH_DEFAULT_APP_CONFIGURATION_FAILURE,
            payload: error,
          });
        }
      })
      .catch((error) => {
        dispatch({
          type: types.FETCH_DEFAULT_APP_CONFIGURATION_FAILURE,
          payload: error,
        });
      });
  };
}

export function setDefaultAppConfiguration(defaultConfig) {
  //console.log('parameter', defaultConfig?.AMOUNT_FORMAT);

  let defaultLanguage = store.getState().site?.defaultLanguage || -1;

  defaultConfig = defaultConfig.ParafaitDefaultContainerDTOList.reduce(
    (obj, item) =>
      Object.assign(obj, { [item.DefaultValueName]: item.DefaultValue }),
    {},
  );
  var { decimalSeparator, thousandSeparator, decimalScale } = formatCurrency(
    defaultConfig?.AMOUNT_FORMAT,
  );
  var obj = {
    currencySymbol: defaultConfig?.CURRENCY_SYMBOL || '$',
    amountFormat: defaultConfig?.AMOUNT_FORMAT || '#,##0.00',
    decimalSeparator: decimalSeparator,
    thousandSeparator: thousandSeparator,
    decimalScale: decimalScale,
  };

  return (dispatch, getState) => {
    dispatch({
      type: types.FETCH_DEFAULT_APP_CONFIGURATION_SUCCESS,
      payload: obj,
    });
    // if(defaultLanguage!=obj.defaultLanguage&&obj.defaultLanguage!=""&&obj.defaultLanguage!=-1)
    // {

    dispatch({ type: types.SET_DEFAULT_LANGUAGE, payload: obj.defaultLanguage });
    if (obj?.defaultLanguage != -1 && Boolean(obj?.defaultLanguage)) {
      dispatch({ type: types.FETCH_STRINGS });
    }
    if (obj?.securityPolicy != '') {
      dispatch(getSecurityPolicies(obj.securityPolicy));
    }
    //}
  };
}
