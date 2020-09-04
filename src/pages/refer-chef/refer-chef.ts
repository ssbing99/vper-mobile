import { Component } from '@angular/core';
import { IonicPage, NavController, ToastController, Events } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { ServiceProvider } from '../../providers/service/service';
/**
 * Generated class for the ReferChefPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-refer-chef',
  templateUrl: 'refer-chef.html',
})
export class ReferChefPage {
  public user:any[];
  public referalData:any=[];
  constructor(
    public navCtrl: NavController,
     public storage: Storage,
     public toast:ToastController,
     public service:ServiceProvider,
     public events:Events//this.user['user_referal_code']
    ) {
    this.user =[];
    this.storage.get("user").then((val)=>{
      this.user=val;
      this.service.getReffrelData({"referal_code":this.user['user_referal_code']});
    });
  }

  ngOnInit() {
    this.callAllSubscribe(this.events);
  }
  callAllSubscribe(events) {
    events.subscribe('refreal_data', object => {
      if (object != null) {
        this.referalData = object['data'];
      }
    });
  }
  ionViewDidLoad() {
    
  }
  copyToClipBoard(){
    //var clipBoardText = document.getElementById("refral_chef_text");
    
    document.execCommand("copy");
    let toast = this.toast.create({
      message: 'Text Copied successfully!',
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }
}
