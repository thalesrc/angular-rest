import { NgModule, ModuleWithProviders, Provider } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { BASE_URL, REST_HANDLERS, BASE_HEADERS } from './tokens';
import { HandlersOf, HeadersParam, HeadersInjector } from './types';

interface RootConfiguration {
  baseUrl?: string;
  handlers?: HandlersOf<null>;
  baseHeaders?: HeadersParam;
}

@NgModule({
  imports: [
    HttpClientModule
  ],
  providers: [
    {provide: BASE_URL, useValue: ''},
    {provide: REST_HANDLERS, useValue: [], multi: true},
    {provide: BASE_HEADERS, useValue: [], multi: true}
  ],
  exports: [
    HttpClientModule
  ]
})
export class RestModule {
  public static forRoot({ baseUrl = '', handlers = [], baseHeaders = [] }: RootConfiguration = {}): ModuleWithProviders {
    return {
      ngModule: RestModule,
      providers: [
        {provide: BASE_URL, useValue: baseUrl},
        {provide: REST_HANDLERS, useValue: handlers, multi: true},
        {provide: BASE_HEADERS, useValue: baseHeaders, multi: true}
      ]
    };
  }
}
