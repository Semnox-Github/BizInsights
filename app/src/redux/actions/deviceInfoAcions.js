import * as types from "./types";
import ServiceHandler from "../../services/APIHandler";
import * as Constants from "../../../src/constants/index";
import * as utils from "../../../src/common/index";
// import { CustomerDTO } from "../lib/model/CustomerDTO";
// import { ContactDTO } from "../lib/model/ContactDTO";
import AsyncStorageHandler from "../../services/AsyncStorageHanlder";
import NavigationService from "../../lib/NavigationService";
import { asyncRequest, asyncSuccess, asyncFailure } from "../../redux/actions/dashboardActions";
// import {
//   getSelectedSite,
//   setSite,
//   getDefaultAppConfiguration,
//   getActiveLanguages,
// } from "./siteActions";
//import * as Services from "../lib/common/AsyncFunctions";//not availble in BIZ

import { fcmService } from "../../lib/handlers/FCMService";
import { localNotificationService } from "../../lib/handlers/PushNotificationUtil";

//import { NavigationScreens } from "../lib/model/CommonType"; //not availble in BIZ
import * as notificationServices from "../../services/notification";

//import store from "../store";

var asyncStorageHandler = new AsyncStorageHandler();

export function setUUID(uuid) {
  return {
    type: types.SET_UUID,
    payload: uuid,
  };
}

export function setToken(token) {
  return {
    type: types.SET_TOKEN,
    payload: token,
  };
}

export function clearToken() {
  return {
    type: types.CLEAR_TOKEN,
  };
}

// export function setLastUsedTime() {
//   return {
//     type: ActionTypes.SET_LAST_USED_TIME,
//     payload: Date.now(),
//   };
// }

// export function setDeviceValidity() {
//   return {
//     type: ActionTypes.FETCH_APP_VALIDITY_SUCCESS,
//   };
// }

export function initialSetup() {
  return (dispatch, getState) => {
    if (getState().deviceInfo.uuid) {
      // if (getState().deviceInfo.contactType && getState().deviceInfo.contactNumber) {
      dispatch(Login());
      // }
    } else {
      let uuid = utils.generateUUID();
      asyncStorageHandler
        .setItem(Constants.UUID, uuid)
        .then(() => {
          dispatch(asyncSuccess());
          dispatch(setUUID(uuid));
          dispatch(Login());
        })
        .catch((error) => {
          dispatch(asyncFailure(error));
        });
    }
  };
}

function Login() {
  return async (dispatch, getState) => {
    try {
      dispatch({ type: types.SET_PROGRESS_VALUE, payload: 0.2 });
      dispatch({ type: types.DEVICE_LOGIN_REQUEST });
      const response = await Services.loginToClientServer();
      if (response instanceof Error) throw response;
      if (response.status) {
        dispatch({ type: types.DEVICE_LOGIN_SUCCESS });
        dispatch({ type: types.SET_PROGRESS_VALUE, payload: 0.3 });
        dispatch({
          type: types.SET_MASTER_SITE_ID,
          payload: response.data.userDTO.SiteId,
        });
        dispatch(getDefaultAppConfiguration(response.data.userDTO.SiteId));
        dispatch(getActiveLanguages(response.data.userDTO.SiteId));
        dispatch({ type: types.FETCH_STRINGS });
        dispatch({ type: types.FETCH_IMAGES });
        dispatch({ type: types.FETCH_CONTACT_TYPE });
        dispatch({ type: types.FETCH_HOMEPAGE_CMS });
        dispatch(getSelectedSite());
      } else {
        dispatch({
          type: types.DEVICE_LOGIN_FAILURE,
          payload: new Error(response.data || "Unhandled Response"),
        });
      }
    } catch (error) {
      dispatch({ type: types.DEVICE_LOGIN_FAILURE, payload: error });
    }
  };
}

// export function getContactTypeList() {
//   return (dispatch, getState) => {
//     dispatch({ type: types.FETCH_CONTACT_TYPE });
//     Services.getContactTypeList()
//       .then((response) => {
//         try {
//           if (response instanceof Error) throw response;
//           if (response.status) {
//             var contactType = {};

//             response.data.forEach((element) => {
//               contactType[element.ContactType] = element.Id;
//             });

//             dispatch({
//               type: types.FETCH_CONTACT_TYPE_SUCCESS,
//               payload: contactType,
//             });
//             dispatch(checkAppValidityStatus(siteId));
//           } else {
//             dispatch({
//               type: types.FETCH_CONTACT_TYPE_FAILURE,
//               payload: new Error("Unhandled Response"),
//             });
//           }
//         } catch (error) {
//           dispatch({ type: types.FETCH_CONTACT_TYPE_FAILURE, payload: error });
//         }
//       })
//       .catch((error) => {
//         dispatch({ type: types.FETCH_CONTACT_TYPE_FAILURE, payload: error });
//       });
//   };
// }

