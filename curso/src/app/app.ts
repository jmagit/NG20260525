import { Component, } from '@angular/core';
import { RouterOutlet } from '@angular/router';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Footer, Header, Notification, NotificationModal, AjaxWait } from './layout';
import { NavigationService } from './common-services';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Footer, /*Notification,*/ NotificationModal, AjaxWait],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor(_navigation: NavigationService) {

  }
}
