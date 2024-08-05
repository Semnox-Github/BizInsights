export default class PosWeeklyCollectionDTO {
    PosMachine:              string;
    PresentPosCollection:         number;
    PastPosCollection:   number;
    PresentPosConsumption:           number;
    PreviousPosConsumption:     number;
    constructor(data:any)
    {
        this.PosMachine=data.PosMachine;
        this.PresentPosCollection=data.CollectionWeek;
        this.PastPosCollection=data.CollectionPreviousWeek;
        this.PresentPosConsumption=data.GamePlayWeek;
        this.PreviousPosConsumption=data.GamePlayPreviousWeek;
    }
}