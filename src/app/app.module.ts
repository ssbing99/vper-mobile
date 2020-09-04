import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { IonicStorageModule } from '@ionic/storage';
import { File } from '@ionic-native/file';
import { Camera } from '@ionic-native/camera';
import { Base64 } from '@ionic-native/base64';
import { Clipboard } from '@ionic-native/clipboard';

import { ServiceProvider } from '../providers/service/service';
import { Device } from '@ionic-native/device';
import { Push } from '@ionic-native/push';
import { Stripe } from '@ionic-native/stripe';
import { SocialSharing } from '@ionic-native/social-sharing';
import { GooglePlus } from '@ionic-native/google-plus';
import { Facebook } from '@ionic-native/facebook';

import { config } from './app.firebaseconfig';
// import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireModule } from 'angularfire2';
/* page list start|| Manish Tiwari */
import { SingupPage } from '../pages/singup/singup';
import { HelloIonicPage } from '../pages/hello-ionic/hello-ionic';
import { ItemDetailsPage } from '../pages/item-details/item-details';
import { ListPage } from '../pages/list/list';
import { LoginPage } from '../pages/login/login';
import { SettingsPage } from '../pages/settings/settings';
import { BookingPage } from '../pages/booking/booking';
import { WelcomePage } from '../pages/welcome/welcome';
import { MemberUpgradePage } from '../pages/member-upgrade/member-upgrade';
import { MemberUpgradedPage } from '../pages/member-upgraded/member-upgraded';
import { ReferalPage } from '../pages/referal/referal';
import { SupportPage } from '../pages/support/support';
import { BusinessConceptPage } from '../pages/business-concept/business-concept';
import { ChefAccountPage } from '../pages/chef-account/chef-account';
import { MediaRequestPage } from '../pages/media-request/media-request';
import { QuickPayPage } from '../pages/quick-pay/quick-pay';
import { WeekPayPage } from '../pages/week-pay/week-pay';
import { CommonTipsPage } from '../pages/common-tips/common-tips';
import { ReferChefPage } from '../pages/refer-chef/refer-chef';
import { AddDishesPage } from '../pages/add-dishes/add-dishes';
import { AlaMinutePage } from '../pages/ala-minute/ala-minute';
import { ChatPage } from '../pages/chat/chat';
import { ProfileManagementPage } from '../pages/profile-management/profile-management';
import { Dashboard1Page } from '../pages/dashboard1/dashboard1';
import { MyEarningDashboardPage } from '../pages/my-earning-dashboard/my-earning-dashboard';
import { StartPage } from '../pages/start/start';
import { EditProfilePage } from '../pages/edit-profile/edit-profile';
import { ChefPage } from '../pages/chef/chef';
import { ChefMyEarningPage } from '../pages/chef-my-earning/chef-my-earning';
import { ViewReviewsPage } from '../pages/view-reviews/view-reviews';
import { EditDishPage } from '../pages/edit-dish/edit-dish';
import { PlacesPage } from '../pages/places/places';
import { UserSingupPage } from '../pages/user-singup/user-singup';
import { OurChefsPage } from '../pages/our-chefs/our-chefs';
import { UserEditProfilePage } from '../pages/user-edit-profile/user-edit-profile';
import { AlaMinuteMapPage } from '../pages/ala-minute-map/ala-minute-map';
import { WelcomeConceptPage } from '../pages/welcome-concept/welcome-concept';
import { ChefChatListPage } from '../pages/chef-chat-list/chef-chat-list';
import { ChefChatPage } from '../pages/chef-chat/chef-chat';
import { HireChefPage } from '../pages/hire-chef/hire-chef';
import { ChefBookingListPage } from '../pages/chef-booking-list/chef-booking-list';
import { BookingDetailChefPage } from '../pages/booking-detail-chef/booking-detail-chef';
import { PrivacyPolicyPage } from '../pages/privacy-policy/privacy-policy';
import { TermsPage } from '../pages/terms/terms';
import { Geolocation } from '@ionic-native/geolocation';
import { ForgetPasswordPage } from '../pages/forget-password/forget-password';
import { ChangePasswordPage } from '../pages/change-password/change-password';
export function setTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

