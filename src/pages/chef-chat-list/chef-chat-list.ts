import { Component } from '@angular/core';
import { IonicPage, NavController, Events, AlertController } from 'ionic-angular';
import { ChefChatPage } from '../chef-chat/chef-chat';
import { ServiceProvider } from '../../providers/service/service';
import { Storage } from '@ionic/storage';
import { Message } from '@angular/compiler/src/i18n/i18n_ast';
import { text } from '@angular/core/src/render3/instructions';
import { ChatProvider } from '../../providers/chat/chat';
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
  public chatData: any = [];
  constructor(
    public navCtrl: NavController,
    public service: ServiceProvider,
    public storage: Storage,
    public events: Events,
    private alertCtrl: AlertController,
    private chatProvider: ChatProvider
  ) {
    this.storage.get('user').then((data) => {
      this.user = data;
      let params = {
        "user_id_to": this.user['id']
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
      if (object != null && object.status == 200) {
        let objChatData = object.data;
        this.chatData = objChatData;
        console.log('chatData',this.chatData);

      } else {

      }
    });
    events.subscribe('remove-chat', object => {
      if (object != null && object.status == 200) {
        let params = {
          "user_id_to": this.user['id']
        };
        this.service.getChatList(params);

      } else {

      }
    });
  }
  openChatPage(userId: any, toImage) {
    this.navCtrl.push(ChefChatPage, { "userId": userId, "toImage": toImage });
  }

  deleteChatlist(listId: any, toId: any) { //add vinod down
    console.log("delete item index= " + listId)
    let alert = this.alertCtrl.create({
      title: 'Alert !!',
      message: 'Do you want to Delete ?',
      buttons: [{
        text: 'Cancel',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      },
      {
        text: 'Delete',
        handler: () => {
          if (listId >= 0) {
            var params = {
              chatId: listId
            }
            console.log(params);
            this.service.removeChatList(params);
            this.chatProvider.removeChat(this.user['id'], toId);
          }
          console.log('Deleted index', this.chatData);


        }
      }

      ]

    });
    alert.present();
  }



}
