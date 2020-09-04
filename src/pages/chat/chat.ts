import { Component, ViewChild, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, Navbar, Events, Content } from 'ionic-angular';
import { ServiceProvider } from '../../providers/service/service';
import { HireChefPage } from '../../pages/hire-chef/hire-chef';
import { Storage } from '@ionic/storage';
import { ChatProvider } from '../../providers/chat/chat';

/**
 * Generated class for the ChatPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-chat',
  templateUrl: 'chat.html',
})
export class ChatPage {
  chefId:number;
  chatText='';
  public user:any;
  public chatData:any[] = [];
  public page:number=1;
  public infiniteScroll:any;
  public last_id:number=0;
  public interval:any;
  public fromUserImage:string='';
  public toUserImage:string='';
  public type:string='';
  public view_type:string='cur';
  public inProccess:boolean=false;
  public savedList:boolean=false;
  @ViewChild(Navbar) navBar: Navbar;
  @ViewChild(Content) contentArea: Content;
  @ViewChild(Content) content: Content;
  constructor(
    public navCtrl: NavController,
     public navParams: NavParams,
     public service : ServiceProvider,
     public storage:Storage,
     public events:Events,
     public chatservice:ChatProvider,
     private ngZone: NgZone
    ) {
    this.chefId = this.navParams.get('chef_id');
    this.toUserImage = this.navParams.get('toImage');
    this.type = this.navParams.get('type') !==undefined ? this.navParams.get('type') : '';
    this.view_type = this.navParams.get('view_type') !==undefined ? this.navParams.get('view_type') : 'cur';
  }
  closeMenu() {
    this.navCtrl.pop();
  }

  StartChat(){
    if(this.chatText!==undefined && this.chatText!==""){
      var params = {
        "user_id_from":this.user.id,
        "user_id_to":this.chefId,
        "message":this.chatText,
        "type":"user"
      }
      this.inProccess=true;
      this.chatData.push(params);
      this.chatservice.getChatExist(this.chefId, this.user.id);
      //this.service.startChat(params);
      if(this.savedList==false){
        let saveParamsData ={
          "user_id_from":this.user.id,
          "user_id_to":this.chefId
        }
        this.service.saveChastListData(saveParamsData);
        this.savedList=true;
      }
      this.chatservice.addnewmessage(this.chatText,this.user.id, this.chefId).then(() => {
        this.content.scrollToBottom();
        this.chatText = '';
      })
      this.chatText='';
    }
  }

  getChat(page){
    // var params = {
    //   "user_id_from":this.user['id'],
    //   "user_id_to":this.chefId,
    //   "page":this.page
    // }
    this.chatservice.getbuddymessages(this.user.id, this.chefId);
    if(this.inProccess==false){
      this.inProccess=true;
      //this.service.getChat(params,'user');
    }
  }

  ngOnInit() {
    this.callAllSubscribe(this.events);
    // var objThis =this;
    // this.interval=setInterval(function(){
    //   if(objThis.inProccess==false){
    //   var params = {
    //     "user_id_from":objThis.user['id'],
    //     "user_id_to":objThis.chefId,
    //     "chat_last_id":objThis.last_id
    //   }
    //   objThis.service.getLatestChat(params);
    // }
    // },6000);
  }
  callAllSubscribe(events) {
    events.subscribe('savedChatDataUser',object=>{
      this.inProccess=false;
      if(object!==null){
        this.last_id=object.dataid;
      }
    });
    events.subscribe('chatData', object => {
      this.inProccess=false;
      this.ngZone.run(() => {
        this.chatData = this.chatservice.buddymessages;
        this.scrollToBottom();
      });
    });
    events.subscribe('LatestChat', object => {
      this.inProccess=false;
      if (object != null && object.status==200) {
          if(object.data!==undefined){
            let objChatData = object.data;
          if(objChatData.length > 0){
            if(object.last_id!==undefined){
              this.last_id=object.last_id;
            }
            
            for(var i=0;i<objChatData.length;i++){
              var classData = "item-start";
              if(objChatData[i].user_id_from === this.user.id){
                classData="item-end"
              }
              objChatData[i].classAttr = classData;
              this.chatData.push(objChatData[i]);
              if(this.infiniteScroll){
                this.infiniteScroll.complete();
              }
              
            }

              //this.scrollToBottom();
          } else {

          }
        }
      }
    });
    events.subscribe('chatExist', data => {
      if (data.length == 0) {
        this.savedList = false; // to re-create new chat
      }
    });
  }
  openHirePage(){
    this.navCtrl.push(HireChefPage,{chef_id:this.chefId, type:this.type});
  } 
  doInfinite(infiniteScroll){
    this.page=this.page+1;
    this.infiniteScroll = infiniteScroll;
    this.getChat(this.page);
    if(this.infiniteScroll){
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
  ionViewDidLeave(){
    clearInterval(this.interval);
    this.chatservice.offListener(this.user.id, this.chefId);
    this.events.unsubscribe('chatData');
    this.events.unsubscribe('chatExist');
    this.events.unsubscribe('savedChatDataUser');
    this.events.unsubscribe('LatestChat');
  }

  ionViewDidEnter() {
    this.storage.get('user').then((data)=>{
      this.user = data;
      this.fromUserImage = this.user['user_image'];
      this.getChat(1);
    });
  }
}
