import * as Constants from '../constants';
import { store } from '../../index';
import * as GenericMethods from '../common';
import * as types from '../../src/redux/actions/types';
import axios from 'axios';
// import { UserLogDTO } from "../model/UserLogDTO";
import AsyncStorageHanlder from '../services/AsyncStorageHanlder';
import { config } from '../constants/parafaitConfig';

import { ParafaitServer } from '../constants/ParafaitServer';
import { firebase } from "@react-native-firebase/crashlytics";

var asyncStorageHandler = new AsyncStorageHanlder();

function getQueryUrl(params) {
  var esc = encodeURIComponent;
  return Object.keys(params)
    .map((k) => esc(params[k]))
    .join('/');
}

function getQueryString(params) {
  var esc = encodeURIComponent;
  return Object.keys(params)
    .map((k) => {
      if (params[k] != null && params[k].constructor === Array) {
        let str = '';
        params[k].forEach((element, index) => {
          index === params[k].length - 1
            ? (str += esc(k) + '=' + esc(element))
            : (str += esc(k) + '=' + esc(element) + '&');
        });
        return str;
      } else return esc(k) + '=' + esc(params[k]);
    })
    .join('&');
}

function request(params, sendLogs = true) {
  var method = params.method || 'GET';
  var qs = '';
  var body;
  var host = config.ParafaitCentralUrlHost; //ParafaitServer.PUBLIC_SERVER_IP_PRODUCTION; //ParafaitServer.PUBLIC_SERVER_IP_LOCAL
  var tempParams = JSON.parse(JSON.stringify(params));
  // var requestTimeout = (!GenericMethods.IsUndefined(store.getState().appConfig)) ? store.getState().appConfig.idleTimeout * 1000 : params.timeout || Constants.REQUEST_TIMEOUT;
  var requestTimeout = params.timeout || Constants.REQUEST_TIMEOUT;

  var headers = {
    Accept: 'application/json',
    //  Origin: "mQ/btZP6wd74Sgd59JETzEtAkBO8QIL4KpE2pjz9hRg=",
    'Content-Type': 'application/json',
  };
  if (params.url.includes('/ClientApp/ClientAppVersion')) {
    headers = {
      Accept: 'application/json',
      Origin: 'mQ/btZP6wd74Sgd59JETzEtAkBO8QIL4KpE2pjz9hRg=',
      'Content-Type': 'application/json',
    };
  }

  if (!GenericMethods.objectIsEmpty(store.getState().client.clientDTO)) {
    if (store.getState().client.clientGateway !== null) {
      if (params.url.includes('/ClientApp/ClientAppVersion')) {
        //  console.log('TRUECheck');
        host = config.ParafaitCentralUrlHost;
        headers = {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Origin: "mQ/btZP6wd74Sgd59JETzEtAkBO8QIL4KpE2pjz9hRg=",
        }; //ParafaitServer.PUBLIC_SERVER_IP_PRODUCTION;
      } else {
        host = store.getState().client.clientGateway;
        //console.log('hostCheck', host);
        headers = {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          // Origin: "mQ/btZP6wd74Sgd59JETzEtAkBO8QIL4KpE2pjz9hRg=",
        };
      }
      // host='http://localhost:506/api'



      if (
        store.getState().deviceInfo.token !== null &&
        method !== 'POST_NOAUTH'
      ) {
        if (params.url.includes('AuthenticateSystemUsers')) {
          // console.log('authenticate users *****');

          headers = {
            Accept: 'application/json',
            // 'Origin': 'mQ/btZP6wd74Sgd59JETzEtAkBO8QIL4KpE2pjz9hRg=',
            'Content-Type': 'application/json',
          };
        } else {
          headers = {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            // Origin: "mQ/btZP6wd74Sgd59JETzEtAkBO8QIL4KpE2pjz9hRg=",
            Authorization: store.getState().deviceInfo.token,
          };
        }
      }
    }
  }

  var queryParameters = {};
  var hashParam = '';
  if (['GET', 'DELETE', 'POST_NOAUTH'].indexOf(method) > -1) {
    if (!GenericMethods.objectIsEmpty(params.data)) {
      if (
        !GenericMethods.IsUndefined(params.data.queryParameters) &&
        !GenericMethods.objectIsEmpty(params.data.queryParameters)
      ) {
        queryParameters = params.data.queryParameters;
        delete params.data.queryParameters;
      }
      if (!GenericMethods.objectIsEmpty(params.data))
        qs = '/' + getQueryUrl(params.data);

      if (!GenericMethods.objectIsEmpty(queryParameters)) {
        // hashParam = getQueryString(queryParameters);
        // qs += "?" + hashParam;
        qs += '?' + getQueryString(queryParameters);
      }
    }
    if (method === 'POST_NOAUTH') method = 'POST';
  } // POST or PUT
  else if (params.headers) {
    if (!GenericMethods.objectIsEmpty(params.headers)) {
      if (
        !GenericMethods.IsUndefined(params.headers.queryParameters) &&
        !GenericMethods.objectIsEmpty(params.headers.queryParameters)
      ) {
        queryParameters = params.headers.queryParameters;
        delete params.headers.queryParameters;
      }
      if (!GenericMethods.objectIsEmpty(params.headers))
        qs = '/' + getQueryUrl(params.headers);

      if (!GenericMethods.objectIsEmpty(queryParameters)) {
        // hashParam = getQueryString(queryParameters);
        // qs += "?" + hashParam;
        qs += '?' + getQueryString(queryParameters);
      }
    }
    body = params.data;
  } else body = JSON.stringify(params.data);

  var url = GenericMethods.buildURL([host, params.url + qs]);

  // if (method === "GET" && !GenericMethods.IsUndefined(hashParam)) {
  //   return GenericMethods.cryptoES(hashParam)
  //     .then((CheckSum) => {
  //       if (CheckSum != null) {
  //         headers.CheckSum = CheckSum;
  //       }
  //       return callRestServices(
  //         sendLogs,
  //         host,
  //         method,
  //         url,
  //         headers,
  //         body,
  //         qs,
  //         requestTimeout,
  //         tempParams
  //       );
  //     })
  //     .catch((error) => { });
  // } else if (method === "POST" && !GenericMethods.IsUndefined(body)) {
  //   return GenericMethods.cryptoES(body)
  //     .then((CheckSum) => {
  //       if (CheckSum != null) {
  //         headers.CheckSum = CheckSum;
  //       }
  //       return callRestServices(
  //         sendLogs,
  //         host,
  //         method,
  //         url,
  //         headers,
  //         body,
  //         qs,
  //         requestTimeout,
  //         tempParams
  //       );
  //     })
  //     .catch((error) => { });
  // } else {
  //   return callRestServices(
  //     sendLogs,
  //     host,
  //     method,
  //     url,
  //     headers,
  //     body,
  //     qs,
  //     requestTimeout,
  //     tempParams
  //   );
  // }
  return callRestServices(
    sendLogs,
    host,
    method,
    url,
    headers,
    body,
    qs,
    requestTimeout,
    tempParams,
  );
}

