import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ChefChatPage } from './chef-chat';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  declarations: [
   // ChefChatPage,
  ],
  imports: [
   // IonicPageModule.forChild(ChefChatPage),
    PipesModule
  ],
})
export class ChefChatPageModule {}
