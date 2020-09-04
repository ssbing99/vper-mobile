import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, LoadingController, AlertController } from 'ionic-angular';
import { ServiceProvider } from '../../providers/service/service';
import { BookingPage } from '../booking/booking';
import { Storage } from '@ionic/storage';
import { OurChefsPage } from '../our-chefs/our-chefs';
import { TranslateService } from '@ngx-translate/core';
/**
 * Generated class for the HireChefPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

declare var Stripe;

@IonicPage()
@Component({
  selector: 'page-hire-chef',
  templateUrl: 'hire-chef.html',
})

export class HireChefPage {
  
  public chefId: number;
  public chefProfile: any[];
  public userChoice: number = 1;
  public userChooseDished: any = [];
  public step: number = 1;
  public chefDishes: any = [];
  public chosesDays: number = 1;
  public totalDays: any = [];
  public FirstDayPersone: number = 1;
  public totalPerson: any = [];
  /*Days Person*/
  public SecondDayPersone: number = 0;
  public ThirdDayPersone: number = 0;
  public FourthDayPersone: number = 0;
  public FifthPersone: number = 0;
  public SixthDayPersone: number = 0;
  public Choosedate: any;
  public ChooseTime: any;
  public mindate: any;
  public totalAmount: number = 0;
  public arrState: any = [];
  public arrCity: any = [];
  public user: any;
  public alergies: string = '';
  public foodbox_menu: string = '';
  public other: string = '';
  public foodbox_menu_company: string = '';
  public address: any = {
    'state': 0,
    'address': '',
    'city': 0,
    'phone': '',
    'postal_code': '',
    'email': '',
    'country': 164
  };
  public order_id: number = 0;
  public card: any = '';
  public month: any = '';
  public year: any = '';
  public cvc: any = '';
  public ShowPayment: boolean = false;
  public type: string = '';
  public stepsShow: number = 8;
  public stepWillShow: number = 1;
  public messages: any;
  public couponCode: any;
  public couponData: any;
  public oldTotalAmount: any;
  public couponAmount: any;
  public showCouponCode: any;
  public paymentMethod: any;
  public secretClient: string;
  public paymentCallback: Function;
  public requireActionCallback: Function;
  public showElement = false;
  public cardInfo: any;
  public stripe = Stripe('pk_test_nwGlM9Xw8v2s5ZpgmIWXu0Z1');
  // public stripe = Stripe('pk_live_j3vg5kibohkmjdzWTlGSc3EU');
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public service: ServiceProvider,
    public events: Events,
    public storage: Storage,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public translate: TranslateService
  ) {
    this.chefId = this.navParams.get('chef_id');
    this.type = (this.navParams.get('type') !== undefined) ? this.navParams.get('type') : '';
    this.service.getChecfsDeatilById({ "userId": this.chefId });
    this.totalDays = [1, 2, 3, 4, 5, 6];
    this.totalPerson = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
    let todayDate = new Date();
    this.mindate = todayDate.toISOString();
    this.Choosedate = new Date(todayDate.getTime() - (todayDate.getTimezoneOffset() * 60000)).toJSON().split('T')[0];
    var todayTime = new Date(todayDate.getTime() - (todayDate.getTimezoneOffset() * 60000)).toJSON().split('T')[1];
    this.ChooseTime = todayTime.split('.')[0];
    this.service.getState({ "Countryid": this.address['country'] });
    this.storage.get('user').then((data) => {
      this.user = data;
    });
    translate.get('main_msg').subscribe(value => {
      this.messages = value;
    });
    
    this.paymentCallback = (savedCard, paymentMethodId) => {
      const params = {
        order_id: this.order_id,
        savedCard,
        payment_method_id: paymentMethodId,
        user_id: this.user['id']
      };

      this.service.paymentHandler(params);
    }

    this.requireActionCallback = (savedCard, intentId) => {
      const params = {
        order_id: this.order_id,
        savedCard,
        payment_intent_id: intentId,
        user_id: this.user['id']
      };

      this.service.paymentHandler(params);
    }
  }
  ngOnInit() {
    this.callAllSubscribe(this.events);
  }
  callAllSubscribe(events) {
    events.subscribe('chefProfileDetail', object => {
      if (object != null) {
        this.chefProfile = object['data']['profile'];
        this.chefDishes = object['data']['dish'];
      }
    });
    events.subscribe('couponCode', object => {
      if (object != null) {
        if (object['data'] !== undefined) {
          if (object['message'] !== undefined && object['message'] !== "Success") {
            this.couponCode = "";
          } else {
            this.couponData = object['data'];
            if (this.couponData['amount_off'] !== undefined) {
              this.couponAmount = this.couponData['amount_off'];
              this.oldTotalAmount = this.totalAmount;
              this.totalAmount = this.couponData['totalammount'];
              this.showCouponCode = this.couponCode;
            }
          }
        } else {
          this.service.openAlert('Alert!!', this.translate.instant("hire_chef.payment.invalid_coupon"));
        }
      }
    });
    events.subscribe('amountCalculation', object => {
      if (object != null && object.status == 200) {
        this.totalAmount = object.price;
      }
    });
    events.subscribe('state', object => {
      if (object != null && object.status == 200) {
        this.arrState = object.data;
      }
    });
    events.subscribe('city', object => {
      if (object != null && object.status == 200) {
        this.arrCity = object.data;
      }
    });
    events.subscribe('booking_pending', object => {
      if (object != null && object.status == 200) {
        this.order_id = object.data;
        this.cardInfo = object.cardInfo;
        // this.service.openAlert("Success","Chef booked successfully!!");
        // this.navCtrl.setRoot(BookingPage);
      }
    });
    events.subscribe('booked', object => {
      if (object != null && object.status == 200) {
        if (object.requires_action) {
          if (this.paymentMethod === 'saved_card') {
            this.stripe.handleCardAction(object.payment_intent_client_secret)
            .then(result => {
              if (result.error) {
                // Inform the user if there was an error.
                this.service.openAlert('Error!!', result.error.message);
              } else {
                if (this.requireActionCallback != null) {
                  this.requireActionCallback(false, result.paymentIntent.id);
                }
              }
            }).catch(err => {
              this.service.openAlert('Error!!', "There is an error with your card maybe invalid card detail or something else.");
            }); 
          } else {
            this.secretClient = object.payment_intent_client_secret;
          }
        } else if (object.type !== "error") {
          this.service.openAlert(this.messages.success, this.messages.sus_msg_checf_book);
          this.navCtrl.setRoot(BookingPage);
        } else {
          this.service.openAlert("Error", object.message);
        }

      }
    });
  }
  ionViewDidLoad() {

  }
  ionViewWillUnload() {
    this.events.unsubscribe('chefProfileDetail');
    this.events.unsubscribe('couponCode');
    this.events.unsubscribe('amountCalculation');
    this.events.unsubscribe('state');
    this.events.unsubscribe('city');
    this.events.unsubscribe('booking_pending');
    this.events.unsubscribe('booked');
  }

  changeStep(step: number) {

    if (step == 2) {
      if (this.userChoice == 1) {
        this.step = step;
      } else {
        //this.step=1;
        this.step = step;
      }
    } else if (step == 3) {
      if (this.userChoice == 1) {
        if (this.userChooseDished.length > 0) {
          this.step = step;
        } else {
          this.service.openAlert("Warning", "Please select atleast 1 dish!!");
          return false;
        }
      } else {
        this.step = step;
      }

    } else if (step == 5) {
      if (this.chosesDays > 1) {
        this.step = step;

      } else {
        this.step = 6;
      }
    } else if (step == 6) {
      this.step = step;
    } else if (step == 7) {
      this.step = step;
    } else if (step == 8) {
      if (this.address['address'] == '') {
        this.service.openAlert("Warning", "Please enter your address");
        return false;
      }
      if (this.address['phone'] == '') {
        this.service.openAlert("Warning", "Please enter your phone number");
        return false;
      }
      if (this.address['postal_code'] == '') {
        this.service.openAlert("Warning", "Please enter your postal number");
        return false;
      }
      if (this.address['country'] == 0) {
        this.service.openAlert("Warning", "Please select your country");
        return false;
      }
      if (this.address['state'] == 0) {
        this.service.openAlert("Warning", "Please select your state");
        return false;
      }

      this.stepSix();
      this.step = step;
    } else if (step == 9) {
      this.makePayment();
      this.step = step;
    } else {
      if (this.chosesDays > 1) {
        this.stepsShow = 9;
      } else {
        this.stepsShow = 8;
      }
      this.step = step;
    }
    this.stepWillShow = this.stepWillShow + 1;
  }
  stepSix() {
    var params = {
      "totaldays": this.chosesDays,
      "person": [this.FirstDayPersone, this.SecondDayPersone, this.ThirdDayPersone,
      this.FourthDayPersone, this.FifthPersone, this.SixthDayPersone]
    }
    this.service.getTotalChecfAmount(params);
  }
  makePayment() {
    let arr = (this.Choosedate + ' ' + this.ChooseTime).split(/[- :]/);
    var params = {
      "total_days": this.chosesDays,
      "total_person": [this.FirstDayPersone, this.SecondDayPersone, this.ThirdDayPersone,
      this.FourthDayPersone, this.FifthPersone, this.SixthDayPersone],
      "chef_id": this.chefId,
      "user_id": this.user['id'],
      "book_datetime": new Date(parseInt(arr[0]), parseInt(arr[1])-1, parseInt(arr[2]), parseInt(arr[3]), parseInt(arr[4]), parseInt(arr[5])).getTime() / 1000,
      "booking_type": this.userChoice,
      "address": this.address,
      "dish_id": this.userChooseDished,
      "foodbox_menu_company": this.foodbox_menu_company,
      "foodbox_menu": this.foodbox_menu,
      "alergies": this.alergies,
      "other": this.other,
      couponCode: this.showCouponCode,
      couponData: this.couponData
    }
    this.service.bookChefNow(params);
  }
  ionOnSelectDish(dishValue, evnt) {
    if (evnt.checked) {
      if (this.userChooseDished.indexOf(dishValue) === -1) {
        this.userChooseDished.push(dishValue);
      }
    } else {
      const index: number = this.userChooseDished.indexOf(dishValue);
      if (index !== -1) {
        this.userChooseDished.splice(index, 1);
      }
    }

  }
  backStep(step: number) {
    this.stepWillShow = this.stepWillShow - 1;
    if (step == 5) {
      if (this.chosesDays > 1) {
        this.step = 5;
      } else {
        this.step = 4;
      }
    } else {
      this.step = step;
    }

  }
  bookNow() {
    var params = {
      "total_days": this.chosesDays,
      "total_person": [this.FirstDayPersone, this.SecondDayPersone, this.ThirdDayPersone,
      this.FourthDayPersone, this.FifthPersone, this.SixthDayPersone],
      "chef_id": this.chefId,
      "user_id": this.user['id'],
      "book_datetime": new Date(this.Choosedate + 'T' + this.ChooseTime).getTime() / 1000,
      "booking_type": this.userChoice,
      "address": this.address,
      "dish_id": this.userChooseDished,
      "alergies": this.alergies,
      "foodbox_menu": this.foodbox_menu,
      "foodbox_menu_company": this.foodbox_menu_company,
      "other": this.other,
      "type":this.type,
      couponCode: this.couponCode,
      couponData: this.couponData
    }
    this.service.bookChefNow(params);
  }
  getCity() {
    this.service.getCity({ "Stateid": this.address['state'] });
  }
  stripePayment() {
    const params = {
      order_id: this.order_id,
      user_id: this.user['id'],
      existCard: true,
      payment_method_id: this.cardInfo.card_id
    }

    this.service.paymentHandler(params);
  }
  cancelTransection() {
    let alert = this.alertCtrl.create({
      title: 'Confirm cancel order payment',
      message: 'Are you sure you want cancel this order?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',

        },
        {
          text: 'Yes',
          handler: () => {
            this.navCtrl.setRoot(OurChefsPage);
          }
        }
      ]
    });
    alert.present();

  }
  valiDateCoupon() {
    if (this.couponCode !== "" && this.couponCode !== undefined) { // add vinod
      var params = {
        coupon_id: this.couponCode,
        amount: this.totalAmount
      };
      this.service.validateCouponCode(params);
    } 
  }
  removeCoupon() {
    this.couponData = undefined;
    this.couponAmount = undefined;
    this.couponCode = "";
    this.totalAmount = this.oldTotalAmount;
    this.showCouponCode = undefined;
  }
  changePaymentMethod() {
    if (this.paymentMethod === 'saved_card') {
      this.showElement = false;
    } else if (this.paymentMethod === 'new_card') {
      this.showElement = true;
    }
  }

  back() {
    if (this.step === 1) {
      this.navCtrl.pop();
    } else if (this.step == 9) {
      this.cancelTransection();
    } else {
      this.step--;
      this.backStep(this.step);
    }
  }
}
