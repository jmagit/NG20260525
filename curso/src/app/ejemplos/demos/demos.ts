import { Component, inject } from '@angular/core';
import { LoggerService } from '@my/library';

@Component({
  selector: 'app-demos',
  imports: [],
  templateUrl: './demos.html',
  styleUrl: './demos.css',
  // providers: [LoggerService]
})
export class Demos {
  private log = inject(LoggerService)

  constructor() {
    this.log.error('esto es un error')
    this.log.warn('esto es un warn')
    this.log.info('esto es un info')
    this.log.log('esto es un log')
  }
}
