import { ParafaitServer } from "../constants/ParafaitServer";
import ServiceHandler from "./APIHandler";
import {
  createNewPushNotificationDeviceDTO,
  transformPushNotificationDevice,
  PushNotificationDeviceDBType,
} from "../models/PushNotificationDevices";
import {
  MessagingRequestSearchParams,
  MessagingRequestType,
  transformMessagingRequestToAppType,
} from "../models/MessagingRequest";
import { map, orderBy, uniqBy } from "lodash";
import { user } from "../redux/reducers/userReducer";


export const postCustomerNotificationToken = async (
  notificationToken: string,
  customerId: number,
  userId: number,
  appName: String,
  pushNotificationDeviceId: number = -1
) => {
  //console.log("................posting customer notification")
  const pushNotificationDeviceDTO = createNewPushNotificationDeviceDTO(
    notificationToken,
    customerId,
    userId,
    appName,
    pushNotificationDeviceId
  );
  // console.log('pushNotificationDeviceDTO', pushNotificationDeviceDTO);

  return ServiceHandler.post({
    url: ParafaitServer.PUSH_NOTIFICATION_DEVICES,
    data: [pushNotificationDeviceDTO],
    timeout: ParafaitServer.DEFAULT_TIMEOUT,
  });
};

export const getPushNotificationDevice = async (notificationToken: string, userId: number, appName: String) => {
  //console.log('beforeGet', notificationToken);

  const data = {
    queryParameters: { PushNotificationToken: notificationToken, UserID: userId, AppName: appName },
  };
  //console.log('getDataofPUSH', data);

  const response = await ServiceHandler.get({
    url: ParafaitServer.PUSH_NOTIFICATION_DEVICES,
    data,
    timeout: ParafaitServer.DEFAULT_TIMEOUT,
  });
  let pushNotificationDeviceData = undefined;

  //console.log('notification response123', JSON.stringify(response));

  if (response.data) {

    // console.log("push notification response " + JSON.stringify(response.data))
    pushNotificationDeviceData = transformPushNotificationDevice(
      response.data[0]
    );
  }
  return pushNotificationDeviceData as PushNotificationDeviceDBType;
};

// export const getMessagingRequests = async (
//   searchParams: MessagingRequestSearchParams
// ) => {
//   const date = new Date();
//   const fromDate = date.toISOString().split("T")[0];
//   date.setDate(date.getDate() - 30);
//   const toDate = date.toISOString().split("T")[0];

//   const requestParams = { queryParameters: {} };
//   requestParams.queryParameters["MessageType"] = "A";
//   requestParams.queryParameters["From_Date"] = fromDate;
//   requestParams.queryParameters["To_Date"] = toDate;
//   if (searchParams.CustomerId || searchParams.CustomerId < 0)
//     requestParams.queryParameters["CustomerId"] = searchParams.CustomerId;

//   //console.log("requestParams ", JSON.stringify(requestParams));
//   const response = await ServiceHandler.get({
//     url: ParafaitServer.MESSAGING_REQUESTS,
//     data: requestParams,
//   });
//   const messagingRequests = map(response.data, (item) =>
//     transformMessagingRequestToAppType(item)
//   ) as Array<MessagingRequestType>;
//   return orderBy(messagingRequests, "SendDate", "desc");
// };

export const postInvalidateCustomerNotificationToken = async (
  pushNotificationDeviceDTO: PushNotificationDeviceDBType
) => {
  // console.log("...........postInvalidateCustomerNotificationToken..............")
  const updatedPushNotificationDeviceDTO = {
    ...pushNotificationDeviceDTO,
    CustomerSignedIn: false,
    IsChanged: true,
  } as PushNotificationDeviceDBType;

  return ServiceHandler.post({
    url: ParafaitServer.PUSH_NOTIFICATION_DEVICES,
    data: [updatedPushNotificationDeviceDTO],
    timeout: ParafaitServer.DEFAULT_TIMEOUT,
  });
};

export const postMessagingRequest = async (
  messagingRequest: MessagingRequestType
) => {
  const updatedMessagingRequest = {
    ...messagingRequest,
    MessageRead: true,
    IsChanged: true,
  } as MessagingRequestType;

  return ServiceHandler.post({
    url: ParafaitServer.MESSAGING_REQUESTS,
    data: [updatedMessagingRequest],
    timeout: ParafaitServer.DEFAULT_TIMEOUT,
  });
};

export const postMessageRequestRead = async (messagingRequestId: number) => {
  return ServiceHandler.post({
    url:
      ParafaitServer.MESSAGING_REQUESTS + `/${messagingRequestId}/MessageRead`,
    data: {
      MessageRead: true,
    },
    timeout: ParafaitServer.DEFAULT_TIMEOUT,
  });
};
