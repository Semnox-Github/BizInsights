// Generated by https://quicktype.io

import * as utils from "../common/index";

export enum MessageType {
  TRANSACTION = "TRX",
  CARD = "CARD"
}

export interface MessagingRequestType {
  Id: number;
  BatchId?: number;
  ActiveFlag: boolean;
  Reference: string;
  MessageType: MessageType;
  ToEmail?: string;
  ToMobile?: string;
  Status?: string;
  StatusMessage?: string;
  SendDate?: Date;
  SendAttemptDate?: Date;
  Attempts?: number;
  Subject: string;
  Body: string;
  LastUpdatedBy: string;
  LastUpdatedDate: Date;
  CustomerId: number;
  CardId?: number;
  AttachFile?: string;
  SiteId: number;
  Guid: string;
  SynchStatus?: boolean;
  MasterEntityId?: number;
  CreatedBy?: string;
  CreationDate?: Date;
  MessageRead: boolean;
  Cc?: string;
  Bcc?: string;
  MessagingClientName?: string;
  MessagingClientId?: number;
  ToDevice?: string;
  IsChanged?: boolean;
}

export interface MessagingRequestDBType {
  Id: number;
  BatchId: number | null;
  ActiveFlag: boolean;
  Reference: string;
  MessageType: MessageType;
  ToEmail: string;
  ToMobile: string;
  Status: string;
  StatusMessage: string;
  SendDate?: Date;
  SendAttemptDate: string;
  Attempts: number;
  Subject: string;
  Body: string;
  LastUpdatedBy: string;
  LastUpdatedDate: string;
  CustomerId: number;
  CardId: number | null;
  AttachFile: string;
  SiteId: number;
  Guid: string;
  SynchStatus: boolean;
  MasterEntityId: number;
  CreatedBy: string;
  CreationDate: string;
  MessageRead: boolean;
  Cc: string;
  Bcc: string;
  MessagingClientName: string | null;
  MessagingClientId: number;
  ToDevice: string;
  IsChanged: boolean;
}

export interface MessagingRequestSearchParams {
  CustomerId?: number;
}

export const transformMessagingRequestToAppType = (data: any) => {
  const transformedData = {
    ...data,
    SendDate: utils.stringToDate(data?.SendDate),
    SendAttemptDate: utils.stringToDate(data?.SendAttemptDate),
    LastUpdatedDate: utils.stringToDate(data?.LastUpdatedDate),
    CreationDate: utils.stringToDate(data?.CreationDate)
  } as MessagingRequestType;
  return transformedData;
};
