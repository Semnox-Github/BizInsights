import { Platform } from "react-native";

export interface PushNotificationDeviceDBType {
  Id: number;
  CustomerId: number;
  PushNotificationToken: string;
  DeviceType: string;
  IsActive: boolean;
  IsChanged?: boolean;
  CustomerSignedIn: boolean;
  UserId: number;
  AppName: String;
}

export const createNewPushNotificationDeviceDTO =
  (pushNotificationToken: string, customerId: number, userId: number, appName: String, pushNotificationDeviceId: number = -1): PushNotificationDeviceDBType => ({
    Id: pushNotificationDeviceId,
    CustomerId: customerId,
    PushNotificationToken: pushNotificationToken,
    DeviceType: Platform.OS === "ios" ? "IOS" : "ANDROID",
    IsActive: true,
    CustomerSignedIn: true,
    IsChanged: true,
    UserId: userId,
    AppName: appName,
  } as PushNotificationDeviceDBType);

export const transformPushNotificationDevice = (data: any) => {
  const transformedData = {
    ...data,
  } as PushNotificationDeviceDBType;
  return transformedData;
}