export function setNotificationData(data) {
  return (dispatch, getState) => {
    dispatch({ type: types.SET_PUSH_NOTIFICATION_DATA, payload: data });
  };
}

export function setPushNotificationDevice(data) {
  return (dispatch, getState) => {
    dispatch({ type: types.SET_PUSH_NOTIFICATION_DEVICE, payload: data });
  };
}

// export function checkAppValidityStatus(siteId) {
//   return (dispatch, getState) => {
//     if (siteId === -1) {
//       setTimeout(() => {
//         // dispatch({type:types.SET_PROGRESS_VALUE,payload:1})
//         NavigationService.reset({
//           index: 0,
//           actions: [NavigationService.navActions("SiteSelection")],
//         });
//       }, Constants.SPLASH_SCREEN_TIMEOUT);
//     } else {
//       dispatch({ type: types.SET_PROGRESS_VALUE, payload: 0.8 });
//       if (!getState().deviceInfo.contactNumber) {
//         dispatch(setSite(siteId));
//       } else {
//         dispatch({ type: types.FETCH_APP_VALIDITY_REQUEST });
//         // console.log("customer id *******##### ", getState()?.customer)

//         // asyncStorageHandler
//         //   .getItem(Constants.LOGGED_USER_ID)
//         //   .then((customerId) => {
//         //     //  console.log("customer id from async  ************************************* ", customerId)
//         //     dispatch(asyncSuccess());
//         //     let custID = -1;
//         //     if (Boolean(customerId)) {
//         //       // before login

//         //       // console.log("customer Id ********** ", customerId)
//         //       custID = customerId;
//         //     }

//         Services.deviceValidation(
//           getState().customer.contactTypes[getState().deviceInfo.contactType],
//           getState().deviceInfo.contactNumber,
//           getState().deviceInfo.uuid,
//           getState().deviceInfo.contactType
//         )
//           .then((response) => {
//             try {
//               if (response instanceof Error) throw response;
//               if (response.status) {
//                 dispatch({ type: types.SET_PROGRESS_VALUE, payload: 0.8 });
//                 dispatch({ type: types.FETCH_APP_VALIDITY_SUCCESS });
//                 dispatch(setSite(siteId));
//               } else {
//                 throw new Error("Device Verification Failed");
//               }
//             } catch (error) {
//               dispatch({
//                 type: types.FETCH_APP_VALIDITY_FAILURE,
//                 payload: error,
//               });
//             }
//           })
//           .catch((error) => {
//             dispatch({
//               type: types.FETCH_APP_VALIDITY_FAILURE,
//               payload: error,
//             });
//           });
//         //})
//         // .catch((error) => {
//         //   dispatch(asyncFailure(error));
//         // });
//       }
//     }
//   };
// }

// export function sendUnhandledErrorDetails(error, customerId) {
//   return (dispatch, getState) => {
//     Services.logErrorToServer(data)
//       .then((response) => {
//         try {
//           if (response instanceof Error) throw response;
//           this.props.asyncSuccess();
//           if (response.status) {
//             // console.log(response);
//           }
//         } catch (error) {
//           this.props.asyncFailure(error);
//         }
//       })
//       .catch((error) => {
//         this.props.asyncFailure(error);
//       });
//   };
// }

// export function saveContactType(type) {
//   return (dispatch, getState) => {
//     dispatch({ type: types.SET_CONTACT_TYPE, payload: type });
//   };
// }

