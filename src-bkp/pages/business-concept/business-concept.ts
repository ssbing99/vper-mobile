import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ChefAccountPage } from '../chef-account/chef-account';

/**
 * Generated class for the BusinessConceptPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-business-concept',
  templateUrl: 'business-concept.html',
})
export class BusinessConceptPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  activatePage(){
    this.navCtrl.setRoot(ChefAccountPage);
  }

}
