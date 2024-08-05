import * as types from './types';
import ServiceHandler from '../../services/APIHandler';
import * as Constants from '../../constants';
import AsyncStorageHandler from '../../services/AsyncStorageHanlder';
import { ParafaitServer } from '../../constants/ParafaitServer';
import { store } from '../../../index';
import { fetchBusinessDate } from '../../utilitis';
import DashboardDTo from '../../models/DashboardReportDTO';
import WeeklyCollectionReportDTO from '../../models/WeeklyCollectionReport';
import TodayCollectionReportDTO from '../../models/TodayCollectionReportDTO';
import SalesReportDTO from '../../models/SalesReportDTO';
import { config } from '../../constants/parafaitConfig';
var TOTAL_COLLECTION_SITE_ID = '9999';
var asyncStorageHandler = new AsyncStorageHandler();
const isTableauDashboard = config.ISTABLEUDASHBOARD == 'true' ? true : false;

const tabData = isTableauDashboard
  ? {}
  : { queryParameters: { dashboardType: 'R' } };

export const getSalesDashboard = (userRoleId) => {
  // console.log('user role id ***', userRoleId);
  return (dispatch, getState) =>
    // dispatch({type: types.FETCH_SALES_DASHBOARD_REQUEST});

    ServiceHandler.get({
      url: Constants.SALES_DASHBOARD,
      data: { queryParameters: { roleId: userRoleId } },
      timeout: ParafaitServer.DEFAULT_TIMEOUT,
    })
      .then((response) => {
        try {
          // console.log('statusSalescheck', response);
          if (response instanceof Error) throw response;
          if (response.statusCode === 200) {
            const currentDate = response?.data?.CurrentDate;
            const siteCollectionList = response?.data?.SiteCollectionList;

            var siteList = [];
            var todaySiteList = [];
            var weeklySiteList = [];
            var totalCollection = {};

            if (siteCollectionList?.length > 0) {
              siteCollectionList.forEach((element, index, array) => {
                if (element.hasOwnProperty('WeeklyCollectionPOS')) {
                  let posCollections = [];

                  if (
                    Array.isArray(element.WeeklyCollectionPOS) &&
                    element.WeeklyCollectionPOS.length
                  ) {
                    element.WeeklyCollectionPOS.forEach((ele, index, array) => {
                      posCollections.push(ele);
                    });
                  }

                  element.posCollection = posCollections;
                  let sitCollection = new SalesReportDTO(element);
                  let weeklyCollection = new WeeklyCollectionReportDTO(element);
                  let todayCollection = new TodayCollectionReportDTO(element);

                  if (sitCollection.SiteId != TOTAL_COLLECTION_SITE_ID) {
                    siteList.push(sitCollection);
                    weeklySiteList.push(weeklyCollection);
                    todaySiteList.push(todayCollection);
                  } else {
                    totalCollection = sitCollection;
                    dispatch({
                      type: types.FETCH_CURRENT_DATE,
                      payload: currentDate,
                    });
                    dispatch({
                      type: types.FETCH_TOTAL_COLLECTION,
                      payload: totalCollection,
                    });
                  }
                }
              });
            }

            dispatch({
              type: types.SET_TODAY_COLLECTION,
              payload: todaySiteList,
            });
            dispatch({
              type: types.SET_WEEKLY_COLLECTION,
              payload: weeklySiteList,
            });

            dispatch({
              type: types.FETCH_SALES_DASHBOARD_SUCCESS,
              payload: siteList,
            });
          } else {
            dispatch({
              type: types.FETCH_SALES_DASHBOARD_FAILURE,
              payload: null,
            });
          }
        } catch (error) {
          dispatch({ type: types.FETCH_START_TIME_FAILURE, payload: null });
        }
      })
      .catch((error) => {
        dispatch({ type: types.FETCH_START_TIME_FAILURE, payload: null });
      });
};

