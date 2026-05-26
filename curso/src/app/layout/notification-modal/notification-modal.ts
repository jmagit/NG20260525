import { Component } from '@angular/core';
import { NotificationService } from '../../common-services';

@Component({
  selector: 'app-notification-modal',
  imports: [],
  templateUrl: './notification-modal.html',
  styleUrl: './notification-modal.css',
})
export class NotificationModal {
  constructor(private vm: NotificationService) { }

  public get VM() { return this.vm; }
}
