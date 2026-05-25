import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { generaMenu, Option, } from '../../app.routes';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header {
  menu = signal<Option[]>([])

  constructor() {
    this.actualizaMenu()
  }

  actualizaMenu() {
    this.menu.set(generaMenu())
  }
}