export const getBusinessStartTime = (showLoader = true) => {
  return (dispatch, getState) => {
    if (showLoader) dispatch({ type: types.FETCH_START_TIME_REQUEST });
    ServiceHandler.get({
      url: Constants.PARAFAIT_DEFAULTS,
      data: {
        queryParameters: {
          defaultValueName: Constants.BUSINESS_DAY_START_TIME,
          isActive: Constants.isActive,
        },
      },
      timeout: ParafaitServer.DEFAULT_TIMEOUT,
    })
      .then((response) => {
        try {
          if (response instanceof Error) throw response;
          if (response.statusCode === 200 && response.data[0]?.DefaultValue) {
            dispatch({
              type: types.FETCH_START_TIME_SUCCESS,
              payload: response.data[0]?.DefaultValue ?? 6,
            });
            asyncStorageHandler.setItem(
              Constants.SET_START_TIME,
              response.data[0]?.DefaultValue,
            );
            dispatch(getTableauDashboard(showLoader));
          } else {
            dispatch({ type: types.FETCH_START_TIME_FAILURE, payload: null });

            dispatch(getTableauDashboard(showLoader));
          }
        } catch (error) {
          dispatch({ type: types.FETCH_START_TIME_FAILURE, payload: null });
          dispatch(getTableauDashboard(showLoader));
        }
      })
      .catch((error) => {
        dispatch({ type: types.FETCH_START_TIME_FAILURE, payload: null });
        dispatch(getTableauDashboard(showLoader));
      });
  };
};

export const getTableauDashboard = (showLoader = true) => {
  return (dispatch, getState) => {
    if (showLoader) dispatch({ type: types.FETCH_DASHBOARD_DETAILS_REQUEST });
    ServiceHandler.get({
      url: Constants.TABLEU_DASHBOARD,
      data: Boolean(JSON.parse(config.ISTABLEUDASHBOARD))
        ? {}
        : { queryParameters: { dashboardType: 'R' } },
      timeout: ParafaitServer.DEFAULT_TIMEOUT,
    })
      .then((response) => {
        try {
          if (response instanceof Error) throw response;
          if (response.statusCode === 200) {
            if (!Object.keys(response.data).length) {
              // dispatch({
              //   type: types.SET_ERROR_CODE,
              //   payload: ParafaitServer.ERROR_TYPES.USER_DEFINED_ALERT,
              // });
              // if (!showLoader)
              //   throw new Error(Constants.UPDATE_DASHBOARD_ERROR);
              // else throw new Error(Constants.DASHBOARD_NOTFOUND_ERROR);
            } else {
              const dashboardResponse = response.data.map(
                (data) => new DashboardDTo(data),
              );

              dashboardResponse.unshift(
                new DashboardDTo({
                  ReportId: -1,
                  ReportName: 'Home',
                  DBQuery: null,
                }),
              );

              dispatch(setDashBoardToStore(dashboardResponse));
            }
          } else {
            dispatch({
              type: types.FETCH_DASHBOARD_DETAILS_FAILURE,
              payload: new Error(
                response?.data || Constants.UNKNOWN_ERROR_MESSAGE,
              ),
            });
          }
        } catch (error) {
          dispatch({
            type: types.FETCH_DASHBOARD_DETAILS_FAILURE,
            payload: error,
          });
        }
      })
      .catch((error) => {
        dispatch({ type: types.FETCH_DASHBOARD_DETAILS_FAILURE, payload: error });
      });
  };
};

