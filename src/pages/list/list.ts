import { Component } from '@angular/core';
import { NavController, NavParams, Events } from 'ionic-angular';
import { AddDishesPage } from '../add-dishes/add-dishes';
import { ServiceProvider } from '../../providers/service/service';
import { EditDishPage } from '../edit-dish/edit-dish';
import { AlertController } from 'ionic-angular';
@Component({
  selector: 'page-list',
  templateUrl: 'list.html'
})
export class ListPage {
  icons: string[];
  items: Array<{ title: string, note: string, icon: string }>;
  page: number = 1;
  checfDish = [];
  infiniteScroll:any;
  totalcountpage:number=1;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public service: ServiceProvider,
    public events: Events,
    public altCltr:AlertController
  ) {
    this.service.getChecfDishes(this.page,'main');
  }
  ngOnInit() {
    this.callAllSubscribe(this.events);
  }
  callAllSubscribe(events) {
    events.subscribe('checf_dishes', object => {
      if(this.infiniteScroll){
        this.infiniteScroll.complete();
      }
      if(object['type']!==undefined && object['type']=="main"){
        this.checfDish=[];
      }
      if (object != null) {
        if (object['status'] == 200) {
          this.totalcountpage=object['totalcountpage'];
          for (var i = 0; i < object['data'].length; i++) {
            this.checfDish.push(object['data'][i]);
          }
        }
      }
    });
    events.subscribe('dishDeleted', object => {
      if (object != null) {
        if (object['status'] == 200) {
            (this.checfDish).splice(object['index'],1);
        }
      }
    });
  }
  addDishes() {
    if(this.checfDish.length < 6){
      this.navCtrl.push(AddDishesPage);
    } else {
      this.service.openAlert("Alert!!!","Can not add morethan 6 dishes");
    }
    
  }
  editDishes(id:number) {
    this.navCtrl.push(EditDishPage,{dishId:id});
  }
  getMoreDishes(infiniteScroll) {
    this.page = this.page + 1;
    this.infiniteScroll = infiniteScroll;
    if(this.totalcountpage >= this.page){
      this.service.getChecfDishes(this.page,'scroll');
    } else {
      infiniteScroll.complete();
    }
  }
  deleteDish(dishId:number,index:number){
    let alert = this.altCltr.create({
      title: 'Confirm delete',
      message: 'Are you sure you want delete this dish?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
          }
        },
        {
          text: 'Yes',
          handler: () => {
            var params = {
              "id":dishId,
              "method":"deleteChefDishdata"	
              }
           this.service.deleteDish(params,index);
          }
        }
      ]
    });
    alert.present();
  }
}
