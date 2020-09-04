import { Component } from '@angular/core';
import { IonicPage, ViewController } from 'ionic-angular';

/**
 * Generated class for the PrivacyPolicyPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-privacy-policy',
  templateUrl: 'privacy-policy.html',
})
export class PrivacyPolicyPage {

  constructor(
    public viewCtrl:ViewController
  ) {
    
  }

  ionViewDidLoad() {
    
  }
  dismiss() {
    this.viewCtrl.dismiss();
  }

}
