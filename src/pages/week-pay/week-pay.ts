import { Component } from '@angular/core';
import { IonicPage, NavController, Events } from 'ionic-angular';
import { ServiceProvider } from '../../providers/service/service';
/**
 * Generated class for the WeekPayPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-week-pay',
  templateUrl: 'week-pay.html',
})
export class WeekPayPage {
  public weekPay:any=[];
  public dataDisplay: any[] = [];
  constructor(
    public navCtrl: NavController,
    public service:ServiceProvider,
    public events:Events
  ) {
    this.service.getChefWalletTwoWeek();
  }

  ionViewDidLoad() {

  }
  ngOnInit() {
    this.callAllSubscribe(this.events);
  }
  callAllSubscribe(events) {
    events.subscribe('chef_wallet_two_week', object => {
      if (object != null) {
        this.weekPay = object['data'];

        object.data.forEach(data => {
          // Insert new date range period into empty array
          if (this.dataDisplay.length === 0) {
            this.insertNewDatePeriod(data);
          } else {
            let found = false;

            // Push new date in same date range period
            this.dataDisplay.forEach(display => {
              if (data.startDate + ' - ' + data.endDate === display.datePeriod) {
                found = true;

                display.total += Number(data.total);
                display.breakdown.push({
                  date: data.cp_date,
                  earning: Number(data.total)
                });
              } 
            });

            // Insert new date range period
            if (!found) {
              this.insertNewDatePeriod(data);
            }
          }
        });
      }
    });
  }

  showBreakdown(data) {
    if (data.showBreakdown) {
      data.showBreakdown = false;
    } else {
      this.dataDisplay.map(display => display.showBreakdown = false);
      data.showBreakdown = true;
    }
  }

  private insertNewDatePeriod(data: any) {
    let breakdown = [];
    breakdown.push({
      date: data.cp_date,
      earning: Number(data.total),
      showBreakdown: false
    });
    this.dataDisplay.push({
      datePeriod: data.startDate + ' - ' + data.endDate,
      total: Number(data.total),
      breakdown
    });
  }
}
