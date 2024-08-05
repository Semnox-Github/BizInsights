export class ClientAppVersionMappingDTO {
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

    constructor(data: any) {
        this.ClientAppVersionMappingId = data.ClientAppVersionMappingId;
        this.AppId = data.AppId;
        this.ClientId = data.ClientId;
        this.Deprecated=data.Deprecated;
        this.ReleaseNumber=data.ReleaseNumber;
        this.TokenizationKey=data.TokenizationKey;
        this.SecurityCode=data.SecurityCode;
        this.ApiKey=data.ApiKey;
        this.GateWayURL=data.GateWayURL;
        this.IsActive=data.IsActive;
        this.CreatedBy=data.CreatedBy;
        this.CreationDate=data.CreationDate;
        this.LastUpdatedBy=data.LastUpdatedBy;
        this.LastupdatedDate=data.LastupdatedDate;
        this.Guid=data.Guid;
        this.IsChanged=data.IsChanged;

    }
}