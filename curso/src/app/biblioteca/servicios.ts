/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpContext, HttpErrorResponse } from '@angular/common/http';
import { Injectable, signal, WritableSignal } from '@angular/core';
import { Router } from '@angular/router';
import { LoggerService } from 'src/lib/my-library';
import { NavigationService, NotificationService } from '../common-services';
import { RESTDAOService, ModoCRUD } from '../core';
import { Observable } from 'rxjs';
import { AUTH_REQUIRED, AuthService } from '../security';

// Versión interface
export interface LibroModel {
  [index: string]: any;
  idLibro?: string
  titulo?: string
  autor?: string
  pais?: string
  fecha?: string
  paginas?: string
  wiki?: string
}

// Constante para la inicialización (Signal Forms)
export const init_value: LibroModel = {
  idLibro: "0",
}

@Injectable({
  providedIn: 'root'
})
export class LibrosDAOService extends RESTDAOService<LibroModel, string> {
  constructor() {
    super('libros', { context: new HttpContext().set(AUTH_REQUIRED, true) });
  }

  override page(page: number, rows: number = 20): Observable<{ page: number, pages: number, rows: number, list: LibroModel[] }> {
    return new Observable(subscriber => {
      const url = `${this.baseUrl}?_page=${page}&_rows=${rows}&_sort=titulo`
      this.http.get<any>(url, this.option).subscribe({
        next: data => subscriber.next({ page: data.number, pages: data.totalPages, rows: data.totalElements, list: data.content }),
        error: err => subscriber.error(err)
      })
    })
  }
}

@Injectable({
  providedIn: 'root'
})
export class LibrosViewModelService {
  public readonly Modo: WritableSignal<ModoCRUD> = signal('list');
  public readonly Listado: WritableSignal<LibroModel[]> = signal([]);
  public readonly Elemento: WritableSignal<LibroModel> = signal({...init_value});
  protected idOriginal?: string;
  // protected listURL = '/libros';

  constructor(protected notify: NotificationService,
    protected out: LoggerService,
    protected dao: LibrosDAOService,
    public auth: AuthService,
    protected navigation: NavigationService,
    protected router: Router
  ) { }

  public list(): void {
    this.dao.query().subscribe({
      next: data => {
        this.Listado.set(data);
        this.Modo.set('list');
      },
      error: err => this.handleError(err)
    });
  }
  public add(): void {
    this.Elemento.set({...init_value});
    this.Modo.set('add');
  }
  public edit(key: any): void {
    this.dao.get(key).subscribe({
      next: data => {
        this.Elemento.set(data);
        this.idOriginal = key;
        this.Modo.set('edit');
      },
      error: err => this.handleError(err)
    });
  }
  public view(key: any): void {
    this.dao.get(key).subscribe({
      next: data => {
        this.Elemento.set(data);
        this.Modo.set('view');
      },
      error: err => this.handleError(err)
    });
  }
  public delete(key: any): void {
    if (!window.confirm('¿Seguro?')) { return; }

    this.dao.remove(key).subscribe({
      next: () => {
        // this.list()
        this.load()
      },
      error: err => this.handleError(err)
    });
  }

  clear() {
    this.Elemento.set({...init_value})
    this.idOriginal = undefined;
    this.Listado.set([]);
  }
  public cancel(): void {
    this.clear()
    // this.router.navigateByUrl(this.listURL);
    this.navigation.back()
  }
  public send(): void {
    switch (this.Modo()) {
      case 'add':
        this.dao.add(this.Elemento()).subscribe({
          next: () => this.cancel(),
          error: err => this.handleError(err)
        });
        break;
      case 'edit':
        if (!this.idOriginal) {
          this.out.error('Falta el identificador')
          return
        }
        this.dao.change(this.idOriginal, this.Elemento()).subscribe({
          next: () => this.cancel(),
          error: err => this.handleError(err)
        });
        break;
      case 'view':
        this.cancel();
        break;
    }
  }

  //#region Tratamiento de errores
  handleError(err: HttpErrorResponse) {
    let message: string
    switch (err.status) {
      case 0: message = err.message; break;
      case 404: message = `ERROR: ${err.status} ${err.statusText}`; break;
      default:
        message = err.error?.['detail'] ?? err.error?.['title'] ?? ''
        message = `ERROR: ${err.status} ${err.statusText}.${message ? ` Detalles: ${message}` : ''}`
        if (err.error?.['errors']) {
          for (const cmp in err.error?.['errors'])
            message += ` ${cmp}: ${err.error?.['errors'][cmp]}.`
        }
        break;
    }
    this.notify.add(message)
  }
  imageErrorHandler(event: Event, item: any) {
    (event.target as HTMLImageElement).src = `/images/user-not-found-${item.sexo === 'H' ? 'male' : 'female'}.png`
  }
  //#endregion

  //#region Paginado
  readonly page = signal({ number: 0, totalPages: 0, totalRows: 0, rowsPerPage: 8 })
  load(page: number = -1) {
    if (page < 0) page = this.page().number
    const rows = this.page().rowsPerPage
    this.dao.page(page, rows).subscribe({
      next: data => {
        this.page.set({ number: data.page, totalPages: data.pages, totalRows: data.rows, rowsPerPage: rows })
        this.Listado.set(data.list);
        this.Modo.set('list');
      },
      error: err => this.handleError(err)
    })
  }
  pageChange(page: number = 0) {
    this.router.navigate([], { queryParams: { page } })
  }
  //#endregion

}
