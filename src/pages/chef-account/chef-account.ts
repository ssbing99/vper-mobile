import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { MemberUpgradePage } from '../member-upgrade/member-upgrade';

/**
 * Generated class for the ChefAccountPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-chef-account',
  templateUrl: 'chef-account.html',
})
export class ChefAccountPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  redirect(){
    this.navCtrl.push(MemberUpgradePage);
  }

}
