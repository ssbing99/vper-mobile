import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, AlertController } from 'ionic-angular';
import { ServiceProvider } from '../../providers/service/service';
import { Events } from 'ionic-angular';
import { LoadingController } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { PlacesPage } from '../places/places';
import { TermsPage } from '../terms/terms';
import { PrivacyPolicyPage } from '../privacy-policy/privacy-policy';
/**
 * Generated class for the SingupPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-singup',
  templateUrl: 'singup.html',
})
export class SingupPage {
  public translation = {};
  public fname: string;
  public lname: string;
  public phone: number;
  public email: string;
  public password: string;
  public address: string;
  public lat: any;
  public lng: any;
  public reffrel: any;
  public isMsg: boolean = false;
  public msg = '';
  public latitude: any;
  public longitude: any;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public service: ServiceProvider,
    public events: Events,
    public loadingCltr: LoadingController,
    public modalCtrl: ModalController,
    private alertCtrl: AlertController,
  ) {


  }

  ngOnInit() {
    this.callAllSubscribe(this.events);
  }
  callAllSubscribe(events) {
    events.subscribe('singup_result', object => {
      this.dismissLoadingCltr(object);
      if (object != null) {
        if (object.status == 200) {
          this.isMsg = true;
          this.msg = object.message;
          this.fname = '';
          this.lname = '';
          this.email = '';
          this.phone = 0;
          this.address = '';
          this.reffrel = '';
          this.latitude = '';
          this.longitude = '';

          this.navCtrl.push(LoginPage, { sucessMsg: this.msg });

        }
      }
    });
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
    if (this.address == null || this.address == " ") {
      this.service.openAlert("Alert!!", "Please Enter Your Address");
      return false;
    }
    if (regExp.test(this.email) !== true) {
      this.service.openAlert("Alert!!", "Invalid email address");
      return false;
    }
    if (this.reffrel == null || this.reffrel == " ") {
      this.service.openAlert("Alert!!", "Please Enter Reffrel Code");
      return false;
    }
    var singupParams = {
      'fname': this.fname,
      'lname': this.lname,
      'phone': this.phone,
      'address': this.address,
      'email': this.email,
      'password': this.password,
      'latitude': this.latitude,
      'longitude': this.longitude,
      'refral_code': this.reffrel
    };
    this.service.singupSubmit(singupParams);
    //add vinod
    // let loadingCt = this.loadingCltr.create({
    //   content: "Please wait.."
    // });

    // if (this.isMsg == true) {
    //   this.navCtrl.push(LoginPage);
    // }
    // loadingCt.dismiss();

  }
  //end vinod
  dismissLoadingCltr(params: any) {
    params.loading.dismiss();
  }
  openloginPage(params: any) {
    this.navCtrl.setRoot(LoginPage);
  }
  presentProfileModal() {
    let profileModal = this.modalCtrl.create(PlacesPage);
    profileModal.onDidDismiss(data => {
      if (data['data']) {
        var dataObj = data['data'];
        this.address = dataObj['description'];
        this.latitude = dataObj['lat'];
        this.longitude = dataObj['long'];
      }
    });
    profileModal.present();
  }
  openPopupTerms(type) {
    var page;

    if (type == 'p') {
      page = PrivacyPolicyPage;
    } else {
      page = TermsPage;
    }
    let termsModel = this.modalCtrl.create(page);
    termsModel.present();
  }
}
