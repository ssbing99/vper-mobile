import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { ServiceProvider } from '../../providers/service/service';
import { Storage } from '@ionic/storage';

/**
 * Generated class for the BookingDetailChefPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-booking-detail-chef',
  templateUrl: 'booking-detail-chef.html',
})
export class BookingDetailChefPage {
  public user: any = [];
  public params: any = [];
  public bookingDetail:any=[];
  public allDetails:any=[];
  constructor(
    public navCtrl: NavController,
    public service: ServiceProvider,
    public storage: Storage,
    public events: Events,
    public navParams: NavParams
  ) {
    this.storage.get('user').then((data) => {
      this.user = data;
    });
    this.params = this.navParams.get('bookingDetail');
    this.bookingDetail=[];
    this.bookingDetail['dish']=[];
    this.bookingDetail['user']=[];
    this.bookingDetail['order']=[];

  }

  ionViewDidLoad() {
    setTimeout(()=>{
      this.params['user_type'] = 'chef';
      this.params['chef_id'] = this.user['id'];
      this.service.getBookingDetail(this.params);
    },100);
    
  }
  ngOnInit() {
    this.callAllSubscribe(this.events);
  }
  callAllSubscribe(events) {
    events.subscribe('bookingDetail_chef', object => {
      if (object !== null) {
        this.bookingDetail=object['data'];
        if(object['data']['order']['booking_detail']!==undefined){
          this.allDetails=object['data']['order']['booking_detail'];
          this.allDetails = JSON.parse(this.allDetails);
          console.log(this.allDetails.total_person);
        }
      }
    });
  }
}