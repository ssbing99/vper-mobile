import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { ServiceProvider } from '../../providers/service/service';
import { Storage } from '@ionic/storage';

/**
 * Generated class for the ChangePasswordPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-change-password',
  templateUrl: 'change-password.html',
})
export class ChangePasswordPage {

  public oldPass: any = '';
  public newPass: any = '';
  public confirmPass: any = '';
  public user: any = [];
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public service: ServiceProvider,
    public events: Events,
    public storage: Storage
  ) {
    this.storage.get('user').then(data => {
      this.user = data;
    });
  }
  ionViewDidLoad() {


  }

  changePassword() {
    if (this.oldPass !== '' && this.newPass !== '' && this.confirmPass !== '') {
      if (this.newPass == this.confirmPass) {
        let params = {
          "user_id": this.user['id'],
          "old_pass": this.oldPass,
          "new_pass": this.newPass,
          "confirm_pass": this.confirmPass
        }
        this.service.changePassword(params);
      } else {
        this.service.openAlert("Alert!!!", "New password and confirm password must be same");
      }
    } else {
      this.service.openAlert("Alert!!!", "Please fill all the field");
    }
  }
  ngOnInit() {
    this.callAllSubscribe(this.events);
  }
  callAllSubscribe(events) {
    events.subscribe('change_passwword', object => {
      if (object !== null) {
        if (object['status'] == 200) {
          this.service.openAlert("success", "Pasword changed successfully");
        } else if (object['status'] == 201) {
          this.service.openAlert("Alert!!!", object['message']);
        }
      }
    });

  }
}
