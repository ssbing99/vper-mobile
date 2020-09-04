import { Component } from '@angular/core';
import { IonicPage, NavController, LoadingController, Events,ActionSheetController } from 'ionic-angular';
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
     public actionSheetCtrl:ActionSheetController
    ) {
      
  }

  ionViewDidLoad() {
    this.storage.get('user').then((data) => {
      this.user=data;
      this.service.getCurrentUserBooking({"user_id":this.user['id']});
    });
  }
  ngOnInit() {
    
    
    this.callAllSubscribe(this.events);
  }
  callAllSubscribe(events) {
    events.subscribe('current_booking_list', object => {
      if(object!==null){
        this.currentBookingData=object.data;
      }
    });
    
  }
  getData(type:any){
    let ojData = this;
    ojData.showData=false;
    setTimeout(function(){
      if(type=='past'){
        ojData.type='past';
        ojData.service.getPastUserBooking({"user_id":ojData.user['id']});
        ojData.total_income='item item-block item-ios';
        ojData.class_nok = 'active item item-block item-ios';
      } else {
        ojData.type='cur';
        ojData.service.getCurrentUserBooking({"user_id":ojData.user['id']});
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
