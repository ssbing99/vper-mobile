import { Component, ElementRef, ViewChild, NgZone } from '@angular/core';
import { IonicPage, NavController, Events,Content, ToastController  } from 'ionic-angular';
import { ServiceProvider } from '../../providers/service/service';
import { ChefPage } from '../chef/chef';
import { Geolocation } from '@ionic-native/geolocation';
import { LoadingController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
declare var google;
/**
 * Generated class for the AlaMinuteMapPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-ala-minute-map',
  templateUrl: 'ala-minute-map.html',
})

export class AlaMinuteMapPage {
  public markers: any;
  @ViewChild('map') mapElement: ElementRef;
  @ViewChild(Content) content: Content;
  //private map:GoogleMap;
  private map: any;
  public checfData: any;
  public showPopup: boolean = false;
  public userDetail: any = {};
  public lat: any;
  public long: any;
  public isStored: boolean = false;
  public loading:any;
  public searchInput:string='';
  public GoogleAutocomplete: any;
  public autocomplete: any;
  public autocompleteItems: any;
  geocoder: any;
  GooglePlaces: any;
  public data: any;
  public searchedLat:any;
  public searchedLang:any;
  public myLat:any;
  public myLang:any;
  constructor(
    public navCtrl: NavController,
    public events: Events,
    public service: ServiceProvider,
    private geolocation: Geolocation,
    private loadingCtrl: LoadingController,
    public storage: Storage,
    public zone: NgZone,
    public toast:ToastController
  ) {
    
    this.geocoder = new google.maps.Geocoder;
    let elem = document.createElement("div")
    this.GooglePlaces = new google.maps.places.PlacesService(elem);
    this.GoogleAutocomplete = new google.maps.places.AutocompleteService();
    this.autocomplete = { input: '' };
    this.autocompleteItems = [];
    this.markers = [];
    this.loading = this.loadingCtrl.create({
      content: "Please wait while loading map.."
    });
    this.loading.present();
    this.storage.get('user_location_data').then((data)=>{
      this.loading.dismiss();
      if(data!==null){
        data = JSON.parse(data);
        this.isStored=false;
        this.lat = data['lat'];
        this.long=data['long'];
        this.service.getChecfs({
          "page": "1",
          "latitude": this.lat,
          "longitude": this.long,
        });
       
    } else {
      this.events.publish("mapError",true);
    }
    },
    (error)=>{
      this.loading.dismiss();
        this.lat = "28.705754";
        this.long="77.111335";
        this.service.getChecfs({
          "page": "1",
          "latitude": this.lat,
          "longitude": this.long,
        });
      this.isStored=true;
    }
  );

    if(this.isStored){
        
    }
  }
  ngOnInit() {
    this.callAllSubscribe(this.events);
  }
  callAllSubscribe(events) {
    events.subscribe('getChef', object => {
      if (object != null) {
        this.checfData = object['data'];
        this.loadMap();
      }
    });
    events.subscribe('click', object => {
      
      if (object != null) {
        this.content.resize();
        console.log(object);
        this.userDetail = object;
        this.showPopup = true;
      }
    });
    events.subscribe('mapError', object => {
      if (object != null) {
        this.geolocation.getCurrentPosition().then((resp) => {
          this.lat = resp.coords.latitude
          this.long = resp.coords.longitude
          var locationObj = {
            "lat": this.lat,
            "long": this.long
          }
          this.service.setStorage("user_location_data", locationObj);
          this.service.getChecfs({
            "page": "1",
            "latitude": this.lat,
            "longitude": this.long,
          });
          this.loading.dismiss();
        }).catch((error) => {
          this.loading.dismiss();
          this.service.openAlert("Alert!!!", "we are not able to fetch your location");
        });
      }
    });
  }
  ionViewDidLoad() {
    if (this.checfData !== undefined) {
      this.loadMap();
    }
  }

  loadMap() {
    var lat=(this.searchedLat!==undefined)?this.searchedLat:this.checfData[0]['latitude'];
    var long=(this.searchedLang!==undefined)?this.searchedLang:this.checfData[0]['longitude'];
    let latLng = new google.maps.LatLng(lat, long);
    let mapOptions = {
      center: latLng,
      zoom: 12,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    }
    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
    var marker, i;
    var objdata = this.checfData;
    for (i = 0; i < this.checfData.length; i++) {
      marker = new google.maps.Marker({
        position: new google.maps.LatLng(this.checfData[i]['latitude'], this.checfData[i]['longitude']),
        map: this.map,
        label: this.checfData[i]['fname'] + " " + this.checfData[i]['lname'],
        icon: { url: 'img/logo-brown.png' }
      });
      var thisObj = this;
      google.maps.event.addListener(marker, 'click', (function (marker, i) {
        return function () {
          thisObj.openPopupMarker(objdata[i]);
        }
      })(marker, i));
    }
    if(this.myLat!==undefined){
      marker = new google.maps.Marker({
        position: new google.maps.LatLng(this.myLat, this.myLang),
        map: this.map,
        label: "",
        icon: { url: 'img/location-icon.png' }
      });
    }
    
  }
  openPopupMarker(data) {
   // this.events.publish("click", data);
   //this.service.openAlert('Alert','Hi');
   let toast =this.toast.create({
    message: 'Map Loaded sucessfully!!',
    duration: 1,
    position: 'top'
  });
  toast.present();
    if (data != null) {
      setTimeout(()=>{      
        this.content.resize();
        console.log(data);
        this.userDetail = data;
        this.showPopup = true;
    },20);
    }
  }
  openChefProfile(ChefId: number) {
    if (ChefId) {
      this.navCtrl.push(ChefPage, { "chef_id": ChefId,type:'ala' });
    } else {
      this.service.openAlert('Alert!!!', "Invalid chef Selection please try with valid chef!");
    }
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
    this.autocomplete.input=this.data['description'];
    this.geocoder.geocode({ 'address': this.data['description'] }, function (results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        var latitude = results[0].geometry.location.lat();
        var longitude = results[0].geometry.location.lng();
        objdata.searchedLang=longitude;
        objdata.searchedLat=latitude;
        objdata.service.getChecfs({
          "page": "1",
          "latitude": latitude,
          "longitude": longitude,
        });
      }
    });
  }
  onCancel(event){
    this.autocompleteItems=[];
  }
  getlocation(){
    this.showPopup=false;
    let options = {
      timeout:10000,
      enableHighAccuracy:true
    };
    this.loading = this.loadingCtrl.create({
      content: "Please wait while loading map.."
    });
    this.loading.present();
    this.geolocation.getCurrentPosition(options).then((resp) => {
      this.lat = resp.coords.latitude;
      this.long = resp.coords.longitude;
      this.myLat = resp.coords.latitude;
      this.myLang = resp.coords.longitude;
      this.searchedLang=this.long;
      this.searchedLat=this.lat;
      this.service.getChecfs({
        "page": "1",
        "latitude": this.lat,
        "longitude": this.long,
      });
      this.loading.dismiss();
    },
    error=>{
      if(error.code == 1){
        this.service.openAlert("Alert!!","Please allow your location for get Accurate location");
      }
      this.loading.dismiss();
      this.service.getChecfs({
        "page": "1",
        "latitude": this.lat,
        "longitude": this.long,
      });
    });
  }
}
