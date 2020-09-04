import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Events } from 'ionic-angular';
@Component({
  selector: 'page-hello-ionic',
  templateUrl: 'hello-ionic.html'
})
export class HelloIonicPage {
  public translation = {};
  public check = '';
  constructor(translate: TranslateService, public events: Events) {
    translate.setDefaultLang('en');
    translate.get('helloionic').subscribe(
      value => {
        this.events.publish('translator', value);
      }
    )
  }
  ngOnInit() {
    this.check = 'fsdfsd';
    this.callAllSubscribe(this.events);
  }
  callAllSubscribe(events) {
    events.subscribe('translator', object => {
      this.translation = object;
    });
  }
}
