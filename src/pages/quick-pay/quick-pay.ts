import { Component } from '@angular/core';
import { IonicPage, NavController, Events } from 'ionic-angular';
import { ServiceProvider } from '../../providers/service/service';

/**
 * Generated class for the QuickPayPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-quick-pay',
  templateUrl: 'quick-pay.html',
})
export class QuickPayPage {
  public weekPay:any=[];
  constructor(
    public navCtrl: NavController,
    public service:ServiceProvider,
    public events:Events
  ) {
    this.service.getChefWallet();
  }

  ionViewDidLoad() {
  }
  ngOnInit() {
    this.callAllSubscribe(this.events);
  }
  callAllSubscribe(events) {
    events.subscribe('chef_wallet', object => {
      if (object != null && object['data'] != null) {
        this.weekPay = object['data'];
      }
    });
  }
}
