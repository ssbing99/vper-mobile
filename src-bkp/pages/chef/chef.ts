import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { ChatPage } from '../chat/chat';
import { ServiceProvider } from '../../providers/service/service';

/**
 * Generated class for the ChefPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-chef',
  templateUrl: 'chef.html',
})
export class ChefPage {
  public chefProfile:any={};
  public chefDish:any=[];
  public chefReview:any=[];
  public chefId:number;
  public type:string='';
  public openPopup:boolean=false;
  public dishName:string='';
  public grocery:string='';
  constructor(public navCtrl: NavController, public navParams: NavParams,public events:Events,public service:ServiceProvider) {
    this.chefId = this.navParams.get('chef_id');
    this.type = (this.navParams.get('type')!==undefined)?this.navParams.get('type'):'';
    this.service.getChecfsDeatilById({"userId":this.chefId});
  }

  openChat() {
    this.navCtrl.push(ChatPage,{"chef_id":this.chefId,type:this.type,"toImage":this.chefProfile['user_image'] });
  }
  ngOnInit() {
    this.callAllSubscribe(this.events);
  }
  callAllSubscribe(events) {
    events.subscribe('chefProfileDetail', object => {
      if (object != null) {
        this.chefProfile = object['data']['profile'];
        this.chefDish = object['data']['dish'];
        this.chefReview = object['data']['review'];
      }
    });
  }
  closeModelPopup(){
    this.dishName='';
    this.grocery='';
    this.openPopup=false;
  }
  openModelPopup(name,grocery){
    this.dishName='';
    this.grocery='';
    this.dishName=name;
    this.grocery=grocery;
    this.openPopup=true;
  }
}
