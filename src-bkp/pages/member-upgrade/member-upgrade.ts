import { Component } from '@angular/core';
import { IonicPage, NavController, Events, LoadingController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Stripe } from '@ionic-native/stripe';
import { ServiceProvider } from '../../providers/service/service';
import { TranslateService } from '@ngx-translate/core';

/**
 * Generated class for the MemberUpgradePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-member-upgrade',
  templateUrl: 'member-upgrade.html',
})
export class MemberUpgradePage {
  public pay: any = 'credit_card';
  public upgradeScreen: boolean = false;
  public user: any;
  public ShowPayment: boolean = false;
  public card: any = '';
  public month: any = '';
  public year: any = '';
  public cvc: any = '';
  public upgraded:boolean=false;
  constructor(
    public navCtrl: NavController,
    public storage: Storage,
    public stripe: Stripe,
    public service: ServiceProvider,
    public events: Events,
    public loadingCtrl:LoadingController,
    public translate:TranslateService
  ) {
    this.storage.get('user').then((data) => {
      this.user = data;
      if(this.user['member_upgrade']==1){
        this.upgraded=true;
      } else {
        this.upgraded=false;
      }
    });

    
  }

  upgradeScreenOption() {
    this.upgradeScreen = true;
  }
  validateCard() {
    this.stripe.validateCardNumber(this.card).then(data => {
      this.ShowPayment = true;
    }).catch(error => {
      this.ShowPayment = false;
      this.service.openAlert('Error!', error);
    });
  }
  valiDateCvc() {
    this.stripe.validateCVC(this.cvc).then(data => {
      this.ShowPayment = true;
    }).catch(error => {
      this.ShowPayment = false;
      this.service.openAlert('Error!', error);
    });
  }
  cancelTransection() {
    this.upgradeScreen = false;
  }
  stripePayment() {
    this.stripe.setPublishableKey('pk_test_IjuXgvZ26Db1ahQ6ukq9asRP');
    let card = {
      number: this.card,
      expMonth: this.month,
      expYear: this.year,
      cvc: this.cvc
    };
    let loading = this.loadingCtrl.create({
      content: "Please wait while validating card.."
    });
    loading.present();
    this.stripe.createCardToken(card)
      .then((token) => {
        loading.dismiss();
        let params = {
          "user_id": this.user['id'],
          "token_id": token.id
        }
        this.service.paymentHandlerUpgrade(params);
      }).catch(error => {
        loading.dismiss();
        this.service.openAlert('Error!!', error.message);
      });
  }
  ngOnInit() {
    this.callAllSubscribe(this.events);
  }
  callAllSubscribe(events) {
    events.subscribe('upgraded', object => {
      if (object != null) {
        if (object.status == 200) {
          this.service.getUserDetailById();
          this.upgradeScreen = false;
          this.upgraded = true;
          this.service.openAlert("success", "Member upgraded successfully!!");
        }
      }
    });
    events.subscribe('upgradeUser', object => {
      if (object != null) {
        if (object.status == 200) {
          this.upgradeScreen = false;
          this.user = object['data'];
          this.storage.set('user', this.user);
          this.upgraded=true;
        }
      }
    });
  }
}
