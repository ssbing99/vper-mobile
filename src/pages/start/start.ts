import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { MediaRequestPage } from '../media-request/media-request';
import { ChefAccountPage } from '../chef-account/chef-account';
import { WelcomePage } from '../welcome/welcome';
import { WelcomeConceptPage } from '../welcome-concept/welcome-concept';
/**
 * Generated class for the StartPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-start',
  templateUrl: 'start.html',
})
export class StartPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  openNextPage(type:any){
    var page : any;
    if(type =="Business"){
      page = WelcomeConceptPage;
    } else if(type =="Media"){
      page = MediaRequestPage;
    } else if(type =="chef_account"){
      page = ChefAccountPage;
    } else {
      page = WelcomePage;
    }
    this.navCtrl.push(page);
  }

}
