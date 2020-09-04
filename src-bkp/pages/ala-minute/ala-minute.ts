import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { OurChefsPage } from '../our-chefs/our-chefs';
import { AlaMinuteMapPage } from '../ala-minute-map/ala-minute-map';
/**
 * Generated class for the AlaMinutePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-ala-minute',
  templateUrl: 'ala-minute.html',
})
export class AlaMinutePage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  openPage(type:any){
    if(type=='plane'){
      this.navCtrl.setRoot(OurChefsPage);
    } else {
      this.navCtrl.setRoot(AlaMinuteMapPage);
    }
  }

}