function callRestServices(
  sendLogs,
  host,
  method,
  url,
  headers,
  body,
  qs,
  requestTimeout,
  tempParams,
) {
  //console.log('url ********', url, body);
  // console.log('body*****', body);
  return axios({
    method: method,
    url: url,
    headers: headers,
    data: body,
    timeout: requestTimeout,
  })
    .then((response) => {
      if (response.status === 200) {
        if (
          response.config.url.indexOf(ParafaitServer.LOGIN_SYSTEM_USER) > -1
        ) {
          store.dispatch(setToken(response.data.data.WebApiToken));
          asyncStorageHandler.setItem(
            Constants.LOGIN_TOKEN,
            response.data.data.WebApiToken,
          );
        } else if (
          response.config.url.indexOf(ParafaitServer.AUTHENTICATE_USER) > -1
        ) {
          if (!GenericMethods.IsUndefined(response.headers.authorization)) {
            store.dispatch(setToken(response.headers.authorization));
            asyncStorageHandler.setItem(
              Constants.LOGIN_TOKEN,
              response.headers.authorization,
            );
          } else if (!GenericMethods.IsUndefined(response.data.token)) {
            store.dispatch(setToken(response.data.token));
            asyncStorageHandler.setItem(
              Constants.LOGIN_TOKEN,
              response.data.token,
            );
          }
        }
        store.dispatch(setErrorType(response.status));
      }
      return {
        data: response.data.data || response.data,
        statusCode: response?.status,
        barCode: GenericMethods.IsUndefined(response.data.barCode)
          ? null
          : 'data:image/png;base64,' + response.data.barCode,
      };
    })
    .catch((error) => {
      const { request, response } = error;

      const errorMessage = `Request to ${url} failed with status ${response?.status}: ${error.message}`;
      //console.log('errorMessage', errorMessage);
      firebase.crashlytics().recordError(new Error(errorMessage));
      store.dispatch(setErrorType(response?.status || 503));

      return {
        data: response.data.data || response.data,
        statusCode: response?.status,
      };
    });
  // }
}