export const getTableauToken = (reportId, dbQuery) => {
  return (dispatch, getState) => {
    if (isTableauDashboard) {
      dispatch({ type: types.FETCH_TOKEN_REQUEST });
      dispatch({ type: types.STORE_REPORT_ID, payload: reportId });
      dispatch({ type: types.STORE_DB_QUERY, payload: dbQuery });
      ServiceHandler.get({
        url: Constants.DASHBOARD_TOKEN,
        data: {
          queryParameters: {
            reportId: reportId,
            deviceGuid: store.getState().user.deviceGUID,
          },
        },
        timeout: ParafaitServer.DEFAULT_TIMEOUT,
      })
        .then((response) => {
          try {
            if (response instanceof Error) throw response;
            if (response.statusCode === 200) {
              let token = response?.data?.data || response?.data;

              dispatch({
                type: types.FETCH_TOKEN_SUCCESS,
                payload: response.data,
              });
              dispatch(setURL(token, dbQuery));
            } else {
              dispatch({
                type: types.FETCH_TOKEN_FAILURE,
                payload: new Error(
                  response?.data || Constants.UNKNOWN_ERROR_MESSAGE,
                ),
              });
            }
          } catch (error) {
            dispatch({ type: types.FETCH_TOKEN_FAILURE, payload: error });
          }
        })
        .catch((error) => {
          dispatch({ type: types.FETCH_TOKEN_FAILURE, payload: error });
        });
    } else {
      dispatch(setUrlTelerik(dbQuery));
    }
  };
};

export function setUrlTelerik(dbQuery) {
  return (dispatch, getState) => {
    let { formatedDate, formatedTime } = fetchBusinessDate();

    let loginId = store.getState().user.loginId;

    let reportURL = dbQuery;

    reportURL = reportURL.replace('@User', loginId);
    reportURL = reportURL.replace('@Date', formatedDate);
    reportURL = reportURL.replace('@Time', formatedTime);

    dispatch({ type: types.FETCH_TABLEU_URL_REQUEST });
    dispatch({ type: types.SET_WEB_VIEW_URL, payload: reportURL });
  };
}

export function setURL(token, dbQuery) {
  return (dispatch, getState) => {
    let { formatedDate, formatedTime } = fetchBusinessDate();
    let loginId = store.getState().user.loginId;
    let reportURL = dbQuery;
    reportURL = reportURL.replace('@Token', token);
    reportURL = reportURL.replace('@User', loginId);
    reportURL = reportURL.replace('@Date', formatedDate);
    reportURL = reportURL.replace('@Time', formatedTime);
    dispatch({ type: types.FETCH_TABLEU_URL_REQUEST });
    dispatch({ type: types.SET_WEB_VIEW_URL, payload: reportURL });
  };
}

export function onLoadURL() {
  return (dispatch, getState) => {
    dispatch({ type: types.FETCH_TABLEU_URL_SUCCESS });
  };
}

export function setDashBoardToStore(response) {
  return (dispatch) => {
    response.sort((a, b) => a.ReportId - b.ReportId);
    dispatch({ type: types.SET_DB_QUERY, payload: response[0].DBQuery });
    dispatch({ type: types.SET_REPORT_ID, payload: response[0].ReportId });
    dispatch({ type: types.SET_REPORT_NAME, payload: response[0].ReportName });
    dispatch({ type: types.FETCH_DASHBOARD_DETAILS_SUCCESS, payload: response });
  };
}

export function handleDashboardUpdate(data) {
  return (dispatch) => {
    dispatch({ type: types.UPDATE_REQUIRED, payload: data });
  };
}

export function selectedDashboardDetails(reportId, dbQuery) {
  return (dispatch) => {
    dispatch({ type: types.SET_REPORT_ID, payload: reportId });
    dispatch({ type: types.SET_DB_QUERY, payload: dbQuery });
  };
}

export function checkDashboardEqual(data, storedata) {
  data.sort((a, b) => a.ReportId - b.ReportId);

  return (
    data.length === storedata.length &&
    data.every((o, idx) => objectsEqual(o, storedata[idx]))
  );
}

export function objectsEqual(o1, o2) {
  return typeof o1 === 'object' && Object.keys(o1).length > 0
    ? Object.keys(o1).length === Object.keys(o2).length &&
    Object.keys(o1).every((p) => objectsEqual(o1[p], o2[p]))
    : o1 === o2;
}

export function asyncRequest() {
  return {
    type: types.ASYNC_REQUEST,
  };
}

export function asyncSuccess() {
  return {
    type: types.ASYNC_SUCCESS,
  };
}

export function asyncFailure(error) {
  return {
    type: types.ASYNC_FAILURE,
    payload: error,
  };
}
