import { Component,ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Events,Navbar } from 'ionic-angular';
import { ServiceProvider } from '../../providers/service/service';
import { Camera, CameraOptions } from '@ionic-native/camera';
/**
 * Generated class for the EditDishPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-edit-dish',
  templateUrl: 'edit-dish.html',
})
export class EditDishPage {
  @ViewChild(Navbar) navBar: Navbar;
  public dishName:string='';
  public dishImage : string='';
  public showDishImage:string='';
  public dishId:number=0;
  public disImg:string='';
  public status:number=0;
  public grocerie:any;
  constructor(public events:Events,public navCtrl: NavController, public navParams: NavParams, public service: ServiceProvider,private camera: Camera) {
    this.dishId = this.navParams.get('dishId');
    this.service.getDishDetail(this.dishId);
  }
  ngOnInit() {
    this.callAllSubscribe(this.events);
  }
  callAllSubscribe(events) {
    events.subscribe('dishDetail', object => {
      if (object != null) {
        this.dishName = object['data']['name'];
        this.dishImage = object['data']['image'];
        this.status =object['data']['status'];
        this.grocerie =object['data']['grocery'];
      }
    });
  }
  getImage() {
    const options: CameraOptions = {
      quality: 100,
      destinationType: 0,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY
    }
    this.camera.getPicture(options).then((imageData) => {
      this.disImg = imageData;
      this.dishImage = "data:image/png;base64,"+this.dishImage;
    }, (err) => {
      console.log(err);
    });
  }
  updateDish(){
    let params = {
      "name":this.dishName,
      "image":this.disImg,
      "method":'updateChefDishdata',
      "id":this.dishId,
      "status":this.status,
      "grocery":this.grocerie
    }
    if (this.dishName == null || this.dishName == " ") {
      this.service.openAlert("Alert!!", "Please Enter Dish Name");
      return false;
    }
    this.service.updateDish(params);
  }
  ionViewDidLoad() {
    this.navBar.backButtonClick = (e:UIEvent)=>{
     // todo something
     this.service.getChecfDishes(1,'main');
     this.navCtrl.pop();
    }
}
}
