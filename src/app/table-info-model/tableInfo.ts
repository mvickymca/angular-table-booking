export interface bookingInfo {
    phoneNumber:String;
    name:String;
    guestTotal:String;
    bookedFor:String;
  }

export interface tableInfo
{
    tableId: String;
    isAvailable:Boolean;
    capacity: Number,
    bookingInfo:bookingInfo;
}