/* Pipe Import */
import { SortPipe } from '../pipes/sort/sort';
import { UserTermsPage } from '../pages/user-terms/user-terms';
import { UserPrivacyPolicyPage } from '../pages/user-privacy-policy/user-privacy-policy';
import { OrderByPipe } from '../pipes/order-by/order-by';
import { ChatProvider } from '../providers/chat/chat';


import * as firebase from 'firebase';
import { FCM } from '@ionic-native/fcm';
import { PastChatPage } from '../pages/past-chat/past-chat';
import { BookingDetailUserPage } from '../pages/booking-detail-user/booking-detail-user';
import { StripeElementComponent } from '../components/stripe-element/stripe-element.component';
firebase.initializeApp(config);
@NgModule({
  declarations: [
    MyApp,
    HelloIonicPage,
    ItemDetailsPage,
    ListPage,
    LoginPage,
    SingupPage,
    SettingsPage,
    BookingPage,
    WelcomePage,
    MemberUpgradePage,
    MemberUpgradedPage,
    ReferalPage,
    SupportPage,
    BusinessConceptPage,
    ChefAccountPage,
    MediaRequestPage,
    QuickPayPage,
    WeekPayPage,
    CommonTipsPage,
    ReferChefPage,
    AddDishesPage,
    AlaMinutePage,
    ChatPage,
    ProfileManagementPage,
    Dashboard1Page,
    MyEarningDashboardPage,
    StartPage,
    EditProfilePage,
    ChefPage,
    ChefMyEarningPage,
    ViewReviewsPage,
    EditDishPage,
    PlacesPage,
    UserSingupPage,
    OurChefsPage,
    UserEditProfilePage,
    AlaMinuteMapPage,
    WelcomeConceptPage,
    ChefChatListPage,
    ChefChatPage,
    //SortPipe,
    HireChefPage,
    ChefBookingListPage,
    BookingDetailChefPage,
    PrivacyPolicyPage,
    TermsPage,
    ForgetPasswordPage,
    ChangePasswordPage,
    UserTermsPage,
    UserPrivacyPolicyPage,
    OrderByPipe,
    PastChatPage,
    BookingDetailUserPage,
    StripeElementComponent
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (setTranslateLoader),
        deps: [HttpClient]
      }
    }),
    IonicStorageModule.forRoot(),
    AngularFireModule.initializeApp(config)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HelloIonicPage,
    ItemDetailsPage,
    ListPage,
    LoginPage,
    SingupPage,
    SettingsPage,
    BookingPage,
    WelcomePage,
    MemberUpgradePage,
    MemberUpgradedPage,
    ReferalPage,
    SupportPage,
    BusinessConceptPage,
    ChefAccountPage,
    MediaRequestPage,
    QuickPayPage,
    WeekPayPage,
    CommonTipsPage,
    ReferChefPage,
    AddDishesPage,
    AlaMinutePage,
    ChatPage,
    ProfileManagementPage,
    Dashboard1Page,
    MyEarningDashboardPage,
    StartPage,
    EditProfilePage,
    ChefPage,
    ChefMyEarningPage,
    ViewReviewsPage,
    EditDishPage,
    PlacesPage,
    UserSingupPage,
    OurChefsPage,
    UserEditProfilePage,
    AlaMinuteMapPage,
    WelcomeConceptPage,
    ChefChatListPage,
    ChefChatPage,
    HireChefPage,
    ChefBookingListPage,
    BookingDetailChefPage,
    PrivacyPolicyPage,
    TermsPage,
    ForgetPasswordPage,
    ChangePasswordPage,
    UserTermsPage,
    UserPrivacyPolicyPage,
    PastChatPage,
    BookingDetailUserPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    ServiceProvider,
    File,
    Camera,
    Base64,
    Geolocation,
    Device,
    Clipboard,
    Push,
    Stripe,
    SocialSharing,
    GooglePlus,
    Facebook,
    ChatProvider,
    FCM
  ]
})
export class AppModule { }
