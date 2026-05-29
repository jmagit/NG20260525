import { ApplicationConfig, LOCALE_ID, provideBrowserGlobalErrorListeners } from '@angular/core';
import { ActivatedRouteSnapshot, BaseRouteReuseStrategy, provideRouter, RouteReuseStrategy, withComponentInputBinding } from '@angular/router';

// Cargar idioma
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
import localeEsExtra from '@angular/common/locales/extra/es';
registerLocaleData(localeEs, 'es', localeEsExtra);

import { routes } from './app.routes';
import { ERROR_LEVEL } from '@my/library';
import { environment } from 'src/environments/environment';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptors, withInterceptorsFromDi } from '@angular/common/http';
import { ajaxWaitInterceptor } from './layout';
import { AuthInterceptor } from './security';

class NotRouteReuseStrategy extends BaseRouteReuseStrategy {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  override shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean { return false; }
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withComponentInputBinding()),
    {provide: RouteReuseStrategy, useClass: NotRouteReuseStrategy},
    // LoggerService,
    {provide: ERROR_LEVEL, useValue: environment.ERROR_LEVEL},
    { provide: LOCALE_ID, useValue: 'es-ES' }, // Establecer idioma por defecto,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true, },
    provideHttpClient(withInterceptorsFromDi(), withInterceptors([ ajaxWaitInterceptor ]), )
  ]
};
