import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { EditProfilePage } from '../edit-profile/edit-profile';
import { ServiceProvider } from '../../providers/service/service';
import { ListPage } from '../list/list';
import { ViewReviewsPage } from '../view-reviews/view-reviews';
/**
 * Generated class for the ProfileManagementPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-profile-management',
  templateUrl: 'profile-management.html',
})
export class ProfileManagementPage {

  constructor(public navCtrl: NavController,public service:ServiceProvider) {
  }

  openNextPages(type:any){
    var page : any;
    if(type=='edit'){
      page = EditProfilePage;
    } else if(type=='choice'){
      page = ListPage;
    } else {
      page = ViewReviewsPage;
    }
    this.navCtrl.push(page);
  }

}
