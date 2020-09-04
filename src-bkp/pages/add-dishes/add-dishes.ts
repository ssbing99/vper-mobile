import { Component,ViewChild } from '@angular/core';
import { IonicPage, NavController, Events,Navbar } from 'ionic-angular';
import { ServiceProvider } from '../../providers/service/service';
import { Camera, CameraOptions } from '@ionic-native/camera';
/**
 * Generated class for the AddDishesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-add-dishes',
  templateUrl: 'add-dishes.html',
})
export class AddDishesPage {
  @ViewChild(Navbar) navBar: Navbar;
  public dishName :string;
  public dishImage : string;
  public showDishImage:string;
  public status:number=0;
  public grocerie:any;
  constructor(public events:Events,public navCtrl: NavController, public service: ServiceProvider,private camera: Camera) {
  }
  getImage() {
    const options: CameraOptions = {
      quality: 100,
      destinationType: 0,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY
    }
    this.camera.getPicture(options).then((imageData) => {
      this.dishImage = imageData;
      this.showDishImage = "data:image/png;base64,"+this.dishImage;
    }, (err) => {
      console.log(err);
    });
  }
  saveDishes(){
    let params = {
      "name":this.dishName,
      "image":this.dishImage,
      "method":'addChefDish',
      "status":this.status,
      "grocery":this.grocerie
    }
    if (this.dishName == null || this.dishName == " ") {
      this.service.openAlert("Alert!!", "Please Enter Dish Name");
      return false;
    }
    this.service.saveDishe(params);
  }
  ngOnInit() {
    this.callAllSubscribe(this.events);
  }
  callAllSubscribe(events) {
    events.subscribe('saveDishes', object => {
      if (object != null) {
        this.service.openAlert("Success","dishesh added successfully!");
      }
    });
  }
  ionViewDidLoad() {
    this.navBar.backButtonClick = (e:UIEvent)=>{
     // todo something
     this.service.getChecfDishes(1,'main');
     this.navCtrl.pop();
    }
}
}
