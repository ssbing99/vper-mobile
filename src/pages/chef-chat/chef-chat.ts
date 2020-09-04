import { Component, ViewChild, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, Content, Events, Navbar } from 'ionic-angular';
import { ServiceProvider } from '../../providers/service/service';
import { Storage } from '@ionic/storage';
import { ChatProvider } from '../../providers/chat/chat';
/**
 * Generated class for the ChefChatPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-chef-chat',
  templateUrl: 'chef-chat.html',
  queries: {
    content: new ViewChild('content'),
  }
})
export class ChefChatPage {
  chefId: number;
  chatText = '';
  public user: any;
  public chatData: any = [];
  public page: number = 1;
  public infiniteScroll: any;
  public last_id: number = 0;
  descending: boolean = true;
  order: -1;
  column: string = 'id';
  public interval: any;
  public fromUserImage: string = '';
  public toUserImage: string = '';
  public type: string = 'cur';
  public inProccess: boolean = false;
  @ViewChild(Navbar) navBar: Navbar;
  @ViewChild(Content) contentArea: Content;
  @ViewChild(Content) content: Content;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public service: ServiceProvider,
    public storage: Storage,
    public events: Events,
    public chatservice:ChatProvider,
    private ngZone: NgZone
  ) {
    this.chefId = this.navParams.get('userId');
    this.toUserImage = this.navParams.get('toImage');
    this.type = (this.navParams.get('type') !== undefined) ? this.navParams.get('type') : 'cur';
  }
  closeMenu() {
    this.navCtrl.pop();
  }
  StartChat() {
    if (this.chatText !== undefined && this.chatText !== "") {
      var params = {
        "user_id_from": this.user['id'],
        "user_id_to": this.chefId,
        "message": this.chatText,
        "type": "chef"
      }
      this.chatData.push(params);
      //this.service.startChat(params);
      this.chatservice.addnewmessage(this.chatText,this.user['id'],this.chefId).then(() => {
        this.content.scrollToBottom();
        this.chatText = '';
      })
      this.chatText='';
      //this.service.startChat(params);
      // this.chatText = '';
      // this.chatData.push(params);
      //this.scrollToBottom();
    }
  }
  getChat() {
    // var params = {
    //   "user_id_from": this.user['id'],
    //   "user_id_to": this.chefId,
    //   "page": this.page
    // }
    if (this.inProccess == false) {
      this.inProccess = true;
      //this.service.getChat(params, 'chef');
      this.chatservice.getChefdata(this.user['id'],this.chefId);
    }
  }
  ngOnInit() {
    this.callAllSubscribe(this.events);
    // var objThis = this;
    // this.interval = setInterval(function () {
    //   if (objThis.inProccess == false) {
    //     var params = {
    //       "user_id_from": objThis.user['id'],
    //       "user_id_to": objThis.chefId,
    //       "chat_last_id": objThis.last_id
    //     }
    //     objThis.service.getLatestChat(params);
    //   }

    // }, 6000);
  }

  callAllSubscribe(events) {
    events.subscribe('savedChatDataUser', object => {
      this.inProccess = false;
      if (object !== null) {
        this.last_id = object.dataid;
      }
    });
    events.subscribe('chefchatData', object => {
      this.inProccess = false;
      this.ngZone.run(() => {
        this.chatData=this.chatservice.buddymessages;
        this.scrollToBottom();
      });
      // if (object != null && object.status == 200) {
      //   if (object.from_user_image !== undefined) {
      //     this.fromUserImage = object.from_user_image;
      //     this.toUserImage = object.to_user_image;
      //   }

      //   if (object.data !== undefined) {
      //     let objChatData = object.data;
      //     if (objChatData.length > 0) {
      //       if (object.last_id !== undefined) {
      //         this.last_id = object.last_id;
      //       }

      //       for (var i = 0; i < objChatData.length; i++) {
      //         var classData = "item-start";
      //         if (objChatData[i]['user_id_from'] === this.user['id']) {
      //           classData = "item-end"
      //         }
      //         objChatData[i]['classAttr'] = classData;
      //         this.chatData.push(objChatData[i]);


      //       }
      //       setTimeout(() => {
      //         console.log(this.chatData);
      //         //this.chatData.reverse();
      //       }, 300);
      //       if (this.page <= 1) {
      //         //this.chatData.reverse();
      //         this.scrollToBottom();
      //       }
      //     } else {

      //     }
      //   }
      // }
    });
    events.subscribe('LatestChat', object => {
      this.inProccess = false;
      if (object != null && object.status == 200) {
        if (object.data !== undefined) {
          let objChatData = object.data;
          if (objChatData.length > 0) {
            if (object.last_id !== undefined) {
              this.last_id = object.last_id;
            }

            for (var i = 0; i < objChatData.length; i++) {
              var classData = "item-start";
              if (objChatData[i]['user_id_from'] === this.user['id']) {
                classData = "item-end"
              }
              objChatData[i]['classAttr'] = classData;
              this.chatData.push(objChatData[i]);
              if (this.infiniteScroll) {
                this.infiniteScroll.complete();
              }

            }

            //this.scrollToBottom();
          } else {

          }
        }
      }
    });
  }
  doInfinite(infiniteScroll) {
    this.page = this.page + 1;
    this.infiniteScroll = infiniteScroll;
    this.getChat();
    if (this.infiniteScroll) {
      this.infiniteScroll.complete();
    }
  }
  scrollToBottom() {
    setTimeout(() => {
      if (this.content.scrollToBottom) {
        this.content.scrollToBottom();
      }
    }, 400)
  }
  ionViewDidLeave() {
    clearInterval(this.interval);
    this.chatservice.offListener(this.user['id'], this.chefId);
    this.events.unsubscribe('chefchatData');
    this.events.unsubscribe('savedChatDataUser');
    this.events.unsubscribe('LatestChat');
  }

  ionViewDidEnter() {
    this.storage.get('user').then((data) => {
      this.user = data;
      this.fromUserImage=this.user['user_image'];
      this.getChat();
    });
  }
}
