
import PosWeeklyCollectionDTO from './PosWeeklyCollectionDTO'

export  default class WeeklyCollectionReportDTO {
  

   
    SiteId:number;
    SiteName:string;
    PresentCollection:number;
    PastCollection:number;
    PresentConsumption:number;
    PastConsumption:number;
    PosCollections:any;



    constructor(data: any) {
       this.SiteId=data.SiteId,
       this.SiteName=data.SiteName
       this.PresentCollection=data.CollectionWeek;
       this.PastCollection=data.CollectionPreviousWeek
       this.PresentConsumption=data.GamePlayWeek;
       this.PastConsumption=data.GamePlayPreviousWeek;
       this.PosCollections=data.posCollection.length>0? data.posCollection.map((ele)=>new  PosWeeklyCollectionDTO(ele)):[];
       

    }
}



