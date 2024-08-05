import {store} from '../../..';
import NavigationService from '../../lib/NavigationService';
import * as types from './types';

export function setToken(token) {
  return (dispatch) => {
    dispatch({type: types.SET_TOKEN, payload: token});
  };
}

export function setGateway(gatewayURL, clientDTO) {
  return (dispatch) => {
    dispatch({type: types.SET_CLIENT_GATEWAY, payload: gatewayURL});
    dispatch({type: types.FETCH_CLIENT_DETAILS_SUCCESS, payload: clientDTO});
  };
}

export function setGuid(guid) {
  return (dispatch) => {
    dispatch({type: types.SET_GUID, payload: guid});
  };
}

export function setDashboard(dashboard, userId) {
  return (dispatch) => {
    if (dashboard != null) {
      dispatch({type: types.SET_DB_QUERY, payload: dashboard[0].DBQuery});
      dispatch({type: types.SET_REPORT_ID, payload: dashboard[0].ReportId});
      dispatch({type: types.SET_REPORT_NAME, payload: dashboard[0].ReportName});
      dispatch({
        type: types.FETCH_DASHBOARD_DETAILS_SUCCESS,
        payload: dashboard,
      });
    }
    if (userId != null) {
      dispatch({type: types.SET_LOGIN_ID, payload: userId});
    }
  };
}

export function showVerificationCode(data) {
  return (dispatch) => {
    dispatch({
      type: types.SET_SECURITY_CODE,
      payload: data,
    });
  };
}

export function registerClient(data) {
  return (dispatch) => {
    dispatch({
      type: types.REGISTER_CLIENT_DETAILS_SUCCESS,
      payload: data,
    });
  };
}
