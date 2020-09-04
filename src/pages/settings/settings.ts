import { Component } from '@angular/core';
import { IonicPage, NavController,  AlertController,ModalController, Events } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { SocialSharing } from '@ionic-native/social-sharing';
import { ServiceProvider } from '../../providers/service/service';
import { PrivacyPolicyPage } from '../privacy-policy/privacy-policy';
import { UserPrivacyPolicyPage } from '../user-privacy-policy/user-privacy-policy';
import { TranslateService } from '@ngx-translate/core';

/**
 * Generated class for the SettingsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {
  public language: any;
  public eng: boolean = true;
  public pcm: boolean = false;
  public push_setting:any=false;
  public user:any={};
  public tr:any;
  public share_url:string='';
  constructor(
    public navCtrl: NavController,
    private alertCtrl: AlertController,
    private storage: Storage,
    public share:SocialSharing,
    public service:ServiceProvider,
    public modalCtrl: ModalController,
    public events:Events,
    public translate:TranslateService,
    
    ) {
      translate.get('settings').subscribe((value)=>{
        this.tr=value;
      });
    this.service.getAppShareUrl();
    this.storage.get('language').then((data) => {
      if (data === "eng") {
        this.pcm = false;
        this.eng = true;
      } else {
        this.pcm = true;
        this.eng = false;
      }
    });
    this.storage.get('user').then((data)=>{
      this.user=data;
      this.push_setting=(this.user['push_notification_settings']==1)?true:false;
    });
  }

  ionViewDidLoad() {
  }
  settingPopup() {
    let prompt = this.alertCtrl.create({
      title: this.tr.p4,
      message: this.tr.select_laguage,
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
              this.translate.use("pcm");
              this.translate.get('settings').subscribe((value)=>{
                this.tr=value;
              });
              this.events.publish('changeLanguage',"pcm");
            } else {
              this.translate.use("en");
              this.translate.get('settings').subscribe((value)=>{
                this.tr=value;
              });
              this.events.publish('changeLanguage',"en");
              this.pcm = false;
              this.eng = true;
            }
          }
        }]
    });
    prompt.present();
  }
  shareApp(){
    this.share.share("Check out Yper, I use it to book a check for me or my family.", "Yper App", this.share_url, this.share_url).then(() => {
      //alert("Sharing success");
    // Success!
    }).catch(() => {
    // Error!
      //alert("Share failed");
    });
  }
  change_setting(){
    var params={};
    if(this.push_setting==true){
      params['push_notification_settings']=1;
    } else {
      params['push_notification_settings']=0;
    }
    this.service.changePushSetting(params);
    this.user['push_notification_settings']=params['push_notification_settings'];
    this.storage.set('user', this.user);
  }
  openPrivacyPolcy() {
    var profileModal;
    if(this.user['user_type']=="chef"){
      profileModal = this.modalCtrl.create(PrivacyPolicyPage);
    } else {
      profileModal = this.modalCtrl.create(UserPrivacyPolicyPage);
    } 
    
    profileModal.present();
  }
  ngOnInit() {
    this.callAllSubscribe(this.events);
  }
  callAllSubscribe(events) {
    events.subscribe('app_share_url', object => {
      if (object != null) {
        this.share_url = object['data']['url'];
      }
    });
  }
}
