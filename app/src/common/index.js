import React from "react";
import _ from "lodash";
import {
  Alert,
  Image,
  View,
  TouchableOpacity,
  Text,
  ToastAndroid,
  StyleSheet,
  Platform,
  Dimensions
} from "react-native";
import { BackHandler } from "react-native";
//import defaultStyles from "../../components/Styles";
import * as Strings from "./Strings";
//import store from "../../store";
import * as Constants from "../constants";
//import { resetUI } from "../../actions/uiActions";
//import jwt from "react-native-pure-jwt";
//import NavigationService from "../NavigationService";
//import dateformat from "dateformat";
// import {
//   RESET_UI,
//   INVALIDATE_LOGIN_SESSION,
//   CLEAR_TOKEN
// } from "../../actions/types";

//import CryptoES from "crypto-es";

export function exitApplication() {
  BackHandler.exitApp();
}

export function handleExitApplication() {
  //store.dispatch(logoutCustomer());
  store.dispatch(resetUI());
  BackHandler.exitApp();
}

export function restartApplication() {
  store.dispatch({ type: RESET_UI });
  store.dispatch({ type: INVALIDATE_LOGIN_SESSION });
  store.dispatch({ type: CLEAR_TOKEN });
  NavigationService.reset({
    index: 0,
    actions: [NavigationService.navActions("Splash")]
  });
}

export function buildURL(params) {
  return params.join("/");
}

export function generateUUID() {
  // const uuid = require("uuid/v1");
  const id = uuid();
  return id;
}



export function showErrorAlertWithRestart(error, onRetry) {
  simpleAlert({
    title: "Alert",
    message: error,
    // message: 'Something went wrong!! Please try again.',
    buttons: [
      { buttonText: "Restart", onPress: onRetry }
      // { buttonText: 'Exit', onPress: () => handleExitApplication(), }
    ],
    cancelable: false
  });
}

export function showErrorAlertWithBack(error, onRetry, onBack) {
  simpleAlert({
    title: "Alert",
    message: error.message,
    // message: 'Something went wrong!! Please try again.',
    buttons: [
      { buttonText: Strings.ALERT_RETRY, onPress: onRetry },
      { buttonText: Strings.ALERT_BACK, onPress: onBack }
    ],
    cancelable: false
  });
}

export function showErrorAlertWithOk(error, onOk) {
  simpleAlert({
    title: "Alert",
    message: error,
    // message: 'Something went wrong!! Please try again.',
    buttons: [{ buttonText: Strings.ALERT_OK, onPress: onOk }],
    cancelable: false
  });
}

export function showErrorAlertWithMessage(error, onOk) {
  simpleAlert({
    title: "Alert",
    message: error.message,
    buttons: [{ buttonText: Strings.ALERT_OK, onPress: onOk }],
    cancelable: false
  });
}

export function showAlertWithBack(title, message, onPress) {
  simpleAlert({
    title: title,
    message: message,
    // message: 'Something went wrong!! Please try again.',
    buttons: [{ buttonText: Strings.ALERT_BACK, onPress: onPress }],
    cancelable: false
  });
  return null;
}

export function showAlertWithOk(message, onPress) {
  simpleAlert({
    title: 'Alert',
    message: message,
    // message: 'Something went wrong!! Please try again.',
    buttons: [{ buttonText: Strings.ALERT_OK, onPress: onPress }],
    cancelable: false
  });
  return null;
}

export function showAlertWithExit(title, message) {
  simpleAlert({
    title: title,
    message: message,
    // message: 'Something went wrong!! Please try again.',
    buttons: [
      { buttonText: Strings.ALERT_EXIT, onPress: handleExitApplication() }
    ],
    cancelable: false
  });
  return null;
}

export function showAlertWithCancel(message, onOk, onCancel) {

  simpleAlert({
    title: "Alert",
    message: message,
    // message: 'Something went wrong!! Please try again.',
    buttons: [
      { buttonText: Strings.ALERT_YES, onPress: onOk },
      { buttonText: Strings.ALERT_NO, onPress: onCancel }
    ],
    cancelable: false
  });


}

export function headerBackTitle(title) {
  return <Text style={defaultStyles.headerBackTitle}>{title}</Text>;
}

export function objectIsEmpty(obj) {
  if (Object.keys(obj).length === 0 && obj.constructor === Object) return true;
  else return false;
}

export function IsUndefined(field) {
  if (typeof field === "undefined") return true;
  else return false;
}

export function isUndefinedOrEmptyObject(field) {
  if (typeof field === "undefined") return true;
  if (Object.keys(field).length === 0 && field.constructor === Object)
    return true;
  return false;
}

export function isDefined(field) {
  if (typeof field === "undefined") return false;
  else return true;
}



export function simpleAlert({
  title,
  message,
  cancel,
  ok,
  retry,
  exit,
  buttons,
  cancelable
}) {
  let alertButtons = [];

  buttons.forEach((element) => {
    alertButtons.push({
      text: element.buttonText,
      onPress: element.onPress,
      style: element.style
    });
  });



  setTimeout(() => { Alert.alert(title, message, alertButtons, { cancelable: cancelable }) }, 500)
}

export function imagesUrl(serverIp = "", imageName = "") {
  return serverIp + "/images/" + imageName;
}



export function getErrorCode() {
  return store.getState().ui.errorCode;
}

export const stringToDate = (dateString) => {
  // return dateString ? new Date(dateString) : undefined
  var timestamp = Date.parse(dateString);

  if (isNaN(timestamp) == false) {
    return new Date(timestamp);
  } else {
    return undefined;
  }
};



export const errorMessage = [
  {
    title: 'Error!', msg: ''
  },
  {
    title: 'Error!', msg: 'unauthorised request'
  },

  {
    title: 'Error!', msg: 'access to this resource is denied'
  },

  {
    title: 'Error!', msg: 'resource your looking not found'
  },

  {
    title: 'OOPS!', msg: 'something went wrong please restart the application '
  },

  {
    title: 'OOPS!', msg: ' Please Check your internet connection '
  },
]