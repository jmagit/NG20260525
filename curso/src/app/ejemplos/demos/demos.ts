// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Component, computed, effect, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CapitalizePipe, ElipsisPipe, LoggerService, Sizer } from '@my/library';
import { Unsubscribable } from 'rxjs';
import { NavigationService, NotificationService, NotificationType } from 'src/app/common-services';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Notification } from "src/app/layout";
import { Card, FormButtons } from 'src/app/common-component';
import { Calculadora } from '../calculadora/calculadora';
import { Router, RouterLink } from "@angular/router";

@Component({
  selector: 'app-demos',
  imports: [/*Notification,*/ FormsModule, CommonModule,
    ElipsisPipe, CapitalizePipe, Sizer,
    Card, FormButtons, Calculadora, RouterLink],
  templateUrl: './demos.html',
  styleUrl: './demos.css',
  // providers: [LoggerService, NotificationService,]
})
export class Demos implements OnInit, OnDestroy {
  private suscriptor: Unsubscribable | undefined;
  private log = inject(LoggerService)
  private router = inject(Router)
  private navigation = inject(NavigationService)

  readonly nombre = signal<string>('mundo')
  readonly fontSize = signal<number>(24)
  readonly listado = signal([
    { id: 1, nombre: 'Madrid'},
    { id: 2, nombre: 'barcelona'},
    { id: 3, nombre: 'SEVILLA'},
    { id: 4, nombre: 'ciudad Real'},
  ])
  readonly total = computed(() => this.listado().length)
  readonly idProvincia = signal<number>(2)

  public fecha = new Date('2026-05-26')
  public get Fecha() : string { return this.fecha.toISOString().substring(0,10) }
  public set Fecha(valor : string) {
    const f = new Date(valor)
    if(f.toString() === "Invalid Date" || f === this.fecha) return
    this.fecha = f
  }

  readonly resultado = signal<string>('')
  readonly visible = signal<boolean>(true)
  readonly estetica = signal({importante: true, error: false, urgente: true})

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

  saluda() {
    this.resultado.set(`Hola ${this.nombre()}`)
    // this.router.navigateByUrl('/inicio')
    this.navigation.back()
  }

  despide() {
    this.resultado.set(`Adios ${this.nombre()}`)
  }

  di(algo: string) {
    this.resultado.set(`Dice ${algo}`)
  }

  cambia() {
    this.visible.update(value => !value)
    this.estetica.update(value => ({...value, importante: !value.importante, error: !value.error}))
  }

  calculo(a:number, b: number) { return a + b }

  add(provincia: string) {
    if(!provincia) return
    const id = this.listado()[this.listado().length - 1].id + 1
    this.listado.update(value => [...value, {id, nombre: provincia}])
    this.idProvincia.set(id)
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


  idiomas = signal([
    { codigo: 'en-US', region: 'USA' },
    { codigo: 'es', region: 'España' },
    { codigo: 'pt', region: 'Portugal' },
  ]).asReadonly();
  idioma = signal(this.idiomas()[0].codigo);
  calculos = signal<Calculo[]>([]);
  valCalculadora = signal(666);

  ponResultado(origen: string, valor: number) {
    this.calculos.update(value => [ ...value, {
      pos: this.calculos.length + 1,
      origen,
      valor: +valor
    }]);
  }
}
interface Calculo {
  pos: number
  origen: string
  valor: number
}