export const setPushNotificationToken = (customerId, userId, appName) => {
  //console.log('userIdCheck123', userId);
  //console.log('appNameCheck123', appName);

  return (dispatch, getState) => {
    // console.log('registerAppWithFCM');
    fcmService.registerAppWithFCM();
    fcmService.register(onRegisterToken, onNotification, onOpenNotification);
    //localNotificationService.configure(onOpenNotification);
    async function onRegisterToken(token) {
      //console.log("tokenFCM", token);
      try {
        const pushNotificationDevice =
          await notificationServices.getPushNotificationDevice(token, userId, appName);
        // console.log('pushNotificationDevicecheck', pushNotificationDevice);
        if (pushNotificationDevice) {
          if (
            pushNotificationDevice.UserId != userId ||
            !pushNotificationDevice.IsActive ||
            !pushNotificationDevice.CustomerSignedIn
          ) {
            // console.log('helloif');
            // console.log('userIdCheck', userId);
            // console.log('appNameCheck', appName);

            dispatch(
              setPushNotificationTokenToParafait(
                customerId,
                userId,
                appName,
                token,
                pushNotificationDevice.Id
              )
            );
          } else {
            //console.log('helloElse');
            dispatch(setPushNotificationDevice(pushNotificationDevice));
          }
        } else {
          //   console.log('helloElseelse');
          dispatch(setPushNotificationTokenToParafait(customerId, userId, appName, token));
        }
      } catch (error) {
        // console.log("ErrorInside", error);
      }
    }

    function onOpenNotification(notificationPayload) {
      // console.log("notificationPayload *** ", notificationPayload);
      if (notificationPayload?.foreground) {
        NavigationService.reset({
          index: 0,
          actions: [NavigationService.navActions('HomeScreen')],
        });
        // const notifyType = notificationPayload?.notificationType;
        // dispatch(setNotificationData(undefined));
        // if (notificationPayload?.messageId)
        //   dispatch(setMessageRequestReadById(notificationPayload?.messageId));
        // console.log("*notification type ** ", notifyType);
        // switch (notifyType) {
        //   case "CARD":
        //     NavigationService.navigate("Card", {
        //       notificationPayload: notificationPayload,
        //     });
        //     break;
        //   case "TRX":
        //     NavigationService.navigate(NavigationScreens.TransactionScreen, {
        //       transactionId: notificationPayload?.transactionRef || -1,
        //     });
        //     break;
        //   default:
        //     NavigationService.navigate(NavigationScreens.NotificationsScreen, {
        //       notificationPayload: notificationPayload,
        //     });
        //     break;
        // }
        // dispatch(setMessageRequestRead());
      } else {
        dispatch(setNotificationData(notificationPayload));
      }
    }

    function onNotification(notify) {
      // console.log("onNotification == ", notify);
      // if (Platform.OS === "ios") {
      const options = {
        soundName: "default",
        playSound: true, //,
      };
      localNotificationService.showNotification(
        0,
        notify.title,
        notify.body,
        notify,
        options
      );
      // }
    }
  };
};

export const setPushNotificationTokenToParafait = (
  customerId,
  userId,
  appName,
  token,
  pushNotificationDeviceId = -1
) => {
  // console.log('userId****', userId);
  // console.log('appName****', appName);

  return async (dispatch, getState) => {
    try {
      const pushNotificationDeviceDTO =
        await notificationServices.postCustomerNotificationToken(
          token,
          customerId,
          userId,
          appName,
          pushNotificationDeviceId
        );

      //console.log('pushData', pushNotificationDeviceDTO);
      if (
        pushNotificationDeviceDTO?.data &&
        pushNotificationDeviceDTO?.data.length > 0
      ) {
        dispatch(setPushNotificationDevice(pushNotificationDeviceDTO?.data[0]));
      }
    } catch (error) {
      // console.log("setPushNotificationTokenToParafait Error", error);
    }
  };
};

export const setInactivePushNotificationToken = () => {
  return async (dispatch, getState) => {
    try {
      const pushNotificationDeviceData =
        getState().deviceInfo?.pushNotificationDevice;
      // console.log(
      //   "pushNotificationDeviceData",
      //   JSON.stringify(pushNotificationDeviceData)
      // );
      await notificationServices.postInvalidateCustomerNotificationToken(
        pushNotificationDeviceData
      );
      fcmService.unRegister();
      // fcmService.deleteToken();
      dispatch(setPushNotificationDevice(undefined));
    } catch (error) {
      //console.log("setInactivePushNotificationToken Error", error);
    }
  };
};

export const setMessageRequestRead = (messagingRequest) => {
  return async (dispatch, getState) => {
    try {
      await notificationServices.postMessagingRequest(messagingRequest);
      // console.log("postMessagingRequest dadada", data);
    } catch (error) {
      //console.log("setMessageRequestRead Error", error);
    }
  };
};

export const setMessageRequestReadById = (messagingRequestId) => {
  return async (dispatch, getState) => {
    try {
      await notificationServices.postMessageRequestRead(messagingRequestId);
      // console.log("postMessagingRequest dadada", data);
    } catch (error) {
      // console.log("setMessageRequestRead Error", error);
    }
  };
};

