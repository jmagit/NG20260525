import { HttpContext } from '@angular/common/http';
import { Component, effect, Injectable, input, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ErrorMessagePipe, NotblankValidator, TypeValidator, UppercaseValidator } from '@my/library';
import { NotificationService } from 'src/app/common-services';
import { RESTDAOService } from 'src/app/core';
import { AUTH_REQUIRED } from 'src/app/security';

type Modo = 'add' | 'edit'

interface Persona {
  id?: number;
  nombre: string;
  apellidos?: string;
  edad?: number;
  telefono?: string;
  correo?: string;
}

@Injectable({providedIn: 'root'})
export class PersonasDAOService extends RESTDAOService<Persona, number> {
  constructor() {
    super('personas', { context: new HttpContext().set(AUTH_REQUIRED, true) })
  }
}
@Injectable({providedIn: 'root'})
export class PersonasViewModel {
  Modo = signal<Modo>('add')
  Elemento = signal<Persona>({id: 0, nombre: ''})

  constructor(private notify: NotificationService, private dao: PersonasDAOService) { }

  add() {
    this.Elemento.set({id: 0, nombre: ''})
    this.Modo.set('add')
  }

  edit(key: number) {
    this.dao.get(key).subscribe({
      next: datos => {
        this.Elemento.set(datos)
        this.Modo.set('edit')
      },
      error: err => this.notify.add(err.status)
    })
    // this.Elemento.set({id: key, nombre: 'Pepito', apellidos: 'Grillo', edad: 99, telefono: '555 123 456', correo: 'pgrillo@example.com'})
    // this.Modo.set('edit')
  }

  cancel() {
    // this.Elemento.set({id: 0, nombre: ''})
  }

  send() {
    switch(this.Modo()) {
      case 'add':
        this.dao.add(this.Elemento()).subscribe({
          next: () => this.cancel(),
          error: err => this.notify.add(err.status)
        })
        // this.notify.add('POST: ' + JSON.stringify(this.Elemento()), NotificationType.info)
        // this.cancel()
        break;
      case 'edit':
        this.dao.change(this.Elemento().id ?? 0, this.Elemento()).subscribe({
          next: () => this.cancel(),
          error: err => this.notify.add(err.status)
        })
        // this.notify.add('PUT: ' + JSON.stringify(this.Elemento()), NotificationType.warn)
        // this.cancel()
        break;
    }
  }

}
@Component({
  selector: 'app-formularios',
  imports: [ FormsModule, ErrorMessagePipe, NotblankValidator, UppercaseValidator, TypeValidator],
  templateUrl: './formularios.html',
  styleUrl: './formularios.css',
})
export class Formularios {
  readonly id = input<number>()
  constructor(public vm: PersonasViewModel) {
    effect(() => {
      if(this.id() !== undefined) {
        vm.edit(+(this.id()??0))
      }
    })
  }
}
