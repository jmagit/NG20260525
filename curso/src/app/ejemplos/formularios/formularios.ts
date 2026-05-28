import { Component, Injectable, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ErrorMessagePipe, NIFNIEValidator, NotblankValidator, TypeValidator, UppercaseValidator } from '@my/library';
import { NotificationService, NotificationType } from 'src/app/common-services';

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
export class PersonasViewModel {
  Modo = signal<Modo>('add')
  Elemento = signal<Persona>({id: 0, nombre: ''})

  constructor(private notify: NotificationService) { }

  add() {
    this.Elemento.set({id: 0, nombre: ''})
    this.Modo.set('add')
  }

  edit(key: number) {
    this.Elemento.set({id: key, nombre: 'Pepito', apellidos: 'Grillo', edad: 99, telefono: '555 123 456', correo: 'pgrillo@example.com'})
    this.Modo.set('edit')
  }

  cancel() {
    // this.Elemento.set({id: 0, nombre: ''})
  }

  send() {
    switch(this.Modo()) {
      case 'add':
        this.notify.add('POST: ' + JSON.stringify(this.Elemento()), NotificationType.info)
        this.cancel()
        break;
      case 'edit':
        this.notify.add('PUT: ' + JSON.stringify(this.Elemento()), NotificationType.warn)
        this.cancel()
        break;
    }
  }

}
@Component({
  selector: 'app-formularios',
  imports: [ FormsModule, ErrorMessagePipe, NIFNIEValidator, NotblankValidator, UppercaseValidator, TypeValidator],
  templateUrl: './formularios.html',
  styleUrl: './formularios.css',
})
export class Formularios {
  constructor(public vm: PersonasViewModel) {}
}
