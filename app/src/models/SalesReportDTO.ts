export  default class SalesReportDTO{
  

   
    SiteId:number;
    SiteName:string;
    CollectionToday:number;
    CollectionPreviousDay:number;
    GamePlayToday:number;
    GamePlayPreviousDay:number;
    PosCollection:any;
    CollectionWeek:number;
    CollectionPreviousWeek:number;
    GamePlayWeek:number;
    GamePlayPreviousWeek:number;
    



    constructor(data: any) {
       this.SiteId=data.SiteId,
       this.SiteName=data.SiteName
       this.CollectionToday=data.CollectionToday;
       this.CollectionPreviousDay=data.CollectionPreviousDay;
       this.GamePlayToday=data.GamePlayToday;
       this.GamePlayPreviousDay=data.GamePlayPreviousDay;
       this.CollectionWeek=data.CollectionWeek;
       this.CollectionPreviousWeek=data.CollectionPreviousWeek
       this.GamePlayWeek=data.GamePlayWeek;
       this.GamePlayPreviousWeek=data.GamePlayPreviousWeek;
       this.PosCollection=data?.posCollection??[]
       

    }
}