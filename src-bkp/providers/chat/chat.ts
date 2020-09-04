import { Injectable } from '@angular/core';
import firebase from 'firebase';
import { Events } from 'ionic-angular';
import { ServiceProvider } from '../service/service';

/*
  Generated class for the ChatProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class ChatProvider {
  firebuddychats = firebase.database().ref('/buddychats');
  buddy: any;
  buddymessages = [];
  constructor(
    public events: Events,
    public service:ServiceProvider
  ) {
    
  }

  initializebuddy(buddy) {
    this.buddy = buddy;
  }

  addnewmessage(msg,userId,sendTo) {
      var promise = new Promise((resolve, reject) => {
        this.firebuddychats.child(userId).child(sendTo).push({
          sentby: userId,
          message: msg,
          timestamp: firebase.database.ServerValue.TIMESTAMP
        }).then(() => {
          this.firebuddychats.child(sendTo).child(userId).push({
            sentby: userId,
            message: msg,
            timestamp: firebase.database.ServerValue.TIMESTAMP
          }).then(() => {
            let params = {
              "user_id_to":sendTo,
              "message":msg,
              "user_id_from":userId
            }
            this.send_pushNotification(params);
            resolve(true);
          })
        })
      })
      return promise;
  }

  getbuddymessages(userId,FromId) {
    
    let temp;
    this.firebuddychats.child(userId).child(FromId).on('value', (snapshot) => {
      this.buddymessages = [];
      temp = snapshot.val();
      for (var tempkey in temp) {
        this.buddymessages.push(temp[tempkey]);
      }
      this.events.publish('chatData');
    })
  }
  send_pushNotification(data){
    this.service.sendPush(data);
  }
  getChefdata(userId,FromId) {
    
    let temp;
    this.firebuddychats.child(userId).child(FromId).on('value', (snapshot) => {
      this.buddymessages = [];
      temp = snapshot.val();
      for (var tempkey in temp) {
        this.buddymessages.push(temp[tempkey]);
      }
      this.events.publish('chefchatData');
    })
  }
}
