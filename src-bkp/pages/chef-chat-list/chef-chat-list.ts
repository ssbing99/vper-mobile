import { Component } from '@angular/core';
import { IonicPage, NavController, Events } from 'ionic-angular';
import { ChefChatPage } from '../chef-chat/chef-chat';
import { ServiceProvider } from '../../providers/service/service';
import { Storage } from '@ionic/storage';
/**
 * Generated class for the ChefChatListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-chef-chat-list',
  templateUrl: 'chef-chat-list.html',
})
export class ChefChatListPage {
  public user;
  public chatData:any=[];
  constructor(
    public navCtrl: NavController,
    public service:ServiceProvider,
    public storage:Storage,
    public events:Events
  ) {
    this.storage.get('user').then((data)=>{
      this.user=data;
      let params={
        "user_id_to":this.user['id']
      };
      this.service.getChatList(params);
    });
    
  }

  ionViewDidLoad() {
  }
  ngOnInit() {
    this.callAllSubscribe(this.events);
  }
  callAllSubscribe(events) {
    events.subscribe('chefChatList', object => {
      if (object != null && object.status==200) {
          let objChatData = object.data;
          this.chatData=objChatData;
          } else {

          }
      });
    }
  openChatPage(userId:any,toImage){
    this.navCtrl.push(ChefChatPage,{"userId":userId,"toImage":toImage});
  }
}
