import { Component, NgZone } from '@angular/core';
import { IonicPage, NavController, Events, LoadingController } from 'ionic-angular';
import { ChefPage } from '../chef/chef';
import { ServiceProvider } from '../../providers/service/service';
import { Storage } from '@ionic/storage';
import { Geolocation } from '@ionic-native/geolocation';
import { ChefChatPage } from '../chef-chat/chef-chat';
declare var google;
/**
 * Generated class for the OurChefsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-our-chefs',
  templateUrl: 'our-chefs.html',
})
export class OurChefsPage {
  public checfData: any;
  public showPopup: boolean = false;
  public userDetail: any = {};
  public lat: any;
  public long: any;
  public isStored: boolean = false;
  public loading: any;
  public searchInput: string = '';
  public GoogleAutocomplete: any;
  public autocomplete: any;
  public autocompleteItems: any;
  geocoder: any;
  GooglePlaces: any;
  public data: any;
  constructor(
    public navCtrl: NavController,
    public events: Events,
    public service: ServiceProvider,
    private geolocation: Geolocation,
    private loadingCtrl: LoadingController,
    public storage: Storage,
    public zone: NgZone
  ) {
    this.autocomplete = { input: '' };
    this.autocompleteItems = [];
    this.GoogleAutocomplete = new google.maps.places.AutocompleteService();
    this.geocoder = new google.maps.Geocoder;
    this.geolocation.getCurrentPosition().then((resp) => {
      // resp.coords.latitude
      // resp.coords.longitude
      this.service.getChecfs({
        "page": "1",
        "latitude": resp.coords.latitude,
        "longitude":resp.coords.longitude,
        "callType":"chef"
      });
     }).catch((error) => {
      this.service.getChecfs({
        "page": "1",
        "latitude": "28.749472",
        "longitude": "77.056533",
        "callType":"chef"
      });
     });
  }

  openShefPage(ChefId: any) {
    if (ChefId) {
      this.navCtrl.push(ChefPage, { "chef_id": ChefId, type:'normal' });
    } else {
      this.service.openAlert('Alert!!!', "Invalid chef Selection please try with valid chef!");
    }

  }
  ngOnInit() {
    this.callAllSubscribe(this.events);
  }
  callAllSubscribe(events) {
    events.subscribe('getChef', object => {
      if(this.loading!==undefined){
        this.loading.dismiss();
      }
      if (object != null) {
        this.checfData = object['data'];
      }
    });
  }
  updateSearchResults() {
    if (this.autocomplete.input == '') {
      this.autocompleteItems = [];
      return;
    }
    this.GoogleAutocomplete.getPlacePredictions({ input: this.autocomplete.input },
      (predictions, status) => {
        this.autocompleteItems = [];
        this.zone.run(() => {
          predictions.forEach((prediction) => {
            this.autocompleteItems.push(prediction);
          });
        });
      });
  }
  selectSearchResult(item) {
    this.data = item;
    var objdata = this;
    this.autocompleteItems = [];
    this.loading = this.loadingCtrl.create({
      content: "Please wait while getting data.."
    });
    this.loading.present();
    this.autocomplete.input=this.data['description'];
    this.geocoder.geocode({ 'address': this.data['description'] }, function (results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        var latitude = results[0].geometry.location.lat();
        var longitude = results[0].geometry.location.lng();
          objdata.service.getChecfs({
            "page": "1",
            "latitude": latitude,
            "longitude": longitude,
          });
      } else {
        this.loading.dismiss();
      }
    });
  }
  onCancel(event) {
    this.autocompleteItems = [];
  }
}
