import { Component, effect, inject, OnDestroy, OnInit } from '@angular/core';
import { LoggerService } from '@my/library';
import { Unsubscribable } from 'rxjs';
import { NotificationService, NotificationType } from 'src/app/common-services';
import { Notification } from "src/app/layout";

@Component({
  selector: 'app-demos',
  imports: [Notification],
  templateUrl: './demos.html',
  styleUrl: './demos.css',
  // providers: [LoggerService, NotificationService,]
})
export class Demos implements OnInit, OnDestroy {
  private suscriptor: Unsubscribable | undefined;
  private log = inject(LoggerService)

  constructor(public vm: NotificationService) {
    // this.log.error('esto es un error')
    // this.log.warn('esto es un warn')
    // this.log.info('esto es un info')
    // this.log.log('esto es un log')
    // effect(() => {
    //   if (this.vm.HayNotificaciones() && this.vm.Listado()[this.vm.Listado().length - 1].Type === NotificationType.error) {
    //     window.alert(`Efecto: ${this.vm.Listado()[this.vm.Listado().length - 1].Message}`);
    //     this.vm.remove(this.vm.Listado().length - 1);
    //   }
    // })
  }

  ngOnInit(): void {
    this.suscriptor = this.vm.Notificacion.subscribe(n => {
      if (n.Type !== NotificationType.error) { return; }
      // window.alert(`Suscripción: ${n.Message}`);
      // this.vm.remove(this.vm.Listado().length - 1);
    });
  }
  ngOnDestroy(): void {
    if (this.suscriptor) {
      this.suscriptor.unsubscribe();
    }
  }
}
