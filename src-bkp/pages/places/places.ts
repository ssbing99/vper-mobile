import { Component, NgZone } from '@angular/core';
import { IonicPage, NavController, Events, ViewController } from 'ionic-angular';
import { ServiceProvider } from '../../providers/service/service';
declare var google;

/**
 * Generated class for the PlacesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-places',
  templateUrl: 'places.html',
})
export class PlacesPage {

  public GoogleAutocomplete: any;
  public autocomplete: any;
  public autocompleteItems: any;
  geocoder: any;
  GooglePlaces: any;
  public data: any;

  constructor(
    public zone: NgZone,
    public navCtrl: NavController,
    public service: ServiceProvider,
    public events: Events,
    public viewCtrl: ViewController
  ) {
    this.geocoder = new google.maps.Geocoder;
    let elem = document.createElement("div")
    this.GooglePlaces = new google.maps.places.PlacesService(elem);
    this.GoogleAutocomplete = new google.maps.places.AutocompleteService();
    this.autocomplete = { input: '' };
    this.autocompleteItems = [];

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
      },
      (error)=>{
        this.service.openAlert("Alert!!", "Something wrong please try after sometime");
      }
    );
  }
  selectSearchResult(item) {
    this.data = item;
    var objdata = this;;
    this.geocoder.geocode({ 'address': this.data['description'] }, function (results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        var latitude = results[0].geometry.location.lat();
        var longitude = results[0].geometry.location.lng();
        objdata.data['lat'] = latitude;
        objdata.data['long'] = longitude;
        objdata.dismiss();
      }

    });
  }
  dismiss() {
    let data = { 'data': this.data };
    this.viewCtrl.dismiss(data);
  }
}
