import { DatePipe } from '@angular/common';
import { Component, OnChanges, OnDestroy, SimpleChanges, OnInit, input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, ActivatedRoute, Router, ParamMap } from '@angular/router';
import { Subscription } from 'rxjs';
import { LibrosViewModelService } from './servicios';
import { TypeValidator, ErrorMessagePipe } from 'src/lib/my-library';
import { Paginator, FormButtons } from '../common-component';

@Component({
    selector: 'app-libros-list',
    templateUrl: './tmpl-list.html',
    styleUrls: ['./componentes.css'],
    imports: [RouterLink, Paginator]
})
export class LibrosList implements OnChanges, OnDestroy {
  readonly page = input(0);

  constructor(public VM: LibrosViewModelService) { }

  ngOnChanges(_changes: SimpleChanges): void {
    this.VM.load(this.page())
  }

  ngOnDestroy(): void { this.VM.clear(); }
}

@Component({
    selector: 'app-libros-add',
    templateUrl: './tmpl-form.html',
    styleUrls: ['./componentes.css'],
    imports: [FormsModule, TypeValidator, ErrorMessagePipe, FormButtons]
})
export class LibrosAdd implements OnInit {
  constructor(public VM: LibrosViewModelService) { }

  ngOnInit(): void {
    this.VM.add();
  }
}

@Component({
    selector: 'app-libros-edit',
    templateUrl: './tmpl-form.html',
    styleUrls: ['./componentes.css'],
    imports: [FormsModule, TypeValidator, ErrorMessagePipe, FormButtons]
})
export class LibrosEdit implements OnInit, OnDestroy {
  private obs$?: Subscription;

  constructor(public VM: LibrosViewModelService,
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
    selector: 'app-libros-view',
    templateUrl: './tmpl-view.html',
    styleUrls: ['./componentes.css'],
    imports: [DatePipe, RouterLink]
})
export class LibrosView implements OnChanges {
  readonly id = input<string>();

  constructor(public VM: LibrosViewModelService, protected router: Router) { }

  ngOnChanges(_changes: SimpleChanges): void {
    const id = this.id();
    if (id) {
      this.VM.view(+id);
    } else {
      this.router.navigate(['/404.html']);
    }
  }
}
