import { Component } from '@angular/core';
import { IonicPage, NavController, Events } from 'ionic-angular';
import { ServiceProvider } from '../../providers/service/service';
import { Storage } from '@ionic/storage';
/**
 * Generated class for the ChefMyEarningPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-chef-my-earning',
  templateUrl: 'chef-my-earning.html',
})
export class ChefMyEarningPage {
  public total_income='active item item-block item-ios';
  public class_nok = '';
  public loadingObj:any;
  public showData:boolean=true;
  public user:any=[];
  public arrIncome:any=[];
  public totalIncome:any=[];
  public infiniteScroll:any;
  public page=1;
  public last:boolean=false;
  constructor(
    public navCtrl: NavController,
    public service:ServiceProvider,
    public storage:Storage,
    public events:Events
  ) {

  }

  ionViewDidLoad() {
    this.storage.get('user').then((data) => {
      this.user=data;
      this.service.getTotalIncomeData({"chef_id":this.user['id']});
    });
  }
  ngOnInit() {    
    this.callAllSubscribe(this.events);
  }
  callAllSubscribe(events) {
    events.subscribe('chef_income', object => {
      if(object!==null){
        if(object.data!==undefined){
          this.totalIncome=object.bookdata;
          if(object.data.length > 0){
            for(var i=0;i<object.data.length;i++){
              this.arrIncome.push(object.data[i]);
            }
            this.last=false;
          } else{
            this.last=true;
          }
        } else {
          this.last=true;
        }
      }
      if(this.infiniteScroll!==undefined){
        this.infiniteScroll.complete();
      }
    });
    
  }
  getMoreData(infiniteScroll){
    if(this.last==false){
      this.page=this.page+1;
      this.infiniteScroll=infiniteScroll;
      this.service.getTotalIncomeData({"chef_id":this.user['id'],"page":this.page});
    } else {
      infiniteScroll.complete();
    }
  }
}
