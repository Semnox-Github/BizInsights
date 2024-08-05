export default class PosDailyCollectionDTO {
    PosMachine:              string;
    PresentPosCollection:         number;
    PastPosCollection:   number;
    PresentPosConsumption:           number;
    PreviousPosConsumption:     number;
   
    constructor(data:any)
    {
        this.PosMachine=data.PosMachine;
        this.PresentPosCollection=data.CollectionToday;
        this.PastPosCollection=data.CollectionPreviousDay;
        this.PresentPosConsumption=data.GamePlayToday;
        this.PreviousPosConsumption=data.GamePlayPreviousDay;

    }
}