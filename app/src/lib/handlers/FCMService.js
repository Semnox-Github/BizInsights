import messaging from '@react-native-firebase/messaging'
import { Platform } from 'react-native';
import { log } from 'react-native-reanimated';
import { check, request, PERMISSIONS, RESULTS } from "react-native-permissions";


class FCMService {

    register = (onRegister, onNotification, onOpenNotification) => {
        this.checkPermission(onRegister)
        this.createNotificationListeners(onRegister, onNotification, onOpenNotification)
    }

    registerAppWithFCM = async () => {
        // console.log('regesteredWithOSType', Platform.OS);

        if (Platform.OS === 'ios') {
            await messaging().registerDeviceForRemoteMessages();
            await messaging().setAutoInitEnabled(true)
        }
        // console.log('hello');
    }

    checkPermission = (onRegister) => {
        //  console.log('onRegister', onRegister);
        messaging().hasPermission()
            .then(enabled => {
                // console.log('enabled', enabled);
                if (enabled) {
                    //    console.log('User has permissions');
                    // User has permissions
                    this.getToken(onRegister)
                } else {
                    //console.log(' User doesnt have permission');
                    // User doesn't have permission
                    this.requestPermission(onRegister)
                }
            }).catch(error => {
                //  console.log("[FCMService] Permission rejected ", error)
            })
    }

    getToken = (onRegister) => {
        messaging().getToken()
            .then(fcmToken => {
                if (fcmToken) {
                    onRegister(fcmToken)
                } else {
                    //  console.log("[FCMService] User does not have a device token")
                }
            }).catch(error => {
                // console.log("[FCMService] getToken rejected ", error)
            })
    }
    requestAndroidPermission = async (onRegister) => {
        const checkPermission = await check(PERMISSIONS.ANDROID.POST_NOTIFICATIONS);
        if (checkPermission !== RESULTS.GRANTED) {
            const result = await request(PERMISSIONS.ANDROID.POST_NOTIFICATIONS); // Changed the variable name to result
            if (result === RESULTS.GRANTED) {
                // Permission granted
                //console.log("Permission granted");
                this.getToken(onRegister);
            } else {
                //console.log("permission not granted");
            }
        }
    };

    requestPermission = (onRegister) => {
        if (Platform.OS === "ios") {
            messaging().requestPermission()
                .then(() => {
                    this.getToken(onRegister)
                }).catch(error => {
                    //console.log("[FCMService] Request Permission rejected ", error)
                })
        }
        if (Platform.OS === "android") {
            // console.log("request android permisson");
            this.requestAndroidPermission(onRegister);
            // Request Android permission (For API level 33+, for 32 or below is not required)
        }
    }

    deleteToken = () => {
        // console.log("[FCMService] deleteToken ")
        messaging().deleteToken()
            .catch(error => {
                // console.log("[FCMService] Delete token error ", error)
            })
    }

    createNotificationListeners = (onRegister, onNotification, onOpenNotification) => {

        // When the application is running, but in the background
        messaging()
            .onNotificationOpenedApp(remoteMessage => {
                //   console.log('[FCMService] onNotificationOpenedApp Notification caused app to open from background state:', remoteMessage)
                if (remoteMessage) {
                    const notification = { ...remoteMessage.notification, ...remoteMessage.data }
                    onOpenNotification(notification)
                    // this.removeDeliveredNotification(notification.notificationId)
                }
            });

        // When the application is opened from a quit state.
        messaging()
            .getInitialNotification()
            .then(remoteMessage => {
                //  console.log('[FCMService] getInitialNotification Notification caused app to open from quit state:', remoteMessage)

                if (remoteMessage) {
                    const notification = { ...remoteMessage.notification, ...remoteMessage.data }
                    onOpenNotification(notification)
                    //  this.removeDeliveredNotification(notification.notificationId)
                }
            });

        // Foreground state messages
        this.messageListener = messaging().onMessage(async remoteMessage => {
            // console.log('[FCMService] A new FCM message arrived!', remoteMessage);
            if (remoteMessage) {
                let notification = null
                if (Platform.OS === 'ios') {
                    // console.log('Platform', Platform.OS);
                    // console.log('iosNotfivationInDevice', remoteMessage);
                    notification = remoteMessage.data.notification
                } else {
                    notification = { ...remoteMessage.notification, ...remoteMessage.data }
                }
                onNotification(notification)
            }
        });

        // Triggered when have new token
        messaging().onTokenRefresh(fcmToken => {
            // console.log("[FCMService] New token refresh: ", fcmToken)
            onRegister(fcmToken)
        })

    }

    unRegister = () => {
        this.messageListener()
    }
}

export const fcmService = new FCMService();