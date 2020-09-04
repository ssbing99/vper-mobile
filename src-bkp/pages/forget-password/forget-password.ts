import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, ViewController } from 'ionic-angular';
import { ServiceProvider } from '../../providers/service/service';
import { LoginPage } from '../login/login';

/**
 * Generated class for the ForgetPasswordPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-forget-password',
  templateUrl: 'forget-password.html',
})
export class ForgetPasswordPage {
  public email:string='';
  public openReset:boolean=false;
  public code:string='';
  public pass='';
  public new_pass='';
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public service:ServiceProvider,
    public events:Events,
    public viewCtrl:ViewController
  ) {
  }

  ionViewDidLoad() {
    
  }
  sendCode(){
    if(this.email!==''){
      var params={
        "email":this.email
      }
      this.service.sendCode(params);
    }
  }
  resetPassword(){
    if(this.code!=='' && this.pass!=='' && this.new_pass!==''){
      var params={
        "forget_token":this.code,
        "new_pass":this.pass,
        "confirm_pass":this.new_pass
      }
      this.service.resetPassword(params);
    } else {
      if(this.code==''){
        this.service.openAlert("Alert!!!","Please enter a valid code");
      } else if(this.pass==''){
        this.service.openAlert("Alert!!!","Please enter password");
      } else if(this.pass!==this.new_pass){
        this.service.openAlert("Alert!!!","Password and confirm password must br matched");
      }
    }
  }
  ngOnInit() {
    this.callAllSubscribe(this.events);
  }
  callAllSubscribe(events) {
    events.subscribe('forget_passwword', object => {
      if (object != null) {
        if (object['status'] == 200) {
          this.openReset=true;
        }
      }
    });
    events.subscribe('reset', object => {
      if (object != null) {
        if (object['status'] == 200) {
          this.service.openAlert("success","Password reseted successfully!");
          this.navCtrl.setRoot(LoginPage);
        }
      }
    });
  }
  close(){
    this.viewCtrl.dismiss();
  }
}
