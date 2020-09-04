import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

/**
 * Generated class for the UserPrivacyPolicyPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-user-privacy-policy',
  templateUrl: 'user-privacy-policy.html',
})
export class UserPrivacyPolicyPage {

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl:ViewController
    ) {
  }

  ionViewDidLoad() {

  }
  dismiss() {
    this.viewCtrl.dismiss();
  }
}
