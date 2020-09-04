import { Component } from '@angular/core';
import { IonicPage, NavController, Events } from 'ionic-angular';
import { ServiceProvider } from '../../providers/service/service';
import { Storage } from '@ionic/storage';

/**
 * Generated class for the ViewReviewsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-view-reviews',
  templateUrl: 'view-reviews.html',
})
export class ViewReviewsPage {
  public user:any=[];
  public arrReview=[];
  public page:number=0;
  public reviewLength:number=1;
  constructor(
    public navCtrl: NavController,
    public service: ServiceProvider,
    public storage:Storage,
    public events:Events
    ) {
      this.storage.get('user').then((data)=>{
        this.user=data;
      });
  }
  ionViewDidLoad() {
    setTimeout(()=>{
      var params={
        page:this.page,
        chef_id:this.user['id']
      }
      this.service.getReview(params);
    },100);
  }
  ngOnInit() {
    this.callAllSubscribe(this.events);
  }
  callAllSubscribe(events) {
    events.subscribe('chef_review_data', object => {
      if(object!==null){
        this.arrReview=object.data['review'];
       this.reviewLength=object.data['review'].length;
      }
    });
    
  }
}
