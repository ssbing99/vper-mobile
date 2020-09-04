import { Component, ViewChild } from '@angular/core';

import { Platform, MenuController, Nav, AlertController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { TranslateService } from '@ngx-translate/core';
import { Storage } from '@ionic/storage';

import { ServiceProvider } from '../providers/service/service';
import { Device } from '@ionic-native/device';
import { Push, PushObject, PushOptions } from '@ionic-native/push';
/* page list start|| Manish Tiwari */

import { LoginPage } from '../pages/login/login';
import { SettingsPage } from '../pages/settings/settings';
import { BookingPage } from '../pages/booking/booking';
import { MemberUpgradePage } from '../pages/member-upgrade/member-upgrade';
import { ReferalPage } from '../pages/referal/referal';
import { SupportPage } from '../pages/support/support';
import { BusinessConceptPage } from '../pages/business-concept/business-concept';
import { QuickPayPage } from '../pages/quick-pay/quick-pay';
import { WeekPayPage } from '../pages/week-pay/week-pay';
import { CommonTipsPage } from '../pages/common-tips/common-tips';
import { ReferChefPage } from '../pages/refer-chef/refer-chef';
import { ProfileManagementPage } from '../pages/profile-management/profile-management';
import { MyEarningDashboardPage } from '../pages/my-earning-dashboard/my-earning-dashboard';
import { StartPage } from '../pages/start/start';
import { Events } from 'ionic-angular';
import { EditProfilePage } from '../pages/edit-profile/edit-profile';
import { ChefMyEarningPage } from '../pages/chef-my-earning/chef-my-earning';
import { OurChefsPage } from '../pages/our-chefs/our-chefs';
import { UserEditProfilePage } from '../pages/user-edit-profile/user-edit-profile';
import { AlaMinuteMapPage } from '../pages/ala-minute-map/ala-minute-map';
import { ChatPage } from '../pages/chat/chat';
import { ChefChatListPage } from '../pages/chef-chat-list/chef-chat-list';
import { ChefBookingListPage } from '../pages/chef-booking-list/chef-booking-list';
import { ChefChatPage } from '../pages/chef-chat/chef-chat';
import { AlaMinutePage } from '../pages/ala-minute/ala-minute';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  // make HelloIonicPage the root (or first) page
  rootPage;
  pages: Array<{ title: string, component: any, ismulti: boolean, nestedObject: object, icon: string }>;
  showLevel1 = null;
  showLevel2 = null;
  public isLoginUser: boolean = false;
  public user: any;
  public menuTranslation: any = [];
  public notificationId: any;
  constructor(
    public platform: Platform,
    public menu: MenuController,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    public translate: TranslateService,
    public events: Events,
    public storage: Storage,
    public service: ServiceProvider,
    private device: Device,
    private push: Push,
    public altCltr: AlertController,
    public menuCtrl: MenuController
  ) {
    var translate:TranslateService;
    this.user = {};
    translate.setDefaultLang('pcm');
    translate.use('pcm');
    this.storage.get('language').then((data) => {
      if (data !== null) {
        if (data == 'eng') {
          translate.use('en');
        } else {
          translate.use(data);
        }

        translate.get('menu').subscribe(
          value => {
            this.menuTranslation = value;
          }
        )
      } else {
        translate.use('pcm');
        translate.get('menu').subscribe(
          value => {
            this.menuTranslation = value;
          }
        )
      }
    });
    this.initializeApp();
//this.initPush();
  }

  ngOnInit() {

    this.callAllSubscribe(this.events);
  }
  callAllSubscribe(events) {
    events.subscribe('updateChecfMenu', object => {
      if (object != null) {

        if (object.user_type === "chef") {
          this.nav.setRoot(StartPage);
          this.checfLoginMenu();
        } else {
          this.nav.setRoot(AlaMinutePage);
          this.userLoginMenu();
        }

        setTimeout(() => {
          this.service.getLoggedinUser().then((data) => {
            if (data) {
              this.user = data;
            }
          });
        }, 1000);
        this.isLoginUser = true;
      }
    });
    events.subscribe('user_updated', object => {
      if (object != null) {
        setTimeout(() => {
          this.service.getLoggedinUser().then((data) => {
            if (data) {
              this.user = data;
            }
          });
        }, 1000)
      }
    });
    events.subscribe('openMenu', object => {
      this.openMenu();
    });
    events.subscribe('changeLanguage', object => {
      this.translate.use(object);
      this.translate.get('menu').subscribe(
          value => {
            this.menuTranslation = value;
            this.storage.get('user_type').then((val) => {
              if (val == 'chef') {
                this.checfLoginMenu();
              } else {
                this.userLoginMenu();
              }
            });
          }
        )
    });
    events.subscribe('closeMenu', object => {
      this.closeMenu()
    });
    events.subscribe('updateDeviceInfo', (deviceToken) => {
      this.storage.get('user').then((data)=> {
        if (data != null) {
          let platform = '';
          if (this.platform.is('android')) {
            platform = 'android';
          } else if (this.platform.is('ios')) {
            platform = 'ios';
          }
          
          const params = {
            device_id: deviceToken,
            device_platform: platform,
            id: data.id
          };

          this.service.updateDeviceData(params);
        }
      });
    });
  }
  initializeApp() {
    this.platform.ready().then(() => {
      if (this.device.uuid !== null) {
      }
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.initPush();
      setTimeout(() => {
        this.service.getLoggedinUser().then((data) => {
          if (data) {
            this.user = data;
          }
        });
      }, 1000)
      this.service.isLogin().then((data) => {
        if (data === false) {
          this.nav.setRoot(LoginPage);
        }
      });
      this.storage.get('isLogin').then((val) => {
        if (val === true) {
          this.isLoginUser = true;
          this.changeMenu();
        }
      });
    });
  }
  initPush() {
    if (this.platform.is('cordova')) {
      this.push.hasPermission().then((res: any) => {
        if (res.isEnabled) {
          // this.service.openAlert("Alert",'We have permission to send push notifications');
        } else {
          // this.service.openAlert("Alert","We do not have permission to send push notifications");
        }
      });

      if (this.platform.is('android')) {
        this.push.createChannel({
          id: 'channelNotification',
          description: 'Reminders',
          importance: 4,
          sound: 'default'
        }).then(() => {
          this.pushInit();
        });
      } else if (this.platform.is('ios')) {
        this.pushInit();
      }
    }
  }

  private pushInit() {
    let pushObject: PushObject;

    const options: PushOptions = {
      android: {
        senderID: '1071679601356',
        forceShow: true,
        vibrate: true,
        sound: true,
        icon: 'ic_notification',
        iconColor: 'black'
      },
      ios: {
        alert: true,
        badge: true,
        sound: true
      },
      windows: {},
      browser: {
        pushServiceURL: 'http://push.api.phonegap.com/v1/push',
        applicationServerKey: "AIzaSyBwCmvQmTGiXVV_0UX1v8F45QSwUR2F5i4"
      }
    };

    pushObject = this.push.init(options);

    pushObject.on('registration').subscribe((data: any) => {
      this.storage.get("device_id").then((val) => {
        if (val == null || val == '') {
          // Store the device id once first time open app
          this.setupNewToken(data);
        } else {
          if (data.registrationId != val) {
            // Store the device id 
            this.setupNewToken(data);
          }
          this.events.publish('updateDeviceInfo', data.registrationId);
        }
      });
    });

    pushObject.on('notification').subscribe((data: any) => {
      if (this.platform.is('android')) {
        this.androidOnMessage(pushObject, data);
      } else if (this.platform.is('ios')) {
        this.iosOnMessage(pushObject, data);
      }
    });

    pushObject.on('error').subscribe(error => { });
  }

  private setupNewToken(data: any) {
    this.service.setStorage("device_id", data.registrationId);
    this.events.publish('loginSetup', data.registrationId);
  }

  private androidOnMessage(pushObject, data) {
    if (this.notificationId == null || this.notificationId != data.additionalData.notId) {
      this.notificationId = data.additionalData.notId;
    
      if (data.additionalData.custom_data.type == 'chat') {
        // No actions taken when in conversation page
        if (!(this.nav.getActive().instance instanceof ChatPage) 
        && !(this.nav.getActive().instance instanceof ChefChatPage)) {
          console.log('Able enter chat page');
          //if user using app and push notification comes
          if (data.additionalData.foreground) {
            // if application open, show popup
            let confirmAlert = this.altCltr.create({
              title: data.title,
              message: data.message,
              buttons: [{
                text: 'Ignore',
                role: 'cancel'
              }, {
                text: 'View',
                handler: () => {
                  pushObject.clearAllNotifications();
                  //TODO: Your logic here
                  this.storage.get('user_type').then((val) => {
                    if (val == 'chef') {
                      this.nav.push(ChefChatPage, { userId: data.additionalData.custom_data.user_id_from });
                    } else {
                      this.nav.push(ChatPage, { chef_id: data.additionalData.custom_data.user_id_from });
                    }
                  });

                }
              }]
            });
            confirmAlert.present();
          } else {
            //if user NOT using app and push notification comes
            //TODO: Your logic on click of push notification directly
            this.storage.get('user_type').then((val) => {
              if (val == 'chef') {
                this.nav.push(ChefChatPage, { userId: data.additionalData.custom_data.user_id_from });
              } else {
                this.nav.push(ChatPage, { chef_id: data.additionalData.custom_data.user_id_from });
              }
            });
            //this.nav.push(ChatPage, { chef_id: data.additionalData['gcm.notification.user_id_to'] });
          }
        }
      }

      if (data.additionalData.custom_data.type == 'booking') {
        // No actions taken when in conversation page
        if (!(this.nav.getActive().instance instanceof BookingPage) 
        && !(this.nav.getActive().instance instanceof ChefBookingListPage)) {
          console.log('Able enter booking page');
          //if user using app and push notification comes
          if (data.additionalData.foreground) {
            // if application open, show popup
            let confirmAlert = this.altCltr.create({
              title: data.title,
              message: data.message,
              buttons: [{
                text: 'Ignore',
                role: 'cancel'
              }, {
                text: 'View',
                handler: () => {
                  pushObject.clearAllNotifications();
                  //TODO: Your logic here
                  this.storage.get('user_type').then((val) => {
                    if (val == 'chef') {
                      this.nav.push(ChefBookingListPage);
                    } 
                  });
                }
              }]
            });
            confirmAlert.present();
          } else {
            //if user NOT using app and push notification comes
            //TODO: Your logic on click of push notification directly
            this.storage.get('user_type').then((val) => {
              if (val == 'chef') {
                this.nav.push(ChefBookingListPage);
              } else {
                this.nav.push(BookingPage);
              }
            });
          }
        } else {
          let confirmAlert = this.altCltr.create({
            title: data.title,
            message: data.message,
            buttons: [{
              text: 'Ignore',
              role: 'cancel'
            }, {
              text: 'Refresh',
              handler: () => {
                pushObject.clearAllNotifications();
                //TODO: Your logic here
                this.storage.get('user_type').then((val) => {
                  if (val == 'chef') {
                    this.events.publish('updateChefBooking')
                  } else {
                    this.events.publish('updateBooking')
                  }
                });
              }
            }]
          });
          confirmAlert.present();
        }
      } 

      if (data.additionalData.custom_data.type == 'reminder') {
        if (data.additionalData.foreground) {
          // if application open, show popup
          let confirmAlert = this.altCltr.create({
            title: data.title,
            message: data.message,
            buttons: [{
              text: 'OK'
            }]
          });
          confirmAlert.present();
        }
      }
    }
  }

  private iosOnMessage(pushObject, data) {
    let custom_data = JSON.parse(data.additionalData['gcm.notification.custom_data'])
    
    if (custom_data.type == 'chat') {
      // No actions taken when in conversation page
      if (!(this.nav.getActive().instance instanceof ChatPage) 
      && !(this.nav.getActive().instance instanceof ChefChatPage)) {
        //if user using app and push notification comes
        if (data.additionalData.foreground) {
          // if application open, show popup
          let confirmAlert = this.altCltr.create({
            title: data.title,
            message: data.message,
            buttons: [{
              text: 'Ignore',
              role: 'cancel'
            }, {
              text: 'View',
              handler: () => {
                pushObject.clearAllNotifications();
                //TODO: Your logic here
                this.storage.get('user_type').then((val) => {
                  if (val == 'chef') {
                    this.nav.push(ChefChatPage, { userId: custom_data.user_id_from });
                  } else {
                    this.nav.push(ChatPage, { chef_id: custom_data.user_id_from });
                  }
                });
              }
            }]
          });
          confirmAlert.present();
        } else {
          //if user NOT using app and push notification comes
          //TODO: Your logic on click of push notification directly
          this.storage.get('user_type').then((val) => {
            if (val == 'chef') {
              this.nav.push(ChefChatPage, { userId: custom_data.user_id_from });
            } else {
              this.nav.push(ChatPage, { chef_id: custom_data.user_id_from });
            }
          });
        }
      }
    }

    if (custom_data.type == 'booking') {
      // No actions taken when in conversation page
      if (!(this.nav.getActive().instance instanceof BookingPage) 
      && !(this.nav.getActive().instance instanceof ChefBookingListPage)) {
        console.log('Able enter booking page');
        //if user using app and push notification comes
        if (data.additionalData.foreground) {
          // if application open, show popup
          let confirmAlert = this.altCltr.create({
            title: data.title,
            message: data.message,
            buttons: [{
              text: 'Ignore',
              role: 'cancel'
            }, {
              text: 'View',
              handler: () => {
                pushObject.clearAllNotifications();
                //TODO: Your logic here
                this.storage.get('user_type').then((val) => {
                  if (val == 'chef') {
                    this.nav.push(ChefBookingListPage);
                  } 
                });
              }
            }]
          });
          confirmAlert.present();
        } else {
          //if user NOT using app and push notification comes
          //TODO: Your logic on click of push notification directly
          this.storage.get('user_type').then((val) => {
            if (val == 'chef') {
              this.nav.push(ChefBookingListPage);
            } else {
              this.nav.push(BookingPage);
            }
          });
        }
      } else {
        let confirmAlert = this.altCltr.create({
          title: data.title,
          message: data.message,
          buttons: [{
            text: 'Ignore',
            role: 'cancel'
          }, {
            text: 'Refresh',
            handler: () => {
              pushObject.clearAllNotifications();
              //TODO: Your logic here
              this.storage.get('user_type').then((val) => {
                if (val == 'chef') {
                  this.events.publish('updateChefBooking')
                } else {
                  this.events.publish('updateBooking')
                }
              });
            }
          }]
        });
        confirmAlert.present();
      }
    }

    if (custom_data.type == 'reminder') {
      if (data.additionalData.foreground) {
        // if application open, show popup
        let confirmAlert = this.altCltr.create({
          title: data.title,
          message: data.message,
          buttons: [{
            text: 'OK'
          }]
        });
        confirmAlert.present();
      }
    }
  }

  openPage(page) {
    // close the menu when clicking a link from the menu
    this.menu.close();
    // navigate to the new page if it is not the current page
    this.nav.setRoot(page.component);
  }
  checfLoginMenu() {
    setTimeout(() => {
      this.pages = [
        {
          title: this.menuTranslation.dashbord.title, component: StartPage, ismulti: true, nestedObject: [
            { title: this.menuTranslation.dashbord.startpage, component: StartPage, icon: "img/start2.png" },
            { title: this.menuTranslation.dashbord.yper_sharing, component: ReferalPage, icon: "img/referal-white.png" },
            { title: this.menuTranslation.dashbord.my_ref, component: ReferChefPage, icon: "img/user-group-white.png" },
            { title: this.menuTranslation.dashbord.yper_mem_up, component: MemberUpgradePage, icon: "img/arrow-round-up-circle-white.png" },
            { title: this.menuTranslation.dashbord.support, component: SupportPage, icon: "img/support-white.png" }
          ], icon: "img/dashboard.png"
        },
        {
          title: this.menuTranslation.my_earning.title, component: MyEarningDashboardPage, ismulti: true, nestedObject: [
            { title: this.menuTranslation.my_earning.q_pay, component: QuickPayPage, icon: "img/quick-pay-white.png" },
            { title: this.menuTranslation.my_earning.second_pay, component: WeekPayPage, icon: "img/hand-white.png" },
            { title: this.menuTranslation.my_earning.common_tip, component: CommonTipsPage, icon: "img/alert-white.png" },
            { title: this.menuTranslation.my_earning.total_income, component: ChefMyEarningPage, icon: "img/total-earning-white.png" },
          ], icon: "img/earning.png"
        },
        { title: this.menuTranslation.my_booking, component: ChefBookingListPage, ismulti: false, nestedObject: {}, icon: "img/calendar.png" },
        { title: this.menuTranslation.b_concepet, component: BusinessConceptPage, ismulti: false, nestedObject: {}, icon: "img/user-3.png" },
        { title: "Chat List", component: ChefChatListPage, ismulti: false, nestedObject: {}, icon: "img/user-3.png" },
        { title: this.menuTranslation.setting, component: SettingsPage, ismulti: false, nestedObject: {}, icon: "img/settings-white.png" },
      ];
    }, 200);
  }
  userLoginMenu() {
    setTimeout(() => {
      this.pages = [
        { title: 'À la Minute', component: AlaMinuteMapPage, ismulti: false, nestedObject: [], icon: "img/fastforward.svg" },
        { title: this.menuTranslation.book_chef, component: OurChefsPage, ismulti: false, nestedObject: [], icon: "img/cap-white2.png" },
        { title: this.menuTranslation.my_booking, component: BookingPage, ismulti: false, nestedObject: {}, icon: "img/calendar.png" },
        { title: this.menuTranslation.setting, component: SettingsPage, ismulti: false, nestedObject: {}, icon: "img/settings-white.png" }
      ];
    },200);
  }
  toggleLevel1(idx) {
    if (this.isLevel1Shown(idx)) {
      this.showLevel1 = null;
    } else {
      this.showLevel1 = idx;
    }
  }
  isLevel1Shown(idx) {
    return this.showLevel1 === idx;
  }
  toggleLevel2(idx) {
    if (this.isLevel2Shown(idx)) {
      this.showLevel1 = null;
      this.showLevel2 = null;
    } else {
      this.showLevel1 = idx;
      this.showLevel2 = idx;
    }
  }
  isLevel2Shown(idx) {
    return this.showLevel2 === idx;
  }
  logOut() {
    this.service.logout(this.user['id']);
    this.menu.close();
    setTimeout(() => {
      this.storage.remove('user');
      this.storage.remove('user_type');
      this.storage.remove('isLogin');
      this.nav.setRoot(LoginPage);
    }, 200);
    setTimeout(() => {
      this.pages = [];
      this.isLoginUser = false;
    }, 1000);
  }
  changeMenu() {
    this.storage.get('user_type').then((val) => {
      if (val == 'chef') {
        this.nav.setRoot(StartPage);
        this.checfLoginMenu();
      } else {
        this.nav.setRoot(OurChefsPage);
        this.userLoginMenu();
      }
    });
  }
  editProfile() {
    this.menu.close();
    if (this.user['user_type'] === 'chef') {
      this.nav.push(EditProfilePage);
    } else {
      this.nav.push(UserEditProfilePage);
    }

  }
  profileManagement() {
    this.menu.close();
    if (this.user['user_type'] === 'chef') {
      this.nav.push(ProfileManagementPage);
    } else {
      this.nav.push(UserEditProfilePage);
    }
  }
  openMenu() {
    this.menuCtrl.open();
  }

  closeMenu() {
    this.menuCtrl.close();
  }
}
