import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, Content, Platform } from 'ionic-angular';
import { ServiceProvider } from '../../providers/service/service';
import { Storage } from '../../../node_modules/@ionic/storage';

/**
 * Generated class for the PastChatPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-past-chat',
  templateUrl: 'past-chat.html',
  queries: {
    content: new ViewChild('content'),
  }
})
export class PastChatPage {

  public chatData:any=[];
  public user:any=[];
  public paramsData:any=[];
  public fromImage:string='';
  public toImage:string='';
  @ViewChild(Content) content: Content;
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public service: ServiceProvider,
    public events:Events,
    public storage:Storage,
    private platform: Platform
  ) {
    this.storage.get('user').then((data)=>{
      this.user=data;
      this.paramsData=this.navParams.get('data');
      let params = {
        "user_id_to":this.paramsData['user_id'],
        "user_id_from":this.user['id'],
        "order_id":this.paramsData['order_id']
      }
      this.service.getPastChatData(params);
    });
    
  }

  ionViewDidLoad() {
    
  }
  ngOnInit() {
    this.callAllSubscribe(this.events);
  }
  callAllSubscribe(events) {
    events.subscribe('pastChatData', object => {
      if (object != null) {
        this.chatData = object['data'];
        this.fromImage=object['fromImage'];
        this.toImage=object['toImage'];

        if (this.chatData != null) {
          this.chatData.forEach(chat => {
            if (this.platform.is('ios')) {
              const temp = chat.date.split(" ");
              const tempDate = temp[0].split("-");
              chat.date = tempDate[1] + "/" + tempDate[2] + "/" + tempDate[0] + " " + temp[1];
            }
            chat.timestamp = Date.parse(chat.date + " GMT")
          })
        }

        this.scrollToBottom();
      }
    });
  }
  scrollToBottom() {
    setTimeout(() => {
      if (this.content.scrollToBottom) {
        this.content.scrollToBottom();
      }
    }, 400)
  }
  closeMenu() {
    this.navCtrl.pop();
  }

  ionViewDidLeave(){
    this.events.unsubscribe('pastChatData');
  }
}
