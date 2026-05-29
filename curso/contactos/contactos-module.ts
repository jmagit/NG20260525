import { Routes } from '@angular/router';
import { ContactosList, ContactosAdd, ContactosEdit, ContactosView } from './componentes';

export const routes: Routes = [
  { path: '', component: ContactosList },
  { path: 'add', component: ContactosAdd },
  { path: ':id/edit', component: ContactosEdit },
  { path: ':id', component: ContactosView },
  { path: ':id/:kk', component: ContactosView },
]
