import { Component } from '@angular/core';
import { IonicPage, NavController, Events } from 'ionic-angular';
import { ServiceProvider } from '../../providers/service/service';
/**
 * Generated class for the WeekPayPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-week-pay',
  templateUrl: 'week-pay.html',
})
export class WeekPayPage {
  public weekPay:any=[];
  constructor(
    public navCtrl: NavController,
    public service:ServiceProvider,
    public events:Events
  ) {
    this.service.getChefWalletTwoWeek();
  }

  ionViewDidLoad() {

  }
  ngOnInit() {
    this.callAllSubscribe(this.events);
  }
  callAllSubscribe(events) {
    events.subscribe('chef_wallet_two_week', object => {
      if (object != null) {
        this.weekPay = object['data'];

      }
    });
  }
}
