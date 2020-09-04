import { Component, NgZone } from '@angular/core';
import { IonicPage, NavController, Events, ModalController } from 'ionic-angular';
import { ServiceProvider } from '../../providers/service/service';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { PlacesPage } from '../places/places';
import { Storage } from '@ionic/storage';
import { ChangePasswordPage } from '../change-password/change-password';
/**
 * Generated class for the EditProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-edit-profile',
  templateUrl: 'edit-profile.html',
})
export class EditProfilePage {
  public user: any;
  imageURI: any;
  imageFileName: any;
  public showImage: string;
  public country: any;


  constructor(
    public zone: NgZone,
    public navCtrl: NavController,
    public service: ServiceProvider,
    public events: Events,
    private camera: Camera,
    public modalCtrl: ModalController,
    public storage:Storage
  ) {
    this.user = {};
    this.service.getUserDetail();
    this.service.getCountry();

  }
  ngOnInit() {
    this.callAllSubscribe(this.events);
  }
  callAllSubscribe(events) {
    events.subscribe('user_edit', object => {
      if (object != null) {
        if (object['status'] == 200) {
          this.user = object['data'];
          this.storage.set('user', this.user);
          if(this.user['user_image']){
            this.showImage = this.user['user_image'];
          } else {
            this.showImage = "img/avatar-3.png";
          }
        }
      }
    });

    events.subscribe('country', object => {
      if (object != null) {
        if (object['status'] == 200) {
          this.country = object['data'];
        }
      }
    });
  }
  updateUserProfile() {
    if(this.imageURI){
      this.user['user_image'] = this.imageURI;
      this.showImage = "data:image/png;base64," + this.imageURI;
    }
    
    this.service.upDateUserDetail(this.user);
  }
  getImage() {
    const options: CameraOptions = {
      quality: 35,
      destinationType: this.camera.DestinationType.DATA_URL,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      encodingType:this.camera.EncodingType.PNG
    }
    this.camera.getPicture(options).then((imageData) => {
      this.imageURI = imageData;
      
      this.showImage = "data:image/png;base64," + imageData;
    }, (err) => {
    });
  }
  presentProfileModal() {
    let profileModal = this.modalCtrl.create(PlacesPage);
    profileModal.onDidDismiss(data => {
      if (data['data']) {
        var dataObj = data['data'];
        this.user['address'] = dataObj['description'];
        this.user['latitude'] = dataObj['lat'];
        this.user['longitude'] = dataObj['long'];
      }
    });
    profileModal.present();
  }
  openChangePasswordPage(){
    this.navCtrl.push(ChangePasswordPage);
  }
  openMenmu(){
    this.events.publish('openMenu',{});
  }
}
