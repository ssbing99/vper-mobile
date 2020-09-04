import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Events } from 'ionic-angular';
import { LoadingController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { empty } from 'rxjs/observable/empty';

/*
  Generated class for the ServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ServiceProvider {

  // public API_URL = 'https://yperkokk.com/yper-app/api/';
  public API_URL = 'http://192.168.0.105:8000/api/';
  public loadingText = '';
  public isLoginUser: boolean = false;
  public user: any;
  public alert:boolean=false;
  public alertInit:any;
  constructor(
    public http: HttpClient,
    public storage: Storage,
    public loadingCtrl: LoadingController,
    public events: Events,
    private alertController: AlertController
  ) {
    this.getLoggedinUser().then((val) => {
      this.user = val;
    });
    this.alert=true;
  }
  openAlert(title, msg) {
    this.alertInit = this.alertController.create({
      title: title,
      subTitle: msg,
      buttons: ['OK']
    });
    this.alertInit.present();
    this.alertInit.onDidDismiss(()=>{
      this.alert=true;
    })
  }
  singupSubmit(params: any) {
    params.method = "signupAsChef";
    let loading = this.defaultLoader();
    this.http.post(this.API_URL + 'auth', params).subscribe(data => {
      if (data['status'] == 200) {
        data['loading'] = loading;
        this.events.publish('singup_result', data);
      } else {
        loading.dismiss();
      }
    },
      error => {
        this.openAlert('Alert!!', "Something went wrong please try after some time!");
        loading.dismiss();
      }
    );
  }
  singupSubmitUser(params: any) {
    params.method = "signupAsUser";
    let loading = this.defaultLoader();
    this.http.post(this.API_URL + 'auth', params).subscribe(data => {
      loading.dismiss();
      if (data['status'] == 200) {
        data['loading'] = loading;
        if(this.alert){
          this.alert = false;
        let alert = this.alertController.create({
          title: "Alert",
          subTitle: data['message'],
          buttons: ['OK']
        });
        alert.present();
        alert.onDidDismiss(() => {
          this.alert = true
        });
      }
        this.events.publish('user_singup_result', data);
      } else {
        if(this.alert){
          this.alert = false;
        let alert = this.alertController.create({
          title: "Alert",
          subTitle: data['message'],
          buttons: ['OK']
        });
        alert.present();
        alert.onDidDismiss(() => {
          this.alert = true
        });
      }
        this.events.publish('user_singup_result', data);
      }
    },
      error => {
        this.openAlert('Alert!!', "Something went wrong please try after some time!");
      }
    );
  }
  loginSubmit(params: any) {
    let loading = this.defaultLoader();
    this.http.post(this.API_URL + 'auth', params).subscribe(data => {
      loading.dismiss();
      if (data['status'] == 200) {
        data['loading'] = loading;
        this.storage.set('user', data['data']);
        this.storage.set('user_type', data['data']['user_type']);
        this.storage.set('isLogin', true);
        this.events.publish('login_result', data);
      } else {
        if (data['status'] == 201) {
          this.openAlert('Alert!!', data['message']);
        }

      }
    },
      error => {
        this.openAlert('Alert!!', "Something went wrong please try after some time!");
        loading.dismiss();
      }
    );

  }
  defaultLoader() {
    let loading = this.loadingCtrl.create({
      content: "Please wait.."
    });
    loading.present();
    return loading;
  }
  isLogin() {
    return new Promise(resolve => {
      this.storage.get('isLogin').then((val) => {
        if (val == true) {
          resolve(true);
        } else {
          resolve(false);
        }

      },
        (error) => {
          resolve(false);
          console.log(error);
        })
    });
  }
  getLoggedinUser() {
    return new Promise(resolve => {
      setTimeout(() => {
        this.storage.get('user').then((val) => {
          if (val) {
            resolve(val);
          } else {
            resolve(false);
          }

        },
          (error) => {
            resolve(false);
            console.log(error);
          })
      }, 500);
    });
  }
  getUserDetail() {
    this.getLoggedinUser().then((val) => {
      this.user = val;
    });
    let loading = this.defaultLoader();
    setTimeout(() => {
      let params = {
        "userId": this.user['id'],
        "method": 'getChefProfileDetail'
      };
      this.http.post(this.API_URL + 'auth', params).subscribe(data => {
        loading.dismiss();
        if (data['status'] == 200) {
          data['loading'] = loading;
          this.storage.set('user', data['data']);
          this.events.publish('user_edit', data);
        } else {
          this.openAlert('Alert!!', "Something went wrong please try after some time!");
          loading.dismiss();
        }
      },
        error => {
          this.openAlert('Alert!!', "Something went wrong please try after some time!");
          loading.dismiss();
        }
      );
    }, 900);
  }
  upDateUserDetail(params: any) {
    params.userId = this.user['id'],
      params.method = 'updateChefProfile'
    let loading = this.defaultLoader();
    this.http.post(this.API_URL + 'auth', params).subscribe(data => {
      loading.dismiss();
      if (data['status'] == 200) {
        data['loading'] = loading;
        this.storage.set('user', data['data']);
        this.events.publish('user_updated', true);
        this.openAlert('Success!!', "Profile updated success fully!");
      } else {
        this.openAlert('Alert!!', "Something went wrong please try after some time!");
      }
    },
      error => {
        this.openAlert('Alert!!', "Something went wrong please try after some time!");
        loading.dismiss();
      }
    );
  }
  upDateCustomerDetail(params: any) {
    params.userId = this.user['id'],
      params.method = 'updateuserProfile'
    let loading = this.defaultLoader();
    this.http.post(this.API_URL + 'auth', params).subscribe(data => {
      loading.dismiss();
      if (data['status'] == 200) {
        data['loading'] = loading;
        this.storage.set('user', data['data']);
        this.events.publish('user_updated', true);
        this.openAlert('Success!!', "Profile updated successfully!");
      } else {
        this.openAlert('Alert!!', "Something went wrong please try after some time!");
      }
    },
      error => {
        this.openAlert('Alert!!', "Something went wrong please try after some time!");
        loading.dismiss();
      }
    );
  }
  saveDishe(params: any) {
    params.user_id = this.user['id'];
    let loading = this.defaultLoader();
    this.http.post(this.API_URL + 'dish', params).subscribe(data => {
      loading.dismiss();
      if (data['status'] == 200) {
        data['loading'] = loading;
        this.openAlert("Success", "Dish added successfully!");
      } else if (data['status'] == 201) {
        this.openAlert('Alert!!', "Can not add more than 6 dishes");
      } else {
        this.openAlert('Alert!!', "Something went wrong please try after some time!");
      }
    },
      error => {
        this.openAlert('Alert!!', "Something went wrong please try after some time!");
        loading.dismiss();
      }
    );
  }
  getChecfDishes(page: number, type: string) {
    this.getLoggedinUser().then((val) => {
      this.user = val;
    });
    var loading: any;
    if (type !== 'scroll') {
      loading = this.defaultLoader();
    }
    setTimeout(() => {
      let params = {
        "user_id": this.user['id'],
        "method": 'getChefDishdata',
        "page": page
      };
      this.http.post(this.API_URL + 'dish', params).subscribe(data => {
        if (type !== 'scroll') {
          loading.dismiss();
        }
        if (data['status'] == 200) {
          data['loading'] = loading;
          data['type'] = type;
          this.events.publish('checf_dishes', data);
        } else if (data['status'] == 201) {
          this.events.publish('checf_dishes', data);
        } else {
          this.openAlert('Alert!!', "Something went wrong please try after some time!");
          this.events.publish('checf_dishes', data);
        }
      },
        error => {
          this.openAlert('Alert!!', "Something went wrong please try after some time!");
          //this.events.publish('checf_dishes');
        }
      );
    }, 700);
  }
  getDishDetail(dishId: number) {
    this.getLoggedinUser().then((val) => {
      this.user = val;
    });
    var loading: any;
    loading = this.defaultLoader();
    setTimeout(() => {
      let params = {
        "user_id": this.user['id'],
        "method": 'getDishDetail',
        "dishId": dishId
      };
      this.http.post(this.API_URL + 'dish', params).subscribe(data => {
        loading.dismiss();
        if (data['status'] == 200) {
          data['loading'] = loading;
          this.events.publish('dishDetail', data);
        } else {
          this.openAlert('Alert!!', "Something went wrong please try after some time!");
          this.events.publish('checf_dishes');
        }
      },
        error => {
          this.openAlert('Alert!!', "Something went wrong please try after some time!");
          this.events.publish('checf_dishes');
        }
      );
    }, 700);
  }
  updateDish(params: any) {
    params.user_id = this.user['id'];
    let loading = this.defaultLoader();
    this.http.post(this.API_URL + 'dish', params).subscribe(data => {
      loading.dismiss();
      if (data['status'] == 200) {
        data['loading'] = loading;
        if (data['ProfileStatus'] == "Success") {
          this.openAlert("Success", "Dish updated successfully!");
        } else {
          this.openAlert("Success", "Dish updated successfullyate but can't update your show on profile status because already added 4 profile !");
        }

      } else {
        this.openAlert('Alert!!', "Something went wrong please try after some time!");
      }
    },
      error => {
        this.openAlert('Alert!!', "Something went wrong please try after some time!");
        loading.dismiss();
      }
    );
  }
  deleteDish(params: any, index: number) {
    params.user_id = this.user['id'];
    let loading = this.defaultLoader();
    this.http.post(this.API_URL + 'dish', params).subscribe(data => {
      loading.dismiss();
      if (data['status'] == 200) {
        data['loading'] = loading;
        this.openAlert("Success", "Dish deleted successfully!");
        let indexData = {
          "index": index,
          "status": 200
        }
        this.events.publish('dishDeleted', indexData);
      } else {
        this.openAlert('Alert!!', "Something went wrong please try after some time!");
      }
    },
      error => {
        this.openAlert('Alert!!', "Something went wrong please try after some time!");
        loading.dismiss();
      }
    );
  }

  getCountry() {
    setTimeout(() => {
      let params = {
        "method": 'getAllcountryList',

      };
      this.http.post(this.API_URL + 'dish', params).subscribe(data => {

        if (data['status'] == 200) {
          this.events.publish('country', data);
        } else {
          this.openAlert('Alert!!', "Something went wrong please try after some time!");
        }
      },
        error => {
          this.openAlert('Alert!!', "Something went wrong please try after some time!");
        }
      );
    }, 1);
  }
  getChecfs(params: any) {
    params.method = "getCheflocation";
    if(params.callType=='chef'){
      var loading = this.loadingCtrl.create({
        content: "Please wait while getting data.."
      });
      loading.present();
    }
    setTimeout(() => {
      this.http.post(this.API_URL + 'dish', params).subscribe(data => {
        if(params.callType=='chef' && loading!==undefined){
          loading.dismiss();
        }
        if (data['status'] == 200) {
          this.events.publish('getChef', data);
        } else {
          this.events.publish('getChef', data);
          this.openAlert('Alert!!', "Something went wrong please try after some time!");
        }
      },
        error => {
          this.events.publish('getChef', {});
          this.openAlert('Alert!!', "Something went wrong please try after some time!");
        }
      );
    }, 1);
  }
  getChecfsDeatilById(params: any) {
    params.method = "getChefProfiledata";
    setTimeout(() => {

      this.http.post(this.API_URL + 'dish', params).subscribe(data => {

        if (data['status'] == 200) {
          this.events.publish('chefProfileDetail', data);
        } else {
          this.openAlert('Alert!!', "Something went wrong please try after some time!");
        }
      },
        error => {
          this.openAlert('Alert!!', "Something went wrong please try after some time!");
        }
      );
    }, 1);
  }
  setStorage(name, obj) {
    this.storage.set(name, JSON.stringify(obj));
  }
  logout(user_id) {
    var loading: any;
    loading = this.defaultLoader();
    setTimeout(()=>{
      let params = {
        "userId": user_id,
        "method": "nullDevliceId"
      }
    this.http.post(this.API_URL + 'dish', params).subscribe(data => {
      loading.dismiss();
    },
      error => {
        loading.dismiss();
        this.openAlert('Alert!!', "Something went wrong please try after some time!");
      }
    );
  },100);
  }
  startChat(params: any) {
    params.method = "UserChatSaveDate";
    setTimeout(() => {
      this.http.post(this.API_URL + 'dish', params).subscribe(data => {
        if (data['status'] == 200) {
          this.events.publish('savedChatDataUser', data);
        } else {
          this.openAlert('Alert!!', "Something went wrong please try after some time!");
        }
      },
        error => {
          this.openAlert('Alert!!', "Something went wrong please try after some time!");
        }
      );
    }, 1);
  }
  getChat(params: any, type: any) {
    params.method = "UserChatGetDate";
    setTimeout(() => {
      this.http.post(this.API_URL + 'dish', params).subscribe(data => {
        if (data['status'] == 200) {
          if (type == 'chef') {
            this.events.publish('chefchatData', data);
          } else {
            this.events.publish('chatData', data);
          }

        } else {
          this.openAlert('Alert!!', "Something went wrong please try after some time!");
        }
      },
        error => {
          this.openAlert('Alert!!', "Something went wrong please try after some time!");
        }
      );
    }, 1);
  }
  getChatList(params: any) {
    params.method = "getchefchatList";
    setTimeout(() => {
      this.http.post(this.API_URL + 'dish', params).subscribe(data => {
        if (data['status'] == 200) {
          this.events.publish('chefChatList', data);
        } else {
          this.openAlert('Alert!!', "Something went wrong please try after some time!");
        }
      },
        error => {
          this.openAlert('Alert!!', "Something went wrong please try after some time!");
        }
      );
    }, 1);
  }
  getLatestChat(params: any) {
    params.method = "chStatusreadybyuser";
    setTimeout(() => {
      this.http.post(this.API_URL + 'dish', params).subscribe(data => {
        if (data['status'] == 200) {
          this.events.publish('LatestChat', data);
        } else {
          //this.openAlert('Alert!!', "Something went wrong please try after some time!");
        }
      },
        error => {
          this.openAlert('Alert!!', "Something went wrong please try after some time!");
        }
      );
    }, 1);
  }
  getTotalChecfAmount(params: any) {
    params.method = "GetPersonDayviseAmnt";
    setTimeout(() => {
      this.http.post(this.API_URL + 'dish', params).subscribe(data => {

        if (data['status'] == 200) {
          this.events.publish('amountCalculation', data);
        } else {
          this.openAlert('Alert!!', "Something went wrong please try after some time!");
        }
      },
        error => {
          this.openAlert('Alert!!', "Something went wrong please try after some time!");
        }
      );
    }, 1);
  }
  getState(params: any) {
    params.method = "GetStateby_Cid";
    setTimeout(() => {
      this.http.post(this.API_URL + 'dish', params).subscribe(data => {

        if (data['status'] == 200) {
          this.events.publish('state', data);
        } else {
          this.openAlert('Alert!!', "Something went wrong please try after some time!");
        }
      },
        error => {
          this.openAlert('Alert!!', "Something went wrong please try after some time!");
        }
      );
    }, 1);
  }
  getCity(params: any) {
    params.method = "GetCityby_Sid";
    setTimeout(() => {
      this.http.post(this.API_URL + 'dish', params).subscribe(data => {

        if (data['status'] == 200) {
          this.events.publish('city', data);
        } else {
          this.openAlert('Alert!!', "Something went wrong please try after some time!");
        }
      },
        error => {
          this.openAlert('Alert!!', "Something went wrong please try after some time!");
        }
      );
    }, 1);
  }
  bookChefNow(params: any) {
    params.method = "handelBookrequest";
    var loading: any;
    loading = this.defaultLoader();
    setTimeout(() => {
      this.http.post(this.API_URL + 'dish', params).subscribe(data => {
        loading.dismiss();
        if (data['status'] == 200) {
          this.events.publish('booking_pending', data);
        } else {
          this.openAlert('Alert!!', "Something went wrong please try after some time!");
        }
      },
        error => {
          loading.dismiss();
          this.openAlert('Alert!!', "Something went wrong please try after some time!");
        }
      );
    }, 1);
  }
  getCurrentUserBooking(params: any) {
    params.method = "GetCurrentbooking";
    var loading: any;
    loading = this.defaultLoader();
    setTimeout(() => {
      this.http.post(this.API_URL + 'dish', params).subscribe(data => {
        loading.dismiss();
        if (data['status'] == 200) {
          this.events.publish('current_booking_list', data);
        } else {
          this.openAlert('Alert!!', "Something went wrong please try after some time!");
        }
      },
        error => {
          loading.dismiss();
          this.openAlert('Alert!!', "Something went wrong please try after some time!");
        }
      );
    }, 1);
  }
  getPastUserBooking(params: any) {
    params.method = "GetPastbooking";
    var loading: any;
    loading = this.defaultLoader();
    setTimeout(() => {
      this.http.post(this.API_URL + 'dish', params).subscribe(data => {
        loading.dismiss();
        if (data['status'] == 200) {
          this.events.publish('current_booking_list', data);
        } else {
          this.openAlert('Alert!!', "Something went wrong please try after some time!");
        }
      },
        error => {
          loading.dismiss();
          this.openAlert('Alert!!', "Something went wrong please try after some time!");
        }
      );
    }, 1);
  }
  getReffrelData(params: any) {
    params.method = "GetChefReferalData";
    var loading: any;
    loading = this.defaultLoader();
    setTimeout(() => {
      this.http.post(this.API_URL + 'dish', params).subscribe(data => {
        loading.dismiss();
        if (data['status'] == 200) {
          this.events.publish('refreal_data', data);
        } else {
          this.openAlert('Alert!!', "Something went wrong please try after some time!");
        }
      },
        error => {
          this.openAlert('Alert!!', "Something went wrong please try after some time!");
        }
      );
    }, 1);
  }
  getCurrentChefBooking(params: any) {
    params.method = "GetChefCurrentbooking";
    var loading: any;
    loading = this.defaultLoader();
    setTimeout(() => {
      this.http.post(this.API_URL + 'dish', params).subscribe(data => {
        loading.dismiss();
        if (data['status'] == 200) {
          this.events.publish('chef_booking_list', data);
        } else {
          this.openAlert('Alert!!', "Something went wrong please try after some time!");
        }
      },
        error => {
          loading.dismiss();
          this.openAlert('Alert!!', "Something went wrong please try after some time!");
        }
      );
    }, 1);
  }
  getPastChefBooking(params: any) {
    params.method = "GetChefPastbooking";
    var loading: any;
    loading = this.defaultLoader();
    setTimeout(() => {
      this.http.post(this.API_URL + 'dish', params).subscribe(data => {
        loading.dismiss();
        if (data['status'] == 200) {
          this.events.publish('chef_booking_list', data);
        } else {
          this.openAlert('Alert!!', "Something went wrong please try after some time!");
        }
      },
        error => {
          this.openAlert('Alert!!', "Something went wrong please try after some time!");
        }
      );
    }, 1);
  }
  getTotalIncomeData(params: any) {
    params.method = "GetChefAllbooking";
    var loading: any;
    loading = this.defaultLoader();
    setTimeout(() => {
      this.http.post(this.API_URL + 'dish', params).subscribe(data => {
        loading.dismiss();
        if (data['status'] == 200) {
          this.events.publish('chef_income', data);
        } else {
          this.openAlert('Alert!!', "Something went wrong please try after some time!");
        }
      },
        error => {
          loading.dismiss();
          this.openAlert('Alert!!', "Something went wrong please try after some time!");
        }
      );
    }, 1);
  }
  paymentHandler(params: any) {
    params.method = "StripePaymentHandler";
    var loading: any;
    loading = this.defaultLoader();
    setTimeout(() => {
      this.http.post(this.API_URL + 'dish', params).subscribe(data => {
        loading.dismiss();
        if (data['status'] == 200) {
          this.events.publish('booked', data);
        } else {
          this.openAlert('Alert!!', "Something went wrong please try after some time!");
        }
      },
        error => {
          loading.dismiss();
          this.openAlert('Alert!!', "Something went wrong please try after some time!");
        }
      );
    }, 1);
  }
  paymentHandlerUpgrade(params: any) {
    params.method = "StripePaymentHandlerForMember";
    var loading: any;
    loading = this.defaultLoader();
    setTimeout(() => {
      this.http.post(this.API_URL + 'dish', params).subscribe(data => {
        loading.dismiss();
        if (data['status'] == 200) {
          if(data['type']!==undefined && data['type']=='error'){
            this.openAlert('Alert!!', data['message']);
          } else {
            this.events.publish('upgraded', data);
          }
          
        } else {
          this.openAlert('Alert!!', "Something went wrong please try after some time!");
        }
      },
        error => {
          loading.dismiss();
          this.openAlert('Alert!!', "Something went wrong please try after some time!");
        }
      );
    }, 1);
  }

  getUserDetailById() {
    this.getLoggedinUser().then((val) => {
      this.user = val;
    });
    setTimeout(() => {
      let params = {
        "userId": this.user['id'],
        "method": 'getChefProfileDetail'
      };
      this.http.post(this.API_URL + 'auth', params).subscribe(data => {
        if (data['status'] == 200) {
          this.events.publish('upgradeUser', data);
        } else {
          this.openAlert('Alert!!', "Something went wrong please try after some time!");
        }
      },
        error => {
          this.openAlert('Alert!!', "Something went wrong please try after some time!");
        }
      );
    }, 1);
  }
  getChefWallet() {
    this.getLoggedinUser().then((val) => {
      this.user = val;
      var loading: any;
      loading = this.defaultLoader();
      setTimeout(() => {
        let params = {
          "user_id": this.user['id'],
          "method": 'GetWalletDetailUser'
        };
        this.http.post(this.API_URL + 'auth', params).subscribe(data => {
          loading.dismiss();
          if (data['status'] == 200) {
            this.events.publish('chef_wallet', data);
          } else {
            this.openAlert('Alert!!', "Something went wrong please try after some time!");
          }
        },
          error => {
            loading.dismiss();
            this.openAlert('Alert!!', "Something went wrong please try after some time!");
          }
        );
      }, 500);
    });
  }
  getChefWalletTwoWeek() {
    this.getLoggedinUser().then((val) => {
      this.user = val;
      var loading: any;
      loading = this.defaultLoader();

      let params = {
        "user_id": this.user['id'],
        "method": 'GetWalletTotalAmmountTwoWeek'
      };
      this.http.post(this.API_URL + 'auth', params).subscribe(data => {
        loading.dismiss();
        if (data['status'] == 200) {
          this.events.publish('chef_wallet_two_week', data);
        } else {
          this.openAlert('Alert!!', "Something went wrong please try after some time!");
        }
      },
        error => {
          loading.dismiss();
          this.openAlert('Alert!!', "Something went wrong please try after some time!");
        }
      );
    });
  }
  changePushSetting(params) {
    this.getLoggedinUser().then((val) => {
      this.user = val;
    });
    var loading: any;
    loading = this.defaultLoader();
    setTimeout(() => {
      params.user_id = this.user['id'];
      params.method = 'UpdateNotificationSetting';
      this.http.post(this.API_URL + 'auth', params).subscribe(data => {
        loading.dismiss();
        if (data['status'] == 200) {
        } else {
          this.openAlert('Alert!!', "Something went wrong please try after some time!");
        }
      },
        error => {
          loading.dismiss();
          this.openAlert('Alert!!', "Something went wrong please try after some time!");
        }
      );
    }, 1);
  }
  getBookingDetail(params) {
    this.getLoggedinUser().then((val) => {
      this.user = val;
    });
    var loading: any;
    loading = this.defaultLoader();
    params.method = "getChefOrderdetail";
    setTimeout(() => {

      this.http.post(this.API_URL + 'auth', params).subscribe(data => {
        loading.dismiss();
        if (data['status'] == 200) {
          if (params.user_type == 'chef') {
            this.events.publish('bookingDetail_chef', data);
          } else {
            this.events.publish('bookingDetail_chef', data);
          }
        } else {
          this.openAlert('Alert!!', "Something went wrong please try after some time!");
        }
      },
        error => {
          loading.dismiss();
          this.openAlert('Alert!!', "Something went wrong please try after some time!");
        }
      );
    }, 1);
  }
  saveReview(params) {
    this.getLoggedinUser().then((val) => {
      var loading: any;
      loading = this.defaultLoader();
      params.method = "SaveReviewData";
      this.http.post(this.API_URL + 'auth', params).subscribe(data => {
        loading.dismiss();
        if (data['status'] == 200) {
          this.getPastUserBooking({"user_id":params['user_id']});
        } else {
          this.openAlert('Alert!!', "Something went wrong please try after some time!");
        }
      },
        error => {
          loading.dismiss();
          this.openAlert('Alert!!', "Something went wrong please try after some time!");
        }
      );
    });
  }
  getReview(params) {
    this.getLoggedinUser().then((val) => {
      var loading: any;
      loading = this.defaultLoader();
      params.method = "getChefReview";
      this.http.post(this.API_URL + 'auth', params).subscribe(data => {
        loading.dismiss();
        if (data['status'] == 200) {
          this.events.publish('chef_review_data', data);
        } else {
          this.events.publish('chef_review_data', data);
          this.openAlert('Alert!!', "Something went wrong please try after some time!");
        }
      },
        error => {
          loading.dismiss();
          this.openAlert('Alert!!', "Something went wrong please try after some time!");
        }
      );
    });
  }
  loginFromGoogle(params) {
    var loading: any;
    loading = this.defaultLoader();
    params.method = "googleLogin";
    this.http.post(this.API_URL + 'auth', params).subscribe(data => {
      loading.dismiss();
      if (data['status'] == 200) {
        this.storage.set('user', data['data']);
        this.storage.set('user_type', data['data']['user_type']);
        this.storage.set('isLogin', true);
        this.events.publish('google_login', data);
      } else {
        this.events.publish('google_login', data);
        if (data['status'] == 201) {
          this.openAlert('Alert!!', data['message']);
        } else {

          this.openAlert('Alert!!', JSON.stringify(data));
        }
      }
    },
      error => {
        loading.dismiss();
        let ddd = JSON.stringify(error);
        this.openAlert('Alert!!', "Something went wrong please try after some time!" + ddd);
      }
    );
  }
  getCommonTipsData(params) {
    var loading: any;
    loading = this.defaultLoader();
    params.method = "getchefCommontips";
    this.http.post(this.API_URL + 'auth', params).subscribe(data => {
      loading.dismiss();
      if (data['status'] == 200) {
        this.events.publish('chef_commontips_data', data);
      } else {
        this.events.publish('chef_commontips_data', data);
        this.openAlert('Alert!!', "Something went wrong please try after some time!");
      }
    },
      error => {
        loading.dismiss();
        this.openAlert('Alert!!', "Something went wrong please try after some time!");
      }
    );
  }
  changePassword(params) {
    var loading: any;
    loading = this.defaultLoader();
    params.method = "changePassword";
    this.http.post(this.API_URL + 'auth', params).subscribe(data => {
      loading.dismiss();
      if (data['status'] == 200) {
        this.events.publish('change_passwword', data);
      } else if (data['status'] == 201) {
        this.events.publish('change_passwword', data);
      } else {
        this.openAlert('Alert!!', "Something went wrong please try after some time!");
      }
    },
      error => {
        loading.dismiss();
        this.openAlert('Alert!!', "Something went wrong please try after some time!");
      }
    );
  }
  sendCode(params) {
    var loading: any;
    loading = this.defaultLoader();
    params.method = "forget_password";
    this.http.post(this.API_URL + 'auth', params).subscribe(data => {
      loading.dismiss();
      if (data['status'] == 200) {
        this.events.publish('forget_passwword', data);
      } else if (data['status'] == 201) {
        this.events.publish('forget_passwword', data);
      } else {
        this.openAlert('Alert!!', "Something went wrong please try after some time!");
      }
    },
      error => {
        loading.dismiss();
        this.openAlert('Alert!!', "Something went wrong please try after some time!");
      }
    );
  }
  resetPassword(params) {
    var loading: any;
    loading = this.defaultLoader();
    params.method = "Resetpassword";
    this.http.post(this.API_URL + 'auth', params).subscribe(data => {
      loading.dismiss();
      if (data['status'] == 200) {
        this.events.publish('reset', data);
      } else if (data['status'] == 201) {
        this.events.publish('reset', data);
      } else {
        this.openAlert('Alert!!', "Something went wrong please try after some time!");
      }
    },
      error => {
        loading.dismiss();
        this.openAlert('Alert!!', "Something went wrong please try after some time!");
      }
    );
  }
  loginFromFb(params) {
    var loading: any;
    loading = this.defaultLoader();
    params.method = "fbLogin";
    this.http.post(this.API_URL + 'auth', params).subscribe(data => {
      loading.dismiss();
      if (data['status'] == 200) {
        this.storage.set('user', data['data']);
        this.storage.set('user_type', data['data']['user_type']);
        this.storage.set('isLogin', true);
        this.events.publish('fb_login', data);
      } else {
        this.events.publish('fb_login', data);
        if (data['status'] == 201) {
          this.openAlert('Alert!!', data['message']);
        } else {

          this.openAlert('Alert!!', JSON.stringify(data));
        }
      }
    },
      error => {
        loading.dismiss();
        let ddd = JSON.stringify(error);
        console.log(ddd);
        this.openAlert('Alert!!', "Something went wrong please try after some time!" + ddd);
      }
    );
  }
  getPastChatData(params) {
    var loading: any;
    loading = this.defaultLoader();
    params.method = "UserChatGetDataByorderId";
    this.http.post(this.API_URL + 'auth', params).subscribe(data => {
      loading.dismiss();
      if (data['status'] == 200) {
        this.events.publish('pastChatData', data);
      } else {
        this.events.publish('pastChatData', data);
      }
    },
      error => {
        loading.dismiss();
        let ddd = JSON.stringify(error);
        this.openAlert('Alert!!', "Something went wrong please try after some time!" + ddd);
      }
    );
  }
  sendPush(params) {
    params.method = "sendpush_notification";
    this.http.post(this.API_URL + 'auth', params).subscribe(data => {

    },
      error => {

      }
    );
  }
  saveChastListData(params) {
    params.method = "UserChatSaveData";
    this.http.post(this.API_URL + 'auth', params).subscribe(data => {
      
    },
      error => {
        
      }
    );
  }
  getAppShareUrl(){
    setTimeout(() => {
      this.http.get(this.API_URL + 'app_share_url').subscribe(data => {

        if (data['status'] == 200) {
          this.events.publish('share_url', data);
        } else {
        }
      },
        error => {
          //this.openAlert('Alert!!', "Something went wrong please try after some time!");
        }
      );
    }, 1);
  }
  validateCouponCode(params: any) {
    params.method = "StripeCouponOff";
    var loading: any;
    loading = this.defaultLoader();
    setTimeout(() => {
      this.http.post(this.API_URL + 'results', params).subscribe(data => {
        loading.dismiss();
        if (data['status'] == 200) {
          if(data['message']!==undefined && data['message']!=="Success"){
            this.events.publish('couponCode', data);
          } else {
            this.events.publish('couponCode', data);
          }
        } else {
          this.openAlert('Alert!!', "Something went wrong please try after some time!");
        }
      },
        error => {
          loading.dismiss();
          this.openAlert('Alert!!', "Something went wrong please try after some time!");
        }
      );
    }, 1);
  }
  removeChatList(params: any) {
    params.method = "removeChecfChatList";
    var loading: any;
    loading = this.defaultLoader();
    setTimeout(() => {
      this.http.post(this.API_URL + 'results', params).subscribe(data => {
        loading.dismiss();
        if (data['status'] == 200) {
          this.openAlert('Success!!', "Chat list has been removed!");
          this.events.publish('remove-chat', data);
        } else {
          this.openAlert('Alert!!', "Something went wrong please try after some time!");
        }
      },
        error => {
          loading.dismiss();
          this.openAlert('Alert!!', "Something went wrong please try after some time!");
        }
      );
    }, 1);
  }

  updateDeviceData(params) {
    params.method = "updateDeviceInfo";
    this.http.post(this.API_URL + 'auth', params).subscribe(() => {
    }, () => {});
  }
}
