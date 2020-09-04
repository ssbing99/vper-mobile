import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { QuickPayPage } from '../quick-pay/quick-pay';
import { WeekPayPage } from '../week-pay/week-pay';
import { CommonTipsPage } from '../common-tips/common-tips';

/**
 * Generated class for the MyEarningDashboardPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-my-earning-dashboard',
  templateUrl: 'my-earning-dashboard.html',
})
export class MyEarningDashboardPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  openNextPage(type:any){
    var page:any;
    if(type=='quick'){
      page = QuickPayPage
    } else if(type=='2nd'){
      page = WeekPayPage
    } else if(type=='common'){
      page = CommonTipsPage
    }
    this.navCtrl.push(page);
  }

}
