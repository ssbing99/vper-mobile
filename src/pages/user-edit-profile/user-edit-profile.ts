import { Component } from '@angular/core';
import { IonicPage, NavController, Events } from 'ionic-angular';
import { Camera,CameraOptions } from '@ionic-native/camera';
import { ServiceProvider } from '../../providers/service/service';
import { ChangePasswordPage } from '../change-password/change-password';

/**
 * Generated class for the UserEditProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-user-edit-profile',
  templateUrl: 'user-edit-profile.html',
})
export class UserEditProfilePage {
  public user: any;
  imageURI: any;
  imageFileName: any;
  //uploadImage='Upload Image';
  public showImage: string;
  constructor(
    public navCtrl: NavController,
    public camera: Camera,
    public events:Events,
    public service:ServiceProvider
    ) {
      this.user = {};
      this.service.getUserDetail();
  }

  ngOnInit() {
    this.callAllSubscribe(this.events);
  }
  callAllSubscribe(events) {
    events.subscribe('user_edit', object => {
      if (object != null) {
        if (object['status'] == 200) {
          this.user = object['data'];

        }
      }
    });
  }
  updateUserProfile() {
    this.user['user_image'] = this.imageURI;
    this.service.upDateCustomerDetail(this.user);
  }
  getImage() {
    const options: CameraOptions = {
      quality: 100,
      destinationType: 0,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY
    }
    this.camera.getPicture(options).then((imageData) => {
      this.imageURI = imageData;
      this.showImage = "data:image/png;base64," + this.imageURI;
    }, (err) => {
      console.log(err);
    });
  }
  openMenmu(){
    this.events.publish('openMenu',{});
  }
  closeMenmu(){
    this.events.publish('closeMenu',{});
  }
  openChangePasswordPage(){
    this.navCtrl.push(ChangePasswordPage);
  }
}
