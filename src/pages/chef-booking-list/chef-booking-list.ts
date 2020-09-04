import { Component } from '@angular/core';
import { IonicPage, NavController, Events, Platform } from 'ionic-angular';
import { ServiceProvider } from '../../providers/service/service';
import { Storage } from '@ionic/storage';
import { ChefChatPage } from '../chef-chat/chef-chat';
import { BookingDetailChefPage } from '../booking-detail-chef/booking-detail-chef';
import { PastChatPage } from '../past-chat/past-chat';

/**
 * Generated class for the ChefBookingListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-chef-booking-list',
  templateUrl: 'chef-booking-list.html',
})
export class ChefBookingListPage {
  public total_income='active item item-block item-ios';
  public class_nok = 'item item-block item-ios';
  public loadingObj:any;
  public showData:boolean=true;
  public currentBookingData:any=[];
  public user:any=[];
  public type:string='cur';
  constructor(
    public navCtrl: NavController,
     public service:ServiceProvider,
     public events:Events,
     public storage:Storage,
     private platform: Platform
    ) {
      
  }

  ionViewDidLoad() {
    this.storage.get('user').then((data) => {
      this.user=data;
      var today = new Date();
      today.setHours(0, 0, 0, 0);

      this.service.getCurrentChefBooking({
        "chef_id":this.user['id'],
        "datetime": today
      });
    });
  }
  ngOnInit() {
   this.callAllSubscribe(this.events);
  }
  callAllSubscribe(events) {
    events.subscribe('chef_booking_list', object => {
      if(object!==null){
        if (object.data != null) {
          object.data.forEach(data => {
            if (this.platform.is('ios')) {
              const tempDate = data.book_date.split("-");
              data.book_date = tempDate[1] + "/" + tempDate[2] + "/" + tempDate[0]
            }
            data.bookingDate = Date.parse(data.book_date + " " + data.book_time + " GMT")
            if (data.discount_ammount != null && Number(data.discount_ammount) > 0) {
              data.bookingFee = data.discount_ammount
            } else {
              data.bookingFee = data.total_price
            }
          })
          this.currentBookingData=object.data;
        } else {
          this.currentBookingData = [];
        }
      }
    });

    events.subscribe('updateChefBooking', () => this.getData('recent'))
  }
  getData(type:any){
    let ojData = this;
    ojData.showData=false;
    this.type=type;
    setTimeout(function(){
      var today = new Date();
      today.setHours(0, 0, 0, 0);

      if(type=='past'){
        ojData.service.getPastChefBooking({
          "chef_id":ojData.user['id'],
          "datetime": today
        });
        ojData.total_income='item item-block item-ios';
        ojData.class_nok = 'active item item-block item-ios';
      } else {
        ojData.service.getCurrentChefBooking({
          "chef_id":ojData.user['id'],
          "datetime": today
        });
        ojData.class_nok='item item-block item-ios';
        ojData.total_income = 'active item item-block item-ios';
      }
      ojData.showData=true;
    },1);
  }
  openChat(user_id,order_id){
    this.navCtrl.push(PastChatPage,{"data":{"user_id":user_id,"order_id":order_id}});
  }
  openBookingDetail(bookingData){
    var params={
      order_id:bookingData['order_id'],
      id:bookingData['id'],
    }
    this.navCtrl.push(BookingDetailChefPage,{bookingDetail:params})
  }
}
