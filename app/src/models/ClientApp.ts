export interface ClientAppVersionMappingDTO
{
    ClientAppVersionMappingId: number;
    AppId: string;
    ClientId: number;
    Deprecated: string;
    ReleaseNumber: string;
    TokenizationKey: string;
    SecurityCode: string;
    ApiKey: string;
    GateWayURL: string;
    IsActive: boolean;
    CreatedBy: string;
    CreationDate: string;
    LastUpdatedBy: string;
    LastupdatedDate: string;
    Guid: string;
    IsChanged: boolean;
}

export interface ClientAppDTO
{
    ClientAppId: number;
    AppId: string;
    AppName: string;
    Active: boolean;
    CreatedDate: string;
    CreatedBy: string;
    LastUpdatedDate: string;
    LastUpdatedBy: string;
    Guid: string;
    SiteId: number;
    MasterEntityId: number;
    SynchStatus: boolean;
    IsChanged: boolean;  
}

export interface ClientAppUserDTO
{
    ClientAppUserId: number;
    ClientAppId: number;     
    UserId: number;
    CustomerId: number;
    DeviceGuid: string;
    DeviceType: string;
    UserSignedIn: boolean;
    IsActive: boolean;
    CreatedDate: string;
    CreatedBy: string;
    LastUpdatedDate: string;
    LastUpdatedBy: string; 
    Guid: string;
    SiteId: number;
    MasterEntityId: number;
    SynchStatus: boolean
}