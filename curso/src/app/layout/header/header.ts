import { Component, effect, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { generaMenu, Option, } from '../../app.routes';
import { AuthService, Login } from "src/app/security";

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive, Login],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header {
  menu = signal<Option[]>([])

  constructor(private auth: AuthService) {
    this.actualizaMenu()
    effect(() => {
      auth.isAuthenticated()
      this.actualizaMenu()
    })
  }

  actualizaMenu() {
    this.menu.set(generaMenu(this.auth))
  }
}
