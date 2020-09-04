import { Component } from '@angular/core';
import { IonicPage, NavController, Events, ModalController } from 'ionic-angular';
import { ServiceProvider } from '../../providers/service/service';
import { LoginPage } from '../login/login';
import { UserTermsPage } from '../user-terms/user-terms';
import { UserPrivacyPolicyPage } from '../user-privacy-policy/user-privacy-policy';

/**
 * Generated class for the UserSingupPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-user-singup',
  templateUrl: 'user-singup.html',
})
export class UserSingupPage {
  public fname: string;
  public lname: string;
  public phone: number;
  public email: string;
  public password: string;
  public isMsg: boolean = false;
  public msg = '';
  public alertPresented:boolean=false;
  constructor(
    public navCtrl: NavController,
    public service: ServiceProvider,
    public events: Events,
    public modalCtrl:ModalController
  ) {
    this.alertPresented=true;
  }

  submitSingupForm() {
    let regExp = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
    if (this.fname == null || this.fname == " ") {
      this.service.openAlert("Alert!!", "Please Enter First Name");
      return false;
    }
    if (this.phone == null) {
      this.service.openAlert("Alert!!", "Please Enter Phone number");
      return false;
    }

    if (this.password == null || this.password == " ") {
      this.service.openAlert("Alert!!", "Please Enter Password");
      return false;
    }
    if (regExp.test(this.email) !== true) {
      this.service.openAlert("Alert!!", "Invalid email address");
      return false;
    }
    var singupParams = {
      'fname': this.fname,
      'lname': this.lname,
      'phone': this.phone,
      'email': this.email,
      'password': this.password,
    };
    this.service.singupSubmitUser(singupParams);
  }
  ngOnInit() {
    this.callAllSubscribe(this.events);
  }
  callAllSubscribe(events) {
    events.subscribe('user_singup_result', object => {
      if (object != null) {
        if (object.status == 200) {
          //this.isMsg = true;
          //this.msg = object.message;
          this.fname = '';
          this.lname = '';
          this.email = '';
          this.phone = 0;
          //this.service.openAlert("success!!",object.message);
        } else if(object.status == 202){
          //this.service.openAlert("Alert!!",object.message);
        }
      }
    });
  }
  openloginPage(params: any) {
    this.navCtrl.setRoot(LoginPage);
  }  
  openPopupTerms(type){
    var page;

    if(type=='p'){
      page=UserPrivacyPolicyPage;
    } else {
      page=UserTermsPage;
    }
    let termsModel = this.modalCtrl.create(page);
    termsModel.present();
  }
}
