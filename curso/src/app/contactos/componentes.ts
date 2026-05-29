import { DatePipe } from '@angular/common';
import { Component, OnChanges, OnDestroy, SimpleChanges, OnInit, input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, ActivatedRoute, Router, ParamMap } from '@angular/router';
import { Subscription } from 'rxjs';
import { ContactosViewModelService } from './servicios';
import { TypeValidator, ErrorMessagePipe } from 'src/lib/my-library';
import { Paginator } from '../common-component';

@Component({
    selector: 'app-contactos-list',
    templateUrl: './tmpl-list.html',
    styleUrls: ['./componentes.css'],
    imports: [RouterLink, Paginator]
})
export class ContactosList implements OnChanges, OnDestroy {
  readonly page = input(0);

  constructor(public VM: ContactosViewModelService) { }

  ngOnChanges(_changes: SimpleChanges): void {
    this.VM.load(this.page())
  }

  ngOnDestroy(): void { this.VM.clear(); }
}

@Component({
    selector: 'app-contactos-add',
    templateUrl: './tmpl-form.html',
    styleUrls: ['./componentes.css'],
    imports: [FormsModule, TypeValidator, ErrorMessagePipe]
})
export class ContactosAdd implements OnInit {
  constructor(public VM: ContactosViewModelService) { }

  ngOnInit(): void {
    this.VM.add();
  }
}

@Component({
    selector: 'app-contactos-edit',
    templateUrl: './tmpl-form.html',
    styleUrls: ['./componentes.css'],
    imports: [FormsModule, TypeValidator, ErrorMessagePipe]
})
export class ContactosEdit implements OnInit, OnDestroy {
  private obs$?: Subscription;

  constructor(public VM: ContactosViewModelService,
    protected route: ActivatedRoute, protected router: Router) { }

  ngOnInit(): void {
    this.obs$ = this.route.paramMap.subscribe(
      (params: ParamMap) => {
        const id = parseInt(params?.get('id') ?? '');
        if (id) {
          this.VM.edit(id);
        } else {
          this.router.navigate(['/404.html']);
        }
      });
  }
  ngOnDestroy(): void {
    this.obs$!.unsubscribe();
  }
}

@Component({
    selector: 'app-contactos-view',
    templateUrl: './tmpl-view.html',
    styleUrls: ['./componentes.css'],
    imports: [DatePipe]
})
export class ContactosView implements OnChanges {
  readonly id = input<string>();

  constructor(public VM: ContactosViewModelService, protected router: Router) { }

  ngOnChanges(_changes: SimpleChanges): void {
    const id = this.id();
    if (id) {
      this.VM.view(+id);
    } else {
      this.router.navigate(['/404.html']);
    }
  }
}