function setToken(token) {
  return {
    type: types.SET_TOKEN,
    payload: token,
  };
}

function setErrorType(errorCode) {
  return {
    type: types.SET_ERROR_CODE,
    payload: errorCode,
  };
}

function userlogs(params, url, headers, body, qs, requestTimeout) {
  let data = new UserLogDTO({
    Id: -1,
    CustomerId: store.getState().customer.customerDTO.id || -1,
    Controller: params.url,
    Action: params.method,
    IsActive: true,
    VariableState: params.method === 'POST' ? body : qs,
    Message: '',
    Uuid: store.getState().deviceInfo.uuid || '',
    SiteId: store.getState().site.selectedSite.siteId || -1,
  });
  // console.log(data);
  return axios({
    method: 'POST',
    url: url + '/' + ParafaitServer.USER_LOG,
    headers: headers,
    data: data,
    timeout: requestTimeout,
  })
    .then((response) => {
      if (!GenericMethods.IsUndefined(response.data.token))
        store.dispatch(setToken(response.data.token));
      return request(params, false);
    })
    .catch((error) => {
      const { response } = error;
      // const errorMessage = `Request to ${url} failed with status ${response?.status}: ${error.message}`;
      // console.log('errorMessage', errorMessage);
      // firebase.crashlytics().recordError(new Error(errorMessage));
      if (!GenericMethods.IsUndefined(response.data.token))
        return request(params, false);
    });
}

function logUserAction(controller, userAction, state, message) {
  let host = store.getState().client.clientGateway + '/api';
  let headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    // Origin: "mQ/btZP6wd74Sgd59JETzEtAkBO8QIL4KpE2pjz9hRg=",
    Authorization: store.getState().deviceInfo.token,
  };
  let data = new UserLogDTO({
    Id: -1,
    CustomerId: store.getState().customer.customerDTO.id || -1,
    Controller: controller,
    Action: userAction,
    IsActive: true,
    VariableState: state,
    Message: message,
    Uuid: store.getState().deviceInfo.uuid || '',
    SiteId: store.getState().site.selectedSite.siteId || -1,
  });
  axios({
    method: 'POST',
    url: host + '/' + ParafaitServer.USER_LOG,
    headers: headers,
    data: data,
    timeout: ParafaitServer.DEFAULT_TIMEOUT,
  })
    .then((response) => {
      if (!GenericMethods.IsUndefined(response.data.token))
        store.dispatch(setToken(response.data.token));
    })
    .catch((error) => {
      const { response } = error;
      const errorMessage = `Request to ${url} failed with status ${response?.status}: ${error.message}`;
      //console.log('errorMessage', errorMessage);
      firebase.crashlytics().recordError(new Error(errorMessage));
      if (!GenericMethods.IsUndefined(response.data.token))
        store.dispatch(setToken(response.data.token));
    });
}

export default {
  get: (params) => request(Object.assign({ method: 'GET' }, params)),
  post: (params) => request(Object.assign({ method: 'POST' }, params)),
  put: (params) => request(Object.assign({ method: 'PUT' }, params)),
  delete: (params) => request(Object.assign({ method: 'DELETE' }, params)),
  postWithOutAuth: (params) =>
    request(Object.assign({ method: 'POST_NOAUTH' }, params)),
  logUserAction,
};
