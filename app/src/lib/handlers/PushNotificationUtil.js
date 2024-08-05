import PushNotification from "react-native-push-notification";
import PushNotificationIOS from "@react-native-community/push-notification-ios";
import { Platform } from 'react-native';
import { toString } from "lodash"

class LocalNotificationService {

  configure = (onOpenNotification) => {
    PushNotification.configure({
      onRegister: function (token) {
        // console.log("[LocalNotificationService] onRegister:", token);
      },
      onNotification: function (notification) {
        // console.log("[LocalNotificationService] onNotification:", JSON.stringify(notification));
        if (!notification?.data) {
          return
        }
        // notification.userInteraction = true;
        if (notification?.foreground && notification?.userPushNotificationserInteraction)
          // console.log('notificationdataCheck', notification.data);
          onOpenNotification(Platform.OS === 'ios' ? { ...notification?.data?.item, foreground: true } : { ...notification?.data, foreground: true });

        if (Platform.OS === 'ios') {
          // (required) Called when a remote is received or opened, or local notification is opened
          notification.finish(PushNotificationIOS.FetchResult.NoData)
        }
      },

      // IOS ONLY (optional): default: all - Permissions to register.
      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },

      // Should the initial notification be popped automatically
      // default: true
      popInitialNotification: true,

      /**
       * (optional) default: true
       * - Specified if permissions (ios) and token (android and ios) will requested or not,
       * - if not, you must call PushNotificationsHandler.requestPermissions() later
       * - if you are not using remote notification or do not have Firebase installed, use this:
       *     requestPermissions: Platform.OS === 'ios'
       */
      requestPermissions: true,
    })
  }

  unregister = () => {
    PushNotification.unregister()
  }

  showNotification = (id, title, message, data = {}, options = {}) => {
    //console.log("showNotification called");

    let channel;
    PushNotification.getChannels(function (channel_ids) {
      channel = channel_ids
    });
    PushNotification.channelExists(channel, function (exists) {

    });

    PushNotification.createChannel(
      {
        channelId: toString(channel), // (required)
        channelName: "My channel", // (required)
        channelDescription: "A channel to categorise your notifications", // (optional) default: undefined.
        soundName: "default", // (optional) See `soundName` parameter of `localNotification` function
        importance: 4, // (optional) default: 4. Int value of the Android notification importance
        vibrate: true, // (optional) default: true. Creates the default vibration patten if true.
      },
      (created) => { } // (optional) callback returns whether the channel was created, false means it already existed.
    );


    PushNotification.localNotification({
      /* Android Only Properties */
      ...this.buildAndroidNotification(id, title, message, data, options),
      /* iOS and Android properties */
      ...this.buildIOSNotification(id, title, message, data, options),
      /* iOS and Android properties */
      title: title || "",
      message: message || "",
      playSound: options.playSound || false,
      soundName: options.soundName || 'default',
      // largeIcon: "",
      userInteraction: false, // BOOLEAN: If the notification was opened by the user from the notification area or not
      channelId: toString(channel),
    });
  }

  buildAndroidNotification = (id, title, message, data = {}, options = {}) => {
    return {
      id: id,
      autoCancel: true,
      largeIcon: options.largeIcon || "",
      smallIcon: options.smallIcon || "ic_notification",
      bigText: message || '',
      subText: title || '',
      vibrate: options.vibrate || true,
      vibration: options.vibration || 300,
      priority: options.priority || "high",
      importance: options.importance || "high", // (optional) set notification importance, default: high,
      data: data,
    }
  }

  buildIOSNotification = (id, title, message, data = {}, options = {}) => {
    return {
      alertAction: options.alertAction || 'view',
      category: options.category || "",
      userInfo: {
        id: id,
        item: data
      }
    }
  }

  cancelAllLocalNotifications = () => {
    if (Platform.OS === 'ios') {
      PushNotificationIOS.removeAllDeliveredNotifications();
    } else {
      PushNotification.cancelAllLocalNotifications();
    }
  }

  removeDeliveredNotificationByID = (notificationId) => {
    //console.log("[LocalNotificationService] removeDeliveredNotificationByID: ", notificationId);
    PushNotification.cancelLocalNotifications({ id: `${notificationId}` })
  }
}

export const localNotificationService = new LocalNotificationService();