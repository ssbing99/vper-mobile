import { Component } from '@angular/core';
import { IonicPage, NavController, Events } from 'ionic-angular';
import { ServiceProvider } from '../../providers/service/service';
import { Storage } from '@ionic/storage';

/**
 * Generated class for the CommonTipsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-common-tips',
  templateUrl: 'common-tips.html',
})
export class CommonTipsPage {
  public user:any=[];
  public arrData:any[];
  constructor(
    public navCtrl: NavController, 
    public service: ServiceProvider,
    public storage:Storage,
    public events:Events
  ) {
    
  }

  ionViewDidLoad() {
    this.storage.get('user').then((data)=>{
      this.user=data;
      var params={
        "chef_id":this.user['id']
      }
      this.service.getCommonTipsData(params);
    });
  }
  ngOnInit() {
    this.callAllSubscribe(this.events);
  }
  callAllSubscribe(events) {
    events.subscribe('chef_commontips_data', object => {
      if (object != null && object.status==200) {
          let objChatData = object.data;
          this.arrData=objChatData;
          } else {
          }
      });
    }
}
