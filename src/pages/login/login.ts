import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, AlertController, Platform } from 'ionic-angular';
import { ServiceProvider } from '../../providers/service/service';
import { Events } from 'ionic-angular';
import { LoadingController } from 'ionic-angular';
import { SingupPage } from '../singup/singup';
import { UserSingupPage } from '../user-singup/user-singup';
import { Storage } from '@ionic/storage';
import { GooglePlus } from '@ionic-native/google-plus';
import { Facebook } from '@ionic-native/facebook';
import { ForgetPasswordPage } from '../forget-password/forget-password';
import { Device } from '@ionic-native/device';
/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  public email: string;
  public password: string;
  public isMsg: boolean = false;
  public msg: any;
  public device_id: any = '';
  public language: any;
  public eng: boolean = true;
  public pcm: boolean = false;

  displayName: any;
  familyName: any;
  givenName: any;
  userId: any;
  imageUrl: any;

  isLoggedIn: boolean = false;
  isLoggedInFb: boolean = false;
  users: any;
  platformName: string;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public service: ServiceProvider,
    public events: Events,
    public loadingCltr: LoadingController,
    private storage: Storage,
    private googlePlus: GooglePlus,
    private loading: LoadingController,
    private fb: Facebook,
    public mdlCltr: ModalController,
    private alertCtrl: AlertController,
    private platform: Platform,
    private device: Device
  ) {
    this.msg = this.navParams.get('sucessMsg')// add vinod
    // For non-first time login
    this.storage.get("device_id").then((val) => {
      this.device_id = val;
    });
    this.storage.get('language').then((data) => {

      if (data == "en" || data == "eng") {
        this.pcm = false;
        this.eng = true;
      } else {
        this.pcm = true;
        this.eng = false;
      }
    });

    if (this.platform.is('android')) {
      this.platformName = 'android';
    } else if (this.platform.is('ios')) {
      this.platformName = 'ios'
    }
  }
  ngOnInit() {
    this.callAllSubscribe(this.events);
  }
  callAllSubscribe(events) {
    events.subscribe('login_result', object => {
      //this.dismissLoadingCltr(object);
      if (object != null) {
        if (object.status == 200) {
          this.events.publish('updateChecfMenu', object['data']);
        }
      }
    });
    events.subscribe('fb_login', object => {
      //this.dismissLoadingCltr(object);
      if (object != null) {
        if (object.status == 200) {
          this.events.publish('updateChecfMenu', object['data']);
        } else {
          this.events.publish('updateChecfMenu', object['data']);
        }
      }
    });
    events.subscribe('google_login', object => {
      //this.dismissLoadingCltr(object);
      if (object != null) {
        if (object.status == 200) {
          this.events.publish('updateChecfMenu', object['data']);
        } else {
          this.events.publish('updateChecfMenu', object['data']);
        }
      }
    });
    // For first time installation and login
    events.subscribe('loginSetup', data => {
      this.device_id = data;
    })
  }
  submitLoginForm() {

    let regExp = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
    if (regExp.test(this.email) !== true) {
      this.service.openAlert("Alert!!", "Invalid email address");
      return false;
    }
    if (this.password == null || this.password == " ") {
      this.service.openAlert("Alert!!", "Please Enter Password");
      return false;
    }

    let loginParams = {
      "email": this.email,
      "password": this.password,
      "method": "login",
      "device_id": this.device_id,
      "device_platform": this.platformName
    }
    this.service.loginSubmit(loginParams);
  }
  dismissLoadingCltr(params: any) {
    params.loading.dismiss();
  }
  opensignupPageChef(params: any) {
    let loadingCt = this.loading.create({ //add vinod
      content: "Please wait.."
    });
    loadingCt.present();
    this.navCtrl.setRoot(SingupPage);
    loadingCt.dismiss();
  }
  opensignupPageUser(params: any) {
    this.navCtrl.setRoot(UserSingupPage);
  }
  loginGoogle() {
    let loadingCt = this.loading.create({
      content: "Please wait.."
    });
    loadingCt.present();
    this.googlePlus.login({})
      .then(res => {
        loadingCt.dismiss();
        res.device_id = this.device_id;
        res.device_platform = this.platformName;
        this.service.loginFromGoogle(res);
      })
      .catch(err => {
        console.log(JSON.stringify(err))
        this.service.openAlert('Alert', err);
        loadingCt.dismiss();
      }
      );
  }
  loginFb() {
    let loading = this.loadingCltr.create({
      content: "Please wait while authenticating with FB.."
    });
    loading.present();
    this.fb.getLoginStatus().then((res) => {
      loading.dismiss();
      if (res.status === 'connected') {
        // Already logged in to FB so pass credentials to provider (in my case firebase)
        this.getUserDetail(res['authResponse']['userID']);
      } else {
        // Not already logged in to FB so sign in
        this.fb.login(['email']).then((userData) => {
          this.getUserDetail(userData['authResponse']['userID']);
        }).catch((error) => {
          console.log(JSON.stringify(error));
          this.service.openAlert('error', JSON.stringify(error));
          // FB Log in error
        });
      }
    });
  }
  getUserDetail(userid) {
    let loading = this.loadingCltr.create({
      content: "Please wait while fetching data from Fb.."
    });
    loading.present();
    this.fb.api("/" + userid + "/?fields=id,email,name,picture,gender", ["public_profile"])
      .then(res => {
        loading.dismiss();
        var params = {
          "id": res['id'],
          "name": res['name'],
          "image": res['picture']['url'],
          "email": res['email'],
          "device_id": this.device_id,
          "device_platform": this.platformName
        }
        console.log(params);
        this.service.loginFromFb(params);
      })
      .catch(e => {
        console.log(e);
      });
  }
  openForgetPage() {
    let forgetPass = this.mdlCltr.create(ForgetPasswordPage);
    forgetPass.present();
  }
  settingPopup() {
    let prompt = this.alertCtrl.create({
      title: 'Languages',
      message: 'Select your primery language ',
      inputs: [
        {
          type: 'radio',
          label: 'English',
          value: 'eng',
          checked: this.eng
        },
        {
          type: 'radio',
          label: 'Norwegian',
          value: 'pcm',
          checked: this.pcm
        }],
      buttons: [
        {
          text: "Cancel",
          handler: data => {

          }
        },
        {
          text: "Save",
          handler: data => {
            this.storage.set('language', data);
            if (data === "pcm") {
              this.pcm = true;
              this.eng = false;
              this.events.publish('changeLanguage', "pcm");
            } else {
              this.events.publish('changeLanguage', "en");
              this.pcm = false;
              this.eng = true;
            }
          }
        }]
    });
    prompt.present();
  }
}
