import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { generaMenu, Option, } from '../../app.routes';
import { Login } from "src/app/security";

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive, Login],
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