// export const getImages = () => {
//   return async (dispatch, getState) => {
//     try {
//       const lastSyncDate = getState().deviceInfo.lastImageSyncDate;
//       const imageList = await commonServices.getImageList(lastSyncDate);
//       if (imageList.length > 0) {
//         map(imageList, async (imageName) => {
//           try {
//             const base64ImageString = await commonServices.getBase64Image(
//               (imageType = "APP_IMAGES_FOLDER"),
//               imageName
//             );
//             const imageUpdated = false;
//             try {
//               await asyncStorageHandler.deleteItem(imageName);
//               await asyncStorageHandler.setItem(imageName, base64ImageString);
//               imageUpdated = true;
//             } catch (error) {}
//             if (!imageUpdated) {
//               await asyncStorageHandler.setItem(imageName, base64ImageString);
//             }
//             //console.log("imageName", imageName);
//           } catch (error) {
//             //console.log("base64ImageString error", error);
//           }
//         });
//       }
//       dispatch({ type: types.SET_IMAGE_LAST_SYNC_DATE, payload: new Date() });
//     } catch (error) {
//       //console.log("setMessageRequestRead Error", error);
//     }
//   };
// };

// export const getPromoImages = () => {
//   return async (dispatch, getState) => {
//     try {
//       const lastSyncDate = getState().deviceInfo.lastPromoImageSyncDate;
//       const imageList = await commonServices.getPromoImageList(lastSyncDate);
//       if (imageList.length > 0) {
//         map(imageList, async (imageName) => {
//           try {
//             const base64ImageString = await commonServices.getBase64Image(
//               (imageType = "APP_PROMO_IMAGES_FOLDER"),
//               imageName
//             );
//             const imageUpdated = false;
//             try {
//               await asyncStorageHandler.deleteItem(imageName);
//               await asyncStorageHandler.setItem(imageName, base64ImageString);
//               imageUpdated = true;
//             } catch (error) {}
//             if (!imageUpdated) {
//               await asyncStorageHandler.setItem(imageName, base64ImageString);
//             }
//             console.log("imageName", imageName);
//           } catch (error) {
//             //console.log("base64ImageString error", error);
//           }
//         });
//       }
//       dispatch({
//         type: types.SET_PROMO_IMAGE_LAST_SYNC_DATE,
//         payload: new Date(),
//       });
//     } catch (error) {
//       //console.log("setMessageRequestRead Error", error);
//     }
//   };
// };

// export const getProductImages = () => {
//   return async (dispatch, getState) => {
//     try {
//       const lastSyncDate = getState().deviceInfo.lastProductImageSyncDate;
//       const imageList = await commonServices.getProductImageList(lastSyncDate);
//       // console.log("imageList----------", imageList);
//       if (imageList.length > 0) {
//         map(imageList, async (imageName) => {
//           try {
//             const base64ImageString = await commonServices.getBase64Image(
//               (imageType = "APP_PRODUCT_IMAGES_FOLDER"),
//               imageName
//             );
//             const imageUpdated = false;
//             try {
//               await asyncStorageHandler.deleteItem(imageName);
//               await asyncStorageHandler.setItem(imageName, base64ImageString);
//               imageUpdated = true;
//             } catch (error) {}
//             if (!imageUpdated) {
//               await asyncStorageHandler.setItem(imageName, base64ImageString);
//             }
//             console.log("imageName", imageName);
//           } catch (error) {
//             //console.log("base64ImageString error", error);
//           }
//         });
//       }
//       dispatch({
//         type: types.SET_PRODUCT_IMAGE_LAST_SYNC_DATE,
//         payload: new Date(),
//       });
//     } catch (error) {
//       //console.log("setMessageRequestRead Error", error);
//     }
//   };
// };

// // export const getStrings = () => {
// //   const defaultLanguage =
// //     store.getState().site?.defaultConfig?.defaultLanguage ?? -1;

// //   //console.log("fething strings ((((((((((()))))))))))", JSON.stringify(store.getState().site?.defaultConfig))
// //   return async (dispatch, getState) => {
// //     try {
// //       const currentStrings = getState()?.ui?.strings || new Map();
// //       const strings: Map<string, string> = new Map();
// //       if (currentStrings.size < 1) {
// //         map(Strings, (value: string, key: string) => {
// //           strings.set(key, value);
// //         });
// //       } else {
// //         strings = new Map(currentStrings);
// //       }

// //       dispatch({ type: types.SET_STRINGS, payload: strings });

// //       const stringsFromServer = new Map();

// //       if (defaultLanguage != -1 && defaultLanguage != "") {
//        stringsFromServer = await commonServices.getStrings();
// //       }

// //       if (stringsFromServer && stringsFromServer.size > 1) {
// //         var newStrings: Map<string, string> = new Map([
// //           ...strings,
// //           ...stringsFromServer,
// //         ]);
// //       }
// //       dispatch({ type: types.SET_STRINGS, payload: newStrings });
// //     } catch (error) {
// //       //console.log("setMessageRequestRead Error", error);
// //     }
// //   };
// // };
