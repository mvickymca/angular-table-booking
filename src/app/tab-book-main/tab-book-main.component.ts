import { Component, OnInit } from '@angular/core';
import { tableInfo } from './tableInfo';

@Component({
  selector: 'app-tab-book-main',
  templateUrl: './tab-book-main.component.html',
  styleUrls: ['./tab-book-main.component.css']
})
export class TabBookMainComponent implements OnInit {

  tableInfos:tableInfo[]=[
    {
      "tableId":"1",
      "isAvailable":true,
      "capacity": 5,
      "bookingInfo":null

    }, {
      "tableId":"2",
      "isAvailable":true,
      "capacity": 5,
      "bookingInfo":null

    },
    {
      "tableId":"3",
      "isAvailable":true,
      "capacity": 5,
      "bookingInfo":null

    },
    {
      "tableId":"4",
      "isAvailable":false,
      "capacity": 5,
      "bookingInfo":{
        "phoneNumber":"7684763876",
        "name":"Kavin Subramanian",
        "guestTotal": 4,
        "bookedFor":"Break Fast"
      }

    }, {
      "tableId":"5",
      "isAvailable":true,
      "capacity": 5,
      "bookingInfo":null

    }, {
      "tableId":"6",
      "isAvailable":true,
      "capacity": 5,
      "bookingInfo":null

    }
    
    
  ];


  constructor() { }

  ngOnInit(): void {
    console.log("NgOnInit Method is running");
  }

}
