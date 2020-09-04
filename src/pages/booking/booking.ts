import { Component } from '@angular/core';
import { IonicPage, NavController, LoadingController, Events,ActionSheetController, Platform } from 'ionic-angular';
import { ServiceProvider } from '../../providers/service/service';
import { Storage } from '@ionic/storage';
import { ChatPage } from '../chat/chat';
import { PastChatPage } from '../past-chat/past-chat';

/**
 * Generated class for the BookingPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-booking',
  templateUrl: 'booking.html',
})
export class BookingPage {
  public total_income='active item item-block item-ios';
  public class_nok = 'item item-block item-ios';
  public loadingObj:any;
  public showData:boolean=true;
  public currentBookingData:any=[];
  public user:any=[];
  public openpopup:boolean=false;
  public chef_image:string='';
  public chef_id:number=0;
  public review_text:string='';
  public order_id:number=0;
  public type:string='cur';
  public review_num:number =0;
  constructor(public navCtrl: NavController,
     public loading: LoadingController,
     public service:ServiceProvider,
     public events:Events,
     public storage:Storage,
     public actionSheetCtrl:ActionSheetController,
     private platform: Platform
    ) {
      
  }

  ionViewDidLoad() {
    this.storage.get('user').then((data) => {
      this.user=data;
      var today = new Date();
      today.setHours(0, 0, 0, 0);
      
      this.service.getCurrentUserBooking({
        "user_id":this.user['id'],
        "datetime": today
      });
    });
  }
  ngOnInit() {
    this.callAllSubscribe(this.events);
  }
  callAllSubscribe(events) {
    events.subscribe('current_booking_list', object => {
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

    events.subscribe('updateBooking', () => this.getData('recent'))
  }
  getData(type:any){
    let ojData = this;
    ojData.showData=false;
    setTimeout(function(){
      var today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if(type=='past'){
        ojData.type='past';
        ojData.service.getPastUserBooking({
          "user_id":ojData.user['id'],
          "datetime": today
        });
        ojData.total_income='item item-block item-ios';
        ojData.class_nok = 'active item item-block item-ios';
      } else {
        ojData.type='cur';
        ojData.service.getCurrentUserBooking({
          "user_id":ojData.user['id'],
          "datetime": today
        });
        ojData.class_nok='item item-block item-ios';
        ojData.total_income = 'active item item-block item-ios';
      }
      ojData.showData=true;
    },1);
  }
  openChat(user_id,order_id){

    if(this.type=='past'){
      this.navCtrl.push(PastChatPage,{"data":{"user_id":user_id,"order_id":order_id}});
    } else {
      this.navCtrl.push(PastChatPage,{"data":{"user_id":user_id,"order_id":order_id}});
    }
    
  }
  presentActionSheet(chef_id,image,order_id) {
    this.chef_id=chef_id;
    this.chef_image=image;
    this.order_id=order_id;
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Select an option',
     buttons: [
       {
         text: 'Open Chat',
         handler: () => {
           this.openChat(chef_id,order_id)
         }
       },
       {
         text: 'Give Review',
         handler: () => {
           this.openReviewPopup();
         }
       },
       {
         text: 'Cancel',
         role: 'cancel',
         handler: () => {
         }
       }
     ]
    });
    actionSheet.present();
  }
  openReviewPopup(){
    this.openpopup=true;
    
  }
  saveReview(){
    var params = {
      "user_id":this.user['id'],
      "chef_id":this.chef_id,
      "name":'',
      "ratings":this.review_num,
      "review_text":this.review_text,
      "order_id":this.order_id
    }
    this.service.saveReview(params);
    this.closepopup();
  }
  closepopup(){
    this.chef_id=0;
    this.chef_image='';
    this.review_text='';
    this.openpopup=false;
    this.review_num=0;
  }
  setValue(num){
    this.review_num=num;
  }
}
