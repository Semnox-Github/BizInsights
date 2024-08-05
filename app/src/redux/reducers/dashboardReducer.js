import * as types from '../actions/types';
import dateFormat, { masks } from "dateformat";
let initialState = {
  dashboardDTO: [],
  startTime: null,
  dbQuery: null,
  token: null,
  reportId: null,
  reportName: null,
  webURL: null,
  currentReportId: null,
  currentdbQuery: null,
  updateDashboard: false,
  totalCollection: {},
  siteCollection: [],
  siteList: [],
  currentDate: new Date().toString(),
  todayCollectionList: [],
  weeklyCollectionList: [],
  lastReportFetchTime: dateFormat(new Date(), "dddd, mmmm dd, yyyy, h:MM:ss TT"),

};

export const dashboard = (state = initialState, action) => {
  switch (action.type) {
    case types.FETCH_DASHBOARD_DETAILS_SUCCESS:
      return {
        ...state,
        dashboardDTO: action.payload,
      };
    case types.FETCH_START_TIME_SUCCESS:
      return {
        ...state,
        startTime: action.payload,
      };

    case types.SET_DB_QUERY:
      return {
        ...state,
        dbQuery: action.payload,
      };
    case types.FETCH_TOKEN_SUCCESS:
      return {
        ...state,
        token: action.payload,
      };
    case types.FETCH_CURRENT_TIME:

      return {
        ...state,
        lastReportFetchTime: action.payload
      }
    case types.SET_REPORT_ID:
      return {
        ...state,
        reportId: action.payload,
      };
    case types.SET_WEB_VIEW_URL:
      return {
        ...state,
        webURL: action.payload,
      };
    case types.STORE_REPORT_ID:
      // console.log('report id', action.payload);
      return {
        ...state,
        currentReportId: action.payload,
      };
    case types.STORE_DB_QUERY:
      return {
        ...state,
        currentdbQuery: action.payload,
      };

    case types.SET_REPORT_NAME:
      return {
        ...state,
        reportName: action.payload,
      };
    case types.UPDATE_REQUIRED:
      return {
        ...state,
        updateDashboard: action.payload,
      };
    case types.FETCH_TOTAL_COLLECTION:
      return {
        ...state,
        totalCollection: action.payload,
      };
    case types.FETCH_SALES_DASHBOARD_SUCCESS:

      return {
        ...state,
        siteList: action.payload,
      };
    case types.FETCH_CURRENT_DATE:
      return {
        ...state,
        currentDate: action.payload,
      };
    case types.SET_TODAY_COLLECTION:
      return {
        ...state,
        todayCollectionList: action.payload,
      };
    case types.SET_WEEKLY_COLLECTION:
      return {
        ...state,
        weeklyCollectionList: action.payload,
      };

    default:
      return state;
  }
};
