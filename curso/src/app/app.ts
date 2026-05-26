import { Component, } from '@angular/core';
import { RouterOutlet } from '@angular/router';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Footer, Header, Notification, NotificationModal } from './layout';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Footer, /*Notification,*/ NotificationModal, ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
}
